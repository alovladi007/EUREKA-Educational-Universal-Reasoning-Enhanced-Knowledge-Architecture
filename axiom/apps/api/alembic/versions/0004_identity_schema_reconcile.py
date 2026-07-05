"""reconcile identity table schema with the ORM models

Migration 0001 landed the identity tables with a few shapes that do not match
the ORM models, which left a standing autogenerate drift on Postgres:

  - created_at (and users.last_seen_at) were created nullable, but the models
    declare them NOT NULL (they always carry a value from the python-side
    default), so the models want NOT NULL.
  - users.eureka_user_id was backed by a named unique CONSTRAINT plus a separate
    non-unique index, but the column declares unique=True, index=True, which the
    ORM represents as a single unique INDEX.

Rather than rewrite the already-applied 0001 (never edit applied history), this
forward migration alters the live schema to match the models. It converges both
a fresh database (0001 creates the old shape, this fixes it) and an existing one,
so after upgrade head a fresh autogenerate reports no changes.

Revision ID: 0004_identity_reconcile
Revises: 0003_phase_2
Create Date: 2026-07-05 22:30:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0004_identity_reconcile"
down_revision: str | None = "0003_phase_2"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

_TS = sa.DateTime(timezone=True)

# Tables whose created_at column moves from nullable to NOT NULL.
_CREATED_AT_TABLES = (
    "organizations",
    "tenants",
    "users",
    "role_assignments",
    "enrollments",
    "parent_links",
)


def upgrade() -> None:
    # Backfill any NULL timestamps before enforcing NOT NULL. The ORM always
    # sets these via a python-side default, so this is a safety net for rows
    # inserted outside the ORM rather than an expected code path.
    for table in _CREATED_AT_TABLES:
        op.execute(f"UPDATE {table} SET created_at = now() WHERE created_at IS NULL")
    op.execute("UPDATE users SET last_seen_at = now() WHERE last_seen_at IS NULL")

    for table in _CREATED_AT_TABLES:
        op.alter_column(table, "created_at", existing_type=_TS, nullable=False)
    op.alter_column("users", "last_seen_at", existing_type=_TS, nullable=False)

    # Replace the unique constraint plus non-unique index on eureka_user_id with
    # the single unique index the model declares.
    op.drop_constraint(op.f("uq_users_eureka_user_id"), "users", type_="unique")
    op.drop_index(op.f("ix_users_eureka_user_id"), table_name="users")
    op.create_index(op.f("ix_users_eureka_user_id"), "users", ["eureka_user_id"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_users_eureka_user_id"), table_name="users")
    op.create_index(op.f("ix_users_eureka_user_id"), "users", ["eureka_user_id"], unique=False)
    op.create_unique_constraint(op.f("uq_users_eureka_user_id"), "users", ["eureka_user_id"])

    op.alter_column("users", "last_seen_at", existing_type=_TS, nullable=True)
    for table in _CREATED_AT_TABLES:
        op.alter_column(table, "created_at", existing_type=_TS, nullable=True)
