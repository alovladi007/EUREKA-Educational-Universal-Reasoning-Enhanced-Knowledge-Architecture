"""ORG1 templates for units 5, 6 and 7: the practice items those nodes need.

Units 5 through 7 were authored and could be read, but not practised: a node
without a template teaches and then stops, and its unit exam cannot be
assembled because the blueprint is generated from this registry rather than
declared by hand. This module supplies the missing items, one or more per
unit, following the same rule the rest of chem_core follows: every grader
ships with a verifier that reaches the same conclusion by a genuinely
different computation, so a learner is never served a variant whose key was
not independently confirmed.

What "independent" means here, template by template:

  carbocation   generator marks the authored most-stable cation; verifier
                re-derives the substitution degree of every choice from the
                structure (it finds the cationic carbon by formal charge and
                counts its carbon neighbours) and requires the keyed choice to
                be the unique maximum. Fixtures only use choices whose degrees
                strictly order, so allyl versus secondary never arises.
  reactiontype  generator states the class; verifier derives it purely from
                formula arithmetic on the two sides (an addition gains atoms,
                an elimination loses them, a substitution swaps one for
                another), never from the reagent's name.
  ez            generator marks E or Z; verifier reads the descriptor from
                RDKit's CIP labeller and then inverts the double bond geometry
                and requires the label to flip, which a non-stereogenic double
                bond will not do. That inversion is the E/Z analogue of the
                mirror image check the R/S item uses.
  markovnikov   a mechanism-outcome item, so its key carries a citation and is
                not machine derived. The verifier instead checks the item is
                answerable: the two candidate products are genuinely
                constitutional isomers and the regiochemistry claim is sourced.
  hydrogenation generator counts the product's unsaturation from its formula;
                verifier recomputes from rings plus pi bonds on the graph,
                requires the product to be fully saturated, and requires the
                ring count to survive the reduction. Two routes to one integer.
  tautomer      generator marks the keto form; verifier derives keto from a
                carbonyl substructure and enol from a C=C-O-H substructure,
                and requires the pair to be constitutional isomers of one
                formula.
  terminal      generator marks the terminal alkyne; verifier derives the
                terminal C#C-H by substructure and requires exactly one choice
                to carry it.

House rules observed: ASCII only; no invented numbers; the two mechanism
outcome keys (carbocation stability ordering and Markovnikov regiochemistry)
carry meta["source"] with a real citation reused from the ORG1 lesson data;
substrates are ordinary teaching molecules with no preparative detail.
"""

from __future__ import annotations

from .misconceptions import Misconception
from .organic import degrees_of_unsaturation
from .registry import Variant, _pick
from .structure import canonical, formula_of
from .types import VerifierResult

# ---------------------------------------------------------------------------
# Citations. Reused verbatim in substance from the reviewed ORG1 lesson data
# (apps/api/app/data/lessons_org1_u5.py and lessons_org1_u6.py) so the two
# mechanism-outcome keys point at the same sources the lessons cite.
# ---------------------------------------------------------------------------

_CATION_STABILITY_SOURCE = (
    "Carbocation stability increases from methyl through primary and secondary "
    "to tertiary. Gas phase thermochemical measurements place the stabilities "
    "of the methyl, ethyl, isopropyl and tert-butyl cations in that order, "
    "from least to most stable. Lias, S. G.; Bartmess, J. E.; Liebman, J. F.; "
    "Holmes, J. L.; Levin, R. D.; Mallard, W. G., Gas-Phase Ion and Neutral "
    "Thermochemistry, Journal of Physical and Chemical Reference Data, 1988, "
    "volume 17, supplement 1; see also the NIST Chemistry WebBook."
)

_MARKOVNIKOV_SOURCE = (
    "Markovnikov's rule: in the addition of HX to an unsymmetrical alkene, the "
    "hydrogen adds to the carbon of the double bond bearing the greater number "
    "of hydrogen atoms, and the addition proceeds through the more stable "
    "carbocation. IUPAC Compendium of Chemical Terminology (the Gold Book), "
    "entry for Markownikoff rule; see also the chapter on electrophilic "
    "addition to alkenes in Clayden, Greeves and Warren, Organic Chemistry, "
    "Oxford University Press."
)


# ---------------------------------------------------------------------------
# Small RDKit helpers. RDKit is imported inside functions, matching templates_o.
# ---------------------------------------------------------------------------


def _rdkit():
    from rdkit import Chem, RDLogger

    RDLogger.DisableLog("rdApp.*")
    return Chem


def _element_counts(smiles: str) -> dict[str, int] | None:
    """Atom counts with hydrogens made explicit, for formula arithmetic."""
    Chem = _rdkit()
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return None
    mol = Chem.AddHs(mol)
    counts: dict[str, int] = {}
    for atom in mol.GetAtoms():
        counts[atom.GetSymbol()] = counts.get(atom.GetSymbol(), 0) + 1
    return counts


def _carbon_count(smiles: str) -> int | None:
    Chem = _rdkit()
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return None
    return sum(1 for a in mol.GetAtoms() if a.GetSymbol() == "C")


def _cation_degree(smiles: str) -> int | None:
    """Substitution degree of a carbocation, from the structure.

    Finds the single carbon that carries the positive charge and counts how
    many of its neighbours are carbon: methyl gives 0, primary 1, secondary 2,
    tertiary 3. Returns None when the structure does not carry exactly one
    carbocation centre.
    """
    Chem = _rdkit()
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return None
    cations = [
        a for a in mol.GetAtoms() if a.GetSymbol() == "C" and a.GetFormalCharge() == 1
    ]
    if len(cations) != 1:
        return None
    return sum(1 for nb in cations[0].GetNeighbors() if nb.GetSymbol() == "C")


