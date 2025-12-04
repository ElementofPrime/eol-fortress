---
description: 'Tasks for Speckit Analyze — Spec/Plan/Tasks Consistency Analyzer'
---

# Tasks: Speckit Analyze — Spec/Plan/Tasks Consistency Analyzer

**Input**: Design documents from `/specs/001-spec-analyze/`  
**Prerequisites**: `plan.md`, `spec.md`, `.specify/memory/constitution.md`, `.specify/scripts/bash/check-prerequisites.sh`

**Tests**: No automated tests are required for v1 of this meta-tool; validation is via seeded scenarios and manual inspection of the analyze report.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions
- **[CONST]**: Constitution reference tag (e.g., `[CONST: Security & Secrets Hygiene (NON-NEGOTIABLE)]`)

## Path Conventions

- This feature operates on documentation and scripts only; relevant paths:
  - `.specify/memory/constitution.md`
  - `.specify/scripts/bash/*.sh`
  - `specs/001-spec-analyze/spec.md`
  - `specs/001-spec-analyze/plan.md`
  - `specs/001-spec-analyze/tasks.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure the Spec-kit and constitution infrastructure needed by analyze is present and coherent.

- [ ] T001 Verify `.specify/memory/constitution.md` reflects eBay-API-Pulse principles and remove any stale references in comments if found (manual review). [CONST: Workflow & Gates]
- [ ] T002 [P] Confirm `.specify/scripts/bash/check-prerequisites.sh` correctly discovers `FEATURE_DIR` and validates `plan.md` and `tasks.md` using `--json --require-tasks --include-tasks`. [CONST: Simplicity & Small Surface Area]
- [ ] T003 [P] Document in `README.md` (or a dedicated section) how to create a feature (`create-new-feature.sh`), set up a plan (`setup-plan.sh`), and run the analyze flow (via Prime). [CONST: Node CLI Efficiency]

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core documentation foundation that MUST be complete before we rely on analyze for any feature.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T004 Ensure `specs/001-spec-analyze/spec.md` is fully populated with real user stories, FRs/NFRs, and edge cases (no template placeholders remain). [CONST: Linting, Formatting, CI Gates]
- [ ] T005 [P] Ensure `specs/001-spec-analyze/plan.md` is aligned with `.specify/memory/constitution.md` (no references to unrelated stacks like Next.js/MongoDB). [CONST: Simplicity & Small Surface Area]
- [ ] T006 [P] Ensure `specs/001-spec-analyze/tasks.md` follows the strict checklist format for all tasks (`- [ ] Txxx [P] [USn] Description with file path`). [CONST: Workflow & Gates]
- [ ] T007 Confirm that `check-prerequisites.sh --json --require-tasks --include-tasks` succeeds on `001-spec-analyze` and returns the correct `FEATURE_DIR`. [CONST: Node CLI Efficiency]

**Checkpoint**: Foundation ready — user story implementation (analyze behavior) can now begin.

---

## Phase 3: User Story 1 - Analyze current feature artifacts (Priority: P1) 🎯 MVP

**Goal**: Provide a single analyze flow that, when invoked, produces a Markdown report describing issues across `spec.md`, `plan.md`, `tasks.md` for the current feature.

**Independent Test**: On a feature with known documentation issues, invoking the analyze flow yields a report that:

- Detects at least one duplication/ambiguity/coverage issue.
- Includes a coverage table and metrics.
- Does not modify any files.

### Implementation for User Story 1

- [ ] T008 [US1] Define the Prime/Speckit analyze prompt (this document) that describes the full execution steps and constraints for `/speckit.analyze`. [CONST: Workflow & Gates]
- [ ] T009 [P] [US1] Validate that analyze always runs `check-prerequisites.sh --json --require-tasks --include-tasks` exactly once before accessing feature docs. [CONST: Simplicity & Small Surface Area]
- [ ] T010 [P] [US1] Implement logic (in the prompt) to load `spec.md`, `plan.md`, and `tasks.md` using absolute paths derived from `FEATURE_DIR`. [CONST: Node CLI Efficiency]
- [ ] T011 [US1] Implement logic to load `.specify/memory/constitution.md` and build an internal set of MUST-level principles for validation. [CONST: Security & Secrets Hygiene (NON-NEGOTIABLE)]
- [ ] T012 [US1] Implement requirement and user-story inventory extraction from `spec.md` (user stories, FRs, NFRs, edge cases). [CONST: Linting, Formatting, CI Gates]
- [ ] T013 [US1] Implement task inventory extraction from `tasks.md` (IDs, phases, [P] markers, [USn] tags, file paths). [CONST: Workflow & Gates]
- [ ] T014 [US1] Implement detection of coverage gaps (requirements with no tasks, tasks with no mapped story) and add them to the report. [CONST: Silent Profitability by Design]
- [ ] T015 [US1] Implement detection of constitution violations (artifacts contradicting MUST principles) and mark them CRITICAL in the report. [CONST: Security & Secrets Hygiene (NON-NEGOTIABLE)]
- [ ] T016 [US1] Implement the final Markdown report format: findings table, coverage summary, constitution issues, unmapped tasks, metrics, and next actions. [CONST: Node CLI Efficiency]
- [ ] T029 [US1] Verify that the analyze workflow uses only read operations on `spec.md`, `plan.md`, `tasks.md`, and `constitution.md` (no file writes, edits, or script calls that modify files). [CONST: Security & Secrets Hygiene (NON-NEGOTIABLE)]

---

**Checkpoint**: At this point, US1 is complete if the analyze flow can be run on a sample feature and generates a useful, read-only report.

---

## Phase 4: User Story 2 - Highlight constitution and coverage issues (Priority: P2)

**Goal**: Ensure constitution violations and coverage gaps are explicitly surfaced and easy to find.

**Independent Test**: On a doctored feature with misaligned plan and missing tasks, analyze reports a clearly labeled "Constitution Alignment Issues" section and a populated coverage table.

### Implementation for User Story 2

- [ ] T017 [P] [US2] Implement classification and prioritization rules to ensure constitution and coverage issues are always included in the top of the findings list. [CONST: Linting, Formatting, CI Gates]
- [ ] T018 [US2] Ensure the "Constitution Alignment Issues" section is always present in the report (empty if none), with clear wording for each violation. [CONST: Security & Secrets Hygiene (NON-NEGOTIABLE)]
- [ ] T019 [US2] Ensure the coverage summary table lists each requirement key with `Has Task?`, `Task IDs`, and `Notes`. [CONST: Workflow & Gates]
- [ ] T020 [P] [US2] Add handling for tasks that cannot be mapped to any requirement/story and list them under "Unmapped Tasks". [CONST: Simplicity & Small Surface Area]

**Checkpoint**: At this point, developers can quickly fix constitution and coverage issues based solely on the report.

---

## Phase 5: User Story 3 - Limit noise and support re-runs (Priority: P3)

**Goal**: Make the analyze output stable and focused so that repeated runs on unchanged documents produce consistent, capped results.

**Independent Test**: On unchanged artifacts, two consecutive analyze runs yield identical findings, IDs, and metrics, and the findings count never exceeds 50 rows.

### Implementation for User Story 3

- [ ] T021 [P] [US3] Define a deterministic scheme for finding IDs (e.g., prefix + index order) so reruns on unchanged docs keep IDs stable. [CONST: Simplicity & Small Surface Area]
- [ ] T022 [US3] Implement a hard cap of 50 findings in the main table and add an overflow summary when more issues are detected conceptually. [CONST: Node CLI Efficiency]
- [ ] T023 [US3] Ensure findings are sorted primarily by severity (CRITICAL → HIGH → MEDIUM → LOW) and secondarily by location for stable ordering. [CONST: Silent Profitability by Design]
- [ ] T024 [P] [US3] Validate that repeated runs on unchanged feature docs yield identical IDs, counts, and metrics (manual scenario test). [CONST: Linting, Formatting, CI Gates]
- [ ] T030 [US3] Measure analyze runtime on a seeded sample feature and confirm it completes within 5 seconds on a typical dev machine; note assumptions (file sizes, hardware). [CONST: Node CLI Efficiency]
- [ ] T031 [US3] Document a non-interactive/CI invocation pattern for analyze (no prompts, suitable for pipelines) and verify it produces the same report as the interactive run. [CONST: Workflow & Gates]
      IDs now run T001–T031 without reuse.

---

**Checkpoint**: At this point, US3 is complete; developers can rely on stable, noise-controlled reports.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and documentation that affect the analyze feature across all user stories.

- [ ] T025 [P] Add a short "Spec-kit Analyze" section to `README.md` explaining when and how to run the analyze flow in the Prime-eBay repo. [CONST: Node CLI Efficiency]
- [ ] T026 [P] Document in `specs/001-spec-analyze/quickstart.md` (future file) an example workflow: create feature → write spec/plan → generate tasks → run analyze → fix issues → implement. [CONST: Workflow & Gates]
- [ ] T027 Perform a copy-editing pass on `specs/001-spec-analyze/spec.md`, `plan.md`, and `tasks.md` to remove any residual placeholders or inconsistencies. [CONST: Linting, Formatting, CI Gates]
- [ ] T028 Confirm that running analyze on `001-spec-analyze` itself produces a report with zero CRITICAL issues and acceptable coverage. [CONST: Silent Profitability by Design]

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately; ensures base scripts and constitution are in place.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories (we must have real spec/plan/tasks before analyze is meaningful).
- **User Stories (Phase 3–5)**: All depend on Foundational phase completion; US1 is the MVP, US2 and US3 layer on top.
- **Polish (Final Phase)**: Depends on completion of desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Setup + Foundational; no dependency on other stories.
- **User Story 2 (P2)**: Depends on US1 (needs basic findings/report pipeline).
- **User Story 3 (P3)**: Depends on US1 (for basic report) and partially on US2 (for final ordering rules).

### Within Each User Story

- Core extraction and detection logic before report formatting.
- Report formatting before stability and ordering tweaks.
- Stability and caps (US3) after all required issue types are emitted.

### Parallel Opportunities

- T002, T003 can run in parallel after T001.
- T005, T006, T007 can run in parallel after T004.
- Within US1, T009–T013 can be considered in parallel conceptually (they touch different parts of the logic) but should be integrated carefully in the prompt.
- US2 and US3 tasks can be partially parallelized once US1 is stable.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational) so that the current feature has real spec/plan/tasks and working prerequisites.
2. Implement US1 tasks (T008–T016) to produce a baseline analyze report with findings, coverage, and metrics.
3. **STOP and VALIDATE**: Run analyze on a seeded feature and confirm:
   - It detects obvious issues.
   - It is read-only.
   - It uses `check-prerequisites.sh` as the single source of truth for paths.

### Incremental Delivery

1. After MVP (US1), implement US2 to highlight constitution and coverage issues more clearly (T017–T020).
2. Implement US3 to stabilize IDs and cap noise (T021–T024).
3. Apply Polish tasks (T025–T028) to document and self-validate the feature.

### Parallel Team Strategy

With multiple contributors:

- One person handles Setup + Foundational (T001–T007).
- Another focuses on US1 prompt and extraction logic (T008–T016).
- A third focuses on US2/US3 refinements (T017–T024) and documentation (T025–T027).

All changes should be small, reviewable batches aligned with this tasks list.

---

## Notes

- [P] tasks indicate conceptual parallelism; when editing shared prompts or scripts, coordinate to avoid merge conflicts.
- Each user story should be independently testable using seeded feature directories.
- Re-run the analyze flow against `001-spec-analyze` after major edits to keep it self-consistent.
