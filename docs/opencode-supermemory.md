# Supermemory Plugin (Persistent Memory)

Plugin: `opencode-supermemory` (Supermemory)

Repo: <https://github.com/supermemoryai/opencode-supermemory>

## What It Does

- Injects relevant **user** + **project** memories into the first message of a session.
- Watches for “remember/save this/don’t forget” phrases and nudges the agent to store a memory.
- Adds a `supermemory` tool for `add/search/list/profile/forget`.

## Setup (Required)

1. Get an API key from <https://console.supermemory.ai>
2. Set it in the environment where OpenCode runs:
   - `export SUPERMEMORY_API_KEY="sm_..."`

Alternative (config file):

- Create `~/.config/opencode/supermemory.jsonc`:

```jsonc
{ "apiKey": "sm_..." }
```

## Privacy / Safety

- Anything wrapped in `<private>...</private>` is not stored by the plugin.
- Treat secrets as private by default: tokens, keys, refresh tokens, customer data, etc.
- Canonical project truth still lives in `docs/prime-continuity.md`; Supermemory is an accelerator, not a replacement.

## Optional: Initialize Project Memory

The plugin’s upstream installer can create a `/supermemory-init` command. If you choose to use it, run it once per repo to index conventions and workflows.

## Updates

From `ebay-api-fortress/`:

- Check version: `npm run opencode:supermemory:check`
- Apply pin update (writes `opencode.jsonc`): `npm run opencode:supermemory:update`
- Refresh plugin cache (forces reinstall on restart): `npm run opencode:supermemory:refresh-cache`

Note: check/update fetch from GitHub and may require network-enabled OpenCode (or approval) in restricted environments.
