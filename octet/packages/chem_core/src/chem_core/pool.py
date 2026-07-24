"""The molecule pool the generators draw from.

chem_core must stay standalone: no database, no app imports, testable on its
own. But production should generate items from the curated 200 entry library
that lives in the application layer, not from the small fixture set here.

The seam is injection. The app calls set_pool() at startup with the curated
library. Until it does, the fixtures are used, so chem_core tests and the CI
sweep run with no application present.

Safety: whatever is injected must already be filtered by the caller's safety
policy. app.data.molecules.molecule_pool() does that filtering.
"""

from __future__ import annotations

from dataclasses import dataclass

from . import _fixtures as fx


@dataclass(frozen=True)
class PoolMolecule:
    name: str
    smiles: str
    formula: str
    real_world_note: str


_pool: tuple[PoolMolecule, ...] = tuple(
    PoolMolecule(m.name, m.smiles, m.formula, m.real_world_note) for m in fx.MOLECULES
)
_source = "fixtures"


def set_pool(molecules, *, source: str = "injected") -> int:
    """Replace the generator pool. Returns the number of entries accepted.

    Each item needs name, smiles, formula and real_world_note attributes or
    keys. Entries missing a real world note are rejected, because the build
    prompt requires real molecule framing and a blank note produces a prompt
    that says compound X.
    """
    global _pool, _source

    def field(item, key):
        return item.get(key) if isinstance(item, dict) else getattr(item, key, None)

    accepted = []
    for m in molecules:
        name, smiles = field(m, "name"), field(m, "smiles")
        formula, note = field(m, "formula"), field(m, "real_world_note")
        if not (name and smiles and formula and note):
            continue
        accepted.append(PoolMolecule(str(name), str(smiles), str(formula), str(note)))
    if not accepted:
        raise ValueError("refusing to install an empty molecule pool")
    _pool = tuple(accepted)
    _source = source
    return len(_pool)


def get_pool() -> tuple[PoolMolecule, ...]:
    return _pool


def pool_source() -> str:
    return _source
