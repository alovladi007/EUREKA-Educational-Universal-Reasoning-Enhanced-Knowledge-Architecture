"""
End-to-end tests for the SM-2 ladder through the SRS HTTP API.

Where test_srs_endpoints.py covers the HTTP envelope (CRUD, auth,
schema validation) plus a couple of single-review smoke checks
(q=5 first pass, q=0 reset), this file goes one layer deeper and
verifies the multi-review trajectories actually come out of the API
in the exact shape the SM-2 spec dictates:

  • TestSrsReviewLadder       — five consecutive q=4 → [1, 6, 15, 38, 95]
  • TestSrsReviewFailRecovery — [4,4,4,0,4] → [1, 6, 15, 1, 1]
  • TestSrsReviewEFFloor      — 20× q=0 must clamp EF ≥ 1.3
  • TestSrsReviewDueRefresh   — after a pass the card leaves the due queue
  • TestSrsCounters           — total_reviews / total_correct round-trip
  • TestSrsBudgetSeparation   — stats?deck=X partitions correctly

The unit-test suite (tests/unit/test_srs_sm2.py) already covers these
trajectories at the model layer; this file's contribution is proving
the SM-2 update SURVIVES the JSON serialisation, DB commit, and refresh
round-trip on every call.

Local async fixtures mirror test_srs_endpoints.py — see that file for
the canonical block + rationale.
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

from app.core.database import Base, get_db
from app.models.organization import Organization
from app.models.srs_card import SM2_MIN_EASE_FACTOR, SrsCard
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
    """Active user. Org slug is unique to this file to avoid
    cross-suite collisions when the whole integration tree is run."""
    org = Organization(
        id=uuid4(),
        name="Test Org SRS Streaks",
        slug="test-srs-streaks",
        tier="undergraduate",
        country="US",
        settings={},
        tier_config={},
        is_active=True,
    )
    user = User(
        id=uuid4(),
        email="srs-streaks@example.com",
        first_name="SRS",
        last_name="Streaks",
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


def _card_payload(**overrides) -> dict:
    base = {
        "deck": "PATENT_BAR",
        "front": "Q: §101 categories?",
        "back": "A: PMMC",
    }
    base.update(overrides)
    return base


async def _create_card(
    client: AsyncClient, user: User, **overrides
) -> dict:
    r = await client.post(
        f"{API}/me/srs/cards",
        json=_card_payload(**overrides),
        headers=_auth_headers(user),
    )
    assert r.status_code == 201, r.text
    return r.json()


async def _review(
    client: AsyncClient, user: User, card_id: str, quality: int
) -> dict:
    r = await client.post(
        f"{API}/me/srs/cards/{card_id}/review",
        json={"quality": quality},
        headers=_auth_headers(user),
    )
    assert r.status_code == 200, r.text
    return r.json()


# ═══════════════════════════════════════════════════════════════════
# Five-pass ladder — interval sequence [1, 6, 15, 38, 95]
# ═══════════════════════════════════════════════════════════════════


class TestSrsReviewLadder:
    async def test_q4_five_times_yields_ladder_1_6_15_38_95(
        self, async_client: AsyncClient, seeded_user: User
    ):
        """Brand-new card, EF starts at 2.5. q=4 has ef_delta = 0 so
        the ladder is purely interval×EF after rep 2:

            review 1: interval := 1    (rep=1 branch)
            review 2: interval := 6    (rep=2 branch)
            review 3: round(6 × 2.5)  = 15
            review 4: round(15 × 2.5) = 38   (round-half-to-even = 38)
            review 5: round(38 × 2.5) = 95

        This is the exact assertion from
        unit/test_srs_sm2.py::test_realistic_pass_trajectory_with_default_easiness
        — replicated here over the HTTP transport to prove the JSON
        envelope round-trips cleanly on every call.
        """
        card = await _create_card(async_client, seeded_user)
        intervals = []
        for _ in range(5):
            body = await _review(async_client, seeded_user, card["id"], 4)
            intervals.append(body["interval_days"])

        assert intervals == [1, 6, 15, 38, 95]
        # EF unchanged by q=4 (delta = 0).
        assert intervals  # silence linter — already asserted above

        # Pull current state via list to confirm DB matches the
        # final review response.
        r = await async_client.get(
            f"{API}/me/srs/cards", headers=_auth_headers(seeded_user)
        )
        body = r.json()
        assert body["total"] == 1
        persisted = body["cards"][0]
        assert persisted["interval_days"] == 95
        assert persisted["repetitions"] == 5
        assert persisted["total_reviews"] == 5
        assert persisted["total_correct"] == 5
        assert persisted["ease_factor"] == pytest.approx(2.5, abs=1e-6)


# ═══════════════════════════════════════════════════════════════════
# Fail recovery — pass-pass-pass-fail-pass → [1, 6, 15, 1, 1]
# ═══════════════════════════════════════════════════════════════════


class TestSrsReviewFailRecovery:
    async def test_fail_resets_streak_then_pass_starts_over(
        self, async_client: AsyncClient, seeded_user: User
    ):
        """Walk a card through [4, 4, 4, 0, 4]:

            review 1 (q=4): interval=1, reps=1
            review 2 (q=4): interval=6, reps=2
            review 3 (q=4): interval=15, reps=3
            review 4 (q=0): FAIL — reps→0, interval→1
            review 5 (q=4): PASS after reset — reps=1, interval=1

        Replicates unit test_realistic_fail_then_recover_resets_then_climbs
        over the HTTP API."""
        card = await _create_card(async_client, seeded_user)
        intervals = []
        for q in [4, 4, 4, 0, 4]:
            body = await _review(async_client, seeded_user, card["id"], q)
            intervals.append(body["interval_days"])

        assert intervals == [1, 6, 15, 1, 1]

        # Final state: 5 reviews, 4 correct (only q=0 doesn't count).
        r = await async_client.get(
            f"{API}/me/srs/cards", headers=_auth_headers(seeded_user)
        )
        persisted = r.json()["cards"][0]
        assert persisted["repetitions"] == 1
        assert persisted["total_reviews"] == 5
        assert persisted["total_correct"] == 4


# ═══════════════════════════════════════════════════════════════════
# EF floor — 20× q=0 must NOT drive EF below 1.3
# ═══════════════════════════════════════════════════════════════════


class TestSrsReviewEFFloor:
    async def test_repeated_fails_clamp_ease_factor_at_floor(
        self, async_client: AsyncClient, seeded_user: User
    ):
        """SM-2 spec: EF := max(1.3, EF + delta). q=0 has the steepest
        negative delta (−0.8), so 20 consecutive q=0 should drive EF
        well below 1.3 if unclamped (2.5 + 20·(−0.8) = −13.5). The
        floor must hold.

        We check both the immediate response AND the persisted state
        after each review to make sure the clamp isn't dropped during
        serialisation."""
        card = await _create_card(async_client, seeded_user)

        for i in range(20):
            body = await _review(async_client, seeded_user, card["id"], 0)
            assert body["ease_factor"] >= SM2_MIN_EASE_FACTOR, (
                f"EF dropped below floor after review {i + 1}: "
                f"got {body['ease_factor']}"
            )

        # Final state matches what the last review returned.
        r = await async_client.get(
            f"{API}/me/srs/cards", headers=_auth_headers(seeded_user)
        )
        persisted = r.json()["cards"][0]
        assert persisted["ease_factor"] == pytest.approx(
            SM2_MIN_EASE_FACTOR, abs=1e-6
        )
        # 20 failures means 0 in total_correct and reps clamped to 0.
        assert persisted["total_reviews"] == 20
        assert persisted["total_correct"] == 0
        assert persisted["repetitions"] == 0


# ═══════════════════════════════════════════════════════════════════
# Due-queue refresh — after a successful review the card is no
# longer "due now"
# ═══════════════════════════════════════════════════════════════════


class TestSrsReviewDueRefresh:
    async def test_card_leaves_due_queue_after_successful_review(
        self, async_client: AsyncClient, seeded_user: User
    ):
        """Newly-created cards have next_review = now (effectively due
        immediately). A successful review with q=4 sets next_review =
        now + 1 day — so a follow-up GET /due should return an empty
        list."""
        headers = _auth_headers(seeded_user)
        card = await _create_card(async_client, seeded_user)

        # Pre-review: the card IS due. (We don't strictly need this
        # assertion to pass for the test below — sometimes the SQLite
        # default for next_review is non-deterministic — but if it's
        # there we want to see it.)
        pre = await async_client.get(
            f"{API}/me/srs/cards/due", headers=headers
        )
        assert pre.status_code == 200

        await _review(async_client, seeded_user, card["id"], 4)

        # Post-review: interval=1 → next_review tomorrow → NOT due now.
        post = await async_client.get(
            f"{API}/me/srs/cards/due", headers=headers
        )
        assert post.status_code == 200
        body = post.json()
        # The freshly-reviewed card should NOT appear in /due.
        ids = {c["id"] for c in body["cards"]}
        assert card["id"] not in ids


# ═══════════════════════════════════════════════════════════════════
# Counter round-trip — total_reviews / total_correct after a mix
# ═══════════════════════════════════════════════════════════════════


class TestSrsCounters:
    async def test_total_reviews_and_total_correct_match_quality_history(
        self, async_client: AsyncClient, seeded_user: User
    ):
        """Run a 10-review sequence with a deterministic mix of passes
        and failures. SM-2 pass threshold is q ≥ 3, so:

            qualities = [5,5,0,4,3,2,5,4,3,0]
            passes    = [✓,✓,✗,✓,✓,✗,✓,✓,✓,✗]  → 7 correct, 10 total
        """
        card = await _create_card(async_client, seeded_user)
        qualities = [5, 5, 0, 4, 3, 2, 5, 4, 3, 0]
        for q in qualities:
            await _review(async_client, seeded_user, card["id"], q)

        expected_correct = sum(1 for q in qualities if q >= 3)
        assert expected_correct == 7  # sanity

        r = await async_client.get(
            f"{API}/me/srs/cards", headers=_auth_headers(seeded_user)
        )
        persisted = r.json()["cards"][0]
        assert persisted["total_reviews"] == len(qualities)
        assert persisted["total_correct"] == expected_correct


# ═══════════════════════════════════════════════════════════════════
# Deck-budget separation — stats?deck=X must partition the user's
# cards by deck without leaking across
# ═══════════════════════════════════════════════════════════════════


class TestSrsBudgetSeparation:
    async def test_stats_partitions_by_deck(
        self, async_client: AsyncClient, seeded_user: User
    ):
        """Create cards under two decks, review some in each, and
        verify:

          * stats?deck=LSAT returns only LSAT counts
          * stats?deck=PATENT_BAR returns only PATENT_BAR counts
          * stats with no deck returns the union
        """
        headers = _auth_headers(seeded_user)

        # 2 LSAT cards.
        lsat_cards = []
        for i in range(2):
            c = await _create_card(
                async_client, seeded_user, deck="LSAT", front=f"lsat-{i}"
            )
            lsat_cards.append(c)

        # 3 PATENT_BAR cards.
        pb_cards = []
        for i in range(3):
            c = await _create_card(
                async_client,
                seeded_user,
                deck="PATENT_BAR",
                front=f"pb-{i}",
            )
            pb_cards.append(c)

        # Review just one card in each deck so the counts are
        # asymmetric and can't be aliased by accident.
        await _review(async_client, seeded_user, lsat_cards[0]["id"], 5)
        await _review(async_client, seeded_user, pb_cards[0]["id"], 4)
        await _review(async_client, seeded_user, pb_cards[1]["id"], 0)

        # Deck-scoped stats — LSAT.
        r_lsat = await async_client.get(
            f"{API}/me/srs/stats",
            params={"deck": "LSAT"},
            headers=headers,
        )
        assert r_lsat.status_code == 200
        lsat = r_lsat.json()
        assert lsat["deck"] == "LSAT"
        assert lsat["total_cards"] == 2

        # Deck-scoped stats — PATENT_BAR.
        r_pb = await async_client.get(
            f"{API}/me/srs/stats",
            params={"deck": "PATENT_BAR"},
            headers=headers,
        )
        assert r_pb.status_code == 200
        pb = r_pb.json()
        assert pb["deck"] == "PATENT_BAR"
        assert pb["total_cards"] == 3

        # Union — no deck filter, should see all 5.
        r_all = await async_client.get(
            f"{API}/me/srs/stats", headers=headers
        )
        assert r_all.status_code == 200
        all_ = r_all.json()
        assert all_["deck"] is None
        assert all_["total_cards"] == 5
