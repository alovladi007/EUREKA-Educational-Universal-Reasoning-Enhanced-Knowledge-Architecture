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
    Objective,
    Standard,
    StandardsFramework,
    Theorem,
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


async def seed(session: AsyncSession) -> bool:
    """Seed the graph. Returns True if it seeded, False if already present.

    Badge definitions, the full mathematics-ladder graph, and the Phase 2 demo
    items are seeded on every run (idempotently) so a database created before
    those features existed still gets them without a full reseed.
    """
    await seed_badges(session)
    # The full tier 0-6 curriculum backbone (Curriculum & Proof Extension). It is
    # idempotent and independent of the algebra demo below, so it seeds on every
    # startup, old databases included. The structured proof demo items attach to
    # its proof-transition and technique nodes.
    await seed_curriculum_graph(session)
    await seed_proof_items(session)
    await seed_reference_library(session)

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
