"""ORG1 units 8 and 9 practice templates, plus the emptiest general chemistry gaps.

Nine templates. Two for ORG1 unit 8 (radical halogenation, alkyl halide
structure), two for ORG1 unit 9 (substitution and elimination), and five that
fill general chemistry nodes that had no practice item at all: molality,
hybridization, osmotic pressure, first order half life, and the
Henderson-Hasselbalch buffer equation.

Every template ships a verifier that reaches the same answer by a genuinely
different route, which is the house rule. What "different route" means for each:

  monochlorination  generator groups the hydrogen bearing carbons into symmetry
                    classes with CanonicalRankAtoms; verifier builds every
                    monochloro product atom by atom, canonicalizes each, and
                    counts the distinct ones. One counts environments, the other
                    counts products, and they must agree.
  halide class      generator counts the carbons attached to the carbon that
                    bears the halogen; verifier reads the same degree off the
                    hydrogen count on that carbon (three minus the hydrogens).
  sn2 config        generator reads the product's CIP descriptor from RDKit;
                    verifier reconstructs the product independently by inverting
                    the substrate's chiral tag and swapping the leaving group for
                    the nucleophile, and requires the reconstruction to match by
                    canonical SMILES. The mirror image confirms the descriptor is
                    a real one. The letter does not always flip, and the key is
                    always read back, never assumed.
  zaitsev           the fixture states which alkene is intended; the verifier
                    derives each candidate's substitution degree from the
                    structure and refuses the item unless the keyed alkene is
                    strictly the most substituted.
  hybridization     generator reads RDKit's hybridization perception; verifier
                    counts the steric number (sigma groups plus lone pairs) and
                    maps it independently. Two perceptions of the same fact.
  molality, half    numeric templates invert their own relationship: recompute an
  life, osmotic,    input from the claimed output and require the original input
  henderson         back, so the arithmetic is checked backwards.

Section 18 applies. This brief covers radical halogenation and alkyl halides at
the level of ordinary teaching substrates only: the small alkanes and simple
alkyl halides a first course names. No preparative procedure, quantity, or
condition appears, and nothing here is notable as anything other than a
textbook example.

Prompt-given chemistry values carry a source in meta. The gas constant R is the
only physical constant introduced, and it is stated in the prompt and cited in
meta. Acid strengths come from a standard table, also cited. Everything else is
computed from values the prompt gives.
"""

from __future__ import annotations

import math

from ._fixtures import WEAK_ACIDS
from .formula import parse_formula
from .organic import stereocentres
from .pool import get_pool
from .registry import Variant, _pick
from .structure import canonical
from .types import VerifierResult

LN2 = math.log(2.0)
R_GAS = 0.08206  # L*atm/(mol*K)
R_SOURCE = "R = 0.08206 L*atm/(mol*K), standard general chemistry table value."
ACID_TABLE_SOURCE = (
    "Ka values from standard general chemistry acid dissociation tables (CRC "
    "Handbook of Chemistry and Physics); pKa computed as -log10(Ka). Review pending."
)
# A citation this system cannot derive from a structure, reused verbatim from
# the ORG1 unit 9 lessons where the same fact is taught.
ALKENE_STABILITY_SOURCE = (
    "Standard treatment; see any introductory organic text's chapter on alkene "
    "stability, for example Clayden, Organic Chemistry, 2nd ed."
)


def _rdkit():
    from rdkit import Chem, RDLogger

    RDLogger.DisableLog("rdApp.*")
    return Chem


def _flip_tags(smiles: str) -> str:
    """Invert every tetrahedral tag. With one stereocentre this inverts it."""
    return (
        smiles.replace("[C@@H]", "\x00")
        .replace("[C@H]", "[C@@H]")
        .replace("\x00", "[C@H]")
    )


def _mol_from_pool(seed: int, salt: int = 0):
    return _pick(get_pool(), seed, salt)


# ===========================================================================
# ORG1 unit 8
# ===========================================================================

# ---------------------------------------------------------------------------
# org.monochlorination.count.v1  (ORG1.RADICALHALOGEN)
# ---------------------------------------------------------------------------

# Ordinary teaching alkanes only. The interesting variable is symmetry: how many
# constitutionally distinct products a single chlorination can give.
_MONOCHLORO_FIXTURES = [
    ("C", "methane"),
    ("CC", "ethane"),
    ("CCC", "propane"),
    ("CCCC", "butane"),
    ("CC(C)C", "2-methylpropane"),
    ("CC(C)(C)C", "2,2-dimethylpropane"),
    ("CCCCC", "pentane"),
]


def _distinct_ch_environments(smiles: str) -> int | None:
    """Count carbons that bear a hydrogen and are distinct by symmetry.

    Two carbons in the same canonical rank are equivalent, so replacing a
    hydrogen on either gives the same product. The number of distinct
    hydrogen-bearing carbon environments is therefore the number of distinct
    monochlorination products.
    """
    Chem = _rdkit()
    base = Chem.MolFromSmiles(smiles)
    if base is None:
        return None
    mol = Chem.AddHs(base)
    try:
        ranks = list(Chem.CanonicalRankAtoms(mol, breakTies=False))
    except Exception:
        return None
    envs: set[int] = set()
    for atom in mol.GetAtoms():
        if atom.GetSymbol() != "C":
            continue
        if any(n.GetSymbol() == "H" for n in atom.GetNeighbors()):
            envs.add(ranks[atom.GetIdx()])
    return len(envs)


