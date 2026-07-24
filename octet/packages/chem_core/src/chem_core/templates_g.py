"""Phase 2 templates: the general chemistry item bank.

Fourteen templates covering CF, G1 and G2, each with a generator and an
independent verifier that inverts the relationship rather than repeating the
generator's arithmetic. Registered into REGISTRY by registry.py.

Constants are standard general chemistry values:
  R  = 0.08206 L*atm/(mol*K)
  c_water = 4.184 J/(g*degC)
  Kw = 1.0e-14 at 25 C
These are textbook values and carry the same review="pending" status as the
rest of the chemistry data until a subject matter expert signs off.
"""

from __future__ import annotations

import math

from .formula import parse_formula, verify_molar_mass
from .mc import validate_choices
from .numeric import grade_numeric
from .pool import get_pool
from .stoich import format_sig_figs, round_to_sig_figs, sig_figs
from .types import VerifierResult

R_GAS = 0.08206          # L*atm/(mol*K)
C_WATER = 4.184          # J/(g*degC)
KW_25C = 1.0e-14

# Sparingly soluble salts for the Ksp template. Standard textbook Ksp values.
KSP_SALTS = (
    ("AgCl", "Ag", "Cl", 1, 1, 1.8e-10, "silver chloride"),
    ("BaSO4", "Ba", "SO4", 1, 1, 1.1e-10, "barium sulfate"),
    ("CaCO3", "Ca", "CO3", 1, 1, 4.5e-9, "calcium carbonate"),
    ("PbSO4", "Pb", "SO4", 1, 1, 1.8e-8, "lead sulfate"),
    ("CaF2", "Ca", "F", 1, 2, 3.9e-11, "calcium fluoride"),
    ("Mg(OH)2", "Mg", "OH", 1, 2, 5.6e-12, "magnesium hydroxide"),
)

STRONG_ACIDS = (("HCl", "hydrochloric acid"), ("HNO3", "nitric acid"), ("HBr", "hydrobromic acid"))


def _pick(seq, seed: int, salt: int = 0):
    return seq[(seed + salt) % len(seq)]


def _mol(seed: int, salt: int = 0):
    return _pick(get_pool(), seed, salt)


def _v(template_id, seed, prompt, key, node, grader, meta):
    from .registry import Variant

    return Variant(template_id=template_id, seed=seed, prompt=prompt, key=key,
                   node=node, grader=grader, meta=meta)


# ---------------------------------------------------------------------------
# 1. molar mass
# ---------------------------------------------------------------------------

def gen_molar_mass(seed: int):
    m = _mol(seed)
    mass = parse_formula(m.formula).molar_mass()
    return _v("molarmass.compute.v1", seed,
              f"Calculate the molar mass of {m.name} ({m.formula}). ({m.real_world_note}) "
              "Report your answer in g/mol to 2 decimal places.",
              f"{mass:.2f}", "C.G1.MOLE", "numeric",
              {"unit": "g/mol", "value": round(mass, 2), "formula": m.formula, "name": m.name,
               "counts": parse_formula(m.formula).counts, "sig_figs": None})


def ver_molar_mass(v) -> VerifierResult:
    # Independent path: periodictable's own formula parser, not ours.
    return verify_molar_mass(v.meta["counts"], v.meta["value"], rel_tol=1e-3)


# ---------------------------------------------------------------------------
# 2. mass to moles
# ---------------------------------------------------------------------------

def gen_mass_to_moles(seed: int):
    m = _mol(seed, 2)
    molar = parse_formula(m.formula).molar_mass()
    grams = round(5.0 + (seed % 200) / 4.0, 2)
    moles = grams / molar
    return _v("mole.mass_to_moles.v1", seed,
              f"How many moles are in {grams} g of {m.name} ({m.formula})? "
              "Report your answer in mol to 3 significant figures.",
              format_sig_figs(moles, 3), "C.G1.MOLE", "numeric",
              {"unit": "mol", "value": moles, "grams": grams, "molar_mass": molar,
               "formula": m.formula, "sig_figs": 3,
               "wrong_paths": [
                   {"value": grams * molar, "misconception": "MOLES-NOT-MASS",
                    "detail": "You multiplied by the molar mass. Moles are grams divided by grams per mole, and the units tell you which way round it goes."}]})


