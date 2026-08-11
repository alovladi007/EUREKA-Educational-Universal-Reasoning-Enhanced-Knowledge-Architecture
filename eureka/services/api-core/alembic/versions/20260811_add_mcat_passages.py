"""Passages for the item bank (C2, AUDIT MC-8).

The real MCAT is predominantly passage-based; the bank previously held only
discrete items. This adds a passages table with the SAME review and
provenance standing as items (a passage is content making claims, exactly
like a stem), and a nullable items.passage_id so a set of items can attach
to one passage. Discrete items are untouched.

Revision ID: mcat_passages_001
Revises: mcat_octet_001
Create Date: 2026-08-11
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "mcat_passages_001"
down_revision = "mcat_octet_001"
branch_labels = None
depends_on = None

_review = postgresql.ENUM(name="item_review_status", create_type=False)
_source = postgresql.ENUM(name="item_source_kind", create_type=False)


def upgrade() -> None:
    op.create_table(
        "passages",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column("bank_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("item_banks.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("topic_id", sa.Integer(), nullable=False),
        sa.Column("section", sa.String(length=120), nullable=False),
        sa.Column("review_status", _review, nullable=False, server_default="draft"),
        sa.Column("reviewed_at", sa.DateTime(), nullable=True),
        sa.Column("reviewed_by", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("users.id"), nullable=True),
        sa.Column("source_kind", _source, nullable=False, server_default="ai_generated"),
        sa.Column("attribution", sa.Text(), nullable=True),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False,
                  server_default=sa.text("now()")),
        sa.Column("metadata", postgresql.JSONB(), nullable=False,
                  server_default=sa.text("'{}'::jsonb")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_passages_bank", "passages", ["bank_id"])
    op.create_index("ix_passages_topic", "passages", ["topic_id"])

    op.add_column(
        "items",
        sa.Column("passage_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("passages.id", ondelete="SET NULL"), nullable=True),
    )
    op.create_index("ix_items_passage", "items", ["passage_id"])


def downgrade() -> None:
    op.drop_index("ix_items_passage", table_name="items")
    op.drop_column("items", "passage_id")
    op.drop_index("ix_passages_topic", table_name="passages")
    op.drop_index("ix_passages_bank", table_name="passages")
    op.drop_table("passages")
