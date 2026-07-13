"""Step-credit grading with error localization (Engineering Math track).

Grades a multi-step derivation line by line instead of only the final answer.
The validity rule is solution-set preservation: every line must have the same
solution set (over the given variables) as the line before it. This accepts any
legal algebraic move -- add equations, scale by a nonzero constant, substitute --
and rejects any move that changes the solution set (multiply a row by zero, a
sign slip, a dropped term). The FIRST line that changes the solution set is where
the error entered; that index is the signal misconception tagging consumes.

Scope, stated honestly: this grades derivations written as chains of equations in
one or more variables (algebra, system solving, ODE manipulation). It does not
parse prose or two-column geometry proofs -- those are the proof-grading tiers.
"""

from __future__ import annotations

import sympy as sp

from .grading import GradeResult


def _parse_line(line: str) -> list[sp.Eq]:
    """Parse 'a = b; c = d' into Eq objects (';' separates simultaneous eqs)."""
    eqs: list[sp.Eq] = []
    for part in str(line).split(";"):
        part = part.strip()
        if not part:
            continue
        if "=" not in part:
            raise ValueError(f"line is not an equation: {part!r}")
        lhs_s, rhs_s = part.split("=", 1)
        eqs.append(sp.Eq(sp.sympify(lhs_s, locals={}), sp.sympify(rhs_s, locals={})))
    if not eqs:
        raise ValueError("empty line")
    return eqs


def _solution_set(eqs: list[sp.Eq], symbols: list[sp.Symbol]):
    """Canonical, comparable solution set of a system over the given symbols."""
    try:
        sols = sp.solve(eqs, symbols, dict=True)
    except (NotImplementedError, TypeError, ValueError, sp.SympifyError):
        return None
    canon = []
    for s in sols:
        canon.append(tuple(sorted((str(k), sp.simplify(v)) for k, v in s.items())))
    return frozenset(canon)


def grade_steps(
    lines: list[str],
    variables: list[str],
    final_key: dict | None = None,
    step_weight: float = 0.7,
    final_weight: float = 0.3,
) -> GradeResult:
    """Grade a derivation given as a list of equation lines.

    Correct iff every consecutive line preserves the solution set and (when a
    final_key is given) the last line matches it. score is partial credit: the
    fraction of valid transitions (step_weight) plus the final answer
    (final_weight). detail names the first error line, the signal for remediation.
    """
    syms = [sp.Symbol(v) for v in variables]
    parsed: list[list[sp.Eq] | None] = []
    first_error: int | None = None

    for i, line in enumerate(lines):
        try:
            parsed.append(_parse_line(line))
        except (ValueError, sp.SympifyError):
            parsed.append(None)
            if first_error is None:
                first_error = i

    prev_set = None
    prev_index: int | None = None
    n_trans = max(len(lines) - 1, 1)
    valid_trans = 0
    for i, eqs in enumerate(parsed):
        if eqs is None:
            continue
        cur = _solution_set(eqs, syms)
        if cur is None:
            if first_error is None:
                first_error = i
            continue
        if prev_set is not None:
            if cur == prev_set:
                valid_trans += 1
            elif first_error is None:
                first_error = i
        prev_set, prev_index = cur, i

    final_correct = False
    if final_key is not None and parsed and parsed[-1] is not None:
        last = _solution_set(parsed[-1], syms)
        key_eqs = [sp.Eq(sp.Symbol(k), sp.sympify(str(v), locals={})) for k, v in final_key.items()]
        key_set = _solution_set(key_eqs, syms)
        final_correct = last is not None and last == key_set

    weight = step_weight + (0.0 if final_key is not None else final_weight)
    score = weight * (valid_trans / n_trans) + (final_weight if final_correct else 0.0)
    score = round(min(score, 1.0), 4)

    if first_error is None:
        detail = "all steps valid"
    else:
        detail = f"first error at line {first_error}: {lines[first_error]!r}"
    if final_key is not None:
        detail += f"; final answer {'correct' if final_correct else 'incorrect'}"

    is_correct = first_error is None and (final_key is None or final_correct)
    return GradeResult(
        is_correct=is_correct, score=score, grader="cas", confidence=1.0, detail=detail
    )
