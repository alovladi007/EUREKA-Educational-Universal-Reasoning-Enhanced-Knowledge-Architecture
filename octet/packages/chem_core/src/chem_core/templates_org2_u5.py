"""ORG2 Unit 5 templates: aldehydes and ketones.

Ten nodes, ten templates, closing a unit that had lessons and no practice.

SECTION 18

Carbonyl chemistry, and reductive amination in particular, is a place where a
course can drift from mechanism into a preparation of something it should not
describe. Every substrate in this module is abstract: R, R', a ring drawn as
"a ketone", never a named amine or a named product. No prompt, key, hint or
distractor gives a reagent quantity, a temperature, a solvent, a time or a
work up, and no item asks for or describes a route to any specific amine.
What these items assess is which bond forms, which atom is attacked, and what
the oxidation level is, none of which is a procedure.

VERIFIERS

Where the item has arithmetic, the verifier does it a different way: the
degrees of unsaturation item recovers the hydrogen count from its own answer,
and the acetal item balances the atoms rather than recalling "two equivalents".

Where the item is a conceptual choice, the discriminating property is carried
as DATA on each choice and the verifier applies the RULE to every option to see
which survives, without being told the key. That division is deliberate and its
limits are worth stating plainly: it proves the item is internally consistent
and diagnostic, not that the chemistry in the data is right. An earlier module
in this unit build tried to fake stronger independence by pattern matching the
prose of each choice, and it failed on the first seed, because English cannot
be relied on to distinguish an argument from its negation.

Registration into REGISTRY, HINTS and MISCONCEPTIONS is done by the registry
wiring, not by this module.
"""

from __future__ import annotations

from .mc import validate_choices
from .misconceptions import Misconception
from .registry import Variant
from .types import VerifierResult

_OBSERVED = "Instructor observation; not traced to a published study"

_CARBONYL_SOURCE = (
    "The carbonyl carbon is sp2 hybridised and trigonal planar, and the C=O "
    "bond is polarised toward oxygen (Clayden Organic Chemistry)"
)
_ADDITION_SOURCE = (
    "Nucleophilic addition to a carbonyl proceeds by attack at the electrophilic "
    "carbon, giving a tetrahedral alkoxide (Clayden Organic Chemistry)"
)
_DOU_SOURCE = (
    "Degrees of unsaturation from a molecular formula: (2C + 2 + N - H - X) / 2, "
    "which follows from comparing the formula with the saturated acyclic parent"
)


def _mc(prompt, node, tid, rows, correct, source, **extra):
    """Build a multiple choice Variant from (text, misconception, **flags) rows."""
    choices = []
    for i, row in enumerate(rows):
        choice = {"index": i, "text": row[0], "misconception": None if i == correct else row[1]}
        choice.update(row[2])
        choices.append(choice)
    meta = {"choices": choices, "correct_index": correct, "constant_source": source}
    meta.update(extra)
    return Variant(
        template_id=tid, seed=0, prompt=prompt, key=str(correct),
        node=node, grader="mc", meta=meta,
    )


def _survivor_check(v: Variant, predicate, method: str, note: str) -> VerifierResult:
    """Apply a rule to every choice; exactly the key must survive."""
    surviving = [c["index"] for c in v.meta["choices"] if predicate(c)]
    if surviving != [v.meta["correct_index"]]:
        return VerifierResult(
            False, method, f"choices satisfying the rule are {surviving}, key is {v.meta['correct_index']}"
        )
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, method, "; ".join(problems))
    return VerifierResult(True, method, note)


# ---------------------------------------------------------------------------
# 1. carbonyl geometry  (ORG2.CARBONYLSTRUCTURE)
# ---------------------------------------------------------------------------


def gen_carbonyl_structure(seed: int) -> Variant:
    v = _mc(
        "What is the geometry at the carbon of a C=O group, and how many "
        "groups surround it?",
        "ORG2.CARBONYLSTRUCTURE", "carbonyl.structure.v1",
        [
            ("Trigonal planar, with three groups around a carbon that has no lone pairs.",
             None, {"regions": 3, "lone_pairs": 0, "planar": True}),
            ("Tetrahedral, with four groups around the carbon.",
             "CARBONYL-TETRAHEDRAL", {"regions": 4, "lone_pairs": 0, "planar": False}),
            ("Bent, because the oxygen's lone pairs push the substituents down.",
             "CARBONYL-OXYGEN-LONE-PAIRS-BEND-CARBON", {"regions": 3, "lone_pairs": 2, "planar": False}),
        ],
        correct=0, source=_CARBONYL_SOURCE,
    )
    v.seed = seed
    return v


