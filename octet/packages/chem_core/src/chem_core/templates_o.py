"""ORG1 templates: the practice items organic chemistry nodes need.

Without these, an authored ORG1 node teaches and cannot be practised, and the
exam catalogue has no organic exams at all, because blueprints are generated
from this registry rather than declared by hand.

Every template here follows the house rule that a grader ships with an
independent verifier. What "independent" means is worth being exact about,
because it is easy to write a verifier that re-runs the generator and proves
nothing:

  unsaturation   generator counts rings and pi bonds from the graph; verifier
                 recomputes from the molecular formula by arithmetic. Two
                 different routes to the same integer.
  cip            generator reads RDKit's CIP labelling; verifier re-derives
                 from the enantiomer, which must give the opposite descriptor.
                 A structure whose mirror image does not invert is not a
                 stereocentre and the item is refused.
  relationship   generator states the intended relationship; verifier derives
                 it from canonical SMILES and stereocentre comparison, and
                 additionally requires the pair to be distinct compounds, which
                 is the meso trap that makes this item type worth having.
  nmr signals    generator counts symmetry classes; verifier requires the
                 per-environment hydrogen counts to sum to the molecule's total
                 hydrogen count, which catches a symmetry perception that
                 dropped or double counted atoms.
  elucidation    generator builds the item; verifier is verify_spectrum_item,
                 which checks that the stated data determines the stated key.

The fixtures are small and explicit rather than drawn from the 200 molecule
general chemistry pool, because organic items need structures chosen for a
specific teaching point (a stereocentre, a symmetry, a degree of unsaturation)
rather than for real world familiarity.
"""

from __future__ import annotations

from .organic import (
    are_diastereomers,
    are_enantiomers,
    degrees_of_unsaturation,
    proton_environments,
    stereocentres,
)
from .registry import Variant, _pick
from .spectra import Signal, SpectrumItem, verify_spectrum_item
from .structure import canonical, formula_of
from .types import VerifierResult

# ---------------------------------------------------------------------------
# org.unsaturation.v1  (ORG1.ISOMERS)
# ---------------------------------------------------------------------------

_UNSATURATION_FIXTURES = [
    ("c1ccccc1", "benzene"),
    ("Cc1ccccc1", "toluene"),
    ("C1CCCCC1", "cyclohexane"),
    ("C=CC=C", "buta-1,3-diene"),
    ("CCO", "ethanol"),
    ("O=C1CCCCC1", "cyclohexanone"),
    ("c1ccc2ccccc2c1", "naphthalene"),
    ("CC#CC", "but-2-yne"),
    ("CC(=O)Oc1ccccc1C(=O)O", "aspirin"),
    ("C1CC1", "cyclopropane"),
]


def _gen_unsaturation(seed: int) -> Variant:
    smiles, name = _pick(_UNSATURATION_FIXTURES, seed)
    formula = formula_of(smiles) or ""
    environments = proton_environments(smiles)
    degrees = degrees_of_unsaturation(formula)
    return Variant(
        template_id="org.unsaturation.v1",
        seed=seed,
        prompt=(
            f"A compound has the molecular formula {formula}. How many degrees "
            "of unsaturation does it have? Give a whole number."
        ),
        key=str(int(degrees)) if degrees is not None else "",
        node="ORG1.ISOMERS",
        grader="numeric",
        meta={
            "value": float(degrees) if degrees is not None else 0.0,
            "unit": "",
            "formula": formula,
            "smiles": smiles,
            "name": name,
            "hydrogens": sum(environments) if environments else 0,
        },
    )


