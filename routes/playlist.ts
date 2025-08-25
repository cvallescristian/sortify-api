import { Hono } from 'hono';
import { handleListPlaylists } from '../services/spotify/playlist/list.js';
import { handleGetPlaylist } from '../services/spotify/playlist/detail.js';
import { handleGetPlaylistTracks } from '../services/spotify/playlist/tracks.js';

const playlist = new Hono();

// Get user's playlists
playlist.get('/', async (c) => {
  const sessionId = c.req.header('Authorization')?.replace('Bearer ', '') || '';
  const result = await handleListPlaylists(sessionId);
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

export default playlist;
