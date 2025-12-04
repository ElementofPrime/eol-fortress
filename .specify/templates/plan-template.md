# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [single/web/mobile - determines source structure]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

MUST pass the following gates derived from the EOL Constitution:

- Security & Secrets Hygiene: no secrets in repo; API errors via src/lib/http.ts.
- Type Safety & Validation: TS strict; Zod validation for all external inputs; DTOs only to clients.
- Server‑First Next.js 16: Server Components by default; "use client" requires justification.
- MongoDB Integrity: runtime="nodejs" and dynamic="force-dynamic" flags; use src/lib/db.ts; validate ObjectId; indexes managed.
- Lint/Format/Commits: ESLint clean; Prettier formatted; Conventional Commits message.
- Simplicity: YAGNI enforced; if complexity added, complete "Complexity Tracking" table below.
- Silent Profitability: state monetization/value hypothesis + at least one measurable metric.
- Prime‑eBay Marketplace & API Discipline: for eBay automation, comply with eBay policies and rate limits, use sandbox-first flows, and design safe, reversible bulk operations.
- Prime UX Contract: greet by name; structured steps; end with a clear next step; no profanity.
- Metaphors & Integration: Fortress containment for external apps; integrate Tree of Life and Prime Pulse when applicable (or mark N/A with rationale).
- Definition of Done: npm run lint, npm run typecheck, npm run build succeed.


## Constitution Cross-References

- Referenced sections (exact heading text):
  - [e.g., "4. User Journey — First‑Time Experience"]
  - [e.g., "6.8 Balance & Decisions (The Scale)"]
  - [e.g., "8. Interaction Rules for Prime (UX Contract)"]
- Impact on this plan:
  - [Scope decisions shaped by referenced sections]
  - [Acceptance criteria derived from UX contract and DoD]
  - [Integration requirements for Tree of Life / Prime Pulse]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
