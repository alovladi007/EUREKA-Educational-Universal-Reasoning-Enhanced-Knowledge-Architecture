"""Chapters for GEN1 unit 4, Stoichiometry of Chemical Reactions - first half.

Nodes: CONSERVATION, BALANCE, REACTIONTYPES, SOLUBILITY, NETIONIC,
NEUTRALIZATION. The second half lives in extras_gen1_u4b.py.

Every number is computed or sourced. Molar masses are computed from IUPAC
standard atomic weights (2021 table) and rounded to four significant figures;
solubility rules are the standard qualitative set as tabulated in any general
chemistry text and stated as rules, not measurements. Nothing is estimated.
"""

from __future__ import annotations

from app.data.lesson_extras import (
    LessonExtras,
    ReadingSection,
    Table,
)

EXTRAS_GEN1_U4: dict[str, LessonExtras] = {}


def _add(extras: LessonExtras) -> None:
    EXTRAS_GEN1_U4[extras.node] = extras


# --------------------------------------------------------------------------
# 4.1 Conservation of mass and atoms
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="GEN1.CONSERVATION",
    lead=(
        "A chemical reaction rearranges which atoms are bonded to which; it "
        "never creates or destroys them. That single sentence is the law of "
        "conservation of mass, the reason equations can be balanced at all, "
        "and the reason every stoichiometry calculation in this unit works. "
        "This chapter establishes the law, shows where it appears to fail and "
        "why the appearance is always an accounting error, and puts numbers "
        "on it."
    ),
    sections=(
        ReadingSection(
            id="the-law",
            heading="The law, and what it rests on",
            body=(
                "Lavoisier's observation, made with sealed vessels and a good "
                "balance in the 1780s, was that the total mass of a closed "
                "system does not change during a chemical reaction. The "
                "modern grounding is atomic: matter is made of atoms, a "
                "chemical change only redistributes the bonds between them, "
                "and an atom of carbon weighs the same whether it sits in "
                "charcoal or in carbon dioxide.\n\n"
                "Two statements follow, and it pays to keep them separate:\n\n"
                "- **Conservation of atoms.** The number of atoms of each "
                "element is identical before and after a reaction. This is "
                "the exact, element-by-element statement, and it is what "
                "balancing an equation enforces.\n"
                "- **Conservation of mass.** Total mass in equals total mass "
                "out. This follows from atom conservation, because each "
                "atom's mass is unchanged by bonding.\n\n"
                "The first statement is the stronger tool. A balance can only "
                "tell you the totals match; counting atoms tells you where "
                "every gram went."
            ),
        ),
        ReadingSection(
            id="open-systems",
            heading="Where the law appears to fail",
            body=(
                "Every apparent violation of mass conservation is a system "
                "boundary drawn in the wrong place. The balance weighs what "
                "sits on the pan, and a product that leaves the pan - or a "
                "reactant that arrives from off it - changes the reading "
                "without anything being created or destroyed.\n\n"
                "### Mass that seems to vanish\n\n"
                "Heat 100.09 g of calcium carbonate - one mole - in an open "
                "dish and the white solid left behind weighs 56.08 g:\n\n"
                "$$\\ce{CaCO3(s) -> CaO(s) + CO2(g)}$$\n\n"
                "The missing 44.01 g is one mole of carbon dioxide that "
                "drifted into the room, unweighed. The state labels in the "
                "equation are the part of the notation that predicts this: "
                "the (g) marks the product that can cross an open system's "
                "boundary. Run the same decomposition in a sealed flask and "
                "the balance does not move.\n\n"
                "### Mass that seems to appear\n\n"
                "Burn 2.00 g of magnesium ribbon in an open crucible and the "
                "white powder left behind weighs 3.32 g:\n\n"
                "$$\\ce{2Mg(s) + O2(g) -> 2MgO(s)}$$\n\n"
                "The extra 1.32 g is oxygen taken from the air - a reactant "
                "that arrived across the boundary. The arithmetic checks: "
                "2.00 g of Mg is 0.0823 mol, which claims 0.0411 mol of "
                "$\\ce{O2}$ at 32.00 g/mol, which is 1.32 g.\n\n"
                "The two cases are mirror images, and both resolve the same "
                "way: draw the boundary around everything, and the books "
                "balance to the last centigram."
            ),
            table=Table(
                caption="Both decompositions, atom by atom",
                columns=("Species", "Ca", "C", "O", "Mass (g per mol CaCO3)"),
                rows=(
                    ("CaCO3 in", "1", "1", "3", "100.09"),
                    ("CaO out", "1", "0", "1", "56.08"),
                    ("CO2 out", "0", "1", "2", "44.01"),
                    ("totals out", "1", "1", "3", "100.09"),
                ),
                source=(
                    "Molar masses computed from IUPAC standard atomic "
                    "weights: Ca 40.08, C 12.01, O 16.00."
                ),
                note=(
                    "The atom columns are the real bookkeeping. The mass "
                    "column just multiplies them by weights that never "
                    "change."
                ),
            ),
            important=(
                "A balance reading that changes during a reaction is telling "
                "you something crossed the system boundary, never that mass "
                "was created or destroyed. Ask what left or arrived - it is "
                "almost always a gas."
            ),
        ),
        ReadingSection(
            id="numbers",
            heading="The law with numbers on it",
            body=(
                "Run the check once in full for the synthesis of water, "
                "because this is the template every mass-balance argument "
                "follows:\n\n"
                "$$\\ce{2H2(g) + O2(g) -> 2H2O(l)}$$\n\n"
                "Take 2.000 mol of $\\ce{H2}$ and 1.000 mol of $\\ce{O2}$.\n\n"
                "- Mass in: $2.000 \\times 2.016 + 1.000 \\times 32.00 = "
                "4.032 + 32.00 = 36.03$ g\n"
                "- Mass out: $2.000 \\times 18.02 = 36.03$ g of water\n"
                "- Atoms in: 4 H and 2 O. Atoms out: 4 H and 2 O.\n\n"
                "The masses match because the atoms match. Nothing about the "
                "reaction needed to be measured to know this; it is forced "
                "by the formulas and the atomic weights.\n\n"
                "Run it once more on a fuel that is not a textbook special "
                "case. Propane burns as\n\n"
                "$$\\ce{C3H8(g) + 5O2(g) -> 3CO2(g) + 4H2O(l)}$$\n\n"
                "Take 1.000 mol of propane. Its molar mass, from the same "
                "atomic weights: $3 \\times 12.01 + 8 \\times 1.008 = "
                "36.03 + 8.064 = 44.094$, which is 44.09 g/mol at four "
                "figures.\n\n"
                "- Mass in: $44.09 + 5 \\times 32.00 = 204.09$ g\n"
                "- Mass out: $3 \\times 44.01 + 4 \\times 18.02 = 132.03 + "
                "72.08 = 204.11$ g\n"
                "- Atoms in: 3 C, 8 H, 10 O. Atoms out: 3 C, 8 H, "
                "$3 \\times 2 + 4 \\times 1 = 10$ O.\n\n"
                "The two mass totals disagree by 0.02 g in the fifth "
                "figure, and it is worth seeing exactly why: that is not "
                "chemistry leaking through the law, it is the molar masses "
                "having been rounded to four figures before the sums. "
                "Carry the unrounded values - $\\ce{C3H8}$ 44.094, "
                "$\\ce{CO2}$ 44.010, $\\ce{H2O}$ 18.016 - and both sides "
                "come to 204.094 g exactly. Atom conservation is exact; "
                "only the rounding wobbles, and learning to recognise "
                "rounding residue for what it is saves real confusion "
                "when the calculations get longer.\n\n"
                "### The boundary of the law\n\n"
                "Strictly, bond energy changes carry mass through "
                "$E = mc^2$, so an exothermic reaction's products are "
                "lighter than its reactants by $\\Delta E/c^2$. For "
                "combustion of a mole of methane that deficit is about "
                "$10^{-8}$ g - some nine orders of magnitude below what a "
                "good analytical balance resolves. Chemistry treats mass as "
                "exactly conserved because at chemical energies it is, to "
                "every decimal place an instrument can reach. Nuclear "
                "reactions are the domain where the correction becomes "
                "measurable, and they are outside this course."
            ),
        ),
        ReadingSection(
            id="combustion-analysis",
            heading="Combustion analysis: the law used as an instrument",
            body=(
                "Conservation of atoms is usually taught as a constraint. "
                "It is also a measuring instrument, and the classical "
                "composition measurement for organic compounds - "
                "combustion analysis - is nothing but the law run in "
                "reverse.\n\n"
                "The method: burn a weighed sample completely in excess "
                "oxygen and pass the exhaust through two absorption "
                "tubes, one that captures water and one that captures "
                "carbon dioxide. Weigh the tubes before and after. "
                "Because atoms are conserved, every carbon atom in the "
                "captured $\\ce{CO2}$ came from the sample, and every "
                "hydrogen atom in the captured water did too. The "
                "sample's composition is then arithmetic, not "
                "inference.\n\n"
                "### Worked\n\n"
                "A sample containing only carbon and hydrogen burns "
                "completely; the traps gain 8.802 g of $\\ce{CO2}$ and "
                "7.208 g of $\\ce{H2O}$.\n\n"
                "- Carbon: $8.802 / 44.01 = 0.2000$ mol of $\\ce{CO2}$, "
                "hence 0.2000 mol of C, hence $0.2000 \\times 12.01 = "
                "2.402$ g of carbon in the sample.\n"
                "- Hydrogen: $7.208 / 18.02 = 0.4000$ mol of water, and "
                "each water carries two hydrogens: 0.8000 mol of H, "
                "which is $0.8000 \\times 1.008 = 0.8064$ g.\n"
                "- Mass accounted for: $2.402 + 0.8064 = 3.2084$ g - "
                "the sample mass, recovered from the products alone.\n"
                "- Mole ratio: C to H is $0.2000$ to $0.8000$, which is "
                "1 to 4. The empirical formula is $\\ce{CH4}$; the "
                "sample was methane.\n\n"
                "When the compound also contains oxygen, that oxygen "
                "cannot be trapped separately - it leaves mixed into "
                "the $\\ce{CO2}$ and the water alongside oxygen from "
                "the gas supply. It is found by difference: sample "
                "mass minus carbon mass minus hydrogen mass. That "
                "subtraction is conservation of mass used a second "
                "time, and it is also where a slip in the C or H "
                "arithmetic surfaces, as a phantom oxygen percentage "
                "in a compound that contains none. The instrument is "
                "honest; the ledger has to be too."
            ),
        ),
        ReadingSection(
            id="what-the-law-licenses",
            heading="What the law licenses",
            body=(
                "Every calculation in the rest of this unit borrows its "
                "authority from this chapter. Reading a balanced "
                "equation as mole ratios, converting grams of reactant "
                "to grams of product, finding a limiting reactant, "
                "weighing a precipitate to learn what was dissolved - "
                "each of these assumes that atoms put in can be found "
                "again in the products, no more and no fewer. "
                "Gravimetric analysis is the purest case: to measure "
                "the sulfate dissolved in a water sample, precipitate "
                "it, dry it, and weigh it. The balance reading means "
                "something only because every sulfate ion that left "
                "the solution sits in the solid on the pan.\n\n"
                "The law also disciplines error-checking. If a "
                "stoichiometry answer implies more mass out than in, "
                "the answer is wrong, and no further inspection is "
                "needed to say so. Totalling the masses costs one line "
                "and catches dropped coefficients, inverted ratios and "
                "misplaced decimal points, which is why worked "
                "examples in this course end with a mass ledger "
                "wherever one fits. The habit generalises: any time a "
                "chain of conversions offers a conserved quantity to "
                "check against, check against it."
            ),
        ),
    ),
    key_takeaways=(
        "Atoms of each element are conserved exactly; mass conservation "
        "follows because bonding does not change an atom's mass.",
        "Every apparent violation is a boundary error: a gas left the open "
        "system or arrived from the air.",
        "State labels (s), (l), (g), (aq) are what predict which species can "
        "cross an open system's boundary.",
        "Sealed system, unchanged balance reading - the demonstration that "
        "settles it.",
        "The relativistic mass deficit at chemical energies is ~10^-8 g per "
        "mole of reaction: real, and unmeasurably small.",
    ),
    exam_tips=(
        "Open-container questions are the standard trap: burning metal gains "
        "mass (oxygen arrived), decomposing carbonate loses it (CO2 left). "
        "Name the crossing species and the question answers itself.",
        "If a question gives masses that do not balance, the difference IS "
        "the answer - it is the mass of the gas evolved or absorbed.",
    ),
))


