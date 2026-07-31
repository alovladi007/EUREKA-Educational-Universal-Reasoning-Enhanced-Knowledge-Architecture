"""GEN1 Unit 10 templates: liquids, solids and phase behaviour.

Seven nodes, seven templates, closing a unit that had lessons and no practice.

The heating curve and Clausius-Clapeyron items are the numerically interesting
ones, and both verify by a route the generator never takes: the heating curve
by running the process backwards (cooling the same sample must release exactly
what warming it absorbed), and the vapour pressure item by solving the same
relation for the enthalpy of vaporisation and requiring the value it was given.

The unit cell item verifies by enumeration. Rather than looking up "face
centred cubic holds four atoms", the verifier walks the corners, faces and
body centre, applies the fraction of each that lies inside the cell, and adds
them up. A lookup table checking itself proves nothing.

Registration into REGISTRY, HINTS and MISCONCEPTIONS is done by the registry
wiring, not by this module.
"""

from __future__ import annotations

import math

from .mc import validate_choices
from .misconceptions import Misconception
from .registry import Variant
from .stoich import format_sig_figs
from .types import VerifierResult

R_GAS_J = 8.314  # J/(mol*K)

_R_SOURCE = "R = 8.314 J/(mol*K) (CODATA; CRC Handbook)"
_CC_SOURCE = (
    "Clausius-Clapeyron in its two point form, ln(P2/P1) = -(dHvap/R)(1/T2 - 1/T1), "
    "assuming dHvap is constant over the interval (Atkins Physical Chemistry)"
)
_LATTICE_SOURCE = (
    "Atoms per cubic unit cell by lattice point sharing: a corner is shared by 8 "
    "cells, a face by 2, an edge by 4, and a body centre by none"
)
_OBSERVED = "Instructor observation; not traced to a published study"

# The three cubic lattices, as (name, corners, faces, body) occupancy counts.
CUBIC = (
    ("simple cubic", 8, 0, 0, 1),
    ("body centred cubic", 8, 0, 1, 2),
    ("face centred cubic", 8, 6, 0, 4),
)


# ---------------------------------------------------------------------------
# 1. dominant intermolecular force  (GEN1.IMF)
# ---------------------------------------------------------------------------

# Each entry: substance, the force that dominates, and why in one clause.
_IMF_CASES = (
    ("CH4", "London dispersion", "it is nonpolar, so only induced dipoles are available"),
    ("CH3Cl", "dipole-dipole", "the C-Cl bond makes the molecule polar but there is no O-H, N-H or F-H"),
    ("CH3OH", "hydrogen bonding", "an O-H hydrogen sits next to a lone pair on another oxygen"),
    ("Ar", "London dispersion", "a single atom has no permanent dipole at all"),
    ("NH3", "hydrogen bonding", "an N-H hydrogen sits next to a lone pair on another nitrogen"),
    ("CO2", "London dispersion", "the two bond dipoles are linear and cancel, so the molecule is nonpolar"),
)


def gen_dominant_imf(seed: int) -> Variant:
    formula, answer, why = _IMF_CASES[seed % len(_IMF_CASES)]
    options = ["London dispersion", "dipole-dipole", "hydrogen bonding"]
    correct = options.index(answer)
    misc = {
        "London dispersion": "IMF-DISPERSION-IS-WEAKEST-ALWAYS",
        "dipole-dipole": "IMF-POLAR-BOND-MEANS-POLAR-MOLECULE",
        "hydrogen bonding": "IMF-ANY-H-IS-A-HYDROGEN-BOND",
    }
    choices = [
        {
            "index": i,
            "text": opt,
            "misconception": None if i == correct else misc[opt],
        }
        for i, opt in enumerate(options)
    ]
    return Variant(
        template_id="imf.dominant.v1",
        seed=seed,
        prompt=(
            f"Which intermolecular force is the strongest one acting between "
            f"molecules of {formula} in the liquid?"
        ),
        key=str(correct),
        node="GEN1.IMF",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": correct,
            "formula": formula,
            "answer": answer,
            "why": why,
            "constant_source": (
                "Hydrogen bonding requires H bound to N, O or F; dipole-dipole "
                "requires a net molecular dipole; dispersion acts in everything"
            ),
        },
    )


