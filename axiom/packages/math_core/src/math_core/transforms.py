"""Laplace transform grading (Engineering Math track, ODE Unit 4).

A Laplace item is graded by COMPUTING the reference transform with SymPy and
checking the student's answer is symbolically equal to it, so any equivalent
form is accepted (1/(s-3) and (s-3)**-1, sin(2t) and 2 sin(t) cos(t), ...).

Two directions:
  forward  -- given f(t), the student submits F(s) = L{f}(s).
  inverse  -- given F(s), the student submits f(t) = L^{-1}{F}(t).

Grading substitutes Heaviside(t) -> 1 in inverse results (t is taken on the
causal domain t >= 0, where the unit step is 1) before comparing. The same
check gates an item's reference answer before it ships, so no key is
author-asserted.
"""

from __future__ import annotations

import sympy as sp

from .grading import GradeResult


def _ok(detail: str) -> GradeResult:
    return GradeResult(is_correct=True, score=1.0, grader="cas", confidence=1.0, detail=detail)


def _no(detail: str) -> GradeResult:
    return GradeResult(is_correct=False, score=0.0, grader="cas", confidence=1.0, detail=detail)


def _causal(expr: sp.Expr, t: sp.Symbol) -> sp.Expr:
    """Normalize a time-domain expression on the causal domain t >= 0, where the
    unit step Heaviside(t) is 1."""
    return expr.subs(sp.Heaviside(t), 1)


def _reference(source: str, direction: str, t: sp.Symbol, s: sp.Symbol) -> tuple[sp.Expr, sp.Symbol]:
    """Compute the reference transform (forward) or inverse transform, and return
    it together with the variable the answer is a function of."""
    if direction == "inverse":
        big_f = sp.sympify(str(source), locals={str(s): s})
        ref = sp.inverse_laplace_transform(big_f, s, t, noconds=True)
        return _causal(ref, t), t
    small_f = sp.sympify(str(source), locals={str(t): t})
    ref = sp.laplace_transform(small_f, t, s, noconds=True)
    return ref, s


def grade_laplace(
    student_answer: str, source: str, direction: str = "forward",
    var_t: str = "t", var_s: str = "s",
) -> GradeResult:
    """Grade a Laplace transform (forward) or inverse transform (inverse).

    source is the given function: f(t) when direction is 'forward' (the student
    submits F(s)), or F(s) when direction is 'inverse' (the student submits
    f(t)). Any equivalent closed form is accepted because grading compares
    against the SymPy-computed reference by symbolic simplification, with a
    numeric fallback for forms simplify cannot close.
    """
    t = sp.Symbol(var_t, positive=True)
    s = sp.Symbol(var_s)
    answer_var = s if direction != "inverse" else t
    try:
        ref, answer_var = _reference(source, direction, t, s)
        student = _causal(
            sp.sympify(str(student_answer), locals={var_t: t, var_s: s}), t
        )
    except (sp.SympifyError, TypeError, ValueError, AttributeError) as exc:
        return _no(f"could not parse or evaluate the transform: {exc}")

    diff = sp.simplify(ref - student)
    if diff == 0:
        return _ok("matches the Laplace transform")
    # Numeric fallback: probe a few points in the answer variable's domain.
    try:
        pts = [sp.Rational(k, 2) for k in (3, 5, 7, 11)]
        if all(abs(complex(diff.subs(answer_var, p))) < 1e-9 for p in pts):
            return _ok("matches the Laplace transform (numeric)")
    except (TypeError, ValueError):
        pass
    return _no("does not match the Laplace transform")


def verify_laplace_key(
    reference_answer: str, source: str, direction: str = "forward",
    var_t: str = "t", var_s: str = "s",
) -> bool:
    """Verified-everything gate: confirm an authored reference answer equals the
    SymPy-computed transform before the item ships."""
    return grade_laplace(reference_answer, source, direction, var_t, var_s).is_correct
