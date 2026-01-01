# Agent Handbook (Prime‑eBay / Tunnel)

This repo uses multiple OpenCode agents. Use this doc to pick the right agent, keep roles non-overlapping, and avoid contradictory changes.

## Sources of Truth (Read Order)

1. `.specify/memory/constitution.md` (governance + quality gates)
2. `docs/prime-continuity.md` (shared memory + current build state)
3. `docs/agent-handbook.md` (this file: roles + coordination)
4. `AGENTS.md` (contributor workflow + code style)
5. `docs/decisions.md` (durable choices / guardrails)

## Core Roles

- **Terminal Prime (`prime`)**: execution lead. Runs commands, integrates work, enforces gates, and coordinates tunnel operations.
- **Element of Prime (`element-of-prime`)**: continuity steward. Reconciles conflicts, updates `docs/prime-continuity.md`, and keeps agent instructions aligned.
- **Builder (`build`)**: implementation engine. Converts approved specs/plans into minimal diffs with tests.
- **Debugger (`debug`)**: repair engine. Fixes failing tests, regressions, or behavior mismatches with minimal change.
- **Planner (`plan`)**: spec/plan/tasks strategist. Produces Spec Kit artifacts aligned with the Constitution.

## When to Use Which Agent

- **New feature / unclear scope** → `plan`, then `build`.
- **Spec/plan drift or “what’s the current state?”** → `element-of-prime`.
- **Failing tests / runtime error / weird output** → `debug`.
- **Release readiness / integration across areas** → `prime`.

## Coordination Rules

- One agent “owns” a change-set at a time; others propose, review, or unblock.
- If instructions conflict, resolve in this order: Constitution → Continuity → Handbook → Contributor guide.
- Update `docs/prime-continuity.md` at milestones (spec approved, plan finalized, tests green, tunnel changes, deploy-ready).

## Tunnel Notes (Prime in the Tunnel)

- API server: `tunnel/server.mjs` (auth required for most routes).
- Spec: `tunnel/openapi.yaml`.
- Secrets: `.env.tunnel` is local-only; never paste tokens into issues, logs, or PRs.

## Bright Data MCP (Web Access)

- Config lives in `opencode.jsonc` under `mcp.brightData`.
- Requires an `API_TOKEN` in your environment for `@brightdata/mcp`.
- If network is restricted in your runtime, you may need to run OpenCode with network enabled for web search/crawling.
- Details: `docs/mcp-brightdata.md`.

## OpenCode Plugins (Updates)

- Codex OAuth plugin update workflow: `docs/opencode-codex-auth-updates.md`.
- Supermemory plugin setup: `docs/opencode-supermemory.md`.