def _ver_unsaturation(v: Variant) -> VerifierResult:
    """Formula arithmetic against a direct count of rings plus pi bonds."""
    smiles = str(v.meta.get("smiles", ""))
    from rdkit import Chem, RDLogger

    RDLogger.DisableLog("rdApp.*")
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return VerifierResult(False, "unsaturation-two-routes", f"cannot read {smiles}")

    kekulized = Chem.Mol(mol)
    try:
        Chem.Kekulize(kekulized, clearAromaticFlags=True)
    except Exception:
        return VerifierResult(False, "unsaturation-two-routes", "cannot Kekulize")
    pi = sum(int(b.GetBondTypeAsDouble()) - 1 for b in kekulized.GetBonds())
    from_graph = mol.GetRingInfo().NumRings() + pi

    from_formula = degrees_of_unsaturation(str(v.meta.get("formula", "")))
    if from_formula is None:
        return VerifierResult(False, "unsaturation-two-routes", "formula unreadable")
    if abs(from_formula - from_graph) > 1e-9:
        return VerifierResult(
            False,
            "unsaturation-two-routes",
            f"formula gives {from_formula}, graph gives {from_graph}",
        )
    if abs(float(v.meta["value"]) - from_graph) > 1e-9:
        return VerifierResult(
            False, "unsaturation-two-routes", f"key {v.meta['value']} is not {from_graph}"
        )
    return VerifierResult(True, "unsaturation-two-routes", f"{from_graph}")


# ---------------------------------------------------------------------------
# org.cip.v1  (ORG1.RS)
# ---------------------------------------------------------------------------

# Every entry has exactly one stereocentre. The descriptor is not recorded
# here on purpose: recording it would let a typo become the answer key. It is
# derived at generation time and cross checked against the mirror image.
_CIP_FIXTURES = [
    ("OC[C@@H](O)C=O", "glyceraldehyde"),
    ("OC[C@H](O)C=O", "glyceraldehyde"),
    ("CC[C@@H](C)O", "butan-2-ol"),
    ("CC[C@H](C)O", "butan-2-ol"),
    ("C[C@H](N)C(=O)O", "alanine"),
    ("C[C@@H](N)C(=O)O", "alanine"),
    ("CC[C@H](C)Cl", "2-chlorobutane"),
    ("CC[C@@H](C)Cl", "2-chlorobutane"),
]

_MIRROR = {"@": "@@", "@@": "@"}


def _mirror_smiles(smiles: str) -> str:
    """Invert every tetrahedral tag, giving the mirror image."""
    return smiles.replace("[C@@H]", "\x00").replace("[C@H]", "[C@@H]").replace("\x00", "[C@H]")


def _gen_cip(seed: int) -> Variant:
    smiles, name = _pick(_CIP_FIXTURES, seed)
    centres = stereocentres(smiles) or []
    descriptor = centres[0].descriptor if centres else ""
    # The distractor is the opposite descriptor, and it carries the belief that
    # most often produces it: reading the rotation without first checking that
    # the lowest priority group points away from the viewer.
    correct_index = 0 if descriptor == "R" else 1
    choices = [
        {
            "index": 0,
            "text": "R",
            "misconception": None if descriptor == "R" else "CIP-VIEWER-FACING",
        },
        {
            "index": 1,
            "text": "S",
            "misconception": None if descriptor == "S" else "CIP-VIEWER-FACING",
        },
    ]
    return Variant(
        template_id="org.cip.v1",
        seed=seed,
        prompt=(
            f"The structure below is one enantiomer of {name}, written as the "
            f"SMILES string {smiles}. It has one stereocentre. Is that centre "
            "R or S?"
        ),
        key=str(correct_index),
        node="ORG1.RS",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": correct_index,
            "smiles": smiles,
            "name": name,
            "descriptor": descriptor,
        },
    )


