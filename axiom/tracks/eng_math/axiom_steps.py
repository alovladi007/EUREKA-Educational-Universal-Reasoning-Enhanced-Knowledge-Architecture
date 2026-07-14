"""AXIOM step-credit engine.

Grades a student's multi-step derivation line by line instead of only the final
answer. Three things come out of it:

  1. Per-step validity: does each line preserve the solution set of the line
     before it (solution-set semantics, so any legal algebraic move is valid,
     not just the moves the author anticipated).
  2. Error localization: the index of the first invalid step, which is the
     line where the error entered. This is the signal the misconception model
     consumes.
  3. Milestone credit: named waypoints (for example "y eliminated", "x
     isolated") detected anywhere in the work, each worth partial credit, plus
     credit for reaching the correct final answer.

Scope note, stated honestly: this engine grades derivations written as chains
of equations in one or more variables, which covers the bulk of algebra, ODE
manipulation, and system solving. It does not parse free-form prose or
two-column geometry proofs; those belong to the proof-grading tiers in the
curriculum extension.
"""

from __future__ import annotations

from dataclasses import dataclass, field

import sympy as sp


# ---------------------------------------------------------------------------
# Data types
# ---------------------------------------------------------------------------

@dataclass
class StepReport:
    index: int
    text: str
    valid: bool
    note: str


@dataclass
class Milestone:
    name: str
    # A milestone is "reached" when some step's solution-set-in-a-variable or
    # structural predicate matches. Two kinds supported:
    #   kind = "isolated":  some line has the form var = expr with expr free of var
    #   kind = "eliminated": some line no longer contains the named variable
    kind: str
    var: str
    credit: float


@dataclass
class StepGradeResult:
    steps: list[StepReport]
    first_error_index: int | None
    milestones_hit: list[str]
    final_correct: bool
    score: float          # 0.0 to 1.0
    detail: str
    grader: str = "steps"
    confidence: float = 1.0


# ---------------------------------------------------------------------------
# Core: solution-set preservation between consecutive lines
# ---------------------------------------------------------------------------

def _parse_line(line: str) -> list[sp.Eq]:
    """Parse a line like '2x + y = 5; x - y = 1' into a list of Eq objects.

    Multiple simultaneous equations on one line are separated by ';'.
    A line may also be a single equation.
    """
    eqs: list[sp.Eq] = []
    for part in line.split(";"):
        part = part.strip()
        if not part:
            continue
        if "=" not in part:
            raise ValueError(f"line is not an equation: {part!r}")
        lhs_s, rhs_s = part.split("=", 1)
        lhs = sp.sympify(lhs_s, locals={})
        rhs = sp.sympify(rhs_s, locals={})
        eqs.append(sp.Eq(lhs, rhs))
    if not eqs:
        raise ValueError("empty line")
    return eqs


def _solution_set(eqs: list[sp.Eq], symbols: list[sp.Symbol]):
    """Solve the system over the given symbols. Returns a frozenset of
    solution tuples for finite sets, or a canonical object for infinite sets
    (the linsolve/solve result), so equal sets compare equal.
    """
    try:
        sols = sp.solve(eqs, symbols, dict=True)
    except Exception:
        return None
    # Canonicalize: a sorted tuple of (symbol name, simplified value) pairs per
    # solution. Free symbols (parameters) stay symbolic, which still compares
    # equal for equivalent parameterizations produced by sp.solve.
    canon = []
    for s in sols:
        entry = tuple(sorted((str(k), sp.simplify(v)) for k, v in s.items()))
        canon.append(entry)
    return frozenset(canon)


