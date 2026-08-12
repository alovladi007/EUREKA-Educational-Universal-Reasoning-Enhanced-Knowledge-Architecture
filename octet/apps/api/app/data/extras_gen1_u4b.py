"""Chapters for GEN1 unit 4, Stoichiometry of Chemical Reactions - second half.

Nodes: OXNUMBERS, STOICH, LIMITING, YIELD, TITRATIONBASIC. First half in
extras_gen1_u4.py; same sourcing rules. All worked arithmetic uses molar
masses computed from IUPAC standard atomic weights rounded to four
significant figures, and every calculation shown has been checked by hand.
"""

from __future__ import annotations

from app.data.lesson_extras import (
    LessonExtras,
    ReadingSection,
    Table,
)

EXTRAS_GEN1_U4B: dict[str, LessonExtras] = {}


def _add(extras: LessonExtras) -> None:
    EXTRAS_GEN1_U4B[extras.node] = extras


# --------------------------------------------------------------------------
# 4.7 Oxidation numbers and redox identification
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="GEN1.OXNUMBERS",
    lead=(
        "An oxidation number is a bookkeeping charge: the charge an atom "
        "would carry if every bond's electrons were handed entirely to the "
        "more electronegative partner. It is not a real charge - it is a "
        "counting device, and its one job is to detect electron transfer. "
        "If any atom's oxidation number changes across a reaction, the "
        "reaction is redox; if none does, it is not. That test never "
        "fails."
    ),
    sections=(
        ReadingSection(
            id="assigning",
            heading="The assignment rules, in order of precedence",
            body=(
                "Apply from the top; when rules collide, the earlier one "
                "wins.\n\n"
                "- **1.** A free element is 0. ($\\ce{O2}$, $\\ce{Fe}$, "
                "$\\ce{S8}$ - all zero.)\n"
                "- **2.** A monatomic ion equals its charge. "
                "($\\ce{Na+}$ is $+1$, $\\ce{S^2-}$ is $-2$.)\n"
                "- **3.** Fluorine in a compound is $-1$, always.\n"
                "- **4.** Group 1 metals are $+1$; group 2 metals are "
                "$+2$.\n"
                "- **5.** Hydrogen is $+1$ with nonmetals, $-1$ in metal "
                "hydrides ($\\ce{NaH}$).\n"
                "- **6.** Oxygen is $-2$ - EXCEPT in peroxides "
                "($\\ce{H2O2}$: $-1$) and when bonded to fluorine "
                "($\\ce{OF2}$: $+2$).\n"
                "- **7.** The numbers sum to the species' total charge: "
                "zero for a neutral compound, the ion's charge for an "
                "ion.\n\n"
                "Rule 7 is the workhorse: it solves for the one atom the "
                "other rules did not fix.\n\n"
                "### Worked assignments\n\n"
                "- $\\ce{MnO4-}$: four O at $-2$ give $-8$; the sum must "
                "be $-1$, so Mn is $+7$.\n"
                "- $\\ce{Cr2O7^2-}$: seven O give $-14$; sum $-2$, so two "
                "Cr share $+12$, i.e. $+6$ each.\n"
                "- $\\ce{NH4+}$: H is $+1$ (rule 5), four of them give "
                "$+4$; sum $+1$, so N is $-3$.\n"
                "- $\\ce{Fe3O4}$: four O give $-8$, three Fe share $+8$ - "
                "an average of $+\\tfrac{8}{3}$. Fractions are legal and "
                "mean the crystal genuinely mixes $+2$ and $+3$ iron."
            ),
            important=(
                "Oxidation numbers are bookkeeping, not measured charges. "
                "Mn in permanganate does not carry seven positive charges; "
                "the +7 is what the electron-assignment convention "
                "computes, and its value is that changes in it track real "
                "electron transfer exactly."
            ),
        ),
        ReadingSection(
            id="using",
            heading="Using them: the redox test and the vocabulary",
            body=(
                "### The test\n\n"
                "Assign numbers to every atom on both sides. Any change "
                "means redox. Take zinc in copper sulfate:\n\n"
                "$$\\ce{Zn(s) + CuSO4(aq) -> ZnSO4(aq) + Cu(s)}$$\n\n"
                "Zn goes $0 \\rightarrow +2$ (oxidised - it lost "
                "electrons). Cu goes $+2 \\rightarrow 0$ (reduced - it "
                "gained them). S stays $+6$ and O stays $-2$: sulfate is "
                "a spectator to the electron transfer.\n\n"
                "Contrast the precipitation "
                "$\\ce{Ba^2+ + SO4^2- -> BaSO4}$: every atom keeps its "
                "number, so no redox - partner swapping only, exactly as "
                "the classification chapter said.\n\n"
                "### The vocabulary, pinned down\n\n"
                "- **Oxidation** - loss of electrons - oxidation number "
                "goes UP.\n"
                "- **Reduction** - gain of electrons - oxidation number "
                "goes DOWN.\n"
                "- **Oxidising agent** - the species that TAKES electrons, "
                "and is itself reduced.\n"
                "- **Reducing agent** - the species that GIVES electrons, "
                "and is itself oxidised.\n\n"
                "The agent naming trips everyone once: the oxidising agent "
                "is the one that gets reduced. Read 'agent' as 'does it to "
                "the other one' and the names resolve.\n\n"
                "Electrons lost must equal electrons gained - conservation "
                "again, this time of charge. In the zinc reaction, two "
                "electrons leave zinc and two arrive at copper. That "
                "equality is what the half-reaction balancing method of "
                "the electrochemistry unit is built on."
            ),
            table=Table(
                caption="The redox test applied across this unit's reactions",
                columns=("Reaction", "Numbers that change", "Redox?"),
                rows=(
                    ("2Mg + O2 -> 2MgO", "Mg 0->+2, O 0->-2", "yes"),
                    ("Zn + CuSO4 -> ZnSO4 + Cu", "Zn 0->+2, Cu +2->0", "yes"),
                    ("CaCO3 -> CaO + CO2", "none", "no"),
                    ("HCl + NaOH -> NaCl + H2O", "none", "no"),
                    ("BaCl2 + Na2SO4 -> BaSO4 + 2NaCl", "none", "no"),
                ),
                source="Assigned by the precedence rules of this chapter.",
                note=(
                    "Free elements on the reactant side make the first two "
                    "redox before any arithmetic: an element entering a "
                    "compound must leave zero."
                ),
            ),
        ),
    ),
    key_takeaways=(
        "Oxidation numbers are assigned by precedence rules; rule 7 (sum "
        "equals total charge) solves for the atom the others leave open.",
        "Oxygen is -2 except peroxides (-1) and OF2 (+2); hydrogen is +1 "
        "except metal hydrides (-1).",
        "Redox test: any atom's number changes. No change anywhere, no "
        "redox - precipitation and neutralisation both pass unchanged.",
        "OIL RIG with direction: oxidation is loss (number up), reduction "
        "is gain (number down).",
        "The oxidising agent is reduced; the reducing agent is oxidised.",
        "Electrons lost equal electrons gained, always.",
    ),
    exam_tips=(
        "Assigning the oxidation number of the central atom in an oxyanion "
        "(MnO4-, Cr2O7^2-, ClO3-...) is the single most drilled variant: "
        "oxygens at -2, solve the sum.",
        "'Which species is the oxidising agent' items reward reading the "
        "word agent correctly: find what was reduced.",
    ),
))


