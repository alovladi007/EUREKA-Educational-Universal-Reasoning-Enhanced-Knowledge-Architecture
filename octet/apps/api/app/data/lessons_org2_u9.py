"""ORG2 Unit 9: Amines and Heterocycles.

Nitrogen is the organising atom of this unit, and one property of it runs
through every lesson: the availability of its lone pair. That single idea
sets amine basicity, decides whether an aromatic heterocycle is a base at
all, and explains why an amide nitrogen behaves nothing like an amine one.
Where a lesson states a structural fact it carries a claim re-derived from
the structure by RDKit, and every formula, degree of unsaturation and proton
environment below was produced by chem_core before it was written into prose.

The uncheckable numbers of this unit are the basic strengths. A pKa of a
conjugate acid is a solution measurement that depends on solvent and
temperature, so it is not derived here; it is stated as an ordering with the
reasoning in prose, and the representative aqueous values are carried as a
Source with a citation and the medium named. Charged species, the ammonium
and anilinium and quaternary ammonium ions, carry a Formula but no
Unsaturation claim, because the degree of unsaturation arithmetic is valid
only for a neutral molecule and the verifier refuses a charged one.

Scope, because amine chemistry sits next to the synthesis of controlled
substances. These lessons teach with the standard textbook amines only,
methylamine, ethylamine, aniline, pyridine and their close relatives, and
they describe every transformation at the level of what bond changes and
which class of reagent is responsible. They give no preparative procedure,
no quantity, no set of conditions and no diazonium-salt handling detail. A
learner leaves able to reason about structure, basicity and mechanism, which
is the pedagogical point, and without a recipe, which is the deliberate limit.
"""

from __future__ import annotations

from app.data.claims import Environments, Formula, Relationship, Source, Unsaturation
from app.data.lesson_types import Lesson

# ---------------------------------------------------------------------------
# Structures, named once so a claim and its prose cannot drift apart. Every
# SMILES here was passed through chem_core.structure.formula_of and
# chem_core.organic.proton_environments during authoring.
# ---------------------------------------------------------------------------

METHYLAMINE = "CN"
ETHYLAMINE = "CCN"
DIMETHYLAMINE = "CNC"
TRIMETHYLAMINE = "CN(C)C"
ANILINE = "Nc1ccccc1"
ACETAMIDE = "CC(N)=O"
AMMONIA = "N"
METHYLAMMONIUM = "C[NH3+]"
ANILINIUM = "[NH3+]c1ccccc1"

ACETONITRILE = "CC#N"
PROPANAL = "CCC=O"
N_METHYLPROPAN_1_AMINE = "CCCNC"
PROPANAMIDE = "CCC(N)=O"
PROPAN_1_AMINE = "CCCN"

BUTAN_2_AMINE = "CC(N)CC"
SEC_BUTYL_TRIMETHYLAMMONIUM = "CC(CC)[N+](C)(C)C"
BUT_1_ENE = "C=CCC"
BUT_2_ENE = "CC=CC"

PYRIDINE = "c1ccncc1"
PYRROLE = "c1cc[nH]c1"
FURAN = "c1ccoc1"
IMIDAZOLE = "c1c[nH]cn1"
PIPERIDINE = "C1CCNCC1"
BENZENE = "c1ccccc1"

ETHYLENEDIAMINE = "NCCN"

# ---------------------------------------------------------------------------
# Citations. Every number this unit states that the repository cannot derive
# points at one of these.
# ---------------------------------------------------------------------------

CLAYDEN_AMINES = (
    "Clayden, Greeves and Warren, Organic Chemistry, 2nd edition, Oxford "
    "University Press 2012, chapter on the chemistry of amines."
)
CLAYDEN_ELIMINATION = (
    "Clayden, Greeves and Warren, Organic Chemistry, 2nd edition, Oxford "
    "University Press 2012, chapter on elimination reactions."
)
CLAYDEN_HETEROCYCLES = (
    "Clayden, Greeves and Warren, Organic Chemistry, 2nd edition, Oxford "
    "University Press 2012, chapters on aromatic heterocycles."
)
CRC_BASES = (
    "CRC Handbook of Chemistry and Physics, table of dissociation constants "
    "(pKa of the conjugate acid) of organic bases in aqueous solution at 25 "
    "degrees Celsius."
)
SILVERSTEIN = (
    "Silverstein, Webster, Kiemle and Bryce, Spectrometric Identification of "
    "Organic Compounds, 8th edition, Wiley 2014, infrared correlation charts."
)
MCLAFFERTY = (
    "McLafferty and Turecek, Interpretation of Mass Spectra, 4th edition, "
    "University Science Books 1993."
)

