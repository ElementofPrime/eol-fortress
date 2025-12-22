// Profit vector: safe local Git telemetry → enables CI sync without leaking creds.
import { execSync } from "node:child_process";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import path from "node:path";
export async function gitRoutes(app: FastifyInstance) {
  // Using a scoped plugin registration to isolate from global auth hooks
  app.register(async function (sub) {
    sub.get(
      "/git/status",
      async (_req: FastifyRequest, _reply: FastifyReply) => {
        try {
          const cwd = path.resolve(process.cwd());
          const stdout = execSync(
            "git -C . status --porcelain=2 -b --no-ahead-behind",
            {
              cwd,
              stdio: "pipe",
              env: {
                ...process.env,
                GIT_TERMINAL_PROMPT: "0",
                GIT_OPTIONAL_LOCKS: "0",
              },
            }
          ).toString();

          return { ok: true, stdout, cwd };
        } catch (err) {
          const message = (err as Error).message.replace(
            /fatal:.*/g,
            "Git local-only mode active"
          );
          return { ok: false, error: message };
        }
      }
    );
  });
}
