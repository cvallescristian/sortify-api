import { Session, SpotifyTokens, SpotifyUser } from './types.js';

const sessions = new Map<string, Session>();

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function createSession(tokens: SpotifyTokens, user: SpotifyUser): string {
  const sessionId = generateSessionId();
  sessions.set(sessionId, {
    sessionId,
    tokens,
    user,
    createdAt: Date.now(),
  });
  return sessionId;
}

export function getSession(sessionId: string): Session | undefined {
  return sessions.get(sessionId);
}

export function deleteSession(sessionId: string): boolean {
  return sessions.delete(sessionId);
}

export function getAllSessions(): Session[] {
  return Array.from(sessions.values());
}
