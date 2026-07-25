"""The OCTET misconception library.

Per the coding standard, chemistry facts live in reviewed data files with
cited sources, never inline in code. This module is that data file for named
misconceptions.

Review status. Every entry carries review="pending" until a named subject
matter expert signs it off, at which point the entry records that reviewer and
date. Nothing in this file may be presented in product as expert verified
while it reads "pending". The literature citations below are the research
basis for the misconception, they are not a substitute for that review.

Sources cited across this library:
  Johnstone, A. H. (1991). Why is science difficult to learn? Things are
    seldom what they seem. Journal of Computer Assisted Learning, 7(2).
  Taber, K. S. (2002). Chemical Misconceptions: Prevention, Diagnosis and
    Cure. Royal Society of Chemistry.
  Nakhleh, M. B. (1992). Why some students don't learn chemistry: Chemical
    misconceptions. Journal of Chemical Education, 69(3).
  Kind, V. (2004). Beyond Appearances: Students' misconceptions about basic
    chemical ideas (2nd ed.). Royal Society of Chemistry.
  Bodner, G. M. (1991). I have found you an argument: The conceptual
    knowledge of beginning chemistry graduate students. Journal of Chemical
    Education, 68(5).
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Misconception:
    """A named wrong belief, its counterexample, and where to send the learner.

    code: stable identifier used by graders and MC distractor keys.
    routes_to: knowledge node code the adaptive picker remediates on.
    counterexample: the one line that breaks the belief. The teaching model
        requires naming the belief and showing the counterexample rather than
        stating the correct answer.
    source: literature citation for the misconception.
    review: "pending" until a named SME signs off.
    """

    code: str
    name: str
    description: str
    counterexample: str
    routes_to: str
    source: str
    review: str = "pending"
    reviewer: str = ""
    reviewed_on: str = ""


MISCONCEPTIONS: dict[str, Misconception] = {
    m.code: m
    for m in [
        Misconception(
            code="SUB-COEF",
            name="Subscripts and coefficients are interchangeable",
            description=(
                "The learner changes a subscript to balance an equation, treating "
                "the count of atoms inside a formula unit as adjustable."
            ),
            counterexample=(
                "Changing H2O to H2O2 balances the oxygen but names a different "
                "substance: hydrogen peroxide is not water."
            ),
            routes_to="GEN1.BALANCE",
            source="Kind (2004); Nakhleh (1992)",
        ),
        Misconception(
            code="ATOM-CONSERV",
            name="Atoms need not be conserved",
            description=(
                "The learner treats a reaction as creating or destroying atoms "
                "rather than rearranging them."
            ),
            counterexample=(
                "Weigh a sealed flask before and after the reaction runs. The mass "
                "does not change."
            ),
            routes_to="GEN1.CONSERVATION",
            source="Nakhleh (1992); Kind (2004)",
        ),
        Misconception(
            code="NOT-MINIMAL",
            name="Any balanced set of coefficients will do",
            description=(
                "The learner balances correctly but leaves a common factor, not "
                "recognising the convention of smallest whole numbers."
            ),
            counterexample=(
                "2 H2 + O2 -> 2 H2O and 4 H2 + 2 O2 -> 4 H2O describe the same "
                "reaction. Only the first is in lowest terms."
            ),
            routes_to="GEN1.BALANCE",
            source="Kind (2004)",
        ),
        Misconception(
            code="CHG-BAL",
            name="Charge does not need to balance",
            description=(
                "In ionic and redox equations the learner balances atoms only and "
                "leaves net charge unequal across the arrow."
            ),
            counterexample=(
                "Fe2+ -> Fe3+ balances iron but creates charge from nothing. The "
                "electron has to appear in the equation."
            ),
            routes_to="GEN1.OXNUMBERS",
            source="Taber (2002)",
        ),
        Misconception(
            code="CHG-OMIT",
            name="A polyatomic ion is neutral",
            description=(
                "The learner writes the atom counts of an ion correctly but omits "
                "its charge, treating the ion as a molecule."
            ),
            counterexample=(
                "SO4 does not exist as a neutral species in solution. Sulfate is "
                "SO4 with a 2 minus charge."
            ),
            routes_to="GEN1.NOMENIONIC",
            source="Taber (2002); Kind (2004)",
        ),
        Misconception(
            code="EMP-MOL",
            name="Empirical and molecular formulas are the same thing",
            description=(
                "The learner reports the simplest ratio when the molecular formula "
                "was asked for, or the reverse."
            ),
            counterexample=(
                "Glucose and formaldehyde share the empirical formula CH2O. They "
                "are not the same compound."
            ),
            routes_to="GEN1.EMPIRICAL",
            source="Kind (2004)",
        ),
        Misconception(
            code="MOLECULAR-IONIC",
            name="Ionic compounds exist as discrete molecules",
            description=(
                "The learner pictures NaCl as a pair of atoms bonded together "
                "rather than an extended lattice, a particulate level error that "
                "the symbolic formula NaCl actively encourages."
            ),
            counterexample=(
                "There is no single NaCl unit to point at in a salt crystal. Each "
                "sodium ion is surrounded by six chloride ions."
            ),
            routes_to="GEN1.IONICBOND",
            source="Taber (2002); Johnstone (1991)",
        ),
        Misconception(
            code="OCTET-EXPLAINS",
            name="Atoms react in order to fill their outer shell",
            description=(
                "The learner treats the octet rule as the cause of bonding, giving "
                "atoms intent, rather than as a pattern that energetics explain."
            ),
            counterexample=(
                "Sulfur hexafluoride is stable with twelve electrons around "
                "sulfur. The pattern is a summary, not a law of desire."
            ),
            routes_to="GEN1.IONICBOND",
            source="Taber (2002), the octet framework",
        ),
        Misconception(
            code="MOLES-NOT-MASS",
            name="Moles and grams are interchangeable",
            description=(
                "The learner stops the stoichiometry chain at moles of product and "
                "reports it as a mass."
            ),
            counterexample=(
                "One mole of hydrogen gas weighs about 2 grams, one mole of lead "
                "weighs about 207 grams. The count is not the mass."
            ),
            routes_to="GEN1.MOLE",
            source="Nakhleh (1992); Bodner (1991)",
        ),
        Misconception(
            code="NO-RATIO",
            name="The mole ratio can be skipped",
            description=(
                "The learner converts mass to moles and back without crossing the "
                "balanced equation."
            ),
            counterexample=(
                "Burning one mole of propane does not give one mole of carbon "
                "dioxide. It gives three."
            ),
            routes_to="GEN1.STOICH",
            source="Nakhleh (1992)",
        ),
        Misconception(
            code="IGNORED-RATIO",
            name="Reactions run one to one",
            description=(
                "The learner assumes a one to one stoichiometric ratio regardless "
                "of the balanced equation."
            ),
            counterexample=(
                "2 H2 + O2 -> 2 H2O consumes twice as much hydrogen as oxygen."
            ),
            routes_to="GEN1.STOICH",
            source="Nakhleh (1992); Kind (2004)",
        ),
        Misconception(
            code="RATIO-INVERTED",
            name="The mole ratio direction does not matter",
            description=(
                "The learner writes the ratio upside down, dividing where they "
                "should multiply."
            ),
            counterexample=(
                "Converting from reactant to product puts product coefficient on "
                "top. Flipping it turns an increase into a decrease."
            ),
            routes_to="GEN1.STOICH",
            source="Nakhleh (1992)",
        ),
        Misconception(
            code="WRONG-MOLAR-MASS",
            name="One molar mass serves the whole problem",
            description=(
                "The learner converts back to mass using the molar mass of the "
                "starting species rather than the product."
            ),
            counterexample=(
                "Each substance has its own molar mass. Using the reactant's mass "
                "for the product answers a different question."
            ),
            routes_to="GEN1.MOLE",
            source="Bodner (1991)",
        ),
        Misconception(
            code="SIGFIG",
            name="Significant figures are decoration",
            description=(
                "The learner reports more precision than the measurement carries, "
                "treating calculator digits as data."
            ),
            counterexample=(
                "A balance reading 2.50 grams does not justify an answer to six "
                "figures. The instrument sets the limit."
            ),
            routes_to="GEN1.SIGFIGS",
            source="Kind (2004)",
        ),
        Misconception(
            code="COEF-NONPOS",
            name="Zero or negative coefficients are allowed",
            description=(
                "The learner submits a zero or negative coefficient, which would "
                "mean a species is absent or produced in negative amount."
            ),
            counterexample=(
                "A coefficient of zero deletes a species that the equation says "
                "takes part."
            ),
            routes_to="GEN1.BALANCE",
            source="Kind (2004)",
        ),
        Misconception(
            code="APPROX-INVALID",
            name="The small x approximation always applies",
            description=(
                "The learner drops x from the denominator without testing the five "
                "percent condition."
            ),
            counterexample=(
                "For a moderately weak acid at low concentration x can exceed ten "
                "percent of the initial value, and the approximation then moves "
                "the answer by more than the tolerance."
            ),
            routes_to="GEN2.EQUILIBRIUM",
            source="Kind (2004)",
        ),
        Misconception(
            code="PH-POH",
            name="pH and pOH are interchangeable",
            description=(
                "The learner computes hydroxide concentration and reports its "
                "negative logarithm as pH."
            ),
            counterexample=(
                "A solution with pOH 3 has pH 11 at 25 C, not pH 3. One is basic, "
                "the other acidic."
            ),
            routes_to="GEN2.BRONSTED",
            source="Kind (2004); Nakhleh (1992)",
        ),
        Misconception(
            code="K-SQUARE",
            name="The equilibrium constant is linear in concentration",
            description=(
                "The learner forgets the exponent or the square root when the "
                "stoichiometry is not one to one."
            ),
            counterexample=(
                "For x squared over C the extent is the square root of K times C, "
                "not K times C."
            ),
            routes_to="GEN2.EQUILIBRIUM",
            source="Kind (2004)",
        ),
        Misconception(
            code="LECHAT-AMOUNT",
            name="Le Chatelier shifts change the constant",
            description=(
                "The learner believes adding reactant changes K rather than "
                "shifting the position of equilibrium."
            ),
            counterexample=(
                "Adding reactant shifts the position toward products, and Q "
                "returns to the same K. Only temperature changes K."
            ),
            routes_to="GEN2.EQUILIBRIUM",
            source="Taber (2002); Kind (2004)",
        ),
        # Phase 3 additions. These are the beliefs the structure grader and the
        # predict, observe, explain simulations are built to surface, so they
        # arrive with the graders that diagnose them rather than ahead of them.
        Misconception(
            code="STEREO-IGNORED",
            name="Three dimensional arrangement does not change the substance",
            description=(
                "The learner treats a structural drawing as a connectivity list, "
                "so two molecules with the same bonds but different arrangements "
                "in space read as the same compound."
            ),
            counterexample=(
                "Carvone has one arrangement that smells of spearmint and its "
                "mirror image smells of caraway. Same atoms, same bonds, "
                "different arrangement in space, different substance."
            ),
            routes_to="GEN1.VSEPR",
            source="Taber (2002); Kind (2004)",
        ),
        Misconception(
            code="CONSTITUTIONAL-ISOMER",
            name="Molecular formula identifies the compound",
            description=(
                "The learner treats the molecular formula as a unique name, so "
                "any structure with the right atom counts reads as correct."
            ),
            counterexample=(
                "C2H6O is ethanol, which is a drinkable liquid boiling at 78 "
                "degrees Celsius, and it is also dimethyl ether, which is a gas "
                "at room temperature. The formula does not settle which."
            ),
            routes_to="GEN1.EMPIRICAL",
            source="Taber (2002); Nakhleh (1992)",
        ),
        Misconception(
            code="EQUIV-IS-NEUTRAL",
            name="The equivalence point is always pH 7",
            description=(
                "The learner equates equivalence, which is a stoichiometric "
                "condition, with neutrality, which is a statement about pH."
            ),
            counterexample=(
                "Titrating acetic acid with sodium hydroxide reaches equivalence "
                "at pH 8.7. All the acid has reacted, and the acetate left "
                "behind is a weak base."
            ),
            routes_to="GEN2.TITRATIONWEAK",
            source="Taber (2002); Nakhleh (1992)",
        ),
        Misconception(
            code="INDICATOR-SETS-EQUIV",
            name="The indicator determines where the equivalence point is",
            description=(
                "The learner believes the colour change creates the equivalence "
                "point rather than reporting an endpoint near it."
            ),
            counterexample=(
                "Run the same titration with two different indicators and the "
                "equivalence volume is unchanged. Only the endpoint the eye "
                "catches moves, which is why the indicator is chosen to match."
            ),
            routes_to="GEN2.TITRATIONWEAK",
            source="Taber (2002)",
        ),
        Misconception(
            code="CATALYST-SHIFTS",
            name="A catalyst shifts the position of equilibrium",
            description=(
                "The learner reasons that anything which speeds a reaction must "
                "produce more product, so a catalyst is expected to shift the "
                "position toward products."
            ),
            counterexample=(
                "A catalyst lowers the activation barrier in both directions by "
                "the same amount. Forward and reverse rates rise together, so "
                "equilibrium arrives sooner at exactly the same composition."
            ),
            routes_to="GEN2.LECHATELIER",
            source="Taber (2002); Kind (2004)",
        ),
        Misconception(
            code="STRONG-IS-CONCENTRATED",
            name="Strong and concentrated mean the same thing",
            description=(
                "The learner conflates the extent of dissociation, which is what "
                "strong describes, with the amount of solute per volume, which "
                "is what concentrated describes."
            ),
            counterexample=(
                "A 0.001 molar hydrochloric acid solution is strong and dilute. "
                "A 15 molar acetic acid solution is weak and concentrated."
            ),
            routes_to="GEN2.BRONSTED",
            source="Taber (2002); Nakhleh (1992); Kind (2004)",
        ),
        Misconception(
            code="SPECTATOR-ACTIVE",
            name="Spectator ions influence the outcome",
            description=(
                "The learner attributes an observed change to an ion that took "
                "no part in the reaction, most often the counter ion carried in "
                "with a reagent."
            ),
            counterexample=(
                "Titrate the same acid with potassium hydroxide instead of "
                "sodium hydroxide and the curve is unchanged. If sodium were "
                "doing the work, swapping it would show."
            ),
            routes_to="GEN1.NETIONIC",
            source="Taber (2002); Nakhleh (1992)",
        ),
    ]
}


def get(code: str) -> Misconception | None:
    return MISCONCEPTIONS.get(code)


def routes_for(code: str) -> str | None:
    m = MISCONCEPTIONS.get(code)
    return m.routes_to if m else None


def unreviewed() -> list[str]:
    """Codes still awaiting SME sign off. Used by the compliance report."""
    return sorted(c for c, m in MISCONCEPTIONS.items() if m.review != "reviewed")


# ORG1 stereochemistry misconceptions. Added in Phase 5 for the organic MC
# templates, which cannot ship without every distractor keying a named
# misconception.
#
# On sources: the twenty six entries above cite published chemistry education
# research where one was found. For these four the specific belief is familiar
# from teaching practice but has not been traced to a particular study, and the
# honest thing is to say so in the source field rather than attach a citation
# that was not checked. All remain review "pending" like every other entry.
MISCONCEPTIONS.update(
    {
        "CIP-RANK-BY-SIZE": Misconception(
            code="CIP-RANK-BY-SIZE",
            name="Priority follows group size rather than atomic number",
            description=(
                "The learner ranks substituents by how bulky or how many atoms "
                "they contain, so a tert-butyl group outranks a hydroxyl."
            ),
            counterexample=(
                "In butan-2-ol the hydroxyl outranks both carbon chains, "
                "because priority is decided by the atomic number of the first "
                "atom and oxygen beats carbon regardless of what follows it."
            ),
            routes_to="ORG1.RS",
            source="Instructor observation; not traced to a published study",
            review="pending",
        ),
        "CIP-VIEWER-FACING": Misconception(
            code="CIP-VIEWER-FACING",
            name="Rotation read without checking where the lowest priority points",
            description=(
                "The learner traces 1 to 2 to 3 and reports the direction "
                "without first establishing that the lowest priority group "
                "points away, so every centre drawn with the hydrogen toward "
                "the viewer comes out inverted."
            ),
            counterexample=(
                "In a Fischer projection the horizontal bonds point toward the "
                "viewer. Reading a clockwise rotation there gives S, not R, "
                "and the drawing offers no hint that a reversal was needed."
            ),
            routes_to="ORG1.RS",
            source="Instructor observation; not traced to a published study",
            review="pending",
        ),
        "MESO-AS-ENANTIOMERS": Misconception(
            code="MESO-AS-ENANTIOMERS",
            name="A meso compound and its mirror image are a pair",
            description=(
                "The learner sees two structures with inverted stereocentres "
                "and concludes they are enantiomers, without checking whether "
                "an internal mirror plane makes them the same molecule."
            ),
            counterexample=(
                "R,S and S,R tartaric acid invert at every centre and are one "
                "compound, because the mirror plane between the two central "
                "carbons maps the molecule onto itself. Tartaric acid has "
                "three stereoisomers, not four."
            ),
            routes_to="ORG1.ENANTIODIA",
            source="Instructor observation; not traced to a published study",
            review="pending",
        ),
        "STEREO-AS-CONSTITUTIONAL": Misconception(
            code="STEREO-AS-CONSTITUTIONAL",
            name="Any two different structures are constitutional isomers",
            description=(
                "The learner treats constitutional isomerism as the catch all "
                "for structures that are not identical, without checking "
                "whether the connectivity is actually different."
            ),
            counterexample=(
                "Two enantiomers have exactly the same connectivity. What "
                "differs is the arrangement in space, which makes them "
                "stereoisomers; nothing about which atom bonds to which has "
                "changed."
            ),
            routes_to="ORG1.ENANTIODIA",
            source="Instructor observation; not traced to a published study",
            review="pending",
        ),
    }
)


# Grader 11 (retrosynthesis) diagnoses. Added in Phase 6 with the retro module.
MISCONCEPTIONS.update(
    {
        "RETRO-FRAGMENTS-DO-NOT-JOIN": Misconception(
            code="RETRO-FRAGMENTS-DO-NOT-JOIN",
            name="The right fragments, joined the wrong way",
            description=(
                "The learner identifies precursors that carry the target's "
                "carbon skeleton but chooses a disconnection whose forward "
                "reaction does not assemble them into the target, usually "
                "because the reactive groups are on the wrong carbons."
            ),
            counterexample=(
                "Butan-2-ol can come from an organometallic adding to a "
                "carbonyl, but only if the fragments split the new carbon-carbon "
                "bond correctly; pairing the wrong halves gives fragments that "
                "never join into butan-2-ol however the reaction is run."
            ),
            routes_to="ORG2.AROMATICSYNTH",
            source="Instructor observation; not traced to a published study",
            review="pending",
        ),
        "RETRO-WRONG-PRECURSORS": Misconception(
            code="RETRO-WRONG-PRECURSORS",
            name="Precursors whose atoms do not add up",
            description=(
                "The learner proposes precursors whose combined carbon skeleton "
                "cannot make the target, so no disconnection could join them "
                "into it. The disconnection was named before the atom count was "
                "checked."
            ),
            counterexample=(
                "A five-carbon target cannot be built in one step from two "
                "two-carbon precursors; the carbons are simply missing, and no "
                "choice of reaction supplies them."
            ),
            routes_to="ORG2.AROMATICSYNTH",
            source="Instructor observation; not traced to a published study",
            review="pending",
        ),
    }
)