def ver_carbonyl_structure(v: Variant) -> VerifierResult:
    # Independent route: VSEPR from the electron domain count. A double bond is
    # one region, so the carbonyl carbon has three regions and no lone pairs of
    # its own, which is trigonal planar. The oxygen's lone pairs are on oxygen
    # and cannot bend the geometry AT carbon.
    return _survivor_check(
        v,
        lambda c: c["regions"] == 3 and c["lone_pairs"] == 0 and c["planar"],
        "vsepr-domain-count",
        "three regions and no lone pairs on carbon gives trigonal planar",
    )


# ---------------------------------------------------------------------------
# 2. oxidation level  (ORG2.CARBONYLPREP)
# ---------------------------------------------------------------------------


def gen_carbonyl_prep(seed: int) -> Variant:
    primary = seed % 2 == 0
    substrate = "a primary alcohol" if primary else "a secondary alcohol"
    rows = [
        ("An aldehyde, because the carbon bearing the OH also carries a hydrogen that is removed.",
         "PREP-ALCOHOL-CLASS-IGNORED", {"h_on_carbinol": 1}),
        ("A ketone, because the carbon bearing the OH carries no hydrogen once oxidised.",
         "PREP-ALCOHOL-CLASS-IGNORED", {"h_on_carbinol": 0}),
    ]
    correct = 0 if primary else 1
    v = _mc(
        f"Controlled oxidation of {substrate} gives which kind of carbonyl "
        "compound?",
        "ORG2.CARBONYLPREP", "carbonyl.prep.v1", rows, correct,
        "Oxidation removes hydrogens from the carbinol carbon; how many it "
        "carries decides whether an aldehyde or a ketone results",
        primary=primary,
    )
    v.seed = seed
    return v


def ver_carbonyl_prep(v: Variant) -> VerifierResult:
    # Independent route: count hydrogens on the carbinol carbon. A primary
    # alcohol has two, and oxidation removes one, leaving one: an aldehyde. A
    # secondary alcohol has one, and oxidation removes it, leaving none: a
    # ketone.
    starting_h = 2 if v.meta["primary"] else 1
    remaining = starting_h - 1
    return _survivor_check(
        v,
        lambda c: c["h_on_carbinol"] == remaining,
        "hydrogen-count",
        f"{'primary' if v.meta['primary'] else 'secondary'} carbinol carbon keeps {remaining} H after oxidation",
    )


# ---------------------------------------------------------------------------
# 3. where the nucleophile attacks  (ORG2.NUCADDITION)
# ---------------------------------------------------------------------------


def gen_nuc_addition(seed: int) -> Variant:
    v = _mc(
        "A nucleophile reacts with a ketone by addition. Which atom does the "
        "nucleophile bond to, and why?",
        "ORG2.NUCADDITION", "carbonyl.nuc_addition.v1",
        [
            ("The carbon, because polarisation of the C=O bond leaves it partially positive.",
             None, {"partial_charge": +1}),
            ("The oxygen, because it is the more electronegative atom.",
             "ADDITION-ATTACK-THE-ELECTRONEGATIVE-ATOM", {"partial_charge": -1}),
            ("Either, because the pi bond is shared evenly between them.",
             "ADDITION-PI-BOND-IS-SYMMETRIC", {"partial_charge": 0}),
        ],
        correct=0, source=_ADDITION_SOURCE,
    )
    v.seed = seed
    return v


def ver_nuc_addition(v: Variant) -> VerifierResult:
    # Independent route: a nucleophile is electron rich and goes to whichever
    # atom carries partial POSITIVE charge. Oxygen is more electronegative, so
    # the carbon is the partially positive one. Applying the rule picks the
    # choice whose stated partial charge is positive.
    return _survivor_check(
        v,
        lambda c: c["partial_charge"] > 0,
        "attack-the-positive-atom",
        "oxygen pulls density away, leaving carbon partially positive",
    )


# ---------------------------------------------------------------------------
# 4. acetal formation stoichiometry  (ORG2.HYDRATEACETAL)
# ---------------------------------------------------------------------------


