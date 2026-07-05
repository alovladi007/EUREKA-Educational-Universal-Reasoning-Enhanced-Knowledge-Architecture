"""Adaptive service: mastery updates, evidence, and path planning.

apply_mastery updates the BKT posterior for one (user, node) after a graded
response and records an append-only MasteryEvent carrying the before and after
probabilities, so the change is explainable. plan_path walks the skill graph,
gates each node on its prerequisites, and recommends the next node to work.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.adaptive.bkt import DEFAULT_PARAMS, bkt_update, level_for
from app.domains.adaptive.models import LearningPathState, MasteryEvent, MasteryState
from app.domains.curriculum.models import KnowledgeEdge, KnowledgeNode

# A prerequisite is considered satisfied when its mastery reaches this bar.
PREREQ_BAR = 0.7
MASTERED_BAR = 0.9


async def _get_state(session: AsyncSession, user_id: uuid.UUID, node_id: uuid.UUID) -> MasteryState:
    state = (
        await session.execute(
            select(MasteryState).where(
                MasteryState.user_id == user_id, MasteryState.node_id == node_id
            )
        )
    ).scalar_one_or_none()
    if state is None:
        state = MasteryState(
            user_id=user_id,
            node_id=node_id,
            p_known=DEFAULT_PARAMS.p_l0,
            level=level_for(DEFAULT_PARAMS.p_l0),
        )
        session.add(state)
        await session.flush()
    return state


async def apply_mastery(
    session: AsyncSession,
    user_id: uuid.UUID,
    node_id: uuid.UUID,
    correct: bool,
    response_id: uuid.UUID | None,
) -> dict:
    """Update mastery for one response and record the evidence."""
    state = await _get_state(session, user_id, node_id)
    before = state.p_known
    after = bkt_update(before, correct)
    state.p_known = after
    state.level = level_for(after)
    state.updated_at = datetime.now(UTC)
    session.add(
        MasteryEvent(
            user_id=user_id,
            node_id=node_id,
            response_id=response_id,
            correct=correct,
            p_known_before=before,
            p_known_after=after,
        )
    )
    await session.flush()
    return {
        "node_id": str(node_id),
        "p_known_before": round(before, 4),
        "p_known_after": round(after, 4),
        "level": state.level,
    }


async def list_mastery(session: AsyncSession, user_id: uuid.UUID) -> list[dict]:
    rows = (
        await session.execute(
            select(MasteryState, KnowledgeNode)
            .join(KnowledgeNode, KnowledgeNode.id == MasteryState.node_id)
            .where(MasteryState.user_id == user_id)
            .order_by(KnowledgeNode.code)
        )
    ).all()
    return [
        {
            "node_id": str(state.node_id),
            "code": node.code,
            "title": node.title,
            "p_known": round(state.p_known, 4),
            "level": state.level,
            "updated_at": state.updated_at,
        }
        for state, node in rows
    ]


async def list_evidence(
    session: AsyncSession, user_id: uuid.UUID, node_id: uuid.UUID
) -> list[dict]:
    rows = (
        (
            await session.execute(
                select(MasteryEvent)
                .where(MasteryEvent.user_id == user_id, MasteryEvent.node_id == node_id)
                .order_by(MasteryEvent.created_at)
            )
        )
        .scalars()
        .all()
    )
    return [
        {
            "created_at": ev.created_at,
            "correct": ev.correct,
            "p_known_before": round(ev.p_known_before, 4),
            "p_known_after": round(ev.p_known_after, 4),
            "response_id": str(ev.response_id) if ev.response_id else None,
        }
        for ev in rows
    ]


def _topo_order(
    node_ids: list[uuid.UUID], prereqs: dict[uuid.UUID, set[uuid.UUID]]
) -> list[uuid.UUID]:
    """Kahn topological sort. Falls back to input order on a cycle."""
    incoming = {n: set(prereqs.get(n, set())) for n in node_ids}
    order: list[uuid.UUID] = []
    ready = [n for n in node_ids if not incoming[n]]
    while ready:
        n = ready.pop(0)
        order.append(n)
        for m in node_ids:
            if n in incoming[m]:
                incoming[m].discard(n)
                if not incoming[m] and m not in order and m not in ready:
                    ready.append(m)
    if len(order) != len(node_ids):
        return node_ids  # cycle, keep given order
    return order


async def plan_path(session: AsyncSession, user_id: uuid.UUID) -> dict:
    """Compute the learner path over the skill graph and persist it."""
    nodes = (
        (await session.execute(select(KnowledgeNode).order_by(KnowledgeNode.code))).scalars().all()
    )
    edges = (await session.execute(select(KnowledgeEdge))).scalars().all()
    states = (
        (await session.execute(select(MasteryState).where(MasteryState.user_id == user_id)))
        .scalars()
        .all()
    )

    p_by_node = {s.node_id: s.p_known for s in states}
    prereqs: dict[uuid.UUID, set[uuid.UUID]] = {}
    for e in edges:
        if e.kind == "prerequisite":
            prereqs.setdefault(e.to_node_id, set()).add(e.from_node_id)

    ordered_ids = _topo_order([n.id for n in nodes], prereqs)
    node_by_id = {n.id: n for n in nodes}

    plan = []
    recommended: uuid.UUID | None = None
    for nid in ordered_ids:
        node = node_by_id[nid]
        p = p_by_node.get(nid, DEFAULT_PARAMS.p_l0)
        if p >= MASTERED_BAR:
            status = "mastered"
        else:
            prereq_ok = all(
                p_by_node.get(pid, DEFAULT_PARAMS.p_l0) >= PREREQ_BAR
                for pid in prereqs.get(nid, set())
            )
            status = "available" if prereq_ok else "locked"
        if recommended is None and status == "available":
            recommended = nid
        plan.append(
            {
                "node_id": str(nid),
                "code": node.code,
                "title": node.title,
                "p_known": round(p, 4),
                "level": level_for(p),
                "status": status,
            }
        )

    path = (
        await session.execute(select(LearningPathState).where(LearningPathState.user_id == user_id))
    ).scalar_one_or_none()
    if path is None:
        path = LearningPathState(user_id=user_id)
        session.add(path)
    path.current_node_id = recommended
    path.plan = plan
    path.updated_at = datetime.now(UTC)
    await session.flush()

    return {"plan": plan, "recommended_node_id": str(recommended) if recommended else None}
