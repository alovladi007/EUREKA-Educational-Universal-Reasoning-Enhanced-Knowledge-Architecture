"""gamification breadth: opt-in leaderboard, avatars, quests

Adds opt-in leaderboard consent, a display alias, and an avatar to game_profiles,
and the quests / quest_progress tables for skill-graph-tied quests (Build prompt
Section 12). Hand-written for zero schema drift.

Revision ID: 0017_gamification_breadth
Revises: 0016_analytics_events
Create Date: 2026-07-08 13:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0017_gamification_breadth"
down_revision: str | None = "0016_analytics_events"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "game_profiles",
        sa.Column(
            "leaderboard_opt_in", sa.Boolean(), nullable=False, server_default="false"
        ),
    )
    op.add_column("game_profiles", sa.Column("display_alias", sa.String(length=60), nullable=True))
    op.add_column(
        "game_profiles",
        sa.Column("avatar", sa.String(length=32), nullable=False, server_default=""),
    )

    op.create_table(
        "quests",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("code", sa.String(length=64), nullable=False, unique=True),
        sa.Column("title", sa.String(length=160), nullable=False),
        sa.Column("description", sa.String(length=400), nullable=False, server_default=""),
        sa.Column("node_code", sa.String(length=64), nullable=False),
        sa.Column("xp_reward", sa.Integer(), nullable=False, server_default="50"),
    )

    op.create_table(
        "quest_progress",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column(
            "user_id",
            sa.Uuid(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "quest_id",
            sa.Uuid(),
            sa.ForeignKey("quests.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("status", sa.String(length=16), nullable=False, server_default="active"),
        sa.Column("completed_at", sa.DateTime(), nullable=True),
        sa.UniqueConstraint("user_id", "quest_id", name="uq_quest_progress"),
    )
    op.create_index("ix_quest_progress_user_id", "quest_progress", ["user_id"])
    op.create_index("ix_quest_progress_quest_id", "quest_progress", ["quest_id"])


def downgrade() -> None:
    op.drop_index("ix_quest_progress_quest_id", table_name="quest_progress")
    op.drop_index("ix_quest_progress_user_id", table_name="quest_progress")
    op.drop_table("quest_progress")
    op.drop_table("quests")
    op.drop_column("game_profiles", "avatar")
    op.drop_column("game_profiles", "display_alias")
    op.drop_column("game_profiles", "leaderboard_opt_in")
