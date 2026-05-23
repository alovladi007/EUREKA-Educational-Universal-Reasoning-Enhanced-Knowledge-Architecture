"""
Phase 16.2 — Research workspaces service layer.

Workspace + reference + draft helpers plus external lookups (CrossRef, arXiv)
and BibTeX export. None of these helpers touch HTTP — the endpoints layer
handles auth + 404 mapping.

DB triggers maintain reference_count / draft_count / last_activity_at, so
service helpers never bump those columns manually.
"""

from __future__ import annotations

import re
import xml.etree.ElementTree as ET
from typing import Any, Optional
from uuid import UUID

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.research import (
    LitReviewEntry,
    ReferenceSource,
    ResearchWorkspace,
    WorkspaceDraft,
)
from app.schemas.research import (
    DraftCreate,
    DraftUpdate,
    LitReviewEntryCreate,
    LitReviewEntryUpdate,
    WorkspaceCreate,
    WorkspaceUpdate,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _wc(body: str) -> int:
    """Cheap whitespace-tokenized word count."""
    if not body:
        return 0
    return len([w for w in body.split() if w.strip()])


def _safe_bibkey(authors: list[str], year: Optional[int]) -> str:
    """Produce a stable BibTeX citekey from the first author's last name + year."""
    last = "anon"
    if authors:
        # Author strings can be "Last, First" or "First Last" — handle both.
        first_author = authors[0].strip()
        if "," in first_author:
            last = first_author.split(",", 1)[0].strip()
        else:
            parts = first_author.split()
            last = parts[-1] if parts else "anon"
    last = re.sub(r"[^A-Za-z0-9]+", "", last) or "anon"
    yr = str(year) if year else "nd"
    return f"{last}{yr}"


def _format_bibtex(entry: LitReviewEntry) -> str:
    """Render a basic @article BibTeX entry from a LitReviewEntry."""
    citekey = _safe_bibkey(list(entry.authors or []), entry.year)
    parts: list[str] = [f"@article{{{citekey},"]
    parts.append(f"  title = {{{entry.title}}},")
    if entry.authors:
        parts.append(f"  author = {{{' and '.join(entry.authors)}}},")
    if entry.venue:
        parts.append(f"  journal = {{{entry.venue}}},")
    if entry.year:
        parts.append(f"  year = {{{entry.year}}},")
    if entry.doi:
        parts.append(f"  doi = {{{entry.doi}}},")
    if entry.arxiv_id:
        parts.append(f"  eprint = {{{entry.arxiv_id}}},")
        parts.append("  archivePrefix = {arXiv},")
    # Strip trailing comma on the last field for tidiness.
    if parts[-1].endswith(","):
        parts[-1] = parts[-1][:-1]
    parts.append("}")
    return "\n".join(parts)


# ---------------------------------------------------------------------------
# Workspaces
# ---------------------------------------------------------------------------


async def create_workspace(
    db: AsyncSession,
    *,
    user_id: UUID,
    payload: WorkspaceCreate,
) -> ResearchWorkspace:
    body = payload.model_dump(exclude_unset=False)
    ws = ResearchWorkspace(user_id=user_id, **body)
    db.add(ws)
    await db.flush()
    return ws


async def list_my_workspaces(
    db: AsyncSession,
    *,
    user_id: UUID,
    status: Optional[str] = None,
    kind: Optional[str] = None,
    limit: int = 100,
) -> list[ResearchWorkspace]:
    q = select(ResearchWorkspace).where(ResearchWorkspace.user_id == user_id)
    if status:
        q = q.where(ResearchWorkspace.status == status)
    if kind:
        q = q.where(ResearchWorkspace.kind == kind)
    q = q.order_by(ResearchWorkspace.last_activity_at.desc()).limit(limit)
    rows = (await db.execute(q)).scalars().all()
    return list(rows)


async def update_workspace(
    db: AsyncSession,
    *,
    workspace: ResearchWorkspace,
    payload: WorkspaceUpdate,
) -> ResearchWorkspace:
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(workspace, k, v)
    await db.flush()
    return workspace


async def delete_workspace(db: AsyncSession, *, workspace: ResearchWorkspace) -> None:
    await db.delete(workspace)
    await db.flush()


# ---------------------------------------------------------------------------
# References
# ---------------------------------------------------------------------------


async def add_reference(
    db: AsyncSession,
    *,
    workspace_id: UUID,
    payload: LitReviewEntryCreate,
) -> LitReviewEntry:
    """Add a reference to a workspace. Idempotent on DOI: if a row already
    exists with the same (workspace_id, doi), return it instead of inserting."""
    if payload.doi:
        existing = (await db.execute(
            select(LitReviewEntry).where(
                LitReviewEntry.workspace_id == workspace_id,
                LitReviewEntry.doi == payload.doi,
            )
        )).scalar_one_or_none()
        if existing is not None:
            return existing
    if payload.arxiv_id:
        existing = (await db.execute(
            select(LitReviewEntry).where(
                LitReviewEntry.workspace_id == workspace_id,
                LitReviewEntry.arxiv_id == payload.arxiv_id,
            )
        )).scalar_one_or_none()
        if existing is not None:
            return existing

    body = payload.model_dump(exclude_unset=False)
    entry = LitReviewEntry(workspace_id=workspace_id, **body)
    db.add(entry)
    await db.flush()
    return entry


async def list_references(
    db: AsyncSession,
    *,
    workspace_id: UUID,
    limit: int = 500,
) -> list[LitReviewEntry]:
    q = (
        select(LitReviewEntry)
        .where(LitReviewEntry.workspace_id == workspace_id)
        .order_by(LitReviewEntry.created_at.desc())
        .limit(limit)
    )
    return list((await db.execute(q)).scalars().all())


async def update_reference(
    db: AsyncSession,
    *,
    entry: LitReviewEntry,
    payload: LitReviewEntryUpdate,
) -> LitReviewEntry:
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(entry, k, v)
    await db.flush()
    return entry


async def delete_reference(db: AsyncSession, *, entry: LitReviewEntry) -> None:
    await db.delete(entry)
    await db.flush()


# ---------------------------------------------------------------------------
# Drafts
# ---------------------------------------------------------------------------


async def create_draft(
    db: AsyncSession,
    *,
    workspace_id: UUID,
    payload: DraftCreate,
) -> WorkspaceDraft:
    body = payload.model_dump(exclude_unset=False)
    body["word_count"] = _wc(body.get("body_md", ""))
    draft = WorkspaceDraft(workspace_id=workspace_id, **body)
    db.add(draft)
    await db.flush()
    return draft


async def list_drafts(
    db: AsyncSession,
    *,
    workspace_id: UUID,
) -> list[WorkspaceDraft]:
    q = (
        select(WorkspaceDraft)
        .where(WorkspaceDraft.workspace_id == workspace_id)
        .order_by(WorkspaceDraft.sort_index, WorkspaceDraft.created_at)
    )
    return list((await db.execute(q)).scalars().all())


async def update_draft(
    db: AsyncSession,
    *,
    draft: WorkspaceDraft,
    payload: DraftUpdate,
) -> WorkspaceDraft:
    body = payload.model_dump(exclude_unset=True)
    if "body_md" in body and body["body_md"] is not None:
        draft.word_count = _wc(body["body_md"])
    for k, v in body.items():
        setattr(draft, k, v)
    await db.flush()
    return draft


async def delete_draft(db: AsyncSession, *, draft: WorkspaceDraft) -> None:
    await db.delete(draft)
    await db.flush()


# ---------------------------------------------------------------------------
# BibTeX export
# ---------------------------------------------------------------------------


async def export_bibtex(db: AsyncSession, *, workspace_id: UUID) -> tuple[str, int]:
    """Concatenate BibTeX entries for every reference in the workspace.
    Returns (bibtex_string, count). Prefers cached entry.bibtex when present."""
    entries = await list_references(db, workspace_id=workspace_id, limit=10_000)
    chunks: list[str] = []
    for e in entries:
        if e.bibtex:
            chunks.append(e.bibtex.strip())
        else:
            chunks.append(_format_bibtex(e))
    return ("\n\n".join(chunks), len(entries))


# ---------------------------------------------------------------------------
# External lookups (CrossRef, arXiv)
# ---------------------------------------------------------------------------


async def lookup_crossref(doi: str) -> Optional[dict[str, Any]]:
    """Resolve a DOI via CrossRef. Returns the `message` payload normalized into
    {title, authors, venue, year, abstract, doi, raw}, or None on any error."""
    if not doi:
        return None
    url = f"https://api.crossref.org/works/{doi}"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, headers={"User-Agent": "EurekaResearch/16.2"})
            resp.raise_for_status()
            data = resp.json()
    except Exception:
        return None

    msg = (data or {}).get("message") or {}
    title_list = msg.get("title") or []
    title = title_list[0] if title_list else None
    authors_raw = msg.get("author") or []
    authors: list[str] = []
    for a in authors_raw:
        given = (a or {}).get("given") or ""
        family = (a or {}).get("family") or ""
        if family or given:
            authors.append(f"{given} {family}".strip())

    venue_list = msg.get("container-title") or []
    venue = venue_list[0] if venue_list else None

    year = None
    issued = (msg.get("issued") or {}).get("date-parts") or []
    if issued and issued[0]:
        try:
            year = int(issued[0][0])
        except (TypeError, ValueError, IndexError):
            year = None

    abstract = msg.get("abstract")

    return {
        "found": True,
        "source": ReferenceSource.crossref.value,
        "title": title,
        "authors": authors,
        "venue": venue,
        "year": year,
        "abstract": abstract,
        "doi": doi,
        "arxiv_id": None,
        "raw": msg,
    }


