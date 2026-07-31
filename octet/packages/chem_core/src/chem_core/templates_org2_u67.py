"""ORG2 Units 6 and 7: carboxylic acids, nitriles and acid derivatives.

Thirteen nodes, thirteen templates, closing the last two units in the
curriculum that had lessons and no practice. With these registered, every unit
in all four courses can supply items, and a unit exam exists for every one.

Two units in one module because they are one story: unit 6 establishes the
acid and unit 7 works through what it can be converted into, and the
reactivity ordering that runs through unit 7 is the same argument about leaving
group ability that unit 6 makes about acidity.

SECTION 18

Acid chlorides and anhydrides are reactive acylating agents. Every item here is
about relative reactivity, mechanism and stoichiometry, in the abstract. No
prompt, key, hint or distractor names a reagent quantity, a temperature, a
solvent, a time, an order of addition or a work up, and no specific compound is
targeted for preparation.

VERIFIERS

The reactivity ordering item verifies by SORTING rather than by recall: each
derivative carries a leaving group stability score as data, the verifier sorts
on it independently, and the resulting order must match the keyed rank. The
stoichiometry items balance atoms. The conceptual items apply a rule to every
choice and require exactly one survivor, which proves the item is diagnostic
and internally consistent, not that the data is right; that limit is the same
one stated in templates_org2_u5.py and is worth reading there.

Registration into REGISTRY, HINTS and MISCONCEPTIONS is done by the registry
wiring, not by this module.
"""

from __future__ import annotations

from .mc import validate_choices
from .misconceptions import Misconception
from .registry import Variant
from .types import VerifierResult

_OBSERVED = "Instructor observation; not traced to a published study"

_ACIDITY_SOURCE = (
    "Carboxylic acids are far more acidic than alcohols because the conjugate "
    "base delocalises the negative charge over two equivalent oxygens "
    "(Clayden Organic Chemistry)"
)
_ACYL_SOURCE = (
    "Nucleophilic acyl substitution proceeds by addition to give a tetrahedral "
    "intermediate, which then expels the leaving group (Clayden Organic "
    "Chemistry)"
)

# Acid derivatives with a leaving group stability score. Higher means a more
# stable leaving group, hence a more reactive derivative. The scores are an
# ordinal encoding of the standard ordering, carried as data so the verifier
# can sort independently rather than being told the ranking.
DERIVATIVES = (
    ("acid chloride", 4, "chloride, the conjugate base of a strong acid"),
    ("anhydride", 3, "a carboxylate, delocalised over two oxygens"),
    ("ester", 2, "an alkoxide, localised on one oxygen"),
    ("amide", 1, "an amide anion, the conjugate base of a very weak acid"),
)


def _mc(prompt, node, tid, rows, correct, source, seed=0, **extra):
    choices = []
    for i, row in enumerate(rows):
        choice = {"index": i, "text": row[0], "misconception": None if i == correct else row[1]}
        choice.update(row[2])
        choices.append(choice)
    meta = {"choices": choices, "correct_index": correct, "constant_source": source}
    meta.update(extra)
    return Variant(
        template_id=tid, seed=seed, prompt=prompt, key=str(correct),
        node=node, grader="mc", meta=meta,
    )


def _survivor_check(v: Variant, predicate, method: str, note: str) -> VerifierResult:
    surviving = [c["index"] for c in v.meta["choices"] if predicate(c)]
    if surviving != [v.meta["correct_index"]]:
        return VerifierResult(
            False, method, f"choices satisfying the rule are {surviving}, key is {v.meta['correct_index']}"
        )
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, method, "; ".join(problems))
    return VerifierResult(True, method, note)


# ===========================================================================
# ORG2 Unit 6: carboxylic acids and nitriles
# ===========================================================================


# --- 1. why acids are acidic  (ORG2.ACIDPROPS) -----------------------------


def gen_acid_props(seed: int) -> Variant:
    return _mc(
        "A carboxylic acid is roughly ten billion times more acidic than an "
        "alcohol of similar size. What accounts for the difference?",
        "ORG2.ACIDPROPS", "acid.acidity_origin.v1",
        [
            ("The conjugate base spreads its negative charge over two equivalent oxygens.",
             None, {"charge_delocalised_over": 2}),
            ("The O-H bond is weaker, so the proton comes off more easily.",
             "ACIDITY-FROM-BOND-STRENGTH", {"charge_delocalised_over": 1}),
            ("The carbonyl oxygen pulls the proton off inductively before any base arrives.",
             "ACIDITY-IS-SELF-IONISATION", {"charge_delocalised_over": 1}),
        ],
        correct=0, source=_ACIDITY_SOURCE, seed=seed,
    )


def ver_acid_props(v: Variant) -> VerifierResult:
    # Independent route: acidity is decided by the stability of the conjugate
    # base, and charge spread over more atoms is more stable. Apply that rule
    # and take whichever choice claims the greatest delocalisation.
    best = max(c["charge_delocalised_over"] for c in v.meta["choices"])
    return _survivor_check(
        v,
        lambda c: c["charge_delocalised_over"] == best and best > 1,
        "conjugate-base-stability",
        f"the winning explanation spreads charge over {best} atoms",
    )


