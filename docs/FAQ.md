# FAQ

**Q: Do I need Docker to run the demo?**
A: No. Docker is recommended for Postgres/Redis, but the demo uses in-memory fallbacks.

**Q: How do I view traces?**
A: Point `OTEL_EXPORTER_OTLP_ENDPOINT` to your collector (e.g., `http://localhost:4318/v1/traces`).

**Q: Where are artifacts stored?**
A: Demo artifacts are written to `examples/output/` and returned by the API.

**Q: Can I use Yarn/NPM instead of pnpm?**
A: The repo is optimized for pnpm + Turborepo. Stick to pnpm for reproducibility.

**Q: How do I add a new tool?**
A: Implement the `Tool` interface in `packages/tools/src`, register it in `registry.ts`, and add tests plus docs.

**Q: What is the quickest smoke test?**
A: `make demo` — it builds and runs a simulated task and writes `examples/output/demo-run.json`.

**Q: How do I reset state?**
A: Stop services, delete `docker-data` or reset the DB, and clear Redis keys prefixed with `agentops:`.
