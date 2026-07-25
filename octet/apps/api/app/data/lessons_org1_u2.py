"""ORG1 Unit 2: Acids and bases in organic chemistry.

Same rule as Unit 4: every structural fact stated in prose also appears as a
claim that RDKit re-derives when the test suite runs, so a wrong formula or a
wrong isomer relationship fails the build rather than reaching a learner.

This unit needs one extra discipline on top of that. pKa is not derivable from
structure, and nothing in this system can check a pKa value. So every pKa number
stated in these lessons carries a Source claim naming a real reference work and
the medium the value was measured in, because aqueous and dimethyl sulfoxide
values differ by many units and a comparison that mixes the two tables can
invert the answer. Where the author could not source a number with confidence,
the lesson teaches the ordering instead and says so. An honest ordering beats a
fabricated number, and the ordering is the part the learner needs anyway.
"""

from __future__ import annotations

from app.data.claims import Environments, Formula, Relationship, Source, Unsaturation
from app.data.lesson_types import Lesson

# Structures used across the unit, named once so a claim and its prose cannot
# drift apart. Every one of these was read back from RDKit rather than written
# from memory, including the charged species, whose formulas carry an explicit
# sign.
ACETIC_ACID = "CC(=O)O"
ACETATE = "CC(=O)[O-]"
ETHANOL = "CCO"
ETHOXIDE = "CC[O-]"
WATER = "O"
HYDROXIDE = "[OH-]"
PHENOL = "c1ccccc1O"
PHENOXIDE = "c1ccccc1[O-]"
CYCLOHEXANOL = "OC1CCCCC1"
# HOCH2CHO, a constitutional isomer of acetic acid. Same atoms, same formula,
# and an O-H that is nothing like as acidic, which is the whole point.
GLYCOLALDEHYDE = "OCC=O"
CHLOROACETIC_ACID = "ClCC(=O)O"
CHLOROACETATE = "ClCC(=O)[O-]"
TRIFLUOROETHANOL = "OCC(F)(F)F"
TRIFLUOROETHOXIDE = "[O-]CC(F)(F)F"
ETHANE = "CC"
ETHENE = "C=C"
ETHYNE = "C#C"
ACETYLIDE = "[C-]#C"
ETHANETHIOL = "CCS"
AMMONIA = "N"
BROMOMETHANE = "CBr"
BORON_TRIFLUORIDE = "FB(F)F"
ALUMINIUM_TRICHLORIDE = "Cl[Al](Cl)Cl"
# The ammonia-boron trifluoride adduct, with the formal charges the donation
# creates: nitrogen positive because it gave the pair, boron negative because
# it received it.
AMMONIA_BF3_ADDUCT = "[NH3+][B-](F)(F)F"
ACETONE = "CC(C)=O"
PROTONATED_ACETONE = "CC(C)=[OH+]"
CYANIDE = "[C-]#N"

# Citations, written once so the same reference reads the same way everywhere.
CRC = (
    "CRC Handbook of Chemistry and Physics, tables of dissociation constants "
    "of organic acids and bases and of inorganic acids, aqueous solution at "
    "25 degrees Celsius."
)
BORDWELL = (
    "Bordwell, F. G., Equilibrium acidities in dimethyl sulfoxide solution, "
    "Accounts of Chemical Research 1988, volume 21, pages 456 to 463; the "
    "Bordwell pKa table, DMSO solution."
)
BALLINGER_LONG = (
    "Ballinger, P.; Long, F. A., Acid ionization constants of alcohols, "
    "Journal of the American Chemical Society 1960, volume 82; aqueous "
    "solution. The value is reproduced in the pKa appendix of standard "
    "organic texts, for example Clayden, Organic Chemistry."
)
STANDARD_TEXT = (
    "Standard treatment; see an introductory organic text's chapter on acids "
    "and bases, for example Clayden, Organic Chemistry."
)