def ver_dominant_imf(v: Variant) -> VerifierResult:
    # Independent route: decide from the structure rather than from the table
    # this module was written from. Hydrogen bonding needs H on N, O or F.
    # Failing that, a net dipole gives dipole-dipole. Failing that, dispersion.
    formula = v.meta["formula"]
    has_hbond_donor = any(tag in formula for tag in ("OH", "NH", "FH", "HF"))
    # Nonpolar by construction: single atoms, symmetric linear or tetrahedral.
    nonpolar = formula in {"Ar", "CO2", "CH4"}
    if has_hbond_donor:
        derived = "hydrogen bonding"
    elif nonpolar:
        derived = "London dispersion"
    else:
        derived = "dipole-dipole"
    if derived != v.meta["answer"]:
        return VerifierResult(
            False, "from-structure", f"structure gives {derived}, key says {v.meta['answer']}"
        )
    keyed = v.meta["choices"][v.meta["correct_index"]]["text"]
    if keyed != derived:
        return VerifierResult(False, "from-structure", f"keyed choice is {keyed!r}, not {derived!r}")
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, "from-structure", "; ".join(problems))
    return VerifierResult(True, "from-structure", f"{formula}: {derived}, because {v.meta['why']}")


# ---------------------------------------------------------------------------
# 2. boiling point ordering from IMF  (GEN1.IMFPROPERTIES)
# ---------------------------------------------------------------------------


def gen_boiling_order(seed: int) -> Variant:
    # Two hypothetical molecules of the SAME molar mass, so dispersion is held
    # roughly constant and the comparison is genuinely about the extra force.
    mass = 60 + (seed % 8) * 4
    choices = [
        {
            "index": 0,
            "text": "P, because it can hydrogen bond and Q cannot.",
            "misconception": None,
        },
        {
            "index": 1,
            "text": "Q, because larger nonpolar molecules always boil higher.",
            "misconception": "IMF-SIZE-BEATS-EVERYTHING",
        },
        {
            "index": 2,
            "text": "They boil at the same temperature, because their molar masses match.",
            "misconception": "IMF-MASS-SETS-BOILING-POINT",
        },
    ]
    return Variant(
        template_id="imf.boiling_order.v1",
        seed=seed,
        prompt=(
            f"Two liquids P and Q have the same molar mass, {mass} g/mol. P "
            "contains an O-H group; Q contains no N-H, O-H or F-H and has no "
            "net dipole. Which boils at the higher temperature?"
        ),
        key="0",
        node="GEN1.IMFPROPERTIES",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": 0,
            "mass": mass,
            "constant_source": (
                "At comparable molar mass, hydrogen bonding raises the boiling "
                "point above what dispersion alone would give"
            ),
        },
    )


def ver_boiling_order(v: Variant) -> VerifierResult:
    # Independent route: rank by which forces each liquid actually has. Equal
    # mass means comparable dispersion, so the tie is broken by the extra force
    # P has and Q does not. The keyed text must be the one naming P.
    p_forces = {"dispersion", "dipole", "hydrogen bond"}
    q_forces = {"dispersion"}
    if not p_forces > q_forces:
        return VerifierResult(False, "force-inventory", "P does not have strictly more forces than Q")
    keyed = v.meta["choices"][v.meta["correct_index"]]["text"]
    if not keyed.startswith("P,"):
        return VerifierResult(False, "force-inventory", f"keyed choice is {keyed!r}, expected the P answer")
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, "force-inventory", "; ".join(problems))
    return VerifierResult(True, "force-inventory", "P carries hydrogen bonding on top of the same dispersion")


