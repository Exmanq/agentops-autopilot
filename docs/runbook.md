# Runbook

## Boot
1. Copy `.env.example` to `.env` and fill values.
2. Run `make setup`.
3. Start backing services: `docker compose -f docker/docker-compose.yml up -d postgres redis`.
4. Start API: `pnpm --filter @agentops-autopilot/api dev`.
5. Start Web: `pnpm --filter @agentops-autopilot/web dev`.
6. (Optional) Run CLI demo: `pnpm --filter @agentops-autopilot/cli demo`.

## Health Checks
- `GET /health` — basic health probe.
- `GET /metrics` — Prometheus metrics.
- Logs: JSON via pino.
- Traces: OTEL OTLP exporter (`OTEL_EXPORTER_OTLP_ENDPOINT`).

## Failure Scenarios
- **Postgres down**: API returns 503 on task creation. Mitigation: restart DB, re-run `db:migrate`.
- **Redis down**: Queue falls back to in-memory for dev; in prod, API will log and reject enqueue until Redis returns.
- **Slow tasks**: Increase `TASK_TIMEOUT_MS` in core executor or scale workers.

## Deployment
- Build containers: `docker compose -f docker/docker-compose.yml build`.
- Migrations: `pnpm --filter @agentops-autopilot/api run db:migrate`.
- Run `make demo` post-deploy as smoke test.

## Observability
- Add OTEL collector endpoint via env.
- Use `LOG_LEVEL=debug` for verbose traces; avoid in production.

## Incident Response
1. Capture logs + traces for failing task IDs.
2. Run `make doctor` to validate env.
3. Roll back via git tag `v0.1.0` if needed.
