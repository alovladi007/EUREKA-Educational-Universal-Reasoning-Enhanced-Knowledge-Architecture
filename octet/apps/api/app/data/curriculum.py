"""The OCTET general chemistry knowledge graph.

Phase 2 scope: CF (12 nodes), G1 (24), G2 (24). Sixty nodes total.

Node codes are C.{TIER}.{TOPIC}. The tier prefixes are:
  CF  Chemical Foundations. Measurement, matter, atoms, naming, safety.
  G1  General Chemistry 1. Moles through thermochemistry and structure.
  G2  General Chemistry 2. Bonding through electrochemistry and nuclear.

Edges are prerequisites and the graph must stay acyclic. The compliance
checker (app/compliance.py) enforces that, plus the rule that every
misconception's routes_to target exists here.

Ordering principle: a node's prerequisites are the ideas a learner must
already hold for the new idea to attach to anything. That is the "build on"
line in every lesson, and it is why the graph exists rather than a flat list.
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class Node:
    code: str
    title: str
    tier: str
    summary: str
    # Nodes that carry a lab or hazard dimension open with the safety node.
    lab_adjacent: bool = False
    # Concepts where the macroscopic, particulate and symbolic views are all
    # meaningful. Phase 3 must ship a triangle_view for each of these.
    triangle_eligible: bool = False


NODES: tuple[Node, ...] = (
    # ---------------- CF: Chemical Foundations (12) ----------------
    Node("C.CF.SAFETY", "Laboratory safety and GHS hazard literacy", "CF",
         "Reading a hazard pictogram, a safety data sheet, and knowing what to do before you touch anything.",
         lab_adjacent=True),
    Node("C.CF.MATTER", "Matter, pure substances and mixtures", "CF",
         "What counts as a substance, and how mixtures differ from compounds.",
         triangle_eligible=True),
    Node("C.CF.PROPERTIES", "Physical and chemical properties and changes", "CF",
         "Telling a change of state from a change of substance.",
         triangle_eligible=True),
    Node("C.CF.MEASURE", "Measurement, units and significant figures", "CF",
         "Why a measurement carries a precision, and how that precision survives arithmetic."),
    Node("C.CF.DIMANAL", "Dimensional analysis", "CF",
         "Converting between units by carrying the units through the algebra."),
    Node("C.CF.DENSITY", "Density and derived quantities", "CF",
         "A ratio of two measurements, and the first place dimensional analysis earns its keep.",
         lab_adjacent=True),
    Node("C.CF.ATOMICTHEORY", "Atomic theory and subatomic particles", "CF",
         "Protons, neutrons and electrons, and what each one determines.",
         triangle_eligible=True),
    Node("C.CF.ISOTOPES", "Isotopes and average atomic mass", "CF",
         "Why the periodic table mass is rarely a whole number."),
    Node("C.CF.PERIODICTABLE", "Reading the periodic table", "CF",
         "Groups, periods, metals and nonmetals, and what position predicts."),
    Node("C.CF.IONS", "Ions, charge and the octet pattern", "CF",
         "Which ions elements tend to form, and why the pattern is a summary rather than a motive.",
         triangle_eligible=True),
    Node("C.CF.NOMENCLATURE", "Naming ionic and molecular compounds", "CF",
         "The naming rules that let a formula and a name carry the same information."),
    Node("C.CF.ENERGYBASICS", "Energy, heat and temperature", "CF",
         "Distinguishing thermal energy from temperature, and both from heat.",
         triangle_eligible=True),

    # ---------------- G1: General Chemistry 1 (24) ----------------
    Node("C.G1.FORMULA", "Molecular and empirical formulas", "G1",
         "What a formula does and does not tell you about a substance.",
         triangle_eligible=True),
    Node("C.G1.MOLE", "The mole and molar mass", "G1",
         "Counting by weighing, which is the central move of quantitative chemistry.",
         triangle_eligible=True),
    Node("C.G1.PERCENTCOMP", "Percent composition", "G1",
         "Turning a formula into mass fractions."),
    Node("C.G1.EMPIRICAL", "Empirical formula from composition data", "G1",
         "Running percent composition backwards to recover a formula.",
         lab_adjacent=True),
    Node("C.G1.CONSERVATION", "Conservation of mass and atoms", "G1",
         "Reactions rearrange atoms and never create or destroy them.",
         triangle_eligible=True),
    Node("C.G1.BALANCE", "Balancing chemical equations", "G1",
         "Coefficients change, subscripts never do.",
         triangle_eligible=True),
    Node("C.G1.REACTIONTYPES", "Classifying reactions", "G1",
         "Synthesis, decomposition, single and double replacement, combustion."),
    Node("C.G1.IONIC", "Ionic compounds and polyatomic ions", "G1",
         "Lattices rather than molecules, and the ions that travel intact.",
         triangle_eligible=True),
    Node("C.G1.SOLUBILITY", "Solubility rules and precipitation", "G1",
         "Predicting which product leaves solution as a solid.",
         lab_adjacent=True, triangle_eligible=True),
    Node("C.G1.NETIONIC", "Net ionic equations", "G1",
         "Writing only the species that actually change."),
    Node("C.G1.STOICH", "Stoichiometry", "G1",
         "Mass to moles, across the balanced equation, back to mass."),
    Node("C.G1.LIMITING", "Limiting reactant and percent yield", "G1",
         "Which reactant runs out first, and why real yields fall short.",
         lab_adjacent=True),
    Node("C.G1.MOLARITY", "Solution concentration", "G1",
         "Molarity as moles per litre of solution, not of solvent.",
         lab_adjacent=True),
    Node("C.G1.DILUTION", "Dilution", "G1",
         "Adding solvent changes concentration and never the amount of solute."),
    Node("C.G1.TITRATIONBASIC", "Titration calculations", "G1",
         "Using a known concentration to measure an unknown one.",
         lab_adjacent=True),
    Node("C.G1.GASLAWS", "The ideal gas law", "G1",
         "One equation that ties pressure, volume, temperature and amount.",
         triangle_eligible=True),
    Node("C.G1.GASMIX", "Partial pressures and gas stoichiometry", "G1",
         "Mixtures of gases, and reactions that produce or consume them."),
    Node("C.G1.THERMOBASIC", "Heat transfer and calorimetry", "G1",
         "Measuring energy change by watching temperature change.",
         lab_adjacent=True),
    Node("C.G1.ENTHALPY", "Enthalpy of reaction", "G1",
         "Heat at constant pressure, and the sign convention that trips everyone."),
    Node("C.G1.HESS", "Hess's law", "G1",
         "Enthalpy is a state function, so routes can be added."),
    Node("C.G1.ELECTRONCONFIG", "Electron configuration", "G1",
         "Filling orbitals in order, and the exceptions worth knowing."),
    Node("C.G1.QUANTUM", "Quantum numbers and orbital shapes", "G1",
         "The four numbers that address an electron.",
         triangle_eligible=True),
    Node("C.G1.PERIODICTRENDS", "Periodic trends", "G1",
         "Radius, ionization energy and electronegativity, explained by shielding and charge."),
    Node("C.G1.LEWISBASIC", "Lewis structures", "G1",
         "Accounting for valence electrons on paper.",
         triangle_eligible=True),

    # ---------------- G2: General Chemistry 2 (24) ----------------
    Node("C.G2.BONDING", "Ionic, covalent and metallic bonding", "G2",
         "What holds substances together, and why that predicts their behaviour.",
         triangle_eligible=True),
    Node("C.G2.VSEPR", "Molecular geometry", "G2",
         "Electron domains set the shape, and shape sets almost everything else.",
         triangle_eligible=True),
    Node("C.G2.POLARITY", "Polarity and dipole moments", "G2",
         "Bond polarity plus geometry gives molecular polarity.",
         triangle_eligible=True),
    Node("C.G2.IMF", "Intermolecular forces", "G2",
         "The forces between molecules, which set boiling point and solubility.",
         triangle_eligible=True),
    Node("C.G2.SOLUTIONS", "Solutions and colligative properties", "G2",
         "Why dissolving something changes freezing and boiling points."),
    Node("C.G2.KINETICS", "Reaction rates", "G2",
         "How fast, and what changes it.",
         lab_adjacent=True),
    Node("C.G2.RATELAW", "Rate laws and reaction order", "G2",
         "Order is measured, never read off the balanced equation.",
         lab_adjacent=True),
    Node("C.G2.MECHANISM", "Mechanisms and the rate determining step", "G2",
         "A balanced equation is a summary, the mechanism is the story."),
    Node("C.G2.ARRHENIUS", "Activation energy and the Arrhenius equation", "G2",
         "Temperature dependence, and what a catalyst actually does."),
    Node("C.G2.EQUILIBRIUM", "Chemical equilibrium and K", "G2",
         "Forward and reverse rates equal, concentrations constant, reaction still running.",
         triangle_eligible=True),
    Node("C.G2.ICE", "ICE tables", "G2",
         "The bookkeeping that turns an equilibrium into one unknown."),
    Node("C.G2.LECHATELIER", "Le Chatelier's principle", "G2",
         "Stress shifts position. Only temperature changes K.",
         triangle_eligible=True),
    Node("C.G2.ACIDBASE", "Acids, bases and conjugate pairs", "G2",
         "Proton donors and acceptors, and what conjugate really means."),
    Node("C.G2.PH", "pH, pOH and the water equilibrium", "G2",
         "A logarithmic scale, and the reason it has the range it does."),
    Node("C.G2.WEAKACID", "Weak acid and weak base equilibria", "G2",
         "Partial ionization, and when the small x approximation is honest."),
    Node("C.G2.BUFFER", "Buffers and the Henderson Hasselbalch equation", "G2",
         "Why some solutions resist pH change, and where that fails.",
         lab_adjacent=True),
    Node("C.G2.TITRATIONCURVE", "Titration curves", "G2",
         "Reading equivalence point, half equivalence and buffer region off a curve.",
         lab_adjacent=True, triangle_eligible=True),
    Node("C.G2.KSP", "Solubility equilibria", "G2",
         "Equilibrium applied to sparingly soluble salts, and the common ion effect."),
    Node("C.G2.ENTROPY", "Entropy and the second law", "G2",
         "Dispersal of energy and matter, not disorder in the everyday sense.",
         triangle_eligible=True),
    Node("C.G2.GIBBS", "Gibbs free energy and spontaneity", "G2",
         "One criterion that combines enthalpy, entropy and temperature."),
    Node("C.G2.REDOX", "Oxidation and reduction", "G2",
         "Tracking electrons with oxidation numbers, and balancing half reactions."),
    Node("C.G2.ELECTROCHEM", "Electrochemical cells", "G2",
         "Turning a redox reaction into a current, or a current into a reaction.",
         lab_adjacent=True, triangle_eligible=True),
    Node("C.G2.NERNST", "The Nernst equation", "G2",
         "Cell potential away from standard conditions."),
    Node("C.G2.NUCLEAR", "Nuclear chemistry", "G2",
         "Decay modes, half life, and why nuclear energies dwarf chemical ones.",
         lab_adjacent=True),
)


# Prerequisite edges: (prerequisite_code, dependent_code).
EDGES: tuple[tuple[str, str], ...] = (
    # CF internal ordering
    ("C.CF.MATTER", "C.CF.PROPERTIES"),
    ("C.CF.MEASURE", "C.CF.DIMANAL"),
    ("C.CF.DIMANAL", "C.CF.DENSITY"),
    ("C.CF.SAFETY", "C.CF.DENSITY"),
    ("C.CF.MATTER", "C.CF.ATOMICTHEORY"),
    ("C.CF.ATOMICTHEORY", "C.CF.ISOTOPES"),
    ("C.CF.MEASURE", "C.CF.ISOTOPES"),
    ("C.CF.ATOMICTHEORY", "C.CF.PERIODICTABLE"),
    ("C.CF.PERIODICTABLE", "C.CF.IONS"),
    ("C.CF.IONS", "C.CF.NOMENCLATURE"),
    ("C.CF.PROPERTIES", "C.CF.ENERGYBASICS"),
    ("C.CF.MEASURE", "C.CF.ENERGYBASICS"),

    # CF into G1
    ("C.CF.NOMENCLATURE", "C.G1.FORMULA"),
    ("C.CF.ISOTOPES", "C.G1.MOLE"),
    ("C.G1.FORMULA", "C.G1.MOLE"),
    ("C.CF.DIMANAL", "C.G1.MOLE"),

    # G1 internal
    ("C.G1.MOLE", "C.G1.PERCENTCOMP"),
    ("C.G1.PERCENTCOMP", "C.G1.EMPIRICAL"),
    ("C.G1.FORMULA", "C.G1.EMPIRICAL"),
    ("C.CF.ATOMICTHEORY", "C.G1.CONSERVATION"),
    ("C.G1.CONSERVATION", "C.G1.BALANCE"),
    ("C.G1.FORMULA", "C.G1.BALANCE"),
    ("C.G1.BALANCE", "C.G1.REACTIONTYPES"),
    ("C.CF.IONS", "C.G1.IONIC"),
    ("C.G1.IONIC", "C.G1.SOLUBILITY"),
    ("C.G1.BALANCE", "C.G1.SOLUBILITY"),
    ("C.G1.SOLUBILITY", "C.G1.NETIONIC"),
    ("C.G1.IONIC", "C.G1.NETIONIC"),
    ("C.G1.MOLE", "C.G1.STOICH"),
    ("C.G1.BALANCE", "C.G1.STOICH"),
    ("C.G1.STOICH", "C.G1.LIMITING"),
    ("C.G1.MOLE", "C.G1.MOLARITY"),
    ("C.G1.MOLARITY", "C.G1.DILUTION"),
    ("C.G1.MOLARITY", "C.G1.TITRATIONBASIC"),
    ("C.G1.STOICH", "C.G1.TITRATIONBASIC"),
    ("C.CF.MEASURE", "C.G1.GASLAWS"),
    ("C.G1.MOLE", "C.G1.GASLAWS"),
    ("C.G1.GASLAWS", "C.G1.GASMIX"),
    ("C.G1.STOICH", "C.G1.GASMIX"),
    ("C.CF.ENERGYBASICS", "C.G1.THERMOBASIC"),
    ("C.G1.THERMOBASIC", "C.G1.ENTHALPY"),
    ("C.G1.STOICH", "C.G1.ENTHALPY"),
    ("C.G1.ENTHALPY", "C.G1.HESS"),
    ("C.CF.PERIODICTABLE", "C.G1.ELECTRONCONFIG"),
    ("C.G1.ELECTRONCONFIG", "C.G1.QUANTUM"),
    ("C.G1.ELECTRONCONFIG", "C.G1.PERIODICTRENDS"),
    ("C.CF.PERIODICTABLE", "C.G1.PERIODICTRENDS"),
    ("C.CF.IONS", "C.G1.LEWISBASIC"),
    ("C.G1.ELECTRONCONFIG", "C.G1.LEWISBASIC"),

    # G1 into G2
    ("C.G1.LEWISBASIC", "C.G2.BONDING"),
    ("C.G1.PERIODICTRENDS", "C.G2.BONDING"),
    ("C.G1.LEWISBASIC", "C.G2.VSEPR"),
    ("C.G2.VSEPR", "C.G2.POLARITY"),
    ("C.G1.PERIODICTRENDS", "C.G2.POLARITY"),
    ("C.G2.POLARITY", "C.G2.IMF"),
    ("C.G2.IMF", "C.G2.SOLUTIONS"),
    ("C.G1.MOLARITY", "C.G2.SOLUTIONS"),

    # G2 kinetics chain
    ("C.G1.STOICH", "C.G2.KINETICS"),
    ("C.G2.KINETICS", "C.G2.RATELAW"),
    ("C.G2.RATELAW", "C.G2.MECHANISM"),
    ("C.G2.KINETICS", "C.G2.ARRHENIUS"),

    # G2 equilibrium chain
    ("C.G2.KINETICS", "C.G2.EQUILIBRIUM"),
    ("C.G1.STOICH", "C.G2.EQUILIBRIUM"),
    ("C.G2.EQUILIBRIUM", "C.G2.ICE"),
    ("C.G2.EQUILIBRIUM", "C.G2.LECHATELIER"),
    ("C.G2.ICE", "C.G2.WEAKACID"),
    ("C.G2.ACIDBASE", "C.G2.PH"),
    ("C.G1.IONIC", "C.G2.ACIDBASE"),
    ("C.G2.PH", "C.G2.WEAKACID"),
    ("C.G2.WEAKACID", "C.G2.BUFFER"),
    ("C.G2.BUFFER", "C.G2.TITRATIONCURVE"),
    ("C.G1.TITRATIONBASIC", "C.G2.TITRATIONCURVE"),
    ("C.G2.ICE", "C.G2.KSP"),
    ("C.G1.SOLUBILITY", "C.G2.KSP"),

    # G2 thermodynamics and electrochemistry
    ("C.G1.HESS", "C.G2.ENTROPY"),
    ("C.G2.ENTROPY", "C.G2.GIBBS"),
    ("C.G1.ENTHALPY", "C.G2.GIBBS"),
    ("C.G2.EQUILIBRIUM", "C.G2.GIBBS"),
    ("C.G1.BALANCE", "C.G2.REDOX"),
    ("C.CF.IONS", "C.G2.REDOX"),
    ("C.G2.REDOX", "C.G2.ELECTROCHEM"),
    ("C.G2.GIBBS", "C.G2.ELECTROCHEM"),
    ("C.G2.ELECTROCHEM", "C.G2.NERNST"),
    ("C.G2.EQUILIBRIUM", "C.G2.NERNST"),
    ("C.CF.ISOTOPES", "C.G2.NUCLEAR"),
    ("C.G2.KINETICS", "C.G2.NUCLEAR"),
)


NODES_BY_CODE = {n.code: n for n in NODES}


def tier_counts() -> dict[str, int]:
    counts: dict[str, int] = {}
    for n in NODES:
        counts[n.tier] = counts.get(n.tier, 0) + 1
    return counts


def prerequisites_of(code: str) -> list[str]:
    return [a for a, b in EDGES if b == code]


def topological_order() -> list[str] | None:
    """Kahn's algorithm. Returns None when the graph has a cycle."""
    indegree = {n.code: 0 for n in NODES}
    adjacency: dict[str, list[str]] = {n.code: [] for n in NODES}
    for a, b in EDGES:
        if a not in indegree or b not in indegree:
            return None
        adjacency[a].append(b)
        indegree[b] += 1
    queue = [c for c, d in indegree.items() if d == 0]
    order: list[str] = []
    while queue:
        queue.sort()
        current = queue.pop(0)
        order.append(current)
        for nxt in adjacency[current]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                queue.append(nxt)
    return order if len(order) == len(NODES) else None
