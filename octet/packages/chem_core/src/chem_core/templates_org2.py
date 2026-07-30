"""ORG2 practice templates.

The three fan-out authoring agents that were meant to write per-unit template
modules were interrupted mid-run, so this single module covers ORG2 directly,
reusing the patterns proven on ORG1 in templates_o.py. Every generator has a
verifier that takes a different route to the answer, every multiple choice
distractor keys a named misconception, and every fixture fact was derived from
RDKit before being written.

Coverage spans all ten ORG2 units through their most machine-checkable nodes,
so each unit becomes practiceable and its unit exam assembles. The retro-
synthesis trainer on ORG2.RETROSYNTHESIS lives in templates_retro.py and is not
duplicated here.
"""

from __future__ import annotations

from .organic import degrees_of_unsaturation, proton_environments, stereocentres
from .registry import Variant, _pick
from .structure import canonical, formula_of
from .types import VerifierResult


# ---------------------------------------------------------------------------
# Shared verifier helpers
# ---------------------------------------------------------------------------


def _ver_unsaturation_numeric(v: Variant) -> VerifierResult:
    """Formula arithmetic against a Kekulized rings-plus-pi count."""
    smiles = str(v.meta.get("smiles", ""))
    from rdkit import Chem, RDLogger

    RDLogger.DisableLog("rdApp.*")
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return VerifierResult(False, "unsaturation-two-routes", f"cannot read {smiles}")
    kek = Chem.Mol(mol)
    try:
        Chem.Kekulize(kek, clearAromaticFlags=True)
    except Exception:
        return VerifierResult(False, "unsaturation-two-routes", "cannot Kekulize")
    pi = sum(int(b.GetBondTypeAsDouble()) - 1 for b in kek.GetBonds())
    from_graph = mol.GetRingInfo().NumRings() + pi
    from_formula = degrees_of_unsaturation(str(v.meta.get("formula", "")))
    if from_formula is None or abs(from_formula - from_graph) > 1e-9:
        return VerifierResult(False, "unsaturation-two-routes", "routes disagree")
    if abs(float(v.meta["value"]) - from_graph) > 1e-9:
        return VerifierResult(False, "unsaturation-two-routes", "key is not the derived value")
    return VerifierResult(True, "unsaturation-two-routes", str(from_graph))


def _ver_nmr_numeric(v: Variant) -> VerifierResult:
    """Per-environment H counts must sum to the molecule's total hydrogens."""
    smiles = str(v.meta.get("smiles", ""))
    envs = proton_environments(smiles)
    if envs is None:
        return VerifierResult(False, "environment-conservation", f"cannot read {smiles}")
    from rdkit import Chem, RDLogger

    RDLogger.DisableLog("rdApp.*")
    mol = Chem.MolFromSmiles(smiles)
    total_h = sum(a.GetTotalNumHs() for a in mol.GetAtoms()) if mol else -1
    if sum(envs) != total_h:
        return VerifierResult(False, "environment-conservation", "environments miss atoms")
    if int(v.meta["value"]) != len(envs):
        return VerifierResult(False, "environment-conservation", "key is not the signal count")
    return VerifierResult(True, "environment-conservation", ":".join(map(str, envs)))


def _mc_choices(options: list[tuple[str, str | None]], correct: int) -> list[dict]:
    """options is [(text, misconception_or_None)]; the correct index keys None."""
    return [
        {"index": i, "text": text, "misconception": None if i == correct else code}
        for i, (text, code) in enumerate(options)
    ]


# ---------------------------------------------------------------------------
# org2.unsaturation.v1  (ORG2.CONJUGATION - dienes and aromatics)
# ---------------------------------------------------------------------------

_U_FIX = [
    ("c1ccccc1", "benzene"),
    ("Cc1ccccc1", "toluene"),
    ("c1ccc2ccccc2c1", "naphthalene"),
    ("C=CC=C", "buta-1,3-diene"),
    ("C1=CCCCC1", "cyclohexene"),
    ("c1ccncc1", "pyridine"),
    ("C=CC=CC=C", "hexa-1,3,5-triene"),
    ("O=C1CCCCC1", "cyclohexanone"),
]


