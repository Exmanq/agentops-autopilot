import { describe, expect, it } from 'vitest';
import { app } from './server.js';

describe('API', () => {
  it('health endpoint returns ok', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    const payload = res.json();
    expect(payload.status).toBe('ok');
  });
});
