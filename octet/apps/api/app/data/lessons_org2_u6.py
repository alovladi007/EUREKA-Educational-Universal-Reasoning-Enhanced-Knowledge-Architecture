"""ORG2 Unit 6: Carboxylic Acids and Nitriles.

The carboxyl group is where the carbonyl chemistry of the previous unit meets
the acid-base chemistry of the first course, and a nitrile is a carbon to
nitrogen triple bond that becomes an acid, a ketone or an amine depending on the
reagent that reaches its electrophilic carbon.

Every structural fact below carries a claim RDKit re-derives from the structure:
a molecular formula, a degree of unsaturation, a proton environment count. Each
was passed through chem_core.structure.formula_of and chem_core.organic during
authoring before its number went into the prose, because the author of this file
is a language model and a remembered formula is the confident wrong claim this
system exists to catch. The two carboxylate anions are charged, so the degree of
unsaturation formula refuses them and they carry only a Formula claim; the
neutral acids they come from carry the rest.

The facts no code here can settle are the pKa values and the infrared band
positions. Each of those is carried as a Source with a real citation and a
stated medium, or the lesson teaches the trend and omits the number. Carboxylic
acid acidity is explained in prose through the resonance stabilised carboxylate;
the pKa values that quantify it are sourced to the CRC Handbook for aqueous
solution at 25 degrees C, quoted to order a series rather than as analytical
constants.
"""

from __future__ import annotations

from app.data.claims import Environments, Formula, Source, Unsaturation
from app.data.lesson_types import Lesson

# ---------------------------------------------------------------------------
# Structures, named once so a claim and its prose cannot drift apart. Each was
# read back from RDKit during authoring rather than written from memory.
# ---------------------------------------------------------------------------

ACETIC_ACID = "CC(=O)O"
ACETATE = "CC(=O)[O-]"
ETHANOL = "CCO"
ETHOXIDE = "CC[O-]"
FORMIC_ACID = "OC=O"
PROPANOIC_ACID = "CCC(=O)O"
BUTANOIC_ACID = "CCCC(=O)O"
BENZOIC_ACID = "OC(=O)c1ccccc1"
TOLUENE = "Cc1ccccc1"
PROPAN_1_OL = "CCCO"

CHLOROACETIC_ACID = "ClCC(=O)O"
CHLOROACETATE = "ClCC(=O)[O-]"
DICHLOROACETIC_ACID = "ClC(Cl)C(=O)O"
TRICHLOROACETIC_ACID = "ClC(Cl)(Cl)C(=O)O"
FLUOROACETIC_ACID = "FCC(=O)O"

BROMOETHANE = "CCBr"
BROMOPROPANE_1 = "CCCBr"
ACETONITRILE = "CC#N"
PROPANENITRILE = "CCC#N"
BUTANENITRILE = "CCCC#N"
ACETAMIDE = "CC(N)=O"
ACETONE = "CC(C)=O"
ETHYLAMINE = "CCN"
PROPYLAMINE = "CCCN"

# ---------------------------------------------------------------------------
# Citations. Every number these lessons state that the repository cannot derive
# points at one of these.
# ---------------------------------------------------------------------------

CRC_PKA = (
    "CRC Handbook of Chemistry and Physics, table of dissociation constants of "
    "organic acids and bases, values for aqueous solution at 25 degrees C. "
    "Figures for the haloacetic acids vary by a few hundredths between "
    "compilations and are quoted here for ordering, not as analytical constants."
)
BALLINGER_LONG = (
    "Ballinger, P.; Long, F. A., Acid ionization constants of alcohols, Journal "
    "of the American Chemical Society 1960, volume 82, aqueous solution; the "
    "value is reproduced in the pKa appendix of standard organic texts, for "
    "example Clayden, Organic Chemistry."
)
SILVERSTEIN = (
    "Silverstein, Webster, Kiemle and Bryce, Spectrometric Identification of "
    "Organic Compounds, 8th edition, Wiley 2014, infrared and proton NMR "
    "correlation charts."
)
PAVIA = (
    "Pavia, Lampman, Kriz and Vyvyan, Introduction to Spectroscopy, 5th "
    "edition, Cengage 2015, infrared correlation tables."
)