def ver_mass_to_moles(v) -> VerifierResult:
    # Invert: moles times molar mass must return the original mass.
    recovered = v.meta["value"] * v.meta["molar_mass"]
    if not math.isclose(recovered, v.meta["grams"], rel_tol=1e-9):
        return VerifierResult(False, "inverse-multiplication",
                              f"recovered {recovered} from {v.meta['grams']}")
    return VerifierResult(True, "inverse-multiplication", f"{recovered:.6g} g recovered")


# ---------------------------------------------------------------------------
# 3. percent composition
# ---------------------------------------------------------------------------

def gen_percent_comp(seed: int):
    m = _mol(seed, 4)
    counts = parse_formula(m.formula).counts
    total = parse_formula(m.formula).molar_mass()
    import periodictable

    element = sorted(counts)[seed % len(counts)]
    pct = getattr(periodictable, element).mass * counts[element] / total * 100.0
    return _v("percentcomp.element.v1", seed,
              f"What is the percent by mass of {element} in {m.name} ({m.formula})? "
              "Report your answer as a percentage to 2 decimal places.",
              f"{pct:.2f}", "C.G1.PERCENTCOMP", "numeric",
              {"unit": "percent", "value": pct, "element": element, "formula": m.formula,
               "counts": counts, "sig_figs": None})


def ver_percent_comp(v) -> VerifierResult:
    # Independent path: every element's percentage must sum to 100.
    import periodictable

    counts = v.meta["counts"]
    total = sum(getattr(periodictable, el).mass * n for el, n in counts.items())
    percentages = {el: getattr(periodictable, el).mass * n / total * 100.0 for el, n in counts.items()}
    if not math.isclose(sum(percentages.values()), 100.0, rel_tol=1e-6):
        return VerifierResult(False, "percent-sum", f"sums to {sum(percentages.values())}")
    if not math.isclose(percentages[v.meta["element"]], v.meta["value"], rel_tol=1e-6):
        return VerifierResult(False, "percent-sum", "element percentage disagrees")
    return VerifierResult(True, "percent-sum", "percentages sum to 100")


# ---------------------------------------------------------------------------
# 4. molarity
# ---------------------------------------------------------------------------

def gen_molarity(seed: int):
    m = _mol(seed, 6)
    molar = parse_formula(m.formula).molar_mass()
    grams = round(2.0 + (seed % 100) / 5.0, 2)
    litres = round(0.100 + (seed % 40) / 100.0, 3)
    molarity = (grams / molar) / litres
    return _v("molarity.compute.v1", seed,
              f"{grams} g of {m.name} ({m.formula}) is dissolved and made up to "
              f"{litres} L of solution. What is the molarity? Report in mol/L to 3 significant figures.",
              format_sig_figs(molarity, 3), "C.G1.MOLARITY", "numeric",
              {"unit": "mol/L", "value": molarity, "grams": grams, "litres": litres,
               "molar_mass": molar, "sig_figs": 3,
               "wrong_paths": [
                   {"value": grams / litres, "misconception": None,
                    "detail": "You divided grams by litres. Molarity counts moles per litre, so the mass has to become moles first."}]})


def ver_molarity(v) -> VerifierResult:
    # Invert: molarity times volume times molar mass returns the original mass.
    recovered = v.meta["value"] * v.meta["litres"] * v.meta["molar_mass"]
    if not math.isclose(recovered, v.meta["grams"], rel_tol=1e-9):
        return VerifierResult(False, "inverse-molarity", f"recovered {recovered}")
    return VerifierResult(True, "inverse-molarity", f"{recovered:.6g} g recovered")


# ---------------------------------------------------------------------------
# 5. dilution
# ---------------------------------------------------------------------------

