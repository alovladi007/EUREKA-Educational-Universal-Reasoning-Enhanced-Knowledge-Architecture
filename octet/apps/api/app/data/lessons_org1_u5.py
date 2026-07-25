"""ORG1 Unit 5: Understanding organic reactions.

This is the most conceptual unit in ORG1, and that makes it the most dangerous
one to author. Unit 4 could be policed structure by structure: a descriptor is
right or it is wrong and RDKit settles it. Most of what this unit teaches is
not derivable from a structure at all. Barrier heights, rate constants, bond
dissociation energies and the direction a reaction drifts on warming are facts
about the world, not facts about a graph.

The temptation that follows is to write freely, because nothing here can fail a
check. The discipline applied instead is the opposite one. Where a number is
load bearing it carries a Source with a real citation. Where a number would
have been decorative it was omitted and an ordering was taught instead, which
is what a learner needs anyway. Specifically omitted, on purpose: activation
energies for any reaction in this unit, product percentages for the
kinetic-versus-thermodynamic case, stabilisation energies in kJ/mol for the
carbocation ranking, and any fixed table of migratory aptitudes.

What can still be checked is checked. Every reaction in the unit is classified
by what it does to the molecular formula and to the degree of unsaturation, and
both of those are re-derived from structure when the tests run. Rearrangement
products are claimed as constitutional isomers of their starting materials,
which is a machine checkable statement of the whole point of that lesson.

Carbocations carry a charge, and the degrees-of-unsaturation arithmetic is only
valid for a neutral closed shell species, so the verifier refuses them by
design. That refusal is correct and was not worked around. Cations are claimed
by Formula, and Unsaturation claims are attached to their neutral precursors
where the count is meaningful.
"""

from __future__ import annotations

from app.data.claims import Environments, Formula, Relationship, Source, Unsaturation
from app.data.lesson_types import Lesson

# Structures used across the unit, named once so a claim and its prose cannot
# drift apart. Every SMILES here was round tripped through RDKit before it was
# written down, including the cations, whose formulas RDKit reports with the
# charge appended.
ETHENE = "C=C"
BROMOETHANE = "CCBr"
ETHANOL = "CCO"
BROMOPROPANE_2 = "CC(C)Br"
PROPENE = "CC=C"
PROPANE = "CCC"
BUT_1_ENE = "C=CCC"
BUT_2_ENE = "CC=CC"

METHANE = "C"
CHLORINE = "ClCl"
METHYL_RADICAL = "[CH3]"
BROMIDE = "[Br-]"
TBU_BROMIDE = "CC(C)(C)Br"
TBU_ALCOHOL = "CC(C)(C)O"

# Carbocations. Charged, so Unsaturation refuses them; Formula is the claim
# that applies.
METHYL_CATION = "[CH3+]"
ETHYL_CATION = "C[CH2+]"
ISOPROPYL_CATION = "C[CH+]C"
TBU_CATION = "C[C+](C)C"
ALLYL_CATION = "C=C[CH2+]"
BENZYL_CATION = "[CH2+]c1ccccc1"
# Neutral precursors, carried so the unsaturation count can be claimed on
# something the verifier will accept.
ALLYL_CHLORIDE = "C=CCCl"
BENZYL_CHLORIDE = "ClCc1ccccc1"

BUTADIENE = "C=CC=C"
ADDUCT_1_2 = "C=CC(C)Br"  # 3-bromobut-1-ene, the kinetic product
ADDUCT_1_4 = "CC=CCBr"  # 1-bromobut-2-ene, the thermodynamic product

# Rearrangement set. The two C5H11+ cations are constitutional isomers of one
# another, which is the checkable form of "a shift changes connectivity and not
# composition".
CHLORO_3_METHYLBUTANE_2 = "CC(Cl)C(C)C"
CHLORO_2_METHYLBUTANE_2 = "CCC(C)(C)Cl"
NEOPENTYL_CHLORIDE = "CC(C)(C)CCl"
SEC_CATION_C5 = "C[CH+]C(C)C"
TERT_CATION_C5 = "CC[C+](C)C"
NEOPENTYL_CATION = "CC(C)(C)[CH2+]"
METHYLBUTAN_2_OL_3 = "CC(O)C(C)C"
METHYLBUTAN_2_OL_2 = "CCC(C)(C)O"

