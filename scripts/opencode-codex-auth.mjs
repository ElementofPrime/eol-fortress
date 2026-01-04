import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import https from 'node:https';

const PLUGIN_NAME = 'opencode-openai-codex-auth';
const DEFAULT_REF = 'main';
const DEFAULT_REPO = 'numman-ali/opencode-openai-codex-auth';
const DEFAULT_CONFIG_PATH = 'opencode.jsonc';

function usage(code = 0) {
  const msg = `
Usage:
  node scripts/opencode-codex-auth.mjs check [--ref <git-ref>] [--config <path>]
  node scripts/opencode-codex-auth.mjs update [--ref <git-ref>] [--config <path>] [--write]
  node scripts/opencode-codex-auth.mjs refresh-cache [--cache-root <path>]

Defaults:
  --ref ${DEFAULT_REF}
  --config ${DEFAULT_CONFIG_PATH}

Notes:
  - "check" compares your pinned plugin version vs upstream package.json.
  - "update" fetches upstream config/full-opencode.json then merges in this repo's local settings.
    Use --write to overwrite the config file; without --write it prints a dry-run message.
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

function deepMerge(base, override) {
  if (Array.isArray(base) || Array.isArray(override)) return override ?? base;
  if (typeof base !== 'object' || base === null) return override ?? base;
  if (typeof override !== 'object' || override === null) return base;

  const out = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (key in base) out[key] = deepMerge(base[key], value);
    else out[key] = value;
  }
  return out;
}

function orderConfig(config) {
  const ordered = {};
  const preferred = [
    '$schema',
    'plugin',
    'model',
    'small_model',
    'theme',
    'autoupdate',
    'share',
    'tools',
    'permission',
    'instructions',
    'tui',
    'formatter',
    'provider',
    'agent',
    'mcp',
  ];
  for (const key of preferred) {
    if (key in config) ordered[key] = config[key];
  }
  for (const [key, value] of Object.entries(config)) {
    if (!(key in ordered)) ordered[key] = value;
  }
  return ordered;
}

function resolveCacheRoot(arg) {
  if (arg) return path.resolve(arg);
  return path.join(os.homedir(), '.cache', 'opencode');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cmd = args._[0];
  if (!cmd || cmd === 'help' || cmd === '--help') usage(0);

  if (cmd === 'refresh-cache') {
    const cacheRoot = resolveCacheRoot(args['cache-root']);
    const pluginDir = path.join(cacheRoot, 'node_modules', PLUGIN_NAME);
    const bunLock = path.join(cacheRoot, 'bun.lock');
    const pkgJson = path.join(cacheRoot, 'package.json');

    process.stdout.write(`Cache root: ${cacheRoot}\n`);
    let removed = false;

    if (fs.existsSync(pluginDir)) {
      fs.rmSync(pluginDir, { recursive: true, force: true });
      removed = true;
      process.stdout.write(`Removed: ${pluginDir}\n`);
    } else {
      process.stdout.write(`Not found: ${pluginDir}\n`);
    }

    if (fs.existsSync(bunLock)) {
      fs.rmSync(bunLock, { force: true });
      removed = true;
      process.stdout.write(`Removed: ${bunLock}\n`);
    } else {
      process.stdout.write(`Not found: ${bunLock}\n`);
    }

    if (fs.existsSync(pkgJson)) {
      process.stdout.write(`Left as-is: ${pkgJson}\n`);
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
  const upstreamConfigUrl = `${baseUrl}/config/full-opencode.json`;

  if (cmd === 'check') {
    const pkg = JSON.parse(await fetchText(upstreamPackageUrl));
    const latest = pkg?.version ? String(pkg.version) : null;
    if (!latest) throw new Error('Upstream package.json missing version');
    process.stdout.write(`Pinned: ${pinned ?? '(none)'}\n`);
    process.stdout.write(`Latest: ${latest}\n`);
    if (pinned === latest) process.stdout.write('Status: up to date\n');
    else process.stdout.write('Status: update available\n');
    process.stdout.write(`Upstream: ${DEFAULT_REPO}@${ref}\n`);
    return;
  }

  if (cmd === 'update') {
    const pkg = JSON.parse(await fetchText(upstreamPackageUrl));
    const latest = pkg?.version ? String(pkg.version) : null;
    if (!latest) throw new Error('Upstream package.json missing version');

    const upstream = JSON.parse(await fetchText(upstreamConfigUrl));
    const pluginSpec = `${PLUGIN_NAME}@${latest}`;

    // Start from upstream full config, then merge local repo opinionated settings.
    const merged = deepMerge(upstream, local);

    merged.plugin = Array.isArray(merged.plugin) ? merged.plugin : [];
    merged.plugin = Array.from(
      new Set([
        ...merged.plugin.filter((p) => typeof p === 'string' && !p.startsWith(`${PLUGIN_NAME}@`)),
        pluginSpec,
      ]),
    );

    // Keep upstream OpenAI provider config as authoritative for OAuth plumbing.
    if (upstream?.provider?.openai) {
      merged.provider = merged.provider ?? {};
      merged.provider.openai = upstream.provider.openai;
    }

    const ordered = orderConfig(merged);

    if (!args.write) {
      process.stdout.write(`Dry run: would update ${path.relative(process.cwd(), configPath)}\n`);
      process.stdout.write(`- ${PLUGIN_NAME}: ${pinned ?? '(none)'} -> ${latest}\n`);
      process.stdout.write('Re-run with --write to apply.\n');
      return;
    }

    writeJson(configPath, ordered);
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