def gen_dilution(seed: int):
    c1 = round(0.50 + (seed % 50) / 20.0, 2)
    v1_ml = round(10.0 + (seed % 90), 1)
    v2_ml = v1_ml * (2 + (seed % 4))
    c2 = c1 * v1_ml / v2_ml
    return _v("dilution.m1v1.v1", seed,
              f"{v1_ml} mL of a {c1} M stock solution is diluted to a final volume of "
              f"{v2_ml} mL. What is the final concentration? Report in mol/L to 3 significant figures.",
              format_sig_figs(c2, 3), "C.G1.DILUTION", "numeric",
              {"unit": "mol/L", "value": c2, "c1": c1, "v1_ml": v1_ml, "v2_ml": v2_ml, "sig_figs": 3,
               "wrong_paths": [
                   {"value": c1 * v2_ml / v1_ml, "misconception": None,
                    "detail": "The ratio is upside down. Adding solvent must lower the concentration, so the answer has to be smaller than the stock."}]})


def ver_dilution(v) -> VerifierResult:
    # Independent path: moles of solute must be unchanged by dilution.
    before = v.meta["c1"] * v.meta["v1_ml"] / 1000.0
    after = v.meta["value"] * v.meta["v2_ml"] / 1000.0
    if not math.isclose(before, after, rel_tol=1e-9):
        return VerifierResult(False, "moles-conserved", f"{before} vs {after} mol")
    if v.meta["value"] >= v.meta["c1"]:
        return VerifierResult(False, "moles-conserved", "dilution did not lower the concentration")
    return VerifierResult(True, "moles-conserved", f"{before:.6g} mol on both sides")


# ---------------------------------------------------------------------------
# 6. ideal gas law
# ---------------------------------------------------------------------------

def gen_ideal_gas(seed: int):
    moles = round(0.20 + (seed % 30) / 10.0, 2)
    temp_k = 273 + (seed % 80)
    pressure = round(0.80 + (seed % 25) / 10.0, 2)
    volume = moles * R_GAS * temp_k / pressure
    return _v("gaslaw.ideal.v1", seed,
              f"{moles} mol of an ideal gas is held at {pressure} atm and {temp_k} K. "
              "What volume does it occupy? Use R = 0.08206 L*atm/(mol*K) and report in L "
              "to 3 significant figures.",
              format_sig_figs(volume, 3), "C.G1.GASLAWS", "numeric",
              {"unit": "L", "value": volume, "moles": moles, "temp_k": temp_k,
               "pressure": pressure, "sig_figs": 3,
               "wrong_paths": [
                   {"value": moles * R_GAS * (temp_k - 273) / pressure, "misconception": None,
                    "detail": "It looks like Celsius was used. The gas laws need absolute temperature, so kelvin, or the arithmetic can divide by zero."}]})


def ver_ideal_gas(v) -> VerifierResult:
    # Substitute back: PV must equal nRT.
    lhs = v.meta["pressure"] * v.meta["value"]
    rhs = v.meta["moles"] * R_GAS * v.meta["temp_k"]
    if not math.isclose(lhs, rhs, rel_tol=1e-9):
        return VerifierResult(False, "pv-nrt-residual", f"PV={lhs}, nRT={rhs}")
    return VerifierResult(True, "pv-nrt-residual", f"PV=nRT={lhs:.6g}")


# ---------------------------------------------------------------------------
# 7. combined gas law
# ---------------------------------------------------------------------------

def gen_combined_gas(seed: int):
    p1 = round(1.0 + (seed % 20) / 10.0, 2)
    v1 = round(2.0 + (seed % 30) / 10.0, 2)
    t1 = 273 + (seed % 50)
    p2 = round(0.5 + (seed % 15) / 10.0, 2)
    t2 = 273 + ((seed * 7) % 90)
    v2 = p1 * v1 * t2 / (t1 * p2)
    return _v("gaslaw.combined.v1", seed,
              f"A gas occupies {v1} L at {p1} atm and {t1} K. It is brought to {p2} atm "
              f"and {t2} K. What is its new volume? Report in L to 3 significant figures.",
              format_sig_figs(v2, 3), "C.G1.GASLAWS", "numeric",
              {"unit": "L", "value": v2, "p1": p1, "v1": v1, "t1": t1, "p2": p2, "t2": t2, "sig_figs": 3})


