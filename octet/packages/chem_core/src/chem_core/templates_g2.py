"""GEN2 templates: practice items for the second general chemistry course.

Before this module the whole of GEN2 had only a handful of items, so most of
its authored nodes taught and could not be practised. This file adds ten
templates spread across ten distinct GEN2 nodes, every one of which has an
authored lesson: kinetics (rates, rate law, Arrhenius), equilibrium (the ICE
method), acid-base (strong base pOH, buffers), thermodynamics (Gibbs),
electrochemistry (galvanic cell potential, Nernst) and nuclear decay.

The house rules carry over unchanged:

  * Every generator ships with an independent verifier that reaches the same
    key by a different route (inversion, substitution back, or a second
    formulation) rather than replaying the generator's arithmetic.
  * Every multiple choice distractor keys a named misconception that routes to
    a real node, checked structurally by validate_choices.

On values and constants. No measured quantity is invented. Every rate
constant, activation energy, equilibrium constant, pKa, standard potential,
reaction quotient, enthalpy, entropy and concentration is stated in the prompt
as given problem data, synthesised from the seed rather than lifted from a
table. The only fixed numbers are mathematical or defining constants, and each
is carried in the variant meta with a source string:

  ln 2 = 0.69315                          (mathematical constant)
  R    = 8.314 J/(mol*K)                  (CODATA; CRC Handbook)
  pH + pOH = 14.00 at 25 C, Kw = 1.0e-14  (CRC Handbook)
  0.0592 V per decade at 298 K            (2.303 RT/F; Atkins, CRC Handbook)

The ICE template reuses chem_core.equilibrium (solve_equilibrium and
verify_equilibrium_key) rather than re-deriving the quadratic here, so the
solver and its substitution check are shared with the weak acid template.

Section 18 applies to the nuclear template: it is decay arithmetic only, the
fraction of a sample remaining after a whole number of half-lives, and says
nothing about enrichment, criticality or any application of that kind.

Registration into REGISTRY, HINTS and MISCONCEPTIONS is done by the registry
wiring, not by this module.
"""

from __future__ import annotations

import math

from .equilibrium import EquilibriumProblem, solve_equilibrium, verify_equilibrium_key
from .mc import validate_choices
from .misconceptions import Misconception
from .registry import Variant, _pick
from .stoich import format_sig_figs
from .types import VerifierResult

LN2 = math.log(2.0)
R_GAS_J = 8.314          # J/(mol*K), CODATA / CRC Handbook
NERNST_SLOPE = 0.0592    # V per decade at 298 K, 2.303 RT/F

_LN2_SOURCE = "t_half = ln 2 / k for first-order kinetics; ln 2 = 0.69315 (mathematical constant)"
_R_SOURCE = "R = 8.314 J/(mol*K) (CODATA; CRC Handbook)"
_KW_SOURCE = "pH + pOH = 14.00 at 25 C, Kw = 1.0e-14 (CRC Handbook)"
_NERNST_SOURCE = "0.0592 V per decade at 298 K, from 2.303 RT/F (Atkins Physical Chemistry; CRC Handbook)"
_GIBBS_SOURCE = "Gibbs relation dG = dH - T dS; dS given in J, dH and dG in kJ (Atkins Physical Chemistry)"
_HH_SOURCE = "Henderson-Hasselbalch pH = pKa + log10([A-]/[HA]) (Atkins Physical Chemistry)"
_CELL_SOURCE = "Standard cell potential E0cell = E0cathode - E0anode, a definition (Atkins Physical Chemistry)"
_ICE_SOURCE = "K is given problem data; ICE table and mass action are standard (Atkins Physical Chemistry)"
_DECAY_SOURCE = "Remaining fraction after n half-lives is (1/2)^n; simple radioactive decay (Atkins Physical Chemistry)"

STRONG_BASES = (
    ("NaOH", "sodium hydroxide"),
    ("KOH", "potassium hydroxide"),
    ("LiOH", "lithium hydroxide"),
)


# ---------------------------------------------------------------------------
# 1. first-order half-life  (GEN2.RATES)
# ---------------------------------------------------------------------------

def gen_halflife(seed: int) -> Variant:
    k = round(0.010 + (seed % 40) / 100.0, 3)  # 0.010 .. 0.400 per second
    t_half = LN2 / k
    return Variant(
        template_id="rate.halflife.v1",
        seed=seed,
        prompt=(
            f"A reaction is first order in the reactant and has rate constant "
            f"k = {k} 1/s. What is its half-life? Report in s to 3 significant "
            "figures."
        ),
        key=format_sig_figs(t_half, 3),
        node="GEN2.RATES",
        grader="numeric",
        meta={
            "unit": "s", "value": t_half, "k": k, "sig_figs": 3,
            "constant_source": _LN2_SOURCE,
            "wrong_paths": [
                {"value": 1.0 / k, "misconception": "HALFLIFE-NO-LN2",
                 "detail": "That is 1/k. The first-order half-life carries a "
                           "factor of ln 2, so it is ln 2 divided by k, a little "
                           "under seventy percent of 1/k."}],
        },
    )


