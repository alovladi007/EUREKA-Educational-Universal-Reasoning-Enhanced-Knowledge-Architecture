"""GEN2 fill B: the missing acid-base equilibria and buffer/titration lessons.

Fifteen lessons that fill the gaps left in GEN2 Unit 3 (acids and bases) and
Unit 4 (buffers and titration), authored in the same six part arc as
app/data/lessons_gen2.py and in the same second person, worked-in-full voice.

Honesty of numbers. Any measured constant stated in prose carries a Source
claim naming a real reference. Only three measured values are cited here, all
from OpenStax Chemistry 2e and all standard: Kw = 1.0e-14 at 25 C, acetic acid
Ka = 1.8e-5, and ammonia Kb = 1.8e-5. Every other number a worked example needs
is a round teaching value, and the prose says so each time it is introduced,
chosen to keep the arithmetic clean rather than to describe a real substance.
Values derived from the cited ones (pKa = 4.74, the acetate Kb = 5.6e-10, the
ammonium Ka = 5.6e-10) are shown with their arithmetic rather than asserted.

Where a real molecule is named, a Formula claim re-derivable by RDKit sits
beside it so the prose and the structure cannot drift apart.
"""

from __future__ import annotations

from app.data.claims import Formula, Source
from app.data.lesson_types import Lesson

# Cited measured values, written once so every lesson that leans on one points
# at the same accountable statement.
KW_SOURCE = Source(
    "Water autoionizes with Kw = [H3O+][OH-] = 1.0 x 10^-14 at 25 C, so pure "
    "water holds [H3O+] = [OH-] = 1.0 x 10^-7 M and pH + pOH = 14.00.",
    "OpenStax Chemistry 2e, Chapter 14 (Acid-Base Equilibria), ion-product "
    "constant of water.",
)
ACETIC_KA_SOURCE = Source(
    "Acetic acid has Ka = 1.8 x 10^-5 at 25 C, so pKa = 4.74.",
    "OpenStax Chemistry 2e, Appendix H (Ionization Constants of Weak Acids), "
    "acetic acid.",
)
AMMONIA_KB_SOURCE = Source(
    "Ammonia has Kb = 1.8 x 10^-5 at 25 C.",
    "OpenStax Chemistry 2e, Appendix I (Ionization Constants of Weak Bases), "
    "ammonia.",
)

