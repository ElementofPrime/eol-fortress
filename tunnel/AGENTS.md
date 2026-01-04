# Tunnel Security & Agent Guide

## Overview
The Prime Tunnel is an authenticated local server (default port 8787) providing secure read/exec access to the repository. All operations are jailed to `REPO_ROOT` with strict allowlisting.

## Authentication
**Required headers** (either works):
- `Authorization: Bearer <TOKEN>`
- `X-Prime-Key: <TOKEN>`

**Environment secrets** (in `.env.tunnel` only):
- `PRIME_TUNNEL_KEY` - primary unified auth key
- `TUNNEL_TOKEN` - fallback auth key (aliased)

⚠️ Never commit actual tokens. `.env.tunnel` is local-only and gitignored.

## Security Boundaries

### Repository Jailing
- All file operations use `REPO_ROOT` as jail boundary
- Paths escaping repo root are rejected with error
- Default `REPO_ROOT` resolves to parent directory of `tunnel/`

### Command Allowlist
- `ALLOW_EXEC=1` required for any command execution
- Hardcoded allowlist: `['git', 'node', 'npm', 'pnpm', 'npx']`
- Commands outside allowlist return 400 error immediately
- Execution timeout: 40 seconds (configurable via `EXEC_TIMEOUT_MS`)

### Output Limits
- Output truncated at 50,000 characters (configurable via `MAX_OUTPUT_CHARS`)
- Truncation indicator: `...(truncated)` appended when limit exceeded
- Both stdout and stderr subject to truncation

## Available Endpoints

### Core API
- `GET /health` - auth-free health check with config info
- `GET /git/status` - porcelain git status within repo root
- `GET /logs/tail` - tail log file (default: `.tunnel/terminal_prime.log`)
- `POST /file/read` - read file line range within repo root
- `POST /exec` - execute allowlisted command (requires `ALLOW_EXEC=1`)

### Implementation Details
- Server: `tunnel/server.mjs` (Node.js ESM, HTTP-only)
- OpenAPI spec: `tunnel/openapi.yaml` (complete schema/examples)
- Default bind: `127.0.0.1:8787` (localhost only)

## Anti-Patterns

### Never casually broaden allowlist
The command allowlist is a critical security boundary. Adding commands expands the attack surface significantly. Each addition requires explicit security review.

### Never disable jail
`REPO_ROOT` jailing prevents directory traversal attacks. Disabling or bypassing jail allows arbitrary filesystem access.

### Never expose auth tokens
Tokens in `.env.tunnel` are secrets. Never log, echo, or commit them. Rotate tokens immediately if suspected exposure.

## Configuration Files

### `.env.tunnel` (local-only)
```
PRIME_TUNNEL_KEY=your_strong_key_here
TUNNEL_PORT=8787
ALLOW_EXEC=0
REPO_ROOT=/path/to/your/repo
EXEC_TIMEOUT_MS=40000
MAX_OUTPUT_CHARS=50000
```

This file should never be committed and exists only for local development.