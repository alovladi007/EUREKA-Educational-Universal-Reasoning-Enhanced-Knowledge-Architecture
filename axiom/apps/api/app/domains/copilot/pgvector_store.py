"""pgvector-backed semantic store for copilot retrieval (Build Prompt Section 5).

The curriculum corpus (skill nodes, lesson summaries, lesson steps, item worked
explanations) is embedded once and stored in a Postgres `content_embeddings`
table whose `embedding` column is a pgvector `vector`. Retrieval then ranks by
cosine distance IN the database with the `<=>` operator, instead of embedding
every candidate in Python on each request.

This module is deliberately raw-SQL and NOT an ORM model: the pgvector column
type has no SQLite equivalent, and the test suite builds its schema from the ORM
Base on SQLite. Keeping the table out of the Base means tests stay green and the
pgvector path is exercised only where it is real (Postgres). The table is created
by migration 0015. All functions fail soft (return empty / no-op) when the table
or extension is absent, so enabling the store without the migration never breaks
retrieval -- the caller falls back to the in-memory ranker.

Dimension note: the column is `vector(256)` to match the default hashed embedder.
Switching AXIOM_EMBEDDING_PROVIDER to a model of a different dimension requires a
matching column (a follow-up migration); the rebuild guards against a mismatch.
"""

from __future__ import annotations

import logging
import uuid

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.assessment.models import Item
from app.domains.content.models import ContentStep, Lesson
from app.domains.copilot.embeddings import get_embedding_provider
from app.domains.curriculum.models import KnowledgeNode

log = logging.getLogger("axiom.copilot")

# The vector(N) dimension of the content_embeddings column. It must match both
# the active embedding provider's output and the column the migrations created
# (256 for the hashed embedder, 384 for all-MiniLM-L6-v2). Config-driven so the
# store follows the configured embedding model; when it does not match the
# provider, rebuild/search skip and retrieval falls back to the in-memory path.
def _store_dim() -> int:
    from app.core.config import get_settings

    return int(getattr(get_settings(), "embedding_dim", 256))


def _to_vector_literal(vec: list[float]) -> str:
    """Format a vector as the pgvector text literal '[v1,v2,...]'."""
    return "[" + ",".join(f"{x:.6f}" for x in vec) + "]"


async def rebuild(session: AsyncSession) -> int:
    """Recompute and store embeddings for the whole curriculum corpus.

    Full-rebuild semantics: the table is cleared and repopulated, which is fine
    for a corpus this size and keeps the store consistent with the content. Rows
    carry the owning node_id so retrieval can scope to a node. Returns the number
    of rows written, or 0 if the store is unavailable or the provider dimension
    does not match the column.
    """
    provider = get_embedding_provider()
    if provider.dimension != _store_dim():
        log.warning(
            "embedding dimension %s != store dimension %s; skipping pgvector rebuild",
            provider.dimension,
            _store_dim(),
        )
        return 0

    rows = await _corpus(session)
    try:
        await session.execute(text("DELETE FROM content_embeddings"))
        for node_id, kind, source, title, body in rows:
            vec = provider.embed(f"{title} {body}")
            await session.execute(
                text(
                    "INSERT INTO content_embeddings "
                    "(id, node_id, kind, source, title, body, embedding) VALUES "
                    "(:id, :node_id, :kind, :source, :title, :body, "
                    "CAST(:embedding AS vector))"
                ),
                {
                    "id": uuid.uuid4(),
                    "node_id": node_id,
                    "kind": kind,
                    "source": source,
                    "title": title,
                    "body": body,
                    "embedding": _to_vector_literal(vec),
                },
            )
        await session.flush()
        return len(rows)
    except Exception as exc:  # noqa: BLE001 - table/extension missing: fail soft
        log.warning("pgvector rebuild skipped: %s", exc)
        return 0


async def search(
    session: AsyncSession,
    query: str,
    node_id: uuid.UUID | None,
    limit: int,
    include_items: bool = True,
) -> list[tuple[str, str, str, str]]:
    """Rank stored passages by cosine distance to the query in Postgres.

    Returns (source, kind, title, body) rows nearest to the query, scoped to a
    node when given. include_items=False excludes answer-bearing worked examples,
    matching the hint flow's rule. Returns [] if the store is empty or
    unavailable, so the caller can fall back to the in-memory ranker.
    """
    provider = get_embedding_provider()
    if provider.dimension != _store_dim():
        return []
    qvec = _to_vector_literal(provider.embed(query or ""))
    filters = []
    if node_id is not None:
        filters.append("node_id = :node_id")
    if not include_items:
        filters.append("kind <> 'item'")
    where = ("WHERE " + " AND ".join(filters) + " ") if filters else ""
    sql = (
        "SELECT source, kind, title, body FROM content_embeddings "
        + where
        + "ORDER BY embedding <=> CAST(:q AS vector) LIMIT :limit"
    )
    params: dict = {"q": qvec, "limit": limit}
    if node_id is not None:
        params["node_id"] = node_id
    try:
        result = await session.execute(text(sql), params)
        return [(r[0], r[1], r[2], r[3]) for r in result.all()]
    except Exception as exc:  # noqa: BLE001 - table/extension missing: fail soft
        log.warning("pgvector search skipped: %s", exc)
        return []


async def count(session: AsyncSession) -> int:
    """Number of stored embedding rows, or 0 if the table is unavailable."""
    try:
        result = await session.execute(text("SELECT count(*) FROM content_embeddings"))
        return int(result.scalar_one())
    except Exception:  # noqa: BLE001
        return 0


async def _corpus(session: AsyncSession) -> list[tuple[uuid.UUID | None, str, str, str, str]]:
    """Collect (node_id, kind, source, title, body) for every corpus passage."""
    out: list[tuple[uuid.UUID | None, str, str, str, str]] = []

    nodes = (await session.execute(select(KnowledgeNode))).scalars().all()
    for node in nodes:
        out.append((node.id, "node", f"Skill: {node.title}", node.title, node.description))

    lessons = (await session.execute(select(Lesson))).scalars().all()
    lesson_node = {le.id: le.node_id for le in lessons}
    for le in lessons:
        out.append((le.node_id, "lesson", f"Lesson: {le.title}", le.title, le.summary))

    steps = (await session.execute(select(ContentStep))).scalars().all()
    for st in steps:
        out.append(
            (lesson_node.get(st.lesson_id), "step", f"Lesson step: {st.title}", st.title, st.body)
        )

    items = (await session.execute(select(Item))).scalars().all()
    for it in items:
        if it.explanation:
            out.append((it.node_id, "item", "Worked example", it.prompt, it.explanation))
    return out