def ver_halflife(v: Variant) -> VerifierResult:
    # Independent route: the integrated first-order law, exp(-k t), must leave
    # exactly half the reactant after one half-life. This shares no arithmetic
    # with ln 2 / k.
    k = v.meta["k"]
    t_half = v.meta["value"]
    fraction = math.exp(-k * t_half)
    if not math.isclose(fraction, 0.5, rel_tol=1e-9):
        return VerifierResult(False, "integrated-rate", f"fraction left is {fraction:.6g}, not 0.5")
    if not math.isclose(k * t_half, LN2, rel_tol=1e-9):
        return VerifierResult(False, "integrated-rate", "k times t_half does not equal ln 2")
    return VerifierResult(True, "integrated-rate", f"half remains at t_half = {t_half:.4g} s")


# ---------------------------------------------------------------------------
# 2. reaction order from two trials, multiple choice  (GEN2.RATELAW)
# ---------------------------------------------------------------------------

_ORDER_MISCONCEPTION = {
    0: "RATE-ORDER-ZERO-ASSUMED",
    1: "RATE-ORDER-ASSUME-FIRST",
    2: "RATE-ORDER-FROM-COEFFICIENTS",
}


def gen_ratelaw_order(seed: int) -> Variant:
    ratio = 2 + (seed % 2)          # concentration multiplied by 2 or 3
    order = 1 + (seed % 2)          # true order in A: 1 or 2
    a1 = round(0.10 + (seed % 5) / 100.0, 2)
    r1 = round(0.010 + (seed % 9) / 100.0, 3)
    a2 = round(ratio * a1, 3)
    r2 = r1 * (ratio ** order)
    # Derive the key by ratio arithmetic here (logarithm of the rate ratio over
    # the logarithm of the concentration ratio); the verifier derives it by the
    # power formulation instead.
    derived = int(round(math.log(r2 / r1) / math.log(a2 / a1)))
    choices = []
    for i in range(3):
        choices.append({
            "index": i,
            "text": (
                f"Order {i} in A, so rate = k[A]^{i}."
                if i != 0 else
                "Order 0 in A, so the rate does not depend on [A]."
            ),
            "misconception": None if i == derived else _ORDER_MISCONCEPTION[i],
        })
    return Variant(
        template_id="ratelaw.order.v1",
        seed=seed,
        prompt=(
            "For the reaction 2 A -> products, two experiments are run at the "
            "same temperature.\n"
            f"Experiment 1: [A] = {a1} M, initial rate = {r1} M/s.\n"
            f"Experiment 2: [A] = {a2} M, initial rate = {r2:.4g} M/s.\n"
            "What is the order of the reaction with respect to A?"
        ),
        key=str(derived),
        node="GEN2.RATELAW",
        grader="mc",
        meta={
            "choices": choices, "correct_index": derived,
            "a1": a1, "a2": a2, "r1": r1, "r2": r2, "order": order,
        },
    )


def ver_ratelaw_order(v: Variant) -> VerifierResult:
    # Second formulation: the measured rate ratio must equal the measured
    # concentration ratio raised to the keyed order. Then the item must be
    # structurally sound as a diagnostic.
    conc_ratio = v.meta["a2"] / v.meta["a1"]
    rate_ratio = v.meta["r2"] / v.meta["r1"]
    m = v.meta["correct_index"]
    if not math.isclose(rate_ratio, conc_ratio ** m, rel_tol=1e-6):
        return VerifierResult(
            False, "ratio-power",
            f"rate ratio {rate_ratio:.4g} is not concentration ratio {conc_ratio:.4g} to the {m}",
        )
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, "ratio-power", "; ".join(problems))
    return VerifierResult(True, "ratio-power", f"order {m} confirmed by the rate ratio")


# ---------------------------------------------------------------------------
# 3. Arrhenius two-temperature arithmetic  (GEN2.ARRHENIUS)
# ---------------------------------------------------------------------------

def gen_arrhenius(seed: int) -> Variant:
    ea_kj = 50 + (seed % 8) * 10          # 50 .. 120 kJ/mol
    ea_j = ea_kj * 1000.0
    t1 = 298 + (seed % 20)                # lower temperature
    t2 = t1 + 20 + (seed % 30)            # higher temperature, so k rises
    k1 = round(0.001 * (1 + seed % 9), 4)  # 0.001 .. 0.009 1/s
    factor = (ea_j / R_GAS_J) * (1.0 / t1 - 1.0 / t2)
    k2 = k1 * math.exp(factor)
    return Variant(
        template_id="arrhenius.two_temp.v1",
        seed=seed,
        prompt=(
            f"A reaction has activation energy Ea = {ea_kj} kJ/mol. Its rate "
            f"constant is {k1} 1/s at {t1} K. Using R = 8.314 J/(mol*K), what is "
            f"the rate constant at {t2} K? Report in 1/s to 3 significant figures."
        ),
        key=format_sig_figs(k2, 3),
        node="GEN2.ARRHENIUS",
        grader="numeric",
        meta={
            "unit": "1/s", "value": k2, "ea_j": ea_j, "t1": t1, "t2": t2,
            "k1": k1, "sig_figs": 3, "constant_source": _R_SOURCE,
            "wrong_paths": [
                {"value": k1 * math.exp(-factor), "misconception": "ARRHENIUS-SIGN",
                 "detail": "The temperature term has the wrong sign, so your rate "
                           "constant fell as the temperature rose. Warming a "
                           "reaction speeds it up, so k must increase from T1 to T2."}],
        },
    )


