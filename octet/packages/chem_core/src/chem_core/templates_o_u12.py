"""ORG1 Units 1 and 2 templates: the practice items the foundations and the
acid-base units need before they can be practised or examined.

Units 1 (structure, formal charge, functional groups) and 2 (pKa, acidity,
nucleophiles and electrophiles) were authored as lessons but shipped with no
items, so every node in them taught and then dead-ended. These templates make
them practiceable, and their unit exams assemble because blueprints are
generated from the registry rather than declared by hand.

The house rule carries over unchanged: every generator's key is confirmed by a
second computational path that shares no code with the generator, so a learner
is never served a key the second route could not reproduce. What "a second
route" is worth stating per template, because a verifier that re-runs the
generator proves nothing:

  draw             generator canonicalizes SMILES to build the key; verifier
                   runs the same molecule through InChI, a separately developed
                   canonicalization, and cross checks the recorded formula
                   against the one RDKit derives from the structure.
  formal charge    generator reads RDKit's parse-time formal charge on the
                   marked atom; verifier never touches that attribute and
                   instead counts valence electrons by hand, FC = V + B - 8 for
                   a second-row atom with a complete octet, then checks that the
                   same count summed over every heavy atom reproduces the net
                   molecular charge.
  functional group generator finds the correct choice by a hand-written SMARTS
                   for the target group; verifier re-derives it with RDKit's
                   Fragments counters, a different implementation, and requires
                   the correct choice to match and every distractor not to.
  pKa direction    generator states the favoured side; verifier re-derives it
                   from the two given pKa values, which must be present with a
                   cited source, and confirms the keyed side is the one holding
                   the weaker acid.
  stronger acid    generator names the stronger acid; verifier re-derives it as
                   the one with the lower cited pKa and confirms the key agrees.
  nucleophile      generator states the role; verifier recomputes the net formal
                   charge and requires an anion to be keyed nucleophile and a
                   cation electrophile, so charge decides.

Two disciplines specific to these units. First, no pKa number is invented: every
value stated in a prompt carries a Source in meta naming a real reference work,
and only values already cited in apps/api/app/data/lessons_org1_u2.py are used.
Second, every SMILES fact here was read back from RDKit before it was written
down rather than recalled, because recalled organic facts are wrong often
enough to matter.
"""

from __future__ import annotations

from .misconceptions import Misconception
from .registry import Variant, _pick
from .structure import canonical, formula_of, inchikey, verify_structure_key
from .types import VerifierResult

# Valence electron counts for the free neutral atom, i.e. the main-group number.
# Used only by the formal-charge verifier's hand count, never by a generator.
_VALENCE_ELECTRONS = {
    "H": 1, "B": 3, "C": 4, "N": 5, "O": 6,
    "F": 7, "P": 5, "S": 6, "Cl": 7, "Br": 7, "I": 7,
}
_ELEMENT_NAME = {"O": "oxygen", "N": "nitrogen", "C": "carbon", "B": "boron", "S": "sulfur"}

# pKa citations, reproduced from apps/api/app/data/lessons_org1_u2.py so the same
# reference reads the same way. No value is used here that is not sourced there.
_CRC = (
    "CRC Handbook of Chemistry and Physics, tables of dissociation constants "
    "of organic acids, aqueous solution at 25 degrees Celsius."
)
_WATER_CONVENTION = (
    "Water is assigned pKa 15.7 on the convention common in organic chemistry, "
    "which divides the ionic product of water by the molar concentration of "
    "water; the number is only meaningful alongside that convention. See an "
    "introductory organic text's chapter on acids and bases, for example "
    "Clayden, Organic Chemistry."
)


def _rdkit():
    from rdkit import Chem, RDLogger

    RDLogger.DisableLog("rdApp.*")
    return Chem


# ---------------------------------------------------------------------------
# org.draw.v1  (ORG1.DRAWING)
# ---------------------------------------------------------------------------

# Small, achiral, unambiguously named organics. Stereochemistry is not assessed
# in Unit 1, so the key is the flat canonical structure. Every formula is derived
# from the SMILES at generation time, never authored.
_DRAW_FIXTURES = [
    ("CCO", "ethanol", "the alcohol in fermented drinks"),
    ("CC(O)C", "propan-2-ol", "rubbing alcohol"),
    ("CC(C)=O", "propanone", "acetone, a common solvent and nail-polish remover"),
    ("CC(=O)O", "ethanoic acid", "acetic acid, the sour component of vinegar"),
    ("CN", "methylamine", "a simple amine with a fishy smell"),
    ("CCOCC", "diethyl ether", "an early surgical anaesthetic"),
    ("CC=O", "ethanal", "acetaldehyde, formed when the body processes ethanol"),
    ("CCl", "chloromethane", "a one-carbon chloroalkane"),
    ("CO", "methanol", "wood alcohol"),
    ("CCC", "propane", "a bottled fuel gas"),
    ("COC", "methoxymethane", "dimethyl ether, a propellant and a fuel"),
]


