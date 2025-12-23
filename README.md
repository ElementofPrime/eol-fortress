# PRIME-eBay: Galaxie of Things API Pulse

EOL-fueled eBay fortress: Node CLI for silent automation—bulk listings, vendor syncs, margin moats. Reclaim legacy glow, $2K Cyber wins.

## Core Oath

1. **Silence & Kindness**: Masked calls, empathize returns ("Bubble blues? Evidence relights").
2. **Efficiency Edge**: Modular bulks (50+/hr), cron stock guards, xAI price pulses.
3. **Profitability Prime**: 1.8x margins auto, ROAS >3:1, Best Offer sly.
4. **Security Sentinel**: .env local, Echo audits, quarterly rotates.
5. **Legacy Link**: Cash veins Utah throne—brick by unbreakable brick.

## Quickstart

| Step  | Command/Action                   | Edge                                          |
| ----- | -------------------------------- | --------------------------------------------- |
| Setup | `cd ebay-api-fortress && npm i`  | Installs CLI + test/lint tooling.             |
| Keys  | `cp .env.example .env` → edit it | Wire sandbox eBay keys locally (never commit) |
| Run   | `node index.js`                  | Boots Prime-eBay CLI foundation (no API yet). |

## Env Vars

- Template: `.env.example` (commit-safe) shows:
  - `EBAY_ENVIRONMENT` / `EBAY_API_ENDPOINT`
  - `EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`, `EBAY_REFRESH_TOKEN`
- Real: Local `.env` only; **never** commit it.
- Always start with `EBAY_ENVIRONMENT=sandbox` and move to production only after safe tests.

## Run & Scale (today)

```bash
node index.js           # Prime-eBay CLI · foundation online
npm test                # Vitest tests (CLI, auth, margin)
npm run lint            # ESLint
npm run check           # Lint + tests gate
```

Future commands (bulk listing, pricing pulses, vendor syncs) will be added via Spec Kit specs
and wired into the CLI as separate commands (Fortress Tree pattern).
