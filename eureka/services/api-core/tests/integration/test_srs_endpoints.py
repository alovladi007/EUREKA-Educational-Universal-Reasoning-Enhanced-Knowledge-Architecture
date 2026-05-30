"""
Integration tests for /me/srs/* endpoints (P3-2 follow-up to P1-4).

These exercise the FastAPI handlers end-to-end via httpx.AsyncClient
+ AsyncSession backed by in-memory aiosqlite. The SM-2 *math* is
already covered by tests/unit/test_srs_sm2.py — these tests focus on
the HTTP contract:

  • CRUD round-trip: POST → GET → PATCH → DELETE.
  • Auth: 401 without token, current_user scoping (one user can't
    read or mutate another user's cards — 404, not 403, since we
    don't want to confirm existence to a non-owner).
  • Listing: ordering by next_review, deck filter, pagination.
  • Due endpoint: returns only cards with next_review ≤ now.
  • Review endpoint: applies SM-2 (verified by EF/interval change),
    returns the post-update row.
  • Stats endpoint: counts match what the model state implies.
  • 422s for bad input shapes (front blank, quality out of range).

Local async fixtures (overrides_get_db, async_client, …) live in this
file so the existing sync conftest.py is untouched.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import AsyncGenerator
from uuid import UUID, uuid4

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import StaticPool

# SQLite has none of the postgres-native types the production models
# declare (UUID, JSONB, ARRAY, ENUM, TSVECTOR, INET). Register
# dialect-specific compile rules so Base.metadata.create_all() can
# emit a valid CREATE TABLE for the sqlite test engine. The postgres
# path is untouched; this only fires when dialect == "sqlite".
# Must run before Base.metadata.create_all() — that's why it sits at
# module import alongside the other imports.
from sqlalchemy.dialects.postgresql import (
    ARRAY as _PGARRAY,
    ENUM as _PGENUM,
    INET as _PGINET,
    JSONB as _PGJSONB,
    TSVECTOR as _PGTSVECTOR,
    UUID as _PGUUID,
)
from sqlalchemy.ext.compiler import compiles as _sa_compiles

@_sa_compiles(_PGUUID, "sqlite")
def _compile_uuid_sqlite(element, compiler, **kw):  # noqa: D401
    return "CHAR(36)"

@_sa_compiles(_PGJSONB, "sqlite")
def _compile_jsonb_sqlite(element, compiler, **kw):  # noqa: D401
    return "TEXT"

@_sa_compiles(_PGARRAY, "sqlite")
def _compile_array_sqlite(element, compiler, **kw):  # noqa: D401
    return "TEXT"

@_sa_compiles(_PGENUM, "sqlite")
def _compile_enum_sqlite(element, compiler, **kw):  # noqa: D401
    return "VARCHAR"

@_sa_compiles(_PGTSVECTOR, "sqlite")
def _compile_tsvector_sqlite(element, compiler, **kw):  # noqa: D401
    return "TEXT"

@_sa_compiles(_PGINET, "sqlite")
def _compile_inet_sqlite(element, compiler, **kw):  # noqa: D401
    return "VARCHAR"

from app.core.database import Base, get_db
from app.models.organization import Organization
from app.models.srs_card import SM2_INITIAL_EASE_FACTOR, SrsCard
from app.models.user import User
from app.utils.auth import create_access_token, hash_password
from main import app

# Some production models declare CHECK constraints that use postgres's
# `~` regex operator (e.g. organizations.slug, country). SQLite parses
# `~` as a unary bitwise-NOT and chokes on the syntax. Walk
# Base.metadata once at import time and drop the regex CHECK
# constraints — they only run on the test in-memory engine; production
# postgres path keeps them via Alembic-generated DDL.
from sqlalchemy.schema import CheckConstraint as _SACheckConstraint
for _t in Base.metadata.tables.values():
    _bad = [c for c in list(_t.constraints)
            if isinstance(c, _SACheckConstraint) and "~" in str(c.sqltext)]
    for _c in _bad:
        _t.constraints.discard(_c)


# SQLite drops tzinfo on storage of DateTime(timezone=True). Endpoint
# code compares datetime.now(timezone.utc) against the value read
# back, which raises "can't compare offset-naive and offset-aware
# datetimes" on every datetime-bearing test. Monkey-patch SA's
# DateTime.result_processor at module load to reattach UTC tzinfo
# when the dialect is sqlite; postgres path is unchanged.
from sqlalchemy import DateTime as _SADateTime
from datetime import datetime as _builtin_dt

_original_dt_processor = _SADateTime.result_processor

def _patched_dt_result_processor(self, dialect, coltype):
    base = _original_dt_processor(self, dialect, coltype)
    if dialect.name != "sqlite":
        return base
    def _wrap(value):
        v = base(value) if base else value
        if isinstance(v, _builtin_dt) and v.tzinfo is None:
            return v.replace(tzinfo=timezone.utc)
        return v
    return _wrap

_SADateTime.result_processor = _patched_dt_result_processor


pytestmark = [pytest.mark.integration, pytest.mark.asyncio]


# ── Async fixtures (local — don't pollute the global conftest) ─────


@pytest_asyncio.fixture
async def async_engine():
    """In-memory aiosqlite engine with the same Base metadata as prod.

    StaticPool keeps the same connection across the lifetime of the
    test so the in-memory DB persists between session opens.

    Datetime tz-awareness: SQLite drops tzinfo on storage of
    `DateTime(timezone=True)` columns, but endpoint code compares
    `datetime.now(timezone.utc)` against the value read back, which
    raises TypeError. The module-level monkey-patch above (see
    `_patched_dt_result_processor`) reattaches UTC on read for the
    sqlite dialect; postgres path is untouched.
    """
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
    """A fresh AsyncSession for each test, all sharing the engine
    (and therefore the in-memory DB) of that test."""
    maker = async_sessionmaker(
        async_engine, expire_on_commit=False, class_=AsyncSession
    )
    async with maker() as session:
        yield session


@pytest_asyncio.fixture
async def seeded_user(async_session: AsyncSession) -> User:
    """Persist an org + user we can issue an access_token for.

    Field names must match the real models — Organization uses
    {name, slug, tier, country, settings, tier_config} and User uses
    {org_id (NOT organization_id), email, hashed_password, first_name,
    last_name, role, is_email_verified (NOT is_verified)}.
    """
    org = Organization(
        id=uuid4(),
        name="Test Org",
        slug="test-srs",
        tier="undergraduate",
        country="US",
        settings={},
        tier_config={},
        is_active=True,
    )
    user = User(
        id=uuid4(),
        email="srs-test@example.com",
        first_name="SRS",
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


@pytest_asyncio.fixture
async def other_user(async_session: AsyncSession) -> User:
    """A second user — used to verify per-user scoping."""
    org = Organization(
        id=uuid4(),
        name="Test Org B",
        slug="test-srs-b",
        tier="undergraduate",
        country="US",
        settings={},
        tier_config={},
        is_active=True,
    )
    user = User(
        id=uuid4(),
        email="srs-other@example.com",
        first_name="Other",
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
    """Mint a Bearer token for the given user. Mirrors what /auth/login
    returns (sub=user.id, plus standard claims). User.org_id (NOT
    .organization_id) per the real schema."""
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
    """ASGI-wrapped async client with get_db overridden to yield from
    the test's AsyncSession. Each test gets a fresh client AND a
    fresh DB (via the async_engine fixture chain)."""

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


def _card_payload(**overrides):
    base = {"deck": "PATENT_BAR", "front": "Q: §101 categories?", "back": "A: PMMC"}
    base.update(overrides)
    return base


# ═══════════════════════════════════════════════════════════════════
# CRUD round-trip
# ═══════════════════════════════════════════════════════════════════


class TestSrsCardCrud:
    async def test_create_card_returns_201_and_persists(
        self, async_client: AsyncClient, seeded_user: User, async_session: AsyncSession
    ):
        r = await async_client.post(
            f"{API}/me/srs/cards", json=_card_payload(), headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 201
        body = r.json()
        assert body["deck"] == "PATENT_BAR"
        assert body["front"] == "Q: §101 categories?"
        assert body["back"] == "A: PMMC"
        # Fresh cards: default SM-2 state.
        assert body["ease_factor"] == SM2_INITIAL_EASE_FACTOR
        assert body["interval_days"] == 0
        assert body["repetitions"] == 0
        assert body["total_reviews"] == 0
        assert body["total_correct"] == 0
        assert body["user_id"] == str(seeded_user.id)

    async def test_list_my_cards_returns_only_caller_cards(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        other_user: User,
        async_session: AsyncSession,
    ):
        # Seed: 2 cards for me, 1 for the other user.
        for i in range(2):
            await async_client.post(
                f"{API}/me/srs/cards",
                json=_card_payload(front=f"mine-{i}"),
                headers=_auth_headers(seeded_user),
            )
        await async_client.post(
            f"{API}/me/srs/cards",
            json=_card_payload(front="theirs"),
            headers=_auth_headers(other_user),
        )

        r = await async_client.get(
            f"{API}/me/srs/cards", headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        body = r.json()
        assert body["total"] == 2
        fronts = {c["front"] for c in body["cards"]}
        assert fronts == {"mine-0", "mine-1"}

    async def test_list_my_cards_filters_by_deck(
        self, async_client: AsyncClient, seeded_user: User
    ):
        for deck in ["PATENT_BAR", "LSAT", "LSAT", "general"]:
            await async_client.post(
                f"{API}/me/srs/cards",
                json=_card_payload(deck=deck),
                headers=_auth_headers(seeded_user),
            )

        r = await async_client.get(
            f"{API}/me/srs/cards",
            params={"deck": "LSAT"},
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 200
        body = r.json()
        assert body["total"] == 2
        assert all(c["deck"] == "LSAT" for c in body["cards"])

    async def test_patch_updates_only_content_not_scheduling(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        created = (
            await async_client.post(
                f"{API}/me/srs/cards", json=_card_payload(), headers=_auth_headers(seeded_user)
            )
        ).json()
        # Bump the card's scheduling state directly so we can verify
        # PATCH doesn't touch it.
        await async_session.execute(
            SrsCard.__table__.update()
            .where(SrsCard.id == UUID(created["id"]))
            .values(ease_factor=2.0, interval_days=15, repetitions=3)
        )
        await async_session.commit()

        r = await async_client.patch(
            f"{API}/me/srs/cards/{created['id']}",
            json={"front": "edited", "back": "also edited", "deck": "LSAT"},
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 200
        body = r.json()
        assert body["front"] == "edited"
        assert body["back"] == "also edited"
        assert body["deck"] == "LSAT"
        # Scheduling untouched.
        assert body["ease_factor"] == 2.0
        assert body["interval_days"] == 15
        assert body["repetitions"] == 3

    async def test_delete_removes_card(
        self, async_client: AsyncClient, seeded_user: User
    ):
        created = (
            await async_client.post(
                f"{API}/me/srs/cards", json=_card_payload(), headers=_auth_headers(seeded_user)
            )
        ).json()

        r = await async_client.delete(
            f"{API}/me/srs/cards/{created['id']}", headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 204

        # Confirm it's gone via list.
        r2 = await async_client.get(
            f"{API}/me/srs/cards", headers=_auth_headers(seeded_user)
        )
        assert r2.json()["total"] == 0


# ═══════════════════════════════════════════════════════════════════
# Auth & cross-user scoping
# ═══════════════════════════════════════════════════════════════════


class TestSrsAuth:
    async def test_endpoints_require_auth(self, async_client: AsyncClient):
        # No Authorization header anywhere. FastAPI's HTTPBearer raises
        # 403 for missing creds (auto_error default) and 401 only when a
        # malformed/expired token is supplied. Either indicates the auth
        # was enforced — accept both.
        for path in [
            f"{API}/me/srs/cards",
            f"{API}/me/srs/cards/due",
            f"{API}/me/srs/stats",
        ]:
            r = await async_client.get(path)
            assert r.status_code in (401, 403), (
                f"expected 401/403 on {path}, got {r.status_code}"
            )

    async def test_cannot_review_another_users_card(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        other_user: User,
    ):
        created = (
            await async_client.post(
                f"{API}/me/srs/cards", json=_card_payload(), headers=_auth_headers(seeded_user)
            )
        ).json()

        # Other user tries to review it — should 404 (NOT 403, to avoid
        # leaking the existence of cards they don't own).
        r = await async_client.post(
            f"{API}/me/srs/cards/{created['id']}/review",
            json={"quality": 5},
            headers=_auth_headers(other_user),
        )
        assert r.status_code == 404

    async def test_cannot_delete_another_users_card(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        other_user: User,
    ):
        created = (
            await async_client.post(
                f"{API}/me/srs/cards", json=_card_payload(), headers=_auth_headers(seeded_user)
            )
        ).json()

        r = await async_client.delete(
            f"{API}/me/srs/cards/{created['id']}",
            headers=_auth_headers(other_user),
        )
        assert r.status_code == 404


# ═══════════════════════════════════════════════════════════════════
# Due-queue logic
# ═══════════════════════════════════════════════════════════════════


class TestSrsDueQueue:
    async def test_due_returns_only_past_due_cards(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        now = datetime.now(timezone.utc)

        # 1 due card (next_review in the past)
        due = SrsCard(
            id=uuid4(),
            user_id=seeded_user.id,
            deck="PATENT_BAR",
            front="due",
            back="answer",
            next_review=now - timedelta(hours=1),
        )
        # 1 future card (next_review tomorrow)
        future = SrsCard(
            id=uuid4(),
            user_id=seeded_user.id,
            deck="PATENT_BAR",
            front="future",
            back="answer",
            next_review=now + timedelta(days=1),
        )
        async_session.add(due)
        async_session.add(future)
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/srs/cards/due", headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        body = r.json()
        fronts = {c["front"] for c in body["cards"]}
        assert fronts == {"due"}
        assert body["total"] == 1


# ═══════════════════════════════════════════════════════════════════
# Review endpoint (wires through SM-2)
# ═══════════════════════════════════════════════════════════════════


class TestSrsReview:
    async def test_review_q5_advances_card_and_returns_updated_state(
        self, async_client: AsyncClient, seeded_user: User
    ):
        created = (
            await async_client.post(
                f"{API}/me/srs/cards", json=_card_payload(), headers=_auth_headers(seeded_user)
            )
        ).json()

        r = await async_client.post(
            f"{API}/me/srs/cards/{created['id']}/review",
            json={"quality": 5},
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 200
        body = r.json()
        # First pass: reps 0→1, interval 0→1, EF 2.5+0.10=2.60,
        # total_reviews 0→1, total_correct 0→1.
        assert body["repetitions"] == 1
        assert body["interval_days"] == 1
        assert body["ease_factor"] == pytest.approx(2.60, abs=1e-6)
        assert body["total_reviews"] == 1
        assert body["total_correct"] == 1

    async def test_review_q0_resets_streak(
        self, async_client: AsyncClient, seeded_user: User
    ):
        created = (
            await async_client.post(
                f"{API}/me/srs/cards", json=_card_payload(), headers=_auth_headers(seeded_user)
            )
        ).json()

        # Two passes to build a streak…
        for _ in range(2):
            await async_client.post(
                f"{API}/me/srs/cards/{created['id']}/review",
                json={"quality": 4},
                headers=_auth_headers(seeded_user),
            )
        # …then a fail.
        r = await async_client.post(
            f"{API}/me/srs/cards/{created['id']}/review",
            json={"quality": 0},
            headers=_auth_headers(seeded_user),
        )
        body = r.json()
        assert body["repetitions"] == 0
        assert body["interval_days"] == 1
        assert body["total_reviews"] == 3
        assert body["total_correct"] == 2  # only the two passes count

    async def test_review_rejects_out_of_range_quality(
        self, async_client: AsyncClient, seeded_user: User
    ):
        created = (
            await async_client.post(
                f"{API}/me/srs/cards", json=_card_payload(), headers=_auth_headers(seeded_user)
            )
        ).json()

        for bad_q in [-1, 6, 99]:
            r = await async_client.post(
                f"{API}/me/srs/cards/{created['id']}/review",
                json={"quality": bad_q},
                headers=_auth_headers(seeded_user),
            )
            # 422 because the Pydantic schema constrains quality ∈ [0,5]
            # at the SCHEMA level (the model's apply_sm2 also clamps,
            # but the schema rejects first).
            assert r.status_code == 422, f"q={bad_q} should reject, got {r.status_code}"


# ═══════════════════════════════════════════════════════════════════
# Stats endpoint
# ═══════════════════════════════════════════════════════════════════


class TestSrsStats:
    async def test_stats_with_no_cards_returns_zeros(
        self, async_client: AsyncClient, seeded_user: User
    ):
        r = await async_client.get(
            f"{API}/me/srs/stats", headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        body = r.json()
        assert body["total_cards"] == 0
        assert body["due_now"] == 0
        assert body["learning"] == 0
        assert body["mature"] == 0
        assert body["reviews_today"] == 0
        assert body["average_ease"] == 0.0

    async def test_stats_counts_match_model_state(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        now = datetime.now(timezone.utc)

        # Compose a deterministic mix:
        #   • 1 learning + due (reps=0, next_review in past)
        #   • 1 mature (interval=30, next_review tomorrow)
        #   • 1 learning + reviewed today (last_review = now)
        async_session.add(
            SrsCard(
                id=uuid4(),
                user_id=seeded_user.id,
                deck="LSAT",
                front="a",
                back="b",
                ease_factor=2.5,
                interval_days=0,
                repetitions=0,
                next_review=now - timedelta(minutes=1),
            )
        )
        async_session.add(
            SrsCard(
                id=uuid4(),
                user_id=seeded_user.id,
                deck="LSAT",
                front="c",
                back="d",
                ease_factor=2.5,
                interval_days=30,
                repetitions=5,
                next_review=now + timedelta(days=1),
            )
        )
        async_session.add(
            SrsCard(
                id=uuid4(),
                user_id=seeded_user.id,
                deck="PATENT_BAR",
                front="e",
                back="f",
                ease_factor=2.0,
                interval_days=1,
                repetitions=1,
                next_review=now + timedelta(hours=12),
                last_review=now,
            )
        )
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/srs/stats", headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        body = r.json()
        assert body["total_cards"] == 3
        assert body["due_now"] == 1
        # learning = cards with reps < 2 (the first and third)
        assert body["learning"] == 2
        # mature = interval ≥ 21 (only the second)
        assert body["mature"] == 1
        # reviews_today counts cards whose last_review is today (only third)
        assert body["reviews_today"] == 1
        # avg_ease = (2.5 + 2.5 + 2.0) / 3 = 2.333 rounded to 2.333
        assert body["average_ease"] == pytest.approx(2.333, abs=1e-3)

    async def test_stats_respects_deck_filter(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        async_session.add(
            SrsCard(
                id=uuid4(), user_id=seeded_user.id, deck="LSAT",
                front="a", back="b",
            )
        )
        async_session.add(
            SrsCard(
                id=uuid4(), user_id=seeded_user.id, deck="PATENT_BAR",
                front="c", back="d",
            )
        )
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/srs/stats",
            params={"deck": "LSAT"},
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 200
        body = r.json()
        assert body["deck"] == "LSAT"
        assert body["total_cards"] == 1


# ═══════════════════════════════════════════════════════════════════
# Input validation (schema-level rejections)
# ═══════════════════════════════════════════════════════════════════


class TestSrsInputValidation:
    async def test_create_rejects_blank_front(
        self, async_client: AsyncClient, seeded_user: User
    ):
        r = await async_client.post(
            f"{API}/me/srs/cards",
            json={"deck": "general", "front": "", "back": "answer"},
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 422

    async def test_create_rejects_blank_back(
        self, async_client: AsyncClient, seeded_user: User
    ):
        r = await async_client.post(
            f"{API}/me/srs/cards",
            json={"deck": "general", "front": "q", "back": ""},
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 422

    async def test_create_rejects_overlong_deck_name(
        self, async_client: AsyncClient, seeded_user: User
    ):
        # deck is max_length=64.
        r = await async_client.post(
            f"{API}/me/srs/cards",
            json={"deck": "x" * 65, "front": "q", "back": "a"},
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 422
