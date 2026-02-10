#!/usr/bin/env bash
set -euo pipefail

# Start API and Web in parallel
pnpm --filter @agentops-autopilot/api dev &
API_PID=$!

pnpm --filter @agentops-autopilot/web dev &
WEB_PID=$!

cleanup() {
  echo "Shutting down dev processes..."
  kill $API_PID $WEB_PID 2>/dev/null || true
}

trap cleanup EXIT
wait
