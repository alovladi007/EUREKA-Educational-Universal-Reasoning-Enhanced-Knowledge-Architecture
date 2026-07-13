"""Fourier series coefficient grading (Engineering Math track, PDE/Fourier Unit 1).

The flagship, most-underserved slice of the track. A Fourier item asks for one
coefficient of the series of a periodic function on [-L, L], written in the
convention

    f(x) ~ a0/2 + sum_{n>=1} [ a_n cos(n pi x / L) + b_n sin(n pi x / L) ],
    a_n = (1/L) integral_{-L}^{L} f(x) cos(n pi x / L) dx,
    b_n = (1/L) integral_{-L}^{L} f(x) sin(n pi x / L) dx,

so a0 = (1/L) integral_{-L}^{L} f(x) dx.

Grading COMPUTES the reference coefficient with SymPy (exact integration, the
function may be a Piecewise) and checks the student's value is symbolically
equal, so any equivalent closed form is accepted. The same check gates an item's
reference coefficient before it ships, so no key is author-asserted.
"""

from __future__ import annotations

import sympy as sp

from .grading import GradeResult


def _ok(detail: str) -> GradeResult:
    return GradeResult(is_correct=True, score=1.0, grader="cas", confidence=1.0, detail=detail)


def _no(detail: str) -> GradeResult:
    return GradeResult(is_correct=False, score=0.0, grader="cas", confidence=1.0, detail=detail)


def _reference_coefficient(function: str, half_period: str, coeff: str, n, x: sp.Symbol) -> sp.Expr:
    """Compute a Fourier coefficient by exact integration over [-L, L]."""
    f = sp.sympify(str(function), locals={str(x): x})
    L = sp.sympify(str(half_period))
    if coeff == "a0":
        return sp.simplify((1 / L) * sp.integrate(f, (x, -L, L)))
    k = sp.Integer(int(n))
    if coeff == "a":
        return sp.simplify((1 / L) * sp.integrate(f * sp.cos(k * sp.pi * x / L), (x, -L, L)))
    if coeff == "b":
        return sp.simplify((1 / L) * sp.integrate(f * sp.sin(k * sp.pi * x / L), (x, -L, L)))
    raise ValueError(f"unknown coefficient kind: {coeff!r}")


def grade_fourier_coefficient(
    student_answer: str, function: str, half_period: str = "pi",
    coeff: str = "a", n: int = 1, var: str = "x",
) -> GradeResult:
    """Grade a single Fourier coefficient (a0, a_n, or b_n) of function on [-L, L].

    coeff is "a0", "a", or "b"; n is the harmonic (ignored for a0). Any
    equivalent closed form is accepted because the student's value is compared to
    the SymPy-integrated reference by symbolic simplification.
    """
    x = sp.Symbol(var, real=True)
    try:
        ref = _reference_coefficient(function, half_period, coeff, n, x)
        student = sp.sympify(str(student_answer), locals={var: x})
        if not isinstance(student, sp.Expr):
            return _no("the answer is not a numeric expression")
        matches = sp.simplify(ref - student) == 0
    except (sp.SympifyError, TypeError, ValueError, AttributeError) as exc:
        return _no(f"could not parse or integrate: {exc}")

    if matches:
        which = "a0" if coeff == "a0" else f"{coeff}_{n}"
        return _ok(f"matches the Fourier coefficient {which}")
    return _no("does not match the computed Fourier coefficient")


def verify_fourier_key(
    reference_answer: str, function: str, half_period: str = "pi",
    coeff: str = "a", n: int = 1, var: str = "x",
) -> bool:
    """Verified-everything gate: confirm an authored coefficient equals the
    SymPy-integrated reference before the item ships."""
    return grade_fourier_coefficient(
        reference_answer, function, half_period, coeff, n, var
    ).is_correct
