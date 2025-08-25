import { Hono } from 'hono';
import { handleLogin } from '../services/spotify/auth/login.js';
import { handleCallback } from '../services/spotify/auth/callback.js';
import { handleProfile } from '../services/spotify/auth/profile.js';
import { handleRefresh } from '../services/spotify/auth/refresh.js';
import { handleLogout } from '../services/spotify/auth/logout.js';
import { getWebsiteUrl } from '../services/spotify/config.js';

const auth = new Hono();

// Route to initiate Spotify login
auth.get('/login', (c) => {
  const result = handleLogin();
  return c.json(result, result.success ? 200 : 500);
});

// Spotify OAuth callback
auth.get('/callback', async (c) => {
  const code = c.req.query('code') || '';
  const error = c.req.query('error');
  
  const result = await handleCallback(code, error);
  
  if (result.success && result.redirectUrl) {
    return c.redirect(result.redirectUrl);
  } else {
    const websiteUrl = getWebsiteUrl();
    return c.redirect(`${websiteUrl}/auth/callback?error=${result.error || 'unknown_error'}`);
  }
});

// Get current user profile (requires session)
auth.get('/profile', (c) => {
  const sessionId = c.req.header('Authorization')?.replace('Bearer ', '') || '';
  const result = handleProfile(sessionId);
  return c.json(result, result.success ? 200 : 401);
});

// Refresh access token
auth.post('/refresh', async (c) => {
  const sessionId = c.req.header('Authorization')?.replace('Bearer ', '') || '';
  const result = await handleRefresh(sessionId);
  return c.json(result, result.success ? 200 : 401);
});

// Logout (remove session)
auth.post('/logout', (c) => {
  const sessionId = c.req.header('Authorization')?.replace('Bearer ', '') || '';
  const result = handleLogout(sessionId);
  return c.json(result);
});

// Debug endpoint to test user profile data
auth.get('/debug-profile', (c) => {
  const sessionId = c.req.header('Authorization')?.replace('Bearer ', '') || '';
  const result = handleProfile(sessionId);
  return c.json(result, result.success ? 200 : 401);
});

export default auth;
