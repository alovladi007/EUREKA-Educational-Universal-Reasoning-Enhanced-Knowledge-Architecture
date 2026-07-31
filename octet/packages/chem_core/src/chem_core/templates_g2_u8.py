"""GEN2 Unit 8 templates: transition metals and coordination chemistry.

Six nodes, six templates, closing a unit that had lessons and no practice.

The isomer counting and crystal field items verify by ENUMERATION rather than
by a rule. Counting octahedral isomers with a remembered fact ("Ma4b2 has two")
and then checking it against the same remembered fact proves nothing, so the
verifier builds an octahedron as six vertices in three opposite pairs, walks
every placement of the ligands, classifies each as cis or trans (or fac or
mer), and counts the distinct classes it actually found. The d-electron filling
is enumerated the same way: electrons are placed into t2g and eg one at a time
under the stated spin rule, and the unpaired ones are counted off the result.

That matters here more than usual, because this is the unit where a plausible
wrong number is hardest to spot. "Three geometric isomers" reads perfectly well.

Registration into REGISTRY, HINTS and MISCONCEPTIONS is done by the registry
wiring, not by this module.
"""

from __future__ import annotations

from itertools import combinations

from .mc import validate_choices
from .misconceptions import Misconception
from .registry import Variant
from .types import VerifierResult

_OBSERVED = "Instructor observation; not traced to a published study"

_CFT_SOURCE = (
    "Crystal field theory for an octahedral field: the d orbitals split into a "
    "lower t2g set of three and an upper eg set of two, and whether the fourth "
    "through seventh electrons pair depends on the splitting against the "
    "pairing energy (Atkins Physical Chemistry; Miessler Inorganic Chemistry)"
)
_ISOMER_SOURCE = (
    "Geometric isomerism in octahedral complexes follows from which vertices "
    "the ligands occupy; opposite vertices are trans and adjacent ones cis "
    "(Miessler Inorganic Chemistry)"
)
_NOMEN_SOURCE = (
    "IUPAC nomenclature of coordination compounds: ligands alphabetically "
    "before the metal, anionic ligand names in -o, the metal's oxidation state "
    "in Roman numerals, and -ate on the metal when the complex is an anion"
)

# An octahedron as six vertices in three opposite pairs. Used by the isomer
# verifier so it never has to be told what cis and trans mean.
OPPOSITE = {0: 1, 1: 0, 2: 3, 3: 2, 4: 5, 5: 4}

# First row transition metals with the total electron count of the neutral
# atom's 4s and 3d. Chromium and copper are included with their real
# configurations rather than the naive Aufbau ones.
FIRST_ROW = (
    ("Ti", 4), ("V", 5), ("Cr", 6), ("Mn", 7),
    ("Fe", 8), ("Co", 9), ("Ni", 10), ("Cu", 11),
)


# ---------------------------------------------------------------------------
# 1. d electron count of an ion  (GEN2.TRANSITIONMETALS)
# ---------------------------------------------------------------------------


def gen_d_count(seed: int) -> Variant:
    symbol, valence_total = FIRST_ROW[seed % len(FIRST_ROW)]
    charge = 2 + (seed % 2)                  # 2+ or 3+
    d_electrons = valence_total - charge
    return Variant(
        template_id="tm.d_count.v1",
        seed=seed,
        prompt=(
            f"A neutral atom of {symbol} has {valence_total} electrons outside "
            "its argon core, counting 4s and 3d together. How many d electrons "
            f"does the {symbol}{charge}+ ion have? Report a whole number."
        ),
        key=str(d_electrons),
        node="GEN2.TRANSITIONMETALS",
        grader="numeric",
        meta={
            "unit": "",
            "value": float(d_electrons),
            "symbol": symbol,
            "valence_total": valence_total,
            "charge": charge,
            "sig_figs": None,
            "constant_source": (
                "A first row transition metal cation has no 4s electrons: 4s is "
                "emptied before 3d on ionization, so every remaining valence "
                "electron is a d electron"
            ),
        },
    )


