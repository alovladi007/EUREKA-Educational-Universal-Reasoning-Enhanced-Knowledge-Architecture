"""add user profile fields: phone, bio, location

Adds three nullable profile columns to the users table so the Profile page's
phone / bio / location inputs persist (date_of_birth already existed). The
initdb SQL (ops/db/00_init_complete.sql) also creates these on fresh
docker-compose stacks, so the ALTERs are guarded with IF NOT EXISTS to stay
idempotent regardless of how the DB was provisioned.

Revision ID: b1c2d3e4f5a6
Revises: 7d307801af1a
Create Date: 2026-07-05
"""
from alembic import op

# revision identifiers, used by Alembic.
revision = "b1c2d3e4f5a6"
down_revision = "7d307801af1a"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50)")
    op.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS bio VARCHAR(2000)")
    op.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(200)")


def downgrade() -> None:
    op.execute("ALTER TABLE users DROP COLUMN IF EXISTS location")
    op.execute("ALTER TABLE users DROP COLUMN IF EXISTS bio")
    op.execute("ALTER TABLE users DROP COLUMN IF EXISTS phone")
