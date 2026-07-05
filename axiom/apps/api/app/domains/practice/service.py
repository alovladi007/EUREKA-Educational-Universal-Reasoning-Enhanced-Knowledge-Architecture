"""Practice service.

serve_next picks the next question for a student. When the source is a
parameterized template it resolves a deterministic ItemVariant seeded from
(user, template, attempt count) so two students get different numbers while the
Response still records the template, which is what analytics aggregate on.

answer grades the submission (SymPy for math), persists the Score, the
GradingRecord (grader plus confidence), and a ReasoningTrace, updates the BKT
mastery for the node with an append-only event, and advances the attempt.
"""

from __future__ import annotations

import hashlib
import random
import uuid
from datetime import UTC, datetime

from math_core import ItemTemplate as McItemTemplate
from math_core import resolve_template
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.adaptive.bkt import level_for
from app.domains.adaptive.service import apply_mastery, plan_path
from app.domains.assessment.models import Item, ItemTemplate, ItemVariant
from app.domains.attempts.models import (
    Attempt,
    GradingRecord,
    ReasoningTrace,
    Response,
    Score,
    StepCredit,
)
from app.domains.curriculum.models import KnowledgeNode
from app.domains.gamification.service import record_practice_result
from app.domains.grading.free_response import grade_free_response
from app.domains.grading.service import grade

# Ordered mastery bands, used to detect a level increase from one response so
# gamification can reward genuine advancement (not raw answer count).
_LEVEL_RANK = {"novice": 0, "developing": 1, "proficient": 2, "mastered": 3}


def _variant_seed(user_id: uuid.UUID, template_id: uuid.UUID, count: int) -> int:
    """Deterministic 31-bit seed. Same inputs always resolve the same variant;
    different users (or the same user later) get different numbers."""
    raw = f"{user_id}:{template_id}:{count}".encode()
    return int.from_bytes(hashlib.sha256(raw).digest()[:4], "big") & 0x7FFFFFFF


async def _open_practice_attempt(session: AsyncSession, user_id: uuid.UUID) -> Attempt:
    attempt = (
        (
            await session.execute(
                select(Attempt)
                .where(
                    Attempt.user_id == user_id,
                    Attempt.kind == "practice",
                    Attempt.status == "in_progress",
                )
                .order_by(Attempt.started_at.desc())
            )
        )
        .scalars()
        .first()
    )
    if attempt is None:
        attempt = Attempt(user_id=user_id, kind="practice", status="in_progress")
        session.add(attempt)
        await session.flush()
    return attempt


async def _pick_node(
    session: AsyncSession, user_id: uuid.UUID, node_id: uuid.UUID | None
) -> uuid.UUID | None:
    if node_id is not None:
        return node_id
    planned = await plan_path(session, user_id)
    rec = planned.get("recommended_node_id")
    return uuid.UUID(rec) if rec else None


async def serve_next(
    session: AsyncSession, user_id: uuid.UUID, node_id: uuid.UUID | None = None
) -> dict:
    """Serve the next practice question, resolving a variant when needed."""
    target = await _pick_node(session, user_id, node_id)
    if target is None:
        return {"done": True, "message": "Nothing to practice right now. Great work."}

    node = (
        await session.execute(select(KnowledgeNode).where(KnowledgeNode.id == target))
    ).scalar_one_or_none()
    if node is None:
        return {"done": True, "message": "Unknown node."}

    templates = (
        (await session.execute(select(ItemTemplate).where(ItemTemplate.node_id == target)))
        .scalars()
        .all()
    )
    items = (await session.execute(select(Item).where(Item.node_id == target))).scalars().all()
    if not templates and not items:
        return {"done": True, "message": "No items available for this node yet."}

    attempt = await _open_practice_attempt(session, user_id)
    count = (
        await session.execute(
            select(func.count(Response.id)).where(Response.attempt_id == attempt.id)
        )
    ).scalar_one()

    rng = random.Random(_variant_seed(user_id, target, count))
    prefer_template = bool(templates) and (not items or rng.random() < 0.5)

    response = Response(attempt_id=attempt.id, user_id=user_id, node_id=target, answer={})

    if prefer_template:
        template = rng.choice(templates)
        seed = _variant_seed(user_id, template.id, count)
        mc_template = McItemTemplate(
            id=str(template.id),
            variables=template.variables,
            constraints=template.constraints,
            stem=template.stem,
            answer_expr=template.answer_expr,
            tolerance=template.tolerance,
        )
        variant_out = resolve_template(mc_template, seed)
        variant = ItemVariant(
            template_id=template.id,
            seed=seed,
            values=variant_out.values,
            prompt=variant_out.stem,
            answer=variant_out.answer,
        )
        session.add(variant)
        await session.flush()
        response.template_id = template.id
        response.variant_id = variant.id
        session.add(response)
        await session.flush()
        return {
            "done": False,
            "response_token": str(response.id),
            "node_id": str(target),
            "node_title": node.title,
            "kind": template.kind,
            "prompt": variant.prompt,
            "options": None,
        }

    item = rng.choice(items)
    response.item_id = item.id
    session.add(response)
    await session.flush()
    return {
        "done": False,
        "response_token": str(response.id),
        "node_id": str(target),
        "node_title": node.title,
        "kind": item.kind,
        "prompt": item.prompt,
        "options": item.options,
    }


