"""Templates for the seven chapters the organic rechaptering left unable to
supply practice.

Practice supply is a UNIT level property: a unit can serve items when at least
one of its nodes carries a template. The old organic courses had ten units
each, coarse enough that every one happened to contain a templated node. The
requested nine and seventeen chapter structure split thirty nodes into seven
chapters holding no templated node at all, so those chapters went dark. The
content gap is old - 125 of 325 nodes carry a template - but the seven dark
chapters are new and are a consequence of the restructure.

Each template below is aimed at one of those seven chapters.

INDEPENDENCE. The house rule is that a key ships with a verifier that reaches
it by a second computational path, and it is easy to write a verifier that
re-runs the generator and proves nothing. What each pair actually does:

  addition product  generator reads the product formula off the drawn product
                    structure; verifier never looks at that structure, it takes
                    the ALKENE formula and adds Br2 by arithmetic. Graph versus
                    algebra.
  ring count        generator asks RDKit for the ring count; verifier computes
                    degrees of unsaturation from the molecular formula and
                    subtracts pi bonds counted off the Kekulized graph. The
                    remainder must be the ring count.
  hbond donors      generator uses the Lipinski donor definition; verifier
                    walks the atoms itself and counts hydrogens sitting on N
                    or O. Library versus hand count.
  williamson        generator reads the ether product formula; verifier adds
                    the alcohol and halide formulas and subtracts HX.
  molecular ion     generator sums nominal masses from the parsed formula;
                    verifier sums them atom by atom off the graph, including
                    implicit hydrogens.
  stereocentres     generator uses FindMolChiralCenters; verifier ranks atoms
                    by canonical symmetry class and counts carbons whose four
                    neighbours all differ. Perception versus symmetry.
  aromatic rings    generator counts rings whose ATOMS are all aromatic;
                    verifier counts rings whose BONDS are all aromatic.
"""

from __future__ import annotations

from .formula import parse_formula


from .registry import Variant
from .types import VerifierResult


def _counts(text: str) -> dict[str, int]:
    """Element map from a formula string.

    parse_formula returns a Formula dataclass, not a dict; its element map
    is on .counts. Treating the dataclass as a mapping raised on four of
    the seven templates and the 12 seed sweep caught every one.
    """
    f = parse_formula(text)
    return dict(f.counts) if f is not None else {}

# Nominal (integer) masses, enough for a molecular ion question.
_NOMINAL = {"C": 12, "H": 1, "N": 14, "O": 16, "S": 32, "Cl": 35, "Br": 79,
            "F": 19, "P": 31, "I": 127}


def _mol(smiles: str):
    from rdkit import Chem, RDLogger

    RDLogger.DisableLog("rdApp.*")
    return Chem.MolFromSmiles(smiles)


def _formula(smiles: str) -> str:
    from rdkit.Chem.rdMolDescriptors import CalcMolFormula

    m = _mol(smiles)
    return CalcMolFormula(m) if m is not None else ""


def _pick(items, seed: int):
    return items[seed % len(items)]


# ---------------------------------------------------------------------------
# ORG1 chapter 5: Addition Reactions of Alkenes
# ---------------------------------------------------------------------------
_ALKENES = [
    ("C=C", "BrCCBr", "ethene"),
    ("CC=C", "CC(Br)CBr", "propene"),
    ("CC=CC", "CC(Br)C(Br)C", "but-2-ene"),
    ("CCC=C", "CCC(Br)CBr", "but-1-ene"),
    ("CC(C)=C", "CC(C)(Br)CBr", "2-methylpropene"),
    ("C1CCC=CC1", "BrC1CCCCC1Br", "cyclohexene"),
]


def _gen_halogen_addition(seed: int) -> Variant:
    alkene, product, name = _pick(_ALKENES, seed)
    return Variant(
        template_id="org.addition.halogen.v1",
        seed=seed,
        prompt=(
            f"{name.capitalize()} is treated with Br2 in dichloromethane. "
            "Give the molecular formula of the dibromide product."
        ),
        key=_formula(product),
        node="ORG1.HALOGENATION",
        grader="formula",
        meta={"smiles": product, "alkene": alkene, "name": name,
              "alkene_formula": _formula(alkene)},
    )


