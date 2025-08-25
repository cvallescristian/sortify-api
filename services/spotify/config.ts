import { SpotifyConfig } from './types.js';

export function getSpotifyConfig(): SpotifyConfig {
  // Debug logging
  console.log('Environment variables check:');
  console.log('SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID ? 'SET' : 'NOT SET');
  console.log('SPOTIFY_CLIENT_SECRET:', process.env.SPOTIFY_CLIENT_SECRET ? 'SET' : 'NOT SET');
  console.log('SPOTIFY_REDIRECT_URI:', process.env.SPOTIFY_REDIRECT_URI ? 'SET' : 'NOT SET');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('SPOTIFY')));
  
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing Spotify credentials in environment variables');
  }
  
  return { clientId, clientSecret, redirectUri };
}

export function getWebsiteUrl(): string {
  const websiteUrl = process.env.WEBSITE_URL;
  if (!websiteUrl) {
    throw new Error('Missing WEBSITE_URL in environment variables');
  }
  return websiteUrl;
}

export const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email', 
  'user-read-playback-state',
  'user-modify-playback-state',
  'playlist-read-private',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-follow-read',
  'user-library-modify'
];