def ver_arrhenius(v: Variant) -> VerifierResult:
    # Invert: recover the activation energy from the two rate constants and the
    # two temperatures, and require the given Ea back.
    k1, k2, t1, t2 = v.meta["k1"], v.meta["value"], v.meta["t1"], v.meta["t2"]
    denom = (1.0 / t1 - 1.0 / t2)
    if denom == 0:
        return VerifierResult(False, "recover-Ea", "the two temperatures are equal")
    ea_recovered = R_GAS_J * math.log(k2 / k1) / denom
    if not math.isclose(ea_recovered, v.meta["ea_j"], rel_tol=1e-6):
        return VerifierResult(False, "recover-Ea", f"recovered Ea {ea_recovered:.6g} J/mol")
    if k2 <= k1:
        return VerifierResult(False, "recover-Ea", "the rate constant did not rise with temperature")
    return VerifierResult(True, "recover-Ea", f"Ea {ea_recovered / 1000.0:.4g} kJ/mol recovered")


# ---------------------------------------------------------------------------
# 4. equilibrium concentration from K, via the ICE machinery  (GEN2.ICE)
# ---------------------------------------------------------------------------

def _dimer_problem(k: float, c0: float) -> EquilibriumProblem:
    # N2O4 <-> 2 NO2. Reactant negative, product positive, as the solver expects.
    return EquilibriumProblem(
        k=k,
        initial={"N2O4": c0, "NO2": 0.0},
        stoich={"N2O4": -1, "NO2": 2},
        label="N2O4 dissociation",
    )


def gen_ice(seed: int) -> Variant:
    k = round(0.10 + (seed % 9) / 20.0, 3)   # 0.100 .. 0.500
    c0 = round(0.20 + (seed % 8) / 10.0, 2)  # 0.20 .. 0.90
    problem = _dimer_problem(k, c0)
    solution = solve_equilibrium(problem)
    x = solution.x
    no2 = solution.concentrations["NO2"]     # equals 2x
    return Variant(
        template_id="ice.equilibrium.v1",
        seed=seed,
        prompt=(
            "Consider the gas-phase equilibrium\n"
            "N2O4 <-> 2 NO2\n"
            f"with K = {k} at the temperature of the experiment. A vessel is "
            f"charged with {c0} M N2O4 and no NO2. Build an ICE table and find "
            "the equilibrium concentration of NO2. Report in mol/L to 3 "
            "significant figures."
        ),
        key=format_sig_figs(no2, 3),
        node="GEN2.ICE",
        grader="numeric",
        meta={
            "unit": "mol/L", "value": no2, "k": k, "c0": c0, "exact_x": x,
            "sig_figs": 3, "constant_source": _ICE_SOURCE,
            "wrong_paths": [
                {"value": x, "misconception": None,
                 "detail": "That is the extent of reaction x. Each N2O4 that reacts "
                           "makes two NO2, so the NO2 concentration is twice the "
                           "extent."}],
        },
    )


def ver_ice(v: Variant) -> VerifierResult:
    # Independent route: substitute the extent back into the mass action
    # expression through the shared verifier, which shares no code with the
    # SymPy solver, then confirm the reported NO2 is twice that extent.
    problem = _dimer_problem(v.meta["k"], v.meta["c0"])
    substitution = verify_equilibrium_key(problem, v.meta["exact_x"])
    if not substitution.ok:
        return substitution
    if not math.isclose(v.meta["value"], 2.0 * v.meta["exact_x"], rel_tol=1e-9):
        return VerifierResult(False, "ice-substitution", "reported NO2 is not twice the extent")
    return VerifierResult(True, "ice-substitution", substitution.detail)


# ---------------------------------------------------------------------------
# 5. pOH of a strong base  (GEN2.PH)
# ---------------------------------------------------------------------------

def gen_poh_strong_base(seed: int) -> Variant:
    formula, name = _pick(STRONG_BASES, seed)
    exponent = seed % 3                       # 0, 1 or 2
    coefficient = 1 if exponent == 0 else 1 + (seed % 9)
    concentration = coefficient * (10 ** -exponent)  # 1.0 down to 0.01 .. 0.09
    poh = -math.log10(concentration) + 0.0  # + 0.0 normalizes the -0.0 at 1.0 M
    return Variant(
        template_id="poh.strong_base.v1",
        seed=seed,
        prompt=(
            f"What is the pOH of a {concentration:.3g} M solution of {name} "
            f"({formula})? It dissociates completely to give one hydroxide ion "
            "per formula unit. Report pOH to 2 decimal places."
        ),
        key=f"{poh:.2f}",
        node="GEN2.PH",
        grader="numeric",
        meta={
            "unit": "", "value": round(poh, 2), "concentration": concentration,
            "sig_figs": None, "constant_source": _KW_SOURCE,
            "wrong_paths": [
                {"value": round(14.0 - poh, 2), "misconception": "PH-POH",
                 "detail": "That is the pH of this solution, not the pOH. The two "
                           "sum to 14 at 25 C, and a base has a pOH below 7."}],
        },
    )


