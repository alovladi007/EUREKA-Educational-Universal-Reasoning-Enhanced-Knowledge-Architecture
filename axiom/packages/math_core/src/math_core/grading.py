"""CAS, exact, and numeric grading for the AXIOM math platform.

All grading entry points return a GradeResult and never raise on bad input:
a parse failure or evaluation error is reported through the result's detail
field with is_correct False. This keeps the grading service total (every
submission gets a structured verdict) and keeps the safety guarantees of the
_safe module at the boundary.
"""

from __future__ import annotations

import random
from typing import Literal

import sympy
from pydantic import BaseModel, Field

from ._safe import (
    MathParseError,
    MathTimeoutError,
    build_local_symbols,
    safe_parse,
    time_limit,
)

GraderName = Literal["cas", "exact", "numeric"]
RequireForm = Literal["reduced", "factored", "expanded"]


class GradeResult(BaseModel):
    """Structured verdict for a single graded submission."""

    is_correct: bool
    score: float = Field(ge=0.0, le=1.0)
    grader: GraderName
    confidence: float = Field(ge=0.0, le=1.0)
    detail: str
    normalized_student: str | None = None
    normalized_expected: str | None = None


def _combined_symbols(*texts: str) -> dict[str, sympy.Symbol]:
    """Build one shared local symbol table across several math strings.

    Using a shared table ensures that the same variable name maps to the same
    real-valued Symbol object in both the student and expected expressions, so
    equivalence checks compare like with like.
    """
    from ._safe import _extract_symbol_names

    names: set[str] = set()
    for text in texts:
        names |= _extract_symbol_names(text)
    return build_local_symbols(names)


def _numeric_probe(
    diff: sympy.Expr,
    symbols: list[sympy.Symbol],
    *,
    trials: int = 24,
    atol: float = 1e-9,
) -> bool:
    """Randomized numeric equivalence probe.

    Evaluate the difference of two expressions at several random real points and
    check it is numerically zero everywhere sampled. This is the final fallback
    when symbolic simplification is inconclusive. It can produce a false
    positive only if two genuinely different expressions agree at every sampled
    point, which is vanishingly unlikely for the trial count used here.
    """
    rng = random.Random(1234567)
    if not symbols:
        try:
            value = complex(sympy.N(diff))
            return abs(value) <= atol
        except (TypeError, ValueError):
            return False

    hits = 0
    checked = 0
    for _ in range(trials):
        subs = {s: sympy.Float(rng.uniform(-3.0, 3.0)) for s in symbols}
        try:
            value = complex(sympy.N(diff.subs(subs)))
        except (TypeError, ValueError, ZeroDivisionError):
            # Skip points where the expression is undefined (for example a pole
            # of a rational function). Do not count them for or against.
            continue
        checked += 1
        if abs(value) <= max(atol, 1e-6 * (1.0 + abs(value))):
            hits += 1
    if checked == 0:
        return False
    return hits == checked


def symbolic_equal(
    student: str,
    expected: str,
    *,
    assume_real: bool = True,
) -> bool:
    """Robust symbolic equivalence of two expression strings.

    Strategy (each step is a fallback for the previous one):
    1. Parse both with the shared safe parser.
    2. Test simplify(a - b) == 0.
    3. Fall back to trigsimp and expand on the difference.
    4. Fall back to a randomized numeric probe over the free symbols.

    Returns False on any parse or evaluation error (never raises). The
    assume_real flag is honored via the real-valued local symbol table.
    """
    try:
        local = _combined_symbols(student, expected)
        if not assume_real:
            local = {name: sympy.Symbol(name) for name in local}
        a = safe_parse(student, local_symbols=local)
        b = safe_parse(expected, local_symbols=local)
    except (MathParseError, MathTimeoutError):
        return False

    try:
        with time_limit(6.0):
            diff = sympy.sympify(a) - sympy.sympify(b)

            simplified = sympy.simplify(diff)
            if simplified == 0:
                return True

            for transform in (sympy.expand, sympy.trigsimp, sympy.cancel):
                try:
                    if sympy.simplify(transform(diff)) == 0:
                        return True
                except Exception:  # noqa: BLE001 - transform may not apply.
                    continue

            # Try zero-check on a fully expanded, trig-simplified form.
            try:
                combo = sympy.simplify(sympy.trigsimp(sympy.expand(diff)))
                if combo == 0:
                    return True
            except Exception:  # noqa: BLE001
                pass

            symbols = sorted(diff.free_symbols, key=lambda s: s.name)
            return _numeric_probe(diff, symbols)
    except MathTimeoutError:
        return False
    except Exception:  # noqa: BLE001 - any evaluation failure is a non-match.
        return False


