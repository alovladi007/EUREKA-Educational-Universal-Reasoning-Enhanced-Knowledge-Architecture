"""ORG2 Unit 3 templates: reactions of aromatic compounds.

Nine nodes, nine templates, closing a unit that had lessons and no practice.

SECTION 18

This unit contains the node "Halogenation, nitration and sulfonation", and
nitroaromatics are the obvious place a chemistry course can drift into
something it should not teach. Every item here is about WHERE substitution
happens and WHY, never about how to carry a reaction out. Specifically, no
prompt, key, hint or distractor in this module names a reagent stoichiometry,
a temperature, a concentration, a solvent, a time, an order of addition, or a
work up, and no item involves more than one nitro group on a ring. The
electrophile identity items say which species attacks the ring, which is
mechanism, not a preparation.

The synthesis strategy item deliberately uses a halogen and an alkyl group
rather than a nitro group, even though a nitro group would make the directing
conflict slightly cleaner, because a two step route ending in a nitroarene
reads as a preparation whatever the surrounding text says.

VERIFIERS

The regiochemistry items verify by ENUMERATING ring positions rather than by
recalling "ortho, para". The verifier walks positions 2 through 6 of a
monosubstituted ring, folds the two halves together by the mirror plane that
runs through the substituent, and counts the distinct sites that survive. A
directing rule checked against the same directing rule proves nothing; a count
that falls out of the geometry is a second opinion.

Registration into REGISTRY, HINTS and MISCONCEPTIONS is done by the registry
wiring, not by this module.
"""

from __future__ import annotations

from .mc import validate_choices
from .misconceptions import Misconception
from .registry import Variant
from .types import VerifierResult

_OBSERVED = "Instructor observation; not traced to a published study"

_EAS_SOURCE = (
    "Electrophilic aromatic substitution proceeds through a cationic "
    "arenium ion (sigma complex) whose positive charge is delocalised over "
    "three ring carbons (Clayden Organic Chemistry; Carey and Sundberg)"
)
_DIRECTING_SOURCE = (
    "Directing effects follow from which arenium ion resonance structures place "
    "positive charge next to the substituent (Clayden Organic Chemistry)"
)
_NAS_SOURCE = (
    "Addition-elimination nucleophilic aromatic substitution requires a strong "
    "electron withdrawing group ortho or para to the leaving group, to stabilise "
    "the Meisenheimer intermediate (Clayden Organic Chemistry)"
)

# Ring positions on a monosubstituted benzene, with the substituent at 1.
# The mirror plane through C1 and C4 makes 2 equivalent to 6 and 3 to 5.
MIRROR = {2: 6, 6: 2, 3: 5, 5: 3, 4: 4}
ORTHO = {2, 6}
META = {3, 5}
PARA = {4}


# ---------------------------------------------------------------------------
# 1. the arenium intermediate  (ORG2.EASMECH)
# ---------------------------------------------------------------------------


def gen_eas_intermediate(seed: int) -> Variant:
    choices = [
        {
            "index": 0,
            "text": (
                "A positively charged arenium ion, in which one ring carbon has "
                "become sp3 and the charge is spread over three others."
            ),
            "misconception": None,
        },
        {
            "index": 1,
            "text": (
                "A negatively charged intermediate, because the ring is electron "
                "rich and donates into the electrophile."
            ),
            "misconception": "EAS-INTERMEDIATE-IS-ANIONIC",
        },
        {
            "index": 2,
            "text": (
                "No intermediate at all: the electrophile and the leaving proton "
                "exchange in a single concerted step."
            ),
            "misconception": "EAS-IS-CONCERTED",
        },
    ]
    return Variant(
        template_id="eas.intermediate.v1",
        seed=seed,
        prompt=(
            "In electrophilic aromatic substitution, an electrophile bonds to "
            "the ring and a proton is then lost. What is the intermediate "
            "formed between those two steps?"
        ),
        key="0",
        node="ORG2.EASMECH",
        grader="mc",
        meta={"choices": choices, "correct_index": 0, "constant_source": _EAS_SOURCE},
    )


def ver_eas_intermediate(v: Variant) -> VerifierResult:
    # Independent route: charge bookkeeping. A neutral arene plus a cationic
    # electrophile gives a cationic intermediate; it can only become neutral
    # again once the proton leaves. So the intermediate must be positive, and
    # any choice describing it as negative or absent is wrong by arithmetic
    # rather than by recall.
    arene_charge, electrophile_charge = 0, +1
    intermediate = arene_charge + electrophile_charge
    keyed = v.meta["choices"][v.meta["correct_index"]]["text"].lower()
    if intermediate > 0 and "positive" not in keyed:
        return VerifierResult(False, "charge-bookkeeping", "the keyed choice does not describe a cation")
    for c in v.meta["choices"]:
        if c["index"] == v.meta["correct_index"]:
            continue
        if "positively charged" in c["text"].lower():
            return VerifierResult(False, "charge-bookkeeping", "a distractor also describes a cation")
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, "charge-bookkeeping", "; ".join(problems))
    return VerifierResult(
        True, "charge-bookkeeping", f"neutral ring plus a +1 electrophile gives a +{intermediate} intermediate"
    )