def ver_poh_strong_base(v: Variant) -> VerifierResult:
    # Invert the logarithm: 10 to the minus pOH must return the hydroxide
    # concentration. The key is rounded to two decimals, so the recovered
    # concentration can differ by about one percent; the tolerance is looser
    # than the key's own precision on purpose.
    recovered = 10 ** (-v.meta["value"])
    if not math.isclose(recovered, v.meta["concentration"], rel_tol=0.03):
        return VerifierResult(False, "inverse-logarithm", f"recovered {recovered:.4g} M")
    if not (0 <= v.meta["value"] <= 14):
        return VerifierResult(False, "inverse-logarithm", "pOH outside the normal range")
    if (14.0 - v.meta["value"]) <= 7.0:
        return VerifierResult(False, "inverse-logarithm", "a strong base should give pH above 7")
    return VerifierResult(True, "inverse-logarithm", f"{recovered:.4g} M recovered")


# ---------------------------------------------------------------------------
# 6. Henderson-Hasselbalch buffer pH  (GEN2.BUFFER)
# ---------------------------------------------------------------------------

def gen_buffer(seed: int) -> Variant:
    pka = round(3.0 + (seed % 7) * 0.5, 2)          # 3.00 .. 6.00
    base = round(0.05 + (seed % 20) / 100.0, 3)     # [A-]
    acid = round(0.05 + (seed % 15) / 100.0, 3)     # [HA]
    ph = pka + math.log10(base / acid)
    return Variant(
        template_id="buffer.henderson.v1",
        seed=seed,
        prompt=(
            f"A buffer is made from a weak acid with pKa = {pka} and its "
            f"conjugate base. The concentrations are [HA] = {acid} M and "
            f"[A-] = {base} M. Using the Henderson-Hasselbalch equation, what is "
            "the pH? Report pH to 2 decimal places."
        ),
        key=f"{ph:.2f}",
        node="GEN2.BUFFER",
        grader="numeric",
        meta={
            "unit": "", "value": round(ph, 2), "pka": pka, "base": base,
            "acid": acid, "sig_figs": None, "constant_source": _HH_SOURCE,
            "wrong_paths": [
                {"value": round(pka + math.log10(acid / base), 2),
                 "misconception": "HH-RATIO-INVERTED",
                 "detail": "The ratio is upside down. Henderson-Hasselbalch takes "
                           "the log of base over acid, so more conjugate base than "
                           "acid must raise the pH above the pKa, not lower it."}],
        },
    )


def ver_buffer(v: Variant) -> VerifierResult:
    # Invert: 10 to the (pH - pKa) must return the base to acid ratio.
    recovered = 10 ** (v.meta["value"] - v.meta["pka"])
    ratio = v.meta["base"] / v.meta["acid"]
    if not math.isclose(recovered, ratio, rel_tol=0.03):
        return VerifierResult(False, "inverse-ratio", f"recovered ratio {recovered:.4g} vs {ratio:.4g}")
    return VerifierResult(True, "inverse-ratio", f"base/acid ratio {ratio:.4g} recovered")


# ---------------------------------------------------------------------------
# 7. standard cell potential  (GEN2.GALVANIC)
# ---------------------------------------------------------------------------

def gen_galvanic(seed: int) -> Variant:
    # Two standard reduction potentials, stated as given data. The cathode is
    # whichever half-reaction has the higher reduction potential.
    p_a = round(-0.80 + (seed % 21) * 0.10, 2)   # -0.80 .. 1.20
    gap = round(0.20 + (seed % 12) * 0.10, 2)    # 0.20 .. 1.30
    p_high = round(p_a + gap, 2)
    p_low = round(p_a, 2)
    e_cell = round(p_high - p_low, 2)
    return Variant(
        template_id="galvanic.cell_potential.v1",
        seed=seed,
        prompt=(
            "A galvanic cell is built from two half-reactions with the given "
            f"standard reduction potentials: E0 = {p_high} V and E0 = {p_low} V. "
            "The cell runs spontaneously under standard conditions. What is the "
            "standard cell potential E0cell? Report in V to 2 decimal places."
        ),
        key=f"{e_cell:.2f}",
        node="GEN2.GALVANIC",
        grader="numeric",
        meta={
            "unit": "V", "value": e_cell, "p_high": p_high, "p_low": p_low,
            "sig_figs": None, "constant_source": _CELL_SOURCE,
            "wrong_paths": [
                {"value": round(p_high + p_low, 2) if (p_high + p_low) != e_cell else None,
                 "misconception": "CELL-ADD-POTENTIALS",
                 "detail": "You added the two potentials. The cell potential is the "
                           "cathode minus the anode, a difference, not a sum."}],
        },
    )


