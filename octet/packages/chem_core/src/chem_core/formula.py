"""Grader 1: molecular and empirical formula.

Grading path: parse the submission into an element multiset plus net charge,
compare against the stored key's multiset.

Independent verification path: derive the formula from the item's structure
(SMILES) with RDKit and require agreement with the stored key. The parser and
RDKit share no code, so a bug in the parser cannot validate itself.

Element masses come from the periodictable library. Per the coding standard we
do not hand roll molar masses.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

from ._safe import MAX_FORMULA_TERMS, InputTooLarge, check_size
from .types import GradeResult, VerifierResult

# Hydrate separators seen in real textbooks. The middle dot is data, not prose,
# so it is allowed here despite the house style rule on punctuation.
_HYDRATE_SEPARATORS = ("·", "•", "*", ".")

_TOKEN = re.compile(r"([A-Z][a-z]?)(\d*)|(\()|(\))(\d*)")
_CHARGE = re.compile(r"\^?(\d*)([+-])$")


@dataclass(frozen=True)
class Formula:
    """A parsed formula: element counts plus net charge."""

    counts: dict[str, int]
    charge: int = 0

    def hill(self) -> str:
        """Hill notation: carbon, then hydrogen, then the rest alphabetical."""
        keys = sorted(self.counts)
        ordered: list[str] = []
        if "C" in self.counts:
            ordered.append("C")
            if "H" in self.counts:
                ordered.append("H")
            ordered.extend(k for k in keys if k not in ("C", "H"))
        else:
            ordered.extend(keys)
        out = ""
        for el in ordered:
            n = self.counts[el]
            out += el + (str(n) if n != 1 else "")
        if self.charge:
            mag = abs(self.charge)
            out += "^" + (str(mag) if mag != 1 else "") + ("+" if self.charge > 0 else "-")
        return out

    def molar_mass(self) -> float:
        """Grams per mole from the periodictable library."""
        import periodictable

        total = 0.0
        for el, n in self.counts.items():
            total += getattr(periodictable, el).mass * n
        return total


class FormulaParseError(ValueError):
    """The submission is not a readable formula."""


def parse_formula(text: str) -> Formula:
    """Parse a formula string into element counts and net charge.

    Handles nested parentheses, hydrates (CuSO4.5H2O), and trailing charge
    notation (SO4^2-, Fe^3+, OH-). Raises FormulaParseError on anything it
    cannot read; callers turn that into GradeResult.ungradable.
    """
    if text is None:
        raise FormulaParseError("empty formula")
    try:
        raw = check_size(str(text)).strip().replace(" ", "")
    except InputTooLarge as exc:
        raise FormulaParseError(str(exc)) from exc
    if not raw:
        raise FormulaParseError("empty formula")

    charge = 0
    m = _CHARGE.search(raw)
    if m:
        magnitude = int(m.group(1)) if m.group(1) else 1
        charge = magnitude if m.group(2) == "+" else -magnitude
        raw = raw[: m.start()]
    if not raw:
        raise FormulaParseError("charge given with no formula")

    # Split hydrates on the first separator that appears between digits and a
    # capital letter, for example CuSO4.5H2O.
    parts = [raw]
    for sep in _HYDRATE_SEPARATORS:
        if sep in raw:
            candidate = [p for p in raw.split(sep) if p]
            if len(candidate) > 1:
                parts = candidate
                break

    total: dict[str, int] = {}
    for part in parts:
        lead = re.match(r"^(\d+)", part)
        multiplier = 1
        if lead:
            multiplier = int(lead.group(1))
            part = part[lead.end() :]
            if multiplier <= 0:
                raise FormulaParseError("hydrate multiplier must be positive")
        for el, n in _parse_group(part).items():
            total[el] = total.get(el, 0) + n * multiplier

    if not total:
        raise FormulaParseError("no elements found")
    if len(total) > MAX_FORMULA_TERMS:
        raise FormulaParseError("too many distinct elements")
    return Formula(counts=total, charge=charge)


def _parse_group(text: str) -> dict[str, int]:
    """Recursive descent over one formula segment using an explicit stack."""
    import periodictable

    stack: list[dict[str, int]] = [{}]
    i = 0
    n = len(text)
    while i < n:
        ch = text[i]
        if ch == "(":
            stack.append({})
            i += 1
            continue
        if ch == ")":
            if len(stack) == 1:
                raise FormulaParseError("unbalanced parenthesis")
            group = stack.pop()
            i += 1
            digits = ""
            while i < n and text[i].isdigit():
                digits += text[i]
                i += 1
            mult = int(digits) if digits else 1
            if mult <= 0:
                raise FormulaParseError("group subscript must be positive")
            for el, cnt in group.items():
                stack[-1][el] = stack[-1].get(el, 0) + cnt * mult
            continue
        m = re.match(r"([A-Z][a-z]?)(\d*)", text[i:])
        if not m:
            raise FormulaParseError(f"unreadable character at position {i}: {ch!r}")
        symbol, digits = m.group(1), m.group(2)
        if not hasattr(periodictable, symbol):
            raise FormulaParseError(f"unknown element symbol: {symbol}")
        count = int(digits) if digits else 1
        if count <= 0:
            raise FormulaParseError("subscript must be positive")
        stack[-1][symbol] = stack[-1].get(symbol, 0) + count
        i += m.end()
    if len(stack) != 1:
        raise FormulaParseError("unbalanced parenthesis")
    return stack[0]


def empirical(counts: dict[str, int]) -> dict[str, int]:
    """Reduce a molecular formula to its empirical formula."""
    from math import gcd

    if not counts:
        return {}
    divisor = 0
    for n in counts.values():
        divisor = gcd(divisor, n)
    if divisor <= 1:
        return dict(counts)
    return {el: n // divisor for el, n in counts.items()}


def grade_formula(
    key: str,
    student_answer: str,
    *,
    mode: str = "molecular",
    require_charge: bool = True,
) -> GradeResult:
    """Grade a formula submission against the stored key.

    mode: "molecular" requires exact counts, "empirical" compares the reduced
    ratio so C6H12O6 and CH2O both satisfy an empirical key.
    """
    grader = "formula"
    try:
        key_f = parse_formula(key)
    except FormulaParseError as exc:
        # A bad key is an authoring bug, not a learner error. Fail closed.
        return GradeResult.ungradable(grader, f"item key is not a valid formula: {exc}")

    try:
        got = parse_formula(student_answer)
    except FormulaParseError as exc:
        return GradeResult.ungradable(
            grader,
            f"That is not a readable formula ({exc}). Write element symbols with "
            "subscripts, for example H2O or Ca(OH)2.",
        )

    key_counts = empirical(key_f.counts) if mode == "empirical" else key_f.counts
    got_counts = empirical(got.counts) if mode == "empirical" else got.counts

    counts_match = key_counts == got_counts
    charge_match = (not require_charge) or (key_f.charge == got.charge)

    if counts_match and charge_match:
        return GradeResult(
            is_correct=True,
            score=1.0,
            grader=grader,
            detail="Correct.",
            correct_display=key_f.hill(),
        )

    # Diagnose the belief behind the error rather than restating the answer.
    misconception = None
    detail = "Not correct yet."
    if counts_match and not charge_match:
        misconception = "CHG-OMIT"
        detail = (
            "The atom counts are right but the net charge is not. A polyatomic "
            "ion carries charge, and the charge is part of its identity."
        )
    elif mode == "molecular" and empirical(key_f.counts) == empirical(got.counts):
        misconception = "EMP-MOL"
        detail = (
            "You have the correct ratio of elements but not the correct molecule "
            "size. Consider the difference between an empirical formula and a "
            "molecular formula."
        )
    else:
        missing = sorted(set(key_counts) - set(got_counts))
        extra = sorted(set(got_counts) - set(key_counts))
        if missing:
            detail = f"Your formula has no {', '.join(missing)}. Check the composition again."
        elif extra:
            detail = f"Your formula includes {', '.join(extra)}, which is not in this species."
        else:
            differing = [el for el in key_counts if key_counts[el] != got_counts.get(el)]
            if differing:
                misconception = "SUB-COEF"
                detail = (
                    f"The number of {differing[0]} atoms is not right. A subscript "
                    "counts atoms inside one unit, a coefficient counts units."
                )
    return GradeResult(
        is_correct=False,
        score=0.0,
        grader=grader,
        detail=detail,
        misconception=misconception,
        correct_display=key_f.hill(),
    )


def verify_formula_key(key: str, smiles: str) -> VerifierResult:
    """Independent check: RDKit derives the formula from the structure.

    This never touches parse_formula's tokenizer, so the two paths are truly
    independent. If RDKit is unavailable the verifier fails closed. It does not
    fabricate a pass.
    """
    try:
        from rdkit import Chem, RDLogger
        from rdkit.Chem import rdMolDescriptors
    except ImportError:
        return VerifierResult(
            ok=False, method="rdkit-formula", detail="RDKit is not installed"
        )

    RDLogger.DisableLog("rdApp.*")
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return VerifierResult(
            ok=False, method="rdkit-formula", detail=f"RDKit rejected SMILES: {smiles}"
        )
    rd_formula = rdMolDescriptors.CalcMolFormula(mol)

    try:
        expected = parse_formula(key)
        derived = parse_formula(rd_formula)
    except FormulaParseError as exc:
        return VerifierResult(ok=False, method="rdkit-formula", detail=str(exc))

    if expected.counts != derived.counts:
        return VerifierResult(
            ok=False,
            method="rdkit-formula",
            detail=f"key {key} disagrees with RDKit formula {rd_formula}",
        )
    if expected.charge != derived.charge:
        return VerifierResult(
            ok=False,
            method="rdkit-formula",
            detail=f"charge mismatch: key {expected.charge}, RDKit {derived.charge}",
        )
    return VerifierResult(ok=True, method="rdkit-formula", detail=rd_formula)


def verify_molar_mass(counts: dict[str, int], claimed: float, *, rel_tol: float = 1e-3) -> VerifierResult:
    """Independent check on a molar mass claim.

    The generator sums per element masses. This verifier rebuilds the mass from
    the periodictable formula parser, a different code path in that library.
    """
    try:
        import periodictable
    except ImportError:
        return VerifierResult(ok=False, method="periodictable", detail="library missing")

    pieces = "".join(f"{el}{n}" for el, n in sorted(counts.items()))
    try:
        independent = periodictable.formula(pieces).mass
    except Exception as exc:  # library raises a variety of types
        return VerifierResult(ok=False, method="periodictable", detail=str(exc))
    if independent <= 0:
        return VerifierResult(ok=False, method="periodictable", detail="non-positive mass")
    if abs(independent - claimed) / independent > rel_tol:
        return VerifierResult(
            ok=False,
            method="periodictable",
            detail=f"claimed {claimed}, independent {independent}",
        )
    return VerifierResult(ok=True, method="periodictable", detail=f"{independent:.4f} g/mol")
