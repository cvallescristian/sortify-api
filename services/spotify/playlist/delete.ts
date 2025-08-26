import { getSpotifyApi } from '../client.js';
import { getSession } from '../session.js';

export async function handleDeletePlaylist(sessionId: string, playlistId: string) {
  try {
    const session = await getSession(sessionId);
    if (!session) {
      return {
        success: false,
        error: 'Invalid session'
      };
    }

    const api = getSpotifyApi();
    api.setAccessToken(session.tokens.access_token);

    // First, get the playlist details to check ownership
    const playlistResponse = await api.getPlaylist(playlistId);
    const playlist = playlistResponse.body;
    
    // Check if the current user is the owner of the playlist
    const currentUserResponse = await api.getMe();
    const currentUser = currentUserResponse.body;
    
    if (playlist.owner.id === currentUser.id) {
      // User owns the playlist - we need to remove all tracks first, then unfollow
      // Spotify doesn't allow direct deletion of playlists, but we can make them empty
      try {
        // Get all tracks in the playlist
        const tracksResponse = await api.getPlaylistTracks(playlistId);
        const tracks = tracksResponse.body.items;
        
        if (tracks.length > 0) {
          // Remove all tracks from the playlist
          const trackUris = tracks.map((item: any) => item.track.uri);
          await api.removeTracksFromPlaylist(playlistId, trackUris);
        }
      } catch (trackError) {
        console.error('Error removing tracks from playlist:', trackError);
        // Continue with unfollowing even if track removal fails
      }
    }
    
    // Unfollow the playlist (this removes it from the user's library)
    await api.unfollowPlaylist(playlistId);

    return {
      success: true,
      message: playlist.owner.id === currentUser.id 
        ? 'Playlist cleared and removed from library' 
        : 'Playlist removed from library'
    };
  } catch (error) {
    console.error('Error deleting playlist:', error);
    return {
      success: false,
      error: 'Failed to delete playlist'
    };
  }
}
