import { Hono } from 'hono';
import { handleGetLatestReleases, handleGetFollowedArtistsReleases, handleCreatePlaylistFromReleases } from '../services/spotify/releases/handler.js';

const releases = new Hono();

// Get latest releases
releases.get('/', async (c) => {
  const sessionId = c.req.header('Authorization')?.replace('Bearer ', '') || '';
  const limit = c.req.query('limit');
  const limitNum = limit ? parseInt(limit) : undefined;
  const result = await handleGetLatestReleases(sessionId, limitNum);
  return c.json(result, result.success ? 200 : 401);
});

// Get followed artists releases
releases.get('/followed', async (c) => {
  const sessionId = c.req.header('Authorization')?.replace('Bearer ', '') || '';
  const limit = c.req.query('limit');
  const limitNum = limit ? parseInt(limit) : undefined;
  const result = await handleGetFollowedArtistsReleases(sessionId, limitNum);
  return c.json(result, result.success ? 200 : 401);
});

// Create playlist from releases
releases.post('/create-playlist', async (c) => {
  const sessionId = c.req.header('Authorization')?.replace('Bearer ', '') || '';
  const body = await c.req.json();
  
  const { releaseIds, name, description } = body;
  
  if (!releaseIds || !Array.isArray(releaseIds) || releaseIds.length === 0) {
    return c.json({
      success: false,
      error: 'releaseIds array is required with at least one release ID'
    }, 400);
  }
  
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return c.json({
      success: false,
      error: 'name is required and must be a non-empty string'
    }, 400);
  }
  
  const result = await handleCreatePlaylistFromReleases(
    sessionId,
    releaseIds,
    name,
    description || ''
  );
  
  return c.json(result, result.success ? 201 : 400);
});

export default releases;
