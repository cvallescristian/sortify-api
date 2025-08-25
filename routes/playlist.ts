import { Hono } from 'hono';
import { handleListPlaylists } from '../services/spotify/playlist/list.js';
import { handleGetPlaylist } from '../services/spotify/playlist/detail.js';
import { handleGetPlaylistTracks } from '../services/spotify/playlist/tracks.js';
import { handleMergePlaylists } from '../services/spotify/playlist/merge.js';

const playlist = new Hono();

// Get user's playlists (with optional search)
playlist.get('/', async (c) => {
  const sessionId = c.req.header('Authorization')?.replace('Bearer ', '') || '';
  const searchQuery = c.req.query('search') || undefined;
  const result = await handleListPlaylists(sessionId, searchQuery);
  return c.json(result, result.success ? 200 : 401);
});

// Get specific playlist details
playlist.get('/:playlistId', async (c) => {
  const sessionId = c.req.header('Authorization')?.replace('Bearer ', '') || '';
  const playlistId = c.req.param('playlistId');
  const result = await handleGetPlaylist(sessionId, playlistId);
  return c.json(result, result.success ? 200 : 401);
});

// Get playlist tracks
playlist.get('/:playlistId/tracks', async (c) => {
  const sessionId = c.req.header('Authorization')?.replace('Bearer ', '') || '';
  const playlistId = c.req.param('playlistId');
  const result = await handleGetPlaylistTracks(sessionId, playlistId);
  return c.json(result, result.success ? 200 : 401);
});

// Merge playlists into a new playlist
playlist.post('/merge', async (c) => {
  const sessionId = c.req.header('Authorization')?.replace('Bearer ', '') || '';
  const body = await c.req.json();
  
  const { playlistIds, name, description } = body;
  
  if (!playlistIds || !Array.isArray(playlistIds) || playlistIds.length === 0) {
    return c.json({
      success: false,
      error: 'playlistIds array is required with at least one playlist ID'
    }, 400);
  }
  
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return c.json({
      success: false,
      error: 'name is required and must be a non-empty string'
    }, 400);
  }
  
  const result = await handleMergePlaylists(
    sessionId,
    playlistIds,
    name,
    description || ''
  );
  
  return c.json(result, result.success ? 201 : 400);
});

export default playlist;
