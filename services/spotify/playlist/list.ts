import { getUserPlaylists } from '../playlist.js';
import { getSession } from '../session.js';

export async function handleListPlaylists(sessionId: string) {
  if (!sessionId) {
    return {
      success: false,
      error: 'Session ID is required',
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
    const playlists = await getUserPlaylists(session.tokens.access_token);
    return {
      success: true,
      playlists,
      count: playlists.length,
    };
  } catch (error) {
    console.error('Error listing playlists:', error);
    return {
      success: false,
      error: 'Failed to fetch playlists',
    };
  }
}
