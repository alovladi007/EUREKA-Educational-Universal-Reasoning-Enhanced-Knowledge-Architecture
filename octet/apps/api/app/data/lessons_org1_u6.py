"""ORG1 Unit 6: Alkenes, structure and reactions.

Ten nodes covering geometry and naming, relative stability, and the standard
addition chemistry of the carbon-carbon double bond, ending with the
eliminations that make one.

Every structure named below was derived with RDKit before it was written into a
claim, not written from memory and checked afterwards. That order matters here
more than in any earlier unit. This is the unit where syn and anti addition
decide whether a product is a meso compound or a racemate, and a stereo SMILES
typed from intuition is wrong often enough that trusting one would put a
confidently incorrect diastereomer in front of a learner.

Two things this file deliberately does not do. It does not state yields,
temperatures or stoichiometries, because none of those were derivable and none
were sourced. And it does not use the claim system to assert that a reaction
happens: the checker settles structures and relationships between them, so
every mechanistic statement here is written as the standard textbook account
and carries a citation rather than a verification.
"""

from __future__ import annotations

from app.data.claims import Environments, Formula, Relationship, Source, Stereo, Unsaturation
from app.data.lesson_types import Lesson

# ---------------------------------------------------------------------------
# Structures, named once. Every stereo descriptor in the claims below was read
# back out of RDKit for the exact SMILES string written here; the tags were not
# reasoned about by hand. Ring cis and trans assignments were fixed twice over,
# once by the meso test on the symmetric analogue and once by embedding a
# conformer and measuring which side of the ring plane each substituent sits on.
# ---------------------------------------------------------------------------

# Alkenes
BUT_1_ENE = "C=CCC"
BUT_2_ENE_E = "C/C=C/C"
BUT_2_ENE_Z = "C/C=C\\C"
ISOBUTENE = "CC(C)=C"  # 2-methylprop-1-ene
PENT_1_ENE = "C=CCCC"
PENT_2_ENE_E = "C/C=C/CC"
ME_BUT_2_ENE = "CC(C)=CC"  # 2-methylbut-2-ene
ME_BUT_1_ENE = "C=C(C)CC"  # 2-methylbut-1-ene
DIMETHYLBUT_2_ENE = "CC(C)=C(C)C"  # 2,3-dimethylbut-2-ene
ME_PENT_2_ENE_E = "C/C=C(\\C)CC"  # (E)-3-methylpent-2-ene, methyls on one side
ME_PENT_2_ENE_Z = "C/C=C(/C)CC"
BROMOBUT_2_ENE_E = "C/C=C(\\C)Br"  # (E)-2-bromobut-2-ene, methyls on one side
BROMOBUT_2_ENE_Z = "C/C=C(/C)Br"
PROPENE = "CC=C"
ME_BUT_1_ENE_3 = "CC(C)C=C"  # 3-methylbut-1-ene
CYCLOHEXENE = "C1=CCCCC1"
ME_CYCLOHEXENE = "CC1=CCCCC1"  # 1-methylcyclohexene
DIMETHYLCYCLOHEXENE = "CC1=C(C)CCCC1"  # 1,2-dimethylcyclohexene
ME_PENT_2_ENE = "CCC=C(C)C"  # 2-methylpent-2-ene

# Alkanes and halides
BUTANE = "CCCC"
BROMOPROPANE_2 = "CC(C)Br"
BROMOPROPANE_1 = "CCCBr"
BROMOBUTANE_1 = "CCCCBr"
BROMOBUTANE_2 = "CCC(C)Br"  # configuration unspecified
BROMOBUTANE_2_R = "CC[C@@H](C)Br"
BROMOBUTANE_2_S = "CC[C@H](C)Br"
CHLORO_ME_BUTANE_2 = "CCC(C)(C)Cl"  # 2-chloro-2-methylbutane
CHLORO_ME_BUTANE_3 = "CC(Cl)C(C)C"  # 2-chloro-3-methylbutane

# Alcohols
PROPAN_2_OL = "CC(C)O"
PROPAN_1_OL = "CCCO"
BUTAN_2_OL = "CCC(C)O"
BUTAN_1_OL = "CCCCO"
ME_BUTAN_2_OL_2 = "CCC(C)(C)O"  # 2-methylbutan-2-ol
ME_BUTAN_2_OL_3 = "CC(O)C(C)C"  # 3-methylbutan-2-ol
# trans-2-methylcyclohexan-1-ol is the (1S,2S) and (1R,2R) pair; cis is (1S,2R).
ME_CYCLOHEXANOL_TRANS_SS = "O[C@H]1CCCC[C@@H]1C"
ME_CYCLOHEXANOL_TRANS_RR = "O[C@@H]1CCCC[C@H]1C"
ME_CYCLOHEXANOL_CIS = "O[C@H]1CCCC[C@H]1C"

# Halogenation products
# trans-1,2-dibromocyclohexane is chiral; the cis isomer is meso, which is how
# the two were told apart without guessing at the ring geometry.
DIBROMOCYCLOHEXANE_TRANS_SS = "Br[C@H]1CCCC[C@@H]1Br"
DIBROMOCYCLOHEXANE_TRANS_RR = "Br[C@@H]1CCCC[C@H]1Br"
DIBROMOCYCLOHEXANE_CIS = "Br[C@@H]1CCCC[C@@H]1Br"
DIBROMOCYCLOHEXANE_CIS_ALT = "Br[C@H]1CCCC[C@H]1Br"
DIBROMOBUTANE_MESO = "C[C@@H](Br)[C@@H](Br)C"  # (2R,3S)
DIBROMOBUTANE_MESO_ALT = "C[C@H](Br)[C@H](Br)C"
DIBROMOBUTANE_RR = "C[C@@H](Br)[C@H](Br)C"
DIBROMOBUTANE_SS = "C[C@H](Br)[C@@H](Br)C"
BROMO_ME_PROPAN_2_OL = "CC(C)(O)CBr"  # 1-bromo-2-methylpropan-2-ol
BROMO_ME_PROPAN_1_OL = "CC(C)(Br)CO"  # 2-bromo-2-methylpropan-1-ol

# Hydrogenation products
DIMETHYLCYCLOHEXANE_CIS = "C[C@@H]1CCCC[C@@H]1C"  # (1R,2S), meso
DIMETHYLCYCLOHEXANE_CIS_ALT = "C[C@H]1CCCC[C@H]1C"
DIMETHYLCYCLOHEXANE_TRANS_RR = "C[C@@H]1CCCC[C@H]1C"
DIMETHYLCYCLOHEXANE_TRANS_SS = "C[C@H]1CCCC[C@@H]1C"

# Oxidation products
CYCLOHEXENE_OXIDE = "C1CC[C@H]2O[C@H]2C1"  # (R,S), cis fused, meso
CYCLOHEXENE_OXIDE_ALT = "C1CC[C@@H]2O[C@@H]2C1"
CYCLOHEXANONE = "O=C1CCCCC1"
CYCLOHEXANEDIOL_TRANS_SS = "O[C@H]1CCCC[C@@H]1O"
CYCLOHEXANEDIOL_TRANS_RR = "O[C@@H]1CCCC[C@H]1O"
CYCLOHEXANEDIOL_CIS = "O[C@@H]1CCCC[C@@H]1O"  # (1R,2S), meso
CYCLOHEXANEDIOL_CIS_ALT = "O[C@H]1CCCC[C@H]1O"
BUTANEDIOL_MESO = "C[C@@H](O)[C@@H](O)C"  # (2R,3S)
BUTANEDIOL_MESO_ALT = "C[C@H](O)[C@H](O)C"
BUTANEDIOL_RR = "C[C@@H](O)[C@H](O)C"
BUTANEDIOL_SS = "C[C@H](O)[C@@H](O)C"

# Cleavage products
ACETONE = "CC(C)=O"
ACETALDEHYDE = "CC=O"
PROPANAL = "CCC=O"
ACETIC_ACID = "CC(=O)O"
OXOHEPTANAL = "CC(=O)CCCCC=O"  # 6-oxoheptanal
HEXANEDIAL = "O=CCCCCC=O"

# Citations reused across the unit. These name a chapter topic in a standard
# text rather than a page, because a page number nobody checked is worse than
# no page number.
CLAYDEN_ADDITION = (
    "Standard textbook account; see the chapter on electrophilic addition to "
    "alkenes in Clayden, Greeves and Warren, Organic Chemistry, Oxford "
    "University Press."
)
CLAYDEN_ELIMINATION = (
    "Standard textbook account; see the chapter on elimination reactions in "
    "Clayden, Greeves and Warren, Organic Chemistry, Oxford University Press."
)
CLAYDEN_STEREO = (
    "Standard textbook account; see the chapter on stereochemistry and the "
    "chapter on diastereoselectivity in Clayden, Greeves and Warren, Organic "
    "Chemistry, Oxford University Press."
)


