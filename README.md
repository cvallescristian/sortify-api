# Sortify API 🎵

A TypeScript API built with Bun and Hono for managing Spotify playlists. Sort, organize, and manage your Spotify playlists with ease.

## Features

- 🚀 Built with **Bun** for lightning-fast performance
- 🎯 **Hono** web framework for clean, type-safe routing
- 🎵 **Spotify Web API** integration
- 🔒 Environment-based configuration
- ✅ Full **TypeScript** support
- 🧪 **ESLint** + **Prettier** code quality
- 🔄 **GitHub Actions** CI/CD pipeline
- ☁️ **Railway** deployment ready

## Tech Stack

- **Runtime**: Bun
- **Framework**: Hono
- **Language**: TypeScript
- **Linting**: ESLint + Prettier
- **Testing**: Bun Test
- **Deployment**: Railway
- **CI/CD**: GitHub Actions

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed on your system
- Spotify Developer Account
- Node.js 18+ (for Railway CLI)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd sortify-api
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Create environment variables**

   ```bash
   cp .env.example .env
   ```

   Add your Spotify credentials:

   ```env
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
   NODE_ENV=development
   ```

4. **Start development server**
   ```bash
   bun run dev
   ```

Your API will be running at `http://localhost:3000`

## Available Scripts

### Development

```bash
bun run dev          # Start with file watching
bun run start        # Start production server
```

### Code Quality

```bash
bun run lint         # Check linting
bun run lint:fix     # Fix linting issues
bun run format       # Format code with Prettier
bun run format:check # Check formatting
```

### Testing & Building

```bash
bun run test         # Run tests
bun run test:watch   # Run tests with file watching
bun run type-check   # TypeScript type checking
bun run build        # Build for production
```

### CI/CD

```bash
bun run ci           # Run all CI checks (lint, format, test, build)
bun run ci:fix       # Fix issues and run all checks
```

## API Endpoints

### Base Endpoints

- `GET /` - API status and information
- `GET /health` - Health check endpoint

### Spotify Endpoints (Coming Soon)

- `GET /playlists/:userId` - Get user playlists
- `POST /sort-playlist` - Sort playlist by criteria
- `POST /copy-playlist` - Copy playlist
- `GET /liked-songs` - Get user's liked songs

## Development Workflow

1. **Before committing, run:**

   ```bash
   bun run ci:fix
   ```

2. **The CI pipeline automatically runs on push/PR:**
   - Linting checks
   - Code formatting validation
   - TypeScript type checking
   - Test execution
   - Build verification
   - Security audit

## Deployment with Railway

### Prerequisites

- [Railway CLI](https://docs.railway.app/develop/cli) installed
- Railway account (free tier available)

### Step-by-Step Deployment

1. **Install Railway CLI**

   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**

   ```bash
   railway login
   ```

3. **Initialize Railway project**

   ```bash
   railway init
   ```

   - Select "Empty Project"
   - Choose your project name

4. **Link your project**

   ```bash
   railway link
   ```

5. **Add environment variables**

   ```bash
   railway variables set SPOTIFY_CLIENT_ID=your_client_id
   railway variables set SPOTIFY_CLIENT_SECRET=your_client_secret
   railway variables set NODE_ENV=production
   ```

   Or add them via Railway dashboard:
   - Go to [railway.app](https://railway.app)
   - Select your project
   - Go to Variables tab
   - Add your environment variables

6. **Deploy your application**

   ```bash
   railway up
   ```

7. **Generate public domain**

   ```bash
   railway domain
   ```

8. **Open your deployed API**
   ```bash
   railway open
   ```

### Railway Configuration

The project includes a `railway.json` file with deployment settings:

```json
{
  "deploy": {
    "startCommand": "bun index.ts",
    "healthcheckPath": "/health"
  }
}
```

### Environment Variables for Production

Set these variables in Railway dashboard or CLI:

```bash
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=https://your-app.up.railway.app/callback
NODE_ENV=production
```

### Deployment URL

After deployment, your API will be available at:
`https://[your-project-name]-production.up.railway.app`

Test endpoints:

- `https://your-url/` - API info
- `https://your-url/health` - Health check

## Project Structure

```
sortify-api/
├── .github/workflows/    # GitHub Actions CI/CD
├── .vscode/             # VS Code settings
├── src/                 # Source code (optional structure)
├── dist/                # Build output
├── index.ts             # Main application file
├── index.test.ts        # Tests
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── .eslintrc.cjs        # ESLint configuration
├── .prettierrc          # Prettier configuration
├── railway.json         # Railway deployment config
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run quality checks: `bun run ci:fix`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you have any questions or issues:

1. Check the [Issues](https://github.com/your-username/sortify-api/issues) page
2. Create a new issue with detailed information
3. For Railway deployment issues, check [Railway Docs](https://docs.railway.app)

## Roadmap

- [ ] Spotify OAuth implementation
- [ ] Playlist sorting algorithms
- [ ] Playlist copying functionality
- [ ] Liked songs management
- [ ] Rate limiting
- [ ] Database integration
- [ ] Advanced filtering options
- [ ] Batch operations

---

Built with ❤️ using Bun, TypeScript, and Hono
