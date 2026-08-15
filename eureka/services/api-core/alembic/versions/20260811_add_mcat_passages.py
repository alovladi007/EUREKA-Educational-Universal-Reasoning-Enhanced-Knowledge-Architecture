"""Passages for the item bank (C2, AUDIT MC-8).

The real MCAT is predominantly passage-based; the bank previously held only
discrete items. This adds a passages table with the SAME review and
provenance standing as items (a passage is content making claims, exactly
like a stem), and a nullable items.passage_id so a set of items can attach
to one passage. Discrete items are untouched.

Prerequisite bootstrap: the item bank (item_banks, items, and their enums)
is owned by ops/db/08_item_bank.sql — it was never part of the alembic
chain. That is fine on a bootstrapped DB (init SQL ran, alembic is stamped)
but this is the FIRST migration to build on those objects, so on a bare DB
(CI's fresh-Postgres migrations job, or an alembic-only bootstrap) they
don't exist and the DDL below fails. upgrade() therefore creates the
prerequisites first, fully guarded (IF NOT EXISTS / duplicate_object), so
it is a no-op everywhere init SQL already ran. Mirrors 08_item_bank.sql
except the uuid default: gen_random_uuid() (built-in) instead of
uuid_generate_v4(), so the bare path needs no uuid-ossp extension.

Revision ID: mcat_passages_001
Revises: mcat_octet_001
Create Date: 2026-08-11
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "mcat_passages_001"
down_revision = "mcat_octet_001"
branch_labels = None
depends_on = None

_review = postgresql.ENUM(name="item_review_status", create_type=False)
_source = postgresql.ENUM(name="item_source_kind", create_type=False)

_BOOTSTRAP_ITEM_BANK = """
DO $$ BEGIN
    CREATE TYPE skill_framework AS ENUM (
        'ccss', 'ngss', 'ap', 'abet', 'acm_ieee', 'usmle', 'mcat', 'mbe',
        'cpa', 'gre', 'lsat', 'fe_pe', 'mba_core', 'eureka_custom'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE bloom_level AS ENUM (
        'remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE item_kind AS ENUM (
        'mcq_single', 'mcq_multi', 'short_answer', 'numeric', 'essay',
        'matching', 'ordering', 'cloze', 'case'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE item_review_status AS ENUM (
        'draft', 'in_review', 'approved', 'flagged', 'retired'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE item_source_kind AS ENUM (
        'imported', 'commissioned', 'ai_generated', 'community', 'licensed'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS item_banks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    framework skill_framework,
    tier VARCHAR(40),
    default_license VARCHAR(80) NOT NULL DEFAULT 'CC-BY-4.0',
    default_attribution TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT valid_bank_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX IF NOT EXISTS idx_item_banks_framework ON item_banks(framework);
CREATE INDEX IF NOT EXISTS idx_item_banks_tier ON item_banks(tier);

CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_id UUID NOT NULL REFERENCES item_banks(id) ON DELETE CASCADE,
    family_id UUID NOT NULL,
    kind item_kind NOT NULL,
    content JSONB NOT NULL,
    explanation TEXT,
    difficulty_nominal VARCHAR(20) NOT NULL DEFAULT 'medium'
        CHECK (difficulty_nominal IN ('easy', 'medium', 'hard', 'expert')),
    irt_difficulty NUMERIC(5, 3),
    irt_discrimination NUMERIC(5, 3),
    irt_guessing NUMERIC(5, 3),
    irt_calibrated_at TIMESTAMP,
    attempts_count INTEGER NOT NULL DEFAULT 0,
    bloom_level bloom_level,
    estimated_time_sec INTEGER,
    tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    review_status item_review_status NOT NULL DEFAULT 'draft',
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES users(id),
    review_notes TEXT,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    created_by UUID REFERENCES users(id),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_items_bank ON items(bank_id);
CREATE INDEX IF NOT EXISTS idx_items_family ON items(family_id);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(review_status)
    WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_items_kind ON items(kind);
CREATE INDEX IF NOT EXISTS idx_items_difficulty ON items(difficulty_nominal);
"""


def upgrade() -> None:
    # No-op on any DB bootstrapped by ops/db/*.sql; creates the item bank's
    # prerequisites on a bare DB so the DDL below can run (see docstring).
    op.execute(_BOOTSTRAP_ITEM_BANK)

    op.create_table(
        "passages",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column("bank_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("item_banks.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("topic_id", sa.Integer(), nullable=False),
        sa.Column("section", sa.String(length=120), nullable=False),
        sa.Column("review_status", _review, nullable=False, server_default="draft"),
        sa.Column("reviewed_at", sa.DateTime(), nullable=True),
        sa.Column("reviewed_by", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("users.id"), nullable=True),
        sa.Column("source_kind", _source, nullable=False, server_default="ai_generated"),
        sa.Column("attribution", sa.Text(), nullable=True),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False,
                  server_default=sa.text("now()")),
        sa.Column("metadata", postgresql.JSONB(), nullable=False,
                  server_default=sa.text("'{}'::jsonb")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_passages_bank", "passages", ["bank_id"])
    op.create_index("ix_passages_topic", "passages", ["topic_id"])

    op.add_column(
        "items",
        sa.Column("passage_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("passages.id", ondelete="SET NULL"), nullable=True),
    )
    op.create_index("ix_items_passage", "items", ["passage_id"])


def downgrade() -> None:
    # Drops only what upgrade() created unconditionally. The guarded
    # prerequisites (item_banks/items/enums) are init-SQL-owned on live DBs
    # and hold data — never dropped here. On a bare DB they linger after a
    # downgrade, which is harmless: re-upgrade's guards tolerate them.
    op.drop_index("ix_items_passage", table_name="items")
    op.drop_column("items", "passage_id")
    op.drop_index("ix_passages_topic", table_name="passages")
    op.drop_index("ix_passages_bank", table_name="passages")
    op.drop_table("passages")