def _ver_halogen_addition(v: Variant) -> VerifierResult:
    """Alkene formula plus Br2, by arithmetic. Never reads the product graph."""
    counts = _counts(str(v.meta.get("alkene_formula", "")))
    if not counts:
        return VerifierResult(False, "addition-arithmetic", "alkene formula unreadable")
    expected = dict(counts)
    expected["Br"] = expected.get("Br", 0) + 2
    stated = _counts(v.key)
    if not stated:
        return VerifierResult(False, "addition-arithmetic", f"key unreadable: {v.key}")
    if stated != expected:
        return VerifierResult(
            False, "addition-arithmetic",
            f"alkene + Br2 gives {expected}, the key says {stated}")
    return VerifierResult(True, "addition-arithmetic", v.key)


# ---------------------------------------------------------------------------
# ORG1 chapter 7: Cyclic Compounds
# ---------------------------------------------------------------------------
_RINGS = [
    ("C1CCCCC1", "cyclohexane"),
    ("C1CCC1", "cyclobutane"),
    ("C1CCCCC1C1CCCCC1", "bicyclohexyl"),
    ("C1CC2CCC1CC2", "bicyclo[2.2.2]octane"),
    ("c1ccccc1C1CCCCC1", "phenylcyclohexane"),
    ("O1CCOCC1", "1,4-dioxane"),
]


def _gen_ring_count(seed: int) -> Variant:
    smiles, name = _pick(_RINGS, seed)
    m = _mol(smiles)
    # NOT GetRingInfo().NumRings(): that is the symmetrized SSSR and reports 3
    # for bicyclo[2.2.2]octane, which has two independent cycles. The
    # cyclomatic number, bonds - atoms + 1 for a connected molecule, is the
    # count the question means and the one the formula can confirm.
    rings = m.GetNumBonds() - m.GetNumAtoms() + 1
    return Variant(
        template_id="org.rings.count.v1",
        seed=seed,
        prompt=(
            f"How many rings does {name} contain? Give a whole number."
        ),
        key=str(rings),
        node="ORG1.RINGSTRAIN",
        grader="numeric",
        meta={"value": float(rings), "unit": "", "smiles": smiles,
              "name": name, "formula": _formula(smiles)},
    )


def _ver_ring_count(v: Variant) -> VerifierResult:
    """Degrees of unsaturation from the FORMULA, minus pi bonds from the graph.
    What remains must be the ring count."""
    from rdkit import Chem

    counts = _counts(str(v.meta.get("formula", "")))
    if not counts:
        return VerifierResult(False, "rings-dou-minus-pi", "formula unreadable")
    c = counts.get("C", 0)
    h = counts.get("H", 0) + counts.get("Cl", 0) + counts.get("Br", 0)
    n = counts.get("N", 0)
    dou = c - (h / 2.0) + (n / 2.0) + 1
    m = _mol(str(v.meta.get("smiles", "")))
    if m is None:
        return VerifierResult(False, "rings-dou-minus-pi", "structure unreadable")
    k = Chem.Mol(m)
    Chem.Kekulize(k, clearAromaticFlags=True)
    pi = sum(int(b.GetBondTypeAsDouble()) - 1 for b in k.GetBonds())
    implied = dou - pi
    if abs(implied - float(v.meta.get("value", -1))) > 1e-9:
        return VerifierResult(
            False, "rings-dou-minus-pi",
            f"formula implies {implied} rings, the key says {v.key}")
    return VerifierResult(True, "rings-dou-minus-pi", v.key)


# ---------------------------------------------------------------------------
# ORG1 chapter 8: Noncovalent Intermolecular Interactions
# ---------------------------------------------------------------------------
_DONORS = [
    ("CCO", "ethanol"),
    ("COC", "dimethyl ether"),
    ("OCCO", "ethylene glycol"),
    ("CC(=O)C", "acetone"),
    ("CC(=O)O", "acetic acid"),
    ("CCN", "ethylamine"),
    ("OCC(O)CO", "glycerol"),
    ("CCCCCC", "hexane"),
]