def _safe_str(expr: sympy.Expr) -> str:
    try:
        return str(expr)
    except Exception:  # noqa: BLE001
        return "<unrenderable>"


def _check_form(expr: sympy.Expr, require_form: RequireForm) -> tuple[bool, str]:
    """Check that a student expression is in the required form.

    Pragmatic definitions:
    - reduced: the expression equals its cancelled and simplified canonical
      form (no common factors left, rational functions in lowest terms).
    - factored: the expression is structurally equal to its factored form,
      that is, factor(expr) returns the same structure the student wrote.
    - expanded: the expression equals its expanded form.

    Returns (ok, detail).
    """
    try:
        with time_limit(6.0):
            if require_form == "reduced":
                # Reduced form: the value must match the cancelled and
                # simplified canonical form, and the student's own cancelled
                # form must be structurally identical to that canonical form
                # (rational functions in lowest terms, no common factors left).
                canonical = sympy.cancel(sympy.simplify(expr))
                ok = sympy.simplify(expr - canonical) == 0 and (
                    sympy.srepr(sympy.cancel(expr)) == sympy.srepr(canonical)
                )
                return ok, "reduced-form check"
            if require_form == "expanded":
                expanded = sympy.expand(expr)
                ok = sympy.srepr(expr) == sympy.srepr(expanded)
                return ok, "expanded-form check"
            if require_form == "factored":
                factored = sympy.factor(expr)
                # The student expression, when re-factored, must equal itself,
                # and it must not equal its own expansion (a bare polynomial
                # such as x**2 - 1 is not accepted as factored). We compare the
                # student's structure to sympy's factored structure.
                same_as_factored = sympy.srepr(sympy.factor(expr)) == sympy.srepr(
                    factored
                )
                is_already_expanded = sympy.srepr(expr) == sympy.srepr(
                    sympy.expand(expr)
                )
                # A truly factored form differs from its expansion when the
                # expression is factorable; if factor() cannot reduce it, the
                # expanded and factored forms coincide and we accept.
                factorable = sympy.srepr(factored) != sympy.srepr(sympy.expand(expr))
                if factorable:
                    ok = (
                        sympy.srepr(expr) == sympy.srepr(factored)
                        and not is_already_expanded
                    )
                else:
                    ok = same_as_factored
                return ok, "factored-form check"
    except MathTimeoutError:
        return False, "form check timed out"
    except Exception as exc:  # noqa: BLE001
        return False, f"form check error: {exc}"
    return True, "no form constraint"


def grade_expression(
    student: str,
    expected: str,
    *,
    require_form: RequireForm | None = None,
) -> GradeResult:
    """CAS grading of a student expression against an expected expression.

    If require_form is set, the student's expression must both be equivalent to
    the expected answer AND be written in the required form (reduced, factored,
    or expanded). Form checking is pragmatic and documented in _check_form.
    """
    grader: GraderName = "cas"
    try:
        local = _combined_symbols(student, expected)
        stu_expr = safe_parse(student, local_symbols=local)
        exp_expr = safe_parse(expected, local_symbols=local)
    except MathTimeoutError:
        return GradeResult(
            is_correct=False,
            score=0.0,
            grader=grader,
            confidence=1.0,
            detail="evaluation timed out while parsing",
        )
    except MathParseError as exc:
        return GradeResult(
            is_correct=False,
            score=0.0,
            grader=grader,
            confidence=1.0,
            detail=f"parse error: {exc}",
        )

    norm_student = _safe_str(sympy.simplify(stu_expr))
    norm_expected = _safe_str(sympy.simplify(exp_expr))

    equal = symbolic_equal(student, expected)
    if not equal:
        return GradeResult(
            is_correct=False,
            score=0.0,
            grader=grader,
            confidence=0.95,
            detail="expressions are not equivalent",
            normalized_student=norm_student,
            normalized_expected=norm_expected,
        )

    if require_form is not None:
        ok, detail = _check_form(stu_expr, require_form)
        if not ok:
            return GradeResult(
                is_correct=False,
                score=0.0,
                grader=grader,
                confidence=0.9,
                detail=f"equivalent but not in required form ({require_form}): {detail}",
                normalized_student=norm_student,
                normalized_expected=norm_expected,
            )
        return GradeResult(
            is_correct=True,
            score=1.0,
            grader=grader,
            confidence=0.95,
            detail=f"equivalent and in required form ({require_form})",
            normalized_student=norm_student,
            normalized_expected=norm_expected,
        )

    return GradeResult(
        is_correct=True,
        score=1.0,
        grader=grader,
        confidence=0.98,
        detail="expressions are equivalent",
        normalized_student=norm_student,
        normalized_expected=norm_expected,
    )


