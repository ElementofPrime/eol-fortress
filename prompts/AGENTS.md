# prompts/ Directory Guide

## Overview

`prompts/` contains agent prompt contracts used by this repo (BUILD/DEBUG/PRIME/EoP/PLAN). Small edits can materially change tool behavior.

## Where To Look

- `prompts/build.txt`: implementation rules (minimal diffs, no feature invention).
- `prompts/debug.txt`: debugging methodology (reproduce first, minimal fix).
- `prompts/prime.txt`: terminal execution + output schema requirements.
- `prompts/element-of-prime.txt`: continuity and conflict-resolution rules.
- `prompts/plan.txt`: spec/plan/tasks generation instructions.

## Conventions

- Keep prompts aligned with `.specify/memory/constitution.md` and root `AGENTS.md`.
- If a prompt defines an output schema (e.g., JSON key order), treat it as a contract.
- Prefer narrow, explicit rules over broad “be helpful” guidance.

## Change Protocol

- Treat prompt changes as behavior changes: keep diffs small and reviewable.
- If you update `prompts/prime.txt` output schema, also update any tooling/docs that depend on it.

## Anti-Patterns

- Don’t introduce new output schemas casually; they ripple into tooling and docs.
- Don’t add instructions that conflict with repo-wide safety rules (secrets, no commits).
- Don’t embed real tokens, hostnames, or environment values in prompts.
- Don’t “fix” prompts by making them longer—prefer the smallest clarifying change.
