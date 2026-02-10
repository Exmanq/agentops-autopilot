import { createInMemoryRegistry } from './registry.js';

async function main() {
  const registry = createInMemoryRegistry();
  console.log(JSON.stringify(registry.list().map((t) => t.name), null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
