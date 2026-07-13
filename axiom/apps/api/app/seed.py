"""Seed a small, real algebra skill graph with lessons and an item bank.

Idempotent: keyed on the framework code, so running it twice is safe. This is
demo and test content, not a full curriculum. Items are original.

Run it:  AXIOM_DATABASE_URL=... python -m app.seed
"""

from __future__ import annotations

import asyncio
import json

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_sessionmaker
from app.domains.assessment.models import Item, ItemBank, ItemTemplate
from app.domains.content.models import ContentStep, Lesson
from app.domains.curriculum.graph import seed_curriculum_graph
from app.domains.curriculum.models import (
    Definition,
    KnowledgeEdge,
    KnowledgeNode,
    Misconception,
    Objective,
    Standard,
    StandardsFramework,
    Theorem,
)
from app.domains.gamification.service import seed_badges, seed_quests

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


# Structured proof demo items (Curriculum & Proof Extension, Section 4.2),
# attached to the proof-transition course and technique nodes seeded by the
# ladder graph. code -> list of (kind, prompt, options, correct, explanation,
# meta). All are deterministic and auto-gradable.
PROOF_ITEMS: dict[str, list] = {
    "INTROPROOF": [
        (
            "proof_assembly",
            "Order these steps into a valid proof that the square of an even "
            "integer is even.",
            [
                "Then n^2 = (2k)^2 = 4k^2.",
                "Assume n is even, so n = 2k for some integer k.",
                "Therefore n^2 is even.",
                "So n^2 = 2(2k^2), a multiple of 2.",
            ],
            json.dumps([
                "Assume n is even, so n = 2k for some integer k.",
                "Then n^2 = (2k)^2 = 4k^2.",
                "So n^2 = 2(2k^2), a multiple of 2.",
                "Therefore n^2 is even.",
            ]),
            "Start from the hypothesis, expand, factor out 2, then conclude.",
            None,
        ),
        (
            "find_the_error",
            "One step in this 'proof' that 2 = 1 is invalid. Select the invalid "
            "step.",
            [
                "Let a = b.",
                "Multiply both sides by a: a^2 = ab.",
                "Subtract b^2: a^2 - b^2 = ab - b^2.",
                "Factor: (a - b)(a + b) = b(a - b).",
                "Divide both sides by (a - b): a + b = b.",
                "With a = b this gives 2b = b, so 2 = 1.",
            ],
            "4",
            "Dividing by (a - b) divides by zero, since a = b. That step is invalid.",
            None,
        ),
        (
            "state_definition",
            "State the definition of an even integer.",
            None,
            "an integer that is a multiple of 2|an integer of the form 2k|"
            "an integer divisible by 2",
            "An even integer is one that can be written as 2k for some integer k.",
            {"keywords": ["integer", "2"]},
        ),
        (
            "free_form_proof",
            "Prove that the sum of two even integers is even. Write your proof; "
            "it gets an AI-assisted first pass and always goes to an instructor "
            "for final sign-off.",
            None,
            "Let a = 2m and b = 2n for integers m, n. Then a + b = 2(m + n), "
            "which is even.",
            "A full proof names the definition of even, adds, factors out 2, and "
            "concludes the sum is even.",
            {
                "rubric": [
                    {
                        "criterion": "defines both integers as even",
                        "points": 1,
                        "keywords": ["2m", "2n", "definition", "even"],
                    },
                    {
                        "criterion": "adds and factors out 2",
                        "points": 1,
                        "keywords": ["2(m + n)", "factor", "m + n"],
                    },
                    {
                        "criterion": "concludes the sum is even",
                        "points": 1,
                        "keywords": ["is even", "therefore even", "hence even"],
                    },
                ],
                "milestones": ["a = 2m", "b = 2n", "a + b = 2(m + n)", "a + b is even"],
                "techniques": ["PT.DIRECT"],
            },
        ),
    ],
    "PT.COUNTEREXAMPLE": [
        (
            "counterexample",
            "Give a counterexample to the false claim: for every real number n, "
            "n^2 > n. Enter a value of n that breaks it.",
            None,
            "1/2",
            "Any n in (0, 1) works: for n = 1/2, n^2 = 1/4 which is not > 1/2.",
            {"predicate": "n**2 <= n", "var": "n"},
        ),
    ],
    "CALC1": [
        (
            "mixed",
            "Part A: compute the derivative of f(x) = x^2. Part B: prove that f "
            "is increasing for x > 0.",
            None,
            "",  # The parts (in meta.parts) carry their own answer keys.
            "Part A is 2x. Part B: f'(x) = 2x > 0 for x > 0, so f is increasing.",
            {
                "parts": [
                    {
                        "label": "Part A: f'(x)",
                        "kind": "math_expression",
                        "correct": "2*x",
                    },
                    {
                        "label": "Part B: prove f is increasing on x > 0",
                        "kind": "free_form_proof",
                        "correct": "f'(x) = 2x, and 2x > 0 for x > 0, so f is increasing.",
                        "rubric": [
                            {
                                "criterion": "computes the derivative",
                                "points": 1,
                                "keywords": ["2x", "2 x", "derivative"],
                            },
                            {
                                "criterion": "argues the derivative is positive",
                                "points": 1,
                                "keywords": ["positive", "greater than 0", "2x > 0"],
                            },
                            {
                                "criterion": "concludes increasing",
                                "points": 1,
                                "keywords": ["increasing"],
                            },
                        ],
                    },
                ]
            },
        ),
    ],
    "NUMTHEORY": [
        (
            "formal_proof",
            "Formal track (opt-in): prove in Lean 4 that 2 + 2 = 4. Your proof is "
            "checked by the Lean kernel, not by AI.",
            None,
            "",  # No textual key: the kernel is the sole judge of a formal proof.
            "A formal proof is accepted only when the kernel type-checks it. With "
            "no toolchain configured it is queued for manual review, never "
            "auto-passed.",
            {"prelude": "", "language": "lean4"},
        ),
    ],
    "PT.INDUCTION": [
        (
            "justification_matching",
            "Match each step of the induction proof that 1 + 2 + ... + n = "
            "n(n+1)/2 to the rule that justifies it.",
            None,
            json.dumps([
                ["Check n = 1: 1 = 1(2)/2.", "base case"],
                ["Assume 1 + ... + k = k(k+1)/2.", "inductive hypothesis"],
                ["Add (k+1) to both sides.", "inductive step"],
                ["Conclude the formula holds for all n.", "principle of induction"],
            ]),
            "An induction proof has a base case, a hypothesis, a step, and the "
            "conclusion by the induction principle.",
            {
                "justification_bank": [
                    "base case",
                    "inductive hypothesis",
                    "inductive step",
                    "principle of induction",
                ]
            },
        ),
    ],
}


# Extended technology-enhanced question types (Build Prompt Section 7 long tail),
# attached to foundational nodes so each new kind is demonstrable end to end.
# Tuple shape matches PROOF_ITEMS: (kind, prompt, options, correct, explanation, meta).
EXTENDED_ITEMS: dict[str, list] = {
    "PREALG": [
        (
            "number_line",
            "Drag the marker to place the value 3 on the number line.",
            None,
            "3",
            "3 sits three units to the right of zero.",
            {"min": -5, "max": 5, "step": 1},
        ),
        (
            "mixed_number",
            "Write the value 7/3 as a mixed number (a whole number plus a fraction).",
            None,
            "7/3",
            "7/3 is 2 and 1/3, since 3 goes into 7 twice with 1 left over.",
            None,
        ),
        (
            "units_numeric",
            "How many meters are in 3 kilometers? Include the unit, for example '5 m'.",
            None,
            "3000 m",
            "1 km = 1000 m, so 3 km = 3000 m.",
            None,
        ),
        (
            "categorize_sort",
            "Sort each number as prime or composite.",
            None,
            json.dumps({"7": "prime", "9": "composite", "2": "prime"}),
            "7 and 2 are prime; 9 = 3 times 3 is composite.",
            {"items": ["7", "9", "2"], "categories": ["prime", "composite"]},
        ),
    ],
    "ALG1": [
        (
            "inequality",
            "Solve 2*x + 1 > 7 for x. Enter your answer as an inequality, for example 'x > 3'.",
            None,
            "x > 3",
            "Subtract 1 to get 2x > 6, then divide by 2 to get x > 3.",
            None,
        ),
        (
            "drag_tokens",
            "Tap the tokens in order to build the expression 2x + 1.",
            None,
            "2*x + 1",
            "Any arrangement that is algebraically equal to 2x + 1 is accepted.",
            {"tokens": ["1", "+", "2*x"]},
        ),
        (
            "cloze_math",
            "Fill in the slope-intercept form of the line with slope 2 and y-intercept 5.",
            None,
            json.dumps(["2", "5"]),
            "The slope-intercept form is y = 2x + 5.",
            {"segments": ["y = ", "", "x + ", ""]},
        ),
        (
            "table_completion",
            "Complete the table of products.",
            None,
            json.dumps([["2", "3"], ["4", "6"]]),
            "Multiply each row header by each column header.",
            {
                "display": [["", ""], ["", ""]],
                "row_headers": ["1", "2"],
                "col_headers": ["x2", "x3"],
            },
        ),
    ],
}


