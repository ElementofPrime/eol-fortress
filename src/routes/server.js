// Profit vector: isolates network layer from CLI → predictable tunnel integration
import Fastify from 'fastify';
import { gitRoutes } from './git.js';

const app = Fastify({ logger: true });

// Health check route
app.get('/health', async () => ({
  ok: true,
  service: 'Prime-Ebay API Fortress',
  uptime: process.uptime(),
}));

// Register Git routes
await app.register(gitRoutes);

// Start listener
app
  .listen({ port: 8787, host: '127.0.0.1' })
  .then((addr) => console.log(`✅ Fortress API online at ${addr}`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
