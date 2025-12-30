# Repository Guidelines

## Project Structure & Module Organization

- `index.js` is the CLI entrypoint (also exposed as `prime-ebay`).
- `src/` holds core logic: `src/cli.js` for CLI wiring, `src/lib/` for reusable modules, `src/config/` for environment handling, and `src/routes/` for server routes.
- `tests/` contains Vitest suites (CLI smoke, auth, margin). Name tests `*.test.js`.
- `docs/` and `prompts/` store reference docs and planning prompts; `types/` holds shared type declarations; `tunnel/` contains OpenAPI and server assets.
- Shared agent memory and coordination live in `docs/prime-continuity.md` and `docs/agent-handbook.md`.
- `dist/` is the build output (generated).

## Build, Test, and Development Commands

- `npm start` or `node index.js`: run the CLI locally.
- `npm run build`: compile TypeScript (`tsc`).
- `npm test`: run Vitest in CI mode.
- `npm run test:watch`: watch mode for local iteration.
- `npm run lint` / `npm run lint:fix`: ESLint checks and autofix.
- `npm run format` / `npm run format:fix`: Prettier check/write.
- `npm run check`: run lint + tests.

## Coding Style & Naming Conventions

- Node >=20, ESM-only (`type: module`); use `import`/`export`.
- Prettier enforces 2-space indentation, 100-column width, single quotes, trailing commas, semicolons.
- Favor `camelCase` for variables/functions, `UPPER_SNAKE` for constants. Keep file names lowercase or kebab-case.

## Testing Guidelines

- Framework: Vitest with `describe`/`it`/`expect`.
- Prefer integration-style CLI tests using child processes when relevant.
- Run a focused test: `npx vitest run tests/cli.smoke.test.js`.

## Commit & Pull Request Guidelines

- Commit history favors short, lowercase, imperative messages (e.g., `sync`, `cleanup review`). Keep messages concise and specific.
- PRs should include: a brief summary, rationale, how to run tests, and any behavior changes. Add screenshots only for CLI output changes.

## Security & Configuration Tips

- Copy `.env.example` to `.env` and never commit secrets.
- Treat all `EBAY_*` values as sensitive and avoid logging them.