def _has_substructure(smarts: str, smiles: str) -> bool:
    Chem = _rdkit()
    mol = Chem.MolFromSmiles(smiles)
    patt = Chem.MolFromSmarts(smarts)
    return mol is not None and patt is not None and mol.HasSubstructMatch(patt)


def _ez_labels(smiles: str) -> list[str] | None:
    """CIP E/Z labels on every stereogenic double bond, in bond order."""
    Chem = _rdkit()
    from rdkit.Chem import rdCIPLabeler

    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return None
    Chem.AssignStereochemistry(mol, cleanIt=True, force=True)
    rdCIPLabeler.AssignCIPLabels(mol)
    labels = []
    for bond in mol.GetBonds():
        if bond.GetStereo() != Chem.BondStereo.STEREONONE:
            code = bond.GetPropsAsDict().get("_CIPCode")
            if code in ("E", "Z"):
                labels.append(code)
    return labels


def _flip_first_directional(smiles: str) -> str:
    """Invert the first directional bond, which flips one double bond's geometry.

    Flipping a single ``/`` or ``\\`` turns a cis double bond trans and vice
    versa, so a true stereogenic double bond must report the opposite CIP label
    afterwards. Flipping both directional bonds would preserve the geometry, so
    only the first is touched.
    """
    out = []
    done = False
    for ch in smiles:
        if not done and ch == "/":
            out.append("\\")
            done = True
        elif not done and ch == "\\":
            out.append("/")
            done = True
        else:
            out.append(ch)
    return "".join(out)


def _dou_from_graph(smiles: str) -> tuple[float, int] | None:
    """Degrees of unsaturation and ring count, counted directly from the graph."""
    Chem = _rdkit()
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return None
    kekulized = Chem.Mol(mol)
    try:
        Chem.Kekulize(kekulized, clearAromaticFlags=True)
    except Exception:
        return None
    pi = sum(int(b.GetBondTypeAsDouble()) - 1 for b in kekulized.GetBonds())
    rings = mol.GetRingInfo().NumRings()
    return rings + pi, rings


def _mc_choices(payloads: list[dict], seed: int) -> tuple[list[dict], int]:
    """Rotate the choice list by the seed so the answer is not always first.

    Exactly one payload carries misconception=None; that is the correct choice
    and its position after rotation becomes correct_index. Extra keys such as
    "smiles" are carried through untouched.
    """
    n = len(payloads)
    rotation = seed % n
    ordered = payloads[rotation:] + payloads[:rotation]
    choices: list[dict] = []
    correct_index = 0
    for i, payload in enumerate(ordered):
        choice = {
            "index": i,
            "text": payload["text"],
            "misconception": payload.get("misconception"),
        }
        for k, val in payload.items():
            if k not in ("text", "misconception"):
                choice[k] = val
        choices.append(choice)
        if payload.get("misconception") is None:
            correct_index = i
    return choices, correct_index


# ---------------------------------------------------------------------------
# org.carbocation.stability.v1  (ORG1.CARBOCATION, unit 5)
# ---------------------------------------------------------------------------

# Each set names three carbocations with strictly distinct substitution
# degrees, so "most stable" is decided by the ordering alone. The last entry in
# each set is the most substituted and therefore the correct answer.
_METHYL = ("the methyl cation", "[CH3+]")
_ETHYL = ("the ethyl cation, a primary carbocation", "C[CH2+]")
_PROPYL_1 = ("the propan-1-yl cation, a primary carbocation", "CC[CH2+]")
_ISOPROPYL = ("the propan-2-yl cation, a secondary carbocation", "C[CH+]C")
_BUTAN_2_YL = ("the butan-2-yl cation, a secondary carbocation", "CC[CH+]C")
_TERT_BUTYL = ("the tert-butyl cation, a tertiary carbocation", "C[C+](C)C")
_METHYLBUTAN_2_YL = (
    "the 2-methylbutan-2-yl cation, a tertiary carbocation",
    "CC[C+](C)C",
)

_CARBOCATION_FIXTURES = [
    [_METHYL, _ETHYL, _ISOPROPYL],
    [_ETHYL, _ISOPROPYL, _TERT_BUTYL],
    [_METHYL, _ISOPROPYL, _TERT_BUTYL],
    [_PROPYL_1, _BUTAN_2_YL, _METHYLBUTAN_2_YL],
    [_METHYL, _ETHYL, _TERT_BUTYL],
]


def _gen_carbocation(seed: int) -> Variant:
    trio = _pick(_CARBOCATION_FIXTURES, seed)
    correct = trio[-1]  # authored as the most substituted of the three
    payloads = [
        {
            "text": label,
            "smiles": smiles,
            "misconception": None if (label, smiles) == correct else "CATION-MORE-SUBST-LESS-STABLE",
        }
        for (label, smiles) in trio
    ]
    choices, correct_index = _mc_choices(payloads, seed)
    return Variant(
        template_id="org.carbocation.stability.v1",
        seed=seed,
        prompt=(
            "Three carbocations are listed below. Which one is the most "
            "stable?"
        ),
        key=str(correct_index),
        node="ORG1.CARBOCATION",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": correct_index,
            "source": _CATION_STABILITY_SOURCE,
        },
    )


