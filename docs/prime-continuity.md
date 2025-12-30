# 🧠 PRIME CONTINUITY PACKET

> Unified memory log for Local Prime ↔ Terminal Prime ↔ Agents

---

## 🧭 Project Identity

- **Project Codename:** EOL Fortress
- **Repository:** ebay-api-fortress
- **Root Path (WSL):** `/fortress/ebay-api-fortress` (or your local clone path)
- **Primary Entry (CLI):** `node index.js`
- **Integration Gateway (Tunnel):** `npm run tunnel` (`node tunnel/server.mjs`)
- **Runtime:** Node 20+, ES modules (JS-only)
- **Tooling:** Vitest · ESLint · Prettier · Spec-Kit · OpenCode

---

## ⚙️ Current Operational State

| System                  | Status      | Notes                                                             |
| ----------------------- | ----------- | ----------------------------------------------------------------- |
| **CLI Foundation**      | ✅ Online   | Prints “Prime-eBay CLI · foundation online” and exits cleanly.    |
| **Tunnel Server**       | ✅ Stable   | `/health`, `/git/status`, `/file/read`, `/exec` endpoints online. |
| **Tests & Lint**        | ✅ Green    | All Vitest suites pass; ESLint clean.                             |
| **Docs & Prompts**      | ✅ Updated  | README, prompts, AGENTS.md aligned with Node 20 JS spec.          |
| **Fastify Experiments** | 🧪 Isolated | Present in `src/routes/` but not active in production.            |

---

## 🧩 Agent Network

> Exact model IDs live in `opencode.jsonc`. Roles below stay stable even if models change.

| Agent                | Role                   | Scope                                               |
| -------------------- | ---------------------- | --------------------------------------------------- |
| **Terminal Prime**   | Execution engine       | Direct repo control via OpenCode and the tunnel     |
| **Local Prime**      | Architect / conductor  | Orchestrates flows, coordinates with Terminal Prime |
| **Element of Prime** | Continuity steward     | Keeps shared memory + agent instructions aligned    |
| **Build Agent**      | Implementation         | Generates and modifies code (spec-aligned)          |
| **Debug Agent**      | Diagnostics            | Fixes tests, errors, regressions                    |
| **Plan Agent**       | Strategic planner      | Specs, plans, tasks using Spec Kit                  |

---

## 🌐 Tunnel Configuration

- **Tunnel Port:** 8787
- **Default Root Jail:** repo root (override via `REPO_ROOT` in `.env.tunnel`)
- **Exec Allowlist:** git, node, npm, pnpm, npx
- **Security:** `.env.tunnel` (local-only)
- **Quick-Tunnel URL (example only):**
  - Cloudflare tunnel URLs change on each run. Do **not** treat this value as source of truth.
  - Always use the URL printed by the latest tunnel startup.

---

## 📦 Active Specifications

### Spec Kit 01 — `pricing:margin-report`

**Objective:**

> Generate profit analytics from SKU, price, and cost data (CSV or JSON).

**Status:**

- Schema: pending Local Prime draft
- Implementation: pending Build Agent deployment
- Endpoint plan:
- `POST /margin/report`
- `GET /margin/schema`

---

## 🧰 Pending Tasks

1. [ ] Confirm tunnel endpoints reachable by Local Prime.
2. [ ] Generate Spec Kit 01 markdown via Local Prime.
3. [ ] Run `spec-kit plan margin-report` (Plan Agent).
4. [ ] Execute and validate build (Build Agent).
5. [ ] Debug + test verification (Debug Agent).
6. [ ] Commit + sync back to Git.

---

## 🧱 Persistence Instructions

When any major milestone occurs:

1. Update this document with ✅ / 🕒 statuses.
2. Append new specs to **Active Specifications**.
3. When Jeremy authorizes a sync, commit with:

```bash
git add docs/prime-continuity.md
git commit -m "Update Prime continuity packet"
git push
```

---

## 🚀 Local Prime Boot Order

When Local Prime starts a new session for this repo:

1. Read: `docs/prime-continuity.md` (this file).
2. Read: `.specify/memory/constitution.md` (EOL Constitution).
3. Read: `docs/agent-handbook.md` (agent roles + coordination rules).
4. Read: `AGENTS.md` (ops + code rules).
5. Optionally read: `opencode.jsonc` and `README.md` for agent wiring and current surface.
6. Confirm tunnel health using the latest tunnel URL:
   - `GET /health`
   - `GET /git/status`

Optional (recommended):
7. Run `npm run doctor` for a fast environment sanity check.
8. Review `docs/decisions.md` for durable guardrails.

---

## 🧭 Instructions for Terminal Prime

- Treat this file as the shared continuity log for Local ↔ Terminal Prime.
- Do **not** create a new file; update this one in-place when milestones happen.
- Only run `git commit` / `git push` when Jeremy explicitly authorizes it in the current session.

_Last updated (human): Thu Dec 25 16:36:18 MST 2025_
