"""Tests for local embeddings and semantic/hybrid grounding retrieval."""

from __future__ import annotations

import pytest
from sqlalchemy import select

from app.domains.copilot.embeddings import cosine, embed
from app.domains.copilot.retrieval import retrieve
from app.domains.curriculum.models import KnowledgeNode


def test_identical_text_is_maximally_similar():
    v = embed("solving linear equations")
    assert cosine(v, v) == pytest.approx(1.0, abs=1e-9)


def test_related_word_forms_are_closer_than_unrelated():
    base = embed("quadratic equations")
    related = embed("solving quadratics")
    unrelated = embed("photosynthesis in plant cells")
    assert cosine(base, related) > cosine(base, unrelated)


def test_empty_text_is_a_zero_vector():
    v = embed("   ")
    assert all(x == 0.0 for x in v)
    assert cosine(v, embed("anything")) == 0.0


@pytest.mark.asyncio
async def test_retrieval_returns_grounded_passages(db_session):
    node = (
        await db_session.execute(select(KnowledgeNode).where(KnowledgeNode.code == "ALG.1"))
    ).scalar_one()
    # A query phrased differently from the lesson text still grounds via hybrid
    # ranking (the default mode).
    passages = await retrieve(db_session, "how do I solve equations", node_id=node.id, limit=3)
    assert len(passages) >= 1
    assert all(hasattr(p, "source") and hasattr(p, "text") for p in passages)
