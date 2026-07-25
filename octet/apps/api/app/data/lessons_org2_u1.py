"""ORG2 Unit 1: Conjugation and Dienes (Chapter 14).

Six lessons carry the unit from what conjugation is, through the cations and the
additions it enables, to the Diels-Alder reaction and the spectroscopy that
reports on it. Every structural fact below carries a claim that RDKit re-derives
from the structure when the test suite runs, so a wrong descriptor fails the
build rather than reaching a learner.

Two lines are worth drawing before the lessons rely on them.

Checkable, and therefore claimed:

  molecular formula                          Formula
  degrees of unsaturation (neutral only)     Unsaturation
  CIP descriptors of a stereocentre          Stereo
  isomer or meso relationship                Relationship
  number of distinct 1H environments         Environments

The Diels-Alder stereochemistry in this unit is the sharp case. A cis dienophile
and a trans dienophile give diastereomeric products, and whether the cis adduct
is a meso compound or a chiral one is exactly the sort of fact an author asserts
confidently and gets wrong. Every descriptor and every relationship in the
DIELSALDER lesson was read back from RDKit during authoring, not reasoned out by
hand.

Not derivable by anything here, and therefore carried as a Source with a real
citation or omitted for the ordering:

  heats of hydrogenation and conjugation stabilisation energies
  carbocation stability orderings
  which of two competing additions dominates at a given temperature
  every UV-visible lambda max in nm and every molar absorption coefficient

Those are most of the numbers this unit could state. The response is the same as
in the spectroscopy unit of ORG1: teach the direction, which is real, and source
or omit the magnitude, which a language model cannot stand behind. Extended
conjugation shifts absorption to longer wavelength is a claim a learner can use;
a specific lambda max recalled from memory is not.

One conformation appears throughout and is deliberately never claimed. The s-cis
and s-trans arrangements of a diene are rotations about the central single bond,
not configurations, so they carry no CIP descriptor and no Stereo claim. They
are taught in prose.
"""

from __future__ import annotations

from app.data.claims import Formula, Relationship, Source, Stereo, Unsaturation
from app.data.lesson_types import Lesson

# ---------------------------------------------------------------------------
# Structures, named once so a claim and its prose cannot drift apart.
# ---------------------------------------------------------------------------

BUTADIENE = "C=CC=C"  # buta-1,3-diene, the conjugated reference diene
PENTADIENE_13 = "C=CC=CC"  # penta-1,3-diene, conjugated
PENTADIENE_14 = "C=CCC=C"  # penta-1,4-diene, isolated (skipped)
HEXATRIENE = "C=CC=CC=C"  # hexa-1,3,5-triene, three conjugated double bonds
DIMETHYLBUTADIENE = "C=C(C)C(C)=C"  # 2,3-dimethylbuta-1,3-diene
CYCLOPENTADIENE = "C1C=CC=C1"  # cyclopenta-1,3-diene, locked s-cis

# Allylic and conjugated cations. These are charged, so Unsaturation refuses
# them and only Formula and Source apply.
ALLYL_CATION = "C=C[CH2+]"  # prop-2-en-1-ylium
BUTENYL_CATION = "CC=C[CH2+]"  # but-2-en-1-ylium, from protonating butadiene
PROPENE = "C=CC"  # the allylic C-H parent

# 1,2 versus 1,4 addition of HBr to butadiene.
BROMOBUTENE_12 = "C=CC(Br)C"  # 3-bromobut-1-ene, the 1,2-adduct
BROMOBUTENE_14 = "CC=CCBr"  # 1-bromobut-2-ene, the 1,4-adduct
BROMOBUTENE_14_E = "C/C=C/CBr"  # (E)-1-bromobut-2-ene
BROMOBUTENE_14_Z = "C/C=C\\CBr"  # (Z)-1-bromobut-2-ene

# Diels-Alder.
ETHENE = "C=C"
CYCLOHEXENE = "C1=CCCCC1"
MALEIC_ANHYDRIDE = "O=C1OC(=O)C=C1"  # electron-poor dienophile

# Dimethyl cyclohex-4-ene-1,2-dicarboxylate, the adduct of butadiene with the
# dimethyl esters of maleic (cis) and fumaric (trans) acid. Descriptors read
# back from RDKit: the cis adduct is the (R,S) meso compound, the trans adduct
# is the (R,R) and (S,S) pair of enantiomers.
DIESTER_CIS = "C1=CC[C@@H](C(=O)OC)[C@@H](C(=O)OC)C1"  # meso, from maleate
DIESTER_CIS_ALT = "C1=CC[C@H](C(=O)OC)[C@H](C(=O)OC)C1"  # its mirror image, same compound
DIESTER_TRANS_RR = "C1=CC[C@@H](C(=O)OC)[C@H](C(=O)OC)C1"  # from fumarate
DIESTER_TRANS_SS = "C1=CC[C@H](C(=O)OC)[C@@H](C(=O)OC)C1"  # the enantiomer

