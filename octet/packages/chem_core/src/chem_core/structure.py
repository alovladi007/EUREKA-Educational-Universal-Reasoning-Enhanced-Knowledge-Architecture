"""Grader 4: structure.

This is the grader the Sketcher feeds. The learner draws a molecule, the
client sends SMILES, and this decides whether the drawn structure is the one
the item asked for.

Grading path: RDKit canonical SMILES equality.

Independent verification path: InChIKey agreement. InChI is a genuinely
different algorithm from SMILES canonicalization, developed separately with a
different canonical numbering scheme, so agreement between the two is real
evidence rather than the same computation run twice.

Two policies are configurable per item, because chemistry courses legitimately
want different strictness at different points in the curriculum:

  stereo    "strict" requires stereochemistry to match. "loose" strips it
            before comparing, which is right before stereochemistry has been
            taught and wrong after.
  tautomer  "strict" treats tautomers as different structures. "any" accepts
            any tautomer of the key, which is right when the item is about
            constitution rather than a specific tautomeric form.

The stereo and tautomer policies interact. tautomer="any" requires stripping
stereo before tautomer canonicalization: RDKit's TautomerEnumerator can move or
remove an alpha stereocentre while enumerating, so stereo descriptors cannot be
trusted through it. That makes stereo="strict" with tautomer="any" unsound (a
stereocentre silently dropped by the enumerator would let an enantiomer pass a
strict item), so that combination is refused as an authoring error rather than
graded. stereo="loose" with tautomer="any" strips stereo from both sides first,
which is exactly what the loose policy asks for, so enantiomers match.

A wrong answer is diagnosed rather than merely rejected: same formula but
different connectivity is a constitutional isomer, and same connectivity but
different stereo descriptors is a stereochemistry slip. Those are different
beliefs and they route to different remediation.
"""

from __future__ import annotations

from ._safe import InputTooLarge, check_size
from .types import GradeResult, VerifierResult

MAX_SMILES_CHARS = 1000


def _rdkit():
    from rdkit import Chem, RDLogger

    RDLogger.DisableLog("rdApp.*")
    return Chem


def parse_smiles(text: str):
    """Parse and sanitize. Returns None when RDKit will not accept it."""
    if text is None:
        return None
    try:
        raw = check_size(str(text), cap=MAX_SMILES_CHARS).strip()
    except InputTooLarge:
        return None
    if not raw:
        return None
    Chem = _rdkit()
    try:
        mol = Chem.MolFromSmiles(raw)
    except Exception:
        return None
    return mol


def canonical(text: str, *, keep_stereo: bool = True) -> str | None:
    mol = parse_smiles(text)
    if mol is None:
        return None
    Chem = _rdkit()
    if not keep_stereo:
        mol = Chem.MolFromSmiles(Chem.MolToSmiles(mol, isomericSmiles=False))
        if mol is None:
            return None
    return Chem.MolToSmiles(mol, isomericSmiles=keep_stereo)


def inchikey(text: str) -> str | None:
    mol = parse_smiles(text)
    if mol is None:
        return None
    Chem = _rdkit()
    try:
        return Chem.MolToInchiKey(mol)
    except Exception:
        return None


def formula_of(text: str) -> str | None:
    mol = parse_smiles(text)
    if mol is None:
        return None
    from rdkit.Chem import rdMolDescriptors

    return rdMolDescriptors.CalcMolFormula(mol)


def _canonical_tautomer(text: str) -> str | None:
    """Canonical tautomer, used only when the item's policy allows any."""
    mol = parse_smiles(text)
    if mol is None:
        return None
    try:
        from rdkit.Chem.MolStandardize import rdMolStandardize

        enumerator = rdMolStandardize.TautomerEnumerator()
        Chem = _rdkit()
        return Chem.MolToSmiles(enumerator.Canonicalize(mol))
    except Exception:
        # If the standardizer is unavailable, fall back to plain canonical
        # SMILES. That is stricter, not looser, so it cannot wrongly accept.
        return canonical(text)


