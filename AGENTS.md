# AGENTS — EOL Prime repo quick-ops & squad charter (2025-11)

## Quick ops (build / run / lint)

- Install: `npm ci` (CI) or `npm i` (local)
- Dev: `npm run dev` (or `npm run dev:turbo`)
- Build: `npm run build`
- Start: `npm start`
- Lint: `npm run lint` • Auto-fix: `npm run lint:fix`
- Types: `npm run typecheck`
- Format: `npm run format` • Check: `npm run format:check`
- CI sanity: `npm run check`
- DB indexes (Mongo): `npm run db:indexes`
- Tests: **No test suite configured.** Recommended: Vitest. Example (once added):  
  `npx vitest run path/to/file.test.ts -t "name"`

## Agent operating rules (Prime / OpenCode)

- Always propose a diff before applying changes that touch more than one file.
- Never commit or push unless Jeremy explicitly says **“commit/push this batch.”**
- Keep changes minimal and batched (Batch 1, Batch 2, …) with lint/build between batches.
- Never edit or print secrets. Use env refs only (`.env.local`, WSL `~/.bashrc`, Vercel vars).
- Follow **AGENTS.md** + **SPEC.md** + `.specify/memory/constitution.md` as the local constitution
  for decisions and trade-offs.

### Agent roles (who does what)

- **Prime**
  - Main architect + strategist for EOL.
  - Orchestrates Plan, Build, and Debug.
  - Keeps work aligned with the Constitution, Tree, Pulse, and Fortress metaphors.

- **Plan**
  - Turns ideas into Spec Kit specs, plans, and task breakdowns.
  - Ensures every feature has a clear user journey and Definition of Done.

- **Build**
  - Implements approved specs and plans in code.
  - Follows TypeScript strict, Next.js 16 server-first, Mongo patterns, and linting rules.

- **Debug**
  - Diagnoses and fixes bugs, regressions, and weird behavior with minimal diffs.
  - Ensures fixes respect existing specs and don’t introduce new debt.

## Linting (Next.js 16)

- `next lint` is deprecated in Next 16. Use the ESLint CLI only:
  - Lint: `npm run lint`
  - Fix: `npm run lint:fix`
- ESLint config is flat at repo root (`eslint.config.mjs`).  
  Keep rules consistent with `eslint-config-next` (core-web-vitals) + TypeScript.

## Code style (TypeScript + Next.js 16 App Router)

- TS only (`allowJs = false`), `strict = true`; Node >= 20 (see `package.json` engines).
- Imports: prefer `@/*` alias (tsconfig paths) over deep relatives; use `import type { T }` for types.

- React/Next:
  - Server Components by default; add `"use client"` only when necessary.
  - Keep components pure; avoid side effects in render.

- Naming:
  - Components / Types / Enums: **PascalCase**
  - Variables / functions: **camelCase**
  - Constants / env vars: **UPPER_SNAKE**

- Filenames:
  - React components: PascalCase (e.g., `PrimePulse.tsx`)
  - Libs/utils: camelCase (e.g., `primeStore.ts`)

- Formatting:
  - Prettier 3 via scripts; honor formatter output.
  - Keep long JSX prop lists on separate lines.

- Linting:
  - Based on `eslint-config-next` core-web-vitals + TS.
  - Fix all **errors** before PRs; keep warnings low.

- Errors:
  - In API routes **prefer** `src/lib/http.ts` helpers (`ok`, `badRequest`, `serverError`, etc.).
  - Do not leak stack traces or sensitive details to clients.

- Validation:
  - Use Zod (`src/lib/validation`) for inputs.
  - Never trust `req.body` / query; always narrow `unknown` → typed.

- Data:
  - Use Mongoose models (`src/models`).
  - Map DB docs to DTOs before sending to clients.

- Env / secrets:
  - Use `.env.local` locally; never commit secrets.
  - Check required envs at startup.

