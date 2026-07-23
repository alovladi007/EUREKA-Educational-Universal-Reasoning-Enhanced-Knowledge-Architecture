"""Add products, entitlements, mock_results (WS5 monetization)

Entitlement layer for test-prep paywall (decision of record: billing lives
in api-core, not the legacy Node test-prep service — one system). Seeds the
ONE real sellable SKU: the Patent Bar full-access product at $599 one-time
(the strategy doc's ~$600 planning price — adjustable via the products
table; no fake catalogue rows).

Revision ID: billing_001
Revises: b1c2d3e4f5a6
Create Date: 2026-07-23
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "billing_001"
down_revision = "b1c2d3e4f5a6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "products",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column("sku", sa.String(length=64), nullable=False),
        sa.Column("exam_code", sa.String(length=32), nullable=False),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("description", sa.String(length=500), nullable=False, server_default=""),
        sa.Column("price_cents", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(length=8), nullable=False, server_default="usd"),
        sa.Column("interval", sa.String(length=16), nullable=False, server_default="one_time"),
        sa.Column("access_days", sa.Integer(), nullable=True),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True),
                  server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("sku", name="uq_products_sku"),
    )
    op.create_index("ix_products_exam_code", "products", ["exam_code"])

    op.create_table(
        "entitlements",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("exam_code", sa.String(length=32), nullable=False),
        sa.Column("sku", sa.String(length=64), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False, server_default="active"),
        sa.Column("source", sa.String(length=16), nullable=False),
        sa.Column("external_ref", sa.String(length=128), nullable=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True),
                  server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True),
                  server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "exam_code", name="uq_entitlement_user_exam"),
    )
    op.create_index("ix_entitlements_user", "entitlements", ["user_id"])

    op.create_table(
        "mock_results",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("exam_type", sa.String(length=32), nullable=False),
        sa.Column("correct", sa.Integer(), nullable=False),
        sa.Column("total", sa.Integer(), nullable=False),
        sa.Column("per_section", postgresql.JSONB(), nullable=False,
                  server_default=sa.text("'{}'::jsonb")),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True),
                  server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_mock_results_user_exam", "mock_results", ["user_id", "exam_type"])

    # Seed the single real sellable SKU (price adjustable in the products
    # table; $599 = the strategy doc's ~$600 planning price).
    op.execute(
        """
        INSERT INTO products (sku, exam_code, name, description, price_cents, currency, interval, access_days, active)
        VALUES (
          'patent_bar_full',
          'PATENT_BAR',
          'Patent Bar Full Access',
          'Full QBank (980 questions incl. 174 official USPTO released-exam questions), timed Real Exam Mode mocks, flashcards, MPEP workbench, and analytics. One-time purchase.',
          59900, 'usd', 'one_time', NULL, true
        )
        ON CONFLICT (sku) DO NOTHING
        """
    )


def downgrade() -> None:
    op.drop_index("ix_mock_results_user_exam", table_name="mock_results")
    op.drop_table("mock_results")
    op.drop_index("ix_entitlements_user", table_name="entitlements")
    op.drop_table("entitlements")
    op.drop_index("ix_products_exam_code", table_name="products")
    op.drop_table("products")
