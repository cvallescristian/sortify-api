import { getLatestReleases, getFollowedArtistsReleases } from '../releases.js';
import { getSession } from '../session.js';

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
