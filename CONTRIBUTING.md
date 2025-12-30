# Contributing

## Read First (Source of Truth Order)

1. `.specify/memory/constitution.md` (governance + quality gates)
2. `docs/prime-continuity.md` (current state / shared memory)
3. `docs/agent-handbook.md` (agent roles + coordination)
4. `AGENTS.md` (repo workflow + style)

## Workflow

- Start from an approved Spec Kit spec/plan/tasks when changing behavior.
- Keep diffs small and reviewable; split into batches when needed.
- Update `docs/prime-continuity.md` at milestones (spec approved, plan finalized, tests green, tunnel changes).

## Quality Gates

Run before opening a PR:

- `npm run format`
- `npm run lint`
- `npm test`
- Or simply: `npm run check`

## Pull Requests

PRs should include:

- Summary + why (profit/safety impact)
- How to validate (commands run, expected output)
- Linked spec/task (if applicable)
- “Continuity updated?” checkbox completed when state changed