# ---------------------------------------------------------------------------
# 2. which electrophile attacks  (ORG2.EASREACTIONS)
# ---------------------------------------------------------------------------

# Mechanism only. Which species attacks the ring, with no conditions attached.
# Each choice carries its formal charge and whether it has an unpaired
# electron. Those are properties of the species, stated as data; the verifier
# applies the RULE (an electrophile is neither an anion nor a radical) without
# being told which choice is the answer. This is the same division of labour as
# the activating item below, where donates/withdraws are data and the
# resonance-beats-induction competition is applied independently.
_ELECTROPHILES = (
    ("nitration",
     ("the nitronium ion, NO2+", +1, False),
     ("the nitrite ion, NO2-", -1, False),
     ("nitrogen dioxide, NO2", 0, True)),
    ("sulfonation",
     ("sulfur trioxide, SO3", 0, False),
     ("the sulfate ion, SO4 2-", -2, False),
     ("the hydroxide ion, OH-", -1, False)),
    ("bromination",
     ("a polarised bromine, Br-Br complexed to a Lewis acid", 0, False),
     ("the bromide ion, Br-", -1, False),
     ("a bromine radical, Br.", 0, True)),
)


def gen_electrophile(seed: int) -> Variant:
    reaction, correct, wrong_a, wrong_b = _ELECTROPHILES[seed % len(_ELECTROPHILES)]
    misc = ["EAS-ANION-IS-THE-ELECTROPHILE", "EAS-RADICAL-PATHWAY-ASSUMED"]
    choices = []
    for i, (text, charge, radical) in enumerate((correct, wrong_a, wrong_b)):
        choices.append({
            "index": i,
            "text": text,
            "charge": charge,
            "radical": radical,
            "misconception": None if i == 0 else misc[(1 if radical else 0)],
        })
    return Variant(
        template_id="eas.electrophile.v1",
        seed=seed,
        prompt=(
            f"In the {reaction} of benzene, which species is the electrophile "
            "that bonds to the ring?"
        ),
        key="0",
        node="ORG2.EASREACTIONS",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": 0,
            "reaction": reaction,
            "constant_source": (
                "The attacking species in each case is electron poor. This item "
                "identifies it and says nothing about how a reaction would be run"
            ),
        },
    )


def ver_electrophile(v: Variant) -> VerifierResult:
    # Independent route: apply the rule to every choice and see which one
    # survives, rather than trusting correct_index. An electrophile accepts an
    # electron pair, so it cannot be an anion (already electron rich) and
    # cannot be a radical (it would react one electron at a time). Exactly one
    # choice must pass.
    #
    # An earlier version of this check tried to read those properties out of
    # the prose and failed on seed 0, where "nitrogen dioxide, NO2" is a
    # genuine radical but does not contain the word. Pattern matching English
    # was the wrong tool; the properties are now carried as data and the rule
    # is what the verifier supplies.
    def can_be_electrophile(c: dict) -> bool:
        return c["charge"] >= 0 and not c["radical"]

    surviving = [c["index"] for c in v.meta["choices"] if can_be_electrophile(c)]
    if surviving != [v.meta["correct_index"]]:
        return VerifierResult(
            False, "electrophile-rule",
            f"choices that could act as an electrophile are {surviving}, key is {v.meta['correct_index']}",
        )
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, "electrophile-rule", "; ".join(problems))
    keyed = v.meta["choices"][v.meta["correct_index"]]
    return VerifierResult(
        True, "electrophile-rule",
        f"{v.meta['reaction']}: only {keyed['text']} is neither anionic nor radical",
    )


# ---------------------------------------------------------------------------
# 3. Friedel-Crafts limitation  (ORG2.FRIEDELCRAFTS)
# ---------------------------------------------------------------------------


def gen_friedel_crafts(seed: int) -> Variant:
    choices = [
        {
            "index": 0,
            "text": (
                "Acylation, because the product is deactivated toward further "
                "substitution and the acylium ion cannot rearrange."
            ),
            "misconception": None,
        },
        {
            "index": 1,
            "text": (
                "Alkylation, because it forms a carbon-carbon bond directly and "
                "needs no reduction afterwards."
            ),
            "misconception": "FC-FEWER-STEPS-IS-BETTER",
        },
        {
            "index": 2,
            "text": "Neither: both give the same single product in the same yield.",
            "misconception": "FC-NO-DIFFERENCE",
        },
    ]
    return Variant(
        template_id="eas.friedel_crafts.v1",
        seed=seed,
        prompt=(
            "You want exactly one straight chain substituent on a benzene ring. "
            "Friedel-Crafts alkylation and Friedel-Crafts acylation are both "
            "available in principle. Which is the more reliable choice for "
            "getting a single, unrearranged product, and why?"
        ),
        key="0",
        node="ORG2.FRIEDELCRAFTS",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": 0,
            "constant_source": (
                "Alkylation suffers carbocation rearrangement and polyalkylation "
                "because the product is more activated than the starting arene; "
                "acylation does neither (Clayden Organic Chemistry)"
            ),
        },
    )


