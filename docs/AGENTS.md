# docs/ Directory Guide

## Overview

`docs/` is the coordination surface for multi-agent work: current state, roles, and durable decisions.

## Sources Of Truth (Read Order)

1. `.specify/memory/constitution.md`
2. `docs/prime-continuity.md`
3. `docs/agent-handbook.md`
4. `AGENTS.md` (repo root)

## Where To Look

- `docs/prime-continuity.md`: canonical current state; update in-place at milestones.
- `docs/agent-handbook.md`: agent roles + coordination rules.
- `docs/decisions.md`: durable guardrails (“why we did it this way”).
- `docs/opencode-codex-auth-updates.md`: plugin pin/update workflow.
- `docs/opencode-supermemory.md`: plugin setup/usage notes.
- `docs/mcp-brightdata.md`: Bright Data MCP wiring notes.

## Conventions

- Prefer editing existing docs over creating new “current state” files.
- Keep operational facts accurate (ports, endpoints, env var names) and aligned with code.
- Treat anything that looks like a secret as a secret (don’t paste tokens into docs).

## Anti-Patterns

- Don’t create a second continuity file; always update `docs/prime-continuity.md`.
- Don’t paste tunnel URLs as “truth”; they change per run (use the latest printed URL).
- Don’t copy `.env` / `.env.tunnel` contents into docs.
- Don’t let docs drift from implementation—update docs when behavior changes.
