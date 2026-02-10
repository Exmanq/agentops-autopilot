# ADR 0001: Monorepo with Turborepo and pnpm

## Context
We need a fast developer experience for a multi-surface agent (API, Web, CLI, tools, evals) with shared TypeScript types.

## Decision
- Use **pnpm workspaces** + **Turborepo** for caching and task orchestration.
- Share base config via `tsconfig.base.json` and root eslint/prettier configs.
- Keep packages small and typed; each exposes its own build/test/lint targets.
- Use Fastify for the API (performance, plugin ecosystem), Next.js for Web, and Vitest for tests.
- Keep observability first-class: pino JSON logs, OTEL spans, Prometheus metrics in API.

## Consequences
- Consistent tooling across packages.
- Easy parallelization in CI.
- Simple path to add more packages (agents, providers) without new tooling decisions.