# --- 2. substituent effects on acidity  (ORG2.ACIDSUBSTITUENT) -------------


def gen_acid_substituent(seed: int) -> Variant:
    # Given problem data: two acids differing only in a substituent, described
    # by whether it withdraws electron density.
    n_halogens = 1 + (seed % 3)
    return _mc(
        f"Acid P is a simple carboxylic acid. Acid Q is the same acid with "
        f"{n_halogens} electron withdrawing halogen(s) placed on the carbon "
        "next to the COOH group. Which is the stronger acid, and why?",
        "ORG2.ACIDSUBSTITUENT", "acid.substituent.v1",
        [
            ("Q, because the halogens pull density away from the carboxylate and stabilise it.",
             None, {"stabilises_conjugate_base": True}),
            ("P, because the halogens make the molecule larger and harder to ionise.",
             "ACIDSUB-SIZE-DECIDES", {"stabilises_conjugate_base": False}),
            ("Neither, because substituents on the neighbouring carbon are too far to matter.",
             "ACIDSUB-INDUCTION-DOES-NOT-REACH", {"stabilises_conjugate_base": False}),
        ],
        correct=0,
        source=(
            "Electron withdrawing groups near the carboxyl stabilise the "
            "carboxylate and therefore increase acidity; the effect falls off "
            "sharply with distance"
        ),
        seed=seed, n_halogens=n_halogens,
    )


def ver_acid_substituent(v: Variant) -> VerifierResult:
    # Independent route: same rule as the item above, applied to substituents.
    # Anything that stabilises the conjugate base increases acidity. Exactly one
    # choice may claim that.
    return _survivor_check(
        v,
        lambda c: c["stabilises_conjugate_base"],
        "conjugate-base-stability",
        f"{v.meta['n_halogens']} withdrawing group(s) stabilise the carboxylate",
    )


# --- 3. carbon count in acid synthesis  (ORG2.ACIDSYNTH) -------------------


def gen_acid_synth(seed: int) -> Variant:
    start_carbons = 3 + (seed % 6)
    via_co2 = seed % 2 == 0
    if via_co2:
        route = "an organometallic reagent is added to carbon dioxide"
        gained = 1
    else:
        route = "a primary alcohol is oxidised"
        gained = 0
    total = start_carbons + gained
    return Variant(
        template_id="acid.carbon_count.v1",
        seed=seed,
        prompt=(
            f"A carboxylic acid is made from a {start_carbons} carbon starting "
            f"material by a route in which {route}. How many carbons does the "
            "acid product contain? Report a whole number."
        ),
        key=str(total),
        node="ORG2.ACIDSYNTH",
        grader="numeric",
        meta={
            "unit": "",
            "value": float(total),
            "start_carbons": start_carbons,
            "gained": gained,
            "via_co2": via_co2,
            "sig_figs": None,
            "constant_source": (
                "Carbon dioxide contributes its carbon to the product, so that "
                "route lengthens the chain by one; oxidation of an alcohol "
                "changes the oxidation level without changing the carbon count"
            ),
        },
    )


def ver_acid_synth(v: Variant) -> VerifierResult:
    # Independent route: carbon conservation. Count the carbons entering from
    # every source and require the total. Carbon dioxide brings exactly one;
    # an oxidant brings none.
    from_substrate = v.meta["start_carbons"]
    from_reagent = 1 if v.meta["via_co2"] else 0
    total = from_substrate + from_reagent
    if total != int(v.meta["value"]):
        return VerifierResult(
            False, "carbon-conservation",
            f"{from_substrate} + {from_reagent} = {total}, key says {int(v.meta['value'])}",
        )
    if from_reagent != v.meta["gained"]:
        return VerifierResult(False, "carbon-conservation", "the stated gain disagrees with the route")
    return VerifierResult(
        True, "carbon-conservation", f"{from_substrate} carbons in, {from_reagent} from the reagent, {total} out"
    )


# --- 4. nitrile hydrolysis carbon count  (ORG2.NITRILES) -------------------


def gen_nitriles(seed: int) -> Variant:
    chain_carbons = 3 + (seed % 6)     # carbons in the alkyl part
    total = chain_carbons + 1          # the nitrile carbon becomes the acid carbon
    return Variant(
        template_id="nitrile.hydrolysis_count.v1",
        seed=seed,
        prompt=(
            f"A nitrile has {chain_carbons} carbons in its alkyl group, plus the "
            "nitrile carbon itself. It is completely hydrolysed to a carboxylic "
            "acid. How many carbons does the acid contain? Report a whole "
            "number."
        ),
        key=str(total),
        node="ORG2.NITRILES",
        grader="numeric",
        meta={
            "unit": "",
            "value": float(total),
            "chain_carbons": chain_carbons,
            "sig_figs": None,
            "constant_source": (
                "Hydrolysis converts the C-N triple bond to a carboxyl group; "
                "the nitrile carbon becomes the carboxyl carbon and no carbon "
                "is lost or gained"
            ),
        },
    )


