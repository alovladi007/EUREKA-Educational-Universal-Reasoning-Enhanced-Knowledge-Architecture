"""OCTET curriculum, general chemistry (GEN1 and GEN2).

Replaces the earlier CF / G1 / G2 split, which presented one year of general
chemistry as three courses and covered roughly a third of the material.

Structure now mirrors how the sequence is actually taught and registered:

  GEN1  General Chemistry I    11 units   89 nodes
  GEN2  General Chemistry II    9 units   75 nodes

Unit order follows the standard chapter sequence (OpenStax Chemistry 2e
chapter numbers given per unit) so an instructor can map a syllabus onto
the node graph without re-teaching the order.

Prerequisite edges are generated, not hand listed:
- nodes inside a unit chain in order,
- each unit declares the nodes it builds on (UNIT_PREREQS),
- genuinely non-linear links go in EXTRA_EDGES.

This keeps 300+ nodes maintainable and keeps the graph a DAG.

Flags on a node are authoring metadata, not learner-facing labels:
  lab   node is lab adjacent (safety and technique content applies)
  tri   Johnstone triangle eligible (macroscopic, particulate, symbolic)
"""

from __future__ import annotations

import json
import re


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def N(nid: str, kind: str, title: str, desc: str, flags: str = "") -> dict:
    return {
        "id": nid,
        "kind": kind,
        "title": title,
        "description": desc,
        "lab_adjacent": "lab" in flags,
        "triangle_eligible": "tri" in flags,
    }


def U(uid: str, title: str, chapters: str, nodes: list[dict]) -> dict:
    return {"id": uid, "title": title, "chapters": chapters, "nodes": nodes}


def M(code: str, name: str, desc: str, routes_to: str) -> dict:
    return {"code": code, "name": name, "description": desc,
            "routes_to": routes_to}


# ===========================================================================
# GEN1: General Chemistry I
# ===========================================================================

