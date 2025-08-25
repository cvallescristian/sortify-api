# Spotify OAuth Setup Guide

## Prerequisites

1. Create a Spotify Developer account at https://developer.spotify.com/
2. Create a new app in the Spotify Developer Dashboard

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Spotify API Credentials
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# Redirect URI for OAuth callback
SPOTIFY_REDIRECT_URI=http://localhost:3000/auth/callback

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Spotify App Configuration

1. Go to your Spotify app in the Developer Dashboard
2. Add the redirect URI: `http://localhost:3000/auth/callback`
3. Copy your Client ID and Client Secret to the `.env` file

## Project Structure

The Spotify integration is organized into functional modules:

```
services/spotify/
├── types.ts          # TypeScript interfaces and types
├── config.ts         # Configuration and environment validation
├── auth.ts           # Authentication functions (OAuth flow)
├── user.ts           # User profile management
├── session.ts        # Session management and storage
└── index.ts          # Main export file
```

## API Endpoints

### 1. Initiate Login

```
GET /auth/login
```

Returns:

```json
{
  "success": true,
  "authUrl": "https://accounts.spotify.com/authorize?...",
  "state": "random_state_string"
}
```

### 2. OAuth Callback

```
GET /auth/callback?code=authorization_code&state=state_string
```

Returns:

```json
{
  "success": true,
  "sessionId": "generated_session_id",
  "user": {
    "id": "spotify_user_id",
    "display_name": "User Name",
    "email": "user@example.com",
    "images": [...],
    "country": "US",
    "product": "premium"
  },
  "message": "Login successful! You can now use the sessionId for authenticated requests."
}
```

### 3. Get User Profile

```
GET /auth/profile
Authorization: Bearer <sessionId>
```

Returns:

```json
{
  "success": true,
  "user": {
    "id": "spotify_user_id",
    "display_name": "User Name",
    "email": "user@example.com",
    "images": [...],
    "country": "US",
    "product": "premium"
  }
}
```

### 4. Refresh Token

```
POST /auth/refresh
Authorization: Bearer <sessionId>
```

Returns:

```json
{
  "success": true,
  "sessionId": "new_session_id",
  "message": "Token refreshed successfully"
}
```

### 5. Logout

```
POST /auth/logout
Authorization: Bearer <sessionId>
```

Returns:

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Usage Flow

1. **Frontend calls** `GET /auth/login` to get the authorization URL
2. **User visits** the authorization URL and logs in with Spotify
3. **Spotify redirects** to `/auth/callback` with an authorization code
4. **Backend exchanges** the code for access tokens and creates a session
5. **Frontend receives** the session ID and user information
6. **Frontend uses** the session ID in the Authorization header for subsequent requests

## Architecture

The codebase uses a functional programming approach with:

- **Pure functions**: Each function has a single responsibility and predictable outputs
- **Modular design**: Code is split into focused modules (auth, user, session, config)
- **Type safety**: Comprehensive TypeScript interfaces for all data structures
- **Separation of concerns**: Configuration, authentication, user management, and session handling are separate

## Security Notes

- The current implementation uses in-memory session storage
- For production, use a proper database (Redis, PostgreSQL, etc.)
- Consider implementing session expiration and cleanup
- Add rate limiting and additional security measures
- Use HTTPS in production

## Testing

1. Start the server: `bun run dev`
2. Visit `http://localhost:3000/auth/login` to get the auth URL
3. Follow the OAuth flow
4. Use the returned session ID for authenticated requests