def _gen_u(seed: int) -> Variant:
    smiles, name = _pick(_U_FIX, seed)
    formula = formula_of(smiles) or ""
    d = degrees_of_unsaturation(formula)
    return Variant(
        template_id="org2.unsaturation.v1",
        seed=seed,
        prompt=(
            f"{name} has the molecular formula {formula}. How many degrees of "
            "unsaturation does it have? Give a whole number."
        ),
        key=str(int(d)) if d is not None else "",
        node="ORG2.CONJUGATION",
        grader="numeric",
        meta={"value": float(d) if d is not None else 0.0, "unit": "", "smiles": smiles, "formula": formula},
    )


# ---------------------------------------------------------------------------
# org2.aromatic.nmr.v1  (ORG2.AROMATICSPECTRA - substitution symmetry)
# ---------------------------------------------------------------------------

_NMR_FIX = [
    ("c1ccccc1", "benzene"),
    ("Cc1ccccc1", "toluene"),
    ("Cc1ccc(C)cc1", "para-xylene"),
    ("Cc1cccc(C)c1", "meta-xylene"),
    ("Cc1ccccc1C", "ortho-xylene"),
    ("Cc1cc(C)cc(C)c1", "mesitylene"),
]


def _gen_nmr(seed: int) -> Variant:
    smiles, name = _pick(_NMR_FIX, seed)
    envs = proton_environments(smiles) or []
    return Variant(
        template_id="org2.aromatic.nmr.v1",
        seed=seed,
        prompt=(
            f"How many distinct signals appear in the 1H NMR spectrum of "
            f"{name}? Count hydrogens equivalent by symmetry as one. Give a "
            "whole number."
        ),
        key=str(len(envs)),
        node="ORG2.AROMATICSPECTRA",
        grader="numeric",
        meta={"value": float(len(envs)), "unit": "", "smiles": smiles, "name": name},
    )


# ---------------------------------------------------------------------------
# org2.oxidation.v1  (ORG2.OXIDATION - alcohol oxidation product)
# ---------------------------------------------------------------------------
# The key is the product class, derived: a primary alcohol (the OH carbon bears
# two H) oxidizes to an aldehyde then acid; a secondary alcohol (OH carbon bears
# one H) oxidizes to a ketone; a tertiary alcohol (no H on the OH carbon) does
# not oxidize. The verifier re-derives the OH-carbon hydrogen count with RDKit.

_OX_FIX = [
    ("CCO", "ethanol", "primary"),
    ("CCCO", "propan-1-ol", "primary"),
    ("CC(O)C", "propan-2-ol", "secondary"),
    ("CCC(O)C", "butan-2-ol", "secondary"),
    ("CC(C)(O)C", "2-methylpropan-2-ol", "tertiary"),
]

_OX_OPTIONS = ["a ketone", "an aldehyde or carboxylic acid", "no reaction; it does not oxidize"]
_OX_KEY = {"primary": 1, "secondary": 0, "tertiary": 2}
_OX_MIS = {
    "primary": "OXIDATION-PRIMARY-TO-KETONE",
    "secondary": "OXIDATION-SECONDARY-TO-ALDEHYDE",
    "tertiary": "OXIDATION-TERTIARY-REACTS",
}


def _oh_carbon_h(smiles: str) -> int | None:
    from rdkit import Chem, RDLogger

    RDLogger.DisableLog("rdApp.*")
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return None
    for atom in mol.GetAtoms():
        if atom.GetSymbol() == "O" and atom.GetTotalNumHs() == 1:
            for nb in atom.GetNeighbors():
                if nb.GetSymbol() == "C":
                    return nb.GetTotalNumHs()
    return None


def _gen_ox(seed: int) -> Variant:
    smiles, name, cls = _pick(_OX_FIX, seed)
    correct = _OX_KEY[cls]
    options = []
    for i, text in enumerate(_OX_OPTIONS):
        # Each wrong option keys the misconception of the class it wrongly names.
        if i == correct:
            options.append((text, None))
        elif i == 0:
            options.append((text, _OX_MIS["primary"]))
        elif i == 2:
            options.append((text, _OX_MIS["tertiary"]))
        else:
            options.append((text, _OX_MIS["secondary"]))
    return Variant(
        template_id="org2.oxidation.v1",
        seed=seed,
        prompt=(
            f"Under a standard oxidizing agent, what does {name} give? Consider "
            "how many hydrogens sit on the carbon bearing the hydroxyl group."
        ),
        key=str(correct),
        node="ORG2.OXIDATION",
        grader="mc",
        meta={"choices": _mc_choices(options, correct), "correct_index": correct, "smiles": smiles, "cls": cls},
    )


