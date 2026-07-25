"""ORG2 Unit 5: Aldehydes and Ketones.

The carbonyl group is the organising idea of the second organic course, and
this unit builds it up one nucleophile at a time. Every structural fact a
lesson states carries a claim that RDKit re-derives from the structure when the
test suite runs: a formula, a degree of unsaturation, an isomer relationship, a
proton environment count, a stereochemical descriptor. If a fact here is wrong
the build fails rather than a learner finding it.

The facts this unit most wants to state that no code can check are reaction
outcomes and spectroscopic positions: that an aldehyde is more reactive than a
ketone, that a carbonyl absorbs near 1700 wavenumbers, that an aldehyde proton
resonates far downfield. Those are carried as a Source with a real citation,
never as a number recalled from memory.
"""

from __future__ import annotations

from app.data.claims import Environments, Formula, Relationship, Source, Stereo, Unsaturation
from app.data.lesson_types import Lesson

# ---------------------------------------------------------------------------
# Structures, named once so a claim and its prose cannot drift apart. Every
# formula, environment count and descriptor below was read back from RDKit
# before it was written into the prose.
# ---------------------------------------------------------------------------

METHANAL = "C=O"                       # formaldehyde
ETHANAL = "CC=O"                       # acetaldehyde
PROPANAL = "CCC=O"
BUTANAL = "CCCC=O"
PROPANONE = "CC(C)=O"                  # acetone
BUTAN_2_ONE = "CCC(C)=O"

ETHANOL = "CCO"
PROPAN_1_OL = "CCCO"
PROPAN_2_OL = "CC(C)O"

# Butan-2-ol, the racemic secondary alcohol that reduction of butan-2-one and
# addition of a carbon nucleophile to propanal both produce. Descriptors were
# read from RDKit, not reasoned out by hand.
BUTAN_2_OL_R = "CC[C@@H](C)O"
BUTAN_2_OL_S = "CC[C@H](C)O"

# Nucleophilic addition products.
ETHANAL_HYDRATE = "CC(O)O"             # ethane-1,1-diol
ETHANAL_CYANOHYDRIN = "CC(O)C#N"       # 2-hydroxypropanenitrile
HCN = "C#N"
WATER = "O"

# Oxygen nucleophiles: hemiacetal, acetal, cyclic acetal.
METHANOL = "CO"
ETHANAL_HEMIACETAL = "CC(O)OC"         # 1-methoxyethanol
ETHANAL_DIMETHYL_ACETAL = "CC(OC)OC"   # 1,1-dimethoxyethane
ETHYLENE_GLYCOL = "OCCO"
ETHANAL_DIOXOLANE = "CC1OCCO1"         # 2-methyl-1,3-dioxolane

# Nitrogen nucleophiles: imine and enamine.
METHYLAMINE = "CN"
DIMETHYLAMINE = "CNC"
PROPANONE_IMINE = "CC(C)=NC"           # N-methylpropan-2-imine
PROPANONE_ENAMINE = "C=C(C)N(C)C"      # the acetone-derived enamine

# Wittig products, and the elimination isomer they are contrasted with.
METHYLPROPENE = "C=C(C)C"              # 2-methylprop-1-ene
METHYLBUT_1_ENE = "C=C(C)CC"          # 2-methylbut-1-ene
METHYLBUT_2_ENE = "CC=C(C)C"          # 2-methylbut-2-ene

# Reductive amination product.
N_METHYLPROPAN_2_AMINE = "CC(C)NC"

# Conjugate addition substrate.
MVK = "CC(=O)C=C"                       # but-3-en-2-one, methyl vinyl ketone

# ---------------------------------------------------------------------------
# Citations, written once so the same reference reads the same way everywhere.
# ---------------------------------------------------------------------------

STANDARD_TEXT = (
    "Standard treatment; see an introductory organic text's chapter on "
    "carbonyl chemistry, for example Clayden, Greeves and Warren, Organic "
    "Chemistry, 2nd edition, Oxford University Press 2012."
)
SILVERSTEIN = (
    "Silverstein, Webster, Kiemle and Bryce, Spectrometric Identification of "
    "Organic Compounds, 8th edition, Wiley 2014, correlation charts in the "
    "infrared and proton NMR chapters."
)
PAVIA = (
    "Pavia, Lampman, Kriz and Vyvyan, Introduction to Spectroscopy, 5th "
    "edition, Cengage 2015, infrared and NMR correlation tables."
)


