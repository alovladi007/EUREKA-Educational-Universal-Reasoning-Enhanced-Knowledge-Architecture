"""
Integration tests for /me/patent-bar/* endpoints (P1-3).

These exercise the FastAPI handlers end-to-end via httpx.AsyncClient
+ AsyncSession backed by in-memory aiosqlite. The endpoints read from
the user_progress table (P0-5) filtered to exam_type="PATENT_BAR" and
shape data into the Command Center's analytics + review-queue
envelopes. These tests lock down:

  • The analytics envelope shape — including the four "always empty"
    facet arrays (mpep_chapter, statute, content_type, trap_type)
    that api-core can't compute from the rolled-up user_progress
    table.
  • Per-topic weakness aggregation — counts, accuracy, mastery,
    sort order (mastery ASC), risk_slow_inaccurate threshold,
    summary KPIs (total_answered, average_mastery,
    slow_inaccurate_buckets).
  • review-queue selection rules — attempts ≥ 2 AND mastery ≤ 0.6,
    ordered by mastery ASC, capped at `limit` (default 20, bounds
    enforced by Query schema).
  • Cross-user scoping — one user's progress never leaks into
    another's analytics or review-queue.
  • Cross-exam scoping — LSAT progress rows never leak into the
    PATENT_BAR envelope.
  • Auth — both endpoints reject unauthenticated callers.

Local async fixtures (async_engine, async_session, seeded_user,
other_user, async_client, _auth_headers) live in this file so the
existing sync conftest.py is untouched. They mirror the fixtures in
test_srs_endpoints.py verbatim.
"""

from __future__ import annotations

from datetime import datetime, timezone
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

# Map every postgres-native column type the production models declare
# (UUID, JSONB, ARRAY, ENUM, TSVECTOR, INET) to a SQLite-renderable
# fallback for the in-memory test engine. See test_srs_endpoints.py
# for the canonical block + rationale.
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
from app.models.user import User
from app.models.user_progress import UserProgress
from app.utils.auth import create_access_token, hash_password
from main import app


pytestmark = [pytest.mark.integration, pytest.mark.asyncio]


# ── Async fixtures (local — don't pollute the global conftest) ─────


