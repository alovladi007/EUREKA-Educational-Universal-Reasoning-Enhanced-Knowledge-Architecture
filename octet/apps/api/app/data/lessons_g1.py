"""G1 tier lessons: General Chemistry 1.

Twenty four lessons, one per G1 node in app/data/curriculum.py. Every lesson
carries the full six part arc from the teaching model, and the compliance
checker rejects any lesson with an empty part.
"""

from __future__ import annotations

from app.data.lesson_types import Lesson

LESSONS: dict[str, Lesson] = {
    "C.G1.FORMULA": Lesson(
        node="C.G1.FORMULA",
        objective=(
            "State exactly which questions a chemical formula answers about a "
            "substance and which it leaves open."
        ),
        build_on=(
            "You already turn a name into a formula and back, so now you ask "
            "what that string of symbols actually claims about the substance."
        ),
        core_idea=(
            "A molecular formula is a headcount of atoms in one molecule. The "
            "vinegar in your kitchen contains acetic acid, C2H4O2, which means "
            "one molecule holds 2 carbon atoms, 4 hydrogen atoms and 2 oxygen "
            "atoms. An empirical formula is that same headcount reduced to the "
            "smallest whole number ratio, so acetic acid has the empirical "
            "formula CH2O. The formula does not tell you how the atoms are "
            "connected, what shape the molecule has, or whether the substance "
            "is a liquid you can pour on a salad. Two different substances can "
            "share an empirical formula, which is why the reduced ratio is a "
            "weaker piece of information than the full count."
        ),
        worked_example=(
            "Take glucose, the sugar in your blood, molecular formula C6H12O6. "
            "To reduce it, find the largest number that divides every "
            "subscript. Here 6, 12 and 6 all divide by 6. Dividing gives "
            "6/6 = 1 carbon, 12/6 = 2 hydrogen, 6/6 = 1 oxygen, so the "
            "empirical formula is CH2O. Now do the same for acetic acid, "
            "C2H4O2. The subscripts 2, 4 and 2 all divide by 2, giving "
            "2/2 = 1 carbon, 4/2 = 2 hydrogen, 2/2 = 1 oxygen, which is again "
            "CH2O. So glucose and acetic acid have identical empirical "
            "formulas even though one is a sweet solid and the other is the "
            "sour liquid in vinegar. The molecular formula separates them and "
            "the empirical formula does not."
        ),
        try_it_prompt=(
            "Hydrogen peroxide, the antiseptic in the brown bottle, has the "
            "molecular formula H2O2. What is its empirical formula, and does "
            "that empirical formula distinguish it from water?"
        ),
        try_it_answer=(
            "HO. Both subscripts divide by 2, giving 1 hydrogen to 1 oxygen. "
            "It does distinguish peroxide from water, because water is H2O, "
            "which is already in lowest terms at 2 hydrogen to 1 oxygen."
        ),
        pitfall=(
            "The trap is treating the empirical formula as the substance's "
            "identity. CH2O is not a substance. Glucose (C6H12O6) and acetic "
            "acid (C2H4O2) both reduce to CH2O, and you cannot drink one of "
            "them on cereal."
        ),
        misconception="EMP-MOL",
    ),
    "C.G1.MOLE": Lesson(
        node="C.G1.MOLE",
        objective=(
            "Convert between mass, moles and number of particles for any "
            "substance whose formula you know."
        ),
        build_on=(
            "A formula tells you how many atoms of each element sit in one "
            "unit, and the mole turns that per unit count into something you "
            "can weigh on a balance."
        ),
        core_idea=(
            "You already count by weighing whenever it is impractical to count "
            "one by one. A hardware store does not count 5000 washers, it "
            "weighs them and divides by the mass of one. Chemistry has the "
            "same problem, only far worse, because atoms are far too small and "
            "numerous to count. A mole is a fixed count of particles, "
            "6.022 x 10^23 of them, chosen so that the mass in grams of one "
            "mole of a substance equals the mass number you read off the "
            "periodic table. That is the whole trick: the balance measures "
            "grams, the molar mass converts grams to moles, and moles are a "
            "count."
        ),
        worked_example=(
            "You pour 45.0 g of water into a beaker and want to know how many "
            "molecules that is. First build the molar mass of H2O from the "
            "periodic table: hydrogen is 1.008 g/mol and there are two of "
            "them, so 2 x 1.008 = 2.016, and oxygen is 16.00 g/mol. Adding "
            "gives 2.016 + 16.00 = 18.02 g/mol. Now convert mass to moles by "
            "dividing: 45.0 g divided by 18.02 g/mol = 2.50 mol. Then convert "
            "moles to molecules by multiplying by Avogadro's number: "
            "2.50 mol x 6.022 x 10^23 molecules/mol = 1.50 x 10^24 molecules. "
            "Notice the units cancel in each step, grams over grams per mole "
            "leaving moles, then moles times molecules per mole leaving "
            "molecules. That cancellation is your check that you divided when "
            "you should have divided."
        ),
        try_it_prompt=(
            "How many moles of water are in 9.01 g of water? Use the molar "
            "mass built in the worked example."
        ),
        try_it_answer=(
            "0.500 mol. Dividing 9.01 g by 18.02 g/mol gives exactly 0.500, "
            "because 9.01 g is half of the 18.02 g that one mole weighs."
        ),
        pitfall=(
            "The trap is assuming equal masses mean equal numbers of "
            "particles. They almost never do. 1.00 g of hydrogen gas is "
            "1.00/2.016 = 0.496 mol, while 1.00 g of oxygen gas is "
            "1.00/32.00 = 0.0313 mol, so the same mass of hydrogen holds "
            "about sixteen times as many molecules."
        ),
        misconception="MOLES-NOT-MASS",
    ),
    "C.G1.PERCENTCOMP": Lesson(
        node="C.G1.PERCENTCOMP",
        objective=(
            "Calculate the mass percent of each element in a compound from its "
            "formula, and use it to find the mass of one element in a sample."
        ),
        build_on=(
            "You can already build a molar mass by adding up the atoms in a "
            "formula, and percent composition just asks what fraction of that "
            "total each element contributed."
        ),
        core_idea=(
            "Percent composition is a recipe stated by mass rather than by "
            "count. A bag of fertilizer labelled with a nitrogen percentage is "
            "telling you exactly this: out of every 100 g in the bag, that "
            "many grams are nitrogen atoms. To get it from a formula you take "
            "the total mass contributed by one element in one mole, divide by "
            "the molar mass of the whole compound, and multiply by 100. The "
            "percentages must sum to 100, which is a free check on your "
            "arithmetic. Because it is a mass fraction, it scales: if a "
            "compound is 27.29 percent carbon, then any sample of it is "
            "27.29 percent carbon by mass, whether the sample is 1 g or 1 kg."
        ),
        worked_example=(
            "Find the percent composition of carbon dioxide, CO2, the gas you "
            "exhale. Build the molar mass first: carbon is 12.01 g/mol, and "
            "two oxygens are 2 x 16.00 = 32.00 g/mol, so the total is "
            "12.01 + 32.00 = 44.01 g/mol. The carbon percentage is "
            "(12.01 / 44.01) x 100 = 27.29 percent. The oxygen percentage is "
            "(32.00 / 44.01) x 100 = 72.71 percent. Check the sum: "
            "27.29 + 72.71 = 100.00 percent, so nothing was lost. Now use it. "
            "In a 50.0 g sample of CO2 the mass of carbon is "
            "0.2729 x 50.0 g = 13.6 g, and the rest, 50.0 - 13.6 = 36.4 g, is "
            "oxygen."
        ),
        try_it_prompt=(
            "Ammonia is NH3. What is its mass percent nitrogen? Nitrogen is "
            "14.01 g/mol and hydrogen is 1.008 g/mol."
        ),
        try_it_answer=(
            "About 82.2 percent. The molar mass is 14.01 + 3.024 = "
            "17.034 g/mol, and (14.01 / 17.034) x 100 = 82.25 percent, "
            "because the three light hydrogens contribute very little mass."
        ),
        pitfall=(
            "The trap is computing a percentage of atoms instead of a "
            "percentage of mass. In water, 2 of the 3 atoms are hydrogen, "
            "which is 66.7 percent of the atoms, but hydrogen is only "
            "11.19 percent of the mass because each hydrogen weighs about one "
            "sixteenth of an oxygen."
        ),
        misconception=None,
    ),
    "C.G1.EMPIRICAL": Lesson(
        node="C.G1.EMPIRICAL",
        objective=(
            "Determine a compound's empirical formula from percent composition "
            "data, and upgrade it to a molecular formula given the molar mass."
        ),
        build_on=(
            "Percent composition runs a formula forward into mass fractions, "
            "and this lesson runs the same road backwards, from measured "
            "masses to the formula."
        ),
        core_idea=(
            "A combustion analyser in a lab hands you percentages, not a "
            "formula, so you have to reconstruct the formula from them. The "
            "move that makes it work is to assume you have exactly 100 g of "
            "the compound, because then every percentage becomes a mass in "
            "grams with no extra arithmetic. Convert each mass to moles with "
            "that element's molar mass, since formulas are ratios of counts "
            "and never ratios of masses. Then divide every mole value by the "
            "smallest one, which forces the smallest element to 1 and reveals "
            "the whole number ratio. That ratio is the empirical formula, and "
            "only a separately measured molar mass can tell you the molecular "
            "formula."
        ),
        worked_example=(
            "A sample analyses as 40.00 percent carbon, 6.71 percent hydrogen "
            "and 53.29 percent oxygen, with a measured molar mass of "
            "180.2 g/mol. Assume 100 g, so you have 40.00 g C, 6.71 g H and "
            "53.29 g O. Convert to moles: 40.00 / 12.01 = 3.331 mol C, "
            "6.71 / 1.008 = 6.66 mol H, 53.29 / 16.00 = 3.331 mol O. Divide "
            "each by the smallest value, 3.331: carbon gives 1.000, hydrogen "
            "gives 6.66 / 3.331 = 2.00, oxygen gives 1.000. The empirical "
            "formula is therefore CH2O, whose empirical mass is "
            "12.01 + 2 x 1.008 + 16.00 = 30.03 g/mol. Now divide the measured "
            "molar mass by that: 180.2 / 30.03 = 6.00, so every subscript is "
            "multiplied by 6. The molecular formula is C6H12O6, which is "
            "glucose."
        ),
        try_it_prompt=(
            "A hydrocarbon is 92.3 percent carbon and 7.7 percent hydrogen by "
            "mass, and its molar mass is 78.11 g/mol. What is its molecular "
            "formula?"
        ),
        try_it_answer=(
            "C6H6, benzene. In 100 g you have 92.3 / 12.01 = 7.69 mol C and "
            "7.7 / 1.008 = 7.64 mol H, a 1 to 1 ratio giving CH with an "
            "empirical mass of 13.02, and 78.11 / 13.02 = 6.00, so multiply "
            "both subscripts by 6."
        ),
        pitfall=(
            "The trap is reporting the empirical formula as the answer when "
            "the question asked for the molecular formula. CH2O and C6H12O6 "
            "have identical percent compositions, so the data alone cannot "
            "separate formaldehyde from glucose. Only the molar mass can."
        ),
        misconception="EMP-MOL",
    ),
    "C.G1.CONSERVATION": Lesson(
        node="C.G1.CONSERVATION",
        objective=(
            "Account for every atom in a chemical change and explain apparent "
            "mass losses or gains in an open container."
        ),
        build_on=(
            "Atoms are the units that survive chemical change, so once you "
            "accept that atoms are not created or destroyed, mass "
            "conservation follows for free."
        ),
        core_idea=(
            "Burn a log and the ash weighs far less than the log did, which "
            "looks like mass vanishing. It did not vanish. Most of the log "
            "left as carbon dioxide and water vapour, which drifted up the "
            "chimney unweighed. A chemical reaction only rearranges which "
            "atoms are bonded to which, so the number of atoms of each element "
            "is identical before and after. If you seal the system so nothing "
            "can enter or leave, the balance reading does not change at all "
            "during the reaction."
        ),
        worked_example=(
            "React hydrogen with oxygen to make water: 2 H2 + O2 gives "
            "2 H2O. Start with 2.000 mol of H2, which is "
            "2.000 x 2.016 = 4.032 g, and 1.000 mol of O2, which is "
            "1.000 x 32.00 = 32.00 g. The total starting mass is "
            "4.032 + 32.00 = 36.03 g. The reaction produces 2.000 mol of "
            "water, and water's molar mass is 2.016 + 16.00 = 18.016 g/mol, so "
            "the product mass is 2.000 x 18.016 = 36.03 g. The masses match "
            "because the atoms match: 4 hydrogen atoms and 2 oxygen atoms go "
            "in, and 4 hydrogen atoms and 2 oxygen atoms come out, just bonded "
            "differently. Nothing was consumed and nothing was created, only "
            "reconnected."
        ),
        try_it_prompt=(
            "You burn 2.00 g of magnesium ribbon in an open crucible and the "
            "white powder left behind weighs 3.32 g. Was mass created? Where "
            "did the extra 1.32 g come from?"
        ),
        try_it_answer=(
            "No mass was created. The extra 1.32 g is oxygen pulled in from "
            "the air, because the product is magnesium oxide, MgO, and the "
            "crucible was open so the system was not closed."
        ),
        pitfall=(
            "The trap is believing mass is destroyed whenever a product "
            "escapes as a gas. Decompose 100.0 g of calcium carbonate in an "
            "open dish and the solid left weighs only 56.0 g, but the missing "
            "44.0 g is carbon dioxide that walked off into the room. Do it in "
            "a sealed flask and the balance never moves."
        ),
        misconception="ATOM-CONSERV",
    ),
    "C.G1.BALANCE": Lesson(
        node="C.G1.BALANCE",
        objective=(
            "Balance a chemical equation by adjusting coefficients only, and "
            "verify the balance atom by atom."
        ),
        build_on=(
            "Conservation of atoms says the counts must match on both sides, "
            "and balancing is the bookkeeping that makes the written equation "
            "obey that rule."
        ),
        core_idea=(
            "A formula is a fixed fact about a substance and a coefficient is "
            "how many of that substance you have. Think of a recipe: you can "
            "make two batches of pancakes, but you cannot redefine what an egg "
            "is. Changing a subscript changes the substance, so H2O becomes "
            "H2O2 and you have swapped drinking water for hydrogen peroxide. "
            "Changing a coefficient only changes the amount, so 2 H2O is still "
            "water. Balancing therefore means finding the smallest whole "
            "number coefficients that make every element's atom count equal on "
            "both sides."
        ),
        worked_example=(
            "Balance the combustion of propane, the fuel in a barbecue tank: "
            "C3H8 + O2 gives CO2 + H2O. Start with carbon, which appears in "
            "one place on each side. There are 3 carbons on the left, so you "
            "need 3 CO2 on the right. Move to hydrogen: there are 8 hydrogens "
            "on the left, and each water carries 2, so 8 / 2 = 4 gives you "
            "4 H2O. Save oxygen for last because it appears in two products. "
            "The right side now holds 3 x 2 = 6 oxygen atoms in the carbon "
            "dioxide plus 4 x 1 = 4 in the water, for 10 oxygen atoms total. "
            "Each O2 supplies 2 atoms, so you need 10 / 2 = 5 of them. The "
            "balanced equation is C3H8 + 5 O2 gives 3 CO2 + 4 H2O, and the "
            "final check reads carbon 3 = 3, hydrogen 8 = 8, oxygen 10 = 10."
        ),
        try_it_prompt=(
            "Balance the combustion of ethane: C2H6 + O2 gives CO2 + H2O. Use "
            "whole number coefficients."
        ),
        try_it_answer=(
            "2 C2H6 + 7 O2 gives 4 CO2 + 6 H2O. Balancing one ethane needs "
            "2 CO2 and 3 H2O, which requires 7 oxygen atoms or 3.5 O2, so you "
            "double everything to clear the fraction."
        ),
        pitfall=(
            "The trap is fixing a shortage by editing a subscript. If you "
            "balance oxygen by writing H2O2 instead of H2O you have not "
            "balanced the equation, you have changed the product into hydrogen "
            "peroxide, which is a different substance that would sting a cut "
            "rather than quench thirst."
        ),
        misconception="SUB-COEF",
    ),
    "C.G1.REACTIONTYPES": Lesson(
        node="C.G1.REACTIONTYPES",
        objective=(
            "Classify a balanced equation as synthesis, decomposition, single "
            "replacement, double replacement or combustion, and predict "
            "products from the pattern."
        ),
        build_on=(
            "Now that you can balance an equation, you can look at its shape "
            "and notice that a small number of shapes cover most of the "
            "reactions you will meet."
        ),
        core_idea=(
            "Classification is pattern recognition that lets you predict "
            "products before you know any theory. Synthesis puts pieces "
            "together, as when magnesium ribbon burns to magnesium oxide. "
            "Decomposition breaks one substance into several, as when the "
            "hydrogen peroxide in an old bottle slowly turns into water and "
            "oxygen gas. Single replacement has one element kicking another "
            "out of a compound, which is what happens when zinc metal drops "
            "into hydrochloric acid and hydrogen bubbles off. Double "
            "replacement swaps partners between two compounds, and combustion "
            "burns a fuel in oxygen to give carbon dioxide and water. These "
            "are descriptive boxes, not laws, and some reactions sit in two of "
            "them at once."
        ),
        worked_example=(
            "Classify four reactions. First, 2 Mg + O2 gives 2 MgO. Two "
            "reactants become one product, so this is synthesis. Second, "
            "2 H2O2 gives 2 H2O + O2. One reactant becomes two products, so "
            "this is decomposition. Third, Zn + 2 HCl gives ZnCl2 + H2. A "
            "free element, zinc, has displaced the hydrogen out of the "
            "compound and hydrogen is now the free element, so this is single "
            "replacement. Fourth, AgNO3 + NaCl gives AgCl + NaNO3. Two "
            "compounds have exchanged partners, silver taking the chloride "
            "and sodium taking the nitrate, so this is double replacement. "
            "Notice the test is structural: count how many species are on each "
            "side and watch whether any element appears uncombined."
        ),
        try_it_prompt=(
            "Heating limestone gives CaCO3 to CaO + CO2. Which category is "
            "this, and what structural feature tells you?"
        ),
        try_it_answer=(
            "Decomposition. A single reactant breaks into two products and no "
            "free element appears on the reactant side."
        ),
        pitfall=(
            "The trap is believing every reaction belongs to exactly one box. "
            "The reaction 2 H2 + O2 gives 2 H2O is a synthesis, because two "
            "reactants make one product, and it is also a combustion, because "
            "a fuel burned in oxygen and released heat. Both labels are "
            "correct at the same time."
        ),
        misconception=None,
    ),
    "C.G1.IONIC": Lesson(
        node="C.G1.IONIC",
        objective=(
            "Write the correct formula for an ionic compound, including ones "
            "with polyatomic ions, by balancing total positive and negative "
            "charge."
        ),
        build_on=(
            "You know which ions common elements form, and this lesson uses "
            "those charges to build whole compounds that carry no net charge."
        ),
        core_idea=(
            "The salt on your table is not made of NaCl molecules. It is a "
            "crystal, a repeating three dimensional grid in which every sodium "
            "ion is surrounded by six chloride ions and every chloride is "
            "surrounded by six sodiums. The formula NaCl reports the ratio in "
            "that grid, one to one, and chemists call it a formula unit rather "
            "than a molecule for exactly that reason. Some ions are groups of "
            "atoms bonded together that carry a charge as a unit and travel "
            "intact through reactions, such as sulfate (SO4 with a 2- charge), "
            "nitrate (NO3 with a 1- charge) and ammonium (NH4 with a 1+ "
            "charge). Building a formula is then one requirement: total "
            "positive charge must cancel total negative charge exactly."
        ),
        worked_example=(
            "Write the formula for aluminium sulfate. Aluminium forms Al with "
            "a 3+ charge and sulfate is SO4 with a 2- charge. You need whole "
            "numbers of each that cancel, so find the least common multiple of "
            "3 and 2, which is 6. Two aluminium ions give 2 x (3+) = 6+, and "
            "three sulfate ions give 3 x (2-) = 6-, which cancels. Because "
            "sulfate is a group taken more than once it needs parentheses, so "
            "the formula is Al2(SO4)3. Confirm the atom counts the "
            "parentheses imply: 2 aluminium, 3 sulfur, and 3 x 4 = 12 oxygen. "
            "Its molar mass is 2 x 26.98 + 3 x 32.06 + 12 x 16.00, which is "
            "53.96 + 96.18 + 192.00 = 342.14 g/mol."
        ),
        try_it_prompt=(
            "Calcium forms Ca with a 2+ charge and phosphate is PO4 with a 3- "
            "charge. What is the formula of calcium phosphate, the main "
            "mineral in your bones?"
        ),
        try_it_answer=(
            "Ca3(PO4)2. Three calcium ions give 6+ and two phosphate ions give "
            "6-, so the charges cancel at the least common multiple of 2 and "
            "3."
        ),
        pitfall=(
            "The trap is speaking about a molecule of an ionic compound. There "
            "is no such particle as an NaCl molecule sitting in a salt "
            "crystal, only a lattice in the ratio one sodium to one chloride. "
            "That is why melted or dissolved salt conducts electricity while "
            "melted sugar, which really is made of molecules, does not."
        ),
        misconception="MOLECULAR-IONIC",
    ),
    "C.G1.SOLUBILITY": Lesson(
        node="C.G1.SOLUBILITY",
        objective=(
            "Predict whether mixing two aqueous solutions produces a "
            "precipitate, and write the balanced equation with correct state "
            "labels."
        ),
        build_on=(
            "You can build charge balanced ionic formulas, and now you decide "
            "which of those formulas can stay dissolved and which drop out as "
            "a solid."
        ),
        core_idea=(
            "The scale inside a kettle is a precipitate: ions that were "
            "dissolved found a partner they cannot stay dissolved with and "
            "left the water as a solid. To predict it you swap the partners of "
            "the two compounds you mixed and then test each new pair against "
            "the solubility rules. The rules worth memorising first are that "
            "all compounds of Group 1 metals and of ammonium dissolve, and so "
            "do all nitrates. Chlorides, bromides and iodides dissolve except "
            "with silver, lead and mercury(I). Carbonates, phosphates, sulfides "
            "and hydroxides generally do not dissolve unless the positive ion "
            "is a Group 1 metal or ammonium."
        ),
        worked_example=(
            "Mix a solution of lead(II) nitrate with a solution of potassium "
            "iodide. First swap partners: lead pairs with iodide and potassium "
            "pairs with nitrate. Build each formula with charge balance. Lead "
            "is Pb with a 2+ charge and iodide is I with a 1- charge, so you "
            "need two iodides, giving PbI2. Potassium is 1+ and nitrate is 1-, "
            "so that pair is KNO3. Now test them. KNO3 is both a Group 1 "
            "compound and a nitrate, so it stays dissolved. PbI2 is an iodide, "
            "and lead is one of the three exceptions, so it precipitates, and "
            "in the beaker you see a bright yellow solid appear. The balanced "
            "equation with states is Pb(NO3)2(aq) + 2 KI(aq) gives PbI2(s) + "
            "2 KNO3(aq)."
        ),
        try_it_prompt=(
            "You mix aqueous sodium chloride with aqueous silver nitrate. Does "
            "anything precipitate, and what is the balanced equation with "
            "state labels?"
        ),
        try_it_answer=(
            "Yes, silver chloride. NaCl(aq) + AgNO3(aq) gives AgCl(s) + "
            "NaNO3(aq), because chlorides dissolve except with silver, lead "
            "and mercury(I), while sodium nitrate is both a Group 1 salt and a "
            "nitrate."
        ),
        pitfall=(
            "The trap is swapping the partners and then copying the old "
            "subscripts onto the new pair. Mixing Pb(NO3)2 with KI does not "
            "give PbI, because lead carries a 2+ charge and needs two iodides. "
            "Rebuild every product formula from the ion charges, never from "
            "the formula it came out of."
        ),
        misconception=None,
    ),
    "C.G1.NETIONIC": Lesson(
        node="C.G1.NETIONIC",
        objective=(
            "Convert a molecular equation into a complete ionic equation and "
            "then a net ionic equation by cancelling spectator ions."
        ),
        build_on=(
            "You can already predict which product precipitates, and the net "
            "ionic equation is the way to write down only the change that "
            "actually happened."
        ),
        core_idea=(
            "When you dissolve sodium chloride in water there are no NaCl "
            "units left floating around, only separated sodium ions and "
            "chloride ions drifting independently. So writing NaCl(aq) is a "
            "convenient fiction, and the complete ionic equation writes what "
            "is really there. Once you do that, some ions appear identically "
            "on both sides, unchanged and still dissolved, and those are "
            "called spectator ions. Cancelling them leaves the net ionic "
            "equation, which is the actual chemical event. Only aqueous "
            "compounds that fully separate get split apart, so solids, "
            "liquids, gases and weak electrolytes stay written as whole "
            "formulas."
        ),
        worked_example=(
            "Start from the molecular equation AgNO3(aq) + NaCl(aq) gives "
            "AgCl(s) + NaNO3(aq). Split every aqueous ionic compound into its "
            "ions, keeping the solid intact: Ag+(aq) + NO3-(aq) + Na+(aq) + "
            "Cl-(aq) gives AgCl(s) + Na+(aq) + NO3-(aq). Now scan for species "
            "that are identical on both sides. Na+ is aqueous on the left and "
            "aqueous on the right, and NO3- is the same, so both are "
            "spectators. Cross them out. What remains is Ag+(aq) + Cl-(aq) "
            "gives AgCl(s). That single line is the whole reaction, and it "
            "says something more general than the equation you started from: "
            "any source of silver ions plus any source of chloride ions will "
            "do this."
        ),
        try_it_prompt=(
            "Write the net ionic equation for Pb(NO3)2(aq) + 2 KI(aq) gives "
            "PbI2(s) + 2 KNO3(aq)."
        ),
        try_it_answer=(
            "Pb2+(aq) + 2 I-(aq) gives PbI2(s). Potassium and nitrate are "
            "aqueous and unchanged on both sides, so they cancel as "
            "spectators."
        ),
        pitfall=(
            "The trap is splitting the precipitate into ions too. If you write "
            "the right side of the silver example as Ag+(aq) + Cl-(aq), every "
            "single species cancels and you are left with an empty equation "
            "claiming nothing happened. The solid is the point, so it stays "
            "whole."
        ),
        misconception=None,
    ),
    "C.G1.STOICH": Lesson(
        node="C.G1.STOICH",
        objective=(
            "Calculate the mass of any product or reactant from the mass of "
            "another, using the coefficients of a balanced equation."
        ),
        build_on=(
            "You can convert mass to moles, and a balanced equation gives you "
            "the exchange rate between the moles of one substance and the "
            "moles of another."
        ),
        core_idea=(
            "A balanced equation is a recipe written in particles, not in "
            "grams. When it says C3H8 + 5 O2 gives 3 CO2 + 4 H2O, it says one "
            "propane molecule needs five oxygen molecules, exactly the way a "
            "recipe says one egg per two cups of flour. Balances read grams, "
            "and the coefficients count molecules, so grams cannot be compared "
            "across the arrow directly. The route is always the same three "
            "steps: divide by molar mass to get moles of what you were given, "
            "multiply by the coefficient ratio to cross the arrow, then "
            "multiply by molar mass to get grams of what you want. Skipping "
            "the middle step is the single most common error in general "
            "chemistry."
        ),
        worked_example=(
            "How much carbon dioxide comes from burning 50.0 g of propane in a "
            "barbecue? The balanced equation is C3H8 + 5 O2 gives 3 CO2 + "
            "4 H2O. Build propane's molar mass: 3 x 12.01 + 8 x 1.008 = "
            "36.03 + 8.064 = 44.09 g/mol. Convert the given mass to moles: "
            "50.0 g divided by 44.09 g/mol = 1.134 mol of propane. Cross the "
            "arrow with the coefficient ratio, which is 3 CO2 for every "
            "1 C3H8: 1.134 mol x 3 = 3.402 mol of CO2. Convert back to grams "
            "using the molar mass of CO2, 44.01 g/mol: 3.402 mol x "
            "44.01 g/mol = 150. g. So 50.0 g of propane makes about 150 g of "
            "carbon dioxide, which is more mass than you started with because "
            "the oxygen from the air is now part of the product."
        ),
        try_it_prompt=(
            "Using the same reaction and the same 50.0 g of propane, what mass "
            "of water is produced? Water is 18.02 g/mol."
        ),
        try_it_answer=(
            "About 81.7 g. The 1.134 mol of propane crosses the arrow at "
            "4 H2O per C3H8, giving 4.536 mol of water, and 4.536 x 18.02 = "
            "81.7 g."
        ),
        pitfall=(
            "The trap is going from grams straight to grams as if the equation "
            "were one to one. Burning 50.0 g of propane does not give 50.0 g "
            "of carbon dioxide, it gives about 150 g, because each propane "
            "molecule yields three CO2 molecules and each of those is heavier "
            "than a third of a propane."
        ),
        misconception="NO-RATIO",
    ),
    "C.G1.LIMITING": Lesson(
        node="C.G1.LIMITING",
        objective=(
            "Identify the limiting reactant in a mixture, compute the "
            "theoretical yield, and calculate percent yield from an actual "
            "yield."
        ),
        build_on=(
            "Stoichiometry assumes you know which reactant sets the scale, and "
            "this lesson is how you find out when you are handed amounts of "
            "both."
        ),
        core_idea=(
            "If you have 10 slices of bread and 3 slices of cheese, you can "
            "make 5 sandwiches if a sandwich takes 2 bread and 1 cheese, "
            "because the bread runs out first even though there is more of it. "
            "The reactant that runs out first is the limiting reactant, and it "
            "alone sets how much product you can get. Everything else is in "
            "excess and some of it is left sitting in the flask when the "
            "reaction stops. To find the limiting reactant, convert each "
            "reactant to moles and divide by its coefficient, and the smallest "
            "result wins. The theoretical yield is what that calculation "
            "predicts, and the percent yield compares what you actually "
            "collected to it."
        ),
        worked_example=(
            "Burn 16.04 g of methane with 48.0 g of oxygen: CH4 + 2 O2 gives "
            "CO2 + 2 H2O. Convert both to moles. Methane is 12.01 + "
            "4 x 1.008 = 16.04 g/mol, so 16.04 / 16.04 = 1.00 mol. Oxygen is "
            "32.00 g/mol, so 48.0 / 32.00 = 1.50 mol. Now divide each by its "
            "coefficient: methane gives 1.00 / 1 = 1.00, oxygen gives "
            "1.50 / 2 = 0.750. Oxygen has the smaller value, so oxygen is "
            "limiting even though there are more moles of it. Theoretical "
            "yield of CO2 follows from the oxygen: 1.50 mol O2 x "
            "(1 CO2 / 2 O2) = 0.750 mol CO2, and 0.750 x 44.01 = 33.0 g. If "
            "the experiment actually collects 30.1 g, the percent yield is "
            "(30.1 / 33.0) x 100 = 91.2 percent."
        ),
        try_it_prompt=(
            "In the same experiment, how many grams of methane are left over "
            "when the oxygen runs out?"
        ),
        try_it_answer=(
            "About 4.01 g. Only 0.750 mol of methane can react with the "
            "0.750 mol worth of oxygen supply, so 1.00 - 0.750 = 0.250 mol "
            "remains, and 0.250 x 16.04 = 4.01 g."
        ),
        pitfall=(
            "The trap is naming the reactant with the smaller amount as "
            "limiting. In the worked example methane has fewer moles, 1.00 "
            "against 1.50, yet oxygen runs out first because the equation "
            "demands two oxygens for every methane. You must divide by the "
            "coefficient before comparing."
        ),
        misconception="IGNORED-RATIO",
    ),
    "C.G1.MOLARITY": Lesson(
        node="C.G1.MOLARITY",
        objective=(
            "Calculate molarity, and determine the mass of solute needed to "
            "prepare a solution of a stated concentration and volume."
        ),
        build_on=(
            "You can convert grams to moles, and molarity is simply that mole "
            "count divided by the volume the solution ends up occupying."
        ),
        core_idea=(
            "Most reactions you will run happen in solution, so you need a way "
            "to measure out moles by pouring rather than by weighing. Molarity "
            "does that: it is moles of solute per litre of solution, so "
            "measuring a volume with a pipette measures a number of particles. "
            "The word solution in that definition is doing real work. You "
            "prepare a 1.00 M solution by dissolving one mole in some water "
            "and then adding water until the total reaches the 1.000 L mark on "
            "a volumetric flask, not by adding one mole to 1.000 L of water. "
            "The dissolved particles take up space themselves, so those two "
            "recipes give different final volumes and therefore different "
            "concentrations."
        ),
        worked_example=(
            "Prepare 250.0 mL of 0.150 M sodium chloride. Start by converting "
            "the volume to litres, because molarity is defined per litre: "
            "250.0 mL = 0.2500 L. Multiply concentration by volume to get "
            "moles: 0.150 mol/L x 0.2500 L = 0.0375 mol of NaCl. Convert moles "
            "to grams with the molar mass, which is 22.99 + 35.45 = "
            "58.44 g/mol: 0.0375 mol x 58.44 g/mol = 2.19 g. So you weigh out "
            "2.19 g of salt, tip it into a 250.0 mL volumetric flask, swirl "
            "with some water until it dissolves, and then top up to the "
            "calibration mark. Check the units as you go: mol/L times L leaves "
            "mol, and mol times g/mol leaves g."
        ),
        try_it_prompt=(
            "You dissolve 5.85 g of sodium chloride and dilute to a total "
            "volume of 500.0 mL. What is the molarity?"
        ),
        try_it_answer=(
            "0.200 M. That mass is 5.85 / 58.44 = 0.100 mol, and 0.100 mol "
            "divided by 0.5000 L gives 0.200 mol/L."
        ),
        pitfall=(
            "The trap is measuring the solvent instead of the solution. If you "
            "add one mole of sodium chloride to a full litre of water, the "
            "final volume is more than a litre and the concentration is less "
            "than 1.00 M. The volumetric flask is filled to the mark after the "
            "solute is in, never before."
        ),
        misconception=None,
    ),
    "C.G1.DILUTION": Lesson(
        node="C.G1.DILUTION",
        objective=(
            "Use the dilution relationship to find the volume of stock "
            "solution needed to prepare a solution of lower concentration."
        ),
        build_on=(
            "Molarity is moles divided by volume, and dilution is what happens "
            "to that ratio when you change the volume and leave the moles "
            "alone."
        ),
        core_idea=(
            "When you make orange juice from frozen concentrate you add water, "
            "and the amount of orange in the jug never changes. Only the "
            "volume it is spread through changes, so the taste weakens. "
            "Dilution in the lab is exactly this. Adding solvent cannot create "
            "or destroy solute, so the moles before equal the moles after, and "
            "since moles equal concentration times volume you get "
            "M1 x V1 = M2 x V2. The subscript 1 is the concentrated stock you "
            "start with and 2 is the dilute solution you finish with, and V2 "
            "is the final total volume rather than the volume of water you "
            "poured in."
        ),
        worked_example=(
            "Make 500.0 mL of 0.100 M hydrochloric acid from a 6.00 M stock "
            "bottle. Write the relationship with the unknown isolated: "
            "V1 = (M2 x V2) / M1. Substituting gives V1 = "
            "(0.100 mol/L x 500.0 mL) / 6.00 mol/L = 50.0 / 6.00 = 8.33 mL. "
            "Notice the volumes stayed in millilitres on both sides, which is "
            "allowed here because the volume unit cancels. Now check the "
            "logic by counting moles both ways: the stock portion holds "
            "6.00 mol/L x 0.00833 L = 0.0500 mol, and the final solution holds "
            "0.100 mol/L x 0.5000 L = 0.0500 mol. They match, as they must. So "
            "you add roughly 400 mL of water to the flask first, then 8.33 mL "
            "of acid, then top up to the 500.0 mL mark, because acid is always "
            "added to water and never the reverse."
        ),
        try_it_prompt=(
            "You take 25.0 mL of 2.00 M glucose solution and dilute it to a "
            "final volume of 100.0 mL. What is the new concentration?"
        ),
        try_it_answer=(
            "0.500 M. Rearranging gives M2 = (2.00 x 25.0) / 100.0 = 0.500 "
            "mol/L, because the volume grew by a factor of four so the "
            "concentration fell by a factor of four."
        ),
        pitfall=(
            "The trap is reading V2 as the volume of water added rather than "
            "the final total volume. Diluting 8.33 mL of stock with 500.0 mL "
            "of water gives 508.3 mL of solution, not 500.0 mL, and the "
            "concentration lands at 0.0984 M instead of 0.100 M. It also helps "
            "to remember that the number of moles of solute never changes at "
            "any point."
        ),
        misconception=None,
    ),
    "C.G1.TITRATIONBASIC": Lesson(
        node="C.G1.TITRATIONBASIC",
        objective=(
            "Calculate the unknown concentration of a solution from titration "
            "volumes and the mole ratio of the neutralization reaction."
        ),
        build_on=(
            "You can turn a volume of known molarity into moles, and "
            "stoichiometry carries those moles across the equation to the "
            "unknown."
        ),
        core_idea=(
            "A titration is a way of measuring moles that you cannot weigh. "
            "You add a solution of precisely known concentration, the titrant, "
            "from a burette into a measured volume of the unknown until an "
            "indicator changes colour, which signals that the reactants have "
            "met in exactly the ratio the equation demands. At that endpoint "
            "you know the titrant volume to the nearest hundredth of a "
            "millilitre, so you know its moles. The balanced equation converts "
            "those moles into moles of the unknown, and dividing by the "
            "unknown's volume gives its concentration. The whole method is "
            "three conversions with a colour change telling you when to stop."
        ),
        worked_example=(
            "A 25.00 mL sample of hydrochloric acid of unknown concentration "
            "needs 32.15 mL of 0.1000 M sodium hydroxide to reach the "
            "endpoint. The reaction is HCl + NaOH gives NaCl + H2O, a one to "
            "one ratio. Find the moles of titrant: 0.1000 mol/L x 0.03215 L = "
            "0.003215 mol of NaOH. Cross the equation at one to one, so the "
            "acid sample also held 0.003215 mol of HCl. Divide by the sample "
            "volume in litres: 0.003215 mol / 0.02500 L = 0.1286 mol/L. So the "
            "acid was 0.1286 M. Sanity check the size of the answer: it took "
            "slightly more base volume than the acid volume, so at a one to "
            "one ratio the acid must be slightly more concentrated than the "
            "0.1000 M base, and it is."
        ),
        try_it_prompt=(
            "It takes 36.00 mL of 0.150 M NaOH to titrate 20.00 mL of "
            "sulfuric acid, where the reaction is H2SO4 + 2 NaOH gives Na2SO4 "
            "+ 2 H2O. What is the concentration of the acid?"
        ),
        try_it_answer=(
            "0.135 M. The base supplies 0.150 x 0.03600 = 0.00540 mol, the "
            "ratio is 2 NaOH per H2SO4 so the acid held 0.00270 mol, and "
            "0.00270 / 0.02000 = 0.135 mol/L."
        ),
        pitfall=(
            "The trap is assuming every acid and base neutralise one to one. "
            "Skip the 2 in the sulfuric acid problem above and you report "
            "0.270 M, exactly double the true answer, because each H2SO4 "
            "molecule hands over two protons and therefore consumes two "
            "hydroxides."
        ),
        misconception=None,
    ),
    "C.G1.GASLAWS": Lesson(
        node="C.G1.GASLAWS",
        objective=(
            "Use PV = nRT to solve for any one of pressure, volume, "
            "temperature or moles when the other three are known."
        ),
        build_on=(
            "You can count moles of a solid by weighing it, and the ideal gas "
            "law lets you count moles of a gas by measuring its pressure, "
            "volume and temperature instead."
        ),
        core_idea=(
            "A bicycle tyre gets harder as you pump and warmer as you ride, "
            "and both facts are in one equation. Pressure comes from gas "
            "particles hitting the walls, so it rises when you add particles, "
            "shrink the container, or heat the particles into moving faster. "
            "The ideal gas law packages all of that as PV = nRT, where R is "
            "0.08206 L*atm/(mol*K). R carries units, so the other quantities "
            "must match them: pressure in atmospheres, volume in litres, and "
            "temperature in kelvin, which you get by adding 273.15 to the "
            "Celsius reading. The law treats particles as having no volume and "
            "no attraction for each other, which is a good approximation at "
            "ordinary pressures and a poor one near condensation."
        ),
        worked_example=(
            "A 2.00 L cylinder holds oxygen at 3.50 atm and 25.0 degrees "
            "Celsius. How many grams of oxygen are inside? First convert the "
            "temperature, since only kelvin works: 25.0 + 273.15 = 298.15 K. "
            "Rearrange the law for the unknown: n = PV / (RT). Substitute the "
            "numbers: n = (3.50 atm x 2.00 L) / (0.08206 L*atm/(mol*K) x "
            "298.15 K). The numerator is 7.00 and the denominator is 24.47, so "
            "n = 7.00 / 24.47 = 0.286 mol. Convert to mass with the molar mass "
            "of O2, which is 32.00 g/mol: 0.286 mol x 32.00 g/mol = 9.16 g. "
            "The units confirm the setup, because atm times L divided by "
            "L*atm/(mol*K) times K leaves mol."
        ),
        try_it_prompt=(
            "What volume does 1.00 mol of an ideal gas occupy at 1.00 atm and "
            "273.15 K?"
        ),
        try_it_answer=(
            "22.4 L. Rearranging gives V = nRT/P = (1.00 x 0.08206 x 273.15) / "
            "1.00 = 22.4 L, which is the standard molar volume worth "
            "remembering."
        ),
        pitfall=(
            "The trap is putting Celsius into the equation. At 0 degrees "
            "Celsius the law would predict V = nR x 0 / P = 0 litres, which "
            "would mean a balloon in a freezer collapses to nothing. It "
            "obviously does not, because the real temperature is 273.15 K."
        ),
        misconception=None,
    ),
    "C.G1.GASMIX": Lesson(
        node="C.G1.GASMIX",
        objective=(
            "Calculate partial pressures in a gas mixture and find the volume "
            "of gas produced by a reaction at stated conditions."
        ),
        build_on=(
            "The ideal gas law relates moles to pressure and volume, and this "
            "lesson applies it twice over, once per gas in a mixture and once "
            "at the end of a stoichiometry chain."
        ),
        core_idea=(
            "The air around you is roughly 78 percent nitrogen and 21 percent "
            "oxygen by moles, yet you never feel two separate pressures. Each "
            "gas in a mixture behaves as if the others were not there, "
            "exerting the pressure it would exert alone in that container, and "
            "that is its partial pressure. Dalton's law says the total "
            "pressure is just the sum of them, and equivalently that a gas's "
            "partial pressure is its mole fraction times the total pressure. "
            "The same independence lets you finish a stoichiometry problem in "
            "volume instead of grams: once the balanced equation gives you the "
            "moles of gas produced, PV = nRT converts that count into a volume "
            "at whatever pressure and temperature you specify."
        ),
        worked_example=(
            "An airbag inflates when sodium azide decomposes: 2 NaN3 gives "
            "2 Na + 3 N2. What volume of nitrogen does 65.0 g of NaN3 make at "
            "1.00 atm and 298 K? Build the molar mass of NaN3: 22.99 + "
            "3 x 14.01 = 22.99 + 42.03 = 65.02 g/mol. Convert to moles: "
            "65.0 / 65.02 = 1.00 mol of NaN3. Cross the equation with the "
            "coefficient ratio, 3 N2 for every 2 NaN3: 1.00 mol x 3/2 = "
            "1.50 mol of N2. Now convert moles of gas to a volume with "
            "V = nRT/P = (1.50 mol x 0.08206 L*atm/(mol*K) x 298 K) / "
            "1.00 atm. That is 1.50 x 24.45 = 36.7 L, which is about the size "
            "of a driver's airbag."
        ),
        try_it_prompt=(
            "A scuba tank holds 0.800 mol of helium and 0.200 mol of oxygen at "
            "a total pressure of 200. atm. What is the partial pressure of the "
            "oxygen?"
        ),
        try_it_answer=(
            "40.0 atm. The mole fraction of oxygen is 0.200 / 1.000 = 0.200, "
            "and 0.200 x 200. atm = 40.0 atm."
        ),
        pitfall=(
            "The trap is thinking a gas pushes less hard because other gases "
            "are crowding it. It does not. Put 0.200 mol of oxygen in a fixed "
            "container at a fixed temperature and it exerts the same partial "
            "pressure whether the rest of the tank is empty or packed with "
            "helium, because ideal particles ignore each other entirely."
        ),
        misconception=None,
    ),
    "C.G1.THERMOBASIC": Lesson(
        node="C.G1.THERMOBASIC",
        objective=(
            "Calculate the heat transferred to or from a substance from its "
            "mass, specific heat and temperature change."
        ),
        build_on=(
            "You already separate temperature from thermal energy, and "
            "specific heat is the constant that finally lets you convert "
            "between a measured temperature change and joules."
        ),
        core_idea=(
            "A metal spoon left in a hot pan burns your hand while the water "
            "beside it takes far longer to heat up, and specific heat is the "
            "number that captures that difference. Specific heat is the energy "
            "needed to raise one gram of a substance by one degree Celsius, "
            "and for water it is 4.184 J/(g*C), which is unusually large. That "
            "is why coastal towns have milder winters than inland ones and why "
            "a hot water bottle stays warm all night. The working equation is "
            "q = m x c x (change in temperature), where q is the heat "
            "transferred in joules. In a calorimeter you use it in reverse: "
            "you watch the temperature of a known mass of water change, and "
            "read off the energy the reaction released or absorbed."
        ),
        worked_example=(
            "You heat 250.0 g of water in a kettle from 22.0 degrees Celsius "
            "to 85.0 degrees Celsius. How much energy did that take? First "
            "find the temperature change: 85.0 - 22.0 = 63.0 degrees. Note "
            "that a change in Celsius equals a change in kelvin, so no "
            "conversion is needed here. Now substitute into q = m x c x change "
            "in temperature: q = 250.0 g x 4.184 J/(g*C) x 63.0 C. Multiply "
            "step by step: 250.0 x 4.184 = 1046 J per degree, and "
            "1046 x 63.0 = 65,900 J. Expressed in kilojoules that is 65.9 kJ. "
            "The units cancel cleanly, since grams times joules per gram per "
            "degree times degrees leaves joules."
        ),
        try_it_prompt=(
            "How much heat is needed to raise the temperature of 100.0 g of "
            "water by 25.0 degrees Celsius?"
        ),
        try_it_answer=(
            "10.5 kJ. Substituting gives q = 100.0 x 4.184 x 25.0 = 10,460 J, "
            "which is 10.5 kJ."
        ),
        pitfall=(
            "The trap is treating temperature change as a direct measure of "
            "energy, so that equal temperature rises mean equal energy. They "
            "do not. Give 4.184 J to one gram of water and it warms by 1.00 "
            "degree, but give the same 4.184 J to one gram of iron, whose "
            "specific heat is 0.449 J/(g*C), and it warms by 9.32 degrees."
        ),
        misconception=None,
    ),
    "C.G1.ENTHALPY": Lesson(
        node="C.G1.ENTHALPY",
        objective=(
            "Interpret the sign of an enthalpy change and scale a molar "
            "enthalpy of reaction to any given mass of reactant."
        ),
        build_on=(
            "Calorimetry measures joules from a temperature change, and "
            "enthalpy is that measured heat reported per mole of reaction at "
            "constant pressure."
        ),
        core_idea=(
            "A chemical hand warmer gets hot because the reaction inside "
            "releases energy to its surroundings, and an instant cold pack "
            "gets cold because dissolving ammonium nitrate absorbs energy from "
            "them. Enthalpy change, written as the change in H, is the heat "
            "exchanged when a reaction runs at constant pressure, which is the "
            "condition in any open beaker. The sign is written from the "
            "reaction's point of view, not yours. A reaction that gives energy "
            "away has a negative enthalpy change and is called exothermic, "
            "while one that takes energy in has a positive value and is called "
            "endothermic. The value is quoted per mole of reaction as written, "
            "so it scales directly with how much you actually react."
        ),
        worked_example=(
            "Burning methane has an enthalpy change of -890.3 kJ per mole of "
            "CH4. How much heat does a camping stove release from 5.00 g of "
            "methane? Convert the mass to moles using the molar mass "
            "16.04 g/mol: 5.00 / 16.04 = 0.312 mol. Multiply by the molar "
            "enthalpy: 0.312 mol x (-890.3 kJ/mol) = -278 kJ. The negative "
            "answer means the system lost 278 kJ, so the surroundings gained "
            "278 kJ and the pot of water gets hot. To sanity check the "
            "magnitude, 278 kJ is more than four times the 65.9 kJ needed to "
            "take 250 g of water from 22 degrees to 85 degrees Celsius, which "
            "is why a small gas canister boils a lot of water."
        ),
        try_it_prompt=(
            "Using the same value of -890.3 kJ per mole, how much heat is "
            "released by burning 1.00 g of methane?"
        ),
        try_it_answer=(
            "About 55.5 kJ released, so the enthalpy change is -55.5 kJ. That "
            "mass is 1.00 / 16.04 = 0.0623 mol, and 0.0623 x 890.3 = 55.5 kJ."
        ),
        pitfall=(
            "The trap is reading a negative enthalpy as less energy, or as "
            "energy being destroyed. It means the opposite. Methane at "
            "-890.3 kJ/mol releases far more heat per mole than hydrogen at "
            "-285.8 kJ/mol, so the more negative the value, the hotter the "
            "flame. The minus sign only records that the energy left the "
            "system."
        ),
        misconception=None,
    ),
    "C.G1.HESS": Lesson(
        node="C.G1.HESS",
        objective=(
            "Combine known reaction enthalpies, reversing and scaling them as "
            "needed, to find the enthalpy of a reaction you cannot measure "
            "directly."
        ),
        build_on=(
            "You can scale an enthalpy to a mass, and Hess's law extends that "
            "bookkeeping so you can add whole reactions together."
        ),
        core_idea=(
            "The altitude you gain walking from the car park to a summit "
            "depends only on the two elevations, never on which path you took, "
            "and enthalpy behaves the same way. It is a state function, so the "
            "enthalpy change depends only on the starting and finishing "
            "substances, not on the route between them. That means you can "
            "invent any convenient route out of reactions whose enthalpies are "
            "already known and add them up. Two rules govern the bookkeeping: "
            "reversing a reaction flips the sign of its enthalpy, and "
            "multiplying a reaction through by a number multiplies its "
            "enthalpy by the same number. This matters because burning carbon "
            "to carbon monoxide without making any carbon dioxide is nearly "
            "impossible to do cleanly in a calorimeter."
        ),
        worked_example=(
            "Find the enthalpy of 2 C(s) + O2(g) gives 2 CO(g) from two "
            "measurable reactions. Reaction 1 is C(s) + O2(g) gives CO2(g) "
            "with an enthalpy of -393.5 kJ. Reaction 2 is 2 CO(g) + O2(g) "
            "gives 2 CO2(g) with an enthalpy of -566.0 kJ. You need 2 carbons "
            "on the left, so multiply reaction 1 by 2, giving 2 C + 2 O2 makes "
            "2 CO2 with an enthalpy of 2 x (-393.5) = -787.0 kJ. You need CO "
            "on the right, so reverse reaction 2, giving 2 CO2 makes 2 CO + O2 "
            "with the sign flipped to +566.0 kJ. Add the two: the 2 CO2 "
            "cancels because it appears on both sides, and 2 O2 on the left "
            "against 1 O2 on the right leaves one O2 on the left. The sum is "
            "2 C + O2 gives 2 CO, and the enthalpy is -787.0 + 566.0 = "
            "-221.0 kJ."
        ),
        try_it_prompt=(
            "From that result, what is the enthalpy change for C(s) + 1/2 "
            "O2(g) gives CO(g)?"
        ),
        try_it_answer=(
            "-110.5 kJ. The target equation is the worked example halved, and "
            "halving a reaction halves its enthalpy."
        ),
        pitfall=(
            "The trap is editing the equations but forgetting to edit the "
            "enthalpies with them. If you double reaction 1 and leave its "
            "value at -393.5 kJ, you get -393.5 + 566.0 = +172.5 kJ and "
            "conclude that burning carbon to carbon monoxide absorbs heat. It "
            "does not, as anyone who has stood near a coal fire knows."
        ),
        misconception=None,
    ),
    "C.G1.ELECTRONCONFIG": Lesson(
        node="C.G1.ELECTRONCONFIG",
        objective=(
            "Write the full and condensed electron configuration of an atom, "
            "and recognise the two common exceptions to the filling order."
        ),
        build_on=(
            "The periodic table's blocks are a map of which subshell is being "
            "filled, and this lesson turns that map into a written "
            "configuration."
        ),
        core_idea=(
            "Electrons occupy subshells the way people fill seats in a cheap "
            "cinema, taking the lowest available rows first. The order of "
            "increasing energy is 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, 5p, "
            "and each subshell holds a fixed number: 2 in an s, 6 in a p, 10 "
            "in a d, 14 in an f. Notice that 4s comes before 3d, which is why "
            "the fourth row of the periodic table is long. A condensed "
            "configuration replaces the filled inner shells with the previous "
            "noble gas in brackets, so the part that does chemistry is all "
            "that is left on the page. The order is a very good rule and not a "
            "law, because a few elements gain stability by rearranging "
            "slightly."
        ),
        worked_example=(
            "Write the configuration of iron, atomic number 26, so 26 "
            "electrons. Fill in energy order and keep a running total: 1s2 "
            "takes you to 2, 2s2 to 4, 2p6 to 10, 3s2 to 12, 3p6 to 18, and "
            "4s2 to 20. Six electrons are left and the next subshell is 3d, "
            "which can hold 10, so they go in as 3d6 and the total reaches 26. "
            "The full configuration is 1s2 2s2 2p6 3s2 3p6 4s2 3d6. Since "
            "argon is 1s2 2s2 2p6 3s2 3p6, the condensed form is [Ar] 4s2 3d6. "
            "Check the arithmetic by adding the superscripts: 2 + 2 + 6 + 2 + "
            "6 + 2 + 6 = 26, which matches the atomic number, and that sum is "
            "the check you should run every time."
        ),
        try_it_prompt=(
            "Write the full electron configuration of sulfur, atomic number "
            "16."
        ),
        try_it_answer=(
            "1s2 2s2 2p6 3s2 3p4. The superscripts sum to 2 + 2 + 6 + 2 + 4 = "
            "16, which matches the atomic number."
        ),
        pitfall=(
            "The trap is applying the filling order to chromium and copper "
            "without checking. The order predicts [Ar] 4s2 3d4 for chromium, "
            "but the real ground state is [Ar] 4s1 3d5, and copper is [Ar] 4s1 "
            "3d10 rather than 4s2 3d9. A half filled or completely filled d "
            "subshell is worth promoting an s electron for."
        ),
        misconception=None,
    ),
    "C.G1.QUANTUM": Lesson(
        node="C.G1.QUANTUM",
        objective=(
            "State the allowed values of the four quantum numbers for a given "
            "shell and count the orbitals and electrons it can hold."
        ),
        build_on=(
            "You write configurations like 3d6 without asking why a d subshell "
            "holds ten, and the quantum numbers are the answer to that "
            "question."
        ),
        core_idea=(
            "Four numbers address an electron the way a country, city, street "
            "and house number address a person, and no two electrons in an "
            "atom share all four. The principal number n is a whole number "
            "from 1 upward and sets the shell, roughly the distance from the "
            "nucleus and most of the energy. The number l runs from 0 up to "
            "n - 1 and sets the shape, with 0 called s and spherical, 1 called "
            "p and shaped like two lobes along an axis, 2 called d and mostly "
            "four lobed. The number m_l runs from -l to +l in whole steps and "
            "picks which orientation in space that shape takes. Finally m_s is "
            "either +1/2 or -1/2, which is why an orbital holds exactly two "
            "electrons and no more."
        ),
        worked_example=(
            "Work out everything the third shell can hold. With n = 3, the "
            "allowed values of l run from 0 to n - 1 = 2, so l can be 0, 1 or "
            "2. For l = 0, m_l can only be 0, so that is a single 3s orbital. "
            "For l = 1, m_l can be -1, 0 or +1, which is three 3p orbitals. "
            "For l = 2, m_l can be -2, -1, 0, +1 or +2, which is five 3d "
            "orbitals. The total is 1 + 3 + 5 = 9 orbitals, and since m_s "
            "allows two electrons per orbital, the shell holds "
            "9 x 2 = 18 electrons. Both results match the general pattern of "
            "n squared orbitals and 2 n squared electrons, since 3 squared is "
            "9 and twice that is 18."
        ),
        try_it_prompt=(
            "How many orbitals does the n = 4 shell contain, and how many "
            "electrons can it hold?"
        ),
        try_it_answer=(
            "16 orbitals and 32 electrons. The values of l run 0, 1, 2, 3 "
            "giving 1 + 3 + 5 + 7 = 16 orbitals, and each takes two electrons."
        ),
        pitfall=(
            "The trap is picturing an orbital as a track the electron runs "
            "around, like a planet. It is a probability map instead. A 2p "
            "orbital has a flat plane through the nucleus where the "
            "probability of finding the electron is exactly zero, yet the "
            "electron turns up in both lobes, which no continuous orbit could "
            "manage."
        ),
        misconception=None,
    ),
    "C.G1.PERIODICTRENDS": Lesson(
        node="C.G1.PERIODICTRENDS",
        objective=(
            "Predict and justify the relative atomic radius, ionization energy "
            "and electronegativity of two elements from their positions."
        ),
        build_on=(
            "Electron configuration tells you which shell the outermost "
            "electrons sit in, and the trends are what follows once you also "
            "count the protons pulling on them."
        ),
        core_idea=(
            "Two competing effects explain almost every periodic trend. Going "
            "across a period you add protons but the new electrons enter the "
            "same shell, where they shield each other poorly, so the "
            "outermost electrons feel a stronger net pull and are drawn in "
            "tighter. Going down a group you start a whole new shell that sits "
            "further out and is screened by all the filled shells beneath it, "
            "so the outer electrons are held loosely. Atoms therefore shrink "
            "across a period and grow down a group. Ionization energy, the "
            "energy to strip the outermost electron, and electronegativity, "
            "the pull an atom exerts on shared electrons in a bond, both run "
            "the opposite way to radius, rising across a period and falling "
            "down a group."
        ),
        worked_example=(
            "Rank sodium, magnesium and potassium by atomic radius and by "
            "first ionization energy. Sodium and magnesium are neighbours in "
            "period 3, so both have their outermost electrons in the third "
            "shell, but magnesium has 12 protons against sodium's 11. The "
            "extra proton pulls the shell in, so magnesium is smaller, and the "
            "measured radii bear this out at 160 pm for magnesium against 186 "
            "pm for sodium. Potassium sits directly below sodium and puts its "
            "outermost electron in the fourth shell, so it is much bigger, at "
            "227 pm. Ionization energy must run the other way, because a "
            "tightly held close electron is harder to remove. The measured "
            "first ionization energies are 738 kJ/mol for magnesium, 496 "
            "kJ/mol for sodium and 419 kJ/mol for potassium, in exactly the "
            "reverse order of the radii."
        ),
        try_it_prompt=(
            "Which atom has the larger radius, chlorine or bromine, and what "
            "is the reason?"
        ),
        try_it_answer=(
            "Bromine. It is below chlorine in the same group, so its outermost "
            "electrons occupy the fourth shell rather than the third, and that "
            "shell sits further from the nucleus."
        ),
        pitfall=(
            "The trap is reasoning that more electrons must mean a bigger "
            "atom. Magnesium has one more electron than sodium and is clearly "
            "smaller, 160 pm against 186 pm, because the added electron joins "
            "the same shell and shields poorly while the added proton pulls "
            "on everything."
        ),
        misconception=None,
    ),
    "C.G1.LEWISBASIC": Lesson(
        node="C.G1.LEWISBASIC",
        objective=(
            "Draw a Lewis structure for a small molecule by counting valence "
            "electrons and distributing them to satisfy each atom."
        ),
        build_on=(
            "Electron configuration tells you how many valence electrons an "
            "atom brings, and a Lewis structure is the ledger that spends "
            "exactly that many."
        ),
        core_idea=(
            "A Lewis structure is honest accounting on paper: you have a fixed "
            "budget of valence electrons and you must spend every one, no more "
            "and no less. Each element's main group number tells you what it "
            "contributes, so carbon brings 4, nitrogen 5, oxygen 6 and "
            "hydrogen 1. You draw a skeleton with the least electronegative "
            "atom in the middle, spend two electrons on each single bond, then "
            "hand out the rest as lone pairs starting with the outer atoms. "
            "The target is eight electrons around each main group atom, "
            "counting both bonding and lone pairs, with hydrogen the exception "
            "at two. If you run short, convert a lone pair on an outer atom "
            "into a second or third bond rather than inventing extra "
            "electrons."
        ),
        worked_example=(
            "Draw carbon dioxide, CO2. Count the budget first: carbon brings "
            "4 and each oxygen brings 6, so 4 + 6 + 6 = 16 valence electrons. "
            "Carbon is the least electronegative, so the skeleton is O C O. "
            "Two single bonds spend 2 x 2 = 4 electrons, leaving 16 - 4 = 12. "
            "Give those 12 to the outer oxygens as three lone pairs each, "
            "which satisfies both oxygens but leaves carbon with only the 4 "
            "electrons in its two bonds. Fix it by moving one lone pair from "
            "each oxygen into the bond, making both bonds double. Now carbon "
            "has 8 electrons in four bonds, and each oxygen has 4 bonding plus "
            "2 remaining lone pairs, which is 8 as well. Audit the budget: two "
            "double bonds are 8 electrons and the four remaining lone pairs "
            "are 8 more, totalling 16, exactly what you started with."
        ),
        try_it_prompt=(
            "How many valence electrons does water have in total, and how are "
            "they arranged in its Lewis structure?"
        ),
        try_it_answer=(
            "Eight. Oxygen brings 6 and each hydrogen brings 1, and they are "
            "spent as two O to H single bonds (4 electrons) plus two lone "
            "pairs on the oxygen (4 electrons)."
        ),
        pitfall=(
            "The trap is giving hydrogen an octet. Hydrogen has only a 1s "
            "orbital and is complete with two electrons, so drawing lone pairs "
            "on the hydrogens in water would spend 12 electrons when the "
            "molecule only has 8 to give."
        ),
        misconception=None,
    ),
}
