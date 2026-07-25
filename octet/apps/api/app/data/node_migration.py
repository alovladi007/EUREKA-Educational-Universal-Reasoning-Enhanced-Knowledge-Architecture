"""Mapping from the retired CF / G1 / G2 node codes to the course based map.

Why this file exists rather than a rename in place: the old codes are the key
for 60 authored lessons, 26 misconception routes, 22 template targets, 18
triangle views and 4 predict observe explain activities. A rename that misses
one of those silently detaches content from the node it teaches, and nothing
would fail loudly. Keeping the mapping as data lets a test assert that every
old code resolves and that every target exists.

The old split presented one year of general chemistry as three courses
(Chemical Foundations, General Chemistry 1, General Chemistry 2). No
registrar, syllabus or textbook is organized that way. The replacement is the
two year sequence as it is actually taught and registered: GEN1, GEN2, ORG1,
ORG2.

Two things worth knowing when reading the mapping:

1. The new map is finer grained almost everywhere. C.G1.GASLAWS covered what
   is now four nodes, so it maps to the one it actually taught (the ideal gas
   law) and the other three are unauthored. That is why 60 lessons land on 60
   nodes out of 312 rather than covering a third of the program.

2. Several topics move course. VSEPR, molecular polarity, intermolecular
   forces and colligative properties sat in my G2 and belong to GEN1 in the
   standard sequence. The old placement was wrong, not merely different.
"""

from __future__ import annotations

# Old code to new node id. Every entry is checked against the loaded
# curriculum by test_curriculum_migration, so a typo here fails the suite
# rather than quietly orphaning a lesson.
NODE_MIGRATION: dict[str, str] = {
    # Chemical Foundations dissolves into GEN1 units 1 to 5. It was never a
    # course, it was the first third of General Chemistry I.
    "C.CF.SAFETY": "GEN1.SAFETY",
    "C.CF.MATTER": "GEN1.MATTER",
    "C.CF.PROPERTIES": "GEN1.PROPERTIES",
    "C.CF.MEASURE": "GEN1.SIGFIGS",
    "C.CF.DIMANAL": "GEN1.DIMANAL",
    "C.CF.DENSITY": "GEN1.DENSITY",
    "C.CF.ATOMICTHEORY": "GEN1.ATOMICTHEORY",
    "C.CF.ISOTOPES": "GEN1.ISOTOPES",
    "C.CF.PERIODICTABLE": "GEN1.PERIODICTABLE",
    "C.CF.IONS": "GEN1.IONS",
    # My single naming lesson covered ionic and molecular together. The new
    # map splits them; the lesson goes to the molecular half because that is
    # where it spends most of its worked example.
    "C.CF.NOMENCLATURE": "GEN1.NOMENMOLEC",
    "C.CF.ENERGYBASICS": "GEN1.ENERGYBASICS",
    # General Chemistry 1.
    "C.G1.FORMULA": "GEN1.EMPIRICAL",
    "C.G1.MOLE": "GEN1.MOLE",
    "C.G1.PERCENTCOMP": "GEN1.PERCENTCOMP",
    # C.G1.EMPIRICAL is deliberately absent. See SUPERSEDED below.
    "C.G1.CONSERVATION": "GEN1.CONSERVATION",
    "C.G1.BALANCE": "GEN1.BALANCE",
    "C.G1.REACTIONTYPES": "GEN1.REACTIONTYPES",
    "C.G1.IONIC": "GEN1.NOMENIONIC",
    "C.G1.SOLUBILITY": "GEN1.SOLUBILITY",
    "C.G1.NETIONIC": "GEN1.NETIONIC",
    "C.G1.STOICH": "GEN1.STOICH",
    "C.G1.LIMITING": "GEN1.LIMITING",
    "C.G1.MOLARITY": "GEN1.MOLARITY",
    "C.G1.DILUTION": "GEN1.DILUTION",
    "C.G1.TITRATIONBASIC": "GEN1.TITRATIONBASIC",
    # One node became four. This lesson taught the ideal gas law specifically.
    "C.G1.GASLAWS": "GEN1.IDEALGAS",
    "C.G1.GASMIX": "GEN1.PARTIALPRESSURE",
    "C.G1.THERMOBASIC": "GEN1.CALORIMETRY",
    "C.G1.ENTHALPY": "GEN1.ENTHALPY",
    "C.G1.HESS": "GEN1.HESS",
    "C.G1.ELECTRONCONFIG": "GEN1.ELECTRONCONFIG",
    "C.G1.QUANTUM": "GEN1.QUANTUMNUMBERS",
    "C.G1.PERIODICTRENDS": "GEN1.RADIUS",
    "C.G1.LEWISBASIC": "GEN1.LEWIS",
    # These four were in my G2 and belong to GEN1 in the standard sequence.
    # Bonding, geometry, polarity and intermolecular forces are first semester
    # material; putting them second was a mistake in the old map.
    "C.G2.BONDING": "GEN1.IONICBOND",
    "C.G2.VSEPR": "GEN1.VSEPR",
    "C.G2.POLARITY": "GEN1.POLARITY",
    "C.G2.IMF": "GEN1.IMF",
    "C.G2.SOLUTIONS": "GEN1.COLLIGATIVE",
    # Oxidation numbers are introduced with reaction types in GEN1, not with
    # electrochemistry.
    "C.G2.REDOX": "GEN1.OXNUMBERS",
    # General Chemistry 2 proper.
    "C.G2.KINETICS": "GEN2.RATES",
    "C.G2.RATELAW": "GEN2.RATELAW",
    "C.G2.MECHANISM": "GEN2.MECHANISM",
    "C.G2.ARRHENIUS": "GEN2.ARRHENIUS",
    "C.G2.EQUILIBRIUM": "GEN2.EQUILIBRIUM",
    "C.G2.ICE": "GEN2.ICE",
    "C.G2.LECHATELIER": "GEN2.LECHATELIER",
    "C.G2.ACIDBASE": "GEN2.BRONSTED",
    "C.G2.PH": "GEN2.PH",
    "C.G2.WEAKACID": "GEN2.WEAKACID",
    "C.G2.BUFFER": "GEN2.BUFFER",
    # The old map had one titration curve node. The new one separates the
    # strong and weak cases, which is what the two simulation scenarios
    # already modelled separately, so this is a better fit than the original.
    "C.G2.TITRATIONCURVE": "GEN2.TITRATIONWEAK",
    "C.G2.KSP": "GEN2.KSP",
    "C.G2.ENTROPY": "GEN2.ENTROPY",
    "C.G2.GIBBS": "GEN2.GIBBS",
    "C.G2.ELECTROCHEM": "GEN2.GALVANIC",
    "C.G2.NERNST": "GEN2.NERNST",
    "C.G2.NUCLEAR": "GEN2.NUCLEARSTABILITY",
}

# Old codes whose lesson has no distinct home in the new map, with the node
# the material belongs to.
#
# The new map has one node for formulas where the old map had two. Both
# lessons are real and neither is wrong; the map they were written against
# drew a line the standard sequence does not draw. C.G1.FORMULA takes the node
# because its title and scope match it exactly. The other lesson is retained
# in the repository and listed here so it is folded into GEN1.EMPIRICAL when a
# human next authors that node, rather than quietly deleted.
SUPERSEDED: dict[str, str] = {
    "C.G1.EMPIRICAL": "GEN1.EMPIRICAL",
}


def migrate(old_code: str) -> str | None:
    """New node id for an old code, or None when it was superseded."""
    return NODE_MIGRATION.get(old_code)


def migrated_targets() -> set[str]:
    return set(NODE_MIGRATION.values())
