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


def _milestones_hit(parsed: list, milestones: list, syms: list[sp.Symbol]) -> list[str]:
    """Detect declared milestones anywhere in the work. Two kinds, matching the
    reference: "isolated" (a line has var = expr with expr free of var) and
    "eliminated" (a line no longer mentions var)."""
    hit: list[str] = []
    for m in milestones:
        name = m.get("name", "")
        kind = m.get("kind", "")
        v = sp.Symbol(str(m.get("var", "")))
        found = False
        for eqs in parsed:
            if eqs is None:
                continue
            if kind == "isolated":
                for eq in eqs:
                    if eq.lhs == v and v not in eq.rhs.free_symbols:
                        found = True
                        break
                    if eq.rhs == v and v not in eq.lhs.free_symbols:
                        found = True
                        break
            elif kind == "eliminated":
                all_syms: set = set().union(*(eq.free_symbols for eq in eqs)) if eqs else set()
                if v not in all_syms:
                    found = True
            if found:
                break
        if found:
            hit.append(name)
    return hit


def grade_steps(
    lines: list[str],
    variables: list[str],
    final_key: dict | None = None,
    milestones: list | None = None,
    step_weight: float = 0.5,
    milestone_weight: float = 0.2,
    final_weight: float = 0.3,
) -> GradeResult:
    """Grade a derivation given as a list of equation lines.

    Correct iff every consecutive line preserves the solution set and (when a
    final_key is given) the last line matches it. score is partial credit: the
    fraction of valid transitions (step_weight), declared milestones reached
    (milestone_weight; "isolated"/"eliminated" waypoints), and the final answer
    (final_weight). detail names the first error line -- the signal for
    remediation -- and the milestones reached.
    """
    syms = [sp.Symbol(v) for v in variables]
    milestones = milestones or []
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
        prev_set = cur

    final_correct = False
    if final_key is not None and parsed and parsed[-1] is not None:
        last = _solution_set(parsed[-1], syms)
        key_eqs = [sp.Eq(sp.Symbol(k), sp.sympify(str(v), locals={})) for k, v in final_key.items()]
        key_set = _solution_set(key_eqs, syms)
        final_correct = last is not None and last == key_set

    hit = _milestones_hit(parsed, milestones, syms)

    # Fold unused weights back into steps so score always tops out at 1.0.
    step_w = step_weight
    if not milestones:
        step_w += milestone_weight
    if final_key is None:
        step_w += final_weight
    score = step_w * (valid_trans / n_trans)
    if milestones:
        score += milestone_weight * (len(hit) / len(milestones))
    if final_correct:
        score += final_weight
    score = round(min(score, 1.0), 4)

    if first_error is None:
        detail = "all steps valid"
    else:
        detail = f"first error at line {first_error}: {lines[first_error]!r}"
    if milestones:
        detail += f"; milestones reached: {', '.join(hit) if hit else 'none'}"
    if final_key is not None:
        detail += f"; final answer {'correct' if final_correct else 'incorrect'}"

    is_correct = first_error is None and (final_key is None or final_correct)
    return GradeResult(
        is_correct=is_correct, score=score, grader="cas", confidence=1.0, detail=detail
    )
