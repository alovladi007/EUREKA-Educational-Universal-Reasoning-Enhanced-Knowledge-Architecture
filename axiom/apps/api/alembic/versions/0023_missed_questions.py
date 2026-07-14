"""missed questions (save-and-redo review layer)

Adds the missed_questions table from the reference review layer (EM-19): every
wrong answer is saved with the exact prompt served; a correct re-attempt on the
same question clears the entry; a later miss reopens it with the count kept.
Template misses keep the variant id, so retry serves the very numbers missed.
Hand-written for zero schema drift.

Revision ID: 0023_missed_questions
Revises: 0022_entitlements
Create Date: 2026-07-14 00:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0023_missed_questions"
down_revision: str | None = "0022_entitlements"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "missed_questions",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("user_id", sa.Uuid(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("node_id", sa.Uuid(), sa.ForeignKey("knowledge_nodes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("item_id", sa.Uuid(), sa.ForeignKey("items.id", ondelete="CASCADE"), nullable=True),
        sa.Column("template_id", sa.Uuid(), sa.ForeignKey("item_templates.id", ondelete="CASCADE"), nullable=True),
        sa.Column("variant_id", sa.Uuid(), sa.ForeignKey("item_variants.id", ondelete="CASCADE"), nullable=True),
        sa.Column("prompt", sa.Text(), nullable=False, server_default=""),
        sa.Column("last_answer", sa.Text(), nullable=False, server_default=""),
        sa.Column("misconception_code", sa.String(length=32), nullable=True),
        sa.Column("miss_count", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("status", sa.String(length=12), nullable=False, server_default="open"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_missed_questions_user_id", "missed_questions", ["user_id"])
    op.create_index("ix_missed_questions_node_id", "missed_questions", ["node_id"])


def downgrade() -> None:
    op.drop_table("missed_questions")
