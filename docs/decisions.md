# Decisions

Short log of durable choices so Prime / Tunnel / Spec Kit work stays consistent across sessions.

## Format

- **Date**: YYYY-MM-DD
- **Decision**
- **Why**
- **Consequences**

## Decisions detail

- **Date**: 2025-12-30
  - **Decision**: `docs/prime-continuity.md` is the canonical shared memory; agents must align to it.
  - **Why**: Prevent drift between Terminal Prime, Local Prime, and OpenCode agents.
  - **Consequences**: Milestones require continuity updates; instructions are wired via `opencode.jsonc`.

- **Date**: 2025-12-30
  - **Decision**: Tunnel server defaults `REPO_ROOT` to the repo root and jails file access within it.
  - **Why**: Portability + safety for file reads/exec.
  - **Consequences**: Override via `.env.tunnel` only when needed.