# --------------------------------------------------------------------------
# 4.2 Balancing chemical equations
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="GEN1.BALANCE",
    lead=(
        "A chemical equation is a claim about atom bookkeeping, and an "
        "unbalanced one is a false claim. Balancing is the procedure that "
        "makes the equation obey conservation of atoms: adjust the "
        "coefficients in front of formulas - never the subscripts inside "
        "them - until every element counts the same on both sides."
    ),
    sections=(
        ReadingSection(
            id="coefficients-not-subscripts",
            heading="Coefficients, never subscripts",
            body=(
                "The single binding rule: a subscript is part of a "
                "substance's identity, a coefficient is a count of how many "
                "of it react.\n\n"
                "Consider the unbalanced combustion "
                "$\\ce{H2 + O2 -> H2O}$, two oxygens on the left and one on "
                "the right. Two 'fixes' present themselves:\n\n"
                "- Change the product to $\\ce{H2O2}$ - **wrong**. That "
                "balances the atoms by changing what the reaction makes: "
                "hydrogen peroxide is a different compound with different "
                "properties, and the reaction does not produce it.\n"
                "- Set coefficients: $\\ce{2H2 + O2 -> 2H2O}$ - **right**. "
                "Four hydrogens and two oxygens each side, and every "
                "substance is still itself.\n\n"
                "Editing a subscript to balance an equation is the "
                "chemistry equivalent of making an accounting ledger balance "
                "by renaming the accounts."
            ),
            important=(
                "Changing a subscript changes the substance. H2O and H2O2 "
                "differ by one letter of notation and are a drinking liquid "
                "and a bleaching agent. Coefficients are the only knob "
                "balancing is allowed to turn."
            ),
        ),
        ReadingSection(
            id="method",
            heading="A method that always terminates",
            body=(
                "Balancing by inspection is not guesswork if the elements "
                "are taken in the right order.\n\n"
                "- **1.** Balance elements that appear in exactly one "
                "formula on each side first.\n"
                "- **2.** Balance polyatomic ions as units when they survive "
                "the reaction intact ($\\ce{SO4^2-}$, $\\ce{NO3-}$, "
                "$\\ce{PO4^3-}$).\n"
                "- **3.** Leave until last any element appearing in several "
                "formulas - almost always O and H, and in combustion, the "
                "$\\ce{O2}$ that stands alone.\n"
                "- **4.** Clear fractions by multiplying through, then check "
                "every element.\n\n"
                "### Worked: a hydrocarbon combustion\n\n"
                "Balance $\\ce{C4H10 + O2 -> CO2 + H2O}$.\n\n"
                "Carbon first: 4 C on the left demands "
                "$4\\,\\ce{CO2}$. Hydrogen next: 10 H demand "
                "$5\\,\\ce{H2O}$. Oxygen last, counting the right side: "
                "$4 \\times 2 + 5 \\times 1 = 13$ O atoms, which is "
                "$\\tfrac{13}{2}\\,\\ce{O2}$. Multiply everything by 2:\n\n"
                "$$\\ce{2C4H10 + 13O2 -> 8CO2 + 10H2O}$$\n\n"
                "Check: C $8=8$, H $20=20$, O $26 = 16+10$. Balanced, "
                "smallest whole numbers, done.\n\n"
                "### What the coefficients mean\n\n"
                "Read $\\ce{2C4H10 + 13O2 -> 8CO2 + 10H2O}$ at the particle "
                "level: every 2 butane molecules consume 13 oxygen "
                "molecules. Read it at the mole level: 2 mol of butane "
                "consume 13 mol of oxygen. The coefficients are ratios, not "
                "amounts - the equation says nothing about how much butane "
                "you actually have, only about the proportions in which "
                "consumption happens. That ratio reading is the entire "
                "engine of the stoichiometry chapters that follow."
            ),
        ),
        ReadingSection(
            id="polyatomic-units",
            heading="Polyatomic ions as single units",
            body=(
                "When a polyatomic ion crosses the arrow intact - the "
                "same cluster of atoms, the same charge, on both sides - "
                "count it as one token instead of dissolving it into "
                "elements. The bookkeeping shrinks, and the error rate "
                "shrinks with it.\n\n"
                "Balance $\\ce{Al(OH)3 + H2SO4 -> Al2(SO4)3 + H2O}$. "
                "Counting sulfur and oxygen separately invites a long "
                "evening; counting sulfate as a unit, the product side "
                "fixes 2 aluminiums and 3 sulfates at once:\n\n"
                "$$\\ce{2Al(OH)3 + 3H2SO4 -> Al2(SO4)3 + 6H2O}$$\n\n"
                "Check - Al: $2 = 2$. $\\ce{SO4}$ units: $3 = 3$. H: "
                "$2 \\times 3 + 3 \\times 2 = 12$ on the left, "
                "$6 \\times 2 = 12$ on the right. Non-sulfate O: "
                "$2 \\times 3 = 6$ left, $6 \\times 1 = 6$ right. "
                "Balanced in two moves.\n\n"
                "The same shortcut on a precipitation:\n\n"
                "$$\\ce{3Ca(NO3)2 + 2Na3PO4 -> Ca3(PO4)2 + 6NaNO3}$$\n\n"
                "Ca $3 = 3$, $\\ce{NO3}$ $6 = 6$, Na $6 = 6$, "
                "$\\ce{PO4}$ $2 = 2$. Four counts instead of five "
                "atom-by-atom tallies, and every count is smaller.\n\n"
                "The shortcut has a boundary, and it matters: the unit "
                "treatment is legitimate only while the ion really does "
                "survive unchanged. Where sulfate is reduced to sulfur "
                "dioxide, or a carbonate meets acid and leaves as "
                "$\\ce{CO2}$, the cluster is broken and the counting "
                "must fall back to elements. Before treating a group "
                "as a unit, confirm the same formula with the same "
                "charge stands on both sides of the arrow. If it does "
                "not, the shortcut is not a shortcut; it is a wrong "
                "count wearing one's clothes."
            ),
        ),
        ReadingSection(
            id="fractions",
            heading="Fractional coefficients, and clearing them",
            body=(
                "Balancing ethane's combustion runs the standard order "
                "- C, then H, then O - straight into a fraction. In "
                "$\\ce{C2H6 + O2 -> CO2 + H2O}$, 2 carbons demand "
                "$2\\,\\ce{CO2}$ and 6 hydrogens demand "
                "$3\\,\\ce{H2O}$, and the right side then holds "
                "$2 \\times 2 + 3 \\times 1 = 7$ oxygen atoms - three "
                "and a half $\\ce{O2}$ molecules:\n\n"
                "$$\\ce{C2H6 + 7/2 O2 -> 2CO2 + 3H2O}$$\n\n"
                "Read as mole ratios there is nothing wrong with that "
                "line: half a mole of oxygen is a perfectly good "
                "amount. Read at the particle level it is nonsense - "
                "no half-molecule collides with anything - and the "
                "convention for a final answer is smallest whole "
                "numbers. Multiply every coefficient by 2:\n\n"
                "$$\\ce{2C2H6 + 7O2 -> 4CO2 + 6H2O}$$\n\n"
                "Check: C $4 = 4$, H $12 = 12$, O $14 = 8 + 6$.\n\n"
                "Two remarks worth carrying forward. First, clear the "
                "fraction by multiplying EVERY coefficient, including "
                "the ones already whole; doubling only the fraction is "
                "the slip the final recount exists to catch. Second, "
                "fractional coefficients are not always temporary "
                "scaffolding. Thermochemistry deliberately writes "
                "$\\ce{H2 + 1/2 O2 -> H2O}$ so that the heat quoted "
                "belongs to exactly one mole of product. A fraction is "
                "a statement about what the equation is FOR, not an "
                "arithmetic error - but on an item that asks for "
                "smallest whole-number coefficients, it is a wrong "
                "answer, and the sum of all coefficients (a favourite "
                "exam ask) is defined on the whole-number form: here "
                "$2 + 7 + 4 + 6 = 19$."
            ),
        ),
        ReadingSection(
            id="common-errors",
            heading="Where balancing goes wrong",
            body=(
                "Four errors account for most wrong balances, and each "
                "has a mechanical fix.\n\n"
                "- **Editing subscripts.** Covered above, and repeated "
                "because it is the one that feels legal under time "
                "pressure. The fix is absolute: coefficients only, "
                "every time, no exceptions.\n"
                "- **Miscounting through parentheses.** "
                "$\\ce{Ca(NO3)2}$ contains 1 calcium, 2 nitrogens and "
                "6 oxygens - the subscript outside the parenthesis "
                "multiplies everything inside. With a coefficient as "
                "well, $3\\,\\ce{Ca(NO3)2}$ carries $3 \\times 2 = 6$ "
                "N and $3 \\times 6 = 18$ O. Multiply it out "
                "deliberately, every time; this is the single most "
                "common counting slip in the first weeks.\n"
                "- **Forgetting the diatomic elements.** Hydrogen, "
                "nitrogen, oxygen and the halogens exist as "
                "$\\ce{H2}$, $\\ce{N2}$, $\\ce{O2}$, $\\ce{Cl2}$ when "
                "free. Writing $\\ce{Fe + O -> FeO}$ balances "
                "beautifully and describes nothing that exists in a "
                "flask.\n"
                "- **Not recounting after the last change.** Balancing "
                "is iterative, and fixing the last element can "
                "unbalance the first. The iron oxidation shows it: in "
                "$\\ce{Fe + O2 -> Fe2O3}$, fixing Fe with a 2 leaves "
                "2 O on the left against 3 on the right. The "
                "whole-number route goes through the least common "
                "multiple, 6: $3\\,\\ce{O2}$ against "
                "$2\\,\\ce{Fe2O3}$ - which silently doubles the iron "
                "requirement to $4\\,\\ce{Fe}$. The finished line, "
                "$\\ce{4Fe + 3O2 -> 2Fe2O3}$, then gets a full "
                "recount - Fe $4 = 4$, O $6 = 6$ - as the last step, "
                "not an optional one.\n\n"
                "The habit underneath all four fixes is the same: the "
                "check at the end is part of the method, not a "
                "courtesy to the grader. A balance that has not been "
                "recounted from scratch is a draft, whatever it looks "
                "like."
            ),
        ),
        ReadingSection(
            id="states-and-conditions",
            heading="States, conditions, and what an equation does not say",
            body=(
                "A full equation carries state labels - (s) solid, (l) "
                "liquid, (g) gas, (aq) dissolved in water - and sometimes a "
                "condition over the arrow (heat, a catalyst, light). Two "
                "cautions about what remains unsaid:\n\n"
                "- An equation is silent about **rate**. "
                "$\\ce{2H2 + O2 -> 2H2O}$ is balanced whether the mixture "
                "explodes or sits inert for a century awaiting a spark.\n"
                "- An equation is silent about **mechanism**. Thirteen "
                "$\\ce{O2}$ molecules do not collide with two butanes in one "
                "grand encounter; the balanced equation is the net "
                "bookkeeping of many elementary steps.\n\n"
                "Both silences matter later: kinetics owns rate and "
                "mechanism, and mistaking a balanced equation for either is "
                "a named misconception this course routes wrong answers to."
            ),
            table=Table(
                caption="Balancing checks on three equations",
                columns=("Equation", "Element count check", "Status"),
                rows=(
                    ("2H2 + O2 -> 2H2O", "H 4=4, O 2=2", "balanced"),
                    ("N2 + 3H2 -> 2NH3", "N 2=2, H 6=6", "balanced"),
                    ("Fe + O2 -> Fe2O3", "Fe 1 vs 2, O 2 vs 3", "not balanced"),
                ),
                source="Counted directly from the formulas shown.",
                note=(
                    "The iron oxidation balances as 4Fe + 3O2 -> 2Fe2O3: "
                    "Fe 4=4, O 6=6."
                ),
            ),
        ),
    ),
    key_takeaways=(
        "Balance with coefficients only. A subscript edit changes the "
        "substance, not the count.",
        "Order of attack: lone elements first, intact polyatomic ions as "
        "units, O and H last, clear fractions at the end.",
        "Coefficients are ratios at both the particle and the mole level - "
        "they say proportions, never amounts.",
        "A balanced equation says nothing about rate or mechanism.",
    ),
    exam_tips=(
        "Combustion balancing with an odd oxygen count is the classic timed "
        "item: balance C, then H, accept the fraction on O2, double through.",
        "Check answers by counting the LAST element you balanced on both "
        "sides - it is where slips survive.",
    ),
))