def _enumerate_monochloro(smiles: str) -> int | None:
    """Build every monochloro product and count the distinct ones.

    A genuinely different route from the environment count: it constructs each
    product molecule by turning one hydrogen into chlorine, canonicalizes it,
    and lets canonical SMILES equality do the deduplication.
    """
    Chem = _rdkit()
    base = Chem.MolFromSmiles(smiles)
    if base is None:
        return None
    mol = Chem.AddHs(base)
    products: set[str] = set()
    for atom in mol.GetAtoms():
        if atom.GetSymbol() != "H":
            continue
        editable = Chem.RWMol(mol)
        editable.GetAtomWithIdx(atom.GetIdx()).SetAtomicNum(17)
        candidate = editable.GetMol()
        try:
            Chem.SanitizeMol(candidate)
            products.add(Chem.MolToSmiles(Chem.RemoveHs(candidate)))
        except Exception:
            return None
    return len(products)


def _gen_monochlorination(seed: int) -> Variant:
    smiles, name = _pick(_MONOCHLORO_FIXTURES, seed)
    count = _distinct_ch_environments(smiles) or 0
    return Variant(
        template_id="org.monochlorination.count.v1",
        seed=seed,
        prompt=(
            f"Free radical chlorination of {name} replaces one hydrogen with a "
            "chlorine atom. Counting only constitutional isomers, how many "
            "distinct monochlorinated products can form? Give a whole number."
        ),
        key=str(count),
        node="ORG1.RADICALHALOGEN",
        grader="numeric",
        meta={
            "value": float(count),
            "unit": "",
            "sig_figs": None,
            "smiles": smiles,
            "name": name,
        },
    )


def _ver_monochlorination(v: Variant) -> VerifierResult:
    smiles = str(v.meta.get("smiles", ""))
    from_environments = _distinct_ch_environments(smiles)
    from_products = _enumerate_monochloro(smiles)
    if from_environments is None or from_products is None:
        return VerifierResult(False, "environments-vs-products", f"cannot read {smiles}")
    if from_environments != from_products:
        return VerifierResult(
            False,
            "environments-vs-products",
            f"{from_environments} environments but {from_products} distinct products",
        )
    if int(v.meta["value"]) != from_products:
        return VerifierResult(
            False,
            "environments-vs-products",
            f"key {v.meta['value']} is not {from_products}",
        )
    return VerifierResult(True, "environments-vs-products", str(from_products))


# ---------------------------------------------------------------------------
# org.halide.class.v1  (ORG1.HALIDENOMEN)
# ---------------------------------------------------------------------------

# Simple alkyl monohalides. The teaching point is classifying the carbon that
# bears the halogen, which the two derivations below settle without appeal to
# the name.
_HALIDE_FIXTURES = [
    ("CBr", "bromomethane", 0),
    ("CCCl", "chloroethane", 1),
    ("CCCCBr", "1-bromobutane", 1),
    ("CC(Cl)C", "2-chloropropane", 2),
    ("CC(Br)CC", "2-bromobutane", 2),
    ("CC(C)(C)Br", "2-bromo-2-methylpropane", 3),
    ("CCC(C)(C)Br", "2-bromo-2-methylbutane", 3),
    ("CCC(Br)CC", "3-bromopentane", 2),
]

_HALOGENS = {9, 17, 35, 53}
_DEGREE_LABELS = ["methyl", "primary", "secondary", "tertiary"]


def _halide_carbon(smiles: str):
    """Return (mol, carbon atom that bears the halogen) or (None, None)."""
    Chem = _rdkit()
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return None, None
    for atom in mol.GetAtoms():
        if atom.GetAtomicNum() in _HALOGENS:
            for nbr in atom.GetNeighbors():
                if nbr.GetSymbol() == "C":
                    return mol, nbr
    return mol, None


def _halide_degree_by_carbons(smiles: str) -> int | None:
    """Count the carbon atoms attached to the halogen-bearing carbon."""
    _mol, carbon = _halide_carbon(smiles)
    if carbon is None:
        return None
    return sum(1 for nbr in carbon.GetNeighbors() if nbr.GetSymbol() == "C")


def _halide_degree_by_hydrogens(smiles: str) -> int | None:
    """A saturated carbon bearing one halogen has three minus its degree in H."""
    _mol, carbon = _halide_carbon(smiles)
    if carbon is None:
        return None
    return 3 - carbon.GetTotalNumHs()


def _gen_halide_class(seed: int) -> Variant:
    smiles, name, degree = _pick(_HALIDE_FIXTURES, seed)
    derived = _halide_degree_by_carbons(smiles)
    correct_index = derived if derived is not None else degree
    choices = [
        {
            "index": i,
            "text": label,
            "misconception": None if i == correct_index else "HALIDE-CLASS-MISCOUNT",
        }
        for i, label in enumerate(_DEGREE_LABELS)
    ]
    return Variant(
        template_id="org.halide.class.v1",
        seed=seed,
        prompt=(
            f"The alkyl halide {name} is drawn as the SMILES {smiles}. Is the "
            "carbon bearing the halogen a methyl, primary, secondary, or "
            "tertiary carbon?"
        ),
        key=str(correct_index),
        node="ORG1.HALIDENOMEN",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": correct_index,
            "smiles": smiles,
            "name": name,
            "intended_degree": degree,
        },
    )


