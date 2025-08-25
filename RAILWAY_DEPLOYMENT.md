# Railway Deployment Guide for Sortify API

This guide will walk you through deploying your Sortify API to Railway for production use.

## 🚀 Prerequisites

Before deploying, ensure you have:

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Spotify App Credentials**: Your Spotify Client ID and Client Secret
4. **Environment Variables**: All required environment variables ready

## 📋 Required Environment Variables

Set these environment variables in Railway:

```bash
# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=https://your-railway-app.railway.app/auth/callback

# Application Configuration
NODE_ENV=production
PORT=3000

# Optional: Custom domain (if you have one)
CUSTOM_DOMAIN=your-domain.com
```

### Getting Spotify Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app or use existing one
3. Add your Railway domain to Redirect URIs:
   - `https://your-app-name.railway.app/auth/callback`
4. Copy Client ID and Client Secret

## 🛠️ Deployment Steps

### Step 1: Connect to Railway

1. **Login to Railway**: Go to [railway.app](https://railway.app) and sign in
2. **Create New Project**: Click "New Project"
3. **Connect Repository**: Choose "Deploy from GitHub repo"
4. **Select Repository**: Choose your Sortify API repository
5. **Select Branch**: Choose `main` or your production branch

### Step 2: Configure Environment Variables

1. **Go to Variables Tab**: In your Railway project dashboard
2. **Add Environment Variables**: Add all required variables listed above
3. **Set NODE_ENV**: Ensure it's set to `production`
4. **Update Redirect URI**: Use your Railway app URL

### Step 3: Configure Build Settings

Railway will automatically detect your project configuration from:

- **`railway.json`**: Contains deployment settings
- **`package.json`**: Contains dependencies and scripts
- **`index.ts`**: Main entry point

Your current configuration:
```json
{
  "deploy": {
    "startCommand": "bun index.ts",
    "healthcheckPath": "/health"
  }
}
```

### Step 4: Deploy

1. **Automatic Deployment**: Railway will automatically deploy when you push to your connected branch
2. **Manual Deployment**: You can also trigger manual deployments from the Railway dashboard
3. **Monitor Build**: Watch the build logs for any issues

## 🔧 Configuration Files

### railway.json
```json
{
  "deploy": {
    "startCommand": "bun index.ts",
    "healthcheckPath": "/health"
  }
}
```

### package.json (Key Scripts)
```json
{
  "scripts": {
    "start": "bun index.ts",
    "build": "bun build index.ts --outdir ./dist --target node",
    "type-check": "bun --no-install tsc --noEmit"
  }
}
```

## 🌐 Domain Configuration

### Default Railway Domain
Your app will be available at: `https://your-app-name.railway.app`

### Custom Domain (Optional)
1. **Add Custom Domain**: In Railway dashboard → Settings → Domains
2. **Update Environment Variables**: Set `CUSTOM_DOMAIN` if needed
3. **Update Spotify Redirect URI**: Update to use your custom domain

## 📊 Monitoring & Health Checks

### Health Check Endpoint
Your API includes a health check at `/health`:
```bash
curl https://your-app-name.railway.app/health
```

Response:
```json
{
  "status": "healthy",
  "uptime": 123.456
}
```

### Railway Monitoring
- **Logs**: View real-time logs in Railway dashboard
- **Metrics**: Monitor CPU, memory, and network usage
- **Deployments**: Track deployment history and rollbacks

## 🔄 Continuous Deployment

### Automatic Deployments
Railway automatically deploys when you:
- Push to your connected branch
- Create a new tag
- Manually trigger deployment

### Deployment Strategy
1. **Development**: Use feature branches for development
2. **Staging**: Deploy to staging environment for testing
3. **Production**: Merge to main branch for production deployment

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check if Bun is supported
# Railway supports Bun out of the box
```

#### 2. Environment Variables
```bash
# Verify all required variables are set
SPOTIFY_CLIENT_ID=✓
SPOTIFY_CLIENT_SECRET=✓
SPOTIFY_REDIRECT_URI=✓
NODE_ENV=production
```

#### 3. Port Configuration
```typescript
// Your index.ts should export:
export default {
  port: process.env.PORT || 3000,
  hostname: '0.0.0.0', // Important for Railway
  fetch: app.fetch,
};
```

#### 4. CORS Issues
```typescript
// Ensure CORS is configured for your frontend domain
app.use('*', cors({
  origin: ['https://your-frontend-domain.com'],
  credentials: true,
}));
```

### Debugging Commands

#### Check Application Status
```bash
# Health check
curl https://your-app-name.railway.app/health

# Main endpoint
curl https://your-app-name.railway.app/
```

#### View Logs
```bash
# In Railway dashboard → Deployments → View Logs
# Or use Railway CLI
railway logs
```

## 🔐 Security Best Practices

### Environment Variables
- ✅ Never commit secrets to Git
- ✅ Use Railway's encrypted environment variables
- ✅ Rotate secrets regularly

### API Security
- ✅ Use HTTPS (Railway provides this automatically)
- ✅ Implement proper CORS configuration
- ✅ Validate all input data
- ✅ Use rate limiting (consider adding)

### Spotify Integration
- ✅ Use secure redirect URIs
- ✅ Implement proper session management
- ✅ Handle token refresh properly

## 📈 Scaling

### Railway Scaling Options
1. **Automatic Scaling**: Railway can auto-scale based on traffic
2. **Manual Scaling**: Adjust resources in Railway dashboard
3. **Horizontal Scaling**: Deploy multiple instances

### Performance Optimization
- ✅ Use Bun runtime for better performance
- ✅ Implement caching where appropriate
- ✅ Monitor API response times
- ✅ Optimize database queries (if applicable)

## 🔄 Updates & Maintenance

### Updating Your Application
1. **Push Changes**: Push to your connected branch
2. **Automatic Deployment**: Railway will deploy automatically
3. **Verify Deployment**: Check health endpoint and logs
4. **Rollback if Needed**: Use Railway's rollback feature

### Maintenance Mode
```typescript
// Add maintenance mode if needed
app.use('*', async (c, next) => {
  if (process.env.MAINTENANCE_MODE === 'true') {
    return c.json({ 
      status: 'maintenance', 
      message: 'API is under maintenance' 
    }, 503);
  }
  await next();
});
```

## 📞 Support

### Railway Support
- **Documentation**: [docs.railway.app](https://docs.railway.app)
- **Discord**: [Railway Discord](https://discord.gg/railway)
- **Email**: support@railway.app

### Application Support
- **GitHub Issues**: Report bugs in your repository
- **Logs**: Check Railway logs for debugging
- **Health Checks**: Monitor `/health` endpoint

## 🎉 Success Checklist

Before going live, ensure:

- [ ] All environment variables are set
- [ ] Spotify redirect URI is correct
- [ ] Health check endpoint responds
- [ ] CORS is configured for your frontend
- [ ] Logs show no errors
- [ ] API endpoints are responding correctly
- [ ] Spotify authentication flow works
- [ ] Playlist operations work as expected

## 🚀 Going Live

Once everything is working:

1. **Update Frontend**: Point your frontend to the Railway URL
2. **Test End-to-End**: Test the complete user flow
3. **Monitor**: Keep an eye on logs and metrics
4. **Scale**: Adjust resources as needed based on usage

Your Sortify API is now ready for production! 🎵
