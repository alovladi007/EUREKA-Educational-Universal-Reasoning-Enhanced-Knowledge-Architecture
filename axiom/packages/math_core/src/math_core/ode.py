"""ODE solution grading (Engineering Math track, ODE units).

An ODE answer is graded by VERIFYING it satisfies the equation, not by comparing
it to one reference form. The item stores the ODE as a residual that must be zero
-- written with y for the unknown, yp for y', ypp for y'', and x the variable
(for example dy/dx = 2*x*y is the residual "yp - 2*x*y"). The grader substitutes
the student's proposed y(x) and its derivatives into that residual and checks it
simplifies to zero.

This accepts any equivalent form and any name for the arbitrary constant (C, C1,
k, ...), because a solution is judged by whether it solves the equation, which is
exactly what the spec calls for ("equivalence checking of the solution family,
including the arbitrary constant"). The same check gates an item's reference
solution before it ships, so no key is author-asserted.
"""

from __future__ import annotations

import sympy as sp

from .grading import GradeResult

_Y, _YP, _YPP = sp.symbols("y yp ypp")


def _ok(detail: str) -> GradeResult:
    return GradeResult(is_correct=True, score=1.0, grader="cas", confidence=1.0, detail=detail)


def _no(detail: str) -> GradeResult:
    return GradeResult(is_correct=False, score=0.0, grader="cas", confidence=1.0, detail=detail)


def _strip_lhs(text: str) -> str:
    """Drop a leading 'y =' or 'y(x) =' so only the expression for y remains."""
    s = str(text or "").strip()
    if "=" in s:
        lhs, _, rhs = s.partition("=")
        if lhs.strip().replace(" ", "") in ("y", "y(x)", "f", "f(x)"):
            return rhs.strip()
    return s


def _residual_value(student_solution: str, residual: str, var: str) -> sp.Expr:
    """Substitute the student's y(x) and its derivatives into the ODE residual."""
    x = sp.Symbol(var)
    ysol = sp.sympify(_strip_lhs(student_solution), locals={var: x})
    yp = sp.diff(ysol, x)
    ypp = sp.diff(ysol, x, 2)
    resid = sp.sympify(str(residual), locals={var: x})
    return resid.subs({_Y: ysol, _YP: yp, _YPP: ypp})


def grade_ode(
    student_solution: str, residual: str, var: str = "x", order: int | None = None
) -> GradeResult:
    """Grade a proposed ODE solution.

    Always checks the function satisfies the equation. When order is given (the
    ODE order), it additionally requires the GENERAL solution: exactly `order`
    arbitrary constants that produce linearly independent basis functions (a
    nonzero Wronskian). This rejects a mere particular member -- for example
    e^{2x} alone for a repeated-root second-order ODE -- while still accepting any
    equivalent form and any constant names. Omit order to accept any solution
    that satisfies the equation (a "verify this is a solution" item).
    """
    x = sp.Symbol(var)
    try:
        ysol = sp.sympify(_strip_lhs(student_solution), locals={var: x})
        value = _residual_value(student_solution, residual, var)
        if sp.simplify(value) != 0:
            return _no("the proposed function does not satisfy the ODE")
    except (sp.SympifyError, TypeError, ValueError, AttributeError) as exc:
        return _no(f"could not parse or evaluate the solution: {exc}")

    if order is not None:
        constants = sorted(ysol.free_symbols - {x}, key=str)
        if len(constants) != order:
            return _no(
                f"the general solution needs {order} arbitrary constant(s), "
                f"found {len(constants)}"
            )
        try:
            basis = [sp.diff(ysol, c) for c in constants]
            wronskian = sp.Matrix(
                [[sp.diff(b, x, i) for b in basis] for i in range(order)]
            )
            if sp.simplify(wronskian.det()) == 0:
                return _no("the arbitrary constants do not give independent solutions")
        except (TypeError, ValueError, AttributeError):
            return _no("could not check independence of the arbitrary constants")

    return _ok("the proposed function is a general solution of the ODE")


def verify_ode_key(reference_solution: str, residual: str, var: str = "x") -> bool:
    """Verified-everything gate: confirm an authored reference solution really
    solves the ODE before the item ships."""
    try:
        return bool(sp.simplify(_residual_value(reference_solution, residual, var)) == 0)
    except (sp.SympifyError, TypeError, ValueError, AttributeError):
        return False
