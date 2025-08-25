import { getPlaylistTracks } from '../playlist.js';
import { getSession } from '../session.js';

export async function handleGetPlaylistTracks(sessionId: string, playlistId: string) {
  if (!sessionId) {
    return {
      success: false,
      error: 'Session ID is required',
    };
  }

  if (!playlistId) {
    return {
      success: false,
      error: 'Playlist ID is required',
    };
  }

  const session = getSession(sessionId);
  if (!session) {
    return {
      success: false,
      error: 'Invalid or expired session',
    };
  }

  try {
    const tracks = await getPlaylistTracks(session.tokens.access_token, playlistId);
    return {
      success: true,
      tracks,
      count: tracks.length,
    };
  } catch (error) {
    console.error('Error getting playlist tracks:', error);
    return {
      success: false,
      error: 'Failed to fetch playlist tracks',
    };
  }
}
