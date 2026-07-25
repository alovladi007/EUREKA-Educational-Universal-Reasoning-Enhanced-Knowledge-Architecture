"""ORG1 Unit 8: Organohalides and Radical Reactions.

Every structural fact stated in these lessons carries a claim that RDKit
re-derives from the structure when the test suite runs. Nothing here was typed
from memory: the proton environment counts, the molecular formulas and the CIP
descriptors were all read back out of the toolchain first and written into the
prose second.

That order matters most in the radical lessons. The whole pedagogical payload
of radical halogenation is a counting argument (how many distinct hydrogens,
therefore how many products, therefore what relationship do those products
stand in) and a counting argument written by hand is a counting argument
written wrong. Symmetry is derived here, not asserted.

Substrate policy for this unit: the mechanism is taught on methane, ethane,
propane, butane, 2-methylpropane, 2,2-dimethylpropane, propene, but-1-ene,
cyclohexene and toluene. No preparative procedure, quantity, temperature or
scale-up condition appears anywhere in this file, and no compound is discussed
whose interest lies outside teaching the mechanism.
"""

from __future__ import annotations

from app.data.claims import Environments, Formula, Relationship, Source, Stereo
from app.data.lesson_types import Lesson

# --- Substrates, named once so a claim and its prose cannot drift apart. ---
METHANE = "C"
ETHANE = "CC"
PROPANE = "CCC"
BUTANE = "CCCC"
METHYLPROPANE = "CC(C)C"          # 2-methylpropane
DIMETHYLPROPANE = "CC(C)(C)C"     # 2,2-dimethylpropane
PROPENE = "CC=C"
BUTENE_1 = "C=CCC"
CYCLOHEXENE = "C1=CCCCC1"
TOLUENE = "Cc1ccccc1"

# --- Halides. ---
CHLOROMETHANE = "CCl"
IODOMETHANE = "CI"
CHLORO_1_PROPANE = "CCCCl"        # 1-chloropropane
CHLORO_2_PROPANE = "CC(C)Cl"      # 2-chloropropane
CHLORO_1_METHYLPROPANE = "CC(C)CCl"    # 1-chloro-2-methylpropane, primary
CHLORO_2_METHYLPROPANE = "CC(C)(C)Cl"  # 2-chloro-2-methylpropane, tertiary
CHLORO_3_METHYLBUTANE = "ClCCC(C)C"    # 1-chloro-3-methylbutane
CHLORO_1_BUTANE = "CCCCCl"        # 1-chlorobutane
# 2-chlorobutane, both configurations. Written by generating the two @/@@ forms
# and reading the descriptor back rather than by reasoning about which is which.
CHLORO_2_BUTANE_S = "CC[C@H](C)Cl"
CHLORO_2_BUTANE_R = "CC[C@@H](C)Cl"

BROMO_1_BUTANE = "CCCCBr"
BROMOETHANE = "CCBr"
BROMOBENZENE = "Brc1ccccc1"
BENZYL_BROMIDE = "BrCc1ccccc1"
ALLYL_BROMIDE = "C=CCBr"          # 3-bromoprop-1-ene
# Allylic bromination of but-1-ene: the two termini of one delocalised radical.
BROMO_3_BUTENE_R = "C[C@@H](Br)C=C"   # (R)-3-bromobut-1-ene
BROMO_3_BUTENE_S = "C[C@H](Br)C=C"    # (S)-3-bromobut-1-ene
BROMO_1_BUTENE_2 = "CC=CCBr"          # 1-bromobut-2-ene
# 3-bromocyclohexene, both configurations, descriptors read back from RDKit.
BROMOCYCLOHEXENE_S = "Br[C@H]1CCCC=C1"
BROMOCYCLOHEXENE_R = "Br[C@@H]1CCCC=C1"

# --- Carbonyl partners and coupling products. ---
ETHANAL = "CC=O"
PROPANONE = "CC(C)=O"
BUTAN_2_OL_S = "CC[C@H](C)O"
BUTAN_2_OL_R = "CC[C@@H](C)O"
METHYLBUTAN_2_OL = "CCC(C)(C)O"   # 2-methylbutan-2-ol
PENTANE = "CCCCC"
METHYLBUTANE = "CCC(C)C"          # 2-methylbutane
BIPHENYL = "c1ccc(-c2ccccc2)cc1"


