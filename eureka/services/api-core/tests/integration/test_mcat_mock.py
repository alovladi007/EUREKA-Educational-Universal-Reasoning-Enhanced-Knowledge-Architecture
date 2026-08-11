"""Integration tests for /mcat/mock/* (C3 - AUDIT MC-2/MC-9).

What the simulator owes:
  - The server draws the form per section and never pads a short pool.
  - No keys or explanations at start; they appear only in the results.
  - Grading is server-side; unanswered positions count against the raw
    score and are reported as unanswered; every answered response lands in
    attempt_logs with the attempt id.
  - Raw and per-section ONLY: theta, scaled_score and pass_probability stay
    NULL - there is no equating data, so nothing is scaled or predicted.

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
from app.models.exam import AttemptLog, MockAttempt
from app.models.item_bank import Item, ItemBank, ItemKind, ItemReviewStatus
from app.models.organization import Organization
from app.models.skill import SkillFramework
from app.models.user import User
from app.utils.auth import create_access_token, hash_password

from tests.integration._sqlite_compat import install_all as _install_sqlite_compat

_install_sqlite_compat(Base)

import json as _json  # noqa: E402
import sqlite3 as _sqlite3  # noqa: E402

_sqlite3.register_adapter(list, _json.dumps)

from main import app  # noqa: E402


pytestmark = [pytest.mark.integration, pytest.mark.asyncio]

API = "/api/v1/mcat/mock"


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
        id=uuid4(), name="Test Org", slug="test-mcat-mock",
        tier="professional_law", country="US", settings={}, tier_config={},
        is_active=True,
    )
    user = User(
        id=uuid4(), email="mcat-mock-test@example.com", first_name="Mock",
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


SECTIONS = {
    0: "Chemical and Physical Foundations",
    1: "Critical Analysis and Reasoning Skills",
    2: "Biological and Biochemical Foundations",
    3: "Psychological, Social, and Biological Foundations",
}


async def _seed_bank(session: AsyncSession, per_section: int = 4) -> ItemBank:
    bank = ItemBank(
        slug="mcat-qbank-v1", name="MCAT QBank (test)",
        framework=SkillFramework.MCAT, tier="test_prep",
        default_license="proprietary",
    )
    session.add(bank)
    await session.flush()
    for topic_id, section in SECTIONS.items():
        for n in range(per_section):
            session.add(
                Item(
                    bank_id=bank.id, family_id=uuid4(), kind=ItemKind.MCQ_SINGLE,
                    content={"stem": f"T{topic_id} Q{n}?",
                             "options": ["a", "b", "c", "d"],
                             "correct_index": n % 4},
                    explanation=f"Because option {n % 4}.",
                    review_status=ItemReviewStatus.DRAFT,
                    extra_metadata={"source_id": f"t{topic_id}_q{n}",
                                    "topic_id": topic_id, "section": section,
                                    "subtopic": f"sub{topic_id}"},
                )
            )
    await session.commit()
    return bank


def _walk_keys(payload):
    if isinstance(payload, dict):
        for k, v in payload.items():
            yield k
            yield from _walk_keys(v)
    elif isinstance(payload, list):
        for v in payload:
            yield from _walk_keys(v)


async def test_start_draws_per_section_and_leaks_nothing(
    async_client, async_session, seeded_user
):
    await _seed_bank(async_session)
    res = await async_client.post(
        f"{API}/start", json={"form": "mini"}, headers=_auth_headers(seeded_user)
    )
    assert res.status_code == 200, res.text
    body = res.json()
    assert len(body["items"]) == 16
    per = {}
    for i in body["items"]:
        per[i["topic_id"]] = per.get(i["topic_id"], 0) + 1
    assert per == {0: 4, 1: 4, 2: 4, 3: 4}
    leaked = {"correct", "correct_index", "explanation"} & set(_walk_keys(body))
    assert not leaked, f"start payload leaked: {leaked}"
    assert "equating data" in body["note"]


async def test_short_pool_refuses_rather_than_pads(
    async_client, async_session, seeded_user
):
    await _seed_bank(async_session, per_section=2)  # mini needs 4 per section
    res = await async_client.post(
        f"{API}/start", json={"form": "mini"}, headers=_auth_headers(seeded_user)
    )
    assert res.status_code == 503
    assert "not padded" in res.json()["detail"]


async def test_submit_grades_and_stays_unscaled(
    async_client, async_session, seeded_user
):
    await _seed_bank(async_session)
    hdrs = _auth_headers(seeded_user)
    start = (
        await async_client.post(f"{API}/start", json={"form": "mini"}, headers=hdrs)
    ).json()

    # Answer 0 everywhere except the last position, left blank.
    answers = [
        {"position": i["position"], "choice_index": 0}
        for i in start["items"][:-1]
    ] + [{"position": start["items"][-1]["position"], "choice_index": None}]
    res = await async_client.post(
        f"{API}/{start['attempt_id']}/submit",
        json={"answers": answers},
        headers=hdrs,
    )
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["raw"]["total"] == 16
    assert body["raw"]["answered"] == 15
    # Sections report totals and answered separately.
    assert sum(s["total"] for s in body["by_section"].values()) == 16
    # Review reveals keys and explanations only now.
    assert all("correct_index" in r for r in body["review"])
    assert any(r["explanation"] for r in body["review"])
    # Nothing scaled, nothing predicted.
    attempt = (
        await async_session.execute(select(MockAttempt))
    ).scalar_one()
    assert attempt.theta is None
    assert attempt.scaled_score is None
    assert attempt.pass_probability is None
    assert attempt.correct_count == body["raw"]["correct"]
    logs = (
        (
            await async_session.execute(
                select(AttemptLog).where(AttemptLog.source == "mcat_mock")
            )
        )
        .scalars()
        .all()
    )
    assert len(logs) == 15  # unanswered position writes no response row

    resubmit = await async_client.post(
        f"{API}/{start['attempt_id']}/submit",
        json={"answers": answers},
        headers=hdrs,
    )
    assert resubmit.status_code == 409

    history = (await async_client.get(f"{API}/history", headers=hdrs)).json()
    assert history["attempts"][0]["status"] == "submitted"
    assert history["attempts"][0]["total"] == 16


async def test_attempts_are_owner_scoped(
    async_client, async_session, seeded_user
):
    await _seed_bank(async_session)
    hdrs = _auth_headers(seeded_user)
    start = (
        await async_client.post(f"{API}/start", json={"form": "mini"}, headers=hdrs)
    ).json()

    org = Organization(
        id=uuid4(), name="Org B", slug="test-mcat-mock-b",
        tier="professional_law", country="US", settings={}, tier_config={},
        is_active=True,
    )
    other = User(
        id=uuid4(), email="mcat-mock-other@example.com", first_name="Other",
        last_name="Tester", hashed_password=hash_password("not-used"),
        org_id=org.id, role="student", is_active=True, is_email_verified=True,
    )
    async_session.add_all([org, other])
    await async_session.commit()

    res = await async_client.post(
        f"{API}/{start['attempt_id']}/submit",
        json={"answers": []},
        headers=_auth_headers(other),
    )
    assert res.status_code == 404
