"""GEN2 lessons: General Chemistry II.

18 lessons, one per authored GEN2 node in app/data/curriculum.py, in
curriculum order, each following the six part arc defined in
app/data/lesson_types.py. Numbers in the worked examples were checked by hand:
standard general chemistry constants are used throughout (Kw = 1.0e-14 at 25 C,
acetic acid Ka = 1.8e-5, R = 8.314 J/(mol*K), F = 96485 C/mol).

These were authored against the retired CF / G1 / G2 node codes and re-keyed
onto the course based map through app/data/node_migration.py. The prose is
unchanged; only the node each lesson claims moved. Bonding, geometry, polarity,
intermolecular forces and colligative properties left this file for GEN1, where
the standard sequence puts them.
"""

from __future__ import annotations

from app.data.claims import Formula, Source
from app.data.lesson_types import Lesson

# Citations for facts the compliance checker cannot re-derive from a structure:
# measured constants, tabulated properties and definitional conventions. Each
# records who is accountable for the number; the citation-debt report tracks
# them. Where a specific molecule is discussed it also carries a Formula claim,
# re-derived by RDKit, so the atom count at least is under test.
OPENSTAX = "OpenStax, Chemistry 2e, Rice University 2019"
CRC = "CRC Handbook of Chemistry and Physics, 97th edition, CRC Press 2016"
GOLDBOOK = "IUPAC Compendium of Chemical Terminology (the Gold Book), 2nd edition"
CODATA = "CODATA internationally recommended values of the fundamental physical constants, NIST"

