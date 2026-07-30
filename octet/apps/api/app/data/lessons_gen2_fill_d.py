"""GEN2 fill D: the missing electrochemistry, coordination and nuclear lessons.

Seventeen lessons that were absent from LESSONS across three GEN2 units:

  GEN2-U7 Electrochemistry:            BALANCEREDOX, REDUCTIONPOTENTIAL,
                                       CELLPOTENTIAL, BATTERIES, CORROSION,
                                       ELECTROLYSIS
  GEN2-U8 Coordination chemistry:      TRANSITIONMETALS, COORDINATION,
                                       COORDNOMEN, COORDISOMERISM,
                                       CRYSTALFIELD, MAINGROUP
  GEN2-U9 Nuclear chemistry:           DECAYMODES, NUCLEARHALFLIFE,
                                       BINDINGENERGY, FISSIONFUSION,
                                       RADIATIONEFFECTS

Each follows the six part arc in app/data/lesson_types.py and matches the GEN
voice of lessons_gen1.py and lessons_gen2.py: second person, concrete before
abstract, numbers worked in full.

Every measured or defined constant stated in prose carries a Source claim. The
standard reduction potentials are the CRC electrochemical series rounded to two
decimals; the Faraday and gas constants, Planck constant, speed of light,
Avogadro constant, atomic masses and half lives are cited to CRC or OpenStax.
Where a molecule appears as a ligand, a Formula claim re-derives it from
structure. The nuclear unit teaches decay, half life, binding energy and dating
only; it carries no route, quantity or condition for assembling anything.
"""

from __future__ import annotations

from app.data.claims import Formula, Source
from app.data.lesson_types import Lesson

# Citations reused across lessons, named once so they cannot drift.
CRC_ESERIES = (
    "CRC Handbook of Chemistry and Physics, 97th ed., Electrochemical Series "
    "(standard reduction potentials at 25 C)"
)
CRC_CONSTANTS = "CRC Handbook of Chemistry and Physics, table of fundamental physical constants"
CRC_ATOMICWT = "CRC Handbook of Chemistry and Physics, table of standard atomic weights"
CRC_NUCLIDES = "CRC Handbook of Chemistry and Physics, table of the isotopes (atomic masses)"
OPENSTAX_ECHEM = "OpenStax Chemistry 2e, Ch 17 Electrochemistry"
OPENSTAX_NUCLEAR = "OpenStax Chemistry 2e, Ch 21 Nuclear Chemistry"

