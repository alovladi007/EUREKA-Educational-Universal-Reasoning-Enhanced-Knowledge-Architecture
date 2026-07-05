"""phase 3 copilot sessions and messages

Adds the two tables backing the AI-assisted copilot:
  - copilot_sessions: a threaded tutoring conversation, optionally anchored to a
    skill node so retrieval stays on-topic.
  - copilot_messages: each turn, recording the speaker, the text, the reasoning
    provider for assistant turns, and the grounding sources, so every
    AI-assisted reply is auditable.

Hand-written so applying it leaves zero schema drift against the ORM models.

Revision ID: 0005_copilot
Revises: 0004_identity_reconcile
Create Date: 2026-07-05 23:15:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0005_copilot"
down_revision: str | None = "0004_identity_reconcile"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "copilot_sessions",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("node_id", sa.Uuid(), nullable=True),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["node_id"], ["knowledge_nodes.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_copilot_sessions_user_id"), "copilot_sessions", ["user_id"], unique=False
    )

    op.create_table(
        "copilot_messages",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("session_id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("role", sa.String(length=16), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("provider", sa.String(length=24), nullable=False),
        sa.Column("sources", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["session_id"], ["copilot_sessions.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_copilot_messages_session_id"), "copilot_messages", ["session_id"], unique=False
    )
    op.create_index(
        op.f("ix_copilot_messages_user_id"), "copilot_messages", ["user_id"], unique=False
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_copilot_messages_user_id"), table_name="copilot_messages")
    op.drop_index(op.f("ix_copilot_messages_session_id"), table_name="copilot_messages")
    op.drop_table("copilot_messages")

    op.drop_index(op.f("ix_copilot_sessions_user_id"), table_name="copilot_sessions")
    op.drop_table("copilot_sessions")
