"""ORG2 Unit 10: Biomolecules and Synthesis Strategy.

This unit is the stereochemistry-density peak of the whole program, and it is
built the way Unit 4 of ORG1 was: every configurational assignment carries a
Stereo claim that RDKit re-derives from the structure when the test suite runs,
so a descriptor written backwards fails the build rather than reaching a
learner. That discipline matters most exactly here. Glucose has four
stereocentres in its open chain and five in its ring, and the L amino acids are
the place where a single side chain change, cysteine, inverts the CIP label
while the spatial arrangement stays put. Both were derived, read back, and only
then written down.

Checkable, and therefore claimed:

  molecular formula                      Formula
  CIP descriptors of every stereocentre  Stereo
  degrees of unsaturation (neutral)      Unsaturation
  isomer and anomer relationships        Relationship

Not checkable in this repository, and therefore carried as a Source with a real
citation or left out of the prose entirely:

  specific rotations and melting points
  pKa and isoelectric point values
  hydrogen bond counts in base pairs
  whether a named reagent effects a transformation under given conditions

The synthesis lessons, retrosynthesis and multistep, are conceptual by
construction. They teach the logic of a disconnection and the discipline of
protecting group order without inventing reaction conditions, and their claims
are the formulas and unsaturation counts of the target and the pieces it comes
apart into.
"""

from __future__ import annotations

from app.data.claims import Formula, Relationship, Source, Stereo, Unsaturation
from app.data.lesson_types import Lesson

# ---------------------------------------------------------------------------
# Structures, named once so a claim and its prose cannot drift apart. Every
# stereo SMILES below was passed through chem_core.organic.stereocentres and the
# descriptors were read back before being written into a claim.
# ---------------------------------------------------------------------------

# Carbohydrates. Glyceraldehyde is the configurational reference for the D and L
# series; the descriptors match those derived in ORG1 Unit 4.
GLYCERALDEHYDE_D = "OC[C@@H](O)C=O"          # (R)
GLYCERALDEHYDE_L = "OC[C@H](O)C=O"           # (S)

# D-glucose, open chain aldehyde form. The stereocentres read back in atom order
# as C2, C3, C4, C5 = R, S, R, R, which is the textbook (2R,3S,4R,5R).
GLUCOSE_OPEN = "O=C[C@H](O)[C@@H](O)[C@H](O)[C@H](O)CO"
# The two pyranose anomers. They differ at one atom only, the anomeric carbon,
# which RDKit labels S in the alpha form and R in the beta form. Every other
# centre is identical between the two, which is the definition of anomers.
GLUCOSE_ALPHA = "OC[C@H]1O[C@H](O)[C@H](O)[C@@H](O)[C@@H]1O"
GLUCOSE_BETA = "OC[C@H]1O[C@@H](O)[C@H](O)[C@@H](O)[C@@H]1O"

# D-mannose, the C2 epimer of D-glucose: one stereocentre inverted, the rest held.
MANNOSE_OPEN = "O=C[C@@H](O)[C@@H](O)[C@H](O)[C@H](O)CO"
# D-glucitol, the alditol from reducing the C1 aldehyde of glucose to a primary
# alcohol. D-gluconic acid, the aldonic acid from oxidising it to a carboxyl.
GLUCITOL = "OC[C@H](O)[C@@H](O)[C@H](O)[C@H](O)CO"
GLUCONIC_ACID = "O=C(O)[C@H](O)[C@@H](O)[C@H](O)[C@H](O)CO"
# Methyl alpha-D-glucopyranoside: the anomeric hydroxyl of the alpha form
# replaced by a methoxy group, converting a hemiacetal into an acetal.
METHYL_GLUCOSIDE = "OC[C@H]1O[C@H](OC)[C@H](O)[C@@H](O)[C@@H]1O"

# Amino acids, neutral form. The L series shares the N[C@@H](R)C(=O)O backbone;
# RDKit reads that as S for every one below except cysteine, whose sulfur side
# chain outranks the carboxyl and flips the label to R.
GLYCINE = "NCC(=O)O"
L_ALANINE = "N[C@@H](C)C(=O)O"               # (S)
D_ALANINE = "N[C@H](C)C(=O)O"                # (R)
L_SERINE = "N[C@@H](CO)C(=O)O"               # (S)
L_CYSTEINE = "N[C@@H](CS)C(=O)O"             # (R), the exception
L_THREONINE = "N[C@@H]([C@@H](C)O)C(=O)O"    # (2S,3R)
# Zwitterion, a charged species: carried by Formula only. Unsaturation is not
# claimed on charged structures anywhere in this unit.
GLYCINE_ZWITTERION = "[NH3+]CC(=O)[O-]"

# Peptides. Directionality is real: glycyl-L-alanine and L-alanylglycine share a
# molecular formula but not a constitution.
GLYCYLGLYCINE = "NCC(=O)NCC(=O)O"
GLYCYL_L_ALANINE = "NCC(=O)N[C@@H](C)C(=O)O"
L_ALANYLGLYCINE = "N[C@@H](C)C(=O)NCC(=O)O"

# Lipids and terpenes.
PALMITIC_ACID = "CCCCCCCCCCCCCCCC(=O)O"
STEARIC_ACID = "CCCCCCCCCCCCCCCCCC(=O)O"
OLEIC_ACID = "CCCCCCCC/C=C\\CCCCCCCC(=O)O"    # cis, (Z) at C9
ELAIDIC_ACID = "CCCCCCCC/C=C/CCCCCCCC(=O)O"   # trans, (E) at C9
ISOPRENE = "CC(=C)C=C"
GLYCEROL = "OCC(O)CO"
TRIPALMITIN = (
    "CCCCCCCCCCCCCCCC(=O)OCC(OC(=O)CCCCCCCCCCCCCCC)COC(=O)CCCCCCCCCCCCCCC"
)

# Nucleic acids.
ADENINE = "Nc1ncnc2[nH]cnc12"
GUANINE = "Nc1nc2[nH]cnc2c(=O)[nH]1"
CYTOSINE = "Nc1cc[nH]c(=O)n1"
THYMINE = "Cc1c[nH]c(=O)[nH]c1=O"
URACIL = "O=c1cc[nH]c(=O)[nH]1"
D_RIBOSE = "O=C[C@H](O)[C@H](O)[C@H](O)CO"    # (2R,3R,4R)
DEOXYRIBOSE = "O=CC[C@H](O)[C@H](O)CO"        # 2-deoxy-D-ribose

