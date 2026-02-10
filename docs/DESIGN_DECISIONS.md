# Design Decisions (Summary)

- **Monorepo (pnpm + Turborepo):** single toolchain, shared configs, cached tasks.
- **Fastify API:** performance, plugin ecosystem, easy instrumentation.
- **Next.js Web:** fast DX, React server components ready, easy deployment.
- **Vitest:** fast TypeScript-friendly tests.
- **Pino + OTEL:** consistent logging and tracing across services.
- **Redis Streams + Postgres:** queue + durable state separation.
- **Semantic-release + conventional commits:** automated versioning and changelog generation.