LESSONS_ORG1_U6 = {
    "ORG1.ALKENENOMEN": Lesson(
        node="ORG1.ALKENENOMEN",
        objective=(
            "Name an alkene under the IUPAC rules and assign E or Z to a "
            "double bond by ranking the two groups on each of its carbons."
        ),
        build_on=(
            "Unit 4 gave you Cahn-Ingold-Prelog priority ranking for the four "
            "groups around a tetrahedral stereocentre. The same ranking runs "
            "here, applied to two groups on each end of a double bond instead "
            "of four around one carbon."
        ),
        core_idea=(
            "Rotation about a carbon-carbon double bond would require breaking "
            "the pi bond, so the two ways of arranging the substituents are "
            "separate compounds rather than two shapes of one compound. "
            "Naming starts with the chain: pick the longest chain containing "
            "the double bond, number it so the double bond gets the lower "
            "locant, and cite that locant before the ene ending. Then fix the "
            "geometry. Rank the two groups on the first alkene carbon against "
            "each other, rank the two groups on the second carbon against each "
            "other, and look at where the two winners sit. Opposite sides is E, "
            "from entgegen; the same side is Z, from zusammen. The older labels "
            "cis and trans describe where two named groups sit, which is a "
            "different question, and they only answer it when each alkene "
            "carbon carries one member of the pair you are talking about."
        ),
        worked_example=(
            "Start with but-2-ene, CH3-CH=CH-CH3. Carbon 2 carries a methyl and "
            "a hydrogen, so methyl wins there; carbon 3 is the same, so methyl "
            "wins there too. When the two methyl groups are on opposite sides "
            "the name is (E)-but-2-ene, and when they are on the same side it "
            "is (Z)-but-2-ene. Here cis and trans agree with Z and E, because "
            "the group that decides the ranking is also the group being "
            "described. Now move to 3-methylpent-2-ene, CH3-CH=C(CH3)-CH2CH3. "
            "Carbon 2 still carries a methyl and a hydrogen, so methyl wins. "
            "Carbon 3 carries a methyl and an ethyl, both attached through "
            "carbon, so go one sphere out: the ethyl carbon holds (C, H, H) and "
            "the methyl carbon holds (H, H, H), and ethyl wins. Take the isomer "
            "with the two methyl groups on the same side of the double bond. "
            "The two winners are the carbon 2 methyl and the carbon 3 ethyl, "
            "and those are on opposite sides, so that isomer is "
            "(E)-3-methylpent-2-ene. The drawing looks cis and the label reads "
            "E, and both are correct because they answer different questions."
        ),
        try_it_prompt=(
            "2-bromobut-2-ene, CH3-CH=C(Br)-CH3, is drawn with its two methyl "
            "groups on the same side of the double bond. Is that isomer E or Z? "
            "Rank each alkene carbon before you answer."
        ),
        try_it_answer=(
            "It is E. Carbon 2 carries a methyl and a hydrogen, so methyl is "
            "the higher priority group there. Carbon 3 carries a bromine and a "
            "methyl, and bromine outranks carbon, so bromine is the higher "
            "priority group there. With the two methyls on one side, the "
            "carbon 2 methyl and the carbon 3 bromine end up on opposite "
            "sides, which is E. Calling it cis because the methyls match would "
            "be reporting the picture rather than the priorities, and for this "
            "trisubstituted alkene cis has no defined meaning at all."
        ),
        pitfall=(
            "Treating cis as another spelling of Z. They agree often enough in "
            "the first examples anyone meets that the difference looks like "
            "pedantry, and then a substituent like bromine or an ethyl group "
            "outranks the group being described and the two labels split. The "
            "belief underneath the error is that the label describes the "
            "drawing; it describes the priority ranking. Rank both carbons "
            "every time, even when the answer looks settled by inspection."
        ),
        claims=(
            Formula(BUT_2_ENE_E, "C4H8", "(E)-but-2-ene"),
            Formula(BUT_2_ENE_Z, "C4H8", "(Z)-but-2-ene"),
            Unsaturation(BUT_2_ENE_E, 1, "one degree, the pi bond"),
            Relationship(
                BUT_2_ENE_E, BUT_2_ENE_Z, "diastereomers",
                "same constitution, different configuration, not mirror "
                "images: the E and Z alkenes are diastereomers",
            ),
            Environments(
                BUT_2_ENE_E, (6, 2),
                "two proton environments, the six methyl hydrogens and the two "
                "alkene hydrogens",
            ),
            Formula(ME_PENT_2_ENE_E, "C6H12", "(E)-3-methylpent-2-ene"),
            Unsaturation(ME_PENT_2_ENE_E, 1),
            Relationship(ME_PENT_2_ENE_E, ME_PENT_2_ENE_Z, "diastereomers"),
            Formula(BROMOBUT_2_ENE_E, "C4H7Br", "(E)-2-bromobut-2-ene"),
            Unsaturation(BROMOBUT_2_ENE_E, 1),
            Relationship(BROMOBUT_2_ENE_E, BROMOBUT_2_ENE_Z, "diastereomers"),
            Source(
                "E and Z are assigned by comparing the higher priority group "
                "on each doubly bonded atom under the Cahn-Ingold-Prelog "
                "rules, with E for opposite sides and Z for the same side.",
                "IUPAC, Nomenclature of Organic Chemistry: Recommendations "
                "and Preferred Names 2013 (the Blue Book), rules for "
                "specifying double bond configuration.",
            ),
            Source(
                "The barrier to rotation about a carbon-carbon double bond is "
                "high enough that the two geometric isomers do not interconvert "
                "at ordinary temperatures and can be isolated separately.",
                CLAYDEN_STEREO,
            ),
        ),
    ),
    "ORG1.ALKENESTABILITY": Lesson(
        node="ORG1.ALKENESTABILITY",
        objective=(
            "Rank isomeric alkenes by stability from the number of alkyl "
            "groups on the double bond, and say why heat of hydrogenation is "
            "the measurement that establishes the ranking."
        ),
        build_on=(
            "You can now write out and name every alkene of a given formula. "
            "Ordering that list by stability is what turns it from a naming "
            "exercise into a prediction about which alkene an elimination will "
            "hand you."
        ),
        core_idea=(
            "The more alkyl groups attached to the two doubly bonded carbons, "
            "the more stable the alkene. Two effects are usually named for "
            "this. Hyperconjugation lets the C-H bonds of an adjacent alkyl "
            "group overlap with the empty pi antibonding orbital, spreading "
            "electron density and lowering the energy, and each additional "
            "alkyl group adds more of that overlap. Separately, an sp2 carbon "
            "holds an alkyl group better than an sp3 carbon does, so moving "
            "substituents onto the double bond is favourable. The ranking runs "
            "tetrasubstituted above trisubstituted above disubstituted above "
            "monosubstituted, and among disubstituted alkenes the E isomer "
            "sits below the Z isomer in energy because the Z arrangement "
            "pushes two substituents toward each other on the same side. All "
            "of this is a comparison between isomers only. The experiment that "
            "makes the comparison legitimate is hydrogenation: every isomeric "
            "alkene of one formula gives the same alkane, so the heat released "
            "measures how far above that common floor each alkene started."
        ),
        worked_example=(
            "Take the four alkenes of formula C4H8: but-1-ene, "
            "(E)-but-2-ene, (Z)-but-2-ene and 2-methylprop-1-ene. Count "
            "substituents on the double bond in each. But-1-ene has one alkyl "
            "group and is monosubstituted, so it is the least stable of the "
            "four. The two but-2-enes each carry one alkyl group on each "
            "carbon, and 2-methylprop-1-ene carries two on one carbon and none "
            "on the other, so those three are all disubstituted and all sit "
            "below but-1-ene in energy. Within the pair that differs only in "
            "geometry, (E)-but-2-ene is more stable than (Z)-but-2-ene. "
            "Separating 2-methylprop-1-ene from the two but-2-enes is a finer "
            "question than substituent counting can settle, and it is decided "
            "by measurement rather than by the rule. Notice what makes the "
            "whole comparison work: hydrogenating any of the four gives "
            "butane, C4H10, so the four heats of hydrogenation are four "
            "distances to one shared end point and can be subtracted from each "
            "other."
        ),
        try_it_prompt=(
            "Rank 2-methylbut-2-ene, pent-1-ene and (E)-pent-2-ene by "
            "stability, and say what entitles you to compare them at all."
        ),
        try_it_answer=(
            "All three are C5H10, and all three hydrogenate to pentane, so "
            "their heats of hydrogenation share an end point and can be "
            "compared directly. Counting substituents on the double bond: "
            "2-methylbut-2-ene is trisubstituted, (E)-pent-2-ene is "
            "disubstituted and trans, pent-1-ene is monosubstituted. Stability "
            "therefore runs 2-methylbut-2-ene above (E)-pent-2-ene above "
            "pent-1-ene. If you had been handed 2,3-dimethylbut-2-ene as a "
            "fourth candidate you would have to refuse the comparison: it is "
            "tetrasubstituted, but it is C6H12 and hydrogenates to hexane, so "
            "it is not on this scale."
        ),
        pitfall=(
            "Reading the stability order as a reactivity order. It says which "
            "alkene sits lower in energy, which is why elimination tends to "
            "deliver the more substituted alkene, and it says nothing directly "
            "about how fast any of them reacts with a given reagent, because a "
            "rate depends on the transition state and not on the starting "
            "material alone. The second half of the same mistake is comparing "
            "across formulas. A tetrasubstituted alkene is not more stable "
            "than a monosubstituted one in any absolute sense; it is more "
            "stable than its own isomers, and the ranking is meaningless "
            "between compounds that do not share a molecular formula."
        ),
        claims=(
            Formula(BUT_1_ENE, "C4H8", "but-1-ene, monosubstituted"),
            Formula(BUT_2_ENE_E, "C4H8", "(E)-but-2-ene, disubstituted"),
            Formula(BUT_2_ENE_Z, "C4H8", "(Z)-but-2-ene, disubstituted"),
            Formula(ISOBUTENE, "C4H8", "2-methylprop-1-ene, disubstituted"),
            Unsaturation(BUT_1_ENE, 1),
            Relationship(
                BUT_1_ENE, BUT_2_ENE_E, "constitutional",
                "the double bond has moved, so these differ in connectivity",
            ),
            Relationship(BUT_1_ENE, ISOBUTENE, "constitutional"),
            Relationship(ISOBUTENE, BUT_2_ENE_E, "constitutional"),
            Relationship(
                BUT_2_ENE_E, BUT_2_ENE_Z, "diastereomers",
                "the only pair of the four that shares a constitution",
            ),
            Formula(BUTANE, "C4H10", "the common hydrogenation product"),
            Unsaturation(BUTANE, 0),
            Formula(ME_BUT_2_ENE, "C5H10", "2-methylbut-2-ene, trisubstituted"),
            Formula(PENT_2_ENE_E, "C5H10", "(E)-pent-2-ene"),
            Formula(PENT_1_ENE, "C5H10", "pent-1-ene"),
            Relationship(ME_BUT_2_ENE, PENT_1_ENE, "constitutional"),
            Relationship(PENT_2_ENE_E, PENT_1_ENE, "constitutional"),
            Formula(DIMETHYLBUT_2_ENE, "C6H12", "2,3-dimethylbut-2-ene"),
            Unsaturation(DIMETHYLBUT_2_ENE, 1),
            Environments(
                DIMETHYLBUT_2_ENE, (12,),
                "one proton environment: all twelve hydrogens are equivalent, "
                "which is what full substitution by identical groups looks like",
            ),
            Source(
                "The stability order of isomeric alkenes, increasing with the "
                "number of alkyl substituents on the double bond and favouring "
                "E over Z among disubstituted isomers, is established by "
                "comparing heats of hydrogenation to a common alkane.",
                CLAYDEN_ADDITION,
            ),
        ),
    ),
    "ORG1.HXADDITION": Lesson(
        node="ORG1.HXADDITION",
        objective=(
            "Predict where the hydrogen and the halogen land when HX adds to "
            "an unsymmetrical alkene, by comparing the two possible "
            "carbocations, and say what that intermediate forces about the "
            "stereochemistry."
        ),
        build_on=(
            "Alkene stability came from counting alkyl groups on an sp2 carbon. "
            "The same counting decides carbocation stability, on a species "
            "that is also sp2, and that is the whole of the regiochemical "
            "argument in this lesson."
        ),
        core_idea=(
            "The pi bond is the nucleophile. It reaches out to the hydrogen of "
            "H-X, and the two electrons that used to be the pi bond become a "
            "C-H bond, which leaves the other carbon with six electrons and a "
            "positive charge. There are two ways to do that on an unsymmetrical "
            "alkene, giving two different carbocations, and the reaction runs "
            "through the more stable one: tertiary above secondary above "
            "primary, for the same hyperconjugation and inductive reasons that "
            "ordered the alkenes. The halide then attacks the cation. "
            "Markovnikov's rule, which says the hydrogen adds to the carbon "
            "that already carries more hydrogens, is a description of that "
            "outcome rather than an independent principle, and the cation "
            "argument is what you should be able to reconstruct when the rule "
            "and the structure seem to disagree."
        ),
        worked_example=(
            "Add HBr to propene, CH3-CH=CH2. Write both protonations rather "
            "than the answer. Put the hydrogen on C1, the CH2 end, and the "
            "charge lands on C2, which carries a methyl and the rest of the "
            "chain: a secondary cation. Put the hydrogen on C2 instead and the "
            "charge lands on C1, a primary cation with only one alkyl group to "
            "support it. The secondary cation is the lower energy path, so "
            "bromide adds to C2 and the product is 2-bromopropane. The "
            "alternative, 1-bromopropane, has the same molecular formula, "
            "C3H7Br, so the formula does not choose between them and the "
            "mechanism does. Now change the alkene to but-1-ene and follow the "
            "stereochemistry. The secondary cation at C2 is planar, with the "
            "empty p orbital sticking out on both faces, so bromide attacks "
            "the two faces at equal rates. C2 in the product carries a methyl, "
            "an ethyl, a bromine and a hydrogen, four different groups, so it "
            "is a stereocentre, and the two faces give the R and S forms of "
            "2-bromobutane in equal amounts. The product is a racemate, not a "
            "single enantiomer."
        ),
        try_it_prompt=(
            "2-methylbut-2-ene, (CH3)2C=CH-CH3, is treated with HCl. Which "
            "carbon takes the hydrogen, and what is the product? Write both "
            "cations before you decide."
        ),
        try_it_answer=(
            "The hydrogen goes to C3, the carbon carrying one methyl and one "
            "hydrogen. That leaves the positive charge on C2, which carries two "
            "methyl groups and the rest of the chain, a tertiary cation. "
            "Protonating C2 instead would leave a secondary cation on C3, which "
            "is the higher energy option. Chloride then adds to C2, so the "
            "product is 2-chloro-2-methylbutane. The unrearranged alternative, "
            "2-chloro-3-methylbutane, shares the formula C5H11Cl, and the two "
            "are constitutional isomers, so nothing about the formula would "
            "have told you which one you get. Note also that the product has no "
            "stereocentre, so the racemate question does not arise here."
        ),
        pitfall=(
            "Memorising Markovnikov as a slogan about the rich getting richer "
            "and applying it to a structure where the cation argument points "
            "the other way. The rule is a summary of one comparison, and when "
            "an electron withdrawing group sits next to the double bond and "
            "destabilises the cation the rule would predict, the regiochemistry "
            "follows the cation. A second error is quieter and costs more: "
            "writing a single enantiomer as the answer when a new stereocentre "
            "has been created. A planar cation has two faces and the nucleophile "
            "has no reason to prefer either, so the product is racemic, and an "
            "answer that names one configuration is wrong even though its "
            "constitution is right."
        ),
        claims=(
            Formula(PROPENE, "C3H6", "propene"),
            Unsaturation(PROPENE, 1),
            Formula(BROMOPROPANE_2, "C3H7Br", "2-bromopropane, the product"),
            Formula(BROMOPROPANE_1, "C3H7Br", "1-bromopropane, the alternative"),
            Unsaturation(BROMOPROPANE_2, 0),
            Relationship(
                BROMOPROPANE_2, BROMOPROPANE_1, "constitutional",
                "Markovnikov and anti-Markovnikov products are constitutional "
                "isomers, so the formula cannot decide between them",
            ),
            Formula(BUT_1_ENE, "C4H8", "but-1-ene"),
            Formula(BROMOBUTANE_2_R, "C4H9Br", "2-bromobutane"),
            Unsaturation(BROMOBUTANE_2_R, 0),
            Stereo(BROMOBUTANE_2_R, ("R",), "(R)-2-bromobutane"),
            Stereo(BROMOBUTANE_2_S, ("S",), "(S)-2-bromobutane"),
            Relationship(
                BROMOBUTANE_2_R, BROMOBUTANE_2_S, "enantiomers",
                "the planar cation is attacked on both faces equally, so the "
                "product is this pair in equal amounts",
            ),
            Formula(ME_BUT_2_ENE, "C5H10", "2-methylbut-2-ene"),
            Unsaturation(ME_BUT_2_ENE, 1),
            Formula(CHLORO_ME_BUTANE_2, "C5H11Cl", "2-chloro-2-methylbutane"),
            Formula(CHLORO_ME_BUTANE_3, "C5H11Cl", "2-chloro-3-methylbutane"),
            Relationship(CHLORO_ME_BUTANE_2, CHLORO_ME_BUTANE_3, "constitutional"),
            Environments(
                BROMOPROPANE_2, (6, 1),
                "two proton environments in a 6 to 1 ratio",
            ),
            Source(
                "Markovnikov's rule: in the addition of HX to an unsymmetrical "
                "alkene, the hydrogen adds to the carbon of the double bond "
                "bearing the greater number of hydrogen atoms.",
                "IUPAC Compendium of Chemical Terminology (the Gold Book), "
                "entry for Markownikoff rule.",
            ),
            Source(
                "Carbocation stability increases from primary through "
                "secondary to tertiary, and the addition proceeds through the "
                "more stable of the two possible cations.",
                CLAYDEN_ADDITION,
            ),
        ),
    ),
    "ORG1.HYDRATION": Lesson(
        node="ORG1.HYDRATION",
        objective=(
            "Choose among acid catalysed hydration, oxymercuration and "
            "hydroboration to place an OH on the carbon you want, and predict "
            "the stereochemistry that the hydroboration route imposes."
        ),
        build_on=(
            "HX addition through an open carbocation gave Markovnikov "
            "regiochemistry and a racemic product. Two of the three routes to "
            "an alcohol repeat that logic. The third never forms a cation, and "
            "that single difference reverses both the regiochemistry and the "
            "stereochemical outcome."
        ),
        core_idea=(
            "Acid catalysed hydration protonates the alkene to the more stable "
            "carbocation and water captures it, so the OH ends up on the more "
            "substituted carbon; because the cation is free and open, a "
            "neighbouring hydrogen or alkyl group can shift to it if that gives "
            "a more stable cation, and the isolated alcohol then has a "
            "rearranged skeleton. Oxymercuration followed by reduction reaches "
            "the same regiochemistry through a bridged mercurinium ion rather "
            "than an open cation, and a bridged ion has nothing to rearrange "
            "into, so the skeleton survives. Hydroboration is different in kind. "
            "Boron and hydrogen add across the double bond in one step through "
            "a four centre transition state, boron taking the less substituted "
            "and less hindered carbon; oxidative workup then replaces boron by "
            "OH at the carbon boron was on. Two consequences travel together "
            "and neither is optional: the OH ends up on the less substituted "
            "carbon, and because boron and hydrogen were delivered to the same "
            "face, the OH and the hydrogen end up syn to each other."
        ),
        worked_example=(
            "Propene first, for the regiochemistry alone. Dilute aqueous acid "
            "protonates C1 to give the secondary cation at C2, water captures "
            "it, and the product is propan-2-ol; oxymercuration and reduction "
            "arrive at the same alcohol by the bridged route. Hydroboration "
            "puts boron on C1, and oxidation replaces it with OH, giving "
            "propan-1-ol. The two alcohols are constitutional isomers of "
            "formula C3H8O. Now put the stereochemistry to work on "
            "1-methylcyclohexene, where the ring makes the syn requirement "
            "visible. Boron goes to C2, the carbon carrying only a hydrogen, "
            "and the hydrogen goes to C1, the carbon carrying the methyl, and "
            "both arrive on one face of the ring. After oxidation the OH sits "
            "on C2 on that face, and the hydrogen that was delivered sits on C1 "
            "on the same face, which pushes the methyl group already at C1 onto "
            "the opposite face. So the OH and the methyl end up on opposite "
            "faces: the product is trans-2-methylcyclohexan-1-ol, the (1S,2S) "
            "and (1R,2R) pair. It is a pair and not a single compound because "
            "the reagent can meet either face of the flat alkene, so the two "
            "enantiomers form in equal amounts. Finally, the rearrangement that "
            "only the acid route suffers: 3-methylbut-1-ene protonates to a "
            "secondary cation, a hydride shifts from the neighbouring carbon to "
            "give a tertiary cation, and the alcohol isolated is "
            "2-methylbutan-2-ol rather than the 3-methylbutan-2-ol the "
            "unrearranged path would give."
        ),
        try_it_prompt=(
            "You want propan-1-ol from propene, and you are offered dilute "
            "sulfuric acid and water. Will that do it? If not, say what it "
            "gives you and what you would use instead."
        ),
        try_it_answer=(
            "It gives propan-2-ol. Acid catalysed hydration runs through the "
            "more stable cation, the secondary one at C2, so the OH lands on "
            "C2 and no adjustment to the acid strength or the temperature "
            "moves it. To put the OH on C1 you need a route that never makes "
            "the cation: hydroboration delivers boron to the less substituted "
            "carbon and oxidative workup replaces boron by OH there, giving "
            "propan-1-ol. The two alcohols are constitutional isomers of "
            "formula C3H8O, which is the point of the question: the target "
            "formula was never in doubt, and the choice of route is what "
            "decides the connectivity."
        ),
        pitfall=(
            "Filing hydroboration under anti-Markovnikov and stopping there. "
            "The reaction makes two commitments, one about which carbon and one "
            "about which face, and the second is the one learners drop, because "
            "on an acyclic alkene the syn part usually leaves no visible trace "
            "in the product. On a ring it decides the answer outright. A "
            "learner who remembers only the regiochemistry writes "
            "cis-2-methylcyclohexan-1-ol for the worked example above, which is "
            "a diastereomer of the real product, a different compound with "
            "different physical properties, and it is marked wrong on a "
            "stereochemical ground the learner did not know was in play."
        ),
        claims=(
            Formula(PROPENE, "C3H6", "propene"),
            Unsaturation(PROPENE, 1),
            Formula(PROPAN_2_OL, "C3H8O", "propan-2-ol, the Markovnikov alcohol"),
            Formula(PROPAN_1_OL, "C3H8O", "propan-1-ol, the hydroboration alcohol"),
            Unsaturation(PROPAN_2_OL, 0),
            Relationship(
                PROPAN_2_OL, PROPAN_1_OL, "constitutional",
                "the two regiochemical outcomes are constitutional isomers",
            ),
            Formula(ME_CYCLOHEXENE, "C7H12", "1-methylcyclohexene"),
            Unsaturation(ME_CYCLOHEXENE, 2, "one ring plus one pi bond"),
            Stereo(
                ME_CYCLOHEXANOL_TRANS_SS, ("S", "S"),
                "(1S,2S)-2-methylcyclohexan-1-ol, one half of the trans product",
            ),
            Stereo(
                ME_CYCLOHEXANOL_TRANS_RR, ("R", "R"),
                "(1R,2R)-2-methylcyclohexan-1-ol, the other half",
            ),
            Relationship(
                ME_CYCLOHEXANOL_TRANS_SS, ME_CYCLOHEXANOL_TRANS_RR, "enantiomers",
                "syn addition to either face of an achiral alkene gives this "
                "pair in equal amounts",
            ),
            Stereo(
                ME_CYCLOHEXANOL_CIS, ("S", "R"),
                "the cis diastereomer, which syn addition does not give",
            ),
            Relationship(
                ME_CYCLOHEXANOL_TRANS_SS, ME_CYCLOHEXANOL_CIS, "diastereomers",
                "the trans and cis alcohols are different compounds, not two "
                "drawings of one",
            ),
            Formula(ME_CYCLOHEXANOL_TRANS_SS, "C7H14O", "2-methylcyclohexan-1-ol"),
            Unsaturation(ME_CYCLOHEXANOL_TRANS_SS, 1, "the ring alone"),
            Formula(ME_BUT_1_ENE_3, "C5H10", "3-methylbut-1-ene"),
            Formula(ME_BUTAN_2_OL_2, "C5H12O", "2-methylbutan-2-ol, rearranged"),
            Formula(ME_BUTAN_2_OL_3, "C5H12O", "3-methylbutan-2-ol, unrearranged"),
            Relationship(
                ME_BUTAN_2_OL_2, ME_BUTAN_2_OL_3, "constitutional",
                "a hydride shift changes the connectivity, not the formula",
            ),
            Source(
                "Hydroboration adds boron and hydrogen to the same face of the "
                "alkene in a concerted step, with boron adding to the less "
                "substituted carbon, and oxidative workup replaces boron by OH "
                "with retention of configuration.",
                CLAYDEN_ADDITION,
            ),
            Source(
                "Oxymercuration proceeds through a bridged mercurinium ion "
                "rather than an open carbocation, which is why it gives "
                "Markovnikov hydration without skeletal rearrangement.",
                CLAYDEN_ADDITION,
            ),
        ),
    ),
    "ORG1.HALOGENATION": Lesson(
        node="ORG1.HALOGENATION",
        objective=(
            "Predict the product of adding bromine, or bromine in water, to an "
            "alkene, including which face each new group occupies and where the "
            "OH goes in a halohydrin."
        ),
        build_on=(
            "The cations you have met so far were open and flat, which is why "
            "they gave racemic products and allowed rearrangement. Halogen "
            "addition goes through a bridged intermediate instead, and a bridge "
            "physically blocks one face."
        ),
        core_idea=(
            "Bromine has no permanent dipole, but the approaching pi electrons "
            "polarise it, and one bromine is delivered to the alkene as a "
            "bromine cation while the other leaves as bromide. The delivered "
            "bromine does not sit on one carbon; it bridges both, using a lone "
            "pair to make a three membered bromonium ion. That bridge occupies "
            "the face it formed on, so the bromide has to attack from the other "
            "face, at the back of one of the two C-Br bonds, and the two "
            "bromines in the product are therefore anti to each other. The same "
            "bridge explains the regiochemistry when the nucleophile is the "
            "solvent rather than bromide. In water the bridged ion is not "
            "symmetric: positive charge is shared unevenly, with more of it on "
            "the carbon better able to carry it, so water attacks the more "
            "substituted carbon. The OH therefore ends up on the more "
            "substituted carbon and the bromine on the less substituted one, "
            "which looks like Markovnikov regiochemistry and comes from the "
            "same charge argument."
        ),
        worked_example=(
            "Add bromine to (E)-but-2-ene and follow every face. The bromonium "
            "ion forms on one face of the alkene, say the top, bridging C2 and "
            "C3. Bromide now attacks from underneath, at either carbon, and "
            "inverts the carbon it attacks. Read off the product: the two "
            "bromines are on opposite faces, and the compound is "
            "meso-2,3-dibromobutane, the (2R,3S) isomer. It has two "
            "stereocentres and it is achiral, because an internal mirror plane "
            "relates one half to the other, so a sample of it shows no optical "
            "rotation. Now run the identical reaction on (Z)-but-2-ene, where "
            "the two methyl groups start on the same side rather than opposite "
            "sides. The same anti addition now delivers the (2R,3R) and (2S,3S) "
            "compounds, which are enantiomers of each other and are formed in "
            "equal amounts because the bromonium ion can form on either face. "
            "One reagent, one mechanism, two starting geometries, and two "
            "different stereochemical answers: that is what stereospecific "
            "means. The same reasoning on cyclohexene gives "
            "trans-1,2-dibromocyclohexane as the (1R,2R) and (1S,2S) pair, and "
            "not the cis compound, which is meso and would have required the "
            "two bromines to arrive on one face."
        ),
        try_it_prompt=(
            "2-methylpropene, (CH3)2C=CH2, is treated with bromine in water. "
            "Two products of formula C4H9BrO are conceivable: "
            "1-bromo-2-methylpropan-2-ol and 2-bromo-2-methylpropan-1-ol. Which "
            "forms, and what decides it?"
        ),
        try_it_answer=(
            "1-bromo-2-methylpropan-2-ol. Water opens the bromonium ion at the "
            "carbon carrying the larger share of the positive charge, and that "
            "is the more substituted carbon, C2, which has two methyl groups to "
            "stabilise it. So the OH ends up on C2 and the bromine stays on C1. "
            "The two candidates are constitutional isomers of one formula, so "
            "counting atoms could never have separated them; the charge "
            "distribution in the bridged ion is the whole of the argument. "
            "Notice that the answer looks like Markovnikov regiochemistry with "
            "OH playing the part of the halide, and arrives by a different "
            "route from a bridged ion rather than an open cation."
        ),
        pitfall=(
            "Drawing the bromonium ion as an open carbocation with a bromine "
            "hanging off the neighbouring carbon, because open cations are what "
            "the previous two lessons trained. That one simplification deletes "
            "both results this lesson exists for. An open cation is planar, so "
            "the second bromine could arrive on either face and the addition "
            "would stop being anti; and an open cation would be attacked by "
            "water wherever the geometry allowed. It also collapses the two "
            "different products from (E)- and (Z)-but-2-ene into one mixture, "
            "which is not what the experiment gives. If your mechanism cannot "
            "distinguish the two but-2-enes, the intermediate you drew is the "
            "wrong one."
        ),
        claims=(
            Formula(CYCLOHEXENE, "C6H10", "cyclohexene"),
            Unsaturation(CYCLOHEXENE, 2, "one ring plus one pi bond"),
            Stereo(
                DIBROMOCYCLOHEXANE_TRANS_SS, ("S", "S"),
                "(1S,2S)-1,2-dibromocyclohexane, the trans product",
            ),
            Stereo(DIBROMOCYCLOHEXANE_TRANS_RR, ("R", "R"), "its enantiomer"),
            Relationship(
                DIBROMOCYCLOHEXANE_TRANS_SS, DIBROMOCYCLOHEXANE_TRANS_RR,
                "enantiomers", "anti addition on either face gives this pair",
            ),
            Stereo(
                DIBROMOCYCLOHEXANE_CIS, ("R", "S"),
                "the cis isomer, which anti addition does not give",
            ),
            Relationship(
                DIBROMOCYCLOHEXANE_TRANS_SS, DIBROMOCYCLOHEXANE_CIS,
                "diastereomers",
            ),
            Relationship(
                DIBROMOCYCLOHEXANE_CIS, DIBROMOCYCLOHEXANE_CIS_ALT, "identical",
                "the cis compound is meso, so its two labellings name one "
                "compound",
            ),
            Formula(DIBROMOCYCLOHEXANE_TRANS_SS, "C6H10Br2", "1,2-dibromocyclohexane"),
            Unsaturation(DIBROMOCYCLOHEXANE_TRANS_SS, 1, "the ring alone"),
            Relationship(
                BUT_2_ENE_E, BUT_2_ENE_Z, "diastereomers",
                "the two starting geometries that lead to different products",
            ),
            Stereo(
                DIBROMOBUTANE_MESO, ("R", "S"),
                "meso-2,3-dibromobutane, from anti addition to the E alkene",
            ),
            Relationship(
                DIBROMOBUTANE_MESO, DIBROMOBUTANE_MESO_ALT, "identical",
                "(2R,3S) and (2S,3R) are one achiral compound",
            ),
            Stereo(DIBROMOBUTANE_RR, ("R", "R"), "from anti addition to the Z alkene"),
            Stereo(DIBROMOBUTANE_SS, ("S", "S"), "its enantiomer"),
            Relationship(DIBROMOBUTANE_RR, DIBROMOBUTANE_SS, "enantiomers"),
            Relationship(
                DIBROMOBUTANE_MESO, DIBROMOBUTANE_RR, "diastereomers",
                "the products from the two alkene geometries are different "
                "compounds, which is what stereospecific means",
            ),
            Formula(DIBROMOBUTANE_MESO, "C4H8Br2", "2,3-dibromobutane"),
            Unsaturation(DIBROMOBUTANE_MESO, 0),
            Formula(ISOBUTENE, "C4H8", "2-methylpropene"),
            Formula(BROMO_ME_PROPAN_2_OL, "C4H9BrO", "1-bromo-2-methylpropan-2-ol"),
            Formula(BROMO_ME_PROPAN_1_OL, "C4H9BrO", "2-bromo-2-methylpropan-1-ol"),
            Relationship(
                BROMO_ME_PROPAN_2_OL, BROMO_ME_PROPAN_1_OL, "constitutional",
                "the two halohydrin regiochemistries",
            ),
            Source(
                "Bromine adds to alkenes through a cyclic bromonium ion, which "
                "is opened by anti attack of the nucleophile at the more "
                "substituted carbon, making the addition anti and "
                "stereospecific.",
                CLAYDEN_ADDITION,
            ),
        ),
    ),
    "ORG1.HYDROGENATION": Lesson(
        node="ORG1.HYDROGENATION",
        objective=(
            "Predict the product and the stereochemistry of catalytic "
            "hydrogenation, and explain why the reaction's enthalpy is the "
            "standard measure of alkene stability."
        ),
        build_on=(
            "Bromine added anti because a bridged ion blocked one face. "
            "Hydrogenation is the opposite case and for a physical rather than "
            "an electronic reason: both hydrogens come off the same metal "
            "surface, so both arrive on the face lying against it."
        ),
        core_idea=(
            "Hydrogen gas and an alkene do not react with each other on their "
            "own. A finely divided metal, usually platinum, palladium or "
            "nickel, binds hydrogen and breaks it into surface bound hydrogen "
            "atoms, the alkene lies down on the same surface, and the two "
            "hydrogens are transferred to the face of the alkene that is in "
            "contact with the metal. Both new C-H bonds are therefore made on "
            "one face, which is syn addition. The alkene can lie on the surface "
            "either way up, so when the addition creates stereocentres an "
            "achiral alkene gives equal amounts of the two face selections, and "
            "the product is racemic unless the molecule's own symmetry makes "
            "the two the same compound. The reaction is exothermic, and the "
            "heat released is the heat of hydrogenation, which measures how far "
            "the alkene sat above the alkane it becomes. Since every isomeric "
            "alkene of one formula gives the same alkane, those numbers are "
            "directly comparable, and that is the measurement behind the "
            "stability ranking you already use."
        ),
        worked_example=(
            "Hydrogenate 1,2-dimethylcyclohexene over palladium. The double "
            "bond runs between C1 and C2, and each of those carbons already "
            "carries a methyl group. The ring lies on the metal and the two "
            "hydrogens are delivered to the face that is touching it, one to C1 "
            "and one to C2. The methyl groups were in the plane of the sp2 "
            "carbons and have nowhere to go but the other face, so they end up "
            "on the same face as each other: the product is "
            "cis-1,2-dimethylcyclohexane. Now check what that compound "
            "actually is before calling the job done. Its two stereocentres are "
            "(1R,2S), and reflecting the molecule maps it onto itself, so it is "
            "a meso compound, achiral and optically inactive despite having two "
            "stereocentres. The trans compound, the (1R,2R) and (1S,2S) pair, "
            "is a diastereomer of it, a genuinely different substance, and syn "
            "addition cannot reach it from this alkene at all. The two faces of "
            "the alkene did not need to be counted separately here, because "
            "both lead to the same meso product; on a substrate whose syn "
            "addition product is chiral, they would give a racemate."
        ),
        try_it_prompt=(
            "(E)-but-2-ene and (Z)-but-2-ene are each hydrogenated over "
            "palladium. Do they give the same product? Does your answer tell "
            "you anything about their relative stabilities?"
        ),
        try_it_answer=(
            "Both give butane, C4H10, the same compound. The only difference "
            "between the two starting materials was the geometry of the double "
            "bond, and the double bond is what the reaction consumes. That "
            "shared product is what makes the energy comparison possible: two "
            "heats of hydrogenation measured to one common end point differ by "
            "exactly the energy difference between the two alkenes. The "
            "measurement puts the E isomer lower in energy than the Z isomer, "
            "which is the trans over cis preference from the stability lesson, "
            "now with an experiment behind it rather than an argument about "
            "crowding."
        ),
        pitfall=(
            "Reading syn addition as a promise of a single stereoisomer. Syn "
            "fixes the relationship between the two new bonds; it says nothing "
            "about which face of the alkene the catalyst meets, and for an "
            "achiral alkene there is no reason to prefer either, so both are "
            "used equally. The worked example hides this, because its two face "
            "selections give the same meso compound. Change the substrate so "
            "that the syn product is chiral and the same reaction gives a "
            "racemate. The belief to correct is that a stereospecific reaction "
            "produces optically active material; what it produces is a defined "
            "relative configuration, and absolute configuration needs a chiral "
            "influence that a metal surface does not supply."
        ),
        claims=(
            Formula(DIMETHYLCYCLOHEXENE, "C8H14", "1,2-dimethylcyclohexene"),
            Unsaturation(DIMETHYLCYCLOHEXENE, 2, "one ring plus one pi bond"),
            Stereo(
                DIMETHYLCYCLOHEXANE_CIS, ("R", "S"),
                "cis-1,2-dimethylcyclohexane, the syn addition product",
            ),
            Relationship(
                DIMETHYLCYCLOHEXANE_CIS, DIMETHYLCYCLOHEXANE_CIS_ALT, "identical",
                "the cis compound is meso, so the two labellings are one "
                "compound and it is achiral",
            ),
            Stereo(DIMETHYLCYCLOHEXANE_TRANS_RR, ("R", "R"), "the trans compound"),
            Stereo(DIMETHYLCYCLOHEXANE_TRANS_SS, ("S", "S"), "its enantiomer"),
            Relationship(
                DIMETHYLCYCLOHEXANE_TRANS_RR, DIMETHYLCYCLOHEXANE_TRANS_SS,
                "enantiomers",
            ),
            Relationship(
                DIMETHYLCYCLOHEXANE_CIS, DIMETHYLCYCLOHEXANE_TRANS_RR,
                "diastereomers",
                "syn addition reaches the cis compound and not this one",
            ),
            Formula(DIMETHYLCYCLOHEXANE_CIS, "C8H16", "1,2-dimethylcyclohexane"),
            Unsaturation(DIMETHYLCYCLOHEXANE_CIS, 1, "the ring alone"),
            Formula(BUT_2_ENE_E, "C4H8", "(E)-but-2-ene"),
            Formula(BUT_2_ENE_Z, "C4H8", "(Z)-but-2-ene"),
            Relationship(BUT_2_ENE_E, BUT_2_ENE_Z, "diastereomers"),
            Formula(BUTANE, "C4H10", "butane, the product from both"),
            Unsaturation(BUTANE, 0),
            Environments(BUTANE, (6, 4), "two proton environments in a 6 to 4 ratio"),
            Source(
                "Catalytic hydrogenation over a heterogeneous metal catalyst "
                "delivers both hydrogen atoms to the same face of the alkene, "
                "making the addition syn.",
                CLAYDEN_ADDITION,
            ),
            Source(
                "Heats of hydrogenation measured to a common alkane are the "
                "standard experimental basis for ranking isomeric alkenes by "
                "stability.",
                CLAYDEN_ADDITION,
            ),
        ),
    ),
    "ORG1.EPOXIDATION": Lesson(
        node="ORG1.EPOXIDATION",
        objective=(
            "Choose the reagent that gives a syn diol and the sequence that "
            "gives an anti diol, and predict which stereoisomer each one "
            "produces from a given alkene."
        ),
        build_on=(
            "You now hold one syn addition, hydrogenation, and one anti "
            "addition, bromine. This lesson puts two routes to the same "
            "functional group side by side, where the choice of reagent and "
            "nothing else decides which stereoisomer you get."
        ),
        core_idea=(
            "A peroxy acid such as meta-chloroperoxybenzoic acid carries an "
            "electrophilic oxygen on a weak O-O bond and transfers that single "
            "oxygen to the alkene in one step, forming an epoxide with both new "
            "C-O bonds made on the same face. The epoxide is a strained "
            "three membered ring and water will open it under acid catalysis, "
            "attacking one carbon from the side opposite the C-O bond that is "
            "breaking, so the second oxygen arrives anti to the first: the "
            "sequence epoxidation then hydrolysis is a net anti dihydroxylation. "
            "The alternative delivers both oxygens together. Osmium tetroxide, "
            "and cold dilute permanganate, forms a cyclic ester spanning one "
            "face of the alkene, and hydrolysing that ester releases both OH "
            "groups on the face where they were formed: a syn dihydroxylation. "
            "So one alkene gives two different diols, and on a ring or on a "
            "disubstituted alkene those diols are different compounds with "
            "different melting points, not two ways of drawing one."
        ),
        worked_example=(
            "Take cyclohexene down both routes. Treat it with a peroxy acid and "
            "you get cyclohexene oxide, C6H10O, the epoxide fused to the ring. "
            "A three membered ring can only be fused cis, and the molecule has "
            "an internal mirror plane, so it is achiral. Add aqueous acid: "
            "water attacks one of the two epoxide carbons from the face "
            "opposite the C-O bond it is breaking, and the product is "
            "trans-cyclohexane-1,2-diol, the (1R,2R) and (1S,2S) pair, formed "
            "in equal amounts. Now the other route. Osmium tetroxide adds "
            "across one face and the workup releases both OH groups there, "
            "giving cis-cyclohexane-1,2-diol, which is (1R,2S). Check that one "
            "before moving on, because it is the interesting case: it has two "
            "stereocentres, and it has an internal mirror plane, so it is a "
            "meso compound and optically inactive. The two diols share the "
            "formula C6H12O2 and are diastereomers of each other. Also worth "
            "noticing on the way past: the epoxide C6H10O and cyclohexanone "
            "C6H10O are constitutional isomers, so a formula from a mass "
            "spectrum would not tell them apart."
        ),
        try_it_prompt=(
            "(Z)-but-2-ene is treated with osmium tetroxide and the product is "
            "worked up to the diol. Is the product optically active? Answer "
            "before checking, and then say what changes if you start from "
            "(E)-but-2-ene instead."
        ),
        try_it_answer=(
            "It is not optically active. Syn addition to the Z alkene, whose "
            "two methyl groups are on the same side, puts both OH groups on one "
            "face and gives meso-2,3-butanediol, the (2R,3S) compound. That "
            "molecule has an internal mirror plane, so it is achiral and a pure "
            "sample of it rotates plane polarised light not at all. Start from "
            "(E)-but-2-ene and the same syn addition gives the (2R,3R) and "
            "(2S,3S) compounds instead. Each of those is chiral, but the "
            "reagent meets either face of the alkene equally, so they are "
            "formed in equal amounts and the sample is racemic and again shows "
            "no rotation. The polarimeter reads zero in both experiments and "
            "the two products are genuinely different substances; you would "
            "tell them apart by melting point, or by how they behave toward "
            "another chiral compound."
        ),
        pitfall=(
            "Treating syn and cis as interchangeable words for the product. Syn "
            "describes how the reagent added, cis describes where two named "
            "groups sit in the product, and they line up only when the alkene's "
            "own substituents happen to cooperate. Syn dihydroxylation of "
            "(Z)-but-2-ene gives the meso diol and syn dihydroxylation of "
            "(E)-but-2-ene gives the chiral pair, and the reagent did the same "
            "thing both times. The related trap is expecting a chiral product "
            "to show a rotation: a racemate is made of chiral molecules and is "
            "optically inactive as a sample, so a zero reading rules out "
            "neither chirality nor a stereospecific mechanism."
        ),
        claims=(
            Formula(CYCLOHEXENE, "C6H10", "cyclohexene"),
            Unsaturation(CYCLOHEXENE, 2),
            Formula(CYCLOHEXENE_OXIDE, "C6H10O", "cyclohexene oxide"),
            Unsaturation(CYCLOHEXENE_OXIDE, 2, "two rings, no pi bond"),
            Stereo(
                CYCLOHEXENE_OXIDE, ("R", "S"),
                "the epoxide is cis fused and achiral",
            ),
            Relationship(
                CYCLOHEXENE_OXIDE, CYCLOHEXENE_OXIDE_ALT, "identical",
                "the two labellings name one meso compound",
            ),
            Relationship(
                CYCLOHEXENE_OXIDE, CYCLOHEXANONE, "constitutional",
                "same formula, different connectivity",
            ),
            Stereo(
                CYCLOHEXANEDIOL_TRANS_RR, ("R", "R"),
                "(1R,2R)-cyclohexane-1,2-diol, from the anti route",
            ),
            Stereo(CYCLOHEXANEDIOL_TRANS_SS, ("S", "S"), "its enantiomer"),
            Relationship(
                CYCLOHEXANEDIOL_TRANS_RR, CYCLOHEXANEDIOL_TRANS_SS, "enantiomers",
            ),
            Stereo(
                CYCLOHEXANEDIOL_CIS, ("R", "S"),
                "cis-cyclohexane-1,2-diol, from the syn route, meso",
            ),
            Relationship(
                CYCLOHEXANEDIOL_CIS, CYCLOHEXANEDIOL_CIS_ALT, "identical",
                "the cis diol is its own mirror image",
            ),
            Relationship(
                CYCLOHEXANEDIOL_CIS, CYCLOHEXANEDIOL_TRANS_RR, "diastereomers",
                "the syn and anti routes give different compounds",
            ),
            Formula(CYCLOHEXANEDIOL_CIS, "C6H12O2", "cyclohexane-1,2-diol"),
            Unsaturation(CYCLOHEXANEDIOL_CIS, 1, "the ring alone"),
            Relationship(BUT_2_ENE_E, BUT_2_ENE_Z, "diastereomers"),
            Stereo(
                BUTANEDIOL_MESO, ("R", "S"),
                "meso-2,3-butanediol, from syn addition to the Z alkene",
            ),
            Relationship(BUTANEDIOL_MESO, BUTANEDIOL_MESO_ALT, "identical"),
            Stereo(
                BUTANEDIOL_RR, ("R", "R"),
                "from syn addition to the E alkene",
            ),
            Stereo(BUTANEDIOL_SS, ("S", "S"), "its enantiomer"),
            Relationship(BUTANEDIOL_RR, BUTANEDIOL_SS, "enantiomers"),
            Relationship(
                BUTANEDIOL_MESO, BUTANEDIOL_RR, "diastereomers",
                "the two alkene geometries give different diols under one "
                "reagent",
            ),
            Formula(BUTANEDIOL_MESO, "C4H10O2", "2,3-butanediol"),
            Unsaturation(BUTANEDIOL_MESO, 0),
            Source(
                "A peroxy acid transfers one oxygen atom to an alkene in a "
                "concerted step, forming an epoxide with retention of the "
                "alkene geometry.",
                CLAYDEN_ADDITION,
            ),
            Source(
                "Osmium tetroxide adds across one face of an alkene to give a "
                "cyclic osmate ester, which on workup gives the syn diol; "
                "acid catalysed opening of an epoxide by water proceeds with "
                "attack anti to the breaking C-O bond and gives the anti diol.",
                CLAYDEN_ADDITION,
            ),
        ),
    ),
    "ORG1.OZONOLYSIS": Lesson(
        node="ORG1.OZONOLYSIS",
        objective=(
            "Predict the carbonyl fragments an alkene gives on ozonolysis, and "
            "reconstruct the alkene from a set of fragments."
        ),
        build_on=(
            "Every reaction so far kept the carbon skeleton intact and added "
            "atoms across the double bond. This one cuts the skeleton at the "
            "double bond, which makes it a tool for working out an unknown "
            "structure as much as a way of making something."
        ),
        core_idea=(
            "Ozone adds to the double bond and, after the initial adduct "
            "rearranges, the pi bond has been replaced by two carbon-oxygen "
            "double bonds, one on each of the former alkene carbons. What each "
            "fragment turns into depends only on what that carbon was already "
            "carrying. A carbon with two alkyl groups becomes a ketone. A "
            "carbon with one alkyl group and one hydrogen becomes an aldehyde "
            "if the workup is reductive, using zinc in acid or dimethyl "
            "sulfide, and a carboxylic acid if the workup is oxidative, using "
            "hydrogen peroxide. A terminal CH2 becomes methanal under reductive "
            "conditions. Working backwards is the same operation in reverse: "
            "delete the two oxygens and join the carbons that carried them with "
            "a double bond. One consequence is worth stating up front, because "
            "it limits what the method can tell you. The cut destroys the "
            "geometry of the double bond, so E and Z isomers give identical "
            "fragments and ozonolysis can never distinguish them."
        ),
        worked_example=(
            "Ozonolyse 2-methylbut-2-ene, (CH3)2C=CH-CH3, with a reductive "
            "workup. Cut the double bond and cap each carbon with an oxygen. "
            "The left carbon carried two methyl groups, so it becomes propanone, "
            "C3H6O. The right carbon carried one methyl and one hydrogen, so "
            "with a reductive workup it becomes ethanal, C2H4O. Audit the "
            "atoms: the alkene was C5H10, and three carbons plus two carbons is "
            "five, six hydrogens plus four is ten. Now run the reaction "
            "backwards. An unknown hydrocarbon of formula C6H12 gives propanone "
            "and propanal on ozonolysis with reductive workup. Erase the two "
            "oxygens and join the carbons they sat on: (CH3)2C= joined to "
            "=CH-CH2-CH3 gives 2-methylpent-2-ene, C6H12, which matches. Notice "
            "that the two fragments happen to share the formula C3H6O and are "
            "constitutional isomers of each other, so you had to read their "
            "connectivity, not their formulas, to know which end was which. One "
            "structural case behaves differently and is worth having ready: an "
            "alkene inside a ring gives a single product, because cutting a "
            "ring once leaves the two ends still tied together. Cyclohexene, "
            "C6H10, gives hexanedial, C6H10O2, as one compound rather than two "
            "fragments."
        ),
        try_it_prompt=(
            "An alkene of formula C7H12 gives a single product on ozonolysis "
            "with reductive workup, and that product is 6-oxoheptanal, "
            "CH3-CO-CH2CH2CH2CH2-CHO. What was the alkene?"
        ),
        try_it_answer=(
            "1-methylcyclohexene. A single product from one cut means the two "
            "cut ends never separated, so the double bond was inside a ring. "
            "Rejoin the two carbonyl carbons with a double bond: the aldehyde "
            "carbon and the ketone carbon become the two alkene carbons, and "
            "the four CH2 groups between them close the six membered ring, with "
            "the methyl that was on the ketone carbon left as the substituent. "
            "That is 1-methylcyclohexene, C7H12. The unsaturation count "
            "confirms it: the alkene has two degrees, one ring and one pi bond, "
            "and 6-oxoheptanal also has two, the two carbonyls, which is what "
            "you expect when a ring is traded for a second C=O."
        ),
        pitfall=(
            "Forgetting that the workup is part of the answer. The same alkene "
            "gives an aldehyde with a reductive workup and a carboxylic acid "
            "with an oxidative one at every carbon that carried a hydrogen, "
            "while a carbon carrying two alkyl groups gives a ketone under both "
            "because it has no hydrogen left to oxidise. Writing aldehydes for "
            "an oxidative workup is a whole functional group wrong. The second "
            "trap runs the other way: reading one carbonyl product as evidence "
            "of a symmetric alkene. Two identical fragments do mean a symmetric "
            "alkene, but a single dicarbonyl compound means a ring, and you "
            "separate the two cases by counting the product's carbons against "
            "the alkene's."
        ),
        claims=(
            Formula(ME_BUT_2_ENE, "C5H10", "2-methylbut-2-ene"),
            Unsaturation(ME_BUT_2_ENE, 1),
            Formula(ACETONE, "C3H6O", "propanone, from the disubstituted carbon"),
            Unsaturation(ACETONE, 1, "the carbonyl"),
            Environments(ACETONE, (6,), "one proton environment: six equivalent hydrogens"),
            Formula(ACETALDEHYDE, "C2H4O", "ethanal, from the CH carbon"),
            Unsaturation(ACETALDEHYDE, 1),
            Formula(ACETIC_ACID, "C2H4O2", "ethanoic acid, the oxidative workup product"),
            Formula(PROPANAL, "C3H6O", "propanal"),
            Relationship(
                ACETONE, PROPANAL, "constitutional",
                "the two fragments in the reverse problem share a formula",
            ),
            Formula(ME_PENT_2_ENE, "C6H12", "2-methylpent-2-ene, the reconstructed alkene"),
            Unsaturation(ME_PENT_2_ENE, 1),
            Formula(CYCLOHEXENE, "C6H10", "cyclohexene"),
            Unsaturation(CYCLOHEXENE, 2),
            Formula(HEXANEDIAL, "C6H10O2", "hexanedial, one product from a ring"),
            Unsaturation(HEXANEDIAL, 2, "two carbonyls, no ring"),
            Environments(HEXANEDIAL, (4, 4, 2), "three environments, symmetric chain"),
            Formula(ME_CYCLOHEXENE, "C7H12", "1-methylcyclohexene"),
            Unsaturation(ME_CYCLOHEXENE, 2, "one ring plus one pi bond"),
            Formula(OXOHEPTANAL, "C7H12O2", "6-oxoheptanal"),
            Unsaturation(OXOHEPTANAL, 2, "two carbonyls, the ring is gone"),
            Relationship(
                BUT_2_ENE_E, BUT_2_ENE_Z, "diastereomers",
                "distinguishable compounds that ozonolysis cannot tell apart, "
                "since both give two molecules of ethanal",
            ),
            Source(
                "Ozonolysis cleaves the carbon-carbon double bond to two "
                "carbonyl compounds; reductive workup gives aldehydes and "
                "ketones, oxidative workup gives carboxylic acids and ketones.",
                CLAYDEN_ADDITION,
            ),
        ),
    ),
    "ORG1.RADICALHBR": Lesson(
        node="ORG1.RADICALHBR",
        objective=(
            "Predict the product of HBr addition in the presence of a peroxide, "
            "and explain from the chain mechanism why the regiochemistry "
            "reverses and why only HBr behaves this way."
        ),
        build_on=(
            "Ionic HBr addition put the hydrogen where it left the better "
            "carbocation. Change the intermediate from a cation to a radical "
            "and the species that attacks the alkene changes, and the "
            "regiochemistry follows the species, not the reagent."
        ),
        core_idea=(
            "A peroxide has a weak O-O bond that breaks on warming or on "
            "irradiation to give two oxygen centred radicals, and one of those "
            "takes the hydrogen from H-Br to leave a bromine radical. From "
            "there the chain runs in two propagation steps. First the bromine "
            "radical, not a proton, adds to the alkene, and it adds to whichever "
            "carbon leaves the more stable carbon radical behind. Radical "
            "stability follows the same tertiary above secondary above primary "
            "order as carbocation stability and for related reasons, so the "
            "bromine ends up on the less substituted carbon and the unpaired "
            "electron on the more substituted one. Second, that carbon radical "
            "takes a hydrogen atom from another molecule of HBr, which puts the "
            "hydrogen on the more substituted carbon and regenerates the "
            "bromine radical to carry the chain onward. The net addition is the "
            "reverse of the ionic one, from the same two reagents, with the "
            "presence or absence of an initiator as the only difference."
        ),
        worked_example=(
            "Add HBr to propene with a peroxide present. The bromine radical "
            "attacks C1, the CH2 end, because that leaves a secondary radical "
            "at C2; attacking C2 would leave a primary radical at C1, which is "
            "higher in energy. The secondary radical then abstracts a hydrogen "
            "from HBr, and that hydrogen lands on C2. The product is "
            "1-bromopropane. Run the same two reagents with the peroxide left "
            "out and the ionic mechanism takes over, giving 2-bromopropane "
            "instead. The two are constitutional isomers of formula C3H7Br, so "
            "the difference is real and is not visible in a molecular formula; "
            "it is visible in a proton spectrum, where 2-bromopropane has two "
            "environments in a 6 to 1 ratio and 1-bromopropane has three in a 3 "
            "to 2 to 2 ratio. One thing does not change between the two "
            "mechanisms: a carbon radical, like a carbocation, is close to "
            "planar, so the hydrogen abstraction step is not stereoselective. "
            "With propene that leaves no trace, because neither product has a "
            "stereocentre."
        ),
        try_it_prompt=(
            "But-1-ene is treated with HBr and a peroxide initiator. What is "
            "the product, and is it formed as a single enantiomer, as a "
            "racemate, or is the question inapplicable?"
        ),
        try_it_answer=(
            "The product is 1-bromobutane, and the question does not apply, "
            "because 1-bromobutane has no stereocentre. The bromine radical "
            "adds to C1 and leaves a secondary radical at C2, which then takes "
            "a hydrogen from HBr, so the bromine sits at the end of the chain "
            "and the new hydrogen in the middle. Compare the ionic route on the "
            "same alkene: without the peroxide, HBr gives 2-bromobutane, whose "
            "C2 carries four different groups and is a stereocentre, and "
            "because the cation intermediate is planar the product is a "
            "racemate. One alkene, one acid, and the initiator decides both "
            "which constitutional isomer forms and whether there is a "
            "stereochemical question at all."
        ),
        pitfall=(
            "Generalising the peroxide effect to HCl and HI. The belief behind "
            "the error is that radicals as a class add anti-Markovnikov, when "
            "what is actually required is that both propagation steps be "
            "favourable enough to keep a chain running against termination. For "
            "HBr both are. For HCl the step that would regenerate the chlorine "
            "radical by hydrogen abstraction is too costly, and for HI it is "
            "the addition of the iodine radical to the alkene that fails. So "
            "the reversal is specific to HBr, and a mechanism that predicts "
            "anti-Markovnikov HCl has generalised past its evidence."
        ),
        claims=(
            Formula(PROPENE, "C3H6", "propene"),
            Unsaturation(PROPENE, 1),
            Formula(BROMOPROPANE_1, "C3H7Br", "1-bromopropane, the radical product"),
            Formula(BROMOPROPANE_2, "C3H7Br", "2-bromopropane, the ionic product"),
            Unsaturation(BROMOPROPANE_1, 0),
            Relationship(
                BROMOPROPANE_1, BROMOPROPANE_2, "constitutional",
                "the two mechanisms give constitutional isomers from one pair "
                "of reagents",
            ),
            Environments(
                BROMOPROPANE_2, (6, 1),
                "2-bromopropane: two environments in a 6 to 1 ratio",
            ),
            Environments(
                BROMOPROPANE_1, (3, 2, 2),
                "1-bromopropane: three environments in a 3 to 2 to 2 ratio",
            ),
            Formula(BUT_1_ENE, "C4H8", "but-1-ene"),
            Unsaturation(BUT_1_ENE, 1),
            Formula(BROMOBUTANE_1, "C4H9Br", "1-bromobutane, no stereocentre"),
            Formula(BROMOBUTANE_2, "C4H9Br", "2-bromobutane, one stereocentre"),
            Relationship(BROMOBUTANE_1, BROMOBUTANE_2, "constitutional"),
            Stereo(BROMOBUTANE_2_R, ("R",), "(R)-2-bromobutane"),
            Stereo(BROMOBUTANE_2_S, ("S",), "(S)-2-bromobutane"),
            Relationship(
                BROMOBUTANE_2_R, BROMOBUTANE_2_S, "enantiomers",
                "the ionic route gives this pair in equal amounts",
            ),
            Source(
                "Hydrogen bromide adds to alkenes with the opposite "
                "regiochemistry in the presence of peroxides, by a radical "
                "chain mechanism; this is the peroxide effect.",
                "M. S. Kharasch and F. R. Mayo, Journal of the American "
                "Chemical Society, 1933, reporting the peroxide effect in the "
                "addition of hydrogen bromide to unsaturated compounds.",
            ),
            Source(
                "Among the hydrogen halides only HBr shows the peroxide "
                "effect, because for HCl and HI one of the two propagation "
                "steps is too unfavourable to sustain the chain.",
                CLAYDEN_ADDITION,
            ),
        ),
    ),
    "ORG1.ALKENESYNTH": Lesson(
        node="ORG1.ALKENESYNTH",
        objective=(
            "Choose an elimination route to a target alkene, predict which "
            "alkene predominates, and say what the base and the geometry of the "
            "substrate have to do with the answer."
        ),
        build_on=(
            "Every reaction in this unit so far consumed a double bond. Making "
            "one runs the same chemistry backwards, and it is your first look "
            "at elimination, which the next unit treats alongside substitution."
        ),
        core_idea=(
            "Both standard routes remove a leaving group from one carbon and a "
            "hydrogen from the carbon next to it. Dehydrohalogenation treats an "
            "alkyl halide with a strong base; in the concerted E2 pathway the "
            "base takes the proton while the halide leaves, all in one step, "
            "and that step requires the C-H being broken and the C-X being "
            "broken to be anti-periplanar, lined up on opposite sides of the "
            "central bond in one plane. That geometric requirement means the "
            "substrate's available conformations, not only its constitution, "
            "control which hydrogen can be removed and therefore which alkene "
            "forms. Dehydration treats an alcohol with concentrated acid: the "
            "OH is protonated so that water can leave, and for secondary and "
            "tertiary substrates a carbocation forms and then loses a proton "
            "from an adjacent carbon. When more than one alkene is reachable, "
            "the more substituted one usually predominates because it is the "
            "more stable, which is Zaitsev's preference. A bulky base changes "
            "that, because it reaches the exposed hydrogens at the end of a "
            "chain more easily than the crowded internal ones, and the less "
            "substituted alkene comes to dominate."
        ),
        worked_example=(
            "Treat 2-bromobutane with a strong base and count the options "
            "before naming a product. The bromine is on C2, so a hydrogen can "
            "be removed from C1 or from C3. Take it from C1 and the double bond "
            "forms between C1 and C2, giving but-1-ene, which is "
            "monosubstituted. Take it from C3 and the double bond forms between "
            "C2 and C3, giving but-2-ene, which is disubstituted and comes in "
            "two geometries, with the E isomer favoured over the Z because it "
            "is the more stable alkene. All three products are C4H8: but-1-ene "
            "is a constitutional isomer of the two but-2-enes, and the two "
            "but-2-enes are diastereomers of each other. With a small base such "
            "as ethoxide, the Zaitsev product but-2-ene predominates. Change "
            "nothing but the base, to bulky potassium tert-butoxide, and the "
            "balance moves toward but-1-ene, because a large base finds the "
            "primary hydrogens at C1 easier to reach than the internal ones at "
            "C3. Note what did not change: the substrate, the leaving group and "
            "the fact that both alkenes were always available. The base "
            "selected between them."
        ),
        try_it_prompt=(
            "You need (E)-but-2-ene. You are offered butan-2-ol with "
            "concentrated sulfuric acid, or 2-bromobutane with potassium "
            "tert-butoxide. Which do you take, and what does the other one give "
            "you?"
        ),
        try_it_answer=(
            "Take the acid catalysed dehydration of butan-2-ol. It proceeds "
            "through a cation that then loses a proton to give the most stable "
            "alkene available, which is (E)-but-2-ene, with (Z)-but-2-ene and "
            "but-1-ene as minor products. The other option does the opposite of "
            "what you want on purpose: potassium tert-butoxide is chosen when "
            "the less substituted alkene is the target, and it pushes the "
            "mixture toward but-1-ene. Neither route gives one alkene to the "
            "exclusion of the others, so a real preparation still ends in a "
            "separation, and that is workable here because but-1-ene is a "
            "constitutional isomer of the but-2-enes and the two but-2-enes are "
            "diastereomers, so all three differ in ordinary physical properties."
        ),
        pitfall=(
            "Treating Zaitsev as a law rather than a preference. It describes "
            "what a small base and a conformationally free substrate usually "
            "do, and it is overridden by a bulky base, which is why potassium "
            "tert-butoxide appears in problems at all. It can also be "
            "overridden by geometry, because E2 needs an anti-periplanar "
            "hydrogen, and a ring or a large neighbouring group can make the "
            "hydrogen that would lead to the more substituted alkene "
            "unavailable in any accessible conformation. The belief to correct "
            "is that the product is decided by the stability of the alkenes "
            "alone. It is decided by which transition state is reachable, and "
            "stability is only one of the things that decides that."
        ),
        claims=(
            Formula(BROMOBUTANE_2, "C4H9Br", "2-bromobutane, the substrate"),
            Unsaturation(BROMOBUTANE_2, 0),
            Stereo(BROMOBUTANE_2_R, ("R",), "either enantiomer gives the same alkenes"),
            Stereo(BROMOBUTANE_2_S, ("S",), "its mirror image"),
            Relationship(BROMOBUTANE_2_R, BROMOBUTANE_2_S, "enantiomers"),
            Formula(BUT_1_ENE, "C4H8", "but-1-ene, the Hofmann product"),
            Formula(BUT_2_ENE_E, "C4H8", "(E)-but-2-ene, the major Zaitsev product"),
            Formula(BUT_2_ENE_Z, "C4H8", "(Z)-but-2-ene"),
            Unsaturation(BUT_1_ENE, 1),
            Relationship(
                BUT_1_ENE, BUT_2_ENE_E, "constitutional",
                "the two regiochemical outcomes of the elimination",
            ),
            Relationship(
                BUT_2_ENE_E, BUT_2_ENE_Z, "diastereomers",
                "the two geometries of the Zaitsev product",
            ),
            Formula(BUTAN_2_OL, "C4H10O", "butan-2-ol, the dehydration substrate"),
            Unsaturation(BUTAN_2_OL, 0),
            Formula(BUTAN_1_OL, "C4H10O", "butan-1-ol"),
            Relationship(BUTAN_2_OL, BUTAN_1_OL, "constitutional"),
            Formula(ME_BUTAN_2_OL_2, "C5H12O", "2-methylbutan-2-ol"),
            Formula(ME_BUT_2_ENE, "C5H10", "2-methylbut-2-ene, its Zaitsev alkene"),
            Formula(ME_BUT_1_ENE, "C5H10", "2-methylbut-1-ene, the less substituted alkene"),
            Relationship(
                ME_BUT_2_ENE, ME_BUT_1_ENE, "constitutional",
                "the Zaitsev and Hofmann alkenes from one substrate",
            ),
            Source(
                "In an E2 elimination the proton removed and the leaving group "
                "must be anti-periplanar, so the accessible conformations of "
                "the substrate control which alkene can form.",
                CLAYDEN_ELIMINATION,
            ),
            Source(
                "Elimination normally gives the more substituted alkene, "
                "Zaitsev's preference, but a bulky base such as potassium "
                "tert-butoxide favours the less substituted alkene.",
                CLAYDEN_ELIMINATION,
            ),
        ),
    ),
}