# --------------------------------------------------------------------------
# 4.3 Classifying reactions
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="GEN1.REACTIONTYPES",
    lead=(
        "Millions of reactions reduce to a handful of patterns, and "
        "recognising the pattern is what lets you predict products before "
        "you have ever seen the specific reaction. This chapter gives the "
        "five classical types, the driving question each one answers, and "
        "the overlap cases where one reaction honestly belongs to two "
        "classes."
    ),
    sections=(
        ReadingSection(
            id="five-types",
            heading="The five classical types",
            body=(
                "### Synthesis (combination)\n\n"
                "Two or more reactants become one product: "
                "$\\ce{A + B -> AB}$. Example: "
                "$\\ce{2Mg + O2 -> 2MgO}$.\n\n"
                "### Decomposition\n\n"
                "One reactant becomes two or more products, usually under "
                "heat, light or electricity: $\\ce{AB -> A + B}$. Example: "
                "$\\ce{CaCO3 -> CaO + CO2}$.\n\n"
                "### Single displacement\n\n"
                "A free element trades places with an element in a "
                "compound: $\\ce{A + BC -> AC + B}$. Example: "
                "$\\ce{Zn + CuSO4 -> ZnSO4 + Cu}$ - zinc metal in, copper "
                "metal out. Whether it happens at all is decided by the "
                "activity series: a metal displaces only metals below it.\n\n"
                "### Double displacement (metathesis)\n\n"
                "Two compounds swap partners: "
                "$\\ce{AB + CD -> AD + CB}$. These run only when a product "
                "removes ions from solution - a precipitate, a gas, or "
                "water. Example: "
                "$\\ce{AgNO3 + NaCl -> AgCl(s) + NaNO3}$.\n\n"
                "### Combustion\n\n"
                "Rapid reaction with $\\ce{O2}$, releasing heat and light. "
                "For hydrocarbons with enough oxygen, the products are "
                "always $\\ce{CO2}$ and $\\ce{H2O}$."
            ),
            table=Table(
                caption="The five types at a glance",
                columns=("Type", "Skeleton", "What decides whether it runs"),
                rows=(
                    ("synthesis", "A + B -> AB", "thermodynamics of the product"),
                    ("decomposition", "AB -> A + B", "energy input supplied"),
                    ("single displacement", "A + BC -> AC + B", "activity series"),
                    ("double displacement", "AB + CD -> AD + CB",
                     "an ion-removing product: solid, gas or water"),
                    ("combustion", "fuel + O2 -> oxides", "ignition"),
                ),
                source="Standard classification; skeletons as defined above.",
                note=(
                    "The skeletons overlap: a combustion of a metal is also "
                    "a synthesis. Classification is a lens, not a partition."
                ),
            ),
        ),
        ReadingSection(
            id="worked-classifications",
            heading="Six classifications, worked",
            body=(
                "Classification is a skill of seconds, and the way to "
                "get it there is to watch the reasoning run on real "
                "equations, slowly, a few times. In each case the "
                "reasoning reads the SHAPES first - how many "
                "reactants, how many products, where the free "
                "elements sit - and only then asks the deeper "
                "question of what is being transferred. Shape is "
                "visible at a glance; transfer takes the tools of "
                "later chapters; and most exam items are answerable "
                "at the shape level alone.\n\n"
                "**$\\ce{2KClO3 -> 2KCl + 3O2}$.** One reactant, "
                "several products, heat required: decomposition. A "
                "free element appears on the right, so it is also "
                "redox - chlorine's oxidation number falls from the "
                "chlorate, oxygen's rises to zero. This is the "
                "classic laboratory oxygen source.\n\n"
                "**$\\ce{Zn + 2HCl -> ZnCl2 + H2}$.** A free metal "
                "in, a free gas out: single displacement, zinc "
                "displacing hydrogen from the acid. Redox "
                "necessarily, with a free element on each side of "
                "the arrow.\n\n"
                "**$\\ce{AgNO3 + NaCl -> AgCl(s) + NaNO3}$.** Two "
                "aqueous ionic compounds swapping partners and a "
                "solid falling out of solution: double displacement, "
                "driven by precipitation. No oxidation number moves "
                "anywhere - silver enters as $\\ce{Ag+}$ and leaves "
                "as $\\ce{Ag+}$, merely changing company.\n\n"
                "**$\\ce{C3H8 + 5O2 -> 3CO2 + 4H2O}$.** A "
                "hydrocarbon consuming oxygen to give carbon dioxide "
                "and water: combustion, and redox as all combustion "
                "is.\n\n"
                "**$\\ce{CaO + H2O -> Ca(OH)2}$.** Two reactants, "
                "one product: synthesis - and a useful "
                "counterexample to a tempting shortcut, because no "
                "oxidation number changes here. Calcium is $+2$ "
                "throughout, oxygen $-2$, hydrogen $+1$. Synthesis "
                "is a shape, not a chemistry: some syntheses are "
                "redox (magnesium burning), some are not (an oxide "
                "hydrating to a hydroxide).\n\n"
                "**$\\ce{Fe + CuSO4 -> FeSO4 + Cu}$.** Free iron in, "
                "free copper out: single displacement, allowed "
                "because iron stands above copper in the activity "
                "series. This one is worth seeing done: an iron "
                "nail left in blue copper sulfate solution grows a "
                "red-brown coat of copper metal while the blue of "
                "the solution fades.\n\n"
                "Two labels landing on one equation is normal - "
                "$\\ce{2Mg + O2 -> 2MgO}$ is synthesis and "
                "combustion at once, and decomposition of a chlorate "
                "is decomposition and redox at once. The classes are "
                "lenses; hold up more than one when more than one "
                "fits."
            ),
        ),
        ReadingSection(
            id="activity-series",
            heading="The activity series, used",
            body=(
                "Single displacement is the one type whose 'does it "
                "run at all?' question has a lookup answer. The "
                "activity series ranks metals by how readily they "
                "give up electrons, and the working rule is that a "
                "free metal displaces from solution only the ions of "
                "metals BELOW it in the series. A shortened series, "
                "most active first, is worth memorising: K, Na, Ca, "
                "Mg, Al, Zn, Fe, Pb, H, Cu, Ag. Hydrogen sits in "
                "the list as the reference point: metals above it "
                "displace $\\ce{H2}$ from acids, metals below it do "
                "not.\n\n"
                "Applying the series is one comparison per "
                "question:\n\n"
                "- $\\ce{Zn + CuSO4}$: zinc stands above copper, so "
                "the reaction runs - "
                "$\\ce{Zn + CuSO4 -> ZnSO4 + Cu}$.\n"
                "- $\\ce{Cu + ZnSO4}$: copper stands below zinc, so "
                "nothing happens, and 'no reaction' is the answer, "
                "written as such.\n"
                "- $\\ce{Cu + HCl}$: copper below hydrogen - no "
                "reaction, which is why copper vessels survive "
                "dilute acids.\n"
                "- $\\ce{Zn + 2HCl -> ZnCl2 + H2}$: zinc above "
                "hydrogen - hydrogen gas bubbles off, the standard "
                "laboratory generator of $\\ce{H2}$.\n\n"
                "The series is the first appearance of a theme the "
                "redox chapters make quantitative: some elements "
                "hold electrons more tightly than others, and "
                "spontaneous electron transfer runs downhill along "
                "that ranking. For now it is a qualitative ordering, "
                "stated as a rule and used as one - and it already "
                "predicts, correctly, which single-displacement "
                "items are trick questions whose right answer is "
                "that nothing happens.\n\n"
                "Two cautions close the topic. The series as used "
                "here covers displacement from aqueous solution; "
                "other settings follow related but not identical "
                "orderings. And the most active metals need no acid "
                "at all: sodium dropped into plain water displaces "
                "hydrogen from the water itself, which is why it is "
                "stored under oil and handled with forceps."
            ),
        ),
        ReadingSection(
            id="two-deeper-classes",
            heading="The two deeper classes underneath",
            body=(
                "The five patterns are shapes on paper. Chemically, almost "
                "every reaction in this course belongs to one of two deeper "
                "families, defined by what is actually transferred:\n\n"
                "- **Electron transfer - redox.** Oxidation numbers change. "
                "All combustion, all single displacement, and any synthesis "
                "or decomposition involving free elements are redox, "
                "because an element's oxidation number must move off zero "
                "when it enters a compound.\n"
                "- **Partner swapping without electron transfer.** "
                "Precipitation and acid-base neutralisation: ions change "
                "partners, no oxidation number moves.\n\n"
                "This is why the next three chapters take up solubility, "
                "net ionic equations and neutralisation, and the one after "
                "them oxidation numbers: the five-type scheme sorts "
                "reactions by shape, but predicting chemistry needs the "
                "transfer question answered.\n\n"
                "### Reading a reaction quickly\n\n"
                "- A free element on either side? Almost certainly redox.\n"
                "- Two aqueous ionic compounds in, and a solid, gas or "
                "water out? Metathesis; check the solubility rules.\n"
                "- One reactant, energy in? Decomposition.\n"
                "- $\\ce{O2}$ consumed with heat and light out? Combustion, "
                "and also redox."
            ),
            important=(
                "A free element anywhere in the equation is the fastest "
                "redox tell there is: its oxidation number is zero as an "
                "element and cannot stay zero inside a compound."
            ),
        ),
        ReadingSection(
            id="from-type-to-products",
            heading="From type to products",
            body=(
                "Predict-the-products items reverse the classification "
                "skill: given only reactants, name the type from their "
                "shapes, and the products follow from the skeleton.\n\n"
                "- **Two free elements** can only combine: synthesis. "
                "$\\ce{Al + O2}$ must head toward the oxide; write "
                "$\\ce{Al2O3}$ from the ion charges ($\\ce{Al^3+}$ "
                "with $\\ce{O^2-}$), then balance: "
                "$\\ce{4Al + 3O2 -> 2Al2O3}$. Check: Al $4 = 4$, O "
                "$6 = 6$. Notice the order of operations - the "
                "product's FORMULA comes from charges, and only then "
                "do coefficients enter. Balancing cannot rescue a "
                "wrong formula.\n"
                "- **A free element plus a compound** is a "
                "displacement candidate: consult the activity series "
                "before writing anything, because 'no reaction' is a "
                "live option.\n"
                "- **Two aqueous ionic compounds** is metathesis: "
                "form the two new pairings and consult the "
                "solubility rules of the next chapter. No insoluble "
                "pairing, no gas, no water formed - no reaction.\n"
                "- **A hydrocarbon and oxygen** is combustion: the "
                "products are $\\ce{CO2}$ and $\\ce{H2O}$, and the "
                "only work left is balancing.\n"
                "- **One compound and an energy input** is "
                "decomposition, the least predictable of the five "
                "without more chemistry: carbonates shed "
                "$\\ce{CO2}$, chlorates shed $\\ce{O2}$, and beyond "
                "such memorised families the products must be given "
                "in the problem or learned per compound.\n\n"
                "The habit to build: type first, skeleton second, "
                "balancing last. Reaching for coefficients before "
                "naming the type produces beautifully balanced "
                "equations for reactions that do not occur - the "
                "balancing chapter made the coefficients "
                "trustworthy, but only this chapter says whether "
                "there is a reaction to balance at all."
            ),
        ),
    ),
    key_takeaways=(
        "Five shapes: synthesis, decomposition, single displacement, double "
        "displacement, combustion.",
        "Two chemistries underneath: electron transfer (redox) and partner "
        "swapping (precipitation, acid-base).",
        "Single displacement is governed by the activity series; double "
        "displacement needs a precipitate, gas or water to form.",
        "A free element in the equation means redox, always.",
        "Hydrocarbon combustion with sufficient oxygen gives CO2 and H2O, "
        "every time.",
    ),
    exam_tips=(
        "Classification items often admit two right labels (Mg + O2 is both "
        "synthesis and combustion). Pick the one the question's context "
        "rewards - if the choices include both, look for the more specific.",
        "Predict-the-products items are type-recognition in disguise: name "
        "the type first, then the products write themselves.",
    ),
))


