import { describe, expect, it } from 'vitest';
import { runEvals } from './index.js';

describe('evals', () => {
  it('runs a golden case', async () => {
    const results = await runEvals([{ name: 'golden', goal: 'demo' }]);
    expect(results.length).toBe(1);
    expect(results[0].plan.steps.length).toBeGreaterThan(0);
  });
});
