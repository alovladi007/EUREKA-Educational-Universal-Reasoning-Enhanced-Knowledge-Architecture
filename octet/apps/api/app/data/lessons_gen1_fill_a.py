"""GEN1 fill A: the eight unauthored nodes in units GEN1-U1, U2 and U3.

These complete the measurement, atomic-structure and mole chapters that the
migrated GEN1 lessons left with gaps. Node order inside each unit is respected,
so every build_on points at a node that genuinely precedes this one.

General chemistry lessons are allowed an empty claims tuple, but any measured
value stated in prose carries a Source, and any molecule named carries a Formula
that RDKit re-derives from its structure when the checker runs. Round numbers
used only to keep a worked example's arithmetic clean are labeled as such in the
prose so they are not read as measurements.
"""

from __future__ import annotations

from app.data.claims import Formula, Source
from app.data.lesson_types import Lesson

LESSONS_GEN1_FILL_A: dict[str, Lesson] = {
    "GEN1.STATES": Lesson(
        node="GEN1.STATES",
        objective=(
            "Describe a solid, a liquid, and a gas in terms of how their particles are arranged, how "
            "tightly they are held, and how they move, and use that picture to explain each state's shape, "
            "volume, and compressibility."
        ),
        build_on=(
            "You saw a physical change leave a substance's identity intact when ice melts to water, and this "
            "lesson looks under that change to ask what the particles are doing in each state."
        ),
        core_idea=(
            "The same particles, whether atoms, molecules, or ions, make up a substance in all three states, "
            "and what differs is their spacing, their arrangement, and how they move. In a solid the particles "
            "are packed close and locked into fixed positions, vibrating in place, so a solid keeps its own "
            "shape and its own volume and barely compresses. In a liquid the particles are still close and "
            "touching but no longer locked, so they slide past one another, which is why a liquid keeps its "
            "volume but takes the shape of whatever holds it. In a gas the particles are far apart with mostly "
            "empty space between them, moving fast and nearly independently, so a gas spreads to fill any "
            "container and can be squeezed into a smaller one because there is room to close. Temperature is a "
            "measure of the average motion of these particles, and adding energy speeds them up until they "
            "break out of the arrangement below. Because the particles themselves are unchanged from one state "
            "to the next, melting and boiling are physical changes, and cooling recovers the substance."
        ),
        worked_example=(
            "Follow one substance, water, through all three states and read each behavior off the particle "
            "picture. As ice, the H2O molecules sit in a fixed lattice, each vibrating around a home position, "
            "which is why an ice cube has a shape you can hold and a volume you can measure. Warm it past its "
            "melting point and the molecules gain enough motion to slip out of the lattice while staying in "
            "contact, so liquid water pours to fit a glass yet still occupies a definite volume: pour 50 mL "
            "into a wider glass and it is still 50 mL. Heat it past boiling and the molecules fly apart into a "
            "gas that spreads through the whole room, and now the same mass takes up far more space, which is "
            "why steam can be compressed and liquid water essentially cannot. At no point did the molecules "
            "turn into something else, since each is H2O as ice, as water, and as steam, so every step here is "
            "a physical change and cooling reverses each one. Water is unusual in one respect worth noting, "
            "because its solid floats on its liquid, which tells you the molecules in ice are spaced slightly "
            "farther apart than in the liquid."
        ),
        try_it_prompt=(
            "A gas can be squeezed into a much smaller volume with a piston, but a liquid barely budges under "
            "the same push. What does the particle picture say is the reason?"
        ),
        try_it_answer=(
            "In a gas the particles are far apart with empty space between them, so pushing them closer meets "
            "little resistance until they crowd together, while in a liquid the particles are already touching, "
            "so there is almost no empty space to close and the volume hardly changes."
        ),
        pitfall=(
            "The trap is thinking that heating a solid adds new, hotter particles or changes what the particles "
            "are. Nothing is added and nothing is transformed, since the same particles only move faster and "
            "spread out, which is why the mass of a sealed flask does not change when the ice inside it melts "
            "and then boils."
        ),
        claims=(
            Formula("O", "H2O", "water, the substance followed through all three states"),
        ),
    ),
    "GEN1.UNITS": Lesson(
        node="GEN1.UNITS",
        objective=(
            "State the SI base units for length, mass, time, temperature, and amount of substance, build "
            "derived units such as volume and density from them, and use the decimal prefixes to move between "
            "sizes."
        ),
        build_on=(
            "You have been describing gases filling a volume and particles moving faster as temperature rises, "
            "and volume and temperature are measured quantities, so this lesson fixes the system of units that "
            "gives such measurements meaning."
        ),
        core_idea=(
            "Science agrees on one system of units, the SI, so a measurement made in one lab means the same "
            "thing in another. It is built from a handful of base units, each for one kind of quantity: the "
            "meter (m) for length, the kilogram (kg) for mass, the second (s) for time, the kelvin (K) for "
            "temperature, and the mole (mol) for amount of substance. Every other unit is a derived unit, "
            "assembled from these by multiplication or division, so volume is length cubed with the unit cubic "
            "meter (m3), while the liter is a convenient derived name for one cubic decimeter, equal to 1000 "
            "cm3. Density, being mass over volume, comes out in kg/m3 or the lab-friendly g/cm3. To cover the "
            "enormous range of sizes chemistry meets, from an atom to a beaker, SI attaches decimal prefixes "
            "that are powers of ten: kilo means 10^3, centi means 10^-2, milli means 10^-3, micro means 10^-6, "
            "and nano means 10^-9. A prefix is a shorthand for a power of ten, so 1 km is 10^3 m and 1 nm is "
            "10^-9 m, and switching between them moves a decimal point without ever changing the quantity."
        ),
        worked_example=(
            "Express the radius of a typical atom, roughly 0.1 nm (a round figure chosen for the arithmetic, "
            "not a measured value), in meters, then find how many such atoms fit across a 1.0 cm gap. Start "
            "from the prefix meanings, which are exact definitions. Nano means 10^-9, so 0.1 nm is "
            "0.1 x 10^-9 m, which is 1 x 10^-10 m. Now the gap: centi means 10^-2, so 1.0 cm is 1.0 x 10^-2 m. "
            "To count how many atoms span the gap, divide the gap length by the atom size, keeping the units so "
            "they cancel: (1.0 x 10^-2 m) / (1 x 10^-10 m) = 1 x 10^8. So about one hundred million atoms lie "
            "across a centimeter, and the meters cancelled to leave a pure count, which is the check that the "
            "setup was right. The only moves were replacing each prefix with its power of ten and then "
            "dividing, and because the prefixes are exact, the two significant figures in the measured sizes "
            "set the precision of the answer."
        ),
        try_it_prompt=(
            "A sample has a mass of 2500 mg. Express it in grams and then in kilograms, and say which prefix "
            "rule you used at each step."
        ),
        try_it_answer=(
            "2500 mg is 2.500 g and 2.500 x 10^-3 kg. Milli means 10^-3, so 2500 mg = 2500 x 10^-3 g = 2.500 "
            "g, and then kilo means 10^3, so dividing by 1000 gives 2.500 x 10^-3 kg. Each step only shifted "
            "the decimal point by a known power of ten."
        ),
        pitfall=(
            "The trap is treating the kilogram as though kilo were an add-on prefix to a base unit called the "
            "gram. The SI base unit of mass is the kilogram itself, so the gram is the smaller, derived unit, "
            "which is why mass is still counted in powers of ten from the gram even though the base unit "
            "already carries the kilo."
        ),
        claims=(
            Source(
                "The SI base units and prefixes used here follow the international definitions.",
                "BIPM SI Brochure, via OpenStax Chemistry 2e chapter 1",
            ),
        ),
    ),
    "GEN1.TEMPERATURE": Lesson(
        node="GEN1.TEMPERATURE",
        objective=(
            "Convert a temperature among Celsius, Kelvin, and Fahrenheit, and explain why a gas-law "
            "calculation requires the Kelvin scale."
        ),
        build_on=(
            "You met the kelvin as the SI base unit for temperature, and this lesson is about why the kelvin, "
            "and not the everyday degree, is the scale a gas law is allowed to multiply by."
        ),
        core_idea=(
            "Temperature measures the average motion of a substance's particles, and three scales are in common "
            "use, differing only in where they put zero and how large one degree is. The Celsius scale sets "
            "zero near the freezing point of water and 100 near its boiling point at sea-level pressure, so its "
            "degrees are a handy size for weather and kitchens. The Kelvin scale uses degrees the same size as "
            "Celsius degrees but moves zero down to absolute zero, the temperature at which particle motion is "
            "at its minimum, so a Celsius reading becomes a Kelvin reading by adding an exact offset of 273.15: "
            "T(K) = T(C) + 273.15. The Fahrenheit scale, common in the United States, uses smaller degrees and "
            "a different zero, related to Celsius by T(F) = (9/5) T(C) + 32. The reason chemistry insists on "
            "Kelvin is that a gas law multiplies and divides by temperature, and those operations only make "
            "physical sense when zero on the scale means zero motion; on a scale whose zero is an arbitrary "
            "point, doubling the reading doubles nothing real."
        ),
        worked_example=(
            "A gas in a flask reads 27 C, and you need its temperature in Kelvin for a gas-law calculation and "
            "in Fahrenheit for a colleague who thinks in that scale. For Kelvin, add the offset: "
            "27 + 273.15 = 300.15 K, which you would report as 300 K if the 27 C was known only to the nearest "
            "degree, since the offset is exact and adds no precision. For Fahrenheit, apply the definition "
            "T(F) = (9/5)(27) + 32 = 48.6 + 32 = 80.6 F. Now see why the scale choice matters. Suppose the gas "
            "is heated until its Kelvin temperature doubles, from 300 K to 600 K, which on the Celsius scale is "
            "a jump from 27 C to 327 C, not a doubling of the Celsius number. Had you instead doubled the "
            "Celsius reading to 54 C, you would have described a completely different and much smaller change, "
            "because 54 C is only 327 K. The lesson is that ratios of temperature are meaningful on Kelvin and "
            "meaningless on Celsius."
        ),
        try_it_prompt=(
            "Liquid nitrogen boils at about 77 K. What is that in degrees Celsius, and why can a Kelvin "
            "temperature never be negative for any real sample?"
        ),
        try_it_answer=(
            "About -196 C, since 77 - 273.15 = -196.15. A Kelvin temperature cannot be negative because its "
            "zero is absolute zero, the point of minimum particle motion, and no sample can move less than "
            "that, so there is nothing colder than 0 K to record."
        ),
        pitfall=(
            "The trap is adding 273 to a Fahrenheit reading or otherwise mixing the two conversions. The offset "
            "of 273.15 belongs only between Celsius and Kelvin, because their degrees are the same size, while "
            "Fahrenheit degrees are smaller, so its conversion needs the 9/5 factor as well as a shift, and "
            "skipping either one lands you far from the real temperature."
        ),
        claims=(
            Source(
                "The Celsius scale is anchored near the freezing point (0 C) and boiling point (100 C) of "
                "water at standard atmospheric pressure",
                "OpenStax Chemistry 2e, Section 1.6",
            ),
            Source(
                "Nitrogen boils at about 77 K (about -196 C) at standard pressure",
                "CRC Handbook of Chemistry and Physics",
            ),
            Formula("N#N", "N2", "nitrogen, the gas of the try-it example"),
        ),
    ),
    "GEN1.SUBATOMIC": Lesson(
        node="GEN1.SUBATOMIC",
        objective=(
            "Name the three subatomic particles, state the charge, relative mass, and location of each, and "
            "say what property of an atom each one controls."
        ),
        build_on=(
            "The previous lesson placed a dense nucleus at the center of a mostly empty atom, and this lesson "
            "names the three particles that make it up and pins down what each one controls."
        ),
        core_idea=(
            "An atom is built from three kinds of particle, and each answers a different question about the "
            "atom. Protons carry a charge of +1 and sit in the nucleus, and their number, the atomic number Z, "
            "is the identity of the element and never changes in a chemical reaction. Neutrons carry no charge "
            "and also sit in the nucleus, and adding or removing them changes the mass of the atom without "
            "changing which element it is. Electrons carry a charge of -1 and occupy the large region around "
            "the nucleus, and their number sets the atom's charge and carries out all of its chemistry, since "
            "bonding is electrons rearranging. The nucleus is tiny but heavy: a proton and a neutron each have "
            "a mass close to 1 atomic mass unit, while an electron is about 1/1836 as heavy, so nearly all the "
            "mass sits in the nucleus and nearly all the volume belongs to the electrons. This picture, a small "
            "dense positive nucleus in a cloud of light electrons, is the one experiments on the atom forced "
            "chemists to accept in place of a uniform ball of matter."
        ),
        worked_example=(
            "See how the nuclear picture was forced by an experiment. A thin gold foil was struck by a beam of "
            "small, fast, positively charged particles, and where each one landed was recorded. Almost all of "
            "them passed straight through the foil as if it were not there, which says most of the atom is "
            "empty space that a fast particle sails through untouched. A very small fraction, though, were "
            "deflected sharply, and a rare few bounced almost straight back, which only makes sense if each "
            "atom hides something small, dense, and positively charged that a like-charged particle can "
            "ricochet off. Had the positive charge been smeared evenly through the atom, nothing could have "
            "turned a fast particle around. Reading those two facts together gives the nuclear atom: a minute, "
            "massive, positive nucleus surrounded by mostly empty electron territory. Now attach the particles "
            "to the model. The nucleus holds the protons, which name the element, and the neutrons, which add "
            "mass, while the surrounding space holds the electrons, which weigh almost nothing yet occupy "
            "nearly all the volume and do the chemistry."
        ),
        try_it_prompt=(
            "An atom has 11 protons, 12 neutrons, and 11 electrons. Which count would you change to turn it "
            "into a different element, which would change its mass without changing the element, and which "
            "would give it a charge?"
        ),
        try_it_answer=(
            "Changing the proton count (11) changes the element, since the proton number is the element's "
            "identity. Changing the neutron count (12) changes the mass but leaves it the same element, an "
            "isotope. Changing the electron count (11) leaves the element and mass alone but gives the atom a "
            "net charge, making it an ion."
        ),
        pitfall=(
            "The trap is thinking the electrons, because they do the chemistry, must also carry the atom's "
            "identity or its mass. They do neither, since an electron weighs about 1/1836 of a proton and so "
            "barely affects the mass, and the identity is set by the protons alone, which is why gaining or "
            "losing electrons makes an ion of the same element rather than a new element."
        ),
        claims=(
            Source(
                "A proton and a neutron each have a mass close to 1 atomic mass unit, and an electron is about "
                "1/1836 the mass of a proton",
                "CRC Handbook of Chemistry and Physics; IUPAC Gold Book",
            ),
        ),
    ),
    "GEN1.ATOMICMASS": Lesson(
        node="GEN1.ATOMICMASS",
        objective=(
            "Explain the atomic mass unit, say why a tabulated atomic mass is a weighted average that is rarely "
            "a whole number, and work backward from an average mass to find isotope abundances."
        ),
        build_on=(
            "You computed an element's average mass forward from known abundances, and this lesson pins down "
            "the mass scale that average lives on and runs the same calculation backward to recover an "
            "abundance you were not given."
        ),
        core_idea=(
            "Atomic masses are measured against a single agreed standard: one atom of carbon-12 is defined to "
            "have a mass of exactly 12 atomic mass units (u), and every other mass is a ratio to that. Because "
            "a natural element is usually a fixed blend of isotopes, the mass printed on the periodic table is "
            "not the mass of any one atom but a weighted average, each isotope mass counted in proportion to "
            "how common it is. That weighting is the first reason the tabulated value is rarely a whole number, "
            "since a mix of, say, a mass-10 and a mass-11 isotope averages to something in between. There is a "
            "second, smaller reason even a single isotope's mass is not an exact integer, because binding the "
            "nucleus together shifts its mass slightly below the sum of its separate protons and neutrons, so "
            "an isotope's true mass sits near but not exactly at its mass number. For ordinary chemistry the "
            "weighting dominates, and the skill worth having is that the averaging relation runs in both "
            "directions, so a known average together with the isotope masses lets you solve for an unknown "
            "abundance."
        ),
        worked_example=(
            "To keep the arithmetic clean, take an imaginary element with only two isotopes, one of mass 10.0 u "
            "and one of mass 11.0 u (round numbers chosen for the algebra, not measurements), whose tabulated "
            "average mass is 10.8 u, and find how common each isotope is. Let x be the fraction of atoms that "
            "are the heavier, mass-11.0 isotope, so the fraction that are the lighter, mass-10.0 isotope is "
            "(1 - x), because the two fractions must add to 1. The weighted average is the sum of each mass "
            "times its fraction: 10.0(1 - x) + 11.0(x) = 10.8. Expand and collect: "
            "10.0 - 10.0x + 11.0x = 10.8, so 10.0 + 1.0x = 10.8, which gives 1.0x = 0.8 and x = 0.80. So the "
            "heavier isotope is 80 percent of the atoms and the lighter is 20 percent. Check it forward, the "
            "way the previous lesson went: 10.0(0.20) + 11.0(0.80) = 2.0 + 8.8 = 10.8, which matches, and the "
            "average sitting closer to 11 than to 10 is exactly what an 80 percent share of the heavier isotope "
            "should produce."
        ),
        try_it_prompt=(
            "An element has two isotopes, of mass 6.0 u and 7.0 u (round numbers for the arithmetic), and a "
            "tabulated average mass of 6.9 u. Without solving the full equation, is the mass-7.0 isotope the "
            "more or the less common of the two, and roughly by how much?"
        ),
        try_it_answer=(
            "The mass-7.0 isotope is much more common, about 90 percent, because the average of 6.9 sits very "
            "close to 7.0 and far from 6.0, and a weighted average lands near the mass of whichever isotope "
            "dominates. Solving 6.0(1 - x) + 7.0x = 6.9 confirms x = 0.90."
        ),
        pitfall=(
            "The trap is averaging the two isotope masses with a plain (10.0 + 11.0)/2 average and ignoring the "
            "abundances. That plain average gives 10.5, but the real tabulated value was 10.8, and the gap is "
            "the whole point: the average is pulled toward the isotope that is more common, so discarding the "
            "weighting discards the answer."
        ),
        claims=(
            Source(
                "The unified atomic mass unit is defined so that one atom of carbon-12 has a mass of exactly "
                "12 u",
                "IUPAC Gold Book; OpenStax Chemistry 2e, Section 2.3",
            ),
        ),
    ),
    "GEN1.COMPOUNDTYPES": Lesson(
        node="GEN1.COMPOUNDTYPES",
        objective=(
            "Decide whether a compound is ionic or molecular from the elements it contains, and predict how "
            "that classification shows up in the formula and in properties like melting point and electrical "
            "conductivity."
        ),
        build_on=(
            "You learned which ions atoms form and how their charges balance, and this lesson uses that to "
            "separate compounds into two families, the ones held together by transferred electrons and the "
            "ones held together by shared electrons."
        ),
        core_idea=(
            "Compounds come in two structurally different kinds, and one glance at the elements usually tells "
            "you which. An ionic compound forms when a metal hands electrons to a nonmetal, producing positive "
            "and negative ions that pack into a repeating lattice held together by their opposite charges. "
            "Table salt is a grid of Na+ and Cl- ions, and its formula, NaCl, reports the ratio in that grid "
            "rather than the count in a molecule, which is why it is called a formula unit. A molecular "
            "compound forms when nonmetals share electrons, producing discrete molecules that are complete "
            "particles in their own right, so carbon dioxide really does exist as separate CO2 molecules and "
            "water as separate H2O molecules. The two structures show up in behavior. Ionic solids are hard, "
            "brittle, and melt only at high temperatures because pulling the lattice apart means overcoming "
            "charges attracting in every direction, and once melted or dissolved they conduct electricity "
            "because the ions are free to move. Molecular substances are often liquids or gases or soft solids, "
            "melt at much lower temperatures, and do not conduct, because their neutral molecules carry no free "
            "charge."
        ),
        worked_example=(
            "Classify three familiar substances and predict how each behaves: sodium chloride (NaCl), sucrose "
            "(table sugar, C12H22O11), and carbon dioxide (dry ice, CO2). Sodium chloride pairs a metal, "
            "sodium, with a nonmetal, chlorine, so it is ionic; expect a hard crystalline solid that melts only "
            "when strongly heated, and expect it to conduct once melted or dissolved in water because Na+ and "
            "Cl- can then move. Sucrose is built only from the nonmetals carbon, hydrogen, and oxygen, so it is "
            "molecular; expect discrete C12H22O11 molecules, a solid that melts or chars at a far lower "
            "temperature than salt, and no conduction when melted or dissolved because the molecules are "
            "neutral. Carbon dioxide is two nonmetals, carbon and oxygen, so it is also molecular, existing as "
            "separate CO2 molecules, which is why it is a gas at room temperature and its solid form sublimes "
            "rather than pouring as a liquid. The deciding move each time was the same first question, "
            "metal-plus-nonmetal or nonmetal-only, and every property prediction followed from it."
        ),
        try_it_prompt=(
            "Magnesium chloride (MgCl2) and dinitrogen tetroxide (N2O4) are both compounds. Which one is ionic "
            "and which is molecular, and which one would you expect to conduct electricity when melted?"
        ),
        try_it_answer=(
            "Magnesium chloride is ionic, because magnesium is a metal and chlorine a nonmetal, so it is a "
            "lattice of Mg2+ and Cl- ions and it conducts when melted because those ions become free to move. "
            "Dinitrogen tetroxide is molecular, because nitrogen and oxygen are both nonmetals, so it is made "
            "of neutral N2O4 molecules and does not conduct."
        ),
        pitfall=(
            "The trap is picturing a molecule of an ionic compound, a single NaCl particle drifting around. No "
            "such particle exists in a salt crystal, only an endless lattice in a one-to-one ratio, and that "
            "difference is real: melt salt and it conducts because ions move, but melt sugar, which truly is "
            "made of molecules, and it does not."
        ),
        claims=(
            Formula("[Na+].[Cl-]", "ClNa", "sodium chloride, an ionic formula unit"),
            Formula(
                "OCC1OC(CO)(OC2OC(CO)C(O)C(O)C2O)C(O)C1O",
                "C12H22O11",
                "sucrose, a molecular compound",
            ),
            Formula("O=C=O", "CO2", "carbon dioxide, a molecular compound"),
            Formula("[Mg+2].[Cl-].[Cl-]", "Cl2Mg", "magnesium chloride, an ionic formula unit"),
        ),
    ),
    "GEN1.MOLARMASS": Lesson(
        node="GEN1.MOLARMASS",
        objective=(
            "Calculate the molar mass of an element or compound from standard atomic weights, and use it to "
            "convert between grams and moles, taking care with diatomic elements and with hydrates."
        ),
        build_on=(
            "The mole gave you a count you can weigh, and molar mass is the conversion factor that does the "
            "weighing, built here carefully for compounds and for the two cases that trip people, diatomic "
            "gases and hydrates."
        ),
        core_idea=(
            "Molar mass is the mass in grams of one mole of a substance, and it is numerically equal to the "
            "average atomic or formula mass in atomic mass units, so an element whose average atomic mass is "
            "12.011 u has a molar mass of 12.011 g/mol. For a compound you add the molar masses of every atom "
            "in the formula, counting each atom as many times as it appears, so molar mass is assembled the "
            "same way a formula is read. Two cases trip people up. First, elements that exist as diatomic "
            "molecules, such as O2, N2, and the halogens, have a molar mass for the molecule that is twice the "
            "atomic value, so oxygen gas is 32.00 g/mol even though an oxygen atom is 16.00 g/mol, and which "
            "one you want depends on whether the problem is about atoms or about the gas. Second, a hydrate "
            "carries water molecules locked into its crystal, written after a dot, and that water counts fully "
            "toward the molar mass. Once you have the molar mass it works as a conversion factor in both "
            "directions: grams divided by molar mass gives moles, and moles times molar mass gives grams."
        ),
        worked_example=(
            "Find the molar mass of copper(II) sulfate pentahydrate, CuSO4 dot 5H2O, a blue crystal, and then "
            "convert 25.0 g of it to moles. Build the molar mass atom by atom from standard atomic weights: "
            "copper contributes 63.55, sulfur contributes 32.06, and the four oxygens of the sulfate "
            "contribute 4 x 16.00 = 64.00. That gives the anhydrous part, CuSO4, a mass of "
            "63.55 + 32.06 + 64.00 = 159.61 g/mol. Now the five waters, each 2 x 1.008 + 16.00 = 18.02 g/mol, "
            "add 5 x 18.02 = 90.08 g/mol, and that water is part of the crystal so it must be included. The "
            "total molar mass is 159.61 + 90.08 = 249.69 g/mol, close to 250 g/mol. To convert 25.0 g to "
            "moles, divide by the molar mass: 25.0 g / 249.69 g/mol = 0.100 mol, and the grams cancel against "
            "grams per mole to leave moles, which is the check that you divided rather than multiplied. Had you "
            "forgotten the five waters and used 159.61 g/mol, you would have reported 0.157 mol, too large by "
            "more than half, which is why the water written after the dot is not decoration."
        ),
        try_it_prompt=(
            "Calcium hydroxide is Ca(OH)2. Using calcium 40.08, oxygen 16.00, and hydrogen 1.008, what is its "
            "molar mass, and how many moles are in 3.70 g?"
        ),
        try_it_answer=(
            "The molar mass is 40.08 + 2 x (16.00 + 1.008) = 40.08 + 2 x 17.008 = 40.08 + 34.02 = 74.10 g/mol. "
            "Then 3.70 g / 74.10 g/mol = 0.0499 mol, about 0.0500 mol. The two hydroxide groups mean the oxygen "
            "and hydrogen are each counted twice, which is what the parentheses in the formula tell you to do."
        ),
        pitfall=(
            "The trap is using the atomic mass of an element when the problem is about its diatomic molecule, "
            "or the reverse. Writing the molar mass of oxygen gas as 16.00 g/mol instead of 32.00 g/mol halves "
            "every mole count that follows, so before you divide, decide whether the substance in the problem "
            "is single atoms or the O2 molecule the gas is actually made of."
        ),
        claims=(
            Source(
                "Standard atomic weights used here (for example C 12.011, H 1.008, O 16.00, S 32.06, Ca 40.08, "
                "Cu 63.55) are the IUPAC standard atomic weights",
                "IUPAC Commission on Isotopic Abundances and Atomic Weights (2021); CRC Handbook of Chemistry "
                "and Physics",
            ),
            Formula(
                "[Cu+2].[O-]S(=O)(=O)[O-].O.O.O.O.O",
                "H10CuO9S",
                "copper(II) sulfate pentahydrate, the worked-example hydrate",
            ),
            Formula("[Ca+2].[OH-].[OH-]", "H2CaO2", "calcium hydroxide, the try-it compound"),
            Formula("O=O", "O2", "dioxygen, the diatomic gas of the pitfall"),
        ),
    ),
    "GEN1.OTHERCONC": Lesson(
        node="GEN1.OTHERCONC",
        objective=(
            "Calculate mass percent and parts per million for a solution, convert between them and a mass of "
            "solute, and choose the unit that fits the concentration range."
        ),
        build_on=(
            "Molarity and dilution measured a solution by moles per litre, and this lesson adds the "
            "concentration units that count by mass instead, mass percent and parts per million, and shows when "
            "each is the natural choice."
        ),
        core_idea=(
            "Molarity is not always the convenient unit, so two mass-based units fill the gaps. Mass percent is "
            "the mass of solute divided by the total mass of solution, times 100, and it answers how many grams "
            "of solute sit in every 100 g of solution, which is why commercial acids and cleaning products are "
            "labeled this way. When a solute is present only in traces, percentages become awkward strings of "
            "zeros, so parts per million (ppm) is used instead: it is the mass of solute divided by the total "
            "mass of solution, times 10^6, or the same thing said differently, grams of solute per million "
            "grams of solution. For a dilute water solution there is a convenient shortcut, since the density "
            "of water is close to 1.00 g/mL, so 1 L of dilute solution has a mass close to 1000 g and 1 ppm "
            "works out to about 1 mg of solute per litre. The choice of unit follows the concentration: mass "
            "percent for the concentrated, such as a bottle of acid, and ppm or the even smaller parts per "
            "billion for the trace, such as a contaminant in drinking water, because each keeps the number in a "
            "range you can read at a glance."
        ),
        worked_example=(
            "A water report says a sample contains 2.0 ppm of fluoride, and you want the mass of fluoride in a "
            "1.5 L glass poured from it. Read the unit first: 2.0 ppm means 2.0 g of fluoride per 1,000,000 g "
            "of solution, or with the dilute-water shortcut, about 2.0 mg per litre, because a litre of dilute "
            "water solution weighs close to 1000 g and one part per million of 1000 g is 1 mg. Now scale to the "
            "volume in the glass: 2.0 mg/L x 1.5 L = 3.0 mg of fluoride, and the litres cancel to leave "
            "milligrams. Compare how mass percent would describe the same water: 2.0 mg in 1000 g of solution "
            "is (0.0020 g / 1000 g) x 100 = 0.00020 percent, a number so small it makes the case for ppm, since "
            "2.0 ppm is far easier to read and compare than 0.00020 percent. The two units describe the "
            "identical solution, and ppm was chosen only because the concentration is tiny."
        ),
        try_it_prompt=(
            "A bottle of hydrogen peroxide is labeled 3.0 percent by mass. How many grams of hydrogen peroxide "
            "are in 250 g of that solution, and would ppm be a sensible unit for this label?"
        ),
        try_it_answer=(
            "7.5 g, since 3.0 percent by mass means 3.0 g of hydrogen peroxide per 100 g of solution, and "
            "(3.0/100) x 250 g = 7.5 g. Parts per million would be a poor choice here, because 3.0 percent is "
            "30,000 ppm, a large and clumsy number, so mass percent is the natural unit for a concentration "
            "this high."
        ),
        pitfall=(
            "The trap is dividing the solute mass by the solvent mass instead of by the total solution mass. "
            "Mass percent and ppm are both defined against the mass of the whole solution, solute included, so "
            "5 g of salt in 95 g of water is 5 g in 100 g of solution, which is 5.0 percent, not 5 g in 95 g. "
            "For dilute solutions the difference is small, but for concentrated ones it is large enough to "
            "matter."
        ),
        claims=(
            Source(
                "The density of liquid water is close to 1.00 g/mL near room temperature",
                "CRC Handbook of Chemistry and Physics",
            ),
            Formula("OO", "H2O2", "hydrogen peroxide, the try-it solute"),
        ),
    ),
}
