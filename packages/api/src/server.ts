import fastify from 'fastify';
import { Pool } from 'pg';
import { Redis } from 'ioredis';
import { randomUUID } from 'node:crypto';
import { runAutopilot, type AutopilotResult } from '@agentops-autopilot/core';
import { createInMemoryRegistry } from '@agentops-autopilot/tools';
import { register as metricsRegister, collectDefaultMetrics } from 'prom-client';
import { context, trace } from '@opentelemetry/api';
import { z } from 'zod';

const tracer = trace.getTracer('agentops-autopilot-api');

const API_PORT = Number(process.env.API_PORT || 3001);
const API_HOST = process.env.API_HOST || '0.0.0.0';
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'changeme-local-token';
const POSTGRES_URL = process.env.POSTGRES_URL || 'postgres://agentops:agentops@localhost:5432/agentops';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const app = fastify({
  logger: {
    transport: process.env.NODE_ENV === 'production' ? undefined : { target: 'pino-pretty' },
    level: process.env.LOG_LEVEL || 'info',
    redact: ['req.headers.authorization', 'res.headers']
  }
});

collectDefaultMetrics({ register: metricsRegister });

const registry = createInMemoryRegistry();
const tasks = new Map<string, AutopilotResult>();

const DEMO_MODE = process.env.DEMO_MODE === '1';
let pool: Pool | null = null;
let redis: Redis | null = null;

if (!DEMO_MODE) {
  pool = new Pool({ connectionString: POSTGRES_URL });
  redis = new Redis(REDIS_URL, { lazyConnect: true });
} else {
  app.log.info('DEMO_MODE=1 → skipping Postgres/Redis connections');
}

async function init(): Promise<void> {
  if (DEMO_MODE) return;
  try {
    await pool?.connect();
    app.log.info('Connected to Postgres');
  } catch (err) {
    app.log.warn({ err }, 'Postgres connection failed, continuing with in-memory store');
  }

  try {
    await redis?.connect();
    app.log.info('Connected to Redis');
  } catch (err) {
    app.log.warn({ err }, 'Redis connection failed, using in-memory queue');
  }
}

app.addHook('onRequest', async (req) => {
  const span = tracer.startSpan('http.request', {
    attributes: {
      'http.method': req.method,
      'http.route': req.routerPath || req.url
    }
  });
  req.headers['x-span-id'] = span.spanContext().spanId;
  req.raw.on('close', () => span.end());
});

app.get('/health', async () => {
  return {
    status: 'ok',
    postgres: pool ? pool.totalCount > 0 : DEMO_MODE,
    redis: redis ? redis.status === 'ready' : DEMO_MODE
  };
});

app.get('/metrics', async (_req, reply) => {
  reply.header('Content-Type', metricsRegister.contentType);
  return metricsRegister.metrics();
});

const createTaskSchema = z.object({
  goal: z.string(),
  repo: z.string().default('demo/repo'),
  instructions: z.array(z.string()).optional()
});

app.post('/tasks', async (req, reply) => {
  if (req.headers.authorization !== `Bearer ${AUTH_TOKEN}`) {
    return reply.status(401).send({ error: 'unauthorized' });
  }
  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send(parsed.error.flatten());
  }
  const task = { id: randomUUID(), ...parsed.data };
  app.log.info({ taskId: task.id }, 'received task');

  const span = tracer.startSpan('task.run', {
    attributes: { 'task.id': task.id, 'task.goal': task.goal }
  });

  const result = await context.with(trace.setSpan(context.active(), span), async () =>
    runAutopilot(task, registry)
  );
  tasks.set(task.id, result);
  await record(result);

  span.end();
  return reply.status(201).send({ taskId: task.id, summary: result.summary, artifacts: result.artifacts });
});

app.get('/tasks/:id', async (req, reply) => {
  const id = (req.params as { id: string }).id;
  const result = tasks.get(id);
  if (!result) return reply.status(404).send({ error: 'not found' });
  return result;
});

async function record(result: AutopilotResult) {
  try {
    if (redis && redis.status === 'ready') {
      await redis.xadd('agentops:events', '*', 'taskId', result.task.id, 'summary', result.summary);
    }
  } catch (err) {
    app.log.warn({ err }, 'failed to push to redis stream');
  }
}

export async function start(): Promise<void> {
  await init();
  await app.listen({ host: API_HOST, port: API_PORT });
  app.log.info(`API listening on http://${API_HOST}:${API_PORT}`);
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  start().catch((err) => {
    app.log.error(err, 'Failed to start API');
    process.exit(1);
  });
}
