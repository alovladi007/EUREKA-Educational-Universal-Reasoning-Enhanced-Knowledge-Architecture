"""assessment availability window

Adds open_at and close_at to assessments so a student may only start within the
window. Both nullable (unbounded when null); hand-written so applying it leaves
zero schema drift against the ORM model.

Revision ID: 0009_assessment_window
Revises: 0008_assignment_due
Create Date: 2026-07-06 01:10:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0009_assessment_window"
down_revision: str | None = "0008_assignment_due"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("assessments", sa.Column("open_at", sa.DateTime(), nullable=True))
    op.add_column("assessments", sa.Column("close_at", sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column("assessments", "close_at")
    op.drop_column("assessments", "open_at")
