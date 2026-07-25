"""Practice sessions: the UWorld-shaped loop.

A learner picks units, an item count and a mode; the service assembles a
session from the template registry across those units' nodes; every answer is
graded in the sandbox, persisted, and folded into mastery.

Two modes, and the difference is only when feedback arrives:

  tutor  the answer endpoint returns the full grade and rationale
         immediately, one item at a time.
  timed  the answer endpoint records and returns nothing about correctness;
         grading happens at submission and the review endpoint carries the
         rationale afterward. The clock is the client's; the server records
         durations and does not enforce a limit, because practice under time
         pressure is a training choice, not an integrity boundary. Exams are
         the integrity boundary and they enforce theirs server side.

The rationale is the part that makes review worth opening. For a multiple
choice item it explains every option: the correct one, and for each
distractor the named misconception, its description and its counterexample,
straight from the reviewed library. For numeric and structure items it names
the diagnosed wrong path where one was recognised. Nothing in the rationale
is generated at request time; it is all authored, keyed content.
"""

from __future__ import annotations

import uuid

import chem_core as cc
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import func

from app.data.curriculum import NODES_BY_CODE, UNITS
from app.domains.grading.sandbox import grade_sandboxed
from app.domains.practice.models import (
    MODE_TIMED,
    MODE_TUTOR,
    MODES,
    STATUS_IN_PROGRESS,
    STATUS_SUBMITTED,
    NodeMastery,
    PracticeResponse,
    PracticeSession,
    update_mastery,
)


class PracticeError(Exception):
    """A controlled refusal with a learner-readable reason."""


def templates_for_units(unit_ids: list[str]) -> list[tuple[str, str]]:
    """(template_id, node_code) pairs whose node sits in one of the units."""
    wanted = set(unit_ids)
    out = []
    for tid, entry in cc.REGISTRY.items():
        node = NODES_BY_CODE.get(entry.get("node", ""))
        if node is not None and node.unit in wanted:
            out.append((tid, node.code))
    return out


def catalogue() -> list[dict]:
    """Units with their practice supply, for the builder UI.

    A unit with zero templates is listed anyway with available=False, because
    hiding it would misrepresent the course as smaller than it is. The builder
    disables it and says why.
    """
    per_unit: dict[str, int] = {}
    for _tid, entry in cc.REGISTRY.items():
        node = NODES_BY_CODE.get(entry.get("node", ""))
        if node is not None:
            per_unit[node.unit] = per_unit.get(node.unit, 0) + 1
    return [
        {
            "unit_id": u.id,
            "title": u.title,
            "course": u.course,
            "index": u.index,
            "templates": per_unit.get(u.id, 0),
            "available": per_unit.get(u.id, 0) > 0,
        }
        for u in UNITS
    ]


def _public_item(variant: cc.Variant, position: int, node_title: str, unit: str) -> dict:
    """What the learner sees. The key never leaves the server."""
    if variant.grader == "mc":
        meta = {
            "choices": [
                {"index": c["index"], "text": c["text"]} for c in variant.meta["choices"]
            ]
        }
    else:
        meta = {
            k: v
            for k, v in variant.meta.items()
            if k in ("unit", "formula", "name", "signals", "choices")
        }
    return {
        "position": position,
        "template_id": variant.template_id,
        "seed": variant.seed,
        "node": variant.node,
        "node_title": node_title,
        "unit": unit,
        "prompt": variant.prompt,
        "grader": variant.grader,
        "meta": meta,
    }


