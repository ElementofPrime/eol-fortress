# AGENTS – ebay-api-fortress / Prime‑eBay CLI

1. **Install & env**: `npm install`; copy `.env.example` → `.env` (never commit).
2. **Run CLI**: `node index.js` (also exposed as bin `prime-ebay`).
3. **Lint all**: `npm run lint`; **autofix**: `npm run lint:fix`.
4. **Format**: `npm run format` (check) / `npm run format:fix` (write).
5. **Test all**: `npm test` or `npm run test` (Vitest).
6. **Watch tests**: `npm run test:watch`.
7. **Single file test**: `npx vitest run tests/cli.smoke.test.js`.
8. **Single test case**: `npx vitest run tests/cli.smoke.test.js -t "starts and exits cleanly"`.
9. **Node / modules**: Node >=20, ESM (`"type": "module"`); use `import` / `export` only.
10. **Imports**: Group as [node builtins (`node:path`)], external deps, then local files; prefer named exports.
11. **Formatting**: Prettier enforced – 2 spaces, 100 col width, single quotes, semicolons, trailing commas.
12. **Types & naming**: JS only; functions/vars camelCase (`getRuntimeEnv`, `runCli`); files kebab-or-lowerCamel; constants UPPER_SNAKE.
13. **Lint rules**: ESLint recommended; no unused vars/args (prefix intentionally unused with `_`); `console` allowed in CLI/logging only.
14. **Error handling**: CLI entrypoints wrap `main()` in `try/catch`, log friendly message, dump full error only when `DEBUG` truthy, then `process.exit(1)`.
15. **Env handling**: Load config via `getRuntimeEnv` / `getEbayEnv` from `ebay-api-fortress/src/config/env.js`; do **not** call `dotenv` directly elsewhere.
16. **Tests style**: Vitest BDD (`describe`/`it`/`expect`), async tests `await` promises; prefer small smoke/integration tests that exercise the CLI via `node` child processes.
17. **Side effects**: Keep modules side-effect free except CLI entry (`index.js`, future command files); expose core logic as reusable functions.
18. **Security**: Never log secrets or commit `.env`; treat `EBAY_*` vars as sensitive; rotate if leaked.
19. **Specification**: For new work, align with `.specify` templates (constitution, plan, spec, tasks) before coding.
20. **Meta**: No Cursor/Copilot rules present; this file + `ebay-api-fortress/README.md` are the source of truth for agents.
