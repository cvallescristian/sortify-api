import SpotifyWebApi from 'spotify-web-api-node';
import { SpotifyConfig } from './types.js';
import { getSpotifyConfig } from './config.js';

let spotifyApi: SpotifyWebApi | null = null;

export function getSpotifyApi(): SpotifyWebApi {
  if (!spotifyApi) {
    const config = getSpotifyConfig();
    spotifyApi = new SpotifyWebApi({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectUri,
    });
  }
  return spotifyApi;
}