def _ver_halide_class(v: Variant) -> VerifierResult:
    smiles = str(v.meta.get("smiles", ""))
    by_carbons = _halide_degree_by_carbons(smiles)
    by_hydrogens = _halide_degree_by_hydrogens(smiles)
    if by_carbons is None or by_hydrogens is None:
        return VerifierResult(False, "carbons-vs-hydrogens", f"cannot read {smiles}")
    if by_carbons != by_hydrogens:
        return VerifierResult(
            False,
            "carbons-vs-hydrogens",
            f"carbon count gives {by_carbons}, hydrogen count gives {by_hydrogens}",
        )
    if by_carbons != v.meta.get("intended_degree"):
        return VerifierResult(
            False,
            "carbons-vs-hydrogens",
            f"structure gives {by_carbons}, fixture intended {v.meta.get('intended_degree')}",
        )
    if v.meta.get("correct_index") != by_carbons:
        return VerifierResult(False, "carbons-vs-hydrogens", "keyed choice is wrong")
    return VerifierResult(True, "carbons-vs-hydrogens", _DEGREE_LABELS[by_carbons])


# ===========================================================================
# ORG1 unit 9
# ===========================================================================

# ---------------------------------------------------------------------------
# org.sn2.config.v1  (ORG1.SN2)
# ---------------------------------------------------------------------------

# Each entry is (substrate, substrate name, product, leaving token,
# nucleophile token, nucleophile name, product name). The substrate name is
# constitution-level with no stereo-descriptor, because assigning descriptors
# is the work the item asks for; the specific enantiomer is carried by the
# SMILES. The product is the SN2 (inverted) product of the substrate, encoded
# so that inversion is the flip of the single chiral tag and substitution is
# the swap of the leaving token for the nucleophile token. The last two
# entries are the case the unit 9 lesson is built around: the geometry
# inverts and the CIP letter does not change.
_SN2_FIXTURES = [
    ("CC[C@H](C)Br", "2-bromobutane", "CC[C@@H](C)O", "Br", "O", "hydroxide", "butan-2-ol"),
    ("CC[C@@H](C)Br", "2-bromobutane", "CC[C@H](C)O", "Br", "O", "hydroxide", "butan-2-ol"),
    ("CC[C@H](C)Br", "2-bromobutane", "CC[C@@H](C)C#N", "Br", "C#N", "cyanide", "2-methylbutanenitrile"),
    ("CC[C@@H](C)Br", "2-bromobutane", "CC[C@H](C)C#N", "Br", "C#N", "cyanide", "2-methylbutanenitrile"),
    ("C[C@H](Br)C(=O)OCC", "ethyl 2-bromopropanoate", "C[C@@H](C#N)C(=O)OCC", "Br", "C#N", "cyanide", "ethyl 2-cyanopropanoate"),
    ("C[C@@H](Br)C(=O)OCC", "ethyl 2-bromopropanoate", "C[C@H](C#N)C(=O)OCC", "Br", "C#N", "cyanide", "ethyl 2-cyanopropanoate"),
]


def _gen_sn2_config(seed: int) -> Variant:
    substrate, substrate_name, product, leaving, nu, nu_name, product_name = _pick(
        _SN2_FIXTURES, seed
    )
    sub_centres = stereocentres(substrate) or []
    prod_centres = stereocentres(product) or []
    sub_desc = sub_centres[0].descriptor if sub_centres else ""
    prod_desc = prod_centres[0].descriptor if prod_centres else ""
    letter_flipped = sub_desc != prod_desc
    # The distractor is whichever letter the product is not. Which belief that
    # letter represents depends on whether the geometric inversion happened to
    # change the CIP label.
    distractor = "SN2-RETENTION" if letter_flipped else "SN2-LETTER-ALWAYS-FLIPS"
    correct_index = 0 if prod_desc == "R" else 1
    choices = [
        {
            "index": 0,
            "text": "R",
            "misconception": None if prod_desc == "R" else distractor,
        },
        {
            "index": 1,
            "text": "S",
            "misconception": None if prod_desc == "S" else distractor,
        },
    ]
    return Variant(
        template_id="org.sn2.config.v1",
        seed=seed,
        prompt=(
            f"The alkyl halide {substrate_name} (SMILES {substrate}) reacts "
            f"with {nu_name} by an SN2 mechanism, giving {product_name}. "
            "Assign the configuration at the stereocentre of the product: is "
            "it R or S?"
        ),
        key=str(correct_index),
        node="ORG1.SN2",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": correct_index,
            "substrate": substrate,
            "product": product,
            "leaving": leaving,
            "nu": nu,
            "substrate_descriptor": sub_desc,
            "product_descriptor": prod_desc,
        },
    )


def _ver_sn2_config(v: Variant) -> VerifierResult:
    """Reconstruct the product from the substrate, independent of the CIP read.

    Inverting the substrate's chiral tag and swapping the leaving group for the
    nucleophile is a string operation with nothing to do with RDKit's descriptor
    assignment. If the reconstruction does not match the stored product, the
    item claims a reaction outcome the structures do not support and is refused.
    """
    substrate = str(v.meta.get("substrate", ""))
    product = str(v.meta.get("product", ""))
    leaving = str(v.meta.get("leaving", ""))
    nu = str(v.meta.get("nu", ""))

    prod_centres = stereocentres(product) or []
    if len(prod_centres) != 1 or prod_centres[0].descriptor not in ("R", "S"):
        return VerifierResult(False, "inversion-reconstruction", "product has no single defined stereocentre")
    descriptor = prod_centres[0].descriptor

    rebuilt = _flip_tags(substrate).replace(leaving, nu, 1)
    rebuilt_canon = canonical(rebuilt)
    product_canon = canonical(product)
    if rebuilt_canon is None or product_canon is None:
        return VerifierResult(False, "inversion-reconstruction", "a structure could not be read")
    if rebuilt_canon != product_canon:
        return VerifierResult(
            False,
            "inversion-reconstruction",
            f"inverting the substrate gives {rebuilt_canon}, not the stored {product_canon}",
        )

    # The mirror image must carry the opposite descriptor, which confirms the
    # centre is genuine and its label well defined.
    mirror_centres = stereocentres(_flip_tags(product)) or []
    if len(mirror_centres) != 1 or mirror_centres[0].descriptor == descriptor:
        return VerifierResult(False, "inversion-reconstruction", "the descriptor is not well defined")

    choices = v.meta.get("choices", [])
    keyed = choices[v.meta.get("correct_index", -1)]["text"]
    if keyed != descriptor:
        return VerifierResult(
            False, "inversion-reconstruction", f"keyed {keyed} does not match derived {descriptor}"
        )
    return VerifierResult(True, "inversion-reconstruction", descriptor)


