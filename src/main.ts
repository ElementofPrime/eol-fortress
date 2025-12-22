// src/server.ts or main.ts
import Fastify from "fastify";
import { gitRoutes } from "./routes/git.js";

const app = Fastify();
app.register(gitRoutes);
// src/routes/git.ts