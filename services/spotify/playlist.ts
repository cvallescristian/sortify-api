import { SpotifyPlaylist, SpotifyTrack } from './types.js';
import { getSpotifyApi } from './client.js';

export async function getUserPlaylists(accessToken: string, searchQuery?: string): Promise<SpotifyPlaylist[]> {
  const api = getSpotifyApi();
  api.setAccessToken(accessToken);
  
  try {
    const response = await api.getUserPlaylists();
    let playlists = response.body.items as SpotifyPlaylist[];
    
    // Filter by search query if provided
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      playlists = playlists.filter(playlist => 
        playlist.name.toLowerCase().includes(query)
      );
    }
    
    return playlists;
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
    const response = await api.getPlaylistTracks(playlistId);
    return response.body.items
      .map((item: { track: SpotifyTrack | null }) => item.track)
      .filter((track): track is SpotifyTrack => track !== null);
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
    // Get user's playlists
    const response = await api.getUserPlaylists();
    const playlists = response.body.items as SpotifyPlaylist[];
    
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