def _gen_draw(seed: int) -> Variant:
    smiles, name, note = _pick(_DRAW_FIXTURES, seed)
    key = canonical(smiles, keep_stereo=False)
    formula = formula_of(smiles) or ""
    return Variant(
        template_id="org.draw.v1",
        seed=seed,
        prompt=(
            f"Give the SMILES string for {name} ({note}). Connectivity is what "
            "is assessed here; stereochemistry is not, so a flat structure with "
            "the correct atoms joined in the correct order is what is wanted."
        ),
        key=key or smiles,
        node="ORG1.DRAWING",
        grader="structure",
        meta={
            "name": name,
            "formula": formula,
            "stereo": "loose",
            "tautomer": "strict",
            "expected_inchikey": inchikey(smiles) or "",
            "smiles": smiles,
        },
    )


def _ver_draw(v: Variant) -> VerifierResult:
    """Confirm the key through InChI and through the recorded formula.

    verify_structure_key runs the key through InChI, an independently developed
    canonicalization, and requires it to describe the same substance the key's
    own canonical SMILES does. The formula the fixture recorded is then checked
    against the formula RDKit derives from the key, so a structure whose formula
    and connectivity disagree cannot be served.
    """
    result = verify_structure_key(v.key, v.meta.get("expected_inchikey") or None)
    if not result.ok:
        return result
    derived = formula_of(v.key)
    recorded = str(v.meta.get("formula", "")).strip()
    if recorded and derived and derived != recorded:
        return VerifierResult(
            False,
            "inchikey-agreement",
            f"fixture records formula {recorded}, structure gives {derived}",
        )
    return result


# ---------------------------------------------------------------------------
# org.formalcharge.v1  (ORG1.FORMALCHARGEORG)
# ---------------------------------------------------------------------------

# Each fixture is (SMILES, target element, species name). The target element
# appears exactly once, so "the <element> atom" is unambiguous. Every target
# atom has a complete octet, which is the condition under which the verifier's
# hand count FC = V + B - 8 is valid; electron-deficient atoms (a neutral boron,
# a carbocation) are deliberately absent. The key is read from RDKit, never
# authored, and a neutral target is included so a zero key is exercised.
_FORMALCHARGE_FIXTURES = [
    ("[OH-]", "O", "hydroxide"),
    ("[NH4+]", "N", "the ammonium ion"),
    ("[OH3+]", "O", "the hydronium ion"),
    ("N", "N", "ammonia"),
    ("O", "O", "water"),
    ("[C-]#N", "C", "the cyanide ion"),
    ("CC(C)=[OH+]", "O", "acetone protonated on oxygen"),
    ("C[O-]", "O", "the methoxide ion"),
    ("[NH2-]", "N", "the amide ion"),
    ("[NH3+][B-](F)(F)F", "N", "the ammonia-boron trifluoride adduct, at its nitrogen"),
    ("[NH3+][B-](F)(F)F", "B", "the ammonia-boron trifluoride adduct, at its boron"),
]


def _target_atom(mol, element: str):
    """The single atom of the given element, or None if not exactly one."""
    hits = [a for a in mol.GetAtoms() if a.GetSymbol() == element]
    return hits[0] if len(hits) == 1 else None


def _gen_formalcharge(seed: int) -> Variant:
    smiles, element, name = _pick(_FORMALCHARGE_FIXTURES, seed)
    Chem = _rdkit()
    mol = Chem.MolFromSmiles(smiles)
    atom = _target_atom(mol, element) if mol is not None else None
    fc = atom.GetFormalCharge() if atom is not None else 0
    return Variant(
        template_id="org.formalcharge.v1",
        seed=seed,
        prompt=(
            f"In {name}, drawn as the Lewis structure with SMILES {smiles}, what "
            f"is the formal charge on the {_ELEMENT_NAME.get(element, element)} "
            "atom? Give a signed whole number, for example +1, 0 or -1."
        ),
        key=str(int(fc)),
        node="ORG1.FORMALCHARGEORG",
        grader="numeric",
        meta={
            "value": float(int(fc)),
            "unit": "",
            "smiles": smiles,
            "element": element,
            "name": name,
        },
    )


