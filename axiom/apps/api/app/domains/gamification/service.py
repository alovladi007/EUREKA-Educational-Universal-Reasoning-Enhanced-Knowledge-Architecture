"""Gamification service: XP, levels, streaks, and badges.

Every reward is anchored to a genuine learning event so the system cannot be
gamed by idling. XP is only granted when the practice flow reports a graded
outcome, and streaks advance on active practice days rather than clock time.

XP rules (all rewards come from real progress, never elapsed time):
  - correct answer          -> +10 XP, reason "correct"
  - reaching a new mastery level -> +25 XP, reason "level_up"
  - mastering a skill (top level) -> +50 XP, reason "mastery"

Level formula: level = 1 + xp_total // 100. Each 100 XP is one level, so the
learner starts at level 1 and climbs as verified progress accrues.

Service functions only flush; the caller (router or orchestrator) commits. This
keeps a whole practice-submission transaction atomic across services.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.attempts.models import Response, Score
from app.domains.curriculum.models import KnowledgeNode
from app.domains.gamification.models import (
    Badge,
    BadgeAward,
    GameProfile,
    Quest,
    QuestProgress,
    XpLedger,
)
from app.domains.notifications.service import notify

# Quests tied to skill-graph progress (Build prompt Section 12). Completing the
# target node's mastery completes the quest and awards its XP.
DEFAULT_QUESTS: list[dict] = [
    {"code": "master_prealg", "title": "Foundations Cleared",
     "description": "Master Pre-algebra.", "node_code": "PREALG", "xp_reward": 50},
    {"code": "master_alg1", "title": "Algebra Initiate",
     "description": "Master Algebra I.", "node_code": "ALG1", "xp_reward": 75},
    {"code": "master_introproof", "title": "Into the Proof",
     "description": "Master Introduction to Proof.", "node_code": "INTROPROOF", "xp_reward": 120},
]

# Badge catalogue seeded once per environment. Codes are stable identifiers the
# award logic keys on; names and descriptions are display strings.
DEFAULT_BADGES: list[dict] = [
    {
        "code": "first_correct",
        "name": "First Correct",
        "description": "Answered your first question correctly.",
    },
    {
        "code": "ten_correct",
        "name": "Getting Warmed Up",
        "description": "Answered 10 questions correctly.",
    },
    {
        "code": "hundred_correct",
        "name": "Century",
        "description": "Answered 100 questions correctly.",
    },
    {
        "code": "streak_3",
        "name": "Three Day Streak",
        "description": "Practiced 3 days in a row.",
    },
    {
        "code": "streak_7",
        "name": "Week Warrior",
        "description": "Practiced 7 days in a row.",
    },
    {
        "code": "level_5",
        "name": "Rising Star",
        "description": "Reached level 5.",
    },
    {
        "code": "first_mastery",
        "name": "First Mastery",
        "description": "Mastered your first skill.",
    },
]

# Badge code to display name, used for notification copy.
_BADGE_NAMES = {badge["code"]: badge["name"] for badge in DEFAULT_BADGES}


def _now() -> datetime:
    """Naive UTC to match the TIMESTAMP (without time zone) DB columns."""
    return datetime.now(UTC).replace(tzinfo=None)


def _level_for_xp(xp_total: int) -> int:
    """Level from total XP. Documented above: one level per 100 XP, base 1."""
    return 1 + xp_total // 100


async def seed_badges(session: AsyncSession) -> int:
    """Insert any DEFAULT_BADGES whose code is not already present.

    Idempotent so the orchestrator can call it on every startup without
    creating duplicates. Returns the number of badges newly inserted.
    """
    existing = set(
        (await session.execute(select(Badge.code))).scalars().all()
    )
    inserted = 0
    for spec in DEFAULT_BADGES:
        if spec["code"] in existing:
            continue
        session.add(
            Badge(
                code=spec["code"],
                name=spec["name"],
                description=spec["description"],
            )
        )
        inserted += 1
    if inserted:
        await session.flush()
    return inserted


async def _get_profile(session: AsyncSession, user_id: uuid.UUID) -> GameProfile:
    """Upsert-get the user's GameProfile, creating it with defaults if missing."""
    profile = (
        await session.execute(
            select(GameProfile).where(GameProfile.user_id == user_id)
        )
    ).scalar_one_or_none()
    if profile is None:
        profile = GameProfile(user_id=user_id)
        session.add(profile)
        await session.flush()
    return profile


