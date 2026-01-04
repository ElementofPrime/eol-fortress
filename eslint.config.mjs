// ESLint flat config for ebay-api-fortress (Prime‑eBay CLI)

import js from '@eslint/js';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '.opencode/**',
      '**/.opencode/**',
      '.sisyphus/**',
      '**/.sisyphus/**',
      '.tunnel/**',
      '**/.tunnel/**',
    ],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },
];