def ver_galvanic(v: Variant) -> VerifierResult:
    # Independent route: the cathode potential is the cell potential added back
    # to the anode potential, and a spontaneous cell must have E0cell positive.
    recovered_high = v.meta["value"] + v.meta["p_low"]
    if not math.isclose(recovered_high, v.meta["p_high"], rel_tol=1e-9, abs_tol=1e-9):
        return VerifierResult(False, "recover-cathode", f"recovered {recovered_high:.4g} V")
    if v.meta["value"] <= 0:
        return VerifierResult(False, "recover-cathode", "a spontaneous cell needs a positive E0cell")
    return VerifierResult(True, "recover-cathode", f"E0cell {v.meta['value']:.2f} V is positive")


# ---------------------------------------------------------------------------
# 8. Nernst equation arithmetic at 298 K  (GEN2.NERNST)
# ---------------------------------------------------------------------------

def gen_nernst(seed: int) -> Variant:
    e0 = round(0.20 + (seed % 18) / 10.0, 2)     # 0.20 .. 1.90 V
    n = 1 + (seed % 3)                            # 1, 2 or 3 electrons
    q_exp = (seed % 5) - 2                        # -2 .. 2, so Q is a power of ten
    q = 10.0 ** q_exp
    e = e0 - (NERNST_SLOPE / n) * q_exp
    return Variant(
        template_id="nernst.cell.v1",
        seed=seed,
        prompt=(
            f"A cell has standard potential E0 = {e0} V and transfers n = {n} "
            f"electrons. At 298 K the reaction quotient is Q = {q:.3g}. Using the "
            "Nernst equation E = E0 - (0.0592/n) log Q, what is the cell "
            "potential E? Report in V to 3 decimal places."
        ),
        key=f"{e:.3f}",
        node="GEN2.NERNST",
        grader="numeric",
        meta={
            "unit": "V", "value": e, "e0": e0, "n": n, "q": q, "q_exp": q_exp,
            "sig_figs": None, "constant_source": _NERNST_SOURCE,
            "wrong_paths": [
                {"value": (e0 - NERNST_SLOPE * q_exp) if n != 1 else None,
                 "misconception": "NERNST-DROP-N",
                 "detail": "The number of electrons was left out. The correction "
                           "term is 0.0592 over n times log Q, so dividing by n "
                           "matters whenever more than one electron is transferred."}],
        },
    )


def ver_nernst(v: Variant) -> VerifierResult:
    # Invert: recover the reaction quotient from the cell potential and require
    # the given Q back.
    e0, e, n = v.meta["e0"], v.meta["value"], v.meta["n"]
    log_q = (e0 - e) * n / NERNST_SLOPE
    recovered_q = 10.0 ** log_q
    if not math.isclose(recovered_q, v.meta["q"], rel_tol=1e-6):
        return VerifierResult(False, "recover-Q", f"recovered Q {recovered_q:.4g} vs {v.meta['q']:.4g}")
    return VerifierResult(True, "recover-Q", f"Q {recovered_q:.4g} recovered from E")


# ---------------------------------------------------------------------------
# 9. Gibbs free energy  (GEN2.GIBBS)
# ---------------------------------------------------------------------------

def gen_gibbs(seed: int) -> Variant:
    dh_kj = round(-100.0 + (seed % 40) * 5.0, 1)    # -100 .. 95 kJ/mol
    ds_j = round(-200.0 + (seed % 20) * 20.0, 1)    # -200 .. 180 J/(mol*K)
    temp = 298 + (seed % 10) * 10                   # 298 .. 388 K
    dg_kj = dh_kj - temp * (ds_j / 1000.0)
    return Variant(
        template_id="gibbs.free_energy.v1",
        seed=seed,
        prompt=(
            f"A reaction has enthalpy change dH = {dh_kj} kJ/mol and entropy "
            f"change dS = {ds_j} J/(mol*K). At T = {temp} K, what is the Gibbs "
            "free energy change dG? Report in kJ/mol to 3 significant figures."
        ),
        key=format_sig_figs(dg_kj, 3),
        node="GEN2.GIBBS",
        grader="numeric",
        meta={
            "unit": "kJ/mol", "value": dg_kj, "dh_kj": dh_kj, "ds_j": ds_j,
            "temp": temp, "sig_figs": 3, "constant_source": _GIBBS_SOURCE,
            "wrong_paths": [
                {"value": (dh_kj - temp * ds_j) if ds_j != 0 else None,
                 "misconception": "GIBBS-ENTROPY-UNITS",
                 "detail": "The entropy is in joules while the enthalpy is in "
                           "kilojoules. Convert dS to kJ, dividing by 1000, before "
                           "subtracting T times dS."}],
        },
    )


def ver_gibbs(v: Variant) -> VerifierResult:
    # Invert: adding T dS back to dG must return the enthalpy change, with dS
    # carried through the same joule to kilojoule conversion the prompt states.
    recovered_dh = v.meta["value"] + v.meta["temp"] * (v.meta["ds_j"] / 1000.0)
    if not math.isclose(recovered_dh, v.meta["dh_kj"], rel_tol=1e-9, abs_tol=1e-9):
        return VerifierResult(False, "recover-dH", f"recovered dH {recovered_dh:.6g} kJ/mol")
    return VerifierResult(True, "recover-dH", f"dH {recovered_dh:.4g} kJ/mol recovered")


