# 🧠 PRIME CONTINUITY PACKET

> Unified memory log for Local Prime ↔ Terminal Prime ↔ Agents

---

## 🧭 Project Identity

- **Project Codename:** EOL Fortress  
- **Repository:** ebay-api-fortress  
- **Root Path (WSL):** `/fortress/ebay-api-fortress`  
- **Primary Entry (CLI):** `node index.js`  
- **Integration Gateway:** `node tunnel/server.mjs`  
- **Runtime:** Node 20+, ES modules (JS-only)  
- **Tooling:** Vitest · ESLint · Prettier · Spec-Kit · OpenCode  

---

## ⚙️ Current Operational State

| System | Status | Notes |

|---------|---------|-------|
| **CLI Foundation** | ✅ Online | Prints “Prime-eBay CLI · foundation online” and exits cleanly. |
| **Tunnel Server** | ✅ Stable | `/health`, `/git/status`, `/file/read`, `/exec` endpoints online. |
| **Tests & Lint** | ✅ Green | All Vitest suites pass; ESLint clean. |
| **Docs & Prompts** | ✅ Updated | README, prompts, AGENTS.md aligned with Node 20 JS spec. |
| **Fastify Experiments** | 🧪 Isolated | Present in `src/routes/` but not active in production. |

---

## 🧩 Agent Network

| Agent | Model | Role | Scope |

|--------|--------|------|-------|
| **Terminal Prime** | GPT-5 (internal runtime) | Execution engine | Direct repo control via tunnel + OpenCode |
| **Local Prime** | GPT-5 (external orchestrator) | Architect / Orchestrator | Communicates via tunnel/server.mjs |
| **Build Agent** | Codex (GPT-5) | Implementation | Generates and modifies code via OpenCode |
| **Debug Agent** | Grok-4 | Diagnostics | Handles CI/test repairs, telemetry |
| **Plan Agent** | GPT-5.2 | Strategic Planner | Spec sequencing + dependency planning |

---

## 🌐 Tunnel Configuration

- **Tunnel Port:** 8787  
- **Default Root Jail:** `/fortress/ebay-api-fortress`  
- **Exec Allowlist:** git, node, npm, pnpm, npx  
- **Security:** `.env.tunnel` (local-only)  
- **Current Quick-Tunnel URL:**  
  *(update per Cloudflare run)*
  <https://threshold-calcium-principal-grad.trycloudflare.com>

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
2. Append new specs to

**Active Specifications**.  
3. Commit with:  

 ```bash
 git add docs/prime-continuity.md
 git commit -m "Update Prime continuity packet"
 git push
 
---

## 🧭 2️⃣ Instructions for Terminal Prime

Commander — issue these orders directly inside the WSL terminal:

```bash
cd /fortress/ebay-api-fortress
mkdir -p docs
nano docs/prime-continuity.md
# (paste the content above)
git add docs/prime-continuity.md
git commit -m "Create Prime continuity packet for Local ↔ Terminal sync"
git push
Updated: Thu Dec 25 16:36:18 MST 2025
