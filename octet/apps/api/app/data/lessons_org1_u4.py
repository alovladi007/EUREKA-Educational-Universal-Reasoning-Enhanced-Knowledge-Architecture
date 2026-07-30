"""ORG1 Unit 4: Stereochemistry.

Every structural fact in these lessons carries a claim that is re-derived from
the structure by RDKit when the test suite runs. If a descriptor here is wrong,
the build fails; it does not ship and get discovered by a learner.

That matters more in this unit than anywhere else in the program. Stereo-
chemistry is where a confident sentence and a correct sentence look identical,
and it is the unit where the author of this file has already been caught
getting textbook facts wrong.
"""

from __future__ import annotations

from app.data.claims import Environments, Formula, Relationship, Source, Stereo, Unsaturation
from app.data.lesson_types import Lesson

# Structures used across the unit, named once so a claim and its prose cannot
# drift apart.
GLYCERALDEHYDE_R = "OC[C@@H](O)C=O"
GLYCERALDEHYDE_S = "OC[C@H](O)C=O"
BUTAN_2_OL_R = "CC[C@@H](C)O"
BUTAN_2_OL_S = "CC[C@H](C)O"
TARTARIC_RR = "O[C@@H](C(=O)O)[C@@H](O)C(=O)O"
TARTARIC_SS = "O[C@H](C(=O)O)[C@H](O)C(=O)O"
TARTARIC_MESO = "O[C@@H](C(=O)O)[C@H](O)C(=O)O"
# 3-chlorobutan-2-ol, enumerated by reading descriptors back from RDKit rather
# than by reasoning about which @ goes where. Writing these by hand produced
# S,R when R,R was intended, which the claim checker caught.
CHLOROBUTANOL_RR = "C[C@@H](O)[C@H](Cl)C"
CHLOROBUTANOL_SS = "C[C@H](O)[C@@H](Cl)C"
CHLOROBUTANOL_RS = "C[C@@H](O)[C@@H](Cl)C"

