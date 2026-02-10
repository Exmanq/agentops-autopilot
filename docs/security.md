# Security Notes

- Secrets live only in environment variables; `.env.example` documents expected keys.
- API rejects requests without `Authorization: Bearer <AUTH_TOKEN>` on mutating routes.
- Pino logs redact bearer tokens, DB URLs, and credentials before writing.
- OTEL spans avoid recording payload bodies; attributes stick to IDs and durations.
- Use dedicated DB user with least privilege; rotate credentials quarterly.
- Enable TLS termination in front of the API when deploying publicly.
- Follow `SECURITY.md` for reporting and disclosure.
