"""ORG1 Unit 7: Alkynes.

Two facts make this unit dangerous to author from memory. The first is that a
triple bond carries two degrees of unsaturation, so every count in the unit is
one step away from an off-by-one that reads perfectly fluently. The second is
that the unit's central result, that partial reduction can be steered to the
cis alkene or to the trans alkene, is a stereochemical assignment, and a
stereochemical assignment written by hand is wrong about as often as it is
right.

So nothing here was written from memory. Every SMILES in this file was handed
to RDKit and the descriptor, formula, unsaturation count or proton environment
was read back before the prose that states it was written. The E and Z
assignments in particular came from reading the CIP label off the bond rather
than from reasoning about which slash goes where.

One value is deliberately absent. The unit teaches that a terminal alkyne C-H
is the most acidic C-H a hydrocarbon offers, and it does not attach a pKa
number to that statement, because published hydrocarbon acidities are measured
in dimethyl sulfoxide while the numbers most often quoted in class are aqueous
extrapolations, and the two are not the same quantity. The ordering is the
teachable fact and the ordering is what is claimed.
"""

from __future__ import annotations

from app.data.claims import Environments, Formula, Relationship, Source, Unsaturation
from app.data.lesson_types import Lesson

# Alkynes, named once so a claim and its prose cannot drift apart.
ETHYNE = "C#C"
PROPYNE = "CC#C"
BUT_1_YNE = "C#CCC"
BUT_2_YNE = "CC#CC"
PENT_1_YNE = "C#CCCC"
PENT_2_YNE = "CC#CCC"
HEX_1_YNE = "C#CCCCC"
HEX_3_YNE = "CCC#CCC"
HEPT_2_YNE = "CC#CCCCC"
METHYLPENT_2_YNE = "CC#CC(C)C"  # 4-methylpent-2-yne
DIMETHYLBUT_1_YNE = "C#CC(C)(C)C"  # 3,3-dimethylbut-1-yne

# Alkene geometries. These were not written by hand. Each was passed through
# RDKit's CIP labeller and the descriptor read back off the double bond, which
# is the only way this file is willing to assert E or Z. In Python source the
# doubled backslash is one backslash in the SMILES.
BUT_2_ENE_Z = "C/C=C\\C"  # CIP reads Z
BUT_2_ENE_E = "C/C=C/C"  # CIP reads E
HEX_3_ENE_Z = "CC/C=C\\CC"  # CIP reads Z
HEX_3_ENE_E = "CC/C=C/CC"  # CIP reads E
DIBROMOBUTENE_E = "C/C(Br)=C(Br)/C"  # (E)-2,3-dibromobut-2-ene, CIP reads E

# Addition and elimination substrates and products.
BROMOBUT_1_ENE = "CCC(Br)=C"  # 2-bromobut-1-ene
DIBROMOBUTANE_22 = "CCC(Br)(Br)C"  # 2,2-dibromobutane, geminal
DIBROMOBUTANE_23 = "CC(Br)C(Br)C"  # 2,3-dibromobutane, vicinal
TETRABROMOBUTANE = "CC(Br)(Br)C(Br)(Br)C"  # 2,2,3,3-tetrabromobutane
DIBROMOHEXANE_22 = "CCCCC(C)(Br)Br"  # 2,2-dibromohexane
BROMOBUTANE = "CCCCBr"  # 1-bromobutane
METHYLPROPENE = "CC(C)=C"  # 2-methylpropene
HEXANE = "CCCCCC"

# Enols and the carbonyl compounds they become.
HEX_1_EN_2_OL = "CCCCC(O)=C"  # Markovnikov enol from hex-1-yne
HEX_1_EN_1_OL = "CCCCC=CO"  # anti-Markovnikov enol from hex-1-yne
HEXAN_2_ONE = "CCCCC(C)=O"
HEXANAL = "CCCCCC=O"
HEX_3_EN_3_OL = "CCC(O)=CCC"
HEXAN_3_ONE = "CCC(=O)CCC"
PENT_1_EN_2_OL = "CCCC(O)=C"
PENTAN_2_ONE = "CCCC(C)=O"