# --------------------------------------------------------------------------
# 4.8 Reaction stoichiometry
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="GEN1.STOICH",
    lead=(
        "Stoichiometry is the arithmetic of balanced equations: given an "
        "amount of one substance, compute the amount of any other in the "
        "same reaction. Every problem, however dressed, is the same "
        "three-step walk - convert to moles, cross the mole bridge, "
        "convert back - and the coefficients of the balanced equation are "
        "the bridge."
    ),
    sections=(
        ReadingSection(
            id="mole-bridge",
            heading="The mole bridge",
            body=(
                "Coefficients relate MOLES, not grams. There is no "
                "gram-to-gram shortcut, because a mole of one substance "
                "does not weigh what a mole of another does. Every mass "
                "problem therefore routes through moles:\n\n"
                "$$\\text{grams A} \\;\\xrightarrow{\\div M_A}\\; "
                "\\text{mol A} \\;\\xrightarrow{\\text{coefficients}}\\; "
                "\\text{mol B} \\;\\xrightarrow{\\times M_B}\\; "
                "\\text{grams B}$$\n\n"
                "The middle step is the only chemistry; the outer two are "
                "unit conversion. The mole ratio comes straight off the "
                "balanced equation: in "
                "$\\ce{N2 + 3H2 -> 2NH3}$, the ratios available are "
                "$\\tfrac{3\\,\\text{mol H2}}{1\\,\\text{mol N2}}$, "
                "$\\tfrac{2\\,\\text{mol NH3}}{3\\,\\text{mol H2}}$, and "
                "every other pairing, used in whichever orientation "
                "cancels the unit you are leaving."
            ),
        ),
        ReadingSection(
            id="worked",
            heading="Worked: mass to mass, in full",
            body=(
                "**How many grams of ammonia can 10.0 g of hydrogen "
                "produce, given excess nitrogen?**\n\n"
                "$$\\ce{N2(g) + 3H2(g) -> 2NH3(g)}$$\n\n"
                "- **1. To moles.** $M(\\ce{H2}) = 2.016$ g/mol, so "
                "$10.0 \\div 2.016 = 4.96$ mol $\\ce{H2}$.\n"
                "- **2. Mole bridge.** "
                "$4.96 \\times \\tfrac{2\\,\\ce{NH3}}{3\\,\\ce{H2}} = "
                "3.31$ mol $\\ce{NH3}$.\n"
                "- **3. To grams.** $M(\\ce{NH3}) = 14.01 + 3(1.008) = "
                "17.03$ g/mol, so $3.31 \\times 17.03 = 56.3$ g.\n\n"
                "Sanity checks worth the ten seconds: the answer carries "
                "three significant figures because the given mass did; "
                "and mass conservation brackets it - 10.0 g of hydrogen "
                "plus the nitrogen it consumes "
                "($4.96 \\times \\tfrac{1}{3} = 1.65$ mol, i.e. 46.3 g) "
                "totals 56.3 g, exactly the ammonia produced.\n\n"
                "### Other units, same bridge\n\n"
                "Nothing changes when the ends of the walk are not "
                "grams:\n\n"
                "- **Solutions:** moles $= M \\times V$. Litres of a "
                "solution of known molarity convert to moles in one "
                "multiplication.\n"
                "- **Gases:** at STP one mole occupies 22.4 L; more "
                "generally $n = PV/RT$ from the gas unit.\n"
                "- **Particles:** multiply or divide by Avogadro's "
                "number, $6.022 \\times 10^{23}$.\n\n"
                "The exam dresses the same walk in each of these outfits. "
                "Identify which conversion each end of the problem needs, "
                "and the middle is always the coefficient ratio."
            ),
            table=Table(
                caption="The three-step walk in each unit system",
                columns=("Given", "To moles by", "Back out by"),
                rows=(
                    ("mass (g)", "divide by molar mass", "multiply by molar mass"),
                    ("solution (L, M)", "n = M x V", "V = n / M"),
                    ("gas at STP (L)", "divide by 22.4 L/mol", "multiply by 22.4 L/mol"),
                    ("particles", "divide by 6.022e23", "multiply by 6.022e23"),
                ),
                source=(
                    "Molar volume at STP and Avogadro's number as defined "
                    "values; molar masses from IUPAC standard atomic "
                    "weights."
                ),
                note=(
                    "The mole bridge in the middle never changes. Only the "
                    "on-ramp and off-ramp do."
                ),
            ),
            important=(
                "There is no gram-to-gram ratio. The coefficients count "
                "particles, so all mass arithmetic must route through "
                "moles - skipping the conversion is the unit's most common "
                "quantitative error."
            ),
        ),
    ),
    key_takeaways=(
        "Coefficients relate moles, never grams.",
        "Every problem is grams-to-moles, mole bridge, moles-to-grams - "
        "with molarity, gas volume or particle count swapped onto either "
        "end.",
        "Write the mole ratio as a fraction oriented to cancel the unit "
        "you are leaving.",
        "Mass conservation brackets every answer: reactants consumed must "
        "sum to products formed.",
        "Track significant figures from the data, not the constants.",
    ),
    exam_tips=(
        "Set every calculation up as one chain of factors and cancel units "
        "before touching numbers - unit cancellation catches inverted "
        "ratios instantly.",
        "When an answer choice differs from another by a factor equal to a "
        "coefficient ratio (2/3, 3/2...), the writer anticipated an "
        "inverted mole bridge. Check orientation.",
    ),
))