def _ver_formalcharge(v: Variant) -> VerifierResult:
    """Count valence electrons by hand rather than read the charge attribute.

    For a second-row atom with a complete octet the formal charge is V + B - 8,
    where V is the free atom's valence-electron count and B is the number of
    bonds (the total valence, counting bonds to hydrogen). That number is derived
    without ever calling GetFormalCharge on the target, so agreement with the key
    is real evidence. As a second, whole-molecule check the same hand count is
    summed over every heavy atom and must reproduce the net molecular charge,
    which fails loudly if a fixture ever carried an atom the octet count cannot
    describe.
    """
    smiles = str(v.meta.get("smiles", ""))
    element = str(v.meta.get("element", ""))
    Chem = _rdkit()
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return VerifierResult(False, "valence-electron-count", f"cannot read {smiles}")
    atom = _target_atom(mol, element)
    if atom is None:
        return VerifierResult(
            False, "valence-electron-count", f"{element} is not unique in {smiles}"
        )
    if element not in _VALENCE_ELECTRONS:
        return VerifierResult(False, "valence-electron-count", f"no valence data for {element}")

    derived = _VALENCE_ELECTRONS[element] + atom.GetTotalValence() - 8
    key_charge = int(round(float(v.meta.get("value", 0.0))))
    if derived != key_charge:
        return VerifierResult(
            False,
            "valence-electron-count",
            f"hand count gives {derived}, key is {key_charge}",
        )

    total = 0
    for a in mol.GetAtoms():
        sym = a.GetSymbol()
        if sym == "H":
            continue
        if sym not in _VALENCE_ELECTRONS:
            return VerifierResult(False, "valence-electron-count", f"no valence data for {sym}")
        total += _VALENCE_ELECTRONS[sym] + a.GetTotalValence() - 8
    net = Chem.GetFormalCharge(mol)
    if total != net:
        return VerifierResult(
            False,
            "valence-electron-count",
            f"octet sum {total} does not match net charge {net}",
        )
    return VerifierResult(True, "valence-electron-count", f"{derived:+d}")


# ---------------------------------------------------------------------------
# org.functionalgroup.v1  (ORG1.FUNCTIONALGROUPS)
# ---------------------------------------------------------------------------

# Hand-written SMARTS for the generator's route. The verifier re-derives with
# RDKit's Fragments counters, a separate implementation.
_GROUP_SMARTS = {
    "carboxylic acid": "[CX3](=[OX1])[OX2H1]",
    "ketone": "[#6][CX3](=[OX1])[#6]",
    "aldehyde": "[CX3H1](=[OX1])[#6]",
}
_GROUP_FRAGMENT = {
    "carboxylic acid": "fr_COO",
    "ketone": "fr_ketone",
    "aldehyde": "fr_aldehyde",
}

# Each fixture: target group, the correct molecule, and three distractors, each
# a real molecule paired with the belief that makes it a tempting wrong pick.
_FUNCTIONALGROUP_FIXTURES = [
    (
        "carboxylic acid",
        ("CC(=O)O", "ethanoic acid"),
        [
            ("CCO", "ethanol", "HYDROXYL-IS-ACID-GROUP"),
            ("CC=O", "ethanal", "CARBONYL-UNDIFFERENTIATED"),
            ("COC(C)=O", "methyl ethanoate", "ESTER-IS-ACID"),
        ],
    ),
    (
        "ketone",
        ("CC(C)=O", "propanone"),
        [
            ("CC=O", "ethanal", "ALDEHYDE-KETONE-CONFUSED"),
            ("CC(=O)O", "ethanoic acid", "CARBONYL-UNDIFFERENTIATED"),
            ("COC(C)=O", "methyl ethanoate", "CARBONYL-UNDIFFERENTIATED"),
        ],
    ),
    (
        "aldehyde",
        ("CC=O", "ethanal"),
        [
            ("CC(C)=O", "propanone", "ALDEHYDE-KETONE-CONFUSED"),
            ("CC(=O)O", "ethanoic acid", "CARBONYL-UNDIFFERENTIATED"),
            ("COC(C)=O", "methyl ethanoate", "CARBONYL-UNDIFFERENTIATED"),
        ],
    ),
]


def _gen_functionalgroup(seed: int) -> Variant:
    group, correct, distractors = _pick(_FUNCTIONALGROUP_FIXTURES, seed)
    Chem = _rdkit()
    pattern = Chem.MolFromSmarts(_GROUP_SMARTS[group])

    # Derive which choice is correct by matching the target-group SMARTS, rather
    # than trusting the fixture's ordering. The rotation of the correct slot
    # spreads it across positions so the answer is not always the same index.
    entries = [(correct[0], correct[1], None)] + list(distractors)
    entries = entries[seed % len(entries):] + entries[: seed % len(entries)]

    correct_index = -1
    choices = []
    for i, (smiles, cname, misc) in enumerate(entries):
        mol = Chem.MolFromSmiles(smiles)
        matches = bool(mol is not None and pattern is not None and mol.HasSubstructMatch(pattern))
        if matches:
            correct_index = i
        choices.append(
            {
                "index": i,
                "text": f"{cname} ({smiles})",
                "misconception": None if matches else misc,
                "smiles": smiles,
            }
        )

    return Variant(
        template_id="org.functionalgroup.v1",
        seed=seed,
        prompt=(
            f"Which of these molecules contains a {group} functional group?"
        ),
        key=str(correct_index),
        node="ORG1.FUNCTIONALGROUPS",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": correct_index,
            "group": group,
        },
    )