def ver_friedel_crafts(v: Variant) -> VerifierResult:
    # Independent route: score the two options against the two failure modes
    # named in the node, rather than against the keyed index. Alkylation fails
    # both; acylation fails neither.
    failures = {"alkylation": {"rearrangement", "polyalkylation"}, "acylation": set()}
    best = min(failures, key=lambda k: len(failures[k]))
    keyed = v.meta["choices"][v.meta["correct_index"]]["text"].lower()
    if not keyed.startswith(best):
        return VerifierResult(
            False, "failure-mode-count", f"fewest failure modes is {best}, keyed choice begins {keyed[:14]!r}"
        )
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, "failure-mode-count", "; ".join(problems))
    return VerifierResult(
        True, "failure-mode-count",
        f"alkylation carries {len(failures['alkylation'])} failure modes, acylation none",
    )


# ---------------------------------------------------------------------------
# 4. activating or deactivating  (ORG2.ACTIVATING)
# ---------------------------------------------------------------------------

# (substituent, donates a lone pair into the ring, is more electronegative than
#  carbon in the sigma bond, the classification that results)
_SUBSTITUENTS = (
    ("-OCH3", True, True, "activating"),
    ("-NH2", True, True, "activating"),
    ("-CH3", False, False, "activating"),
    ("-NO2", False, True, "deactivating"),
    ("-C(=O)CH3", False, True, "deactivating"),
    ("-CF3", False, True, "deactivating"),
)


def gen_activating(seed: int) -> Variant:
    group, donates, withdraws, answer = _SUBSTITUENTS[seed % len(_SUBSTITUENTS)]
    options = ["activating", "deactivating"]
    correct = options.index(answer)
    choices = [
        {
            "index": 0,
            "text": "Activating: the ring reacts faster than benzene.",
            "misconception": None if correct == 0 else "EAS-ELECTRONEGATIVE-MEANS-ACTIVATING",
        },
        {
            "index": 1,
            "text": "Deactivating: the ring reacts more slowly than benzene.",
            "misconception": None if correct == 1 else "EAS-LONE-PAIR-IGNORED",
        },
    ]
    return Variant(
        template_id="eas.activating.v1",
        seed=seed,
        prompt=(
            f"A benzene ring carries a {group} substituent. Compared with "
            "benzene itself, is this ring activated or deactivated toward "
            "electrophilic aromatic substitution?"
        ),
        key=str(correct),
        node="ORG2.ACTIVATING",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": correct,
            "group": group,
            "donates": donates,
            "withdraws": withdraws,
            "answer": answer,
            "constant_source": (
                "Resonance donation of a lone pair into the ring outweighs "
                "inductive withdrawal through the sigma bond, which is why -OCH3 "
                "and -NH2 activate despite being on electronegative atoms"
            ),
        },
    )


def ver_activating(v: Variant) -> VerifierResult:
    # Independent route: apply the competition explicitly. Resonance donation,
    # where it exists, beats inductive withdrawal. An alkyl group neither
    # donates a lone pair nor withdraws, and activates weakly by induction.
    if v.meta["donates"]:
        derived = "activating"       # resonance wins over induction
    elif v.meta["withdraws"]:
        derived = "deactivating"
    else:
        derived = "activating"       # alkyl: weakly electron releasing
    if derived != v.meta["answer"]:
        return VerifierResult(
            False, "resonance-beats-induction", f"the competition gives {derived}, key says {v.meta['answer']}"
        )
    keyed = v.meta["choices"][v.meta["correct_index"]]["text"].lower()
    if not keyed.startswith(derived):
        return VerifierResult(False, "resonance-beats-induction", "the keyed choice does not match the derivation")
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, "resonance-beats-induction", "; ".join(problems))
    return VerifierResult(
        True, "resonance-beats-induction",
        f"{v.meta['group']}: donates={v.meta['donates']}, withdraws={v.meta['withdraws']} -> {derived}",
    )


# ---------------------------------------------------------------------------
# 5. counting the directed positions  (ORG2.DIRECTING)
# ---------------------------------------------------------------------------


def gen_directing_count(seed: int) -> Variant:
    group, _d, _w, activating = _SUBSTITUENTS[seed % len(_SUBSTITUENTS)]
    op_directing = activating == "activating"
    # Distinct positions available, after folding the ring on its mirror plane.
    distinct = 2 if op_directing else 1     # {ortho, para} or {meta}
    label = "ortho and para" if op_directing else "meta"
    return Variant(
        template_id="eas.directing_count.v1",
        seed=seed,
        prompt=(
            f"A benzene ring carries a {group} group, which directs incoming "
            f"electrophiles {label}. How many CONSTITUTIONALLY DISTINCT "
            "monosubstituted products can form at the directed positions? "
            "Positions related by the ring's mirror plane give the same "
            "compound. Report a whole number."
        ),
        key=str(distinct),
        node="ORG2.DIRECTING",
        grader="numeric",
        meta={
            "unit": "",
            "value": float(distinct),
            "group": group,
            "op_directing": op_directing,
            "sig_figs": None,
            "constant_source": _DIRECTING_SOURCE,
        },
    )


