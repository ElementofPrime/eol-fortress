import fs from 'node:fs';
import path from 'node:path';

function parseMajor(version) {
  const major = Number(String(version).split('.')[0]);
  return Number.isFinite(major) ? major : null;
}

function exists(relPath) {
  return fs.existsSync(path.resolve(process.cwd(), relPath));
}

function status(ok, message) {
  const prefix = ok ? 'OK ' : 'ERR';
  process.stdout.write(`${prefix} ${message}\n`);
  return ok;
}

let ok = true;

const nodeMajor = parseMajor(process.versions.node);
ok =
  status(nodeMajor !== null && nodeMajor >= 20, `Node >=20 (current: ${process.versions.node})`) &&
  ok;

ok = status(exists('package.json'), 'package.json present') && ok;
ok = status(exists('.env.example'), '.env.example present') && ok;
ok =
  status(
    exists('.env') || exists('.env.local'),
    'Local env present (.env or .env.local) [recommended]',
  ) && ok;

ok = status(exists('tunnel/server.mjs'), 'Tunnel server present (tunnel/server.mjs)') && ok;
ok =
  status(exists('.env.tunnel') || exists('.env.tunnel.example'), 'Tunnel env template present') &&
  ok;

process.stdout.write('\nPorts (defaults)\n');
process.stdout.write('- CLI: uses stdio only\n');
process.stdout.write('- Tunnel: 127.0.0.1:8787 (TUNNEL_PORT)\n');
process.stdout.write('- Fastify API experiment: 127.0.0.1:8788 (FORTRESS_API_PORT)\n');

process.stdout.write('\nSuggested commands\n');
process.stdout.write('- npm run check\n');
process.stdout.write('- npm run tunnel\n');

if (!ok) process.exit(1);
