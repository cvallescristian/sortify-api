import { findPlaylistByName } from '../playlist.js';
import { getSession } from '../session.js';

export async function handleCheckPlaylistExists(sessionId: string, name: string) {
  if (!sessionId) {
    return {
      success: false,
      error: 'Session ID is required',
    };
  }

  if (!name || name.trim() === '') {
    return {
      success: false,
      error: 'Playlist name is required',
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
    const existingPlaylist = await findPlaylistByName(session.tokens.access_token, name.trim());
    
    return {
      success: true,
      exists: !!existingPlaylist,
      playlist: existingPlaylist,
    };
  } catch (error) {
    console.error('Error checking playlist existence:', error);
    return {
      success: false,
      error: 'Failed to check playlist existence',
    };
  }
}
