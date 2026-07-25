"""Exam attempts and responses

Backs the timed exam engine. Two tables, and the shape of each encodes a rule
the engine depends on.

exam_attempts.form holds the issued paper as JSON. It is a snapshot rather
than something reassembled on read, so deploying a template change mid exam
cannot alter the paper under a learner who has already answered half of it.

exam_attempts.result is null while an attempt is open. That is what makes
"no feedback until submission" a property of the schema rather than a
discipline the API layer has to remember.

exam_responses carries no grade and no correctness column. Nothing is graded
until submission, so there is no field here that could leak one, and the
unique constraint on (attempt_id, position) means changing an answer updates
the row rather than leaving two answers for scoring to choose between.

user_id carries no foreign key because OCTET owns no users table. EUREKA is
the identity provider and the value is the subject claim from its token.

Revision ID: 0003_exams
Revises: 0002_lti
Create Date: 2026-07-24 21:20:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0003_exams"
down_revision: str | None = "0002_lti"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "exam_attempts",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.String(length=64), nullable=False),
        sa.Column("blueprint_code", sa.String(length=80), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column(
            "started_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("form", sa.JSON(), nullable=False),
        sa.Column("result", sa.JSON(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_exam_attempts_user_id", "exam_attempts", ["user_id"])
    op.create_index("ix_exam_attempts_blueprint_code", "exam_attempts", ["blueprint_code"])
    op.create_index("ix_exam_attempts_user_status", "exam_attempts", ["user_id", "status"])

    op.create_table(
        "exam_responses",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("attempt_id", sa.Uuid(), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.Column("answer", sa.Text(), nullable=False),
        sa.Column(
            "answered_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["attempt_id"], ["exam_attempts.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("attempt_id", "position", name="uq_exam_response_attempt_position"),
    )
    op.create_index("ix_exam_responses_attempt_id", "exam_responses", ["attempt_id"])


def downgrade() -> None:
    op.drop_index("ix_exam_responses_attempt_id", table_name="exam_responses")
    op.drop_table("exam_responses")
    op.drop_index("ix_exam_attempts_user_status", table_name="exam_attempts")
    op.drop_index("ix_exam_attempts_blueprint_code", table_name="exam_attempts")
    op.drop_index("ix_exam_attempts_user_id", table_name="exam_attempts")
    op.drop_table("exam_attempts")
