"""
Phase 12.1 — Streaks + XP + achievements engine.

Single entry point: `record_activity(user_id, source, ref_kind=, ref_id=)`.
It updates daily streak, awards XP per source rule, evaluates achievements,
and returns a `RecordResult` so the caller can show "you earned X XP, you're
on a Y-day streak, you unlocked Z".

Per-source XP table is intentionally small; values were chosen so a learner
who does ~10 questions correctly with a 1-week streak earns ~150 XP/day
(level 1→2 at 100 XP, level 4→5 around 1600 XP).
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.engagement import (
    Achievement,
    EngagementState,
    UserAchievement,
    XpEvent,
)


# ---- source → xp policy ----------------------------------------------------

XP_RULES: dict[str, int] = {
    "question_correct": 10,
    "question_attempted": 2,
    "skill_mastered": 50,
    "mock_completed": 100,
    "mock_passed": 150,
    "review_due_completed": 8,
    "first_question_of_day": 15,
    "streak_day": 10,
    "live_session_attended": 25,
    "xr_session_completed": 25,
    "achievement_bonus": 0,        # populated dynamically
}


def level_for_xp(xp: int) -> int:
    """level = 1 + floor(sqrt(xp / 100)); 0xp = lvl 1, 100xp = lvl 2, 400xp = lvl 3."""
    if xp <= 0:
        return 1
    return 1 + int(math.sqrt(xp / 100))


@dataclass
class RecordResult:
    xp_awarded: int
    new_total_xp: int
    new_level: int
    leveled_up: bool
    streak_days: int
    streak_started_or_continued: bool
    streak_broken: bool
    new_achievements: list[str] = field(default_factory=list)


def _utc() -> datetime:
    return datetime.now(timezone.utc)


def _today() -> date:
    return _utc().date()


async def _get_or_create_state(db: AsyncSession, user_id: UUID) -> EngagementState:
    q = await db.execute(select(EngagementState).where(EngagementState.user_id == user_id))
    state = q.scalar_one_or_none()
    if state is None:
        state = EngagementState(user_id=user_id)
        db.add(state)
        await db.flush()
    return state


async def _evaluate_achievements(
    db: AsyncSession, *, user_id: UUID, state: EngagementState, source: str
) -> list[str]:
    """Award any active achievements whose trigger matches current state."""
    # Pull active achievements; check the ones the user hasn't earned yet.
    aq = await db.execute(select(Achievement).where(Achievement.is_active.is_(True)))
    active = list(aq.scalars().all())
    if not active:
        return []
    earned_q = await db.execute(
        select(UserAchievement.achievement_id).where(UserAchievement.user_id == user_id)
    )
    earned_ids = {row[0] for row in earned_q.all()}
    awarded: list[str] = []
    for ach in active:
        if ach.id in earned_ids:
            continue
        trig = ach.trigger_jsonb or {}
        if not _achievement_matches(trig, source=source, state=state):
            continue
        db.add(UserAchievement(
            user_id=user_id, achievement_id=ach.id,
            progress_jsonb={"streak": state.current_streak_days, "xp": state.xp},
        ))
        if ach.xp_reward:
            state.xp += ach.xp_reward
            db.add(XpEvent(
                user_id=user_id, source="achievement_bonus",
                xp_delta=ach.xp_reward, ref_kind="achievement", ref_id=ach.id,
            ))
        awarded.append(ach.slug)
    return awarded


def _achievement_matches(trigger: dict, *, source: str, state: EngagementState) -> bool:
    """Tiny rules engine. Each trigger has a 'kind' and operator-style fields."""
    if not trigger:
        return False
    kind = trigger.get("kind") or trigger.get("event")
    if kind == "streak_at_least":
        return state.current_streak_days >= int(trigger.get("min", 0))
    if kind == "xp_at_least":
        return state.xp >= int(trigger.get("min", 0))
    if kind == "level_at_least":
        return state.level >= int(trigger.get("min", 0))
    if kind == "source_count" and source == trigger.get("source"):
        # Caller is responsible for matching at the right source; we keep this
        # cheap and assume a count of 1 already qualifies (e.g. first mock).
        return True
    return False


async def record_activity(
    db: AsyncSession,
    *,
    user_id: UUID,
    source: str,
    ref_kind: Optional[str] = None,
    ref_id: Optional[UUID] = None,
    xp_override: Optional[int] = None,
) -> RecordResult:
    """Update streak, award XP, evaluate achievements, return a summary."""
    state = await _get_or_create_state(db, user_id)
    today = _today()
    streak_continued = False
    streak_broken = False

    if state.last_active_on is None:
        state.current_streak_days = 1
        streak_continued = True
    elif state.last_active_on == today:
        # Already counted today — no streak change.
        pass
    elif state.last_active_on == today - timedelta(days=1):
        state.current_streak_days += 1
        streak_continued = True
    else:
        # Gap of at least 1 day → streak resets.
        state.current_streak_days = 1
        streak_broken = True

    state.last_active_on = today
    if state.current_streak_days > state.longest_streak_days:
        state.longest_streak_days = state.current_streak_days

    xp_delta = xp_override if xp_override is not None else XP_RULES.get(source, 0)
    if streak_continued and source != "streak_day":
        # First activity of a continued streak gives a bonus.
        xp_delta += XP_RULES["streak_day"]
        db.add(XpEvent(
            user_id=user_id, source="streak_day", xp_delta=XP_RULES["streak_day"],
        ))

    if xp_delta:
        state.xp += xp_delta
        db.add(XpEvent(
            user_id=user_id, source=source, xp_delta=xp_delta,
            ref_kind=ref_kind, ref_id=ref_id,
        ))

    old_level = state.level
    new_level = level_for_xp(state.xp)
    leveled_up = new_level > old_level
    state.level = new_level

    new_achievements = await _evaluate_achievements(
        db, user_id=user_id, state=state, source=source,
    )
    # Re-derive level in case achievement bonuses pushed us higher.
    if state.level != level_for_xp(state.xp):
        state.level = level_for_xp(state.xp)
        leveled_up = state.level > old_level

    await db.commit()
    await db.refresh(state)
    return RecordResult(
        xp_awarded=xp_delta,
        new_total_xp=state.xp,
        new_level=state.level,
        leveled_up=leveled_up,
        streak_days=state.current_streak_days,
        streak_started_or_continued=streak_continued,
        streak_broken=streak_broken,
        new_achievements=new_achievements,
    )


async def leaderboard(
    db: AsyncSession, *, limit: int = 20, period_days: Optional[int] = None,
    org_id: Optional[UUID] = None,
) -> list[dict]:
    """Top-N learners by XP (overall, or in the trailing window).

    P2-8 tenancy: the board is always org-scoped (transitively via
    users.org_id); org_id=None matches only org-less learners, never all.
    Both variants respect the learner's show_on_leaderboard opt-in — the
    windowed query previously did not.
    """
    from app.models.user import User

    if period_days is None:
        q = (
            select(EngagementState)
            .join(User, User.id == EngagementState.user_id)
            .where(
                EngagementState.show_on_leaderboard.is_(True),
                User.org_id == org_id,
            )
            .order_by(EngagementState.xp.desc()).limit(limit)
        )
        rows = list((await db.execute(q)).scalars().all())
        return [
            {"user_id": str(r.user_id), "xp": r.xp, "level": r.level,
             "current_streak_days": r.current_streak_days}
            for r in rows
        ]
    since = _utc() - timedelta(days=period_days)
    q = (
        select(XpEvent.user_id, func.sum(XpEvent.xp_delta).label("xp_in_window"))
        .join(EngagementState, EngagementState.user_id == XpEvent.user_id)
        .where(
            XpEvent.occurred_at >= since,
            EngagementState.show_on_leaderboard.is_(True),
        )
    )
    q = q.join(User, User.id == XpEvent.user_id).where(User.org_id == org_id)
    q = (
        q.group_by(XpEvent.user_id)
        .order_by(func.sum(XpEvent.xp_delta).desc())
        .limit(limit)
    )
    res = await db.execute(q)
    return [
        {"user_id": str(uid), "xp_in_window": int(xp), "period_days": period_days}
        for uid, xp in res.all()
    ]
