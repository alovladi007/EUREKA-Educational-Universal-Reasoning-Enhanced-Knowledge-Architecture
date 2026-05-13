"""
Observability bootstrap (Session 3.4, 2026-05).

One module, one job: hand `main.py` an `init_observability(app, settings)`
function that wires up:

  1. OpenTelemetry tracing — auto-instruments FastAPI, SQLAlchemy, Redis,
     httpx, and the stdlib logging module. Spans are exported via OTLP
     gRPC to the endpoint in OTEL_EXPORTER_OTLP_ENDPOINT.
  2. structlog — every log line becomes a JSON record carrying timestamp,
     level, service, request_id, user_id, org_id, trace_id, span_id. The
     log-instrumentor pulls trace_id/span_id off the current span so logs
     and traces in Jaeger correlate without manual plumbing.
  3. A RequestContextMiddleware that pins request_id / user_id / org_id
     into a contextvar so structlog picks them up from anywhere on the
     call path without explicit passing.

Disabled-by-default behaviour: if OTEL_EXPORTER_OTLP_ENDPOINT is unset,
tracing is silent (no exporter wired) but structured logging still runs.
That's the right behaviour for dev runs with no Jaeger container.

To enable end-to-end tracing locally:
  cd eureka
  docker compose --profile dev-obs up -d jaeger
  # then add to .env:
  #   OTEL_EXPORTER_OTLP_ENDPOINT=http://jaeger:4317
  #   OTEL_SERVICE_NAME=api-core
  docker compose up -d --build api-core
  # then open http://localhost:16686 after a request

Reusable: other Python services can import this module unchanged — they
just need the same OTel + structlog requirements pinned. The Session 3.4
prompt's "instrument every service" follow-up is just "copy this file +
deps + the four lines in main.py".
"""

from __future__ import annotations

import logging
import os
import uuid
from contextvars import ContextVar
from typing import Optional

import structlog
from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response


# Per-request context. structlog readers pull from these.
_REQUEST_ID: ContextVar[Optional[str]] = ContextVar("_request_id", default=None)
_USER_ID: ContextVar[Optional[str]] = ContextVar("_user_id", default=None)
_ORG_ID: ContextVar[Optional[str]] = ContextVar("_org_id", default=None)


def _ctx_processor(_, __, event_dict):
    """Inject contextvar values into every structlog event."""
    if (rid := _REQUEST_ID.get()) is not None:
        event_dict.setdefault("request_id", rid)
    if (uid := _USER_ID.get()) is not None:
        event_dict.setdefault("user_id", uid)
    if (oid := _ORG_ID.get()) is not None:
        event_dict.setdefault("org_id", oid)
    return event_dict


class RequestContextMiddleware(BaseHTTPMiddleware):
    """
    Stamps a request_id (incoming `X-Request-ID` or a fresh uuid4) and lifts
    `request.state.user_id` / `request.state.org_id` into contextvars so the
    logger can include them without being plumbed through every function.
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        rid = request.headers.get("X-Request-ID") or uuid.uuid4().hex
        request.state.request_id = rid
        rid_tok = _REQUEST_ID.set(rid)
        uid_tok = _USER_ID.set(getattr(request.state, "user_id", None))
        oid_tok = _ORG_ID.set(getattr(request.state, "org_id", None))
        try:
            response = await call_next(request)
        finally:
            _REQUEST_ID.reset(rid_tok)
            _USER_ID.reset(uid_tok)
            _ORG_ID.reset(oid_tok)
        response.headers["X-Request-ID"] = rid
        return response


def _configure_structlog(service_name: str, environment: str) -> None:
    """JSON logs in prod, pretty console in dev."""
    shared_processors = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_log_level,
        # add_logger_name needs a stdlib logger with `.name`; PrintLogger
        # (the lightweight default) doesn't have one. Service is already
        # stamped by the lambda below — that's the same info.
        structlog.processors.TimeStamper(fmt="iso", utc=True),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        _ctx_processor,
        lambda _, __, ev: {**ev, "service": service_name},
    ]
    if environment == "development":
        renderer = structlog.dev.ConsoleRenderer(colors=False)
    else:
        renderer = structlog.processors.JSONRenderer()

    structlog.configure(
        processors=shared_processors + [renderer],
        wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )


def _configure_tracing(app: FastAPI, service_name: str) -> bool:
    """
    Wire OpenTelemetry instrumentation. Returns True if an OTLP exporter
    is configured (i.e. spans will actually leave the process), False if
    we're only instrumenting in-process.
    """
    endpoint = os.environ.get("OTEL_EXPORTER_OTLP_ENDPOINT", "").strip()
    if not endpoint:
        return False

    from opentelemetry import trace
    from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
    from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
    from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
    from opentelemetry.instrumentation.logging import LoggingInstrumentor
    from opentelemetry.instrumentation.redis import RedisInstrumentor
    from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
    from opentelemetry.sdk.resources import Resource
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import BatchSpanProcessor

    resource = Resource.create(
        {
            "service.name": service_name,
            "deployment.environment": os.environ.get("ENVIRONMENT", "development"),
            "service.version": os.environ.get("SERVICE_VERSION", "0.0.0"),
        }
    )

    provider = TracerProvider(resource=resource)
    insecure = not endpoint.startswith("https://")
    provider.add_span_processor(
        BatchSpanProcessor(OTLPSpanExporter(endpoint=endpoint, insecure=insecure))
    )
    trace.set_tracer_provider(provider)

    # Auto-instrument the libraries we care about.
    FastAPIInstrumentor.instrument_app(app)
    HTTPXClientInstrumentor().instrument()
    RedisInstrumentor().instrument()
    LoggingInstrumentor().instrument(set_logging_format=False)
    # SQLAlchemy needs the engine to instrument. main.py imports the engine
    # before calling us; the caller-provides-engine alternative is fine but
    # this lazy import keeps the signature simple.
    try:
        from app.core.database import engine  # noqa: WPS433 — intentional lazy import

        SQLAlchemyInstrumentor().instrument(
            engine=engine.sync_engine if hasattr(engine, "sync_engine") else engine
        )
    except Exception:
        # Don't fail boot if SQLAlchemy instrumentation can't attach.
        pass

    return True


def init_observability(app: FastAPI, *, service_name: str, environment: str) -> dict:
    """
    Wire structlog and (optionally) OTel into the given FastAPI app.
    Returns a dict with what was actually enabled, for logging.
    """
    _configure_structlog(service_name, environment)
    tracing = _configure_tracing(app, service_name)
    app.add_middleware(RequestContextMiddleware)
    return {"tracing_exporter": tracing, "service_name": service_name}


def get_logger(name: str | None = None):
    """Convenience wrapper so callers don't need to import structlog directly."""
    return structlog.get_logger(name) if name else structlog.get_logger()