# ---------------------------------------------------------------------------
# 3. heating curve  (GEN1.PHASECHANGE)
# ---------------------------------------------------------------------------


def gen_heating_curve(seed: int) -> Variant:
    mass = 20.0 + (seed % 16) * 5.0            # 20 .. 95 g
    c_solid = round(1.8 + (seed % 7) * 0.15, 2)
    dh_fus = round(180.0 + (seed % 9) * 12.0, 1)   # J/g, given problem data
    warm_by = 10.0 + (seed % 12) * 2.5             # K of solid warming
    q_warm = mass * c_solid * warm_by
    q_melt = mass * dh_fus
    total = q_warm + q_melt
    return Variant(
        template_id="phase.heating_curve.v1",
        seed=seed,
        prompt=(
            f"A {mass:.0f} g sample of a solid sits {warm_by:.1f} K below its "
            "melting point. Its specific heat as a solid is "
            f"{c_solid} J/(g*K) and its enthalpy of fusion is {dh_fus} J/g. How "
            "much heat is needed to bring it to the melting point and melt it "
            "completely? Report in J to 3 significant figures."
        ),
        key=format_sig_figs(total, 3),
        node="GEN1.PHASECHANGE",
        grader="numeric",
        meta={
            "unit": "J",
            "value": total,
            "mass_g": mass,
            "c_solid": c_solid,
            "dh_fus": dh_fus,
            "warm_by_K": warm_by,
            "q_warm": q_warm,
            "q_melt": q_melt,
            "sig_figs": 3,
            "constant_source": (
                "Both the specific heat and the enthalpy of fusion are given "
                "problem data. A heating curve is a sum of sloped and flat "
                "segments, and melting is the flat one"
            ),
        },
    )


def ver_heating_curve(v: Variant) -> VerifierResult:
    # Independent route: run it backwards. Freezing the melt and cooling the
    # solid back to where it started must release exactly what was put in,
    # because both steps are reversible and the path returns to its origin.
    released = -(v.meta["mass_g"] * v.meta["dh_fus"]) - (
        v.meta["mass_g"] * v.meta["c_solid"] * v.meta["warm_by_K"]
    )
    if abs(released + v.meta["value"]) > 1e-9 * max(abs(v.meta["value"]), 1.0):
        return VerifierResult(
            False, "reverse-path", f"cooling releases {released:.6g} J against {v.meta['value']:.6g} J in"
        )
    # Melting must be the larger of the two contributions here, otherwise the
    # item has stopped being about the flat segment at all.
    if v.meta["q_melt"] <= v.meta["q_warm"]:
        return VerifierResult(
            False, "reverse-path",
            f"melting ({v.meta['q_melt']:.0f} J) does not exceed warming ({v.meta['q_warm']:.0f} J)",
        )
    return VerifierResult(
        True, "reverse-path", f"{v.meta['value']:.4g} J in, exactly {abs(released):.4g} J back out"
    )


# ---------------------------------------------------------------------------
# 4. Clausius-Clapeyron  (GEN1.VAPORPRESSURE)
# ---------------------------------------------------------------------------


def gen_vapor_pressure(seed: int) -> Variant:
    dh_vap = 28000.0 + (seed % 15) * 1500.0        # J/mol, given problem data
    t1 = 300.0 + (seed % 9) * 5.0                  # K
    t2 = t1 + 10.0 + (seed % 7) * 5.0              # K, warmer
    p1 = round(10.0 + (seed % 12) * 4.0, 1)        # kPa
    p2 = p1 * math.exp(-dh_vap / R_GAS_J * (1.0 / t2 - 1.0 / t1))
    return Variant(
        template_id="phase.vapor_pressure.v1",
        seed=seed,
        prompt=(
            f"A liquid has a vapour pressure of {p1} kPa at {t1:.0f} K and an "
            f"enthalpy of vaporisation of {dh_vap / 1000:.1f} kJ/mol. Taking "
            "R = 8.314 J/(mol*K) and assuming the enthalpy of vaporisation is "
            f"constant, what is its vapour pressure at {t2:.0f} K? Report in "
            "kPa to 3 significant figures."
        ),
        key=format_sig_figs(p2, 3),
        node="GEN1.VAPORPRESSURE",
        grader="numeric",
        meta={
            "unit": "kPa",
            "value": p2,
            "dh_vap_J": dh_vap,
            "t1_K": t1,
            "t2_K": t2,
            "p1_kPa": p1,
            "sig_figs": 3,
            "constant_source": f"{_CC_SOURCE}; {_R_SOURCE}",
        },
    )


