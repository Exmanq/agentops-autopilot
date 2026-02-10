import { demo } from './index.js';

demo().catch((err) => {
  console.error(err);
  process.exit(1);
});
