"""chem_core: the deterministic chemistry engine behind OCTET.

This package is the chemistry sibling of AXIOM's math_core. It holds every
grader, every independent verifier, the misconception library, the hint
ladders, and the template registry. It has no database, no network, and no web
framework, so it can be tested and reasoned about in isolation.

Live graders: 1 formula, 2 balance, 3 stoichiometry, 4 structure, 6 multiple
choice, 7 equilibrium, 10 spectra, 11 retro step, 12 prediction. Graders 5
Lewis, 8 mechanism and 9 lab data arrive in their own phases and are not
stubbed here. A missing grader raises, it does not silently pass.

Graders 4 and 12 landed in Phase 3 alongside the visualization surface they
feed: 4 grades what the Sketcher draws, and 12 grades the prediction a learner
commits to before a simulation runs.

Grader 10 landed in Phase 5 with the organic module beside it. Its verifier is
unlike the others: rather than checking a generated key against a second
computational path, it checks that an elucidation item's stated data actually
determines its own answer. That makes it a check on the author, which is the
right target, because organic content is authored by a system that produces
fluent and confidently wrong chemistry.
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
from .numeric import grade_numeric, parse_quantity
from .pool import get_pool, pool_source, set_pool
from .prediction import (
    Option,
    PoeAttempt,
    PoeItem,
    check_options,
    grade_explanation,
    grade_prediction,
    verify_prediction_key,
)
from .misconceptions import MISCONCEPTIONS, Misconception
from .registry import REGISTRY, Variant, resolve_generated, sweep, variant_seed
from .stoich import (
    StoichProblem,
    StoichSolution,
    grade_stoichiometry,
    format_sig_figs,
    round_to_sig_figs,
    sig_figs,
    solve_stoichiometry,
    verify_stoichiometry_key,
)
from .simulate import (
    EquilibriumSetup,
    TitrationSetup,
    equilibrium_shift,
    reaction_quotient,
    solve_extent,
    solve_ph,
    titration_curve,
    titration_landmarks,
    verify_equilibrium_shift,
    verify_titration,
)
from .retro import (  # noqa: E402
    Disconnection,
    RetroItem,
    grade_retro,
    verify_retro_item,
)
from .spectra import (  # noqa: E402
    Signal,
    SpectrumItem,
    grade_spectrum,
    verify_spectrum_item,
)
from .structure import (
    canonical,
    formula_of,
    grade_structure,
    inchikey,
    parse_smiles,
    verify_structure_key,
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
    "format_sig_figs",
    "EquilibriumProblem",
    "EquilibriumSolution",
    "solve_equilibrium",
    "grade_equilibrium",
    "verify_equilibrium_key",
    "mass_action",
    "ph_from_hydronium",
    "grade_mc",
    "validate_choices",
    "grade_numeric",
    "parse_quantity",
    "set_pool",
    "get_pool",
    "pool_source",
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
    "Option",
    "PoeAttempt",
    "PoeItem",
    "check_options",
    "grade_explanation",
    "grade_prediction",
    "verify_prediction_key",
    "grade_structure",
    "grade_spectrum",
    "verify_spectrum_item",
    "SpectrumItem",
    "Signal",
    "grade_retro",
    "verify_retro_item",
    "RetroItem",
    "Disconnection",
    "verify_structure_key",
    "canonical",
    "inchikey",
    "parse_smiles",
    "formula_of",
    "TitrationSetup",
    "EquilibriumSetup",
    "solve_ph",
    "titration_curve",
    "titration_landmarks",
    "verify_titration",
    "equilibrium_shift",
    "solve_extent",
    "reaction_quotient",
    "verify_equilibrium_shift",
    "SUPPORTED_GRADERS",
]

__version__ = "0.1.0"

# Graders live in this phase. Anything outside this set raises on dispatch.
SUPPORTED_GRADERS = (
    "formula",
    "balance",
    "stoich",
    "mc",
    "equilibrium",
    "numeric",
    "structure",
    "prediction",
    "spectrum",
    "retro",
)


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
    if grader == "numeric":
        return grade_numeric(
            meta["value"],
            meta.get("unit", ""),
            student_answer,
            expected_sig_figs=meta.get("sig_figs"),
            wrong_paths=[w for w in meta.get("wrong_paths", []) if w.get("value")],
            **kwargs,
        )
    if grader == "mc":
        # correct_index is read before falling back to the key, and the
        # fallback is only evaluated when it is actually needed. Written as
        # meta.get("correct_index", int(key or 0)) this crashed on any mc item
        # whose key was not a number, because Python evaluates the default
        # eagerly even when the key is present. It never bit while every mc
        # template happened to key an integer.
        index = meta.get("correct_index")
        if index is None:
            try:
                index = int(key or 0)
            except (TypeError, ValueError):
                return GradeResult.ungradable(
                    "mc", "This item does not record which choice is correct."
                )
        return grade_mc(index, student_answer, meta.get("choices", []))
    if grader == "structure":
        return grade_structure(
            key,
            student_answer,
            stereo=meta.get("stereo", "strict"),
            tautomer=meta.get("tautomer", "strict"),
        )
    if grader == "prediction":
        # The options and key travel in meta so this dispatches through the
        # same sandbox as every other grader. Rebuilding the dataclasses here
        # keeps the child process free of any application import.
        item = PoeItem(
            id=meta.get("item_id", ""),
            node=meta.get("node", ""),
            scenario=meta.get("scenario", ""),
            predict_prompt="",
            predict_options=[Option(**o) for o in meta.get("options", [])],
            predict_key=str(key),
            explain_prompt="",
            explain_options=[],
            explain_key="",
        )
        return grade_prediction(item, student_answer)
    if grader == "spectrum":
        # Signals travel in meta so the sandboxed child rebuilds the item
        # without importing anything from the application. Only the proton
        # counts matter to grading; shifts are display text.
        item = SpectrumItem(
            node=meta.get("node", ""),
            formula=meta.get("formula", ""),
            answer=str(key),
            signals=tuple(Signal(**s) for s in meta.get("signals", [])),
            ir_bands=tuple(meta.get("ir_bands", [])),
            source=meta.get("source", ""),
        )
        return grade_spectrum(item, student_answer)
    if grader == "retro":
        # The disconnections and key travel in meta so the sandboxed child
        # rebuilds the item without importing the application. student_answer
        # carries the chosen disconnection and the precursor list.
        disconnections = tuple(
            Disconnection(**d) for d in meta.get("disconnections", [])
        )
        item = RetroItem(
            node=meta.get("node", ""),
            target=str(key),
            disconnections=disconnections,
            key_disconnection=meta.get("key_disconnection", ""),
            key_precursors=tuple(meta.get("key_precursors", [])),
            source=meta.get("source", ""),
        )
        chosen = student_answer.get("disconnection", "") if isinstance(student_answer, dict) else ""
        precursors = student_answer.get("precursors", []) if isinstance(student_answer, dict) else []
        return grade_retro(item, chosen, precursors)
    # equilibrium
    problem = EquilibriumProblem(
        k=meta["ka"],
        initial={meta["formula"]: meta["concentration"], "H3O+": 0.0, "A-": 0.0},
        stoich={meta["formula"]: -1, "H3O+": 1, "A-": 1},
        label=meta.get("name", ""),
    )
    return grade_equilibrium(problem, student_answer, **kwargs)
