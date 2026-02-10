#!/usr/bin/env node
import { execSync } from 'node:child_process';
import process from 'node:process';

const checks = [];

function check(label, fn) {
  try {
    const result = fn();
    checks.push({ label, status: 'ok', detail: result ?? '' });
  } catch (err) {
    checks.push({ label, status: 'fail', detail: err instanceof Error ? err.message : String(err) });
  }
}

function logResult() {
  const ok = checks.every((c) => c.status === 'ok');
  console.table(checks.map((c) => ({ Check: c.label, Status: c.status, Detail: c.detail })));
  if (!ok) {
    console.error('\nDoctor found issues. Fix them and re-run.');
    process.exitCode = 1;
  } else {
    console.log('\nAll good!');
  }
}

check('Node >= 20', () => {
  const version = process.versions.node;
  if (Number(version.split('.')[0]) < 20) throw new Error(`Node ${version} detected`);
  return process.versions.node;
});

check('pnpm installed', () => execSync('pnpm -v', { stdio: 'pipe' }).toString().trim());
check('docker (for Postgres/Redis)', () => {
  try {
    return execSync('docker --version', { stdio: 'pipe' }).toString().trim();
  } catch (err) {
    return 'missing (ok if using local services)';
  }
});

check('.env present', () => {
  try {
    execSync('test -f .env');
    return '.env found';
  } catch (err) {
    return 'missing (copy .env.example)';
  }
});

check('pnpm install', () => {
  execSync('pnpm install --ignore-scripts', { stdio: 'pipe' });
  return 'dependencies installed';
});

logResult();