GEN1_UNITS = [
    U("GEN1-U1", "Matter and Measurement", "Ch 1", [
        N("GEN1.SAFETY", "concept", "Laboratory safety and GHS hazard literacy",
          "Reading a pictogram and a safety data sheet before touching anything.", "lab"),
        N("GEN1.MATTER", "concept", "Matter, pure substances and mixtures",
          "What counts as a substance, and how a mixture differs from a compound.", "tri"),
        N("GEN1.PROPERTIES", "concept", "Physical and chemical properties and changes",
          "Telling a change of state from a change of substance.", "tri"),
        N("GEN1.STATES", "concept", "States of matter at the particle level",
          "Solid, liquid and gas described by particle arrangement and motion.", "tri"),
        N("GEN1.UNITS", "computational", "SI units and derived units",
          "Base units, derived units, and prefixes as powers of ten."),
        N("GEN1.SIGFIGS", "computational", "Significant figures, accuracy and precision",
          "Why a measurement carries a precision, and how it survives arithmetic."),
        N("GEN1.DIMANAL", "computational", "Dimensional analysis",
          "Converting by carrying units through the algebra as cancelling factors."),
        N("GEN1.DENSITY", "computational", "Density and derived quantities",
          "A ratio of two measurements, and the first real use of unit conversion.", "lab"),
        N("GEN1.TEMPERATURE", "computational", "Temperature scales",
          "Celsius, Kelvin and Fahrenheit, and which one the gas laws require."),
    ]),
    U("GEN1-U2", "Atoms, Molecules and Ions", "Ch 2", [
        N("GEN1.ATOMICTHEORY", "concept", "Atomic theory and the mass laws",
          "Conservation of mass, definite proportions, multiple proportions.", "tri"),
        N("GEN1.SUBATOMIC", "concept", "Subatomic particles and nuclear atom",
          "Protons, neutrons and electrons, and what each one determines.", "tri"),
        N("GEN1.ISOTOPES", "computational", "Atomic number, mass number and isotopes",
          "Same element, different neutron count, different mass."),
        N("GEN1.ATOMICMASS", "computational", "Average atomic mass",
          "Why the tabulated mass is a weighted average and rarely a whole number."),
        N("GEN1.PERIODICTABLE", "concept", "Reading the periodic table",
          "Groups, periods, metals and nonmetals, and what position predicts."),
        N("GEN1.IONS", "concept", "Ions, charge and the octet pattern",
          "Which ions elements tend to form, and why the pattern is a summary.", "tri"),
        N("GEN1.COMPOUNDTYPES", "concept", "Ionic versus molecular compounds",
          "Two different kinds of substance behind two different kinds of formula.", "tri"),
        N("GEN1.NOMENIONIC", "computational", "Naming ionic compounds and polyatomic ions",
          "Cation first, anion second, and the polyatomic ions worth memorizing."),
        N("GEN1.NOMENMOLEC", "computational", "Naming molecular compounds and acids",
          "Prefix naming for molecules, and the acid naming rules that follow anions."),
    ]),
    U("GEN1-U3", "Composition of Substances and Solutions", "Ch 3", [
        N("GEN1.MOLE", "computational", "The mole and Avogadro's number",
          "Counting by weighing, the central move of quantitative chemistry.", "tri"),
        N("GEN1.MOLARMASS", "computational", "Molar mass",
          "Converting between grams and moles for elements and compounds."),
        N("GEN1.PERCENTCOMP", "computational", "Percent composition",
          "Turning a formula into mass fractions."),
        N("GEN1.EMPIRICAL", "computational", "Empirical and molecular formulas",
          "Running percent composition backwards to recover a formula.", "lab"),
        N("GEN1.MOLARITY", "computational", "Molarity",
          "Moles per litre of solution, not of solvent.", "lab"),
        N("GEN1.DILUTION", "computational", "Dilution",
          "Adding solvent changes concentration and never the amount of solute."),
        N("GEN1.OTHERCONC", "computational", "Other concentration units",
          "Mass percent, parts per million, and when each is the natural unit."),
    ]),
    U("GEN1-U4", "Stoichiometry of Chemical Reactions", "Ch 4", [
        N("GEN1.CONSERVATION", "concept", "Conservation of mass and atoms",
          "Reactions rearrange atoms and never create or destroy them.", "tri"),
        N("GEN1.BALANCE", "computational", "Balancing chemical equations",
          "Coefficients change, subscripts never do.", "tri"),
        N("GEN1.REACTIONTYPES", "concept", "Classifying reactions",
          "Precipitation, acid base and oxidation reduction as three patterns."),
        N("GEN1.SOLUBILITY", "computational", "Solubility rules and precipitation",
          "Predicting which product leaves solution as a solid.", "lab tri"),
        N("GEN1.NETIONIC", "computational", "Complete and net ionic equations",
          "Writing only the species that actually change."),
        N("GEN1.NEUTRALIZATION", "computational", "Acid base neutralization reactions",
          "Acid plus base gives salt plus water, and what that means ionically."),
        N("GEN1.OXNUMBERS", "computational", "Oxidation numbers and redox identification",
          "Bookkeeping that reveals which atoms gained and lost electrons."),
        N("GEN1.STOICH", "computational", "Reaction stoichiometry",
          "Mass to moles, across the balanced equation, back to mass."),
        N("GEN1.LIMITING", "computational", "Limiting reactant",
          "Which reactant runs out first, and why the other one does not matter."),
        N("GEN1.YIELD", "computational", "Theoretical, actual and percent yield",
          "Why real yields fall short of the calculation.", "lab"),
        N("GEN1.TITRATIONBASIC", "computational", "Titration and quantitative analysis",
          "Using a known concentration to measure an unknown one.", "lab"),
    ]),
    U("GEN1-U5", "Thermochemistry", "Ch 5", [
        N("GEN1.ENERGYBASICS", "concept", "Energy, heat, work and temperature",
          "Distinguishing thermal energy from temperature, and both from heat.", "tri"),
        N("GEN1.FIRSTLAW", "concept", "System, surroundings and the first law",
          "Energy moves between system and surroundings and is conserved overall."),
        N("GEN1.HEATCAPACITY", "computational", "Heat capacity and specific heat",
          "How much energy a substance absorbs per degree."),
        N("GEN1.CALORIMETRY", "computational", "Calorimetry",
          "Measuring energy change by watching temperature change.", "lab"),
        N("GEN1.ENTHALPY", "computational", "Enthalpy of reaction",
          "Heat at constant pressure, and the sign convention that trips everyone."),
        N("GEN1.THERMOSTOICH", "computational", "Thermochemical equations",
          "Enthalpy scales with the amounts in the balanced equation."),
        N("GEN1.HESS", "computational", "Hess's law",
          "Enthalpy is a state function, so routes can be added."),
        N("GEN1.FORMATION", "computational", "Standard enthalpies of formation",
          "One table of reference values that gives any reaction enthalpy."),
        N("GEN1.BONDENTHALPY", "computational", "Bond enthalpies",
          "Estimating reaction enthalpy from bonds broken and bonds formed."),
    ]),
    U("GEN1-U6", "Electronic Structure and Periodic Properties", "Ch 6", [
        N("GEN1.LIGHT", "concept", "Electromagnetic radiation and quantized energy",
          "Wavelength, frequency and the photon.", "tri"),
        N("GEN1.SPECTRA", "concept", "Line spectra and the Bohr model",
          "Discrete lines as evidence for discrete energy levels.", "tri"),
        N("GEN1.QUANTUMMODEL", "concept", "The quantum mechanical model and orbitals",
          "Orbitals as probability distributions, not paths.", "tri"),
        N("GEN1.QUANTUMNUMBERS", "computational", "Quantum numbers and orbital shapes",
          "The four numbers that address an electron."),
        N("GEN1.ELECTRONCONFIG", "computational", "Electron configurations",
          "Filling orbitals in order, with orbital diagrams."),
        N("GEN1.CONFIGEXCEPTIONS", "computational", "Exceptions and ion configurations",
          "Chromium, copper, and which electrons leave first when ions form."),
        N("GEN1.RADIUS", "concept", "Periodic trend: atomic and ionic radius",
          "Shielding and effective nuclear charge explain the pattern."),
        N("GEN1.IONIZATION", "concept", "Periodic trend: ionization energy and electron affinity",
          "The energy cost of removing an electron, and the exceptions."),
        N("GEN1.ELECTRONEG", "concept", "Electronegativity and metallic character",
          "The trend that drives bond polarity in every later unit."),
    ]),
    U("GEN1-U7", "Chemical Bonding and Molecular Geometry", "Ch 7", [
        N("GEN1.IONICBOND", "concept", "Ionic bonding and lattice energy",
          "Lattices rather than molecules, and what holds them together.", "tri"),
        N("GEN1.COVALENTBOND", "concept", "Covalent bonding and bond polarity",
          "Shared electrons, and what unequal sharing does.", "tri"),
        N("GEN1.LEWIS", "computational", "Lewis structures",
          "Accounting for valence electrons on paper.", "tri"),
        N("GEN1.FORMALCHARGE", "computational", "Formal charge",
          "Choosing between structures that both satisfy the octet."),
        N("GEN1.RESONANCE", "concept", "Resonance",
          "One structure is not enough, and the real molecule is neither.", "tri"),
        N("GEN1.OCTETEXCEPTIONS", "computational", "Exceptions to the octet rule",
          "Incomplete octets, expanded octets and odd electron species."),
        N("GEN1.BONDPROPERTIES", "concept", "Bond order, length and strength",
          "Three properties that move together."),
        N("GEN1.VSEPR", "computational", "VSEPR and molecular geometry",
          "Electron domains set the shape, and shape sets almost everything else.", "tri"),
        N("GEN1.POLARITY", "computational", "Molecular polarity and dipole moment",
          "Bond polarity plus geometry gives molecular polarity.", "tri"),
    ]),
    U("GEN1-U8", "Advanced Theories of Covalent Bonding", "Ch 8", [
        N("GEN1.VALENCEBOND", "concept", "Valence bond theory and orbital overlap",
          "Bonds as overlapping atomic orbitals."),
        N("GEN1.HYBRIDIZATION", "computational", "Hybridization",
          "sp, sp2 and sp3 orbitals, and how geometry predicts them."),
        N("GEN1.SIGMAPI", "concept", "Sigma and pi bonds and multiple bonds",
          "Why a double bond does not rotate."),
        N("GEN1.MOTHEORY", "concept", "Molecular orbital theory",
          "Bonding and antibonding orbitals from combined atomic orbitals."),
        N("GEN1.MODIAGRAMS", "computational", "MO diagrams, bond order and magnetism",
          "Filling the diagram to predict stability and paramagnetism."),
    ]),
    U("GEN1-U9", "Gases", "Ch 9", [
        N("GEN1.PRESSURE", "computational", "Pressure and its measurement",
          "What a barometer measures and the units it is reported in.", "lab"),
        N("GEN1.SIMPLEGASLAWS", "computational", "The simple gas laws",
          "Boyle, Charles and Avogadro as three slices of one relationship.", "tri"),
        N("GEN1.IDEALGAS", "computational", "The ideal gas law",
          "One equation tying pressure, volume, temperature and amount.", "tri"),
        N("GEN1.GASDENSITY", "computational", "Gas density and molar mass",
          "Determining a molar mass from a density measurement.", "lab"),
        N("GEN1.PARTIALPRESSURE", "computational", "Dalton's law and partial pressures",
          "Mixtures of gases, including gas collected over water."),
        N("GEN1.GASSTOICH", "computational", "Gas stoichiometry",
          "Reactions that produce or consume gases."),
        N("GEN1.KMT", "concept", "Kinetic molecular theory",
          "The particle model that explains why the gas laws work.", "tri"),
        N("GEN1.EFFUSION", "computational", "Effusion, diffusion and Graham's law",
          "Lighter molecules move faster at the same temperature."),
        N("GEN1.REALGASES", "concept", "Real gases and the van der Waals equation",
          "Where the ideal model fails, and the two corrections that fix it."),
    ]),
    U("GEN1-U10", "Liquids and Solids", "Ch 10", [
        N("GEN1.IMF", "concept", "Intermolecular forces",
          "Dispersion, dipole dipole and hydrogen bonding, ranked.", "tri"),
        N("GEN1.IMFPROPERTIES", "concept", "Properties that follow from IMF",
          "Boiling point, viscosity, surface tension and capillary action.", "tri"),
        N("GEN1.PHASECHANGE", "computational", "Phase transitions and heating curves",
          "Energy goes into temperature or into the transition, never both."),
        N("GEN1.VAPORPRESSURE", "computational", "Vapor pressure and Clausius Clapeyron",
          "Escaping tendency and its temperature dependence."),
        N("GEN1.PHASEDIAGRAM", "concept", "Phase diagrams",
          "Reading the state of a substance off pressure and temperature.", "tri"),
        N("GEN1.SOLIDTYPES", "concept", "Types of solids",
          "Ionic, molecular, metallic and covalent network, and their properties.", "tri"),
        N("GEN1.UNITCELLS", "computational", "Crystal lattices and unit cells",
          "Packing, coordination number and density from a unit cell."),
    ]),
    U("GEN1-U11", "Solutions and Colloids", "Ch 11", [
        N("GEN1.DISSOLUTION", "concept", "The dissolution process",
          "Solute solute, solvent solvent and solute solvent interactions.", "tri"),
        N("GEN1.SOLUBILITYFACTORS", "computational", "Solubility and saturation",
          "Saturated, unsaturated and supersaturated, and what shifts them.", "lab"),
        N("GEN1.HENRY", "computational", "Henry's law and gas solubility",
          "Pressure dependence of dissolved gas."),
        N("GEN1.MOLALITY", "computational", "Molality and mole fraction",
          "Concentration units that do not change with temperature."),
        N("GEN1.COLLIGATIVE", "computational", "Colligative properties",
          "Vapor pressure lowering, boiling point elevation, freezing point depression."),
        N("GEN1.OSMOSIS", "computational", "Osmotic pressure and the van't Hoff factor",
          "Why an electrolyte counts more than once."),
        N("GEN1.COLLOIDS", "concept", "Colloids and suspensions",
          "Between solution and mixture, and how to tell.", "lab"),
    ]),
]

