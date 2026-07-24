"""chem_core: the deterministic chemistry engine behind OCTET.

This package is the chemistry sibling of AXIOM's math_core. It holds every
grader, every independent verifier, the misconception library, the hint
ladders, and the template registry. It has no database, no network, and no web
framework, so it can be tested and reasoned about in isolation.

Phase 1 scope (graders verified gate): graders 1 formula, 2 balance,
3 stoichiometry, 6 multiple choice, 7 equilibrium. Graders 4 structure,
5 Lewis, 8 mechanism, 9 lab data, 10 spectra, 11 retro step and 12 prediction
arrive in their own phases and are not stubbed here. A missing grader raises,
it does not silently pass.
"""

from __future__ import annotations

from ._safe import GradingTimeout, InputTooLarge, time_limit
from .balance import (
    Equation,
    EquationParseError,
    Species,
    conservation_residual,
    grade_balance,
    is_balanced,
    parse_equation,
    solve_coefficients,
    verify_balance_key,
)
from .equilibrium import (
    EquilibriumProblem,
    EquilibriumSolution,
    grade_equilibrium,
    mass_action,
    ph_from_hydronium,
    solve_equilibrium,
    verify_equilibrium_key,
)
from .formula import (
    Formula,
    FormulaParseError,
    empirical,
    grade_formula,
    parse_formula,
    verify_formula_key,
    verify_molar_mass,
)
from .hints import HINTS, hint_coverage, rung
from .mc import grade_mc, validate_choices
from .misconceptions import MISCONCEPTIONS, Misconception
from .registry import REGISTRY, Variant, resolve_generated, sweep, variant_seed
from .stoich import (
    StoichProblem,
    StoichSolution,
    grade_stoichiometry,
    round_to_sig_figs,
    sig_figs,
    solve_stoichiometry,
    verify_stoichiometry_key,
)
from .types import GradeResult, VerifierResult

__all__ = [
    "GradeResult",
    "VerifierResult",
    "GradingTimeout",
    "InputTooLarge",
    "time_limit",
    "Formula",
    "FormulaParseError",
    "parse_formula",
    "empirical",
    "grade_formula",
    "verify_formula_key",
    "verify_molar_mass",
    "Equation",
    "EquationParseError",
    "Species",
    "parse_equation",
    "solve_coefficients",
    "conservation_residual",
    "is_balanced",
    "grade_balance",
    "verify_balance_key",
    "StoichProblem",
    "StoichSolution",
    "solve_stoichiometry",
    "grade_stoichiometry",
    "verify_stoichiometry_key",
    "sig_figs",
    "round_to_sig_figs",
    "EquilibriumProblem",
    "EquilibriumSolution",
    "solve_equilibrium",
    "grade_equilibrium",
    "verify_equilibrium_key",
    "mass_action",
    "ph_from_hydronium",
    "grade_mc",
    "validate_choices",
    "MISCONCEPTIONS",
    "Misconception",
    "HINTS",
    "hint_coverage",
    "rung",
    "REGISTRY",
    "Variant",
    "resolve_generated",
    "sweep",
    "variant_seed",
    "grade",
    "SUPPORTED_GRADERS",
]

__version__ = "0.1.0"

# Graders live in this phase. Anything outside this set raises on dispatch.
SUPPORTED_GRADERS = ("formula", "balance", "stoich", "mc", "equilibrium")


def grade(grader: str, variant, student_answer, **kwargs) -> GradeResult:
    """Single dispatch entry point used by the API grading service.

    variant is either a Variant from the registry or a plain dict carrying the
    same key and meta fields, so stored items and generated variants grade
    through one path.

    Never raises on learner input. Unknown graders raise, because that is an
    authoring or deployment error rather than a learner error.
    """
    if grader not in SUPPORTED_GRADERS:
        raise KeyError(
            f"grader {grader!r} is not available in this phase. "
            f"Available: {', '.join(SUPPORTED_GRADERS)}"
        )

    key = getattr(variant, "key", None) if not isinstance(variant, dict) else variant.get("key")
    meta = getattr(variant, "meta", None) if not isinstance(variant, dict) else variant.get("meta")
    meta = meta or {}

    if grader == "formula":
        return grade_formula(
            key,
            student_answer,
            mode=meta.get("mode", "molecular"),
            require_charge=meta.get("require_charge", True),
        )
    if grader == "balance":
        return grade_balance(meta.get("skeleton", ""), student_answer)
    if grader == "stoich":
        problem = StoichProblem(
            given_mass_g=meta["given_mass_g"],
            from_formula=meta["from_formula"],
            to_formula=meta["to_formula"],
            from_coefficient=meta["from_coefficient"],
            to_coefficient=meta["to_coefficient"],
            sig_figs=meta.get("sig_figs", 3),
        )
        return grade_stoichiometry(problem, student_answer, **kwargs)
    if grader == "mc":
        return grade_mc(meta.get("correct_index", int(key or 0)), student_answer, meta.get("choices", []))
    # equilibrium
    problem = EquilibriumProblem(
        k=meta["ka"],
        initial={meta["formula"]: meta["concentration"], "H3O+": 0.0, "A-": 0.0},
        stoich={meta["formula"]: -1, "H3O+": 1, "A-": 1},
        label=meta.get("name", ""),
    )
    return grade_equilibrium(problem, student_answer, **kwargs)