def grade_numeric(
    student: str,
    expected: str,
    *,
    atol: float = 1e-9,
    rtol: float = 1e-6,
    sig_figs: int | None = None,
) -> GradeResult:
    """Numeric grading: evaluate both sides and compare within tolerance.

    When sig_figs is given, both values are rounded to that many significant
    figures before comparison and the tolerance check is applied on the rounded
    values. Otherwise a standard absolute-plus-relative tolerance test is used:
    abs(s - e) <= atol + rtol * abs(e).
    """
    grader: GraderName = "numeric"
    try:
        stu_expr = safe_parse(student)
        exp_expr = safe_parse(expected)
        with time_limit(5.0):
            stu_val = complex(sympy.N(stu_expr))
            exp_val = complex(sympy.N(exp_expr))
    except MathTimeoutError:
        return GradeResult(
            is_correct=False,
            score=0.0,
            grader=grader,
            confidence=1.0,
            detail="evaluation timed out",
        )
    except (MathParseError, TypeError, ValueError) as exc:
        return GradeResult(
            is_correct=False,
            score=0.0,
            grader=grader,
            confidence=1.0,
            detail=f"could not evaluate numerically: {exc}",
        )

    norm_student = repr(stu_val)
    norm_expected = repr(exp_val)

    if sig_figs is not None:

        def _round_sig(z: complex, figs: int) -> complex:
            def _r(x: float) -> float:
                if x == 0.0:
                    return 0.0
                return float(f"%.{figs}g" % x)

            return complex(_r(z.real), _r(z.imag))

        s = _round_sig(stu_val, sig_figs)
        e = _round_sig(exp_val, sig_figs)
        ok = abs(s - e) <= atol + rtol * abs(e)
        detail = f"compared at {sig_figs} significant figures"
    else:
        s, e = stu_val, exp_val
        ok = abs(s - e) <= atol + rtol * abs(e)
        detail = f"abs(diff)={abs(s - e):.3e}, tol={atol + rtol * abs(e):.3e}"

    return GradeResult(
        is_correct=ok,
        score=1.0 if ok else 0.0,
        grader=grader,
        confidence=0.97,
        detail=detail if ok else f"outside tolerance: {detail}",
        normalized_student=norm_student,
        normalized_expected=norm_expected,
    )


def _split_equation(text: str) -> tuple[str, str]:
    """Split an "lhs = rhs" string into its two sides.

    Rejects strings containing comparison operators or multiple equals signs to
    avoid ambiguous input. A single = is required.
    """
    for bad in ("==", ">=", "<=", "!=", ">", "<"):
        if bad in text:
            raise MathParseError(f"unsupported operator in equation: {bad}")
    parts = text.split("=")
    if len(parts) != 2:
        raise MathParseError("equation must contain exactly one '=' sign")
    lhs, rhs = parts[0].strip(), parts[1].strip()
    if not lhs or not rhs:
        raise MathParseError("equation is missing a side")
    return lhs, rhs


def grade_equation(student: str, expected: str) -> GradeResult:
    """Grade an equation of the form "lhs = rhs".

    Two equations are equivalent when their solution sets match. We move all
    terms to one side (lhs - rhs) for each equation, then test whether the two
    resulting expressions are equal up to a nonzero scalar multiple. This makes
    "y = 2x + 4" and "2y = 4x + 8" equivalent, since one is exactly twice the
    other.
    """
    grader: GraderName = "cas"
    try:
        s_lhs, s_rhs = _split_equation(student)
        e_lhs, e_rhs = _split_equation(expected)
        local = _combined_symbols(s_lhs, s_rhs, e_lhs, e_rhs)
        s_form = safe_parse(s_lhs, local_symbols=local) - safe_parse(
            s_rhs, local_symbols=local
        )
        e_form = safe_parse(e_lhs, local_symbols=local) - safe_parse(
            e_rhs, local_symbols=local
        )
    except MathTimeoutError:
        return GradeResult(
            is_correct=False,
            score=0.0,
            grader=grader,
            confidence=1.0,
            detail="evaluation timed out while parsing equation",
        )
    except MathParseError as exc:
        return GradeResult(
            is_correct=False,
            score=0.0,
            grader=grader,
            confidence=1.0,
            detail=f"parse error: {exc}",
        )

    norm_student = _safe_str(sympy.simplify(s_form)) + " = 0"
    norm_expected = _safe_str(sympy.simplify(e_form)) + " = 0"

    try:
        with time_limit(6.0):
            s_simpl = sympy.simplify(s_form)
            e_simpl = sympy.simplify(e_form)

            # Both trivial (0 = 0) means both are identities.
            if s_simpl == 0 and e_simpl == 0:
                is_equal = True
            elif s_simpl == 0 or e_simpl == 0:
                is_equal = False
            else:
                # Equivalent up to a nonzero scalar multiple: the ratio must be
                # a nonzero constant (free of all symbols).
                ratio = sympy.simplify(s_simpl / e_simpl)
                is_equal = (
                    ratio.free_symbols == set()
                    and ratio != 0
                    and ratio.is_finite is not False
                )
                if not is_equal:
                    # Fall back to direct equivalence (scalar of 1).
                    is_equal = sympy.simplify(s_simpl - e_simpl) == 0
    except MathTimeoutError:
        return GradeResult(
            is_correct=False,
            score=0.0,
            grader=grader,
            confidence=1.0,
            detail="evaluation timed out while comparing equations",
        )
    except Exception as exc:  # noqa: BLE001
        return GradeResult(
            is_correct=False,
            score=0.0,
            grader=grader,
            confidence=0.8,
            detail=f"comparison error: {exc}",
            normalized_student=norm_student,
            normalized_expected=norm_expected,
        )

    return GradeResult(
        is_correct=bool(is_equal),
        score=1.0 if is_equal else 0.0,
        grader=grader,
        confidence=0.95,
        detail=(
            "solution sets match (equal up to nonzero scalar)"
            if is_equal
            else "solution sets differ"
        ),
        normalized_student=norm_student,
        normalized_expected=norm_expected,
    )


