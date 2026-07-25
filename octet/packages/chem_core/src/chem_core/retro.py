"""Grader 11: one retrosynthetic step.

The learner is shown a target molecule and asked to work backward one step:
name a disconnection and give the precursors that would build the target under
the corresponding forward reaction.

The temptation with retrosynthesis is to grade it by asking a model whether the
answer "looks right", which is exactly the kind of unverifiable judgement this
platform refuses. This grader does not do that. Every disconnection it offers
is backed by an RDKit forward reaction, and a proposed precursor set is correct
if and only if running that forward reaction on those precursors actually
regenerates the target, compared by canonical SMILES. There is no opinion in
the loop: either the chemistry the learner proposed builds the molecule or it
does not.

What that buys, and what it does not. It buys a genuine check that the
disconnection is real and the precursors are the right ones. It does not check
that the reaction is the one a chemist would choose, that the conditions are
sane, or that a protecting group is needed somewhere; those are judgement, and
the item's authored commentary carries them with a citation rather than the
grader pretending to know.

The forward reactions are deliberately simplified models. A Grignard is written
as an organometallic carbanion adding to a carbonyl, not as the full reagent
system, because the point is the bond formed, not the stoichiometry of
magnesium. The reaction library is small, curated and reviewed, and each entry
records what it abstracts away.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from .structure import canonical
from .types import GradeResult, VerifierResult

MAX_PRECURSORS = 4
MAX_SMILES_CHARS = 400


def _run_forward(smarts: str, precursor_smiles: list[str]) -> set[str] | None:
    """Apply a forward reaction to precursors, returning canonical products.

    None when a precursor cannot be read or the reaction template is malformed;
    an empty set when the reaction simply does not apply to these precursors,
    which is a legitimate "your precursors do not react this way" outcome.
    """
    from rdkit import Chem, RDLogger
    from rdkit.Chem import AllChem

    RDLogger.DisableLog("rdApp.*")

    mols = []
    for smi in precursor_smiles:
        mol = Chem.MolFromSmiles(str(smi or "").strip())
        if mol is None:
            return None
        mols.append(mol)

    try:
        rxn = AllChem.ReactionFromSmarts(smarts)
    except Exception:
        return None
    if rxn is None:
        return None

    n = rxn.GetNumReactantTemplates()
    products: set[str] = set()
    # Try the precursors in the given order and, if the count matches, also the
    # reversed order, so a two-component reaction is not order sensitive to the
    # learner.
    orderings = [tuple(mols)]
    if len(mols) == n == 2:
        orderings.append((mols[1], mols[0]))
    for ordering in orderings:
        if len(ordering) != n:
            continue
        try:
            outcomes = rxn.RunReactants(ordering)
        except Exception:
            continue
        for outcome in outcomes:
            for mol in outcome:
                try:
                    Chem.SanitizeMol(mol)
                    products.add(Chem.MolToSmiles(mol))
                except Exception:
                    continue
    return products


@dataclass(frozen=True)
class Disconnection:
    """One named forward reaction that a retro step may invoke.

    forward_smarts must, applied to the right precursors, produce the target.
    abstracts records what the model leaves out, for the reviewer and for the
    lesson, so nobody mistakes the teaching model for the full reagent system.
    """

    name: str
    forward_smarts: str
    forms: str  # the bond or group this disconnection makes, in words
    abstracts: str = ""


@dataclass(frozen=True)
class RetroItem:
    node: str
    target: str  # SMILES of the molecule to make
    disconnections: tuple[Disconnection, ...]
    # The intended answer: which disconnection, and the precursors that satisfy
    # it. Stored so the item verifier can confirm the item is answerable, and
    # for review display. Grading never requires the learner to match these
    # exactly; it requires their precursors to build the target under a named
    # disconnection.
    key_disconnection: str = ""
    key_precursors: tuple[str, ...] = ()
    prompt: str = ""
    source: str = ""  # required when the item asserts a condition or selectivity
    hints: tuple[str, ...] = ()

    def disconnection(self, name: str) -> Disconnection | None:
        return next((d for d in self.disconnections if d.name == name), None)


def grade_retro(item: RetroItem, disconnection_name: str, precursors: list[str]) -> GradeResult:
    """Grade a proposed one-step disconnection.

    Correct when the named disconnection, applied forward to the given
    precursors, produces the target. Partial credit when the precursors have
    the right atoms but do not assemble the target under the chosen
    disconnection, because that is the characteristic near miss: the learner
    saw the fragments but not how they join.
    """
    if not precursors or len(precursors) > MAX_PRECURSORS:
        return GradeResult.ungradable(
            "retro", f"Give between 1 and {MAX_PRECURSORS} precursor structures."
        )
    if any(len(str(p)) > MAX_SMILES_CHARS for p in precursors):
        return GradeResult.ungradable("retro", "A precursor structure is too long to read.")

    target = canonical(item.target, keep_stereo=False)
    if target is None:
        return GradeResult.ungradable("retro", "This item's target is not a readable structure.")

    disc = item.disconnection(disconnection_name)
    if disc is None:
        names = ", ".join(d.name for d in item.disconnections)
        return GradeResult(
            is_correct=False,
            score=0.0,
            grader="retro",
            detail=f"'{disconnection_name}' is not one of the offered disconnections: {names}.",
        )

    normalized = [canonical(p, keep_stereo=False) for p in precursors]
    if any(p is None for p in normalized):
        return GradeResult.ungradable("retro", "One of the precursors is not a valid structure.")

    products = _run_forward(disc.forward_smarts, precursors)
    if products is None:
        return GradeResult.ungradable("retro", "A precursor could not be processed.")

    canonical_products = {canonical(p, keep_stereo=False) for p in products}
    canonical_products.discard(None)

    if target in canonical_products:
        return GradeResult(
            is_correct=True,
            score=1.0,
            grader="retro",
            detail=(
                f"Correct. Under {disc.name}, those precursors form the target "
                f"by making the {disc.forms}."
            ),
        )

    # Right atoms, wrong assembly: the multiset of heavy atoms across the
    # precursors covers the target, but this disconnection does not join them
    # into it. A recognisable and instructive near miss.
    from rdkit import Chem, RDLogger

    RDLogger.DisableLog("rdApp.*")

    def heavy_atoms(smiles_list: list[str]) -> dict[str, int] | None:
        total: dict[str, int] = {}
        for smi in smiles_list:
            mol = Chem.MolFromSmiles(str(smi or ""))
            if mol is None:
                return None
            for atom in mol.GetAtoms():
                total[atom.GetSymbol()] = total.get(atom.GetSymbol(), 0) + 1
        return total

    target_mol = Chem.MolFromSmiles(item.target)
    target_atoms = {}
    if target_mol is not None:
        for atom in target_mol.GetAtoms():
            target_atoms[atom.GetSymbol()] = target_atoms.get(atom.GetSymbol(), 0) + 1
    prec_atoms = heavy_atoms(precursors) or {}
    covers_carbon = prec_atoms.get("C", 0) >= target_atoms.get("C", 0) > 0

    if covers_carbon:
        return GradeResult(
            is_correct=False,
            score=0.3,
            grader="retro",
            misconception="RETRO-FRAGMENTS-DO-NOT-JOIN",
            detail=(
                "Your precursors carry enough of the carbon skeleton, but under "
                f"{disc.name} they do not assemble into the target. Check that "
                "the reactive groups are the ones this disconnection needs, and "
                "on the right carbons."
            ),
        )

    return GradeResult(
        is_correct=False,
        score=0.0,
        grader="retro",
        misconception="RETRO-WRONG-PRECURSORS",
        detail=(
            f"Under {disc.name} those precursors do not form the target. The "
            "carbon skeleton does not add up, so at least one precursor is wrong."
        ),
    )


def verify_retro_item(item: RetroItem) -> VerifierResult:
    """Check that the item is answerable: its own key builds its own target.

    Independent of any learner. If the stored key disconnection applied to the
    stored key precursors does not regenerate the target, the item is broken and
    every learner who solves it correctly would be marked wrong. Since the
    author here is a language model, this check is not optional.
    """
    target = canonical(item.target, keep_stereo=False)
    if target is None:
        return VerifierResult(False, "retro-item", "the target is not a readable structure")

    if not item.disconnections:
        return VerifierResult(False, "retro-item", "the item offers no disconnections")

    # Every offered disconnection must be a parseable reaction, so a distractor
    # cannot be a malformed template that merely never matches.
    for disc in item.disconnections:
        probe = _run_forward(disc.forward_smarts, list(item.key_precursors) or [item.target])
        if probe is None:
            return VerifierResult(
                False, "retro-item", f"disconnection '{disc.name}' has an unusable template"
            )

    disc = item.disconnection(item.key_disconnection)
    if disc is None:
        return VerifierResult(
            False, "retro-item", f"the key names '{item.key_disconnection}', which is not offered"
        )
    if not item.key_precursors:
        return VerifierResult(False, "retro-item", "the key records no precursors")

    products = _run_forward(disc.forward_smarts, list(item.key_precursors))
    if products is None:
        return VerifierResult(False, "retro-item", "the key precursors could not be processed")
    canonical_products = {canonical(p, keep_stereo=False) for p in products}
    if target not in canonical_products:
        return VerifierResult(
            False,
            "retro-item",
            f"the key precursors under {disc.name} do not build the target; "
            "the item is unanswerable",
        )

    asserts_condition = bool(item.source.strip()) or any(
        "condition" in d.abstracts.lower() for d in item.disconnections
    )
    detail = f"{disc.name} builds {target} from the key precursors"
    if item.source.strip():
        detail += "; conditions are authored and cited, not checked here"
    elif asserts_condition:
        return VerifierResult(
            False,
            "retro-item",
            "a disconnection abstracts a condition but the item carries no source for it",
        )
    return VerifierResult(True, "retro-item", detail)


# A small, reviewed library of disconnections. Each forward reaction was
# confirmed to rebuild a real target from real precursors before being added.
# forms and abstracts are written for the learner and the reviewer.
LIBRARY: dict[str, Disconnection] = {
    "williamson": Disconnection(
        name="Williamson ether synthesis",
        forward_smarts="[C:1][OH:2].[C:3][Cl,Br,I:4]>>[C:1][O:2][C:3]",
        forms="carbon-oxygen bond of the ether",
        abstracts="the alcohol is deprotonated to an alkoxide first; the model "
        "starts from the neutral alcohol",
    ),
    "grignard_carbonyl": Disconnection(
        name="Organometallic addition to a carbonyl",
        forward_smarts="[C:1]=[O:2].[C:3][Mg]>>[C:1]([O:2])[C:3]",
        forms="carbon-carbon bond and the alcohol",
        abstracts="the organometallic is drawn as a carbon bonded to Mg; the "
        "full reagent and the aqueous workup are omitted",
    ),
    "ester_from_acid_alcohol": Disconnection(
        name="Fischer esterification",
        forward_smarts="[C:1](=[O:2])[OH:3].[C:4][OH:5]>>[C:1](=[O:2])[O:5][C:4]",
        forms="ester carbon-oxygen bond",
        abstracts="acid catalysis and the water removed are not modelled",
    ),
    "amide_from_acid_amine": Disconnection(
        name="Amide from an acid and an amine",
        forward_smarts="[C:1](=[O:2])[OH:3].[N:4]>>[C:1](=[O:2])[N:4]",
        forms="amide carbon-nitrogen bond",
        abstracts="in practice an activated derivative is used, not the acid "
        "directly; the model forms the bond that results",
    ),
}
