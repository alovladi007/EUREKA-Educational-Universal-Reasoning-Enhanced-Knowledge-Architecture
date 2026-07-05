"""Seed a small, real algebra skill graph with lessons and an item bank.

Idempotent: keyed on the framework code, so running it twice is safe. This is
demo and test content, not a full curriculum. Items are original.

Run it:  AXIOM_DATABASE_URL=... python -m app.seed
"""

from __future__ import annotations

import asyncio

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_sessionmaker
from app.domains.assessment.models import Item, ItemBank, ItemTemplate
from app.domains.content.models import ContentStep, Lesson
from app.domains.curriculum.models import (
    KnowledgeEdge,
    KnowledgeNode,
    Objective,
    Standard,
    StandardsFramework,
)

# (code, title, description, [prerequisite codes])
NODES = [
    (
        "ALG.1",
        "Integers and Order of Operations",
        "Add, subtract, multiply, and divide integers and apply order of operations.",
        [],
    ),
    (
        "ALG.2",
        "Fractions and Decimals",
        "Operate with fractions and decimals and convert between them.",
        ["ALG.1"],
    ),
    (
        "ALG.3",
        "Combining Like Terms",
        "Identify like terms and combine them to simplify expressions.",
        ["ALG.1"],
    ),
    (
        "ALG.4",
        "One-Step Equations",
        "Solve equations that take a single inverse operation.",
        ["ALG.3"],
    ),
    ("ALG.5", "Two-Step Equations", "Solve equations that take two inverse operations.", ["ALG.4"]),
    (
        "ALG.6",
        "Linear Equations with Distribution",
        "Solve linear equations that require distribution and combining like terms.",
        ["ALG.2", "ALG.5"],
    ),
]


def _vint(name: str, low: int, high: int) -> dict:
    return {"name": name, "kind": "int", "low": low, "high": high, "step": 1}


# code -> list of (kind, prompt, options, correct, explanation, tolerance)
ITEMS: dict[str, list] = {
    "ALG.1": [
        (
            "mcq_single",
            "What is -3 + 5?",
            ["-8", "-2", "2", "8"],
            "2",
            "Start at -3 and move up 5 to reach 2.",
            None,
        ),
        (
            "numeric",
            "Evaluate 4 + 3 * 2 using order of operations.",
            None,
            "10",
            "Multiply before adding: 3 * 2 = 6, then 4 + 6 = 10.",
            None,
        ),
    ],
    "ALG.2": [
        (
            "numeric",
            "Compute 1/2 + 1/4 as a decimal.",
            None,
            "0.75",
            "One half is 0.5 and one quarter is 0.25, which sum to 0.75.",
            1e-6,
        ),
    ],
    "ALG.3": [
        (
            "math_expression",
            "Simplify 2(x + 1).",
            None,
            "2*x + 2",
            "Distribute the 2 across the sum: 2*x + 2*1.",
            None,
        ),
        (
            "math_expression",
            "Combine like terms: 3x + 5x.",
            None,
            "8*x",
            "Add the coefficients: 3 + 5 = 8.",
            None,
        ),
    ],
    "ALG.4": [
        ("numeric", "Solve x + 4 = 9 for x.", None, "5", "Subtract 4 from both sides.", None),
    ],
    "ALG.5": [
        ("numeric", "Solve 2x + 3 = 11 for x.", None, "4", "Subtract 3, then divide by 2.", None),
    ],
    "ALG.6": [
        (
            "math_expression",
            "Expand 3(x + 2).",
            None,
            "3*x + 6",
            "Distribute the 3 across the sum.",
            None,
        ),
    ],
}

