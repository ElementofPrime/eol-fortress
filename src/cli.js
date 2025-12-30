// ebay-api-fortress/src/cli.js
// Profit: Creates a stable CLI shell that can host multiple money-making commands without rewrites.
import fs from 'node:fs';
import { getRuntimeEnv } from './config/env.js';

function println(line) {
  fs.writeSync(1, `${line}\n`);
}

export async function run() {
  const { nodeEnv } = getRuntimeEnv();

  println('Prime-eBay CLI · foundation online');
  println(`Environment: ${nodeEnv}`);
  println('No live eBay API calls are implemented yet.');
  println('All future automations will start in SANDBOX and support dry-run mode.');
}
