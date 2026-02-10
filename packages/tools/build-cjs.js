#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '../../');
const pkgDir = resolve(__dirname);

execSync(`pnpm exec tsc -p ${resolve(pkgDir, 'tsconfig.cjs.json')}`, {
  stdio: 'inherit',
  cwd: root
});
