import { getSession } from '../session.js';
import { getSpotifyApi } from '../client.js';
import { SpotifyPlaylist, SpotifyTrack } from '../types.js';

export async function handleMergePlaylists(
  sessionId: string,
  playlistIds: string[],
  name: string,
  description: string
) {
  if (!sessionId) {
    return {
      success: false,
      error: 'Session ID is required',
    };
  }

  if (!playlistIds || playlistIds.length === 0) {
    return {
      success: false,
      error: 'At least one playlist ID is required',
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
    const api = getSpotifyApi();
    api.setAccessToken(session.tokens.access_token);    

    // Create new playlist
    const createResponse = await api.createPlaylist(name.trim(), {
      description: description,
      public: true,
      collaborative: false,
    });

    const newPlaylist = createResponse.body as SpotifyPlaylist;

    // Collect all tracks from the source playlists
    const allTracks: SpotifyTrack[] = [];
    const trackIds = new Set<string>(); // To avoid duplicates

    for (const playlistId of playlistIds) {
      try {
        const tracksResponse = await api.getPlaylistTracks(playlistId);
        const tracks = tracksResponse.body.items
          .map((item: { track: SpotifyTrack | null }) => item.track)
          .filter((track): track is SpotifyTrack => track !== null && !trackIds.has(track.id));

        tracks.forEach((track: SpotifyTrack) => {
          trackIds.add(track.id);
          allTracks.push(track);
        });
      } catch (error) {
        console.error(`Error fetching tracks from playlist ${playlistId}:`, error);
        // Continue with other playlists even if one fails
      }
    }

    // Add tracks to the new playlist (Spotify API allows max 100 tracks per request)
    const batchSize = 100;
    for (let i = 0; i < allTracks.length; i += batchSize) {
      const batch = allTracks.slice(i, i + batchSize);
      const trackUris = batch.map(track => track.uri);
      
      await api.addTracksToPlaylist(newPlaylist.id, trackUris);
    }

    return {
      success: true,
      playlist: newPlaylist,
      tracksAdded: allTracks.length,
      sourcePlaylists: playlistIds.length,
    };
  } catch (error) {
    console.error('Error merging playlists:', error);
    return {
      success: false,
      error: 'Failed to merge playlists',
    };
  }
}