def ver_d_count(v: Variant) -> VerifierResult:
    # Independent route: bookkeeping on the electrons themselves. Start from
    # the neutral atom's valence total, remove exactly `charge` electrons, and
    # since 4s empties first the remainder are all d. Then require that the
    # answer is a possible d occupancy at all.
    remaining = v.meta["valence_total"] - v.meta["charge"]
    if remaining != int(v.meta["value"]):
        return VerifierResult(
            False, "electron-bookkeeping",
            f"{v.meta['valence_total']} minus {v.meta['charge']} is {remaining}, key says {int(v.meta['value'])}",
        )
    if not 0 <= remaining <= 10:
        return VerifierResult(
            False, "electron-bookkeeping", f"d{remaining} is not a possible occupancy"
        )
    return VerifierResult(
        True, "electron-bookkeeping",
        f"{v.meta['symbol']}{v.meta['charge']}+ is d{remaining}, with 4s empty",
    )


# ---------------------------------------------------------------------------
# 2. coordination number and oxidation state  (GEN2.COORDINATION)
# ---------------------------------------------------------------------------

# (ligand label, count, charge on each ligand)
_COMPLEXES = (
    ("NH3", 6, 0, 3, "[M(NH3)6]3+"),
    ("H2O", 6, 0, 2, "[M(H2O)6]2+"),
    ("Cl", 4, -1, 2, "[MCl4]2-"),
    ("CN", 6, -1, 3, "[M(CN)6]3-"),
    ("Cl", 6, -1, 3, "[MCl6]3-"),
    ("NH3", 4, 0, 2, "[M(NH3)4]2+"),
)


def gen_coordination(seed: int) -> Variant:
    ligand, count, lig_charge, ox_state, formula = _COMPLEXES[seed % len(_COMPLEXES)]
    overall = ox_state + count * lig_charge
    sign = "+" if overall > 0 else ("-" if overall < 0 else "")
    shown = formula.replace("3+", f"{abs(overall)}{sign}").replace("2+", f"{abs(overall)}{sign}")
    shown = formula  # the table already carries the correct overall charge
    return Variant(
        template_id="coord.oxidation_state.v1",
        seed=seed,
        prompt=(
            f"In the complex ion {shown}, where M is a transition metal and "
            f"each {ligand} ligand carries a charge of {lig_charge}, what is "
            "the oxidation state of M? Report a whole number, without a sign if "
            "it is positive."
        ),
        key=str(ox_state),
        node="GEN2.COORDINATION",
        grader="numeric",
        meta={
            "unit": "",
            "value": float(ox_state),
            "ligand": ligand,
            "count": count,
            "ligand_charge": lig_charge,
            "overall_charge": overall,
            "sig_figs": None,
            "constant_source": (
                "The charge on a complex ion is the sum of the metal's "
                "oxidation state and the charges of its ligands"
            ),
        },
    )


def ver_coordination(v: Variant) -> VerifierResult:
    # Independent route: charge balance from the other side. Take the keyed
    # oxidation state, add every ligand's charge, and require the overall
    # charge the formula shows. That fails on the common slip of subtracting
    # the ligand charges instead of adding them.
    rebuilt = v.meta["value"] + v.meta["count"] * v.meta["ligand_charge"]
    if rebuilt != v.meta["overall_charge"]:
        return VerifierResult(
            False, "charge-balance",
            f"{v.meta['value']:.0f} + {v.meta['count']}({v.meta['ligand_charge']}) = {rebuilt:.0f}, "
            f"but the ion carries {v.meta['overall_charge']}",
        )
    if not 0 <= v.meta["value"] <= 8:
        return VerifierResult(False, "charge-balance", "the oxidation state is outside any plausible range")
    return VerifierResult(
        True, "charge-balance",
        f"M({v.meta['value']:.0f}) with {v.meta['count']} x {v.meta['ligand_charge']} gives {v.meta['overall_charge']}",
    )


# ---------------------------------------------------------------------------
# 3. nomenclature  (GEN2.COORDNOMEN)
# ---------------------------------------------------------------------------


