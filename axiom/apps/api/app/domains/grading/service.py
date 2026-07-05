"""Grading service.

Pure grading functions (no database) so they are trivial to unit test. The
practice and assessment flows call grade() and then persist the GradingRecord,
Score, and ReasoningTrace. Math grading delegates to math_core, which uses
SymPy symbolic equivalence rather than string matching, so several equivalent
correct forms all grade correct.

grader values: exact (selection), numeric (tolerance), cas (symbolic).
"""

from __future__ import annotations

from dataclasses import dataclass

from math_core import grade_equation, grade_expression, grade_numeric


@dataclass
class GradeOutcome:
    is_correct: bool
    score: float
    grader: str
    confidence: float
    detail: str
    correct_display: str
    explanation: str = ""


def grade(
    kind: str,
    correct: str,
    student_answer: str,
    *,
    options: list[str] | None = None,
    tolerance: float | None = None,
    explanation: str = "",
) -> GradeOutcome:
    """Grade a single response.

    kind is one of mcq_single, numeric, math_expression, equation. correct is
    the stored answer key (an index for mcq_single, else an expression or
    number as text). student_answer is the raw submission as text.
    """
    student = (student_answer or "").strip()

    if kind == "mcq_single":
        # correct is the option index. Accept either the index or the option
        # text as the submission so the frontend can send whichever it has.
        chosen_index: int | None = None
        if student.isdigit():
            chosen_index = int(student)
        elif options is not None and student in options:
            chosen_index = options.index(student)
        is_correct = str(chosen_index) == str(correct).strip()
        correct_display = ""
        if options is not None:
            try:
                correct_display = options[int(correct)]
            except (ValueError, IndexError):
                correct_display = str(correct)
        return GradeOutcome(
            is_correct=is_correct,
            score=1.0 if is_correct else 0.0,
            grader="exact",
            confidence=1.0,
            detail=f"selected index {chosen_index}, key {correct}",
            correct_display=correct_display,
            explanation=explanation,
        )

    if kind == "numeric":
        atol = tolerance if tolerance is not None else 1e-9
        res = grade_numeric(student, str(correct), atol=atol)
        return GradeOutcome(
            is_correct=res.is_correct,
            score=res.score,
            grader="numeric",
            confidence=res.confidence,
            detail=res.detail,
            correct_display=str(correct),
            explanation=explanation,
        )

    if kind == "math_expression":
        res = grade_expression(student, str(correct))
        return GradeOutcome(
            is_correct=res.is_correct,
            score=res.score,
            grader="cas",
            confidence=res.confidence,
            detail=res.detail,
            correct_display=str(correct),
            explanation=explanation,
        )

    if kind == "equation":
        res = grade_equation(student, str(correct))
        return GradeOutcome(
            is_correct=res.is_correct,
            score=res.score,
            grader="cas",
            confidence=res.confidence,
            detail=res.detail,
            correct_display=str(correct),
            explanation=explanation,
        )

    return GradeOutcome(
        is_correct=False,
        score=0.0,
        grader="exact",
        confidence=0.0,
        detail=f"unsupported item kind: {kind}",
        correct_display=str(correct),
        explanation=explanation,
    )
