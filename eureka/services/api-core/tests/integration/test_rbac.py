"""Integration tests for Role-Based Access Control (RBAC).

Migrated from the legacy sync-TestClient pattern, which broke against the async
app (`await db.execute(...)` on a sync Session -> "ChunkedIteratorResult can't
be used in 'await'"). Now uses a local in-memory aiosqlite engine + httpx
AsyncClient, mirroring test_srs_endpoints.py, with correct model field names
(User.org_id, not organization_id).
"""

from __future__ import annotations

from typing import AsyncGenerator
from uuid import uuid4

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.models.organization import Organization
from app.models.user import User
from app.utils.auth import create_access_token, hash_password
from main import app

# Register the SQLite compile rules for the PG-native column types (UUID/JSONB/
# ARRAY/...) so Base.metadata.create_all renders on aiosqlite.
from tests.integration._sqlite_compat import install_all as _install_sqlite_compat

_install_sqlite_compat(Base)

pytestmark = [pytest.mark.integration, pytest.mark.asyncio, pytest.mark.auth]


# ── Fixtures (local async — same shape as test_srs_endpoints.py) ────────────


@pytest_asyncio.fixture
async def async_engine():
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest_asyncio.fixture
async def async_session(async_engine) -> AsyncGenerator[AsyncSession, None]:
    maker = async_sessionmaker(async_engine, expire_on_commit=False, class_=AsyncSession)
    async with maker() as session:
        yield session


@pytest_asyncio.fixture
async def org(async_session: AsyncSession) -> Organization:
    o = Organization(
        id=uuid4(),
        name="RBAC Test Org",
        slug="rbac-test",
        tier="high_school",
        country="US",
        settings={},
        tier_config={},
        is_active=True,
    )
    async_session.add(o)
    await async_session.commit()
    await async_session.refresh(o)
    return o


async def _make_user(session: AsyncSession, org: Organization, role: str) -> User:
    u = User(
        id=uuid4(),
        email=f"rbac-{role}-{uuid4().hex[:8]}@example.com",
        first_name=role.capitalize(),
        last_name="User",
        hashed_password=hash_password("not-used"),
        org_id=org.id,
        role=role,
        is_active=True,
        is_email_verified=True,
    )
    session.add(u)
    await session.commit()
    await session.refresh(u)
    return u


def _headers(user: User) -> dict:
    token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "org_id": str(user.org_id),
            "role": user.role,
        }
    )
    return {"Authorization": f"Bearer {token}"}


@pytest_asyncio.fixture
async def async_client(async_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    async def _override_get_db() -> AsyncGenerator[AsyncSession, None]:
        yield async_session

    app.dependency_overrides[get_db] = _override_get_db
    try:
        # follow_redirects: FastAPI 307s `/courses` -> `/courses/` (trailing
        # slash); a real client follows it, so we should too.
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
            follow_redirects=True,
        ) as client:
            yield client
    finally:
        app.dependency_overrides.pop(get_db, None)


# ── RBAC permission tests ───────────────────────────────────────────────────


class TestRBACPermissions:
    async def test_student_cannot_access_admin_endpoints(self, async_client, async_session, org):
        student = await _make_user(async_session, org, "student")
        resp = await async_client.get("/api/v1/admin/users", headers=_headers(student))
        assert resp.status_code in (401, 403, 404)

    async def test_admin_can_access_admin_endpoints(self, async_client, async_session, org):
        admin = await _make_user(async_session, org, "super_admin")
        resp = await async_client.get("/api/v1/admin/users", headers=_headers(admin))
        # Admin must NOT be forbidden (200 if the endpoint exists, 404 if not).
        assert resp.status_code in (200, 404)

    async def test_teacher_can_access_courses(self, async_client, async_session, org):
        teacher = await _make_user(async_session, org, "teacher")
        resp = await async_client.get("/api/v1/courses", headers=_headers(teacher))
        assert resp.status_code in (200, 404)

    async def test_student_can_access_courses(self, async_client, async_session, org):
        student = await _make_user(async_session, org, "student")
        resp = await async_client.get("/api/v1/courses", headers=_headers(student))
        assert resp.status_code in (200, 404)


class TestOrganizationIsolation:
    async def test_me_returns_own_org(self, async_client, async_session, org):
        student = await _make_user(async_session, org, "student")
        resp = await async_client.get("/api/v1/auth/me", headers=_headers(student))
        assert resp.status_code == 200
        data = resp.json()
        # UserResponse uses org_id (not organization_id).
        assert data.get("org_id") == str(student.org_id)

    async def test_unauthenticated_is_rejected(self, async_client):
        resp = await async_client.get("/api/v1/auth/me")
        assert resp.status_code in (401, 403)