def ver_directing_count(v: Variant) -> VerifierResult:
    # Independent route: enumerate the ring. Take the directed positions as
    # numbered sites, fold each onto its mirror image through C1 and C4, and
    # count how many equivalence classes remain. The generator wrote down 2 or
    # 1; this derives it from the geometry.
    directed = (ORTHO | PARA) if v.meta["op_directing"] else META
    classes = {frozenset({p, MIRROR[p]}) for p in directed}
    derived = len(classes)
    if derived != int(v.meta["value"]):
        return VerifierResult(
            False, "mirror-fold",
            f"folding {sorted(directed)} gives {derived} distinct sites, key says {int(v.meta['value'])}",
        )
    # Sanity: ortho and para must not collapse into each other, and the two
    # ortho positions must collapse into one.
    if v.meta["op_directing"] and frozenset({2, 6}) not in classes:
        return VerifierResult(False, "mirror-fold", "the two ortho positions did not fold together")
    return VerifierResult(
        True, "mirror-fold",
        f"{v.meta['group']}: positions {sorted(directed)} fold to {derived} distinct products",
    )


# ---------------------------------------------------------------------------
# 6. two substituents in conflict  (ORG2.MULTIPLESUB)
# ---------------------------------------------------------------------------


def gen_multiple_sub(seed: int) -> Variant:
    choices = [
        {
            "index": 0,
            "text": (
                "The position directed by the -OCH3 group, because the stronger "
                "activator controls where the next substitution goes."
            ),
            "misconception": None,
        },
        {
            "index": 1,
            "text": (
                "The position directed by the -NO2 group, because a deactivator "
                "exerts the stronger pull on the ring."
            ),
            "misconception": "MULTISUB-DEACTIVATOR-DIRECTS",
        },
        {
            "index": 2,
            "text": "An even mixture, because the two effects cancel exactly.",
            "misconception": "MULTISUB-EFFECTS-CANCEL",
        },
    ]
    return Variant(
        template_id="eas.multiple_substituents.v1",
        seed=seed,
        prompt=(
            "A benzene ring carries both a -OCH3 group and a -NO2 group, and "
            "they direct an incoming electrophile to different positions. Where "
            "does substitution mainly occur?"
        ),
        key="0",
        node="ORG2.MULTIPLESUB",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": 0,
            "constant_source": (
                "When substituents conflict the more strongly activating group "
                "dominates, because it lowers the barrier at its own directed "
                "positions more than the deactivator raises it elsewhere"
            ),
        },
    )


def ver_multiple_sub(v: Variant) -> VerifierResult:
    # Independent route: rank the two groups on the activation scale the unit
    # already uses and require the key to name the winner. -OCH3 is a strong
    # activator by resonance donation; -NO2 is a strong deactivator.
    strength = {"-OCH3": +2, "-NO2": -2}
    winner = max(strength, key=lambda g: strength[g])
    keyed = v.meta["choices"][v.meta["correct_index"]]["text"]
    if winner not in keyed:
        return VerifierResult(False, "activation-ranking", f"the stronger activator is {winner}, not named in the key")
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, "activation-ranking", "; ".join(problems))
    return VerifierResult(True, "activation-ranking", f"{winner} outranks the other group and directs")


# ---------------------------------------------------------------------------
# 7. when nucleophilic aromatic substitution works  (ORG2.NAS)
# ---------------------------------------------------------------------------


def gen_nas(seed: int) -> Variant:
    positions = ("ortho", "para", "meta")
    where = positions[seed % len(positions)]
    works = where in ("ortho", "para")
    choices = [
        {
            "index": 0,
            "text": "Yes: the negative charge of the intermediate can be delocalised onto the withdrawing group.",
            "misconception": None if works else "NAS-ANY-EWG-WILL-DO",
        },
        {
            "index": 1,
            "text": "No: the negative charge never reaches the withdrawing group from that position.",
            "misconception": "NAS-POSITION-IRRELEVANT" if works else None,
        },
    ]
    correct = 0 if works else 1
    return Variant(
        template_id="nas.position.v1",
        seed=seed,
        prompt=(
            "An aryl halide carries a strong electron withdrawing group "
            f"{where} to the halide. Under addition-elimination conditions, is "
            "the halide readily displaced by a nucleophile?"
        ),
        key=str(correct),
        node="ORG2.NAS",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": correct,
            "where": where,
            "works": works,
            "constant_source": _NAS_SOURCE,
        },
    )


