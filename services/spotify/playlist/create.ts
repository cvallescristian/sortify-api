import { createPlaylistWithTracks, replacePlaylistTracks } from '../playlist.js';
import { getSession } from '../session.js';

export async function handleCreatePlaylistWithTracks(
  sessionId: string,
  name: string,
  trackIds: string[] = [],
  description: string = '',
  saveToLibrary: boolean = false,
  overrideExisting: boolean = false
) {
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
    let playlist;
    
    if (overrideExisting) {
      // Find existing playlist and replace its tracks
      const { findPlaylistByName } = await import('../playlist.js');
      const existingPlaylist = await findPlaylistByName(session.tokens.access_token, name.trim());
      
      if (existingPlaylist) {
        await replacePlaylistTracks(session.tokens.access_token, existingPlaylist.id, trackIds);
        playlist = existingPlaylist;
      } else {
        // Create new playlist if not found
        playlist = await createPlaylistWithTracks(
          session.tokens.access_token,
          name.trim(),
          trackIds,
          description.trim(),
          saveToLibrary
        );
      }
    } else {
      // Create new playlist
      playlist = await createPlaylistWithTracks(
        session.tokens.access_token,
        name.trim(),
        trackIds,
        description.trim(),
        saveToLibrary
      );
    }

    return {
      success: true,
      playlist,
      tracksAdded: trackIds.length,
      savedToLibrary: saveToLibrary,
      overridden: overrideExisting,
    };
  } catch (error) {
    console.error('Error creating playlist with tracks:', error);
    return {
      success: false,
      error: 'Failed to create playlist',
    };
  }
}