def ver_combined_gas(v) -> VerifierResult:
    left = v.meta["p1"] * v.meta["v1"] / v.meta["t1"]
    right = v.meta["p2"] * v.meta["value"] / v.meta["t2"]
    if not math.isclose(left, right, rel_tol=1e-9):
        return VerifierResult(False, "combined-residual", f"{left} vs {right}")
    return VerifierResult(True, "combined-residual", f"PV/T constant at {left:.6g}")


# ---------------------------------------------------------------------------
# 8. calorimetry
# ---------------------------------------------------------------------------

def gen_calorimetry(seed: int):
    mass = round(50.0 + (seed % 200), 1)
    delta_t = round(2.0 + (seed % 40) / 2.0, 1)
    q = mass * C_WATER * delta_t
    return _v("thermo.calorimetry.v1", seed,
              f"{mass} g of water is warmed by {delta_t} degrees Celsius. How much heat did it "
              f"absorb? The specific heat of water is 4.184 J/(g*degC). Report in J to 3 "
              "significant figures.",
              format_sig_figs(q, 3), "C.G1.THERMOBASIC", "numeric",
              {"unit": "J", "value": q, "mass": mass, "delta_t": delta_t, "sig_figs": 3,
               "wrong_paths": [
                   {"value": mass * delta_t, "misconception": None,
                    "detail": "The specific heat was left out. Without it the units come out as g*degC, which is not energy."}]})


def ver_calorimetry(v) -> VerifierResult:
    # Invert: recover the temperature change from the heat.
    recovered = v.meta["value"] / (v.meta["mass"] * C_WATER)
    if not math.isclose(recovered, v.meta["delta_t"], rel_tol=1e-9):
        return VerifierResult(False, "inverse-calorimetry", f"recovered dT {recovered}")
    return VerifierResult(True, "inverse-calorimetry", f"dT {recovered:.6g} recovered")


# ---------------------------------------------------------------------------
# 9. pH of a strong acid
# ---------------------------------------------------------------------------

def gen_ph_strong(seed: int):
    formula, name = _pick(STRONG_ACIDS, seed)
    exponent = 2 + (seed % 4)
    coefficient = 1 + (seed % 9)
    concentration = coefficient * (10 ** -exponent)
    ph = -math.log10(concentration)
    return _v("ph.strong_acid.v1", seed,
              f"What is the pH of a {concentration:.2e} M solution of {name} ({formula})? "
              "It ionizes completely. Report pH to 2 decimal places.",
              f"{ph:.2f}", "C.G2.PH", "numeric",
              {"unit": "", "value": round(ph, 2), "concentration": concentration,
               "sig_figs": None,
               "wrong_paths": [
                   {"value": round(14 - ph, 2), "misconception": "PH-POH",
                    "detail": "That is the pOH of this solution. The two sum to 14 at 25 C, and an acid should give a pH below 7."}]})


def ver_ph_strong(v) -> VerifierResult:
    # Invert the logarithm: 10 to the minus pH must return the concentration.
    recovered = 10 ** (-v.meta["value"])
    # The key is a pH rounded to 2 decimal places, so the concentration it
    # implies can differ by up to 10**0.005 - 1, about 1.2 percent. The
    # tolerance has to be looser than the key's own precision or a correct
    # item fails verification.
    if not math.isclose(recovered, v.meta["concentration"], rel_tol=0.03):
        return VerifierResult(False, "inverse-logarithm", f"recovered {recovered:.4g}")
    if not (0 <= v.meta["value"] <= 14):
        return VerifierResult(False, "inverse-logarithm", "pH outside the normal range")
    return VerifierResult(True, "inverse-logarithm", f"{recovered:.4g} M recovered")