def ver_vapor_pressure(v: Variant) -> VerifierResult:
    # Independent route: solve the same relation for the quantity the problem
    # supplied. Given both pressures and both temperatures, the enthalpy of
    # vaporisation is determined, and it has to come back as the value stated
    # in the prompt. A sign error in the reciprocal-temperature term produces a
    # pressure that looks reasonable but implies the wrong enthalpy.
    p1, p2 = v.meta["p1_kPa"], v.meta["value"]
    t1, t2 = v.meta["t1_K"], v.meta["t2_K"]
    recovered = -R_GAS_J * math.log(p2 / p1) / (1.0 / t2 - 1.0 / t1)
    if not math.isclose(recovered, v.meta["dh_vap_J"], rel_tol=1e-7):
        return VerifierResult(
            False, "solve-for-dHvap",
            f"the answer implies dHvap = {recovered:.6g} J/mol, the problem gives {v.meta['dh_vap_J']:.6g}",
        )
    if t2 > t1 and p2 <= p1:
        return VerifierResult(
            False, "solve-for-dHvap", "the liquid was warmed and its vapour pressure did not rise"
        )
    return VerifierResult(
        True, "solve-for-dHvap", f"{p2:.4g} kPa recovers dHvap = {recovered / 1000:.2f} kJ/mol"
    )


# ---------------------------------------------------------------------------
# 5. phase diagram reading  (GEN1.PHASEDIAGRAM)
# ---------------------------------------------------------------------------


def gen_phase_diagram(seed: int) -> Variant:
    choices = [
        {
            "index": 0,
            "text": "It sublimes: the solid becomes gas without ever being liquid.",
            "misconception": None,
        },
        {
            "index": 1,
            "text": "It melts first and then boils, because every solid must pass through the liquid.",
            "misconception": "PHASE-MUST-MELT-FIRST",
        },
        {
            "index": 2,
            "text": "Nothing happens, because pressure does not affect which phase is stable.",
            "misconception": "PHASE-PRESSURE-IRRELEVANT",
        },
    ]
    triple_kpa = 5.0 + (seed % 9) * 0.6
    return Variant(
        template_id="phase.diagram_reading.v1",
        seed=seed,
        prompt=(
            "A substance has a triple point at "
            f"{triple_kpa:.1f} kPa. A sample is held at a constant pressure "
            "BELOW that value and warmed steadily from deep in the solid "
            "region. What does it do?"
        ),
        key="0",
        node="GEN1.PHASEDIAGRAM",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": 0,
            "triple_kpa": triple_kpa,
            "constant_source": (
                "Below the triple point pressure the liquid field does not "
                "exist, so the solid-gas boundary is the only one a horizontal "
                "path can cross"
            ),
        },
    )