async def seed_proof_items(session: AsyncSession) -> int:
    """Add the structured proof demo items if missing (idempotent, by prompt).

    Attaches to the ladder's proof-transition and technique nodes, in a dedicated
    Proof Foundations bank, so the new proof kinds are demonstrable end to end.
    """
    nodes = {
        node.code: node
        for node in (await session.execute(select(KnowledgeNode))).scalars().all()
    }
    if "INTROPROOF" not in nodes:
        return 0

    bank = (
        await session.execute(
            select(ItemBank).where(ItemBank.name == "Proof Foundations Bank")
        )
    ).scalar_one_or_none()
    if bank is None:
        bank = ItemBank(
            name="Proof Foundations Bank",
            description="Structured proof demo items (Curriculum & Proof Extension).",
        )
        session.add(bank)
        await session.flush()

    added = 0
    for code, rows in PROOF_ITEMS.items():
        node = nodes.get(code)
        if node is None:
            continue
        for kind, prompt, options, correct, explanation, meta in rows:
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
                    tolerance=None,
                    meta=meta,
                )
            )
            added += 1

    # Extended technology-enhanced kinds (Section 7 long tail) in their own bank.
    ext_bank = (
        await session.execute(
            select(ItemBank).where(ItemBank.name == "Technology-Enhanced Bank")
        )
    ).scalar_one_or_none()
    if ext_bank is None:
        ext_bank = ItemBank(
            name="Technology-Enhanced Bank",
            description="Extended question types: inequality, number line, cloze, "
            "categorize, drag-tokens, table completion, units, mixed number.",
        )
        session.add(ext_bank)
        await session.flush()

    for code, rows in EXTENDED_ITEMS.items():
        node = nodes.get(code)
        if node is None:
            continue
        for kind, prompt, options, correct, explanation, meta in rows:
            exists = (
                await session.execute(
                    select(Item.id).where(Item.node_id == node.id, Item.prompt == prompt)
                )
            ).scalar_one_or_none()
            if exists is not None:
                continue
            session.add(
                Item(
                    bank_id=ext_bank.id,
                    node_id=node.id,
                    kind=kind,
                    prompt=prompt,
                    options=options,
                    correct=correct,
                    explanation=explanation,
                    difficulty=0.4,
                    tolerance=None,
                    meta=meta,
                )
            )
            added += 1

    if added:
        await session.flush()
    return added


# Per-course definition and theorem reference library (Extension Section 6),
# seeded on the tier 5 nodes so the library is not empty and the proof content
# and copilot have consistent conventions to retrieve from.
# (node_code, term, statement, notation)
DEFINITIONS: list[tuple[str, str, str, str]] = [
    (
        "REALAN", "Cauchy sequence",
        "A sequence whose terms become arbitrarily close for large indices: for "
        "every eps > 0 there is N with |a_m - a_n| < eps for all m, n >= N.",
        "for all eps>0 exists N ...",
    ),
    (
        "REALAN", "Continuous at a point",
        "f is continuous at c if for every eps > 0 there is delta > 0 such that "
        "|x - c| < delta implies |f(x) - f(c)| < eps.",
        "eps-delta",
    ),
    (
        "ABSALG", "Group",
        "A set with an associative binary operation, an identity element, and an "
        "inverse for every element.",
        "(G, *)",
    ),
    (
        "TOPO", "Open set",
        "In a metric space, a set U is open if every point of U has a ball "
        "contained in U.",
        "",
    ),
]

# (node_code, name, statement, proof_sketch, techniques, depends_on)
THEOREMS: list[tuple[str, str, str, str, list[str], list[str]]] = [
    (
        "REALAN", "Monotone Convergence Theorem",
        "A bounded, monotone sequence of real numbers converges.",
        "Take the supremum of the range and show the sequence converges to it "
        "using the least upper bound property.",
        ["PT.EPSILONDELTA", "PT.EXISTUNIQ"],
        ["Completeness of the reals"],
    ),
    (
        "REALAN", "Intermediate Value Theorem",
        "A continuous function on [a, b] attains every value between f(a) and "
        "f(b).",
        "Apply completeness to the set of points where f stays below the target "
        "value; the supremum is the crossing point.",
        ["PT.CONTRADICTION", "PT.EPSILONDELTA"],
        ["Continuous at a point"],
    ),
    (
        "ABSALG", "Lagrange's Theorem",
        "The order of a subgroup divides the order of a finite group.",
        "Partition the group into cosets of the subgroup; all cosets have equal "
        "size.",
        ["PT.DIRECT", "PT.CASES"],
        ["Group"],
    ),
]


async def seed_reference_library(session: AsyncSession) -> int:
    """Seed the definition and theorem reference library (idempotent).

    Keyed on (course_code, term/name), so re-running adds only what is missing.
    Links each entry to its knowledge node when the node exists.
    """
    nodes = {
        node.code: node
        for node in (await session.execute(select(KnowledgeNode))).scalars().all()
    }
    added = 0
    for code, term, statement, notation in DEFINITIONS:
        node = nodes.get(code)
        course = code.lower()
        exists = (
            await session.execute(
                select(Definition.id).where(
                    Definition.course_code == course, Definition.term == term
                )
            )
        ).scalar_one_or_none()
        if exists is not None:
            continue
        session.add(
            Definition(
                course_code=course,
                node_id=node.id if node is not None else None,
                term=term,
                statement=statement,
                notation=notation,
            )
        )
        added += 1
    for code, name, statement, sketch, techniques, depends_on in THEOREMS:
        node = nodes.get(code)
        course = code.lower()
        exists = (
            await session.execute(
                select(Theorem.id).where(
                    Theorem.course_code == course, Theorem.name == name
                )
            )
        ).scalar_one_or_none()
        if exists is not None:
            continue
        session.add(
            Theorem(
                course_code=course,
                node_id=node.id if node is not None else None,
                name=name,
                statement=statement,
                proof_sketch=sketch,
                techniques=techniques,
                depends_on=depends_on,
            )
        )
        added += 1
    if added:
        await session.flush()
    return added


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


# Engineering Math track, Linear Algebra Unit 1 (see docs/AXIOM_Engineering_Math_Track.md
# and tracks/eng_math/). Fine-grained nodes N1..N11, their prerequisite chain, and
# the ten-code misconception library routing each learner error to a remediation node.
_LA_U1_NODES = [
    ("LA.U1.N1", "computational_skill", "Vector operations", "Vector addition, scalar multiplication, and their geometric meaning."),
    ("LA.U1.N2", "concept", "Linear combinations", "Forming a vector as a weighted sum of other vectors."),
    ("LA.U1.N3", "concept", "Span", "The set of all linear combinations of a set of vectors."),
    ("LA.U1.N4", "concept", "Matrix-vector product as a combination of columns", "A x is the linear combination of the columns of A weighted by the entries of x."),
    ("LA.U1.N5", "concept", "Row picture and column picture", "A linear system read as intersecting hyperplanes and as a combination of columns, two views of the same system."),
    ("LA.U1.N6", "concept", "Linear system as A x = b", "Expressing a system of linear equations in matrix form."),
    ("LA.U1.N7", "computational_skill", "Gaussian elimination to row echelon form", "Reducing a system by elementary row operations."),
    ("LA.U1.N8", "computational_skill", "Reduced row echelon form and pivots", "The unique reduced form and identification of pivot positions."),
    ("LA.U1.N9", "concept", "Free variables", "Identifying free variables from non-pivot columns and parameterizing."),
    ("LA.U1.N10", "concept", "Existence and uniqueness", "Classifying a solution set as none, one, or infinitely many from the pivots."),
    ("LA.U1.N11", "concept", "Homogeneous systems", "Systems A x = 0 and the always-present trivial solution."),
]
_LA_U1_EDGES = [
    ("LA.U1.N1", "LA.U1.N2"), ("LA.U1.N2", "LA.U1.N3"), ("LA.U1.N2", "LA.U1.N4"),
    ("LA.U1.N4", "LA.U1.N5"), ("LA.U1.N5", "LA.U1.N6"), ("LA.U1.N6", "LA.U1.N7"),
    ("LA.U1.N7", "LA.U1.N8"), ("LA.U1.N8", "LA.U1.N9"), ("LA.U1.N9", "LA.U1.N10"),
    ("LA.U1.N10", "LA.U1.N11"),
]
_LA_U1_MISCONCEPTIONS = [
    ("LA.U1.M1", "Dimension-blind product", "Multiplies matrix by vector row-by-row or ignores shape compatibility.", "LA.U1.N4"),
    ("LA.U1.M2", "Row-picture lock-in", "Sees a system only as intersecting lines, never as a combination of columns.", "LA.U1.N5"),
    ("LA.U1.M3", "Always-unique belief", "Assumes every system has exactly one solution.", "LA.U1.N10"),
    ("LA.U1.M4", "Shape-equals-solvability", "Concludes solvability from the count of equations and unknowns alone.", "LA.U1.N10"),
    ("LA.U1.M5", "Illegal row operation", "Multiplies a row by zero or adds a row to itself without scaling.", "LA.U1.N7"),
    ("LA.U1.M6", "REF and RREF confusion", "Stops at row echelon form or believes RREF is not unique.", "LA.U1.N8"),
    ("LA.U1.M7", "Free-variable mishandling", "Fails to identify free variables or parameterizes with the wrong variable.", "LA.U1.N9"),
    ("LA.U1.M8", "Inconsistent-homogeneous error", "Believes a homogeneous system can have no solution.", "LA.U1.N11"),
    ("LA.U1.M9", "Count-based span", "Believes span depends on the number of vectors rather than their independence.", "LA.U1.N3"),
    ("LA.U1.M10", "Scalar-sign confusion", "Mishandles the geometric effect of a negative scalar.", "LA.U1.N1"),
]