# ---------------------------------------------------------------------------
# 10. nuclear decay, fraction remaining after n half-lives  (GEN2.NUCLEARSTABILITY)
# ---------------------------------------------------------------------------

def gen_nuclear_decay(seed: int) -> Variant:
    n0 = round(10.0 + (seed % 90), 1)     # 10.0 .. 99.0 mg
    halflives = 1 + (seed % 6)            # 1 .. 6 half-lives
    remaining = n0 * (0.5 ** halflives)
    return Variant(
        template_id="nuclear.decay.v1",
        seed=seed,
        prompt=(
            f"A sample of a radioisotope initially contains {n0} mg. After "
            f"{halflives} half-lives, how many milligrams remain? Assume simple "
            "radioactive decay. Report in mg to 3 significant figures."
        ),
        key=format_sig_figs(remaining, 3),
        node="GEN2.NUCLEARSTABILITY",
        grader="numeric",
        meta={
            "unit": "mg", "value": remaining, "n0": n0, "halflives": halflives,
            "sig_figs": 3, "constant_source": _DECAY_SOURCE,
            "wrong_paths": [
                {"value": 0.5 * n0 if halflives != 1 else None,
                 "misconception": "DECAY-HALVE-ONCE",
                 "detail": "You halved the sample only once. Each half-life halves "
                           "what is left again, so after n half-lives the fraction "
                           "remaining is one half to the power n."}],
        },
    )


def ver_nuclear_decay(v: Variant) -> VerifierResult:
    # Independent route: doubling the remaining amount once per half-life must
    # rebuild the original sample, and the remainder must be a positive fraction
    # of what was there.
    rebuilt = v.meta["value"] * (2.0 ** v.meta["halflives"])
    if not math.isclose(rebuilt, v.meta["n0"], rel_tol=1e-9):
        return VerifierResult(False, "rebuild-sample", f"rebuilt {rebuilt:.6g} mg from {v.meta['n0']} mg")
    if not (0.0 < v.meta["value"] < v.meta["n0"]):
        return VerifierResult(False, "rebuild-sample", "remaining amount is not a positive fraction")
    return VerifierResult(True, "rebuild-sample", f"{v.meta['n0']} mg rebuilt by doubling")


# ---------------------------------------------------------------------------
# Registry, hints and misconceptions for this module.
# ---------------------------------------------------------------------------

TEMPLATES_G2: dict[str, dict[str, object]] = {
    "rate.halflife.v1": {"gen": gen_halflife, "ver": ver_halflife, "node": "GEN2.RATES", "grader": "numeric"},
    "ratelaw.order.v1": {"gen": gen_ratelaw_order, "ver": ver_ratelaw_order, "node": "GEN2.RATELAW", "grader": "mc"},
    "arrhenius.two_temp.v1": {"gen": gen_arrhenius, "ver": ver_arrhenius, "node": "GEN2.ARRHENIUS", "grader": "numeric"},
    "ice.equilibrium.v1": {"gen": gen_ice, "ver": ver_ice, "node": "GEN2.ICE", "grader": "numeric"},
    "poh.strong_base.v1": {"gen": gen_poh_strong_base, "ver": ver_poh_strong_base, "node": "GEN2.PH", "grader": "numeric"},
    "buffer.henderson.v1": {"gen": gen_buffer, "ver": ver_buffer, "node": "GEN2.BUFFER", "grader": "numeric"},
    "galvanic.cell_potential.v1": {"gen": gen_galvanic, "ver": ver_galvanic, "node": "GEN2.GALVANIC", "grader": "numeric"},
    "nernst.cell.v1": {"gen": gen_nernst, "ver": ver_nernst, "node": "GEN2.NERNST", "grader": "numeric"},
    "gibbs.free_energy.v1": {"gen": gen_gibbs, "ver": ver_gibbs, "node": "GEN2.GIBBS", "grader": "numeric"},
    "nuclear.decay.v1": {"gen": gen_nuclear_decay, "ver": ver_nuclear_decay, "node": "GEN2.NUCLEARSTABILITY", "grader": "numeric"},
}


