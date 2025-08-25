import { SpotifyTokens } from './types.js';
import { getSpotifyApi } from './client.js';
import { SPOTIFY_SCOPES } from './config.js';

export function generateAuthUrl(state?: string) {
  const api = getSpotifyApi();
  return {
    authUrl: api.createAuthorizeURL(SPOTIFY_SCOPES, state || ''),
    state: state || Math.random().toString(36).substring(2, 15),
  };
}

export async function getTokensFromCode(code: string): Promise<SpotifyTokens> {
  const api = getSpotifyApi();
  const data = await api.authorizationCodeGrant(code);
  
  return {
    access_token: data.body.access_token,
    refresh_token: data.body.refresh_token,
    expires_in: data.body.expires_in,
    token_type: data.body.token_type,
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokens> {
  const api = getSpotifyApi();
  api.setRefreshToken(refreshToken);
  const data = await api.refreshAccessToken();
  
  return {
    access_token: data.body.access_token,
    refresh_token: refreshToken,
    expires_in: data.body.expires_in,
    token_type: data.body.token_type,
  };
}