GEN1_UNIT_PREREQS = {
    "GEN1-U2": ["GEN1.MATTER"],
    "GEN1-U3": ["GEN1.NOMENMOLEC", "GEN1.DIMANAL"],
    "GEN1-U4": ["GEN1.MOLARMASS"],
    "GEN1-U5": ["GEN1.STOICH", "GEN1.TEMPERATURE"],
    "GEN1-U6": ["GEN1.PERIODICTABLE"],
    "GEN1-U7": ["GEN1.ELECTRONEG", "GEN1.IONS"],
    "GEN1-U8": ["GEN1.VSEPR"],
    "GEN1-U9": ["GEN1.MOLE", "GEN1.TEMPERATURE"],
    "GEN1-U10": ["GEN1.POLARITY", "GEN1.KMT"],
    "GEN1-U11": ["GEN1.IMF", "GEN1.MOLARITY"],
}

GEN1_EXTRA_EDGES = [
    ("GEN1.SIGFIGS", "GEN1.DENSITY"),
    ("GEN1.ATOMICMASS", "GEN1.MOLE"),
    ("GEN1.COMPOUNDTYPES", "GEN1.EMPIRICAL"),
    ("GEN1.MOLARITY", "GEN1.TITRATIONBASIC"),
    ("GEN1.BALANCE", "GEN1.STOICH"),
    ("GEN1.LEWIS", "GEN1.VSEPR"),
    ("GEN1.HYBRIDIZATION", "GEN1.SIGMAPI"),
    ("GEN1.IDEALGAS", "GEN1.GASSTOICH"),
    ("GEN1.STOICH", "GEN1.GASSTOICH"),
    ("GEN1.PHASECHANGE", "GEN1.PHASEDIAGRAM"),
    ("GEN1.HEATCAPACITY", "GEN1.PHASECHANGE"),
]