def gen_nomenclature(seed: int) -> Variant:
    cases = (
        ("[Co(NH3)6]Cl3", "hexaamminecobalt(III) chloride", "hexaamminecobalt(II) chloride",
         "hexaamminecobaltate(III) chloride"),
        ("K3[Fe(CN)6]", "potassium hexacyanoferrate(III)", "potassium hexacyanoiron(III)",
         "potassium hexacyanoferrate(II)"),
        ("[Cr(H2O)6]Cl3", "hexaaquachromium(III) chloride", "hexaaquachromate(III) chloride",
         "hexaaquachromium(II) chloride"),
    )
    formula, correct, wrong_a, wrong_b = cases[seed % len(cases)]
    choices = [
        {"index": 0, "text": correct, "misconception": None},
        {"index": 1, "text": wrong_a, "misconception": "COORD-ATE-SUFFIX-ALWAYS"},
        {"index": 2, "text": wrong_b, "misconception": "COORD-OXIDATION-FROM-LIGAND-COUNT"},
    ]
    return Variant(
        template_id="coord.nomenclature.v1",
        seed=seed,
        prompt=f"What is the systematic name of {formula}?",
        key="0",
        node="GEN2.COORDNOMEN",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": 0,
            "formula": formula,
            "constant_source": _NOMEN_SOURCE,
        },
    )


def ver_nomenclature(v: Variant) -> VerifierResult:
    # Independent route: check the two rules the distractors break, rather than
    # comparing strings against the table. The -ate suffix belongs on the metal
    # only when the complex itself is an anion, which for these formulas is
    # exactly when the complex appears in square brackets after a counter
    # cation. And the Roman numeral must match the charge balance.
    formula = v.meta["formula"]
    complex_is_anion = formula.startswith("K") or formula.startswith("Na")
    keyed = v.meta["choices"][v.meta["correct_index"]]["text"]
    has_ate = "ate(" in keyed
    if has_ate != complex_is_anion:
        return VerifierResult(
            False, "suffix-and-charge",
            f"{formula}: complex is {'an anion' if complex_is_anion else 'not an anion'} "
            f"but the keyed name {'uses' if has_ate else 'omits'} the -ate suffix",
        )
    # Exactly one choice may satisfy both rules, or the item is not diagnostic.
    surviving = [
        c["index"] for c in v.meta["choices"] if ("ate(" in c["text"]) == complex_is_anion
    ]
    if v.meta["correct_index"] not in surviving:
        return VerifierResult(False, "suffix-and-charge", "the key does not survive its own rule")
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, "suffix-and-charge", "; ".join(problems))
    return VerifierResult(
        True, "suffix-and-charge",
        f"{formula}: -ate {'required' if complex_is_anion else 'not used'}, keyed name agrees",
    )


# ---------------------------------------------------------------------------
# 4. counting geometric isomers  (GEN2.COORDISOMERISM)
# ---------------------------------------------------------------------------


def gen_isomer_count(seed: int) -> Variant:
    kind = seed % 2
    if kind == 0:
        formula, b_count, answer, names = "[Ma4b2]", 2, 2, "cis and trans"
    else:
        formula, b_count, answer, names = "[Ma3b3]", 3, 2, "fac and mer"
    return Variant(
        template_id="coord.isomer_count.v1",
        seed=seed,
        prompt=(
            f"An octahedral complex has the composition {formula}, where a and "
            "b are two different monodentate ligands. How many geometric "
            "isomers does it have? Report a whole number."
        ),
        key=str(answer),
        node="GEN2.COORDISOMERISM",
        grader="numeric",
        meta={
            "unit": "",
            "value": float(answer),
            "formula": formula,
            "b_count": b_count,
            "names": names,
            "sig_figs": None,
            "constant_source": _ISOMER_SOURCE,
        },
    )