def grade_structure(
    key_smiles: str,
    student_smiles: str,
    *,
    stereo: str = "strict",
    tautomer: str = "strict",
) -> GradeResult:
    """Grade a drawn or typed structure against the item's key."""
    grader = "structure"

    if tautomer == "any" and stereo == "strict":
        # Unsound combination: tautomer canonicalization can strip a stereocentre,
        # so a strict stereo requirement cannot be honored through it. Refuse as
        # an authoring error rather than silently accept an enantiomer.
        return GradeResult.ungradable(
            grader,
            "This item combines stereo='strict' with tautomer='any', which is not "
            "supported: tautomer canonicalization can discard stereochemistry, so a "
            "strict stereo check cannot be trusted through it. Author the item with "
            "tautomer='strict' or stereo='loose'.",
        )

    key_mol = parse_smiles(key_smiles)
    if key_mol is None:
        return GradeResult.ungradable(grader, f"item key is not a valid structure: {key_smiles}")

    got = parse_smiles(student_smiles)
    if got is None:
        return GradeResult.ungradable(
            grader,
            "That structure could not be read. Check for an impossible valence, "
            "for example a carbon with five bonds, or an unclosed ring.",
        )

    keep_stereo = stereo == "strict"
    if tautomer == "any":
        # stereo='strict' is refused above, so here stereo is 'loose': strip
        # stereo from both sides before tautomer canonicalization so enantiomers
        # collapse to one form and match.
        key_flat_smiles = canonical(key_smiles, keep_stereo=False)
        got_flat_smiles = canonical(student_smiles, keep_stereo=False)
        if key_flat_smiles is None or got_flat_smiles is None:
            return GradeResult.ungradable(grader, "structure could not be canonicalized")
        key_canon = _canonical_tautomer(key_flat_smiles)
        got_canon = _canonical_tautomer(got_flat_smiles)
    else:
        key_canon = canonical(key_smiles, keep_stereo=keep_stereo)
        got_canon = canonical(student_smiles, keep_stereo=keep_stereo)

    if key_canon is None or got_canon is None:
        return GradeResult.ungradable(grader, "structure could not be canonicalized")

    if key_canon == got_canon:
        return GradeResult(
            is_correct=True,
            score=1.0,
            grader=grader,
            detail="Correct.",
            correct_display=key_canon,
        )

    # Diagnose. Compare at decreasing strictness to find where it diverges.
    key_flat = canonical(key_smiles, keep_stereo=False)
    got_flat = canonical(student_smiles, keep_stereo=False)
    key_formula = formula_of(key_smiles)
    got_formula = formula_of(student_smiles)

    if key_flat == got_flat and keep_stereo:
        return GradeResult(
            is_correct=False,
            score=0.5,
            grader=grader,
            misconception="STEREO-IGNORED",
            detail=(
                "The connectivity is right, so the atoms are joined correctly. "
                "The stereochemistry is not. Look again at which groups point "
                "toward you and which point away."
            ),
            correct_display=key_canon,
        )

    if key_formula and key_formula == got_formula:
        return GradeResult(
            is_correct=False,
            score=0.25,
            grader=grader,
            misconception="CONSTITUTIONAL-ISOMER",
            detail=(
                f"Your structure has the right molecular formula ({got_formula}) "
                "but the atoms are joined in a different order, so it is a "
                "different compound. Check which atom is bonded to which."
            ),
            correct_display=key_canon,
        )

    return GradeResult(
        is_correct=False,
        score=0.0,
        grader=grader,
        detail=(
            f"That structure has formula {got_formula or 'unknown'}, and the "
            f"target has {key_formula or 'a different formula'}. Count the atoms "
            "of each element before checking how they are joined."
        ),
        correct_display=key_canon,
    )


def verify_structure_key(key_smiles: str, expected_inchikey: str | None = None) -> VerifierResult:
    """Independent check on a structure key.

    Runs the key through InChI, a different canonicalization algorithm from
    SMILES, and requires a round trip: the InChIKey derived from the key must
    match the InChIKey derived from the key's own canonical SMILES. When an
    expected InChIKey is supplied (from the molecule library) it must match
    that too.
    """
    key_canon = canonical(key_smiles)
    if key_canon is None:
        return VerifierResult(False, "inchikey-agreement", f"RDKit rejected {key_smiles}")

    direct = inchikey(key_smiles)
    via_canonical = inchikey(key_canon)
    if direct is None or via_canonical is None:
        return VerifierResult(False, "inchikey-agreement", "InChI generation failed")
    if direct != via_canonical:
        return VerifierResult(
            False,
            "inchikey-agreement",
            f"canonicalization changed identity: {direct} vs {via_canonical}",
        )
    if expected_inchikey and direct != expected_inchikey:
        return VerifierResult(
            False,
            "inchikey-agreement",
            f"key is {direct}, library records {expected_inchikey}",
        )
    return VerifierResult(True, "inchikey-agreement", direct)
