"""phase 3 grade overrides

Adds grade_overrides, which records a teacher's override of an AI-produced grade
as the grade of record. One override per response. Hand-written so applying it
leaves zero schema drift against the ORM models.

Revision ID: 0006_grade_overrides
Revises: 0005_copilot
Create Date: 2026-07-05 23:55:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0006_grade_overrides"
down_revision: str | None = "0005_copilot"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "grade_overrides",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("response_id", sa.Uuid(), nullable=False),
        sa.Column("score", sa.Float(), nullable=False),
        sa.Column("is_correct", sa.Boolean(), nullable=False),
        sa.Column("note", sa.String(length=500), nullable=False),
        sa.Column("overridden_by", sa.Uuid(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["response_id"], ["responses.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["overridden_by"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    # response_id declares unique=True and index=True on the column, which is a
    # single unique index (not a separate unique constraint), so match that.
    op.create_index(
        op.f("ix_grade_overrides_response_id"), "grade_overrides", ["response_id"], unique=True
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_grade_overrides_response_id"), table_name="grade_overrides")
    op.drop_table("grade_overrides")
