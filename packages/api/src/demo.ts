import { runAutopilot } from '@agentops-autopilot/core';
import { createInMemoryRegistry } from '@agentops-autopilot/tools';

async function main() {
  const registry = createInMemoryRegistry();
  const result = await runAutopilot({ id: 'api-demo', goal: 'Demo via API package', repo: 'demo/repo' }, registry);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