def _ver_functionalgroup(v: Variant) -> VerifierResult:
    """Re-derive the correct choice with RDKit's Fragments counters.

    The generator used a hand-written SMARTS. RDKit's Fragments module ships its
    own SMARTS for the same groups, developed independently, so requiring the
    correct choice to register the target group there and every distractor not
    to is a genuine second opinion, not the same match run twice.
    """
    from rdkit.Chem import Fragments

    Chem = _rdkit()
    group = str(v.meta.get("group", ""))
    counter = getattr(Fragments, _GROUP_FRAGMENT.get(group, ""), None)
    if counter is None:
        return VerifierResult(False, "fragments-agreement", f"no fragment counter for {group}")

    choices = v.meta.get("choices", [])
    correct_index = v.meta.get("correct_index", -1)
    for c in choices:
        mol = Chem.MolFromSmiles(str(c.get("smiles", "")))
        if mol is None:
            return VerifierResult(False, "fragments-agreement", f"unreadable {c.get('smiles')}")
        has_group = counter(mol) > 0
        if c.get("index") == correct_index:
            if not has_group:
                return VerifierResult(
                    False, "fragments-agreement", f"keyed choice lacks a {group}"
                )
            if c.get("misconception") is not None:
                return VerifierResult(
                    False, "fragments-agreement", "keyed choice carries a misconception"
                )
        else:
            if has_group:
                return VerifierResult(
                    False, "fragments-agreement", f"distractor {c.get('index')} also has a {group}"
                )
    if correct_index not in {c.get("index") for c in choices}:
        return VerifierResult(False, "fragments-agreement", "no correct choice found")
    return VerifierResult(True, "fragments-agreement", group)


# ---------------------------------------------------------------------------
# org.pka.direction.v1  (ORG1.PKA)
# ---------------------------------------------------------------------------

# Each fixture: two acids by name with an aqueous pKa and the source of each
# number. All values are taken from lessons_org1_u2.py. The proton transfer is
# HA + B-  <=>  A- + HB, and the equilibrium favours the side holding the weaker
# acid, which is the larger pKa.
_PKA_FIXTURES = [
    ("acetic acid", 4.76, "phenol", 9.99, _CRC),
    ("chloroacetic acid", 2.86, "acetic acid", 4.76, _CRC),
    ("acetic acid", 4.76, "water", 15.7, _CRC + " " + _WATER_CONVENTION),
    ("phenol", 9.99, "water", 15.7, _CRC + " " + _WATER_CONVENTION),
]


def _gen_pka_direction(seed: int) -> Variant:
    a_name, a_pka, b_name, b_pka, source = _pick(_PKA_FIXTURES, seed)
    weaker = a_name if a_pka > b_pka else b_name
    stronger = b_name if a_pka > b_pka else a_name
    choices = [
        {
            "index": 0,
            "text": (
                f"Toward {weaker}, because it is the weaker acid (the larger "
                "pKa) and a proton transfer favours the side that holds the "
                "weaker acid."
            ),
            "misconception": None,
            "claim": "toward_weaker",
            "favors": weaker,
        },
        {
            "index": 1,
            "text": (
                f"Toward {stronger}, because it is the stronger acid and a "
                "reaction runs toward the stronger acid."
            ),
            "misconception": "PKA-TOWARD-STRONGER",
            "claim": "toward_stronger",
            "favors": stronger,
        },
        {
            "index": 2,
            "text": (
                "It cannot be decided from the pKa values; the starting "
                "concentrations determine which way the equilibrium lies."
            ),
            "misconception": "PKA-NEEDS-CONC",
            "claim": "indeterminate",
            "favors": "",
        },
    ]
    return Variant(
        template_id="org.pka.direction.v1",
        seed=seed,
        prompt=(
            f"{a_name.capitalize()} has pKa {a_pka:g} and {b_name} has pKa "
            f"{b_pka:g}, both in water. Consider the proton transfer "
            f"HA + B-  <=>  A- + HB, with HA the {a_name} and HB the {b_name}. "
            "Which way does the equilibrium lie?"
        ),
        key="0",
        node="ORG1.PKA",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": 0,
            "a_name": a_name,
            "a_pka": a_pka,
            "b_name": b_name,
            "b_pka": b_pka,
            "source": source,
        },
    )


