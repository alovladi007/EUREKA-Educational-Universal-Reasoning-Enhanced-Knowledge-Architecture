"""Spaced repetition scheduling state.

Revision ID: 0005_srs
Revises: 0004_practice

One table. Card text is deliberately absent: cards are derived from the
authored lessons at read time, and the database owns only where each learner
stands with each card on the SM-2 schedule.
"""

from __future__ import annotations

from typing import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0005_srs"
down_revision: str | None = "0004_practice"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "srs_states",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.String(length=64), nullable=False),
        sa.Column("card_id", sa.String(length=128), nullable=False),
        sa.Column("repetitions", sa.Integer(), nullable=False),
        sa.Column("interval_days", sa.Float(), nullable=False),
        sa.Column("ease", sa.Float(), nullable=False),
        sa.Column("due_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("last_grade", sa.Integer(), nullable=False),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "card_id", name="uq_srs_state_user_card"),
    )
    op.create_index("ix_srs_states_user_id", "srs_states", ["user_id"])


def downgrade() -> None:
    op.drop_table("srs_states")
