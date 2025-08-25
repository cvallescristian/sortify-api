import { SpotifyUser } from './types.js';
import { getSpotifyApi } from './client.js';

export async function getUserProfile(accessToken: string): Promise<SpotifyUser> {
  const api = getSpotifyApi();
  api.setAccessToken(accessToken);
  const response = await api.getMe();
  return response.body as SpotifyUser;
}
