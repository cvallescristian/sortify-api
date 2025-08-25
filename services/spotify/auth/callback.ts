import { getTokensFromCode } from '../auth.js';
import { getUserProfile } from '../user.js';
import { createSession } from '../session.js';
import { getWebsiteUrl } from '../config.js';

export async function handleCallback(code: string, error?: string) {
  try {
    if (error) {
      return { success: false, error };
    }

    if (!code) {
      return { success: false, error: 'Authorization code is required' };
    }

    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);

    // Get user profile
    const user = await getUserProfile(tokens.access_token);

    // Create session
    const sessionId = createSession(tokens, user);

    // Return success with session data
    return {
      success: true,
      sessionId,
      user,
      redirectUrl: `${getWebsiteUrl()}/auth/callback?success=true&sessionId=${sessionId}&user=${encodeURIComponent(JSON.stringify(user))}`,
    };
  } catch (error) {
    console.error('Error in callback:', error);
    return {
      success: false,
      error: 'Failed to complete authentication',
      redirectUrl: `${getWebsiteUrl()}/auth/callback?error=auth_failed`,
    };
  }
}
