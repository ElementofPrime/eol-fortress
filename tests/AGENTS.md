# tests/ Directory Guide

## Overview
`tests/` holds Vitest suites for the CLI and core business logic. Tests run in Node (see `vitest.config.mjs`).

## What’s Here
- `tests/cli.smoke.test.js`: spawns `node index.js` and asserts stdout/stderr + exit code.
- `tests/ebay-auth.test.js`: mocks `axios` to test OAuth/token parsing.
- `tests/margin.test.js`: unit tests for `src/lib/margin.js`.

## Run Commands
- All tests: `npm test`
- Watch: `npm run test:watch`
- Single file: `npx vitest run tests/margin.test.js`
- Single file (CLI): `npx vitest run tests/cli.smoke.test.js`
- Name filter: `npx vitest run -t "margin"`

## Conventions
- Keep tests hermetic: set/clear any `process.env` keys you touch.
- Prefer `vi.mock('axios', ...)` for network; never hit real eBay endpoints.
- In axios mocks, remember this repo imports the default export (`import axios from 'axios'`).
- CLI tests should use child processes (don’t import `src/cli.js` directly).
- Clean up mocks/spies: `vi.clearAllMocks()` between tests; `vi.restoreAllMocks()` if you used spies.

## Anti-Patterns
- Don’t use real credentials or commit `.env` files; use fake values in tests.
- Don’t rely on test order or shared global state; always clean up mocks/spies.
- Don’t add long sleeps/timeouts; use deterministic stubs + `async`/`await`.