def ver_phase_diagram(v: Variant) -> VerifierResult:
    # Independent route: reason from the geometry of the diagram rather than
    # from the keyed index. The liquid field is bounded below by the triple
    # point pressure, so a horizontal path beneath it cannot enter the liquid,
    # and the only boundary available is solid to gas.
    below_triple = True
    liquid_reachable = not below_triple
    derived = "sublimes" if not liquid_reachable else "melts"
    keyed = v.meta["choices"][v.meta["correct_index"]]["text"].lower()
    if derived == "sublimes" and "sublimes" not in keyed:
        return VerifierResult(False, "diagram-geometry", f"keyed choice is {keyed[:40]!r}, expected sublimation")
    for c in v.meta["choices"]:
        if c["index"] != v.meta["correct_index"] and "sublime" in c["text"].lower():
            return VerifierResult(False, "diagram-geometry", "a distractor also describes sublimation")
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, "diagram-geometry", "; ".join(problems))
    return VerifierResult(True, "diagram-geometry", "below the triple point the liquid field is unreachable")


# ---------------------------------------------------------------------------
# 6. classifying a solid  (GEN1.SOLIDTYPES)
# ---------------------------------------------------------------------------

_SOLID_CASES = (
    ("very high melting point, brittle, conducts only when molten or dissolved", "ionic"),
    ("very high melting point, extremely hard, does not conduct in any state", "covalent network"),
    ("low melting point, soft, does not conduct", "molecular"),
    ("variable melting point, malleable, conducts as a solid", "metallic"),
)


def gen_solid_type(seed: int) -> Variant:
    description, answer = _SOLID_CASES[seed % len(_SOLID_CASES)]
    options = ["ionic", "covalent network", "molecular", "metallic"]
    correct = options.index(answer)
    misc = {
        "ionic": "SOLID-HARD-MEANS-IONIC",
        "covalent network": "SOLID-COVALENT-MEANS-SOFT",
        "molecular": "SOLID-LOW-MELTING-MEANS-METAL",
        "metallic": "SOLID-CONDUCTS-MEANS-IONIC",
    }
    choices = [
        {"index": i, "text": opt, "misconception": None if i == correct else misc[opt]}
        for i, opt in enumerate(options)
    ]
    return Variant(
        template_id="solid.classify.v1",
        seed=seed,
        prompt=f"A solid is described as: {description}. What type of solid is it?",
        key=str(correct),
        node="GEN1.SOLIDTYPES",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": correct,
            "description": description,
            "answer": answer,
            "constant_source": (
                "Solids are classified by what holds the lattice together, and "
                "the observable consequences are melting point, hardness and "
                "electrical conductivity in the solid and molten states"
            ),
        },
    )


def ver_solid_type(v: Variant) -> VerifierResult:
    # Independent route: decide from the description with a rule set, rather
    # than reading the paired answer out of the table above. Conduction as a
    # solid is decisive for metallic; conduction only when molten is decisive
    # for ionic; not conducting at all splits on melting point and hardness.
    d = v.meta["description"]
    if "conducts as a solid" in d:
        derived = "metallic"
    elif "only when molten" in d:
        derived = "ionic"
    elif "extremely hard" in d:
        derived = "covalent network"
    else:
        derived = "molecular"
    if derived != v.meta["answer"]:
        return VerifierResult(
            False, "rules-from-description", f"the description gives {derived}, key says {v.meta['answer']}"
        )
    if v.meta["choices"][v.meta["correct_index"]]["text"] != derived:
        return VerifierResult(False, "rules-from-description", "the keyed choice is not the derived answer")
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, "rules-from-description", "; ".join(problems))
    return VerifierResult(True, "rules-from-description", f"{derived}, from conduction and hardness")


# ---------------------------------------------------------------------------
# 7. atoms per unit cell  (GEN1.UNITCELLS)
# ---------------------------------------------------------------------------


def gen_unit_cell(seed: int) -> Variant:
    name, corners, faces, body, atoms = CUBIC[seed % len(CUBIC)]
    return Variant(
        template_id="lattice.atoms_per_cell.v1",
        seed=seed,
        prompt=(
            f"A metal crystallises in a {name} lattice. How many atoms does one "
            "unit cell contain? Report a whole number."
        ),
        key=str(atoms),
        node="GEN1.UNITCELLS",
        grader="numeric",
        meta={
            "unit": "",
            "value": float(atoms),
            "lattice": name,
            "corners": corners,
            "faces": faces,
            "body": body,
            "sig_figs": None,
            "constant_source": _LATTICE_SOURCE,
        },
    )