def ver_nitriles(v: Variant) -> VerifierResult:
    # Independent route: track each carbon through the transformation. The
    # alkyl carbons are untouched, and the nitrile carbon is retained as the
    # carboxyl carbon, so nothing is lost. Nitrogen leaves, carbon does not.
    retained = v.meta["chain_carbons"] + 1
    if retained != int(v.meta["value"]):
        return VerifierResult(
            False, "atom-tracking", f"tracking gives {retained} carbons, key says {int(v.meta['value'])}"
        )
    return VerifierResult(
        True, "atom-tracking",
        f"{v.meta['chain_carbons']} alkyl carbons plus the nitrile carbon, none lost, gives {retained}",
    )


# --- 5. spectroscopic distinction  (ORG2.ACIDSPECTRA) ----------------------


def gen_acid_spectra(seed: int) -> Variant:
    return _mc(
        "Two samples are known to be a carboxylic acid and its corresponding "
        "nitrile. Which observation distinguishes them most directly?",
        "ORG2.ACIDSPECTRA", "acid.spectra_distinction.v1",
        [
            ("A very broad O-H absorption, present in one spectrum and absent from the other.",
             None, {"distinguishes": True, "present_in_both": False}),
            ("A C-H absorption, since only the acid contains hydrogen.",
             "SPECTRA-CH-DISTINGUISHES", {"distinguishes": False, "present_in_both": True}),
            ("The molecular ion, since both compounds have the same mass.",
             "SPECTRA-SAME-MASS-ASSUMED", {"distinguishes": False, "present_in_both": True}),
        ],
        correct=0,
        source=(
            "A feature can only distinguish two compounds if it is present in "
            "one and absent from the other; a band both show carries no "
            "information"
        ),
        seed=seed,
    )


def ver_acid_spectra(v: Variant) -> VerifierResult:
    # Independent route: the definition of a diagnostic observation. It must
    # differ between the two samples. Anything present in both cannot separate
    # them, whatever else is true about it.
    return _survivor_check(
        v,
        lambda c: c["distinguishes"] and not c["present_in_both"],
        "must-differ-between-samples",
        "only a feature absent from one of the two spectra can distinguish them",
    )


# ===========================================================================
# ORG2 Unit 7: carboxylic acid derivatives
# ===========================================================================


# --- 6. reactivity ranking  (ORG2.DERIVATIVEREACTIVITY) --------------------


def gen_derivative_rank(seed: int) -> Variant:
    name, score, leaving = DERIVATIVES[seed % len(DERIVATIVES)]
    # Rank 1 is the most reactive.
    ordered = sorted(DERIVATIVES, key=lambda d: -d[1])
    rank = [d[0] for d in ordered].index(name) + 1
    return Variant(
        template_id="derivative.reactivity_rank.v1",
        seed=seed,
        prompt=(
            "Rank the four carboxylic acid derivatives by reactivity toward "
            "nucleophilic acyl substitution, with 1 as the most reactive: acid "
            f"chloride, anhydride, ester, amide. What rank does the {name} "
            "hold? Report a whole number from 1 to 4."
        ),
        key=str(rank),
        node="ORG2.DERIVATIVEREACTIVITY",
        grader="numeric",
        meta={
            "unit": "",
            "value": float(rank),
            "name": name,
            "score": score,
            "leaving": leaving,
            "sig_figs": None,
            "constant_source": (
                "Reactivity toward acyl substitution follows leaving group "
                "stability: the better the leaving group, the more reactive the "
                "derivative (Clayden Organic Chemistry)"
            ),
        },
    )


def ver_derivative_rank(v: Variant) -> VerifierResult:
    # Independent route: sort. Order the four derivatives by the stability of
    # the leaving group they expel, which is the cause the node teaches, and
    # read the position of the named one off that sorted list. The generator
    # produced a rank; this derives it from the scores.
    ordered = sorted(DERIVATIVES, key=lambda d: -d[1])
    derived = [d[0] for d in ordered].index(v.meta["name"]) + 1
    if derived != int(v.meta["value"]):
        return VerifierResult(
            False, "sort-by-leaving-group",
            f"sorting puts {v.meta['name']} at {derived}, key says {int(v.meta['value'])}",
        )
    scores = [d[1] for d in ordered]
    if scores != sorted(scores, reverse=True) or len(set(scores)) != len(scores):
        return VerifierResult(False, "sort-by-leaving-group", "the ranking is not a strict total order")
    return VerifierResult(
        True, "sort-by-leaving-group",
        f"{v.meta['name']} ranks {derived}: it expels {v.meta['leaving']}",
    )


# --- 7. the acyl substitution mechanism  (ORG2.ACYLSUB) --------------------


def gen_acyl_sub(seed: int) -> Variant:
    return _mc(
        "How does a nucleophile replace the group attached to an acyl carbon in "
        "an ester or amide?",
        "ORG2.ACYLSUB", "derivative.acyl_mechanism.v1",
        [
            ("It adds first, giving a tetrahedral intermediate, which then expels the leaving group.",
             None, {"has_intermediate": True, "backside": False}),
            ("It attacks from the opposite side as the leaving group departs, in one concerted step.",
             "ACYLSUB-IS-SN2", {"has_intermediate": False, "backside": True}),
            ("The leaving group departs first, giving a carbocation the nucleophile then captures.",
             "ACYLSUB-IS-SN1", {"has_intermediate": False, "backside": False}),
        ],
        correct=0, source=_ACYL_SOURCE, seed=seed,
    )


