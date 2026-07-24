"""CF tier lessons: Chemical Foundations."""

from __future__ import annotations

from app.data.lesson_types import Lesson

LESSONS: dict[str, Lesson] = {
    "C.CF.SAFETY": Lesson(
        node="C.CF.SAFETY",
        objective=(
            "Read a chemical label and a safety data sheet well enough to state the hazards, "
            "the required protective equipment, and the first response before you handle the container."
        ),
        build_on=(
            "You already glance at the warning panel on a bottle of household drain cleaner before you open it, "
            "and this lesson turns that habit into a system that works for any chemical."
        ),
        core_idea=(
            "Every regulated chemical container carries a label built from a small fixed vocabulary, so you can "
            "read a bottle you have never seen before. That vocabulary is nine GHS pictograms (a flame for "
            "flammables, a flame over a circle for oxidizers, a skull and crossbones for acute toxicity, a "
            "corroding hand and surface for corrosives, an exclamation mark for irritants and other lower level "
            "harm, a gas cylinder, an exploding bomb, a human silhouette for serious long term health hazards, "
            "and a dead fish and tree for environmental hazards), one signal word, and a set of numbered hazard "
            "statements. The signal word is either Danger or Warning, and Danger marks the more severe hazard "
            "category. Behind the label sits the safety data sheet, which always has the same 16 sections in the "
            "same order, so Section 2 is always hazard identification, Section 4 is always first aid, Section 7 "
            "is always handling and storage, Section 8 is always protective equipment, and Section 10 is always "
            "the list of things this chemical must not touch. The label tells you what the hazard is and the "
            "safety data sheet tells you what to do about it, which is why you read both before you touch "
            "anything."
        ),
        worked_example=(
            "A bottle on the shelf reads: concentrated hydrochloric acid, 12 M. You look at the pictograms first "
            "and see the corroding hand and surface, plus the exclamation mark. The signal word is Danger, not "
            "Warning, so you are in the more severe category. The hazard statements read H314, causes severe skin "
            "burns and eye damage, and H335, may cause respiratory irritation, which tells you the two routes "
            "that matter here are contact and vapor. You open the safety data sheet and go straight to Section 8, "
            "which calls for splash goggles, nitrile gloves, and a lab coat, and to Section 7, which says to "
            "handle it in a fume hood because of the vapor. You then read Section 4 before you start, not after, "
            "so you already know that eye contact means 15 minutes at the eyewash station with the eyelids held "
            "open. Finally you check Section 10 and find that this acid is incompatible with bases and with many "
            "metals. Only now do you know what the container in front of you demands, and you have not moved it "
            "yet."
        ),
        try_it_prompt=(
            "Two bottles carry the same flame pictogram, but one says Danger and the other says Warning. "
            "What does that difference tell you, and which safety data sheet section would you open to find out "
            "what to wear?"
        ),
        try_it_answer=(
            "Danger marks the more severe hazard category and Warning the less severe one, and Section 8 of the "
            "safety data sheet gives the protective equipment. The signal word ranks severity within a hazard "
            "class, and the 16 sections are always in the same order, so Section 8 is always the equipment "
            "section."
        ),
        pitfall=(
            "The trap is treating hazard and risk as the same thing. Ethanol carries the flame pictogram whether "
            "you have 1 mL capped in a vial or 4 L open on a bench next to a hot plate, because the pictogram "
            "describes a property of the substance, while the risk depends on how much you have, whether it is "
            "open, and what else is nearby."
        ),
        misconception=None,
    ),
    "C.CF.MATTER": Lesson(
        node="C.CF.MATTER",
        objective=(
            "Classify a sample of matter as an element, a compound, a homogeneous mixture, or a heterogeneous "
            "mixture, and justify the call."
        ),
        build_on=(
            "You already sort the contents of a kitchen without thinking about it, since you know that a bowl of "
            "salad is several things sitting together while the salt in the shaker is one thing all the way "
            "through."
        ),
        core_idea=(
            "A pure substance has a fixed composition that you cannot change without changing what it is, and it "
            "comes in two kinds. An element, such as the copper in a wire, is made of one kind of atom, while a "
            "compound, such as the sucrose in table sugar, is made of atoms of different elements locked in a "
            "fixed ratio, C12H22O11 in every crystal from every bag. A mixture is two or more substances sharing "
            "a container without a fixed ratio, so you can make seawater saltier by adding salt but you cannot "
            "make sucrose sweeter by adding carbon. Mixtures are homogeneous when the composition is the same "
            "everywhere you sample, like sugar dissolved in tea, and heterogeneous when it is not, like oil and "
            "vinegar dressing. The clean test between compound and mixture is what it takes to separate the "
            "parts: a mixture yields to physical means such as filtering, evaporating, or distilling, while a "
            "compound only comes apart in a chemical reaction."
        ),
        worked_example=(
            "Classify four things sitting on a table: a copper wire, a spoonful of table sugar, a glass of "
            "sweetened iced tea, and a shaken bottle of Italian dressing. The copper wire is one kind of atom, "
            "so it is an element. The table sugar is sucrose, C12H22O11, with the same ratio of carbon, hydrogen, "
            "and oxygen in every crystal, so it is a compound and therefore a pure substance even though it "
            "contains three elements. The iced tea looks uniform in every sip and you can vary how sweet you make "
            "it, so it is a mixture, and because a sample from the top matches a sample from the bottom it is "
            "homogeneous. The dressing separates into visible layers within a minute, so a sample from the top is "
            "not the same as one from the bottom, which makes it a heterogeneous mixture. Notice the deciding "
            "move each time was not what the sample looks like but whether the composition is fixed and how you "
            "would take it apart: boiling the tea leaves sugar behind, while nothing you do with a hot plate "
            "splits sucrose into carbon, hydrogen, and oxygen."
        ),
        try_it_prompt=(
            "Air is invisible and uniform. Is it a compound or a mixture, and what evidence decides it?"
        ),
        try_it_answer=(
            "It is a homogeneous mixture. Its composition varies (roughly 78 percent nitrogen, 21 percent oxygen, "
            "about 1 percent argon, and a changeable amount of water vapor) rather than being fixed, and its "
            "components can be pulled apart by a physical process, the fractional distillation of liquid air."
        ),
        pitfall=(
            "The trap is believing that homogeneous means pure. Saltwater is perfectly uniform to the eye and to "
            "every sample you draw from it, yet boiling the water away leaves the salt behind, which is a physical "
            "separation and so proves it was a mixture all along."
        ),
        misconception=None,
    ),
    "C.CF.PROPERTIES": Lesson(
        node="C.CF.PROPERTIES",
        objective=(
            "Decide whether an observed change is physical or chemical by asking whether the substances present "
            "afterward are different from the ones present before."
        ),
        build_on=(
            "You just learned that a compound has a fixed identity, and that identity is exactly what a chemical "
            "change destroys and a physical change leaves alone."
        ),
        core_idea=(
            "A physical property is something you can measure without changing what the substance is, such as "
            "color, density, melting point, boiling point, or how well it conducts electricity. A chemical "
            "property describes what the substance turns into under some condition, such as iron rusting in damp "
            "air or methane burning in oxygen, and you can only observe it by letting the change happen. So a "
            "physical change rearranges the same substance, as when ice melts and the H2O molecules simply stop "
            "holding a rigid lattice, while a chemical change ends with different substances than it started "
            "with. Bubbles, a color change, heat, or a new solid appearing are hints of a chemical change but "
            "none of them settles it on its own, because boiling water bubbles and dissolved dye colors water "
            "without any new substance forming. The question that settles it is always the same: do the things "
            "in the container after the change have different properties from the things that went in?"
        ),
        worked_example=(
            "Leave a clean iron nail outside for a month and decide what happened. Before: a gray, malleable, "
            "electrically conducting solid with a density of 7.87 g per cm3. After: the surface is covered in a "
            "red-brown flaky solid that crumbles under a fingernail and does not conduct the way the metal does. "
            "Those are different physical properties, which points at different substances, and indeed the coating "
            "is hydrated iron(III) oxide rather than iron. The decisive measurement is the mass, because the "
            "rusted nail weighs more than the original iron did, and the extra mass is oxygen from the air now "
            "bound into the solid. Nothing you can do with a freezer or a hot plate will return the coating to "
            "iron, since undoing it requires another chemical reaction. Compare that with the water droplets that "
            "condensed on the nail overnight and evaporated by noon, which is a physical change because the H2O "
            "was H2O the whole time and you could collect the vapor and get the same water back."
        ),
        try_it_prompt=(
            "A puddle on the sidewalk disappears on a hot afternoon. Physical change or chemical change, and how "
            "would you check?"
        ),
        try_it_answer=(
            "Physical. The water molecules went from liquid to gas but stayed H2O, and the check is that cooling "
            "the vapor on a cold surface condenses it back into ordinary water with the same boiling point and "
            "density."
        ),
        pitfall=(
            "The trap is treating any color change as proof of a chemical change. Drop a purple crystal of "
            "potassium permanganate into water and the whole beaker turns purple, but let the water evaporate and "
            "the KMnO4 crystals come back unchanged, so that color change was dissolving, not reacting."
        ),
        misconception=None,
    ),
    "C.CF.MEASURE": Lesson(
        node="C.CF.MEASURE",
        objective=(
            "Report a measured or calculated quantity with the number of significant figures the measurement "
            "actually supports."
        ),
        build_on=(
            "You already know that a bathroom scale reading 150 lb and a doctor's scale reading 150.4 lb are not "
            "making the same claim, and significant figures are how chemistry writes that difference down."
        ),
        core_idea=(
            "Every measurement carries its own precision, set by the instrument, and the digits you write are a "
            "promise about how far that precision goes. A kitchen scale that reads 2.5 g promises two digits, "
            "while an analytical balance that reads 2.4983 g promises five. The counting rules follow from that "
            "promise: all nonzero digits count, zeros between counted digits count, leading zeros never count "
            "because they only place the decimal point, and trailing zeros count only when a decimal point is "
            "written. Arithmetic cannot manufacture precision, so multiplication and division keep the fewest "
            "significant figures of any input, while addition and subtraction keep the fewest decimal places. "
            "Exact numbers, such as the 1000 in 1000 mL per L or the 2 in a count of two flasks, are definitions "
            "or counts and never limit anything."
        ),
        worked_example=(
            "You deliver 25.00 mL of water from a pipet into a graduated cylinder that already holds 3.1 mL, then "
            "you find the total mass of that water to be 33.15 g and you want its density. First the volume: "
            "25.00 + 3.1 = 28.10, but this is addition, so the answer keeps the fewest decimal places, and 3.1 "
            "has only one, giving 28.1 mL. Notice you lost two digits of the pipet's precision, and rightly so, "
            "because the cylinder never knew them. Now the density: 33.15 g divided by 28.1 mL. This is division, "
            "so the answer keeps the fewest significant figures of the inputs, and 28.1 has three while 33.15 has "
            "four, so the answer gets three. The calculator shows 1.179715302, and you round at the end to 1.18 g "
            "per mL. Rounding the volume early, or reporting all ten calculator digits, would both be claims the "
            "glassware never made."
        ),
        try_it_prompt=(
            "How many significant figures are in 0.00470 kg, and which rule decides the fate of each zero?"
        ),
        try_it_answer=(
            "Three: the 4, the 7, and the final 0. The three leading zeros only place the decimal point so they "
            "do not count, while the trailing zero counts because a decimal point is written, which is the writer "
            "saying the instrument resolved that place."
        ),
        pitfall=(
            "The trap is believing that the calculator answer is the answer. Dividing 33.15 g by 28.1 mL displays "
            "1.179715302 g per mL, and writing that down claims ten digits of precision from a cylinder that "
            "resolved three, so the correct report is 1.18 g per mL."
        ),
        misconception="SIGFIG",
    ),
    "C.CF.DIMANAL": Lesson(
        node="C.CF.DIMANAL",
        objective=(
            "Convert a quantity from one unit to another by multiplying by conversion factors and cancelling the "
            "units algebraically."
        ),
        build_on=(
            "You now know how many digits a measurement is entitled to, and dimensional analysis is how you move "
            "that measurement into a different unit without inventing or losing any of them."
        ),
        core_idea=(
            "A conversion factor is a fraction whose top and bottom are the same physical amount written two "
            "ways, so it equals 1 and multiplying by it changes the label without changing the quantity. Since "
            "1 hour and 3600 seconds are the same duration, both 3600 s per 1 h and 1 h per 3600 s are legal, and "
            "the only question is which one cancels the unit you are trying to get rid of. Treat units as "
            "algebraic symbols that cancel top against bottom, exactly like variables, and write them at every "
            "step. That is the whole method, and its real value is that it checks itself: if the surviving units "
            "are not the units you wanted, you picked a factor upside down, and you know it before you look at "
            "the number. Chain as many factors as you need in one line rather than rounding between them."
        ),
        worked_example=(
            "Convert a highway speed of 55 miles per hour into meters per second. You need two facts: 1 mile is "
            "defined as exactly 1609.344 m, and 1 hour is exactly 3600 s. Set it up so that miles cancel and "
            "hours cancel: (55 mi / 1 h) times (1609.344 m / 1 mi) times (1 h / 3600 s). Check the units before "
            "the arithmetic, since mi cancels against mi and h cancels against h, leaving m per s, which is what "
            "you wanted. Now the number: 55 times 1609.344 equals 88513.92, and dividing by 3600 gives 24.587 "
            "meters per second. The measured value 55 mi per h has two significant figures while both conversion "
            "factors are exact definitions and do not limit anything, so the answer is 25 m per s. Had you "
            "written the second factor as 1 mi per 1609.344 m instead, the surviving units would have been "
            "mi2 per (m times h), a unit that means nothing, and that nonsense is the method telling you to flip "
            "the factor."
        ),
        try_it_prompt=(
            "Convert 3.0 hours into seconds using conversion factors, and say how many significant figures the "
            "answer is allowed."
        ),
        try_it_answer=(
            "3.0 h times (60 min / 1 h) times (60 s / 1 min) = 10800 s, which is reported as 1.1 x 10^4 s. Both "
            "factors are exact definitions, so the two significant figures in the measured 3.0 h set the limit, "
            "and scientific notation is the only honest way to show that only two digits are claimed."
        ),
        pitfall=(
            "The trap is reaching for the number and inverting the factor, usually by multiplying whenever the "
            "target unit is smaller. Converting 500 mg to grams by multiplying by 1000 mg per g gives 500000 with "
            "units of mg2 per g, and that impossible unit is the signal that the factor belonged the other way "
            "up, giving 0.500 g."
        ),
        misconception=None,
    ),
    "C.CF.DENSITY": Lesson(
        node="C.CF.DENSITY",
        objective=(
            "Calculate density from a measured mass and volume, and use a density as a conversion factor between "
            "mass and volume."
        ),
        build_on=(
            "You can now carry units through a calculation, and density is the first quantity that pays you back "
            "for it, because it is a ratio of two units and only cancels correctly if you track them."
        ),
        core_idea=(
            "Density is mass divided by volume, and it answers how much matter is packed into a given space "
            "rather than how much matter there is. Liquid water is close to 1.00 g per mL, aluminum is 2.70 g per "
            "cm3, iron is 7.87 g per cm3, and lead is 11.3 g per cm3, which is why a lead fishing weight the size "
            "of a marble feels wrong in your hand. Density is an intensive property, so it does not depend on how "
            "much you have, and a shaving from an aluminum block has exactly the same density as the block. That "
            "makes it useful for identification, since the ratio is a fingerprint of the substance while mass "
            "alone is a fact about your particular sample. It also works as a conversion factor in both "
            "directions, turning a measured volume into a mass or a needed mass into a volume to pour."
        ),
        worked_example=(
            "You are handed an irregular metal chunk and asked to identify it. On the balance its mass is 87.4 g. "
            "You cannot measure the volume with a ruler, so you use displacement: a graduated cylinder holds "
            "25.0 mL of water, and after the chunk is lowered in, the level reads 57.4 mL, so the metal occupies "
            "57.4 minus 25.0 equals 32.4 mL. Density is 87.4 g divided by 32.4 mL, which the calculator gives as "
            "2.697530864, and both inputs have three significant figures, so you report 2.70 g per mL. Since "
            "1 mL and 1 cm3 are the same volume, that is 2.70 g per cm3, which matches aluminum and rules out "
            "iron at 7.87. Now run the ratio the other way: if you needed 50.0 g of this metal, the volume would "
            "be 50.0 g times (1 cm3 / 2.70 g) equals 18.5 cm3, and notice that grams cancel only because you "
            "wrote the factor with grams on the bottom."
        ),
        try_it_prompt=(
            "A solid aluminum block is cut exactly in half. What is the density of each half, and why?"
        ),
        try_it_answer=(
            "Still 2.70 g per cm3. Cutting halves the mass and halves the volume, and their ratio is unchanged, "
            "which is what it means to call density an intensive property."
        ),
        pitfall=(
            "The trap is hearing dense and thinking heavy. A 1 kg block of aluminum outweighs a 1 g steel screw "
            "many times over, yet steel is nearly three times as dense, because density is a ratio and a mass by "
            "itself tells you nothing about it."
        ),
        misconception=None,
    ),
    "C.CF.ATOMICTHEORY": Lesson(
        node="C.CF.ATOMICTHEORY",
        objective=(
            "State the number of protons, neutrons, and electrons in an atom or ion from its symbol, and say what "
            "each particle determines."
        ),
        build_on=(
            "You classified matter into elements and compounds by behavior, and now you get the reason those "
            "categories exist, which is that each element is a distinct kind of atom."
        ),
        core_idea=(
            "An atom is a very small, very dense nucleus of protons and neutrons surrounded by a much larger "
            "region occupied by electrons. The size gap is the part worth holding on to: if you scaled a nucleus "
            "up to a marble 1 cm across, the whole atom would be roughly 100 m across, so almost all of the "
            "volume of the chair you are sitting in is electron territory. Each particle owns a different job. "
            "The proton count, called the atomic number Z, is what names the element and never changes in "
            "chemistry, the neutron count changes the mass without changing the element, and the electron count "
            "sets the charge and does all of the chemistry, since bonding is electrons rearranging. Protons and "
            "neutrons each weigh about 1 atomic mass unit while an electron weighs about 1/1836 as much as a "
            "proton, which is why the nucleus holds nearly all the mass and the electrons hold nearly all the "
            "volume."
        ),
        worked_example=(
            "A particle has 26 protons, 30 neutrons, and 24 electrons, and you want to name it. Start with the "
            "protons, because the proton count is the element's identity: Z equals 26 is iron, and no other fact "
            "can change that. The mass number is protons plus neutrons, 26 plus 30 equals 56, so this is iron-56, "
            "written 56-Fe. Now the charge, which is the proton count minus the electron count: 26 minus 24 "
            "equals plus 2, so this particle is short two electrons and carries a 2+ charge. Putting it together, "
            "it is an Fe2+ ion of iron-56, the same ion that sits at the center of the heme group carrying oxygen "
            "in your blood. Note the order of the reasoning, since the protons named it, the neutrons weighed it, "
            "and the electrons charged it, and each question had exactly one place to look."
        ),
        try_it_prompt=(
            "A particle has 17 protons, 18 neutrons, and 18 electrons. What element is it, what is its mass "
            "number, and what is its charge?"
        ),
        try_it_answer=(
            "Chlorine, mass number 35, charge 1-, so it is a chloride ion, Cl-. Z equals 17 names it as chlorine, "
            "17 plus 18 equals 35 for the mass number, and 17 protons against 18 electrons leaves one extra "
            "negative charge."
        ),
        pitfall=(
            "The trap is letting the electron count identify the element, which feels natural because electrons "
            "do the chemistry. A sodium ion Na+ and a neon atom both have exactly 10 electrons, yet one is a "
            "reactive metal ion and the other is an inert gas, because Na+ has 11 protons and Ne has 10, and only "
            "the proton count names an element."
        ),
        misconception=None,
    ),
    "C.CF.ISOTOPES": Lesson(
        node="C.CF.ISOTOPES",
        objective=(
            "Calculate an element's average atomic mass from its isotope masses and natural abundances, and "
            "explain why that value is almost never a whole number."
        ),
        build_on=(
            "You know that changing the neutron count changes an atom's mass but not which element it is, and "
            "isotopes are exactly that situation given a name."
        ),
        core_idea=(
            "Isotopes are atoms of the same element with different neutron counts, so they have the same chemistry "
            "and different masses. Natural chlorine is not one thing but a fixed blend, about 75.76 percent "
            "chlorine-35 and 24.24 percent chlorine-37, and that blend is remarkably consistent in samples from "
            "anywhere on Earth. The mass printed on the periodic table is the weighted average over that blend, "
            "weighted by how common each isotope is rather than by a plain average of the isotope masses. Think "
            "of a jar holding three quarters nickels and one quarter dimes, where the average coin mass is not "
            "the mass of any coin in the jar and lands closer to the nickel because nickels dominate. That "
            "weighting is why periodic table masses are ragged decimals, and why carbon reads 12.011 rather than "
            "exactly 12."
        ),
        worked_example=(
            "Compute the average atomic mass of chlorine from its two natural isotopes. Chlorine-35 has a mass of "
            "34.969 u and an abundance of 75.76 percent, and chlorine-37 has a mass of 36.966 u and an abundance "
            "of 24.24 percent. Convert percentages to fractions first, giving 0.7576 and 0.2424, which must sum "
            "to 1 and do. Multiply each isotope mass by its fraction: 34.969 times 0.7576 equals 26.493, and "
            "36.966 times 0.2424 equals 8.961. Add the contributions: 26.493 plus 8.961 equals 35.454, which "
            "rounds to 35.45 u, exactly the value on the periodic table. Sanity check the answer against the "
            "weighting, because the result sits much nearer 35 than 37, which is what you should expect when "
            "three quarters of the atoms are the lighter isotope. If your answer had come out near 36, the "
            "midpoint, you would have taken a plain average and thrown the abundances away."
        ),
        try_it_prompt=(
            "Bromine's periodic table mass is 79.90 u, almost exactly halfway between its isotopes bromine-79 and "
            "bromine-81. What does that tell you about their natural abundances?"
        ),
        try_it_answer=(
            "That the two isotopes are present in nearly equal amounts, about 50.7 percent bromine-79 and 49.3 "
            "percent bromine-81. A weighted average only lands at the midpoint when the weights are nearly equal, "
            "and it would sit near one end if one isotope dominated."
        ),
        pitfall=(
            "The trap is reading the average atomic mass as the mass of an actual atom. No chlorine atom anywhere "
            "weighs 35.45 u, since every single one is either about 35 u or about 37 u, and 35.45 is a property "
            "of the natural mixture rather than of any atom in it."
        ),
        misconception=None,
    ),
    "C.CF.PERIODICTABLE": Lesson(
        node="C.CF.PERIODICTABLE",
        objective=(
            "Use an element's position on the periodic table to predict whether it is a metal or a nonmetal and "
            "how it will behave relative to its neighbors."
        ),
        build_on=(
            "You know that electrons do the chemistry, and the periodic table is arranged so that position "
            "encodes the electron arrangement, which is why position predicts behavior at all."
        ),
        core_idea=(
            "The table is a grid with two directions that mean different things. A column is a group and its "
            "members share the number of outer electrons, so they behave alike, which is why lithium, sodium, and "
            "potassium in group 1 are all soft metals that react vigorously with water. A row is a period, and "
            "crossing a row takes you from metals on the left to nonmetals on the upper right, changing behavior "
            "completely from one neighbor to the next. Metals are shiny, malleable conductors that tend to lose "
            "electrons, nonmetals are mostly dull, brittle or gaseous insulators that tend to gain them, and a "
            "staircase of metalloids including boron, silicon, germanium, and arsenic sits between the two. A few "
            "groups are worth memorizing by name: group 1 alkali metals, group 2 alkaline earth metals, group 17 "
            "halogens, group 18 noble gases, and the transition metals in the middle block."
        ),
        worked_example=(
            "Predict how strontium behaves without looking up a single fact about strontium itself. Find it on "
            "the table: Sr, atomic number 38, in group 2 and period 5. Group 2 means two outer electrons, so "
            "strontium is a metal that gives up both and forms Sr2+, the same charge as its groupmates beryllium, "
            "magnesium, calcium, and barium. Being in group 2 also fixes the formulas of its compounds, so its "
            "oxide is SrO and its chloride is SrCl2, matching CaO and CaCl2 one row up. Period 5 tells you the "
            "outer electrons sit farther from the nucleus than calcium's do, so strontium holds them more loosely "
            "and reacts with water more vigorously than calcium, following the trend you already see going down "
            "group 1. The chemical similarity is close enough to matter in the real world, since the body handles "
            "Sr2+ much like Ca2+ and deposits it in bone, which is why radioactive strontium-90 from fallout is "
            "tracked as a bone-seeking contaminant."
        ),
        try_it_prompt=(
            "Selenium sits directly below sulfur in group 16. What formula would you predict for the compound "
            "selenium forms with hydrogen, and why?"
        ),
        try_it_answer=(
            "H2Se. Members of a group share the number of outer electrons and therefore the same combining "
            "pattern, and sulfur forms H2S while oxygen at the top of the group forms H2O, so selenium takes two "
            "hydrogens as well."
        ),
        pitfall=(
            "The trap is expecting neighbors in a row to resemble each other the way neighbors in a column do. "
            "Sodium and chlorine sit in the same period, yet sodium is a soft metal that reacts violently with "
            "water and chlorine is a pale green toxic gas, so it is the column and not the row that predicts "
            "chemical behavior."
        ),
        misconception=None,
    ),
    "C.CF.IONS": Lesson(
        node="C.CF.IONS",
        objective=(
            "Predict the charge of the ion a main group element forms from its position, and state the limits of "
            "the octet pattern as an explanation."
        ),
        build_on=(
            "You just used a column to predict how an element combines, and ionic charge is the sharpest version "
            "of that prediction, since for main group elements the group number essentially sets the charge."
        ),
        core_idea=(
            "An ion is an atom or group of atoms with unequal proton and electron counts, so it carries a net "
            "charge, and it is what table salt is made of, since NaCl is a lattice of Na+ and Cl- rather than of "
            "NaCl molecules. Metals on the left lose electrons and become positive cations, so group 1 gives 1+, "
            "group 2 gives 2+, and aluminum in group 13 gives Al3+, while nonmetals on the right gain electrons "
            "and become negative anions, so group 17 gives 1-, group 16 gives 2-, and group 15 gives 3-. In each "
            "case the resulting ion has the same electron count as the nearest noble gas, which is the pattern "
            "usually called the octet rule. Read that as a summary of what commonly happens, not as a cause, "
            "because atoms have no preferences, and the real reason these ions form is that the total energy of "
            "the resulting compound is lower than the energy of the separate atoms. Transition metals do not "
            "follow a single rule and often form more than one ion, such as Fe2+ and Fe3+, which is why their "
            "charges have to be specified rather than predicted."
        ),
        worked_example=(
            "Predict what magnesium and nitrogen make together. Magnesium is in group 2, so it loses two "
            "electrons to give Mg2+, and nitrogen is in group 15, so it gains three to give N3-. Any compound "
            "must be electrically neutral overall, so you need positive charge and negative charge to cancel "
            "exactly. Two nitride ions carry a total of 6-, and three magnesium ions carry a total of 6+, so the "
            "smallest whole number combination that balances is three Mg2+ for every two N3-. That gives the "
            "formula Mg3N2, magnesium nitride, and it is not a paper exercise, since burning magnesium ribbon in "
            "air produces some Mg3N2 alongside the expected MgO because magnesium reacts with the nitrogen in the "
            "air as well as the oxygen. The reasoning ran from position to charge to charge balance to formula, "
            "and the only chemistry input was where the two elements sit."
        ),
        try_it_prompt=(
            "What ion does aluminum form, and what in its position tells you so?"
        ),
        try_it_answer=(
            "Al3+. Aluminum is in group 13, so it has three outer electrons to lose, and losing all three leaves "
            "it with the same electron count as neon, which is the pattern main group metals follow."
        ),
        pitfall=(
            "The trap is the phrase that atoms want an octet, which turns a bookkeeping pattern into a motive. "
            "Sulfur hexafluoride, SF6, is a stable gas used as an electrical insulator with twelve electrons "
            "around the sulfur, and boron trifluoride, BF3, is a stable compound with only six around the boron, "
            "so the octet describes the common case rather than driving it."
        ),
        misconception="OCTET-EXPLAINS",
    ),
    "C.CF.NOMENCLATURE": Lesson(
        node="C.CF.NOMENCLATURE",
        objective=(
            "Convert between the name and the formula of a binary ionic compound, a compound containing a common "
            "polyatomic ion, and a binary molecular compound."
        ),
        build_on=(
            "You can predict ionic charges from position, and naming is where that skill pays off, because the "
            "charges are exactly what a name has to communicate without stating them."
        ),
        core_idea=(
            "A chemical name and a chemical formula are supposed to carry the same information, so the rules "
            "exist to make the translation reversible. The first decision is what kind of compound you have, "
            "since a metal with a nonmetal is ionic and gets no prefixes, while two nonmetals are molecular and "
            "get Greek prefixes. For an ionic compound you name the cation, then the anion with the ending "
            "changed to -ide, giving sodium chloride for NaCl, and you add a Roman numeral for the metal's charge "
            "whenever the metal can form more than one ion, so FeCl2 is iron(II) chloride and FeCl3 is iron(III) "
            "chloride. Polyatomic ions keep their own names, so you need a short memorized set including nitrate "
            "NO3-, sulfate SO4 2-, carbonate CO3 2-, phosphate PO4 3-, hydroxide OH-, and ammonium NH4+, along "
            "with the pattern that -ite means one fewer oxygen than -ate, as in sulfite SO3 2-. For molecular "
            "compounds the prefixes mono, di, tri, tetra, penta, and hexa state the atom counts directly, mono is "
            "dropped on the first element, and that is why CO is carbon monoxide while CO2 is carbon dioxide."
        ),
        worked_example=(
            "Name Fe2O3, then write the formula for dinitrogen pentoxide, and watch the two systems stay "
            "separate. Fe2O3 pairs a metal with a nonmetal, so it is ionic and takes no prefixes. Oxygen is in "
            "group 16 and forms O2-, so three oxide ions carry a total of 6-, and since the compound is neutral "
            "the two iron atoms must supply 6+ between them, which is 3+ each. Iron forms more than one ion, so "
            "the charge must appear in the name, giving iron(III) oxide, which is the main component of rust. Now "
            "go the other direction with dinitrogen pentoxide: both elements are nonmetals, the prefixes are "
            "doing the counting rather than any charge balance, di means two nitrogens and penta means five "
            "oxygens, so the formula is N2O5. Note that you never computed a charge for the molecular compound "
            "and never used a prefix for the ionic one, because each system answers the counting question a "
            "different way."
        ),
        try_it_prompt=(
            "Name N2O4 and CaCl2, and say why only one of them uses prefixes."
        ),
        try_it_answer=(
            "N2O4 is dinitrogen tetroxide and CaCl2 is calcium chloride. N2O4 is two nonmetals, so prefixes are "
            "needed to state the counts, while CaCl2 is ionic and the fixed charges Ca2+ and Cl- already force "
            "the ratio of one to two, so stating it again would be redundant."
        ),
        pitfall=(
            "The trap is carrying prefixes into ionic names. CaCl2 is calcium chloride and never calcium "
            "dichloride, because Ca2+ and Cl- can only combine in a one to two ratio, so the name does not need "
            "to say what the charges already guarantee."
        ),
        misconception=None,
    ),
    "C.CF.ENERGYBASICS": Lesson(
        node="C.CF.ENERGYBASICS",
        objective=(
            "Distinguish temperature, thermal energy, and heat, and calculate the heat needed to change a "
            "sample's temperature using q equals m c dT."
        ),
        build_on=(
            "You can tell a physical change from a chemical one, and both kinds of change are driven by energy "
            "moving, so the next step is to say precisely what is moving and what is merely being measured."
        ),
        core_idea=(
            "Temperature is a measure of the average kinetic energy of the particles in a sample, so it does not "
            "depend on how much you have, while thermal energy is the total kinetic energy of all the particles "
            "and therefore does. Heat is neither of those, because heat is energy in transit from a hotter object "
            "to a cooler one, which means an object never contains heat any more than a bank account contains "
            "deposits. The everyday case that separates them is a sparkler, whose sparks are above 1000 degrees C "
            "and land on your skin harmlessly, while a bathtub at 60 degrees C would scald you badly, since each "
            "spark is tiny and carries almost no thermal energy to transfer. How much energy a given temperature "
            "change costs depends on the substance through its specific heat, which for liquid water is 4.184 J "
            "per gram per degree C, unusually high and the reason coastal climates are mild. The working equation "
            "is q equals m times c times dT, where q is the heat transferred in joules, m is the mass in grams, "
            "c is the specific heat, and dT is the temperature change."
        ),
        worked_example=(
            "Find the heat required to bring 250. g of water from 22.0 degrees C to 100.0 degrees C. Identify "
            "the three inputs first: m is 250. g, c for liquid water is 4.184 J per gram per degree C, and dT is "
            "the final minus the initial temperature, 100.0 minus 22.0 equals 78.0 degrees C. Check the units "
            "before multiplying, because grams cancel against the grams in c and degrees C cancel against the "
            "degrees in c, leaving joules, which is what heat should come out in. Now the arithmetic: 250. times "
            "4.184 equals 1046, and 1046 times 78.0 equals 81588 J. Every input has three significant figures, so "
            "the answer is 8.16 x 10^4 J, or 81.6 kJ. Sanity check the sign and size, since dT is positive the "
            "water absorbed energy, and 81.6 kJ is large next to the 17.5 kJ it would take to warm the same "
            "250. g of aluminum, specific heat 0.897 J per gram per degree C, through the same 78.0 degrees, "
            "which is the high specific heat of water showing up as a number."
        ),
        try_it_prompt=(
            "Two open beakers of water both sit at 50 degrees C, one holding 100 g and the other 400 g. Which "
            "contains more thermal energy, and which is at a higher temperature?"
        ),
        try_it_answer=(
            "The 400 g beaker has about four times the thermal energy, and neither is at a higher temperature "
            "since both read 50 degrees C. Temperature reports the average kinetic energy per particle, which is "
            "the same in both, while thermal energy adds up over all the particles and there are four times as "
            "many."
        ),
        pitfall=(
            "The trap is treating temperature as a measure of how much heat something holds. A spark from a "
            "sparkler at over 1000 degrees C lands on your hand and does nothing, while 60 degree C bathwater "
            "causes serious burns in seconds, so the higher temperature is plainly not the larger amount of "
            "energy available to transfer."
        ),
        misconception=None,
    ),
}