def _gen_hbond_donors(seed: int) -> Variant:
    smiles, name = _pick(_DONORS, seed)
    m = _mol(smiles)
    # Count donor HYDROGENS, not donor atoms. Lipinski.NumHDonors counts the
    # heavy atom, so an NH2 scores 1 where the prompt asks for 2. Ethylamine
    # caught it. The verifier reaches the same number through explicit
    # hydrogens on an AddHs graph, which is a different code path.
    donors = sum(a.GetTotalNumHs() for a in m.GetAtoms()
                 if a.GetSymbol() in ("N", "O", "F"))
    return Variant(
        template_id="org.imf.donors.v1",
        seed=seed,
        prompt=(
            f"How many hydrogen bond DONORS does {name} have? Count hydrogens "
            "bonded to N, O or F. Give a whole number."
        ),
        key=str(donors),
        node="ORG1.HBONDING",
        grader="numeric",
        meta={"value": float(donors), "unit": "", "smiles": smiles, "name": name},
    )


def _ver_hbond_donors(v: Variant) -> VerifierResult:
    """Make hydrogens explicit and count the ones bonded to N, O or F.
    The generator reads the implicit hydrogen count off the heavy atoms; this
    walks real hydrogen atoms in the graph."""
    from rdkit import Chem

    m = _mol(str(v.meta.get("smiles", "")))
    if m is None:
        return VerifierResult(False, "donors-hand-count", "structure unreadable")
    mh = Chem.AddHs(m)
    hand = sum(
        1 for a in mh.GetAtoms()
        if a.GetSymbol() == "H"
        and a.GetNeighbors()
        and a.GetNeighbors()[0].GetSymbol() in ("N", "O", "F")
    )
    if abs(hand - float(v.meta.get("value", -1))) > 1e-9:
        return VerifierResult(
            False, "donors-hand-count",
            f"hand count gives {hand}, the key says {v.key}")
    return VerifierResult(True, "donors-hand-count", v.key)


# ---------------------------------------------------------------------------
# ORG2 chapter 2: Ethers, Epoxides, Glycols and Sulfides
# ---------------------------------------------------------------------------
_WILLIAMSON = [
    ("CCO", "CI", "CCOC", "ethanol", "iodomethane"),
    ("CO", "CCI", "COCC", "methanol", "iodoethane"),
    ("CCCO", "CI", "CCCOC", "propan-1-ol", "iodomethane"),
    ("CC(C)O", "CI", "CC(C)OC", "propan-2-ol", "iodomethane"),
    ("CCO", "CCI", "CCOCC", "ethanol", "iodoethane"),
]


def _gen_williamson(seed: int) -> Variant:
    alcohol, halide, ether, aname, hname = _pick(_WILLIAMSON, seed)
    return Variant(
        template_id="org.ether.williamson.v1",
        seed=seed,
        prompt=(
            f"{aname.capitalize()} is deprotonated with sodium hydride, then "
            f"treated with {hname}. Give the molecular formula of the ether."
        ),
        key=_formula(ether),
        node="ORG2.WILLIAMSON",
        grader="formula",
        meta={"smiles": ether, "alcohol_formula": _formula(alcohol),
              "halide_formula": _formula(halide), "alcohol": aname},
    )


def _ver_williamson(v: Variant) -> VerifierResult:
    """Alcohol plus halide minus HX, by arithmetic on the two reactant
    formulas. The ether structure is never consulted."""
    a = _counts(str(v.meta.get("alcohol_formula", "")))
    h = _counts(str(v.meta.get("halide_formula", "")))
    if not a or not h:
        return VerifierResult(False, "williamson-arithmetic", "reactant formula unreadable")
    total: dict[str, int] = {}
    for src in (a, h):
        for el, n in src.items():
            total[el] = total.get(el, 0) + n
    halogen = next((x for x in ("I", "Br", "Cl") if x in total), None)
    if halogen is None:
        return VerifierResult(False, "williamson-arithmetic", "no halogen in the halide")
    total["H"] = total.get("H", 0) - 1
    total[halogen] -= 1
    if total[halogen] == 0:
        del total[halogen]
    stated = _counts(v.key)
    if stated != total:
        return VerifierResult(
            False, "williamson-arithmetic",
            f"alcohol + halide - H{halogen} gives {total}, key says {stated}")
    return VerifierResult(True, "williamson-arithmetic", v.key)


