"""Chapters for GEN1 unit 5, Thermochemistry - second half.

Nodes: ENTHALPY, THERMOSTOICH, HESS, FORMATION, BONDENTHALPY. The first half
(ENERGYBASICS, FIRSTLAW, HEATCAPACITY, CALORIMETRY) lives in
extras_gen1_u5.py.

Every number is computed or sourced, and the two families of tabulated data
are kept distinct on purpose: combustion and formation enthalpies are CRC /
OpenStax Appendix G values, the same ones the unit's arc lessons cite, while
bond enthalpies are the OpenStax bond-energy table's averages. Where two
routes to the same quantity disagree in the last digit (methane's -890.3
measured against -890.5 from formation values), the text says so and says
why, because rounding residue that goes unexplained teaches students to
distrust the method instead of the rounding. Sign convention throughout:
enthalpy changes are written from the system's point of view, negative
exothermic, positive endothermic.
"""

from __future__ import annotations

from app.data.lesson_extras import (
    LessonExtras,
    ReadingSection,
    Table,
)

EXTRAS_GEN1_U5B: dict[str, LessonExtras] = {}


def _add(extras: LessonExtras) -> None:
    EXTRAS_GEN1_U5B[extras.node] = extras


# --------------------------------------------------------------------------
# 5.5 Enthalpy of reaction
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="GEN1.ENTHALPY",
    lead=(
        "Most chemistry happens in vessels open to the sky - flasks, "
        "beakers, engines breathing air - where the pressure is fixed "
        "and the volume adjusts itself. Enthalpy is the energy quantity "
        "built for exactly that situation: the heat a process exchanges "
        "at constant pressure. This chapter defines it, fixes its sign "
        "convention permanently, and puts it to work scaling reaction "
        "heats to real amounts of material, with a close look at the "
        "detail beginners skip and exam writers love - the physical "
        "states written into the equation."
    ),
    sections=(
        ReadingSection(
            id="why-enthalpy",
            heading="Why a second energy quantity",
            body=(
                "The first law's natural quantity is internal energy, "
                "and at constant volume the correspondence is perfect: "
                "no expansion work can happen, so $\\Delta U = q_V$ - "
                "the heat is the whole story. But clamp the pressure "
                "instead of the volume, as every open vessel does, and "
                "a gas-releasing reaction spends part of its energy "
                "pushing the atmosphere back. The heat that reaches "
                "the surroundings is what remains after that work is "
                "paid.\n\n"
                "Enthalpy is defined to absorb the correction "
                "automatically: $H = U + PV$, and for a process at "
                "constant pressure,\n\n"
                "$$\\Delta H = \\Delta U + P\\Delta V = q_P$$\n\n"
                "The heat exchanged at constant pressure IS the "
                "enthalpy change - that identity is the whole reason "
                "the quantity exists, and it is why a coffee-cup "
                "calorimeter (open to the air) reads $\\Delta H$ while "
                "a bomb (rigid) reads $\\Delta U$.\n\n"
                "How different are the two? The gap is the expansion "
                "work, roughly $\\Delta n_{gas}RT$ for reactions that "
                "change the mole count of gas. Burning methane in "
                "excess oxygen, $\\ce{CH4(g) + 2O2(g) -> CO2(g) + "
                "2H2O(l)}$, takes three moles of gas down to one: "
                "$\\Delta n_{gas} = -2$, and at 298.15 K the work term "
                "is about $2 \\times 8.314 \\times 298.15 = 4958$ J, "
                "call it 5.0 kJ - against a reaction heat near 890 kJ. "
                "Half a percent. For reactions with no change in gas "
                "moles the gap all but vanishes. This course therefore "
                "reports $\\Delta H$ throughout and treats the "
                "distinction as a note of honesty rather than a "
                "working correction, which is the standard bargain of "
                "general chemistry."
            ),
        ),
        ReadingSection(
            id="sign-and-diagrams",
            heading="The sign convention, and reading an energy diagram",
            body=(
                "$\\Delta H$ is written from the system's point of "
                "view, like every signed quantity in this unit. A "
                "reaction that releases heat to its surroundings has "
                "negative $\\Delta H$ and is called exothermic; one "
                "that absorbs heat has positive $\\Delta H$ and is "
                "called endothermic. The pocket examples are the "
                "chemical hand warmer - iron oxidising, heat pouring "
                "out, $\\Delta H < 0$ - and the instant cold pack, "
                "ammonium nitrate dissolving and drinking heat in, "
                "$\\Delta H > 0$, the pouch going cold against a "
                "sprain.\n\n"
                "An energy diagram says the same thing graphically: "
                "reactants at one level, products at another, progress "
                "of reaction along the horizontal. Exothermic means "
                "the products sit BELOW the reactants - the system "
                "descended, and the drop left as heat. Endothermic "
                "means the products sit above, the climb paid for by "
                "the surroundings. The size of $\\Delta H$ is the "
                "vertical gap, nothing else; the shape of the path "
                "between, humps included, belongs to kinetics and "
                "says nothing about the heat.\n\n"
                "Two misreadings to retire early. First, a negative "
                "$\\Delta H$ is not 'less energy' or 'energy "
                "destroyed' - the released energy exists in full in "
                "the surroundings; the sign only records which "
                "direction it crossed the boundary. More negative "
                "means more heat OUT: methane's $-890.3$ kJ/mol "
                "beats hydrogen's $-285.8$ kJ/mol per mole burned, "
                "and the more negative number is the hotter fuel. "
                "Second, endothermic does not mean 'will not "
                "happen' - cold packs work, ice melts on a warm day, "
                "and both are endothermic. What decides spontaneity "
                "is a later unit's business; $\\Delta H$ alone does "
                "not settle it."
            ),
            important=(
                "The sign belongs to the system. Negative ΔH: heat "
                "left the reaction (exothermic, surroundings warm). "
                "Positive ΔH: heat entered the reaction (endothermic, "
                "surroundings cool). Never read the sign from the "
                "thermometer without that translation."
            ),
        ),
        ReadingSection(
            id="scaling",
            heading="Molar enthalpy, scaled to real amounts",
            body=(
                "Reaction enthalpies are tabulated per mole, and "
                "laboratory amounts arrive in grams, so nearly every "
                "enthalpy problem is the same three-step chain: grams "
                "to moles, moles to kilojoules, sign read at the "
                "end.\n\n"
                "### Worked: a camping stove's 5.00 g of methane\n\n"
                "Methane burns with $\\Delta H = -890.3$ kJ per mole "
                "of $\\ce{CH4}$ (a standard tabulated value). How much "
                "heat does 5.00 g deliver? Molar mass of $\\ce{CH4}$: "
                "$12.01 + 4 \\times 1.008 = 16.04$ g/mol.\n\n"
                "moles $= 5.00 / 16.04 = 0.3117$ mol\n\n"
                "$$q = 0.3117 \\times (-890.3) = -277.5 \\approx -278 "
                "\\text{ kJ}$$\n\n"
                "The system lost 278 kJ; the pot of water above the "
                "flame gained it. Against the first-half chapters' "
                "kettle - 81.6 kJ to take 250 g of water from 22 °C "
                "to boiling - a mere 5 g of fuel carries more than "
                "three kettles' worth, which is why a small canister "
                "lasts a weekend.\n\n"
                "### Per mole of WHAT, exactly\n\n"
                "The tabulated $-890.3$ is per mole of methane as the "
                "equation is written. Read against the other "
                "coefficients it is $-890.3$ kJ per 2 mol of "
                "$\\ce{O2}$, i.e. $-445.15$ kJ per mole of oxygen "
                "consumed, and the same per mole of water formed. "
                "None of those numbers disagree; they are one fact "
                "divided by different coefficients. Always name the "
                "species a per-mole figure is pinned to. The next "
                "chapter builds this reflex into a full method, "
                "treating the enthalpy as one more stoichiometric "
                "ratio alongside the mole ratios."
            ),
        ),
        ReadingSection(
            id="states-matter",
            heading="States matter: the two heats of burning methane",
            body=(
                "Tables list methane's combustion enthalpy as "
                "$-890.3$ kJ/mol - and also as $-802.3$ kJ/mol. "
                "Neither is a misprint. The first is for\n\n"
                "$$\\ce{CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)}$$\n\n"
                "and the second for the same reaction ending in "
                "$\\ce{H2O(g)}$. The difference is the water's state. "
                "Condensing steam to liquid releases the enthalpy of "
                "vaporisation, 44.0 kJ/mol at 25 °C, and the equation "
                "makes two waters: $-890.3 + 2 \\times 44.0 = "
                "-802.3$. The two table entries differ by exactly the "
                "condensation credit, as they must, because enthalpy "
                "is a state function and the two versions end in "
                "different states.\n\n"
                "The engineering world names the pair: the higher "
                "heating value of a fuel counts the condensation "
                "(liquid water product), the lower heating value "
                "does not, and a condensing gas boiler earns its "
                "efficiency by capturing what the flue of an older "
                "boiler throws away as vapour.\n\n"
                "For coursework the moral is mechanical: a "
                "thermochemical value is attached to an equation WITH "
                "its state labels, and quoting the number without the "
                "states is quoting half a fact. When a problem's "
                "equation says $\\ce{H2O(l)}$, use the liquid-water "
                "value; when it says $\\ce{H2O(g)}$, use the gas "
                "value; and when asked to convert between them, the "
                "bridge is the vaporisation enthalpy times the "
                "water coefficient. The same discipline applies to "
                "any species that commonly appears in two states - "
                "water above all, but also bromine, iodine and "
                "sulfur - and it is the first place this unit's habit "
                "of reading equations label-by-label pays off in "
                "kilojoules."
            ),
        ),
        ReadingSection(
            id="fuels-per-gram",
            heading="Reading a table of fuels",
            body=(
                "Combustion enthalpies per mole answer chemistry "
                "questions; per gram they answer engineering ones, "
                "and the conversion - divide by the molar mass - "
                "reshuffles the rankings instructively.\n\n"
                "From the table below: hydrogen's modest-looking "
                "$-285.8$ kJ/mol becomes $285.8 / 2.016 = 141.8$ kJ "
                "per gram, the highest of any chemical fuel, which "
                "is why rockets lift liquid hydrogen despite the "
                "bulk and bother of cryogenics. Methane manages "
                "$890.3 / 16.04 = 55.5$ kJ/g; propane $2219.9 / "
                "44.09 = 50.3$ kJ/g - the hydrocarbons cluster in "
                "the fifties because they are all, roughly, the same "
                "C-H chemistry per gram. Pure carbon (graphite, as "
                "in coal's best case) gives $393.5 / 12.01 = 32.8$ "
                "kJ/g: no hydrogen, less energy per gram. Ethanol "
                "brings up the rear at $1366.8 / 46.07 = 29.7$ kJ/g, "
                "and the reason is chemical: ethanol's oxygen atom "
                "is dead weight - already-burned material riding "
                "along in every gram - so a litre of ethanol-blended "
                "fuel simply carries fewer kilojoules than a litre "
                "of pure hydrocarbon.\n\n"
                "The pattern generalises into a rule of thumb worth "
                "keeping: energy per gram rises with hydrogen "
                "content and falls with oxygen content. It explains "
                "at a glance why fats (little oxygen) out-price "
                "carbohydrates (oxygen-rich) per gram in the body's "
                "own fuel ledger, roughly 38 kJ/g against 16 kJ/g, "
                "and why 'partially oxidised' is another way of "
                "saying 'partially spent'."
            ),
            table=Table(
                caption="Standard combustion enthalpies, per mole and "
                        "per gram",
                columns=("Fuel", "ΔH°c, kJ/mol", "M, g/mol", "kJ/g"),
                rows=(
                    ("hydrogen, H2(g)", "-285.8", "2.016", "141.8"),
                    ("methane, CH4(g)", "-890.3", "16.04", "55.5"),
                    ("propane, C3H8(g)", "-2219.9", "44.09", "50.3"),
                    ("carbon (graphite)", "-393.5", "12.01", "32.8"),
                    ("ethanol, C2H5OH(l)", "-1366.8", "46.07", "29.7"),
                ),
                source=(
                    "Molar combustion enthalpies (liquid water "
                    "product): CRC Handbook of Chemistry and Physics, "
                    "standard enthalpies of combustion. Molar masses "
                    "from IUPAC standard atomic weights; kJ/g computed "
                    "as the quotient."
                ),
                note=(
                    "Per-gram energy tracks hydrogen content up and "
                    "oxygen content down: hydrogen tops the table, "
                    "the oxygen-bearing ethanol closes it."
                ),
            ),
        ),
    ),
    key_takeaways=(
        "Enthalpy is heat at constant pressure: ΔH = qP, the quantity an "
        "open vessel exchanges.",
        "Negative ΔH is exothermic (heat out), positive is endothermic "
        "(heat in); the sign is the system's, not the thermometer's.",
        "ΔH and ΔU differ by expansion work, about Δn(gas)·RT - typically "
        "under one percent for combustion.",
        "Tabulated values are per mole of the equation as written; "
        "rescale per mole of any species by its coefficient.",
        "State labels are part of the value: methane burns at -890.3 "
        "kJ/mol to liquid water but -802.3 to steam, the gap being "
        "vaporisation at 44.0 kJ/mol per water.",
    ),
    exam_tips=(
        "'How much heat is released' wants a positive number of "
        "kilojoules; 'what is ΔH' wants the signed value. Read which "
        "question is being asked before finalising the sign.",
        "When two answer choices differ by roughly 44 kJ times the water "
        "coefficient, the item is testing H2O(l) versus H2O(g) - check "
        "the state label in the equation.",
    ),
))


