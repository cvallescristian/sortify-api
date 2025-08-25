import { SpotifyPlaylist, SpotifyTrack } from './types.js';
import { getSpotifyApi } from './client.js';

export async function getUserPlaylists(accessToken: string): Promise<SpotifyPlaylist[]> {
  const api = getSpotifyApi();
  api.setAccessToken(accessToken);
  
  try {
    const response = await api.getUserPlaylists();
    return response.body.items as SpotifyPlaylist[];
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
    return response.body.items.map((item: any) => item.track) as SpotifyTrack[];
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    throw error;
  }
}
