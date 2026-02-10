export type Task = {
  id: string;
  repo: string;
  goal: string;
  instructions?: string[];
  author?: string;
};

export type PlanStep = {
  id: string;
  title: string;
  command: string;
  description: string;
};

export type Plan = {
  taskId: string;
  steps: PlanStep[];
};

export type StepLog = {
  stepId: string;
  message: string;
  level: 'info' | 'warn' | 'error';
  timestamp: string;
};

export type StepResult = {
  step: PlanStep;
  success: boolean;
  output: string;
  logs: StepLog[];
};

export type AutopilotResult = {
  task: Task;
  plan: Plan;
  results: StepResult[];
  summary: string;
  artifacts: string[];
};

export type ToolContext = {
  cwd: string;
  env: Record<string, string | undefined>;
};

export type Tool = {
  name: string;
  run: (input: string, ctx: ToolContext) => Promise<{ output: string }>;
};

export type ToolRegistry = {
  get: (name: string) => Tool | undefined;
  list: () => Tool[];
};
