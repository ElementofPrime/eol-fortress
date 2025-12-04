# Implementation Plan: Speckit Analyze — Spec/Plan/Tasks Consistency Analyzer

**Branch**: `001-spec-analyze` | **Date**: 2025-12-04 | **Spec**: `specs/001-spec-analyze/spec.md`  
**Input**: Feature specification for the analyze flow that validates `spec.md`, `plan.md`, and `tasks.md` against the eBay-API-Pulse constitution.

## Summary

Implement a **read-only analysis flow** (driven by Prime / Speckit automation) that:

- Uses `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks` to locate the current feature directory and validate required docs.
- Loads `spec.md`, `plan.md`, `tasks.md`, and `.specify/memory/constitution.md`.
- Builds internal models of requirements, user stories, and tasks.
- Detects duplications, ambiguities, underspecification, constitution violations, coverage gaps, and inconsistencies.
- Outputs a single, deterministic Markdown report with capped findings, coverage summary, constitution alignment issues, unmapped tasks, and metrics.

This feature is **meta-tooling** for the Prime-eBay CLI project: it improves documentation quality and alignment before we implement or change Node CLI features.

## Technical Context

**Language/Version**: N/A for core execution (implemented as a Prime/Speckit agent + bash glue); underlying project is Node LTS.  
**Primary Dependencies**:

- `.specify/scripts/bash/check-prerequisites.sh` for path discovery and validation.
- `.specify/memory/constitution.md` as the single source of truth for principles.
- Markdown documents in `specs/[feature]/`.

**Storage**: Local filesystem only (`specs/`, `.specify/`). No network or database access.

**Testing**:

- Manual / scripted scenarios where we seed known issues in feature docs and verify that analyze flags them.
- Future: optional Node-based tests to validate any helper scripts if we codify parts of the logic.

**Target Platform**: Developer environment inside the eBay-API-Pulse repo (Linux/WSL), invoked via Prime or CI.

**Project Type**: Single project (this repo) with meta-tooling layered on top; no new runtime app is added.

**Performance Goals**: Analyze a single feature directory in under 5 seconds; handle moderately large markdown files without timeouts.

**Constraints**:

- Strictly read-only: no file writes in the analyze phase.
- Must rely on `check-prerequisites.sh` for feature discovery; no ad-hoc guessing of paths.
- Must be deterministic when documents are unchanged.

**Scale/Scope**:

- Initially focused on **one feature at a time** (current branch).
- Future extensions might support multi-feature or repo-wide scans but are out of scope for this plan.

## Constitution Check

_Gate: Must pass before we treat analyze as a reliable safety net._

MUST align with the following gates from the eBay-API-Pulse constitution (`.specify/memory/constitution.md`):

- **Security & Secrets Hygiene**: Analyzer only reads markdown and `.env`-agnostic scripts; it must never print or require eBay credentials.
- **Type Safety & Validation Discipline**: Any future code helpers must use TS/JSDoc and validate external inputs (e.g., JSON from `check-prerequisites.sh`) before use.
- **Node CLI Efficiency**: Analyzer supports the CLI workflow by keeping output concise, focused, and suitable for terminal viewing.
- **Data & eBay Integrity**: Analyzer does not touch live eBay data; instead, it prevents mis-specified automation that could harm integrity later.
- **Linting, Formatting, CI Gates**: Analyzer can be wired as a pre-implementation or CI gate; failures should be clear and actionable.
- **Simplicity & Small Surface Area**: Implementation remains small: reuse existing scripts and a single agent prompt rather than introducing heavy new tooling.
- **Silent Profitability by Design**: By catching documentation issues early, analyzer reduces rework and production issues, indirectly protecting margins.
- **Workflow & Gates**: Enforces the spec-kit flow: Constitution → plan → tasks → implement; analyze runs between "tasks" and "implement" as an extra guard.

No new exceptions to the constitution are introduced by this feature.

## Constitution Cross-References

- **"Security & Secrets Hygiene (NON-NEGOTIABLE)"** — Analyzer never touches secrets or tokens; it only reads markdown and shell output.
- **"Node CLI Efficiency"** — Reports must be compact, sorted by severity, and easy to scan in a terminal.
- **"Linting, Formatting, CI Gates"** — Analyze can be used as a gate similar to lint/tests.
- **"Workflow & Gates"** — This feature strengthens the Spec-kit-driven workflow.

Impact:

- Requirements: Emphasize read-only behavior, deterministic output, and strong reliance on the constitution.
- UX: Provide clear severity, categories, and next actions so developers can quickly fix top issues.
- Metrics: Track number and type of issues per feature over time (manual for now).

## Project Structure

### Documentation (this feature)

```text
specs/001-spec-analyze/
├── spec.md        # Feature specification (this file’s input)
├── plan.md        # This implementation plan
├── tasks.md       # Task list generated for this feature
└── quickstart.md  # (Planned) example workflow for using analyze

```

### Source / Scripts (repository root)

This feature primarily orchestrates existing scripts and Prime behavior; we are **not** adding a new runtime app. However, we may create or extend helper scripts in future iterations.

Current relevant structure:

```text
.specify/
├── memory/
│   └── constitution.md                # eBay-API-Pulse constitution
└── scripts/
    └── bash/
        ├── common.sh                  # Shared helpers (branch, paths)
        ├── check-prerequisites.sh     # Feature directory discovery & validation
        ├── create-new-feature.sh      # Feature bootstrap
        └── setup-plan.sh              # Plan bootstrap

specs/
└── 001-spec-analyze/
    ├── spec.md
    ├── plan.md
    └── tasks.md
```

**Structure Decision**: This feature is **documentation and automation-only**. No additional Node modules or directories are introduced solely for analyze. Any future code helpers should live under an appropriate `src/tools/` or similar path and be covered by tests under `tests/`.

## Complexity Tracking

No constitution violations are required for this feature. Complexity remains low by:

- Reusing existing bash scripts for path discovery.
- Implementing analysis logic in a single agent prompt (Prime) rather than multiple new services.
- Operating purely on local markdown files without adding external dependencies.
