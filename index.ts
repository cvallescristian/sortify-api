import { Hono } from 'hono';
import { cors } from 'hono/cors';
import auth from './routes/auth.js';

// Load environment variables
import 'dotenv/config';

const app = new Hono();

// Add CORS middleware
app.use('*', cors());

// Mount authentication routes
app.route('/auth', auth);

// Hello World routes
app.get('/', (c) => {
  return c.json({
    message: 'Sortify API is running! 🚀',
    timestamp: new Date().toISOString(),
    runtime: 'Bun + Hono',
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/health', (c) => {
  return c.json({ status: 'healthy', uptime: process.uptime() });
});

// Export for Railway (uses dynamic port)
export default {
  port: process.env.PORT || 3000,
  hostname: '0.0.0.0', // Important for Railway
  fetch: app.fetch,
};
