# Environment Variables Guide

The following environment variables are required for the Jetski backend to run in production.

## Database
- `DATABASE_URL`: Connection string for PostgreSQL (e.g. Neon DB). Format: `postgresql://user:pass@host/dbname?sslmode=require`

## Security & Auth
- `JWT_SECRET`: A long, random cryptographic string for signing JWT tokens.
- `JWT_EXPIRES_IN`: Duration (e.g. `1d`, `7d`).
- `CORS_ORIGIN`: Comma-separated list of allowed frontend URLs (e.g. `https://myfrontend.com`).
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window (default `900000` / 15 mins).
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window (default `100`).

## External APIs
- `GITHUB_CLIENT_ID`: OAuth Client ID from your GitHub App.
- `GITHUB_CLIENT_SECRET`: OAuth Secret from your GitHub App.
- `GEMINI_API_KEY`: API key from Google AI Studio for Gemini 2.5 Flash.

## Server
- `PORT`: The port the server listens on (Render automatically injects this).
- `NODE_ENV`: Must be exactly `production` when deployed.
- `WEB_CONCURRENCY`: (Optional) Automatically injected by some hosts. Used for scaling workers.

## Observability
- `SENTRY_DSN`: (Optional) If provided, automatically enables Sentry APM and Error Tracking.
