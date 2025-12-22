// Vitest config for ebay-api-fortress (Prime‑eBay CLI)
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
  },
});
