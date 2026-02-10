import pino from 'pino';
import { buildPlan } from './planner.js';
import { executePlan } from './executor.js';
import type { AutopilotResult, Task, ToolRegistry } from './types.js';

const logger = pino({ level: process.env.LOG_LEVEL || 'info', transport: { target: 'pino-pretty' } });

export async function runAutopilot(task: Task, registry: ToolRegistry): Promise<AutopilotResult> {
  logger.info({ taskId: task.id }, 'planning task');
  const plan = buildPlan(task);
  logger.info({ steps: plan.steps.length }, 'plan built');

  const result = await executePlan(task, plan, registry);
  logger.info({ summary: result.summary }, 'execution complete');
  return result;
}

export type { AutopilotResult, Task, ToolRegistry } from './types.js';
export * from './planner.js';
export * from './executor.js';