def _ver_ox(v: Variant) -> VerifierResult:
    h = _oh_carbon_h(str(v.meta.get("smiles", "")))
    expected = {2: 1, 1: 0, 0: 2}.get(h)  # 2H primary->idx1, 1H secondary->idx0, 0H tertiary->idx2
    if expected is None:
        return VerifierResult(False, "oh-carbon-h", "could not read the hydroxyl carbon")
    if v.meta.get("correct_index") != expected:
        return VerifierResult(False, "oh-carbon-h", f"OH carbon has {h} H; key disagrees")
    return VerifierResult(True, "oh-carbon-h", f"OH carbon bears {h} hydrogen(s)")


# ---------------------------------------------------------------------------
# org2.tautomer.v1  (ORG2.TAUTOMERISM - keto vs enol)
# ---------------------------------------------------------------------------
# Two structures, a keto and an enol form; which is the keto tautomer? Derived:
# the keto form has a C=O and no O-H on that oxygen; the enol has C=C-O-H. The
# verifier confirms the pair are constitutional isomers and identifies the keto
# form by substructure.

# (keto SMILES, keto name, enol SMILES, enol name). Each name was read back
# against its structure with RDKit before being written; note the enol of
# butan-2-one used here is but-1-en-2-ol (enolization toward C1), not
# but-2-en-2-ol, which an earlier combined label misnamed.
_TAUT_FIX = [
    ("CC(=O)C", "propan-2-one", "CC(O)=C", "prop-1-en-2-ol"),
    ("CCC(=O)C", "butan-2-one", "CCC(O)=C", "but-1-en-2-ol"),
    ("CC=O", "ethanal", "C=CO", "ethenol"),
    ("CCC=O", "propanal", "CC=CO", "prop-1-en-1-ol"),
]


def _has_ketone_or_aldehyde(smiles: str) -> bool:
    from rdkit import Chem, RDLogger

    RDLogger.DisableLog("rdApp.*")
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return False
    patt = Chem.MolFromSmarts("[CX3]=[OX1]")
    return mol.HasSubstructMatch(patt)


def _gen_taut(seed: int) -> Variant:
    keto, keto_name, enol, enol_name = _pick(_TAUT_FIX, seed)
    # Randomize which option is listed first by seed parity, deriving the key.
    first_is_keto = seed % 2 == 0
    a, b = (keto, enol) if first_is_keto else (enol, keto)
    a_name, b_name = (keto_name, enol_name) if first_is_keto else (enol_name, keto_name)
    correct = 0 if first_is_keto else 1
    options = [
        (f"the first structure ({a})", None if correct == 0 else "TAUTOMER-KETO-ENOL-CONFUSED"),
        (f"the second structure ({b})", None if correct == 1 else "TAUTOMER-KETO-ENOL-CONFUSED"),
    ]
    return Variant(
        template_id="org2.tautomer.v1",
        seed=seed,
        prompt=(
            f"These two structures, {a_name} (SMILES {a}) and {b_name} "
            f"(SMILES {b}), are tautomers. Which one is the keto form?"
        ),
        key=str(correct),
        node="ORG2.TAUTOMERISM",
        grader="mc",
        meta={
            "choices": _mc_choices(options, correct),
            "correct_index": correct,
            "keto": keto,
            "enol": enol,
        },
    )


