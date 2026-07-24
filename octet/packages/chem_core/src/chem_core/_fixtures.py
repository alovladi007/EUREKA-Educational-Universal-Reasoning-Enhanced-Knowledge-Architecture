"""Grader fixtures for Phase 1.

These are the minimum species the Phase 1 generators need in order to produce
variants. This is deliberately NOT the content library. Phase 2 ships the
curated molecule library (200 entries with real_world_note and safety_flags)
in the chemistry domain, and these generators then draw from it.

Everything here is a standard teaching molecule or a standard bench salt. No
entry is a controlled substance, an explosive, or a precursor of one, per the
safety policy that governs every generative surface.

Values marked review="pending" have not been signed off by a subject matter
expert. Constants are standard general chemistry table values.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class FixtureMolecule:
    name: str
    smiles: str
    formula: str
    real_world_note: str
    safety_flags: tuple[str, ...] = ()


# Common molecules with unambiguous structures. SMILES are checked against the
# recorded formula by RDKit in the sweep, so a typo here fails CI rather than
# reaching a learner.
MOLECULES: tuple[FixtureMolecule, ...] = (
    FixtureMolecule("water", "O", "H2O", "The solvent of essentially all biology."),
    FixtureMolecule("methane", "C", "CH4", "The main component of natural gas."),
    FixtureMolecule("ethanol", "CCO", "C2H6O", "The alcohol in fermented drinks and a common lab solvent."),
    FixtureMolecule("acetic acid", "CC(=O)O", "C2H4O2", "What makes vinegar sour."),
    FixtureMolecule("glucose", "OCC1OC(O)C(O)C(O)C1O", "C6H12O6", "The sugar your cells run on."),
    FixtureMolecule("benzene", "c1ccccc1", "C6H6", "The parent aromatic ring, and a reason aromaticity matters."),
    FixtureMolecule("aspirin", "CC(=O)Oc1ccccc1C(=O)O", "C9H8O4", "Acetylsalicylic acid, the ester in the pill."),
    FixtureMolecule("caffeine", "Cn1cnc2c1c(=O)n(C)c(=O)n2C", "C8H10N4O2", "The stimulant in coffee and tea."),
    FixtureMolecule("ibuprofen", "CC(C)Cc1ccc(cc1)C(C)C(=O)O", "C13H18O2", "A common anti inflammatory drug."),
    FixtureMolecule("glycine", "NCC(=O)O", "C2H5NO2", "The smallest amino acid."),
    FixtureMolecule("urea", "NC(=O)N", "CH4N2O", "The nitrogen waste product mammals excrete."),
    FixtureMolecule("citric acid", "OC(=O)CC(O)(CC(=O)O)C(=O)O", "C6H8O7", "The acid in citrus fruit."),
    FixtureMolecule("propane", "CCC", "C3H8", "Bottled fuel gas."),
    FixtureMolecule("butane", "CCCC", "C4H10", "Lighter fuel."),
    FixtureMolecule("octane", "CCCCCCCC", "C8H18", "The reference hydrocarbon for fuel rating."),
    FixtureMolecule("toluene", "Cc1ccccc1", "C7H8", "A common industrial solvent."),
)

# Hydrocarbons used by the combustion balancing generator. Kept separate
# because the generator needs the carbon and hydrogen counts directly.
HYDROCARBONS: tuple[tuple[str, int, int], ...] = (
    ("CH4", 1, 4),
    ("C2H6", 2, 6),
    ("C3H8", 3, 8),
    ("C4H10", 4, 10),
    ("C5H12", 5, 12),
    ("C6H14", 6, 14),
    ("C7H16", 7, 16),
    ("C8H18", 8, 18),
    ("C2H4", 2, 4),
    ("C3H6", 3, 6),
    ("C2H2", 2, 2),
    ("C6H6", 6, 6),
)

# Precipitation reactions whose insoluble product follows the standard
# solubility rules taught in general chemistry.
PRECIPITATIONS: tuple[tuple[str, str, str, str, str], ...] = (
    ("AgNO3", "NaCl", "AgCl", "NaNO3", "silver chloride is insoluble"),
    ("Pb(NO3)2", "KI", "PbI2", "KNO3", "lead iodide is insoluble and bright yellow"),
    ("BaCl2", "Na2SO4", "BaSO4", "NaCl", "barium sulfate is insoluble"),
    ("CaCl2", "Na2CO3", "CaCO3", "NaCl", "calcium carbonate is insoluble"),
    ("AgNO3", "K2CrO4", "Ag2CrO4", "KNO3", "silver chromate is insoluble and red"),
    ("Pb(NO3)2", "Na2SO4", "PbSO4", "NaNO3", "lead sulfate is insoluble"),
    ("FeCl3", "NaOH", "Fe(OH)3", "NaCl", "iron hydroxide is insoluble"),
    ("MgCl2", "Na2CO3", "MgCO3", "NaCl", "magnesium carbonate is insoluble"),
)

# Monoprotic weak acids with standard textbook Ka values at 25 C.
# Source: standard general chemistry acid dissociation tables (CRC Handbook of
# Chemistry and Physics). review="pending" until SME sign off.
WEAK_ACIDS: tuple[tuple[str, str, float], ...] = (
    ("acetic acid", "CH3COOH", 1.8e-5),
    ("formic acid", "HCOOH", 1.8e-4),
    ("benzoic acid", "C6H5COOH", 6.3e-5),
    ("propanoic acid", "C2H5COOH", 1.3e-5),
    ("hypochlorous acid", "HOCl", 3.0e-8),
    ("hydrofluoric acid", "HF", 6.8e-4),
    ("lactic acid", "C3H6O3", 1.4e-4),
    ("nitrous acid", "HNO2", 4.5e-4),
)

REVIEW_STATUS = "pending"
