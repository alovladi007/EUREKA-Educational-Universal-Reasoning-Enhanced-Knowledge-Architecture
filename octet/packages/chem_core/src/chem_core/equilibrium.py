"""Grader 7: equilibrium concentrations and pH.

Grading path: build the ICE table, form the equilibrium polynomial, and solve
it exactly with SymPy. The approximation policy is stated rather than assumed:
the small x approximation is reported as valid only when x divided by the
limiting initial concentration is below FIVE_PERCENT_RULE.

Independent verification path: substitute the returned root back into the mass
action expression and require the residual to vanish, then check the root is
physical (every equilibrium concentration non negative, extent within bounds).
Substitution shares no code with the polynomial solver.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field

from .types import GradeResult, VerifierResult

FIVE_PERCENT_RULE = 0.05
VERIFY_REL_TOL = 1e-6
KW_25C = 1.0e-14  # ion product of water at 25 C, CRC Handbook


@dataclass(frozen=True)
class EquilibriumProblem:
    """A single extent of reaction equilibrium.

    k: the equilibrium constant.
    initial: species to initial concentration in molar.
    stoich: species to signed stoichiometric coefficient. Reactants are
        negative, products positive, so the equilibrium concentration of a
        species is initial + coefficient * x.
    """

    k: float
    initial: dict[str, float]
    stoich: dict[str, int]
    label: str = ""
    solvent_species: tuple[str, ...] = field(default=())

    def concentration(self, species: str, x: float) -> float:
        return self.initial.get(species, 0.0) + self.stoich.get(species, 0) * x

    def max_extent(self) -> float:
        """Largest x that keeps every concentration non negative."""
        limits = []
        for species, coefficient in self.stoich.items():
            if coefficient < 0:
                c0 = self.initial.get(species, 0.0)
                limits.append(c0 / abs(coefficient))
        return min(limits) if limits else math.inf


@dataclass(frozen=True)
class EquilibriumSolution:
    x: float
    concentrations: dict[str, float]
    approximation_valid: bool
    approximate_x: float
    percent_ionization: float


def mass_action(problem: EquilibriumProblem, x: float) -> float:
    """Reaction quotient at extent x. Pure arithmetic, no solver involved."""
    numerator = 1.0
    denominator = 1.0
    for species, coefficient in problem.stoich.items():
        if species in problem.solvent_species:
            continue
        c = problem.concentration(species, x)
        if c < 0:
            return math.nan
        if coefficient > 0:
            numerator *= c**coefficient
        elif coefficient < 0:
            denominator *= c ** abs(coefficient)
    if denominator == 0:
        return math.inf
    return numerator / denominator


def solve_equilibrium(problem: EquilibriumProblem) -> EquilibriumSolution:
    """Solve for the extent of reaction with SymPy, then select the physical root."""
    import sympy as sp

    x = sp.Symbol("x", real=True)
    numerator = sp.Integer(1)
    denominator = sp.Integer(1)
    for species, coefficient in problem.stoich.items():
        if species in problem.solvent_species:
            continue
        c = sp.Float(problem.initial.get(species, 0.0)) + coefficient * x
        if coefficient > 0:
            numerator *= c**coefficient
        elif coefficient < 0:
            denominator *= c ** abs(coefficient)

    equation = sp.Eq(numerator, sp.Float(problem.k) * denominator)
    roots = sp.solve(equation, x)

    upper = problem.max_extent()
    physical: list[float] = []
    for root in roots:
        try:
            value = float(sp.re(sp.N(root)))
        except (TypeError, ValueError):
            continue
        if abs(float(sp.im(sp.N(root)))) > 1e-12:
            continue
        if value < -1e-15 or value > upper + 1e-12:
            continue
        physical.append(max(value, 0.0))
    if not physical:
        raise ValueError("no physical root for this equilibrium")
    root = min(physical)

    limiting = min(
        (problem.initial.get(s, 0.0) for s, c in problem.stoich.items() if c < 0),
        default=0.0,
    )
    approximate = math.sqrt(problem.k * limiting) if limiting > 0 and problem.k > 0 else 0.0
    percent = (root / limiting * 100.0) if limiting > 0 else 0.0
    return EquilibriumSolution(
        x=root,
        concentrations={s: problem.concentration(s, root) for s in problem.stoich},
        approximation_valid=(limiting > 0 and root / limiting < FIVE_PERCENT_RULE),
        approximate_x=approximate,
        percent_ionization=percent,
    )


def verify_equilibrium_key(problem: EquilibriumProblem, claimed_x: float) -> VerifierResult:
    """Independent check: substitute the root and test the residual.

    Does not call solve_equilibrium. It recomputes the reaction quotient by
    direct arithmetic and requires it to equal K, then confirms the root is
    physically admissible.
    """
    if claimed_x is None or not math.isfinite(claimed_x):
        return VerifierResult(ok=False, method="residual-substitution", detail="non finite root")
    if claimed_x < 0:
        return VerifierResult(ok=False, method="residual-substitution", detail="negative extent")
    upper = problem.max_extent()
    if claimed_x > upper + 1e-12:
        return VerifierResult(
            ok=False,
            method="residual-substitution",
            detail=f"extent {claimed_x} exceeds the limiting reactant bound {upper}",
        )
    for species in problem.stoich:
        if problem.concentration(species, claimed_x) < -1e-12:
            return VerifierResult(
                ok=False,
                method="residual-substitution",
                detail=f"negative equilibrium concentration for {species}",
            )

    q = mass_action(problem, claimed_x)
    if not math.isfinite(q):
        return VerifierResult(ok=False, method="residual-substitution", detail="quotient not finite")
    if problem.k == 0:
        return VerifierResult(ok=False, method="residual-substitution", detail="K must be non zero")
    residual = abs(q - problem.k) / abs(problem.k)
    if residual > VERIFY_REL_TOL:
        return VerifierResult(
            ok=False,
            method="residual-substitution",
            detail=f"Q={q:.6g} does not match K={problem.k:.6g} (relative residual {residual:.2e})",
        )
    return VerifierResult(
        ok=True, method="residual-substitution", detail=f"Q matches K within {residual:.2e}"
    )


def ph_from_hydronium(concentration: float) -> float:
    if concentration <= 0:
        raise ValueError("hydronium concentration must be positive")
    return -math.log10(concentration)


def _parse_number(text: str) -> float | None:
    if text is None:
        return None
    cleaned = str(text).strip().replace(",", "").replace("M", "").strip()
    cleaned = cleaned.replace("×10^", "e").replace("x10^", "e").replace("*10^", "e")
    try:
        value = float(cleaned)
    except (TypeError, ValueError):
        return None
    # NaN and infinity are not concentrations.
    if not math.isfinite(value):
        return None
    return value


def grade_equilibrium(
    problem: EquilibriumProblem,
    student_answer: str,
    *,
    target: str = "x",
    rel_tolerance: float = 0.02,
) -> GradeResult:
    """Grade an equilibrium answer.

    target: "x" for the extent, "pH" for the pH of the solution, or a species
    name for that species' equilibrium concentration.
    """
    grader = "equilibrium"
    try:
        solution = solve_equilibrium(problem)
    except Exception as exc:
        return GradeResult.ungradable(grader, f"item is not solvable as written: {exc}")

    value = _parse_number(student_answer)
    if value is None:
        return GradeResult.ungradable(
            grader,
            "That answer could not be read as a number. Give a concentration in "
            "molar, for example 1.3e-3, or a pH value.",
        )

    if target == "pH":
        hydronium = solution.concentrations.get("H3O+", solution.x)
        expected = ph_from_hydronium(hydronium) if hydronium > 0 else float("nan")
        display = f"pH {expected:.2f}"
    elif target == "x":
        expected = solution.x
        display = f"x = {expected:.4g} M"
    else:
        expected = solution.concentrations.get(target)
        if expected is None:
            return GradeResult.ungradable(grader, f"unknown target species {target}")
        display = f"[{target}] = {expected:.4g} M"

    if expected is not None and math.isfinite(expected) and math.isclose(
        value, expected, rel_tol=rel_tolerance
    ):
        note = "Correct."
        if not solution.approximation_valid:
            note += (
                " Note that the small x approximation is not valid here, since "
                f"the extent is {solution.percent_ionization:.1f} percent of the "
                "initial concentration."
            )
        return GradeResult(
            is_correct=True, score=1.0, grader=grader, detail=note, correct_display=display
        )

    # Diagnose the standard slips.
    if target in ("x", "pH"):
        approx = solution.approximate_x
        if approx > 0 and math.isclose(
            value if target == "x" else 10 ** (-value), approx, rel_tol=max(rel_tolerance, 0.05)
        ):
            if not solution.approximation_valid:
                return GradeResult(
                    is_correct=False,
                    score=0.5,
                    grader=grader,
                    misconception="APPROX-INVALID",
                    detail=(
                        "You used the small x approximation, but it does not hold "
                        f"here: x is {solution.percent_ionization:.1f} percent of the "
                        "initial concentration, above the five percent limit. Solve "
                        "the quadratic instead of dropping x."
                    ),
                    correct_display=display,
                )
    if target == "pH":
        pohl = 14.0 - value
        if math.isclose(pohl, expected, rel_tol=rel_tolerance):
            return GradeResult(
                is_correct=False,
                score=0.25,
                grader=grader,
                misconception="PH-POH",
                detail=(
                    "That is the pOH of this solution, not the pH. The two sum to "
                    "14 at 25 C."
                ),
                correct_display=display,
            )
    if expected and value and math.isclose(value, expected**2, rel_tol=rel_tolerance):
        return GradeResult(
            is_correct=False,
            score=0.25,
            grader=grader,
            misconception="K-SQUARE",
            detail=(
                "Your value is the square of the equilibrium extent. Check where "
                "the square root belongs in the mass action expression."
            ),
            correct_display=display,
        )

    return GradeResult(
        is_correct=False,
        score=0.0,
        grader=grader,
        detail=(
            "Not correct. Set up the ICE table, write the mass action expression "
            "in terms of one unknown, and decide explicitly whether the small x "
            "approximation is allowed before you use it."
        ),
        correct_display=display,
    )