# --------------------------------------------------------------------------
# 4.9 Limiting reactant
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="GEN1.LIMITING",
    lead=(
        "Real mixtures are not delivered in perfect stoichiometric "
        "proportion. One reactant runs out first and stops the reaction; "
        "that one - the limiting reactant - determines everything about "
        "the yield, and the excess partner simply remains. Finding the "
        "limiter is a comparison of moles against the coefficient ratio, "
        "and the fastest reliable method is to compute what each reactant "
        "alone could produce."
    ),
    sections=(
        ReadingSection(
            id="finding",
            heading="Finding the limiter",
            body=(
                "The sandwich picture is exact: with 10 slices of bread "
                "and 3 patties, you make 3 sandwiches and bread is left "
                "over, however much more bread you buy. Patties limit.\n\n"
                "### The method that never misleads\n\n"
                "Convert every reactant to moles, then compute the amount "
                "of ONE chosen product each reactant could make alone. "
                "The reactant producing the SMALLEST amount is the "
                "limiter, and that smallest amount is the theoretical "
                "yield.\n\n"
                "Comparing raw mole amounts fails when coefficients "
                "differ - 5 mol of $\\ce{H2}$ against 4 mol of $\\ce{O2}$ "
                "looks like hydrogen is scarcer, but hydrogen is consumed "
                "two-to-one, so it runs out at 2.5 mol of use-pairs while "
                "oxygen would last 4. Divide-by-coefficient repairs the "
                "comparison, but computing product per reactant does the "
                "same work and hands you the yield in the same motion.\n\n"
                "### Worked\n\n"
                "**4.00 g of hydrogen burns in 16.0 g of oxygen. How much "
                "water forms, and what remains?**\n\n"
                "$$\\ce{2H2 + O2 -> 2H2O}$$\n\n"
                "- Moles in: $4.00 / 2.016 = 1.98$ mol $\\ce{H2}$; "
                "$16.0 / 32.00 = 0.500$ mol $\\ce{O2}$.\n"
                "- Water each could make alone: hydrogen "
                "$1.98 \\times \\tfrac{2}{2} = 1.98$ mol; oxygen "
                "$0.500 \\times \\tfrac{2}{1} = 1.00$ mol.\n"
                "- Oxygen's number is smaller: **oxygen limits**, despite "
                "outweighing the hydrogen four to one on the balance.\n"
                "- Yield: $1.00$ mol of water $= 18.0$ g.\n"
                "- Excess: the reaction consumed "
                "$0.500 \\times 2 = 1.00$ mol of $\\ce{H2}$, leaving "
                "$1.98 - 1.00 = 0.98$ mol $= 1.98$ g of hydrogen "
                "unreacted.\n\n"
                "Mass check: $18.0 + 1.98 = 20.0$ g out, $4.00 + 16.0 = "
                "20.0$ g in. Conservation holds, as it must."
            ),
            table=Table(
                caption="The worked example's full ledger",
                columns=("Species", "In (mol)", "Consumed (mol)", "Out (mol)", "Out (g)"),
                rows=(
                    ("H2", "1.98", "1.00", "0.98", "1.98"),
                    ("O2", "0.500", "0.500", "0", "0"),
                    ("H2O", "0", "-", "1.00", "18.0"),
                    ("total mass", "-", "-", "-", "20.0 in, 20.0 out"),
                ),
                source=(
                    "Computed from molar masses H2 2.016, O2 32.00, H2O "
                    "18.02 g/mol (IUPAC standard atomic weights)."
                ),
                note=(
                    "The limiter exits at zero; everything else is "
                    "determined by it."
                ),
            ),
            important=(
                "The heavier or larger-looking reactant is NOT thereby in "
                "excess. Sixteen grams of oxygen limits against four grams "
                "of hydrogen. Only the mole comparison against "
                "coefficients decides."
            ),
        ),
        ReadingSection(
            id="consequences",
            heading="What the limiter controls",
            body=(
                "Once identified, the limiting reactant governs every "
                "downstream number:\n\n"
                "- **Theoretical yield** - computed from the limiter "
                "alone, by ordinary stoichiometry.\n"
                "- **Consumption of the excess reactant** - also set by "
                "the limiter, through the coefficient ratio; the excess "
                "amount remaining is initial minus consumed.\n"
                "- **Everything in the yield chapter next** - percent "
                "yield compares an actual harvest against the "
                "theoretical figure the limiter fixed.\n\n"
                "Industrial practice deliberately feeds the CHEAP "
                "reactant in excess to push the expensive one toward "
                "complete conversion - air is free, so combustion and "
                "oxidation processes run oxygen-rich. When a problem says "
                "'excess' or 'sufficient' for one reactant, that is the "
                "author telling you not to test it: the other reactant "
                "limits by declaration."
            ),
        ),
    ),
    key_takeaways=(
        "The limiting reactant runs out first and fixes the yield; the "
        "excess reactant remains.",
        "Compare by product-each-could-make (or moles divided by "
        "coefficient) - never by raw mass or raw moles.",
        "The limiter also fixes how much of the excess partner is "
        "consumed; leftover = initial - consumed.",
        "A full ledger must conserve mass; totalling it is the free check "
        "on the whole calculation.",
        "'Excess' in a problem statement means the other reactant limits, "
        "by declaration.",
    ),
    exam_tips=(
        "Any problem giving amounts of TWO reactants is a limiting "
        "reactant problem, whatever it asks on the surface. One amount "
        "given plus 'excess' for the partner is ordinary stoichiometry.",
        "The favourite distractor is the yield computed from the excess "
        "reactant - it will be sitting among the choices. Compute from "
        "the limiter only.",
    ),
))


