"""AXIOM adaptive engine: pick the next best item for a learner.

The policy, in priority order (every decision returns a written rationale, per
the build prompt's rule that adaptive choices must be explainable):

  1. Remediation first. If the learner's most recent wrong answer carried a
     misconception, serve an item on the node that misconception routes to.
  2. Frontier next. Among nodes whose prerequisites are all mastered (the
     "frontier"), pick the one with the lowest current mastery and serve an
     item on it. This is the prerequisite-gated mastery spine.
  3. Review last. If every node is mastered, serve the node with the oldest
     evidence for spaced review (a placeholder for a real FSRS/SM-2 schedule,
     which the build prompt slates for the platform version).

Only verified items are ever served. An unverified item is invisible to the
picker by design: the verified-everything gate is enforced at selection time,
not just at authoring time.
"""

from __future__ import annotations

from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.orm import Session

from axiom_db import (
    AttemptRow, ItemRow, KnowledgeEdgeRow, KnowledgeNodeRow, MisconceptionRow,
)
from axiom_mastery import MASTERY_THRESHOLD


@dataclass
class NextItemDecision:
    item_id: str | None
    node_id: str | None
    node_title: str | None
    reason: str
    policy: str  # "remediation" | "frontier" | "review" | "none"


def _graph(db: Session):
    nodes = {n.id: n for n in db.execute(select(KnowledgeNodeRow)).scalars()}
    prereqs: dict[str, set[str]] = {nid: set() for nid in nodes}
    for e in db.execute(select(KnowledgeEdgeRow)).scalars():
        if e.relation == "prerequisite" and e.target in prereqs:
            prereqs[e.target].add(e.source)
    return nodes, prereqs


def _verified_item_for(
    db: Session,
    node_id: str,
    learner_id: str | None = None,
    exclude_item: str | None = None,
):
    """Pick a verified item on the node, rotating by fewest attempts from this
    learner (so a node with several items, including parameterized templates,
    cycles through them instead of always serving the first row)."""
    q = select(ItemRow).where(ItemRow.node_id == node_id, ItemRow.verified == True)  # noqa: E712
    rows = list(db.execute(q).scalars())
    if exclude_item:
        preferred = [r for r in rows if r.id != exclude_item]
        rows = preferred or rows
    if not rows:
        return None
    if learner_id:
        counts = {
            r.id: len(list(db.execute(
                select(AttemptRow.id).where(
                    AttemptRow.learner_id == learner_id,
                    AttemptRow.item_id == r.id,
                )
            ).scalars()))
            for r in rows
        }
        rows.sort(key=lambda r: (counts[r.id], r.id))
    return rows[0]


def pick_next_item(
    db: Session,
    learner_id: str,
    mastery: dict[str, dict],
) -> NextItemDecision:
    """mastery: node_id -> {"p": float, "attempts": int} snapshot."""
    nodes, prereqs = _graph(db)

    def p_of(nid: str) -> float:
        return mastery.get(nid, {}).get("p", 0.0)

    def is_mastered(nid: str) -> bool:
        return p_of(nid) >= MASTERY_THRESHOLD

    # 1. Remediation: most recent wrong attempt with a misconception.
    last_wrong = db.execute(
        select(AttemptRow)
        .where(AttemptRow.learner_id == learner_id,
               AttemptRow.correct == False,  # noqa: E712
               AttemptRow.misconception_code != None)  # noqa: E711
        .order_by(AttemptRow.created_at.desc())
        .limit(1)
    ).scalar_one_or_none()
    if last_wrong:
        misc = db.get(MisconceptionRow, last_wrong.misconception_code)
        if misc and not is_mastered(misc.routes_to):
            item = _verified_item_for(db, misc.routes_to, learner_id, exclude_item=last_wrong.item_id)
            if item:
                return NextItemDecision(
                    item.id, misc.routes_to, nodes[misc.routes_to].title,
                    reason=(
                        f"Your last wrong answer showed the pattern "
                        f"'{misc.name}' ({misc.code}), so the next item targets "
                        f"the skill it routes to: {nodes[misc.routes_to].title}."
                    ),
                    policy="remediation",
                )

    # 2. Frontier: unmastered nodes whose prerequisites are all mastered,
    #    lowest mastery first. Nodes with no prerequisites are always eligible.
    frontier = [
        nid for nid in nodes
        if not is_mastered(nid)
        and all(is_mastered(p) or p not in nodes for p in prereqs[nid])
    ]
    frontier.sort(key=p_of)
    for nid in frontier:
        item = _verified_item_for(db, nid, learner_id)
        if item:
            blocked = [t for t, ps in prereqs.items() if nid in ps]
            reason = (
                f"'{nodes[nid].title}' is on your frontier: every prerequisite "
                f"is mastered and its own mastery is lowest ({p_of(nid):.0%})."
            )
            if blocked:
                reason += (
                    f" Mastering it unlocks: "
                    f"{', '.join(nodes[b].title for b in blocked if b in nodes)}."
                )
            return NextItemDecision(item.id, nid, nodes[nid].title, reason, "frontier")

    # Frontier nodes may have no items yet; fall through to any unmastered node
    # with an item (still prerequisite-ordered by mastery).
    unmastered = sorted((n for n in nodes if not is_mastered(n)), key=p_of)
    for nid in unmastered:
        item = _verified_item_for(db, nid, learner_id)
        if item:
            return NextItemDecision(
                item.id, nid, nodes[nid].title,
                reason=(
                    f"No fully unlocked node has an item bank yet, so serving "
                    f"the lowest-mastery node with items: {nodes[nid].title}."
                ),
                policy="frontier",
            )

    # 3. Review: everything mastered; oldest-evidence node first (spaced-review
    #    placeholder until the real scheduler lands).
    reviewable = sorted(
        (nid for nid in nodes if nid in mastery),
        key=lambda nid: mastery[nid].get("attempts", 0),
    )
    for nid in reviewable:
        item = _verified_item_for(db, nid, learner_id)
        if item:
            return NextItemDecision(
                item.id, nid, nodes[nid].title,
                reason=(
                    f"Everything is mastered. Serving '{nodes[nid].title}' for "
                    f"retention review (fewest recent attempts)."
                ),
                policy="review",
            )

    return NextItemDecision(None, None, None, "No verified items available.", "none")
