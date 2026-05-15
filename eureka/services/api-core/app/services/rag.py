"""
RAG (Phase 6 Session 6.1, 2026-05).

Three responsibilities:
  1. INGEST  walk the item bank + skill graph and write knowledge_chunks
             rows (text + embedding + source_uri). Idempotent on text_hash.
  2. RETRIEVE  hybrid keyword + semantic + skill-boost across
             knowledge_chunks, fused via Reciprocal Rank Fusion.
  3. GROUNDEDNESS  given an LLM answer and a set of retrieved chunks,
             return a 0..1 score for how much of the answer is supported
             by the retrieved context.

We share the same stub embedding from item_search (sha256→1024-dim) so
the path runs end-to-end in CI / dev. Phase 6.5 swaps for a real backend.
"""

from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass
from typing import Callable
from uuid import UUID

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.agent import ChunkSourceKind, KnowledgeChunk
from app.models.item_bank import Item
from app.models.skill import Skill
from app.services.item_search import _stub_embedding, DEFAULT_EMBED_MODEL


# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------


@dataclass
class RetrievedChunk:
    chunk_id: UUID
    source_uri: str
    text: str
    framework: str | None
    skill_id: UUID | None
    score: float
    keyword_rank: int | None = None
    semantic_rank: int | None = None
    skill_boost: float = 0.0

    def to_citation(self) -> dict:
        return {
            "chunk_id": str(self.chunk_id),
            "source_uri": self.source_uri,
            "text_excerpt": self.text[:240],
        }


@dataclass
class GroundednessReport:
    score: float                  # 0..1 fraction of factual claims supported
    supported_claims: int
    total_claims: int
    unsupported: list[str]        # claims with no supporting chunk
    notes: str = ""


# ---------------------------------------------------------------------------
# INGEST
# ---------------------------------------------------------------------------


def _chunk_text_for_embedding(text_value: str) -> str:
    return re.sub(r"\s+", " ", text_value).strip()


async def upsert_chunk(
    db: AsyncSession,
    *,
    source_kind: ChunkSourceKind,
    source_uri: str,
    text_value: str,
    source_id: UUID | None = None,
    tier: str | None = None,
    framework: str | None = None,
    skill_id: UUID | None = None,
    license_: str = "EUREKA-Internal",
    attribution: str | None = None,
    embed_fn: Callable[[str], list[float]] | None = None,
) -> UUID:
    """
    Insert-or-update a knowledge chunk. Idempotent on source_uri:
    re-running with the same URI updates the text + embedding in place.
    Returns the chunk id.
    """
    embed_fn = embed_fn or _stub_embedding
    cleaned = _chunk_text_for_embedding(text_value)
    text_hash = hashlib.sha256(cleaned.encode()).hexdigest()
    vec = embed_fn(cleaned)
    vec_lit = "[" + ",".join(f"{x:.6f}" for x in vec) + "]"

    r = await db.execute(
        text(
            """
            INSERT INTO knowledge_chunks (
              source_kind, source_uri, source_id, text, tier, framework,
              skill_id, embedding, text_hash, license, attribution
            ) VALUES (
              :sk, :uri, :sid, :txt, :tier, :fw, :skill, :emb ::vector, :hash, :lic, :att
            )
            ON CONFLICT (source_uri) DO UPDATE SET
              text = EXCLUDED.text,
              embedding = EXCLUDED.embedding,
              text_hash = EXCLUDED.text_hash,
              skill_id = EXCLUDED.skill_id,
              updated_at = CURRENT_TIMESTAMP
            RETURNING id
            """
        ),
        {
            "sk": source_kind.value if hasattr(source_kind, "value") else source_kind,
            "uri": source_uri,
            "sid": str(source_id) if source_id else None,
            "txt": cleaned,
            "tier": tier,
            "fw": framework,
            "skill": str(skill_id) if skill_id else None,
            "emb": vec_lit,
            "hash": text_hash,
            "lic": license_,
            "att": attribution,
        },
    )
    return r.scalar_one()