def _ver_carbocation(v: Variant) -> VerifierResult:
    """Re-derive each cation's substitution degree; the key must be the maximum.

    Nothing about the generator's authored answer is trusted: the cationic
    carbon is found by its formal charge and its carbon neighbours are counted,
    so the ordering is rebuilt from the structures. The degrees must strictly
    order (no ties, which would make "most stable" ambiguous) and the keyed
    choice must be the unique most substituted one.
    """
    choices = v.meta.get("choices", [])
    degrees = []
    for c in choices:
        degree = _cation_degree(str(c.get("smiles", "")))
        if degree is None:
            return VerifierResult(
                False, "cation-substitution-degree", f"cannot read cation {c.get('smiles')}"
            )
        degrees.append(degree)
    if len(set(degrees)) != len(degrees):
        return VerifierResult(
            False, "cation-substitution-degree", f"degrees {degrees} do not strictly order"
        )
    max_index = max(range(len(degrees)), key=lambda i: degrees[i])
    if max_index != v.meta.get("correct_index"):
        return VerifierResult(
            False,
            "cation-substitution-degree",
            f"most substituted is choice {max_index}, key names {v.meta.get('correct_index')}",
        )
    if not str(v.meta.get("source", "")).strip():
        return VerifierResult(
            False, "cation-substitution-degree", "stability ordering carries no source"
        )
    return VerifierResult(True, "cation-substitution-degree", f"degrees {degrees}")


# ---------------------------------------------------------------------------
# org.reactiontype.v1  (ORG1.REACTIONTYPES, unit 5)
# ---------------------------------------------------------------------------

# (reactant, product, added-or-lost small molecule, class, wording). The small
# molecule double checks additions and eliminations; substitution needs none
# because its signature is a mixed sign difference (an atom leaves and another
# joins). Every pair is a bookkeeping exercise on given structures and asserts
# nothing about conditions.
_REACTIONTYPE_FIXTURES = [
    ("C=C", "CCBr", "Br", "addition", "ethene is converted to bromoethane"),
    ("CC=C", "CCC", "[HH]", "addition", "propene is converted to propane"),
    ("C=C", "BrCCBr", "BrBr", "addition", "ethene is converted to 1,2-dibromoethane"),
    ("CCBr", "C=C", "Br", "elimination", "bromoethane is converted to ethene"),
    ("CCO", "C=C", "O", "elimination", "ethanol is converted to ethene"),
    ("CCCBr", "CC=C", "Br", "elimination", "1-bromopropane is converted to propene"),
    ("CBr", "CO", "", "substitution", "bromomethane is converted to methanol"),
    ("CCBr", "CCO", "", "substitution", "bromoethane is converted to ethanol"),
    ("CBr", "CI", "", "substitution", "bromomethane is converted to iodomethane"),
]

_REACTIONTYPE_LABELS = [
    ("Addition", "addition"),
    ("Elimination", "elimination"),
    ("Substitution", "substitution"),
]


def _gen_reactiontype(seed: int) -> Variant:
    reactant, product, delta, kind, wording = _pick(_REACTIONTYPE_FIXTURES, seed)
    payloads = [
        {
            "text": text,
            "misconception": None if value == kind else "REACTION-TYPE-BY-REAGENT",
        }
        for (text, value) in _REACTIONTYPE_LABELS
    ]
    choices, correct_index = _mc_choices(payloads, seed)
    return Variant(
        template_id="org.reactiontype.v1",
        seed=seed,
        prompt=(
            f"In the transformation below, {wording} (in SMILES notation, "
            f"{reactant} becomes {product}). Classify the reaction as an "
            "addition, an elimination or a substitution."
        ),
        key=str(correct_index),
        node="ORG1.REACTIONTYPES",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": correct_index,
            "reactant": reactant,
            "product": product,
            "delta": delta,
            "kind": kind,
        },
    )


def _ver_reactiontype(v: Variant) -> VerifierResult:
    """Derive the class from formula arithmetic on the two sides.

    The atom count difference between product and reactant decides the class:
    all gains is an addition, all losses is an elimination, and gains together
    with losses is a substitution. This shares nothing with the reagent-based
    reasoning the distractors reward.
    """
    reactant = str(v.meta.get("reactant", ""))
    product = str(v.meta.get("product", ""))
    delta = str(v.meta.get("delta", ""))
    kind = str(v.meta.get("kind", ""))

    left = _element_counts(reactant)
    right = _element_counts(product)
    if left is None or right is None:
        return VerifierResult(False, "reaction-formula-arithmetic", "a structure is unreadable")

    elements = set(left) | set(right)
    diff = {e: right.get(e, 0) - left.get(e, 0) for e in elements}
    diff = {e: val for e, val in diff.items() if val}
    gains = any(val > 0 for val in diff.values())
    losses = any(val < 0 for val in diff.values())

    if gains and not losses:
        derived = "addition"
    elif losses and not gains:
        derived = "elimination"
    elif gains and losses:
        derived = "substitution"
    else:
        derived = "none"

    if derived in ("addition", "elimination") and delta:
        small = _element_counts(delta)
        if small is None:
            return VerifierResult(False, "reaction-formula-arithmetic", f"cannot read {delta}")
        signed = diff if derived == "addition" else {e: -val for e, val in diff.items()}
        if any(signed.get(e, 0) != small.get(e, 0) for e in set(signed) | set(small)):
            return VerifierResult(
                False,
                "reaction-formula-arithmetic",
                f"the atoms gained or lost do not match {delta}",
            )

    if derived != kind:
        return VerifierResult(
            False, "reaction-formula-arithmetic", f"fixture says {kind}, arithmetic gives {derived}"
        )
    keyed = str(v.meta["choices"][v.meta["correct_index"]]["text"]).strip().lower()
    if keyed != kind:
        return VerifierResult(
            False, "reaction-formula-arithmetic", f"keyed choice {keyed} is not {kind}"
        )
    return VerifierResult(True, "reaction-formula-arithmetic", derived)