GEN1_MISCONCEPTIONS = [
    M("GEN1M01", "Coefficient and subscript confusion",
      "Balances an equation by changing subscripts, which changes the substance.",
      "GEN1.BALANCE"),
    M("GEN1M02", "Mass not conserved with gases",
      "Believes mass is lost when a product is a gas that leaves the vessel.",
      "GEN1.CONSERVATION"),
    M("GEN1M03", "Ionic compounds as molecules",
      "Pictures NaCl as discrete NaCl molecules rather than a lattice.",
      "GEN1.IONICBOND"),
    M("GEN1M04", "Electron shells as planetary orbits",
      "Treats orbitals as fixed circular paths rather than probability regions.",
      "GEN1.QUANTUMMODEL"),
    M("GEN1M05", "Bond breaking releases energy",
      "Believes breaking bonds is exothermic; it always costs energy.",
      "GEN1.BONDENTHALPY"),
    M("GEN1M06", "Significant figures as decoration",
      "Reports every digit the calculator shows, or rounds arbitrarily.",
      "GEN1.SIGFIGS"),
    M("GEN1M07", "Molarity per litre of solvent",
      "Computes molarity using solvent volume instead of final solution volume.",
      "GEN1.MOLARITY"),
    M("GEN1M08", "Limiting reactant is the smaller mass",
      "Picks the reactant with less mass instead of comparing mole ratios.",
      "GEN1.LIMITING"),
    M("GEN1M09", "Heat and temperature conflated",
      "Uses heat and temperature interchangeably, so calorimetry has no meaning.",
      "GEN1.ENERGYBASICS"),
    M("GEN1M10", "Electron domains equal atoms",
      "Counts only bonded atoms in VSEPR and ignores lone pairs.",
      "GEN1.VSEPR"),
    M("GEN1M11", "Polar bonds mean polar molecule",
      "Ignores geometry, so symmetric molecules are called polar.",
      "GEN1.POLARITY"),
    M("GEN1M12", "Hydrogen bonding as a covalent bond",
      "Treats hydrogen bonding as bonding within the molecule.",
      "GEN1.IMF"),
    M("GEN1M13", "Intramolecular forces break on boiling",
      "Believes covalent bonds break when a molecular substance boils.",
      "GEN1.IMFPROPERTIES"),
    M("GEN1M14", "Resonance as oscillation",
      "Believes the molecule flips between resonance structures over time.",
      "GEN1.RESONANCE"),
    M("GEN1M15", "Ideal gas law without Kelvin",
      "Substitutes Celsius temperature into gas law calculations.",
      "GEN1.IDEALGAS"),
]

# ===========================================================================
# GEN2: General Chemistry II
# ===========================================================================

