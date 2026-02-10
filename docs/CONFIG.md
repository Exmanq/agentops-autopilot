# Configuration

All settings are controlled via environment variables.

## Core
- `NODE_ENV` — environment mode (`development`/`production`).
- `LOG_LEVEL` — pino log level (`info`, `debug`, `warn`, `error`).

## API
- `API_PORT` — port for Fastify (default `3001`).
- `API_HOST` — bind host (default `0.0.0.0`).
- `AUTH_TOKEN` — bearer token for API calls (required for mutating endpoints).
- `POSTGRES_URL` — Postgres connection string (default `postgres://agentops:agentops@localhost:5432/agentops`).
- `REDIS_URL` — Redis connection string (default `redis://localhost:6379`).
- `OTEL_SERVICE_NAME` — OTEL service name (default `agentops-autopilot-api`).
- `OTEL_EXPORTER_OTLP_ENDPOINT` — OTLP endpoint for traces (e.g., `http://localhost:4318/v1/traces`).

## Web
- `WEB_PORT` — port for Next.js dev server (default `3000`).
- `NEXT_PUBLIC_API_BASE_URL` — API base URL exposed to the client.

## CLI
- `GITHUB_TOKEN` — GitHub token used for PR simulation. Not required for demo mode.

## Docker
- Compose overrides may set `POSTGRES_URL`, `REDIS_URL`, and OTEL collector endpoints.

## Secrets handling
- Copy `.env.example` to `.env` and adjust.
- Never commit `.env` files; `.gitignore` excludes them.
- Logs redact bearer tokens and connection strings.
