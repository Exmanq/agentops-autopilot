import pino from 'pino';
import { buildPlan } from './planner.js';
import { executePlan } from './executor.js';
const logger = pino({ level: process.env.LOG_LEVEL || 'info', transport: { target: 'pino-pretty' } });
export async function runAutopilot(task, registry) {
    logger.info({ taskId: task.id }, 'planning task');
    const plan = buildPlan(task);
    logger.info({ steps: plan.steps.length }, 'plan built');
    const result = await executePlan(task, plan, registry);
    logger.info({ summary: result.summary }, 'execution complete');
    return result;
}
export * from './types.js';
export * from './planner.js';
export * from './executor.js';
//# sourceMappingURL=index.js.map