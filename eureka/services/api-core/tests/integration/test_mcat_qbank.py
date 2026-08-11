"""Integration tests for /mcat/qbank/* (C1 step 2 - AUDIT MC-1/MC-4/MC-5).

What this router owes:
  - Serving never carries the key or the explanation - those exist only in
    the grading response, after an answer is in.
  - Grading is server-side against the bank row; every graded response
    becomes an attempt_logs row and bumps the item's attempts_count.
  - Review honesty travels: items say review_status, responses carry the
    AI-generated disclaimer.

Fixtures mirror tests/integration/test_mcat_chemistry.py.
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
# (Read-back stays a string; these tests never read tags.)
_sqlite3.register_adapter(list, _json.dumps)

from main import app  # noqa: E402


pytestmark = [pytest.mark.integration, pytest.mark.asyncio]

API = "/api/v1/mcat/qbank"


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
        id=uuid4(), name="Test Org", slug="test-mcat-qbank",
        tier="professional_law", country="US", settings={}, tier_config={},
        is_active=True,
    )
    user = User(
        id=uuid4(), email="mcat-qbank-test@example.com", first_name="Qbank",
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


async def _seed_bank(session: AsyncSession) -> tuple[ItemBank, Item, Item]:
    bank = ItemBank(
        slug="mcat-qbank-v1", name="MCAT QBank (test)",
        framework=SkillFramework.MCAT, tier="test_prep",
        default_license="proprietary",
    )
    session.add(bank)
    await session.flush()
    a = Item(
        bank_id=bank.id, family_id=uuid4(), kind=ItemKind.MCQ_SINGLE,
        content={"stem": "What quantum number sets orbital shape?",
                 "options": ["l", "ml", "ms", "n"], "correct_index": 0},
        explanation="The angular momentum quantum number l sets the shape.",
        difficulty_nominal="easy", review_status=ItemReviewStatus.DRAFT,
        extra_metadata={"source_id": "mcat_t0_001", "topic_id": 0,
                        "section": "Chemical and Physical Foundations",
                        "subtopic": "Gen Chem - Atomic Structure"},
    )
    b = Item(
        bank_id=bank.id, family_id=uuid4(), kind=ItemKind.MCQ_SINGLE,
        content={"stem": "Which reinforcement schedule resists extinction most?",
                 "options": ["Fixed ratio", "Variable ratio", "Fixed interval"],
                 "correct_index": 1},
        explanation="Variable-ratio schedules are most resistant to extinction.",
        difficulty_nominal="medium", review_status=ItemReviewStatus.DRAFT,
        extra_metadata={"source_id": "mcat_t2_001", "topic_id": 2,
                        "section": "Psychological, Social, and Biological Foundations",
                        "subtopic": "Psych - Learning"},
    )
    session.add_all([a, b])
    await session.commit()
    return bank, a, b


def _walk_keys(payload):
    if isinstance(payload, dict):
        for k, v in payload.items():
            yield k
            yield from _walk_keys(v)
    elif isinstance(payload, list):
        for v in payload:
            yield from _walk_keys(v)


async def test_requires_auth(async_client, async_session):
    await _seed_bank(async_session)
    res = await async_client.get(f"{API}/items?count=2")
    assert res.status_code in (401, 403)


async def test_unseeded_bank_says_so(async_client, seeded_user):
    res = await async_client.get(
        f"{API}/items?count=2", headers=_auth_headers(seeded_user)
    )
    assert res.status_code == 503


async def test_serving_carries_no_key_and_discloses_review(
    async_client, async_session, seeded_user
):
    await _seed_bank(async_session)
    res = await async_client.get(
        f"{API}/items?count=10", headers=_auth_headers(seeded_user)
    )
    assert res.status_code == 200, res.text
    body = res.json()
    assert len(body["items"]) == 2
    leaked = {"correct", "correct_index", "explanation", "answer"} & set(
        _walk_keys(body)
    )
    assert not leaked, f"serve payload leaked: {leaked}"
    for item in body["items"]:
        assert item["review_status"] == "draft"
        assert item["option_count"] == len(item["options"])
    assert "AI-generated" in body["disclaimer"]


async def test_topic_filter(async_client, async_session, seeded_user):
    await _seed_bank(async_session)
    res = await async_client.get(
        f"{API}/items?topic_id=2&count=10", headers=_auth_headers(seeded_user)
    )
    assert res.status_code == 200
    items = res.json()["items"]
    assert len(items) == 1
    assert items[0]["section"].startswith("Psychological")


async def test_overview_counts_come_from_the_bank(
    async_client, async_session, seeded_user
):
    await _seed_bank(async_session)
    res = await async_client.get(
        f"{API}/overview", headers=_auth_headers(seeded_user)
    )
    assert res.status_code == 200
    sections = {s["topic_id"]: s for s in res.json()["sections"]}
    assert sections[0]["items"] == 1
    assert sections[2]["items"] == 1


async def test_submit_grades_logs_and_reveals_after(
    async_client, async_session, seeded_user
):
    _, item_a, _ = await _seed_bank(async_session)
    hdrs = _auth_headers(seeded_user)

    wrong = await async_client.post(
        f"{API}/submit",
        json={"item_id": str(item_a.id), "choice_index": 3, "seconds": 20},
        headers=hdrs,
    )
    assert wrong.status_code == 200, wrong.text
    wb = wrong.json()
    assert wb["is_correct"] is False
    assert wb["correct_index"] == 0
    assert "angular momentum" in wb["explanation"]

    right = await async_client.post(
        f"{API}/submit",
        json={"item_id": str(item_a.id), "choice_index": 0},
        headers=hdrs,
    )
    assert right.json()["is_correct"] is True

    logs = (
        (await async_session.execute(select(AttemptLog))).scalars().all()
    )
    assert len(logs) == 2
    assert {l.is_correct for l in logs} == {True, False}
    assert logs[0].source == "mcat_qbank"
    assert logs[0].user_id == seeded_user.id

    await async_session.refresh(item_a)
    assert item_a.attempts_count == 2


async def test_submit_refuses_bad_input(async_client, async_session, seeded_user):
    _, item_a, _ = await _seed_bank(async_session)
    hdrs = _auth_headers(seeded_user)
    out_of_range = await async_client.post(
        f"{API}/submit",
        json={"item_id": str(item_a.id), "choice_index": 4},
        headers=hdrs,
    )
    assert out_of_range.status_code == 422
    unknown = await async_client.post(
        f"{API}/submit",
        json={"item_id": str(uuid4()), "choice_index": 0},
        headers=hdrs,
    )
    assert unknown.status_code == 404