# ---------------------------------------------------------------------------
# org.ez.v1  (ORG1.ALKENENOMEN, unit 6)
# ---------------------------------------------------------------------------

# Each fixture is one stereogenic double bond written with explicit geometry.
# The descriptor is not trusted from here: it is derived and cross checked by
# inverting the geometry, which must flip the label.
_EZ_FIXTURES = [
    ("C/C=C/C", "E", "but-2-ene"),
    ("C/C=C\\C", "Z", "but-2-ene"),
    ("F/C=C/Cl", "E", "1-chloro-2-fluoroethene"),
    ("F/C=C\\Cl", "Z", "1-chloro-2-fluoroethene"),
    ("CC/C=C/CC", "E", "hex-3-ene"),
    ("CC/C=C\\CC", "Z", "hex-3-ene"),
    ("C/C=C/Cl", "E", "1-chloroprop-1-ene"),
    ("C/C=C\\Cl", "Z", "1-chloroprop-1-ene"),
]


def _gen_ez(seed: int) -> Variant:
    smiles, descriptor, name = _pick(_EZ_FIXTURES, seed)
    payloads = [
        {"text": "E", "misconception": None if descriptor == "E" else "EZ-BY-DRAWING-SIDE"},
        {"text": "Z", "misconception": None if descriptor == "Z" else "EZ-BY-DRAWING-SIDE"},
    ]
    choices, correct_index = _mc_choices(payloads, seed)
    return Variant(
        template_id="org.ez.v1",
        seed=seed,
        prompt=(
            f"The alkene {name} is written as the SMILES string {smiles}. Its "
            "carbon-carbon double bond is stereogenic. Does it have the E or "
            "the Z configuration?"
        ),
        key=str(correct_index),
        node="ORG1.ALKENENOMEN",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": correct_index,
            "smiles": smiles,
            "name": name,
            "descriptor": descriptor,
        },
    )


def _ver_ez(v: Variant) -> VerifierResult:
    """Read the CIP label, then invert the geometry and require it to flip.

    A double bond that keeps its label when its geometry is inverted is not
    stereogenic, so the item would have no answer and is refused. This is the
    E/Z counterpart of the R/S item's mirror image check.
    """
    smiles = str(v.meta.get("smiles", ""))
    descriptor = str(v.meta.get("descriptor", ""))

    labels = _ez_labels(smiles)
    if labels is None:
        return VerifierResult(False, "ez-geometry-inversion", f"cannot read {smiles}")
    if len(labels) != 1:
        return VerifierResult(
            False, "ez-geometry-inversion", f"expected one stereogenic double bond, found {len(labels)}"
        )
    derived = labels[0]

    inverted = _ez_labels(_flip_first_directional(smiles))
    if inverted is None or len(inverted) != 1:
        return VerifierResult(False, "ez-geometry-inversion", "the inverted structure is malformed")
    if inverted[0] == derived:
        return VerifierResult(
            False, "ez-geometry-inversion", "inverting the geometry did not change the descriptor"
        )
    if derived != descriptor:
        return VerifierResult(
            False, "ez-geometry-inversion", f"fixture says {descriptor}, structure gives {derived}"
        )
    keyed = str(v.meta["choices"][v.meta["correct_index"]]["text"])
    if keyed != derived:
        return VerifierResult(
            False, "ez-geometry-inversion", f"keyed choice {keyed} does not match derived {derived}"
        )
    return VerifierResult(True, "ez-geometry-inversion", derived)


# ---------------------------------------------------------------------------
# org.markovnikov.v1  (ORG1.HXADDITION, unit 6)
# ---------------------------------------------------------------------------

# (alkene, reagent, Markovnikov product + name, anti-Markovnikov product +
# name). The regiochemistry is a mechanism outcome, so the key is authored and
# sourced rather than machine derived; the verifier checks the item is
# answerable, not which product forms.
_MARKOVNIKOV_FIXTURES = [
    ("propene", "hydrogen bromide (HBr)", "CC(Br)C", "2-bromopropane", "CCCBr", "1-bromopropane"),
    ("propene", "hydrogen chloride (HCl)", "CC(Cl)C", "2-chloropropane", "CCCCl", "1-chloropropane"),
    (
        "2-methylpropene",
        "hydrogen bromide (HBr)",
        "CC(C)(Br)C",
        "2-bromo-2-methylpropane",
        "CC(C)CBr",
        "1-bromo-2-methylpropane",
    ),
    ("but-1-ene", "hydrogen bromide (HBr)", "CCC(Br)C", "2-bromobutane", "CCCCBr", "1-bromobutane"),
    ("propene", "water with an acid catalyst", "CC(O)C", "propan-2-ol", "CCCO", "propan-1-ol"),
    ("but-1-ene", "hydrogen chloride (HCl)", "CCC(Cl)C", "2-chlorobutane", "CCCCCl", "1-chlorobutane"),
]