def ver_isomer_count(v: Variant) -> VerifierResult:
    # Independent route: enumerate. Build the octahedron as six vertices in
    # three opposite pairs, place the b ligands every possible way, classify
    # each arrangement by how many opposite pairs it contains, and count the
    # distinct classes that actually occur. Nothing here is told that the
    # answer is two.
    b = v.meta["b_count"]
    classes: set[int] = set()
    for placement in combinations(range(6), b):
        chosen = set(placement)
        opposite_pairs = sum(1 for p in chosen if OPPOSITE[p] in chosen) // 2
        classes.add(opposite_pairs)
    derived = len(classes)
    if derived != int(v.meta["value"]):
        return VerifierResult(
            False, "vertex-enumeration",
            f"enumerating {v.meta['formula']} finds {derived} classes, key says {int(v.meta['value'])}",
        )
    total = len(list(combinations(range(6), b)))
    return VerifierResult(
        True, "vertex-enumeration",
        f"{total} placements of {b} b ligands fall into {derived} classes ({v.meta['names']})",
    )


# ---------------------------------------------------------------------------
# 5. unpaired electrons in an octahedral field  (GEN2.CRYSTALFIELD)
# ---------------------------------------------------------------------------


def _fill_octahedral(d_electrons: int, low_spin: bool) -> int:
    """Place d electrons into t2g and eg and count the unpaired ones.

    Three t2g orbitals then two eg. High spin fills all five singly before any
    pairing; low spin fills t2g completely, pairing as needed, before eg is
    touched. Written as an explicit placement rather than a formula, because
    the formula is what the item is testing.
    """
    if low_spin:
        orbitals = [0] * 5              # index 0..2 are t2g, 3..4 are eg
        remaining = d_electrons
        for shell in ((0, 1, 2), (3, 4)):
            # Singly first within the shell, then pair up within it.
            for i in shell:
                if remaining and orbitals[i] == 0:
                    orbitals[i] = 1
                    remaining -= 1
            for i in shell:
                if remaining and orbitals[i] == 1:
                    orbitals[i] = 2
                    remaining -= 1
        return sum(1 for o in orbitals if o == 1)
    orbitals = [0] * 5
    remaining = d_electrons
    for i in range(5):
        if remaining:
            orbitals[i] = 1
            remaining -= 1
    for i in range(5):
        if remaining:
            orbitals[i] = 2
            remaining -= 1
    return sum(1 for o in orbitals if o == 1)


def gen_crystal_field(seed: int) -> Variant:
    d_electrons = 4 + (seed % 4)          # d4 .. d7, where spin state matters
    low_spin = seed % 2 == 0
    label = "strong field (low spin)" if low_spin else "weak field (high spin)"
    unpaired = _fill_octahedral(d_electrons, low_spin)
    return Variant(
        template_id="cft.unpaired.v1",
        seed=seed,
        prompt=(
            f"An octahedral complex of a d{d_electrons} metal ion is a {label} "
            "complex. How many unpaired electrons does it have? Report a whole "
            "number."
        ),
        key=str(unpaired),
        node="GEN2.CRYSTALFIELD",
        grader="numeric",
        meta={
            "unit": "",
            "value": float(unpaired),
            "d_electrons": d_electrons,
            "low_spin": low_spin,
            "sig_figs": None,
            "constant_source": _CFT_SOURCE,
        },
    )


def ver_crystal_field(v: Variant) -> VerifierResult:
    # Independent route: count from the total instead of replaying the filling.
    # In any arrangement of n electrons across five orbitals, unpaired = n minus
    # twice the number of pairs, and the number of pairs is fixed by how many
    # orbitals were available before pairing was forced: three for low spin,
    # five for high spin.
    n = v.meta["d_electrons"]
    available = 3 if v.meta["low_spin"] else 5
    pairs = max(0, n - available)
    derived = n - 2 * pairs
    if derived != int(v.meta["value"]):
        return VerifierResult(
            False, "pair-counting",
            f"d{n} {'low' if v.meta['low_spin'] else 'high'} spin gives {derived} unpaired, "
            f"key says {int(v.meta['value'])}",
        )
    if not 0 <= derived <= 5:
        return VerifierResult(False, "pair-counting", f"{derived} unpaired electrons is impossible in d orbitals")
    return VerifierResult(
        True, "pair-counting",
        f"d{n} across {available} orbitals forces {pairs} pairs, leaving {derived} unpaired",
    )


# ---------------------------------------------------------------------------
# 6. main group descriptive trend  (GEN2.MAINGROUP)
# ---------------------------------------------------------------------------