def _ver_taut(v: Variant) -> VerifierResult:
    keto, enol = str(v.meta["keto"]), str(v.meta["enol"])
    # The pair must be constitutional isomers (same formula, different graph).
    if formula_of(keto) != formula_of(enol):
        return VerifierResult(False, "tautomer-derived", "not the same formula")
    if canonical(keto, keep_stereo=False) == canonical(enol, keep_stereo=False):
        return VerifierResult(False, "tautomer-derived", "the two are the same structure")
    if not _has_ketone_or_aldehyde(keto):
        return VerifierResult(False, "tautomer-derived", "the keto fixture has no carbonyl")
    if _has_ketone_or_aldehyde(enol):
        return VerifierResult(False, "tautomer-derived", "the enol fixture has a carbonyl")
    keyed_text = v.meta["choices"][v.meta["correct_index"]]["text"]
    if keto not in keyed_text:
        return VerifierResult(False, "tautomer-derived", "keyed option is not the keto form")
    return VerifierResult(True, "tautomer-derived", "keto identified by carbonyl")


# ---------------------------------------------------------------------------
# org2.amine.class.v1  (ORG2.AMINEPROPS - 1/2/3 amine)
# ---------------------------------------------------------------------------

_AMINE_FIX = [
    ("CN", "methylamine", 1),
    ("CCN", "ethylamine", 1),
    ("CNC", "dimethylamine", 2),
    ("CCNCC", "diethylamine", 2),
    ("CN(C)C", "trimethylamine", 3),
    ("CCN(CC)CC", "triethylamine", 3),
]
_AMINE_OPTIONS = ["primary (1)", "secondary (2)", "tertiary (3)"]


def _n_carbon_neighbors(smiles: str) -> int | None:
    from rdkit import Chem, RDLogger

    RDLogger.DisableLog("rdApp.*")
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return None
    for atom in mol.GetAtoms():
        if atom.GetSymbol() == "N":
            return sum(1 for nb in atom.GetNeighbors() if nb.GetSymbol() == "C")
    return None


def _gen_amine(seed: int) -> Variant:
    smiles, name, cls = _pick(_AMINE_FIX, seed)
    correct = cls - 1
    options = [
        (text, None if i == correct else "AMINE-CLASS-BY-SIZE")
        for i, text in enumerate(_AMINE_OPTIONS)
    ]
    return Variant(
        template_id="org2.amine.class.v1",
        seed=seed,
        prompt=(
            f"Is {name} (SMILES {smiles}) a primary, secondary, or tertiary "
            "amine? Count the carbon groups bonded to nitrogen."
        ),
        key=str(correct),
        node="ORG2.AMINEPROPS",
        grader="mc",
        meta={"choices": _mc_choices(options, correct), "correct_index": correct, "smiles": smiles},
    )


def _ver_amine(v: Variant) -> VerifierResult:
    cN = _n_carbon_neighbors(str(v.meta.get("smiles", "")))
    if cN is None or not 1 <= cN <= 3:
        return VerifierResult(False, "amine-n-degree", f"nitrogen has {cN} carbon neighbors")
    if v.meta.get("correct_index") != cN - 1:
        return VerifierResult(False, "amine-n-degree", "key disagrees with N substitution")
    return VerifierResult(True, "amine-n-degree", f"{cN} carbon(s) on nitrogen")


# ---------------------------------------------------------------------------
# org2.aminoacid.config.v1  (ORG2.AMINOACIDS - L-amino acid R or S)
# ---------------------------------------------------------------------------
# The descriptor is derived by RDKit, never assumed. L-cysteine is R, not S,
# because its sulfur side chain outranks the carboxyl. That inversion is the
# whole teaching point, so it must come from the structure.

_AA_FIX = [
    ("N[C@@H](C)C(=O)O", "L-alanine"),
    ("N[C@@H](CO)C(=O)O", "L-serine"),
    ("N[C@@H](CS)C(=O)O", "L-cysteine"),
    ("N[C@@H](CC(C)C)C(=O)O", "L-leucine"),
    ("N[C@@H](Cc1ccccc1)C(=O)O", "L-phenylalanine"),
]
_AA_OPTIONS = ["R", "S"]