# --------------------------------------------------------------------------
# 5.6 Thermochemical equations
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="GEN1.THERMOSTOICH",
    lead=(
        "A thermochemical equation is a balanced equation with its "
        "enthalpy change attached - and the attachment is load-bearing. "
        "The ΔH belongs to the exact coefficients and the exact state "
        "labels written, which turns the equation into a set of "
        "conversion factors linking moles of any species to kilojoules "
        "of heat. This chapter reads the notation precisely, rescales "
        "it legally, and runs the energy calculations that the rest of "
        "stoichiometry has been building toward - including the case "
        "where a limiting reactant decides the heat."
    ),
    sections=(
        ReadingSection(
            id="the-package",
            heading="The equation and its ΔH are one package",
            body=(
                "Write the combustion of hydrogen as a thermochemical "
                "equation:\n\n"
                "$$\\ce{2H2(g) + O2(g) -> 2H2O(l)} \\qquad \\Delta H = "
                "-571.6 \\text{ kJ}$$\n\n"
                "Every part of the line carries meaning. The $-571.6$ "
                "kJ is the heat released when exactly two moles of "
                "hydrogen and one of oxygen become exactly two moles "
                "of LIQUID water - the amounts the coefficients state "
                "and the states the labels state. Change any of it and "
                "the number changes with it: one mole of hydrogen "
                "releases half as much; water vapour as product "
                "releases less (the vaporisation enthalpy stays "
                "unbanked); running in reverse absorbs precisely what "
                "burning released.\n\n"
                "The phrase that keeps the bookkeeping straight is "
                "'per mole of reaction as written': $\\Delta H$ is the "
                "heat for one complete pass through the equation at "
                "its stated coefficients. That is why a thermochemical "
                "equation may carry fractional coefficients without "
                "apology - the balancing chapter flagged this - as "
                "in\n\n"
                "$$\\ce{H2(g) + 1/2 O2(g) -> H2O(l)} \\qquad \\Delta H "
                "= -285.8 \\text{ kJ}$$\n\n"
                "where the half-mole of oxygen is the price of "
                "quoting the heat per single mole of water formed. "
                "Fractions that would be cleared in a "
                "smallest-whole-number answer are deliberate here, "
                "because the equation's job has changed: it is no "
                "longer counting molecules, it is defining the "
                "amount of reaction one $\\Delta H$ belongs to.\n\n"
                "Where do the attached numbers come from? From the "
                "last chapter's instruments, packaged. The "
                "neutralisation measured in the calorimetry chapter "
                "- 56.9 kJ released per mole of water formed - "
                "becomes, written as a package, $\\ce{HCl(aq) + "
                "NaOH(aq) -> NaCl(aq) + H2O(l)}$ with $\\Delta H = "
                "-56.9$ kJ. Writing the equation IS the final step "
                "of reporting a calorimetry result: the coefficients "
                "declare the amount the number belongs to, the "
                "labels declare the states it was measured for, and "
                "a reader two continents away can rescale it to any "
                "amount without asking what the original beaker "
                "held."
            ),
        ),
        ReadingSection(
            id="conversion-factors",
            heading="ΔH as a conversion factor",
            body=(
                "Once the package is read correctly, the enthalpy "
                "joins the coefficients as one more ratio. From the "
                "hydrogen equation above, all of these are legitimate "
                "conversion factors:\n\n"
                "- $-571.6$ kJ per 2 mol $\\ce{H2}$, i.e. $-285.8$ kJ "
                "per mole of $\\ce{H2}$\n"
                "- $-571.6$ kJ per 1 mol $\\ce{O2}$\n"
                "- $-571.6$ kJ per 2 mol $\\ce{H2O}$ formed\n\n"
                "and an energy question becomes ordinary "
                "stoichiometry with kilojoules as the destination "
                "unit.\n\n"
                "### Worked: 5.00 g of hydrogen\n\n"
                "How much heat does burning 5.00 g of hydrogen "
                "release? Grams to moles with $M(\\ce{H2}) = 2.016$ "
                "g/mol:\n\n"
                "$$5.00 / 2.016 = 2.480 \\text{ mol H}_2$$\n\n"
                "Moles to kilojoules with the per-mole factor:\n\n"
                "$$q = 2.480 \\times (-285.8) = -708.8 \\approx -709 "
                "\\text{ kJ}$$\n\n"
                "About 709 kJ released - from five grams. The chain "
                "is the familiar mass-to-mole-to-target ladder of the "
                "stoichiometry unit with energy as the final rung, "
                "and every habit transfers: name the species each "
                "number belongs to, carry units through the "
                "arithmetic, and let the sign ride along untouched "
                "until the sentence at the end interprets it."
            ),
        ),
        ReadingSection(
            id="rescaling",
            heading="Rescaling: multiply, reverse, combine",
            body=(
                "Two operations transform a thermochemical equation, "
                "and each drags the enthalpy with it by a fixed "
                "rule.\n\n"
                "**Multiplying through by a factor multiplies ΔH by "
                "the same factor.** Enthalpy is extensive: twice the "
                "reaction, twice the heat. Halving the hydrogen "
                "equation halved its $-571.6$ to $-285.8$; tripling "
                "it would give $-1714.8$.\n\n"
                "**Reversing the equation flips the sign of ΔH.** "
                "Enthalpy is a state function: the return journey "
                "undoes the outbound one exactly. Electrolysis of "
                "water,\n\n"
                "$$\\ce{H2O(l) -> H2(g) + 1/2 O2(g)} \\qquad \\Delta H "
                "= +285.8 \\text{ kJ}$$\n\n"
                "costs precisely what burning the hydrogen back "
                "returns - which is why hydrogen is an energy "
                "CARRIER rather than an energy source: every "
                "kilojoule a fuel cell delivers was invested at the "
                "electrolyser first, and no bookkeeping can make the "
                "round trip profitable.\n\n"
                "The table collects the family. Note what stays "
                "fixed: the states. Rescaling coefficients never "
                "touches the labels, and a version of the equation "
                "with $\\ce{H2O(g)}$ is a DIFFERENT thermochemical "
                "equation with a different $\\Delta H$, reachable "
                "only by adding the vaporisation step explicitly - "
                "which is the next chapter's machinery arriving a "
                "page early."
            ),
            table=Table(
                caption="One reaction, legally rescaled",
                columns=("Equation", "Operation", "ΔH, kJ"),
                rows=(
                    ("2H2(g) + O2(g) -> 2H2O(l)", "as written",
                     "-571.6"),
                    ("H2(g) + 1/2 O2(g) -> H2O(l)", "halved",
                     "-285.8"),
                    ("6H2(g) + 3O2(g) -> 6H2O(l)", "tripled",
                     "-1714.8"),
                    ("2H2O(l) -> 2H2(g) + O2(g)", "reversed",
                     "+571.6"),
                    ("H2O(l) -> H2(g) + 1/2 O2(g)",
                     "reversed and halved", "+285.8"),
                ),
                source=(
                    "Base value -571.6 kJ is twice the standard "
                    "enthalpy of formation of liquid water, -285.8 "
                    "kJ/mol (OpenStax Chemistry 2e, Appendix G); the "
                    "other rows are computed by the stated "
                    "operations."
                ),
                note=(
                    "Scaling multiplies ΔH, reversing negates it, and "
                    "the state labels never change under either "
                    "operation."
                ),
            ),
        ),
        ReadingSection(
            id="worked-planning",
            heading="Worked: sizing the fuel for a job",
            body=(
                "The practical shape of this topic is planning: how "
                "much fuel buys how much heating? Chain the "
                "calorimetry equation to the thermochemical one and "
                "the answer falls out.\n\n"
                "**Task:** bring 1.00 kg of water from 20.0 °C to "
                "boiling (100.0 °C) with a methane burner, assuming "
                "every joule of combustion heat lands in the water.\n\n"
                "**Step 1 - price the job.** The water needs\n\n"
                "$$q = 1000 \\times 4.184 \\times 80.0 = 334{,}720 "
                "\\text{ J} = 334.7 \\text{ kJ}$$\n\n"
                "**Step 2 - convert to moles of fuel.** Methane "
                "delivers 890.3 kJ per mole burned, so\n\n"
                "$$334.7 / 890.3 = 0.376 \\text{ mol CH}_4$$\n\n"
                "**Step 3 - convert to grams.**\n\n"
                "$$0.376 \\times 16.04 = 6.03 \\text{ g}$$\n\n"
                "Six grams of methane boils a litre of water - in "
                "the idealised world of the assumption. A real "
                "burner loses heat to the air, the kettle and the "
                "room, so the real figure is larger by the "
                "reciprocal of the transfer efficiency; at 50 "
                "percent efficiency, about 12 g. The idealisation "
                "is worth stating rather than hiding because it "
                "marks exactly where the chemistry ends and the "
                "engineering begins: the 890.3 is nature's number, "
                "the efficiency is the appliance's.\n\n"
                "The same three steps run in any direction. Given "
                "the fuel and asked for the temperature rise, run "
                "them backward; given a target heat and a choice of "
                "fuels, run step 2 with each fuel's molar enthalpy "
                "and compare. The chain is always calorimetry on "
                "one end, the thermochemical equation on the other, "
                "and moles in the middle."
            ),
        ),
        ReadingSection(
            id="limiting-energy",
            heading="When a limiting reactant decides the heat",
            body=(
                "Mix arbitrary amounts of two reactants and the "
                "heat, like every other product of a reaction, is "
                "governed by whichever reactant runs out first. The "
                "limiting-reactant chapter's method extends by one "
                "line: find the limiter, then convert ITS moles to "
                "kilojoules.\n\n"
                "### Worked\n\n"
                "Ignite 10.0 g of hydrogen with 32.0 g of oxygen. "
                "How much heat is released?\n\n"
                "Moles delivered: $\\ce{H2}$: $10.0 / 2.016 = 4.96$ "
                "mol. $\\ce{O2}$: $32.0 / 32.00 = 1.00$ mol.\n\n"
                "The equation demands 2 mol $\\ce{H2}$ per mol "
                "$\\ce{O2}$; servicing 1.00 mol of oxygen takes only "
                "2.00 mol of hydrogen, and 4.96 mol are on hand. "
                "Oxygen is the limiting reactant, hydrogen is in "
                "excess, and the heat is priced from the oxygen:\n\n"
                "$$q = 1.00 \\text{ mol O}_2 \\times \\frac{-571.6 "
                "\\text{ kJ}}{1 \\text{ mol O}_2} = -572 \\text{ kJ}$$\n\n"
                "Not from the hydrogen: converting all 4.96 mol of "
                "hydrogen at $-285.8$ kJ/mol would predict $-1418$ "
                "kJ, wrong by the factor of the excess, because 2.96 "
                "mol of hydrogen never react - there is no oxygen "
                "left for them. Energy is a product; products come "
                "from the limiting reactant; the extra hydrogen "
                "leaves the vessel unburned, carrying its enthalpy "
                "with it.\n\n"
                "The error this example inoculates against is "
                "grabbing whichever mass the problem mentions first "
                "and converting it to kilojoules without asking "
                "whether it all reacts. On any problem giving TWO "
                "amounts, the limiting-reactant check comes before "
                "the energy arithmetic, exactly as it came before "
                "the yield arithmetic in the stoichiometry unit."
            ),
            important=(
                "Heat is a product. When two reactant amounts are "
                "given, the limiting reactant sets the heat - "
                "convert its moles, never the excess reactant's."
            ),
        ),
    ),
    key_takeaways=(
        "A thermochemical equation binds ΔH to exact coefficients and "
        "state labels: change either and the number changes.",
        "ΔH reads as a conversion factor: so many kJ per the "
        "coefficient's moles of each species.",
        "Multiplying an equation multiplies ΔH; reversing it flips the "
        "sign; states never change under rescaling.",
        "Fractional coefficients are standard here - they pin ΔH to one "
        "mole of a chosen species.",
        "With two reactant amounts given, the limiting reactant decides "
        "the heat.",
    ),
    exam_tips=(
        "The classic trap divides ΔH by the wrong coefficient: -571.6 "
        "kJ is -285.8 per mole of H2 but the full -571.6 per mole of "
        "O2. Pin the value to the equation, then divide.",
        "Fuel-sizing items chain q = mcΔT to the molar enthalpy; work "
        "the water side and the fuel side separately and meet at "
        "kilojoules.",
    ),
))