LESSONS_ORG1_U8 = {
    "ORG1.HALIDENOMEN": Lesson(
        node="ORG1.HALIDENOMEN",
        objective=(
            "Name an alkyl halide by the IUPAC rules, classify the carbon "
            "bearing the halogen as primary, secondary or tertiary, and say "
            "which end of the carbon halogen bond carries partial positive "
            "charge."
        ),
        build_on=(
            "You can already name a branched alkane: find the longest chain, "
            "number it to give the lowest set of locants, and cite the "
            "substituents alphabetically. A halogen changes nothing about that "
            "procedure. It is one more substituent, named fluoro, chloro, "
            "bromo or iodo, and it takes its place in the same alphabetical "
            "list as methyl and ethyl."
        ),
        core_idea=(
            "An alkyl halide is a carbon skeleton with one hydrogen replaced by "
            "a halogen, and two facts about it decide almost everything that "
            "follows. The first is substitution class. Count the carbons "
            "attached to the carbon that carries the halogen: none or one makes "
            "it primary, two makes it secondary, three makes it tertiary. That "
            "one count will later predict which substitution mechanism operates "
            "and which product a radical reaction favours. The second fact is "
            "polarity. Carbon has a Pauling electronegativity of about 2.55, "
            "and fluorine, chlorine and bromine all exceed it, so the shared "
            "electrons sit closer to the halogen and the carbon is left with a "
            "partial positive charge. That partial positive carbon is the "
            "electrophilic site, and it is why alkyl halides react with "
            "nucleophiles at all. Iodine is the exception worth holding onto: "
            "its electronegativity is slightly below carbon's, so a C-I bond is "
            "barely polar, and yet iodide is the best leaving group of the four "
            "because the bond is long and weak. Polarity and reactivity are two "
            "different axes, and this unit will keep separating them."
        ),
        worked_example=(
            "Name the compound ClCH2CH2CH(CH3)CH3. Start with the parent "
            "chain: the longest continuous run of carbons through the molecule "
            "is four, so it is a butane, with a methyl branch hanging off it. "
            "Now number. From the chlorine end, the substituents fall at "
            "positions 1 and 3, giving the locant set {1,3}. From the other "
            "end they fall at 2 and 4, giving {2,4}. Compare the sets at the "
            "first point of difference: 1 is lower than 2, so the chlorine end "
            "is C1. Cite the substituents alphabetically, chloro before methyl, "
            "and the name is 1-chloro-3-methylbutane, molecular formula "
            "C5H11Cl. Finally classify: the carbon holding the chlorine is "
            "attached to one other carbon, so this is a primary alkyl halide, "
            "and the carbon carries the partial positive charge because "
            "chlorine is the more electronegative partner."
        ),
        try_it_prompt=(
            "Write the IUPAC name for (CH3)3CCl, classify it as primary, "
            "secondary or tertiary, and say how many distinct hydrogen "
            "environments it contains. Work out all three before reading on."
        ),
        try_it_answer=(
            "The parent chain is the longest run of carbons, which is three, so "
            "it is a propane. The chlorine and a methyl group both sit on C2, "
            "giving 2-chloro-2-methylpropane, molecular formula C4H9Cl. The "
            "carbon bearing the chlorine is attached to three other carbons, so "
            "it is tertiary. All nine hydrogens sit on three methyl groups that "
            "the molecule's symmetry makes equivalent, so there is exactly one "
            "hydrogen environment. Contrast its isomer 1-chloro-2-methylpropane, "
            "which is primary and has three environments in a 6:2:1 ratio."
        ),
        pitfall=(
            "The belief that the most polar carbon halogen bond must be the "
            "most reactive one. It is the least reactive. C-F is the most "
            "polar of the four and also the shortest and strongest, and "
            "fluoride is a poor leaving group precisely because that bond is "
            "hard to break. C-I is the least polar and the most easily broken. "
            "If you find yourself predicting reactivity from a dipole arrow "
            "alone, stop and ask what the bond strength is doing, because in "
            "the halogen group the two trends run opposite to each other. The "
            "second, smaller trap is assuming a halogen outranks an alkyl group "
            "when you number the chain. It does not. Halogens and alkyl groups "
            "are treated identically for locants, and alphabetical order only "
            "breaks a tie."
        ),
        claims=(
            Formula(CHLOROMETHANE, "CH3Cl", "chloromethane"),
            Formula(IODOMETHANE, "CH3I", "iodomethane"),
            Formula(CHLORO_3_METHYLBUTANE, "C5H11Cl", "1-chloro-3-methylbutane"),
            Formula(CHLORO_2_METHYLPROPANE, "C4H9Cl", "2-chloro-2-methylpropane"),
            Environments(
                CHLORO_2_METHYLPROPANE, (9,),
                "all nine hydrogens are equivalent by symmetry, so one "
                "environment",
            ),
            Environments(
                CHLORO_1_METHYLPROPANE, (6, 2, 1),
                "1-chloro-2-methylpropane, three environments",
            ),
            Relationship(
                CHLORO_1_METHYLPROPANE, CHLORO_2_METHYLPROPANE, "constitutional",
                "the primary and tertiary C4H9Cl isomers differ in connectivity",
            ),
            Source(
                "Pauling electronegativities are about 2.55 for carbon, 3.98 "
                "for fluorine, 3.16 for chlorine, 2.96 for bromine and 2.66 "
                "for iodine, while the carbon halogen bond lengthens and "
                "weakens down the group, so the most polar C-X bond is also "
                "the strongest.",
                "Pauling electronegativity values as tabulated in the CRC "
                "Handbook of Chemistry and Physics; carbon halogen bond "
                "dissociation enthalpies in Y.-R. Luo, Comprehensive Handbook "
                "of Chemical Bond Energies, CRC Press, 2007.",
            ),
        ),
    ),
    "ORG1.RADICALHALOGEN": Lesson(
        node="ORG1.RADICALHALOGEN",
        objective=(
            "Write the initiation, propagation and termination steps of radical "
            "halogenation, predict how many monohalogenation products a given "
            "alkane can give and what relationship they stand in, and explain "
            "why bromination discriminates between C-H bonds while chlorination "
            "barely does."
        ),
        build_on=(
            "You can classify a C-H position as primary, secondary or tertiary. "
            "That classification is about to earn its keep, because a radical "
            "reaction chooses which hydrogen to remove almost entirely on the "
            "basis of what kind of radical is left behind."
        ),
        core_idea=(
            "Radical halogenation is a chain reaction in three stages. "
            "Initiation: light or heat splits the halogen molecule "
            "homolytically, one electron going to each atom, producing two "
            "halogen atoms. Propagation, first step: a halogen atom abstracts a "
            "hydrogen from the alkane, giving H-X and a carbon radical. "
            "Propagation, second step: that carbon radical attacks the halogen "
            "molecule, giving the alkyl halide and a fresh halogen atom, which "
            "goes back into the first step. The two propagation steps consume "
            "no radicals overall, which is why one initiation event can turn "
            "over many molecules. Termination is any collision of two radicals, "
            "which removes them from the chain. Two consequences follow and "
            "both are structural. First, every distinct kind of C-H in the "
            "substrate is a candidate, so the product is a mixture of "
            "constitutional isomers, one for each distinct hydrogen "
            "environment. Counting the environments counts the products. "
            "Second, the carbon radical is planar and sp2 hybridised at the "
            "radical centre, so when abstraction creates a new stereocentre the "
            "halogen can arrive at either face with equal probability and the "
            "product is racemic, a 50:50 mixture of enantiomers with no optical "
            "rotation. Radical stability runs tertiary above secondary above "
            "primary above methyl, mirroring the C-H bond dissociation "
            "enthalpies, and that ordering is what sets the ratio within the "
            "mixture."
        ),
        worked_example=(
            "Take propane and ask how many monochlorination products it can "
            "give. Do not count carbons, count hydrogen environments. Propane "
            "has eight hydrogens in two environments: the six on C1 and C3, "
            "which the molecule's symmetry makes equivalent, and the two on C2. "
            "Two environments, therefore exactly two monochlorides: "
            "1-chloropropane and 2-chloropropane, both C3H7Cl, and they are "
            "constitutional isomers of each other since they differ in where "
            "the chlorine is connected. Now ask about the ratio. If every "
            "hydrogen were equally reactive, the 6:2 count would give 75 "
            "percent of the primary product. What is observed near room "
            "temperature is closer to an even split, because each secondary "
            "hydrogen is roughly three and a half times as reactive as each "
            "primary one. That is a weak preference. Run the same substrate "
            "with bromine instead and the secondary product dominates "
            "overwhelmingly. The reason is the Hammond postulate: the chlorine "
            "atom is very reactive, so its abstraction step is strongly "
            "exothermic and its transition state resembles the starting "
            "material, where the radical's stability has barely begun to "
            "matter. The bromine atom is much less reactive, its abstraction "
            "step is close to thermoneutral or endothermic, and its transition "
            "state resembles the product radical, so the full stability "
            "difference shows up in the rate. The more reactive halogen is the "
            "less selective one."
        ),
        try_it_prompt=(
            "How many different monochlorination products can 2,2-dimethyl"
            "propane, (CH3)4C, give? Compare your answer with 2-methylpropane, "
            "(CH3)3CH. Count hydrogen environments in each before answering."
        ),
        try_it_answer=(
            "2,2-dimethylpropane gives exactly one. All twelve of its hydrogens "
            "sit on four methyl groups that symmetry makes equivalent, so there "
            "is a single hydrogen environment and therefore a single monochloro "
            "product. 2-methylpropane gives two, because its ten hydrogens fall "
            "into two environments in a 9:1 ratio: nine primary hydrogens on "
            "the three methyl groups and one tertiary hydrogen at C2. The two "
            "products, 1-chloro-2-methylpropane and 2-chloro-2-methylpropane, "
            "are constitutional isomers. Note what this shows: a substrate "
            "gives few products because of symmetry, not because of "
            "selectivity. 2,2-dimethylpropane is clean under conditions that "
            "give propane a mixture."
        ),
        pitfall=(
            "Two misreadings sit underneath most wrong answers here. The first "
            "is treating 'tertiary radicals are the most stable' as though it "
            "promised a single clean product. It does not. Radical chlorination "
            "is intrinsically unselective and is a poor way to make a specific "
            "alkyl halide, which is exactly why the later lessons in this unit "
            "reach for organometallic methods instead. The belief to correct is "
            "that a preference in rate is the same thing as control over "
            "outcome. The second is expecting an optically active product when "
            "halogenation creates a stereocentre. Chlorinating butane at C2 "
            "produces 2-chlorobutane with a genuine stereocentre, and the "
            "sample is nonetheless optically inactive, because the planar "
            "radical intermediate is attacked from both faces at the same rate "
            "and the two enantiomers form in equal amounts. An achiral starting "
            "material and achiral reagents cannot produce an excess of one "
            "enantiomer."
        ),
        claims=(
            Environments(
                PROPANE, (6, 2),
                "propane has two hydrogen environments, so two monochlorides",
            ),
            Environments(
                METHYLPROPANE, (9, 1),
                "2-methylpropane has two environments, nine primary and one "
                "tertiary",
            ),
            Environments(
                DIMETHYLPROPANE, (12,),
                "2,2-dimethylpropane has one environment, so one monochloride",
            ),
            Environments(
                BUTANE, (6, 4),
                "butane has two environments, so two monochlorides",
            ),
            Environments(METHANE, (4,), "methane, one environment"),
            Environments(ETHANE, (6,), "ethane, one environment"),
            Formula(CHLORO_1_PROPANE, "C3H7Cl", "1-chloropropane"),
            Formula(CHLORO_2_PROPANE, "C3H7Cl", "2-chloropropane"),
            Relationship(
                CHLORO_1_PROPANE, CHLORO_2_PROPANE, "constitutional",
                "the two monochlorination products of propane",
            ),
            Relationship(
                CHLORO_1_METHYLPROPANE, CHLORO_2_METHYLPROPANE, "constitutional",
                "the two monochlorination products of 2-methylpropane",
            ),
            Relationship(
                CHLORO_1_BUTANE, CHLORO_2_BUTANE_R, "constitutional",
                "the two monochlorination products of butane",
            ),
            Stereo(
                CHLORO_2_BUTANE_R, ("R",),
                "one enantiomer of 2-chlorobutane",
            ),
            Stereo(
                CHLORO_2_BUTANE_S, ("S",),
                "the other enantiomer, formed at the same rate",
            ),
            Relationship(
                CHLORO_2_BUTANE_R, CHLORO_2_BUTANE_S, "enantiomers",
                "the planar radical is attacked equally from both faces, so "
                "the product is racemic and optically inactive",
            ),
            Formula(CHLORO_2_BUTANE_R, "C4H9Cl", "2-chlorobutane"),
            Source(
                "Carbon-hydrogen bond dissociation enthalpies run about 439 "
                "kJ/mol for methane, about 423 kJ/mol for a primary C-H, about "
                "413 kJ/mol for a secondary C-H and about 404 kJ/mol for a "
                "tertiary C-H, which is the same ordering as radical stability.",
                "Y.-R. Luo, Comprehensive Handbook of Chemical Bond Energies, "
                "CRC Press, 2007, tables of C-H bond dissociation enthalpies; "
                "the same ordering is tabulated in McMurry, Organic Chemistry, "
                "chapter on alkyl halides.",
            ),
            Source(
                "Chlorination of propane near room temperature gives roughly "
                "comparable amounts of the two monochlorides, corresponding to "
                "a per-hydrogen reactivity of about 1 to 3.6 for primary "
                "against secondary, whereas radical bromination of "
                "2-methylpropane gives the tertiary bromide as the "
                "overwhelming major product.",
                "Relative reactivity tables in McMurry, Organic Chemistry, "
                "chapter on alkyl halides, and Carey and Sundberg, Advanced "
                "Organic Chemistry Part A, chapter on free radical reactions.",
            ),
            Source(
                "The Hammond postulate states that the transition state of an "
                "elementary step resembles the species nearer to it in energy, "
                "so a strongly exothermic abstraction has an early, "
                "reactant-like transition state and discriminates poorly.",
                "G. S. Hammond, Journal of the American Chemical Society, 1955, "
                "volume 77, page 334.",
            ),
        ),
    ),
    "ORG1.ALLYLIC": Lesson(
        node="ORG1.ALLYLIC",
        objective=(
            "Predict where bromination occurs when an alkene is treated with "
            "N-bromosuccinimide, enumerate the products from the resonance "
            "forms of the allylic radical, and state their stereochemical "
            "relationship."
        ),
        build_on=(
            "You know that abstraction happens preferentially where the "
            "resulting radical is most stable, and that a more substituted "
            "radical is more stable because the C-H bond that made it was "
            "weaker. Resonance is the next and larger source of radical "
            "stabilisation, and it outranks substitution."
        ),
        core_idea=(
            "An allylic position is an sp3 carbon directly attached to a carbon "
            "of a C=C double bond. Removing a hydrogen there gives a radical "
            "whose unpaired electron is delocalised across three carbons, and "
            "that delocalisation lowers the allylic C-H bond dissociation "
            "enthalpy well below an ordinary secondary C-H. A benzylic "
            "position, the sp3 carbon attached to a benzene ring, is stabilised "
            "the same way and to a similar extent. The practical reagent is "
            "N-bromosuccinimide, usually written NBS, whose role is to keep the "
            "concentration of molecular bromine low and steady. That matters "
            "because bromine at ordinary concentration adds across the double "
            "bond by a different, ionic pathway; at low concentration the "
            "radical substitution at the allylic position wins. The structural "
            "consequence to hold onto is that a delocalised radical has two "
            "ends. Bromine can be delivered to either terminus of the "
            "three-carbon system, so an unsymmetrical allylic radical gives two "
            "constitutional isomers, while a symmetric one gives a single "
            "product. Propene shows which hydrogens are even eligible: its six "
            "hydrogens sit in three environments in a 3:2:1 ratio, and only the "
            "three methyl hydrogens are allylic. The other three are vinylic, "
            "attached directly to the double bond carbons, and they are not "
            "abstracted, because a vinyl radical has no resonance stabilisation "
            "available to it."
        ),
        worked_example=(
            "Brominate but-1-ene, CH2=CH-CH2-CH3, under NBS conditions. First "
            "locate the allylic position. But-1-ene is C4H8 and its eight "
            "hydrogens fall into four environments, in a 3:2:2:1 ratio; C1 and "
            "C2 are the alkene carbons, so the allylic set is the pair on C3. "
            "Abstract a hydrogen there and the radical "
            "sits on C3, adjacent to the C1=C2 double bond. Now write both "
            "resonance forms. In the first the radical is on C3 with the double "
            "bond between C1 and C2. Push one electron of the pi bond over and "
            "the radical moves to C1 with the double bond now between C2 and "
            "C3. One delocalised radical, two positions where bromine can be "
            "delivered. Delivery at C3 gives 3-bromobut-1-ene; delivery at C1 "
            "gives 1-bromobut-2-ene. Both are C4H7Br and they are "
            "constitutional isomers, not stereoisomers, because the bromine is "
            "attached to a different carbon in each. There is one more thing to "
            "notice about the first of them. In 3-bromobut-1-ene the carbon "
            "bearing bromine carries Br, H, a methyl group and a vinyl group: "
            "four different attachments, so it is a stereocentre. The allylic "
            "radical was planar, bromine arrived at either face at the same "
            "rate, and the product is therefore racemic, an equal mixture of "
            "the R and the S enantiomer that shows no optical rotation."
        ),
        try_it_prompt=(
            "Cyclohexene is treated with NBS. How many constitutional isomers "
            "can the monobromination give, and is the product optically "
            "active? Work out how many of cyclohexene's ten hydrogens are "
            "allylic, then draw both resonance forms of the radical before "
            "answering."
        ),
        try_it_answer=(
            "One constitutional isomer, and the product is not optically "
            "active. Cyclohexene's ten hydrogens fall into three environments "
            "in a 4:4:2 ratio: two vinylic hydrogens on C1 and C2, four "
            "allylic hydrogens on C3 and C6, and four ordinary hydrogens on C4 "
            "and C5. Abstraction at C3 gives a radical delocalised over C1, C2 "
            "and C3, and the two resonance forms are related by the ring's own "
            "symmetry, so delivering bromine to either terminus gives the same "
            "compound: 3-bromocyclohexene, C6H9Br. That carbon is a "
            "stereocentre, but the planar radical is brominated from both faces "
            "equally, so the R and S forms are produced in equal amounts. The "
            "sample is racemic and its rotations cancel."
        ),
        pitfall=(
            "The error that costs the most marks is treating the delocalised "
            "radical as though the bromine must return to the carbon the "
            "hydrogen left. It need not. The radical is one species spread over "
            "three carbons, not two species interconverting, and both termini "
            "are live sites. A learner who writes only 3-bromobut-1-ene has "
            "usually drawn a curved arrow for the resonance and then forgotten "
            "to act on it. The second error is expecting a single enantiomer "
            "whenever a stereocentre appears. It appears here twice, in "
            "3-bromobut-1-ene and in 3-bromocyclohexene, and both times the "
            "product is racemic for the same structural reason: the "
            "intermediate is planar and nothing in an achiral reaction mixture "
            "distinguishes its two faces."
        ),
        claims=(
            Environments(
                PROPENE, (3, 2, 1),
                "propene, three environments; only the three methyl hydrogens "
                "are allylic",
            ),
            Environments(
                CYCLOHEXENE, (4, 4, 2),
                "cyclohexene, three environments; the four allylic hydrogens "
                "sit on C3 and C6",
            ),
            Environments(
                TOLUENE, (3, 2, 2, 1),
                "toluene, four environments; the three benzylic hydrogens are "
                "the methyl set",
            ),
            Formula(BUTENE_1, "C4H8", "but-1-ene"),
            Environments(
                BUTENE_1, (3, 2, 2, 1),
                "but-1-ene, four environments; the allylic pair sits on C3",
            ),
            Formula(ALLYL_BROMIDE, "C3H5Br", "3-bromoprop-1-ene"),
            Formula(BENZYL_BROMIDE, "C7H7Br", "the benzylic bromide of toluene"),
            Formula(BROMO_3_BUTENE_R, "C4H7Br", "3-bromobut-1-ene"),
            Formula(BROMO_1_BUTENE_2, "C4H7Br", "1-bromobut-2-ene"),
            Relationship(
                BROMO_3_BUTENE_R, BROMO_1_BUTENE_2, "constitutional",
                "bromine delivered to the two termini of one delocalised "
                "allylic radical",
            ),
            Stereo(BROMO_3_BUTENE_R, ("R",), "one enantiomer of 3-bromobut-1-ene"),
            Stereo(BROMO_3_BUTENE_S, ("S",), "the other, formed at the same rate"),
            Relationship(
                BROMO_3_BUTENE_R, BROMO_3_BUTENE_S, "enantiomers",
                "the planar allylic radical is brominated from both faces "
                "equally, so this product is racemic",
            ),
            Stereo(BROMOCYCLOHEXENE_R, ("R",), "3-bromocyclohexene, one enantiomer"),
            Stereo(BROMOCYCLOHEXENE_S, ("S",), "3-bromocyclohexene, the other"),
            Relationship(
                BROMOCYCLOHEXENE_R, BROMOCYCLOHEXENE_S, "enantiomers",
                "one constitutional product, but a racemic one",
            ),
            Formula(BROMOCYCLOHEXENE_R, "C6H9Br", "3-bromocyclohexene"),
            Source(
                "The allylic C-H bond of propene and the benzylic C-H bond of "
                "toluene have bond dissociation enthalpies near 369 and 375 "
                "kJ/mol respectively, well below the roughly 423 kJ/mol of an "
                "ordinary primary C-H bond.",
                "Y.-R. Luo, Comprehensive Handbook of Chemical Bond Energies, "
                "CRC Press, 2007, tables of C-H bond dissociation enthalpies.",
            ),
            Source(
                "N-bromosuccinimide sustains a low, steady concentration of "
                "molecular bromine, which is the condition under which radical "
                "allylic substitution outruns ionic addition across the double "
                "bond.",
                "Clayden, Greeves and Warren, Organic Chemistry, 2nd edition, "
                "chapter on radical reactions.",
            ),
        ),
    ),
    "ORG1.GRIGNARD": Lesson(
        node="ORG1.GRIGNARD",
        objective=(
            "Explain how inserting magnesium or lithium into a carbon halogen "
            "bond reverses the polarity at carbon, predict the alcohol formed "
            "when the reagent adds to an aldehyde or a ketone, and identify the "
            "functional groups that destroy the reagent on contact."
        ),
        build_on=(
            "Every carbon halogen bond you have met so far leaves carbon "
            "partially positive and therefore electrophilic. This lesson does "
            "the one thing that turns that around, and the reversal is what "
            "makes carbon carbon bond formation possible."
        ),
        core_idea=(
            "Treat an alkyl halide with magnesium metal in a dry ether solvent "
            "and the metal inserts into the carbon halogen bond, giving R-Mg-X, "
            "a Grignard reagent. Magnesium is far less electronegative than "
            "carbon, so this bond is polarised the opposite way from the one it "
            "replaced: the carbon now carries partial negative charge and "
            "behaves as a carbanion equivalent, a nucleophile. Treating the "
            "same halide with lithium metal gives an organolithium, R-Li, which "
            "is the same idea taken further, with a more ionic bond and greater "
            "reactivity. The chemistry that follows is the payoff. A carbon "
            "nucleophile attacks the electrophilic carbon of a carbonyl group; "
            "the pi electrons move onto oxygen giving an alkoxide; an aqueous "
            "workup protonates that alkoxide to an alcohol. Methanal gives a "
            "primary alcohol, any other aldehyde gives a secondary alcohol, and "
            "a ketone gives a tertiary alcohol. There is a price for all this "
            "reactivity, and it is the single most important operational fact "
            "about these reagents. A carbanion is the conjugate base of an "
            "alkane, and an alkane is an extraordinarily weak acid, so the "
            "carbanion is an extraordinarily strong base. Anything with a "
            "proton more acidic than an alkane will protonate it: water, "
            "alcohols, carboxylic acids, amines, thiols, terminal alkynes. That "
            "is why the solvent must be aprotic and dry, and why a substrate "
            "carrying a free hydroxyl group has to have it protected before the "
            "reagent ever meets it."
        ),
        worked_example=(
            "Start from bromoethane, C2H5Br, and add magnesium in dry ether to "
            "make ethylmagnesium bromide. The carbon that was electrophilic is "
            "now nucleophilic. Introduce ethanal, CH3CHO, whose carbonyl carbon "
            "is electrophilic. The ethyl carbon attacks that carbonyl carbon; "
            "the C=O pi electrons shift onto oxygen, giving a magnesium "
            "alkoxide; adding aqueous acid at the end protonates the alkoxide. "
            "Count the product: two carbons came from the reagent and two from "
            "the aldehyde, so the alcohol is butan-2-ol, C4H10O, a secondary "
            "alcohol. Now look at the new carbon. It carries OH, H, a methyl "
            "group and an ethyl group, four different attachments, so it is a "
            "stereocentre. The carbonyl carbon it came from was planar and sp2, "
            "and the nucleophile approached its two faces at equal rates, so "
            "both configurations form in equal amounts. The product is racemic: "
            "(R)-butan-2-ol and (S)-butan-2-ol as an equal pair of enantiomers, "
            "showing no net optical rotation. Swap the aldehyde for propanone, "
            "CH3COCH3, and the same reagent gives 2-methylbutan-2-ol, C5H12O, a "
            "tertiary alcohol, and this time the new carbon carries two "
            "identical methyl groups, so there is no stereocentre and no "
            "stereochemical question to ask."
        ),
        try_it_prompt=(
            "You prepare ethylmagnesium bromide and then add it to a flask that "
            "contains ethanol as well as the ketone you meant to react with. "
            "What happens, and what carbon-containing product comes from the "
            "reagent? Reason it out before reading the answer."
        ),
        try_it_answer=(
            "The reagent is destroyed by an acid-base reaction before it can "
            "add to anything. Ethanol's O-H proton is far more acidic than any "
            "C-H, so the carbanion takes it, giving ethane gas and magnesium "
            "ethoxide bromide. The carbon fragment leaves the story as ethane, "
            "C2H6, the alkane corresponding to the reagent, and the ketone is "
            "untouched by that equivalent. The same reaction run deliberately "
            "with heavy water in place of the protic contaminant is a standard "
            "way to place a single deuterium at a chosen carbon, which is a "
            "useful reminder that the reagent is a base first."
        ),
        pitfall=(
            "The misconception to name is 'Grignard reagents react with "
            "carbonyls', held as a rule that can be applied by looking only at "
            "the carbonyl. The reagent does not evaluate the molecule you drew; "
            "it finds the most acidic proton in the flask. A substrate that "
            "contains both a ketone and a hydroxyl group consumes one full "
            "equivalent as an acid-base reaction before any addition happens, "
            "and a learner who ignores that will predict the right product from "
            "the wrong stoichiometry, or predict a product where the experiment "
            "gives none. The same logic explains a restriction on making the "
            "reagent at all: you cannot form a Grignard from a halide that "
            "itself carries an acidic proton, because each molecule of reagent "
            "would be quenched by the next molecule of starting material. The "
            "belief underneath the error is that basicity and nucleophilicity "
            "are separate properties you can invoke one at a time. In these "
            "reagents they are the same electron pair."
        ),
        claims=(
            Formula(BROMOETHANE, "C2H5Br", "bromoethane, the halide precursor"),
            Formula(ETHANAL, "C2H4O", "ethanal"),
            Formula(PROPANONE, "C3H6O", "propanone"),
            Formula(BUTAN_2_OL_R, "C4H10O", "butan-2-ol, the secondary alcohol"),
            Stereo(BUTAN_2_OL_R, ("R",), "(R)-butan-2-ol"),
            Stereo(BUTAN_2_OL_S, ("S",), "(S)-butan-2-ol"),
            Relationship(
                BUTAN_2_OL_R, BUTAN_2_OL_S, "enantiomers",
                "addition to a planar carbonyl from both faces gives a racemate",
            ),
            Formula(
                METHYLBUTAN_2_OL, "C5H12O",
                "2-methylbutan-2-ol, the tertiary alcohol from the ketone",
            ),
            Environments(
                METHYLBUTAN_2_OL, (6, 3, 2, 1),
                "the two methyl groups on the carbinol carbon are equivalent, "
                "so that carbon is not a stereocentre",
            ),
            Environments(ETHANE, (6,), "ethane, the quench product"),
            Source(
                "An alkane has an approximate pKa near 50, water near 15.7 and "
                "a simple alcohol near 16 to 18, so a carbanion equivalent is "
                "protonated by any protic species present.",
                "pKa compilations in Clayden, Greeves and Warren, Organic "
                "Chemistry, appendix of pKa values, and the Bordwell "
                "equilibrium acidity tables for dimethyl sulfoxide.",
            ),
            Source(
                "Victor Grignard received the 1912 Nobel Prize in Chemistry for "
                "the discovery of the organomagnesium halide reagent that bears "
                "his name.",
                "Nobel Prize in Chemistry 1912, records of the Royal Swedish "
                "Academy of Sciences.",
            ),
        ),
    ),
    "ORG1.COUPLING": Lesson(
        node="ORG1.COUPLING",
        objective=(
            "State what a coupling reaction buys you that radical halogenation "
            "cannot, describe what a Gilman reagent delivers and to what, and "
            "outline the three-step catalytic cycle common to the palladium "
            "cross couplings."
        ),
        build_on=(
            "You have a carbon nucleophile from the previous lesson and a "
            "carbon electrophile from the first two. Putting them together "
            "directly does not work well, because an organolithium is basic "
            "enough to eliminate HX from the halide instead of substituting. "
            "Coupling reagents are the tamed version of the same pairing."
        ),
        core_idea=(
            "A coupling reaction joins two carbon fragments that you choose, at "
            "a bond that you choose. That sentence is the whole point of the "
            "lesson, and it is best read as the opposite of radical "
            "halogenation, where the products are whatever the substrate's "
            "symmetry and the radical stabilities hand you. Two families are "
            "worth meeting now. A Gilman reagent, a lithium dialkylcuprate "
            "written R2CuLi, is made from two equivalents of an organolithium "
            "and a copper(I) salt. Copper tempers the carbanion: the cuprate is "
            "a far weaker base than R-Li, so when it meets an alkyl halide it "
            "substitutes rather than deprotonating or eliminating, delivering "
            "one of its two R groups and forming R-R'. It works well with "
            "primary halides and poorly with tertiary ones, where elimination "
            "takes over regardless. The second family is palladium catalysed "
            "cross coupling, which handles bonds that cuprates handle badly, "
            "above all bonds to sp2 carbon. All of these share one catalytic "
            "cycle. Oxidative addition: a Pd(0) complex inserts into the carbon "
            "halogen bond of an organohalide, becoming Pd(II) carrying both "
            "fragments of it. Transmetalation: the second carbon fragment moves "
            "onto palladium from a partner organometallic, boron in the Suzuki "
            "coupling, zinc in the Negishi, tin in the Stille. Reductive "
            "elimination: the two carbon groups on palladium join, releasing "
            "the product and regenerating Pd(0) to start again."
        ),
        worked_example=(
            "Suppose you want pentane, and specifically you want to make it by "
            "joining a four-carbon fragment to a one-carbon fragment. Take "
            "1-bromobutane, C4H9Br, and treat it with lithium dimethylcuprate. "
            "The cuprate delivers a methyl group to the carbon that held the "
            "bromine, and the product is pentane, C5H12, as a single compound. "
            "Now compare that with what the earlier route in this unit would "
            "have given. Pentane's twelve hydrogens fall into three "
            "environments in a 6:4:2 ratio, so radical chlorination of pentane "
            "would give three different monochlorides rather than one, and no "
            "adjustment of conditions collapses that to one. The coupling also "
            "fixes where the bond forms: pentane and 2-methylbutane are "
            "constitutional isomers of each other, both C5H12, and the cuprate "
            "route cannot drift from one to the other because the bond being "
            "made is the bond you specified when you chose the halide. The same "
            "logic on sp2 carbon is the Suzuki coupling: bromobenzene, C6H5Br, "
            "with a phenylboron partner, a base and a palladium catalyst gives "
            "biphenyl, C12H10, whose ten aromatic hydrogens sit in three "
            "environments in a 4:4:2 ratio because the two rings are equivalent "
            "and each is symmetric about the bond that was formed."
        ),
        try_it_prompt=(
            "Why is a lithium dialkylcuprate useful with an alkyl halide when "
            "the organolithium it was made from is not? Answer in terms of what "
            "the organolithium would do to the halide instead."
        ),
        try_it_answer=(
            "Because the organolithium is too strong a base. Faced with an "
            "alkyl halide it removes a proton from the carbon next to the "
            "leaving group and eliminates, giving an alkene rather than the "
            "coupled product, and it will also strip any acidic proton "
            "elsewhere in the molecule. Coordinating the carbanion to copper "
            "lowers its basicity substantially while leaving it nucleophilic "
            "enough to attack carbon, so substitution outcompetes elimination. "
            "That is why the cuprate is prepared as a separate reagent rather "
            "than used as the organolithium directly."
        ),
        pitfall=(
            "The misconception is that a named coupling is a general permission "
            "to join any two fragments you can draw. Each one has a defined "
            "pair of partners, and the pairing is what the catalytic cycle "
            "requires, not a convention. A Suzuki coupling needs an organoboron "
            "on one side and an organohalide or triflate on the other; feeding "
            "it two aryl halides gives nothing, because there is no partner to "
            "transmetalate from and the cycle stalls after oxidative addition. "
            "The same applies to the cuprate: it is a nucleophile and needs an "
            "electrophilic partner, and it fails on tertiary halides where "
            "elimination dominates. When you plan a coupling, name which "
            "fragment is the electrophile and which is the nucleophile before "
            "you write the arrow. If you cannot assign those two roles, the "
            "reaction you have drawn is not one of these reactions."
        ),
        claims=(
            Formula(BROMO_1_BUTANE, "C4H9Br", "1-bromobutane, the electrophile"),
            Formula(PENTANE, "C5H12", "pentane, the coupled product"),
            Environments(
                PENTANE, (6, 4, 2),
                "three hydrogen environments, so radical chlorination of "
                "pentane would give three monochlorides",
            ),
            Relationship(
                PENTANE, METHYLBUTANE, "constitutional",
                "coupling fixes which skeleton you get; these two C5H12 "
                "isomers are not interconvertible by choosing conditions",
            ),
            Formula(BROMOBENZENE, "C6H5Br", "bromobenzene"),
            Formula(BIPHENYL, "C12H10", "biphenyl"),
            Environments(
                BIPHENYL, (4, 4, 2),
                "the two rings are equivalent and each is symmetric about the "
                "new bond, giving three environments",
            ),
            Environments(
                BROMOBENZENE, (2, 2, 1),
                "bromobenzene's five ring hydrogens fall into three "
                "environments",
            ),
            Source(
                "The Suzuki coupling joins an organoboron compound to an "
                "organohalide or triflate under palladium catalysis in the "
                "presence of a base, through oxidative addition, "
                "transmetalation and reductive elimination.",
                "N. Miyaura and A. Suzuki, Chemical Reviews, 1995, volume 95, "
                "page 2457, review of palladium catalysed cross coupling "
                "reactions of organoboron compounds.",
            ),
            Source(
                "The 2010 Nobel Prize in Chemistry was awarded to Richard F. "
                "Heck, Ei-ichi Negishi and Akira Suzuki for palladium catalysed "
                "cross couplings in organic synthesis.",
                "Nobel Prize in Chemistry 2010, records of the Royal Swedish "
                "Academy of Sciences.",
            ),
        ),
    ),
}
