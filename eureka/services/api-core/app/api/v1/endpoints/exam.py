"""
Exam realism + analytics endpoints — Phase 7 Sessions 7.2 + 7.3 + 7.4 + 7.5.

Mounted under /api/v1.

Attempts (raw practice attempts)
  POST   /attempts                                record a practice attempt
  GET    /attempts/me                              list current user's attempts

IRT calibration
  POST   /irt/calibrate                            re-fit 2-PL from attempt_logs

Blueprints (mock-exam templates)
  POST   /exam-blueprints                          create
  GET    /exam-blueprints                          list
  GET    /exam-blueprints/{slug}                   get

Mock attempts
  POST   /mock-attempts                            start a mock (creates items)
  GET    /mock-attempts/me                         list mine
  GET    /mock-attempts/{id}                       fetch one
  POST   /mock-attempts/{id}/answer                submit one item answer
  POST   /mock-attempts/{id}/submit                finalise + score

Analytics
  GET    /analytics/me/skills                      per-skill aggregates
  GET    /analytics/me/strengths-weaknesses        bucketed top/bottom
  GET    /analytics/missed-by-passers              the UWorld feature

Spaced repetition (7.5)
  GET    /spaced-repetition/me/due                 items due today
  POST   /spaced-repetition/me/rate                rate after a review
"""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.exam import (
    AttemptLog, ExamBlueprint, MockAttempt, MockAttemptItem, MockAttemptStatus,
)
from app.models.item_bank import Item
from app.models.user import User
from app.schemas.exam import (
    AttemptLogIn, AttemptLogResponse, BlueprintCreate, BlueprintResponse,
    CalibrateResponse, FsrsRateRequest, MockAnswerRequest, MockAttemptResponse,
)
from app.services.analytics import (
    most_missed_by_passers, per_skill, schedule_next_review,
    strengths_weaknesses, due_today,
)
from app.services.irt import calibrate
from app.services.mock_exam import (
    score_submitted, start_attempt as start_mock_attempt, submit_answer,
)
from app.utils.dependencies import get_current_user


router = APIRouter()


# ---------------------------------------------------------------------------
# Practice attempts (the raw signal everything else fits over)
# ---------------------------------------------------------------------------