def _ver_cip(v: Variant) -> VerifierResult:
    """The mirror image must carry the opposite descriptor.

    This is a genuinely separate assertion from "RDKit said R". If inverting
    every tag does not flip the label, either the molecule has no real
    stereocentre or the fixture is malformed, and in both cases the item is
    unanswerable and must not be served.
    """
    smiles = str(v.meta.get("smiles", ""))
    centres = stereocentres(smiles) or []
    if len(centres) != 1:
        return VerifierResult(
            False, "cip-mirror", f"{smiles} has {len(centres)} stereocentres, expected 1"
        )
    descriptor = centres[0].descriptor
    if descriptor not in ("R", "S"):
        return VerifierResult(False, "cip-mirror", "the centre is unassigned")

    mirror = _mirror_smiles(smiles)
    mirror_centres = stereocentres(mirror) or []
    if len(mirror_centres) != 1:
        return VerifierResult(False, "cip-mirror", "the mirror image is malformed")
    if mirror_centres[0].descriptor == descriptor:
        return VerifierResult(
            False, "cip-mirror", "inverting the tag did not change the descriptor"
        )
    if not are_enantiomers(smiles, mirror):
        return VerifierResult(False, "cip-mirror", "the pair are not enantiomers")

    choices = v.meta.get("choices", [])
    keyed = choices[v.meta.get("correct_index", -1)]["text"]
    if keyed != descriptor:
        return VerifierResult(
            False, "cip-mirror", f"keyed choice {keyed} does not match derived {descriptor}"
        )
    return VerifierResult(True, "cip-mirror", descriptor)


# ---------------------------------------------------------------------------
# org.relationship.v1  (ORG1.ENANTIODIA)
# ---------------------------------------------------------------------------

_TARTARIC_RR = "O[C@@H](C(=O)O)[C@@H](O)C(=O)O"
_TARTARIC_SS = "O[C@H](C(=O)O)[C@H](O)C(=O)O"
_TARTARIC_MESO = "O[C@@H](C(=O)O)[C@H](O)C(=O)O"
_MESO_OTHER_SPELLING = "O[C@H](C(=O)O)[C@@H](O)C(=O)O"

_RELATIONSHIP_FIXTURES = [
    (_TARTARIC_RR, _TARTARIC_SS, "enantiomers"),
    (_TARTARIC_RR, _TARTARIC_MESO, "diastereomers"),
    (_TARTARIC_SS, _TARTARIC_MESO, "diastereomers"),
    (_TARTARIC_MESO, _MESO_OTHER_SPELLING, "identical"),
    ("CC[C@@H](C)O", "CC[C@H](C)O", "enantiomers"),
    ("CCO", "COC", "constitutional"),
    ("C[C@@H](O)[C@H](Cl)C", "C[C@H](O)[C@@H](Cl)C", "enantiomers"),
    ("C[C@@H](O)[C@H](Cl)C", "C[C@@H](O)[C@@H](Cl)C", "diastereomers"),
]

# Each distractor names the belief that produces it. Choosing "enantiomers"
# for a meso pair is the meso trap; choosing "constitutional isomers" for two
# stereoisomers is treating constitutional isomerism as the catch all.
_RELATIONSHIP_CHOICES = [
    ("Enantiomers", "MESO-AS-ENANTIOMERS"),
    ("Diastereomers", "MESO-AS-ENANTIOMERS"),
    ("The same compound", "STEREO-AS-CONSTITUTIONAL"),
    ("Constitutional isomers", "STEREO-AS-CONSTITUTIONAL"),
]
_KIND_TO_INDEX = {
    "enantiomers": 0,
    "diastereomers": 1,
    "identical": 2,
    "constitutional": 3,
}


def _relationship_choices(correct_index: int) -> list[dict]:
    return [
        {
            "index": i,
            "text": text,
            "misconception": None if i == correct_index else code,
        }
        for i, (text, code) in enumerate(_RELATIONSHIP_CHOICES)
    ]


def _gen_relationship(seed: int) -> Variant:
    a, b, kind = _pick(_RELATIONSHIP_FIXTURES, seed)
    correct_index = _KIND_TO_INDEX[kind]
    return Variant(
        template_id="org.relationship.v1",
        seed=seed,
        prompt=(
            f"Consider these two structures, written as SMILES: {a} and {b}. "
            "What is the relationship between them?"
        ),
        key=str(correct_index),
        node="ORG1.ENANTIODIA",
        grader="mc",
        meta={
            "choices": _relationship_choices(correct_index),
            "correct_index": correct_index,
            "a": a,
            "b": b,
            "kind": kind,
        },
    )


