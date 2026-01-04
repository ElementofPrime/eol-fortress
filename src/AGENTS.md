# src/ Directory Guide

## Overview

The `src/` directory contains the core business logic for the eBay API Fortress. All code here is ESM-only (imports/exports only) and follows Node >=20 patterns. This is where actual eBay API interactions, CLI logic, and reusable utilities live.

## Module Boundaries & Entrypoints

- `src/cli.js` - Main CLI entry point that wires commands and environment detection
- `src/config/env.js` - Centralized environment validation and eBay configuration
- `src/lib/` - Reusable business logic modules (margin calculations, auth, API clients)
- `src/routes/` - Experimental Fastify server routes (excluded from TypeScript build)

## Key Conventions (Deviations from Root)

**ESM-Only Imports/Exports**: Every file must use `import`/`export` - no CommonJS `require`/`module.exports`.

**Environment-First Pattern**: Always use `getRuntimeEnv()` or `getEbayEnv()` from `src/config/env.js` instead of direct `process.env` access.

**Pure Functions**: Business logic in `src/lib/` should be pure when possible (see `margin.js`).

**Zod Validation**: Use Zod schemas for external API responses (see `ebay-auth.js`).

## Where to Look

- `src/cli.js` - CLI bootstrapping and command routing foundation
- `src/config/env.js` - Environment validation and eBay endpoint configuration
- `src/lib/ebay-auth.js` - OAuth flow, token management, and Axios client setup
- `src/lib/margin.js` - Margin calculation logic with fee handling
- `src/routes/server.js` - Experimental Fastify server (excluded from TS build)

## Anti-Patterns

- Don't access `process.env` directly in `src/lib/` modules - use the config layer
- Don't mix CommonJS and ESM - this directory is strictly ESM-only
- Don't put business logic in routes - keep them thin and delegate to `src/lib/`
- Don't assume environment values exist - validate through `src/config/env.js`