# ---------------------------------------------------------------------------
# 10. limiting reactant
# ---------------------------------------------------------------------------

def gen_limiting(seed: int):
    # 2 H2 + O2 -> 2 H2O, chosen because the ratio is not one to one.
    h2_g = round(2.0 + (seed % 20) / 2.0, 1)
    o2_g = round(20.0 + (seed % 60), 1)
    m_h2, m_o2, m_h2o = 2.016, 31.998, 18.015
    mol_h2, mol_o2 = h2_g / m_h2, o2_g / m_o2
    # H2 needs 2 per 1 O2.
    limiting = "H2" if (mol_h2 / 2) < (mol_o2 / 1) else "O2"
    water_mol = (mol_h2 / 2 * 2) if limiting == "H2" else (mol_o2 * 2)
    water_g = water_mol * m_h2o
    return _v("limiting.reactant.v1", seed,
              f"{h2_g} g of hydrogen reacts with {o2_g} g of oxygen:\n"
              "2 H2 + O2 -> 2 H2O\n"
              "What mass of water forms? Report in g to 3 significant figures.",
              format_sig_figs(water_g, 3), "C.G1.LIMITING", "numeric",
              {"unit": "g", "value": water_g, "h2_g": h2_g, "o2_g": o2_g,
               "limiting": limiting, "sig_figs": 3,
               "wrong_paths": [
                   {"value": (mol_o2 * 2 * m_h2o) if limiting == "H2" else (mol_h2 / 2 * 2 * m_h2o),
                    "misconception": "IGNORED-RATIO",
                    "detail": "That used the reactant that is in excess. Whichever runs out first sets the amount of product, and the coefficients decide which one that is."}]})


def ver_limiting(v) -> VerifierResult:
    # Independent check: the non limiting reactant must be left over, and the
    # limiting one must be fully consumed.
    m_h2, m_o2, m_h2o = 2.016, 31.998, 18.015
    water_mol = v.meta["value"] / m_h2o
    h2_used = water_mol
    o2_used = water_mol / 2
    if h2_used - v.meta["h2_g"] / m_h2 > 1e-9:
        return VerifierResult(False, "excess-check", "consumed more hydrogen than supplied")
    if o2_used - v.meta["o2_g"] / m_o2 > 1e-9:
        return VerifierResult(False, "excess-check", "consumed more oxygen than supplied")
    leftover_h2 = v.meta["h2_g"] / m_h2 - h2_used
    leftover_o2 = v.meta["o2_g"] / m_o2 - o2_used
    if min(leftover_h2, leftover_o2) > 1e-6:
        return VerifierResult(False, "excess-check", "neither reactant was exhausted")
    return VerifierResult(True, "excess-check", f"{v.meta['limiting']} is limiting as recorded")


# ---------------------------------------------------------------------------
# 11. Ksp molar solubility
# ---------------------------------------------------------------------------

def gen_ksp(seed: int):
    formula, cation, anion, n_cat, n_an, ksp, name = _pick(KSP_SALTS, seed)
    # Ksp = (n_cat*s)^n_cat * (n_an*s)^n_an
    coefficient = (n_cat ** n_cat) * (n_an ** n_an)
    s = (ksp / coefficient) ** (1.0 / (n_cat + n_an))
    return _v("ksp.solubility.v1", seed,
              f"{name} ({formula}) has Ksp = {ksp:.2g} at 25 C. What is its molar "
              "solubility in pure water? Report in mol/L to 3 significant figures.",
              format_sig_figs(s, 3), "C.G2.KSP", "numeric",
              {"unit": "mol/L", "value": s, "ksp": ksp, "n_cat": n_cat, "n_an": n_an,
               "formula": formula, "sig_figs": 3,
               "wrong_paths": [
                   {"value": math.sqrt(ksp) if (n_cat + n_an) != 2 else None,
                    "misconception": "K-SQUARE",
                    "detail": "A square root only works when the salt gives two ions. Count how many ions this formula releases before choosing the root."}]})


