"""ORG2 Unit 10: Biomolecules and Synthesis Strategy.

This is where the stereochemistry of Unit 4 and the reactions of the whole
course are cashed in on real molecules. The natural amino acids are single
enantiomers, sugars are stacks of stereocentres, and a peptide or a glycoside
or an ester is a condensation that a machine can check by counting atoms across
the loss of water. Every such fact here carries a claim that RDKit re-derives:
L-alanine is asserted to be S only because the structure is S, glycine is
asserted achiral only because it has no stereocentre, and each condensation's
water loss is written as formulas that must add up.

The two synthesis-strategy nodes close the course by teaching how to plan
rather than how to react. Their disconnections are drawn on the course's own
earlier chemistry, esters, Grignard additions, oxidations, so the reagent
equivalents are reactions the learner has already met.
"""

from __future__ import annotations

from app.data.claims import Formula, Relationship, Source, Stereo, Unsaturation
from app.data.lesson_types import Lesson

# Carbohydrates. Descriptors were read back from RDKit rather than reasoned out;
# the open chain has four stereocentres and each pyranose has five, the fifth
# being the anomeric carbon created when the ring closes.
GLUCOSE_OPEN = "OC[C@@H](O)[C@@H](O)[C@H](O)[C@@H](O)C=O"
ALPHA_GLUCOPYRANOSE = "OC[C@H]1O[C@H](O)[C@H](O)[C@@H](O)[C@@H]1O"
BETA_GLUCOPYRANOSE = "OC[C@H]1O[C@@H](O)[C@H](O)[C@@H](O)[C@@H]1O"
GLUCITOL = "OCC(O)C(O)C(O)C(O)CO"
GLUCONIC_ACID = "OCC(O)C(O)C(O)C(O)C(=O)O"
METHYL_GLUCOSIDE = "COC1O[C@H](CO)[C@@H](O)[C@H](O)[C@@H]1O"

# Amino acids and peptides.
GLYCINE = "NCC(=O)O"
L_ALANINE = "N[C@@H](C)C(=O)O"
D_ALANINE = "N[C@H](C)C(=O)O"
GLYCYLGLYCINE = "NCC(=O)NCC(=O)O"

# Lipids and terpenes.
PALMITIC_ACID = "CCCCCCCCCCCCCCCC(=O)O"
OLEIC_ACID = "CCCCCCCC/C=C\\CCCCCCCC(=O)O"
GLYCEROL = "OCC(O)CO"
ISOPRENE = "CC(=C)C=C"

# Nucleic acid bases.
ADENINE = "Nc1ncnc2[nH]cnc12"
GUANINE = "Nc1nc2[nH]cnc2c(=O)[nH]1"
CYTOSINE = "Nc1cc[nH]c(=O)n1"
THYMINE = "Cc1c[nH]c(=O)[nH]c1=O"
URACIL = "O=c1cc[nH]c(=O)[nH]1"

# Synthesis-strategy worked molecules.
ETHANOL = "CCO"
ACETALDEHYDE = "CC=O"
ACETIC_ACID = "CC(=O)O"
ETHYL_ACETATE = "CCOC(=O)C"
CYCLOHEXANONE = "O=C1CCCCC1"
CYCLOHEXANONE_ACETAL = "C1CCC2(CC1)OCCO2"

CRC = (
    "CRC Handbook of Chemistry and Physics, tables of dissociation constants "
    "of amino acids and organic acids, aqueous solution at 25 degrees Celsius."
)
CLAYDEN = (
    "Clayden, J., Greeves, N. and Warren, S., Organic Chemistry, 2nd edition, "
    "Oxford University Press, 2012, chapters on biological molecules."
)
WARREN = (
    "Warren, S. and Wyatt, P., Organic Synthesis: The Disconnection Approach, "
    "2nd edition, Wiley, 2008."
)
GREENE = (
    "Wuts, P. G. M. and Greene, T. W., Greene's Protective Groups in Organic "
    "Synthesis, 4th edition, Wiley, 2007."
)

