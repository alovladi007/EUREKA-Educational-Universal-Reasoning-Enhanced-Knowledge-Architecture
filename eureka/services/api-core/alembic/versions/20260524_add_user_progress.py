"""Add user_progress table (P0-5)

Per-user, per-topic learning state. Used by the test-prep Analytics pages,
Study Plan recommendations, and adaptive / SRS engines. One row per
(user_id, exam_type, topic_id); attempts are upserted by the
POST /me/progress endpoint after each question.

Revision ID: user_progress_001
Revises: 002_remaining_models
Create Date: 2026-05-24
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers
# Stacks on top of the canonical app-schema head (002_remaining_models).
# The resume_001 branch is a separate root that pre-dates the unified
# chain; leaving it untouched.
revision = "user_progress_001"
down_revision = "002_remaining_models"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "user_progress",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            nullable=False,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("exam_type", sa.String(length=32), nullable=False),
        sa.Column("topic_id", sa.String(length=80), nullable=False),
        sa.Column("attempts", sa.Integer(), server_default="0", nullable=False),
        sa.Column("correct", sa.Integer(), server_default="0", nullable=False),
        sa.Column(
            "avg_seconds", sa.Float(), server_default="0", nullable=False
        ),
        sa.Column(
            "mastery_level", sa.Float(), server_default="0", nullable=False
        ),
        sa.Column(
            "last_seen_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "user_id",
            "exam_type",
            "topic_id",
            name="uq_user_progress_user_exam_topic",
        ),
    )
    op.create_index(
        "ix_user_progress_user_exam",
        "user_progress",
        ["user_id", "exam_type"],
    )
    op.create_index(
        "ix_user_progress_exam_topic",
        "user_progress",
        ["exam_type", "topic_id"],
    )


def downgrade() -> None:
    op.drop_index("ix_user_progress_exam_topic", table_name="user_progress")
    op.drop_index("ix_user_progress_user_exam", table_name="user_progress")
    op.drop_table("user_progress")
