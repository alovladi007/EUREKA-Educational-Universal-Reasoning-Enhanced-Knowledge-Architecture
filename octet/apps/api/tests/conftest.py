"""Test fixtures for the database-backed suite.

The suite runs fully offline: an in-memory SQLite database, shared through a
static pool so every connection sees the same schema, plus the HMAC identity
provider OCTET runs by default with tokens this module signs. No Postgres and
no EUREKA is required.

Fixtures are opt-in. Nothing here is autouse and nothing mutates the
environment at import time, so the tests that predate persistence are
unaffected by its arrival.

Fixtures:
  engine      - the test engine, with every table created.
  client      - an httpx client against the app, using the test engine.
  db_session  - a raw AsyncSession on the same engine for service-level tests.
  auth        - a headers factory that mints a EUREKA-shaped token per role.
"""

from __future__ import annotations

import time

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool


@pytest_asyncio.fixture
async def engine():
    from app.core import db as db_mod
    from app.core.db import Base

    # Import every model module so all tables register on the metadata.
    from app.domains.chemistry import models as _chemistry  # noqa: F401
    from app.domains.integrations import models as _integrations  # noqa: F401

    eng = create_async_engine(
        "sqlite+aiosqlite://",
        poolclass=StaticPool,
        connect_args={"check_same_thread": False},
    )
    async with eng.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

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


@pytest.fixture
def auth():
    """Mint an Authorization header for a principal holding the given roles.

    The token is signed with the configured shared secret rather than faked
    through a mock provider, so the gated endpoints are exercised through the
    same verification path a EUREKA-issued token takes in production.
    """
    import jwt

    from app.core.config import get_settings

    def _headers(*roles: str, user_id: str = "test-user") -> dict[str, str]:
        settings = get_settings()
        token = jwt.encode(
            {
                "sub": user_id,
                "email": f"{user_id}@example.edu",
                "roles": list(roles) or ["student"],
                "iat": int(time.time()),
                "exp": int(time.time()) + 300,
            },
            settings.jwt_secret,
            algorithm=settings.jwt_algorithm,
        )
        return {"Authorization": f"Bearer {token}"}

    return _headers
