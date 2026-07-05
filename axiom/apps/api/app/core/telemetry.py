"""Telemetry: Prometheus metrics and an OpenTelemetry tracing hook.

Metrics are exposed at /metrics. Tracing is wired only when an OTLP endpoint is
configured, so local development stays dependency-light. The functions here are
safe to call when the optional packages are not installed.
"""

from __future__ import annotations

import logging

from fastapi import FastAPI

logger = logging.getLogger("axiom.telemetry")


def setup_metrics(app: FastAPI) -> None:
    """Mount Prometheus instrumentation at /metrics if the package is present."""
    try:
        from prometheus_fastapi_instrumentator import Instrumentator
    except Exception:  # pragma: no cover - optional dependency
        logger.info("prometheus instrumentator not installed, /metrics disabled")
        return
    Instrumentator().instrument(app).expose(app, endpoint="/metrics", include_in_schema=False)


def setup_tracing(app: FastAPI, endpoint: str | None) -> None:
    """Wire OpenTelemetry tracing when an OTLP endpoint is configured."""
    if not endpoint:
        return
    try:  # pragma: no cover - optional dependency, exercised in prod only
        from opentelemetry import trace
        from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import (
            OTLPSpanExporter,
        )
        from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
        from opentelemetry.sdk.resources import Resource
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.trace.export import BatchSpanProcessor

        provider = TracerProvider(resource=Resource.create({"service.name": "axiom-api"}))
        provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter(endpoint=endpoint)))
        trace.set_tracer_provider(provider)
        FastAPIInstrumentor.instrument_app(app)
        logger.info("opentelemetry tracing enabled endpoint=%s", endpoint)
    except Exception as exc:  # pragma: no cover
        logger.warning("failed to enable tracing: %s", exc)