async def start_session(
    session: AsyncSession,
    user_id: str,
    *,
    unit_ids: list[str],
    count: int,
    mode: str,
) -> PracticeSession:
    if mode not in MODES:
        raise PracticeError(f"mode must be one of {MODES}")
    if not 1 <= count <= 40:
        raise PracticeError("count must be between 1 and 40")

    supply = templates_for_units(unit_ids)
    if not supply:
        raise PracticeError(
            "None of the selected units has practice items yet. The catalogue "
            "marks which units are practiceable."
        )

    # Round-robin across templates so a session mixes nodes rather than
    # drilling one, matching how the exam assembler spreads a form.
    items: list[dict] = []
    salt = uuid.uuid4().hex[:8]
    position = 1
    idx = 0
    while len(items) < count:
        tid, node_code = supply[idx % len(supply)]
        seed = cc.variant_seed(user_id, tid, hash(salt) % 10_000 + position)
        try:
            variant = cc.resolve_generated(tid, seed)
        except RuntimeError:
            idx += 1
            # A template that cannot verify a variant is skipped, and if every
            # template fails the session cannot start. Refusing beats serving
            # an unverified key.
            if idx > 3 * len(supply):
                raise PracticeError(
                    "The selected units cannot supply verified items right now."
                )
            continue
        node = NODES_BY_CODE[node_code]
        items.append(_public_item(variant, position, node.title, node.unit))
        position += 1
        idx += 1

    row = PracticeSession(
        user_id=user_id,
        mode=mode,
        config={"units": unit_ids, "count": count},
        items={"items": items},
    )
    session.add(row)
    await session.flush()
    return row


def _rationale(variant: cc.Variant, grade: dict) -> dict:
    """Authored explanation content for one graded item.

    Multiple choice: every option explained via its keyed misconception.
    Everything else: the diagnosed misconception where one was recognised,
    plus the canonical answer for display in review.
    """
    out: dict = {
        "correct_display": grade.get("correct_display") or "",
        "lesson_node": variant.node,
    }
    code = grade.get("misconception")
    if code and code in cc.MISCONCEPTIONS:
        m = cc.MISCONCEPTIONS[code]
        out["misconception"] = {
            "code": code,
            "name": m.name,
            "description": m.description,
            "counterexample": m.counterexample,
            "review_node": m.routes_to,
        }
    if variant.grader == "mc":
        choices = []
        for c in variant.meta.get("choices", []):
            entry = {
                "index": c["index"],
                "text": c["text"],
                "correct": c["index"] == variant.meta.get("correct_index"),
            }
            mcode = c.get("misconception")
            if mcode and mcode in cc.MISCONCEPTIONS:
                m = cc.MISCONCEPTIONS[mcode]
                entry["why_wrong"] = m.description
                entry["counterexample"] = m.counterexample
            choices.append(entry)
        out["choices"] = choices
        out["correct_display"] = next(
            (c["text"] for c in variant.meta.get("choices", [])
             if c["index"] == variant.meta.get("correct_index")),
            out["correct_display"],
        )
    return out


async def answer(
    db: AsyncSession,
    user_id: str,
    session_id: uuid.UUID,
    *,
    position: int,
    submitted: str,
    seconds: int = 0,
    flagged: bool = False,
) -> dict:
    row = await db.get(PracticeSession, session_id)
    if row is None or row.user_id != user_id:
        raise PracticeError("That session was not found.")
    if row.status != STATUS_IN_PROGRESS:
        raise PracticeError("That session is already finished.")

    item = next((i for i in row.items["items"] if i["position"] == position), None)
    if item is None:
        raise PracticeError(f"No item at position {position}.")

    existing = (
        await db.scalars(
            select(PracticeResponse).where(
                PracticeResponse.session_id == row.id,
                PracticeResponse.position == position,
            )
        )
    ).first()
    if existing is not None:
        raise PracticeError("That item was already answered. Practice answers are final.")

    variant = cc.resolve_generated(item["template_id"], item["seed"])
    grade = await grade_sandboxed(
        variant.grader, {"key": variant.key, "meta": variant.meta}, submitted
    )

    db.add(
        PracticeResponse(
            session_id=row.id,
            user_id=user_id,
            node_code=variant.node,
            template_id=variant.template_id,
            position=position,
            answer=str(submitted)[:4000],
            is_correct=1 if grade["is_correct"] else 0,
            graded=1 if grade["graded"] else 0,
            score=float(grade["score"]),
            misconception=grade.get("misconception"),
            seconds=max(0, int(seconds)),
            flagged=1 if flagged else 0,
        )
    )

    # Ungraded (unparseable) submissions do not move mastery: a learner who
    # typed something the parser refused has not demonstrated anything either
    # way, and counting it as a miss would punish notation, not chemistry.
    if grade["graded"]:
        mastery = (
            await db.scalars(
                select(NodeMastery).where(
                    NodeMastery.user_id == user_id,
                    NodeMastery.node_code == variant.node,
                )
            )
        ).first()
        if mastery is None:
            # Column defaults apply at flush, not at construction, so a fresh
            # row must be given its zeros explicitly or update_mastery reads
            # None.
            mastery = NodeMastery(
                user_id=user_id,
                node_code=variant.node,
                attempts=0,
                correct=0,
                streak=0,
                ewma=0.0,
            )
            db.add(mastery)
        update_mastery(mastery, bool(grade["is_correct"]))
        mastery.last_attempt_at = func.now()

    # The select autoflushes the response added above, so the count already
    # includes this answer.
    answered = len(
        (
            await db.scalars(
                select(PracticeResponse.position).where(
                    PracticeResponse.session_id == row.id
                )
            )
        ).all()
    )

    if row.mode == MODE_TIMED:
        return {"recorded": True, "answered": answered, "total": len(row.items["items"])}

    return {
        "is_correct": grade["is_correct"],
        "score": grade["score"],
        "graded": grade["graded"],
        "detail": grade["detail"],
        "rationale": _rationale(variant, grade),
        "answered": answered,
        "total": len(row.items["items"]),
    }