# --------------------------------------------------------------------------
# 5.7 Hess's law
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="GEN1.HESS",
    lead=(
        "Some reaction heats cannot be measured because the reaction "
        "refuses to run alone: burn carbon short of oxygen hoping for "
        "pure CO and the flask delivers a mixture of CO and CO2 every "
        "time. Hess's law is the escape: because enthalpy is a state "
        "function, the ΔH between reactants and products is the same "
        "along every route - so build a route out of reactions whose "
        "enthalpies ARE measurable, add them up, and the sum is the "
        "answer nature declined to hand over directly. This chapter "
        "states the law, drills the two manipulation rules, and works "
        "the classic cases."
    ),
    sections=(
        ReadingSection(
            id="state-function-logic",
            heading="Why the law is true before it is useful",
            body=(
                "Hess's law is not a new physical principle; it is "
                "the state-function property of enthalpy, dressed for "
                "work. The first-law chapter established the idea "
                "with altitude: the elevation gained between trailhead "
                "and summit is fixed by the two endpoints, and every "
                "route - the steep scramble, the winding switchbacks - "
                "gains identically. Enthalpy is the chemical "
                "elevation. A system that starts as given reactants "
                "and ends as given products undergoes one fixed "
                "$\\Delta H$, however many intermediate compounds the "
                "route visits on the way.\n\n"
                "The consequence with teeth: an IMAGINED route is as "
                "good as a real one. Whether carbon actually burns "
                "first to CO2 which is then partly reduced, or "
                "proceeds by any mechanism at all, is irrelevant to "
                "the sum - the endpoints alone fix it. Chemistry gets "
                "to invent a path through reactions chosen purely "
                "because their enthalpies sit in a table, and the "
                "invented path's total equals the direct path's "
                "$\\Delta H$ exactly.\n\n"
                "Contrast this with what may NOT be summed this way: "
                "rates. The kinetics unit will insist that reaction "
                "speed depends entirely on the actual path - that is "
                "what catalysts change - while $\\Delta H$ depends on "
                "no path at all. A catalyst leaves every enthalpy in "
                "this unit untouched. Keeping the two families "
                "straight - state functions summable by Hess, path "
                "properties not - is half of thermodynamic literacy, "
                "and the exam items that mix a catalyst into a "
                "Hess's-law question are testing precisely that "
                "boundary."
            ),
        ),
        ReadingSection(
            id="the-two-rules",
            heading="The two manipulation rules",
            body=(
                "Building a route means editing known equations until "
                "they sum to the target, and the editing obeys the "
                "two rules the thermochemical-equations chapter "
                "established:\n\n"
                "- **Reverse an equation: negate its ΔH.** The return "
                "journey undoes the outbound one, joule for joule.\n"
                "- **Multiply an equation by a factor: multiply its "
                "ΔH by the same factor.** Enthalpy is extensive.\n\n"
                "Then add the edited equations: species appearing on "
                "both sides of the summed ledger cancel, and the "
                "enthalpies add - signs included.\n\n"
                "The working method, stated as a checklist because it "
                "is one: locate each target species in the known "
                "equations; orient each known equation so that "
                "species sits on the side the target needs; scale it "
                "so the coefficient matches; add everything and "
                "confirm the intermediates cancel; add the enthalpies "
                "the same way. The single discipline that prevents "
                "nearly every Hess error is editing the NUMBER at the "
                "same instant as the equation - reverse the arrow, "
                "flip the sign, in one motion. An equation edited "
                "with its enthalpy left behind is wrong in a way "
                "nothing downstream will catch, and the standard "
                "wrong answers on Hess items are manufactured from "
                "exactly that slip: the magnitudes all correct, one "
                "sign stale."
            ),
            important=(
                "Edit the equation and its ΔH in the same stroke. "
                "Reversed equation, flipped sign; doubled equation, "
                "doubled ΔH - never one without the other."
            ),
        ),
        ReadingSection(
            id="worked-co",
            heading="Worked: the unmeasurable burning of carbon to CO",
            body=(
                "**Target:** $\\ce{2C(s) + O2(g) -> 2CO(g)}$, the "
                "reaction a flask will not run cleanly.\n\n"
                "**Known** (both cleanly measurable in a "
                "calorimeter):\n\n"
                "1. $\\ce{C(s) + O2(g) -> CO2(g)}$, $\\Delta H_1 = "
                "-393.5$ kJ - carbon burns completely in excess "
                "oxygen.\n"
                "2. $\\ce{2CO(g) + O2(g) -> 2CO2(g)}$, $\\Delta H_2 = "
                "-566.0$ kJ - CO, easily prepared, burns "
                "completely.\n\n"
                "**Build the route.** The target needs 2 C on the "
                "left: double equation 1, and its enthalpy with it, "
                "giving $\\ce{2C + 2O2 -> 2CO2}$ at $2 \\times "
                "(-393.5) = -787.0$ kJ. The target needs 2 CO on the "
                "RIGHT: reverse equation 2, flipping its sign, giving "
                "$\\ce{2CO2 -> 2CO + O2}$ at $+566.0$ kJ.\n\n"
                "**Add.** The $\\ce{2CO2}$ made by the first line is "
                "consumed by the second and cancels. Oxygen: 2 mol on "
                "the left, 1 mol on the right, net 1 mol left. What "
                "survives is the target, $\\ce{2C + O2 -> 2CO}$, "
                "and\n\n"
                "$$\\Delta H = -787.0 + 566.0 = -221.0 \\text{ kJ}$$\n\n"
                "Halve for the per-mole form: $\\ce{C(s) + 1/2 O2(g) "
                "-> CO(g)}$ at $-110.5$ kJ/mol - which is, not "
                "coincidentally, the tabulated formation enthalpy of "
                "CO. The physical reading deserves a sentence: "
                "burning carbon halfway to CO releases $-110.5$ of "
                "the $-393.5$ kJ the full burn releases, and the "
                "remaining $-283.0$ kJ is still in the CO waiting to "
                "be released - which is why carbon monoxide is itself "
                "a fuel, and why furnace flues that leak it waste "
                "energy as well as endangering the household."
            ),
            table=Table(
                caption="The CO derivation as a ledger",
                columns=("Step", "Equation", "ΔH, kJ"),
                rows=(
                    ("eq. 1 doubled", "2C + 2O2 -> 2CO2", "-787.0"),
                    ("eq. 2 reversed", "2CO2 -> 2CO + O2", "+566.0"),
                    ("sum (target)", "2C + O2 -> 2CO", "-221.0"),
                ),
                source=(
                    "Measured values: C + O2 -> CO2 at -393.5 kJ and "
                    "2CO + O2 -> 2CO2 at -566.0 kJ (CRC Handbook, "
                    "standard enthalpies of combustion); manipulations "
                    "computed as stated."
                ),
                note=(
                    "The CO2 intermediate appears once on each side "
                    "and cancels - the signature of a correctly built "
                    "route."
                ),
            ),
        ),
        ReadingSection(
            id="worked-methane",
            heading="Worked: a formation enthalpy from three combustions",
            body=(
                "**Target:** $\\ce{C(s) + 2H2(g) -> CH4(g)}$ - the "
                "formation of methane from its elements, another "
                "reaction no flask will run as written.\n\n"
                "**Known combustion enthalpies:** carbon, $-393.5$ "
                "kJ/mol; hydrogen (to liquid water), $-285.8$ kJ/mol; "
                "methane (to CO2 and liquid water), $-890.3$ "
                "kJ/mol.\n\n"
                "**Build.** Keep carbon's combustion as written "
                "($-393.5$). Double hydrogen's, since the target "
                "consumes 2 mol: $\\ce{2H2 + O2 -> 2H2O(l)}$ at "
                "$2 \\times (-285.8) = -571.6$ kJ. Reverse methane's, "
                "since the target PRODUCES methane: $\\ce{CO2 + 2H2O "
                "-> CH4 + 2O2}$ at $+890.3$ kJ.\n\n"
                "**Add.** The CO2 and the two waters cancel; count "
                "the oxygens and they balance; what survives is the "
                "target, with\n\n"
                "$$\\Delta H = -393.5 - 571.6 + 890.3 = -74.8 "
                "\\text{ kJ/mol}$$\n\n"
                "Reference tables list methane's formation enthalpy "
                "between $-74.6$ and $-74.9$ kJ/mol depending on the "
                "compilation, and our $-74.8$ sits inside that band. "
                "The spread is worth a comment rather than a shrug: "
                "the answer is a small difference of large numbers - "
                "three values near 400 to 900 kJ combining to leave "
                "75 - so the last-digit rounding of each input is "
                "amplified in the result. That is not Hess's law "
                "wobbling; the law is exact. It is arithmetic "
                "honesty about inputs, the same lesson the "
                "conservation-of-mass chapter taught with its 0.02 g "
                "of rounding residue, returning at kilojoule "
                "scale.\n\n"
                "This example is also a preview: one reaction's "
                "enthalpy from a standard set of combustions is "
                "precisely the trick the next chapter industrialises "
                "with formation enthalpies, where the routes are "
                "prebuilt and the bookkeeping collapses to one "
                "subtraction."
            ),
        ),
        ReadingSection(
            id="what-it-buys",
            heading="What the law buys",
            body=(
                "Hess's law converts the enthalpy table from a list "
                "of measured reactions into a generating system: any "
                "reaction expressible as a combination of tabulated "
                "ones has a computable $\\Delta H$, measured or "
                "not.\n\n"
                "The showpiece is graphite and diamond. The "
                "conversion $\\ce{C(graphite) -> C(diamond)}$ cannot "
                "be run in any calorimeter - at laboratory conditions "
                "it does not proceed in observable time in either "
                "direction. But both forms of carbon BURN, and the "
                "burns are measurable: graphite's combustion releases "
                "$-393.5$ kJ/mol, diamond's $-395.4$ kJ/mol. Burn a "
                "mole of graphite, then imagine un-burning the CO2 "
                "back to diamond: $-393.5 + 395.4 = +1.9$ kJ/mol for "
                "graphite $\\to$ diamond. Two flame measurements "
                "price a transformation that takes gigapascals and "
                "geological patience to perform - and the small "
                "positive sign settles an old question: graphite, "
                "not diamond, is carbon's stabler form at ordinary "
                "conditions, and every diamond is, "
                "thermodynamically speaking, very slowly on its way "
                "to pencil lead.\n\n"
                "The same leverage runs through practical chemistry. "
                "Enthalpies of reactions too slow, too violent, or "
                "too entangled with side reactions to calorimeter "
                "cleanly - hydrogenations, isomerisations, lattice "
                "steps in Born-Haber cycles - are routinely built "
                "from combustion data precisely because combustion "
                "is the one reaction almost anything organic will do "
                "completely and measurably. And when the next "
                "chapter's formation-enthalpy shortcut arrives, "
                "recognise it for what it is: Hess's law run through "
                "a standardised warehouse of routes, every one of "
                "them passing through the elements."
            ),
        ),
    ),
    key_takeaways=(
        "Hess's law is the state-function property of enthalpy: ΔH "
        "depends on endpoints, so any route - real or imagined - gives "
        "the same total.",
        "Reverse an equation, negate its ΔH; scale an equation, scale "
        "its ΔH; add equations, add their ΔH values.",
        "Edit the number in the same stroke as the equation - a stale "
        "sign is the standard Hess error.",
        "Classic results: C + 1/2 O2 -> CO at -110.5 kJ/mol; graphite "
        "-> diamond at +1.9 kJ/mol from two combustions.",
        "Small differences of large numbers inherit amplified rounding "
        "- expect last-digit spread against tables.",
    ),
    exam_tips=(
        "Before any arithmetic, orient each given equation so its key "
        "species sits on the side the target needs - most wrong "
        "answers are one unreversed equation.",
        "Check the finished sum by cancelling intermediates "
        "explicitly; if something fails to cancel, a scale factor is "
        "wrong.",
    ),
))