LESSONS_ORG1_U5 = {
    "ORG1.REACTIONTYPES": Lesson(
        node="ORG1.REACTIONTYPES",
        objective=(
            "Sort any transformation into addition, elimination, substitution "
            "or rearrangement by comparing atom counts and degrees of "
            "unsaturation between starting material and product, without "
            "knowing the mechanism."
        ),
        build_on=(
            "Unit 4 had you compare two structures and ask how they are related "
            "in space. This unit asks a different question of the same "
            "comparison: what had to happen to turn one into the other. The "
            "bookkeeping you already do for degrees of unsaturation is the tool "
            "that answers it."
        ),
        core_idea=(
            "Four patterns cover nearly every reaction you will meet in this "
            "course, and you can tell them apart by counting rather than by "
            "recognising. In an addition, two molecules become one, a pi bond "
            "is consumed, and the degree of unsaturation falls by one. In an "
            "elimination, one molecule becomes two, a pi bond is created, and "
            "the degree of unsaturation rises by one. In a substitution, one "
            "group leaves and another takes its place at the same carbon: the "
            "molecular formula changes but the degree of unsaturation does not "
            "move at all. In a rearrangement, no atom enters or leaves; the "
            "same atoms are joined differently, so the product is a "
            "constitutional isomer of the starting material and shares its "
            "formula exactly. Addition and elimination are each other's "
            "reverse, which is why they compete so often, and knowing which one "
            "you are looking at is a matter of counting molecules on each side."
        ),
        worked_example=(
            "Take ethene, C2H4, reacting with HBr to give bromoethane, C2H5Br. "
            "Start by counting molecules: two on the left, one on the right, "
            "which already rules out elimination and rearrangement. Now count "
            "degrees of unsaturation. Ethene has one, from its single pi bond. "
            "Bromoethane has none, because bromine counts as a hydrogen in the "
            "unsaturation arithmetic and C2H5Br is as saturated as C2H6. One "
            "degree went in and zero came out, so a pi bond was consumed. That "
            "is an addition, and you reached the classification without drawing "
            "a single arrow. Now run the same audit on three more pairs. "
            "2-bromopropane, C3H7Br with zero degrees, going to propene, C3H6 "
            "with one degree, plus HBr: one molecule became two and a pi bond "
            "appeared, which is an elimination. Bromoethane going to ethanol, "
            "C2H6O: the formula changed but both compounds have zero degrees of "
            "unsaturation, which is a substitution. But-1-ene going to "
            "but-2-ene: both are C4H8, both have one degree, and nothing "
            "entered or left, so the atoms were rearranged."
        ),
        try_it_prompt=(
            "Buta-1,3-diene, C4H6, is converted into 3-bromobut-1-ene, C4H7Br. "
            "Classify the reaction. Work from the molecule count and the "
            "degrees of unsaturation before you name it."
        ),
        try_it_answer=(
            "It is an addition. Buta-1,3-diene has two degrees of unsaturation "
            "from its two pi bonds. 3-bromobut-1-ene has one, since the bromine "
            "counts as a hydrogen and C4H7Br is at the same saturation level as "
            "C4H8. One degree was consumed, so one pi bond was destroyed. The "
            "extra H and Br atoms in the product came from a second molecule, "
            "HBr, so two molecules became one. Two molecules to one, with a pi "
            "bond spent, is the addition pattern."
        ),
        pitfall=(
            "The error that recurs here is classifying by the reagent rather "
            "than by the bookkeeping, which comes from a reasonable but wrong "
            "belief that reagents have fixed jobs. HBr adds across an alkene "
            "and substitutes at an alcohol, and hydroxide substitutes at one "
            "halide and eliminates from another. The reagent does not carry the "
            "classification; the change in formula and unsaturation does. Count "
            "first, name second, and you will never have to remember which "
            "reagent does what."
        ),
        claims=(
            Formula(ETHENE, "C2H4", "ethene"),
            Unsaturation(ETHENE, 1, "one pi bond, spent by the addition"),
            Formula(BROMOETHANE, "C2H5Br", "bromoethane, the addition product"),
            Unsaturation(BROMOETHANE, 0, "halogen counts as hydrogen, so nothing is left"),
            Formula(ETHANOL, "C2H6O", "ethanol, the substitution product"),
            Unsaturation(ETHANOL, 0, "substitution does not move the count"),
            Formula(BROMOPROPANE_2, "C3H7Br", "2-bromopropane"),
            Unsaturation(BROMOPROPANE_2, 0, "the elimination substrate"),
            Formula(PROPENE, "C3H6", "propene, the elimination product"),
            Unsaturation(PROPENE, 1, "one degree gained when the pi bond formed"),
            Relationship(
                BUT_1_ENE, BUT_2_ENE, "constitutional",
                "a rearrangement product is a constitutional isomer of its "
                "starting material, which is what makes the formula test useless "
                "for it and the connectivity test decisive",
            ),
            Unsaturation(BUTADIENE, 2, "buta-1,3-diene, two pi bonds"),
            Formula(BUTADIENE, "C4H6", "buta-1,3-diene"),
            Formula(ADDUCT_1_2, "C4H7Br", "3-bromobut-1-ene"),
            Unsaturation(ADDUCT_1_2, 1, "one degree lower than the diene"),
        ),
    ),
    "ORG1.HOMOHETERO": Lesson(
        node="ORG1.HOMOHETERO",
        objective=(
            "Decide whether a given bond breaks homolytically or "
            "heterolytically, name the fragments each route produces, and draw "
            "the correct arrow: single barbed for one electron, double barbed "
            "for a pair."
        ),
        build_on=(
            "You can now say what a reaction does to a molecule's formula. This "
            "lesson asks the finer question underneath that classification: "
            "when a bond breaks, where do its two electrons go? There are only "
            "two answers, and every mechanism in the rest of the course is "
            "built from them."
        ),
        core_idea=(
            "A covalent bond holds two electrons, and there are exactly two "
            "ways to divide two electrons between two fragments. Homolysis "
            "splits them evenly, one to each fragment, producing two radicals: "
            "species with an unpaired electron and no charge. Heterolysis gives "
            "both electrons to one fragment, producing an anion that kept the "
            "pair and a cation that lost it. Which route a bond takes is "
            "decided mainly by how unevenly the two atoms already share the "
            "pair and by whether the surroundings can pay for separated charge. "
            "A bond between identical or similar atoms, broken in the gas phase "
            "or by light, goes homolytically, because there is no reason for "
            "either atom to take both electrons and no solvent to stabilise the "
            "ions if it did. A polar bond in a solvent that surrounds and "
            "stabilises ions goes heterolytically. The arrow notation records "
            "which one you mean, and it is not decoration. A single barbed "
            "arrow, often called a fishhook, moves one electron and belongs to "
            "radical chemistry. A double barbed arrow moves a pair and belongs "
            "to polar chemistry. The two notations do not mix inside a step."
        ),
        worked_example=(
            "Compare two bonds and follow each to its fragments. First, "
            "molecular chlorine, Cl2. The bond joins two identical atoms, so "
            "neither pulls the pair, and there is no polarity for a solvent to "
            "exploit. Under light it breaks homolytically into two chlorine "
            "atoms, each neutral, each with seven valence electrons and one of "
            "them unpaired. Two fishhook arrows, one curving to each atom. Now "
            "take 2-bromo-2-methylpropane, C4H9Br. The carbon-bromine bond is "
            "polar, bromine holds the pair more tightly, and in a solvent that "
            "stabilises ions the separated fragments are affordable. It breaks "
            "heterolytically: a single double barbed arrow runs from the middle "
            "of the bond to bromine, which leaves as bromide, Br minus, having "
            "taken both electrons. What remains is the tert-butyl cation, "
            "C4H9+. Audit the result the way you would audit a formula. The two "
            "fragment charges sum to zero, as they must, since the starting "
            "material was neutral. The cationic carbon now has three bonds and "
            "six valence electrons rather than eight, which is exactly what "
            "makes it reactive and what the next lessons are about."
        ),
        try_it_prompt=(
            "A chlorine atom, which has one unpaired electron, meets methane "
            "and pulls off a hydrogen to give HCl and a one carbon fragment. "
            "Did the C-H bond break homolytically or heterolytically, and what "
            "is that fragment?"
        ),
        try_it_answer=(
            "Homolytically, and the fragment is the methyl radical, CH3, "
            "neutral, with one unpaired electron on carbon. The reasoning is "
            "forced by the chlorine atom itself. It arrives with one unpaired "
            "electron, so it can contribute exactly one electron to the new H-Cl "
            "bond, which means it can accept exactly one from the C-H bond it "
            "is breaking. The other electron has nowhere to go except back onto "
            "carbon. Two fishhooks, no charges anywhere. Heterolysis would "
            "require CH3 minus or CH3 plus paired with a counter-ion, and no "
            "such counter-ion exists in this step."
        ),
        pitfall=(
            "The belief behind most errors here is that breaking a bond is one "
            "operation that happens to be drawn with an arrow. It is two "
            "different operations, and the arrow is how you say which. The "
            "symptom to watch for in your own work is a mechanism that starts "
            "with a radical and produces a charged species in the same step "
            "with no counter-ion in sight, or one that starts with an ion and "
            "produces a lone radical. Radicals beget radicals and ions beget "
            "ions. If a single step turns one kind into the other and no "
            "electron transfer is written, the arrow is wrong, and checking "
            "that the charges on both sides of the step sum to the same number "
            "will catch it every time."
        ),
        claims=(
            Formula(CHLORINE, "Cl2", "a nonpolar bond, so homolysis"),
            Formula(METHANE, "CH4", "methane, the substrate for the try it"),
            Formula(
                METHYL_RADICAL, "CH3",
                "the methyl radical: neutral, so the formula carries no charge, "
                "unlike the cations later in this unit",
            ),
            Formula(TBU_BROMIDE, "C4H9Br", "2-bromo-2-methylpropane, a polar bond"),
            Unsaturation(TBU_BROMIDE, 0, "no rings or pi bonds before the heterolysis"),
            Formula(TBU_CATION, "C4H9+", "the tert-butyl cation, which lost the pair"),
            Formula(BROMIDE, "Br-", "bromide, which kept the pair"),
            Environments(
                PROPANE, (6, 2),
                "propane's eight hydrogens fall into two environments, six on "
                "the end carbons and two in the middle, and those two kinds sit "
                "behind different bond dissociation energies",
            ),
            Source(
                "Homolytic carbon-hydrogen bond dissociation energies decrease "
                "along the series methyl, primary, secondary, tertiary: about "
                "439 kJ/mol for methane, about 423 kJ/mol for a primary C-H of "
                "ethane, about 413 kJ/mol for a secondary C-H of propane, and "
                "about 404 kJ/mol for the tertiary C-H of 2-methylpropane.",
                "Blanksby, S. J.; Ellison, G. B., Bond Dissociation Energies of "
                "Organic Molecules, Accounts of Chemical Research, 2003, volume "
                "36, pages 255-263.",
            ),
            Source(
                "The chlorine-chlorine bond dissociation energy is about 242 "
                "kJ/mol, which is low enough that near-ultraviolet light "
                "supplies it and homolysis proceeds without heating.",
                "CRC Handbook of Chemistry and Physics, table of bond "
                "dissociation energies.",
            ),
        ),
    ),
    "ORG1.ENERGYDIAGRAM": Lesson(
        node="ORG1.ENERGYDIAGRAM",
        objective=(
            "Read a reaction coordinate diagram: count steps, distinguish "
            "transition states from intermediates, identify the rate "
            "determining step, and say which energy difference controls rate "
            "and which controls the position of equilibrium."
        ),
        build_on=(
            "You know a bond can break one electron at a time or two at a time. "
            "An energy diagram is where those steps are laid out in order, with "
            "the price of each one drawn to scale, so that a mechanism stops "
            "being a list of arrows and becomes a shape you can reason about."
        ),
        core_idea=(
            "Plot energy on the vertical axis against reaction progress on the "
            "horizontal. Every maximum on that curve is a transition state and "
            "every minimum lying between the reactants and the products is an "
            "intermediate, and the distinction between those two is not a "
            "matter of degree. A transition state is the arrangement at the "
            "instant bonds are half made and half broken. It is not a "
            "substance, it has no lifetime, it cannot be isolated or put in a "
            "bottle, and it is drawn in brackets with a double dagger for that "
            "reason. An intermediate sits in a well with all its bonds fully "
            "formed, and it exists for a finite time even when that time is "
            "very short. Count the maxima and you have counted the steps. The "
            "height of the highest maximum above the reactants is the "
            "activation energy, and it sets how fast the reaction goes. The "
            "height difference between reactants and products sets how far the "
            "reaction goes. Those are two different numbers answering two "
            "different questions, and the diagram is useful precisely because "
            "it shows both at once. One further reading is available for free: "
            "the structure of a transition state resembles whichever "
            "neighbouring species it is closer to in energy, so an uphill step "
            "has a late, product-like transition state and a downhill step an "
            "early, reactant-like one."
        ),
        worked_example=(
            "Draw the two step conversion of 2-bromo-2-methylpropane, C4H9Br, "
            "into 2-methylpropan-2-ol, C4H10O, in water. Step one is the "
            "heterolysis you met in the last lesson: the C-Br bond breaks to "
            "give the tert-butyl cation, C4H9+, and bromide. On the diagram, "
            "start at the reactant level and climb to a maximum at which the "
            "C-Br bond is badly stretched and partial charges have developed "
            "but no ion is yet free. Continue down into a well. That well is "
            "the carbocation intermediate, a real species with a full set of "
            "formed bonds and six valence electrons at the cationic carbon. "
            "Step two is capture: water attacks the cation, so the curve climbs "
            "a second maximum, much lower than the first, and then falls to the "
            "product. Read the shape off: two maxima and one minimum between "
            "the ends, therefore two steps, two transition states and one "
            "intermediate. The first maximum is the higher of the two, so step "
            "one is the rate determining step, and the activation energy that "
            "controls the observed rate is measured from the reactant level up "
            "to that first peak. It is not measured from the bottom of the "
            "carbocation well up to the second peak, which is a smaller number "
            "describing a step that was never the bottleneck. Notice also that "
            "the substitution changed the formula from C4H9Br to C4H10O while "
            "leaving the degree of unsaturation at zero, which is the "
            "signature you learned two lessons ago."
        ),
        try_it_prompt=(
            "A reaction's energy diagram shows three maxima and two minima "
            "between reactants and products. How many steps does the mechanism "
            "have, how many intermediates, and how do you find the rate "
            "determining step?"
        ),
        try_it_answer=(
            "Three steps, one for each maximum, and two intermediates, one for "
            "each minimum lying between the two ends. The rate determining step "
            "is the one whose transition state is highest above the reactant "
            "level. That is the part worth slowing down for: you compare all "
            "three peaks against the starting line, not against the well "
            "immediately in front of each one. A step can have a small local "
            "climb out of a deep well and still have the highest absolute peak "
            "in the whole diagram, and that step is the bottleneck."
        ),
        pitfall=(
            "Two beliefs cause most of the trouble on these diagrams. The first "
            "is that an intermediate and a transition state are the same kind "
            "of object drawn at different heights. They are not, and the "
            "diagnostic is the shape rather than the label: a well is a "
            "species, a peak is not. The second is that a large drop from "
            "reactants to products means a fast reaction. It does not. "
            "Thermodynamics sets the drop and kinetics sets the barrier, and "
            "they are independent. A reaction can be strongly downhill and sit "
            "unchanged for years because the barrier in front of it is tall. "
            "Diamond turning into graphite is downhill, and you are not "
            "watching it happen."
        ),
        claims=(
            Formula(TBU_BROMIDE, "C4H9Br", "the reactant at the left of the diagram"),
            Unsaturation(TBU_BROMIDE, 0, "no rings, no pi bonds"),
            Formula(
                TBU_CATION, "C4H9+",
                "the intermediate: a real species sitting in a potential well, "
                "and charged, which is why no unsaturation claim is made for it",
            ),
            Formula(BROMIDE, "Br-", "the leaving group"),
            Formula(TBU_ALCOHOL, "C4H10O", "2-methylpropan-2-ol, the product"),
            Unsaturation(
                TBU_ALCOHOL, 0,
                "unchanged across the substitution, as the classification "
                "lesson predicts",
            ),
            Source(
                "A transition state is the configuration of maximum energy "
                "along the reaction path. It is not an isolable species and has "
                "no finite lifetime, which is what distinguishes it from a "
                "reaction intermediate occupying a potential energy minimum.",
                "IUPAC Compendium of Chemical Terminology (the Gold Book), "
                "entries for transition state and for reaction intermediate.",
            ),
            Source(
                "The Hammond postulate: the structure of a transition state "
                "resembles the structure of the species nearest to it in "
                "energy, so an endothermic step has a late, product-like "
                "transition state and an exothermic step an early, "
                "reactant-like one.",
                "Hammond, G. S., A Correlation of Reaction Rates, Journal of "
                "the American Chemical Society, 1955, volume 77, pages 334-338.",
            ),
            Source(
                "Reaction rate depends exponentially on the activation energy "
                "at a fixed temperature, so a modest increase in barrier height "
                "produces a large decrease in rate. No activation energy for "
                "the specific reaction drawn in this lesson is quoted, because "
                "the value depends on solvent and temperature and this course "
                "does not have a sourced figure for it.",
                "Atkins, P.; de Paula, J., Physical Chemistry, chapter on the "
                "rates of chemical reactions, section on the Arrhenius equation.",
            ),
        ),
    ),
    "ORG1.KINETICTHERMO": Lesson(
        node="ORG1.KINETICTHERMO",
        objective=(
            "Predict which of two competing products dominates as the "
            "temperature and the reaction time change, and justify the "
            "prediction from the shape of a two branch energy diagram rather "
            "than from a remembered rule."
        ),
        build_on=(
            "You can read a barrier and a well off a reaction coordinate. This "
            "lesson puts two products on one diagram, gives them different "
            "barriers and different well depths, and asks which one ends up in "
            "the flask."
        ),
        core_idea=(
            "When one starting material can reach two products by two different "
            "paths, two independent quantities decide the outcome and they do "
            "not have to agree. The lower barrier decides which product forms "
            "faster. The deeper well decides which product is more stable. If "
            "the branch point is irreversible under the conditions used, "
            "whatever forms first stays formed and you isolate the kinetic "
            "product, the one over the lower barrier. If it is reversible, "
            "product molecules can climb back to the branch point and try "
            "again, and given enough thermal energy and enough time the mixture "
            "drains into the deeper well and you isolate the thermodynamic "
            "product. Low temperature and short times favour kinetic control, "
            "because there is not enough energy to reverse anything. Higher "
            "temperature and long times favour thermodynamic control, because "
            "everything reverses and the system finds its minimum. The decisive "
            "point is that kinetic and thermodynamic are not labels belonging "
            "to the products. They are descriptions of the regime the "
            "conditions put you in, and the same pair of products can change "
            "places without either molecule changing at all."
        ),
        worked_example=(
            "Buta-1,3-diene, C4H6, reacts with HBr to give two isomeric "
            "products, both C4H7Br. Adding across the first two carbons gives "
            "3-bromobut-1-ene, and adding across carbons one and four gives "
            "1-bromobut-2-ene. Confirm the bookkeeping before reasoning about "
            "energy: the two products have the same formula and different "
            "connectivity, so they are constitutional isomers, and each has one "
            "degree of unsaturation, down from the diene's two, so exactly one "
            "pi bond was spent in each path. Both products come from the same "
            "intermediate, an allylic cation formed when the proton adds to a "
            "terminal carbon, so the branch point is where bromide chooses a "
            "carbon to attack. The resonance structure that places the charge "
            "on the secondary carbon is the more stable of the two, so it "
            "contributes more to the real ion, more positive charge sits there, "
            "and bromide finds that carbon over the lower barrier. That path "
            "gives 3-bromobut-1-ene, the kinetic product. The other path gives "
            "1-bromobut-2-ene, whose double bond is internal and therefore more "
            "substituted, so it sits in the deeper well and is the "
            "thermodynamic product. Run the reaction cold and the 1,2-product "
            "predominates. Warm the same mixture and the 1,2-product ionises "
            "back to the allylic cation, gets a second chance at the branch "
            "point, and the balance shifts toward the 1,4-product."
        ),
        try_it_prompt=(
            "The 1,2-product is isolated cleanly from a cold run, then returned "
            "to the reaction mixture and warmed. The ratio shifts toward the "
            "1,4-product. What does that experiment establish about the two "
            "barriers, and what does it fail to establish?"
        ),
        try_it_answer=(
            "It establishes that the 1,2-product can go backwards. Shifting "
            "toward the other product requires returning to the branch point, "
            "so the reverse barrier out of the 1,2-product must be crossable at "
            "the higher temperature, and it establishes that the 1,4-product "
            "sits in the deeper well, since that is where the system settles "
            "once it can choose freely. What it fails to establish is which "
            "product formed faster. Nothing about the warm experiment reports "
            "on the forward barriers; the cold run is the experiment that "
            "answered that, and it answered it precisely because nothing could "
            "reverse."
        ),
        pitfall=(
            "The belief that produces most wrong answers here is that the more "
            "stable product is the one that forms. Stability is the depth of a "
            "well and says nothing whatever about the height of the barrier in "
            "front of it. The second half of the same error is treating kinetic "
            "and thermodynamic as permanent properties of the two products, "
            "which shows up as a learner who memorises that the 1,2-adduct is "
            "the kinetic one and then cannot answer when the substrate changes. "
            "Ask instead whether the conditions allow the branch point to be "
            "revisited. If they do, the deeper well wins; if they do not, the "
            "lower barrier wins."
        ),
        claims=(
            Formula(BUTADIENE, "C4H6", "buta-1,3-diene"),
            Unsaturation(BUTADIENE, 2, "two pi bonds before the addition"),
            Formula(ADDUCT_1_2, "C4H7Br", "3-bromobut-1-ene, the 1,2-adduct"),
            Unsaturation(ADDUCT_1_2, 1, "one pi bond spent"),
            Formula(ADDUCT_1_4, "C4H7Br", "1-bromobut-2-ene, the 1,4-adduct"),
            Unsaturation(ADDUCT_1_4, 1, "the same count by the other path"),
            Relationship(
                ADDUCT_1_2, ADDUCT_1_4, "constitutional",
                "same formula, different connectivity: two products competing "
                "for one starting material, which is what makes the choice "
                "between them a question about energy rather than about atoms",
            ),
            Formula(
                ALLYL_CATION, "C3H5+",
                "the allyl cation, parent of the delocalised intermediate that "
                "both paths share",
            ),
            Unsaturation(
                ALLYL_CHLORIDE, 1,
                "allyl chloride, a neutral stand-in whose count can be checked; "
                "the cation itself is charged and is claimed by formula",
            ),
            Source(
                "Addition of HBr to buta-1,3-diene gives predominantly the "
                "1,2-adduct at low temperature, around -80 degrees Celsius, and "
                "predominantly the 1,4-adduct when the mixture is warmed, "
                "around 40 degrees Celsius, with the change arising from "
                "reversibility rather than from any change in the substrate. No "
                "product ratio is quoted here: reported percentages vary with "
                "solvent and with the source, and this course does not assert a "
                "figure it cannot pin down.",
                "Wade, L. G.; Simek, J. W., Organic Chemistry, chapter on "
                "conjugated systems, section on 1,2- versus 1,4-addition and "
                "kinetic versus thermodynamic control.",
            ),
            Source(
                "More highly substituted alkenes are more stable than their "
                "less substituted constitutional isomers, an ordering "
                "established by comparing heats of hydrogenation of isomeric "
                "alkenes to a common product.",
                "Carey, F. A.; Giuliano, R. M., Organic Chemistry, chapter on "
                "alkenes, section on relative stabilities from heats of "
                "hydrogenation.",
            ),
        ),
    ),
    "ORG1.CARBOCATION": Lesson(
        node="ORG1.CARBOCATION",
        objective=(
            "Draw a carbocation with the correct geometry and electron count, "
            "and rank a set of carbocations by stability using substitution "
            "class, hyperconjugation and resonance in that order of "
            "consideration."
        ),
        build_on=(
            "You have met the tert-butyl cation twice already, as the product "
            "of a heterolysis and as an intermediate in a well. This lesson is "
            "about why that particular cation was cheap enough to form, and "
            "which other cations are worth expecting."
        ),
        core_idea=(
            "A carbocation is a carbon with three bonds, no lone pair, and "
            "therefore six valence electrons instead of eight. Three bonding "
            "pairs push each other as far apart as they can, which makes the "
            "cationic carbon trigonal planar with about 120 degrees between its "
            "bonds, and that geometry leaves an empty p orbital standing "
            "perpendicular to the plane. Every fact about carbocation stability "
            "is a fact about getting electron density into that empty orbital. "
            "Alkyl groups do it weakly, by hyperconjugation: a C-H sigma bond "
            "on an adjacent carbon can line up with the empty p orbital and "
            "share its pair into it. More alkyl neighbours means more such "
            "bonds available, which gives the standard ordering, methyl less "
            "stable than primary, primary less stable than secondary, secondary "
            "less stable than tertiary. A pi system does it strongly, by "
            "resonance: an adjacent double bond or aromatic ring spreads the "
            "positive charge over two or more carbons instead of concentrating "
            "it on one. That is why allylic and benzylic cations are far more "
            "stable than their substitution class alone would predict, and why "
            "a primary benzylic cation is more stable than a plain secondary "
            "one. Check the substitution class first, then check for an "
            "adjacent pi system, and let the second check override the first."
        ),
        worked_example=(
            "Rank five cations and say what decides each comparison. The methyl "
            "cation, CH3+, has no neighbouring carbon at all, so not a single "
            "C-H bond can align with the empty p orbital and nothing relieves "
            "the charge. It is the least stable of the set and is not formed in "
            "ordinary solution chemistry. The ethyl cation, C2H5+, is primary "
            "and has one methyl group next door. The isopropyl cation, C3H7+, "
            "is secondary and has two. The tert-butyl cation, C4H9+, is "
            "tertiary and has three, and all nine of its hydrogens are "
            "equivalent by symmetry, which is another way of saying that nine "
            "C-H bonds occupy equivalent positions with respect to the empty p "
            "orbital. Ranking on that count alone gives methyl below ethyl "
            "below isopropyl below tert-butyl, and that is the ordering you "
            "should carry into every mechanism. Now add the allyl cation, "
            "C3H5+. Counted by substitution class it is primary and would fall "
            "next to the ethyl cation, but its positive charge is shared "
            "between two carbons by resonance, and it is far more stable than a "
            "primary cation with no pi system beside it. The count did not fail so "
            "much as it asked the wrong question, because the charge is no "
            "longer sitting on one carbon for hyperconjugation to relieve."
        ),
        try_it_prompt=(
            "Rank these three from least stable to most stable, and name the "
            "effect that decides each of the two comparisons: the ethyl cation, "
            "the isopropyl cation, and the benzyl cation."
        ),
        try_it_answer=(
            "Ethyl least, then isopropyl, then benzyl. Ethyl against isopropyl "
            "is settled by hyperconjugation and nothing else: primary against "
            "secondary, one alkyl neighbour against two, so isopropyl wins. "
            "Isopropyl against benzyl is not settled by that count at all. "
            "Benzyl is formally primary and would lose on alkyl neighbours, but "
            "its charge is delocalised into the ring, reaching the ortho and "
            "para positions as well as the benzylic carbon, and that resonance "
            "outweighs the one extra alkyl group isopropyl has. Reaching for "
            "the substitution count second, after checking for an adjacent pi "
            "system, is what gets this order right."
        ),
        pitfall=(
            "Two errors dominate. The first is counting hydrogens on the "
            "cationic carbon rather than carbons attached to it. Primary, "
            "secondary and tertiary describe how many carbon atoms are bonded "
            "to the charged centre; the hydrogens are whatever is left over, "
            "and counting them gives the reverse of the right answer. The "
            "second and more damaging error is applying the alkyl ranking to a "
            "cation adjacent to a pi system and stopping there. Resonance is a "
            "much larger effect than hyperconjugation, so any cation next to a "
            "double bond or an aromatic ring has to be checked for "
            "delocalisation before it is ranked at all. A learner who ranks "
            "purely by substitution class will place the benzyl cation at the "
            "bottom of the list alongside the ethyl cation, which inverts the "
            "correct answer rather than merely blurring it."
        ),
        claims=(
            Formula(METHYL_CATION, "CH3+", "the methyl cation, no alkyl neighbour"),
            Formula(ETHYL_CATION, "C2H5+", "the ethyl cation, primary"),
            Formula(ISOPROPYL_CATION, "C3H7+", "the isopropyl cation, secondary"),
            Formula(TBU_CATION, "C4H9+", "the tert-butyl cation, tertiary"),
            Environments(
                TBU_CATION, (9,),
                "all nine hydrogens of the tert-butyl cation are equivalent by "
                "symmetry, so nine C-H bonds stand in equivalent relation to "
                "the empty p orbital",
            ),
            Formula(ALLYL_CATION, "C3H5+", "the allyl cation, formally primary"),
            Formula(BENZYL_CATION, "C7H7+", "the benzyl cation, formally primary"),
            Unsaturation(
                ALLYL_CHLORIDE, 1,
                "allyl chloride, the neutral precursor; one degree, from the "
                "pi bond that does the delocalising",
            ),
            Unsaturation(
                BENZYL_CHLORIDE, 4,
                "benzyl chloride, the neutral precursor; four degrees, three "
                "ring pi bonds plus the ring itself",
            ),
            Source(
                "Long lived alkyl cations can be generated and observed "
                "directly in superacid media, and the tert-butyl cation is "
                "planar at the cationic carbon.",
                "Olah, G. A., My Search for Carbocations and Their Role in "
                "Chemistry, Nobel Lecture in Chemistry, 1994, published in "
                "Angewandte Chemie International Edition, 1995.",
            ),
            Source(
                "Gas phase thermochemical measurements place the stabilities "
                "of the methyl, ethyl, isopropyl and tert-butyl cations in the "
                "order methyl, primary, secondary, tertiary, from least to most "
                "stable. This course teaches the "
                "ordering only. No stabilisation energy in kJ/mol is quoted, "
                "because the gas phase values do not transfer to solution "
                "without correction and a solution number would be misleading.",
                "Lias, S. G.; Bartmess, J. E.; Liebman, J. F.; Holmes, J. L.; "
                "Levin, R. D.; Mallard, W. G., Gas-Phase Ion and Neutral "
                "Thermochemistry, Journal of Physical and Chemical Reference "
                "Data, 1988, volume 17, supplement 1; see also the NIST "
                "Chemistry WebBook.",
            ),
        ),
    ),
    "ORG1.REARRANGEMENT": Lesson(
        node="ORG1.REARRANGEMENT",
        objective=(
            "Predict when a carbocation will undergo a 1,2-shift, choose "
            "between a hydride shift and an alkyl shift from the structure of "
            "the neighbouring carbon, and recognise the rearranged product as a "
            "constitutional isomer of the product you first expected."
        ),
        build_on=(
            "You can now rank carbocations. This lesson follows the "
            "consequence: a cation that can reach a better rank by moving one "
            "group across one bond will generally do it, and the product you "
            "isolate is the evidence."
        ),
        core_idea=(
            "A 1,2-shift moves a hydrogen, or an alkyl group, from the carbon "
            "next door onto the cationic carbon, and the group that moves takes "
            "its bonding pair with it. Because the pair leaves with the "
            "migrating group, the carbon it left behind is the one that ends up "
            "positive. That is the whole motion: one group across one bond, "
            "charge travelling the other way. Two conditions decide whether it "
            "happens. First, there has to be something to gain, because a shift "
            "runs from a less stable cation toward a more stable one, typically "
            "secondary to tertiary, and a shift that would demote the cation "
            "does not occur. Second, the migrating group must sit on a carbon "
            "directly adjacent to the cationic centre, close enough for its "
            "bond to align with the empty p orbital. Which group moves is "
            "settled by what is available: a hydride shift is the case you will "
            "meet most often because a neighbouring carbon usually carries a "
            "hydrogen, and when the neighbour has no hydrogen an alkyl group "
            "migrates instead. The consequence for you as a reader of reactions "
            "is that the carbon skeleton of the product need not be the "
            "skeleton of the starting material, and the product you actually "
            "isolate will be a constitutional isomer of the one you predicted "
            "without allowing for the shift."
        ),
        worked_example=(
            "Ionise 2-chloro-3-methylbutane, C5H11Cl, in a solvent that "
            "supports separated ions, and trap the resulting cation with water. "
            "Losing chloride puts the charge on C2, giving a secondary cation, "
            "C5H11+. Before predicting the product, look at the neighbours of "
            "C2. C3 carries one hydrogen and two methyl groups, which makes C3 "
            "a tertiary carbon and the hydrogen on it the interesting one. Move "
            "that hydrogen with its bonding pair from C3 across to C2. Now C2 "
            "has a complete set of four bonds and C3 carries the positive "
            "charge, and C3 is attached to three carbons, so the cation is "
            "tertiary. Same formula, C5H11+, different connectivity, better "
            "cation, and the shift is fast enough to happen before most "
            "nucleophiles arrive. Trap that rearranged cation and the alcohol "
            "you isolate is 2-methylbutan-2-ol, C5H12O, not the "
            "3-methylbutan-2-ol you would have written from the starting "
            "skeleton. Those two alcohols share a formula and differ in "
            "connectivity, so they are constitutional isomers, and finding the "
            "rearranged one in the flask is direct evidence that a free "
            "carbocation existed along the way."
        ),
        try_it_prompt=(
            "1-chloro-2,2-dimethylpropane, C5H11Cl, ionises to a primary "
            "cation. The neighbouring carbon carries three methyl groups and no "
            "hydrogen at all. Which shift is available, what cation results, and "
            "how does the substitution product relate to the starting chloride?"
        ),
        try_it_answer=(
            "No hydride shift is available, because the adjacent carbon has no "
            "hydrogen to give. A methyl group migrates instead, carrying its "
            "bonding pair from C2 across to C1. The primary neopentyl cation, "
            "C5H11+, becomes the tertiary 2-methylbutan-2-yl cation, C5H11+, "
            "which is a large improvement and a strong driving force. The "
            "substitution product built from that cation has a different carbon "
            "skeleton from the starting material: 2-chloro-2-methylbutane is a "
            "constitutional isomer of 1-chloro-2,2-dimethylpropane, the same "
            "C5H11Cl joined differently. One nuance worth carrying forward: a "
            "primary cation is high enough in energy that this case is usually "
            "described as the migration accompanying the ionisation rather than "
            "following it as a separate step."
        ),
        pitfall=(
            "The belief that produces the mistake is that the carbon skeleton "
            "is fixed, and everything before this unit encouraged it. Naming, "
            "formula work and stereochemistry all treat the skeleton as the one "
            "thing that stays put while substituents come and go. Once a "
            "carbocation exists, the skeleton is negotiable. The symptom is a "
            "confidently predicted product that never appears, with an isomer "
            "of it appearing instead, and the fix is procedural: before writing "
            "any product from a cation, check every carbon adjacent to the "
            "charged centre for a hydrogen or an alkyl group whose migration "
            "would move the cation up a class. Note the other half of this "
            "habit too. A tertiary cation has nothing to gain, so it does not "
            "rearrange, and the absence of rearrangement in such a case is not "
            "evidence against a carbocation mechanism."
        ),
        claims=(
            Formula(
                CHLORO_3_METHYLBUTANE_2, "C5H11Cl",
                "2-chloro-3-methylbutane, the starting material",
            ),
            Unsaturation(CHLORO_3_METHYLBUTANE_2, 0, "no rings, no pi bonds"),
            Formula(
                SEC_CATION_C5, "C5H11+",
                "the secondary cation formed on ionisation, before the shift",
            ),
            Formula(
                TERT_CATION_C5, "C5H11+",
                "the tertiary cation after the hydride shift, same formula",
            ),
            Relationship(
                SEC_CATION_C5, TERT_CATION_C5, "constitutional",
                "a 1,2-shift changes connectivity and not composition, which is "
                "exactly what a constitutional isomer relationship asserts",
            ),
            Formula(
                METHYLBUTAN_2_OL_3, "C5H12O",
                "3-methylbutan-2-ol, the product predicted without a shift",
            ),
            Formula(
                METHYLBUTAN_2_OL_2, "C5H12O",
                "2-methylbutan-2-ol, the product actually isolated",
            ),
            Unsaturation(METHYLBUTAN_2_OL_2, 0, "the substitution left the count alone"),
            Relationship(
                METHYLBUTAN_2_OL_3, METHYLBUTAN_2_OL_2, "constitutional",
                "the predicted and observed alcohols are isomers, which is the "
                "checkable statement of what a rearrangement costs a careless "
                "prediction",
            ),
            Formula(
                NEOPENTYL_CHLORIDE, "C5H11Cl",
                "1-chloro-2,2-dimethylpropane, the alkyl shift case",
            ),
            Unsaturation(NEOPENTYL_CHLORIDE, 0, "saturated before ionisation"),
            Environments(
                NEOPENTYL_CHLORIDE, (9, 2),
                "nine equivalent methyl hydrogens and two on the carbon bearing "
                "chlorine; the ratio shows that no hydrogen sits on the carbon "
                "adjacent to the future cationic centre, which is why an alkyl "
                "group has to migrate",
            ),
            Formula(NEOPENTYL_CATION, "C5H11+", "the primary neopentyl cation"),
            Relationship(
                NEOPENTYL_CATION, TERT_CATION_C5, "constitutional",
                "the methyl shift, stated as an isomer relationship",
            ),
            Relationship(
                NEOPENTYL_CHLORIDE, CHLORO_2_METHYLBUTANE_2, "constitutional",
                "the rearranged substitution product against the starting "
                "skeleton",
            ),
            Formula(
                CHLORO_2_METHYLBUTANE_2, "C5H11Cl",
                "2-chloro-2-methylbutane, the rearranged chloride",
            ),
            Source(
                "The carbocation 1,2-shift, in which hydrogen or an alkyl group "
                "migrates with its bonding pair to an adjacent electron "
                "deficient carbon, was proposed as the common basis of a large "
                "family of molecular rearrangements.",
                "Whitmore, F. C., The Common Basis of Intramolecular "
                "Rearrangements, Journal of the American Chemical Society, "
                "1932.",
            ),
            Source(
                "Relative migratory aptitudes in 1,2-shifts depend on the "
                "substrate, the leaving group and the medium and do not form a "
                "single fixed ordering. This course therefore predicts shifts "
                "from the stability gained by the cation and from which groups "
                "are physically available on the adjacent carbon, and does not "
                "quote a migratory aptitude table.",
                "Carey, F. A.; Sundberg, R. J., Advanced Organic Chemistry, "
                "Part A: Structure and Mechanisms, chapter on carbocations, "
                "carbenes and related intermediates, section on rearrangement.",
            ),
        ),
    ),
}
