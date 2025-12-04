# Feature Specification: Speckit Analyze — Spec/Plan/Tasks Consistency Analyzer

**Feature Branch**: `001-spec-analyze`  
**Created**: 2025-12-04  
**Status**: Draft  
**Input**: User description: "Analyze spec.md, plan.md and tasks.md for inconsistencies, gaps and constitution violations before implementation, using check-prerequisites.sh and the eBay-API-Pulse constitution. Read-only; output a compact Markdown report with findings, coverage, and next actions."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Analyze current feature artifacts (Priority: P1)

A developer working on a feature branch wants to quickly validate that `spec.md`, `plan.md`, and `tasks.md` for that feature are internally consistent and aligned with the eBay-API-Pulse constitution **before** writing or changing code.

They run the analyze command (via the Prime agent or an equivalent trigger) from the repo root and receive a Markdown report summarizing duplications, ambiguities, gaps, constitution violations, and coverage, so they can fix documentation first.

**Why this priority**: This is the core safety gate; without it, features can be implemented against incomplete or contradictory specifications, causing rework and production risk.

**Independent Test**: On a feature branch that has realistic `spec.md`, `plan.md`, and `tasks.md`, running the analyze command produces a Markdown report to stdout that:

- Lists at least one finding for known injected issues (e.g., duplicate FRs or missing tasks).  
- Includes a coverage table mapping requirements to tasks.  
- Flags constitution violations when templates or plans contradict `.specify/memory/constitution.md`.  
- Does **not** modify any files.

**Acceptance Scenarios**:

1. **Given** a feature branch with valid spec/plan/tasks and constitution, **When** the developer runs the analyze flow, **Then** a Markdown report is printed that includes findings, a coverage table, metrics, and next actions, and no files are changed.
2. **Given** a feature branch where `tasks.md` is missing, **When** the developer invokes the analyze flow, **Then** the prerequisites step fails with a clear error instructing them to run `/speckit.tasks` first, and no further analysis is attempted.

---

### User Story 2 - Highlight constitution and coverage issues (Priority: P2)

A developer wants to focus specifically on **constitution violations** and **coverage gaps** (requirements without tasks, tasks without stories) to quickly bring a feature up to the eBay-API-Pulse standards.

They run the analyze command and scan a clearly separated section listing constitution alignment issues and unmapped requirements/tasks.

**Why this priority**: Constitution alignment and coverage gaps are the highest-risk issues for bulk eBay automation; surfacing them explicitly prevents violating core principles.

**Independent Test**: On a feature whose `spec.md` includes requirements with no tasks and whose plan contradicts the constitution, running analyze yields a report section titled "Constitution Alignment Issues" and a coverage table where at least one requirement is marked `Has Task? = No` with explanatory notes.

**Acceptance Scenarios**:

1. **Given** a requirement in spec.md that has no corresponding task in tasks.md, **When** analyze runs, **Then** the coverage table shows that requirement key with `Has Task? = No` and an explanatory note.
2. **Given** a plan.md that references technologies or patterns not present in `.specify/memory/constitution.md` (e.g., Next.js when the constitution specifies a Node CLI), **When** analyze runs, **Then** a CRITICAL constitution issue is listed with a short explanation and recommendation to realign the plan.

---

### User Story 3 - Limit noise and support re-runs (Priority: P3)

A developer wants the analyze report to be **stable and focused**, so repeated runs on the same documents produce consistent IDs and do not drown them in low-value issues.

They can re-run analyze multiple times during refinement and rely on deterministic IDs for findings and capped output.

**Why this priority**: Stable, capped reports make it easier to track and fix top issues over multiple iterations and avoid overwhelming the developer with minor wording suggestions.

**Independent Test**: Running analyze twice on unchanged spec/plan/tasks yields the same set of findings, with the same IDs and counts, and never more than 50 findings listed.

**Acceptance Scenarios**:

1. **Given** spec/plan/tasks have not changed, **When** analyze runs twice in a row, **Then** the set of findings, their IDs, and metrics are identical between runs.
2. **Given** a very noisy spec/plan/tasks combination that could theoretically generate more than 50 findings, **When** analyze runs, **Then** at most 50 findings are shown and an overflow summary is included.

---

### Edge Cases

- What happens when `spec.md`, `plan.md`, or `tasks.md` are missing?  
  → Analyze must fail fast using the `check-prerequisites.sh` script and print a clear, actionable error (e.g., "Run /speckit.tasks first"), without attempting partial analysis.

- How does the system handle placeholder templates?  
  → Analyze must detect obviously templated content (e.g., `[FEATURE NAME]`, `[Title]`, `[NEEDS CLARIFICATION]`) and flag these as **underspecified** or **ambiguous** items, not treat them as real requirements.

- What happens if `.specify/memory/constitution.md` is missing or unreadable?  
  → Analyze must treat this as a CRITICAL failure, clearly state that constitution validation could not be performed, and avoid falsely claiming that artifacts are aligned.

