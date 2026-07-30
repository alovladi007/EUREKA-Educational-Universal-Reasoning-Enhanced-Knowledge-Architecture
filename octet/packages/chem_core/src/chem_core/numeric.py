"""Numeric with units grader.

Named in build prompt Section 4 as part of the chem-grader service, alongside
formula, balance, stoichiometry and equilibrium. Phase 2 content needs it:
molar mass, molarity, dilution, gas laws, calorimetry, pH and solubility all
reduce to a number with a unit and a significant figure policy.

Grading path: parse the submission with pint, convert to the key's unit, and
compare within a relative tolerance, then apply the significant figure policy.

Independent verification path: the generator's key is checked by inverting the
relationship (recompute an input from the claimed output and require the
original input back). That inverse lives with each template in the registry,
not here, because only the template knows its own relationship.
"""

from __future__ import annotations

import math
import re

from .stoich import format_sig_figs, sig_figs
from .types import GradeResult

# Unit strings pint understands, mapped from what learners actually type.
_ALIASES = {
    "M": "mol/L",
    "molar": "mol/L",
    "N": "mol/L",
    "atm": "atm",
    "L": "liter",
    "mL": "milliliter",
    "g": "gram",
    "kg": "kilogram",
    "mol": "mole",
    "mmol": "millimole",
    "J": "joule",
    "kJ": "kilojoule",
    "K": "kelvin",
    "degC": "degC",
    "g/mol": "gram/mole",
    "g/mL": "gram/milliliter",
}


_LEADING_NUMBER = re.compile(r"^[+-]?[\d.]+(?:[eE][+-]?\d+)?")


def _leading_number_text(text: str) -> str:
    """The leading numeric token, split from any glued unit.

    '2.5e-3M' and '2.5e-3 M' both yield '2.5e-3', so sig figs are counted from
    the number rather than returning zero on a unit-glued token.
    """
    stripped = str(text).strip().replace(",", "")
    m = _LEADING_NUMBER.match(stripped)
    return m.group(0) if m else stripped


def _registry():
    import pint

    return pint.UnitRegistry()


def parse_quantity(text: str, expected_unit: str | None):
    """Parse "1.23 M" or "4.5e-3 mol/L" into a pint quantity.

    Returns None when the text is not a readable measurement. A bare number is
    accepted and assumed to be in the expected unit, because most learners type
    the number alone when the prompt already states the unit.
    """
    if text is None:
        return None
    raw = str(text).strip().replace(",", "")
    if not raw:
        return None
    raw = raw.replace("×10^", "e").replace("x10^", "e").replace("*10^", "e")

    ureg = _registry()
    # Bare number path.
    try:
        value = float(raw)
        if not math.isfinite(value):
            return None
        return ureg.Quantity(value, expected_unit) if expected_unit else ureg.Quantity(value)
    except ValueError:
        pass

    m = re.match(r"^([+-]?[\d.]+(?:[eE][+-]?\d+)?)\s*(.+)$", raw)
    if not m:
        return None
    try:
        magnitude = float(m.group(1))
    except ValueError:
        return None
    if not math.isfinite(magnitude):
        return None
    unit_text = m.group(2).strip()
    unit_text = _ALIASES.get(unit_text, unit_text)
    try:
        return ureg.Quantity(magnitude, unit_text)
    except Exception:
        return None


def _correct_display(key_value: float, key_unit: str, figures: int | None) -> str:
    """Render the canonical answer at the precision the item demands.

    An item that asks for 3 significant figures must not display its own key
    with 4: "%g" prints the raw float ("22.34 g" against a 3-figure demand),
    contradicting the prompt in the learner's review. When the item demands a
    figure count, the display is rounded and rendered to exactly that count;
    otherwise the raw "%g" rendering stands.
    """
    if figures:
        return f"{format_sig_figs(key_value, figures)} {key_unit}"
    return f"{key_value:g} {key_unit}"


