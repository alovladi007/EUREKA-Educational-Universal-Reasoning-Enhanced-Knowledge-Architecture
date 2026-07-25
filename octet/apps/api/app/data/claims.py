"""Checkable chemical claims attached to authored lessons.

A lesson is prose, and prose cannot be verified. So any chemical fact a lesson
asserts must also appear here in a form a machine can re-derive from structure,
and the compliance checker fails the build when a claim does not hold.

The rule this enforces is narrow and worth stating exactly: it does not prove a
lesson is correct. It proves that the specific facts the lesson chose to make
checkable are correct. An author who writes a wrong claim in prose and omits it
here has defeated the check, which is why the authoring guidance is that every
stereochemical assignment, degree of unsaturation, formula, isomer
relationship, and proton count stated in a lesson gets a claim beside it.

Why this exists at all: the author of ORG1 is a language model, and while
building the verifiers underneath this file that same model asserted three
textbook organic facts from memory and got all three wrong. None of the three
would have looked wrong on review. Derivation catches what reading does not.

Claims deliberately cover only what RDKit can settle from a structure. Chemical
shifts, splitting patterns, reaction rates and whether a transformation
proceeds under given conditions are not claimable here, because a check that
quietly passed on those would be worse than no check. Those facts carry a
Source instead, and the checker requires one.
"""

from __future__ import annotations

from dataclasses import dataclass

from chem_core.organic import (
    are_diastereomers,
    are_enantiomers,
    proton_environments,
    verify_stereo_claim,
    verify_unsaturation_claim,
)
from chem_core.structure import canonical, formula_of
from chem_core.types import VerifierResult


@dataclass(frozen=True)
class Stereo:
    """This structure has these CIP descriptors, in atom index order."""

    smiles: str
    descriptors: tuple[str, ...]
    note: str = ""

    def check(self) -> VerifierResult:
        return verify_stereo_claim(self.smiles, list(self.descriptors))


@dataclass(frozen=True)
class Unsaturation:
    """This structure has this many degrees of unsaturation."""

    smiles: str
    degrees: int
    note: str = ""

    def check(self) -> VerifierResult:
        return verify_unsaturation_claim(self.smiles, self.degrees)


@dataclass(frozen=True)
class Formula:
    """This structure has this molecular formula."""

    smiles: str
    formula: str
    note: str = ""

    def check(self) -> VerifierResult:
        derived = formula_of(self.smiles)
        if derived is None:
            return VerifierResult(False, "formula", f"could not read {self.smiles}")
        if derived.replace(" ", "") != self.formula.replace(" ", ""):
            return VerifierResult(
                False, "formula", f"structure is {derived}, the lesson says {self.formula}"
            )
        return VerifierResult(True, "formula", derived)


@dataclass(frozen=True)
class Relationship:
    """Two structures stand in this stereochemical relationship.

    kind is one of enantiomers, diastereomers, identical, constitutional.

    identical is included because it is the answer learners least expect and
    authors most often get wrong: two different-looking SMILES for a meso
    compound are one molecule, not a pair.
    """

    a: str
    b: str
    kind: str
    note: str = ""

    KINDS = ("enantiomers", "diastereomers", "identical", "constitutional")

    def check(self) -> VerifierResult:
        if self.kind not in self.KINDS:
            return VerifierResult(
                False, "relationship", f"{self.kind} is not one of {self.KINDS}"
            )
        ca, cb = canonical(self.a), canonical(self.b)
        if ca is None or cb is None:
            return VerifierResult(False, "relationship", "a structure could not be read")

        flat_a = canonical(self.a, keep_stereo=False)
        flat_b = canonical(self.b, keep_stereo=False)

        if self.kind == "identical":
            if ca != cb:
                return VerifierResult(
                    False, "relationship", "these are not the same compound"
                )
            return VerifierResult(True, "relationship", "identical")

        if self.kind == "constitutional":
            if flat_a == flat_b:
                return VerifierResult(
                    False,
                    "relationship",
                    "same constitution, so these are stereoisomers not "
                    "constitutional isomers",
                )
            if formula_of(self.a) != formula_of(self.b):
                return VerifierResult(
                    False, "relationship", "different molecular formulas, so not isomers"
                )
            return VerifierResult(True, "relationship", "constitutional isomers")

        if ca == cb:
            return VerifierResult(
                False,
                "relationship",
                f"these are the same compound, so they cannot be {self.kind}",
            )

        if self.kind == "enantiomers":
            verdict = are_enantiomers(self.a, self.b)
        else:
            verdict = are_diastereomers(self.a, self.b)
        if verdict is None:
            return VerifierResult(
                False, "relationship", "an unassigned stereocentre leaves this undecided"
            )
        if not verdict:
            return VerifierResult(False, "relationship", f"these are not {self.kind}")
        return VerifierResult(True, "relationship", self.kind)


@dataclass(frozen=True)
class Environments:
    """This structure gives this many distinct proton signals, in this ratio.

    ratio is largest first, matching what the symmetry calculation returns. A
    lesson that states an integration ratio states it here too.
    """

    smiles: str
    ratio: tuple[int, ...]
    note: str = ""

    def check(self) -> VerifierResult:
        derived = proton_environments(self.smiles)
        if derived is None:
            return VerifierResult(False, "environments", f"could not read {self.smiles}")
        if list(self.ratio) != derived:
            return VerifierResult(
                False,
                "environments",
                f"symmetry gives {':'.join(map(str, derived))}, the lesson says "
                f"{':'.join(map(str, self.ratio))}",
            )
        return VerifierResult(True, "environments", ":".join(map(str, derived)))


@dataclass(frozen=True)
class Source:
    """A fact this system cannot derive, carried with its citation.

    Chemical shifts, IR bands, pKa values, reaction conditions. The checker
    cannot confirm the number, so it confirms that somebody is accountable for
    it. An empty citation fails.
    """

    statement: str
    citation: str

    def check(self) -> VerifierResult:
        if not self.citation.strip():
            return VerifierResult(
                False, "source", f"no citation for: {self.statement[:80]}"
            )
        if not self.statement.strip():
            return VerifierResult(False, "source", "empty statement")
        return VerifierResult(
            True, "source", "cited, not derived; the number itself is unchecked"
        )


Claim = Stereo | Unsaturation | Formula | Relationship | Environments | Source


def check_all(claims: tuple[Claim, ...]) -> list[tuple[Claim, VerifierResult]]:
    """Check every claim, returning failures alongside what failed."""
    return [(c, c.check()) for c in claims]


def failures(claims: tuple[Claim, ...]) -> list[tuple[Claim, VerifierResult]]:
    return [(c, r) for c, r in check_all(claims) if not r.ok]
