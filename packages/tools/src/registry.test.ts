import { describe, expect, it } from 'vitest';
import { createInMemoryRegistry } from './registry.js';

describe('Tool registry', () => {
  it('blocks destructive commands in safe-shell', async () => {
    const registry = createInMemoryRegistry();
    const shell = registry.get('safe-shell');
    expect(shell).toBeDefined();
    await expect(shell!.run('echo ok', { cwd: process.cwd(), env: process.env })).resolves.toBeTruthy();
    await expect(shell!.run('rm -rf /', { cwd: process.cwd(), env: process.env })).rejects.toBeTruthy();
  });
});
