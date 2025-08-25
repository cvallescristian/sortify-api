import { SpotifyUser } from './types.js';
import { getSpotifyApi } from './client.js';

export async function getUserProfile(accessToken: string): Promise<SpotifyUser> {
  const api = getSpotifyApi();
  api.setAccessToken(accessToken);
  
  try {
    // Get comprehensive user profile with all available fields
    const response = await api.getMe();
    const user = response.body as SpotifyUser;
    console.log(user);
    
    // Ensure we have all the required fields
    const enhancedUser: SpotifyUser = {
      id: user.id,
      display_name: user.display_name || 'Unknown User',
      email: user.email,
      images: user.images || [],
      country: user.country,
      product: user.product,
      type: user.type,
      uri: user.uri,
      href: user.href,
      external_urls: user.external_urls,
      followers: user.followers,
      birthdate: user.birthdate,
    };
    
    // Log the user data for debugging
    console.log('Enhanced Spotify user data:', JSON.stringify(enhancedUser, null, 2));
    
    return enhancedUser;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}