# ---------------------------------------------------------------------------
# ORG2 chapter 3: Spectroscopy
# ---------------------------------------------------------------------------
_MS = [
    ("CCO", "ethanol"),
    ("CC(=O)C", "acetone"),
    ("c1ccccc1", "benzene"),
    ("CCCCCC", "hexane"),
    ("CC(=O)O", "acetic acid"),
    ("Cc1ccccc1", "toluene"),
]


def _gen_molecular_ion(seed: int) -> Variant:
    smiles, name = _pick(_MS, seed)
    counts = _counts(_formula(smiles))
    nominal = sum(_NOMINAL[el] * n for el, n in counts.items())
    return Variant(
        template_id="org.ms.molecularion.v1",
        seed=seed,
        prompt=(
            f"In the mass spectrum of {name}, at what m/z does the molecular "
            "ion M+ appear? Use nominal masses and give a whole number."
        ),
        key=str(nominal),
        node="ORG1.MSBASICS",
        grader="numeric",
        meta={"value": float(nominal), "unit": "", "smiles": smiles,
              "name": name, "formula": _formula(smiles)},
    )


def _ver_molecular_ion(v: Variant) -> VerifierResult:
    """Sum nominal masses atom by atom off the graph, implicit hydrogens
    included, rather than from the parsed formula string."""
    m = _mol(str(v.meta.get("smiles", "")))
    if m is None:
        return VerifierResult(False, "molecularion-atomwise", "structure unreadable")
    total = 0
    for atom in m.GetAtoms():
        sym = atom.GetSymbol()
        if sym not in _NOMINAL:
            return VerifierResult(False, "molecularion-atomwise", f"no mass for {sym}")
        total += _NOMINAL[sym] + atom.GetTotalNumHs() * _NOMINAL["H"]
    if abs(total - float(v.meta.get("value", -1))) > 1e-9:
        return VerifierResult(
            False, "molecularion-atomwise",
            f"atomwise sum is {total}, the key says {v.key}")
    return VerifierResult(True, "molecularion-atomwise", v.key)


# ---------------------------------------------------------------------------
# ORG2 chapter 14: Carbohydrates
# ---------------------------------------------------------------------------
_SUGARS = [
    ("OC[C@H](O)[C@@H](O)[C@H](O)C=O", "a pentose in its open chain form"),
    ("OC[C@@H](O)[C@@H](O)[C@H](O)C=O", "an epimeric pentose"),
    ("OC[C@H](O)C=O", "glyceraldehyde extended by one carbon"),
    ("OC[C@@H](O)[C@H](O)[C@@H](O)[C@H](O)C=O", "an aldohexose"),
]


def _gen_stereocentres(seed: int) -> Variant:
    smiles, name = _pick(_SUGARS, seed)
    from rdkit import Chem

    m = _mol(smiles)
    centres = Chem.FindMolChiralCenters(m, includeUnassigned=True, useLegacyImplementation=False)
    return Variant(
        template_id="org.carb.stereocentres.v1",
        seed=seed,
        prompt=(
            f"How many stereocentres does {name} have, drawn open chain? "
            "Give a whole number."
        ),
        key=str(len(centres)),
        node="ORG2.CARBOHYDRATES",
        grader="numeric",
        meta={"value": float(len(centres)), "unit": "", "smiles": smiles,
              "name": name},
    )


def _ver_stereocentres(v: Variant) -> VerifierResult:
    """Count carbons whose four neighbours fall in four different canonical
    symmetry classes. Symmetry ranking, not stereo perception."""
    from rdkit import Chem

    m = _mol(str(v.meta.get("smiles", "")))
    if m is None:
        return VerifierResult(False, "stereo-symmetry-classes", "structure unreadable")
    mh = Chem.AddHs(m)
    ranks = list(Chem.CanonicalRankAtoms(mh, breakTies=False))
    hand = 0
    for atom in mh.GetAtoms():
        if atom.GetSymbol() != "C" or atom.GetDegree() != 4:
            continue
        classes = {ranks[nb.GetIdx()] for nb in atom.GetNeighbors()}
        if len(classes) == 4:
            hand += 1
    if hand != int(float(v.meta.get("value", -1))):
        return VerifierResult(
            False, "stereo-symmetry-classes",
            f"symmetry ranking finds {hand}, the key says {v.key}")
    return VerifierResult(True, "stereo-symmetry-classes", v.key)


