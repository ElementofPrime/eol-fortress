# Scripts Reference

This directory contains utility scripts for eBay API Fortress maintenance and OpenCode plugin management.

## Available Scripts

### `doctor.mjs`

Repository health check script that validates the development environment.

**Purpose**: Ensures all required files, Node.js version, and dependencies are present for development.

**Usage**: `npm run doctor`

**Behavior**:

- Checks Node.js >= 20 compatibility
- Verifies presence of `package.json`, `.env.example`, and environment files
- Validates tunnel server files and templates
- Exits with code 1 on failure (halts CI/automation)
- Displays default ports and suggested commands

### OpenCode Plugin Scripts

Both `opencode-codex-auth.mjs` and `opencode-supermemory.mjs` provide similar plugin management workflows:

#### `opencode-codex-auth.mjs`

Manages the `opencode-openai-codex-auth` plugin for OpenAI authentication integration.

#### `opencode-supermemory.mjs`

Manages the `opencode-supermemory` plugin for knowledge base integration.

### Common Operations

#### `check`

Compares locally pinned plugin version against upstream repository.

```bash
npm run opencode:codex-auth:check
npm run opencode:supermemory:check
```

#### `update`

Updates plugin version pin in local configuration.

**⚠️ Important**: Always run dry-run first to preview changes:

```bash
npm run opencode:codex-auth:update:dry
npm run opencode:supermemory:update:dry
```

Apply changes with `--write` flag:

```bash
npm run opencode:codex-auth:update
npm run opencode:supermemory:update
```

**Note**: `update --write` overwrites `opencode.jsonc`. Review dry-run output before applying.

#### `refresh-cache`

Clears plugin installation cache for fresh reinstall.

```bash
npm run opencode:codex-auth:refresh-cache
npm run opencode:supermemory:refresh-cache
```

Restart OpenCode after cache refresh to complete reinstallation.

## Safe Usage Guidelines

1. **Always dry-run updates**: Use `:dry` scripts first to see what will change
2. **Backup config**: Consider backing up `opencode.jsonc` before major updates
3. **Check versions**: Run `check` commands before `update` to understand version gaps
4. **Refresh after updates**: Run `refresh-cache` and restart OpenCode after plugin updates
5. **Doctor first**: Run `npm run doctor` to validate environment setup

## Configuration

- Plugin configurations stored in `opencode.jsonc`
- Default upstream references: `main` branch
- Scripts respect alternative `--ref` and `--config` arguments for customization