LESSONS: dict[str, Lesson] = {
    "GEN2.RATES": Lesson(
        node="GEN2.RATES",
        objective=(
            "Express the rate of a reaction from concentration change over time "
            "and convert between the rates of different species using the "
            "stoichiometric coefficients."
        ),
        build_on=(
            "Balancing taught you the fixed ratio in which species are consumed "
            "and produced, and that same ratio is what links their rates."
        ),
        core_idea=(
            "Milk on the counter spoils in a day and milk in the fridge lasts a "
            "week, which is kinetics: same reaction, different rate. Rate is a "
            "concentration change divided by a time interval, in units of "
            "molarity per second. Because a balanced equation consumes and "
            "produces species in fixed proportions, their individual rates are "
            "not equal, so you divide each one by its coefficient to get a "
            "single reaction rate everyone agrees on. Four things change the "
            "rate: concentration, temperature, surface area for heterogeneous "
            "reactions, and catalysts. All four work through the same picture, "
            "which is that molecules must collide, collide hard enough, and "
            "collide in the right orientation."
        ),
        worked_example=(
            "For 2 N2O5 -> 4 NO2 + O2, the concentration of N2O5 falls from "
            "0.0200 M to 0.0160 M over 100. s. First get the rate at which N2O5 "
            "disappears: the change is 0.0160 - 0.0200 = -0.0040 M, so the "
            "disappearance rate is 0.0040 M / 100. s = 4.0e-5 M/s. Now convert "
            "to the reaction rate by dividing by the coefficient 2: rate = "
            "(1/2)(4.0e-5) = 2.0e-5 M/s. NO2 has coefficient 4, so its "
            "formation rate is 4 * 2.0e-5 = 8.0e-5 M/s, twice as fast as N2O5 "
            "vanishes. O2 has coefficient 1, so it forms at 1 * 2.0e-5 = 2.0e-5 "
            "M/s, four times slower than NO2. The three species have three "
            "different numbers and one shared reaction rate."
        ),
        try_it_prompt=(
            "In the reaction N2 + 3 H2 -> 2 NH3, hydrogen is consumed at 6.0e-3 "
            "M/s. At what rate is ammonia being produced?"
        ),
        try_it_answer=(
            "4.0e-3 M/s. Divide by hydrogen's coefficient to get the reaction "
            "rate, 6.0e-3 / 3 = 2.0e-3 M/s, then multiply by ammonia's "
            "coefficient, 2 * 2.0e-3 = 4.0e-3 M/s."
        ),
        pitfall=(
            "The pitfall is treating rate as a fixed property of a reaction, "
            "like a melting point. In the N2O5 example above the rate falls as "
            "the reaction proceeds, because there is less N2O5 left to collide; "
            "a rate is always tied to the particular moment and conditions at "
            "which it was measured."
        ),
        misconception=None,
        claims=(
            Source(
                "Reaction rate is a concentration change per unit time (units "
                "of molarity per second), and dividing each species' rate by "
                "its stoichiometric coefficient gives a single reaction rate.",
                OPENSTAX + ", Ch. 12.1 Chemical Reaction Rates",
            ),
        ),
    ),
    "GEN2.RATELAW": Lesson(
        node="GEN2.RATELAW",
        objective=(
            "Determine the order in each reactant and the rate constant from a "
            "table of initial rates."
        ),
        build_on=(
            "You can now write a rate, and the rate law is the equation that "
            "says how that rate depends on the concentrations you set."
        ),
        core_idea=(
            "A rate law has the form rate = k[A]^m[B]^n, where m and n are the "
            "orders and k is the rate constant. The single most important fact "
            "is that m and n come from experiment, never from the balanced "
            "equation's coefficients. You find them by the method of initial "
            "rates: change one concentration while holding the others fixed, "
            "and see what the rate does. If doubling a concentration doubles "
            "the rate the order is 1, if it quadruples the rate the order is 2, "
            "and if the rate does not move the order is 0. The overall order is "
            "the sum m + n, and the units of k depend on that sum, which is a "
            "free check on your work."
        ),
        worked_example=(
            "For 2 NO + 2 H2 -> N2 + 2 H2O, three experiments give: (1) [NO] = "
            "0.10 M, [H2] = 0.10 M, rate = 1.23e-3 M/s; (2) [NO] = 0.20 M, [H2] "
            "= 0.10 M, rate = 4.92e-3 M/s; (3) [NO] = 0.10 M, [H2] = 0.20 M, "
            "rate = 2.46e-3 M/s. Compare 1 and 2, where only NO changed: "
            "concentration went up 2 times and rate went up 4.92e-3 / 1.23e-3 = "
            "4 times, and since 2^m = 4 gives m = 2, the reaction is second "
            "order in NO. Compare 1 and 3, where only H2 changed: concentration "
            "went up 2 times and rate went up 2.46e-3 / 1.23e-3 = 2 times, and "
            "since 2^n = 2 gives n = 1, the reaction is first order in H2. So "
            "rate = k[NO]^2[H2], overall order 3. Solve for k with experiment "
            "1: k = 1.23e-3 / ((0.10)^2 (0.10)) = 1.23e-3 / 1.0e-3 = 1.23. "
            "Units follow from M/s = k * M^3, so k = 1.23 M^-2 s^-1."
        ),
        try_it_prompt=(
            "In the reaction above, H2 has a coefficient of 2 in the balanced "
            "equation. What is its order, and what does that tell you about "
            "reading orders off coefficients?"
        ),
        try_it_answer=(
            "Its order is 1, not 2. The coefficient and the order disagree "
            "here, which is exactly why order must be measured rather than read "
            "off the equation."
        ),
        pitfall=(
            "The pitfall is copying the coefficients into the rate law as "
            "exponents. That would predict rate = k[NO]^2[H2]^2 for the "
            "reaction above, but tripling [H2] triples the rate rather than "
            "multiplying it by nine, so the measured order in H2 is 1."
        ),
        misconception=None,
        claims=(
            Source(
                "In a rate law rate = k[A]^m[B]^n the orders m and n are "
                "determined experimentally, not from the balanced equation's "
                "coefficients, and the units of k follow from the overall "
                "order.",
                OPENSTAX + ", Ch. 12.3 Rate Laws",
            ),
        ),
    ),
    "GEN2.ARRHENIUS": Lesson(
        node="GEN2.ARRHENIUS",
        objective=(
            "Calculate an activation energy from rate constants at two "
            "temperatures using the two point Arrhenius equation."
        ),
        build_on=(
            "You know that raising the temperature speeds a reaction up, and "
            "the Arrhenius equation is the quantitative form of that "
            "observation."
        ),
        core_idea=(
            "Activation energy is a hill between reactants and products, and "
            "only molecules arriving with enough energy get over it. The "
            "Arrhenius equation, k = A * exp(-Ea / (R * T)), says the rate "
            "constant depends on that hill height Ea and on temperature T, with "
            "R = 8.314 J/(mol*K) and A a constant tied to collision frequency "
            "and orientation. Because Ea sits in an exponent, small temperature "
            "changes produce large rate changes: a common rule of thumb near "
            "room temperature is that 10 degrees roughly doubles the rate. "
            "Rearranged into the two point form, ln(k2/k1) = (Ea/R)(1/T1 - "
            "1/T2), it lets you extract Ea from two measurements. A catalyst "
            "does one thing only, which is to open a different route with a "
            "lower Ea, leaving the reactants and products and therefore delta H "
            "and K completely untouched."
        ),
        worked_example=(
            "A reaction has k = 2.0e-3 s^-1 at 300. K and k = 8.0e-3 s^-1 at "
            "310. K. Find Ea. Start from ln(k2/k1) = (Ea/R)(1/T1 - 1/T2). The "
            "left side is ln(8.0e-3 / 2.0e-3) = ln(4) = 1.386. For the "
            "temperature term, 1/300 = 3.3333e-3 and 1/310 = 3.2258e-3, so 1/T1 "
            "- 1/T2 = 1.075e-4 K^-1. Solve for Ea: Ea = R * 1.386 / 1.075e-4 = "
            "8.314 * 1.386 / 1.075e-4. The numerator is 11.53, so Ea = 11.53 / "
            "1.075e-4 = 1.07e5 J/mol, which is 107 kJ/mol. Sanity check the "
            "result: a 10 degree rise quadrupled the rate here, which is a bit "
            "more than the rule of thumb doubling, and a fairly large 107 "
            "kJ/mol barrier is exactly what makes the reaction that "
            "temperature sensitive."
        ),
        try_it_prompt=(
            "A catalyst is added to a reaction that has delta H = -50 kJ/mol "
            "and K = 25. What happens to Ea, to delta H, and to K?"
        ),
        try_it_answer=(
            "Ea goes down, while delta H stays at -50 kJ/mol and K stays at 25. "
            "The catalyst provides a lower path between the same starting and "
            "ending points, so it changes how fast equilibrium is reached but "
            "not where equilibrium sits."
        ),
        pitfall=(
            "The pitfall is believing a catalyst increases the yield. A "
            "catalyst lowers the barrier in both directions by the same amount, "
            "so the forward and reverse reactions both speed up and K is "
            "unchanged. An industrial catalyst gets you to the same equilibrium "
            "yield sooner, not to a better one."
        ),
        misconception=None,
        claims=(
            Source(
                "The Arrhenius equation k = A*exp(-Ea/(R*T)) uses the gas "
                "constant R = 8.314 J/(mol*K); a catalyst lowers Ea without "
                "changing delta H or K.",
                CODATA + " (gas constant); OpenStax, Chemistry 2e, Ch. 12.5 Collision Theory",
            ),
        ),
    ),
    "GEN2.MECHANISM": Lesson(
        node="GEN2.MECHANISM",
        objective=(
            "Check that a proposed mechanism sums to the overall equation and "
            "predict the rate law from its rate determining step."
        ),
        build_on=(
            "You measured a rate law that did not match the coefficients, and a "
            "mechanism is the explanation for why it did not."
        ),
        core_idea=(
            "A balanced equation is like a receipt showing what you walked in "
            "with and what you walked out with, while a mechanism is the "
            "security footage of what actually happened inside. A mechanism is "
            "a list of elementary steps, and an elementary step is one real "
            "collision, so for elementary steps alone the coefficients do give "
            "the orders. A valid mechanism must satisfy two tests: the steps "
            "must add up to the overall equation, and the predicted rate law "
            "must match the measured one. Species made in one step and consumed "
            "in a later step are intermediates, and they cancel in the sum and "
            "must not appear in the final rate law. The slowest step is the "
            "rate determining step, a bottleneck exactly like the narrowest "
            "lane of a highway, and it alone sets the rate law when it comes "
            "first."
        ),
        worked_example=(
            "The reaction 2 NO2 + F2 -> 2 NO2F is measured to follow rate = "
            "k[NO2][F2], which the coefficients would not predict. Consider the "
            "proposed mechanism: step 1, NO2 + F2 -> NO2F + F, slow; step 2, "
            "NO2 + F -> NO2F, fast. Test the sum first. Adding the two steps "
            "gives 2 NO2 + F2 + F -> 2 NO2F + F, and the fluorine atom F "
            "appears once on each side, so it cancels and leaves 2 NO2 + F2 -> "
            "2 NO2F. That matches. Now test the rate law: step 1 is slow, so it "
            "is rate determining, and because it is an elementary step you may "
            "read its molecularity directly, one NO2 and one F2 colliding, "
            "giving rate = k[NO2][F2]. That matches the measurement, so the "
            "mechanism survives both tests. The F atom is an intermediate, made "
            "in step 1 and eaten in step 2, and it correctly appears nowhere in "
            "the rate law."
        ),
        try_it_prompt=(
            "The overall equation has 2 NO2 but the rate law has [NO2] to the "
            "first power. Which step of the mechanism explains that, and where "
            "does the second NO2 go?"
        ),
        try_it_answer=(
            "The slow first step uses only one NO2, and that step alone sets "
            "the rate law. The second NO2 is consumed in the fast second step, "
            "which is not a bottleneck and therefore does not affect the rate."
        ),
        pitfall=(
            "The pitfall is letting an intermediate stay in the final rate law. "
            "Writing rate = k[NO2][F] for the reaction above is useless, "
            "because F is never something you put in the flask and its "
            "concentration is not a quantity you can set or measure."
        ),
        misconception=None,
        claims=(
            Source(
                "A valid mechanism's elementary steps sum to the overall "
                "equation, intermediates cancel and must not appear in the rate "
                "law, and for an elementary step the molecularity gives the "
                "orders directly; the slowest step is rate determining.",
                OPENSTAX + ", Ch. 12.6 Reaction Mechanisms",
            ),
        ),
    ),
    "GEN2.EQUILIBRIUM": Lesson(
        node="GEN2.EQUILIBRIUM",
        objective=(
            "Write the equilibrium constant expression for a reaction and "
            "evaluate K or Q from concentrations."
        ),
        build_on=(
            "Kinetics gave you forward and reverse rates, and equilibrium is "
            "the state those two rates reach when they become equal."
        ),
        core_idea=(
            "A sealed bottle of soda is at equilibrium: carbon dioxide keeps "
            "leaving the liquid and keeps dissolving back, at matched rates, so "
            "nothing appears to change while everything is still moving. That "
            "is the key idea, dynamic rather than static. The equilibrium "
            "constant is Kc = [products] over [reactants], each concentration "
            "raised to the power of its coefficient, and it is a fixed number "
            "at a given temperature no matter what amounts you started with. "
            "Pure solids and pure liquids are left out of the expression "
            "because their concentrations do not change. The same ratio "
            "computed away from equilibrium is called Q, and comparing Q to K "
            "tells you which way the reaction must run: Q < K means it goes "
            "forward, Q > K means it goes in reverse, Q = K means it is already "
            "there."
        ),
        worked_example=(
            "For N2(g) + 3 H2(g) equilibrium with 2 NH3(g), first write the "
            "expression, taking care with the exponents: Kc = [NH3]^2 / ([N2] "
            "[H2]^3). Ammonia's coefficient 2 becomes a square, hydrogen's "
            "coefficient 3 becomes a cube, and nitrogen's coefficient 1 becomes "
            "a first power. Suppose a flask at equilibrium contains [N2] = 0.50 "
            "M, [H2] = 0.50 M and [NH3] = 0.50 M. The numerator is (0.50)^2 = "
            "0.25. The denominator is (0.50)(0.50)^3 = (0.50)(0.125) = 0.0625. "
            "So Kc = 0.25 / 0.0625 = 4.0. Now test a second flask holding [N2] "
            "= 1.0 M, [H2] = 1.0 M and [NH3] = 1.0 M: Q = 1.0 / (1.0 * 1.0) = "
            "1.0, which is less than 4.0, so this second flask is not at "
            "equilibrium and will run forward, making more ammonia until Q "
            "climbs to 4.0."
        ),
        try_it_prompt=(
            "For CaCO3(s) equilibrium with CaO(s) + CO2(g), write Kc. Which "
            "species appear, and why?"
        ),
        try_it_answer=(
            "Kc = [CO2]. Both CaCO3 and CaO are pure solids, and the "
            "concentration of a pure solid does not change as it is consumed, "
            "so only the gas appears."
        ),
        pitfall=(
            "The pitfall is dropping an exponent when the stoichiometry is not "
            "one to one. In the ammonia flask above, forgetting to cube [H2] "
            "gives 0.25 / (0.50 * 0.50) = 1.0 instead of the correct 4.0, and "
            "every later calculation built on that K is then wrong by a factor "
            "of four."
        ),
        misconception="K-SQUARE",
        claims=(
            Source(
                "The equilibrium constant Kc is products over reactants, each "
                "concentration raised to its coefficient, with pure solids and "
                "liquids omitted; comparing the reaction quotient Q to K gives "
                "the direction of reaction.",
                OPENSTAX + ", Ch. 13.2 Equilibrium Constants and Ch. 13.3 Shifting Equilibria",
            ),
        ),
    ),
    "GEN2.ICE": Lesson(
        node="GEN2.ICE",
        objective=(
            "Set up an initial, change, equilibrium table and solve it for the "
            "equilibrium concentrations."
        ),
        build_on=(
            "You can write K and compare it to Q, and the ICE table is the "
            "bookkeeping that turns 'the reaction will go forward' into 'here "
            "is exactly how far'."
        ),
        core_idea=(
            "An ICE table is three rows and one unknown. The Initial row holds "
            "what you put in the flask. The Change row holds how much each "
            "species shifts, written as a multiple of a single unknown x, where "
            "the multiple is that species' coefficient and the sign is negative "
            "for anything consumed and positive for anything produced. The "
            "Equilibrium row is initial plus change, and those expressions are "
            "what you substitute into the K expression. The whole point is that "
            "stoichiometry links every species to the same x, so a problem with "
            "four unknown concentrations collapses to one equation in one "
            "unknown."
        ),
        worked_example=(
            "H2(g) + I2(g) equilibrium with 2 HI(g) has Kc = 50.5 at 448 C. "
            "Start with 1.000 M H2 and 1.000 M I2 and no HI. Initial row: 1.000, "
            "1.000, 0. Change row: -x, -x, +2x, where HI gets 2x because its "
            "coefficient is 2. Equilibrium row: (1.000 - x), (1.000 - x), 2x. "
            "Substitute: Kc = (2x)^2 / ((1.000 - x)(1.000 - x)) = 50.5. Because "
            "both sides are perfect squares, take the square root of the whole "
            "equation rather than expanding: 2x / (1.000 - x) = sqrt(50.5) = "
            "7.106. Cross multiply to get 2x = 7.106 - 7.106x, so 9.106x = "
            "7.106 and x = 0.7804. Then [H2] = [I2] = 1.000 - 0.7804 = 0.2196 M "
            "and [HI] = 2(0.7804) = 1.561 M. Check by substituting back: "
            "(1.561)^2 / (0.2196)^2 = 2.437 / 0.04822 = 50.5, which confirms "
            "the answer."
        ),
        try_it_prompt=(
            "In the change row above, why is HI written as +2x rather than +x, "
            "and what would [HI] have come out to if you had used +x?"
        ),
        try_it_answer=(
            "Because two HI form for every one H2 consumed, so HI changes twice "
            "as fast as x. Using +x would have given x = 0.877 and [HI] = 0.877 "
            "M instead of the correct 1.561 M."
        ),
        pitfall=(
            "The pitfall is ignoring coefficients in the change row and writing "
            "every entry as plus or minus x. For H2 + I2 forming 2 HI that "
            "error changes [HI] from 1.561 M to 0.877 M, an answer that no "
            "longer satisfies Kc = 50.5 when you substitute it back."
        ),
        misconception=None,
        claims=(
            Source(
                "The reaction H2(g) + I2(g) <=> 2 HI(g) has Kc about 50.5 at "
                "448 C.",
                CRC + " and OpenStax, Chemistry 2e, Ch. 13.4 (tabulated equilibrium constants)",
            ),
        ),
    ),
    "GEN2.LECHATELIER": Lesson(
        node="GEN2.LECHATELIER",
        objective=(
            "Predict the direction an equilibrium shifts when concentration, "
            "volume or temperature changes, and state whether K itself changes."
        ),
        build_on=(
            "K is fixed at a given temperature, and Le Chatelier's principle "
            "tells you how a system restores that fixed K after you disturb it."
        ),
        core_idea=(
            "Le Chatelier's principle says that if you stress a system at "
            "equilibrium, it shifts in the direction that partly relieves the "
            "stress. Adding a reactant makes Q too small, so the reaction runs "
            "forward until Q climbs back to K; removing a product does the same "
            "thing, which is how an industrial plant drives a reaction by "
            "continuously condensing out the product. For gases, decreasing the "
            "volume raises all pressures and the system shifts toward whichever "
            "side has fewer moles of gas. Temperature is the one and only "
            "stress that changes K, because heat is effectively a reactant or a "
            "product: for an exothermic reaction, heating shifts it backward "
            "and lowers K. Adding an inert gas at constant volume changes "
            "nothing, since it alters no partial pressure."
        ),
        worked_example=(
            "For N2(g) + 3 H2(g) equilibrium with 2 NH3(g), delta H = -92.2 kJ, "
            "work through four stresses. Add more N2: Q = [NH3]^2 / ([N2][H2]^3) "
            "drops because the denominator grew, so Q < K and the system shifts "
            "right, consuming some of the added nitrogen; K is unchanged. "
            "Compress the flask to half its volume: the left side has 1 + 3 = 4 "
            "moles of gas and the right side has 2, so the system shifts right "
            "toward fewer moles; K is unchanged. Raise the temperature: the "
            "reaction is exothermic, so heat acts like a product, and adding "
            "heat shifts the system left; here K genuinely decreases. Pump in "
            "argon while holding volume fixed: no partial pressure of N2, H2 or "
            "NH3 changes, Q is untouched, and nothing shifts at all."
        ),
        try_it_prompt=(
            "You add nitrogen to the ammonia equilibrium and it shifts right, "
            "producing more NH3. Does the value of K go up, go down, or stay "
            "the same?"
        ),
        try_it_answer=(
            "It stays the same. Both [NH3] and [N2] end up larger, and the "
            "shift continues only until the ratio Q returns to the original K. "
            "Only a temperature change moves K."
        ),
        pitfall=(
            "The pitfall is thinking that adding reactant increases K. Adding "
            "reactant increases the amount of product, but it increases the "
            "amount of leftover reactant too, and Q settles back to precisely "
            "the same K it started at. Temperature is the only stress that "
            "moves K."
        ),
        misconception="LECHAT-AMOUNT",
        claims=(
            Source(
                "The synthesis N2(g) + 3 H2(g) -> 2 NH3(g) is exothermic with a "
                "standard enthalpy of about -92.2 kJ, so heating shifts it "
                "toward reactants and lowers K.",
                CRC + ", table of standard enthalpies of formation",
            ),
        ),
    ),
    "GEN2.BRONSTED": Lesson(
        node="GEN2.BRONSTED",
        objective=(
            "Identify the Bronsted-Lowry acid, base and both conjugate pairs in "
            "a proton transfer reaction, and relate Ka to Kb for a pair."
        ),
        build_on=(
            "You know that ionic compounds break into ions in water, and acid "
            "base chemistry is the special case where the ion being transferred "
            "is a single proton, H+."
        ),
        core_idea=(
            "A Bronsted-Lowry acid donates a proton and a base accepts one, so "
            "every acid base reaction is one proton changing hands. Once an "
            "acid gives up its proton, whatever is left can in principle take a "
            "proton back, and that species is its conjugate base; likewise a "
            "base that has accepted a proton becomes a conjugate acid. Members "
            "of a conjugate pair differ by exactly one H and one unit of "
            "charge, so acetic acid HC2H3O2 pairs with acetate C2H3O2-. Water "
            "is amphoteric, meaning it can act as either, which is why it "
            "appears on both sides of these lists. Strength runs in opposite "
            "directions across a pair, quantified by Ka * Kb = Kw = 1.0e-14 at "
            "25 C, so a stronger acid always has a weaker conjugate base."
        ),
        worked_example=(
            "Label everything in HC2H3O2 + H2O equilibrium with H3O+ + "
            "C2H3O2-. Acetic acid starts with the proton and loses it, so "
            "HC2H3O2 is the acid; water gains it, so H2O is the base. On the "
            "right, H3O+ can donate a proton back, so it is an acid, and "
            "C2H3O2- can accept one, so it is a base. Now pair them by looking "
            "for species differing by one H: HC2H3O2 and C2H3O2- form one "
            "conjugate pair, and H2O and H3O+ form the other. Acetic acid has "
            "Ka = 1.8e-5, so its conjugate base acetate has Kb = Kw / Ka = "
            "1.0e-14 / 1.8e-5 = 5.6e-10. That Kb is tiny, confirming that "
            "acetate is a very weak base, which is what you expect from the "
            "conjugate of an acid that is itself only moderately weak."
        ),
        try_it_prompt=(
            "In NH3 + H2O equilibrium with NH4+ + OH-, which species is the "
            "conjugate acid of ammonia, and which is the conjugate base of "
            "water?"
        ),
        try_it_answer=(
            "NH4+ is the conjugate acid of NH3, and OH- is the conjugate base "
            "of H2O. Each is its partner plus or minus exactly one proton: "
            "ammonia gained an H, water lost one."
        ),
        pitfall=(
            "The pitfall is assuming the conjugate base of a strong acid is a "
            "strong base. Chloride is the conjugate base of HCl, yet it is so "
            "weak a base that it is essentially inert in water, which is why a "
            "solution of table salt sits at pH 7 rather than turning basic."
        ),
        misconception=None,
        claims=(
            Formula("CC(=O)O", "C2H4O2", "acetic acid, HC2H3O2"),
            Source(
                "Acetic acid has Ka about 1.8e-5, and Ka*Kb = Kw = 1.0e-14 at "
                "25 C, so its conjugate base acetate has Kb about 5.6e-10.",
                OPENSTAX + ", Ch. 14.3 Relative Strengths of Acids and Bases (Appendix H, ionization constants)",
            ),
        ),
    ),
    "GEN2.PH": Lesson(
        node="GEN2.PH",
        objective=(
            "Convert among [H3O+], [OH-], pH and pOH at 25 C."
        ),
        build_on=(
            "You know water can act as both acid and base, and pH is the "
            "logarithmic scale built on the tiny equilibrium that results when "
            "water reacts with itself."
        ),
        core_idea=(
            "Water autoionises, 2 H2O equilibrium with H3O+ + OH-, and the "
            "constant for it is Kw = [H3O+][OH-] = 1.0e-14 at 25 C. In pure "
            "water the two are equal, so each is 1.0e-7 M, which is where "
            "neutral pH 7 comes from. Because the interesting concentrations "
            "span more than fourteen powers of ten, chemists compress them with "
            "a logarithm: pH = -log[H3O+] and pOH = -log[OH-]. Taking the "
            "negative log of the Kw equation gives pH + pOH = 14.00 at 25 C, "
            "which is the source of the familiar 0 to 14 range. Note the minus "
            "sign carefully, since it means more acid gives a lower pH, and "
            "each single pH unit is a full factor of ten in concentration."
        ),
        worked_example=(
            "A solution has [H3O+] = 2.5e-3 M. Find pH, pOH and [OH-]. Start "
            "with pH = -log(2.5e-3). Split the log: log(2.5e-3) = log(2.5) + "
            "log(1e-3) = 0.398 - 3 = -2.602, so pH = 2.60. Because pH is well "
            "below 7 this is acidic, which matches a hydronium concentration "
            "far above 1.0e-7 M. Get pOH from pH + pOH = 14.00, so pOH = 14.00 "
            "- 2.60 = 11.40. Get [OH-] independently from Kw: [OH-] = 1.0e-14 / "
            "2.5e-3 = 4.0e-12 M. Check the two agree: -log(4.0e-12) = 12 - "
            "log(4.0) = 12 - 0.602 = 11.40, which matches the pOH found the "
            "other way. Note the sanity check that [OH-] came out far below "
            "1.0e-7 M, exactly as an acidic solution requires."
        ),
        try_it_prompt=(
            "A solution of 0.010 M HCl ionises completely. What are its pH, "
            "pOH and [OH-]?"
        ),
        try_it_answer=(
            "pH = 2.00, pOH = 12.00, and [OH-] = 1.0e-12 M. HCl is strong so "
            "[H3O+] = 0.010 M, giving pH = -log(1.0e-2) = 2.00, then pOH = "
            "14.00 - 2.00 = 12.00 and [OH-] = 1.0e-14 / 1.0e-2 = 1.0e-12 M."
        ),
        pitfall=(
            "The pitfall is computing the hydroxide concentration and then "
            "reporting its negative logarithm as the pH. A solution with pOH 3 "
            "has pH 11 at 25 C, so it is strongly basic, while calling it pH 3 "
            "would describe an acid instead. Always subtract from 14.00 before "
            "labelling the answer pH."
        ),
        misconception="PH-POH",
        claims=(
            Source(
                "Water autoionises with Kw = [H3O+][OH-] = 1.0e-14 at 25 C, so "
                "in pure water each ion is 1.0e-7 M and pH + pOH = 14.00.",
                OPENSTAX + ", Ch. 14.1 Bronsted-Lowry Acids and Bases and Ch. 14.2 pH and pOH",
            ),
        ),
    ),
    "GEN2.WEAKACID": Lesson(
        node="GEN2.WEAKACID",
        objective=(
            "Calculate the pH of a weak acid or weak base solution from Ka or "
            "Kb, and test whether the small x approximation was valid."
        ),
        build_on=(
            "You can run an ICE table and convert [H3O+] to pH, and a weak acid "
            "problem is exactly those two skills used in sequence."
        ),
        core_idea=(
            "Vinegar is about 0.8 M acetic acid, yet its pH is around 2.4 "
            "rather than the 0.1 you would get if every molecule ionised. A "
            "weak acid ionises only partially, so it is an equilibrium and Ka "
            "measures how far it goes. Set up an ICE table for HA + H2O "
            "equilibrium with H3O+ + A-, which gives Ka = x^2 / (C - x) where C "
            "is the initial acid concentration and x is [H3O+]. That is a "
            "quadratic, but when x is small compared to C you may approximate C "
            "- x as C and take x = sqrt(Ka * C). The approximation is honest "
            "only when x is less than 5 percent of C, and you must actually "
            "check that after solving rather than assume it."
        ),
        worked_example=(
            "Find the pH of 0.100 M acetic acid, Ka = 1.8e-5. The ICE table "
            "gives initial 0.100 for HC2H3O2 and 0 for both products, change of "
            "-x and +x and +x, and equilibrium of (0.100 - x), x, x. Substitute: "
            "Ka = x^2 / (0.100 - x) = 1.8e-5. Try the approximation by dropping "
            "x from the denominator: x^2 = (1.8e-5)(0.100) = 1.8e-6, so x = "
            "sqrt(1.8e-6) = 1.34e-3 M. Now validate before going further: 1.34e-3 "
            "/ 0.100 = 0.0134, which is 1.3 percent, comfortably under 5 "
            "percent, so the approximation stands. Convert to pH: pH = "
            "-log(1.34e-3) = 3 - log(1.34) = 3 - 0.128 = 2.87. For confidence, "
            "solving the full quadratic x^2 + 1.8e-5 x - 1.8e-6 = 0 gives x = "
            "1.33e-3 and pH = 2.88, so the shortcut cost about 0.01 pH units."
        ),
        try_it_prompt=(
            "Now try 0.0010 M acetic acid with the same Ka = 1.8e-5. Compute x "
            "with the approximation, then check the 5 percent rule. Is the "
            "shortcut allowed here?"
        ),
        try_it_answer=(
            "No. x = sqrt((1.8e-5)(1.0e-3)) = sqrt(1.8e-8) = 1.3e-4 M, and "
            "1.3e-4 / 1.0e-3 = 13 percent, far above 5 percent, so you must "
            "solve the quadratic instead. Dilute solutions ionise a larger "
            "fraction, which is precisely when the shortcut breaks."
        ),
        pitfall=(
            "The pitfall is dropping x from the denominator without ever "
            "testing it. The test is one division, x divided by the initial "
            "concentration, and it takes seconds; at 0.0010 M acetic acid the "
            "untested shortcut is 13 percent off in x and misstates the pH."
        ),
        misconception="APPROX-INVALID",
        claims=(
            Formula("CC(=O)O", "C2H4O2", "acetic acid"),
            Source(
                "Acetic acid has Ka about 1.8e-5; the small-x approximation is "
                "honest only when x is under 5 percent of the initial "
                "concentration.",
                OPENSTAX + ", Ch. 14.3 (Appendix H, ionization constants of weak acids)",
            ),
        ),
    ),
    "GEN2.BUFFER": Lesson(
        node="GEN2.BUFFER",
        objective=(
            "Calculate the pH of a buffer with the Henderson-Hasselbalch "
            "equation and the new pH after a strong acid or base is added."
        ),
        build_on=(
            "A weak acid solution has a pH set by Ka and concentration, and a "
            "buffer is what you get when you deliberately add its conjugate "
            "base alongside it."
        ),
        core_idea=(
            "Human blood holds pH between 7.35 and 7.45 despite constant acid "
            "production, because it is buffered. A buffer is a weak acid and "
            "its conjugate base together in appreciable amounts, so it has a "
            "reserve ready for either kind of attack: incoming H+ is mopped up "
            "by the conjugate base, and incoming OH- is neutralised by the weak "
            "acid. The Henderson-Hasselbalch equation, pH = pKa + log([A-] / "
            "[HA]), says the pH depends on the ratio of the two rather than "
            "their absolute amounts, which is why diluting a buffer barely "
            "moves its pH. When the two are equal the log is zero and pH = pKa, "
            "so you choose a buffer by picking an acid whose pKa is near your "
            "target pH. Buffering is finite, and it fails once added acid or "
            "base consumes one of the two components."
        ),
        worked_example=(
            "Make a buffer from 0.100 mol acetic acid and 0.100 mol sodium "
            "acetate in 1.00 L, where Ka = 1.8e-5. First pKa = -log(1.8e-5) = 5 "
            "- log(1.8) = 5 - 0.255 = 4.74. Since [A-] = [HA] = 0.100 M, pH = "
            "4.74 + log(1) = 4.74 + 0 = 4.74. Now add 0.010 mol of solid NaOH. "
            "The hydroxide eats acetic acid and makes acetate, so acid goes to "
            "0.100 - 0.010 = 0.090 mol and base goes to 0.100 + 0.010 = 0.110 "
            "mol. New pH = 4.74 + log(0.110 / 0.090) = 4.74 + log(1.222) = 4.74 "
            "+ 0.087 = 4.83, a change of only 0.09 units. Compare adding that "
            "same 0.010 mol NaOH to 1.00 L of pure water: [OH-] = 0.010 M, pOH "
            "= 2.00, pH = 12.00, a jump of 5 full units from neutral. That "
            "difference is the entire point of a buffer."
        ),
        try_it_prompt=(
            "You want a buffer at pH 4.74 but you need three times as much "
            "acetate as acetic acid. Using pKa = 4.74, what pH would that "
            "mixture actually have?"
        ),
        try_it_answer=(
            "pH = 4.74 + log(3) = 4.74 + 0.48 = 5.22, so it would not hold pH "
            "4.74. Equal concentrations are what put the pH exactly at the pKa, "
            "because only then is the log term zero."
        ),
        pitfall=(
            "The pitfall is treating buffer capacity as unlimited. Add 0.150 "
            "mol NaOH to the buffer above and you destroy all 0.100 mol of "
            "acetic acid, leaving 0.050 mol of excess OH- in 1.00 L: pOH = "
            "-log(0.050) = 1.30, so pH = 12.70. Once a component runs out, "
            "Henderson-Hasselbalch no longer applies at all."
        ),
        misconception=None,
        claims=(
            Formula("CC(=O)O", "C2H4O2", "acetic acid, the buffer's weak acid"),
            Source(
                "Human arterial blood is held between about pH 7.35 and 7.45 by "
                "its buffer systems.",
                OPENSTAX + ", Ch. 14.6 Buffers (Chemistry in Everyday Life: blood pH)",
            ),
            Source(
                "Acetic acid has Ka about 1.8e-5, so pKa about 4.74.",
                OPENSTAX + ", Ch. 14.3 (Appendix H, ionization constants)",
            ),
        ),
    ),
    "GEN2.TITRATIONWEAK": Lesson(
        node="GEN2.TITRATIONWEAK",
        objective=(
            "Identify the buffer region, half equivalence point and equivalence "
            "point on a titration curve, and calculate the pH at each."
        ),
        build_on=(
            "You can compute a buffer pH from a ratio of acid to conjugate "
            "base, and a titration curve is what you get by plotting that pH "
            "continuously as the ratio is swept from all acid to all base."
        ),
        core_idea=(
            "A titration curve for a weak acid against a strong base has four "
            "regions worth naming. Before any base is added you have a pure "
            "weak acid problem. As base is added you create conjugate base "
            "alongside the remaining acid, which is a buffer, and the curve "
            "goes nearly flat through this buffer region. Exactly halfway to "
            "equivalence, half the acid has been converted, so [A-] = [HA] and "
            "the Henderson-Hasselbalch log term is zero, which makes pH = pKa; "
            "this is the cleanest experimental way to measure a pKa. The "
            "equivalence point is where moles of added base equal moles of "
            "original acid, and the pH there is set by the conjugate base "
            "sitting alone in solution, so for a weak acid it lands above 7."
        ),
        worked_example=(
            "Titrate 25.00 mL of 0.100 M acetic acid with 0.100 M NaOH, Ka = "
            "1.8e-5. Moles of acid = (0.02500 L)(0.100 M) = 2.50e-3 mol, so "
            "equivalence needs 2.50e-3 mol of NaOH, which is 2.50e-3 / 0.100 = "
            "0.02500 L, or 25.00 mL. Half equivalence is therefore at 12.50 mL, "
            "where pH = pKa = 4.74. At the equivalence point the total volume "
            "is 25.00 + 25.00 = 50.00 mL, and all 2.50e-3 mol of acid is now "
            "acetate, so [C2H3O2-] = 2.50e-3 mol / 0.05000 L = 0.0500 M. "
            "Acetate is a weak base with Kb = 1.0e-14 / 1.8e-5 = 5.6e-10, so "
            "[OH-] = sqrt((5.6e-10)(0.0500)) = sqrt(2.8e-11) = 5.3e-6 M. Then "
            "pOH = -log(5.3e-6) = 5.28 and pH = 14.00 - 5.28 = 8.72. The "
            "equivalence point is basic, at pH 8.72, not neutral."
        ),
        try_it_prompt=(
            "You titrate 25.00 mL of 0.100 M HCl with 0.100 M NaOH instead. "
            "What is the pH at the equivalence point, and why does it differ "
            "from the 8.72 above?"
        ),
        try_it_answer=(
            "pH = 7.00. HCl is a strong acid, so its conjugate base Cl- is "
            "essentially inert and leaves only neutral NaCl in water, whereas "
            "acetate is a genuine weak base that pulls the solution above 7."
        ),
        pitfall=(
            "The pitfall is assuming the equivalence point is always pH 7. That "
            "is true only for a strong acid with a strong base; the acetic acid "
            "titration above reaches equivalence at pH 8.72, so choosing an "
            "indicator that changes colour at 7 would report the endpoint too "
            "early."
        ),
        misconception=None,
        claims=(
            Formula("CC(=O)O", "C2H4O2", "acetic acid"),
            Source(
                "Acetic acid has Ka about 1.8e-5, so at half-equivalence "
                "pH = pKa about 4.74; a weak acid titrated with strong base "
                "reaches equivalence above pH 7.",
                OPENSTAX + ", Ch. 14.7 Acid-Base Titrations",
            ),
        ),
    ),
    "GEN2.KSP": Lesson(
        node="GEN2.KSP",
        objective=(
            "Calculate molar solubility from Ksp, and calculate how a common "
            "ion reduces it."
        ),
        build_on=(
            "An ICE table already lets you solve an equilibrium for one "
            "unknown, and dissolving a barely soluble salt is that same "
            "equilibrium with the solid left out of the K expression."
        ),
        core_idea=(
            "Nothing is truly insoluble. Put silver chloride in water and a "
            "tiny amount dissolves until AgCl(s) equilibrium with Ag+(aq) + "
            "Cl-(aq) is reached, and the constant for that is the solubility "
            "product Ksp = [Ag+][Cl-], with the solid omitted because its "
            "concentration does not change. Molar solubility s is the moles per "
            "litre that dissolve, and you relate it to Ksp through the "
            "stoichiometry: for a 1 to 1 salt Ksp = s^2, while for a salt like "
            "CaF2 that releases two anions Ksp = (s)(2s)^2 = 4s^3. The common "
            "ion effect follows directly from Le Chatelier: if one of the ions "
            "is already present in the solution, the equilibrium shifts back "
            "toward the solid and less dissolves."
        ),
        worked_example=(
            "AgCl has Ksp = 1.8e-10. In pure water the ICE table gives [Ag+] = "
            "s and [Cl-] = s, so Ksp = s^2 = 1.8e-10 and s = sqrt(1.8e-10) = "
            "1.3e-5 M. Now dissolve AgCl in 0.010 M NaCl instead. The chloride "
            "from the salt is already there, so [Cl-] = 0.010 + s while [Ag+] "
            "is still s, and Ksp = s(0.010 + s) = 1.8e-10. Since s will "
            "certainly be far below 0.010, approximate 0.010 + s as 0.010, "
            "giving s = 1.8e-10 / 0.010 = 1.8e-8 M. Validate the "
            "approximation: 1.8e-8 is 0.00018 percent of 0.010, so it was "
            "amply justified. Compare the two answers: 1.3e-5 / 1.8e-8 = about "
            "750, so the common ion made AgCl roughly 750 times less soluble."
        ),
        try_it_prompt=(
            "Calcium fluoride has Ksp = 3.9e-11. Write Ksp in terms of s and "
            "find the molar solubility."
        ),
        try_it_answer=(
            "Ksp = (s)(2s)^2 = 4s^3, so s^3 = 3.9e-11 / 4 = 9.8e-12 and s = "
            "2.1e-4 M. The fluoride concentration is 2s because each formula "
            "unit releases two F- ions, and that 2 gets squared."
        ),
        pitfall=(
            "The pitfall is ranking solubility by comparing Ksp values across "
            "different formulas. AgCl has the larger Ksp at 1.8e-10 yet "
            "dissolves to only 1.3e-5 M, while Ag2CrO4 has the much smaller Ksp "
            "of 1.1e-12 and dissolves to 6.5e-5 M, five times more, because its "
            "Ksp = 4s^3 rather than s^2. Convert both to molar solubility "
            "before comparing."
        ),
        misconception=None,
        claims=(
            Source(
                "Approximate solubility products at 25 C: AgCl 1.8e-10, CaF2 "
                "3.9e-11, Ag2CrO4 1.1e-12.",
                OPENSTAX + ", Ch. 15.1 Precipitation and Dissolution (Appendix J, solubility products)",
            ),
        ),
    ),
    "GEN2.ENTROPY": Lesson(
        node="GEN2.ENTROPY",
        objective=(
            "Predict the sign of the entropy change for a process and calculate "
            "delta S from standard molar entropies."
        ),
        build_on=(
            "Hess's law taught you to add tabulated state functions to get a "
            "reaction total, and entropy is another state function you total "
            "the same way."
        ),
        core_idea=(
            "Drop a dye crystal into still water and the colour spreads until "
            "it is uniform, and it never spontaneously gathers back into a "
            "crystal. Entropy S measures how spread out energy and matter are "
            "among the available arrangements, and it is a real measured "
            "quantity in J/(mol*K), not a synonym for untidiness. Predicting "
            "the sign is usually easy: solid to liquid to gas raises S sharply, "
            "and a reaction that increases the number of moles of gas has "
            "positive delta S. You compute it from tables exactly like enthalpy, "
            "as delta S = sum of products minus sum of reactants, each weighted "
            "by its coefficient, except that elements have nonzero standard "
            "entropies. The second law says the entropy of the universe "
            "increases in any spontaneous process, which is the system plus its "
            "surroundings, not the system alone."
        ),
        worked_example=(
            "Compute delta S for 2 H2(g) + O2(g) -> 2 H2O(l) from standard "
            "molar entropies: H2(g) 130.7, O2(g) 205.2 and H2O(l) 69.9, all in "
            "J/(mol*K). Products first: 2 * 69.9 = 139.8 J/K. Reactants next: "
            "2 * 130.7 = 261.4 for hydrogen, plus 205.2 for oxygen, giving "
            "466.6 J/K. Subtract: delta S = 139.8 - 466.6 = -326.8 J/K, a large "
            "negative value. The sign makes sense before you do any arithmetic, "
            "because three moles of gas become zero moles of gas and turn into "
            "a liquid, which is a big collapse in dispersal. Yet burning "
            "hydrogen is famously spontaneous, and the resolution is that the "
            "reaction dumps 571.6 kJ into the surroundings, worth 571600 / 298 "
            "= +1918 J/K there, so the universe gains 1918 - 327 = +1591 J/K "
            "overall."
        ),
        try_it_prompt=(
            "Without any tables, predict the sign of delta S for CaCO3(s) -> "
            "CaO(s) + CO2(g), and say why."
        ),
        try_it_answer=(
            "Positive. A solid becomes a solid plus a gas, so the number of "
            "moles of gas goes from zero to one, and gases have far higher "
            "molar entropies than solids."
        ),
        pitfall=(
            "The pitfall is assuming the system's entropy must increase for a "
            "process to be spontaneous. Water freezing at -10 C has a negative "
            "delta S for the system, and burning hydrogen above has delta S = "
            "-326.8 J/K, yet both happen; it is the entropy of the universe "
            "that the second law constrains."
        ),
        misconception=None,
        claims=(
            Formula("O", "H2O", "liquid water, the product in the worked example"),
            Source(
                "Standard molar entropies used: H2(g) 130.7, O2(g) 205.2 and "
                "H2O(l) 69.9 J/(mol*K).",
                CRC + " and OpenStax, Chemistry 2e, Appendix G (standard thermodynamic properties)",
            ),
        ),
    ),
    "GEN2.GIBBS": Lesson(
        node="GEN2.GIBBS",
        objective=(
            "Determine whether a process is spontaneous at a given temperature "
            "using delta G = delta H - T * delta S, and find the crossover "
            "temperature."
        ),
        build_on=(
            "You can calculate delta H from enthalpies and delta S from "
            "entropies, and Gibbs free energy is the single quantity that "
            "combines them into a yes or no answer."
        ),
        core_idea=(
            "Gibbs free energy folds the second law into a criterion you can "
            "apply to the system alone: delta G = delta H - T * delta S, where "
            "a negative delta G means spontaneous, a positive delta G means "
            "spontaneous in reverse, and zero means equilibrium. The two terms "
            "can agree or fight. If delta H is negative and delta S is "
            "positive, delta G is negative at every temperature. If both are "
            "negative, the reaction is spontaneous only when T is low enough "
            "that the T * delta S term stays small. If both are positive, only "
            "high T works. Watch units, because delta H is tabulated in kJ and "
            "delta S in J, so one must be converted before subtracting. Gibbs "
            "also connects to equilibrium through delta G = -R * T * ln(K), so "
            "a negative delta G corresponds to K greater than 1."
        ),
        worked_example=(
            "Ask whether liquid water boils at 25 C. For H2O(l) -> H2O(g), "
            "delta H = +44.0 kJ/mol and delta S = 188.8 - 69.9 = +118.9 "
            "J/(mol*K). Both are positive, so this is a high temperature case. "
            "Convert delta H to 44000 J/mol so units match, then at T = 298 K "
            "compute T * delta S = 298 * 118.9 = 35430 J/mol. So delta G = "
            "44000 - 35430 = +8570 J/mol, or +8.57 kJ/mol, which is positive, "
            "and water therefore does not boil at 25 C. Find the crossover by "
            "setting delta G = 0, which gives T = delta H / delta S = 44000 / "
            "118.9 = 370 K, or 97 C. That is close to the true 100 C, and the "
            "3 degree gap is honest evidence of the approximation used, namely "
            "that delta H and delta S were treated as independent of "
            "temperature."
        ),
        try_it_prompt=(
            "A reaction has delta H = -50.0 kJ/mol and delta S = -100.0 "
            "J/(mol*K). Is it spontaneous at 298 K?"
        ),
        try_it_answer=(
            "Yes. delta G = -50000 - (298)(-100.0) = -50000 + 29800 = -20200 "
            "J/mol, or -20.2 kJ/mol. Both terms are negative, so it is "
            "spontaneous at low temperature and stops being so above 500 K, "
            "where 50000 / 100.0 = 500."
        ),
        pitfall=(
            "The pitfall is reading spontaneous as fast. Diamond converting to "
            "graphite has delta G = -2.9 kJ/mol at 25 C, so it is spontaneous, "
            "and diamonds still last for ages because the activation energy is "
            "enormous. Gibbs tells you the direction, kinetics tells you the "
            "speed."
        ),
        misconception=None,
        claims=(
            Formula("O", "H2O", "water, vaporised in the worked example"),
            Source(
                "For vaporising water delta H is about +44.0 kJ/mol; the "
                "diamond-to-graphite conversion has delta G about -2.9 kJ/mol "
                "at 25 C.",
                CRC + " and OpenStax, Chemistry 2e, Appendix G (standard thermodynamic properties)",
            ),
        ),
    ),
    "GEN2.GALVANIC": Lesson(
        node="GEN2.GALVANIC",
        objective=(
            "Calculate a standard cell potential from half cell potentials and "
            "convert it to delta G."
        ),
        build_on=(
            "You can split a redox reaction into half reactions, and an "
            "electrochemical cell is what you get by physically separating "
            "those two halves and wiring them together."
        ),
        core_idea=(
            "A battery is a redox reaction that has been forced to send its "
            "electrons the long way around. Put the oxidation half in one "
            "beaker and the reduction half in another, connect them with a wire "
            "and a salt bridge, and the electrons must travel through the wire, "
            "which is a current you can use. Oxidation always happens at the "
            "anode and reduction always at the cathode. Each half reaction has "
            "a standard reduction potential measured against the hydrogen "
            "electrode, and the cell potential is E(cathode) - E(anode), using "
            "reduction potentials for both. A positive E means the reaction is "
            "spontaneous, which links to thermodynamics through delta G = -n * "
            "F * E, where n is the moles of electrons transferred and F = 96485 "
            "C/mol."
        ),
        worked_example=(
            "Build the classic zinc copper cell. The relevant standard "
            "reduction potentials are Zn2+ + 2 e- -> Zn at -0.76 V and Cu2+ + 2 "
            "e- -> Cu at +0.34 V. The more positive potential wins the "
            "reduction, so copper is reduced at the cathode and zinc is "
            "oxidised at the anode. Then E(cell) = E(cathode) - E(anode) = 0.34 "
            "- (-0.76) = +1.10 V, and the positive sign confirms the cell runs "
            "on its own. The overall reaction is Zn + Cu2+ -> Zn2+ + Cu, which "
            "moves n = 2 electrons. Convert to free energy: delta G = -n * F * "
            "E = -(2)(96485 C/mol)(1.10 V) = -212267 J/mol, or about -212 "
            "kJ/mol. Electrons flow through the wire from the zinc anode to the "
            "copper cathode, while the salt bridge passes ions to keep both "
            "beakers electrically neutral."
        ),
        try_it_prompt=(
            "If you swapped the copper half cell for one with a standard "
            "reduction potential of -1.20 V, would the zinc still be oxidised? "
            "What would E(cell) be?"
        ),
        try_it_answer=(
            "No. Zinc at -0.76 V is now the more positive of the two, so zinc "
            "would be reduced at the cathode and the other half cell oxidised. "
            "E(cell) = -0.76 - (-1.20) = +0.44 V, again positive, because you "
            "always assign the roles so the cell potential comes out positive."
        ),
        pitfall=(
            "The pitfall is thinking electrons travel through the salt bridge. "
            "They do not; electrons go through the external wire, and the salt "
            "bridge carries ions in the opposite sense to cancel the charge "
            "buildup. Remove the wire and the current stops even though the "
            "salt bridge is still in place."
        ),
        misconception=None,
        claims=(
            Source(
                "Standard reduction potentials: Zn2+ + 2 e- -> Zn at -0.76 V "
                "and Cu2+ + 2 e- -> Cu at +0.34 V; the Faraday constant is "
                "96485 C/mol.",
                OPENSTAX + ", Ch. 17.3 Standard Reduction Potentials (Appendix L); Faraday constant from CODATA",
            ),
        ),
    ),
    "GEN2.NERNST": Lesson(
        node="GEN2.NERNST",
        objective=(
            "Calculate a cell potential at nonstandard concentrations with the "
            "Nernst equation, and obtain K from a standard cell potential."
        ),
        build_on=(
            "Standard cell potentials assume every concentration is 1 M, and "
            "the Nernst equation is the correction that lets you leave those "
            "standard conditions."
        ),
        core_idea=(
            "A battery does not deliver the same voltage forever, because as it "
            "runs the reactants are consumed and the products build up. The "
            "Nernst equation captures that: E = E(standard) - (R * T / (n * F)) "
            "* ln(Q), where Q is the same reaction quotient you already use for "
            "equilibrium. At 25 C the constants collapse to a convenient form, "
            "E = E(standard) - (0.0592 / n) * log(Q), with 0.0592 V coming from "
            "(8.314 * 298.15 / 96485) * ln(10). Reading it is straightforward: "
            "more product makes Q larger and the voltage smaller. A dead "
            "battery is simply a cell that has reached equilibrium, where Q = K "
            "and E = 0, and setting E to zero in the Nernst equation is exactly "
            "how you extract K from a standard potential."
        ),
        worked_example=(
            "Take the zinc copper cell with E(standard) = +1.10 V and n = 2, "
            "for Zn + Cu2+ -> Zn2+ + Cu. Suppose [Zn2+] = 1.00 M and [Cu2+] = "
            "0.0100 M, which is depleted from standard. Write Q using only the "
            "aqueous species, since Zn and Cu are pure solids: Q = [Zn2+] / "
            "[Cu2+] = 1.00 / 0.0100 = 100. Then E = 1.10 - (0.0592 / 2) * "
            "log(100) = 1.10 - (0.0296)(2) = 1.10 - 0.0592 = 1.04 V. The "
            "voltage dropped because the copper ion the cell needs is running "
            "low, and a hundredfold depletion cost only about 0.06 V, which "
            "shows how gently the logarithm responds. Now find K by setting E = "
            "0: 0 = 1.10 - (0.0592 / 2) * log(K), so log(K) = 2(1.10) / 0.0592 "
            "= 37.2, giving K of roughly 1e37. That enormous K means the "
            "reaction runs essentially to completion."
        ),
        try_it_prompt=(
            "In the same cell, what happens to E if you instead raise [Cu2+] to "
            "10.0 M while holding [Zn2+] at 1.00 M? Compute it."
        ),
        try_it_answer=(
            "E rises to 1.13 V. Q = 1.00 / 10.0 = 0.100, so log(Q) = -1 and E = "
            "1.10 - (0.0296)(-1) = 1.10 + 0.0296 = 1.13 V. More reactant means "
            "a smaller Q and a larger voltage."
        ),
        pitfall=(
            "The pitfall is multiplying E(standard) when you scale a half "
            "reaction. Doubling Cu2+ + 2 e- -> Cu into 2 Cu2+ + 4 e- -> 2 Cu "
            "leaves E(standard) at +0.34 V, because potential is an intensive "
            "property like temperature. What does double is delta G, since n in "
            "delta G = -n * F * E went from 2 to 4."
        ),
        misconception=None,
        claims=(
            Source(
                "At 25 C the Nernst equation reduces to E = E(standard) - "
                "(0.0592/n)*log(Q), the factor 0.0592 V coming from "
                "(R*T/F)*ln(10) = (8.314*298.15/96485)*ln(10).",
                OPENSTAX + ", Ch. 17.4 The Nernst Equation",
            ),
        ),
    ),
    "GEN2.NUCLEARSTABILITY": Lesson(
        node="GEN2.NUCLEARSTABILITY",
        objective=(
            "Write balanced nuclear equations for alpha and beta decay and use "
            "half life to find how much of a sample remains."
        ),
        build_on=(
            "Isotopes taught you that mass number and atomic number describe a "
            "nucleus, and nuclear equations are balanced by conserving exactly "
            "those two numbers."
        ),
        core_idea=(
            "Chemical reactions rearrange electrons and leave nuclei alone, "
            "while nuclear reactions change the nucleus itself, so one element "
            "becomes another. Two decay modes cover most of what you need: "
            "alpha decay emits a helium-4 nucleus, dropping mass number by 4 "
            "and atomic number by 2; beta decay converts a neutron into a "
            "proton and emits an electron, keeping mass number the same and "
            "raising atomic number by 1. Balance a nuclear equation by making "
            "the mass numbers sum equally on both sides and the atomic numbers "
            "do the same. Decay is first order, so it has a constant half life "
            "independent of how much you started with, related to the rate "
            "constant by k = ln(2) / t(half). The energies involved come from "
            "converting mass to energy through E = m * c^2, which is why they "
            "dwarf chemical energies."
        ),
        worked_example=(
            "Carbon-14 beta decays with a half life of 5730 years. Write the "
            "equation first: carbon-14 has mass number 14 and atomic number 6, "
            "and beta decay keeps the mass number at 14 while raising the "
            "atomic number to 7, so the product is nitrogen-14 plus an "
            "electron. Check the balance: mass numbers 14 = 14 + 0, and atomic "
            "numbers 6 = 7 + (-1). Now date a wooden artefact whose carbon-14 "
            "activity is 25 percent of a living tree's. Each half life halves "
            "the amount, so 100 percent goes to 50 percent after one and to 25 "
            "percent after two, meaning two half lives have passed. Age = 2 * "
            "5730 = 11460 years. For the energy comparison, the beta particle "
            "carries up to 0.156 MeV, and since 1 eV per particle equals 96.485 "
            "kJ/mol, that is 156000 * 96.485 = 1.5e7 kJ/mol. A carbon hydrogen "
            "bond costs about 413 kJ/mol, so this modest decay releases about "
            "36000 times more energy per mole."
        ),
        try_it_prompt=(
            "Uranium-238 undergoes alpha decay. What is the mass number and "
            "atomic number of the product, and which element is it?"
        ),
        try_it_answer=(
            "Mass number 234 and atomic number 90, which is thorium-234. Alpha "
            "decay removes a helium-4 nucleus, so 238 - 4 = 234 and 92 - 2 = "
            "90."
        ),
        pitfall=(
            "The pitfall is treating a half life as an expiry date, as though "
            "nothing is left after two of them. After two half lives 25 percent "
            "remains, and after ten half lives about 0.1 percent still remains, "
            "since each half life removes only half of whatever is currently "
            "there."
        ),
        misconception=None,
        claims=(
            Source(
                "Carbon-14 beta decays to nitrogen-14 with a half-life of about "
                "5730 years, the beta particle carrying up to about 0.156 MeV; "
                "1 eV per particle corresponds to 96.485 kJ/mol.",
                CRC + ", table of the isotopes (nuclear data)",
            ),
        ),
    ),
}
