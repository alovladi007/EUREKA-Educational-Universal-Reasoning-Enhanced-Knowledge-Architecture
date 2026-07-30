"""GEN2 fill A: the missing kinetics and equilibrium nodes.

Thirteen lessons that were absent from LESSONS in units GEN2-U1 (chemical
kinetics) and GEN2-U2 (chemical equilibrium). The already authored GEN2 file
(app/data/lessons_gen2.py) covers rate expressions, one rate law worked from
initial rates, the Arrhenius calculation, one mechanism with a slow first step,
the equilibrium state, ICE tables and Le Chatelier's principle. This file fills
the gaps around those, and each lesson is written to add the part its neighbour
left out rather than repeat it: INITIALRATES supplies the general logarithm
method, INTEGRATED and HALFLIFE follow a single run over time, COLLISION gives
the model behind Arrhenius, RDS handles the pre-equilibrium case, CATALYSIS
gives the catalytic cycle, and the equilibrium lessons split writing K,
converting Kc to Kp, the heterogeneous exception, algebraic manipulation of K,
the reaction quotient and the temperature dependence of K.

Voice and rules follow the rest of the GEN files: second person, concrete
before abstract, arithmetic worked in full. Every physical constant stated as a
number carries a Source; equilibrium constants and rate constants inside worked
examples are chosen round teaching values and the prose says so. Molecules that
appear carry a derivable Formula claim, checked against RDKit; the formula
strings are the exact Hill-order output RDKit returns (so ammonia would read
H3N), which is why some read in an unfamiliar order.
"""

from __future__ import annotations

from app.data.claims import Formula, Source
from app.data.lesson_types import Lesson