def _gen_aa(seed: int) -> Variant:
    smiles, name = _pick(_AA_FIX, seed)
    centres = stereocentres(smiles) or []
    desc = centres[0].descriptor if centres else ""
    correct = 0 if desc == "R" else 1
    options = [
        (text, None if i == correct else "AA-L-IS-ALWAYS-S")
        for i, text in enumerate(_AA_OPTIONS)
    ]
    return Variant(
        template_id="org2.aminoacid.config.v1",
        seed=seed,
        prompt=(
            f"{name} is drawn as the SMILES {smiles}. What is the CIP "
            "configuration at its alpha carbon, R or S? Rank the four groups "
            "on that carbon."
        ),
        key=str(correct),
        node="ORG2.AMINOACIDS",
        grader="mc",
        meta={"choices": _mc_choices(options, correct), "correct_index": correct, "smiles": smiles, "descriptor": desc},
    )


def _ver_aa(v: Variant) -> VerifierResult:
    centres = stereocentres(str(v.meta.get("smiles", ""))) or []
    if len(centres) != 1 or centres[0].descriptor not in ("R", "S"):
        return VerifierResult(False, "cip-derived", "not a single assigned stereocentre")
    derived = centres[0].descriptor
    keyed = v.meta["choices"][v.meta["correct_index"]]["text"]
    if keyed != derived:
        return VerifierResult(False, "cip-derived", f"structure is {derived}, key says {keyed}")
    return VerifierResult(True, "cip-derived", derived)


ORG2_TEMPLATES: dict[str, dict[str, object]] = {
    "org2.unsaturation.v1": {"gen": _gen_u, "ver": _ver_unsaturation_numeric, "node": "ORG2.CONJUGATION", "grader": "numeric"},
    "org2.aromatic.nmr.v1": {"gen": _gen_nmr, "ver": _ver_nmr_numeric, "node": "ORG2.AROMATICSPECTRA", "grader": "numeric"},
    "org2.oxidation.v1": {"gen": _gen_ox, "ver": _ver_ox, "node": "ORG2.OXIDATION", "grader": "mc"},
    "org2.tautomer.v1": {"gen": _gen_taut, "ver": _ver_taut, "node": "ORG2.TAUTOMERISM", "grader": "mc"},
    "org2.amine.class.v1": {"gen": _gen_amine, "ver": _ver_amine, "node": "ORG2.AMINEPROPS", "grader": "mc"},
    "org2.aminoacid.config.v1": {"gen": _gen_aa, "ver": _ver_aa, "node": "ORG2.AMINOACIDS", "grader": "mc"},
}

ORG2_HINTS: dict[str, tuple[str, str, str]] = {
    "org2.unsaturation.v1": (
        "Degrees of unsaturation counts rings plus pi bonds. A benzene ring, "
        "for example, is one ring and three pi bonds.",
        "Compare the formula against the saturated alkane with the same number "
        "of carbons, CnH2n+2. Each pair of missing hydrogens is one degree. A "
        "nitrogen adds one to the count you compare against.",
        "Write the saturated-alkane hydrogen count for this many carbons first, "
        "then subtract.",
    ),
    "org2.aromatic.nmr.v1": (
        "Each set of symmetry-equivalent hydrogens gives one signal. A more "
        "symmetric substitution pattern gives fewer signals.",
        "Look for mirror planes and rotation axes, and group the hydrogens they "
        "interchange. Para substitution is more symmetric than meta.",
        "Count the total hydrogens first, then partition them into equivalent "
        "sets; the sets must add back to that total.",
    ),
    "org2.oxidation.v1": (
        "The product depends on how many hydrogens sit on the carbon that "
        "carries the hydroxyl group.",
        "A carbon with two hydrogens on it (primary) can lose them in two "
        "steps; one hydrogen (secondary) can lose one; no hydrogen (tertiary) "
        "has nothing to remove without breaking the skeleton.",
        "Find the carbon bonded to the OH and count the hydrogens on it before "
        "choosing.",
    ),
    "org2.tautomer.v1": (
        "Keto and enol are two arrangements of the same atoms. One has a "
        "carbonyl, the other a carbon-carbon double bond next to a hydroxyl.",
        "The keto form carries a C=O and no O-H on that oxygen. The enol form "
        "carries C=C-O-H.",
        "Look at each structure for a carbonyl group; the one that has it is "
        "the keto form.",
    ),
    "org2.amine.class.v1": (
        "The class of an amine is set by how many carbon groups are attached to "
        "the nitrogen, not by the size of the molecule.",
        "One carbon on nitrogen is primary, two is secondary, three is "
        "tertiary. Hydrogens on nitrogen do not count.",
        "Find the nitrogen and count only the carbons directly bonded to it.",
    ),
    "org2.aminoacid.config.v1": (
        "Assign R or S by ranking the four groups on the alpha carbon and "
        "reading the rotation with the lowest priority pointing away.",
        "The four groups are the amino group, the carboxyl, the side chain, and "
        "a hydrogen. Nitrogen outranks carbon, so the amino group is usually "
        "first, but a side chain with a heavier first atom can outrank the "
        "carboxyl and change the answer.",
        "Rank the amino nitrogen against the side chain's first atom before "
        "assuming the usual order; a sulfur or oxygen in the side chain "
        "reorders the priorities.",
    ),
}