GEN2_UNITS = [
    U("GEN2-U1", "Chemical Kinetics", "Ch 12", [
        N("GEN2.RATES", "concept", "Reaction rates and rate expressions",
          "Rate as change per unit time, tied to coefficients.", "lab tri"),
        N("GEN2.RATEFACTORS", "concept", "Factors that change reaction rate",
          "Concentration, temperature, surface area and catalyst.", "tri"),
        N("GEN2.RATELAW", "computational", "Rate laws and reaction order",
          "Order is measured, never read off the balanced equation.", "lab"),
        N("GEN2.INITIALRATES", "computational", "Determining a rate law from initial rates",
          "Comparing trials in which one concentration changes at a time.", "lab"),
        N("GEN2.INTEGRATED", "computational", "Integrated rate laws",
          "Zero, first and second order concentration versus time."),
        N("GEN2.HALFLIFE", "computational", "Half life",
          "The half life that is constant, and the two that are not."),
        N("GEN2.COLLISION", "concept", "Collision theory and activation energy",
          "Why most collisions do not react.", "tri"),
        N("GEN2.ARRHENIUS", "computational", "The Arrhenius equation",
          "Temperature dependence of the rate constant."),
        N("GEN2.MECHANISM", "concept", "Reaction mechanisms and elementary steps",
          "A balanced equation is a summary, the mechanism is the story."),
        N("GEN2.RDS", "computational", "Rate determining step and mechanism validation",
          "A proposed mechanism must reproduce the observed rate law."),
        N("GEN2.CATALYSIS", "concept", "Catalysis",
          "Lowering activation energy without being consumed.", "tri"),
    ]),
    U("GEN2-U2", "Chemical Equilibrium", "Ch 13", [
        N("GEN2.EQUILIBRIUM", "concept", "The equilibrium state",
          "Forward and reverse rates equal, concentrations constant, reaction running.", "tri"),
        N("GEN2.KEXPRESSION", "computational", "The equilibrium constant",
          "Writing K from a balanced equation."),
        N("GEN2.KCKP", "computational", "Kc, Kp and the relationship between them",
          "Concentration and pressure constants, and the delta n exponent."),
        N("GEN2.HETEROGENEOUS", "computational", "Heterogeneous equilibria",
          "Why pure solids and liquids are left out of K."),
        N("GEN2.MANIPULATEK", "computational", "Manipulating equilibrium constants",
          "Reversing, scaling and adding reactions."),
        N("GEN2.QUOTIENT", "computational", "The reaction quotient and direction of shift",
          "Comparing Q to K tells you which way the reaction runs."),
        N("GEN2.ICE", "computational", "ICE tables",
          "The bookkeeping that turns an equilibrium into one unknown."),
        N("GEN2.LECHATELIER", "concept", "Le Chatelier's principle",
          "Stress shifts position, and only temperature changes K.", "tri"),
        N("GEN2.KTEMPERATURE", "computational", "Temperature dependence of K",
          "Treating heat as a reactant or product, and what that predicts."),
    ]),
    U("GEN2-U3", "Acid Base Equilibria", "Ch 14", [
        N("GEN2.BRONSTED", "concept", "Bronsted Lowry acids, bases and conjugate pairs",
          "Proton donors and acceptors, and what conjugate really means."),
        N("GEN2.AMPHOTERIC", "concept", "Amphoteric species and water autoionization",
          "Water on both sides, and the Kw that follows."),
        N("GEN2.PH", "computational", "pH, pOH and the pH scale",
          "A logarithmic scale, and the reason it has the range it does.", "tri"),
        N("GEN2.STRONGACID", "computational", "Strong acids and strong bases",
          "Complete ionization, and the short list worth memorizing."),
        N("GEN2.WEAKACID", "computational", "Weak acid equilibria and Ka",
          "Partial ionization solved as an equilibrium problem."),
        N("GEN2.WEAKBASE", "computational", "Weak base equilibria and Kb",
          "The same problem run from the base side."),
        N("GEN2.KAKB", "computational", "The relationship between Ka and Kb",
          "Conjugate pairs multiply to Kw."),
        N("GEN2.APPROXIMATION", "computational", "Percent ionization and the small x approximation",
          "When dropping x is honest, and how to check."),
        N("GEN2.POLYPROTIC", "computational", "Polyprotic acids",
          "Sequential ionizations that get progressively harder."),
        N("GEN2.SALTHYDROLYSIS", "computational", "Salt solutions and hydrolysis",
          "Predicting whether a salt solution is acidic, basic or neutral."),
        N("GEN2.ACIDSTRUCTURE", "concept", "Acid strength and molecular structure",
          "Why some acids are stronger, from bond strength and stability."),
        N("GEN2.LEWISACID", "concept", "Lewis acids and bases",
          "Electron pair acceptors and donors, the definition organic chemistry uses."),
    ]),
    U("GEN2-U4", "Buffers and Titration", "Ch 14", [
        N("GEN2.COMMONION", "computational", "The common ion effect",
          "Adding a shared ion suppresses ionization."),
        N("GEN2.BUFFER", "concept", "Buffer composition and action",
          "Why some solutions resist pH change.", "lab tri"),
        N("GEN2.HENDERSON", "computational", "Henderson Hasselbalch and buffer capacity",
          "The shortcut, its assumptions, and where it fails."),
        N("GEN2.BUFFERPREP", "computational", "Preparing a buffer at a target pH",
          "Choosing the acid, then the ratio.", "lab"),
        N("GEN2.TITRATIONSTRONG", "computational", "Strong acid strong base titration curves",
          "The shape, and why the equivalence point is at pH 7.", "lab tri"),
        N("GEN2.TITRATIONWEAK", "computational", "Weak acid strong base titration curves",
          "The buffer region, and why equivalence is not at pH 7.", "lab tri"),
        N("GEN2.HALFEQUIV", "computational", "Half equivalence and equivalence points",
          "Reading pKa straight off the curve."),
        N("GEN2.INDICATORS", "concept", "Indicators and endpoint selection",
          "Matching indicator range to the equivalence pH.", "lab"),
    ]),
    U("GEN2-U5", "Solubility and Complex Ion Equilibria", "Ch 15", [
        N("GEN2.KSP", "computational", "Ksp and molar solubility",
          "Equilibrium applied to sparingly soluble salts."),
        N("GEN2.KSPCOMMONION", "computational", "The common ion effect on solubility",
          "Why a salt is less soluble in a solution of its own ion."),
        N("GEN2.PRECIPITATION", "computational", "Predicting precipitation with Q and Ksp",
          "Will it precipitate, and at what concentration."),
        N("GEN2.PHSOLUBILITY", "computational", "pH effects on solubility",
          "Salts of weak acids dissolve more in acid."),
        N("GEN2.COMPLEXION", "computational", "Complex ion formation and Kf",
          "Ligand binding that pulls a salt into solution."),
        N("GEN2.SELECTIVEPPT", "computational", "Selective precipitation",
          "Separating ions by exploiting different Ksp values.", "lab"),
    ]),
    U("GEN2-U6", "Thermodynamics", "Ch 16", [
        N("GEN2.SPONTANEITY", "concept", "Spontaneity and the second law",
          "Spontaneous means it proceeds without input, not that it is fast.", "tri"),
        N("GEN2.ENTROPY", "concept", "Entropy and its molecular interpretation",
          "Dispersal of energy and matter, not disorder in the everyday sense.", "tri"),
        N("GEN2.STANDARDENTROPY", "computational", "Standard molar entropy and reaction entropy",
          "Tabulated values and the sign you should predict first."),
        N("GEN2.SURROUNDINGS", "computational", "Entropy change of the surroundings",
          "Why an exothermic reaction increases the entropy of everything else."),
        N("GEN2.GIBBS", "computational", "Gibbs free energy and spontaneity",
          "One criterion combining enthalpy, entropy and temperature."),
        N("GEN2.GIBBSCASES", "concept", "Temperature dependence and the four cases",
          "When a reaction switches from spontaneous to not."),
        N("GEN2.GIBBSFORMATION", "computational", "Standard free energy of formation",
          "Tabulated values used the same way as formation enthalpies."),
        N("GEN2.NONSTANDARD", "computational", "Free energy under nonstandard conditions",
          "The correction term that vanishes at equilibrium."),
        N("GEN2.GIBBSK", "computational", "Relating free energy to the equilibrium constant",
          "The bridge between thermodynamics and equilibrium."),
    ]),
    U("GEN2-U7", "Electrochemistry", "Ch 17", [
        N("GEN2.BALANCEREDOX", "computational", "Balancing redox reactions",
          "Half reaction method in acidic and basic solution."),
        N("GEN2.GALVANIC", "concept", "Galvanic cells and cell notation",
          "Turning a redox reaction into a current.", "lab tri"),
        N("GEN2.REDUCTIONPOTENTIAL", "computational", "Standard reduction potentials",
          "One table, and the sign conventions that make it work."),
        N("GEN2.CELLPOTENTIAL", "computational", "Cell potential, free energy and K",
          "Three ways of stating the same driving force."),
        N("GEN2.NERNST", "computational", "The Nernst equation and concentration cells",
          "Cell potential away from standard conditions."),
        N("GEN2.BATTERIES", "concept", "Batteries and fuel cells",
          "Practical cells and why they run down."),
        N("GEN2.CORROSION", "concept", "Corrosion and its prevention",
          "Electrochemistry happening where nobody wanted it.", "lab"),
        N("GEN2.ELECTROLYSIS", "computational", "Electrolysis and Faraday's laws",
          "Driving a nonspontaneous reaction, and counting the electrons."),
    ]),
    U("GEN2-U8", "Transition Metals and Coordination Chemistry", "Ch 18-19", [
        N("GEN2.TRANSITIONMETALS", "concept", "Transition metal properties",
          "Variable oxidation states and d electron configurations."),
        N("GEN2.COORDINATION", "concept", "Coordination compounds",
          "Ligands, coordination number and the coordination sphere."),
        N("GEN2.COORDNOMEN", "computational", "Nomenclature of coordination compounds",
          "Naming ligands, metals and oxidation states in order."),
        N("GEN2.COORDISOMERISM", "concept", "Isomerism in coordination compounds",
          "Geometric and optical isomers of complexes."),
        N("GEN2.CRYSTALFIELD", "concept", "Crystal field theory",
          "d orbital splitting explains color and magnetism.", "tri"),
        N("GEN2.MAINGROUP", "concept", "Main group descriptive chemistry",
          "Representative metals, metalloids and nonmetals in survey."),
    ]),
    U("GEN2-U9", "Nuclear Chemistry", "Ch 20", [
        N("GEN2.NUCLEARSTABILITY", "concept", "Nuclear structure and stability",
          "The band of stability and what falls off it."),
        N("GEN2.DECAYMODES", "computational", "Radioactive decay modes",
          "Alpha, beta, positron, capture and gamma, with balanced equations."),
        N("GEN2.NUCLEARHALFLIFE", "computational", "Half life and radioactive dating",
          "First order decay applied to carbon 14 and beyond."),
        N("GEN2.BINDINGENERGY", "computational", "Mass defect and binding energy",
          "Why nuclear energies dwarf chemical ones."),
        N("GEN2.FISSIONFUSION", "concept", "Fission and fusion",
          "Two routes to energy from the curve of binding energy."),
        N("GEN2.RADIATIONEFFECTS", "concept", "Biological effects and applications",
          "Dose, shielding, and medical uses.", "lab"),
    ]),
]