LESSONS_GEN2_FILL_B: dict[str, Lesson] = {
    "GEN2.AMPHOTERIC": Lesson(
        node="GEN2.AMPHOTERIC",
        objective=(
            "Explain why water is amphoteric, write its autoionization "
            "equilibrium, and use Kw to convert between [H3O+] and [OH-] at "
            "25 C."
        ),
        build_on=(
            "You have learned to spot a conjugate acid base pair, and the "
            "oddest pair of all is water with itself, one molecule handing a "
            "proton to another."
        ),
        core_idea=(
            "A species that can either donate or accept a proton is amphoteric, "
            "and water is the headline example: it acts as an acid toward "
            "ammonia and as a base toward hydrogen chloride. Because water can "
            "do both, a little of it reacts with itself, which is called "
            "autoionization, 2 H2O equilibrium with H3O+ + OH-. The equilibrium "
            "constant for that is the ion-product of water, Kw = [H3O+][OH-] = "
            "1.0e-14 at 25 C. Two consequences follow that you will use "
            "constantly. First, in any aqueous solution the product of the two "
            "concentrations is fixed at Kw, so pushing one up forces the other "
            "down. Second, in pure water the two must be equal, and setting "
            "[H3O+] = [OH-] in the Kw expression gives each of them as the "
            "square root of Kw, which is 1.0e-7 M. That is where neutral comes "
            "from. Other species are amphoteric too, such as bicarbonate HCO3-, "
            "which can lose its proton to become carbonate or gain one to become "
            "carbonic acid."
        ),
        worked_example=(
            "A solution is prepared with [H3O+] = 1.0e-4 M, a round value chosen "
            "to keep the arithmetic clean. Find [OH-] and decide whether the "
            "solution is acidic or basic. The single tool you need is Kw, which "
            "holds in every aqueous solution, not only in pure water: "
            "[H3O+][OH-] = 1.0e-14. Solve for the hydroxide concentration by "
            "dividing, [OH-] = 1.0e-14 / 1.0e-4 = 1.0e-10 M. Compare the two "
            "numbers. The hydronium concentration 1.0e-4 M sits above the "
            "neutral 1.0e-7 M, and the hydroxide concentration 1.0e-10 M sits "
            "below it by the same factor, so the solution is acidic. Notice the "
            "seesaw: the two concentrations moved by a thousandfold in opposite "
            "directions, and their product stayed pinned at 1.0e-14 the whole "
            "time, because Kw is a constant at 25 C no matter what you dissolved."
        ),
        try_it_prompt=(
            "A solution has [OH-] = 1.0e-3 M at 25 C. What is [H3O+], and is the "
            "solution acidic, basic or neutral?"
        ),
        try_it_answer=(
            "[H3O+] = 1.0e-11 M, and the solution is basic. Divide Kw by the "
            "known concentration, 1.0e-14 / 1.0e-3 = 1.0e-11 M, which is below "
            "the neutral 1.0e-7 M, while the hydroxide at 1.0e-3 M is above it."
        ),
        pitfall=(
            "The pitfall is thinking hydroxide is absent from an acidic "
            "solution. It is never zero, because Kw must hold: an acidic "
            "solution with [H3O+] = 1.0e-4 M still contains 1.0e-10 M hydroxide, "
            "a small number but not nothing, and that leftover hydroxide is what "
            "a base added later has to overcome first."
        ),
        claims=(
            KW_SOURCE,
            Formula("O", "H2O", "water"),
            Formula("[OH3+]", "H3O+", "hydronium ion"),
            Formula("[OH-]", "HO-", "hydroxide ion"),
            Formula("OC(=O)[O-]", "CHO3-", "bicarbonate, an amphoteric ion"),
        ),
    ),
    "GEN2.STRONGACID": Lesson(
        node="GEN2.STRONGACID",
        objective=(
            "Recognize the common strong acids and strong bases, and compute pH "
            "or pOH directly from the concentration of one, treating ionization "
            "as complete."
        ),
        build_on=(
            "You have the pH scale now, and a strong acid is the case where "
            "finding pH needs no equilibrium at all, because the acid ionizes "
            "completely."
        ),
        core_idea=(
            "A strong acid hands over its proton to water essentially all the "
            "way, so there is no equilibrium to solve: the hydronium "
            "concentration equals the acid concentration you started with. The "
            "short list worth memorizing is six strong acids, HCl, HBr, HI, "
            "HNO3, H2SO4 and HClO4, and the strong bases, which are the group 1 "
            "hydroxides such as NaOH plus the heavier group 2 hydroxides "
            "Ca(OH)2, Sr(OH)2 and Ba(OH)2. Anything not on those lists is weak "
            "and needs a Ka or Kb. For a strong acid HA at concentration C, "
            "[H3O+] = C and the pH follows at once. For a strong base you watch "
            "the formula: NaOH gives one hydroxide per unit, but Ca(OH)2 gives "
            "two, so its [OH-] is twice the salt concentration. Work strong "
            "bases through pOH first, then subtract from 14.00 to reach pH."
        ),
        worked_example=(
            "Find the pH of 0.010 M HCl, then the pH of 0.0050 M Ca(OH)2. "
            "Hydrochloric acid is on the strong list, so it ionizes completely "
            "and [H3O+] = 0.010 M = 1.0e-2 M. Then pH = -log(1.0e-2) = 2.00, "
            "with no ICE table anywhere, because there is no reverse reaction to "
            "balance. For the base, calcium hydroxide is strong and each formula "
            "unit releases two hydroxide ions, so [OH-] = 2 * 0.0050 = 0.010 M. "
            "Go through pOH: pOH = -log(0.010) = 2.00, and then pH = 14.00 - "
            "2.00 = 12.00. Sanity check the pair: the acid landed well below 7 "
            "and the base well above it, and the base needed the factor of two "
            "that the acid did not, which is the one place the formula of a "
            "strong base bites."
        ),
        try_it_prompt=(
            "What is the pH of 0.0025 M HNO3, and what is the pH of 0.0025 M "
            "NaOH?"
        ),
        try_it_answer=(
            "The acid gives pH = -log(0.0025) = 2.60. The base gives [OH-] = "
            "0.0025 M since NaOH releases one hydroxide per unit, so pOH = 2.60 "
            "and pH = 14.00 - 2.60 = 11.40."
        ),
        pitfall=(
            "The pitfall is forgetting that Ca(OH)2, Sr(OH)2 and Ba(OH)2 each "
            "release two hydroxide ions. Reading 0.0050 M Ca(OH)2 as [OH-] = "
            "0.0050 M instead of 0.010 M shifts the pOH by 0.30 and the reported "
            "pH along with it. Check the formula before you write the hydroxide "
            "concentration."
        ),
        claims=(
            Source(
                "The common strong acids are HCl, HBr, HI, HNO3, H2SO4 and "
                "HClO4; the common strong bases are the group 1 hydroxides and "
                "the heavier group 2 hydroxides Ca(OH)2, Sr(OH)2 and Ba(OH)2.",
                "OpenStax Chemistry 2e, Section 14.3 (Relative Strengths of "
                "Acids and Bases).",
            ),
            Formula("Cl", "HCl", "hydrogen chloride"),
            Formula("O[N+](=O)[O-]", "HNO3", "nitric acid"),
            Formula("[Na+].[OH-]", "HNaO", "sodium hydroxide"),
        ),
    ),
    "GEN2.WEAKBASE": Lesson(
        node="GEN2.WEAKBASE",
        objective=(
            "Calculate the pH of a weak base solution from Kb by solving an ICE "
            "table for [OH-] and converting through pOH."
        ),
        build_on=(
            "A weak acid gave you an ICE table solved for [H3O+] through Ka, and "
            "a weak base is the mirror image of that problem, solved for [OH-] "
            "through Kb."
        ),
        core_idea=(
            "A weak base pulls a proton off water only partially, so it is an "
            "equilibrium, B + H2O equilibrium with BH+ + OH-, and Kb = "
            "[BH+][OH-] / [B] measures how far it goes. The machinery is exactly "
            "the weak acid machinery with two changes to stay alert to. First, "
            "the unknown x you solve for is [OH-], not [H3O+], because a base "
            "makes hydroxide. Second, once you have x you are only halfway: you "
            "get pOH from it and then subtract from 14.00 to reach pH, rather "
            "than reading pH straight off. As before you may approximate C - x "
            "as C when x is small, and you must confirm afterward that x is less "
            "than 5 percent of the starting concentration rather than assume it. "
            "The result of a weak base problem is a pH above 7, which is the "
            "check that you did not accidentally report the pOH as the pH."
        ),
        worked_example=(
            "Find the pH of 0.100 M ammonia, Kb = 1.8e-5. Set up the ICE table "
            "for NH3 + H2O equilibrium with NH4+ + OH-: initial 0.100 for NH3 "
            "and 0 for both products, change -x and +x and +x, equilibrium "
            "(0.100 - x), x, x. Substitute into Kb = x^2 / (0.100 - x) = 1.8e-5. "
            "Try the approximation by dropping x from the denominator: x^2 = "
            "(1.8e-5)(0.100) = 1.8e-6, so x = sqrt(1.8e-6) = 1.34e-3 M, and this "
            "x is [OH-]. Validate before continuing: 1.34e-3 / 0.100 = 0.0134, "
            "which is 1.3 percent, under 5 percent, so the shortcut holds. Now "
            "finish through pOH, which is the step a weak acid problem does not "
            "have: pOH = -log(1.34e-3) = 2.87, and pH = 14.00 - 2.87 = 11.13. "
            "The pH landed above 7, exactly as a base must, confirming you "
            "carried the pOH conversion through rather than stopping at 2.87."
        ),
        try_it_prompt=(
            "A weak base has Kb = 1.0e-6, a round teaching value, at 0.10 M. "
            "Find [OH-] with the approximation, then the pH."
        ),
        try_it_answer=(
            "[OH-] = sqrt((1.0e-6)(0.10)) = sqrt(1.0e-7) = 3.2e-4 M. Then pOH = "
            "-log(3.2e-4) = 3.49 and pH = 14.00 - 3.49 = 10.51, above 7 as a "
            "base requires."
        ),
        pitfall=(
            "The pitfall is reporting x as the pH. In a weak base problem x is "
            "[OH-], so -log(x) is the pOH, and stopping there labels the "
            "ammonia solution above as pH 2.87 rather than its true pH 11.13. "
            "The tell is that a base solution came out acidic, which cannot be "
            "right, so subtract from 14.00."
        ),
        claims=(
            AMMONIA_KB_SOURCE,
            KW_SOURCE,
            Formula("N", "H3N", "ammonia"),
            Formula("[NH4+]", "H4N+", "ammonium ion"),
        ),
    ),
    "GEN2.KAKB": Lesson(
        node="GEN2.KAKB",
        objective=(
            "Use Ka * Kb = Kw for a conjugate pair to find one constant from the "
            "other, and convert the relationship into pKa + pKb = 14.00 at "
            "25 C."
        ),
        build_on=(
            "You can measure a Ka for an acid and a Kb for a base, and this "
            "lesson ties the two together for a conjugate pair with a single "
            "equation."
        ),
        core_idea=(
            "An acid and its conjugate base are not independent, and the link is "
            "clean: for any conjugate pair, Ka * Kb = Kw = 1.0e-14 at 25 C. "
            "Multiply the acid's ionization equilibrium by the base's and the "
            "intermediate species cancel, leaving the autoionization of water, "
            "which is why the two constants multiply to Kw. The practical payoff "
            "is that a table needs to list only one of the pair, because you get "
            "the other by dividing into Kw. Taking the negative log of the whole "
            "equation turns the product into a sum, pKa + pKb = 14.00, which is "
            "the form most people remember. The relationship also carries the "
            "qualitative rule with numbers attached: a stronger acid has a "
            "larger Ka, so its conjugate base has a smaller Kb, and the stronger "
            "one partner is the weaker the other must be, since their product "
            "cannot change."
        ),
        worked_example=(
            "Ammonia has Kb = 1.8e-5. Find the Ka of its conjugate acid, the "
            "ammonium ion NH4+, and express both as p-values. Because ammonia "
            "and ammonium are a conjugate pair, Ka * Kb = Kw, so Ka = Kw / Kb = "
            "1.0e-14 / 1.8e-5 = 5.6e-10. That tiny Ka says ammonium is a very "
            "weak acid, which fits: ammonia is a middling base, so its partner "
            "sits far to the weak side. Now the logarithms. pKb = -log(1.8e-5) "
            "= 5 - log(1.8) = 5 - 0.26 = 4.74. And pKa = -log(5.6e-10), which "
            "you can get the long way or read straight off the sum rule as pKa = "
            "14.00 - 4.74 = 9.26. Check that the two p-values add to 14.00: 4.74 "
            "+ 9.26 = 14.00, exactly as pKa + pKb = 14.00 demands."
        ),
        try_it_prompt=(
            "A weak acid has pKa = 3.00, a round teaching value. What is the pKb "
            "of its conjugate base, and is that base strong or weak?"
        ),
        try_it_answer=(
            "pKb = 14.00 - 3.00 = 11.00. A pKb that large means a very small Kb, "
            "so the conjugate base is weak. The fairly strong acid, pKa 3.00, "
            "leaves behind a correspondingly weak conjugate base."
        ),
        pitfall=(
            "The pitfall is expecting the conjugate base of a strong acid to be "
            "a strong base. The product Ka * Kb is fixed at Kw, so a large Ka "
            "forces a tiny Kb: the very strong acid HCl leaves a conjugate base, "
            "chloride, so weak it does nothing in water. Strength in a pair runs "
            "in opposite directions, never the same way."
        ),
        claims=(
            AMMONIA_KB_SOURCE,
            KW_SOURCE,
            Formula("N", "H3N", "ammonia"),
            Formula("[NH4+]", "H4N+", "ammonium ion"),
        ),
    ),
    "GEN2.APPROXIMATION": Lesson(
        node="GEN2.APPROXIMATION",
        objective=(
            "Compute percent ionization for a weak acid, show how it rises on "
            "dilution, and use the 5 percent test to decide whether the small x "
            "approximation is honest."
        ),
        build_on=(
            "The weak acid lesson let you drop x from the denominator when it "
            "was small, and this lesson turns that habit into a measured "
            "quantity, percent ionization, and pins down exactly when the "
            "shortcut is honest."
        ),
        core_idea=(
            "Percent ionization is the fraction of acid molecules that have "
            "given up their proton, written as percent ionization = "
            "([H3O+] at equilibrium / C initial) * 100. Using the approximation "
            "x = sqrt(Ka * C), that fraction becomes x / C = sqrt(Ka / C) * 100, "
            "which carries a result that surprises people: as C shrinks, the "
            "percent ionization grows, so a dilute weak acid ionizes a larger "
            "fraction of itself than a concentrated one. The amount of hydronium "
            "still falls on dilution, but the share of the acid that has ionized "
            "climbs. That same ratio x / C is the number the 5 percent test "
            "watches. When it stays under 5 percent the C - x approximation is "
            "honest and you keep it; when it climbs past 5 percent the "
            "approximation has broken and you must solve the quadratic. The two "
            "ideas are one idea: percent ionization is both the answer to a "
            "question and the gate on the shortcut."
        ),
        worked_example=(
            "Take a weak acid with Ka = 1.0e-5, a round teaching value chosen "
            "for clean arithmetic rather than a real substance, and compare its "
            "percent ionization at 1.0 M and at 0.0010 M. At 1.0 M, x = "
            "sqrt((1.0e-5)(1.0)) = sqrt(1.0e-5) = 3.16e-3 M, so percent "
            "ionization = (3.16e-3 / 1.0) * 100 = 0.32 percent, and that 0.32 "
            "percent is safely under 5 percent, so the shortcut was fair. Now "
            "dilute to 0.0010 M: x = sqrt((1.0e-5)(1.0e-3)) = sqrt(1.0e-8) = "
            "1.0e-4 M, so percent ionization = (1.0e-4 / 1.0e-3) * 100 = 10 "
            "percent. The hydronium concentration dropped from 3.16e-3 to "
            "1.0e-4 M, yet the fraction ionized rose from 0.32 percent to 10 "
            "percent, more than thirty times higher. And that 10 percent is over "
            "the 5 percent line, so at 0.0010 M you would abandon the shortcut "
            "and solve the quadratic instead."
        ),
        try_it_prompt=(
            "For the same teaching acid, Ka = 1.0e-5, at what concentration does "
            "the percent ionization reach 1 percent?"
        ),
        try_it_answer=(
            "At 0.10 M. Percent ionization is sqrt(Ka / C), so set sqrt(1.0e-5 / "
            "C) = 0.01, giving 1.0e-5 / C = 1.0e-4 and C = 1.0e-5 / 1.0e-4 = "
            "0.10 M. More dilute than that and the acid ionizes past 1 percent."
        ),
        pitfall=(
            "The pitfall is believing that diluting a weak acid always makes it "
            "less ionized. Dilution lowers the hydronium concentration but "
            "raises the percent ionized, and at 0.0010 M above the fraction hit "
            "10 percent, which is exactly the regime where the small x shortcut "
            "fails and a quadratic is required."
        ),
        claims=(
            Source(
                "The five percent rule for validating the small x approximation.",
                "OpenStax Chemistry 2e chapter 14",
            ),
        ),
    ),
    "GEN2.POLYPROTIC": Lesson(
        node="GEN2.POLYPROTIC",
        objective=(
            "Write the sequential ionizations of a polyprotic acid, explain why "
            "each step is much weaker than the last, and use that to find the "
            "pH and the concentration of the fully deprotonated form."
        ),
        build_on=(
            "A monoprotic weak acid ionizes once with one Ka, and a polyprotic "
            "acid does the same thing two or three times over, each step with "
            "its own smaller Ka."
        ),
        core_idea=(
            "A polyprotic acid has more than one ionizable proton, and it lets "
            "them go one at a time, each release governed by its own constant "
            "Ka1, then Ka2, then Ka3. Those constants drop steeply, typically by "
            "about a factor of 100000 per step, because pulling a second "
            "positive proton away from an already negative ion is far harder "
            "than pulling the first from a neutral molecule. Real diprotic acids "
            "such as carbonic acid, H2CO3, follow this pattern. The steep drop "
            "buys a large simplification: the first ionization dominates the "
            "hydronium concentration so completely that you can find the pH from "
            "Ka1 alone, treating the acid as if it were monoprotic. A separate "
            "and useful fact falls out of the second step. Because the first "
            "step makes [H3O+] and the intermediate HA- in nearly equal amounts, "
            "they cancel in the Ka2 expression, leaving the concentration of the "
            "doubly deprotonated ion equal to Ka2 itself, independent of how much "
            "acid you started with."
        ),
        worked_example=(
            "Take a diprotic acid H2A with Ka1 = 1.0e-4 and Ka2 = 1.0e-9, round "
            "teaching values a hundred thousandfold apart, at 0.10 M. First "
            "ionization, H2A equilibrium with H3O+ + HA-: x = sqrt((1.0e-4)"
            "(0.10)) = sqrt(1.0e-5) = 3.16e-3 M, and 3.16e-3 / 0.10 = 3.2 "
            "percent, under 5 percent, so [H3O+] = 3.16e-3 M and pH = "
            "-log(3.16e-3) = 2.50. The first step also fixes [HA-] = 3.16e-3 M. "
            "Now the second ionization, HA- equilibrium with H3O+ + A2-, with "
            "Ka2 = [H3O+][A2-] / [HA-] = 1.0e-9. Because the first step made "
            "[H3O+] and [HA-] essentially equal, they cancel when you solve for "
            "the doubly charged ion: [A2-] = Ka2 * [HA-] / [H3O+] = Ka2 = 1.0e-9 "
            "M. So the pH came entirely from Ka1, and the amount of the fully "
            "deprotonated A2- is nothing more than Ka2."
        ),
        try_it_prompt=(
            "For the same acid, Ka1 = 1.0e-4 and Ka2 = 1.0e-9, suppose you had "
            "started at 0.20 M instead of 0.10 M. What is [A2-] now?"
        ),
        try_it_answer=(
            "Still 1.0e-9 M. The second-step cancellation makes [A2-] equal to "
            "Ka2 regardless of the starting concentration, so doubling the acid "
            "changes the pH slightly through Ka1 but leaves [A2-] at Ka2."
        ),
        pitfall=(
            "The pitfall is adding the ionizations together, as though a "
            "diprotic acid at 0.10 M gives 0.20 M hydronium. The second step is "
            "smaller than the first by a hundred thousandfold here, so it "
            "contributes almost no additional hydronium; the pH comes from Ka1 "
            "alone, and treating both protons as fully released overstates the "
            "acidity badly."
        ),
        claims=(
            Formula("OC(=O)O", "CH2O3", "carbonic acid, a diprotic acid"),
            Formula("OC(=O)[O-]", "CHO3-", "bicarbonate, its intermediate ion"),
        ),
    ),
    "GEN2.SALTHYDROLYSIS": Lesson(
        node="GEN2.SALTHYDROLYSIS",
        objective=(
            "Predict whether a salt solution is acidic, basic or neutral from "
            "the origins of its ions, and calculate the pH of a hydrolyzing "
            "salt."
        ),
        build_on=(
            "You know Ka times Kb equals Kw for a conjugate pair, and that "
            "single relationship is what lets you predict whether a dissolved "
            "salt turns its water acidic or basic."
        ),
        core_idea=(
            "A salt is a cation and an anion, and each may or may not react with "
            "water, called hydrolysis. Sort each ion by where it came from. An "
            "ion that is the conjugate of a strong acid or strong base is a "
            "spectator and leaves the pH alone: sodium comes from the strong "
            "base NaOH, chloride from the strong acid HCl, and neither touches "
            "the water. An anion that is the conjugate base of a weak acid, such "
            "as acetate, makes the solution basic, and a cation that is the "
            "conjugate acid of a weak base, such as ammonium, makes it acidic. "
            "So NaCl is neutral, sodium acetate is basic, and ammonium chloride "
            "is acidic. When an ion does hydrolyze you compute its effect with "
            "the constant you get from Ka * Kb = Kw: the acetate ion uses Kb = "
            "Kw / Ka of acetic acid, and the ammonium ion uses Ka = Kw / Kb of "
            "ammonia. From there it is an ordinary weak acid or weak base "
            "calculation."
        ),
        worked_example=(
            "Find the pH of 0.10 M ammonium chloride. First classify the two "
            "ions. Chloride is the conjugate base of the strong acid HCl, so it "
            "is a spectator. Ammonium is the conjugate acid of the weak base "
            "ammonia, Kb = 1.8e-5, so it hydrolyzes and makes the solution "
            "acidic. Get its acid constant from the conjugate relationship: Ka = "
            "Kw / Kb = 1.0e-14 / 1.8e-5 = 5.6e-10. Now run it as a weak acid at "
            "0.10 M: [H3O+] = sqrt(Ka * C) = sqrt((5.6e-10)(0.10)) = "
            "sqrt(5.6e-11) = 7.5e-6 M. Convert to pH: pH = -log(7.5e-6) = 6 - "
            "log(7.5) = 6 - 0.88 = 5.13. The pH came out below 7, which is the "
            "prediction that the ammonium cation would make the solution acidic "
            "while the chloride sat by and did nothing."
        ),
        try_it_prompt=(
            "Classify each of these salt solutions as acidic, basic or neutral: "
            "NaCl, NH4Cl, and sodium acetate. Give the reason for each."
        ),
        try_it_answer=(
            "NaCl is neutral, since both ions are spectators from a strong acid "
            "and a strong base. NH4Cl is acidic, since the ammonium ion is the "
            "conjugate acid of a weak base. Sodium acetate is basic, since the "
            "acetate ion is the conjugate base of a weak acid."
        ),
        pitfall=(
            "The pitfall is assuming every dissolved salt gives a neutral "
            "solution. Only salts whose ions are both spectators, like NaCl, are "
            "neutral; the 0.10 M ammonium chloride above sits at pH 5.13, a full "
            "unit and a half acidic, because one of its ions is the conjugate of "
            "a weak base and does react with water."
        ),
        claims=(
            AMMONIA_KB_SOURCE,
            KW_SOURCE,
            Formula("[NH4+].[Cl-]", "H4ClN", "ammonium chloride"),
            Formula("[Na+].[Cl-]", "ClNa", "sodium chloride"),
            Formula("CC(=O)[O-].[Na+]", "C2H3NaO2", "sodium acetate"),
        ),
    ),
    "GEN2.ACIDSTRUCTURE": Lesson(
        node="GEN2.ACIDSTRUCTURE",
        objective=(
            "Explain acid strength trends from molecular structure, using bond "
            "strength for binary acids and conjugate base stability for "
            "oxoacids."
        ),
        build_on=(
            "You can rank acids by their Ka, and this lesson explains where "
            "those different Ka values come from, in the bonds and the shapes of "
            "the molecules themselves."
        ),
        core_idea=(
            "Acid strength comes down to one question: how willingly does the "
            "O-H or X-H bond give up its proton, which is the same as asking how "
            "stable the leftover conjugate base is. Two structural patterns "
            "cover most cases. For binary acids HX going down a group, the H-X "
            "bond gets longer and weaker, so acid strength increases down the "
            "group, and hydrofluoric acid is weak while hydroiodic acid is "
            "strong even though fluorine is the more electronegative atom; bond "
            "strength wins over electronegativity here. For oxoacids, the more "
            "oxygen atoms bonded to the central atom, the stronger the acid, "
            "because each extra electronegative oxygen pulls electron density "
            "away from the O-H bond and, more importantly, spreads the negative "
            "charge of the conjugate base over more atoms once the proton "
            "leaves. That is why the chlorine oxoacids climb in strength HClO, "
            "HClO2, HClO3, HClO4 as oxygens are added. The unifying idea is "
            "conjugate base stability: whatever makes the anion more comfortable "
            "makes the acid stronger."
        ),
        worked_example=(
            "Compare hypochlorous acid, HClO, with perchloric acid, HClO4, and "
            "say which is stronger and why. Both are oxoacids of chlorine, and "
            "the difference is the number of oxygen atoms, one versus four. When "
            "HClO4 loses its proton, the resulting perchlorate ion carries its "
            "negative charge spread across four equivalent oxygen atoms, a very "
            "stable arrangement, so the proton leaves readily and perchloric "
            "acid is one of the strongest acids known. When HClO loses its "
            "proton, the charge sits essentially on a single oxygen with no help, "
            "a far less stable anion, so HClO holds its proton tightly and is "
            "weak. The same reasoning ranks the whole series: every oxygen you "
            "add gives the conjugate base one more atom to share the charge, and "
            "acid strength rises step by step from HClO to HClO4."
        ),
        try_it_prompt=(
            "Which is the stronger acid, sulfuric acid H2SO4 or sulfurous acid "
            "H2SO3, and what structural feature decides it?"
        ),
        try_it_answer=(
            "Sulfuric acid is stronger. It has more oxygen atoms on the central "
            "sulfur, which pull more electron density from the O-H bonds and "
            "spread the conjugate base's negative charge over more oxygens, "
            "giving a more stable anion and a more willing proton donor."
        ),
        pitfall=(
            "The pitfall is ranking binary acids by electronegativity alone and "
            "concluding HF is the strongest hydrohalic acid because fluorine "
            "grabs electrons hardest. Down a group the deciding factor is bond "
            "strength, not electronegativity: the short, strong H-F bond holds "
            "its proton, so HF is the weak one and HI, with its long weak bond, "
            "is strong."
        ),
        claims=(
            Source(
                "Binary hydride acid strength increases down a group as the H-X "
                "bond weakens, so HF is weak and HI is strong; oxoacid strength "
                "increases with the number of oxygen atoms on the central atom, "
                "so HClO < HClO2 < HClO3 < HClO4.",
                "OpenStax Chemistry 2e, Section 14.3 (Relative Strengths of "
                "Acids and Bases), molecular structure and acid strength.",
            ),
            Formula("F", "HF", "hydrogen fluoride"),
            Formula("Cl", "HCl", "hydrogen chloride"),
        ),
    ),
    "GEN2.LEWISACID": Lesson(
        node="GEN2.LEWISACID",
        objective=(
            "Identify the Lewis acid and Lewis base in a reaction as the "
            "electron pair acceptor and donor, and relate the definition to the "
            "Bronsted picture."
        ),
        build_on=(
            "Bronsted taught you an acid as a proton donor, and Lewis widens "
            "that definition to cover reactions with no proton in sight, by "
            "looking at electron pairs instead."
        ),
        core_idea=(
            "The Lewis definition steps back from the proton and looks at the "
            "electrons: a Lewis acid is an electron pair acceptor and a Lewis "
            "base is an electron pair donor, and the two join through a new "
            "coordinate covalent bond where the base supplies both electrons. "
            "This is the broader picture, and it contains the Bronsted one. Any "
            "Bronsted base, such as ammonia, is also a Lewis base, because "
            "accepting a proton means donating a lone pair to it, which makes "
            "the proton the Lewis acid. What the Lewis view adds is a whole "
            "class of acids with no proton at all: molecules with an incomplete "
            "octet, such as boron trifluoride, and metal cations, such as silver "
            "or iron ions, which accept electron pairs into empty orbitals. This "
            "is the definition organic chemistry leans on, because it names the "
            "electron-hungry site that a reaction actually attacks."
        ),
        worked_example=(
            "Look at boron trifluoride reacting with ammonia, BF3 + NH3 -> "
            "F3B-NH3. The boron in BF3 is bonded to only three fluorines and so "
            "has only six electrons around it, an incomplete octet with an empty "
            "orbital waiting. The nitrogen in ammonia has a lone pair. When they "
            "meet, the nitrogen donates that lone pair into boron's empty "
            "orbital, forming a coordinate covalent bond and completing boron's "
            "octet. So ammonia is the Lewis base, the electron pair donor, and "
            "BF3 is the Lewis acid, the electron pair acceptor, even though not "
            "one proton moved in the whole reaction. Contrast this with the "
            "Bronsted reaction H+ + NH3 -> NH4+, where ammonia is again the "
            "electron pair donor but the electron pair acceptor is now a bare "
            "proton. Same base, same donated pair, different acid."
        ),
        try_it_prompt=(
            "In the reaction Ag+ + 2 NH3 -> Ag(NH3)2+, which species is the "
            "Lewis acid and which is the Lewis base?"
        ),
        try_it_answer=(
            "The silver ion Ag+ is the Lewis acid, accepting electron pairs into "
            "empty orbitals, and each ammonia is a Lewis base, donating its "
            "nitrogen lone pair. No proton is transferred, which is why the "
            "Lewis definition is the one that describes this reaction."
        ),
        pitfall=(
            "The pitfall is thinking an acid must contain a hydrogen to donate. "
            "Boron trifluoride and the silver ion have no acidic proton at all, "
            "yet both are genuine Lewis acids because they accept an electron "
            "pair. Requiring a proton would miss every metal cation and every "
            "electron-deficient molecule."
        ),
        claims=(
            Formula("FB(F)F", "BF3", "boron trifluoride, a Lewis acid"),
            Formula("N", "H3N", "ammonia, a Lewis base"),
        ),
    ),
    "GEN2.COMMONION": Lesson(
        node="GEN2.COMMONION",
        objective=(
            "Predict and calculate how adding a common ion suppresses the "
            "ionization of a weak acid, and connect that suppression to Le "
            "Chatelier's principle."
        ),
        build_on=(
            "A weak acid sits at an ionization equilibrium set by Ka, and Le "
            "Chatelier told you a shared ion pushes an equilibrium back, so "
            "adding that ion to a weak acid suppresses its ionization."
        ),
        core_idea=(
            "The common ion effect is Le Chatelier applied to ionization: if a "
            "solution already contains one of the ions a weak acid would "
            "produce, the acid ionizes less than it would on its own. Add "
            "acetate to a solution of acetic acid, and the extra acetate is a "
            "product of the ionization HA equilibrium with H3O+ + A-, so its "
            "presence pushes that equilibrium back toward the un-ionized acid, "
            "lowering the hydronium concentration and raising the pH. The "
            "arithmetic is an ICE table with a nonzero starting amount of the "
            "conjugate base. A tidy result emerges when the acid and its "
            "conjugate base start at equal concentrations: the two nearly equal "
            "terms cancel in the Ka expression and leave the hydronium "
            "concentration equal to Ka itself. This suppression is not a side "
            "note; it is the mechanism that makes a buffer work, which is the "
            "next thing you will build."
        ),
        worked_example=(
            "Start with 0.10 M acetic acid alone, Ka = 1.8e-5. Its ionization "
            "gives x = sqrt(Ka * C) = sqrt((1.8e-5)(0.10)) = sqrt(1.8e-6) = "
            "1.34e-3 M, so [H3O+] = 1.34e-3 M and pH = -log(1.34e-3) = 2.87. Now "
            "add sodium acetate until the acetate concentration is also 0.10 M, "
            "and rebuild the ICE table with that common ion present: [HA] = "
            "0.10, [A-] = 0.10 + x, [H3O+] = x, so Ka = x(0.10 + x) / (0.10 - x) "
            "= 1.8e-5. Since x will be small next to 0.10, approximate both "
            "0.10 + x and 0.10 - x as 0.10, and they cancel, leaving x = Ka = "
            "1.8e-5 M. Then pH = -log(1.8e-5) = 4.74. The added acetate drove "
            "the hydronium concentration down from 1.34e-3 M to 1.8e-5 M, a drop "
            "of nearly a hundredfold, and pushed the pH up from 2.87 to 4.74, "
            "purely by supplying a product ion."
        ),
        try_it_prompt=(
            "You dissolve some sodium acetate into a beaker of acetic acid. Does "
            "the pH go up or down, and which direction does the ionization "
            "equilibrium shift?"
        ),
        try_it_answer=(
            "The pH goes up, meaning the solution becomes less acidic. The added "
            "acetate is a product of the ionization, so by Le Chatelier the "
            "equilibrium shifts back toward un-ionized acetic acid, lowering "
            "[H3O+] and raising the pH."
        ),
        pitfall=(
            "The pitfall is expecting the added acetate to make the solution "
            "more acidic because it came from an acid. Acetate is the conjugate "
            "base, and adding it suppresses ionization and raises the pH, as the "
            "worked example's jump from 2.87 to 4.74 shows. The origin of the "
            "ion is not what matters; its role as a product is."
        ),
        claims=(
            ACETIC_KA_SOURCE,
            Formula("CC(=O)O", "C2H4O2", "acetic acid"),
            Formula("CC(=O)[O-]", "C2H3O2-", "acetate ion"),
            Formula("CC(=O)[O-].[Na+]", "C2H3NaO2", "sodium acetate"),
        ),
    ),
    "GEN2.HENDERSON": Lesson(
        node="GEN2.HENDERSON",
        objective=(
            "Derive the Henderson-Hasselbalch equation from Ka, state the "
            "assumptions built into it, and identify the conditions where it "
            "fails."
        ),
        build_on=(
            "You met a buffer and the equation that gives its pH, and this "
            "lesson derives that equation from Ka, states the assumptions hidden "
            "inside it, and shows where it stops working."
        ),
        core_idea=(
            "The Henderson-Hasselbalch equation is not a new law; it is the Ka "
            "expression rearranged. Start from Ka = [H3O+][A-] / [HA], solve for "
            "the hydronium concentration, [H3O+] = Ka * [HA] / [A-], and take the "
            "negative logarithm of both sides to get pH = pKa + log([A-] / "
            "[HA]). Two assumptions are baked in. The first is that the amounts "
            "of HA and A- you mixed are the amounts present at equilibrium, "
            "which holds when the acid's ionization is small next to those "
            "amounts, and that fails when the buffer is very dilute. The second "
            "is that both components are actually present in appreciable amounts, "
            "which fails once the ratio grows extreme. Buffer capacity, the "
            "amount of added acid or base a buffer can absorb, is greatest when "
            "[A-] equals [HA] so that pH equals pKa, and it falls off on either "
            "side. As a working rule a buffer is effective within about one pH "
            "unit of its pKa, which is the ratio range from 1 to 10 down to 10 "
            "to 1."
        ),
        worked_example=(
            "Use acetic acid, Ka = 1.8e-5, so pKa = -log(1.8e-5) = 4.74, and "
            "watch the equation walk across its useful range. With equal "
            "amounts, [A-] / [HA] = 1, the log is zero and pH = 4.74, which is "
            "also where buffer capacity peaks. Push the ratio to 10 to 1, ten "
            "parts acetate to one part acetic acid: pH = 4.74 + log(10) = 4.74 + "
            "1 = 5.74. Push it the other way, 1 to 10: pH = 4.74 + log(0.1) = "
            "4.74 - 1 = 3.74. So across the whole practical range the pH only "
            "spans 3.74 to 5.74, one unit either side of the pKa, and outside "
            "that window one component is so scarce that the buffer can no "
            "longer absorb both acid and base. That is the honest boundary the "
            "equation carries: it stays accurate as arithmetic well past the "
            "window, but the mixture stops behaving like a buffer."
        ),
        try_it_prompt=(
            "A buffer made from acetic acid, pKa = 4.74, has an acetate to "
            "acetic acid ratio of 1 to 100. What is the pH, and is this still an "
            "effective buffer?"
        ),
        try_it_answer=(
            "pH = 4.74 + log(0.01) = 4.74 - 2 = 2.74. The ratio is far outside "
            "the 1 to 10 window, so almost all of the mixture is acetic acid "
            "with very little acetate; it can still neutralize added base but "
            "has almost no capacity for added acid, so it is a poor buffer."
        ),
        pitfall=(
            "The pitfall is trusting Henderson-Hasselbalch after a component has "
            "been used up. The equation happily returns a pH for any ratio you "
            "feed it, including ratios that no longer describe a real buffer, so "
            "once added strong acid or base has consumed nearly all of one "
            "component the number it gives is arithmetic without chemistry "
            "behind it."
        ),
        claims=(
            ACETIC_KA_SOURCE,
            Formula("CC(=O)O", "C2H4O2", "acetic acid"),
            Formula("CC(=O)[O-]", "C2H3O2-", "acetate ion"),
        ),
    ),
    "GEN2.BUFFERPREP": Lesson(
        node="GEN2.BUFFERPREP",
        objective=(
            "Prepare a buffer at a target pH by choosing a weak acid whose pKa "
            "is near the target and then setting the ratio of conjugate base to "
            "acid."
        ),
        build_on=(
            "Henderson-Hasselbalch turns a pH into a required ratio of base to "
            "acid, and preparing a buffer runs that logic in reverse, from a "
            "target pH to an actual recipe."
        ),
        core_idea=(
            "Designing a buffer is a two-step choice. First choose the acid: "
            "pick a weak acid whose pKa lies within about one unit of your "
            "target pH, because that is the range where the buffer has real "
            "capacity and the required ratio stays sensible. Second set the "
            "ratio: rearrange Henderson-Hasselbalch to log([A-] / [HA]) = pH - "
            "pKa, so the ratio you need is 10 raised to the power (pH - pKa). "
            "When the target equals the pKa the ratio is 1, equal amounts. When "
            "the target sits above the pKa you need more conjugate base than "
            "acid, and when it sits below you need more acid. The reason for the "
            "one-unit rule shows up here: choose an acid whose pKa is two units "
            "off and the required ratio becomes 100 to 1, which wastes one "
            "component and leaves almost no capacity against one direction of "
            "attack."
        ),
        worked_example=(
            "Prepare a buffer at pH 5.00. Step one, choose the acid: acetic "
            "acid has pKa = -log(1.8e-5) = 4.74, which is 0.26 unit from the "
            "target, well inside the one-unit window, so it is a good choice. "
            "Step two, set the ratio: log([A-] / [HA]) = pH - pKa = 5.00 - 4.74 "
            "= 0.26, so [A-] / [HA] = 10^0.26 = 1.82. You need 1.82 times as "
            "much acetate as acetic acid. Turn that into a recipe by fixing one "
            "amount: dissolve 0.10 mol of acetic acid and 0.10 * 1.82 = 0.182 "
            "mol of sodium acetate in 1.0 L, and the mixture sits at pH 5.00. "
            "Check the direction: the target 5.00 is above the pKa 4.74, and the "
            "recipe indeed calls for more conjugate base than acid, which is the "
            "sign the ratio should carry."
        ),
        try_it_prompt=(
            "You need a buffer at pH 4.00 and you are using acetic acid, pKa = "
            "4.74. What ratio of acetate to acetic acid does that require?"
        ),
        try_it_answer=(
            "log([A-] / [HA]) = 4.00 - 4.74 = -0.74, so the ratio is 10^-0.74 = "
            "0.18, about one part acetate to five and a half parts acetic acid. "
            "The target is below the pKa, so the recipe correctly needs more "
            "acid than conjugate base."
        ),
        pitfall=(
            "The pitfall is choosing an acid whose pKa is far from the target "
            "and forcing the ratio to compensate. Aiming for pH 5.00 with an "
            "acid of pKa 2.74 would demand a 100 to 1 ratio of base to acid, a "
            "buffer with almost no acid left to neutralize incoming base. Match "
            "the pKa to the target first, then fine tune with the ratio."
        ),
        claims=(
            ACETIC_KA_SOURCE,
            Formula("CC(=O)O", "C2H4O2", "acetic acid"),
            Formula("CC(=O)[O-].[Na+]", "C2H3NaO2", "sodium acetate"),
        ),
    ),
    "GEN2.TITRATIONSTRONG": Lesson(
        node="GEN2.TITRATIONSTRONG",
        objective=(
            "Compute the pH at points along a strong acid strong base titration "
            "and explain why the equivalence point sits at pH 7."
        ),
        build_on=(
            "A strong acid ionizes completely, so its titration needs no Ka at "
            "any point, and the whole curve comes from tracking moles of "
            "leftover acid or base."
        ),
        core_idea=(
            "A strong acid titrated with a strong base gives a curve you can "
            "compute with bookkeeping alone, because neither reactant hangs back "
            "at an equilibrium. Before the equivalence point there is leftover "
            "strong acid, so you find the moles of acid not yet neutralized, "
            "divide by the total volume, and take the pH of that hydronium "
            "concentration. At the equivalence point the moles of added base "
            "exactly match the original moles of acid, and what remains is water "
            "plus a salt of two spectator ions, so the pH is 7.00. Past "
            "equivalence there is excess strong base, so you track leftover "
            "hydroxide, get pOH, and convert. The signature of the curve is the "
            "steepness right at equivalence, where the pH leaps through many "
            "units on a single small addition, because near that point very "
            "little leftover acid or base spans a wide range of concentration."
        ),
        worked_example=(
            "Titrate 25.00 mL of 0.100 M HCl with 0.100 M NaOH. Initial moles of "
            "acid = (0.02500 L)(0.100 M) = 2.50e-3 mol. At the start, [H3O+] = "
            "0.100 M so pH = 1.00. After adding 10.00 mL of base, moles of "
            "hydroxide added = (0.01000)(0.100) = 1.00e-3 mol, leaving 2.50e-3 - "
            "1.00e-3 = 1.50e-3 mol of acid in 35.00 mL total, so [H3O+] = "
            "1.50e-3 / 0.03500 = 0.0429 M and pH = 1.37. At the equivalence "
            "point, 25.00 mL of base has been added, all the acid is gone, only "
            "NaCl and water remain, and pH = 7.00. Add 5.00 mL more, to 30.00 "
            "mL: excess hydroxide = (0.00500)(0.100) = 5.00e-4 mol in 55.00 mL, "
            "so [OH-] = 5.00e-4 / 0.05500 = 9.09e-3 M, pOH = 2.04, pH = 11.96. "
            "Notice the jump from pH 1.37 immediately before equivalence to pH "
            "11.96 immediately after, the near-vertical wall that marks the "
            "endpoint."
        ),
        try_it_prompt=(
            "In this strong acid strong base titration the equivalence point is "
            "at pH 7.00. Why exactly 7, and what two ions are left in solution "
            "there?"
        ),
        try_it_answer=(
            "The ions left are sodium and chloride. Sodium is the spectator "
            "cation from the strong base NaOH and chloride is the spectator "
            "anion from the strong acid HCl, and since neither reacts with "
            "water, only neutral water sets the pH, giving 7.00."
        ),
        pitfall=(
            "The pitfall is carrying a Ka into a strong acid titration. There is "
            "no ionization equilibrium at any point here, so every pH comes from "
            "counting leftover moles of acid or base and dividing by the total "
            "volume; reaching for an equilibrium expression means solving a "
            "problem that does not exist."
        ),
        claims=(
            Formula("Cl", "HCl", "hydrogen chloride"),
            Formula("[Na+].[OH-]", "HNaO", "sodium hydroxide"),
            Formula("[Na+].[Cl-]", "ClNa", "sodium chloride, the product salt"),
        ),
    ),
    "GEN2.HALFEQUIV": Lesson(
        node="GEN2.HALFEQUIV",
        objective=(
            "Locate the half equivalence and equivalence volumes on a weak acid "
            "titration curve, and read the acid's pKa directly off the pH at "
            "half equivalence."
        ),
        build_on=(
            "A weak acid titration passes through a buffer region, and this "
            "lesson zooms in on the two landmark volumes on that curve, the half "
            "equivalence point and the equivalence point."
        ),
        core_idea=(
            "Two volumes on a weak acid titration curve carry all the "
            "information, and telling them apart matters. The equivalence point "
            "is where the moles of added base equal the moles of acid you "
            "started with, and it is the natural end of the titration; for a "
            "weak acid it lands above pH 7 because only the conjugate base "
            "remains. The half equivalence point sits at exactly half that "
            "volume, and it is special: there, half the acid has been converted "
            "to its conjugate base, so [A-] equals [HA], the log term in "
            "Henderson-Hasselbalch is zero, and pH equals pKa. That makes the "
            "half equivalence point the cleanest way to measure a pKa. You run "
            "the titration, find the equivalence volume, go back to half of it, "
            "and read the pH straight off the curve; that pH is the pKa, and 10 "
            "to the negative of it is the Ka. Do not confuse the two volumes: "
            "one hands you the pKa, the other tells you how much acid there was."
        ),
        worked_example=(
            "Titrate 20.00 mL of 0.100 M of a weak acid HA with 0.100 M NaOH. "
            "Moles of acid = (0.02000 L)(0.100 M) = 2.00e-3 mol, so equivalence "
            "needs 2.00e-3 mol of base, which is 2.00e-3 / 0.100 = 0.02000 L, or "
            "20.00 mL. Half equivalence is therefore at 10.00 mL. At that "
            "volume, 1.00e-3 mol of the acid has been turned into A- and "
            "1.00e-3 mol of HA remains, so [A-] = [HA] and pH = pKa + log(1) = "
            "pKa. Suppose the curve reads pH 4.74 at 10.00 mL; then the acid's "
            "pKa is 4.74 and its Ka = 10^-4.74 = 1.8e-5, which identifies it as "
            "acetic acid. Keep the two landmarks straight: 10.00 mL is half "
            "equivalence and gives the pKa, while 20.00 mL is the equivalence "
            "point and lands in basic territory because acetate is left alone in "
            "the flask."
        ),
        try_it_prompt=(
            "A weak acid titration curve reads pH 5.00 at its half equivalence "
            "volume. What is the acid's pKa, and what is its Ka?"
        ),
        try_it_answer=(
            "The pKa is 5.00, read straight off the curve, because at half "
            "equivalence pH equals pKa. The Ka is 10^-5.00 = 1.0e-5. No further "
            "calculation is needed once you are at the half equivalence volume."
        ),
        pitfall=(
            "The pitfall is reading the pKa at the equivalence point instead of "
            "at half equivalence. The equivalence point is basic for a weak "
            "acid, nowhere near the pKa; it is the half equivalence volume, at "
            "half the equivalence volume, where [A-] equals [HA] and the pH "
            "equals the pKa."
        ),
        claims=(
            ACETIC_KA_SOURCE,
            Formula("CC(=O)O", "C2H4O2", "acetic acid"),
            Formula("CC(=O)[O-]", "C2H3O2-", "acetate ion"),
        ),
    ),
    "GEN2.INDICATORS": Lesson(
        node="GEN2.INDICATORS",
        objective=(
            "Choose an acid-base indicator by matching its color-change range to "
            "the pH at the equivalence point of a titration."
        ),
        build_on=(
            "You can now find the pH at the equivalence point of a titration, "
            "and choosing an indicator is the practical problem of making a dye "
            "change color at exactly that pH."
        ),
        core_idea=(
            "An indicator is itself a weak acid, written HIn, whose acid form "
            "and conjugate base form In- have different colors. Its color "
            "changes over a span of roughly two pH units centered on the "
            "indicator's own pKa, because that is the range over which the ratio "
            "of the two colored forms swings from mostly one to mostly the "
            "other. The endpoint is the pH at which you see the color change, and "
            "the goal is to make the endpoint coincide with the equivalence "
            "point of the titration. So you choose an indicator whose "
            "color-change range brackets the equivalence pH. For a weak acid "
            "titrated with strong base the equivalence point is basic, so you "
            "want an indicator that changes color in the basic region, such as "
            "phenolphthalein, which turns from colorless to pink over about pH "
            "8.3 to 10.0. For a strong acid strong base titration the pH jump at "
            "equivalence is so steep, running roughly from pH 3 to pH 11 on a "
            "drop of titrant, that almost any common indicator changes somewhere "
            "on that wall and reports the endpoint accurately."
        ),
        worked_example=(
            "You titrate a weak acid with a strong base and have calculated the "
            "equivalence point at about pH 8.7. Which indicator do you use? "
            "Phenolphthalein changes over roughly pH 8.3 to 10.0, a range that "
            "brackets 8.7, so its color change happens right as you reach "
            "equivalence, and the endpoint you see matches the equivalence point "
            "you want. Now consider methyl orange, which changes over roughly pH "
            "3.1 to 4.4. That range sits far below 8.7, deep in the buffer "
            "region of this titration, so methyl orange would finish changing "
            "color long before you reached equivalence and would report the "
            "endpoint far too early. The rule the example shows is direct: line "
            "the indicator's transition range up with the equivalence pH, and "
            "for a weak acid that means reaching for an indicator that turns in "
            "the basic range."
        ),
        try_it_prompt=(
            "For the weak acid titration above, with the equivalence point near "
            "pH 8.7, would methyl orange, which changes color over about pH 3.1 "
            "to 4.4, be a good choice? Why or why not?"
        ),
        try_it_answer=(
            "No. Methyl orange changes color around pH 3 to 4, which for this "
            "titration is in the buffer region well before equivalence, so it "
            "would signal the endpoint far too early. You want phenolphthalein, "
            "whose range brackets the basic equivalence pH of about 8.7."
        ),
        pitfall=(
            "The pitfall is assuming any indicator will do because they all "
            "eventually change color. For a weak acid titration an indicator "
            "with an acidic range like methyl orange changes in the buffer "
            "region, marking an endpoint a large volume of titrant short of the "
            "true equivalence point. Match the indicator's range to the "
            "equivalence pH."
        ),
        claims=(
            Source(
                "Phenolphthalein changes color over about pH 8.3 to 10.0 "
                "(colorless to pink) and methyl orange over about pH 3.1 to 4.4 "
                "(red to yellow).",
                "OpenStax Chemistry 2e, Section 14.7 (Acid-Base Titrations), "
                "acid-base indicator transition ranges.",
            ),
        ),
    ),
}
