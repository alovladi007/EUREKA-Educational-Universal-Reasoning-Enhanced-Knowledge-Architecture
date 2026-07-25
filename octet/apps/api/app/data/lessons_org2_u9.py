"""ORG2 Unit 9: Amines and Heterocycles.

Every structural fact in these lessons carries a claim that RDKit re-derives
from the structure when the test suite runs. Classification of an amine as
primary, secondary or tertiary is a structural fact, so it is anchored to
formulas and to a constitutional-isomer relationship rather than asserted; the
degree of unsaturation that separates an aromatic heterocycle from its
saturated counterpart is derived; and the basicity numbers, which no structure
graph can settle, are carried with a citation instead.

A note on scope, because amine chemistry sits next to the synthesis of
controlled substances. These lessons teach with the standard textbook amines
only, and they describe every transformation at the level of what bond changes
and which class of reagent is responsible. They give no preparative procedure,
no quantity and no set of conditions. A learner leaves able to reason about
structure, basicity and mechanism, which is the pedagogical point, and without
a recipe, which is the deliberate limit.
"""

from __future__ import annotations

from app.data.claims import Formula, Relationship, Source, Unsaturation
from app.data.lesson_types import Lesson

# Structures named once so a claim and its prose cannot drift apart.
METHYLAMINE = "CN"
ETHYLAMINE = "CCN"
DIMETHYLAMINE = "CNC"
TRIMETHYLAMINE = "CN(C)C"
ANILINE = "Nc1ccccc1"
ETHYLENEDIAMINE = "NCCN"
ACETONITRILE = "CC#N"
BUT_1_ENE = "C=CCC"
BUT_2_ENE = "CC=CC"
PHENOL = "Oc1ccccc1"
PYRROLE = "c1cc[nH]c1"
FURAN = "c1ccoc1"
PYRIDINE = "c1ccncc1"
PIPERIDINE = "C1CCNCC1"

# Citations reused from the sibling ORG1 files, with the chapter descriptor
# pointed at the amine and heterocycle material.
CRC = (
    "CRC Handbook of Chemistry and Physics, tables of dissociation constants "
    "of organic acids and bases, aqueous solution at 25 degrees Celsius."
)
CLAYDEN = (
    "Clayden, J., Greeves, N. and Warren, S., Organic Chemistry, 2nd edition, "
    "Oxford University Press, 2012, chapters on amines and aromatic "
    "heterocycles."
)
SILVERSTEIN = (
    "Silverstein, Webster, Kiemle and Bryce, Spectrometric Identification of "
    "Organic Compounds, 8th edition, Wiley 2014, infrared correlation charts."
)
MCLAFFERTY = (
    "McLafferty and Turecek, Interpretation of Mass Spectra, 4th edition, "
    "University Science Books 1993, on the nitrogen rule."
)