# ---------------------------------------------------------------------------
# org.zaitsev.major.v1  (ORG1.ZAITSEV)
# ---------------------------------------------------------------------------

# (substrate name, [(alkene SMILES, alkene name), ...], intended index). The
# intended index is the fixture's claim; the verifier derives the substitution
# degree from each structure and refuses the item unless the claim is strictly
# the most substituted alkene.
_ZAITSEV_FIXTURES = [
    ("2-bromo-2-methylbutane", [("CC=C(C)C", "2-methylbut-2-ene"), ("C=C(C)CC", "2-methylbut-1-ene")], 0),
    ("2-bromobutane", [("CC=CC", "but-2-ene"), ("C=CCC", "but-1-ene")], 0),
    ("2-bromopentane", [("CC=CCC", "pent-2-ene"), ("C=CCCC", "pent-1-ene")], 0),
    ("2-bromo-2-methylpentane", [("CC(C)=CCC", "2-methylpent-2-ene"), ("C=C(C)CCC", "2-methylpent-1-ene")], 0),
]


def _alkene_substitution(smiles: str) -> int | None:
    """Number of carbon substituents on the two carbons of the C=C double bond."""
    Chem = _rdkit()
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return None
    for bond in mol.GetBonds():
        if bond.GetBondType() != Chem.BondType.DOUBLE:
            continue
        a, b = bond.GetBeginAtom(), bond.GetEndAtom()
        if a.GetSymbol() != "C" or b.GetSymbol() != "C":
            continue
        count = 0
        for atom, partner in ((a, b), (b, a)):
            for nbr in atom.GetNeighbors():
                if nbr.GetIdx() != partner.GetIdx() and nbr.GetSymbol() == "C":
                    count += 1
        return count
    return None


def _gen_zaitsev(seed: int) -> Variant:
    substrate, candidates, correct_index = _pick(_ZAITSEV_FIXTURES, seed)
    choices = [
        {
            "index": i,
            "text": name,
            "misconception": None if i == correct_index else "ELIM-LEAST-SUBSTITUTED",
        }
        for i, (_smiles, name) in enumerate(candidates)
    ]
    return Variant(
        template_id="org.zaitsev.major.v1",
        seed=seed,
        prompt=(
            f"E2 elimination of {substrate} with a small strong base can give "
            "more than one alkene. Which one is the major (Zaitsev) product?"
        ),
        key=str(correct_index),
        node="ORG1.ZAITSEV",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": correct_index,
            "substrate": substrate,
            "candidates": [s for s, _ in candidates],
            "source": ALKENE_STABILITY_SOURCE,
        },
    )


def _ver_zaitsev(v: Variant) -> VerifierResult:
    candidates = list(v.meta.get("candidates", []))
    degrees = [_alkene_substitution(s) for s in candidates]
    if any(d is None for d in degrees):
        return VerifierResult(False, "most-substituted", "an alkene could not be read")
    correct_index = v.meta.get("correct_index", -1)
    if correct_index < 0 or correct_index >= len(degrees):
        return VerifierResult(False, "most-substituted", "keyed choice out of range")
    top = max(degrees)
    if degrees[correct_index] != top:
        return VerifierResult(
            False,
            "most-substituted",
            f"keyed alkene has substitution {degrees[correct_index]}, not the maximum {top}",
        )
    if degrees.count(top) != 1:
        return VerifierResult(
            False, "most-substituted", "the most substituted alkene is not unique"
        )
    return VerifierResult(True, "most-substituted", f"substitution degrees {degrees}")


# ===========================================================================
# General chemistry gap fills
# ===========================================================================

# ---------------------------------------------------------------------------
# gen.hybridization.v1  (GEN1.HYBRIDIZATION)
# ---------------------------------------------------------------------------

# Molecules whose carbons all share one hybridization, so the question has one
# answer no matter which carbon is read.
_HYBRIDIZATION_FIXTURES = [
    ("C", "methane", "sp3"),
    ("CC", "ethane", "sp3"),
    ("C=C", "ethene", "sp2"),
    ("C#C", "ethyne", "sp"),
    ("O=C=O", "carbon dioxide", "sp"),
    ("c1ccccc1", "benzene", "sp2"),
]
_HYB_LABELS = ["sp", "sp2", "sp3"]
_STERIC_TO_HYB = {2: "sp", 3: "sp2", 4: "sp3"}


