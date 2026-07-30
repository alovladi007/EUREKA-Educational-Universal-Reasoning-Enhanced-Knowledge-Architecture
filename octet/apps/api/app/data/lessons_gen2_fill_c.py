"""GEN2 fill C: the missing lessons of GEN2-U5 (solubility and complex ions)
and GEN2-U6 (thermodynamics).

Twelve lessons, one per GEN2-U5 / GEN2-U6 node that had no entry in LESSONS,
each following the six part arc in app/data/lesson_types.py and matching the
voice of app/data/lessons_gen2.py: second person, concrete before abstract,
every number worked through in full.

Numbers policy, from the shared authoring brief. Solubility products and
formation constants vary across editions by more than their leading digit, so
every Ksp and Kf that drives a worked calculation here is a declared round
teaching value, chosen for clean arithmetic and labelled as such in the prose,
never presented as a measurement. The standard thermodynamic quantities
(standard molar entropies, standard enthalpies and free energies of formation)
are tabulated reference values and carry a Source claim to OpenStax Chemistry 2e
Appendix G; the enthalpy of fusion of water and the molar gas constant carry a
Source to the CRC Handbook. Discrete species carry a Formula claim in RDKit
Hill order so the build can re-derive it.
"""

from __future__ import annotations

from app.data.claims import Formula, Source
from app.data.lesson_types import Lesson

_APPX_G = (
    "OpenStax Chemistry 2e, Appendix G: Standard Thermodynamic Properties "
    "for Selected Substances"
)
_CRC = "CRC Handbook of Chemistry and Physics, 97th ed."