HINTS_G2: dict[str, tuple[str, str, str]] = {
    "rate.halflife.v1": (
        "You are asked for the half-life of a first-order reaction, the time it "
        "takes for the reactant to fall to half of what it started at.",
        "For a first-order reaction the half-life depends only on the rate "
        "constant, not on the starting amount, and the two are tied together by "
        "a factor of ln 2. Rearrange for the time.",
        "Write down ln 2 as a number, a little under 0.7, and stop before "
        "dividing.",
    ),
    "ratelaw.order.v1": (
        "You are asked for the order of the reaction in A: the power of [A] that "
        "appears in the rate law, read from the experiments, not from the "
        "equation.",
        "Compare the two experiments. See how many times the concentration was "
        "multiplied, and how many times the rate changed in response. The order "
        "is the exponent that connects those two factors.",
        "Divide the second concentration by the first, and separately divide the "
        "second rate by the first, and stop before comparing them.",
    ),
    "arrhenius.two_temp.v1": (
        "You are asked how much the rate constant changes when the temperature "
        "is raised, given the activation energy.",
        "The two-point form of the Arrhenius equation relates the ratio of the "
        "rate constants to the activation energy and the two temperatures. "
        "Keep the activation energy in joules to match R.",
        "Compute one over the lower temperature minus one over the higher "
        "temperature, and stop there.",
    ),
    "ice.equilibrium.v1": (
        "You are asked for the equilibrium concentration of NO2 that forms when "
        "N2O4 dissociates, given the equilibrium constant.",
        "Set up an ICE table with the extent of reaction as one unknown, write "
        "the mass action expression, and solve for that extent. Remember two NO2 "
        "form for each N2O4 that reacts.",
        "Write the change row of the ICE table in terms of x, using minus x for "
        "N2O4 and plus two x for NO2, and stop there.",
    ),
    "poh.strong_base.v1": (
        "You are asked for the pOH of a strong base solution.",
        "A strong base dissociates completely, so the hydroxide concentration "
        "equals the base concentration. pOH is the negative base ten logarithm "
        "of that.",
        "Write down the hydroxide ion concentration, which for a strong base "
        "you can read straight off the label.",
    ),
    "buffer.henderson.v1": (
        "You are asked for the pH of a buffer from its pKa and the amounts of "
        "acid and conjugate base.",
        "The Henderson-Hasselbalch equation adds the log of the base to acid "
        "ratio onto the pKa. More conjugate base than acid pushes the pH above "
        "the pKa.",
        "Form the ratio of conjugate base to acid, and stop before taking its "
        "logarithm.",
    ),
    "galvanic.cell_potential.v1": (
        "You are asked for the standard potential of a cell built from two "
        "half-reactions.",
        "The cell potential is the reduction potential of the cathode minus the "
        "reduction potential of the anode. The cathode is the half-reaction with "
        "the higher reduction potential, which keeps the cell potential positive.",
        "Decide which of the two given potentials is the larger, and stop before "
        "subtracting.",
    ),
    "nernst.cell.v1": (
        "You are asked for the cell potential away from standard conditions, "
        "given the standard potential and the reaction quotient.",
        "The Nernst equation subtracts a correction from the standard potential. "
        "The correction is 0.0592 over the number of electrons, times the log of "
        "the reaction quotient, at 298 K.",
        "Take the base ten logarithm of the reaction quotient first, and stop "
        "there.",
    ),
    "gibbs.free_energy.v1": (
        "You are asked for the Gibbs free energy change from the enthalpy "
        "change, the entropy change and the temperature.",
        "Gibbs free energy is the enthalpy change minus the temperature times "
        "the entropy change. The one trap is units: the entropy is in joules "
        "while the enthalpy is in kilojoules.",
        "Convert the entropy change from joules to kilojoules by dividing by "
        "1000, and stop before multiplying by the temperature.",
    ),
    "nuclear.decay.v1": (
        "You are asked how much of a radioactive sample is left after a whole "
        "number of half-lives.",
        "Each half-life leaves half of what was present at its start, so the "
        "fraction remaining after n half-lives is one half multiplied by itself "
        "n times.",
        "Raise one half to the power of the number of half-lives, and stop "
        "before multiplying by the starting amount.",
    ),
}


# New misconceptions for the GEN2 distractors and wrong paths. Each routes to a
# GEN2 node that has an authored lesson, and each stays review "pending" like
# every other entry in the library. On sources: these beliefs are familiar from
# teaching general chemistry but have not been traced to a specific published
# study, and the honest thing is to record that in the source field rather than
# attach a citation that was not checked.
_INSTRUCTOR_SOURCE = "Instructor observation; not traced to a published study"

