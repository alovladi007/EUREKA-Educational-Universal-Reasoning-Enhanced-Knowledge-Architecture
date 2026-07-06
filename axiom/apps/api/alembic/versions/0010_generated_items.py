"""copilot generated-items review queue

Adds the generated_items table: copilot-generated candidate items awaiting human
review. Generation never writes into the item bank directly; a candidate is CAS-
validated at creation and stored here as pending until a teacher approves it
(which creates a real Item) or rejects it. Hand-written so applying it leaves
zero schema drift against the ORM model.

Revision ID: 0010_generated_items
Revises: 0009_assessment_window
Create Date: 2026-07-06 14:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0010_generated_items"
down_revision: str | None = "0009_assessment_window"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "generated_items",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column(
            "node_id",
            sa.Uuid(),
            sa.ForeignKey("knowledge_nodes.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "created_by",
            sa.Uuid(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("kind", sa.String(length=24), nullable=False),
        sa.Column("prompt", sa.Text(), nullable=False),
        sa.Column("options", sa.JSON(), nullable=True),
        sa.Column("correct", sa.String(length=500), nullable=False),
        sa.Column("explanation", sa.Text(), nullable=False, server_default=""),
        sa.Column("difficulty", sa.Float(), nullable=False, server_default="0.5"),
        sa.Column("meta", sa.JSON(), nullable=True),
        sa.Column("source", sa.String(length=48), nullable=False, server_default=""),
        sa.Column("validated", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("status", sa.String(length=16), nullable=False, server_default="pending"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("reviewed_at", sa.DateTime(), nullable=True),
        sa.Column("approved_item_id", sa.Uuid(), nullable=True),
    )
    op.create_index(
        "ix_generated_items_node_id", "generated_items", ["node_id"]
    )
    op.create_index(
        "ix_generated_items_created_by", "generated_items", ["created_by"]
    )


def downgrade() -> None:
    op.drop_index("ix_generated_items_created_by", table_name="generated_items")
    op.drop_index("ix_generated_items_node_id", table_name="generated_items")
    op.drop_table("generated_items")