GEN2_UNIT_PREREQS = {
    "GEN2-U1": ["GEN1.STOICH", "GEN1.MOLARITY"],
    "GEN2-U2": ["GEN2.RDS"],
    "GEN2-U3": ["GEN2.ICE", "GEN1.NEUTRALIZATION"],
    "GEN2-U4": ["GEN2.WEAKACID", "GEN1.TITRATIONBASIC"],
    "GEN2-U5": ["GEN2.ICE", "GEN1.SOLUBILITY"],
    "GEN2-U6": ["GEN1.HESS", "GEN1.FORMATION"],
    "GEN2-U7": ["GEN1.OXNUMBERS", "GEN2.GIBBSK"],
    "GEN2-U8": ["GEN1.CONFIGEXCEPTIONS", "GEN2.COMPLEXION"],
    "GEN2-U9": ["GEN1.ISOTOPES", "GEN2.HALFLIFE"],
}

GEN2_EXTRA_EDGES = [
    ("GEN2.QUOTIENT", "GEN2.PRECIPITATION"),
    ("GEN2.LECHATELIER", "GEN2.COMMONION"),
    ("GEN2.EQUILIBRIUM", "GEN2.GIBBSK"),
    ("GEN2.PH", "GEN2.TITRATIONSTRONG"),
    ("GEN2.HENDERSON", "GEN2.TITRATIONWEAK"),
    ("GEN2.KAKB", "GEN2.SALTHYDROLYSIS"),
    ("GEN2.INTEGRATED", "GEN2.NUCLEARHALFLIFE"),
    ("GEN1.IONIZATION", "GEN2.CRYSTALFIELD"),
]

