"""Grader 10: structure elucidation from spectral data.

The learner is given a molecular formula and a set of spectral observations,
and proposes a structure. Grading compares their structure to the key by
canonical SMILES, which is the same identity test grader 4 uses.

The verifier does something different, and the difference is the point. It
never looks at the learner's answer. It takes the item's stated data and the
item's own key and asks whether the data actually determines that key: does the
formula match the key's formula, does the degree of unsaturation follow, does
the proton count and integration ratio match what the key's symmetry produces.

That makes it a check on the item author rather than on the learner. An
elucidation item whose data does not fit its own answer is unanswerable, and a
learner who reasons correctly from that data will be marked wrong. Since the
author here is a language model with a demonstrated ability to state organic
facts fluently and incorrectly, an item level check is not optional.

What this module does not do: predict chemical shifts, predict splitting, or
decide whether an IR band appears where an item says it does. Those claims are
carried on the item as authored text with a citation requirement, and they are
not machine checked. Anything asserting a shift without a source should not
ship.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from .organic import degrees_of_unsaturation, proton_environments
from .structure import canonical
from .types import GradeResult, VerifierResult


@dataclass(frozen=True)
class Signal:
    """One proton environment as an item reports it.

    shift and multiplicity are authored strings carried for display. They are
    not derived and not checked; only protons participates in verification.
    """

    protons: int
    shift: str = ""
    multiplicity: str = ""
    note: str = ""


@dataclass(frozen=True)
class SpectrumItem:
    node: str
    formula: str
    answer: str  # SMILES of the intended structure
    signals: tuple[Signal, ...] = ()
    ir_bands: tuple[str, ...] = ()
    prompt: str = ""
    source: str = ""  # required when any shift or IR claim is authored
    hints: tuple[str, ...] = ()

    @property
    def total_protons(self) -> int:
        return sum(s.protons for s in self.signals)

    @property
    def ratio(self) -> list[int]:
        return sorted((s.protons for s in self.signals), reverse=True)


def grade_spectrum(item: SpectrumItem, submitted: str) -> GradeResult:
    """Compare the proposed structure to the key.

    A constitutional isomer is a distinct and interesting kind of wrong here:
    it means the learner produced something with the right formula that does
    not fit the data, which is the characteristic failure of elucidation and
    worth routing differently from an unparseable answer.
    """
    proposed = canonical(submitted, keep_stereo=False)
    key = canonical(item.answer, keep_stereo=False)

    if proposed is None:
        return GradeResult.ungradable(
            "spectrum", "That structure could not be read as a valid molecule."
        )
    if key is None:  # an item this broken must not be graded against
        return GradeResult.ungradable(
            "spectrum", "This item's answer key is not a readable structure."
        )

    if proposed == key:
        return GradeResult(is_correct=True, score=1.0, grader="spectrum")

    # Right formula, wrong connectivity: the learner satisfied the count but
    # not the evidence.
    proposed_env = proton_environments(submitted)
    key_env = proton_environments(item.answer)
    same_formula = _formula_of(submitted) == _formula_of(item.answer)

    if same_formula:
        detail = ""
        if proposed_env is not None and key_env is not None:
            detail = (
                f" Your structure would give {len(proposed_env)} proton "
                f"environment(s) in ratio {':'.join(str(n) for n in proposed_env)}, "
                f"and the data reports {len(item.signals)} in ratio "
                f"{':'.join(str(n) for n in item.ratio)}."
            )
        return GradeResult(
            is_correct=False,
            score=0.25,
            grader="spectrum",
            misconception="ISOMER-INCONSISTENT-WITH-DATA",
            detail=(
                "That is an isomer with the right molecular formula, but it "
                "does not fit the spectrum." + detail
            ),
        )

    return GradeResult(
        is_correct=False,
        score=0.0,
        grader="spectrum",
        misconception="WRONG-FORMULA",
        detail=(
            f"That structure is {_formula_of(submitted)}, and the problem "
            f"states {item.formula}."
        ),
    )


def _formula_of(smiles: str) -> str | None:
    from rdkit import Chem, RDLogger
    from rdkit.Chem import rdMolDescriptors

    RDLogger.DisableLog("rdApp.*")
    mol = Chem.MolFromSmiles(str(smiles or "").strip())
    if mol is None:
        return None
    return rdMolDescriptors.CalcMolFormula(mol)


def verify_spectrum_item(item: SpectrumItem) -> VerifierResult:
    """Check that the item's data actually determines its own key.

    Independent of grading: the learner's answer plays no part. Every check
    here re-derives from the structure and compares against what the item
    claims, so a mismatch means the item is wrong rather than the learner.
    """
    problems: list[str] = []

    key_formula = _formula_of(item.answer)
    if key_formula is None:
        return VerifierResult(False, "spectrum-item", "the answer key is not readable")

    stated = item.formula.replace(" ", "")
    if key_formula != stated:
        problems.append(
            f"the key is {key_formula} but the item states {stated}"
        )

    # Degrees of unsaturation must follow from the stated formula.
    dou = degrees_of_unsaturation(stated)
    key_dou = degrees_of_unsaturation(key_formula)
    if dou is None or key_dou is None:
        problems.append("degrees of unsaturation could not be computed")
    elif dou != key_dou:
        problems.append(f"unsaturation disagrees: {dou} from the item, {key_dou} from the key")

    # The reported signals must match the symmetry of the key.
    environments = proton_environments(item.answer)
    if environments is None:
        problems.append("proton environments could not be derived from the key")
    elif item.signals:
        if len(environments) != len(item.signals):
            problems.append(
                f"the key has {len(environments)} proton environment(s) in ratio "
                f"{':'.join(str(n) for n in environments)}, but the item lists "
                f"{len(item.signals)} signal(s)"
            )
        elif environments != item.ratio:
            problems.append(
                f"the key's integration ratio is "
                f"{':'.join(str(n) for n in environments)}, but the item reports "
                f"{':'.join(str(n) for n in item.ratio)}"
            )
        if sum(environments) != item.total_protons:
            problems.append(
                f"the key has {sum(environments)} hydrogen(s), the item's signals "
                f"total {item.total_protons}"
            )

    # An authored shift or IR claim is not machine checkable, so it carries a
    # source requirement instead. This is the one place the module admits what
    # it cannot verify rather than passing silently.
    asserts_unverifiable = any(s.shift or s.multiplicity for s in item.signals) or bool(
        item.ir_bands
    )
    if asserts_unverifiable and not item.source.strip():
        problems.append(
            "the item states chemical shifts or IR bands, which this verifier "
            "cannot check, and carries no source for them"
        )

    if problems:
        return VerifierResult(False, "spectrum-item", "; ".join(problems))
    return VerifierResult(
        True,
        "spectrum-item",
        f"{key_formula}, {len(environments)} environment(s), ratio "
        f"{':'.join(str(n) for n in environments)}"
        + ("; shifts and IR bands are authored and unchecked" if asserts_unverifiable else ""),
    )


def verify_bank(items: list[SpectrumItem]) -> list[tuple[str, VerifierResult]]:
    """Verify a whole bank, returning every failure rather than the first."""
    return [(i.node, verify_spectrum_item(i)) for i in items]