async def award_xp(
    session: AsyncSession, user_id: uuid.UUID, amount: int, reason: str
) -> None:
    """Append an XP ledger row and roll the total/level forward on the profile.

    The ledger is append-only so the XP history is auditable; the profile is the
    current rollup. Flushes but does not commit.
    """
    session.add(XpLedger(user_id=user_id, amount=amount, reason=reason))
    profile = await _get_profile(session, user_id)
    profile.xp_total += amount
    profile.level = _level_for_xp(profile.xp_total)
    profile.updated_at = _now()
    await session.flush()


async def _award_badge(session: AsyncSession, user_id: uuid.UUID, code: str) -> bool:
    """Award the badge with this code once. Returns True only on a fresh award.

    Returns False if the badge code does not exist or the user already holds it,
    so callers can rely on True meaning "newly earned".
    """
    badge = (
        await session.execute(select(Badge).where(Badge.code == code))
    ).scalar_one_or_none()
    if badge is None:
        return False
    already = (
        await session.execute(
            select(BadgeAward).where(
                BadgeAward.user_id == user_id, BadgeAward.badge_id == badge.id
            )
        )
    ).scalar_one_or_none()
    if already is not None:
        return False
    session.add(BadgeAward(user_id=user_id, badge_id=badge.id))
    return True


async def _update_streak(session: AsyncSession, profile: GameProfile) -> None:
    """Advance the practice-day streak based on the calendar day of activity.

    Streaks track consecutive active days, not elapsed time: a second practice
    on the same day does nothing, a practice on the next day extends the streak,
    and any gap resets it to one.
    """
    today = datetime.now(UTC).date()
    if profile.last_active_on == today:
        return
    if profile.last_active_on == today - timedelta(days=1):
        profile.streak_days += 1
    else:
        profile.streak_days = 1
    profile.last_active_on = today


async def record_practice_result(
    session: AsyncSession,
    user_id: uuid.UUID,
    *,
    correct: bool,
    leveled_up: bool,
    mastered: bool,
    node_id: uuid.UUID | None = None,
) -> dict:
    """Apply all gamification effects of one graded practice response.

    This is the single entry point the practice flow calls after grading and
    mastery are computed. It advances the streak, awards XP for the reported
    progress, and evaluates every badge whose condition may have just been met.
    Flushes but does not commit; the caller owns the transaction.
    """
    profile = await _get_profile(session, user_id)
    await _update_streak(session, profile)

    if correct:
        await award_xp(session, user_id, 10, "correct")
    if leveled_up:
        await award_xp(session, user_id, 25, "level_up")
    if mastered:
        await award_xp(session, user_id, 50, "mastery")

    new_badges: list[str] = []

    # Correct-answer milestones are counted from the durable score records so the
    # thresholds reflect real answered history, not just this one response.
    correct_count = (
        await session.execute(
            select(func.count())
            .select_from(Score)
            .join(Response, Response.id == Score.response_id)
            .where(Response.user_id == user_id, Score.is_correct.is_(True))
        )
    ).scalar_one()

    if correct_count >= 1 and await _award_badge(session, user_id, "first_correct"):
        new_badges.append("first_correct")
    if correct_count >= 10 and await _award_badge(session, user_id, "ten_correct"):
        new_badges.append("ten_correct")
    if correct_count >= 100 and await _award_badge(session, user_id, "hundred_correct"):
        new_badges.append("hundred_correct")

    if profile.streak_days >= 3 and await _award_badge(session, user_id, "streak_3"):
        new_badges.append("streak_3")
    if profile.streak_days >= 7 and await _award_badge(session, user_id, "streak_7"):
        new_badges.append("streak_7")

    if profile.level >= 5 and await _award_badge(session, user_id, "level_5"):
        new_badges.append("level_5")

    if mastered and await _award_badge(session, user_id, "first_mastery"):
        new_badges.append("first_mastery")

    # Complete any skill-graph quests whose target node was just mastered.
    completed_quests: list[str] = []
    if mastered and node_id is not None:
        completed_quests = await _award_quests_for_node(session, user_id, node_id)

    # Alert the learner in their in-app inbox for each freshly earned badge.
    for code in new_badges:
        await notify(
            session,
            user_id,
            "badge",
            "Badge earned",
            _BADGE_NAMES.get(code, code),
            link="/achievements",
        )

    await session.flush()
    return {
        "xp_total": profile.xp_total,
        "level": profile.level,
        "streak_days": profile.streak_days,
        "new_badges": new_badges,
        "completed_quests": completed_quests,
    }


