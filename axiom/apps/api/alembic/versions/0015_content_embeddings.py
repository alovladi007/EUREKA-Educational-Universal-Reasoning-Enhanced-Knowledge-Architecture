"""pgvector content embeddings

Adds the content_embeddings table backing the copilot's pgvector semantic store
(Build Prompt Section 5). The embedding column is a pgvector vector(256), matching
the default hashed embedder's dimension; retrieval ranks by cosine distance with
the <=> operator in Postgres. Managed by raw SQL (not the ORM Base) because the
pgvector type has no SQLite equivalent and the test suite builds its schema on
SQLite. CREATE EXTENSION is idempotent so the migration is safe on a fresh CI
Postgres.

Revision ID: 0015_content_embeddings
Revises: 0014_curriculum_proof_extension
Create Date: 2026-07-07 00:40:00.000000
"""

from collections.abc import Sequence

from alembic import op

revision: str = "0015_content_embeddings"
down_revision: str | None = "0014_curriculum_proof_extension"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    op.execute(
        """
        CREATE TABLE content_embeddings (
            id UUID PRIMARY KEY,
            node_id UUID NULL,
            kind VARCHAR(16) NOT NULL,
            source VARCHAR(200) NOT NULL,
            title TEXT NOT NULL,
            body TEXT NOT NULL,
            embedding vector(256) NOT NULL
        )
        """
    )
    op.execute("CREATE INDEX ix_content_embeddings_node_id ON content_embeddings (node_id)")


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS content_embeddings")
