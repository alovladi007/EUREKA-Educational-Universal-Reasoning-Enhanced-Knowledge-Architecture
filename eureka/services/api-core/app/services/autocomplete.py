"""
Phase 14.4 — Search-as-you-type autocomplete.

One endpoint, several entity kinds. Uses the pg_trgm GIN indexes added in
`16_ops.sql`. We rank by trigram similarity so misspellings still surface.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


@dataclass
class SuggestionRow:
    kind: str            # 'skill' | 'course' | 'listing' | 'instructor' | 'kb_article'
    id: str
    label: str
    sub_label: Optional[str] = None
    href: Optional[str] = None
    score: float = 0.0


async def suggest(
    db: AsyncSession,
    *,
    q: str,
    kinds: Optional[list[str]] = None,
    limit_per_kind: int = 5,
) -> list[SuggestionRow]:
    """Return top suggestions across requested entity kinds.

    Default kinds: all of them.
    """
    q = (q or "").strip()
    if len(q) < 2:
        return []
    kinds = kinds or ["skill", "course", "listing", "instructor", "kb_article"]

    out: list[SuggestionRow] = []

    if "skill" in kinds:
        rows = (
            await db.execute(
                text(
                    """
                    SELECT id::text AS id, name AS label, code AS sub_label,
                           similarity(name || ' ' || code, :q) AS score
                      FROM skills
                     WHERE name ILIKE '%' || :q || '%'
                        OR code ILIKE '%' || :q || '%'
                        OR name % :q
                        OR code % :q
                     ORDER BY score DESC
                     LIMIT :lim
                    """
                ),
                {"q": q, "lim": limit_per_kind},
            )
        ).mappings().all()
        for r in rows:
            out.append(SuggestionRow(
                kind="skill",
                id=r["id"], label=r["label"],
                sub_label=r["sub_label"],
                href=f"/skills/{r['id']}",
                score=float(r["score"] or 0.0),
            ))

    if "course" in kinds:
        rows = (
            await db.execute(
                text(
                    """
                    SELECT id::text AS id, title AS label, code AS sub_label,
                           similarity(title, :q) AS score
                      FROM courses
                     WHERE title ILIKE '%' || :q || '%' OR title % :q
                     ORDER BY score DESC
                     LIMIT :lim
                    """
                ),
                {"q": q, "lim": limit_per_kind},
            )
        ).mappings().all()
        for r in rows:
            out.append(SuggestionRow(
                kind="course",
                id=r["id"], label=r["label"],
                sub_label=r["sub_label"],
                href=f"/courses/{r['id']}",
                score=float(r["score"] or 0.0),
            ))

    if "listing" in kinds:
        rows = (
            await db.execute(
                text(
                    """
                    SELECT id::text AS id, headline AS label, slug AS sub_label,
                           similarity(headline, :q) AS score
                      FROM course_listings
                     WHERE status = 'published'
                       AND (headline ILIKE '%' || :q || '%'
                            OR slug ILIKE '%' || :q || '%'
                            OR headline % :q OR slug % :q)
                     ORDER BY score DESC
                     LIMIT :lim
                    """
                ),
                {"q": q, "lim": limit_per_kind},
            )
        ).mappings().all()
        for r in rows:
            out.append(SuggestionRow(
                kind="listing",
                id=r["id"], label=r["label"],
                sub_label=r["sub_label"],
                href=f"/listings/{r['sub_label']}",
                score=float(r["score"] or 0.0),
            ))

    if "instructor" in kinds:
        rows = (
            await db.execute(
                text(
                    """
                    SELECT id::text AS id, display_name AS label, public_slug AS sub_label,
                           similarity(display_name, :q) AS score
                      FROM instructor_profiles
                     WHERE display_name ILIKE '%' || :q || '%' OR display_name % :q
                     ORDER BY score DESC
                     LIMIT :lim
                    """
                ),
                {"q": q, "lim": limit_per_kind},
            )
        ).mappings().all()
        for r in rows:
            out.append(SuggestionRow(
                kind="instructor",
                id=r["id"], label=r["label"],
                sub_label=r["sub_label"],
                href=f"/instructors/{r['sub_label']}",
                score=float(r["score"] or 0.0),
            ))

    if "kb_article" in kinds:
        rows = (
            await db.execute(
                text(
                    """
                    SELECT id::text AS id, title AS label, slug AS sub_label,
                           similarity(title, :q) AS score
                      FROM kb_articles
                     WHERE is_published = TRUE
                       AND (title ILIKE '%' || :q || '%' OR title % :q)
                     ORDER BY score DESC
                     LIMIT :lim
                    """
                ),
                {"q": q, "lim": limit_per_kind},
            )
        ).mappings().all()
        for r in rows:
            out.append(SuggestionRow(
                kind="kb_article",
                id=r["id"], label=r["label"],
                sub_label=r["sub_label"],
                href=f"/kb/{r['sub_label']}",
                score=float(r["score"] or 0.0),
            ))

    out.sort(key=lambda x: x.score, reverse=True)
    return out
