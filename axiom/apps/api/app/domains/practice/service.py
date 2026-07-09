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
from math_core import resolve_template, verify_steps
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.domains.adaptive.bkt import level_for
from app.domains.adaptive.service import apply_mastery, plan_path, schedule_review
from app.domains.analytics.ingest import record_event
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
from app.domains.grading.formal import grade_formal_proof
from app.domains.grading.free_response import grade_free_form_proof, grade_free_response
from app.domains.grading.mixed import grade_mixed
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
        # Non-answer UI data for the structured proof kinds (never leaks the key).
        "presentation": _presentation(item.kind, item.meta),
    }


def _presentation(kind: str, meta: dict | None) -> dict:
    """Safe, answer-free UI hints for the structured proof kinds.

    Only presentation data crosses to the client: the justification bank a
    learner picks from, and the number of gaps to render. Accepted forms,
    predicates, and correct pairings stay server-side.
    """
    meta = meta or {}
    if kind == "justification_matching":
        return {"justification_bank": list(meta.get("justification_bank") or [])}
    if kind == "proof_gap_fill":
        gaps = meta.get("gaps")
        return {"gap_count": len(gaps) if isinstance(gaps, list) else 1}
    if kind == "mixed":
        # Only each part's label and kind cross to the client; the per-part
        # answer keys and rubrics stay server-side.
        parts = meta.get("parts") or []
        return {
            "parts": [
                {"label": str(p.get("label", f"Part {i + 1}")), "kind": str(p.get("kind", ""))}
                for i, p in enumerate(parts)
                if isinstance(p, dict)
            ]
        }
    if kind == "cloze_math":
        # segments interleave prose and blanks: a list of strings where an empty
        # string marks where an input goes. Only the blank count and the prose
        # cross to the client; accepted answers stay server-side.
        segments = meta.get("segments")
        if isinstance(segments, list):
            return {"segments": [str(s) for s in segments]}
        return {"blank_count": int(meta.get("blank_count", 1) or 1)}
    if kind == "categorize_sort":
        # The items to place and the category buckets are presentation-only; the
        # correct item->category map stays server-side.
        return {
            "items": [str(x) for x in (meta.get("items") or [])],
            "categories": [str(x) for x in (meta.get("categories") or [])],
        }
    if kind == "drag_tokens":
        # The bank of tokens to arrange; the target expression is the answer key
        # and stays server-side.
        return {"tokens": [str(t) for t in (meta.get("tokens") or [])]}
    if kind == "number_line":
        return {
            "min": float(meta.get("min", -10)),
            "max": float(meta.get("max", 10)),
            "step": float(meta.get("step", 1)),
        }
    if kind == "table_completion":
        # display is the grid the learner sees, with blank cells as empty
        # strings; row/column headers label it. The answer grid stays server-side.
        return {
            "display": meta.get("display") or [],
            "row_headers": [str(x) for x in (meta.get("row_headers") or [])],
            "col_headers": [str(x) for x in (meta.get("col_headers") or [])],
        }
    return {}


def _now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


async def _resolve_source(
    session: AsyncSession, response: Response
) -> tuple[str, str, list | None, float | None, str, dict]:
    """Return (kind, correct, options, tolerance, explanation, meta) for a response."""
    if response.item_id is not None:
        item = (await session.execute(select(Item).where(Item.id == response.item_id))).scalar_one()
        return (
            item.kind,
            item.correct,
            item.options,
            item.tolerance,
            item.explanation,
            item.meta or {},
        )
    variant = (
        await session.execute(select(ItemVariant).where(ItemVariant.id == response.variant_id))
    ).scalar_one()
    template = (
        await session.execute(select(ItemTemplate).where(ItemTemplate.id == response.template_id))
    ).scalar_one()
    return template.kind, variant.answer, None, template.tolerance, template.explanation, {}


