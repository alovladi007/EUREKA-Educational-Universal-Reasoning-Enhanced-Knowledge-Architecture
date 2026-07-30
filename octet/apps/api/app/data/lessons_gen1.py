"""GEN1 lessons: General Chemistry I.

41 lessons, one per authored GEN1 node in app/data/curriculum.py, in
curriculum order. Every lesson carries the full six part arc from the teaching
model, and the compliance checker rejects any lesson with an empty part.

These were authored against the retired CF / G1 / G2 node codes and re-keyed
onto the course based map through app/data/node_migration.py. The prose is
unchanged; only the node each lesson claims moved. GEN1 has 91 nodes, so most
of the course is still unauthored, and the gap is real rather than hidden.
"""

from __future__ import annotations

from app.data.claims import Formula, Source
from app.data.lesson_types import Lesson

# Citations for facts the compliance checker cannot re-derive from a structure:
# measured constants, tabulated properties and definitional conventions. Each
# records who is accountable for the number; the citation-debt report tracks
# them. Where a specific molecule is discussed it also carries a Formula claim,
# re-derived by RDKit, so the atom count at least is under test.
OPENSTAX = "OpenStax, Chemistry 2e, Rice University 2019"
CRC = "CRC Handbook of Chemistry and Physics, 97th edition, CRC Press 2016"
GOLDBOOK = "IUPAC Compendium of Chemical Terminology (the Gold Book), 2nd edition"
CODATA = "CODATA internationally recommended values of the fundamental physical constants, NIST"