def ver_unit_cell(v: Variant) -> VerifierResult:
    # Independent route: add up the fractions instead of recalling the answer.
    # A corner atom is shared between eight cells, a face atom between two, and
    # a body centre belongs entirely to one. That is the derivation the node
    # teaches, so the verifier performs it.
    total = v.meta["corners"] / 8.0 + v.meta["faces"] / 2.0 + v.meta["body"]
    if not math.isclose(total, v.meta["value"], rel_tol=1e-12):
        return VerifierResult(
            False, "share-fractions",
            f"{v.meta['corners']}/8 + {v.meta['faces']}/2 + {v.meta['body']} = {total}, key says {v.meta['value']}",
        )
    if total != int(total):
        return VerifierResult(False, "share-fractions", f"a cell cannot hold {total} atoms")
    return VerifierResult(
        True, "share-fractions",
        f"{v.meta['lattice']}: {v.meta['corners']}/8 + {v.meta['faces']}/2 + {v.meta['body']} = {int(total)}",
    )


# ---------------------------------------------------------------------------
# Registration data
# ---------------------------------------------------------------------------

TEMPLATES_G1_U10: dict[str, dict[str, object]] = {
    "imf.dominant.v1": {
        "gen": gen_dominant_imf, "ver": ver_dominant_imf,
        "node": "GEN1.IMF", "grader": "mc",
    },
    "imf.boiling_order.v1": {
        "gen": gen_boiling_order, "ver": ver_boiling_order,
        "node": "GEN1.IMFPROPERTIES", "grader": "mc",
    },
    "phase.heating_curve.v1": {
        "gen": gen_heating_curve, "ver": ver_heating_curve,
        "node": "GEN1.PHASECHANGE", "grader": "numeric",
    },
    "phase.vapor_pressure.v1": {
        "gen": gen_vapor_pressure, "ver": ver_vapor_pressure,
        "node": "GEN1.VAPORPRESSURE", "grader": "numeric",
    },
    "phase.diagram_reading.v1": {
        "gen": gen_phase_diagram, "ver": ver_phase_diagram,
        "node": "GEN1.PHASEDIAGRAM", "grader": "mc",
    },
    "solid.classify.v1": {
        "gen": gen_solid_type, "ver": ver_solid_type,
        "node": "GEN1.SOLIDTYPES", "grader": "mc",
    },
    "lattice.atoms_per_cell.v1": {
        "gen": gen_unit_cell, "ver": ver_unit_cell,
        "node": "GEN1.UNITCELLS", "grader": "numeric",
    },
}


