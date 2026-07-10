"""compliance: audit trail and consent records

Adds the unified security audit_log and per-user consent_records tables (Build
prompt Section 13). Hand-written for zero schema drift.

Revision ID: 0019_compliance
Revises: 0018_accommodations
Create Date: 2026-07-09 13:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0019_compliance"
down_revision: str | None = "0018_accommodations"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "audit_log",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("actor_user_id", sa.Uuid(), nullable=True),
        sa.Column("actor_email", sa.String(length=320), nullable=False, server_default=""),
        sa.Column("action", sa.String(length=64), nullable=False),
        sa.Column("resource_type", sa.String(length=64), nullable=False),
        sa.Column("resource_id", sa.String(length=128), nullable=True),
        sa.Column("tenant_id", sa.Uuid(), nullable=True),
        sa.Column("detail", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_audit_log_actor_user_id", "audit_log", ["actor_user_id"])
    op.create_index("ix_audit_log_action", "audit_log", ["action"])
    op.create_index("ix_audit_log_tenant_id", "audit_log", ["tenant_id"])
    op.create_index("ix_audit_log_created_at", "audit_log", ["created_at"])

    op.create_table(
        "consent_records",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column(
            "user_id",
            sa.Uuid(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("consent_type", sa.String(length=32), nullable=False),
        sa.Column("granted", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("granted_by", sa.String(length=320), nullable=False, server_default=""),
        sa.Column("tenant_id", sa.Uuid(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("user_id", "consent_type", name="uq_consent_user_type"),
    )
    op.create_index("ix_consent_records_user_id", "consent_records", ["user_id"])
    op.create_index("ix_consent_records_tenant_id", "consent_records", ["tenant_id"])


def downgrade() -> None:
    op.drop_index("ix_consent_records_tenant_id", table_name="consent_records")
    op.drop_index("ix_consent_records_user_id", table_name="consent_records")
    op.drop_table("consent_records")
    op.drop_index("ix_audit_log_created_at", table_name="audit_log")
    op.drop_index("ix_audit_log_tenant_id", table_name="audit_log")
    op.drop_index("ix_audit_log_action", table_name="audit_log")
    op.drop_index("ix_audit_log_actor_user_id", table_name="audit_log")
    op.drop_table("audit_log")
