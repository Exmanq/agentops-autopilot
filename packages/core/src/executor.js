import { context, trace } from '@opentelemetry/api';
import { redact } from './redact.js';
const tracer = trace.getTracer('agentops-autopilot-core');
export async function executePlan(task, plan, registry) {
    const results = [];
    const artifacts = [];
    for (const step of plan.steps) {
        const tool = registry.get('safe-shell');
        const logs = [];
        const span = tracer.startSpan('plan.step', {
            attributes: {
                'task.id': task.id,
                'step.id': step.id,
                'step.title': step.title
            }
        });
        try {
            if (!tool)
                throw new Error('safe-shell tool not registered');
            logs.push({
                stepId: step.id,
                level: 'info',
                timestamp: new Date().toISOString(),
                message: `Executing: ${step.command}`
            });
            const { output } = await context.with(trace.setSpan(context.active(), span), () => tool.run(step.command, { cwd: process.cwd(), env: process.env }));
            logs.push({
                stepId: step.id,
                level: 'info',
                timestamp: new Date().toISOString(),
                message: `Output: ${redact(output)}`
            });
            const success = true;
            results.push({ step, success, output, logs });
            artifacts.push(`artifact-${step.id}.log`);
            span.setStatus({ code: 1 });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logs.push({
                stepId: step.id,
                level: 'error',
                timestamp: new Date().toISOString(),
                message: message
            });
            results.push({ step, success: false, output: message, logs });
            span.setStatus({ code: 2, message });
            span.end();
            break;
        }
        span.end();
    }
    const summary = buildSummary(task, results);
    return {
        task,
        plan,
        results,
        summary,
        artifacts
    };
}
function buildSummary(task, results) {
    const ok = results.filter((r) => r.success).length;
    const total = results.length;
    const failed = results.find((r) => !r.success);
    if (failed) {
        return `Task ${task.id} failed on step "${failed.step.title}": ${failed.output}`;
    }
    return `Task ${task.id} (${task.goal}) completed ${ok}/${total} steps.`;
}
//# sourceMappingURL=executor.js.map