async def finalize_response_grade(
    session: AsyncSession, user_id: uuid.UUID, response: Response, student_answer: str
) -> dict:
    """Grade a response, persist the result, and update mastery and rewards.

    Shared by the inline path and the worker: it resolves the answer key, grades
    (free_response through the reasoning provider, everything else synchronously),
    writes the Score, grading record, reasoning trace, and step credits, advances
    the attempt, and applies mastery and gamification. It flushes; the caller
    commits, so it composes in either transaction.
    """
    kind, correct, options, tolerance, explanation, meta = await _resolve_source(session, response)

    if kind == "free_response":
        outcome = await grade_free_response(
            str(correct), student_answer, meta.get("rubric") or [], explanation=explanation
        )
    elif kind == "formal_proof":
        outcome = await grade_formal_proof(student_answer, meta, explanation=explanation)
    elif kind == "free_form_proof":
        outcome = await grade_free_form_proof(
            str(correct), student_answer, meta.get("rubric") or [], explanation=explanation
        )
    elif kind == "mixed":
        outcome = await grade_mixed(meta, student_answer, explanation=explanation)
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
            meta=meta,
        )

    response.answer = {"raw": student_answer}
    response.submitted_at = _now()
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

    # A formal proof that could not be machine-checked (no toolchain) is pending
    # manual review: it produces no mastery evidence, since it is neither a
    # verified pass nor a checked failure. Every other outcome updates mastery.
    pending_review = outcome.grader == "formal" and outcome.confidence == 0.0

    mastery: dict | None = None
    review: dict | None = None
    gamification: dict | None = None
    if not pending_review:
        # Weight the evidence by grader trust and route proof kinds to the
        # "prove" signal (Extension Section 8): a formally verified proof is
        # full-strength evidence of being able to prove the result.
        signal = "prove" if kind in ("formal_proof", "free_form_proof") else "apply"
        mastery = await apply_mastery(
            session,
            user_id,
            response.node_id,
            outcome.is_correct,
            response.id,
            signal=signal,
            grader=outcome.grader,
            grader_confidence=outcome.confidence,
        )
        # Spaced repetition: once a node is mastered, keep it on an SM-2 schedule
        # so it resurfaces at growing intervals (and sooner after a lapse).
        review = await schedule_review(
            session,
            user_id,
            response.node_id,
            is_correct=outcome.is_correct,
            score=outcome.score,
            mastery_level=mastery["level"],
        )
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
            node_id=response.node_id,
        )

    # Proof-technique transfer (Extension Section 8): a graded proof that uses a
    # technique is evidence toward that technique's mastery, in whatever course
    # it appears -- so competence transfers across courses. The item declares the
    # techniques it exercises in meta.techniques (technique-node codes). Pending
    # (unverified formal) proofs produce no evidence, here as elsewhere.
    technique_updates: list[dict] = []
    if not pending_review:
        for code in meta.get("techniques") or []:
            tech = (
                await session.execute(
                    select(KnowledgeNode).where(KnowledgeNode.code == str(code))
                )
            ).scalar_one_or_none()
            if tech is None:
                continue
            upd = await apply_mastery(
                session,
                user_id,
                tech.id,
                outcome.is_correct,
                response.id,
                signal="apply",
                grader=outcome.grader,
                grader_confidence=outcome.confidence,
            )
            technique_updates.append({"code": str(code), **upd})

    # Emit Caliper-style analytics events for the graded response and any mastery
    # change. Best-effort: recording an event must never break grading, so a
    # failure here is swallowed (the grade, score, and mastery are already set).
    try:
        await record_event(
            session,
            str(user_id),
            "Graded",
            "response",
            str(response.id),
            extensions={
                "kind": kind,
                "is_correct": outcome.is_correct,
                "score": outcome.score,
                "grader": outcome.grader,
                "node_id": str(response.node_id),
            },
        )
        if mastery is not None:
            await record_event(
                session,
                str(user_id),
                "MasteryChanged",
                "node",
                str(response.node_id),
                extensions={
                    "p_known_before": mastery["p_known_before"],
                    "p_known_after": mastery["p_known_after"],
                    "level": mastery["level"],
                    "signal": mastery.get("signal", "apply"),
                },
            )
    except Exception:
        pass

    # A worked solution attached to the item (meta.worked_solution) is shown
    # after the answer, but only after every step is re-verified against the CAS,
    # so a stored solution that has drifted out of correctness is withheld.
    worked_solution: list[str] | None = None
    raw_solution = meta.get("worked_solution") if isinstance(meta, dict) else None
    if isinstance(raw_solution, list) and raw_solution:
        check = verify_steps([str(step) for step in raw_solution])
        if check.ok:
            worked_solution = [step.text for step in check.steps]

    return {
        "is_correct": outcome.is_correct,
        "score": outcome.score,
        "grader": outcome.grader,
        "ai_graded": outcome.grader == "ai",
        # AI and pending-formal grades are the ones a teacher can override.
        "overridable": outcome.grader in ("ai", "formal"),
        "pending_review": pending_review,
        "confidence": outcome.confidence,
        "correct_answer": outcome.correct_display,
        "explanation": outcome.explanation,
        "step_credits": outcome.step_credits,
        "worked_solution": worked_solution,
        "mastery": mastery,
        "review": review,
        "gamification": gamification,
        "technique_transfer": technique_updates,
    }


async def grade_pending_response(session: AsyncSession, response_id: uuid.UUID) -> bool:
    """Grade a response that was queued for async grading. Idempotent.

    The worker calls this. It returns False (doing nothing) if the response is
    missing or already scored, so a re-delivered task never double-grades.
    """
    response = (
        await session.execute(select(Response).where(Response.id == response_id))
    ).scalar_one_or_none()
    if response is None:
        return False
    already = (
        await session.execute(select(Score).where(Score.response_id == response_id))
    ).scalar_one_or_none()
    if already is not None:
        return False
    raw = response.answer.get("raw", "") if isinstance(response.answer, dict) else ""
    await finalize_response_grade(session, response.user_id, response, raw)
    return True