# Retrosynthesis and multistep targets and pieces.
PHENYLPROPANOL = "CC(C)(O)c1ccccc1"           # 2-phenylpropan-2-ol
ACETOPHENONE = "CC(=O)c1ccccc1"
BENZALDEHYDE = "O=Cc1ccccc1"
ACETONE = "CC(C)=O"
ETHYLENE_GLYCOL = "OCCO"
DIMETHYLDIOXOLANE = "CC1(C)OCCO1"             # acetone protected as a cyclic acetal
PROPAN_1_OL = "CCCO"
PROPANAL = "CCC=O"
PROPANOIC_ACID = "CCC(=O)O"

# ---------------------------------------------------------------------------
# Citations. Every number this unit states that the repository cannot derive
# points at one of these real works.
# ---------------------------------------------------------------------------

CLAYDEN = (
    "Clayden, Greeves and Warren, Organic Chemistry, 2nd edition, Oxford "
    "University Press 2012."
)
LEHNINGER = (
    "Nelson and Cox, Lehninger Principles of Biochemistry, 7th edition, "
    "W. H. Freeman 2017."
)
CRC = (
    "CRC Handbook of Chemistry and Physics, 97th edition, CRC Press, tables of "
    "physical constants of organic compounds."
)
COREY = (
    "Corey and Cheng, The Logic of Chemical Synthesis, Wiley 1989, on "
    "retrosynthetic analysis, synthons and synthetic equivalents."
)
IUPAC_CARB = (
    "IUPAC and IUBMB, Nomenclature of Carbohydrates (Recommendations 1996), "
    "Pure and Applied Chemistry volume 68, on the D and L series and the "
    "definition of the anomeric centre."
)

