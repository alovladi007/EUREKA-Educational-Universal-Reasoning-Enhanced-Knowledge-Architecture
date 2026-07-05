"""Read-only analytics queries for AXIOM.

These functions answer teacher- and learner-facing questions that span the
attempts, assessment, curriculum, and adaptive domains: how each item performs
(classical statistics plus any calibrated IRT parameters), how a cohort is doing
against each standard, and how one learner has grown over time.

The aggregation strategy is deliberate. Rather than issue one query per item (an
N+1 pattern that gets slow as the item bank grows), each function pulls the
handful of tables it needs in a few bulk SELECTs and folds the rows together in
Python. That keeps round-trips to the database constant regardless of item or
learner count.

Everything here is read-only, so there are no datetime writes and nothing is
committed; the caller's request-scoped session is only used to read.
"""

from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.adaptive.models import IRTParameters, MasteryEvent, MasteryState
from app.domains.assessment.models import Item
from app.domains.attempts.models import Response, Score
from app.domains.curriculum.models import KnowledgeNode

# How many characters of an item prompt to surface as a preview. A short slice
# keeps the analytics payload and exported tables readable without shipping the
# full prompt text for every item.
_PROMPT_PREVIEW = 80


def _mean(values: list[float]) -> float:
    """Return the mean, or 0.0 for an empty list.

    Analytics rows exist for items with no scored responses yet, so callers need
    a defined value (0.0) instead of a division-by-zero error.
    """
    if not values:
        return 0.0
    return sum(values) / len(values)


async def item_analysis(session: AsyncSession) -> list[dict]:
    """Classical item statistics with IRT parameters attached, per item.

    For each Item we compute the number of scored responses, the p-value (mean
    correctness, the classic difficulty index), and the mean raw score. IRT
    parameters are attached when a calibrated row exists for the item so a
    teacher can compare classical and model-based difficulty side by side.

    Results are sorted by node code then p-value so the hardest items within a
    skill surface first when scanning the list.
    """
    items = (await session.execute(select(Item))).scalars().all()
    nodes = (await session.execute(select(KnowledgeNode))).scalars().all()
    irt_rows = (await session.execute(select(IRTParameters))).scalars().all()

    # Join Score to its Response so each score carries the item_id it belongs to.
    # Doing the join in SQL avoids a second pass to map response_id -> item_id.
    score_rows = (
        await session.execute(
            select(Response.item_id, Score.is_correct, Score.score).join(
                Score, Score.response_id == Response.id
            )
        )
    ).all()

    node_by_id = {node.id: node for node in nodes}
    # IRT rows can target a template instead of an item; keep only item-scoped
    # rows here since item_analysis is per Item.
    irt_by_item = {row.item_id: row for row in irt_rows if row.item_id is not None}

    corrects_by_item: dict[uuid.UUID, list[float]] = {}
    scores_by_item: dict[uuid.UUID, list[float]] = {}
    for item_id, is_correct, score in score_rows:
        if item_id is None:
            continue
        corrects_by_item.setdefault(item_id, []).append(1.0 if is_correct else 0.0)
        scores_by_item.setdefault(item_id, []).append(score)

    out: list[dict] = []
    for item in items:
        corrects = corrects_by_item.get(item.id, [])
        scores = scores_by_item.get(item.id, [])
        node = node_by_id.get(item.node_id)
        irt = irt_by_item.get(item.id)
        prompt = item.prompt or ""
        out.append(
            {
                "item_id": str(item.id),
                "node_id": str(item.node_id),
                "node_code": node.code if node else "",
                "node_title": node.title if node else "",
                "kind": item.kind,
                "prompt_preview": prompt[:_PROMPT_PREVIEW],
                "n_responses": len(corrects),
                "p_value": round(_mean(corrects), 4),
                "avg_score": round(_mean(scores), 4),
                "irt": ({"a": irt.a, "b": irt.b, "c": irt.c} if irt is not None else None),
            }
        )

    # Items with no node sort last (empty code sorts first ascending, so guard
    # is not needed); tie-break by p_value ascending puts hardest items on top.
    out.sort(key=lambda row: (row["node_code"], row["p_value"]))
    return out


async def standards_heatmap(session: AsyncSession) -> dict:
    """Cohort mastery per knowledge node, for a standards-coverage heatmap.

    For each node we aggregate MasteryState rows across all learners: how many
    learners have a state, their average p_known, and a count of learners in each
    mastery level. The level distribution is built from the level strings that
    actually appear in the data rather than a fixed list, so it stays correct if
    the band labels change.
    """
    nodes = (await session.execute(select(KnowledgeNode))).scalars().all()
    states = (await session.execute(select(MasteryState))).scalars().all()

    p_by_node: dict[uuid.UUID, list[float]] = {}
    levels_by_node: dict[uuid.UUID, dict[str, int]] = {}
    for state in states:
        p_by_node.setdefault(state.node_id, []).append(state.p_known)
        levels = levels_by_node.setdefault(state.node_id, {})
        levels[state.level] = levels.get(state.level, 0) + 1

    rows: list[dict] = []
    for node in nodes:
        p_values = p_by_node.get(node.id, [])
        rows.append(
            {
                "code": node.code,
                "title": node.title,
                "n_learners": len(p_values),
                "avg_p_known": round(_mean(p_values), 4),
                "levels": levels_by_node.get(node.id, {}),
            }
        )

    rows.sort(key=lambda row: row["code"])
    return {"nodes": rows}


async def growth(session: AsyncSession, user_id: uuid.UUID) -> dict:
    """One learner's mastery history plus their current average mastery.

    The events series is the append-only MasteryEvent log in chronological order,
    which lets a client draw a growth curve of p_known_after over time. The
    current average is taken from the learner's live MasteryState rows so the
    headline number matches what the mastery view shows, not a replay of history.
    """
    events = (
        (
            await session.execute(
                select(MasteryEvent)
                .where(MasteryEvent.user_id == user_id)
                .order_by(MasteryEvent.created_at)
            )
        )
        .scalars()
        .all()
    )
    states = (
        (await session.execute(select(MasteryState).where(MasteryState.user_id == user_id)))
        .scalars()
        .all()
    )

    series = [
        {
            "t": ev.created_at.isoformat() if ev.created_at is not None else "",
            "node_id": str(ev.node_id),
            "correct": ev.correct,
            "p_known_after": round(ev.p_known_after, 4),
        }
        for ev in events
    ]
    avg_now = round(_mean([state.p_known for state in states]), 4)
    return {"events": series, "avg_p_known_now": avg_now, "n_events": len(series)}


def item_analysis_table(rows: list[dict]) -> tuple[list[str], list[list]]:
    """Flatten item_analysis dicts into (headers, rows) for CSV/PDF export.

    Keeping the column layout here means the CSV and PDF endpoints share one
    source of truth for which fields appear and in what order, so the two exports
    never drift apart. IRT columns are blank for items without a calibrated row.
    """
    headers = ["Node", "Title", "Kind", "N", "P-Value", "Avg Score", "a", "b", "c"]
    table: list[list] = []
    for row in rows:
        irt = row.get("irt")
        table.append(
            [
                row["node_code"],
                row["node_title"],
                row["kind"],
                row["n_responses"],
                row["p_value"],
                row["avg_score"],
                irt["a"] if irt else "",
                irt["b"] if irt else "",
                irt["c"] if irt else "",
            ]
        )
    return headers, table