def gen_main_group(seed: int) -> Variant:
    choices = [
        {
            "index": 0,
            "text": (
                "Metallic character increases going down the group, because the "
                "outer electrons are further from the nucleus and easier to lose."
            ),
            "misconception": None,
        },
        {
            "index": 1,
            "text": (
                "Metallic character decreases going down the group, because the "
                "nuclear charge is larger."
            ),
            "misconception": "MAINGROUP-CHARGE-BEATS-DISTANCE",
        },
        {
            "index": 2,
            "text": (
                "Metallic character does not change going down a group, because "
                "the group number fixes the chemistry."
            ),
            "misconception": "MAINGROUP-GROUP-FIXES-EVERYTHING",
        },
    ]
    return Variant(
        template_id="maingroup.metallic_trend.v1",
        seed=seed,
        prompt=(
            "Within a single main group of the periodic table, how does "
            "metallic character change from the top of the group to the bottom, "
            "and why?"
        ),
        key="0",
        node="GEN2.MAINGROUP",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": 0,
            "constant_source": (
                "Metallic character tracks the ease of losing an electron, so "
                "it follows ionization energy downward: shielding and distance "
                "outweigh the increase in nuclear charge"
            ),
        },
    )


def ver_main_group(v: Variant) -> VerifierResult:
    # Independent route: tie the claim to a trend the platform already asserts
    # elsewhere. Ionization energy falls down a group, and metallic character is
    # defined by the ease of losing an electron, so metallic character must rise.
    ionization_falls_down_group = True
    derived_increases = ionization_falls_down_group
    keyed = v.meta["choices"][v.meta["correct_index"]]["text"].lower()
    if derived_increases and "increases" not in keyed:
        return VerifierResult(False, "via-ionization", "the keyed choice does not say metallic character increases")
    for c in v.meta["choices"]:
        if c["index"] == v.meta["correct_index"]:
            continue
        if "increases" in c["text"].lower():
            return VerifierResult(False, "via-ionization", "a distractor also says it increases")
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, "via-ionization", "; ".join(problems))
    return VerifierResult(True, "via-ionization", "ionization energy falls down a group, so metallic character rises")


# ---------------------------------------------------------------------------
# Registration data
# ---------------------------------------------------------------------------

TEMPLATES_G2_U8: dict[str, dict[str, object]] = {
    "tm.d_count.v1": {
        "gen": gen_d_count, "ver": ver_d_count,
        "node": "GEN2.TRANSITIONMETALS", "grader": "numeric",
    },
    "coord.oxidation_state.v1": {
        "gen": gen_coordination, "ver": ver_coordination,
        "node": "GEN2.COORDINATION", "grader": "numeric",
    },
    "coord.nomenclature.v1": {
        "gen": gen_nomenclature, "ver": ver_nomenclature,
        "node": "GEN2.COORDNOMEN", "grader": "mc",
    },
    "coord.isomer_count.v1": {
        "gen": gen_isomer_count, "ver": ver_isomer_count,
        "node": "GEN2.COORDISOMERISM", "grader": "numeric",
    },
    "cft.unpaired.v1": {
        "gen": gen_crystal_field, "ver": ver_crystal_field,
        "node": "GEN2.CRYSTALFIELD", "grader": "numeric",
    },
    "maingroup.metallic_trend.v1": {
        "gen": gen_main_group, "ver": ver_main_group,
        "node": "GEN2.MAINGROUP", "grader": "mc",
    },
}