LESSONS_ORG2_U10 = {
    "ORG2.CARBOHYDRATES": Lesson(
        node="ORG2.CARBOHYDRATES",
        objective=(
            "Draw the cyclic hemiacetal a monosaccharide forms, identify its "
            "anomeric carbon, and say what the alpha and beta labels describe "
            "and why the two forms interconvert in water."
        ),
        build_on=(
            "You assigned R and S to glyceraldehyde in ORG1 and used it as the "
            "configurational reference for the D and L series. A sugar is that "
            "same idea scaled up: a chain of stereocentres ending in the "
            "carbonyl of an aldehyde or a ketone. This lesson closes that chain "
            "into a ring."
        ),
        core_idea=(
            "A monosaccharide carries both a carbonyl and several hydroxyl "
            "groups on one chain, so it can react with itself. A hydroxyl a few "
            "carbons away adds across the carbonyl to give a cyclic hemiacetal, "
            "and for an aldohexose the favoured ring is the six membered "
            "pyranose formed when the C5 hydroxyl reaches the C1 aldehyde. That "
            "ring closure turns the flat carbonyl carbon into a tetrahedral "
            "stereocentre, and it is a new one the open chain did not have. It "
            "is called the anomeric carbon, and because the carbonyl face can "
            "be attacked from either side it is formed as two configurations. "
            "Those are the anomers, labelled alpha and beta by the relationship "
            "between the anomeric hydroxyl and the reference hydroxyl that fixes "
            "the D or L series. In water the ring opens back to the free "
            "carbonyl and recloses, so a solution of one pure anomer drifts to "
            "an equilibrium mixture of both, which is mutarotation."
        ),
        worked_example=(
            "Take D-glucose. Its open chain aldehyde has four stereocentres, and "
            "reading them back from the structure gives C2 as R, C3 as S, C4 as "
            "R and C5 as R, the arrangement written as (2R,3S,4R,5R). Close the "
            "ring by letting the C5 hydroxyl add to the C1 aldehyde. C1 was "
            "planar with two faces open to attack; once the oxygen bonds to it, "
            "C1 carries an H, the ring oxygen, the C2 chain and a new hydroxyl, "
            "four different groups, so it is now a stereocentre. The molecule "
            "gains a fifth assigned centre and appears as two anomers. In the "
            "alpha anomer the new hydroxyl points to the opposite side of the "
            "ring from the C6 reference and RDKit reads its anomeric carbon as "
            "S; in the beta anomer that hydroxyl is on the same side and the "
            "anomeric carbon reads R. The two share every other centre and "
            "differ only at C1, so they are diastereomers, not enantiomers and "
            "not the same compound. Both have the molecular formula C6H12O6, "
            "unchanged by the ring closure, because forming a hemiacetal "
            "rearranges bonds without adding or removing an atom."
        ),
        try_it_prompt=(
            "A student says the alpha and beta forms of D-glucopyranose are "
            "mirror images of each other, because one hydroxyl points up and the "
            "other points down. Are they enantiomers? Name the relationship and "
            "say what a mirror image would require."
        ),
        try_it_answer=(
            "They are diastereomers, not enantiomers. Enantiomers are mirror "
            "images at every stereocentre, so the mirror image of the alpha "
            "anomer would have C2, C3, C4 and C5 all inverted as well as C1. The "
            "alpha and beta anomers differ at C1 alone and hold the other four "
            "centres identical, which is what a diastereomer is. One centre "
            "flipped out of five is a long way from a mirror image, and it is "
            "why the two anomers have different physical properties and can be "
            "isolated as separate solids before they mutarotate in water."
        ),
        pitfall=(
            "The trap is thinking the ring closure is a change of formula or a "
            "loss of the carbonyl for good. It is neither. The hemiacetal is in "
            "equilibrium with the open chain, the formula never changes, and a "
            "small fraction of open chain aldehyde is always present, which is "
            "why glucose still gives the reactions of an aldehyde even though it "
            "is drawn as a ring. The second half of the same mistake is reading "
            "alpha and beta as a fixed property of a sample. Dissolve either "
            "pure anomer and it becomes a mixture of both, so the label "
            "describes a molecule at an instant, not a bottle over time."
        ),
        claims=(
            Formula(GLUCOSE_OPEN, "C6H12O6", "D-glucose, open chain"),
            Stereo(GLUCOSE_OPEN, ("R", "S", "R", "R"), "C2, C3, C4, C5 of D-glucose"),
            Formula(GLUCOSE_ALPHA, "C6H12O6", "alpha-D-glucopyranose"),
            Stereo(
                GLUCOSE_ALPHA, ("R", "S", "R", "S", "S"),
                "anomeric carbon reads S in the alpha form",
            ),
            Formula(GLUCOSE_BETA, "C6H12O6", "beta-D-glucopyranose"),
            Stereo(
                GLUCOSE_BETA, ("R", "R", "R", "S", "S"),
                "anomeric carbon reads R in the beta form",
            ),
            Relationship(
                GLUCOSE_ALPHA, GLUCOSE_BETA, "diastereomers",
                "the two anomers differ at the anomeric carbon only",
            ),
            Source(
                "The alpha and beta descriptors of an anomer are defined by the "
                "relationship between the configuration of the anomeric centre "
                "and the anomeric reference atom that also fixes the D or L "
                "series; mutarotation is the equilibration of the two anomers "
                "through the open chain form in solution.",
                IUPAC_CARB,
            ),
        ),
    ),
    "ORG2.CARBREACTIONS": Lesson(
        node="ORG2.CARBREACTIONS",
        objective=(
            "Predict how a monosaccharide changes when its carbonyl is reduced, "
            "oxidised, or converted to a glycoside, and say which of those "
            "changes locks the anomeric centre against mutarotation."
        ),
        build_on=(
            "You know a sugar sits in equilibrium between an open chain carbonyl "
            "and a cyclic hemiacetal. Its reactions are the reactions of that "
            "carbonyl and that hemiacetal hydroxyl, so everything here is a "
            "functional group you already met, attached to a stereochemically "
            "rich frame."
        ),
        core_idea=(
            "Three transformations cover most of what is asked of a simple "
            "sugar. Reduction of the aldehyde gives a primary alcohol, turning "
            "the sugar into an alditol and adding two hydrogens to the formula "
            "while leaving every stereocentre untouched. Oxidation of the same "
            "aldehyde to a carboxylic acid gives an aldonic acid and adds one "
            "oxygen. The third is glycoside formation: the hemiacetal hydroxyl "
            "at the anomeric carbon reacts with an alcohol to give an acetal, "
            "the glycoside, in which an OR group has replaced the OH. That last "
            "one is the important structural switch, because a hemiacetal is in "
            "equilibrium with the open chain and an acetal is not. Capping the "
            "anomeric oxygen as an acetal removes the route back to the free "
            "aldehyde, so a glycoside no longer mutarotates and no longer shows "
            "the reactions of the open chain carbonyl. Constitution stays fixed "
            "at the other carbons: D-glucose and D-mannose are C2 epimers, "
            "identical everywhere but one centre, and therefore diastereomers."
        ),
        worked_example=(
            "Start from D-glucose, C6H12O6. Reduce the C1 aldehyde to a "
            "hydroxymethyl group and the product is D-glucitol, C6H14O6, two "
            "hydrogens heavier and now an alditol with a primary alcohol at each "
            "end. Instead oxidise the C1 aldehyde to a carboxyl and the product "
            "is D-gluconic acid, C6H12O7, one oxygen heavier. Neither step "
            "disturbs C2 through C5, so the four original stereocentres carry "
            "through unchanged. Now the glycoside. React the anomeric hydroxyl "
            "of alpha-D-glucopyranose with methanol and the hemiacetal becomes "
            "an acetal, methyl alpha-D-glucopyranoside, C7H14O6, where a methoxy "
            "group sits where the anomeric OH was. That single change ends "
            "mutarotation: the acetal has no path back to the open chain "
            "aldehyde, so a solution of the pure methyl glycoside stays as the "
            "one anomer it was made as. Compare that with D-mannose, C6H12O6, "
            "which is glucose with C2 inverted. It is a diastereomer of glucose, "
            "a different compound with its own properties, reached by changing a "
            "configuration rather than a functional group."
        ),
        try_it_prompt=(
            "Two solutions each hold a pure single anomer. One is beta-D-"
            "glucopyranose, the other is its methyl glycoside. Left to stand, "
            "one of the two changes its optical rotation over time and the other "
            "does not. Which is which, and what structural feature decides it?"
        ),
        try_it_answer=(
            "The free sugar, beta-D-glucopyranose, changes; the methyl glycoside "
            "does not. Mutarotation needs the ring to open to the aldehyde and "
            "reclose as a mixture of anomers, and that only happens for a "
            "hemiacetal, where an OH sits on the anomeric carbon. The glycoside "
            "has replaced that OH with an OR, making an acetal, which has no low "
            "energy route back to the open chain, so its anomeric configuration "
            "is fixed and its rotation is steady. The deciding feature is "
            "hemiacetal versus acetal at the anomeric carbon."
        ),
        pitfall=(
            "The common error is to treat the anomeric hydroxyl as one hydroxyl "
            "among the sugar's several equals. It is not. The other hydroxyls "
            "are ordinary secondary or primary alcohols, but the anomeric one is "
            "half of a hemiacetal, and that is what gives it its distinct "
            "chemistry: it is the group that opens to the carbonyl, the group "
            "that becomes the acetal in a glycoside, and the group whose "
            "configuration mutarotation scrambles. Miss that it is special and "
            "the difference between a sugar that reduces silver and a glycoside "
            "that does not becomes a fact to memorise rather than one to derive."
        ),
        claims=(
            Formula(GLUCOSE_OPEN, "C6H12O6", "D-glucose"),
            Formula(GLUCITOL, "C6H14O6", "D-glucitol, the reduction product"),
            Stereo(
                GLUCITOL, ("S", "R", "R", "R"),
                "the four stereocentres carried through from glucose",
            ),
            Formula(GLUCONIC_ACID, "C6H12O7", "D-gluconic acid, the oxidation product"),
            Stereo(GLUCONIC_ACID, ("R", "S", "R", "R"), "C2 through C5 unchanged"),
            Formula(METHYL_GLUCOSIDE, "C7H14O6", "methyl alpha-D-glucopyranoside"),
            Stereo(
                METHYL_GLUCOSIDE, ("R", "S", "R", "S", "S"),
                "the anomeric centre is now an acetal, configuration locked",
            ),
            Formula(MANNOSE_OPEN, "C6H12O6", "D-mannose"),
            Stereo(MANNOSE_OPEN, ("S", "S", "R", "R"), "glucose with C2 inverted"),
            Relationship(
                GLUCOSE_OPEN, MANNOSE_OPEN, "diastereomers",
                "C2 epimers, one stereocentre different of four",
            ),
            Source(
                "The conversion of a hemiacetal to an acetal removes the "
                "equilibrium with the open chain carbonyl, so glycosides do not "
                "mutarotate and do not reduce mild oxidants the way reducing "
                "sugars do; whether a specific reagent effects a given oxidation "
                "is not derivable here.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.AMINOACIDS": Lesson(
        node="ORG2.AMINOACIDS",
        objective=(
            "Assign the configuration of a standard amino acid, explain why the "
            "neutral molecule exists as a zwitterion, and describe what the "
            "isoelectric point measures."
        ),
        build_on=(
            "Carbohydrates gave you a chain of stereocentres built around "
            "hydroxyl and carbonyl groups. An amino acid puts two groups that "
            "react with each other, an amine and a carboxylic acid, on the same "
            "carbon, and that internal acid base pairing sets the chemistry of "
            "this whole family."
        ),
        core_idea=(
            "A standard alpha amino acid has an amino group, a carboxyl group, a "
            "hydrogen and a side chain all on one carbon, the alpha carbon. When "
            "the side chain differs from the other three groups that carbon is a "
            "stereocentre, so every standard amino acid except glycine is "
            "chiral, and the naturally dominant configuration is the L series. "
            "Reading the descriptor back from the structure gives S for most of "
            "them, with a definite exception noted below. The second essential "
            "fact is charge. A carboxylic acid is a better proton donor than an "
            "ammonium ion is, so at neutral pH the carboxyl gives its proton to "
            "the amine on the same molecule, and the amino acid exists as a "
            "zwitterion: a positive ammonium and a negative carboxylate on one "
            "neutral species, an internal salt. As the pH is lowered the "
            "carboxylate takes a proton back and the molecule turns net "
            "positive; as it is raised the ammonium loses its proton and the "
            "molecule turns net negative. The isoelectric point is the pH at "
            "which the positive and negative charges balance and the average "
            "net charge is zero."
        ),
        worked_example=(
            "Take L-alanine, side chain a methyl group. Its alpha carbon carries "
            "NH2, COOH, CH3 and H, four different groups, so it is a "
            "stereocentre, and reading the structure back gives S. D-alanine is "
            "its mirror image and reads R, and the two are enantiomers. Now "
            "L-cysteine, which is the same L backbone with a CH2SH side chain in "
            "place of the methyl. Draw it in the identical spatial arrangement "
            "as L-alanine and read the descriptor: it comes back R, not S. "
            "Nothing about the shape changed. What changed is the priority "
            "order. Ranking the alpha carbon's groups, the sulfur bearing side "
            "chain now outranks the carboxyl, because sulfur beats oxygen at the "
            "first point of difference, and swapping the ranks of two groups "
            "reverses the sense of the assignment. L-cysteine is R while "
            "L-alanine, L-serine, L-valine and the rest of the L series are S, "
            "and the letters disagree even though the hand is the same. As for "
            "charge, neutral alanine is written as the zwitterion, ammonium and "
            "carboxylate on one molecule of formula C3H7NO2, the same formula as "
            "the uncharged tautomer because moving a proton within a molecule "
            "changes no atom count."
        ),
        try_it_prompt=(
            "L-serine and L-cysteine have the same L backbone; serine's side "
            "chain is CH2OH and cysteine's is CH2SH. One is assigned S and the "
            "other R. Predict which is which, and give the reason in terms of "
            "priority rather than shape."
        ),
        try_it_answer=(
            "L-serine is S and L-cysteine is R. In serine the side chain begins "
            "with a carbon bearing oxygen, which ranks below the carboxyl "
            "carbon, so the priority order is the same as in alanine and the "
            "descriptor is S. In cysteine the side chain begins with a carbon "
            "bearing sulfur, and sulfur outranks oxygen, so the side chain now "
            "beats the carboxyl. Two priorities swap, the reading reverses, and "
            "the descriptor is R. The molecules are the same shape and the same "
            "L configuration; only the CIP label moved, which is why the letter "
            "must be derived and never assumed from the family."
        ),
        pitfall=(
            "The misconception to name is that L always means S and D always "
            "means R. The D and L labels come from the spatial relationship to "
            "glyceraldehyde and do not track the CIP letters, which are decided "
            "by priority at each centre. Cysteine is the standard counterexample: "
            "L by configuration, R by CIP. A learner who writes S for every L "
            "amino acid gets cysteine wrong and gets it wrong confidently, "
            "because the sentence reads as fluently as the true one. Derive the "
            "descriptor from the structure every time, and treat D or L as a "
            "statement about configuration rather than a shortcut to a letter."
        ),
        claims=(
            Formula(GLYCINE, "C2H5NO2", "glycine, the one achiral standard amino acid"),
            Unsaturation(GLYCINE, 1, "the carboxyl carbonyl, neutral form"),
            Formula(L_ALANINE, "C3H7NO2", "L-alanine"),
            Stereo(L_ALANINE, ("S",), "L-alanine reads S"),
            Formula(D_ALANINE, "C3H7NO2", "D-alanine"),
            Stereo(D_ALANINE, ("R",), "D-alanine reads R"),
            Relationship(L_ALANINE, D_ALANINE, "enantiomers"),
            Formula(L_SERINE, "C3H7NO3", "L-serine"),
            Stereo(L_SERINE, ("S",), "L-serine reads S, oxygen side chain"),
            Formula(L_CYSTEINE, "C3H7NO2S", "L-cysteine"),
            Stereo(
                L_CYSTEINE, ("R",),
                "L-cysteine reads R: the sulfur side chain outranks the carboxyl",
            ),
            Formula(
                GLYCINE_ZWITTERION, "C2H5NO2",
                "the glycine zwitterion, an internal salt of the same formula",
            ),
            Source(
                "The isoelectric point of a neutral side chain amino acid is the "
                "average of the two pKa values flanking the zwitterion, and for "
                "glycine and alanine it falls near pH 6; acidic and basic side "
                "chains shift it well below or above that. These pKa and pI "
                "values are tabulated, not derivable here.",
                LEHNINGER,
            ),
        ),
    ),
    "ORG2.PEPTIDES": Lesson(
        node="ORG2.PEPTIDES",
        objective=(
            "Describe the peptide bond and the directionality it gives a chain, "
            "explain why sequence is a constitutional property, and state the "
            "logic of protecting group strategy in stepwise peptide synthesis."
        ),
        build_on=(
            "You have amino acids as zwitterions with an amine at one end and a "
            "carboxyl at the other. A peptide is what you get when the carboxyl "
            "of one joins the amine of the next, so the amide chemistry of ORG2 "
            "and the amino acid chemistry of the last lesson meet here."
        ),
        core_idea=(
            "A peptide bond is an amide formed between the carboxyl of one amino "
            "acid and the amino group of another, releasing water. Because each "
            "residue keeps a free amine on one side and a free carboxyl on the "
            "other, a chain has a direction: an amino end and a carboxyl end, "
            "written N to C, and the sequence is read in that direction. "
            "Sequence is a constitutional fact. Glycylalanine and alanylglycine "
            "contain the same atoms in the same formula but connect them "
            "differently, so they are constitutional isomers and different "
            "molecules. Building a defined sequence on purpose is the synthesis "
            "problem, and its difficulty is selectivity: an amino acid has a "
            "reactive group at both ends, so mixing two of them gives every "
            "possible coupling. The answer is protecting groups. Block the amino "
            "group of the residue whose carboxyl you want to couple, and block "
            "the carboxyl of the residue whose amine you want to couple, so that "
            "only the one intended amide can form. Then remove one protecting "
            "group to expose the next reactive end and repeat. Solid phase "
            "synthesis runs this cycle with the growing chain anchored to a "
            "resin bead, so excess reagents and by-products wash away between "
            "steps while the peptide stays put."
        ),
        worked_example=(
            "Couple glycine to glycine. The carboxyl of one and the amine of the "
            "other condense with loss of water to give glycylglycine, "
            "C4H8N2O3, a dipeptide with one peptide bond, a free amine at the N "
            "end and a free carboxyl at the C end. Two glycines have no side "
            "chain to distinguish their ends, so order does not arise. Bring in "
            "alanine and it does. Glycyl-L-alanine and L-alanylglycine both have "
            "the formula C5H10N2O3 and both carry the alanine stereocentre, "
            "which reads S, but they are not the same molecule: in one the "
            "glycine supplies the carboxyl and the alanine supplies the amine of "
            "the peptide bond, and in the other those roles are swapped. They "
            "are constitutional isomers, and only a synthesis that controls "
            "which amine meets which carboxyl can choose between them. That "
            "control is what protecting groups buy. To make glycyl-L-alanine and "
            "not its reverse, protect the amine of glycine and the carboxyl of "
            "alanine, form the single intended bond, then remove the protections."
        ),
        try_it_prompt=(
            "You want to make the dipeptide glycyl-L-alanine, glycine at the N "
            "end. If you mix glycine and alanine with a coupling reagent and no "
            "protecting groups, why do you not get a clean product, and which "
            "two groups must you block to force the intended bond?"
        ),
        try_it_answer=(
            "Each amino acid has both a reactive amine and a reactive carboxyl, "
            "so an unprotected mixture couples in every combination: "
            "glycyl-glycine, alanyl-alanine, both orientations of the mixed "
            "dipeptide, and longer chains. To force glycyl-L-alanine you protect "
            "the amine of glycine and the carboxyl of alanine, leaving only the "
            "carboxyl of glycine and the amine of alanine free, so the one amide "
            "that can form is the one you want. Removing the two protecting "
            "groups afterward gives the free dipeptide with the sequence set by "
            "which ends you left open."
        ),
        pitfall=(
            "The habit worth breaking is reading a peptide sequence as an "
            "unordered list of its residues. Sequence has direction and the "
            "direction carries meaning: glycyl-L-alanine and L-alanylglycine are "
            "different compounds, not two names for one, even though they share "
            "a formula and a residue count. The same error in the synthesis is "
            "assuming a coupling reagent alone builds a defined chain. Without "
            "protection the reagent couples everything reachable, and the "
            "product is a statistical mixture. Directionality and selectivity "
            "are the two ideas, and both come from the fact that every residue "
            "is reactive at both ends."
        ),
        claims=(
            Formula(GLYCINE, "C2H5NO2", "glycine"),
            Formula(GLYCYLGLYCINE, "C4H8N2O3", "glycylglycine"),
            Unsaturation(GLYCYLGLYCINE, 2, "two carbonyls: one peptide bond, one carboxyl"),
            Formula(GLYCYL_L_ALANINE, "C5H10N2O3", "glycyl-L-alanine"),
            Stereo(GLYCYL_L_ALANINE, ("S",), "the alanine residue reads S"),
            Formula(L_ALANYLGLYCINE, "C5H10N2O3", "L-alanylglycine"),
            Stereo(L_ALANYLGLYCINE, ("S",), "the alanine residue reads S"),
            Relationship(
                GLYCYL_L_ALANINE, L_ALANYLGLYCINE, "constitutional",
                "same formula, reversed sequence, so different connectivity",
            ),
            Source(
                "Stepwise and solid phase peptide synthesis rely on orthogonal "
                "amine and carboxyl protecting groups removed under different "
                "conditions so that one coupling can be run at a time; the "
                "specific reagents and their deprotection conditions are "
                "procedural and not derivable here.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.LIPIDS": Lesson(
        node="ORG2.LIPIDS",
        objective=(
            "Relate a fatty acid's chain length and degree of unsaturation to "
            "the triglyceride it builds, and describe how isoprene units "
            "assemble the terpene family."
        ),
        build_on=(
            "Sugars and amino acids were defined by their functional groups and "
            "their stereocentres. Lipids are defined differently, by solubility "
            "rather than by one shared group, so this lesson is organised around "
            "two building patterns: the ester of glycerol with fatty acids, and "
            "the head to tail joining of isoprene units."
        ),
        core_idea=(
            "A fatty acid is a long unbranched carboxylic acid, and its single "
            "degree of unsaturation when saturated is the carboxyl carbonyl "
            "alone. Each carbon to carbon double bond adds one more degree, so "
            "an unsaturation count reports the number of double bonds in the "
            "chain directly. The geometry of those double bonds matters: the cis "
            "double bonds of natural unsaturated fats put a fixed kink in the "
            "chain, which is why they resist packing and stay liquid, while the "
            "trans isomer is straighter. A triglyceride is the triester of "
            "glycerol, a three carbon triol, with three fatty acids, formed with "
            "loss of three waters, so it is a large ester rather than a new kind "
            "of group. Terpenes are built by a different rule. Their carbon "
            "skeletons are multiples of five carbons because they are assembled "
            "from isoprene units, C5H8 building blocks, joined mostly head to "
            "tail, so counting carbons in fives and looking for the isoprene "
            "pattern is how a terpene is parsed."
        ),
        worked_example=(
            "Compare three C18 acids. Stearic acid is fully saturated, C18H36O2, "
            "with one degree of unsaturation that is entirely the carboxyl. "
            "Oleic acid has one carbon to carbon double bond, C18H34O2, two "
            "degrees of unsaturation, the carbonyl plus the one alkene, and "
            "that alkene is cis, which bends the chain. Elaidic acid is its "
            "trans isomer, the same formula C18H34O2 and the same two degrees, "
            "differing only in the geometry at the double bond. Oleic and "
            "elaidic are therefore diastereomers: same constitution, different "
            "configuration at a double bond, not mirror images. Now build a fat. "
            "Esterify glycerol, C3H8O3, with three palmitic acid chains and the "
            "product is glyceryl tripalmitate, C51H98O6, whose three degrees of "
            "unsaturation are the three ester carbonyls, one per chain, with no "
            "carbon to carbon double bonds because palmitic acid is saturated. "
            "Turn to terpenes with isoprene itself, C5H8, whose two degrees of "
            "unsaturation are its two conjugated double bonds; stringing isoprene "
            "units together is what gives the C10, C15 and C20 skeletons of the "
            "terpene series their carbon counts in multiples of five."
        ),
        try_it_prompt=(
            "A fatty acid has the formula C18H34O2. Its fully saturated relative "
            "is C18H36O2. How many carbon to carbon double bonds does the first "
            "one have, and how do you get that number from the formulas without "
            "drawing either structure?"
        ),
        try_it_answer=(
            "One carbon to carbon double bond. The saturated C18 acid has one "
            "degree of unsaturation, which is the carboxyl carbonyl. The "
            "C18H34O2 acid has two hydrogens fewer for the same carbon and "
            "oxygen count, and every pair of hydrogens removed at constant "
            "carbon adds one degree of unsaturation, so it has two degrees "
            "total. Subtract the one that belongs to the carbonyl and one "
            "degree is left, which is a single carbon to carbon double bond. The "
            "arithmetic gives the count of double bonds without any drawing, "
            "which is exactly what a degree of unsaturation is for."
        ),
        pitfall=(
            "The error is counting the carbonyl of a fatty acid or an ester as "
            "if it were a point of unsaturation in the hydrocarbon chain. When "
            "you translate a degree of unsaturation count into double bonds, the "
            "carboxyl or ester carbonyl always claims one degree first, and only "
            "the remainder counts chain alkenes. A saturated fatty acid is not "
            "zero degrees of unsaturation, it is one, and forgetting that "
            "overcounts the chain double bonds by exactly one every time. The "
            "related slip on the terpene side is to expect a carbon count that "
            "is not a multiple of five; when it is not, the isoprene parsing has "
            "gone wrong somewhere and is worth rechecking."
        ),
        claims=(
            Formula(PALMITIC_ACID, "C16H32O2", "palmitic acid, saturated C16"),
            Unsaturation(PALMITIC_ACID, 1, "the carboxyl carbonyl only"),
            Formula(STEARIC_ACID, "C18H36O2", "stearic acid, saturated C18"),
            Unsaturation(STEARIC_ACID, 1),
            Formula(OLEIC_ACID, "C18H34O2", "oleic acid, one cis double bond"),
            Unsaturation(OLEIC_ACID, 2, "carbonyl plus one alkene"),
            Formula(ELAIDIC_ACID, "C18H34O2", "elaidic acid, the trans isomer"),
            Unsaturation(ELAIDIC_ACID, 2),
            Relationship(
                OLEIC_ACID, ELAIDIC_ACID, "diastereomers",
                "cis and trans at the same double bond, same constitution",
            ),
            Formula(GLYCEROL, "C3H8O3", "glycerol"),
            Unsaturation(GLYCEROL, 0),
            Formula(TRIPALMITIN, "C51H98O6", "glyceryl tripalmitate"),
            Unsaturation(TRIPALMITIN, 3, "three ester carbonyls, no chain alkenes"),
            Formula(ISOPRENE, "C5H8", "isoprene, the terpene building block"),
            Unsaturation(ISOPRENE, 2, "two conjugated double bonds"),
            Source(
                "Cis unsaturation lowers the melting point of a fatty acid "
                "relative to its saturated or trans counterpart of the same "
                "chain length by disrupting chain packing; the specific melting "
                "points are tabulated physical constants, not derivable here.",
                CRC,
            ),
        ),
    ),
    "ORG2.NUCLEICACIDS": Lesson(
        node="ORG2.NUCLEICACIDS",
        objective=(
            "Name the three parts of a nucleotide, distinguish ribose from "
            "deoxyribose by their formulas, and explain how complementary base "
            "pairing and the phosphodiester backbone organise a strand."
        ),
        build_on=(
            "You have sugars as cyclic hemiacetals and you have the idea that a "
            "hydroxyl can be esterified. A nucleotide is a sugar joined to a "
            "nitrogen base at its anomeric carbon and to a phosphate at another "
            "hydroxyl, so it reuses the carbohydrate chemistry of this unit "
            "twice over."
        ),
        core_idea=(
            "A nucleotide has three parts: a five carbon sugar, a nitrogen "
            "containing base, and a phosphate group. The sugar is ribose in RNA "
            "and 2-deoxyribose in DNA, and the two differ by a single oxygen: "
            "ribose is C5H10O5 and deoxyribose is C5H10O4, with the 2 position "
            "hydroxyl replaced by a hydrogen, which is the whole meaning of "
            "deoxy. The base attaches to the anomeric carbon of the sugar, "
            "making that linkage a glycoside of the kind the earlier lesson "
            "described, and it is one of a small set of purines and pyrimidines. "
            "Strands are held together in two directions. Along a strand, "
            "phosphate groups bridge the 3 position of one sugar and the 5 "
            "position of the next through two ester bonds, a phosphodiester "
            "linkage, giving the backbone its direction and its repeating sugar "
            "phosphate pattern. Across strands, bases pair by hydrogen bonding, "
            "and the pairing is complementary and specific: a larger purine "
            "pairs with a smaller pyrimidine so the rungs are a constant width, "
            "adenine with thymine and guanine with cytosine, with uracil "
            "standing in for thymine in RNA."
        ),
        worked_example=(
            "Look first at the sugars. D-ribose in its open chain form has three "
            "stereocentres reading R, R, R, the arrangement (2R,3R,4R), and the "
            "formula C5H10O5. 2-deoxy-D-ribose has lost the 2 position oxygen, "
            "so it is C5H10O4 with one fewer stereocentre, and that one missing "
            "oxygen is the entire chemical difference between the RNA sugar and "
            "the DNA sugar. Now the bases and their sizes. Adenine and guanine "
            "are purines, the larger two ring systems, with formulas C5H5N5 and "
            "C5H5N5O and six degrees of unsaturation each. Cytosine, thymine and "
            "uracil are pyrimidines, the smaller single ring, with four degrees "
            "of unsaturation each: cytosine is C4H5N3O, thymine is C5H6N2O2, and "
            "uracil is C4H4N2O2. Notice that thymine is uracil plus a methyl "
            "group, C5H6N2O2 against C4H4N2O2, which is why thymine in DNA and "
            "uracil in RNA play the same pairing role. The complementary pairs "
            "put one purine against one pyrimidine, adenine with thymine and "
            "guanine with cytosine, so every rung spans a large base plus a "
            "small one and the two strands stay a uniform distance apart."
        ),
        try_it_prompt=(
            "Ribose and deoxyribose are both five carbon sugars, yet they are "
            "not isomers of each other. Using the formulas C5H10O5 for ribose "
            "and C5H10O4 for deoxyribose, explain why the word isomer does not "
            "apply, and say what single structural change relates them."
        ),
        try_it_answer=(
            "Isomers must share a molecular formula, and these do not: ribose is "
            "C5H10O5 and deoxyribose is C5H10O4, differing by one oxygen atom. "
            "Because the formulas differ, they are different compounds related by "
            "a change in composition, not by a rearrangement of the same atoms. "
            "The single change is at the 2 position of the sugar, where "
            "ribose's hydroxyl is replaced by a hydrogen in deoxyribose, which "
            "removes exactly one oxygen and gives deoxyribose its name and its "
            "formula."
        ),
        pitfall=(
            "The misconception to head off is that base pairing is a general "
            "stickiness, so any base could pair with any other. Pairing is "
            "specific and it is dictated by shape and by where the hydrogen bond "
            "donors and acceptors sit: a purine pairs with a pyrimidine to keep "
            "the rung width constant, and within that constraint adenine matches "
            "thymine and guanine matches cytosine and not the other way around. "
            "The second slip is calling ribose and deoxyribose isomers because "
            "they look almost the same; they have different formulas, so they "
            "are not isomers at all, and the one oxygen that separates them is "
            "the difference between the RNA sugar and the DNA sugar."
        ),
        claims=(
            Formula(D_RIBOSE, "C5H10O5", "D-ribose, the RNA sugar"),
            Stereo(D_RIBOSE, ("R", "R", "R"), "(2R,3R,4R)"),
            Formula(DEOXYRIBOSE, "C5H10O4", "2-deoxy-D-ribose, the DNA sugar"),
            Stereo(DEOXYRIBOSE, ("S", "R"), "one fewer stereocentre than ribose"),
            Formula(ADENINE, "C5H5N5", "adenine, a purine"),
            Unsaturation(ADENINE, 6),
            Formula(GUANINE, "C5H5N5O", "guanine, a purine"),
            Unsaturation(GUANINE, 6),
            Formula(CYTOSINE, "C4H5N3O", "cytosine, a pyrimidine"),
            Unsaturation(CYTOSINE, 4),
            Formula(THYMINE, "C5H6N2O2", "thymine, a pyrimidine"),
            Unsaturation(THYMINE, 4),
            Formula(URACIL, "C4H4N2O2", "uracil, thymine without the methyl"),
            Unsaturation(URACIL, 4),
            Source(
                "Complementary base pairing joins adenine to thymine by two "
                "hydrogen bonds and guanine to cytosine by three, with uracil "
                "replacing thymine in RNA; the count of hydrogen bonds and the "
                "geometry of the pairs are structural facts drawn from the "
                "reference rather than derived here.",
                LEHNINGER,
            ),
        ),
    ),
    "ORG2.RETROSYNTHESIS": Lesson(
        node="ORG2.RETROSYNTHESIS",
        objective=(
            "Perform a one bond disconnection on a target molecule, express the "
            "resulting fragments as synthons, and name a real reagent that "
            "serves as the equivalent of each synthon."
        ),
        build_on=(
            "Every reaction you have learned runs forward, from starting "
            "material to product. Retrosynthesis runs the same knowledge "
            "backward, taking a target apart into simpler pieces, and it needs "
            "only one new habit: reasoning from the bond you would form to the "
            "reagents that would form it."
        ),
        core_idea=(
            "Retrosynthesis analyses a target by breaking one bond at a time and "
            "asking what two pieces could have joined to make it. The break is "
            "drawn with a special double lined retrosynthetic arrow to signal "
            "that it is an analysis, not a reaction. The idealised fragments it "
            "produces are synthons, and a synthon is usually a charged idea "
            "rather than a bottle reagent: a cationic piece that wants electrons "
            "and an anionic piece that supplies them. The skill is then to name "
            "the synthetic equivalent, the real, stable compound that behaves as "
            "that synthon in the forward direction. The most productive "
            "disconnections are at bonds next to a functional group, because "
            "those are the bonds real reactions make. A carbon carbon bond next "
            "to a carbon bearing oxygen, for instance, points back to a carbonyl "
            "electrophile and a carbanion nucleophile, which is the forward "
            "addition of an organometallic to a carbonyl seen in reverse. The "
            "point of the analysis is to keep simplifying until the pieces are "
            "things you can buy or already know how to make."
        ),
        worked_example=(
            "Take 2-phenylpropan-2-ol as the target, C9H12O with four degrees of "
            "unsaturation that are the benzene ring. It is a tertiary alcohol, "
            "and the carbon bearing the hydroxyl also carries a phenyl and two "
            "methyls. Disconnect one carbon to the alcohol carbon, the bond to a "
            "methyl group. The retrosynthetic arrow gives two synthons: a "
            "cationic fragment that is the rest of the molecule as an oxygen "
            "stabilised cation, and a methyl anion. Read each as a synthetic "
            "equivalent. The cation synthon corresponds to acetophenone, C8H8O "
            "with five degrees of unsaturation, the ring plus the carbonyl, "
            "because adding a nucleophile to the carbonyl carbon of acetophenone "
            "builds exactly the bond that was cut and leaves the oxygen as the "
            "alcohol. The methyl anion synthon corresponds to a methyl "
            "organometallic reagent, the stable equivalent that delivers a "
            "nucleophilic methyl. So the forward plan read off the analysis is: "
            "add a methyl nucleophile to the carbonyl of acetophenone. The "
            "disconnection turned one target into two simpler and available "
            "pieces, which is the whole job."
        ),
        try_it_prompt=(
            "The target is the secondary alcohol 1-phenylethanol, the carbon "
            "bearing the hydroxyl also carrying a phenyl, a methyl and a "
            "hydrogen. Propose a one bond disconnection at the alcohol carbon, "
            "state the two synthons, and name the carbonyl compound that serves "
            "as the electrophilic equivalent."
        ),
        try_it_answer=(
            "Disconnect the bond between the alcohol carbon and the methyl "
            "group. That gives a cationic synthon corresponding to benzaldehyde, "
            "C7H6O, the electrophilic equivalent, and a methyl anion synthon "
            "whose equivalent is a methyl organometallic reagent. Adding the "
            "nucleophilic methyl to the aldehyde carbon of benzaldehyde forms "
            "the disconnected bond and leaves the oxygen as the secondary "
            "alcohol. An equally valid disconnection cuts the bond to the phenyl "
            "instead, giving acetaldehyde and a phenyl anion equivalent; "
            "retrosynthesis routinely offers more than one route, and the choice "
            "is made on which pieces are more available."
        ),
        pitfall=(
            "The mistake that derails a first disconnection is treating a "
            "synthon as a reagent you can put in a flask. A methyl cation or a "
            "methyl anion is a way of bookkeeping which fragment brought the "
            "electrons, not a bottle on the shelf. The discipline is to pair "
            "every synthon with a real synthetic equivalent before moving on: a "
            "carbanion synthon becomes an organometallic reagent, a carbocation "
            "synthon becomes a carbonyl compound or an alkyl halide. Skip that "
            "translation and the analysis produces fragments that no forward "
            "reaction can supply, which is a plan on paper that cannot be run."
        ),
        claims=(
            Formula(PHENYLPROPANOL, "C9H12O", "2-phenylpropan-2-ol, the target"),
            Unsaturation(PHENYLPROPANOL, 4, "the benzene ring"),
            Formula(ACETOPHENONE, "C8H8O", "acetophenone, the carbonyl equivalent"),
            Unsaturation(ACETOPHENONE, 5, "ring plus carbonyl"),
            Formula(BENZALDEHYDE, "C7H6O", "benzaldehyde"),
            Unsaturation(BENZALDEHYDE, 5, "ring plus carbonyl"),
            Source(
                "The disconnection of a carbon carbon bond next to a carbon "
                "bearing oxygen back to a carbonyl electrophile and a carbanion "
                "equivalent, and the language of synthons and synthetic "
                "equivalents, follow the standard treatment of retrosynthetic "
                "analysis; which route is preferred is a strategic judgement, "
                "not a derivable fact.",
                COREY,
            ),
        ),
    ),
    "ORG2.MULTISTEP": Lesson(
        node="ORG2.MULTISTEP",
        objective=(
            "Order the steps of a short synthesis so that each transformation "
            "survives the next, using functional group interconversion and a "
            "protecting group to reach a target a direct route would spoil."
        ),
        build_on=(
            "Retrosynthesis gave you disconnections that name the pieces. A real "
            "sequence adds a second concern the analysis set aside: the reagent "
            "for one step may attack a group you need to keep, so the order of "
            "operations and the protection of vulnerable groups become part of "
            "the plan."
        ),
        core_idea=(
            "Two ideas turn a list of reactions into a working sequence. The "
            "first is functional group interconversion, changing one group into "
            "another to set up the disconnection you want or to move along an "
            "oxidation ladder: a primary alcohol oxidises to an aldehyde and on "
            "to a carboxylic acid, and each rung has its own place in a plan. "
            "The second is chemoselectivity through order and protection. When a "
            "molecule holds two groups that a reagent cannot tell apart, and you "
            "need to change only one, you either sequence the steps so the "
            "sensitive group is not present yet, or you protect it. A protecting "
            "group is a reversible cap: convert the vulnerable group into "
            "something inert, run the step that would have attacked it, then "
            "remove the cap to get the group back. A ketone or aldehyde is "
            "commonly protected as a cyclic acetal by reaction with a diol, "
            "because an acetal is unreactive toward the basic and nucleophilic "
            "reagents that a carbonyl is not, and the acetal is cleaved back to "
            "the carbonyl at the end. The cost is two extra steps, so protection "
            "is used when order alone cannot solve the selectivity problem."
        ),
        worked_example=(
            "Follow an oxidation ladder first, then a protection. Propan-1-ol, "
            "C3H8O, is a primary alcohol; a controlled oxidation takes it to "
            "propanal, C3H6O, and a stronger oxidation takes propanal on to "
            "propanoic acid, C3H6O2. Those three are the rungs, and knowing "
            "which one you want tells you how far to push the oxidation. Now a "
            "case where order is not enough. Suppose a target requires adding a "
            "carbon nucleophile to an ester elsewhere in a molecule that also "
            "carries a ketone, and the nucleophile would attack the ketone "
            "first. Protect the ketone. React it with a diol such as ethylene "
            "glycol, C2H6O2, and the ketone becomes a cyclic acetal: acetone, "
            "C3H6O, protected this way gives the dioxolane C5H10O2, with the "
            "loss of one water. The acetal is inert to the nucleophile, so the "
            "intended reaction runs cleanly on the ester, and mild aqueous acid "
            "at the end hydrolyses the acetal back to the ketone. The sequence "
            "is protect, react, deprotect, and its logic is entirely about "
            "keeping one group out of the way while another is changed."
        ),
        try_it_prompt=(
            "You need to run a reagent that attacks ketones on a molecule that "
            "contains both a ketone you must keep and an ester you want to "
            "change. You protect the ketone as a cyclic acetal, run the step, "
            "then remove the acetal. Acetone, C3H6O, protected with ethylene "
            "glycol becomes a dioxolane, C5H10O2. Account for every atom in that "
            "conversion, and say what is released."
        ),
        try_it_answer=(
            "Acetone is C3H6O and ethylene glycol is C2H6O2, which together hold "
            "C5H12O3. The dioxolane product is C5H10O2, and the atoms left over "
            "are H2O, one molecule of water. So the acetal forms with loss of "
            "one water: C3H6O plus C2H6O2 gives C5H10O2 plus H2O, and the count "
            "balances at five carbons, twelve hydrogens and three oxygens on "
            "each side. The water released is the signature of forming the two "
            "new carbon oxygen bonds of the acetal from the carbonyl and the two "
            "hydroxyls, and the same water is taken back up when the acetal is "
            "hydrolysed to return the ketone."
        ),
        pitfall=(
            "The instinct that fails is to run the most obvious reaction first "
            "and worry about the rest afterward. In a molecule with more than "
            "one reactive group, the first strong reagent often destroys "
            "something a later step needed, and no amount of skill at the "
            "individual reactions recovers it. The corrective is to plan the "
            "order and the protections before touching the first step: ask, for "
            "each reagent, what else in the molecule it could attack, and either "
            "sequence around that group or cap it. A protecting group is not an "
            "admission of defeat, it is the standard tool for the case where two "
            "groups cannot be told apart by a reagent and only one may change."
        ),
        claims=(
            Formula(PROPAN_1_OL, "C3H8O", "propan-1-ol"),
            Unsaturation(PROPAN_1_OL, 0),
            Formula(PROPANAL, "C3H6O", "propanal, one rung up the oxidation ladder"),
            Unsaturation(PROPANAL, 1, "the aldehyde carbonyl"),
            Formula(PROPANOIC_ACID, "C3H6O2", "propanoic acid, the next rung"),
            Unsaturation(PROPANOIC_ACID, 1, "the carboxyl carbonyl"),
            Formula(ACETONE, "C3H6O", "acetone, the ketone to be protected"),
            Unsaturation(ACETONE, 1, "the ketone carbonyl"),
            Formula(ETHYLENE_GLYCOL, "C2H6O2", "ethylene glycol, the diol"),
            Unsaturation(ETHYLENE_GLYCOL, 0),
            Formula(DIMETHYLDIOXOLANE, "C5H10O2", "the cyclic acetal, ketone protected"),
            Unsaturation(DIMETHYLDIOXOLANE, 1, "the dioxolane ring, no carbonyl"),
            Source(
                "Protection of a ketone or aldehyde as a cyclic acetal with a "
                "diol, its stability toward base and nucleophiles, and its "
                "removal by aqueous acid are standard protecting group practice; "
                "the specific reagents and conditions are procedural and not "
                "derivable here.",
                CLAYDEN,
            ),
        ),
    ),
}
