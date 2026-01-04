# .specify/ (Spec Kit) Guide

## Overview

`.specify/` is spec-driven workflow scaffolding for this repo (templates + bash scripts + constitution). It is not runtime code.

## Structure

- `.specify/memory/constitution.md`: governance + quality gates (source of truth).
- `.specify/templates/*.md`: spec/plan/tasks/checklist templates.
- `.specify/scripts/bash/*.sh`: helpers to scaffold a feature and keep agent context in sync.

## Common Workflows

- Create feature skeleton: `.specify/scripts/bash/create-new-feature.sh`
- Set up plan files: `.specify/scripts/bash/setup-plan.sh`
- Validate prerequisites: `.specify/scripts/bash/check-prerequisites.sh`
- Update agent context: `.specify/scripts/bash/update-agent-context.sh`

## Conventions

- If a template conflicts with the Constitution, fix the template.
- Keep templates generic; project-specific rules belong in `AGENTS.md` or `docs/`.

## Template Gotchas

- `.specify/templates/tasks-template.md` and `.specify/templates/checklist-template.md` include explicit “DO NOT keep sample items” warnings.
- Generated `tasks.md` / checklists must not retain placeholder samples.

## Anti-Patterns (Hard)

- DO NOT leave sample tasks/items from templates in generated artifacts.
- Don’t edit `.specify/memory/constitution.md` casually; changes ripple into every spec/plan.
