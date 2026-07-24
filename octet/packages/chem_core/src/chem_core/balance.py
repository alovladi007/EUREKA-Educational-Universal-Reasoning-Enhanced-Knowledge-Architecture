"""Grader 2: balancing chemical equations.

Grading path: read the learner's coefficients, then check conservation of every
element and of net charge, that all coefficients are positive integers, and
that the set is minimal (greatest common divisor of 1).

Independent verification path: the reference coefficients are produced by a
SymPy nullspace solve over the element matrix, and then checked by direct
element by element arithmetic that never calls SymPy. A bug in the linear
algebra cannot validate itself.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from math import gcd

from ._safe import MAX_EQUATION_SPECIES, InputTooLarge, check_size
from .formula import Formula, FormulaParseError, parse_formula
from .types import GradeResult, VerifierResult

_ARROWS = ("<->", "<=>", "-->", "->", "=>", "→", "⇌", "=")


class EquationParseError(ValueError):
    """The submission is not a readable chemical equation."""


@dataclass(frozen=True)
class Species:
    """One species in an equation: its coefficient and its parsed formula."""

    coefficient: int
    formula: Formula
    text: str

    def render(self) -> str:
        prefix = "" if self.coefficient == 1 else str(self.coefficient)
        return f"{prefix}{self.text}"


@dataclass(frozen=True)
class Equation:
    reactants: list[Species]
    products: list[Species]

    def render(self) -> str:
        left = " + ".join(s.render() for s in self.reactants)
        right = " + ".join(s.render() for s in self.products)
        return f"{left} -> {right}"

    def coefficients(self) -> list[int]:
        return [s.coefficient for s in self.reactants] + [s.coefficient for s in self.products]

    def species_text(self) -> list[str]:
        return [s.text for s in self.reactants] + [s.text for s in self.products]


def parse_equation(text: str) -> Equation:
    """Parse an equation, with or without coefficients, into Species lists."""
    if text is None:
        raise EquationParseError("empty equation")
    try:
        raw = check_size(str(text)).strip()
    except InputTooLarge as exc:
        raise EquationParseError(str(exc)) from exc

    arrow = None
    for candidate in _ARROWS:
        if candidate in raw:
            arrow = candidate
            break
    if arrow is None:
        raise EquationParseError("no reaction arrow found (use -> between the two sides)")

    left, right = raw.split(arrow, 1)
    reactants = _parse_side(left)
    products = _parse_side(right)
    if not reactants or not products:
        raise EquationParseError("both sides of the arrow need at least one species")
    if len(reactants) + len(products) > MAX_EQUATION_SPECIES:
        raise EquationParseError("too many species in one equation")
    return Equation(reactants=reactants, products=products)


def _split_species(text: str) -> list[str]:
    """Split one side into species, without eating ionic charge signs.

    "Fe^2+ + Ce^4+" must split into two species, not four fragments. A plus
    that separates species is surrounded by whitespace, while a plus that marks
    charge is attached to its species. Try the whitespace delimited split
    first, and only fall back to a bare plus split when the side carries no
    charge notation (so "C3H8+O2" still works).
    """
    parts = [p for p in re.split(r"\s+\+\s+", text) if p.strip()]
    if len(parts) > 1:
        return parts
    if "^" in text or re.search(r"[+-]\s*$", text.strip()):
        return [text] if text.strip() else []
    return [p for p in text.split("+") if p.strip()]


def _parse_side(text: str) -> list[Species]:
    out: list[Species] = []
    for chunk in _split_species(text):
        piece = chunk.strip()
        if not piece:
            continue
        # Strip phase labels such as (aq), (s), (l), (g) before parsing.
        piece = re.sub(r"\((?:aq|s|l|g)\)", "", piece, flags=re.IGNORECASE).strip()
        m = re.match(r"^(\d+)\s*(.+)$", piece)
        if m and not re.match(r"^\d+$", piece):
            coefficient = int(m.group(1))
            body = m.group(2).strip()
        else:
            coefficient = 1
            body = piece
        if coefficient <= 0:
            raise EquationParseError("coefficients must be positive whole numbers")
        try:
            formula = parse_formula(body)
        except FormulaParseError as exc:
            raise EquationParseError(f"could not read species {body!r}: {exc}") from exc
        out.append(Species(coefficient=coefficient, formula=formula, text=body))
    return out


def conservation_residual(equation: Equation) -> dict[str, int]:
    """Reactant minus product totals for every element, plus net charge.

    This is the independent arithmetic path. It uses no linear algebra library.
    An empty dict of non-zero entries means the equation is balanced.
    """
    residual: dict[str, int] = {}
    for side, sign in ((equation.reactants, 1), (equation.products, -1)):
        for sp in side:
            for el, n in sp.formula.counts.items():
                residual[el] = residual.get(el, 0) + sign * n * sp.coefficient
            residual["__charge__"] = residual.get("__charge__", 0) + sign * sp.formula.charge * sp.coefficient
    return {k: v for k, v in residual.items() if v != 0}


def is_balanced(equation: Equation) -> bool:
    return not conservation_residual(equation)


def solve_coefficients(equation: Equation) -> list[int] | None:
    """Reference balancing by SymPy nullspace over the element matrix.

    Returns the smallest positive integer solution, or None when the equation
    has no single positive solution (over determined or degenerate input).
    """
    from sympy import Matrix, lcm

    species = equation.reactants + equation.products
    elements = sorted({el for sp in species for el in sp.formula.counts})
    rows: list[list[int]] = []
    for el in elements:
        row = []
        for idx, sp in enumerate(species):
            sign = 1 if idx < len(equation.reactants) else -1
            row.append(sign * sp.formula.counts.get(el, 0))
        rows.append(row)
    # Charge is conserved too, so it is one more row of the same system.
    charge_row = []
    for idx, sp in enumerate(species):
        sign = 1 if idx < len(equation.reactants) else -1
        charge_row.append(sign * sp.formula.charge)
    if any(charge_row):
        rows.append(charge_row)

    matrix = Matrix(rows)
    null = matrix.nullspace()
    if len(null) != 1:
        # Zero means no solution, more than one means the system is
        # underdetermined and the item is not well posed.
        return None
    vec = null[0]
    denominators = [term.q for term in vec]
    multiplier = 1
    for d in denominators:
        multiplier = lcm(multiplier, d)
    integers = [int(term * multiplier) for term in vec]
    if any(v == 0 for v in integers):
        return None
    if all(v < 0 for v in integers):
        integers = [-v for v in integers]
    if any(v < 0 for v in integers):
        return None
    divisor = 0
    for v in integers:
        divisor = gcd(divisor, v)
    if divisor > 1:
        integers = [v // divisor for v in integers]
    return integers


def verify_balance_key(equation_text: str, coefficients: list[int]) -> VerifierResult:
    """Independent check on a stored balancing key.

    Applies the claimed coefficients and runs pure conservation arithmetic. It
    does not call solve_coefficients, so the nullspace solver is not verifying
    its own output.
    """
    try:
        base = parse_equation(equation_text)
    except EquationParseError as exc:
        return VerifierResult(ok=False, method="conservation-arithmetic", detail=str(exc))

    species = base.reactants + base.products
    if len(coefficients) != len(species):
        return VerifierResult(
            ok=False,
            method="conservation-arithmetic",
            detail=f"expected {len(species)} coefficients, got {len(coefficients)}",
        )
    if any((not isinstance(c, int)) or c <= 0 for c in coefficients):
        return VerifierResult(
            ok=False, method="conservation-arithmetic", detail="coefficients must be positive integers"
        )
    divisor = 0
    for c in coefficients:
        divisor = gcd(divisor, c)
    if divisor != 1:
        return VerifierResult(
            ok=False,
            method="conservation-arithmetic",
            detail=f"coefficients share a common factor of {divisor}, so they are not minimal",
        )

    applied = _apply(base, coefficients)
    residual = conservation_residual(applied)
    if residual:
        pretty = ", ".join(
            ("charge" if k == "__charge__" else k) + f" off by {v}" for k, v in sorted(residual.items())
        )
        return VerifierResult(ok=False, method="conservation-arithmetic", detail=pretty)
    return VerifierResult(ok=True, method="conservation-arithmetic", detail=applied.render())


def _apply(equation: Equation, coefficients: list[int]) -> Equation:
    n_left = len(equation.reactants)
    left = [
        Species(coefficient=coefficients[i], formula=sp.formula, text=sp.text)
        for i, sp in enumerate(equation.reactants)
    ]
    right = [
        Species(coefficient=coefficients[n_left + i], formula=sp.formula, text=sp.text)
        for i, sp in enumerate(equation.products)
    ]
    return Equation(reactants=left, products=right)


def grade_balance(key_equation: str, student_answer: str) -> GradeResult:
    """Grade a balancing submission.

    The learner may submit either the full balanced equation or just the
    coefficients in order, comma or space separated.
    """
    grader = "balance"
    try:
        skeleton = parse_equation(key_equation)
    except EquationParseError as exc:
        return GradeResult.ungradable(grader, f"item key is not a valid equation: {exc}")

    expected_len = len(skeleton.reactants) + len(skeleton.products)
    coefficients = _read_student_coefficients(student_answer, skeleton)
    if coefficients is None:
        return GradeResult.ungradable(
            grader,
            "That submission could not be read. Give the balanced equation, or "
            f"the {expected_len} coefficients in order separated by commas.",
        )
    if len(coefficients) != expected_len:
        return GradeResult(
            is_correct=False,
            score=0.0,
            grader=grader,
            detail=(
                f"This equation has {expected_len} species, so it needs "
                f"{expected_len} coefficients. You gave {len(coefficients)}."
            ),
        )
    if any(c <= 0 for c in coefficients):
        return GradeResult(
            is_correct=False,
            score=0.0,
            grader=grader,
            misconception="COEF-NONPOS",
            detail="Every coefficient must be a positive whole number.",
        )

    applied = _apply(skeleton, coefficients)
    residual = conservation_residual(applied)
    reference = solve_coefficients(skeleton)

    if not residual:
        divisor = 0
        for c in coefficients:
            divisor = gcd(divisor, c)
        if divisor > 1:
            return GradeResult(
                is_correct=False,
                score=0.5,
                grader=grader,
                misconception="NOT-MINIMAL",
                detail=(
                    "Atoms balance, but every coefficient shares a common factor "
                    f"of {divisor}. Conventional balancing uses the smallest whole "
                    "number set."
                ),
                correct_display=_render_reference(skeleton, reference),
            )
        return GradeResult(
            is_correct=True,
            score=1.0,
            grader=grader,
            detail="Correct. Every element and the net charge balance.",
            correct_display=applied.render(),
        )

    charge_off = residual.pop("__charge__", 0)
    detail_parts = []
    misconception = None
    if residual:
        worst = sorted(residual.items(), key=lambda kv: -abs(kv[1]))[0]
        el, delta = worst
        side = "reactant" if delta > 0 else "product"
        detail_parts.append(
            f"{el} does not balance: there are {abs(delta)} more {el} atoms on the "
            f"{side} side."
        )
        misconception = "ATOM-CONSERV"
    if charge_off:
        detail_parts.append(
            f"Net charge does not balance, it is off by {abs(charge_off)}."
        )
        misconception = misconception or "CHG-BAL"
    return GradeResult(
        is_correct=False,
        score=0.0,
        grader=grader,
        misconception=misconception,
        detail=" ".join(detail_parts),
        correct_display=_render_reference(skeleton, reference),
    )


def _render_reference(skeleton: Equation, reference: list[int] | None) -> str:
    if reference is None:
        return skeleton.render()
    return _apply(skeleton, reference).render()


def _read_student_coefficients(answer: str, skeleton: Equation) -> list[int] | None:
    """Accept a coefficient list or a fully written balanced equation."""
    if answer is None:
        return None
    try:
        raw = check_size(str(answer)).strip()
    except InputTooLarge:
        return None
    if not raw:
        return None

    if not any(a in raw for a in _ARROWS):
        tokens = [t for t in re.split(r"[,\s]+", raw) if t]
        if tokens and all(re.fullmatch(r"-?\d+", t) for t in tokens):
            return [int(t) for t in tokens]
        return None

    try:
        submitted = parse_equation(raw)
    except EquationParseError:
        return None
    # The species must match the skeleton, otherwise the learner rewrote the
    # chemistry rather than balancing it. That is a distinct error and the
    # caller reports it through the length or residual branches.
    if submitted.species_text() != skeleton.species_text():
        expected = {t: i for i, t in enumerate(skeleton.species_text())}
        got = submitted.species_text()
        if sorted(got) != sorted(expected):
            return None
        ordered = [0] * len(expected)
        for sp, coefficient in zip(got, submitted.coefficients()):
            ordered[expected[sp]] = coefficient
        return ordered
    return submitted.coefficients()
