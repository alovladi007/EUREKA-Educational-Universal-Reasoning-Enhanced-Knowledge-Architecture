"""Machine checks for organic chemistry claims.

This module exists because organic content is the most dangerous content this
platform will author.

General chemistry lessons were self checking in a useful way: a stoichiometry
worked example either balances or it does not, and the arithmetic is right
there to test. Organic chemistry is not like that. A mechanism can be wrong in
a way that reads perfectly fluently, a stereochemical assignment can be
confidently inverted, and an NMR claim can name a splitting pattern that the
structure does not produce. Prose fluency is uncorrelated with correctness
here, which means reviewing organic text by reading it is close to useless.

So every chemical claim an organic lesson or item makes has to be derivable
from the structure by a machine, and this module is where those derivations
live. What can be checked:

  stereocentres and their CIP descriptors, from the structure
  degrees of unsaturation, from the molecular formula
  proton environments and their integration ratio, from molecular symmetry
  whether two structures are the same compound, stereochemistry included
  whether a claimed reaction conserves atoms

What cannot be checked here, stated plainly so nobody assumes otherwise:
whether a mechanism's arrows are the ones a chemist would draw, whether a
reaction actually proceeds under the stated conditions, and whether a chemical
shift falls where the lesson says. Those need either a reaction database or a
subject matter expert, and the honest handling is to keep them out of
generated content rather than to guess. Anything asserting one of those has to
carry a citation.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

from ._safe import InputTooLarge, check_size
from .types import VerifierResult

MAX_SMILES_CHARS = 1000


def _rdkit():
    from rdkit import Chem, RDLogger

    RDLogger.DisableLog("rdApp.*")
    return Chem


def _mol(smiles: str, *, with_hydrogens: bool = False):
    if smiles is None:
        return None
    try:
        raw = check_size(str(smiles), cap=MAX_SMILES_CHARS).strip()
    except InputTooLarge:
        return None
    if not raw:
        return None
    Chem = _rdkit()
    try:
        mol = Chem.MolFromSmiles(raw)
    except Exception:
        return None
    if mol is None:
        return None
    return Chem.AddHs(mol) if with_hydrogens else mol


# ---------------------------------------------------------------------------
# Stereochemistry
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class Stereocentre:
    atom_index: int
    descriptor: str  # "R", "S", or "?" when the structure leaves it unassigned


def stereocentres(smiles: str) -> list[Stereocentre] | None:
    """CIP descriptors derived from the structure, not from an author's memory.

    Uses RDKit's current CIP labelling rather than the legacy implementation,
    because the legacy one gets some cases wrong and this is precisely the kind
    of claim that must not be quietly incorrect.
    """
    mol = _mol(smiles)
    if mol is None:
        return None
    Chem = _rdkit()
    try:
        found = Chem.FindMolChiralCenters(
            mol, includeUnassigned=True, useLegacyImplementation=False
        )
    except Exception:
        return None
    return [Stereocentre(atom_index=i, descriptor=d) for i, d in found]


def stereocentre_count(smiles: str) -> int | None:
    centres = stereocentres(smiles)
    return None if centres is None else len(centres)


def verify_stereo_claim(smiles: str, claimed: str | list[str]) -> VerifierResult:
    """Check a claimed set of CIP descriptors against the structure.

    claimed is either a single descriptor for a one centre molecule ("R") or a
    list in atom index order. This is the check that stops a lesson asserting
    S for a centre the structure makes R.
    """
    centres = stereocentres(smiles)
    if centres is None:
        return VerifierResult(False, "rdkit-cip", f"RDKit rejected {smiles}")

    derived = [c.descriptor for c in centres]
    wanted = [claimed] if isinstance(claimed, str) else list(claimed)

    if len(derived) != len(wanted):
        return VerifierResult(
            False,
            "rdkit-cip",
            f"structure has {len(derived)} stereocentre(s) {derived}, "
            f"the claim names {len(wanted)} {wanted}",
        )
    if derived != wanted:
        return VerifierResult(
            False, "rdkit-cip", f"structure gives {derived}, the claim says {wanted}"
        )
    if "?" in derived:
        return VerifierResult(
            False,
            "rdkit-cip",
            "the structure leaves a stereocentre unassigned, so no descriptor "
            "can be claimed for it",
        )
    return VerifierResult(True, "rdkit-cip", f"{derived}")


def mirror_image(smiles: str) -> str | None:
    """The mirror image, as canonical SMILES.

    Reflection inverts every tetrahedral centre and leaves double bond geometry
    alone: a cis alkene stays cis in a mirror. Returns None when the structure
    cannot be read.
    """
    Chem = _rdkit()
    mol = _mol(smiles)
    if mol is None:
        return None
    flipped = Chem.Mol(mol)
    for atom in flipped.GetAtoms():
        tag = atom.GetChiralTag()
        if tag == Chem.ChiralType.CHI_TETRAHEDRAL_CW:
            atom.SetChiralTag(Chem.ChiralType.CHI_TETRAHEDRAL_CCW)
        elif tag == Chem.ChiralType.CHI_TETRAHEDRAL_CCW:
            atom.SetChiralTag(Chem.ChiralType.CHI_TETRAHEDRAL_CW)
    try:
        Chem.AssignStereochemistry(flipped, cleanIt=True, force=True)
        return Chem.MolToSmiles(flipped)
    except Exception:
        return None


def is_chiral(smiles: str) -> bool | None:
    """True when a structure is not superimposable on its mirror image.

    A meso compound has stereocentres and is achiral, which is exactly the case
    that counting stereocentres gets wrong.
    """
    from .structure import canonical

    reflected = mirror_image(smiles)
    original = canonical(smiles)
    if reflected is None or original is None:
        return None
    return reflected != original


def are_enantiomers(a: str, b: str) -> bool | None:
    """True when two structures are non-superimposable mirror images.

    Decided by actually reflecting one structure and comparing it to the other,
    which is the definition. An earlier version compared CIP descriptors
    pairwise and called a pair enantiomers when every descriptor differed. That
    proxy is wrong in a way that matters:

      cis and trans 1,4-dimethylcyclohexane carry descriptors s,s and r,r, so
      every descriptor differs and the old test said enantiomers. Both are in
      fact achiral, each having a mirror plane through C1 and C4, so they
      cannot be an enantiomeric pair at all. They are diastereomers.

    The failure mode was the dangerous direction. An author writing the correct
    diastereomers claim got a rejection, and the obvious way to make the
    rejection go away was to write the false enantiomers claim, which passed. A
    verifier that refuses the truth and accepts the falsehood is worse than no
    verifier, because it moves content toward the error under the appearance of
    checking. Found by an author who hit it and reported it rather than
    flipping the claim.
    """
    from .structure import canonical

    ca, cb = canonical(a), canonical(b)
    if ca is None or cb is None:
        return None
    if ca == cb:
        return False  # one compound written twice cannot be a pair

    flat_a = canonical(a, keep_stereo=False)
    flat_b = canonical(b, keep_stereo=False)
    if flat_a != flat_b:
        return False  # different constitution

    # An unassigned centre leaves the question genuinely open.
    centres = (stereocentres(a) or []) + (stereocentres(b) or [])
    if any(c.descriptor == "?" for c in centres):
        return None

    reflected = mirror_image(a)
    if reflected is None:
        return None
    return reflected == cb


def are_diastereomers(a: str, b: str) -> bool | None:
    """Stereoisomers that are not mirror images and not the same compound."""
    from .structure import canonical

    ca, cb = canonical(a), canonical(b)
    if ca is None or cb is None:
        return None
    if ca == cb:
        return False
    if canonical(a, keep_stereo=False) != canonical(b, keep_stereo=False):
        return False
    enantio = are_enantiomers(a, b)
    if enantio is None:
        return None
    return not enantio


# ---------------------------------------------------------------------------
# Degrees of unsaturation
# ---------------------------------------------------------------------------

_FORMULA_TOKEN = re.compile(r"([A-Z][a-z]?)(\d*)")

# Valence used for the classic degrees of unsaturation formula. Halogens count
# as hydrogen, oxygen and sulfur are ignored, nitrogen and phosphorus add one.
_HALOGENS = {"F", "Cl", "Br", "I"}
_IGNORED = {"O", "S"}
_TRIVALENT = {"N", "P"}


def degrees_of_unsaturation(formula: str) -> float | None:
    """Rings plus pi bonds, derived from the molecular formula.

    A whole number for a sensible neutral formula. Returned as a float because
    a half integer is the signal that the formula is impossible for a neutral
    closed shell species, which is itself worth surfacing rather than rounding
    away.
    """
    if not formula:
        return None
    counts: dict[str, int] = {}
    for element, digits in _FORMULA_TOKEN.findall(str(formula)):
        if not element:
            continue
        counts[element] = counts.get(element, 0) + (int(digits) if digits else 1)
    if not counts or "C" not in counts:
        return None

    carbon = counts.get("C", 0)
    hydrogen = counts.get("H", 0) + sum(counts.get(x, 0) for x in _HALOGENS)
    nitrogen = sum(counts.get(x, 0) for x in _TRIVALENT)
    for element in counts:
        if element not in {"C", "H"} | _HALOGENS | _IGNORED | _TRIVALENT:
            # An element the formula does not cover. Refuse rather than
            # returning a number that quietly ignored it.
            return None
    return (2 * carbon + 2 + nitrogen - hydrogen) / 2


def verify_unsaturation_claim(smiles: str, claimed: int) -> VerifierResult:
    """Check a stated degree of unsaturation against the actual structure.

    Two independent routes: the formula arithmetic above, and a direct count of
    rings plus pi bonds from the graph. They must agree with each other and
    with the claim.
    """
    mol = _mol(smiles)
    if mol is None:
        return VerifierResult(False, "unsaturation-two-routes", f"RDKit rejected {smiles}")

    from rdkit.Chem import rdMolDescriptors

    formula = rdMolDescriptors.CalcMolFormula(mol)
    # CalcMolFormula appends a charge such as "+" or "-2"; the arithmetic below
    # is only valid for a neutral species, so refuse rather than mislead.
    if any(ch in formula for ch in "+-"):
        return VerifierResult(
            False,
            "unsaturation-two-routes",
            f"{formula} carries a charge, and this formula only holds for a "
            "neutral species",
        )
    from_formula = degrees_of_unsaturation(formula)
    if from_formula is None:
        return VerifierResult(
            False, "unsaturation-two-routes", f"cannot compute from formula {formula}"
        )

    rings = mol.GetRingInfo().NumRings()

    # Count pi bonds on a Kekulized copy. An aromatic bond reports its order as
    # 1.5, and the obvious int(round(order - 1)) then scores it as zero because
    # round(0.5) is 0 under banker's rounding. That made benzene come out at one
    # degree of unsaturation instead of four. The bug survived because the graph
    # count is only ever compared against the formula count, which is what
    # caught it; a single route would have shipped the wrong number.
    Chem = _rdkit()
    kekulized = Chem.Mol(mol)
    try:
        Chem.Kekulize(kekulized, clearAromaticFlags=True)
    except Exception:
        return VerifierResult(
            False, "unsaturation-two-routes", f"{smiles} could not be Kekulized"
        )
    pi = 0
    for bond in kekulized.GetBonds():
        order = bond.GetBondTypeAsDouble()
        if order not in (1.0, 2.0, 3.0):
            return VerifierResult(
                False,
                "unsaturation-two-routes",
                f"bond order {order} is not a whole number after Kekulization",
            )
        pi += int(order) - 1
    from_graph = rings + pi

    if abs(from_formula - from_graph) > 1e-9:
        return VerifierResult(
            False,
            "unsaturation-two-routes",
            f"formula gives {from_formula}, the graph gives {from_graph}",
        )
    if abs(from_formula - claimed) > 1e-9:
        return VerifierResult(
            False,
            "unsaturation-two-routes",
            f"structure gives {from_formula:g}, the claim says {claimed}",
        )
    return VerifierResult(True, "unsaturation-two-routes", f"{from_graph} from {formula}")


# ---------------------------------------------------------------------------
# Proton environments
# ---------------------------------------------------------------------------


def proton_environments(smiles: str) -> list[int] | None:
    """Integration ratio implied by molecular symmetry, largest first.

    Hydrogens sharing a canonical rank are equivalent by symmetry, so they fall
    in one environment. Toluene gives [3, 2, 2, 1], which is the methyl and the
    ortho, meta and para ring positions.

    This is a symmetry calculation, not a prediction of a spectrum. It says how
    many distinct signals a structure must produce and in what ratio. It says
    nothing about where they appear or how they split, and a lesson claiming a
    shift or a multiplicity needs a citation rather than this function.
    """
    mol = _mol(smiles, with_hydrogens=True)
    if mol is None:
        return None
    Chem = _rdkit()
    try:
        ranks = list(Chem.CanonicalRankAtoms(mol, breakTies=False))
    except Exception:
        return None

    buckets: dict[int, int] = {}
    for atom in mol.GetAtoms():
        if atom.GetSymbol() == "H":
            buckets[ranks[atom.GetIdx()]] = buckets.get(ranks[atom.GetIdx()], 0) + 1
    if not buckets:
        return []
    return sorted(buckets.values(), reverse=True)


def verify_environment_claim(smiles: str, claimed_signals: int) -> VerifierResult:
    """Check a claimed number of distinct proton signals against symmetry."""
    environments = proton_environments(smiles)
    if environments is None:
        return VerifierResult(False, "symmetry-classes", f"RDKit rejected {smiles}")
    if len(environments) != claimed_signals:
        return VerifierResult(
            False,
            "symmetry-classes",
            f"symmetry gives {len(environments)} environment(s) in ratio "
            f"{':'.join(str(n) for n in environments)}, the claim says "
            f"{claimed_signals}",
        )
    return VerifierResult(
        True, "symmetry-classes", ":".join(str(n) for n in environments)
    )


# ---------------------------------------------------------------------------
# Reactions
# ---------------------------------------------------------------------------


def reaction_conserves_atoms(reactants: list[str], products: list[str]) -> VerifierResult:
    """Atom conservation across a claimed transformation.

    This is a necessary condition, not a sufficient one. A reaction can
    conserve every atom and still be one that does not happen, so passing here
    means the equation is not obviously broken, and nothing more. Whether the
    reaction proceeds under the stated conditions is not checkable from the
    structures alone and needs a citation.
    """
    from rdkit.Chem import rdMolDescriptors

    def tally(side: list[str]) -> dict[str, int] | None:
        total: dict[str, int] = {}
        for smiles in side:
            mol = _mol(smiles, with_hydrogens=True)
            if mol is None:
                return None
            for atom in mol.GetAtoms():
                total[atom.GetSymbol()] = total.get(atom.GetSymbol(), 0) + 1
        return total

    left, right = tally(reactants), tally(products)
    if left is None or right is None:
        return VerifierResult(False, "atom-conservation", "a structure could not be read")
    if left != right:
        missing = {k: left.get(k, 0) - right.get(k, 0) for k in set(left) | set(right)}
        missing = {k: v for k, v in missing.items() if v}
        return VerifierResult(
            False, "atom-conservation", f"atoms do not balance: {missing}"
        )
    return VerifierResult(
        True,
        "atom-conservation",
        "atoms balance; this does not establish that the reaction proceeds",
    )
