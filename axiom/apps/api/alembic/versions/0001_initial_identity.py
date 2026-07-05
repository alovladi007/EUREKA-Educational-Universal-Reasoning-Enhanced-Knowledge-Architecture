"""initial identity and tenancy tables

Revision ID: 0001_initial
Revises:
Create Date: 2026-07-05
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0001_initial"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "organizations",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False, unique=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
    )

    op.create_table(
        "tenants",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_tenants_organization_id", "tenants", ["organization_id"])

    op.create_table(
        "users",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("eureka_user_id", sa.String(length=64), nullable=False),
        sa.Column("tenant_id", sa.Uuid(), nullable=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("display_name", sa.String(length=200), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("last_seen_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["tenant_id"], ["tenants.id"], ondelete="SET NULL"),
        sa.UniqueConstraint("eureka_user_id", name="uq_users_eureka_user_id"),
    )
    op.create_index("ix_users_eureka_user_id", "users", ["eureka_user_id"])
    op.create_index("ix_users_tenant_id", "users", ["tenant_id"])

    op.create_table(
        "roles",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("name", sa.String(length=64), nullable=False, unique=True),
        sa.Column("description", sa.String(length=255), nullable=True),
    )

    op.create_table(
        "role_assignments",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("role_id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["role_id"], ["roles.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("user_id", "role_id", name="uq_role_assignment"),
    )
    op.create_index("ix_role_assignments_user_id", "role_assignments", ["user_id"])
    op.create_index("ix_role_assignments_role_id", "role_assignments", ["role_id"])

    op.create_table(
        "enrollments",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("course_ref", sa.String(length=128), nullable=False),
        sa.Column("role_in_course", sa.String(length=32), nullable=False, server_default="student"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("user_id", "course_ref", name="uq_enrollment_user_course"),
    )
    op.create_index("ix_enrollments_user_id", "enrollments", ["user_id"])

    op.create_table(
        "parent_links",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("parent_user_id", sa.Uuid(), nullable=False),
        sa.Column("child_user_id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["parent_user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["child_user_id"], ["users.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("parent_user_id", "child_user_id", name="uq_parent_child"),
    )
    op.create_index("ix_parent_links_parent_user_id", "parent_links", ["parent_user_id"])
    op.create_index("ix_parent_links_child_user_id", "parent_links", ["child_user_id"])


def downgrade() -> None:
    op.drop_table("parent_links")
    op.drop_table("enrollments")
    op.drop_table("role_assignments")
    op.drop_table("roles")
    op.drop_table("users")
    op.drop_table("tenants")
    op.drop_table("organizations")
