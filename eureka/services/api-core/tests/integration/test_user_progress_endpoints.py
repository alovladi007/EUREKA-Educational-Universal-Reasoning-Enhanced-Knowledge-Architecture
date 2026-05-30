"""
Integration tests for /me/progress* endpoints (P0-5).

These exercise the FastAPI handlers end-to-end via httpx.AsyncClient
+ AsyncSession backed by in-memory aiosqlite. They focus on the HTTP
contract:

  • Upsert: POST creates a new row, subsequent POSTs for the same
    (exam, topic) tuple update running-mean fields.
  • Scoping: a user only sees their own rows; cross-user isolation.
  • Filtering: ?exam_type=X partitions both list and summary.
  • Empty states: zero attempts → 200 with empty/zeroed shape, NOT 404.
  • Summary aggregation: totals, accuracy, weakest-topics (with the
    ≥3-attempts qualifier and the 5-row cap).
  • Auth: 401 without a Bearer token.
  • 422s for bad input shapes (enum, length, range).

Local async fixtures (overrides_get_db, async_client, …) live in this
file so the existing sync conftest.py is untouched. Pattern mirrors
test_srs_endpoints.py.
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
        email="progress-test@example.com",
        username="progress_test",
        full_name="Progress Tester",
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
        email="progress-other@example.com",
        username="progress_other",
        full_name="Other Progress Tester",
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


# ═══════════════════════════════════════════════════════════════════
# CRUD: POST upsert + GET list
# ═══════════════════════════════════════════════════════════════════


class TestProgressCrud:
    async def test_post_creates_new_row(
        self, async_client: AsyncClient, seeded_user: User
    ):
        r = await async_client.post(
            f"{API}/me/progress",
            json={
                "exam_type": "PATENT_BAR",
                "topic_id": "pa_subject_matter",
                "is_correct": True,
                "seconds": 30,
            },
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["exam_type"] == "PATENT_BAR"
        assert body["topic_id"] == "pa_subject_matter"
        assert body["attempts"] == 1
        assert body["correct"] == 1
        assert body["avg_seconds"] == pytest.approx(30.0, abs=1e-9)
        # Laplace smoothing: (correct+1)/(attempts+2) = 2/3
        assert body["mastery_level"] == pytest.approx(2 / 3, abs=1e-9)
        assert body["user_id"] == str(seeded_user.id)

    async def test_post_upserts_running_mean(
        self, async_client: AsyncClient, seeded_user: User
    ):
        # Three POSTs against the same (exam, topic).
        triples = [
            (True, 30.0),
            (False, 60.0),
            (True, 90.0),
        ]
        last_body = None
        for is_correct, seconds in triples:
            r = await async_client.post(
                f"{API}/me/progress",
                json={
                    "exam_type": "PATENT_BAR",
                    "topic_id": "pa_subject_matter",
                    "is_correct": is_correct,
                    "seconds": seconds,
                },
                headers=_auth_headers(seeded_user),
            )
            assert r.status_code == 200, r.text
            last_body = r.json()

        assert last_body is not None
        assert last_body["attempts"] == 3
        assert last_body["correct"] == 2
        # Running mean of [30, 60, 90] = 60.0
        assert last_body["avg_seconds"] == pytest.approx(60.0, abs=1e-9)
        # Laplace: (2+1)/(3+2) = 0.6
        assert last_body["mastery_level"] == pytest.approx(0.6, abs=1e-9)

    async def test_post_seconds_optional(
        self, async_client: AsyncClient, seeded_user: User
    ):
        # First POST without seconds → avg_seconds = 0 on a fresh row.
        r1 = await async_client.post(
            f"{API}/me/progress",
            json={
                "exam_type": "LSAT",
                "topic_id": "lr_strengthen",
                "is_correct": True,
            },
            headers=_auth_headers(seeded_user),
        )
        assert r1.status_code == 200, r1.text
        assert r1.json()["avg_seconds"] == pytest.approx(0.0, abs=1e-9)

        # Second POST with seconds → avg_seconds gets updated.
        r2 = await async_client.post(
            f"{API}/me/progress",
            json={
                "exam_type": "LSAT",
                "topic_id": "lr_strengthen",
                "is_correct": True,
                "seconds": 40.0,
            },
            headers=_auth_headers(seeded_user),
        )
        assert r2.status_code == 200, r2.text
        # Running mean: (0*1 + 40)/2 = 20.0
        assert r2.json()["avg_seconds"] == pytest.approx(20.0, abs=1e-9)

        # Third POST without seconds → avg_seconds should stay unchanged.
        r3 = await async_client.post(
            f"{API}/me/progress",
            json={
                "exam_type": "LSAT",
                "topic_id": "lr_strengthen",
                "is_correct": False,
            },
            headers=_auth_headers(seeded_user),
        )
        assert r3.status_code == 200, r3.text
        assert r3.json()["avg_seconds"] == pytest.approx(20.0, abs=1e-9)
        assert r3.json()["attempts"] == 3

    async def test_list_progress_scopes_to_caller(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        other_user: User,
    ):
        # Seed: 2 rows for seeded_user (PATENT_BAR), 1 for other_user.
        for topic in ["pa_subject_matter", "pa_utility"]:
            await async_client.post(
                f"{API}/me/progress",
                json={
                    "exam_type": "PATENT_BAR",
                    "topic_id": topic,
                    "is_correct": True,
                    "seconds": 30,
                },
                headers=_auth_headers(seeded_user),
            )
        await async_client.post(
            f"{API}/me/progress",
            json={
                "exam_type": "PATENT_BAR",
                "topic_id": "pa_subject_matter",
                "is_correct": False,
                "seconds": 45,
            },
            headers=_auth_headers(other_user),
        )

        r = await async_client.get(
            f"{API}/me/progress",
            params={"exam_type": "PATENT_BAR"},
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 200, r.text
        rows = r.json()
        assert len(rows) == 2
        for row in rows:
            assert row["user_id"] == str(seeded_user.id)
        topics = {row["topic_id"] for row in rows}
        assert topics == {"pa_subject_matter", "pa_utility"}

    async def test_list_progress_filters_by_exam_type(
        self, async_client: AsyncClient, seeded_user: User
    ):
        # Seed PATENT_BAR + LSAT rows for the same user.
        await async_client.post(
            f"{API}/me/progress",
            json={
                "exam_type": "PATENT_BAR",
                "topic_id": "pa_subject_matter",
                "is_correct": True,
                "seconds": 30,
            },
            headers=_auth_headers(seeded_user),
        )
        await async_client.post(
            f"{API}/me/progress",
            json={
                "exam_type": "LSAT",
                "topic_id": "lr_strengthen",
                "is_correct": False,
                "seconds": 50,
            },
            headers=_auth_headers(seeded_user),
        )

        r = await async_client.get(
            f"{API}/me/progress",
            params={"exam_type": "LSAT"},
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 200, r.text
        rows = r.json()
        assert len(rows) == 1
        assert rows[0]["exam_type"] == "LSAT"
        assert rows[0]["topic_id"] == "lr_strengthen"

    async def test_list_progress_empty_returns_empty_list_not_404(
        self, async_client: AsyncClient, seeded_user: User
    ):
        r = await async_client.get(
            f"{API}/me/progress",
            params={"exam_type": "PATENT_BAR"},
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 200, r.text
        assert r.json() == []


# ═══════════════════════════════════════════════════════════════════
# Summary endpoint
# ═══════════════════════════════════════════════════════════════════


class TestProgressSummary:
    async def test_summary_with_no_attempts_returns_zeros(
        self, async_client: AsyncClient, seeded_user: User
    ):
        r = await async_client.get(
            f"{API}/me/progress/summary",
            params={"exam_type": "PATENT_BAR"},
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["exam_type"] == "PATENT_BAR"
        assert body["total_topics"] == 0
        assert body["total_attempts"] == 0
        assert body["total_correct"] == 0
        assert body["accuracy"] == pytest.approx(0.0, abs=1e-9)
        assert body["average_mastery"] == pytest.approx(0.0, abs=1e-9)
        assert body["weakest_topics"] == []

    async def test_summary_counts_match_seeded_state(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        # Seed three PATENT_BAR topics with known (attempts, correct).
        # Topic A: 4 attempts, 3 correct
        # Topic B: 5 attempts, 2 correct
        # Topic C: 3 attempts, 3 correct
        seeds = [
            ("pa_subject_matter", 4, 3),
            ("pa_utility", 5, 2),
            ("pa_novelty", 3, 3),
        ]
        for topic, attempts, correct in seeds:
            row = UserProgress(
                user_id=seeded_user.id,
                exam_type="PATENT_BAR",
                topic_id=topic,
                attempts=attempts,
                correct=correct,
                avg_seconds=30.0,
            )
            row.mastery_level = row.mastery_from_accuracy()
            async_session.add(row)
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/progress/summary",
            params={"exam_type": "PATENT_BAR"},
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 200, r.text
        body = r.json()
        total_attempts = 4 + 5 + 3
        total_correct = 3 + 2 + 3
        assert body["total_topics"] == 3
        assert body["total_attempts"] == total_attempts
        assert body["total_correct"] == total_correct
        assert body["accuracy"] == pytest.approx(
            total_correct / total_attempts, abs=1e-9
        )

    async def test_weakest_topics_only_includes_3plus_attempts(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        # below_threshold: 2 attempts, 0 correct → 0% accuracy but
        # should be filtered out (attempts < 3).
        below = UserProgress(
            user_id=seeded_user.id,
            exam_type="PATENT_BAR",
            topic_id="pa_below_threshold",
            attempts=2,
            correct=0,
            avg_seconds=10.0,
        )
        below.mastery_level = below.mastery_from_accuracy()
        # qualifies: 3 attempts, 1 correct → 33% accuracy, qualifies.
        qualifies = UserProgress(
            user_id=seeded_user.id,
            exam_type="PATENT_BAR",
            topic_id="pa_qualifies",
            attempts=3,
            correct=1,
            avg_seconds=20.0,
        )
        qualifies.mastery_level = qualifies.mastery_from_accuracy()
        async_session.add(below)
        async_session.add(qualifies)
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/progress/summary",
            params={"exam_type": "PATENT_BAR"},
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 200, r.text
        body = r.json()
        weak_topic_ids = {row["topic_id"] for row in body["weakest_topics"]}
        assert "pa_qualifies" in weak_topic_ids
        assert "pa_below_threshold" not in weak_topic_ids

    async def test_weakest_topics_capped_at_5(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        # 8 qualifying weak topics, each with 3 attempts and 0 correct so
        # they all have the same (low) mastery — the cap of 5 should still
        # apply, regardless of tie-breaking.
        for i in range(8):
            row = UserProgress(
                user_id=seeded_user.id,
                exam_type="PATENT_BAR",
                topic_id=f"weak_topic_{i}",
                attempts=3 + i,  # vary attempts so mastery varies a touch
                correct=i,       # vary correctness so mastery varies too
                avg_seconds=20.0,
            )
            row.mastery_level = row.mastery_from_accuracy()
            async_session.add(row)
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/progress/summary",
            params={"exam_type": "PATENT_BAR"},
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert len(body["weakest_topics"]) == 5
        # Sorted ascending by mastery_level.
        mastery_values = [row["mastery_level"] for row in body["weakest_topics"]]
        assert mastery_values == sorted(mastery_values)

    async def test_summary_filters_by_exam_type(
        self,
        async_client: AsyncClient,
        seeded_user: User,
        async_session: AsyncSession,
    ):
        # PATENT_BAR row: 4 attempts / 4 correct.
        pb = UserProgress(
            user_id=seeded_user.id,
            exam_type="PATENT_BAR",
            topic_id="pa_subject_matter",
            attempts=4,
            correct=4,
            avg_seconds=25.0,
        )
        pb.mastery_level = pb.mastery_from_accuracy()
        # LSAT row: 2 attempts / 1 correct.
        ls = UserProgress(
            user_id=seeded_user.id,
            exam_type="LSAT",
            topic_id="lr_strengthen",
            attempts=2,
            correct=1,
            avg_seconds=60.0,
        )
        ls.mastery_level = ls.mastery_from_accuracy()
        async_session.add(pb)
        async_session.add(ls)
        await async_session.commit()

        r = await async_client.get(
            f"{API}/me/progress/summary",
            params={"exam_type": "PATENT_BAR"},
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["exam_type"] == "PATENT_BAR"
        assert body["total_topics"] == 1
        assert body["total_attempts"] == 4
        assert body["total_correct"] == 4
        assert body["accuracy"] == pytest.approx(1.0, abs=1e-9)


# ═══════════════════════════════════════════════════════════════════
# Auth
# ═══════════════════════════════════════════════════════════════════


class TestProgressAuth:
    async def test_endpoints_require_auth(self, async_client: AsyncClient):
        # No Authorization header for either GET path.
        for path, params in [
            (f"{API}/me/progress", {"exam_type": "PATENT_BAR"}),
            (f"{API}/me/progress/summary", {"exam_type": "PATENT_BAR"}),
        ]:
            r = await async_client.get(path, params=params)
            assert r.status_code == 401, (
                f"expected 401 on GET {path}, got {r.status_code}"
            )

    async def test_post_requires_auth(self, async_client: AsyncClient):
        r = await async_client.post(
            f"{API}/me/progress",
            json={
                "exam_type": "PATENT_BAR",
                "topic_id": "pa_subject_matter",
                "is_correct": True,
                "seconds": 30,
            },
        )
        assert r.status_code == 401


# ═══════════════════════════════════════════════════════════════════
# Input validation (schema-level rejections)
# ═══════════════════════════════════════════════════════════════════


class TestProgressInputValidation:
    async def test_post_rejects_unknown_exam_type(
        self, async_client: AsyncClient, seeded_user: User
    ):
        r = await async_client.post(
            f"{API}/me/progress",
            json={
                "exam_type": "HOGWARTS",
                "topic_id": "pa_subject_matter",
                "is_correct": True,
                "seconds": 30,
            },
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 422

    async def test_post_rejects_blank_topic_id(
        self, async_client: AsyncClient, seeded_user: User
    ):
        r = await async_client.post(
            f"{API}/me/progress",
            json={
                "exam_type": "PATENT_BAR",
                "topic_id": "",
                "is_correct": True,
                "seconds": 30,
            },
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 422

    async def test_post_rejects_overlong_topic_id(
        self, async_client: AsyncClient, seeded_user: User
    ):
        r = await async_client.post(
            f"{API}/me/progress",
            json={
                "exam_type": "PATENT_BAR",
                "topic_id": "x" * 81,
                "is_correct": True,
                "seconds": 30,
            },
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 422

    async def test_post_rejects_negative_seconds(
        self, async_client: AsyncClient, seeded_user: User
    ):
        r = await async_client.post(
            f"{API}/me/progress",
            json={
                "exam_type": "PATENT_BAR",
                "topic_id": "pa_subject_matter",
                "is_correct": True,
                "seconds": -1,
            },
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 422

    async def test_post_rejects_oversized_seconds(
        self, async_client: AsyncClient, seeded_user: User
    ):
        r = await async_client.post(
            f"{API}/me/progress",
            json={
                "exam_type": "PATENT_BAR",
                "topic_id": "pa_subject_matter",
                "is_correct": True,
                "seconds": 3601,
            },
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 422

    async def test_get_rejects_missing_exam_type(
        self, async_client: AsyncClient, seeded_user: User
    ):
        r = await async_client.get(
            f"{API}/me/progress",
            headers=_auth_headers(seeded_user),
        )
        assert r.status_code == 422
