"""Grounding retrieval for the copilot.

Given a query (and optionally a skill node), this returns the most relevant
curriculum passages: node descriptions, lesson summaries, lesson steps, and item
worked-explanations. The copilot is grounded in these so its replies cite real
lesson material.

Ranking is configurable (settings.retrieval_mode, ADR 0006):
  - lexical:  deterministic token overlap, with a boost for title terms.
  - semantic: cosine over deterministic local embeddings (see embeddings.py),
              which catches related word forms an exact match misses.
  - hybrid:   lexical plus a scaled semantic score (the default).
All modes run offline and in tests. Callers only ever see Passage lists, not how
they were ranked, so the store can later become pgvector-backed with a real
embedding model behind embed()/cosine() without touching callers.
"""

from __future__ import annotations

import re
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.domains.assessment.models import Item
from app.domains.content.models import ContentStep, Lesson
from app.domains.copilot.embeddings import cosine, embed
from app.domains.copilot.reasoning import Passage
from app.domains.curriculum.models import KnowledgeNode

# How much a semantic (0..1) score is worth relative to a lexical term match in
# the hybrid ranker: comparable to a few exact-term hits.
_SEMANTIC_WEIGHT = 4.0

# Common words carry no topical signal, so they are ignored when scoring.
_STOP = frozenset(
    """
    a an and are as at be by for from how i in is it of on or that the this to
    was what when where which who why with you your do does can could would
    should about into over under than then them they we my me our us if not no
    yes will just get got like need want help please solve find compute
    """.split()
)


def _tokens(text: str) -> list[str]:
    words = re.split(r"[^a-z0-9]+", (text or "").lower())
    return [t for t in words if len(t) > 1 and t not in _STOP]


def _score(query_terms: set[str], title: str, body: str) -> int:
    """Overlap score: body term matches plus a double weight for title matches."""
    if not query_terms:
        return 0
    body_terms = set(_tokens(body))
    title_terms = set(_tokens(title))
    return len(query_terms & body_terms) + 2 * len(query_terms & title_terms)


async def _candidates(
    session: AsyncSession, node_id: uuid.UUID | None, include_items: bool
) -> list[tuple[str, str, Passage]]:
    """Collect (title, body, Passage) candidates, optionally scoped to a node."""
    node_filter = [KnowledgeNode.id == node_id] if node_id is not None else []
    nodes = (
        (await session.execute(select(KnowledgeNode).where(*node_filter))).scalars().all()
    )
    node_ids = [n.id for n in nodes] if node_id is not None else None

    lesson_q = select(Lesson)
    if node_ids is not None:
        lesson_q = lesson_q.where(Lesson.node_id.in_(node_ids))
    lessons = (await session.execute(lesson_q)).scalars().all()
    lesson_ids = [le.id for le in lessons]

    steps: list[ContentStep] = []
    if lesson_ids:
        steps = (
            (
                await session.execute(
                    select(ContentStep).where(ContentStep.lesson_id.in_(lesson_ids))
                )
            )
            .scalars()
            .all()
        )

    out: list[tuple[str, str, Passage]] = []
    for node in nodes:
        passage = Passage(f"Skill: {node.title}", "node", node.description)
        out.append((node.title, node.description, passage))
    for lesson in lessons:
        passage = Passage(f"Lesson: {lesson.title}", "lesson", lesson.summary)
        out.append((lesson.title, lesson.summary, passage))
    for step in steps:
        passage = Passage(f"Lesson step: {step.title}", "step", step.body)
        out.append((step.title, step.body, passage))

    if include_items:
        item_q = select(Item)
        if node_ids is not None:
            item_q = item_q.where(Item.node_id.in_(node_ids))
        items = (await session.execute(item_q)).scalars().all()
        for item in items:
            if item.explanation:
                passage = Passage("Worked example", "item", item.explanation)
                out.append((item.prompt, item.explanation, passage))

    return out


async def retrieve(
    session: AsyncSession,
    query: str,
    node_id: uuid.UUID | None = None,
    limit: int = 4,
    include_items: bool = True,
) -> list[Passage]:
    """Return up to limit passages most relevant to the query.

    When a node is given and the query matches nothing (or is empty), the node's
    own lesson material is returned in reading order so hints and explanations
    are still grounded. include_items=False withholds answer-bearing worked
    explanations, which the hint flow uses so it cannot leak the answer.
    """
    candidates = await _candidates(session, node_id, include_items)
    if not candidates:
        return []

    mode = get_settings().retrieval_mode
    query_terms = set(_tokens(query))
    query_vec = embed(query) if mode in ("semantic", "hybrid") else None

    scored: list[tuple[float, int, Passage]] = []
    for i, (title, body, p) in enumerate(candidates):
        lexical = float(_score(query_terms, title, body))
        if query_vec is not None:
            semantic = cosine(query_vec, embed(f"{title} {body}"))
        else:
            semantic = 0.0
        if mode == "lexical":
            total = lexical
        elif mode == "semantic":
            total = semantic
        else:  # hybrid
            total = lexical + _SEMANTIC_WEIGHT * semantic
        scored.append((total, i, p))

    scored.sort(key=lambda row: (-row[0], row[1]))

    top = [p for s, _i, p in scored if s > 0][:limit]
    if top:
        return top

    # Nothing matched. If we are scoped to a node, fall back to that node's
    # material in stable order so the reply is still grounded; otherwise return
    # nothing so the provider can honestly say it has no material.
    if node_id is not None:
        return [p for _title, _body, p in candidates][:limit]
    return []
