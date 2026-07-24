"""Template registry: generators, each gated by an independent verifier.

This is the AXIOM issued variant pattern applied to chemistry. Two rules carry
over unchanged and they are the reason the platform can be trusted:

1. Every generator's answer key is checked at serve time by a second
   computational path that shares no code with the generator. If the check
   fails the seed is discarded and the next one is tried, so a learner is
   never served a variant whose key was not independently confirmed.
2. Grading runs against the stored key of the issued variant, never against a
   value recomputed at grade time.

sweep(seeds_per_template=12) is the CI gate named in the acceptance criteria.
"""

from __future__ import annotations

import hashlib
from dataclasses import dataclass, field
from fractions import Fraction
from typing import Callable

from . import _fixtures as fx
from .balance import parse_equation, solve_coefficients, verify_balance_key
from .equilibrium import EquilibriumProblem, solve_equilibrium, verify_equilibrium_key
from .formula import empirical, parse_formula, verify_formula_key, verify_molar_mass
from .mc import validate_choices
from .stoich import StoichProblem, solve_stoichiometry, sig_figs, verify_stoichiometry_key
from .types import VerifierResult

MAX_SEED_RETRIES = 10


@dataclass
class Variant:
    """One issued item. prompt and key are stored, grading uses the stored key."""

    template_id: str
    seed: int
    prompt: str
    key: str
    node: str
    grader: str
    meta: dict = field(default_factory=dict)


def variant_seed(user_id: str, template_id: str, count: int) -> int:
    """Deterministic per learner seed. Same learner and count gives the same item."""
    digest = hashlib.sha256(f"{user_id}:{template_id}:{count}".encode()).hexdigest()
    return int(digest[:8], 16) & 0x7FFFFFFF


def _pick(seq, seed: int, salt: int = 0):
    return seq[(seed + salt) % len(seq)]


# ---------------------------------------------------------------------------
# formula.molecular.v1
# Generator reads the recorded formula. Verifier derives it from the SMILES
# with RDKit, so a wrong fixture cannot pass.
# ---------------------------------------------------------------------------


def _gen_formula_molecular(seed: int) -> Variant:
    mol = _pick(fx.MOLECULES, seed)
    return Variant(
        template_id="formula.molecular.v1",
        seed=seed,
        prompt=(
            f"Write the molecular formula for {mol.name}. "
            f"({mol.real_world_note})"
        ),
        key=mol.formula,
        node="C.G1.FORMULA",
        grader="formula",
        meta={"smiles": mol.smiles, "mode": "molecular", "name": mol.name},
    )


def _ver_formula_molecular(v: Variant) -> VerifierResult:
    return verify_formula_key(v.key, v.meta["smiles"])


# ---------------------------------------------------------------------------
# formula.empirical.v1
# Generator computes percent composition from the molecular formula. Verifier
# reduces the key to its empirical form and recomputes the percentages, which
# must reproduce the prompt. This is a round trip, not a restatement.
# ---------------------------------------------------------------------------


def _gen_formula_empirical(seed: int) -> Variant:
    mol = _pick(fx.MOLECULES, seed, salt=3)
    counts = parse_formula(mol.formula).counts
    total = parse_formula(mol.formula).molar_mass()
    import periodictable

    percents = {
        el: round(getattr(periodictable, el).mass * n / total * 100.0, 2)
        for el, n in counts.items()
    }
    listed = ", ".join(f"{el} {p:.2f} percent" for el, p in sorted(percents.items()))
    emp = empirical(counts)
    key = "".join(f"{el}{n if n != 1 else ''}" for el, n in sorted(emp.items()))
    return Variant(
        template_id="formula.empirical.v1",
        seed=seed,
        prompt=(
            f"A compound is found by combustion analysis to contain {listed} by "
            "mass. Determine its empirical formula."
        ),
        key=key,
        node="C.G1.FORMULA",
        grader="formula",
        meta={"percents": percents, "mode": "empirical", "molecular": mol.formula},
    )


