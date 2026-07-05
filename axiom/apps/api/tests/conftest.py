"""Test fixtures.

The suite runs fully offline: an in-memory SQLite database (shared via a static
pool so every connection sees the same schema) and the mock identity provider,
so no Postgres or EUREKA is required. The FastAPI dependency for the database
session is overridden to use the test engine.
"""

from __future__ import annotations

import os

os.environ.setdefault("AXIOM_IDENTITY_PROVIDER", "mock")
os.environ.setdefault("AXIOM_ENV", "development")

import pytest_asyncio  # noqa: E402
from httpx import ASGITransport, AsyncClient  # noqa: E402
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine  # noqa: E402
from sqlalchemy.pool import StaticPool  # noqa: E402


@pytest_asyncio.fixture
async def client():
    from app.core import db as db_mod
    from app.core.config import get_settings
    from app.core.db import Base, get_session
    from app.core.security import get_identity
    from app.domains.identity import models  # noqa: F401 - register tables

    get_settings.cache_clear()
    get_identity.cache_clear()

    engine = create_async_engine(
        "sqlite+aiosqlite://",
        poolclass=StaticPool,
        connect_args={"check_same_thread": False},
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Point the readiness probe at the test engine too.
    db_mod._engine = engine

    TestSession = async_sessionmaker(engine, expire_on_commit=False)

    async def override_get_session():
        async with TestSession() as session:
            yield session

    from app.main import create_app

    app = create_app()
    app.dependency_overrides[get_session] = override_get_session

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as http_client:
        yield http_client

    await engine.dispose()
    db_mod._engine = None