def gen_acetal(seed: int) -> Variant:
    return Variant(
        template_id="carbonyl.acetal_equivalents.v1",
        seed=seed,
        prompt=(
            "A ketone is converted into an acetal by reaction with a simple "
            "alcohol under acid catalysis. Counting whole molecules of alcohol "
            "consumed per molecule of ketone, how many are required? Report a "
            "whole number."
        ),
        key="2",
        node="ORG2.HYDRATEACETAL",
        grader="numeric",
        meta={
            "unit": "",
            "value": 2.0,
            "sig_figs": None,
            "constant_source": (
                "An acetal carbon carries two OR groups where the carbonyl "
                "carried one O, and one water is released (Clayden Organic "
                "Chemistry)"
            ),
        },
    )


def ver_acetal(v: Variant) -> VerifierResult:
    # Independent route: balance the atoms. Ketone R2C=O plus n ROH gives the
    # acetal R2C(OR)2 plus water. Count oxygens on each side and solve for n
    # rather than recalling the number.
    #
    #   left  O = 1 (carbonyl) + n (one per alcohol)
    #   right O = 2 (the two OR groups) + 1 (water)
    #
    # so n = 2. Doing it as a balance also confirms the water is accounted for,
    # which is the step learners drop.
    n = (2 + 1) - 1
    if n != int(v.meta["value"]):
        return VerifierResult(
            False, "atom-balance", f"the oxygen balance needs {n} alcohols, key says {int(v.meta['value'])}"
        )
    left_o, right_o = 1 + n, 2 + 1
    if left_o != right_o:
        return VerifierResult(False, "atom-balance", f"oxygen does not balance: {left_o} vs {right_o}")
    return VerifierResult(True, "atom-balance", f"O balances at {left_o} with {n} alcohols and one water out")


# ---------------------------------------------------------------------------
# 5. protecting groups  (ORG2.ACETALPROTECT)
# ---------------------------------------------------------------------------


def gen_acetal_protect(seed: int) -> Variant:
    v = _mc(
        "A molecule contains both a ketone and an ester, and you want to react "
        "the ester with a strong nucleophile without touching the ketone. Why "
        "convert the ketone to an acetal first?",
        "ORG2.ACETALPROTECT", "carbonyl.acetal_protect.v1",
        [
            ("An acetal has no C=O left, so there is nothing for the nucleophile to add to, "
             "and it can be removed afterwards.",
             None, {"electrophilic": False, "reversible": True}),
            ("An acetal is more electrophilic, so it reacts first and uses up the nucleophile.",
             "PROTECT-SACRIFICIAL-GROUP", {"electrophilic": True, "reversible": True}),
            ("An acetal is permanent, so the ketone is removed from the molecule for good.",
             "PROTECT-IS-PERMANENT", {"electrophilic": False, "reversible": False}),
        ],
        correct=0,
        source=(
            "A protecting group must be unreactive under the conditions it is "
            "protecting against AND removable afterwards; either alone is "
            "useless"
        ),
    )
    v.seed = seed
    return v


def ver_acetal_protect(v: Variant) -> VerifierResult:
    # Independent route: apply both defining properties of a protecting group.
    # It has to be inert to the reagent, and it has to come off again. A choice
    # missing either one fails, which separates the key from both distractors
    # without reading their prose.
    return _survivor_check(
        v,
        lambda c: (not c["electrophilic"]) and c["reversible"],
        "protecting-group-definition",
        "only the key is both unreactive to the nucleophile and removable",
    )


# ---------------------------------------------------------------------------
# 6. imine or enamine  (ORG2.IMINEENAMINE)
# ---------------------------------------------------------------------------


def gen_imine_enamine(seed: int) -> Variant:
    primary = seed % 2 == 0
    amine = "a primary amine (RNH2)" if primary else "a secondary amine (R2NH)"
    rows = [
        ("An imine, with a C=N double bond.", "IMINE-AMINE-CLASS-IGNORED", {"n_h_after_bond": 1}),
        ("An enamine, with a C=C double bond next to nitrogen.",
         "IMINE-AMINE-CLASS-IGNORED", {"n_h_after_bond": 0}),
    ]
    correct = 0 if primary else 1
    v = _mc(
        f"A ketone is condensed with {amine} under acid catalysis, losing "
        "water. What is the product?",
        "ORG2.IMINEENAMINE", "carbonyl.imine_enamine.v1", rows, correct,
        "After the nitrogen bonds to the carbonyl carbon, whether an N-H "
        "remains decides whether the double bond can go to nitrogen or must go "
        "to the adjacent carbon",
        primary=primary,
    )
    v.seed = seed
    return v