def _gen_markovnikov(seed: int) -> Variant:
    alkene, reagent, mark, mark_name, anti, anti_name = _pick(_MARKOVNIKOV_FIXTURES, seed)
    payloads = [
        {"text": f"{mark_name}, {mark}", "smiles": mark, "misconception": None},
        {"text": f"{anti_name}, {anti}", "smiles": anti, "misconception": "ANTI-MARKOVNIKOV-DEFAULT"},
    ]
    choices, correct_index = _mc_choices(payloads, seed)
    return Variant(
        template_id="org.markovnikov.v1",
        seed=seed,
        prompt=(
            f"{alkene[0].upper() + alkene[1:]} reacts with {reagent} by "
            "electrophilic addition. Which product is the Markovnikov product?"
        ),
        key=str(correct_index),
        node="ORG1.HXADDITION",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": correct_index,
            "mark_smiles": mark,
            "anti_smiles": anti,
            "source": _MARKOVNIKOV_SOURCE,
        },
    )


def _ver_markovnikov(v: Variant) -> VerifierResult:
    """Check the item is answerable and sourced, not which product forms.

    Whether the reaction gives Markovnikov regiochemistry is not derivable from
    the structures, so that claim carries a citation and is not re-derived
    here. What is checked is that the two candidates are genuinely different
    constitutional isomers, so exactly one right answer exists, and that the
    regiochemistry claim is sourced. The keyed choice must be the authored
    Markovnikov product.
    """
    mark = str(v.meta.get("mark_smiles", ""))
    anti = str(v.meta.get("anti_smiles", ""))
    cm, ca = canonical(mark), canonical(anti)
    if cm is None or ca is None:
        return VerifierResult(False, "markovnikov-answerable", "a product is unreadable")
    if cm == ca:
        return VerifierResult(False, "markovnikov-answerable", "the two products are one structure")
    if formula_of(mark) != formula_of(anti):
        return VerifierResult(
            False,
            "markovnikov-answerable",
            f"products are not isomers: {formula_of(mark)} vs {formula_of(anti)}",
        )
    if canonical(mark, keep_stereo=False) == canonical(anti, keep_stereo=False):
        return VerifierResult(
            False, "markovnikov-answerable", "the two products share one connectivity"
        )
    if not str(v.meta.get("source", "")).strip():
        return VerifierResult(False, "markovnikov-answerable", "regiochemistry claim carries no source")
    keyed = v.meta["choices"][v.meta["correct_index"]]
    if canonical(str(keyed.get("smiles", ""))) != cm:
        return VerifierResult(
            False, "markovnikov-answerable", "keyed choice is not the authored Markovnikov product"
        )
    return VerifierResult(True, "markovnikov-answerable", f"{formula_of(mark)} isomers, sourced")


# ---------------------------------------------------------------------------
# org.hydrogenation.unsat.v1  (ORG1.HYDROGENATION, unit 6)
# ---------------------------------------------------------------------------

# (reactant, fully saturated product, reactant name). Complete hydrogenation
# consumes every carbon-carbon pi bond and leaves rings intact, so the product
# unsaturation equals the reactant's ring count. Both routes to that integer
# are checked.
_HYDROGENATION_FIXTURES = [
    ("CC=C", "CCC", "propene"),
    ("C1=CCCCC1", "C1CCCCC1", "cyclohexene"),
    ("CC#C", "CCC", "propyne"),
    ("C=CCC=C", "CCCCC", "penta-1,4-diene"),
    ("C1=CCCC1", "C1CCCC1", "cyclopentene"),
    ("CCC#C", "CCCC", "but-1-yne"),
]

_HYDROGENATION_SOURCE = (
    "Catalytic hydrogenation adds H2 across carbon-carbon multiple bonds and "
    "does not cleave carbon-carbon single bonds, so rings are retained. "
    "Standard textbook account; see the chapter on addition reactions of "
    "alkenes and the section on catalytic hydrogenation in Clayden, Greeves "
    "and Warren, Organic Chemistry, Oxford University Press."
)


def _gen_hydrogenation(seed: int) -> Variant:
    reactant, product, name = _pick(_HYDROGENATION_FIXTURES, seed)
    reactant_formula = formula_of(reactant) or ""
    # Formula route to the answer: unsaturation of the saturated product.
    after = degrees_of_unsaturation(formula_of(product) or "")
    after_int = int(after) if after is not None else 0
    return Variant(
        template_id="org.hydrogenation.unsat.v1",
        seed=seed,
        prompt=(
            f"The compound {name} has molecular formula {reactant_formula}. It "
            "undergoes complete catalytic hydrogenation. How many degrees of "
            "unsaturation does the fully saturated product have? Give a whole "
            "number."
        ),
        key=str(after_int),
        node="ORG1.HYDROGENATION",
        grader="numeric",
        meta={
            "value": float(after_int),
            "unit": "",
            "reactant": reactant,
            "product": product,
            "name": name,
            "source": _HYDROGENATION_SOURCE,
        },
    )