# code -> list of (kind, stem, variables, answer_expr, tolerance, explanation)
TEMPLATES: dict[str, list] = {
    "ALG.1": [
        (
            "numeric",
            "Compute {a} + {b} * {c}.",
            [_vint("a", 2, 9), _vint("b", 2, 9), _vint("c", 2, 9)],
            "a + b*c",
            None,
            "Multiply before adding.",
        ),
    ],
    "ALG.2": [
        (
            "numeric",
            "Compute {a} * 0.5 + {b} * 0.25 as a decimal.",
            [_vint("a", 1, 8), _vint("b", 1, 8)],
            "a*0.5 + b*0.25",
            1e-6,
            "Half of a plus a quarter of b.",
        ),
    ],
    "ALG.3": [
        (
            "math_expression",
            "Combine like terms: {a}x + {b}x.",
            [_vint("a", 2, 9), _vint("b", 2, 9)],
            "(a + b)*x",
            None,
            "Add the coefficients.",
        ),
    ],
    "ALG.4": [
        (
            "numeric",
            "Solve x + {a} = {b} for x.",
            [_vint("a", 1, 9), _vint("b", 10, 20)],
            "b - a",
            None,
            "Subtract a from both sides.",
        ),
    ],
    "ALG.5": [
        (
            "numeric",
            "Solve x / {a} = {b} for x.",
            [_vint("a", 2, 5), _vint("b", 2, 9)],
            "a*b",
            None,
            "Multiply both sides by a.",
        ),
    ],
    "ALG.6": [
        (
            "math_expression",
            "Expand {a}(x + {b}).",
            [_vint("a", 2, 7), _vint("b", 2, 7)],
            "a*x + a*b",
            None,
            "Distribute a across the sum.",
        ),
    ],
}


async def seed(session: AsyncSession) -> bool:
    """Seed the graph. Returns True if it seeded, False if already present."""
    existing = (
        await session.execute(select(StandardsFramework).where(StandardsFramework.code == "AAF"))
    ).scalar_one_or_none()
    if existing is not None:
        return False

    bank = ItemBank(name="Algebra Foundations Bank", description="Original Phase 1 items.")
    framework = StandardsFramework(
        code="AAF",
        name="AXIOM Algebra Foundations",
        description="A compact demo framework for the Phase 1 skill graph.",
    )
    session.add_all([bank, framework])
    await session.flush()

    standard = Standard(
        framework_id=framework.id,
        code="AAF.EE",
        description="Reason about and solve linear expressions and equations.",
    )
    session.add(standard)
    await session.flush()

    nodes: dict[str, KnowledgeNode] = {}
    for code, title, desc, _prereqs in NODES:
        node = KnowledgeNode(code=code, title=title, description=desc, grade_band="MS")
        nodes[code] = node
        session.add(node)
    await session.flush()

    for code, _title, _desc, prereqs in NODES:
        session.add(Objective(node_id=nodes[code].id, standard_id=standard.id))
        for pre in prereqs:
            session.add(
                KnowledgeEdge(
                    from_node_id=nodes[pre].id, to_node_id=nodes[code].id, kind="prerequisite"
                )
            )

    for code, title, desc, _prereqs in NODES:
        lesson = Lesson(node_id=nodes[code].id, title=title, summary=desc)
        session.add(lesson)
        await session.flush()
        session.add(
            ContentStep(
                lesson_id=lesson.id,
                position=0,
                kind="reading",
                title="Concept",
                body=f"{desc} Work through the idea, then try a checkpoint problem.",
            )
        )
        session.add(
            ContentStep(
                lesson_id=lesson.id,
                position=1,
                kind="checkpoint",
                title="Checkpoint",
                body="Answer a practice question to check your understanding.",
            )
        )

    for code, rows in ITEMS.items():
        for kind, prompt, options, correct, explanation, tolerance in rows:
            session.add(
                Item(
                    bank_id=bank.id,
                    node_id=nodes[code].id,
                    kind=kind,
                    prompt=prompt,
                    options=options,
                    correct=correct,
                    explanation=explanation,
                    difficulty=0.5,
                    tolerance=tolerance,
                )
            )

    for code, rows in TEMPLATES.items():
        for kind, stem, variables, answer_expr, tolerance, explanation in rows:
            session.add(
                ItemTemplate(
                    bank_id=bank.id,
                    node_id=nodes[code].id,
                    kind=kind,
                    stem=stem,
                    variables=variables,
                    constraints=[],
                    answer_expr=answer_expr,
                    explanation=explanation,
                    difficulty=0.5,
                    tolerance=tolerance,
                )
            )

    await session.commit()
    return True


async def _main() -> None:
    sessionmaker = get_sessionmaker()
    async with sessionmaker() as session:
        seeded = await seed(session)
    print("seeded" if seeded else "already seeded")


if __name__ == "__main__":
    asyncio.run(_main())
