"""LTI 1.3 platforms, nonces, and launches

Adds the tables backing the LTI 1.3 tool provider: registered platforms, the
one-time login state/nonce, and validated launches (with the AGS line item for
grade passback). Hand-written so applying it leaves zero schema drift against the
ORM models.

Revision ID: 0012_lti
Revises: 0011_proctoring
Create Date: 2026-07-06 16:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0012_lti"
down_revision: str | None = "0011_proctoring"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "lti_platforms",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("issuer", sa.String(length=255), nullable=False),
        sa.Column("client_id", sa.String(length=255), nullable=False),
        sa.Column("deployment_id", sa.String(length=255), nullable=True),
        sa.Column("name", sa.String(length=200), nullable=False, server_default=""),
        sa.Column("auth_login_url", sa.String(length=500), nullable=False),
        sa.Column("auth_token_url", sa.String(length=500), nullable=False, server_default=""),
        sa.Column("jwks_url", sa.String(length=500), nullable=True),
        sa.Column("public_key_pem", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_lti_platforms_issuer", "lti_platforms", ["issuer"], unique=True)

    op.create_table(
        "lti_nonces",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("state", sa.String(length=64), nullable=False),
        sa.Column("nonce", sa.String(length=64), nullable=False),
        sa.Column("issuer", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_lti_nonces_state", "lti_nonces", ["state"], unique=True)

    op.create_table(
        "lti_launches",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column(
            "platform_id",
            sa.Uuid(),
            sa.ForeignKey("lti_platforms.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "user_id",
            sa.Uuid(),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("sub", sa.String(length=255), nullable=False),
        sa.Column("resource_link_id", sa.String(length=255), nullable=True),
        sa.Column("context_id", sa.String(length=255), nullable=True),
        sa.Column("roles", sa.JSON(), nullable=True),
        sa.Column("message_type", sa.String(length=64), nullable=False, server_default=""),
        sa.Column("ags_lineitem_url", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_lti_launches_platform_id", "lti_launches", ["platform_id"])


def downgrade() -> None:
    op.drop_index("ix_lti_launches_platform_id", table_name="lti_launches")
    op.drop_table("lti_launches")
    op.drop_index("ix_lti_nonces_state", table_name="lti_nonces")
    op.drop_table("lti_nonces")
    op.drop_index("ix_lti_platforms_issuer", table_name="lti_platforms")
    op.drop_table("lti_platforms")
