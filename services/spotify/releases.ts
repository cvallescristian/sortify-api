import { SpotifyRelease, SpotifyTrack } from './types.js';
import { getSpotifyApi } from './client.js';

export async function getLatestReleases(accessToken: string, limit: number = 20): Promise<SpotifyRelease[]> {
  const api = getSpotifyApi();
  api.setAccessToken(accessToken);
  
  try {
    // Get new releases from Spotify
    const response = await api.getNewReleases({ limit });
    const releases = response.body.albums.items as SpotifyRelease[];
    
    return releases;
  } catch (error) {
    console.error('Error fetching latest releases:', error);
    throw error;
  }
}

export async function getFollowedArtistsReleases(accessToken: string, limit: number = 20): Promise<SpotifyRelease[]> {
  const api = getSpotifyApi();
  api.setAccessToken(accessToken);
  
  try {
    // Get user's followed artists
    const followedResponse = await api.getFollowedArtists({ limit: 50 });
    const followedArtists = followedResponse.body.artists.items;
    
    if (followedArtists.length === 0) {
      return [];
    }
    
    // Get new releases from followed artists
    const artistIds = followedArtists.map(artist => artist.id);
    const releases: SpotifyRelease[] = [];
    
    // Get new releases and filter by followed artists
    const newReleasesResponse = await api.getNewReleases({ limit: 50 });
    const allReleases = newReleasesResponse.body.albums.items as SpotifyRelease[];
    
    // Filter releases by followed artists
    for (const release of allReleases) {
      const hasFollowedArtist = release.artists.some(artist => 
        artistIds.includes(artist.id)
      );
      
      if (hasFollowedArtist) {
        releases.push(release);
      }
      
      if (releases.length >= limit) {
        break;
      }
    }
    
    return releases;
  } catch (error) {
    console.error('Error fetching followed artists releases:', error);
    throw error;
  }
}

export async function getTracksFromReleases(accessToken: string, releaseIds: string[]): Promise<string[]> {
  const api = getSpotifyApi();
  api.setAccessToken(accessToken);
  
  try {
    const allTrackUris: string[] = [];
    const trackIds = new Set<string>(); // To avoid duplicates
    
    for (const releaseId of releaseIds) {
      try {
        // Get tracks from the album
        const tracksResponse = await api.getAlbumTracks(releaseId);
        const tracks = tracksResponse.body.items;
        
        // Filter out duplicates and add to collection
        tracks.forEach((track: any) => {
          if (track && track.id && !trackIds.has(track.id)) {
            trackIds.add(track.id);
            allTrackUris.push(track.uri);
          }
        });
      } catch (error) {
        console.error(`Error fetching tracks from release ${releaseId}:`, error);
        // Continue with other releases even if one fails
      }
    }
    
    return allTrackUris;
  } catch (error) {
    console.error('Error fetching tracks from releases:', error);
    throw error;
  }
}
