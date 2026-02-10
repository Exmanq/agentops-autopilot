import { describe, expect, it } from 'vitest';
import { buildPlan } from '@agentops-autopilot/core';

describe('CLI utilities', () => {
  it('builds a plan with steps', () => {
    const plan = buildPlan({ id: 't1', repo: 'demo', goal: 'demo' });
    expect(plan.steps.length).toBeGreaterThan(0);
  });
});