async def seed_eng_math_la_unit1(session: AsyncSession) -> int:
    """Seed Linear Algebra Unit 1 nodes, prerequisites, and the misconception
    library. Idempotent: each node, edge, and misconception is created only if
    absent, so it runs on every startup including existing databases."""
    by_code = {
        n.code: n
        for n in (await session.execute(select(KnowledgeNode))).scalars().all()
    }
    created = 0
    for code, kind, title, desc in _LA_U1_NODES:
        if code not in by_code:
            node = KnowledgeNode(
                code=code, title=title, description=desc, kind=kind, tier=3, track="applied"
            )
            session.add(node)
            by_code[code] = node
            created += 1
    await session.flush()

    existing_edges = {
        (e.from_node_id, e.to_node_id)
        for e in (await session.execute(select(KnowledgeEdge))).scalars().all()
    }
    for src, dst in _LA_U1_EDGES:
        pair = (by_code[src].id, by_code[dst].id)
        if pair not in existing_edges:
            session.add(
                KnowledgeEdge(from_node_id=pair[0], to_node_id=pair[1], kind="prerequisite")
            )

    have_codes = {
        m.code for m in (await session.execute(select(Misconception))).scalars().all()
    }
    for code, name, desc, routes_to in _LA_U1_MISCONCEPTIONS:
        if code not in have_codes:
            target = by_code.get(routes_to)
            session.add(
                Misconception(
                    code=code,
                    name=name,
                    description=desc,
                    routes_to_node_id=target.id if target else None,
                )
            )
    await session.flush()

    # Unit 1 items (node_code, kind, prompt, options, correct, explanation, meta).
    # Item D's distractors are keyed to misconceptions in meta.choices, so a wrong
    # pick becomes a diagnosis and a remediation route (see the practice flow).
    bank = (
        await session.execute(
            select(ItemBank).where(ItemBank.name == "Linear Algebra Unit 1")
        )
    ).scalar_one_or_none()
    if bank is None:
        bank = ItemBank(
            name="Linear Algebra Unit 1",
            description="Engineering Math track: vectors and linear systems, CAS-graded.",
        )
        session.add(bank)
        await session.flush()

    la_items = [
        ("LA.U1.N7", "linear_system",
         "Solve the system 2x + y = 5 and x - y = 1. Enter your answer as JSON, "
         'for example {"x": 2, "y": 1}.',
         None, "", "Add the equations to eliminate y: 3x = 6, so x = 2 and y = 1.",
         {"key": {"x": "2", "y": "1"}}),
        ("LA.U1.N8", "matrix_rref",
         "Row reduce the matrix [[1, 2, 1], [2, 4, 0], [1, 1, 3]] to reduced row "
         "echelon form. Enter the result as a JSON list of rows.",
         None, "", "Any valid sequence of row operations reaches the unique RREF, "
         "here the 3x3 identity.",
         {"problem_matrix": [[1, 2, 1], [2, 4, 0], [1, 1, 3]]}),
        ("LA.U1.N10", "mcq_single",
         "Classify the solution set of x + y = 2 and 2x + 2y = 4.",
         ["Infinitely many solutions", "Exactly one solution", "No solution",
          "Cannot be determined"],
         "0", "The second equation is twice the first, so the lines coincide and "
         "there are infinitely many solutions.",
         {"choices": [
             {"index": 1, "misconception": "LA.U1.M3"},
             {"index": 2, "misconception": "LA.U1.M4"},
             {"index": 3, "misconception": "LA.U1.M6"},
         ]}),
        ("LA.U1.N9", "solution_set",
         "Write the general solution of x1 + x2 = 2 and x3 = 5 in parametric form. "
         'Enter JSON {"particular": [...], "directions": [[...]]}.',
         None, "", "x3 is fixed at 5; x1 is free and x2 = 2 - x1, so a direction is "
         "(-1, 1, 0).",
         {"A": [[1, 1, 0], [0, 0, 1]], "b": [2, 5]}),
    ]
    for code, kind, prompt, options, correct, explanation, meta in la_items:
        node = by_code.get(code)
        if node is None:
            continue
        exists = (
            await session.execute(
                select(Item.id).where(Item.node_id == node.id, Item.prompt == prompt)
            )
        ).scalar_one_or_none()
        if exists is not None:
            continue
        session.add(
            Item(
                bank_id=bank.id, node_id=node.id, kind=kind, prompt=prompt,
                options=options, correct=correct, explanation=explanation,
                difficulty=0.5, tolerance=None, meta=meta,
            )
        )
    await session.flush()
    return created


