"""PDE solution grading (Engineering Math track, PDE/Fourier Units 4-6).

The same grade-by-verification principle as the ODE grader, extended to partial
derivatives. An item stores the PDE as a residual that must be zero, written
with u for the unknown and derivative symbols:

    ut, utt   -- time derivatives          ux, uxx -- x derivatives
    uy, uyy   -- y derivatives (Laplace's equation on the plane)

Examples: the heat equation u_t = k u_xx is the residual "ut - k*uxx" (with k a
number in the item); the wave equation is "utt - c**2*uxx"; Laplace's equation
is "uxx + uyy". The grader substitutes the student's proposed u (a function of
x and t, or x and y) and its partial derivatives into the residual and checks
it simplifies to zero, so any equivalent form is accepted -- a separated-
variables product, a d'Alembert traveling wave, or any other correct closed
form all pass. The same check gates an item's reference solution before it
ships, so no key is author-asserted.
"""

from __future__ import annotations

import sympy as sp

from .grading import GradeResult

_U = sp.Symbol("u")
_DERIVS = ("ut", "utt", "ux", "uxx", "uy", "uyy")


def _ok(detail: str) -> GradeResult:
    return GradeResult(is_correct=True, score=1.0, grader="cas", confidence=1.0, detail=detail)


def _no(detail: str) -> GradeResult:
    return GradeResult(is_correct=False, score=0.0, grader="cas", confidence=1.0, detail=detail)


def _strip_lhs(text: str) -> str:
    """Drop a leading 'u =' or 'u(x,t) =' so only the expression remains."""
    s = str(text or "").strip()
    if "=" in s:
        lhs, _, rhs = s.partition("=")
        if lhs.strip().replace(" ", "").replace("(x,t)", "").replace("(x,y)", "") == "u":
            return rhs.strip()
    return s


def grade_pde(
    student_solution: str, residual: str, var_x: str = "x", var_t: str = "t",
    var_y: str = "y",
) -> GradeResult:
    """Grade a proposed PDE solution by substitution into the residual.

    The student submits u as an expression in the independent variables; the
    residual uses u/ut/utt/ux/uxx/uy/uyy. Correct iff the residual simplifies to
    zero identically, so any equivalent form (and any arbitrary constants it
    carries) is accepted -- this is a "verify u solves the PDE" check.
    """
    x = sp.Symbol(var_x, real=True)
    t = sp.Symbol(var_t, real=True)
    y = sp.Symbol(var_y, real=True)
    try:
        usol = sp.sympify(_strip_lhs(student_solution), locals={var_x: x, var_t: t, var_y: y})
        if not isinstance(usol, sp.Expr):
            return _no("the answer is not an expression")
        subs = {
            _U: usol,
            sp.Symbol("ut"): sp.diff(usol, t),
            sp.Symbol("utt"): sp.diff(usol, t, 2),
            sp.Symbol("ux"): sp.diff(usol, x),
            sp.Symbol("uxx"): sp.diff(usol, x, 2),
            sp.Symbol("uy"): sp.diff(usol, y),
            sp.Symbol("uyy"): sp.diff(usol, y, 2),
        }
        resid = sp.sympify(str(residual), locals={var_x: x, var_t: t, var_y: y})
        value = sp.simplify(resid.subs(subs))
    except (sp.SympifyError, TypeError, ValueError, AttributeError) as exc:
        return _no(f"could not parse or evaluate the solution: {exc}")
    if value == 0:
        return _ok("the proposed function satisfies the PDE")
    return _no("the proposed function does not satisfy the PDE")


def verify_pde_key(reference_solution: str, residual: str, **kwargs) -> bool:
    """Verified-everything gate for an authored PDE reference solution."""
    return grade_pde(reference_solution, residual, **kwargs).is_correct
