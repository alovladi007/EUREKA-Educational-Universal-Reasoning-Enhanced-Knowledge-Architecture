"""pgvector semantic store and the swappable embedding provider (Section 5).

The provider interface and the fail-soft behavior are exercised here on the
SQLite test database, where the pgvector table does not exist: the store must
degrade safely (return empty / zero) so retrieval falls back to the in-memory
ranker instead of raising. The real cosine-distance ranking is verified live
against Postgres, not here.
"""

from __future__ import annotations

import math

from app.domains.copilot import pgvector_store
from app.domains.copilot.embeddings import (
    HashEmbeddingProvider,
    get_embedding_provider,
)


def test_default_embedding_provider_is_hash_256():
    get_embedding_provider.cache_clear()
    provider = get_embedding_provider()
    assert isinstance(provider, HashEmbeddingProvider)
    assert provider.dimension == 256
    vec = provider.embed("quadratic equations")
    assert len(vec) == 256
    # The hashed embedder L2-normalizes, so a non-empty text has unit norm.
    norm = math.sqrt(sum(v * v for v in vec))
    assert abs(norm - 1.0) < 1e-6


async def test_pgvector_store_fails_soft_without_table(db_session):
    # SQLite has no content_embeddings table, so every store call degrades to a
    # safe default rather than raising. This is what lets retrieval fall back to
    # the in-memory ranker when the store is unavailable.
    assert await pgvector_store.count(db_session) == 0
    assert await pgvector_store.search(db_session, "quadratic", None, 4) == []
    assert await pgvector_store.rebuild(db_session) == 0
