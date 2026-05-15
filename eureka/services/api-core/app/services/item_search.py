"""
Item search (Phase 5 Session 5.7, 2026-05).

Hybrid search across the item bank:

  - KEYWORD     Postgres full-text search over the items.content JSONB
                projection + explanation. Uses the GIN index from
                08_item_bank.sql. Cheap and exact-match-friendly.

  - SEMANTIC    pgvector cosine distance over item_embeddings. Catches
                paraphrases / cross-language matches. Embeddings are
                generated on the fly here (synchronous) using either a
                local sentence-transformer model OR a stub that
                hashes-to-vector for CI when no model is available.

  - SKILL BOOST When a skill_id (or framework) filter is supplied, items
                tagged into that skill get a multiplicative boost. Uses
                the content_skills table from Phase 4.2.

The two ranked lists are fused with Reciprocal Rank Fusion (RRF), a
standard parameter-free fusion that's surprisingly hard to beat.

Note on embeddings: this module accepts an optional callable
`embed_fn(text) -> list[float]` so callers can inject real embedding
backends (OpenAI, bge, Anthropic when available) at boot. The default
is a deterministic hash-based pseudo-embedding so the code path runs
end-to-end in CI / dev without an embedding model. Phase 6.1 (RAG)
will swap this for the real pipeline.
"""

from __future__ import annotations

import hashlib
from dataclasses import dataclass, field
from typing import Callable
from uuid import UUID

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


DEFAULT_EMBED_MODEL = "stub-sha256-1024"
EMBED_DIM = 1024


def _stub_embedding(s: str) -> list[float]:
    """
    Deterministic 1024-dim "embedding" derived from sha256 of the text.
    Useless for semantic quality but lets every code path run in CI
    without a model. Real embeddings replace this in Phase 6.1.
    """
    h = hashlib.sha256(s.encode()).digest()
    # tile the 32 bytes 32× to reach 1024 dims, normalised to [-1, 1].
    arr = []
    for i in range(EMBED_DIM):
        b = h[i % len(h)]
        arr.append((b - 127.5) / 127.5)
    # L2-normalise for cosine sanity
    import math
    norm = math.sqrt(sum(x * x for x in arr)) or 1.0
    return [x / norm for x in arr]


@dataclass
class HybridHit:
    item_id: UUID
    score: float
    keyword_rank: int | None = None
    semantic_rank: int | None = None
    skill_boost: float = 0.0
    debug: dict = field(default_factory=dict)


def _rrf(rank: int | None, k: float = 60.0) -> float:
    """Reciprocal Rank Fusion contribution. None → 0."""
    if rank is None:
        return 0.0
    return 1.0 / (k + rank)


async def _keyword_ranked(
    db: AsyncSession,
    query: str,
    limit: int,
    bank_id: UUID | None,
    framework_filter: str | None,
) -> list[tuple[UUID, float]]:
    sql = """
        SELECT i.id,
               ts_rank_cd(
                 to_tsvector('english',
                   COALESCE(i.content->>'stem', '') || ' ' ||
                   COALESCE(i.content->>'vignette', '') || ' ' ||
                   COALESCE(i.explanation, '')),
                 plainto_tsquery('english', :q)
               ) AS rank
        FROM items i
        JOIN item_banks b ON b.id = i.bank_id
        WHERE i.deleted_at IS NULL
          AND i.review_status IN ('approved', 'draft')
          AND to_tsvector('english',
                COALESCE(i.content->>'stem', '') || ' ' ||
                COALESCE(i.content->>'vignette', '') || ' ' ||
                COALESCE(i.explanation, ''))
              @@ plainto_tsquery('english', :q)
    """
    params: dict = {"q": query, "limit": limit}
    if bank_id is not None:
        sql += " AND i.bank_id = :bank_id"
        params["bank_id"] = str(bank_id)
    if framework_filter:
        sql += " AND b.framework = :fw"
        params["fw"] = framework_filter
    sql += " ORDER BY rank DESC LIMIT :limit"
    r = await db.execute(text(sql), params)
    return [(row[0], float(row[1])) for row in r.fetchall()]