LESSONS_GEN2_FILL_D: dict[str, Lesson] = {
    "GEN2.BALANCEREDOX": Lesson(
        node="GEN2.BALANCEREDOX",
        objective=(
            "Balance a redox reaction by the half reaction method in both acidic "
            "and basic solution."
        ),
        build_on=(
            "You learned to assign oxidation numbers and pick out which atoms are "
            "oxidised and which are reduced, and the half reaction method splits "
            "the equation along exactly that line so the electrons can be made to "
            "match."
        ),
        core_idea=(
            "A redox equation has a second bookkeeping job beyond the usual "
            "atom count: the electrons lost by one species must equal the "
            "electrons gained by the other, and that is what ordinary balancing "
            "misses. The half reaction method separates the reaction into an "
            "oxidation half and a reduction half, balances each one completely, "
            "then scales the two so the electrons cancel when you add them back. "
            "For each half you balance the main atoms first, then oxygen by "
            "adding H2O, then hydrogen by adding H+, and finally charge by adding "
            "electrons. That sequence assumes acidic solution. For basic "
            "solution you finish the acidic balance and then add enough OH- to "
            "both sides to neutralise every H+, turning each H+ and OH- pair into "
            "water and cancelling any water that then appears on both sides."
        ),
        worked_example=(
            "Balance MnO4- + Fe2+ -> Mn2+ + Fe3+ in acid. Oxidation half: Fe2+ -> "
            "Fe3+ + e-, already balanced in atoms, one electron lost. Reduction "
            "half: start with MnO4- -> Mn2+, manganese balanced. Balance oxygen "
            "by adding 4 H2O to the right: MnO4- -> Mn2+ + 4 H2O. Balance "
            "hydrogen by adding 8 H+ to the left: MnO4- + 8 H+ -> Mn2+ + 4 H2O. "
            "Balance charge: the left is -1 + 8 = +7 and the right is +2, so add "
            "5 electrons to the left to bring it to +2. That gives MnO4- + 8 H+ + "
            "5 e- -> Mn2+ + 4 H2O. Now scale so the electrons match: multiply the "
            "iron half by 5, giving 5 Fe2+ -> 5 Fe3+ + 5 e-. Add the two halves "
            "and the 5 e- cancel: MnO4- + 8 H+ + 5 Fe2+ -> Mn2+ + 4 H2O + 5 Fe3+. "
            "Check the charge as a final proof: left is -1 + 8 + 10 = +17 and "
            "right is +2 + 15 = +17, so it balances."
        ),
        try_it_prompt=(
            "Balance the reduction half reaction MnO4- -> MnO2 in basic solution. "
            "Balance it as if acidic first, then convert."
        ),
        try_it_answer=(
            "MnO4- + 2 H2O + 3 e- -> MnO2 + 4 OH-. In acid you get MnO4- + 4 H+ + "
            "3 e- -> MnO2 + 2 H2O; add 4 OH- to both sides, combine the 4 H+ and "
            "4 OH- into 4 H2O on the left, and cancel 2 H2O that appear on both "
            "sides. Final check: oxygen is 4 + 2 = 6 on each side, hydrogen is 4 "
            "on each side, and charge is -4 on each side."
        ),
        pitfall=(
            "The pitfall is balancing atoms while ignoring the electrons, the "
            "very thing that makes a reaction redox. If you scale the iron half "
            "by anything other than 5 the electrons do not cancel, and the sum "
            "carries a stray charge, which is the built in signal that the "
            "electron count was never reconciled."
        ),
        misconception=None,
        claims=(
            Source(
                "The half reaction method for balancing redox equations.",
                "OpenStax Chemistry 2e chapter 17",
            ),
        ),
    ),
    "GEN2.REDUCTIONPOTENTIAL": Lesson(
        node="GEN2.REDUCTIONPOTENTIAL",
        objective=(
            "Read standard reduction potentials from one table and use them to "
            "decide which species is reduced and whether a reaction is "
            "spontaneous."
        ),
        build_on=(
            "Galvanic cells introduced the standard hydrogen electrode as the "
            "zero point of voltage, and the table of reduction potentials is that "
            "same comparison carried out once for every half reaction."
        ),
        core_idea=(
            "Every reduction half reaction is measured against the hydrogen "
            "electrode, which is fixed at exactly 0.00 V by definition, and the "
            "results are collected in one table of standard reduction potentials. "
            "Read the table by sign and size: a more positive potential means the "
            "half reaction has a stronger pull to run as written, so that species "
            "is the better oxidising agent and gets reduced. A more negative "
            "potential means the reverse, that the species would rather be "
            "oxidised. Two rules make the table do work. First, when you pair two "
            "half reactions, the one with the more positive potential proceeds as "
            "a reduction and the other reverses to an oxidation. Second, the cell "
            "potential is E(cathode) - E(anode) using the reduction values of "
            "both as tabulated, and a positive result means the paired reaction "
            "is spontaneous. Reversing a half reaction flips the sign of its "
            "potential but never its magnitude, because potential is an intensive "
            "property that does not depend on how much you have."
        ),
        worked_example=(
            "Use these tabulated standard reduction potentials: Zn2+ + 2 e- -> Zn "
            "at -0.76 V, 2 H+ + 2 e- -> H2 at 0.00 V, and Cu2+ + 2 e- -> Cu at "
            "+0.34 V. Ask whether zinc metal dissolves in 1 M acid. Zinc must be "
            "oxidised, Zn -> Zn2+ + 2 e-, so its half sits at the anode, while H+ "
            "is reduced at the cathode. Compute E(cell) = E(cathode) - E(anode) = "
            "0.00 - (-0.76) = +0.76 V. The positive value says the reaction is "
            "spontaneous, so zinc does dissolve in acid, releasing hydrogen gas. "
            "Now ask the same of copper. E(cell) = 0.00 - (+0.34) = -0.34 V, which "
            "is negative, so copper does not dissolve in plain acid. That single "
            "sign difference is why a zinc nail fizzes in hydrochloric acid and a "
            "copper wire sits in it unchanged."
        ),
        try_it_prompt=(
            "Silver has Ag+ + e- -> Ag at +0.80 V. Using the hydrogen value of "
            "0.00 V, will silver metal dissolve in 1 M acid to give hydrogen gas?"
        ),
        try_it_answer=(
            "No. Silver would be the anode, so E(cell) = E(cathode) - E(anode) = "
            "0.00 - (+0.80) = -0.80 V, which is negative and therefore not "
            "spontaneous. Silver sitting above hydrogen in reduction potential is "
            "exactly why it resists acids that readily attack zinc or iron."
        ),
        pitfall=(
            "The pitfall is multiplying a potential when you scale a half "
            "reaction to balance electrons. Doubling Cu2+ + 2 e- -> Cu into 2 "
            "Cu2+ + 4 e- -> 2 Cu leaves the potential at +0.34 V, unchanged, "
            "because volts measure energy per charge and both the energy and the "
            "charge doubled together. Only the electron count n changes, and it "
            "matters later when you convert to free energy."
        ),
        misconception=None,
        claims=(
            Source("Zn2+ + 2 e- -> Zn has a standard reduction potential of -0.76 V", CRC_ESERIES),
            Source("2 H+ + 2 e- -> H2 defines the reference at 0.00 V", CRC_ESERIES),
            Source("Cu2+ + 2 e- -> Cu has a standard reduction potential of +0.34 V", CRC_ESERIES),
            Source("Ag+ + e- -> Ag has a standard reduction potential of +0.80 V", CRC_ESERIES),
        ),
    ),
    "GEN2.CELLPOTENTIAL": Lesson(
        node="GEN2.CELLPOTENTIAL",
        objective=(
            "Convert among a standard cell potential, the standard free energy "
            "change and the equilibrium constant for the same reaction."
        ),
        build_on=(
            "You can read a standard cell potential off the table of reduction "
            "potentials, and this lesson ties that voltage to the free energy and "
            "the equilibrium constant you already met in thermodynamics."
        ),
        core_idea=(
            "A standard cell potential, a standard free energy change and an "
            "equilibrium constant are three ways of stating one thing: how far "
            "and how hard a reaction wants to run. Two relations connect them. "
            "The first is delta G = -n * F * E, where n is the moles of electrons "
            "transferred and F = 96485 C/mol, so a positive E gives a negative "
            "delta G, meaning spontaneous. The second is delta G = -R * T * "
            "ln(K), the thermodynamics link you already have. Setting the two "
            "expressions for delta G equal gives ln(K) = n * F * E / (R * T), and "
            "at 25 C that collapses to the tidy form log(K) = n * E / 0.0592, "
            "using the same 0.0592 V factor derived in the Nernst lesson. The "
            "chain of signs is worth memorising as one fact: E positive means "
            "delta G negative means K greater than 1, all three saying the "
            "forward reaction is favoured."
        ),
        worked_example=(
            "Build a copper silver cell from Cu2+ + 2 e- -> Cu at +0.34 V and Ag+ "
            "+ e- -> Ag at +0.80 V. Silver has the more positive potential, so it "
            "is reduced at the cathode and copper is oxidised at the anode, giving "
            "Cu + 2 Ag+ -> Cu2+ + 2 Ag with n = 2 electrons. The standard cell "
            "potential is E(cell) = 0.80 - 0.34 = +0.46 V. Convert to free "
            "energy: delta G = -n * F * E = -(2)(96485 C/mol)(0.46 V) = -88766 "
            "J/mol, about -88.8 kJ/mol, and the negative sign confirms it is "
            "spontaneous. Convert to the equilibrium constant with the 25 C form: "
            "log(K) = n * E / 0.0592 = (2)(0.46) / 0.0592 = 15.5, so K = 10^15.5, "
            "roughly 3 x 10^15. All three numbers point the same way, and the "
            "very large K says the reaction runs nearly to completion."
        ),
        try_it_prompt=(
            "A different cell has E(cell) = +0.20 V with n = 2. Find delta G, and "
            "say whether K is greater or less than 1 without computing it."
        ),
        try_it_answer=(
            "delta G = -(2)(96485)(0.20) = -38594 J/mol, about -38.6 kJ/mol. "
            "Because E is positive, delta G is negative, and a negative delta G "
            "forces K greater than 1 through delta G = -R * T * ln(K). The sign "
            "alone settles the direction before any logarithm is taken."
        ),
        pitfall=(
            "The pitfall is forgetting that only delta G scales with the size of "
            "the reaction while E does not. If you double every coefficient, n "
            "doubles and delta G doubles with it, yet E(cell) stays at +0.46 V. "
            "Reading a doubled voltage off a doubled equation is the most common "
            "way this conversion goes wrong."
        ),
        misconception=None,
        claims=(
            Source("Cu2+ + 2 e- -> Cu has a standard reduction potential of +0.34 V", CRC_ESERIES),
            Source("Ag+ + e- -> Ag has a standard reduction potential of +0.80 V", CRC_ESERIES),
            Source("the Faraday constant F is 96485 C/mol", CRC_CONSTANTS),
            Source("the molar gas constant R is 8.314 J/(mol*K)", CRC_CONSTANTS),
        ),
    ),
    "GEN2.BATTERIES": Lesson(
        node="GEN2.BATTERIES",
        objective=(
            "Explain how practical cells package a redox reaction and why a "
            "battery loses voltage and eventually dies."
        ),
        build_on=(
            "The Nernst equation showed a cell's voltage falls as its reaction "
            "quotient climbs, and a battery running down is that same equation "
            "walking toward the point where Q equals K."
        ),
        core_idea=(
            "A battery is a galvanic cell built for delivery, with the two half "
            "reactions packed close together and the electron path routed through "
            "whatever you plug in. Primary cells, like the common alkaline cell, "
            "run their reaction once and are discarded. Secondary cells, like the "
            "lead storage battery in a car or the lithium ion cell in a phone, "
            "use a reaction that an external voltage can push backward, so they "
            "recharge. All of them lose voltage for the reason the Nernst "
            "equation gives: as the cell works, reactants are consumed and "
            "products build up, the reaction quotient Q rises, and E falls. A "
            "fully dead battery is a cell that has reached equilibrium, where Q = "
            "K and E = 0, with no driving force left. A fuel cell dodges this by "
            "never storing its reactants at all; it consumes fuel and oxygen fed "
            "in continuously, so it holds voltage as long as the supply lasts."
        ),
        worked_example=(
            "Consider a car's lead storage battery. Each of its cells produces "
            "close to 2.0 V, so to reach a nominal 12 V the manufacturer wires "
            "cells in series, and 12 / 2 = 6 cells gives the familiar rating. As "
            "the battery discharges, lead and lead dioxide and sulfuric acid are "
            "consumed while lead sulfate and water accumulate, so the reaction "
            "quotient rises and the measured voltage sags, which is why a tired "
            "battery reads below 12 V under load. Because the lead reaction "
            "reverses under an applied voltage, the alternator recharges it while "
            "the engine runs by driving current the opposite way, rebuilding the "
            "lead and lead dioxide and dropping Q back down. A primary alkaline "
            "cell offers no such reverse path, so once its reactants are spent it "
            "is finished."
        ),
        try_it_prompt=(
            "A battery pack is assembled from cells producing about 2 V each, "
            "wired in series to reach roughly 12 V. How many cells does that "
            "take, and would wiring them in parallel instead raise the voltage?"
        ),
        try_it_answer=(
            "Six cells, since 12 / 2 = 6, and they must be in series because "
            "series adds the individual voltages. Parallel wiring holds the "
            "voltage near 2 V and instead increases the current the pack can "
            "supply, so it would not reach 12 V."
        ),
        pitfall=(
            "The pitfall is thinking a bigger battery delivers a higher voltage. "
            "Voltage is set by the chemistry of one cell and by how many cells "
            "are stacked in series, not by physical size; a large and a small "
            "alkaline cell both read about 1.5 V, and the large one differs only "
            "in how long it can sustain a current before Q reaches K."
        ),
        misconception=None,
        claims=(
            Source("a lead storage cell has a standard potential near 2.04 V", OPENSTAX_ECHEM),
        ),
    ),
    "GEN2.CORROSION": Lesson(
        node="GEN2.CORROSION",
        objective=(
            "Explain corrosion as an unwanted galvanic cell and choose a "
            "sacrificial metal that protects iron by reduction potential."
        ),
        build_on=(
            "A galvanic cell needs two materials of different reduction potential "
            "wired together, and corrosion is that same cell assembling itself by "
            "accident on the surface of a single piece of metal."
        ),
        core_idea=(
            "Rusting is electrochemistry you did not ask for. On a wet iron "
            "surface, one patch acts as an anode where iron is oxidised to Fe2+, "
            "another patch acts as a cathode where oxygen is reduced, and the "
            "moisture film is the electrolyte that completes the circuit, so a "
            "tiny galvanic cell runs and the iron slowly dissolves and reforms as "
            "rust. Because the driver is a difference in reduction potential, you "
            "fight corrosion with the same table. Cathodic protection attaches a "
            "metal with a more negative reduction potential than iron, such as "
            "zinc or magnesium, so that metal becomes the anode and is oxidised "
            "preferentially while the iron is forced to be the cathode and is "
            "spared. This is why galvanising, a zinc coat over steel, keeps "
            "protecting even where it is scratched: the exposed iron still sits "
            "as the cathode next to the sacrificial zinc."
        ),
        worked_example=(
            "Compare two coatings on steel using Zn2+ + 2 e- -> Zn at -0.76 V, "
            "Fe2+ + 2 e- -> Fe at -0.44 V, and Sn2+ + 2 e- -> Sn at -0.14 V. Zinc "
            "has the more negative potential than iron, so in a scratched zinc "
            "coat the zinc is oxidised first and the iron underneath is protected "
            "as the cathode, and the steel keeps its integrity even with the "
            "coating breached. Tin behaves the opposite way. Its potential of "
            "-0.14 V is less negative than iron's -0.44 V, so in a scratched tin "
            "can the iron becomes the anode and corrodes faster than bare steel "
            "would, which is the well known failure of a dented tin coating. Same "
            "geometry, opposite outcome, decided entirely by which metal sits "
            "lower in reduction potential."
        ),
        try_it_prompt=(
            "To protect a buried steel pipe you can bolt on a block of magnesium "
            "(Mg2+ + 2 e- -> Mg at -2.37 V) or a block of copper (Cu2+ + 2 e- -> "
            "Cu at +0.34 V). Which one, and why?"
        ),
        try_it_answer=(
            "Magnesium. Its potential of -2.37 V is far more negative than iron's "
            "-0.44 V, so magnesium acts as the sacrificial anode and oxidises "
            "instead of the pipe. Copper at +0.34 V is more positive than iron, "
            "so it would force the pipe to be the anode and speed its corrosion."
        ),
        pitfall=(
            "The pitfall is assuming any coating protects by covering the "
            "metal. A barrier coat helps only while it is intact; once scratched, "
            "the coating's own reduction potential decides the outcome, and a "
            "tin coat on steel then drives faster corrosion rather than slower, "
            "the exact reverse of a zinc coat."
        ),
        misconception=None,
        claims=(
            Source("Zn2+ + 2 e- -> Zn has a standard reduction potential of -0.76 V", CRC_ESERIES),
            Source("Fe2+ + 2 e- -> Fe has a standard reduction potential of -0.44 V", CRC_ESERIES),
            Source("Sn2+ + 2 e- -> Sn has a standard reduction potential of -0.14 V", CRC_ESERIES),
            Source("Mg2+ + 2 e- -> Mg has a standard reduction potential of -2.37 V", CRC_ESERIES),
            Source("Cu2+ + 2 e- -> Cu has a standard reduction potential of +0.34 V", CRC_ESERIES),
        ),
    ),
    "GEN2.ELECTROLYSIS": Lesson(
        node="GEN2.ELECTROLYSIS",
        objective=(
            "Use Faraday's laws to relate current and time to the mass of "
            "substance deposited or produced in an electrolysis."
        ),
        build_on=(
            "A galvanic cell runs a spontaneous redox reaction to push out "
            "current, and electrolysis is the same apparatus in reverse, feeding "
            "current in to force a nonspontaneous reaction to happen."
        ),
        core_idea=(
            "Electrolysis pays energy to drive a reaction uphill, and Faraday's "
            "laws are the accounting for exactly how much product that energy "
            "buys. The core insight is that electrons are counted by charge. The "
            "total charge passed is Q = I * t, current in amperes times time in "
            "seconds, giving coulombs. Divide by the Faraday constant F = 96485 "
            "C/mol to get moles of electrons. Then the half reaction tells you how "
            "many electrons each ion needs, so moles of product equals moles of "
            "electrons divided by n, and mass follows from the molar mass. Two "
            "consequences drop out: the amount of product is proportional to the "
            "charge you push through, and for the same charge an ion needing more "
            "electrons yields fewer moles, so a plus three ion deposits a third "
            "as many moles as a plus one ion."
        ),
        worked_example=(
            "Electroplate copper from Cu2+ + 2 e- -> Cu using a current of 2.00 A "
            "for 30.0 minutes. First convert time to seconds: 30.0 min * 60 = "
            "1800 s. Charge is Q = I * t = (2.00 A)(1800 s) = 3600 C. Moles of "
            "electrons is Q / F = 3600 / 96485 = 0.03731 mol. Copper needs 2 "
            "electrons per atom, so moles of copper is 0.03731 / 2 = 0.01866 mol. "
            "With the molar mass of copper at 63.55 g/mol, the mass deposited is "
            "0.01866 * 63.55 = 1.19 g. The chain is always the same, from amperes "
            "and seconds to coulombs to moles of electrons to moles of metal to "
            "grams, and every electrolysis calculation is a walk down that chain."
        ),
        try_it_prompt=(
            "Pass the same 3600 C through a silver plating bath, where Ag+ + e- "
            "-> Ag and the molar mass of silver is 107.87 g/mol. How many grams "
            "of silver deposit?"
        ),
        try_it_answer=(
            "About 4.03 g. Moles of electrons is still 3600 / 96485 = 0.03731 "
            "mol, but silver needs only 1 electron per atom, so moles of silver "
            "equals moles of electrons, 0.03731 mol, and mass is 0.03731 * 107.87 "
            "= 4.03 g. The same charge yields more silver than copper because "
            "silver draws one electron instead of two."
        ),
        pitfall=(
            "The pitfall is dividing by the wrong electron count or skipping it "
            "entirely. For copper you must divide moles of electrons by 2, and "
            "leaving that step out doubles the reported mass. The value of n comes "
            "from the balanced half reaction, never from a guess."
        ),
        misconception=None,
        claims=(
            Source("the Faraday constant F is 96485 C/mol", CRC_CONSTANTS),
            Source("the molar mass of copper is 63.55 g/mol", CRC_ATOMICWT),
            Source("the molar mass of silver is 107.87 g/mol", CRC_ATOMICWT),
        ),
    ),
    "GEN2.TRANSITIONMETALS": Lesson(
        node="GEN2.TRANSITIONMETALS",
        objective=(
            "Write the electron configuration of a transition metal atom and its "
            "ions, and explain why several oxidation states are available."
        ),
        build_on=(
            "Electron configurations filled the 4s and 3d orbitals in order, and "
            "the transition metals are the block where those d electrons become "
            "the chemistry and where several charges become possible."
        ),
        core_idea=(
            "The transition metals are the d block, the elements where a d subshell "
            "is filling. Two facts drive their behaviour. First, the 4s and 3d "
            "orbitals lie close in energy, so a metal can give up its 4s electrons "
            "and then a variable number of 3d electrons, which is why iron shows "
            "both plus two and plus three and why manganese runs from plus two all "
            "the way to plus seven. Second, and this trips up many, the 4s "
            "electrons are removed first when a cation forms, before any 3d "
            "electron, even though 4s filled first. So write the neutral atom by "
            "the normal filling order, then to make an ion pull electrons from 4s "
            "before 3d. Half filled and filled d subshells carry extra stability, "
            "which is why the plus three state of iron, leaving a half filled d5, "
            "is so common. These same partly filled d orbitals give the transition "
            "metals their colours and their magnetism, taken up in later lessons."
        ),
        worked_example=(
            "Work out iron and its ions. Iron is element 26, so its ground state "
            "is [Ar] 3d6 4s2, filling 4s before 3d in the usual order. To form "
            "Fe2+, remove the two 4s electrons first, not 3d, leaving [Ar] 3d6. "
            "To form Fe3+, remove one more, and it comes from 3d, leaving [Ar] "
            "3d5. That 3d5 is a half filled subshell, which is unusually stable, "
            "and it explains why Fe3+ is such a common and comfortable state for "
            "iron. Manganese, element 25, is [Ar] 3d5 4s2 and can lose up to all "
            "seven of those outer electrons, which is why it reaches the plus "
            "seven found in the permanganate ion. The closeness of 4s and 3d in "
            "energy is the single reason a transition metal offers this ladder of "
            "oxidation states rather than one fixed charge."
        ),
        try_it_prompt=(
            "Copper is element 29 with the ground state configuration [Ar] 3d10 "
            "4s1. Write the electron configuration of the Cu2+ ion."
        ),
        try_it_answer=(
            "[Ar] 3d9. Remove the single 4s electron first, giving [Ar] 3d10 for "
            "Cu+, then remove one 3d electron for the second positive charge, "
            "leaving [Ar] 3d9. The 4s electron always leaves before the 3d "
            "electrons when a transition metal is ionised."
        ),
        pitfall=(
            "The pitfall is removing 3d electrons before 4s when building a "
            "cation, because 4s filled first. Filling order and removal order "
            "differ for the transition metals: 4s fills first but empties first, "
            "so Fe2+ is [Ar] 3d6 and not [Ar] 3d4 4s2."
        ),
        misconception=None,
        claims=(
            Source(
                "The transition metal periodic trends described here.",
                "OpenStax Chemistry 2e chapter 19",
            ),
        ),
    ),
    "GEN2.COORDINATION": Lesson(
        node="GEN2.COORDINATION",
        objective=(
            "Identify the central metal, the ligands, the coordination number and "
            "the coordination sphere of a complex."
        ),
        build_on=(
            "Transition metal ions carry a positive charge and empty low energy "
            "orbitals, and a coordination compound is what forms when electron "
            "rich molecules donate lone pairs into those orbitals."
        ),
        core_idea=(
            "A coordination compound is a central metal ion surrounded by "
            "molecules or ions called ligands, each donating a lone pair into the "
            "metal, which makes every ligand a Lewis base and the metal a Lewis "
            "acid. The metal plus its attached ligands, written inside square "
            "brackets, is the coordination sphere, and any counter ions written "
            "outside the brackets balance charge but are not bonded to the metal. "
            "The coordination number is the count of donor atoms actually bonded "
            "to the metal, most often 6 and sometimes 4 or 2. Common ligands "
            "include water, ammonia, chloride, cyanide and carbon monoxide, each "
            "of which binds through a single donor atom. Some ligands reach out "
            "with more than one donor atom at once: ethylenediamine grips through "
            "two nitrogen atoms and so is called bidentate, and such a multi point "
            "grip is a chelate, which is why one ethylenediamine counts as two "
            "toward the coordination number."
        ),
        worked_example=(
            "Take the compound with formula [Co(NH3)6]Cl3. Inside the brackets is "
            "the coordination sphere: a central cobalt ion bonded to six ammonia "
            "ligands, each donating the lone pair on its nitrogen, so the "
            "coordination number is 6. The three chloride ions sit outside the "
            "brackets as counter ions and are not bonded to the cobalt. Balance "
            "charge to find the metal's oxidation state: ammonia is neutral and "
            "the three chlorides carry -3 overall, so the cobalt must be +3 to "
            "leave the whole compound neutral. Now change the ligand and keep the "
            "count in mind. In [Co(en)3]3+, three ethylenediamine ligands each "
            "bind through two nitrogen atoms, so three bidentate ligands supply "
            "six donor atoms and the coordination number is again 6, even though "
            "only three ligands are present."
        ),
        try_it_prompt=(
            "In the compound K4[Fe(CN)6], what is the coordination number of the "
            "iron, what are its ligands, and which ions are only counter ions?"
        ),
        try_it_answer=(
            "The coordination number is 6, the ligands are six cyanide ions each "
            "bonded through carbon, and the four potassium ions outside the "
            "brackets are counter ions not bonded to the iron. Balancing charge, "
            "six cyanide at -6 and an overall -4 inside the brackets put iron at "
            "+2."
        ),
        pitfall=(
            "The pitfall is equating the coordination number with the number of "
            "ligands. They agree only for single point ligands; with a bidentate "
            "ligand like ethylenediamine the coordination number counts donor "
            "atoms, so [Co(en)3]3+ has three ligands but a coordination number of "
            "6."
        ),
        misconception=None,
        claims=(
            Formula("O", "H2O", "water, a single point ligand"),
            Formula("N", "H3N", "ammonia, a single point ligand"),
            Formula("[C-]#N", "CN-", "cyanide, bonded through carbon"),
            Formula("[C-]#[O+]", "CO", "carbon monoxide, a single point ligand"),
            Formula("NCCN", "C2H8N2", "ethylenediamine, a bidentate ligand"),
        ),
    ),
    "GEN2.COORDNOMEN": Lesson(
        node="GEN2.COORDNOMEN",
        objective=(
            "Name a coordination compound by ordering ligands, metal and "
            "oxidation state under the standard rules."
        ),
        build_on=(
            "You can already pick out the metal, the ligands and the coordination "
            "number of a complex, and naming is reading those three off in one "
            "fixed order."
        ),
        core_idea=(
            "Naming a coordination compound follows a short set of rules applied "
            "in a set order. Name the cation before the anion, the same as any "
            "ionic compound. Within the complex ion, name the ligands first, in "
            "alphabetical order, then the metal. Anionic ligands take an o ending, "
            "so chloride becomes chloro and cyanide becomes cyano, while neutral "
            "ligands mostly keep their name, with the special cases aqua for "
            "water and ammine for ammonia. Count identical ligands with the "
            "prefixes di, tri and tetra, switching to bis, tris and tetrakis when "
            "the ligand name already contains a numeric prefix. After the metal, "
            "give its oxidation state as a Roman numeral in parentheses, worked "
            "out by balancing charge. One last twist: if the whole complex ion is "
            "an anion, the metal takes an ate suffix, and several metals use their "
            "Latin stems there, so iron becomes ferrate and copper becomes "
            "cuprate."
        ),
        worked_example=(
            "Name [Co(NH3)6]Cl3. The chloride outside the brackets is the anion "
            "and comes last as chloride. Inside, six ammonia ligands give "
            "hexaammine, and the metal is cobalt. Find its oxidation state by "
            "charge balance: neutral ammonia and three chlorides at -3 put cobalt "
            "at +3, written (III). The complex ion is a cation, so cobalt keeps "
            "its ordinary name, and the full name is hexaamminecobalt(III) "
            "chloride. Now do an anionic complex, K4[Fe(CN)6]. Potassium is the "
            "cation and comes first. Six cyanide ligands give hexacyano, and "
            "because the complex ion is an anion the metal takes the ate suffix "
            "with its Latin stem, giving ferrate. Charge balance puts iron at +2, "
            "so the name is potassium hexacyanoferrate(II)."
        ),
        try_it_prompt=(
            "Name the compound [Cu(NH3)4]SO4, which contains a sulfate counter "
            "ion carrying a 2- charge."
        ),
        try_it_answer=(
            "Tetraamminecopper(II) sulfate. Four ammonia ligands give "
            "tetraammine, the complex ion is a cation so copper keeps its name, "
            "and charge balance against the 2- sulfate makes the copper +2, "
            "written (II), with sulfate named last as the anion."
        ),
        pitfall=(
            "The pitfall is ordering ligands by their prefix rather than their "
            "name. Alphabetising uses the ligand name and ignores di, tri and "
            "tetra, so a complex with four ammonia and two chloro ligands is "
            "named tetraamminedichloro, with ammine before chloro, and not "
            "dichlorotetraammine."
        ),
        misconception=None,
        claims=(
            Source(
                "The coordination nomenclature rules applied here.",
                "IUPAC recommendations, via OpenStax Chemistry 2e chapter 19",
            ),
        ),
    ),
    "GEN2.COORDISOMERISM": Lesson(
        node="GEN2.COORDISOMERISM",
        objective=(
            "Distinguish geometric from optical isomers of a coordination complex "
            "and identify when each can occur."
        ),
        build_on=(
            "A coordination formula fixes which ligands are present but not always "
            "where they sit, and isomers are complexes that share a formula while "
            "differing in that arrangement."
        ),
        core_idea=(
            "Two complexes can have the identical formula and yet be different "
            "compounds because their ligands are arranged differently in space, "
            "and two kinds of that arrangement matter here. Geometric isomers "
            "differ in which positions the ligands occupy: in an octahedral "
            "complex with two of one ligand, cis has them next to each other at "
            "90 degrees while trans has them across from each other at 180 "
            "degrees, and cis and trans often differ in colour, polarity and "
            "reactivity. Optical isomers are a subtler split: a complex that "
            "cannot be superimposed on its own mirror image comes in two forms "
            "that relate like your left and right hands, the same chirality you "
            "met with carbon, and such a complex is optically active. Complexes "
            "of three bidentate ligands are the classic optically active case. "
            "The two kinds are independent, and a single complex can display one, "
            "both or neither."
        ),
        worked_example=(
            "Look at [Co(NH3)4Cl2]+, an octahedral complex with four ammonia and "
            "two chloride ligands. The two chlorides can sit next to each other, "
            "the cis isomer, or directly opposite each other, the trans isomer, "
            "and these are genuinely different compounds with different colours "
            "even though they share one formula. That is geometric isomerism. Now "
            "look at [Co(en)3]3+, with three bidentate ethylenediamine ligands "
            "wrapped around the metal. Build its mirror image and try to rotate "
            "one onto the other, and you cannot; the two are non-superimposable, "
            "like a left and a right handed propeller. That makes them optical "
            "isomers, a pair of enantiomers, and the complex is optically active. "
            "Same idea of chirality as in organic molecules, now around a metal."
        ),
        try_it_prompt=(
            "Square planar [Pt(NH3)2Cl2] shows geometric isomerism. Name its two "
            "isomers, and note that one of them is the well known anticancer drug."
        ),
        try_it_answer=(
            "The cis isomer, with the two chlorides adjacent, and the trans "
            "isomer, with them opposite. The cis form is the anticancer agent "
            "cisplatin, while the trans form lacks that activity, a striking case "
            "of geometry deciding biological behaviour."
        ),
        pitfall=(
            "The pitfall is assuming cis and trans isomers must have the same "
            "properties because they share a formula. They frequently do not; the "
            "cis and trans platinum complexes above differ so much that one is a "
            "medicine and the other is not, so isomerism is a real difference in "
            "compound, not a relabelling."
        ),
        misconception=None,
        claims=(
            Source(
                "The isomer classes of coordination compounds described here.",
                "OpenStax Chemistry 2e chapter 19",
            ),
        ),
    ),
    "GEN2.CRYSTALFIELD": Lesson(
        node="GEN2.CRYSTALFIELD",
        objective=(
            "Use octahedral d orbital splitting to explain the colour and the "
            "magnetism of a complex."
        ),
        build_on=(
            "Ligands donate electron pairs toward the metal, and crystal field "
            "theory asks what those approaching negative charges do to the "
            "energies of the metal's d orbitals."
        ),
        core_idea=(
            "Crystal field theory treats the ligands as point charges approaching "
            "the metal and follows the effect on the five d orbitals. In an "
            "octahedral complex the six ligands come in along the axes, so the two "
            "d orbitals that point straight along the axes are pushed up in "
            "energy more than the three that point between the axes. The five "
            "orbitals split into a lower set of three and an upper set of two, "
            "separated by an energy gap called the crystal field splitting. That "
            "gap explains two properties at once. Colour: a d electron can absorb "
            "a photon whose energy equals the gap and jump to the upper set, and "
            "the colour you see is the complement of the wavelength absorbed. "
            "Magnetism: if the gap is large, a strong field ligand, electrons "
            "pair up in the lower set and the complex is low spin with few "
            "unpaired electrons, while a small gap, a weak field ligand, leaves "
            "electrons spread out and unpaired, a high spin and more strongly "
            "paramagnetic complex."
        ),
        worked_example=(
            "Turn an absorbed colour into a splitting energy. Suppose a complex "
            "absorbs light near 500 nm, a round wavelength chosen here to keep the "
            "arithmetic clean. The energy of one such photon is E = h * c / "
            "lambda, with the Planck constant h = 6.626e-34 J*s and the speed of "
            "light c = 3.00e8 m/s. So E = (6.626e-34)(3.00e8) / (500e-9) = "
            "1.988e-25 / 5.00e-7 = 3.98e-19 J per photon. Scale to a mole by "
            "multiplying by the Avogadro constant, 6.022e23 per mol: E = "
            "(3.98e-19)(6.022e23) = 2.39e5 J/mol, about 239 kJ/mol. That figure "
            "is the crystal field splitting for this complex, and it lands in the "
            "range of a few hundred kJ/mol that is typical, comparable to a "
            "chemical bond and far below any nuclear energy."
        ),
        try_it_prompt=(
            "A complex is measured to be diamagnetic and has a d6 metal in an "
            "octahedral field. Is it high spin or low spin, and what does that say "
            "about the strength of its ligand field?"
        ),
        try_it_answer=(
            "Low spin. All six d electrons are paired in the lower set of three "
            "orbitals, leaving none unpaired, which is what diamagnetic means. "
            "Forcing that pairing requires a large splitting gap, so the ligands "
            "form a strong field."
        ),
        pitfall=(
            "The pitfall is reporting the colour you see as the colour the "
            "complex absorbs. They are complements: a complex that absorbs in the "
            "green near 500 nm looks red or purple, so reasoning from the "
            "observed colour to the splitting energy without taking the "
            "complement gets the gap wrong."
        ),
        misconception=None,
        claims=(
            Source("the Planck constant h is 6.626e-34 J*s", CRC_CONSTANTS),
            Source("the speed of light c is 3.00e8 m/s", CRC_CONSTANTS),
            Source("the Avogadro constant is 6.022e23 per mol", CRC_CONSTANTS),
        ),
    ),
    "GEN2.MAINGROUP": Lesson(
        node="GEN2.MAINGROUP",
        objective=(
            "Survey the representative elements by block and predict simple ionic "
            "formulas and trends from position in the periodic table."
        ),
        build_on=(
            "The transition metals shared a d block pattern of behaviour, and the "
            "main group elements across the s and p blocks are more varied, "
            "surveyed here by their position."
        ),
        core_idea=(
            "The main group, or representative, elements are the s block and the p "
            "block, and their chemistry tracks their column. The group 1 alkali "
            "metals are soft, very reactive metals that form plus one ions; the "
            "group 2 alkaline earth metals form plus two ions. Along a staircase "
            "on the right sit the metalloids such as boron, silicon and "
            "germanium, whose intermediate behaviour makes them the semiconductors "
            "of electronics. The group 17 halogens are reactive nonmetals that "
            "form minus one ions, and the group 18 noble gases are nearly inert "
            "because their shells are already full. The organising trend is that "
            "metallic character rises going down a group and going left across a "
            "period, so the most metallic elements sit at the lower left and the "
            "most nonmetallic at the upper right. Predicting an ionic formula is "
            "then a matter of reading the likely ion charges from group number "
            "and balancing them."
        ),
        worked_example=(
            "Predict the formula of the compound between magnesium, a group 2 "
            "metal, and chlorine, a group 17 nonmetal. Magnesium loses two "
            "electrons to reach a full shell, forming Mg2+, while each chlorine "
            "gains one electron to form Cl-. To balance a +2 against a set of -1 "
            "ions you need two chlorides, giving MgCl2. Contrast a group 1 metal: "
            "sodium forms Na+, so with chloride the charges already match one to "
            "one and the formula is NaCl. The same reading of group number sets "
            "the pattern, with group 1 giving a 1 to 1 halide and group 2 giving a "
            "1 to 2 halide, and it also predicts the reactivity, since the loosely "
            "held single electron of sodium makes it react even more violently "
            "with water than magnesium does."
        ),
        try_it_prompt=(
            "Predict the formula of the ionic compound formed between aluminum, in "
            "group 13, and oxygen, in group 16."
        ),
        try_it_answer=(
            "Al2O3. Aluminum forms Al3+ and oxygen forms O2-, so you balance +3 "
            "and -2 by taking the least common multiple of 6: two aluminum ions "
            "give +6 and three oxide ions give -6, which is Al2O3."
        ),
        pitfall=(
            "The pitfall is expecting every element in a group to behave "
            "identically. Trends shift steadily down a group, so the top member "
            "is often the odd one out: hydrogen sits above group 1 yet is a "
            "nonmetal, and beryllium at the top of group 2 is far less metallic "
            "than the barium below it. Position gives a trend, not a guarantee."
        ),
        misconception=None,
        claims=(
            Source(
                "The main group descriptive chemistry summarized here.",
                "OpenStax Chemistry 2e chapter 18",
            ),
        ),
    ),
    "GEN2.DECAYMODES": Lesson(
        node="GEN2.DECAYMODES",
        objective=(
            "Write balanced equations for alpha, beta, positron, electron capture "
            "and gamma decay, and predict the mode from the neutron to proton "
            "ratio."
        ),
        build_on=(
            "The band of stability showed which nuclei are unstable, and the "
            "decay mode is how a given unstable nucleus moves back toward that "
            "band."
        ),
        core_idea=(
            "An unstable nucleus decays in whichever way carries it toward the "
            "band of stability, and a small set of modes covers the ground. Alpha "
            "decay emits a helium-4 nucleus, cutting mass number by 4 and atomic "
            "number by 2, common among very heavy nuclei. Beta decay, seen in "
            "neutron rich nuclei above the band, turns a neutron into a proton and "
            "ejects an electron, keeping mass number fixed and raising atomic "
            "number by 1. Proton rich nuclei below the band do the reverse in one "
            "of two ways: positron emission converts a proton to a neutron and "
            "ejects a positron, lowering atomic number by 1, and electron capture "
            "pulls in an inner electron to the same net effect. Gamma emission "
            "sheds excess energy as a high energy photon with no change in mass or "
            "atomic number. Balance any of these by conserving two totals, the "
            "mass numbers on top and the atomic numbers on the bottom, on both "
            "sides."
        ),
        worked_example=(
            "Write and classify three decays. Radium-226 undergoes alpha decay: "
            "mass number drops by 4 from 226 to 222 and atomic number drops by 2 "
            "from 88 to 86, giving radon-222 plus a helium-4 nucleus, and the "
            "totals check as 226 = 222 + 4 and 88 = 86 + 2. Iodine-131, a neutron "
            "rich nucleus, undergoes beta decay: mass number stays 131 while "
            "atomic number rises by 1 from 53 to 54, giving xenon-131 plus an "
            "emitted electron, checking as 131 = 131 + 0 and 53 = 54 + (-1). "
            "Carbon-11, a proton rich nucleus, undergoes positron emission: mass "
            "number stays 11 while atomic number falls by 1 from 6 to 5, giving "
            "boron-11 plus a positron, checking as 11 = 11 + 0 and 6 = 5 + 1. Each "
            "product identity comes straight from reading the new atomic number "
            "off the periodic table."
        ),
        try_it_prompt=(
            "Nitrogen-13, used in medical imaging, is proton rich and decays by "
            "positron emission. Write the balanced equation and name the product."
        ),
        try_it_answer=(
            "Nitrogen-13 gives carbon-13 plus a positron. Positron emission keeps "
            "the mass number at 13 and lowers the atomic number by 1 from 7 to 6, "
            "so the totals are 13 = 13 + 0 and 7 = 6 + 1, and atomic number 6 is "
            "carbon."
        ),
        pitfall=(
            "The pitfall is forgetting that the emitted particle carries its own "
            "entries in the two totals. A beta particle counts as mass number 0 "
            "and atomic number -1, and leaving that -1 out breaks the atomic "
            "number balance and points you at the wrong product element."
        ),
        misconception=None,
        claims=(
            Source(
                "The nuclear decay modes and their effect on atomic and mass number.",
                "OpenStax Chemistry 2e chapter 21",
            ),
        ),
    ),
    "GEN2.NUCLEARHALFLIFE": Lesson(
        node="GEN2.NUCLEARHALFLIFE",
        objective=(
            "Apply first order decay and half life to date a sample, including "
            "cases where the elapsed time is not a whole number of half lives."
        ),
        build_on=(
            "Every decay proceeds by a first order rate law, the same integrated "
            "form you used in kinetics, and half life is its natural time scale "
            "carried over to the nucleus."
        ),
        core_idea=(
            "Radioactive decay is first order, so the fraction remaining depends "
            "only on how many half lives have gone by, never on how much you "
            "started with. When the elapsed time is a whole number of half lives, "
            "count halvings: one half life leaves one half, two leave a quarter, "
            "three leave an eighth. When it is not a whole number, use the "
            "integrated law directly. The decay constant is k = ln(2) / t(half), "
            "and the amount follows N = N0 * exp(-k * t), which rearranges to t = "
            "ln(N0 / N) / k for solving an age. Radiometric dating is this "
            "arithmetic applied to a clock built into the sample: carbon-14, "
            "replenished in living things and then decaying once they die, dates "
            "organic remains, while long lived nuclei such as uranium-238 decaying "
            "to lead date rocks over billions of years. You pick the clock whose "
            "half life is comparable to the age you expect to measure."
        ),
        worked_example=(
            "Date a wooden object whose carbon-14 activity is 70 percent of a "
            "living tree's, using a carbon-14 half life of 5730 years. This is "
            "not a clean number of halvings, so use the integrated law. First the "
            "decay constant: k = ln(2) / 5730 = 0.6931 / 5730 = 1.210e-4 per "
            "year. Then the age from t = ln(N0 / N) / k, where N0 / N = 1 / 0.70 "
            "= 1.4286. The logarithm is ln(1.4286) = 0.3567, so t = 0.3567 / "
            "1.210e-4 = 2949 years, about 2950 years old. Check the sense of it: "
            "70 percent remaining is more than half, so the age must be less than "
            "one half life of 5730 years, and 2950 years sits comfortably below "
            "that."
        ),
        try_it_prompt=(
            "A rock has uranium-238 decayed to the point that 25 percent of the "
            "original remains. Using a uranium-238 half life of 4.5e9 years, how "
            "old is the rock?"
        ),
        try_it_answer=(
            "About 9.0e9 years. Twenty five percent is one quarter, which is "
            "exactly two halvings, so two half lives have passed, and 2 * 4.5e9 = "
            "9.0e9 years. Because 25 percent is a clean power of one half, you can "
            "count halvings instead of using logarithms."
        ),
        pitfall=(
            "The pitfall is counting half lives when the fraction remaining is not "
            "a power of one half. At 70 percent remaining there is no whole number "
            "of halvings, so counting fails and you must use the integrated law; "
            "rounding 70 percent to one half life would badly overstate the age."
        ),
        misconception=None,
        claims=(
            Source("carbon-14 has a half life of about 5730 years", OPENSTAX_NUCLEAR),
            Source("uranium-238 has a half life of about 4.5e9 years", OPENSTAX_NUCLEAR),
        ),
    ),
    "GEN2.BINDINGENERGY": Lesson(
        node="GEN2.BINDINGENERGY",
        objective=(
            "Calculate the mass defect and nuclear binding energy of a nuclide "
            "and explain why nuclear energies dwarf chemical ones."
        ),
        build_on=(
            "Nuclear stability hinted that mass converts to energy through E = m * "
            "c^2, and binding energy makes that quantitative as the energy holding "
            "a nucleus together."
        ),
        core_idea=(
            "A nucleus weighs less than the sum of its separate protons and "
            "neutrons, and that missing mass is the key to nuclear energy. The "
            "difference is the mass defect, and by E = m * c^2 it corresponds to "
            "the binding energy, the energy released when the nucleons came "
            "together and equally the energy you would have to supply to pull them "
            "back apart. Compute it by adding the masses of the constituent "
            "protons and neutrons, using neutral atom masses so the electrons "
            "bookkeep themselves, then subtracting the actual atomic mass of the "
            "nuclide; the shortfall in unified mass units converts to energy "
            "through the equivalence that 1 u corresponds to 931.5 MeV. Dividing "
            "the total binding energy by the number of nucleons gives the binding "
            "energy per nucleon, the fair way to compare nuclei of different "
            "sizes. Because a nucleon is bound by millions of electron volts while "
            "a chemical bond is worth only a few, nuclear processes release on the "
            "order of a million times more energy per event than chemical ones."
        ),
        worked_example=(
            "Find the binding energy of helium-4, which has 2 protons and 2 "
            "neutrons. Use the neutral atom masses of hydrogen-1 at 1.007825 u "
            "and the neutron at 1.008665 u, and the atomic mass of helium-4 at "
            "4.002602 u. Sum the parts: 2 * 1.007825 + 2 * 1.008665 = 2.015650 + "
            "2.017330 = 4.032980 u. Subtract the actual mass to get the mass "
            "defect: 4.032980 - 4.002602 = 0.030378 u. Convert to energy with "
            "931.5 MeV per u: binding energy = 0.030378 * 931.5 = 28.30 MeV. "
            "Divide by 4 nucleons for a per nucleon value of 7.07 MeV. Set that "
            "against a chemical bond of a few electron volts and the gap is about "
            "a million fold, which is the quantitative reason a nuclear reaction "
            "packs so much more energy than burning the same mass of fuel."
        ),
        try_it_prompt=(
            "Explain in words why the measured mass of a helium-4 nucleus is less "
            "than the summed mass of two free protons and two free neutrons, and "
            "where the missing mass has gone."
        ),
        try_it_answer=(
            "The missing mass was converted to energy and released as binding "
            "energy when the four nucleons bound together, by E = m * c^2. To "
            "separate them again you would have to return exactly that energy, "
            "which reappears as the same mass, so the bound nucleus is lighter "
            "than its free parts by the mass defect."
        ),
        pitfall=(
            "The pitfall is comparing total binding energies to rank stability "
            "across different sized nuclei. A heavy nucleus has a large total "
            "binding energy because it has many nucleons; the fair measure "
            "is binding energy per nucleon, and it is that per nucleon value, not "
            "the total, that says which nucleus is more tightly held."
        ),
        misconception=None,
        claims=(
            Source("the neutral atomic mass of hydrogen-1 is 1.007825 u", CRC_NUCLIDES),
            Source("the mass of a free neutron is 1.008665 u", CRC_NUCLIDES),
            Source("the atomic mass of helium-4 is 4.002602 u", CRC_NUCLIDES),
            Source("one unified atomic mass unit corresponds to 931.5 MeV", CRC_CONSTANTS),
        ),
    ),
    "GEN2.FISSIONFUSION": Lesson(
        node="GEN2.FISSIONFUSION",
        objective=(
            "Use the binding energy per nucleon curve to explain why both fission "
            "and fusion can release energy and which releases more per nucleon."
        ),
        build_on=(
            "Binding energy per nucleon rises and then falls across the elements, "
            "and fission and fusion are the two ways a nucleus can move toward the "
            "peak of that curve and release the difference."
        ),
        core_idea=(
            "Plot binding energy per nucleon against mass number and you get a "
            "curve that climbs steeply from the lightest nuclei, peaks near "
            "iron-56 at about 8.8 MeV per nucleon, then declines gently toward the "
            "heaviest. Any change that moves nucleons to a higher point on this "
            "curve, so a larger binding energy per nucleon, releases the "
            "difference as energy. That single picture explains both directions. "
            "Nuclei much heavier than iron sit lower than the peak, so splitting a "
            "heavy nucleus into mid sized fragments climbs the curve and releases "
            "energy, which is fission. Nuclei much lighter than iron also sit "
            "below the peak, so combining light nuclei climbs the curve from the "
            "other side and releases energy, which is fusion, the process that "
            "powers the sun as hydrogen builds into helium. Because the left side "
            "of the curve rises far more steeply than the right side falls, moving "
            "up from the light end releases more energy per nucleon than sliding "
            "down from the heavy end, so fusion yields more per nucleon than "
            "fission."
        ),
        worked_example=(
            "Reason from the curve alone. Helium-4 sits near 7 MeV per nucleon "
            "while the lightest nuclei sit far lower, so fusing hydrogen toward "
            "helium climbs a large step up the steep left side and releases a lot "
            "of energy per nucleon. A heavy nucleus sits around 7.6 MeV per "
            "nucleon and its mid sized fission fragments sit closer to the 8.8 "
            "MeV peak, so fission climbs a smaller step, on the order of 1 MeV per "
            "nucleon, and releases correspondingly less per nucleon than fusion. "
            "Both release energy because both end higher on the curve than they "
            "began; the difference in yield is entirely the difference in how far "
            "up the curve each one climbs. This is a statement about where energy "
            "comes from, read off a graph of binding energy, and nothing here "
            "concerns how any device is arranged or operated."
        ),
        try_it_prompt=(
            "Iron-56 sits at the very top of the binding energy per nucleon "
            "curve. Can you release energy by fissioning iron-56 or by fusing it? "
            "Explain from the shape of the curve."
        ),
        try_it_answer=(
            "Neither releases energy. Iron-56 is already at the peak, so any "
            "change, splitting it or fusing it, moves nucleons to a lower binding "
            "energy per nucleon, which costs energy rather than releasing it. That "
            "is why iron and its neighbours are the endpoint of energy releasing "
            "nuclear change."
        ),
        pitfall=(
            "The pitfall is thinking only heavy elements yield nuclear energy "
            "because fission is the more familiar example. The curve is symmetric "
            "in intent: light nuclei release energy by fusion and heavy nuclei by "
            "fission, and per nucleon the light side actually gives the larger "
            "release, so both ends of the periodic table can move toward iron and "
            "give up energy."
        ),
        misconception=None,
        claims=(
            Source(
                "binding energy per nucleon peaks near iron-56 at about 8.8 MeV",
                OPENSTAX_NUCLEAR,
            ),
        ),
    ),
    "GEN2.RADIATIONEFFECTS": Lesson(
        node="GEN2.RADIATIONEFFECTS",
        objective=(
            "Relate the type of radiation to its penetrating power and shielding, "
            "and describe how dose is measured and how radioisotopes are used in "
            "medicine."
        ),
        build_on=(
            "Each decay mode emits a characteristic particle or photon, and how "
            "far each one penetrates, how you shield it and how it is put to use "
            "all follow from what that emission is."
        ),
        core_idea=(
            "How radiation interacts with matter is set by the mass and charge of "
            "what is emitted. An alpha particle is heavy and doubly charged, so it "
            "deposits its energy quickly and is stopped by a sheet of paper or the "
            "dead outer layer of skin, though it is hazardous if a source is "
            "inhaled or swallowed and reaches living tissue directly. A beta "
            "particle is a light, singly charged electron that penetrates further "
            "and needs a few millimetres of aluminium or plastic to stop. A gamma "
            "ray is an uncharged high energy photon that penetrates deeply and "
            "requires dense shielding such as lead or thick concrete. Dose is "
            "measured two ways: the gray records the energy absorbed per kilogram "
            "of tissue, and the sievert weights that by how damaging the "
            "particular radiation is to biology. These same properties are turned "
            "to use in medicine, where a penetrating gamma emitter can be imaged "
            "from outside the body or aimed at a tumour, and a short lived tracer "
            "delivers its signal and then decays quickly away."
        ),
        worked_example=(
            "Match shielding to radiation for three sources. A pure alpha emitter "
            "handled at arm's length needs almost nothing between you and it, "
            "since paper or skin stops alpha, but it must never be ingested. A "
            "beta source calls for a few millimetres of a light material like "
            "aluminium or acrylic, which absorbs the electrons without generating "
            "much secondary radiation. A gamma source demands the heavy shielding, "
            "lead or thick concrete, because the photons pass through light "
            "materials with ease. Medicine exploits these traits deliberately: "
            "technetium-99m, with a half life of about 6 hours, emits an imaging "
            "gamma ray and then decays fast enough to limit the patient's total "
            "dose, which is why it is a workhorse of diagnostic scans."
        ),
        try_it_prompt=(
            "A technician needs to shield a source that emits only beta particles. "
            "Is a few millimetres of aluminium or a thick lead wall the more "
            "appropriate first choice, and why is paper not enough?"
        ),
        try_it_answer=(
            "A few millimetres of aluminium is the appropriate choice, since that "
            "stops beta particles. Paper stops only the much less penetrating "
            "alpha and would let beta through, while a thick lead wall is more "
            "than beta requires, though it would do no harm."
        ),
        pitfall=(
            "The pitfall is ranking a radiation's danger only by how far it "
            "penetrates. Alpha penetrates the least yet is the most damaging once "
            "inside the body, because it dumps all its energy in a small volume of "
            "tissue, so an alpha emitter that is harmless on a bench can be serious "
            "if inhaled, and penetration and biological hazard are not the same "
            "ranking."
        ),
        misconception=None,
        claims=(
            Source("technetium-99m has a half life of about 6 hours", OPENSTAX_NUCLEAR),
        ),
    ),
}
