"""Exam blueprints: what an exam claims to measure.

A blueprint is a claim. "This is a 20 item exam covering unit 3 with these
weights" is a statement about what the score means, and if the assembled form
does not match it the score means something else. So blueprints are data with
a stated basis, and the assembler refuses rather than substitutes when the
item bank cannot honour one.

What these blueprints are NOT. None of them claims alignment with AP, ACS,
MCAT or any other external examination. Those bodies publish real content
outlines with real weightings, and reproducing one from memory would be
inventing a specification and attaching an authoritative name to it. Every
blueprint here is derived from this platform's own curriculum, which is a
thing this repository actually knows, and is named accordingly. Externally
aligned blueprints can be added when someone works from the published outline
and records the citation.

Timing. minutes_per_item is an assumption, not a measurement. No timing study
has been run on these items. The figure used is stated on each blueprint so a
reader can disagree with it, and it is deliberately generous.
"""

from __future__ import annotations

from dataclasses import dataclass, field

REVIEW = "pending"

# Minutes allowed per item. An assumption until a timing study replaces it.
# Chemistry items that require a calculation and a unit conversion run longer
# than recall items, so this is set for the slower kind.
DEFAULT_MINUTES_PER_ITEM = 2.5


@dataclass(frozen=True)
class SectionSpec:
    """One timed section of an exam.

    node_codes are the nodes this section draws from. items is how many the
    section asks for. The assembler will refuse to build the form if the bank
    cannot supply that many from those nodes, rather than filling the gap from
    somewhere else, because an item from a different node measures a different
    thing.
    """

    id: str
    title: str
    node_codes: tuple[str, ...]
    items: int
    minutes: int


@dataclass(frozen=True)
class Blueprint:
    """A complete exam specification."""

    code: str
    title: str
    description: str
    scope: str
    sections: tuple[SectionSpec, ...]
    basis: str
    review: str = REVIEW

    @property
    def total_items(self) -> int:
        return sum(s.items for s in self.sections)

    @property
    def total_minutes(self) -> int:
        return sum(s.minutes for s in self.sections)


def _minutes(items: int) -> int:
    return max(1, round(items * DEFAULT_MINUTES_PER_ITEM))


def unit_exam(unit_id: str, title: str, node_codes: tuple[str, ...], items: int) -> Blueprint:
    """A single section exam over one unit.

    The commonest real assessment in a chemistry course and the one this
    platform can currently support honestly, because a unit is small enough
    that the item bank covers it.
    """
    return Blueprint(
        code=f"exam.unit.{unit_id.lower()}",
        title=title,
        description=f"A timed exam over {title}.",
        scope=unit_id,
        sections=(
            SectionSpec(
                id=f"{unit_id}-S1",
                title=title,
                node_codes=node_codes,
                items=items,
                minutes=_minutes(items),
            ),
        ),
        basis=(
            "Derived from this platform's own curriculum. The section covers "
            "the nodes of the unit that carry generated items. It does not "
            "claim alignment with any external examination."
        ),
    )


def _catalogue() -> dict[str, Blueprint]:
    """Blueprints for the units that can currently supply items.

    Generated from the curriculum and the template registry rather than typed
    out, so the catalogue cannot list an exam the bank cannot build. A unit
    with no generated items produces no blueprint, which is the honest
    outcome: the exam does not exist yet rather than existing and failing.

    Item counts are twice the number of distinct templates in the unit, capped
    at 20. Twice, because a template is a generator and a second variant is a
    fair second question. Capped, because beyond that the exam is mostly the
    same few skills repeated and the extra items buy nothing.
    """
    import chem_core as cc

    from app.data.curriculum import NODES_BY_CODE, UNITS, nodes_in_unit

    by_unit: dict[str, list[str]] = {}
    for _tid, entry in cc.REGISTRY.items():
        node = str(entry.get("node"))
        if node in NODES_BY_CODE:
            by_unit.setdefault(NODES_BY_CODE[node].unit, []).append(node)

    catalogue: dict[str, Blueprint] = {}
    for unit in UNITS:
        if unit.id not in by_unit:
            continue
        templates = len(by_unit[unit.id])
        items = min(20, max(4, templates * 2))
        # The section lists every node of the unit that carries an item, in
        # curriculum order, so the exam follows the order the unit taught.
        carrying = tuple(
            n.code for n in nodes_in_unit(unit.id) if n.code in set(by_unit[unit.id])
        )
        blueprint = unit_exam(unit.id, f"{unit.index}. {unit.title}", carrying, items)
        catalogue[blueprint.code] = blueprint
    return catalogue


BLUEPRINTS: dict[str, Blueprint] = _catalogue()


def get(code: str) -> Blueprint | None:
    return BLUEPRINTS.get(code)
