"""Simulation scenarios and the predict, observe, explain items bound to them.

Chemistry facts in this file, per the coding standard, carry their source.

  Ka acetic acid   1.75e-5 at 25 C. CRC Handbook of Chemistry and Physics,
                   97th edition, table on dissociation constants of organic
                   acids.
  Kw               1.00e-14 at 25 C. CRC Handbook, 97th edition.
  K for H2 + I2    50.5 at 448 C. Classic value from the Bodenstein iodine
                   hydrogen studies as reported in Zumdahl, Chemical
                   Principles, 7th edition, chapter on equilibrium.

Nothing in this file states an outcome. Every scenario declares a starting
mixture and a stress, and the outcome is whatever the engine derives. The
outcome_rule on each item turns that derived result into the option id the
learner could have selected, so the item key can be checked against the
physics rather than against the author's intention.
"""

from __future__ import annotations

from dataclasses import dataclass, replace
from typing import Callable

from chem_core.prediction import Option, PoeItem
from chem_core.simulate import (
    STRONG_KA,
    EquilibriumSetup,
    TitrationSetup,
    equilibrium_shift,
    solve_extent,
    solve_ph,
    titration_curve,
    titration_landmarks,
)

# ---------------------------------------------------------------------------
# Titration scenarios
# ---------------------------------------------------------------------------

TITRATIONS: dict[str, TitrationSetup] = {
    "titr.strong.hcl-naoh": TitrationSetup(
        analyte_conc_M=0.100,
        analyte_volume_mL=25.00,
        titrant_conc_M=0.100,
        ka=STRONG_KA,
        analyte_name="HCl",
        titrant_name="NaOH",
        ka_source="Hydrochloric acid is a strong acid, taken as fully dissociated.",
    ),
    "titr.weak.acetic-naoh": TitrationSetup(
        analyte_conc_M=0.100,
        analyte_volume_mL=25.00,
        titrant_conc_M=0.100,
        ka=1.75e-5,
        analyte_name="CH3COOH",
        titrant_name="NaOH",
        ka_source="Ka 1.75e-5 at 25 C, CRC Handbook 97th ed.",
    ),
}


# ---------------------------------------------------------------------------
# Equilibrium scenarios
# ---------------------------------------------------------------------------

_RAW_EQUILIBRIA: dict[str, EquilibriumSetup] = {
    "eq.hi.448c": EquilibriumSetup(
        stoich={"H2": -1, "I2": -1, "HI": 2},
        # A starting mixture, not an equilibrium mixture. equilibrated() below
        # solves for the real equilibrium composition so no hand typed number
        # can silently be wrong.
        initial={"H2": 0.100, "I2": 0.100, "HI": 0.0},
        k=50.5,
        label="H2 + I2 <=> 2 HI at 448 C",
        k_source="K 50.5 at 448 C, Zumdahl Chemical Principles 7th ed.",
        delta_h_kj=-9.5,
        moles_gas_change=0,
    ),
}


def equilibrated(setup: EquilibriumSetup) -> EquilibriumSetup:
    """Return the same system with its concentrations solved to equilibrium.

    The scenario author supplies a starting mixture. This runs the extent of
    reaction solve once so that every stress applied afterwards is measured
    from a genuine equilibrium rather than from a number someone typed.
    """
    x = solve_extent(setup, setup.initial)
    settled = {
        s: setup.initial.get(s, 0.0) + c * x for s, c in setup.stoich.items()
    }
    return replace(setup, initial=settled)


EQUILIBRIA: dict[str, EquilibriumSetup] = {
    key: equilibrated(setup) for key, setup in _RAW_EQUILIBRIA.items()
}


# ---------------------------------------------------------------------------
# Running a scenario
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class Scenario:
    """What a POE item points at, and how its result is summarized.

    stress is the perturbation applied when the simulation runs. For a
    titration it is ignored; the curve is the result. For an equilibrium it
    maps species to the amount added in molar, and an empty stress means the
    system is left alone, which is the honest way to model adding a catalyst.
    """

    id: str
    kind: str
    engine_key: str
    title: str
    description: str
    stress: dict[str, float]
    node: str


