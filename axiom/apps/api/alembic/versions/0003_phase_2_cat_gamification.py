"""phase 2 cat sessions, gamification, and item meta

Adds the tables and columns introduced in Phase 2:
  - cat_sessions: computerized adaptive test sessions (running theta and SE).
  - game_profiles, xp_ledger, badges, badge_awards: gamification tied to real
    progress.
  - items.meta: kind-specific extras (e.g. show_work milestones, plot_points
    keys) so new item kinds do not each need a new column.

Hand-written (not blind autogenerate) so the ops are exactly these five tables
and one column, with the indexes and unique constraints the models declare, and
so applying this migration leaves zero schema drift against the ORM metadata.

Revision ID: 0003_phase_2
Revises: 0e71108be406
Create Date: 2026-07-05 21:10:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0003_phase_2"
down_revision: str | None = "0e71108be406"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # cat_sessions
    op.create_table(
        "cat_sessions",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("status", sa.String(length=24), nullable=False),
        sa.Column("theta", sa.Float(), nullable=False),
        sa.Column("standard_error", sa.Float(), nullable=False),
        sa.Column("item_count", sa.Integer(), nullable=False),
        sa.Column("administered", sa.JSON(), nullable=False),
        sa.Column("pending_item_id", sa.Uuid(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["pending_item_id"], ["items.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_cat_sessions_user_id"), "cat_sessions", ["user_id"], unique=False)

    # badges (must exist before badge_awards references it)
    op.create_table(
        "badges",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("code", sa.String(length=64), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("description", sa.String(length=300), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("code"),
    )

    # badge_awards
    op.create_table(
        "badge_awards",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("badge_id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["badge_id"], ["badges.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "badge_id", name="uq_badge_award"),
    )
    op.create_index(
        op.f("ix_badge_awards_badge_id"), "badge_awards", ["badge_id"], unique=False
    )
    op.create_index(
        op.f("ix_badge_awards_user_id"), "badge_awards", ["user_id"], unique=False
    )

    # game_profiles
    op.create_table(
        "game_profiles",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("xp_total", sa.Integer(), nullable=False),
        sa.Column("level", sa.Integer(), nullable=False),
        sa.Column("streak_days", sa.Integer(), nullable=False),
        sa.Column("last_active_on", sa.Date(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", name="uq_game_profile_user"),
    )
    op.create_index(
        op.f("ix_game_profiles_user_id"), "game_profiles", ["user_id"], unique=False
    )

    # xp_ledger
    op.create_table(
        "xp_ledger",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("amount", sa.Integer(), nullable=False),
        sa.Column("reason", sa.String(length=64), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_xp_ledger_user_id"), "xp_ledger", ["user_id"], unique=False)

    # items.meta
    op.add_column("items", sa.Column("meta", sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column("items", "meta")

    op.drop_index(op.f("ix_xp_ledger_user_id"), table_name="xp_ledger")
    op.drop_table("xp_ledger")

    op.drop_index(op.f("ix_game_profiles_user_id"), table_name="game_profiles")
    op.drop_table("game_profiles")

    op.drop_index(op.f("ix_badge_awards_user_id"), table_name="badge_awards")
    op.drop_index(op.f("ix_badge_awards_badge_id"), table_name="badge_awards")
    op.drop_table("badge_awards")

    op.drop_table("badges")

    op.drop_index(op.f("ix_cat_sessions_user_id"), table_name="cat_sessions")
    op.drop_table("cat_sessions")
