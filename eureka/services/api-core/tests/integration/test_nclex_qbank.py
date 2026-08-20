"""Integration tests for /nclex/qbank/* (NX-3/NX-4).

What this router owes — the MCAT server-bank contract plus the NCLEX
additions:
  - Serving never carries a key or an explanation, for EITHER item kind.
  - Single items grade via choice_index; SATA items grade via
    choice_indices, ALL-OR-NOTHING, with the per-option breakdown in the
    response and the chosen set recorded in the attempt log's metadata.
  - Submitting the wrong shape for an item's kind is a 422, not a guess.
  - Every graded response becomes an attempt_logs row (source
    'nclex_qbank') and bumps attempts_count.
  - FLAGGED items never serve.
  - The verification tier ('calc-verified' vs 'unverified') travels on
    serving and grading payloads.

Fixtures mirror tests/integration/test_mcat_qbank.py.
"""

from __future__ import annotations

from typing import AsyncGenerator
from uuid import uuid4

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.models.exam import AttemptLog
from app.models.item_bank import Item, ItemBank, ItemKind, ItemReviewStatus
from app.models.organization import Organization
from app.models.skill import SkillFramework
from app.models.user import User
from app.utils.auth import create_access_token, hash_password

from tests.integration._sqlite_compat import install_all as _install_sqlite_compat

_install_sqlite_compat(Base)

import json as _json  # noqa: E402
import sqlite3 as _sqlite3  # noqa: E402

# ARRAY(String) columns (Item.tags) compile to TEXT under the sqlite shims,
# but the driver still receives Python lists - adapt them to JSON text.
_sqlite3.register_adapter(list, _json.dumps)

from main import app  # noqa: E402


pytestmark = [pytest.mark.integration, pytest.mark.asyncio]

API = "/api/v1/nclex/qbank"


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
    maker = async_sessionmaker(
        async_engine, expire_on_commit=False, class_=AsyncSession
    )
    async with maker() as session:
        yield session


@pytest_asyncio.fixture
async def seeded_user(async_session: AsyncSession) -> User:
    org = Organization(
        id=uuid4(), name="Test Org", slug="test-nclex-qbank",
        tier="professional_law", country="US", settings={}, tier_config={},
        is_active=True,
    )
    user = User(
        id=uuid4(), email="nclex-qbank-test@example.com", first_name="Qbank",
        last_name="Tester", hashed_password=hash_password("not-used"),
        org_id=org.id, role="student", is_active=True, is_email_verified=True,
    )
    async_session.add_all([org, user])
    await async_session.commit()
    await async_session.refresh(user)
    return user


def _auth_headers(user: User) -> dict:
    token = create_access_token(
        data={"sub": str(user.id), "email": user.email,
              "org_id": str(user.org_id), "role": user.role}
    )
    return {"Authorization": f"Bearer {token}"}


