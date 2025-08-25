import { deleteSession } from '../session.js';

export function handleLogout(sessionId: string) {
  if (sessionId) {
    deleteSession(sessionId);
  }

  return {
    success: true,
    message: 'Logged out successfully',
  };
}
