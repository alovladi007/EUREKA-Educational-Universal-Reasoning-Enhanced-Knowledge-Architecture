"""Test fixtures.

The suite runs fully offline: an in-memory SQLite database (shared via a static
pool so every connection sees the same schema) seeded with the Phase 1 algebra
skill graph, plus the mock identity provider. No Postgres or EUREKA is required.

Fixtures:
  engine      - the seeded test engine (function scoped).
  client      - an httpx client against the app, using the test engine.
  db_session  - a raw AsyncSession on the same engine for service-level tests.
"""

from __future__ import annotations

import os

os.environ.setdefault("AXIOM_IDENTITY_PROVIDER", "mock")
os.environ.setdefault("AXIOM_ENV", "development")
# Grade synchronously in tests: no Celery broker runs, and the worker path is
# covered directly (see test_async_grading) via the grade_pending_response core.
os.environ.setdefault("AXIOM_ASYNC_GRADING", "false")
# No broker in tests, so do not enqueue notification emails; the email sender is
# covered directly (see test_email).
os.environ.setdefault("AXIOM_EMAIL_ENABLED", "false")

import pytest_asyncio  # noqa: E402
from httpx import ASGITransport, AsyncClient  # noqa: E402
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine  # noqa: E402
from sqlalchemy.pool import StaticPool  # noqa: E402


@pytest_asyncio.fixture
async def engine():
    from app.core import db as db_mod
    from app.core.config import get_settings
    from app.core.db import Base
    from app.core.security import get_identity

    # Import every model module so all tables register on the metadata.
    from app.domains.accommodations import models as _acc  # noqa: F401
    from app.domains.adaptive import models as _a  # noqa: F401
    from app.domains.analytics import models as _an  # noqa: F401
    from app.domains.assessment import models as _s  # noqa: F401
    from app.domains.attempts import models as _t  # noqa: F401
    from app.domains.compliance import models as _comp  # noqa: F401
    from app.domains.content import models as _c  # noqa: F401
    from app.domains.copilot import models as _cp  # noqa: F401
    from app.domains.curriculum import models as _cur  # noqa: F401
    from app.domains.gamification import models as _g  # noqa: F401
    from app.domains.identity import models as _i  # noqa: F401
    from app.domains.integrations import models as _int  # noqa: F401
    from app.domains.notifications import models as _n  # noqa: F401
    from app.domains.proctoring import models as _p  # noqa: F401
    from app.domains.tutoring import models as _tut  # noqa: F401
    from app.seed import seed

    get_settings.cache_clear()
    get_identity.cache_clear()

    eng = create_async_engine(
        "sqlite+aiosqlite://",
        poolclass=StaticPool,
        connect_args={"check_same_thread": False},
    )
    async with eng.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    maker = async_sessionmaker(eng, expire_on_commit=False)
    async with maker() as session:
        await seed(session)

    db_mod._engine = eng
    yield eng
    await eng.dispose()
    db_mod._engine = None


@pytest_asyncio.fixture
async def client(engine):
    from app.core.db import get_session
    from app.main import create_app

    maker = async_sessionmaker(engine, expire_on_commit=False)

    async def override_get_session():
        async with maker() as session:
            yield session

    app = create_app()
    app.dependency_overrides[get_session] = override_get_session
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as http_client:
        yield http_client


@pytest_asyncio.fixture
async def db_session(engine):
    maker = async_sessionmaker(engine, expire_on_commit=False)
    async with maker() as session:
        yield session


AUTH = {"Authorization": "Bearer devtoken"}


import pytest  # noqa: E402


@pytest.fixture
def as_teacher(monkeypatch):
    """Make the mock identity return a teaching principal for this test.

    The default mock principal is a student; role-gated endpoints (authoring,
    item generation, teacher assistant) need a teaching role. Patching the fixed
    principal is the least-invasive way to exercise them through the client.
    """
    from shared_schemas.identity import Principal

    from app.core.security import MockEurekaIdentity

    teacher = Principal(
        sub="00000000-0000-0000-0000-000000000009",
        email="teacher@axiom.local",
        display_name="Dev Teacher",
        roles=["teacher"],
        tenant_id=None,
    )
    monkeypatch.setattr(MockEurekaIdentity, "_FIXED", teacher)
    yield


@pytest.fixture
def as_admin(monkeypatch):
    """Make the mock identity return an org_admin principal for this test."""
    from shared_schemas.identity import Principal

    from app.core.security import MockEurekaIdentity

    admin = Principal(
        sub="00000000-0000-0000-0000-00000000000a",
        email="admin@axiom.local",
        display_name="Dev Admin",
        roles=["org_admin"],
        tenant_id=None,
    )
    monkeypatch.setattr(MockEurekaIdentity, "_FIXED", admin)
    yield
