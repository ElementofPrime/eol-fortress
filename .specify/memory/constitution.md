<!--
Sync Impact Report
- Version change: none (template) → 1.0.0
- Modified principles:
  - [PRINCIPLE_1_NAME] → I. Fortress – Sandbox & Secrets
  - [PRINCIPLE_2_NAME] → II. Tree – Modular Commands
  - [PRINCIPLE_3_NAME] → III. Pulse – Profit & Throughput
  - [PRINCIPLE_4_NAME] → IV. Galaxie – Market Feedback & Pricing
  - [PRINCIPLE_5_NAME] → V. Simplicity & Observability
- Added sections:
  - Operational Constraints & Security Requirements
  - Development Workflow, Review Process & Quality Gates
- Removed sections:
  - Template-only comments and placeholder guidance
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check remains generic but aligned)
  - ✅ .specify/templates/spec-template.md (no conflicting requirements)
  - ✅ .specify/templates/tasks-template.md (task phases already compatible)
  - ✅ .specify/templates/checklist-template.md (high-level, no contradictions)
- Follow-up TODOs:
  - None; constitution is fully concrete for PRIME‑eBay CLI.
-->

# PRIME‑eBay CLI: ebay‑api‑fortress Constitution

## Core Principles

### I. Fortress – Sandbox & Secrets

Every automation begins behind the walls of a fortress:

- **Sandbox-first, dry-run-first**
  - All new eBay flows MUST default to `EBAY_ENVIRONMENT=sandbox` and/or `--dry-run`.
  - Production endpoints MAY be enabled only after sandbox success and explicit opt-in.
- **Single source of truth for secrets**
  - eBay credentials and endpoints MUST be read exclusively via `getRuntimeEnv()` /
    `getEbayEnv()` from `ebay-api-fortress/src/config/env.js`.
  - No other module may import `dotenv` directly or read `process.env` for `EBAY_*` keys.
  - `.env` files MUST never be committed; `.env.example` remains the only tracked env file.
- **Fail fast on bad config**
  - Missing or clearly invalid env configuration MUST cause startup failure with a clear
    message, rather than silent fallback.

Rationale: We protect Jeremy’s legacy by ensuring no accidental live calls, no leaked keys,
and no silent configuration drift.

### II. Tree – Modular Commands

The CLI is a well‑pruned tree of profit‑oriented commands:

- **Stable trunk, focused branches**
  - The entrypoint is always `prime-ebay` / `node index.js`.
  - Each feature lives as a named command (e.g., `inventory:sync`, `pricing:pulse`,
    `feedback:guard`) that can be documented, tested, and shipped independently.
- **Separation of concerns**
  - CLI files handle parsing, help text, and user interaction.
  - Core logic lives in reusable modules under `src/` (services, clients, utilities) with
    no direct CLI or I/O dependencies.
- **Pruning by gates**
  - Commands that cannot pass lint, format, and smoke tests MUST NOT be wired into the
    public CLI surface.

Rationale: A clean command tree keeps the fortress maintainable as new money‑making paths
are added and old experiments are pruned.

### III. Pulse – Profit & Throughput

The fortress exists to create silent, ethical, compounding profit:

- **Profit‑first metrics**
  - Commands that change listings, inventory, or pricing SHOULD report projected and/or
    realized uplift (e.g., "Projected $ uplift: +$47"), even if estimated.
  - Margin calculations MUST be explicit and traceable (inputs and assumptions visible in
    logs or debug output; never guess without labeling it as such).
- **Throughput with throttle guards**
  - Bulk operations are designed to handle **100+ listings per hour** while respecting
    eBay rate limits and backoff guidance.
  - All high‑volume flows MUST implement retry and backoff strategies that avoid bans
    and protect seller health.
- **Silent revenue loops**
  - Where appropriate, commands SHOULD support non‑interactive, cron‑friendly modes to
    keep the store pulsing without babysitting.

Rationale: The CLI is not a toy; it is a pulse generator for Jeremy’s store and legacy.

### IV. Galaxie – Market Feedback & Pricing

We treat the marketplace as a living galaxie of signals:

- **Feedback guardians**
  - Negative feedback and rating dips (e.g., below 600 lifetime positives or below a
    chosen health threshold) MUST be surfaced via automation‑friendly reports or alerts.
- **Dynamic pricing hooks**
  - Pricing logic SHOULD be built to accept competitor and market data (e.g., via
    Bright Data MCP or similar sources) as inputs.
  - No hardcoded "magic" prices in core logic; strategies live in configuration or
    clearly named strategy modules.
