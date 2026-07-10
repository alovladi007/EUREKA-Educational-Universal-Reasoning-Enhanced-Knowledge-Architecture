"""widen content_embeddings to 384 dimensions

The default embedding model becomes the real all-MiniLM-L6-v2 (384-dim) in
deployment, so the pgvector column is widened from vector(256) (the hashed
embedder) to vector(384). The store is a rebuildable cache -- retrieval
recomputes it -- so the column is dropped and recreated rather than converted.
A deployment that keeps the hashed embedder sets embedding_dim=256 and the store
simply skips (falling back to in-memory retrieval); it does not require this
column width. Raw SQL, matching migration 0015 (pgvector has no SQLite
equivalent, so the test suite never runs this).

Revision ID: 0020_embeddings_384
Revises: 0019_compliance
Create Date: 2026-07-10 01:30:00.000000
"""

from collections.abc import Sequence

from alembic import op

revision: str = "0020_embeddings_384"
down_revision: str | None = "0019_compliance"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("DROP TABLE IF EXISTS content_embeddings")
    op.execute(
        """
        CREATE TABLE content_embeddings (
            id UUID PRIMARY KEY,
            node_id UUID NULL,
            kind VARCHAR(16) NOT NULL,
            source VARCHAR(200) NOT NULL,
            title TEXT NOT NULL,
            body TEXT NOT NULL,
            embedding vector(384) NOT NULL
        )
        """
    )
    op.execute("CREATE INDEX ix_content_embeddings_node_id ON content_embeddings (node_id)")


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS content_embeddings")
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
