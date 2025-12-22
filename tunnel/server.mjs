/* eslint-env node */
import { setTimeout as setTimeoutFn, clearTimeout as clearTimeoutFn } from 'node:timers';
import http from 'node:http';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { URL } from 'node:url';

function loadEnvFile(p) {
  if (!fs.existsSync(p)) return;
  const txt = fs.readFileSync(p, 'utf8');
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const k = m[1];
    let v = m[2] ?? '';
    v = v.replace(/^['"]|['"]$/g, '');
    if (!process.env[k]) process.env[k] = v;
  }
}

loadEnvFile(path.resolve(process.cwd(), '.env.tunnel'));

const PORT = Number(process.env.TUNNEL_PORT || 8787);
const TOKEN = String(process.env.TUNNEL_TOKEN || '');
const REPO_ROOT = path.resolve(process.env.REPO_ROOT || '/mnt/d/Dev/ebay-api-fortress');
const ALLOW_EXEC = String(process.env.ALLOW_EXEC || '0') === '1';
const EXEC_TIMEOUT_MS = Number(process.env.EXEC_TIMEOUT_MS || 40000);
const MAX_OUTPUT_CHARS = Number(process.env.MAX_OUTPUT_CHARS || 50000);

if (!TOKEN || TOKEN === 'CHANGE_ME') {
  console.error('Set a strong TUNNEL_TOKEN in .env.tunnel');
  process.exit(1);
}

function json(res, code, body) {
  res.writeHead(code, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(JSON.stringify(body, null, 2));
}

function authOk(req) {
  const h = req.headers['authorization'] || '';
  const token = String(h).startsWith('Bearer ') ? String(h).slice(7) : String(h);
  return token === TOKEN;
}

function jail(relPath) {
  const abs = path.resolve(REPO_ROOT, relPath);
  if (!abs.startsWith(REPO_ROOT)) throw new Error('Path escapes repo root');
  return abs;
}

function truncate(s) {
  if (s.length <= MAX_OUTPUT_CHARS) return { text: s, truncated: false };
  return { text: s.slice(0, MAX_OUTPUT_CHARS) + '\n…(truncated)', truncated: true };
}

function run(cmd, args, cwdAbs) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (obj) => {
      if (settled) return;
      settled = true;
      resolve(obj);
    };

    let child;
    try {
      child = spawn(cmd, args, { cwd: cwdAbs, shell: false });
    } catch (err) {
      return finish({
        ok: false,
        code: -1,
        signal: null,
        stdout: '',
        stderr: String(err?.message || err),
        stdout_truncated: false,
        stderr_truncated: false,
      });
    }

    let stdout = '';
    let stderr = '';

    const killTimer = setTimeoutFn(() => {
      try {
        child.kill('SIGKILL');
      } catch {
        /* ignore */
      }
    }, EXEC_TIMEOUT_MS);

    child.on('error', (err) => {
      clearTimeoutFn(killTimer);
      finish({
        ok: false,
        code: -1,
        signal: null,
        stdout: '',
        stderr: String(err?.message || err),
        stdout_truncated: false,
        stderr_truncated: false,
      });
    });

    child.stdout.on('data', (d) => (stdout += d.toString('utf8')));
    child.stderr.on('data', (d) => (stderr += d.toString('utf8')));

    child.on('close', (code, signal) => {
      clearTimeoutFn(killTimer);
      const out = truncate(stdout);
      const err = truncate(stderr);
      finish({
        ok: code === 0,
        code,
        signal,
        stdout: out.text,
        stderr: err.text,
        stdout_truncated: out.truncated,
        stderr_truncated: err.truncated,
      });
    });
  });
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let buf = '';
    req.on('data', (c) => (buf += c));
    req.on('end', () => {
      if (!buf) return resolve(null);
      try {
        resolve(JSON.parse(buf));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const method = req.method || 'GET';

    // Auth-free health for easy testing
    if (method === 'GET' && url.pathname === '/health') {
      return json(res, 200, {
        ok: true,
        time: new Date().toISOString(),
        repoRoot: REPO_ROOT,
        allowExec: ALLOW_EXEC,
      });
    }

    if (!authOk(req)) return json(res, 401, { ok: false, error: 'Unauthorized' });

    if (method === 'GET' && url.pathname === '/git/status') {
      const r = await run('/usr/bin/git', ['status', '--porcelain=v1', '-b'], REPO_ROOT);

      return json(res, 200, r);
    }

    if (method === 'GET' && url.pathname === '/logs/tail') {
      const rel = url.searchParams.get('path') || '.tunnel/terminal_prime.log';
      const n = Number(url.searchParams.get('n') || 200);
      const abs = jail(rel);
      if (!fs.existsSync(abs)) return json(res, 200, { ok: true, path: rel, lines: [] });
      const text = fs.readFileSync(abs, 'utf8');
      const lines = text.split(/\r?\n/);
      return json(res, 200, { ok: true, path: rel, lines: lines.slice(-Math.max(1, n)) });
    }

    if (method === 'POST' && url.pathname === '/file/read') {
      const body = await readBody(req);
      const rel = String(body?.path || '');
      const start = Number(body?.startLine || 1);
      const end = Number(body?.endLine || start + 200);
      if (!rel) return json(res, 400, { ok: false, error: 'path required' });

      const abs = jail(rel);
      const text = fs.readFileSync(abs, 'utf8');
      const lines = text.split(/\r?\n/);
      const slice = lines.slice(Math.max(0, start - 1), Math.min(lines.length, end));
      return json(res, 200, {
        ok: true,
        path: rel,
        startLine: start,
        endLine: Math.min(lines.length, end),
        content: slice.join('\n'),
        totalLines: lines.length,
      });
    }

    if (method === 'POST' && url.pathname === '/exec') {
      if (!ALLOW_EXEC) return json(res, 403, { ok: false, error: 'Exec disabled (ALLOW_EXEC=0)' });

      const body = await readBody(req);
      const cmd = String(body?.cmd || '');
      const args = Array.isArray(body?.args) ? body.args.map(String) : [];
      const cwdRel = String(body?.cwdRel || '.');
      const cwdAbs = jail(cwdRel);

      const ALLOWED = new Set(['git', 'node', 'npm', 'pnpm', 'npx']);
      if (!ALLOWED.has(cmd))
        return json(res, 400, { ok: false, error: `Command not allowed: ${cmd}` });

      const r = await run(cmd, args, cwdAbs);
      return json(res, 200, { ...r, cmd, args, cwdRel });
    }

    return json(res, 404, { ok: false, error: 'Not found' });
  } catch (e) {
    return json(res, 500, { ok: false, error: e?.message || 'Server error' });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Prime Tunnel API listening on http://127.0.0.1:${PORT}`);
});
