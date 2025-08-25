import { Hono } from 'hono';
import { handleGetLatestReleases, handleGetFollowedArtistsReleases } from '../services/spotify/releases/handler.js';

const releases = new Hono();

// Get latest releases
releases.get('/', async (c) => {
  const sessionId = c.req.header('Authorization')?.replace('Bearer ', '') || '';
  const limitQuery = c.req.query('limit');
  const limit = limitQuery ? parseInt(limitQuery) : undefined;
  const result = await handleGetLatestReleases(sessionId, limit);
  return c.json(result, result.success ? 200 : 401);
});

// Get followed artists releases
releases.get('/followed', async (c) => {
  const sessionId = c.req.header('Authorization')?.replace('Bearer ', '') || '';
  const limitQuery = c.req.query('limit');
  const limit = limitQuery ? parseInt(limitQuery) : undefined;
  const result = await handleGetFollowedArtistsReleases(sessionId, limit);
  return c.json(result, result.success ? 200 : 401);
});

export default releases;