SCENARIOS: dict[str, Scenario] = {
    s.id: s
    for s in [
        Scenario(
            id="sim.titr.weak",
            kind="titration",
            engine_key="titr.weak.acetic-naoh",
            title="Acetic acid titrated with sodium hydroxide",
            description=(
                "25.00 mL of 0.100 M acetic acid in the flask, 0.100 M sodium "
                "hydroxide from the burette."
            ),
            stress={},
            node="C.G2.TITRATIONCURVE",
        ),
        Scenario(
            id="sim.titr.strong",
            kind="titration",
            engine_key="titr.strong.hcl-naoh",
            title="Hydrochloric acid titrated with sodium hydroxide",
            description=(
                "25.00 mL of 0.100 M hydrochloric acid in the flask, 0.100 M "
                "sodium hydroxide from the burette."
            ),
            stress={},
            node="C.G2.TITRATIONCURVE",
        ),
        Scenario(
            id="sim.eq.add-h2",
            kind="equilibrium",
            engine_key="eq.hi.448c",
            title="Adding hydrogen to an equilibrium mixture",
            description=(
                "The hydrogen iodide system has settled at equilibrium at 448 "
                "degrees Celsius. A further 0.050 M of hydrogen is injected."
            ),
            stress={"H2": 0.050},
            node="C.G2.LECHATELIER",
        ),
        Scenario(
            id="sim.eq.catalyst",
            kind="equilibrium",
            engine_key="eq.hi.448c",
            title="Adding a catalyst to an equilibrium mixture",
            description=(
                "The same system at equilibrium. A catalyst is introduced. A "
                "catalyst changes no concentration, so the stress applied here "
                "is empty, which is exactly what a catalyst is."
            ),
            stress={},
            node="C.G2.LECHATELIER",
        ),
    ]
}


def run_scenario(scenario_id: str) -> dict:
    """Run one scenario and return its full result, including the raw data.

    This is the observe step's payload. It is only ever handed out after a
    prediction has been recorded.
    """
    scenario = SCENARIOS.get(scenario_id)
    if scenario is None:
        raise KeyError(f"unknown scenario {scenario_id}")

    if scenario.kind == "titration":
        setup = TITRATIONS[scenario.engine_key]
        curve = titration_curve(setup, 121)
        landmarks = titration_landmarks(setup)
        return {
            "scenario": scenario.id,
            "kind": "titration",
            "title": scenario.title,
            "description": scenario.description,
            "curve": curve,
            "landmarks": landmarks,
            "analyte": setup.analyte_name,
            "titrant": setup.titrant_name,
            "is_strong_acid": setup.is_strong_acid,
            "pka": None if setup.is_strong_acid else round(setup.pka, 3),
            "source": setup.ka_source,
            "x_label": "Volume of titrant added (mL)",
            "y_label": "pH",
        }

    setup = EQUILIBRIA[scenario.engine_key]
    result = equilibrium_shift(setup, scenario.stress)
    return {
        "scenario": scenario.id,
        "kind": "equilibrium",
        "title": scenario.title,
        "description": scenario.description,
        "label": setup.label,
        "k": setup.k,
        "source": setup.k_source,
        "stress": scenario.stress,
        "direction": result["direction"],
        "extent": result["extent"],
        "q_before": result["q_before"],
        "q_after": result["q_after"],
        "before": setup.initial,
        "stressed": result["stressed"],
        "after": result["final"],
    }


# ---------------------------------------------------------------------------
# Predict, observe, explain items
# ---------------------------------------------------------------------------

# Each rule turns a simulation result into the option id a learner could have
# picked. This is what lets the item key be verified against the physics.
OUTCOME_RULES: dict[str, Callable[[dict], str]] = {}


def _rule(item_id: str):
    def decorate(fn: Callable[[dict], str]):
        OUTCOME_RULES[item_id] = fn
        return fn

    return decorate


@_rule("poe.titr.weak-equivalence")
def _weak_equivalence(result: dict) -> str:
    ph = result["landmarks"]["equivalence_pH"]
    if ph > 7.05:
        return "above7"
    if ph < 6.95:
        return "below7"
    return "equals7"


@_rule("poe.titr.buffer-region")
def _buffer_region(result: dict) -> str:
    setup = TITRATIONS["titr.weak.acetic-naoh"]
    change = solve_ph(setup, 20.0) - solve_ph(setup, 5.0)
    if change < 0:
        return "falls"
    return "small" if change < 1.5 else "large"


@_rule("poe.lechat.add-h2")
def _add_h2(result: dict) -> str:
    return {"forward": "forward", "reverse": "reverse", "none": "noshift"}[
        result["direction"]
    ]


@_rule("poe.lechat.catalyst")
def _catalyst(result: dict) -> str:
    # A catalyst applies no stress, so the solved extent is zero and the amount
    # of product at equilibrium is unchanged. The engine derives this; the item
    # does not assert it.
    return "unchanged" if result["direction"] == "none" else (
        "more" if result["direction"] == "forward" else "less"
    )


