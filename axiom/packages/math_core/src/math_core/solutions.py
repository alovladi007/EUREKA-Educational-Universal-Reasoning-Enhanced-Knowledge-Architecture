"""Worked-solution generation and verification (the DeltaMath strength).

Two capabilities, both grounded in the CAS so nothing shown to a student is
unchecked:

- verify_steps: given the ordered lines of a worked solution, confirm each line
  follows from the previous one (consecutive lines are mathematically
  equivalent). This is what makes an authored or generated solution trustworthy:
  every step is verified against SymPy before it is shown.
- linear_equation_steps: generate a verified step-by-step solution for a linear
  equation in one variable (isolate the variable), returning None when the input
  is not a single-variable linear equation.

Equivalence for equation-shaped lines compares solution sets (both sides moved to
one side, equal up to a nonzero scalar), matching grade_equation. Plain
expressions use symbolic_equal.
"""

from __future__ import annotations

import sympy
from pydantic import BaseModel

from ._safe import MathParseError, MathTimeoutError, safe_parse, time_limit
from .grading import _combined_symbols, symbolic_equal


class SolutionStep(BaseModel):
    text: str
    verified: bool
    detail: str = ""


class SolutionCheck(BaseModel):
    ok: bool
    steps: list[SolutionStep]


def _to_zero_form(text: str) -> str:
    if "=" in text:
        lhs, _, rhs = text.partition("=")
        return f"({lhs}) - ({rhs})"
    return text


def _equation_equivalent(a: str, b: str) -> bool:
    """Two equation lines are equivalent when their solution sets match.

    Both are moved to zero-form and compared up to a nonzero scalar multiple, so
    "2x = 8" and "x = 4" are equivalent (one is twice the other after moving to
    one side).
    """
    try:
        za, zb = _to_zero_form(a), _to_zero_form(b)
        local = _combined_symbols(za, zb)
        ea = safe_parse(za, local_symbols=local)
        eb = safe_parse(zb, local_symbols=local)
        with time_limit(6.0):
            sa = sympy.simplify(ea)
            sb = sympy.simplify(eb)
            if sa == 0 and sb == 0:
                return True
            if sa == 0 or sb == 0:
                return False
            ratio = sympy.simplify(sa / sb)
            if ratio.free_symbols == set() and ratio != 0 and ratio.is_finite is not False:
                return True
            return sympy.simplify(sa - sb) == 0
    except (MathParseError, MathTimeoutError):
        return False
    except Exception:  # noqa: BLE001 - any evaluation failure is a non-match.
        return False


def _line_equivalent(a: str, b: str) -> bool:
    if "=" in a or "=" in b:
        return _equation_equivalent(a, b)
    return symbolic_equal(a, b)


def verify_steps(steps: list[str]) -> SolutionCheck:
    """Verify that each line of a worked solution follows from the previous one.

    The first line is taken as given (verified True). Every later line is
    verified True when it is equivalent to the line before it. A single broken
    link makes the whole check fail, which is what a caller uses to refuse to
    show or store an unverified solution.
    """
    clean = [s.strip() for s in steps if s and s.strip()]
    results: list[SolutionStep] = []
    ok = True
    previous: str | None = None
    for line in clean:
        if previous is None:
            results.append(SolutionStep(text=line, verified=True, detail="given"))
        else:
            good = _line_equivalent(previous, line)
            ok = ok and good
            results.append(
                SolutionStep(
                    text=line,
                    verified=good,
                    detail="follows from the previous step" if good else "does not follow",
                )
            )
        previous = line
    return SolutionCheck(ok=ok and len(results) > 0, steps=results)


def linear_equation_steps(equation: str) -> list[str] | None:
    """Generate a verified step-by-step solution for a linear equation in x.

    Returns the ordered lines (original, isolate the variable term, divide by the
    coefficient) for a single-variable linear equation, or None if the input is
    not such an equation. The returned steps are re-run through verify_steps so a
    generated solution is never returned unverified.
    """
    if "=" not in equation:
        return None
    try:
        zero = _to_zero_form(equation)
        local = _combined_symbols(zero)
        expr = safe_parse(zero, local_symbols=local)
        with time_limit(6.0):
            poly_symbols = sorted(expr.free_symbols, key=lambda s: s.name)
            if len(poly_symbols) != 1:
                return None
            var = poly_symbols[0]
            poly = sympy.Poly(sympy.expand(expr), var)
            if poly.degree() != 1:
                return None
            a = poly.coeff_monomial(var)
            b = poly.coeff_monomial(1)
            if a == 0:
                return None
            # Steps: original; a*x = -b (isolate the variable term); x = -b/a.
            solution = sympy.simplify(-b / a)
            isolate = f"{str(a * var)} = {str(-b)}"
            answer = f"{var} = {str(solution)}"
            steps = [equation.strip(), isolate, answer]
    except (MathParseError, MathTimeoutError):
        return None
    except Exception:  # noqa: BLE001
        return None

    check = verify_steps(steps)
    if not check.ok:
        return None
    return steps