# Engineering Math track, ODE Units 1-7 (the complete ODE course): First-Order
# ODEs, Second-Order Linear ODEs, Nonhomogeneous methods, Laplace transforms,
# Systems (the eigenvalue method), Series solutions, and Phase plane / stability.
# Solution items are graded by verifying a proposed y(x) solves the equation
# (ode_solution kind), so any equivalent form and any constant name is accepted;
# Laplace items are graded against the SymPy-computed transform (laplace_transform
# / inverse_laplace); systems and stability use the eigen graders; series
# coefficients are graded numerically.
_ODE_NODES = [
    # Unit 1: first-order ODEs.
    ("ODE.U1.N1", "computational_skill", "Separable first-order ODEs", "Separate variables and integrate both sides."),
    ("ODE.U1.N2", "computational_skill", "First-order linear ODEs (integrating factor)", "Solve y' + p(x) y = q(x) with an integrating factor."),
    ("ODE.U1.N3", "computational_skill", "Exact first-order ODEs", "Recognize and solve exact equations M dx + N dy = 0."),
    ("ODE.U1.N4", "concept", "Existence and uniqueness (first-order)", "When a first-order initial value problem has a unique solution."),
    ("ODE.U1.N5", "concept", "General versus particular solutions", "The arbitrary constant, the general solution family, and fixing it with an initial condition."),
    # Unit 2: second-order linear ODEs.
    ("ODE.U2.N1", "concept", "Characteristic equation", "Reduce a constant-coefficient homogeneous ODE to its characteristic polynomial."),
    ("ODE.U2.N2", "computational_skill", "Real distinct roots", "General solution C1 e^{r1 x} + C2 e^{r2 x} for distinct real roots."),
    ("ODE.U2.N3", "computational_skill", "Repeated roots", "General solution (C1 + C2 x) e^{r x} for a repeated root."),
    ("ODE.U2.N4", "computational_skill", "Complex roots", "General solution e^{a x}(C1 cos b x + C2 sin b x) for complex roots."),
    ("ODE.U2.N5", "computational_skill", "Undetermined coefficients", "A particular solution of a nonhomogeneous linear ODE by an educated guess."),
    ("ODE.U2.N6", "concept", "Superposition (general = homogeneous + particular)", "The general solution is the homogeneous solution plus any particular solution."),
    # Unit 3: nonhomogeneous solution methods (deeper).
    ("ODE.U3.N1", "computational_skill", "Undetermined coefficients (polynomial and exponential forcing)", "Choose a trial form matching the forcing term and solve for its coefficients."),
    ("ODE.U3.N2", "computational_skill", "Resonance and the modification rule", "When the trial form collides with a homogeneous solution, multiply by x."),
    ("ODE.U3.N3", "computational_skill", "Variation of parameters", "A particular solution for any forcing via the Wronskian formula."),
    ("ODE.U3.N4", "concept", "Full nonhomogeneous solution y_h + y_p", "Assemble the general solution as the homogeneous family plus one particular solution."),
    # Unit 4: Laplace transforms.
    ("ODE.U4.N1", "computational_skill", "Laplace transform of elementary functions", "Transform exponentials, powers, sines, and cosines to the s-domain."),
    ("ODE.U4.N2", "computational_skill", "Inverse Laplace transform (partial fractions)", "Recover f(t) from F(s), decomposing with partial fractions."),
    ("ODE.U4.N3", "concept", "Transform of derivatives and solving IVPs", "L{y'} = sY - y(0) turns an IVP into an algebra problem in s."),
    ("ODE.U4.N4", "computational_skill", "Shifting theorems (s-shift and t-shift)", "First and second shifting theorems for e^{at} f(t) and step-delayed signals."),
    # Unit 5: systems of first-order linear ODEs (the eigenvalue method).
    ("ODE.U5.N1", "concept", "Systems as x' = A x", "Write a first-order linear system in matrix form and read off the coefficient matrix."),
    ("ODE.U5.N2", "computational_skill", "Eigenvalue method for systems", "Solve x' = A x from the eigenvalues and eigenvectors of A."),
    ("ODE.U5.N3", "computational_skill", "Real distinct eigenvalues", "Build the general solution sum c_i e^{lambda_i t} v_i for real distinct eigenvalues."),
    ("ODE.U5.N4", "concept", "Complex eigenvalues (spirals and centers)", "Complex eigenvalues give oscillatory (spiral or center) solutions."),
    # Unit 6: power series solutions.
    ("ODE.U6.N1", "concept", "Ordinary and singular points", "Classify a point of a linear ODE as ordinary or singular before seeking a series solution."),
    ("ODE.U6.N2", "computational_skill", "Power series solution and the recurrence", "Substitute y = sum a_n x^n and match powers to get a recurrence for the coefficients."),
    ("ODE.U6.N3", "concept", "Radius of convergence", "How far from the center a power series solution is guaranteed to converge."),
    # Unit 7: phase plane and stability.
    ("ODE.U7.N1", "concept", "Equilibria and the phase plane", "Find equilibrium points and sketch trajectories in the phase plane."),
    ("ODE.U7.N2", "computational_skill", "Linear stability from eigenvalues", "Read stability from the sign of the real parts of the linearization's eigenvalues."),
    ("ODE.U7.N3", "concept", "Classification (node, saddle, spiral, center)", "Classify an equilibrium from the eigenvalue pattern."),
]
_ODE_EDGES = [
    ("ODE.U1.N1", "ODE.U1.N2"), ("ODE.U1.N1", "ODE.U1.N3"), ("ODE.U1.N1", "ODE.U1.N4"),
    ("ODE.U1.N2", "ODE.U1.N5"),
    # Second-order builds on first-order and on linear algebra eigen-ideas.
    ("ODE.U1.N2", "ODE.U2.N1"),
    ("ODE.U2.N1", "ODE.U2.N2"), ("ODE.U2.N1", "ODE.U2.N3"), ("ODE.U2.N1", "ODE.U2.N4"),
    ("ODE.U2.N2", "ODE.U2.N5"), ("ODE.U2.N5", "ODE.U2.N6"),
    # Unit 3 builds on undetermined coefficients / superposition.
    ("ODE.U2.N6", "ODE.U3.N1"), ("ODE.U3.N1", "ODE.U3.N2"), ("ODE.U3.N1", "ODE.U3.N3"),
    ("ODE.U3.N2", "ODE.U3.N4"), ("ODE.U3.N3", "ODE.U3.N4"),
    # Unit 4 (Laplace) is an alternative route once second-order linear is in hand.
    ("ODE.U2.N6", "ODE.U4.N1"), ("ODE.U4.N1", "ODE.U4.N2"), ("ODE.U4.N1", "ODE.U4.N3"),
    ("ODE.U4.N1", "ODE.U4.N4"),
    # Unit 5 (systems) needs second-order linear ideas; the eigenvalue machinery
    # is cross-linked from Linear Algebra Unit 7 in seed_eng_math_la_unit7.
    ("ODE.U2.N6", "ODE.U5.N1"), ("ODE.U5.N1", "ODE.U5.N2"), ("ODE.U5.N2", "ODE.U5.N3"),
    ("ODE.U5.N2", "ODE.U5.N4"),
    # Unit 6 (series) builds on second-order linear; Unit 7 (phase plane) on systems.
    ("ODE.U2.N6", "ODE.U6.N1"), ("ODE.U6.N1", "ODE.U6.N2"), ("ODE.U6.N2", "ODE.U6.N3"),
    ("ODE.U5.N2", "ODE.U7.N1"), ("ODE.U7.N1", "ODE.U7.N2"), ("ODE.U7.N2", "ODE.U7.N3"),
]
_ODE_MISCONCEPTIONS = [
    ("ODE.U1.M1", "Losing the arbitrary constant", "Integrates but drops the constant of integration.", "ODE.U1.N5"),
    ("ODE.U1.M2", "Divide-by-zero factor", "Divides by a factor that can be zero, dropping solutions.", "ODE.U1.N1"),
    ("ODE.U1.M3", "General versus particular confusion", "Confuses the general solution family with a particular solution.", "ODE.U1.N5"),
    ("ODE.U1.M4", "Integrating-factor setup error", "Forms the wrong integrating factor or mishandles its sign.", "ODE.U1.N2"),
    ("ODE.U2.M1", "Wrong characteristic roots", "Solves the characteristic polynomial incorrectly.", "ODE.U2.N1"),
    ("ODE.U2.M2", "Repeated-root missing x factor", "Forgets the x e^{r x} term for a repeated root.", "ODE.U2.N3"),
    ("ODE.U2.M3", "Complex-root real-form error", "Mishandles the real form e^{a x}(cos, sin) for complex roots.", "ODE.U2.N4"),
    ("ODE.U2.M4", "Guess collides with homogeneous", "Picks a particular-solution guess that is already a homogeneous solution.", "ODE.U2.N5"),
    ("ODE.U3.M1", "Resonance not accounted for", "Forgets to multiply the trial form by x when it duplicates a homogeneous solution.", "ODE.U3.N2"),
    ("ODE.U3.M2", "Dropped the homogeneous part", "Reports only the particular solution as the general solution.", "ODE.U3.N4"),
    ("ODE.U3.M3", "Wrong ansatz family", "Chooses a trial form that cannot match the forcing term.", "ODE.U3.N1"),
    ("ODE.U4.M1", "Linearity misapplied to products", "Treats L{f g} as L{f} times L{g}.", "ODE.U4.N1"),
    ("ODE.U4.M2", "Wrong shift direction", "Confuses the s-shift and t-shift theorems.", "ODE.U4.N4"),
    ("ODE.U4.M3", "Dropped initial-condition terms", "Omits the y(0), y'(0) terms when transforming a derivative.", "ODE.U4.N3"),
    ("ODE.U5.M1", "Eigenvector treated as unique", "Thinks a system's eigenvector is a single fixed vector, not a direction.", "ODE.U5.N2"),
    ("ODE.U5.M2", "Phase-portrait misread", "Reads opposite-sign real eigenvalues as a node instead of a saddle.", "ODE.U5.N3"),
    ("ODE.U6.M1", "Singular point mistaken for ordinary", "Seeks an ordinary power series at a singular point.", "ODE.U6.N1"),
    ("ODE.U6.M2", "Recurrence index-shift error", "Shifts the summation index wrong when matching powers.", "ODE.U6.N2"),
    ("ODE.U7.M1", "Stability sign error", "Reads a positive eigenvalue real part as stable.", "ODE.U7.N2"),
    ("ODE.U7.M2", "Center versus spiral confusion", "Confuses pure-imaginary (center) with complex (spiral) eigenvalues.", "ODE.U7.N3"),
]
# Items: (node_code, kind, prompt, options, correct, explanation, meta).
_ODE_ITEMS = [
    ("ODE.U1.N1", "ode_solution",
     "Solve the separable equation dy/dx = 2xy. Enter the general solution y(x) "
     "(use C for the arbitrary constant, exp for e).",
     None, "", "Separate to dy/y = 2x dx, integrate to ln|y| = x^2 + c, so "
     "y = C exp(x^2).",
     {"residual": "yp - 2*x*y", "order": 1}),
    ("ODE.U1.N2", "ode_solution",
     "Solve the linear equation dy/dx + y = x. Enter the general solution y(x).",
     None, "", "Integrating factor e^x gives (e^x y)' = x e^x, so "
     "y = x - 1 + C exp(-x).",
     {"residual": "yp + y - x", "order": 1}),
    ("ODE.U1.N5", "mcq_single",
     "You integrate dy/dx = 3x^2 and write y = x^3. Which best describes this?",
     ["It is only one particular solution; the general solution is x^3 + C",
      "It is the complete general solution",
      "It is wrong; the answer should be 3x^3",
      "It cannot be determined"],
     "0", "Integrating gives a family y = x^3 + C; writing x^3 alone drops the "
     "arbitrary constant.",
     {"choices": [
         {"index": 1, "misconception": "ODE.U1.M1"},
         {"index": 2, "misconception": "ODE.U1.M4"},
     ]}),
    ("ODE.U2.N2", "ode_solution",
     "Solve y'' - y = 0. Enter the general solution y(x) (use C1, C2).",
     None, "", "Characteristic equation r^2 - 1 = 0 has roots +-1, so "
     "y = C1 exp(x) + C2 exp(-x).",
     {"residual": "ypp - y", "order": 2}),
    ("ODE.U2.N3", "ode_solution",
     "Solve y'' - 4y' + 4y = 0. Enter the general solution y(x).",
     None, "", "Characteristic equation (r-2)^2 = 0 has a repeated root 2, so "
     "y = (C1 + C2 x) exp(2x).",
     {"residual": "ypp - 4*yp + 4*y", "order": 2}),
    ("ODE.U2.N4", "ode_solution",
     "Solve y'' + y = 0. Enter the general solution y(x).",
     None, "", "Characteristic roots +-i give y = C1 cos(x) + C2 sin(x).",
     {"residual": "ypp + y", "order": 2}),
    # Unit 3: nonhomogeneous. The residual carries the forcing term moved to the
    # left, so a correct general solution y_h + y_p makes it zero; order is the
    # homogeneous order (2), which grade_ode enforces via the two constants.
    ("ODE.U3.N1", "ode_solution",
     "Solve y'' - 3y' + 2y = e^{3x}. Enter the general solution y(x) (use C1, C2).",
     None, "", "Homogeneous roots 1 and 2; a trial A e^{3x} gives A = 1/2, so "
     "y = C1 exp(x) + C2 exp(2x) + exp(3x)/2.",
     {"residual": "ypp - 3*yp + 2*y - exp(3*x)", "order": 2}),
    ("ODE.U3.N2", "ode_solution",
     "Solve y'' + y = cos(x) (a resonant forcing). Enter the general solution y(x).",
     None, "", "cos(x) is a homogeneous solution, so the trial form is multiplied "
     "by x: y_p = (x/2) sin(x); y = C1 cos(x) + C2 sin(x) + (x/2) sin(x).",
     {"residual": "ypp + y - cos(x)", "order": 2}),
    ("ODE.U3.N3", "ode_solution",
     "Solve y'' - y = x. Enter the general solution y(x).",
     None, "", "A trial y_p = a x + b gives y_p = -x; "
     "y = C1 exp(x) + C2 exp(-x) - x.",
     {"residual": "ypp - y - x", "order": 2}),
    ("ODE.U3.N4", "mcq_single",
     "You found a particular solution y_p = (1/2) e^{3x} for y'' - 3y' + 2y = e^{3x}. "
     "What is the general solution?",
     ["C1 e^{x} + C2 e^{2x} + (1/2) e^{3x}",
      "(1/2) e^{3x}",
      "C1 e^{x} + C2 e^{2x}",
      "C1 e^{3x} + C2 e^{3x}"],
     "0", "The general solution is the homogeneous family C1 e^{x} + C2 e^{2x} "
     "plus the particular solution (1/2) e^{3x}.",
     {"choices": [
         {"index": 1, "misconception": "ODE.U3.M2"},
         {"index": 2, "misconception": "ODE.U3.M2"},
     ]}),
    # Unit 4: Laplace transforms. source is the given function; the student
    # submits the transform in the opposite domain.
    ("ODE.U4.N1", "laplace_transform",
     "Find the Laplace transform F(s) of f(t) = e^{3t}.",
     None, "", "L{e^{at}} = 1/(s - a), so F(s) = 1/(s - 3).",
     {"source": "exp(3*t)"}),
    ("ODE.U4.N1", "laplace_transform",
     "Find the Laplace transform F(s) of f(t) = t^2.",
     None, "", "L{t^n} = n!/s^{n+1}, so L{t^2} = 2/s^3.",
     {"source": "t**2"}),
    ("ODE.U4.N2", "inverse_laplace",
     "Find the inverse Laplace transform f(t) of F(s) = 2/(s^2 + 4).",
     None, "", "This is the transform of sin(2t): L{sin(bt)} = b/(s^2 + b^2).",
     {"source": "2/(s**2 + 4)"}),
    ("ODE.U4.N4", "laplace_transform",
     "Find the Laplace transform F(s) of f(t) = t e^{-t} (first shifting theorem).",
     None, "", "L{t} = 1/s^2 shifted by s -> s + 1 gives 1/(s + 1)^2.",
     {"source": "t*exp(-t)"}),
    ("ODE.U4.N3", "mcq_single",
     "Using L{y'} = sY(s) - y(0), which transform is correct for y'' with "
     "y(0) and y'(0)?",
     ["s^2 Y(s) - s y(0) - y'(0)",
      "s^2 Y(s)",
      "s^2 Y(s) - y(0) - y'(0)",
      "s Y(s) - y(0)"],
     "0", "Apply the derivative rule twice: L{y''} = s^2 Y - s y(0) - y'(0).",
     {"choices": [
         {"index": 1, "misconception": "ODE.U4.M3"},
         {"index": 2, "misconception": "ODE.U4.M3"},
     ]}),
    # Unit 5: systems. The coefficient matrix's eigen-decomposition is graded
    # with the eigen graders; classification is a misconception-keyed MCQ.
    ("ODE.U5.N2", "eigenvalues",
     "For the system x' = A x with A = [[0, 1], [-2, -3]], find the eigenvalues "
     "of A. Enter them as a comma-separated list.",
     None, "", "The characteristic polynomial is lambda^2 + 3 lambda + 2 = "
     "(lambda + 1)(lambda + 2), so the eigenvalues are -1 and -2.",
     {"matrix": [[0, 1], [-2, -3]]}),
    ("ODE.U5.N2", "eigenvector",
     "For A = [[0, 1], [-2, -3]], give an eigenvector for the eigenvalue -1. "
     "Enter it as a comma-separated list (e.g. 1, -1).",
     None, "", "(A + I) v = 0 gives v proportional to (1, -1); any nonzero "
     "multiple is a valid eigenvector.",
     {"matrix": [[0, 1], [-2, -3]], "eigenvalue": -1}),
    ("ODE.U5.N3", "mcq_single",
     "A planar system x' = A x has real eigenvalues 2 and -1 (opposite signs). "
     "What is the origin?",
     ["A saddle point", "A stable node", "A spiral", "A center"],
     "0", "Real eigenvalues of opposite sign make the origin a saddle: one "
     "direction grows, the other decays.",
     {"choices": [
         {"index": 1, "misconception": "ODE.U5.M2"},
         {"index": 2, "misconception": "ODE.U5.M2"},
     ]}),
    # Unit 6: power series solutions. A specific coefficient is graded numerically
    # (verified by hand against y = cos x, whose series is 1 - x^2/2 + x^4/24 - ...).
    ("ODE.U6.N2", "numeric",
     "Solve y'' + y = 0 with y(0) = 1, y'(0) = 0 as a power series y = sum a_n "
     "x^n. What is a_2? (Enter a decimal.)",
     None, "-0.5", "The recurrence a_{n+2} = -a_n/((n+2)(n+1)) with a_0 = 1 gives "
     "a_2 = -1/2. (The solution is cos x.)",
     None),
    ("ODE.U6.N2", "numeric",
     "For the same series solution of y'' + y = 0, what is a_4? Enter the exact "
     "fraction.",
     None, "1/24", "a_4 = -a_2/(4*3) = (1/2)/12 = 1/24.",
     None),
    ("ODE.U6.N1", "mcq_single",
     "For x^2 y'' + y = 0, what is the point x = 0?",
     ["A singular point (the leading coefficient vanishes there)",
      "An ordinary point",
      "A point where no solution exists",
      "Irrelevant to the series method"],
     "0", "x = 0 makes the leading coefficient x^2 vanish, so it is a singular "
     "point; an ordinary power series is not guaranteed there.",
     {"choices": [
         {"index": 1, "misconception": "ODE.U6.M1"},
     ]}),
    # Unit 7: phase plane and stability. Eigenvalues via the eigen grader;
    # classification and stability via misconception-keyed MCQs.
    ("ODE.U7.N2", "eigenvalues",
     "For the linearization A = [[-1, 0], [0, -2]], find the eigenvalues. Enter "
     "them comma-separated.",
     None, "", "The diagonal entries are the eigenvalues: -1 and -2 (both "
     "negative, so the origin is asymptotically stable).",
     {"matrix": [[-1, 0], [0, -2]]}),
    ("ODE.U7.N2", "mcq_single",
     "A linear system has eigenvalues -1 and -2. What is the stability of the "
     "origin?",
     ["Asymptotically stable (both real parts negative)",
      "Unstable",
      "A saddle",
      "Neutrally stable"],
     "0", "When every eigenvalue has negative real part, trajectories decay to "
     "the origin: asymptotic stability.",
     {"choices": [
         {"index": 1, "misconception": "ODE.U7.M1"},
     ]}),
    ("ODE.U7.N3", "mcq_single",
     "A planar system has purely imaginary eigenvalues +-2i. What is the origin?",
     ["A center (closed orbits)", "A stable spiral", "An unstable spiral",
      "A saddle"],
     "0", "Purely imaginary eigenvalues give closed orbits around a center; a "
     "nonzero real part would make it a spiral.",
     {"choices": [
         {"index": 1, "misconception": "ODE.U7.M2"},
         {"index": 2, "misconception": "ODE.U7.M2"},
     ]}),
]


