import { SpotifyPlaylist, SpotifyTrack } from './types.js';
import { getSpotifyApi } from './client.js';

export async function getUserPlaylists(accessToken: string, searchQuery?: string): Promise<SpotifyPlaylist[]> {
  const api = getSpotifyApi();
  api.setAccessToken(accessToken);
  
  try {
    // Try to get more playlists by using pagination and different parameters
    let allPlaylists: SpotifyPlaylist[] = [];
    let offset = 0;
    const limit = 50;
    let hasMore = true;
    
    // Fetch playlists with pagination to get all available playlists
    while (hasMore) {
      try {
        const response = await api.getUserPlaylists({ 
          limit, 
          offset 
        });
        
        const playlists = response.body.items as SpotifyPlaylist[];
        allPlaylists = [...allPlaylists, ...playlists];
        
        // Check if there are more playlists to fetch
        hasMore = playlists.length === limit;
        offset += limit;
        
        // Safety check to prevent infinite loops
        if (offset > 1000) {
          console.warn('Reached maximum playlist fetch limit');
          break;
        }
      } catch (error) {
        console.error(`Error fetching playlists at offset ${offset}:`, error);
        break;
      }
    }
    
    // Remove duplicates based on playlist ID
    const uniquePlaylists = allPlaylists.filter((playlist, index, self) => 
      index === self.findIndex(p => p.id === playlist.id)
    );
    
    console.log(`Fetched ${uniquePlaylists.length} unique playlists from Spotify API`);
    console.log('Playlist names:', uniquePlaylists.map(p => p.name));
    
    // Filter by search query if provided
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      return uniquePlaylists.filter(playlist => 
        playlist.name.toLowerCase().includes(query) ||
        (playlist.owner && playlist.owner.display_name.toLowerCase().includes(query))
      );
    }
    
    // Sort playlists by name for consistent ordering
    uniquePlaylists.sort((a, b) => a.name.localeCompare(b.name));
    
    return uniquePlaylists;
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    throw error;
  }
}

export async function getPlaylist(accessToken: string, playlistId: string): Promise<SpotifyPlaylist> {
  const api = getSpotifyApi();
  api.setAccessToken(accessToken);
  
  try {
    const response = await api.getPlaylist(playlistId);
    return response.body as SpotifyPlaylist;
  } catch (error) {
    console.error('Error fetching playlist:', error);
    throw error;
  }
}

export async function getPlaylistTracks(accessToken: string, playlistId: string): Promise<SpotifyTrack[]> {
  const api = getSpotifyApi();
  api.setAccessToken(accessToken);
  
  try {
    let allTracks: SpotifyTrack[] = [];
    let offset = 0;
    const limit = 100; // Spotify API max limit per request
    let hasMore = true;
    
    // Fetch all tracks using pagination
    while (hasMore) {
      try {
        const response = await api.getPlaylistTracks(playlistId, {
          limit,
          offset
        });
        
        // Validate response structure
        if (!response.body || !response.body.items || !Array.isArray(response.body.items)) {
          console.error(`Invalid response structure for playlist ${playlistId} at offset ${offset}:`, response.body);
          break;
        }
        
        const tracks = response.body.items
          .map((item: { track: SpotifyTrack | null }) => {
            if (!item || !item.track) {
              console.warn(`Skipping null track item at offset ${offset}:`, item);
              return null;
            }
            return item.track;
          })
          .filter((track): track is SpotifyTrack => track !== null);
        
        allTracks = [...allTracks, ...tracks];
        
        // Check if there are more tracks to fetch
        hasMore = tracks.length === limit;
        offset += limit;
        
        // Add a small delay to avoid rate limiting
        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Safety check to prevent infinite loops
        if (offset > 10000) {
          console.warn('Reached maximum track fetch limit');
          break;
        }
      } catch (error) {
        console.error(`Error fetching tracks at offset ${offset}:`, error);
        break;
      }
    }
    
    console.log(`Fetched ${allTracks.length} tracks from playlist ${playlistId}`);
    return allTracks;
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    throw error;
  }
}

export async function createPlaylistWithTracks(
  accessToken: string,
  name: string,
  trackIds: string[] = [],
  description: string = '',
  saveToLibrary: boolean = false
): Promise<SpotifyPlaylist> {
  const api = getSpotifyApi();
  api.setAccessToken(accessToken);
  
  try {
    
    // Create new playlist
    const createResponse = await api.createPlaylist(name.trim(), {
      description: description.trim(),
      public: true,
      collaborative: false,
    });
    const newPlaylist = createResponse.body as SpotifyPlaylist;

    // Add tracks if provided
    if (trackIds.length > 0) {
      // Convert track IDs to URIs
      const trackUris = trackIds.map(id => `spotify:track:${id}`);
      
      // Add tracks in batches (Spotify API allows max 100 tracks per request)
      const batchSize = 100;
      for (let i = 0; i < trackUris.length; i += batchSize) {
        const batch = trackUris.slice(i, i + batchSize);
        await api.addTracksToPlaylist(newPlaylist.id, batch);
      }
    }

    // Save to library if requested
    if (saveToLibrary) {
      try {
        await api.followPlaylist(newPlaylist.id);
      } catch (error) {
        console.error('Failed to save playlist to library:', error);
        // Don't fail the entire operation if saving to library fails
      }
    }

    return newPlaylist;
  } catch (error) {
    console.error('Error creating playlist with tracks:', error);
    throw error;
  }
}

export async function findPlaylistByName(accessToken: string, name: string): Promise<SpotifyPlaylist | null> {
  const api = getSpotifyApi();
  api.setAccessToken(accessToken);
  
  try {
    // Get all user's playlists using the comprehensive approach
    const playlists = await getUserPlaylists(accessToken);
    
    // Find playlist with exact name match
    const existingPlaylist = playlists.find(playlist => 
      playlist.name.toLowerCase() === name.toLowerCase()
    );
    
    return existingPlaylist || null;
  } catch (error) {
    console.error('Error finding playlist by name:', error);
    throw error;
  }
}

export async function replacePlaylistTracks(
  accessToken: string,
  playlistId: string,
  trackIds: string[]
): Promise<void> {
  const api = getSpotifyApi();
  api.setAccessToken(accessToken);
  
  try {
    // Convert track IDs to URIs
    const trackUris = trackIds.map(id => `spotify:track:${id}`);
    
    // Replace all tracks in the playlist
    await api.replaceTracksInPlaylist(playlistId, trackUris);
  } catch (error) {
    console.error('Error replacing playlist tracks:', error);
    throw error;
  }
}
