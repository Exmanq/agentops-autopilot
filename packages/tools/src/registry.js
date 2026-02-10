import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import fetch from 'node-fetch';
import pino from 'pino';
const execAsync = promisify(exec);
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
function safeShell() {
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
function gitTool() {
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
function ghTool() {
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
function httpTool() {
    return {
        name: 'http',
        async run(input) {
            const res = await fetch(input);
            const text = await res.text();
            return { output: text.slice(0, 500) };
        }
    };
}
function fsTool() {
    return {
        name: 'filesystem',
        async run(input) {
            return { output: `fs op simulated: ${input}` };
        }
    };
}
export function createInMemoryRegistry() {
    const tools = [safeShell(), gitTool(), ghTool(), httpTool(), fsTool()];
    return {
        get: (name) => tools.find((t) => t.name === name),
        list: () => tools
    };
}
//# sourceMappingURL=registry.js.map