def grade_steps(
    lines: list[str],
    variables: list[str],
    milestones: list[Milestone] | None = None,
    final_key: dict[str, str] | None = None,
    step_weight: float = 0.5,
    milestone_weight: float = 0.2,
    final_weight: float = 0.3,
) -> StepGradeResult:
    """Grade a derivation given as a list of lines.

    Validity rule: every line must have the same solution set (over the given
    variables) as the line before it. This accepts any legal move (add
    equations, scale by a nonzero constant, substitute) and rejects any move
    that changes the solution set (multiply a row by zero, sign slip, dropped
    term). The first invalid line is where the error entered.

    Scoring: step_weight is split across the consecutive-step checks,
    milestone_weight across declared milestones, final_weight for a correct
    final answer. Weights should sum to 1.
    """
    syms = [sp.Symbol(v) for v in variables]
    milestones = milestones or []

    reports: list[StepReport] = []
    parsed: list[list[sp.Eq] | None] = []
    first_error: int | None = None

    # Parse all lines first; a parse failure is itself an invalid step.
    for i, line in enumerate(lines):
        try:
            parsed.append(_parse_line(line))
            reports.append(StepReport(i, line, True, "parsed"))
        except ValueError as e:
            parsed.append(None)
            reports.append(StepReport(i, line, False, f"unparseable: {e}"))
            if first_error is None:
                first_error = i

    # Consecutive solution-set preservation.
    prev_set = None
    prev_ok_index: int | None = None
    for i, eqs in enumerate(parsed):
        if eqs is None:
            continue
        cur_set = _solution_set(eqs, syms)
        if cur_set is None:
            reports[i] = StepReport(i, lines[i], False, "could not solve line")
            if first_error is None:
                first_error = i
            continue
        if prev_set is not None:
            if cur_set == prev_set:
                reports[i] = StepReport(
                    i, lines[i], True,
                    f"solution set preserved from line {prev_ok_index}",
                )
            else:
                reports[i] = StepReport(
                    i, lines[i], False,
                    f"solution set changed relative to line {prev_ok_index} "
                    f"(this is where the error entered)",
                )
                if first_error is None:
                    first_error = i
        prev_set = cur_set
        prev_ok_index = i

    # Milestones: scan every parsed line.
    hit: list[str] = []
    for m in milestones:
        v = sp.Symbol(m.var)
        for eqs in parsed:
            if eqs is None:
                continue
            if m.kind == "isolated":
                for eq in eqs:
                    if eq.lhs == v and v not in eq.rhs.free_symbols:
                        hit.append(m.name)
                        break
                    if eq.rhs == v and v not in eq.lhs.free_symbols:
                        hit.append(m.name)
                        break
            elif m.kind == "eliminated":
                all_syms = set().union(*(eq.free_symbols for eq in eqs))
                if v not in all_syms:
                    hit.append(m.name)
            if m.name in hit:
                break

    # Final answer.
    final_correct = False
    if final_key is not None and parsed and parsed[-1] is not None:
        last_set = _solution_set(parsed[-1], syms)
        key_eqs = [
            sp.Eq(sp.Symbol(k), sp.sympify(vv, locals={}))
            for k, vv in final_key.items()
        ]
        key_set = _solution_set(key_eqs, syms)
        final_correct = last_set is not None and last_set == key_set

    # Score.
    n_trans = max(len(lines) - 1, 1)
    n_valid_trans = sum(
        1 for r in reports[1:] if r.valid and "preserved" in r.note
    )
    step_score = step_weight * (n_valid_trans / n_trans)
    mil_score = (
        milestone_weight * (len(hit) / len(milestones)) if milestones else 0.0
    )
    fin_score = final_weight if final_correct else 0.0
    # If there are no milestones declared, fold that weight into steps.
    if not milestones:
        step_score = (step_weight + milestone_weight) * (n_valid_trans / n_trans)
    score = round(min(step_score + mil_score + fin_score, 1.0), 4)

    if first_error is None:
        detail = "all steps valid"
    else:
        detail = f"first error at line {first_error}: {lines[first_error]!r}"
    if final_key is not None:
        detail += f"; final answer {'correct' if final_correct else 'incorrect'}"

    return StepGradeResult(
        steps=reports,
        first_error_index=first_error,
        milestones_hit=hit,
        final_correct=final_correct,
        score=score,
        detail=detail,
    )
