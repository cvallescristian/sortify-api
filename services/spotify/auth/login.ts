import { generateAuthUrl } from '../auth.js';

export function handleLogin() {
  try {
    const { authUrl, state } = generateAuthUrl();
    return {
      success: true,
      authUrl,
      state,
    };
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return {
      success: false,
      error: 'Failed to generate authorization URL',
    };
  }
}