def _hybridization_from_rdkit(smiles: str) -> str | None:
    """RDKit's hybridization perception for the carbons, if they all agree."""
    Chem = _rdkit()
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return None
    mapping = {
        Chem.HybridizationType.SP: "sp",
        Chem.HybridizationType.SP2: "sp2",
        Chem.HybridizationType.SP3: "sp3",
    }
    seen = set()
    for atom in mol.GetAtoms():
        if atom.GetSymbol() != "C":
            continue
        label = mapping.get(atom.GetHybridization())
        if label is None:
            return None
        seen.add(label)
    if len(seen) != 1:
        return None
    return seen.pop()


def _hybridization_from_steric(smiles: str) -> str | None:
    """Steric number of each carbon, mapped to hybridization independently.

    For a neutral carbon with no lone pairs the steric number is just the count
    of atoms bonded to it, which the added hydrogens make explicit. Two groups
    is sp, three is sp2, four is sp3. This does not consult RDKit's own
    hybridization flag.
    """
    Chem = _rdkit()
    base = Chem.MolFromSmiles(smiles)
    if base is None:
        return None
    mol = Chem.AddHs(base)
    seen = set()
    for atom in mol.GetAtoms():
        if atom.GetSymbol() != "C":
            continue
        label = _STERIC_TO_HYB.get(atom.GetDegree())
        if label is None:
            return None
        seen.add(label)
    if len(seen) != 1:
        return None
    return seen.pop()


def _gen_hybridization(seed: int) -> Variant:
    smiles, name, hyb = _pick(_HYBRIDIZATION_FIXTURES, seed)
    derived = _hybridization_from_rdkit(smiles) or hyb
    correct_index = _HYB_LABELS.index(derived)
    choices = [
        {
            "index": i,
            "text": label,
            "misconception": None if i == correct_index else "HYBRIDIZATION-COUNTS-BONDS",
        }
        for i, label in enumerate(_HYB_LABELS)
    ]
    return Variant(
        template_id="gen.hybridization.v1",
        seed=seed,
        prompt=(
            f"In {name} (SMILES {smiles}), what is the hybridization of the "
            "carbon atom or atoms?"
        ),
        key=str(correct_index),
        node="GEN1.HYBRIDIZATION",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": correct_index,
            "smiles": smiles,
            "name": name,
            "intended": hyb,
        },
    )


def _ver_hybridization(v: Variant) -> VerifierResult:
    smiles = str(v.meta.get("smiles", ""))
    from_rdkit = _hybridization_from_rdkit(smiles)
    from_steric = _hybridization_from_steric(smiles)
    if from_rdkit is None or from_steric is None:
        return VerifierResult(False, "perception-vs-steric", f"cannot read {smiles}")
    if from_rdkit != from_steric:
        return VerifierResult(
            False,
            "perception-vs-steric",
            f"RDKit says {from_rdkit}, steric number says {from_steric}",
        )
    if from_steric != v.meta.get("intended"):
        return VerifierResult(
            False,
            "perception-vs-steric",
            f"structure gives {from_steric}, fixture intended {v.meta.get('intended')}",
        )
    keyed = v.meta["choices"][v.meta["correct_index"]]["text"]
    if keyed != from_steric:
        return VerifierResult(False, "perception-vs-steric", "keyed choice is wrong")
    return VerifierResult(True, "perception-vs-steric", from_steric)


# ---------------------------------------------------------------------------
# gen.molality.v1  (GEN1.MOLALITY)
# ---------------------------------------------------------------------------


def _gen_molality(seed: int) -> Variant:
    m = _mol_from_pool(seed, salt=1)
    molar = parse_formula(m.formula).molar_mass()
    grams = round(3.0 + (seed % 80) / 5.0, 2)
    kg = round(0.100 + (seed % 40) / 50.0, 3)
    molality = (grams / molar) / kg
    from .stoich import format_sig_figs

    return Variant(
        template_id="gen.molality.v1",
        seed=seed,
        prompt=(
            f"{grams} g of {m.name} ({m.formula}) is dissolved in {kg} kg of "
            "solvent. What is the molality of the solution? Report in mol/kg to "
            "3 significant figures."
        ),
        key=format_sig_figs(molality, 3),
        node="GEN1.MOLALITY",
        grader="numeric",
        meta={
            "unit": "mol/kg",
            "value": molality,
            "grams": grams,
            "kg": kg,
            "molar_mass": molar,
            "sig_figs": 3,
            "wrong_paths": [
                {
                    "value": grams / kg,
                    "misconception": "MOLES-NOT-MASS",
                    "detail": (
                        "You divided grams by kilograms. Molality counts moles "
                        "per kilogram, so the mass has to become moles first."
                    ),
                }
            ],
        },
    )


def _ver_molality(v: Variant) -> VerifierResult:
    recovered = v.meta["value"] * v.meta["kg"] * v.meta["molar_mass"]
    if not math.isclose(recovered, v.meta["grams"], rel_tol=1e-9):
        return VerifierResult(False, "inverse-molality", f"recovered {recovered} g")
    return VerifierResult(True, "inverse-molality", f"{recovered:.6g} g recovered")


# ---------------------------------------------------------------------------
# gen.osmotic.v1  (GEN1.OSMOSIS)
# ---------------------------------------------------------------------------