def ver_nas(v: Variant) -> VerifierResult:
    # Independent route: enumerate where the Meisenheimer negative charge
    # actually sits. Attack at C1 delocalises the charge onto C2, C4 and C6,
    # which are the ortho and para positions. A group at C3 or C5 (meta) never
    # receives it, so it cannot stabilise the intermediate.
    charge_bearing = ORTHO | PARA          # {2, 6, 4}
    position_map = {"ortho": 2, "para": 4, "meta": 3}
    site = position_map[v.meta["where"]]
    derived = site in charge_bearing
    if derived != v.meta["works"]:
        return VerifierResult(
            False, "charge-delocalisation",
            f"charge reaches {sorted(charge_bearing)}; {v.meta['where']} is C{site}, so works={derived}",
        )
    if v.meta["choices"][v.meta["correct_index"]]["text"].startswith("Yes") != derived:
        return VerifierResult(False, "charge-delocalisation", "the keyed choice disagrees with the derivation")
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, "charge-delocalisation", "; ".join(problems))
    return VerifierResult(
        True, "charge-delocalisation",
        f"{v.meta['where']} is C{site}; charge reaches {sorted(charge_bearing)}, so works={derived}",
    )


# ---------------------------------------------------------------------------
# 8. side chain reactivity  (ORG2.SIDECHAIN)
# ---------------------------------------------------------------------------


def gen_side_chain(seed: int) -> Variant:
    choices = [
        {
            "index": 0,
            "text": (
                "The benzylic position, because the radical or cation formed "
                "there is delocalised into the ring."
            ),
            "misconception": None,
        },
        {
            "index": 1,
            "text": "The far end of the chain, because it is least hindered.",
            "misconception": "SIDECHAIN-STERICS-DECIDE",
        },
        {
            "index": 2,
            "text": "The ring itself, because aromatic carbons are the most reactive in the molecule.",
            "misconception": "SIDECHAIN-RING-IS-MOST-REACTIVE",
        },
    ]
    return Variant(
        template_id="arene.side_chain.v1",
        seed=seed,
        prompt=(
            "An alkyl chain is attached to a benzene ring. When the side chain "
            "reacts through a radical or cationic intermediate, which carbon of "
            "the chain reacts most readily, and why?"
        ),
        key="0",
        node="ORG2.SIDECHAIN",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": 0,
            "constant_source": (
                "A benzylic radical or cation is stabilised by delocalisation "
                "into the aromatic pi system, which no other chain position "
                "enjoys (Clayden Organic Chemistry)"
            ),
        },
    )


def ver_side_chain(v: Variant) -> VerifierResult:
    # Independent route: count how many resonance structures each candidate
    # intermediate has. Benzylic delocalises into the ring, giving several;
    # an ordinary chain carbon gives one. More delocalisation is more stable,
    # which is the whole argument.
    resonance = {"benzylic": 4, "chain end": 1, "ring carbon": 1}
    best = max(resonance, key=lambda k: resonance[k])
    keyed = v.meta["choices"][v.meta["correct_index"]]["text"].lower()
    if best.split()[0] not in keyed:
        return VerifierResult(False, "resonance-count", f"most delocalised is {best}, not named in the key")
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, "resonance-count", "; ".join(problems))
    return VerifierResult(
        True, "resonance-count", f"benzylic carries {resonance['benzylic']} contributors against 1 elsewhere"
    )


# ---------------------------------------------------------------------------
# 9. order of operations  (ORG2.AROMATICSYNTH)
# ---------------------------------------------------------------------------
#
# Deliberately built from a halogen and an alkyl group. A nitro group would
# sharpen the directing conflict, but a two step sequence ending in a
# nitroarene reads as a preparation, and Section 18 is not a thing to be clever
# about. This item asks only which ORDER produces which substitution pattern.


def gen_aromatic_synth(seed: int) -> Variant:
    # accepts_directing records whether the choice treats the first group's
    # directing effect as controlling. It is a property of the argument the
    # choice makes, carried as data; the verifier applies the rule that exactly
    # one choice may do so.
    choices = [
        {
            "index": 0,
            "text": (
                "Attach the alkyl group first. It is ortho, para directing, so "
                "the halogen then arrives para to it."
            ),
            "accepts_directing": True,
            "reaches_para": True,
            "misconception": None,
        },
        {
            "index": 1,
            "text": (
                "Attach the halogen first. Order does not matter, because both "
                "groups end up on the ring either way."
            ),
            "accepts_directing": False,
            "reaches_para": False,
            "misconception": "SYNTH-ORDER-DOES-NOT-MATTER",
        },
        {
            "index": 2,
            "text": (
                "Attach either first and separate the mixture afterwards, since "
                "directing effects only shift ratios slightly."
            ),
            "accepts_directing": False,
            "reaches_para": False,
            "misconception": "SYNTH-DIRECTING-IS-A-MINOR-EFFECT",
        },
    ]
    return Variant(
        template_id="arene.synthesis_order.v1",
        seed=seed,
        prompt=(
            "You want a benzene ring bearing an alkyl group and a halogen para "
            "to each other. Both substituents can be installed by electrophilic "
            "aromatic substitution. Which group should go on first, and why?"
        ),
        key="0",
        node="ORG2.AROMATICSYNTH",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": 0,
            "constant_source": (
                "In a two step aromatic sequence the first substituent decides "
                "where the second one lands, so the order is chosen from the "
                "directing effect of the group installed first"
            ),
        },
    )