def ver_acyl_sub(v: Variant) -> VerifierResult:
    # Independent route: the carbonyl gives this mechanism an option the
    # saturated cases lack. Because the pi bond can accept the electron pair,
    # addition is possible without breaking anything, so an intermediate exists
    # and neither a concerted backside attack nor a free cation is required.
    return _survivor_check(
        v,
        lambda c: c["has_intermediate"] and not c["backside"],
        "carbonyl-accepts-first",
        "the pi bond absorbs the incoming pair, so a tetrahedral intermediate forms",
    )


# --- 8. acid chlorides and anhydrides  (ORG2.ACIDCHLORIDE) -----------------


def gen_acid_chloride(seed: int) -> Variant:
    return _mc(
        "Acid chlorides react with nucleophiles far faster than esters do. What "
        "is the main reason?",
        "ORG2.ACIDCHLORIDE", "derivative.acid_chloride.v1",
        [
            ("Chloride is a much more stable leaving group than an alkoxide.",
             None, {"about_leaving_group": True}),
            ("Chlorine is heavier, so the bond to it breaks under its own weight.",
             "DERIV-MASS-EXPLAINS-REACTIVITY", {"about_leaving_group": False}),
            ("Acid chlorides are smaller, so nucleophiles reach the carbon more easily.",
             "DERIV-STERICS-EXPLAIN-EVERYTHING", {"about_leaving_group": False}),
        ],
        correct=0,
        source=(
            "The rate difference across the derivative series tracks leaving "
            "group stability, not size or mass"
        ),
        seed=seed,
    )


def ver_acid_chloride(v: Variant) -> VerifierResult:
    # Independent route: the explanation has to be the same one that orders the
    # whole series, otherwise it is a coincidence rather than a reason. The
    # series is ordered by leaving group stability, so only an explanation about
    # the leaving group can be right.
    return _survivor_check(
        v,
        lambda c: c["about_leaving_group"],
        "must-explain-the-whole-series",
        "leaving group stability orders all four derivatives, so it is the operative cause",
    )


# --- 9. Fischer esterification equilibrium  (ORG2.ESTERS) ------------------


def gen_esters(seed: int) -> Variant:
    return _mc(
        "An acid and an alcohol are combined under acid catalysis to form an "
        "ester and water. What limits how much ester forms?",
        "ORG2.ESTERS", "derivative.fischer_equilibrium.v1",
        [
            ("The reaction is an equilibrium, so it stops short unless water is removed or one reagent is used in excess.",
             None, {"equilibrium": True, "goes_to_completion": False}),
            ("The reaction goes to completion, so the yield is limited only by how pure the reagents are.",
             "ESTER-GOES-TO-COMPLETION", {"equilibrium": False, "goes_to_completion": True}),
            ("The catalyst is consumed, so the reaction stops when it runs out.",
             "ESTER-CATALYST-CONSUMED", {"equilibrium": False, "goes_to_completion": False}),
        ],
        correct=0,
        source=(
            "Fischer esterification is reversible; hydrolysis is the same "
            "mechanism run backwards, which is why the position of equilibrium "
            "is what has to be manipulated"
        ),
        seed=seed,
    )


def ver_esters(v: Variant) -> VerifierResult:
    # Independent route: every step of this mechanism is reversible and the
    # reverse reaction, hydrolysis, is a reaction the course teaches separately.
    # A transformation whose exact reverse is also a known reaction cannot go to
    # completion. And a catalyst is by definition not consumed.
    return _survivor_check(
        v,
        lambda c: c["equilibrium"] and not c["goes_to_completion"],
        "reverse-reaction-exists",
        "hydrolysis is this mechanism run backwards, so the system reaches equilibrium",
    )


# --- 10. amide stability  (ORG2.AMIDES) ------------------------------------


def gen_amides(seed: int) -> Variant:
    return _mc(
        "Amides are the least reactive of the acid derivatives toward "
        "nucleophilic acyl substitution. Why?",
        "ORG2.AMIDES", "derivative.amide_stability.v1",
        [
            ("The nitrogen lone pair is donated into the carbonyl, and the leaving group would be a very unstable anion.",
             None, {"donates_into_carbonyl": True, "poor_leaving_group": True}),
            ("Nitrogen is less electronegative than oxygen, so the carbonyl carbon is not electrophilic at all.",
             "AMIDE-CARBONYL-NOT-ELECTROPHILIC", {"donates_into_carbonyl": False, "poor_leaving_group": True}),
            ("Amides are simply larger, so nucleophiles cannot reach the carbon.",
             "DERIV-STERICS-EXPLAIN-EVERYTHING", {"donates_into_carbonyl": False, "poor_leaving_group": False}),
        ],
        correct=0,
        source=(
            "Two effects reinforce each other in amides: resonance donation "
            "from nitrogen reduces the electrophilicity of the carbonyl, and "
            "the leaving group would be an amide anion"
        ),
        seed=seed,
    )


def ver_amides(v: Variant) -> VerifierResult:
    # Independent route: an explanation for the extreme of a series should name
    # both contributing effects, and both are required here. A choice naming
    # only one, or neither, does not explain why amides sit at the bottom rather
    # than merely below esters.
    return _survivor_check(
        v,
        lambda c: c["donates_into_carbonyl"] and c["poor_leaving_group"],
        "both-effects-required",
        "resonance donation and a very poor leaving group together put amides last",
    )


