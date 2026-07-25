"""Phase 3 templates: the items the Sketcher feeds.

One template for now, deliberately. Grader 4 arrives in Phase 3 because the
Sketcher arrives in Phase 3, and a drawing surface with nothing to draw would
be a demonstration rather than a course. Broader structural work, where the
interesting questions live (isomers, functional group transformations,
stereochemistry) belongs to the organic waves in Phases 5 and 6, and building
those items now would put content ahead of the pedagogy that supports it.

Stereochemistry policy here is "loose". A general chemistry learner has not
been taught stereochemistry, so grading them on it would fail them for a
convention nobody showed them. The organic phases flip this to strict on their
own templates, which is exactly why the policy is per item rather than global.
"""

from __future__ import annotations

from .pool import get_pool
from .registry import Variant, _pick
from .structure import canonical, inchikey, verify_structure_key
from .types import VerifierResult


def _gen_structure_draw(seed: int) -> Variant:
    """Draw a named molecule from the curated library."""
    pool = get_pool()
    mol = _pick(pool, seed)
    key = canonical(mol.smiles, keep_stereo=False)
    return Variant(
        template_id="structure.draw.v1",
        seed=seed,
        prompt=(
            f"Draw the structure of {mol.name}. ({mol.real_world_note}) "
            "Stereochemistry is not being assessed here, so a flat structure "
            "with the correct connectivity is what is wanted."
        ),
        key=key or mol.smiles,
        node="GEN1.LEWIS",
        grader="structure",
        meta={
            "name": mol.name,
            "formula": mol.formula,
            "stereo": "loose",
            "tautomer": "strict",
            "expected_inchikey": inchikey(mol.smiles) or "",
        },
    )


def _ver_structure_draw(v: Variant) -> VerifierResult:
    """Confirm the key through InChI rather than through SMILES again.

    The generator produced the key by canonicalizing SMILES. This verifier
    runs the same molecule through InChI, an independently developed
    canonicalization with its own numbering algorithm, and requires the two to
    describe the same substance. It also checks the formula the library
    recorded against the formula RDKit derives from the structure, so a
    library entry whose formula and SMILES disagree cannot be served.
    """
    result = verify_structure_key(v.key, v.meta.get("expected_inchikey") or None)
    if not result.ok:
        return result

    from .structure import formula_of

    derived = formula_of(v.key)
    recorded = str(v.meta.get("formula", "")).strip()
    if recorded and derived and derived != recorded:
        return VerifierResult(
            False,
            "inchikey-agreement",
            f"library records formula {recorded}, structure gives {derived}",
        )
    return result


PHASE3_TEMPLATES: dict[str, dict[str, object]] = {
    "structure.draw.v1": {
        "gen": _gen_structure_draw,
        "ver": _ver_structure_draw,
        "node": "GEN1.LEWIS",
        "grader": "structure",
    },
}