def _ver_relationship(v: Variant) -> VerifierResult:
    """Re-derive the relationship from structure, independent of the fixture."""
    a, b, kind = str(v.meta["a"]), str(v.meta["b"]), str(v.meta["kind"])
    ca, cb = canonical(a), canonical(b)
    if ca is None or cb is None:
        return VerifierResult(False, "relationship-derived", "a structure is unreadable")

    flat_a = canonical(a, keep_stereo=False)
    flat_b = canonical(b, keep_stereo=False)
    same_compound = ca == cb

    if kind == "identical":
        derived = "identical" if same_compound else "?"
    elif same_compound:
        # Two spellings of one molecule can only be "identical". Any other key
        # would make the item unanswerable, which is precisely the meso trap.
        derived = "identical"
    elif flat_a != flat_b:
        derived = "constitutional" if formula_of(a) == formula_of(b) else "?"
    elif are_enantiomers(a, b):
        derived = "enantiomers"
    elif are_diastereomers(a, b):
        derived = "diastereomers"
    else:
        derived = "?"

    if derived != kind:
        return VerifierResult(
            False, "relationship-derived", f"fixture says {kind}, structure gives {derived}"
        )
    if v.meta["correct_index"] != _KIND_TO_INDEX[kind]:
        return VerifierResult(False, "relationship-derived", "keyed choice is wrong")
    return VerifierResult(True, "relationship-derived", kind)


# ---------------------------------------------------------------------------
# org.nmr.signals.v1  (ORG1.NMRINTEGRATION)
# ---------------------------------------------------------------------------

_NMR_FIXTURES = [
    ("Cc1ccccc1", "toluene"),
    ("Cc1ccc(C)cc1", "para-xylene"),
    ("Cc1cccc(C)c1", "meta-xylene"),
    ("CC(C)(C)C", "neopentane"),
    ("CCOC(C)=O", "ethyl acetate"),
    ("CCCC", "butane"),
    ("ClCCCl", "1,2-dichloroethane"),
    ("CC(C)C", "2-methylpropane"),
    ("c1ccccc1", "benzene"),
    ("CC(=O)C", "propanone"),
]


def _gen_nmr_signals(seed: int) -> Variant:
    smiles, name = _pick(_NMR_FIXTURES, seed)
    environments = proton_environments(smiles) or []
    return Variant(
        template_id="org.nmr.signals.v1",
        seed=seed,
        prompt=(
            f"How many distinct signals appear in the 1H NMR spectrum of "
            f"{name}? Consider which hydrogens are equivalent by symmetry. "
            "Give a whole number."
        ),
        key=str(len(environments)),
        node="ORG1.NMRINTEGRATION",
        grader="numeric",
        meta={
            "value": float(len(environments)),
            "unit": "",
            "smiles": smiles,
            "name": name,
            "ratio": environments,
        },
    )


def _ver_nmr_signals(v: Variant) -> VerifierResult:
    """Environment counts must account for every hydrogen, exactly once.

    Summing the per-environment counts and comparing against the molecule's
    total hydrogen count is a different assertion from "how many classes are
    there", and it catches the failure that matters: a symmetry perception
    that lost or duplicated atoms.
    """
    smiles = str(v.meta.get("smiles", ""))
    environments = proton_environments(smiles)
    if environments is None:
        return VerifierResult(False, "environment-conservation", f"cannot read {smiles}")

    from rdkit import Chem, RDLogger

    RDLogger.DisableLog("rdApp.*")
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return VerifierResult(False, "environment-conservation", "unreadable")
    total_h = sum(a.GetTotalNumHs() for a in mol.GetAtoms())

    if sum(environments) != total_h:
        return VerifierResult(
            False,
            "environment-conservation",
            f"environments total {sum(environments)} hydrogens, molecule has {total_h}",
        )
    if int(v.meta["value"]) != len(environments):
        return VerifierResult(
            False,
            "environment-conservation",
            f"key {v.meta['value']} is not {len(environments)}",
        )
    return VerifierResult(
        True, "environment-conservation", ":".join(str(n) for n in environments)
    )


