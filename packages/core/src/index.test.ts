import { describe, expect, it } from 'vitest';
import { runAutopilot } from './index.js';
import { createInMemoryRegistry } from '@agentops-autopilot/tools';

describe('runAutopilot', () => {
  it('executes all steps with in-memory tool', async () => {
    const registry = createInMemoryRegistry();
    const result = await runAutopilot(
      { id: 't1', repo: 'demo/repo', goal: 'demo goal' },
      registry
    );

    expect(result.results.length).toBeGreaterThan(0);
    expect(result.results.every((r) => r.success)).toBe(true);
  });
});
