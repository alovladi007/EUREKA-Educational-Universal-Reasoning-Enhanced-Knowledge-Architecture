"""Practice sessions, responses, and node mastery.

Revision ID: 0004_practice
Revises: 0003_exams

The first migration that makes practice a recorded activity. Everything the
analytics surface shows is a view over these three tables, so a fresh install
that skips this migration loses history silently; alembic check gates that.
"""

from __future__ import annotations

from typing import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0004_practice"
down_revision: str | None = "0003_exams"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "practice_sessions",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.String(length=64), nullable=False),
        sa.Column("mode", sa.String(length=10), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("config", sa.JSON(), nullable=False),
        sa.Column("items", sa.JSON(), nullable=False),
        sa.Column(
            "started_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("summary", sa.JSON(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_practice_sessions_user_id", "practice_sessions", ["user_id"])
    op.create_index(
        "ix_practice_sessions_user_status", "practice_sessions", ["user_id", "status"]
    )

    op.create_table(
        "practice_responses",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("session_id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.String(length=64), nullable=False),
        sa.Column("node_code", sa.String(length=64), nullable=False),
        sa.Column("template_id", sa.String(length=80), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.Column("answer", sa.Text(), nullable=False),
        sa.Column("is_correct", sa.Integer(), nullable=False),
        sa.Column("graded", sa.Integer(), nullable=False),
        sa.Column("score", sa.Float(), nullable=False),
        sa.Column("misconception", sa.String(length=64), nullable=True),
        sa.Column("seconds", sa.Integer(), nullable=False),
        sa.Column("flagged", sa.Integer(), nullable=False),
        sa.Column(
            "answered_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["session_id"], ["practice_sessions.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("session_id", "position", name="uq_practice_response_position"),
    )
    op.create_index("ix_practice_responses_session_id", "practice_responses", ["session_id"])
    op.create_index("ix_practice_responses_user_id", "practice_responses", ["user_id"])
    op.create_index("ix_practice_responses_node_code", "practice_responses", ["node_code"])
    op.create_index(
        "ix_practice_responses_user_node", "practice_responses", ["user_id", "node_code"]
    )

    op.create_table(
        "node_mastery",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.String(length=64), nullable=False),
        sa.Column("node_code", sa.String(length=64), nullable=False),
        sa.Column("attempts", sa.Integer(), nullable=False),
        sa.Column("correct", sa.Integer(), nullable=False),
        sa.Column("streak", sa.Integer(), nullable=False),
        sa.Column("ewma", sa.Float(), nullable=False),
        sa.Column("last_attempt_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "node_code", name="uq_node_mastery_user_node"),
    )
    op.create_index("ix_node_mastery_user_id", "node_mastery", ["user_id"])


def downgrade() -> None:
    op.drop_table("node_mastery")
    op.drop_table("practice_responses")
    op.drop_table("practice_sessions")
