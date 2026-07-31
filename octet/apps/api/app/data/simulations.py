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
    GasSetup,
    KineticsSetup,
    compare_gases,
    gas_response,
    kinetics_response,
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
            node="GEN2.TITRATIONWEAK",
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
            node="GEN2.TITRATIONSTRONG",
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
            node="GEN2.LECHATELIER",
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
            node="GEN2.LECHATELIER",
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

    if scenario.kind == "kinetics":
        setup = KINETICS[scenario.engine_key]
        result = kinetics_response(setup, scenario.stress)
        return {
            "scenario": scenario.id,
            "kind": "kinetics",
            "title": scenario.title,
            "description": scenario.description,
            "source": setup.source,
            **result,
        }

    if scenario.kind == "gas":
        setup = GASES[scenario.engine_key]
        result = gas_response(setup, scenario.stress)
        return {
            "scenario": scenario.id,
            "kind": "gas",
            "title": scenario.title,
            "description": scenario.description,
            "source": setup.source,
            **result,
        }

    if scenario.kind == "gas-comparison":
        result = compare_gases(GASES["gas.helium.stp"], GASES["gas.xenon.stp"])
        return {
            "scenario": scenario.id,
            "kind": "gas-comparison",
            "title": scenario.title,
            "description": scenario.description,
            "source": GASES["gas.helium.stp"].source,
            **result,
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
            node="GEN2.TITRATIONWEAK",
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
            node="GEN2.BUFFER",
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
            node="GEN2.LECHATELIER",
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
            node="GEN2.LECHATELIER",
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


# ---------------------------------------------------------------------------
# Kinetics and gas scenarios
# ---------------------------------------------------------------------------

KINETICS: dict[str, KineticsSetup] = {
    "kin.first-order.n2o5": KineticsSetup(
        name="N2O5 decomposition",
        order=1,
        k=1.0e-3,
        initial=0.100,
        temperature_K=298.15,
        activation_kJ=103.0,
        source=(
            "Activation energy 103 kJ/mol for the gas phase decomposition of "
            "dinitrogen pentoxide. Atkins, Physical Chemistry, 11th edition, "
            "table of Arrhenius parameters."
        ),
    ),
    "kin.second-order.no2": KineticsSetup(
        name="NO2 dimerisation",
        order=2,
        k=0.540,
        initial=0.100,
        temperature_K=298.15,
        source=(
            "Second order in NO2. Rate constant chosen for legibility rather "
            "than taken from a measurement; the teaching point is the exponent, "
            "and the panel says so."
        ),
    ),
}

GASES: dict[str, GasSetup] = {
    "gas.helium.stp": GasSetup(
        name="Helium",
        moles=1.0,
        volume_L=24.79,
        temperature_K=298.15,
        molar_mass_g=4.003,
        source="Molar masses from the CRC Handbook, 97th edition.",
    ),
    "gas.xenon.stp": GasSetup(
        name="Xenon",
        moles=1.0,
        volume_L=24.79,
        temperature_K=298.15,
        molar_mass_g=131.29,
        source="Molar masses from the CRC Handbook, 97th edition.",
    ),
    "gas.co2.compressed": GasSetup(
        name="Carbon dioxide, compressed",
        moles=1.0,
        volume_L=0.500,
        temperature_K=298.15,
        molar_mass_g=44.01,
        a=3.640,
        b=0.04267,
        source=(
            "van der Waals constants a = 3.640 L^2 bar/mol^2 and b = 0.04267 "
            "L/mol. CRC Handbook, 97th edition."
        ),
    ),
}

SCENARIOS.update(
    {
        s.id: s
        for s in [
            Scenario(
                id="sim.kin.double-concentration",
                kind="kinetics",
                engine_key="kin.second-order.no2",
                title="Doubling the concentration of a second order reactant",
                description=(
                    "Nitrogen dioxide dimerises with a rate law that is second "
                    "order in NO2. The concentration is doubled from 0.100 M to "
                    "0.200 M with the temperature held constant."
                ),
                stress={"concentration_factor": 2.0},
                node="GEN2.RATELAW",
            ),
            Scenario(
                id="sim.kin.catalyst",
                kind="kinetics",
                engine_key="kin.first-order.n2o5",
                title="Lowering the activation energy with a catalyst",
                description=(
                    "Dinitrogen pentoxide decomposes over a barrier of 103 "
                    "kJ/mol. A catalyst offers a route with the barrier lowered "
                    "by 20 kJ/mol, at the same temperature and concentration."
                ),
                stress={"activation_delta_kJ": -20.0},
                node="GEN2.CATALYSIS",
            ),
            Scenario(
                id="sim.gas.halve-volume",
                kind="gas",
                engine_key="gas.helium.stp",
                title="Halving the volume of a gas at constant temperature",
                description=(
                    "One mole of helium occupies 24.79 L at 298.15 K. The "
                    "container is compressed to half that volume with the "
                    "temperature held constant."
                ),
                stress={"volume_factor": 0.5},
                node="GEN1.SIMPLEGASLAWS",
            ),
            Scenario(
                id="sim.gas.kmt-compare",
                kind="gas-comparison",
                engine_key="gas.helium.stp",
                title="Helium and xenon at the same temperature",
                description=(
                    "One mole of helium and one mole of xenon, both at 298.15 K "
                    "in identical containers. Helium is 4.003 g/mol and xenon "
                    "131.29 g/mol."
                ),
                stress={},
                node="GEN1.KMT",
            ),
        ]
    }
)


# The outcome rules for the new scenarios, registered through the same
# decorator the original four use. Each reads the engine's derived result; none
# states an outcome.
@_rule("poe.kin.order-two")
def _order_two(result: dict) -> str:
    return result["outcome"]


@_rule("poe.kin.catalyst")
def _catalyst_rate(result: dict) -> str:
    return result["outcome"]


@_rule("poe.gas.boyle")
def _boyle(result: dict) -> str:
    return result["outcome"]


@_rule("poe.gas.kmt-energy")
def _kmt_energy(result: dict) -> str:
    # compare_gases reports which sample carries more average kinetic energy.
    # 'same' is the derived answer when the temperatures match, and it is
    # derived rather than assumed: the two energies are computed and compared.
    return result["energy"]


POE_ITEMS.update(
    {
        item.id: item
        for item in [
            PoeItem(
                id="poe.kin.order-two",
                node="GEN2.RATELAW",
                scenario="sim.kin.double-concentration",
                predict_prompt=(
                    "The rate law is rate = k[NO2]^2. Commit before anything "
                    "runs. If the concentration of NO2 is doubled and nothing "
                    "else changes, what happens to the rate?"
                ),
                predict_options=[
                    Option(
                        id="unchanged",
                        text="It does not change, because k is a constant",
                        misconception="RATE-IS-K",
                        feedback=(
                            "k is constant and rate is not k. The rate is k "
                            "times a concentration term, and that term moved."
                        ),
                    ),
                    Option(
                        id="doubles",
                        text="It doubles, because the concentration doubled",
                        misconception="ORDER-READ-AS-ONE",
                        feedback=(
                            "That is what first order would give. The exponent "
                            "here is 2, and the exponent decides."
                        ),
                    ),
                    Option(
                        id="quadruples",
                        text="It quadruples, because the concentration is squared",
                        feedback=(
                            "Correct. Doubling a squared term multiplies it by "
                            "four."
                        ),
                    ),
                ],
                predict_key="quadruples",
                observe_prompt="Read the two rates and the ratio between them.",
                explain_prompt="You have seen the ratio. Which account explains it?",
                explain_options=[
                    Option(
                        id="exponent",
                        text=(
                            "The rate depends on concentration raised to the "
                            "order, so a factor of 2 becomes 2 squared"
                        ),
                        feedback="Correct.",
                    ),
                    Option(
                        id="coefficient",
                        text="The balanced equation has a 2 in front of NO2",
                        misconception="ORDER-FROM-COEFFICIENT",
                        feedback=(
                            "The coefficient and the order are different "
                            "quantities. Order is measured, not read off the "
                            "equation."
                        ),
                    ),
                    Option(
                        id="k-changed",
                        text="The rate constant doubled when the concentration doubled",
                        misconception="RATE-IS-K",
                        feedback=(
                            "k did not move. Compare the two values on the "
                            "panel: only the concentration term changed."
                        ),
                    ),
                ],
                explain_key="exponent",
            ),
            PoeItem(
                id="poe.kin.catalyst",
                node="GEN2.CATALYSIS",
                scenario="sim.kin.catalyst",
                predict_prompt=(
                    "A catalyst offers a route with an activation energy 20 "
                    "kJ/mol lower, at the same temperature and the same "
                    "concentration. Commit first: what happens to the rate?"
                ),
                predict_options=[
                    Option(
                        id="unchanged",
                        text="Nothing, because a catalyst is not consumed",
                        misconception="CATALYST-DOES-NOTHING",
                        feedback=(
                            "Not being consumed is true, and is a different "
                            "statement from having no effect."
                        ),
                    ),
                    Option(
                        id="decreases",
                        text="It falls, because the catalyst gets in the way",
                        misconception="CATALYST-BLOCKS",
                        feedback="A catalyst opens a route rather than blocking one.",
                    ),
                    Option(
                        id="increases",
                        text="It rises sharply, because the barrier is lower",
                        feedback=(
                            "Correct, and by far more than 20 kJ/mol might "
                            "suggest: the barrier sits in an exponent."
                        ),
                    ),
                ],
                predict_key="increases",
                observe_prompt=(
                    "Read the factor by which the rate changed, and note how "
                    "large it is for a 20 kJ/mol change."
                ),
                explain_prompt="Which account explains the size of that factor?",
                explain_options=[
                    Option(
                        id="exponential",
                        text=(
                            "The barrier sits in an exponent, so lowering it "
                            "multiplies the rate rather than adding to it"
                        ),
                        feedback="Correct.",
                    ),
                    Option(
                        id="equilibrium-moved",
                        text="The catalyst shifted the equilibrium toward products",
                        misconception="CATALYST-SHIFTS-EQUILIBRIUM",
                        feedback=(
                            "A catalyst speeds both directions equally and "
                            "moves no equilibrium. The other bench scenario "
                            "shows exactly that."
                        ),
                    ),
                    Option(
                        id="more-collisions",
                        text="The catalyst made the molecules collide more often",
                        misconception="CATALYST-ADDS-COLLISIONS",
                        feedback=(
                            "Collision frequency is set by concentration and "
                            "temperature, neither of which changed. What "
                            "changed is which collisions succeed."
                        ),
                    ),
                ],
                explain_key="exponential",
            ),
            PoeItem(
                id="poe.gas.boyle",
                node="GEN1.SIMPLEGASLAWS",
                scenario="sim.gas.halve-volume",
                predict_prompt=(
                    "The volume is halved with the temperature held constant. "
                    "Commit before the gauge is revealed: what does the "
                    "pressure do?"
                ),
                predict_options=[
                    Option(
                        id="halves",
                        text="It halves, following the volume down",
                        misconception="PRESSURE-TRACKS-VOLUME",
                        feedback=(
                            "Pressure and volume move in opposite directions at "
                            "constant temperature, not together."
                        ),
                    ),
                    Option(
                        id="unchanged",
                        text="It stays the same, because no gas was added or removed",
                        misconception="PRESSURE-NEEDS-MOLES",
                        feedback=(
                            "The amount of gas is one of several things "
                            "pressure depends on. The same molecules in half "
                            "the room reach the walls twice as often."
                        ),
                    ),
                    Option(
                        id="doubles",
                        text="It doubles, because the same molecules have half the room",
                        feedback="Correct. This is Boyle's law.",
                    ),
                ],
                predict_key="doubles",
                observe_prompt="Read the two pressures and the ratio between them.",
                explain_prompt=(
                    "Which account explains it at the level of the particles?"
                ),
                explain_options=[
                    Option(
                        id="wall-collisions",
                        text=(
                            "Each molecule reaches a wall twice as often in "
                            "half the volume, so the force per unit area "
                            "doubles"
                        ),
                        feedback="Correct.",
                    ),
                    Option(
                        id="molecules-shrink",
                        text="The molecules were compressed and became smaller",
                        misconception="MOLECULES-COMPRESS",
                        feedback=(
                            "The molecules do not change size. The space "
                            "between them does, and in a gas that space is "
                            "nearly all of the volume."
                        ),
                    ),
                    Option(
                        id="faster",
                        text="Compressing the gas made the molecules move faster",
                        misconception="COMPRESSION-HEATS",
                        feedback=(
                            "Speed is set by temperature, which was held "
                            "constant. The root mean square speed on the panel "
                            "did not move."
                        ),
                    ),
                ],
                explain_key="wall-collisions",
            ),
            PoeItem(
                id="poe.gas.kmt-energy",
                node="GEN1.KMT",
                scenario="sim.gas.kmt-compare",
                predict_prompt=(
                    "Helium and xenon sit at the same temperature, and xenon is "
                    "about thirty times heavier per mole. Commit before "
                    "looking: which has the higher average kinetic energy per "
                    "molecule?"
                ),
                predict_options=[
                    Option(
                        id="a",
                        text="Helium, because its molecules move much faster",
                        misconception="SPEED-IS-ENERGY",
                        feedback=(
                            "Helium is faster, and speed alone does not settle "
                            "energy: kinetic energy carries mass as well."
                        ),
                    ),
                    Option(
                        id="b",
                        text="Xenon, because its molecules are much heavier",
                        misconception="MASS-IS-ENERGY",
                        feedback=(
                            "Xenon is heavier and correspondingly slower. The "
                            "two effects cancel exactly."
                        ),
                    ),
                    Option(
                        id="same",
                        text="Neither, they are equal because the temperature is equal",
                        feedback=(
                            "Correct. Average translational kinetic energy is "
                            "three halves RT and depends on nothing else."
                        ),
                    ),
                ],
                predict_key="same",
                observe_prompt=(
                    "Read both energies and both speeds. One pair is equal and "
                    "the other is not."
                ),
                explain_prompt="Which account explains why the energies match?",
                explain_options=[
                    Option(
                        id="temperature-is-energy",
                        text=(
                            "Temperature is the average translational kinetic "
                            "energy, so equal temperature means equal energy "
                            "and the lighter gas makes it up in speed"
                        ),
                        feedback="Correct.",
                    ),
                    Option(
                        id="same-container",
                        text="They are in identical containers, so everything matches",
                        misconception="CONTAINER-DECIDES",
                        feedback=(
                            "The containers match and the speeds do not. Read "
                            "the two root mean square values again."
                        ),
                    ),
                    Option(
                        id="ideal-gas",
                        text="Both are ideal, and ideal gases are identical in every respect",
                        misconception="IDEAL-MEANS-IDENTICAL",
                        feedback=(
                            "Ideal means no attraction and negligible molecular "
                            "volume. It says nothing about mass, which is why "
                            "they effuse at different rates."
                        ),
                    ),
                ],
                explain_key="temperature-is-energy",
            ),
        ]
    }
)