def _ver_pka_direction(v: Variant) -> VerifierResult:
    """Re-derive the favoured side from the two given numbers.

    This checks the author, which is the right target: an item whose key points
    at the stronger acid marks a correctly reasoning learner wrong. The favoured
    side is the one holding the weaker acid, so the keyed choice must claim
    "toward_weaker" and must name the acid with the larger pKa, and the numbers
    themselves must arrive with a source rather than invented.
    """
    a_pka = float(v.meta.get("a_pka", 0.0))
    b_pka = float(v.meta.get("b_pka", 0.0))
    if a_pka == b_pka:
        return VerifierResult(False, "pka-from-numbers", "equal pKa gives no direction")
    weaker = v.meta.get("a_name") if a_pka > b_pka else v.meta.get("b_name")
    if not str(v.meta.get("source", "")).strip():
        return VerifierResult(False, "pka-from-numbers", "pKa values carry no source")

    choices = v.meta.get("choices", [])
    correct_index = v.meta.get("correct_index", -1)
    correct = next((c for c in choices if c.get("index") == correct_index), None)
    if correct is None:
        return VerifierResult(False, "pka-from-numbers", "correct_index is not a choice")
    if correct.get("claim") != "toward_weaker":
        return VerifierResult(False, "pka-from-numbers", "keyed choice is not the weaker-acid side")
    if correct.get("favors") != weaker:
        return VerifierResult(
            False,
            "pka-from-numbers",
            f"keyed side favours {correct.get('favors')}, weaker acid is {weaker}",
        )
    if correct.get("misconception") is not None:
        return VerifierResult(False, "pka-from-numbers", "keyed choice carries a misconception")
    return VerifierResult(True, "pka-from-numbers", f"weaker acid {weaker}")


# ---------------------------------------------------------------------------
# org.acidity.stronger.v1  (ORG1.ACIDITYFACTORS)
# ---------------------------------------------------------------------------

# Each fixture: two acids with a cited aqueous pKa and a one-line structural
# reason the difference exists, taken from lessons_org1_u2.py. The stronger acid
# is the one with the lower pKa; the item tests the sign of the logarithm.
_ACIDITY_FIXTURES = [
    (
        "chloroacetic acid", 2.86, "acetic acid", 4.76, _CRC,
        "they differ only by a chlorine on the carbon next to the acid group",
    ),
    (
        "acetic acid", 4.76, "phenol", 9.99, _CRC,
        "one delocalises its conjugate-base charge onto oxygen, the other onto ring carbon",
    ),
    (
        "phenol", 9.99, "water", 15.7, _CRC + " " + _WATER_CONVENTION,
        "one conjugate base delocalises its charge into a ring, the other cannot",
    ),
]


def _gen_acidity_stronger(seed: int) -> Variant:
    a_name, a_pka, b_name, b_pka, source, reason = _pick(_ACIDITY_FIXTURES, seed)
    stronger = a_name if a_pka < b_pka else b_name
    # Rotate which name sits at index 0 so the answer is not always the same slot.
    order = [(a_name, a_pka), (b_name, b_pka)]
    if seed % 2:
        order = order[::-1]
    choices = []
    correct_index = -1
    for i, (name, pka) in enumerate(order):
        is_correct = name == stronger
        if is_correct:
            correct_index = i
        choices.append(
            {
                "index": i,
                "text": f"{name} (pKa {pka:g})",
                "misconception": None if is_correct else "STRONGER-ACID-HIGHER-PKA",
                "name": name,
                "pka": pka,
            }
        )
    return Variant(
        template_id="org.acidity.stronger.v1",
        seed=seed,
        prompt=(
            f"{a_name.capitalize()} has pKa {a_pka:g} and {b_name} has pKa "
            f"{b_pka:g}, both in water at 25 degrees Celsius; {reason}. Which is "
            "the stronger acid?"
        ),
        key=str(correct_index),
        node="ORG1.ACIDITYFACTORS",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": correct_index,
            "source": source,
        },
    )


def _ver_acidity_stronger(v: Variant) -> VerifierResult:
    """The stronger acid is the one with the lower pKa; confirm the key agrees.

    A smaller pKa is a stronger acid, so the keyed choice must be the one whose
    cited pKa is the lower of the two, and the numbers must carry a source. This
    catches the sign-of-the-logarithm slip if it ever reached the key.
    """
    choices = v.meta.get("choices", [])
    if len(choices) != 2:
        return VerifierResult(False, "lower-pka-is-stronger", "expected two choices")
    if not str(v.meta.get("source", "")).strip():
        return VerifierResult(False, "lower-pka-is-stronger", "pKa values carry no source")
    lower = min(choices, key=lambda c: float(c.get("pka", 0.0)))
    correct_index = v.meta.get("correct_index", -1)
    if lower.get("index") != correct_index:
        return VerifierResult(
            False,
            "lower-pka-is-stronger",
            f"lower pKa is choice {lower.get('index')}, key is {correct_index}",
        )
    correct = next((c for c in choices if c.get("index") == correct_index), None)
    if correct is None or correct.get("misconception") is not None:
        return VerifierResult(False, "lower-pka-is-stronger", "keyed choice is malformed")
    return VerifierResult(True, "lower-pka-is-stronger", str(lower.get("name")))


