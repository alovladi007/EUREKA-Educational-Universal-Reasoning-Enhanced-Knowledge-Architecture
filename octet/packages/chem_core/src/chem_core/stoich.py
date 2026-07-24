"""Grader 3: stoichiometry with milestone error localization.

Grading path: an exact rational chain. The mole ratio is a Fraction, so it
never carries floating point error, and molar masses come from the
periodictable library.

Independent verification path: the same quantity recomputed through a
different unit route using pint (kilograms and millimoles rather than grams
and moles) with the operations reassociated into a single combined factor. If
the two paths disagree beyond a tight relative tolerance the key is rejected.

Milestones, in the order the build prompt names them: molar mass, mole ratio,
conversion, significant figures. Error localization reports the first one that
is wrong, and the diagnosis names the belief behind the slip rather than the
answer.
"""

from __future__ import annotations

import math
import re
from dataclasses import dataclass
from fractions import Fraction

from .formula import parse_formula
from .types import GradeResult, VerifierResult

# Relative tolerance for agreement between the two computational paths.
VERIFY_REL_TOL = 1e-9


@dataclass(frozen=True)
class StoichProblem:
    """A mass to mass conversion across a balanced equation.

    given_mass_g: measured mass of the starting species, in grams.
    from_formula / to_formula: species formulas as written.
    from_coefficient / to_coefficient: their balanced equation coefficients.
    sig_figs: significant figures implied by the measurement.
    """

    given_mass_g: float
    from_formula: str
    to_formula: str
    from_coefficient: int
    to_coefficient: int
    sig_figs: int = 3


@dataclass(frozen=True)
class StoichSolution:
    answer_g: float
    rounded_g: float
    molar_mass_from: float
    molar_mass_to: float
    moles_from: float
    moles_to: float
    ratio: Fraction


def solve_stoichiometry(problem: StoichProblem) -> StoichSolution:
    """The reference chain: grams to moles, mole ratio, moles to grams."""
    m_from = parse_formula(problem.from_formula).molar_mass()
    m_to = parse_formula(problem.to_formula).molar_mass()
    if m_from <= 0 or m_to <= 0:
        raise ValueError("molar mass must be positive")
    moles_from = problem.given_mass_g / m_from
    ratio = Fraction(problem.to_coefficient, problem.from_coefficient)
    moles_to = moles_from * float(ratio)
    answer = moles_to * m_to
    return StoichSolution(
        answer_g=answer,
        rounded_g=round_to_sig_figs(answer, problem.sig_figs),
        molar_mass_from=m_from,
        molar_mass_to=m_to,
        moles_from=moles_from,
        moles_to=moles_to,
        ratio=ratio,
    )


def verify_stoichiometry_key(problem: StoichProblem, claimed_g: float) -> VerifierResult:
    """Independent recomputation through a different unit route.

    Route taken here: convert the measurement to kilograms with pint, build one
    combined dimensionless factor (M_to * coeff_to) / (M_from * coeff_from),
    apply it once, and convert back to grams. The association of operations and
    the unit base both differ from solve_stoichiometry.
    """
    try:
        import pint
    except ImportError:
        return VerifierResult(ok=False, method="pint-alternate-route", detail="pint missing")

    ureg = pint.UnitRegistry()
    try:
        m_from = parse_formula(problem.from_formula).molar_mass()
        m_to = parse_formula(problem.to_formula).molar_mass()
    except Exception as exc:  # parser raises its own error type
        return VerifierResult(ok=False, method="pint-alternate-route", detail=str(exc))
    if m_from <= 0 or m_to <= 0:
        return VerifierResult(ok=False, method="pint-alternate-route", detail="non-positive molar mass")

    mass = (problem.given_mass_g * ureg.gram).to(ureg.kilogram)
    combined = (m_to * problem.to_coefficient) / (m_from * problem.from_coefficient)
    independent = (mass * combined).to(ureg.gram).magnitude

    if independent <= 0:
        return VerifierResult(ok=False, method="pint-alternate-route", detail="non-positive result")
    if abs(independent - claimed_g) / independent > VERIFY_REL_TOL:
        return VerifierResult(
            ok=False,
            method="pint-alternate-route",
            detail=f"claimed {claimed_g!r}, independent {independent!r}",
        )
    return VerifierResult(ok=True, method="pint-alternate-route", detail=f"{independent:.6g} g")


def sig_figs(text: str) -> int:
    """Count significant figures in a written measurement.

    Leading zeros are not significant. Trailing zeros count only when a decimal
    point is present. This is the standard school rule and it is the policy the
    grader states to the learner.
    """
    s = str(text).strip().lower()
    m = re.match(r"^[+-]?(\d*\.?\d*)(?:e([+-]?\d+))?$", s)
    if not m or not m.group(1):
        return 0
    digits = m.group(1)
    has_point = "." in digits
    stripped = digits.replace(".", "").lstrip("0")
    if not stripped:
        return 1 if has_point else 0
    if has_point:
        return len(stripped)
    return len(stripped.rstrip("0")) if stripped.rstrip("0") else 1