@router.post("/attempts", response_model=AttemptLogResponse, status_code=201)
async def record_attempt(
    payload: AttemptLogIn,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AttemptLog:
    item = await db.get(Item, payload.item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="item not found")

    # Auto-grade if caller didn't supply is_correct
    is_correct = payload.is_correct
    if is_correct is None:
        correct = (item.content or {}).get("correct_index")
        if payload.answer_index is not None and correct is not None:
            is_correct = int(payload.answer_index) == int(correct)
        else:
            is_correct = False

    row = AttemptLog(
        user_id=current_user.id,
        item_id=payload.item_id,
        answer_index=payload.answer_index,
        answer_value=payload.answer_value,
        is_correct=is_correct,
        time_taken_ms=payload.time_taken_ms,
        hints_used=payload.hints_used,
        max_hint_level=payload.max_hint_level,
        source=payload.source,
        agent_session_id=payload.agent_session_id,
    )
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


@router.get("/attempts/me", response_model=list[AttemptLogResponse])
async def list_my_attempts(
    limit: int = Query(50, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[AttemptLog]:
    r = await db.execute(
        select(AttemptLog)
        .where(AttemptLog.user_id == current_user.id)
        .order_by(AttemptLog.created_at.desc())
        .limit(limit)
    )
    return list(r.scalars().all())


# ---------------------------------------------------------------------------
# IRT calibration
# ---------------------------------------------------------------------------


@router.post("/irt/calibrate", response_model=CalibrateResponse)
async def run_calibration(
    min_attempts: int = Query(3, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> CalibrateResponse:
    """
    Re-fit 2-PL parameters on every item with ≥ min_attempts. Writes back
    to items.irt_*. Admin-ish operation; auth-gate it role-wise in Phase 9.
    """
    result = await calibrate(db, min_attempts_per_item=min_attempts)
    await db.commit()
    return CalibrateResponse(
        items_calibrated=len(result.items),
        learners_with_theta=len(result.thetas),
        iterations=result.iterations,
        log_likelihood=result.log_likelihood,
    )


# ---------------------------------------------------------------------------
# Blueprints
# ---------------------------------------------------------------------------


@router.post("/exam-blueprints", response_model=BlueprintResponse, status_code=201)
async def create_blueprint(
    payload: BlueprintCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ExamBlueprint:
    bp = ExamBlueprint(
        slug=payload.slug,
        name=payload.name,
        description=payload.description,
        bank_slugs=payload.bank_slugs,
        skill_weights=payload.skill_weights,
        item_count=payload.item_count,
        time_limit_min=payload.time_limit_min,
        score_mapping=payload.score_mapping,
        pass_threshold_scaled=payload.pass_threshold_scaled,
        difficulty_b_range=payload.difficulty_b_range,
        created_by=current_user.id,
    )
    db.add(bp)
    try:
        await db.commit()
    except Exception as exc:
        await db.rollback()
        if "exam_blueprints_slug_key" in str(exc) or "duplicate key" in str(exc):
            raise HTTPException(status_code=409, detail="slug already in use") from exc
        raise
    await db.refresh(bp)
    return bp


@router.get("/exam-blueprints", response_model=list[BlueprintResponse])
async def list_blueprints(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> list[ExamBlueprint]:
    r = await db.execute(
        select(ExamBlueprint).where(ExamBlueprint.is_active.is_(True)).order_by(ExamBlueprint.slug)
    )
    return list(r.scalars().all())


@router.get("/exam-blueprints/{slug}", response_model=BlueprintResponse)
async def get_blueprint(
    slug: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> ExamBlueprint:
    r = await db.execute(select(ExamBlueprint).where(ExamBlueprint.slug == slug))
    bp = r.scalar_one_or_none()
    if bp is None:
        raise HTTPException(status_code=404, detail="blueprint not found")
    return bp


# ---------------------------------------------------------------------------
# Mock attempts
# ---------------------------------------------------------------------------


@router.post("/mock-attempts", response_model=MockAttemptResponse, status_code=201)
async def start_mock(
    blueprint_slug: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MockAttempt:
    bp_q = await db.execute(select(ExamBlueprint).where(ExamBlueprint.slug == blueprint_slug))
    bp = bp_q.scalar_one_or_none()
    if bp is None:
        raise HTTPException(status_code=404, detail="blueprint not found")
    return await start_mock_attempt(db, user_id=current_user.id, blueprint=bp)


@router.get("/mock-attempts/me", response_model=list[MockAttemptResponse])
async def list_my_mocks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[MockAttempt]:
    r = await db.execute(
        select(MockAttempt)
        .where(MockAttempt.user_id == current_user.id)
        .order_by(MockAttempt.started_at.desc())
        .limit(50)
    )
    return list(r.scalars().all())


@router.get("/mock-attempts/{attempt_id}", response_model=MockAttemptResponse)
async def get_mock(
    attempt_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MockAttempt:
    a = await db.get(MockAttempt, attempt_id)
    if a is None or a.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="not found")
    return a


@router.get("/mock-attempts/{attempt_id}/items", response_model=list[dict])
async def get_mock_items(
    attempt_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[dict]:
    a = await db.get(MockAttempt, attempt_id)
    if a is None or a.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="not found")
    r = await db.execute(
        text("""
            SELECT mai.item_id, mai.position, mai.answer_index, mai.is_correct,
                   mai.flagged, mai.time_taken_ms,
                   i.content, i.kind::text, i.explanation
            FROM mock_attempt_items mai
            JOIN items i ON i.id = mai.item_id
            WHERE mai.mock_attempt_id = :id
            ORDER BY mai.position
        """),
        {"id": str(attempt_id)},
    )
    out = []
    show_answers = a.status == MockAttemptStatus.SUBMITTED
    for row in r.mappings():
        content = dict(row["content"] or {})
        if not show_answers and "correct_index" in content:
            del content["correct_index"]  # hide answer until submission
        out.append({
            "item_id": str(row["item_id"]),
            "position": row["position"],
            "kind": row["kind"],
            "content": content,
            "answer_index": row["answer_index"],
            "is_correct": row["is_correct"] if show_answers else None,
            "explanation": row["explanation"] if show_answers else None,
            "flagged": row["flagged"],
        })
    return out


@router.post("/mock-attempts/{attempt_id}/answer", response_model=dict)
async def answer_mock_item(
    attempt_id: UUID,
    payload: MockAnswerRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    a = await db.get(MockAttempt, attempt_id)
    if a is None or a.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="not found")
    if a.status != MockAttemptStatus.IN_PROGRESS:
        raise HTTPException(status_code=400, detail="attempt not in progress")
    if datetime.utcnow() > a.deadline_at:
        a.status = MockAttemptStatus.EXPIRED
        await db.commit()
        raise HTTPException(status_code=400, detail="attempt has expired")

    return await submit_answer(
        db,
        attempt=a,
        item_id=payload.item_id,
        answer_index=payload.answer_index,
        answer_value=payload.answer_value,
        time_taken_ms=payload.time_taken_ms,
        flagged=payload.flagged,
    )


@router.post("/mock-attempts/{attempt_id}/submit", response_model=MockAttemptResponse)
async def submit_mock(
    attempt_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MockAttempt:
    a = await db.get(MockAttempt, attempt_id)
    if a is None or a.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="not found")
    bp = await db.get(ExamBlueprint, a.blueprint_id)
    if bp is None:
        raise HTTPException(status_code=404, detail="blueprint missing")
    return await score_submitted(db, attempt=a, blueprint=bp)


# ---------------------------------------------------------------------------
# Analytics
# ---------------------------------------------------------------------------


@router.get("/analytics/me/skills", response_model=list[dict])
async def my_skill_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[dict]:
    rows = await per_skill(db, current_user.id)
    return [r.to_dict() for r in rows]


@router.get("/analytics/me/strengths-weaknesses", response_model=dict)
async def my_strengths_weaknesses(
    k: int = Query(5, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    out = await strengths_weaknesses(db, current_user.id, k=k)
    return {
        "strongest": [s.to_dict() for s in out.strongest],
        "weakest": [s.to_dict() for s in out.weakest],
    }


@router.get("/analytics/missed-by-passers", response_model=list[dict])
async def missed_by_passers(
    blueprint_slug: str,
    k: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[dict]:
    """The UWorld 'most-missed by passers' comparator."""
    bp_q = await db.execute(select(ExamBlueprint).where(ExamBlueprint.slug == blueprint_slug))
    bp = bp_q.scalar_one_or_none()
    if bp is None:
        raise HTTPException(status_code=404, detail="blueprint not found")
    entries = await most_missed_by_passers(
        db, blueprint_id=bp.id, learner_user_id=current_user.id, k=k,
    )
    return [
        {
            "skill_id": str(e.skill_id),
            "framework": e.framework,
            "code": e.code,
            "name": e.name,
            "miss_rate_by_passers": round(e.miss_rate_by_passers, 3),
            "your_miss_rate": round(e.your_miss_rate, 3) if e.your_miss_rate is not None else None,
            "your_attempts": e.your_attempts,
            "n_passers_sampled": e.n_passers_sampled,
        }
        for e in entries
    ]


# ---------------------------------------------------------------------------
# Spaced repetition (7.5)
# ---------------------------------------------------------------------------


@router.get("/spaced-repetition/me/due", response_model=list[dict])
async def due_items(
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[dict]:
    return await due_today(db, current_user.id, limit=limit)


@router.post("/spaced-repetition/me/rate", response_model=dict)
async def rate_skill(
    payload: FsrsRateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """After a review, learner rates how it went; we schedule next review."""
    result = await schedule_next_review(
        db, user_id=current_user.id, skill_id=payload.skill_id, rating=payload.rating
    )
    await db.commit()
    return result