# ---------------------------------------------------------------------------
# org.nucleophile.v1  (ORG1.NUCELEC)
# ---------------------------------------------------------------------------

# Species where charge alone decides the role: an anion brings a lone pair and
# donates, a cation has the empty or electron-poor site and accepts. The role is
# re-derived from the net formal charge, so a fixture whose charge and stated
# role disagree cannot be served.
_NUCELEC_FIXTURES = [
    ("[OH-]", "hydroxide", "nucleophile"),
    ("[C-]#N", "the cyanide ion", "nucleophile"),
    ("CC[O-]", "ethoxide", "nucleophile"),
    ("CC(=O)[O-]", "acetate", "nucleophile"),
    ("[NH2-]", "the amide ion", "nucleophile"),
    ("C[S-]", "methanethiolate", "nucleophile"),
    ("[C+](C)(C)C", "the tert-butyl cation", "electrophile"),
    ("[OH3+]", "the hydronium ion", "electrophile"),
    ("CC(C)=[OH+]", "acetone protonated on oxygen", "electrophile"),
]

_NUCELEC_TEXT = {
    "nucleophile": "It acts as a nucleophile, donating a pair of electrons to form a bond.",
    "electrophile": "It acts as an electrophile, accepting a pair of electrons to form a bond.",
}


def _gen_nucleophile(seed: int) -> Variant:
    smiles, name, role = _pick(_NUCELEC_FIXTURES, seed)
    other = "electrophile" if role == "nucleophile" else "nucleophile"
    correct_index = seed % 2
    ordered = [role, other] if correct_index == 0 else [other, role]
    choices = [
        {
            "index": i,
            "text": _NUCELEC_TEXT[r],
            "misconception": None if r == role else "CHARGE-ROLE-INVERTED",
            "role": r,
        }
        for i, r in enumerate(ordered)
    ]
    return Variant(
        template_id="org.nucleophile.v1",
        seed=seed,
        prompt=(
            f"Consider {name}, written as SMILES {smiles}. When it reacts, does "
            "it act as a nucleophile or as an electrophile? Read the charge."
        ),
        key=str(correct_index),
        node="ORG1.NUCELEC",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": correct_index,
            "smiles": smiles,
            "role": role,
        },
    )


def _ver_nucleophile(v: Variant) -> VerifierResult:
    """Recompute the net charge and require it to support the keyed role.

    A net-negative species carries the lone pair that gets donated, so it is the
    nucleophile; a net-positive species has the electron-poor site that accepts,
    so it is the electrophile. A neutral species is refused, because then charge
    does not decide and the item would rest on something this route cannot check.
    """
    Chem = _rdkit()
    mol = Chem.MolFromSmiles(str(v.meta.get("smiles", "")))
    if mol is None:
        return VerifierResult(False, "charge-decides-role", f"cannot read {v.meta.get('smiles')}")
    net = Chem.GetFormalCharge(mol)
    if net == 0:
        return VerifierResult(False, "charge-decides-role", "neutral species; charge does not decide")
    derived = "nucleophile" if net < 0 else "electrophile"
    role = str(v.meta.get("role", ""))
    if derived != role:
        return VerifierResult(
            False, "charge-decides-role", f"charge {net:+d} implies {derived}, fixture says {role}"
        )
    choices = v.meta.get("choices", [])
    correct_index = v.meta.get("correct_index", -1)
    correct = next((c for c in choices if c.get("index") == correct_index), None)
    if correct is None or correct.get("role") != role or correct.get("misconception") is not None:
        return VerifierResult(False, "charge-decides-role", "keyed choice does not match the role")
    return VerifierResult(True, "charge-decides-role", f"{role} ({net:+d})")


# ---------------------------------------------------------------------------
# Registry, hint ladders, and the misconceptions the distractors key.
# ---------------------------------------------------------------------------

TEMPLATES_O_U12: dict[str, dict[str, object]] = {
    "org.draw.v1": {
        "gen": _gen_draw,
        "ver": _ver_draw,
        "node": "ORG1.DRAWING",
        "grader": "structure",
    },
    "org.formalcharge.v1": {
        "gen": _gen_formalcharge,
        "ver": _ver_formalcharge,
        "node": "ORG1.FORMALCHARGEORG",
        "grader": "numeric",
    },
    "org.functionalgroup.v1": {
        "gen": _gen_functionalgroup,
        "ver": _ver_functionalgroup,
        "node": "ORG1.FUNCTIONALGROUPS",
        "grader": "mc",
    },
    "org.pka.direction.v1": {
        "gen": _gen_pka_direction,
        "ver": _ver_pka_direction,
        "node": "ORG1.PKA",
        "grader": "mc",
    },
    "org.acidity.stronger.v1": {
        "gen": _gen_acidity_stronger,
        "ver": _ver_acidity_stronger,
        "node": "ORG1.ACIDITYFACTORS",
        "grader": "mc",
    },
    "org.nucleophile.v1": {
        "gen": _gen_nucleophile,
        "ver": _ver_nucleophile,
        "node": "ORG1.NUCELEC",
        "grader": "mc",
    },
}