async def seed_eng_math_ode(session: AsyncSession) -> int:
    """Seed ODE Units 1 and 2: nodes, prerequisites, the misconception library,
    and items. Idempotent, like the Linear Algebra seed."""
    by_code = {
        n.code: n
        for n in (await session.execute(select(KnowledgeNode))).scalars().all()
    }
    created = 0
    for code, kind, title, desc in _ODE_NODES:
        if code not in by_code:
            node = KnowledgeNode(
                code=code, title=title, description=desc, kind=kind, tier=3, track="applied"
            )
            session.add(node)
            by_code[code] = node
            created += 1
    await session.flush()

    existing_edges = {
        (e.from_node_id, e.to_node_id)
        for e in (await session.execute(select(KnowledgeEdge))).scalars().all()
    }
    for src, dst in _ODE_EDGES:
        if src in by_code and dst in by_code:
            pair = (by_code[src].id, by_code[dst].id)
            if pair not in existing_edges:
                session.add(
                    KnowledgeEdge(from_node_id=pair[0], to_node_id=pair[1], kind="prerequisite")
                )

    have_codes = {
        m.code for m in (await session.execute(select(Misconception))).scalars().all()
    }
    for code, name, desc, routes_to in _ODE_MISCONCEPTIONS:
        if code not in have_codes:
            target = by_code.get(routes_to)
            session.add(
                Misconception(
                    code=code, name=name, description=desc,
                    routes_to_node_id=target.id if target else None,
                )
            )
    await session.flush()

    bank = (
        await session.execute(
            select(ItemBank).where(ItemBank.name == "Ordinary Differential Equations")
        )
    ).scalar_one_or_none()
    if bank is None:
        bank = ItemBank(
            name="Ordinary Differential Equations",
            description="Engineering Math track: first- and second-order ODEs, CAS-graded.",
        )
        session.add(bank)
        await session.flush()

    for code, kind, prompt, options, correct, explanation, meta in _ODE_ITEMS:
        node = by_code.get(code)
        if node is None:
            continue
        exists = (
            await session.execute(
                select(Item.id).where(Item.node_id == node.id, Item.prompt == prompt)
            )
        ).scalar_one_or_none()
        if exists is not None:
            continue
        session.add(
            Item(
                bank_id=bank.id, node_id=node.id, kind=kind, prompt=prompt,
                options=options, correct=correct, explanation=explanation,
                difficulty=0.5, tolerance=None, meta=meta,
            )
        )
    await session.flush()
    return created


