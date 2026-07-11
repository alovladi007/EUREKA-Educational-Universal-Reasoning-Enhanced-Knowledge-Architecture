"""misconception library

Adds the misconceptions table: the Engineering Math track's named-error library.
Each row keys a stable code to a description and a remediation knowledge node, so
a distractor a learner picks becomes a diagnosis plus a targeted-practice target.
Hand-written for zero schema drift.

Revision ID: 0021_misconceptions
Revises: 0020_embeddings_384
Create Date: 2026-07-11 00:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0021_misconceptions"
down_revision: str | None = "0020_embeddings_384"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "misconceptions",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("code", sa.String(length=32), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column(
            "routes_to_node_id",
            sa.Uuid(),
            sa.ForeignKey("knowledge_nodes.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.UniqueConstraint("code", name="uq_misconception_code"),
    )
    op.create_index(
        "ix_misconceptions_routes_to_node_id", "misconceptions", ["routes_to_node_id"]
    )


def downgrade() -> None:
    op.drop_index("ix_misconceptions_routes_to_node_id", table_name="misconceptions")
    op.drop_table("misconceptions")
