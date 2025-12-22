// Profit: Guarantees the CLI boots cleanly, catching regressions before they hit live ops.
import { describe, it, expect } from 'vitest';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function runCli() {
  const cwd = join(__dirname, '..');

  return new Promise((resolve, reject) => {
    const child = spawn('node', ['index.js'], { cwd });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

describe('Prime-eBay CLI', () => {
  it('starts and exits cleanly', async () => {
    const result = await runCli();
    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Prime-eBay CLI');
  });
});
