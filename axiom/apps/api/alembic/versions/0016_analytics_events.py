"""caliper-style analytics event stream

Adds the analytics_events table: the persisted, append-only Caliper-style
learning-event stream the analytics service ingests and rolls up (Build prompt
Section 12). Hand-written for zero schema drift.

Revision ID: 0016_analytics_events
Revises: 0015_content_embeddings
Create Date: 2026-07-07 12:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0016_analytics_events"
down_revision: str | None = "0015_content_embeddings"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "analytics_events",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("actor", sa.String(length=128), nullable=False),
        sa.Column("action", sa.String(length=32), nullable=False),
        sa.Column("object_type", sa.String(length=64), nullable=False),
        sa.Column("object_id", sa.String(length=128), nullable=False),
        sa.Column("tenant_id", sa.Uuid(), nullable=True),
        sa.Column("event_time", sa.DateTime(), nullable=False),
        sa.Column("extensions", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_analytics_events_actor", "analytics_events", ["actor"])
    op.create_index("ix_analytics_events_action", "analytics_events", ["action"])
    op.create_index("ix_analytics_events_tenant_id", "analytics_events", ["tenant_id"])
    op.create_index("ix_analytics_events_event_time", "analytics_events", ["event_time"])


def downgrade() -> None:
    op.drop_index("ix_analytics_events_event_time", table_name="analytics_events")
    op.drop_index("ix_analytics_events_tenant_id", table_name="analytics_events")
    op.drop_index("ix_analytics_events_action", table_name="analytics_events")
    op.drop_index("ix_analytics_events_actor", table_name="analytics_events")
    op.drop_table("analytics_events")