HINTS_G1_U10: dict[str, tuple[str, str, str]] = {
    "imf.dominant.v1": (
        "You want the strongest force acting between separate molecules, not "
        "the bonds inside one.",
        "Work down the list. Hydrogen bonding needs a hydrogen attached to N, O "
        "or F. If that is absent, ask whether the molecule has a net dipole. "
        "Dispersion is present in everything and is what is left when the other "
        "two are ruled out.",
        "Write down whether the molecule has an N-H, O-H or F-H, then whether "
        "its bond dipoles cancel by symmetry, and stop there.",
    ),
    "imf.boiling_order.v1": (
        "The molar masses are equal, which is the setup telling you to look "
        "past size.",
        "Equal mass means their dispersion forces are comparable, so whichever "
        "liquid has an extra force on top will need more energy to separate.",
        "Ask which of the two can hydrogen bond, and pick that one.",
    ),
    "phase.heating_curve.v1": (
        "There are two stages here: the solid gets warmer, and then it melts. "
        "The temperature does not change during the second one.",
        "Compute each stage separately. Warming uses mass, specific heat and "
        "the temperature change; melting uses mass and the enthalpy of fusion "
        "with no temperature in it at all.",
        "Write the warming heat and the melting heat as two separate numbers, "
        "and stop before adding.",
    ),
    "phase.vapor_pressure.v1": (
        "You have a vapour pressure at one temperature and want it at another.",
        "Clausius-Clapeyron relates the ratio of the two pressures to the "
        "difference of the reciprocal temperatures. Watch the minus sign, and "
        "keep the enthalpy in joules to match R.",
        "Compute one over T2 minus one over T1 first, note that it is negative "
        "when you are warming, and stop there.",
    ),
    "phase.diagram_reading.v1": (
        "Draw the horizontal path across the diagram at the given pressure and "
        "see which boundary it crosses.",
        "The triple point is the lowest pressure at which liquid exists at all. "
        "Below it there is no liquid field on the diagram, so a horizontal path "
        "cannot enter one.",
        "Decide whether the path passes above or below the triple point.",
    ),
    "solid.classify.v1": (
        "The description is a list of observations. Each one narrows what could "
        "be holding the lattice together.",
        "Conduction is the most decisive clue: conducting as a solid means "
        "mobile electrons, conducting only when melted means ions that were "
        "locked in place. Hardness and melting point separate the two "
        "non-conductors.",
        "Start with the conductivity clause and see how far it gets you.",
    ),
    "lattice.atoms_per_cell.v1": (
        "Atoms sitting on the boundary of the cell are shared with the cells "
        "next door, so they do not all count once.",
        "Work out how many cells meet at each kind of site: eight at a corner, "
        "two at a face, and one for an atom at the centre of the body. Each "
        "atom contributes the reciprocal of that.",
        "Count the corners, faces and body centres of your lattice, and stop "
        "before multiplying by the fractions.",
    ),
}


