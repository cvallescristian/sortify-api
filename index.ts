import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// Add CORS middleware
app.use('*', cors());

// Hello World routes
app.get('/', (c) => {
  return c.text('Hello World from Bun + Hono! 🚀');
});

app.get('/json', (c) => {
  return c.json({
    message: 'Hello World',
    timestamp: new Date().toISOString(),
    runtime: 'Bun + Hono',
  });
});

// Export for Bun
export default {
  port: 3000,
  fetch: app.fetch,
};
