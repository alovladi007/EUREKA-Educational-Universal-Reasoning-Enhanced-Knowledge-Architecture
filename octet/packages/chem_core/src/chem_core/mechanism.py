"""Grader 8: a stepwise mechanism, graded by running each elementary step.

The learner is shown a starting material and a menu of named elementary steps,
and must push through the mechanism one intermediate at a time: at each step
they name the elementary step that fires and give the structure it produces.

The temptation with mechanism grading is the same one retrosynthesis (grader
11) refused: ask a model whether the arrows "look right". This grader does not
do that. Every elementary step it offers is backed by an RDKit forward
reaction, and a proposed intermediate is correct at a step exactly when
applying that step's reaction to the current species actually produces it.
The learner's whole path is correct when every step fires and the final
species is the item's product. There is no opinion in the loop.

What that buys, and what it does not. It buys a genuine per-step check that
the transformation the learner claims is the transformation the chemistry
performs, with the first failing step localized for them. It does not check
transition-state geometry, relative rates between competing valid steps, or
solvent participation; those are judgement, and the item's commentary carries
them with a citation rather than the grader pretending to know.

The elementary steps are deliberately simplified models, exactly as the retro
library's forward reactions are. Protonation is written as the heavy-atom
change it causes, with the proton source abstracted and the abstraction
recorded on the step, because the point is which carbon is protonated, not the
identity of the acid. A step that needs a medium species (a halide ion
attacking a carbocation) declares that species on itself as extra_reactants,
so the species bookkeeping is explicit data rather than hidden convention.

Regiochemistry is graded by consequence rather than by fiat: protonating the
alkene at either carbon is a real elementary step and both carbocations are
accepted AT THAT STEP, but a path through the anti-Markovnikov carbocation
arrives at the wrong final product, and the grader diagnoses the belief there,
where the learner can see the consequence, rather than refusing the step.
"""

from __future__ import annotations

from dataclasses import dataclass

from .structure import canonical
from .types import GradeResult, VerifierResult

MAX_STEPS = 6
MAX_SMILES_CHARS = 400


def _inchikey(smiles: str) -> str | None:
    """InChIKey, the separately developed canonicalization grader 4's verifier
    established as this package's independent identity check."""
    from rdkit import Chem, RDLogger

    RDLogger.DisableLog("rdApp.*")
    mol = Chem.MolFromSmiles(str(smiles or "").strip())
    if mol is None:
        return None
    try:
        return Chem.MolToInchiKey(mol)
    except Exception:
        return None


def _heavy_atoms(smiles: str) -> dict[str, int] | None:
    """Element multiset over heavy atoms, by direct counting. Arithmetic, not
    reaction machinery, so it can check the reaction machinery."""
    from rdkit import Chem, RDLogger

    RDLogger.DisableLog("rdApp.*")
    mol = Chem.MolFromSmiles(str(smiles or "").strip())
    if mol is None:
        return None
    counts: dict[str, int] = {}
    for atom in mol.GetAtoms():
        counts[atom.GetSymbol()] = counts.get(atom.GetSymbol(), 0) + 1
    return counts


def _add_counts(a: dict[str, int], b: dict[str, int]) -> dict[str, int]:
    out = dict(a)
    for k, v in b.items():
        out[k] = out.get(k, 0) + v
    return out


def _run_one_smarts(smarts: str, mols: list) -> set[str] | None:
    """Apply one reaction template, returning product SMILES. None on a
    malformed template; empty set when the template does not apply."""
    from rdkit import Chem
    from rdkit.Chem import AllChem

    try:
        rxn = AllChem.ReactionFromSmarts(smarts)
    except Exception:
        return None
    if rxn is None:
        return None

    n = rxn.GetNumReactantTemplates()
    if len(mols) != n:
        return set()

    products: set[str] = set()
    orderings = [tuple(mols)]
    if n == 2:
        orderings.append((mols[1], mols[0]))
    for ordering in orderings:
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


def _run_step(step: "ElementaryStep", reactant_smiles: list[str]) -> set[str] | None:
    """Apply an elementary step, union over its templates, canonical products.

    None when a reactant cannot be read or every template is malformed; an
    empty set when the step simply does not apply, which is a legitimate
    "that step does not fire here" outcome.
    """
    from rdkit import Chem, RDLogger

    RDLogger.DisableLog("rdApp.*")

    mols = []
    for smi in reactant_smiles:
        mol = Chem.MolFromSmiles(str(smi or "").strip())
        if mol is None:
            return None
        mols.append(mol)

    products: set[str] = set()
    any_valid = False
    for smarts in (step.forward_smarts, *step.alt_smarts):
        got = _run_one_smarts(smarts, mols)
        if got is None:
            continue
        any_valid = True
        products |= got
    if not any_valid:
        return None
    return products


