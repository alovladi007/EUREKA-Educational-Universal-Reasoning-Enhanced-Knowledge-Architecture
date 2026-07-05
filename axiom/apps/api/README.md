# axiom-api

The AXIOM API gateway and modular monolith. Phase 0 runs the identity and
dashboard domains in one FastAPI process.

## What it does today (Phase 0)

- Verifies EUREKA-issued bearer tokens (mock, or HMAC HS256 with the shared
  secret) and syncs a minimal user record. AXIOM never stores a password.
- Serves GET /health, GET /ready, GET /metrics, GET /openapi.json, GET /docs.
- Serves GET /api/v1/me and GET /api/v1/dashboard/summary for the signed-in
  user. The dashboard is intentionally empty and honest: every teaching and
  assessment module is labeled by readiness.

## Endpoints

- GET /health - liveness. Returns { status, service, version }.
- GET /ready - readiness. Runs SELECT 1 against the database.
- GET /metrics - Prometheus metrics (when the instrumentator is installed).
- GET /api/v1/me - the signed-in user (requires a bearer token).
- GET /api/v1/dashboard/summary - landing dashboard (requires a bearer token).

## Environment (prefix AXIOM_)

- AXIOM_ENV - development, staging, or production.
- AXIOM_DATABASE_URL - async SQLAlchemy URL (postgresql+asyncpg://...).
- AXIOM_REDIS_URL - Redis URL for cache and Celery.
- AXIOM_IDENTITY_PROVIDER - mock, hmac, or jwks (jwks is planned).
- AXIOM_EUREKA_JWT_SECRET - shared HS256 secret for the hmac provider.
- AXIOM_EUREKA_JWT_ALGORITHM - defaults to HS256.
- AXIOM_CORS_ORIGINS - allowed origins (defaults include 4100 and 4040).

## Run locally

    python -m venv .venv && . .venv/bin/activate
    pip install -r requirements-dev.txt
    pip install -e ../../packages/shared_schemas -e ../../packages/events -e ../../packages/math_core
    export AXIOM_IDENTITY_PROVIDER=mock
    uvicorn app.main:app --reload --port 8400

## Migrations

    export AXIOM_DATABASE_URL=postgresql+asyncpg://axiom:axiom@localhost:5440/axiom
    alembic upgrade head
    alembic downgrade base   # verify down is clean

## Tests

    pip install -r requirements-dev.txt
    pytest        # runs fully offline on SQLite with the mock identity
