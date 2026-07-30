"""GEN1 fill E: the missing lessons of Unit 10 (liquids and solids) and Unit 11
(solutions).

Twelve lessons, one per unauthored node in GEN1-U10 and GEN1-U11, in curriculum
order. Each carries the full six part arc from the teaching model, and the
compliance checker rejects any lesson with an empty part.

General chemistry lessons are allowed an empty claims tuple, but the honesty
rule is not relaxed here. Every molecule named carries a Formula claim that
RDKit re-derives from structure, and every measured physical constant stated in
prose carries a Source claim naming a real reference. Worked examples that use
round numbers say so in the prose, so a reader never mistakes a teaching value
for a measurement.
"""

from __future__ import annotations

from app.data.claims import Formula, Relationship, Source
from app.data.lesson_types import Lesson

LESSONS_GEN1_FILL_E: dict[str, Lesson] = {
    "GEN1.IMFPROPERTIES": Lesson(
        node="GEN1.IMFPROPERTIES",
        objective=(
            "Predict how boiling point, viscosity, and surface tension change "
            "as intermolecular forces get stronger, and use those properties to "
            "rank two liquids."
        ),
        build_on=(
            "You ranked the three intermolecular forces in the previous lesson, "
            "from dispersion up through dipole dipole to hydrogen bonding. This "
            "lesson turns that ranking into predictions you can measure with a "
            "thermometer and a dropper."
        ),
        core_idea=(
            "The bulk properties of a liquid are the intermolecular forces read "
            "at human scale. Boiling requires pulling molecules fully apart into "
            "the gas, so the stronger the forces holding them together, the more "
            "energy that takes and the higher the boiling point. Viscosity is a "
            "liquid's resistance to flowing, which is molecules dragging past "
            "one another, so stronger attractions make a thicker, slower liquid "
            "like honey compared with water. Surface tension is the inward pull "
            "on the molecules at the surface, which have neighbors beside and "
            "below but none above, so the surface behaves like a stretched skin "
            "that a water strider can stand on and that pulls a small droplet "
            "into a bead. Capillary action, the rise of a liquid up a thin tube, "
            "is a contest between the liquid sticking to the tube wall and the "
            "liquid sticking to itself. Each of these grows in the same "
            "direction: strengthen the forces between molecules and the boiling "
            "point, the viscosity, and the surface tension all go up together."
        ),
        worked_example=(
            "Compare two liquids with the same molecular formula, C2H6O, so mass "
            "cannot be the deciding factor. Ethanol, CH3CH2OH, has an O H bond "
            "and can hydrogen bond to its neighbors. Dimethyl ether, CH3OCH3, "
            "has the same atoms rearranged so every hydrogen sits on carbon, "
            "which leaves it with dipole dipole forces but no hydrogen bonding. "
            "Predict from the forces alone: ethanol should be much harder to "
            "boil. The measurement agrees, since ethanol boils at 78 degrees C "
            "while dimethyl ether boils at minus 24 degrees C, a gap of more "
            "than one hundred degrees between two compounds built from identical "
            "atoms. Ethanol is also the more viscous and higher surface tension "
            "of the two, and every one of those differences traces back to the "
            "one structural fact that ethanol can hydrogen bond and its isomer "
            "cannot. Notice that the reasoning never needed the molar mass, "
            "because holding the formula fixed removed mass from the comparison "
            "and left the intermolecular forces as the only variable."
        ),
        try_it_prompt=(
            "Glycerol, C3H8O3, carries three O H groups per molecule, while "
            "1-propanol, C3H8O, carries one. Which would you expect to be the "
            "more viscous liquid, and why?"
        ),
        try_it_answer=(
            "Glycerol, and by a wide margin. Three O H groups per molecule give "
            "many more hydrogen bonding sites, so glycerol molecules cling to "
            "their neighbors far more tightly and drag past one another more "
            "slowly, which is what high viscosity is. This is why glycerol pours "
            "like syrup and 1-propanol pours almost like water."
        ),
        pitfall=(
            "The trap is reaching for molar mass first every time. Mass does "
            "drive dispersion forces and often wins when the two liquids are "
            "similar, but it is beaten whenever hydrogen bonding is on the "
            "table. Water boils far higher than the much heavier liquid octane "
            "because water hydrogen bonds and octane only has dispersion, so "
            "check for hydrogen bonding before you compare masses."
        ),
        misconception=None,
        claims=(
            Formula("CCO", "C2H6O", "ethanol"),
            Formula("COC", "C2H6O", "dimethyl ether"),
            Relationship(
                "CCO", "COC", "constitutional",
                "same formula, different connectivity, so mass is held fixed",
            ),
            Formula("OCC(O)CO", "C3H8O3", "glycerol"),
            Formula("CCCCCCCC", "C8H18", "octane"),
            Source(
                "Ethanol boils at about 78 degrees C and dimethyl ether at "
                "about minus 24 degrees C, both at 1 atmosphere.",
                "OpenStax Chemistry 2e, Chapter 10 (Liquids and Solids).",
            ),
        ),
    ),
    "GEN1.PHASECHANGE": Lesson(
        node="GEN1.PHASECHANGE",
        objective=(
            "Read a heating curve and calculate the energy a phase change "
            "requires, keeping the sloped warming steps separate from the flat "
            "transition steps."
        ),
        build_on=(
            "You now know that stronger intermolecular forces make a substance "
            "harder to boil. A phase change is the moment those forces are being "
            "broken or formed, and this lesson tracks the energy that moment "
            "costs."
        ),
        core_idea=(
            "Heat a solid steadily and plot its temperature against energy "
            "added, and you get a staircase rather than a straight line. On the "
            "sloped parts the substance is one phase and its temperature climbs, "
            "and the energy there follows q equals m times c times the change "
            "in temperature, where c is the specific heat. On the flat parts the "
            "substance is melting or boiling, and the temperature does not move "
            "at all even though energy keeps pouring in. That energy is going "
            "into pulling the particles apart against their intermolecular "
            "forces rather than into speeding them up, which is why the "
            "thermometer stalls. The flat step energy follows q equals m times "
            "the heat of the transition, using the heat of fusion for melting "
            "and the heat of vaporization for boiling. The single idea that "
            "organizes the whole curve is that added energy goes into "
            "temperature or into the transition, never into both at once."
        ),
        worked_example=(
            "Find the energy needed to take 50.0 g of ice at 0 degrees C to "
            "liquid water at 25 degrees C. This crosses one flat step, melting, "
            "and then one sloped step, warming, so handle them separately. "
            "Melting first: the heat of fusion of water is 334 J per g, so "
            "q1 equals 50.0 g times 334 J per g, which is 16700 J, or 16.7 kJ. "
            "During this entire step the temperature holds at 0 degrees C while "
            "the ice turns to water, which is the flat tread of the staircase. "
            "Warming second: the specific heat of liquid water is 4.18 J per g "
            "per degree C, so q2 equals 50.0 g times 4.18 J per g per degree C "
            "times 25 degrees C, which is 5225 J, or 5.22 kJ. Add the two: "
            "16.7 plus 5.22 equals 21.9 kJ total. The lesson of the numbers is "
            "that melting alone took more than three times the energy of the "
            "entire 25 degree warming, because breaking the intermolecular "
            "forces of the solid is expensive."
        ),
        try_it_prompt=(
            "How much energy does it take to melt 18.0 g of ice already sitting "
            "at 0 degrees C, and what happens to the temperature while it melts? "
            "The heat of fusion of water is 334 J per g."
        ),
        try_it_answer=(
            "About 6.01 kJ. The calculation is 18.0 g times 334 J per g, which "
            "is 6012 J. The temperature stays fixed at 0 degrees C the whole "
            "time, because on a flat step every joule goes into separating the "
            "particles rather than into raising the temperature."
        ),
        pitfall=(
            "The trap is trying to push the temperature up during a phase "
            "change with a q equals m c delta T calculation. There is no delta T "
            "on a flat step, so that formula returns zero and hides the very "
            "energy the melting or boiling demanded. Switch to the heat of "
            "fusion or vaporization the instant the thermometer stops moving."
        ),
        misconception=None,
        claims=(
            Formula("O", "H2O", "water"),
            Source(
                "The heat of fusion of water is about 334 J per g and the "
                "specific heat of liquid water is about 4.18 J per g per "
                "degree C.",
                "OpenStax Chemistry 2e, Chapter 10 (Liquids and Solids) and "
                "Chapter 5 (Thermochemistry).",
            ),
        ),
    ),
    "GEN1.VAPORPRESSURE": Lesson(
        node="GEN1.VAPORPRESSURE",
        objective=(
            "Explain vapor pressure as an escaping tendency and use the "
            "Clausius Clapeyron relationship to find a vapor pressure at a new "
            "temperature."
        ),
        build_on=(
            "You saw that boiling a liquid takes a large heat of vaporization. "
            "Vapor pressure is what a liquid does below its boiling point, where "
            "only the fastest molecules escape, and its temperature dependence "
            "runs on that same heat of vaporization."
        ),
        core_idea=(
            "Cap a liquid in a container and some of its molecules leave the "
            "surface for the gas while others return, and vapor pressure is the "
            "pressure of the gas once those two rates balance. It measures the "
            "escaping tendency of the liquid, so a volatile liquid with weak "
            "intermolecular forces has a high vapor pressure and a liquid with "
            "strong forces has a low one. The temperature dependence is steep "
            "because raising the temperature widens the spread of molecular "
            "speeds and sharply increases the fraction moving fast enough to "
            "escape. The Clausius Clapeyron relationship captures that as "
            "ln(P2 / P1) equals minus (dHvap / R) times (1 / T2 minus 1 / T1), "
            "where dHvap is the heat of vaporization, R is the gas constant, and "
            "the temperatures are absolute. The equation says the logarithm of "
            "the vapor pressure ratio is set by the heat of vaporization and the "
            "change in reciprocal temperature, so you can predict the pressure "
            "at one temperature from its value at another."
        ),
        worked_example=(
            "Take a liquid whose vapor pressure is 100.0 torr at 300 K, and find "
            "its vapor pressure at 320 K. Use a heat of vaporization of "
            "40.0 kJ per mol, a round number chosen here for clean arithmetic "
            "rather than measured from any real liquid, and the gas constant "
            "R equal to 8.314 J per mol per K. First convert the heat to joules "
            "and divide by R: 40000 divided by 8.314 is 4811 K. Next the "
            "reciprocal temperature term: 1 divided by 320 minus 1 divided by "
            "300 is 0.003125 minus 0.003333, which is minus 0.0002083 per K. "
            "Now assemble the right side: minus 4811 times minus 0.0002083 is "
            "plus 1.002, so ln(P2 / 100.0) equals 1.002. Exponentiate both "
            "sides: P2 divided by 100.0 is e to the 1.002, which is 2.72, so "
            "P2 is 272 torr. The vapor pressure nearly tripled over a 20 K "
            "warming, which shows how steeply escaping tendency climbs with "
            "temperature."
        ),
        try_it_prompt=(
            "Two liquids start at the same vapor pressure, and one has a larger "
            "heat of vaporization than the other. Warmed by the same number of "
            "degrees, which one's vapor pressure rises by the larger factor?"
        ),
        try_it_answer=(
            "The liquid with the larger heat of vaporization. In the Clausius "
            "Clapeyron relationship the log of the pressure ratio is "
            "proportional to dHvap, so for the same change in reciprocal "
            "temperature a larger dHvap produces a larger ratio, meaning a "
            "steeper rise. Its vapor pressure is lower overall but climbs by the "
            "bigger multiple."
        ),
        pitfall=(
            "The trap is plugging Celsius temperatures into the reciprocal "
            "terms. The relationship uses absolute temperature, so a value in "
            "degrees C makes 1 over T meaningless and can even divide by zero at "
            "the ice point. Convert to kelvin before you take any reciprocal."
        ),
        misconception=None,
        claims=(
            Formula("O", "H2O", "water"),
            Source(
                "The molar gas constant R is 8.314 J per mol per K.",
                "CRC Handbook of Chemistry and Physics, 97th edition, table of "
                "fundamental physical constants.",
            ),
        ),
    ),
    "GEN1.PHASEDIAGRAM": Lesson(
        node="GEN1.PHASEDIAGRAM",
        objective=(
            "Read the physical state of a substance off a pressure temperature "
            "phase diagram, and locate the triple point and critical point."
        ),
        build_on=(
            "The vapor pressure curve you built in the last lesson is one of the "
            "lines on a phase diagram. This lesson assembles that line together "
            "with the melting and sublimation lines into a single map of state."
        ),
        core_idea=(
            "A phase diagram plots pressure against temperature and divides the "
            "plane into regions, one for solid, one for liquid, and one for gas, "
            "so any point on the map tells you the stable state at that pressure "
            "and temperature. The lines between regions are the conditions where "
            "two phases coexist, and the liquid gas line is exactly the vapor "
            "pressure curve. Two points on the map have names. The triple point "
            "is the single pressure and temperature where all three phases "
            "coexist at once, and the critical point is where the liquid gas "
            "line ends, beyond which the liquid and gas become one "
            "indistinguishable supercritical fluid. Most substances lean their "
            "solid liquid line slightly to the right, so squeezing them freezes "
            "them, but water leans that line to the left because ice is less "
            "dense than liquid water, so higher pressure lowers water's melting "
            "point. Reading state is then a matter of finding your pressure and "
            "temperature on the map and seeing which region you land in."
        ),
        worked_example=(
            "Use carbon dioxide to see why dry ice does not melt into a puddle. "
            "On the CO2 phase diagram, follow the pressure line at 1 atmosphere "
            "and warm a block of solid CO2 from very cold. Instead of crossing "
            "into a liquid region, you cross straight from solid to gas, so the "
            "block sublimes and vanishes as vapor at about minus 78 degrees C. "
            "The reason is on the map: the triple point of CO2 sits at about "
            "5.1 atmospheres, which is above 1 atmosphere, so the horizontal "
            "line at 1 atmosphere passes entirely below the triple point and "
            "never touches the liquid region. To get liquid CO2 at all you must "
            "raise the pressure above roughly 5.1 atmospheres first, which is "
            "why a CO2 fire extinguisher holds liquid under pressure but a block "
            "of dry ice sitting on a table only smokes and shrinks. Reading the "
            "state was a matter of tracing one horizontal line and noting which "
            "regions it entered."
        ),
        try_it_prompt=(
            "Water's solid liquid line slopes up and to the left, toward lower "
            "temperature as pressure rises. What does that predict about the "
            "melting point of ice when you press on it hard?"
        ),
        try_it_answer=(
            "Pressing on ice lowers its melting point, so enough pressure can "
            "melt ice that was stable a moment before. That left leaning line is "
            "unusual and traces back to ice being less dense than liquid water, "
            "so pressure favors the denser liquid."
        ),
        pitfall=(
            "The trap is assuming every substance has a liquid state at ordinary "
            "pressure. Whether a liquid region is reachable at 1 atmosphere "
            "depends on where the triple point pressure sits, and for carbon "
            "dioxide it sits above 1 atmosphere, so at room pressure CO2 skips "
            "the liquid entirely and sublimes."
        ),
        misconception=None,
        claims=(
            Formula("O", "H2O", "water"),
            Formula("O=C=O", "CO2", "carbon dioxide"),
            Source(
                "The triple point of carbon dioxide lies at about 5.1 "
                "atmospheres, above ordinary atmospheric pressure, so solid CO2 "
                "sublimes at 1 atmosphere.",
                "OpenStax Chemistry 2e, Chapter 10 (Liquids and Solids).",
            ),
        ),
    ),
    "GEN1.SOLIDTYPES": Lesson(
        node="GEN1.SOLIDTYPES",
        objective=(
            "Classify a crystalline solid as ionic, molecular, metallic, or "
            "covalent network from its melting point, hardness, and electrical "
            "behavior."
        ),
        build_on=(
            "You have been ranking the forces between separate molecules. A "
            "solid is what those particles form when the attractions win, and "
            "the kind of particle and force sets which of four families the "
            "solid belongs to."
        ),
        core_idea=(
            "Crystalline solids sort into four types by what sits at the lattice "
            "points and what holds them there. An ionic solid such as sodium "
            "chloride is a lattice of cations and anions held by strong "
            "electrostatic attraction, giving high melting points, brittleness, "
            "and no conduction as a solid but conduction once molten or "
            "dissolved because the ions can then move. A molecular solid such as "
            "solid carbon dioxide is a lattice of whole molecules held only by "
            "intermolecular forces, so it is soft, low melting, and does not "
            "conduct. A metallic solid such as copper is a lattice of cations in "
            "a shared sea of mobile electrons, which makes it shiny, malleable, "
            "and a conductor even as a solid. A covalent network solid such as "
            "diamond or quartz is one continuous web of covalent bonds, so "
            "melting it means breaking covalent bonds throughout, which makes it "
            "extremely hard, extremely high melting, and usually a nonconductor. "
            "The three tests that separate them are melting point, hardness, and "
            "whether the solid conducts electricity."
        ),
        worked_example=(
            "Classify four unknown solids from their properties. Solid A melts "
            "near 800 degrees C, is brittle, and conducts only after it melts: "
            "the brittleness and the conduct only when molten behavior point to "
            "mobile ions locked in place until melting frees them, so A is "
            "ionic, and sodium chloride, NaCl, fits. Solid B melts below room "
            "temperature, is soft, and never conducts: whole molecules held by "
            "weak forces, so B is molecular, and solid carbon dioxide, CO2, "
            "fits. Solid C is shiny, bends without shattering, and conducts "
            "electricity while still solid: a sea of mobile electrons, so C is "
            "metallic, and copper, Cu, fits. Solid D does not melt until well "
            "past 1000 degrees C, scratches glass, and does not conduct: a "
            "continuous covalent web, so D is covalent network, and silicon "
            "dioxide, SiO2, the quartz in sand, fits. The deciding move each "
            "time was to ask what particle sits at the lattice point and what "
            "force must be overcome to melt it."
        ),
        try_it_prompt=(
            "Silicon carbide is nearly as hard as diamond, melts above 2000 "
            "degrees C, and does not conduct electricity. Which of the four "
            "solid types is it, and what does that imply about its bonding?"
        ),
        try_it_answer=(
            "A covalent network solid. Extreme hardness together with a melting "
            "point above 2000 degrees C means melting it requires breaking "
            "covalent bonds that run continuously through the crystal, which is "
            "the signature of a covalent network rather than a lattice held by "
            "weaker forces."
        ),
        pitfall=(
            "The trap is expecting an ionic solid to conduct because you have "
            "heard salt water conducts. Solid sodium chloride does not conduct, "
            "since its ions are pinned in the lattice; it conducts only once it "
            "is melted or dissolved and the ions are free to move. Test "
            "conduction in the state you actually have."
        ),
        misconception=None,
        claims=(
            Formula("[Na+].[Cl-]", "ClNa", "sodium chloride"),
            Formula("O=C=O", "CO2", "carbon dioxide"),
            Formula("[Cu]", "Cu", "copper"),
            Formula("O=[Si]=O", "O2Si", "silicon dioxide"),
        ),
    ),
    "GEN1.UNITCELLS": Lesson(
        node="GEN1.UNITCELLS",
        objective=(
            "Count the atoms in a cubic unit cell, state its coordination "
            "number, and calculate a metal's density from its unit cell edge."
        ),
        build_on=(
            "You know a crystalline solid is a repeating lattice. The unit cell "
            "is the smallest tile of that repeat, and this lesson shows how much "
            "you can compute once you know its shape and size."
        ),
        core_idea=(
            "A crystal is one small pattern, the unit cell, stacked in three "
            "dimensions, so knowing the cell tells you the whole solid. For the "
            "three cubic cells you count atoms by how much of each shared atom "
            "belongs to one cell: a corner atom is split among eight cells so it "
            "counts as one eighth, a face atom is split between two cells so it "
            "counts as one half, and a body center atom belongs to one cell so "
            "it counts as one. A simple cubic cell has eight corners and holds "
            "one atom, a body centered cubic cell adds a center and holds two, "
            "and a face centered cubic cell has eight corners plus six faces and "
            "holds four. Coordination number, the count of nearest neighbors "
            "touching one atom, rises with packing efficiency: six for simple "
            "cubic, eight for body centered, and twelve for face centered. "
            "Because the cell has a known number of atoms of known mass in a "
            "known volume, its density is Z times M divided by the product of "
            "Avogadro's number and the cube of the edge length, where Z is atoms "
            "per cell and M is the molar mass."
        ),
        worked_example=(
            "Compute the density of copper, which crystallizes face centered "
            "cubic. A face centered cell holds Z equal to 4 atoms, one eighth "
            "from each of eight corners giving one, plus one half from each of "
            "six faces giving three. Copper's molar mass M is 63.55 g per mol, "
            "and its unit cell edge is 361.5 pm, which is 3.615 times 10 to the "
            "minus 8 cm. Avogadro's number is 6.022 times 10 to the 23 per mol. "
            "Cube the edge first: (3.615 times 10 to the minus 8) cubed is "
            "4.724 times 10 to the minus 23 cm cubed. The mass in one cell is "
            "Z times M divided by Avogadro's number: 4 times 63.55 is 254.2, and "
            "254.2 divided by 6.022 times 10 to the 23 is 4.221 times 10 to the "
            "minus 22 g. Divide that mass by the cell volume: 4.221 times 10 to "
            "the minus 22 divided by 4.724 times 10 to the minus 23 is 8.94 g "
            "per cm cubed. That matches the handbook density of copper, which is "
            "the check that the counting and the unit conversions were right."
        ),
        try_it_prompt=(
            "How many atoms belong to a body centered cubic unit cell, and what "
            "is its coordination number?"
        ),
        try_it_answer=(
            "Two atoms and a coordination number of eight. The eight corner "
            "atoms contribute one eighth each for a total of one, the single "
            "body center atom contributes one, giving two, and that central atom "
            "touches all eight corner atoms, so each atom has eight nearest "
            "neighbors."
        ),
        pitfall=(
            "The trap is counting a corner atom as a whole atom. Each corner is "
            "shared among the eight cells that meet there, so it counts as one "
            "eighth, and treating it as one atom overcounts a face centered cell "
            "as eleven atoms instead of four and throws the density off by "
            "nearly a factor of three."
        ),
        misconception=None,
        claims=(
            Formula("[Cu]", "Cu", "copper"),
            Source(
                "Copper crystallizes face centered cubic with a unit cell edge "
                "of about 361.5 pm.",
                "OpenStax Chemistry 2e, Chapter 10 (Liquids and Solids).",
            ),
            Source(
                "Avogadro's number is 6.022 times 10 to the 23 per mol.",
                "CRC Handbook of Chemistry and Physics, 97th edition, table of "
                "fundamental physical constants.",
            ),
        ),
    ),
    "GEN1.DISSOLUTION": Lesson(
        node="GEN1.DISSOLUTION",
        objective=(
            "Explain whether a solute dissolves in a solvent by weighing the "
            "three sets of interactions that dissolving must trade off."
        ),
        build_on=(
            "The intermolecular forces you ranked in Unit 10 are the same forces "
            "that decide dissolving. Making a solution means breaking some of "
            "them and forming others, and this lesson tallies that trade."
        ),
        core_idea=(
            "Dissolving a solute in a solvent rearranges three sets of "
            "attractions. You must pull solute particles away from each other, "
            "breaking solute solute interactions, and pull solvent molecules "
            "apart to make room, breaking solvent solvent interactions, both of "
            "which cost energy. In return you form new solute solvent "
            "interactions, which release energy. A solute tends to dissolve when "
            "the new solute solvent interactions are comparable to the ones "
            "broken, so the tradeoff is not badly unfavorable, and the "
            "disorder gained by mixing then tips the balance toward solution. "
            "This is the reasoning behind like dissolves like: a polar or ionic "
            "solute dissolves in a polar solvent such as water because ion "
            "dipole and hydrogen bonding interactions can replace what was "
            "broken, while a nonpolar solute dissolves in a nonpolar solvent "
            "because dispersion interactions on both sides match. Mismatched "
            "pairs fail because the new interactions are too weak to pay for the "
            "ones broken."
        ),
        worked_example=(
            "Explain why sodium chloride dissolves in water but oil does not, "
            "using the three interactions each time. For NaCl in water, the "
            "solute solute interaction is the strong ionic attraction of the "
            "lattice, and the solvent solvent interaction is water's hydrogen "
            "bonding. Both are broken, but in exchange each Na and Cl ion is "
            "surrounded by water molecules in strong ion dipole interactions, "
            "with the partially negative oxygen ends pointing at Na and the "
            "partially positive hydrogen ends pointing at Cl. Those new "
            "interactions, helped by the disorder of mixing, pay for the lattice "
            "and the salt dissolves. Now oil in water: oil is nonpolar, so the "
            "only interaction it can offer water is weak dispersion, far weaker "
            "than the hydrogen bonds among water molecules that would have to "
            "break to admit it. Water holds onto its own hydrogen bonds and "
            "excludes the oil, so the two form layers rather than a solution. "
            "The same tally, run twice, predicts both outcomes."
        ),
        try_it_prompt=(
            "Iodine, I2, is a nonpolar solid. Would you expect it to dissolve "
            "better in water or in a nonpolar solvent like octane, and which "
            "interactions decide it?"
        ),
        try_it_answer=(
            "Better in octane. Iodine offers only dispersion interactions, which "
            "match octane's own dispersion interactions, so the trade is even. "
            "In water it would have to break strong hydrogen bonds and could "
            "offer only weak dispersion in return, so water excludes it. Like "
            "dissolves like."
        ),
        pitfall=(
            "The trap is thinking a solute dissolves because the solvent is "
            "somehow strong or good at dissolving. Water dissolves salt and "
            "refuses oil, so no solvent is universally good; what matters is "
            "whether the solute solvent interactions can match the ones that "
            "dissolving has to break."
        ),
        misconception=None,
        claims=(
            Formula("[Na+].[Cl-]", "ClNa", "sodium chloride"),
            Formula("O", "H2O", "water"),
            Formula("CCCCCCCC", "C8H18", "octane"),
            Formula("II", "I2", "iodine"),
        ),
    ),
    "GEN1.SOLUBILITYFACTORS": Lesson(
        node="GEN1.SOLUBILITYFACTORS",
        objective=(
            "Distinguish unsaturated, saturated, and supersaturated solutions, "
            "and predict how temperature shifts the amount of solute a solvent "
            "will hold."
        ),
        build_on=(
            "You know what makes a solute dissolve at all. This lesson asks the "
            "next question, which is how much will dissolve before the solvent "
            "can take no more, and what changes that limit."
        ),
        core_idea=(
            "Solubility is the maximum amount of a solute a given amount of "
            "solvent will hold at a stated temperature, and it marks a dynamic "
            "equilibrium where solute dissolves and crystallizes back at equal "
            "rates. A solution below that limit is unsaturated and can take "
            "more, a solution right at the limit is saturated, and a solution "
            "holding more than the limit is supersaturated, an unstable state "
            "that dumps its excess the moment it is disturbed. Temperature moves "
            "the limit, and the direction depends on the solute. Most solids "
            "dissolve more in hot solvent than in cold, so cooling a saturated "
            "hot solution forces the excess to crystallize out. Gases run the "
            "other way, dissolving less as temperature rises, which is why a "
            "warm carbonated drink goes flat faster than a cold one. Reading a "
            "solubility curve, a plot of solubility against temperature, lets "
            "you predict how much comes out of solution on cooling."
        ),
        worked_example=(
            "Work through a cooling experiment with round teaching numbers "
            "chosen for the arithmetic rather than measured from a real salt. "
            "Suppose a salt dissolves to 100 g per 100 g of water at 60 degrees "
            "C and to 40 g per 100 g of water at 20 degrees C. Saturate the "
            "solution at 60 degrees C so it holds 100 g in 100 g of water, then "
            "cool it slowly to 20 degrees C. The limit at 20 degrees C is 40 g, "
            "so the water can no longer hold the extra, and 100 minus 40 equals "
            "60 g of salt crystallizes out, leaving a saturated solution behind. "
            "Now cool a fresh batch very gently without any dust or seed "
            "crystal, and it can slip past 40 g while still holding all 100 g, a "
            "supersaturated solution. Drop in a single seed crystal and the "
            "excess 60 g crashes out almost at once, releasing warmth. That is "
            "the reusable hand warmer, where sodium acetate is held "
            "supersaturated until a metal disk triggers it."
        ),
        try_it_prompt=(
            "A solution is holding more dissolved solute than its saturation "
            "value at that temperature, and stays that way until you drop in a "
            "crystal. What is this state called, and what happens when you add "
            "the crystal?"
        ),
        try_it_answer=(
            "It is supersaturated. Adding a seed crystal gives the excess solute "
            "a surface to build on, so it crystallizes out rapidly until the "
            "solution falls back to its saturated limit for that temperature."
        ),
        pitfall=(
            "The trap is assuming higher temperature always dissolves more of "
            "everything. That holds for most solids but reverses for gases, "
            "which dissolve less as temperature climbs, so heating a carbonated "
            "or oxygen bearing solution drives dissolved gas out rather than "
            "taking more in."
        ),
        misconception=None,
        claims=(
            Formula("CC(=O)[O-].[Na+]", "C2H3NaO2", "sodium acetate"),
        ),
    ),
    "GEN1.HENRY": Lesson(
        node="GEN1.HENRY",
        objective=(
            "Use Henry's law to predict how the amount of a dissolved gas "
            "changes when the partial pressure of that gas above the liquid "
            "changes."
        ),
        build_on=(
            "You saw that gases grow less soluble as temperature rises. Pressure "
            "is the other lever on a dissolved gas, and this lesson makes its "
            "effect quantitative."
        ),
        core_idea=(
            "The amount of a gas that dissolves in a liquid is set by the "
            "partial pressure of that gas above the surface. Henry's law states "
            "the solubility S is proportional to that partial pressure P, so "
            "S equals kH times P, where kH is a constant for a given gas, "
            "liquid, and temperature. Because it is a proportionality, you often "
            "do not need the value of kH at all: doubling the partial pressure "
            "doubles the dissolved gas, and cutting the partial pressure cuts "
            "the dissolved gas by the same ratio. Physically, more gas molecules "
            "pressing on the surface strike and enter the liquid more often, so "
            "the equilibrium sits at a higher dissolved amount. This is why a "
            "carbonated drink is bottled under a high pressure of carbon dioxide "
            "and why it fizzes when opened, since releasing the pressure drops "
            "the partial pressure of CO2 above the liquid and the drink can no "
            "longer hold what it did."
        ),
        worked_example=(
            "Follow the carbon dioxide in a soda without ever needing the value "
            "of kH, by working with ratios. Suppose the bottling plant seals the "
            "drink under a carbon dioxide partial pressure of 4.0 atmospheres. "
            "By Henry's law the dissolved CO2 is proportional to that pressure, "
            "so if a competing plant sealed an identical drink under 2.0 "
            "atmospheres instead, half the pressure, its drink would hold half "
            "the dissolved CO2. Write it as a ratio to see the kH cancel: "
            "S2 divided by S1 equals P2 divided by P1 equals 2.0 divided by 4.0, "
            "which is one half, so S2 is half of S1. When you open either "
            "bottle, the partial pressure of CO2 above the liquid falls sharply "
            "toward the small amount in open air, so the equilibrium dissolved "
            "amount drops far below what the sealed bottle held, and the excess "
            "leaves as the fizz you see and hear."
        ),
        try_it_prompt=(
            "A scuba diver breathes air at higher pressure the deeper they go, "
            "so more nitrogen dissolves in the blood. Which law explains the "
            "extra dissolved nitrogen at depth, and what does it say happens if "
            "the diver surfaces too fast?"
        ),
        try_it_answer=(
            "Henry's law. Dissolved gas is proportional to its partial pressure, "
            "which rises with depth, so more nitrogen dissolves. Surfacing too "
            "fast drops the pressure quickly, so the blood is briefly "
            "supersaturated and nitrogen comes out as bubbles, which is the "
            "decompression sickness divers call the bends."
        ),
        pitfall=(
            "The trap is mixing up the two levers on gas solubility. Raising "
            "temperature drives dissolved gas out, but raising the partial "
            "pressure of the gas drives more in, so warming a bottle and "
            "pressurizing it push in opposite directions. Name which quantity "
            "changed before you predict the direction."
        ),
        misconception=None,
        claims=(
            Formula("O=C=O", "CO2", "carbon dioxide"),
        ),
    ),
    "GEN1.MOLALITY": Lesson(
        node="GEN1.MOLALITY",
        objective=(
            "Calculate molality and mole fraction from masses, and explain why "
            "these units, unlike molarity, do not drift with temperature."
        ),
        build_on=(
            "You learned molarity earlier as moles of solute per liter of "
            "solution. Molality and mole fraction answer the same how "
            "concentrated question with mass instead of volume, and this lesson "
            "shows why that difference matters."
        ),
        core_idea=(
            "Molality is moles of solute per kilogram of solvent, and mole "
            "fraction is the moles of one component divided by the total moles "
            "of everything in the mixture. Both are built from masses and mole "
            "counts, and neither one mentions a volume. That is the whole reason "
            "they exist alongside molarity. Molarity is per liter of solution, "
            "and the volume of a solution expands when you heat it and contracts "
            "when you cool it, so a solution's molarity drifts with temperature "
            "even though not a single particle entered or left. Mass does not "
            "change with temperature, so molality and mole fraction stay fixed "
            "whether the beaker is on ice or on a hot plate. That makes them the "
            "right units for any measurement taken across a range of "
            "temperatures, including the boiling point and freezing point "
            "effects you will meet next."
        ),
        worked_example=(
            "Dissolve 90.0 g of glucose, C6H12O6, in 500.0 g of water and find "
            "both the molality and the mole fraction of glucose. First convert "
            "each mass to moles using molar masses built from the periodic "
            "table. Glucose is 180.16 g per mol, so 90.0 divided by 180.16 is "
            "0.500 mol. The solvent mass is 500.0 g, which is 0.5000 kg. "
            "Molality is moles of solute over kilograms of solvent: 0.500 "
            "divided by 0.5000 is 1.00 mol per kg. Now the mole fraction, which "
            "needs the moles of water too: water is 18.02 g per mol, so 500.0 "
            "divided by 18.02 is 27.7 mol. The mole fraction of glucose is its "
            "moles over the total moles: 0.500 divided by (0.500 plus 27.7), "
            "which is 0.500 divided by 28.2, giving 0.0177. Both answers came "
            "from masses and mole counts alone, with no volume anywhere, which "
            "is exactly why neither would change if the solution warmed up."
        ),
        try_it_prompt=(
            "Why do chemists reach for molality rather than molarity when an "
            "experiment will run across a range of temperatures?"
        ),
        try_it_answer=(
            "Because molality is defined by the mass of solvent, which does not "
            "change with temperature, while molarity is per liter of solution "
            "and that volume expands or contracts as the temperature changes. "
            "Molality holds steady, so it does not introduce a drift that has "
            "nothing to do with adding or removing solute."
        ),
        pitfall=(
            "The trap is dividing by the mass or volume of the whole solution "
            "instead of the solvent. Molality is per kilogram of solvent alone, "
            "so in this example the denominator is the 0.5000 kg of water, not "
            "the combined mass of water plus glucose. Using the total mass would "
            "shrink the molality below its correct value."
        ),
        misconception=None,
        claims=(
            Formula("OCC(O)C(O)C(O)C(O)C=O", "C6H12O6", "glucose"),
            Formula("O", "H2O", "water"),
        ),
    ),
    "GEN1.OSMOSIS": Lesson(
        node="GEN1.OSMOSIS",
        objective=(
            "Calculate osmotic pressure with the van't Hoff factor, and explain "
            "why a dissolved salt counts more than a molecular solute at the "
            "same concentration."
        ),
        build_on=(
            "The colligative properties you met in the last lesson depend on the "
            "number of dissolved particles, not their identity. Osmotic pressure "
            "is another such property, and the van't Hoff factor is how you "
            "count particles when the solute splits apart."
        ),
        core_idea=(
            "Put a solution and pure solvent on opposite sides of a membrane "
            "that lets solvent through but not solute, and solvent flows into "
            "the solution. Osmotic pressure is the pressure you would have to "
            "apply to the solution to stop that flow, and it follows Pi equals "
            "i times M times R times T, with M the molarity, R the gas constant, "
            "T the absolute temperature, and i the van't Hoff factor. Osmotic "
            "pressure is a colligative property, so it depends on the number of "
            "dissolved particles rather than what they are, and that is what the "
            "van't Hoff factor tracks. A molecular solute such as glucose stays "
            "as one particle per formula unit, so i is 1. An electrolyte splits "
            "when it dissolves, so sodium chloride gives one Na and one Cl for "
            "an i of 2, and calcium chloride gives one Ca and two Cl for an i of "
            "3. Counting particles, not formula units, is the reason a salt "
            "solution pushes harder than a sugar solution of the same molarity."
        ),
        worked_example=(
            "Compare the osmotic pressure of 0.100 M glucose and 0.100 M sodium "
            "chloride at 298 K, a round temperature standing in for room "
            "temperature. Use R equal to 0.08206 L atm per mol per K, the gas "
            "constant in the units that give pressure in atmospheres. For "
            "glucose the van't Hoff factor i is 1, since glucose dissolves as "
            "whole molecules: Pi equals 1 times 0.100 times 0.08206 times 298, "
            "which is 2.45 atm. For sodium chloride i is 2, because each formula "
            "unit gives one Na ion and one Cl ion: Pi equals 2 times 0.100 times "
            "0.08206 times 298, which is 4.89 atm. The salt solution exerts "
            "about twice the osmotic pressure of the sugar solution at the same "
            "0.100 M, and the only reason is that it releases twice as many "
            "dissolved particles. The molarity was identical; the particle count "
            "was not."
        ),
        try_it_prompt=(
            "What is the ideal van't Hoff factor for calcium chloride, CaCl2, "
            "and how many times the osmotic pressure of a glucose solution of "
            "the same molarity would it produce?"
        ),
        try_it_answer=(
            "The factor is 3, because each CaCl2 releases one Ca ion and two Cl "
            "ions for three particles per formula unit. At the same molarity it "
            "would produce about three times the osmotic pressure of glucose, "
            "which has a factor of 1."
        ),
        pitfall=(
            "The trap is leaving the van't Hoff factor out for electrolytes and "
            "treating a salt like a molecular solute. A 0.100 M NaCl solution "
            "behaves close to 0.200 M in particles, so dropping the factor of 2 "
            "underestimates its osmotic pressure by half. Ask whether the solute "
            "splits before you plug in a concentration."
        ),
        misconception=None,
        claims=(
            Formula("OCC(O)C(O)C(O)C(O)C=O", "C6H12O6", "glucose"),
            Formula("[Na+].[Cl-]", "ClNa", "sodium chloride"),
            Formula("[Ca+2].[Cl-].[Cl-]", "CaCl2", "calcium chloride"),
            Source(
                "The molar gas constant R is 0.08206 L atm per mol per K.",
                "CRC Handbook of Chemistry and Physics, 97th edition, table of "
                "fundamental physical constants.",
            ),
        ),
    ),
    "GEN1.COLLOIDS": Lesson(
        node="GEN1.COLLOIDS",
        objective=(
            "Tell a colloid apart from a true solution and from a suspension "
            "using particle size, settling behavior, and the Tyndall effect."
        ),
        build_on=(
            "You have treated dissolving as making a true solution. Not every "
            "cloudy mixture is one, and this lesson places colloids and "
            "suspensions on either side of the solutions you already know."
        ),
        core_idea=(
            "Mixtures sort by the size of their dispersed particles. In a true "
            "solution the particles are individual ions or molecules, smaller "
            "than about 1 nm, so they never settle and do not scatter a beam of "
            "light. In a suspension the particles are larger than about 1000 nm, "
            "big enough that gravity pulls them down over time and a filter "
            "catches them, as muddy water clears when it stands. A colloid sits "
            "between the two, with particles from about 1 nm to about 1000 nm, "
            "large enough to scatter light but small enough that they stay "
            "dispersed and do not settle. The practical test is the Tyndall "
            "effect: shine a narrow beam of light through the mixture, and a "
            "colloid scatters the beam so its path glows visibly, while a true "
            "solution lets the beam pass without a trace. Milk, fog, gelatin, "
            "and whipped cream are everyday colloids, each a different pairing "
            "of dispersed and continuous phase."
        ),
        worked_example=(
            "Classify three mixtures by their behavior. Salt water is "
            "transparent, never settles, and a light beam passes through it "
            "unseen: the dissolved particles are ions well under 1 nm, so it is "
            "a true solution. Milk looks uniform and does not settle on the "
            "counter, but a flashlight beam through a glass of it glows along "
            "its path: the fat and protein particles are colloid sized, in the "
            "1 to 1000 nm range, large enough to scatter light yet too small to "
            "sink, so milk is a colloid. Muddy river water is cloudy and leaves "
            "a layer of sediment at the bottom of a still jar within hours, and "
            "a paper filter removes the haze: those particles are larger than "
            "1000 nm, so it is a suspension. Three questions did the sorting, "
            "which are whether it settles, whether a filter catches the "
            "particles, and whether a beam of light shows its path."
        ),
        try_it_prompt=(
            "A narrow flashlight beam is visible as a glowing path through a "
            "glass of one liquid but leaves no visible trace through a glass of "
            "sugar water. What does each result tell you about the mixture?"
        ),
        try_it_answer=(
            "The glowing path is the Tyndall effect, so that liquid is a colloid "
            "whose particles are large enough to scatter light. The sugar water "
            "shows no beam, so it is a true solution whose dissolved molecules "
            "are too small to scatter light."
        ),
        pitfall=(
            "The trap is calling any cloudy or milky liquid a suspension. "
            "Cloudiness can come from colloid particles that scatter light but "
            "never settle, as milk shows by staying uniform for days. Whether "
            "the particles settle out or a filter catches them is what separates "
            "a suspension from a colloid, not how cloudy it looks."
        ),
        misconception=None,
        claims=(
            Source(
                "Colloid particles range from about 1 nm to about 1000 nm, "
                "between the sub nanometer particles of a true solution and the "
                "larger particles of a suspension.",
                "OpenStax Chemistry 2e, Chapter 11 (Solutions and Colloids).",
            ),
        ),
    ),
}