# --------------------------------------------------------------------------
# 4.4 Solubility rules and precipitation
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="GEN1.SOLUBILITY",
    lead=(
        "Mix two clear solutions and a solid appears: that is "
        "precipitation, and it happens when some new pairing of the ions "
        "present is insoluble. The solubility rules are the short lookup "
        "table that predicts it. Learn them as a hierarchy - a few rules "
        "that almost never lose to the ones below them - rather than as a "
        "flat list. The chapter closes by attaching masses to the "
        "predictions, because a precipitate you can predict is also a "
        "precipitate you can weigh."
    ),
    sections=(
        ReadingSection(
            id="the-rules",
            heading="The rules, in order of precedence",
            body=(
                "Read from the top; the first rule that applies wins.\n\n"
                "- **1. Alkali metal cations ($\\ce{Li+}$, $\\ce{Na+}$, "
                "$\\ce{K+}$...) and ammonium ($\\ce{NH4+}$)**: every common "
                "salt is soluble. No exceptions at this course's level.\n"
                "- **2. Nitrates ($\\ce{NO3-}$) and acetates "
                "($\\ce{CH3COO-}$)**: all soluble. No exceptions.\n"
                "- **3. Chlorides, bromides, iodides**: soluble, EXCEPT "
                "with $\\ce{Ag+}$, $\\ce{Pb^2+}$ and $\\ce{Hg2^2+}$.\n"
                "- **4. Sulfates ($\\ce{SO4^2-}$)**: soluble, EXCEPT with "
                "$\\ce{Ba^2+}$, $\\ce{Sr^2+}$, $\\ce{Pb^2+}$ and "
                "(borderline) $\\ce{Ca^2+}$.\n"
                "- **5. Carbonates, phosphates, sulfides, hydroxides**: "
                "insoluble, EXCEPT where rule 1 rescues them. Hydroxides of "
                "$\\ce{Ca^2+}$, $\\ce{Sr^2+}$, $\\ce{Ba^2+}$ are slightly "
                "to moderately soluble.\n\n"
                "Rules 1 and 2 outrank everything: silver carbonate is "
                "insoluble, but sodium carbonate is soluble because sodium "
                "wins."
            ),
            table=Table(
                caption="The high-traffic precipitates",
                columns=("Precipitate", "Formed from", "Colour"),
                rows=(
                    ("AgCl", "Ag+ + Cl-", "white"),
                    ("AgBr", "Ag+ + Br-", "cream"),
                    ("AgI", "Ag+ + I-", "yellow"),
                    ("BaSO4", "Ba2+ + SO4^2-", "white"),
                    ("PbI2", "Pb2+ + I-", "bright yellow"),
                    ("CaCO3", "Ca2+ + CO3^2-", "white"),
                    ("Fe(OH)3", "Fe3+ + OH-", "rust brown"),
                    ("Cu(OH)2", "Cu2+ + OH-", "pale blue"),
                ),
                source=(
                    "Standard qualitative-analysis observations as "
                    "tabulated in general chemistry texts."
                ),
                note=(
                    "Colours are worth knowing because exam items use them "
                    "as identifiers: a bright yellow precipitate from a "
                    "lead solution is PbI2 before you have read the "
                    "choices."
                ),
            ),
        ),
        ReadingSection(
            id="predicting",
            heading="Predicting a precipitate in three moves",
            body=(
                "### The procedure\n\n"
                "- **1.** Write all four ions the two solutions deliver.\n"
                "- **2.** Form the two NEW pairings (each cation with the "
                "other anion).\n"
                "- **3.** Check each new pairing against the rules. "
                "Insoluble pairing precipitates; if both new pairings are "
                "soluble, nothing happens and the honest answer is 'no "
                "reaction'.\n\n"
                "### Worked\n\n"
                "Mix barium chloride and sodium sulfate solutions. Ions "
                "present: $\\ce{Ba^2+}$, $\\ce{Cl-}$, $\\ce{Na+}$, "
                "$\\ce{SO4^2-}$. New pairings: $\\ce{BaSO4}$ and "
                "$\\ce{NaCl}$. Rule 4 catches barium sulfate - insoluble; "
                "rule 1 clears sodium chloride - soluble.\n\n"
                "$$\\ce{BaCl2(aq) + Na2SO4(aq) -> BaSO4(s) + 2NaCl(aq)}$$\n\n"
                "Mix potassium nitrate with sodium chloride instead: the "
                "new pairings are $\\ce{KCl}$ and $\\ce{NaNO3}$, both "
                "soluble by rules 1 and 2. All four ions stay dissolved, "
                "the 'equation' has identical species on both sides, and "
                "writing 'no reaction' is the correct answer - not a "
                "failure to find one.\n\n"
                "What 'insoluble' means quantitatively is postponed to the "
                "equilibrium chapters, where it becomes a solubility "
                "product. Here the working definition is: so little "
                "dissolves that the pairing appears as a solid."
            ),
            important=(
                "'No reaction' is a real answer and exam writers use it. If "
                "both new pairings pass the solubility rules, do not invent "
                "a precipitate to have something to write."
            ),
        ),
        ReadingSection(
            id="worked-predictions",
            heading="Four more predictions, worked in full",
            body=(
                "The three-move procedure gets fast only with "
                "repetition, so here are four more runs, chosen to "
                "span the rules that carry most of the traffic. In "
                "each one the moves are identical: list the four "
                "ions the solutions deliver, form the two new "
                "pairings, and read the rules from the top. What "
                "changes between problems is only which rule fires, "
                "and the whole skill is refusing to skip a move "
                "even when the answer looks obvious.\n\n"
                "**Silver nitrate + potassium chloride.** Ions "
                "delivered: $\\ce{Ag+}$, $\\ce{NO3-}$, $\\ce{K+}$, "
                "$\\ce{Cl-}$. New pairings: $\\ce{AgCl}$ and "
                "$\\ce{KNO3}$. Rule 3's exception list catches "
                "silver chloride - insoluble; rules 1 and 2 both "
                "clear potassium nitrate.\n\n"
                "$$\\ce{AgNO3(aq) + KCl(aq) -> AgCl(s) + KNO3(aq)}$$\n\n"
                "**Lead(II) nitrate + potassium iodide.** New "
                "pairings: $\\ce{PbI2}$ and $\\ce{KNO3}$. Lead is on "
                "rule 3's exception list, so the iodide precipitates "
                "- the bright yellow solid of the table above:\n\n"
                "$$\\ce{Pb(NO3)2(aq) + 2KI(aq) -> PbI2(s) + "
                "2KNO3(aq)}$$\n\n"
                "Note the 2 on the potassium iodide: a prediction "
                "ends with a BALANCED equation, and the iodide "
                "arithmetic is part of the answer, not an "
                "afterthought.\n\n"
                "**Copper(II) sulfate + sodium hydroxide.** New "
                "pairings: $\\ce{Cu(OH)2}$ and $\\ce{Na2SO4}$. Rule "
                "5 makes the hydroxide insoluble - copper is not one "
                "of the rescued cations - and rule 1 clears sodium "
                "sulfate:\n\n"
                "$$\\ce{CuSO4(aq) + 2NaOH(aq) -> Cu(OH)2(s) + "
                "Na2SO4(aq)}$$\n\n"
                "The pale blue gel that settles out is the table's "
                "$\\ce{Cu(OH)2}$, and the colour is diagnostic.\n\n"
                "**Ammonium carbonate + calcium chloride.** New "
                "pairings: $\\ce{CaCO3}$ and $\\ce{NH4Cl}$. Rule 5 "
                "catches the carbonate; rule 1 clears the ammonium "
                "salt:\n\n"
                "$$\\ce{(NH4)2CO3(aq) + CaCl2(aq) -> CaCO3(s) + "
                "2NH4Cl(aq)}$$\n\n"
                "And one deliberate blank to close. **Sodium nitrate "
                "+ magnesium sulfate**: the new pairings are "
                "$\\ce{Na2SO4}$ and $\\ce{Mg(NO3)2}$, cleared by "
                "rules 1 and 2 respectively. All four ions stay in "
                "solution, and the answer is 'no reaction', written "
                "without apology."
            ),
        ),
        ReadingSection(
            id="reading-the-rules",
            heading="What the rules are, and are not",
            body=(
                "The solubility rules are qualitative, and knowing "
                "exactly what kind of statement they make prevents "
                "two common misreadings.\n\n"
                "They are not measurements. 'Insoluble' does not "
                "mean that zero dissolves; it means so little "
                "dissolves that a visible solid forms when the ions "
                "meet at ordinary laboratory concentrations. Every "
                "'insoluble' salt has a small, real, measurable "
                "solubility, and the equilibrium chapters will give "
                "it a number - the solubility product. The rules "
                "compress those numbers into a yes or a no that is "
                "good enough for prediction, which is all this unit "
                "asks of them.\n\n"
                "They are a precedence hierarchy, not a flat list. "
                "When two rules seem to disagree about a compound, "
                "the higher rule wins, and the design is deliberate: "
                "rules 1 and 2 are stated without exceptions "
                "precisely so they can be trusted over everything "
                "below them. Sodium carbonate falls under rule 5's "
                "'carbonates are insoluble' and under rule 1's "
                "'sodium salts are soluble'; rule 1 wins and the "
                "salt dissolves freely. Working the rules top-down "
                "makes the collision impossible to mishandle.\n\n"
                "And they have a stated scope: the common ions of a "
                "first course, in water, near room temperature. The "
                "borderline species the rules flag - calcium "
                "sulfate, calcium hydroxide and its heavier "
                "congeners - are salts whose solubility sits "
                "awkwardly between yes and no. Exam writers mostly "
                "avoid resting an item on them; where one appears, "
                "read it as the rule states it, with 'slightly "
                "soluble' meaning a precipitate from concentrated "
                "solutions and possibly none from dilute ones.\n\n"
                "As for where the rules come from: dissolving an "
                "ionic solid is a competition between the lattice, "
                "which holds the ions together, and hydration - "
                "water's attraction to charged particles - which "
                "pulls them apart. The general drift of the table "
                "reflects that contest: anions carrying two or "
                "three units of charge (carbonate, phosphate, "
                "sulfide) build stronger lattices and mostly sink, "
                "while singly charged anions (nitrate, the halides) "
                "mostly swim. But the details are irregular enough "
                "that chemistry keeps the lookup table rather than "
                "a formula, and memorising the rules is not a "
                "failure of understanding - it is what the subject "
                "itself does."
            ),
        ),
        ReadingSection(
            id="from-prediction-to-grams",
            heading="From prediction to grams",
            body=(
                "A predicted precipitate becomes a stoichiometry "
                "problem the moment volumes and concentrations are "
                "attached, and that combination is the standard "
                "closing act of this unit's exams.\n\n"
                "Mix 250.0 mL of 0.200 M barium chloride with excess "
                "sodium sulfate solution. 'Excess' does the "
                "licensing work in that sentence: it promises every "
                "barium ion finds a sulfate, so the barium is the "
                "limiting quantity and converts completely to "
                "solid.\n\n"
                "- Moles of $\\ce{Ba^2+}$: $0.2500 \\times 0.200 = "
                "0.0500$ mol.\n"
                "- The pairing $\\ce{Ba^2+ + SO4^2- -> BaSO4}$ is "
                "one to one, so 0.0500 mol of $\\ce{BaSO4}$ forms.\n"
                "- Molar mass of $\\ce{BaSO4}$: $137.3 + 32.06 + "
                "4 \\times 16.00 = 233.4$ g/mol (rounded from "
                "233.36).\n"
                "- Mass: $0.0500 \\times 233.4 = 11.67$ g of dry "
                "precipitate.\n\n"
                "The same template with silver: a solution holding "
                "0.1000 mol of $\\ce{Ag+}$, treated with excess "
                "chloride, delivers 0.1000 mol of $\\ce{AgCl}$ at "
                "$107.9 + 35.45 = 143.4$ g/mol (rounded from "
                "143.35), which is $0.1000 \\times 143.4 = 14.34$ "
                "g.\n\n"
                "Run in reverse, this is gravimetric analysis: "
                "weigh the dried precipitate, divide by its molar "
                "mass, and the mole count of the dissolved ion "
                "falls out. The method's validity rests on the "
                "chapters before this one - the solid must capture "
                "ALL of the target ion, which is what the excess "
                "precipitant and the rule-certified insolubility "
                "guarantee, and the equation converting solid back "
                "to dissolved ion must be balanced. Solubility "
                "rules pick the reagent; conservation of atoms "
                "makes the balance reading mean something. Every "
                "gravimetric determination on an exam is these two "
                "chapters stapled together, and the marks usually "
                "split the same way: one for the right precipitate, "
                "one for the right mass."
            ),
        ),
    ),
    key_takeaways=(
        "Learn the rules as a precedence list: alkali metals and ammonium, "
        "then nitrates and acetates, outrank everything below.",
        "Halides fail with Ag+, Pb2+, Hg2^2+; sulfates fail with Ba2+, "
        "Sr2+, Pb2+.",
        "Carbonates, phosphates, sulfides, hydroxides are insoluble unless "
        "rule 1 rescues them.",
        "Predict by forming the two new ion pairings and checking each - "
        "and say 'no reaction' when both are soluble.",
        "Precipitate colours (AgCl white, PbI2 yellow, Fe(OH)3 rust) are "
        "identifiers, not decoration.",
    ),
    exam_tips=(
        "The MCAT and course exams both like the double-negative form: "
        "'which pair produces NO precipitate?' Work each option's new "
        "pairings; do not pattern-match on familiar formulas.",
        "Ba2+ + sulfate and Ag+ + halide cover a large fraction of all "
        "precipitation items ever written.",
    ),
))