def _gen_osmotic(seed: int) -> Variant:
    i = (1, 2, 3)[seed % 3]
    molarity = round(0.020 + (seed % 40) / 200.0, 3)
    temp_k = 290 + (seed % 25)
    pressure = i * molarity * R_GAS * temp_k
    from .stoich import format_sig_figs

    wrong_paths = []
    if i != 1:
        wrong_paths.append(
            {
                "value": molarity * R_GAS * temp_k,
                "misconception": "OSMOSIS-NO-VANTHOFF",
                "detail": (
                    "You left out the van't Hoff factor. A solute that splits "
                    "into i particles raises the osmotic pressure i-fold."
                ),
            }
        )
    return Variant(
        template_id="gen.osmotic.v1",
        seed=seed,
        prompt=(
            f"A solution is {molarity} M in a solute that dissociates into {i} "
            f"particle(s) per formula unit. What is its osmotic pressure at "
            f"{temp_k} K? Use R = 0.08206 L*atm/(mol*K) and report in atm to 3 "
            "significant figures."
        ),
        key=format_sig_figs(pressure, 3),
        node="GEN1.OSMOSIS",
        grader="numeric",
        meta={
            "unit": "atm",
            "value": pressure,
            "vant_hoff": i,
            "molarity": molarity,
            "temp_k": temp_k,
            "sig_figs": 3,
            "source": R_SOURCE,
            "wrong_paths": wrong_paths,
        },
    )


def _ver_osmotic(v: Variant) -> VerifierResult:
    denom = v.meta["vant_hoff"] * v.meta["molarity"] * v.meta["temp_k"]
    if denom <= 0:
        return VerifierResult(False, "recover-R", "non positive iMT product")
    recovered_r = v.meta["value"] / denom
    if not math.isclose(recovered_r, R_GAS, rel_tol=1e-9):
        return VerifierResult(False, "recover-R", f"recovered R = {recovered_r}")
    if v.meta["value"] <= 0:
        return VerifierResult(False, "recover-R", "non positive pressure")
    return VerifierResult(True, "recover-R", f"R = {recovered_r:.5f} recovered")


# ---------------------------------------------------------------------------
# gen.halflife.v1  (GEN2.HALFLIFE)
# ---------------------------------------------------------------------------


def _gen_halflife(seed: int) -> Variant:
    k = round(0.010 + (seed % 50) / 1000.0, 3)
    half_life = LN2 / k
    from .stoich import format_sig_figs

    return Variant(
        template_id="gen.halflife.v1",
        seed=seed,
        prompt=(
            f"A first order reaction has a rate constant k = {k} per second. "
            "What is its half life? Report in seconds to 3 significant figures."
        ),
        key=format_sig_figs(half_life, 3),
        node="GEN2.HALFLIFE",
        grader="numeric",
        meta={
            "unit": "s",
            "value": half_life,
            "k": k,
            "sig_figs": 3,
            "wrong_paths": [
                {
                    "value": 1.0 / k,
                    "misconception": "HALFLIFE-NO-LN2",
                    "detail": (
                        "That is the reciprocal of the rate constant. A first "
                        "order half life is ln 2 divided by k, not 1 over k."
                    ),
                }
            ],
        },
    )


def _ver_halflife(v: Variant) -> VerifierResult:
    if v.meta["value"] <= 0:
        return VerifierResult(False, "recover-k", "non positive half life")
    recovered_k = LN2 / v.meta["value"]
    if not math.isclose(recovered_k, v.meta["k"], rel_tol=1e-9):
        return VerifierResult(False, "recover-k", f"recovered k = {recovered_k}")
    return VerifierResult(True, "recover-k", f"k = {recovered_k:.6g} recovered")


# ---------------------------------------------------------------------------
# gen.henderson.v1  (GEN2.HENDERSON)
# ---------------------------------------------------------------------------


def _gen_henderson(seed: int) -> Variant:
    name, formula, ka = _pick(WEAK_ACIDS, seed, salt=2)
    pka = -math.log10(ka)
    c_acid = round(0.10 + (seed % 9) / 20.0, 2)
    c_base = round(c_acid + 0.05 + (seed % 5) / 20.0, 2)
    ph = pka + math.log10(c_base / c_acid)
    return Variant(
        template_id="gen.henderson.v1",
        seed=seed,
        prompt=(
            f"A buffer is {c_acid} M in {name} ({formula}), which has "
            f"pKa {pka:.2f}, and {c_base} M in its conjugate base. What is the "
            "pH at 25 C? Report to 2 decimal places."
        ),
        key=f"{ph:.2f}",
        node="GEN2.HENDERSON",
        grader="numeric",
        meta={
            "unit": "",
            "value": round(ph, 2),
            "pka": pka,
            "c_acid": c_acid,
            "c_base": c_base,
            "sig_figs": None,
            "source": ACID_TABLE_SOURCE,
            "wrong_paths": [
                {
                    "value": round(pka + math.log10(c_acid / c_base), 2),
                    "misconception": "HH-RATIO-INVERTED",
                    "detail": (
                        "The ratio is upside down. Henderson-Hasselbalch puts "
                        "the conjugate base over the acid, so more base than "
                        "acid must raise the pH above the pKa."
                    ),
                }
            ],
        },
    )


def _ver_henderson(v: Variant) -> VerifierResult:
    if not (0.0 <= v.meta["value"] <= 14.0):
        return VerifierResult(False, "inverse-log-ratio", "pH outside the normal range")
    recovered_ratio = 10 ** (v.meta["value"] - v.meta["pka"])
    stated_ratio = v.meta["c_base"] / v.meta["c_acid"]
    # The key is a pH rounded to two decimals, so the implied ratio can differ
    # from the exact one by more than the ratio's own precision. The tolerance
    # has to be looser than the key's rounding or a correct item fails.
    if not math.isclose(recovered_ratio, stated_ratio, rel_tol=0.03):
        return VerifierResult(
            False, "inverse-log-ratio", f"recovered ratio {recovered_ratio:.4g} vs {stated_ratio:.4g}"
        )
    return VerifierResult(True, "inverse-log-ratio", f"ratio {recovered_ratio:.4g} recovered")


