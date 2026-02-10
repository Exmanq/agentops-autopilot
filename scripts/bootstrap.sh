#!/usr/bin/env bash
set -euo pipefail

corepack enable || true
pnpm install

if command -v docker >/dev/null 2>&1; then
  echo "[bootstrap] Starting docker compose for Postgres and Redis..."
  docker compose -f docker/docker-compose.yml up -d postgres redis
else
  echo "[bootstrap] docker not found, skipping container start. Use local Postgres/Redis instead."
fi

echo "[bootstrap] Running database preparation..."
pnpm --filter @agentops-autopilot/api run db:migrate

echo "[bootstrap] Ready. Start API with: pnpm --filter @agentops-autopilot/api dev"