# --------------------------------------------------------------------------
# 4.5 Complete and net ionic equations
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="GEN1.NETIONIC",
    lead=(
        "The molecular equation you balance is not what the beaker "
        "contains. Strong electrolytes exist in solution as separated "
        "ions, and the net ionic equation is the notation that says only "
        "what actually changes - with the bystanders struck out. Getting "
        "from one to the other is a three-step rewrite with exactly one "
        "hard decision in it: what to split."
    ),
    sections=(
        ReadingSection(
            id="three-equations",
            heading="Three equations for one event",
            body=(
                "Take the precipitation from the last chapter:\n\n"
                "### Molecular\n\n"
                "$$\\ce{BaCl2(aq) + Na2SO4(aq) -> BaSO4(s) + 2NaCl(aq)}$$\n\n"
                "Every substance written as if molecular. Good for "
                "stoichiometry and for naming the reagents on the shelf.\n\n"
                "### Complete ionic\n\n"
                "$$\\ce{Ba^2+ + 2Cl- + 2Na+ + SO4^2- -> BaSO4(s) + 2Na+ + "
                "2Cl-}$$\n\n"
                "Every strong electrolyte marked (aq) is split into its "
                "ions. The solid is not split - it left the solution.\n\n"
                "### Net ionic\n\n"
                "$\\ce{Na+}$ and $\\ce{Cl-}$ appear unchanged on both "
                "sides: spectator ions. Cancel them:\n\n"
                "$$\\ce{Ba^2+(aq) + SO4^2-(aq) -> BaSO4(s)}$$\n\n"
                "That is the chemistry. Any soluble barium salt plus any "
                "soluble sulfate gives this same net equation, which is "
                "exactly the generalising power the notation exists to "
                "provide.\n\n"
                "Keep the three notations mentally filed by what each "
                "one is FOR. The molecular equation is the recipe: it "
                "names the bottles taken off the shelf and it feeds "
                "the mass arithmetic, because molar masses attach to "
                "whole formulas. The complete ionic equation is the "
                "honest inventory of the beaker. The net ionic "
                "equation is the chemistry with the packaging "
                "stripped away. Fluency means moving between the "
                "three on demand, and exam items test the moves in "
                "both directions: given a net equation, propose "
                "reagents that would produce it; given reagents, "
                "strip them down to the net."
            ),
        ),
        ReadingSection(
            id="what-splits",
            heading="The one hard decision: what splits",
            body=(
                "Split into ions only what is BOTH a strong electrolyte AND "
                "dissolved.\n\n"
                "- **Split:** soluble ionic compounds (aq); strong acids - "
                "$\\ce{HCl}$, $\\ce{HBr}$, $\\ce{HI}$, $\\ce{HNO3}$, "
                "$\\ce{H2SO4}$ (first proton), $\\ce{HClO4}$; strong bases "
                "- group 1 hydroxides and $\\ce{Ca(OH)2}$, "
                "$\\ce{Sr(OH)2}$, $\\ce{Ba(OH)2}$.\n"
                "- **Do not split:** solids (s), liquids (l), gases (g); "
                "water itself; weak acids ($\\ce{CH3COOH}$, $\\ce{HF}$, "
                "$\\ce{H2CO3}$...) and weak bases ($\\ce{NH3}$), which "
                "remain mostly molecular in solution.\n\n"
                "The list of six strong acids is short on purpose: memorise "
                "it, and everything not on it is weak by default.\n\n"
                "### Charge balances too\n\n"
                "A net ionic equation must balance atoms AND charge. In "
                "$\\ce{Ba^2+ + SO4^2- -> BaSO4}$ the left side sums to "
                "$(+2) + (-2) = 0$ and the right is neutral. A net "
                "equation whose charges do not sum equal on both sides is "
                "wrong even if every atom counts - and charge is the check "
                "that catches most student errors, because atom balance "
                "usually survives the mistake."
            ),
            table=Table(
                caption="Split or keep whole",
                columns=("Species in solution", "Written as", "Why"),
                rows=(
                    ("NaCl(aq)", "Na+ + Cl-", "soluble ionic: strong electrolyte"),
                    ("HCl(aq)", "H+ + Cl-", "one of the six strong acids"),
                    ("CH3COOH(aq)", "CH3COOH", "weak acid: mostly molecular"),
                    ("NH3(aq)", "NH3", "weak base"),
                    ("BaSO4(s)", "BaSO4(s)", "solid: not in solution"),
                    ("H2O(l)", "H2O(l)", "molecular liquid"),
                ),
                source=(
                    "Strong/weak classification per the standard list of "
                    "six strong acids and the group 1 / heavy group 2 "
                    "strong bases."
                ),
                note=(
                    "Everything not on the strong list is weak by default. "
                    "The exam assumes the list, not a judgment call."
                ),
            ),
            important=(
                "Check charge, not just atoms. A net ionic equation that "
                "balances atoms but not charge is wrong, and charge is "
                "where errors hide."
            ),
        ),
        ReadingSection(
            id="procedure",
            heading="The rewrite as a procedure",
            body=(
                "The three notations line up into a four-step rewrite "
                "that works on any reaction in solution, and running "
                "it mechanically is faster and safer than improvising "
                "each time.\n\n"
                "- **1.** Write the balanced molecular equation with "
                "state labels. The labels are load-bearing: step 2 "
                "reads them and nothing else.\n"
                "- **2.** Split every species marked (aq) that is a "
                "strong electrolyte into its ions, multiplying the "
                "ion counts by the equation's coefficients. "
                "Everything else copies across unchanged.\n"
                "- **3.** Cancel spectators: species that appear on "
                "both sides with the same formula, the same charge "
                "and the same state, cancelled in equal numbers "
                "only.\n"
                "- **4.** Check what survives - atoms balance, "
                "charge balances, coefficients reduced to smallest "
                "whole numbers.\n\n"
                "Run it on the other precipitation this unit keeps "
                "returning to.\n\n"
                "Step 1, molecular: "
                "$\\ce{AgNO3(aq) + NaCl(aq) -> AgCl(s) + "
                "NaNO3(aq)}$.\n\n"
                "Step 2 - three of the four species carry (aq) and "
                "all three are soluble ionic compounds, so they "
                "split; the solid does not:\n\n"
                "$$\\ce{Ag+ + NO3- + Na+ + Cl- -> AgCl(s) + Na+ + "
                "NO3-}$$\n\n"
                "Step 3 - $\\ce{Na+}$ and $\\ce{NO3-}$ stand "
                "unchanged on both sides: spectators, out.\n\n"
                "$$\\ce{Ag+(aq) + Cl-(aq) -> AgCl(s)}$$\n\n"
                "Step 4 - one silver and one chlorine each side; "
                "charge $(+1) + (-1) = 0$ on the left, 0 on the "
                "right. Done, and the generalising payoff repeats: "
                "silver nitrate with sodium chloride, silver "
                "acetate with potassium chloride, any soluble "
                "silver salt with any soluble chloride - one net "
                "equation for all of them. A dozen molecular "
                "equations collapse into one line of chemistry, "
                "which is why analytical work is thought out in net "
                "ionic form and why the rewrite earns its keep."
            ),
        ),
        ReadingSection(
            id="weak-electrolytes",
            heading="Weak electrolytes stay together",
            body=(
                "The split list is really a statement about what the "
                "solution actually contains, and weak electrolytes "
                "are where that statement bites. A weak acid "
                "dissolved in water remains overwhelmingly intact "
                "molecules - only a small fraction ionises at any "
                "moment - so writing it as separated ions "
                "misdescribes the beaker. It stays together in the "
                "ionic equations and participates as a whole "
                "formula.\n\n"
                "Acetic acid neutralised by sodium hydroxide:\n\n"
                "$$\\ce{CH3COOH(aq) + OH-(aq) -> CH3COO-(aq) + "
                "H2O(l)}$$\n\n"
                "The acid enters whole and its conjugate base leaves "
                "as a product ion; sodium is the only spectator. "
                "There is no free $\\ce{H+}$ anywhere in the "
                "equation, because the solution never held a stock "
                "of free protons - hydroxide pulls each proton off "
                "an intact molecule directly. Charge check: "
                "$0 + (-1) = -1$ on the left, $(-1) + 0 = -1$ on "
                "the right.\n\n"
                "Ammonia, the standard weak base, mirrors the case "
                "with a strong acid:\n\n"
                "$$\\ce{NH3(aq) + H+(aq) -> NH4+(aq)}$$\n\n"
                "Charge check: $0 + (+1) = +1$ left, $+1$ right.\n\n"
                "A gas-forming case ties the chapters together. "
                "Sodium carbonate plus hydrochloric acid runs, in "
                "molecular form, as $\\ce{Na2CO3(aq) + 2HCl(aq) -> "
                "2NaCl(aq) + H2O(l) + CO2(g)}$. Both reactants "
                "split - a soluble ionic compound and a strong acid "
                "- and sodium and chloride turn out to be the "
                "spectators. The net:\n\n"
                "$$\\ce{CO3^2-(aq) + 2H+(aq) -> H2O(l) + CO2(g)}$$\n\n"
                "Atoms: 1 C, 3 O, 2 H on each side. Charge: "
                "$(-2) + 2 \\times (+1) = 0$ on the left, 0 on the "
                "right. The water and the carbon dioxide - a "
                "molecular liquid and a gas - stay whole on the "
                "product side, exactly as the split rules order."
            ),
        ),
        ReadingSection(
            id="checks-and-errors",
            heading="The checks, and the errors they catch",
            body=(
                "A finished net ionic equation passes three checks, "
                "and each check is aimed at a specific class of "
                "error.\n\n"
                "- **Atom balance** catches dropped coefficients, "
                "usually from cancelling unequal numbers of a "
                "spectator - two sodiums on the left against one "
                "accidentally written on the right leaves a phantom "
                "ion stranded in the net.\n"
                "- **Charge balance** catches wrong ion charges and "
                "illegal cancellations. It is the high-yield check "
                "because atom balance usually survives a charge "
                "mistake: write the chloride in "
                "$\\ce{Ag+ + Cl- -> AgCl}$ with a $2-$ charge by "
                "accident and the chlorine count still says $1 = "
                "1$; only the charge sum, $-1$ against $0$, "
                "objects.\n"
                "- **The split-list audit** catches the two classic "
                "misdescriptions: a solid or a weak electrolyte "
                "broken into ions it does not release, and a strong "
                "electrolyte left molecular so that real spectators "
                "fail to cancel and clutter the net.\n\n"
                "The cancellation rule deserves its fine print, "
                "because it is where partial understanding shows. A "
                "species cancels only against itself - same "
                "formula, same state, same charge - and only in "
                "matched numbers. An $\\ce{H+}$ on the left does "
                "not cancel against the hydrogen inside product "
                "water; a $\\ce{Cl-}$ in solution does not cancel "
                "against the chlorine bound in solid $\\ce{AgCl}$. "
                "Bound atoms are not ions, and the entire content "
                "of the notation lives in that distinction.\n\n"
                "When every check passes, read the result once more "
                "for sense. A net ionic equation with nothing left "
                "in it - everything cancelled - is the notation's "
                "way of saying 'no reaction', and it is the correct "
                "final answer for mixtures whose new pairings are "
                "all soluble strong electrolytes. The previous "
                "chapter said so from the solubility rules; this "
                "notation says the same thing by cancelling itself "
                "to blankness, which is reassuring rather than "
                "troubling: two independent routes, one answer."
            ),
        ),
    ),
    key_takeaways=(
        "Molecular, complete ionic, net ionic: three notations for one "
        "event, in increasing order of honesty about the beaker.",
        "Split only strong electrolytes that are dissolved: soluble ionic "
        "compounds, the six strong acids, the group 1 and heavy group 2 "
        "hydroxides.",
        "Solids, liquids, gases, water, and weak acids and bases stay "
        "whole.",
        "Spectators cancel; what survives is the chemistry, and it "
        "generalises across every salt pair delivering the same ions.",
        "Net ionic equations must balance charge as well as atoms.",
    ),
    exam_tips=(
        "The near-universal wrong answer splits a weak acid into ions. "
        "Acetic acid stays written whole; the six strong acids are the "
        "complete split list.",
        "When asked for the net ionic equation of a neutralisation of a "
        "STRONG acid by a STRONG base, the answer is H+ + OH- -> H2O "
        "regardless of which acid and base - that is the point of the "
        "notation.",
    ),
))