# Engineering Math track, Linear Algebra Unit 7 (Eigenvalues and Eigenvectors).
# Eigenvalues are graded as a multiset and eigenvectors by (A - lambda I) v = 0
# (any nonzero scaling), so any equivalent form is accepted. This is the machinery
# ODE systems (ODE.U5) and PDE eigenfunction expansions both run on -- the spine
# cross-edge LA7 -> ODE systems is added here.
_LA_U7_NODES = [
    ("LA.U7.N1", "computational_skill", "Eigenvalues and the characteristic polynomial", "Solve det(A - lambda I) = 0 for the eigenvalues of a matrix."),
    ("LA.U7.N2", "computational_skill", "Eigenvectors and eigenspaces", "Solve (A - lambda I) v = 0 for the eigenvectors of each eigenvalue."),
    ("LA.U7.N3", "concept", "Algebraic versus geometric multiplicity", "How a repeated eigenvalue's root count relates to its eigenspace dimension."),
    ("LA.U7.N4", "concept", "Diagonalization", "When A = P D P^-1 exists: a full set of independent eigenvectors."),
]
_LA_U7_EDGES = [
    ("LA.U7.N1", "LA.U7.N2"), ("LA.U7.N2", "LA.U7.N3"), ("LA.U7.N3", "LA.U7.N4"),
    # The track spine: eigenvalues feed the ODE systems unit.
    ("LA.U7.N2", "ODE.U5.N2"),
]
_LA_U7_MISCONCEPTIONS = [
    ("LA.U7.M1", "Characteristic sign error", "Forms det(A - lambda I) with a sign slip and gets wrong roots.", "LA.U7.N1"),
    ("LA.U7.M2", "Eigenvector treated as unique", "Believes an eigenvector is one fixed vector, not a whole line.", "LA.U7.N2"),
    ("LA.U7.M3", "Multiplicity conflation", "Assumes geometric multiplicity always equals algebraic multiplicity.", "LA.U7.N3"),
    ("LA.U7.M4", "Assumes always diagonalizable", "Thinks every square matrix can be diagonalized.", "LA.U7.N4"),
]
_LA_U7_ITEMS = [
    ("LA.U7.N1", "eigenvalues",
     "Find the eigenvalues of A = [[2, 0], [0, 3]]. Enter them comma-separated.",
     None, "", "A diagonal matrix has its diagonal entries as eigenvalues: 2 and 3.",
     {"matrix": [[2, 0], [0, 3]]}),
    ("LA.U7.N1", "eigenvalues",
     "Find the eigenvalues of A = [[3, 1], [0, 3]] (with multiplicity). Enter "
     "them comma-separated.",
     None, "", "The triangular matrix has a repeated eigenvalue 3 of algebraic "
     "multiplicity 2, so enter 3, 3.",
     {"matrix": [[3, 1], [0, 3]]}),
    ("LA.U7.N2", "eigenvector",
     "For A = [[2, 0], [0, 3]], give an eigenvector for the eigenvalue 3. Enter "
     "it comma-separated (e.g. 0, 1).",
     None, "", "(A - 3I) v = 0 gives v proportional to (0, 1); any nonzero "
     "multiple works.",
     {"matrix": [[2, 0], [0, 3]], "eigenvalue": 3}),
    ("LA.U7.N3", "mcq_single",
     "The matrix [[3, 1], [0, 3]] has eigenvalue 3 with algebraic multiplicity 2 "
     "but only a one-dimensional eigenspace. What does this mean?",
     ["Geometric multiplicity (1) is less than algebraic multiplicity (2), so it "
      "is defective",
      "Geometric and algebraic multiplicity are always equal",
      "It has two independent eigenvectors",
      "It is diagonalizable"],
     "0", "A defective matrix has fewer independent eigenvectors than the "
     "eigenvalue's algebraic multiplicity.",
     {"choices": [
         {"index": 1, "misconception": "LA.U7.M3"},
         {"index": 2, "misconception": "LA.U7.M3"},
         {"index": 3, "misconception": "LA.U7.M4"},
     ]}),
    ("LA.U7.N4", "mcq_single",
     "Which statement about diagonalization is correct?",
     ["A matrix is diagonalizable iff it has a full set of independent eigenvectors",
      "Every square matrix is diagonalizable",
      "Only symmetric matrices are diagonalizable",
      "Diagonalization requires distinct eigenvalues"],
     "0", "A = P D P^-1 exists exactly when the eigenvectors form a basis; "
     "repeated eigenvalues are fine if the eigenspace is big enough.",
     {"choices": [
         {"index": 1, "misconception": "LA.U7.M4"},
         {"index": 3, "misconception": "LA.U7.M4"},
     ]}),
]


async def seed_eng_math_la_unit7(session: AsyncSession) -> int:
    """Seed Linear Algebra Unit 7 (eigenvalues/eigenvectors), the machinery ODE
    systems and PDE eigenfunction expansions run on. Idempotent, and it adds the
    track spine edge LA7 -> ODE systems (both nodes exist by the time it runs)."""
    by_code = {
        n.code: n
        for n in (await session.execute(select(KnowledgeNode))).scalars().all()
    }
    created = 0
    for code, kind, title, desc in _LA_U7_NODES:
        if code not in by_code:
            node = KnowledgeNode(
                code=code, title=title, description=desc, kind=kind, tier=3, track="applied"
            )
            session.add(node)
            by_code[code] = node
            created += 1
    await session.flush()

    existing_edges = {
        (e.from_node_id, e.to_node_id)
        for e in (await session.execute(select(KnowledgeEdge))).scalars().all()
    }
    for src, dst in _LA_U7_EDGES:
        if src in by_code and dst in by_code:
            pair = (by_code[src].id, by_code[dst].id)
            if pair not in existing_edges:
                session.add(
                    KnowledgeEdge(from_node_id=pair[0], to_node_id=pair[1], kind="prerequisite")
                )

    have_codes = {
        m.code for m in (await session.execute(select(Misconception))).scalars().all()
    }
    for code, name, desc, routes_to in _LA_U7_MISCONCEPTIONS:
        if code not in have_codes:
            target = by_code.get(routes_to)
            session.add(
                Misconception(
                    code=code, name=name, description=desc,
                    routes_to_node_id=target.id if target else None,
                )
            )
    await session.flush()

    bank = (
        await session.execute(
            select(ItemBank).where(ItemBank.name == "Linear Algebra Unit 7")
        )
    ).scalar_one_or_none()
    if bank is None:
        bank = ItemBank(
            name="Linear Algebra Unit 7",
            description="Engineering Math track: eigenvalues and eigenvectors, CAS-graded.",
        )
        session.add(bank)
        await session.flush()

    for code, kind, prompt, options, correct, explanation, meta in _LA_U7_ITEMS:
        node = by_code.get(code)
        if node is None:
            continue
        exists = (
            await session.execute(
                select(Item.id).where(Item.node_id == node.id, Item.prompt == prompt)
            )
        ).scalar_one_or_none()
        if exists is not None:
            continue
        session.add(
            Item(
                bank_id=bank.id, node_id=node.id, kind=kind, prompt=prompt,
                options=options, correct=correct, explanation=explanation,
                difficulty=0.5, tolerance=None, meta=meta,
            )
        )
    await session.flush()
    return created