MISCONCEPTIONS_G2: dict[str, Misconception] = {
    "RATE-ORDER-ZERO-ASSUMED": Misconception(
        code="RATE-ORDER-ZERO-ASSUMED",
        name="The rate does not depend on concentration",
        description=(
            "The learner treats the reaction as zero order, so changing the "
            "concentration is expected to leave the rate unchanged, ignoring "
            "that the data show the rate moving with concentration."
        ),
        counterexample=(
            "In these experiments doubling the concentration changed the rate. A "
            "zero order reaction would have shown the same rate at both "
            "concentrations."
        ),
        routes_to="GEN2.RATELAW",
        source=_INSTRUCTOR_SOURCE,
        review="pending",
    ),
    "RATE-ORDER-ASSUME-FIRST": Misconception(
        code="RATE-ORDER-ASSUME-FIRST",
        name="Rate is always proportional to concentration",
        description=(
            "The learner assumes first order by default, so the rate is taken to "
            "scale directly with the concentration whatever the data say."
        ),
        counterexample=(
            "Here doubling the concentration more than doubled the rate. First "
            "order would have doubled it exactly; the larger jump means a higher "
            "order."
        ),
        routes_to="GEN2.RATELAW",
        source=_INSTRUCTOR_SOURCE,
        review="pending",
    ),
    "RATE-ORDER-FROM-COEFFICIENTS": Misconception(
        code="RATE-ORDER-FROM-COEFFICIENTS",
        name="Reaction order is read from the balanced equation",
        description=(
            "The learner takes the order in a species from its stoichiometric "
            "coefficient in the overall equation rather than from experiment."
        ),
        counterexample=(
            "The equation shows 2 A, but the order in A is whatever the rate data "
            "give, which need not be two. Order is measured, not read off "
            "coefficients, unless the step is elementary."
        ),
        routes_to="GEN2.RATELAW",
        source=_INSTRUCTOR_SOURCE,
        review="pending",
    ),
    "HALFLIFE-NO-LN2": Misconception(
        code="HALFLIFE-NO-LN2",
        name="The first-order half-life is one over k",
        description=(
            "The learner drops the factor of ln 2, so the half-life is taken as "
            "the reciprocal of the rate constant."
        ),
        counterexample=(
            "One over k is the time for the reactant to fall to about 37 percent, "
            "the value of one over e, not to 50 percent. The half-life is ln 2 "
            "over k, a little under seventy percent of that."
        ),
        routes_to="GEN2.RATES",
        source=_INSTRUCTOR_SOURCE,
        review="pending",
    ),
    "ARRHENIUS-SIGN": Misconception(
        code="ARRHENIUS-SIGN",
        name="Raising the temperature slows the reaction",
        description=(
            "The learner puts the temperature term in the Arrhenius expression "
            "with the wrong sign, so the rate constant comes out falling as the "
            "temperature rises."
        ),
        counterexample=(
            "Warming a reaction speeds it up, so the rate constant at the higher "
            "temperature must be the larger of the two. A result that fell has "
            "the exponent's sign reversed."
        ),
        routes_to="GEN2.ARRHENIUS",
        source=_INSTRUCTOR_SOURCE,
        review="pending",
    ),
    "HH-RATIO-INVERTED": Misconception(
        code="HH-RATIO-INVERTED",
        name="The buffer ratio is taken as acid over base",
        description=(
            "The learner writes the Henderson-Hasselbalch ratio upside down, "
            "putting the acid on top, so adding conjugate base is seen to lower "
            "the pH."
        ),
        counterexample=(
            "More conjugate base than acid makes a solution less acidic, so the "
            "pH rises above the pKa. The log is of base over acid, which gives "
            "that rise."
        ),
        routes_to="GEN2.BUFFER",
        source=_INSTRUCTOR_SOURCE,
        review="pending",
    ),
    "CELL-ADD-POTENTIALS": Misconception(
        code="CELL-ADD-POTENTIALS",
        name="The cell potential is the sum of the electrode potentials",
        description=(
            "The learner adds the two standard reduction potentials rather than "
            "subtracting the anode from the cathode."
        ),
        counterexample=(
            "The cell potential is a difference, cathode minus anode. Adding the "
            "two reduction potentials double counts a reference that cancels in "
            "the difference."
        ),
        routes_to="GEN2.GALVANIC",
        source=_INSTRUCTOR_SOURCE,
        review="pending",
    ),
    "NERNST-DROP-N": Misconception(
        code="NERNST-DROP-N",
        name="The Nernst correction ignores the electron count",
        description=(
            "The learner leaves the number of electrons out of the Nernst "
            "equation, using 0.0592 times log Q instead of 0.0592 over n times "
            "log Q."
        ),
        counterexample=(
            "A two electron cell divides the 0.0592 term by two. Dropping the n "
            "overstates how far the potential moves from standard."
        ),
        routes_to="GEN2.NERNST",
        source=_INSTRUCTOR_SOURCE,
        review="pending",
    ),
    "GIBBS-ENTROPY-UNITS": Misconception(
        code="GIBBS-ENTROPY-UNITS",
        name="Enthalpy and entropy are combined without matching units",
        description=(
            "The learner subtracts T times the entropy change in joules from an "
            "enthalpy change in kilojoules, without converting one to match the "
            "other."
        ),
        counterexample=(
            "An entropy change of 100 J/(mol*K) is 0.1 kJ/(mol*K). Times 300 K "
            "that is 30 kJ/mol, not 30000. The joule and kilojoule have to be "
            "reconciled first."
        ),
        routes_to="GEN2.GIBBS",
        source=_INSTRUCTOR_SOURCE,
        review="pending",
    ),
    "DECAY-HALVE-ONCE": Misconception(
        code="DECAY-HALVE-ONCE",
        name="Decay halves the sample only once",
        description=(
            "The learner halves the starting amount a single time regardless of "
            "how many half-lives have passed, rather than halving again for each "
            "one."
        ),
        counterexample=(
            "After two half-lives a quarter remains, not a half. Each half-life "
            "acts on what is left from the previous one, so the fraction is one "
            "half to the power of the number of half-lives."
        ),
        routes_to="GEN2.NUCLEARSTABILITY",
        source=_INSTRUCTOR_SOURCE,
        review="pending",
    ),
}