- What happens if the artifacts are extremely long?  
  → Analyze must still honor the 50-finding cap and prioritize high-severity issues (constitution, coverage, contradictions) over minor wording fixes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST invoke `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks` from the repo root to discover `FEATURE_DIR` and validate the presence of `spec.md`, `plan.md`, and `tasks.md` before analysis.
- **FR-002**: System MUST load `.specify/memory/constitution.md` and treat any conflict with a MUST-level principle as a **CRITICAL** issue in the report.
- **FR-003**: System MUST parse `spec.md`, `plan.md`, and `tasks.md` to build an internal inventory of requirements, user stories, and tasks, and produce a **coverage table** mapping requirement keys to task IDs.
- **FR-004**: System MUST detect and classify issues into categories (Duplication, Ambiguity, Underspecification, Constitution, Coverage, Inconsistency) and assign a severity level (CRITICAL/HIGH/MEDIUM/LOW) using a documented heuristic.
- **FR-005**: System MUST generate a single Markdown report to stdout that includes: a findings table, coverage summary, constitution alignment issues, unmapped tasks, and basic metrics (totals, coverage %, counts by type).
- **FR-006**: System MUST be **strictly read-only**, never modifying `spec.md`, `plan.md`, `tasks.md`, or the constitution; it may only read files and print output.
- **FR-007**: System MUST cap the number of detailed findings to 50 and include an overflow summary if more potential issues exist.
- **FR-008**: System MUST produce deterministic IDs for findings when run against unchanged documents so that re-runs can be compared reliably.

### Non-Functional Requirements

- **NFR-001**: Analyze SHOULD complete within 5 seconds on typical feature specs for this repo on a developer laptop.
- **NFR-002**: Analyze SHOULD prioritize high-severity issues (constitution violations and coverage gaps) in its output ordering.
- **NFR-003**: Analyze SHOULD avoid leaking any environment secrets or eBay credentials when logging or printing errors.
- **NFR-004**: Analyze SHOULD be invocable both interactively (through Prime) and from automation (e.g., CI) without requiring manual input.

### Key Entities

- **Feature Artifacts**: The trio of files for a single feature: `spec.md`, `plan.md`, and `tasks.md` under `specs/[feature-branch]/`.
- **Finding**: A single detected issue with category, severity, location, summary, and recommendation.
- **Requirement Key**: A stable identifier derived from a functional or non-functional requirement (e.g., `fr-001-prereq-check`, `user-story-1-analyze-current-feature`).

## Constitution References

- "Security & Secrets Hygiene (NON-NEGOTIABLE)"  
- "Type Safety & Validation Discipline"  
- "Node CLI Efficiency"  
- "Data & eBay Integrity" (conceptually, even though this feature is meta-tooling)  
- "Linting, Formatting, CI Gates"  
- "Simplicity & Small Surface Area"  
- "Silent Profitability by Design"  
- "Workflow & Gates — Spec-kit flow: Constitution → plan → tasks → implement."

Implications:

- Requirements: The analyzer must never write secrets, must not encourage violating rate or safety rules, and must keep its own logic simple and focused.
- UX: Reports must be concise and actionable, with clear severity and next actions, supporting the CLI-focused workflow.
- Data model: The analyzer treats artifacts as documents, not as live eBay data; it must respect the constitution but does not touch inventory or offers.
- Metrics: Analyzer improves velocity and reduces rework, supporting the profitability and workflow principles indirectly.

Linked Constitution Sections by User Story:

- **US1**: Aligned with "Workflow & Gates" and "Linting, Formatting, CI Gates" — enforces documentation quality before implementation.  
- **US2**: Aligned with "Security & Secrets Hygiene" and "Data & eBay Integrity" — surfaces misaligned plans early.  
- **US3**: Aligned with "Simplicity & Small Surface Area" and "Silent Profitability by Design" — keeps output focused and reusable across runs.

## EOL Product Constitution Compliance

- [x] Fortress metaphor respected — Analyzer operates on local repo documents only; no external calls to eBay APIs or third-party services.
- [x] Tree of Life integration — N/A for this meta-tool; justification: it operates solely on engineering docs, not user-facing product flows.
- [x] Prime Pulse integration — N/A for this meta-tool in v1; potential future metric: count of constitution violations per feature over time.
- [x] Prime UX Contract satisfied — Structured steps, clear next actions, no profanity; report is deterministic and focused.
- [x] Safety & Integrity — No secrets handled; only local markdown files read; constitution explicitly loaded and honored.
- [x] Monetization/Value hypothesis — Analyzer reduces rework and defects, enabling faster safe rollout of eBay automation (time and risk savings).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a seeded test feature with known documentation issues, analyze flags at least 90% of injected problems as findings.
- **SC-002**: Analyze runs in under 5 seconds on a typical developer machine for a single feature directory.
- **SC-003**: 90% of developers using the tool report that they can resolve CRITICAL/HIGH issues in under 30 minutes per feature based on the report alone.
- **SC-004**: For features gated by analyze in CI, post-implementation defect rate related to specification misunderstandings is reduced by at least 50% compared to ungated features.