ORG2_MISCONCEPTIONS_SPEC = {
    "OXIDATION-PRIMARY-TO-KETONE": (
        "A primary alcohol oxidizes to a ketone",
        "The learner does not distinguish primary from secondary and expects a "
        "ketone from a primary alcohol, which cannot form because the carbon "
        "has no second carbon substituent.",
        "Ethanol oxidizes to ethanal and then ethanoic acid, never to a ketone, "
        "because its hydroxyl carbon carries two hydrogens and only one carbon.",
        "ORG2.OXIDATION",
    ),
    "OXIDATION-SECONDARY-TO-ALDEHYDE": (
        "A secondary alcohol oxidizes to an aldehyde or acid",
        "The learner expects an aldehyde from a secondary alcohol, but its "
        "hydroxyl carbon has only one hydrogen and two carbons, so it can only "
        "become a ketone.",
        "Propan-2-ol oxidizes to propanone, a ketone, and cannot go further to "
        "an acid because there is no second hydrogen to remove.",
        "ORG2.OXIDATION",
    ),
    "OXIDATION-TERTIARY-REACTS": (
        "A tertiary alcohol oxidizes like the others",
        "The learner applies oxidation to a tertiary alcohol, whose hydroxyl "
        "carbon has no hydrogen to remove, so ordinary oxidation does nothing.",
        "2-methylpropan-2-ol does not oxidize under standard conditions because "
        "its hydroxyl carbon bears three carbons and no hydrogen.",
        "ORG2.OXIDATION",
    ),
    "TAUTOMER-KETO-ENOL-CONFUSED": (
        "The enol is the keto form",
        "The learner reverses keto and enol, naming the C=C-O-H structure as "
        "the keto form when the keto form is the one with the carbonyl.",
        "For propanone and prop-1-en-2-ol, the keto form is propanone, the one "
        "carrying the C=O; the enol is the hydroxyl-on-a-double-bond structure.",
        "ORG2.TAUTOMERISM",
    ),
    "AMINE-CLASS-BY-SIZE": (
        "Amine class is set by molecular size",
        "The learner judges primary, secondary or tertiary by how large the "
        "amine is rather than by the number of carbons on the nitrogen.",
        "Triethylamine is larger than methylamine but is tertiary because its "
        "nitrogen carries three carbons; methylamine is primary with one.",
        "ORG2.AMINEPROPS",
    ),
    "AA-L-IS-ALWAYS-S": (
        "Every L-amino acid is S",
        "The learner assumes the L configuration always corresponds to S, but "
        "the CIP letter depends on side-chain priority and inverts when the "
        "side chain outranks the carboxyl.",
        "L-cysteine is R, not S, because its CH2SH side chain has sulfur at the "
        "first branching atom and outranks the carboxyl carbon, flipping the "
        "descriptor while the L hand is unchanged.",
        "ORG2.AMINOACIDS",
    ),
}


def _build_misconceptions():
    from .misconceptions import Misconception

    out = {}
    for code, (name, description, counterexample, routes_to) in ORG2_MISCONCEPTIONS_SPEC.items():
        out[code] = Misconception(
            code=code,
            name=name,
            description=description,
            counterexample=counterexample,
            routes_to=routes_to,
            source="Instructor observation; not traced to a published study",
            review="pending",
        )
    return out


ORG2_MISCONCEPTIONS = _build_misconceptions()
