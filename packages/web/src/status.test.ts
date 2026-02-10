import { describe, expect, it } from 'vitest';
import { healthLabel } from './status.js';

describe('healthLabel', () => {
  it('maps boolean to label', () => {
    expect(healthLabel(true)).toBe('API ready');
    expect(healthLabel(false)).toBe('API unreachable');
  });
});
