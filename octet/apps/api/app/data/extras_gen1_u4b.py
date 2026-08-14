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
        "fails. This chapter builds the assignment rules as a strict "
        "hierarchy, works them on the ions that carry most of general "
        "chemistry, and then puts the numbers to their one real use: "
        "sorting reactions into redox and not-redox, and naming which "
        "species lost the electrons and which took them."
    ),
    sections=(
        ReadingSection(
            id="assigning",
            heading="The assignment rules, in order of precedence",
            body=(
                "The rules form a fixed hierarchy, and the hierarchy is "
                "not arbitrary: it runs down the electronegativity "
                "ladder. Fluorine outranks oxygen because fluorine "
                "pulls harder in any tug-of-war between them; oxygen "
                "outranks hydrogen for the same reason; and the metals "
                "of groups 1 and 2 give their electrons up so readily "
                "that no later rule ever overrides them. When two rules "
                "make conflicting demands on the same compound, the "
                "earlier rule describes the stronger puller, so the "
                "earlier rule wins. Apply from the top.\n\n"
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
                "### Tie-breaks, worked\n\n"
                "The collisions are where the ordering earns its keep, "
                "and three compounds cover the famous ones. In "
                "$\\ce{OF2}$, rule 3 outranks rule 6: two fluorines "
                "take $-1$ each, and rule 7 then forces oxygen to $+2$ "
                "- the rare positive oxygen. In $\\ce{NaH}$, rule 4 "
                "outranks rule 5: sodium is $+1$, so hydrogen must be "
                "$-1$, the hydride case rule 5 flagged. In "
                "$\\ce{H2O2}$, rule 5 fixes each hydrogen at $+1$ "
                "first, and rule 7 then leaves $-2$ to be shared by "
                "two oxygens: $-1$ each. The peroxide exception is not "
                "a memorised oddity but a forced consequence of the "
                "ordering. Sodium peroxide, $\\ce{Na2O2}$, runs the "
                "same way: two sodiums at $+1$ (rule 4) leave $-2$ for "
                "two oxygens, $-1$ apiece.\n\n"
                "### Worked assignments\n\n"
                "- $\\ce{MnO4-}$: four O at $-2$ give $-8$; the sum must "
                "be $-1$, so Mn is $+7$.\n"
                "- $\\ce{Cr2O7^2-}$: seven O give $-14$; sum $-2$, so two "
                "Cr share $+12$, i.e. $+6$ each.\n"
                "- $\\ce{NH4+}$: H is $+1$ (rule 5), four of them give "
                "$+4$; sum $+1$, so N is $-3$.\n"
                "- $\\ce{ClO3-}$: three O give $-6$; sum $-1$, so Cl is "
                "$+5$.\n"
                "- $\\ce{SO4^2-}$: four O give $-8$; sum $-2$, so S is "
                "$+6$.\n"
                "- $\\ce{HPO4^2-}$: H gives $+1$, four O give $-8$; "
                "$+1 + x - 8 = -2$ solves to P $= +5$.\n"
                "- $\\ce{Fe3O4}$: four O give $-8$, three Fe share $+8$ - "
                "an average of $+\\tfrac{8}{3}$. Fractions are legal and "
                "mean the crystal genuinely mixes $+2$ and $+3$ iron.\n\n"
                "The oxyanion drill is always the same two moves: "
                "multiply out the oxygens, then let rule 7 solve for "
                "the centre. It takes ten seconds per ion with "
                "practice, and the polyatomic ions of the nomenclature "
                "unit - sulfate, nitrate, phosphate, carbonate, "
                "chlorate - are the vocabulary those ten seconds are "
                "spent on. The payoff shows up again in "
                "electrochemistry, where every half-reaction and every "
                "cell potential calculation starts from exactly this "
                "bookkeeping."
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
                "A worked read of the zinc reaction fixes the "
                "vocabulary in place. Zinc's number went up, so zinc "
                "was oxidised, so zinc is the reducing agent - it "
                "handed its electrons to copper. The copper ion's "
                "number went down, so it was reduced, so the copper "
                "ion is the oxidising agent. Naming each agent after "
                "the OTHER species' fate feels backwards exactly once; "
                "after that, the symmetry does the remembering for "
                "you.\n\n"
                "Electrons lost must equal electrons gained - conservation "
                "again, this time of charge. In the zinc reaction, two "
                "electrons leave zinc and two arrive at copper. That "
                "equality is what the half-reaction balancing method of "
                "the electrochemistry unit is built on.\n\n"
                "Counting the electrons is worth the extra line. "
                "Zinc's rise from $0$ to $+2$ is a loss of two "
                "electrons per atom; copper's fall from $+2$ to $0$ is "
                "a gain of two; one zinc atom funds exactly one copper "
                "ion, which is why this equation balances with every "
                "coefficient equal to one. Whenever the per-atom "
                "counts differ - a metal surrendering three electrons "
                "against an ion accepting two, say - the coefficients "
                "must stretch until electrons lost equal electrons "
                "gained, and arranging that stretch systematically is "
                "the entire content of the half-reaction method."
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
        ReadingSection(
            id="patterns",
            heading="Two patterns worth recognising on sight",
            body=(
                "### Combustion is redox with a large electron bill\n\n"
                "Assign numbers across "
                "$\\ce{CH4 + 2O2 -> CO2 + 2H2O}$ and the transfer is "
                "dramatic. In methane, four hydrogens at $+1$ force "
                "carbon to $-4$; in carbon dioxide, two oxygens at "
                "$-2$ force it to $+4$. Carbon climbs eight steps - an "
                "eight-electron oxidation of a single atom. The books "
                "still balance: four oxygen atoms arrive at $0$ and "
                "land at $-2$, gaining two electrons each, "
                "$4 \\times 2 = 8$ gained against 8 lost. Hydrogen "
                "starts at $+1$ in methane and ends at $+1$ in water - "
                "a spectator by the numbers, despite changing "
                "partners. Every hydrocarbon combustion runs this same "
                "audit: carbon up, oxygen down, hydrogen unmoved, "
                "which is why combustion sits in the redox column of "
                "the table above before any arithmetic is done.\n\n"
                "### Disproportionation: one element, both directions\n\n"
                "Nothing in the rules says the oxidised and reduced "
                "species must be different elements. Hydrogen peroxide "
                "decomposing,\n\n"
                "$$\\ce{2H2O2 -> 2H2O + O2}$$\n\n"
                "starts with all four oxygens at $-1$. Two finish in "
                "water at $-2$ - reduced, one electron gained each. "
                "Two finish in $\\ce{O2}$ at $0$ - oxidised, one "
                "electron lost each. The same element, from the same "
                "starting compound, goes both ways at once, and the "
                "electron ledger still closes at two lost against two "
                "gained. The pattern is called disproportionation, and "
                "it is the standard fate of an element caught at an "
                "intermediate oxidation state: peroxide's $-1$ oxygen, "
                "sitting halfway between $0$ and $-2$, is the textbook "
                "case. Spotting it is pure oxidation-number work - no "
                "other tool in this unit sees it at all, because "
                "nothing precipitates, nothing neutralises, and the "
                "molecular formulas alone give no hint that electrons "
                "moved."
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
        "the bridge. The earlier chapters of this unit built the two "
        "tools being spent here: the balanced equation, whose "
        "coefficients count particles, and the mole, which converts "
        "particle counts into masses a balance can check. This chapter "
        "only combines them, but the combination is the most examined "
        "quantitative skill in general chemistry, and the discipline it "
        "rewards - name the given, name the wanted, route through moles, "
        "let the units police every step - is mechanical. That is its "
        "virtue: a mechanical skill can be made error-proof."
    ),
    sections=(
        ReadingSection(
            id="mole-bridge",
            heading="The mole bridge",
            body=(
                "Coefficients relate MOLES, not grams. The equation "
                "$\\ce{N2 + 3H2 -> 2NH3}$ says one molecule of nitrogen "
                "meets three molecules of hydrogen; scale both counts by "
                "Avogadro's number and it says one mole meets three "
                "moles. It does not say one gram meets three grams, and "
                "it never will, because the particles being counted have "
                "different masses. In mass terms the same equation "
                "reads: 28.02 g of nitrogen consumes "
                "$3 \\times 2.016 = 6.048$ g of hydrogen and delivers "
                "$28.02 + 6.048 = 34.07$ g of ammonia. The mass "
                "proportion 28.02 : 6.048 : 34.07 looks nothing like "
                "1 : 3 : 2, and no rescaling makes it. There is no "
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
                "cancels the unit you are leaving.\n\n"
                "The working format that catches mistakes before they "
                "cost anything is the single factor-label chain: write "
                "the given quantity, then multiply by conversion "
                "fractions until the unit you want is the only one left "
                "standing. For the ammonia problem worked in the next "
                "section, the entire calculation is one line:\n\n"
                "$$10.0\\ \\text{g}\\ \\ce{H2} \\times "
                "\\frac{1\\ \\text{mol}\\ \\ce{H2}}{2.016\\ \\text{g}} "
                "\\times \\frac{2\\ \\text{mol}\\ \\ce{NH3}}"
                "{3\\ \\text{mol}\\ \\ce{H2}} \\times "
                "\\frac{17.03\\ \\text{g}}{1\\ \\text{mol}\\ \\ce{NH3}} "
                "= 56.3\\ \\text{g}$$\n\n"
                "Read the chain by cancelling units first and computing "
                "second. If a ratio has been written upside down, a unit "
                "survives that should have died, and the mistake "
                "announces itself before any arithmetic happens. That is "
                "not a stylistic preference but a checking mechanism, "
                "and on a timed exam it is also faster than working in "
                "fragments, because each fragment's answer would "
                "otherwise have to be copied, rounded and re-entered - "
                "three fresh chances to slip."
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
                "A third check is crude scale. About five moles of "
                "hydrogen at a two-thirds ratio becomes about 3.3 mol "
                "of ammonia, and 3.3 mol of a 17 g/mol gas has to weigh "
                "somewhat over 50 g. The two misplaced-decimal "
                "neighbours, 5.63 g and 563 g, both fail that glance "
                "instantly. Estimation does not replace the "
                "calculation; it catches the calculator slip that "
                "careful people still make.\n\n"
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
        ReadingSection(
            id="second-pass-propane",
            heading="A second gram-to-gram pass: combustion of propane",
            body=(
                "One worked example teaches the road; a second, walked "
                "without shortcuts, shows the road is the same "
                "everywhere. **What mass of carbon dioxide does the "
                "complete combustion of 22.0 g of propane produce?**\n\n"
                "$$\\ce{C3H8(g) + 5O2(g) -> 3CO2(g) + 4H2O(g)}$$\n\n"
                "- **1. To moles.** $M(\\ce{C3H8}) = 3(12.01) + "
                "8(1.008) = 36.03 + 8.064 = 44.09$ g/mol, so "
                "$22.0 \\div 44.09 = 0.4990$ mol of propane.\n"
                "- **2. Mole bridge.** The equation pays three carbon "
                "dioxides per propane: $0.4990 \\times 3 = 1.497$ mol "
                "$\\ce{CO2}$.\n"
                "- **3. To grams.** $1.497 \\times 44.01 = 65.88$ g - "
                "65.9 g at the three figures the data supports.\n\n"
                "The same three steps answer everything else the "
                "equation can be asked about this flask. Oxygen "
                "consumed: $0.4990 \\times 5 = 2.495$ mol, which is "
                "$2.495 \\times 32.00 = 79.84$ g. Water formed: "
                "$0.4990 \\times 4 = 1.996$ mol, which is "
                "$1.996 \\times 18.02 = 35.97$ g. And the audit that "
                "closes the books: mass in is $22.0 + 79.84 = 101.84$ "
                "g, mass out is $65.88 + 35.97 = 101.85$ g. The books "
                "balance to a hundredth of a gram; the 0.01 g of "
                "daylight is the rounding carried by four-figure molar "
                "masses, not lost matter. An audit that missed by a "
                "whole gram would instead be pointing at a wrong molar "
                "mass or an inverted ratio, and running it costs two "
                "additions.\n\n"
                "Notice what did not change between the ammonia problem "
                "and this one: the shape of the work. Different "
                "reaction, different coefficients, different molar "
                "masses - and the identical three-step walk, with the "
                "chemistry entering exactly once, at the coefficients. "
                "That sameness is the thing to train. A student who "
                "re-derives the strategy for every new problem is "
                "solving two problems each time; a student who owns the "
                "roadmap only ever solves one."
            ),
        ),
        ReadingSection(
            id="mass-to-volume",
            heading="Mass to volume: solutions and gases on the ends",
            body=(
                "The bridge does not care what unit stands on either "
                "bank; the table above promised as much, and it is "
                "worth seeing worked. When a reactant arrives as a "
                "solution of known molarity, its moles come from "
                "$n = MV$ with the volume in litres; when the answer is "
                "wanted as a volume of solution, the closing step is "
                "$V = n/M$ instead of a multiplication by molar "
                "mass.\n\n"
                "**What volume of 0.250 M silver nitrate exactly "
                "precipitates the chloride in 150.0 mL of 0.100 M "
                "calcium chloride?**\n\n"
                "$$\\ce{CaCl2(aq) + 2AgNO3(aq) -> 2AgCl(s) + "
                "Ca(NO3)2(aq)}$$\n\n"
                "- **1. To moles.** $n(\\ce{CaCl2}) = 0.100 \\times "
                "0.1500 = 0.0150$ mol.\n"
                "- **2. Mole bridge.** Each formula unit carries two "
                "chlorides and claims two silver ions: "
                "$0.0150 \\times 2 = 0.0300$ mol $\\ce{AgNO3}$.\n"
                "- **3. To volume.** $V = 0.0300 / 0.250 = 0.120$ L, "
                "i.e. 120 mL.\n\n"
                "The mass of precipitate comes free from the same "
                "middle step: $M(\\ce{AgCl}) = 107.9 + 35.45 = 143.4$ "
                "g/mol to four figures, so $0.0300 \\times 143.4 = "
                "4.30$ g of silver chloride ends up on the filter "
                "paper.\n\n"
                "Gases ride the same bridge with molar volume as the "
                "ramp. At STP one mole of ideal gas occupies 22.4 L, "
                "so the carbon dioxide from decomposing 10.0 g of "
                "calcium carbonate - $10.0 / 100.09 = 0.0999$ mol of "
                "$\\ce{CaCO3}$, and by the 1:1 ratio 0.0999 mol of "
                "gas - fills $0.0999 \\times 22.4 = 2.24$ L. Away from "
                "STP, $n = PV/RT$ replaces the fixed 22.4 L/mol, and "
                "nothing else in the walk changes.\n\n"
                "The recurring trap in solution problems is the volume "
                "unit. Molarity is moles per LITRE, and burette and "
                "pipette readings arrive in millilitres; convert "
                "before computing, every time. The factor-of-a-"
                "thousand error survives every plausibility glance - "
                "0.0300 mol and 30.0 mol both look like numbers - and "
                "only the units catch it, which is one more argument "
                "for writing the chain with its units attached."
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
        "alone could produce. This chapter gives that comparison two "
        "interchangeable forms, runs both on the same numbers twice, and "
        "closes the ledger every time: yield from the limiter, leftover "
        "by subtraction, mass conserved to the last centigram."
    ),
    sections=(
        ReadingSection(
            id="finding",
            heading="Finding the limiter",
            body=(
                "The sandwich picture is exact: with 10 slices of bread "
                "and 3 patties, at two slices and one patty per "
                "sandwich, the bread supports $10 / 2 = 5$ sandwiches "
                "and the patties support 3. Three is smaller, so three "
                "sandwiches form, the patties vanish, and "
                "$10 - 3 \\times 2 = 4$ slices remain, however much "
                "more bread you buy. Patties limit. Every limiting "
                "reactant problem is this picture with molar masses "
                "bolted on.\n\n"
                "Note what the comparison was NOT: it was not 10 "
                "against 3. Raw counts mislead the moment the recipe "
                "consumes ingredients at different rates, and "
                "coefficients are exactly that - different rates. Five "
                "moles of $\\ce{H2}$ against four of $\\ce{O2}$ looks "
                "hydrogen-poor, but in $\\ce{2H2 + O2 -> 2H2O}$ "
                "hydrogen is spent two per round of the reaction and "
                "oxygen one: hydrogen funds $5 / 2 = 2.5$ rounds, "
                "oxygen funds 4, and hydrogen runs out first despite "
                "the larger raw amount.\n\n"
                "### Method 1: moles per coefficient\n\n"
                "Convert every reactant to moles and divide each by its "
                "own coefficient. The quotient is the number of rounds "
                "of the equation as written that the reactant can pay "
                "for, and the smallest quotient names the limiter. One "
                "caution: the quotient is a comparison device, not an "
                "amount of anything. Do not carry it into the yield "
                "arithmetic - once the limiter is named, return to its "
                "actual moles and proceed by ordinary stoichiometry.\n\n"
                "### Method 2: compute both yields\n\n"
                "Convert every reactant to moles, then compute the "
                "amount of ONE chosen product each reactant could make "
                "alone. The reactant producing the SMALLEST amount is "
                "the limiter - and, the reason this method earns its "
                "extra multiplication, that smallest amount already IS "
                "the theoretical yield. The two methods always agree; "
                "method 1 is quicker when the question only asks who "
                "limits, and method 2 hands over the number the problem "
                "was about to ask for anyway.\n\n"
                "One special case is worth naming so it does not become "
                "a bad habit: when the reactants' coefficients are "
                "equal - 1:1, or 2:2 - the raw mole comparison and the "
                "per-coefficient comparison coincide, and comparing "
                "moles directly is safe. The habit to avoid is assuming "
                "that case silently. Check the coefficients first; the "
                "division costs nothing when they are equal and rescues "
                "the answer when they are not.\n\n"
                "### Worked, both ways\n\n"
                "**4.00 g of hydrogen burns in 16.0 g of oxygen. How much "
                "water forms, and what remains?**\n\n"
                "$$\\ce{2H2 + O2 -> 2H2O}$$\n\n"
                "- Moles in: $4.00 / 2.016 = 1.98$ mol $\\ce{H2}$; "
                "$16.0 / 32.00 = 0.500$ mol $\\ce{O2}$.\n"
                "- Method 1: hydrogen pays $1.98 / 2 = 0.99$ rounds; "
                "oxygen pays $0.500 / 1 = 0.500$ rounds. Oxygen's "
                "quotient is smaller.\n"
                "- Method 2: water each could make alone - hydrogen "
                "$1.98 \\times \\tfrac{2}{2} = 1.98$ mol; oxygen "
                "$0.500 \\times \\tfrac{2}{1} = 1.00$ mol. Oxygen's "
                "figure is smaller, and 1.00 mol is the theoretical "
                "yield in the same motion.\n"
                "- Verdict, twice over: **oxygen limits**, despite "
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
            id="worked-aluminum",
            heading="A second pass with uglier coefficients",
            body=(
                "The hydrogen-oxygen example is friendly: its "
                "coefficients are 2, 1, 2. The method has to survive a "
                "2:3 ratio without wobbling, so run it once more. "
                "**10.0 g of aluminium reacts with 30.0 g of chlorine "
                "gas. Find the limiter, the mass of aluminium chloride "
                "formed, and what remains.**\n\n"
                "$$\\ce{2Al(s) + 3Cl2(g) -> 2AlCl3(s)}$$\n\n"
                "Moles in first, kept at four figures so rounding "
                "cannot bite later: $10.0 / 26.98 = 0.3706$ mol Al; "
                "$M(\\ce{Cl2}) = 2 \\times 35.45 = 70.90$ g/mol, so "
                "$30.0 / 70.90 = 0.4231$ mol $\\ce{Cl2}$. Chlorine "
                "leads in raw grams and in raw moles.\n\n"
                "Method 1: aluminium pays $0.3706 / 2 = 0.1853$ rounds; "
                "chlorine pays $0.4231 / 3 = 0.1410$ rounds. Chlorine's "
                "quotient is smaller: **chlorine limits**, despite the "
                "three-to-one mass advantage it walked in with.\n\n"
                "Method 2 on the same numbers: aluminium alone could "
                "give $0.3706 \\times \\tfrac{2}{2} = 0.3706$ mol of "
                "$\\ce{AlCl3}$; chlorine alone "
                "$0.4231 \\times \\tfrac{2}{3} = 0.2821$ mol. Same "
                "verdict, and the theoretical yield is already in "
                "hand: $M(\\ce{AlCl3}) = 26.98 + 3(35.45) = 133.3$ "
                "g/mol to four figures, so "
                "$0.2821 \\times 133.3 = 37.60$ g.\n\n"
                "The leftover comes from the limiter through the "
                "coefficient ratio, never by guesswork. Chlorine "
                "consumes aluminium at two Al per three $\\ce{Cl2}$: "
                "$0.4231 \\times \\tfrac{2}{3} = 0.2821$ mol of Al is "
                "spent, which is $0.2821 \\times 26.98 = 7.611$ g. "
                "Remaining: $10.0 - 7.611 = 2.39$ g of aluminium.\n\n"
                "Audit: $37.60 + 2.39 = 39.99$ g out against "
                "$10.0 + 30.0 = 40.0$ g in - agreement to a centigram, "
                "the difference being the four-figure rounding in the "
                "molar masses. A ledger that closes is not proof every "
                "step was right, but a ledger that fails to close is "
                "proof one was wrong, and the check costs one "
                "addition."
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
                "The order of operations follows from the list: "
                "identify the limiter before computing anything else, "
                "because every later number inherits from it. Reversing "
                "the order - computing a yield first and wondering "
                "about the limiter afterwards - produces figures that "
                "look authoritative and mean nothing, which is worse "
                "than no figure at all, because a wrong number defends "
                "itself in a way a blank does not.\n\n"
                "Industrial practice deliberately feeds the CHEAP "
                "reactant in excess to push the expensive one toward "
                "complete conversion - air is free, so combustion and "
                "oxidation processes run oxygen-rich. When a problem says "
                "'excess' or 'sufficient' for one reactant, that is the "
                "author telling you not to test it: the other reactant "
                "limits by declaration.\n\n"
                "There is one more consequence worth naming: what the "
                "flask holds when the stirring stops. The product "
                "arrives mixed with the leftover excess reactant, and "
                "the workup has to separate the two. Choosing WHICH "
                "reactant to overfeed is therefore also a separation "
                "decision - overfeed the partner that is easiest to "
                "remove afterwards. A gas that boils away or a "
                "water-soluble salt that washes out makes a cheap "
                "excess; a reactant that co-crystallises with the "
                "product makes an expensive one, because every gram of "
                "it costs purification yield downstream.\n\n"
                "And a reading habit that saves marks: the moment a "
                "problem states amounts for TWO reactants, it is a "
                "limiting reactant problem, whatever the final question "
                "asks - mass of product, volume of gas, amount left "
                "over. The comparison step is not optional decoration. "
                "Skipping it and computing from whichever reactant the "
                "problem happened to mention first is the single most "
                "common way to lose an otherwise easy question."
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
        "single number by which synthetic work is judged. The three "
        "numbers are simple; the discipline is keeping straight which of "
        "them are calculated and which are measured, and the payoff is "
        "the habit of planning in reverse, which turns the formula from "
        "a grade into a design tool."
    ),
    sections=(
        ReadingSection(
            id="three-numbers",
            heading="Three numbers and one formula",
            body=(
                "Three quantities, two of them calculated and one of "
                "them weighed, organise everything this chapter "
                "does.\n\n"
                "- **Theoretical yield** - the maximum product the "
                "limiting reactant permits, computed by stoichiometry. A "
                "calculated number: it exists on paper before the flask "
                "is opened, and nothing that happens at the bench can "
                "change it.\n"
                "- **Actual yield** - what you isolate, dry and weigh. A "
                "measured number; it cannot be calculated, only "
                "reported. A problem that seems to ask you to calculate "
                "an actual yield is really handing you a percent yield "
                "and asking for the formula run backwards.\n"
                "- **Percent yield** - their honest ratio:\n\n"
                "$$\\%\\,\\text{yield} = "
                "\\frac{\\text{actual}}{\\text{theoretical}} \\times "
                "100\\%$$\n\n"
                "The separation of roles is the real content here. "
                "Stoichiometry sets a ceiling and only a ceiling; the "
                "balance reports what actually happened; the ratio "
                "judges the gap between them, and the gap is "
                "information - about technique, about the reaction's "
                "true behaviour, about whether a procedure deserves to "
                "be scaled up.\n\n"
                "### Worked\n\n"
                "**Decompose 10.00 g of calcium carbonate; 5.13 g of "
                "calcium oxide is recovered. Percent yield?**\n\n"
                "$$\\ce{CaCO3(s) -> CaO(s) + CO2(g)}$$\n\n"
                "- Moles in: $10.00 / 100.09 = 0.09991$ mol "
                "$\\ce{CaCO3}$.\n"
                "- Theoretical: 1:1 ratio, so $0.09991$ mol of "
                "$\\ce{CaO}$ at $56.08$ g/mol $= 5.603$ g.\n"
                "- Percent yield: $5.13 / 5.603 \\times 100 = 91.6\\%$.\n\n"
                "Read the division the right way around: actual over "
                "theoretical. Inverted, it would report "
                "$5.603 / 5.13 \\times 100 = 109\\%$, and a yield over "
                "100 earned that way is usually the first sign of an "
                "upside-down fraction rather than of anything at the "
                "bench. The theoretical figure sits in the denominator "
                "because it is the standard being judged against; the "
                "bench result is the numerator because it is the thing "
                "on trial."
            ),
        ),
        ReadingSection(
            id="limiting-inside",
            heading="Worked: the limiting reactant hides inside",
            body=(
                "Real percent-yield problems rarely hand over the "
                "theoretical yield; they hand over two reactant masses "
                "and make you earn it. The full pipeline is limiting "
                "reactant first, theoretical yield second, percent "
                "yield last - three chapters of this unit in one "
                "problem.\n\n"
                "**5.00 g of zinc powder is heated with 5.00 g of "
                "sulfur, and 6.85 g of zinc sulfide is isolated. What "
                "is the percent yield?**\n\n"
                "$$\\ce{Zn(s) + S(s) -> ZnS(s)}$$\n\n"
                "- Moles in: $5.00 / 65.38 = 0.0765$ mol Zn; "
                "$5.00 / 32.06 = 0.156$ mol S.\n"
                "- Equal masses are not equal moles. The coefficients "
                "are 1:1, so the smaller mole count limits outright: "
                "**zinc limits**, with sulfur in roughly twofold "
                "excess.\n"
                "- Theoretical: $M(\\ce{ZnS}) = 65.38 + 32.06 = 97.44$ "
                "g/mol, so $0.0765 \\times 97.44 = 7.45$ g.\n"
                "- Percent yield: $6.85 / 7.45 \\times 100 = "
                "91.9\\%$.\n\n"
                "The distractor built into the problem is the sulfur "
                "route: $0.156$ mol would promise "
                "$0.156 \\times 97.44 = 15.2$ g, and "
                "$6.85 / 15.2 \\times 100 = 45.1\\%$ sits waiting among "
                "the answer choices for anyone who skipped the limiting "
                "step. Both divisions run cleanly; only one of them "
                "means anything. The test-taking rule follows: whenever "
                "a percent-yield problem supplies two reactant amounts, "
                "the limiting comparison is mandatory, and the "
                "excess-reactant answer is the planted distractor.\n\n"
                "The leftover closes the books, exactly as the last "
                "chapter drilled: zinc consumes $0.0765$ mol of sulfur, "
                "leaving $0.156 - 0.0765 = 0.0795$ mol, which is "
                "$0.0795 \\times 32.06 = 2.55$ g. At complete "
                "conversion the flask would hold $7.45$ g of zinc "
                "sulfide beside $2.55$ g of unreacted sulfur - "
                "$10.00$ g in, $10.00$ g accounted out. The measured "
                "6.85 g against the 7.45 g promise is the gap the next "
                "section explains."
            ),
        ),
        ReadingSection(
            id="where-losses-live",
            heading="Why the bench falls short",
            body=(
                "A percent yield below 100 is not an indictment; it is "
                "the normal state of affairs, and the losses arrive "
                "through four doors.\n\n"
                "**Transfer and handling.** Product clings to every "
                "surface it meets - filter paper, flask walls, the "
                "spatula. Each transfer forfeits a film of material, "
                "and a procedure with many transfers pays that toll "
                "many times. The loss is mechanical rather than "
                "chemical: the molecules exist, but they are not in "
                "the vial on the balance.\n\n"
                "**Incomplete reaction.** Some reactions are genuinely "
                "finished; others are merely stopped. A reaction that "
                "reaches equilibrium holds products and reactants in a "
                "fixed ratio, and waiting longer moves nothing - the "
                "ceiling is thermodynamic, and the equilibrium unit "
                "will put numbers on it. A slow reaction quenched on a "
                "schedule leaves reactant unconverted for kinetic "
                "reasons instead. Either way, molecules that never "
                "reacted are molecules that cannot be harvested.\n\n"
                "**Competing reactions.** The balanced equation is the "
                "reaction you wanted, and it is rarely the only one on "
                "offer. Reactant spent on a side product is deducted "
                "from the intended harvest before the workup even "
                "begins, and the side product then contaminates the "
                "mixture, feeding the fourth door.\n\n"
                "**Purification.** Every recrystallisation, wash and "
                "distillation trades yield for purity, discarding some "
                "product along with the impurities it was dissolved "
                "beside. The trade is usually right - an impure high "
                "yield is a worse result than a clean modest one - but "
                "it is a trade, and it is paid in percent.\n\n"
                "A yield above 100% is the flip side, and it is never "
                "a triumph: the sample was weighed with something "
                "extra in it. Water still in the crystals, solvent not "
                "fully evaporated, a co-precipitated salt - all add "
                "mass the theoretical figure never promised. Report it "
                "as an error flag, dry the sample, and weigh again.\n\n"
                "The four doors are not equally open in every reaction, "
                "and diagnosing WHICH one leaked is the skilled part of "
                "bench work: a yield that improves with gentler "
                "transfers was mechanical; one that improves with "
                "longer reaction time was kinetic; one that no patience "
                "improves is thermodynamic, and chasing it with more "
                "hours is wasted effort better spent shifting the "
                "equilibrium - the lever the equilibrium unit will "
                "name."
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
                "The same inversion chains through consecutive steps. "
                "To finish with 10.0 g of final product from two steps "
                "expected at 85% and then 70%, the overall expectation "
                "is $0.85 \\times 0.70 = 0.595$, so the route must be "
                "scaled for a start-to-finish theoretical output of "
                "$10.0 / 0.595 = 16.8$ g. Planning backwards like this "
                "- target first, expected losses divided out - is how a "
                "synthesis decides its scale before the first flask is "
                "charged, and it is the difference between a route that "
                "delivers and one that runs dry two steps from the "
                "end.\n\n"
                "### Multi-step sequences multiply\n\n"
                "Yields compound. A three-step route at 80% per step "
                "delivers $0.80^3 = 51\\%$ overall; five steps at 80% "
                "deliver 33%. This single piece of arithmetic is why "
                "synthetic chemists prize short routes and why a 95% step "
                "is worth real money at industrial scale.\n\n"
                "It is also why reported yields are always PER STEP: an "
                "overall figure hides where the losses live, and fixing a "
                "route means finding the weak step.\n\n"
                "Percent yield is also the honest way to compare "
                "procedures. Two routes to the same compound cannot be "
                "compared by their actual yields alone - they were run "
                "at different scales - but percent yields normalise "
                "the scale away, which is why journals demand them and "
                "why an exam answer reporting grams where a percentage "
                "was asked has answered a different question."
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
        "figures on good glassware. The chapter walks the apparatus and "
        "its vocabulary, separates the two points every titration turns "
        "on, states the calculation in a form that survives any mole "
        "ratio, and finishes with the standardisation step that makes "
        "the titrant's label trustworthy in the first place."
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
                "The technique is what earns the glassware's precision. "
                "The burette is rinsed with the titrant it will hold - "
                "rinsing with water would leave droplets that dilute "
                "the titrant unpredictably - and the pipette with the "
                "analyte, for the same reason. The conical flask, by "
                "contrast, may be wet with distilled water: the moles "
                "of analyte the pipette delivered are already fixed, "
                "and extra water changes the concentration in the "
                "flask but not the amount, so it drops out of the "
                "calculation entirely. Knowing WHICH glassware is "
                "allowed to be wet is a favourite short-answer item "
                "precisely because it tests the mole logic rather than "
                "the ritual.\n\n"
                "Near the expected end point the titrant goes in "
                "dropwise, with constant swirling, over a white tile "
                "that makes the colour change legible. The first run "
                "is a deliberately quick scout that overshoots and "
                "finds the neighbourhood; the measured runs then "
                "approach slowly and are repeated until successive "
                "titres agree closely, and only those concordant "
                "values are averaged. One titre is an anecdote; "
                "concordant titres are a measurement. Read the burette "
                "at eye level, at the bottom of the meniscus, and "
                "record each reading immediately at the instrument's "
                "full precision - transcribing from memory is where "
                "four-figure work quietly becomes three-figure "
                "work.\n\n"
                "The equivalence-endpoint distinction matters because "
                "the two coincide only by good design. A well-chosen "
                "indicator makes the gap between them smaller than one "
                "drop; a badly chosen one builds in a systematic error "
                "that no amount of careful reading removes. The stakes "
                "are easy to size: a burette drop is roughly 0.05 mL, "
                "and on a 21.40 mL titre that is "
                "$0.05 / 21.40 \\approx 0.2\\%$ - about the scale of "
                "the glassware's own tolerances. Indicator error at "
                "the one-drop level is free; indicator error at the "
                "whole-millilitre level quietly poisons every figure "
                "the calculation reports.\n\n"
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
        ReadingSection(
            id="standardisation",
            heading="Where 0.1000 M comes from: standardising the titrant",
            body=(
                "Both worked examples leaned on the same quiet claim: "
                "that the base in the burette really is 0.1000 M. That "
                "number cannot come from weighing out sodium "
                "hydroxide, because solid NaOH absorbs water and "
                "carbon dioxide from the air even while it sits on the "
                "balance - the mass read is the mass of NaOH plus an "
                "unknowable amount of stowaway. The concentration must "
                "be measured, and it is measured by titration against "
                "a primary standard: a solid stable enough to be "
                "weighed exactly and pure enough that its moles follow "
                "from its mass alone.\n\n"
                "The classic primary standard for bases is potassium "
                "hydrogen phthalate, KHP, formula $\\ce{KHC8H4O4}$ - a "
                "monoprotic acid that is a stable, non-hygroscopic "
                "crystalline solid. Its molar mass from the standard "
                "atomic weights: $8(12.01) + 5(1.008) + 39.10 + "
                "4(16.00) = 96.08 + 5.040 + 39.10 + 64.00 = 204.2$ "
                "g/mol to four figures.\n\n"
                "**0.5106 g of KHP, dissolved in water, requires "
                "25.00 mL of a sodium hydroxide solution to reach the "
                "phenolphthalein end point. What is the base's "
                "concentration?**\n\n"
                "- Moles of KHP: $0.5106 / 204.2 = 2.500 \\times "
                "10^{-3}$ mol.\n"
                "- The acid is monoprotic, so the ratio is 1:1: moles "
                "of NaOH delivered $= 2.500 \\times 10^{-3}$ mol.\n"
                "- Concentration: $2.500 \\times 10^{-3} / 0.02500 = "
                "0.1000$ M.\n\n"
                "Now the burette's label is a measurement with a "
                "pedigree: a mass from an analytical balance, a molar "
                "mass from atomic weights, a volume from calibrated "
                "glass. Every titration downstream inherits its four "
                "significant figures from this one. The principle "
                "generalises past acids and bases: any volumetric "
                "method is only as good as its standard, and 'primary "
                "standard grade' on a reagent bottle is a purity claim "
                "backed by exactly this arithmetic."
            ),
        ),
        ReadingSection(
            id="choosing-the-indicator",
            heading="Choosing the indicator: the rule",
            body=(
                "An indicator is itself a weak acid whose two forms "
                "differ in colour; it changes over a narrow pH "
                "interval characteristic of the indicator, not of the "
                "titration. The choice is therefore not a matter of "
                "taste, and the rule can be stated in one sentence: "
                "**choose an indicator whose colour-change interval "
                "falls within the steep, nearly vertical rise in pH "
                "that the titration curve makes at the equivalence "
                "point.** If the colour changes inside that vertical "
                "region, the volume error between end point and "
                "equivalence point is less than a drop, because within "
                "the steep region a whole pH unit of change costs "
                "almost no titrant.\n\n"
                "For a strong acid titrated with a strong base the "
                "equivalence point sits at pH 7 and the vertical "
                "region is enormous - several pH units on either side "
                "- so the rule is forgiving: phenolphthalein, which "
                "turns in mildly basic solution, and methyl orange, "
                "which turns in acidic solution, both land inside the "
                "steep rise and both work. That forgiveness is special "
                "to the strong-strong case.\n\n"
                "It disappears the moment one partner is weak. A weak "
                "acid titrated with a strong base reaches equivalence "
                "on the basic side of 7, because the anion left behind "
                "at equivalence is itself a weak base; there "
                "phenolphthalein still works, and methyl orange "
                "changes far too early, declaring an end point while "
                "the titration is nowhere near done. The machinery for "
                "computing that equivalence pH belongs to the "
                "acid-base equilibrium unit; the rule for using it "
                "belongs here, and it does not change: match the "
                "indicator's interval to THIS titration's equivalence "
                "point, not to a remembered default. Stated once more "
                "as an operating rule: identify where the equivalence "
                "point of this reaction falls first, then pick the "
                "indicator that changes there. The order never "
                "reverses."
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