LESSONS_ORG2_U9 = {
    "ORG2.AMINEPROPS": Lesson(
        node="ORG2.AMINEPROPS",
        objective=(
            "Classify an amine as primary, secondary or tertiary, and rank "
            "amines and related nitrogen compounds by base strength from how "
            "available the nitrogen lone pair is to a proton."
        ),
        build_on=(
            "You met carboxylic acids as the common proton donors. An amine is "
            "the common proton acceptor, and how readily it accepts a proton is "
            "set by one thing: whether its nitrogen lone pair is free or tied "
            "up in a neighbouring pi system."
        ),
        core_idea=(
            "First classify by counting the carbons bonded directly to "
            "nitrogen: one is primary, two secondary, three tertiary. This is "
            "not the alcohol convention, which counts carbons on the carbon "
            "bearing the OH, and carrying that habit across is the usual slip. "
            "Then rank base strength. A base accepts a proton using a lone "
            "pair, so the stronger base is the one whose lone pair is most "
            "available. On a neutral saturated nitrogen the pair sits in an sp3 "
            "orbital with no other job, and the alkyl groups feed a little "
            "electron density toward nitrogen, so aliphatic amines are good "
            "bases, stronger than ammonia. Two structural features pull the "
            "lone pair away and weaken the base. In aniline the lone pair "
            "overlaps the benzene ring and is delocalised into it, so it is "
            "less available and aniline is a far weaker base than an aliphatic "
            "amine. In an amide the lone pair is delocalised into the carbonyl, "
            "a stronger draw still, so an amide nitrogen is not basic and any "
            "protonation happens on oxygen rather than nitrogen. The order runs "
            "aliphatic amine, then ammonia, then aniline, then amide, tracking "
            "lone-pair availability at every step. The measure is the pKa of "
            "the conjugate acid, written pKaH: a stronger base holds the proton "
            "more tightly, so its conjugate acid is the weaker acid and has the "
            "higher pKaH."
        ),
        worked_example=(
            "Compare three compounds that each carry an -NH2 group on a "
            "different neighbour. Methylamine is CH5N, a primary amine; its "
            "lone pair sits in an sp3 orbital next to a weakly donating methyl "
            "group, so the pair is fully available and methylamine is a good "
            "base, its conjugate acid methylammonium (CH6N+) being a weak acid. "
            "Aniline is C6H7N with four degrees of unsaturation from the ring; "
            "its resonance structures spread the nitrogen lone pair onto the "
            "ortho and para carbons, so the pair is tied up in conjugation and "
            "much less available, and aniline is a weak base, its conjugate "
            "acid anilinium (C6H8N+) being a far stronger acid than "
            "methylammonium. Acetamide is C2H5NO with one degree of "
            "unsaturation from the carbonyl; here the lone pair overlaps the "
            "carbon-to-oxygen double bond, the strongest of the three draws, "
            "and the amide is not a base at nitrogen at all. Read in order of "
            "how tightly the lone pair is held, methylamine is the strongest "
            "base, aniline weaker, acetamide weakest."
        ),
        try_it_prompt=(
            "Ethylamine and aniline both carry a single -NH2 group and both are "
            "primary amines. Which is the stronger base, and what structural "
            "feature decides it?"
        ),
        try_it_answer=(
            "Ethylamine. Its nitrogen lone pair sits in an sp3 orbital with "
            "only a donating ethyl group nearby, so it is fully available to "
            "accept a proton. In aniline the lone pair is delocalised into the "
            "benzene ring and is less available, which makes aniline the weaker "
            "base by several pKa units. Ethylamine is C2H7N and aniline is "
            "C6H7N; what decides the ranking is not the number of hydrogens on "
            "nitrogen, which is two in each, but what the nitrogen is attached "
            "to and whether its lone pair can conjugate."
        ),
        pitfall=(
            "Two traps live here. The first is carrying the alcohol "
            "classification rule across: an amine is classified by the carbons "
            "on nitrogen, not by the carbon skeleton around it. The second is "
            "assuming base strength always rises with alkyl substitution. In "
            "the gas phase it does, but in water the ammonium ion of a tertiary "
            "amine is less well solvated, so the aqueous order among the "
            "alkylamines is scrambled and a tertiary amine can fall below the "
            "primary and secondary ones. What holds firmly in every phase is "
            "the large gap that lone-pair delocalisation opens: aniline and any "
            "amide sit far below the alkylamines because their lone pairs are "
            "spoken for."
        ),
        claims=(
            Formula(METHYLAMINE, "CH5N", "methylamine, the simplest primary amine"),
            Unsaturation(METHYLAMINE, 0, "saturated and acyclic"),
            Formula(ETHYLAMINE, "C2H7N", "ethylamine, primary"),
            Unsaturation(ETHYLAMINE, 0),
            Formula(ANILINE, "C6H7N", "aniline, an aromatic primary amine"),
            Unsaturation(ANILINE, 4, "the benzene ring"),
            Formula(ACETAMIDE, "C2H5NO", "acetamide, lone pair conjugated into the carbonyl"),
            Unsaturation(ACETAMIDE, 1, "the carbonyl pi bond"),
            Formula(AMMONIA, "H3N", "ammonia, the reference base"),
            Formula(METHYLAMMONIUM, "CH6N+", "the conjugate acid of methylamine; charged, no unsaturation claim"),
            Formula(ANILINIUM, "C6H8N+", "the conjugate acid of aniline; charged, no unsaturation claim"),
            Source(
                "Base strength in water, measured as the pKa of the conjugate "
                "acid (pKaH) at 25 degrees Celsius, falls in the order "
                "aliphatic amine, then ammonia, then aniline, then amide. "
                "Representative aqueous pKaH values are methylammonium about "
                "10.6, ethylammonium about 10.6, dimethylammonium about 10.7, "
                "trimethylammonium about 9.8, ammonium about 9.25 and anilinium "
                "about 4.6, while a protonated amide is a much stronger acid "
                "with a pKaH near zero. These are solution values that depend "
                "on solvent and temperature, quoted here to support the "
                "ordering and not derived.",
                CRC_BASES,
            ),
        ),
    ),
    "ORG2.AMINESYNTH": Lesson(
        node="ORG2.AMINESYNTH",
        objective=(
            "Predict the amine produced by reducing a nitrile or an amide and "
            "by reductive amination, tracking the molecular formula from "
            "starting material to product, and say what the Gabriel and Hofmann "
            "routes add."
        ),
        build_on=(
            "You can classify an amine and reason about its lone pair. The "
            "question now is where the carbon-to-nitrogen bond comes from, and "
            "the cleanest routes reduce a nitrogen already bonded to the right "
            "carbon before you start."
        ),
        core_idea=(
            "Three routes recur, and formula bookkeeping keeps them straight. "
            "Reducing a nitrile adds four hydrogens across the carbon-to-"
            "nitrogen triple bond and turns R-C(triple bond)N into R-CH2-NH2, a "
            "primary amine with the same carbon count as the nitrile. Reducing "
            "an amide R-CO-NH2 replaces the carbonyl oxygen with two hydrogens "
            "and gives R-CH2-NH2, again with the carbon count unchanged. "
            "Reductive amination begins elsewhere: an aldehyde or ketone "
            "condenses with ammonia or an amine to form an imine, losing water, "
            "and the imine is then reduced to an amine, so the new carbon-to-"
            "nitrogen bond forms at what was the carbonyl carbon and the degree "
            "of substitution is set by the amine you chose. Two further routes "
            "give clean primary amines: the Gabriel synthesis introduces "
            "nitrogen already blocked as a phthalimide, so it can be attached "
            "only once and is unmasked at the end and cannot over-substitute, "
            "and the Hofmann rearrangement degrades a primary amide to a "
            "primary amine with one fewer carbon, the carbonyl carbon leaving "
            "as carbon dioxide. Every route here is named by the bond that "
            "changes and the class of reagent, without any procedure or amount."
        ),
        worked_example=(
            "Take the reduction of a nitrile as the cleanest structural case. "
            "Acetonitrile is CH3-C(triple bond)N, formula C2H3N, with two "
            "degrees of unsaturation carried by the triple bond. Reduction with "
            "a hydride reducing agent, a reagent class named without conditions "
            "or amounts, adds four hydrogens: two complete the former nitrile "
            "carbon into a CH2 and two arrive on nitrogen as an NH2, giving "
            "ethylamine CH3CH2NH2, formula C2H7N, with no degrees of "
            "unsaturation left. The carbon skeleton is untouched, so the "
            "product keeps the two carbons the nitrile brought. Reducing an "
            "amide follows the same accounting: propanamide, CH3CH2CO-NH2, is "
            "C3H7NO with one degree of unsaturation for the carbonyl, and "
            "reduction removes the carbonyl oxygen to deliver propan-1-amine, "
            "CH3CH2CH2NH2, C3H9N with no unsaturation and the same three "
            "carbons. In both routes the nitrogen was already on the right "
            "carbon, and reduction only changes what else that carbon and that "
            "nitrogen carry."
        ),
        try_it_prompt=(
            "Propanal (CCC=O, C3H6O) is treated with methylamine and the "
            "intermediate is reduced. What amine forms, and what is its "
            "molecular formula?"
        ),
        try_it_answer=(
            "N-methylpropan-1-amine, CH3CH2CH2-NH-CH3, formula C4H11N. The "
            "aldehyde and the amine condense to an imine at the carbonyl "
            "carbon, losing water, and reduction of that imine gives the amine. "
            "The new carbon-to-nitrogen bond sits at the former carbonyl "
            "carbon, and the product carries the three carbons of the propanal "
            "plus the one carbon of the methylamine, so four in all. Choosing "
            "methylamine rather than ammonia is what makes the product a "
            "secondary amine rather than a primary one."
        ),
        pitfall=(
            "The trap is treating reductive amination as if it alkylated the "
            "amine directly, or as though the reducing agent attacked the "
            "starting carbonyl. It does neither. Direct alkylation of an amine "
            "with a halide does not stop after one addition, because the "
            "product amine is itself a nucleophile and reacts again, giving a "
            "mixture of secondary, tertiary and quaternary products. Reductive "
            "amination avoids this by first condensing the carbonyl and the "
            "amine to an imine, losing water, and reducing only the imine's "
            "carbon-to-nitrogen double bond, so the degree of substitution is "
            "fixed by the pair of reactants rather than left to a runaway "
            "series of alkylations."
        ),
        claims=(
            Formula(ACETONITRILE, "C2H3N", "acetonitrile, a nitrile"),
            Unsaturation(ACETONITRILE, 2, "the carbon-to-nitrogen triple bond"),
            Formula(ETHYLAMINE, "C2H7N", "ethylamine, the nitrile reduction product"),
            Unsaturation(ETHYLAMINE, 0, "a saturated primary amine"),
            Formula(PROPANAMIDE, "C3H7NO", "propanamide, an amide"),
            Unsaturation(PROPANAMIDE, 1, "the amide carbonyl"),
            Formula(PROPAN_1_AMINE, "C3H9N", "propan-1-amine, the amide reduction product"),
            Unsaturation(PROPAN_1_AMINE, 0),
            Formula(PROPANAL, "C3H6O", "propanal, the reductive amination substrate"),
            Unsaturation(PROPANAL, 1, "the aldehyde carbonyl"),
            Formula(N_METHYLPROPAN_1_AMINE, "C4H11N", "N-methylpropan-1-amine, the reductive amination product"),
            Unsaturation(N_METHYLPROPAN_1_AMINE, 0),
            Source(
                "Nitriles and amides are reduced to primary amines, aldehydes "
                "and ketones undergo reductive amination to amines through an "
                "imine, the Gabriel synthesis delivers a primary amine free of "
                "over-alkylation because the nitrogen is introduced as a "
                "phthalimide and can be alkylated only once, and the Hofmann "
                "rearrangement converts a primary amide to a primary amine with "
                "loss of the carbonyl carbon as carbon dioxide. Which reagents "
                "and conditions achieve each transformation is a matter of "
                "experiment and is not derivable in this repository.",
                CLAYDEN_AMINES,
            ),
        ),
    ),
    "ORG2.AMINEREACTIONS": Lesson(
        node="ORG2.AMINEREACTIONS",
        objective=(
            "Predict the major alkene of a Hofmann elimination and explain why "
            "it is the less substituted one, and describe at a conceptual level "
            "what an aryl diazonium group offers as a replaceable handle on a "
            "ring."
        ),
        build_on=(
            "In ORG1 you saw E2 elimination favour the more substituted alkene, "
            "the Zaitsev product. Amine chemistry supplies the standard "
            "exception to that preference, and the reason sits in the size of "
            "the leaving group and the base rather than in the stability of the "
            "alkene."
        ),
        core_idea=(
            "An amine is a poor leaving group, so before it can be eliminated "
            "it is turned into a good one by exhaustive methylation to a "
            "quaternary ammonium ion carrying a positively charged N(CH3)3 "
            "group. A base then removes a beta hydrogen and trimethylamine "
            "leaves, forming an alkene. Which alkene dominates is the point of "
            "the reaction. The bulky ammonium leaving group and the base "
            "together make the least hindered beta hydrogen the easiest to "
            "reach, so the double bond forms toward the least substituted "
            "carbon and the major product is the less substituted alkene. This "
            "is Hofmann orientation, the opposite of the Zaitsev preference. "
            "Separately, a primary aromatic amine such as aniline can be "
            "converted to an aryl diazonium group, in which the nitrogen is "
            "retained as an excellent leaving group on the ring; that group is "
            "then replaced by others, so the ring position that carried "
            "nitrogen can end up carrying a hydroxyl, a halogen or a hydrogen. "
            "It is a way to use an amine as a temporary handle for placing a "
            "substituent. Diazonium salts are reactive intermediates worked "
            "with under controlled conditions; this lesson stays with what they "
            "are for and gives no preparation or handling detail."
        ),
        worked_example=(
            "Follow a Hofmann elimination on butan-2-amine, C4H11N. Exhaustive "
            "methylation converts it to the butan-2-yl trimethylammonium ion, "
            "C7H18N+, placing a good leaving group on the second carbon. "
            "Elimination can build the double bond toward C1 or toward C3. "
            "Toward C1 gives but-1-ene, C4H8, a monosubstituted alkene with the "
            "double bond at the end of the chain, carrying one alkyl group. "
            "Toward C3 gives but-2-ene, C4H8, a disubstituted alkene carrying "
            "two alkyl groups. Zaitsev orientation would predict but-2-ene, the "
            "more substituted alkene; Hofmann elimination gives but-1-ene as "
            "the major product, because the bulky trimethylammonium group "
            "steers the base toward the more accessible hydrogens on the "
            "terminal carbon. But-1-ene and but-2-ene share the formula C4H8 "
            "and differ in connectivity, so they are constitutional isomers, "
            "and their proton spectra separate them at once: but-1-ene has four "
            "hydrogen environments in the ratio 3:2:2:1 and but-2-ene has two "
            "in the ratio 6:2."
        ),
        try_it_prompt=(
            "A quaternary ammonium ion from butan-2-amine can eliminate toward "
            "C1 or toward C3. Which alkene is the major Hofmann product, and "
            "how does its substitution pattern compare with the Zaitsev "
            "product?"
        ),
        try_it_answer=(
            "The major product is but-1-ene, the less substituted alkene, "
            "formed by removing a hydrogen from the terminal carbon C1. Its "
            "double bond is monosubstituted, carrying one alkyl group. The "
            "Zaitsev product would be but-2-ene, a disubstituted alkene formed "
            "by removing a hydrogen from C3. Hofmann orientation favours the "
            "less substituted alkene because the bulky trimethylammonium "
            "leaving group and the base react fastest at the least hindered "
            "beta hydrogens. But-1-ene and but-2-ene have the same formula, "
            "C4H8, and are constitutional isomers of each other."
        ),
        pitfall=(
            "The misconception carried in from earlier elimination chemistry is "
            "that the more substituted alkene always wins. That is Zaitsev "
            "orientation, and it holds for many E2 reactions of alkyl halides, "
            "but a Hofmann elimination reverses it. The belief to correct is "
            "that alkene stability alone sets the product; here the size of the "
            "leaving group and the accessibility of the beta hydrogens "
            "dominate, so the less substituted alkene is the major one. Read "
            "the quaternary ammonium leaving group as the signal that Hofmann "
            "orientation, not Zaitsev, applies."
        ),
        claims=(
            Formula(BUTAN_2_AMINE, "C4H11N", "butan-2-amine, the starting amine"),
            Unsaturation(BUTAN_2_AMINE, 0, "saturated and acyclic"),
            Formula(
                SEC_BUTYL_TRIMETHYLAMMONIUM, "C7H18N+",
                "the quaternary ammonium ion; charged, so no unsaturation claim",
            ),
            Formula(BUT_1_ENE, "C4H8", "but-1-ene, the Hofmann product"),
            Unsaturation(BUT_1_ENE, 1, "the alkene pi bond"),
            Environments(BUT_1_ENE, (3, 2, 2, 1), "four environments, the terminal alkene"),
            Formula(BUT_2_ENE, "C4H8", "but-2-ene, the Zaitsev product"),
            Unsaturation(BUT_2_ENE, 1, "the alkene pi bond"),
            Environments(BUT_2_ENE, (6, 2), "two environments, unlike but-1-ene"),
            Relationship(
                BUT_1_ENE, BUT_2_ENE, "constitutional",
                "same formula C4H8, differing only in the position of the "
                "double bond",
            ),
            Formula(ANILINE, "C6H7N", "aniline, a diazonium salt precursor"),
            Source(
                "Hofmann elimination of a quaternary ammonium salt gives "
                "predominantly the less substituted alkene (Hofmann "
                "orientation), in contrast to the Zaitsev preference for the "
                "more substituted alkene seen in many E2 eliminations of alkyl "
                "halides, because the bulk of the leaving group and the base "
                "directs abstraction of the most accessible hydrogen. Which "
                "orientation dominates is not derivable in this repository.",
                CLAYDEN_ELIMINATION,
            ),
        ),
    ),
    "ORG2.HETEROCYCLES": Lesson(
        node="ORG2.HETEROCYCLES",
        objective=(
            "Explain why pyridine is basic while pyrrole and furan are not, "
            "from where each heteroatom lone pair sits relative to the aromatic "
            "pi system, and relate that to their contrasting reactivity toward "
            "electrophiles."
        ),
        build_on=(
            "You judged amine basicity by lone-pair availability, and you know "
            "an aromatic ring needs a closed loop of six pi electrons. In an "
            "aromatic heterocycle those two ideas meet, and where the "
            "heteroatom lone pair lives decides everything."
        ),
        core_idea=(
            "The contrast turns on one question: is the heteroatom lone pair "
            "part of the aromatic pi system or not. Pyridine is a six-membered "
            "ring in which nitrogen contributes one electron to the aromatic "
            "sextet through its p orbital and keeps its lone pair in an sp2 "
            "orbital lying in the plane of the ring, pointing outward. That "
            "in-plane lone pair is available to a proton, so pyridine is a base "
            "of about the strength of a weak amine. Pyrrole is a five-membered "
            "ring in which nitrogen must donate its whole lone pair into the "
            "ring to reach the six pi electrons aromaticity requires, so the "
            "pair is inside the ring and unavailable; pyrrole is not a base at "
            "nitrogen, and protonating the nitrogen would destroy the "
            "aromaticity. Furan is the oxygen analogue: one oxygen lone pair "
            "joins the aromatic sextet while the other stays in the plane. The "
            "same accounting flips reactivity. Pyrrole and furan are "
            "electron-rich, because a heteroatom lone pair is donated into the "
            "ring, so they undergo electrophilic substitution readily at "
            "carbon; pyridine is electron-poor at carbon, because the "
            "electronegative nitrogen withdraws density, so it resists "
            "electrophilic substitution and reacts instead at nitrogen or with "
            "nucleophiles. Imidazole carries one nitrogen of each kind, a "
            "pyridine-type nitrogen that is basic and a pyrrole-type N-H that "
            "is not; piperidine, the saturated version of pyridine's ring, is "
            "not aromatic at all and behaves as an ordinary strong "
            "secondary-amine base."
        ),
        worked_example=(
            "Compare pyridine and pyrrole atom for atom. Pyridine is C5H5N with "
            "four degrees of unsaturation, the same count as benzene, and by "
            "symmetry it has three proton environments in the ratio 2:2:1, the "
            "two positions next to nitrogen, the two beyond them, and the "
            "single position opposite nitrogen. Its nitrogen keeps its lone "
            "pair in the ring plane, so pyridine protonates on nitrogen and is "
            "a base. Pyrrole is C4H5N with three degrees of unsaturation and, "
            "counting the N-H, three proton environments in the ratio 2:2:1, "
            "the two carbons next to nitrogen, the two beyond them, and the "
            "N-H. Its nitrogen has already donated its lone pair to the "
            "aromatic sextet, so pyrrole is not basic at nitrogen; that same "
            "donation makes the ring carbons electron-rich, and pyrrole reacts "
            "with electrophiles far faster than benzene. Set piperidine beside "
            "them: C5H11N with one degree of unsaturation, the ring alone and "
            "no aromatic system, its lone pair fully available and its base "
            "strength that of a normal secondary amine. The saturated ring is "
            "a strong base, pyridine a weak one, and pyrrole hardly a base at "
            "all, and the only thing that changes down that list is what the "
            "lone pair is doing."
        ),
        try_it_prompt=(
            "Furan is C4H4O. Predict its number of proton environments and "
            "their ratio, and say whether you expect furan to be a strong base "
            "at oxygen."
        ),
        try_it_answer=(
            "Furan has two proton environments in the ratio 2:2, the two "
            "carbons next to oxygen and the two beyond them; it has no O-H, so "
            "both environments are ring C-H. Furan is not a strong base. One "
            "oxygen lone pair is part of the aromatic sextet and unavailable, "
            "and although the second lone pair lies in the plane, oxygen holds "
            "its electrons tightly and the ring is aromatic, so furan behaves "
            "as an electron-rich aromatic that reacts with electrophiles at "
            "carbon rather than as a base. Its formula gives three degrees of "
            "unsaturation, consistent with an aromatic five-membered ring."
        ),
        pitfall=(
            "The misconception is that any ring nitrogen with a lone pair is a "
            "base, so pyridine and pyrrole should behave alike. They do not. A "
            "pyridine-type nitrogen keeps its lone pair in the plane and is "
            "basic; a pyrrole-type nitrogen has spent its lone pair on "
            "aromaticity and is not, and its attached hydrogen is instead "
            "weakly acidic. The test is not whether a lone pair exists on paper "
            "but whether the ring needs it to be aromatic. Imidazole makes the "
            "point inside one molecule, with a basic nitrogen and a non-basic "
            "N-H side by side."
        ),
        claims=(
            Formula(PYRIDINE, "C5H5N", "pyridine"),
            Unsaturation(PYRIDINE, 4, "aromatic six-membered ring, as for benzene"),
            Environments(PYRIDINE, (2, 2, 1), "positions next to, beyond, and opposite nitrogen"),
            Formula(PYRROLE, "C4H5N", "pyrrole"),
            Unsaturation(PYRROLE, 3, "aromatic five-membered ring"),
            Environments(PYRROLE, (2, 2, 1), "two alpha carbons, two beta carbons, and the N-H"),
            Formula(FURAN, "C4H4O", "furan"),
            Unsaturation(FURAN, 3, "aromatic five-membered ring"),
            Environments(FURAN, (2, 2), "two carbons next to oxygen, two beyond"),
            Formula(IMIDAZOLE, "C3H4N2", "imidazole, one pyridine-type and one pyrrole-type nitrogen"),
            Unsaturation(IMIDAZOLE, 3, "aromatic five-membered ring"),
            Formula(PIPERIDINE, "C5H11N", "piperidine, the saturated ring, an ordinary secondary amine"),
            Unsaturation(PIPERIDINE, 1, "the ring only, no aromaticity"),
            Formula(BENZENE, "C6H6", "benzene, the all-carbon comparison"),
            Unsaturation(BENZENE, 4),
            Source(
                "Aqueous pKaH values at 25 degrees Celsius place pyridinium "
                "near 5.2, so pyridine is a weak base; the pyrrolium ion has a "
                "pKa near minus 3.8, so pyrrole is effectively non-basic and "
                "protonates on carbon rather than nitrogen; piperidinium is "
                "near 11.1, a strong base. Imidazolium is near 7.0. These "
                "solution values are quoted for comparison, not derived.",
                CRC_BASES,
            ),
            Source(
                "Pyrrole and furan undergo electrophilic aromatic substitution "
                "much faster than benzene and preferentially at the 2-position, "
                "while pyridine is strongly deactivated toward electrophilic "
                "substitution and reacts preferentially at nitrogen or with "
                "nucleophiles. These relative rates and regioselectivities are "
                "empirical.",
                CLAYDEN_HETEROCYCLES,
            ),
        ),
    ),
    "ORG2.AMINESPECTRA": Lesson(
        node="ORG2.AMINESPECTRA",
        objective=(
            "Use the number and position of N-H stretching bands to tell "
            "primary, secondary and tertiary amines apart, and apply the "
            "nitrogen rule to read the parity of a molecular mass as a count of "
            "nitrogen atoms."
        ),
        build_on=(
            "You have used infrared stretches to spot functional groups in ORG1 "
            "and a molecular ion mass to pin a formula. Amines add two specific "
            "readings: an N-H pattern that counts hydrogens on nitrogen, and a "
            "mass parity rule that counts the nitrogen atoms themselves."
        ),
        core_idea=(
            "An N-H bond stretches in roughly the same high region as O-H, "
            "above 3000 cm-1, and the count of bands reports the substitution "
            "at nitrogen. A primary amine has two N-H bonds and shows two "
            "stretching bands, a symmetric and an antisymmetric one; a "
            "secondary amine has one N-H bond and shows one band; a tertiary "
            "amine has no N-H bond and shows nothing in that region, so its "
            "silence there is itself the diagnosis. Mass spectrometry adds the "
            "nitrogen rule. Nitrogen is unusual in pairing an even nominal "
            "mass, 14, with an odd valence of three. Because of that mismatch, "
            "a molecule of carbon, hydrogen, oxygen and a single nitrogen has "
            "an odd nominal molecular mass, and in general a molecule with an "
            "odd number of nitrogen atoms has an odd molecular mass while an "
            "even number, zero included, gives an even mass. So an odd "
            "molecular ion in an otherwise ordinary organic spectrum is a "
            "signal that an odd number of nitrogen atoms is present, most often "
            "one."
        ),
        worked_example=(
            "Take three amines of increasing substitution at nitrogen and read "
            "each two ways. Methylamine, CH5N, is a primary amine with two N-H "
            "bonds, so its infrared spectrum shows two N-H stretching bands "
            "above 3000 cm-1; its two hydrogen environments in the ratio 3:2 "
            "are the methyl and the NH2. Dimethylamine, C2H7N, is a secondary "
            "amine with one N-H bond and shows a single N-H band. Trimethyl"
            "amine, C3H9N, is tertiary with no N-H bond and shows no N-H "
            "stretch at all. All three carry one nitrogen and all three have an "
            "odd nominal molecular mass, 31, 45 and 59, adding 12 for each "
            "carbon, 1 for each hydrogen and 14 for the nitrogen, in line with "
            "the nitrogen rule. Notice that dimethylamine and ethylamine share "
            "the formula C2H7N and the odd mass 45 yet are constitutional "
            "isomers, one secondary and one primary, and the count of N-H bands "
            "is what separates them: ethylamine shows two, dimethylamine one. "
            "Now change the nitrogen count. Ethylenediamine, C2H8N2, has two "
            "nitrogen atoms, four N-H bonds, and a nominal mass of 60, an even "
            "number, because a second nitrogen restores the parity that one "
            "nitrogen upset."
        ),
        try_it_prompt=(
            "A colourless liquid gives an infrared spectrum with a single N-H "
            "stretching band and a molecular ion at an odd m/z. What does the "
            "single band tell you about the nitrogen, and what does the odd "
            "molecular ion tell you about how many nitrogen atoms are present?"
        ),
        try_it_answer=(
            "The single N-H band points to a secondary amine, one N-H bond "
            "rather than the two of a primary amine or the none of a tertiary "
            "amine. The odd molecular ion points to an odd number of nitrogen "
            "atoms, and for a small molecule that almost always means one. "
            "Together they suggest a secondary amine with one nitrogen, such as "
            "dimethylamine, C2H7N, whose nominal mass is 45. Note what these "
            "observations do not settle: a single N-H band fits any secondary "
            "amine, and the mass parity does not distinguish one nitrogen from "
            "three."
        ),
        pitfall=(
            "The error is reading the number of N-H bands as the number of "
            "nitrogen atoms, or expecting a tertiary amine to announce itself "
            "with a band. The band count reports N-H bonds, not nitrogen atoms, "
            "so a tertiary amine with its nitrogen firmly present shows nothing "
            "in the N-H region and is diagnosed by that absence together with "
            "its mass. And the nitrogen rule counts nitrogen atoms by mass "
            "parity, not by any band: an even molecular mass does not mean no "
            "nitrogen, it means an even number of them, zero included, so "
            "reading an even mass as nitrogen-free misses every diamine."
        ),
        claims=(
            Formula(METHYLAMINE, "CH5N", "methylamine, a primary amine, one nitrogen, odd mass 31"),
            Unsaturation(METHYLAMINE, 0),
            Environments(METHYLAMINE, (3, 2), "the methyl and the NH2"),
            Formula(DIMETHYLAMINE, "C2H7N", "dimethylamine, a secondary amine"),
            Unsaturation(DIMETHYLAMINE, 0),
            Formula(ETHYLAMINE, "C2H7N", "ethylamine, a primary amine of the same formula"),
            Relationship(
                ETHYLAMINE, DIMETHYLAMINE, "constitutional",
                "same formula C2H7N and mass 45, separated by the N-H band count",
            ),
            Formula(TRIMETHYLAMINE, "C3H9N", "trimethylamine, a tertiary amine"),
            Unsaturation(TRIMETHYLAMINE, 0),
            Formula(ETHYLENEDIAMINE, "C2H8N2", "ethylenediamine, two nitrogen atoms, even mass 60"),
            Unsaturation(ETHYLENEDIAMINE, 0),
            Environments(ETHYLENEDIAMINE, (4, 4), "four CH2 hydrogens and four N-H hydrogens"),
            Source(
                "Approximate N-H stretching regions: primary amines show two "
                "bands, a symmetric and an antisymmetric stretch, and secondary "
                "amines show one band, in the region about 3300 to 3500 cm-1; "
                "tertiary amines show no N-H stretch. These are correlation-"
                "chart ranges, not values this repository can derive.",
                SILVERSTEIN,
            ),
            Source(
                "The nitrogen rule: a neutral molecule with an even number of "
                "nitrogen atoms, zero included, has an even nominal molecular "
                "mass, and one with an odd number has an odd nominal molecular "
                "mass, because nitrogen pairs an even nominal mass with an odd "
                "valence.",
                MCLAFFERTY,
            ),
        ),
    ),
}