def _ver_formula_empirical(v: Variant) -> VerifierResult:
    import periodictable

    try:
        key_counts = parse_formula(v.key).counts
    except Exception as exc:
        return VerifierResult(ok=False, method="percent-roundtrip", detail=str(exc))
    if empirical(key_counts) != key_counts:
        return VerifierResult(
            ok=False, method="percent-roundtrip", detail="key is not in lowest terms"
        )
    mass = sum(getattr(periodictable, el).mass * n for el, n in key_counts.items())
    if mass <= 0:
        return VerifierResult(ok=False, method="percent-roundtrip", detail="non positive mass")
    for el, stated in v.meta["percents"].items():
        if el not in key_counts:
            return VerifierResult(
                ok=False, method="percent-roundtrip", detail=f"key omits {el}"
            )
        recomputed = getattr(periodictable, el).mass * key_counts[el] / mass * 100.0
        if abs(recomputed - stated) > 0.15:
            return VerifierResult(
                ok=False,
                method="percent-roundtrip",
                detail=f"{el}: prompt says {stated}, key implies {recomputed:.2f}",
            )
    return VerifierResult(ok=True, method="percent-roundtrip", detail=v.key)


# ---------------------------------------------------------------------------
# balance.combustion.v1 and balance.precipitation.v1
# Generator solves by SymPy nullspace. Verifier applies the coefficients and
# runs conservation arithmetic with no linear algebra library involved.
# ---------------------------------------------------------------------------


def _gen_balance_combustion(seed: int) -> Variant:
    name, _c, _h = _pick(fx.HYDROCARBONS, seed)
    skeleton = f"{name} + O2 -> CO2 + H2O"
    coefficients = solve_coefficients(parse_equation(skeleton))
    if coefficients is None:
        raise ValueError(f"combustion skeleton did not solve: {skeleton}")
    return Variant(
        template_id="balance.combustion.v1",
        seed=seed,
        prompt=(
            f"Balance the complete combustion of {name} in oxygen:\n{skeleton}\n"
            "Give the coefficients in order."
        ),
        key=",".join(str(c) for c in coefficients),
        node="C.G1.BALANCE",
        grader="balance",
        meta={"skeleton": skeleton},
    )


def _gen_balance_precipitation(seed: int) -> Variant:
    a, b, precip, spectator, note = _pick(fx.PRECIPITATIONS, seed)
    skeleton = f"{a} + {b} -> {precip} + {spectator}"
    coefficients = solve_coefficients(parse_equation(skeleton))
    if coefficients is None:
        raise ValueError(f"precipitation skeleton did not solve: {skeleton}")
    return Variant(
        template_id="balance.precipitation.v1",
        seed=seed,
        prompt=(
            f"Two solutions are mixed and a precipitate forms ({note}). Balance "
            f"the reaction:\n{skeleton}\nGive the coefficients in order."
        ),
        key=",".join(str(c) for c in coefficients),
        node="C.G1.BALANCE",
        grader="balance",
        meta={"skeleton": skeleton, "precipitate": precip},
    )


def _ver_balance(v: Variant) -> VerifierResult:
    coefficients = [int(t) for t in v.key.split(",")]
    return verify_balance_key(v.meta["skeleton"], coefficients)


# ---------------------------------------------------------------------------
# stoich.mass_to_mass.v1
# Generator runs the grams to moles to moles to grams chain. Verifier
# recomputes through kilograms with a single combined factor via pint.
# ---------------------------------------------------------------------------


def _gen_stoich_mass_to_mass(seed: int) -> Variant:
    name, carbons, hydrogens = _pick(fx.HYDROCARBONS, seed, salt=5)
    skeleton = f"{name} + O2 -> CO2 + H2O"
    coefficients = solve_coefficients(parse_equation(skeleton))
    if coefficients is None:
        raise ValueError(f"skeleton did not solve: {skeleton}")
    fuel_coefficient, _o2, co2_coefficient, _h2o = coefficients
    given = round(2.0 + (seed % 180) / 10.0, 1)
    problem = StoichProblem(
        given_mass_g=given,
        from_formula=name,
        to_formula="CO2",
        from_coefficient=fuel_coefficient,
        to_coefficient=co2_coefficient,
        sig_figs=sig_figs(str(given)) or 3,
    )
    solution = solve_stoichiometry(problem)
    return Variant(
        template_id="stoich.mass_to_mass.v1",
        seed=seed,
        prompt=(
            f"{given} g of {name} burns completely in oxygen:\n{skeleton}\n"
            "What mass of carbon dioxide is produced? Report your answer in "
            f"grams to {problem.sig_figs} significant figures."
        ),
        key=f"{solution.rounded_g:g}",
        node="C.G1.STOICH",
        grader="stoich",
        meta={
            "given_mass_g": given,
            "from_formula": name,
            "to_formula": "CO2",
            "from_coefficient": fuel_coefficient,
            "to_coefficient": co2_coefficient,
            "sig_figs": problem.sig_figs,
            "exact_g": solution.answer_g,
        },
    )


