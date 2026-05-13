# EUREKA observability

Distributed tracing, structured logs, and the dev dashboard. Landed in
**Phase 3 Session 3.4 (2026-05)**.

## Quick start

```bash
cd eureka
docker compose --profile dev-obs up -d jaeger      # bring up the collector + UI
docker compose up -d api-core                       # api-core auto-points at jaeger via compose env
```

Open <http://localhost:16686>, pick `api-core` from the Service dropdown, hit "Find traces". You should see one span tree per HTTP request, with nested `SELECT` spans from SQLAlchemy.

## Architecture

```
┌──────────────────────────┐       OTLP gRPC :4317
│  api-core (FastAPI)      │ ─────────────────────────┐
│  - FastAPIInstrumentor   │                          │
│  - SQLAlchemyInstrumentor│                          ▼
│  - RedisInstrumentor     │                ┌──────────────────┐
│  - HTTPXClientInstrumentor│                │  Jaeger          │
│  - LoggingInstrumentor   │                │  (all-in-one)    │
│                          │                │  UI :16686       │
│  + structlog (JSON)      │                │  OTLP :4317/4318 │
│  + RequestContextMW      │                └──────────────────┘
└──────────────────────────┘
            │ │
            │ └── structured log lines → stdout → docker logs
            │     {timestamp, level, service, request_id,
            │      user_id, org_id, trace_id, span_id, event, ...}
            ▼
        Prod log shipper (Phase 11) → Loki / Datadog / etc.
```

## What's instrumented

| Concern | Library | Where |
|---|---|---|
| HTTP server spans | `FastAPIInstrumentor` | `app/core/observability.py` |
| DB queries | `SQLAlchemyInstrumentor` (binds to `app.core.database.engine`) | same |
| Redis | `RedisInstrumentor` | same |
| Outgoing HTTP | `HTTPXClientInstrumentor` | same |
| Stdlib log records | `LoggingInstrumentor` (adds `trace_id`/`span_id` to log records) | same |
| Per-request context (request_id, user_id, org_id) | `RequestContextMiddleware` + structlog contextvars | same |

`X-Request-ID` is honoured if the client sends one; otherwise we generate a fresh `uuid4().hex` and echo it back on the response so it can be quoted in support tickets and stitched together with logs.

## Adding observability to a new service

Three steps, drop-in:

1. Copy `eureka/services/api-core/app/core/observability.py` into `your-service/app/core/observability.py` **unchanged**.

2. Append to `your-service/requirements.txt`:

   ```text
   structlog>=24.1,<25
   opentelemetry-api>=1.27
   opentelemetry-sdk>=1.27
   opentelemetry-exporter-otlp>=1.27
   opentelemetry-instrumentation-fastapi>=0.48b0
   opentelemetry-instrumentation-sqlalchemy>=0.48b0   # omit if not using SQLAlchemy
   opentelemetry-instrumentation-redis>=0.48b0        # omit if not using Redis
   opentelemetry-instrumentation-httpx>=0.48b0
   opentelemetry-instrumentation-logging>=0.48b0
   ```

3. In `main.py`, immediately after `app = FastAPI(...)`:

   ```python
   from app.core.observability import init_observability
   import os

   init_observability(
       app,
       service_name="your-service",
       environment=os.environ.get("ENVIRONMENT", "development"),
   )
   ```

4. In `docker-compose.yml`, add to the service's `environment:` block:

   ```yaml
   OTEL_EXPORTER_OTLP_ENDPOINT: ${OTEL_EXPORTER_OTLP_ENDPOINT:-http://jaeger:4317}
   OTEL_SERVICE_NAME: your-service
   ```

That's it. `api-core` and `tutor-llm` follow this pattern; both ship traces to the same Jaeger.

## Disabled by default

If `OTEL_EXPORTER_OTLP_ENDPOINT` is unset, the OTel exporter is not wired and there's no network overhead. Structured logging still runs. This is the right behaviour for dev runs without the dev-obs profile.

## Structured log shape

```json
{
  "timestamp": "2026-05-13T15:17:50.648454Z",
  "level": "info",
  "event": "Starting EUREKA API Core Service",
  "service": "api-core",
  "request_id": "8f3a1c2e...",
  "user_id": "550e8400-...",
  "org_id": "660e8400-...",
  "trace_id": "fbdcdd5d76cd2b5f...",
  "span_id": "a4c8...",
  "logger": "main"
}
```

In `ENVIRONMENT=development` the renderer is `ConsoleRenderer` (human-readable). Anywhere else, it's `JSONRenderer` ready for a log shipper.

## What's NOT here yet (BACKLOG)

- **Metrics**: only traces + logs. RED-method dashboards (Request rate, Error rate, Duration) need either Prometheus scraping FastAPI/Node servers, or OTel metrics export. Phase 3.4b.
- **Grafana dashboard JSON**: deferred until metrics are in place. The roadmap Session 3.4 prompt mentioned dashboards; without metrics they're empty.
- **Node service instrumentation**: `services/notebook`, `services/xr-labs` (TS/JS) need `@opentelemetry/auto-instrumentations-node`. Phase 3.4b.
- **Log shipping**: stdout-only today. Phase 11 (GTM) ships logs to a real backend.
- **Cost-per-request tagging for AI calls**: every Anthropic/OpenAI call should attach a span attribute for tokens-in / tokens-out / USD-estimated. Phase 6.
- **Trace sampling**: today it's 100%. For production this needs a head-based sampler (1–10%) or tail-based for errors.

## Verification recipe

```bash
# Tear down + bring up fresh
cd eureka
docker compose --profile dev-obs down
docker compose --profile dev-obs up -d jaeger
docker compose up -d api-core

# Fire some traffic
for i in 1 2 3 4 5; do
  curl -s -X POST http://localhost:8000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@demo.edu","password":"Admin123!"}' >/dev/null
done

# Check Jaeger picked it up
curl -s "http://localhost:16686/api/traces?service=api-core&limit=10" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print(f\"traces: {len(d['data'])}\")"

# Open the UI to inspect
open http://localhost:16686
```