# ---------------------------------------------------------------------------
# org.elucidation.v1  (ORG1.ELUCIDATION)
# ---------------------------------------------------------------------------

# Only structures whose proton symmetry alone narrows the answer usefully. No
# chemical shifts appear in any of these items, because this system cannot
# verify a shift, and an item that stated one would be asserting something
# nobody checked.
_ELUCIDATION_FIXTURES = [
    ("Cc1ccc(C)cc1", "para-xylene"),
    ("CC(C)(C)C", "neopentane"),
    ("Cc1ccccc1", "toluene"),
    ("CCOC(C)=O", "ethyl acetate"),
    ("c1ccccc1", "benzene"),
    ("ClCCCl", "1,2-dichloroethane"),
]


def _gen_elucidation(seed: int) -> Variant:
    smiles, name = _pick(_ELUCIDATION_FIXTURES, seed)
    formula = formula_of(smiles) or ""
    environments = proton_environments(smiles) or []
    ratio = ":".join(str(n) for n in environments)
    degrees = degrees_of_unsaturation(formula)
    return Variant(
        template_id="org.elucidation.v1",
        seed=seed,
        prompt=(
            f"A compound has molecular formula {formula}. Its 1H NMR spectrum "
            f"shows {len(environments)} signal(s) with integration ratio "
            f"{ratio}. Propose a structure consistent with this data, and give "
            "it as a SMILES string."
        ),
        key=smiles,
        node="ORG1.ELUCIDATION",
        grader="spectrum",
        meta={
            "formula": formula,
            "signals": [{"protons": n} for n in environments],
            "node": "ORG1.ELUCIDATION",
            "name": name,
            "degrees_of_unsaturation": degrees,
            # No shifts and no IR bands, so no source is required. Stated
            # explicitly rather than left implicit.
            "source": "",
        },
    )


def _ver_elucidation(v: Variant) -> VerifierResult:
    """The stated data must determine the stated key.

    This is grader 10's item verifier rather than an answer verifier, which is
    the right check here: an elucidation item whose spectrum does not fit its
    own answer marks a correctly reasoning learner wrong.
    """
    item = SpectrumItem(
        node=str(v.meta.get("node", "")),
        formula=str(v.meta.get("formula", "")),
        answer=v.key,
        signals=tuple(Signal(**s) for s in v.meta.get("signals", [])),
        source=str(v.meta.get("source", "")),
    )
    return verify_spectrum_item(item)


ORG1_TEMPLATES: dict[str, dict[str, object]] = {
    "org.unsaturation.v1": {
        "gen": _gen_unsaturation,
        "ver": _ver_unsaturation,
        "node": "ORG1.ISOMERS",
        "grader": "numeric",
    },
    "org.cip.v1": {
        "gen": _gen_cip,
        "ver": _ver_cip,
        "node": "ORG1.RS",
        "grader": "mc",
    },
    "org.relationship.v1": {
        "gen": _gen_relationship,
        "ver": _ver_relationship,
        "node": "ORG1.ENANTIODIA",
        "grader": "mc",
    },
    "org.nmr.signals.v1": {
        "gen": _gen_nmr_signals,
        "ver": _ver_nmr_signals,
        "node": "ORG1.NMRINTEGRATION",
        "grader": "numeric",
    },
    "org.elucidation.v1": {
        "gen": _gen_elucidation,
        "ver": _ver_elucidation,
        "node": "ORG1.ELUCIDATION",
        "grader": "spectrum",
    },
}
