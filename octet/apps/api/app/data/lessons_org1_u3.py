"""ORG1 Unit 3: Alkanes and Conformational Analysis.

Chapters 3 and 4. Naming, constitutional isomerism, rotation about single
bonds, and what happens when you tie a chain into a ring.

Same discipline as Unit 4. Every structural fact stated in prose also appears
below as a claim that RDKit re-derives when the test suite runs, so a name and
a structure cannot drift apart and an isomer relationship cannot be asserted
without being proved.

Two things in this unit are deliberately handled differently.

First, energies. Ring strain, rotation barriers and A values are measured
quantities. Nothing here can derive them, so every number carries a Source
claim naming the reference work it came from, and the teaching leads with the
ordering rather than the number, because the ordering is the transferable
skill and the number is the part most likely to be misremembered.

Second, ring stereochemistry. The cis and trans forms of a 1,4-disubstituted
cyclohexane are both achiral and are diastereomers of each other. The
are_enantiomers heuristic in chem_core.organic gets that pair wrong: it sees
every CIP descriptor inverted between the two structures and reports them as
enantiomers. So the 1,4 case below is proved a different way, by showing each
form is identical to its own mirror image, which establishes that both are
achiral and therefore cannot be an enantiomeric pair. The 1,2 and 1,3 cases,
where the heuristic is sound, carry the ordinary Relationship claims.
"""

from __future__ import annotations

from app.data.claims import Environments, Formula, Relationship, Source, Stereo, Unsaturation
from app.data.lesson_types import Lesson

# Acyclic skeletons, named once so a claim and its prose cannot drift apart.
METHANE = "C"
ETHANE = "CC"
PROPANE = "CCC"
BUTANE = "CCCC"
ISOBUTANE = "CC(C)C"
PENTANE = "CCCCC"
METHYLBUTANE = "CCC(C)C"  # 2-methylbutane
NEOPENTANE = "CC(C)(C)C"  # 2,2-dimethylpropane
HEXANE = "CCCCCC"
METHYLPENTANE_2 = "CCCC(C)C"  # 2-methylpentane
METHYLPENTANE_3 = "CCC(C)CC"  # 3-methylpentane
DIMETHYLBUTANE_22 = "CCC(C)(C)C"  # 2,2-dimethylbutane
DIMETHYLBUTANE_23 = "CC(C)C(C)C"  # 2,3-dimethylbutane
DIMETHYLPENTANE_23 = "CCC(C)C(C)C"  # 2,3-dimethylpentane
ETHYLMETHYLPENTANE = "CCC(CC)C(C)C"  # 3-ethyl-2-methylpentane
ETHYLMETHYLHEPTANE = "CC(C)CC(CC)CCC"  # 4-ethyl-2-methylheptane

# Rings.
CYCLOPROPANE = "C1CC1"
CYCLOBUTANE = "C1CCC1"
CYCLOPENTANE = "C1CCCC1"
CYCLOHEXANE = "C1CCCCC1"
CYCLOHEPTANE = "C1CCCCCC1"
METHYLCYCLOPENTANE = "CC1CCCC1"
METHYLCYCLOHEXANE = "CC1CCCCC1"
ETHYLCYCLOHEXANE = "CCC1CCCCC1"
ISOPROPYLCYCLOHEXANE = "CC(C)C1CCCCC1"
TERTBUTYLCYCLOHEXANE = "CC(C)(C)C1CCCCC1"
HEX_1_ENE = "C=CCCCC"

# Ring stereoisomers. Enumerated with RDKit and then sorted into cis and trans
# by two independent routes: a 3D embedding that measures which face of the
# ring each methyl sits on, and a chirality test, since cis-1,2 and cis-1,3 are
# the meso forms. Writing these by hand is how ring stereochemistry gets
# shipped backwards.
CIS_12_DIMETHYL = "C[C@@H]1CCCC[C@@H]1C"  # meso, both methyls on one face
CIS_12_MIRROR = "C[C@H]1CCCC[C@H]1C"  # the same compound, written mirrored
TRANS_12_RR = "C[C@@H]1CCCC[C@H]1C"
TRANS_12_SS = "C[C@H]1CCCC[C@@H]1C"
CIS_13_DIMETHYL = "C[C@@H]1CCC[C@H](C)C1"  # meso
CIS_13_MIRROR = "C[C@H]1CCC[C@@H](C)C1"
TRANS_13_RR = "C[C@@H]1CCC[C@@H](C)C1"
TRANS_13_SS = "C[C@H]1CCC[C@H](C)C1"
CIS_14_DIMETHYL = "C[C@H]1CC[C@@H](C)CC1"
CIS_14_MIRROR = "C[C@@H]1CC[C@H](C)CC1"
TRANS_14_DIMETHYL = "C[C@H]1CC[C@H](C)CC1"
TRANS_14_MIRROR = "C[C@@H]1CC[C@@H](C)CC1"

# Citations for the measured quantities this unit states. Named once so the
# same reference is not paraphrased three different ways.
ELIEL = (
    "Eliel, E. L. and Wilen, S. H., Stereochemistry of Organic Compounds, "
    "Wiley, 1994, chapter 11 (conformation of cyclic molecules), which "
    "carries the standard tabulation of conformational energies."
)
CAREY = (
    "Carey, F. A. and Sundberg, R. J., Advanced Organic Chemistry, Part A: "
    "Structure and Mechanisms, 5th edition, Springer, 2007, chapter 3, where "
    "cycloalkane strain energies derived from heats of combustion are "
    "tabulated."
)
CLAYDEN = (
    "Clayden, J., Greeves, N. and Warren, S., Organic Chemistry, 2nd edition, "
    "Oxford University Press, 2012, chapter on conformational analysis."
)

