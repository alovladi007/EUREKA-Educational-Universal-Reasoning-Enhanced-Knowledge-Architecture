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
from app.domains.gamification.service import seed_badges

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


# Phase 2 richer item kinds, demonstrating the selection and constructed-response
# variety the grader now supports. code -> list of
# (kind, prompt, options, correct, explanation, tolerance, meta).
# For show_work, meta carries the expected milestones graded for partial credit.
PHASE2_ITEMS: dict[str, list] = {
    "ALG.3": [
        (
            "true_false",
            "True or False: 3x + 2x simplifies to 5x.",
            None,
            "true",
            "Like terms add by their coefficients: 3 + 2 = 5.",
            None,
            None,
        ),
        (
            "mcq_multi",
            "Select all expressions equal to 6x.",
            ["2x + 4x", "3x + 3", "6 * x", "5x + x"],
            "[0, 2, 3]",
            "2x + 4x, 6 * x, and 5x + x each equal 6x; 3x + 3 does not.",
            None,
            None,
        ),
    ],
    "ALG.5": [
        (
            "show_work",
            "Show your work solving 2x + 3 = 11. Put each step on its own line.",
            None,
            "4",
            "Subtract 3 to get 2x = 8, then divide by 2 to get x = 4.",
            None,
            {
                "milestones": ["2*x = 8", "x = 4"],
                # A CAS-verified worked solution, shown after the answer.
                "worked_solution": ["2*x + 3 = 11", "2*x = 8", "x = 4"],
            },
        ),
        (
            "ordering",
            "Put the steps in order to solve 3x - 5 = 7.",
            # Shown shuffled; the learner reorders them.
            [
                "Divide both sides by 3 to get x = 4",
                "Start from 3x - 5 = 7",
                "Add 5 to both sides to get 3x = 12",
            ],
            (
                '["Start from 3x - 5 = 7", '
                '"Add 5 to both sides to get 3x = 12", '
                '"Divide both sides by 3 to get x = 4"]'
            ),
            "First undo the subtraction, then undo the multiplication.",
            None,
            None,
        ),
    ],
    "ALG.6": [
        (
            "short_text",
            "Name the property that lets you expand a(b + c).",
            None,
            "distributive|distributive property|the distributive property",
            "The distributive property multiplies a across each term of the sum.",
            None,
            None,
        ),
        (
            "plot_points",
            "Plot two points on the line y = 2x + 3 at x = 1 and x = 2.",
            None,
            "[[1, 5], [2, 7]]",
            "At x = 1, y = 5; at x = 2, y = 7.",
            None,
            None,
        ),
        (
            "draw_line",
            "Draw the line y = 2x - 1 by dragging the two points onto it.",
            None,
            "y = 2*x - 1",
            "The line has slope 2 and passes through (0, -1), for example (1, 1).",
            None,
            None,
        ),
        (
            "plot_function",
            "Enter and graph the parabola f(x) = x^2 - 4.",
            None,
            "x^2 - 4",
            "It is an upward parabola with roots at x = -2 and x = 2 and vertex (0, -4).",
            None,
            None,
        ),
    ],
}


# Phase 3 free-response item, AI-graded against a rubric and human-overridable.
# Same 7-tuple shape as PHASE2_ITEMS; meta carries the rubric (criterion, points,
# keywords) the reasoning provider scores the answer against.
PHASE3_ITEMS: dict[str, list] = {
    "ALG.4": [
        (
            "free_response",
            "In your own words, explain how to solve x + 4 = 9, and state the solution.",
            None,
            "Subtract 4 from both sides to undo the addition, which gives x = 5.",
            "A full answer names the inverse, applies it to both sides, and states x = 5.",
            None,
            {
                "rubric": [
                    {
                        "criterion": "Names the inverse operation",
                        "points": 1,
                        "keywords": ["subtract", "inverse", "undo", "opposite"],
                    },
                    {
                        "criterion": "Applies it to both sides",
                        "points": 1,
                        "keywords": ["both sides", "each side"],
                    },
                    {
                        "criterion": "States the correct solution",
                        "points": 1,
                        "keywords": ["x = 5", "x equals 5", "equals 5", "five"],
                    },
                ]
            },
        ),
    ],
}


async def seed_extra_items(session: AsyncSession) -> int:
    """Add the Phase 2 and Phase 3 demo items if they are missing.

    Idempotent and self-contained so a database seeded before these kinds
    existed still gets them on the next startup, keeping the live demo complete
    without a full reseed. Keyed on (node, prompt), so re-running adds nothing.
    """
    bank = (
        await session.execute(
            select(ItemBank).where(ItemBank.name == "Algebra Foundations Bank")
        )
    ).scalar_one_or_none()
    if bank is None:
        return 0

    nodes = {
        node.code: node
        for node in (await session.execute(select(KnowledgeNode))).scalars().all()
    }

    added = 0
    extra = list(PHASE2_ITEMS.items()) + list(PHASE3_ITEMS.items())
    for code, rows in extra:
        node = nodes.get(code)
        if node is None:
            continue
        for kind, prompt, options, correct, explanation, tolerance, meta in rows:
            exists = (
                await session.execute(
                    select(Item.id).where(Item.node_id == node.id, Item.prompt == prompt)
                )
            ).scalar_one_or_none()
            if exists is not None:
                continue
            session.add(
                Item(
                    bank_id=bank.id,
                    node_id=node.id,
                    kind=kind,
                    prompt=prompt,
                    options=options,
                    correct=correct,
                    explanation=explanation,
                    difficulty=0.5,
                    tolerance=tolerance,
                    meta=meta,
                )
            )
            added += 1
    if added:
        await session.flush()
    return added


async def seed(session: AsyncSession) -> bool:
    """Seed the graph. Returns True if it seeded, False if already present.

    Badge definitions and the Phase 2 demo items are seeded on every run
    (idempotently) so a database created before those features existed still
    gets them without a full reseed.
    """
    await seed_badges(session)

    existing = (
        await session.execute(select(StandardsFramework).where(StandardsFramework.code == "AAF"))
    ).scalar_one_or_none()
    if existing is not None:
        await seed_extra_items(session)
        await session.commit()
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

    for code, rows in list(PHASE2_ITEMS.items()) + list(PHASE3_ITEMS.items()):
        for kind, prompt, options, correct, explanation, tolerance, meta in rows:
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
                    meta=meta,
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
