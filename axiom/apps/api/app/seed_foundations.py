"""Seed the five foundations courses from the full-curriculum reference (EM-17).

Loads app/data/eng_math/axiom_full_curriculum.json -- the generated, integrity-
checked 8-course curriculum (tracks/eng_math/axiom_curriculum_wave2.py) -- and
seeds the five courses the live platform does not already carry: Calculus I-III,
Probability and Statistics, and Discrete Mathematics (80 nodes, 79 internal
edges, 42 misconceptions, 10 misconception-keyed diagnostic items). The three
Engineering Math courses (LA/ODE/PDE-Fourier) are NOT reseeded from the JSON:
the live versions are richer (CAS-graded items wired to math_core graders).

Lessons come from the lessons_*.md files (### <ID>. <Title> sections, the
six-part teaching arc), one Lesson + one reading ContentStep per node, created
BEFORE backfill_lessons so the generic backfill never shadows authored content.

Cross-course edges from the JSON that point into the old courses are mapped to
the live node codes explicitly; an unmappable endpoint is skipped and counted,
never guessed. Idempotent throughout, keyed on node/misconception codes and
item prompts, like every other seed function.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.assessment.models import Item, ItemBank
from app.domains.content.models import ContentStep, Lesson
from app.domains.curriculum.models import KnowledgeEdge, KnowledgeNode, Misconception

_DATA = Path(__file__).parent / "data" / "eng_math"

NEW_COURSES = ("C1", "C2", "C3", "PS", "DM")

_LESSON_FILES = {
    "C1": "lessons_calculus_1.md",
    "C2": "lessons_calculus_2.md",
    "C3": "lessons_calculus_3.md",
    "PS": "lessons_probability_statistics.md",
    "DM": "lessons_discrete_math.md",
}

# Reference node id -> live node code, for cross-course edges into the three
# courses that live under their own richer codes. Verified against the live
# graph; anything not listed here is skipped, not guessed.
_CROSS_MAP = {
    "OD01": "ODE.U1.N1",   # Separable equations
    "OD19": "ODE.U6.N2",   # Power series solutions
    "PF07": "PF.U3.N1",    # PDE classification
    "LA21": "LA.U8.N1",    # Dot product / orthogonality
    "LA24": "LA.U8.N2",    # Least squares
}

_KIND_MAP = {"concept": "concept", "computational": "computational_skill"}

_HEADER = re.compile(r"^### ([A-Z]+\d+)\.\s+(.+)$", re.MULTILINE)


def _parse_lessons(md_text: str) -> dict[str, tuple[str, str]]:
    """Split a lessons markdown file into {node_id: (title, body)}."""
    out: dict[str, tuple[str, str]] = {}
    matches = list(_HEADER.finditer(md_text))
    for i, m in enumerate(matches):
        end = matches[i + 1].start() if i + 1 < len(matches) else len(md_text)
        body = md_text[m.end():end].strip()
        # Drop a trailing unit header that belongs to the next section.
        body = re.sub(r"\n## Unit[^\n]*\s*$", "", body).strip()
        out[m.group(1)] = (m.group(2).strip(), body)
    return out


async def seed_foundations(session: AsyncSession) -> dict:
    """Seed Calculus I-III, Probability & Statistics, and Discrete Math."""
    doc = json.loads((_DATA / "axiom_full_curriculum.json").read_text())
    courses = {c["id"]: c for c in doc["courses"]}

    by_code = {
        n.code: n
        for n in (await session.execute(select(KnowledgeNode))).scalars().all()
    }
    counts = {"nodes": 0, "edges": 0, "misconceptions": 0, "items": 0,
              "lessons": 0, "cross_skipped": 0}

    # Nodes.
    for cid in NEW_COURSES:
        for n in courses[cid]["nodes"]:
            if n["id"] in by_code:
                continue
            node = KnowledgeNode(
                code=n["id"], title=n["title"], description=n.get("description", ""),
                kind=_KIND_MAP.get(n.get("kind", "concept"), "concept"),
                tier=2, track="applied",
            )
            session.add(node)
            by_code[n["id"]] = node
            counts["nodes"] += 1
    await session.flush()

    # Edges: internal per course, plus mapped cross-course edges.
    existing_edges = {
        (e.from_node_id, e.to_node_id)
        for e in (await session.execute(select(KnowledgeEdge))).scalars().all()
    }

    def _resolve(ref_id: str):
        if ref_id in by_code:
            return by_code[ref_id]
        mapped = _CROSS_MAP.get(ref_id)
        return by_code.get(mapped) if mapped else None

    edge_specs = [e for cid in NEW_COURSES for e in courses[cid]["edges"]]
    edge_specs += [
        e for e in doc.get("cross_edges", [])
        if e["source"][:2] in NEW_COURSES or e["target"][:2] in NEW_COURSES
        or e["source"][:1] == "C" or e["target"][:1] == "C"
    ]
    for e in edge_specs:
        src, dst = _resolve(e["source"]), _resolve(e["target"])
        if src is None or dst is None:
            counts["cross_skipped"] += 1
            continue
        pair = (src.id, dst.id)
        if pair in existing_edges:
            continue
        session.add(KnowledgeEdge(
            from_node_id=pair[0], to_node_id=pair[1], kind="prerequisite"
        ))
        existing_edges.add(pair)
        counts["edges"] += 1

    # Misconceptions.
    have = {
        m.code for m in (await session.execute(select(Misconception))).scalars().all()
    }
    for cid in NEW_COURSES:
        for m in courses[cid]["misconceptions"]:
            if m["code"] in have:
                continue
            target = by_code.get(m["routes_to"])
            session.add(Misconception(
                code=m["code"], name=m["name"], description=m["description"],
                routes_to_node_id=target.id if target else None,
            ))
            counts["misconceptions"] += 1
    await session.flush()

    # Diagnostic items (all misconception-keyed MC in the reference).
    bank = (
        await session.execute(
            select(ItemBank).where(ItemBank.name == "Foundations Diagnostics")
        )
    ).scalar_one_or_none()
    if bank is None:
        bank = ItemBank(
            name="Foundations Diagnostics",
            description="Calculus I-III, Probability & Statistics, Discrete Math: "
                        "misconception-keyed diagnostic items from the full curriculum.",
        )
        session.add(bank)
        await session.flush()

    for cid in NEW_COURSES:
        for it in courses[cid]["items"]:
            if it.get("grader") != "mc":
                continue
            node = by_code.get(it["node_id"])
            if node is None:
                continue
            exists = (
                await session.execute(
                    select(Item.id).where(Item.node_id == node.id, Item.prompt == it["stem"])
                )
            ).scalar_one_or_none()
            if exists is not None:
                continue
            choices = it["choices"]
            correct_idx = next(i for i, c in enumerate(choices) if c.get("correct"))
            meta_choices = [
                {"index": i, "misconception": c["misconception"]}
                for i, c in enumerate(choices)
                if not c.get("correct") and c.get("misconception")
            ]
            session.add(Item(
                bank_id=bank.id, node_id=node.id, kind="mcq_single",
                prompt=it["stem"], options=[c["text"] for c in choices],
                correct=str(correct_idx), explanation=it.get("explanation", ""),
                difficulty=0.5, tolerance=None,
                meta={"choices": meta_choices} if meta_choices else None,
            ))
            counts["items"] += 1
    await session.flush()

    # Lessons from the markdown, one reading step per node.
    have_lessons = set(
        (await session.execute(select(Lesson.node_id))).scalars().all()
    )
    for cid in NEW_COURSES:
        parsed = _parse_lessons((_DATA / _LESSON_FILES[cid]).read_text())
        for ref_id, (title, body) in parsed.items():
            node = by_code.get(ref_id)
            if node is None or node.id in have_lessons:
                continue
            lesson = Lesson(node_id=node.id, title=title, summary=node.description)
            session.add(lesson)
            await session.flush()
            session.add(ContentStep(
                lesson_id=lesson.id, position=0, kind="reading",
                title="Lesson", body=body,
            ))
            have_lessons.add(node.id)
            counts["lessons"] += 1
    await session.flush()
    return counts
