# AGENTS — EOL‑eBay quick ops (2025-12)

- Scope: Node CLI under `ebay-api-pulse/` using axios, dotenv, readline.
- Install: `cd ebay-api-pulse && npm i` • Run: `node index.js` (or configured entry).
- Build: none (plain Node). Prefer keeping source in `src/` with a small CLI wrapper.
- Lint: add ESLint + Prettier; then `npm run lint` / `npm run lint:fix` from `ebay-api-pulse/`.
- Tests: not configured. Recommended Vitest or Jest in `ebay-api-pulse/`.
- Single-test (Vitest example): `npx vitest run path/to/file.test.ts -t "case name"`.
- Single-test (Jest example): `npx jest path/to/file.test.ts -t "case name"`.
- Imports: prefer ESM `import`/`export`; group Node core → npm deps → local modules; avoid deep relative chains.
- Types: favor TypeScript or JSDoc typedefs; keep function inputs/outputs clearly typed and small/pure.
- Naming: camelCase for variables/functions, PascalCase for classes/types, UPPER_SNAKE for hard constants/env keys.
- Formatting: Prettier-style, 2-space indent, semicolons consistent, one statement per line, no unused variables.
- Error handling: always wrap network/IO in `try/catch`; log concise context; return non-zero exit codes on failure.
- Env/secrets: load via `dotenv`; never commit `.env*`; reference `process.env.*` only, no secrets in logs.
- CLI UX: clear prompts and messages; safe defaults; avoid destructive actions without confirmation.
- Git: small, reviewable batches; propose diffs; **never commit or push** unless Jeremy says “commit/push this batch”.
- Constitution: follow `.specify/memory/constitution.md` + this file as ground truth for agents.
- Tooling: no Cursor or Copilot instruction files in this repo; if added later, mirror their rules here.
- Agents should end work by suggesting: run lint/tests (once configured) before shipping any changes.
