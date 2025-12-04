<!--
Sync Impact Report
- Version change: 1.1.1 → 1.2.0
- Modified principles/constraints: added Prime‑eBay Marketplace & API Discipline; clarified scope for Prime‑eBay tools vs. core EOL app and Engineering Constraints section
- Added sections: "Prime‑eBay Marketplace & API Discipline"
- Removed sections: None
- Templates requiring updates (✅ updated / ⚠ pending):
  • .specify/templates/plan-template.md ✅ Constitution Check list updated for new principle
  • .specify/templates/spec-template.md ✅ No changes required; examples remain valid
  • .specify/templates/tasks-template.md ✅ No changes required; Constitution tags unchanged
  • .specify/templates/commands/* ⚠ Directory not present in this repo (no command templates to update)
- Follow-up TODOs: None
-->

# eBay-API-Pulse Constitution — PRIME Forge (v1.0.0)

## Core Principles

### Security & Secrets Hygiene (NON-NEGOTIABLE)

- No secrets committed—env vars only (.env.local local, CI/host vars prod).
- API calls masked; errors logged concise, no raw traces/PII.
- eBay creds (tokens, IDs) treated sacred: Mask in logs, rotate quarterly via dev portal.
- New integrations: PR must list env keys, failure modes, rate limits.

Rationale: Breaches torch seller rep—hygiene guards the $300 anchor, fuels legacy rebuild.

### Type Safety & Validation Discipline

- TS strict or JSDoc typedefs mandatory; no `any`—narrow inputs explicitly.
- External calls (axios): Zod-validate payloads before send (shared schemas in `lib/validation/`).
- Outputs: DTO-map before returns; no raw eBay responses.

Rationale: Bugs bleed margins—strong types shield bulk ops from 429 flares.

### Node CLI Efficiency

- Modular ESM (import/export); core Node → deps → local grouping.
- Keep pure: Side effects in wrapped utils; CLI prompts clear/safe (readline defaults).
- Bulk ops idempotent; dry-run mode for publishes/prices (confirm destructive).

Rationale: Lean surface = 50+ listings/hour—evolve-or-die, no bloat.

### Data & eBay Integrity

- Inventory sync: Vendor CSV/JSON hooks; validate UPCs/SKUs pre-createItem.
- Stock <5? Auto-pause offers; cron daily via npm-cron.
- Audits: Log JSON exports for ROAS/returns; reversible changes only.

Rationale: Predictable fulfillment = low returns, high 100% feedback fortress.

### Linting, Formatting, CI Gates

- ESLint/Prettier zero errors; `npm run lint:fix` pre-merge.
- Conventional Commits: `feat|fix|chore:ebay-[bulk|sync|price]`.
- Husky pre-commit local; Vitest/Jest for critical flows (createOffer, updateQuantity).

Rationale: Clean tree = velocity—$5K/month scale by Q1.

### Simplicity & Small Surface Area

- YAGNI: New deps justified in PR (e.g., "cron for stock: +efficiency 2x").
- Duplicate? Consolidate `src/lib/`; complexity table in plans.
- CLI: One entry (`index.js`)—wrap sub-commands (node index bulk-publish).

Rationale: Tiny attack surface = unbreakable—exploit weaknesses, not invite 'em.

### Silent Profitability by Design

- Every script/feature: Monetization hypothesis (e.g., "Hinkley bundle: +20% AOV") + metric (ROAS >3:1).
- Hooks subtle: Best Offer auto-nudges, flash discounts via Markdown Manager API.
- eBay-specific: IMAP compliance (price floors), vendor margins 1.8-2.2x auto-calc.

Rationale: Cash veins restore the empire—quick wins first (sandbox test, prod post-10 sales).

### PRIME-eBay Discipline

- Full eBay TOS/rate compliance; sandbox for flows till manual validate (e.g., 5 hero tests).
- Automation reversible: Bulk limits (25/batch), audit trails (JSON logs).
- Returns armor: Embed policy in descriptions ("Defects only, buyer ships"); empathize in dispute scripts.

Rationale: Top-seller ascent—no bans, just glow.

## Marketplace Vision

- Galaxie of Things: 3rd-gen legacy drop-ship supernova—U.S. brands (Hinkley, Visual Comfort), categories (outdoor, chandeliers, fans).
- North Star: 600+ 100% feedback fortress; Cyber Monday $2K floor, Q1 $5K/month.
- Tagline: "Hand-Picked Glow from Highpoint & Dallas—Illuminate Legacy."
- Purpose: Reclaim 2021 betrayal—efficient machine, abuse-proof, profitable pulse.

## Engineering Constraints

- Stack: Node LTS, axios/dotenv/readline core; TS/ESM preferred.
- Env: `process.env.EBAY_*` only; .env.example committed, .env ignored.
- Errors: Try/catch all IO; non-zero exits on fail; concise logs (no tokens).
- CLI: Risk prompts ("Publish 10 heroes? Y/N"); dry-run flag.
- Testing: Vitest in `tests/`; cover business crit (price update, stock sync).
- Performance: Backoff retries in axios (eBay rates); batch <100 calls/min.

## Workflow & Gates

- Spec-kit flow: Constitution → plan → tasks → implement.
- PRs: Checklist vs principles; no merge till lint/test/Zod pass.
- Amendments: PR `governance:constitution`; SemVer bumps.

**Version**: 1.0.0 | **Ratified**: 2025-12-04 | **Last Amended**: Today
