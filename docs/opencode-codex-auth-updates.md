# Codex OAuth Plugin Updates (OpenCode)

This repo uses the Codex OAuth plugin: `opencode-openai-codex-auth`.

Upstream: <https://github.com/numman-ali/opencode-openai-codex-auth>

## What “Update” Means Here

We keep our repo-specific config (agents, instructions, MCP), but sync the upstream OAuth/OpenAI
provider config from the plugin repo’s `config/full-opencode.json`, and pin the plugin version.

## Recommended Workflow

From `ebay-api-fortress/`:

1. Check for updates:
   - `npm run opencode:codex-auth:check`
2. Apply update (writes `opencode.jsonc`):
   - `npm run opencode:codex-auth:update`
3. Refresh plugin cache (forces reinstall on restart):
   - `npm run opencode:codex-auth:refresh-cache`
4. Restart OpenCode.

Notes:

- If your environment restricts network, the check/update steps may require running OpenCode with
  network enabled.
- If VS Code diagnostics linger after changes, run “TypeScript: Restart TS server”.