- Commits:
  - Conventional Commits enforced via commitlint/husky (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`).

- Tooling rules:
  - No Cursor (`.cursor/.cursorrules`) or Copilot rules at this time.

## Backend / DB route guardrails (Mongo + App Router)

- Any route that touches Mongo/Mongoose must declare:
  - `export const runtime = "nodejs";`
  - `export const dynamic = "force-dynamic";`

- Reuse a singleton Mongo client via `lib/db.ts` (no per-request connects).
- Validate inputs with Zod before DB ops.
- Validate `ObjectId` for ID routes; return proper 400/404 responses.
- Prefer narrow projections, pagination, and indexed queries to keep endpoints fast.

## Agent roster (Prime Labs squad)

All agents must respect **AGENTS.md**, **SPEC.md**, and the EOL Constitution.

- Agents MUST treat `.specify/memory/constitution.md` as the project constitution and align all
  plans, specs, and code changes with it.

### Prime — Architect & Strategist (`openai/gpt-5.1`)

- Role: Terminal Prime; Main architect + strategist for EOL. Plans work, maintains vision, and
  coordinates Build / Debug / Review.

- Focus:
  - Understands product, UX, and business goals.
  - Breaks big tasks into small, reversible steps.
  - Chooses which agent executes which step.

- Use when:
  - Defining features, refactors, or migrations.
  - Deciding priorities and sequencing.
  - Designing data models, flows, and API contracts.

### Build — Implementation Engine (`openai/gpt-5.1-codex`)

- Role: Code-focused implementer and refactorer.

- Focus:
  - Applies Prime’s plans inside the repo.
  - Produces minimal diffs; full files only when explicitly requested.
  - Keeps TypeScript strict and Next.js 16-compliant.

- Use when:
  - Implementing new features or pages.
  - Refactoring existing components / APIs.
  - Applying lint/type fixes across multiple files.

### Debug — Error & Lint Specialist (`openai/gpt-5.1-codex-mini`)

- Role: Bug hunter; reads stack traces, build errors, ESLint/TS errors.

- Focus:
  - Reconstructs failures from logs.
  - Finds root causes and proposes small, targeted fixes.
  - Avoids large rewrites while investigating.

- Use when:
  - `npm run build` or `npm run lint` fails.
  - Runtime errors show in logs or browser.
  - Type errors or edge-case bugs appear.

### Plan / Intel — External Scout (`xai/grok`)

- Role: Research and intel; pulls in outside best practices and examples.

- Focus:
  - Uses `webfetch` / MCP to read official docs, articles, and patterns.
  - Summarizes key findings and proposes concrete changes to EOL.

- Use when:
  - Evaluating new libraries or approaches.
  - Checking Next.js / Mongo / Auth best practices.
  - Comparing architectures, trade-offs, or performance patterns.

### Review — Senior Code Reviewer (`openai/gpt-4.1`)

- Role: Slow, picky reviewer for important diffs.

- Focus:
  - Security, performance, maintainability, and consistency.
  - Flags risky patterns, unclear names, or duplicated logic.

- Use when:
  - A feature or refactor is “done” and needs a quality pass.
  - Before merging significant changes into `main`.

## Standard workflow (Prime Labs loop)

1. **Prime — clarify the objective**
   - Understand what Jeremy wants (feature, fix, refactor).
   - Break work into 2–5 clear steps and assign agents.

2. **Plan / Intel — optional research**
   - When needed, fetch current best practices or examples from the web.
   - Return short, source-backed notes and recommendations.

3. **Build — implement**
   - Apply changes in small, reviewable diffs.
   - Follow this AGENTS.md, SPEC.md, and repo style.
   - Summarize exactly what changed and why.

4. **Debug — stabilize**
   - Run lint/build/test commands as needed.
   - Fix errors with minimal edits, keeping behavior intact.

5. **Review — final pass**
   - Review diffs for correctness, safety, and clarity.
   - Suggest follow-ups or approve for merge.

Repeat this loop until the feature/refactor is stable, clean, and aligned with the EOL vision.

## Specs / feature work (spec-kit)

- For new features beyond small lint/bugfixes, prefer **spec-kit flow**:  
  **constitution → specify → plan → tasks → implement**.

- SPEC.md should summarize:
  - High-level product vision and user journey.
  - Domain models and core invariants.
  - Guardrails around auth, data integrity, and privacy.

- Agents must treat SPEC.md as a constraint, **not** a suggestion.
