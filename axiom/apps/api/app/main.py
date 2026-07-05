"""AXIOM API application factory.

Builds the FastAPI app, wires middleware (CORS, request id, access logging),
mounts the versioned router, exposes health and readiness probes, and turns on
metrics and tracing. Import create_app() from here; the module-level `app` is
the ASGI entrypoint for uvicorn.
"""

from __future__ import annotations

import logging
import time
import uuid

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from shared_schemas.identity import HealthOut
from sqlalchemy import text

from app.api.v1 import api_v1
from app.core.config import get_settings
from app.core.db import get_engine
from app.core.logging import configure_logging
from app.core.telemetry import setup_metrics, setup_tracing

logger = logging.getLogger("axiom.api")


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging(settings.log_level)

    app = FastAPI(
        title="AXIOM API",
        version=settings.version,
        description=(
            "AXIOM is the mathematics vertical of EUREKA. This is the Phase 0 "
            "gateway: EUREKA SSO, identity sync, and the landing dashboard."
        ),
        openapi_url="/openapi.json",
        docs_url="/docs",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def request_context(request: Request, call_next):
        request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
        start = time.perf_counter()
        try:
            response = await call_next(request)
        except Exception:
            logger.exception(
                "unhandled error",
                extra={
                    "request_id": request_id,
                    "path": request.url.path,
                    "method": request.method,
                },
            )
            raise
        duration_ms = round((time.perf_counter() - start) * 1000, 2)
        response.headers["x-request-id"] = request_id
        logger.info(
            "request",
            extra={
                "request_id": request_id,
                "path": request.url.path,
                "method": request.method,
                "status": response.status_code,
                "duration_ms": duration_ms,
            },
        )
        return response

    @app.get("/health", response_model=HealthOut, tags=["ops"], summary="Liveness")
    async def health() -> HealthOut:
        return HealthOut(status="ok", service=settings.service_name, version=settings.version)

    @app.get("/ready", tags=["ops"], summary="Readiness (checks the database)")
    async def ready() -> JSONResponse:
        try:
            engine = get_engine()
            async with engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            return JSONResponse({"status": "ready"})
        except Exception as exc:
            logger.warning("readiness check failed: %s", exc)
            return JSONResponse({"status": "not-ready", "detail": str(exc)}, status_code=503)

    app.include_router(api_v1)

    setup_metrics(app)
    setup_tracing(app, settings.otel_exporter_otlp_endpoint)

    logger.info(
        "axiom-api started",
        extra={"request_id": "-"},
    )
    return app


app = create_app()