LESSONS_GEN2_FILL_C: dict[str, Lesson] = {
    "GEN2.KSPCOMMONION": Lesson(
        node="GEN2.KSPCOMMONION",
        objective=(
            "Explain from Le Chatelier's principle why a slightly soluble salt "
            "dissolves less in a solution that already contains one of its ions, "
            "and quantify the effect from Ksp."
        ),
        build_on=(
            "The Ksp lesson computed molar solubility and even folded a common "
            "ion into one calculation; here the reason itself becomes the "
            "subject, which is Le Chatelier's principle applied to a dissolving "
            "salt."
        ),
        core_idea=(
            "A dissolving salt sits at equilibrium, PbI2(s) equilibrium with "
            "Pb2+(aq) + 2 I-(aq), and Le Chatelier says that adding one of the "
            "product ions pushes that equilibrium back toward the solid. That is "
            "the whole of the common ion effect: a salt is less soluble in a "
            "solution of its own ion than in pure water. It does not matter which "
            "ion you supply, the cation or the anion, and it does not matter what "
            "the counter ion is, so iodide from KI and lead from Pb(NO3)2 both "
            "suppress PbI2. What matters is the stoichiometry, because an ion "
            "that enters the Ksp expression to a power feels the change more "
            "sharply. Ksp itself never changes, since it is fixed at a given "
            "temperature; what changes is how much solid can dissolve before the "
            "ion product reaches that fixed Ksp."
        ),
        worked_example=(
            "Take Ksp = 8.0e-9 for PbI2 as a round teaching value chosen for "
            "clean arithmetic. In pure water the ICE table gives [Pb2+] = s and "
            "[I-] = 2s, so Ksp = (s)(2s)^2 = 4 s^3 = 8.0e-9, giving s^3 = 2.0e-9 "
            "and s = 1.26e-3 M. Now dissolve PbI2 in 0.10 M KI, where iodide is "
            "already present. Then [I-] = 0.10 + 2s while [Pb2+] is still s, so "
            "Ksp = s(0.10 + 2s)^2 = 8.0e-9. Since s will be tiny next to 0.10, "
            "approximate 0.10 + 2s as 0.10: s = 8.0e-9 / (0.10)^2 = 8.0e-9 / "
            "0.010 = 8.0e-7 M. Validate the approximation, 2s = 1.6e-6, which is "
            "0.0016 percent of 0.10, so it holds. Compare the two solubilities: "
            "1.26e-3 / 8.0e-7 = about 1600, so the common iodide made PbI2 "
            "roughly 1600 times less soluble. The effect is this large because "
            "iodide enters Ksp squared."
        ),
        try_it_prompt=(
            "Using the same round teaching value Ksp = 8.0e-9, find the molar "
            "solubility of PbI2 in 0.10 M Pb(NO3)2, where the lead ion is the "
            "common ion instead."
        ),
        try_it_answer=(
            "s = 1.4e-4 M. Here [Pb2+] = 0.10 and [I-] = 2s, so Ksp = "
            "(0.10)(2s)^2 = 0.40 s^2 = 8.0e-9, giving s^2 = 2.0e-8 and s = "
            "1.4e-4 M. That is about 9 times less soluble than in pure water, a "
            "milder suppression than the common iodide gave, because the lead "
            "ion enters Ksp only to the first power."
        ),
        pitfall=(
            "The pitfall is thinking any added salt lowers solubility. Only a "
            "common ion shifts this particular equilibrium; adding 0.10 M NaNO3, "
            "which shares no ion with PbI2, does not push the equilibrium back "
            "and leaves the solubility essentially unchanged. It is the shared "
            "ion, not the added ion count, that does the work."
        ),
        misconception=None,
        claims=(
            Formula("[Pb+2].[I-].[I-]", "I2Pb", "lead(II) iodide, Hill order"),
            Formula("[K+].[I-]", "IK", "potassium iodide, Hill order"),
            Formula(
                "[Pb+2].[O-][N+](=O)[O-].[O-][N+](=O)[O-]",
                "N2O6Pb",
                "lead(II) nitrate, Hill order",
            ),
        ),
    ),
    "GEN2.PRECIPITATION": Lesson(
        node="GEN2.PRECIPITATION",
        objective=(
            "Decide whether mixing two solutions produces a precipitate by "
            "comparing the ion product Q with Ksp, and find the ion "
            "concentration at which precipitation begins."
        ),
        build_on=(
            "You compared Q with K to predict the direction of a gas phase "
            "equilibrium, and a precipitation is that same comparison for a "
            "dissolving salt: Q is the ion product, and Ksp is the K it is "
            "measured against."
        ),
        core_idea=(
            "For a salt, Q is the reaction quotient built from the ion "
            "concentrations you actually have, with the same exponents as Ksp. "
            "Three outcomes follow from the comparison. If Q is less than Ksp the "
            "solution is unsaturated and any solid present keeps dissolving. If Q "
            "equals Ksp the solution is exactly saturated. If Q is greater than "
            "Ksp the solution holds more dissolved ions than it can support, so "
            "solid crystallises out and Q falls back to Ksp. The one step that "
            "trips people is mixing: when you combine two solutions, each solute "
            "is diluted into the larger combined volume, so you must recompute "
            "every concentration before forming Q. The threshold for the onset "
            "of precipitation is the concentration that makes Q equal Ksp."
        ),
        worked_example=(
            "Take Ksp = 1.0e-10 for BaSO4 as a round teaching value chosen for "
            "clean arithmetic. Mix 50.0 mL of 0.0010 M BaCl2 with 50.0 mL of "
            "0.0010 M Na2SO4. First handle the dilution: the combined volume is "
            "100.0 mL, so each ion is halved, giving [Ba2+] = 5.0e-4 M and "
            "[SO4 2-] = 5.0e-4 M. Now form the ion product: Q = [Ba2+][SO4 2-] = "
            "(5.0e-4)(5.0e-4) = 2.5e-7. Compare: Q = 2.5e-7 is far greater than "
            "Ksp = 1.0e-10, so BaSO4 precipitates. You can also ask how little "
            "sulfate it would take to begin precipitation at this barium "
            "level: set Q = Ksp, so [SO4 2-] = Ksp / [Ba2+] = 1.0e-10 / 5.0e-4 = "
            "2.0e-7 M. The 5.0e-4 M actually present overshoots that threshold by "
            "a factor of 2500, which is why precipitation is not close, it is "
            "certain."
        ),
        try_it_prompt=(
            "Using the round teaching value Ksp = 1.8e-10 for AgCl, decide "
            "whether AgCl precipitates when 100.0 mL of 1.0e-5 M AgNO3 is mixed "
            "with 100.0 mL of 1.0e-5 M NaCl. Do not forget the mixing step."
        ),
        try_it_answer=(
            "No precipitate. Mixing halves each ion to 5.0e-6 M, so Q = "
            "(5.0e-6)(5.0e-6) = 2.5e-11, which is below Ksp = 1.8e-10. The "
            "solution stays unsaturated. Had you skipped the dilution and used "
            "1.0e-5 M, you would get Q = 1.0e-10, still below Ksp here, but in a "
            "borderline case that factor of four can flip the verdict."
        ),
        pitfall=(
            "The pitfall is forming Q from the concentrations in the original "
            "bottles rather than after mixing. Combining equal volumes halves "
            "each concentration, and for a one to one salt that quarters Q, so "
            "the uncorrected number is four times too large and can turn a clear "
            "solution into a predicted precipitate that never appears."
        ),
        misconception=None,
        claims=(
            Formula(
                "[Ba+2].[O-]S(=O)(=O)[O-]", "BaO4S", "barium sulfate, Hill order"
            ),
            Formula("[Ba+2].[Cl-].[Cl-]", "BaCl2", "barium chloride, Hill order"),
            Formula(
                "[Na+].[Na+].[O-]S(=O)(=O)[O-]",
                "Na2O4S",
                "sodium sulfate, Hill order",
            ),
            Formula("[Ag+].[Cl-]", "AgCl", "silver chloride, Hill order"),
            Formula(
                "[Ag+].[O-][N+](=O)[O-]", "AgNO3", "silver nitrate, Hill order"
            ),
            Formula("[Na+].[Cl-]", "ClNa", "sodium chloride, Hill order"),
        ),
    ),
    "GEN2.PHSOLUBILITY": Lesson(
        node="GEN2.PHSOLUBILITY",
        objective=(
            "Predict which slightly soluble salts dissolve more as a solution is "
            "made more acidic, and calculate how the solubility of a hydroxide "
            "changes with pH."
        ),
        build_on=(
            "Bronsted chemistry taught you that the anion of a weak acid is "
            "itself a weak base, and solubility equilibria taught you Le "
            "Chatelier; put them together and adding acid removes a basic anion "
            "and pulls the salt into solution."
        ),
        core_idea=(
            "Whether pH changes solubility depends entirely on the anion. If the "
            "anion is the conjugate base of a weak acid, such as hydroxide, "
            "carbonate, or fluoride, then added H+ reacts with it and lowers its "
            "concentration, which by Le Chatelier shifts the dissolution "
            "equilibrium forward and dissolves more solid. If the anion is the "
            "conjugate base of a strong acid, such as chloride or nitrate, it is "
            "a negligibly weak base, H+ does not touch it, and the solubility is "
            "flat across pH. For a metal hydroxide the coupling is direct, "
            "because hydroxide is set by pH itself: with M(OH)2(s) equilibrium "
            "with M2+ + 2 OH-, the solubility s = [M2+] = Ksp / [OH-]^2, so every "
            "unit drop in pH lowers [OH-] tenfold and raises s a hundredfold."
        ),
        worked_example=(
            "Take Ksp = 1.8e-11 for Mg(OH)2 as a round teaching value chosen for "
            "clean arithmetic, and hold the solution at a fixed pH with a buffer "
            "so [OH-] is pinned. At pH 11 the pOH is 3, so [OH-] = 1.0e-3 M, and "
            "s = Ksp / [OH-]^2 = 1.8e-11 / (1.0e-3)^2 = 1.8e-11 / 1.0e-6 = 1.8e-5 "
            "M. Now acidify to pH 9, where pOH is 5 and [OH-] = 1.0e-5 M: s = "
            "1.8e-11 / (1.0e-5)^2 = 1.8e-11 / 1.0e-10 = 0.18 M. Dropping the pH "
            "by two units raised the molar solubility by a factor of 1.0e4, from "
            "1.8e-5 M to 0.18 M. This is why milk of magnesia, which is "
            "suspended Mg(OH)2, dissolves readily in the acid of the stomach and "
            "neutralises it, while it stays an undissolved suspension in the "
            "bottle."
        ),
        try_it_prompt=(
            "Does acidifying the solution change the solubility of AgCl? Say why "
            "or why not, thinking about what kind of base chloride is."
        ),
        try_it_answer=(
            "Essentially no change. Chloride is the conjugate base of the strong "
            "acid HCl, so it is a negligibly weak base and added H+ does not "
            "remove it. With nothing consuming the chloride, the dissolution "
            "equilibrium is not shifted, so AgCl is about as soluble at pH 2 as "
            "at pH 7."
        ),
        pitfall=(
            "The pitfall is assuming every salt dissolves more in acid. Only "
            "salts whose anion is a meaningful base respond to pH; hydroxides, "
            "carbonates, and fluorides do, while chlorides and sulfates barely "
            "move because chloride and sulfate are too weak as bases for H+ to "
            "pull them out of the equilibrium."
        ),
        misconception=None,
        claims=(
            Formula(
                "[Mg+2].[OH-].[OH-]",
                "H2MgO2",
                "magnesium hydroxide, Hill order",
            ),
            Formula("[Ag+].[Cl-]", "AgCl", "silver chloride, Hill order"),
            Formula(
                "[Ca+2].[O-]C(=O)[O-]", "CCaO3", "calcium carbonate, Hill order"
            ),
        ),
    ),
    "GEN2.COMPLEXION": Lesson(
        node="GEN2.COMPLEXION",
        objective=(
            "Explain how forming a complex ion increases the solubility of a "
            "salt, and combine Ksp and the formation constant Kf into a single "
            "dissolution constant."
        ),
        build_on=(
            "You have seen removing a product ion pull a dissolution forward; a "
            "ligand does exactly that by binding the metal cation, and the "
            "formation constant Kf measures how tightly it binds."
        ),
        core_idea=(
            "A complex ion is a metal cation with several ligands bound to it, "
            "such as Ag(NH3)2+, and its formation from the free ion has an "
            "equilibrium constant Kf that is usually very large, meaning the "
            "complex strongly favours forming. When a ligand is present it "
            "consumes the free metal ion, and by Le Chatelier that drives a "
            "dissolution equilibrium forward, so a salt that is barely soluble in "
            "water can become quite soluble. The bookkeeping is to add the two "
            "equilibria: dissolving, with constant Ksp, plus complexing, with "
            "constant Kf, gives an overall reaction whose constant is the product "
            "K = Ksp * Kf. That overall K governs how much salt dissolves in the "
            "presence of the ligand, and because Kf can be enormous, the product "
            "can be many orders of magnitude larger than Ksp alone."
        ),
        worked_example=(
            "Dissolve AgCl in aqueous ammonia. Take Ksp = 1.8e-10 for AgCl and "
            "Kf = 1.6e7 for Ag(NH3)2+, both round teaching values chosen for "
            "clean arithmetic. Add the two steps: AgCl(s) equilibrium with Ag+ + "
            "Cl- with Ksp, and Ag+ + 2 NH3 equilibrium with Ag(NH3)2+ with Kf. "
            "The sum is AgCl(s) + 2 NH3 equilibrium with Ag(NH3)2+ + Cl-, with K "
            "= Ksp * Kf = (1.8e-10)(1.6e7) = 2.9e-3. In 1.0 M NH3, let s = "
            "[Ag(NH3)2+] = [Cl-]. Then K = s^2 / [NH3]^2 = 2.9e-3, so taking the "
            "square root, s / (1.0 - 2s) = sqrt(2.9e-3) = 0.054. Solving the "
            "linear equation s = 0.054(1.0 - 2s) gives 1.108 s = 0.054, so s = "
            "0.048 M. Compare with plain water, where s = sqrt(1.8e-10) = 1.3e-5 "
            "M: the ammonia raised the solubility of AgCl by about 3600 times. "
            "Removing the silver ion as a complex is what pulls so much solid "
            "into solution."
        ),
        try_it_prompt=(
            "In the AgCl plus ammonia system above, would raising the ammonia "
            "concentration from 1.0 M to 3.0 M dissolve more AgCl or less? "
            "Explain using the overall equilibrium."
        ),
        try_it_answer=(
            "More. Ammonia is a reactant in AgCl(s) + 2 NH3 equilibrium with "
            "Ag(NH3)2+ + Cl-, so increasing it shifts the equilibrium toward the "
            "dissolved complex, and because it enters squared, the solubility "
            "climbs steeply, roughly in proportion to the ammonia "
            "concentration."
        ),
        pitfall=(
            "The pitfall is treating Ksp as the last word on solubility. A small "
            "Ksp says the bare salt is barely soluble in pure water, but a ligand "
            "with a large Kf can make that same salt dissolve freely, because the "
            "amount that dissolves is governed by the whole set of coupled "
            "equilibria, not by Ksp in isolation."
        ),
        misconception=None,
        claims=(
            Formula("[Ag+].[Cl-]", "AgCl", "silver chloride, Hill order"),
            Formula("N", "H3N", "ammonia, Hill order"),
        ),
    ),
    "GEN2.SELECTIVEPPT": Lesson(
        node="GEN2.SELECTIVEPPT",
        objective=(
            "Determine which of two ions precipitates first as a shared "
            "precipitant is added slowly, and how completely the first is "
            "removed before the second begins."
        ),
        build_on=(
            "You can already find the precipitant concentration that makes Q "
            "equal Ksp for a single salt; selective precipitation runs that "
            "comparison for two salts at once and reads off which threshold is "
            "crossed first."
        ),
        core_idea=(
            "When a solution holds two cations that both form insoluble salts "
            "with the same anion, adding that anion slowly separates them. Each "
            "salt begins to precipitate only when the anion concentration is high "
            "enough to make its own Q reach its own Ksp, and those thresholds "
            "differ. The ion whose salt needs the lower anion concentration "
            "precipitates first, and if the two thresholds are far apart you can "
            "drop almost all of the first ion out of solution before the second "
            "one starts. The measure of how clean the separation is comes from "
            "asking how much of the first ion is still dissolved at the moment the "
            "second ion first begins to precipitate; the smaller that leftover, "
            "the sharper the split."
        ),
        worked_example=(
            "A solution is 0.010 M in Ag+ and 0.010 M in Pb2+, and you add "
            "chloride slowly. Take Ksp = 1.8e-10 for AgCl and Ksp = 1.7e-5 for "
            "PbCl2, both round teaching values chosen for clean arithmetic. AgCl "
            "begins when [Cl-] = Ksp / [Ag+] = 1.8e-10 / 0.010 = 1.8e-8 M. PbCl2 "
            "begins when (Cl-)^2 = Ksp / [Pb2+], so [Cl-] = sqrt(1.7e-5 / 0.010) "
            "= sqrt(1.7e-3) = 0.041 M. Silver needs far less chloride, so AgCl "
            "precipitates first, at 1.8e-8 M, while lead waits until 0.041 M. "
            "Now ask how much silver is left when lead first starts, that is when "
            "[Cl-] = 0.041 M: [Ag+] = Ksp / [Cl-] = 1.8e-10 / 0.041 = 4.4e-9 M. "
            "Compared with the starting 0.010 M, that is a fraction of 4.4e-7, so "
            "about 99.99996 percent of the silver has precipitated before any "
            "lead does. The separation is essentially complete."
        ),
        try_it_prompt=(
            "Two cations, each at 0.010 M, form one to one salts with a shared "
            "anion. Salt one has a round teaching Ksp of 1e-12 and salt two has "
            "1e-6. As you add the anion, which precipitates first, and at what "
            "anion concentration does each begin?"
        ),
        try_it_answer=(
            "Salt one, with Ksp = 1e-12, precipitates first. It begins at [X-] = "
            "1e-12 / 0.010 = 1e-10 M, while salt two does not begin until [X-] = "
            "1e-6 / 0.010 = 1e-4 M. The smaller Ksp is exceeded at the far lower "
            "anion concentration, so its ion leaves solution first."
        ),
        pitfall=(
            "The pitfall is ranking the order of precipitation by comparing Ksp "
            "values directly when the salts have different formulas. A one to two "
            "salt like PbCl2 needs the anion squared, so you must convert each "
            "Ksp into the actual precipitant concentration it requires at the "
            "given cation level before deciding which threshold comes first."
        ),
        misconception=None,
        claims=(
            Formula("[Ag+].[Cl-]", "AgCl", "silver chloride, Hill order"),
            Formula("[Pb+2].[Cl-].[Cl-]", "Cl2Pb", "lead(II) chloride, Hill order"),
            Formula("[Na+].[Cl-]", "ClNa", "sodium chloride, Hill order"),
        ),
    ),
    "GEN2.SPONTANEITY": Lesson(
        node="GEN2.SPONTANEITY",
        objective=(
            "State what spontaneous means thermodynamically, separate it from how "
            "fast a process goes, and connect the direction of a reaction to the "
            "second law."
        ),
        build_on=(
            "Kinetics told you how fast a reaction runs and the Q against K "
            "comparison told you which way it runs; spontaneity is the "
            "thermodynamic name for that direction, the way a process goes on its "
            "own with no outside push."
        ),
        core_idea=(
            "A spontaneous process is one that proceeds by itself once started, "
            "given enough time, without a continuous input of energy. That is a "
            "statement about direction, not about speed, and the two are "
            "independent: iron rusting is spontaneous yet takes years, while the "
            "nonspontaneous reverse, pulling iron back out of rust, needs a "
            "furnace driving it the whole time. Spontaneity is also not the same "
            "as releasing heat, because ice melting above 0 C and ammonium "
            "nitrate dissolving in water both absorb heat yet happen on their "
            "own. The second law supplies the real criterion: a process is "
            "spontaneous exactly when it increases the entropy of the universe, "
            "the system plus its surroundings taken together. Direction is set by "
            "that total entropy, and nothing about it promises the process will "
            "be quick."
        ),
        worked_example=(
            "Judge the rusting of iron, 4 Fe(s) + 3 O2(g) -> 2 Fe2O3(s). It is "
            "spontaneous: left outdoors, iron turns to rust on its own, so the "
            "total entropy of the universe increases as it goes. Yet a steel nail "
            "survives for years, which tells you the rate is slow, and slow says "
            "nothing against spontaneous. The reverse, 2 Fe2O3 -> 4 Fe + 3 O2, is "
            "nonspontaneous; it does not happen on its own, and recovering iron "
            "from ore in a blast furnace demands a continuous supply of energy "
            "and reducing agent. So the same reaction gives one spontaneous "
            "direction and one nonspontaneous direction, and the fact that the "
            "spontaneous one is slow is a separate matter handled by kinetics. "
            "Spontaneity fixes which way, kinetics fixes how fast, and you need "
            "both to describe what actually happens."
        ),
        try_it_prompt=(
            "A reaction has K = 0.001 at 25 C. Starting from standard conditions, "
            "where every species is at 1 M so Q = 1, is the reaction as written, "
            "left to right, spontaneous? Explain."
        ),
        try_it_answer=(
            "No. With Q = 1 and K = 0.001, Q is greater than K, so the system "
            "runs in reverse to reach equilibrium. The forward reaction as "
            "written is nonspontaneous under standard conditions; the reverse "
            "direction is the spontaneous one here."
        ),
        pitfall=(
            "The pitfall is reading spontaneous as fast or as exothermic. Diamond "
            "converting to graphite is spontaneous at room temperature and "
            "imperceptibly slow, and ice melting and ammonium nitrate dissolving "
            "are spontaneous while absorbing heat, so neither speed nor heat "
            "release is what defines the word."
        ),
        misconception=None,
        claims=(Formula("O=O", "O2", "dioxygen, Hill order"),),
    ),
    "GEN2.STANDARDENTROPY": Lesson(
        node="GEN2.STANDARDENTROPY",
        objective=(
            "Use tabulated standard molar entropies to compute a reaction "
            "entropy, and predict the sign first as a check."
        ),
        build_on=(
            "The entropy lesson gave you the molecular picture of dispersal and "
            "how to guess the sign of a change; here you put measured numbers on "
            "it with standard molar entropies drawn from the third law."
        ),
        core_idea=(
            "The third law fixes a true zero for entropy: a perfect crystal at 0 "
            "K has S = 0, so entropies are measured on an absolute scale rather "
            "than relative to some reference. That is the key difference from "
            "enthalpy. A pure element in its standard state has a formation "
            "enthalpy defined as zero, but its standard molar entropy is a real "
            "positive number, never zero, so elements carry entropy into a "
            "reaction sum. You compute a reaction entropy the same way you sum "
            "any tabulated state function, delta S = sum of n times S for "
            "products minus sum of n times S for reactants, weighting each by its "
            "coefficient. The discipline worth building is to predict the sign "
            "before you compute: more moles of gas on the product side means a "
            "positive delta S, fewer means negative, and the arithmetic should "
            "then agree with that call."
        ),
        worked_example=(
            "Find delta S for N2(g) + 3 H2(g) -> 2 NH3(g). Predict the sign "
            "first: 4 moles of gas become 2 moles of gas, a large drop in the "
            "dispersal of matter, so delta S should be distinctly negative. Now use "
            "standard molar entropies S = 191.6 for N2, 130.7 for H2, and 192.8 "
            "for NH3, all in J/(mol*K). Products: 2 * 192.8 = 385.6 J/K. "
            "Reactants: 191.6 + 3 * 130.7 = 191.6 + 392.1 = 583.7 J/K. Subtract: "
            "delta S = 385.6 - 583.7 = -198.1 J/K, which is negative as "
            "predicted. The sign check caught nothing wrong here, but that is the "
            "point of doing it, since a sign that disagreed with the moles of gas "
            "would flag an arithmetic slip before it propagated into a Gibbs "
            "calculation."
        ),
        try_it_prompt=(
            "Predict the sign, then compute delta S for C(graphite) + O2(g) -> "
            "CO2(g), using S = 5.7 for graphite, 205.2 for O2, and 213.8 for CO2, "
            "all in J/(mol*K)."
        ),
        try_it_answer=(
            "delta S = +2.9 J/K, a small positive value. Prediction: the moles of "
            "gas do not change, one in and one out, so delta S should be near "
            "zero. Compute: 213.8 - (5.7 + 205.2) = 213.8 - 210.9 = +2.9 J/K, the "
            "small positive coming from consuming the low entropy solid."
        ),
        pitfall=(
            "The pitfall is treating an element's standard entropy as zero "
            "because its formation enthalpy is zero. The formation enthalpy of "
            "O2 is zero by definition, but its standard molar entropy is 205.2 "
            "J/(mol*K), and dropping elements from an entropy sum by that false "
            "analogy gives a wrong delta S every time."
        ),
        misconception=None,
        claims=(
            Formula("N#N", "N2", "dinitrogen, Hill order"),
            Formula("[H][H]", "H2", "dihydrogen, Hill order"),
            Formula("N", "H3N", "ammonia, Hill order"),
            Formula("[C]", "C", "graphite carbon, Hill order"),
            Formula("O=O", "O2", "dioxygen, Hill order"),
            Formula("O=C=O", "CO2", "carbon dioxide, Hill order"),
            Source(
                "Standard molar entropies used: N2(g) 191.6, H2(g) 130.7, "
                "NH3(g) 192.8, C(graphite) 5.7, O2(g) 205.2, CO2(g) 213.8 "
                "J/(mol*K).",
                _APPX_G,
            ),
        ),
    ),
    "GEN2.SURROUNDINGS": Lesson(
        node="GEN2.SURROUNDINGS",
        objective=(
            "Compute the entropy change of the surroundings from the system's "
            "enthalpy change and temperature, and combine it with the system term "
            "to judge spontaneity."
        ),
        build_on=(
            "You can now find the system's entropy change from tables; the second "
            "law is about the universe, so you need the other half, the "
            "surroundings, before you can apply it."
        ),
        core_idea=(
            "The second law constrains the universe, delta S(universe) = "
            "delta S(system) + delta S(surroundings), and the surroundings term "
            "has a compact form. Heat released by the system at constant pressure "
            "flows into the surroundings, and that heat is minus the system's "
            "enthalpy change, so delta S(surroundings) = -delta H(system) / T. "
            "Read the sign: an exothermic reaction, with negative delta H, gives "
            "a positive surroundings entropy, which is how a reaction that lowers "
            "its own entropy can still be spontaneous overall. Because T sits in "
            "the denominator, the same amount of heat raises the surroundings "
            "entropy more when the temperature is low, so cooling amplifies the "
            "surroundings term. This is the mechanism behind exothermic "
            "reactions becoming spontaneous only below some temperature."
        ),
        worked_example=(
            "Ask whether water freezes, H2O(l) -> H2O(s). Freezing releases the "
            "heat of fusion, so delta H = -6.01 kJ/mol, and since the liquid "
            "orders into a solid, delta S(system) is negative; at the 0 C melting "
            "point delta S(fusion) = delta H / T = 6010 / 273 = 22.0 J/(mol*K), "
            "so for freezing delta S(system) = -22.0 J/(mol*K). At -10 C = 263 K: "
            "delta S(surroundings) = -(-6010) / 263 = +22.85 J/(mol*K), so "
            "delta S(universe) = -22.0 + 22.85 = +0.85 J/(mol*K), positive, and "
            "water freezes. At +10 C = 283 K: delta S(surroundings) = 6010 / 283 "
            "= +21.24 J/(mol*K), so delta S(universe) = -22.0 + 21.24 = -0.76 "
            "J/(mol*K), negative, and ice melts instead. The surroundings term, "
            "which grows as T falls, is exactly what tips freezing into "
            "spontaneity once the temperature drops below 0 C."
        ),
        try_it_prompt=(
            "An exothermic reaction has delta H = -100. kJ/mol. What is "
            "delta S(surroundings) at 298 K, and does lowering the temperature "
            "make that term larger or smaller?"
        ),
        try_it_answer=(
            "delta S(surroundings) = -(-100000) / 298 = +336 J/(mol*K). Lowering "
            "the temperature makes it larger, because T is in the denominator, so "
            "cooling increases the surroundings entropy gain from the released "
            "heat and favours spontaneity for an exothermic reaction."
        ),
        pitfall=(
            "The pitfall is dropping the minus sign or leaving delta H in "
            "kilojoules while entropies are in joules. The formula is "
            "delta S(surroundings) = -delta H(system) / T, so an exothermic "
            "reaction, negative delta H, yields a positive surroundings entropy, "
            "and delta H must be converted to joules before dividing by T in "
            "kelvin."
        ),
        misconception=None,
        claims=(
            Formula("O", "H2O", "water, Hill order"),
            Source(
                "Enthalpy of fusion of water taken as 6.01 kJ/mol.",
                _CRC,
            ),
        ),
    ),
    "GEN2.GIBBSCASES": Lesson(
        node="GEN2.GIBBSCASES",
        objective=(
            "Classify a reaction by the signs of delta H and delta S into one of "
            "four temperature behaviours, and find the crossover temperature when "
            "there is one."
        ),
        build_on=(
            "The Gibbs lesson gave you delta G = delta H - T * delta S; here you "
            "read that equation's temperature behaviour straight off the signs of "
            "its two pieces."
        ),
        core_idea=(
            "The equation delta G = delta H - T * delta S sorts every reaction "
            "into four cases by the signs of delta H and delta S. If delta H is "
            "negative and delta S positive, both terms drive delta G negative, so "
            "the reaction is spontaneous at every temperature. If delta H is "
            "positive and delta S negative, both push delta G positive, so it is "
            "spontaneous at no temperature. The two mixed cases depend on "
            "temperature: with both negative, the -T * delta S term is positive "
            "and grows with T, so the reaction is spontaneous only at low T; with "
            "both positive, the same term is negative and grows in size with T, "
            "so it is spontaneous only at high T. For those two temperature "
            "dependent cases there is a crossover temperature where delta G = 0, "
            "found by setting delta H = T * delta S, so T = delta H / delta S."
        ),
        worked_example=(
            "Take CaCO3(s) -> CaO(s) + CO2(g), with delta H = +179.0 kJ/mol and "
            "delta S = +159.0 J/(mol*K). Both are positive, which is the high "
            "temperature case, spontaneous only once T is large enough. Find the "
            "crossover: T = delta H / delta S = 179000 / 159.0 = 1126 K, which is "
            "853 C. Below that, delta G is positive and limestone is stable; "
            "above it, delta G turns negative and the carbonate decomposes, which "
            "is why an industrial lime kiln is run near 900 C. Check the room "
            "temperature end at T = 298 K: delta G = 179000 - 298 * 159.0 = "
            "179000 - 47382 = +131600 J/mol, or about +132 kJ/mol, strongly "
            "positive, confirming that limestone does not fall apart on a shelf."
        ),
        try_it_prompt=(
            "Ammonia synthesis, N2 + 3 H2 -> 2 NH3, has delta H = -92.2 kJ/mol "
            "and delta S = -198.1 J/(mol*K). Which of the four cases is it, and "
            "above what temperature does it stop being spontaneous?"
        ),
        try_it_answer=(
            "Both are negative, the low temperature case, spontaneous only below "
            "the crossover. T = delta H / delta S = 92200 / 198.1 = 465 K, which "
            "is 192 C, so above about 465 K delta G becomes positive and the "
            "forward reaction is no longer spontaneous. That squeeze is why the "
            "process leans on high pressure to keep the yield up."
        ),
        pitfall=(
            "The pitfall is deciding a positive delta H means a reaction can "
            "never be spontaneous. An endothermic reaction with positive delta S "
            "becomes spontaneous once T passes delta H / delta S, which is why "
            "CaCO3 decomposition and ice melting both run despite absorbing "
            "heat."
        ),
        misconception=None,
        claims=(
            Formula(
                "[Ca+2].[O-]C(=O)[O-]", "CCaO3", "calcium carbonate, Hill order"
            ),
            Formula("[Ca+2].[O-2]", "CaO", "calcium oxide, Hill order"),
            Formula("O=C=O", "CO2", "carbon dioxide, Hill order"),
            Source(
                "For CaCO3(s) -> CaO(s) + CO2(g), delta H = +179.0 kJ/mol and "
                "delta S = +159.0 J/(mol*K), from standard enthalpies of "
                "formation and standard molar entropies. For N2 + 3 H2 -> 2 NH3, "
                "delta H = -92.2 kJ/mol.",
                _APPX_G,
            ),
        ),
    ),
    "GEN2.GIBBSFORMATION": Lesson(
        node="GEN2.GIBBSFORMATION",
        objective=(
            "Compute a standard reaction free energy delta G(std) from tabulated "
            "standard free energies of formation."
        ),
        build_on=(
            "Hess's law let you total standard formation enthalpies to get "
            "delta H(std); standard free energies of formation total the same "
            "way to give delta G(std) directly, without a separate delta H and "
            "delta S."
        ),
        core_idea=(
            "The standard free energy of formation, delta Gf(std), is defined "
            "exactly like the formation enthalpy: it is the free energy change to "
            "make one mole of a compound from its elements in their standard "
            "states, and for an element already in its standard state it is zero. "
            "Once you have a table of these values, a reaction free energy is a "
            "single subtraction, delta G(std) = sum of n times delta Gf(std) for "
            "products minus sum of n times delta Gf(std) for reactants, each "
            "weighted by its coefficient. This is the fastest route to "
            "delta G(std) at 25 C, because it skips computing delta H and delta S "
            "separately and combining them. A negative result means the reaction "
            "is spontaneous under standard conditions, and the more negative it "
            "is, the further the reaction sits toward products."
        ),
        worked_example=(
            "Burn methane, CH4(g) + 2 O2(g) -> CO2(g) + 2 H2O(l). Use standard "
            "free energies of formation, delta Gf(std) = -50.5 for CH4, 0 for O2, "
            "-394.4 for CO2, and -237.1 for H2O(l), all in kJ/mol. Products: "
            "(-394.4) + 2 * (-237.1) = -394.4 - 474.2 = -868.6 kJ/mol. Reactants: "
            "(-50.5) + 2 * 0 = -50.5 kJ/mol. Subtract: delta G(std) = -868.6 - "
            "(-50.5) = -818.1 kJ/mol. The large negative value says the "
            "combustion of methane is strongly spontaneous at 25 C, which matches "
            "the everyday fact that natural gas burns readily once lit; the "
            "lighting is a kinetic barrier, not a thermodynamic one."
        ),
        try_it_prompt=(
            "Compute delta G(std) for 2 NO2(g) -> N2O4(g), using delta Gf(std) = "
            "+51.3 for NO2 and +99.8 for N2O4, both in kJ/mol. Is it spontaneous "
            "at 25 C?"
        ),
        try_it_answer=(
            "delta G(std) = 99.8 - 2 * 51.3 = 99.8 - 102.6 = -2.8 kJ/mol. It is "
            "negative, so the dimerization is spontaneous under standard "
            "conditions, though only barely, which foreshadows an equilibrium "
            "constant close to 1."
        ),
        pitfall=(
            "The pitfall is inventing a nonzero formation free energy for an "
            "element in its standard state. As with formation enthalpies, "
            "delta Gf(std) of O2(g) or N2(g) is zero by definition, and slipping "
            "a stray value in for an element throws off the whole reaction "
            "total."
        ),
        misconception=None,
        claims=(
            Formula("C", "CH4", "methane, Hill order"),
            Formula("O=O", "O2", "dioxygen, Hill order"),
            Formula("O=C=O", "CO2", "carbon dioxide, Hill order"),
            Formula("O", "H2O", "water, Hill order"),
            Formula("[O-][N+]=O", "NO2", "nitrogen dioxide, Hill order"),
            Formula(
                "O=[N+]([O-])[N+](=O)[O-]",
                "N2O4",
                "dinitrogen tetroxide, Hill order",
            ),
            Source(
                "Standard free energies of formation used, in kJ/mol: CH4(g) "
                "-50.5, CO2(g) -394.4, H2O(l) -237.1, NO2(g) +51.3, N2O4(g) "
                "+99.8; elements O2(g) and N2(g) are zero by definition.",
                _APPX_G,
            ),
        ),
    ),
    "GEN2.NONSTANDARD": Lesson(
        node="GEN2.NONSTANDARD",
        objective=(
            "Compute the free energy change under nonstandard conditions with "
            "delta G = delta G(std) + R * T * ln(Q), and explain why the "
            "correction term vanishes at equilibrium."
        ),
        build_on=(
            "You can get delta G(std) from formation free energies, which assumes "
            "every species is at 1 M or 1 atm; the R * T * ln(Q) term adjusts "
            "that standard value to the concentrations you actually have."
        ),
        core_idea=(
            "The standard free energy delta G(std) describes a very specific "
            "situation, every species at unit activity, and real mixtures are "
            "rarely there. The full relation is delta G = delta G(std) + R * T * "
            "ln(Q), where Q is the same reaction quotient you use to compare with "
            "K, and R is the gas constant with T in kelvin. The correction term "
            "carries the sign of ln(Q): when the mixture is rich in reactants Q "
            "is small, ln(Q) is negative, and the term makes delta G more "
            "negative, favouring the forward reaction. As the reaction proceeds Q "
            "climbs toward K, the term rises, and at equilibrium Q equals K, "
            "delta G reaches zero, and the correction exactly cancels "
            "delta G(std). The lesson to hold onto is that nonstandard conditions "
            "can flip the sign of delta G relative to delta G(std)."
        ),
        worked_example=(
            "Take N2O4(g) -> 2 NO2(g), which has delta G(std) = +2.8 kJ/mol at "
            "298 K, the reverse of the dimerization worked earlier. Under "
            "standard conditions the positive delta G(std) says N2O4 does not "
            "decompose. But suppose the partial pressures are P(NO2) = 0.10 atm "
            "and P(N2O4) = 1.0 atm. Then Q = P(NO2)^2 / P(N2O4) = (0.10)^2 / 1.0 "
            "= 0.010. Compute the correction with R = 8.314 J/(mol*K) and T = 298 "
            "K: R * T * ln(Q) = 8.314 * 298 * ln(0.010) = 2477 * (-4.605) = "
            "-11406 J/mol, or -11.4 kJ/mol. So delta G = +2.8 + (-11.4) = -8.6 "
            "kJ/mol. Under these low product conditions the decomposition is "
            "spontaneous, even though delta G(std) alone said it was not, because "
            "the mixture starts far from equilibrium on the reactant side."
        ),
        try_it_prompt=(
            "For that same reaction N2O4 -> 2 NO2, what is delta G when the "
            "system sits at equilibrium, and why?"
        ),
        try_it_answer=(
            "delta G = 0 exactly. At equilibrium Q equals K, so delta G = "
            "delta G(std) + R * T * ln(K); since delta G(std) itself equals "
            "-R * T * ln(K), the two terms cancel. That cancellation, delta G "
            "falling to zero, is what equilibrium means."
        ),
        pitfall=(
            "The pitfall is confusing delta G with delta G(std). The standard "
            "value is one fixed number for the reaction at a chosen temperature, "
            "while delta G depends on the current Q and changes as the reaction "
            "runs, reaching zero at equilibrium. A positive delta G(std) does not "
            "forbid the reaction when Q is small enough."
        ),
        misconception=None,
        claims=(
            Formula(
                "O=[N+]([O-])[N+](=O)[O-]",
                "N2O4",
                "dinitrogen tetroxide, Hill order",
            ),
            Formula("[O-][N+]=O", "NO2", "nitrogen dioxide, Hill order"),
            Source(
                "Molar gas constant R = 8.314 J/(mol*K).",
                _CRC,
            ),
        ),
    ),
    "GEN2.GIBBSK": Lesson(
        node="GEN2.GIBBSK",
        objective=(
            "Relate the standard free energy change to the equilibrium constant "
            "with delta G(std) = -R * T * ln(K), and solve for K from "
            "delta G(std)."
        ),
        build_on=(
            "The nonstandard lesson showed delta G = delta G(std) + R * T * ln(Q) "
            "goes to zero at equilibrium; setting delta G = 0 with Q equal to K "
            "is what produces the bridge to the equilibrium constant."
        ),
        core_idea=(
            "At equilibrium delta G is zero and Q equals K, so the relation "
            "delta G = delta G(std) + R * T * ln(Q) becomes 0 = delta G(std) + "
            "R * T * ln(K), which rearranges to delta G(std) = -R * T * ln(K). "
            "This is the single equation linking thermodynamics to equilibrium, "
            "and its signs are worth memorising: a negative delta G(std) makes "
            "ln(K) positive so K is greater than 1 and products are favoured, a "
            "positive delta G(std) makes K less than 1 and reactants are "
            "favoured, and delta G(std) of zero gives K equal to 1. Because K "
            "depends on delta G(std) through an exponential, a modest free energy "
            "change produces a large swing in K, so a delta G(std) of only a few "
            "tens of kJ/mol already drives K to extreme values."
        ),
        worked_example=(
            "Take 2 NO2(g) -> N2O4(g), with delta G(std) = -2.8 kJ/mol at 298 K, "
            "and find K. Rearrange delta G(std) = -R * T * ln(K) to ln(K) = "
            "-delta G(std) / (R * T). Substitute, keeping delta G(std) in joules: "
            "ln(K) = -(-2800) / (8.314 * 298) = 2800 / 2477.6 = 1.130. Then K = "
            "e^1.130 = 3.1. So the equilibrium constant is about 3.1, modestly "
            "greater than 1, which fits the small negative delta G(std): products "
            "are favoured, but not overwhelmingly. As a check, the reverse "
            "reaction N2O4 -> 2 NO2 has delta G(std) = +2.8 kJ/mol and therefore "
            "K = 1 / 3.1 = 0.32, the reciprocal, exactly as reversing a reaction "
            "should give."
        ),
        try_it_prompt=(
            "A reaction has delta G(std) = -40.0 kJ/mol at 298 K. Estimate its "
            "equilibrium constant K."
        ),
        try_it_answer=(
            "K is about 1e7. Compute ln(K) = -(-40000) / (8.314 * 298) = 40000 / "
            "2477.6 = 16.14, so K = e^16.14 = about 1.0e7. A moderately negative "
            "delta G(std) of -40 kJ/mol already gives an enormous K, with "
            "products overwhelmingly favoured, which shows how steeply K responds "
            "to delta G(std)."
        ),
        pitfall=(
            "The pitfall is putting the wrong free energy into this relation. "
            "Only the standard value delta G(std) equals -R * T * ln(K); the "
            "actual delta G is zero at equilibrium, not equal to -R * T * ln(K). "
            "Using a nonstandard delta G here, or forgetting to convert kJ to J, "
            "gives a wrong K."
        ),
        misconception=None,
        claims=(
            Formula("[O-][N+]=O", "NO2", "nitrogen dioxide, Hill order"),
            Formula(
                "O=[N+]([O-])[N+](=O)[O-]",
                "N2O4",
                "dinitrogen tetroxide, Hill order",
            ),
            Source(
                "Molar gas constant R = 8.314 J/(mol*K).",
                _CRC,
            ),
        ),
    ),
}
