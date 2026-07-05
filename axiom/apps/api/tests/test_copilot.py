"""Copilot: grounded reasoning, retrieval, and the tutoring endpoints."""

from __future__ import annotations

from sqlalchemy import select

from app.domains.copilot import service as svc
from app.domains.copilot.reasoning import MockReasoningProvider, Passage, ReasoningRequest
from app.domains.copilot.retrieval import retrieve
from app.domains.curriculum.models import KnowledgeNode
from app.domains.identity.models import User
from tests.conftest import AUTH


async def test_mock_provider_is_grounded_and_honest():
    provider = MockReasoningProvider()
    grounded = await provider.generate(
        ReasoningRequest(
            task="explain",
            question="integers",
            passages=[
                Passage("Lesson: Integers", "lesson", "Add and subtract integers carefully.")
            ],
        )
    )
    assert grounded.grounded is True
    assert grounded.provider == "mock"
    assert grounded.text

    empty = await provider.generate(ReasoningRequest(task="chat", question="anything", passages=[]))
    assert empty.grounded is False
    assert "do not have" in empty.text.lower()


async def test_retrieve_scopes_to_node_and_falls_back(db_session):
    node = (
        await db_session.execute(select(KnowledgeNode).where(KnowledgeNode.code == "ALG.1"))
    ).scalar_one()
    hits = await retrieve(db_session, "integers order of operations", node_id=node.id, limit=4)
    assert len(hits) >= 1
    # An empty query still grounds to the node's own material.
    fallback = await retrieve(db_session, "", node_id=node.id, limit=3)
    assert len(fallback) >= 1


async def test_explain_service_is_labeled_and_grounded(db_session):
    user = User(eureka_user_id="cp1", email="cp1@x.com", display_name="Cp One")
    db_session.add(user)
    await db_session.flush()
    result = await svc.explain(db_session, user.id, node_ref="ALG.1")
    assert result["ai_generated"] is True
    assert result["provider"] == "mock"
    assert result["grounded"] is True
    assert result["explanation"]
    assert result["sources"]


async def test_hint_endpoint_never_uses_worked_examples(client):
    served = (await client.post("/api/v1/practice/next", json={}, headers=AUTH)).json()
    resp = await client.post(
        "/api/v1/copilot/hint",
        json={"response_token": served["response_token"]},
        headers=AUTH,
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["ai_generated"] is True
    assert body["hint"]
    # A hint must never be backed by an answer-bearing worked example.
    assert all(source["kind"] != "item" for source in body["sources"])


async def test_chat_thread_persists_and_reads_back(client):
    first = await client.post(
        "/api/v1/copilot/chat",
        json={"message": "How do I combine like terms?", "node": "ALG.3"},
        headers=AUTH,
    )
    assert first.status_code == 200
    session_id = first.json()["session_id"]
    assert first.json()["reply"]
    assert first.json()["ai_generated"] is True

    second = await client.post(
        "/api/v1/copilot/chat",
        json={"message": "Can you give an example?", "session_id": session_id},
        headers=AUTH,
    )
    assert second.status_code == 200
    assert second.json()["session_id"] == session_id

    history = await client.get(f"/api/v1/copilot/sessions/{session_id}", headers=AUTH)
    assert history.status_code == 200
    messages = history.json()["messages"]
    assert len([m for m in messages if m["role"] == "user"]) == 2
    assert len([m for m in messages if m["role"] == "assistant"]) == 2


async def test_explain_unknown_node_is_404(client):
    resp = await client.post("/api/v1/copilot/explain", json={"node": "NOPE"}, headers=AUTH)
    assert resp.status_code == 404