def _ver_hydrogenation(v: Variant) -> VerifierResult:
    """Graph count of the product's unsaturation, cross checked against formula.

    The product must be fully saturated (its only unsaturation is its rings)
    and it must have the same ring count and carbon count as the reactant, so
    it really is the saturation of that skeleton. The answer is that shared
    ring count, reached once from the formula in the generator and once from
    the graph here.
    """
    reactant = str(v.meta.get("reactant", ""))
    product = str(v.meta.get("product", ""))

    product_graph = _dou_from_graph(product)
    if product_graph is None:
        return VerifierResult(False, "hydrogenation-two-routes", f"cannot read {product}")
    product_dou, product_rings = product_graph

    from_formula = degrees_of_unsaturation(formula_of(product) or "")
    if from_formula is None:
        return VerifierResult(False, "hydrogenation-two-routes", "product formula unreadable")
    if abs(from_formula - product_dou) > 1e-9:
        return VerifierResult(
            False,
            "hydrogenation-two-routes",
            f"product formula gives {from_formula}, graph gives {product_dou}",
        )
    if product_dou != product_rings:
        return VerifierResult(
            False, "hydrogenation-two-routes", "the product still has carbon-carbon pi bonds"
        )

    reactant_graph = _dou_from_graph(reactant)
    if reactant_graph is None:
        return VerifierResult(False, "hydrogenation-two-routes", f"cannot read {reactant}")
    reactant_rings = reactant_graph[1]
    if product_rings != reactant_rings:
        return VerifierResult(
            False, "hydrogenation-two-routes", "hydrogenation changed the ring count"
        )

    if _carbon_count(reactant) != _carbon_count(product):
        return VerifierResult(
            False, "hydrogenation-two-routes", "product is not the same carbon skeleton"
        )
    if int(v.meta["value"]) != product_rings:
        return VerifierResult(
            False, "hydrogenation-two-routes", f"key {v.meta['value']} is not {product_rings}"
        )
    return VerifierResult(True, "hydrogenation-two-routes", f"{product_rings}")


# ---------------------------------------------------------------------------
# org.tautomer.keto.v1  (ORG1.TAUTOMER, unit 7)
# ---------------------------------------------------------------------------

# (keto form + name, enol form + name). Same molecular formula, different
# connectivity, so a genuine tautomeric pair. The keto form carries a carbonyl
# and no enol O-H; the enol carries a C=C-O-H and no carbonyl.
_KETO_SMARTS = "[CX3]=[OX1]"
_ENOL_SMARTS = "[CX3]=[CX3][OX2H1]"

_TAUTOMER_FIXTURES = [
    ("CC(C)=O", "propanone (acetone)", "CC(O)=C", "prop-1-en-2-ol"),
    ("CC=O", "ethanal", "C=CO", "ethenol"),
    ("CCC=O", "propanal", "CC=CO", "prop-1-en-1-ol"),
    ("CCC(C)=O", "butan-2-one", "CC(O)=CC", "but-2-en-2-ol"),
    ("O=C1CCCCC1", "cyclohexanone", "OC1=CCCCC1", "cyclohex-1-en-1-ol"),
]


def _gen_tautomer(seed: int) -> Variant:
    keto, keto_name, enol, enol_name = _pick(_TAUTOMER_FIXTURES, seed)
    payloads = [
        {"text": f"{keto_name}, {keto}", "smiles": keto, "misconception": None},
        {"text": f"{enol_name}, {enol}", "smiles": enol, "misconception": "ENOL-AS-KETO"},
    ]
    choices, correct_index = _mc_choices(payloads, seed)
    return Variant(
        template_id="org.tautomer.keto.v1",
        seed=seed,
        prompt=(
            "The two structures below are tautomers of one another. Which one "
            "is the keto tautomer?"
        ),
        key=str(correct_index),
        node="ORG1.TAUTOMER",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": correct_index,
            "keto_smiles": keto,
            "enol_smiles": enol,
        },
    )


def _ver_tautomer(v: Variant) -> VerifierResult:
    """Derive keto and enol from substructure; require a true tautomeric pair.

    The keto form must show a carbonyl and no enol O-H, the enol must show a
    C=C-O-H and no carbonyl, and the two must be constitutional isomers of one
    formula. The keyed choice must be the keto form.
    """
    keto = str(v.meta.get("keto_smiles", ""))
    enol = str(v.meta.get("enol_smiles", ""))

    if not (_has_substructure(_KETO_SMARTS, keto) and not _has_substructure(_ENOL_SMARTS, keto)):
        return VerifierResult(False, "keto-enol-substructure", "the keto form does not present a carbonyl")
    if not (_has_substructure(_ENOL_SMARTS, enol) and not _has_substructure(_KETO_SMARTS, enol)):
        return VerifierResult(False, "keto-enol-substructure", "the enol form does not present C=C-O-H")

    if formula_of(keto) != formula_of(enol):
        return VerifierResult(
            False,
            "keto-enol-substructure",
            f"the pair are not isomers: {formula_of(keto)} vs {formula_of(enol)}",
        )
    ck, ce = canonical(keto), canonical(enol)
    if ck is None or ce is None:
        return VerifierResult(False, "keto-enol-substructure", "a structure is unreadable")
    if ck == ce:
        return VerifierResult(False, "keto-enol-substructure", "the two forms are identical")
    if canonical(keto, keep_stereo=False) == canonical(enol, keep_stereo=False):
        return VerifierResult(False, "keto-enol-substructure", "the two forms share one connectivity")

    keyed = v.meta["choices"][v.meta["correct_index"]]
    if canonical(str(keyed.get("smiles", ""))) != ck:
        return VerifierResult(False, "keto-enol-substructure", "keyed choice is not the keto form")
    return VerifierResult(True, "keto-enol-substructure", f"{formula_of(keto)} tautomers")


# ---------------------------------------------------------------------------
# org.alkyne.terminal.v1  (ORG1.ALKYNENOMEN, unit 7)
# ---------------------------------------------------------------------------

# Each set pairs one terminal alkyne (a hydrogen on a triple bonded carbon)
# with one internal alkyne. Exactly one choice carries the terminal C#C-H.
_TERMINAL_SMARTS = "[CX2H1]#[CX2]"

_TERMINAL_FIXTURES = [
    ("but-1-yne", "C#CCC", "but-2-yne", "CC#CC"),
    ("pent-1-yne", "C#CCCC", "pent-2-yne", "CCC#CC"),
    ("hex-1-yne", "C#CCCCC", "hex-3-yne", "CCC#CCC"),
    ("prop-1-yne (propyne)", "C#CC", "but-2-yne", "CC#CC"),
]


