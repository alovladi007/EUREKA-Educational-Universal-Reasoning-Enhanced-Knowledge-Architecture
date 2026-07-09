"""Gamification ORM models.

Rewards are tied to genuine learning progress (correct responses and mastery
gains), not raw time, so the system cannot be gamed by idling. XP is an
append-only ledger; the GameProfile is the current rollup (total, level,
streak). Badges are awarded once per user.
"""

from __future__ import annotations

import uuid
from datetime import UTC, date, datetime

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
    Uuid,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


def _uuid() -> uuid.UUID:
    return uuid.uuid4()


def _now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


class GameProfile(Base):
    __tablename__ = "game_profiles"
    __table_args__ = (UniqueConstraint("user_id", name="uq_game_profile_user"),)

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    xp_total: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    level: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    streak_days: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_active_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    # Leaderboards are opt-in (Build prompt Section 12: "opt-in class
    # leaderboards"). A learner is only listed after opting in, and then under
    # display_alias if set (so real names are never exposed without consent).
    leaderboard_opt_in: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default="false"
    )
    display_alias: Mapped[str | None] = mapped_column(String(60), nullable=True)
    # An avatar preset key or emoji the learner picks for their profile.
    avatar: Mapped[str] = mapped_column(String(32), nullable=False, default="", server_default="")
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=_now)


class XpLedger(Base):
    __tablename__ = "xp_ledger"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    amount: Mapped[int] = mapped_column(Integer, nullable=False)
    reason: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_now)


class Badge(Base):
    __tablename__ = "badges"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    code: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(300), nullable=False, default="")


class BadgeAward(Base):
    __tablename__ = "badge_awards"
    __table_args__ = (UniqueConstraint("user_id", "badge_id", name="uq_badge_award"),)

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    badge_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("badges.id", ondelete="CASCADE"), index=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_now)


class Quest(Base):
    """A quest tied to skill-graph progress (Build prompt Section 12: "quests
    tied to skill-graph progress"). Completing the target node's mastery awards
    the quest's XP, keeping rewards anchored to genuine learning rather than time.
    """

    __tablename__ = "quests"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    code: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str] = mapped_column(String(400), nullable=False, default="")
    # The knowledge-node code whose mastery completes the quest.
    node_code: Mapped[str] = mapped_column(String(64), nullable=False)
    xp_reward: Mapped[int] = mapped_column(Integer, nullable=False, default=50)


class QuestProgress(Base):
    __tablename__ = "quest_progress"
    __table_args__ = (UniqueConstraint("user_id", "quest_id", name="uq_quest_progress"),)

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    quest_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("quests.id", ondelete="CASCADE"), index=True
    )
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="active")
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