@dataclass(frozen=True)
class ElementaryStep:
    """One named elementary step a mechanism may invoke.

    forward_smarts transforms the principal species (plus extra_reactants)
    into the next intermediate. moves describes the electron movement in
    words, for the learner. abstracts records what the model leaves out, so
    nobody mistakes the teaching model for the full picture.
    extra_reactants are medium species the step consumes, as SMILES.

    alt_smarts carries additional templates for the same step when RDKit's
    hydrogen bookkeeping forces the H counts to be written explicitly (a
    hydride shift moves one H, and reaction SMARTS cannot say "one less H
    than before" except by enumerating the counts). Products are the union
    over all templates. RDKit also carries a reactant atom's CHARGE into the
    product unless the product template resets it, which is why every product
    atom that changes charge writes the new charge explicitly; the verifier
    caught the first draft of this library on exactly that.
    """

    name: str
    forward_smarts: str
    moves: str
    abstracts: str = ""
    extra_reactants: tuple[str, ...] = ()
    alt_smarts: tuple[str, ...] = ()


@dataclass(frozen=True)
class MechanismItem:
    node: str
    start: str  # SMILES of the principal starting species
    steps_menu: tuple[ElementaryStep, ...]
    # The intended answer: the ordered steps and the intermediate each
    # produces, ending in the product. Stored so the item verifier can confirm
    # the item is answerable. Grading never requires the learner to match this
    # path; it requires each of their steps to fire and their final species to
    # be the product.
    key_path: tuple[tuple[str, str], ...] = ()  # (step name, intermediate SMILES)
    product: str = ""
    prompt: str = ""
    source: str = ""
    # Known wrong final products with the belief each one names, so a
    # coherent path to the wrong product is diagnosed rather than just failed.
    wrong_products: tuple[tuple[str, str], ...] = ()  # (SMILES, misconception code)

    def step(self, name: str) -> ElementaryStep | None:
        return next((s for s in self.steps_menu if s.name == name), None)