def _gen_terminal(seed: int) -> Variant:
    term_name, term_smiles, int_name, int_smiles = _pick(_TERMINAL_FIXTURES, seed)
    payloads = [
        {"text": f"{term_name}, {term_smiles}", "smiles": term_smiles, "misconception": None},
        {
            "text": f"{int_name}, {int_smiles}",
            "smiles": int_smiles,
            "misconception": "INTERNAL-ALKYNE-AS-TERMINAL",
        },
    ]
    choices, correct_index = _mc_choices(payloads, seed)
    return Variant(
        template_id="org.alkyne.terminal.v1",
        seed=seed,
        prompt="Which of the alkynes below is a terminal alkyne?",
        key=str(correct_index),
        node="ORG1.ALKYNENOMEN",
        grader="mc",
        meta={"choices": choices, "correct_index": correct_index},
    )


def _ver_terminal(v: Variant) -> VerifierResult:
    """Exactly one choice must carry a terminal C#C-H, and it is the keyed one."""
    choices = v.meta.get("choices", [])
    matches = [
        i for i, c in enumerate(choices) if _has_substructure(_TERMINAL_SMARTS, str(c.get("smiles", "")))
    ]
    if len(matches) != 1:
        return VerifierResult(
            False, "terminal-alkyne-substructure", f"expected one terminal alkyne, found {matches}"
        )
    if matches[0] != v.meta.get("correct_index"):
        return VerifierResult(
            False,
            "terminal-alkyne-substructure",
            f"terminal alkyne is choice {matches[0]}, key names {v.meta.get('correct_index')}",
        )
    return VerifierResult(True, "terminal-alkyne-substructure", f"terminal at choice {matches[0]}")


# ---------------------------------------------------------------------------
# Registry, hints and misconceptions for units 5, 6 and 7.
# ---------------------------------------------------------------------------

TEMPLATES_O_U567: dict[str, dict[str, object]] = {
    "org.carbocation.stability.v1": {
        "gen": _gen_carbocation,
        "ver": _ver_carbocation,
        "node": "ORG1.CARBOCATION",
        "grader": "mc",
    },
    "org.reactiontype.v1": {
        "gen": _gen_reactiontype,
        "ver": _ver_reactiontype,
        "node": "ORG1.REACTIONTYPES",
        "grader": "mc",
    },
    "org.ez.v1": {
        "gen": _gen_ez,
        "ver": _ver_ez,
        "node": "ORG1.ALKENENOMEN",
        "grader": "mc",
    },
    "org.markovnikov.v1": {
        "gen": _gen_markovnikov,
        "ver": _ver_markovnikov,
        "node": "ORG1.HXADDITION",
        "grader": "mc",
    },
    "org.hydrogenation.unsat.v1": {
        "gen": _gen_hydrogenation,
        "ver": _ver_hydrogenation,
        "node": "ORG1.HYDROGENATION",
        "grader": "numeric",
    },
    "org.tautomer.keto.v1": {
        "gen": _gen_tautomer,
        "ver": _ver_tautomer,
        "node": "ORG1.TAUTOMER",
        "grader": "mc",
    },
    "org.alkyne.terminal.v1": {
        "gen": _gen_terminal,
        "ver": _ver_terminal,
        "node": "ORG1.ALKYNENOMEN",
        "grader": "mc",
    },
}


HINTS_O_U567: dict[str, tuple[str, str, str]] = {
    "org.carbocation.stability.v1": (
        "You are being asked which of these carbocations is the most stable, "
        "which means comparing them, not judging any one on its own.",
        "A carbocation is stabilised by the alkyl groups attached to its "
        "positive carbon, so the comparison comes down to how many carbon "
        "groups each cationic carbon carries. More attached carbon groups "
        "means a more stable cation.",
        "For each cation, find the carbon that bears the positive charge and "
        "count how many carbon atoms are bonded directly to it. Write those "
        "three counts down before deciding.",
    ),
    "org.reactiontype.v1": (
        "You are being asked to name the class of reaction. The reagent is not "
        "the tell; what happened to the atoms is.",
        "Compare the atoms in the product with the atoms in the reactant. Net "
        "atoms gained points to an addition, net atoms lost to an elimination, "
        "and one atom or group traded for another to a substitution.",
        "Write out the atom count of the reactant and of the product side by "
        "side, and look only at what changed.",
    ),
    "org.ez.v1": (
        "You are being asked whether the double bond is E or Z, which is a "
        "statement about which groups sit on the same side of it.",
        "On each end of the double bond, decide which of the two attached "
        "groups has the higher Cahn-Ingold-Prelog priority. If the two higher "
        "priority groups are on the same side the bond is Z, and if they are "
        "on opposite sides it is E.",
        "Take one end of the double bond first and rank its two groups by the "
        "atomic number of the first atom, before you look at the other end.",
    ),
    "org.markovnikov.v1": (
        "You are being asked which product forms when the two candidates are "
        "the two possible places the parts of the reagent could land.",
        "Markovnikov's rule follows the more stable carbocation: the electrophile "
        "adds so that the positive charge lands on the carbon that can best "
        "support it, which is the more substituted carbon.",
        "Decide which of the two double bond carbons would give the more stable "
        "cation if the hydrogen added to the other one, and write that down "
        "before choosing a product.",
    ),
    "org.hydrogenation.unsat.v1": (
        "You are being asked for the degrees of unsaturation left in the "
        "product after complete hydrogenation, not in the starting material.",
        "Complete hydrogenation adds hydrogen across every carbon-carbon "
        "double and triple bond, removing those, but it does not open rings. "
        "So the unsaturation that survives is exactly the rings.",
        "Count how many rings the starting structure contains, and set the "
        "pi bonds aside since hydrogenation removes them.",
    ),
    "org.tautomer.keto.v1": (
        "You are being asked which of the two structures is the keto form. "
        "They have the same formula and differ only in where a hydrogen and a "
        "double bond sit.",
        "The keto tautomer places the double bond between carbon and oxygen, "
        "giving a carbonyl, with no O-H. The enol places the double bond "
        "between two carbons and puts the hydrogen on the oxygen, giving an "
        "O-H.",
        "Look at each structure for a carbon-oxygen double bond. The one that "
        "has it, and has no O-H, is the keto form.",
    ),
    "org.alkyne.terminal.v1": (
        "You are being asked which alkyne is terminal, which is about where "
        "the triple bond sits in the chain.",
        "A terminal alkyne has its triple bond at the end of the chain, so one "
        "of the two triple bonded carbons still carries a hydrogen. An "
        "internal alkyne has carbon groups on both ends of the triple bond.",
        "For each structure, find the triple bond and check whether either of "
        "its carbons has a hydrogen still attached.",
    ),
}