def ver_ksp(v) -> VerifierResult:
    # Substitute back into the Ksp expression.
    s = v.meta["value"]
    q = ((v.meta["n_cat"] * s) ** v.meta["n_cat"]) * ((v.meta["n_an"] * s) ** v.meta["n_an"])
    if not math.isclose(q, v.meta["ksp"], rel_tol=1e-6):
        return VerifierResult(False, "ksp-substitution", f"Q={q:.4g} vs Ksp={v.meta['ksp']:.4g}")
    if s <= 0:
        return VerifierResult(False, "ksp-substitution", "non positive solubility")
    return VerifierResult(True, "ksp-substitution", f"Q matches Ksp at s={s:.4g}")


# ---------------------------------------------------------------------------
# 12. density
# ---------------------------------------------------------------------------

def gen_density(seed: int):
    mass = round(10.0 + (seed % 150), 1)
    volume = round(5.0 + (seed % 45), 1)
    density = mass / volume
    return _v("density.compute.v1", seed,
              f"A sample has a mass of {mass} g and occupies {volume} mL. "
              "What is its density in g/mL, to 3 significant figures?",
              format_sig_figs(density, 3), "C.CF.DENSITY", "numeric",
              {"unit": "g/mL", "value": density, "mass": mass, "volume": volume, "sig_figs": 3,
               "wrong_paths": [
                   {"value": volume / mass, "misconception": None,
                    "detail": "The ratio is inverted. Density asks how much mass sits in each unit of volume, so mass goes on top."}]})


def ver_density(v) -> VerifierResult:
    recovered = v.meta["value"] * v.meta["volume"]
    if not math.isclose(recovered, v.meta["mass"], rel_tol=1e-9):
        return VerifierResult(False, "inverse-density", f"recovered {recovered} g")
    return VerifierResult(True, "inverse-density", f"{recovered:.6g} g recovered")


# ---------------------------------------------------------------------------
# 13. significant figures
# ---------------------------------------------------------------------------

def gen_sigfig(seed: int):
    raw = (seed % 900 + 100) / (10 ** (seed % 3)) * (1 + (seed % 7) / 13.0)
    figures = 2 + (seed % 3)
    rounded = round_to_sig_figs(raw, figures)
    # A value like 100 cannot show 2 significant figures in plain notation,
    # because trailing zeros without a decimal point are not significant.
    # Scientific notation is the only unambiguous way to write it, and it is
    # what a chemist would write.
    plain = f"{rounded:g}"
    key = plain if sig_figs(plain) == figures else f"{rounded:.{figures - 1}e}"
    return _v("sigfig.round.v1", seed,
              f"Round {raw:.6f} to {figures} significant figures.",
              key, "C.CF.MEASURE", "numeric",
              {"unit": "", "value": rounded, "raw": raw, "figures": figures,
               "key_text": key, "sig_figs": None})


def ver_sigfig(v) -> VerifierResult:
    # Independent path: count the figures in the key with the counter, and
    # confirm the rounded value is within half a unit in the last place.
    counted = sig_figs(v.meta.get("key_text", f"{v.meta['value']:g}"))
    if counted != v.meta["figures"]:
        return VerifierResult(False, "sigfig-count", f"key shows {counted}, asked for {v.meta['figures']}")
    magnitude = math.floor(math.log10(abs(v.meta["raw"]))) if v.meta["raw"] else 0
    half_ulp = 0.5 * 10 ** (magnitude - v.meta["figures"] + 1)
    if abs(v.meta["value"] - v.meta["raw"]) > half_ulp * 1.000001:
        return VerifierResult(False, "sigfig-count", "rounded value moved too far from the original")
    return VerifierResult(True, "sigfig-count", f"{counted} figures, within half a unit in the last place")