def grade_mechanism(item: MechanismItem, path: list[dict]) -> GradeResult:
    """Grade a proposed mechanism path.

    path is a list of {"step": name, "intermediate": SMILES}. Each step is
    checked by running its forward reaction on the current species; the claimed
    intermediate must be among the products. Milestones record every step, and
    the first failure is the localization the learner is shown.
    """
    if not isinstance(path, list) or not path:
        return GradeResult.ungradable(
            "mechanism", "Give the mechanism as an ordered list of steps."
        )
    if len(path) > MAX_STEPS:
        return GradeResult.ungradable(
            "mechanism", f"A mechanism here has at most {MAX_STEPS} steps."
        )

    target = canonical(item.product, keep_stereo=False)
    if target is None:
        return GradeResult.ungradable(
            "mechanism", "This item's product is not a readable structure."
        )

    current = canonical(item.start, keep_stereo=False)
    if current is None:
        return GradeResult.ungradable(
            "mechanism", "This item's starting material is not a readable structure."
        )

    milestones: list[dict] = []
    for i, entry in enumerate(path, start=1):
        if not isinstance(entry, dict):
            return GradeResult.ungradable(
                "mechanism", f"Step {i} is not a step object."
            )
        step_name = str(entry.get("step", "") or "")
        claimed = str(entry.get("intermediate", "") or "")
        if len(claimed) > MAX_SMILES_CHARS:
            return GradeResult.ungradable(
                "mechanism", f"Step {i}'s structure is too long to read."
            )

        step = item.step(step_name)
        if step is None:
            names = ", ".join(s.name for s in item.steps_menu)
            milestones.append({
                "step": i, "ok": False,
                "detail": f"'{step_name}' is not one of the offered steps: {names}.",
            })
            return GradeResult(
                is_correct=False, score=0.0, grader="mechanism",
                detail=f"Step {i}: '{step_name}' is not one of the offered steps.",
                milestones=milestones,
            )

        claimed_canonical = canonical(claimed, keep_stereo=False)
        if claimed_canonical is None:
            milestones.append({
                "step": i, "ok": False,
                "detail": "The structure given for this step is not readable.",
            })
            return GradeResult(
                is_correct=False, score=0.0, graded=False, grader="mechanism",
                detail=f"Step {i}: that intermediate is not a readable structure.",
                milestones=milestones,
            )

        products = _run_step(step, [current, *step.extra_reactants])
        if products is None:
            milestones.append({
                "step": i, "ok": False,
                "detail": "This step could not be processed.",
            })
            return GradeResult.ungradable(
                "mechanism", f"Step {i} could not be processed."
            )

        canonical_products = {canonical(p, keep_stereo=False) for p in products}
        canonical_products.discard(None)

        if claimed_canonical not in canonical_products:
            if not canonical_products:
                detail = (
                    f"{step.name} does not fire on this species: the electrons "
                    f"it moves ({step.moves}) have nowhere to go here."
                )
            else:
                detail = (
                    f"{step.name} does fire here, but it does not produce the "
                    "structure you drew. Follow the electron movement "
                    f"({step.moves}) and write the species it actually leaves."
                )
            milestones.append({"step": i, "ok": False, "detail": detail})
            score = (i - 1) / max(1, len(path))
            return GradeResult(
                is_correct=False, score=round(score, 2), grader="mechanism",
                detail=f"Step {i}: {detail}", milestones=milestones,
            )

        milestones.append({
            "step": i, "ok": True,
            "detail": f"{step.name}: {step.moves}",
        })
        current = claimed_canonical

    if current == target:
        return GradeResult(
            is_correct=True, score=1.0, grader="mechanism",
            detail="Correct. Every step fires and the path ends at the product.",
            milestones=milestones,
        )

    # Every step fired, but the path ends somewhere else. Diagnose a known
    # wrong product where one is recorded, because a mechanistically coherent
    # path to the wrong regiochemistry is the instructive near miss here.
    for wrong_smiles, code in item.wrong_products:
        if current == canonical(wrong_smiles, keep_stereo=False):
            return GradeResult(
                is_correct=False, score=0.5, grader="mechanism",
                detail=(
                    "Every step you drew fires, but the path ends at a "
                    "different product than the one asked for. Compare the "
                    "stability of the intermediates your path goes through "
                    "against the alternative at the branching step."
                ),
                misconception=code,
                milestones=milestones,
            )
    return GradeResult(
        is_correct=False, score=0.5, grader="mechanism",
        detail=(
            "Every step you drew fires, but the final species is not the "
            "product this item asks for."
        ),
        milestones=milestones,
    )


def verify_mechanism_item(item: MechanismItem) -> VerifierResult:
    """The item's own key path must build its own product, checked twice over.

    Path one is the grading machinery itself: each key step must fire and
    produce the stored intermediate. Path two is independent of RunReactants:
    every stored intermediate must agree with the reachable product by
    InChIKey (a separately developed canonicalization), and heavy atoms must
    balance across every step by direct counting, with each step's declared
    extra reactants accounted for. An item that cannot pass both is not
    answerable and must not be served.
    """
    if not item.key_path:
        return VerifierResult(ok=False, method="mechanism-key-path", detail="no key path stored")

    target = canonical(item.product, keep_stereo=False)
    if target is None:
        return VerifierResult(ok=False, method="mechanism-key-path", detail="product unreadable")

    current = canonical(item.start, keep_stereo=False)
    if current is None:
        return VerifierResult(ok=False, method="mechanism-key-path", detail="start unreadable")

    for i, (step_name, intermediate) in enumerate(item.key_path, start=1):
        step = item.step(step_name)
        if step is None:
            return VerifierResult(
                ok=False, method="mechanism-key-path",
                detail=f"key step {i} '{step_name}' is not in the menu",
            )

        # Path one: the step must fire and reach the stored intermediate.
        products = _run_step(step, [current, *step.extra_reactants])
        if not products:
            return VerifierResult(
                ok=False, method="mechanism-key-path",
                detail=f"key step {i} '{step_name}' does not fire",
            )
        stored = canonical(intermediate, keep_stereo=False)
        canonical_products = {canonical(p, keep_stereo=False) for p in products}
        canonical_products.discard(None)
        if stored not in canonical_products:
            return VerifierResult(
                ok=False, method="mechanism-key-path",
                detail=f"key step {i} does not produce the stored intermediate",
            )

        # Path two, identity: the stored intermediate must match a reachable
        # product under InChIKey as well, so an intermediate that only matches
        # under one canonicalization is refused.
        stored_ik = _inchikey(intermediate)
        product_iks = {_inchikey(p) for p in products}
        product_iks.discard(None)
        if stored_ik is None or stored_ik not in product_iks:
            return VerifierResult(
                ok=False, method="mechanism-inchikey",
                detail=f"key step {i}: InChIKey disagreement on the intermediate",
            )

        # Path two, conservation: heavy atoms in = heavy atoms out, with the
        # step's declared extra reactants on the input side. A step whose
        # SMARTS quietly drops or invents a heavy atom fails here even when
        # RunReactants is happy with it.
        before = _heavy_atoms(current)
        for extra in step.extra_reactants:
            extra_counts = _heavy_atoms(extra)
            if before is None or extra_counts is None:
                return VerifierResult(
                    ok=False, method="mechanism-conservation",
                    detail=f"key step {i}: unreadable species in conservation check",
                )
            before = _add_counts(before, extra_counts)
        after = _heavy_atoms(intermediate)
        if before is None or after is None or before != after:
            return VerifierResult(
                ok=False, method="mechanism-conservation",
                detail=f"key step {i}: heavy atoms do not balance",
            )

        current = stored

    if current != target:
        return VerifierResult(
            ok=False, method="mechanism-key-path",
            detail="key path does not end at the product",
        )
    if _inchikey(item.key_path[-1][1]) != _inchikey(item.product):
        return VerifierResult(
            ok=False, method="mechanism-inchikey",
            detail="final intermediate and product disagree under InChIKey",
        )
    return VerifierResult(
        ok=True, method="mechanism-key-path+inchikey+conservation",
        detail="key path fires end to end; identity and conservation hold at every step",
    )


