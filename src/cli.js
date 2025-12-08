// src/cli.js
// Profit: Creates a stable CLI shell that can host multiple money-making commands without rewrites.
import readline from 'readline';
import { getRuntimeEnv } from './config/env.js';

export async function run() {
  const { nodeEnv } = getRuntimeEnv();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('Prime-eBay CLI · foundation online');
  console.log(`Environment: ${nodeEnv}`);
  console.log('No live eBay API calls are implemented yet.');
  console.log('All future automations will start in SANDBOX and support dry-run mode.');

  rl.close();
}