# --------------------------------------------------------------------------
# 4.10 Theoretical, actual and percent yield
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="GEN1.YIELD",
    lead=(
        "The equation promises a harvest; the bench delivers a smaller "
        "one. Theoretical yield is the promise, actual yield is the "
        "weighed reality, and percent yield is their honest ratio - the "
        "single number by which synthetic work is judged."
    ),
    sections=(
        ReadingSection(
            id="three-numbers",
            heading="Three numbers and one formula",
            body=(
                "- **Theoretical yield** - the maximum product the "
                "limiting reactant permits, computed by stoichiometry. A "
                "calculated number.\n"
                "- **Actual yield** - what you isolate, dry and weigh. A "
                "measured number; it cannot be calculated, only "
                "reported.\n"
                "- **Percent yield**:\n\n"
                "$$\\%\\,\\text{yield} = "
                "\\frac{\\text{actual}}{\\text{theoretical}} \\times "
                "100\\%$$\n\n"
                "### Worked\n\n"
                "**Decompose 10.00 g of calcium carbonate; 5.13 g of "
                "calcium oxide is recovered. Percent yield?**\n\n"
                "$$\\ce{CaCO3(s) -> CaO(s) + CO2(g)}$$\n\n"
                "- Moles in: $10.00 / 100.09 = 0.09991$ mol "
                "$\\ce{CaCO3}$.\n"
                "- Theoretical: 1:1 ratio, so $0.09991$ mol of "
                "$\\ce{CaO}$ at $56.08$ g/mol $= 5.603$ g.\n"
                "- Percent yield: $5.13 / 5.603 \\times 100 = 91.6\\%$.\n\n"
                "### Why the bench falls short\n\n"
                "- **Transfer and handling losses** - product left on "
                "filter paper and flask walls.\n"
                "- **Incomplete reaction** - equilibrium or slow kinetics "
                "stop short of completion.\n"
                "- **Side reactions** - reactants spent making something "
                "else.\n"
                "- **Purification cost** - every recrystallisation "
                "discards product with the impurities.\n\n"
                "A yield above 100% is not a triumph; it is a wet or "
                "impure sample, weighed too heavy. Report it as an error "
                "flag, not a result."
            ),
            important=(
                "Percent yield above 100% means the actual harvest was "
                "weighed with something extra in it - solvent or impurity "
                "- never that stoichiometry was beaten."
            ),
        ),
        ReadingSection(
            id="using-yield",
            heading="Using yield in reverse, and across steps",
            body=(
                "### Planning backwards\n\n"
                "Synthesis planning inverts the formula: to isolate 25.0 g "
                "of a product from a step known to run at 78%, you must "
                "aim the theoretical yield at $25.0 / 0.78 = 32.1$ g and "
                "scale the reactants to that.\n\n"
                "### Multi-step sequences multiply\n\n"
                "Yields compound. A three-step route at 80% per step "
                "delivers $0.80^3 = 51\\%$ overall; five steps at 80% "
                "deliver 33%. This single piece of arithmetic is why "
                "synthetic chemists prize short routes and why a 95% step "
                "is worth real money at industrial scale.\n\n"
                "It is also why reported yields are always PER STEP: an "
                "overall figure hides where the losses live, and fixing a "
                "route means finding the weak step."
            ),
            table=Table(
                caption="Overall yield versus route length at fixed per-step yield",
                columns=("Steps", "80% per step", "90% per step", "95% per step"),
                rows=(
                    ("1", "80%", "90%", "95%"),
                    ("3", "51%", "73%", "86%"),
                    ("5", "33%", "59%", "77%"),
                    ("10", "11%", "35%", "60%"),
                ),
                source="Computed as (per-step yield)^steps.",
                note=(
                    "Ten steps at a respectable 80% keep one product "
                    "molecule in nine. Route length is the quiet killer."
                ),
            ),
        ),
    ),
    key_takeaways=(
        "Theoretical yield is calculated from the limiting reactant; "
        "actual yield is weighed; percent yield is their ratio.",
        "Typical loss channels: transfer, incomplete reaction, side "
        "reactions, purification.",
        "Above 100% flags a wet or impure sample.",
        "Planning inverts the formula: required theoretical = target / "
        "expected fraction.",
        "Multi-step yields multiply, which is why short routes win.",
    ),
    exam_tips=(
        "Percent-yield items hide a limiting reactant step inside: "
        "compute the theoretical from the limiter, not from whichever "
        "reactant the question mentions last.",
        "Keep 'percent yield' and 'percent error' apart: yield compares "
        "to the stoichiometric maximum, error to an accepted value.",
    ),
))