# ---------------------------------------------------------------------------
# The elementary step library for electrophilic addition of HX.
#
# Deliberately simplified models, as the retro library's forward reactions
# are. Each entry records what it abstracts away. Reviewed data, not code:
# chemistry facts stay in data structures a reviewer can read.
# ---------------------------------------------------------------------------

STEP_LIBRARY: dict[str, ElementaryStep] = {
    "protonate_alkene": ElementaryStep(
        name="protonate_alkene",
        # Both regiochemical outcomes are real products of this step; the
        # mapping produces each, and the choice between them is the learning.
        # The proton lands with an explicit H-count increment on the carbon
        # that takes it, enumerated over the counts an alkene carbon can have.
        forward_smarts="[CH2:1]=[C:2]>>[CH3:1][C+:2]",
        alt_smarts=(
            "[CH1:1]=[C:2]>>[CH2:1][C+:2]",
            "[CH0:1]=[C:2]>>[CH1:1][C+:2]",
        ),
        moves="the pi bond takes the acid's proton, leaving a carbocation on the other carbon",
        abstracts=(
            "The proton source is drawn as bare H+; the acid and its conjugate "
            "base are not tracked."
        ),
    ),
    "halide_attack": ElementaryStep(
        name="halide_attack",
        forward_smarts="[C+:1].[Br-:2]>>[C+0:1][Br+0:2]",
        moves="a lone pair on the halide attacks the empty p orbital of the carbocation",
        abstracts="The halide is drawn as a free ion; ion pairing is not modelled.",
        extra_reactants=("[Br-]",),
    ),
    "hydride_shift": ElementaryStep(
        name="hydride_shift",
        # One H migrates with its bonding pair. Reaction SMARTS cannot say
        # "one less H than before", so the counts are enumerated.
        forward_smarts="[CH1:1][C+;H0:2]>>[C+;H0:1][C+0;H1:2]",
        alt_smarts=tuple(
            f"[CH{h}:1][C+;H{k}:2]>>[C+;H{h - 1}:1][C+0;H{k + 1}:2]"
            for h in (1, 2, 3)
            for k in (0, 1, 2)
            if not (h == 1 and k == 0)
        ),
        moves="a hydrogen with its bonding pair migrates to the adjacent cationic carbon",
        abstracts="Drawn as a single concerted migration; no protonated intermediate.",
    ),
    "water_attack": ElementaryStep(
        name="water_attack",
        forward_smarts="[C+:1].[OH2:2]>>[C+0:1][O+:2]",
        moves="a lone pair on water attacks the empty p orbital of the carbocation",
        abstracts="Solvent shell not modelled; one explicit water molecule.",
        extra_reactants=("O",),
    ),
    "deprotonate_oxocarbenium": ElementaryStep(
        name="deprotonate_oxocarbenium",
        forward_smarts="[OH2+:1]>>[OH+0:1]",
        moves="a base removes a proton from the positively charged oxygen",
        abstracts="The base is not tracked; drawn as loss of H+ from oxygen.",
    ),
}
