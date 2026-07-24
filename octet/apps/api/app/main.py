"""OCTET API application factory.

Mirrors the AXIOM skeleton so the two verticals are operationally identical:
same health and ready probes, same request context middleware, one versioned
router.
"""

from __future__ import annotations

import logging
import time
import uuid

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import api_v1
from app.core.config import get_settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("octet")


def install_molecule_pool() -> int:
    """Point the item generators at the curated 200 entry library.

    Until this runs, chem_core generates from its small internal fixture set,
    which is what keeps the package testable with no application present. The
    pool passed here is already filtered by the Section 18 safety policy.
    """
    import chem_core as cc

    from app.data.molecule_build import build_library
    from app.data.molecules import molecule_pool

    safe = {m.name for m in molecule_pool()}
    built, _problems = build_library()
    # build_library returns the RDKit derived record, whose SMILES field is
    # named smiles_canonical. The pool contract wants "smiles", so map it
    # explicitly rather than relying on attribute names lining up.
    usable = [
        {
            "name": b.name,
            "smiles": b.smiles_canonical,
            "formula": b.formula,
            "real_world_note": b.real_world_note,
        }
        for b in built
        if b.name in safe
    ]
    count = cc.set_pool(usable, source="curated-library-v1")
    logger.info("molecule pool installed: %d entries", count)
    return count


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="OCTET",
        description=(
            "Orbitals, Compounds, Thermodynamics, Equilibria, Transformations. "
            "The chemistry vertical of EUREKA."
        ),
        version="0.1.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def request_context(request: Request, call_next):
        request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
        started = time.perf_counter()
        response = await call_next(request)
        elapsed_ms = (time.perf_counter() - started) * 1000
        response.headers["x-request-id"] = request_id
        response.headers["x-elapsed-ms"] = f"{elapsed_ms:.1f}"
        return response

    @app.get("/health", tags=["ops"])
    async def health() -> dict:
        return {"status": "ok", "service": "octet", "version": "0.1.0"}

    @app.get("/ready", tags=["ops"])
    async def ready() -> dict:
        """Readiness includes the grading engine, since a service that cannot
        grade is not useful even if its database answers."""
        import chem_core as cc

        report = cc.sweep(1)
        engine_ok = all(not r["failures"] for r in report.values())
        return {
            "status": "ok" if engine_ok else "degraded",
            "graders": list(cc.SUPPORTED_GRADERS),
            "templates": len(cc.REGISTRY),
            "engine_verified": engine_ok,
        }

    @app.on_event("startup")
    async def _startup() -> None:
        install_molecule_pool()

    app.include_router(api_v1)
    return app


app = create_app()
