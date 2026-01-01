# Bright Data MCP

This repo is pre-wired for web access via a Bright Data MCP server.

## Where It’s Configured

- `opencode.jsonc` → `mcp.brightData`
- Command: `npx -y @brightdata/mcp`
- Env: `API_TOKEN` must be set where OpenCode runs

## What It’s For

- Market/competitor research inputs (pricing signals, policy changes, docs lookups).
- Verifying eBay API docs or operational guidance when debugging.

## Quick Verification

1. Ensure `API_TOKEN` is present in the OpenCode runtime environment.
2. Start OpenCode with network enabled (if your runtime restricts network).
3. Ask an agent to do a small fetch/search; if MCP is unavailable, it should report that and fall back.
