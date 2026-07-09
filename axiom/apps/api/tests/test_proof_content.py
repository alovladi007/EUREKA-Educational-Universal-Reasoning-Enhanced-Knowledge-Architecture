"""RW-3: proof content and pedagogy (Extension Sections 6/7).

Covers the definition/theorem reference library (CRUD + copilot grounding),
the counterexample-search author tool, and proof-practice generation with a
verified-or-flagged reference proof.
"""

from __future__ import annotations

from sqlalchemy import select

from app.domains.copilot.proof_tools import generate_proof_practice, search_counterexample
from app.domains.copilot.retrieval import retrieve
from app.domains.curriculum.models import KnowledgeNode
from tests.conftest import AUTH


async def test_reference_library_grounds_retrieval_without_leaking_proofs(db_session):
    realan = (
        await db_session.execute(select(KnowledgeNode).where(KnowledgeNode.code == "REALAN"))
    ).scalar_one_or_none()
    assert realan is not None, "expected the seeded REALAN node"

    # include_items=False is the hint/proof-tutor mode: definitions and theorem
    # STATEMENTS may ground the reply, but a theorem's proof must not leak.
    passages = await retrieve(
        db_session, "convergence theorem", node_id=realan.id, limit=8, include_items=False
    )
    kinds = {p.kind for p in passages}
    assert kinds & {"theorem", "definition"}, "reference library should ground proof work"
    for p in passages:
        if p.kind == "theorem":
            assert "Proof:" not in p.text, "proof sketch must not leak in hint mode"


async def test_definition_crud_is_author_gated(client, as_teacher):
    created = await client.post(
        "/api/v1/curriculum/definitions",
        json={"course_code": "REAL-ANALYSIS", "term": "Cauchy sequence",
              "statement": "A sequence whose terms grow arbitrarily close for large indices.",
              "notation": "for all eps>0 exists N ...", "node": "REALAN"},
        headers=AUTH,
    )
    assert created.status_code == 200
    definition_id = created.json()["id"]

    listed = await client.get(
        "/api/v1/curriculum/definitions?course=REAL-ANALYSIS", headers=AUTH
    )
    assert listed.status_code == 200
    assert any(d["term"] == "Cauchy sequence" for d in listed.json()["definitions"])

    deleted = await client.delete(
        f"/api/v1/curriculum/definitions/{definition_id}", headers=AUTH
    )
    assert deleted.status_code == 200


async def test_definition_create_forbidden_for_student(client):
    # The mock identity is a student; writing to the library is author-scoped.
    resp = await client.post(
        "/api/v1/curriculum/definitions",
        json={"term": "x", "statement": "y"},
        headers=AUTH,
    )
    assert resp.status_code == 403


def test_counterexample_search_finds_and_reports_none():
    # "for all n, n > 0" is false: n = 0 refutes it.
    found = search_counterexample("n > 0", ["1", "2", "0", "3"], "n")
    assert found["found"] is True
    assert found["counterexample"] == "0"

    # "for all n, n >= 0" holds on this set: no counterexample found.
    none = search_counterexample("n >= 0", ["0", "1", "2"], "n")
    assert none["found"] is False
    assert none["searched"] == 3


async def test_proof_practice_generates_statement_with_reference():
    practice = await generate_proof_practice("intro", salt=0)
    assert practice["statement"]
    assert practice["reference_proof"]
    # With no Lean toolchain configured in tests, a formalizable statement is not
    # auto-verified: it is flagged for human review, never passed on no evidence.
    assert "needs_human_review" in practice
    assert practice["techniques"]
