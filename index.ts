// index.ts
// Profit vector: unified local API + tunnel health endpoints = faster integration, lower ops cost.
import Fastify from "fastify";
import { gitRoutes } from "./src/routes/git.js";

const app = Fastify({ logger: true });

// Base health check route
app.get("/health", async () => ({
  ok: true,
  service: "Prime-eBay CLI Fortress",
  uptime: process.uptime(),
}));

// Register Git route
app.register(gitRoutes);

// Start the server
app.listen({ port: 8787, host: "127.0.0.1" })
  .then((address) => console.log(`✅ Fortress API running at ${address}`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