def ver_imine_enamine(v: Variant) -> VerifierResult:
    # Independent route: count the hydrogens left on nitrogen once it has bonded
    # to the carbonyl carbon. A primary amine started with two and keeps one, so
    # it can lose that one and form C=N. A secondary amine started with one and
    # keeps none, so the double bond has nowhere to go but the adjacent carbon.
    start = 2 if v.meta["primary"] else 1
    remaining = start - 1
    return _survivor_check(
        v,
        lambda c: c["n_h_after_bond"] == remaining,
        "nitrogen-hydrogen-count",
        f"nitrogen retains {remaining} H after bonding, so "
        f"{'C=N is available' if remaining else 'the double bond must go to carbon'}",
    )


# ---------------------------------------------------------------------------
# 7. the Wittig bond  (ORG2.WITTIG)
# ---------------------------------------------------------------------------


def gen_wittig(seed: int) -> Variant:
    v = _mc(
        "A ketone is treated with a phosphorus ylide. Where does the new "
        "carbon-carbon double bond appear?",
        "ORG2.WITTIG", "carbonyl.wittig.v1",
        [
            ("Exactly where the C=O was: the carbonyl carbon becomes one end of the new C=C.",
             None, {"new_bond_at_carbonyl_c": True, "oxygen_retained": False}),
            ("Between the two carbons next to the carbonyl, leaving the C=O intact.",
             "WITTIG-CARBONYL-SURVIVES", {"new_bond_at_carbonyl_c": False, "oxygen_retained": True}),
            ("Nowhere: the ylide adds without forming a double bond.",
             "WITTIG-IS-SIMPLE-ADDITION", {"new_bond_at_carbonyl_c": False, "oxygen_retained": True}),
        ],
        correct=0,
        source=(
            "The Wittig reaction exchanges the carbonyl oxygen for the ylide "
            "carbon, so the new alkene forms at the position the carbonyl "
            "occupied (Clayden Organic Chemistry)"
        ),
    )
    v.seed = seed
    return v


def ver_wittig(v: Variant) -> VerifierResult:
    # Independent route: follow the oxygen. It leaves on phosphorus, so it
    # cannot still be in the product, and the carbon it was double bonded to
    # must therefore be double bonded to something else. Any choice keeping the
    # oxygen is wrong by bookkeeping.
    return _survivor_check(
        v,
        lambda c: c["new_bond_at_carbonyl_c"] and not c["oxygen_retained"],
        "follow-the-oxygen",
        "the oxygen departs on phosphorus, so the new C=C sits where the C=O was",
    )


# ---------------------------------------------------------------------------
# 8. reductive amination order  (ORG2.REDUCTIVEAMINATION)
# ---------------------------------------------------------------------------
#
# Mechanism order only. No amine is named, no reagent quantity or condition is
# given, and no product is identified: the item asks which intermediate forms
# first, which is a statement about the pathway rather than a preparation.


def gen_reductive_amination(seed: int) -> Variant:
    v = _mc(
        "In a reductive amination, a ketone and an amine give an amine product. "
        "In what order do the two events happen?",
        "ORG2.REDUCTIVEAMINATION", "carbonyl.reductive_amination.v1",
        [
            ("Condensation first, forming a C=N intermediate, which is then reduced.",
             None, {"step1": "condense", "step2": "reduce"}),
            ("Reduction first, giving an alcohol, which the amine then displaces.",
             "REDAMINATION-REDUCE-FIRST", {"step1": "reduce", "step2": "condense"}),
            ("Both at once, in a single concerted step with no intermediate.",
             "REDAMINATION-CONCERTED", {"step1": "concerted", "step2": "concerted"}),
        ],
        correct=0,
        source=(
            "Reductive amination proceeds through an imine or iminium "
            "intermediate which is reduced in a separate step (Clayden Organic "
            "Chemistry)"
        ),
    )
    v.seed = seed
    return v


def ver_reductive_amination(v: Variant) -> VerifierResult:
    # Independent route: the reduction has to act on a C=N, and a C=N can only
    # exist after condensation. So condensation must come first, whatever the
    # keyed index says. Reducing first destroys the electrophile the amine
    # needs, which is why that ordering cannot work.
    return _survivor_check(
        v,
        lambda c: c["step1"] == "condense" and c["step2"] == "reduce",
        "intermediate-must-exist-first",
        "the reduced species is a C=N, which only exists after condensation",
    )


