# PRIME-eBay: Galaxie of Things API Pulse

EOL-fueled eBay fortress: Node CLI for silent automation—bulk listings, vendor syncs, margin moats. Reclaim legacy glow, $2K Cyber wins.

## Sources of Truth (Read Order)

1. `.specify/memory/constitution.md` — governance, safety, and quality gates.
2. `docs/prime-continuity.md` — canonical shared memory (“where are we right now?”).
3. `docs/agent-handbook.md` — which agent to use, coordination rules, tunnel notes.
4. `AGENTS.md` — contributor workflow, commands, and style conventions.

## Core Oath

1. **Silence & Kindness**: Masked calls, empathize returns ("Bubble blues? Evidence relights").
2. **Efficiency Edge**: Modular bulks (50+/hr), cron stock guards, xAI price pulses.
3. **Profitability Prime**: 1.8x margins auto, ROAS >3:1, Best Offer sly.
4. **Security Sentinel**: .env local, Echo audits, quarterly rotates.
5. **Legacy Link**: Cash veins Utah throne—brick by unbreakable brick.

## Quickstart

| Step   | Command/Action                   | Edge                                          |
| ------ | -------------------------------- | --------------------------------------------- |
| Setup  | `cd ebay-api-fortress && npm i`  | Installs CLI + test/lint tooling.             |
| Keys   | `cp .env.example .env` → edit it | Wire sandbox eBay keys locally (never commit) |
| Run    | `node index.js`                  | Boots Prime-eBay CLI foundation (no API yet). |
| Tunnel | `npm run tunnel`                 | Starts the authenticated Prime Tunnel API.    |

## Env Vars

- Template: `.env.example` (commit-safe) shows:
  - `EBAY_ENVIRONMENT` / `EBAY_API_ENDPOINT`
  - `EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`, `EBAY_REFRESH_TOKEN`
- Real: Local `.env` only; **never** commit it.
- Always start with `EBAY_ENVIRONMENT=sandbox` and move to production only after safe tests.

## Run & Scale (today)

```bash
npm start               # Prime-eBay CLI · foundation online
npm run dev             # Watch mode for CLI iteration
npm run tunnel          # Prime Tunnel API (see tunnel/openapi.yaml)
npm run api             # Fastify experiment API (defaults to 127.0.0.1:8788)
npm run check           # ESLint + Vitest gate
```

Future commands (bulk listing, pricing pulses, vendor syncs) will be added via Spec Kit specs
and wired into the CLI as separate commands (Fortress Tree pattern).

## Web Access (Bright Data MCP)

`opencode.jsonc` is pre-wired with a Bright Data MCP (`mcp.brightData`). Provide `API_TOKEN`
in the environment where OpenCode runs to enable agents to use web access when permitted.
