import { getSession } from '../session.js';
import { getSpotifyApi } from '../client.js';
import { getPlaylistTracks } from '../playlist.js';
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

  // Validate playlist IDs format (Spotify playlist IDs are 22 characters)
  for (const playlistId of playlistIds) {
    if (!playlistId || typeof playlistId !== 'string' || !/^[A-Za-z0-9]{22}$/.test(playlistId)) {
      return {
        success: false,
        error: `Invalid playlist ID format: ${playlistId}`,
      };
    }
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

  // Validate access token
  if (!session.tokens.access_token || typeof session.tokens.access_token !== 'string') {
    return {
      success: false,
      error: 'Invalid access token',
    };
  }

  try {
    const api = getSpotifyApi();
    api.setAccessToken(session.tokens.access_token);    

    console.log(`Starting merge of ${playlistIds.length} playlists:`, playlistIds);
    console.log(`New playlist name: "${name}"`);

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
    
    console.log('Starting to collect tracks from source playlists...');

    for (const playlistId of playlistIds) {
      try {
        const tracks = await getPlaylistTracks(session.tokens.access_token, playlistId);
        
        // Debug: Log first few tracks to see their structure
        if (tracks.length > 0) {
          console.log(`Sample track from playlist ${playlistId}:`, {
            id: tracks[0].id,
            uri: tracks[0].uri,
            name: tracks[0].name,
            artists: tracks[0].artists?.map(a => a.name)
          });
        }
        
        // Validate tracks before processing
        const validTracks = tracks.filter((track): track is SpotifyTrack => {
          if (!track || !track.id || !track.uri) {
            console.warn(`Skipping invalid track:`, track);
            return false;
          }
          
          // Validate that track.id is a valid base62 string (Spotify track IDs are 22 characters)
          if (!/^[A-Za-z0-9]{22}$/.test(track.id)) {
            console.warn(`Skipping track with invalid ID format: ${track.id}`, track);
            return false;
          }
          
          // Validate that track.uri follows Spotify URI format
          if (!track.uri.startsWith('spotify:track:')) {
            console.warn(`Skipping track with invalid URI format: ${track.uri}`, track);
            return false;
          }
          
          return true;
        });
        
        const uniqueTracks = validTracks.filter((track): track is SpotifyTrack => !trackIds.has(track.id));

        uniqueTracks.forEach((track: SpotifyTrack) => {
          trackIds.add(track.id);
          allTracks.push(track);
        });
        
        console.log(`Collected ${uniqueTracks.length} unique valid tracks from playlist ${playlistId} (total so far: ${allTracks.length})`);
      } catch (error) {
        console.error(`Error fetching tracks from playlist ${playlistId}:`, error);
        // Continue with other playlists even if one fails
      }
    }

    // Add tracks to the new playlist (Spotify API allows max 100 tracks per request)
    const batchSize = 100;
    console.log(`Adding ${allTracks.length} tracks to playlist in batches of ${batchSize}`);
    
    for (let i = 0; i < allTracks.length; i += batchSize) {
      const batch = allTracks.slice(i, i + batchSize);
      
      // Final validation of track URIs before sending to API
      const validTrackUris = batch
        .map(track => track.uri)
        .filter(uri => {
          if (!uri || typeof uri !== 'string') {
            console.warn(`Skipping invalid URI:`, uri);
            return false;
          }
          if (!uri.startsWith('spotify:track:')) {
            console.warn(`Skipping URI with invalid format: ${uri}`);
            return false;
          }
          return true;
        });
      
      if (validTrackUris.length === 0) {
        console.warn(`Batch ${Math.floor(i / batchSize) + 1} has no valid URIs, skipping`);
        continue;
      }
      
      try {
        await api.addTracksToPlaylist(newPlaylist.id, validTrackUris);
        console.log(`Added batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allTracks.length / batchSize)} (${validTrackUris.length} valid tracks)`);
        
        // Add a small delay between batches to avoid rate limiting
        if (i + batchSize < allTracks.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (error) {
        console.error(`Error adding batch ${Math.floor(i / batchSize) + 1}:`, error);
        console.error(`Failed URIs:`, validTrackUris);
        throw error; // Re-throw to fail the entire operation
      }
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
