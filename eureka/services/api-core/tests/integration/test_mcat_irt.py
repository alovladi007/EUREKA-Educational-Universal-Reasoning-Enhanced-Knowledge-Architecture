"""Integration tests for /mcat/irt/* (C6).

The threshold is the product: an item is calibratable at >= 300 responses
from >= 100 distinct learners, BOTH, and nothing is estimated or displayed
below it. These tests hold the endpoints to that - including the case that
matters most today, where the honest answer is zero.
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

_sqlite3.register_adapter(list, _json.dumps)

from main import app  # noqa: E402
from app.api.v1.endpoints.mcat_irt import (  # noqa: E402
    MIN_DISTINCT_LEARNERS, MIN_RESPONSES,
)


pytestmark = [pytest.mark.integration, pytest.mark.asyncio]

API = "/api/v1/mcat/irt"


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


async def _user(session: AsyncSession, role: str, slug: str) -> User:
    org = Organization(
        id=uuid4(), name=f"Org {slug}", slug=f"test-irt-{slug}",
        tier="professional_law", country="US", settings={}, tier_config={},
        is_active=True,
    )
    user = User(
        id=uuid4(), email=f"irt-{slug}@example.com", first_name="Irt",
        last_name=role, hashed_password=hash_password("not-used"),
        org_id=org.id, role=role, is_active=True, is_email_verified=True,
    )
    session.add_all([org, user])
    await session.commit()
    await session.refresh(user)
    return user


async def _bank_with_item(session: AsyncSession) -> Item:
    bank = ItemBank(
        slug="mcat-qbank-v1", name="MCAT QBank (test)",
        framework=SkillFramework.MCAT, tier="test_prep",
        default_license="proprietary",
    )
    session.add(bank)
    await session.flush()
    item = Item(
        bank_id=bank.id, family_id=uuid4(), kind=ItemKind.MCQ_SINGLE,
        content={"stem": "Q?", "options": ["a", "b"], "correct_index": 0},
        review_status=ItemReviewStatus.DRAFT,
        extra_metadata={"topic_id": 0, "section": "Chemical and Physical Foundations"},
    )
    session.add(item)
    await session.commit()
    return item


async def test_status_reports_zero_honestly(async_client, async_session):
    item = await _bank_with_item(async_session)
    student = await _user(async_session, "student", "student")
    # A handful of responses from one learner: nowhere near either floor.
    for _ in range(12):
        async_session.add(
            AttemptLog(
                user_id=student.id, item_id=item.id, answer_index=0,
                is_correct=True, source="mcat_qbank",
            )
        )
    await async_session.commit()

    res = await async_client.get(f"{API}/status", headers=_auth_headers(student))
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["threshold"]["min_responses_per_item"] == MIN_RESPONSES
    assert body["threshold"]["min_distinct_learners_per_item"] == MIN_DISTINCT_LEARNERS
    assert body["bank"]["responses_logged"] == 12
    assert body["bank"]["most_answered_item"] == {
        "responses": 12, "distinct_learners": 1,
    }
    assert body["eligible_items"] == 0
    assert body["calibrated_items"] == 0
    assert body["ready_to_calibrate"] is False
    assert body["difficulty_shown"] == "nominal (author-assigned)"


async def test_volume_alone_does_not_clear_the_threshold(
    async_client, async_session
):
    """MIN_RESPONSES answers from ONE learner is not MIN_RESPONSES
    observations - the distinct-learner floor is the point."""
    item = await _bank_with_item(async_session)
    student = await _user(async_session, "student", "grinder")
    for _ in range(MIN_RESPONSES + 20):
        async_session.add(
            AttemptLog(
                user_id=student.id, item_id=item.id, answer_index=0,
                is_correct=True, source="mcat_qbank",
            )
        )
    await async_session.commit()

    body = (
        await async_client.get(f"{API}/status", headers=_auth_headers(student))
    ).json()
    assert body["bank"]["most_answered_item"]["responses"] >= MIN_RESPONSES
    assert body["eligible_items"] == 0  # one learner: not eligible
    assert body["ready_to_calibrate"] is False


async def test_calibrate_is_admin_only_and_refuses_below_threshold(
    async_client, async_session
):
    await _bank_with_item(async_session)
    student = await _user(async_session, "student", "s2")
    admin = await _user(async_session, "super_admin", "admin")

    denied = await async_client.post(
        f"{API}/calibrate", headers=_auth_headers(student)
    )
    assert denied.status_code == 403

    refused = await async_client.post(
        f"{API}/calibrate", headers=_auth_headers(admin)
    )
    assert refused.status_code == 409
    detail = refused.json()["detail"]
    assert "nothing was estimated" in detail["message"]
    assert detail["threshold"]["min_responses_per_item"] == MIN_RESPONSES