# --- 11. reduction outcome  (ORG2.DERIVATIVEREDUCTION) ---------------------


def gen_derivative_reduction(seed: int) -> Variant:
    is_amide = seed % 2 == 0
    substrate = "an amide" if is_amide else "an ester"
    rows = [
        ("An amine, because the C-N bond survives the reduction.",
         "REDUCTION-PRODUCT-CLASS-CONFUSED", {"keeps_nitrogen": True}),
        ("An alcohol, because the C-O bond to the leaving group is broken.",
         "REDUCTION-PRODUCT-CLASS-CONFUSED", {"keeps_nitrogen": False}),
    ]
    correct = 0 if is_amide else 1
    return _mc(
        f"Complete reduction of {substrate} with a strong hydride reagent gives "
        "what class of product?",
        "ORG2.DERIVATIVEREDUCTION", "derivative.reduction.v1", rows, correct,
        (
            "Which heteroatom stays attached to the carbon decides the product "
            "class: the C-N bond of an amide is retained, while the ester's "
            "C-O bond to the alkoxy group is broken"
        ),
        seed=seed, is_amide=is_amide,
    )


def ver_derivative_reduction(v: Variant) -> VerifierResult:
    # Independent route: ask which heteroatom is still bonded to the carbon at
    # the end. For an amide the nitrogen is retained, giving an amine; for an
    # ester the alkoxy oxygen leaves, so the carbon ends up with hydrogens and
    # an OH, giving an alcohol.
    keeps_n = v.meta["is_amide"]
    return _survivor_check(
        v,
        lambda c: c["keeps_nitrogen"] == keeps_n,
        "which-heteroatom-remains",
        f"{'nitrogen is retained, giving an amine' if keeps_n else 'the alkoxy group leaves, giving an alcohol'}",
    )


# --- 12. organometallic equivalents  (ORG2.DERIVATIVEORGANOMETALLIC) -------


def gen_organometallic(seed: int) -> Variant:
    on_ester = seed % 2 == 0
    substrate = "an ester" if on_ester else "an aldehyde"
    equivalents = 2 if on_ester else 1
    return Variant(
        template_id="derivative.organometallic_equivalents.v1",
        seed=seed,
        prompt=(
            f"How many equivalents of an organometallic reagent are consumed "
            f"when it reacts with {substrate} to give the fully substituted "
            "alcohol product? Report a whole number."
        ),
        key=str(equivalents),
        node="ORG2.DERIVATIVEORGANOMETALLIC",
        grader="numeric",
        meta={
            "unit": "",
            "value": float(equivalents),
            "on_ester": on_ester,
            "sig_figs": None,
            "constant_source": (
                "An ester's first addition expels the alkoxide to give a ketone, "
                "which is more reactive than the ester and is attacked again; an "
                "aldehyde has no leaving group and stops after one addition"
            ),
        },
    )


def ver_organometallic(v: Variant) -> VerifierResult:
    # Independent route: count the electrophilic carbonyls the reagent meets.
    # An ester presents one, and the ketone produced by expelling the alkoxide
    # is a second, more reactive one. An aldehyde presents one and produces an
    # alkoxide that cannot be attacked again.
    carbonyls_encountered = 2 if v.meta["on_ester"] else 1
    if carbonyls_encountered != int(v.meta["value"]):
        return VerifierResult(
            False, "count-the-electrophiles",
            f"the reagent meets {carbonyls_encountered} carbonyl(s), key says {int(v.meta['value'])}",
        )
    if v.meta["on_ester"] and carbonyls_encountered < 2:
        return VerifierResult(False, "count-the-electrophiles", "the ketone intermediate was not counted")
    return VerifierResult(
        True, "count-the-electrophiles",
        f"{'ester: carbonyl then the ketone it becomes' if v.meta['on_ester'] else 'aldehyde: one carbonyl only'}",
    )


# --- 13. condensation polymers  (ORG2.POLYMERS) ----------------------------


def gen_polymers(seed: int) -> Variant:
    two_monomers = seed % 2 == 0
    if two_monomers:
        description = (
            "a diacid and a diamine are polymerised together, each contributing "
            "two reactive ends"
        )
        answer = 2
    else:
        description = (
            "a single monomer carrying both an acid group and an amine group at "
            "opposite ends is polymerised"
        )
        answer = 1
    return Variant(
        template_id="polymer.monomer_count.v1",
        seed=seed,
        prompt=(
            f"A polyamide is made by a condensation in which {description}. How "
            "many chemically distinct monomers does the polymer require? Report "
            "a whole number."
        ),
        key=str(answer),
        node="ORG2.POLYMERS",
        grader="numeric",
        meta={
            "unit": "",
            "value": float(answer),
            "two_monomers": two_monomers,
            "sig_figs": None,
            "constant_source": (
                "A condensation polymer needs two complementary functional "
                "groups; they may sit on two different monomers or on the two "
                "ends of one"
            ),
        },
    )


