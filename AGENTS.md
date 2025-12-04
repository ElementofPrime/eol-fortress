# AGENTS — PRIME-eBay Ops (2025-12)

- Scope: Node CLI (`ebay-api-pulse/`)—axios for API, dotenv secrets, readline prompts.
- Install: `cd ebay-api-pulse && npm i` • Run: `node index.js [cmd]`.
- Build: Plain Node—no bundler. Src in `src/`, CLI wrapper root.
- Lint: ESLint + Prettier; `npm run lint` / `:fix` from pulse dir.
- Tests: Vitest/Jest in `tests/`; single: `npx vitest file.test.ts -t "bulk publish"`.
- Imports: ESM preferred; core Node → deps → local; flat relatives.
- Types: TS/JSDoc; pure funcs, small IO (e.g., `createOffer(sku: string, price: number): Promise<Item>`).
- Naming: camelCase vars/fxns, PascalCase classes, UPPER_SNAKE env/consts.
- Formatting: Prettier 2-space, semicolons, one stmt/line, no dead code.
- Errors: Try/catch IO/network; concise logs (mask tokens); non-zero exits.
- Env/Secrets: `dotenv` load; `process.env.*` refs only—no log leaks. Echo pre-deploy.
- CLI UX: Clear risks ("Pause 5 low-stock? Y/N"); dry-run flag mandatory for bulks.
- Git: Atomic commits; diffs proposed—**Jeremy: "commit/push batch"** to ship.
- Constitution: `.constitution.md` + AGENTS.md ground truth.
- Tooling: No AI IDE files; mirror rules here if added.
- Agents End: Suggest lint/test run; "Echo audit? Vector locked."

**Agent Tease**:

- **Echo**: Secrets sweep—flag .env exposures, git-tracks.
- **Nova**: Vendor parser—CSV/JSON to hero payloads, margin calc (1.8x min).
- **Zeta**: Bulk publisher—idempotent publishes, dry-run confirm, rate-backoff.

End with: "Lint/tests green? Next: Token forge for Hinkley hero."