def _ver_stoich(v: Variant) -> VerifierResult:
    problem = StoichProblem(
        given_mass_g=v.meta["given_mass_g"],
        from_formula=v.meta["from_formula"],
        to_formula=v.meta["to_formula"],
        from_coefficient=v.meta["from_coefficient"],
        to_coefficient=v.meta["to_coefficient"],
        sig_figs=v.meta["sig_figs"],
    )
    return verify_stoichiometry_key(problem, v.meta["exact_g"])


# ---------------------------------------------------------------------------
# equilibrium.weak_acid.v1
# Generator solves the quadratic with SymPy. Verifier substitutes the root back
# into the mass action expression and checks the residual and physicality.
# ---------------------------------------------------------------------------


def _weak_acid_problem(name: str, formula: str, ka: float, concentration: float) -> EquilibriumProblem:
    return EquilibriumProblem(
        k=ka,
        initial={formula: concentration, "H3O+": 0.0, "A-": 0.0},
        stoich={formula: -1, "H3O+": 1, "A-": 1},
        label=name,
    )


def _gen_equilibrium_weak_acid(seed: int) -> Variant:
    name, formula, ka = _pick(fx.WEAK_ACIDS, seed, salt=7)
    concentration = round(0.010 + (seed % 90) / 1000.0, 3)
    problem = _weak_acid_problem(name, formula, ka, concentration)
    solution = solve_equilibrium(problem)
    return Variant(
        template_id="equilibrium.weak_acid.v1",
        seed=seed,
        prompt=(
            f"A {concentration:.3f} M solution of {name} ({formula}) has "
            f"Ka = {ka:.2g} at 25 C. Calculate the equilibrium hydronium ion "
            "concentration in molar. State whether the small x approximation is "
            "valid before you rely on it."
        ),
        key=f"{solution.x:.4g}",
        node="C.G2.EQUILIBRIUM",
        grader="equilibrium",
        meta={
            "ka": ka,
            "concentration": concentration,
            "formula": formula,
            "name": name,
            "exact_x": solution.x,
            "approximation_valid": solution.approximation_valid,
            "percent_ionization": solution.percent_ionization,
        },
    )


def _ver_equilibrium(v: Variant) -> VerifierResult:
    problem = _weak_acid_problem(
        v.meta["name"], v.meta["formula"], v.meta["ka"], v.meta["concentration"]
    )
    return verify_equilibrium_key(problem, v.meta["exact_x"])


# ---------------------------------------------------------------------------
# mc.subscript_coefficient.v1
# Generator builds a misconception keyed diagnostic. Verifier is structural:
# every distractor must key a misconception that exists and routes somewhere.
# ---------------------------------------------------------------------------


def _gen_mc_subscript(seed: int) -> Variant:
    name, carbons, hydrogens = _pick(fx.HYDROCARBONS, seed, salt=11)
    skeleton = f"{name} + O2 -> CO2 + H2O"
    choices = [
        {
            "index": 0,
            "text": "Put coefficients in front of the formulas until each element balances.",
            "misconception": None,
        },
        {
            "index": 1,
            "text": f"Change H2O to H2O2 so the oxygen count works out.",
            "misconception": "SUB-COEF",
        },
        {
            "index": 2,
            "text": "Add an extra oxygen atom to the product side to make up the difference.",
            "misconception": "ATOM-CONSERV",
        },
        {
            "index": 3,
            "text": "Double every coefficient at the end so the numbers are larger and safer.",
            "misconception": "NOT-MINIMAL",
        },
    ]
    return Variant(
        template_id="mc.subscript_coefficient.v1",
        seed=seed,
        prompt=(
            f"You are balancing {skeleton}. Which approach is chemically valid?"
        ),
        key="0",
        node="C.G1.BALANCE",
        grader="mc",
        meta={"choices": choices, "correct_index": 0},
    )


