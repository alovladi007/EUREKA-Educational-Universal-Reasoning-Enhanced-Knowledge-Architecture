"""entitlements

Adds the entitlements table: the monetization link from the EUREKA-AXIOM
Integration Work Plan (Section 3). A row says a user has active access to an
AXIOM product SKU; rows are written by the EUREKA purchase/refund/expiry
webhook and read on the practice hot path through a short-TTL cache.
Hand-written for zero schema drift.

Revision ID: 0022_entitlements
Revises: 0021_misconceptions
Create Date: 2026-07-13 00:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0022_entitlements"
down_revision: str | None = "0021_misconceptions"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "entitlements",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column(
            "user_id",
            sa.Uuid(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("product_code", sa.String(length=64), nullable=False),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("expires_at", sa.DateTime(), nullable=True),
        sa.Column("source", sa.String(length=32), nullable=False, server_default="webhook"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_entitlements_user_id", "entitlements", ["user_id"])
    op.create_index("ix_entitlements_product_code", "entitlements", ["product_code"])
    op.create_unique_constraint(
        "uq_entitlements_user_product", "entitlements", ["user_id", "product_code"]
    )


def downgrade() -> None:
    op.drop_table("entitlements")