LESSONS: dict[str, Lesson] = {
    "GEN1.SAFETY": Lesson(
        node="GEN1.SAFETY",
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
        claims=(
            Source(
                "GHS defines nine hazard pictograms, the two signal words "
                "Danger and Warning, and a safety data sheet of sixteen "
                "sections in a fixed order (Section 2 hazards, 4 first aid, 7 "
                "handling and storage, 8 exposure controls, 10 stability and "
                "reactivity).",
                "OSHA Hazard Communication Standard, 29 CFR 1910.1200, aligned "
                "with the UN Globally Harmonized System of Classification and "
                "Labelling of Chemicals (GHS), 8th revised edition",
            ),
        ),
    ),
    "GEN1.MATTER": Lesson(
        node="GEN1.MATTER",
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
        claims=(
            Formula("OCC1OC(CO)(OC2OC(CO)C(O)C(O)C2O)C(O)C1O", "C12H22O11", "sucrose"),
            Source(
                "Dry air is approximately 78 percent nitrogen, 21 percent "
                "oxygen and about 1 percent argon by volume, with a variable "
                "amount of water vapour.",
                CRC + ", section on the composition of the Earth's atmosphere",
            ),
        ),
    ),
    "GEN1.PROPERTIES": Lesson(
        node="GEN1.PROPERTIES",
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
        claims=(
            Formula("O", "H2O", "water, unchanged through a physical change"),
            Source(
                "The density of iron at room temperature is about 7.87 grams "
                "per cubic centimetre.",
                CRC + ", table of the physical constants of the elements",
            ),
        ),
    ),
    "GEN1.SIGFIGS": Lesson(
        node="GEN1.SIGFIGS",
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
        claims=(
            Source(
                "The significant-figure conventions used here, that "
                "multiplication and division keep the fewest significant "
                "figures and that addition and subtraction keep the fewest "
                "decimal places, are the standard rules for propagating "
                "measurement precision.",
                OPENSTAX + ", Ch. 1.5 Measurement Uncertainty, Accuracy, and Precision",
            ),
        ),
    ),
    "GEN1.DIMANAL": Lesson(
        node="GEN1.DIMANAL",
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
        claims=(
            Source(
                "One mile is defined as exactly 1609.344 metres and one hour as "
                "exactly 3600 seconds; both are exact unit definitions, not "
                "measurements.",
                "NIST Special Publication 811, Guide for the Use of the "
                "International System of Units (SI)",
            ),
        ),
    ),
    "GEN1.DENSITY": Lesson(
        node="GEN1.DENSITY",
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
        claims=(
            Source(
                "Approximate densities at room temperature: liquid water about "
                "1.00, aluminium about 2.70, iron about 7.87 and lead about "
                "11.3 grams per cubic centimetre.",
                CRC + ", tables of density of the elements and of water",
            ),
        ),
    ),
    "GEN1.ATOMICTHEORY": Lesson(
        node="GEN1.ATOMICTHEORY",
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
        claims=(
            Source(
                "A proton and a neutron each have a mass of about one atomic "
                "mass unit, while an electron is about 1/1836 the mass of a "
                "proton, so the nucleus carries almost all of an atom's mass.",
                CODATA,
            ),
        ),
    ),
    "GEN1.ISOTOPES": Lesson(
        node="GEN1.ISOTOPES",
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
        claims=(
            Source(
                "Chlorine-35 has mass 34.969 u and abundance about 75.76 "
                "percent, chlorine-37 has mass 36.966 u and abundance about "
                "24.24 percent, giving a standard atomic weight near 35.45; "
                "carbon's is 12.011 and bromine's about 79.90.",
                CRC + ", table of the isotopic composition and relative atomic "
                "masses of the elements",
            ),
        ),
    ),
    "GEN1.PERIODICTABLE": Lesson(
        node="GEN1.PERIODICTABLE",
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
        claims=(
            Source(
                "Elements in the same group share the number of outer electrons "
                "and therefore similar chemistry and combining ratios, while a "
                "period runs from metals on the left to nonmetals on the upper "
                "right; this organisation is the periodic law.",
                OPENSTAX + ", Ch. 6.4 Electronic Structure of Atoms and Ch. 6.5 Periodic Variations in Element Properties",
            ),
        ),
    ),
    "GEN1.IONS": Lesson(
        node="GEN1.IONS",
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
        claims=(
            Formula("FB(F)F", "BF3", "boron trifluoride, stable with six electrons on boron"),
            Source(
                "Main-group elements commonly form ions with a noble-gas "
                "electron count (the octet rule), but this summarises common "
                "behaviour rather than a law: SF6 and BF3 are stable "
                "exceptions.",
                GOLDBOOK + ", entry for octet rule",
            ),
        ),
    ),
    "GEN1.NOMENIONIC": Lesson(
        node="GEN1.NOMENIONIC",
        objective=(
            "Write the correct formula for an ionic compound, including ones "
            "with polyatomic ions, by balancing total positive and negative "
            "charge."
        ),
        build_on=(
            "You know which ions common elements form, and this lesson uses "
            "those charges to build whole compounds that carry no net charge."
        ),
        core_idea=(
            "The salt on your table is not made of NaCl molecules. It is a "
            "crystal, a repeating three dimensional grid in which every sodium "
            "ion is surrounded by six chloride ions and every chloride is "
            "surrounded by six sodiums. The formula NaCl reports the ratio in "
            "that grid, one to one, and chemists call it a formula unit rather "
            "than a molecule for exactly that reason. Some ions are groups of "
            "atoms bonded together that carry a charge as a unit and travel "
            "intact through reactions, such as sulfate (SO4 with a 2- charge), "
            "nitrate (NO3 with a 1- charge) and ammonium (NH4 with a 1+ "
            "charge). Building a formula is then one requirement: total "
            "positive charge must cancel total negative charge exactly."
        ),
        worked_example=(
            "Write the formula for aluminium sulfate. Aluminium forms Al with "
            "a 3+ charge and sulfate is SO4 with a 2- charge. You need whole "
            "numbers of each that cancel, so find the least common multiple of "
            "3 and 2, which is 6. Two aluminium ions give 2 x (3+) = 6+, and "
            "three sulfate ions give 3 x (2-) = 6-, which cancels. Because "
            "sulfate is a group taken more than once it needs parentheses, so "
            "the formula is Al2(SO4)3. Confirm the atom counts the "
            "parentheses imply: 2 aluminium, 3 sulfur, and 3 x 4 = 12 oxygen. "
            "Its molar mass is 2 x 26.98 + 3 x 32.06 + 12 x 16.00, which is "
            "53.96 + 96.18 + 192.00 = 342.14 g/mol."
        ),
        try_it_prompt=(
            "Calcium forms Ca with a 2+ charge and phosphate is PO4 with a 3- "
            "charge. What is the formula of calcium phosphate, the main "
            "mineral in your bones?"
        ),
        try_it_answer=(
            "Ca3(PO4)2. Three calcium ions give 6+ and two phosphate ions give "
            "6-, so the charges cancel at the least common multiple of 2 and "
            "3."
        ),
        pitfall=(
            "The trap is speaking about a molecule of an ionic compound. There "
            "is no such particle as an NaCl molecule sitting in a salt "
            "crystal, only a lattice in the ratio one sodium to one chloride. "
            "That is why melted or dissolved salt conducts electricity while "
            "melted sugar, which really is made of molecules, does not."
        ),
        misconception="MOLECULAR-IONIC",
        claims=(
            Source(
                "Standard atomic weights used to build the molar mass of "
                "aluminium sulfate, Al2(SO4)3 = 342.14 g/mol: aluminium 26.98, "
                "sulfur 32.06, oxygen 16.00 g/mol.",
                "IUPAC Commission on Isotopic Abundances and Atomic Weights, "
                "standard atomic weights 2021",
            ),
        ),
    ),
    "GEN1.NOMENMOLEC": Lesson(
        node="GEN1.NOMENMOLEC",
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
        claims=(
            Source(
                "The nomenclature rules used here, ionic compounds named cation "
                "then anion with an -ide ending and a Roman numeral for "
                "variable-charge metals, and binary molecular compounds named "
                "with Greek multiplying prefixes, are the standard "
                "conventions.",
                OPENSTAX + ", Ch. 2.6 Molecular and Ionic Compounds and Ch. 2.7 Chemical Nomenclature",
            ),
        ),
    ),
    "GEN1.MOLE": Lesson(
        node="GEN1.MOLE",
        objective=(
            "Convert between mass, moles and number of particles for any "
            "substance whose formula you know."
        ),
        build_on=(
            "A formula tells you how many atoms of each element sit in one "
            "unit, and the mole turns that per unit count into something you "
            "can weigh on a balance."
        ),
        core_idea=(
            "You already count by weighing whenever it is impractical to count "
            "one by one. A hardware store does not count 5000 washers, it "
            "weighs them and divides by the mass of one. Chemistry has the "
            "same problem, only far worse, because atoms are far too small and "
            "numerous to count. A mole is a fixed count of particles, "
            "6.022 x 10^23 of them, chosen so that the mass in grams of one "
            "mole of a substance equals the mass number you read off the "
            "periodic table. That is the whole trick: the balance measures "
            "grams, the molar mass converts grams to moles, and moles are a "
            "count."
        ),
        worked_example=(
            "You pour 45.0 g of water into a beaker and want to know how many "
            "molecules that is. First build the molar mass of H2O from the "
            "periodic table: hydrogen is 1.008 g/mol and there are two of "
            "them, so 2 x 1.008 = 2.016, and oxygen is 16.00 g/mol. Adding "
            "gives 2.016 + 16.00 = 18.02 g/mol. Now convert mass to moles by "
            "dividing: 45.0 g divided by 18.02 g/mol = 2.50 mol. Then convert "
            "moles to molecules by multiplying by Avogadro's number: "
            "2.50 mol x 6.022 x 10^23 molecules/mol = 1.50 x 10^24 molecules. "
            "Notice the units cancel in each step, grams over grams per mole "
            "leaving moles, then moles times molecules per mole leaving "
            "molecules. That cancellation is your check that you divided when "
            "you should have divided."
        ),
        try_it_prompt=(
            "How many moles of water are in 9.01 g of water? Use the molar "
            "mass built in the worked example."
        ),
        try_it_answer=(
            "0.500 mol. Dividing 9.01 g by 18.02 g/mol gives exactly 0.500, "
            "because 9.01 g is half of the 18.02 g that one mole weighs."
        ),
        pitfall=(
            "The trap is assuming equal masses mean equal numbers of "
            "particles. They almost never do. 1.00 g of hydrogen gas is "
            "1.00/2.016 = 0.496 mol, while 1.00 g of oxygen gas is "
            "1.00/32.00 = 0.0313 mol, so the same mass of hydrogen holds "
            "about sixteen times as many molecules."
        ),
        misconception="MOLES-NOT-MASS",
        claims=(
            Formula("O", "H2O", "water"),
            Source(
                "The Avogadro constant is 6.02214076e23 per mole (used here as "
                "6.022e23), and standard atomic weights give hydrogen 1.008 and "
                "oxygen 16.00 g/mol.",
                CODATA + "; atomic weights from IUPAC 2021",
            ),
        ),
    ),
    "GEN1.PERCENTCOMP": Lesson(
        node="GEN1.PERCENTCOMP",
        objective=(
            "Calculate the mass percent of each element in a compound from its "
            "formula, and use it to find the mass of one element in a sample."
        ),
        build_on=(
            "You can already build a molar mass by adding up the atoms in a "
            "formula, and percent composition just asks what fraction of that "
            "total each element contributed."
        ),
        core_idea=(
            "Percent composition is a recipe stated by mass rather than by "
            "count. A bag of fertilizer labelled with a nitrogen percentage is "
            "telling you exactly this: out of every 100 g in the bag, that "
            "many grams are nitrogen atoms. To get it from a formula you take "
            "the total mass contributed by one element in one mole, divide by "
            "the molar mass of the whole compound, and multiply by 100. The "
            "percentages must sum to 100, which is a free check on your "
            "arithmetic. Because it is a mass fraction, it scales: if a "
            "compound is 27.29 percent carbon, then any sample of it is "
            "27.29 percent carbon by mass, whether the sample is 1 g or 1 kg."
        ),
        worked_example=(
            "Find the percent composition of carbon dioxide, CO2, the gas you "
            "exhale. Build the molar mass first: carbon is 12.01 g/mol, and "
            "two oxygens are 2 x 16.00 = 32.00 g/mol, so the total is "
            "12.01 + 32.00 = 44.01 g/mol. The carbon percentage is "
            "(12.01 / 44.01) x 100 = 27.29 percent. The oxygen percentage is "
            "(32.00 / 44.01) x 100 = 72.71 percent. Check the sum: "
            "27.29 + 72.71 = 100.00 percent, so nothing was lost. Now use it. "
            "In a 50.0 g sample of CO2 the mass of carbon is "
            "0.2729 x 50.0 g = 13.6 g, and the rest, 50.0 - 13.6 = 36.4 g, is "
            "oxygen."
        ),
        try_it_prompt=(
            "Ammonia is NH3. What is its mass percent nitrogen? Nitrogen is "
            "14.01 g/mol and hydrogen is 1.008 g/mol."
        ),
        try_it_answer=(
            "About 82.2 percent. The molar mass is 14.01 + 3.024 = "
            "17.034 g/mol, and (14.01 / 17.034) x 100 = 82.25 percent, "
            "because the three light hydrogens contribute very little mass."
        ),
        pitfall=(
            "The trap is computing a percentage of atoms instead of a "
            "percentage of mass. In water, 2 of the 3 atoms are hydrogen, "
            "which is 66.7 percent of the atoms, but hydrogen is only "
            "11.19 percent of the mass because each hydrogen weighs about one "
            "sixteenth of an oxygen."
        ),
        misconception=None,
        claims=(
            Formula("O=C=O", "CO2", "carbon dioxide"),
            Source(
                "Standard atomic weights carbon 12.01 and oxygen 16.00 g/mol "
                "give carbon dioxide a molar mass of 44.01 g/mol.",
                "IUPAC standard atomic weights 2021",
            ),
        ),
    ),
    "GEN1.EMPIRICAL": Lesson(
        node="GEN1.EMPIRICAL",
        objective=(
            "State exactly which questions a chemical formula answers about a "
            "substance and which it leaves open."
        ),
        build_on=(
            "You already turn a name into a formula and back, so now you ask "
            "what that string of symbols actually claims about the substance."
        ),
        core_idea=(
            "A molecular formula is a headcount of atoms in one molecule. The "
            "vinegar in your kitchen contains acetic acid, C2H4O2, which means "
            "one molecule holds 2 carbon atoms, 4 hydrogen atoms and 2 oxygen "
            "atoms. An empirical formula is that same headcount reduced to the "
            "smallest whole number ratio, so acetic acid has the empirical "
            "formula CH2O. The formula does not tell you how the atoms are "
            "connected, what shape the molecule has, or whether the substance "
            "is a liquid you can pour on a salad. Two different substances can "
            "share an empirical formula, which is why the reduced ratio is a "
            "weaker piece of information than the full count."
        ),
        worked_example=(
            "Take glucose, the sugar in your blood, molecular formula C6H12O6. "
            "To reduce it, find the largest number that divides every "
            "subscript. Here 6, 12 and 6 all divide by 6. Dividing gives "
            "6/6 = 1 carbon, 12/6 = 2 hydrogen, 6/6 = 1 oxygen, so the "
            "empirical formula is CH2O. Now do the same for acetic acid, "
            "C2H4O2. The subscripts 2, 4 and 2 all divide by 2, giving "
            "2/2 = 1 carbon, 4/2 = 2 hydrogen, 2/2 = 1 oxygen, which is again "
            "CH2O. So glucose and acetic acid have identical empirical "
            "formulas even though one is a sweet solid and the other is the "
            "sour liquid in vinegar. The molecular formula separates them and "
            "the empirical formula does not."
        ),
        try_it_prompt=(
            "Hydrogen peroxide, the antiseptic in the brown bottle, has the "
            "molecular formula H2O2. What is its empirical formula, and does "
            "that empirical formula distinguish it from water?"
        ),
        try_it_answer=(
            "HO. Both subscripts divide by 2, giving 1 hydrogen to 1 oxygen. "
            "It does distinguish peroxide from water, because water is H2O, "
            "which is already in lowest terms at 2 hydrogen to 1 oxygen."
        ),
        pitfall=(
            "The trap is treating the empirical formula as the substance's "
            "identity. CH2O is not a substance. Glucose (C6H12O6) and acetic "
            "acid (C2H4O2) both reduce to CH2O, and you cannot drink one of "
            "them on cereal."
        ),
        misconception="EMP-MOL",
        claims=(
            Formula("OCC(O)C(O)C(O)C(O)C=O", "C6H12O6", "glucose"),
            Formula("CC(=O)O", "C2H4O2", "acetic acid, empirical formula CH2O like glucose"),
            Formula("OO", "H2O2", "hydrogen peroxide, empirical formula HO"),
        ),
    ),
    "GEN1.MOLARITY": Lesson(
        node="GEN1.MOLARITY",
        objective=(
            "Calculate molarity, and determine the mass of solute needed to "
            "prepare a solution of a stated concentration and volume."
        ),
        build_on=(
            "You can convert grams to moles, and molarity is simply that mole "
            "count divided by the volume the solution ends up occupying."
        ),
        core_idea=(
            "Most reactions you will run happen in solution, so you need a way "
            "to measure out moles by pouring rather than by weighing. Molarity "
            "does that: it is moles of solute per litre of solution, so "
            "measuring a volume with a pipette measures a number of particles. "
            "The word solution in that definition is doing real work. You "
            "prepare a 1.00 M solution by dissolving one mole in some water "
            "and then adding water until the total reaches the 1.000 L mark on "
            "a volumetric flask, not by adding one mole to 1.000 L of water. "
            "The dissolved particles take up space themselves, so those two "
            "recipes give different final volumes and therefore different "
            "concentrations."
        ),
        worked_example=(
            "Prepare 250.0 mL of 0.150 M sodium chloride. Start by converting "
            "the volume to litres, because molarity is defined per litre: "
            "250.0 mL = 0.2500 L. Multiply concentration by volume to get "
            "moles: 0.150 mol/L x 0.2500 L = 0.0375 mol of NaCl. Convert moles "
            "to grams with the molar mass, which is 22.99 + 35.45 = "
            "58.44 g/mol: 0.0375 mol x 58.44 g/mol = 2.19 g. So you weigh out "
            "2.19 g of salt, tip it into a 250.0 mL volumetric flask, swirl "
            "with some water until it dissolves, and then top up to the "
            "calibration mark. Check the units as you go: mol/L times L leaves "
            "mol, and mol times g/mol leaves g."
        ),
        try_it_prompt=(
            "You dissolve 5.85 g of sodium chloride and dilute to a total "
            "volume of 500.0 mL. What is the molarity?"
        ),
        try_it_answer=(
            "0.200 M. That mass is 5.85 / 58.44 = 0.100 mol, and 0.100 mol "
            "divided by 0.5000 L gives 0.200 mol/L."
        ),
        pitfall=(
            "The trap is measuring the solvent instead of the solution. If you "
            "add one mole of sodium chloride to a full litre of water, the "
            "final volume is more than a litre and the concentration is less "
            "than 1.00 M. The volumetric flask is filled to the mark after the "
            "solute is in, never before."
        ),
        misconception=None,
        claims=(
            Source(
                "Sodium chloride has a molar mass of 58.44 g/mol from the "
                "standard atomic weights sodium 22.99 and chlorine 35.45 g/mol.",
                "IUPAC standard atomic weights 2021",
            ),
        ),
    ),
    "GEN1.DILUTION": Lesson(
        node="GEN1.DILUTION",
        objective=(
            "Use the dilution relationship to find the volume of stock "
            "solution needed to prepare a solution of lower concentration."
        ),
        build_on=(
            "Molarity is moles divided by volume, and dilution is what happens "
            "to that ratio when you change the volume and leave the moles "
            "alone."
        ),
        core_idea=(
            "When you make orange juice from frozen concentrate you add water, "
            "and the amount of orange in the jug never changes. Only the "
            "volume it is spread through changes, so the taste weakens. "
            "Dilution in the lab is exactly this. Adding solvent cannot create "
            "or destroy solute, so the moles before equal the moles after, and "
            "since moles equal concentration times volume you get "
            "M1 x V1 = M2 x V2. The subscript 1 is the concentrated stock you "
            "start with and 2 is the dilute solution you finish with, and V2 "
            "is the final total volume rather than the volume of water you "
            "poured in."
        ),
        worked_example=(
            "Make 500.0 mL of 0.100 M hydrochloric acid from a 6.00 M stock "
            "bottle. Write the relationship with the unknown isolated: "
            "V1 = (M2 x V2) / M1. Substituting gives V1 = "
            "(0.100 mol/L x 500.0 mL) / 6.00 mol/L = 50.0 / 6.00 = 8.33 mL. "
            "Notice the volumes stayed in millilitres on both sides, which is "
            "allowed here because the volume unit cancels. Now check the "
            "logic by counting moles both ways: the stock portion holds "
            "6.00 mol/L x 0.00833 L = 0.0500 mol, and the final solution holds "
            "0.100 mol/L x 0.5000 L = 0.0500 mol. They match, as they must. So "
            "you add roughly 400 mL of water to the flask first, then 8.33 mL "
            "of acid, then top up to the 500.0 mL mark, because acid is always "
            "added to water and never the reverse."
        ),
        try_it_prompt=(
            "You take 25.0 mL of 2.00 M glucose solution and dilute it to a "
            "final volume of 100.0 mL. What is the new concentration?"
        ),
        try_it_answer=(
            "0.500 M. Rearranging gives M2 = (2.00 x 25.0) / 100.0 = 0.500 "
            "mol/L, because the volume grew by a factor of four so the "
            "concentration fell by a factor of four."
        ),
        pitfall=(
            "The trap is reading V2 as the volume of water added rather than "
            "the final total volume. Diluting 8.33 mL of stock with 500.0 mL "
            "of water gives 508.3 mL of solution, not 500.0 mL, and the "
            "concentration lands at 0.0984 M instead of 0.100 M. It also helps "
            "to remember that the number of moles of solute never changes at "
            "any point."
        ),
        misconception=None,
        claims=(
            Source(
                "Dilution conserves the moles of solute, so M1*V1 = M2*V2 where "
                "V2 is the final total volume; this is the standard dilution "
                "relationship.",
                OPENSTAX + ", Ch. 3.3 Molarity (dilution of solutions)",
            ),
        ),
    ),
    "GEN1.CONSERVATION": Lesson(
        node="GEN1.CONSERVATION",
        objective=(
            "Account for every atom in a chemical change and explain apparent "
            "mass losses or gains in an open container."
        ),
        build_on=(
            "Atoms are the units that survive chemical change, so once you "
            "accept that atoms are not created or destroyed, mass "
            "conservation follows for free."
        ),
        core_idea=(
            "Burn a log and the ash weighs far less than the log did, which "
            "looks like mass vanishing. It did not vanish. Most of the log "
            "left as carbon dioxide and water vapour, which drifted up the "
            "chimney unweighed. A chemical reaction only rearranges which "
            "atoms are bonded to which, so the number of atoms of each element "
            "is identical before and after. If you seal the system so nothing "
            "can enter or leave, the balance reading does not change at all "
            "during the reaction."
        ),
        worked_example=(
            "React hydrogen with oxygen to make water: 2 H2 + O2 gives "
            "2 H2O. Start with 2.000 mol of H2, which is "
            "2.000 x 2.016 = 4.032 g, and 1.000 mol of O2, which is "
            "1.000 x 32.00 = 32.00 g. The total starting mass is "
            "4.032 + 32.00 = 36.03 g. The reaction produces 2.000 mol of "
            "water, and water's molar mass is 2.016 + 16.00 = 18.016 g/mol, so "
            "the product mass is 2.000 x 18.016 = 36.03 g. The masses match "
            "because the atoms match: 4 hydrogen atoms and 2 oxygen atoms go "
            "in, and 4 hydrogen atoms and 2 oxygen atoms come out, just bonded "
            "differently. Nothing was consumed and nothing was created, only "
            "reconnected."
        ),
        try_it_prompt=(
            "You burn 2.00 g of magnesium ribbon in an open crucible and the "
            "white powder left behind weighs 3.32 g. Was mass created? Where "
            "did the extra 1.32 g come from?"
        ),
        try_it_answer=(
            "No mass was created. The extra 1.32 g is oxygen pulled in from "
            "the air, because the product is magnesium oxide, MgO, and the "
            "crucible was open so the system was not closed."
        ),
        pitfall=(
            "The trap is believing mass is destroyed whenever a product "
            "escapes as a gas. Decompose 100.0 g of calcium carbonate in an "
            "open dish and the solid left weighs only 56.0 g, but the missing "
            "44.0 g is carbon dioxide that walked off into the room. Do it in "
            "a sealed flask and the balance never moves."
        ),
        misconception="ATOM-CONSERV",
        claims=(
            Formula("O", "H2O", "water, the product of hydrogen burning in oxygen"),
            Source(
                "Mass is conserved in a chemical reaction because atoms are "
                "neither created nor destroyed; apparent losses in an open "
                "vessel are gas escaping (100.0 g CaCO3 leaves 56.0 g CaO and "
                "releases 44.0 g CO2).",
                OPENSTAX + ", Ch. 4 Stoichiometry of Chemical Reactions (conservation of mass)",
            ),
        ),
    ),
    "GEN1.BALANCE": Lesson(
        node="GEN1.BALANCE",
        objective=(
            "Balance a chemical equation by adjusting coefficients only, and "
            "verify the balance atom by atom."
        ),
        build_on=(
            "Conservation of atoms says the counts must match on both sides, "
            "and balancing is the bookkeeping that makes the written equation "
            "obey that rule."
        ),
        core_idea=(
            "A formula is a fixed fact about a substance and a coefficient is "
            "how many of that substance you have. Think of a recipe: you can "
            "make two batches of pancakes, but you cannot redefine what an egg "
            "is. Changing a subscript changes the substance, so H2O becomes "
            "H2O2 and you have swapped drinking water for hydrogen peroxide. "
            "Changing a coefficient only changes the amount, so 2 H2O is still "
            "water. Balancing therefore means finding the smallest whole "
            "number coefficients that make every element's atom count equal on "
            "both sides."
        ),
        worked_example=(
            "Balance the combustion of propane, the fuel in a barbecue tank: "
            "C3H8 + O2 gives CO2 + H2O. Start with carbon, which appears in "
            "one place on each side. There are 3 carbons on the left, so you "
            "need 3 CO2 on the right. Move to hydrogen: there are 8 hydrogens "
            "on the left, and each water carries 2, so 8 / 2 = 4 gives you "
            "4 H2O. Save oxygen for last because it appears in two products. "
            "The right side now holds 3 x 2 = 6 oxygen atoms in the carbon "
            "dioxide plus 4 x 1 = 4 in the water, for 10 oxygen atoms total. "
            "Each O2 supplies 2 atoms, so you need 10 / 2 = 5 of them. The "
            "balanced equation is C3H8 + 5 O2 gives 3 CO2 + 4 H2O, and the "
            "final check reads carbon 3 = 3, hydrogen 8 = 8, oxygen 10 = 10."
        ),
        try_it_prompt=(
            "Balance the combustion of ethane: C2H6 + O2 gives CO2 + H2O. Use "
            "whole number coefficients."
        ),
        try_it_answer=(
            "2 C2H6 + 7 O2 gives 4 CO2 + 6 H2O. Balancing one ethane needs "
            "2 CO2 and 3 H2O, which requires 7 oxygen atoms or 3.5 O2, so you "
            "double everything to clear the fraction."
        ),
        pitfall=(
            "The trap is fixing a shortage by editing a subscript. If you "
            "balance oxygen by writing H2O2 instead of H2O you have not "
            "balanced the equation, you have changed the product into hydrogen "
            "peroxide, which is a different substance that would sting a cut "
            "rather than quench thirst."
        ),
        misconception="SUB-COEF",
        claims=(
            Formula("CCC", "C3H8", "propane, balanced C3H8 + 5 O2 -> 3 CO2 + 4 H2O"),
        ),
    ),
    "GEN1.REACTIONTYPES": Lesson(
        node="GEN1.REACTIONTYPES",
        objective=(
            "Classify a balanced equation as synthesis, decomposition, single "
            "replacement, double replacement or combustion, and predict "
            "products from the pattern."
        ),
        build_on=(
            "Now that you can balance an equation, you can look at its shape "
            "and notice that a small number of shapes cover most of the "
            "reactions you will meet."
        ),
        core_idea=(
            "Classification is pattern recognition that lets you predict "
            "products before you know any theory. Synthesis puts pieces "
            "together, as when magnesium ribbon burns to magnesium oxide. "
            "Decomposition breaks one substance into several, as when the "
            "hydrogen peroxide in an old bottle slowly turns into water and "
            "oxygen gas. Single replacement has one element kicking another "
            "out of a compound, which is what happens when zinc metal drops "
            "into hydrochloric acid and hydrogen bubbles off. Double "
            "replacement swaps partners between two compounds, and combustion "
            "burns a fuel in oxygen to give carbon dioxide and water. These "
            "are descriptive boxes, not laws, and some reactions sit in two of "
            "them at once."
        ),
        worked_example=(
            "Classify four reactions. First, 2 Mg + O2 gives 2 MgO. Two "
            "reactants become one product, so this is synthesis. Second, "
            "2 H2O2 gives 2 H2O + O2. One reactant becomes two products, so "
            "this is decomposition. Third, Zn + 2 HCl gives ZnCl2 + H2. A "
            "free element, zinc, has displaced the hydrogen out of the "
            "compound and hydrogen is now the free element, so this is single "
            "replacement. Fourth, AgNO3 + NaCl gives AgCl + NaNO3. Two "
            "compounds have exchanged partners, silver taking the chloride "
            "and sodium taking the nitrate, so this is double replacement. "
            "Notice the test is structural: count how many species are on each "
            "side and watch whether any element appears uncombined."
        ),
        try_it_prompt=(
            "Heating limestone gives CaCO3 to CaO + CO2. Which category is "
            "this, and what structural feature tells you?"
        ),
        try_it_answer=(
            "Decomposition. A single reactant breaks into two products and no "
            "free element appears on the reactant side."
        ),
        pitfall=(
            "The trap is believing every reaction belongs to exactly one box. "
            "The reaction 2 H2 + O2 gives 2 H2O is a synthesis, because two "
            "reactants make one product, and it is also a combustion, because "
            "a fuel burned in oxygen and released heat. Both labels are "
            "correct at the same time."
        ),
        misconception=None,
        claims=(
            Formula("OO", "H2O2", "hydrogen peroxide, which decomposes to water and oxygen"),
            Source(
                "The five reaction categories used here, synthesis, "
                "decomposition, single replacement, double replacement and "
                "combustion, are descriptive patterns, and a reaction can "
                "belong to more than one.",
                OPENSTAX + ", Ch. 4.1 Writing and Balancing Chemical Equations and Ch. 4.2 Classifying Chemical Reactions",
            ),
        ),
    ),
    "GEN1.SOLUBILITY": Lesson(
        node="GEN1.SOLUBILITY",
        objective=(
            "Predict whether mixing two aqueous solutions produces a "
            "precipitate, and write the balanced equation with correct state "
            "labels."
        ),
        build_on=(
            "You can build charge balanced ionic formulas, and now you decide "
            "which of those formulas can stay dissolved and which drop out as "
            "a solid."
        ),
        core_idea=(
            "The scale inside a kettle is a precipitate: ions that were "
            "dissolved found a partner they cannot stay dissolved with and "
            "left the water as a solid. To predict it you swap the partners of "
            "the two compounds you mixed and then test each new pair against "
            "the solubility rules. The rules worth memorising first are that "
            "all compounds of Group 1 metals and of ammonium dissolve, and so "
            "do all nitrates. Chlorides, bromides and iodides dissolve except "
            "with silver, lead and mercury(I). Carbonates, phosphates, sulfides "
            "and hydroxides generally do not dissolve unless the positive ion "
            "is a Group 1 metal or ammonium."
        ),
        worked_example=(
            "Mix a solution of lead(II) nitrate with a solution of potassium "
            "iodide. First swap partners: lead pairs with iodide and potassium "
            "pairs with nitrate. Build each formula with charge balance. Lead "
            "is Pb with a 2+ charge and iodide is I with a 1- charge, so you "
            "need two iodides, giving PbI2. Potassium is 1+ and nitrate is 1-, "
            "so that pair is KNO3. Now test them. KNO3 is both a Group 1 "
            "compound and a nitrate, so it stays dissolved. PbI2 is an iodide, "
            "and lead is one of the three exceptions, so it precipitates, and "
            "in the beaker you see a bright yellow solid appear. The balanced "
            "equation with states is Pb(NO3)2(aq) + 2 KI(aq) gives PbI2(s) + "
            "2 KNO3(aq)."
        ),
        try_it_prompt=(
            "You mix aqueous sodium chloride with aqueous silver nitrate. Does "
            "anything precipitate, and what is the balanced equation with "
            "state labels?"
        ),
        try_it_answer=(
            "Yes, silver chloride. NaCl(aq) + AgNO3(aq) gives AgCl(s) + "
            "NaNO3(aq), because chlorides dissolve except with silver, lead "
            "and mercury(I), while sodium nitrate is both a Group 1 salt and a "
            "nitrate."
        ),
        pitfall=(
            "The trap is swapping the partners and then copying the old "
            "subscripts onto the new pair. Mixing Pb(NO3)2 with KI does not "
            "give PbI, because lead carries a 2+ charge and needs two iodides. "
            "Rebuild every product formula from the ion charges, never from "
            "the formula it came out of."
        ),
        misconception=None,
        claims=(
            Source(
                "The solubility guidelines used here (all Group 1 and ammonium "
                "salts and all nitrates soluble; chlorides, bromides and "
                "iodides soluble except with silver, lead and mercury(I); most "
                "carbonates, phosphates, sulfides and hydroxides insoluble) are "
                "the standard qualitative rules.",
                OPENSTAX + ", Ch. 4.1 (precipitation reactions and solubility rules)",
            ),
        ),
    ),
    "GEN1.NETIONIC": Lesson(
        node="GEN1.NETIONIC",
        objective=(
            "Convert a molecular equation into a complete ionic equation and "
            "then a net ionic equation by cancelling spectator ions."
        ),
        build_on=(
            "You can already predict which product precipitates, and the net "
            "ionic equation is the way to write down only the change that "
            "actually happened."
        ),
        core_idea=(
            "When you dissolve sodium chloride in water there are no NaCl "
            "units left floating around, only separated sodium ions and "
            "chloride ions drifting independently. So writing NaCl(aq) is a "
            "convenient fiction, and the complete ionic equation writes what "
            "is really there. Once you do that, some ions appear identically "
            "on both sides, unchanged and still dissolved, and those are "
            "called spectator ions. Cancelling them leaves the net ionic "
            "equation, which is the actual chemical event. Only aqueous "
            "compounds that fully separate get split apart, so solids, "
            "liquids, gases and weak electrolytes stay written as whole "
            "formulas."
        ),
        worked_example=(
            "Start from the molecular equation AgNO3(aq) + NaCl(aq) gives "
            "AgCl(s) + NaNO3(aq). Split every aqueous ionic compound into its "
            "ions, keeping the solid intact: Ag+(aq) + NO3-(aq) + Na+(aq) + "
            "Cl-(aq) gives AgCl(s) + Na+(aq) + NO3-(aq). Now scan for species "
            "that are identical on both sides. Na+ is aqueous on the left and "
            "aqueous on the right, and NO3- is the same, so both are "
            "spectators. Cross them out. What remains is Ag+(aq) + Cl-(aq) "
            "gives AgCl(s). That single line is the whole reaction, and it "
            "says something more general than the equation you started from: "
            "any source of silver ions plus any source of chloride ions will "
            "do this."
        ),
        try_it_prompt=(
            "Write the net ionic equation for Pb(NO3)2(aq) + 2 KI(aq) gives "
            "PbI2(s) + 2 KNO3(aq)."
        ),
        try_it_answer=(
            "Pb2+(aq) + 2 I-(aq) gives PbI2(s). Potassium and nitrate are "
            "aqueous and unchanged on both sides, so they cancel as "
            "spectators."
        ),
        pitfall=(
            "The trap is splitting the precipitate into ions too. If you write "
            "the right side of the silver example as Ag+(aq) + Cl-(aq), every "
            "single species cancels and you are left with an empty equation "
            "claiming nothing happened. The solid is the point, so it stays "
            "whole."
        ),
        misconception=None,
        claims=(
            Source(
                "In a complete ionic equation only fully dissociated aqueous "
                "strong electrolytes are written as separated ions; solids, "
                "liquids, gases and weak electrolytes stay as whole formulas, "
                "and spectator ions cancel to give the net ionic equation.",
                OPENSTAX + ", Ch. 4.1 (ionic and net ionic equations)",
            ),
        ),
    ),
    "GEN1.OXNUMBERS": Lesson(
        node="GEN1.OXNUMBERS",
        objective=(
            "Assign oxidation numbers and balance a redox equation in acidic "
            "solution using the half reaction method."
        ),
        build_on=(
            "You can balance atoms in an ordinary equation, and redox adds one "
            "more thing that must balance, which is the electrons transferred."
        ),
        core_idea=(
            "An iron nail rusting and a battery running are the same process: "
            "electrons moving from one species to another. Oxidation is loss of "
            "electrons and reduction is gain, and you track them with oxidation "
            "numbers, which are a bookkeeping charge assigned by rules such as "
            "oxygen is -2, hydrogen is +1, an element alone is 0, and the "
            "numbers sum to the overall charge. The species that is oxidised "
            "gives electrons away and is therefore the reducing agent, which "
            "feels backwards until you say it out loud a few times. To balance, "
            "split the reaction into two half reactions and fix each "
            "separately: balance the main atoms, then oxygen with H2O, then "
            "hydrogen with H+, then charge with electrons. Finally scale the "
            "halves so the electrons cancel exactly, then add."
        ),
        worked_example=(
            "Balance MnO4- + Fe2+ -> Mn2+ + Fe3+ in acid. Assign numbers first: "
            "in MnO4-, four oxygens at -2 total -8, and the ion charge is -1, "
            "so Mn is +7; it becomes +2, a gain of 5 electrons, which is "
            "reduction. Iron goes +2 to +3, a loss of 1 electron, which is "
            "oxidation. Build the reduction half: MnO4- -> Mn2+, add 4 H2O on "
            "the right to balance oxygen, add 8 H+ on the left to balance the "
            "hydrogen in that water, then add 5 electrons on the left to make "
            "the charges match, giving MnO4- + 8 H+ + 5 e- -> Mn2+ + 4 H2O. The "
            "oxidation half is simply Fe2+ -> Fe3+ + e-. Multiply the iron half "
            "by 5 so both halves move 5 electrons, then add: MnO4- + 8 H+ + 5 "
            "Fe2+ -> Mn2+ + 4 H2O + 5 Fe3+. Verify charge, which is the step "
            "most often skipped: left is -1 + 8 + 10 = +17 and right is +2 + 0 "
            "+ 15 = +17, so it balances."
        ),
        try_it_prompt=(
            "In the balanced equation above, which species is the oxidising "
            "agent, and how many electrons does one permanganate ion accept?"
        ),
        try_it_answer=(
            "Permanganate, MnO4-, is the oxidising agent and it accepts 5 "
            "electrons. It is the species being reduced, going from Mn at +7 "
            "down to +2, and the thing that gets reduced is by definition what "
            "oxidises everything else."
        ),
        pitfall=(
            "The pitfall is balancing atoms and calling it done without "
            "checking charge. Write MnO4- + 8 H+ + Fe2+ -> Mn2+ + 4 H2O + Fe3+ "
            "and every atom balances, but the left carries +9 and the right "
            "carries +5, so four units of charge appeared from nowhere. Total "
            "charge must be identical on both sides."
        ),
        misconception="CHG-BAL",
        claims=(
            Source(
                "The oxidation-number rules used here (a free element is 0, "
                "oxygen usually -2, hydrogen usually +1, and the numbers sum to "
                "the species charge) and the half-reaction method of balancing "
                "redox equations are the standard conventions.",
                OPENSTAX + ", Ch. 4.2 Classifying Chemical Reactions (oxidation-reduction)",
            ),
        ),
    ),
    "GEN1.STOICH": Lesson(
        node="GEN1.STOICH",
        objective=(
            "Calculate the mass of any product or reactant from the mass of "
            "another, using the coefficients of a balanced equation."
        ),
        build_on=(
            "You can convert mass to moles, and a balanced equation gives you "
            "the exchange rate between the moles of one substance and the "
            "moles of another."
        ),
        core_idea=(
            "A balanced equation is a recipe written in particles, not in "
            "grams. When it says C3H8 + 5 O2 gives 3 CO2 + 4 H2O, it says one "
            "propane molecule needs five oxygen molecules, exactly the way a "
            "recipe says one egg per two cups of flour. Balances read grams, "
            "and the coefficients count molecules, so grams cannot be compared "
            "across the arrow directly. The route is always the same three "
            "steps: divide by molar mass to get moles of what you were given, "
            "multiply by the coefficient ratio to cross the arrow, then "
            "multiply by molar mass to get grams of what you want. Skipping "
            "the middle step is the single most common error in general "
            "chemistry."
        ),
        worked_example=(
            "How much carbon dioxide comes from burning 50.0 g of propane in a "
            "barbecue? The balanced equation is C3H8 + 5 O2 gives 3 CO2 + "
            "4 H2O. Build propane's molar mass: 3 x 12.01 + 8 x 1.008 = "
            "36.03 + 8.064 = 44.09 g/mol. Convert the given mass to moles: "
            "50.0 g divided by 44.09 g/mol = 1.134 mol of propane. Cross the "
            "arrow with the coefficient ratio, which is 3 CO2 for every "
            "1 C3H8: 1.134 mol x 3 = 3.402 mol of CO2. Convert back to grams "
            "using the molar mass of CO2, 44.01 g/mol: 3.402 mol x "
            "44.01 g/mol = 150. g. So 50.0 g of propane makes about 150 g of "
            "carbon dioxide, which is more mass than you started with because "
            "the oxygen from the air is now part of the product."
        ),
        try_it_prompt=(
            "Using the same reaction and the same 50.0 g of propane, what mass "
            "of water is produced? Water is 18.02 g/mol."
        ),
        try_it_answer=(
            "About 81.7 g. The 1.134 mol of propane crosses the arrow at "
            "4 H2O per C3H8, giving 4.536 mol of water, and 4.536 x 18.02 = "
            "81.7 g."
        ),
        pitfall=(
            "The trap is going from grams straight to grams as if the equation "
            "were one to one. Burning 50.0 g of propane does not give 50.0 g "
            "of carbon dioxide, it gives about 150 g, because each propane "
            "molecule yields three CO2 molecules and each of those is heavier "
            "than a third of a propane."
        ),
        misconception="NO-RATIO",
        claims=(
            Formula("CCC", "C3H8", "propane"),
            Formula("O=C=O", "CO2", "carbon dioxide, the combustion product"),
        ),
    ),
    "GEN1.LIMITING": Lesson(
        node="GEN1.LIMITING",
        objective=(
            "Identify the limiting reactant in a mixture, compute the "
            "theoretical yield, and calculate percent yield from an actual "
            "yield."
        ),
        build_on=(
            "Stoichiometry assumes you know which reactant sets the scale, and "
            "this lesson is how you find out when you are handed amounts of "
            "both."
        ),
        core_idea=(
            "If you have 10 slices of bread and 3 slices of cheese, you can "
            "make 5 sandwiches if a sandwich takes 2 bread and 1 cheese, "
            "because the bread runs out first even though there is more of it. "
            "The reactant that runs out first is the limiting reactant, and it "
            "alone sets how much product you can get. Everything else is in "
            "excess and some of it is left sitting in the flask when the "
            "reaction stops. To find the limiting reactant, convert each "
            "reactant to moles and divide by its coefficient, and the smallest "
            "result wins. The theoretical yield is what that calculation "
            "predicts, and the percent yield compares what you actually "
            "collected to it."
        ),
        worked_example=(
            "Burn 16.04 g of methane with 48.0 g of oxygen: CH4 + 2 O2 gives "
            "CO2 + 2 H2O. Convert both to moles. Methane is 12.01 + "
            "4 x 1.008 = 16.04 g/mol, so 16.04 / 16.04 = 1.00 mol. Oxygen is "
            "32.00 g/mol, so 48.0 / 32.00 = 1.50 mol. Now divide each by its "
            "coefficient: methane gives 1.00 / 1 = 1.00, oxygen gives "
            "1.50 / 2 = 0.750. Oxygen has the smaller value, so oxygen is "
            "limiting even though there are more moles of it. Theoretical "
            "yield of CO2 follows from the oxygen: 1.50 mol O2 x "
            "(1 CO2 / 2 O2) = 0.750 mol CO2, and 0.750 x 44.01 = 33.0 g. If "
            "the experiment actually collects 30.1 g, the percent yield is "
            "(30.1 / 33.0) x 100 = 91.2 percent."
        ),
        try_it_prompt=(
            "In the same experiment, how many grams of methane are left over "
            "when the oxygen runs out?"
        ),
        try_it_answer=(
            "About 4.01 g. Only 0.750 mol of methane can react with the "
            "0.750 mol worth of oxygen supply, so 1.00 - 0.750 = 0.250 mol "
            "remains, and 0.250 x 16.04 = 4.01 g."
        ),
        pitfall=(
            "The trap is naming the reactant with the smaller amount as "
            "limiting. In the worked example methane has fewer moles, 1.00 "
            "against 1.50, yet oxygen runs out first because the equation "
            "demands two oxygens for every methane. You must divide by the "
            "coefficient before comparing."
        ),
        misconception="IGNORED-RATIO",
        claims=(
            Formula("C", "CH4", "methane"),
            Formula("O=C=O", "CO2", "carbon dioxide, the product whose yield the limiting reactant sets"),
        ),
    ),
    "GEN1.TITRATIONBASIC": Lesson(
        node="GEN1.TITRATIONBASIC",
        objective=(
            "Calculate the unknown concentration of a solution from titration "
            "volumes and the mole ratio of the neutralization reaction."
        ),
        build_on=(
            "You can turn a volume of known molarity into moles, and "
            "stoichiometry carries those moles across the equation to the "
            "unknown."
        ),
        core_idea=(
            "A titration is a way of measuring moles that you cannot weigh. "
            "You add a solution of precisely known concentration, the titrant, "
            "from a burette into a measured volume of the unknown until an "
            "indicator changes colour, which signals that the reactants have "
            "met in exactly the ratio the equation demands. At that endpoint "
            "you know the titrant volume to the nearest hundredth of a "
            "millilitre, so you know its moles. The balanced equation converts "
            "those moles into moles of the unknown, and dividing by the "
            "unknown's volume gives its concentration. The whole method is "
            "three conversions with a colour change telling you when to stop."
        ),
        worked_example=(
            "A 25.00 mL sample of hydrochloric acid of unknown concentration "
            "needs 32.15 mL of 0.1000 M sodium hydroxide to reach the "
            "endpoint. The reaction is HCl + NaOH gives NaCl + H2O, a one to "
            "one ratio. Find the moles of titrant: 0.1000 mol/L x 0.03215 L = "
            "0.003215 mol of NaOH. Cross the equation at one to one, so the "
            "acid sample also held 0.003215 mol of HCl. Divide by the sample "
            "volume in litres: 0.003215 mol / 0.02500 L = 0.1286 mol/L. So the "
            "acid was 0.1286 M. Sanity check the size of the answer: it took "
            "slightly more base volume than the acid volume, so at a one to "
            "one ratio the acid must be slightly more concentrated than the "
            "0.1000 M base, and it is."
        ),
        try_it_prompt=(
            "It takes 36.00 mL of 0.150 M NaOH to titrate 20.00 mL of "
            "sulfuric acid, where the reaction is H2SO4 + 2 NaOH gives Na2SO4 "
            "+ 2 H2O. What is the concentration of the acid?"
        ),
        try_it_answer=(
            "0.135 M. The base supplies 0.150 x 0.03600 = 0.00540 mol, the "
            "ratio is 2 NaOH per H2SO4 so the acid held 0.00270 mol, and "
            "0.00270 / 0.02000 = 0.135 mol/L."
        ),
        pitfall=(
            "The trap is assuming every acid and base neutralise one to one. "
            "Skip the 2 in the sulfuric acid problem above and you report "
            "0.270 M, exactly double the true answer, because each H2SO4 "
            "molecule hands over two protons and therefore consumes two "
            "hydroxides."
        ),
        misconception=None,
        claims=(
            Source(
                "In a titration the moles of titrant at the endpoint, converted "
                "through the balanced neutralisation ratio, give the moles and "
                "hence concentration of the analyte; a diprotic acid such as "
                "H2SO4 consumes two hydroxides per molecule.",
                OPENSTAX + ", Ch. 4.5 Quantitative Chemical Analysis (titration)",
            ),
        ),
    ),
    "GEN1.ENERGYBASICS": Lesson(
        node="GEN1.ENERGYBASICS",
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
        claims=(
            Source(
                "The specific heat of liquid water is about 4.184 J/(g*C) and "
                "that of aluminium about 0.897 J/(g*C).",
                CRC + ", table of specific heat capacities",
            ),
        ),
    ),
    "GEN1.CALORIMETRY": Lesson(
        node="GEN1.CALORIMETRY",
        objective=(
            "Calculate the heat transferred to or from a substance from its "
            "mass, specific heat and temperature change."
        ),
        build_on=(
            "You already separate temperature from thermal energy, and "
            "specific heat is the constant that finally lets you convert "
            "between a measured temperature change and joules."
        ),
        core_idea=(
            "A metal spoon left in a hot pan burns your hand while the water "
            "beside it takes far longer to heat up, and specific heat is the "
            "number that captures that difference. Specific heat is the energy "
            "needed to raise one gram of a substance by one degree Celsius, "
            "and for water it is 4.184 J/(g*C), which is unusually large. That "
            "is why coastal towns have milder winters than inland ones and why "
            "a hot water bottle stays warm all night. The working equation is "
            "q = m x c x (change in temperature), where q is the heat "
            "transferred in joules. In a calorimeter you use it in reverse: "
            "you watch the temperature of a known mass of water change, and "
            "read off the energy the reaction released or absorbed."
        ),
        worked_example=(
            "You heat 250.0 g of water in a kettle from 22.0 degrees Celsius "
            "to 85.0 degrees Celsius. How much energy did that take? First "
            "find the temperature change: 85.0 - 22.0 = 63.0 degrees. Note "
            "that a change in Celsius equals a change in kelvin, so no "
            "conversion is needed here. Now substitute into q = m x c x change "
            "in temperature: q = 250.0 g x 4.184 J/(g*C) x 63.0 C. Multiply "
            "step by step: 250.0 x 4.184 = 1046 J per degree, and "
            "1046 x 63.0 = 65,900 J. Expressed in kilojoules that is 65.9 kJ. "
            "The units cancel cleanly, since grams times joules per gram per "
            "degree times degrees leaves joules."
        ),
        try_it_prompt=(
            "How much heat is needed to raise the temperature of 100.0 g of "
            "water by 25.0 degrees Celsius?"
        ),
        try_it_answer=(
            "10.5 kJ. Substituting gives q = 100.0 x 4.184 x 25.0 = 10,460 J, "
            "which is 10.5 kJ."
        ),
        pitfall=(
            "The trap is treating temperature change as a direct measure of "
            "energy, so that equal temperature rises mean equal energy. They "
            "do not. Give 4.184 J to one gram of water and it warms by 1.00 "
            "degree, but give the same 4.184 J to one gram of iron, whose "
            "specific heat is 0.449 J/(g*C), and it warms by 9.32 degrees."
        ),
        misconception=None,
        claims=(
            Source(
                "The specific heat of liquid water is about 4.184 J/(g*C) and "
                "that of iron about 0.449 J/(g*C).",
                CRC + ", table of specific heat capacities",
            ),
        ),
    ),
    "GEN1.ENTHALPY": Lesson(
        node="GEN1.ENTHALPY",
        objective=(
            "Interpret the sign of an enthalpy change and scale a molar "
            "enthalpy of reaction to any given mass of reactant."
        ),
        build_on=(
            "Calorimetry measures joules from a temperature change, and "
            "enthalpy is that measured heat reported per mole of reaction at "
            "constant pressure."
        ),
        core_idea=(
            "A chemical hand warmer gets hot because the reaction inside "
            "releases energy to its surroundings, and an instant cold pack "
            "gets cold because dissolving ammonium nitrate absorbs energy from "
            "them. Enthalpy change, written as the change in H, is the heat "
            "exchanged when a reaction runs at constant pressure, which is the "
            "condition in any open beaker. The sign is written from the "
            "reaction's point of view, not yours. A reaction that gives energy "
            "away has a negative enthalpy change and is called exothermic, "
            "while one that takes energy in has a positive value and is called "
            "endothermic. The value is quoted per mole of reaction as written, "
            "so it scales directly with how much you actually react."
        ),
        worked_example=(
            "Burning methane has an enthalpy change of -890.3 kJ per mole of "
            "CH4. How much heat does a camping stove release from 5.00 g of "
            "methane? Convert the mass to moles using the molar mass "
            "16.04 g/mol: 5.00 / 16.04 = 0.312 mol. Multiply by the molar "
            "enthalpy: 0.312 mol x (-890.3 kJ/mol) = -278 kJ. The negative "
            "answer means the system lost 278 kJ, so the surroundings gained "
            "278 kJ and the pot of water gets hot. To sanity check the "
            "magnitude, 278 kJ is more than four times the 65.9 kJ needed to "
            "take 250 g of water from 22 degrees to 85 degrees Celsius, which "
            "is why a small gas canister boils a lot of water."
        ),
        try_it_prompt=(
            "Using the same value of -890.3 kJ per mole, how much heat is "
            "released by burning 1.00 g of methane?"
        ),
        try_it_answer=(
            "About 55.5 kJ released, so the enthalpy change is -55.5 kJ. That "
            "mass is 1.00 / 16.04 = 0.0623 mol, and 0.0623 x 890.3 = 55.5 kJ."
        ),
        pitfall=(
            "The trap is reading a negative enthalpy as less energy, or as "
            "energy being destroyed. It means the opposite. Methane at "
            "-890.3 kJ/mol releases far more heat per mole than hydrogen at "
            "-285.8 kJ/mol, so the more negative the value, the hotter the "
            "flame. The minus sign only records that the energy left the "
            "system."
        ),
        misconception=None,
        claims=(
            Formula("C", "CH4", "methane"),
            Source(
                "The standard enthalpy of combustion is about -890.3 kJ per "
                "mole for methane and about -285.8 kJ per mole for hydrogen "
                "(forming liquid water).",
                CRC + ", tables of standard enthalpies of combustion and formation",
            ),
        ),
    ),
    "GEN1.HESS": Lesson(
        node="GEN1.HESS",
        objective=(
            "Combine known reaction enthalpies, reversing and scaling them as "
            "needed, to find the enthalpy of a reaction you cannot measure "
            "directly."
        ),
        build_on=(
            "You can scale an enthalpy to a mass, and Hess's law extends that "
            "bookkeeping so you can add whole reactions together."
        ),
        core_idea=(
            "The altitude you gain walking from the car park to a summit "
            "depends only on the two elevations, never on which path you took, "
            "and enthalpy behaves the same way. It is a state function, so the "
            "enthalpy change depends only on the starting and finishing "
            "substances, not on the route between them. That means you can "
            "invent any convenient route out of reactions whose enthalpies are "
            "already known and add them up. Two rules govern the bookkeeping: "
            "reversing a reaction flips the sign of its enthalpy, and "
            "multiplying a reaction through by a number multiplies its "
            "enthalpy by the same number. This matters because burning carbon "
            "to carbon monoxide without making any carbon dioxide is nearly "
            "impossible to do cleanly in a calorimeter."
        ),
        worked_example=(
            "Find the enthalpy of 2 C(s) + O2(g) gives 2 CO(g) from two "
            "measurable reactions. Reaction 1 is C(s) + O2(g) gives CO2(g) "
            "with an enthalpy of -393.5 kJ. Reaction 2 is 2 CO(g) + O2(g) "
            "gives 2 CO2(g) with an enthalpy of -566.0 kJ. You need 2 carbons "
            "on the left, so multiply reaction 1 by 2, giving 2 C + 2 O2 makes "
            "2 CO2 with an enthalpy of 2 x (-393.5) = -787.0 kJ. You need CO "
            "on the right, so reverse reaction 2, giving 2 CO2 makes 2 CO + O2 "
            "with the sign flipped to +566.0 kJ. Add the two: the 2 CO2 "
            "cancels because it appears on both sides, and 2 O2 on the left "
            "against 1 O2 on the right leaves one O2 on the left. The sum is "
            "2 C + O2 gives 2 CO, and the enthalpy is -787.0 + 566.0 = "
            "-221.0 kJ."
        ),
        try_it_prompt=(
            "From that result, what is the enthalpy change for C(s) + 1/2 "
            "O2(g) gives CO(g)?"
        ),
        try_it_answer=(
            "-110.5 kJ. The target equation is the worked example halved, and "
            "halving a reaction halves its enthalpy."
        ),
        pitfall=(
            "The trap is editing the equations but forgetting to edit the "
            "enthalpies with them. If you double reaction 1 and leave its "
            "value at -393.5 kJ, you get -393.5 + 566.0 = +172.5 kJ and "
            "conclude that burning carbon to carbon monoxide absorbs heat. It "
            "does not, as anyone who has stood near a coal fire knows."
        ),
        misconception=None,
        claims=(
            Formula("[C-]#[O+]", "CO", "carbon monoxide"),
            Source(
                "Standard reaction enthalpies used: C(s) + O2 -> CO2 about "
                "-393.5 kJ and 2 CO + O2 -> 2 CO2 about -566.0 kJ, which combine "
                "by Hess's law to 2 C + O2 -> 2 CO at about -221.0 kJ.",
                CRC + ", tables of standard enthalpies of formation and combustion",
            ),
        ),
    ),
    "GEN1.QUANTUMNUMBERS": Lesson(
        node="GEN1.QUANTUMNUMBERS",
        objective=(
            "State the allowed values of the four quantum numbers for a given "
            "shell and count the orbitals and electrons it can hold."
        ),
        build_on=(
            "You write configurations like 3d6 without asking why a d subshell "
            "holds ten, and the quantum numbers are the answer to that "
            "question."
        ),
        core_idea=(
            "Four numbers address an electron the way a country, city, street "
            "and house number address a person, and no two electrons in an "
            "atom share all four. The principal number n is a whole number "
            "from 1 upward and sets the shell, roughly the distance from the "
            "nucleus and most of the energy. The number l runs from 0 up to "
            "n - 1 and sets the shape, with 0 called s and spherical, 1 called "
            "p and shaped like two lobes along an axis, 2 called d and mostly "
            "four lobed. The number m_l runs from -l to +l in whole steps and "
            "picks which orientation in space that shape takes. Finally m_s is "
            "either +1/2 or -1/2, which is why an orbital holds exactly two "
            "electrons and no more."
        ),
        worked_example=(
            "Work out everything the third shell can hold. With n = 3, the "
            "allowed values of l run from 0 to n - 1 = 2, so l can be 0, 1 or "
            "2. For l = 0, m_l can only be 0, so that is a single 3s orbital. "
            "For l = 1, m_l can be -1, 0 or +1, which is three 3p orbitals. "
            "For l = 2, m_l can be -2, -1, 0, +1 or +2, which is five 3d "
            "orbitals. The total is 1 + 3 + 5 = 9 orbitals, and since m_s "
            "allows two electrons per orbital, the shell holds "
            "9 x 2 = 18 electrons. Both results match the general pattern of "
            "n squared orbitals and 2 n squared electrons, since 3 squared is "
            "9 and twice that is 18."
        ),
        try_it_prompt=(
            "How many orbitals does the n = 4 shell contain, and how many "
            "electrons can it hold?"
        ),
        try_it_answer=(
            "16 orbitals and 32 electrons. The values of l run 0, 1, 2, 3 "
            "giving 1 + 3 + 5 + 7 = 16 orbitals, and each takes two electrons."
        ),
        pitfall=(
            "The trap is picturing an orbital as a track the electron runs "
            "around, like a planet. It is a probability map instead. A 2p "
            "orbital has a flat plane through the nucleus where the "
            "probability of finding the electron is exactly zero, yet the "
            "electron turns up in both lobes, which no continuous orbit could "
            "manage."
        ),
        misconception=None,
        claims=(
            Source(
                "The allowed quantum numbers used here (n a positive integer, l "
                "from 0 to n-1, m_l from -l to +l, m_s equal to +1/2 or -1/2) "
                "give n^2 orbitals and 2n^2 electrons per shell.",
                OPENSTAX + ", Ch. 6.3 Development of Quantum Theory (quantum numbers)",
            ),
        ),
    ),
    "GEN1.ELECTRONCONFIG": Lesson(
        node="GEN1.ELECTRONCONFIG",
        objective=(
            "Write the full and condensed electron configuration of an atom, "
            "and recognise the two common exceptions to the filling order."
        ),
        build_on=(
            "The periodic table's blocks are a map of which subshell is being "
            "filled, and this lesson turns that map into a written "
            "configuration."
        ),
        core_idea=(
            "Electrons occupy subshells the way people fill seats in a cheap "
            "cinema, taking the lowest available rows first. The order of "
            "increasing energy is 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, 5p, "
            "and each subshell holds a fixed number: 2 in an s, 6 in a p, 10 "
            "in a d, 14 in an f. Notice that 4s comes before 3d, which is why "
            "the fourth row of the periodic table is long. A condensed "
            "configuration replaces the filled inner shells with the previous "
            "noble gas in brackets, so the part that does chemistry is all "
            "that is left on the page. The order is a very good rule and not a "
            "law, because a few elements gain stability by rearranging "
            "slightly."
        ),
        worked_example=(
            "Write the configuration of iron, atomic number 26, so 26 "
            "electrons. Fill in energy order and keep a running total: 1s2 "
            "takes you to 2, 2s2 to 4, 2p6 to 10, 3s2 to 12, 3p6 to 18, and "
            "4s2 to 20. Six electrons are left and the next subshell is 3d, "
            "which can hold 10, so they go in as 3d6 and the total reaches 26. "
            "The full configuration is 1s2 2s2 2p6 3s2 3p6 4s2 3d6. Since "
            "argon is 1s2 2s2 2p6 3s2 3p6, the condensed form is [Ar] 4s2 3d6. "
            "Check the arithmetic by adding the superscripts: 2 + 2 + 6 + 2 + "
            "6 + 2 + 6 = 26, which matches the atomic number, and that sum is "
            "the check you should run every time."
        ),
        try_it_prompt=(
            "Write the full electron configuration of sulfur, atomic number "
            "16."
        ),
        try_it_answer=(
            "1s2 2s2 2p6 3s2 3p4. The superscripts sum to 2 + 2 + 6 + 2 + 4 = "
            "16, which matches the atomic number."
        ),
        pitfall=(
            "The trap is applying the filling order to chromium and copper "
            "without checking. The order predicts [Ar] 4s2 3d4 for chromium, "
            "but the real ground state is [Ar] 4s1 3d5, and copper is [Ar] 4s1 "
            "3d10 rather than 4s2 3d9. A half filled or completely filled d "
            "subshell is worth promoting an s electron for."
        ),
        misconception=None,
        claims=(
            Source(
                "The Aufbau filling order used here and the anomalous "
                "ground-state configurations of chromium ([Ar] 4s1 3d5) and "
                "copper ([Ar] 4s1 3d10) are the standard results.",
                OPENSTAX + ", Ch. 6.4 Electronic Structure of Atoms (Electron Configurations)",
            ),
        ),
    ),
    "GEN1.RADIUS": Lesson(
        node="GEN1.RADIUS",
        objective=(
            "Predict and justify the relative atomic radius, ionization energy "
            "and electronegativity of two elements from their positions."
        ),
        build_on=(
            "Electron configuration tells you which shell the outermost "
            "electrons sit in, and the trends are what follows once you also "
            "count the protons pulling on them."
        ),
        core_idea=(
            "Two competing effects explain almost every periodic trend. Going "
            "across a period you add protons but the new electrons enter the "
            "same shell, where they shield each other poorly, so the "
            "outermost electrons feel a stronger net pull and are drawn in "
            "tighter. Going down a group you start a whole new shell that sits "
            "further out and is screened by all the filled shells beneath it, "
            "so the outer electrons are held loosely. Atoms therefore shrink "
            "across a period and grow down a group. Ionization energy, the "
            "energy to strip the outermost electron, and electronegativity, "
            "the pull an atom exerts on shared electrons in a bond, both run "
            "the opposite way to radius, rising across a period and falling "
            "down a group."
        ),
        worked_example=(
            "Rank sodium, magnesium and potassium by atomic radius and by "
            "first ionization energy. Sodium and magnesium are neighbours in "
            "period 3, so both have their outermost electrons in the third "
            "shell, but magnesium has 12 protons against sodium's 11. The "
            "extra proton pulls the shell in, so magnesium is smaller, and the "
            "measured radii bear this out at 160 pm for magnesium against 186 "
            "pm for sodium. Potassium sits directly below sodium and puts its "
            "outermost electron in the fourth shell, so it is much bigger, at "
            "227 pm. Ionization energy must run the other way, because a "
            "tightly held close electron is harder to remove. The measured "
            "first ionization energies are 738 kJ/mol for magnesium, 496 "
            "kJ/mol for sodium and 419 kJ/mol for potassium, in exactly the "
            "reverse order of the radii."
        ),
        try_it_prompt=(
            "Which atom has the larger radius, chlorine or bromine, and what "
            "is the reason?"
        ),
        try_it_answer=(
            "Bromine. It is below chlorine in the same group, so its outermost "
            "electrons occupy the fourth shell rather than the third, and that "
            "shell sits further from the nucleus."
        ),
        pitfall=(
            "The trap is reasoning that more electrons must mean a bigger "
            "atom. Magnesium has one more electron than sodium and is clearly "
            "smaller, 160 pm against 186 pm, because the added electron joins "
            "the same shell and shields poorly while the added proton pulls "
            "on everything."
        ),
        misconception=None,
        claims=(
            Source(
                "Approximate atomic radii: sodium 186 pm, magnesium 160 pm, "
                "potassium 227 pm; approximate first ionisation energies: "
                "sodium 496, magnesium 738, potassium 419 kJ/mol.",
                CRC + ", tables of atomic radii and ionisation energies",
            ),
        ),
    ),
    "GEN1.IONICBOND": Lesson(
        node="GEN1.IONICBOND",
        objective=(
            "Classify a substance as ionic, covalent or metallic from its "
            "constituent elements, and predict melting point and conductivity "
            "from that classification."
        ),
        build_on=(
            "You already draw Lewis structures and read electronegativity off "
            "the periodic table, and the gap in electronegativity between two "
            "atoms is what decides which kind of bond forms."
        ),
        core_idea=(
            "Three substances on a kitchen counter tell the whole story: table "
            "salt, natural gas and a copper wire. In table salt the "
            "electronegativity gap between sodium (0.93) and chlorine (3.16) is "
            "2.23, large enough that chlorine takes the electron outright, and "
            "the resulting Na+ and Cl- ions pack into a lattice held by "
            "electrostatic attraction in every direction. In methane the gap "
            "between carbon (2.55) and hydrogen (2.20) is only 0.35, so the "
            "electrons are shared inside discrete CH4 molecules and nothing "
            "strong holds one molecule to the next. In copper the atoms release "
            "their valence electrons into a shared sea that flows freely past "
            "fixed positive cores. Bond type is not a label you memorise, it is "
            "a prediction: salt melts at 801 C and conducts only once molten, "
            "methane boils at -161.5 C, copper melts at 1085 C and conducts "
            "cold."
        ),
        worked_example=(
            "Classify magnesium oxide, MgO, and predict two properties. "
            "Magnesium is a metal from group 2 with electronegativity 1.31 and "
            "oxygen is a nonmetal with electronegativity 3.44. The difference "
            "is 3.44 - 1.31 = 2.13, well above the rough 1.7 cutoff, so this is "
            "ionic. Magnesium loses two electrons to give Mg2+ and oxygen gains "
            "two to give O2-, and the +2 and -2 charges attract far more "
            "strongly than the +1 and -1 charges in NaCl. Coulomb's law says "
            "the attraction scales with the product of the charges, so 2 times "
            "2 = 4 against 1 times 1 = 1, roughly a fourfold stronger pull at "
            "the same separation. Predict a melting point well above the 801 C "
            "of NaCl, and MgO in fact melts at 2852 C. Predict that solid MgO "
            "does not conduct, because the ions are locked in place, but molten "
            "MgO does, because the ions are then free to move."
        ),
        try_it_prompt=(
            "Silicon carbide, SiC, is used for grinding wheels. Silicon has "
            "electronegativity 1.90 and carbon 2.55. What bond type does the "
            "gap predict, and would you expect SiC to conduct electricity as a "
            "solid?"
        ),
        try_it_answer=(
            "The gap is 2.55 - 1.90 = 0.65, so the bonding is covalent, and "
            "since there are no free electrons and no mobile ions the solid "
            "does not conduct. SiC is a covalent network solid, which is why it "
            "is hard enough to grind steel and does not break down until about "
            "2730 C."
        ),
        pitfall=(
            "The pitfall is treating an ionic formula as a molecule. The "
            "formula NaCl invites you to picture one sodium bonded to one "
            "chlorine, but there is no such pair to point at in a salt crystal: "
            "each sodium ion is surrounded by six chloride ions and each "
            "chloride by six sodium ions. NaCl is the smallest whole number "
            "ratio in a lattice, not a particle."
        ),
        misconception="MOLECULAR-IONIC",
        claims=(
            Formula("C", "CH4", "methane, a molecular substance"),
            Source(
                "Pauling electronegativities used here: sodium 0.93, magnesium "
                "1.31, silicon 1.90, carbon 2.55, chlorine 3.16, oxygen 3.44, "
                "hydrogen 2.20.",
                CRC + ", table of electronegativities (Pauling scale)",
            ),
            Source(
                "Approximate melting or boiling points: NaCl melts at 801 C, "
                "MgO at 2852 C, copper at 1085 C; methane boils at -161.5 C; "
                "silicon carbide decomposes near 2730 C.",
                CRC + ", tables of melting and boiling points",
            ),
        ),
    ),
    "GEN1.LEWIS": Lesson(
        node="GEN1.LEWIS",
        objective=(
            "Draw a Lewis structure for a small molecule by counting valence "
            "electrons and distributing them to satisfy each atom."
        ),
        build_on=(
            "Electron configuration tells you how many valence electrons an "
            "atom brings, and a Lewis structure is the ledger that spends "
            "exactly that many."
        ),
        core_idea=(
            "A Lewis structure is honest accounting on paper: you have a fixed "
            "budget of valence electrons and you must spend every one, no more "
            "and no less. Each element's main group number tells you what it "
            "contributes, so carbon brings 4, nitrogen 5, oxygen 6 and "
            "hydrogen 1. You draw a skeleton with the least electronegative "
            "atom in the middle, spend two electrons on each single bond, then "
            "hand out the rest as lone pairs starting with the outer atoms. "
            "The target is eight electrons around each main group atom, "
            "counting both bonding and lone pairs, with hydrogen the exception "
            "at two. If you run short, convert a lone pair on an outer atom "
            "into a second or third bond rather than inventing extra "
            "electrons."
        ),
        worked_example=(
            "Draw carbon dioxide, CO2. Count the budget first: carbon brings "
            "4 and each oxygen brings 6, so 4 + 6 + 6 = 16 valence electrons. "
            "Carbon is the least electronegative, so the skeleton is O C O. "
            "Two single bonds spend 2 x 2 = 4 electrons, leaving 16 - 4 = 12. "
            "Give those 12 to the outer oxygens as three lone pairs each, "
            "which satisfies both oxygens but leaves carbon with only the 4 "
            "electrons in its two bonds. Fix it by moving one lone pair from "
            "each oxygen into the bond, making both bonds double. Now carbon "
            "has 8 electrons in four bonds, and each oxygen has 4 bonding plus "
            "2 remaining lone pairs, which is 8 as well. Audit the budget: two "
            "double bonds are 8 electrons and the four remaining lone pairs "
            "are 8 more, totalling 16, exactly what you started with."
        ),
        try_it_prompt=(
            "How many valence electrons does water have in total, and how are "
            "they arranged in its Lewis structure?"
        ),
        try_it_answer=(
            "Eight. Oxygen brings 6 and each hydrogen brings 1, and they are "
            "spent as two O to H single bonds (4 electrons) plus two lone "
            "pairs on the oxygen (4 electrons)."
        ),
        pitfall=(
            "The trap is giving hydrogen an octet. Hydrogen has only a 1s "
            "orbital and is complete with two electrons, so drawing lone pairs "
            "on the hydrogens in water would spend 12 electrons when the "
            "molecule only has 8 to give."
        ),
        misconception=None,
        claims=(
            Formula("O=C=O", "CO2", "carbon dioxide, two double bonds"),
            Formula("O", "H2O", "water, two bonds and two lone pairs on oxygen"),
        ),
    ),
    "GEN1.VSEPR": Lesson(
        node="GEN1.VSEPR",
        objective=(
            "Predict the electron geometry, molecular shape and approximate "
            "bond angles of a small molecule by counting electron domains "
            "around its central atom."
        ),
        build_on=(
            "A Lewis structure already tells you where the bonding pairs and "
            "lone pairs sit, and VSEPR is the one extra step that turns that "
            "flat drawing into a three dimensional shape."
        ),
        core_idea=(
            "Think of balloons tied together at their necks. Two balloons point "
            "opposite ways, three spread into a flat triangle, four splay into "
            "a tripod plus one, because each balloon pushes the others as far "
            "away as it can. Electron domains do the same thing, where a domain "
            "is any group of electrons on the central atom: one lone pair, one "
            "single bond, one double bond or one triple bond each count as "
            "exactly one domain. The number of domains fixes the electron "
            "geometry, and then you describe the molecular shape using only the "
            "positions of the atoms, ignoring the lone pairs you cannot see. "
            "Lone pairs are fatter than bonding pairs because they are held by "
            "one nucleus instead of two, so every lone pair squeezes the "
            "remaining bond angles a little smaller."
        ),
        worked_example=(
            "Find the shape of ammonia, NH3. Count valence electrons: nitrogen "
            "contributes 5 and each hydrogen 1, giving 5 + 3 = 8 electrons, or "
            "4 pairs. Three of those pairs bond to hydrogens and one is a lone "
            "pair on nitrogen, so the central atom carries 3 + 1 = 4 electron "
            "domains. Four domains spread as far apart as possible into a "
            "tetrahedron, so the electron geometry is tetrahedral with an ideal "
            "angle of 109.5 degrees. Now name the shape using atoms only: three "
            "hydrogens and one invisible corner give a trigonal pyramidal "
            "molecule, not a tetrahedral one. Finally correct the angle, "
            "because the single lone pair pushes harder than the three bonding "
            "pairs and compresses the H-N-H angle from 109.5 to the measured "
            "107 degrees."
        ),
        try_it_prompt=(
            "Water has 6 valence electrons on oxygen plus 1 from each hydrogen. "
            "How many electron domains does oxygen carry, what is the molecular "
            "shape, and should the bond angle be larger or smaller than the "
            "107 degrees in ammonia?"
        ),
        try_it_answer=(
            "Oxygen carries 4 domains (2 bonding pairs and 2 lone pairs), the "
            "shape is bent, and the angle is smaller, 104.5 degrees. Two lone "
            "pairs squeeze the bond angle more than ammonia's single lone pair "
            "does."
        ),
        pitfall=(
            "The pitfall is counting attached atoms instead of electron "
            "domains. Carbon dioxide and water both have a central atom with "
            "exactly two atoms attached, yet CO2 is linear at 180 degrees and "
            "water is bent at 104.5 degrees, because oxygen in water carries "
            "two lone pairs and carbon in CO2 carries none."
        ),
        misconception=None,
        claims=(
            Formula("N", "H3N", "ammonia"),
            Formula("O", "H2O", "water"),
            Source(
                "Measured bond angles: about 109.5 degrees for an ideal "
                "tetrahedron, about 107 degrees in ammonia, about 104.5 degrees "
                "in water, and 180 degrees in carbon dioxide.",
                CRC + ", tables of molecular structure and bond angles",
            ),
        ),
    ),
    "GEN1.POLARITY": Lesson(
        node="GEN1.POLARITY",
        objective=(
            "Decide whether a molecule is polar by combining bond dipoles with "
            "molecular geometry and checking whether the vectors cancel."
        ),
        build_on=(
            "VSEPR gave you the three dimensional shape, and polarity is what "
            "happens when you place an arrow along each polar bond and add "
            "those arrows up in that shape."
        ),
        core_idea=(
            "Polarity is a tug of war with direction. Each bond between "
            "different elements pulls electron density toward the more "
            "electronegative atom, which you draw as an arrow pointing that "
            "way, and the size of the arrow tracks the electronegativity gap. "
            "The molecule as a whole is polar only if those arrows fail to "
            "cancel, which is a geometry question, not a bond question. A "
            "symmetric arrangement lets equal arrows cancel to nothing, while a "
            "lopsided arrangement leaves a leftover pull called the dipole "
            "moment, measured in debye. This is why water sticks to itself and "
            "dissolves salt, while carbon dioxide, built from bonds that are "
            "individually more polar than nothing, does neither."
        ),
        worked_example=(
            "Compare carbon dioxide and water. In CO2 the gap is 3.44 - 2.55 = "
            "0.89, so each C=O bond is genuinely polar, and the arrows point "
            "from carbon out to each oxygen. Carbon has two electron domains "
            "and no lone pairs, so the molecule is linear at 180 degrees and "
            "the two arrows point in exactly opposite directions with equal "
            "size. They cancel, and the measured dipole moment of CO2 is 0 "
            "debye. In water the gap is 3.44 - 2.20 = 1.24, so each O-H bond is "
            "even more polar, and both arrows point from hydrogen toward "
            "oxygen. But water is bent at 104.5 degrees, so the two arrows are "
            "on the same side of the molecule and reinforce rather than cancel, "
            "giving a measured dipole moment of 1.85 debye. Same logic, "
            "opposite answer, and the only thing that changed was the shape."
        ),
        try_it_prompt=(
            "Boron trifluoride, BF3, is trigonal planar with three identical "
            "B-F bonds at 120 degrees and no lone pair on boron. Fluorine is far "
            "more electronegative than boron. Is BF3 polar?"
        ),
        try_it_answer=(
            "No, BF3 is nonpolar with a dipole moment of 0 debye. The three "
            "strongly polar B-F arrows are equal in size and spread evenly at "
            "120 degrees around a flat triangle, so they sum to zero."
        ),
        pitfall=(
            "The pitfall is concluding that polar bonds make a polar molecule. "
            "Carbon tetrachloride has four strongly polar C-Cl bonds, yet its "
            "dipole moment is 0 debye, because the tetrahedral arrangement "
            "cancels all four arrows and CCl4 will not mix with water."
        ),
        misconception=None,
        claims=(
            Formula("O=C=O", "CO2", "carbon dioxide, nonpolar by symmetry"),
            Formula("O", "H2O", "water, polar"),
            Formula("ClC(Cl)(Cl)Cl", "CCl4", "carbon tetrachloride, nonpolar by symmetry"),
            Source(
                "Approximate dipole moments: carbon dioxide 0, boron "
                "trifluoride 0 and carbon tetrachloride 0 debye by symmetry, "
                "while water is about 1.85 debye.",
                CRC + ", table of dipole moments",
            ),
        ),
    ),
    "GEN1.IDEALGAS": Lesson(
        node="GEN1.IDEALGAS",
        objective=(
            "Use PV = nRT to solve for any one of pressure, volume, "
            "temperature or moles when the other three are known."
        ),
        build_on=(
            "You can count moles of a solid by weighing it, and the ideal gas "
            "law lets you count moles of a gas by measuring its pressure, "
            "volume and temperature instead."
        ),
        core_idea=(
            "A bicycle tyre gets harder as you pump and warmer as you ride, "
            "and both facts are in one equation. Pressure comes from gas "
            "particles hitting the walls, so it rises when you add particles, "
            "shrink the container, or heat the particles into moving faster. "
            "The ideal gas law packages all of that as PV = nRT, where R is "
            "0.08206 L*atm/(mol*K). R carries units, so the other quantities "
            "must match them: pressure in atmospheres, volume in litres, and "
            "temperature in kelvin, which you get by adding 273.15 to the "
            "Celsius reading. The law treats particles as having no volume and "
            "no attraction for each other, which is a good approximation at "
            "ordinary pressures and a poor one near condensation."
        ),
        worked_example=(
            "A 2.00 L cylinder holds oxygen at 3.50 atm and 25.0 degrees "
            "Celsius. How many grams of oxygen are inside? First convert the "
            "temperature, since only kelvin works: 25.0 + 273.15 = 298.15 K. "
            "Rearrange the law for the unknown: n = PV / (RT). Substitute the "
            "numbers: n = (3.50 atm x 2.00 L) / (0.08206 L*atm/(mol*K) x "
            "298.15 K). The numerator is 7.00 and the denominator is 24.47, so "
            "n = 7.00 / 24.47 = 0.286 mol. Convert to mass with the molar mass "
            "of O2, which is 32.00 g/mol: 0.286 mol x 32.00 g/mol = 9.16 g. "
            "The units confirm the setup, because atm times L divided by "
            "L*atm/(mol*K) times K leaves mol."
        ),
        try_it_prompt=(
            "What volume does 1.00 mol of an ideal gas occupy at 1.00 atm and "
            "273.15 K?"
        ),
        try_it_answer=(
            "22.4 L. Rearranging gives V = nRT/P = (1.00 x 0.08206 x 273.15) / "
            "1.00 = 22.4 L, which is the standard molar volume worth "
            "remembering."
        ),
        pitfall=(
            "The trap is putting Celsius into the equation. At 0 degrees "
            "Celsius the law would predict V = nR x 0 / P = 0 litres, which "
            "would mean a balloon in a freezer collapses to nothing. It "
            "obviously does not, because the real temperature is 273.15 K."
        ),
        misconception=None,
        claims=(
            Formula("O=O", "O2", "oxygen gas"),
            Source(
                "The ideal gas constant is 0.08206 L*atm/(mol*K), and one mole "
                "of an ideal gas occupies about 22.4 L at 1.00 atm and "
                "273.15 K.",
                CODATA + " (gas constant); molar volume from OpenStax, Chemistry 2e, Ch. 9",
            ),
        ),
    ),
    "GEN1.PARTIALPRESSURE": Lesson(
        node="GEN1.PARTIALPRESSURE",
        objective=(
            "Calculate partial pressures in a gas mixture and find the volume "
            "of gas produced by a reaction at stated conditions."
        ),
        build_on=(
            "The ideal gas law relates moles to pressure and volume, and this "
            "lesson applies it twice over, once per gas in a mixture and once "
            "at the end of a stoichiometry chain."
        ),
        core_idea=(
            "The air around you is roughly 78 percent nitrogen and 21 percent "
            "oxygen by moles, yet you never feel two separate pressures. Each "
            "gas in a mixture behaves as if the others were not there, "
            "exerting the pressure it would exert alone in that container, and "
            "that is its partial pressure. Dalton's law says the total "
            "pressure is just the sum of them, and equivalently that a gas's "
            "partial pressure is its mole fraction times the total pressure. "
            "The same independence lets you finish a stoichiometry problem in "
            "volume instead of grams: once the balanced equation gives you the "
            "moles of gas produced, PV = nRT converts that count into a volume "
            "at whatever pressure and temperature you specify."
        ),
        worked_example=(
            "An airbag inflates when sodium azide decomposes: 2 NaN3 gives "
            "2 Na + 3 N2. What volume of nitrogen does 65.0 g of NaN3 make at "
            "1.00 atm and 298 K? Build the molar mass of NaN3: 22.99 + "
            "3 x 14.01 = 22.99 + 42.03 = 65.02 g/mol. Convert to moles: "
            "65.0 / 65.02 = 1.00 mol of NaN3. Cross the equation with the "
            "coefficient ratio, 3 N2 for every 2 NaN3: 1.00 mol x 3/2 = "
            "1.50 mol of N2. Now convert moles of gas to a volume with "
            "V = nRT/P = (1.50 mol x 0.08206 L*atm/(mol*K) x 298 K) / "
            "1.00 atm. That is 1.50 x 24.45 = 36.7 L, which is about the size "
            "of a driver's airbag."
        ),
        try_it_prompt=(
            "A scuba tank holds 0.800 mol of helium and 0.200 mol of oxygen at "
            "a total pressure of 200. atm. What is the partial pressure of the "
            "oxygen?"
        ),
        try_it_answer=(
            "40.0 atm. The mole fraction of oxygen is 0.200 / 1.000 = 0.200, "
            "and 0.200 x 200. atm = 40.0 atm."
        ),
        pitfall=(
            "The trap is thinking a gas pushes less hard because other gases "
            "are crowding it. It does not. Put 0.200 mol of oxygen in a fixed "
            "container at a fixed temperature and it exerts the same partial "
            "pressure whether the rest of the tank is empty or packed with "
            "helium, because ideal particles ignore each other entirely."
        ),
        misconception=None,
        claims=(
            Formula("N#N", "N2", "nitrogen gas"),
            Source(
                "Dalton's law of partial pressures: the total pressure of a gas "
                "mixture is the sum of the partial pressures, and each partial "
                "pressure equals the mole fraction times the total pressure.",
                OPENSTAX + ", Ch. 9.3 Stoichiometry of Gaseous Substances, Mixtures, and Reactions",
            ),
        ),
    ),
    "GEN1.IMF": Lesson(
        node="GEN1.IMF",
        objective=(
            "Rank substances by boiling point or predict solubility by "
            "identifying the strongest intermolecular force each one can use."
        ),
        build_on=(
            "You can now say whether a molecule is polar, and that answer "
            "decides which of the forces between molecules is available to it."
        ),
        core_idea=(
            "Intermolecular forces are the stickiness between molecules, not "
            "inside them. There are three to know, weakest to strongest for "
            "molecules of similar size: London dispersion forces, which every "
            "substance has and which grow with the number of electrons; dipole "
            "dipole attraction, available only to polar molecules; and hydrogen "
            "bonding, a strong special case that needs H bonded directly to N, "
            "O or F. Boiling is the act of pulling molecules apart from one "
            "another, so the boiling point measures how strong these forces "
            "are. Solubility follows the same rule, since like dissolves like "
            "means a solvent dissolves a solute when the forces they would make "
            "with each other are comparable to the ones they already have."
        ),
        worked_example=(
            "Ethanol and dimethyl ether have the identical molecular formula "
            "C2H6O and the identical molar mass of 46.07 g/mol, so dispersion "
            "forces are nearly the same for both. Ethanol is CH3CH2OH, with its "
            "hydrogen bonded straight to oxygen, so ethanol molecules hydrogen "
            "bond to each other. Dimethyl ether is CH3OCH3, where both "
            "hydrogens sit on carbon, so the molecule is polar and gets dipole "
            "dipole attraction but cannot hydrogen bond. Predict that ethanol "
            "boils much higher, and the measurement agrees: ethanol boils at "
            "78 C while dimethyl ether boils at -25 C, a gap of about 103 "
            "degrees from one structural difference. Compare that to propane "
            "(-42 C) against butane (-0.5 C), where only dispersion is at work "
            "and adding a whole carbon buys just 42 degrees. Hydrogen bonding "
            "is worth more than a lot of extra mass."
        ),
        try_it_prompt=(
            "Water boils at 100 C and hydrogen sulfide, H2S, boils at -60 C, "
            "even though H2S is the heavier molecule. Which force explains the "
            "160 degree gap, and why does H2S miss out on it?"
        ),
        try_it_answer=(
            "Hydrogen bonding. Water has H bonded directly to oxygen, which "
            "qualifies, while sulfur is not N, O or F, so H2S is limited to "
            "dipole dipole and dispersion despite being heavier."
        ),
        pitfall=(
            "The pitfall is believing that boiling breaks the covalent bonds "
            "inside a molecule. Steam is still made of intact H2O molecules, "
            "not loose H and O atoms. Vaporising water costs about 41 kJ/mol, "
            "while breaking an O-H bond costs about 463 kJ/mol, more than ten "
            "times as much."
        ),
        misconception=None,
        claims=(
            Formula("CCO", "C2H6O", "ethanol, which hydrogen bonds"),
            Formula("COC", "C2H6O", "dimethyl ether, a polar isomer that cannot hydrogen bond"),
            Source(
                "Approximate boiling points: ethanol 78 C, dimethyl ether "
                "-25 C, propane -42 C, butane -0.5 C, water 100 C, hydrogen "
                "sulfide -60 C.",
                CRC + ", tables of boiling points",
            ),
        ),
    ),
    "GEN1.COLLIGATIVE": Lesson(
        node="GEN1.COLLIGATIVE",
        objective=(
            "Calculate freezing point depression and boiling point elevation "
            "from molality and the van't Hoff factor."
        ),
        build_on=(
            "Intermolecular forces told you what dissolves in what, and now you "
            "quantify what the dissolved particles do to the solvent's phase "
            "change temperatures."
        ),
        core_idea=(
            "Salt on an icy road and antifreeze in a car radiator are the same "
            "phenomenon. Colligative properties depend only on how many solute "
            "particles are present, not on what they are, which is why sugar "
            "and salt at equal particle counts do the identical job. The two "
            "you compute are freezing point depression, delta Tf = i * Kf * m, "
            "and boiling point elevation, delta Tb = i * Kb * m. Here m is "
            "molality in moles of solute per kilogram of solvent (not per litre "
            "of solution), Kf for water is 1.86 C/m and Kb for water is 0.512 "
            "C/m, and i is the van't Hoff factor, the number of particles one "
            "formula unit releases. Sugar gives i = 1 because it dissolves "
            "whole, NaCl gives i = 2 because it splits into Na+ and Cl-, and "
            "CaCl2 gives i = 3."
        ),
        worked_example=(
            "Find the freezing point of a radiator mix made from 100.0 g of "
            "ethylene glycol, C2H6O2, in 1.00 kg of water. The molar mass of "
            "C2H6O2 is 2(12.01) + 6(1.008) + 2(16.00) = 62.07 g/mol, so moles = "
            "100.0 g / 62.07 g/mol = 1.611 mol. Molality = 1.611 mol / 1.00 kg "
            "= 1.611 m. Ethylene glycol is a molecular compound that does not "
            "ionise, so i = 1. Then delta Tf = 1 * 1.86 C/m * 1.611 m = 3.00 C. "
            "Freezing point depression means subtract, so the solution freezes "
            "at 0.00 - 3.00 = -3.00 C. Note that grams never entered the "
            "formula directly, only the moles they converted to, which is why "
            "the same 100.0 g of a heavier solute would protect the radiator "
            "less."
        ),
        try_it_prompt=(
            "You dissolve 1.00 mol of NaCl in 1.00 kg of water instead. By how "
            "many degrees does the freezing point drop, and why is it not 1.86 "
            "C?"
        ),
        try_it_answer=(
            "It drops 3.72 C, to -3.72 C, because delta Tf = 2 * 1.86 * 1.00. "
            "NaCl dissociates into two ions, so 1.00 mol of salt puts 2.00 mol "
            "of particles into the water."
        ),
        pitfall=(
            "The pitfall is dropping the van't Hoff factor for ionic solutes. "
            "One mole of CaCl2 in a kilogram of water lowers the freezing point "
            "by 3 * 1.86 = 5.58 C, not 1.86 C, because each formula unit "
            "releases one Ca2+ and two Cl- for a total of three particles."
        ),
        misconception=None,
        claims=(
            Formula("OCCO", "C2H6O2", "ethylene glycol, a nonelectrolyte with i = 1"),
            Source(
                "For water the molal freezing-point depression constant Kf is "
                "1.86 C/m and the boiling-point elevation constant Kb is "
                "0.512 C/m.",
                CRC + ", tables of cryoscopic and ebullioscopic constants",
            ),
        ),
    ),
}
