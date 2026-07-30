"""GEN1 fill B: missing lessons for Unit 4 (reactions and stoichiometry) and
Unit 5 (thermochemistry).

These nodes existed in the curriculum with a title and description but had no
Lesson, so a learner walking the unit hit a gap. This module authors only those
gaps and is merged into LESSONS by the loader; it defines no node and modifies
no other file.

General chemistry lessons carry an empty claims tuple where they assert nothing
structural, but any measured value stated in prose carries a Source claim naming
a real reference, and every molecule named carries a Formula claim re-derived by
RDKit. Worked-example numbers that are invented for the arithmetic are labelled
as chosen round values, not measurements.
"""

from __future__ import annotations

from app.data.claims import Formula, Source
from app.data.lesson_types import Lesson

LESSONS_GEN1_FILL_B = {
    "GEN1.NEUTRALIZATION": Lesson(
        node="GEN1.NEUTRALIZATION",
        objective=(
            "Write the molecular, complete ionic and net ionic equations for "
            "an acid base neutralization, and identify the salt and the water "
            "that result."
        ),
        build_on=(
            "You can already strip a molecular equation down to its net ionic "
            "form by cancelling spectator ions, and neutralization is the "
            "reaction where doing that reveals the same core event every time."
        ),
        core_idea=(
            "When a strong acid meets a strong base, the acid supplies hydrogen "
            "ions and the base supplies hydroxide ions, and those two combine "
            "to make water. Everything else in the beaker, the cation from the "
            "base and the anion from the acid, stays dissolved and unchanged, "
            "and together those leftover ions are called the salt. So the "
            "pattern acid plus base gives salt plus water is really two "
            "statements: the salt is the spectator pair that was there all "
            "along, and the water is the one thing that actually formed. Write "
            "the complete ionic equation and cancel the spectators and you are "
            "left with H+(aq) + OH-(aq) gives H2O(l) for any strong acid with "
            "any strong base, which is why the reaction releases nearly the "
            "same heat per mole no matter which strong acid and base you pick."
        ),
        worked_example=(
            "Neutralize hydrochloric acid with sodium hydroxide. The molecular "
            "equation is HCl(aq) + NaOH(aq) gives NaCl(aq) + H2O(l). Split "
            "every strong aqueous electrolyte into ions, keeping water whole "
            "because it is a liquid and barely ionizes: H+(aq) + Cl-(aq) + "
            "Na+(aq) + OH-(aq) gives Na+(aq) + Cl-(aq) + H2O(l). Now scan for "
            "species identical on both sides. Sodium ion is aqueous left and "
            "right, and chloride ion is aqueous left and right, so both are "
            "spectators and cross out. What survives is H+(aq) + OH-(aq) gives "
            "H2O(l). The sodium chloride you would recover by boiling the "
            "solution dry is the salt, and it was never chemically involved; "
            "the actual reaction was the hydrogen ion and the hydroxide ion "
            "making water."
        ),
        try_it_prompt=(
            "Write the net ionic equation for nitric acid neutralizing "
            "potassium hydroxide, HNO3(aq) + KOH(aq) gives KNO3(aq) + H2O(l). "
            "Name the salt as well."
        ),
        try_it_answer=(
            "H+(aq) + OH-(aq) gives H2O(l), the same net event as the "
            "hydrochloric acid case. Potassium ion and nitrate ion are aqueous "
            "and unchanged on both sides, so they are the spectators, and the "
            "salt they form is potassium nitrate, KNO3."
        ),
        pitfall=(
            "The trap is assuming the net ionic equation is always H+ + OH- "
            "gives H2O. That holds only when both the acid and the base are "
            "strong and fully separate into ions. A weak acid such as acetic "
            "acid, CH3COOH, stays mostly as intact molecules in solution, so it "
            "is written whole and the net ionic equation becomes CH3COOH(aq) + "
            "OH-(aq) gives CH3COO-(aq) + H2O(l), a different line entirely."
        ),
        misconception=None,
        claims=(
            Formula("Cl", "HCl", note="hydrochloric acid, the strong acid"),
            Formula("[Na+].[OH-]", "HNaO", note="sodium hydroxide, the strong base"),
            Formula("[Na+].[Cl-]", "ClNa", note="sodium chloride, the salt"),
            Formula("O", "H2O", note="water, the product common to all neutralizations"),
            Formula("O[N+](=O)[O-]", "HNO3", note="nitric acid in the try it"),
            Formula("[K+].[OH-]", "HKO", note="potassium hydroxide in the try it"),
            Formula("[K+].[O-][N+](=O)[O-]", "KNO3", note="potassium nitrate, the try it salt"),
            Formula("CC(=O)O", "C2H4O2", note="acetic acid, the weak acid in the pitfall"),
        ),
    ),
    "GEN1.YIELD": Lesson(
        node="GEN1.YIELD",
        objective=(
            "Distinguish theoretical, actual and percent yield, compute percent "
            "yield from a measured mass, and explain why real yields fall short "
            "of the calculation."
        ),
        build_on=(
            "You can already find the limiting reactant and the theoretical "
            "yield it predicts, and this lesson is about what happens when you "
            "run the reaction on a bench and weigh what you actually get."
        ),
        core_idea=(
            "The theoretical yield is the maximum mass of product the limiting "
            "reactant allows, the number stoichiometry hands you assuming every "
            "atom ends up where the equation says. The actual yield is what you "
            "collect and weigh after the reaction, filtering, drying and "
            "transferring, and it is almost always smaller. Percent yield is the "
            "actual divided by the theoretical, times one hundred, and it "
            "measures how close reality came to the ideal. Yields fall short for "
            "reasons that have nothing to do with the balanced equation being "
            "wrong: some reactant is lost stuck to glassware, some reacts by a "
            "competing side reaction into a different product, some reactions "
            "reach equilibrium before finishing, and purification throws away "
            "product along with impurities. Conservation of mass still holds, so "
            "the missing product did not vanish; it is somewhere other than your "
            "collection flask."
        ),
        worked_example=(
            "React 14.0 g of nitrogen with excess hydrogen to make ammonia: "
            "N2(g) + 3 H2(g) gives 2 NH3(g). Hydrogen is in excess, so nitrogen "
            "is limiting and sets the theoretical yield. Convert nitrogen to "
            "moles with its molar mass 28.02 g/mol: 14.0 / 28.02 = 0.4997 mol, "
            "call it 0.500 mol. Cross the arrow at 2 NH3 per 1 N2: 0.500 x 2 = "
            "1.00 mol of ammonia. Convert to grams with the molar mass of NH3, "
            "17.03 g/mol: 1.00 x 17.03 = 17.0 g, which is the theoretical yield. "
            "Now suppose the experiment actually collects 13.6 g of ammonia, a "
            "value read off the balance. The percent yield is (13.6 / 17.0) x "
            "100 = 80.0 percent, so one fifth of the possible ammonia never "
            "reached the flask, most of it left unreacted because this reaction "
            "reaches equilibrium well short of completion."
        ),
        try_it_prompt=(
            "A different run has a theoretical yield of 17.0 g of ammonia and "
            "achieves an 85.0 percent yield. What mass of ammonia do you "
            "actually collect?"
        ),
        try_it_answer=(
            "About 14.5 g. Percent yield times theoretical yield gives actual "
            "yield, so 0.850 x 17.0 = 14.5 g. Rearranging the percent yield "
            "definition this way lets you predict a real harvest from a known "
            "typical yield."
        ),
        pitfall=(
            "The trap is reporting a percent yield above one hundred and "
            "believing it. You cannot make more product than the atoms allow, "
            "so a value over one hundred means the weighed product was heavier "
            "than it should be, usually because it was still wet with solvent "
            "or carried an impurity. The fix is not in the arithmetic; it is "
            "drying and purifying the sample before weighing it."
        ),
        misconception=None,
        claims=(
            Formula("N#N", "N2", note="nitrogen, the limiting reactant"),
            Formula("[H][H]", "H2", note="hydrogen, in excess"),
            Formula("N", "H3N", note="ammonia, the product being weighed"),
        ),
    ),
    "GEN1.FIRSTLAW": Lesson(
        node="GEN1.FIRSTLAW",
        objective=(
            "Divide a situation into system and surroundings and apply the "
            "first law, dU = q + w, tracking the signs of heat and work."
        ),
        build_on=(
            "You can already tell heat, a transfer of energy, from temperature, "
            "a property of a sample, and the first law is the bookkeeping that "
            "says where that transferred energy goes and that none of it is "
            "lost."
        ),
        core_idea=(
            "To track energy you first draw a boundary. The system is the part "
            "you are studying, the reacting chemicals or the gas in a cylinder, "
            "and the surroundings are everything else, the flask, the bench, the "
            "room. Together they are the universe, and the first law of "
            "thermodynamics says the total energy of the universe is constant: "
            "energy the system loses the surroundings gains, exactly. For the "
            "system alone the change in internal energy is dU = q + w, where q "
            "is heat and w is work. The sign convention is written from the "
            "system's point of view: q is positive when heat flows into the "
            "system and negative when it flows out, and w is positive when the "
            "surroundings do work on the system and negative when the system "
            "does work on the surroundings, such as a gas pushing a piston out. "
            "Internal energy is a state function, so dU depends only on the "
            "start and end states, not on how the heat and work were split."
        ),
        worked_example=(
            "A gas sealed in a cylinder absorbs 150 J of heat from a flame and, "
            "as it warms, pushes the piston outward, doing 100 J of work on the "
            "surroundings. These two numbers are round values chosen to keep the "
            "arithmetic clean, not measurements of any particular gas. Take the "
            "gas as the system. Heat flows in, so q = +150 J. The system does "
            "work on the surroundings rather than receiving it, so w is "
            "negative, w = -100 J. Add them: dU = q + w = 150 + (-100) = +50 J. "
            "The internal energy of the gas rose by 50 J even though it gave 100 "
            "J back out as work, because the 150 J it took in was larger. From "
            "the surroundings' side the flame lost 150 J and the piston gained "
            "100 J, and 150 given out minus 100 taken back leaves the 50 J now "
            "stored in the gas, so the universe's energy did not change."
        ),
        try_it_prompt=(
            "A system releases 75 J of heat to its surroundings while the "
            "surroundings do 30 J of work on it. What is dU for the system?"
        ),
        try_it_answer=(
            "dU = -45 J. Heat leaves the system, so q = -75 J. Work is done on "
            "the system, so w = +30 J. Then dU = q + w = -75 + 30 = -45 J, and "
            "the system's internal energy fell by 45 J."
        ),
        pitfall=(
            "The trap is the sign of work. Work done by the system, a gas "
            "expanding against the outside, lowers the system's energy and "
            "enters dU = q + w as a negative number, not a positive one. Read "
            "work done on the system as positive and work done by the system as "
            "negative, and check the direction in words before you write the "
            "sign, because guessing it is the most common way this calculation "
            "goes wrong."
        ),
        misconception=None,
        claims=(
            Source(
                "The first law of thermodynamics as taught here, delta U equals q plus w with the stated sign convention.",
                "OpenStax Chemistry 2e chapter 5",
            ),
        ),
    ),
    "GEN1.HEATCAPACITY": Lesson(
        node="GEN1.HEATCAPACITY",
        objective=(
            "Distinguish heat capacity, specific heat and molar heat capacity, "
            "and convert between them for a given sample."
        ),
        build_on=(
            "You can already treat heat q as energy in transit governed by the "
            "first law, and heat capacity is the constant that connects a "
            "measured amount of that heat to the temperature change it causes."
        ),
        core_idea=(
            "Pour the same energy into a teaspoon of water and into a bathtub of "
            "water and the teaspoon warms far more, because temperature change "
            "depends on how much material has to share the energy. Heat capacity "
            "captures this. The heat capacity C of an object is the energy "
            "needed to raise that whole object by one degree Celsius, in joules "
            "per degree, and it grows with the size of the object, so it is an "
            "extensive property. Specific heat c divides that by mass to give "
            "the energy per gram per degree, an intensive property that belongs "
            "to the substance rather than the sample. Molar heat capacity does "
            "the same per mole instead of per gram. The three are linked by C = "
            "m times c and by molar heat capacity = c times molar mass, so once "
            "you know the specific heat of a material you can size the heat "
            "capacity of any amount of it."
        ),
        worked_example=(
            "Take 250. g of liquid water and find its heat capacity and its "
            "molar heat capacity from its specific heat, 4.184 J per gram per "
            "degree C. The heat capacity of this particular sample is C = m "
            "times c = 250. g x 4.184 J per gram per degree C = 1046 J per "
            "degree C, meaning this much water needs 1046 J to warm by one "
            "degree. That number belongs to the 250. g sample; double the water "
            "and you double the heat capacity. The molar heat capacity instead "
            "belongs to water as a substance: multiply the specific heat by the "
            "molar mass 18.02 g/mol, 4.184 J per gram per degree C x 18.02 g/mol "
            "= 75.4 J per mole per degree C. The specific heat and the molar "
            "heat capacity are the same for a drop or an ocean; only the object "
            "heat capacity C scales with the amount present."
        ),
        try_it_prompt=(
            "A 500. g block of an unknown metal absorbs 2250 J and warms from "
            "20.0 to 30.0 degrees C. What is the block's heat capacity C, and "
            "the metal's specific heat c?"
        ),
        try_it_answer=(
            "C = 225 J per degree C and c = 0.450 J per gram per degree C. The "
            "temperature change is 30.0 - 20.0 = 10.0 degrees, so C = q divided "
            "by change in temperature = 2250 / 10.0 = 225 J per degree C. Divide "
            "by the mass for the specific heat: c = C / m = 225 / 500. = 0.450 J "
            "per gram per degree C."
        ),
        pitfall=(
            "The trap is treating heat capacity and specific heat as the same "
            "quantity. A swimming pool has an enormous heat capacity and takes "
            "days of sun to warm, yet its specific heat is identical to that of "
            "a cup of water, 4.184 J per gram per degree C, because specific "
            "heat describes the substance while heat capacity describes the "
            "particular object and its mass."
        ),
        misconception=None,
        claims=(
            Formula("O", "H2O", note="water, whose specific heat anchors the worked example"),
            Source(
                statement=(
                    "The specific heat of liquid water is 4.184 J per gram per "
                    "degree C."
                ),
                citation="OpenStax Chemistry 2e, Table 5.1 (Specific Heats of Common Substances)",
            ),
        ),
    ),
    "GEN1.THERMOSTOICH": Lesson(
        node="GEN1.THERMOSTOICH",
        objective=(
            "Treat the enthalpy of a thermochemical equation as a conversion "
            "factor tied to the coefficients, and rescale it when the equation "
            "is multiplied or reversed."
        ),
        build_on=(
            "You can already scale a molar enthalpy of reaction to a given mass "
            "of one reactant, and a thermochemical equation packages that value "
            "with the balanced equation it belongs to so the amounts are "
            "explicit."
        ),
        core_idea=(
            "A thermochemical equation is a balanced equation with its enthalpy "
            "change written beside it, and the crucial point is that the "
            "enthalpy belongs to the exact amounts and physical states shown. "
            "Write 2 H2(g) + O2(g) gives 2 H2O(l) with an enthalpy of about "
            "-572 kJ and that value is the heat for two moles of H2 reacting, "
            "not one, and for liquid water, not vapour. Because enthalpy scales "
            "with amount, the coefficients turn the value into a set of "
            "conversion factors: -572 kJ per 2 mol H2, or equivalently -286 kJ "
            "per mole of H2. Two operations rescale it. Multiplying the whole "
            "equation by a number multiplies the enthalpy by the same number, "
            "and reversing the equation flips the sign, because running a "
            "process backward returns exactly the energy it released."
        ),
        worked_example=(
            "For 2 H2(g) + O2(g) gives 2 H2O(l) the enthalpy is about -572 kJ "
            "as written. How much heat comes from burning 5.00 g of hydrogen? "
            "Turn the equation into a factor per mole of hydrogen: -572 kJ for "
            "2 mol H2 is -286 kJ per mole of H2. Convert the mass to moles with "
            "the molar mass of H2, 2.016 g/mol: 5.00 / 2.016 = 2.48 mol H2. "
            "Multiply by the per-mole enthalpy: 2.48 mol x (-286 kJ/mol) = -709 "
            "kJ, so burning 5.00 g of hydrogen releases about 709 kJ. Notice "
            "the enthalpy did the same job a coefficient ratio does in ordinary "
            "stoichiometry: it carried you from moles of one species to an "
            "amount of energy."
        ),
        try_it_prompt=(
            "Using the same -572 kJ for 2 H2(g) + O2(g) gives 2 H2O(l), what is "
            "the enthalpy change for H2O(l) gives H2(g) + 1/2 O2(g)?"
        ),
        try_it_answer=(
            "+286 kJ. Reversing the equation flips the sign of -572 kJ to +572 "
            "kJ, and halving the equation, since it now makes one water instead "
            "of two, halves that to +286 kJ. Splitting water back into its "
            "elements takes in exactly the energy that forming it gave out."
        ),
        pitfall=(
            "The trap is reading the enthalpy as per mole of any species you "
            "like. The -572 kJ is per two moles of H2 and per two moles of "
            "water as the equation is written, so it is -286 kJ per mole of H2 "
            "but the full -572 kJ per mole of O2. Pin the value to the whole "
            "equation first, then divide by the coefficient of the specific "
            "substance you were given."
        ),
        misconception=None,
        claims=(
            Formula("[H][H]", "H2", note="hydrogen fuel in the worked example"),
            Formula("O=O", "O2", note="oxygen in the thermochemical equation"),
            Formula("O", "H2O", note="liquid water, the product whose state fixes the enthalpy"),
            Source(
                statement=(
                    "The reaction 2 H2(g) + O2(g) gives 2 H2O(l) has a standard "
                    "enthalpy of about -572 kJ, which is twice the standard "
                    "enthalpy of formation of liquid water."
                ),
                citation="OpenStax Chemistry 2e, Appendix G (Standard Thermodynamic Properties)",
            ),
        ),
    ),
    "GEN1.FORMATION": Lesson(
        node="GEN1.FORMATION",
        objective=(
            "Use standard enthalpies of formation from a reference table to "
            "compute the standard enthalpy of any reaction, applying the "
            "products minus reactants rule."
        ),
        build_on=(
            "You can already add and reverse known reactions with Hess's law, "
            "and standard enthalpies of formation are the one table of building "
            "block reactions that lets you skip straight to any target."
        ),
        core_idea=(
            "The standard enthalpy of formation of a compound is the enthalpy "
            "change when one mole of it forms from its elements in their "
            "standard states, and an element already in its standard state has "
            "a formation enthalpy defined as zero, because forming it from "
            "itself changes nothing. Collect these values into a table and "
            "Hess's law gives a shortcut for any reaction: the standard enthalpy "
            "of reaction is the sum of the formation enthalpies of the products, "
            "each times its coefficient, minus the same sum for the reactants. "
            "The logic is that you imagine tearing every reactant down into its "
            "elements, which costs the reverse of their formation enthalpies, "
            "then building every product up from those elements. Products minus "
            "reactants captures both steps in one line, and the elements in "
            "between cancel."
        ),
        worked_example=(
            "Find the standard enthalpy of burning methane, CH4(g) + 2 O2(g) "
            "gives CO2(g) + 2 H2O(l), from formation enthalpies. The reference "
            "values in kJ/mol are -74.6 for CH4(g), -393.5 for CO2(g), -285.8 "
            "for H2O(l), and 0 for O2(g) because oxygen gas is an element in its "
            "standard state. Apply products minus reactants, weighting each by "
            "its coefficient. Products: 1 x (-393.5) + 2 x (-285.8) = -393.5 - "
            "571.6 = -965.1 kJ. Reactants: 1 x (-74.6) + 2 x 0 = -74.6 kJ. "
            "Subtract: -965.1 - (-74.6) = -965.1 + 74.6 = -890.5 kJ. The "
            "negative result says burning methane releases about 890 kJ per "
            "mole, which is why natural gas heats a home, and the whole answer "
            "came from four table lookups and one subtraction."
        ),
        try_it_prompt=(
            "Using the reference values -110.5 kJ/mol for CO(g) and -393.5 "
            "kJ/mol for CO2(g), find the standard enthalpy of CO(g) + 1/2 O2(g) "
            "gives CO2(g). Remember that O2(g) is zero."
        ),
        try_it_answer=(
            "-283.0 kJ. Products minus reactants: the single product CO2 "
            "contributes -393.5, the reactants contribute -110.5 for CO and 0 "
            "for the half mole of O2, so -393.5 - (-110.5) = -393.5 + 110.5 = "
            "-283.0 kJ."
        ),
        pitfall=(
            "The trap is the direction of the subtraction. It is always "
            "products minus reactants; reverse it to reactants minus products "
            "and every sign comes out backward, turning an exothermic "
            "combustion into an impossible heat sink. The second trap is "
            "forgetting that elements in their standard states, O2, N2, solid "
            "carbon, contribute zero rather than being left out of the tally."
        ),
        misconception=None,
        claims=(
            Formula("C", "CH4", note="methane, the fuel"),
            Formula("O=O", "O2", note="oxygen, an element at standard state, formation enthalpy zero"),
            Formula("O=C=O", "CO2", note="carbon dioxide product"),
            Formula("O", "H2O", note="liquid water product"),
            Formula("[C-]#[O+]", "CO", note="carbon monoxide in the try it"),
            Source(
                statement=(
                    "Standard enthalpies of formation in kJ/mol: CH4(g) -74.6, "
                    "CO2(g) -393.5, H2O(l) -285.8, CO(g) -110.5; elements in "
                    "their standard states are 0."
                ),
                citation="OpenStax Chemistry 2e, Appendix G (Standard Thermodynamic Properties)",
            ),
        ),
    ),
    "GEN1.BONDENTHALPY": Lesson(
        node="GEN1.BONDENTHALPY",
        objective=(
            "Estimate the enthalpy of a gas phase reaction from average bond "
            "enthalpies, using bonds broken minus bonds formed, and explain why "
            "the result is an approximation."
        ),
        build_on=(
            "You can already get an exact reaction enthalpy from formation "
            "enthalpies, and bond enthalpies give a quicker estimate when a "
            "table of formation values is not at hand, at the cost of some "
            "accuracy."
        ),
        core_idea=(
            "Breaking a chemical bond always costs energy and forming one always "
            "releases it, and a bond enthalpy is the energy to break one mole of "
            "a particular bond in the gas phase. To estimate a reaction you add "
            "up the energy to break every bond in the reactants, which goes in, "
            "then subtract the energy released as every bond in the products "
            "forms, which comes out. In symbols the reaction enthalpy is about "
            "the sum of bonds broken minus the sum of bonds formed. The answer "
            "is an estimate for two reasons: tabulated bond enthalpies are "
            "averages over many different molecules rather than the exact value "
            "in your compound, and the method is defined for gases, so it "
            "ignores the extra energy tied up when a product is a liquid or a "
            "solid. It is a fast way to see whether a reaction should release or "
            "absorb heat and roughly how much."
        ),
        worked_example=(
            "Estimate the enthalpy of H2(g) + Cl2(g) gives 2 HCl(g) from bond "
            "enthalpies in kJ/mol: H-H is 436, Cl-Cl is 242, and H-Cl is 431. "
            "Count the bonds. The reactants have one H-H bond and one Cl-Cl "
            "bond to break, costing 436 + 242 = 678 kJ going in. The products "
            "are two H-Cl molecules, so two H-Cl bonds form, releasing 2 x 431 "
            "= 862 kJ coming out. Reaction enthalpy is bonds broken minus bonds "
            "formed: 678 - 862 = -184 kJ. The negative sign says the reaction "
            "releases energy, which fits, because the two strong H-Cl bonds "
            "formed give back more than the H-H and Cl-Cl bonds cost to break."
        ),
        try_it_prompt=(
            "Estimate the enthalpy of H2(g) + Br2(g) gives 2 HBr(g) using bond "
            "enthalpies in kJ/mol: H-H is 436, Br-Br is 193, and H-Br is 366."
        ),
        try_it_answer=(
            "About -103 kJ. Bonds broken: H-H plus Br-Br = 436 + 193 = 629 kJ. "
            "Bonds formed: two H-Br = 2 x 366 = 732 kJ. Broken minus formed = "
            "629 - 732 = -103 kJ, so the reaction is exothermic, though less so "
            "than the chlorine case because the H-Br bond is weaker than H-Cl."
        ),
        pitfall=(
            "The trap is flipping the sign by treating bond breaking as a "
            "release of energy. Breaking bonds always takes energy in and "
            "forming bonds always gives it out, so the formula is bonds broken "
            "minus bonds formed. Note this is the reverse ordering from the "
            "formation enthalpy rule of products minus reactants, and mixing the "
            "two orderings up is the usual source of a wrong sign here."
        ),
        misconception=None,
        claims=(
            Formula("[H][H]", "H2", note="hydrogen reactant"),
            Formula("ClCl", "Cl2", note="chlorine reactant"),
            Formula("Cl", "HCl", note="hydrogen chloride product"),
            Formula("BrBr", "Br2", note="bromine reactant in the try it"),
            Formula("Br", "HBr", note="hydrogen bromide product in the try it"),
            Source(
                statement=(
                    "Average bond enthalpies in kJ/mol: H-H 436, Cl-Cl 242, "
                    "H-Cl 431, Br-Br 193, H-Br 366."
                ),
                citation="OpenStax Chemistry 2e, Table 7.2 (Bond Energies)",
            ),
        ),
    ),
}