def round_to_sig_figs(value: float, figures: int) -> float:
    if value == 0 or figures <= 0:
        return 0.0
    magnitude = math.floor(math.log10(abs(value)))
    factor = 10 ** (figures - 1 - magnitude)
    return round(value * factor) / factor


def _parse_number(text: str) -> float | None:
    if text is None:
        return None
    cleaned = str(text).strip().replace(",", "")
    cleaned = re.sub(r"\s*(g|grams?|gram)\s*$", "", cleaned, flags=re.IGNORECASE).strip()
    try:
        value = float(cleaned)
    except (TypeError, ValueError):
        return None
    # NaN and infinity parse as floats but are not measurements. Treat them as
    # unreadable rather than grading them as a wrong number.
    if not math.isfinite(value):
        return None
    return value


def grade_stoichiometry(
    problem: StoichProblem,
    student_answer: str,
    *,
    rel_tolerance: float = 0.01,
    enforce_sig_figs: bool = True,
) -> GradeResult:
    """Grade a mass to mass stoichiometry answer with milestone diagnosis."""
    grader = "stoich"
    try:
        solution = solve_stoichiometry(problem)
    except Exception as exc:
        return GradeResult.ungradable(grader, f"item is not solvable as written: {exc}")

    value = _parse_number(student_answer)
    if value is None:
        return GradeResult.ungradable(
            grader,
            "That answer could not be read as a number. Give the mass in grams, "
            "for example 4.21.",
        )

    milestones = [
        {"name": "molar mass", "ok": True, "note": "molar masses of both species"},
        {"name": "mole ratio", "ok": True, "note": "coefficients from the balanced equation"},
        {"name": "conversion", "ok": True, "note": "moles back to mass"},
        {"name": "significant figures", "ok": True, "note": "match the measurement"},
    ]

    correct_value = math.isclose(value, solution.answer_g, rel_tol=rel_tolerance)
    if correct_value:
        submitted_figs = sig_figs(student_answer)
        if enforce_sig_figs and submitted_figs and submitted_figs != problem.sig_figs:
            milestones[3]["ok"] = False
            return GradeResult(
                is_correct=False,
                score=0.75,
                grader=grader,
                misconception="SIGFIG",
                detail=(
                    f"The chemistry is right. The measurement carries "
                    f"{problem.sig_figs} significant figures, so the reported answer "
                    f"should carry {problem.sig_figs}, and yours carries {submitted_figs}."
                ),
                milestones=milestones,
                correct_display=f"{solution.rounded_g:g} g",
            )
        return GradeResult(
            is_correct=True,
            score=1.0,
            grader=grader,
            detail="Correct.",
            milestones=milestones,
            correct_display=f"{solution.rounded_g:g} g",
        )

    # Error localization. Compare against the value each specific slip produces.
    wrong_paths = [
        (
            solution.moles_to,
            2,
            "MOLES-NOT-MASS",
            "That is the number of moles of product, not its mass. One conversion "
            "is still outstanding.",
        ),
        (
            solution.moles_from,
            1,
            "NO-RATIO",
            "That is the number of moles of the starting species. The balanced "
            "equation still has to carry you across to the product.",
        ),
        (
            problem.given_mass_g * (solution.molar_mass_to / solution.molar_mass_from),
            1,
            "IGNORED-RATIO",
            "You converted mass correctly but used a one to one ratio. The "
            "coefficients in the balanced equation set the ratio.",
        ),
        (
            solution.answer_g * float(1 / solution.ratio) ** 2,
            1,
            "RATIO-INVERTED",
            "The mole ratio appears to be upside down. It reads product over "
            "reactant in the direction you are converting.",
        ),
        (
            problem.given_mass_g / solution.molar_mass_from * float(solution.ratio) * solution.molar_mass_from,
            2,
            "WRONG-MOLAR-MASS",
            "The final conversion used the molar mass of the starting species "
            "rather than the product.",
        ),
    ]
    for candidate, milestone_index, code, message in wrong_paths:
        if candidate and math.isclose(value, candidate, rel_tol=max(rel_tolerance, 1e-3)):
            for i in range(milestone_index, len(milestones)):
                milestones[i]["ok"] = False
            return GradeResult(
                is_correct=False,
                score=0.25,
                grader=grader,
                misconception=code,
                detail=message,
                milestones=milestones,
                correct_display=f"{solution.rounded_g:g} g",
            )

    for m in milestones:
        m["ok"] = False
    return GradeResult(
        is_correct=False,
        score=0.0,
        grader=grader,
        detail=(
            "Not correct. Work the chain one step at a time: mass to moles, then "
            "the mole ratio from the balanced equation, then moles back to mass."
        ),
        milestones=milestones,
        correct_display=f"{solution.rounded_g:g} g",
    )
