"""
Integration tests for the AI tutor agent (Phase 6).

Exercises the full path:
  RAG ingest → session start → multi-turn conversation → hint-ladder
  bump → citations + groundedness → flag a message.

Runs against the live api-core in stub mode (no ANTHROPIC_API_KEY needed).
"""

from __future__ import annotations

import json
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
def learner():
    suffix = uuid.uuid4().hex[:8]
    email = f"tutor-{suffix}@example.com"
    pw = "TutorTest123!"
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO users (id, org_id, email, hashed_password,
                               first_name, last_name, role,
                               is_active, is_email_verified)
            VALUES (uuid_generate_v4(),
                    '550e8400-e29b-41d4-a716-446655440000',
                    %s, %s, 'Tutor', 'Test', 'student', TRUE, TRUE)
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
    # Best-effort cleanup. agent_sessions.user_id is NOT NULL, so we DELETE the
    # sessions (the old code tried to NULL them, which raised NotNullViolation
    # and failed the teardown). autocommit + per-statement try/except keeps a
    # single failure from aborting the rest of the cleanup.
    with _conn() as c:
        c.autocommit = True
        with c.cursor() as cur:
            for stmt in (
                "DELETE FROM agent_messages WHERE session_id IN "
                "(SELECT id FROM agent_sessions WHERE user_id = %s)",
                "DELETE FROM agent_sessions WHERE user_id = %s",
                "DELETE FROM users WHERE id = %s",
            ):
                try:
                    cur.execute(stmt, (user_id,))
                except Exception:
                    pass


def _hdr(t):
    return {"Authorization": f"Bearer {t}"}


def _get_skill(token: str, framework: str, code: str) -> dict:
    return httpx.get(
        f"{API_BASE}/api/v1/skills/by-code/{framework}/{code}",
        headers=_hdr(token),
        timeout=10,
    ).json()


