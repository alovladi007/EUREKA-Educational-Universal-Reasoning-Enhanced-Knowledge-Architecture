"""Deterministic proof-support checks (Curriculum & Proof Extension, Section 4.2).

check_counterexample evaluates a student-supplied object against an author's
property predicate, so a counterexample item grades deterministically: the
object counts only if it actually makes the (false) universal claim fail. This
is the "evaluating the constructed object against the property" path from the
extension; it uses the same restricted, sandboxed parser as every other grader,
so no arbitrary code runs on student or author input.
"""

from __future__ import annotations

import sympy

from ._safe import (
    MathParseError,
    _extract_symbol_names,
    build_local_symbols,
    safe_parse,
)


def check_counterexample(value: str, predicate: str, var: str = "n") -> bool:
    """True if substituting ``value`` for ``var`` makes ``predicate`` hold.

    ``predicate`` is an author-supplied relational or boolean expression that a
    valid counterexample must satisfy -- typically the negation of a false
    universal claim. For the false claim "for all n, n^2 > n", a counterexample
    satisfies "n**2 <= n", and value="1/2" (or any n in (0, 1)) makes it true.

    Returns False on any parse or evaluation error; never raises.
    """
    var = (var or "n").strip() or "n"
    try:
        symbol = sympy.Symbol(var, real=True)
        local = build_local_symbols({var} | _extract_symbol_names(value or ""))
        parsed_value = safe_parse(value, local_symbols=local)
        parsed_pred = safe_parse(predicate, local_symbols={**local, var: symbol})
        substituted = parsed_pred.subs(symbol, parsed_value)
        result = sympy.simplify(substituted)
    except (MathParseError, ValueError, TypeError, AttributeError):
        return False
    except Exception:  # noqa: BLE001 - any evaluation failure is a non-match.
        return False

    if result is sympy.true or result is True:
        return True
    if result is sympy.false or result is False:
        return False
    # A still-symbolic relational: attempt a concrete boolean evaluation.
    try:
        return bool(result) is True
    except TypeError:
        return False