# ---------------------------------------------------------------------------
# Citations. Every number this unit states that the repository cannot derive
# points at one of these.
# ---------------------------------------------------------------------------

CLAYDEN_CONJ = (
    "Clayden, Greeves and Warren, Organic Chemistry, 2nd edition, Oxford "
    "University Press 2012, chapter on conjugation and delocalisation."
)
CLAYDEN_DA = (
    "Clayden, Greeves and Warren, Organic Chemistry, 2nd edition, Oxford "
    "University Press 2012, chapter on cyclic and pericyclic reactions, "
    "Diels-Alder section."
)
CLAYDEN_UV = (
    "Clayden, Greeves and Warren, Organic Chemistry, 2nd edition, Oxford "
    "University Press 2012, section on ultraviolet and visible spectroscopy "
    "within the spectroscopy chapters."
)
GOLD_BOOK = (
    "IUPAC Compendium of Chemical Terminology (the Gold Book), entries for the "
    "Beer-Lambert law and for the molar absorption coefficient."
)

LESSONS_ORG2_U1 = {
    "ORG2.CONJUGATION": Lesson(
        node="ORG2.CONJUGATION",
        objective=(
            "Tell a conjugated diene from an isolated one by looking at the "
            "bonds between its double bonds, and explain the extra stability "
            "that conjugation buys."
        ),
        build_on=(
            "You already know a carbon-carbon double bond as a sigma bond with "
            "a pi bond of parallel p orbitals above and below it. Conjugation "
            "is what happens when two of those pi bonds sit close enough for "
            "their p orbitals to overlap into one continuous system."
        ),
        core_idea=(
            "Two double bonds are conjugated when a single bond sits between "
            "them and nothing else, so the pattern is double, single, double. "
            "That single bond is not a gap. The p orbitals on the four carbons "
            "line up and overlap end to end, so the four pi electrons are "
            "delocalised across the whole span rather than trapped two by two. "
            "Delocalisation lowers the energy of the electrons, which is why a "
            "conjugated diene sits lower in energy than an isolated diene of "
            "the same formula. Buta-1,3-diene, CH2=CH-CH=CH2, is the reference "
            "case: its central carbon-carbon bond is shorter than an ordinary "
            "single bond because it has partial double bond character borrowed "
            "from the delocalisation. The whole system is planar so the p "
            "orbitals stay parallel, and it prefers the s-trans conformation, "
            "a rotation about that central bond that keeps the two double bonds "
            "on opposite sides. Contrast penta-1,4-diene, CH2=CH-CH2-CH=CH2, "
            "where an sp3 CH2 breaks the chain of p orbitals so the two double "
            "bonds are isolated and behave as two separate alkenes."
        ),
        worked_example=(
            "Compare penta-1,3-diene and penta-1,4-diene, both C5H8. Draw each "
            "and read the bond between the double bonds. In penta-1,3-diene, "
            "CH2=CH-CH=CH-CH3, the two double bonds are separated by one single "
            "bond, so double, single, double: conjugated. The four p orbitals "
            "of the diene overlap continuously and the pi electrons spread "
            "across them. In penta-1,4-diene, CH2=CH-CH2-CH=CH2, an sp3 carbon "
            "with no p orbital sits between the double bonds and cuts the "
            "overlap, so the two alkenes are isolated. The two molecules are "
            "constitutional isomers, same formula and different connectivity, "
            "and the conjugated one is the more stable. The measure of that "
            "stability is the heat released on hydrogenating both double bonds: "
            "the conjugated isomer releases less heat, and the shortfall is the "
            "delocalisation energy the conjugation was worth."
        ),
        try_it_prompt=(
            "Buta-1,3-diene and penta-1,4-diene are both dienes. Which one has "
            "delocalised pi electrons, and what structural feature decides it?"
        ),
        try_it_answer=(
            "Buta-1,3-diene. Its two double bonds are separated by a single "
            "bond, double-single-double, so the p orbitals on all four carbons "
            "overlap into one system and the electrons delocalise across it. "
            "Penta-1,4-diene has an sp3 CH2 between its double bonds, and that "
            "carbon has no p orbital to continue the overlap, so its two "
            "alkenes are isolated. The deciding feature is what sits between "
            "the double bonds: a single bond conjugates, an sp3 carbon does "
            "not."
        ),
        pitfall=(
            "The trap is counting double bonds and calling any diene "
            "conjugated. Two double bonds in a molecule are conjugated only "
            "when exactly one single bond separates them. Put an sp3 carbon "
            "between them and the p orbitals no longer reach, so there is no "
            "delocalisation and no extra stability, however close the double "
            "bonds look on the page. The other half of the same error is "
            "treating s-cis and s-trans as different compounds. They are "
            "conformations, reached by rotating about the central single bond, "
            "and they interconvert without breaking anything."
        ),
        claims=(
            Formula(BUTADIENE, "C4H6", "buta-1,3-diene"),
            Unsaturation(BUTADIENE, 2, "two carbon-carbon double bonds, no ring"),
            Formula(PENTADIENE_13, "C5H8", "penta-1,3-diene, conjugated"),
            Unsaturation(PENTADIENE_13, 2),
            Formula(PENTADIENE_14, "C5H8", "penta-1,4-diene, isolated"),
            Unsaturation(PENTADIENE_14, 2),
            Relationship(
                PENTADIENE_13, PENTADIENE_14, "constitutional",
                "same formula, conjugated versus isolated arrangement of the "
                "same two double bonds",
            ),
            Source(
                "A conjugated diene releases less heat on hydrogenation than an "
                "isolated diene of the same formula, by of the order of 15 "
                "kJ/mol for buta-1,3-diene, and that shortfall is the "
                "conjugation or delocalisation stabilisation energy. The exact "
                "value is a measured quantity this repository cannot derive.",
                CLAYDEN_CONJ,
            ),
        ),
    ),
    "ORG2.ALLYLIC": Lesson(
        node="ORG2.ALLYLIC",
        objective=(
            "Explain why an allylic cation is more stable than a comparable "
            "alkyl cation, and place allylic stability in the ranking of "
            "carbocations."
        ),
        build_on=(
            "You met delocalisation in a neutral diene, where it lowered the "
            "energy of the pi electrons. The same overlap stabilises a positive "
            "charge, and it does so more dramatically, because a cation is "
            "short of electron density and delocalisation is a way to spread "
            "what little it has."
        ),
        core_idea=(
            "A carbocation next to a double bond is allylic, and it is "
            "stabilised because the empty p orbital on the cationic carbon "
            "overlaps with the pi bond beside it. The positive charge is not "
            "held on one carbon; it is shared across the two ends of the "
            "three-carbon allyl unit, which two resonance structures describe "
            "and which is one delocalised reality. The allyl cation itself is "
            "symmetric: its two terminal carbons are equivalent, each carrying "
            "half the positive charge, so the two resonance structures are "
            "identical in energy. Delocalisation of charge lowers energy, so "
            "the ordering of simple carbocations, methyl below primary below "
            "secondary below tertiary, gains two entries that ride on "
            "resonance rather than on alkyl substitution: an allylic cation is "
            "stabilised comparably to a secondary or better, and a benzylic "
            "cation, delocalised into a ring, sits higher still. Adding alkyl "
            "groups and adding resonance are two different stabilising effects, "
            "and they add together when both are present."
        ),
        worked_example=(
            "Take propene, CH2=CH-CH3, and remove a hydrogen from the methyl "
            "carbon as if a leaving group departed, giving the allyl cation "
            "CH2=CH-CH2+. Write its two resonance structures: the positive "
            "charge on the end carbon with the double bond between the other "
            "two, and the mirror of that with the double bond and the charge "
            "swapped. Because the two ends of this cation are the same, the two "
            "structures are equal contributors, and the true species is the "
            "average with the charge split evenly across both ends. Now compare "
            "energies. An ordinary primary alkyl cation has its charge stuck on "
            "one carbon with only weak help from the alkyl groups attached. The "
            "allyl cation, primary by the count of carbons attached to the "
            "formally charged centre, is far more stable than that primary "
            "label suggests, because resonance spreads the charge over two "
            "carbons. That is why allylic positions react through cationic "
            "intermediates so readily."
        ),
        try_it_prompt=(
            "The but-2-en-1-yl cation, CH3-CH=CH-CH2+, forms when a proton adds "
            "to buta-1,3-diene. Why is it more stable than a plain primary "
            "cation, and what does resonance say about where its positive "
            "charge sits?"
        ),
        try_it_answer=(
            "It is allylic: the empty p orbital sits next to a double bond, so "
            "the pi electrons and the empty orbital overlap and the charge "
            "delocalises. Its two resonance structures put the positive charge "
            "on the CH2 end in one and on the internal carbon in the other, "
            "CH3-CH+-CH=CH2, so the charge is shared over those two carbons "
            "rather than held on one. That sharing lowers the energy well below "
            "a primary cation whose charge has nowhere to go. Note the two ends "
            "here are not equivalent, one bears a methyl and one does not, so "
            "the two resonance structures are not equal contributors."
        ),
        pitfall=(
            "The misconception is that a cation's stability is read off the "
            "count of carbons attached to the charged atom and nothing else, so "
            "an allyl cation, being primary by that count, gets ranked at the "
            "bottom. Resonance is a separate axis. A primary carbon that "
            "happens to be allylic or benzylic carries a charge that is "
            "delocalised over more than one atom, and that delocalisation "
            "outweighs the primary label. Check for a neighbouring pi system "
            "before you rank a cation, not only the number of alkyl groups on "
            "the charged carbon."
        ),
        claims=(
            Formula(PROPENE, "C3H6", "propene, the allylic parent"),
            Unsaturation(PROPENE, 1),
            Formula(ALLYL_CATION, "C3H5+", "the allyl cation, charge shared over two carbons"),
            Formula(BUTENYL_CATION, "C4H7+", "but-2-en-1-yl cation from protonating butadiene"),
            Source(
                "Carbocation stability rises methyl below primary below "
                "secondary below tertiary from alkyl substitution, and "
                "resonance adds a further, larger stabilisation so that "
                "allylic cations are stabilised comparably to secondary and "
                "benzylic cations higher still. These orderings rest on "
                "measured and computed energies this repository cannot derive.",
                CLAYDEN_CONJ,
            ),
        ),
    ),
    "ORG2.CONJUGATEADD": Lesson(
        node="ORG2.CONJUGATEADD",
        objective=(
            "Predict the 1,2 and 1,4 products when one equivalent of HBr adds "
            "to a conjugated diene, and say which one wins under kinetic and "
            "under thermodynamic control."
        ),
        build_on=(
            "You know the allylic cation shares its charge over two carbons. "
            "That shared charge is what makes conjugate addition possible: a "
            "nucleophile can attack either carbon that carries part of the "
            "positive charge, and the two choices give two different products."
        ),
        core_idea=(
            "Add one equivalent of HBr to buta-1,3-diene and the proton goes on "
            "first, to an end carbon, producing an allylic cation whose "
            "positive charge is spread over carbons 2 and 4. Bromide then adds "
            "to whichever of those two carbons it reaches. Addition at carbon 2 "
            "is 1,2-addition and gives 3-bromobut-1-ene, keeping a terminal "
            "double bond. Addition at carbon 4 is 1,4-addition, also called "
            "conjugate addition, and gives 1-bromobut-2-ene, with the double "
            "bond moved to the middle of the chain. The two products are "
            "constitutional isomers of formula C4H7Br. Which one dominates "
            "depends on the condition. At low temperature the 1,2-product forms "
            "faster and is collected, because bromide adds next to where the "
            "charge is highest and the barrier is lower: this is kinetic "
            "control. At higher temperature the addition becomes reversible and "
            "the mixture settles on the more stable 1,4-product, whose internal "
            "double bond is more substituted and lower in energy: this is "
            "thermodynamic control."
        ),
        worked_example=(
            "Follow HBr adding to buta-1,3-diene. The proton adds to C1, giving "
            "the but-2-en-1-yl cation, delocalised with positive charge on C2 "
            "and C4. Bromide has two targets. Land on C2 and you get "
            "CH2=CH-CHBr-CH3, 3-bromobut-1-ene, the 1,2-adduct; its double bond "
            "is at the end and the carbon bearing bromine is a new stereocentre, "
            "so this product is formed as a racemate. Land on C4 and you get "
            "BrCH2-CH=CH-CH3, 1-bromobut-2-ene, the 1,4-adduct, whose double "
            "bond is internal and can be E or Z. Both products are C4H7Br, so "
            "the difference between them is connectivity, not composition. Run "
            "the reaction cold and the 1,2-adduct predominates because it forms "
            "over the lower barrier. Warm it and let it equilibrate and the "
            "1,4-adduct predominates because its more substituted double bond "
            "makes it the more stable compound. The same starting materials, "
            "the same intermediate, and two different answers set by whether "
            "you asked for the fastest product or the most stable one."
        ),
        try_it_prompt=(
            "The 1,4-addition of HBr to buta-1,3-diene gives 1-bromobut-2-ene, "
            "which can be the E or the Z isomer. What is the relationship "
            "between those two, and why is the 1,4-adduct the thermodynamic "
            "product rather than the 1,2-adduct?"
        ),
        try_it_answer=(
            "The E and Z forms of 1-bromobut-2-ene are diastereomers: same "
            "connectivity, differing in the fixed geometry about the double "
            "bond, and not mirror images. The 1,4-adduct is the thermodynamic "
            "product because its double bond is internal and so more highly "
            "substituted than the terminal double bond of the 1,2-adduct, and a "
            "more substituted alkene is lower in energy. Under conditions that "
            "let the addition reverse, the mixture drains toward that more "
            "stable isomer."
        ),
        pitfall=(
            "The error is fusing the two axes and believing the faster product "
            "is always the more stable one, so a single arrow can explain both. "
            "Kinetics and thermodynamics answer different questions. The "
            "1,2-adduct forms faster, and the 1,4-adduct is more stable, and "
            "the reaction gives whichever the conditions select: the faster one "
            "when it is trapped cold, the more stable one when warmth lets the "
            "system equilibrate. A product being major tells you nothing on its "
            "own about which kind of control you were under."
        ),
        claims=(
            Formula(BUTADIENE, "C4H6", "buta-1,3-diene, the substrate"),
            Formula(BUTENYL_CATION, "C4H7+", "the shared allylic intermediate"),
            Formula(BROMOBUTENE_12, "C4H7Br", "3-bromobut-1-ene, the 1,2-adduct"),
            Unsaturation(BROMOBUTENE_12, 1, "one double bond, no ring"),
            Formula(BROMOBUTENE_14, "C4H7Br", "1-bromobut-2-ene, the 1,4-adduct"),
            Unsaturation(BROMOBUTENE_14, 1),
            Relationship(
                BROMOBUTENE_12, BROMOBUTENE_14, "constitutional",
                "same formula, double bond terminal in one and internal in the "
                "other",
            ),
            Relationship(
                BROMOBUTENE_14_E, BROMOBUTENE_14_Z, "diastereomers",
                "E and Z of the 1,4-adduct, differing about the internal double "
                "bond",
            ),
            Source(
                "For addition of one equivalent of a hydrogen halide to "
                "buta-1,3-diene, the 1,2-adduct is the kinetic product favoured "
                "at low temperature and the 1,4-adduct is the thermodynamic "
                "product favoured on warming and equilibration. Which "
                "predominates at a given temperature is an empirical outcome "
                "this repository cannot derive.",
                CLAYDEN_CONJ,
            ),
        ),
    ),
    "ORG2.DIELSALDER": Lesson(
        node="ORG2.DIELSALDER",
        objective=(
            "Predict the ring a Diels-Alder reaction builds, and use the "
            "geometry of the dienophile to predict the stereochemistry of the "
            "product."
        ),
        build_on=(
            "A conjugated diene has four pi electrons delocalised over four "
            "carbons. The Diels-Alder reaction uses those four electrons and "
            "the two of a second double bond together in one step, which is why "
            "it needs a conjugated diene and not two isolated alkenes."
        ),
        core_idea=(
            "The Diels-Alder reaction joins a conjugated diene to a double bond "
            "called the dienophile, forming two new carbon-carbon sigma bonds "
            "at once and closing a six-membered ring. The product is always a "
            "cyclohexene: the ring keeps one double bond, left where the "
            "central single bond of the diene used to be. Butadiene plus ethene "
            "gives cyclohexene itself, C6H10, one ring and one double bond, two "
            "degrees of unsaturation. Because the two new bonds form in the "
            "same step, the reaction is concerted, and concertedness has a "
            "sharp stereochemical consequence: the geometry present in the "
            "dienophile is carried straight into the product. Two groups that "
            "are cis on the dienophile double bond stay cis on the ring, and "
            "two that are trans stay trans. This is stereospecificity, meaning "
            "the stereochemistry of the starting material determines the "
            "stereochemistry of the product with no scrambling, and it is the "
            "reason a Diels-Alder is a reliable way to set two stereocentres at "
            "once."
        ),
        worked_example=(
            "React butadiene with dimethyl fumarate, the trans, that is E, "
            "diester MeO2C-CH=CH-CO2Me. The two ester groups start on opposite "
            "sides of the double bond, and the concerted addition preserves "
            "that, so they end up trans on the new ring in dimethyl "
            "cyclohex-4-ene-1,2-dicarboxylate, C10H14O4. That trans diester has "
            "two stereocentres configured R,R in one molecule and S,S in its "
            "mirror image, and those two are enantiomers. Now run the same "
            "diene with dimethyl maleate, the cis, that is Z, diester, where "
            "the two esters start on the same side. They stay cis on the ring, "
            "and the cis diester turns out to be a meso compound: its two "
            "stereocentres read R and S, and an internal mirror plane makes the "
            "molecule identical to its own mirror image. Same connectivity in "
            "both runs, C10H14O4 either way, but the fumarate gives a chiral "
            "pair and the maleate gives a single achiral meso compound, and the "
            "only thing that changed was the geometry of the dienophile. The "
            "product stereochemistry is a direct readout of it."
        ),
        try_it_prompt=(
            "Dimethyl maleate is the cis dienophile and gives the cis diester "
            "on reaction with butadiene. Is that cis diester chiral, and what "
            "is its relationship to the trans diester that fumarate gives?"
        ),
        try_it_answer=(
            "The cis diester is not chiral. Its two stereocentres are R and S, "
            "and an internal mirror plane relates one half of the molecule to "
            "the other, so it is a meso compound and is identical to its own "
            "mirror image. Its relationship to the trans diester is "
            "diastereomeric: same connectivity, same formula C10H14O4, "
            "differing at one stereocentre and not mirror images. The trans "
            "diester, by contrast, is chiral and exists as an R,R and S,S pair "
            "of enantiomers."
        ),
        pitfall=(
            "The trap is assuming a molecule with two stereocentres must be "
            "chiral, so the cis diester gets drawn as an enantiomeric pair like "
            "the trans one. The cis adduct here has an internal mirror plane, "
            "which makes it meso and achiral despite two stereocentres, so it "
            "is one compound rather than a pair. The check is the same one from "
            "the stereochemistry unit: count stereocentres to bound the number "
            "of isomers, then look for an internal mirror plane before you "
            "commit to whether any of them are chiral."
        ),
        claims=(
            Formula(BUTADIENE, "C4H6", "the diene"),
            Unsaturation(BUTADIENE, 2),
            Formula(ETHENE, "C2H4", "the simplest dienophile"),
            Formula(CYCLOHEXENE, "C6H10", "cyclohexene, the butadiene-plus-ethene adduct"),
            Unsaturation(CYCLOHEXENE, 2, "one ring plus the retained double bond"),
            Formula(DIESTER_CIS, "C10H14O4", "dimethyl cyclohex-4-ene-1,2-dicarboxylate"),
            Unsaturation(DIESTER_CIS, 4, "ring, ring double bond, and two ester carbonyls"),
            Stereo(DIESTER_CIS, ("R", "S"), "the cis adduct from maleate, a meso compound"),
            Stereo(DIESTER_TRANS_RR, ("R", "R"), "the trans adduct from fumarate, one enantiomer"),
            Stereo(DIESTER_TRANS_SS, ("S", "S"), "the trans adduct, the other enantiomer"),
            Relationship(
                DIESTER_TRANS_RR, DIESTER_TRANS_SS, "enantiomers",
                "the trans diester is a chiral R,R and S,S pair",
            ),
            Relationship(
                DIESTER_CIS, DIESTER_TRANS_RR, "diastereomers",
                "cis meso versus trans, same connectivity",
            ),
            Relationship(
                DIESTER_CIS, DIESTER_CIS_ALT, "identical",
                "the cis diester is meso, so its two mirror-image drawings are "
                "one compound",
            ),
            Source(
                "The Diels-Alder reaction is a concerted, suprafacial-"
                "suprafacial cycloaddition, and it is stereospecific: a cis "
                "dienophile gives the cis-substituted adduct and a trans "
                "dienophile the trans-substituted adduct. That the mechanism is "
                "concerted is an experimental and orbital-symmetry conclusion "
                "this repository does not derive from structure.",
                CLAYDEN_DA,
            ),
        ),
    ),
    "ORG2.DAREQUIREMENTS": Lesson(
        node="ORG2.DAREQUIREMENTS",
        objective=(
            "State the three conditions that make a Diels-Alder reaction go "
            "well, the s-cis diene conformation, complementary electron demand, "
            "and endo selectivity, and use them to rank dienes by reactivity."
        ),
        build_on=(
            "You can predict the ring and the stereochemistry a Diels-Alder "
            "produces. This lesson is about when it happens at all, and how "
            "fast, which turns on the shape and the electronics of the two "
            "partners."
        ),
        core_idea=(
            "Three requirements govern a Diels-Alder. First, geometry: the "
            "diene has to reach the s-cis conformation, with both double bonds "
            "on the same side of the central single bond, so its two ends can "
            "meet the two ends of the dienophile at once. A diene held s-trans "
            "cannot react, and a diene locked s-cis reacts fast. Cyclopenta-"
            "1,3-diene, C5H6, is fixed s-cis by its ring and is one of the most "
            "reactive dienes there is. Second, electron demand: the ordinary "
            "reaction pairs an electron-rich diene with an electron-poor "
            "dienophile, so an electron-withdrawing group on the dienophile, "
            "such as an ester, a nitrile, or the two carbonyls of maleic "
            "anhydride, speeds it up. Third, the endo rule: when the dienophile "
            "carries such a group, the transition state that tucks that group "
            "under the diene, the endo approach, is usually the faster one, so "
            "the endo product predominates under kinetic control even though it "
            "is often not the more stable arrangement."
        ),
        worked_example=(
            "Rank three dienes toward the same dienophile and say why. "
            "Cyclopenta-1,3-diene is locked s-cis by its five-membered ring, so "
            "it pays no energy to reach the reactive shape and it reacts fast. "
            "2,3-Dimethylbuta-1,3-diene, C6H10, is open chain so it must rotate "
            "into s-cis, but its two methyl groups are electron-donating and "
            "raise the electron density of the diene, so it still reacts well "
            "with an electron-poor partner. Buta-1,3-diene reacts, but more "
            "slowly than either, having neither the locked geometry nor the "
            "extra donation. Pair any of them with maleic anhydride, C4H2O3, "
            "whose two carbonyls pull electron density out of its double bond "
            "and make it a strong dienophile, and the endo transition state "
            "puts the anhydride ring under the diene, giving the endo adduct as "
            "the kinetic product. The ranking follows the three requirements: "
            "locked s-cis beats having to rotate, and an electron-rich diene "
            "with an electron-poor dienophile beats a poorly matched pair."
        ),
        try_it_prompt=(
            "A diene is held permanently in the s-trans conformation and cannot "
            "rotate into s-cis. Why can it not undergo a Diels-Alder reaction, "
            "however good the dienophile is?"
        ),
        try_it_answer=(
            "Because the reaction needs both ends of the diene to bond to the "
            "two ends of the dienophile in one step, and only the s-cis shape "
            "points both terminal carbons toward the same face of the "
            "dienophile. In s-trans the two ends point in opposite directions, "
            "so they cannot reach a single dienophile at once, and the "
            "concerted six-membered transition state cannot form. The quality "
            "of the dienophile does not matter if the diene cannot present its "
            "two ends together."
        ),
        pitfall=(
            "The common mistake is thinking any conjugated diene is ready to "
            "react and reading reactivity off electronics alone. Geometry comes "
            "first. A diene that cannot reach s-cis does not react at any useful "
            "rate no matter how electron-rich it is, and a diene locked s-cis "
            "gets a large head start. Do not confuse the s-cis requirement with "
            "the E and Z geometry of a substituent, either: s-cis and s-trans "
            "are rotations about the central single bond, freely interconverting "
            "in an open-chain diene, whereas E and Z are fixed configurations "
            "about a double bond."
        ),
        claims=(
            Formula(CYCLOPENTADIENE, "C5H6", "cyclopenta-1,3-diene, locked s-cis"),
            Unsaturation(CYCLOPENTADIENE, 3, "one ring and two double bonds"),
            Formula(DIMETHYLBUTADIENE, "C6H10", "2,3-dimethylbuta-1,3-diene"),
            Unsaturation(DIMETHYLBUTADIENE, 2),
            Formula(BUTADIENE, "C4H6", "buta-1,3-diene, the baseline diene"),
            Formula(MALEIC_ANHYDRIDE, "C4H2O3", "maleic anhydride, an electron-poor dienophile"),
            Unsaturation(
                MALEIC_ANHYDRIDE, 4,
                "the ring, its carbon-carbon double bond, and two carbonyls",
            ),
            Source(
                "A Diels-Alder reaction requires the diene in the s-cis "
                "conformation; the normal electron demand pairs an electron-"
                "rich diene with an electron-poor dienophile bearing an "
                "electron-withdrawing group; and the Alder endo rule states "
                "that the endo adduct is generally the kinetic product. These "
                "are empirical and orbital-based generalisations this "
                "repository cannot derive from structure.",
                CLAYDEN_DA,
            ),
        ),
    ),
    "ORG2.UVVIS": Lesson(
        node="ORG2.UVVIS",
        objective=(
            "Explain why extending a conjugated system moves its absorption to "
            "longer wavelength, and read a lambda max as a report on the length "
            "of that system."
        ),
        build_on=(
            "You know conjugation delocalises pi electrons and lowers their "
            "energy. Ultraviolet and visible spectroscopy measures the gap "
            "those electrons have to jump, so it is the experiment that reports "
            "on conjugation directly."
        ),
        core_idea=(
            "A conjugated system holds its pi electrons in molecular orbitals "
            "that spread across the whole system. Light is absorbed when a "
            "photon promotes an electron from the highest occupied of these to "
            "the lowest unoccupied, and the wavelength absorbed corresponds to "
            "the size of that gap: a larger gap needs a higher-energy, shorter-"
            "wavelength photon, and a smaller gap absorbs at longer wavelength. "
            "Extending the conjugation, adding more double bonds in the "
            "double-single-double pattern, raises the highest occupied orbital "
            "and lowers the lowest unoccupied one, so the gap shrinks and the "
            "wavelength of maximum absorption, the lambda max, moves to longer "
            "values. That direction is the reliable, teachable content. The "
            "specific numbers are measured, not derived: buta-1,3-diene absorbs "
            "in the ultraviolet, hexa-1,3,5-triene at a longer wavelength, and "
            "a system with many conjugated double bonds absorbs far enough into "
            "the visible that the compound is coloured. How much light is "
            "absorbed at a given concentration is a separate matter, set by the "
            "Beer-Lambert law, which makes absorbance proportional to "
            "concentration and path length through a molar absorption "
            "coefficient."
        ),
        worked_example=(
            "Compare buta-1,3-diene, C4H6 with two conjugated double bonds, and "
            "hexa-1,3,5-triene, C6H8 with three. The triene has the longer "
            "conjugated system, so its highest occupied to lowest unoccupied "
            "gap is smaller, and it absorbs at a longer lambda max than the "
            "diene. The reasoning runs purely on the direction of the gap and "
            "needs no memorised number: more double bonds in conjugation, "
            "smaller gap, longer wavelength. Push the same trend far enough, to "
            "a molecule with a long run of conjugated double bonds, and the "
            "absorption reaches wavelengths in the visible region, so what is "
            "absorbed is no longer invisible ultraviolet and the compound looks "
            "coloured to the eye. Note what the wavelength does and does not "
            "tell you. It reports the length of the conjugated system, so it "
            "separates a conjugated diene from an isolated one, but it does not "
            "count total double bonds: penta-1,3-diene and penta-1,4-diene are "
            "both C5H8 with two double bonds, and the conjugated 1,3-isomer "
            "absorbs at the longer wavelength because only its double bonds are "
            "conjugated."
        ),
        try_it_prompt=(
            "Two dienes have the same formula C5H8: penta-1,3-diene, which is "
            "conjugated, and penta-1,4-diene, which is isolated. Which absorbs "
            "at the longer lambda max, and what feature of the electronic "
            "structure decides it?"
        ),
        try_it_answer=(
            "Penta-1,3-diene, the conjugated one, absorbs at the longer "
            "wavelength. Its two double bonds share one continuous pi system, "
            "which raises the highest occupied orbital and lowers the lowest "
            "unoccupied one, so the gap between them is smaller and the photon "
            "that bridges it is lower in energy and longer in wavelength. "
            "Penta-1,4-diene has isolated double bonds with no shared system, "
            "so it behaves like a simple alkene and absorbs at shorter "
            "wavelength. The deciding feature is whether the pi system is "
            "continuous, not how many double bonds there are."
        ),
        pitfall=(
            "The misconception is that lambda max counts double bonds, so any "
            "molecule with more of them absorbs at longer wavelength. Only "
            "conjugated double bonds count, because only a continuous pi system "
            "has the small orbital gap that shifts absorption. An isolated "
            "diene with two double bonds absorbs like one alkene, not like a "
            "conjugated diene. The second half of the caution is precision: the "
            "direction, more conjugation to longer wavelength, is sound and "
            "worth teaching, but a specific lambda max in nm is a measured "
            "value to look up, not a number to derive from the count."
        ),
        claims=(
            Formula(BUTADIENE, "C4H6", "buta-1,3-diene, two conjugated double bonds"),
            Unsaturation(BUTADIENE, 2),
            Formula(HEXATRIENE, "C6H8", "hexa-1,3,5-triene, three conjugated double bonds"),
            Unsaturation(HEXATRIENE, 3),
            Relationship(
                PENTADIENE_13, PENTADIENE_14, "constitutional",
                "same formula, conjugated 1,3-isomer absorbs at longer "
                "wavelength than the isolated 1,4-isomer",
            ),
            Source(
                "Extending a conjugated system shifts the wavelength of maximum "
                "absorption to longer values; buta-1,3-diene absorbs in the "
                "ultraviolet near the low 200s of nm and each additional "
                "conjugated double bond moves the band to longer wavelength, "
                "reaching the visible for long polyenes. The specific lambda "
                "max values are measured quantities this repository cannot "
                "derive.",
                CLAYDEN_UV,
            ),
            Source(
                "The Beer-Lambert law states that absorbance equals the molar "
                "absorption coefficient times the path length times the "
                "concentration, so absorbance is proportional to concentration "
                "at fixed path length. This is a definition and a measured "
                "coefficient, not a structural quantity derived here.",
                GOLD_BOOK,
            ),
        ),
    ),
}
