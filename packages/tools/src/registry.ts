import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import fetch from 'node-fetch';
import pino from 'pino';

const execAsync = promisify(exec);
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

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

function safeShell(): Tool {
  return {
    name: 'safe-shell',
    async run(input, ctx) {
      if (input.toLowerCase().includes('rm -rf')) {
        throw new Error('Destructive command blocked');
      }
      logger.debug({ cmd: input, cwd: ctx.cwd }, 'safe-shell exec');
      const { stdout, stderr } = await execAsync(input, { cwd: ctx.cwd, env: ctx.env });
      return { output: `${stdout}${stderr}`.trim() };
    }
  };
}

function gitTool(): Tool {
  return {
    name: 'git',
    async run(input, ctx) {
      const cmd = `git ${input}`;
      logger.debug({ cmd }, 'git tool');
      const { stdout, stderr } = await execAsync(cmd, { cwd: ctx.cwd, env: ctx.env });
      return { output: `${stdout}${stderr}`.trim() };
    }
  };
}

function ghTool(): Tool {
  return {
    name: 'gh',
    async run(input, ctx) {
      const cmd = `gh ${input}`;
      logger.debug({ cmd }, 'gh tool');
      const { stdout, stderr } = await execAsync(cmd, { cwd: ctx.cwd, env: ctx.env });
      return { output: `${stdout}${stderr}`.trim() };
    }
  };
}

function httpTool(): Tool {
  return {
    name: 'http',
    async run(input) {
      const res = await fetch(input);
      const text = await res.text();
      return { output: text.slice(0, 500) };
    }
  };
}

function fsTool(): Tool {
  return {
    name: 'filesystem',
    async run(input) {
      return { output: `fs op simulated: ${input}` };
    }
  };
}

export function createInMemoryRegistry(): ToolRegistry {
  const tools = [safeShell(), gitTool(), ghTool(), httpTool(), fsTool()];
  return {
    get: (name) => tools.find((t) => t.name === name),
    list: () => tools
  };
}