# ---------------------------------------------------------------------------
# 9. conjugate addition  (ORG2.CONJUGATEADDITION)
# ---------------------------------------------------------------------------


def gen_conjugate_addition(seed: int) -> Variant:
    v = _mc(
        "A soft, stabilised nucleophile is added to an alpha, beta unsaturated "
        "ketone. Where does it bond?",
        "ORG2.CONJUGATEADDITION", "carbonyl.conjugate_addition.v1",
        [
            ("At the beta carbon, giving 1,4 addition and leaving the C=O intact.",
             None, {"position": "beta", "carbonyl_survives": True}),
            ("At the carbonyl carbon, giving 1,2 addition and consuming the C=O.",
             "CONJUGATE-ALWAYS-1-2", {"position": "carbonyl", "carbonyl_survives": False}),
            ("At the alpha carbon, which is the one adjacent to the carbonyl.",
             "CONJUGATE-ALPHA-IS-ELECTROPHILIC", {"position": "alpha", "carbonyl_survives": True}),
        ],
        correct=0,
        source=(
            "Conjugation places partial positive charge on the beta carbon as "
            "well as the carbonyl carbon; soft nucleophiles add there under "
            "thermodynamic control (Clayden Organic Chemistry)"
        ),
    )
    v.seed = seed
    return v


def ver_conjugate_addition(v: Variant) -> VerifierResult:
    # Independent route: work out which carbons carry partial positive charge
    # by pushing the resonance arrows. Delocalisation from the C=O through the
    # C=C puts the charge on the carbonyl carbon and the beta carbon, never the
    # alpha. Among those two, the one that leaves the C=O intact is beta.
    electrophilic = {"carbonyl", "beta"}
    return _survivor_check(
        v,
        lambda c: c["position"] in electrophilic and c["carbonyl_survives"],
        "resonance-positions",
        "charge reaches the carbonyl and beta carbons; only beta keeps the C=O",
    )


# ---------------------------------------------------------------------------
# 10. degrees of unsaturation  (ORG2.CARBONYLSPECTRA)
# ---------------------------------------------------------------------------


def gen_dou(seed: int) -> Variant:
    carbons = 4 + (seed % 7)                  # C4 .. C10
    rings_and_pi = 1 + (seed % 4)             # 1 .. 4 degrees
    hydrogens = 2 * carbons + 2 - 2 * rings_and_pi
    oxygens = 1 + (seed % 2)                  # oxygen does not affect the count
    formula = f"C{carbons}H{hydrogens}O{oxygens}"
    return Variant(
        template_id="spectra.degrees_unsaturation.v1",
        seed=seed,
        prompt=(
            f"A compound has the molecular formula {formula}. How many degrees "
            "of unsaturation does it have? Report a whole number."
        ),
        key=str(rings_and_pi),
        node="ORG2.CARBONYLSPECTRA",
        grader="numeric",
        meta={
            "unit": "",
            "value": float(rings_and_pi),
            "carbons": carbons,
            "hydrogens": hydrogens,
            "oxygens": oxygens,
            "formula": formula,
            "sig_figs": None,
            "constant_source": _DOU_SOURCE,
        },
    )


def ver_dou(v: Variant) -> VerifierResult:
    # Independent route: reconstruct the formula from the answer. If the
    # compound really has this many degrees of unsaturation, then adding two
    # hydrogens per degree must give back the saturated acyclic parent,
    # C(n)H(2n+2). That check fails if oxygen was wrongly allowed to change the
    # count, which is the usual error.
    c, h = v.meta["carbons"], v.meta["hydrogens"]
    saturated = h + 2 * int(v.meta["value"])
    if saturated != 2 * c + 2:
        return VerifierResult(
            False, "saturate-back",
            f"adding {int(v.meta['value'])} x 2 H gives C{c}H{saturated}, not the parent C{c}H{2 * c + 2}",
        )
    if v.meta["value"] < 0:
        return VerifierResult(False, "saturate-back", "a negative degree count is impossible")
    return VerifierResult(
        True, "saturate-back",
        f"{v.meta['formula']} saturates to C{c}H{2 * c + 2} on adding {int(v.meta['value'])} pairs of H",
    )


# ---------------------------------------------------------------------------
# Registration data
# ---------------------------------------------------------------------------

