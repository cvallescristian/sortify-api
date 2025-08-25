import { getSession } from '../session.js';

export function handleProfile(sessionId: string) {
  if (!sessionId) {
    return {
      success: false,
      error: 'Session ID is required. Include Authorization header with Bearer <sessionId>',
    };
  }

  const session = getSession(sessionId);
  if (!session) {
    return {
      success: false,
      error: 'Invalid or expired session',
    };
  }

  return {
    success: true,
    user: session.user,
  };
}