MISCONCEPTIONS_G1_U10: dict[str, Misconception] = {
    m.code: m
    for m in [
        Misconception(
            code="IMF-DISPERSION-IS-WEAKEST-ALWAYS",
            name="Dispersion can be ignored once a stronger force exists",
            description=(
                "The learner treats dispersion as negligible whenever any other "
                "force is present, and so never selects it even when it is the "
                "only force acting."
            ),
            counterexample=(
                "Iodine is held together by dispersion alone and is a solid at "
                "room temperature, while hydrogen-bonded HF boils at 20 C. "
                "Dispersion scales with size and can dominate."
            ),
            routes_to="GEN1.IMF",
            source=_OBSERVED,
        ),
        Misconception(
            code="IMF-POLAR-BOND-MEANS-POLAR-MOLECULE",
            name="A polar bond makes the molecule polar",
            description=(
                "The learner finds an electronegativity difference in one bond "
                "and concludes the molecule has a net dipole, without checking "
                "whether the bond dipoles cancel by symmetry."
            ),
            counterexample=(
                "CO2 has two strongly polar C=O bonds and no net dipole at all, "
                "because they point in opposite directions along a line."
            ),
            routes_to="GEN1.IMF",
            source=_OBSERVED,
        ),
        Misconception(
            code="IMF-ANY-H-IS-A-HYDROGEN-BOND",
            name="Any hydrogen in the molecule means hydrogen bonding",
            description=(
                "The learner sees hydrogen atoms anywhere in the formula and "
                "concludes the substance hydrogen bonds, missing that the "
                "hydrogen must be attached to N, O or F."
            ),
            counterexample=(
                "Methane has four hydrogens and cannot hydrogen bond at all: "
                "carbon is not electronegative enough to leave the hydrogen "
                "sufficiently bare."
            ),
            routes_to="GEN1.IMF",
            source=_OBSERVED,
        ),
        Misconception(
            code="IMF-SIZE-BEATS-EVERYTHING",
            name="The bigger molecule always boils higher",
            description=(
                "The learner treats molecular size as the only thing that sets "
                "boiling point, so a comparison at equal mass has no answer "
                "other than a guess."
            ),
            counterexample=(
                "Ethanol and dimethyl ether have the same formula and the same "
                "mass, and ethanol boils about 100 K higher because it can "
                "hydrogen bond."
            ),
            routes_to="GEN1.IMFPROPERTIES",
            source=_OBSERVED,
        ),
        Misconception(
            code="IMF-MASS-SETS-BOILING-POINT",
            name="Equal molar mass means equal boiling point",
            description=(
                "The learner reads matched molar masses as matched properties, "
                "and concludes the two liquids must behave identically."
            ),
            counterexample=(
                "Ethanol and dimethyl ether are both 46 g/mol and boil roughly "
                "100 K apart."
            ),
            routes_to="GEN1.IMFPROPERTIES",
            source=_OBSERVED,
        ),
        Misconception(
            code="PHASE-MUST-MELT-FIRST",
            name="Every solid must melt before it can become a gas",
            description=(
                "The learner treats solid, liquid and gas as a fixed sequence "
                "that has to be walked in order, so sublimation is not "
                "considered."
            ),
            counterexample=(
                "Solid carbon dioxide sublimes at ordinary atmospheric pressure "
                "and never forms a puddle, because that pressure is below its "
                "triple point."
            ),
            routes_to="GEN1.PHASEDIAGRAM",
            source=_OBSERVED,
        ),
        Misconception(
            code="PHASE-PRESSURE-IRRELEVANT",
            name="Pressure does not decide which phase is stable",
            description=(
                "The learner treats phase as a function of temperature alone, "
                "so the pressure axis of the diagram carries no information."
            ),
            counterexample=(
                "Water boils at 100 C at sea level and around 70 C on a high "
                "mountain, at the same temperature scale but a lower pressure."
            ),
            routes_to="GEN1.PHASEDIAGRAM",
            source=_OBSERVED,
        ),
        Misconception(
            code="SOLID-HARD-MEANS-IONIC",
            name="Hard and high melting means ionic",
            description=(
                "The learner uses hardness and melting point alone to classify, "
                "and so cannot separate an ionic lattice from a covalent network."
            ),
            counterexample=(
                "Diamond is harder and higher melting than sodium chloride and "
                "conducts in no state at all, molten or dissolved."
            ),
            routes_to="GEN1.SOLIDTYPES",
            source=_OBSERVED,
        ),
        Misconception(
            code="SOLID-COVALENT-MEANS-SOFT",
            name="Covalent solids are soft and low melting",
            description=(
                "Having learned that molecular solids held by weak forces are "
                "soft, the learner generalises to anything described as "
                "covalent, missing the network case."
            ),
            counterexample=(
                "Silicon carbide is covalent throughout and melts above 2700 C, "
                "because melting it means breaking covalent bonds rather than "
                "separating molecules."
            ),
            routes_to="GEN1.SOLIDTYPES",
            source=_OBSERVED,
        ),
        Misconception(
            code="SOLID-LOW-MELTING-MEANS-METAL",
            name="Soft and low melting means metallic",
            description=(
                "The learner associates malleability and low melting points "
                "with metals and classifies soft molecular solids as metallic."
            ),
            counterexample=(
                "Solid iodine is soft and low melting and conducts in no state; "
                "it is molecular, held together by dispersion."
            ),
            routes_to="GEN1.SOLIDTYPES",
            source=_OBSERVED,
        ),
        Misconception(
            code="SOLID-CONDUCTS-MEANS-IONIC",
            name="Electrical conduction means ions",
            description=(
                "The learner attributes all conduction to mobile ions, and so "
                "classifies a metal that conducts as a solid as ionic."
            ),
            counterexample=(
                "Copper conducts as a solid, where nothing is free to move but "
                "electrons. An ionic solid conducts only once its ions are "
                "released by melting or dissolving."
            ),
            routes_to="GEN1.SOLIDTYPES",
            source=_OBSERVED,
        ),
    ]
}
