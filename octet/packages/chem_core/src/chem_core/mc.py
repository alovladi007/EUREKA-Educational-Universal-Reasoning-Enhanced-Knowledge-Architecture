"""Grader 6: misconception keyed multiple choice.

Ported behaviour from the AXIOM diagnostic machinery. A choice is not just
right or wrong: each distractor names the belief a learner holds when they
pick it, and that belief routes to a remediation node.

The independent check for this grader is structural rather than numerical: an
item is not servable unless every distractor keys a misconception that exists
in the library and routes somewhere. validate_choices() is that check and it
runs in CI.
"""

from __future__ import annotations

from .misconceptions import MISCONCEPTIONS
from .types import GradeResult


def grade_mc(correct_index: int, student_choice, choices: list[dict]) -> GradeResult:
    """Grade one multiple choice submission.

    choices: list of dicts shaped {"index": int, "text": str,
    "misconception": code or None}. The correct choice carries no misconception.
    """
    grader = "mc"
    try:
        picked = int(student_choice)
    except (TypeError, ValueError):
        return GradeResult.ungradable(grader, "No option was selected.")

    valid = {c.get("index") for c in choices}
    if picked not in valid:
        return GradeResult.ungradable(grader, "That option is not on this item.")

    if picked == correct_index:
        return GradeResult(is_correct=True, score=1.0, grader=grader, detail="Correct.")

    chosen = next((c for c in choices if c.get("index") == picked), {})
    code = chosen.get("misconception")
    m = MISCONCEPTIONS.get(code) if code else None
    if m is None:
        return GradeResult(
            is_correct=False,
            score=0.0,
            grader=grader,
            detail="Not correct. Look again at what the question is asking.",
        )
    # Name the belief and show the counterexample. Never state the answer.
    return GradeResult(
        is_correct=False,
        score=0.0,
        grader=grader,
        misconception=code,
        detail=f"{m.name}. {m.counterexample}",
    )


def validate_choices(choices: list[dict], correct_index: int) -> list[str]:
    """Structural check on an MC item. Returns a list of problems, empty is good.

    Enforces the compliance rule that every distractor keys a named
    misconception and every named misconception routes to a node.
    """
    problems: list[str] = []
    indices = [c.get("index") for c in choices]
    if len(set(indices)) != len(indices):
        problems.append("duplicate choice indices")
    if correct_index not in indices:
        problems.append("correct_index is not among the choices")
    for c in choices:
        idx = c.get("index")
        if not str(c.get("text", "")).strip():
            problems.append(f"choice {idx} has no text")
        if idx == correct_index:
            if c.get("misconception"):
                problems.append(f"choice {idx} is correct but keys a misconception")
            continue
        code = c.get("misconception")
        if not code:
            problems.append(f"distractor {idx} keys no misconception")
            continue
        m = MISCONCEPTIONS.get(code)
        if m is None:
            problems.append(f"distractor {idx} keys unknown misconception {code}")
        elif not m.routes_to:
            problems.append(f"misconception {code} routes nowhere")
    return problems