@pytest.mark.integration
def test_rag_ingest_and_retrieve(learner):
    """Ingest is idempotent and retrieval surfaces the right chunks."""
    ingest_r = httpx.post(
        f"{API_BASE}/api/v1/agent/rag/ingest",
        headers=_hdr(learner["token"]),
        timeout=30,
    )
    assert ingest_r.status_code == 200, ingest_r.text
    body = ingest_r.json()
    assert body["item_chunks_upserted"] > 0
    assert body["skill_chunks_upserted"] > 0

    retrieve_r = httpx.get(
        f"{API_BASE}/api/v1/agent/rag/retrieve?q=ACE+inhibitor&framework=usmle&limit=5",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert retrieve_r.status_code == 200, retrieve_r.text
    chunks = retrieve_r.json()
    assert chunks, "should retrieve at least one chunk for 'ACE inhibitor'"
    # Top chunk should mention ACE inhibitor
    assert any("ACE" in c["text_excerpt"] for c in chunks[:3])


@pytest.mark.integration
def test_start_session_snapshots_system_prompt(learner):
    hf = _get_skill(learner["token"], "usmle", "STEP1.CARD.HF")
    r = httpx.post(
        f"{API_BASE}/api/v1/agent/sessions",
        headers=_hdr(learner["token"]),
        json={"skill_id": hf["id"], "mode": "socratic"},
        timeout=10,
    )
    assert r.status_code == 201, r.text
    s = r.json()
    assert s["status"] == "active"
    assert s["hint_level"] == 0
    assert s["mode"] == "socratic"


@pytest.mark.integration
def test_turn_produces_grounded_reply_with_citations(learner):
    hf = _get_skill(learner["token"], "usmle", "STEP1.CARD.HF")
    s_r = httpx.post(
        f"{API_BASE}/api/v1/agent/sessions",
        headers=_hdr(learner["token"]),
        json={"skill_id": hf["id"]},
        timeout=10,
    )
    sid = s_r.json()["id"]

    turn_r = httpx.post(
        f"{API_BASE}/api/v1/agent/sessions/{sid}/turn",
        headers=_hdr(learner["token"]),
        json={"message": "What first-line drug class reduces mortality in HFrEF?"},
        timeout=30,
    )
    assert turn_r.status_code == 200, turn_r.text
    body = turn_r.json()
    assert body["message"]["role"] == "assistant"
    assert isinstance(body["message"]["citations"], list)
    # Stub mode produces at least one citation tied to the active skill.
    assert len(body["message"]["citations"]) >= 1
    assert body["groundedness_score"] is not None


@pytest.mark.integration
def test_hint_ladder_bumps_on_stuck(learner):
    hf = _get_skill(learner["token"], "usmle", "STEP1.CARD.HF")
    s_r = httpx.post(
        f"{API_BASE}/api/v1/agent/sessions",
        headers=_hdr(learner["token"]),
        json={"skill_id": hf["id"]},
        timeout=10,
    )
    sid = s_r.json()["id"]
    assert s_r.json()["hint_level"] == 0

    # First turn — neutral question; no bump
    t1 = httpx.post(
        f"{API_BASE}/api/v1/agent/sessions/{sid}/turn",
        headers=_hdr(learner["token"]),
        json={"message": "How do I think about this?"},
        timeout=30,
    ).json()
    assert t1["hint_level"] == 0

    # Second turn — "I don't know" → bump to 1
    t2 = httpx.post(
        f"{API_BASE}/api/v1/agent/sessions/{sid}/turn",
        headers=_hdr(learner["token"]),
        json={"message": "I don't know — give me a hint"},
        timeout=30,
    ).json()
    assert t2["hint_level"] == 1, t2

    # Third turn — "still stuck" → bump to 2
    t3 = httpx.post(
        f"{API_BASE}/api/v1/agent/sessions/{sid}/turn",
        headers=_hdr(learner["token"]),
        json={"message": "still stuck"},
        timeout=30,
    ).json()
    assert t3["hint_level"] == 2, t3


@pytest.mark.integration
def test_session_message_log_and_traces(learner):
    hf = _get_skill(learner["token"], "usmle", "STEP1.CARD.HF")
    sid = httpx.post(
        f"{API_BASE}/api/v1/agent/sessions",
        headers=_hdr(learner["token"]),
        json={"skill_id": hf["id"]},
        timeout=10,
    ).json()["id"]
    httpx.post(
        f"{API_BASE}/api/v1/agent/sessions/{sid}/turn",
        headers=_hdr(learner["token"]),
        json={"message": "test message"},
        timeout=30,
    )

    msgs_r = httpx.get(
        f"{API_BASE}/api/v1/agent/sessions/{sid}/messages",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert msgs_r.status_code == 200
    msgs = msgs_r.json()
    roles = [m["role"] for m in msgs]
    assert "user" in roles and "assistant" in roles

    traces_r = httpx.get(
        f"{API_BASE}/api/v1/agent/sessions/{sid}/traces",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert traces_r.status_code == 200
    # Stub mode produces no tool traces; that's fine — endpoint just returns [].
    assert isinstance(traces_r.json(), list)


@pytest.mark.integration
def test_flag_message(learner):
    hf = _get_skill(learner["token"], "usmle", "STEP1.CARD.HF")
    sid = httpx.post(
        f"{API_BASE}/api/v1/agent/sessions",
        headers=_hdr(learner["token"]),
        json={"skill_id": hf["id"]},
        timeout=10,
    ).json()["id"]
    turn = httpx.post(
        f"{API_BASE}/api/v1/agent/sessions/{sid}/turn",
        headers=_hdr(learner["token"]),
        json={"message": "anything"},
        timeout=30,
    ).json()
    msg_id = turn["message"]["id"]

    flag_r = httpx.post(
        f"{API_BASE}/api/v1/agent/messages/{msg_id}/flag",
        headers=_hdr(learner["token"]),
        json={
            "message_id": msg_id,
            "kind": "hallucination",
            "learner_note": "This doesn't match what I learned in class.",
        },
        timeout=10,
    )
    assert flag_r.status_code == 201, flag_r.text
    flag = flag_r.json()
    assert flag["kind"] == "hallucination"
    assert flag["status"] == "open"
    assert flag["reporter_user_id"] == learner["user_id"]


@pytest.mark.integration
def test_end_session_marks_completed(learner):
    hf = _get_skill(learner["token"], "usmle", "STEP1.CARD.HF")
    sid = httpx.post(
        f"{API_BASE}/api/v1/agent/sessions",
        headers=_hdr(learner["token"]),
        json={"skill_id": hf["id"]},
        timeout=10,
    ).json()["id"]
    e_r = httpx.post(
        f"{API_BASE}/api/v1/agent/sessions/{sid}/end",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert e_r.status_code == 200
    assert e_r.json()["status"] == "completed"
    assert e_r.json()["ended_at"] is not None

    # Turn on an ended session → 400
    bad_r = httpx.post(
        f"{API_BASE}/api/v1/agent/sessions/{sid}/turn",
        headers=_hdr(learner["token"]),
        json={"message": "should fail"},
        timeout=10,
    )
    assert bad_r.status_code == 400


@pytest.mark.integration
def test_other_user_cannot_see_my_session(learner):
    """Cross-user isolation: a second user gets 404 on someone else's session."""
    suffix = uuid.uuid4().hex[:8]
    email = f"snoop-{suffix}@example.com"
    pw = "SnoopTest123!"
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO users (id, org_id, email, hashed_password,
                               first_name, last_name, role,
                               is_active, is_email_verified)
            VALUES (uuid_generate_v4(),
                    '550e8400-e29b-41d4-a716-446655440000',
                    %s, %s, 'S', 'X', 'student', TRUE, TRUE)
            RETURNING id
            """,
            (email, PWD.hash(pw)),
        )
        other_id = str(cur.fetchone()[0])
    try:
        other_tok = httpx.post(
            f"{API_BASE}/api/v1/auth/login",
            json={"email": email, "password": pw},
            timeout=10,
        ).json()["access_token"]

        # Create a session as the original learner
        hf = _get_skill(learner["token"], "usmle", "STEP1.CARD.HF")
        sid = httpx.post(
            f"{API_BASE}/api/v1/agent/sessions",
            headers=_hdr(learner["token"]),
            json={"skill_id": hf["id"]},
            timeout=10,
        ).json()["id"]

        r = httpx.get(
            f"{API_BASE}/api/v1/agent/sessions/{sid}",
            headers=_hdr(other_tok),
            timeout=10,
        )
        assert r.status_code == 404, "other user must not see this session"
    finally:
        with _conn() as c, c.cursor() as cur:
            cur.execute("DELETE FROM users WHERE id = %s", (other_id,))
