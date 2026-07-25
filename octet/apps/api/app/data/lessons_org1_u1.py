"""ORG1 Unit 1: Structure and Bonding.

The first unit of organic chemistry is where the notation gets installed, and
notation errors installed here are expensive later: a learner who reads a
skeletal drawing as a picture rather than as a code will miscount hydrogens for
the rest of the program, and a learner who thinks resonance contributors are
separate molecules will draw illegal arrows in every mechanism unit that
follows.

Every structural fact in these lessons carries a claim that RDKit re-derives
from the structure when the test suite runs. Numbers that structure cannot
settle, which in this unit means bond lengths, electronegativities and pKa
values, carry a Source instead. Where a value could not be sourced with
confidence it was left out of the prose rather than guessed, and the lesson was
written to work without it.

One limit is worth stating because it shaped the resonance lesson. The machine
check for "these two drawings are one substance" is canonicalisation, and that
catches resonance contributors which differ only in which equivalent atom holds
the charge or the pi bond, as in acetate, nitromethane and the two Kekule
drawings of benzene. It does not catch charge-separated contributors such as
the dipolar form of an amide, which canonicalise as distinct structures. The
lesson claims only the cases the check actually covers.
"""

from __future__ import annotations

from app.data.claims import Environments, Formula, Relationship, Source, Unsaturation
from app.data.lesson_types import Lesson

# Structures used across the unit, named once so a claim and its prose cannot
# drift apart. Every formula, environment ratio and unsaturation count attached
# to these was read back from RDKit before it was written into a lesson.
METHANE = "C"
ETHANE = "CC"
ETHENE = "C=C"
ETHYNE = "C#C"
PROPENE = "CC=C"
ACETONE = "CC(C)=O"
PROPANAL = "CCC=O"

PENTANE = "CCCCC"
METHYLBUTANE = "CC(C)CC"
DIMETHYLPROPANE = "CC(C)(C)C"
CYCLOHEXANE = "C1CCCCC1"
ETHANOL = "CCO"
DIMETHYL_ETHER = "COC"

NITROMETHANE = "C[N+](=O)[O-]"
NITROMETHANE_OTHER_DRAWING = "C[N+]([O-])=O"
METHOXIDE = "C[O-]"
METHYLAMMONIUM = "C[NH3+]"
METHYLAMINE = "CN"

ACETATE = "CC(=O)[O-]"
ACETATE_OTHER_DRAWING = "CC([O-])=O"
BENZENE_KEKULE = "C1=CC=CC=C1"
BENZENE = "c1ccccc1"

ACETIC_ACID = "CC(=O)O"
CHLOROACETIC_ACID = "OC(=O)CCl"
CHLOROPROPANOIC_2 = "CC(Cl)C(=O)O"
CHLOROPROPANOIC_3 = "OC(=O)CCCl"
CHLOROMETHANE = "CCl"
TETRACHLOROMETHANE = "ClC(Cl)(Cl)Cl"

METHYL_FORMATE = "COC=O"
ETHYL_ACETATE = "CCOC(C)=O"
ACETAMIDE = "CC(N)=O"
ACETONITRILE = "CC#N"

# Citations used more than once, written out once so they cannot drift.
CRC_GAS_PHASE = (
    "CRC Handbook of Chemistry and Physics, 97th edition, section 9 "
    "(Molecular Structure and Spectroscopy), table of the structure of free "
    "molecules in the gas phase."
)
CRC_DISSOCIATION = (
    "CRC Handbook of Chemistry and Physics, 97th edition, section 5, "
    "Dissociation Constants of Organic Acids and Bases, aqueous values at "
    "25 degrees Celsius."
)
CLAYDEN_STRUCTURE = (
    "Clayden, Greeves and Warren, Organic Chemistry, 2nd edition, the chapter "
    "on the structure of molecules and molecular orbitals."
)
CLAYDEN_DELOCALIZATION = (
    "Clayden, Greeves and Warren, Organic Chemistry, 2nd edition, the chapter "
    "on delocalization and conjugation."
)

