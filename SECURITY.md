# Security Policy

## Supported Versions
- `0.1.x` is maintained while the project evolves.

## Reporting a Vulnerability
- Email `security@agentops.local` with details and reproduction steps.
- Do not open public issues for vulnerabilities.
- We aim to acknowledge reports within 48 hours.

## Handling Secrets
- Do not commit secrets. Use environment variables and `.env` files excluded from git.
- Prefer local `.env` files and secret managers in production.
- Logs exclude secrets; sensitive values are redacted before logging.
- Use least privilege for database and Redis users.

## Incident Response
- Rotate credentials, audit logs, and patch quickly.
- Publish advisories in CHANGELOG when fixes ship.