async def lookup_arxiv(arxiv_id: str) -> Optional[dict[str, Any]]:
    """Resolve an arXiv ID via the Atom API. Returns normalized fields or None."""
    if not arxiv_id:
        return None
    url = f"https://export.arxiv.org/api/query?id_list={arxiv_id}"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, headers={"User-Agent": "EurekaResearch/16.2"})
            resp.raise_for_status()
            xml_text = resp.text
    except Exception:
        return None

    try:
        # Atom namespace varies by feed; declare both.
        ns = {
            "atom": "http://www.w3.org/2005/Atom",
            "arxiv": "http://arxiv.org/schemas/atom",
        }
        root = ET.fromstring(xml_text)
        entry = root.find("atom:entry", ns)
        if entry is None:
            return None
        title_el = entry.find("atom:title", ns)
        title = (title_el.text or "").strip() if title_el is not None else None
        summary_el = entry.find("atom:summary", ns)
        abstract = (summary_el.text or "").strip() if summary_el is not None else None
        pub_el = entry.find("atom:published", ns)
        published = pub_el.text if pub_el is not None else None
        year = None
        if published and len(published) >= 4:
            try:
                year = int(published[:4])
            except ValueError:
                year = None
        authors: list[str] = []
        for a in entry.findall("atom:author", ns):
            n = a.find("atom:name", ns)
            if n is not None and n.text:
                authors.append(n.text.strip())
        return {
            "found": True,
            "source": ReferenceSource.arxiv.value,
            "title": title,
            "authors": authors,
            "venue": "arXiv",
            "year": year,
            "abstract": abstract,
            "doi": None,
            "arxiv_id": arxiv_id,
            "raw": {"published": published},
        }
    except Exception:
        return None