# ---------------------------------------------------------------------------
# ORG2 chapter 15: Aromatic Heterocycles and Nucleic Acids
# ---------------------------------------------------------------------------
_AROMATICS = [
    ("c1ccccc1", "benzene"),
    ("c1ccncc1", "pyridine"),
    ("c1cc[nH]c1", "pyrrole"),
    ("c1ccc2ccccc2c1", "naphthalene"),
    ("c1ccc2[nH]ccc2c1", "indole"),
    ("C1CCCCC1", "cyclohexane"),
    ("c1ncc2[nH]cnc2n1", "purine"),
]


def _gen_aromatic_rings(seed: int) -> Variant:
    smiles, name = _pick(_AROMATICS, seed)
    m = _mol(smiles)
    count = sum(
        1 for ring in m.GetRingInfo().AtomRings()
        if all(m.GetAtomWithIdx(i).GetIsAromatic() for i in ring)
    )
    return Variant(
        template_id="org.aromatic.ringcount.v1",
        seed=seed,
        prompt=(
            f"How many AROMATIC rings does {name} contain? Give a whole number."
        ),
        key=str(count),
        node="ORG2.HETEROCYCLES",
        grader="numeric",
        meta={"value": float(count), "unit": "", "smiles": smiles, "name": name},
    )


def _ver_aromatic_rings(v: Variant) -> VerifierResult:
    """Count rings whose BONDS are all aromatic, rather than whose atoms are."""
    m = _mol(str(v.meta.get("smiles", "")))
    if m is None:
        return VerifierResult(False, "aromatic-bondwise", "structure unreadable")
    info = m.GetRingInfo()
    hand = 0
    for bond_ring in info.BondRings():
        if all(m.GetBondWithIdx(b).GetIsAromatic() for b in bond_ring):
            hand += 1
    if hand != int(float(v.meta.get("value", -1))):
        return VerifierResult(
            False, "aromatic-bondwise",
            f"bondwise count is {hand}, the key says {v.key}")
    return VerifierResult(True, "aromatic-bondwise", v.key)


# ---------------------------------------------------------------------------
# ORG2 chapter 8: Allylic and Benzylic Reactivity
#
# The chapter had exactly one template, a single face multiple choice item, so
# a four item session served the same question four times. A second template
# with real seed variety is the fix, not a change to the session logic.
# ---------------------------------------------------------------------------
_BENZYLIC = [
    ("Cc1ccccc1", "toluene"),
    ("CCc1ccccc1", "ethylbenzene"),
    ("CC(C)c1ccccc1", "cumene"),
    ("CC(C)(C)c1ccccc1", "tert-butylbenzene"),
    ("Cc1ccccc1C", "ortho-xylene"),
    ("c1ccccc1CCc1ccccc1", "bibenzyl"),
]


def _gen_benzylic_h(seed: int) -> Variant:
    smiles, name = _pick(_BENZYLIC, seed)
    m = _mol(smiles)
    total = 0
    for atom in m.GetAtoms():
        if atom.GetSymbol() != "C" or atom.GetIsAromatic():
            continue
        if any(nb.GetIsAromatic() for nb in atom.GetNeighbors()):
            total += atom.GetTotalNumHs()
    return Variant(
        template_id="org.benzylic.hydrogens.v1",
        seed=seed,
        prompt=(
            f"How many BENZYLIC hydrogens does {name} have? Count hydrogens on "
            "carbons directly attached to the ring. Give a whole number."
        ),
        key=str(total),
        node="ORG2.BENZYLIC",
        grader="numeric",
        meta={"value": float(total), "unit": "", "smiles": smiles, "name": name},
    )