TEMPLATES_ORG2_U5: dict[str, dict[str, object]] = {
    "carbonyl.structure.v1": {"gen": gen_carbonyl_structure, "ver": ver_carbonyl_structure,
                              "node": "ORG2.CARBONYLSTRUCTURE", "grader": "mc"},
    "carbonyl.prep.v1": {"gen": gen_carbonyl_prep, "ver": ver_carbonyl_prep,
                         "node": "ORG2.CARBONYLPREP", "grader": "mc"},
    "carbonyl.nuc_addition.v1": {"gen": gen_nuc_addition, "ver": ver_nuc_addition,
                                 "node": "ORG2.NUCADDITION", "grader": "mc"},
    "carbonyl.acetal_equivalents.v1": {"gen": gen_acetal, "ver": ver_acetal,
                                       "node": "ORG2.HYDRATEACETAL", "grader": "numeric"},
    "carbonyl.acetal_protect.v1": {"gen": gen_acetal_protect, "ver": ver_acetal_protect,
                                   "node": "ORG2.ACETALPROTECT", "grader": "mc"},
    "carbonyl.imine_enamine.v1": {"gen": gen_imine_enamine, "ver": ver_imine_enamine,
                                  "node": "ORG2.IMINEENAMINE", "grader": "mc"},
    "carbonyl.wittig.v1": {"gen": gen_wittig, "ver": ver_wittig,
                           "node": "ORG2.WITTIG", "grader": "mc"},
    "carbonyl.reductive_amination.v1": {"gen": gen_reductive_amination, "ver": ver_reductive_amination,
                                        "node": "ORG2.REDUCTIVEAMINATION", "grader": "mc"},
    "carbonyl.conjugate_addition.v1": {"gen": gen_conjugate_addition, "ver": ver_conjugate_addition,
                                       "node": "ORG2.CONJUGATEADDITION", "grader": "mc"},
    "spectra.degrees_unsaturation.v1": {"gen": gen_dou, "ver": ver_dou,
                                        "node": "ORG2.CARBONYLSPECTRA", "grader": "numeric"},
}


HINTS_ORG2_U5: dict[str, tuple[str, str, str]] = {
    "carbonyl.structure.v1": (
        "Count what surrounds the carbonyl carbon before deciding its shape.",
        "A double bond counts as one region of electron density, not two. Add "
        "the regions on the carbon itself and ignore the lone pairs, which are "
        "on oxygen and do not sit at this centre.",
        "Write down how many regions surround the carbon and read the VSEPR "
        "shape off that number.",
    ),
    "carbonyl.prep.v1": (
        "The class of the alcohol decides what it can become.",
        "Oxidation takes hydrogens off the carbon that carries the OH. Count "
        "how many that carbon has to start with, and see what is left after one "
        "is removed.",
        "Draw the carbon bearing the OH and count the hydrogens on it.",
    ),
    "carbonyl.nuc_addition.v1": (
        "A nucleophile is electron rich, so it seeks somewhere electron poor.",
        "The C=O bond is polarised. Decide which of the two atoms ends up "
        "partially positive, remembering that the more electronegative atom "
        "pulls density toward itself.",
        "Mark the partial charges on the carbon and the oxygen.",
    ),
    "carbonyl.acetal_equivalents.v1": (
        "Draw the acetal and count what is attached to the central carbon.",
        "The acetal carbon carries two OR groups where the carbonyl carried one "
        "O, and a molecule of water leaves. Balance the oxygens to find how many "
        "alcohols went in.",
        "Count oxygens on each side of the equation, including the water.",
    ),
    "carbonyl.acetal_protect.v1": (
        "A protecting group has to do two things, not one.",
        "It must be unreactive toward the reagent you are about to use, and it "
        "must come back off afterwards. Check each option against both.",
        "Ask of each answer: is it inert, and is it reversible.",
    ),
    "carbonyl.imine_enamine.v1": (
        "Both amines attack the carbonyl carbon. What differs is what happens "
        "next.",
        "After the nitrogen bonds, count the hydrogens still on it. Forming a "
        "C=N requires losing one from nitrogen; if there is none left, the "
        "double bond has to go somewhere else.",
        "Count the N-H bonds remaining once the nitrogen has attached.",
    ),
    "carbonyl.wittig.v1": (
        "Follow the oxygen and you will find the answer.",
        "The oxygen leaves the molecule entirely, taken by phosphorus. Whatever "
        "the carbonyl carbon was double bonded to, it must now be double bonded "
        "to the carbon the ylide brought.",
        "Ask where the oxygen has gone in the product.",
    ),
    "carbonyl.reductive_amination.v1": (
        "Two things happen. Ask what the reducing agent is acting on.",
        "The reduction has to have a C=N to work on, and a C=N does not exist "
        "until the amine and the carbonyl have condensed. That fixes the order.",
        "Decide which step creates the species the other step consumes.",
    ),
    "carbonyl.conjugate_addition.v1": (
        "Conjugation spreads the electrophilic character beyond the carbonyl "
        "carbon.",
        "Push the arrows from the C=O through the C=C and see which carbons end "
        "up bearing partial positive charge. It is not the one immediately next "
        "to the carbonyl.",
        "Label the alpha and beta carbons and mark where the charge lands.",
    ),
    "spectra.degrees_unsaturation.v1": (
        "The formula is being compared with a fully saturated one of the same "
        "carbon count.",
        "A saturated acyclic compound with n carbons has 2n+2 hydrogens. Every "
        "ring or pi bond costs two hydrogens. Oxygen changes nothing.",
        "Work out 2n+2 for this carbon count, subtract the hydrogens present, "
        "and stop before halving.",
    ),
}


