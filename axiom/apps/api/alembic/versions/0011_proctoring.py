"""proctoring sessions and integrity events

Adds the proctoring_sessions and integrity_events tables for Phase 4 exam
integrity: a session spans one secure attempt and carries a running anomaly
score; integrity_events are the browser-observable signals reported during it.
Hand-written so applying it leaves zero schema drift against the ORM models.

Revision ID: 0011_proctoring
Revises: 0010_generated_items
Create Date: 2026-07-06 15:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0011_proctoring"
down_revision: str | None = "0010_generated_items"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "proctoring_sessions",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column(
            "user_id",
            sa.Uuid(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("assessment_id", sa.Uuid(), nullable=True),
        sa.Column("attempt_id", sa.Uuid(), nullable=True),
        sa.Column("policy", sa.JSON(), nullable=True),
        sa.Column("status", sa.String(length=16), nullable=False, server_default="active"),
        sa.Column("anomaly_score", sa.Float(), nullable=False, server_default="0"),
        sa.Column("started_at", sa.DateTime(), nullable=False),
        sa.Column("ended_at", sa.DateTime(), nullable=True),
    )
    op.create_index(
        "ix_proctoring_sessions_user_id", "proctoring_sessions", ["user_id"]
    )
    op.create_table(
        "integrity_events",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column(
            "session_id",
            sa.Uuid(),
            sa.ForeignKey("proctoring_sessions.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("kind", sa.String(length=32), nullable=False),
        sa.Column("detail", sa.Text(), nullable=False, server_default=""),
        sa.Column("occurred_at", sa.DateTime(), nullable=False),
    )
    op.create_index(
        "ix_integrity_events_session_id", "integrity_events", ["session_id"]
    )


def downgrade() -> None:
    op.drop_index("ix_integrity_events_session_id", table_name="integrity_events")
    op.drop_table("integrity_events")
    op.drop_index("ix_proctoring_sessions_user_id", table_name="proctoring_sessions")
    op.drop_table("proctoring_sessions")