def ver_polymers(v: Variant) -> VerifierResult:
    # Independent route: count the functional group types and where they sit.
    # Amide formation needs an acid end and an amine end. If one monomer carries
    # both, one monomer suffices; if each carries only one kind, two are needed.
    groups_needed = {"acid", "amine"}
    per_monomer = groups_needed if not v.meta["two_monomers"] else {"acid"}
    derived = 1 if per_monomer == groups_needed else 2
    if derived != int(v.meta["value"]):
        return VerifierResult(
            False, "functional-group-count",
            f"a monomer carrying {sorted(per_monomer)} implies {derived} monomer type(s), "
            f"key says {int(v.meta['value'])}",
        )
    return VerifierResult(
        True, "functional-group-count",
        f"amide formation needs {sorted(groups_needed)}; {derived} monomer type(s) supply them",
    )


# ---------------------------------------------------------------------------
# Registration data
# ---------------------------------------------------------------------------

TEMPLATES_ORG2_U67: dict[str, dict[str, object]] = {
    "acid.acidity_origin.v1": {"gen": gen_acid_props, "ver": ver_acid_props,
                               "node": "ORG2.ACIDPROPS", "grader": "mc"},
    "acid.substituent.v1": {"gen": gen_acid_substituent, "ver": ver_acid_substituent,
                            "node": "ORG2.ACIDSUBSTITUENT", "grader": "mc"},
    "acid.carbon_count.v1": {"gen": gen_acid_synth, "ver": ver_acid_synth,
                             "node": "ORG2.ACIDSYNTH", "grader": "numeric"},
    "nitrile.hydrolysis_count.v1": {"gen": gen_nitriles, "ver": ver_nitriles,
                                    "node": "ORG2.NITRILES", "grader": "numeric"},
    "acid.spectra_distinction.v1": {"gen": gen_acid_spectra, "ver": ver_acid_spectra,
                                    "node": "ORG2.ACIDSPECTRA", "grader": "mc"},
    "derivative.reactivity_rank.v1": {"gen": gen_derivative_rank, "ver": ver_derivative_rank,
                                      "node": "ORG2.DERIVATIVEREACTIVITY", "grader": "numeric"},
    "derivative.acyl_mechanism.v1": {"gen": gen_acyl_sub, "ver": ver_acyl_sub,
                                     "node": "ORG2.ACYLSUB", "grader": "mc"},
    "derivative.acid_chloride.v1": {"gen": gen_acid_chloride, "ver": ver_acid_chloride,
                                    "node": "ORG2.ACIDCHLORIDE", "grader": "mc"},
    "derivative.fischer_equilibrium.v1": {"gen": gen_esters, "ver": ver_esters,
                                          "node": "ORG2.ESTERS", "grader": "mc"},
    "derivative.amide_stability.v1": {"gen": gen_amides, "ver": ver_amides,
                                      "node": "ORG2.AMIDES", "grader": "mc"},
    "derivative.reduction.v1": {"gen": gen_derivative_reduction, "ver": ver_derivative_reduction,
                                "node": "ORG2.DERIVATIVEREDUCTION", "grader": "mc"},
    "derivative.organometallic_equivalents.v1": {
        "gen": gen_organometallic, "ver": ver_organometallic,
        "node": "ORG2.DERIVATIVEORGANOMETALLIC", "grader": "numeric"},
    "polymer.monomer_count.v1": {"gen": gen_polymers, "ver": ver_polymers,
                                 "node": "ORG2.POLYMERS", "grader": "numeric"},
}


