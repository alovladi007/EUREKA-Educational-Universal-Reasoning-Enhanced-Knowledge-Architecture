"""Add 'nclex' to the skill_framework enum.

The NCLEX QBank migration (NX-2) seeds an ItemBank whose framework must be
honest — the existing values would force either 'usmle' (a different exam)
or 'eureka_custom' (a catch-all that hides a major vertical). NCSBN's
NCLEX-RN test plan is a real external framework on par with the MCAT
content outline, so it gets its own value.

ADD VALUE is additive-only: no table rewrite, no downtime, and existing
rows are untouched. Postgres cannot REMOVE an enum value, so downgrade()
is a documented no-op — a leftover label is harmless, while the recreate-
the-type dance to drop one risks the very tables this exists to serve.

ops/db/06_skill_graph.sql gains the same value in the same commit so a
fresh volume and a migrated one converge (P1.2's drift rule).

Revision ID: nclex_framework_001
Revises: chapter_reads_001
Create Date: 2026-08-20
"""

from alembic import op


revision = "nclex_framework_001"
down_revision = "chapter_reads_001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # IF NOT EXISTS keeps this idempotent against a volume where the init SQL
    # (updated in the same commit) already created the value.
    op.execute("ALTER TYPE skill_framework ADD VALUE IF NOT EXISTS 'nclex'")


def downgrade() -> None:
    # Deliberate no-op: Postgres has no ALTER TYPE ... DROP VALUE. Removing an
    # enum label means recreating the type and rewriting every dependent
    # column; an unused label costs nothing. Documented rather than faked.
    pass
