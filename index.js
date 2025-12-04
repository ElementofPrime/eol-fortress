import { run } from './src/cli.js';

async function main() {
  try {
    await run();
  } catch (error) {
    console.error('Unexpected error in Prime‑eBay CLI. See logs for details.');
    if (process.env.DEBUG) {
      console.error(error);
    }
    process.exit(1);
  }
}

main();
