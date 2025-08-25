import { refreshAccessToken } from '../auth.js';
import { getSession, createSession, deleteSession } from '../session.js';

export async function handleRefresh(sessionId: string) {
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
    // Refresh the access token
    const newTokens = await refreshAccessToken(session.tokens.refresh_token);

    // Update session with new tokens
    const updatedSessionId = createSession(newTokens, session.user);

    // Remove old session
    deleteSession(sessionId);

    return {
      success: true,
      sessionId: updatedSessionId,
      message: 'Token refreshed successfully',
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    return {
      success: false,
      error: 'Failed to refresh token',
    };
  }
}