# --------------------------------------------------------------------------
# 5.8 Standard enthalpies of formation
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="GEN1.FORMATION",
    lead=(
        "Hess's law lets any reaction's enthalpy be assembled from "
        "known ones - but assembling by hand, reaction by reaction, "
        "does not scale. Chemistry's solution is a standard warehouse: "
        "tabulate, for every compound, the enthalpy of forming one "
        "mole of it from its elements in their standard states. With "
        "that one table, every reaction enthalpy collapses to a single "
        "subtraction - products minus reactants - because every "
        "conceivable route can be forced through the elements. This "
        "chapter defines the standard quantity precisely, derives the "
        "shortcut, and works it on real equations."
    ),
    sections=(
        ReadingSection(
            id="the-definition",
            heading="The definition, clause by clause",
            body=(
                "The standard enthalpy of formation of a substance, "
                "written $\\Delta H_f^\\circ$, is the enthalpy change "
                "when ONE MOLE of the substance forms from its "
                "ELEMENTS in their STANDARD STATES. Each capitalised "
                "clause earns its keep.\n\n"
                "One mole: the value is per mole of the compound "
                "formed, so formation equations freely use fractional "
                "coefficients on the elements - "
                "$\\ce{H2(g) + 1/2 O2(g) -> H2O(l)}$, $\\Delta "
                "H_f^\\circ = -285.8$ kJ/mol - exactly the deliberate "
                "fractions the thermochemical-equations chapter "
                "defended.\n\n"
                "From its elements: the reactants are elements only, "
                "not other compounds. The formation equation of CO2 "
                "starts from graphite and oxygen, not from CO.\n\n"
                "Standard states: each element as it exists at 1 bar "
                "and (conventionally) 25 °C - oxygen as "
                "$\\ce{O2(g)}$, hydrogen as $\\ce{H2(g)}$, bromine as "
                "LIQUID $\\ce{Br2}$, carbon as graphite rather than "
                "diamond. Where an element has several forms, the "
                "table picks one and consistency does the rest.\n\n"
                "The definition forces one elegant consequence: an "
                "element already in its standard state has $\\Delta "
                "H_f^\\circ = 0$ exactly, because 'forming' it from "
                "itself is no change at all. The zeros are "
                "definitional anchors, not measurements - the table's "
                "sea level. Like sea level, the choice is a "
                "convention that cancels out of every difference, "
                "which is all the next section computes."
            ),
        ),
        ReadingSection(
            id="the-shortcut",
            heading="Products minus reactants, and why it works",
            body=(
                "With formation enthalpies in hand, any reaction's "
                "standard enthalpy is one line:\n\n"
                "$$\\Delta H_{rxn}^\\circ = \\sum n\\,\\Delta "
                "H_f^\\circ(\\text{products}) - \\sum n\\,\\Delta "
                "H_f^\\circ(\\text{reactants})$$\n\n"
                "with each value weighted by its coefficient $n$.\n\n"
                "The formula is Hess's law with a standardised "
                "route. Imagine running the reaction through the "
                "elements: first dismantle every reactant into "
                "elements in their standard states - that is each "
                "reactant's formation reaction REVERSED, costing "
                "$-\\Delta H_f^\\circ$ apiece - then assemble every "
                "product from those elements, at $+\\Delta "
                "H_f^\\circ$ apiece. The elements are the universal "
                "middle station: every substance can reach them and "
                "be built from them, which is what makes one table "
                "serve all reactions. Add the two legs and the "
                "elements cancel, leaving products-sum minus "
                "reactants-sum.\n\n"
                "No real reaction proceeds by tearing molecules to "
                "elements, and none needs to - the state-function "
                "property makes the imagined route's total equal the "
                "real one's. The subtraction's direction is the part "
                "to overlearn: PRODUCTS minus REACTANTS, formed "
                "minus consumed. Reversed, every answer changes "
                "sign, exothermic becomes endothermic, and the "
                "error survives every later check because the "
                "magnitude is perfect. Say the direction aloud "
                "before substituting; it is cheaper than any audit "
                "afterward."
            ),
            important=(
                "Products minus reactants - always that order. And "
                "elements in their standard states enter the sums as "
                "exact zeros: include them as zeros rather than "
                "leaving them out, so the bookkeeping stays visible."
            ),
        ),
        ReadingSection(
            id="worked-methane",
            heading="Worked: methane's combustion from four lookups",
            body=(
                "**Target:** $\\ce{CH4(g) + 2O2(g) -> CO2(g) + "
                "2H2O(l)}$.\n\n"
                "**Lookups** (kJ/mol, from the table below): "
                "$\\ce{CH4(g)}$ $-74.6$; $\\ce{O2(g)}$ 0, an element "
                "in its standard state; $\\ce{CO2(g)}$ $-393.5$; "
                "$\\ce{H2O(l)}$ $-285.8$.\n\n"
                "**Products**, coefficient-weighted:\n\n"
                "$$1 \\times (-393.5) + 2 \\times (-285.8) = -393.5 - "
                "571.6 = -965.1 \\text{ kJ}$$\n\n"
                "**Reactants:**\n\n"
                "$$1 \\times (-74.6) + 2 \\times 0 = -74.6 "
                "\\text{ kJ}$$\n\n"
                "**Subtract, products minus reactants:**\n\n"
                "$$\\Delta H_{rxn}^\\circ = -965.1 - (-74.6) = -890.5 "
                "\\text{ kJ}$$\n\n"
                "Strongly exothermic, as burning natural gas had "
                "better be. Note the double negative handled "
                "formally: subtracting methane's $-74.6$ ADDS 74.6, "
                "because the route first spends energy climbing from "
                "methane up to its elements before descending to the "
                "products. Mishandling that step is this topic's "
                "most common arithmetic slip.\n\n"
                "One more digit of honesty: direct calorimetry gives "
                "$-890.3$ kJ/mol, our table-built answer $-890.5$. "
                "Both are right to their inputs' precision - the "
                "formation values are rounded to a tenth, and the "
                "0.2 kJ gap is that rounding surfacing, the same "
                "residue the Hess chapter anatomised. Agreement to "
                "one part in four thousand between a flame "
                "measurement and four table lookups is the method "
                "working, not failing."
            ),
        ),
        ReadingSection(
            id="worked-ostwald",
            heading="Worked: an industrial equation with four compounds",
            body=(
                "The shortcut earns its keep on equations Hess "
                "routes would make tedious. Take the first step of "
                "the Ostwald process, the industrial oxidation of "
                "ammonia on the way to nitric acid - and thence to "
                "fertiliser - run over a platinum catalyst:\n\n"
                "$$\\ce{4NH3(g) + 5O2(g) -> 4NO(g) + 6H2O(g)}$$\n\n"
                "Four different substances, three of them with "
                "nonzero formation enthalpies, one product with a "
                "POSITIVE one: $\\ce{NO(g)}$ at $+90.25$ kJ/mol "
                "costs energy to form from its elements. Note also "
                "the water is VAPOUR here - at the process's "
                "operating temperatures no liquid survives - so the "
                "$-241.8$ gas value applies, not $-285.8$.\n\n"
                "**Products:** $4 \\times 90.25 + 6 \\times (-241.8) "
                "= 361.0 - 1450.8 = -1089.8$ kJ.\n\n"
                "**Reactants:** $4 \\times (-45.9) + 5 \\times 0 = "
                "-183.6$ kJ.\n\n"
                "**Subtract:**\n\n"
                "$$\\Delta H_{rxn}^\\circ = -1089.8 - (-183.6) = "
                "-906.2 \\text{ kJ}$$\n\n"
                "Nine hundred kilojoules out per four moles of "
                "ammonia - the reaction is fiercely exothermic, "
                "which is why an Ostwald converter, once lit, keeps "
                "itself hot. The uphill formation of NO is paid for "
                "several times over by the downhill formation of "
                "water; reading the ledger term by term shows WHERE "
                "the heat comes from, which is more understanding "
                "than the summed number alone carries. The catalyst, "
                "as the Hess chapter insisted, appears nowhere in "
                "the arithmetic: platinum changes the speed, never "
                "the $\\Delta H$."
            ),
        ),
        ReadingSection(
            id="reading-the-table",
            heading="Reading the table like a chemist",
            body=(
                "A formation-enthalpy table is more than an answer "
                "warehouse; the signs themselves talk. A NEGATIVE "
                "$\\Delta H_f^\\circ$ means the compound sits "
                "enthalpically downhill from its elements - forming "
                "it released energy. Most stable everyday compounds "
                "are of this kind: water at $-285.8$, CO2 at "
                "$-393.5$, ammonia at $-45.9$. A POSITIVE value "
                "marks a compound uphill from its elements, holding "
                "banked energy: NO at $+90.25$, and acetylene - the "
                "welder's fuel $\\ce{C2H2}$ - at $+227.4$ kJ/mol.\n\n"
                "The banked energy is real and collectable. Compute "
                "acetylene's combustion, $\\ce{C2H2(g) + 5/2 O2(g) "
                "-> 2CO2(g) + H2O(l)}$: products $2 \\times (-393.5) "
                "+ (-285.8) = -1072.8$; reactants $+227.4 + 0$; "
                "difference $-1072.8 - 227.4 = -1300.2$ kJ/mol. Per "
                "carbon atom that beats methane handily, and the "
                "surplus is exactly the $+227.4$ the molecule was "
                "storing - the oxyacetylene torch burns the fuel AND "
                "cashes its formation debt, which is why the flame "
                "runs hot enough to cut steel.\n\n"
                "One caution keeps the reading honest: formation "
                "enthalpy measures thermodynamic height, not "
                "fragility. Uphill compounds can be kinetically "
                "docile (acetylene ships in cylinders) and downhill "
                "ones can be reactive. And the heights are "
                "temperature-and-pressure-standardised bookkeeping, "
                "not verdicts - diamond's $+1.9$ kJ/mol above "
                "graphite has not emptied any jewellery boxes. "
                "Stability against WHAT, and how FAST, are questions "
                "for equilibrium and kinetics; the table answers "
                "only 'how high above the elements', and answers it "
                "superbly.\n\n"
                "A last, quietly useful reading: physical changes are "
                "reactions to this table too. Subtract the liquid "
                "water row from the gas water row and out falls "
                "$-241.8 - (-285.8) = +44.0$ kJ/mol - the enthalpy "
                "of vaporisation at 25 °C, recovered from two "
                "formation entries without any separate table of "
                "phase-change data. The same subtraction works for "
                "any substance listed in two states, and it is a "
                "quick self-consistency check on any table you are "
                "handed: paired rows whose difference does not match "
                "the known phase-change enthalpy are telling you the "
                "compilation mixed its sources."
            ),
            table=Table(
                caption="Standard enthalpies of formation at 25 °C",
                columns=("Substance", "ΔH°f, kJ/mol"),
                rows=(
                    ("CH4(g)", "-74.6"),
                    ("CO2(g)", "-393.5"),
                    ("CO(g)", "-110.5"),
                    ("H2O(l)", "-285.8"),
                    ("H2O(g)", "-241.8"),
                    ("NH3(g)", "-45.9"),
                    ("NO(g)", "+90.25"),
                    ("C2H2(g)", "+227.4"),
                    ("O2(g), N2(g), H2(g), C(graphite)", "0 (by "
                     "definition)"),
                ),
                source=(
                    "OpenStax Chemistry 2e, Appendix G (Standard "
                    "Thermodynamic Properties), the same compilation "
                    "the unit's lessons cite."
                ),
                note=(
                    "The liquid/gas pair for water differs by the "
                    "44.0 kJ/mol enthalpy of vaporisation - the "
                    "state label selects the row."
                ),
            ),
        ),
    ),
    key_takeaways=(
        "ΔH°f: one mole of compound formed from elements in their "
        "standard states; elements in those states are exactly zero.",
        "ΔH°rxn = Σn ΔH°f(products) - Σn ΔH°f(reactants) - Hess's law "
        "through the universal middle station of the elements.",
        "Weight every value by its coefficient, enter elements as "
        "zeros, and handle the double negatives formally.",
        "State labels select the table row: H2O(l) is -285.8, H2O(g) "
        "is -241.8.",
        "Positive formation enthalpies mark energy-banked compounds "
        "(NO, acetylene); the sign talks even before any arithmetic.",
    ),
    exam_tips=(
        "The two planted errors: subtracting reactants-minus-products, "
        "and forgetting a coefficient weight. Write the two sums on "
        "separate lines before subtracting.",
        "A 'which value is zero' item wants the element in its "
        "standard state - O2(g) yes, O(g) and O3(g) no, Br2(l) yes, "
        "Br2(g) no.",
    ),
))


