"""assignment due dates and reminder stamp

Adds due_at and reminded_at to assignment_targets so the beat scheduler can
remind students of assignments coming due, exactly once each. Both nullable;
hand-written so applying it leaves zero schema drift against the ORM model.

Revision ID: 0008_assignment_due
Revises: 0007_notifications
Create Date: 2026-07-06 00:45:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0008_assignment_due"
down_revision: str | None = "0007_notifications"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("assignment_targets", sa.Column("due_at", sa.DateTime(), nullable=True))
    op.add_column("assignment_targets", sa.Column("reminded_at", sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column("assignment_targets", "reminded_at")
    op.drop_column("assignment_targets", "due_at")
