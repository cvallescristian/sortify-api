import { SpotifyConfig } from './types.js';

export function getSpotifyConfig(): SpotifyConfig {
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
  'playlist-modify-private'
];