LESSONS_ORG1_U2 = {
    "ORG1.PKA": Lesson(
        node="ORG1.PKA",
        objective=(
            "Given the pKa of the acid on each side of a proton transfer, "
            "predict which side the equilibrium favours and estimate how far "
            "it lies in that direction."
        ),
        build_on=(
            "Unit 1 left you able to draw a Lewis structure and assign formal "
            "charge. A proton transfer is the first reaction of this course, "
            "and it is bookkeeping on exactly those electrons: one lone pair "
            "moves in, one bond breaks, and the formal charges move with them."
        ),
        core_idea=(
            "A Bronsted acid donates a proton and a Bronsted base accepts one, "
            "which means every proton transfer has an acid on both sides: the "
            "acid you started with, and the acid you create when the base picks "
            "the proton up. That second one is the conjugate acid, and "
            "comparing the two is the whole calculation. pKa is the negative "
            "logarithm of the acid dissociation constant, so a lower pKa means "
            "a stronger acid, and one pKa unit is a factor of ten in the "
            "equilibrium. Proton transfer favours the side holding the weaker "
            "acid, which is the side with the larger pKa, because that is where "
            "the proton is held more comfortably. The equilibrium constant is "
            "ten raised to the pKa of the acid you form minus the pKa of the "
            "acid you consume. Two cautions come with the arithmetic. pKa is "
            "measured, not derived, so it has to be looked up rather than "
            "reasoned out, and it is a property of an acid in a solvent rather "
            "than of the acid alone, so both numbers in a comparison must come "
            "from the same table."
        ),
        worked_example=(
            "Add sodium ethoxide to acetic acid and work out where the "
            "equilibrium sits. First name the acid on each side. On the left "
            "the acid is acetic acid, whose aqueous pKa is 4.76. On the right, "
            "ethoxide has taken the proton, so the acid on that side is "
            "ethanol, whose aqueous pKa is close to 16. Ethanol is the weaker "
            "acid by roughly eleven units, so the equilibrium favours the right "
            "and the constant is about ten to the 11. In practical terms the "
            "conversion to acetate is complete; there is no meaningful amount "
            "of acetic acid left. Now repeat the comparison in dimethyl "
            "sulfoxide, where the same two compounds are measured at 12.3 and "
            "29.8. Both numbers rose, because DMSO stabilises a small anion far "
            "less well than water does, and the gap widened from about eleven "
            "units to about seventeen. The direction did not change here, but "
            "the size of the answer did, and the only reason the comparison is "
            "meaningful at all is that both values came from the same table."
        ),
        try_it_prompt=(
            "Phenol has an aqueous pKa near 10, and water on the usual organic "
            "convention is assigned 15.7. You add sodium hydroxide to phenol. "
            "Which side does the equilibrium favour, and roughly by what "
            "factor? Name the acid on each side before you answer."
        ),
        try_it_answer=(
            "The acid on the left is phenol at 9.99. The acid on the right is "
            "water at 15.7, because hydroxide is what took the proton. Water is "
            "the weaker acid, so the equilibrium favours the products and "
            "hydroxide deprotonates phenol. The difference is 15.7 minus 9.99, "
            "about 5.7 units, so the constant is roughly ten to the 5.7, near "
            "half a million. Phenol is fully deprotonated by hydroxide for any "
            "practical purpose, which is the classical separation of a phenol "
            "from a neutral organic compound."
        ),
        pitfall=(
            "The trap is reading pKa as a property of a molecule rather than of "
            "a molecule in a solvent. Acetic acid is 4.76 in water and 12.3 in "
            "dimethyl sulfoxide, a difference of more than seven units, and a "
            "comparison that takes one number from an aqueous table and the "
            "other from a DMSO table can hand you the wrong direction with no "
            "sign that anything went wrong. Check the medium before you "
            "subtract. The second half of the trap is the sign of the "
            "logarithm. A smaller pKa is a stronger acid, so the equilibrium "
            "runs toward the larger pKa, and the intuition that bigger numbers "
            "mean more reaction gets the arrow backwards every time."
        ),
        claims=(
            Formula(ACETIC_ACID, "C2H4O2", "acetic acid"),
            Formula(ACETATE, "C2H3O2-", "acetate, the conjugate base"),
            Formula(ETHANOL, "C2H6O", "ethanol"),
            Formula(ETHOXIDE, "C2H5O-", "ethoxide, the base in the worked example"),
            Formula(PHENOL, "C6H6O", "phenol"),
            Formula(PHENOXIDE, "C6H5O-", "phenoxide"),
            Formula(WATER, "H2O", "water, the conjugate acid in the try-it"),
            Formula(HYDROXIDE, "HO-", "hydroxide"),
            Source(
                "Acetic acid has pKa 4.76 in water at 25 degrees Celsius.",
                CRC,
            ),
            Source(
                "Phenol has pKa 9.99 in water at 25 degrees Celsius.",
                CRC,
            ),
            Source(
                "Ethanol has an aqueous pKa close to 16.",
                BALLINGER_LONG,
            ),
            Source(
                "Acetic acid has pKa 12.3 and ethanol has pKa 29.8, both in "
                "dimethyl sulfoxide. These are DMSO values and must not be "
                "compared against aqueous values.",
                BORDWELL,
            ),
            Source(
                "Water is assigned pKa 15.7 on the convention common in "
                "organic chemistry, which divides the ionic product of water by "
                "the molar concentration of water, 55.5 moles per litre. Under "
                "the standard-state convention used in general chemistry the "
                "same equilibrium is quoted as 14.0, so the number is only "
                "meaningful alongside the convention it was taken from.",
                STANDARD_TEXT,
            ),
        ),
    ),
    "ORG1.ACIDITYFACTORS": Lesson(
        node="ORG1.ACIDITYFACTORS",
        objective=(
            "Rank the acidic sites in a set of structures by applying atom, "
            "resonance, induction and orbital in that order, and name which "
            "factor decided each comparison."
        ),
        build_on=(
            "You can now turn two pKa values into a direction and a "
            "magnitude. This lesson is for the far more common situation where "
            "you do not have the table in front of you: what it is about the "
            "structure that makes one pKa smaller than another."
        ),
        core_idea=(
            "Acidity is decided by the stability of the conjugate base, not by "
            "anything about the acid. Removing a proton leaves a negative "
            "charge behind, and whatever holds or spreads that charge better "
            "makes the acid stronger. Four structural factors do that work, and "
            "they are applied in a fixed order because an earlier one normally "
            "outweighs the later ones. First the atom carrying the charge: "
            "across a period electronegativity dominates, so a charge on oxygen "
            "beats the same charge on nitrogen or carbon, and down a group size "
            "dominates, so a charge on sulfur beats one on oxygen because it is "
            "spread over a much larger ion. Second, resonance: a charge "
            "delocalised over two or more atoms is more stable than one locked "
            "on a single atom. Third, induction: electronegative atoms pull "
            "electron density through the sigma framework and drain charge away "
            "from the anionic centre, an effect that falls off sharply with "
            "every bond of distance. Fourth, orbital: a lone pair in an orbital "
            "with more s character sits closer to the nucleus and is held more "
            "tightly, which is why an sp carbanion is more stable than an sp3 "
            "one. Work down the list and stop at the first factor that "
            "separates the two structures."
        ),
        worked_example=(
            "Rank ethane, ethanol, phenol and acetic acid from most to least "
            "acidic. Start with the atom, because it comes first. Ethane's only "
            "acidic hydrogen sits on carbon while the other three sit on "
            "oxygen, and oxygen is far better at carrying a negative charge, so "
            "ethane is the least acidic of the four and no further factor needs "
            "to be considered for it. That leaves three compounds whose "
            "conjugate bases all put the charge on oxygen, so the atom factor "
            "is now a tie and you move to resonance. Ethoxide has the charge "
            "locked on one oxygen with nowhere to go. Phenoxide delocalises it "
            "into the ring, onto three ring carbons. Acetate delocalises it over "
            "two oxygens, and the two carbon-oxygen bonds become equivalent. So "
            "ethanol is the weakest of the three. Phenol and acetic acid both "
            "have resonance, so ask where the delocalised charge actually goes: "
            "acetate puts it on a second oxygen, phenoxide puts it on carbon, "
            "and by the atom argument oxygen holds it better. It is worth being "
            "explicit about what did the work for phenol: not the ring, but the "
            "delocalisation the ring offers to phenoxide. Cyclohexanol has a "
            "hydroxyl on a ring as well, and with no pi system to accept the "
            "charge it behaves as an ordinary alcohol. The ranking is "
            "acetic acid, then phenol, then ethanol, then ethane. The aqueous "
            "measurements agree: 4.76, then 9.99, then close to 16, and then a "
            "value for ethane so far above those that it is an extrapolation "
            "rather than a measurement."
        ),
        try_it_prompt=(
            "Two comparisons. Which O-H is more acidic, ethanol or "
            "2,2,2-trifluoroethanol? And which is the stronger acid, acetic "
            "acid or chloroacetic acid? For each pair, name the factor that "
            "decides it before you look at the answer."
        ),
        try_it_answer=(
            "2,2,2-trifluoroethanol is the more acidic of the first pair. Both "
            "are alcohols, so the atom is a tie, and neither conjugate base has "
            "any resonance available, so that factor is a tie too. Induction "
            "decides it: three fluorines pull electron density through the "
            "sigma bonds and spread the alkoxide's charge away from the oxygen. "
            "Chloroacetic acid is the stronger acid of the second pair, and "
            "induction is again doing the work, with the chlorine draining "
            "charge from the carboxylate. Here you can put a size on the "
            "effect: the aqueous values are 2.86 for chloroacetic acid against "
            "4.76 for acetic acid, so a single chlorine on the carbon next to "
            "the carboxyl group is worth about 1.9 pKa units, a factor of "
            "roughly 80 in the equilibrium."
        ),
        pitfall=(
            "The most common error is reaching for resonance or induction "
            "before checking the atom. A carbanion stabilised by resonance is "
            "still usually a worse place for a charge than a plain alkoxide, so "
            "an argument that skips the first factor can rank a hydrocarbon "
            "above an alcohol. Work the list in order. The second error is "
            "judging acidity by looking at the acid rather than at the "
            "conjugate base. Acetic acid and glycolaldehyde are constitutional "
            "isomers, the same atoms in a different arrangement, and both carry "
            "an O-H; the acid molecules look comparably ordinary. Their "
            "conjugate bases do not. One is a delocalised carboxylate and the "
            "other is a localised alkoxide, and that difference, invisible "
            "until you take the proton off, is what separates them by many pKa "
            "units."
        ),
        claims=(
            Formula(ETHANE, "C2H6", "ethane, the carbon acid in the ranking"),
            Formula(ETHANOL, "C2H6O", "ethanol"),
            Formula(PHENOL, "C6H6O", "phenol"),
            Formula(ACETIC_ACID, "C2H4O2", "acetic acid"),
            Formula(ETHOXIDE, "C2H5O-", "ethoxide, charge localised on one oxygen"),
            Formula(PHENOXIDE, "C6H5O-", "phenoxide, charge delocalised into the ring"),
            Formula(ACETATE, "C2H3O2-", "acetate, charge delocalised over two oxygens"),
            Formula(CHLOROACETIC_ACID, "C2H3ClO2", "chloroacetic acid"),
            Formula(CHLOROACETATE, "C2H2ClO2-", "chloroacetate"),
            Formula(TRIFLUOROETHANOL, "C2H3F3O", "2,2,2-trifluoroethanol"),
            Formula(TRIFLUOROETHOXIDE, "C2H2F3O-", "its conjugate base"),
            Formula(
                CYCLOHEXANOL, "C6H12O",
                "cyclohexanol, an alcohol with no ring resonance available",
            ),
            Formula(ETHANETHIOL, "C2H6S", "ethanethiol, the sulfur analogue of ethanol"),
            Formula(ETHYNE, "C2H2", "ethyne, the sp carbon acid"),
            Formula(ETHENE, "C2H4", "ethene"),
            Formula(ACETYLIDE, "C2H-", "the acetylide anion, an sp carbanion"),
            Unsaturation(ACETIC_ACID, 1, "one carbon-oxygen double bond"),
            Unsaturation(PHENOL, 4, "a ring plus three formal double bonds"),
            Unsaturation(ETHYNE, 2, "a triple bond counts twice"),
            Relationship(
                ACETIC_ACID, GLYCOLALDEHYDE, "constitutional",
                "same formula, different connectivity, and only one conjugate "
                "base has resonance",
            ),
            Source(
                "Acetic acid has pKa 4.76 and phenol has pKa 9.99, both in "
                "water at 25 degrees Celsius.",
                CRC,
            ),
            Source(
                "Chloroacetic acid has pKa 2.86 in water at 25 degrees "
                "Celsius, against 4.76 for acetic acid in the same table.",
                CRC,
            ),
            Source(
                "Ethanol has an aqueous pKa close to 16.",
                BALLINGER_LONG,
            ),
            Source(
                "Hydrogen sulfide has an aqueous pKa near 7, well below the "
                "15.7 conventionally assigned to water, which is the anchor "
                "for the claim that acidity increases down a group. By the "
                "same ordering, ethanethiol is far more acidic than ethanol; "
                "this lesson states that ordering rather than a number for the "
                "thiol, because the author could not source the thiol value "
                "with confidence.",
                CRC,
            ),
            Source(
                "The ordering of hydrocarbon acidity is ethyne more acidic "
                "than ethene more acidic than ethane, tracking the s character "
                "of the carbon orbital holding the lone pair in the conjugate "
                "base. Ethyne is commonly tabulated near pKa 25 in water; the "
                "corresponding figures for ethene and ethane are "
                "extrapolations rather than measurements, so this lesson "
                "states only that they are far larger.",
                STANDARD_TEXT,
            ),
        ),
    ),
    "ORG1.NUCELEC": Lesson(
        node="ORG1.NUCELEC",
        objective=(
            "Classify a species as a nucleophile, an electrophile, a Lewis "
            "acid or a Lewis base, and identify which atom in it carries that "
            "role."
        ),
        build_on=(
            "You have been describing a base as something that brings a lone "
            "pair to a proton. Nothing in that description requires the target "
            "to be a proton. Widening the target from hydrogen to any "
            "electron-poor atom gives you the vocabulary that the rest of "
            "organic chemistry runs on."
        ),
        core_idea=(
            "A nucleophile is an electron-rich species that donates a pair of "
            "electrons to form a new bond, and an electrophile is the "
            "electron-poor species that accepts it. Lewis acid and Lewis base "
            "describe the same electron accounting: the Lewis base is the pair "
            "donor and the Lewis acid is the pair acceptor. The two vocabularies "
            "differ in emphasis rather than in content. Nucleophile and "
            "electrophile are the working terms for the roles two species play "
            "in a reaction, while Lewis acid and Lewis base describe which "
            "species holds the pair once it is over. What matters for reading "
            "structures is that the Bronsted picture is the special case where "
            "the electrophile happens to be a proton. Every Bronsted base is a "
            "Lewis base, but not every Lewis acid is a Bronsted acid: boron "
            "trifluoride has no proton to give and is still a strong acid, "
            "because its boron has an empty orbital. Read a structure for the "
            "signals. Lone pairs, a full negative charge, and pi bonds mark a "
            "nucleophilic atom. An empty orbital, a full positive charge, and "
            "the partially positive end of a polarised bond mark an "
            "electrophilic one."
        ),
        worked_example=(
            "Label the roles in three reactions. First, hydroxide and "
            "bromomethane. Bromine is more electronegative than carbon, so the "
            "carbon-bromine bond is polarised and the carbon carries a partial "
            "positive charge; that carbon is the electrophilic atom. Hydroxide "
            "has a full negative charge and three lone pairs on oxygen, so "
            "oxygen is the nucleophilic atom. The oxygen donates a pair to "
            "carbon and bromide leaves with the pair from the old bond. Second, "
            "ammonia and boron trifluoride. Boron here has only six valence "
            "electrons and an empty 2p orbital, which makes it a Lewis acid; "
            "the nitrogen lone pair of ammonia is the Lewis base. They combine "
            "into one adduct in which nitrogen carries a positive formal charge "
            "and boron a negative one, because the shared pair came entirely "
            "from nitrogen. Note that no proton moved anywhere in that step, "
            "which is exactly why the Bronsted vocabulary cannot describe it. "
            "Third, cyanide and acetone. Oxygen pulls the pi electrons of the "
            "carbon-oxygen double bond toward itself, leaving the carbonyl "
            "carbon electron-poor and electrophilic, while the carbon of "
            "cyanide is the nucleophilic atom that attacks it."
        ),
        try_it_prompt=(
            "Acetone is CH3COCH3. Which atom in it is electrophilic and which "
            "is nucleophilic? Give the reason for each, and answer for both "
            "before reading on."
        ),
        try_it_answer=(
            "The carbonyl carbon is the electrophilic atom. Oxygen is more "
            "electronegative than carbon, so the pi electrons of the "
            "carbon-oxygen double bond sit closer to oxygen and leave the "
            "carbon electron-poor. The oxygen of the same group is the "
            "nucleophilic atom: it carries two lone pairs and the extra pi "
            "density, which is why a strong acid protonates acetone on oxygen "
            "rather than anywhere else. One molecule can hold both roles on "
            "different atoms, and the reagent it meets decides which role it "
            "plays."
        ),
        pitfall=(
            "The trap is treating nucleophile as a synonym for base and "
            "electrophile as a synonym for acid. They overlap heavily but they "
            "are not the same axis. Basicity is an equilibrium property "
            "measured against a proton, which is what pKa reports, while "
            "nucleophilicity is a rate property measured against carbon. A "
            "species can rank high on one and low on the other, and iodide is "
            "the standard example: a much weaker base than hydroxide, and a "
            "faster nucleophile toward many alkyl halides. The second half of "
            "the trap is looking for an acidic proton in a Lewis acid. Boron "
            "trifluoride and aluminium trichloride contain no hydrogen at all "
            "and are among the strongest acids in the reagent cupboard, "
            "because acidity in the Lewis sense is about an empty orbital "
            "rather than a proton."
        ),
        claims=(
            Formula(HYDROXIDE, "HO-", "hydroxide, the nucleophile"),
            Formula(BROMOMETHANE, "CH3Br", "bromomethane, electrophilic at carbon"),
            Formula(AMMONIA, "H3N", "ammonia, the Lewis base"),
            Formula(BORON_TRIFLUORIDE, "BF3", "boron trifluoride, the Lewis acid"),
            Formula(
                AMMONIA_BF3_ADDUCT, "H3BF3N",
                "the adduct, with positive nitrogen and negative boron",
            ),
            Formula(
                ALUMINIUM_TRICHLORIDE, "AlCl3",
                "aluminium trichloride, a Lewis acid with no hydrogen in it",
            ),
            Formula(ACETONE, "C3H6O", "acetone"),
            Formula(
                PROTONATED_ACETONE, "C3H7O+",
                "acetone protonated on oxygen, not on carbon",
            ),
            Formula(CYANIDE, "CN-", "cyanide, nucleophilic at carbon"),
            Source(
                "A nucleophile is a reagent that forms a bond to its reaction "
                "partner by donating both bonding electrons; an electrophile is "
                "the reagent that accepts both of them. A Lewis acid is an "
                "electron-pair acceptor and a Lewis base is an electron-pair "
                "donor.",
                "IUPAC Compendium of Chemical Terminology (the Gold Book), "
                "entries for nucleophile, electrophile, Lewis acid and Lewis "
                "base.",
            ),
            Source(
                "Basicity and nucleophilicity are different properties: the "
                "first is an equilibrium constant measured against a proton, "
                "the second a rate measured against carbon, and they can rank "
                "the same set of species differently. Iodide is a weaker base "
                "than hydroxide yet reacts faster with many alkyl halides in "
                "common solvents.",
                STANDARD_TEXT,
            ),
        ),
    ),
    "ORG1.ARROWS": Lesson(
        node="ORG1.ARROWS",
        objective=(
            "Draw and read curved arrows for a proton transfer and for a Lewis "
            "acid-base step, placing every tail on a named electron pair and "
            "every head where that pair ends up."
        ),
        build_on=(
            "You can now say which species donates a pair of electrons and "
            "which accepts it. The curved arrow is how that sentence gets "
            "written down, and getting the notation right is what turns a "
            "mechanism into something that can be checked rather than believed."
        ),
        core_idea=(
            "A curved arrow shows the movement of a pair of electrons from "
            "where they are now to where they end up. The tail must sit on an "
            "electron pair that actually exists in the starting structure: a "
            "lone pair, or a bond. It never starts on an atom, never on a "
            "positive charge, and never on the place the electrons are going. "
            "The head lands between two atoms when a bond is forming, or on an "
            "atom when the pair is becoming a lone pair. A full-headed arrow "
            "moves two electrons; the single-headed fishhook moves one and "
            "belongs to radical chemistry. Electrons run from source to sink, "
            "which means every arrow runs from the electron-rich site toward "
            "the electron-poor one and never the other way. Two checks fall out "
            "of this and both are worth doing every time. Formal charge must "
            "balance across the step, with the atom that gives up a pair "
            "becoming more positive by one and the atom that receives it more "
            "negative by one. And no second-row atom may finish with more than "
            "eight electrons, so an arrow that delivers a pair to an atom that "
            "already has a full octet must be paired with a second arrow taking "
            "a pair away from it."
        ),
        worked_example=(
            "Draw hydroxide deprotonating acetic acid. Begin by choosing the "
            "target. Acetic acid has four hydrogens in two environments, three "
            "on the methyl carbon and one on oxygen, and the acidity argument "
            "from earlier in this unit says the O-H is the acidic one, so the "
            "arrows must point there. The step needs two arrows. The first "
            "starts on a lone pair of the hydroxide oxygen and ends at the "
            "acidic hydrogen: that is the bond being formed. The second starts "
            "on the O-H sigma bond of acetic acid and ends on the oxygen of "
            "that same bond: that is the bond being broken, and its pair stays "
            "behind on the oxygen as a new lone pair. The second arrow is not "
            "optional. Without it, the hydrogen would finish holding four "
            "electrons, which it cannot do. Now check the charges. The "
            "hydroxide oxygen went from minus one to zero as it became water, "
            "and the acetic acid oxygen went from zero to minus one as it "
            "became acetate, so the overall charge is minus one on both sides. "
            "Notice that the hydrogen itself never received an arrow. It is not "
            "moving electrons; it is moving as a bare nucleus between two "
            "electron pairs, and the arrows track the pairs."
        ),
        try_it_prompt=(
            "Ammonia and boron trifluoride combine into a single adduct. How "
            "many curved arrows does that step need, where does each tail sit, "
            "and what happens to the formal charge on nitrogen and on boron?"
        ),
        try_it_answer=(
            "One arrow. Its tail sits on the nitrogen lone pair of ammonia and "
            "its head lands between nitrogen and boron, where the new bond "
            "forms. There is no second arrow because nothing breaks: boron "
            "started with only six valence electrons and an empty 2p orbital, "
            "so it can accept a pair without exceeding an octet, and no "
            "existing bond has to give way. Nitrogen donated the pair, so it "
            "goes from zero to plus one, and boron accepted it, so it goes from "
            "zero to minus one. The adduct is overall neutral and carries those "
            "two formal charges internally."
        ),
        pitfall=(
            "The most common error is drawing the arrow from the hydrogen "
            "toward the base, or from a positive charge toward a negative one: "
            "an arrow whose tail sits where the electrons are not. The belief "
            "underneath that error is that the arrow tracks the atom that "
            "moves. It does not. It tracks a pair of electrons, and the atoms "
            "follow from where the pairs go. There is a test that catches this "
            "every time, and it takes a second. Look at the tail of each arrow "
            "you have drawn and name the pair it is sitting on, out loud, as "
            "either a lone pair on a specific atom or a specific bond. If you "
            "cannot name it, the arrow is wrong even when the products you drew "
            "happen to be right."
        ),
        claims=(
            Environments(
                ACETIC_ACID, (3, 1),
                "four hydrogens in two environments, three on carbon and one "
                "on oxygen; only the second is the target of the arrows",
            ),
            Formula(ACETIC_ACID, "C2H4O2", "acetic acid before the step"),
            Formula(HYDROXIDE, "HO-", "hydroxide, the base"),
            Formula(ACETATE, "C2H3O2-", "acetate after the step"),
            Formula(WATER, "H2O", "water after the step"),
            Formula(AMMONIA, "H3N", "ammonia in the try-it"),
            Formula(BORON_TRIFLUORIDE, "BF3", "boron trifluoride in the try-it"),
            Formula(
                AMMONIA_BF3_ADDUCT, "H3BF3N",
                "the adduct formed by a single arrow, neutral overall",
            ),
            Source(
                "A full-headed curved arrow denotes the movement of a pair of "
                "electrons and a single-headed fishhook arrow the movement of "
                "one; the tail is placed on the lone pair or bond that is the "
                "source of the electrons and the head where they arrive.",
                STANDARD_TEXT,
            ),
            Source(
                "The O-H of acetic acid, pKa 4.76 in water, is far more acidic "
                "than any of its C-H bonds, which is why a base removes the "
                "hydroxyl proton and not a methyl proton.",
                CRC,
            ),
        ),
    ),
}
