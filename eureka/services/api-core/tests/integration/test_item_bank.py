"""
Integration tests for the item bank (Phase 5 Sessions 5.1 + 5.2 + 5.7).
"""

from __future__ import annotations

import os
import uuid

import httpx
import psycopg2
import pytest
from passlib.context import CryptContext


API_BASE = os.environ.get("API_CORE_URL", "http://localhost:8000")
PG_DSN = os.environ.get("PG_DSN", "postgresql://eureka:eureka_dev_password@localhost:5434/eureka")
PWD = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")


def _conn():
    return psycopg2.connect(PG_DSN)


@pytest.fixture(scope="module")
def author():
    suffix = uuid.uuid4().hex[:8]
    email = f"author-{suffix}@example.com"
    pw = "AuthorTest123!"
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO users (id, org_id, email, hashed_password,
                               first_name, last_name, role,
                               is_active, is_email_verified)
            VALUES (uuid_generate_v4(),
                    '550e8400-e29b-41d4-a716-446655440000',
                    %s, %s, 'Author', 'Test', 'teacher', TRUE, TRUE)
            RETURNING id
            """,
            (email, PWD.hash(pw)),
        )
        user_id = str(cur.fetchone()[0])
    tok = httpx.post(
        f"{API_BASE}/api/v1/auth/login",
        json={"email": email, "password": pw},
        timeout=10,
    ).json()["access_token"]
    yield {"user_id": user_id, "token": tok}
    # Best-effort cleanup. Items the author created reference users.created_by
    # without ON DELETE SET NULL; null it out first so the user delete succeeds.
    with _conn() as c, c.cursor() as cur:
        cur.execute("UPDATE items SET created_by = NULL WHERE created_by = %s", (user_id,))
        cur.execute("UPDATE items SET reviewed_by = NULL WHERE reviewed_by = %s", (user_id,))
        try:
            cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
        except Exception:
            pass  # leave the row; another FK might still pin it


def _hdr(t):
    return {"Authorization": f"Bearer {t}"}


@pytest.mark.integration
def test_seeded_banks_present(author):
    r = httpx.get(f"{API_BASE}/api/v1/item-banks", headers=_hdr(author["token"]), timeout=10)
    assert r.status_code == 200
    slugs = {b["slug"] for b in r.json()}
    assert {"usmle-step-1-cardio", "ap-calc-bc-2027", "fe-elec-circuits"}.issubset(slugs)


@pytest.mark.integration
def test_create_and_read_item(author):
    """Create a bank → create an item → list it back → read it singly."""
    bank_slug = f"test-bank-{uuid.uuid4().hex[:6]}"
    bank_r = httpx.post(
        f"{API_BASE}/api/v1/item-banks",
        headers=_hdr(author["token"]),
        json={
            "slug": bank_slug,
            "name": "Test bank",
            "framework": "ccss",
            "tier": "high_school",
        },
        timeout=10,
    )
    assert bank_r.status_code == 201, bank_r.text
    bank = bank_r.json()

    item_r = httpx.post(
        f"{API_BASE}/api/v1/items",
        headers=_hdr(author["token"]),
        json={
            "bank_id": bank["id"],
            "kind": "mcq_single",
            "content": {
                "stem": "What is 2 + 2?",
                "options": ["3", "4", "5", "6"],
                "correct_index": 1,
            },
            "explanation": "Basic arithmetic.",
            "difficulty_nominal": "easy",
            "estimated_time_sec": 30,
            "tags": ["arithmetic"],
        },
        timeout=10,
    )
    assert item_r.status_code == 201, item_r.text
    item = item_r.json()
    assert item["content"]["correct_index"] == 1
    assert item["review_status"] == "draft"

    list_r = httpx.get(
        f"{API_BASE}/api/v1/item-banks/{bank_slug}/items",
        headers=_hdr(author["token"]),
        timeout=10,
    )
    assert list_r.status_code == 200
    ids = {i["id"] for i in list_r.json()}
    assert item["id"] in ids

    one_r = httpx.get(
        f"{API_BASE}/api/v1/items/{item['id']}",
        headers=_hdr(author["token"]),
        timeout=10,
    )
    assert one_r.status_code == 200
    assert one_r.json()["id"] == item["id"]


@pytest.mark.integration
def test_variant_generation_stub_mode(author):
    """Without ANTHROPIC_API_KEY, generator returns deterministic stubs.
    Variants share family_id, inherit skill tags, and are created in the
    correct review_status."""
    # Grab any seeded item to use as the base
    base_list = httpx.get(
        f"{API_BASE}/api/v1/item-banks/usmle-step-1-cardio/items?limit=1",
        headers=_hdr(author["token"]),
        timeout=10,
    ).json()
    base = base_list[0]

    r = httpx.post(
        f"{API_BASE}/api/v1/items/{base['id']}/variants",
        headers=_hdr(author["token"]),
        json={"base_item_id": base["id"], "count": 3, "sme_review_required": True},
        timeout=30,
    )
    assert r.status_code == 201, r.text
    variants = r.json()
    assert len(variants) == 3
    for v in variants:
        assert v["base_item_id"] == base["id"]
        assert v["family_id"] == base["family_id"]
        assert v["generation_method"] in ("stub", "claude")


@pytest.mark.integration
def test_variants_inherit_skill_tags(author):
    base_list = httpx.get(
        f"{API_BASE}/api/v1/item-banks/usmle-step-1-cardio/items?limit=1",
        headers=_hdr(author["token"]),
        timeout=10,
    ).json()
    base = base_list[0]
    r = httpx.post(
        f"{API_BASE}/api/v1/items/{base['id']}/variants",
        headers=_hdr(author["token"]),
        json={"base_item_id": base["id"], "count": 1},
        timeout=30,
    )
    variant_item_id = r.json()[0]["item_id"]

    # Check tags via the content_skills endpoint
    base_tags = httpx.get(
        f"{API_BASE}/api/v1/content-skills?content_kind=question&content_id={base['id']}",
        headers=_hdr(author["token"]),
        timeout=10,
    ).json()
    variant_tags = httpx.get(
        f"{API_BASE}/api/v1/content-skills?content_kind=question&content_id={variant_item_id}",
        headers=_hdr(author["token"]),
        timeout=10,
    ).json()
    base_skill_ids = {t["skill_id"] for t in base_tags}
    variant_skill_ids = {t["skill_id"] for t in variant_tags}
    assert base_skill_ids, "base item should have at least one skill tag"
    assert base_skill_ids.issubset(variant_skill_ids), (
        f"variant should inherit base's skills; base={base_skill_ids} variant={variant_skill_ids}"
    )


@pytest.mark.integration
def test_hybrid_search_returns_results(author):
    r = httpx.get(
        f"{API_BASE}/api/v1/item-search?q=resonance&framework=fe_pe&limit=5",
        headers=_hdr(author["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    hits = r.json()
    assert hits, "expected at least one hit for 'resonance' in fe_pe"
    # The top hit should mention resonance or RLC
    top_stem = (hits[0]["item"]["content"].get("stem") or "").lower()
    assert "resonan" in top_stem or "rlc" in top_stem