GEN2_MISCONCEPTIONS = [
    M("GEN2M01", "Order read off coefficients",
      "Takes reaction order from stoichiometric coefficients instead of data.",
      "GEN2.RATELAW"),
    M("GEN2M02", "Catalyst consumed",
      "Believes a catalyst is used up, or that it changes the equilibrium position.",
      "GEN2.CATALYSIS"),
    M("GEN2M03", "Equilibrium means equal concentrations",
      "Reads equilibrium as equal amounts rather than equal rates.",
      "GEN2.EQUILIBRIUM"),
    M("GEN2M04", "Equilibrium means the reaction stopped",
      "Pictures a static system rather than a dynamic one.",
      "GEN2.EQUILIBRIUM"),
    M("GEN2M05", "Le Chatelier as universal predictor",
      "Applies the principle to catalysts, inert gases or K itself.",
      "GEN2.LECHATELIER"),
    M("GEN2M06", "Strong acid means concentrated",
      "Conflates extent of ionization with amount dissolved.",
      "GEN2.STRONGACID"),
    M("GEN2M07", "Neutral means pH 7 always",
      "Ignores temperature dependence of Kw and equivalence points of weak acids.",
      "GEN2.AMPHOTERIC"),
    M("GEN2M08", "Buffer means unchanging pH",
      "Believes a buffer holds pH constant rather than resisting change.",
      "GEN2.BUFFER"),
    M("GEN2M09", "Approximation never checked",
      "Uses the small x approximation without validating the five percent rule.",
      "GEN2.APPROXIMATION"),
    M("GEN2M10", "Ksp compared directly across salts",
      "Ranks solubility by Ksp values for salts with different ion counts.",
      "GEN2.KSP"),
    M("GEN2M11", "Entropy as messiness",
      "Uses everyday disorder instead of energy and matter dispersal.",
      "GEN2.ENTROPY"),
    M("GEN2M12", "Spontaneous means fast",
      "Confuses thermodynamic favorability with kinetic accessibility.",
      "GEN2.SPONTANEITY"),
    M("GEN2M13", "Cell potential scaled by coefficients",
      "Multiplies standard potentials when scaling a half reaction.",
      "GEN2.REDUCTIONPOTENTIAL"),
    M("GEN2M14", "Oxidation happens at the cathode",
      "Reverses the electrode definitions.",
      "GEN2.GALVANIC"),
]


# ===========================================================================
# Assembly and integrity checking
# ===========================================================================

def _course(cid: str, title: str, semester: str, units, unit_prereqs,
            extra_edges, misconceptions) -> dict:
    return {"id": cid, "title": title, "semester": semester, "units": units,
            "unit_prereqs": unit_prereqs, "extra_edges": extra_edges,
            "misconceptions": misconceptions}


def generate_edges(course: dict) -> list[tuple[str, str]]:
    """Chain nodes inside each unit, attach units to their declared
    prerequisites, then add the explicit non-linear edges."""
    edges: list[tuple[str, str]] = []
    for unit in course["units"]:
        ids = [n["id"] for n in unit["nodes"]]
        edges += list(zip(ids, ids[1:]))
        for src in course["unit_prereqs"].get(unit["id"], []):
            edges.append((src, ids[0]))
    edges += [tuple(e) for e in course["extra_edges"]]
    return edges


def build() -> dict:
    courses = [
        _course("GEN1", "General Chemistry I", "Year 1 semester 1",
                GEN1_UNITS, GEN1_UNIT_PREREQS, GEN1_EXTRA_EDGES,
                GEN1_MISCONCEPTIONS),
        _course("GEN2", "General Chemistry II", "Year 1 semester 2",
                GEN2_UNITS, GEN2_UNIT_PREREQS, GEN2_EXTRA_EDGES,
                GEN2_MISCONCEPTIONS),
    ]
    for c in courses:
        c["edges"] = generate_edges(c)
    return {"program": "OCTET", "courses": courses}