# Engineering Math track, Linear Algebra Unit 6 (Determinants). Determinant items
# are graded against SymPy det(A) (determinant kind), so any equivalent form is
# accepted. Determinants are the prerequisite for the characteristic polynomial,
# so this unit feeds eigenvalues (LA6 -> LA7), wired in seed_eng_math_la_unit6.
_LA_U6_NODES = [
    ("LA.U6.N1", "computational_skill", "Determinant of 2x2 and 3x3 matrices", "Compute small determinants directly and by the rule of Sarrus."),
    ("LA.U6.N2", "computational_skill", "Cofactor (Laplace) expansion", "Expand along a row or column with the checkerboard of signs."),
    ("LA.U6.N3", "concept", "Determinant properties", "Effect of row operations, det(AB) = det(A) det(B), det(A^T) = det(A)."),
    ("LA.U6.N4", "concept", "Determinant and invertibility", "A is invertible iff det(A) is nonzero."),
]
_LA_U6_EDGES = [
    ("LA.U6.N1", "LA.U6.N2"), ("LA.U6.N1", "LA.U6.N3"), ("LA.U6.N3", "LA.U6.N4"),
    # Determinants are needed for the characteristic polynomial det(A - lambda I).
    ("LA.U6.N1", "LA.U7.N1"),
]
_LA_U6_MISCONCEPTIONS = [
    ("LA.U6.M1", "Diagonal-product error", "Takes the determinant as the product of the diagonal for a non-triangular matrix.", "LA.U6.N1"),
    ("LA.U6.M2", "Cofactor sign error", "Uses the wrong checkerboard signs in cofactor expansion.", "LA.U6.N2"),
    ("LA.U6.M3", "False determinant linearity", "Assumes det(A + B) = det(A) + det(B).", "LA.U6.N3"),
]
_LA_U6_ITEMS = [
    ("LA.U6.N1", "determinant",
     "Find the determinant of A = [[1, 2], [3, 4]].",
     None, "", "det = 1*4 - 2*3 = 4 - 6 = -2.",
     {"matrix": [[1, 2], [3, 4]]}),
    ("LA.U6.N2", "determinant",
     "Find the determinant of the upper-triangular A = [[2, 5, 1], [0, 3, 7], "
     "[0, 0, 4]].",
     None, "", "A triangular determinant is the product of the diagonal: "
     "2 * 3 * 4 = 24.",
     {"matrix": [[2, 5, 1], [0, 3, 7], [0, 0, 4]]}),
    ("LA.U6.N4", "mcq_single",
     "A square matrix A has det(A) = 0. What does this tell you?",
     ["A is singular (not invertible)",
      "A is invertible",
      "A is the identity",
      "A has all-zero entries"],
     "0", "det(A) = 0 exactly when the columns are dependent, so A is singular "
     "and has no inverse.",
     {"choices": [
         {"index": 1, "misconception": "LA.U6.M3"},
     ]}),
    ("LA.U6.N3", "mcq_single",
     "Which determinant identity is always true?",
     ["det(A B) = det(A) det(B)",
      "det(A + B) = det(A) + det(B)",
      "det(2A) = 2 det(A) for an n x n matrix",
      "det(A^T) = -det(A)"],
     "0", "The determinant is multiplicative over products; it is not additive, "
     "and det(cA) = c^n det(A), det(A^T) = det(A).",
     {"choices": [
         {"index": 1, "misconception": "LA.U6.M3"},
     ]}),
]


async def seed_eng_math_la_unit6(session: AsyncSession) -> int:
    """Seed Linear Algebra Unit 6 (Determinants). Idempotent, and it adds the
    edge LA6 -> LA7 (determinants feed the characteristic polynomial), so it runs
    after the LA Unit 7 seed."""
    by_code = {
        n.code: n
        for n in (await session.execute(select(KnowledgeNode))).scalars().all()
    }
    created = 0
    for code, kind, title, desc in _LA_U6_NODES:
        if code not in by_code:
            node = KnowledgeNode(
                code=code, title=title, description=desc, kind=kind, tier=3, track="applied"
            )
            session.add(node)
            by_code[code] = node
            created += 1
    await session.flush()

    existing_edges = {
        (e.from_node_id, e.to_node_id)
        for e in (await session.execute(select(KnowledgeEdge))).scalars().all()
    }
    for src, dst in _LA_U6_EDGES:
        if src in by_code and dst in by_code:
            pair = (by_code[src].id, by_code[dst].id)
            if pair not in existing_edges:
                session.add(
                    KnowledgeEdge(from_node_id=pair[0], to_node_id=pair[1], kind="prerequisite")
                )

    have_codes = {
        m.code for m in (await session.execute(select(Misconception))).scalars().all()
    }
    for code, name, desc, routes_to in _LA_U6_MISCONCEPTIONS:
        if code not in have_codes:
            target = by_code.get(routes_to)
            session.add(
                Misconception(
                    code=code, name=name, description=desc,
                    routes_to_node_id=target.id if target else None,
                )
            )
    await session.flush()

    bank = (
        await session.execute(
            select(ItemBank).where(ItemBank.name == "Linear Algebra Unit 6")
        )
    ).scalar_one_or_none()
    if bank is None:
        bank = ItemBank(
            name="Linear Algebra Unit 6",
            description="Engineering Math track: determinants, CAS-graded.",
        )
        session.add(bank)
        await session.flush()

    for code, kind, prompt, options, correct, explanation, meta in _LA_U6_ITEMS:
        node = by_code.get(code)
        if node is None:
            continue
        exists = (
            await session.execute(
                select(Item.id).where(Item.node_id == node.id, Item.prompt == prompt)
            )
        ).scalar_one_or_none()
        if exists is not None:
            continue
        session.add(
            Item(
                bank_id=bank.id, node_id=node.id, kind=kind, prompt=prompt,
                options=options, correct=correct, explanation=explanation,
                difficulty=0.5, tolerance=None, meta=meta,
            )
        )
    await session.flush()
    return created


# Engineering Math track, PDE and Fourier Analysis Unit 1 (Fourier Series). The
# flagship, most-underserved course; applied context (signal reconstruction, heat
# profiles, Fourier optics) lands hardest here. Coefficient items are graded by
# SymPy exact integration (fourier_coefficient kind), so any equivalent closed
# form is accepted. Second-order linear ODEs (ODE.U2/U3) are the prerequisite,
# since separation of variables reduces a PDE to them (the OD3 -> PF4 spine).
_PF_U1_NODES = [
    ("PF.U1.N1", "concept", "Periodic functions and the Fourier series", "Represent a periodic function as a sum of sines and cosines."),
    ("PF.U1.N2", "computational_skill", "Fourier coefficients (Euler formulas)", "Compute a0, a_n, b_n by the Euler integral formulas over one period."),
    ("PF.U1.N3", "concept", "Even and odd functions (cosine and sine series)", "Symmetry kills half the coefficients: even -> cosine series, odd -> sine series."),
    ("PF.U1.N4", "concept", "Convergence and the Gibbs phenomenon", "Pointwise convergence, the value at a jump, and overshoot near discontinuities."),
    ("PF.U1.N5", "concept", "Parseval's theorem (energy)", "The energy of a signal equals the sum of squared Fourier coefficients."),
]
_PF_U1_EDGES = [
    ("PF.U1.N1", "PF.U1.N2"), ("PF.U1.N2", "PF.U1.N3"), ("PF.U1.N2", "PF.U1.N4"),
    ("PF.U1.N2", "PF.U1.N5"),
    # Spine: second-order linear ODEs are the prerequisite for Fourier/PDE work.
    ("ODE.U2.N6", "PF.U1.N1"),
]
_PF_U1_MISCONCEPTIONS = [
    ("PF.U1.M1", "Missing the 1/L normalization", "Drops the 1/L factor in the Euler coefficient formulas.", "PF.U1.N2"),
    ("PF.U1.M2", "Symmetry ignored", "Computes sine terms for an even function (or cosine terms for an odd one).", "PF.U1.N3"),
    ("PF.U1.M3", "Constant-term halving confusion", "Mishandles the a0/2 constant term of the series.", "PF.U1.N2"),
    ("PF.U1.M4", "Convergence-at-a-jump error", "Assumes the series equals the function everywhere, ignoring jumps and Gibbs overshoot.", "PF.U1.N4"),
]
_PF_U1_ITEMS = [
    ("PF.U1.N2", "fourier_coefficient",
     "The odd square wave has f(x) = -1 on (-pi, 0) and f(x) = 1 on (0, pi), "
     "period 2pi. Find the sine coefficient b_1. (Series convention: "
     "a0/2 + sum a_n cos(n x) + b_n sin(n x).)",
     None, "", "b_1 = (1/pi) integral_{-pi}^{pi} f(x) sin(x) dx = 4/pi.",
     {"function": "Piecewise((-1, x < 0), (1, True))", "half_period": "pi", "coeff": "b", "n": 1}),
    ("PF.U1.N2", "fourier_coefficient",
     "For the same odd square wave, find b_2.",
     None, "", "Even harmonics vanish for this wave, so b_2 = 0.",
     {"function": "Piecewise((-1, x < 0), (1, True))", "half_period": "pi", "coeff": "b", "n": 2}),
    ("PF.U1.N2", "fourier_coefficient",
     "For the sawtooth f(x) = x on (-pi, pi) (period 2pi), find the sine "
     "coefficient b_1.",
     None, "", "b_1 = (1/pi) integral_{-pi}^{pi} x sin(x) dx = 2.",
     {"function": "x", "half_period": "pi", "coeff": "b", "n": 1}),
    ("PF.U1.N3", "fourier_coefficient",
     "For the even function f(x) = x^2 on (-pi, pi) (period 2pi), find the "
     "constant term coefficient a0. (a0 = (1/pi) integral_{-pi}^{pi} f dx.)",
     None, "", "a0 = (1/pi) integral_{-pi}^{pi} x^2 dx = 2 pi^2 / 3.",
     {"function": "x**2", "half_period": "pi", "coeff": "a0", "n": 0}),
    ("PF.U1.N3", "mcq_single",
     "A function f(x) is odd on (-pi, pi). Which Fourier coefficients are "
     "automatically zero?",
     ["All the cosine coefficients a_n (including a0)",
      "All the sine coefficients b_n",
      "None of them",
      "Only a0"],
     "0", "An odd function integrates against the even cosines to zero, so its "
     "series is pure sine (all a_n = 0).",
     {"choices": [
         {"index": 1, "misconception": "PF.U1.M2"},
         {"index": 3, "misconception": "PF.U1.M2"},
     ]}),
    ("PF.U1.N4", "mcq_single",
     "At a jump discontinuity, what does a convergent Fourier series equal?",
     ["The average of the left and right limits",
      "The left-hand limit",
      "The function's value there",
      "Plus infinity"],
     "0", "At a jump the series converges to the midpoint (average of the "
     "one-sided limits); near it, partial sums overshoot (Gibbs).",
     {"choices": [
         {"index": 1, "misconception": "PF.U1.M4"},
         {"index": 2, "misconception": "PF.U1.M4"},
     ]}),
]


