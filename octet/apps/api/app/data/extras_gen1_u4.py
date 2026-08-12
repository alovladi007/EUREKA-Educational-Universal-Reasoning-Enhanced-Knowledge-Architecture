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
        "flat list."
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
                "provide."
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
                "lives or dies on this count."
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
                "the boundary."
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