HINTS_ORG2_U67: dict[str, tuple[str, str, str]] = {
    "acid.acidity_origin.v1": (
        "Acidity is about what is left behind, not about the proton leaving.",
        "Compare the two conjugate bases. One puts its negative charge on a "
        "single oxygen; the other can spread it. Charge spread over more atoms "
        "is more stable, and a more stable base means a stronger acid.",
        "Draw the carboxylate and count how many oxygens share the charge.",
    ),
    "acid.substituent.v1": (
        "The substituent is not on the acidic group itself, so ask what it does "
        "to the ion left behind.",
        "An electron withdrawing group near the carboxylate pulls density away "
        "from the negative charge, which stabilises it. A more stable "
        "conjugate base means a stronger acid.",
        "Decide whether the halogens make the carboxylate more or less stable.",
    ),
    "acid.carbon_count.v1": (
        "Count carbons in and carbons out. The question is whether the reagent "
        "brings one.",
        "Carbon dioxide contributes its own carbon to the product, lengthening "
        "the chain. An oxidation changes what is attached to a carbon without "
        "adding any.",
        "Ask whether the reagent named in the route contains carbon.",
    ),
    "nitrile.hydrolysis_count.v1": (
        "Follow the nitrile carbon through the reaction.",
        "The carbon of the C-N triple bond is not lost. It becomes the carboxyl "
        "carbon of the acid, and the nitrogen leaves as ammonia or ammonium.",
        "Add the alkyl carbons to the nitrile carbon.",
    ),
    "acid.spectra_distinction.v1": (
        "A feature only distinguishes two things if they differ in it.",
        "Rule out anything both compounds would show. Then look for a "
        "functional group present in one and absent from the other.",
        "Ask which of the two compounds has an O-H bond.",
    ),
    "derivative.reactivity_rank.v1": (
        "The four derivatives differ in what has to leave when a nucleophile "
        "attacks.",
        "Order them by how stable that departing group is as an anion. A stable "
        "anion is easy to expel, which makes the derivative reactive.",
        "Rank the four leaving groups by the strength of their conjugate acids, "
        "then count to the one you were asked about.",
    ),
    "derivative.acyl_mechanism.v1": (
        "This is not the substitution mechanism you learned for saturated "
        "carbon.",
        "The carbonyl pi bond can accept the incoming electron pair, so the "
        "nucleophile can bond before anything has to leave. That gives an "
        "intermediate a saturated carbon could never form.",
        "Ask whether the carbon can hold five bonds temporarily, and what "
        "absorbs the extra pair if it cannot.",
    ),
    "derivative.acid_chloride.v1": (
        "Whatever explains this difference should also explain the rest of the "
        "series.",
        "Compare what leaves in each case. Chloride is the conjugate base of a "
        "strong acid and so is very stable; an alkoxide is not.",
        "Ask which explanation would also order esters against amides.",
    ),
    "derivative.fischer_equilibrium.v1": (
        "Ask whether the reverse of this reaction is something you have seen.",
        "Ester hydrolysis is this exact mechanism run backwards under the same "
        "catalysis. When both directions are available, the system settles at "
        "equilibrium rather than going to completion.",
        "Name the reverse reaction and decide whether it is possible under the "
        "same conditions.",
    ),
    "derivative.amide_stability.v1": (
        "Amides sit at the bottom of the series, so look for more than one "
        "reason.",
        "Two effects work together: the nitrogen lone pair is delocalised into "
        "the carbonyl, making the carbon less electrophilic, and the group that "
        "would have to leave is an extremely unstable anion.",
        "Check each answer for whether it accounts for both.",
    ),
    "derivative.reduction.v1": (
        "Ask which atom is still attached to the carbon when the reaction "
        "finishes.",
        "In an amide the carbon-nitrogen bond survives the reduction, so "
        "nitrogen is in the product. In an ester the bond to the alkoxy oxygen "
        "is broken instead.",
        "Decide whether the heteroatom stays or leaves.",
    ),
    "derivative.organometallic_equivalents.v1": (
        "Count how many electrophilic carbonyls the reagent actually meets.",
        "An ester's first addition expels a leaving group and produces a ketone, "
        "which is MORE reactive than the ester was, so it is attacked again. A "
        "compound with no leaving group cannot do that.",
        "Ask whether the product of the first addition is itself a carbonyl.",
    ),
    "polymer.monomer_count.v1": (
        "An amide bond needs an acid end and an amine end. Ask where each comes "
        "from.",
        "Both can sit on separate molecules, or both can sit on opposite ends of "
        "the same one. Either arrangement can polymerise; they differ in how "
        "many distinct monomers are required.",
        "Look at whether the described monomer carries both groups or just one.",
    ),
}


