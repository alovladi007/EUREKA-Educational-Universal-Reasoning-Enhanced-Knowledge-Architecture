"""
Integration tests for /api/v1/users/me/settings (P3-2 series).

End-to-end coverage of the settings GET/PATCH pair via
httpx.AsyncClient + AsyncSession backed by in-memory aiosqlite. The
handlers under test live in app/api/v1/endpoints/users.py and persist
into User.preferences (JSONB) — the schema (UserSettings) is
intentionally permissive (extra='allow') so the frontend can iterate
without backend deploys.

What's covered:

  • GET  /users/me/settings  — returns user.preferences (or {})
  • PATCH /users/me/settings — shallow top-level merge into preferences

The merge semantics are explicit in users.py:update_my_settings:
existing top-level keys not present in the incoming payload are
preserved; existing top-level keys that ARE present get replaced
wholesale (matching the page semantics where toggling any setting
in a section re-submits the entire section).

Local async fixtures mirror test_srs_endpoints.py — see that file for
the canonical block + rationale.
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

# Install the SQLite-compatibility shims. See helper docstring.
from tests.integration._sqlite_compat import install_all as _install_sqlite_compat
_install_sqlite_compat(Base)


pytestmark = [pytest.mark.integration, pytest.mark.asyncio]


# ── Async fixtures ─────────────────────────────────────────────────


@pytest_asyncio.fixture
async def async_engine():
    """In-memory aiosqlite engine; same pattern as test_srs_endpoints."""
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
    maker = async_sessionmaker(
        async_engine, expire_on_commit=False, class_=AsyncSession
    )
    async with maker() as session:
        yield session


@pytest_asyncio.fixture
async def seeded_user(async_session: AsyncSession) -> User:
    """Active user with preferences starting as NULL (the default).
    Org slug is unique to this file to avoid cross-suite collisions."""
    org = Organization(
        id=uuid4(),
        name="Test Org Settings",
        slug="test-settings",
        tier="undergraduate",
        country="US",
        settings={},
        tier_config={},
        is_active=True,
    )
    user = User(
        id=uuid4(),
        email="settings-test@example.com",
        first_name="Settings",
        last_name="Tester",
        hashed_password=hash_password("not-used"),
        org_id=org.id,
        role="student",
        is_active=True,
        is_email_verified=True,
    )
    async_session.add(org)
    async_session.add(user)
    await async_session.commit()
    await async_session.refresh(user)
    return user


def _auth_headers(user: User) -> dict:
    """Mint a Bearer token for the given user."""
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
async def async_client(
    async_session: AsyncSession,
) -> AsyncGenerator[AsyncClient, None]:
    async def _override_get_db() -> AsyncGenerator[AsyncSession, None]:
        yield async_session

    app.dependency_overrides[get_db] = _override_get_db
    try:
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            yield client
    finally:
        app.dependency_overrides.pop(get_db, None)


# ── Helpers ────────────────────────────────────────────────────────


API = "/api/v1"
SETTINGS_PATH = f"{API}/users/me/settings"


# ═══════════════════════════════════════════════════════════════════
# Read
# ═══════════════════════════════════════════════════════════════════


class TestSettingsRead:
    async def test_get_returns_empty_dict_for_fresh_user(
        self, async_client: AsyncClient, seeded_user: User
    ):
        """Fresh users have preferences=NULL; the handler maps that to
        an empty dict (`current_user.preferences or {}`)."""
        r = await async_client.get(
            SETTINGS_PATH, headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        assert r.json() == {}

    async def test_get_returns_persisted_preferences(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        """Persist preferences via PATCH and confirm the GET reflects
        them. We don't poke the DB directly so the round-trip exercises
        both halves of the contract."""
        await async_client.patch(
            SETTINGS_PATH,
            json={"appearance": {"theme": "dark"}},
            headers=_auth_headers(seeded_user),
        )
        r = await async_client.get(
            SETTINGS_PATH, headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        assert r.json() == {"appearance": {"theme": "dark"}}

    async def test_get_requires_auth(self, async_client: AsyncClient):
        # HTTPBearer auto_error: missing creds → 403, malformed → 401.
        r = await async_client.get(SETTINGS_PATH)
        assert r.status_code in (401, 403)

    async def test_get_with_invalid_bearer_returns_401(
        self, async_client: AsyncClient
    ):
        r = await async_client.get(
            SETTINGS_PATH,
            headers={"Authorization": "Bearer not-a-jwt"},
        )
        assert r.status_code == 401


# ═══════════════════════════════════════════════════════════════════
# Update — shallow top-level merge
# ═══════════════════════════════════════════════════════════════════


class TestSettingsUpdate:
    async def test_patch_returns_200_with_updated_body(
        self, async_client: AsyncClient, seeded_user: User
    ):
        r = await async_client.patch(
            SETTINGS_PATH,
            json={"appearance": {"theme": "dark"}},
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 200
        body = r.json()
        assert body == {"appearance": {"theme": "dark"}}

    async def test_patch_merges_top_level_keys_preserving_others(
        self, async_client: AsyncClient, seeded_user: User
    ):
        """Successive PATCHes to different top-level sections should
        leave previously-set sections intact (shallow merge at the
        top level)."""
        headers = _auth_headers(seeded_user)

        r1 = await async_client.patch(
            SETTINGS_PATH,
            json={"notifications": {"email": True, "sms": False}},
            headers=headers,
        )
        assert r1.status_code == 200
        assert r1.json() == {
            "notifications": {"email": True, "sms": False}
        }

        r2 = await async_client.patch(
            SETTINGS_PATH,
            json={"appearance": {"theme": "dark"}},
            headers=headers,
        )
        assert r2.status_code == 200
        body = r2.json()
        # Both sections present.
        assert body["notifications"] == {"email": True, "sms": False}
        assert body["appearance"] == {"theme": "dark"}

        r3 = await async_client.patch(
            SETTINGS_PATH,
            json={"privacy": {"profile_public": False}},
            headers=headers,
        )
        assert r3.status_code == 200
        body = r3.json()
        assert body["notifications"] == {"email": True, "sms": False}
        assert body["appearance"] == {"theme": "dark"}
        assert body["privacy"] == {"profile_public": False}

    async def test_patch_replaces_section_wholesale(
        self, async_client: AsyncClient, seeded_user: User
    ):
        """Per the handler comment in users.py: 'each section is
        replaced wholesale'. PATCHing notifications with a different
        shape should drop the old keys, not merge inside the section."""
        headers = _auth_headers(seeded_user)
        await async_client.patch(
            SETTINGS_PATH,
            json={"notifications": {"email": True, "sms": False}},
            headers=headers,
        )
        r = await async_client.patch(
            SETTINGS_PATH,
            json={"notifications": {"push": True}},
            headers=headers,
        )
        assert r.status_code == 200
        # `sms` and `email` are gone — the new dict replaced the old.
        assert r.json()["notifications"] == {"push": True}

    async def test_patch_accepts_extra_top_level_keys(
        self, async_client: AsyncClient, seeded_user: User
    ):
        """UserSettings sets extra='allow', so unknown top-level keys
        like 'integrations' or 'study_mode' must be accepted. This is
        the documented mechanism for adding new sections without a
        backend deploy."""
        r = await async_client.patch(
            SETTINGS_PATH,
            json={"study_mode": {"focus_minutes": 25}},
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 200
        assert r.json() == {"study_mode": {"focus_minutes": 25}}

    async def test_patch_requires_auth(self, async_client: AsyncClient):
        r = await async_client.patch(
            SETTINGS_PATH, json={"appearance": {"theme": "dark"}}
        )
        assert r.status_code in (401, 403)


# ═══════════════════════════════════════════════════════════════════
# Validation
# ═══════════════════════════════════════════════════════════════════


class TestSettingsValidation:
    async def test_patch_malformed_json_returns_422(
        self, async_client: AsyncClient, seeded_user: User
    ):
        """Send a non-JSON body with a JSON content-type header — the
        FastAPI body parser rejects with 422."""
        headers = {
            **_auth_headers(seeded_user),
            "Content-Type": "application/json",
        }
        r = await async_client.patch(
            SETTINGS_PATH, content="not-json", headers=headers
        )
        assert r.status_code == 422

    async def test_patch_with_empty_body_is_noop(
        self, async_client: AsyncClient, seeded_user: User
    ):
        """PATCH with `{}` should validate (all UserSettings fields are
        Optional), merge nothing, and return the existing (or empty)
        preferences blob with 200."""
        headers = _auth_headers(seeded_user)
        # Seed some prior state.
        await async_client.patch(
            SETTINGS_PATH,
            json={"appearance": {"theme": "dark"}},
            headers=headers,
        )
        # Empty PATCH should not erase it.
        r = await async_client.patch(
            SETTINGS_PATH, json={}, headers=headers
        )
        assert r.status_code == 200
        body = r.json()
        assert body == {"appearance": {"theme": "dark"}}
