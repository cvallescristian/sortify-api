import { SpotifyTokens, SpotifyUser } from './types.js';

// In-memory session storage (in production, use Redis or database)
const sessions = new Map<string, Session>();

interface Session {
  tokens: SpotifyTokens;
  user: SpotifyUser;
  createdAt: Date;
}

export function createSession(tokens: SpotifyTokens, user: SpotifyUser): string {
  const sessionId = generateSessionId();
  sessions.set(sessionId, {
    tokens,
    user,
    createdAt: new Date(),
  });
  return sessionId;
}

export function getSession(sessionId: string): Session | undefined {
  return sessions.get(sessionId);
}

export function deleteSession(sessionId: string): boolean {
  return sessions.delete(sessionId);
}

// Internal function for generating session IDs
function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
