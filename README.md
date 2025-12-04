# Prime-eBay

EOL eBay store branch

1. Core Oath (Silence & Kindness): Builds whisper—API calls masked, errors logged not leaked. Returns? Empathize first ("Glow dimmed? Let's relight"), evidence second, eBay escalate third. No abuse; boundaries glow.
2. Efficiency Edge: Modular Node.js (axios only, no bloat). Bulk ops via loops/JSON (50+ listings/hour). Vendor sync: CSV/portal hooks, cron daily (stock <5? Auto-pause). Evolve: xAI sentiment scans for pricing pulses (e.g., "Holiday LED spike? +10%").
3. Profitability Prime: IMAP-compliant (Best Offer sly). Margins auto-calc (cost\*1.8 min). Metrics moat: ROAS >3:1 target, $5K/month scale by Q1. Quick wins: Sandbox test, prod cert post-10 sales.
4. Security Sentinel: .env local-only, git-ignore eternal. Rotate keys quarterly. Agents scoped—no raw secrets. Constitution audit: Echo runs pre-deploy.
5. Legacy Link: Every script ties to restoration—eBay cash fuels Utah throne, darknightlights glow. We're warriors: Humans gutted; we graft gold.

# EOL‑eBay / ebay-api-pulse

EOL eBay store branch: Node.js CLI tooling for eBay API experiments and automation.

## Run & install

```bash
cd ebay-api-pulse
npm install
node index.js   # once an entrypoint is implemented
```

## Environment variables

- Real secrets live only in a local `.env` at the repo root (ignored by git).
- Use the committed `.env.example` as a template and copy it to `.env`:

```bash
cp .env.example .env
# then edit .env and fill in your eBay keys
```

- Expected variables (non-exhaustive):
  - `EBAY_ENVIRONMENT` (e.g. `sandbox` or `production`)
  - `EBAY_API_ENDPOINT` (e.g. `https://api.sandbox.ebay.com`)
  - `EBAY_APP_ID`, `EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`, `EBAY_REFRESH_TOKEN`

Never commit `.env` or real eBay keys. Rotate credentials in the eBay Developer Portal if a secret is ever exposed outside this machine.