# --------------------------------------------------------------------------
# 5.9 Bond enthalpies
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="GEN1.BONDENTHALPY",
    lead=(
        "Strip thermochemistry to its molecular bones and every "
        "reaction heat is one story: bonds broke, which cost energy, "
        "and bonds formed, which released it, and the difference left "
        "as heat. Bond enthalpies make that story quantitative enough "
        "to estimate a gas-phase reaction's ΔH from a one-page table - "
        "quickly, approximately, and with instructive failure modes. "
        "This chapter states the method, fixes the sign logic that "
        "students most often invert, and calibrates how much to trust "
        "the answers by checking them against exact values."
    ),
    sections=(
        ReadingSection(
            id="what-a-bond-enthalpy-is",
            heading="What a bond enthalpy is",
            body=(
                "The bond enthalpy $D$ of a bond is the enthalpy "
                "required to break one mole of that bond "
                "homolytically in the GAS phase - to pull the two "
                "atoms apart with each keeping its share of the "
                "electrons. Breaking is always uphill: separating "
                "bonded atoms fights the attraction that made the "
                "bond, so every bond enthalpy is positive. There are "
                "no negative entries in the table, and a supposed "
                "bond that released energy on breaking would not be "
                "a bond.\n\n"
                "For a diatomic molecule the number is exact and "
                "measurable: $\\ce{H2}$'s bond costs 436 kJ/mol to "
                "break, $\\ce{Cl2}$'s 242, and each figure belongs "
                "to one specific molecule. For polyatomics the "
                "notion blurs honestly: the O-H bonds of water do "
                "not cost the same as the O-H of ethanol, and even "
                "water's two O-H bonds differ from each other once "
                "the first is broken. Tables therefore list AVERAGE "
                "bond enthalpies - an O-H value averaged over many "
                "molecules - and every calculation built on them "
                "inherits that averaging as its principal error "
                "bar.\n\n"
                "Two boundaries of the definition earn emphasis "
                "now, because both become traps later. Gas phase: "
                "the numbers describe isolated molecules, so any "
                "reactant or product that is really a liquid or "
                "solid adds condensed-phase energetics the table "
                "knows nothing about. And enthalpy of BREAKING: the "
                "table's numbers are costs, not payouts; forming a "
                "bond releases the same magnitude with the opposite "
                "sign. The entire sign discipline of the method "
                "hangs on that sentence."
            ),
        ),
        ReadingSection(
            id="the-rule",
            heading="Broken minus formed",
            body=(
                "Estimate a gas-phase reaction's enthalpy by "
                "auditing its bonds:\n\n"
                "$$\\Delta H \\approx \\sum D(\\text{bonds broken}) - "
                "\\sum D(\\text{bonds formed})$$\n\n"
                "Breaking the reactants' bonds costs the first sum, "
                "paid IN; forming the products' bonds releases the "
                "second, paid OUT; the difference is what the "
                "surroundings see. If the new bonds are collectively "
                "stronger than the old, the second sum wins and "
                "$\\Delta H$ comes out negative - exothermic, which "
                "is the molecular meaning of that word: reactions "
                "release heat by trading weaker bonds for stronger "
                "ones.\n\n"
                "Watch the sign structure against the formation-"
                "enthalpy rule, because the two run OPPOSITE ways "
                "and swapping them is this topic's classic error. "
                "Formation arithmetic is products minus reactants. "
                "Bond arithmetic is broken minus formed - and the "
                "broken bonds belong to the REACTANTS. Both rules "
                "are correct; they subtract different quantities in "
                "different directions. The way to keep them straight "
                "is not memory but meaning: bond values are COSTS of "
                "breaking, so reactants (where breaking happens) "
                "enter positively; formation values are HEIGHTS of "
                "compounds, so products (where you end) enter "
                "positively. Recover either rule from its meaning in "
                "five seconds rather than trusting a memorised "
                "ordering under exam pressure."
            ),
            important=(
                "Bonds broken minus bonds formed - reactants' bonds "
                "carry the plus sign here, the reverse of the "
                "formation rule's products-minus-reactants. Derive "
                "the direction from 'breaking costs, forming pays', "
                "not from memory."
            ),
        ),
        ReadingSection(
            id="worked-hcl",
            heading="Worked: H2 + Cl2, checked against exact values",
            body=(
                "Estimate $\\Delta H$ for $\\ce{H2(g) + Cl2(g) -> "
                "2HCl(g)}$.\n\n"
                "**Audit the bonds.** Broken: one H-H at 436 and one "
                "Cl-Cl at 242, totalling $436 + 242 = 678$ kJ in. "
                "Formed: two H-Cl at 431 each, totalling $2 \\times "
                "431 = 862$ kJ out.\n\n"
                "$$\\Delta H \\approx 678 - 862 = -184 \\text{ kJ}$$\n\n"
                "Exothermic: two strong H-Cl bonds out-earn the "
                "H-H and Cl-Cl bonds they replaced. The physical "
                "narration is worth internalising - chlorine's "
                "notably weak bond (242, versus oxygen's 498) makes "
                "it cheap to break into reactive atoms, which is a "
                "large part of why chlorine chemistry is so "
                "vigorous.\n\n"
                "**Now the check.** This reaction can be computed "
                "EXACTLY from formation enthalpies: HCl(g) has "
                "$\\Delta H_f^\\circ = -92.3$ kJ/mol, the elements "
                "are zeros, so the true value is $2 \\times (-92.3) "
                "= -184.6$ kJ. The bond estimate lands within a "
                "kilojoule. The agreement is unusually good for a "
                "reason worth naming: every molecule in this "
                "equation is diatomic, so every bond value used is "
                "an exact, molecule-specific number - no averages "
                "entered. Reactions of diatomics are the method at "
                "its flawless best, and the next examples show the "
                "accuracy degrading, informatively, as averages and "
                "condensed phases enter."
            ),
        ),
        ReadingSection(
            id="worked-hbr-states",
            heading="Worked: H2 + Br2, where the gas-phase clause bites",
            body=(
                "Run the same audit for $\\ce{H2(g) + Br2(g) -> "
                "2HBr(g)}$. Broken: $436 + 193 = 629$ kJ. Formed: "
                "$2 \\times 366 = 732$ kJ.\n\n"
                "$$\\Delta H \\approx 629 - 732 = -103 \\text{ kJ}$$\n\n"
                "Check against formation values, gas to gas: HBr(g) "
                "at $-36.3$ and $\\ce{Br2(g)}$ at $+30.9$ give "
                "$2(-36.3) - 30.9 = -103.5$ kJ. Agreement within a "
                "kilojoule again - diatomics again.\n\n"
                "But now read the fine print on bromine. Its "
                "STANDARD state is liquid: the tabulated reaction "
                "$\\ce{H2(g) + Br2(l) -> 2HBr(g)}$ has $\\Delta H = "
                "2 \\times (-36.3) = -72.6$ kJ, a full 31 kJ less "
                "exothermic than our estimate. The bond table did "
                "not err - it answered a different question. Bond "
                "enthalpies live in the gas phase, so the estimate "
                "priced gaseous bromine, and real liquid bromine "
                "must first be vaporised at a cost of $+30.9$ kJ/mol "
                "(which is exactly $\\Delta H_f^\\circ$ of "
                "$\\ce{Br2(g)}$, the energy to lift the liquid "
                "standard state into vapour). The ledger closes to "
                "the digit: $-103.5 + 30.9 = -72.6$.\n\n"
                "The moral generalises. Whenever a reactant or "
                "product is condensed at the conditions of "
                "interest - bromine, water, iodine, any solvent - "
                "the bond-enthalpy estimate refers to the all-gas "
                "version of the equation, and honest use either "
                "says so or patches in the vaporisation terms "
                "explicitly. Water is the everyday offender: its "
                "44.0 kJ/mol of vaporisation per mole formed is "
                "the usual gap between a bond estimate and a "
                "measured combustion heat."
            ),
        ),
        ReadingSection(
            id="worked-methane-limits",
            heading="Worked: burning methane, and the method's limits",
            body=(
                "A polyatomic case, kept all-gas to stay on the "
                "method's home ground: $\\ce{CH4(g) + 2O2(g) -> "
                "CO2(g) + 2H2O(g)}$.\n\n"
                "**Broken:** four C-H at 415 and two O=O at 498: "
                "$4 \\times 415 + 2 \\times 498 = 1660 + 996 = 2656$ "
                "kJ.\n\n"
                "**Formed:** two C=O as in CO2 at 799 each, and "
                "four O-H at 464: $2 \\times 799 + 4 \\times 464 = "
                "1598 + 1856 = 3454$ kJ.\n\n"
                "$$\\Delta H \\approx 2656 - 3454 = -798 \\text{ kJ}$$\n\n"
                "The formation-enthalpy value for the same all-gas "
                "equation is $-393.5 + 2(-241.8) - (-74.6) = -802.5$ "
                "kJ. The estimate misses by about 5 kJ in 800 - "
                "under one percent, respectable and typical when "
                "the averages behave. Note the table detail that "
                "made it work: CO2's carbon-oxygen bonds are "
                "listed separately (799) from the generic carbonyl "
                "average (near 745), "
                "because CO2's are genuinely stronger; using the "
                "generic value would miss by over 100 kJ. Averages "
                "have fine print, and the good tables print it.\n\n"
                "When should the method be trusted? As a fast "
                "estimator for gas-phase reactions, to roughly ±10 "
                "percent; as a sign-predictor and intuition-builder, "
                "almost always; as a substitute for formation "
                "enthalpies when those exist, never. Its real "
                "pedagogical value is the picture it enforces - "
                "every $\\Delta H$ in this unit is bonds traded, "
                "and a table of bond strengths is a table of WHY "
                "reactions heat and cool their surroundings. The "
                "organic chemistry courses ahead will use exactly "
                "this reasoning, bond by bond, to predict which "
                "reactions go."
            ),
            table=Table(
                caption="Average bond enthalpies used in this chapter",
                columns=("Bond", "D, kJ/mol"),
                rows=(
                    ("H-H", "436"),
                    ("Cl-Cl", "242"),
                    ("Br-Br", "193"),
                    ("H-Cl", "431"),
                    ("H-Br", "366"),
                    ("C-H", "415"),
                    ("O=O", "498"),
                    ("O-H", "464"),
                    ("C=O (in CO2)", "799"),
                ),
                source=(
                    "OpenStax Chemistry 2e, bond energy table "
                    "(average bond enthalpies; diatomic values are "
                    "exact for their molecules). The C=O entry is "
                    "the CO2-specific value that compilation lists "
                    "alongside the generic carbonyl average."
                ),
                note=(
                    "All values are positive - breaking any bond "
                    "costs energy. Formation releases the same "
                    "magnitude with opposite sign."
                ),
            ),
        ),
    ),
    key_takeaways=(
        "A bond enthalpy is the gas-phase cost of breaking one mole of "
        "a bond; every entry is positive, and polyatomic values are "
        "averages.",
        "ΔH ≈ Σ D(broken) - Σ D(formed): reactants' bonds enter "
        "positive - the reverse ordering of the formation rule.",
        "Exothermic means the new bonds are collectively stronger than "
        "the old.",
        "The method prices the all-gas equation; condensed species "
        "need explicit vaporisation terms (Br2 +30.9, H2O 44.0 "
        "kJ/mol).",
        "Expect roughly ±10 percent from averages; diatomic-only "
        "reactions come out nearly exact.",
    ),
    exam_tips=(
        "Sign items hinge on one sentence: breaking costs, forming "
        "pays. Derive the rule's direction from that rather than "
        "recalling an ordering.",
        "Count bonds from drawn structures, not formulas - CH4 has "
        "four C-H bonds, and the O=O of oxygen is one double bond, "
        "not two singles.",
    ),
))