LESSONS_GEN2_FILL_A: dict[str, Lesson] = {
    "GEN2.RATEFACTORS": Lesson(
        node="GEN2.RATEFACTORS",
        objective=(
            "Name the four factors that change a reaction rate and explain each "
            "one through the picture of colliding molecules."
        ),
        build_on=(
            "Reaction rates gave you a number for how fast a reaction runs and "
            "hinted that a few things control it; here you take each control "
            "apart and see why it works."
        ),
        core_idea=(
            "Every rate change runs through one picture: molecules must collide, "
            "collide with enough energy, and collide in the right orientation. "
            "Four levers act on that picture. Concentration is the simplest, "
            "since more molecules packed into the same volume means more "
            "collisions each second. Temperature matters far more than a "
            "collision count would suggest, because it sharply raises the "
            "fraction of collisions that clear the energy threshold, not just "
            "how often molecules meet. Surface area applies only to "
            "heterogeneous reactions, where the reaction happens at an interface "
            "between phases: grinding a solid to powder exposes far more surface "
            "for the other reactant to reach. A catalyst opens a different route "
            "with a lower barrier without being used up. Flour sits safely in a "
            "sack yet flour dust suspended in air can explode, which is surface "
            "area and concentration acting at once."
        ),
        worked_example=(
            "Take the decomposition 2 H2O2 -> 2 H2O + O2, which is slow in a "
            "cool, dilute, undisturbed bottle, and turn each lever. "
            "Concentration: a fresh 30 percent solution fizzes far faster than a "
            "dilute one, because doubling the H2O2 concentration roughly doubles "
            "how often a peroxide molecule is in position to react. Temperature: "
            "warming the bottle speeds it up out of proportion to the small rise "
            "in molecular speed, because many more collisions now carry enough "
            "energy. Surface area: drop in a lump of manganese dioxide solid and "
            "bubbles form at its surface, but grind that same mass to powder and "
            "the reaction is much faster because there is far more surface. "
            "Catalyst: that manganese dioxide, or the enzyme catalase from a "
            "piece of liver, makes the peroxide erupt into oxygen and water, yet "
            "you can filter the solid catalyst out afterward unchanged, because "
            "it was not consumed."
        ),
        try_it_prompt=(
            "A sugar cube reacts more slowly than the same mass of powdered "
            "sugar. Which of the four factors is this, and would it apply to a "
            "reaction between two gases?"
        ),
        try_it_answer=(
            "It is surface area. It would not apply to two gases, because gases "
            "have no surface; surface area only changes the rate of a "
            "heterogeneous reaction that involves a solid."
        ),
        pitfall=(
            "The pitfall is thinking temperature helps mainly by making "
            "molecules move faster and so collide more often. Molecular speed "
            "rises only a few percent for a ten degree warming, while the "
            "fraction of collisions with enough energy rises steeply, and that "
            "second effect is what can double a rate for such a small "
            "temperature change."
        ),
        misconception=None,
        claims=(
            Formula("OO", "H2O2", note="hydrogen peroxide, written H2O2"),
            Formula("O", "H2O", note="water"),
            Formula("O=O", "O2", note="dioxygen"),
        ),
    ),
    "GEN2.INITIALRATES": Lesson(
        node="GEN2.INITIALRATES",
        objective=(
            "Extract each reactant's order from a table of initial rates by "
            "changing one concentration at a time, using the logarithm form when "
            "the order is not obvious by eye."
        ),
        build_on=(
            "Rate laws told you that order is measured rather than read off the "
            "coefficients; this lesson is the exact procedure that measures it."
        ),
        core_idea=(
            "The method of initial rates runs several trials and changes exactly "
            "one concentration between any two you compare, holding the others "
            "fixed, then watches what the rate does. The order in that reactant "
            "is the exponent m in (rate2 / rate1) = (conc2 / conc1)^m. When the "
            "numbers are clean you read m by inspection: doubling a "
            "concentration that doubles the rate is order 1, quadruples it is "
            "order 2, and leaves it unmoved is order 0. When the concentration "
            "ratio is not a tidy power, solve for m directly with logarithms, m "
            "= log(rate2 / rate1) / log(conc2 / conc1), which is the general "
            "tool that also handles the clean cases. Do this for each reactant "
            "in turn, then get the rate constant k by putting any single trial "
            "back into the finished rate law."
        ),
        worked_example=(
            "For a reaction A + B -> C, three trials give the data below, where "
            "the rate values are hypothetical round numbers chosen to make the "
            "arithmetic land cleanly. Trial 1: [A] = 0.10 M, [B] = 0.10 M, rate "
            "= 2.0e-3 M/s. Trial 2: [A] = 0.20 M, [B] = 0.10 M, rate = 4.0e-3 "
            "M/s. Trial 3: [A] = 0.10 M, [B] = 0.15 M, rate = 4.5e-3 M/s. "
            "Compare 1 and 2, where only A changed: A went up by a factor of 2 "
            "and the rate by 4.0e-3 / 2.0e-3 = 2, so 2^m = 2 gives order 1 in A. "
            "Compare 1 and 3, where only B changed by an untidy factor of 1.5: "
            "the rate ratio is 4.5e-3 / 2.0e-3 = 2.25, and inspection stalls "
            "here, so use logs: m = log(2.25) / log(1.5) = 0.352 / 0.176 = 2, so "
            "the order in B is 2. The rate law is rate = k[A][B]^2. Solve for k "
            "with trial 1: k = 2.0e-3 / ((0.10)(0.10)^2) = 2.0e-3 / 1.0e-3 = "
            "2.0, and the units follow from M/s = k * M^3, so k = 2.0 M^-2 s^-1."
        ),
        try_it_prompt=(
            "In one pair of trials the concentration of a reactant rises by a "
            "factor of 2 and the rate rises by a factor of 8. What is the order "
            "in that reactant?"
        ),
        try_it_answer=(
            "It is 3. From 2^m = 8 you get m = 3, and the logarithm form agrees, "
            "m = log(8) / log(2) = 3. The reactant is third order."
        ),
        pitfall=(
            "The pitfall is comparing two trials in which more than one "
            "concentration changed. If both A and B move between the two rows "
            "you cannot say which one caused the rate change, so the method only "
            "works when exactly one concentration differs between the trials you "
            "compare."
        ),
        misconception=None,
        claims=(
            Source(
                "The method of initial rates as a route to reaction orders.",
                "OpenStax Chemistry 2e chapter 12",
            ),
        ),
    ),
    "GEN2.INTEGRATED": Lesson(
        node="GEN2.INTEGRATED",
        objective=(
            "Match a reaction's order to the concentration plot that comes out "
            "straight, and use the matching integrated rate law to find a "
            "concentration at a later time."
        ),
        build_on=(
            "Initial rates found the order from many experiments compared at "
            "time zero; integrated rate laws find it from a single experiment "
            "followed over time."
        ),
        core_idea=(
            "A rate law is a differential equation, and integrating it gives "
            "concentration as a function of time. Three common orders each give "
            "a plot that comes out as a straight line, which is how you spot the "
            "order from one run. Zero order integrates to [A] = [A]0 - kt, so a "
            "plot of [A] against time is straight with slope -k. First order "
            "integrates to ln[A] = ln[A]0 - kt, so a plot of ln[A] against time "
            "is straight with slope -k. Second order integrates to 1 / [A] = 1 / "
            "[A]0 + kt, so a plot of 1 / [A] against time is straight with slope "
            "+k. Take one time course, plot it all three ways, and whichever "
            "comes out linear tells you the order. The units of k differ with "
            "order, which is a free check on which law you have used."
        ),
        worked_example=(
            "Sulfuryl chloride decomposes, SO2Cl2 -> SO2 + Cl2, a first order "
            "reaction; take k = 2.0e-4 s^-1, a round value chosen for the "
            "arithmetic. Start with [SO2Cl2]0 = 0.100 M and find the "
            "concentration after t = 1.0e3 s. Use the first order law ln[A] = "
            "ln[A]0 - kt. The starting log is ln(0.100) = -2.303. The decay term "
            "is kt = (2.0e-4)(1.0e3) = 0.200. So ln[A] = -2.303 - 0.200 = "
            "-2.503, and [A] = e^(-2.503) = 0.0819 M. You could have confirmed "
            "the order first by checking that ln[A] falls in a straight line "
            "against time while [A] itself and 1 / [A] curve, which is the "
            "fingerprint of first order."
        ),
        try_it_prompt=(
            "A first order reaction has k = 0.030 s^-1, a round teaching value, "
            "and starts at 0.50 M. What is the concentration after 20. s?"
        ),
        try_it_answer=(
            "About 0.27 M. Using ln[A] = ln(0.50) - (0.030)(20) = -0.693 - 0.600 "
            "= -1.293, so [A] = e^(-1.293) = 0.274 M."
        ),
        pitfall=(
            "The pitfall is judging the order by how fast the concentration "
            "drops rather than by which plot is straight. A first order and a "
            "second order reaction both slow as they proceed, and only the "
            "straight line test, ln[A] against time versus 1 / [A] against time, "
            "tells the two apart."
        ),
        misconception=None,
        claims=(
            Formula("O=S(=O)(Cl)Cl", "Cl2O2S", note="sulfuryl chloride, written SO2Cl2"),
            Formula("O=S=O", "O2S", note="sulfur dioxide, written SO2"),
            Formula("ClCl", "Cl2", note="dichlorine"),
        ),
    ),
    "GEN2.HALFLIFE": Lesson(
        node="GEN2.HALFLIFE",
        objective=(
            "Compute a first order half life from k and explain why only the "
            "first order half life is independent of the starting "
            "concentration."
        ),
        build_on=(
            "Integrated rate laws gave concentration as a function of time; the "
            "half life is one particular point on those curves, the time to fall "
            "to half."
        ),
        core_idea=(
            "The half life is the time for a concentration to drop to half its "
            "value, and you get it by setting [A] equal to [A]0 / 2 in each "
            "integrated law. For first order this gives t_half = ln(2) / k, with "
            "no [A]0 in it at all, so the half life is a constant: every "
            "successive halving takes the same time no matter how much is left. "
            "That constancy is the defining signature of first order, and it is "
            "why radioactive decay and many drug eliminations are described this "
            "way. For zero order the result is t_half = [A]0 / (2k), which "
            "shrinks as the reaction proceeds, and for second order it is t_half "
            "= 1 / (k[A]0), which grows as the reaction proceeds. Only the first "
            "order half life stands still while the concentration falls."
        ),
        worked_example=(
            "Cyclopropane isomerises to propene in a first order reaction; take "
            "k = 0.0231 min^-1, a round value chosen so the numbers are clean. "
            "The half life is t_half = ln(2) / k = 0.693 / 0.0231 = 30.0 min. "
            "Start at 0.80 M and follow it: after 30 min it is 0.40 M, after "
            "another 30 min 0.20 M, and after a third 0.10 M, so 90 min is three "
            "half lives. The point to notice is that the drop from 0.80 to 0.40 "
            "and the drop from 0.20 to 0.10 each took the same 30 min even "
            "though far less cyclopropane was present the second time. Contrast a "
            "second order reaction started at the same 0.80 M, whose first half "
            "life is 1 / (k[A]0): once the concentration has halved, [A]0 in "
            "that formula has halved, so the next half life is twice as long."
        ),
        try_it_prompt=(
            "A first order reaction has a half life of 12 minutes. What fraction "
            "of the sample remains after 36 minutes, and does that fraction "
            "depend on how much you started with?"
        ),
        try_it_answer=(
            "One eighth, about 12.5 percent, remains. 36 / 12 = 3 half lives, so "
            "(1/2)^3 = 1/8, and for a first order reaction the fraction left "
            "after a set time does not depend on the starting amount."
        ),
        pitfall=(
            "The pitfall is assuming every reaction has a single constant half "
            "life. Only first order does. For a second order reaction each half "
            "life is longer than the one before it, so quoting the half life "
            "without stating the starting concentration says nothing."
        ),
        misconception=None,
        claims=(
            Formula("C1CC1", "C3H6", note="cyclopropane"),
            Formula("CC=C", "C3H6", note="propene, a constitutional isomer of cyclopropane"),
        ),
    ),
    "GEN2.COLLISION": Lesson(
        node="GEN2.COLLISION",
        objective=(
            "Explain why only a small fraction of collisions lead to reaction, "
            "in terms of an energy threshold and an orientation requirement."
        ),
        build_on=(
            "Rate factors showed that temperature has an outsized effect on "
            "rate; collision theory explains why, by looking at what has to be "
            "true for a single collision to react."
        ),
        core_idea=(
            "A reaction needs molecules to collide, but the overwhelming "
            "majority of collisions bounce apart unchanged. Two conditions must "
            "both hold for a collision to react. First, the colliding pair must "
            "arrive with combined energy at least equal to the activation energy "
            "Ea, the height of the barrier between reactants and products. The "
            "fraction of collisions meeting that threshold follows a Boltzmann "
            "factor, exp(-Ea / (R * T)), which climbs steeply as temperature "
            "rises, and that steep climb is why a modest warming produces a "
            "large rate increase. Second, the molecules must be oriented so the "
            "right atoms meet, an effect summarised by a steric factor less than "
            "one. Put together, the rate constant has the shape of a collision "
            "frequency times an orientation factor times exp(-Ea / (R * T)), "
            "which is the structure sitting behind the Arrhenius equation you "
            "meet next."
        ),
        worked_example=(
            "Consider H2 + I2 -> 2 HI. A mole of these gases suffers an enormous "
            "number of collisions every second, yet the reaction is far from "
            "instant at room temperature, and collision theory says why. Take a "
            "barrier of Ea = 50 kJ/mol, a round value chosen for the arithmetic, "
            "and use R = 8.314 J/(mol*K). At T = 300 K the exponent is Ea / (R * "
            "T) = 50000 / (8.314 * 300) = 20.05, so the energetic fraction is "
            "exp(-20.05) = 2.0e-9, meaning only about two collisions in a "
            "billion carry enough energy to break the H-H and I-I bonds. Warm to "
            "310 K and the exponent falls to 50000 / (8.314 * 310) = 19.40, so "
            "the fraction rises to exp(-19.40) = 3.8e-9, nearly double, from a "
            "ten degree change. On top of that, each energetic collision still "
            "fails unless the H2 strikes the I2 in a workable orientation."
        ),
        try_it_prompt=(
            "Two molecules collide carrying far more than the activation energy "
            "but strike each other at the wrong angle. Does the reaction occur, "
            "and which requirement has failed?"
        ),
        try_it_answer=(
            "No, it does not. The energy requirement is met but the orientation "
            "requirement has failed, and both must hold in the same collision "
            "for a reaction to happen."
        ),
        pitfall=(
            "The pitfall is believing heating works mainly by making molecules "
            "collide more often. Collision frequency rises only with about the "
            "square root of temperature, while the energetic fraction exp(-Ea / "
            "(R * T)) rises steeply, and that exponential term is the real "
            "reason rate climbs so fast with temperature."
        ),
        misconception=None,
        claims=(
            Formula("[H][H]", "H2", note="dihydrogen"),
            Formula("II", "I2", note="diiodine"),
            Formula("I", "HI", note="hydrogen iodide, written HI"),
            Source(
                "The gas constant R is 8.314 J/(mol*K).",
                "OpenStax Chemistry 2e, Appendix B (fundamental physical constants)",
            ),
        ),
    ),
    "GEN2.RDS": Lesson(
        node="GEN2.RDS",
        objective=(
            "Derive the rate law a proposed mechanism predicts, including the "
            "case where a fast equilibrium precedes the slow step and an "
            "intermediate must be substituted out."
        ),
        build_on=(
            "Mechanisms introduced elementary steps and the idea that the "
            "slowest one is the bottleneck; here you handle the harder case, "
            "when the slow step is not first and its rate law contains an "
            "intermediate you must eliminate."
        ),
        core_idea=(
            "The slowest elementary step, the rate determining step, sets the "
            "overall rate law. When that step is first you read the rate law "
            "straight off it. When a fast step runs before the slow one, the "
            "slow step's rate law contains an intermediate whose concentration "
            "you cannot set in the flask, and the fix is the pre-equilibrium "
            "approximation: the fast step reaches equilibrium, so you write its "
            "equilibrium expression, solve it for the intermediate in terms of "
            "reactants, and substitute. A mechanism is valid only if, after that "
            "substitution, the predicted rate law contains no intermediates and "
            "matches the measured one, and only if the steps sum to the overall "
            "equation. A product concentration appearing in the denominator of a "
            "rate law is a tell-tale sign that a fast equilibrium precedes the "
            "slow step."
        ),
        worked_example=(
            "Ozone decomposes, 2 O3 -> 3 O2, with the measured rate law rate = "
            "k[O3]^2 / [O2], where a product sits in the denominator. Test this "
            "mechanism: step 1, fast equilibrium, O3 equilibrium with O2 + O; "
            "step 2, slow, O + O3 -> 2 O2. Sum first: adding the steps gives O3 "
            "+ O + O3 -> O2 + O + 2 O2, and the O atom cancels from both sides, "
            "leaving 2 O3 -> 3 O2, which matches. Now the rate law: the slow "
            "step gives rate = k2[O][O3], but O is an intermediate, so use step "
            "1's equilibrium, K1 = [O2][O] / [O3], and solve it for the "
            "intermediate, [O] = K1[O3] / [O2]. Substitute into the slow step: "
            "rate = k2 * (K1[O3] / [O2]) * [O3] = k2 K1 [O3]^2 / [O2] = k[O3]^2 "
            "/ [O2]. This matches the measurement, and the [O2] in the "
            "denominator is exactly the fingerprint left by the fast "
            "equilibrium."
        ),
        try_it_prompt=(
            "A slow step has rate = k2[X][B], where X is an intermediate formed "
            "in a fast equilibrium A equilibrium with X. Write the equilibrium "
            "expression and give the rate in terms of A and B only."
        ),
        try_it_answer=(
            "The equilibrium gives K = [X] / [A], so [X] = K[A]. Substituting, "
            "rate = k2 * K[A] * [B] = k[A][B]. The intermediate X is replaced by "
            "K[A], leaving a rate law in measurable species alone."
        ),
        pitfall=(
            "The pitfall is leaving the intermediate in the final rate law, or "
            "assuming the rate determining step is always the first step. When "
            "the slow step comes second its rate law contains an intermediate, "
            "and a mechanism is not finished until the pre-equilibrium has "
            "eliminated that intermediate in favour of reactants and products."
        ),
        misconception=None,
        claims=(
            Formula("[O-][O+]=O", "O3", note="ozone"),
            Formula("O=O", "O2", note="dioxygen"),
        ),
    ),
    "GEN2.CATALYSIS": Lesson(
        node="GEN2.CATALYSIS",
        objective=(
            "Explain how a catalyst speeds a reaction with a lower barrier "
            "pathway, show that it is regenerated in a catalytic cycle, and "
            "state what it leaves unchanged."
        ),
        build_on=(
            "The Arrhenius lesson showed a catalyst lowers the activation energy "
            "and leaves delta H and K untouched; here you see the mechanism "
            "behind that, the alternate pathway and the cycle that hands the "
            "catalyst back."
        ),
        core_idea=(
            "A catalyst speeds a reaction by opening a new pathway with a lower "
            "activation energy, so a larger fraction of collisions clears the "
            "barrier. It is consumed in an early step and regenerated in a later "
            "one, so it never appears in the overall equation and is not used "
            "up; the same molecule turns over again and again. A homogeneous "
            "catalyst is in the same phase as the reactants, while a "
            "heterogeneous catalyst is in a different phase, usually a solid "
            "surface on which reactants adsorb, react and desorb, and enzymes "
            "are biological catalysts of great specificity. Because the catalyst "
            "lowers the barrier by the same amount in both directions, it speeds "
            "the forward and reverse reactions by the same factor, so it leaves "
            "the equilibrium position and K unchanged and only reaches the same "
            "equilibrium sooner."
        ),
        worked_example=(
            "The decomposition 2 H2O2 -> 2 H2O + O2 is slow on its own but fast "
            "with iodide ion present, through a two step cycle. Step 1: H2O2 + "
            "I- -> H2O + IO-, where IO- is hypoiodite. Step 2: H2O2 + IO- -> H2O "
            "+ O2 + I-. Add the steps: 2 H2O2 + I- + IO- -> 2 H2O + O2 + IO- + "
            "I-, and both I- and IO- cancel, leaving the original 2 H2O2 -> 2 "
            "H2O + O2. Iodide is consumed in step 1 and handed back in step 2, "
            "so it is the catalyst and survives the reaction, while hypoiodite "
            "is made then eaten, so it is an intermediate. The two step route "
            "has a lower activation energy than the single uncatalysed step, "
            "which is why the peroxide breaks down faster, and yet the overall "
            "equation and its energetics are exactly as before."
        ),
        try_it_prompt=(
            "In the cycle above, iodide is a reactant in step 1 and a product in "
            "step 2, while hypoiodite is the reverse. Which one is the catalyst "
            "and which is the intermediate?"
        ),
        try_it_answer=(
            "Iodide is the catalyst, present at the start, consumed and then "
            "regenerated, so it survives the overall reaction. Hypoiodite is the "
            "intermediate, made in step 1 and consumed in step 2, absent from "
            "both the start and the finish."
        ),
        pitfall=(
            "The pitfall is thinking a catalyst raises the yield or shifts the "
            "equilibrium. It lowers the barrier equally in both directions, so "
            "the forward and reverse rates rise together and K does not move; a "
            "catalyst reaches the same equilibrium faster, not a more product "
            "rich one."
        ),
        misconception=None,
        claims=(
            Formula("OO", "H2O2", note="hydrogen peroxide, written H2O2"),
            Formula("O", "H2O", note="water"),
            Formula("O=O", "O2", note="dioxygen"),
        ),
    ),
    "GEN2.KEXPRESSION": Lesson(
        node="GEN2.KEXPRESSION",
        objective=(
            "Write the equilibrium constant expression for any balanced "
            "equation and read the magnitude of K as a statement of how far the "
            "reaction proceeds."
        ),
        build_on=(
            "The equilibrium state showed forward and reverse rates becoming "
            "equal; the equilibrium constant is the fixed ratio of "
            "concentrations that results, and this lesson is how to write it and "
            "read it."
        ),
        core_idea=(
            "For a balanced equation aA + bB equilibrium with cC + dD, the "
            "equilibrium constant is K = ([C]^c [D]^d) / ([A]^a [B]^b): products "
            "over reactants, each concentration raised to its own coefficient. K "
            "is fixed at a given temperature regardless of the amounts you "
            "started with. Its magnitude reads directly as position. A K much "
            "greater than 1 means products dominate at equilibrium, so the "
            "reaction runs nearly to completion; a K much less than 1 means "
            "reactants dominate, so it barely proceeds; a K near 1 means "
            "comparable amounts of each. By convention K is written as a pure "
            "number with no units, because each concentration is taken relative "
            "to a one molar standard state."
        ),
        worked_example=(
            "For 2 SO2(g) + O2(g) equilibrium with 2 SO3(g), write the "
            "expression with care over the exponents: K = [SO3]^2 / ([SO2]^2 "
            "[O2]). The SO3 coefficient 2 becomes a square in the numerator, the "
            "SO2 coefficient 2 becomes a square in the denominator, and the O2 "
            "coefficient 1 becomes a first power. Suppose at equilibrium [SO2] = "
            "0.20 M, [O2] = 0.10 M and [SO3] = 2.0 M, values chosen round for "
            "the arithmetic. The numerator is (2.0)^2 = 4.0, and the denominator "
            "is (0.20)^2 (0.10) = (0.040)(0.10) = 0.0040, so K = 4.0 / 0.0040 = "
            "1.0e3. A K of 1000 is far greater than 1, so at this temperature "
            "the sulfur sits mostly as the trioxide and the reaction has run "
            "nearly to completion."
        ),
        try_it_prompt=(
            "Two reactions at the same temperature have K = 3.0e8 and K = "
            "5.0e-6. In which does the forward reaction proceed nearly to "
            "completion, and in which does it barely proceed?"
        ),
        try_it_answer=(
            "The one with K = 3.0e8, far greater than 1, proceeds nearly to "
            "completion with products dominating. The one with K = 5.0e-6, far "
            "less than 1, barely proceeds, with reactants dominating."
        ),
        pitfall=(
            "The pitfall is writing reactants over products, or attaching units "
            "to K. The expression is always products over reactants each raised "
            "to its coefficient, and by the standard state convention K carries "
            "no units; flipping the ratio inverts K and misreads a product "
            "favoured reaction as reactant favoured."
        ),
        misconception=None,
        claims=(
            Formula("O=S=O", "O2S", note="sulfur dioxide, written SO2"),
            Formula("O=O", "O2", note="dioxygen"),
            Formula("O=S(=O)=O", "O3S", note="sulfur trioxide, written SO3"),
        ),
    ),
    "GEN2.KCKP": Lesson(
        node="GEN2.KCKP",
        objective=(
            "Convert between Kc and Kp for a gas phase reaction using Kp = "
            "Kc(RT)^(delta n), where delta n is the change in moles of gas."
        ),
        build_on=(
            "Writing K used concentrations; for gases you can build the same "
            "constant from partial pressures, and this lesson relates the two "
            "constants that result."
        ),
        core_idea=(
            "For a gas reaction you can build the equilibrium constant from "
            "molar concentrations, giving Kc, or from partial pressures in "
            "atmospheres, giving Kp. The two are tied together by the ideal gas "
            "law PV = nRT, which makes a partial pressure proportional to a "
            "concentration at fixed temperature. The relationship is Kp = "
            "Kc(RT)^(delta n), where delta n = (moles of gas among the products) "
            "minus (moles of gas among the reactants), read straight off the "
            "coefficients. When delta n = 0 the factor (RT)^0 = 1 and Kp equals "
            "Kc with no conversion needed. The R that pairs atmospheres with "
            "molarity is 0.08206 L*atm/(mol*K)."
        ),
        worked_example=(
            "Take 2 SO2(g) + O2(g) equilibrium with 2 SO3(g) at T = 1000 K, a "
            "round temperature chosen for the arithmetic, with Kc = 2.8e2, a "
            "chosen round teaching value. Count gas moles: products have 2 and "
            "reactants have 2 + 1 = 3, so delta n = 2 - 3 = -1. Then Kp = "
            "Kc(RT)^(-1) = 280 / (0.08206 * 1000) = 280 / 82.06 = 3.4. Because "
            "the gas moles fall, delta n is negative and Kp comes out smaller "
            "than Kc. For contrast take H2(g) + I2(g) equilibrium with 2 HI(g), "
            "where products and reactants both have 2 moles of gas, so delta n = "
            "0, the factor (RT)^0 = 1, and Kp equals Kc exactly with nothing to "
            "compute."
        ),
        try_it_prompt=(
            "For N2(g) + 3 H2(g) equilibrium with 2 NH3(g), what is delta n, and "
            "does converting Kc to Kp multiply or divide by a power of RT?"
        ),
        try_it_answer=(
            "delta n = 2 - (1 + 3) = -2, so Kp = Kc(RT)^(-2), which divides by "
            "(RT)^2. The gas moles fall by two, so the exponent on RT is "
            "negative."
        ),
        pitfall=(
            "The pitfall is counting every species instead of only the gases, or "
            "getting the sign of delta n backward. Only gas phase moles enter "
            "delta n, and delta n is products minus reactants; reversing it "
            "inverts the RT factor and pushes the conversion the wrong way."
        ),
        misconception=None,
        claims=(
            Formula("O=S=O", "O2S", note="sulfur dioxide, written SO2"),
            Formula("O=O", "O2", note="dioxygen"),
            Formula("O=S(=O)=O", "O3S", note="sulfur trioxide, written SO3"),
            Formula("[H][H]", "H2", note="dihydrogen"),
            Formula("II", "I2", note="diiodine"),
            Formula("I", "HI", note="hydrogen iodide, written HI"),
            Source(
                "The gas constant R is 0.08206 L*atm/(mol*K).",
                "CRC Handbook of Chemistry and Physics, table of fundamental physical constants",
            ),
        ),
    ),
    "GEN2.HETEROGENEOUS": Lesson(
        node="GEN2.HETEROGENEOUS",
        objective=(
            "Write the equilibrium expression for a reaction involving pure "
            "solids or liquids, leaving those species out, and explain why they "
            "are omitted."
        ),
        build_on=(
            "Writing K put every species into the expression; this lesson is the "
            "exception, the pure solids and liquids that are left out, and the "
            "reason they are."
        ),
        core_idea=(
            "A heterogeneous equilibrium spans more than one phase, such as a "
            "solid in equilibrium with a gas. The rule is that pure solids and "
            "pure liquids do not appear in K. The reason is that the effective "
            "concentration of a pure condensed phase does not change as the "
            "reaction runs: a block of solid holds the same molecules per unit "
            "volume whether the block is large or small, so its activity is "
            "fixed at 1, and multiplying K by a constant 1 changes nothing. Only "
            "species whose concentration can vary, meaning gases and dissolved "
            "solutes, appear in the expression. This is the same reason a "
            "solubility product leaves out the undissolved solid."
        ),
        worked_example=(
            "For CaCO3(s) equilibrium with CaO(s) + CO2(g), both CaCO3 and CaO "
            "are pure solids, so neither appears, and only the gas remains: Kp = "
            "P(CO2), or in concentration terms Kc = [CO2]. This says the CO2 "
            "pressure over the solids at equilibrium depends only on temperature, "
            "not on how much solid is present, so a sealed jar with one gram of "
            "limestone and a jar with one kilogram reach the same CO2 pressure. "
            "Take a second case, C(s) + CO2(g) equilibrium with 2 CO(g): the "
            "solid carbon drops out, leaving Kc = [CO]^2 / [CO2]. In each "
            "reaction you keep only what can change and discard the pure "
            "condensed phases."
        ),
        try_it_prompt=(
            "For 2 H2O(l) equilibrium with 2 H2(g) + O2(g), which species appear "
            "in Kc and which are omitted, and why?"
        ),
        try_it_answer=(
            "Only the gases appear, giving Kc = [H2]^2 [O2]. Liquid water is "
            "omitted because a pure liquid has a fixed activity of 1 that does "
            "not change as the reaction proceeds."
        ),
        pitfall=(
            "The pitfall is putting a solid or pure liquid into the expression, "
            "or thinking that adding more solid shifts the equilibrium. The "
            "amount of a pure solid or liquid never enters K, so piling in more "
            "limestone does not raise the CO2 pressure; its presence matters, "
            "its quantity does not."
        ),
        misconception=None,
        claims=(
            Formula("[Ca+2].[O-]C([O-])=O", "CCaO3", note="calcium carbonate, written CaCO3"),
            Formula("[Ca]=O", "CaO", note="calcium oxide"),
            Formula("O=C=O", "CO2", note="carbon dioxide"),
            Formula("[C-]#[O+]", "CO", note="carbon monoxide"),
            Formula("O", "H2O", note="water"),
            Formula("[H][H]", "H2", note="dihydrogen"),
            Formula("O=O", "O2", note="dioxygen"),
        ),
    ),
    "GEN2.MANIPULATEK": Lesson(
        node="GEN2.MANIPULATEK",
        objective=(
            "Find the equilibrium constant for a reversed, scaled or summed "
            "reaction from the constants of the reactions you start with."
        ),
        build_on=(
            "Writing K gave you the constant for one equation as it stands; this "
            "lesson is what happens to that constant when you reverse the "
            "equation, multiply it through, or add two equations together."
        ),
        core_idea=(
            "Because K depends on how the equation is written, three "
            "manipulations carry three rules. Reversing a reaction swaps "
            "products and reactants, so the new constant is the reciprocal, "
            "K_reverse = 1 / K_forward. Multiplying an equation through by a "
            "factor n turns every coefficient into an exponent, so the new "
            "constant is the old one raised to that power, K^n. Adding two "
            "reactions makes the constant of the sum the product of the "
            "individual constants, K_total = K1 * K2, because the shared "
            "intermediate cancels and the constants multiply. This last rule is "
            "Hess's law carried over into equilibrium, and together the three "
            "let you build a hard to measure K out of easier ones."
        ),
        worked_example=(
            "Let reaction 1, A equilibrium with B, have K1 = 4.0, and reaction "
            "2, B equilibrium with C, have K2 = 5.0, both round teaching values. "
            "Reverse reaction 1 to get B equilibrium with A: the constant is 1 / "
            "K1 = 1 / 4.0 = 0.25. Double reaction 1 to get 2 A equilibrium with "
            "2 B: the constant is (K1)^2 = (4.0)^2 = 16. Add reactions 1 and 2 "
            "to get A equilibrium with C: the shared B is a product of the first "
            "and a reactant of the second, so it cancels, and the constant is K1 "
            "* K2 = 4.0 * 5.0 = 20. Each rule was applied on its own; string "
            "them together and you can reach a constant you never measured "
            "directly."
        ),
        try_it_prompt=(
            "A reaction has K = 8.0. What is K for the reverse reaction, and "
            "what is K for the reaction written with all coefficients halved?"
        ),
        try_it_answer=(
            "The reverse reaction has K = 1 / 8.0 = 0.125. Halving the "
            "coefficients raises K to the one half power, so K = (8.0)^(1/2) = "
            "sqrt(8.0) = 2.83."
        ),
        pitfall=(
            "The pitfall is adding constants when you add reactions, or leaving K "
            "unchanged when you scale an equation. Adding reactions multiplies "
            "their constants rather than adding them, and multiplying an "
            "equation through raises K to that power; only reversing a reaction "
            "takes a reciprocal."
        ),
        misconception=None,
        claims=(
            Source(
                "The rules for combining equilibrium constants when reactions are reversed, scaled or added.",
                "OpenStax Chemistry 2e chapter 13",
            ),
        ),
    ),
    "GEN2.QUOTIENT": Lesson(
        node="GEN2.QUOTIENT",
        objective=(
            "Compute the reaction quotient Q from current concentrations and "
            "compare it to K to predict which direction the reaction will run."
        ),
        build_on=(
            "K is the ratio of products to reactants at equilibrium; the "
            "reaction quotient Q is that same ratio computed at any moment, and "
            "comparing the two tells you which way the reaction must move."
        ),
        core_idea=(
            "Q has exactly the form of K, products over reactants each raised to "
            "its coefficient, but you plug in whatever concentrations exist right "
            "now rather than the equilibrium ones. Comparing Q to K gives the "
            "direction. Q less than K means too few products, so the reaction "
            "runs forward to make more; Q greater than K means too many "
            "products, so it runs in reverse; Q equal to K means it is already "
            "at equilibrium and does not move. Two extremes are worth keeping in "
            "mind: with only reactants present Q = 0, always below K, so the "
            "reaction must go forward, and with only products present Q is "
            "enormous, above any finite K, so it must go in reverse. As the "
            "reaction proceeds Q always moves steadily toward K."
        ),
        worked_example=(
            "For H2(g) + I2(g) equilibrium with 2 HI(g), take K = 50, a round "
            "teaching value. A flask now holds [H2] = 0.10 M, [I2] = 0.10 M and "
            "[HI] = 0.10 M. Compute Q = [HI]^2 / ([H2][I2]) = (0.10)^2 / "
            "((0.10)(0.10)) = 0.010 / 0.010 = 1.0. Since Q = 1.0 is well below K "
            "= 50, there are too few products, so the reaction runs forward, "
            "using up H2 and I2 to make HI until Q climbs to 50. Now test a "
            "second snapshot, [H2] = 0.010 M, [I2] = 0.010 M, [HI] = 1.0 M: Q = "
            "(1.0)^2 / ((0.010)(0.010)) = 1.0 / 1.0e-4 = 1.0e4, which is far "
            "above K = 50, so this mixture holds too much HI and runs in reverse "
            "instead."
        ),
        try_it_prompt=(
            "For the same reaction with K = 50, a flask contains only H2 and I2 "
            "and no HI at all. What is Q, and which way does the reaction go?"
        ),
        try_it_answer=(
            "Q = 0, because the numerator [HI]^2 is zero. Q = 0 is less than K = "
            "50, so the reaction runs forward; with no product present it can "
            "only go one way."
        ),
        pitfall=(
            "The pitfall is comparing Q and K while forgetting they must be for "
            "the same reaction written the same way. Reverse the equation and K "
            "becomes 1 / K while the Q expression flips too, so pairing a "
            "forward Q with a reverse K predicts the wrong direction."
        ),
        misconception=None,
        claims=(
            Formula("[H][H]", "H2", note="dihydrogen"),
            Formula("II", "I2", note="diiodine"),
            Formula("I", "HI", note="hydrogen iodide, written HI"),
        ),
    ),
    "GEN2.KTEMPERATURE": Lesson(
        node="GEN2.KTEMPERATURE",
        objective=(
            "Predict whether K rises or falls when temperature changes by "
            "treating heat as a reactant or product, and estimate the change "
            "with the van't Hoff relation."
        ),
        build_on=(
            "Le Chatelier's principle told you that of all the stresses only "
            "temperature actually changes K; this lesson is how it changes K, "
            "and by how much."
        ),
        core_idea=(
            "Temperature is the one stress that changes K itself, because heat "
            "behaves like a reactant or a product. For an exothermic reaction "
            "heat is a product, so raising the temperature is like adding "
            "product and the equilibrium shifts back toward reactants: K falls. "
            "For an endothermic reaction heat is a reactant, so heating shifts "
            "it forward and K rises. The quantitative form is the van't Hoff "
            "equation, ln(K2 / K1) = -(delta H / R)(1 / T2 - 1 / T1), which "
            "mirrors the Arrhenius equation and lets you find K at one "
            "temperature from K at another. The sign of delta H sets the "
            "direction, so a negative, exothermic delta H makes K fall as T "
            "rises. The R here is 8.314 J/(mol*K)."
        ),
        worked_example=(
            "Take an exothermic reaction with delta H = -100 kJ/mol and K1 = 100 "
            "at T1 = 300 K, both round teaching values chosen for the "
            "arithmetic, and use R = 8.314 J/(mol*K). Find K2 at T2 = 400 K. "
            "Convert delta H to -1.00e5 J/mol so the units match. The "
            "temperature term is 1 / T2 - 1 / T1 = 1 / 400 - 1 / 300 = 0.002500 "
            "- 0.003333 = -8.33e-4 per K. The prefactor is -(delta H / R) = "
            "-(-1.00e5 / 8.314) = +1.203e4. Multiply: ln(K2 / K1) = (1.203e4)"
            "(-8.33e-4) = -10.02, so K2 / K1 = e^(-10.02) = 4.4e-5 and K2 = 100 "
            "* 4.4e-5 = 4.4e-3. Heating this exothermic reaction from 300 to 400 "
            "K collapsed K from 100 to about 0.0044, a swing toward reactants "
            "exactly as treating heat as a product predicts."
        ),
        try_it_prompt=(
            "An endothermic reaction has K = 1.0e-3 at low temperature. Without "
            "any calculation, does K get larger or smaller as you heat it, and "
            "why?"
        ),
        try_it_answer=(
            "Larger. For an endothermic reaction heat is effectively a reactant, "
            "so adding heat pushes the equilibrium forward toward products and "
            "raises K. Only an exothermic reaction has K fall with heating."
        ),
        pitfall=(
            "The pitfall is thinking that raising the temperature always "
            "increases K because it speeds the reaction up. Heating speeds how "
            "fast equilibrium is reached for any reaction, but it moves K up "
            "only for endothermic reactions and down for exothermic ones; the "
            "direction follows the sign of delta H, not the fact that things got "
            "faster."
        ),
        misconception=None,
        claims=(
            Source(
                "The gas constant R is 8.314 J/(mol*K).",
                "OpenStax Chemistry 2e, Appendix B (fundamental physical constants)",
            ),
        ),
    ),
}