# --------------------------------------------------------------------------
# 4.11 Titration and quantitative analysis
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="GEN1.TITRATIONBASIC",
    lead=(
        "A titration measures an unknown concentration by delivering a "
        "measured volume of a solution of known concentration until the "
        "reaction between them is exactly complete. It is stoichiometry "
        "run as an instrument: the burette reading, a molarity, and the "
        "balanced equation together fix the unknown to four significant "
        "figures on good glassware."
    ),
    sections=(
        ReadingSection(
            id="anatomy",
            heading="The anatomy of a titration",
            body=(
                "- **Titrant** - the solution of accurately known "
                "concentration, delivered from the burette.\n"
                "- **Analyte** - the solution of unknown concentration, "
                "measured into the flask with a volumetric pipette.\n"
                "- **Equivalence point** - the moment the delivered "
                "titrant exactly consumes the analyte in the mole ratio "
                "of the balanced equation. This is a stoichiometric "
                "fact.\n"
                "- **End point** - the moment the indicator changes "
                "colour. This is an observation, chosen to approximate "
                "the equivalence point. Phenolphthalein's colourless to "
                "pink at the first drop of excess base is the classic "
                "for strong acid titrated with strong base.\n\n"
                "The distinction matters: a well-chosen indicator makes "
                "the gap between the two points smaller than one drop, "
                "and a badly chosen one builds in a systematic error no "
                "amount of careful reading removes.\n\n"
                "### The calculation\n\n"
                "At equivalence, moles of titrant relate to moles of "
                "analyte by the coefficients:\n\n"
                "$$M_{titrant} V_{titrant} \\times "
                "\\frac{\\text{coeff}_{analyte}}{\\text{coeff}_{titrant}} "
                "= M_{analyte} V_{analyte}$$\n\n"
                "For 1:1 reactions this collapses to the familiar "
                "$M_1 V_1 = M_2 V_2$ - and the collapsed form silently "
                "fails the moment the ratio is not 1:1, which is exactly "
                "where exams set their traps."
            ),
        ),
        ReadingSection(
            id="worked",
            heading="Worked: one 1:1 and one 2:1",
            body=(
                "### 1:1 - hydrochloric acid by sodium hydroxide\n\n"
                "**25.00 mL of HCl of unknown concentration requires "
                "21.40 mL of 0.1000 M NaOH to reach the "
                "phenolphthalein end point.**\n\n"
                "$$\\ce{HCl + NaOH -> NaCl + H2O}$$\n\n"
                "- Moles of base delivered: $0.02140 \\times 0.1000 = "
                "2.140 \\times 10^{-3}$ mol.\n"
                "- Ratio 1:1, so moles of acid present: "
                "$2.140 \\times 10^{-3}$ mol.\n"
                "- Concentration: $2.140 \\times 10^{-3} / 0.02500 = "
                "0.08560$ M.\n\n"
                "Four significant figures, carried by the glassware.\n\n"
                "### 2:1 - sulfuric acid by sodium hydroxide\n\n"
                "**20.00 mL of $\\ce{H2SO4}$ requires 34.60 mL of "
                "0.1000 M NaOH.**\n\n"
                "$$\\ce{H2SO4 + 2NaOH -> Na2SO4 + 2H2O}$$\n\n"
                "- Moles of base: $0.03460 \\times 0.1000 = "
                "3.460 \\times 10^{-3}$ mol.\n"
                "- The ratio charges TWO base per acid: moles of acid "
                "$= 3.460 \\times 10^{-3} / 2 = 1.730 \\times 10^{-3}$ "
                "mol.\n"
                "- Concentration: $1.730 \\times 10^{-3} / 0.02000 = "
                "0.08650$ M.\n\n"
                "Skipping the divide-by-two - the $M_1V_1 = M_2V_2$ "
                "reflex - reports 0.1730 M, exactly double, and that "
                "doubled number will be waiting among the answer "
                "choices."
            ),
            table=Table(
                caption="Both titrations, side by side",
                columns=("Quantity", "HCl / NaOH", "H2SO4 / NaOH"),
                rows=(
                    ("analyte volume", "25.00 mL", "20.00 mL"),
                    ("titrant used", "21.40 mL of 0.1000 M", "34.60 mL of 0.1000 M"),
                    ("mole ratio (acid:base)", "1:1", "1:2"),
                    ("moles of acid", "2.140e-3", "1.730e-3"),
                    ("analyte concentration", "0.08560 M", "0.08650 M"),
                ),
                source="Computed in the worked examples above.",
                note=(
                    "Same technique, one changed coefficient, and the "
                    "shortcut formula breaks. The mole ratio is not "
                    "optional."
                ),
            ),
            important=(
                "M1V1 = M2V2 is a special case that holds only for 1:1 "
                "stoichiometry. Route every titration through moles and "
                "the balanced equation's ratio, and the polyprotic trap "
                "cannot spring."
            ),
        ),
    ),
    key_takeaways=(
        "Titrant known, analyte unknown; the burette measures the volume "
        "that makes the reaction exactly complete.",
        "Equivalence point is stoichiometric fact; end point is the "
        "indicator's approximation of it.",
        "Compute via moles and the balanced equation's ratio - M1V1=M2V2 "
        "only survives 1:1 reactions.",
        "Diprotic acids halve the acid moles per base mole; the doubled "
        "wrong answer is always among the choices.",
        "Good volumetric glassware carries four significant figures; "
        "report them.",
    ),
    exam_tips=(
        "Check the acid's proton count FIRST, before any arithmetic. The "
        "H2SO4-with-1:1-formula error is the most reliably planted "
        "distractor in the whole unit.",
        "Indicator questions reduce to: does the colour change land near "
        "the equivalence point of THIS acid-base pair? Strong-strong "
        "pairs are forgiving; the weak pairs of later units are not.",
    ),
))
