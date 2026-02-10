# Contributing

Thanks for helping improve **agentops-autopilot**!

## Getting started
1. Install Node.js 20 and pnpm (`corepack enable` recommended).
2. Run `make setup` to install dependencies and prepare husky hooks.
3. Copy `.env.example` to `.env` and adjust values if you intend to hit external services.

## Dev loop
- `make lint`
- `make test`
- `make demo` (produces `examples/output/demo-run.json`)
- `pnpm --filter @agentops-autopilot/api dev` / `pnpm --filter @agentops-autopilot/web dev` for live work

## Commit style
- Use **conventional commits** (e.g., `feat: add planner step events`).
- CI enforces commitlint.
- Keep changesets up to date: `pnpm changeset` when altering public APIs.

## Adding features
- Add or update docs in `docs/` and examples in `examples/`.
- Include tests in the relevant package using Vitest.
- Keep observability consistent: pino JSON logs, OTEL spans, and `/metrics` exposure in the API.

## CI expectations
- PRs must pass lint, typecheck, tests, build, docker build, SBOM, and CodeQL.
- Ensure `make demo` succeeds in a clean environment.

## Security
- Never commit secrets. Use environment variables and `.env.example` for documentation.
- Report vulnerabilities via SECURITY.md.
