import { SpotifyRelease } from './types.js';
import { getSpotifyApi } from './client.js';

interface SpotifyAlbum {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
    external_urls: { spotify: string };
  }>;
  album_type: string;
  total_tracks: number;
  release_date: string;
  release_date_precision: string;
  images?: Array<{ url: string; height?: number; width?: number }>;
  external_urls: { spotify: string };
  uri: string;
  type: string;
}

interface SpotifyTrackSimplified {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
    external_urls: { spotify: string };
  }>;
  duration_ms: number;
  external_urls: { spotify: string };
  uri: string;
  type: string;
}

interface SpotifyApi {
  getFollowedArtists(): Promise<{ body: { artists: { items: Array<{ id: string; name: string }> } } }>;
  getArtistAlbums(artistId: string, options: { album_type: string; limit: number; market: string }): Promise<{ body: { items: SpotifyAlbum[] } }>;
  getAlbumTracks(albumId: string): Promise<{ body: { items: SpotifyTrackSimplified[] } }>;
  setAccessToken(token: string): void;
}

export async function getFollowedArtistsReleases(accessToken: string, limit: number = 20): Promise<SpotifyRelease[]> {
  const api = getSpotifyApi() as SpotifyApi;
  api.setAccessToken(accessToken);
  
  try {
    // Get followed artists
    const followedResponse = await api.getFollowedArtists();
    const followedArtists = followedResponse.body.artists.items;
    
    if (followedArtists.length === 0) {
      return [];
    }
    
    // Get new releases for each followed artist
    const allReleases: SpotifyRelease[] = [];
    const seenReleases = new Set<string>(); // To avoid duplicates
    
    for (const artist of followedArtists) {
      try {
        const albumsResponse = await api.getArtistAlbums(artist.id, {
          album_type: 'album,single',
          limit: 10,
          market: 'from_token'
        });
        
        const albums = albumsResponse.body.items;
        
        // Filter for recent releases (last 3 months)
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        
        albums.forEach((album: SpotifyAlbum) => {
          if (album && album.id && !seenReleases.has(album.id)) {
            const releaseDate = new Date(album.release_date);
            if (releaseDate >= threeMonthsAgo) {
              seenReleases.add(album.id);
              allReleases.push({
                id: album.id,
                name: album.name,
                artists: album.artists,
                album_type: album.album_type,
                total_tracks: album.total_tracks,
                release_date: album.release_date,
                release_date_precision: album.release_date_precision,
                images: album.images,
                external_urls: album.external_urls,
                uri: album.uri,
                type: album.type
              });
            }
          }
        });
      } catch (error) {
        console.error(`Error fetching albums for artist ${artist.name}:`, error);
        // Continue with other artists even if one fails
      }
    }
    
    // Sort by release date (newest first) and limit results
    allReleases.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
    
    return allReleases.slice(0, limit);
  } catch (error) {
    console.error('Error fetching followed artists releases:', error);
    throw error;
  }
}

export async function getTrackIdsFromReleases(accessToken: string, releaseIds: string[]): Promise<string[]> {
  const api = getSpotifyApi() as SpotifyApi;
  api.setAccessToken(accessToken);
  
  try {
    const allTrackIds: string[] = [];
    const trackIds = new Set<string>(); // To avoid duplicates
    
    for (const releaseId of releaseIds) {
      try {
        // Get tracks from the album
        const tracksResponse = await api.getAlbumTracks(releaseId);
        const tracks = tracksResponse.body.items;
        
        // Filter out duplicates and add to collection
        tracks.forEach((track: SpotifyTrackSimplified) => {
          if (track && track.id && !trackIds.has(track.id)) {
            trackIds.add(track.id);
            allTrackIds.push(track.id);
          }
        });
      } catch (error) {
        console.error(`Error fetching tracks from release ${releaseId}:`, error);
        // Continue with other releases even if one fails
      }
    }
    
    return allTrackIds;
  } catch (error) {
    console.error('Error fetching track IDs from releases:', error);
    throw error;
  }
}