async def answer(
    session: AsyncSession, user_id: uuid.UUID, response_token: str, student_answer: str
) -> dict:
    """Grade a served question and update mastery."""
    try:
        response_id = uuid.UUID(response_token)
    except ValueError:
        return {"error": "invalid response token"}

    response = (
        await session.execute(
            select(Response).where(Response.id == response_id, Response.user_id == user_id)
        )
    ).scalar_one_or_none()
    if response is None:
        return {"error": "response not found"}
    if response.submitted_at is not None:
        return {"error": "already answered"}

    # Resolve the answer key and metadata from the source (item or variant).
    if response.item_id is not None:
        item = (await session.execute(select(Item).where(Item.id == response.item_id))).scalar_one()
        kind, correct, options = item.kind, item.correct, item.options
        tolerance, explanation = item.tolerance, item.explanation
        meta = item.meta or {}
    else:
        variant = (
            await session.execute(select(ItemVariant).where(ItemVariant.id == response.variant_id))
        ).scalar_one()
        template = (
            await session.execute(
                select(ItemTemplate).where(ItemTemplate.id == response.template_id)
            )
        ).scalar_one()
        kind, correct, options = template.kind, variant.answer, None
        tolerance, explanation = template.tolerance, template.explanation
        meta = {}

    # free_response items are AI-graded against a rubric (async, via the
    # reasoning provider); every other kind grades synchronously. show_work
    # items carry their expected milestones in meta for partial credit.
    if kind == "free_response":
        outcome = await grade_free_response(
            str(correct), student_answer, meta.get("rubric") or [], explanation=explanation
        )
    else:
        milestones = meta.get("milestones") if kind == "show_work" else None
        outcome = grade(
            kind,
            str(correct),
            student_answer,
            options=options,
            tolerance=tolerance,
            explanation=explanation,
            milestones=milestones,
        )

    now = datetime.now(UTC).replace(tzinfo=None)
    response.answer = {"raw": student_answer}
    response.submitted_at = now
    session.add(Score(response_id=response.id, is_correct=outcome.is_correct, score=outcome.score))
    session.add(
        GradingRecord(
            response_id=response.id,
            grader=outcome.grader,
            confidence=outcome.confidence,
            detail=outcome.detail,
        )
    )
    session.add(
        ReasoningTrace(
            subject_type="grading",
            subject_id=response.id,
            kind="grade",
            content={
                "grader": outcome.grader,
                "is_correct": outcome.is_correct,
                "student": student_answer,
                "key": str(correct),
                "detail": outcome.detail,
            },
        )
    )

    # Persist per-milestone partial credit for show-your-work and per-criterion
    # results for AI-graded free response, so a teacher sees which parts a
    # student reached (and the AI grader's rationale), not just the verdict.
    for credit in outcome.step_credits:
        session.add(
            StepCredit(
                response_id=response.id,
                milestone=credit["milestone"],
                awarded=credit["awarded"],
                note=credit.get("note", ""),
            )
        )

    attempt = (
        await session.execute(select(Attempt).where(Attempt.id == response.attempt_id))
    ).scalar_one()
    attempt.answered_count += 1
    if outcome.is_correct:
        attempt.correct_count += 1

    mastery = await apply_mastery(
        session, user_id, response.node_id, outcome.is_correct, response.id
    )

    # Reward genuine advancement: XP for a correct answer, a bonus when the
    # response pushed the learner into a higher mastery band, and a mastery
    # bonus the moment the top band is reached.
    level_before = level_for(mastery["p_known_before"])
    level_after = mastery["level"]
    leveled_up = _LEVEL_RANK.get(level_after, 0) > _LEVEL_RANK.get(level_before, 0)
    mastered = level_after == "mastered" and level_before != "mastered"
    gamification = await record_practice_result(
        session,
        user_id,
        correct=outcome.is_correct,
        leveled_up=leveled_up,
        mastered=mastered,
    )

    await session.commit()

    return {
        "is_correct": outcome.is_correct,
        "score": outcome.score,
        "grader": outcome.grader,
        # AI-graded responses (free response) are clearly flagged and can be
        # adjusted by a teacher through the grading override endpoint.
        "ai_graded": outcome.grader == "ai",
        "overridable": outcome.grader == "ai",
        "confidence": outcome.confidence,
        "correct_answer": outcome.correct_display,
        "explanation": outcome.explanation,
        "step_credits": outcome.step_credits,
        "mastery": mastery,
        "gamification": gamification,
    }