LESSONS_ORG1_U4 = {
    "ORG1.CHIRALITY": Lesson(
        node="ORG1.CHIRALITY",
        objective=(
            "Decide whether a molecule is chiral by testing it for a mirror "
            "plane, and identify the carbons that make it so."
        ),
        build_on=(
            "You already know from Unit 3 that a carbon with four single bonds "
            "sits at the centre of a tetrahedron. Chirality is what happens "
            "when the four things at its corners are all different."
        ),
        core_idea=(
            "A molecule is chiral when it cannot be superimposed on its own "
            "mirror image, the way your left hand cannot be laid onto your "
            "right. The usual cause is a carbon bonded to four different "
            "groups, called a stereocentre. The reliable test is not counting "
            "stereocentres though, it is looking for an internal mirror plane: "
            "a molecule with one is achiral no matter how many stereocentres "
            "it has. Butan-2-ol is chiral because C2 carries a methyl, an "
            "ethyl, a hydroxyl and a hydrogen, four different groups, and no "
            "plane divides the molecule into mirrored halves."
        ),
        worked_example=(
            "Take butan-2-ol, CH3CH(OH)CH2CH3. Number the chain and look at "
            "C2. Its four attachments are OH, H, CH3, and CH2CH3. Are any two "
            "the same? Methyl and ethyl differ, so no. C2 is a stereocentre. "
            "Now check the whole molecule for a mirror plane: any plane you "
            "try either cuts through C2 leaving the methyl on one side and the "
            "ethyl on the other, which are not mirror images of each other, or "
            "misses the molecule entirely. No internal mirror plane, so "
            "butan-2-ol is chiral and exists as two non-superimposable forms."
        ),
        try_it_prompt=(
            "Propan-2-ol is CH3CH(OH)CH3. Is it chiral? Work from C2's four "
            "attachments before answering."
        ),
        try_it_answer=(
            "It is achiral. C2 carries OH, H, and two methyl groups. Two of "
            "the four attachments are identical, so C2 is not a stereocentre, "
            "and the plane containing OH, H and C2 reflects one methyl onto "
            "the other. A molecule with an internal mirror plane is achiral."
        ),
        pitfall=(
            "The trap is treating carbon count or complexity as the signal. A "
            "large molecule can be achiral and a small one chiral; what "
            "decides it is whether the mirror image is superimposable. Counting "
            "stereocentres is a shortcut that fails on meso compounds, which "
            "you will meet later in this unit with two stereocentres and no "
            "chirality at all."
        ),
        claims=(
            Formula(BUTAN_2_OL_R, "C4H10O", "butan-2-ol"),
            Stereo(BUTAN_2_OL_R, ("R",), "one stereocentre at C2"),
            Stereo(BUTAN_2_OL_S, ("S",), "its mirror image"),
            Relationship(
                BUTAN_2_OL_R, BUTAN_2_OL_S, "enantiomers",
                "non-superimposable mirror images",
            ),
        ),
    ),
    "ORG1.RS": Lesson(
        node="ORG1.RS",
        objective=(
            "Assign R or S to a stereocentre by ranking its four substituents "
            "with the Cahn-Ingold-Prelog rules and reading the rotation with "
            "the lowest priority pointing away."
        ),
        build_on=(
            "You can already find a stereocentre. Naming which of its two "
            "arrangements you are looking at is the next step, and it needs "
            "one ranking rule applied consistently."
        ),
        core_idea=(
            "Rank the four groups by atomic number at the first point of "
            "difference: the atom directly attached decides first, and ties "
            "are broken by looking outward one sphere at a time. Then orient "
            "the molecule so the lowest priority group points away from you "
            "and trace 1 to 2 to 3. Clockwise is R, counterclockwise is S. "
            "A double bond counts as two connections to the duplicated atom, "
            "so a CHO carbon reads as (O, O, H)."
        ),
        worked_example=(
            "Assign the stereocentre of glyceraldehyde, OHC-CH(OH)-CH2OH. The "
            "central carbon carries OH, CHO, CH2OH and H. Rank them: oxygen "
            "beats carbon, so OH is 1 and H is 4. Between CHO and CH2OH both "
            "attach through carbon, so look at what each carbon holds. CHO "
            "gives (O, O, H) because the double bond duplicates the oxygen. "
            "CH2OH gives (O, H, H). Comparing the sets in order, the first is "
            "higher at the second position, so CHO is 2 and CH2OH is 3. Put H "
            "away from you and read OH to CHO to CH2OH. For the enantiomer "
            "drawn as (R)-glyceraldehyde that path runs clockwise, giving R."
        ),
        try_it_prompt=(
            "In butan-2-ol the stereocentre carries OH, CH3, CH2CH3 and H. "
            "Rank those four groups from highest to lowest priority. Then, for "
            "the enantiomer in which the lowest priority group points away from "
            "you and the path from priority 1 to 2 to 3 runs clockwise, assign "
            "R or S."
        ),
        try_it_answer=(
            "OH is 1, since oxygen outranks carbon. H is 4, the lowest atomic "
            "number. Between the two carbon groups, ethyl's carbon holds "
            "(C, H, H) and methyl's holds (H, H, H), so ethyl is 2 and methyl "
            "is 3. The full ranking is OH, CH2CH3, CH3, H. With the lowest "
            "priority group pointing away, a clockwise 1 to 2 to 3 path is R by "
            "the CIP convention, so this arrangement is (R)-butan-2-ol."
        ),
        pitfall=(
            "The most common error is ranking by group size or by how many "
            "atoms a substituent contains. Priority is decided atom by atom "
            "outward from the stereocentre, and it stops at the first point of "
            "difference. A tert-butyl group is bulky but its first atom is "
            "carbon, so it loses to a single oxygen every time."
        ),
        claims=(
            Stereo(GLYCERALDEHYDE_R, ("R",), "(R)-glyceraldehyde"),
            Stereo(GLYCERALDEHYDE_S, ("S",), "(S)-glyceraldehyde"),
            Formula(GLYCERALDEHYDE_R, "C3H6O3", "glyceraldehyde"),
            Stereo(BUTAN_2_OL_R, ("R",), "(R)-butan-2-ol"),
        ),
    ),
    "ORG1.ENANTIODIA": Lesson(
        node="ORG1.ENANTIODIA",
        objective=(
            "Classify a pair of stereoisomers as enantiomers, diastereomers, "
            "or the same compound, and recognise a meso compound when you meet "
            "one."
        ),
        build_on=(
            "You can assign R and S to each stereocentre. Comparing two "
            "molecules is now a matter of comparing those assignments, with "
            "one important exception this lesson is mostly about."
        ),
        core_idea=(
            "Two stereoisomers with the same constitution are enantiomers when "
            "every stereocentre is inverted, and diastereomers when some are "
            "inverted and some are not. The exception is the meso compound: a "
            "molecule with stereocentres that nonetheless has an internal "
            "mirror plane, so it is achiral and identical to its own mirror "
            "image. Tartaric acid has two stereocentres and three stereo"
            "isomers rather than four, because the R,S form and the S,R form "
            "are the same molecule."
        ),
        worked_example=(
            "Tartaric acid, HOOC-CH(OH)-CH(OH)-COOH, has two stereocentres, so "
            "you might expect four stereoisomers. Write them out: R,R and S,S "
            "and R,S and S,R. The first two are mirror images at every centre, "
            "so they are enantiomers. Now look at R,S. Its mirror image is "
            "S,R, but the molecule has a mirror plane running between the two "
            "central carbons, and reflecting through it turns R,S into itself. "
            "R,S and S,R are one compound, the meso form, and it is achiral. "
            "So there are three stereoisomers: a pair of enantiomers and an "
            "achiral meso compound, which is a diastereomer of both."
        ),
        try_it_prompt=(
            "How many stereoisomers does tartaric acid have, and what is the "
            "relationship between the meso form and the R,R form?"
        ),
        try_it_answer=(
            "Three, not four. The meso form is a diastereomer of R,R: they "
            "have the same constitution and differ in configuration, but they "
            "are not mirror images, since the mirror image of R,R is S,S."
        ),
        pitfall=(
            "The trap is the 2 to the n rule. Two stereocentres suggest four "
            "stereoisomers, and for tartaric acid there are three, because the "
            "molecule's internal symmetry collapses two of the four onto one "
            "compound. Treat 2 to the n as an upper bound and check for a "
            "mirror plane whenever the two halves of a molecule look alike."
        ),
        claims=(
            Stereo(TARTARIC_RR, ("R", "R"), "the R,R enantiomer"),
            Stereo(TARTARIC_SS, ("S", "S"), "the S,S enantiomer"),
            Stereo(TARTARIC_MESO, ("R", "S"), "the meso form"),
            Relationship(TARTARIC_RR, TARTARIC_SS, "enantiomers"),
            Relationship(TARTARIC_RR, TARTARIC_MESO, "diastereomers"),
            Relationship(TARTARIC_SS, TARTARIC_MESO, "diastereomers"),
            Relationship(
                TARTARIC_MESO, "O[C@H](C(=O)O)[C@@H](O)C(=O)O", "identical",
                "the meso form is its own mirror image, so R,S and S,R name "
                "one compound",
            ),
            Formula(TARTARIC_RR, "C4H6O6", "tartaric acid"),
        ),
    ),
    "ORG1.OPTICALACTIVITY": Lesson(
        node="ORG1.OPTICALACTIVITY",
        objective=(
            "Relate a sample's measured rotation to its composition, and "
            "calculate enantiomeric excess from an observed specific rotation."
        ),
        build_on=(
            "You know enantiomers are different compounds with identical "
            "constitutions. Optical activity is the property that lets you "
            "tell them apart in a flask."
        ),
        core_idea=(
            "A chiral compound rotates plane polarized light, and its "
            "enantiomer rotates it by exactly the same magnitude in the "
            "opposite direction. Specific rotation is that effect normalised "
            "for path length and concentration, which makes it a property of "
            "the compound rather than of the sample. A 50:50 mixture of "
            "enantiomers, called a racemate, rotates light not at all, because "
            "the two contributions cancel. Enantiomeric excess is the observed "
            "rotation divided by the pure enantiomer's rotation, expressed as "
            "a percentage, and it equals the excess of one enantiomer over the "
            "other."
        ),
        worked_example=(
            "A sample of a compound whose pure enantiomer has a specific "
            "rotation of +12.0 degrees is measured at +9.0 degrees under the "
            "same conditions. Enantiomeric excess is 9.0 divided by 12.0, "
            "which is 0.75, so 75 percent. That excess is the amount by which "
            "one enantiomer exceeds the other, so the remaining 25 percent of "
            "the sample is racemic and splits evenly. The composition is 75 "
            "plus half of 25, giving 87.5 percent of the dextrorotatory "
            "enantiomer and 12.5 percent of its mirror image."
        ),
        try_it_prompt=(
            "A sample reads +6.0 degrees where the pure enantiomer reads "
            "+12.0 degrees. What is the enantiomeric excess, and what fraction "
            "of the sample is the minor enantiomer?"
        ),
        try_it_answer=(
            "The excess is 6.0 over 12.0, or 50 percent. The other 50 percent "
            "is racemic and divides evenly, so the sample is 75 percent one "
            "enantiomer and 25 percent the other."
        ),
        pitfall=(
            "Enantiomeric excess is not the percentage of the major "
            "enantiomer. A 75 percent excess means 87.5 percent of one and "
            "12.5 percent of the other, because the excess counts only the "
            "unmatched portion. Reading it as a composition overstates purity "
            "every time."
        ),
        claims=(
            Source(
                "Specific rotation is defined as the observed rotation divided "
                "by path length in decimetres and concentration in grams per "
                "millilitre, reported at the sodium D line and a stated "
                "temperature.",
                "IUPAC Compendium of Chemical Terminology (the Gold Book), "
                "entry for specific optical rotatory power.",
            ),
        ),
    ),
    "ORG1.FISCHER": Lesson(
        node="ORG1.FISCHER",
        objective=(
            "Read and assign configuration from a Fischer projection, and "
            "apply the manipulations that preserve configuration."
        ),
        build_on=(
            "Assigning R and S from a three dimensional drawing takes effort. "
            "A Fischer projection is a flat shorthand that keeps the "
            "information, provided you obey its convention."
        ),
        core_idea=(
            "In a Fischer projection the horizontal bonds point toward you and "
            "the vertical bonds point away, with the carbon chain drawn "
            "vertically and the most oxidised carbon at the top. Because the "
            "convention fixes the geometry, you can read configuration "
            "directly, but you must respect it: rotating the projection by 90 "
            "degrees inverts every stereocentre, while rotating by 180 degrees "
            "in the plane leaves configuration unchanged. Swapping any two "
            "groups inverts the centre, so two swaps return it."
        ),
        worked_example=(
            "Take the Fischer projection of glyceraldehyde with CHO at the "
            "top, CH2OH at the bottom, OH on the right and H on the left. "
            "Rank: OH is 1, CHO is 2, CH2OH is 3, H is 4. The lowest priority "
            "group H sits on a horizontal bond, which points toward you rather "
            "than away, so read the rotation and then reverse your answer. "
            "Tracing OH to CHO to CH2OH runs counterclockwise, which would "
            "read as S, so the true assignment is R. This is D-glyceraldehyde, "
            "and it is (R)-glyceraldehyde."
        ),
        try_it_prompt=(
            "In a Fischer projection the lowest priority group is on a "
            "horizontal bond and you trace 1 to 2 to 3 clockwise. Is the "
            "centre R or S?"
        ),
        try_it_answer=(
            "It is S. A horizontal bond points toward the viewer, which is the "
            "opposite of what the R and S reading assumes, so you reverse the "
            "result you read. Clockwise becomes S."
        ),
        pitfall=(
            "Forgetting to reverse when the lowest priority group is "
            "horizontal produces a confidently wrong assignment every time, "
            "and the drawing gives no hint that anything went wrong. Check "
            "where H sits before you read the rotation, not after."
        ),
        claims=(
            Stereo(GLYCERALDEHYDE_R, ("R",), "D-glyceraldehyde is (R)"),
            Relationship(GLYCERALDEHYDE_R, GLYCERALDEHYDE_S, "enantiomers"),
        ),
    ),
    "ORG1.MULTIPLESTEREO": Lesson(
        node="ORG1.MULTIPLESTEREO",
        objective=(
            "Enumerate the stereoisomers of a molecule with several "
            "stereocentres, and predict when internal symmetry reduces the "
            "count below two to the n."
        ),
        build_on=(
            "You met one molecule where two stereocentres gave three "
            "stereoisomers rather than four. This lesson makes that a rule you "
            "can apply rather than a special case you remember."
        ),
        core_idea=(
            "With n stereocentres and no symmetry, there are two to the n "
            "stereoisomers, forming two to the n minus one pairs of "
            "enantiomers. Symmetry reduces this. When the molecule's two ends "
            "are constitutionally identical, some configurations become "
            "superimposable on their mirror images and collapse into meso "
            "forms. The practical test is to look for constitutional symmetry "
            "first: if the substituent pattern reading from one end matches "
            "the pattern reading from the other, expect meso forms and a count "
            "below the maximum."
        ),
        worked_example=(
            "Compare two molecules with two stereocentres each. Tartaric acid "
            "has the same group, CH(OH)COOH, at both ends, so it is "
            "constitutionally symmetric and has three stereoisomers: R,R and "
            "S,S as an enantiomeric pair, plus the meso form. Now take "
            "3-chlorobutan-2-ol, CH3CH(OH)CH(Cl)CH3. Its two stereocentres "
            "carry different substituents, one an OH and one a Cl, so there is "
            "no internal mirror plane available. It has the full four "
            "stereoisomers, arranged as two pairs of enantiomers, and each "
            "member of one pair is a diastereomer of both members of the other."
        ),
        try_it_prompt=(
            "A molecule has three stereocentres and no internal symmetry. How "
            "many stereoisomers does it have, and how many enantiomeric pairs? "
            "Then take tartaric acid, whose two stereocentres sit on "
            "constitutionally identical ends: how many stereoisomers does it "
            "have, and which one is achiral?"
        ),
        try_it_answer=(
            "Eight stereoisomers, since two cubed is eight, arranged as four "
            "enantiomeric pairs; any two isomers that are not mirror images are "
            "diastereomers of each other. Tartaric acid, by contrast, has only "
            "three: the R,R and S,S forms are an enantiomeric pair, and the R,S "
            "form is superimposable on its own mirror image, an achiral meso "
            "compound that is a diastereomer of both. Its internal mirror plane "
            "is what collapses the expected fourth isomer onto the meso form."
        ),
        pitfall=(
            "Applying two to the n without checking for symmetry overcounts, "
            "and assuming symmetry without checking undercounts. Look at "
            "whether the two ends are constitutionally the same before you "
            "commit to a number."
        ),
        claims=(
            Stereo(CHLOROBUTANOL_RR, ("R", "R"), "3-chlorobutan-2-ol, one diastereomer"),
            Stereo(CHLOROBUTANOL_SS, ("S", "S"), "its enantiomer"),
            Relationship(CHLOROBUTANOL_RR, CHLOROBUTANOL_SS, "enantiomers"),
            Relationship(
                CHLOROBUTANOL_RR, CHLOROBUTANOL_RS, "diastereomers",
                "one centre inverted, not both",
            ),
            Formula(CHLOROBUTANOL_RR, "C4H9ClO", "3-chlorobutan-2-ol"),
            Stereo(TARTARIC_MESO, ("R", "S"), "the meso form the try_it asks about"),
            Relationship(
                TARTARIC_RR, TARTARIC_MESO, "diastereomers",
                "meso versus R,R, the symmetry-reduction case",
            ),
        ),
    ),
    "ORG1.RESOLUTION": Lesson(
        node="ORG1.RESOLUTION",
        objective=(
            "Explain why enantiomers cannot be separated by ordinary physical "
            "methods, and describe how converting them to diastereomers makes "
            "separation possible."
        ),
        build_on=(
            "You know enantiomers share every scalar physical property. That "
            "shared identity is exactly what makes separating them a problem "
            "worth a technique of its own."
        ),
        core_idea=(
            "Enantiomers have identical melting points, boiling points, "
            "densities and solubilities in ordinary solvents, so distillation "
            "and recrystallisation cannot tell them apart. Diastereomers do "
            "not share those properties. Resolution exploits the difference: "
            "react the racemic mixture with a single enantiomer of some other "
            "chiral compound, and the two products are diastereomers rather "
            "than enantiomers. Now they have different solubilities, so one "
            "crystallises out. Separate them, then reverse the reaction to "
            "recover each enantiomer of the original compound."
        ),
        worked_example=(
            "A racemic carboxylic acid needs resolving. Treat it with a single "
            "enantiomer of a chiral amine, say (R)-1-phenylethylamine. The "
            "acid-base reaction gives two salts: R-acid with R-amine, and "
            "S-acid with R-amine. Those two salts are diastereomers, because "
            "one centre differs and the other does not, so their solubilities "
            "differ. Crystallise the less soluble salt, filter it off, and "
            "treat each fraction with strong acid to regenerate the free "
            "carboxylic acid, now as a single enantiomer, with the amine "
            "recovered for reuse."
        ),
        try_it_prompt=(
            "Why does reacting a racemate with a racemic resolving agent fail "
            "to separate anything?"
        ),
        try_it_answer=(
            "Because the four products pair up into two sets of enantiomers "
            "rather than a set of diastereomers. R-acid with R-amine and "
            "S-acid with S-amine are mirror images of each other, as are the "
            "two mixed salts, and enantiomers still share solubility. The "
            "resolving agent must itself be a single enantiomer."
        ),
        pitfall=(
            "The idea that a chiral compound can be separated by careful "
            "enough distillation or chromatography on an ordinary column. "
            "Nothing achiral can distinguish enantiomers, however precise. The "
            "separation requires a chiral influence, whether that is a "
            "resolving agent, a chiral stationary phase, or an enzyme."
        ),
        claims=(
            Source(
                "Enantiomers have identical melting points, boiling points and "
                "solubilities in achiral solvents, and differ only in their "
                "interaction with plane polarized light and with other chiral "
                "substances.",
                "Standard treatment; see any introductory organic text's "
                "chapter on stereochemistry, for example Clayden, Organic "
                "Chemistry, chapter on stereochemistry.",
            ),
        ),
    ),
}
