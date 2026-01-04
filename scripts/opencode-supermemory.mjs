import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import https from 'node:https';

const PLUGIN_NAME = 'opencode-supermemory';
const DEFAULT_REF = 'main';
const DEFAULT_REPO = 'supermemoryai/opencode-supermemory';
const DEFAULT_CONFIG_PATH = 'opencode.jsonc';

function usage(code = 0) {
  const msg = `
Usage:
  node scripts/opencode-supermemory.mjs check [--ref <git-ref>] [--config <path>]
  node scripts/opencode-supermemory.mjs update [--ref <git-ref>] [--config <path>] [--write]
  node scripts/opencode-supermemory.mjs refresh-cache [--cache-root <path>] [--config-root <path>]

Defaults:
  --ref ${DEFAULT_REF}
  --config ${DEFAULT_CONFIG_PATH}

Notes:
  - "check" compares your pinned plugin version vs upstream package.json.
  - "update" pins the latest version in your project config (does not run bunx installer).
  - "refresh-cache" removes cached plugin installs so OpenCode can reinstall on restart.
`;
  process.stdout.write(msg.trimStart());
  process.stdout.write('\n');
  process.exit(code);
}

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (!a.startsWith('--')) {
      out._.push(a);
      continue;
    }
    const key = a.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) {
      out[key] = true;
    } else {
      out[key] = value;
      i += 1;
    }
  }
  return out;
}

function stripJsonc(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|\s)\/\/.*$/gm, '$1')
    .trim();
}

function readJsonc(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(stripJsonc(raw));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function getPinnedVersion(config) {
  const plugins = Array.isArray(config?.plugin) ? config.plugin : [];
  const entry = plugins.find((p) => typeof p === 'string' && p.startsWith(`${PLUGIN_NAME}@`));
  if (!entry) return null;
  return entry.slice(`${PLUGIN_NAME}@`.length) || null;
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const { statusCode, headers } = res;
        if (statusCode && statusCode >= 300 && statusCode < 400 && headers.location) {
          res.resume();
          return resolve(fetchText(headers.location));
        }
        if (statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${statusCode} for ${url}`));
        }
        res.setEncoding('utf8');
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

function resolveCacheRoot(arg) {
  if (arg) return path.resolve(arg);
  return path.join(os.homedir(), '.cache', 'opencode');
}

function resolveConfigRoot(arg) {
  if (arg) return path.resolve(arg);
  return path.join(os.homedir(), '.config', 'opencode');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cmd = args._[0];
  if (!cmd || cmd === 'help' || cmd === '--help') usage(0);

  if (cmd === 'refresh-cache') {
    const cacheRoot = resolveCacheRoot(args['cache-root']);
    const configRoot = resolveConfigRoot(args['config-root']);

    const targets = [
      path.join(cacheRoot, 'node_modules', PLUGIN_NAME),
      path.join(configRoot, 'node_modules', PLUGIN_NAME),
      path.join(cacheRoot, 'bun.lock'),
      path.join(configRoot, 'bun.lock'),
    ];

    process.stdout.write(`Cache root: ${cacheRoot}\n`);
    process.stdout.write(`Config root: ${configRoot}\n`);

    let removed = false;
    for (const p of targets) {
      if (!fs.existsSync(p)) continue;
      fs.rmSync(p, { recursive: true, force: true });
      removed = true;
      process.stdout.write(`Removed: ${p}\n`);
    }
    if (!removed) process.stdout.write('No cache entries removed.\n');
    process.stdout.write('Restart OpenCode after refresh.\n');
    return;
  }

  const ref = String(args.ref || DEFAULT_REF);
  const configPath = path.resolve(String(args.config || DEFAULT_CONFIG_PATH));
  const local = readJsonc(configPath);
  const pinned = getPinnedVersion(local);

  const baseUrl = `https://raw.githubusercontent.com/${DEFAULT_REPO}/${ref}`;
  const upstreamPackageUrl = `${baseUrl}/package.json`;

  const pkg = JSON.parse(await fetchText(upstreamPackageUrl));
  const latest = pkg?.version ? String(pkg.version) : null;
  if (!latest) throw new Error('Upstream package.json missing version');

  if (cmd === 'check') {
    process.stdout.write(`Pinned: ${pinned ?? '(none)'}\n`);
    process.stdout.write(`Latest: ${latest}\n`);
    if (pinned === latest) process.stdout.write('Status: up to date\n');
    else process.stdout.write('Status: update available\n');
    process.stdout.write(`Upstream: ${DEFAULT_REPO}@${ref}\n`);
    return;
  }

  if (cmd === 'update') {
    const pluginSpec = `${PLUGIN_NAME}@${latest}`;
    const updated = { ...local };
    updated.plugin = Array.isArray(updated.plugin) ? updated.plugin : [];
    updated.plugin = Array.from(
      new Set([
        ...updated.plugin.filter((p) => typeof p === 'string' && !p.startsWith(`${PLUGIN_NAME}@`)),
        pluginSpec,
      ]),
    );

    if (!args.write) {
      process.stdout.write(`Dry run: would update ${path.relative(process.cwd(), configPath)}\n`);
      process.stdout.write(`- ${PLUGIN_NAME}: ${pinned ?? '(none)'} -> ${latest}\n`);
      process.stdout.write('Re-run with --write to apply.\n');
      return;
    }

    writeJson(configPath, updated);
    process.stdout.write(`Updated ${path.relative(process.cwd(), configPath)}\n`);
    process.stdout.write(`- ${PLUGIN_NAME}: ${pinned ?? '(none)'} -> ${latest}\n`);
    process.stdout.write('Next: run refresh-cache and restart OpenCode.\n');
    return;
  }

  usage(1);
}

main().catch((err) => {
  process.stderr.write(`${err?.stack || err?.message || String(err)}\n`);
  process.exit(1);
});