@pytest_asyncio.fixture
async def async_client(async_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
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


async def _seed_bank(session: AsyncSession) -> tuple[ItemBank, Item, Item, Item]:
    """One single-choice dosage item (calc-verified), one SATA item, and one
    FLAGGED item that must never serve."""
    bank = ItemBank(
        slug="nclex-qbank-v1", name="NCLEX QBank (test)",
        framework=SkillFramework.NCLEX, tier="test_prep",
        default_license="proprietary",
    )
    session.add(bank)
    await session.flush()
    single = Item(
        bank_id=bank.id, family_id=uuid4(), kind=ItemKind.MCQ_SINGLE,
        content={
            "stem": "Ordered 7.5 mg; tablets are 5 mg. How many tablets?",
            "options": ["3 tablet(s)", "0.8 tablet(s)", "1.5 tablet(s)", "2.5 tablet(s)"],
            "correct_index": 2,
        },
        explanation="7.5 / 5 = 1.5 tablets.",
        difficulty_nominal="easy", review_status=ItemReviewStatus.DRAFT,
        extra_metadata={
            "source_id": "nx_t_dose", "topic_id": 5,
            "category_id": "pharm_parenteral",
            "section": "Pharmacological & Parenteral Therapies",
            "subtopic": "Tablets & capsules",
            "verification": "calc-verified",
            "calc": {"kind": "tablets",
                     "params": {"ordered_mg": 7.5, "strength_mg": 5},
                     "expected": 1.5, "unit": "tablet(s)", "round": 1},
        },
    )
    sata = Item(
        bank_id=bank.id, family_id=uuid4(), kind=ItemKind.MCQ_MULTI,
        content={
            "stem": "Which findings require immediate follow-up? Select all that apply.",
            "options": ["A", "B", "C", "D", "E"],
            "correct_indices": [0, 2, 4],
        },
        explanation="A, C and E are the urgent findings.",
        difficulty_nominal="medium", review_status=ItemReviewStatus.DRAFT,
        extra_metadata={
            "source_id": "nx_t_sata", "topic_id": 7,
            "category_id": "physio_adaptation",
            "section": "Physiological Adaptation",
            "subtopic": "Deterioration recognition",
            "verification": "unverified",
        },
    )
    flagged = Item(
        bank_id=bank.id, family_id=uuid4(), kind=ItemKind.MCQ_SINGLE,
        content={"stem": "FLAGGED - must never serve.",
                 "options": ["x", "y"], "correct_index": 0},
        difficulty_nominal="easy", review_status=ItemReviewStatus.FLAGGED,
        extra_metadata={
            "source_id": "nx_t_flagged", "topic_id": 0,
            "category_id": "mgmt_of_care", "section": "Management of Care",
            "subtopic": "Triage", "verification": "unverified",
        },
    )
    session.add_all([single, sata, flagged])
    await session.commit()
    return bank, single, sata, flagged


# -- serving ------------------------------------------------------------------

async def test_requires_auth(async_client: AsyncClient):
    r = await async_client.get(f"{API}/items")
    assert r.status_code == 401


async def test_503_when_bank_not_seeded(async_client, seeded_user):
    r = await async_client.get(f"{API}/items", headers=_auth_headers(seeded_user))
    assert r.status_code == 503


async def test_serving_carries_no_keys_or_explanations(
    async_client, async_session, seeded_user
):
    await _seed_bank(async_session)
    r = await async_client.get(
        f"{API}/items?count=40", headers=_auth_headers(seeded_user)
    )
    assert r.status_code == 200
    items = r.json()["items"]
    assert items, "expected items in the draw"
    for it in items:
        # Field-name check, not substring: prose may legally contain these words.
        for forbidden in ("correct", "correct_index", "correct_indices",
                          "correctAnswers", "explanation", "calc"):
            assert forbidden not in it, f"{forbidden} leaked in serving payload"
        assert it["kind"] in ("mcq_single", "mcq_multi")
        assert it["verification"] in ("calc-verified", "unverified")
        assert it["review_status"] == "draft"


async def test_flagged_items_never_serve(async_client, async_session, seeded_user):
    _, _, _, flagged = await _seed_bank(async_session)
    r = await async_client.get(
        f"{API}/items?count=40", headers=_auth_headers(seeded_user)
    )
    served_ids = {it["item_id"] for it in r.json()["items"]}
    assert str(flagged.id) not in served_ids


async def test_overview_counts_come_from_the_bank(
    async_client, async_session, seeded_user
):
    await _seed_bank(async_session)
    r = await async_client.get(f"{API}/overview", headers=_auth_headers(seeded_user))
    assert r.status_code == 200
    body = r.json()
    by_topic = {s["topic_id"]: s for s in body["sections"]}
    assert by_topic[5]["section"] == "Pharmacological & Parenteral Therapies"
    # The flagged item still counts in overview (it exists; it just can't
    # serve) - overview describes the bank, items describes the draw.
    assert by_topic[5]["items"] == 1
    assert body["disclaimer"]


# -- grading: single ----------------------------------------------------------

async def test_single_correct_and_wrong(async_client, async_session, seeded_user):
    _, single, _, _ = await _seed_bank(async_session)
    h = _auth_headers(seeded_user)

    r = await async_client.post(
        f"{API}/submit",
        json={"item_id": str(single.id), "choice_index": 2, "seconds": 30},
        headers=h,
    )
    assert r.status_code == 200
    body = r.json()
    assert body["is_correct"] is True
    assert body["correct_index"] == 2
    assert body["explanation"]  # appears ONLY here
    assert body["verification"] == "calc-verified"

    r = await async_client.post(
        f"{API}/submit",
        json={"item_id": str(single.id), "choice_index": 0},
        headers=h,
    )
    assert r.json()["is_correct"] is False
    assert r.json()["correct_index"] == 2


async def test_single_rejects_out_of_range_and_wrong_shape(
    async_client, async_session, seeded_user
):
    _, single, _, _ = await _seed_bank(async_session)
    h = _auth_headers(seeded_user)
    r = await async_client.post(
        f"{API}/submit", json={"item_id": str(single.id), "choice_index": 7},
        headers=h,
    )
    assert r.status_code == 422  # only 4 options
    r = await async_client.post(
        f"{API}/submit",
        json={"item_id": str(single.id), "choice_indices": [0, 1]},
        headers=h,
    )
    assert r.status_code == 422  # single item takes choice_index


# -- grading: SATA ------------------------------------------------------------

async def test_sata_exact_set_is_correct_any_order(
    async_client, async_session, seeded_user
):
    _, _, sata, _ = await _seed_bank(async_session)
    r = await async_client.post(
        f"{API}/submit",
        json={"item_id": str(sata.id), "choice_indices": [4, 0, 2]},
        headers=_auth_headers(seeded_user),
    )
    assert r.status_code == 200
    body = r.json()
    assert body["is_correct"] is True
    assert body["scoring"] == "all_or_nothing"
    assert body["correct_indices"] == [0, 2, 4]
    assert body["n_missed"] == 0 and body["n_incorrect_selected"] == 0


async def test_sata_partial_is_wrong_but_breakdown_is_honest(
    async_client, async_session, seeded_user
):
    _, _, sata, _ = await _seed_bank(async_session)
    r = await async_client.post(
        f"{API}/submit",
        json={"item_id": str(sata.id), "choice_indices": [0, 2]},
        headers=_auth_headers(seeded_user),
    )
    body = r.json()
    assert body["is_correct"] is False  # all-or-nothing
    assert body["n_correct_selected"] == 2
    assert body["n_missed"] == 1
    assert body["n_incorrect_selected"] == 0


async def test_sata_superset_is_wrong(async_client, async_session, seeded_user):
    _, _, sata, _ = await _seed_bank(async_session)
    r = await async_client.post(
        f"{API}/submit",
        json={"item_id": str(sata.id), "choice_indices": [0, 1, 2, 4]},
        headers=_auth_headers(seeded_user),
    )
    body = r.json()
    assert body["is_correct"] is False
    assert body["n_incorrect_selected"] == 1


async def test_sata_rejects_wrong_shape_and_bad_indices(
    async_client, async_session, seeded_user
):
    _, _, sata, _ = await _seed_bank(async_session)
    h = _auth_headers(seeded_user)
    for payload in (
        {"item_id": str(sata.id), "choice_index": 0},        # single shape on SATA
        {"item_id": str(sata.id), "choice_indices": []},      # empty set
        {"item_id": str(sata.id), "choice_indices": [0, 9]},  # out of range
    ):
        r = await async_client.post(f"{API}/submit", json=payload, headers=h)
        assert r.status_code == 422, payload


# -- logging ------------------------------------------------------------------

async def test_attempts_are_logged_with_sata_choices_in_metadata(
    async_client, async_session, seeded_user
):
    _, single, sata, _ = await _seed_bank(async_session)
    h = _auth_headers(seeded_user)
    await async_client.post(
        f"{API}/submit",
        json={"item_id": str(single.id), "choice_index": 2, "seconds": 20},
        headers=h,
    )
    await async_client.post(
        f"{API}/submit",
        json={"item_id": str(sata.id), "choice_indices": [0, 2], "seconds": 40},
        headers=h,
    )
    logs = (
        (
            await async_session.execute(
                select(AttemptLog).where(AttemptLog.source == "nclex_qbank")
            )
        )
        .scalars()
        .all()
    )
    assert len(logs) == 2
    by_item = {log.item_id: log for log in logs}
    assert by_item[single.id].answer_index == 2
    assert by_item[single.id].is_correct is True
    assert by_item[sata.id].answer_index is None
    assert by_item[sata.id].extra_metadata["choice_indices"] == [0, 2]
    assert by_item[sata.id].is_correct is False

    await async_session.refresh(single)
    assert single.attempts_count == 1


async def test_unknown_item_404(async_client, async_session, seeded_user):
    await _seed_bank(async_session)
    r = await async_client.post(
        f"{API}/submit",
        json={"item_id": str(uuid4()), "choice_index": 0},
        headers=_auth_headers(seeded_user),
    )
    assert r.status_code == 404


# -- review center (NX-9) -----------------------------------------------------

async def test_review_summary_aggregates_recorded_responses(
    async_client, async_session, seeded_user
):
    _, single, sata, _ = await _seed_bank(async_session)
    h = _auth_headers(seeded_user)
    # one correct single, one wrong SATA
    await async_client.post(
        f"{API}/submit", json={"item_id": str(single.id), "choice_index": 2}, headers=h
    )
    await async_client.post(
        f"{API}/submit", json={"item_id": str(sata.id), "choice_indices": [0]}, headers=h
    )
    r = await async_client.get("/api/v1/nclex/review/summary", headers=h)
    assert r.status_code == 200
    body = r.json()
    sections = {s["section"]: s for s in body["by_section"]}
    assert sections["Pharmacological & Parenteral Therapies"]["correct"] == 1
    assert sections["Physiological Adaptation"]["attempts"] == 1
    assert sections["Physiological Adaptation"]["correct"] == 0
    # worst subtopic first
    assert body["weakest_subtopics"][0]["subtopic"] == "Deterioration recognition"
    assert "percentile" not in str(body).lower() or "No percentile" in body["note"]


async def test_review_missed_lists_latest_wrong_with_sata_choices(
    async_client, async_session, seeded_user
):
    _, single, sata, _ = await _seed_bank(async_session)
    h = _auth_headers(seeded_user)
    await async_client.post(
        f"{API}/submit", json={"item_id": str(sata.id), "choice_indices": [0, 1]}, headers=h
    )
    r = await async_client.get("/api/v1/nclex/review/missed", headers=h)
    assert r.status_code == 200
    missed = r.json()["missed"]
    assert len(missed) == 1
    entry = missed[0]
    assert entry["kind"] == "mcq_multi"
    assert entry["correct_indices"] == [0, 2, 4]
    assert entry["chosen_indices"] == [0, 1]
    assert entry["explanation"]  # review is where explanations belong


async def test_review_missed_drops_item_after_correct_answer(
    async_client, async_session, seeded_user
):
    _, single, _, _ = await _seed_bank(async_session)
    h = _auth_headers(seeded_user)
    await async_client.post(
        f"{API}/submit", json={"item_id": str(single.id), "choice_index": 0}, headers=h
    )
    r = await async_client.get("/api/v1/nclex/review/missed", headers=h)
    assert len(r.json()["missed"]) == 1
    # now answer it correctly - latest response wins
    await async_client.post(
        f"{API}/submit", json={"item_id": str(single.id), "choice_index": 2}, headers=h
    )
    r = await async_client.get("/api/v1/nclex/review/missed", headers=h)
    assert r.json()["missed"] == []