- **Data‑driven experiments**
  - Changes to pricing strategies SHOULD be tied to measurable experiments (e.g., new
    rule → track sell‑through and margin before/after).

Rationale: Jeremy’s edge comes from listening to the market, not guessing in the dark.

### V. Simplicity & Observability

We favor simple, observable systems over clever opacity:

- **Small, sharp tools**
  - Each command MUST do one coherent thing extremely well.
  - New complexity (extra layers, patterns, or abstractions) MUST be justified by
    concrete pain, not theoretical concerns.
- **Text I/O and logs**
  - Successful runs print clear, human‑readable summaries.
  - When `DEBUG` is truthy, commands MAY print structured diagnostics to aid debugging,
    but still MUST avoid leaking secrets.
- **Testing as observability**
  - Vitest smoke and integration tests are mandatory for core flows; they act as living
    documentation of expected behavior.

Rationale: Simple, observable tools keep the fortress debuggable at 3 a.m. when it
matters most.

## Operational Constraints & Security Requirements

This section turns principles into concrete operating rules:

- **Platform & stack**
  - Runtime: Node.js **>= 20**, ESM only (`"type": "module"` in `package.json`).
  - Language: JavaScript with modern syntax; no TypeScript in this repository.
  - HTTP client: Axios as the standard HTTP layer for eBay APIs.
- **Configuration**
  - All eBay‑specific configuration (environment, endpoints, credentials) MUST flow
    through `getEbayEnv()`.
  - Additional runtime flags (e.g., dry‑run, concurrency limits) SHOULD be exposed via
    CLI options and/or env vars, not hardcoded.
- **Secrets & env files**
  - `EBAY_*` secrets and tokens MUST live only in local `.env` or secure environment
    stores; never in source or logs.
  - Rotations SHOULD be performed regularly and after any suspicion of compromise.
- **Safety for live operations**
  - Any command that can affect live listings MUST support a dry‑run mode that prints
    intended changes without applying them.
  - Sandbox test runs MUST be easy to invoke and documented in the README.

## Development Workflow, Review Process & Quality Gates

We build like a surgical team, not a chaotic lab:

- **Spec Kit first**
  - New capabilities MUST start with Spec Kit: constitution alignment, feature spec,
    plan, and tasks before large code changes.
- **Small, reviewable batches**
  - Changes SHOULD generally stay under ~50 lines of effective code or be split into
    clearly labeled batches (Batch 1, Batch 2, etc.).
- **Quality gates**
  - `npm run lint`, `npm run format`, and `npm test` (or `npm run check`) MUST pass
    before any change is considered ready.
  - CLI behavior for critical paths MUST be validated via end‑to‑end tests like
    `tests/cli.smoke.test.js`.
- **Error handling & UX contracts**
  - CLI entrypoints MUST wrap `main()` in `try/catch`, log friendly messages, and dump
    detailed errors only when `DEBUG` is truthy.
  - Every public command SHOULD provide immediate, understandable value (for example,
    an explicit summary line such as "Projected $ uplift: +$47").
- **Approvals & production**
  - No production‑facing change is considered complete without Jeremy’s explicit
    approval.
  - Risky features (pricing, bulk edits) SHOULD include a rollback or disable path.

## Governance

This constitution is the law of the PRIME‑eBay fortress:

- **Supremacy**
  - This document supersedes ad‑hoc practices and prior unwritten rules for this
    repository.
  - When in doubt, default to the safest interpretation for Jeremy’s legacy, profit,
    and security.
- **Amendments**
  - Any change to core principles or governance MUST be performed via the Spec Kit
    constitution flow and recorded as a version bump.
  - Amendments SHOULD be accompanied by a brief rationale (what changed, why) and
    referenced in relevant specs or plans.
- **Versioning policy**
  - **MAJOR**: Backward‑incompatible governance or principle changes that significantly
    alter how features are designed or deployed.
  - **MINOR**: New principles or sections added, or substantial expansion of existing
    rules.
  - **PATCH**: Clarifications, typo fixes, and non‑semantic wording improvements.
- **Compliance expectations**
  - Reviews and automated checks MUST confirm that new features and changes respect
    these principles and gates.
  - Complexity MUST always be justified; simpler alternatives MUST be documented when
    rejected.

**Version**: 1.0.0 | **Ratified**: 2025-12-10 | **Last Amended**: 2025-12-10
