"""
Phase 12.3 — Adaptive study plan generator (v1).

Given (user, framework, target_date, daily_target_minutes), output a
week-by-week schedule of:

    - target_skill_codes  (ranked by current mastery_gap × prereq_readiness)
    - target_item_count   (derived from daily_target_minutes × ~7 days)
    - target_minutes
    - is_diagnostic_week  (first week, takes a placement test)
    - is_mock_week        (every 4th week and the final week)
    - is_review_week      (penultimate week)

It also picks `recommended_item_ids` per week by pulling items tagged to that
week's skills from the existing Phase 5 item bank. The plan is regenerated
each time the endpoint is hit so it reflects the learner's current mastery.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.engagement import StudyPlan, StudyPlanStatus, StudyPlanWeek
from app.models.item_bank import Item
from app.models.skill import (
    ContentSkill,
    LearnerSkillMastery,
    Skill,
    SkillPrerequisite,
)


# ---------------------------------------------------------------------------
# Inputs / outputs
# ---------------------------------------------------------------------------


@dataclass
class WeekPlan:
    week_index: int
    starts_on: date
    ends_on: date
    target_skill_codes: list[str]
    target_item_count: int
    target_minutes: int
    is_diagnostic_week: bool = False
    is_mock_week: bool = False
    is_review_week: bool = False
    recommended_item_ids: list[UUID] = field(default_factory=list)


def _utc() -> datetime:
    return datetime.now(timezone.utc)


def _monday(d: date) -> date:
    return d - timedelta(days=d.weekday())


def _weeks_between(start: date, end: date) -> int:
    if end <= start:
        return 1
    return max(1, math.ceil((end - start).days / 7))


# ---------------------------------------------------------------------------
# Skill scoring
# ---------------------------------------------------------------------------


async def _candidate_skills(
    db: AsyncSession, *, user_id: UUID, framework: str
) -> list[tuple[Skill, float]]:
    """Return (skill, score) pairs ranked by mastery_gap × prereq_readiness."""
    # Normalise framework — skill_framework enum is lowercase (usmle, ccss, ...).
    fw = framework.lower()
    sq = await db.execute(
        select(Skill).where(Skill.framework == fw).order_by(Skill.code)
    )
    skills = list(sq.scalars().all())
    if not skills:
        return []

    mastery_q = await db.execute(
        select(LearnerSkillMastery.skill_id, LearnerSkillMastery.mastery)
        .where(LearnerSkillMastery.user_id == user_id)
    )
    mastery = {sid: float(m or 0.0) for sid, m in mastery_q.all()}

    prereq_q = await db.execute(select(SkillPrerequisite))
    prereqs: dict[UUID, list[UUID]] = {}
    for row in prereq_q.scalars().all():
        prereqs.setdefault(row.successor_id, []).append(row.prerequisite_id)

    scored: list[tuple[Skill, float]] = []
    for sk in skills:
        cur = mastery.get(sk.id, 0.0)
        gap = max(0.0, 1.0 - cur)
        prereq_ids = prereqs.get(sk.id, [])
        if prereq_ids:
            readiness = sum(mastery.get(pid, 0.0) for pid in prereq_ids) / len(prereq_ids)
        else:
            readiness = 1.0
        score = gap * (0.5 + readiness)  # avoid zero-out when no prereqs known
        if cur >= 0.95:
            continue  # already mastered — skip
        scored.append((sk, score))

    scored.sort(key=lambda x: x[1], reverse=True)
    return scored


async def _items_for_skills(
    db: AsyncSession, *, skill_ids: list[UUID], max_items: int
) -> list[UUID]:
    if not skill_ids or max_items <= 0:
        return []
    q = await db.execute(
        select(Item.id, ContentSkill.skill_id)
        .join(ContentSkill, ContentSkill.content_id == Item.id)
        .where(ContentSkill.skill_id.in_(skill_ids))
        .limit(max_items * 3)
    )
    seen: set[UUID] = set()
    out: list[UUID] = []
    for item_id, _ in q.all():
        if item_id in seen:
            continue
        seen.add(item_id)
        out.append(item_id)
        if len(out) >= max_items:
            break
    return out


# ---------------------------------------------------------------------------
# Plan generation
# ---------------------------------------------------------------------------


async def generate(
    db: AsyncSession,
    *,
    user_id: UUID,
    tier: str,
    framework: str,
    target_date: date,
    daily_target_minutes: int = 60,
    target_mastery: float = 0.80,
    exam: Optional[str] = None,
    start_on: Optional[date] = None,
) -> tuple[StudyPlan, list[WeekPlan]]:
    start = start_on or _monday(_utc().date())
    total_weeks = _weeks_between(start, target_date)
    weekly_minutes = daily_target_minutes * 7
    # Empirical: ~2 minutes per item average.
    items_per_week = max(5, weekly_minutes // 2)

    candidates = await _candidate_skills(db, user_id=user_id, framework=framework)
    # Spread skills across weeks — round-robin in their priority order so each
    # week gets a mix rather than all the hardest skills in week 1.
    weeks: list[WeekPlan] = []
    skills_per_week = max(2, min(6, math.ceil(len(candidates) / max(total_weeks, 1))))
    pointer = 0

    for w in range(total_weeks):
        starts_on = start + timedelta(weeks=w)
        ends_on = starts_on + timedelta(days=6)
        is_diagnostic = (w == 0)
        is_mock = ((w + 1) % 4 == 0) or (w == total_weeks - 1)
        is_review = (w == total_weeks - 2) and total_weeks >= 3

        if candidates:
            picks: list[tuple[Skill, float]] = []
            for _ in range(skills_per_week):
                if pointer >= len(candidates):
                    pointer = 0
                picks.append(candidates[pointer])
                pointer += 1
            week_skill_codes = [p[0].code for p in picks]
            week_skill_ids = [p[0].id for p in picks]
        else:
            week_skill_codes = []
            week_skill_ids = []

        rec_items = await _items_for_skills(
            db, skill_ids=week_skill_ids, max_items=items_per_week,
        )
        weeks.append(WeekPlan(
            week_index=w,
            starts_on=starts_on, ends_on=ends_on,
            target_skill_codes=week_skill_codes,
            target_item_count=items_per_week,
            target_minutes=weekly_minutes,
            is_diagnostic_week=is_diagnostic,
            is_mock_week=is_mock,
            is_review_week=is_review,
            recommended_item_ids=rec_items,
        ))

    # Archive any prior active plan for this user/framework.
    existing_q = await db.execute(
        select(StudyPlan).where(
            StudyPlan.user_id == user_id,
            StudyPlan.framework == framework,
            StudyPlan.status == StudyPlanStatus.active.value,
        )
    )
    for old in existing_q.scalars().all():
        old.status = StudyPlanStatus.archived.value

    plan = StudyPlan(
        user_id=user_id, tier=tier, framework=framework, exam=exam,
        target_date=target_date,
        daily_target_minutes=daily_target_minutes,
        target_mastery=target_mastery,
        status=StudyPlanStatus.active.value,
        generated_jsonb=[
            {
                "week_index": w.week_index,
                "starts_on": w.starts_on.isoformat(),
                "ends_on": w.ends_on.isoformat(),
                "target_skill_codes": w.target_skill_codes,
                "is_diagnostic_week": w.is_diagnostic_week,
                "is_mock_week": w.is_mock_week,
                "is_review_week": w.is_review_week,
                "target_item_count": w.target_item_count,
                "target_minutes": w.target_minutes,
            }
            for w in weeks
        ],
        generator_version="v1",
    )
    db.add(plan)
    await db.flush()

    for w in weeks:
        db.add(StudyPlanWeek(
            plan_id=plan.id, week_index=w.week_index,
            starts_on=w.starts_on, ends_on=w.ends_on,
            target_skill_codes=w.target_skill_codes,
            target_item_count=w.target_item_count,
            target_minutes=w.target_minutes,
            is_diagnostic_week=w.is_diagnostic_week,
            is_mock_week=w.is_mock_week,
            is_review_week=w.is_review_week,
            recommended_item_ids=w.recommended_item_ids,
        ))
    await db.commit()
    await db.refresh(plan)
    return plan, weeks


async def current_plan(
    db: AsyncSession, *, user_id: UUID
) -> Optional[StudyPlan]:
    q = await db.execute(
        select(StudyPlan).where(
            StudyPlan.user_id == user_id,
            StudyPlan.status == StudyPlanStatus.active.value,
        ).order_by(StudyPlan.created_at.desc()).limit(1)
    )
    return q.scalar_one_or_none()