MISCONCEPTIONS_ORG2_U5: dict[str, Misconception] = {
    m.code: m
    for m in [
        Misconception(
            code="CARBONYL-TETRAHEDRAL",
            name="The carbonyl carbon is tetrahedral",
            description=(
                "The learner counts the double bond as two regions of electron "
                "density and arrives at four, giving a tetrahedral centre."
            ),
            counterexample=(
                "A double bond is one region for VSEPR purposes. The carbonyl "
                "carbon has three regions and is flat, which is why nucleophiles "
                "can approach from either face."
            ),
            routes_to="ORG2.CARBONYLSTRUCTURE",
            source=_OBSERVED,
        ),
        Misconception(
            code="CARBONYL-OXYGEN-LONE-PAIRS-BEND-CARBON",
            name="Oxygen's lone pairs bend the geometry at carbon",
            description=(
                "The learner applies the lone pair repulsion rule at the wrong "
                "atom, letting oxygen's lone pairs distort the shape around the "
                "carbon."
            ),
            counterexample=(
                "Lone pairs affect the geometry of the atom they sit on. The "
                "carbon has none of its own, so its three regions stay at 120 "
                "degrees."
            ),
            routes_to="ORG2.CARBONYLSTRUCTURE",
            source=_OBSERVED,
        ),
        Misconception(
            code="PREP-ALCOHOL-CLASS-IGNORED",
            name="All alcohols oxidise to the same kind of carbonyl",
            description=(
                "The learner treats oxidation as a single transformation "
                "without checking how many hydrogens the carbinol carbon has to "
                "give up."
            ),
            counterexample=(
                "A secondary alcohol cannot become an aldehyde: its carbinol "
                "carbon has only one hydrogen, and an aldehyde needs one "
                "remaining after oxidation."
            ),
            routes_to="ORG2.CARBONYLPREP",
            source=_OBSERVED,
        ),
        Misconception(
            code="ADDITION-ATTACK-THE-ELECTRONEGATIVE-ATOM",
            name="Nucleophiles attack the electronegative atom",
            description=(
                "The learner associates reactivity with electronegativity and "
                "sends the nucleophile to oxygen rather than to the carbon the "
                "oxygen has made electron poor."
            ),
            counterexample=(
                "Two electron rich centres repel. The oxygen already holds the "
                "electron density; it is the carbon left short of it that the "
                "nucleophile bonds to."
            ),
            routes_to="ORG2.NUCADDITION",
            source=_OBSERVED,
        ),
        Misconception(
            code="ADDITION-PI-BOND-IS-SYMMETRIC",
            name="The C=O pi bond is shared evenly",
            description=(
                "The learner treats the carbonyl like an alkene, with electron "
                "density spread equally, so no position is preferred."
            ),
            counterexample=(
                "If the C=O were symmetric there would be no dipole and no "
                "reaction with nucleophiles at all. Its large dipole moment is "
                "the reason carbonyl chemistry exists."
            ),
            routes_to="ORG2.NUCADDITION",
            source=_OBSERVED,
        ),
        Misconception(
            code="PROTECT-SACRIFICIAL-GROUP",
            name="A protecting group works by reacting first",
            description=(
                "The learner imagines protection as a decoy that consumes the "
                "reagent, rather than as making the group unreactive."
            ),
            counterexample=(
                "A decoy would consume the nucleophile you need for the real "
                "step. Protection works by removing the reactive functionality, "
                "not by competing for the reagent."
            ),
            routes_to="ORG2.ACETALPROTECT",
            source=_OBSERVED,
        ),
        Misconception(
            code="PROTECT-IS-PERMANENT",
            name="Protection is a permanent change",
            description=(
                "The learner treats the protecting group as part of the target "
                "molecule and does not plan its removal."
            ),
            counterexample=(
                "A group that cannot be removed has not protected the ketone, "
                "it has replaced it. Reversibility is half the definition."
            ),
            routes_to="ORG2.ACETALPROTECT",
            source=_OBSERVED,
        ),
        Misconception(
            code="IMINE-AMINE-CLASS-IGNORED",
            name="Any amine plus a ketone gives an imine",
            description=(
                "The learner learns the imine condensation and applies it to "
                "secondary amines, where no N-H remains to be lost."
            ),
            counterexample=(
                "A secondary amine has one N-H, which is used up bonding to the "
                "carbonyl carbon. With none left, the double bond forms toward "
                "the adjacent carbon instead, giving an enamine."
            ),
            routes_to="ORG2.IMINEENAMINE",
            source=_OBSERVED,
        ),
        Misconception(
            code="WITTIG-CARBONYL-SURVIVES",
            name="The carbonyl is still there afterwards",
            description=(
                "The learner adds the ylide as a substituent without tracking "
                "that the oxygen leaves, so the product keeps a C=O it cannot "
                "have."
            ),
            counterexample=(
                "The oxygen is removed as part of a phosphorus oxide. There is "
                "no oxygen left in the organic product to form a C=O with."
            ),
            routes_to="ORG2.WITTIG",
            source=_OBSERVED,
        ),
        Misconception(
            code="WITTIG-IS-SIMPLE-ADDITION",
            name="The ylide simply adds across the C=O",
            description=(
                "The learner stops at the addition step and does not carry "
                "through the elimination that forms the alkene."
            ),
            counterexample=(
                "The four membered intermediate collapses, expelling the "
                "phosphorus oxide and creating the C=C. Stopping at addition "
                "leaves a species that does not survive."
            ),
            routes_to="ORG2.WITTIG",
            source=_OBSERVED,
        ),
        Misconception(
            code="REDAMINATION-REDUCE-FIRST",
            name="The carbonyl is reduced before the amine reacts",
            description=(
                "The learner performs the reduction first, producing an alcohol "
                "and then imagining the amine displacing it."
            ),
            counterexample=(
                "Reducing first destroys the electrophile. An alcohol is not "
                "displaced by an amine under these conditions, which is why the "
                "order is not interchangeable."
            ),
            routes_to="ORG2.REDUCTIVEAMINATION",
            source=_OBSERVED,
        ),
        Misconception(
            code="REDAMINATION-CONCERTED",
            name="Condensation and reduction happen together",
            description=(
                "The learner treats the overall transformation as one step, so "
                "the intermediate that the reducing agent acts on never exists."
            ),
            counterexample=(
                "The intermediate can be observed and in some cases isolated. "
                "A concerted picture also cannot explain why the choice of "
                "reducing agent matters."
            ),
            routes_to="ORG2.REDUCTIVEAMINATION",
            source=_OBSERVED,
        ),
        Misconception(
            code="CONJUGATE-ALWAYS-1-2",
            name="Nucleophiles always add to the carbonyl carbon",
            description=(
                "Having learned direct addition, the learner applies it to "
                "conjugated systems without considering the second "
                "electrophilic site."
            ),
            counterexample=(
                "Soft, stabilised nucleophiles add predominantly at the beta "
                "carbon of an enone, leaving the C=O untouched. That is why "
                "conjugate addition is a distinct reaction."
            ),
            routes_to="ORG2.CONJUGATEADDITION",
            source=_OBSERVED,
        ),
        Misconception(
            code="CONJUGATE-ALPHA-IS-ELECTROPHILIC",
            name="The alpha carbon is the electrophilic one",
            description=(
                "The learner picks the carbon nearest the carbonyl on the "
                "assumption that proximity means partial positive charge."
            ),
            counterexample=(
                "Pushing the resonance arrows places charge on the carbonyl "
                "carbon and the beta carbon. The alpha carbon never carries it, "
                "which is why it is nucleophilic in enolate chemistry instead."
            ),
            routes_to="ORG2.CONJUGATEADDITION",
            source=_OBSERVED,
        ),
    ]
}