# --------------------------------------------------------------------------
# 4.6 Acid base neutralization reactions
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="GEN1.NEUTRALIZATION",
    lead=(
        "Mix an acid with a base and the defining properties of both "
        "disappear: that is neutralisation, and for strong acid against "
        "strong base it is one reaction wearing many costumes - "
        "$\\ce{H+ + OH- -> H2O}$. This chapter covers the molecular "
        "pattern acid + base gives salt + water, what changes when one "
        "partner is weak, and the gas-forming variants that look like "
        "exceptions and are not."
    ),
    sections=(
        ReadingSection(
            id="pattern",
            heading="The pattern, and the one net equation underneath",
            body=(
                "The molecular pattern is\n\n"
                "$$\\text{acid} + \\text{base} \\rightarrow \\text{salt} + "
                "\\text{water}$$\n\n"
                "$$\\ce{HCl(aq) + NaOH(aq) -> NaCl(aq) + H2O(l)}$$\n\n"
                "The salt is whatever the spectator ions add up to: the "
                "base's cation with the acid's anion. Run the ionic "
                "rewrite from the last chapter - HCl splits, NaOH splits, "
                "NaCl splits, water does not - and the spectators "
                "$\\ce{Na+}$ and $\\ce{Cl-}$ cancel:\n\n"
                "$$\\ce{H+(aq) + OH-(aq) -> H2O(l)}$$\n\n"
                "Every strong acid neutralising every strong base gives "
                "this same net equation. Nitric acid with potassium "
                "hydroxide, perchloric acid with barium hydroxide: "
                "different salts, identical chemistry. The measured heat "
                "agrees - about $-57$ kJ per mole of water formed, "
                "whichever strong pair you pick - which is the "
                "thermochemical fingerprint of its being one reaction.\n\n"
                "### Stoichiometry of the proton count\n\n"
                "Diprotic and triprotic acids deliver more than one "
                "proton, and the coefficients follow:\n\n"
                "$$\\ce{H2SO4 + 2NaOH -> Na2SO4 + 2H2O}$$\n\n"
                "One mole of sulfuric acid consumes two of hydroxide. "
                "Titration arithmetic in the last chapter of this unit "
                "lives or dies on this count. Barium hydroxide runs "
                "the mirror image, delivering two hydroxides per "
                "formula unit - $\\ce{2HCl + Ba(OH)2 -> BaCl2 + "
                "2H2O}$, two acids per base. The count that matters "
                "is protons against hydroxides, and reading it "
                "straight off the formulas, before any arithmetic "
                "starts, is the habit that makes the titration "
                "section of this chapter routine."
            ),
        ),
        ReadingSection(
            id="weak-partners",
            heading="When one partner is weak",
            body=(
                "A weak acid stays molecular in the net equation, so "
                "neutralising acetic acid with sodium hydroxide reads\n\n"
                "$$\\ce{CH3COOH(aq) + OH-(aq) -> CH3COO-(aq) + H2O(l)}$$\n\n"
                "- the acid appears whole, its conjugate base appears as a "
                "product, and the equation is no longer the universal "
                "$\\ce{H+ + OH-}$. The reaction still runs essentially to "
                "completion - hydroxide is a strong enough base to strip "
                "the proton - but the notation records that the acid was "
                "not dissociated to start with.\n\n"
                "### Gas-forming neutralisations\n\n"
                "Two families LOOK like exceptions to salt-plus-water and "
                "are neutralisations with an unstable product:\n\n"
                "- **Carbonates:** "
                "$\\ce{CaCO3 + 2HCl -> CaCl2 + H2O + CO2(g)}$. The "
                "carbonic acid first formed decomposes on the spot to "
                "water and carbon dioxide - the fizz of a carbonate "
                "meeting acid.\n"
                "- **Sulfites** behave identically, releasing "
                "$\\ce{SO2(g)}$; **ammonium salts with strong base** run "
                "the other direction, releasing $\\ce{NH3(g)}$ on "
                "warming.\n\n"
                "The gas leaving the open system drives these to "
                "completion, which ties back to the conservation chapter: "
                "the mass loss you would measure is the gas that crossed "
                "the boundary.\n\n"
                "### An insoluble base: the antacid case\n\n"
                "Magnesium hydroxide, the active agent of milk of "
                "magnesia, is insoluble - rule 5 of the solubility "
                "chapter - so it enters the net ionic equation whole, "
                "as a solid:\n\n"
                "$$\\ce{Mg(OH)2(s) + 2H+(aq) -> Mg^2+(aq) + 2H2O(l)}$$\n\n"
                "Atoms: 1 Mg, 2 O, 4 H on each side. Charge: "
                "$2 \\times (+1) = +2$ on the left, $+2$ on the "
                "right. The stoichiometry is what makes it a base you "
                "can dose: at $24.31 + 2 \\times (16.00 + 1.008) = "
                "58.33$ g/mol (rounded from 58.326), a 0.5833 g dose "
                "is $0.5833 / 58.33 = 0.01000$ mol of base, and the "
                "2 : 1 proton ratio means it neutralises $0.02000$ "
                "mol of stomach acid. The solid dissolves only as "
                "fast as acid consumes it, which is why an insoluble "
                "base makes a gentler antacid than a soluble one: "
                "there is no reservoir of free hydroxide standing by "
                "to overshoot with."
            ),
            table=Table(
                caption="Neutralisation net equations by partner strength",
                columns=("Acid", "Base", "Net ionic equation"),
                rows=(
                    ("strong (HCl)", "strong (NaOH)", "H+ + OH- -> H2O"),
                    ("weak (CH3COOH)", "strong (NaOH)",
                     "CH3COOH + OH- -> CH3COO- + H2O"),
                    ("strong (HCl)", "weak (NH3)",
                     "NH3 + H+ -> NH4+"),
                    ("carbonate + strong acid", "-",
                     "CO3^2- + 2H+ -> H2O + CO2(g)"),
                ),
                source=(
                    "Follows from the split/keep rules of the net ionic "
                    "chapter applied to each pairing."
                ),
                note=(
                    "Only the strong-strong pair reduces to the universal "
                    "equation; each weak partner leaves its molecular "
                    "signature in the net."
                ),
            ),
            important=(
                "The fizz test is a neutralisation: carbonate plus acid "
                "gives CO2 because carbonic acid decomposes as fast as it "
                "forms. It is not an exception to salt-plus-water; the "
                "water is there and the CO2 is the decomposed remainder."
            ),
        ),
        ReadingSection(
            id="titration",
            heading="Titration: the stoichiometry, worked fully",
            body=(
                "A titration measures an unknown concentration by "
                "running a neutralisation to its exact completion. "
                "Acid of unknown concentration sits in the flask; "
                "base of precisely known concentration sits in the "
                "burette above it; base is added until the moles "
                "delivered exactly consume the protons available. "
                "From the burette volume and the known "
                "concentration, moles of base; from the balanced "
                "equation, moles of acid; from the flask volume, "
                "the unknown concentration. Three conversions, no "
                "new ideas - the entire technique is this unit's "
                "stoichiometry pointed at a beaker.\n\n"
                "Two terms that are not synonyms, first. The "
                "EQUIVALENCE point is the stoichiometric fact: "
                "moles of base delivered match the equation's "
                "ratio exactly. The ENDPOINT is the observable "
                "stand-in: the drop at which an indicator - a dye "
                "chosen to change colour near the equivalence "
                "point - actually changes. A well-chosen indicator "
                "puts the two within a drop of each other; the "
                "arithmetic below always computes the equivalence "
                "point and trusts the chemist to have chosen "
                "well.\n\n"
                "### Worked: a monoprotic titration\n\n"
                "A 25.00 mL sample of hydrochloric acid requires "
                "32.40 mL of 0.1250 M sodium hydroxide to reach "
                "the endpoint.\n\n"
                "- Moles of base: $0.03240 \\times 0.1250 = "
                "0.004050$ mol $\\ce{NaOH}$.\n"
                "- $\\ce{HCl + NaOH -> NaCl + H2O}$ is one to one, "
                "so the flask held 0.004050 mol $\\ce{HCl}$.\n"
                "- Concentration: $0.004050 / 0.02500 = 0.1620$ "
                "M.\n\n"
                "### Worked: the diprotic trap\n\n"
                "A 20.00 mL sample of sulfuric acid requires 36.00 "
                "mL of 0.1000 M sodium hydroxide.\n\n"
                "- Moles of base: $0.03600 \\times 0.1000 = "
                "0.003600$ mol.\n"
                "- $\\ce{H2SO4 + 2NaOH -> Na2SO4 + 2H2O}$ demands "
                "TWO hydroxides per acid, so moles of acid $= "
                "0.003600 / 2 = 0.001800$ mol.\n"
                "- Concentration: $0.001800 / 0.02000 = 0.09000$ "
                "M.\n\n"
                "Skipping the division by 2 gives 0.1800 M - "
                "exactly double, and reliably among the wrong "
                "choices. The safe habit is to route every "
                "titration through moles and the balanced "
                "equation, not through a memorised "
                "$M_1V_1 = M_2V_2$: that is a dilution formula, "
                "and it goes silently wrong the moment the mole "
                "ratio is not one to one.\n\n"
                "### Mass in the flask instead of concentration\n\n"
                "The same accounting runs when the unknown is a "
                "mass. Dissolve 0.5000 g of sodium hydroxide - "
                "$0.5000 / 40.00 = 0.01250$ mol, at $22.99 + "
                "16.00 + 1.008 = 40.00$ g/mol (rounded from "
                "39.998) - and ask what volume of 0.2500 M "
                "hydrochloric acid neutralises it: "
                "$0.01250 / 0.2500 = 0.05000$ L, which is 50.00 "
                "mL. Volume to moles, ratio, moles to whatever the "
                "question asks: the frame never changes, only the "
                "quantity left blank."
            ),
        ),
        ReadingSection(
            id="the-salt-and-after",
            heading="The salt, and what the solution is afterwards",
            body=(
                "The salt in 'acid plus base gives salt plus water' "
                "is not an afterthought; it is the spectators "
                "reassembled, and naming it is a two-step read: the "
                "base's cation first, the acid's anion second. "
                "Hydrochloric acid and potassium hydroxide leave "
                "potassium chloride; nitric acid and barium "
                "hydroxide leave barium nitrate; sulfuric acid and "
                "sodium hydroxide leave sodium sulfate. Evaporate "
                "the water and the salt is what remains on the "
                "dish - which is also a quick self-check on a "
                "molecular equation, since the salt's formula must "
                "be electrically neutral and built from the ions "
                "actually present.\n\n"
                "'Neutralisation' does, however, promise slightly "
                "less than its name suggests. At the equivalence "
                "point of a strong acid against a strong base, the "
                "solution really is neutral: the salt's ions are "
                "spectators to water chemistry too. But when one "
                "partner is weak, the leftover conjugate is not a "
                "bystander - the acetate left by acetic acid is "
                "itself a weak base, the ammonium left by ammonia "
                "a weak acid - and the solution at equivalence "
                "sits slightly basic or slightly acidic "
                "accordingly. The acid-base unit makes that "
                "quantitative. What matters here is the caution: "
                "neutralisation means the acid and base have "
                "consumed each other in the stoichiometric ratio "
                "of the balanced equation, not that the result "
                "reads exactly 7 on a pH meter. None of this "
                "changes the arithmetic of the titration section - "
                "moles are moles whatever the pH does afterwards - "
                "but it decides which indicator a careful titration "
                "chooses, and that is where the acid-base unit "
                "picks the story up."
            ),
        ),
    ),
    key_takeaways=(
        "Molecular pattern: acid + base -> salt + water; the salt is the "
        "spectators reassembled.",
        "Strong-strong neutralisation has one net equation, H+ + OH- -> "
        "H2O, and one heat, ~-57 kJ/mol of water.",
        "Weak partners stay molecular in the net equation and leave their "
        "conjugates as products.",
        "Polyprotic acids scale the base requirement by their proton "
        "count - the fact titration arithmetic depends on.",
        "Carbonate + acid fizzing is neutralisation with an unstable "
        "product, not an exception.",
    ),
    exam_tips=(
        "Given any strong acid and strong base and asked for the net ionic "
        "equation, answer H+ + OH- -> H2O without working the specific "
        "pair - and be suspicious of choices dressing the spectators back "
        "in.",
        "Watch the proton count: H2SO4 neutralisation items are usually "
        "testing the 2:1 mole ratio, not the concept.",
    ),
))
