"""Multi-part mixed compute-then-prove grading (Extension Section 5, Section 10).

A mixed item bundles parts of different kinds -- typically compute an answer,
then prove a claim about it. Each part is routed to the right grader: the
computational parts go to the CAS/selection grader, the proof parts to the proof
graders (AI-assisted for free-form, the kernel for formal). Every part's result,
including which grader produced it, is recorded so the split is auditable.
"""

from __future__ import annotations

import json

from app.domains.grading.formal import grade_formal_proof
from app.domains.grading.free_response import grade_free_form_proof, grade_free_response
from app.domains.grading.service import GradeOutcome, grade


def _answer_for(answers, index: int) -> str:
    if isinstance(answers, list):
        return str(answers[index]) if index < len(answers) else ""
    if isinstance(answers, dict):
        if str(index) in answers:
            return str(answers[str(index)])
        if index in answers:
            return str(answers[index])
    return ""


async def grade_mixed(
    meta: dict | None, student_answer: str, explanation: str = ""
) -> GradeOutcome:
    """Grade a multi-part mixed item, splitting parts across graders.

    meta.parts is a list of part specs, each a dict with at least a kind and a
    correct key (plus kind-specific fields: options, tolerance, rubric,
    milestones, predicate, prelude). The student answer is a JSON list or object
    keyed by part index. The overall score is the mean of part scores and the
    item is correct only when every part is. Each part's grader and detail are
    recorded in step_credits.
    """
    meta = meta or {}
    parts = meta.get("parts") or []
    try:
        answers = json.loads(student_answer) if student_answer else {}
    except (ValueError, TypeError):
        answers = {}

    part_results: list[dict] = []
    total = 0.0
    all_correct = bool(parts)
    for index, part in enumerate(parts):
        if not isinstance(part, dict):
            continue
        pkind = str(part.get("kind", ""))
        pcorrect = str(part.get("correct", ""))
        pans = _answer_for(answers, index)

        if pkind == "free_form_proof":
            outcome = await grade_free_form_proof(pcorrect, pans, part.get("rubric") or [])
        elif pkind == "free_response":
            outcome = await grade_free_response(pcorrect, pans, part.get("rubric") or [])
        elif pkind == "formal_proof":
            outcome = await grade_formal_proof(pans, part)
        else:
            outcome = grade(
                pkind,
                pcorrect,
                pans,
                options=part.get("options"),
                tolerance=part.get("tolerance"),
                milestones=part.get("milestones"),
                meta=part,
            )

        total += outcome.score
        all_correct = all_correct and outcome.is_correct
        part_results.append(
            {
                "milestone": str(part.get("label", f"part {index + 1}")),
                "awarded": outcome.is_correct,
                "note": f"[{outcome.grader}] {outcome.detail}",
                "points": 1,
                "awarded_points": round(outcome.score, 4),
            }
        )

    denominator = len(part_results) or 1
    return GradeOutcome(
        is_correct=all_correct,
        score=round(total / denominator, 4),
        grader="mixed",
        confidence=1.0,
        detail=f"{len(part_results)} parts graded (compute to CAS, prove to the proof grader)",
        correct_display="",
        explanation=explanation,
        step_credits=part_results,
    )
