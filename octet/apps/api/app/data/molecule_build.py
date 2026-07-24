"""Derive molecule properties from structure, never from hand typed values.

Every formula, molar mass, canonical SMILES and InChIKey in OCTET comes from
RDKit reading the authored SMILES. The library file carries no formula field
at all, so there is nothing for a typo to disagree with.

validate_library() is a CI gate. It fails when:
  - RDKit cannot parse a SMILES
  - two entries collide on InChIKey (the same molecule listed twice)
  - a molecule declares a category outside the vocabulary
  - an entry has no real world note (the build prompt requires real molecule
    framing everywhere, and an empty note means an item would say compound X)
"""

from __future__ import annotations

from dataclasses import dataclass

from app.data.molecules import CATEGORIES, MOLECULES, MoleculeEntry


@dataclass(frozen=True)
class BuiltMolecule:
    name: str
    smiles_canonical: str
    inchikey: str
    formula: str
    molar_mass: float
    category: str
    real_world_note: str
    safety_flags: tuple[str, ...]
    review: str


def build_one(entry: MoleculeEntry) -> BuiltMolecule | None:
    """Return the derived record, or None when RDKit rejects the structure."""
    from rdkit import Chem, RDLogger
    from rdkit.Chem import Descriptors, rdMolDescriptors

    RDLogger.DisableLog("rdApp.*")
    mol = Chem.MolFromSmiles(entry.smiles)
    if mol is None:
        return None
    return BuiltMolecule(
        name=entry.name,
        smiles_canonical=Chem.MolToSmiles(mol),
        inchikey=Chem.MolToInchiKey(mol),
        formula=rdMolDescriptors.CalcMolFormula(mol),
        molar_mass=round(Descriptors.MolWt(mol), 4),
        category=entry.category,
        real_world_note=entry.real_world_note,
        safety_flags=entry.safety_flags,
        review=entry.review,
    )


def build_library() -> tuple[list[BuiltMolecule], list[dict]]:
    """Build every entry. Returns (built, problems)."""
    built: list[BuiltMolecule] = []
    problems: list[dict] = []
    seen_inchikey: dict[str, str] = {}
    seen_name: set[str] = set()

    for entry in MOLECULES:
        if entry.name in seen_name:
            problems.append({"name": entry.name, "problem": "duplicate name"})
            continue
        seen_name.add(entry.name)

        if entry.category not in CATEGORIES:
            problems.append({"name": entry.name, "problem": f"unknown category {entry.category}"})
        if not entry.real_world_note.strip():
            problems.append({"name": entry.name, "problem": "no real_world_note"})

        record = build_one(entry)
        if record is None:
            problems.append({"name": entry.name, "problem": f"RDKit rejected SMILES {entry.smiles}"})
            continue
        if record.inchikey in seen_inchikey:
            problems.append(
                {
                    "name": entry.name,
                    "problem": f"same structure as {seen_inchikey[record.inchikey]} (InChIKey collision)",
                }
            )
            continue
        seen_inchikey[record.inchikey] = entry.name
        built.append(record)

    return built, problems


def validate_library() -> dict:
    built, problems = build_library()
    return {
        "total_authored": len(MOLECULES),
        "built": len(built),
        "problems": problems,
        "ok": not problems and len(built) == len(MOLECULES),
        "safe_pool": sum(1 for b in built if not b.safety_flags),
        "flagged": sum(1 for b in built if b.safety_flags),
        "categories": sorted({b.category for b in built}),
    }