# ===========================================================================
# Registry, hints, misconceptions
# ===========================================================================

TEMPLATES_O_U89G: dict[str, dict[str, object]] = {
    "org.monochlorination.count.v1": {
        "gen": _gen_monochlorination,
        "ver": _ver_monochlorination,
        "node": "ORG1.RADICALHALOGEN",
        "grader": "numeric",
    },
    "org.halide.class.v1": {
        "gen": _gen_halide_class,
        "ver": _ver_halide_class,
        "node": "ORG1.HALIDENOMEN",
        "grader": "mc",
    },
    "org.sn2.config.v1": {
        "gen": _gen_sn2_config,
        "ver": _ver_sn2_config,
        "node": "ORG1.SN2",
        "grader": "mc",
    },
    "org.zaitsev.major.v1": {
        "gen": _gen_zaitsev,
        "ver": _ver_zaitsev,
        "node": "ORG1.ZAITSEV",
        "grader": "mc",
    },
    "gen.hybridization.v1": {
        "gen": _gen_hybridization,
        "ver": _ver_hybridization,
        "node": "GEN1.HYBRIDIZATION",
        "grader": "mc",
    },
    "gen.molality.v1": {
        "gen": _gen_molality,
        "ver": _ver_molality,
        "node": "GEN1.MOLALITY",
        "grader": "numeric",
    },
    "gen.osmotic.v1": {
        "gen": _gen_osmotic,
        "ver": _ver_osmotic,
        "node": "GEN1.OSMOSIS",
        "grader": "numeric",
    },
    "gen.halflife.v1": {
        "gen": _gen_halflife,
        "ver": _ver_halflife,
        "node": "GEN2.HALFLIFE",
        "grader": "numeric",
    },
    "gen.henderson.v1": {
        "gen": _gen_henderson,
        "ver": _ver_henderson,
        "node": "GEN2.HENDERSON",
        "grader": "numeric",
    },
}


HINTS_O_U89G: dict[str, tuple[str, str, str]] = {
    "org.monochlorination.count.v1": (
        "You are counting how many different products a single chlorination can "
        "make, which is the number of chemically different hydrogens the "
        "molecule has.",
        "Two hydrogens are the same kind if the symmetry of the molecule can "
        "swap them, and replacing either one gives the same product. So group "
        "the hydrogens by which carbon they sit on and by whether those carbons "
        "are equivalent.",
        "Draw the skeleton and label each carbon that carries a hydrogen. Then "
        "ask which of those carbons are made equivalent by the molecule's "
        "symmetry, and count the distinct kinds.",
    ),
    "org.halide.class.v1": (
        "You are classifying the carbon that holds the halogen, not the whole "
        "molecule.",
        "Methyl, primary, secondary and tertiary count how many other carbons "
        "are bonded directly to that one carbon: none, one, two, or three. The "
        "rest of the chain does not matter.",
        "Find the carbon bonded to the halogen and look only at its immediate "
        "neighbours. Count how many of them are carbon atoms.",
    ),
    "org.sn2.config.v1": (
        "You are naming the configuration of the product after an SN2 reaction "
        "has happened, using the CIP rules.",
        "SN2 attacks the carbon from the side opposite the leaving group, so the "
        "three kept groups turn inside out. Work out the new arrangement first, "
        "then rank the groups on the product and assign R or S from scratch.",
        "Decide what happens to the arrangement in space first: the nucleophile "
        "arrives opposite where the leaving group was. Only after that, rank the "
        "four groups on the product carbon.",
    ),
    "org.zaitsev.major.v1": (
        "You are picking which of the possible alkenes forms in the greater "
        "amount with a small strong base.",
        "The more alkyl groups sit on the two carbons of the double bond, the "
        "more stable the alkene, and a small base gives mostly that one. Count "
        "the carbon groups on each candidate's double bond.",
        "For each choice, find the two carbons joined by the double bond and "
        "count how many carbon groups hang off them. Compare those counts.",
    ),
    "gen.hybridization.v1": (
        "You are asked for the hybridization of the carbon in this molecule.",
        "Count the groups around the carbon: each atom bonded to it plus any "
        "lone pairs. A double or triple bond to one atom still counts that atom "
        "once. Two groups is sp, three is sp2, four is sp3.",
        "Pick one carbon and count how many atoms are bonded to it, treating a "
        "multiple bond to a neighbour as a single group.",
    ),
    "gen.molality.v1": (
        "You are asked for molality, which counts moles of solute per kilogram "
        "of solvent.",
        "A mass of solute has to become moles before it can become a molality, "
        "and the denominator is the mass of solvent in kilograms, not a volume.",
        "Convert the mass of solute to moles using its molar mass, and stop "
        "before dividing by the solvent mass.",
    ),
    "gen.osmotic.v1": (
        "You are asked for the osmotic pressure of a solution from its "
        "concentration and temperature.",
        "Osmotic pressure is the van't Hoff factor times the molarity times R "
        "times the absolute temperature. The van't Hoff factor is how many "
        "particles each formula unit becomes.",
        "Write down the four quantities with their units and confirm the "
        "temperature is in kelvin, then arrange them so the answer comes out in "
        "atmospheres.",
    ),
    "gen.halflife.v1": (
        "You are asked for the half life of a first order reaction from its rate "
        "constant.",
        "For first order kinetics the half life does not depend on how much is "
        "present, and it is a fixed multiple of one over the rate constant. The "
        "multiple is the natural logarithm of two.",
        "Recall the relationship between a first order half life and its rate "
        "constant, and note that it involves ln 2, not just the reciprocal of k.",
    ),
    "gen.henderson.v1": (
        "You are asked for the pH of a buffer from its acid and conjugate base "
        "concentrations.",
        "The Henderson-Hasselbalch equation adds to the pKa the base ten "
        "logarithm of the ratio of conjugate base to acid. Getting the ratio "
        "the right way up decides whether the pH sits above or below the pKa.",
        "Start from pH equal to pKa, then decide which way the ratio of base to "
        "acid moves it before you compute the logarithm.",
    ),
}


