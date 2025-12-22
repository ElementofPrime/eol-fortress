// src/routes/git.ts
// Profit vector: enables Prime to track code drift → prevents merge loss
import { execSync } from "node:child_process";
import { FastifyInstance } from "fastify";

export async function gitRoutes(app: FastifyInstance) {
  app.get("/git/status", async () => {
    try {
      const stdout = execSync("git status --porcelain=2 -b").toString();
      return { ok: true, stdout };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  });
}
