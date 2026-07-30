"""GEN1 fill D: the missing lessons of Unit 8 (bonding theories) and Unit 9 (gases).

Twelve lessons, one per unauthored node in GEN1-U8 and GEN1-U9, in curriculum
order. Every lesson carries the full six part teaching arc, and the compliance
checker rejects any lesson with an empty part.

These are general chemistry lessons, so most claims tuples are light. The rule
this file follows is the honesty rule from the shared brief: any physical
constant stated as a number in prose carries a Source claim naming a real
reference, or it is replaced by the method taught with symbols. Molecular
formulas that appear get a Formula claim re-derived from structure by RDKit.
"""

from __future__ import annotations

from app.data.claims import Formula, Source
from app.data.lesson_types import Lesson

# Constants cited rather than derived. The checker confirms a citation exists;
# the number itself is the author's responsibility, named here once so a value
# and its citation cannot drift apart across lessons.
R_LATM = Source(
    "The molar gas constant R is 0.08206 L atm/(mol K) when pressure is in "
    "atmospheres, volume in litres, amount in moles and temperature in kelvin.",
    "OpenStax Chemistry 2e, Chapter 9 (Gases), the ideal gas law and the value of R.",
)
R_SI = Source(
    "The molar gas constant R is 8.314 J/(mol K) in SI base units.",
    "OpenStax Chemistry 2e, Chapter 9 (Gases), the value of R in joules.",
)
ATM_DEF = Source(
    "One standard atmosphere is defined as 101325 Pa, which equals 760 mmHg "
    "and 760 torr exactly and about 14.7 psi.",
    "IUPAC Compendium of Chemical Terminology (the Gold Book), entry for standard atmosphere.",
)
VDW_CO2 = Source(
    "Carbon dioxide has van der Waals constants a = 3.640 L^2 atm/mol^2 and "
    "b = 0.04267 L/mol.",
    "CRC Handbook of Chemistry and Physics, table of van der Waals constants of gases.",
)