async def answer(
    session: AsyncSession, user_id: uuid.UUID, response_token: str, student_answer: str
) -> dict:
    """Grade a served question and update mastery.

    Fast kinds grade inline and return the full result. free_response is AI
    graded, which can be slow with a real reasoning backend, so when async
    grading is enabled it is recorded and handed to the worker; the client then
    polls response_result. If the broker is unreachable it grades inline so an
    answer is never lost.
    """
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

    kind, *_rest = await _resolve_source(session, response)

    if kind == "free_response" and get_settings().async_grading:
        response.answer = {"raw": student_answer}
        response.submitted_at = _now()
        await session.commit()
        try:
            from app.worker.tasks import enqueue_grade

            enqueue_grade(response.id)
        except Exception:
            # Broker unavailable: grade inline so the answer is never lost.
            result = await finalize_response_grade(session, user_id, response, student_answer)
            await session.commit()
            result["status"] = "graded"
            return result
        return {
            "status": "grading",
            "response_token": str(response.id),
            "ai_graded": True,
            "message": "Your response is being graded.",
        }

    result = await finalize_response_grade(session, user_id, response, student_answer)
    await session.commit()
    result["status"] = "graded"
    return result


async def response_result(
    session: AsyncSession, user_id: uuid.UUID, response_token: str
) -> dict:
    """The grading status and result for one response, for polling async grades."""
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
    if response.submitted_at is None:
        return {"status": "unanswered"}

    score = (
        await session.execute(select(Score).where(Score.response_id == response_id))
    ).scalar_one_or_none()
    if score is None:
        return {"status": "grading", "response_token": str(response_id)}

    grading = (
        await session.execute(
            select(GradingRecord).where(GradingRecord.response_id == response_id)
        )
    ).scalar_one_or_none()
    credits = (
        (await session.execute(select(StepCredit).where(StepCredit.response_id == response_id)))
        .scalars()
        .all()
    )
    kind, correct, _options, _tol, explanation, _meta = await _resolve_source(session, response)
    grader = grading.grader if grading is not None else "exact"
    return {
        "status": "graded",
        "is_correct": score.is_correct,
        "score": score.score,
        "grader": grader,
        "ai_graded": grader == "ai",
        "overridable": grader == "ai",
        "confidence": grading.confidence if grading is not None else 1.0,
        "correct_answer": str(correct) if kind == "free_response" else "",
        "explanation": explanation,
        "step_credits": [
            {"milestone": c.milestone, "awarded": c.awarded, "note": c.note} for c in credits
        ],
    }


def _correct_display(kind: str, correct: str, options: list | None) -> str:
    """Render the answer key for a human. mcq_single stores an option index, so
    map it back to the option text; every other kind shows the stored value."""
    if kind == "mcq_single" and options:
        try:
            return options[int(correct)]
        except (ValueError, IndexError):
            return str(correct)
    return str(correct)


async def review_mistakes(
    session: AsyncSession, user_id: uuid.UUID, limit: int = 20
) -> list[dict]:
    """The learner's recent incorrect answers, with the correct answer and the
    explanation, so practice closes the loop into review."""
    rows = (
        await session.execute(
            select(Response, Score)
            .join(Score, Score.response_id == Response.id)
            .where(Response.user_id == user_id, Score.is_correct.is_(False))
            .order_by(Response.submitted_at.desc())
            .limit(limit)
        )
    ).all()

    out: list[dict] = []
    for response, _score in rows:
        if response.item_id is not None:
            item = (
                await session.execute(select(Item).where(Item.id == response.item_id))
            ).scalar_one_or_none()
            if item is None:
                continue
            prompt, kind, correct, options, explanation = (
                item.prompt,
                item.kind,
                item.correct,
                item.options,
                item.explanation,
            )
        else:
            variant = (
                await session.execute(
                    select(ItemVariant).where(ItemVariant.id == response.variant_id)
                )
            ).scalar_one_or_none()
            template = (
                await session.execute(
                    select(ItemTemplate).where(ItemTemplate.id == response.template_id)
                )
            ).scalar_one_or_none()
            if variant is None or template is None:
                continue
            prompt, kind, correct, options, explanation = (
                variant.prompt,
                template.kind,
                variant.answer,
                None,
                template.explanation,
            )

        node = (
            await session.execute(
                select(KnowledgeNode).where(KnowledgeNode.id == response.node_id)
            )
        ).scalar_one_or_none()
        your_answer = (
            response.answer.get("raw", "") if isinstance(response.answer, dict) else ""
        )
        out.append(
            {
                "response_id": str(response.id),
                "node_title": node.title if node is not None else "",
                "kind": kind,
                "prompt": prompt,
                "your_answer": your_answer,
                "correct_answer": _correct_display(kind, str(correct), options),
                "explanation": explanation,
                "submitted_at": response.submitted_at,
            }
        )
    return out
