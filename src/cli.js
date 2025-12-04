import 'dotenv/config';
import readline from 'readline';

/**
 * Prime‑eBay CLI entrypoint (foundation mode).
 *
 * - Loads environment from .env via dotenv
 * - Prints a simple banner
 * - Does NOT perform any eBay API calls yet
 *
 * All future flows must:
 * - Default to sandbox until explicitly promoted
 * - Support dry‑run for any listing‑changing actions
 * - Respect batch size and safety limits
 */
export async function run() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('Prime‑eBay CLI · foundation online');
  console.log('No live eBay API calls are implemented yet.');
  console.log('All future automations will start in SANDBOX and support dry‑run mode.');

  rl.close();
}