async def seed_eng_math_fourier_unit1(session: AsyncSession) -> int:
    """Seed PDE/Fourier Unit 1 (Fourier Series), the flagship course. Idempotent,
    and it adds the spine edge second-order ODE -> Fourier (both nodes exist by
    the time it runs)."""
    by_code = {
        n.code: n
        for n in (await session.execute(select(KnowledgeNode))).scalars().all()
    }
    created = 0
    for code, kind, title, desc in _PF_U1_NODES:
        if code not in by_code:
            node = KnowledgeNode(
                code=code, title=title, description=desc, kind=kind, tier=3, track="applied"
            )
            session.add(node)
            by_code[code] = node
            created += 1
    await session.flush()

    existing_edges = {
        (e.from_node_id, e.to_node_id)
        for e in (await session.execute(select(KnowledgeEdge))).scalars().all()
    }
    for src, dst in _PF_U1_EDGES:
        if src in by_code and dst in by_code:
            pair = (by_code[src].id, by_code[dst].id)
            if pair not in existing_edges:
                session.add(
                    KnowledgeEdge(from_node_id=pair[0], to_node_id=pair[1], kind="prerequisite")
                )

    have_codes = {
        m.code for m in (await session.execute(select(Misconception))).scalars().all()
    }
    for code, name, desc, routes_to in _PF_U1_MISCONCEPTIONS:
        if code not in have_codes:
            target = by_code.get(routes_to)
            session.add(
                Misconception(
                    code=code, name=name, description=desc,
                    routes_to_node_id=target.id if target else None,
                )
            )
    await session.flush()

    bank = (
        await session.execute(
            select(ItemBank).where(ItemBank.name == "Fourier Series")
        )
    ).scalar_one_or_none()
    if bank is None:
        bank = ItemBank(
            name="Fourier Series",
            description="Engineering Math track: Fourier series, CAS-graded by exact integration.",
        )
        session.add(bank)
        await session.flush()

    for code, kind, prompt, options, correct, explanation, meta in _PF_U1_ITEMS:
        node = by_code.get(code)
        if node is None:
            continue
        exists = (
            await session.execute(
                select(Item.id).where(Item.node_id == node.id, Item.prompt == prompt)
            )
        ).scalar_one_or_none()
        if exists is not None:
            continue
        session.add(
            Item(
                bank_id=bank.id, node_id=node.id, kind=kind, prompt=prompt,
                options=options, correct=correct, explanation=explanation,
                difficulty=0.5, tolerance=None, meta=meta,
            )
        )
    await session.flush()
    return created


async def backfill_lessons(session: AsyncSession) -> int:
    """Give every knowledge node a lesson so the Learn view never 404s.

    The full tier 0-6 + proof-technique graph has far more nodes than the
    original algebra demo authored lessons for, so most Learn entries used to
    return 404 (which the UI showed as an API error). This creates a minimal,
    honest lesson from each node's own title and description for any node that
    lacks one. It is idempotent: nodes that already have a lesson are skipped,
    so hand-authored lessons are never overwritten.
    """
    nodes = (await session.execute(select(KnowledgeNode))).scalars().all()
    have = set(
        (await session.execute(select(Lesson.node_id))).scalars().all()
    )
    created = 0
    for node in nodes:
        if node.id in have:
            continue
        is_technique = getattr(node, "kind", "") == "proof_technique"
        lesson = Lesson(node_id=node.id, title=node.title, summary=node.description)
        session.add(lesson)
        await session.flush()
        session.add(
            ContentStep(
                lesson_id=lesson.id,
                position=0,
                kind="reading",
                title="Overview",
                body=(
                    f"{node.description}\n\n"
                    + (
                        "This is a reusable proof technique. Learn its shape here, "
                        "then practise applying it; mastery of the technique carries "
                        "across every course that uses it."
                        if is_technique
                        else "Read the idea, then use Practice to work problems on this skill."
                    )
                ),
            )
        )
        session.add(
            ContentStep(
                lesson_id=lesson.id,
                position=1,
                kind="checkpoint",
                title="Practice",
                body="Head to Practice to try problems on this skill and move your mastery.",
            )
        )
        created += 1
    if created:
        await session.flush()
    return created


async def seed(session: AsyncSession) -> bool:
    """Seed the graph. Returns True if it seeded, False if already present.

    Badge definitions, the full mathematics-ladder graph, and the Phase 2 demo
    items are seeded on every run (idempotently) so a database created before
    those features existed still gets them without a full reseed.
    """
    await seed_badges(session)
    await seed_quests(session)
    # The full tier 0-6 curriculum backbone (Curriculum & Proof Extension). It is
    # idempotent and independent of the algebra demo below, so it seeds on every
    # startup, old databases included. The structured proof demo items attach to
    # its proof-transition and technique nodes.
    await seed_curriculum_graph(session)
    await seed_proof_items(session)
    await seed_reference_library(session)
    # Engineering Math track: Linear Algebra Unit 1 nodes + misconception library.
    await seed_eng_math_la_unit1(session)
    # Engineering Math track: ODE Units 1-5 (systems uses the eigen graders).
    await seed_eng_math_ode(session)
    # Engineering Math track: Linear Algebra Unit 7 (eigenvalues); adds the track
    # spine edge LA7 -> ODE systems, so it runs after the ODE seed.
    await seed_eng_math_la_unit7(session)
    # Engineering Math track: Linear Algebra Unit 6 (determinants); adds the edge
    # LA6 -> LA7 (determinants feed the characteristic polynomial), so it runs
    # after the LA Unit 7 seed.
    await seed_eng_math_la_unit6(session)
    # Engineering Math track: PDE/Fourier Unit 1 (Fourier series), the flagship;
    # adds the spine edge second-order ODE -> Fourier, so it runs after the ODE seed.
    await seed_eng_math_fourier_unit1(session)
    # Ensure every node in the full ladder has a lesson so the Learn view never
    # 404s (idempotent; skips nodes that already have one). Runs before the
    # first-run early-return below so it also covers existing databases.
    await backfill_lessons(session)

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

    # Build the pgvector semantic store from the seeded corpus when enabled. This
    # runs on every startup (idempotent full rebuild) and fails soft, so the copilot
    # keeps working through the in-memory ranker if the store is unavailable.
    from app.core.config import get_settings

    if get_settings().retrieval_store == "pgvector":
        from app.domains.copilot import pgvector_store

        async with sessionmaker() as session:
            written = await pgvector_store.rebuild(session)
            await session.commit()
        print(f"pgvector embeddings rebuilt: {written} rows")


if __name__ == "__main__":
    asyncio.run(_main())
