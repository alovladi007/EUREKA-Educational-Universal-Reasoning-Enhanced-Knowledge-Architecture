"""ORG1 Unit 10: Structure Determination.

This unit is where the line between a checkable fact and an uncheckable one is
sharpest anywhere in the program, so it is worth stating exactly where that line
falls before any lesson below relies on it.

Checkable, and therefore claimed:

  molecular formula                      Formula
  degrees of unsaturation                Unsaturation
  number of distinct 1H environments
  and their integration ratio            Environments
  whether two structures are isomers     Relationship

Every one of those is re-derived from the structure by RDKit when the test suite
runs. The integration ratios in particular are not remembered, they are
symmetry calculations, and every ratio written below was produced by
chem_core.organic.proton_environments before it was written into prose.

Not checkable by anything in this repository, and therefore either omitted or
carried as a Source with a real citation:

  every chemical shift in ppm
  every infrared absorption in cm-1
  every mass spectral fragment mass and every isotope abundance ratio
  every coupling constant in Hz

That is most of the numbers a spectroscopy unit wants to state, which is the
uncomfortable fact this file is organised around. The response is to teach
regions and directions rather than invented precision: an aromatic hydrogen
resonates downfield of an alkyl hydrogen is a claim a learner can use and an
author can source, whereas a specific value recalled by a language model is a
claim nobody can stand behind. Where a number appears below it is approximate,
it is presented as a range, and a Source names the reference work responsible
for it.

One class of fact sits in between and is handled by hand. The number of distinct
13C environments follows from the same molecular symmetry that fixes the proton
environments, but the claim system has no carbon equivalent of Environments, so
those counts are stated in prose only. Every carbon count in ORG1.CARBONNMR and
ORG1.ELUCIDATION was derived with RDKit's canonical atom ranking during
authoring rather than recalled, and the proton environments of the same
molecules are claimed alongside them so that at least the symmetry argument
itself is under test.
"""

from __future__ import annotations

from app.data.claims import Environments, Formula, Relationship, Source, Unsaturation
from app.data.lesson_types import Lesson

# ---------------------------------------------------------------------------
# Structures, named once so a claim and its prose cannot drift apart.
# ---------------------------------------------------------------------------

CHLOROBENZENE = "Clc1ccccc1"
BROMOETHANE = "CCBr"
CHLOROPROPANE_2 = "CC(C)Cl"
CHLOROPROPANE_1 = "CCCCl"

BUTAN_2_ONE = "CCC(C)=O"
PENTAN_2_ONE = "CCCC(C)=O"
BUTANAL = "CCCC=O"
METHYLPROPANAL = "CC(C)C=O"

TOLUENE = "Cc1ccccc1"
ETHYLBENZENE = "CCc1ccccc1"
P_XYLENE = "Cc1ccc(C)cc1"
O_XYLENE = "Cc1ccccc1C"
M_XYLENE = "Cc1cccc(C)c1"

HEXANE = "CCCCCC"
PROPAN_1_OL = "CCCO"
PROPANONE = "CC(C)=O"
PROP_2_EN_1_OL = "C=CCO"

ETHYL_ACETATE = "CCOC(C)=O"
METHYL_PROPANOATE = "CCC(=O)OC"
BUTANOIC_ACID = "CCCC(=O)O"
METHYL_ACETATE = "COC(C)=O"
PROPANOIC_ACID = "CCC(=O)O"

TRICHLOROETHANE_112 = "ClCC(Cl)Cl"
DICHLOROETHANE_12 = "ClCCCl"
BROMOPROPANE_2 = "CC(C)Br"
BROMOBUTANE_1 = "CCCCBr"
BROMO_2_METHYLPROPANE_2 = "CC(C)(C)Br"

CYCLOHEXANONE = "O=C1CCCCC1"
METHYLACETOPHENONE_4 = "CC(=O)c1ccc(C)cc1"
PROPIOPHENONE = "CCC(=O)c1ccccc1"

# ---------------------------------------------------------------------------
# Citations. Every number this unit states that the repository cannot derive
# points at one of these.
# ---------------------------------------------------------------------------

SILVERSTEIN = (
    "Silverstein, Webster, Kiemle and Bryce, Spectrometric Identification of "
    "Organic Compounds, 8th edition, Wiley 2014, correlation charts in the "
    "infrared and proton NMR chapters."
)
PAVIA = (
    "Pavia, Lampman, Kriz and Vyvyan, Introduction to Spectroscopy, 5th "
    "edition, Cengage 2015, infrared and NMR correlation tables."
)
MCLAFFERTY = (
    "McLafferty and Turecek, Interpretation of Mass Spectra, 4th edition, "
    "University Science Books 1993."
)
CRC_ISOTOPES = (
    "CRC Handbook of Chemistry and Physics, table of isotopic composition and "
    "relative atomic masses of the elements."
)
NIST_WEBBOOK = (
    "NIST Chemistry WebBook, Standard Reference Database 69, National "
    "Institute of Standards and Technology, which hosts measured mass and "
    "infrared spectra for these compounds."
)
IUPAC_NMR = (
    "IUPAC Recommendations 2001, NMR nomenclature: nuclear spin properties and "
    "conventions for chemical shifts, Pure and Applied Chemistry volume 73."
)
CLARIDGE = (
    "Claridge, High-Resolution NMR Techniques in Organic Chemistry, 3rd "
    "edition, Elsevier 2016, chapters on the one dimensional carbon experiment "
    "and on DEPT."
)