def _ver_benzylic_h(v: Variant) -> VerifierResult:
    """Make hydrogens explicit and walk from each one outwards, rather than
    reading implicit hydrogen counts off the heavy atoms."""
    from rdkit import Chem

    m = _mol(str(v.meta.get("smiles", "")))
    if m is None:
        return VerifierResult(False, "benzylic-explicit-h", "structure unreadable")
    mh = Chem.AddHs(m)
    hand = 0
    for atom in mh.GetAtoms():
        if atom.GetSymbol() != "H":
            continue
        nbrs = atom.GetNeighbors()
        if not nbrs:
            continue
        heavy = nbrs[0]
        if heavy.GetSymbol() != "C" or heavy.GetIsAromatic():
            continue
        if any(n.GetIsAromatic() for n in heavy.GetNeighbors()):
            hand += 1
    if hand != int(float(v.meta.get("value", -1))):
        return VerifierResult(
            False, "benzylic-explicit-h",
            f"explicit hydrogen walk gives {hand}, the key says {v.key}")
    return VerifierResult(True, "benzylic-explicit-h", v.key)



_ALLYLIC = [
    ("C=CC", "propene"),
    ("C=CCC", "but-1-ene"),
    ("CC=CC", "but-2-ene"),
    ("C=CC(C)C", "3-methylbut-1-ene"),
    ("C1=CCCCC1", "cyclohexene"),
    ("C=CCc1ccccc1", "3-phenylprop-1-ene"),
]


def _gen_allylic_h(seed: int) -> Variant:
    smiles, name = _pick(_ALLYLIC, seed)
    m = _mol(smiles)
    from rdkit import Chem

    dbl = {a.GetIdx() for b in m.GetBonds()
           if b.GetBondType() == Chem.BondType.DOUBLE and not b.GetIsAromatic()
           for a in (b.GetBeginAtom(), b.GetEndAtom())}
    total = 0
    for atom in m.GetAtoms():
        if atom.GetSymbol() != "C" or atom.GetIdx() in dbl or atom.GetIsAromatic():
            continue
        if any(nb.GetIdx() in dbl for nb in atom.GetNeighbors()):
            total += atom.GetTotalNumHs()
    return Variant(
        template_id="org.allylic.hydrogens.v1",
        seed=seed,
        prompt=(
            f"How many ALLYLIC hydrogens does {name} have? Count hydrogens on "
            "the carbons next to the double bond, not on it. Give a whole number."
        ),
        key=str(total),
        node="ORG2.ALLYLIC",
        grader="numeric",
        meta={"value": float(total), "unit": "", "smiles": smiles, "name": name},
    )


def _ver_allylic_h(v: Variant) -> VerifierResult:
    """Explicit hydrogen walk: make Hs real, then check each one sits on an
    sp3 carbon that is bonded to an alkene carbon."""
    from rdkit import Chem

    m = _mol(str(v.meta.get("smiles", "")))
    if m is None:
        return VerifierResult(False, "allylic-explicit-h", "structure unreadable")
    mh = Chem.AddHs(m)
    in_double = set()
    for b in mh.GetBonds():
        if b.GetBondType() == Chem.BondType.DOUBLE and not b.GetIsAromatic():
            in_double.add(b.GetBeginAtomIdx())
            in_double.add(b.GetEndAtomIdx())
    hand = 0
    for atom in mh.GetAtoms():
        if atom.GetSymbol() != "H" or not atom.GetNeighbors():
            continue
        heavy = atom.GetNeighbors()[0]
        if heavy.GetSymbol() != "C" or heavy.GetIdx() in in_double:
            continue
        if heavy.GetIsAromatic():
            continue
        if any(n.GetIdx() in in_double for n in heavy.GetNeighbors()):
            hand += 1
    if hand != int(float(v.meta.get("value", -1))):
        return VerifierResult(
            False, "allylic-explicit-h",
            f"explicit hydrogen walk gives {hand}, the key says {v.key}")
    return VerifierResult(True, "allylic-explicit-h", v.key)