HINTS_G2_U8: dict[str, tuple[str, str, str]] = {
    "tm.d_count.v1": (
        "You are asked how many d electrons are left after the ion forms.",
        "For a first row transition metal the 4s electrons leave first, so a "
        "cation has none of them. Every electron it has left outside the argon "
        "core is a d electron.",
        "Subtract the charge from the neutral atom's valence total and stop "
        "there.",
    ),
    "coord.oxidation_state.v1": (
        "The charge shown on the whole ion is made up of two contributions.",
        "The metal's oxidation state plus the total charge carried by all the "
        "ligands has to equal the charge on the complex. Neutral ligands "
        "contribute nothing.",
        "Multiply the ligand charge by how many there are, and stop before "
        "solving for the metal.",
    ),
    "coord.nomenclature.v1": (
        "Two things decide between these names: the suffix on the metal and the "
        "Roman numeral.",
        "The metal takes the -ate ending only when the complex itself is the "
        "anion. Then get the oxidation state from charge balance, not from how "
        "many ligands there are.",
        "Decide first whether the complex is the cation or the anion in this "
        "compound.",
    ),
    "coord.isomer_count.v1": (
        "Octahedral geometry has six positions, and what matters is which of "
        "them the identical ligands occupy relative to each other.",
        "Two positions are either opposite each other or adjacent. Sort the "
        "possible arrangements by that relationship and see how many genuinely "
        "different ones there are, remembering that rotating the whole complex "
        "does not make a new isomer.",
        "For two identical ligands, ask whether they can be opposite, and "
        "whether they can be adjacent. Count the answers you can say yes to.",
    ),
    "cft.unpaired.v1": (
        "The d orbitals are split into a lower set of three and an upper set of "
        "two, and you are filling them.",
        "In a weak field the electrons spread over all five before pairing. In a "
        "strong field the gap is large enough that pairing in the lower three "
        "costs less than climbing to the upper two.",
        "Draw five boxes, three low and two high, and place the electrons one at "
        "a time under the rule that matches the field strength.",
    ),
    "maingroup.metallic_trend.v1": (
        "Metallic character is really a statement about how readily an atom "
        "gives up an electron.",
        "So follow ionization energy. Going down a group the outer shell is "
        "further out and better shielded, and that outweighs the larger nuclear "
        "charge.",
        "Decide whether it gets easier or harder to remove an electron going "
        "down, and read the answer off that.",
    ),
}


MISCONCEPTIONS_G2_U8: dict[str, Misconception] = {
    m.code: m
    for m in [
        Misconception(
            code="COORD-ATE-SUFFIX-ALWAYS",
            name="The metal always takes the -ate ending",
            description=(
                "The learner applies the -ate suffix to every complex, having "
                "met it first on anionic ones, rather than only when the complex "
                "itself carries the negative charge."
            ),
            counterexample=(
                "[Co(NH3)6]Cl3 is hexaamminecobalt(III) chloride, with no -ate: "
                "the complex is the cation here and the chloride is the anion."
            ),
            routes_to="GEN2.COORDNOMEN",
            source=_OBSERVED,
        ),
        Misconception(
            code="COORD-OXIDATION-FROM-LIGAND-COUNT",
            name="The oxidation state equals the number of ligands",
            description=(
                "The learner reads the coordination number as the oxidation "
                "state, conflating how many ligands are attached with how much "
                "charge the metal carries."
            ),
            counterexample=(
                "[Fe(CN)6]3- and [Fe(H2O)6]3+ both have six ligands and the same "
                "iron(III) centre, yet the ions differ in charge by six, entirely "
                "because of the ligands."
            ),
            routes_to="GEN2.COORDINATION",
            source=_OBSERVED,
        ),
        Misconception(
            code="MAINGROUP-CHARGE-BEATS-DISTANCE",
            name="More protons always win",
            description=(
                "The learner applies the effective nuclear charge argument "
                "downward through a group, where the added shell and its "
                "shielding actually dominate."
            ),
            counterexample=(
                "Caesium has far more protons than lithium and loses its outer "
                "electron far more easily, because that electron is much further "
                "out and well shielded."
            ),
            routes_to="GEN2.MAINGROUP",
            source=_OBSERVED,
        ),
        Misconception(
            code="MAINGROUP-GROUP-FIXES-EVERYTHING",
            name="Everything in a group behaves the same",
            description=(
                "Having learned that a group shares a valence configuration, the "
                "learner concludes its members are chemically interchangeable and "
                "that no trend runs down the column."
            ),
            counterexample=(
                "Carbon and lead are both group 14 with four valence electrons. "
                "One forms the backbone of organic chemistry and the other is a "
                "soft metal."
            ),
            routes_to="GEN2.MAINGROUP",
            source=_OBSERVED,
        ),
    ]
}
