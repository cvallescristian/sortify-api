export interface SpotifyConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email?: string;
  images?: Array<{ url: string; height?: number; width?: number }>;
  country?: string;
  product?: string;
  type: string;
  uri: string;
  href: string;
  external_urls: { spotify: string };
  followers?: { href: string | null; total: number };
}

export interface Session {
  sessionId: string;
  tokens: SpotifyTokens;
  user: SpotifyUser;
  createdAt: number;
}