async def get_profile(session: AsyncSession, user_id: uuid.UUID) -> dict:
    """Return the learner's current rollup plus their earned badges."""
    profile = await _get_profile(session, user_id)
    rows = (
        await session.execute(
            select(BadgeAward, Badge)
            .join(Badge, Badge.id == BadgeAward.badge_id)
            .where(BadgeAward.user_id == user_id)
            .order_by(BadgeAward.created_at)
        )
    ).all()
    badges = [
        {
            "code": badge.code,
            "name": badge.name,
            "description": badge.description,
            "awarded_at": award.created_at,
        }
        for award, badge in rows
    ]
    return {
        "xp_total": profile.xp_total,
        "level": profile.level,
        "streak_days": profile.streak_days,
        "last_active_on": (
            profile.last_active_on.isoformat() if profile.last_active_on else None
        ),
        "badges": badges,
    }


async def leaderboard(session: AsyncSession, limit: int = 10) -> list[dict]:
    """Top OPTED-IN learners by total XP (Build prompt Section 12: opt-in
    leaderboards). Only profiles with leaderboard_opt_in are listed, and each is
    shown under its display_alias so a real name is never exposed without the
    learner setting one; a blank alias falls back to a generic "Learner"."""
    rows = (
        await session.execute(
            select(GameProfile)
            .where(GameProfile.leaderboard_opt_in.is_(True))
            .order_by(GameProfile.xp_total.desc())
            .limit(limit)
        )
    ).scalars().all()
    return [
        {
            "user_id": str(profile.user_id),
            "name": profile.display_alias or "Learner",
            "avatar": profile.avatar,
            "xp_total": profile.xp_total,
            "level": profile.level,
        }
        for profile in rows
    ]


async def set_preferences(
    session: AsyncSession,
    user_id: uuid.UUID,
    *,
    leaderboard_opt_in: bool | None = None,
    display_alias: str | None = None,
    avatar: str | None = None,
) -> dict:
    """Update the learner's gamification preferences (opt-in, alias, avatar).

    Only provided fields change. Returns the current preference snapshot. The
    caller commits.
    """
    profile = await _get_profile(session, user_id)
    if leaderboard_opt_in is not None:
        profile.leaderboard_opt_in = bool(leaderboard_opt_in)
    if display_alias is not None:
        profile.display_alias = display_alias.strip()[:60] or None
    if avatar is not None:
        profile.avatar = avatar.strip()[:32]
    profile.updated_at = _now()
    await session.flush()
    return {
        "leaderboard_opt_in": profile.leaderboard_opt_in,
        "display_alias": profile.display_alias,
        "avatar": profile.avatar,
    }


async def seed_quests(session: AsyncSession) -> int:
    """Insert any DEFAULT_QUESTS whose code is not already present. Idempotent."""
    existing = set((await session.execute(select(Quest.code))).scalars().all())
    inserted = 0
    for spec in DEFAULT_QUESTS:
        if spec["code"] in existing:
            continue
        session.add(Quest(**spec))
        inserted += 1
    if inserted:
        await session.flush()
    return inserted


async def _award_quests_for_node(
    session: AsyncSession, user_id: uuid.UUID, node_id: uuid.UUID
) -> list[str]:
    """Complete and reward any quests whose target node was just mastered."""
    node = (
        await session.execute(select(KnowledgeNode).where(KnowledgeNode.id == node_id))
    ).scalar_one_or_none()
    if node is None:
        return []
    quests = (
        (await session.execute(select(Quest).where(Quest.node_code == node.code)))
        .scalars()
        .all()
    )
    completed: list[str] = []
    for quest in quests:
        progress = (
            await session.execute(
                select(QuestProgress).where(
                    QuestProgress.user_id == user_id, QuestProgress.quest_id == quest.id
                )
            )
        ).scalar_one_or_none()
        if progress is None:
            progress = QuestProgress(user_id=user_id, quest_id=quest.id, status="active")
            session.add(progress)
        if progress.status == "completed":
            continue
        progress.status = "completed"
        progress.completed_at = _now()
        await award_xp(session, user_id, quest.xp_reward, "quest")
        await notify(session, user_id, "quest", "Quest complete", quest.title, link="/achievements")
        completed.append(quest.code)
    if completed:
        await session.flush()
    return completed


async def list_quests(session: AsyncSession, user_id: uuid.UUID) -> list[dict]:
    """All quests with this learner's completion status."""
    quests = (await session.execute(select(Quest).order_by(Quest.xp_reward))).scalars().all()
    progress_rows = (
        (await session.execute(select(QuestProgress).where(QuestProgress.user_id == user_id)))
        .scalars()
        .all()
    )
    status_by_quest = {p.quest_id: p.status for p in progress_rows}
    return [
        {
            "code": q.code,
            "title": q.title,
            "description": q.description,
            "node_code": q.node_code,
            "xp_reward": q.xp_reward,
            "status": status_by_quest.get(q.id, "active"),
        }
        for q in quests
    ]