LESSONS_GEN1_FILL_D: dict[str, Lesson] = {
    "GEN1.VALENCEBOND": Lesson(
        node="GEN1.VALENCEBOND",
        objective=(
            "Describe a covalent bond as the overlap of two atomic orbitals, and say what the "
            "potential energy of the two atoms does as they approach the bond length."
        ),
        build_on=(
            "You can draw a Lewis structure and predict a shape with VSEPR, but neither says what a "
            "bond physically is, and valence bond theory answers that by putting a bond where two "
            "atomic orbitals overlap and share a pair of electrons."
        ),
        core_idea=(
            "Valence bond theory keeps the Lewis picture of a shared electron pair and gives it a "
            "physical location: a bond forms where a half filled orbital on one atom overlaps a half "
            "filled orbital on another, and the shared pair occupies the region where the two "
            "overlap. Bring two hydrogen atoms in from far apart and track their combined potential "
            "energy. At long range they barely feel each other, so the energy is near zero. As the "
            "1s orbitals begin to overlap the electrons feel both nuclei at once, the energy drops, "
            "and it reaches a minimum at one particular separation. Push closer than that and the two "
            "positive nuclei repel hard, so the energy climbs steeply. The separation at the minimum "
            "is the bond length, and the depth of the well below zero is the bond energy, the amount "
            "you must put back in to pull the atoms apart. The more completely the two orbitals "
            "overlap, the deeper the well and the stronger the bond, which is why a bond is drawn "
            "along the line joining the two nuclei, where head on overlap is greatest."
        ),
        worked_example=(
            "Build three single bonds from overlap and compare them. In H2 each hydrogen brings one "
            "electron in a 1s orbital, the two 1s orbitals overlap head on between the nuclei, and "
            "the shared pair sits in that overlap region; this is a sigma bond because the overlap is "
            "symmetric about the bond axis. In HF the hydrogen 1s orbital overlaps a singly filled 2p "
            "orbital on fluorine that points straight at the hydrogen, again head on, again a sigma "
            "bond, and fluorine's three filled 2p and 2s orbitals stay as lone pairs because they are "
            "already full and have no electron to share. In F2 the bond is the overlap of one singly "
            "filled 2p orbital from each fluorine, pointing at each other along the axis. Notice the "
            "pattern: in every case a bond needed one singly occupied orbital from each atom aimed "
            "along the line between them, and a filled orbital cannot form a bond because it has no "
            "room for another atom's electron. That is why fluorine, with one unpaired electron, "
            "forms one bond, and why the noble gases, with no unpaired electrons, form almost none."
        ),
        try_it_prompt=(
            "As two atoms approach and their orbitals begin to overlap, the combined potential energy "
            "first falls and then rises again. What physical event turns the fall into a rise, and "
            "what do we call the separation at the lowest point?"
        ),
        try_it_answer=(
            "The rise begins when the two positively charged nuclei get close enough that their "
            "repulsion outweighs the attraction the shared electrons provide. The separation at the "
            "lowest point is the bond length, and the depth of the well there is the bond energy."
        ),
        pitfall=(
            "The trap is thinking that closer always means more stable, so the atoms should collapse "
            "together. They do not, because the two nuclei carry like charge and repel, and the bond "
            "settles at the length where attraction and repulsion balance rather than at zero "
            "separation."
        ),
        claims=(
            Formula("[H][H]", "H2", "hydrogen, one sigma bond from 1s-1s overlap"),
            Formula("F", "HF", "hydrogen fluoride, 1s-2p overlap"),
            Formula("FF", "F2", "fluorine, 2p-2p overlap"),
        ),
    ),
    "GEN1.HYBRIDIZATION": Lesson(
        node="GEN1.HYBRIDIZATION",
        objective=(
            "Assign the hybridization of a central atom as sp, sp2 or sp3 from the number of electron "
            "groups around it, and connect that label to the geometry VSEPR predicts."
        ),
        build_on=(
            "Valence bond theory said a bond is orbital overlap, but a carbon's four identical bonds "
            "cannot come from three p orbitals and one s orbital that differ in shape and energy, and "
            "hybridization is the fix that makes the overlapping orbitals match the shape VSEPR "
            "already gave you."
        ),
        core_idea=(
            "An isolated carbon atom has one 2s and three 2p orbitals, which are not all alike, yet "
            "the four C-H bonds in methane are identical and point to the corners of a tetrahedron. "
            "Hybridization resolves the mismatch by mixing the atomic orbitals on the bonding atom "
            "into a new set of equivalent orbitals aimed where the bonds go. Mixing the 2s with all "
            "three 2p orbitals makes four sp3 orbitals pointing to the corners of a tetrahedron, "
            "about 109.5 degrees apart. Mixing the 2s with two 2p orbitals makes three sp2 orbitals "
            "in a plane 120 degrees apart, leaving one unmixed p orbital. Mixing the 2s with one 2p "
            "makes two sp orbitals pointing 180 degrees apart, leaving two unmixed p orbitals. The "
            "count that decides which case you are in is the number of electron groups around the "
            "atom, where a group is a bond, whether single, double or triple, or a lone pair. Four "
            "groups means sp3, three groups means sp2, two groups means sp, so hybridization is read "
            "off the same electron group count that VSEPR uses for shape, which is why the two "
            "always agree."
        ),
        worked_example=(
            "Assign the central atom in three molecules. In methane, CH4, the carbon has four bonding "
            "groups and no lone pairs, so four electron groups, which is sp3, and the geometry is "
            "tetrahedral with angles near 109.5 degrees, exactly what VSEPR gives. In boron "
            "trifluoride, BF3, the boron has three bonding groups and no lone pair, so three electron "
            "groups, which is sp2, and the molecule is trigonal planar at 120 degrees, with one empty "
            "unhybridized p orbital left on boron. In ethyne, HC-CH, look at either carbon: it bonds "
            "to one hydrogen and to the other carbon, so two electron groups, which is sp, and those "
            "two sigma bonds point 180 degrees apart, making the four atom molecule linear. Each of "
            "those carbons keeps two unhybridized p orbitals, and those leftover p orbitals are what "
            "the triple bond will use. The method never changed: count electron groups, map four to "
            "sp3, three to sp2, two to sp, and the angle follows."
        ),
        try_it_prompt=(
            "In an ammonia molecule, NH3, the nitrogen has three bonds to hydrogen and one lone pair. "
            "How many electron groups is that, what hybridization does it give, and why does the lone "
            "pair count?"
        ),
        try_it_answer=(
            "Four electron groups, which gives sp3. A lone pair counts because it too occupies a "
            "hybrid orbital and takes up space, so nitrogen mixes all four of its 2s and 2p orbitals; "
            "three sp3 orbitals hold bonds and the fourth holds the lone pair."
        ),
        pitfall=(
            "The trap is counting atoms bonded rather than electron groups, which drops every lone "
            "pair. Water's oxygen bonds to only two hydrogens, and counting bonds alone suggests sp, "
            "but the oxygen also carries two lone pairs, giving four electron groups and sp3, which "
            "is why water is bent near 104.5 degrees rather than linear."
        ),
        claims=(
            Formula("C", "CH4", "methane, sp3 carbon"),
            Formula("FB(F)F", "BF3", "boron trifluoride, sp2 boron"),
            Formula("C#C", "C2H2", "ethyne, sp carbons"),
        ),
    ),
    "GEN1.SIGMAPI": Lesson(
        node="GEN1.SIGMAPI",
        objective=(
            "Count the sigma and pi bonds in a single, double or triple bond, and explain why a "
            "double bond resists rotation while a single bond turns freely."
        ),
        build_on=(
            "Hybridization left some p orbitals unmixed on sp2 and sp carbons, and this lesson uses "
            "those leftover p orbitals to build the second and third parts of a multiple bond."
        ),
        core_idea=(
            "There are two ways for orbitals to overlap, and they give bonds with different shapes. "
            "A sigma bond comes from head on overlap along the line joining the two nuclei, so its "
            "electron density is cylindrically symmetric about that axis; every single bond is one "
            "sigma bond. A pi bond comes from side by side overlap of two parallel p orbitals, one on "
            "each atom, so its electron density sits in two lobes above and below the bond axis rather "
            "than on it. A double bond is one sigma plus one pi, and a triple bond is one sigma plus "
            "two pi, which is why the first bond between two atoms is always sigma and the extra bonds "
            "are pi. The pi bond is what locks rotation. To rotate one end of a double bond relative "
            "to the other you would have to twist the two parallel p orbitals out of alignment, and "
            "sideways overlap falls to zero when they are perpendicular, so rotating breaks the pi "
            "bond. That costs an energy close to the strength of the pi bond, far more than the "
            "thermal energy available at room temperature, so the double bond holds its geometry. A "
            "single bond has no pi component, so turning it changes nothing about the overlap and it "
            "spins freely."
        ),
        worked_example=(
            "Count the bonds in ethane, ethene and ethyne. In ethane, H3C-CH3, the carbon to carbon "
            "bond is a single bond, so it is one sigma bond and nothing else, and because there is no "
            "pi bond the two methyl groups rotate past each other freely at room temperature. In "
            "ethene, H2C=CH2, the carbon to carbon connection is a double bond, so it is one sigma "
            "bond plus one pi bond formed by the leftover p orbital on each sp2 carbon; the pi bond "
            "holds all six atoms in one plane and blocks rotation, which is exactly why cis and trans "
            "isomers of substituted alkenes are different, non interconverting compounds. In ethyne, "
            "HC-CH, the carbon to carbon connection is a triple bond, one sigma plus two pi bonds "
            "using both leftover p orbitals on each sp carbon, and those two pi bonds wrap the axis in "
            "a cylinder of electron density that makes the molecule linear. The running total is "
            "clean: a single bond is one sigma, a double is one sigma and one pi, a triple is one "
            "sigma and two pi."
        ),
        try_it_prompt=(
            "A carbon to nitrogen triple bond appears in hydrogen cyanide. How many sigma bonds and "
            "how many pi bonds make up that triple bond, and which one forms first?"
        ),
        try_it_answer=(
            "One sigma bond and two pi bonds. The sigma bond forms first from head on overlap along "
            "the axis, and the two pi bonds come from side by side overlap of the two remaining p "
            "orbitals on each atom."
        ),
        pitfall=(
            "The trap is expecting a double bond to rotate freely because a single bond does. The "
            "extra pi bond in a double bond is destroyed by rotation, since twisting misaligns the "
            "parallel p orbitals until their sideways overlap vanishes, so the double bond stays "
            "planar and its geometric isomers do not interconvert on their own."
        ),
        claims=(
            Formula("CC", "C2H6", "ethane, one sigma C-C bond"),
            Formula("C=C", "C2H4", "ethene, sigma plus pi"),
            Formula("C#C", "C2H2", "ethyne, sigma plus two pi"),
        ),
    ),
    "GEN1.MOTHEORY": Lesson(
        node="GEN1.MOTHEORY",
        objective=(
            "Combine two atomic orbitals into a bonding and an antibonding molecular orbital, and "
            "compute a bond order from how many electrons land in each."
        ),
        build_on=(
            "Valence bond theory localized every electron pair between two atoms, and molecular "
            "orbital theory starts from the same atomic orbitals but lets the resulting orbitals "
            "spread over the whole molecule, which is what you need for the cases valence bond "
            "cannot explain."
        ),
        core_idea=(
            "When two atomic orbitals combine they do not disappear; they turn into two molecular "
            "orbitals, one lower in energy than the originals and one higher. The lower one is the "
            "bonding orbital, where the two atomic waves add and pile electron density between the "
            "nuclei, so filling it glues the atoms together. The higher one is the antibonding "
            "orbital, where the two waves subtract and leave a node between the nuclei, so filling it "
            "pulls the atoms apart. The count of orbitals is conserved: two atomic orbitals in, two "
            "molecular orbitals out. Electrons fill these molecular orbitals from the bottom up, and "
            "the payoff of the whole scheme is a single number, the bond order, defined as the "
            "bonding electrons minus the antibonding electrons, all divided by two. A bond order of "
            "one is a single bond, two is a double, three is a triple, and a bond order of zero means "
            "no net bond and therefore no stable molecule. Because it counts fractional cases too, it "
            "predicts bonds that a Lewis structure of dots cannot draw."
        ),
        worked_example=(
            "Work three of the simplest cases from their electron counts. In H2 each hydrogen brings "
            "one electron, so two electrons total, and both drop into the bonding sigma orbital made "
            "from the two 1s orbitals; the antibonding orbital stays empty. Bond order is bonding "
            "minus antibonding over two, which is two minus zero over two, equal to one, so H2 has a "
            "single bond, matching the Lewis picture. Now try He2. Each helium brings two electrons, "
            "so four total: two fill the bonding orbital and the next two are forced into the "
            "antibonding orbital. Bond order is two minus two over two, equal to zero, so there is no "
            "net bond and He2 does not exist as a molecule, which is why helium is a monatomic gas. "
            "Finally the cation H2 with a plus charge, which has a single electron in the bonding "
            "orbital and none antibonding. Bond order is one minus zero over two, equal to one half, "
            "so this ion is held together by half a bond, weaker than H2 but real. Valence bond "
            "theory, which needs a shared pair, has no comfortable way to describe a one electron "
            "bond, and molecular orbital theory hands you its bond order without strain."
        ),
        try_it_prompt=(
            "A hypothetical He2 with a plus one charge would have three electrons. Two go into the "
            "bonding orbital and one into the antibonding orbital. What is its bond order, and is the "
            "ion held together at all?"
        ),
        try_it_answer=(
            "Bond order is two minus one over two, which is one half, so the ion is bound by half a "
            "bond and does hold together, unlike neutral He2, whose fourth electron fills the "
            "antibonding orbital and cancels the bond entirely."
        ),
        pitfall=(
            "The trap is assuming every pair of atoms that can share electrons forms a molecule. "
            "Helium atoms have full 1s orbitals, and combining them fills the bonding and antibonding "
            "orbitals equally, giving a bond order of zero, so no amount of pushing two helium atoms "
            "together makes a stable He2."
        ),
        claims=(
            Formula("[H][H]", "H2", "bond order one from two bonding electrons"),
        ),
    ),
    "GEN1.MODIAGRAMS": Lesson(
        node="GEN1.MODIAGRAMS",
        objective=(
            "Fill the valence molecular orbital diagram of a second row diatomic to find its bond "
            "order and predict whether it is paramagnetic or diamagnetic."
        ),
        build_on=(
            "You know bonding and antibonding orbitals come from combining atomic orbitals and that "
            "bond order counts the difference, and filling a full diagram in energy order is how you "
            "turn that idea into a prediction of stability and magnetism."
        ),
        core_idea=(
            "For a second row diatomic the 2s and 2p orbitals of the two atoms combine into a ladder "
            "of molecular orbitals: a bonding sigma2s and antibonding sigma2s from the 2s pair, then "
            "from the six 2p orbitals a bonding sigma2p, a pair of degenerate bonding pi2p, a pair of "
            "degenerate antibonding pi2p, and an antibonding sigma2p. Electrons fill this ladder from "
            "the bottom, two per orbital, and when they reach a degenerate pair they spread out one "
            "to each before pairing, the same Hund behavior you used for atoms. The diagram delivers "
            "two predictions at once. Bond order is again bonding minus antibonding over two, and the "
            "magnetism follows from whether any orbital ends up with a single unpaired electron: an "
            "unpaired electron makes the molecule paramagnetic and drawn to a magnetic field, while "
            "all electrons paired makes it diamagnetic and weakly pushed away. One wrinkle matters "
            "for the lighter members boron, carbon and nitrogen, where the sigma2p sits above the "
            "pi2p pair rather than below it; for oxygen and fluorine the sigma2p drops below the pi2p. "
            "This is the theory's most celebrated result, because the dot structure of oxygen shows "
            "all electrons paired and predicts the wrong magnetism."
        ),
        worked_example=(
            "Fill oxygen, O2, which has twelve valence electrons, six from each atom, using the "
            "oxygen ordering with sigma2p below the pi2p pair. Place them from the bottom: two in "
            "sigma2s bonding, two in antibonding sigma2s, two in bonding sigma2p, four filling both "
            "bonding pi2p orbitals, and that leaves two electrons for the antibonding pi2p pair. Those "
            "last two go one into each of the two degenerate antibonding pi2p orbitals and stay "
            "unpaired by Hund's rule. Count for bond order: bonding electrons are two in sigma2s, two "
            "in sigma2p and four in pi2p, which is eight; antibonding electrons are two in sigma2s "
            "star and two in pi2p star, which is four. Bond order is eight minus four over two, equal "
            "to two, a double bond, matching the Lewis picture. But the magnetism does not match the "
            "Lewis picture: the diagram leaves two unpaired electrons, so O2 is paramagnetic, and "
            "liquid oxygen poured near a strong magnet clings to the poles, a demonstration a dot "
            "structure predicting all pairs cannot explain."
        ),
        try_it_prompt=(
            "Nitrogen, N2, has ten valence electrons and uses the ordering with the pi2p pair below "
            "sigma2p. Fill the diagram to find its bond order, and say whether it is paramagnetic or "
            "diamagnetic."
        ),
        try_it_answer=(
            "Bond order three, and diamagnetic. Filling gives two in sigma2s, two in antibonding "
            "sigma2s, four in the pi2p pair and two in sigma2p; bonding is eight and antibonding is "
            "two, so bond order is eight minus two over two, which is three, and every electron is "
            "paired, so N2 is diamagnetic."
        ),
        pitfall=(
            "The trap is trusting the Lewis structure for magnetism. Oxygen drawn as O=O shows two "
            "lone pairs on each atom and no unpaired electrons, predicting a diamagnetic molecule, "
            "yet oxygen is paramagnetic, and only the molecular orbital diagram, with its two "
            "unpaired antibonding pi2p electrons, gets that right."
        ),
        claims=(
            Formula("O=O", "O2", "bond order two, paramagnetic"),
            Formula("N#N", "N2", "bond order three, diamagnetic"),
            Formula("FF", "F2", "bond order one, diamagnetic"),
        ),
    ),
    "GEN1.PRESSURE": Lesson(
        node="GEN1.PRESSURE",
        objective=(
            "Define gas pressure as force per unit area, describe what a mercury barometer measures, "
            "and convert a pressure among atmospheres, mmHg or torr, and kilopascals."
        ),
        build_on=(
            "You learned to carry units through a calculation with dimensional analysis, and pressure "
            "is the first quantity in this unit that comes in a confusing number of units, so the "
            "same cancellation keeps them straight."
        ),
        core_idea=(
            "Pressure is force spread over an area, force divided by area, and a gas exerts it because "
            "its molecules strike the walls of the container and each collision pushes outward. The "
            "SI unit is the pascal, one newton per square metre, which is a small amount of pressure, "
            "so real measurements use larger units. A mercury barometer is a sealed tube of mercury "
            "inverted over a dish, and the atmosphere pressing down on the dish holds a column of "
            "mercury up the tube; the height of that column is a direct readout of atmospheric "
            "pressure, which is why pressures are quoted in millimetres of mercury, mmHg, with one "
            "mmHg also called one torr. These units are tied together by definition rather than by "
            "measurement. One standard atmosphere is set equal to 101325 Pa, which is 101.325 kPa, "
            "and also to 760 mmHg, which is 760 torr, and roughly 14.7 psi. Because those are fixed "
            "conversion factors, moving between them is the same cancellation you already do: multiply "
            "by the factor that removes the unit you have and leaves the one you want."
        ),
        worked_example=(
            "A barometer in a lab reads a column height of 745 mmHg, and you want that pressure in "
            "atmospheres and in kilopascals. Start from the definition that 760 mmHg equals 1 atm "
            "exactly, and write the factor so mmHg cancels: 745 mmHg times (1 atm / 760 mmHg) equals "
            "0.980 atm. Now go to kilopascals using the definition that 1 atm equals 101.325 kPa: "
            "0.980 atm times (101.325 kPa / 1 atm) equals 99.3 kPa. Check the units at each step, "
            "because mmHg cancelled against mmHg to leave atm, and atm cancelled against atm to leave "
            "kPa, which is what you wanted. Notice that 745 mmHg is a little under one atmosphere, and "
            "the answers, 0.980 atm and 99.3 kPa, both sit a little under their standard values of "
            "1 atm and 101.325 kPa, which is the sanity check that you did not flip a factor. The "
            "measured reading has three significant figures, and the conversion factors are exact "
            "definitions that do not limit anything, so the answers keep three figures."
        ),
        try_it_prompt=(
            "A weather report gives the pressure as 1.02 atm. Convert that to mmHg using the "
            "definition that 1 atm equals 760 mmHg, and say how many significant figures the answer "
            "may carry."
        ),
        try_it_answer=(
            "About 775 mmHg. Multiplying 1.02 atm by (760 mmHg / 1 atm) gives 775.2, reported as "
            "775 mmHg. The 760 is an exact definition, so the three significant figures in the "
            "measured 1.02 atm set the limit."
        ),
        pitfall=(
            "The trap is treating millimetres of mercury as a length rather than a pressure. The "
            "number is a column height, but it stands for the pressure that holds that column up, so "
            "745 mmHg on a barometer is not a distance to add to anything; it is a pressure to convert "
            "with the fixed factor 760 mmHg per atmosphere."
        ),
        claims=(
            ATM_DEF,
        ),
    ),
    "GEN1.SIMPLEGASLAWS": Lesson(
        node="GEN1.SIMPLEGASLAWS",
        objective=(
            "State Boyle's, Charles's and Avogadro's laws as proportionalities, and use each one to "
            "find a final pressure, volume or temperature after a change."
        ),
        build_on=(
            "Now that you can measure and convert a pressure, you can watch how a fixed sample of gas "
            "trades its pressure, volume and temperature against one another when you change one and "
            "hold the rest fixed."
        ),
        core_idea=(
            "A gas has four handles: pressure P, volume V, temperature T and amount in moles n. Hold "
            "two of them fixed and the other two move together in a simple way, and each of these "
            "pairings has a name. Boyle's law holds temperature and amount fixed and finds that "
            "pressure and volume are inversely proportional, so squeezing a gas into half the volume "
            "doubles its pressure, and P times V stays constant. Charles's law holds pressure and "
            "amount fixed and finds volume directly proportional to temperature, so heating a gas "
            "expands it and V divided by T stays constant. Avogadro's law holds pressure and "
            "temperature fixed and finds volume directly proportional to the number of moles, so "
            "adding gas at the same conditions swells the volume in step. Two cautions make these "
            "work. Temperature must be in kelvin, because the proportionality is to absolute "
            "temperature and 0 K, at minus 273.15 degrees C, is where an ideal gas would reach zero "
            "volume; using Celsius breaks the ratio. And each law is one face of a single combined "
            "relationship, so they are not three separate facts to memorize but three slices of how "
            "one sample of gas behaves."
        ),
        worked_example=(
            "Compress a gas, then heat it, keeping the amount fixed throughout, and use round numbers "
            "chosen to make the arithmetic clean rather than because they were measured. Start with "
            "2.00 L at 1.00 atm and squeeze it at constant temperature to 0.500 L. This is Boyle's "
            "law, so P1 times V1 equals P2 times V2, and solving for the new pressure gives P2 equals "
            "(1.00 atm times 2.00 L) divided by 0.500 L, which is 4.00 atm; the volume fell to one "
            "quarter, so the pressure rose four fold, the inverse relationship in action. Now hold "
            "that 0.500 L sample at constant pressure and heat it from 273 K to 546 K. This is "
            "Charles's law, so V1 divided by T1 equals V2 divided by T2, and the new volume is "
            "0.500 L times (546 K / 273 K), which is 1.00 L; doubling the absolute temperature "
            "doubled the volume. The check in both steps is the direction: Boyle's law made a smaller "
            "volume raise the pressure, and Charles's law made a higher temperature raise the volume, "
            "each matching the proportionality before any number was plugged in."
        ),
        try_it_prompt=(
            "A balloon holds 4.0 L at 300 K. You warm it at constant pressure until the temperature "
            "reaches 600 K. Using Charles's law, what is the new volume, and why must you use kelvin?"
        ),
        try_it_answer=(
            "8.0 L. Charles's law gives V2 equals 4.0 L times (600 K / 300 K), which is 8.0 L, so "
            "doubling the absolute temperature doubles the volume. Kelvin is required because the "
            "volume is proportional to absolute temperature, and a ratio built from Celsius, where "
            "zero is not the true zero of the scale, gives the wrong factor."
        ),
        pitfall=(
            "The trap is plugging temperatures in Celsius into Charles's law. Going from 10 degrees C "
            "to 20 degrees C is not a doubling of temperature; in kelvin it is 283 K to 293 K, a rise "
            "of only about 4 percent, so the volume grows by about 4 percent, not by a factor of two "
            "as the Celsius numbers would wrongly suggest."
        ),
        claims=(
            Source(
                "The named gas laws of Boyle, Charles and Avogadro as stated here.",
                "OpenStax Chemistry 2e chapter 9",
            ),
        ),
    ),
    "GEN1.GASDENSITY": Lesson(
        node="GEN1.GASDENSITY",
        objective=(
            "Rearrange the ideal gas law into a relation among density, molar mass, pressure and "
            "temperature, and use a measured gas density to find an unknown molar mass."
        ),
        build_on=(
            "The ideal gas law relates pressure, volume, temperature and moles, and rearranging it to "
            "bring in mass turns a density you can measure on a balance into the molar mass of an "
            "unknown gas."
        ),
        core_idea=(
            "Moles are mass divided by molar mass, n equals m over M, and substituting that into the "
            "ideal gas law P V equals n R T lets you trade the invisible mole count for a mass you "
            "can weigh. Doing the algebra gives P M equals d R T, where d is the density, mass over "
            "volume, so density equals P M divided by R T. Read that relation for what it says about "
            "gases: at a fixed temperature and pressure a gas is denser when its molecules are "
            "heavier, which is why carbon dioxide sinks and helium rises, and a gas gets less dense "
            "as you heat it because raising T on the bottom shrinks the ratio. The relation is most "
            "useful run backwards. Solve for molar mass, M equals d R T over P, and it becomes an "
            "identification tool: weigh a known volume of an unknown gas at a measured temperature "
            "and pressure to get its density, and the molar mass drops out, often enough to name the "
            "gas. R here is the gas constant, and you keep it and the units consistent, atmospheres "
            "with litres and kelvin, so everything cancels to grams per mole."
        ),
        worked_example=(
            "An unknown gas is found to have a density of 1.96 g/L at 1.00 atm and 273 K, and you "
            "want its molar mass. Use M equals d R T over P, with R as 0.08206 L atm/(mol K) so that "
            "the atmospheres, litres and kelvin all cancel. Substitute: M equals (1.96 g/L times "
            "0.08206 L atm/(mol K) times 273 K) divided by 1.00 atm. Work the top first: 1.96 times "
            "0.08206 is 0.1608, and times 273 is 43.9, carrying units of g atm per mol. Divide by "
            "1.00 atm and the atmospheres cancel, leaving 43.9 g/mol. Check the units landed right, "
            "since g/L times L atm/(mol K) times K over atm leaves g/mol, which is what a molar mass "
            "must be. A molar mass near 44 g/mol points to carbon dioxide, whose molar mass built "
            "from the periodic table is 12.01 plus two times 16.00, equal to 44.01 g/mol, so the "
            "unknown is consistent with CO2. The density was a measurement given for this sample, and "
            "the value of R is the one cited quantity in the calculation."
        ),
        try_it_prompt=(
            "A gas has a density of 0.714 g/L at 1.00 atm and 273 K. Using M equals d R T over P with "
            "R as 0.08206 L atm/(mol K), estimate its molar mass and suggest what the gas might be."
        ),
        try_it_answer=(
            "About 16 g/mol. M equals (0.714 times 0.08206 times 273) divided by 1.00, which is "
            "16.0 g/mol, matching methane, CH4, whose molar mass is 12.01 plus four times 1.008, "
            "equal to 16.04 g/mol."
        ),
        pitfall=(
            "The trap is leaving temperature in Celsius or mixing unit systems. The relation only "
            "cancels to grams per mole when temperature is in kelvin and R matches the pressure and "
            "volume units, so a density in g/L with pressure in atm demands R as 0.08206 L atm/(mol K) "
            "and T in kelvin, not 0 degrees C."
        ),
        claims=(
            R_LATM,
            Formula("O=C=O", "CO2", "carbon dioxide, molar mass near 44 g/mol"),
        ),
    ),
    "GEN1.GASSTOICH": Lesson(
        node="GEN1.GASSTOICH",
        objective=(
            "Solve a stoichiometry problem in which a reactant or product is a gas by connecting the "
            "mole ratio to a gas volume through the ideal gas law."
        ),
        build_on=(
            "You can balance an equation and convert grams to moles, and the ideal gas law adds one "
            "more conversion so that a volume of gas can enter or leave a mole ratio at a stated "
            "temperature and pressure."
        ),
        core_idea=(
            "Every stoichiometry problem runs through moles, because the balanced equation gives a "
            "ratio of moles, not of grams or litres. When a species is a solid or a solute you reach "
            "its moles through molar mass or molarity, and when a species is a gas you reach its "
            "moles through the ideal gas law, P V equals n R T. So the whole method is a chain with "
            "moles at the centre: convert what you are given into moles, cross the balanced equation "
            "by the mole ratio to get moles of what you want, then convert those moles into the unit "
            "the question asks for. If the target is a gas volume, you rearrange the ideal gas law to "
            "V equals n R T over P and finish there, and if the target is a mass you use molar mass "
            "instead. The gas law does not replace stoichiometry; it is one more conversion factor "
            "hung on the end or the front of the same mole bridge, and it is the factor that lets a "
            "volume you can read off a syringe stand in for a number of particles."
        ),
        worked_example=(
            "Heating limestone drives off carbon dioxide by the balanced reaction CaCO3 gives CaO "
            "plus CO2, and you want the volume of CO2 produced when 10.0 g of calcium carbonate fully "
            "decomposes at 1.00 atm and 273 K. First reach moles of the solid you were given: the "
            "molar mass of CaCO3 from the periodic table is 40.08 plus 12.01 plus three times 16.00, "
            "equal to 100.09 g/mol, so 10.0 g divided by 100.09 g/mol is 0.0999 mol of CaCO3. Cross "
            "the equation next; the ratio of CaCO3 to CO2 is one to one, so 0.0999 mol of CaCO3 gives "
            "0.0999 mol of CO2. Now convert those moles of gas to a volume with the ideal gas law "
            "rearranged to V equals n R T over P, using R as 0.08206 L atm/(mol K): V equals "
            "(0.0999 mol times 0.08206 L atm/(mol K) times 273 K) divided by 1.00 atm, which is "
            "2.24 L of CO2. The units cancel down to litres, and the chain never left the mole "
            "bridge: grams to moles, moles to moles by the ratio, moles to litres by the gas law."
        ),
        try_it_prompt=(
            "Using the same reaction, CaCO3 gives CaO plus CO2, how many litres of CO2 at 1.00 atm "
            "and 273 K come from 0.0500 mol of CaCO3? Use R as 0.08206 L atm/(mol K)."
        ),
        try_it_answer=(
            "About 1.12 L. The one to one ratio gives 0.0500 mol of CO2, and V equals (0.0500 times "
            "0.08206 times 273) divided by 1.00, which is 1.12 L."
        ),
        pitfall=(
            "The trap is applying the gas law to the wrong species or skipping the mole ratio. The "
            "ideal gas law converts between moles and volume only for the gas itself, so you must "
            "first carry the given amount across the balanced equation to moles of that gas; using "
            "the moles of the solid reactant directly in P V equals n R T answers a question the "
            "problem never asked."
        ),
        claims=(
            R_LATM,
            Formula("O=C=O", "CO2", "carbon dioxide released by decomposition"),
        ),
    ),
    "GEN1.KMT": Lesson(
        node="GEN1.KMT",
        objective=(
            "State the assumptions of kinetic molecular theory, and use them to explain why gas "
            "pressure and temperature behave as the gas laws say."
        ),
        build_on=(
            "The gas laws told you how pressure, volume and temperature relate without saying why, "
            "and kinetic molecular theory is the particle picture that derives those same "
            "relationships from what the molecules are doing."
        ),
        core_idea=(
            "Kinetic molecular theory models a gas as a huge number of tiny molecules in constant "
            "random motion, and rests on a few assumptions: the molecules are so small compared with "
            "the space between them that their own volume is negligible, they neither attract nor "
            "repel one another between collisions, their collisions with each other and the walls are "
            "perfectly elastic so no kinetic energy is lost, and the average kinetic energy of the "
            "collection is proportional to the absolute temperature. From this picture the gas laws "
            "fall out as consequences rather than as separate facts. Pressure is the summed force of "
            "countless molecules striking the walls, so packing the same molecules into a smaller "
            "volume makes them hit the walls more often and raises the pressure, which is Boyle's "
            "law. Heating the gas raises the average kinetic energy, so the molecules move faster and "
            "strike harder and more often, which is why a sealed can heated on a stove builds "
            "pressure. One subtlety is that temperature fixes the average kinetic energy of the "
            "molecules, not their common speed, so at the same temperature a heavier molecule must "
            "move slower to carry the same kinetic energy that a lighter one carries at higher speed. "
            "The root mean square speed captures this, and it equals the square root of 3 R T divided "
            "by M, the molar mass, showing speed rising with temperature and falling with mass."
        ),
        worked_example=(
            "Find the root mean square speed of nitrogen molecules at 300 K to see the size of the "
            "numbers the theory predicts. Use the root mean square speed equal to the square root of "
            "3 R T over M, with R in SI units as 8.314 J/(mol K) and the molar mass of N2 in "
            "kilograms per mole, since a joule is a kg m^2/s^2 and only kg/mol makes the units come "
            "out as metres per second. The molar mass of N2 from the periodic table is 28.02 g/mol, "
            "which is 0.02802 kg/mol. Build the inside first: 3 times 8.314 times 300 is 7482.6, and "
            "dividing by 0.02802 gives about 267000, in units of m^2/s^2. Take the square root to get "
            "about 517 m/s. That is roughly 1900 km/h, faster than sound, which fits the picture of a "
            "gas as molecules racing and colliding billions of times a second; the pressure you feel "
            "is the blur of all those impacts. The molar mass came from the periodic table and the "
            "one cited quantity is R, and holding R and T fixed while changing M would slide this "
            "speed up for a lighter gas and down for a heavier one."
        ),
        try_it_prompt=(
            "Two gases, helium and oxygen, sit in the same room at the same temperature. Which has "
            "the greater average kinetic energy per molecule, and which has the greater average "
            "speed?"
        ),
        try_it_answer=(
            "They have equal average kinetic energy, because average kinetic energy depends only on "
            "temperature and the two share a temperature. Helium has the greater average speed, since "
            "it is much lighter, and the root mean square speed rises as molar mass falls when "
            "temperature is fixed."
        ),
        pitfall=(
            "The trap is equating temperature with speed rather than with kinetic energy. At one "
            "temperature all gases share the same average kinetic energy, not the same speed, so a "
            "light molecule and a heavy molecule at the same temperature move at very different "
            "speeds while carrying the same average kinetic energy."
        ),
        claims=(
            R_SI,
            Formula("N#N", "N2", "nitrogen, molar mass 28.02 g/mol"),
        ),
    ),
    "GEN1.EFFUSION": Lesson(
        node="GEN1.EFFUSION",
        objective=(
            "Use Graham's law to compare the effusion or diffusion rates of two gases from their "
            "molar masses, and state which gas is faster."
        ),
        build_on=(
            "Kinetic molecular theory said temperature fixes the average kinetic energy rather than "
            "the speed, and this lesson follows that one step to its consequence, that lighter "
            "molecules must move and escape faster than heavier ones at the same temperature."
        ),
        core_idea=(
            "Effusion is the escape of gas molecules one at a time through a tiny hole into a vacuum, "
            "and diffusion is the spreading of one gas through another; both are governed by how fast "
            "the molecules move. Since two gases at the same temperature share the same average "
            "kinetic energy, and kinetic energy is one half the mass times the speed squared, the "
            "lighter gas must be moving faster to match the heavier gas's energy. Working the algebra "
            "through gives Graham's law: the rate of effusion is inversely proportional to the square "
            "root of the molar mass, so the ratio of the rates of two gases equals the square root of "
            "the inverse ratio of their molar masses. Written as a formula, rate of gas 1 over rate "
            "of gas 2 equals the square root of M2 over M1, with the heavier gas's mass on top when "
            "you want the lighter gas's advantage. Because it is a ratio, no gas constant and no "
            "temperature appear; the two cancel out, leaving only the two molar masses. The square "
            "root softens the effect, so a gas four times heavier effuses only half as fast, not one "
            "quarter as fast, which is a useful check on any answer."
        ),
        worked_example=(
            "Compare how fast helium and oxygen effuse through the same pinhole at the same "
            "temperature. Their molar masses from the periodic table are 4.00 g/mol for helium and "
            "32.00 g/mol for O2. Graham's law says the rate of helium over the rate of oxygen equals "
            "the square root of the oxygen mass over the helium mass, so it is the square root of "
            "32.00 divided by 4.00, which is the square root of 8, equal to about 2.83. So helium "
            "effuses about 2.83 times as fast as oxygen, and a helium balloon goes soft faster than a "
            "balloon of heavier gas for exactly this reason. Sanity check the direction against the "
            "physics before trusting the number: helium is the lighter gas, so it should be the "
            "faster one, and the ratio came out greater than one with helium on top, which agrees. "
            "Had you put the masses in upside down you would have gotten about 0.35 and concluded the "
            "light gas was slower, and that clash with the physics is the signal to flip the ratio."
        ),
        try_it_prompt=(
            "Hydrogen has a molar mass of about 2.0 g/mol and methane about 16 g/mol. How many times "
            "faster does hydrogen effuse than methane through the same opening at the same "
            "temperature?"
        ),
        try_it_answer=(
            "About 2.8 times faster. Graham's law gives the rate of hydrogen over the rate of methane "
            "as the square root of 16 divided by 2.0, which is the square root of 8, about 2.83, and "
            "hydrogen is the lighter gas, so it should indeed be the faster one."
        ),
        pitfall=(
            "The trap is making the rate proportional to the molar mass itself instead of to the "
            "inverse square root. A gas four times heavier does not effuse four times slower; the "
            "square root cuts the factor to two, so a heavier gas is slower but by less than the mass "
            "ratio alone would suggest."
        ),
        claims=(
            Formula("[He]", "He", "helium, molar mass 4.00 g/mol"),
            Formula("O=O", "O2", "oxygen, molar mass 32.00 g/mol"),
        ),
    ),
    "GEN1.REALGASES": Lesson(
        node="GEN1.REALGASES",
        objective=(
            "Explain the two assumptions of the ideal gas law that real gases break, and use the van "
            "der Waals equation to see how each correction shifts the predicted pressure."
        ),
        build_on=(
            "The ideal gas law assumed molecules have no volume and no attractions, and kinetic "
            "molecular theory built those two assumptions in, but real gases break both, and the van "
            "der Waals equation adds one correction for each."
        ),
        core_idea=(
            "The ideal gas law works well at low pressure and high temperature, where molecules are "
            "far apart and fast, but it drifts off at high pressure and low temperature, where two of "
            "its assumptions fail. First, real molecules take up space, so the volume free for them "
            "to move in is less than the container volume, an error that matters when the gas is "
            "compressed and the molecules fill a real fraction of the room. Second, real molecules "
            "attract one another, so a molecule about to hit the wall is tugged back by its "
            "neighbors, and it strikes with slightly less force, lowering the measured pressure below "
            "the ideal prediction. The van der Waals equation patches both. It reads (P plus a n^2 "
            "over V^2) times (V minus n b) equals n R T, where the term n b subtracts the volume the "
            "molecules themselves occupy, with b larger for bigger molecules, and the term a n^2 over "
            "V^2 adds back the pressure that attractions stole, with a larger for stickier molecules. "
            "Both a and b are measured constants tabulated for each gas rather than universal numbers, "
            "and as the volume grows large and the density falls, both corrections shrink toward zero "
            "and the equation collapses back to the ideal gas law, which is why the ideal law is the "
            "low pressure limit of the real one."
        ),
        worked_example=(
            "Compare the ideal and van der Waals pressures for 1.00 mol of carbon dioxide squeezed "
            "into 1.00 L at 273 K, using R as 0.08206 L atm/(mol K) and the tabulated constants for "
            "CO2, a equal to 3.640 L^2 atm/mol^2 and b equal to 0.04267 L/mol. The ideal law predicts "
            "P equals n R T over V, which is (1.00 times 0.08206 times 273) divided by 1.00, equal to "
            "22.4 atm. Now the van der Waals pressure, solved for P as n R T over (V minus n b) minus "
            "a n^2 over V^2. The corrected volume is V minus n b equals 1.00 minus 0.04267, which is "
            "0.9573 L, so the first term is 22.40 divided by 0.9573, equal to 23.40 atm. The "
            "attraction term is a n^2 over V^2 equals 3.640 times 1.00 over 1.00, equal to 3.64 atm. "
            "Subtract: 23.40 minus 3.64 gives 19.8 atm. So the real pressure, about 19.8 atm, is "
            "lower than the ideal 22.4 atm, because at this density the pull between CO2 molecules "
            "wins out over the volume correction and softens their impacts on the wall. The cited "
            "quantities here are R and the two van der Waals constants for CO2."
        ),
        try_it_prompt=(
            "The van der Waals term a n^2 over V^2 is added to the measured pressure, and the term "
            "n b is subtracted from the volume. Which correction accounts for molecular attractions "
            "and which for the volume the molecules occupy?"
        ),
        try_it_answer=(
            "The a term accounts for attractions, since it restores the pressure that intermolecular "
            "pull removed by tugging wall bound molecules back. The b term accounts for molecular "
            "volume, since it removes the space the molecules themselves fill from the volume "
            "available for motion."
        ),
        pitfall=(
            "The trap is believing the ideal gas law is always a good approximation. It holds at low "
            "pressure and high temperature, where molecules are far apart, but at high pressure or "
            "low temperature the neglected volume and attractions become significant, and for a dense "
            "gas like compressed CO2 the ideal prediction can miss the real pressure by several "
            "atmospheres."
        ),
        claims=(
            R_LATM,
            VDW_CO2,
            Formula("O=C=O", "CO2", "carbon dioxide, van der Waals worked example"),
        ),
    ),
}