def ver_aromatic_synth(v: Variant) -> VerifierResult:
    # Independent route: a plan is only sound here if it both accepts that the
    # first substituent controls where the second lands AND actually reaches the
    # requested para relationship. Apply both conditions to every choice and
    # require exactly one survivor, which must be the key.
    #
    # An earlier version searched the prose for the word "directing" and failed
    # on every seed, because distractor 2 uses the word while denying that it
    # matters ("directing effects only shift ratios slightly"). Matching English
    # cannot tell an argument from its negation; the stance is now data.
    surviving = [
        c["index"] for c in v.meta["choices"]
        if c["accepts_directing"] and c["reaches_para"]
    ]
    if surviving != [v.meta["correct_index"]]:
        return VerifierResult(
            False, "sound-plan-filter",
            f"choices that both respect directing and reach para are {surviving}, "
            f"key is {v.meta['correct_index']}",
        )
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, "sound-plan-filter", "; ".join(problems))
    return VerifierResult(
        True, "sound-plan-filter",
        "only the key both respects the directing effect and reaches the para target",
    )


# ---------------------------------------------------------------------------
# Registration data
# ---------------------------------------------------------------------------

TEMPLATES_ORG2_U3: dict[str, dict[str, object]] = {
    "eas.intermediate.v1": {
        "gen": gen_eas_intermediate, "ver": ver_eas_intermediate,
        "node": "ORG2.EASMECH", "grader": "mc",
    },
    "eas.electrophile.v1": {
        "gen": gen_electrophile, "ver": ver_electrophile,
        "node": "ORG2.EASREACTIONS", "grader": "mc",
    },
    "eas.friedel_crafts.v1": {
        "gen": gen_friedel_crafts, "ver": ver_friedel_crafts,
        "node": "ORG2.FRIEDELCRAFTS", "grader": "mc",
    },
    "eas.activating.v1": {
        "gen": gen_activating, "ver": ver_activating,
        "node": "ORG2.ACTIVATING", "grader": "mc",
    },
    "eas.directing_count.v1": {
        "gen": gen_directing_count, "ver": ver_directing_count,
        "node": "ORG2.DIRECTING", "grader": "numeric",
    },
    "eas.multiple_substituents.v1": {
        "gen": gen_multiple_sub, "ver": ver_multiple_sub,
        "node": "ORG2.MULTIPLESUB", "grader": "mc",
    },
    "nas.position.v1": {
        "gen": gen_nas, "ver": ver_nas,
        "node": "ORG2.NAS", "grader": "mc",
    },
    "arene.side_chain.v1": {
        "gen": gen_side_chain, "ver": ver_side_chain,
        "node": "ORG2.SIDECHAIN", "grader": "mc",
    },
    "arene.synthesis_order.v1": {
        "gen": gen_aromatic_synth, "ver": ver_aromatic_synth,
        "node": "ORG2.AROMATICSYNTH", "grader": "mc",
    },
}


HINTS_ORG2_U3: dict[str, tuple[str, str, str]] = {
    "eas.intermediate.v1": (
        "Something has to exist between the electrophile bonding and the proton "
        "leaving. Ask what its charge must be.",
        "The ring was neutral and the electrophile was positive, so whatever "
        "forms carries that positive charge until the proton departs. One ring "
        "carbon has picked up a fourth bond and is no longer part of the "
        "aromatic system.",
        "Work out the total charge on the species after the electrophile bonds "
        "but before the proton leaves.",
    ),
    "eas.electrophile.v1": (
        "The ring is the electron rich partner here, so the other species must "
        "be electron poor.",
        "Rule out anything carrying a negative charge, and rule out radicals: "
        "this mechanism moves pairs of electrons, not single ones.",
        "Look at the charge on each option first.",
    ),
    "eas.friedel_crafts.v1": (
        "Both reactions attach a carbon substituent. They differ in what goes "
        "wrong.",
        "Ask two questions of each: can the electrophile rearrange before it "
        "reacts, and is the product more or less reactive than what you started "
        "with. A more reactive product means the reaction keeps going.",
        "Count how many of those two problems each route has.",
    ),
    "eas.activating.v1": (
        "The question is whether this ring reacts faster or slower than plain "
        "benzene.",
        "Two effects compete: a lone pair pushed into the ring through "
        "resonance, and electrons pulled away through the sigma bond by an "
        "electronegative atom. Where both are present, resonance wins.",
        "Ask first whether the atom attached to the ring has a lone pair it can "
        "donate.",
    ),
    "eas.directing_count.v1": (
        "You are counting products, not positions. Two positions that give the "
        "same molecule count once.",
        "The ring has a mirror plane through the substituent and the carbon "
        "opposite it. Any two positions reflected into each other by that plane "
        "give the same compound.",
        "Write out the directed position numbers, pair up the ones the mirror "
        "swaps, and count the groups.",
    ),
    "eas.multiple_substituents.v1": (
        "The two groups want the incoming electrophile in different places. One "
        "of them wins.",
        "Compare how strongly each affects the ring. A group that makes the "
        "ring much more reactive lowers the barrier at its own preferred "
        "positions far more than a deactivator raises it elsewhere.",
        "Rank the two groups from strongly activating to strongly deactivating "
        "and take the top one.",
    ),
    "nas.position.v1": (
        "This mechanism goes through a negatively charged intermediate. The "
        "question is whether the withdrawing group can help carry that charge.",
        "When the nucleophile adds, the negative charge is delocalised onto "
        "specific ring carbons, not all of them. Work out which ones, then see "
        "whether the withdrawing group is sitting on one.",
        "Number the ring with the halide at position 1 and list the carbons the "
        "charge reaches.",
    ),
    "arene.side_chain.v1": (
        "One carbon on the chain forms a much more stable intermediate than the "
        "others.",
        "Whichever position lets the resulting radical or cation spill its "
        "electron density into the ring will form fastest. Only one carbon is "
        "adjacent enough to do that.",
        "Draw the intermediate at the carbon next to the ring and count how many "
        "resonance structures you can write.",
    ),
    "arene.synthesis_order.v1": (
        "Both groups can be added by the same kind of reaction, so the choice is "
        "about sequence, not about reagents.",
        "Whichever group goes on first decides where the second one lands. So "
        "pick the first group by asking which one directs to the position you "
        "actually want.",
        "Ask which of the two groups directs to the para position.",
    ),
}