LESSONS_ORG2_U5 = {
    "ORG2.CARBONYLSTRUCTURE": Lesson(
        node="ORG2.CARBONYLSTRUCTURE",
        objective=(
            "Describe the geometry and polarisation of the carbonyl group, and "
            "name simple aldehydes and ketones, distinguishing the two classes "
            "from their constitution."
        ),
        build_on=(
            "You already know a carbon-carbon double bond from the alkene unit: "
            "two sp2 carbons sharing a pi bond, trigonal and planar. The "
            "carbonyl is that geometry with one carbon replaced by oxygen, and "
            "that single substitution changes everything the group does."
        ),
        core_idea=(
            "A carbonyl is a carbon doubly bonded to oxygen. The carbon is sp2 "
            "and trigonal planar, with bond angles near 120 degrees, and the pi "
            "bond is strongly polarised because oxygen is far more "
            "electronegative than carbon. That leaves the carbonyl carbon "
            "electron poor, a site an electron rich reagent attacks, and the "
            "oxygen electron rich, a site a proton or a metal binds. An "
            "aldehyde carries the carbonyl at the end of a chain, with at least "
            "one hydrogen on the carbonyl carbon, and takes the suffix -al. A "
            "ketone carries it between two carbons, needs a locant, and takes "
            "the suffix -one. Propanal and propanone share the formula C3H6O "
            "but are different compounds, and that difference is visible in "
            "their proton spectra."
        ),
        worked_example=(
            "Compare propanal, CH3CH2CHO, with propanone, CH3COCH3. Both are "
            "C3H6O with one degree of unsaturation, the carbonyl pi bond, so "
            "the formula alone cannot tell them apart. Their constitutions "
            "differ: propanal puts the carbonyl at C1 as an aldehyde, propanone "
            "puts it at C2 as a ketone, so they are constitutional isomers. "
            "Symmetry then separates them. Propanone has two equivalent methyl "
            "groups and every one of its six hydrogens is equivalent, giving a "
            "single proton environment. Propanal has three: the methyl, the "
            "methylene and the lone aldehyde hydrogen, in the ratio 3:2:1. A "
            "proton spectrum with one signal is the ketone; three signals is "
            "the aldehyde."
        ),
        try_it_prompt=(
            "Butanal and butan-2-one are both C4H8O. Are they constitutional "
            "isomers, and how many distinct proton environments does each show?"
        ),
        try_it_answer=(
            "They are constitutional isomers: same formula, one an aldehyde and "
            "one a ketone, so a different connectivity. Butanal has four proton "
            "environments in the ratio 3:2:2:1, the methyl, the two methylenes "
            "and the aldehyde hydrogen. Butan-2-one has three in the ratio "
            "3:3:2, the two inequivalent methyls and the methylene. The proton "
            "count alone distinguishes them."
        ),
        pitfall=(
            "The trap is treating the molecular formula as an identity. C3H6O "
            "names propanal, propanone and prop-2-en-1-ol among others, all "
            "with one degree of unsaturation. The formula fixes the atom count "
            "and the number of rings plus pi bonds; it does not fix which atoms "
            "are bonded to which. Read the constitution, not the formula alone."
        ),
        claims=(
            Formula(PROPANAL, "C3H6O", "propanal, an aldehyde"),
            Formula(PROPANONE, "C3H6O", "propanone, a ketone"),
            Unsaturation(PROPANAL, 1, "the carbonyl pi bond"),
            Unsaturation(PROPANONE, 1, "the carbonyl pi bond"),
            Relationship(
                PROPANAL, PROPANONE, "constitutional",
                "same formula, aldehyde versus ketone connectivity",
            ),
            Environments(PROPANAL, (3, 2, 1), "methyl, methylene, aldehyde H"),
            Environments(PROPANONE, (6,), "one environment by symmetry"),
            Formula(BUTANAL, "C4H8O", "butanal"),
            Formula(BUTAN_2_ONE, "C4H8O", "butan-2-one"),
            Relationship(BUTANAL, BUTAN_2_ONE, "constitutional"),
            Environments(BUTANAL, (3, 2, 2, 1)),
            Environments(BUTAN_2_ONE, (3, 3, 2)),
        ),
    ),
    "ORG2.CARBONYLPREP": Lesson(
        node="ORG2.CARBONYLPREP",
        objective=(
            "Choose a route to a target aldehyde or ketone, and track the "
            "change in molecular formula and unsaturation each route makes."
        ),
        build_on=(
            "You met oxidation of alcohols and the pi bonds of alkenes and "
            "alkynes in the first course. Those reactions run forward into "
            "carbonyls, so preparing an aldehyde or ketone is mostly a matter "
            "of recognising the reaction you already know, read in the "
            "carbonyl-making direction."
        ),
        core_idea=(
            "Oxidation of an alcohol is the workhorse: a primary alcohol goes "
            "to an aldehyde and a secondary alcohol to a ketone, each losing "
            "two hydrogens and gaining one degree of unsaturation as the "
            "carbon-oxygen single bond becomes a double bond. A tertiary "
            "alcohol has no hydrogen on the carbinol carbon and cannot be "
            "oxidised this way. Alkenes cleaved at the double bond and alkynes "
            "hydrated at the triple bond also deliver carbonyls, and reduction "
            "of an acid derivative supplies an aldehyde from a higher oxidation "
            "state. The bookkeeping to carry through all of them is the degree "
            "of unsaturation: making a carbonyl from a saturated alcohol raises "
            "it by exactly one."
        ),
        worked_example=(
            "Oxidise ethanol to ethanal. Ethanol is C2H6O with zero degrees of "
            "unsaturation; ethanal is C2H4O with one. The transformation "
            "removes two hydrogen atoms and turns the C-O single bond into the "
            "carbonyl double bond, which is the one new degree of unsaturation. "
            "The same arithmetic runs for a secondary alcohol: propan-2-ol, "
            "C3H8O and zero degrees, oxidises to propanone, C3H6O and one "
            "degree. In both cases the carbon skeleton is untouched and only "
            "the oxidation level of one carbon changes, so the count of carbons "
            "is conserved while the count of hydrogens drops by two."
        ),
        try_it_prompt=(
            "Propan-2-ol is oxidised. What is the product, and how do the "
            "molecular formula and the degree of unsaturation change?"
        ),
        try_it_answer=(
            "The product is propanone. Propan-2-ol, C3H8O with zero degrees of "
            "unsaturation, loses two hydrogens to give propanone, C3H6O with "
            "one degree of unsaturation. The carbon count is unchanged and the "
            "new degree of unsaturation is the carbonyl pi bond."
        ),
        pitfall=(
            "The common error is expecting a tertiary alcohol to oxidise to a "
            "carbonyl. It cannot: forming the carbonyl requires removing a "
            "hydrogen from the carbon that bears the hydroxyl, and a tertiary "
            "carbinol carbon has none. Check for that hydrogen before you draw "
            "an oxidation product."
        ),
        claims=(
            Formula(ETHANOL, "C2H6O", "ethanol"),
            Unsaturation(ETHANOL, 0, "a saturated alcohol"),
            Formula(ETHANAL, "C2H4O", "ethanal, from oxidation of ethanol"),
            Unsaturation(ETHANAL, 1, "the new carbonyl pi bond"),
            Formula(PROPAN_2_OL, "C3H8O", "propan-2-ol"),
            Unsaturation(PROPAN_2_OL, 0),
            Formula(PROPANONE, "C3H6O", "propanone, from oxidation of propan-2-ol"),
            Unsaturation(PROPANONE, 1),
        ),
    ),
    "ORG2.NUCADDITION": Lesson(
        node="ORG2.NUCADDITION",
        objective=(
            "Draw the two-step nucleophilic addition mechanism, predict the "
            "formula of a simple addition product, and explain why an aldehyde "
            "adds more readily than a ketone."
        ),
        build_on=(
            "You know the carbonyl carbon is electron poor. A nucleophile is "
            "electron rich. Nucleophilic addition is what happens when the two "
            "meet: the reaction the polarised pi bond exists to undergo."
        ),
        core_idea=(
            "The nucleophile attacks the carbonyl carbon, the pi electrons move "
            "onto oxygen, and the trigonal sp2 carbon becomes a tetrahedral sp3 "
            "carbon bearing an alkoxide, which a proton source then neutralises "
            "to an alcohol. Adding water gives a hydrate, adding cyanide with a "
            "proton gives a cyanohydrin, and each product is the "
            "carbonyl compound plus the small molecule that added across the pi "
            "bond, with no atoms lost. Aldehydes react faster than ketones for "
            "two reasons that pull the same way: an aldehyde carbonyl carries "
            "one hydrogen and one alkyl group where a ketone carries two alkyl "
            "groups, so the aldehyde is less crowded for the incoming "
            "nucleophile and its carbonyl carbon is left more electron poor, "
            "since alkyl groups donate electron density."
        ),
        worked_example=(
            "Add water across ethanal. The oxygen of water attacks the "
            "carbonyl carbon and, after proton transfers, the product is "
            "ethane-1,1-diol, the hydrate. Count atoms: ethanal is C2H4O and "
            "water is H2O, and the hydrate is C2H6O2, exactly the sum, because "
            "addition conserves every atom. Now add hydrogen cyanide instead. "
            "Cyanide attacks the carbon and a proton caps the oxygen, giving "
            "the cyanohydrin, 2-hydroxypropanenitrile. Ethanal, C2H4O, plus "
            "HCN, CHN, gives C3H5NO, again the exact sum. The mechanism is one "
            "idea told twice with a different nucleophile."
        ),
        try_it_prompt=(
            "Hydrogen cyanide adds to ethanal to give a cyanohydrin. Using only "
            "the formulas of ethanal, C2H4O, and HCN, CHN, what is the formula "
            "of the product, and why is no water lost?"
        ),
        try_it_answer=(
            "The product is C3H5NO, the sum of C2H4O and CHN. Nothing is lost "
            "because this is an addition: the nucleophile and the proton add "
            "across the carbonyl pi bond, converting a double bond to two new "
            "single bonds without eliminating any fragment."
        ),
        pitfall=(
            "A frequent slip is to treat addition as if it released water the "
            "way condensation does. Simple addition of water or hydrogen "
            "cyanide loses nothing; the product formula is the exact sum of the "
            "two reactants. Losing water is the signature of the acetal and "
            "imine condensations you meet next, not of a hydrate or a "
            "cyanohydrin."
        ),
        claims=(
            Formula(ETHANAL, "C2H4O", "ethanal"),
            Formula(WATER, "H2O", "water, the added nucleophile"),
            Formula(ETHANAL_HYDRATE, "C2H6O2", "the hydrate, C2H4O plus H2O"),
            Formula(HCN, "CHN", "hydrogen cyanide"),
            Formula(
                ETHANAL_CYANOHYDRIN, "C3H5NO",
                "the cyanohydrin, C2H4O plus CHN, no atom lost",
            ),
            Source(
                "Aldehydes undergo nucleophilic addition faster than ketones, "
                "because the ketone's second alkyl group both crowds the "
                "carbonyl carbon and donates electron density into it, an "
                "effect the checker cannot derive from constitution alone.",
                STANDARD_TEXT,
            ),
        ),
    ),
    "ORG2.HYDRATEACETAL": Lesson(
        node="ORG2.HYDRATEACETAL",
        objective=(
            "Distinguish a hydrate, a hemiacetal and an acetal by constitution, "
            "and account for the water lost when an acetal forms."
        ),
        build_on=(
            "You have added one oxygen nucleophile, water, to give a hydrate. "
            "An alcohol is the same kind of nucleophile, and adding two of them "
            "in sequence is the whole of acetal chemistry, with one extra step "
            "that expels water."
        ),
        core_idea=(
            "One alcohol adds across the carbonyl to give a hemiacetal, a "
            "carbon bearing both an OH and an OR on the same atom, and this "
            "first step is a pure addition that loses nothing. The hemiacetal "
            "then exchanges its OH for a second OR: the oxygen leaves as water "
            "and a second alcohol takes its place, giving an acetal, a carbon "
            "bearing two OR groups. So the overall change from carbonyl to "
            "acetal consumes two alcohols and releases one water. All of it is "
            "reversible, which is why acetals form under anhydrous acid and "
            "hydrolyse back to the carbonyl under aqueous acid."
        ),
        worked_example=(
            "React ethanal with methanol. The first methanol adds to give the "
            "hemiacetal 1-methoxyethanol: ethanal, C2H4O, plus methanol, CH4O, "
            "is C3H8O2, an addition with nothing lost. The second methanol then "
            "displaces the hydroxyl as water to give the acetal "
            "1,1-dimethoxyethane. Balance the whole route: one ethanal, C2H4O, "
            "plus two methanols, together C2H8O2, would give C4H12O3, but the "
            "acetal is C4H10O2, lighter by exactly H2O. That missing water is "
            "the one expelled in the second step, and the arithmetic is how you "
            "confirm an acetal rather than a hemiacetal or a hydrate."
        ),
        try_it_prompt=(
            "Ethanal reacts with two equivalents of methanol to form an acetal. "
            "Ethanal is C2H4O and methanol is CH4O. What is the formula of the "
            "acetal, and how much water is released?"
        ),
        try_it_answer=(
            "The acetal is C4H10O2 and one molecule of water is released. Two "
            "methanols, C2H8O2, plus ethanal, C2H4O, sum to C4H12O3; removing "
            "one water, H2O, leaves C4H10O2, which is 1,1-dimethoxyethane."
        ),
        pitfall=(
            "The misconception is that acetal formation, like simple addition, "
            "conserves all atoms. The first oxygen adds without loss, but the "
            "second substitutes, and substitution expels water. If your acetal "
            "formula is the plain sum of the carbonyl and two alcohols, you "
            "have forgotten the water and drawn a formula one H2O too heavy."
        ),
        claims=(
            Formula(ETHANAL, "C2H4O", "ethanal"),
            Formula(METHANOL, "CH4O", "methanol, the oxygen nucleophile"),
            Formula(
                ETHANAL_HEMIACETAL, "C3H8O2",
                "1-methoxyethanol, ethanal plus one methanol, no loss",
            ),
            Formula(
                ETHANAL_DIMETHYL_ACETAL, "C4H10O2",
                "1,1-dimethoxyethane, the acetal; two methanols minus one water",
            ),
            Formula(WATER, "H2O", "the water expelled in the second step"),
        ),
    ),
    "ORG2.ACETALPROTECT": Lesson(
        node="ORG2.ACETALPROTECT",
        objective=(
            "Explain how an acetal masks a carbonyl during a basic step, and "
            "confirm by formula that a cyclic acetal is a carbonyl plus a diol "
            "minus water."
        ),
        build_on=(
            "You can now turn a carbonyl into an acetal and back. That "
            "reversibility is not a curiosity; it is a tool, because an acetal "
            "is unreactive exactly where a carbonyl is reactive, so it can hide "
            "a carbonyl while you work elsewhere in the molecule."
        ),
        core_idea=(
            "An acetal has no carbonyl pi bond and no electrophilic carbon, so "
            "it ignores the nucleophiles and bases that a carbonyl would react "
            "with. That makes it a protecting group: convert a sensitive "
            "carbonyl to an acetal, run a reaction under basic conditions that "
            "the free carbonyl could not survive, then hydrolyse the acetal "
            "with aqueous acid to return the carbonyl unchanged. A diol such as "
            "ethylene glycol is the usual reagent, because it forms a five "
            "membered cyclic acetal, a 1,3-dioxolane, in which both oxygens come "
            "from one molecule, and the ring makes the protection easy to put "
            "on and take off."
        ),
        worked_example=(
            "Protect ethanal as its ethylene glycol acetal. The diol supplies "
            "both oxygens, so ethanal, C2H4O, plus ethylene glycol, C2H6O2, "
            "would give C4H10O3, and the cyclic acetal 2-methyl-1,3-dioxolane "
            "is C4H8O2, lighter by exactly one water. That single water is the "
            "condensation, the same loss as any acetal. Notice the "
            "unsaturation: ethanal has one degree, the carbonyl; the dioxolane "
            "also has one degree, now the ring rather than a pi bond. The "
            "carbonyl reactivity is gone while the atom count barely changed, "
            "and a later treatment with aqueous acid reverses the step and "
            "regenerates ethanal."
        ),
        try_it_prompt=(
            "Ethanal, C2H4O, is protected with ethylene glycol, C2H6O2, to give "
            "a cyclic acetal. What is the acetal's formula, and where has its "
            "one degree of unsaturation gone, given the carbonyl is now absent?"
        ),
        try_it_answer=(
            "The acetal is C4H8O2, which is the sum C4H10O3 minus one water. Its "
            "single degree of unsaturation is the five membered dioxolane ring; "
            "the carbonyl pi bond is gone, replaced by two carbon-oxygen single "
            "bonds that close the ring."
        ),
        pitfall=(
            "A protecting group is only useful if it survives the step you "
            "chose it for and comes off cleanly afterward. The error is "
            "reaching for an acetal to protect a carbonyl through an acidic, "
            "aqueous step, which is precisely the condition that hydrolyses it. "
            "Acetals are stable to base and to nucleophiles; they are removed "
            "by aqueous acid, so match the protection to the chemistry."
        ),
        claims=(
            Formula(ETHANAL, "C2H4O", "ethanal, the carbonyl to be protected"),
            Formula(ETHYLENE_GLYCOL, "C2H6O2", "ethylene glycol, the diol"),
            Formula(
                ETHANAL_DIOXOLANE, "C4H8O2",
                "2-methyl-1,3-dioxolane; carbonyl plus diol minus water",
            ),
            Unsaturation(ETHANAL, 1, "the carbonyl pi bond"),
            Unsaturation(ETHANAL_DIOXOLANE, 1, "now the ring, not a pi bond"),
            Source(
                "Acetals are stable to base and to nucleophilic reagents and "
                "are cleaved back to the carbonyl by aqueous acid; this "
                "condition-dependent behaviour is not derivable from structure.",
                STANDARD_TEXT,
            ),
        ),
    ),
    "ORG2.IMINEENAMINE": Lesson(
        node="ORG2.IMINEENAMINE",
        objective=(
            "Predict whether a carbonyl and an amine give an imine or an "
            "enamine, and account for the water lost in each condensation."
        ),
        build_on=(
            "Oxygen nucleophiles gave hydrates and acetals. Nitrogen is the "
            "other common nucleophile, and it adds the same way, but because "
            "nitrogen ends the sequence with a hydrogen to lose, the product is "
            "a double bond rather than a saturated addition."
        ),
        core_idea=(
            "A primary amine adds to a carbonyl, then loses water to give an "
            "imine, a carbon-nitrogen double bond, because the nitrogen still "
            "carries a hydrogen that leaves with the oxygen as water. A "
            "secondary amine has no such hydrogen on nitrogen, so after losing "
            "water it forms the double bond to an adjacent carbon instead, "
            "giving an enamine. Both are condensations that expel one water. "
            "The rate depends on acidity: a little acid speeds the loss of "
            "water, but too much acid protonates the amine and removes the "
            "nucleophile, so the reactions run best under mildly acidic "
            "conditions."
        ),
        worked_example=(
            "React propanone with methylamine, a primary amine. Addition "
            "followed by loss of water gives the imine N-methylpropan-2-imine. "
            "Balance it: propanone, C3H6O, plus methylamine, CH5N, is C4H11NO, "
            "and the imine is C4H9N, lighter by one water. Now react propanone "
            "with dimethylamine, a secondary amine. There is no N-H to lose "
            "after dehydration, so the new double bond forms to a neighbouring "
            "carbon, giving the enamine. Propanone, C3H6O, plus dimethylamine, "
            "C2H7N, is C5H13NO, and the enamine is C5H11N, again lighter by one "
            "water. Same loss, different place for the double bond."
        ),
        try_it_prompt=(
            "Propanone reacts with methylamine, CH5N, to form an imine. Given "
            "propanone is C3H6O, what is the imine's formula, and what small "
            "molecule is lost?"
        ),
        try_it_answer=(
            "The imine is C4H9N and one water is lost. Propanone, C3H6O, plus "
            "methylamine, CH5N, sums to C4H11NO; removing H2O leaves C4H9N, the "
            "imine N-methylpropan-2-imine."
        ),
        pitfall=(
            "The misconception is that any amine gives an imine. Only a primary "
            "amine can: forming the carbon-nitrogen double bond needs the "
            "nitrogen to shed a hydrogen. A secondary amine, having no N-H "
            "left after it bonds, forms an enamine by moving the double bond to "
            "carbon instead, and a tertiary amine cannot condense at all."
        ),
        claims=(
            Formula(PROPANONE, "C3H6O", "propanone"),
            Formula(METHYLAMINE, "CH5N", "methylamine, a primary amine"),
            Formula(PROPANONE_IMINE, "C4H9N", "the imine, C3H6O plus CH5N minus H2O"),
            Formula(DIMETHYLAMINE, "C2H7N", "dimethylamine, a secondary amine"),
            Formula(PROPANONE_ENAMINE, "C5H11N", "the enamine, C3H6O plus C2H7N minus H2O"),
            Unsaturation(PROPANONE_IMINE, 1, "the carbon-nitrogen double bond"),
            Unsaturation(PROPANONE_ENAMINE, 1, "the carbon-carbon double bond"),
            Formula(WATER, "H2O", "the water expelled in each condensation"),
            Source(
                "Imine and enamine condensations proceed fastest under mildly "
                "acidic conditions, a balance between acid-catalysed loss of "
                "water and acid protonation of the amine; the optimum is a "
                "reaction condition the checker cannot derive.",
                STANDARD_TEXT,
            ),
        ),
    ),
    "ORG2.WITTIG": Lesson(
        node="ORG2.WITTIG",
        objective=(
            "Predict the alkene a Wittig reaction produces, and explain why its "
            "double bond is placed unambiguously at the former carbonyl carbon."
        ),
        build_on=(
            "You have converted a carbonyl to alcohols, acetals, imines and "
            "enamines. The Wittig converts it to an alkene, and unlike the "
            "elimination routes to alkenes you already know, it fixes the "
            "position of the new double bond with no ambiguity."
        ),
        core_idea=(
            "A phosphorus ylide, a carbanion stabilised by an adjacent "
            "positively charged phosphorus, adds to the carbonyl carbon and the "
            "two fragments swap partners: the ylide carbon and the carbonyl "
            "carbon end up joined by a new carbon-carbon double bond, while the "
            "oxygen leaves on phosphorus as a phosphine oxide. The value of the "
            "method is regiochemical certainty. The new double bond appears "
            "exactly between the ylide carbon and the carbon that used to be the "
            "carbonyl, so there is never a question of which way it points, "
            "unlike dehydration of an alcohol, which follows Zaitsev and tends "
            "to the more substituted alkene."
        ),
        worked_example=(
            "Treat butan-2-one, C4H8O, with the ylide from a methyl group. The "
            "carbonyl oxygen is replaced by CH2, so the product is "
            "2-methylbut-1-ene, C5H10, with the double bond at the former "
            "carbonyl carbon, which is a chain end after the swap. Contrast the "
            "obvious alternative: add a methyl to butan-2-one to get "
            "2-methylbutan-2-ol, then dehydrate, and Zaitsev sends you to the "
            "more substituted 2-methylbut-2-ene, also C5H10. The two alkenes "
            "are constitutional isomers with the double bond in different "
            "places, and the Wittig is the route that guarantees the terminal "
            "one."
        ),
        try_it_prompt=(
            "The Wittig on butan-2-one gives 2-methylbut-1-ene, while "
            "dehydration of the derived tertiary alcohol gives 2-methylbut-2-"
            "ene. Both are C5H10. What is their relationship?"
        ),
        try_it_answer=(
            "They are constitutional isomers: the same molecular formula, "
            "C5H10, and the same one degree of unsaturation, but the "
            "carbon-carbon double bond sits in a different position, terminal "
            "in the Wittig product and internal in the elimination product."
        ),
        pitfall=(
            "The trap is drawing the Wittig double bond at the more substituted "
            "position out of habit from elimination chemistry. The Wittig does "
            "not obey Zaitsev; the double bond forms where the carbonyl was, "
            "full stop. Locate the old carbonyl carbon and put one end of the "
            "new double bond there."
        ),
        claims=(
            Formula(BUTAN_2_ONE, "C4H8O", "butan-2-one, the Wittig substrate"),
            Formula(METHYLBUT_1_ENE, "C5H10", "2-methylbut-1-ene, the Wittig product"),
            Formula(METHYLBUT_2_ENE, "C5H10", "2-methylbut-2-ene, the elimination product"),
            Unsaturation(METHYLBUT_1_ENE, 1, "one carbon-carbon double bond"),
            Unsaturation(METHYLBUT_2_ENE, 1, "one carbon-carbon double bond"),
            Relationship(
                METHYLBUT_1_ENE, METHYLBUT_2_ENE, "constitutional",
                "same formula, double bond in different positions",
            ),
            Formula(METHYLPROPENE, "C4H8", "2-methylprop-1-ene, the Wittig product from propanone"),
        ),
    ),
    "ORG2.REDUCTIVEAMINATION": Lesson(
        node="ORG2.REDUCTIVEAMINATION",
        objective=(
            "Predict the alcohol from reducing a carbonyl and the amine from a "
            "reductive amination, and recognise when a reduction creates a "
            "racemic stereocentre."
        ),
        build_on=(
            "Nucleophilic addition of hydride is addition with the "
            "smallest nucleophile, a hydride ion, and reductive amination "
            "stitches together the imine you made last time with that same "
            "reduction. Both are among the most used reactions in medicinal "
            "chemistry."
        ),
        core_idea=(
            "A hydride reagent delivers a hydride to the carbonyl carbon and, "
            "after protonation, an aldehyde becomes a primary alcohol and a "
            "ketone becomes a secondary alcohol. The carbonyl pi bond is gone, "
            "so the degree of unsaturation falls by exactly one. Reductive "
            "amination runs the imine condensation and the hydride reduction in "
            "one pot: carbonyl plus amine gives an imine, and reduction of its "
            "carbon-nitrogen double bond gives an amine. Watch for new "
            "stereocentres. Reducing a ketone whose two sides differ makes a "
            "carbon with four different groups, and because hydride can arrive "
            "from either face with equal ease, the product is a racemic mixture "
            "of the two enantiomers. A carbon nucleophile such as a Grignard "
            "reagent added to an aldehyde does the same thing."
        ),
        worked_example=(
            "Reduce butan-2-one, C4H8O with one degree of unsaturation, to "
            "butan-2-ol, C4H10O with zero: the carbonyl is consumed and the "
            "count drops by one. The carbinol carbon now bears a methyl, an "
            "ethyl, a hydroxyl and a hydrogen, four different groups, so it is a "
            "stereocentre. Hydride added equally to both faces of the flat "
            "carbonyl, so the product is a 50:50 mixture of (R)- and "
            "(S)-butan-2-ol, enantiomers of each other. Adding a methyl "
            "Grignard to propanal reaches the same racemic butan-2-ol. For a "
            "reductive amination, propanone plus methylamine gives an imine "
            "that reduces to N-methylpropan-2-amine, C4H11N."
        ),
        try_it_prompt=(
            "Butan-2-one is reduced to butan-2-ol. How does the degree of "
            "unsaturation change, and what is the stereochemical outcome at the "
            "new carbinol carbon?"
        ),
        try_it_answer=(
            "The degree of unsaturation falls from one to zero as the carbonyl "
            "pi bond is removed. The carbinol carbon becomes a stereocentre "
            "bearing four different groups, and because hydride adds to both "
            "faces equally the product is racemic, an equal mixture of the R "
            "and S enantiomers."
        ),
        pitfall=(
            "The misconception is expecting a single enantiomer from an achiral "
            "carbonyl and an achiral reagent. Nothing in the flask can "
            "distinguish the two faces of the planar carbonyl, so a new "
            "stereocentre is formed as a racemate. Optical activity requires a "
            "chiral influence that is not present here."
        ),
        claims=(
            Formula(BUTAN_2_ONE, "C4H8O", "butan-2-one"),
            Unsaturation(BUTAN_2_ONE, 1, "the carbonyl pi bond"),
            Formula(BUTAN_2_OL_R, "C4H10O", "butan-2-ol, the reduction product"),
            Unsaturation(BUTAN_2_OL_R, 0, "carbonyl gone, one fewer degree"),
            Stereo(BUTAN_2_OL_R, ("R",), "one enantiomer formed"),
            Stereo(BUTAN_2_OL_S, ("S",), "the other, in equal amount"),
            Relationship(
                BUTAN_2_OL_R, BUTAN_2_OL_S, "enantiomers",
                "the racemic pair from equal addition to both faces",
            ),
            Formula(PROPANAL, "C3H6O", "propanal, the Grignard substrate to the same alcohol"),
            Formula(N_METHYLPROPAN_2_AMINE, "C4H11N", "the reductive amination product"),
        ),
    ),
    "ORG2.CONJUGATEADDITION": Lesson(
        node="ORG2.CONJUGATEADDITION",
        objective=(
            "Identify an enone, and predict whether a nucleophile adds 1,2 at "
            "the carbonyl or 1,4 at the beta carbon."
        ),
        build_on=(
            "You know nucleophiles add to a carbonyl carbon. When a "
            "carbon-carbon double bond is conjugated to the carbonyl, a second "
            "electrophilic site opens up, and which one a nucleophile chooses "
            "is the new decision this lesson is about."
        ),
        core_idea=(
            "An enone is an alpha,beta-unsaturated carbonyl: a C=C conjugated "
            "with a C=O, so the molecule carries two degrees of unsaturation "
            "and the two pi systems share one electron cloud. That conjugation "
            "makes the beta carbon electrophilic as well as the carbonyl "
            "carbon. A nucleophile can add 1,2, directly to the carbonyl "
            "carbon, or 1,4, to the beta carbon, with the negative charge ending "
            "on oxygen and the neutral product a saturated carbonyl after "
            "tautomerisation. Hard, strongly basic nucleophiles such as "
            "organolithiums favour 1,2 addition; soft, more polarisable "
            "nucleophiles such as cuprates favour 1,4 addition."
        ),
        worked_example=(
            "Take but-3-en-2-one, methyl vinyl ketone, C4H6O. Its two degrees "
            "of unsaturation are the carbonyl and the vinyl group, conjugated "
            "through the bond between them. A hard nucleophile adds 1,2 and "
            "builds an allylic alcohol at the carbonyl carbon. A soft "
            "nucleophile adds 1,4 at the terminal CH2, and after the enol "
            "tautomerises the product is a saturated ketone, in which the "
            "original C=C is gone and only the carbonyl degree of unsaturation "
            "remains, the way butan-2-one, C4H8O, has one degree against methyl "
            "vinyl ketone's two. The choice of nucleophile, not the substrate, "
            "sets the site."
        ),
        try_it_prompt=(
            "Methyl vinyl ketone is C4H6O with two degrees of unsaturation. "
            "After 1,4 addition of a nucleophile and workup to a saturated "
            "ketone, how many degrees of unsaturation remain, and which pi bond "
            "was consumed?"
        ),
        try_it_answer=(
            "One degree remains, the carbonyl. The 1,4 addition consumes the "
            "carbon-carbon double bond of the enone, leaving a saturated ketone "
            "such as the C4H8O framework of butan-2-one with its single "
            "carbonyl degree of unsaturation."
        ),
        pitfall=(
            "The trap is assuming a nucleophile always attacks the carbonyl "
            "carbon. With an isolated ketone it does, but an enone offers a "
            "second electrophilic carbon four atoms away, and soft nucleophiles "
            "prefer it. Ask whether the carbonyl is conjugated to a C=C before "
            "you commit the nucleophile to the carbonyl carbon."
        ),
        claims=(
            Formula(MVK, "C4H6O", "but-3-en-2-one, methyl vinyl ketone"),
            Unsaturation(MVK, 2, "conjugated C=O and C=C"),
            Formula(BUTAN_2_ONE, "C4H8O", "a saturated ketone, one degree of unsaturation"),
            Unsaturation(BUTAN_2_ONE, 1, "only the carbonyl remains"),
            Source(
                "Hard, basic nucleophiles such as organolithiums give mainly "
                "1,2 addition to an enone, while soft nucleophiles such as "
                "cuprates give mainly 1,4 addition; this selectivity is a "
                "reaction outcome the checker cannot derive from structure.",
                STANDARD_TEXT,
            ),
        ),
    ),
    "ORG2.CARBONYLSPECTRA": Lesson(
        node="ORG2.CARBONYLSPECTRA",
        objective=(
            "Recognise a carbonyl compound from its infrared carbonyl band and "
            "its proton spectrum, and use the aldehyde signals to tell an "
            "aldehyde from a ketone."
        ),
        build_on=(
            "You read infrared and proton spectra in the first course. The "
            "carbonyl group has two of the most reliable signatures in either "
            "technique, so a carbonyl compound is among the easiest to confirm."
        ),
        core_idea=(
            "In the infrared, the carbonyl stretch is a strong band in the "
            "region near 1700 wavenumbers, and its exact position separates the "
            "carbonyl classes, with conjugation lowering it. An aldehyde adds "
            "two confirmations a ketone lacks: a pair of weak carbon-hydrogen "
            "stretch bands from the aldehyde C-H a little below 3000 wavenumbers, "
            "and in the proton spectrum a signal far downfield, well beyond the "
            "usual range, for the single aldehyde hydrogen. The proton count "
            "still does structural work: propanone shows one environment, "
            "propanal shows three, so symmetry alone separates the two C3H6O "
            "isomers even before you read a shift."
        ),
        worked_example=(
            "You have a C3H6O compound with a strong infrared band near 1700 "
            "wavenumbers, so a carbonyl. Is it propanal or propanone? The "
            "proton spectrum settles it. Propanone is symmetric: its six "
            "hydrogens are one environment, a single signal. Propanal has three "
            "environments in the ratio 3:2:1, and one of them, the aldehyde "
            "hydrogen, sits far downfield past the ordinary aliphatic and "
            "aromatic regions, a position no ketone can show. One signal versus "
            "three, with a distinctive far-downfield line, distinguishes the "
            "aldehyde from the ketone without any measured number."
        ),
        try_it_prompt=(
            "Two C3H6O isomers, propanal and propanone, both show a strong "
            "carbonyl band near 1700 wavenumbers. Which spectroscopic features "
            "distinguish them, and how many proton environments does each have?"
        ),
        try_it_answer=(
            "Propanal has three proton environments in the ratio 3:2:1 and "
            "shows a far-downfield aldehyde-hydrogen signal plus weak aldehyde "
            "C-H stretches a little below 3000 wavenumbers. Propanone has a single "
            "proton environment by symmetry and none of those aldehyde "
            "features. The environment count and the aldehyde signals separate "
            "them."
        ),
        pitfall=(
            "The misconception is that a strong band near 1700 wavenumbers "
            "names a ketone. It names a carbon-oxygen double bond, which "
            "aldehydes, ketones, esters, acids and amides all have. What "
            "separates them is the company the band keeps: the aldehyde's weak "
            "C-H stretches and far-downfield proton, the acid's very broad O-H, "
            "and the precise position of the band itself."
        ),
        claims=(
            Formula(PROPANAL, "C3H6O", "propanal"),
            Formula(PROPANONE, "C3H6O", "propanone"),
            Environments(PROPANAL, (3, 2, 1), "three environments"),
            Environments(PROPANONE, (6,), "one environment by symmetry"),
            Relationship(PROPANAL, PROPANONE, "constitutional"),
            Source(
                "Approximate carbonyl stretch regions: saturated ketone about "
                "1705 to 1725 wavenumbers; aldehyde about 1720 to 1740; "
                "conjugation with an adjacent double bond or ring lowers the "
                "position by roughly 20 to 30 wavenumbers. These are ranges in "
                "correlation charts, not values this repository can derive.",
                SILVERSTEIN,
            ),
            Source(
                "Aldehydes show a characteristic pair of weak carbon-hydrogen "
                "stretch bands near 2720 and 2820 wavenumbers, and the aldehyde "
                "hydrogen resonates far downfield in the proton spectrum, near "
                "9 to 10 parts per million; both are tabulated values, not "
                "derivable ones.",
                PAVIA,
            ),
        ),
    ),
}