LESSONS_ORG1_U1 = {
    "ORG1.ORBITALS": Lesson(
        node="ORG1.ORBITALS",
        objective=(
            "Describe the atomic orbitals carbon brings to a bond, explain how "
            "their overlap produces sigma and pi bonds, and count how many of "
            "each a given structure contains."
        ),
        build_on=(
            "You already know from general chemistry that an electron occupies "
            "an orbital, a region of space rather than a path, and that the "
            "second shell holds one s and three p orbitals. Organic chemistry "
            "asks the next question: what happens when two of those regions "
            "overlap."
        ),
        core_idea=(
            "Carbon's ground state configuration is 1s2 2s2 2p2. The 1s pair is "
            "core and takes no part in bonding, so what carbon brings to a "
            "molecule is four valence electrons distributed over one 2s and "
            "three 2p orbitals. When an orbital on one atom overlaps an orbital "
            "on another, the two combine into two molecular orbitals rather "
            "than one: a bonding orbital, lower in energy, which piles electron "
            "density into the region between the nuclei, and an antibonding "
            "orbital, higher in energy, with a node there. A bond forms when "
            "the bonding orbital is filled and the antibonding one is not. The "
            "geometry of the overlap decides what kind of bond you get. Head-on "
            "overlap along the line joining the two nuclei gives a sigma bond, "
            "which is cylindrically symmetric about that line and therefore "
            "permits free rotation. Sideways overlap of two parallel p orbitals "
            "gives a pi bond, with density above and below the internuclear "
            "line and a nodal plane containing it, and rotating about the bond "
            "would tear that overlap apart. Every single bond in organic "
            "chemistry is a sigma bond. A double bond is one sigma plus one pi, "
            "and a triple bond is one sigma plus two pi, the two pi bonds "
            "perpendicular to each other."
        ),
        worked_example=(
            "Count the bonds in the three simplest hydrocarbons and watch the "
            "count line up with a formula you already have. Methane, CH4, has "
            "four carbon to hydrogen bonds and nothing else. All four are "
            "sigma, there are no pi bonds, and the four hydrogens are "
            "equivalent, so 1H NMR gives a single signal. Its degrees of "
            "unsaturation come to zero, which is what you expect when there is "
            "no pi bond and no ring. Ethene, CH2=CH2, has four carbon to "
            "hydrogen sigma bonds plus a carbon to carbon double bond, and that "
            "double bond is one sigma and one pi: five sigma and one pi in "
            "total, and one degree of unsaturation. Ethyne, HC-CH written with "
            "a triple bond, has two carbon to hydrogen sigma bonds plus a "
            "triple bond made of one sigma and two pi: three sigma and two pi, "
            "and two degrees of unsaturation. The pattern is worth naming "
            "because it is the whole reason the unsaturation number is useful. "
            "Degrees of unsaturation counts rings plus pi bonds, so once you "
            "can count pi bonds from a drawing you can predict the number, and "
            "once you have the number from a formula you know how many pi bonds "
            "and rings the drawing has to supply."
        ),
        try_it_prompt=(
            "Propene is CH3-CH=CH2. How many sigma bonds and how many pi bonds "
            "does it contain, and what degrees of unsaturation does that "
            "predict? Count the bonds before you read the answer."
        ),
        try_it_answer=(
            "Eight sigma bonds and one pi bond. Take them in order: the carbon "
            "to carbon single bond is one sigma; the carbon to carbon double "
            "bond is one sigma and one pi; the six carbon to hydrogen bonds are "
            "six more sigma. That is 1 plus 1 plus 6 sigma, so eight, and one "
            "pi. One pi bond and no ring gives one degree of unsaturation, "
            "which agrees with the formula: propene is C3H6 against the "
            "saturated C3H8, two hydrogens short, and every two missing "
            "hydrogens is one degree."
        ),
        pitfall=(
            "The belief that causes the most damage here is that a double bond "
            "is two of the same thing, two single bonds stacked up. It is not. "
            "One component is a sigma bond and the other is a pi bond, and they "
            "differ in shape, in strength and in what they allow. A learner "
            "holding the stacked-single-bonds picture predicts free rotation "
            "about a double bond, and therefore cannot explain why cis and "
            "trans alkenes are separable compounds. The same learner expects "
            "the two components to break with equal difficulty, and therefore "
            "cannot explain why alkenes react at the pi bond while leaving the "
            "sigma framework alone. Both of those follow from the asymmetry, so "
            "fixing the picture fixes both predictions at once."
        ),
        claims=(
            Source(
                "The ground state electron configuration of carbon is "
                "1s2 2s2 2p2, giving four valence electrons in the second "
                "shell.",
                "NIST Atomic Spectra Database, ground states and ionization "
                "energies, entry for carbon (Z = 6).",
            ),
            Source(
                "A sigma bond arises from orbital overlap along the "
                "internuclear axis and is cylindrically symmetric about it; a "
                "pi bond arises from sideways overlap of parallel p orbitals "
                "and has a nodal plane containing the internuclear axis.",
                CLAYDEN_STRUCTURE,
            ),
            Formula(METHANE, "CH4", "methane, four sigma bonds and no pi bond"),
            Environments(METHANE, (4,), "four equivalent hydrogens, one signal"),
            Unsaturation(METHANE, 0, "no ring and no pi bond"),
            Formula(ETHENE, "C2H4", "ethene"),
            Unsaturation(ETHENE, 1, "the single pi bond of the C=C"),
            Formula(ETHYNE, "C2H2", "ethyne"),
            Unsaturation(ETHYNE, 2, "two pi bonds in the triple bond"),
            Formula(PROPENE, "C3H6", "propene"),
            Unsaturation(PROPENE, 1, "one pi bond, no ring"),
        ),
    ),
    "ORG1.HYBRIDORG": Lesson(
        node="ORG1.HYBRIDORG",
        objective=(
            "Assign sp3, sp2 or sp to any carbon by counting the groups "
            "attached to it, and state the geometry, the bond angle and the "
            "number of pi bonds that each assignment forces."
        ),
        build_on=(
            "You know that sigma bonds come from head-on overlap and pi bonds "
            "from sideways overlap of leftover p orbitals. Hybridisation is the "
            "bookkeeping that says how many of each a particular carbon can "
            "make, and it fixes the shape of that carbon at the same time."
        ),
        core_idea=(
            "A carbon mixes its 2s orbital with as many of its 2p orbitals as "
            "it needs sigma bonds; whatever p orbitals are left over stay "
            "unhybridised and are available for pi bonding. Four sigma bonds "
            "needs four hybrid orbitals, so the s mixes with all three p "
            "orbitals to give sp3: tetrahedral, angles at the tetrahedral "
            "value of 109.5 degrees, no p orbital left, and therefore no pi "
            "bond possible. Three sigma bonds needs three hybrids, so sp2: "
            "trigonal planar, angles near 120 degrees, with one unhybridised p "
            "orbital standing perpendicular to that plane and making one pi "
            "bond. Two sigma bonds needs two hybrids, so sp: linear, 180 "
            "degrees, with two leftover p orbitals making two pi bonds. The "
            "count you actually perform at the board is short. Add the atoms "
            "bonded to the carbon and any lone pairs on it: four means sp3, "
            "three means sp2, two means sp. Geometry is not a second fact to "
            "memorise, it follows from that number. So does a trend in bond "
            "character: an sp3 orbital is one part s to three parts p and so "
            "has 25 percent s character, sp2 is one to two and has about 33 "
            "percent, sp is one to one and has 50 percent. An s orbital holds "
            "electron density closer to the nucleus than a p orbital does, so "
            "more s character means a shorter, stronger bond and a carbon that "
            "holds shared electrons more tightly."
        ),
        worked_example=(
            "Take the three two-carbon hydrocarbons in order and read the "
            "consequences off the count. In ethane, CH3CH3, each carbon is "
            "bonded to four atoms, three hydrogens and one carbon. Four groups "
            "means four hybrids, so sp3, tetrahedral, angles near 109.5 "
            "degrees, and the carbon to carbon bond is a single sigma about "
            "which the two halves rotate freely. All six hydrogens are "
            "equivalent, so 1H NMR gives one signal, and there are no degrees "
            "of unsaturation. In ethene, CH2=CH2, each carbon is bonded to "
            "three atoms. Three groups means sp2, trigonal planar, angles near "
            "120 degrees, and the p orbital left on each carbon overlaps "
            "sideways with its partner to give the pi bond. That pi bond holds "
            "the two carbons and all four hydrogens in one plane, and the four "
            "hydrogens are equivalent. In ethyne, HCCH with a triple bond, each "
            "carbon is bonded to two atoms. Two groups means sp, linear at 180 "
            "degrees, with two leftover p orbitals per carbon forming two "
            "perpendicular pi bonds, and two degrees of unsaturation. The "
            "carbon to carbon distance falls across the series, roughly 154 "
            "picometres in ethane, 134 in ethene and 120 in ethyne, which is "
            "the s character trend and the extra pi bonds pulling in the same "
            "direction."
        ),
        try_it_prompt=(
            "In acetone, (CH3)2C=O, what is the hybridisation of the central "
            "carbon and of each methyl carbon, and what bond angle does the "
            "central carbon adopt? Decide by counting attached groups, not by "
            "looking at which elements are involved."
        ),
        try_it_answer=(
            "The central carbon is bonded to three atoms: two methyl carbons "
            "and one oxygen. Three groups means sp2, so it is trigonal planar "
            "with angles near 120 degrees, and its leftover p orbital makes the "
            "pi bond of the C=O. Each methyl carbon is bonded to four atoms, so "
            "sp3 and tetrahedral near 109.5 degrees. The molecule is C3H6O with "
            "one degree of unsaturation, which the single C=O pi bond accounts "
            "for, and its six methyl hydrogens are all equivalent, giving one "
            "1H NMR signal."
        ),
        pitfall=(
            "Most errors here come from one belief: that hybridisation is read "
            "off what the neighbouring elements are, or off whether the drawing "
            "looks flat. It is read off a count. A carbon with three attached "
            "groups is sp2 whether those groups are carbons, oxygens or a "
            "mixture, and a carbon with four attached groups is sp3 even when "
            "it sits in a ring that was drawn as a flat polygon on paper. The "
            "second half of the same belief treats the leftover p orbital as "
            "optional. It is not optional. An sp2 carbon has exactly one "
            "unhybridised p orbital and that orbital will be doing something: "
            "holding a pi bond, holding a lone pair, or standing empty on a "
            "cation. That is where resonance comes from later in this unit, so "
            "a learner who ignores the leftover p orbital now has no mechanism "
            "for delocalisation later."
        ),
        claims=(
            Source(
                "In the hybridisation model a carbon forming n sigma bonds "
                "mixes its 2s orbital with n minus one 2p orbitals, giving sp3 "
                "orbitals of 25 percent s character in a tetrahedral "
                "arrangement, sp2 orbitals of about 33 percent s character in a "
                "trigonal planar arrangement, and sp orbitals of 50 percent s "
                "character in a linear arrangement.",
                CLAYDEN_STRUCTURE,
            ),
            Source(
                "The carbon to carbon internuclear distance is approximately "
                "154 picometres in ethane, 134 picometres in ethene and 120 "
                "picometres in ethyne.",
                CRC_GAS_PHASE,
            ),
            Formula(ETHANE, "C2H6", "ethane, both carbons sp3"),
            Unsaturation(ETHANE, 0, "no ring and no pi bond"),
            Environments(ETHANE, (6,), "six equivalent hydrogens, one signal"),
            Formula(ETHENE, "C2H4", "ethene, both carbons sp2"),
            Unsaturation(ETHENE, 1, "the one pi bond"),
            Environments(ETHENE, (4,), "four equivalent hydrogens"),
            Formula(ETHYNE, "C2H2", "ethyne, both carbons sp"),
            Unsaturation(ETHYNE, 2, "two pi bonds"),
            Environments(ETHYNE, (2,), "two equivalent hydrogens"),
            Formula(ACETONE, "C3H6O", "acetone, an sp2 carbonyl carbon"),
            Unsaturation(ACETONE, 1, "the C=O pi bond, no ring"),
            Environments(ACETONE, (6,), "six equivalent methyl hydrogens"),
        ),
    ),
    "ORG1.DRAWING": Lesson(
        node="ORG1.DRAWING",
        objective=(
            "Convert between Lewis, condensed and skeletal drawings of the same "
            "compound, and recover the molecular formula from a skeletal "
            "structure that shows no hydrogens at all."
        ),
        build_on=(
            "You can assign hybridisation to a carbon by counting the groups "
            "attached to it. That count is exactly what a skeletal drawing "
            "preserves and a Lewis drawing spells out, which is why the three "
            "notations carry identical information."
        ),
        core_idea=(
            "A Lewis structure shows every atom and every valence electron "
            "pair, bonding and non-bonding alike. A condensed formula collapses "
            "the hydrogens onto the atom they belong to and drops most bond "
            "lines, so ethanol becomes CH3CH2OH. A skeletal structure goes "
            "further and drops the carbons and their hydrogens entirely: every "
            "vertex and every line end is a carbon, and each of those carbons "
            "silently carries however many hydrogens bring it up to four bonds. "
            "Heteroatoms are always drawn, and so are the hydrogens attached to "
            "them. Nothing is lost in the compression, and the reason nothing "
            "is lost is that carbon's valence is fixed at four, which makes the "
            "hydrogen count at each vertex recoverable rather than guessable. "
            "Organic chemists work in skeletal form because it makes the carbon "
            "framework and the functional groups visible at a glance, whereas a "
            "full Lewis drawing of the same molecule buries both of them under "
            "hydrogens. Treat the three notations as one language with three "
            "levels of abbreviation, not as three different things to learn, "
            "and translate in both directions until the translation stops being "
            "a step you notice."
        ),
        worked_example=(
            "Start with pentane, C5H12. Condensed, it is CH3CH2CH2CH2CH3. "
            "Skeletal, it is a zigzag of four line segments with five vertices "
            "counting both ends, and not one letter written. Recover the "
            "hydrogens: each end vertex has one bond drawn to it, so it needs "
            "three more to reach four; each of the three interior vertices has "
            "two bonds drawn, so each needs two. That gives 3 plus 2 plus 2 "
            "plus 2 plus 3, which is twelve, and C5H12 comes back without an H "
            "ever having been written. Now rearrange the same five carbons into "
            "2-methylbutane, a four-carbon chain with a methyl branch. The "
            "skeletal drawing is a visibly different shape, the formula is "
            "still C5H12, and the two compounds are constitutional isomers, "
            "which means same formula and different connectivity, two "
            "substances rather than two drawings of one. Symmetry is visible in "
            "skeletal form too, which is part of why it is worth using. "
            "Pentane's twelve hydrogens fall into three sets in a 6:4:2 ratio, "
            "while the third C5H12 isomer, 2,2-dimethylpropane, is symmetric "
            "enough that all twelve are equivalent and it gives a single 1H NMR "
            "signal."
        ),
        try_it_prompt=(
            "A skeletal drawing shows a six-membered ring of plain line "
            "segments, with no double bonds, no letters and no charges. What is "
            "the molecular formula, and how many degrees of unsaturation does "
            "it have? Work out the hydrogens vertex by vertex first."
        ),
        try_it_answer=(
            "Each of the six vertices is a carbon with two bonds drawn to it, "
            "so each carries two hydrogens. That is C6H12, cyclohexane. It has "
            "one degree of unsaturation, and the point worth holding onto is "
            "that the one degree is the ring, not a pi bond, since the drawing "
            "has no pi bonds in it. All twelve hydrogens are equivalent by the "
            "ring's symmetry, so the 1H NMR shows a single signal."
        ),
        pitfall=(
            "The error is reading a skeletal drawing as though the missing "
            "hydrogens are genuinely absent rather than implied, which produces "
            "a formula several hydrogens short and a degrees of unsaturation "
            "count that is far too high. The belief underneath is that the "
            "drawing is a picture of the molecule. It is a code, and the code "
            "has one rule: fill every carbon to four bonds. The same belief has "
            "a second symptom, which is dropping the hydrogen on a heteroatom "
            "as well. An alcohol is drawn as OH and not as O, because oxygen's "
            "valence is two rather than four, so a reader cannot reconstruct "
            "that hydrogen from the line count the way they can at a carbon. "
            "If a learner is short on hydrogens, check which of these two they "
            "are doing before re-teaching the whole notation."
        ),
        claims=(
            Formula(PENTANE, "C5H12", "pentane"),
            Unsaturation(PENTANE, 0, "no ring and no pi bond"),
            Environments(PENTANE, (6, 4, 2), "three sets of hydrogens"),
            Formula(METHYLBUTANE, "C5H12", "2-methylbutane, the branched isomer"),
            Relationship(
                PENTANE, METHYLBUTANE, "constitutional",
                "same formula, different connectivity, two compounds",
            ),
            Formula(DIMETHYLPROPANE, "C5H12", "2,2-dimethylpropane"),
            Environments(
                DIMETHYLPROPANE, (12,),
                "all twelve hydrogens equivalent, so one signal",
            ),
            Relationship(PENTANE, DIMETHYLPROPANE, "constitutional"),
            Formula(CYCLOHEXANE, "C6H12", "cyclohexane"),
            Unsaturation(
                CYCLOHEXANE, 1, "the one degree is the ring, not a pi bond"
            ),
            Environments(CYCLOHEXANE, (12,), "one signal by ring symmetry"),
            Formula(ETHANOL, "C2H6O", "ethanol, condensed as CH3CH2OH"),
        ),
    ),
    "ORG1.FORMALCHARGEORG": Lesson(
        node="ORG1.FORMALCHARGEORG",
        objective=(
            "Assign a formal charge to any atom in an organic structure from a "
            "count of its bonds and lone pairs, and use the sum over all atoms "
            "to check that a drawn structure is legal."
        ),
        build_on=(
            "Reading a skeletal drawing, you have been filling every carbon up "
            "to four bonds. Formal charge is that same bookkeeping extended to "
            "atoms sitting away from their neutral bond count, and it is what "
            "tells you that an oxygen drawn with three bonds is a real species "
            "rather than a mistake."
        ),
        core_idea=(
            "The formal charge on an atom is the number of valence electrons in "
            "the free atom minus the number it owns in the molecule, where it "
            "owns all of its own lone pair electrons and half of every shared "
            "pair. For organic structures that reduces to a count you can do by "
            "eye: group valence electrons, minus lone pair electrons, minus "
            "number of bonds. Run it on the neutral cases first so the "
            "departures stand out. Carbon has four valence electrons and "
            "neutrally makes four bonds with no lone pairs: 4 minus 0 minus 4 "
            "is 0. Nitrogen has five and neutrally makes three bonds with one "
            "lone pair: 5 minus 2 minus 3 is 0. Oxygen has six and neutrally "
            "makes two bonds with two lone pairs: 6 minus 4 minus 2 is 0. Every "
            "formal charge you will ever assign is a departure from one of "
            "those three patterns. A nitrogen with four bonds and no lone pair "
            "gives 5 minus 0 minus 4, which is plus one. An oxygen with one "
            "bond and three lone pairs gives 6 minus 6 minus 1, which is minus "
            "one. Formal charge is bookkeeping and not a measurement of where "
            "electron density actually sits, but it is the bookkeeping that "
            "everything downstream runs on, because it decides which structures "
            "may legally be drawn and it is exact rather than approximate."
        ),
        worked_example=(
            "Assign every formal charge in nitromethane, CH3NO2. Draw the "
            "nitrogen bonded to the methyl carbon, doubly bonded to one oxygen "
            "and singly bonded to the other. Take the nitrogen first: four "
            "bonds, no lone pair, so 5 minus 0 minus 4 is plus one. The doubly "
            "bonded oxygen has two bonds and two lone pairs: 6 minus 4 minus 2 "
            "is zero. The singly bonded oxygen has one bond and three lone "
            "pairs: 6 minus 6 minus 1 is minus one. The carbon has four bonds "
            "and no lone pairs, so zero, and each hydrogen has one bond and no "
            "lone pairs, 1 minus 0 minus 1, so zero. Now add them up: plus one "
            "and minus one and the rest zero, giving a net charge of zero, "
            "which is what a neutral bottle of nitromethane requires. That "
            "addition is the check worth building into your reflexes. If the "
            "sum comes out different from the charge the species is supposed to "
            "carry, the drawing is wrong somewhere and you have found it before "
            "building anything on top of it. The structure holds together with "
            "the rest of the unit as well: CH3NO2 has one degree of "
            "unsaturation, which is the single nitrogen to oxygen pi bond, and "
            "its three hydrogens are equivalent, so it gives one 1H NMR signal."
        ),
        try_it_prompt=(
            "Methoxide is CH3O carrying a negative charge. Which atom holds the "
            "charge, and what count produces it? Then do the same for the "
            "nitrogen of methylammonium, CH3NH3 carrying a positive charge."
        ),
        try_it_answer=(
            "In methoxide the oxygen holds it. That oxygen has one bond, to the "
            "methyl carbon, and three lone pairs: 6 minus 6 minus 1 is minus "
            "one. The carbon sits at its neutral four bonds, so zero, and the "
            "hydrogens are zero, making the sum minus one, which matches the "
            "ion. In methylammonium the nitrogen has four bonds, one to carbon "
            "and three to hydrogen, and no lone pair: 5 minus 0 minus 4 is plus "
            "one. Everything else is neutral, so the sum is plus one. Notice "
            "that in both ions the carbon never changed; it is the heteroatom "
            "moving off its neutral bond count that generates the charge."
        ),
        pitfall=(
            "The belief that produces most of the errors is that formal charge "
            "follows electronegativity, so that in any bond the more "
            "electronegative atom must be the one wearing the minus sign. It "
            "does not follow electronegativity at all. In nitromethane it is "
            "the nitrogen, less electronegative than oxygen, that carries the "
            "plus one, because the count looks at bonds and lone pairs and at "
            "nothing else. The same belief has a broader form worth naming: "
            "that a formal charge describes real charge distribution. It does "
            "not. It is a device whose entire value is that it is exact and "
            "checkable, and a learner who reads it as electron density will try "
            "to predict reactivity from it and will be reasoning from the wrong "
            "signal. Partial charges from electronegativity, which the next "
            "lesson covers, are the ones that track electron density."
        ),
        claims=(
            Source(
                "Formal charge on an atom is defined as the number of valence "
                "electrons in the free atom minus the number of lone pair "
                "electrons minus the number of bonds to that atom, and the sum "
                "of formal charges over a species equals its net charge.",
                "IUPAC Compendium of Chemical Terminology (the Gold Book), "
                "entry for formal charge.",
            ),
            Formula(
                NITROMETHANE, "CH3NO2",
                "nitromethane, N is plus one and one O is minus one",
            ),
            Unsaturation(
                NITROMETHANE, 1, "the single nitrogen to oxygen pi bond"
            ),
            Environments(NITROMETHANE, (3,), "three equivalent hydrogens, one signal"),
            Formula(METHOXIDE, "CH3O-", "methoxide, the charge on oxygen"),
            Environments(METHOXIDE, (3,), "three equivalent methyl hydrogens"),
            Formula(METHYLAMMONIUM, "CH6N+", "methylammonium, the charge on nitrogen"),
            Formula(METHYLAMINE, "CH5N", "methylamine, the neutral parent"),
            Environments(METHYLAMINE, (3, 2), "methyl and NH2 hydrogens"),
        ),
    ),
    "ORG1.RESONANCEORG": Lesson(
        node="ORG1.RESONANCEORG",
        objective=(
            "Decide whether a proposed resonance contributor is legal, and rank "
            "the legal contributors so you can say which one describes the real "
            "molecule best."
        ),
        build_on=(
            "You can now assign formal charge, and that is the tool that makes "
            "resonance checkable rather than a matter of taste: a legal "
            "contributor keeps the same atoms in the same places, keeps the "
            "same total charge, and never puts more than eight valence "
            "electrons on a second row atom."
        ),
        core_idea=(
            "Resonance is not an equilibrium and it is not two molecules "
            "interconverting. There is one molecule, its electron distribution "
            "cannot be represented by any single Lewis drawing, so we draw "
            "several and take the truth to be a weighted blend of them. The "
            "nuclei stay exactly where they are in every contributor; only "
            "electrons move, and only pi electrons and lone pairs move, never a "
            "sigma bond and never an atom. A contributor is legal when four "
            "things hold: the atoms are the same and in the same positions, the "
            "total charge is unchanged, the number of unpaired electrons is "
            "unchanged, and no second row atom exceeds eight valence electrons. "
            "That last condition is absolute rather than a matter of degree. "
            "Carbon, nitrogen, oxygen and fluorine have no accessible d "
            "orbitals, so a nitrogen drawn with five bonds is not a poor "
            "contributor, it is a structure that does not exist. Among the "
            "legal contributors, weighting is what remains. A contributor "
            "counts for more when it has more covalent bonds and more complete "
            "octets, when it separates charge less, and, where charge must be "
            "separated, when the negative charge sits on the more "
            "electronegative atom and the positive charge on the less "
            "electronegative one. Contributors that are identical to each other "
            "by symmetry count equally, and that is the case where "
            "delocalisation is strongest."
        ),
        worked_example=(
            "Acetate, CH3COO with a negative charge, is the case to hold in "
            "mind. Draw it with the central carbon doubly bonded to one oxygen "
            "and singly bonded to the other, the second oxygen carrying the "
            "minus one you would assign it from 6 minus 6 minus 1. Now move a "
            "lone pair from the negative oxygen in to form a pi bond, and push "
            "the existing pi bond out onto the other oxygen as a lone pair. "
            "Check the second drawing against the four conditions: same atoms "
            "in the same positions, total charge still minus one, no unpaired "
            "electrons either way, and no atom past an octet. It is legal. Now "
            "weigh the two against each other. They have the same number of "
            "bonds, the same octets and the same charge separation, and they "
            "differ only in which oxygen you chose to draw the double bond to, "
            "so they are equally weighted. The consequence is that the real "
            "acetate ion has two carbon to oxygen bonds of identical length, "
            "each of bond order one and a half, with half a negative charge on "
            "each oxygen, and only three hydrogens, all on the methyl and all "
            "equivalent. That these two drawings describe one substance rather "
            "than two is checkable: canonicalise them and they collapse to a "
            "single structure. The two Kekule drawings of benzene behave the "
            "same way, collapsing to one structure with six identical carbon to "
            "carbon bonds and six equivalent hydrogens giving a single 1H NMR "
            "signal. Contrast all of that with propanal and acetone. Both are "
            "C3H6O with one degree of unsaturation, and they are not "
            "contributors to anything: they are constitutional isomers, two "
            "compounds in two separate bottles, because getting from one to the "
            "other moves a hydrogen and not only electrons."
        ),
        try_it_prompt=(
            "Someone offers a resonance contributor for acetate in which the "
            "central carbon is doubly bonded to both oxygens and neither oxygen "
            "carries a charge. Is it legal? Test it against the conditions "
            "before answering."
        ),
        try_it_answer=(
            "It is not legal, and it fails on two counts. Count the bonds at "
            "the central carbon: one to the methyl group, plus two for each of "
            "the two double bonds, which is five bonds and ten valence "
            "electrons around a second row atom that can hold eight. Carbon has "
            "no d orbitals to expand into, so this is not a weak contributor "
            "but a structure that cannot be drawn at all. It also fails the "
            "charge test: every atom in that drawing is formally neutral, so "
            "the drawing totals zero while acetate is an anion of charge minus "
            "one. Either failure on its own is disqualifying. The impulse "
            "behind the proposal is worth naming, because it is a reasonable "
            "one: charges look untidy, so the temptation is to keep pushing "
            "electrons until they disappear. Charge conservation is what stops "
            "you."
        ),
        pitfall=(
            "The belief that does the most damage is that a molecule flickers "
            "between its resonance contributors, spending some of its time as "
            "one and some as the other. It does not. There is one molecule with "
            "one electron distribution, and the several drawings are an "
            "artefact of Lewis notation being unable to represent it, not a "
            "description of anything happening in time. The test that exposes "
            "the misconception is direct: if the contributors were separate "
            "species you could in principle cool the sample and catch one of "
            "them, and nobody ever has. The practical cost of the wrong belief "
            "is that it quietly licenses moving atoms, because if the forms "
            "really interconvert then shifting a hydrogen looks like the same "
            "kind of move as shifting a pi bond. It is not. Move a hydrogen and "
            "you have drawn a different compound, a tautomer or an isomer, and "
            "every later mechanism built on that step will be wrong."
        ),
        claims=(
            Relationship(
                ACETATE, ACETATE_OTHER_DRAWING, "identical",
                "the two resonance drawings of acetate are one substance, not "
                "two compounds",
            ),
            Formula(ACETATE, "C2H3O2-", "acetate"),
            Environments(
                ACETATE, (3,), "the only hydrogens are the three equivalent methyl ones"
            ),
            Relationship(
                BENZENE_KEKULE, BENZENE, "identical",
                "a Kekule drawing and the delocalised drawing are one compound",
            ),
            Formula(BENZENE, "C6H6", "benzene"),
            Unsaturation(BENZENE, 4, "three pi bonds plus one ring"),
            Environments(BENZENE, (6,), "six equivalent hydrogens, one signal"),
            Relationship(
                NITROMETHANE, NITROMETHANE_OTHER_DRAWING, "identical",
                "the two equally weighted contributors of nitromethane",
            ),
            Relationship(
                PROPANAL, ACETONE, "constitutional",
                "different compounds, not contributors to one another",
            ),
            Formula(PROPANAL, "C3H6O", "propanal"),
            Formula(ACETONE, "C3H6O", "acetone"),
            Unsaturation(PROPANAL, 1, "the C=O pi bond"),
            Source(
                "Resonance describes a single species whose electron "
                "distribution is represented as a weighted combination of "
                "contributing Lewis structures that differ only in the "
                "distribution of electrons, the positions of the nuclei being "
                "the same in all of them.",
                "IUPAC Compendium of Chemical Terminology (the Gold Book), "
                "entry for resonance (mesomerism).",
            ),
            Source(
                "The two carbon to oxygen bonds of the acetate ion are equal in "
                "length and intermediate between a carbon to oxygen single and "
                "double bond, and the six carbon to carbon bonds of benzene are "
                "equal in length and intermediate between a single and a double "
                "bond.",
                CLAYDEN_DELOCALIZATION,
            ),
        ),
    ),
    "ORG1.INDUCTIVE": Lesson(
        node="ORG1.INDUCTIVE",
        objective=(
            "Predict the direction and relative size of a bond dipole from "
            "electronegativity, decide whether the bond dipoles in a molecule "
            "cancel, and use inductive effects transmitted through sigma bonds "
            "to compare related acids."
        ),
        build_on=(
            "Formal charge gave you a whole number sitting on one atom. "
            "Inductive effects are about the fractional charge that an "
            "electronegativity difference puts on every polar bond, and about "
            "how far along a chain that fraction is still felt."
        ),
        core_idea=(
            "A covalent bond between two atoms of unequal electronegativity is "
            "polarised: the shared electrons spend more time near the more "
            "electronegative atom, which takes a partial negative charge while "
            "its partner takes an equal partial positive one. On the Pauling "
            "scale carbon is 2.55 and hydrogen 2.20, so a C-H bond is barely "
            "polarised and can be treated as neutral for most purposes. Oxygen "
            "at 3.44 and chlorine at 3.16 pull much harder, so C-O and C-Cl "
            "bonds are strongly polar with the carbon at the positive end. The "
            "inductive effect is that polarisation propagating outward along "
            "the sigma framework: a partially positive carbon pulls on the "
            "electrons of the bonds around it, those bonds pull on the bonds "
            "beyond them, and the disturbance spreads. Two properties of it "
            "matter in practice. First, it travels through sigma bonds, so it "
            "operates in saturated molecules where there is no pi system at "
            "all, which is what distinguishes it from resonance. Second, it "
            "falls off sharply with distance and is small after two or three "
            "bonds, so where a substituent sits matters as much as what it is. "
            "One further point separates two questions that get confused. The "
            "polarity of the whole molecule is the vector sum of its bond "
            "dipoles, so a molecule can contain several strongly polar bonds "
            "and still have no net dipole if its symmetry cancels them."
        ),
        worked_example=(
            "Compare acetic acid, CH3COOH, with chloroacetic acid, ClCH2COOH. "
            "Both are two-carbon carboxylic acids with one degree of "
            "unsaturation, and both lose the same proton, the one on the OH. "
            "What differs is the anion left behind. In acetate the negative "
            "charge is already spread over two oxygens by resonance, and the "
            "methyl group next door does nothing further for it. In "
            "chloroacetate, chlorine is more electronegative than carbon, so "
            "the C-Cl bond is polarised with that carbon at the positive end, "
            "and a partially positive carbon sitting next to a negatively "
            "charged carboxylate pulls electron density toward itself and "
            "spreads the charge over a larger volume. A more stable anion means "
            "a stronger acid, and the measured values bear it out: in water at "
            "25 degrees Celsius acetic acid has a pKa of 4.76 and chloroacetic "
            "acid a pKa of 2.86, a difference of 1.90 pKa units, which is "
            "nearly a hundredfold in acid strength from one chlorine atom. Now "
            "test the distance claim by moving that chlorine one carbon "
            "further out. 2-chloropropanoic acid and 3-chloropropanoic acid are "
            "constitutional isomers, both C3H5ClO2, differing only in where the "
            "chlorine sits. The model predicts the 3-chloro isomer is the "
            "weaker acid, because the inductive pull has one more sigma bond to "
            "travel through before it reaches the charge, and that is what the "
            "measurements show."
        ),
        try_it_prompt=(
            "Tetrachloromethane, CCl4, contains four strongly polarised C-Cl "
            "bonds. Does the molecule have a net dipole moment? Reason from the "
            "geometry at carbon before you answer."
        ),
        try_it_answer=(
            "It does not. The carbon is bonded to four groups, so it is sp3 and "
            "tetrahedral, and the four chlorines are arranged symmetrically "
            "around it. Each C-Cl bond dipole points from carbon toward "
            "chlorine, and four equal vectors pointing at the corners of a "
            "regular tetrahedron sum to zero. The bonds are polar; the molecule "
            "is not. Chloromethane, CH3Cl, is the control case: it has one such "
            "bond, three barely polar C-H bonds and nothing to cancel against, "
            "so it does have a net dipole."
        ),
        pitfall=(
            "The first belief to correct is that a molecule containing polar "
            "bonds is a polar molecule. Bond polarity and molecular polarity "
            "are different questions, and the second one cannot be answered "
            "without the geometry, which is why hybridisation had to come "
            "first. The second belief is subtler and survives longer because it "
            "often gives the right answer. A learner reasons that an electron "
            "withdrawing group makes the acidic proton more positive and "
            "therefore easier to pull off, and concludes correctly that "
            "chloroacetic acid is the stronger acid. The reasoning is aimed at "
            "the wrong species. Acidity is set by the stability of the anion "
            "that remains, not by the acid molecule, and the moment a "
            "substituent is placed near the charge but far from the proton the "
            "two accounts diverge and only the anion account survives. Judging "
            "by the anion also makes the distance dependence follow naturally "
            "rather than needing a separate rule."
        ),
        claims=(
            Source(
                "On the Pauling scale as revised from thermochemical data, "
                "hydrogen is 2.20, carbon 2.55, nitrogen 3.04, oxygen 3.44, "
                "chlorine 3.16 and fluorine 3.98.",
                "Allred, A. L., Electronegativity values from thermochemical "
                "data, Journal of Inorganic and Nuclear Chemistry, 1961, "
                "volume 17, pages 215-221.",
            ),
            Source(
                "In water at 25 degrees Celsius acetic acid has a pKa of 4.76 "
                "and chloroacetic acid a pKa of 2.86; among the chlorinated "
                "propanoic acids the 2-chloro isomer is a stronger acid than "
                "the 3-chloro isomer.",
                CRC_DISSOCIATION,
            ),
            Source(
                "The inductive effect is the transmission of charge through a "
                "chain of atoms by electrostatic induction along sigma bonds, "
                "distinct from delocalisation through a pi system.",
                "IUPAC Compendium of Chemical Terminology (the Gold Book), "
                "entry for inductive effect.",
            ),
            Formula(ACETIC_ACID, "C2H4O2", "acetic acid"),
            Unsaturation(ACETIC_ACID, 1, "the C=O pi bond"),
            Environments(ACETIC_ACID, (3, 1), "methyl and the acidic OH"),
            Formula(CHLOROACETIC_ACID, "C2H3ClO2", "chloroacetic acid"),
            Unsaturation(CHLOROACETIC_ACID, 1, "the C=O pi bond"),
            Environments(CHLOROACETIC_ACID, (2, 1), "the CH2 and the acidic OH"),
            Formula(CHLOROPROPANOIC_2, "C3H5ClO2", "2-chloropropanoic acid"),
            Formula(CHLOROPROPANOIC_3, "C3H5ClO2", "3-chloropropanoic acid"),
            Relationship(
                CHLOROPROPANOIC_2, CHLOROPROPANOIC_3, "constitutional",
                "same formula, the chlorine one bond further from the charge",
            ),
            Formula(TETRACHLOROMETHANE, "CCl4", "four polar bonds, no net dipole"),
            Unsaturation(TETRACHLOROMETHANE, 0, "no ring and no pi bond"),
            Formula(CHLOROMETHANE, "CH3Cl", "one polar bond, nothing to cancel it"),
            Environments(CHLOROMETHANE, (3,), "three equivalent hydrogens"),
        ),
    ),
    "ORG1.FUNCTIONALGROUPS": Lesson(
        node="ORG1.FUNCTIONALGROUPS",
        objective=(
            "Recognise the common organic functional groups in a skeletal "
            "structure whatever orientation they are drawn in, and explain why "
            "the group rather than the formula or the carbon skeleton predicts "
            "how a molecule behaves."
        ),
        build_on=(
            "You can read a skeletal drawing and assign hybridisation, formal "
            "charge and bond polarity anywhere in it. Functional group "
            "recognition is the pattern matching layer on top: a small "
            "arrangement of atoms that carries its own chemistry wherever it "
            "turns up."
        ),
        core_idea=(
            "Most of a typical organic molecule is unreactive C-C and C-H sigma "
            "bonds. Reactivity concentrates where something breaks that "
            "pattern: a heteroatom, a pi bond, or both together. Those places "
            "are the functional groups, and the reason the subject is learnable "
            "rather than a list of ten million compounds is that a given group "
            "behaves in much the same way whatever skeleton carries it. The "
            "core set is short. An alcohol is a carbon bearing OH. An ether is "
            "an oxygen bridging two carbons. An aldehyde is a C=O whose carbon "
            "also carries at least one hydrogen; a ketone is a C=O with carbon "
            "on both sides. A carboxylic acid is a C=O whose carbon also bears "
            "an OH; replace that OH with OR and you have an ester, replace it "
            "with nitrogen and you have an amide. An amine is a nitrogen bonded "
            "to carbon and not to a carbonyl. A nitrile is a carbon triple "
            "bonded to nitrogen. Alkenes and alkynes are functional groups with "
            "no heteroatom in them at all, and an arene is a ring whose pi "
            "system is delocalised in the sense the resonance lesson set out. "
            "When a new structure lands in front of you, look past the chain "
            "and name the groups first, because the groups are what tell you "
            "what the molecule will do."
        ),
        worked_example=(
            "Two compounds share the formula C2H6O and share almost nothing "
            "else. Ethanol is CH3CH2OH, an alcohol: an sp3 carbon bearing an "
            "OH, with an O-H bond polarised enough to be donated to a hydrogen "
            "bond, which is most of why ethanol is a liquid you can mix with "
            "water. Dimethyl ether is CH3OCH3, an ether: the same three heavy "
            "atoms rearranged so the oxygen bridges two carbons, with no O-H "
            "anywhere and therefore no hydrogen bond to donate, which is most "
            "of why it is a gas. Both have zero degrees of unsaturation, both "
            "are C2H6O, and they are constitutional isomers rather than two "
            "drawings of one thing. Run the same test one oxidation level up. "
            "Acetic acid, CH3COOH, and methyl formate, HCOOCH3, are both C2H4O2 "
            "with one degree of unsaturation and are likewise constitutional "
            "isomers, but one is a carboxylic acid with an O-H acidic enough to "
            "be removed by a mild base, and the other is an ester with no "
            "acidic hydrogen anywhere in it. The formula distinguishes none of "
            "this. The functional group distinguishes all of it, which is why "
            "recognition has to become automatic before mechanisms start."
        ),
        try_it_prompt=(
            "Ethyl acetate is CH3COOCH2CH3. Name its functional group, give the "
            "molecular formula and the degrees of unsaturation, and say how "
            "many distinct 1H NMR environments its structure requires and in "
            "what ratio."
        ),
        try_it_answer=(
            "It is an ester: a carbonyl carbon bearing an oxygen which is in "
            "turn bonded to another carbon. The formula is C4H8O2 and there is "
            "one degree of unsaturation, which is the single C=O pi bond, with "
            "no ring. There are three hydrogen environments in a 3:3:2 ratio: "
            "the methyl attached to the carbonyl, the methyl at the end of the "
            "ethyl group, and the OCH2 between them. The two methyl groups are "
            "chemically different despite both being CH3, and noticing that is "
            "the payoff for naming the group rather than counting atom types."
        ),
        pitfall=(
            "The trap is treating the molecular formula as the identifying fact "
            "about a compound. A formula gives you the atom inventory and the "
            "degrees of unsaturation, and neither of those separates an alcohol "
            "from an ether or an acid from an ester. The belief underneath is a "
            "carryover from general chemistry, where writing NaCl or H2SO4 does "
            "name one substance. In organic chemistry a formula names a set of "
            "isomers that may share no useful property, so a learner still "
            "reaching for the formula first is answering a question the field "
            "no longer asks. The second half of the same problem is recognising "
            "a group only in the orientation it was first met in. A C=O drawn "
            "pointing down and a C=O drawn pointing up are the same carbonyl, "
            "an ester drawn with its carbonyl on the left is the same group as "
            "one drawn with it on the right, and a learner who has memorised a "
            "picture instead of a connectivity pattern will miss half of them."
        ),
        claims=(
            Source(
                "A functional group is an atom or group of atoms within a "
                "molecule that has similar chemical properties whenever it "
                "occurs in different compounds, and it defines the "
                "characteristic chemistry of those compounds.",
                "IUPAC Compendium of Chemical Terminology (the Gold Book), "
                "entry for functional group.",
            ),
            Formula(ETHANOL, "C2H6O", "ethanol, an alcohol"),
            Formula(DIMETHYL_ETHER, "C2H6O", "dimethyl ether, an ether"),
            Unsaturation(ETHANOL, 0, "no ring and no pi bond"),
            Relationship(
                ETHANOL, DIMETHYL_ETHER, "constitutional",
                "same formula, different functional group, different compounds",
            ),
            Formula(ACETIC_ACID, "C2H4O2", "acetic acid, a carboxylic acid"),
            Formula(METHYL_FORMATE, "C2H4O2", "methyl formate, an ester"),
            Unsaturation(ACETIC_ACID, 1, "the C=O pi bond"),
            Relationship(
                ACETIC_ACID, METHYL_FORMATE, "constitutional",
                "acid and ester at the same formula",
            ),
            Formula(ETHYL_ACETATE, "C4H8O2", "ethyl acetate, an ester"),
            Unsaturation(ETHYL_ACETATE, 1, "the C=O pi bond, no ring"),
            Environments(
                ETHYL_ACETATE, (3, 3, 2),
                "acetyl methyl, ethyl methyl and the OCH2",
            ),
            Formula(ACETAMIDE, "C2H5NO", "acetamide, an amide"),
            Unsaturation(ACETAMIDE, 1, "the C=O pi bond"),
            Formula(ACETONITRILE, "C2H3N", "acetonitrile, a nitrile"),
            Unsaturation(ACETONITRILE, 2, "two pi bonds in the C to N triple bond"),
            Formula(BENZENE, "C6H6", "benzene, an arene"),
            Unsaturation(BENZENE, 4, "three pi bonds plus one ring"),
        ),
    ),
}