#: Nodes that live in a course other than the one their id names.
#:
#: A node id is a STABLE KEY, not a location. It is the join column for lesson
#: files, item templates, the misconception routing table and the MCAT mapping,
#: and the Learn IA states that ids are never shown to a learner. When the
#: organic sequence was rechaptered, spectroscopy and alkynes moved from ORG1
#: into ORG2; renaming those fifteen nodes to match would have broken four
#: systems to fix a mismatch nobody sees.
#:
#: The prefix check still runs. It is an integrity rule worth keeping, because
#: an id that silently disagrees with its course is otherwise unnoticeable. So
#: the exceptions are enumerated here instead of the rule being deleted: any
#: node that drifts out of its course WITHOUT being listed still fails.
MOVED_NODES = {
    # ORG1 unit 10 (structure determination) -> ORG2 chapters 3 and 4
    "ORG1.IRREGIONS", "ORG1.IRINTERPRET", "ORG1.MSBASICS", "ORG1.MSFRAGMENT",
    "ORG1.NMRTHEORY", "ORG1.NMRINTEGRATION", "ORG1.NMRSPLITTING",
    "ORG1.CARBONNMR", "ORG1.ELUCIDATION",
    # ORG1 unit 7 (alkynes) -> ORG2 chapter 5
    "ORG1.ALKYNENOMEN", "ORG1.ACETYLIDE", "ORG1.ALKYNEADDITION",
    "ORG1.TAUTOMER", "ORG1.ALKYNEREDUCTION", "ORG1.ALKYNESYNTH",
    # allylic bromination and organometallic coupling -> ORG2 chapters 8 and 9
    "ORG1.ALLYLIC", "ORG1.COUPLING",
}


def check(cur: dict) -> list[str]:
    problems: list[str] = []
    node_ids: set[str] = set()
    for c in cur["courses"]:
        for u in c["units"]:
            for n in u["nodes"]:
                if n["id"] in node_ids:
                    problems.append(f"duplicate node id {n['id']}")
                node_ids.add(n["id"])

    adjacency: dict[str, list[str]] = {nid: [] for nid in node_ids}
    for c in cur["courses"]:
        for src, dst in c["edges"]:
            if src not in node_ids:
                problems.append(f"{c['id']}: edge from unknown node {src}")
                continue
            if dst not in node_ids:
                problems.append(f"{c['id']}: edge to unknown node {dst}")
                continue
            adjacency[src].append(dst)
        for m in c["misconceptions"]:
            if m["routes_to"] not in node_ids:
                problems.append(
                    f"{c['id']}: misconception {m['code']} routes to unknown "
                    f"node {m['routes_to']}")

    # Cycle detection over the union graph.
    WHITE, GREY, BLACK = 0, 1, 2
    colour = {nid: WHITE for nid in node_ids}

    def visit(start: str) -> bool:
        stack = [(start, iter(adjacency[start]))]
        colour[start] = GREY
        while stack:
            node, children = stack[-1]
            advanced = False
            for child in children:
                if colour[child] == GREY:
                    problems.append(f"cycle involving {node} -> {child}")
                    return True
                if colour[child] == WHITE:
                    colour[child] = GREY
                    stack.append((child, iter(adjacency[child])))
                    advanced = True
                    break
            if not advanced:
                colour[node] = BLACK
                stack.pop()
        return False

    for nid in sorted(node_ids):
        if colour[nid] == WHITE and visit(nid):
            break

    for c in cur["courses"]:
        for u in c["units"]:
            if not u["nodes"]:
                problems.append(f"{c['id']}: unit {u['id']} has no nodes")
            for n in u["nodes"]:
                if not re.fullmatch(r"[A-Z0-9]+\.[A-Z0-9]+", n["id"]):
                    problems.append(
                        f"{c['id']}: node id {n['id']!r} is not COURSE.TOPIC "
                        f"in uppercase alphanumerics")
                if (not n["id"].startswith(c["id"] + ".")
                        and n["id"] not in MOVED_NODES):
                    problems.append(
                        f"{c['id']}: node id {n['id']!r} does not carry its "
                        f"course prefix and is not a declared move")
    return problems


def summarize(cur: dict) -> None:
    total_nodes = total_edges = total_misc = 0
    for c in cur["courses"]:
        n = sum(len(u["nodes"]) for u in c["units"])
        print(f"  {c['id']:5s} {c['title']:28s} {len(c['units']):2d} units  "
              f"{n:3d} nodes  {len(c['edges']):3d} edges  "
              f"{len(c['misconceptions']):2d} misconceptions")
        total_nodes += n
        total_edges += len(c["edges"])
        total_misc += len(c["misconceptions"])
    print(f"  {'':5s} {'TOTAL':28s} "
          f"{sum(len(c['units']) for c in cur['courses']):2d} units  "
          f"{total_nodes:3d} nodes  {total_edges:3d} edges  "
          f"{total_misc:2d} misconceptions")


if __name__ == "__main__":
    cur = build()
    print("OCTET general chemistry")
    summarize(cur)
    probs = check(cur)
    print(f"integrity problems: {len(probs)}")
    for p in probs:
        print("  PROBLEM:", p)
    with open("octet_gen_curriculum.json", "w") as f:
        json.dump(cur, f, indent=2)
    print("wrote octet_gen_curriculum.json")
