"""
Minimum health test for every Python FastAPI service in EUREKA.

This is the lightest test that's still meaningful. It catches:
- Syntax errors anywhere in the import graph rooted at main.py
- Missing or broken dependencies
- An accidentally-deleted /health route

It deliberately does NOT hit /health via a TestClient, because that
would trigger the lifespan startup which connects to Postgres/Redis.
Real /health responses are exercised separately in CI's integration job
(see .github/workflows/ci.yml, job `integration`).
"""

from __future__ import annotations


def test_app_imports_cleanly() -> None:
    """main.py must import without exceptions."""
    import importlib
    import sys

    sys.modules.pop("main", None)
    main_module = importlib.import_module("main")
    assert hasattr(main_module, "app"), "main.py is expected to expose `app = FastAPI(...)`"


def test_health_route_registered() -> None:
    """The FastAPI app must declare a /health route."""
    from main import app  # type: ignore[import-not-found]

    paths = {getattr(route, "path", None) for route in app.routes}
    assert "/health" in paths, (
        f"Expected /health to be registered. Got: {sorted(p for p in paths if p)}"
    )