HINTS_O_U12: dict[str, tuple[str, str, str]] = {
    "org.draw.v1": (
        "You are asked to translate a name into a structure and write it as a "
        "SMILES string, so the answer is which atom is bonded to which, not a "
        "formula and not the name back again.",
        "Work from the name outward. The parent chain or ring first, then the "
        "functional group the ending names, then the hydrogens that fill the "
        "remaining valences. Carbon takes four bonds, nitrogen three, oxygen "
        "two, a halogen one.",
        "Write the carbon skeleton first, as a bare chain of C atoms with no "
        "hydrogens, and check the number of carbons matches the name before you "
        "add anything else.",
    ),
    "org.formalcharge.v1": (
        "You are asked for the formal charge on one named atom in a given Lewis "
        "structure, a single signed whole number.",
        "Formal charge is the free atom's valence-electron count minus the "
        "electrons it owns in the structure: all of its lone-pair electrons plus "
        "one from each bond. Count those for the marked atom and subtract.",
        "Write down how many valence electrons the neutral atom has on its own "
        "(the main-group number), and stop there before counting what it owns in "
        "the molecule.",
    ),
    "org.functionalgroup.v1": (
        "You are asked which molecule contains a particular functional group, so "
        "you are matching a named group to a pattern of atoms and bonds.",
        "Fix in your mind exactly what the named group is: which atoms, which "
        "bonds, and what has to be attached. A carboxylic acid is a carbonyl "
        "whose carbon also carries an O-H; a ketone is a carbonyl flanked by two "
        "carbons; an aldehyde is a carbonyl carbon that still carries a hydrogen.",
        "Look at each option and mark every carbon-oxygen double bond first, then "
        "check what else is on that carbon, because that is what tells the "
        "carbonyl groups apart.",
    ),
    "org.pka.direction.v1": (
        "You are asked which way a proton transfer lies at equilibrium, given "
        "the pKa of the acid on each side.",
        "Name the acid on both sides first: the one you start with, and the one "
        "formed when the base takes the proton. The equilibrium favours the side "
        "holding the weaker acid, and the weaker acid is the one with the larger "
        "pKa.",
        "Compare the two pKa values and say out loud which acid is the weaker "
        "one, before you decide which side that puts the equilibrium on.",
    ),
    "org.acidity.stronger.v1": (
        "You are asked which of two acids is the stronger one, with both pKa "
        "values given to you.",
        "pKa is the negative logarithm of the acid dissociation constant, so the "
        "sign is the whole trap: a smaller pKa means a larger dissociation "
        "constant, which means a stronger acid.",
        "Circle the smaller of the two pKa numbers before you name a stronger "
        "acid, and resist the pull of the larger one.",
    ),
    "org.nucleophile.v1": (
        "You are asked whether a species reacts as a nucleophile, the electron-"
        "pair donor, or an electrophile, the electron-pair acceptor.",
        "A nucleophile brings a pair of electrons to the reaction; an "
        "electrophile has an electron-poor site that receives one. On these "
        "species the net charge settles it: a full negative charge marks the "
        "donor, a full positive charge marks the acceptor.",
        "Read the charge on the species first and write down its sign, before "
        "you decide which role that sign points to.",
    ),
}


# New misconceptions the distractors above key. Every entry routes to a real
# node in these two units. On sources: the beliefs are familiar from teaching
# these units but the author could not trace each to a specific published study,
# so the source says so rather than attach a citation that was not checked, which
# matches how the existing ORG1 stereochemistry entries were handled. All remain
# review "pending".
_OBS = "Instructor observation; not traced to a published study"

