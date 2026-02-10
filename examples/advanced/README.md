# Advanced example

Start API + Web via docker compose:

```bash
make setup
corepack enable
cd docker && docker compose up -d postgres redis
pnpm --filter @agentops-autopilot/api dev
pnpm --filter @agentops-autopilot/web dev
```

Then POST a task:
```bash
curl -H "Authorization: Bearer dev-token" -H "Content-Type: application/json" \
  -d '{"goal":"ship feature","repo":"demo/repo"}' http://localhost:3001/tasks
```