MISCONCEPTIONS_ORG2_U3: dict[str, Misconception] = {
    m.code: m
    for m in [
        Misconception(
            code="EAS-INTERMEDIATE-IS-ANIONIC",
            name="The arenium intermediate is negatively charged",
            description=(
                "The learner reasons that because the ring is electron rich it "
                "must end up negative, and misses that it has just accepted a "
                "positive electrophile."
            ),
            counterexample=(
                "A neutral arene plus a positive electrophile cannot give a "
                "negative species: charge is conserved, so the intermediate is "
                "+1 until the proton leaves."
            ),
            routes_to="ORG2.EASMECH",
            source=_OBSERVED,
        ),
        Misconception(
            code="EAS-IS-CONCERTED",
            name="Substitution happens in one step",
            description=(
                "The learner treats the overall transformation as a single "
                "concerted event, so no intermediate exists and the directing "
                "effects have nothing to act on."
            ),
            counterexample=(
                "If it were concerted, aromaticity would never be broken and "
                "there would be no reason for substituents to direct at all. "
                "The observed regiochemistry requires the intermediate."
            ),
            routes_to="ORG2.EASMECH",
            source=_OBSERVED,
        ),
        Misconception(
            code="EAS-ANION-IS-THE-ELECTROPHILE",
            name="The anionic partner attacks the ring",
            description=(
                "The learner picks the more familiar ion from the reagent rather "
                "than the electron poor one, and has an anion attacking an "
                "electron rich ring."
            ),
            counterexample=(
                "Two electron rich species repel. The nitrite anion cannot be "
                "the electrophile in nitration; the nitronium cation is."
            ),
            routes_to="ORG2.EASREACTIONS",
            source=_OBSERVED,
        ),
        Misconception(
            code="EAS-RADICAL-PATHWAY-ASSUMED",
            name="Aromatic substitution goes through radicals",
            description=(
                "The learner imports radical halogenation of alkanes into "
                "aromatic chemistry and proposes single electron species."
            ),
            counterexample=(
                "Radical bromination of an arene attacks the side chain, not the "
                "ring. Ring substitution needs a two electron electrophile."
            ),
            routes_to="ORG2.EASREACTIONS",
            source=_OBSERVED,
        ),
        Misconception(
            code="FC-FEWER-STEPS-IS-BETTER",
            name="The shorter route is the better route",
            description=(
                "The learner chooses alkylation because it installs the "
                "substituent in one step, without weighing rearrangement and "
                "polysubstitution."
            ),
            counterexample=(
                "A one step alkylation that gives a rearranged product plus "
                "di- and tri-substituted material has produced less of what was "
                "wanted than a two step acylation route."
            ),
            routes_to="ORG2.FRIEDELCRAFTS",
            source=_OBSERVED,
        ),
        Misconception(
            code="FC-NO-DIFFERENCE",
            name="Alkylation and acylation behave the same",
            description=(
                "The learner treats the two Friedel-Crafts reactions as "
                "interchangeable because both attach a carbon fragment."
            ),
            counterexample=(
                "An acyl group deactivates the ring it lands on, so the reaction "
                "stops after one substitution. An alkyl group activates it, so "
                "the reaction does not."
            ),
            routes_to="ORG2.FRIEDELCRAFTS",
            source=_OBSERVED,
        ),
        Misconception(
            code="EAS-ELECTRONEGATIVE-MEANS-ACTIVATING",
            name="An electronegative atom on the ring activates it",
            description=(
                "The learner sees oxygen or nitrogen attached to the ring and "
                "expects deactivation from electronegativity, or the reverse, "
                "without weighing the lone pair."
            ),
            counterexample=(
                "Methoxybenzene reacts far faster than benzene despite the "
                "electronegative oxygen, because the oxygen lone pair is donated "
                "into the ring and that outweighs induction."
            ),
            routes_to="ORG2.ACTIVATING",
            source=_OBSERVED,
        ),
        Misconception(
            code="EAS-LONE-PAIR-IGNORED",
            name="Only induction is considered",
            description=(
                "The learner classifies substituents purely by the "
                "electronegativity of the attached atom, ignoring resonance "
                "donation entirely."
            ),
            counterexample=(
                "By induction alone -NH2 and -NO2 both withdraw. In practice one "
                "is among the strongest activators known and the other among the "
                "strongest deactivators."
            ),
            routes_to="ORG2.ACTIVATING",
            source=_OBSERVED,
        ),
        Misconception(
            code="MULTISUB-DEACTIVATOR-DIRECTS",
            name="The deactivating group controls the outcome",
            description=(
                "The learner assumes the group with the larger electronic effect "
                "in absolute terms wins, and picks the strong deactivator."
            ),
            counterexample=(
                "Substitution happens where the barrier is lowest. The activator "
                "lowers it at its own positions; the deactivator only raises it "
                "everywhere, which cannot create a preference."
            ),
            routes_to="ORG2.MULTIPLESUB",
            source=_OBSERVED,
        ),
        Misconception(
            code="MULTISUB-EFFECTS-CANCEL",
            name="Opposing substituents cancel out",
            description=(
                "The learner treats activation and deactivation as equal and "
                "opposite numbers that sum to zero, predicting no selectivity."
            ),
            counterexample=(
                "Selectivity is set by relative barriers at different positions, "
                "not by a sum over the whole ring. Rings carrying both kinds of "
                "group are still strongly selective."
            ),
            routes_to="ORG2.MULTIPLESUB",
            source=_OBSERVED,
        ),
        Misconception(
            code="NAS-ANY-EWG-WILL-DO",
            name="Any withdrawing group enables the substitution",
            description=(
                "The learner remembers that nucleophilic aromatic substitution "
                "needs an electron withdrawing group but not that its position "
                "matters."
            ),
            counterexample=(
                "A withdrawing group meta to the leaving group never touches the "
                "negative charge of the intermediate, and the reaction does not "
                "proceed by this pathway."
            ),
            routes_to="ORG2.NAS",
            source=_OBSERVED,
        ),
        Misconception(
            code="NAS-POSITION-IRRELEVANT",
            name="Position on the ring does not affect stabilisation",
            description=(
                "The learner treats the ring as a single delocalised pool in "
                "which charge reaches every carbon equally."
            ),
            counterexample=(
                "The Meisenheimer intermediate puts charge specifically on the "
                "carbons ortho and para to the point of attack, and nowhere else."
            ),
            routes_to="ORG2.NAS",
            source=_OBSERVED,
        ),
        Misconception(
            code="SIDECHAIN-STERICS-DECIDE",
            name="The least hindered position reacts",
            description=(
                "The learner reaches for sterics as the default explanation and "
                "picks the chain terminus, missing the electronic stabilisation "
                "available next to the ring."
            ),
            counterexample=(
                "The benzylic carbon is the MORE hindered of the two and still "
                "reacts preferentially, because its intermediate is delocalised "
                "into the ring."
            ),
            routes_to="ORG2.SIDECHAIN",
            source=_OBSERVED,
        ),
        Misconception(
            code="SIDECHAIN-RING-IS-MOST-REACTIVE",
            name="The aromatic ring is always the reactive part",
            description=(
                "Having spent the unit on ring reactions, the learner expects "
                "the ring to react in every case, including under radical "
                "conditions where the side chain is attacked."
            ),
            counterexample=(
                "Aromatic stability is exactly why the ring resists addition. "
                "Under radical conditions the side chain reacts and the ring is "
                "left intact."
            ),
            routes_to="ORG2.SIDECHAIN",
            source=_OBSERVED,
        ),
        Misconception(
            code="SYNTH-ORDER-DOES-NOT-MATTER",
            name="Sequence is irrelevant if both groups get attached",
            description=(
                "The learner plans a route by listing the transformations "
                "needed, without noticing that the first substituent decides "
                "where the second one can go."
            ),
            counterexample=(
                "Installing a meta director first and an ortho, para director "
                "second gives a different substitution pattern from the reverse "
                "order, using the same two reactions."
            ),
            routes_to="ORG2.AROMATICSYNTH",
            source=_OBSERVED,
        ),
        Misconception(
            code="SYNTH-DIRECTING-IS-A-MINOR-EFFECT",
            name="Directing effects only shift ratios slightly",
            description=(
                "The learner treats regiochemistry as a preference to be cleaned "
                "up by separation rather than as the thing that determines what "
                "is formed."
            ),
            counterexample=(
                "Directing effects routinely change product ratios by orders of "
                "magnitude, which is why a route is planned around them rather "
                "than around a chromatography column."
            ),
            routes_to="ORG2.AROMATICSYNTH",
            source=_OBSERVED,
        ),
    ]
}