async def finish(db: AsyncSession, user_id: str, session_id: uuid.UUID) -> dict:
    row = await db.get(PracticeSession, session_id)
    if row is None or row.user_id != user_id:
        raise PracticeError("That session was not found.")
    if row.status == STATUS_SUBMITTED:
        return row.summary or {}

    responses = (
        await db.scalars(
            select(PracticeResponse).where(PracticeResponse.session_id == row.id)
        )
    ).all()
    by_pos = {r.position: r for r in responses}

    by_unit: dict[str, dict] = {}
    correct = 0
    for item in row.items["items"]:
        r = by_pos.get(item["position"])
        unit = item["unit"]
        slot = by_unit.setdefault(unit, {"correct": 0, "total": 0})
        slot["total"] += 1
        if r is not None and r.is_correct:
            slot["correct"] += 1
            correct += 1

    row.summary = {
        "correct": correct,
        "total": len(row.items["items"]),
        "answered": len(responses),
        "by_unit": by_unit,
        "mode": row.mode,
    }
    row.status = STATUS_SUBMITTED
    row.submitted_at = func.now()
    return row.summary


async def review(db: AsyncSession, user_id: str, session_id: uuid.UUID) -> dict:
    """Everything, per item: the UWorld-style post-session walkthrough.

    Only for finished sessions. An open tutor session already got its feedback
    per item, and an open timed session must not see keys.
    """
    row = await db.get(PracticeSession, session_id)
    if row is None or row.user_id != user_id:
        raise PracticeError("That session was not found.")
    if row.status != STATUS_SUBMITTED:
        raise PracticeError("Finish the session before reviewing it.")

    responses = (
        await db.scalars(
            select(PracticeResponse).where(PracticeResponse.session_id == row.id)
        )
    ).all()
    by_pos = {r.position: r for r in responses}

    items = []
    for item in row.items["items"]:
        r = by_pos.get(item["position"])
        variant = cc.resolve_generated(item["template_id"], item["seed"])
        grade = {
            "is_correct": bool(r.is_correct) if r else False,
            "misconception": r.misconception if r else None,
            "correct_display": "",
        }
        rationale = _rationale(variant, grade)
        if not rationale.get("correct_display"):
            rationale["correct_display"] = variant.key
        items.append(
            {
                "position": item["position"],
                "prompt": item["prompt"],
                "node": item["node"],
                "node_title": item["node_title"],
                "unit": item["unit"],
                "grader": item["grader"],
                "your_answer": r.answer if r else "",
                "answered": r is not None,
                "is_correct": bool(r.is_correct) if r else False,
                "flagged": bool(r.flagged) if r else False,
                "seconds": r.seconds if r else 0,
                "rationale": rationale,
            }
        )
    return {"session_id": str(row.id), "mode": row.mode, "summary": row.summary, "items": items}
