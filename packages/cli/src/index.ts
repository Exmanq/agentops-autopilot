#!/usr/bin/env node
import { Command } from 'commander';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import pino from 'pino';
import { buildPlan, runAutopilot } from '@agentops-autopilot/core';
import { createInMemoryRegistry } from '@agentops-autopilot/tools';

const program = new Command();
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

program
  .name('agentops')
  .description('AgentOps Autopilot CLI')
  .version('0.1.0');

program
  .command('plan')
  .description('Create a plan for a goal')
  .requiredOption('-g, --goal <goal>', 'task goal')
  .option('-r, --repo <repo>', 'repository slug', 'demo/repo')
  .action((opts) => {
    const plan = buildPlan({ id: randomUUID(), goal: opts.goal, repo: opts.repo });
    console.log(JSON.stringify(plan, null, 2));
  });

program
  .command('run')
  .description('Run autopilot for a goal')
  .requiredOption('-g, --goal <goal>', 'task goal')
  .option('-r, --repo <repo>', 'repository slug', 'demo/repo')
  .option('-o, --out <path>', 'write result to file', 'examples/output/cli-run.json')
  .action(async (opts) => {
    const registry = createInMemoryRegistry();
    const result = await runAutopilot({ id: randomUUID(), goal: opts.goal, repo: opts.repo }, registry);
    fs.mkdirSync(new URL('../../examples/output', import.meta.url), { recursive: true });
    fs.writeFileSync(new URL(`../../${opts.out}`, import.meta.url), JSON.stringify(result, null, 2));
    console.log(result.summary);
  });

program
  .command('pr')
  .description('Simulate PR creation with summary')
  .requiredOption('-t, --title <title>', 'PR title')
  .option('-b, --body <body>', 'PR body', 'Autopilot summary')
  .action((opts) => {
    console.log(`Draft PR prepared: ${opts.title}\n\n${opts.body}`);
  });

program
  .command('demo')
  .description('Run the demo pipeline')
  .action(async () => {
    const registry = createInMemoryRegistry();
    const result = await runAutopilot({ id: 'demo-cli', goal: 'Demo pipeline', repo: 'demo/repo' }, registry);
    console.log(JSON.stringify(result, null, 2));
  });

program.parseAsync().catch((err) => {
  logger.error(err);
  process.exit(1);
});