# New misconception codes the distractors above key. Each routes to a real node
# and stays review="pending" until a named subject matter expert signs it off.
# The source field is honest: none of these is traced to a specific published
# study, so each records that rather than borrowing an unrelated citation.
_INSTRUCTOR_OBSERVATION = "Instructor observation; not traced to a published study."

MISCONCEPTIONS_O_U567: dict[str, Misconception] = {
    m.code: m
    for m in [
        Misconception(
            code="CATION-MORE-SUBST-LESS-STABLE",
            name="A less substituted carbocation is more stable",
            description=(
                "The learner inverts the stability order, treating a carbocation "
                "with fewer attached alkyl groups as more stable, sometimes by "
                "reasoning that less crowding is more favourable."
            ),
            counterexample=(
                "The tert-butyl cation, with three alkyl groups on the positive "
                "carbon, can be generated and observed directly in superacid, "
                "while the methyl cation cannot. The more substituted cation is "
                "the more stable one, not the less."
            ),
            routes_to="ORG1.CARBOCATION",
            source=_INSTRUCTOR_OBSERVATION,
        ),
        Misconception(
            code="REACTION-TYPE-BY-REAGENT",
            name="A reaction's class is read from its reagent",
            description=(
                "The learner names the class of a reaction from the identity of "
                "the reagent rather than from what happens to the atoms of the "
                "substrate."
            ),
            counterexample=(
                "Adding HBr across a double bond and swapping a bromide for a "
                "hydroxide both involve bromine, yet one gains atoms and is an "
                "addition while the other trades one group for another and is a "
                "substitution. Only counting atoms tells them apart."
            ),
            routes_to="ORG1.REACTIONTYPES",
            source=_INSTRUCTOR_OBSERVATION,
        ),
        Misconception(
            code="EZ-BY-DRAWING-SIDE",
            name="E and Z are read from how the structure is drawn",
            description=(
                "The learner assigns E or Z from which groups happen to be drawn "
                "up or down on the page rather than from Cahn-Ingold-Prelog "
                "priority."
            ),
            counterexample=(
                "Two higher priority groups on the same side of the double bond "
                "make it Z no matter how the skeleton is rotated on the page. "
                "The descriptor depends on priority, not on the drawing."
            ),
            routes_to="ORG1.ALKENENOMEN",
            source=_INSTRUCTOR_OBSERVATION,
        ),
        Misconception(
            code="ANTI-MARKOVNIKOV-DEFAULT",
            name="The halogen adds to the carbon with more hydrogens",
            description=(
                "The learner places the halogen of HX on the less substituted "
                "carbon, putting the hydrogen on the more substituted one and so "
                "inverting Markovnikov regiochemistry in ordinary acid addition."
            ),
            counterexample=(
                "HBr adds to propene through the more stable secondary cation, so "
                "the bromine ends up on the central carbon and the product is "
                "2-bromopropane, not 1-bromopropane."
            ),
            routes_to="ORG1.HXADDITION",
            source=_INSTRUCTOR_OBSERVATION,
        ),
        Misconception(
            code="ENOL-AS-KETO",
            name="The enol is mistaken for the keto form",
            description=(
                "The learner selects the enol, with its C=C and O-H, when asked "
                "for the keto tautomer, not distinguishing the carbonyl form from "
                "the enol form."
            ),
            counterexample=(
                "The keto tautomer has a carbon-oxygen double bond and no O-H, "
                "while the enol has a carbon-carbon double bond and an O-H. They "
                "are constitutional isomers, not the same structure."
            ),
            routes_to="ORG1.TAUTOMER",
            source=_INSTRUCTOR_OBSERVATION,
        ),
        Misconception(
            code="INTERNAL-ALKYNE-AS-TERMINAL",
            name="An internal alkyne is treated as terminal",
            description=(
                "The learner counts an internal alkyne as terminal, not noticing "
                "that a terminal alkyne needs a hydrogen on a triple bonded "
                "carbon."
            ),
            counterexample=(
                "But-2-yne carries carbon groups on both ends of its triple bond "
                "and has no hydrogen on either triple bonded carbon, so it has no "
                "terminal C-H at all."
            ),
            routes_to="ORG1.ALKYNENOMEN",
            source=_INSTRUCTOR_OBSERVATION,
        ),
    ]
}
