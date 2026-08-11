"""Integration tests for /mcat/chemistry/* (Phase B: OCTET-powered MCAT).

The chemistry engine itself (generation, verification, grading) lives in the
OCTET vertical and has its own suite; here the OCTET calls are faked so
these tests pin down what THIS service owes:

  - The entitlement gate is server-side: no entitlement -> 402; either an
    MCAT or a standalone OCTET entitlement serves.
  - The AAMC category on an attempt row is derived from the graded item's
    node via the mapping table, never accepted from the client - a client
    cannot mislabel attempts to skew its analytics. Unmapped nodes are
    recorded as 'unmapped', not guessed into a category.
  - Repeat sessions advance the learner's variant offset (their recorded
    attempt count), so the engine is asked for fresh variants.
  - A category with no mapped content returns an empty list and says so;
    the engine is not even called.
  - The weakness readout aggregates only this account's recorded attempts
    and never invents cohort statistics: no percentile, no predicted or
    scaled score, no difficulty claims.
  - The categories view annotates per-node/per-category servability from
    the engine's own honest report.

Local async fixtures mirror tests/integration/test_patent_bar_endpoints.py.
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
from app.models.billing import Entitlement
from app.models.mcat_octet import McatChemAttempt, OctetMcatMap
from app.models.organization import Organization
from app.models.user import User
from app.utils.auth import create_access_token, hash_password

from tests.integration._sqlite_compat import install_all as _install_sqlite_compat

_install_sqlite_compat(Base)

from main import app  # noqa: E402

import app.api.v1.endpoints.mcat_chemistry as mcat_mod  # noqa: E402


pytestmark = [pytest.mark.integration, pytest.mark.asyncio]

API = "/api/v1/mcat/chemistry"


# -- Fixtures ---------------------------------------------------------------


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
        id=uuid4(),
        name="Test Org",
        slug="test-mcat-chem",
        tier="professional_law",
        country="US",
        settings={},
        tier_config={},
        is_active=True,
    )
    user = User(
        id=uuid4(),
        email="mcat-chem-test@example.com",
        first_name="Mcat",
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
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            yield client
    finally:
        app.dependency_overrides.pop(get_db, None)


@pytest.fixture
def fake_octet(monkeypatch):
    """Stand in for the OCTET engine; records what it was asked."""
    calls = {"items": [], "submit": [], "eligible": 0}

    async def fake_post(path: str, token: str, payload: dict) -> dict:
        if path.endswith("/mcat/items"):
            calls["items"].append(payload)
            return {
                "items": [
                    {
                        "template_id": "imf.rank.v1",
                        "seed": 42,
                        "node": "GEN1.IMF",
                        "prompt": "Which sample has the strongest IMFs?",
                        "options": [
                            {"position": 0, "text": "A"},
                            {"position": 1, "text": "B"},
                            {"position": 2, "text": "C"},
                        ],
                        "option_count": 3,
                        "verified_by": "independent verifier at resolve time",
                    }
                ],
                "unservable_nodes": [],
            }
        if path.endswith("/mcat/submit"):
            calls["submit"].append(payload)
            return {
                "is_correct": False,
                "correct_position": 1,
                "correct_text": "B",
                "chosen_position": payload["choice_index"],
                "node": "GEN1.IMF",
                "misconception": "IMF-STRONGER-MEANS-COVALENT",
                "rationale": {"review_node": "GEN1.IMF"},
                "detail": {},
            }
        raise AssertionError(f"unexpected OCTET call: {path}")

    async def fake_get(path: str, token: str) -> dict:
        calls["eligible"] += 1
        return {"nodes": {"GEN1.IMF": 2}, "total_templates": 2}

    monkeypatch.setattr(mcat_mod, "_octet_post", fake_post)
    monkeypatch.setattr(mcat_mod, "_octet_get", fake_get)
    return calls


async def _grant(session: AsyncSession, user: User, exam_code: str) -> None:
    session.add(
        Entitlement(
            user_id=user.id,
            exam_code=exam_code,
            sku="test-grant",
            status="active",
            source="comp",
        )
    )
    await session.commit()


async def _map_node(session: AsyncSession, node: str, title: str, cat: str) -> None:
    session.add(
        OctetMcatMap(
            octet_node=node,
            octet_node_title=title,
            mcat_category=cat,
            foundational_concept="FC" + cat[0],
            rationale="test mapping row",
        )
    )
    await session.commit()


def _walk_keys(payload):
    if isinstance(payload, dict):
        for k, v in payload.items():
            yield k
            yield from _walk_keys(v)
    elif isinstance(payload, list):
        for v in payload:
            yield from _walk_keys(v)


# -- The entitlement gate ---------------------------------------------------


async def test_items_without_entitlement_402(async_client, seeded_user, fake_octet):
    res = await async_client.post(
        f"{API}/items",
        json={"category": "5B", "count": 3},
        headers=_auth_headers(seeded_user),
    )
    assert res.status_code == 402
    assert res.json()["detail"]["exam_code"] == "MCAT"
    assert fake_octet["items"] == []  # the engine was never consulted


async def test_mcat_entitlement_serves(
    async_client, async_session, seeded_user, fake_octet
):
    await _grant(async_session, seeded_user, "MCAT")
    await _map_node(async_session, "GEN1.IMF", "Intermolecular forces", "5B")
    res = await async_client.post(
        f"{API}/items",
        json={"category": "5B", "count": 3},
        headers=_auth_headers(seeded_user),
    )
    assert res.status_code == 200, res.text
    assert res.json()["category"] == "5B"
    assert len(res.json()["items"]) == 1
    assert fake_octet["items"][0]["nodes"] == ["GEN1.IMF"]


async def test_standalone_octet_entitlement_also_serves(
    async_client, async_session, seeded_user, fake_octet
):
    await _grant(async_session, seeded_user, "OCTET")
    await _map_node(async_session, "GEN1.IMF", "Intermolecular forces", "5B")
    res = await async_client.post(
        f"{API}/items",
        json={"category": "5B", "count": 3},
        headers=_auth_headers(seeded_user),
    )
    assert res.status_code == 200, res.text


# -- Honest emptiness and input validation ----------------------------------


async def test_unmapped_category_returns_empty_and_says_so(
    async_client, async_session, seeded_user, fake_octet
):
    await _grant(async_session, seeded_user, "MCAT")
    res = await async_client.post(
        f"{API}/items",
        json={"category": "5C", "count": 3},
        headers=_auth_headers(seeded_user),
    )
    assert res.status_code == 200
    assert res.json()["items"] == []
    assert "5C" in res.json()["note"]
    assert fake_octet["items"] == []  # no padding call behind the scenes


async def test_unknown_category_422(
    async_client, async_session, seeded_user, fake_octet
):
    await _grant(async_session, seeded_user, "MCAT")
    res = await async_client.post(
        f"{API}/items",
        json={"category": "9Z", "count": 3},
        headers=_auth_headers(seeded_user),
    )
    assert res.status_code == 422


# -- Attempt recording: server-derived category -----------------------------


async def test_submit_derives_category_from_mapping(
    async_client, async_session, seeded_user, fake_octet
):
    await _grant(async_session, seeded_user, "MCAT")
    await _map_node(async_session, "GEN1.IMF", "Intermolecular forces", "5B")
    res = await async_client.post(
        f"{API}/submit",
        json={"template_id": "imf.rank.v1", "seed": 42, "choice_index": 0,
              "seconds": 30},
        headers=_auth_headers(seeded_user),
    )
    assert res.status_code == 200, res.text
    assert res.json()["mcat_category"] == "5B"

    row = (
        await async_session.execute(select(McatChemAttempt))
    ).scalar_one()
    assert row.user_id == seeded_user.id
    assert row.octet_node == "GEN1.IMF"
    assert row.mcat_category == "5B"  # derived, not client-supplied
    assert row.is_correct is False
    assert row.misconception == "IMF-STRONGER-MEANS-COVALENT"
    assert row.seconds == 30


async def test_submit_ignores_any_client_category_claim(
    async_client, async_session, seeded_user, fake_octet
):
    """A client that still sends a category cannot make it stick."""
    await _grant(async_session, seeded_user, "MCAT")
    await _map_node(async_session, "GEN1.IMF", "Intermolecular forces", "5B")
    res = await async_client.post(
        f"{API}/submit",
        json={"template_id": "imf.rank.v1", "seed": 42, "choice_index": 0,
              "seconds": 5, "category": "5E"},
        headers=_auth_headers(seeded_user),
    )
    assert res.status_code == 200
    assert res.json()["mcat_category"] == "5B"
    row = (await async_session.execute(select(McatChemAttempt))).scalar_one()
    assert row.mcat_category == "5B"


async def test_submit_unmapped_node_recorded_as_unmapped(
    async_client, async_session, seeded_user, fake_octet
):
    await _grant(async_session, seeded_user, "MCAT")
    # No mapping rows at all: the node the engine grades is unmapped.
    res = await async_client.post(
        f"{API}/submit",
        json={"template_id": "imf.rank.v1", "seed": 42, "choice_index": 0},
        headers=_auth_headers(seeded_user),
    )
    assert res.status_code == 200
    assert res.json()["mcat_category"] == "unmapped"
    row = (await async_session.execute(select(McatChemAttempt))).scalar_one()
    assert row.mcat_category == "unmapped"


# -- Repeat sessions advance the variant offset -----------------------------


async def test_offset_advances_with_recorded_attempts(
    async_client, async_session, seeded_user, fake_octet
):
    await _grant(async_session, seeded_user, "MCAT")
    await _map_node(async_session, "GEN1.IMF", "Intermolecular forces", "5B")
    hdrs = _auth_headers(seeded_user)

    await async_client.post(
        f"{API}/items", json={"category": "5B", "count": 1}, headers=hdrs
    )
    assert fake_octet["items"][0]["offset"] == 0

    await async_client.post(
        f"{API}/submit",
        json={"template_id": "imf.rank.v1", "seed": 42, "choice_index": 0},
        headers=hdrs,
    )
    await async_client.post(
        f"{API}/items", json={"category": "5B", "count": 1}, headers=hdrs
    )
    assert fake_octet["items"][1]["offset"] == 1


# -- Weakness: own attempts only, nothing invented --------------------------


async def test_weakness_aggregates_own_attempts_and_invents_nothing(
    async_client, async_session, seeded_user, fake_octet
):
    await _grant(async_session, seeded_user, "MCAT")
    await _map_node(async_session, "GEN1.IMF", "Intermolecular forces", "5B")
    hdrs = _auth_headers(seeded_user)
    for _ in range(2):
        await async_client.post(
            f"{API}/submit",
            json={"template_id": "imf.rank.v1", "seed": 42, "choice_index": 0},
            headers=hdrs,
        )

    res = await async_client.get(f"{API}/weakness", headers=hdrs)
    assert res.status_code == 200
    body = res.json()
    cats = body["categories"]
    assert len(cats) == 1
    assert cats[0]["category"] == "5B"
    assert cats[0]["attempts"] == 2
    assert cats[0]["correct"] == 0
    assert cats[0]["accuracy"] == 0.0
    assert any(n["octet_node"] == "GEN1.IMF" for n in cats[0]["review_nodes"])

    forbidden = {
        "percentile", "predicted_score", "scaled_score", "difficulty",
        "cohort", "probability",
    }
    leaked = forbidden & set(_walk_keys(body))
    assert not leaked, f"weakness invented statistics: {leaked}"


async def test_weakness_is_scoped_to_the_caller(
    async_client, async_session, seeded_user, fake_octet
):
    await _grant(async_session, seeded_user, "MCAT")
    await _map_node(async_session, "GEN1.IMF", "Intermolecular forces", "5B")
    await async_client.post(
        f"{API}/submit",
        json={"template_id": "imf.rank.v1", "seed": 42, "choice_index": 0},
        headers=_auth_headers(seeded_user),
    )

    org = Organization(
        id=uuid4(), name="Org B", slug="test-mcat-chem-b",
        tier="professional_law", country="US", settings={}, tier_config={},
        is_active=True,
    )
    other = User(
        id=uuid4(), email="mcat-chem-other@example.com", first_name="Other",
        last_name="Tester", hashed_password=hash_password("not-used"),
        org_id=org.id, role="student", is_active=True, is_email_verified=True,
    )
    async_session.add_all([org, other])
    await async_session.commit()

    res = await async_client.get(f"{API}/weakness", headers=_auth_headers(other))
    assert res.status_code == 200
    assert res.json()["categories"] == []


# -- Categories: mapping + servability annotation ---------------------------


async def test_categories_annotate_servability(
    async_client, async_session, seeded_user, fake_octet
):
    await _map_node(async_session, "GEN1.IMF", "Intermolecular forces", "5B")
    await _map_node(async_session, "GEN1.MOLE", "The mole", "4E")
    res = await async_client.get(
        f"{API}/categories", headers=_auth_headers(seeded_user)
    )
    assert res.status_code == 200
    body = res.json()

    by_node = {n["octet_node"]: n for n in body["categories"]["5B"]}
    assert by_node["GEN1.IMF"]["servable"] is True
    by_node_4e = {n["octet_node"]: n for n in body["categories"]["4E"]}
    assert by_node_4e["GEN1.MOLE"]["servable"] is False

    assert body["summary"]["5B"] == {"mapped_nodes": 1, "servable_nodes": 1}
    assert body["summary"]["4E"] == {"mapped_nodes": 1, "servable_nodes": 0}
    # 5C stays honestly empty.
    assert body["summary"]["5C"] == {"mapped_nodes": 0, "servable_nodes": 0}
    assert "review" in body["note"]
