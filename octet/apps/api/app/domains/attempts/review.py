"""Missed questions review layer.

Ported from AXIOM's missed_questions machinery. The rule that matters: a retry
re-serves the EXACT stored variant, so the learner meets the same numbers
again rather than a fresh problem that lets them dodge the difficulty. The key
is never returned on the retry path.

This module is storage agnostic. It operates on a list of records so it can be
unit tested with no database, and the Phase 3 persistence layer supplies the
same shape from Postgres.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone


@dataclass
class MissedRecord:
    user_id: str
    node: str
    template_id: str
    seed: int
    prompt: str
    last_answer: str = ""
    misconception: str | None = None
    miss_count: int = 1
    status: str = "open"  # open | cleared
    first_missed_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    last_seen_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def key(self) -> tuple[str, str, int]:
        return (self.user_id, self.template_id, self.seed)


def record_outcome(
    store: list[MissedRecord],
    *,
    user_id: str,
    node: str,
    template_id: str,
    seed: int,
    prompt: str,
    is_correct: bool,
    student_answer: str = "",
    misconception: str | None = None,
) -> MissedRecord | None:
    """Upsert on (user, template, seed).

    A correct re attempt clears the record. A later miss reopens it and
    increments the count, so the learner's history of a specific difficulty is
    preserved rather than reset.
    """
    now = datetime.now(timezone.utc).isoformat()
    existing = next(
        (m for m in store if m.key() == (user_id, template_id, seed)), None
    )

    if is_correct:
        if existing:
            existing.status = "cleared"
            existing.last_seen_at = now
        return existing

    if existing:
        existing.miss_count += 1
        existing.status = "open"
        existing.last_answer = str(student_answer)
        existing.misconception = misconception or existing.misconception
        existing.last_seen_at = now
        return existing

    record = MissedRecord(
        user_id=user_id, node=node, template_id=template_id, seed=seed,
        prompt=prompt, last_answer=str(student_answer), misconception=misconception,
    )
    store.append(record)
    return record


def open_missed(store: list[MissedRecord], user_id: str) -> list[MissedRecord]:
    return [m for m in store if m.user_id == user_id and m.status == "open"]


def summary(store: list[MissedRecord], user_id: str) -> dict:
    """What the learner is actually getting wrong, grouped by belief and node."""
    mine = [m for m in store if m.user_id == user_id]
    open_items = [m for m in mine if m.status == "open"]
    by_node: dict[str, int] = {}
    by_misconception: dict[str, int] = {}
    for m in open_items:
        by_node[m.node] = by_node.get(m.node, 0) + 1
        if m.misconception:
            by_misconception[m.misconception] = by_misconception.get(m.misconception, 0) + 1
    return {
        "open": len(open_items),
        "cleared": len(mine) - len(open_items),
        "by_node": dict(sorted(by_node.items(), key=lambda kv: -kv[1])),
        "by_misconception": dict(sorted(by_misconception.items(), key=lambda kv: -kv[1])),
    }


def retry_payload(record: MissedRecord) -> dict:
    """Re serve the same variant. The key is deliberately absent."""
    return {
        "template_id": record.template_id,
        "seed": record.seed,
        "prompt": record.prompt,
        "node": record.node,
        "miss_count": record.miss_count,
        "note": "This is the same question you missed, with the same numbers.",
    }