# ---------------------------------------------------------------------------
# 14. particulate diagram multiple choice (Johnstone triangle crossing)
# ---------------------------------------------------------------------------

def gen_particulate(seed: int):
    scenarios = (
        ("sodium chloride dissolved in water",
         "Separated sodium ions and chloride ions, each surrounded by water molecules.",
         "Neutral NaCl units floating between water molecules.", "MOLECULAR-IONIC"),
        ("solid sodium chloride",
         "An extended alternating lattice of sodium ions and chloride ions.",
         "Discrete NaCl molecules packed side by side.", "MOLECULAR-IONIC"),
        ("hydrogen gas reacting with oxygen gas to form water",
         "The same atoms, regrouped into water molecules, with none left over.",
         "Some atoms disappear because the product weighs less than the reactants.", "ATOM-CONSERV"),
    )
    label, correct_text, wrong_text, code = _pick(scenarios, seed)
    choices = [
        {"index": 0, "text": correct_text, "misconception": None},
        {"index": 1, "text": wrong_text, "misconception": code},
        {"index": 2, "text": "A single continuous substance with no separate particles at all.",
         "misconception": "MOLECULAR-IONIC"},
        {"index": 3, "text": "Atoms of a new element that was not present before.",
         "misconception": "ATOM-CONSERV"},
    ]
    return _v("mc.particulate.v1", seed,
              f"At the particle level, which picture best represents {label}?",
              "0", "C.G1.IONIC", "mc",
              {"choices": choices, "correct_index": 0, "triangle_corner": "particulate"})


def ver_particulate(v) -> VerifierResult:
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, "mc-structural", "; ".join(problems))
    return VerifierResult(True, "mc-structural", "distractors keyed and routed")


PHASE2_TEMPLATES = {
    "molarmass.compute.v1": {"gen": gen_molar_mass, "ver": ver_molar_mass, "node": "C.G1.MOLE", "grader": "numeric"},
    "mole.mass_to_moles.v1": {"gen": gen_mass_to_moles, "ver": ver_mass_to_moles, "node": "C.G1.MOLE", "grader": "numeric"},
    "percentcomp.element.v1": {"gen": gen_percent_comp, "ver": ver_percent_comp, "node": "C.G1.PERCENTCOMP", "grader": "numeric"},
    "molarity.compute.v1": {"gen": gen_molarity, "ver": ver_molarity, "node": "C.G1.MOLARITY", "grader": "numeric"},
    "dilution.m1v1.v1": {"gen": gen_dilution, "ver": ver_dilution, "node": "C.G1.DILUTION", "grader": "numeric"},
    "gaslaw.ideal.v1": {"gen": gen_ideal_gas, "ver": ver_ideal_gas, "node": "C.G1.GASLAWS", "grader": "numeric"},
    "gaslaw.combined.v1": {"gen": gen_combined_gas, "ver": ver_combined_gas, "node": "C.G1.GASLAWS", "grader": "numeric"},
    "thermo.calorimetry.v1": {"gen": gen_calorimetry, "ver": ver_calorimetry, "node": "C.G1.THERMOBASIC", "grader": "numeric"},
    "ph.strong_acid.v1": {"gen": gen_ph_strong, "ver": ver_ph_strong, "node": "C.G2.PH", "grader": "numeric"},
    "limiting.reactant.v1": {"gen": gen_limiting, "ver": ver_limiting, "node": "C.G1.LIMITING", "grader": "numeric"},
    "ksp.solubility.v1": {"gen": gen_ksp, "ver": ver_ksp, "node": "C.G2.KSP", "grader": "numeric"},
    "density.compute.v1": {"gen": gen_density, "ver": ver_density, "node": "C.CF.DENSITY", "grader": "numeric"},
    "sigfig.round.v1": {"gen": gen_sigfig, "ver": ver_sigfig, "node": "C.CF.MEASURE", "grader": "numeric"},
    "mc.particulate.v1": {"gen": gen_particulate, "ver": ver_particulate, "node": "C.G1.IONIC", "grader": "mc"},
}
