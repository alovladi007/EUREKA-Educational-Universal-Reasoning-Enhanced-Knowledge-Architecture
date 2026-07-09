"""accommodations + assessment time limit

Adds the accommodations table (per-user extra time, TTS, high-contrast, reduced
motion) and a base time_limit_minutes on assessments, so an extra-time
accommodation can produce an effective limit (Build prompt Section 13).
Hand-written for zero schema drift.

Revision ID: 0018_accommodations
Revises: 0017_gamification_breadth
Create Date: 2026-07-08 14:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0018_accommodations"
down_revision: str | None = "0017_gamification_breadth"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "accommodations",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column(
            "user_id",
            sa.Uuid(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "extra_time_multiplier", sa.Float(), nullable=False, server_default="1.0"
        ),
        sa.Column("text_to_speech", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("high_contrast", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("reduced_motion", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("user_id", name="uq_accommodation_user"),
    )
    op.create_index("ix_accommodations_user_id", "accommodations", ["user_id"])

    op.add_column(
        "assessments", sa.Column("time_limit_minutes", sa.Integer(), nullable=True)
    )


def downgrade() -> None:
    op.drop_column("assessments", "time_limit_minutes")
    op.drop_index("ix_accommodations_user_id", table_name="accommodations")
    op.drop_table("accommodations")