POE_ITEMS: dict[str, PoeItem] = {
    item.id: item
    for item in [
        PoeItem(
            id="poe.titr.weak-equivalence",
            node="C.G2.TITRATIONCURVE",
            scenario="sim.titr.weak",
            predict_prompt=(
                "Before the titration runs, commit to a prediction. At the "
                "equivalence point, where exactly enough sodium hydroxide has "
                "been added to react with all the acetic acid, what will the "
                "pH be?"
            ),
            predict_options=[
                Option(
                    id="below7",
                    text="Below 7, because the flask started with an acid",
                    misconception="EQUIV-IS-NEUTRAL",
                    feedback=(
                        "The flask did start acidic, but the question is what is "
                        "left at equivalence, not what was there at the start."
                    ),
                ),
                Option(
                    id="equals7",
                    text="Exactly 7, because the acid and base have exactly cancelled",
                    misconception="EQUIV-IS-NEUTRAL",
                    feedback=(
                        "Equivalence is a statement about amounts, not about pH. "
                        "The two are the same only when what remains is inert."
                    ),
                ),
                Option(
                    id="above7",
                    text="Above 7, because of what the neutralization leaves behind",
                    feedback=(
                        "Correct. The acetate ion left behind is a weak base."
                    ),
                ),
            ],
            predict_key="above7",
            observe_prompt=(
                "Read the equivalence point off the curve and record the pH you "
                "see there."
            ),
            explain_prompt=(
                "You have seen the curve. Which account explains the pH at "
                "equivalence?"
            ),
            explain_options=[
                Option(
                    id="acetate-base",
                    text=(
                        "Every acetic acid molecule has become acetate, and acetate "
                        "takes a proton from water, releasing hydroxide"
                    ),
                    feedback=(
                        "Correct. The conjugate base of a weak acid is itself a "
                        "weak base, so the solution at equivalence is basic."
                    ),
                ),
                Option(
                    id="excess-base",
                    text="Extra sodium hydroxide has been added beyond what was needed",
                    misconception="EQUIV-IS-NEUTRAL",
                    feedback=(
                        "No extra base is present. Equivalence is defined as the "
                        "point where the amounts match exactly."
                    ),
                ),
                Option(
                    id="sodium-basic",
                    text="Sodium ions from the base make the solution basic",
                    misconception="SPECTATOR-ACTIVE",
                    feedback=(
                        "Sodium is a spectator. It does not accept or donate "
                        "protons, so it cannot move the pH."
                    ),
                ),
                Option(
                    id="indicator",
                    text="The indicator shifted the pH as it changed colour",
                    misconception="INDICATOR-SETS-EQUIV",
                    feedback=(
                        "An indicator reports pH, it does not set it. The amount "
                        "present is far too small to matter."
                    ),
                ),
            ],
            explain_key="acetate-base",
            reflection_prompt=(
                "In your own words, what would have to be true of the acid for "
                "the equivalence point to land at pH 7?"
            ),
        ),
        PoeItem(
            id="poe.titr.buffer-region",
            node="C.G2.BUFFER",
            scenario="sim.titr.weak",
            predict_prompt=(
                "Between 5 mL and 20 mL of added base, three quarters of the way "
                "through the first half of the titration, how much does the pH "
                "change over that 15 mL?"
            ),
            predict_options=[
                Option(
                    id="large",
                    text="Three units or more, since a lot of base is going in",
                    misconception="STRONG-IS-CONCENTRATED",
                    feedback=(
                        "The amount of base added is not what sets the pH change. "
                        "What is in the flask to absorb it is."
                    ),
                ),
                Option(
                    id="small",
                    text="Less than about one and a half units",
                    feedback="Correct. This region resists pH change.",
                ),
                Option(
                    id="falls",
                    text="The pH falls, because more solution means more dilution",
                    misconception="STRONG-IS-CONCENTRATED",
                    feedback=(
                        "Adding base cannot lower the pH. Dilution moves pH toward "
                        "7, it does not reverse the direction of a titration."
                    ),
                ),
            ],
            predict_key="small",
            observe_prompt=(
                "Read the pH at 5 mL and at 20 mL off the curve and record both."
            ),
            explain_prompt="Why does the pH move so little across this stretch?",
            explain_options=[
                Option(
                    id="buffer-pair",
                    text=(
                        "Both acetic acid and acetate are present in comparable "
                        "amounts, so added hydroxide is consumed by the acid rather "
                        "than accumulating"
                    ),
                    feedback=(
                        "Correct. This is the buffer region, and it is centred on "
                        "the half equivalence point where pH equals pKa."
                    ),
                ),
                Option(
                    id="weak-nothing",
                    text="A weak acid barely reacts, so little happens either way",
                    misconception="STRONG-IS-CONCENTRATED",
                    feedback=(
                        "The acid reacts completely with the added hydroxide. Weak "
                        "describes how far it dissociates on its own, not whether "
                        "it reacts with a strong base."
                    ),
                ),
                Option(
                    id="dilution",
                    text="The added volume dilutes everything, which flattens the curve",
                    misconception="SPECTATOR-ACTIVE",
                    feedback=(
                        "Dilution alone would flatten the strong acid curve too, and "
                        "it does not. Compare the two curves in this region."
                    ),
                ),
            ],
            explain_key="buffer-pair",
        ),
        PoeItem(
            id="poe.lechat.add-h2",
            node="C.G2.LECHATELIER",
            scenario="sim.eq.add-h2",
            predict_prompt=(
                "The hydrogen iodide system sits at equilibrium. More hydrogen is "
                "injected. Predict what happens to the position of equilibrium."
            ),
            predict_options=[
                Option(
                    id="forward",
                    text="It moves toward products, making more hydrogen iodide",
                    feedback="Correct.",
                ),
                Option(
                    id="reverse",
                    text="It moves toward reactants, since there is now more reactant",
                    misconception="LECHAT-AMOUNT",
                    feedback=(
                        "The system relieves the stress rather than amplifying it. "
                        "Adding a reactant drives it away, not further in."
                    ),
                ),
                Option(
                    id="noshift",
                    text="Nothing shifts, but K rises to accommodate the extra hydrogen",
                    misconception="LECHAT-AMOUNT",
                    feedback=(
                        "K depends only on temperature. Adding a species changes "
                        "where the system sits, not the constant it sits at."
                    ),
                ),
            ],
            predict_key="forward",
            observe_prompt=(
                "Record the reaction quotient immediately after the injection and "
                "the value it returns to."
            ),
            explain_prompt="Which account explains what you observed?",
            explain_options=[
                Option(
                    id="q-below-k",
                    text=(
                        "The injection dropped Q below K, and the reaction ran "
                        "forward until Q climbed back to K"
                    ),
                    feedback=(
                        "Correct. Q against K is the quantitative statement behind "
                        "Le Chatelier's qualitative rule."
                    ),
                ),
                Option(
                    id="k-changed",
                    text="K increased because there is now more material in the vessel",
                    misconception="LECHAT-AMOUNT",
                    feedback=(
                        "Check the values you recorded. Q returned to the same K it "
                        "started at."
                    ),
                ),
                Option(
                    id="collisions",
                    text=(
                        "More hydrogen means more collisions, which speeds the "
                        "forward reaction permanently"
                    ),
                    misconception="CATALYST-SHIFTS",
                    feedback=(
                        "Rates do rise, but they rise until forward and reverse "
                        "match again. A permanently faster forward reaction would "
                        "consume the vessel."
                    ),
                ),
            ],
            explain_key="q-below-k",
        ),
        PoeItem(
            id="poe.lechat.catalyst",
            node="C.G2.LECHATELIER",
            scenario="sim.eq.catalyst",
            predict_prompt=(
                "The same system at equilibrium. A catalyst is added. Predict what "
                "happens to the amount of hydrogen iodide present once the system "
                "has settled again."
            ),
            predict_options=[
                Option(
                    id="more",
                    text="More hydrogen iodide, since the catalyst speeds the reaction up",
                    misconception="CATALYST-SHIFTS",
                    feedback=(
                        "The catalyst does speed things up. Consider whether it "
                        "speeds up only one direction."
                    ),
                ),
                Option(
                    id="less",
                    text="Less hydrogen iodide, since the reverse reaction is favoured",
                    misconception="CATALYST-SHIFTS",
                    feedback=(
                        "A catalyst has no preferred direction, so it cannot favour "
                        "the reverse reaction either."
                    ),
                ),
                Option(
                    id="unchanged",
                    text="The same amount, reached sooner",
                    feedback=(
                        "Correct. A catalyst changes the rate of arrival, not the "
                        "destination."
                    ),
                ),
            ],
            predict_key="unchanged",
            observe_prompt=(
                "Record the composition before and after. Note the stress the "
                "simulation applied."
            ),
            explain_prompt="Which account explains the result?",
            explain_options=[
                Option(
                    id="both-directions",
                    text=(
                        "The catalyst lowers the activation barrier by the same "
                        "amount in both directions, so forward and reverse rates "
                        "rise together and balance at the same composition"
                    ),
                    feedback=(
                        "Correct. This is why a catalyst appears nowhere in the "
                        "equilibrium expression."
                    ),
                ),
                Option(
                    id="used-up",
                    text="The catalyst was consumed before it could shift anything",
                    misconception="CATALYST-SHIFTS",
                    feedback=(
                        "A catalyst is regenerated. If it were consumed it would be "
                        "a reactant, and it would appear in the equation."
                    ),
                ),
                Option(
                    id="too-little",
                    text="Too little catalyst was added to move the position measurably",
                    misconception="CATALYST-SHIFTS",
                    feedback=(
                        "Adding more would speed things further and still land in "
                        "the same place. The amount is not what is doing the work."
                    ),
                ),
            ],
            explain_key="both-directions",
        ),
    ]
}


def items_for_node(node: str) -> list[PoeItem]:
    return [i for i in POE_ITEMS.values() if i.node == node]
