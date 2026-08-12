"""Help requests: escalations from the in-app helper.

The helper answers from a registry of what the platform really does and hands
anything else to a human. This is where "anything else" lands, so that an
escalation is a countable row rather than an email nobody can report on.

Revision ID: help_requests_001
Revises: pb_product_copy_001
Create Date: 2026-08-12
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "help_requests_001"
down_revision = "pb_product_copy_001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "help_requests",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
        ),
        sa.Column("question", sa.Text(), nullable=False),
        sa.Column("page_path", sa.String(500)),
        sa.Column("topic_keys", sa.String(500), nullable=False, server_default=""),
        sa.Column("reason", sa.String(32), nullable=False, server_default="no_match"),
        sa.Column("status", sa.String(24), nullable=False, server_default="open"),
        sa.Column("resolution", sa.Text()),
        sa.Column(
            "resolved_by",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
        ),
        sa.Column("resolved_at", sa.DateTime(timezone=True)),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
    )
    op.create_index(
        "idx_help_requests_status_created",
        "help_requests",
        ["status", sa.text("created_at DESC")],
    )
    op.create_index("idx_help_requests_user", "help_requests", ["user_id"])


def downgrade() -> None:
    op.drop_index("idx_help_requests_user", table_name="help_requests")
    op.drop_index("idx_help_requests_status_created", table_name="help_requests")
    op.drop_table("help_requests")