MISCONCEPTIONS_O_U12: dict[str, Misconception] = {
    "HYDROXYL-IS-ACID-GROUP": Misconception(
        code="HYDROXYL-IS-ACID-GROUP",
        name="Any O-H group is a carboxylic acid",
        description=(
            "The learner sees a hydroxyl group and reads it as a carboxylic "
            "acid, not distinguishing an alcohol's O-H from the O-H attached to "
            "a carbonyl carbon."
        ),
        counterexample=(
            "Ethanol has an O-H and is not a carboxylic acid; the acid group "
            "needs that O-H on the same carbon as a carbon-oxygen double bond, "
            "which ethanol does not have."
        ),
        routes_to="ORG1.FUNCTIONALGROUPS",
        source=_OBS,
        review="pending",
    ),
    "CARBONYL-UNDIFFERENTIATED": Misconception(
        code="CARBONYL-UNDIFFERENTIATED",
        name="Every carbon-oxygen double bond is the same functional group",
        description=(
            "The learner treats the carbonyl as one undivided group, so an "
            "acid, an ester, a ketone and an aldehyde all read as "
            "interchangeable because each contains a C=O."
        ),
        counterexample=(
            "Ethanoic acid, methyl ethanoate and propanone all contain a "
            "carbonyl, yet they are an acid, an ester and a ketone; what is "
            "attached to the carbonyl carbon names the group, not the C=O alone."
        ),
        routes_to="ORG1.FUNCTIONALGROUPS",
        source=_OBS,
        review="pending",
    ),
    "ALDEHYDE-KETONE-CONFUSED": Misconception(
        code="ALDEHYDE-KETONE-CONFUSED",
        name="Aldehydes and ketones are the same group",
        description=(
            "The learner does not check whether the carbonyl carbon still holds "
            "a hydrogen, so an aldehyde and a ketone are not told apart."
        ),
        counterexample=(
            "Ethanal is an aldehyde because its carbonyl carbon carries a "
            "hydrogen; propanone is a ketone because its carbonyl carbon carries "
            "two carbons and no hydrogen."
        ),
        routes_to="ORG1.FUNCTIONALGROUPS",
        source=_OBS,
        review="pending",
    ),
    "ESTER-IS-ACID": Misconception(
        code="ESTER-IS-ACID",
        name="An ester is a carboxylic acid",
        description=(
            "The learner sees the carbonyl-oxygen-carbon arrangement of an ester "
            "and reads it as a carboxylic acid, missing that the acidic O-H has "
            "been replaced by an O-carbon bond."
        ),
        counterexample=(
            "Methyl ethanoate has no O-H at all; its acyl oxygen is bonded to a "
            "methyl group, so it is an ester and cannot donate the proton a "
            "carboxylic acid would."
        ),
        routes_to="ORG1.FUNCTIONALGROUPS",
        source=_OBS,
        review="pending",
    ),
    "PKA-TOWARD-STRONGER": Misconception(
        code="PKA-TOWARD-STRONGER",
        name="A proton transfer runs toward the stronger acid",
        description=(
            "The learner reasons that the stronger acid must dominate, so the "
            "equilibrium is expected to lie on the side that holds it, which is "
            "backwards."
        ),
        counterexample=(
            "A strong acid gives its proton away readily, so at equilibrium it is "
            "the species that has lost the proton; the proton ends up held by "
            "the weaker acid, which is the side the equilibrium favours."
        ),
        routes_to="ORG1.PKA",
        source=_OBS,
        review="pending",
    ),
    "PKA-NEEDS-CONC": Misconception(
        code="PKA-NEEDS-CONC",
        name="Direction of a proton transfer needs concentrations",
        description=(
            "The learner believes the two pKa values are not enough to say which "
            "way the equilibrium lies, and that the starting concentrations "
            "decide the direction."
        ),
        counterexample=(
            "The equilibrium constant of a proton transfer is fixed by the "
            "difference in pKa alone; concentrations move how far a particular "
            "mixture has to travel to reach equilibrium, not which side it "
            "favours once there."
        ),
        routes_to="ORG1.PKA",
        source=_OBS,
        review="pending",
    ),
    "STRONGER-ACID-HIGHER-PKA": Misconception(
        code="STRONGER-ACID-HIGHER-PKA",
        name="The larger pKa is the stronger acid",
        description=(
            "The learner treats pKa like an ordinary quantity where bigger means "
            "more, and so calls the acid with the larger pKa the stronger one, "
            "missing the negative sign in the definition."
        ),
        counterexample=(
            "Acetic acid has pKa 4.76 and phenol 9.99, and acetic acid is the "
            "stronger acid; the smaller pKa is the larger dissociation constant."
        ),
        routes_to="ORG1.ACIDITYFACTORS",
        source=_OBS,
        review="pending",
    ),
    "CHARGE-ROLE-INVERTED": Misconception(
        code="CHARGE-ROLE-INVERTED",
        name="A positive charge marks the electron donor",
        description=(
            "The learner maps charge to role the wrong way round, taking a "
            "positive site to be the electron-rich donor and a negative site to "
            "be the acceptor."
        ),
        counterexample=(
            "Hydroxide carries a negative charge and a lone pair it donates, so "
            "it is the nucleophile; a carbocation is positive and electron-poor, "
            "so it is the electrophile that accepts the pair."
        ),
        routes_to="ORG1.NUCELEC",
        source=_OBS,
        review="pending",
    ),
}