LESSONS_ORG1_U3 = {
    "ORG1.ALKANENOMEN": Lesson(
        node="ORG1.ALKANENOMEN",
        objective=(
            "Convert a drawn alkane skeleton into its IUPAC name by choosing "
            "the parent chain, numbering it for lowest locants, and citing the "
            "substituents alphabetically, and run the conversion backwards "
            "from a name to a structure."
        ),
        build_on=(
            "Unit 2 left you able to draw a skeletal structure and read the "
            "carbon and hydrogen count off it. Naming is the same information "
            "written as a sentence, and the value of the sentence is that it "
            "is unambiguous: one structure, one name, in either direction."
        ),
        core_idea=(
            "Four steps, applied in order and never out of order. First find "
            "the longest continuous chain of carbons; that chain is the "
            "parent, and its length gives the stem, so five carbons is "
            "pentane. The chain does not have to be the one drawn "
            "horizontally, and if two chains tie for length you take the one "
            "carrying more substituents. Second, number the parent from "
            "whichever end reaches a substituent sooner; if both ends tie, "
            "compare the two full sets of locants and take the set that is "
            "lower at the first point where they differ. Third, name each "
            "branch as a substituent group, methyl for one carbon, ethyl for "
            "two, and give it the number of the parent carbon it hangs from. "
            "Fourth, assemble: substituents alphabetically, each with its "
            "locant, then the stem. A ring is named with the cyclo prefix and "
            "becomes the parent whenever it holds more carbons than the "
            "longest chain attached to it, which is why CH3 on a six carbon "
            "ring is methylcyclohexane."
        ),
        worked_example=(
            "Name the alkane whose skeleton is (CH3)2CH-CH2-CH(CH2CH3)-CH2CH2CH3. "
            "Step one, the parent. Trace from the leftmost methyl through the "
            "CH, the CH2, the branch carbon, and out along the propyl tail: "
            "that is seven carbons, so heptane. Check the alternative that "
            "leaves along the ethyl branch instead and you get only six, so "
            "seven wins and the ethyl group stays a substituent. Step two, "
            "numbering. From the left end the substituents land on carbons 2 "
            "and 4, giving the locant set 2,4. From the right end they land on "
            "4 and 6, giving 4,6. Compare at the first point of difference: 2 "
            "beats 4, so number from the left. Step three, the branches are a "
            "methyl on carbon 2 and an ethyl on carbon 4. Step four, alphabetise: "
            "ethyl comes before methyl, so the name is 4-ethyl-2-methylheptane. "
            "Note that alphabetical order decided the writing order, not the "
            "locants; the ethyl is cited first even though its number is higher."
        ),
        try_it_prompt=(
            "Name CH3-CH2-CH(CH3)-CH(CH3)-CH3. Find the parent chain first, "
            "then decide which end to number from, before you write anything "
            "down."
        ),
        try_it_answer=(
            "It is 2,3-dimethylpentane. The longest continuous chain is five "
            "carbons, so the stem is pentane, and two methyl groups hang off "
            "it. Numbering from the right reaches a methyl at carbon 2 and the "
            "second at carbon 3, giving the set 2,3. Numbering from the left "
            "gives 3,4. The first point of difference is 2 against 3, so 2,3 "
            "wins and the name is 2,3-dimethylpentane, not 3,4-dimethylpentane."
        ),
        pitfall=(
            "Two errors account for most wrong names. The first is taking the "
            "chain that happens to be drawn as a straight horizontal line to "
            "be the parent; the parent is the longest chain in the molecule, "
            "and a drawing can bury it around a corner. The second is "
            "alphabetising by locant instead of by name: the substituent cited "
            "first is the one that comes first in the alphabet, and its number "
            "may well be the larger one. When counting alphabetical order, "
            "ignore the multiplying prefixes di and tri, so diethyl still "
            "sorts under e, but do count the prefix in a name like isopropyl."
        ),
        claims=(
            Formula(ETHYLMETHYLHEPTANE, "C10H22", "4-ethyl-2-methylheptane"),
            Unsaturation(ETHYLMETHYLHEPTANE, 0, "saturated acyclic alkane"),
            Formula(DIMETHYLPENTANE_23, "C7H16", "2,3-dimethylpentane"),
            Formula(ETHYLMETHYLPENTANE, "C8H18", "3-ethyl-2-methylpentane"),
            Formula(METHYLBUTANE, "C5H12", "2-methylbutane"),
            Formula(NEOPENTANE, "C5H12", "2,2-dimethylpropane"),
            Formula(METHYLCYCLOHEXANE, "C7H14", "methylcyclohexane"),
            Unsaturation(METHYLCYCLOHEXANE, 1, "one ring, no pi bonds"),
            Relationship(
                METHYLBUTANE, NEOPENTANE, "constitutional",
                "two different C5H12 skeletons, so two different names",
            ),
        ),
    ),
    "ORG1.ISOMERS": Lesson(
        node="ORG1.ISOMERS",
        objective=(
            "Compute degrees of unsaturation from a molecular formula, and "
            "enumerate the constitutional isomers of a saturated formula "
            "systematically without duplicating a skeleton."
        ),
        build_on=(
            "You can now name a skeleton, which means you can tell two "
            "skeletons apart by naming both. That is exactly what enumerating "
            "isomers requires: a way to be sure the structure you drew fifth "
            "is not the structure you drew second in a different orientation."
        ),
        core_idea=(
            "Degrees of unsaturation counts rings plus pi bonds, and it comes "
            "straight from the formula: (2C + 2 + N - H) / 2, where halogens "
            "are counted as though they were hydrogens, oxygen and sulfur are "
            "ignored entirely, and each nitrogen adds one. The number is a "
            "budget. Zero degrees means the molecule is acyclic and fully "
            "saturated, so every structure you draw for it is a branched or "
            "unbranched chain. One degree means exactly one ring or one double "
            "bond, and no other option. Constitutional isomers are structures "
            "that share a molecular formula but differ in which atom is bonded "
            "to which, which makes them genuinely different compounds with "
            "different boiling points, not different drawings of the same "
            "thing. The way to enumerate them without missing or repeating one "
            "is to work down by parent chain length: draw the longest chain "
            "first, then shorten it by one and place the leftover carbons as "
            "branches in every distinct position, then shorten again."
        ),
        worked_example=(
            "Enumerate the constitutional isomers of C6H14. First the budget: "
            "(2 times 6, plus 2, minus 14) divided by 2 is zero, so there are "
            "no rings and no pi bonds, and every isomer is an acyclic "
            "saturated chain. Now work down by chain length. Six carbons in a "
            "row gives hexane. Five in a row leaves one methyl to place, and "
            "it can go on carbon 2 or carbon 3 of the pentane chain; carbon 4 "
            "is carbon 2 counted from the other end, and carbon 1 or 5 would "
            "make the chain six long again, so that gives 2-methylpentane and "
            "3-methylpentane. Four in a row leaves two methyls: both on carbon "
            "2 gives 2,2-dimethylbutane, one on carbon 2 and one on carbon 3 "
            "gives 2,3-dimethylbutane, and 3,3-dimethylbutane is 2,2 read from "
            "the other end. Three in a row cannot hold three extra carbons "
            "without recreating a longer chain. Five isomers, and the naming "
            "step is what proves none of them is a repeat."
        ),
        try_it_prompt=(
            "How many degrees of unsaturation does C6H12 have, and what does "
            "that permit? Give two structures with that formula that are "
            "constitutional isomers of each other."
        ),
        try_it_answer=(
            "One degree: (12 plus 2 minus 12) divided by 2 is 1. That permits "
            "exactly one ring or exactly one carbon-carbon double bond, and "
            "not both. Cyclohexane spends the degree on a ring and hex-1-ene "
            "spends it on a double bond, so they share the formula C6H12 and "
            "differ in connectivity, which makes them constitutional isomers. "
            "Methylcyclopentane is a third, spending the degree on a smaller "
            "ring."
        ),
        pitfall=(
            "The commonest error is counting the same skeleton twice because "
            "it was drawn in two orientations. 4-methylpentane is not a sixth "
            "isomer of C6H14; it is 2-methylpentane numbered from the wrong "
            "end, and the naming rules exist partly to catch that. The mirror "
            "error is treating a rotation about a single bond as a new isomer. "
            "A drawing with the chain bent is the same compound as the drawing "
            "with it straight, because nothing was disconnected. If you cannot "
            "tell whether two drawings are the same, name both; identical "
            "names mean one compound."
        ),
        claims=(
            Unsaturation(HEXANE, 0, "C6H14 has no rings and no pi bonds"),
            Unsaturation(METHYLPENTANE_2, 0),
            Unsaturation(DIMETHYLBUTANE_22, 0),
            Formula(HEXANE, "C6H14", "hexane"),
            Formula(METHYLPENTANE_2, "C6H14", "2-methylpentane"),
            Formula(METHYLPENTANE_3, "C6H14", "3-methylpentane"),
            Formula(DIMETHYLBUTANE_22, "C6H14", "2,2-dimethylbutane"),
            Formula(DIMETHYLBUTANE_23, "C6H14", "2,3-dimethylbutane"),
            Relationship(HEXANE, METHYLPENTANE_2, "constitutional"),
            Relationship(HEXANE, METHYLPENTANE_3, "constitutional"),
            Relationship(HEXANE, DIMETHYLBUTANE_22, "constitutional"),
            Relationship(HEXANE, DIMETHYLBUTANE_23, "constitutional"),
            Relationship(METHYLPENTANE_2, METHYLPENTANE_3, "constitutional"),
            Relationship(
                DIMETHYLBUTANE_22, DIMETHYLBUTANE_23, "constitutional",
                "the fourth and fifth of the five C6H14 skeletons",
            ),
            Unsaturation(CYCLOHEXANE, 1, "the degree is spent on a ring"),
            Unsaturation(HEX_1_ENE, 1, "the degree is spent on a pi bond"),
            Unsaturation(METHYLCYCLOPENTANE, 1),
            Relationship(
                CYCLOHEXANE, HEX_1_ENE, "constitutional",
                "one degree of unsaturation, spent two different ways",
            ),
            Relationship(CYCLOHEXANE, METHYLCYCLOPENTANE, "constitutional"),
            # The three C5H12 skeletons, distinguished by symmetry as well as
            # by connectivity: their proton environments differ, so they are
            # not one compound drawn three ways.
            Environments(PENTANE, (6, 4, 2), "three environments"),
            Environments(METHYLBUTANE, (6, 3, 2, 1), "four environments"),
            Environments(NEOPENTANE, (12,), "all twelve protons equivalent"),
            Relationship(PENTANE, METHYLBUTANE, "constitutional"),
            Relationship(PENTANE, NEOPENTANE, "constitutional"),
            Relationship(BUTANE, ISOBUTANE, "constitutional", "the two C4H10 skeletons"),
        ),
    ),
    "ORG1.NEWMAN": Lesson(
        node="ORG1.NEWMAN",
        objective=(
            "Draw a Newman projection along a chosen carbon-carbon bond, "
            "classify the conformation as staggered or eclipsed and as anti or "
            "gauche, and sketch the energy profile for a full rotation."
        ),
        build_on=(
            "The previous lesson established that rotating about a single bond "
            "does not make a new isomer. This lesson is about what it does make: "
            "conformations, which differ in energy, interconvert without "
            "breaking anything, and cannot be separated in a bottle."
        ),
        core_idea=(
            "A Newman projection is what you see sighting straight down one "
            "carbon-carbon bond. The front carbon is drawn as a point with "
            "three bonds radiating from it, the back carbon as a circle with "
            "three bonds coming off its rim, and the angle between a front "
            "bond and a back bond is the torsion angle. Two things raise the "
            "energy as that angle changes. Torsional strain appears when front "
            "and back bonds line up, the eclipsed arrangement, and vanishes "
            "when they sit 60 degrees apart, the staggered arrangement. Steric "
            "strain appears when two bulky groups are pushed close together "
            "whether or not they eclipse. Ethane feels only the first, because "
            "all six substituents are hydrogens, so its profile is three "
            "identical minima and three identical maxima. Butane sighted down "
            "its C2-C3 bond feels both, which splits the staggered "
            "conformations into anti, with the two methyls 180 degrees apart, "
            "and gauche, with them 60 degrees apart and slightly crowded."
        ),
        worked_example=(
            "Rotate butane through a full turn about C2-C3 and track the "
            "energy. Start at a torsion angle of 0 degrees, methyl directly "
            "eclipsing methyl: this is the worst point on the curve, because "
            "it pays torsional strain for the eclipse and steric strain for "
            "pressing the two largest groups together. Turn 60 degrees and you "
            "reach a staggered conformation with the methyls 60 degrees apart, "
            "gauche: a minimum, but not the lowest one, because the methyls "
            "are still near each other. Turn another 60 degrees to reach a "
            "methyl eclipsing a hydrogen, a maximum but a lower one than the "
            "first. At 180 degrees the methyls are as far apart as they can "
            "get and every bond is staggered: this is anti, the global "
            "minimum. Keep turning and the profile retraces itself through a "
            "second methyl-hydrogen eclipse, a second gauche minimum at 300 "
            "degrees, and back to the methyl-methyl eclipse. Three minima, "
            "three maxima, and neither set is all at the same height."
        ),
        try_it_prompt=(
            "Sighting down the C2-C3 bond of butane, how many energy minima "
            "appear in one full 360 degree rotation, which one is lowest, and "
            "what is the relationship between the other two?"
        ),
        try_it_answer=(
            "Three minima, all of them staggered. The one at 180 degrees is "
            "anti and is lowest, because the two methyl groups are as far "
            "apart as the bond allows. The other two, at 60 and 300 degrees, "
            "are both gauche and are equal in energy to each other: they are "
            "mirror images, so nothing can distinguish them energetically. "
            "Both sit above anti by the cost of holding the methyls close."
        ),
        pitfall=(
            "The belief that staggered means lowest. Gauche butane is fully "
            "staggered and is still not the preferred conformation, because "
            "torsional strain is not the only term. Staggered against eclipsed "
            "tells you about bond alignment; anti against gauche tells you "
            "about how close the big groups are. A second and more consequential "
            "error is treating anti and gauche butane as isomers that could be "
            "isolated. At room temperature rotation about a carbon-carbon "
            "single bond is fast enough that a sample is a rapidly "
            "interconverting population, and a bottle labelled anti-butane "
            "cannot exist."
        ),
        claims=(
            Formula(BUTANE, "C4H10", "butane"),
            Unsaturation(BUTANE, 0),
            Environments(
                BUTANE, (6, 4),
                "the two methyls are equivalent, so the two gauche "
                "conformations are mirror images and equal in energy",
            ),
            Formula(ETHANE, "C2H6", "ethane"),
            Environments(ETHANE, (6,), "all six protons equivalent"),
            Relationship(
                BUTANE, "C(C)CC", "identical",
                "SMILES cannot express a torsion angle, which is the point: "
                "anti and gauche butane are one compound, not two",
            ),
            Source(
                "The barrier to rotation about the carbon-carbon bond of "
                "ethane is approximately 12 kJ/mol, or about 2.9 kcal/mol, "
                "measured from the eclipsed maximum down to the staggered "
                "minimum.",
                CLAYDEN,
            ),
            Source(
                "In butane the gauche conformation lies approximately 3.8 "
                "kJ/mol, or about 0.9 kcal/mol, above the anti conformation, "
                "and the methyl-methyl eclipsed maximum lies roughly 19 kJ/mol, "
                "or about 4.5 kcal/mol, above anti.",
                ELIEL,
            ),
        ),
    ),
    "ORG1.RINGSTRAIN": Lesson(
        node="ORG1.RINGSTRAIN",
        objective=(
            "Break a cycloalkane's strain into angle strain, torsional strain "
            "and transannular steric strain, and use those three terms to rank "
            "ring sizes from most to least strained."
        ),
        build_on=(
            "You can already read torsional strain off a Newman projection of "
            "an open chain. A ring is a chain that cannot rotate freely, so "
            "the same analysis applies with a constraint bolted on, and the "
            "constraint is what creates strain."
        ),
        core_idea=(
            "Three separate penalties add up to a ring's strain, and keeping "
            "them separate is what makes the topic tractable. Angle strain is "
            "the cost of forcing a carbon's bond angles away from the "
            "tetrahedral value near 109.5 degrees. Torsional strain is the "
            "cost of eclipsed bonds around the ring, exactly as in an open "
            "chain. Transannular strain is the cost of atoms on opposite sides "
            "of a ring pressing into each other, which only appears once a "
            "ring is big enough to fold back on itself. The critical "
            "correction to the naive picture is that rings are not flat. A "
            "regular polygon's interior angle predicts angle strain only if "
            "the ring is planar, and other than cyclopropane, which has three "
            "atoms and therefore no choice, every ring puckers. Puckering "
            "trades a small amount of angle strain for a large relief of "
            "torsional strain, and for a six-membered ring it removes both "
            "almost completely."
        ),
        worked_example=(
            "Compare cyclopropane with cyclohexane. Cyclopropane has three "
            "carbons, and three points define a plane, so it cannot pucker at "
            "all. Its internal angles are those of an equilateral triangle, 60 "
            "degrees, which is about 49 degrees away from tetrahedral, so the "
            "angle strain is severe. Being locked flat also means every "
            "carbon-hydrogen bond eclipses its neighbour on the next carbon, "
            "so it pays full torsional strain on top. There is no transannular "
            "term because the ring is too small to have an inside. Now "
            "cyclohexane. A flat regular hexagon would have 120 degree "
            "interior angles, which is off tetrahedral, and would eclipse all "
            "twelve carbon-hydrogen bonds. But cyclohexane is free to fold, "
            "and folding into the chair brings the carbon-carbon-carbon angles "
            "back close to tetrahedral while staggering every bond around the "
            "ring. Both penalties go to nearly zero, which is why cyclohexane "
            "is taken as the strain-free reference."
        ),
        try_it_prompt=(
            "A planar regular pentagon has interior angles of 108 degrees, "
            "which is within two degrees of tetrahedral. So why is cyclopentane "
            "not strain-free, and why does it pucker rather than stay flat?"
        ),
        try_it_answer=(
            "Because angle strain is not the only term. A flat cyclopentane "
            "would indeed have almost no angle strain, but it would hold all "
            "ten carbon-hydrogen bonds eclipsed with their neighbours, and "
            "that torsional strain is substantial. So the ring puckers into an "
            "envelope shape, lifting one carbon out of the plane of the other "
            "four. That reintroduces a little angle strain and relieves much "
            "more torsional strain, so the total drops. Cyclopentane ends up "
            "with small but non-zero strain."
        ),
        pitfall=(
            "Baeyer's planar assumption, which is still the intuition most "
            "learners arrive with. Predicting strain from the interior angle "
            "of a regular polygon gives roughly the right answer for "
            "cyclopropane and cyclobutane, gets cyclopentane right for the "
            "wrong reason, and fails badly from cyclohexane onward: it "
            "predicts that rings should get steadily more strained as they "
            "grow, when in fact large rings are close to strain-free because "
            "they can adopt conformations with tetrahedral angles and "
            "staggered bonds throughout. Only cyclopropane is genuinely "
            "planar."
        ),
        claims=(
            Formula(CYCLOPROPANE, "C3H6", "cyclopropane"),
            Unsaturation(CYCLOPROPANE, 1, "the ring is the one degree"),
            Formula(CYCLOBUTANE, "C4H8", "cyclobutane"),
            Unsaturation(CYCLOBUTANE, 1),
            Formula(CYCLOPENTANE, "C5H10", "cyclopentane"),
            Unsaturation(CYCLOPENTANE, 1),
            Formula(CYCLOHEXANE, "C6H12", "cyclohexane"),
            Unsaturation(CYCLOHEXANE, 1),
            Formula(CYCLOHEPTANE, "C7H14", "cycloheptane"),
            Unsaturation(CYCLOHEPTANE, 1),
            Relationship(
                CYCLOHEXANE, METHYLCYCLOPENTANE, "constitutional",
                "same formula, different ring size, very different strain",
            ),
            Environments(
                CYCLOPROPANE, (6,),
                "all six protons equivalent, consistent with a flat "
                "symmetric ring",
            ),
            Source(
                "Total strain energies from heats of combustion are "
                "approximately 115 kJ/mol for cyclopropane, 110 kJ/mol for "
                "cyclobutane, 26 kJ/mol for cyclopentane, essentially zero for "
                "cyclohexane, and around 26 kJ/mol for cycloheptane. Per CH2 "
                "group this makes cyclopropane the most strained ring, "
                "cyclobutane close behind, and cyclohexane the reference "
                "point.",
                CAREY,
            ),
        ),
    ),
    "ORG1.CHAIR": Lesson(
        node="ORG1.CHAIR",
        objective=(
            "Draw the cyclohexane chair, identify which bond at each carbon is "
            "axial and which is equatorial, and predict exactly what a ring "
            "flip changes and what it leaves alone."
        ),
        build_on=(
            "You know from the previous lesson that cyclohexane escapes both "
            "angle and torsional strain by puckering. This lesson names the "
            "shape it puckers into and reads the geometry off it."
        ),
        core_idea=(
            "In the chair, the six carbons alternate: three sit slightly above "
            "the mean plane of the ring and three slightly below. Each carbon "
            "carries two hydrogens in geometrically distinct positions. The "
            "axial bond runs parallel to the ring's main axis, straight up on "
            "an up-carbon and straight down on a down-carbon, so axial "
            "directions alternate as you walk around the ring. The equatorial "
            "bond points outward around the rim, tilted slightly the opposite "
            "way from its own carbon's axial bond. Sight down any "
            "carbon-carbon bond of a chair and you see a staggered Newman "
            "projection, which is the geometric statement of why the chair is "
            "unstrained. The chair is not rigid: it inverts to the other chair "
            "through a half-chair transition state and a twist-boat "
            "intermediate, and this ring flip has one crucial property. It "
            "exchanges axial and equatorial at every carbon, and it does not "
            "move any substituent from one face of the ring to the other."
        ),
        worked_example=(
            "Follow one position through a flip. Take carbon 1 in the "
            "up-position, and put a substituent on its axial bond, so the "
            "substituent points straight up. Now flip the ring: carbon 1 moves "
            "from above the mean plane to below it. The bond that was axial and "
            "pointing up is now equatorial, because carbon 1 is a down-carbon "
            "and its axial direction is now downward, so the upward-tilting "
            "bond must be the equatorial one. The substituent has changed from "
            "axial to equatorial. Ask where it points: still up, because "
            "nothing was disconnected and a group cannot cross to the other "
            "face of a ring without a bond breaking. That is the whole content "
            "of a ring flip in one sentence. Axial and equatorial swap; up and "
            "down do not."
        ),
        try_it_prompt=(
            "A methyl group sits on an axial bond pointing up. The ring flips. "
            "Is the methyl now axial or equatorial, and is it pointing up or "
            "down? Answer both parts before reading on."
        ),
        try_it_answer=(
            "Equatorial, and still up. The flip inverts the ring's pucker, so "
            "every axial bond becomes equatorial and every equatorial bond "
            "becomes axial. It cannot change which face of the ring the methyl "
            "occupies, because doing so would require breaking the "
            "carbon-carbon bond that holds it. Conformation changed; "
            "configuration did not."
        ),
        pitfall=(
            "Believing that a ring flip can turn a cis compound into a trans "
            "one. It cannot, and the two words describe different kinds of "
            "thing. Axial against equatorial is conformation, reachable by "
            "rotation alone, and the two chairs of a molecule are one compound. "
            "Cis against trans is configuration, reachable only by breaking a "
            "bond, and the two are different compounds that can be separated. "
            "A second, more mechanical error is drawing chairs with the axial "
            "bonds slanted; draw them strictly vertical and alternating up, "
            "down, up, down, and most chair problems become bookkeeping."
        ),
        claims=(
            Formula(CYCLOHEXANE, "C6H12", "cyclohexane"),
            Unsaturation(CYCLOHEXANE, 1),
            Environments(
                CYCLOHEXANE, (12,),
                "graph symmetry makes all twelve protons equivalent. That is "
                "a constitutional statement, not a model of the flip, but it "
                "matches what is observed: at room temperature ring inversion "
                "is fast enough to average axial and equatorial into one "
                "signal",
            ),
            Relationship(
                CYCLOHEXANE, "[CH2]1[CH2][CH2][CH2][CH2][CH2]1", "identical",
                "two writings, one compound; the two chairs are conformations "
                "of the same molecule and no notation distinguishes them",
            ),
            Source(
                "Cyclohexane ring inversion has a free energy barrier on the "
                "order of 45 kJ/mol, near 10.8 kcal/mol, measured by variable "
                "temperature NMR; texts quote values in the range of about "
                "10.3 to 10.8 kcal/mol. The barrier is low enough that the "
                "flip is fast at room temperature and high enough that cooling "
                "well below room temperature freezes it out and separate axial "
                "and equatorial signals appear.",
                CLAYDEN,
            ),
            Source(
                "The chair is the global minimum. The twist-boat is a shallow "
                "local minimum above it, and the half-chair is the transition "
                "state connecting chair to twist-boat, so the ordering by "
                "energy is chair below twist-boat below boat below half-chair.",
                ELIEL,
            ),
        ),
    ),
    "ORG1.AVALUES": Lesson(
        node="ORG1.AVALUES",
        objective=(
            "Use an A value to decide which chair a monosubstituted "
            "cyclohexane prefers, and convert that energy difference into the "
            "actual ratio of the two chairs at equilibrium."
        ),
        build_on=(
            "You know a ring flip swaps axial and equatorial. Once a "
            "substituent is on the ring, the two chairs stop being equivalent, "
            "and this lesson is about how far from equivalent they get."
        ),
        core_idea=(
            "An axial substituent on carbon 1 points into the same region of "
            "space as the axial hydrogens on carbons 3 and 5, because axial "
            "directions alternate and those three positions all point the same "
            "way. That crowding is the 1,3-diaxial interaction, and it is the "
            "reason axial is worse than equatorial. The A value of a group is "
            "the free energy difference between the two chairs of the "
            "monosubstituted cyclohexane, quoted as a positive number because "
            "equatorial is always the favoured side. What sets an A value is "
            "how wide the group is close to the ring, not its molecular "
            "weight, which is why the ordering runs methyl below ethyl below "
            "isopropyl below tert-butyl, with tert-butyl far out ahead of the "
            "rest rather than one step further along. Ethyl and isopropyl can "
            "rotate their extra carbons away from the ring; tert-butyl has "
            "three methyls and cannot point all of them away, so one is always "
            "aimed at the 1,3-diaxial hydrogens."
        ),
        worked_example=(
            "Turn the methyl A value into a population. The equilibrium "
            "constant between the two chairs is K equals exp of the free "
            "energy difference divided by RT. At 298 K, R times T is about "
            "2.48 kJ/mol. Methylcyclohexane has an A value near 7.3 kJ/mol, so "
            "the exponent is 7.3 divided by 2.48, which is about 2.94, and K "
            "is about 19. A ratio of 19 to 1 is 95 percent equatorial and 5 "
            "percent axial. Read what that says: the axial chair is not "
            "forbidden, it is a real and measurable 5 percent of the sample, "
            "and the ring is interconverting between the two chairs rapidly at "
            "room temperature. Now push the same arithmetic to tert-butyl, "
            "whose A value "
            "is above 20 kJ/mol. The exponent passes 8, K passes 3000, and the "
            "equatorial fraction passes 99.9 percent. That is why a tert-butyl "
            "group is used as a conformational anchor: it does not truly lock "
            "the ring, it makes the other chair too rare to matter."
        ),
        try_it_prompt=(
            "A substituent has an A value about three times that of methyl. Is "
            "its equatorial preference about three times as strong as methyl's "
            "19 to 1, or something else? Reason from the form of the equation "
            "before estimating a number."
        ),
        try_it_answer=(
            "Far more than three times. The ratio depends on the exponential "
            "of the energy difference, so tripling the energy cubes the ratio "
            "rather than tripling it: exp of 3x equals the cube of exp of x. "
            "Methyl's 19 to 1 becomes roughly 19 cubed, near 7000 to 1. This "
            "is why a modest looking increase in A value moves a substituent "
            "from mostly equatorial to effectively always equatorial."
        ),
        pitfall=(
            "Ranking A values by molecular weight or by carbon count. A bromine "
            "atom is far heavier than a methyl group and has a smaller "
            "conformational preference, because the carbon-bromine bond is long "
            "and holds the bromine away from the 1,3-diaxial hydrogens. What "
            "matters is width near the ring and how far the bond holds the "
            "group out. The second trap is adding A values freely on a "
            "polysubstituted ring. Adding them is a fair approximation when the "
            "substituents do not touch each other, as in a 1,4 or a trans-1,3 "
            "arrangement, and it breaks down for adjacent groups, where a "
            "gauche interaction between the two substituents enters that no "
            "single-substituent A value ever measured."
        ),
        claims=(
            Formula(METHYLCYCLOHEXANE, "C7H14", "methylcyclohexane"),
            Unsaturation(METHYLCYCLOHEXANE, 1),
            Formula(ETHYLCYCLOHEXANE, "C8H16", "ethylcyclohexane"),
            Formula(ISOPROPYLCYCLOHEXANE, "C9H18", "isopropylcyclohexane"),
            Formula(TERTBUTYLCYCLOHEXANE, "C10H20", "tert-butylcyclohexane"),
            Unsaturation(TERTBUTYLCYCLOHEXANE, 1),
            Relationship(
                METHYLCYCLOHEXANE, "C1(C)CCCCC1", "identical",
                "the axial-methyl chair and the equatorial-methyl chair are "
                "one compound in two conformations, not two isomers",
            ),
            Relationship(
                ETHYLCYCLOHEXANE, "CC1CCCCC1C", "constitutional",
                "ethylcyclohexane and a dimethylcyclohexane share C8H16 and "
                "differ in connectivity",
            ),
            Source(
                "Conformational free energy differences (A values) are "
                "approximately 7.3 kJ/mol for methyl (about 1.7 kcal/mol), "
                "approximately 7.5 kJ/mol for ethyl (about 1.8 kcal/mol), "
                "approximately 9.2 kJ/mol for isopropyl (about 2.2 kcal/mol), "
                "and greater than 20 kJ/mol for tert-butyl (reported as "
                "greater than about 4.5 kcal/mol, since the axial population "
                "is too small to measure precisely). The ordering methyl, "
                "ethyl, isopropyl, tert-butyl is the durable result; the "
                "individual numbers vary slightly between compilations.",
                ELIEL,
            ),
            Source(
                "The equilibrium constant between two conformations is related "
                "to their free energy difference by K equals exp(dG/RT), with "
                "RT approximately 2.48 kJ/mol at 298 K.",
                "Standard thermodynamic relation; see any physical chemistry "
                "text, for example Atkins, P. and de Paula, J., Physical "
                "Chemistry, chapter on chemical equilibrium.",
            ),
        ),
    ),
    "ORG1.CISTRANSRING": Lesson(
        node="ORG1.CISTRANSRING",
        objective=(
            "Assign cis or trans to a disubstituted ring, show that the two "
            "are diastereomers rather than conformers, and combine ring "
            "stereochemistry with chair analysis to decide which is more "
            "stable."
        ),
        build_on=(
            "You can flip a chair and you know the flip cannot move a group "
            "from one face of the ring to the other. That impossibility is "
            "exactly what makes cis and trans two different compounds, and "
            "this lesson cashes it out."
        ),
        core_idea=(
            "A ring has two faces. Two substituents on the same face are cis, "
            "and on opposite faces trans. Because reaching the other face "
            "requires breaking a bond, cis and trans are configurational "
            "isomers: same molecular formula, same connectivity, different "
            "fixed spatial arrangement, and not mirror images of each other. "
            "That combination is the definition of diastereomers, so they have "
            "different melting points, different boiling points and different "
            "energies, and can be separated. Now layer the chair on top. "
            "Because axial directions alternate around the ring, the "
            "relationship between cis or trans and diequatorial depends on how "
            "far apart the substituents are. For a 1,2 or a 1,4 pair, it is "
            "trans that can put both groups equatorial. For a 1,3 pair, it is "
            "cis. The alternation is the whole reason, and it is worth "
            "rederiving each time rather than memorising."
        ),
        worked_example=(
            "Work out which diastereomer of 1,2-dimethylcyclohexane is more "
            "stable. Carbons 1 and 2 are adjacent, so their axial directions "
            "are opposite: if the axial bond at carbon 1 points up, the axial "
            "bond at carbon 2 points down. Take the trans isomer, methyls on "
            "opposite faces. One chair puts both methyls equatorial, and the "
            "flipped chair puts both axial; the diequatorial chair dominates "
            "heavily, so trans spends most of its time with no 1,3-diaxial "
            "penalty at all. Now the cis isomer, methyls on the same face. "
            "Because the axial directions at carbons 1 and 2 are opposite, "
            "same-face means one methyl is axial and the other equatorial. "
            "Flip the ring and you get the mirror situation, the other methyl "
            "axial; the two chairs are equal in energy and neither escapes "
            "having one methyl axial. So trans-1,2-dimethylcyclohexane is the "
            "more stable diastereomer. There is a bonus result in the "
            "stereochemistry: cis-1,2-dimethylcyclohexane has an internal "
            "mirror plane and is a meso compound, while trans exists as a pair "
            "of enantiomers."
        ),
        try_it_prompt=(
            "Which is more stable, cis- or trans-1,3-dimethylcyclohexane? Work "
            "from the alternation of axial directions around the ring, not "
            "from the answer you got for the 1,2 case."
        ),
        try_it_answer=(
            "Cis, which is the opposite of the 1,2 result. Axial directions "
            "alternate, so carbons 1 and 3, two apart, have their axial bonds "
            "pointing the same way. Same-face therefore means the two methyls "
            "can be both axial or, after a flip, both equatorial, and the "
            "diequatorial chair wins. The trans isomer has the methyls on "
            "opposite faces, which for a 1,3 pair forces one axial and one "
            "equatorial in either chair. So cis-1,3-dimethylcyclohexane is the "
            "more stable diastereomer."
        ),
        pitfall=(
            "The rule people carry away is trans is more stable, and it is not "
            "a rule, it is the answer to the 1,2 case. Whether cis or trans "
            "achieves diequatorial alternates with the substitution pattern: "
            "trans for 1,2, cis for 1,3, trans for 1,4. The second trap is "
            "assuming that if two ring stereoisomers exist they must be a "
            "chiral pair. Cis-1,2- and cis-1,3-dimethylcyclohexane are meso, "
            "and both forms of 1,4-dimethylcyclohexane are achiral, because a "
            "mirror plane runs through carbons 1 and 4. Cis and trans are "
            "diastereomers of each other in every one of those cases, whether "
            "or not either one happens to be chiral."
        ),
        claims=(
            Formula(CIS_12_DIMETHYL, "C8H16", "cis-1,2-dimethylcyclohexane"),
            Unsaturation(CIS_12_DIMETHYL, 1),
            Stereo(CIS_12_DIMETHYL, ("R", "S"), "the cis isomer is meso"),
            Stereo(TRANS_12_RR, ("R", "R"), "one enantiomer of the trans isomer"),
            Stereo(TRANS_12_SS, ("S", "S"), "the other"),
            Relationship(
                CIS_12_DIMETHYL, TRANS_12_RR, "diastereomers",
                "cis and trans on a ring: same connectivity, different "
                "configuration, not mirror images",
            ),
            Relationship(CIS_12_DIMETHYL, TRANS_12_SS, "diastereomers"),
            Relationship(
                TRANS_12_RR, TRANS_12_SS, "enantiomers",
                "the trans isomer is chiral and exists as a pair",
            ),
            Relationship(
                CIS_12_DIMETHYL, CIS_12_MIRROR, "identical",
                "the cis isomer is superimposable on its mirror image, which "
                "is what meso means",
            ),
            Stereo(CIS_13_DIMETHYL, ("R", "S"), "cis-1,3-dimethylcyclohexane, meso"),
            Stereo(TRANS_13_RR, ("R", "R")),
            Stereo(TRANS_13_SS, ("S", "S")),
            Relationship(
                CIS_13_DIMETHYL, TRANS_13_RR, "diastereomers",
                "the 1,3 pair, where cis is the diequatorial-capable one",
            ),
            Relationship(TRANS_13_RR, TRANS_13_SS, "enantiomers"),
            Relationship(CIS_13_DIMETHYL, CIS_13_MIRROR, "identical", "meso"),
            # The 1,4 pair is proved achiral rather than related directly.
            # are_enantiomers reports this pair as enantiomers, which is wrong:
            # it sees every descriptor inverted and does not notice that both
            # structures are their own mirror images. Showing each is identical
            # to its mirror image establishes both are achiral, and two achiral
            # compounds cannot be an enantiomeric pair.
            Formula(CIS_14_DIMETHYL, "C8H16", "cis-1,4-dimethylcyclohexane"),
            Relationship(
                CIS_14_DIMETHYL, CIS_14_MIRROR, "identical",
                "cis-1,4 is achiral: a mirror plane runs through carbons 1 "
                "and 4",
            ),
            Relationship(
                TRANS_14_DIMETHYL, TRANS_14_MIRROR, "identical",
                "trans-1,4 is achiral too, so the 1,4 cis and trans forms are "
                "diastereomers and cannot be enantiomers",
            ),
            Relationship(
                CIS_12_DIMETHYL, CIS_13_DIMETHYL, "constitutional",
                "1,2 and 1,3 substitution are different connectivities, not "
                "different stereochemistry",
            ),
            Relationship(ETHYLCYCLOHEXANE, CIS_12_DIMETHYL, "constitutional"),
        ),
    ),
}