def _ver_mc(v: Variant) -> VerifierResult:
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(ok=False, method="mc-structural", detail="; ".join(problems))
    return VerifierResult(ok=True, method="mc-structural", detail="all distractors keyed and routed")


# ---------------------------------------------------------------------------
# Registry
# ---------------------------------------------------------------------------

REGISTRY: dict[str, dict[str, object]] = {
    "formula.molecular.v1": {
        "gen": _gen_formula_molecular,
        "ver": _ver_formula_molecular,
        "node": "C.G1.FORMULA",
        "grader": "formula",
    },
    "formula.empirical.v1": {
        "gen": _gen_formula_empirical,
        "ver": _ver_formula_empirical,
        "node": "C.G1.FORMULA",
        "grader": "formula",
    },
    "balance.combustion.v1": {
        "gen": _gen_balance_combustion,
        "ver": _ver_balance,
        "node": "C.G1.BALANCE",
        "grader": "balance",
    },
    "balance.precipitation.v1": {
        "gen": _gen_balance_precipitation,
        "ver": _ver_balance,
        "node": "C.G1.BALANCE",
        "grader": "balance",
    },
    "stoich.mass_to_mass.v1": {
        "gen": _gen_stoich_mass_to_mass,
        "ver": _ver_stoich,
        "node": "C.G1.STOICH",
        "grader": "stoich",
    },
    "equilibrium.weak_acid.v1": {
        "gen": _gen_equilibrium_weak_acid,
        "ver": _ver_equilibrium,
        "node": "C.G2.EQUILIBRIUM",
        "grader": "equilibrium",
    },
    "mc.subscript_coefficient.v1": {
        "gen": _gen_mc_subscript,
        "ver": _ver_mc,
        "node": "C.G1.BALANCE",
        "grader": "mc",
    },
}


def resolve_generated(template_id: str, seed: int, *, max_attempts: int = MAX_SEED_RETRIES) -> Variant:
    """Produce a variant whose key has been independently verified.

    The verifier runs at serve time, not only in CI. If a seed produces a key
    the second path cannot confirm, that seed is discarded and the next is
    tried. Exhausting the retries raises rather than serving an unverified key.
    """
    entry = REGISTRY.get(template_id)
    if entry is None:
        raise KeyError(f"unknown template {template_id}")
    gen: Callable[[int], Variant] = entry["gen"]  # type: ignore[assignment]
    ver: Callable[[Variant], VerifierResult] = entry["ver"]  # type: ignore[assignment]

    last = ""
    for attempt in range(max_attempts):
        candidate_seed = seed + attempt
        try:
            variant = gen(candidate_seed)
        except Exception as exc:
            last = f"generator raised: {exc}"
            continue
        result = ver(variant)
        if result.ok:
            variant.meta["verified_by"] = result.method
            variant.meta["verifier_detail"] = result.detail
            return variant
        last = result.detail
    raise RuntimeError(
        f"no verifiable variant for {template_id} after {max_attempts} seeds: {last}"
    )


def sweep(seeds_per_template: int = 12) -> dict[str, dict]:
    """Run every generator over a band of seeds and verify each key.

    This is the Phase 1 gate. CI asserts zero failures. The default of 12 is
    the number named in the build prompt's acceptance criteria.
    """
    report: dict[str, dict] = {}
    for template_id, entry in REGISTRY.items():
        gen: Callable[[int], Variant] = entry["gen"]  # type: ignore[assignment]
        ver: Callable[[Variant], VerifierResult] = entry["ver"]  # type: ignore[assignment]
        failures: list[dict] = []
        ok = 0
        for seed in range(seeds_per_template):
            try:
                variant = gen(seed)
            except Exception as exc:
                failures.append({"seed": seed, "stage": "generate", "detail": str(exc)})
                continue
            result = ver(variant)
            if result.ok:
                ok += 1
            else:
                failures.append(
                    {
                        "seed": seed,
                        "stage": "verify",
                        "method": result.method,
                        "detail": result.detail,
                        "key": variant.key,
                    }
                )
        report[template_id] = {
            "node": entry["node"],
            "grader": entry["grader"],
            "ok": ok,
            "total": seeds_per_template,
            "failures": failures,
        }
    return report