async def _semantic_ranked(
    db: AsyncSession,
    query: str,
    limit: int,
    bank_id: UUID | None,
    framework_filter: str | None,
    embed_fn: Callable[[str], list[float]],
    model: str,
) -> list[tuple[UUID, float]]:
    """
    pgvector cosine-distance ranking. Items without an embedding for
    this model are skipped silently (they'll surface via keyword instead).
    """
    qvec = embed_fn(query)
    # Postgres vector literal: "[v1,v2,...]"
    vec_lit = "[" + ",".join(f"{x:.6f}" for x in qvec) + "]"

    sql = """
        SELECT i.id,
               1 - (e.embedding <=> :qvec ::vector) AS score
        FROM item_embeddings e
        JOIN items i ON i.id = e.item_id
        JOIN item_banks b ON b.id = i.bank_id
        WHERE e.model = :model
          AND i.deleted_at IS NULL
          AND i.review_status IN ('approved', 'draft')
    """
    params: dict = {"qvec": vec_lit, "model": model, "limit": limit}
    if bank_id is not None:
        sql += " AND i.bank_id = :bank_id"
        params["bank_id"] = str(bank_id)
    if framework_filter:
        sql += " AND b.framework = :fw"
        params["fw"] = framework_filter
    sql += " ORDER BY e.embedding <=> :qvec ::vector ASC LIMIT :limit"
    try:
        r = await db.execute(text(sql), params)
        return [(row[0], float(row[1])) for row in r.fetchall()]
    except Exception:
        # pgvector ops may be unavailable on a deployment; just degrade.
        return []


async def _skill_tag_boost(
    db: AsyncSession,
    item_ids: list[UUID],
    skill_id: UUID | None,
) -> dict[UUID, float]:
    """If the caller filtered by a skill_id, give every tagged item +0.1."""
    if not item_ids or skill_id is None:
        return {}
    r = await db.execute(
        text(
            """
            SELECT content_id
            FROM content_skills
            WHERE skill_id = :sid
              AND content_kind = 'question'
              AND content_id = ANY(:ids)
            """
        ),
        {"sid": str(skill_id), "ids": [str(i) for i in item_ids]},
    )
    return {row[0]: 0.1 for row in r.fetchall()}


async def hybrid_search(
    db: AsyncSession,
    *,
    query: str,
    limit: int = 20,
    bank_id: UUID | None = None,
    framework_filter: str | None = None,
    skill_id: UUID | None = None,
    embed_fn: Callable[[str], list[float]] | None = None,
    embed_model: str = DEFAULT_EMBED_MODEL,
) -> list[HybridHit]:
    """
    Returns up to `limit` items ranked by RRF fusion of keyword + semantic
    + skill-tag-boost. Empty result is a valid response (no items match).
    """
    embed_fn = embed_fn or _stub_embedding
    pool = max(limit * 3, 30)  # fetch a wider pool from each channel for RRF

    kw = await _keyword_ranked(db, query, pool, bank_id, framework_filter)
    sem = await _semantic_ranked(
        db, query, pool, bank_id, framework_filter, embed_fn, embed_model
    )

    kw_rank = {iid: i + 1 for i, (iid, _) in enumerate(kw)}
    sem_rank = {iid: i + 1 for i, (iid, _) in enumerate(sem)}

    all_ids = list(set(kw_rank) | set(sem_rank))
    boosts = await _skill_tag_boost(db, all_ids, skill_id)

    hits: list[HybridHit] = []
    for iid in all_ids:
        score = _rrf(kw_rank.get(iid)) + _rrf(sem_rank.get(iid)) + boosts.get(iid, 0.0)
        hits.append(
            HybridHit(
                item_id=iid,
                score=score,
                keyword_rank=kw_rank.get(iid),
                semantic_rank=sem_rank.get(iid),
                skill_boost=boosts.get(iid, 0.0),
            )
        )
    hits.sort(key=lambda h: h.score, reverse=True)
    return hits[:limit]


async def upsert_item_embedding(
    db: AsyncSession,
    item_id: UUID,
    text_to_embed: str,
    *,
    embed_fn: Callable[[str], list[float]] | None = None,
    model: str = DEFAULT_EMBED_MODEL,
) -> None:
    """Compute and store an embedding for a single item. Idempotent."""
    embed_fn = embed_fn or _stub_embedding
    vec = embed_fn(text_to_embed)
    vec_lit = "[" + ",".join(f"{x:.6f}" for x in vec) + "]"
    text_hash = hashlib.sha256(text_to_embed.encode()).hexdigest()
    await db.execute(
        text(
            """
            INSERT INTO item_embeddings (item_id, model, embedding, text_hash)
            VALUES (:iid, :model, :vec ::vector, :hash)
            ON CONFLICT (item_id, model) DO UPDATE SET
                embedding = EXCLUDED.embedding,
                text_hash = EXCLUDED.text_hash,
                created_at = CURRENT_TIMESTAMP
            """
        ),
        {"iid": str(item_id), "model": model, "vec": vec_lit, "hash": text_hash},
    )
