"""Calculus grading (Engineering Math track foundations).

An antiderivative is graded by DIFFERENTIATION, not by comparison to one stored
form: F is correct iff F'(x) equals the integrand. Any valid antiderivative
passes -- ones differing by a constant, or written in a different but equivalent
form (x*sin(x)+cos(x) vs the same plus 7, sin^2 vs -cos^2/..., etc.). This is the
same grade-by-verification principle as the ODE and Laplace graders.
"""

from __future__ import annotations

import sympy as sp

from .grading import GradeResult


def _ok(detail: str) -> GradeResult:
    return GradeResult(is_correct=True, score=1.0, grader="cas", confidence=1.0, detail=detail)


def _no(detail: str) -> GradeResult:
    return GradeResult(is_correct=False, score=0.0, grader="cas", confidence=1.0, detail=detail)


def grade_antiderivative(student_answer: str, integrand: str, var: str = "x") -> GradeResult:
    """Grade a proposed antiderivative F of the integrand f.

    Correct iff d/dx F(x) - f(x) simplifies to zero, so any equivalent form and
    any constant of integration is accepted.
    """
    x = sp.Symbol(var, real=True)
    try:
        f = sp.sympify(str(integrand), locals={var: x})
        big_f = sp.sympify(str(student_answer), locals={var: x})
        if not isinstance(big_f, sp.Expr):
            return _no("the answer is not an expression")
        diff = sp.simplify(sp.diff(big_f, x) - f)
    except (sp.SympifyError, TypeError, ValueError, AttributeError) as exc:
        return _no(f"could not parse or differentiate: {exc}")
    if diff == 0:
        return _ok("the derivative of the answer equals the integrand")
    return _no("the derivative of the answer does not equal the integrand")


def verify_antiderivative_key(reference_answer: str, integrand: str, var: str = "x") -> bool:
    """Verified-everything gate: confirm an authored antiderivative differentiates
    back to the integrand before the item ships."""
    return grade_antiderivative(reference_answer, integrand, var).is_correct