# New misconceptions for the distractor codes above. Every code these templates
# key must exist and route to a real node, or an MC item cannot ship. On sources:
# these beliefs are familiar from teaching practice but have not been traced to a
# particular published study, and the honest thing is to say so rather than
# attach a citation that was not checked. All remain review "pending".
def _mc(code, name, description, counterexample, routes_to):
    from .misconceptions import Misconception

    return Misconception(
        code=code,
        name=name,
        description=description,
        counterexample=counterexample,
        routes_to=routes_to,
        source="Instructor observation; not traced to a published study",
        review="pending",
    )


MISCONCEPTIONS_O_U89G = {
    "HALIDE-CLASS-MISCOUNT": _mc(
        "HALIDE-CLASS-MISCOUNT",
        "Alkyl halide class read from the wrong carbons",
        "The learner classifies the halide by the length of the chain or by the "
        "hydrogens on the carbon rather than by the carbons bonded to the one "
        "that bears the halogen.",
        "1-bromobutane has four carbons in a row, but the carbon holding the "
        "bromine touches only one other carbon, so it is primary, not tertiary.",
        "ORG1.HALIDENOMEN",
    ),
    "SN2-RETENTION": _mc(
        "SN2-RETENTION",
        "SN2 keeps the configuration of the starting material",
        "The learner assumes the nucleophile arrives where the leaving group "
        "was, so the product keeps the substrate's arrangement and its letter.",
        "The nucleophile attacks from the opposite face and the carbon turns "
        "inside out like an umbrella in wind, so the arrangement is the mirror "
        "of the substrate, not a copy of it.",
        "ORG1.SN2",
    ),
    "SN2-LETTER-ALWAYS-FLIPS": _mc(
        "SN2-LETTER-ALWAYS-FLIPS",
        "Inversion of configuration always flips the CIP letter",
        "The learner treats R turning to S as the definition of inversion, and "
        "expects the label to change every time the geometry does.",
        "When the incoming group takes a different priority rank than the leaving "
        "group did, the geometric inversion and the change in ranking cancel in "
        "the label: ethyl 2-bromopropanoate is S and its SN2 cyanide product is "
        "still S, though the carbon inverted.",
        "ORG1.SN2",
    ),
    "ELIM-LEAST-SUBSTITUTED": _mc(
        "ELIM-LEAST-SUBSTITUTED",
        "Elimination favours the less substituted alkene",
        "The learner picks the alkene with the double bond at the end of the "
        "chain, treating the terminal position or the count of hydrogens as what "
        "decides the major product.",
        "With a small strong base the more substituted alkene is major, because "
        "extra alkyl groups on the double bond make it more stable; the terminal "
        "alkene dominates only with a bulky base.",
        "ORG1.ZAITSEV",
    ),
    "HYBRIDIZATION-COUNTS-BONDS": _mc(
        "HYBRIDIZATION-COUNTS-BONDS",
        "Hybridization is read from the number of bonds, not groups",
        "The learner counts every bond, so a double bonded carbon looks like it "
        "has four bonds and is called sp3.",
        "The carbon in ethene has a double bond, but the two atoms in that "
        "double bond count as one group, giving three groups and sp2, not the "
        "four that counting each bond would suggest.",
        "GEN1.HYBRIDIZATION",
    ),
    "OSMOSIS-NO-VANTHOFF": _mc(
        "OSMOSIS-NO-VANTHOFF",
        "Osmotic pressure ignores dissociation of the solute",
        "The learner applies the osmotic pressure relation to the formula unit "
        "concentration without multiplying by how many particles it becomes.",
        "A 0.10 M solution of a salt that splits into two ions exerts the "
        "osmotic pressure of a 0.20 M particle concentration, twice what the "
        "formula concentration alone would give.",
        "GEN1.OSMOSIS",
    ),
    "HALFLIFE-NO-LN2": _mc(
        "HALFLIFE-NO-LN2",
        "First order half life is one over the rate constant",
        "The learner divides one by the rate constant and reports it as the half "
        "life, dropping the factor of ln 2.",
        "A first order half life is ln 2 over k, about 0.693 over k, so the "
        "reciprocal of k overstates it by roughly forty percent.",
        "GEN2.HALFLIFE",
    ),
    "HH-RATIO-INVERTED": _mc(
        "HH-RATIO-INVERTED",
        "The buffer ratio is written acid over base",
        "The learner puts the acid over the conjugate base in the "
        "Henderson-Hasselbalch logarithm, reversing which side of the pKa the pH "
        "lands on.",
        "The equation adds log of base over acid to the pKa, so a buffer with "
        "more conjugate base than acid has a pH above its pKa, not below it.",
        "GEN2.HENDERSON",
    ),
}
