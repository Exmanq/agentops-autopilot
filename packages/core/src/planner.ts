import { randomUUID } from 'node:crypto';
import type { Plan, PlanStep, Task } from './types.js';

const defaultSteps = [
  {
    title: 'Assess codebase and tests',
    command: 'echo "Running lint and smoke tests"',
    description: 'Scan the repository, read docs, and run quick checks.'
  },
  {
    title: 'Implement changes',
    command: 'echo "Applying changes with tools"',
    description: 'Edit code guided by the goal and run targeted commands.'
  },
  {
    title: 'Validate and draft PR',
    command: 'echo "Validating build and drafting PR"',
    description: 'Execute full validation, summarize, and prepare PR.'
  }
];

export function buildPlan(task: Task): Plan {
  const steps: PlanStep[] = defaultSteps.map((step) => ({
    ...step,
    id: randomUUID(),
    title: `${step.title} (${task.goal.slice(0, 40)})`
  }));

  return {
    taskId: task.id,
    steps
  };
}