MISCONCEPTIONS_ORG2_U67: dict[str, Misconception] = {
    m.code: m
    for m in [
        Misconception(
            code="ACIDITY-FROM-BOND-STRENGTH",
            name="Acidity is set by O-H bond strength",
            description=(
                "The learner explains acidity by how easily the O-H bond breaks "
                "rather than by how stable the resulting anion is."
            ),
            counterexample=(
                "The O-H bonds of a carboxylic acid and an alcohol are of "
                "similar strength, yet the acids are around ten orders of "
                "magnitude more acidic. The difference is in the anion."
            ),
            routes_to="ORG2.ACIDPROPS",
            source=_OBSERVED,
        ),
        Misconception(
            code="ACIDITY-IS-SELF-IONISATION",
            name="The acid ionises itself without a base",
            description=(
                "The learner pictures the proton being pulled off internally, "
                "with no proton acceptor involved."
            ),
            counterexample=(
                "Acidity is always measured against a base. A carboxylic acid in "
                "the gas phase with nothing to accept the proton does not "
                "ionise at all."
            ),
            routes_to="ORG2.ACIDPROPS",
            source=_OBSERVED,
        ),
        Misconception(
            code="ACIDSUB-SIZE-DECIDES",
            name="Bigger molecules are less acidic",
            description=(
                "The learner reaches for molecular size as the explanation and "
                "concludes that adding substituents must reduce acidity."
            ),
            counterexample=(
                "Trichloroacetic acid is much larger than acetic acid and is "
                "roughly ten thousand times more acidic, because of what the "
                "chlorines do to the anion."
            ),
            routes_to="ORG2.ACIDSUBSTITUENT",
            source=_OBSERVED,
        ),
        Misconception(
            code="ACIDSUB-INDUCTION-DOES-NOT-REACH",
            name="Inductive effects do not reach the acid group",
            description=(
                "The learner treats induction as acting only through a bond "
                "directly to the functional group, so a substituent one carbon "
                "away is dismissed."
            ),
            counterexample=(
                "A single chlorine on the adjacent carbon lowers the pKa of "
                "acetic acid by nearly two units. The effect is smaller further "
                "away, but it is not zero one bond out."
            ),
            routes_to="ORG2.ACIDSUBSTITUENT",
            source=_OBSERVED,
        ),
        Misconception(
            code="SPECTRA-CH-DISTINGUISHES",
            name="A band both compounds show can still distinguish them",
            description=(
                "The learner picks a strong, familiar absorption without "
                "checking whether the other compound shows it too."
            ),
            counterexample=(
                "Both compounds contain C-H bonds, so both show that "
                "absorption. An observation identical in the two spectra carries "
                "no information about which is which."
            ),
            routes_to="ORG2.ACIDSPECTRA",
            source=_OBSERVED,
        ),
        Misconception(
            code="SPECTRA-SAME-MASS-ASSUMED",
            name="Related compounds have the same molecular mass",
            description=(
                "The learner assumes an acid and its parent nitrile are "
                "isomeric, and discards mass as uninformative."
            ),
            counterexample=(
                "Hydrolysis replaces nitrogen with two oxygens and adds "
                "hydrogens. The acid is heavier than the nitrile it came from."
            ),
            routes_to="ORG2.ACIDSPECTRA",
            source=_OBSERVED,
        ),
        Misconception(
            code="ACYLSUB-IS-SN2",
            name="Acyl substitution is a backside displacement",
            description=(
                "The learner transfers the SN2 picture to the acyl carbon, with "
                "the nucleophile and leaving group exchanging in one step."
            ),
            counterexample=(
                "A backside attack would invert the carbon, but the acyl carbon "
                "is planar and its substituents are not stereocentres. The "
                "carbonyl pi bond makes a stepwise route available instead."
            ),
            routes_to="ORG2.ACYLSUB",
            source=_OBSERVED,
        ),
        Misconception(
            code="ACYLSUB-IS-SN1",
            name="The leaving group departs first",
            description=(
                "The learner proposes ionisation before attack, giving an acyl "
                "cation as the intermediate in every case."
            ),
            counterexample=(
                "That would require generating a high energy cation when a much "
                "lower energy path exists: the carbonyl can simply accept the "
                "nucleophile's electron pair first."
            ),
            routes_to="ORG2.ACYLSUB",
            source=_OBSERVED,
        ),
        Misconception(
            code="DERIV-MASS-EXPLAINS-REACTIVITY",
            name="Heavier atoms make bonds break more easily",
            description=(
                "The learner explains the reactivity of acid chlorides by the "
                "mass of chlorine rather than by the stability of chloride."
            ),
            counterexample=(
                "Iodide is far heavier than chloride, and acid iodides are not "
                "the story of this series. The ordering tracks leaving group "
                "stability, which mass does not predict."
            ),
            routes_to="ORG2.ACIDCHLORIDE",
            source=_OBSERVED,
        ),
        Misconception(
            code="DERIV-STERICS-EXPLAIN-EVERYTHING",
            name="Reactivity differences are steric",
            description=(
                "The learner defaults to crowding as the explanation for any "
                "rate difference, without checking whether the sizes actually "
                "differ in the right direction."
            ),
            counterexample=(
                "An amide and an ester are of similar size, and the amide is "
                "orders of magnitude less reactive. Sterics do not order the "
                "series; leaving group stability does."
            ),
            routes_to="ORG2.DERIVATIVEREACTIVITY",
            source=_OBSERVED,
        ),
        Misconception(
            code="ESTER-GOES-TO-COMPLETION",
            name="Esterification runs to completion",
            description=(
                "The learner treats the reaction as irreversible and does not "
                "plan to shift the equilibrium."
            ),
            counterexample=(
                "Ester hydrolysis is the same mechanism in reverse under the "
                "same acid catalysis. Both directions are available at once, so "
                "the system reaches equilibrium."
            ),
            routes_to="ORG2.ESTERS",
            source=_OBSERVED,
        ),
        Misconception(
            code="ESTER-CATALYST-CONSUMED",
            name="The catalyst is used up",
            description=(
                "The learner treats the acid catalyst as a reagent that limits "
                "how far the reaction can proceed."
            ),
            counterexample=(
                "A catalyst is regenerated by definition. The proton taken up in "
                "the first step is released again later in the mechanism."
            ),
            routes_to="ORG2.ESTERS",
            source=_OBSERVED,
        ),
        Misconception(
            code="AMIDE-CARBONYL-NOT-ELECTROPHILIC",
            name="The amide carbonyl is not electrophilic at all",
            description=(
                "The learner overcorrects from amide stability and concludes the "
                "carbonyl carbon carries no partial positive charge."
            ),
            counterexample=(
                "Amides are hydrolysed under forcing conditions, which requires "
                "the carbon to be attacked. It is less electrophilic than an "
                "ester, not unreactive."
            ),
            routes_to="ORG2.AMIDES",
            source=_OBSERVED,
        ),
        Misconception(
            code="REDUCTION-PRODUCT-CLASS-CONFUSED",
            name="All acid derivatives reduce to the same class",
            description=(
                "The learner applies one reduction outcome to every derivative "
                "without tracking which heteroatom remains bonded to carbon."
            ),
            counterexample=(
                "An amide keeps its carbon-nitrogen bond and gives an amine; an "
                "ester loses its alkoxy group and gives an alcohol. Same "
                "reagent, different product class."
            ),
            routes_to="ORG2.DERIVATIVEREDUCTION",
            source=_OBSERVED,
        ),
    ]
}