LESSONS_ORG1_U7 = {
    "ORG1.ALKYNENOMEN": Lesson(
        node="ORG1.ALKYNENOMEN",
        objective=(
            "Name an alkyne by IUPAC rules, describe the geometry the sp "
            "hybridized carbons impose, and count the degrees of unsaturation "
            "a triple bond contributes."
        ),
        build_on=(
            "You can name an alkene and assign E or Z to its double bond. An "
            "alkyne changes two things about that picture: the suffix becomes "
            "yne, and the geometry question disappears, for a reason worth "
            "understanding rather than memorising."
        ),
        core_idea=(
            "A triple bond is one sigma bond and two pi bonds between two sp "
            "hybridized carbons. Each of those carbons has two sp orbitals "
            "pointing 180 degrees apart, so the carbon and its two "
            "attachments lie on a straight line, and the two unhybridized p "
            "orbitals sit perpendicular to that line and to each other. Three "
            "consequences follow. The alkyne carbon carries at most one other "
            "group, so there is no cis or trans arrangement to name. Four "
            "atoms in a row are collinear, which strains small rings badly "
            "enough that a triple bond will not fit in one. And because two "
            "pi bonds are present, a triple bond costs two degrees of "
            "unsaturation, not one. Naming otherwise follows the alkene "
            "rules: find the longest chain containing the triple bond, number "
            "so the triple bond gets the lower locant, and cite that locant "
            "before the yne suffix. That locant does real work, because one "
            "formula can host the triple bond in more than one place: C4H6 is "
            "but-1-yne when the bond sits at the end of the chain and "
            "but-2-yne when it sits in the middle, and those two are "
            "constitutional isomers. Symmetry separates them at a glance, "
            "since but-2-yne has all six hydrogens in a single environment "
            "while but-1-yne has three environments in the ratio 3:2:1."
        ),
        worked_example=(
            "Name CH3-C(triple bond)C-CH(CH3)-CH3. The longest chain that "
            "contains the triple bond runs five carbons, so the parent is "
            "pentyne, and there is a methyl branch. Now number. Reading from "
            "the left puts the triple bond at C2 and the methyl at C4. "
            "Reading from the right puts the triple bond at C3 and the methyl "
            "at C2. The unsaturation gets the lower locant before any "
            "substituent does, so the first numbering wins and the name is "
            "4-methylpent-2-yne. Check the formula: six carbons, C6H10. "
            "Degrees of unsaturation are (2 times 6 plus 2 minus 10) divided "
            "by 2, which is 2, and that 2 is the single triple bond, not two "
            "double bonds. The molecule has three proton environments in the "
            "ratio 6:3:1, which is the two equivalent methyls of the "
            "isopropyl group, the methyl on the far side of the triple bond, "
            "and the lone methine hydrogen."
        ),
        try_it_prompt=(
            "A hydrocarbon has the formula C5H8 and contains no rings. How "
            "many degrees of unsaturation does it have? Name the two "
            "compounds that fit if the five carbons form an unbranched chain "
            "with one triple bond in it, and say how those two are related."
        ),
        try_it_answer=(
            "Two degrees of unsaturation, from (2 times 5 plus 2 minus 8) "
            "over 2, and with no rings present both of them belong to the one "
            "triple bond. Putting that triple bond at the end gives pent-1-"
            "yne and putting it one position in gives pent-2-yne. Same "
            "formula, different connectivity, so they are constitutional "
            "isomers. Note that C5H8 with two degrees of unsaturation could "
            "equally have been a diene or a ring plus a double bond; it was "
            "the extra information about rings and a triple bond that pinned "
            "it down."
        ),
        pitfall=(
            "The error to expect is reading two degrees of unsaturation as "
            "two double bonds, because the arithmetic gives a number and the "
            "number looks like a count of bonds. It is a count of pi bonds "
            "plus rings, and a triple bond supplies two pi bonds by itself. "
            "The belief underneath is that each functional group costs one "
            "degree, which is true for a ring and true for a double bond and "
            "false here. A related error is trying to label a triple bond E "
            "or Z. There is nothing to label: each sp carbon holds only one "
            "substituent, so there are no two sides for groups to be on."
        ),
        claims=(
            Formula(BUT_2_YNE, "C4H6", "but-2-yne"),
            Unsaturation(BUT_2_YNE, 2, "one triple bond is two degrees"),
            Unsaturation(BUT_1_YNE, 2, "the terminal isomer costs the same two"),
            Relationship(
                BUT_1_YNE, BUT_2_YNE, "constitutional",
                "same C4H6, different position for the triple bond",
            ),
            Environments(BUT_2_YNE, (6,), "symmetric, so one proton signal"),
            Environments(
                BUT_1_YNE, (3, 2, 1),
                "the 1 is the hydrogen on the sp carbon",
            ),
            Formula(PENT_1_YNE, "C5H8", "pent-1-yne"),
            Unsaturation(PENT_1_YNE, 2),
            Unsaturation(PENT_2_YNE, 2),
            Relationship(PENT_1_YNE, PENT_2_YNE, "constitutional"),
            Formula(METHYLPENT_2_YNE, "C6H10", "4-methylpent-2-yne"),
            Unsaturation(METHYLPENT_2_YNE, 2),
            Environments(METHYLPENT_2_YNE, (6, 3, 1), "isopropyl, methyl, methine"),
            Source(
                "The carbon-carbon triple bond is shorter and stronger than a "
                "double bond, which is shorter and stronger than a single "
                "bond, and the H-C-C angle in ethyne is 180 degrees.",
                "Bond lengths and angles for ethyne, ethene and ethane are "
                "tabulated in the CRC Handbook of Chemistry and Physics, "
                "structural data section; the same comparison appears in the "
                "alkyne chapter of any introductory organic text.",
            ),
        ),
    ),
    "ORG1.ACETYLIDE": Lesson(
        node="ORG1.ACETYLIDE",
        objective=(
            "Explain why the C-H of a terminal alkyne can be removed by a "
            "strong base when other hydrocarbon C-H bonds cannot, and choose "
            "a base that will actually do it."
        ),
        build_on=(
            "From the acids and bases unit you know that acidity is decided by "
            "the stability of the conjugate base, not by anything visible in "
            "the acid itself. From the previous lesson you know the terminal "
            "alkyne C-H sits on an sp carbon. Those two facts together are the "
            "whole of this lesson."
        ),
        core_idea=(
            "Remove a proton from a hydrocarbon and you are left with a "
            "carbanion, a carbon holding a lone pair. Where that lone pair "
            "lives decides how stable the anion is, and therefore how acidic "
            "the C-H was. An sp orbital is 50 percent s character, an sp2 "
            "orbital is 33 percent, an sp3 orbital is 25 percent. The s "
            "orbital has density at the nucleus, so the more s character an "
            "orbital carries the closer it holds its electrons to the "
            "positively charged nucleus and the lower their energy. That puts "
            "the acidity ordering as terminal alkyne, then alkene, then "
            "alkane, spanning an enormous range. Two practical consequences. "
            "Only a terminal alkyne has this hydrogen at all, since an "
            "internal alkyne's sp carbons both carry carbon substituents. And "
            "the base you use has to be stronger than the acetylide you are "
            "making, which rules out hydroxide and alkoxide and points to "
            "sodium amide."
        ),
        worked_example=(
            "Take the two C4H6 alkynes, which are constitutional isomers, and "
            "treat each with sodium amide in liquid ammonia. But-1-yne has "
            "three proton environments in the ratio 3:2:1, and the 1 is a "
            "single hydrogen sitting on an sp carbon. Sodium amide takes that "
            "one, giving the acetylide anion and ammonia, and it takes only "
            "that one: the methyl and methylene hydrogens would leave behind "
            "an sp3 carbanion with 25 percent s character, which is far less "
            "stable and far out of reach of this base. But-2-yne has six "
            "hydrogens in a single environment, all of them on sp3 carbons, "
            "and none on an sp carbon at all. Sodium amide does nothing to it. "
            "So the same reagent that converts one C4H6 isomer into a "
            "nucleophile leaves the other untouched, and that difference "
            "distinguishes a terminal alkyne from an internal one."
        ),
        try_it_prompt=(
            "Propyne, CH3-C(triple bond)CH, has two proton environments in "
            "the ratio 3:1. Sodium amide removes exactly one of its four "
            "hydrogens. Which one, and what is wrong with the other three as "
            "candidates? Answer before reading on."
        ),
        try_it_answer=(
            "It removes the single hydrogen on the sp carbon, the one that "
            "integrates for 1. Losing it leaves a lone pair in an sp orbital, "
            "50 percent s character, held close to the nucleus and stable "
            "enough for a strong base to reach. The three methyl hydrogens sit "
            "on an sp3 carbon; removing one of those would leave a lone pair "
            "in an sp3 orbital with only 25 percent s character, an anion so "
            "much less stable that no ordinary base touches it. The two "
            "environments differ by hybridization, and hybridization is what "
            "the acidity tracks."
        ),
        pitfall=(
            "The word acidic does the damage. A learner told that terminal "
            "alkynes are the acidic hydrocarbons reaches for a base that "
            "handles acids, and writes sodium hydroxide. It does not work. "
            "Terminal alkynes are acidic only by the standards of "
            "hydrocarbons; they are far less acidic than water or an alcohol, "
            "so hydroxide sits on the wrong side of the equilibrium and "
            "essentially no acetylide forms. The belief to correct is that "
            "acidic is a property a compound either has or lacks. It is a "
            "comparison, and the comparison here is against other C-H bonds, "
            "not against acetic acid. A second and quieter error is writing an "
            "acetylide from an internal alkyne, which has no such hydrogen to "
            "lose. Steric bulk, by contrast, is not the obstacle people expect "
            "it to be: 3,3-dimethylbut-1-yne carries a tert-butyl group and "
            "shows two proton environments in the ratio 9:1, and that lone "
            "hydrogen on the sp carbon still comes off, because what decides "
            "the acidity is hybridization and not crowding."
        ),
        claims=(
            Formula(BUT_1_YNE, "C4H6", "but-1-yne"),
            Unsaturation(BUT_1_YNE, 2),
            Environments(
                BUT_1_YNE, (3, 2, 1),
                "three environments; the single hydrogen is the sp C-H",
            ),
            Environments(
                BUT_2_YNE, (6,),
                "one environment, all six on sp3 carbon, none removable here",
            ),
            Relationship(
                BUT_1_YNE, BUT_2_YNE, "constitutional",
                "same formula, and only one of them has the acidic hydrogen",
            ),
            Unsaturation(PROPYNE, 2),
            Environments(PROPYNE, (3, 1), "the 1 is the hydrogen sodium amide removes"),
            Environments(
                DIMETHYLBUT_1_YNE, (9, 1),
                "a bulky terminal alkyne still shows one sp C-H",
            ),
            Source(
                "Among hydrocarbons the C-H of a terminal alkyne is the most "
                "acidic, more acidic than the vinylic C-H of an alkene, which "
                "is in turn more acidic than an alkane C-H. This course states "
                "the ordering and not the numbers, because compiled "
                "hydrocarbon acidities are equilibrium values measured in "
                "dimethyl sulfoxide while the figures usually quoted in class "
                "are aqueous extrapolations, and the two scales are not "
                "interchangeable.",
                "F. G. Bordwell, Equilibrium Acidities in Dimethyl Sulfoxide "
                "Solution, Accounts of Chemical Research 1988, volume 21, page "
                "456, which is the standard compilation and states its medium "
                "explicitly.",
            ),
            Source(
                "Sodium amide in liquid ammonia is the standard base for "
                "converting a terminal alkyne to its acetylide; hydroxide and "
                "alkoxide bases do not deprotonate a terminal alkyne to a "
                "useful extent.",
                "Standard preparative practice; see the alkyne chapter of any "
                "introductory organic text, for example Clayden, Organic "
                "Chemistry.",
            ),
        ),
    ),
    "ORG1.ALKYNEADDITION": Lesson(
        node="ORG1.ALKYNEADDITION",
        objective=(
            "Predict the product of adding one or two equivalents of a hydrogen "
            "halide or a halogen to an alkyne, including which carbon each "
            "piece lands on."
        ),
        build_on=(
            "You already worked through electrophilic addition to alkenes, "
            "including Markovnikov's rule and the anti addition of bromine. An "
            "alkyne has two pi bonds, so it can do all of that twice, and the "
            "new question is how far the reaction goes and where the second "
            "addition puts its atoms."
        ),
        core_idea=(
            "Each addition consumes one pi bond, so an alkyne's two degrees of "
            "unsaturation come off one at a time: alkyne at 2, alkene at 1, "
            "saturated product at 0. Stoichiometry decides where you stop. "
            "Regiochemistry is decided by the same rule as for alkenes, "
            "applied twice. The electrophilic hydrogen adds to whichever "
            "carbon of the pi bond already carries more hydrogens, so the "
            "positive charge develops on the more substituted carbon. Apply "
            "that once to a terminal alkyne and the halide lands on C2. Apply "
            "it again to the vinyl halide that results and it lands on C2 "
            "once more, because a halogen lone pair helps stabilise a cation "
            "on the carbon it is attached to. Both halides therefore end up on "
            "the same carbon, giving a geminal dihalide. Halogens behave "
            "differently: bromine adds across the triple bond in an anti "
            "fashion, so one equivalent gives a dihaloalkene with the two "
            "bromines on opposite sides."
        ),
        worked_example=(
            "Treat but-1-yne, two degrees of unsaturation, with one equivalent "
            "of hydrogen bromide. C1 carries the hydrogen, so the incoming "
            "proton goes there and the bromide ends up on C2. The product is "
            "2-bromobut-1-ene, C4H7Br, one degree of unsaturation left, three "
            "proton environments in the ratio 3:2:2. Now add a second "
            "equivalent. The remaining double bond protonates at C1 again, "
            "both because C1 holds more hydrogens and because the resulting "
            "cation at C2 is stabilised by the bromine already sitting there, "
            "so the second bromide also lands on C2. The product is "
            "2,2-dibromobutane, C4H8Br2, zero degrees of unsaturation, "
            "environments 3:3:2. Both bromines on one carbon. Contrast this "
            "with one equivalent of bromine on but-2-yne, which adds anti and "
            "gives (E)-2,3-dibromobut-2-ene, C4H6Br2, one degree of "
            "unsaturation and a single proton environment of six equivalent "
            "hydrogens; a second equivalent takes it on to "
            "2,2,3,3-tetrabromobutane at zero."
        ),
        try_it_prompt=(
            "Hex-1-yne is treated with two equivalents of hydrogen bromide. "
            "Decide where each bromine ends up and what the degree of "
            "unsaturation of the product is before you look at the answer."
        ),
        try_it_answer=(
            "Both bromines land on C2, giving 2,2-dibromohexane, C6H12Br2, "
            "with zero degrees of unsaturation. The first addition puts H on "
            "C1 and Br on C2 because C1 has more hydrogens. The second "
            "addition faces the same choice on the vinyl bromide and answers "
            "it the same way, with the bromine already on C2 further "
            "stabilising the cation there. The result is a geminal dihalide. "
            "Note that 2,2-dibromohexane and 2,3-dibromohexane are different "
            "compounds with the same formula, so getting the carbon wrong is "
            "not a small slip."
        ),
        pitfall=(
            "The expected wrong answer is a vicinal dihalide, one bromine on "
            "C1 and one on C2, and it comes from a specific and reasonable "
            "belief: that adding two equivalents of HX to a triple bond is the "
            "same event as adding one equivalent of Br2 to a double bond, "
            "where the two halogens do end up on adjacent carbons. They are "
            "not the same event. Br2 delivers its two halogens in one step "
            "across one pi bond. Two equivalents of HX are two separate "
            "additions, each governed by Markovnikov, and both times the rule "
            "points at the same carbon. If you find yourself drawing a vicinal "
            "product from HX, check which reagent supplied each atom. The "
            "distinction is not cosmetic: 2,2-dibromobutane and "
            "2,3-dibromobutane share the formula C4H8Br2 and are "
            "constitutional isomers, so the two answers are different "
            "compounds rather than two drawings of one."
        ),
        claims=(
            Unsaturation(BUT_1_YNE, 2, "starting alkyne"),
            Unsaturation(BROMOBUT_1_ENE, 1, "after one equivalent of HBr"),
            Formula(BROMOBUT_1_ENE, "C4H7Br", "2-bromobut-1-ene"),
            Environments(BROMOBUT_1_ENE, (3, 2, 2)),
            Unsaturation(DIBROMOBUTANE_22, 0, "after the second equivalent"),
            Formula(DIBROMOBUTANE_22, "C4H8Br2", "2,2-dibromobutane"),
            Environments(DIBROMOBUTANE_22, (3, 3, 2)),
            Relationship(
                DIBROMOBUTANE_22, DIBROMOBUTANE_23, "constitutional",
                "the geminal product is a different compound from the vicinal "
                "one, not a redrawing of it",
            ),
            Unsaturation(DIBROMOBUTENE_E, 1, "one equivalent of bromine"),
            Formula(DIBROMOBUTENE_E, "C4H6Br2", "(E)-2,3-dibromobut-2-ene"),
            Environments(DIBROMOBUTENE_E, (6,), "the two methyls stay equivalent"),
            Unsaturation(TETRABROMOBUTANE, 0, "two equivalents of bromine"),
            Formula(TETRABROMOBUTANE, "C4H6Br4", "2,2,3,3-tetrabromobutane"),
            Unsaturation(DIBROMOHEXANE_22, 0, "the try it product"),
            Formula(DIBROMOHEXANE_22, "C6H12Br2", "2,2-dibromohexane"),
            Source(
                "Addition of a hydrogen halide to a terminal alkyne follows "
                "Markovnikov's rule at each of the two additions, so two "
                "equivalents give the geminal dihalide, and addition of "
                "bromine across a triple bond is predominantly anti, so one "
                "equivalent gives mainly the trans dihaloalkene.",
                "Standard treatment; see the alkyne chapter of any "
                "introductory organic text, for example Clayden, Organic "
                "Chemistry, on electrophilic addition to alkynes.",
            ),
        ),
    ),
    "ORG1.TAUTOMER": Lesson(
        node="ORG1.TAUTOMER",
        objective=(
            "Predict the carbonyl compound obtained by hydrating an alkyne, "
            "and choose between the ketone and the aldehyde by choosing the "
            "method."
        ),
        build_on=(
            "Hydrating an alkene gave you an alcohol and the choice of "
            "Markovnikov or anti-Markovnikov selectivity depended on the "
            "reagent. Hydrating an alkyne uses the same selectivity rules, but "
            "the first-formed product is not what you isolate."
        ),
        core_idea=(
            "Add water across a triple bond and the hydroxyl lands on a carbon "
            "that is still part of a double bond. That arrangement, an OH "
            "attached directly to an alkene carbon, is called an enol, and for "
            "ordinary substrates it does not survive. A proton moves from "
            "oxygen to the far alkene carbon while the carbon-carbon double "
            "bond shifts onto the oxygen, and what you isolate is the "
            "carbonyl compound. The enol and the carbonyl are tautomers. They "
            "are not resonance structures: an atom has changed position, so "
            "they are two different compounds with the same molecular formula, "
            "which makes them constitutional isomers interconverting by a real "
            "reaction. Regiochemistry then decides which carbonyl compound you "
            "get. Mercury-catalysed aqueous acid hydration is Markovnikov, "
            "putting OH on the more substituted carbon, so a terminal alkyne "
            "gives a methyl ketone. Hydroboration followed by oxidative workup "
            "is anti-Markovnikov, putting OH on the terminal carbon, so the "
            "same alkyne gives an aldehyde instead."
        ),
        worked_example=(
            "Start from hex-1-yne, C6H10, two degrees of unsaturation, and run "
            "it down both routes. Under aqueous acid with a mercury(II) "
            "catalyst the hydroxyl goes to C2, the more substituted carbon, "
            "and the first species formed is the enol hex-1-en-2-ol. It "
            "tautomerises: the O-H proton moves to C1 and the C1-C2 double "
            "bond becomes a C2-O double bond, giving hexan-2-one, C6H12O, one "
            "degree of unsaturation, five proton environments in the ratio "
            "3:3:2:2:2. Under hydroboration then oxidation the boron adds to "
            "the less hindered terminal carbon, so the hydroxyl ends up on C1, "
            "the enol is hex-1-en-1-ol, and tautomerisation gives hexanal, "
            "also C6H12O. Same formula from the same starting material, but "
            "hexan-2-one and hexanal are constitutional isomers, so the choice "
            "of method is the choice of product. One case removes the choice "
            "entirely: hex-3-yne is symmetric, so hydroxyl on either alkyne "
            "carbon leads to the same enol and the same ketone, hexan-3-one."
        ),
        try_it_prompt=(
            "Pent-1-yne is hydrated in aqueous acid with a mercury(II) "
            "catalyst. Write the species formed by the addition of water "
            "first, then say what it becomes, and finish by naming the "
            "isolated product and saying whether it is an aldehyde or a "
            "ketone."
        ),
        try_it_answer=(
            "Markovnikov selectivity puts the hydroxyl on C2, so water "
            "addition gives the enol pent-1-en-2-ol. That enol tautomerises: "
            "the O-H proton transfers to C1 and the double bond moves from "
            "C1-C2 onto the C2-O bond. The isolated product is pentan-2-one, "
            "C5H10O, a methyl ketone rather than an aldehyde. An aldehyde "
            "would require the hydroxyl on C1, which means anti-Markovnikov "
            "selectivity, which means hydroboration and oxidation instead."
        ),
        pitfall=(
            "The most common wrong answer here is the enol, written down as "
            "the final product, and it usually comes from a learner who has "
            "done everything right. They applied Markovnikov correctly and "
            "stopped where the alkene chapter taught them to stop, at the "
            "alcohol. The correction is that this particular alcohol is not "
            "stable relative to its tautomer; for simple substrates the "
            "carbonyl form dominates the equilibrium overwhelmingly, so the "
            "enol is an intermediate rather than a product. The second error "
            "is calling the two forms resonance structures and drawing a "
            "double headed arrow between them. Resonance moves electrons only. "
            "Here a hydrogen atom changes which atom it is bonded to, and the "
            "checker in this file confirms the two are constitutional isomers, "
            "which is to say separate compounds."
        ),
        claims=(
            Formula(HEX_1_YNE, "C6H10", "hex-1-yne"),
            Unsaturation(HEX_1_YNE, 2),
            Unsaturation(HEX_1_EN_2_OL, 1, "the Markovnikov enol"),
            Unsaturation(HEXAN_2_ONE, 1, "the ketone it becomes"),
            Formula(HEXAN_2_ONE, "C6H12O", "hexan-2-one"),
            Environments(HEXAN_2_ONE, (3, 3, 2, 2, 2)),
            Relationship(
                HEX_1_EN_2_OL, HEXAN_2_ONE, "constitutional",
                "tautomers are constitutional isomers, not resonance forms",
            ),
            Formula(HEXANAL, "C6H12O", "hexanal"),
            Unsaturation(HEXANAL, 1),
            Relationship(
                HEX_1_EN_1_OL, HEXANAL, "constitutional",
                "the anti-Markovnikov enol and the aldehyde it becomes",
            ),
            Relationship(
                HEXAN_2_ONE, HEXANAL, "constitutional",
                "the two routes give genuinely different compounds",
            ),
            Unsaturation(HEX_3_YNE, 2, "the symmetric internal alkyne"),
            Formula(HEXAN_3_ONE, "C6H12O", "hexan-3-one"),
            Relationship(
                HEX_3_EN_3_OL, HEXAN_3_ONE, "constitutional",
                "symmetry means one enol and one ketone",
            ),
            Formula(PENTAN_2_ONE, "C5H10O", "the try it product"),
            Relationship(PENT_1_EN_2_OL, PENTAN_2_ONE, "constitutional"),
            Source(
                "For simple aldehydes and ketones the carbonyl tautomer is "
                "overwhelmingly favoured at equilibrium in water, with the "
                "enol present far below one part in a million; mercury(II) "
                "catalysed aqueous hydration of an alkyne is Markovnikov "
                "selective while hydroboration with oxidative workup is "
                "anti-Markovnikov selective.",
                "Standard treatment; see the alkyne and carbonyl chapters of "
                "any introductory organic text, for example Clayden, Organic "
                "Chemistry, on enols and keto-enol equilibria.",
            ),
        ),
    ),
    "ORG1.ALKYNEREDUCTION": Lesson(
        node="ORG1.ALKYNEREDUCTION",
        objective=(
            "Choose the reagent that takes an alkyne to the cis alkene, to the "
            "trans alkene, or all the way to the alkane, and state the "
            "geometry of the product."
        ),
        build_on=(
            "You know how to name an alkene's geometry as E or Z, and from the "
            "alkene unit you know that hydrogen over a metal catalyst delivers "
            "both hydrogens to the same face. Alkynes turn that into something "
            "more useful: a way to build a double bond whose geometry you "
            "chose."
        ),
        core_idea=(
            "An alkyne holds two degrees of unsaturation, and reduction takes "
            "them off one or both. Which happens, and with what geometry, is "
            "set by the reagent rather than by how much of it you use. "
            "Hydrogen over an ordinary metal catalyst goes all the way to the "
            "alkane, because the alkene intermediate stays bound to the metal "
            "surface and is reduced again before it escapes. The Lindlar "
            "catalyst is palladium deliberately deactivated so that the alkene "
            "does escape, and since both hydrogen atoms are delivered from the "
            "same face of the metal surface, the two substituents remain on "
            "the same side. The product is the cis alkene, Z for a simple "
            "internal case. Sodium or lithium dissolved in liquid ammonia is "
            "not a surface reaction at all: single electrons transfer to the "
            "triple bond and the vinyl anion intermediate settles into the "
            "arrangement with its two alkyl groups apart, so protonation "
            "delivers the trans alkene, E. The two alkenes from one alkyne "
            "have the same connectivity and different geometry, which makes "
            "them diastereomers with different physical properties."
        ),
        worked_example=(
            "Use hex-3-yne, C6H10, two degrees of unsaturation, six carbons "
            "with an ethyl group on each end of the triple bond. It is "
            "symmetric, and its two proton environments in the ratio 6:4 say "
            "so, which means there is no question of which carbon gets what "
            "and geometry is the only variable left. Hydrogen with the Lindlar "
            "catalyst stops after one addition and puts both hydrogens on the "
            "same face, so the two ethyl groups stay on the same side: the "
            "product is (Z)-hex-3-ene, C6H12, one degree of unsaturation. "
            "Sodium in liquid ammonia gives (E)-hex-3-ene, the same formula "
            "and the same connectivity, with the ethyl groups on opposite "
            "sides. Those two products are diastereomers. They are not "
            "enantiomers, because neither is the mirror image of the other, "
            "and being diastereomers they have different boiling points and "
            "can be separated. Hydrogen over an ordinary palladium catalyst "
            "instead removes both degrees of unsaturation and gives hexane, at "
            "zero, where every trace of the original geometry is gone."
        ),
        try_it_prompt=(
            "But-2-yne is treated with hydrogen over the Lindlar catalyst. "
            "Name the product including its geometry. Then say what "
            "relationship that product has to what you would get from treating "
            "but-2-yne with sodium in liquid ammonia."
        ),
        try_it_answer=(
            "Lindlar gives the cis alkene, (Z)-but-2-ene, because both "
            "hydrogens arrive on one face and leave the two methyl groups on "
            "the same side. Sodium in liquid ammonia gives (E)-but-2-ene. The "
            "two have identical connectivity and differ only in the "
            "arrangement about the double bond, and neither is the mirror "
            "image of the other, so they are diastereomers. That is why they "
            "have different melting and boiling points and can be told apart."
        ),
        pitfall=(
            "The belief that trips people is that Lindlar is about "
            "stoichiometry, that one equivalent of hydrogen over any catalyst "
            "would stop at the alkene and the special catalyst merely makes it "
            "tidier. It does not work that way. Over an ordinary catalyst the "
            "second addition is fast enough that limiting the hydrogen gives "
            "you a mixture of alkane and unreacted alkyne rather than the "
            "alkene you wanted. The catalyst, not the amount of hydrogen, is "
            "the control. The second error is assuming that because Lindlar "
            "adds syn, the dissolving metal reduction must be the anti version "
            "of the same mechanism. It is a different mechanism entirely, "
            "running through electron transfer and a vinyl anion, and its "
            "trans outcome comes from which shape that anion prefers, not from "
            "hydrogens approaching opposite faces of a surface."
        ),
        claims=(
            Formula(HEX_3_YNE, "C6H10", "hex-3-yne"),
            Unsaturation(HEX_3_YNE, 2),
            Environments(HEX_3_YNE, (6, 4), "symmetric, two environments"),
            Unsaturation(HEX_3_ENE_Z, 1, "Lindlar product"),
            Unsaturation(HEX_3_ENE_E, 1, "dissolving metal product"),
            Formula(HEX_3_ENE_Z, "C6H12"),
            Relationship(
                HEX_3_ENE_Z, HEX_3_ENE_E, "diastereomers",
                "cis and trans from the same alkyne, geometry read off the "
                "CIP label rather than asserted",
            ),
            Formula(HEXANE, "C6H14", "full hydrogenation product"),
            Unsaturation(HEXANE, 0),
            Unsaturation(BUT_2_YNE, 2, "the try it substrate"),
            Unsaturation(BUT_2_ENE_Z, 1),
            Unsaturation(BUT_2_ENE_E, 1),
            Relationship(BUT_2_ENE_Z, BUT_2_ENE_E, "diastereomers"),
            Source(
                "The Lindlar catalyst is palladium supported on calcium "
                "carbonate and deactivated with lead, used with quinoline, and "
                "it reduces an alkyne to the cis alkene without carrying on to "
                "the alkane; reduction with an alkali metal in liquid ammonia "
                "gives the trans alkene instead.",
                "Standard treatment; see the alkyne chapter of any "
                "introductory organic text, for example Clayden, Organic "
                "Chemistry, on partial reduction of alkynes.",
            ),
        ),
    ),
    "ORG1.ALKYNESYNTH": Lesson(
        node="ORG1.ALKYNESYNTH",
        objective=(
            "Make an alkyne by removing two equivalents of hydrogen halide "
            "from a dihalide, and lengthen a carbon chain by letting an "
            "acetylide displace halide from a methyl or primary alkyl halide."
        ),
        build_on=(
            "You can already make an acetylide from a terminal alkyne with "
            "sodium amide. This lesson uses that anion for what it is besides "
            "a base: a carbon nucleophile, and one of the few available this "
            "early for making a carbon-carbon bond."
        ),
        core_idea=(
            "There are two moves. The first builds the triple bond. Take an "
            "alkene, add bromine to get a vicinal dibromide with zero degrees "
            "of unsaturation, then treat it with excess sodium amide, which "
            "removes hydrogen bromide twice and creates two degrees of "
            "unsaturation in their place. The second move lengthens the chain. "
            "Deprotonate a terminal alkyne to the acetylide, then let that "
            "carbon attack an alkyl halide from the side opposite the halide, "
            "pushing the halide off and forming a new carbon-carbon bond. That "
            "backside displacement is the substitution you will study in "
            "detail in the substitution and elimination unit, and its "
            "restriction matters here: the carbon under attack must be "
            "uncrowded. The acetylide is a strong base as well as a good "
            "nucleophile, so with a secondary or tertiary halide it takes a "
            "proton from the neighbouring carbon instead, giving an alkene and "
            "handing you back your terminal alkyne. Methyl and primary halides "
            "only."
        ),
        worked_example=(
            "Build hex-1-yne from ethyne. Ethyne is C2H2 with two degrees of "
            "unsaturation. Sodium amide in liquid ammonia removes one of its "
            "two hydrogens to give the acetylide. Add 1-bromobutane, C4H9Br, a "
            "primary halide with zero degrees of unsaturation: the acetylide "
            "carbon attacks the carbon holding the bromine, bromide leaves, "
            "and the new bond gives hex-1-yne, C6H10, still two degrees of "
            "unsaturation, with five proton environments in the ratio "
            "3:2:2:2:1. That final 1 is the terminal C-H, which means the "
            "sequence can be run once more: sodium amide again, then "
            "iodomethane, gives hept-2-yne, C7H12, two degrees of "
            "unsaturation, now an internal alkyne with five environments in "
            "the ratio 3:3:2:2:2 and no acidic hydrogen left. Note that "
            "hex-1-yne and hex-3-yne share the formula C6H10 and are "
            "constitutional isomers; choosing which halide to alkylate with, "
            "and how many times, is how you choose between them. The other "
            "route in starts from an alkene: bromine gives 2,3-dibromobutane, "
            "C4H8Br2, zero degrees of unsaturation and two proton environments "
            "at 6:2, and excess sodium amide removes hydrogen bromide twice to "
            "give but-2-yne at two degrees."
        ),
        try_it_prompt=(
            "You want 3,3-dimethylbut-1-yne, which is a tert-butyl group "
            "attached to a terminal alkyne. Someone proposes making the "
            "acetylide from ethyne and adding 2-bromo-2-methylpropane. Decide "
            "whether that works, and if it does not, say what comes out "
            "instead."
        ),
        try_it_answer=(
            "It does not work. 2-bromo-2-methylpropane is a tertiary halide, "
            "and its central carbon is too crowded for the acetylide to reach "
            "from the back. What the acetylide can still do is act as a base: "
            "it removes a hydrogen from one of the methyl groups, the bromide "
            "leaves, and you get 2-methylpropene, C4H8, one degree of "
            "unsaturation, with the ethyne handed back to you unchanged. No "
            "carbon-carbon bond is formed. To reach 3,3-dimethylbut-1-yne, "
            "C6H10, two degrees of unsaturation and two proton environments in "
            "the ratio 9:1, you would build the triple bond a different way, "
            "such as "
            "double dehydrohalogenation of a dihalide that already carries the "
            "quaternary carbon."
        ),
        pitfall=(
            "The belief to name is that an acetylide is a nucleophile and only "
            "a nucleophile. It is both a nucleophile and a very strong base, "
            "and which role it plays is decided by the substrate. Every "
            "proposed alkylation with a secondary or tertiary halide comes "
            "from forgetting the second role. A separate error is treating "
            "alkylation as a step that can be repeated as often as you like. "
            "It can be repeated exactly as many times as there are terminal "
            "C-H bonds, which for ethyne is twice; once both ends carry alkyl "
            "groups there is no acidic hydrogen left, sodium amide has nothing "
            "to remove, and the sequence stops."
        ),
        claims=(
            Formula(ETHYNE, "C2H2", "the starting material"),
            Unsaturation(ETHYNE, 2),
            Formula(BROMOBUTANE, "C4H9Br", "1-bromobutane, a primary halide"),
            Unsaturation(BROMOBUTANE, 0),
            Formula(HEX_1_YNE, "C6H10", "first alkylation product"),
            Unsaturation(HEX_1_YNE, 2),
            Environments(
                HEX_1_YNE, (3, 2, 2, 2, 1),
                "the 1 is the terminal C-H still available",
            ),
            Formula(HEPT_2_YNE, "C7H12", "second alkylation product"),
            Unsaturation(HEPT_2_YNE, 2),
            Environments(
                HEPT_2_YNE, (3, 3, 2, 2, 2),
                "no environment of 1, so no acidic hydrogen remains",
            ),
            Relationship(
                HEX_1_YNE, HEX_3_YNE, "constitutional",
                "the alkylation sequence chooses between C6H10 isomers",
            ),
            Formula(DIBROMOBUTANE_23, "C4H8Br2", "the vicinal dibromide"),
            Unsaturation(DIBROMOBUTANE_23, 0),
            Environments(DIBROMOBUTANE_23, (6, 2)),
            Unsaturation(BUT_2_YNE, 2, "two eliminations, two degrees created"),
            Formula(DIMETHYLBUT_1_YNE, "C6H10", "3,3-dimethylbut-1-yne"),
            Unsaturation(DIMETHYLBUT_1_YNE, 2),
            Environments(DIMETHYLBUT_1_YNE, (9, 1)),
            Relationship(
                DIMETHYLBUT_1_YNE, HEX_1_YNE, "constitutional",
                "a C6H10 target the acetylide route cannot reach",
            ),
            Formula(METHYLPROPENE, "C4H8", "what the tertiary halide gives instead"),
            Unsaturation(METHYLPROPENE, 1),
            Source(
                "Alkylation of an acetylide is limited to methyl and primary "
                "alkyl halides; with secondary and tertiary halides the "
                "acetylide acts as a base and elimination dominates, "
                "regenerating the terminal alkyne.",
                "Standard treatment; see the alkyne chapter of any "
                "introductory organic text, for example Clayden, Organic "
                "Chemistry, on acetylide alkylation.",
            ),
        ),
    ),
}
