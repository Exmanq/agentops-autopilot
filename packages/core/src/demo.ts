import { runAutopilot } from './index.js';
import { createInMemoryRegistry } from '@agentops-autopilot/tools';

async function main() {
  const registry = createInMemoryRegistry();
  const result = await runAutopilot(
    {
      id: 'demo-task',
      repo: 'demo/repo',
      goal: 'Run demo autopilot',
      instructions: ['touch demo']
    },
    registry
  );

  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
