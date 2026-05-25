"""Add srs_cards table (P1-4)

Spaced-Repetition System flashcards with SM-2 scheduling state. Used
by the SRS review UI (any exam surface), the Patent Bar Command Center
review-queue (when api-core has authoring data), and any future card-
authoring feature. The (user_id, deck) index supports the listing
query; (user_id, next_review) supports the due-card scan.

Revision ID: srs_cards_001
Revises: user_progress_001
Create Date: 2026-05-24
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers
revision = "srs_cards_001"
down_revision = "user_progress_001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "srs_cards",
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
        sa.Column(
            "deck", sa.String(length=64), nullable=False, server_default="general"
        ),
        sa.Column("front", sa.Text(), nullable=False),
        sa.Column("back", sa.Text(), nullable=False),
        sa.Column("tags", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column(
            "ease_factor", sa.Float(), nullable=False, server_default="2.5"
        ),
        sa.Column(
            "interval_days", sa.Integer(), nullable=False, server_default="0"
        ),
        sa.Column(
            "repetitions", sa.Integer(), nullable=False, server_default="0"
        ),
        sa.Column(
            "next_review",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column("last_review", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "total_reviews", sa.Integer(), nullable=False, server_default="0"
        ),
        sa.Column(
            "total_correct", sa.Integer(), nullable=False, server_default="0"
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_srs_cards_user_deck", "srs_cards", ["user_id", "deck"]
    )
    op.create_index(
        "ix_srs_cards_user_due", "srs_cards", ["user_id", "next_review"]
    )


def downgrade() -> None:
    op.drop_index("ix_srs_cards_user_due", table_name="srs_cards")
    op.drop_index("ix_srs_cards_user_deck", table_name="srs_cards")
    op.drop_table("srs_cards")