LESSONS_ORG2_U9 = {
    "ORG2.AMINEPROPS": Lesson(
        node="ORG2.AMINEPROPS",
        objective=(
            "Classify an amine as primary, secondary or tertiary from its "
            "structure, and order a set of amines by basicity, saying what "
            "raises it and what lowers it."
        ),
        build_on=(
            "You already know a lone pair is what makes a base, and you have "
            "seen resonance move a lone pair around a ring. An amine is a base "
            "because nitrogen holds a lone pair, and everything in this lesson "
            "is about whether that pair is free to grab a proton or busy doing "
            "something else."
        ),
        core_idea=(
            "Classify an amine by counting the carbons bonded directly to "
            "nitrogen: one is primary, two is secondary, three is tertiary. "
            "This is not the alcohol convention, which counts carbons on the "
            "carbon bearing the OH, and confusing the two is the usual slip. "
            "Basicity is measured through the conjugate acid: the stronger the "
            "base, the higher the pKa of its protonated form, written pKaH. Two "
            "influences dominate. Alkyl groups release electron density toward "
            "nitrogen and stabilise the positive ammonium ion, which tends to "
            "raise basicity. An aromatic ring attached to nitrogen does the "
            "opposite in a stronger way: the lone pair delocalises into the "
            "ring, so it is only partly available to bond a proton, and aniline "
            "is a far weaker base than any alkylamine."
        ),
        worked_example=(
            "Order ethylamine, dimethylamine, trimethylamine and aniline by "
            "basicity. First classify: ethylamine is primary, dimethylamine "
            "secondary, trimethylamine tertiary, aniline primary but aromatic. "
            "Note that ethylamine and dimethylamine share the formula C2H7N; "
            "they are constitutional isomers that differ only in how the "
            "carbons are distributed on nitrogen, which is exactly the "
            "classification distinction. Now basicity by pKaH in water: "
            "dimethylamine 10.7, ethylamine 10.6 and trimethylamine 9.8 are all "
            "close and all far above aniline at 4.6. The alkylamines cluster "
            "high because alkyl donation stabilises their ammonium ions; aniline "
            "sits far below because its lone pair is delocalised into the ring "
            "and pays an energy cost to localise on nitrogen for bonding."
        ),
        try_it_prompt=(
            "Trimethylamine has three carbons on nitrogen and aniline has one. "
            "Which is the stronger base in water, and why is it not simply the "
            "one with more alkyl groups?"
        ),
        try_it_answer=(
            "Trimethylamine is much the stronger base, pKaH about 9.8 against "
            "4.6 for aniline. The deciding factor is not the count of alkyl "
            "groups but whether the lone pair is available. Aniline's lone pair "
            "is delocalised into the aromatic ring, so it is held back from "
            "bonding a proton, and no number of substituents on aniline would "
            "close that gap."
        ),
        pitfall=(
            "Two traps live here. The first is carrying the alcohol "
            "classification rule across: an amine is classified by carbons on "
            "nitrogen, not by the carbon skeleton around it. The second is "
            "assuming basicity rises monotonically with alkyl substitution. In "
            "the gas phase it does, but in water the ammonium ion of a tertiary "
            "amine is less well solvated, so the aqueous order is scrambled and "
            "the tertiary amine often falls below the primary and secondary "
            "ones rather than topping them."
        ),
        claims=(
            Formula(METHYLAMINE, "CH5N", "methylamine, the simplest primary amine"),
            Formula(ETHYLAMINE, "C2H7N", "ethylamine, primary"),
            Formula(DIMETHYLAMINE, "C2H7N", "dimethylamine, secondary"),
            Formula(TRIMETHYLAMINE, "C3H9N", "trimethylamine, tertiary"),
            Formula(ANILINE, "C6H7N", "aniline, an aromatic primary amine"),
            Relationship(
                ETHYLAMINE, DIMETHYLAMINE, "constitutional",
                "same formula, different distribution of carbons on nitrogen, "
                "which is the primary versus secondary distinction itself",
            ),
            Source(
                "Aqueous pKaH values at 25 degrees Celsius: methylamine 10.6, "
                "ethylamine 10.6, dimethylamine 10.7, trimethylamine 9.8, "
                "ammonia 9.25 and aniline 4.6. The alkylamines are strong bases "
                "clustered near 10 to 11; aniline is far weaker because its "
                "nitrogen lone pair is delocalised into the aromatic ring.",
                CRC,
            ),
        ),
    ),
    "ORG2.AMINESYNTH": Lesson(
        node="ORG2.AMINESYNTH",
        objective=(
            "Describe, at the level of which bond changes and which class of "
            "reagent is responsible, how reduction, reductive amination, the "
            "Gabriel route and the Hofmann rearrangement each build an amine."
        ),
        build_on=(
            "You can classify an amine and reason about its lone pair. The "
            "question now is where the carbon to nitrogen bond comes from, and "
            "each route in this lesson answers it a different way."
        ),
        core_idea=(
            "Four conceptual routes to an amine, described by the transformation "
            "rather than by any procedure. Reduction takes a nitrogen already "
            "attached to carbon at a higher oxidation level, a nitrile or an "
            "amide, and adds hydrogen with a hydride reducing agent until the "
            "carbon to nitrogen multiple bond becomes a single bond and the "
            "nitrogen emerges as an amine. Reductive amination joins a carbonyl "
            "compound and an amine: they condense to an imine with loss of "
            "water, and a reducing agent then converts the carbon to nitrogen "
            "double bond of the imine to a single bond, so a new C-N bond has "
            "been built from a C=O. The Gabriel route introduces nitrogen "
            "already blocked, as a phthalimide, so it can be attached only once "
            "and is unmasked at the end to give a clean primary amine. The "
            "Hofmann rearrangement degrades an amide to an amine with one fewer "
            "carbon, the nitrogen migrating to the neighbouring carbon."
        ),
        worked_example=(
            "Follow the reduction of a nitrile as the cleanest structural case. "
            "Acetonitrile is CC#N, formula C2H3N, and its carbon to nitrogen "
            "triple bond gives it two degrees of unsaturation. Reduce it with a "
            "hydride reducing agent, a reagent class named without any "
            "conditions or amounts, and the triple bond takes on hydrogen. The "
            "product is ethylamine, CCN, formula C2H7N, with zero degrees of "
            "unsaturation. The bookkeeping is exact: two degrees of unsaturation "
            "removed and four hydrogens added, C2H3N going to C2H7N, and the "
            "nitrogen that was a nitrile is now a primary amine."
        ),
        try_it_prompt=(
            "Reductive amination and the Gabriel route both make amines, but "
            "only one of them reliably stops at a primary amine without "
            "over-substituting the nitrogen. Which, and what feature stops it?"
        ),
        try_it_answer=(
            "The Gabriel route. Its nitrogen arrives already blocked as a "
            "phthalimide, so it can accept exactly one carbon group and cannot "
            "be alkylated again; unmasking then releases a clean primary amine. "
            "A direct alkylation, by contrast, leaves the new amine free to "
            "react further, so it tends to over-substitute."
        ),
        pitfall=(
            "The trap is reading reductive amination as though the reducing "
            "agent attacked the starting carbonyl. It does not act first: the "
            "carbonyl and the amine condense to an imine, losing water, and only "
            "the imine's carbon to nitrogen double bond is reduced. Miss the "
            "imine and the new carbon to nitrogen bond has no origin."
        ),
        claims=(
            Formula(ACETONITRILE, "C2H3N", "acetonitrile, a nitrile"),
            Unsaturation(ACETONITRILE, 2, "the carbon to nitrogen triple bond"),
            Formula(ETHYLAMINE, "C2H7N", "ethylamine, the reduced product"),
            Unsaturation(ETHYLAMINE, 0, "a saturated primary amine"),
            Source(
                "The Gabriel synthesis delivers a primary amine uncontaminated "
                "by secondary and tertiary products because the nitrogen is "
                "introduced as a phthalimide and can be alkylated only once; a "
                "direct alkylation of ammonia over-substitutes.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.AMINEREACTIONS": Lesson(
        node="ORG2.AMINEREACTIONS",
        objective=(
            "Predict the alkene that a Hofmann elimination favours, and explain "
            "what an aryl diazonium group offers as a replaceable handle on a "
            "ring."
        ),
        build_on=(
            "You have met elimination giving the more substituted alkene under "
            "Zaitsev's rule. Amine chemistry provides the counter-case, where "
            "the less substituted alkene wins, and a second reaction that turns "
            "an amino group into a leaving group."
        ),
        core_idea=(
            "Two reactions define what amines do downstream. In a Hofmann "
            "elimination the nitrogen is first turned into a bulky, positively "
            "charged quaternary ammonium group, which is a good leaving group, "
            "and elimination then removes it together with a neighbouring "
            "hydrogen. Because the leaving group and the base are both bulky, "
            "the least hindered hydrogen is removed and the product is the less "
            "substituted, terminal alkene, the opposite of Zaitsev orientation. "
            "In diazonium chemistry a primary aromatic amine such as aniline is "
            "converted under diazotisation to an aryl diazonium group, an "
            "excellent leaving group on the ring; that group is then replaced "
            "by others, so the ring position that carried nitrogen can end up "
            "carrying a hydroxyl, a halogen or a hydrogen. It is a way to use an "
            "amine as a temporary handle for placing a substituent."
        ),
        worked_example=(
            "Consider the two butenes a Hofmann elimination could give from a "
            "butyl-substituted ammonium salt. But-1-ene is C=CCC and but-2-ene "
            "is CC=CC; both are C4H8 with one degree of unsaturation, so they "
            "are constitutional isomers separated only by where the double bond "
            "sits. Zaitsev would favour but-2-ene, the more substituted alkene. "
            "Hofmann orientation instead favours but-1-ene, the terminal one, "
            "because the bulky charged nitrogen and the base drive removal of "
            "the most accessible hydrogen at the chain end. Same molecular "
            "formula, different regiochemistry, and the amine version breaks the "
            "Zaitsev habit."
        ),
        try_it_prompt=(
            "Aniline is C6H7N. After its amino group is taken through a "
            "diazonium group and replaced by a hydroxyl, what is the product "
            "and its formula?"
        ),
        try_it_answer=(
            "The product is phenol, C6H6O. The carbon that carried nitrogen now "
            "carries oxygen: the diazonium acted as a leaving group and a "
            "hydroxyl took its place, exchanging the C6H7N amine for the C6H6O "
            "phenol."
        ),
        pitfall=(
            "The habit to unlearn is applying Zaitsev everywhere. Hofmann "
            "elimination is the standard exception: its bulky charged leaving "
            "group and base select the less substituted alkene, so predicting "
            "the more substituted one here is predicting the minor product."
        ),
        claims=(
            Formula(BUT_1_ENE, "C4H8", "but-1-ene, the Hofmann product"),
            Unsaturation(BUT_1_ENE, 1, "one carbon to carbon double bond"),
            Formula(BUT_2_ENE, "C4H8", "but-2-ene, the Zaitsev product"),
            Unsaturation(BUT_2_ENE, 1, "one carbon to carbon double bond"),
            Relationship(
                BUT_1_ENE, BUT_2_ENE, "constitutional",
                "same formula and same degree of unsaturation, differing only "
                "in the position of the double bond",
            ),
            Formula(ANILINE, "C6H7N", "aniline, the aryl amine"),
            Formula(PHENOL, "C6H6O", "phenol, after the diazonium is replaced"),
            Source(
                "Hofmann elimination of a quaternary ammonium hydroxide gives "
                "predominantly the least substituted alkene, in contrast to the "
                "Zaitsev preference of most base-promoted eliminations, because "
                "the bulk of the leaving group and base directs abstraction of "
                "the most accessible hydrogen.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.HETEROCYCLES": Lesson(
        node="ORG2.HETEROCYCLES",
        objective=(
            "Explain why pyridine is a base and pyrrole is barely one, and why "
            "pyrrole and furan are attacked readily by electrophiles while "
            "pyridine resists them."
        ),
        build_on=(
            "You know an aromatic ring needs a closed loop of six pi electrons, "
            "and you know a lone pair is what makes an amine basic. In these "
            "rings the two ideas meet, and where the nitrogen lone pair lives "
            "decides everything."
        ),
        core_idea=(
            "The contrast turns on one question: is the nitrogen lone pair part "
            "of the aromatic pi system or not. In pyridine, a six-membered ring, "
            "the nitrogen contributes one electron to the aromatic sextet "
            "through its p orbital and keeps its lone pair in an sp2 orbital "
            "lying in the plane of the ring, pointing outward. That lone pair is "
            "free, so pyridine is a genuine, if modest, base. In pyrrole, a "
            "five-membered ring, the nitrogen must donate its whole lone pair "
            "into the ring to reach the six pi electrons aromaticity requires, "
            "so the pair is spent on the aromatic system and unavailable to a "
            "proton; pyrrole is essentially not basic. The same accounting "
            "flips reactivity toward electrophiles. Pyrrole and furan are "
            "electron rich, pi-excessive rings that welcome electrophilic "
            "substitution, while pyridine is pi-deficient and resists it. "
            "Piperidine, the saturated version of pyridine's ring, is not "
            "aromatic at all and behaves as an ordinary strong secondary-amine "
            "base."
        ),
        worked_example=(
            "Put the three aromatic rings side by side by formula and "
            "unsaturation. Pyrrole is c1cc[nH]c1, C4H5N, three degrees of "
            "unsaturation: one ring plus two double bonds. Furan is c1ccoc1, "
            "C4H4O, also three. Pyridine is c1ccncc1, C5H5N, four degrees of "
            "unsaturation, the extra one being the larger ring's third formal "
            "double bond. Now piperidine, C1CCNCC1, is C5H11N with just one "
            "degree of unsaturation, the ring alone, and no aromatic system. "
            "The saturated ring keeps a fully available lone pair and is a "
            "strong base; pyridine keeps an in-plane lone pair and is a weak "
            "one; pyrrole has committed its lone pair to aromaticity and is "
            "hardly a base at all."
        ),
        try_it_prompt=(
            "Both pyridine and pyrrole are aromatic and both contain one "
            "nitrogen, yet only pyridine is a useful base. What structural "
            "difference accounts for it?"
        ),
        try_it_answer=(
            "Where the lone pair sits. Pyridine's nitrogen reaches the aromatic "
            "sextet using a single p electron and leaves its lone pair in an "
            "in-plane sp2 orbital, free to bond a proton. Pyrrole's nitrogen "
            "must donate its entire lone pair into the ring to be aromatic, so "
            "that pair is unavailable and pyrrole is barely basic."
        ),
        pitfall=(
            "The trap is treating any ring nitrogen as an amine-like base "
            "because it has a lone pair on paper. Pyrrole's lone pair is real "
            "but committed to the aromatic system; drawing it as available and "
            "expecting pyrrole to behave like a normal amine gets both its "
            "weak basicity and its readiness toward electrophiles wrong."
        ),
        claims=(
            Formula(PYRROLE, "C4H5N", "pyrrole"),
            Unsaturation(PYRROLE, 3, "one ring and two double bonds"),
            Formula(FURAN, "C4H4O", "furan"),
            Unsaturation(FURAN, 3, "one ring and two double bonds"),
            Formula(PYRIDINE, "C5H5N", "pyridine"),
            Unsaturation(PYRIDINE, 4, "the six-membered aromatic ring"),
            Formula(PIPERIDINE, "C5H11N", "piperidine, the saturated ring"),
            Unsaturation(PIPERIDINE, 1, "the ring only, no aromaticity"),
            Source(
                "Aqueous pKaH values: pyridinium about 5.2, so pyridine is a "
                "weak base; the pyrrolium ion has a pKa near minus 3.8, so "
                "pyrrole is effectively non-basic and protonates on carbon "
                "rather than nitrogen; piperidinium is about 11.1, a strong "
                "base. Pyrrole and furan undergo electrophilic aromatic "
                "substitution readily while pyridine resists it.",
                CRC,
            ),
        ),
    ),
    "ORG2.AMINESPECTRA": Lesson(
        node="ORG2.AMINESPECTRA",
        objective=(
            "Read the N-H stretching region of an infrared spectrum to count "
            "how substituted an amine's nitrogen is, and use the nitrogen rule "
            "to infer parity of nitrogen count from a molecular mass."
        ),
        build_on=(
            "You have used infrared stretches to spot functional groups and a "
            "molecular ion mass to pin a formula. Amines add two specific "
            "readings: an N-H pattern that counts hydrogens on nitrogen, and a "
            "mass parity rule that counts the nitrogens themselves."
        ),
        core_idea=(
            "Two spectroscopic tells. In the infrared, an N-H stretch appears "
            "around 3300 to 3500 cm-1, and the number of bands counts the "
            "hydrogens on nitrogen: a primary amine, with two N-H bonds, shows "
            "two bands; a secondary amine, with one, shows a single band; a "
            "tertiary amine, with none, shows no N-H stretch at all. So the "
            "N-H region reports the amine class directly. In mass spectrometry "
            "the nitrogen rule reads parity: a molecule made of carbon, "
            "hydrogen, nitrogen and oxygen has an odd nominal molecular mass "
            "when it contains an odd number of nitrogen atoms, and an even mass "
            "when it contains an even number, zero included. An odd molecular "
            "ion is therefore a flag that an odd number of nitrogens is present."
        ),
        worked_example=(
            "Take methylamine, CH5N, one nitrogen. Its nominal mass is 12 plus "
            "five plus fourteen, which is 31, an odd number, exactly as the "
            "nitrogen rule predicts for a single nitrogen. Aniline, C6H7N, also "
            "one nitrogen, has nominal mass 93, again odd. Now ethylenediamine, "
            "NCCN, formula C2H8N2, has two nitrogens; its nominal mass is 24 "
            "plus eight plus twenty-eight, which is 60, an even number, as the "
            "rule predicts for an even nitrogen count. In the infrared, "
            "methylamine and aniline are primary and would each show two N-H "
            "stretches, and a fully methylated tertiary amine would show none."
        ),
        try_it_prompt=(
            "An unknown gives an odd-mass molecular ion and shows a single "
            "sharp band near 3400 cm-1 in the N-H region. What does each "
            "observation tell you about the nitrogen?"
        ),
        try_it_answer=(
            "The odd molecular mass says the molecule contains an odd number of "
            "nitrogen atoms, most simply one. The single N-H band says the "
            "nitrogen carries exactly one hydrogen, which is a secondary amine. "
            "Together they point to one secondary-amine nitrogen."
        ),
        pitfall=(
            "The nitrogen rule is about parity, not count. An even molecular "
            "mass does not mean no nitrogen; it means an even number of them, "
            "and two nitrogens give an even mass just as zero does. Reading an "
            "even mass as nitrogen-free misses every diamine."
        ),
        claims=(
            Formula(METHYLAMINE, "CH5N", "methylamine, one nitrogen, odd mass 31"),
            Formula(ANILINE, "C6H7N", "aniline, one nitrogen, odd mass 93"),
            Formula(ETHYLENEDIAMINE, "C2H8N2", "ethylenediamine, two nitrogens, even mass 60"),
            Source(
                "N-H stretching absorptions fall near 3300 to 3500 cm-1; a "
                "primary amine shows two bands, a secondary amine one, and a "
                "tertiary amine none.",
                SILVERSTEIN,
            ),
            Source(
                "The nitrogen rule: for a neutral molecule of carbon, hydrogen, "
                "nitrogen and oxygen, an odd number of nitrogen atoms gives an "
                "odd nominal molecular mass and an even number gives an even "
                "mass.",
                MCLAFFERTY,
            ),
        ),
    ),
}
