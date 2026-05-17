"""
Phase 11.4 — Onboarding state machine.

Linear pipeline:

    created
        → tier_selected
            → goal_set
                → placement_taken
                    → first_recommendation_shown
                        → first_question_attempted
                            → first_session_complete
                                → fully_onboarded

Each step transition updates `onboarding_states` + appends an
`onboarding_events` row. Time-to-step is the basis for the
"first-15-minute experience" metric.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.gtm import OnboardingEvent, OnboardingState, OnboardingStep


_ORDER = [
    OnboardingStep.created.value,
    OnboardingStep.tier_selected.value,
    OnboardingStep.goal_set.value,
    OnboardingStep.placement_taken.value,
    OnboardingStep.first_recommendation_shown.value,
    OnboardingStep.first_question_attempted.value,
    OnboardingStep.first_session_complete.value,
    OnboardingStep.fully_onboarded.value,
]


def _utc() -> datetime:
    return datetime.now(timezone.utc)


async def ensure_state(db: AsyncSession, *, user_id: UUID) -> OnboardingState:
    """Idempotent: create the onboarding row if missing."""
    q = await db.execute(select(OnboardingState).where(OnboardingState.user_id == user_id))
    state = q.scalar_one_or_none()
    if state is None:
        state = OnboardingState(user_id=user_id, current_step=OnboardingStep.created.value)
        db.add(state)
        db.add(OnboardingEvent(user_id=user_id, step=OnboardingStep.created.value, kind="entered"))
        await db.commit()
        await db.refresh(state)
    return state


async def advance_to(
    db: AsyncSession,
    *,
    user_id: UUID,
    step: str,
    extra: Optional[dict] = None,
) -> OnboardingState:
    """Move the learner to `step`. No-op if already past that step."""
    state = await ensure_state(db, user_id=user_id)
    if step not in _ORDER:
        raise ValueError(f"unknown step: {step}")
    target_idx = _ORDER.index(step)
    current_idx = _ORDER.index(state.current_step)
    if target_idx <= current_idx:
        return state

    state.current_step = step
    history = list(state.step_history or [])
    history.append({"step": step, "at": _utc().isoformat()})
    state.step_history = history

    now = _utc()
    if step == OnboardingStep.first_recommendation_shown.value and state.first_recommendation_at is None:
        state.first_recommendation_at = now
    elif step == OnboardingStep.first_question_attempted.value and state.first_attempt_at is None:
        state.first_attempt_at = now
    elif step == OnboardingStep.first_session_complete.value and state.first_session_at is None:
        state.first_session_at = now
    elif step == OnboardingStep.fully_onboarded.value and state.completed_at is None:
        state.completed_at = now

    db.add(OnboardingEvent(user_id=user_id, step=step, kind="entered", extra=extra or {}))
    await db.commit()
    await db.refresh(state)
    return state


async def set_goal(
    db: AsyncSession,
    *,
    user_id: UUID,
    tier: Optional[str] = None,
    exam: Optional[str] = None,
    goal: Optional[str] = None,
    target_date: Optional[str] = None,
) -> OnboardingState:
    state = await ensure_state(db, user_id=user_id)
    if tier:
        state.chosen_tier = tier
    if exam:
        state.chosen_exam = exam
    if goal:
        state.chosen_goal = goal
    if target_date:
        from datetime import date as _date
        state.target_date = _date.fromisoformat(target_date)
    # Auto-advance to goal_set if we have at least tier or exam.
    if tier or exam or goal:
        if _ORDER.index(state.current_step) < _ORDER.index(OnboardingStep.goal_set.value):
            state.current_step = OnboardingStep.goal_set.value
            history = list(state.step_history or [])
            history.append({"step": state.current_step, "at": _utc().isoformat()})
            state.step_history = history
            db.add(OnboardingEvent(user_id=user_id, step=OnboardingStep.goal_set.value, kind="entered"))
    await db.commit()
    await db.refresh(state)
    return state


def time_to_first_value(state: OnboardingState) -> Optional[float]:
    """Seconds from started_at → first_attempt_at (or None)."""
    if state.first_attempt_at and state.started_at:
        return (state.first_attempt_at - state.started_at).total_seconds()
    return None
