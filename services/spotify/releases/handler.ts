import { getLatestReleases, getFollowedArtistsReleases, getTracksFromReleases } from '../releases.js';
import { getSession } from '../session.js';
import { getSpotifyApi } from '../client.js';

export async function handleGetLatestReleases(sessionId: string, limit?: number) {
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
    const releases = await getLatestReleases(session.tokens.access_token, limit || 20);
    return {
      success: true,
      releases,
      count: releases.length,
    };
  } catch (error) {
    console.error('Error getting latest releases:', error);
    return {
      success: false,
      error: 'Failed to fetch latest releases',
    };
  }
}

export async function handleGetFollowedArtistsReleases(sessionId: string, limit?: number) {
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
    const releases = await getFollowedArtistsReleases(session.tokens.access_token, limit || 20);
    return {
      success: true,
      releases,
      count: releases.length,
    };
  } catch (error) {
    console.error('Error getting followed artists releases:', error);
    return {
      success: false,
      error: 'Failed to fetch followed artists releases',
    };
  }
}

export async function handleCreatePlaylistFromReleases(
  sessionId: string,
  releaseIds: string[],
  name: string,
  description: string
) {
  if (!sessionId) {
    return {
      success: false,
      error: 'Session ID is required',
    };
  }

  if (!releaseIds || releaseIds.length === 0) {
    return {
      success: false,
      error: 'At least one release ID is required',
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

    // Get user ID for creating the playlist
    const userResponse = await api.getMe();
    const userId = userResponse.body.id;

    // Create new playlist
    const createResponse = await (api as any).createPlaylist(userId, name.trim());

    const newPlaylist = createResponse.body;

    // Get track URIs from the selected releases
    const trackUris = await getTracksFromReleases(session.tokens.access_token, releaseIds);

    if (trackUris.length === 0) {
      return {
        success: false,
        error: 'No tracks found in the selected releases',
      };
    }

    // Add tracks to the new playlist (Spotify API allows max 100 tracks per request)
    const batchSize = 100;
    for (let i = 0; i < trackUris.length; i += batchSize) {
      const batch = trackUris.slice(i, i + batchSize);
      await api.addTracksToPlaylist(newPlaylist.id, batch);
    }

    return {
      success: true,
      playlist: newPlaylist,
      tracksAdded: trackUris.length,
      sourceReleases: releaseIds.length,
    };
  } catch (error) {
    console.error('Error creating playlist from releases:', error);
    return {
      success: false,
      error: 'Failed to create playlist from releases',
    };
  }
}
