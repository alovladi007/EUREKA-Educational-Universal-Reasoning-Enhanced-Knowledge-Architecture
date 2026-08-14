"""Add study_chapter_reads — server-side course reading progress.

Chapter-read state lived only in localStorage
(`<exam>_study_read_chapters`), so course progress evaporated on a new
device or a cleared browser, and institutional cohort reporting had
nothing to read. One row per (user, exam, topic) a learner has explicitly
marked read; the frontend keeps localStorage as an offline cache and
merges it up through POST /me/chapter-reads/sync on first load.

Deliberately NOT user_progress rows: that table's rows are attempt
evidence and its summaries divide by attempts — a read has no
correctness and would pollute every accuracy aggregate.

Revision ID: chapter_reads_001
Revises: pb_product_copy_001
Create Date: 2026-08-13
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "chapter_reads_001"
down_revision = "pb_product_copy_001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "study_chapter_reads",
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
        sa.Column(
            "read_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "user_id", "exam_type", "topic_id",
            name="uq_chapter_read_user_exam_topic",
        ),
    )
    op.create_index(
        "ix_chapter_reads_user_exam",
        "study_chapter_reads",
        ["user_id", "exam_type"],
    )


def downgrade() -> None:
    op.drop_index("ix_chapter_reads_user_exam", table_name="study_chapter_reads")
    op.drop_table("study_chapter_reads")