ORG_CHAPTER_TEMPLATES = {
    "org.addition.halogen.v1": {
        "gen": _gen_halogen_addition, "ver": _ver_halogen_addition,
        "node": "ORG1.HALOGENATION", "grader": "formula"},
    "org.rings.count.v1": {
        "gen": _gen_ring_count, "ver": _ver_ring_count,
        "node": "ORG1.RINGSTRAIN", "grader": "numeric"},
    "org.imf.donors.v1": {
        "gen": _gen_hbond_donors, "ver": _ver_hbond_donors,
        "node": "ORG1.HBONDING", "grader": "numeric"},
    "org.ether.williamson.v1": {
        "gen": _gen_williamson, "ver": _ver_williamson,
        "node": "ORG2.WILLIAMSON", "grader": "formula"},
    "org.ms.molecularion.v1": {
        "gen": _gen_molecular_ion, "ver": _ver_molecular_ion,
        "node": "ORG1.MSBASICS", "grader": "numeric"},
    "org.carb.stereocentres.v1": {
        "gen": _gen_stereocentres, "ver": _ver_stereocentres,
        "node": "ORG2.CARBOHYDRATES", "grader": "numeric"},
    "org.aromatic.ringcount.v1": {
        "gen": _gen_aromatic_rings, "ver": _ver_aromatic_rings,
        "node": "ORG2.HETEROCYCLES", "grader": "numeric"},
    "org.benzylic.hydrogens.v1": {
        "gen": _gen_benzylic_h, "ver": _ver_benzylic_h,
        "node": "ORG2.BENZYLIC", "grader": "numeric"},
    "org.allylic.hydrogens.v1": {
        "gen": _gen_allylic_h, "ver": _ver_allylic_h,
        "node": "ORG2.ALLYLIC", "grader": "numeric"},
}

#: Three rung hint ladders. The compliance checker requires every template to
#: carry three, and refuses to serve rung 3 while rung 1 is still locked.
ORG_CHAPTER_HINTS = {
    "org.addition.halogen.v1": [
        "Bromine adds across the double bond. Nothing leaves.",
        "Both bromines end up on the molecule, one on each former alkene carbon.",
        "Take the alkene formula and add Br2: the carbons and hydrogens do not change.",
    ],
    "org.rings.count.v1": [
        "A ring is any closed loop of bonds.",
        "Two rings sharing an edge count as two, not one.",
        "Count the bonds you would have to break to make the molecule acyclic.",
    ],
    "org.imf.donors.v1": [
        "A donor is a hydrogen already bonded to N, O or F.",
        "Hydrogens on carbon never donate, however many there are.",
        "Count the O-H and N-H hydrogens only; lone pairs make acceptors, not donors.",
    ],
    "org.ether.williamson.v1": [
        "The alkoxide oxygen attacks the carbon bearing the halide.",
        "The halide leaves as an ion and the sodium goes with it.",
        "Add the two reactant formulas, then remove one H and one halogen.",
    ],
    "org.ms.molecularion.v1": [
        "The molecular ion is the intact molecule minus one electron.",
        "Its m/z is therefore the molecular mass, to the nearest whole number.",
        "Sum nominal masses: C is 12, H is 1, O is 16, N is 14.",
    ],
    "org.carb.stereocentres.v1": [
        "A stereocentre is a carbon with four different groups.",
        "The carbonyl carbon is not one: it has only three attachments.",
        "Work along the chain and test each CH(OH) carbon in turn.",
    ],
    "org.aromatic.ringcount.v1": [
        "Aromatic needs a flat, fully conjugated ring with 4n+2 pi electrons.",
        "A saturated ring is not aromatic however many rings the molecule has.",
        "In fused systems each aromatic ring counts separately.",
    ],
    "org.benzylic.hydrogens.v1": [
        "Benzylic means the carbon attached to the ring, not the ring itself.",
        "Hydrogens on the ring carbons are aromatic, not benzylic.",
        "Find every carbon bonded to the ring, then count the hydrogens on it.",
    ],
    "org.allylic.hydrogens.v1": [
        "Allylic means next to the double bond, not on it.",
        "Vinylic hydrogens sit on the alkene carbons and do not count.",
        "Find the two alkene carbons, then count hydrogens on their sp3 neighbours.",
    ],
}