async def ingest_item_bank(db: AsyncSession) -> int:
    """Walk every approved item and upsert two chunks (stem, explanation).
    Returns number of chunks written."""
    from app.models.item_bank import ItemBank

    r = await db.execute(
        select(Item, ItemBank)
        .join(ItemBank, ItemBank.id == Item.bank_id)
        .where(Item.deleted_at.is_(None))
    )
    n = 0
    for item, bank in r.all():
        stem = (item.content or {}).get("stem") or (item.content or {}).get("vignette") or ""
        if stem:
            await upsert_chunk(
                db,
                source_kind=ChunkSourceKind.ITEM_STEM,
                source_uri=f"urn:eureka:item:{item.id}:stem",
                source_id=item.id,
                text_value=stem,
                tier=bank.tier,
                framework=bank.framework.value if hasattr(bank.framework, "value") else bank.framework,
                license_=bank.default_license,
                attribution=bank.default_attribution,
            )
            n += 1
        if item.explanation:
            await upsert_chunk(
                db,
                source_kind=ChunkSourceKind.ITEM_EXPLANATION,
                source_uri=f"urn:eureka:item:{item.id}:explanation",
                source_id=item.id,
                text_value=item.explanation,
                tier=bank.tier,
                framework=bank.framework.value if hasattr(bank.framework, "value") else bank.framework,
                license_=bank.default_license,
                attribution=bank.default_attribution,
            )
            n += 1
    return n


async def ingest_skill_graph(db: AsyncSession) -> int:
    """Skill descriptions become chunks so the tutor can pull definitions."""
    r = await db.execute(select(Skill).where(Skill.is_active.is_(True)))
    n = 0
    for s in r.scalars().all():
        if not s.description and not s.name:
            continue
        text_value = f"{s.name}. {s.description or ''}"
        await upsert_chunk(
            db,
            source_kind=ChunkSourceKind.SKILL_DESCRIPTION,
            source_uri=f"urn:eureka:skill:{(s.framework.value if hasattr(s.framework,'value') else s.framework)}:{s.code}",
            source_id=s.id,
            text_value=text_value,
            tier=s.tier,
            framework=s.framework.value if hasattr(s.framework, "value") else s.framework,
            skill_id=s.id,
            license_="EUREKA-Internal",
        )
        n += 1
    return n


# ---------------------------------------------------------------------------
# RETRIEVE
# ---------------------------------------------------------------------------


def _rrf(rank: int | None, k: float = 60.0) -> float:
    return 0.0 if rank is None else 1.0 / (k + rank)