LESSONS_ORG2_U6 = {
    "ORG2.ACIDPROPS": Lesson(
        node="ORG2.ACIDPROPS",
        objective=(
            "Name a carboxylic acid and explain why it is far more acidic than "
            "an alcohol by pointing to the resonance stabilised carboxylate that "
            "is left behind when it loses its proton."
        ),
        build_on=(
            "You met the carbonyl in aldehydes and ketones and the O-H in "
            "alcohols. A carboxylic acid carries both a carbonyl and a hydroxyl "
            "on one carbon, and it is that combination, not the O-H by itself, "
            "that makes the hydrogen ionise."
        ),
        core_idea=(
            "The carboxyl group is a carbonyl and a hydroxyl on the same carbon, "
            "written C(=O)OH. To name the acid, take the longest chain that "
            "includes the carboxyl carbon, number that carbon as C1, and replace "
            "the final e of the parent alkane name with oic acid, so the two "
            "carbon acid CH3COOH is ethanoic acid, with the common name acetic "
            "acid. What sets a carboxylic acid apart from an alcohol is what "
            "happens after the O-H proton leaves. An alcohol gives an alkoxide "
            "whose negative charge sits on one oxygen with nowhere to go. A "
            "carboxylic acid gives a carboxylate, and that charge is spread "
            "evenly over two equivalent oxygens: you can draw two resonance "
            "structures that differ only in which oxygen holds the double bond "
            "and which holds the charge, and the real ion is the average of "
            "them, with two identical carbon to oxygen bonds and half a negative "
            "charge on each oxygen. Spreading charge over two electronegative "
            "atoms lowers the energy of the anion, which lowers the cost of "
            "losing the proton, so the carboxylic acid is the far stronger acid. "
            "Acidity is a statement about the stability of the conjugate base."
        ),
        worked_example=(
            "Put acetic acid, CH3COOH with formula C2H4O2, beside ethanol, "
            "CH3CH2OH with formula C2H6O. Both carry a single O-H, so a first "
            "guess might rank them close together. Remove the O-H proton from "
            "each and look at what remains. Ethanol gives ethoxide, C2H5O minus, "
            "with a full negative charge parked on its one oxygen and no way to "
            "delocalise it. Acetic acid gives acetate, C2H3O2 minus, where you "
            "can draw two structures: in one the left oxygen is doubly bonded and "
            "the right oxygen carries the charge, in the other they are swapped. "
            "Neither is the true picture; the ion is the blend, so both oxygens "
            "are equivalent, both carbon to oxygen bonds are the same length, and "
            "the charge is halved onto each. That delocalisation stabilises "
            "acetate in a way ethoxide cannot match, so acetate forms far more "
            "readily. The measured acidities record the gap: acetic acid has a "
            "pKa near 4.76 in water while ethanol sits near 16, roughly eleven "
            "pKa units, which is a factor near ten to the eleventh in the "
            "dissociation constant."
        ),
        try_it_prompt=(
            "Formic acid, HCOOH, and methanol, CH3OH, each have one O-H. Which "
            "is the stronger acid, and what structural feature explains it? "
            "Answer from the conjugate base, not from a number."
        ),
        try_it_answer=(
            "Formic acid is the stronger acid. Losing its O-H proton gives "
            "formate, HCOO minus, whose negative charge is delocalised over two "
            "equivalent oxygens by resonance, so the anion is stabilised. "
            "Methanol gives methoxide, CH3O minus, with the charge localised on "
            "one oxygen and no such delocalisation. The stabilised carboxylate "
            "is why the carboxylic acid ionises more readily. Formic acid is "
            "CH2O2 and methanol is CH4O."
        ),
        pitfall=(
            "The tempting belief is that a carboxylic acid is acidic because its "
            "O-H bond is somehow weaker, or because its oxygen is electronegative "
            "in the same way an alcohol oxygen is. Both molecules have an O-H, "
            "and the roughly eleven pKa unit gap between them is almost entirely "
            "the resonance stabilisation of the carboxylate, a property of the "
            "anion and not of the bond that broke. Reason forward to the "
            "conjugate base every time: whatever stabilises the anion strengthens "
            "the acid."
        ),
        claims=(
            Formula(ACETIC_ACID, "C2H4O2", "acetic acid"),
            Unsaturation(ACETIC_ACID, 1, "the carbonyl pi bond"),
            Formula(ACETATE, "C2H3O2-", "acetate, charge delocalised over two oxygens"),
            Formula(ETHANOL, "C2H6O", "ethanol"),
            Unsaturation(ETHANOL, 0, "saturated and acyclic"),
            Formula(ETHOXIDE, "C2H5O-", "ethoxide, charge localised on one oxygen"),
            Formula(FORMIC_ACID, "CH2O2", "formic acid"),
            Unsaturation(FORMIC_ACID, 1, "the carbonyl pi bond"),
            Source(
                "Acetic acid has a pKa of about 4.76 in water at 25 degrees C.",
                CRC_PKA,
            ),
            Source(
                "Ethanol has an aqueous pKa near 16, an approximate figure for "
                "so weak an acid, used only to order the alcohol against the acid.",
                BALLINGER_LONG,
            ),
        ),
    ),
    "ORG2.ACIDSUBSTITUENT": Lesson(
        node="ORG2.ACIDSUBSTITUENT",
        objective=(
            "Predict how electron withdrawing substituents change the strength "
            "of a carboxylic acid, and order a series of substituted acetic "
            "acids from strongest to weakest."
        ),
        build_on=(
            "You know a carboxylic acid's strength is set by how stable its "
            "carboxylate is. A substituent that helps carry the negative charge "
            "makes the anion more stable, and the effect is large enough to "
            "shift the pKa by whole units."
        ),
        core_idea=(
            "An electronegative substituent near the carboxyl group pulls "
            "electron density toward itself through the sigma bonds. This is the "
            "inductive effect, a through bond polarisation rather than a "
            "resonance one. In the carboxylate anion that pull helps spread the "
            "negative charge away from the oxygens, stabilising the anion and so "
            "strengthening the acid. Three things scale the effect. It grows "
            "with the electronegativity of the substituent, so fluorine acts "
            "more strongly than chlorine. It grows with the number of "
            "substituents, so three chlorines act more than one. And it falls "
            "off sharply with distance, because a polarisation passed along a "
            "sigma framework weakens at every bond, so a substituent on the "
            "carbon next to the carboxyl matters far more than the same "
            "substituent three carbons away. Reading the trend the right way "
            "round matters: a stronger acid has a lower pKa, so acidity rises as "
            "the number falls."
        ),
        worked_example=(
            "Walk down the chlorinated acetic acids. Acetic acid is CH3COOH, "
            "C2H4O2. Replace the alpha hydrogens with chlorine one at a time: "
            "chloroacetic acid ClCH2COOH is C2H3ClO2, dichloroacetic acid "
            "Cl2CHCOOH is C2H2Cl2O2, and trichloroacetic acid Cl3CCOOH is "
            "C2HCl3O2. Each added chlorine withdraws more density through the "
            "bonds and stabilises the chloroacetate anion further, so the acids "
            "get stronger in that order. The aqueous pKa values fall to match: "
            "acetic near 4.76, chloroacetic near 2.87, dichloroacetic near 1.35, "
            "trichloroacetic near 0.66, each step a large drop. Now swap the "
            "halogen. Fluoroacetic acid FCH2COOH is C2H3FO2, one fluorine where "
            "chloroacetic has one chlorine. Fluorine is the more electronegative "
            "atom, so it withdraws more strongly, and fluoroacetic acid near "
            "2.59 is a touch stronger than chloroacetic near 2.87. The ranking "
            "tracks electronegativity and count, and every one of these is a far "
            "stronger acid than acetic itself."
        ),
        try_it_prompt=(
            "Chloroacetic acid, ClCH2COOH, and fluoroacetic acid, FCH2COOH, "
            "each carry one halogen on the alpha carbon. Which is the stronger "
            "acid, and why? Reason from the substituent rather than from a "
            "memorised number."
        ),
        try_it_answer=(
            "Fluoroacetic acid is the stronger. Fluorine is more electronegative "
            "than chlorine, so it withdraws electron density through the sigma "
            "framework more strongly, spreads the carboxylate charge better, and "
            "stabilises the anion more. The measured aqueous pKa values agree, "
            "near 2.59 for fluoroacetic against near 2.87 for chloroacetic, the "
            "more electronegative halogen giving the lower pKa. Chloroacetic "
            "acid is C2H3ClO2 and fluoroacetic acid is C2H3FO2."
        ),
        pitfall=(
            "Two errors sit here. The first is calling the substituent effect a "
            "resonance effect. A chlorine on the alpha carbon has no pi overlap "
            "with the carboxylate; it works by polarising sigma bonds, which is "
            "why the effect dies away so fast that a chlorine three or four "
            "carbons from the carboxyl barely moves the pKa. The second is "
            "reading a larger pKa as a stronger acid. The scale runs backward, "
            "so trichloroacetic at 0.66 is far stronger than acetic at 4.76, and "
            "a lower number always means the stronger acid."
        ),
        claims=(
            Formula(ACETIC_ACID, "C2H4O2", "acetic acid, the reference"),
            Unsaturation(ACETIC_ACID, 1),
            Formula(CHLOROACETIC_ACID, "C2H3ClO2", "chloroacetic acid"),
            Unsaturation(CHLOROACETIC_ACID, 1),
            Formula(CHLOROACETATE, "C2H2ClO2-", "chloroacetate, the withdrawn anion"),
            Formula(DICHLOROACETIC_ACID, "C2H2Cl2O2", "dichloroacetic acid"),
            Unsaturation(DICHLOROACETIC_ACID, 1),
            Formula(TRICHLOROACETIC_ACID, "C2HCl3O2", "trichloroacetic acid"),
            Unsaturation(TRICHLOROACETIC_ACID, 1),
            Formula(FLUOROACETIC_ACID, "C2H3FO2", "fluoroacetic acid"),
            Unsaturation(FLUOROACETIC_ACID, 1),
            Source(
                "Approximate aqueous pKa values at 25 degrees C: acetic acid "
                "4.76, chloroacetic 2.87, dichloroacetic 1.35, trichloroacetic "
                "0.66, fluoroacetic 2.59. They are quoted to order the series by "
                "inductive withdrawal, not as analytical constants.",
                CRC_PKA,
            ),
        ),
    ),
    "ORG2.ACIDSYNTH": Lesson(
        node="ORG2.ACIDSYNTH",
        objective=(
            "Choose a route to a target carboxylic acid among oxidation, "
            "Grignard carboxylation and nitrile hydrolysis, and predict whether "
            "the route changes the carbon count."
        ),
        build_on=(
            "You know the carboxyl carbon is the most oxidised a carbon can be "
            "short of carbon dioxide. Three standard routes reach it, and the "
            "first question a synthesis asks is whether the target has the same "
            "number of carbons as the starting material or one more."
        ),
        core_idea=(
            "Three routes make a carboxylic acid, and they split by what they do "
            "to the carbon count. Oxidation keeps it: a primary alcohol or an "
            "aldehyde oxidises to the acid with the same skeleton, and an "
            "alkylbenzene side chain oxidises down to a benzoic acid at the ring, "
            "so even a longer side chain leaves a single carboxyl on the ring and "
            "the extra carbons are lost. Carboxylation adds one carbon: an alkyl "
            "or aryl halide is turned into a Grignard reagent, that carbon "
            "nucleophile adds to carbon dioxide, and aqueous workup gives an acid "
            "whose new carboxyl carbon came from the carbon dioxide. Nitrile "
            "hydrolysis also adds one carbon: a primary halide is displaced by "
            "cyanide to give a nitrile, installing a new carbon, and full "
            "hydrolysis of that nitrile gives the acid. So the planning move is "
            "to count carbons first. The same count points to oxidation; one "
            "more carbon points to carboxylation or to the nitrile route."
        ),
        worked_example=(
            "Target propanoic acid, CH3CH2COOH, C3H6O2, from bromoethane, "
            "CH3CH2Br, C2H5Br. Count carbons before anything else: the halide "
            "has two, the target has three, so a same carbon oxidation cannot "
            "reach it and a carbon adding route is needed. Two of them work. "
            "Carboxylation turns bromoethane into its Grignard reagent, which "
            "adds to carbon dioxide, and workup gives propanoic acid with the "
            "new carboxyl carbon supplied by the carbon dioxide. The nitrile "
            "route displaces the bromide with cyanide to give propanenitrile, "
            "CH3CH2CN, C3H5N, where the nitrile carbon is the new one, then "
            "hydrolyses that nitrile fully to propanoic acid. Either way two "
            "carbons in become three carbons out. Contrast the oxidation case: "
            "propan-1-ol, CH3CH2CH2OH, C3H8O, already carries three carbons, so "
            "oxidising it to propanoic acid changes the oxidation level without "
            "changing the carbon count."
        ),
        try_it_prompt=(
            "You want butanoic acid, CH3CH2CH2COOH, and your only carbon source "
            "is 1-bromopropane, CH3CH2CH2Br. Will oxidising the matching alcohol "
            "reach it, or do you need a carbon adding route? Decide by counting "
            "carbons."
        ),
        try_it_answer=(
            "1-bromopropane has three carbons and butanoic acid has four, so a "
            "same carbon oxidation cannot reach the target and a carbon adding "
            "route is needed. Convert 1-bromopropane to its Grignard reagent and "
            "add carbon dioxide, or displace the bromide with cyanide to give "
            "butanenitrile, CH3CH2CH2CN, C4H7N, and hydrolyse it. Each installs "
            "the fourth carbon as the carboxyl carbon and gives butanoic acid, "
            "C4H8O2. Oxidation would have worked only from butan-1-ol, which "
            "already has four carbons. 1-bromopropane is C3H7Br."
        ),
        pitfall=(
            "The planning error is losing track of which routes change the "
            "carbon count. Oxidation keeps it, while carboxylation and nitrile "
            "hydrolysis each add one. A student who reaches for oxidation to "
            "build a chain one carbon longer than the starting halide has no atom "
            "to supply the extra carbon and the route cannot close. Count the "
            "carbons in the target and in the starting material first; the "
            "difference tells you whether a carbon adding step is required at all."
        ),
        claims=(
            Formula(BROMOETHANE, "C2H5Br", "bromoethane"),
            Unsaturation(BROMOETHANE, 0),
            Formula(PROPANENITRILE, "C3H5N", "propanenitrile"),
            Unsaturation(PROPANENITRILE, 2, "the carbon to nitrogen triple bond"),
            Formula(PROPANOIC_ACID, "C3H6O2", "propanoic acid"),
            Unsaturation(PROPANOIC_ACID, 1, "the carbonyl pi bond"),
            Formula(PROPAN_1_OL, "C3H8O", "propan-1-ol"),
            Unsaturation(PROPAN_1_OL, 0),
            Formula(BROMOPROPANE_1, "C3H7Br", "1-bromopropane"),
            Unsaturation(BROMOPROPANE_1, 0),
            Formula(BUTANENITRILE, "C4H7N", "butanenitrile"),
            Unsaturation(BUTANENITRILE, 2, "the carbon to nitrogen triple bond"),
            Formula(BUTANOIC_ACID, "C4H8O2", "butanoic acid"),
            Unsaturation(BUTANOIC_ACID, 1),
            Formula(TOLUENE, "C7H8", "toluene, oxidised at the ring to benzoic acid"),
            Unsaturation(TOLUENE, 4, "one ring plus three pi bonds"),
            Formula(BENZOIC_ACID, "C7H6O2", "benzoic acid"),
            Unsaturation(BENZOIC_ACID, 5, "the ring plus the carbonyl"),
        ),
    ),
    "ORG2.NITRILES": Lesson(
        node="ORG2.NITRILES",
        objective=(
            "Recognise the nitrile group, make one by cyanide displacement, and "
            "predict its three products: a carboxylic acid by hydrolysis, a "
            "ketone by Grignard addition, and a primary amine by reduction."
        ),
        build_on=(
            "You already used nitrile hydrolysis as one route to a carboxylic "
            "acid. This lesson turns to the nitrile itself, a single group that "
            "is a branch point to three different products depending on which "
            "nucleophile attacks it."
        ),
        core_idea=(
            "A nitrile is R-C#N, a carbon triple bonded to nitrogen, and that "
            "triple bond adds two degrees of unsaturation. It is usually made by "
            "an SN2 displacement of a primary alkyl halide with cyanide, which "
            "installs the nitrile carbon and lengthens the chain by one. The key "
            "to its reactions is that the nitrile carbon is electrophilic in the "
            "same sense a carbonyl carbon is, because nitrogen is more "
            "electronegative and draws the pi electrons toward itself. Three "
            "nucleophiles add there and give three products. Water, under acid or "
            "base and pushed to completion, hydrolyses the nitrile through an "
            "amide to a carboxylic acid, and the nitrogen leaves as ammonia or "
            "ammonium. One equivalent of a Grignard reagent adds to the nitrile "
            "carbon, and aqueous workup turns the resulting carbon to nitrogen "
            "double bond into a carbon to oxygen double bond, giving a ketone. A "
            "reducing agent adds hydrogen across the triple bond and gives a "
            "primary amine that keeps the original nitrogen. One nitrile, three "
            "destinations: acid, ketone, or amine."
        ),
        worked_example=(
            "Start from acetonitrile, CH3CN, C2H3N, with two degrees of "
            "unsaturation from the triple bond, and send it down each path. "
            "Hydrolysis turns the nitrile carbon into a carboxyl and gives acetic "
            "acid, CH3COOH, C2H4O2, passing through acetamide, CH3CONH2, C2H5NO, "
            "before the nitrogen departs. Grignard addition of one equivalent of "
            "a methyl reagent, then aqueous workup, gives acetone, CH3COCH3, "
            "C3H6O, a ketone: notice the carbon count rose from two to three "
            "because the Grignard delivered a carbon of its own. Reduction adds "
            "hydrogen across the triple bond and gives ethylamine, CH3CH2NH2, "
            "C2H7N, a primary amine that keeps the nitrogen the nitrile started "
            "with. The same two carbon nitrile has produced a carboxylic acid, a "
            "three carbon ketone, and a primary amine, and only the Grignard "
            "route changed the carbon count."
        ),
        try_it_prompt=(
            "Propanenitrile is CH3CH2CN. Give the product and its molecular "
            "formula for complete hydrolysis and for reduction with a hydride "
            "reagent, and say whether each keeps the nitrogen."
        ),
        try_it_answer=(
            "Complete hydrolysis turns the nitrile carbon into a carboxyl and "
            "gives propanoic acid, CH3CH2COOH, C3H6O2; the nitrogen leaves as "
            "ammonia or ammonium, so it is not kept. Reduction adds hydrogen "
            "across the triple bond and gives propylamine, CH3CH2CH2NH2, C3H9N, "
            "a primary amine that keeps the nitrogen. Both begin from "
            "propanenitrile, C3H5N: hydrolysis trades the nitrogen for two "
            "oxygens, while reduction keeps the nitrogen and adds hydrogens."
        ),
        pitfall=(
            "Two beliefs mislead here. The first is that the nitrile carbon is "
            "unreactive because it looks locked inside a triple bond; in fact it "
            "is electrophilic like a carbonyl carbon, which is why water, "
            "Grignard reagents and hydride all add to it. The second is "
            "expecting the nitrogen to survive hydrolysis. Hydrolysis does not "
            "stop at the amide unless it is deliberately halted; pushed to "
            "completion it expels the nitrogen and leaves a carboxylic acid, so "
            "a route written R-CN to R-COOH loses the nitrogen it began with."
        ),
        claims=(
            Formula(ACETONITRILE, "C2H3N", "acetonitrile"),
            Unsaturation(ACETONITRILE, 2, "the carbon to nitrogen triple bond"),
            Formula(ACETIC_ACID, "C2H4O2", "acetic acid, from hydrolysis"),
            Unsaturation(ACETIC_ACID, 1),
            Formula(ACETAMIDE, "C2H5NO", "acetamide, the hydrolysis intermediate"),
            Unsaturation(ACETAMIDE, 1, "the amide carbonyl"),
            Formula(ACETONE, "C3H6O", "acetone, from the Grignard route"),
            Unsaturation(ACETONE, 1, "the ketone carbonyl"),
            Formula(ETHYLAMINE, "C2H7N", "ethylamine, from reduction"),
            Unsaturation(ETHYLAMINE, 0),
            Formula(PROPANENITRILE, "C3H5N", "propanenitrile"),
            Unsaturation(PROPANENITRILE, 2, "the carbon to nitrogen triple bond"),
            Formula(PROPANOIC_ACID, "C3H6O2", "propanoic acid, from hydrolysis"),
            Unsaturation(PROPANOIC_ACID, 1),
            Formula(PROPYLAMINE, "C3H9N", "propylamine, from reduction"),
            Unsaturation(PROPYLAMINE, 0),
        ),
    ),
    "ORG2.ACIDSPECTRA": Lesson(
        node="ORG2.ACIDSPECTRA",
        objective=(
            "Identify a carboxylic acid and a nitrile from their infrared "
            "spectra using the broad O-H stretch, the carbonyl band and the "
            "sharp nitrile stretch, and confirm the acid with its far downfield "
            "1H NMR signal."
        ),
        build_on=(
            "You read the carbonyl and O-H regions of an infrared spectrum in "
            "the structure determination unit. Carboxylic acids and nitriles "
            "each carry a signature band that separates them from the ketones, "
            "alcohols and alkynes they might be confused with."
        ),
        core_idea=(
            "A carboxylic acid announces itself with two infrared features at "
            "once. The hydrogen bonded acid dimer gives a very broad O-H stretch "
            "running from roughly 2500 to 3300 cm-1 that sits on top of the C-H "
            "stretches, and the carbonyl gives a strong band near 1700 to 1725 "
            "cm-1. That extremely broad O-H is unlike the rounded band of an "
            "alcohol and belongs to almost no other common group, so the pair "
            "together is diagnostic. A nitrile shows neither an O-H nor a "
            "carbonyl. Instead it gives a sharp, medium intensity carbon to "
            "nitrogen triple bond stretch near 2210 to 2260 cm-1, in a region of "
            "the spectrum where almost nothing else absorbs, so a lone sharp band "
            "there is a near certain nitrile; a carbon to carbon triple bond "
            "falls nearby but is often weak or absent. Proton NMR then confirms "
            "an acid from the other end of the chart: the carboxylic acid O-H "
            "hydrogen resonates very far downfield, near 10 to 13 ppm, further "
            "than almost any other proton."
        ),
        worked_example=(
            "Compare acetic acid, C2H4O2, with acetonitrile, C2H3N, two carbon "
            "molecules that the infrared spectrum tells apart at a glance. "
            "Acetic acid has one degree of unsaturation, the carbonyl. Its "
            "spectrum shows the very broad 2500 to 3300 cm-1 O-H spread across "
            "the C-H region and a strong band near 1710 cm-1, and its proton "
            "spectrum has two environments in a 3 to 1 ratio, the methyl and the "
            "single acidic O-H far downfield. Acetonitrile has two degrees of "
            "unsaturation from the triple bond. Its spectrum shows nothing above "
            "3000 cm-1 and no carbonyl, only the sharp carbon to nitrogen band "
            "near 2250 cm-1, and its three hydrogens are one environment, a "
            "single methyl signal. So without weighing any exact number, the "
            "shape of the spectrum decides: a broad O-H with a carbonyl names the "
            "acid, and a lone sharp band near 2250 cm-1 names the nitrile."
        ),
        try_it_prompt=(
            "An unknown is either propanoic acid, CH3CH2COOH, or propanenitrile, "
            "CH3CH2CN. Its infrared spectrum has a sharp band near 2250 cm-1, "
            "nothing broad above 3000 cm-1, and no strong band near 1700 cm-1. "
            "Which compound is it, and how many proton environments should it "
            "show?"
        ),
        try_it_answer=(
            "It is propanenitrile. The sharp band near 2250 cm-1 is the carbon "
            "to nitrogen triple bond stretch, and the absence of any broad O-H "
            "from 2500 to 3300 cm-1 and of a carbonyl band near 1700 cm-1 rules "
            "out the carboxylic acid. Propanenitrile has two proton "
            "environments, the CH3 and the CH2, in a 3 to 2 ratio. Propanoic "
            "acid would instead have shown the very broad acid O-H over a strong "
            "carbonyl band and three environments in a 3 to 2 to 1 ratio, with "
            "the acidic hydrogen far downfield near 10 to 13 ppm. Propanenitrile "
            "is C3H5N and propanoic acid is C3H6O2."
        ),
        pitfall=(
            "One habit is reading any strong band near 1700 cm-1 as the mark of "
            "a carboxylic acid and stopping. A ketone absorbs there too, so the "
            "carbonyl band alone does not name an acid; the very broad O-H "
            "spilling across the C-H region is what does. The opposite habit "
            "loses the nitrile: its band is only medium in height, so a reader "
            "hunting for tall peaks skims past it. The nitrile stretch earns its "
            "keep by position, not height, sitting near 2250 cm-1 in a window "
            "where nothing else appears, so its location is worth more than its "
            "intensity."
        ),
        claims=(
            Formula(ACETIC_ACID, "C2H4O2", "acetic acid"),
            Unsaturation(ACETIC_ACID, 1, "the carbonyl pi bond"),
            Environments(ACETIC_ACID, (3, 1), "the methyl and the acidic O-H"),
            Formula(ACETONITRILE, "C2H3N", "acetonitrile"),
            Unsaturation(ACETONITRILE, 2, "the carbon to nitrogen triple bond"),
            Environments(ACETONITRILE, (3,), "one methyl environment"),
            Formula(PROPANOIC_ACID, "C3H6O2", "propanoic acid"),
            Unsaturation(PROPANOIC_ACID, 1),
            Environments(PROPANOIC_ACID, (3, 2, 1), "methyl, methylene, acidic O-H"),
            Formula(PROPANENITRILE, "C3H5N", "propanenitrile"),
            Unsaturation(PROPANENITRILE, 2, "the carbon to nitrogen triple bond"),
            Environments(PROPANENITRILE, (3, 2), "methyl and methylene"),
            Source(
                "Approximate infrared bands: carboxylic acid dimer O-H very "
                "broad from about 2500 to 3300 cm-1 overlapping the C-H "
                "stretches; carboxylic acid carbonyl about 1700 to 1725 cm-1; "
                "carbon to nitrogen triple bond about 2210 to 2260 cm-1, sharp "
                "and of medium intensity. These are ranges from correlation "
                "charts, not values this repository can derive.",
                SILVERSTEIN,
            ),
            Source(
                "The carboxylic acid O-H hydrogen resonates far downfield in the "
                "1H NMR, about 10 to 13 ppm, and its exact position varies with "
                "concentration, solvent and temperature.",
                PAVIA,
            ),
        ),
    ),
}
