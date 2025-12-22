// src/routes/git.ts
// Profit vector: hardened local Git introspection; zero network latency or auth prompts.
import { execSync } from "node:child_process";
import { FastifyInstance } from "fastify";
import path from "node:path";

export async function gitRoutes(app: FastifyInstance) {
  app.get("/git/status", async () => {
    try {
      // Ensure we run inside repo root
      const cwd = path.resolve(process.cwd());
      const stdout = execSync("git status --porcelain=2 -b --no-ahead-behind", {
        cwd,
        stdio: "pipe",
      }).toString();
      return { ok: true, stdout, cwd };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  });
}