async def retrieve(
    db: AsyncSession,
    *,
    query: str,
    limit: int = 8,
    framework_filter: str | None = None,
    skill_id: UUID | None = None,
    embed_fn: Callable[[str], list[float]] | None = None,
) -> list[RetrievedChunk]:
    """Hybrid keyword + semantic retrieval over knowledge_chunks."""
    embed_fn = embed_fn or _stub_embedding
    pool = max(limit * 3, 30)

    # Keyword
    kw_sql = """
        SELECT id,
               ts_rank_cd(to_tsvector('english', text), plainto_tsquery('english', :q)) AS rank
        FROM knowledge_chunks
        WHERE is_active
          AND to_tsvector('english', text) @@ plainto_tsquery('english', :q)
    """
    params: dict = {"q": query, "limit": pool}
    if framework_filter:
        kw_sql += " AND framework = :fw"
        params["fw"] = framework_filter
    kw_sql += " ORDER BY rank DESC LIMIT :limit"
    kw_r = await db.execute(text(kw_sql), params)
    kw = [(row[0], float(row[1])) for row in kw_r.fetchall()]

    # Semantic
    qvec = embed_fn(query)
    vec_lit = "[" + ",".join(f"{x:.6f}" for x in qvec) + "]"
    sem_sql = """
        SELECT id, 1 - (embedding <=> :v ::vector) AS score
        FROM knowledge_chunks
        WHERE is_active
    """
    sem_params: dict = {"v": vec_lit, "limit": pool}
    if framework_filter:
        sem_sql += " AND framework = :fw"
        sem_params["fw"] = framework_filter
    sem_sql += " ORDER BY embedding <=> :v ::vector ASC LIMIT :limit"
    try:
        sem_r = await db.execute(text(sem_sql), sem_params)
        sem = [(row[0], float(row[1])) for row in sem_r.fetchall()]
    except Exception:
        sem = []

    kw_rank = {iid: i + 1 for i, (iid, _) in enumerate(kw)}
    sem_rank = {iid: i + 1 for i, (iid, _) in enumerate(sem)}
    all_ids = list(set(kw_rank) | set(sem_rank))

    # Skill boost
    boost: dict = {}
    if skill_id is not None and all_ids:
        b_r = await db.execute(
            text("SELECT id FROM knowledge_chunks WHERE id = ANY(:ids) AND skill_id = :sid"),
            {"ids": [str(i) for i in all_ids], "sid": str(skill_id)},
        )
        boost = {row[0]: 0.1 for row in b_r.fetchall()}

    if not all_ids:
        return []

    # Hydrate
    hyd_r = await db.execute(
        select(KnowledgeChunk).where(KnowledgeChunk.id.in_(all_ids))
    )
    chunks_by_id = {c.id: c for c in hyd_r.scalars().all()}

    out = []
    for iid in all_ids:
        ch = chunks_by_id.get(iid)
        if ch is None:
            continue
        score = _rrf(kw_rank.get(iid)) + _rrf(sem_rank.get(iid)) + boost.get(iid, 0.0)
        out.append(
            RetrievedChunk(
                chunk_id=ch.id,
                source_uri=ch.source_uri,
                text=ch.text,
                framework=(ch.framework.value if hasattr(ch.framework, "value") else ch.framework) if ch.framework else None,
                skill_id=ch.skill_id,
                score=score,
                keyword_rank=kw_rank.get(iid),
                semantic_rank=sem_rank.get(iid),
                skill_boost=boost.get(iid, 0.0),
            )
        )
    out.sort(key=lambda r: r.score, reverse=True)
    return out[:limit]


# ---------------------------------------------------------------------------
# GROUNDEDNESS (6.4)
# ---------------------------------------------------------------------------

_SENTENCE_SPLIT = re.compile(r"(?<=[.!?])\s+")


def _split_claims(text_value: str) -> list[str]:
    """Naive claim splitter — one sentence ≈ one claim. Phase 6.4b
    swaps in an NLI-style decomposer."""
    raw = _SENTENCE_SPLIT.split((text_value or "").strip())
    return [c.strip() for c in raw if len(c.strip()) >= 12]


def _shingles(s: str, n: int = 4) -> set[str]:
    """Word n-grams; cheap stand-in for entailment until 6.4b lands."""
    words = re.findall(r"[A-Za-z0-9]+", s.lower())
    if len(words) < n:
        return {" ".join(words)} if words else set()
    return {" ".join(words[i : i + n]) for i in range(len(words) - n + 1)}


def groundedness(answer: str, chunks: list[RetrievedChunk]) -> GroundednessReport:
    """
    Decompose the answer into sentence-level claims; for each claim count
    it as 'supported' if any retrieved chunk shares ≥ 1 word-4gram with
    it. This is a shallow stand-in for a proper NLI model — it catches
    blatant invention but isn't fooled-proof. The Phase 6.4b follow-up
    plugs in an actual entailment classifier.

    Returns a report; callers persist the .score on agent_messages and
    can decide to warn the learner / re-retrieve / refuse.
    """
    claims = _split_claims(answer)
    if not claims:
        return GroundednessReport(score=1.0, supported_claims=0, total_claims=0, unsupported=[])

    chunk_shingles = set()
    for c in chunks:
        chunk_shingles |= _shingles(c.text)

    supported = 0
    unsupported: list[str] = []
    for claim in claims:
        if _shingles(claim) & chunk_shingles:
            supported += 1
        else:
            unsupported.append(claim)
    score = supported / len(claims)
    return GroundednessReport(
        score=score,
        supported_claims=supported,
        total_claims=len(claims),
        unsupported=unsupported,
        notes="shingle-overlap heuristic; replace with NLI in Phase 6.4b",
    )