LESSONS_ORG2_U10 = {
    "ORG2.CARBOHYDRATES": Lesson(
        node="ORG2.CARBOHYDRATES",
        objective=(
            "Explain how an open-chain sugar closes to a ring, identify the "
            "anomeric carbon it creates, and say what mutarotation interconverts."
        ),
        build_on=(
            "You can count stereocentres and tell diastereomers apart. A sugar "
            "is that skill applied to a molecule with several stereocentres at "
            "once, plus one new twist: closing the ring makes a stereocentre "
            "that was not there before."
        ),
        core_idea=(
            "Glucose in its open-chain form is an aldohexose with an aldehyde at "
            "one end and hydroxyls down the chain, and it has four stereocentres. "
            "In solution the chain curls so that one hydroxyl reaches the "
            "aldehyde carbon and adds to it, forming a six-membered ring, the "
            "pyranose. That addition turns the flat, achiral aldehyde carbon "
            "into a fifth stereocentre, called the anomeric carbon. Because the "
            "new hydroxyl on it can point two ways, ring closure gives two "
            "diastereomers, the alpha and beta anomers, which differ only at "
            "that one carbon. Mutarotation is the slow interconversion of the "
            "two anomers, running through a trace of the open chain, until an "
            "equilibrium mixture is reached; it is why a freshly dissolved pure "
            "anomer's optical rotation drifts to a steady value."
        ),
        worked_example=(
            "Count the stereocentres to see the anomeric carbon appear. "
            "Open-chain D-glucose, OC[C@@H](O)[C@@H](O)[C@H](O)[C@@H](O)C=O, is "
            "C6H12O6 and RDKit finds four stereocentres, R, R, S, R along the "
            "chain, with the terminal aldehyde carbon not among them. Close the "
            "ring to alpha-D-glucopyranose or beta-D-glucopyranose, both still "
            "C6H12O6, and each now has five stereocentres: the former aldehyde "
            "carbon has become the anomeric centre. The alpha and beta forms "
            "are the same in four of five configurations and differ only at the "
            "anomeric carbon, so they are diastereomers, specifically anomers, "
            "and RDKit confirms that relationship."
        ),
        try_it_prompt=(
            "Open-chain glucose has four stereocentres, but each cyclic anomer "
            "has five. Where did the fifth come from, and what makes the alpha "
            "and beta forms different?"
        ),
        try_it_answer=(
            "The fifth stereocentre is the anomeric carbon: the aldehyde carbon, "
            "flat and achiral in the open chain, becomes a stereocentre when a "
            "hydroxyl adds to it on ring closure. Alpha and beta differ only in "
            "which face that new hydroxyl ends up on, so they are diastereomers "
            "at that single carbon."
        ),
        pitfall=(
            "The trap is thinking the alpha and beta anomers are different "
            "compounds with different formulas or that mutarotation changes the "
            "molecule's constitution. Both are C6H12O6, both are glucose, and "
            "mutarotation only flips the configuration at one carbon by way of "
            "the open chain. They are diastereomers, not constitutional isomers."
        ),
        claims=(
            Formula(GLUCOSE_OPEN, "C6H12O6", "open-chain D-glucose"),
            Stereo(GLUCOSE_OPEN, ("R", "R", "S", "R"), "four stereocentres in the open chain"),
            Formula(ALPHA_GLUCOPYRANOSE, "C6H12O6", "alpha-D-glucopyranose"),
            Formula(BETA_GLUCOPYRANOSE, "C6H12O6", "beta-D-glucopyranose"),
            Stereo(
                BETA_GLUCOPYRANOSE, ("R", "R", "R", "S", "S"),
                "five stereocentres once the ring closes, the extra one anomeric",
            ),
            Relationship(
                ALPHA_GLUCOPYRANOSE, BETA_GLUCOPYRANOSE, "diastereomers",
                "anomers, differing only at the anomeric carbon",
            ),
        ),
    ),
    "ORG2.CARBREACTIONS": Lesson(
        node="ORG2.CARBREACTIONS",
        objective=(
            "Track the atom bookkeeping of reducing, oxidising and glycosylating "
            "a sugar, and say why a glycoside no longer behaves as a reducing "
            "sugar."
        ),
        build_on=(
            "You know a sugar carries an aldehyde in equilibrium with its ring. "
            "That aldehyde is the reactive handle, and reduction, oxidation and "
            "glycoside formation are three things you can do to it."
        ),
        core_idea=(
            "Three transformations, each readable as a change in formula. "
            "Reduction turns the aldehyde into a primary alcohol, adding two "
            "hydrogens and converting the sugar to a sugar alcohol, an alditol. "
            "Oxidation does the opposite at that carbon, taking the aldehyde up "
            "to a carboxylic acid and adding one oxygen, giving an aldonic acid. "
            "The ability to be oxidised this way is what defines a reducing "
            "sugar, the property Tollens' and Fehling's tests report. Glycoside "
            "formation is different: the anomeric hydroxyl reacts with an "
            "alcohol to make an acetal, the glycoside, expelling water. Once the "
            "anomeric carbon is locked as a full acetal it can no longer open to "
            "the aldehyde, so a glycoside neither mutarotates nor acts as a "
            "reducing sugar."
        ),
        worked_example=(
            "Do the bookkeeping on D-glucose, C6H12O6. Reduce it and the "
            "aldehyde becomes a primary alcohol: the product is the alditol "
            "glucitol, C6H14O6, two hydrogens heavier and now with no degree of "
            "unsaturation. Oxidise the same aldehyde instead and it becomes a "
            "carboxylic acid: gluconic acid, C6H12O7, one oxygen heavier. Now "
            "glycosylate with methanol, CH4O. The anomeric hydroxyl and the "
            "methanol combine and water leaves: C6H12O6 plus CH4O is C7H16O7, "
            "and removing H2O gives methyl glucoside, C7H14O6. That is a full "
            "acetal, so it is locked shut and no longer reduces Tollens' reagent."
        ),
        try_it_prompt=(
            "Methyl glucoside and glucose both contain the sugar ring, yet only "
            "glucose gives a positive Tollens' test. What structural difference "
            "explains it?"
        ),
        try_it_answer=(
            "Glucose's anomeric carbon can open to the free aldehyde, and it is "
            "that aldehyde Tollens' reagent oxidises. In methyl glucoside the "
            "anomeric carbon is capped as an acetal by the methyl group, so it "
            "cannot open to an aldehyde, and with no aldehyde there is nothing "
            "to reduce the reagent."
        ),
        pitfall=(
            "The trap is treating glycoside formation as though it kept the "
            "sugar a reducing sugar. Making the glycoside consumes the very "
            "aldehyde equilibrium the reducing tests depend on. A free anomeric "
            "hydroxyl is a reducing sugar; the same carbon as an O-linked "
            "acetal is not."
        ),
        claims=(
            Formula(GLUCOSE_OPEN, "C6H12O6", "D-glucose"),
            Formula(GLUCITOL, "C6H14O6", "glucitol, the reduction product"),
            Unsaturation(GLUCITOL, 0, "the aldehyde is gone"),
            Formula(GLUCONIC_ACID, "C6H12O7", "gluconic acid, the oxidation product"),
            Unsaturation(GLUCONIC_ACID, 1, "the new carboxyl"),
            Formula(METHYL_GLUCOSIDE, "C7H14O6", "methyl glucoside, glucose plus methanol minus water"),
            Source(
                "A reducing sugar has an anomeric carbon able to open to a free "
                "aldehyde or alpha-hydroxy ketone and so reduces Tollens' and "
                "Fehling's reagents; a glycoside, in which that carbon is a full "
                "acetal, does not reduce them and does not mutarotate.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.AMINOACIDS": Lesson(
        node="ORG2.AMINOACIDS",
        objective=(
            "Assign the configuration of a natural amino acid, recognise glycine "
            "as the achiral exception, and locate the isoelectric point from the "
            "two pKa values that flank the zwitterion."
        ),
        build_on=(
            "This is the payoff for Unit 4. You can assign R and S, and you know "
            "an internal symmetry can leave a molecule achiral. Amino acids are "
            "where those tools land on the molecules life is built from."
        ),
        core_idea=(
            "An amino acid carries an amino group and a carboxylic acid on the "
            "same carbon, the alpha carbon, along with a hydrogen and a side "
            "chain. When the four groups differ, the alpha carbon is a "
            "stereocentre, and the natural amino acids are almost all the L "
            "configuration, which for alanine is S. The exception is glycine, "
            "whose side chain is just a hydrogen: its alpha carbon then carries "
            "two hydrogens, so it is not a stereocentre and glycine is achiral. "
            "In water the amino group is protonated and the acid deprotonated at "
            "the same time, giving a zwitterion with both a positive and a "
            "negative charge and no net charge. The pH at which the molecule is "
            "on average neutral is the isoelectric point, and for a simple amino "
            "acid it is the average of the two pKa values on either side of the "
            "zwitterion."
        ),
        worked_example=(
            "Take L-alanine, N[C@@H](C)C(=O)O. Its alpha carbon bears an amino "
            "group, a carboxyl, a methyl and a hydrogen, four different groups, "
            "so it is a stereocentre, and RDKit assigns it S, the natural L "
            "form. Compare glycine, NCC(=O)O, C2H5NO2: replace the methyl with a "
            "hydrogen and the alpha carbon now holds two hydrogens, so it is not "
            "a stereocentre and glycine is achiral, as the structure confirms "
            "with zero stereocentres. For the isoelectric point of glycine, its "
            "carboxyl has pKa about 2.34 and its ammonium about 9.60; the "
            "zwitterion dominates between them, and the isoelectric point is "
            "their average, near 5.97."
        ),
        try_it_prompt=(
            "Alanine has a stereocentre and exists as L and D forms, but glycine "
            "has neither. Why is glycine the exception, and what is the "
            "relationship between L- and D-alanine?"
        ),
        try_it_answer=(
            "Glycine's side chain is a hydrogen, so its alpha carbon carries two "
            "identical hydrogens and is not a stereocentre; with no stereocentre "
            "there is no handedness. Alanine's side chain is a methyl, so its "
            "alpha carbon has four different groups and is chiral, and L- and "
            "D-alanine are enantiomers, non-superimposable mirror images."
        ),
        pitfall=(
            "The trap is assuming every amino acid is chiral because most are. "
            "Glycine is achiral, and asserting a configuration for it is "
            "asserting a stereocentre that does not exist. Check that the side "
            "chain differs from a hydrogen before you reach for R or S."
        ),
        claims=(
            Stereo(L_ALANINE, ("S",), "L-alanine is S, the natural configuration"),
            Formula(L_ALANINE, "C3H7NO2", "alanine"),
            Stereo(GLYCINE, (), "glycine has no stereocentre, so it is achiral"),
            Formula(GLYCINE, "C2H5NO2", "glycine"),
            Relationship(L_ALANINE, D_ALANINE, "enantiomers", "the L and D forms of alanine"),
            Source(
                "Glycine aqueous pKa values are about 2.34 for the carboxyl and "
                "9.60 for the ammonium, giving an isoelectric point near 5.97; "
                "alanine is similar with pKa values near 2.34 and 9.69 and an "
                "isoelectric point near 6.0.",
                CRC,
            ),
        ),
    ),
    "ORG2.PEPTIDES": Lesson(
        node="ORG2.PEPTIDES",
        objective=(
            "Account for the atoms lost when two amino acids form a peptide "
            "bond, and explain why solid-phase synthesis leans on protecting "
            "groups."
        ),
        build_on=(
            "You know an amino acid has an acid at one end and an amine at the "
            "other, and you have seen a condensation lose water. A peptide is "
            "that condensation run between two amino acids, then repeated."
        ),
        core_idea=(
            "A peptide bond is an amide: the carboxyl of one amino acid joins "
            "the amino group of the next, and a molecule of water leaves. The "
            "bond that forms is planar and only rotates with difficulty, because "
            "the nitrogen lone pair is delocalised onto the carbonyl, giving the "
            "amide partial double-bond character. A chain has direction, written "
            "from the free amino end to the free carboxyl end. The problem in "
            "building one deliberately is selectivity: every amino acid has both "
            "an acid and an amine, so left unmanaged they would couple in every "
            "direction at once. Solid-phase synthesis solves it by anchoring the "
            "growing chain to a resin bead and keeping every reactive group "
            "except the one intended to react blocked by a protecting group, "
            "unblocking one at a time so each coupling adds exactly one residue "
            "in the intended orientation."
        ),
        worked_example=(
            "Join two glycines. Glycine is NCC(=O)O, C2H5NO2, so two of them "
            "together are C4H10N2O4. Forming the peptide bond expels one water, "
            "H2O, and the product is glycylglycine, NCC(=O)NCC(=O)O: subtract "
            "H2O from C4H10N2O4 and you get C4H8N2O3, which is what the "
            "structure gives. It has two degrees of unsaturation, one for each "
            "carbonyl, the original acid's and the new amide's. The single water "
            "lost per bond is the through-line of all peptide growth: an "
            "n-residue chain forms by losing n minus one waters."
        ),
        try_it_prompt=(
            "Two glycine molecules are C4H10N2O4 together. The dipeptide "
            "glycylglycine is C4H8N2O3. What accounts for the missing H2O, and "
            "how many waters are lost making a tripeptide from three amino acids?"
        ),
        try_it_answer=(
            "The missing water is the condensation: forming the amide bond "
            "expels one H2O, taking C4H10N2O4 to C4H8N2O3. A tripeptide has two "
            "peptide bonds, so it loses two waters, one per bond, following the "
            "n minus one rule for n residues."
        ),
        pitfall=(
            "The trap is imagining the two amino acids simply stick together "
            "with no atoms lost, so that the dipeptide's formula is just the sum "
            "of the parts. Every amide bond made is a water removed; forgetting "
            "it overcounts the hydrogens and oxygens of every peptide."
        ),
        claims=(
            Formula(GLYCINE, "C2H5NO2", "glycine, one residue"),
            Formula(GLYCYLGLYCINE, "C4H8N2O3", "glycylglycine, two glycines minus one water"),
            Unsaturation(GLYCYLGLYCINE, 2, "the acid carbonyl and the new amide carbonyl"),
            Stereo(L_ALANINE, ("S",), "residues keep their L configuration in the chain"),
            Source(
                "Solid-phase peptide synthesis anchors the growing chain to an "
                "insoluble resin and uses temporary protecting groups on the "
                "amino terminus and reactive side chains, removed one at a time, "
                "so that each coupling extends the chain by a single residue in "
                "a defined direction.",
                GREENE,
            ),
        ),
    ),
    "ORG2.LIPIDS": Lesson(
        node="ORG2.LIPIDS",
        objective=(
            "Distinguish a saturated from an unsaturated fatty acid by degree of "
            "unsaturation, describe how a triglyceride is assembled, and state "
            "the isoprene rule for terpenes."
        ),
        build_on=(
            "You can read a degree of unsaturation from a formula and you know "
            "an ester is a condensation. Fats and terpenes are those ideas at "
            "the scale of the molecules that store energy and scent."
        ),
        core_idea=(
            "A fatty acid is a long carboxylic acid chain. When the chain is all "
            "single bonds it is saturated, and its only degree of unsaturation "
            "is the carboxyl; each carbon to carbon double bond adds one more "
            "and makes it unsaturated, which is why unsaturated fats pack less "
            "tightly and melt lower. A triglyceride, the storage form of fat, is "
            "glycerol esterified with three fatty acids, so it is built by three "
            "ester condensations and loses three molecules of water. Terpenes, "
            "the other great lipid family, are put together on a different plan: "
            "the isoprene rule says their carbon skeletons are assembled from "
            "five-carbon isoprene units, so a terpene's carbon count comes in "
            "multiples of five, ten for a monoterpene, fifteen for a "
            "sesquiterpene, and so on."
        ),
        worked_example=(
            "Compare two sixteen-and-eighteen-carbon acids. Palmitic acid, "
            "CCCCCCCCCCCCCCCC(=O)O, is C16H32O2 with one degree of unsaturation, "
            "the carboxyl alone, so it is fully saturated. Oleic acid, "
            "C18H34O2, has two degrees of unsaturation, the carboxyl plus one "
            "carbon to carbon double bond, so it is monounsaturated, and that "
            "single cis double bond is enough to lower its melting point below "
            "the saturated acids. For the terpene side, isoprene is CC(=C)C=C, "
            "C5H8, two degrees of unsaturation from its two double bonds; strung "
            "together head to tail its five-carbon units build the terpene "
            "skeletons, always in multiples of five carbons."
        ),
        try_it_prompt=(
            "Palmitic acid is C16H32O2 and oleic acid is C18H34O2. Beyond the "
            "two extra carbons, what does the difference in hydrogen count tell "
            "you about oleic acid's structure?"
        ),
        try_it_answer=(
            "Oleic acid is short of the hydrogens a fully saturated C18 acid "
            "would have, which signals a ring or a double bond. It has one "
            "carbon to carbon double bond: its two degrees of unsaturation are "
            "the carboxyl and that one alkene, making it a monounsaturated "
            "fatty acid, against palmitic acid's single degree from the "
            "carboxyl alone."
        ),
        pitfall=(
            "The trap is counting a fatty acid's carboxyl as if the molecule "
            "were saturated whenever the chain looks long and simple. The "
            "carboxyl already accounts for one degree of unsaturation; any "
            "degree beyond one is a double bond in the chain, and missing that "
            "calls an unsaturated fat saturated."
        ),
        claims=(
            Formula(PALMITIC_ACID, "C16H32O2", "palmitic acid, saturated"),
            Unsaturation(PALMITIC_ACID, 1, "the carboxyl only"),
            Formula(OLEIC_ACID, "C18H34O2", "oleic acid, monounsaturated"),
            Unsaturation(OLEIC_ACID, 2, "the carboxyl plus one carbon to carbon double bond"),
            Formula(GLYCEROL, "C3H8O3", "glycerol, the backbone of a triglyceride"),
            Formula(ISOPRENE, "C5H8", "isoprene, the five-carbon terpene unit"),
            Unsaturation(ISOPRENE, 2, "its two carbon to carbon double bonds"),
            Source(
                "The isoprene rule: terpene carbon skeletons are built from "
                "five-carbon isoprene units joined largely head to tail, so "
                "terpene carbon counts are multiples of five.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.NUCLEICACIDS": Lesson(
        node="ORG2.NUCLEICACIDS",
        objective=(
            "Separate the purine from the pyrimidine bases by ring count, state "
            "the base-pairing rule and its hydrogen-bond count, and describe the "
            "phosphodiester backbone."
        ),
        build_on=(
            "You know an aromatic heterocycle from Unit 9 and you have counted "
            "degrees of unsaturation. Nucleic acid bases are heterocycles, and "
            "their ring count is what sorts them into two families."
        ),
        core_idea=(
            "The bases come in two shapes. The purines, adenine and guanine, are "
            "bicyclic, a six-membered ring fused to a five-membered one, and "
            "carry six degrees of unsaturation. The pyrimidines, cytosine, "
            "thymine and uracil, are a single six-membered ring with four "
            "degrees of unsaturation. A nucleoside attaches a base to a sugar at "
            "the anomeric carbon, and a nucleotide adds a phosphate to the "
            "sugar. The strand is held together by a phosphodiester backbone: "
            "each phosphate bridges the sugar of one nucleotide to the sugar of "
            "the next, giving the chain a direction. The two strands are held to "
            "each other by base pairing, and the rule is specific: adenine "
            "pairs with thymine through two hydrogen bonds, guanine pairs with "
            "cytosine through three, always a purine opposite a pyrimidine so "
            "the rungs are a constant width."
        ),
        worked_example=(
            "Sort the bases by degree of unsaturation. Adenine, Nc1ncnc2[nH]cnc12, "
            "is C5H5N5 with six degrees of unsaturation, the mark of a fused "
            "bicyclic purine; guanine, C5H5N5O, is likewise six. Cytosine, "
            "C4H5N3O, has four degrees of unsaturation, a single pyrimidine "
            "ring, and thymine, C5H6N2O2, is also four. So the degree of "
            "unsaturation alone splits purines, at six, from pyrimidines, at "
            "four. The pairing then keeps the geometry uniform: adenine, a "
            "purine, hydrogen-bonds to thymine, a pyrimidine, with two bonds, "
            "and guanine to cytosine with three."
        ),
        try_it_prompt=(
            "Adenine is C5H5N5 with six degrees of unsaturation and cytosine is "
            "C4H5N3O with four. What does that difference in unsaturation tell "
            "you about their ring systems, and which pairs with which?"
        ),
        try_it_answer=(
            "Adenine's six degrees of unsaturation mark it as a fused bicyclic "
            "purine, while cytosine's four mark it as a single-ring pyrimidine. "
            "In the double helix a purine always pairs with a pyrimidine: "
            "adenine pairs with thymine by two hydrogen bonds, and guanine with "
            "cytosine by three."
        ),
        pitfall=(
            "The trap is mixing up the pairs or the bond counts, and the ring "
            "shapes are the anchor that prevents it. A purine is bicyclic and "
            "always faces a monocyclic pyrimidine across the helix; guanine and "
            "cytosine share three hydrogen bonds, adenine and thymine two, never "
            "purine against purine."
        ),
        claims=(
            Formula(ADENINE, "C5H5N5", "adenine, a purine"),
            Unsaturation(ADENINE, 6, "the fused bicyclic purine ring system"),
            Formula(GUANINE, "C5H5N5O", "guanine, a purine"),
            Formula(CYTOSINE, "C4H5N3O", "cytosine, a pyrimidine"),
            Unsaturation(CYTOSINE, 4, "the single pyrimidine ring"),
            Formula(THYMINE, "C5H6N2O2", "thymine, a pyrimidine"),
            Formula(URACIL, "C4H4N2O2", "uracil, thymine's RNA counterpart"),
            Source(
                "Watson-Crick base pairing: adenine pairs with thymine through "
                "two hydrogen bonds and guanine pairs with cytosine through "
                "three, a purine always opposite a pyrimidine; the strands are "
                "joined by a phosphodiester backbone linking the sugars.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.RETROSYNTHESIS": Lesson(
        node="ORG2.RETROSYNTHESIS",
        objective=(
            "Disconnect a target at a strategic bond, name the synthons it "
            "implies, and give the real reagent equivalents from reactions "
            "already learned."
        ),
        build_on=(
            "You have run many reactions forward. Retrosynthesis runs the "
            "thinking backward: instead of asking what a reagent does, you ask "
            "what target you want and which bond to break to simplify it."
        ),
        core_idea=(
            "Retrosynthetic analysis works a target backward toward simpler "
            "starting materials. The central move is the disconnection: you "
            "choose a bond and break it on paper, and the open arrow of "
            "retrosynthesis points from the target to the fragments. Those "
            "fragments are drawn as synthons, idealised charged pieces, one "
            "electron-poor and one electron-rich, that capture which partner "
            "should be the electrophile and which the nucleophile. A synthon is "
            "usually not a real substance, so each is matched to a reagent "
            "equivalent, an actual compound that behaves like it. The skill is "
            "picking disconnections at bonds you already know how to make "
            "forward, so that every synthon has a reagent equivalent among the "
            "course's own reactions: esterifications, Grignard additions, "
            "ether and amide formations."
        ),
        worked_example=(
            "Disconnect an ester. Ethyl acetate, CCOC(=O)C, is C4H8O2. The "
            "strategic bond is the one between the acyl carbon and the ester "
            "oxygen. Breaking it gives two synthons: an acyl cation, "
            "electron-poor, and an alkoxide, electron-rich. Their reagent "
            "equivalents are ones you have used: the acyl cation stands for "
            "acetic acid or one of its activated derivatives, CC(=O)O, C2H4O2, "
            "and the alkoxide stands for ethanol, CCO, C2H6O. Read forward, that "
            "is the esterification you already know: acetic acid plus ethanol, "
            "losing water, gives ethyl acetate. Check the atoms: C2H4O2 plus "
            "C2H6O is C4H10O3, and minus H2O is C4H8O2, the ester."
        ),
        try_it_prompt=(
            "You disconnect ethyl acetate at the acyl carbon to oxygen bond into "
            "an acyl cation and an alkoxide synthon. What real reagents are those "
            "synthons standing in for, and what is lost when they combine "
            "forward?"
        ),
        try_it_answer=(
            "The acyl cation synthon stands for acetic acid or an activated acyl "
            "derivative, C2H4O2, and the alkoxide synthon stands for ethanol, "
            "C2H6O. Combined forward they esterify, and a molecule of water is "
            "lost, taking C2H4O2 and C2H6O to C4H8O2, ethyl acetate."
        ),
        pitfall=(
            "The trap is confusing a synthon with a reagent. A synthon is an "
            "idealised charged fragment used to decide polarity; it is often not "
            "a bottle you can pour from. An acyl cation is not a stable reagent, "
            "so the plan uses its equivalent, an acid or acid chloride. Skip the "
            "translation to a reagent equivalent and the synthesis is a paper "
            "exercise that cannot be run."
        ),
        claims=(
            Formula(ETHYL_ACETATE, "C4H8O2", "ethyl acetate, the target"),
            Formula(ACETIC_ACID, "C2H4O2", "acetic acid, the acyl-cation equivalent"),
            Formula(ETHANOL, "C2H6O", "ethanol, the alkoxide equivalent"),
            Source(
                "Retrosynthetic analysis proceeds by disconnecting a target at "
                "strategic bonds into synthons, idealised charged fragments, "
                "each represented in practice by a reagent equivalent; good "
                "disconnections correspond to reliable forward reactions.",
                WARREN,
            ),
        ),
    ),
    "ORG2.MULTISTEP": Lesson(
        node="ORG2.MULTISTEP",
        objective=(
            "Sequence a short synthesis using functional-group interconversion "
            "and order of operations, and use a protecting group to shield a "
            "carbonyl from a step meant for elsewhere."
        ),
        build_on=(
            "Retrosynthesis told you where to disconnect. Designing the forward "
            "route adds two constraints: some steps must precede others, and "
            "some groups must be hidden while others react."
        ),
        core_idea=(
            "A multistep synthesis is planned around three ideas. Functional- "
            "group interconversion moves a molecule up or down the oxidation "
            "ladder without changing its skeleton, for example a primary alcohol "
            "to an aldehyde to a carboxylic acid. Order of operations matters "
            "because a reagent for one group may attack another: you sequence "
            "steps so each transformation happens while the molecule can "
            "tolerate it. When a needed reagent would damage a group that must "
            "survive, a protecting group hides that group first and restores it "
            "later. A classic case is a carbonyl converted to a cyclic acetal "
            "before a step it could not otherwise survive, then unmasked "
            "afterward. The acetal swaps the reactive carbon to oxygen double "
            "bond for two unreactive carbon to oxygen single bonds in a ring, "
            "keeping the same degree of unsaturation while removing the "
            "reactivity."
        ),
        worked_example=(
            "First the oxidation ladder. Ethanol, CCO, is C2H6O with no degree "
            "of unsaturation. Oxidise it to acetaldehyde, CC=O, C2H4O, one "
            "degree of unsaturation as the carbonyl appears; oxidise further to "
            "acetic acid, CC(=O)O, C2H4O2, still one degree but now a carboxyl. "
            "Each arrow is a functional-group interconversion up the ladder. Now "
            "protection. Cyclohexanone, O=C1CCCCC1, is C6H10O with two degrees "
            "of unsaturation, the ring and the carbonyl. Convert it to a cyclic "
            "acetal and the product, C8H14O2, still has two degrees of "
            "unsaturation, now two rings and no carbonyl: the reactive ketone is "
            "masked while the rest of the molecule is worked on, and hydrolysis "
            "later brings the ketone back."
        ),
        try_it_prompt=(
            "Cyclohexanone is C6H10O with two degrees of unsaturation. Its "
            "cyclic acetal is C8H14O2, also with two degrees of unsaturation. "
            "What has the protecting group changed, and what has it preserved?"
        ),
        try_it_answer=(
            "The protecting group has removed the reactive carbonyl, trading the "
            "carbon to oxygen double bond for two single bonds locked in a new "
            "ring, so the ketone can no longer react. It has preserved the "
            "degree of unsaturation, still two, because a ring replaced the "
            "double bond, and the original carbonyl can be recovered later by "
            "hydrolysis."
        ),
        pitfall=(
            "The trap is ordering the steps as if every group in the molecule "
            "were inert to every reagent. A reducing or organometallic step "
            "aimed at one site will attack an exposed carbonyl elsewhere; "
            "planning the sequence without protecting that carbonyl gives a "
            "route that fails on the first such step even though every "
            "individual reaction looks right."
        ),
        claims=(
            Formula(ETHANOL, "C2H6O", "ethanol, bottom of the ladder"),
            Unsaturation(ETHANOL, 0, "no carbonyl yet"),
            Formula(ACETALDEHYDE, "C2H4O", "acetaldehyde, one rung up"),
            Unsaturation(ACETALDEHYDE, 1, "the new carbonyl"),
            Formula(ACETIC_ACID, "C2H4O2", "acetic acid, the top rung"),
            Unsaturation(ACETIC_ACID, 1, "the carboxyl"),
            Formula(CYCLOHEXANONE, "C6H10O", "cyclohexanone, an unprotected ketone"),
            Unsaturation(CYCLOHEXANONE, 2, "the ring and the carbonyl"),
            Formula(CYCLOHEXANONE_ACETAL, "C8H14O2", "the ketone protected as a cyclic acetal"),
            Unsaturation(CYCLOHEXANONE_ACETAL, 2, "two rings, the carbonyl now masked"),
            Source(
                "A protecting group reversibly converts a reactive functional "
                "group to an inert one for the duration of steps it could not "
                "survive; a ketone is commonly protected as a cyclic acetal and "
                "regenerated by acidic hydrolysis.",
                GREENE,
            ),
        ),
    ),
}