# Two-character operators are checked before one-character ones so "<=" is not
# mistaken for "<". Each maps to the SymPy relational constructor it denotes.
_INEQUALITY_OPS: list[tuple[str, type[sympy.core.relational.Relational]]] = [
    ("<=", sympy.Le),
    (">=", sympy.Ge),
    ("<", sympy.Lt),
    (">", sympy.Gt),
]


def _parse_inequality(
    text: str, local: dict[str, sympy.Symbol]
) -> sympy.core.relational.Relational:
    """Parse 'lhs OP rhs' into a SymPy relational, OP in < <= > >=."""
    for token, ctor in _INEQUALITY_OPS:
        if token in text:
            lhs, _, rhs = text.partition(token)
            return ctor(
                safe_parse(lhs, local_symbols=local),
                safe_parse(rhs, local_symbols=local),
            )
    raise MathParseError("no inequality operator (<, <=, >, >=) found")


def grade_inequality(student: str, expected: str) -> GradeResult:
    """Grade an inequality of the form 'lhs OP rhs', OP in < <= > >=.

    Two inequalities are equivalent when they define the same solution set, so
    'x > 2', '2 < x', and '2*x > 4' all grade equal, while 'x > 2' and 'x >= 2'
    do not (the boundary point differs). Solution sets are compared with SymPy's
    as_set(); a strict-vs-nonstrict or direction difference changes the set and
    so grades incorrect. Multivariate relations, for which as_set() is not
    defined, fall back to canonical-form equality.
    """
    grader: GraderName = "cas"
    try:
        local = _combined_symbols(student, expected)
        s_rel = _parse_inequality(student, local)
        e_rel = _parse_inequality(expected, local)
    except MathTimeoutError:
        return GradeResult(
            is_correct=False, score=0.0, grader=grader, confidence=1.0,
            detail="evaluation timed out while parsing inequality",
        )
    except (MathParseError, TypeError, ValueError) as exc:
        return GradeResult(
            is_correct=False, score=0.0, grader=grader, confidence=1.0,
            detail=f"parse error: {exc}",
        )

    try:
        with time_limit(6.0):
            try:
                is_equal = s_rel.as_set() == e_rel.as_set()
            except (NotImplementedError, TypeError, ValueError):
                # Multivariate or set-unbuildable: compare canonical relations.
                is_equal = s_rel.canonical == e_rel.canonical
    except MathTimeoutError:
        return GradeResult(
            is_correct=False, score=0.0, grader=grader, confidence=1.0,
            detail="evaluation timed out while comparing inequalities",
        )
    except Exception as exc:  # noqa: BLE001
        return GradeResult(
            is_correct=False, score=0.0, grader=grader, confidence=0.8,
            detail=f"comparison error: {exc}",
        )

    return GradeResult(
        is_correct=bool(is_equal),
        score=1.0 if is_equal else 0.0,
        grader=grader,
        confidence=0.95,
        detail="solution sets match" if is_equal else "solution sets differ",
        normalized_student=_safe_str(s_rel.canonical),
        normalized_expected=_safe_str(e_rel.canonical),
    )
