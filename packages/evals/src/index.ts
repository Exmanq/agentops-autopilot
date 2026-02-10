import { runAutopilot, type AutopilotResult } from '@agentops-autopilot/core';
import { createInMemoryRegistry } from '@agentops-autopilot/tools';
import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

export type EvalCase = {
  name: string;
  goal: string;
};

export async function runEvals(cases: EvalCase[]): Promise<AutopilotResult[]> {
  const registry = createInMemoryRegistry();
  const results: AutopilotResult[] = [];
  for (const test of cases) {
    logger.info({ case: test.name }, 'running eval');
    const result = await runAutopilot({ id: test.name, goal: test.goal, repo: 'demo/repo' }, registry);
    results.push(result);
  }
  return results;
}

export async function demo(): Promise<void> {
  const results = await runEvals([{ name: 'golden-fix-lint', goal: 'Fix lint issues' }]);
  console.log(JSON.stringify(results, null, 2));
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  demo().catch((err) => {
    logger.error(err);
    process.exit(1);
  });
}
