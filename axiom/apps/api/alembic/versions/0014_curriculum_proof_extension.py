"""curriculum and proof extension foundation

Foundation schema for the Curriculum and Proof Extension:
  - knowledge_nodes gains kind (node taxonomy), tier (0-6), and track (applied /
    pure) so the graph can carry computational skills, concepts, proof
    techniques, and theorem-with-proof nodes.
  - mastery_states gains a signal column (apply vs prove) and its uniqueness
    widens to (user_id, node_id, signal), so proof-based nodes track "can apply"
    and "can prove" as separate competences.
  - mastery_events gains signal, grader, and grader_confidence so every piece of
    evidence records which grader produced it and how much to trust it.
  - math_definitions and math_theorems are the per-course, per-tenant reference
    library the proof content and copilot retrieve from.

Hand-written for zero schema drift.

Revision ID: 0014_curriculum_proof_extension
Revises: 0013_tutoring
Create Date: 2026-07-06 18:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0014_curriculum_proof_extension"
down_revision: str | None = "0013_tutoring"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # knowledge_nodes: node taxonomy + tier + track.
    op.add_column(
        "knowledge_nodes",
        sa.Column(
            "kind",
            sa.String(length=24),
            nullable=False,
            server_default="computational_skill",
        ),
    )
    op.add_column("knowledge_nodes", sa.Column("tier", sa.Integer(), nullable=True))
    op.add_column("knowledge_nodes", sa.Column("track", sa.String(length=16), nullable=True))

    # mastery_states: prove-vs-apply signal, widen the uniqueness.
    op.add_column(
        "mastery_states",
        sa.Column("signal", sa.String(length=8), nullable=False, server_default="apply"),
    )
    op.drop_constraint("uq_mastery_user_node", "mastery_states", type_="unique")
    op.create_unique_constraint(
        "uq_mastery_user_node_signal", "mastery_states", ["user_id", "node_id", "signal"]
    )

    # mastery_events: signal + grader trust.
    op.add_column(
        "mastery_events",
        sa.Column("signal", sa.String(length=8), nullable=False, server_default="apply"),
    )
    op.add_column("mastery_events", sa.Column("grader", sa.String(length=16), nullable=True))
    op.add_column(
        "mastery_events",
        sa.Column(
            "grader_confidence", sa.Float(), nullable=False, server_default="1.0"
        ),
    )

    # Definition reference library.
    op.create_table(
        "math_definitions",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("tenant_id", sa.Uuid(), nullable=True),
        sa.Column("course_code", sa.String(length=64), nullable=False, server_default=""),
        sa.Column(
            "node_id",
            sa.Uuid(),
            sa.ForeignKey("knowledge_nodes.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("term", sa.String(length=200), nullable=False),
        sa.Column("statement", sa.Text(), nullable=False),
        sa.Column("notation", sa.String(length=500), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("tenant_id", "course_code", "term", name="uq_definition_term"),
    )
    op.create_index("ix_math_definitions_tenant_id", "math_definitions", ["tenant_id"])
    op.create_index("ix_math_definitions_node_id", "math_definitions", ["node_id"])

    # Theorem reference library.
    op.create_table(
        "math_theorems",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("tenant_id", sa.Uuid(), nullable=True),
        sa.Column("course_code", sa.String(length=64), nullable=False, server_default=""),
        sa.Column(
            "node_id",
            sa.Uuid(),
            sa.ForeignKey("knowledge_nodes.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("statement", sa.Text(), nullable=False),
        sa.Column("proof_sketch", sa.Text(), nullable=False, server_default=""),
        sa.Column("techniques", sa.JSON(), nullable=False),
        sa.Column("depends_on", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("tenant_id", "course_code", "name", name="uq_theorem_name"),
    )
    op.create_index("ix_math_theorems_tenant_id", "math_theorems", ["tenant_id"])
    op.create_index("ix_math_theorems_node_id", "math_theorems", ["node_id"])


def downgrade() -> None:
    op.drop_index("ix_math_theorems_node_id", table_name="math_theorems")
    op.drop_index("ix_math_theorems_tenant_id", table_name="math_theorems")
    op.drop_table("math_theorems")
    op.drop_index("ix_math_definitions_node_id", table_name="math_definitions")
    op.drop_index("ix_math_definitions_tenant_id", table_name="math_definitions")
    op.drop_table("math_definitions")

    op.drop_column("mastery_events", "grader_confidence")
    op.drop_column("mastery_events", "grader")
    op.drop_column("mastery_events", "signal")

    op.drop_constraint("uq_mastery_user_node_signal", "mastery_states", type_="unique")
    op.create_unique_constraint(
        "uq_mastery_user_node", "mastery_states", ["user_id", "node_id"]
    )
    op.drop_column("mastery_states", "signal")

    op.drop_column("knowledge_nodes", "track")
    op.drop_column("knowledge_nodes", "tier")
    op.drop_column("knowledge_nodes", "kind")
