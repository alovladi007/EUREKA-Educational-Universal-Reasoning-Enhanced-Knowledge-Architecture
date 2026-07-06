"""tutoring sessions

Adds the tutoring_sessions table for the live shared-whiteboard rooms. The live
drawing/chat state is ephemeral (WebSocket only); this row records ownership, the
join code, and whether the room is open. Hand-written for zero schema drift.

Revision ID: 0013_tutoring
Revises: 0012_lti
Create Date: 2026-07-06 16:40:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0013_tutoring"
down_revision: str | None = "0012_lti"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "tutoring_sessions",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column(
            "tutor_id",
            sa.Uuid(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "title",
            sa.String(length=200),
            nullable=False,
            server_default="Tutoring session",
        ),
        sa.Column("join_code", sa.String(length=12), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False, server_default="active"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("ended_at", sa.DateTime(), nullable=True),
    )
    op.create_index("ix_tutoring_sessions_tutor_id", "tutoring_sessions", ["tutor_id"])
    op.create_index(
        "ix_tutoring_sessions_join_code", "tutoring_sessions", ["join_code"], unique=True
    )


def downgrade() -> None:
    op.drop_index("ix_tutoring_sessions_join_code", table_name="tutoring_sessions")
    op.drop_index("ix_tutoring_sessions_tutor_id", table_name="tutoring_sessions")
    op.drop_table("tutoring_sessions")