@pytest_asyncio.fixture
async def async_engine():
    """In-memory aiosqlite engine with the same Base metadata as prod.

    StaticPool keeps the same connection across the lifetime of the
    test so the in-memory DB persists between session opens.
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
    """Persist an org + user we can issue an access_token for."""
    org = Organization(
        id=uuid4(),
        name="Test Org",
        domain="test.example",
        settings={},
        is_active=True,
    )
    user = User(
        id=uuid4(),
        email="patent-bar-test@example.com",
        username="patent_bar_test",
        full_name="Patent Bar Tester",
        hashed_password=hash_password("not-used"),
        organization_id=org.id,
        role="student",
        is_active=True,
        is_verified=True,
    )
    async_session.add(org)
    async_session.add(user)
    await async_session.commit()
    await async_session.refresh(user)
    return user


@pytest_asyncio.fixture
async def other_user(async_session: AsyncSession) -> User:
    """A second user under a separate org — used to verify scoping."""
    org = Organization(
        id=uuid4(),
        name="Test Org B",
        domain="test-b.example",
        settings={},
        is_active=True,
    )
    user = User(
        id=uuid4(),
        email="patent-bar-other@example.com",
        username="patent_bar_other",
        full_name="Other Patent Bar Tester",
        hashed_password=hash_password("not-used"),
        organization_id=org.id,
        role="student",
        is_active=True,
        is_verified=True,
    )
    async_session.add(org)
    async_session.add(user)
    await async_session.commit()
    await async_session.refresh(user)
    return user


def _auth_headers(user: User) -> dict:
    """Mint a Bearer token for the given user. Mirrors what /auth/login
    returns (sub=user.id, plus standard claims)."""
    token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "org_id": str(user.organization_id),
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


def _mastery(attempts: int, correct: int) -> float:
    """Mirror UserProgress.mastery_from_accuracy() Laplace smoothing.

    (correct + 1) / (attempts + 2), clamped to [0, 1].
    """
    n = attempts + 2
    c = correct + 1
    return max(0.0, min(1.0, c / n))


def _progress(
    *,
    user_id,
    topic_id: str,
    exam_type: str = "PATENT_BAR",
    attempts: int = 0,
    correct: int = 0,
    avg_seconds: float = 30.0,
    mastery_level: float | None = None,
    last_seen_at: datetime | None = None,
) -> UserProgress:
    """Build a UserProgress row with explicit mastery, defaulting to
    the Laplace-smoothed value if not provided."""
    return UserProgress(
        id=uuid4(),
        user_id=user_id,
        exam_type=exam_type,
        topic_id=topic_id,
        attempts=attempts,
        correct=correct,
        avg_seconds=avg_seconds,
        mastery_level=mastery_level if mastery_level is not None else _mastery(attempts, correct),
        last_seen_at=last_seen_at or datetime.now(timezone.utc),
    )


# ═══════════════════════════════════════════════════════════════════
# Analytics envelope
# ═══════════════════════════════════════════════════════════════════


class TestPatentBarAnalytics:
    async def test_no_progress_returns_empty_envelope(
        self, async_client: AsyncClient, seeded_user: User
    ):
        r = await async_client.get(
            f"{API}/me/patent-bar/analytics", headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        body = r.json()
        assert body["exam_type"] == "PATENT_BAR"
        assert body["source"] == "api-core"
        assert body["total_answered"] == 0
        assert body["weakness_by_topic"] == []
        assert body["time_accuracy_points"] == []
        # api-core mirror can't compute these — they require test-prep's
        # per-question detail (Question.tags). Always empty.
        assert body["weakness_by_mpep_chapter"] == []
        assert body["weakness_by_statute"] == []
        assert body["weakness_by_content_type"] == []
        assert body["weakness_by_trap_type"] == []
        assert body["summary"]["slow_inaccurate_buckets"] == []
        assert body["summary"]["topics_attempted"] == 0
        assert body["summary"]["average_mastery"] == 0.0

    async def test_weakness_by_topic_populates_from_user_progress(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        # Three rows at three different mastery levels — endpoint sorts
        # by mastery ASC.
        async_session.add(
            _progress(
                user_id=seeded_user.id,
                topic_id="pa_subject_matter",
                attempts=10,
                correct=8,
                avg_seconds=45.0,
                mastery_level=0.75,
            )
        )
        async_session.add(
            _progress(
                user_id=seeded_user.id,
                topic_id="pa_novelty",
                attempts=8,
                correct=3,
                avg_seconds=80.0,
                mastery_level=0.30,
            )
        )
        async_session.add(
            _progress(
                user_id=seeded_user.id,
                topic_id="pa_obviousness",
                attempts=5,
                correct=3,
                avg_seconds=60.0,
                mastery_level=0.50,
            )
        )
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/patent-bar/analytics", headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        body = r.json()
        assert len(body["weakness_by_topic"]) == 3
        # Sort order: mastery ASC.
        keys = [row["key"] for row in body["weakness_by_topic"]]
        assert keys == ["pa_novelty", "pa_obviousness", "pa_subject_matter"]
        # Spot-check the shape on the first (lowest-mastery) row.
        first = body["weakness_by_topic"][0]
        assert first["attempts"] == 8
        assert first["correct"] == 3
        assert first["accuracy"] == pytest.approx(0.375, abs=1e-4)
        assert first["avg_time_seconds"] == 80.0
        assert first["mastery_level"] == pytest.approx(0.30, abs=1e-4)
        assert "last_seen_at" in first

    async def test_weakness_only_includes_patent_bar_exam(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        async_session.add(
            _progress(
                user_id=seeded_user.id,
                topic_id="pa_novelty",
                attempts=5,
                correct=2,
                mastery_level=0.4,
            )
        )
        # LSAT row — must NOT appear in PATENT_BAR analytics.
        async_session.add(
            _progress(
                user_id=seeded_user.id,
                topic_id="lr_strengthen",
                exam_type="LSAT",
                attempts=7,
                correct=2,
                mastery_level=0.35,
            )
        )
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/patent-bar/analytics", headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        body = r.json()
        keys = {row["key"] for row in body["weakness_by_topic"]}
        assert keys == {"pa_novelty"}
        # total_answered must also be scoped to PATENT_BAR rows only.
        assert body["total_answered"] == 5

    async def test_weakness_scopes_to_caller(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        other_user: User,
        async_session: AsyncSession,
    ):
        async_session.add(
            _progress(
                user_id=seeded_user.id,
                topic_id="pa_subject_matter",
                attempts=4,
                correct=2,
                mastery_level=0.5,
            )
        )
        async_session.add(
            _progress(
                user_id=other_user.id,
                topic_id="pa_novelty",
                attempts=6,
                correct=1,
                mastery_level=0.25,
            )
        )
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/patent-bar/analytics", headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        body = r.json()
        keys = {row["key"] for row in body["weakness_by_topic"]}
        assert keys == {"pa_subject_matter"}
        assert body["total_answered"] == 4

    async def test_risk_slow_inaccurate_flag_threshold(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        # Risk = avg_seconds > 120 AND accuracy < 0.55.
        # Row A: slow (130s) AND inaccurate (3/10 = 0.30) → risk=True.
        async_session.add(
            _progress(
                user_id=seeded_user.id,
                topic_id="pa_novelty",
                attempts=10,
                correct=3,
                avg_seconds=130.0,
                mastery_level=0.30,
            )
        )
        # Row B: slow (130s) but ACCURATE (8/10 = 0.80) → risk=False.
        async_session.add(
            _progress(
                user_id=seeded_user.id,
                topic_id="pa_obviousness",
                attempts=10,
                correct=8,
                avg_seconds=130.0,
                mastery_level=0.75,
            )
        )
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/patent-bar/analytics", headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        body = r.json()
        by_key = {row["key"]: row for row in body["weakness_by_topic"]}
        assert by_key["pa_novelty"]["risk_slow_inaccurate"] is True
        assert by_key["pa_obviousness"]["risk_slow_inaccurate"] is False
        # The slow_inaccurate_buckets summary should pick up only the
        # risky topic.
        assert "pa_novelty" in body["summary"]["slow_inaccurate_buckets"]
        assert "pa_obviousness" not in body["summary"]["slow_inaccurate_buckets"]

    async def test_total_answered_sums_attempts(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        for topic_id, attempts in [
            ("pa_subject_matter", 2),
            ("pa_novelty", 3),
            ("pa_obviousness", 5),
        ]:
            async_session.add(
                _progress(
                    user_id=seeded_user.id,
                    topic_id=topic_id,
                    attempts=attempts,
                    correct=1,
                    mastery_level=0.4,
                )
            )
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/patent-bar/analytics", headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        body = r.json()
        assert body["total_answered"] == 10

    async def test_summary_average_mastery_matches_mean(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        # Hand-picked masteries with a known mean of 0.4.
        for topic_id, m in [
            ("pa_subject_matter", 0.2),
            ("pa_novelty", 0.4),
            ("pa_obviousness", 0.6),
        ]:
            async_session.add(
                _progress(
                    user_id=seeded_user.id,
                    topic_id=topic_id,
                    attempts=5,
                    correct=2,
                    mastery_level=m,
                )
            )
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/patent-bar/analytics", headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        body = r.json()
        assert body["summary"]["average_mastery"] == pytest.approx(0.4, abs=1e-3)
        assert body["summary"]["topics_attempted"] == 3

    async def test_summary_slow_inaccurate_buckets_excludes_single_attempt(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        # This row would otherwise qualify (slow + inaccurate) but
        # has only 1 attempt — endpoint filters attempts ≥ 2.
        async_session.add(
            _progress(
                user_id=seeded_user.id,
                topic_id="pa_novelty",
                attempts=1,
                correct=0,
                avg_seconds=200.0,
                mastery_level=0.33,
            )
        )
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/patent-bar/analytics", headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        body = r.json()
        # The row still shows up in weakness_by_topic (analytics surfaces
        # all rows) but NOT in the slow_inaccurate_buckets summary.
        assert body["summary"]["slow_inaccurate_buckets"] == []

    async def test_time_accuracy_points_only_includes_attempted_topics(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        # attempts=0 row → no point.
        async_session.add(
            _progress(
                user_id=seeded_user.id,
                topic_id="pa_subject_matter",
                attempts=0,
                correct=0,
                avg_seconds=0.0,
                mastery_level=0.0,
            )
        )
        # attempts>0 row → exactly one point.
        async_session.add(
            _progress(
                user_id=seeded_user.id,
                topic_id="pa_novelty",
                attempts=4,
                correct=2,
                avg_seconds=50.0,
                mastery_level=0.5,
            )
        )
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/patent-bar/analytics", headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        body = r.json()
        assert len(body["time_accuracy_points"]) == 1
        assert body["time_accuracy_points"][0]["topic_id"] == "pa_novelty"


# ═══════════════════════════════════════════════════════════════════
# Review-queue selection
# ═══════════════════════════════════════════════════════════════════


class TestPatentBarReviewQueue:
    async def test_no_progress_returns_empty(
        self, async_client: AsyncClient, seeded_user: User
    ):
        r = await async_client.get(
            f"{API}/me/patent-bar/review-queue", headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        body = r.json()
        assert body["source"] == "api-core"
        assert body["cards"] == []
        assert body["total"] == 0

    async def test_returns_only_low_mastery_topics(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        # All rows have attempts ≥ 3 so the attempts-filter doesn't bite
        # — selection is purely on the mastery ceiling.
        for topic_id, m in [
            ("pa_subject_matter", 0.3),
            ("pa_novelty", 0.5),
            ("pa_obviousness", 0.7),
            ("pp_specification", 0.9),
        ]:
            async_session.add(
                _progress(
                    user_id=seeded_user.id,
                    topic_id=topic_id,
                    attempts=5,
                    correct=2,
                    mastery_level=m,
                )
            )
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/patent-bar/review-queue", headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        body = r.json()
        topics = [c["tags"]["topic_id"] for c in body["cards"]]
        assert set(topics) == {"pa_subject_matter", "pa_novelty"}
        assert body["total"] == 2

    async def test_returns_only_topics_with_2plus_attempts(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        # Low mastery, but only 1 attempt → endpoint filter excludes it.
        async_session.add(
            _progress(
                user_id=seeded_user.id,
                topic_id="pa_novelty",
                attempts=1,
                correct=0,
                mastery_level=0.33,
            )
        )
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/patent-bar/review-queue", headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        body = r.json()
        assert body["cards"] == []
        assert body["total"] == 0

    async def test_ordered_by_mastery_ascending(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        for topic_id, m in [
            ("pa_subject_matter", 0.55),
            ("pa_novelty", 0.20),
            ("pa_obviousness", 0.40),
        ]:
            async_session.add(
                _progress(
                    user_id=seeded_user.id,
                    topic_id=topic_id,
                    attempts=5,
                    correct=2,
                    mastery_level=m,
                )
            )
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/patent-bar/review-queue", headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        body = r.json()
        topics = [c["tags"]["topic_id"] for c in body["cards"]]
        # Weakest first.
        assert topics == ["pa_novelty", "pa_obviousness", "pa_subject_matter"]

    async def test_respects_limit_param(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        # Five qualifying rows, all at different mastery levels.
        for topic_id, m in [
            ("pa_subject_matter", 0.10),
            ("pa_novelty", 0.20),
            ("pa_obviousness", 0.30),
            ("pp_specification", 0.40),
            ("eth_candor", 0.50),
        ]:
            async_session.add(
                _progress(
                    user_id=seeded_user.id,
                    topic_id=topic_id,
                    attempts=5,
                    correct=2,
                    mastery_level=m,
                )
            )
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/patent-bar/review-queue",
            params={"limit": 3},
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 200
        body = r.json()
        assert len(body["cards"]) == 3
        assert body["total"] == 3
        # The 3 weakest should be the ones returned.
        topics = [c["tags"]["topic_id"] for c in body["cards"]]
        assert topics == ["pa_subject_matter", "pa_novelty", "pa_obviousness"]

    async def test_limit_param_bounds(
        self, async_client: AsyncClient, seeded_user: User
    ):
        # limit=0 violates ge=1.
        r = await async_client.get(
            f"{API}/me/patent-bar/review-queue",
            params={"limit": 0},
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 422
        # limit=101 violates le=100.
        r = await async_client.get(
            f"{API}/me/patent-bar/review-queue",
            params={"limit": 101},
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 422

    async def test_card_envelope_shape(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        async_session.add(
            _progress(
                user_id=seeded_user.id,
                topic_id="pa_novelty",
                attempts=8,
                correct=3,
                avg_seconds=75.0,
                mastery_level=0.30,
            )
        )
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/patent-bar/review-queue", headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        body = r.json()
        assert len(body["cards"]) == 1
        card = body["cards"][0]
        # Top-level keys.
        assert set(card.keys()) == {"id", "front", "back", "tags", "progress"}
        # id is a string UUID — round-trip parse to be sure.
        from uuid import UUID as _UUID

        _UUID(card["id"])  # raises if not a valid UUID string
        assert card["front"] == "Review: pa_novelty"
        assert isinstance(card["back"], str) and card["back"]
        # tags.
        assert card["tags"] == {
            "topic_id": "pa_novelty",
            "source": "user_progress",
            "exam_type": "PATENT_BAR",
        }
        # progress.
        prog = card["progress"]
        assert prog["attempts"] == 8
        assert prog["correct"] == 3
        assert prog["accuracy"] == pytest.approx(0.375, abs=1e-4)
        assert prog["mastery_level"] == pytest.approx(0.30, abs=1e-4)
        assert "last_seen_at" in prog

    async def test_scopes_to_caller(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        other_user: User,
        async_session: AsyncSession,
    ):
        async_session.add(
            _progress(
                user_id=seeded_user.id,
                topic_id="pa_subject_matter",
                attempts=5,
                correct=1,
                mastery_level=0.25,
            )
        )
        async_session.add(
            _progress(
                user_id=other_user.id,
                topic_id="pa_novelty",
                attempts=5,
                correct=1,
                mastery_level=0.20,
            )
        )
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/patent-bar/review-queue", headers=_auth_headers(seeded_user)
        )
        assert r.status_code == 200
        body = r.json()
        topics = [c["tags"]["topic_id"] for c in body["cards"]]
        assert topics == ["pa_subject_matter"]


# ═══════════════════════════════════════════════════════════════════
# Auth
# ═══════════════════════════════════════════════════════════════════


class TestPatentBarAuth:
    async def test_endpoints_require_auth(self, async_client: AsyncClient):
        # No Authorization header on either endpoint → 401.
        for path in [
            f"{API}/me/patent-bar/analytics",
            f"{API}/me/patent-bar/review-queue",
        ]:
            r = await async_client.get(path)
            assert r.status_code == 401, f"expected 401 on {path}, got {r.status_code}"
