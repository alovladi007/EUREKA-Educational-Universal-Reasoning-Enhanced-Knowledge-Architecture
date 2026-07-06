"""AI-assisted grading of free-response (constructed text) answers.

A free_response item is scored against a rubric by the swappable reasoning
provider (deterministic mock in development and tests, EUREKA reasoning in
production). The result is explicitly AI-graded and always human-overridable:
the grader is recorded as "ai", the provider's confidence is carried through,
and a teacher can override the grade of record afterward.

This is text only. Handwritten and image responses need a vision model and are
not graded here.
"""

from __future__ import annotations

from app.domains.copilot.reasoning import (
    RubricCriterion,
    RubricScoreRequest,
    get_reasoning_provider,
)
from app.domains.grading.service import GradeOutcome

# Fraction of rubric points at or above which the response counts as correct for
# mastery. Partial credit below this still records the exact fractional score.
PASS_THRESHOLD = 0.6


async def grade_free_response(
    reference: str,
    response_text: str,
    rubric: list[dict],
    explanation: str = "",
) -> GradeOutcome:
    """Grade a free-response answer against a rubric via the reasoning provider.

    rubric is a list of {criterion, points, keywords}. The returned GradeOutcome
    carries per-criterion results in step_credits (with the rationale and points)
    and marks the grader as "ai" so the caller can label and expose an override.
    """
    criteria = [
        RubricCriterion(
            criterion=str(row.get("criterion", "")),
            points=float(row.get("points", 1)),
            keywords=list(row.get("keywords", []) or []),
        )
        for row in rubric
    ]

    provider = get_reasoning_provider()
    result = await provider.score_rubric(
        RubricScoreRequest(response_text=response_text, criteria=criteria, reference=reference)
    )

    fraction = (
        result.total_awarded / result.total_possible if result.total_possible > 0 else 0.0
    )
    is_correct = fraction >= PASS_THRESHOLD

    step_credits = [
        {
            "milestone": c.criterion,
            "awarded": c.met,
            "note": c.rationale,
            "points": c.points,
            "awarded_points": c.awarded_points,
        }
        for c in result.criteria
    ]

    detail = (
        f"AI rubric grade {result.total_awarded} of {result.total_possible} "
        f"via {result.provider}, confidence {result.confidence}"
    )
    return GradeOutcome(
        is_correct=is_correct,
        score=round(fraction, 4),
        grader="ai",
        confidence=result.confidence,
        detail=detail,
        correct_display=reference or "",
        explanation=explanation,
        step_credits=step_credits,
    )


async def grade_free_form_proof(
    reference: str,
    proof_text: str,
    rubric: list[dict],
    explanation: str = "",
) -> GradeOutcome:
    """AI-assisted first pass on a free-form proof (Extension Section 4.3).

    The reasoning provider compares the proof against a reference proof and a
    rubric of required milestones, producing a provisional score, line-level gap
    feedback (the milestones the argument does not establish), and targeted
    notes. This is a first pass, never a verdict: the grader is recorded as "ai"
    and the caller always routes a proof to the human-override queue. The AI
    never finalizes a high-stakes proof grade on its own.
    """
    outcome = await grade_free_response(reference, proof_text, rubric, explanation)

    # Suspected gaps are the required milestones the argument did not establish.
    gaps = [c["milestone"] for c in outcome.step_credits if not c["awarded"]]
    gap_note = (
        f"suspected gaps: {'; '.join(gaps)}" if gaps else "no gaps flagged in the rubric"
    )
    return GradeOutcome(
        is_correct=outcome.is_correct,
        score=outcome.score,
        grader="ai",
        confidence=outcome.confidence,
        detail=f"AI-assisted proof review ({gap_note}). Pending human sign-off.",
        correct_display=reference or "",
        explanation=explanation,
        step_credits=outcome.step_credits,
    )