def grade_numeric(
    key_value: float,
    key_unit: str,
    student_answer: str,
    *,
    rel_tolerance: float = 0.01,
    expected_sig_figs: int | None = None,
    enforce_sig_figs: bool = True,
    wrong_paths: list[dict] | None = None,
) -> GradeResult:
    """Grade a numeric answer with units.

    wrong_paths lets a template name the specific slips it expects, each as
    {"value": float, "misconception": code, "detail": text}. When the
    submission matches one of them the learner gets that named diagnosis
    instead of a generic miss, which is the whole point of the teaching model.
    """
    grader = "numeric"
    quantity = parse_quantity(student_answer, key_unit)
    if quantity is None:
        return GradeResult.ungradable(
            grader,
            f"That answer could not be read as a measurement. Give a number, "
            f"optionally with a unit, for example 2.5 {key_unit}.",
        )

    try:
        ureg = _registry()
        converted = quantity.to(key_unit).magnitude if key_unit else quantity.magnitude
    except Exception:
        return GradeResult(
            is_correct=False,
            score=0.0,
            grader=grader,
            detail=(
                f"The units do not match what this question asks for. It expects "
                f"something measured in {key_unit}."
            ),
        )
    if not math.isfinite(converted):
        return GradeResult.ungradable(grader, "That is not a finite measurement.")

    # Zero needs an absolute comparison, not a relative one. math.isclose with
    # a relative tolerance is always False against a key of zero, so the guard
    # here used to read "key_value != 0 and ...", which made any item whose
    # correct answer is zero impossible to answer: a learner typing 0 was told
    # they were wrong and given no way to be right. No general chemistry item
    # happens to key zero, so it went unnoticed until an organic item asked for
    # the degrees of unsaturation of a saturated compound.
    if key_value == 0:
        matches = abs(converted) < 1e-9
    else:
        matches = math.isclose(converted, key_value, rel_tol=rel_tolerance)
    if matches:
        submitted_figs = sig_figs(_leading_number_text(student_answer))
        if enforce_sig_figs and expected_sig_figs and submitted_figs and submitted_figs != expected_sig_figs:
            return GradeResult(
                is_correct=False,
                score=0.75,
                grader=grader,
                misconception="SIGFIG",
                detail=(
                    f"The value is right. The data carries {expected_sig_figs} "
                    f"significant figures, so the answer should as well, and yours "
                    f"carries {submitted_figs}."
                ),
                correct_display=_correct_display(key_value, key_unit, expected_sig_figs),
            )
        return GradeResult(
            is_correct=True, score=1.0, grader=grader, detail="Correct.",
            correct_display=_correct_display(key_value, key_unit, expected_sig_figs),
        )

    for path in wrong_paths or []:
        candidate = path.get("value")
        if candidate and math.isclose(converted, candidate, rel_tol=max(rel_tolerance, 1e-3)):
            return GradeResult(
                is_correct=False,
                score=0.25,
                grader=grader,
                misconception=path.get("misconception"),
                detail=path.get("detail", "That is a common wrong route through this problem."),
                correct_display=_correct_display(key_value, key_unit, expected_sig_figs),
            )

    # Order of magnitude slip is worth naming on its own, it is almost always
    # a unit conversion that was skipped.
    if key_value and converted:
        ratio = converted / key_value
        for factor, note in ((1000, "a factor of 1000 too large"), (0.001, "a factor of 1000 too small"),
                             (100, "a factor of 100 too large"), (0.01, "a factor of 100 too small")):
            if math.isclose(ratio, factor, rel_tol=0.05):
                return GradeResult(
                    is_correct=False,
                    score=0.25,
                    grader=grader,
                    detail=(
                        f"Your value is {note}. Check whether a unit conversion was "
                        "skipped, for example millilitres to litres."
                    ),
                    correct_display=_correct_display(key_value, key_unit, expected_sig_figs),
                )

    return GradeResult(
        is_correct=False,
        score=0.0,
        grader=grader,
        detail="Not correct. Write down what you know with units, and what the question asks for with units, before you calculate.",
        correct_display=_correct_display(key_value, key_unit, expected_sig_figs),
    )
