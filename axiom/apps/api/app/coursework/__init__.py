"""Authored coursework for AXIOM's skill nodes.

The original seed backfilled every node with a one-step stub lesson (an
objective paragraph derived from the node description). This package replaces
those stubs with real, authored lessons: concept exposition with KaTeX math,
worked examples, common-pitfall warnings, and a check-yourself step that
points into practice.

Content lives in per-domain modules, each exporting

    LESSONS: dict[node_code, Lesson]

where a Lesson is {"summary": str, "steps": [(kind, title, body), ...]}.
Bodies are prose with $...$ / $$...$$ TeX segments (the web app's RichMath
renders both). Step kinds used: "reading", "example", "pitfall", "check".

apply_coursework() upserts idempotently: a lesson is rewritten only when the
authored version differs from what the DB holds (step count or first-body
mismatch), so container restarts are cheap and manual edits in Studio are only
overwritten when the authored source actually changes.
"""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.content.models import ContentStep, Lesson
from app.domains.curriculum.models import KnowledgeNode

from . import (
    calculus1,
    calculus2,
    calculus3,
    discrete,
    elementary_algebra,
    fourier_pde,
    linear_algebra,
    odes,
    probstat,
    proof_techniques,
    surveys_advanced,
    surveys_core,
)

_MODULES = [
    calculus1,
    calculus2,
    calculus3,
    discrete,
    elementary_algebra,
    fourier_pde,
    linear_algebra,
    odes,
    probstat,
    proof_techniques,
    surveys_advanced,
    surveys_core,
]


def all_lessons() -> dict[str, dict]:
    merged: dict[str, dict] = {}
    for mod in _MODULES:
        overlap = merged.keys() & mod.LESSONS.keys()
        if overlap:
            raise ValueError(f"coursework modules overlap on nodes: {sorted(overlap)}")
        merged.update(mod.LESSONS)

    # Full-course tier (>=20-page lessons in coursework/full/) OVERRIDES the
    # base 5-step tier node by node; overlap within the tier is an error.
    from .full import full_modules

    full_seen: dict[str, str] = {}
    for mod in full_modules():
        overlap = full_seen.keys() & mod.LESSONS.keys()
        if overlap:
            raise ValueError(
                f"full-course modules overlap on nodes: "
                f"{sorted((c, full_seen[c], mod.__name__) for c in overlap)}"
            )
        for code, lesson in mod.LESSONS.items():
            if len(lesson["steps"]) < 20:
                raise ValueError(
                    f"full-course lesson {code} in {mod.__name__} has only "
                    f"{len(lesson['steps'])} steps; the tier's contract is >= 20"
                )
            # Per-page floor. Catches silently-truncated bodies — e.g. an
            # unescaped double-quote in a "..."-string that Python parses as
            # `"..." or "..."`, short-circuiting the page down to a fragment.
            for position, (_kind, title, body) in enumerate(lesson["steps"]):
                if len(body) < 400:
                    raise ValueError(
                        f"full-course lesson {code} in {mod.__name__}: step "
                        f"{position + 1} ({title!r}) body is only {len(body)} "
                        f"chars; full-tier pages must be substantial (>= 400)"
                    )
            full_seen[code] = mod.__name__
        merged.update(mod.LESSONS)
    return merged


async def apply_coursework(session: AsyncSession) -> int:
    """Upsert authored lessons; returns the number of lessons (re)written."""
    authored = all_lessons()
    nodes = {
        n.code: n
        for n in (await session.execute(select(KnowledgeNode))).scalars().all()
        if n.code in authored
    }
    written = 0
    for code, node in nodes.items():
        content = authored[code]
        lesson = (
            await session.execute(select(Lesson).where(Lesson.node_id == node.id))
        ).scalar_one_or_none()
        if lesson is None:
            lesson = Lesson(node_id=node.id, title=node.title, summary=content["summary"])
            session.add(lesson)
            await session.flush()
        steps = (
            (
                await session.execute(
                    select(ContentStep)
                    .where(ContentStep.lesson_id == lesson.id)
                    .order_by(ContentStep.position)
                )
            )
            .scalars()
            .all()
        )
        same = (
            len(steps) == len(content["steps"])
            and steps
            and steps[0].body == content["steps"][0][2]
        )
        if same:
            continue
        for step in steps:
            await session.delete(step)
        await session.flush()
        lesson.summary = content["summary"]
        for position, (kind, title, body) in enumerate(content["steps"]):
            session.add(
                ContentStep(
                    lesson_id=lesson.id,
                    position=position,
                    kind=kind,
                    title=title,
                    body=body,
                )
            )
        written += 1
    return written