LESSONS_ORG1_U10 = {
    "ORG1.MSBASICS": Lesson(
        node="ORG1.MSBASICS",
        objective=(
            "Identify the molecular ion in a mass spectrum, and use the size of "
            "the M+2 peak to decide whether a compound contains chlorine, "
            "bromine, or neither."
        ),
        build_on=(
            "You can already turn a molecular formula into a count of rings and "
            "pi bonds. Mass spectrometry is the measurement that hands you the "
            "formula in the first place, by weighing the intact molecule before "
            "anything is done to it."
        ),
        core_idea=(
            "In electron ionisation a molecule is struck by a beam of electrons "
            "and loses one, leaving a radical cation with essentially the mass "
            "of the neutral molecule. That peak is the molecular ion, written "
            "M. The horizontal axis is mass divided by charge, and because "
            "almost every ion produced this way carries a single positive "
            "charge, you can read the axis as mass. The tallest peak in the "
            "spectrum is the base peak and is scaled to 100 percent, but the "
            "base peak is frequently a fragment rather than the molecular ion, "
            "so height is not what identifies M. Position is: the molecular ion "
            "sits at the high mass end of the spectrum, and the peaks above it "
            "come from heavier isotopes rather than from a heavier compound. "
            "Carbon is about one percent carbon-13, so an M+1 peak always "
            "appears and grows with the number of carbons. Chlorine and bromine "
            "are the loud cases, because each has two abundant stable isotopes "
            "two mass units apart, and the resulting M+2 peak is large enough "
            "that its height relative to M identifies the element."
        ),
        worked_example=(
            "Take a spectrum whose highest mass cluster is a peak at m/z 112 "
            "and a peak at m/z 114 about one third as tall. The 2 unit gap and "
            "the roughly 3 to 1 height ratio is the chlorine signature: a "
            "chlorine-containing sample is a mixture of molecules carrying "
            "chlorine-35 and molecules carrying chlorine-37, in approximately "
            "that proportion, so the instrument sees two molecular ions. Take "
            "112 as the molecular mass with chlorine-35. Subtracting 35 leaves "
            "77 for the rest of the molecule, and 77 is C6H5, six carbons at 12 "
            "and five hydrogens at 1. The formula is C6H5Cl, which has four "
            "degrees of unsaturation, so the compound carries a ring plus three "
            "pi bonds or some equivalent arrangement. Chlorobenzene fits. Now "
            "contrast bromoethane, C2H5Br, with no degrees of unsaturation at "
            "all. Its molecular ion cluster is a peak at m/z 108 with "
            "bromine-79 and a peak at m/z 110 with bromine-81, and those two "
            "are of roughly equal height, because bromine's two isotopes are "
            "close to equally abundant. Equal heights two units apart means "
            "bromine; a three to one ratio means chlorine."
        ),
        try_it_prompt=(
            "A spectrum shows a peak at m/z 78, a peak at m/z 80 that is about "
            "one third as tall, and nothing above 80. What halogen does the "
            "compound contain, and what molecular formula is consistent with "
            "78 if the compound has no rings and no pi bonds?"
        ),
        try_it_answer=(
            "Chlorine. The 2 unit gap with a roughly 3 to 1 ratio is the "
            "chlorine pattern, and nothing above 80 means 78 is the molecular "
            "ion. Subtract 35 for chlorine-35 and 43 is left, which is C3H7. "
            "The formula is C3H7Cl, and its degrees of unsaturation come out at "
            "zero, matching the stated absence of rings and pi bonds. Note what "
            "this does not settle: 1-chloropropane and 2-chloropropane are "
            "constitutional isomers with the same formula and the same "
            "molecular ion cluster, and mass alone cannot separate them."
        ),
        pitfall=(
            "The common error is taking the tallest peak to be the molecular "
            "ion. The belief underneath it is reasonable and wrong: that the "
            "intact molecule should be the most abundant species, since it is "
            "what was put into the instrument. Ionisation deposits enough "
            "energy that many molecular ions break apart before they are "
            "detected, and for some compounds the molecular ion is faint or "
            "absent entirely. The second error follows from the same instinct, "
            "which is to read M+2 as an impurity. A pure sample of chlorobenzene "
            "is still a mixture of isotopologues, and the M+2 peak is part of "
            "the compound's own signature rather than evidence against its "
            "purity."
        ),
        claims=(
            Formula(CHLOROBENZENE, "C6H5Cl", "chlorobenzene"),
            Unsaturation(CHLOROBENZENE, 4, "the benzene ring: one ring plus three pi bonds"),
            Formula(BROMOETHANE, "C2H5Br", "bromoethane"),
            Unsaturation(BROMOETHANE, 0, "saturated and acyclic"),
            Formula(CHLOROPROPANE_2, "C3H7Cl", "2-chloropropane"),
            Unsaturation(CHLOROPROPANE_2, 0),
            Relationship(
                CHLOROPROPANE_2, CHLOROPROPANE_1, "constitutional",
                "same formula and the same molecular ion cluster, so the mass "
                "spectrum cannot choose between them",
            ),
            Source(
                "Chlorine has two abundant stable isotopes, mass 35 and mass "
                "37, in a ratio of approximately 3 to 1; bromine has two, mass "
                "79 and mass 81, in a ratio of approximately 1 to 1. Carbon-13 "
                "is about 1.1 percent of natural carbon. These are approximate "
                "values quoted for pattern recognition, not analytical figures.",
                CRC_ISOTOPES,
            ),
            Source(
                "The molecular ion masses quoted here, 112 and 114 for "
                "chlorobenzene and 108 and 110 for bromoethane, are nominal "
                "masses of the isotopologues and match the published reference "
                "spectra.",
                NIST_WEBBOOK,
            ),
        ),
    ),
    "ORG1.MSFRAGMENT": Lesson(
        node="ORG1.MSFRAGMENT",
        objective=(
            "Predict which bonds of a structure break in the mass spectrometer, "
            "and read a fragment peak back as the neutral piece that was lost."
        ),
        build_on=(
            "You can find the molecular ion and get a formula from it. The "
            "peaks below the molecular ion are not noise. They are the molecule "
            "taken apart along its weakest bonds, and they carry the "
            "connectivity that the molecular mass by itself cannot report."
        ),
        core_idea=(
            "A molecular ion leaves the ionisation source with more energy than "
            "it can hold, and it relieves that by breaking a bond. Which bond "
            "breaks is not random: the fragmentation that dominates is the one "
            "that produces a relatively stabilised cation and a neutral radical "
            "or molecule that leaves. Two habits make fragment peaks readable. "
            "The first is to work in differences rather than absolute masses, "
            "because the molecular mass minus a fragment mass is the mass of "
            "the neutral lost, and small losses are highly diagnostic. The "
            "second is to look at the bonds next to a heteroatom or a pi "
            "system, since those are where a charge can be stabilised. A "
            "carbonyl compound cleaves the bond between the carbonyl carbon and "
            "a neighbouring carbon, which is called alpha cleavage, and gives "
            "an acylium ion in which the positive charge is delocalised onto "
            "oxygen. An alkylbenzene cleaves at the benzylic position to give a "
            "seven carbon cation. An alcohol commonly loses water."
        ),
        worked_example=(
            "Take butan-2-one, C4H8O, one degree of unsaturation, molecular ion "
            "at m/z 72. The carbonyl has a carbon on each side, and those two "
            "sides are not equivalent, which the proton spectrum states "
            "directly: butan-2-one has three hydrogen environments in the ratio "
            "3:3:2, so the two methyl groups it contains are chemically "
            "different, one attached to the carbonyl and one at the end of the "
            "ethyl group. Alpha cleavage can therefore go two ways. Break the "
            "bond to the ethyl side and a neutral of mass 29 departs, leaving "
            "m/z 43, which is CH3CO+. Break the bond to the methyl side and a "
            "neutral of mass 15 departs, leaving m/z 57, which is CH3CH2CO+. "
            "Check the arithmetic in both directions: 43 plus 29 is 72, and 57 "
            "plus 15 is 72. Two acylium peaks whose masses differ by 14 and "
            "whose losses are 15 and 29 place the carbonyl between a methyl and "
            "an ethyl, which is the whole structure."
        ),
        try_it_prompt=(
            "Pentan-2-one is C5H10O with a molecular ion at m/z 86. Alpha "
            "cleavage can break either bond next to the carbonyl. Work out the "
            "mass of each acylium ion, and the mass of the neutral lost to "
            "reach it."
        ),
        try_it_answer=(
            "One route loses a methyl radical of mass 15 and gives an acylium "
            "ion at m/z 71, CH3CH2CH2CO+. The other loses a propyl radical of "
            "mass 43 and gives m/z 43, CH3CO+. Both add back to 86. The "
            "coincidence that the neutral lost on one route and the ion "
            "produced on the other are both 43 is why the difference discipline "
            "matters: a mass is meaningful only once you have said whether it "
            "is the piece that stayed charged or the piece that left. "
            "Pentan-2-one has four hydrogen environments in the ratio 3:3:2:2, "
            "consistent with a methyl on one side of the carbonyl and a propyl "
            "chain on the other."
        ),
        pitfall=(
            "The trap is treating a fragment mass as something to recognise "
            "rather than something to reconcile. A learner who sees m/z 43 and "
            "writes down acetyl has guessed a fragment that also happens to be "
            "the mass of a propyl cation and of several other three heavy atom "
            "pieces, and has not checked that the remainder accounts for the "
            "rest of the molecule. The belief behind the error is that fragment "
            "masses form a lookup table. They do not. Every fragment assignment "
            "has to close: the ion plus the neutral lost must equal the "
            "molecular mass, and the atoms in the ion must be atoms the "
            "molecular formula can supply."
        ),
        claims=(
            Formula(BUTAN_2_ONE, "C4H8O", "butan-2-one"),
            Unsaturation(BUTAN_2_ONE, 1, "the carbonyl pi bond"),
            Environments(
                BUTAN_2_ONE, (3, 3, 2),
                "three environments, so the two methyl groups are not "
                "equivalent and the two alpha cleavages are different",
            ),
            Formula(PENTAN_2_ONE, "C5H10O", "pentan-2-one"),
            Unsaturation(PENTAN_2_ONE, 1),
            Environments(PENTAN_2_ONE, (3, 3, 2, 2), "methyl on one side, propyl on the other"),
            Formula(TOLUENE, "C7H8", "toluene"),
            Unsaturation(TOLUENE, 4),
            Formula(ETHYLBENZENE, "C8H10", "ethylbenzene"),
            Unsaturation(ETHYLBENZENE, 4),
            Source(
                "Alpha cleavage next to a carbonyl gives an acylium ion and is "
                "the dominant fragmentation of simple ketones; alkylbenzenes "
                "cleave at the benzylic bond to give a stabilised C7H7 cation "
                "at m/z 91; alcohols commonly lose 18 mass units as water. "
                "Which of the competing cleavages dominates is an empirical "
                "matter this repository cannot derive.",
                MCLAFFERTY,
            ),
            Source(
                "The fragment masses quoted for butan-2-one at m/z 43 and 57, "
                "and for pentan-2-one at m/z 43 and 71, appear in the published "
                "reference spectra of those compounds.",
                NIST_WEBBOOK,
            ),
        ),
    ),
    "ORG1.IRREGIONS": Lesson(
        node="ORG1.IRREGIONS",
        objective=(
            "Name the functional groups a compound can and cannot contain from "
            "the positions of the bands above roughly 1500 cm-1 in its infrared "
            "spectrum."
        ),
        build_on=(
            "Mass spectrometry gave you a molecular formula and, through "
            "degrees of unsaturation, a count of rings and pi bonds. It did not "
            "say what those pi bonds are attached to. Infrared spectroscopy "
            "answers that different question, and it answers it in seconds."
        ),
        core_idea=(
            "Infrared photons make bonds vibrate. A vibration absorbs only if "
            "it changes the molecule's dipole moment, and the frequency at "
            "which it absorbs rises with the stiffness of the bond and falls "
            "with the mass of the atoms being moved. Those two dependencies set "
            "the whole layout of the spectrum without any memorisation: bonds "
            "to hydrogen, which is light, absorb at the highest wavenumbers; "
            "triple bonds, which are stiff, absorb above double bonds; double "
            "bonds absorb above single bonds. The practical division is at "
            "about 1500 cm-1. Above it, bands are sparse and each one can be "
            "attributed to a particular group, so that region is read piece by "
            "piece. Below it lies the fingerprint region, where single bond "
            "stretches and whole molecule bending modes crowd together in a "
            "pattern that is characteristic of the exact compound but is used "
            "for matching against a reference spectrum rather than for reading "
            "out structure."
        ),
        worked_example=(
            "Compare three spectra. Hexane, C6H14, has no degrees of "
            "unsaturation and only carbon and hydrogen, so above 1500 cm-1 it "
            "shows nothing but sp3 carbon to hydrogen stretches, which fall "
            "immediately below 3000 cm-1. That is a spectrum whose interest is "
            "in what is missing. Propan-1-ol, C3H8O, also has zero degrees of "
            "unsaturation, so again there is no carbonyl and no alkene, but the "
            "oxygen to hydrogen stretch appears as a broad rounded band in the "
            "region from about 3200 to 3600 cm-1, and its breadth comes from "
            "hydrogen bonding spreading the population of O-H bond strengths. "
            "Propan-2-one, C3H6O, has one degree of unsaturation and shows the "
            "third pattern: nothing above 3000 cm-1, and a strong sharp band in "
            "the carbonyl region between about 1650 and 1800 cm-1. Notice how "
            "the formula and the spectrum work together. The formula of "
            "propan-2-one said one ring or pi bond; the infrared spectrum said "
            "the pi bond is a carbon to oxygen double bond. Notice too that "
            "propan-2-one's six hydrogens are all equivalent by symmetry, a "
            "single environment, which will matter when you reach integration."
        ),
        try_it_prompt=(
            "Propan-2-one and prop-2-en-1-ol are constitutional isomers, both "
            "C3H6O, and both have one degree of unsaturation. One of them gives "
            "a spectrum with a strong band between 1700 and 1750 cm-1 and "
            "nothing at all above 3100 cm-1. Which compound is it, and what "
            "would the other one show instead?"
        ),
        try_it_answer=(
            "That spectrum is propan-2-one. Prop-2-en-1-ol would show three "
            "things propan-2-one cannot: a broad O-H band in the 3200 to 3600 "
            "region, sp2 carbon to hydrogen stretches slightly above 3000 cm-1 "
            "because it has hydrogens on a doubly bonded carbon, and a carbon "
            "to carbon double bond stretch near 1650 cm-1 rather than a "
            "carbonyl band. The formula alone could not have chosen between "
            "them, since both are C3H6O with one degree of unsaturation. The "
            "infrared spectrum decides which atom the pi bond runs to."
        ),
        pitfall=(
            "The habit worth breaking is treating the absence of a band as weak "
            "evidence. Learners hunt for bands that are present and reason only "
            "from those, because a present band feels like data and an absent "
            "one feels like nothing. In practice the absence of a carbonyl band "
            "eliminates every aldehyde, ketone, ester, acid and amide at once, "
            "which is a larger cut than most present bands make. The one place "
            "this reasoning needs care is symmetry: a carbon to carbon double "
            "bond sitting at the centre of a symmetrical molecule changes no "
            "dipole moment as it stretches, so it can be absent from the "
            "spectrum while being present in the molecule."
        ),
        claims=(
            Formula(HEXANE, "C6H14", "hexane"),
            Unsaturation(HEXANE, 0),
            Formula(PROPAN_1_OL, "C3H8O", "propan-1-ol"),
            Unsaturation(PROPAN_1_OL, 0),
            Formula(PROPANONE, "C3H6O", "propan-2-one"),
            Unsaturation(PROPANONE, 1, "the carbonyl pi bond"),
            Environments(PROPANONE, (6,), "all six hydrogens equivalent by symmetry"),
            Formula(PROP_2_EN_1_OL, "C3H6O", "prop-2-en-1-ol"),
            Unsaturation(PROP_2_EN_1_OL, 1, "the alkene pi bond"),
            Environments(PROP_2_EN_1_OL, (2, 2, 1, 1)),
            Relationship(
                PROPANONE, PROP_2_EN_1_OL, "constitutional",
                "same formula and the same degree of unsaturation, separated by "
                "infrared and not by the formula",
            ),
            Source(
                "Approximate infrared correlation regions: alcohol O-H stretch "
                "broad from about 3200 to 3600 cm-1; N-H stretch about 3300 to "
                "3500 cm-1; sp2 C-H stretch above 3000 cm-1 and sp3 C-H stretch "
                "below it; terminal alkyne C-H near 3300 cm-1; carbon to "
                "nitrogen triple bond about 2210 to 2260 cm-1; carbon to carbon "
                "triple bond about 2100 to 2260 cm-1 and often weak; carbonyl "
                "about 1650 to 1800 cm-1; alkene carbon to carbon double bond "
                "about 1620 to 1680 cm-1; carbon to oxygen single bond about "
                "1000 to 1300 cm-1. These are ranges, not values.",
                SILVERSTEIN,
            ),
            Source(
                "The region below about 1500 cm-1 is conventionally treated as "
                "a fingerprint region, used for matching a whole spectrum "
                "against a reference rather than for assigning individual "
                "groups.",
                PAVIA,
            ),
        ),
    ),
    "ORG1.IRINTERPRET": Lesson(
        node="ORG1.IRINTERPRET",
        objective=(
            "Use an infrared spectrum as a decision procedure to choose between "
            "constitutional isomers that share a formula and a degree of "
            "unsaturation, and state what the spectrum leaves undecided."
        ),
        build_on=(
            "You can name the regions and say which group each belongs to. "
            "Interpretation is the discipline of asking those questions in a "
            "fixed order so that a spectrum eliminates candidates rather than "
            "suggesting one."
        ),
        core_idea=(
            "Work from the formula inward. Compute degrees of unsaturation "
            "first, because that number is a budget the structure has to spend "
            "and every band you assign has to be paid for out of it. Then read "
            "the spectrum from high wavenumber down, asking three questions in "
            "order. Is there anything above about 3100 cm-1, which means an O-H "
            "or an N-H. Is there a strong band in the carbonyl region, which "
            "means a carbon to oxygen double bond and spends one degree of "
            "unsaturation. Is there absorption in the alkene and aromatic ring "
            "region, which spends more. Band shape carries as much information "
            "as band position at the top of the spectrum: an alcohol O-H is "
            "broad and rounded, a carboxylic acid O-H is very broad and runs "
            "down far enough to sit underneath the C-H stretches, and the N-H "
            "of a primary amine gives two comparatively sharp bands rather than "
            "one. Within the carbonyl region the exact position separates the "
            "classes by tens of wavenumbers in a direction that is predictable, "
            "with esters higher than comparable ketones and conjugation pushing "
            "any of them lower."
        ),
        worked_example=(
            "A compound is C4H8O2, which gives one degree of unsaturation. Two "
            "candidates worth taking seriously are ethyl acetate and butanoic "
            "acid. Both are esters or acids of the same formula, both spend "
            "their single degree of unsaturation on a carbonyl, and both show a "
            "strong band in the carbonyl region, so the carbonyl band alone "
            "decides nothing. The decision is made above 3000 cm-1. Butanoic "
            "acid shows a very broad absorption running from roughly 2500 to "
            "3300 cm-1 that swallows the C-H stretches, which is the signature "
            "of a hydrogen bonded carboxylic acid dimer and belongs to no other "
            "common class. Ethyl acetate has no O-H at all and no hydrogens on "
            "sp2 carbon, so it shows nothing above 3000 cm-1. Two further "
            "confirmations follow. The ester carbonyl sits at a higher "
            "wavenumber than the acid carbonyl, roughly 1730 to 1750 against "
            "roughly 1700 to 1725. And the ester shows strong carbon to oxygen "
            "single bond stretches in the 1000 to 1300 region. Where infrared "
            "stops is worth naming: it says ester, and NMR says which ester, "
            "because ethyl acetate gives three hydrogen environments in the "
            "ratio 3:3:2 while butanoic acid gives four in the ratio 3:2:2:1."
        ),
        try_it_prompt=(
            "A compound is C3H6O2. Its infrared spectrum has a very broad "
            "absorption running from about 2500 to 3300 cm-1 that overlaps the "
            "C-H stretches, and a strong band near 1700 to 1725 cm-1. The two "
            "candidates are methyl acetate and propanoic acid. Choose one, then "
            "predict how many hydrogen environments your choice has and in what "
            "ratio."
        ),
        try_it_answer=(
            "Propanoic acid. The very broad absorption reaching down across the "
            "C-H stretch region is the carboxylic acid O-H, and methyl acetate "
            "has no O-H at all, so it would show nothing above 3000 cm-1. "
            "Propanoic acid has three hydrogen environments in the ratio 3:2:1, "
            "which is the methyl, the methylene and the acidic hydrogen. Methyl "
            "acetate would have given two environments in the ratio 3:3, two "
            "methyl groups and nothing else, so the NMR would have separated "
            "them as well."
        ),
        pitfall=(
            "The misconception to name is that a strong band near 1700 cm-1 "
            "identifies a ketone. It identifies a carbon to oxygen double bond, "
            "and aldehydes, ketones, esters, carboxylic acids, amides and acid "
            "chlorides all have one. The belief underneath is that each "
            "functional group owns a band, so finding the band finds the group. "
            "What actually separates the carbonyl classes is the company the "
            "band keeps: the acid's broad O-H, the ester's carbon to oxygen "
            "single bond stretches, the aldehyde's pair of weak C-H stretches "
            "below 3000 cm-1 near 2720 and 2820 cm-1, and the position of the "
            "carbonyl band itself within its region."
        ),
        claims=(
            Formula(ETHYL_ACETATE, "C4H8O2", "ethyl acetate"),
            Unsaturation(ETHYL_ACETATE, 1, "the ester carbonyl"),
            Environments(ETHYL_ACETATE, (3, 3, 2)),
            Formula(BUTANOIC_ACID, "C4H8O2", "butanoic acid"),
            Unsaturation(BUTANOIC_ACID, 1, "the acid carbonyl"),
            Environments(BUTANOIC_ACID, (3, 2, 2, 1)),
            Relationship(
                ETHYL_ACETATE, BUTANOIC_ACID, "constitutional",
                "same formula, same unsaturation, separated above 3000 cm-1",
            ),
            Formula(METHYL_ACETATE, "C3H6O2", "methyl acetate"),
            Unsaturation(METHYL_ACETATE, 1),
            Environments(METHYL_ACETATE, (3, 3), "two methyl groups and nothing else"),
            Formula(PROPANOIC_ACID, "C3H6O2", "propanoic acid"),
            Unsaturation(PROPANOIC_ACID, 1),
            Environments(PROPANOIC_ACID, (3, 2, 1)),
            Relationship(METHYL_ACETATE, PROPANOIC_ACID, "constitutional"),
            Source(
                "Approximate carbonyl stretch regions: saturated ketone about "
                "1705 to 1725 cm-1; aldehyde about 1720 to 1740 cm-1; saturated "
                "ester about 1730 to 1750 cm-1; carboxylic acid dimer about "
                "1700 to 1725 cm-1; conjugation with an adjacent double bond or "
                "aromatic ring lowers the position by roughly 20 to 30 cm-1. "
                "These are ranges reported in correlation charts, not values "
                "this repository can derive.",
                SILVERSTEIN,
            ),
            Source(
                "The carboxylic acid O-H stretch of a hydrogen bonded dimer is "
                "very broad and spans roughly 2500 to 3300 cm-1, overlapping "
                "the C-H stretch region; aldehydes show a characteristic pair "
                "of weak C-H stretch bands near 2720 and 2820 cm-1.",
                PAVIA,
            ),
            Source(
                "Ester carbon to oxygen single bond stretches are strong and "
                "fall in the approximate range 1000 to 1300 cm-1.",
                SILVERSTEIN,
            ),
        ),
    ),
    "ORG1.NMRTHEORY": Lesson(
        node="ORG1.NMRTHEORY",
        objective=(
            "Explain why chemically different hydrogens absorb at different "
            "positions in a proton NMR spectrum, and predict from a structure "
            "which of two environments lies further downfield."
        ),
        build_on=(
            "Infrared reported on functional groups, one band per bond type. "
            "NMR reports on hydrogens one environment at a time, which means it "
            "reports on the carbon skeleton those hydrogens hang from. What "
            "makes that possible is that the electrons around a nucleus change "
            "the magnetic field the nucleus feels."
        ),
        core_idea=(
            "A hydrogen nucleus placed in a magnetic field has two spin states "
            "whose energy separation is proportional to the field the nucleus "
            "actually experiences. Electrons circulating nearby generate a small "
            "field that opposes the applied one, so the nucleus experiences "
            "slightly less than the instrument supplies. That is shielding, and "
            "a well shielded nucleus comes into resonance at the upfield end of "
            "the spectrum. Anything that pulls electron density away from a "
            "hydrogen, whether an electronegative atom a bond or two away or an "
            "adjacent pi system, reduces the shielding and moves the signal "
            "downfield. Because the absolute separation scales with the "
            "instrument's field strength, positions are reported not in hertz "
            "but as a shift relative to a reference compound, divided by the "
            "operating frequency, which yields a number in parts per million "
            "that is the same on every instrument. Tetramethylsilane is the "
            "conventional reference and defines zero on that scale."
        ),
        worked_example=(
            "Take toluene, C7H8, four degrees of unsaturation, four hydrogen "
            "environments in the ratio 3:2:2:1. Those four are the methyl group "
            "and the ortho, meta and para positions of the ring, and you can "
            "predict their arrangement in the spectrum without a single number. "
            "The three methyl hydrogens sit on an sp3 carbon whose only "
            "neighbours are carbon and hydrogen, so nothing is pulling electron "
            "density away from them and they are the most shielded set in the "
            "molecule. They appear at the upfield end. The five ring hydrogens "
            "sit on the outside of an aromatic ring, and the circulating pi "
            "electrons of that ring generate a local field which, at positions "
            "outside the ring, adds to the applied field rather than opposing "
            "it. Those hydrogens are therefore deshielded well beyond what "
            "electronegativity alone would do, and they appear far downfield. "
            "So the predicted spectrum is two clusters: a 3H group at small "
            "shift and a 5H group at large shift, in a 3 to 5 relationship, "
            "with the ring cluster resolving into three environments of "
            "2:2:1 when the instrument can separate them."
        ),
        try_it_prompt=(
            "1-chloropropane, CH3CH2CH2Cl, has three hydrogen environments. "
            "Rank them from furthest downfield to furthest upfield, and say "
            "what drives the ranking."
        ),
        try_it_answer=(
            "The methylene bonded to chlorine is furthest downfield, then the "
            "middle methylene, then the terminal methyl. Chlorine is "
            "electronegative and withdraws electron density through the sigma "
            "bonds, so the hydrogens on the carbon it is attached to are the "
            "least shielded. The effect falls off sharply with each additional "
            "bond, which is why the three environments spread out in order of "
            "distance from the chlorine rather than clustering. The integration "
            "ratio is 3:2:2, the methyl being the only three hydrogen "
            "environment."
        ),
        pitfall=(
            "Two related confusions live here. The first is reversing upfield "
            "and downfield, which happens because the words come from an older "
            "experiment in which the field was swept rather than the frequency. "
            "Anchor them on shielding instead: more shielding means a smaller "
            "shift means upfield, and tetramethylsilane at zero is the most "
            "shielded thing on the chart. The second is reading a large shift "
            "as a statement about reactivity or acidity. A hydrogen far "
            "downfield is not more acidic and not more reactive; it is sitting "
            "in a region of lower electron density or in the field of a "
            "circulating pi system. Aromatic hydrogens are strongly deshielded "
            "and are not acidic at all."
        ),
        claims=(
            Formula(TOLUENE, "C7H8", "toluene"),
            Unsaturation(TOLUENE, 4, "one ring plus three pi bonds"),
            Environments(
                TOLUENE, (3, 2, 2, 1),
                "methyl, then ortho, meta and para positions of the ring",
            ),
            Formula(CHLOROPROPANE_1, "C3H7Cl", "1-chloropropane"),
            Unsaturation(CHLOROPROPANE_1, 0),
            Environments(CHLOROPROPANE_1, (3, 2, 2)),
            Source(
                "Chemical shift is defined as the difference between the "
                "resonance frequency of the nucleus and that of a reference, "
                "divided by the operating frequency, and reported in parts per "
                "million; tetramethylsilane is the conventional reference for "
                "1H and 13C in organic solvents and is assigned zero.",
                IUPAC_NMR,
            ),
            Source(
                "Approximate 1H shift regions: alkyl hydrogens about 0.8 to 1.8 "
                "ppm; hydrogens on a carbon adjacent to a carbonyl about 2.0 to "
                "2.6 ppm; hydrogens on a carbon bearing oxygen about 3.3 to 4.5 "
                "ppm; alkene hydrogens about 4.5 to 6.5 ppm; aromatic hydrogens "
                "about 6.5 to 8.5 ppm; aldehyde hydrogens about 9 to 10 ppm; "
                "carboxylic acid hydrogens about 10 to 13 ppm. Hydrogens on "
                "oxygen and nitrogen vary with concentration, solvent and "
                "temperature and have no fixed position. These are ranges from "
                "a correlation chart, not values this repository can derive.",
                SILVERSTEIN,
            ),
            Source(
                "The ring current of an aromatic system produces an induced "
                "field that reinforces the applied field at positions outside "
                "the ring, deshielding aromatic hydrogens relative to alkene "
                "hydrogens on an isolated double bond.",
                CLARIDGE,
            ),
        ),
    ),
    "ORG1.NMRINTEGRATION": Lesson(
        node="ORG1.NMRINTEGRATION",
        objective=(
            "Convert a set of signal integrals into a hydrogen count per "
            "environment using the molecular formula, and use the resulting "
            "count and ratio to eliminate isomers."
        ),
        build_on=(
            "You know that chemically different hydrogens give signals at "
            "different positions. Integration adds the other half of the "
            "information, which is how many hydrogens are behind each signal, "
            "and it is the part of a spectrum that follows most directly from "
            "molecular symmetry."
        ),
        core_idea=(
            "The area under a proton signal is proportional to the number of "
            "hydrogens producing it. Proportional, not equal: a spectrum hands "
            "you a ratio and nothing more, and the molecular formula is what "
            "converts that ratio into counts. Reduce the areas to the smallest "
            "whole number ratio, then scale until the parts sum to the number "
            "of hydrogens in the formula. The ratio itself is a structural "
            "fact, because hydrogens that a symmetry operation of the molecule "
            "can interchange are chemically equivalent and produce one signal "
            "between them. That is why you can predict the number of signals "
            "and their ratio from a candidate structure before ever seeing a "
            "spectrum, and why a candidate that predicts the wrong ratio is "
            "eliminated outright rather than argued about. The three hydrogens "
            "of a freely rotating methyl group are equivalent for the same "
            "reason: rotation interchanges them faster than the experiment can "
            "distinguish them."
        ),
        worked_example=(
            "The formula C8H10 has four isomers built on a benzene ring, and "
            "integration separates all four. Para-xylene has two methyl groups "
            "on opposite corners of the ring; the mirror planes of that "
            "arrangement make the two methyls equivalent and make all four "
            "remaining ring hydrogens equivalent, so it gives two signals in "
            "the ratio 6:4. Ortho-xylene has its methyls adjacent; the methyls "
            "are still equivalent to each other, but the four ring hydrogens "
            "split into two equivalent pairs, giving three signals in the ratio "
            "6:2:2. Meta-xylene gives four signals in the ratio 6:2:1:1, "
            "because the ring hydrogen between the two methyls and the one "
            "opposite them are each unique. Ethylbenzene has no methyl pair at "
            "all and gives five signals in the ratio 3:2:2:2:1. So a spectrum "
            "with exactly two signals whose areas are in a 3 to 2 ratio must be "
            "para-xylene: scale 3:2 so the parts sum to the ten hydrogens the "
            "formula supplies, and you get 6 and 4. One honest caveat: the "
            "count of environments is what symmetry fixes, and the count of "
            "peaks you can resolve may be smaller, since the two aromatic "
            "environments of ortho-xylene are similar enough to overlap on a "
            "low field instrument."
        ),
        try_it_prompt=(
            "Two bottles both contain a compound of formula C4H9Br. The first "
            "gives a proton spectrum with a single signal. The second gives "
            "four signals. Name the compound in each bottle, and give the "
            "integration ratio you expect for the second."
        ),
        try_it_answer=(
            "The first is 2-bromo-2-methylpropane. Its three methyl groups are "
            "interchanged by the symmetry of the molecule, so all nine "
            "hydrogens are one environment and give one signal. The second is "
            "1-bromobutane, an unbranched chain in which every carbon is "
            "different, giving four environments in the ratio 3:2:2:2. The "
            "formula is doing real work in both answers: one signal alone would "
            "not tell you how many hydrogens it represents, and C4H9Br fixes "
            "the total at nine."
        ),
        pitfall=(
            "The error is reading integrals as absolute hydrogen counts. An "
            "integral trace marked 3.0 and 2.0 could mean 3 and 2 hydrogens, or "
            "6 and 4, or 9 and 6, and the spectrum contains nothing that "
            "distinguishes them, because the instrument reports relative areas "
            "on an arbitrary scale. The belief behind the mistake is that the "
            "machine counted hydrogens. It measured them against each other. "
            "Only the molecular formula sets the scale, which is why "
            "integration is the second step of an elucidation and never the "
            "first."
        ),
        claims=(
            Formula(P_XYLENE, "C8H10", "para-xylene"),
            Unsaturation(P_XYLENE, 4),
            Environments(P_XYLENE, (6, 4), "two equivalent methyls, four equivalent ring hydrogens"),
            Formula(O_XYLENE, "C8H10", "ortho-xylene"),
            Unsaturation(O_XYLENE, 4),
            Environments(O_XYLENE, (6, 2, 2)),
            Formula(M_XYLENE, "C8H10", "meta-xylene"),
            Unsaturation(M_XYLENE, 4),
            Environments(M_XYLENE, (6, 2, 1, 1)),
            Formula(ETHYLBENZENE, "C8H10", "ethylbenzene"),
            Unsaturation(ETHYLBENZENE, 4),
            Environments(ETHYLBENZENE, (3, 2, 2, 2, 1)),
            Relationship(P_XYLENE, O_XYLENE, "constitutional"),
            Relationship(P_XYLENE, ETHYLBENZENE, "constitutional"),
            Formula(BROMO_2_METHYLPROPANE_2, "C4H9Br", "2-bromo-2-methylpropane"),
            Unsaturation(BROMO_2_METHYLPROPANE_2, 0),
            Environments(BROMO_2_METHYLPROPANE_2, (9,), "one environment, nine hydrogens"),
            Formula(BROMOBUTANE_1, "C4H9Br", "1-bromobutane"),
            Unsaturation(BROMOBUTANE_1, 0),
            Environments(BROMOBUTANE_1, (3, 2, 2, 2)),
            Relationship(BROMO_2_METHYLPROPANE_2, BROMOBUTANE_1, "constitutional"),
        ),
    ),
