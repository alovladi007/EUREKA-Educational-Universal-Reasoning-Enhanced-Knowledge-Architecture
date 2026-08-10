"""Mechanism templates (grader 8) and lab-data templates (grader 9).

Mechanism items sit on ORG1.HXADDITION: electrophilic addition of HX and
Markovnikov, plus the acid-catalyzed hydration that shares its carbocation
logic. The fixtures list only alkenes whose regiochemical outcome is
unambiguous under the simplified step models, and each fixture records the
wrong-regiochemistry product so a coherent path to it is diagnosed rather
than just marked wrong. All fixtures were confirmed against RDKit before
listing, and the per-variant verifier re-confirms the served item's own key
path end to end (see mechanism.verify_mechanism_item for the two independent
checks it applies).

Lab-data items sit on GEN2.INTEGRATED (kinetics runs) and GEN2.TITRATIONWEAK
(titration curves). The dataset is exact simulation output rounded to
instrument-realistic figures, with the rounding stated in the prompt. The
verifier recovers the key FROM THE SERVED DATA by an independent route
(regression, interpolation) and refuses any seed whose data does not
determine its own answer; see labdata.py for why that check is the point.
"""

from __future__ import annotations

import math

from .labdata import verify_kinetics_item, verify_titration_item
from .mechanism import STEP_LIBRARY, MechanismItem, verify_mechanism_item
from .registry import Variant, _pick
from .simulate import KineticsSetup, TitrationSetup, concentration_at, titration_curve
from .types import VerifierResult

# ---------------------------------------------------------------------------
# Mechanism fixtures. (name, alkene, markovnikov cation, HBr product,
# anti-Markovnikov product). Regiochemistry confirmed with RDKit before
# listing; the verifier re-confirms per variant.
# ---------------------------------------------------------------------------

_HBR_FIXTURES = [
    ("propene", "CC=C", "C[CH+]C", "CC(Br)C", "CCCBr"),
    ("2-methylpropene", "CC(C)=C", "C[C+](C)C", "CC(C)(C)Br", "CC(C)CBr"),
    ("2-methyl-2-butene", "CC(C)=CC", "CC[C+](C)C", "CCC(C)(C)Br", "CC(C)C(C)Br"),
    ("1-methylcyclohexene", "CC1=CCCCC1", "C[C+]1CCCCC1", "CC1(Br)CCCCC1", "CC1C(Br)CCCC1"),
]

# (name, alkene, markovnikov cation, oxocarbenium, alcohol, anti alcohol)
_HYDRATION_FIXTURES = [
    ("propene", "CC=C", "C[CH+]C", "CC([OH2+])C", "CC(O)C", "CCCO"),
    ("2-methylpropene", "CC(C)=C", "C[C+](C)C", "CC(C)(C)[OH2+]", "CC(C)(C)O", "CC(C)CO"),
    ("2-methyl-2-butene", "CC(C)=CC", "CC[C+](C)C", "CCC(C)(C)[OH2+]", "CCC(C)(C)O", "CC(C)C(C)O"),
]

_MECH_MENU_HBR = ("protonate_alkene", "halide_attack", "hydride_shift", "water_attack")
_MECH_MENU_HYD = (
    "protonate_alkene",
    "water_attack",
    "deprotonate_oxocarbenium",
    "halide_attack",
)


def _steps_meta(names: tuple[str, ...]) -> list[dict]:
    """The step menu as it travels in meta: full data, because grading in the
    sandbox rebuilds the steps from it. The serve whitelist strips the SMARTS
    before anything reaches a learner."""
    out = []
    for n in names:
        s = STEP_LIBRARY[n]
        out.append(
            {
                "name": s.name,
                "forward_smarts": s.forward_smarts,
                "moves": s.moves,
                "abstracts": s.abstracts,
                "extra_reactants": list(s.extra_reactants),
                "alt_smarts": list(s.alt_smarts),
            }
        )
    return out


def _gen_mech_hbr(seed: int) -> Variant:
    name, alkene, cation, product, anti = _pick(_HBR_FIXTURES, seed)
    return Variant(
        template_id="org.mech.hbr_markovnikov.v1",
        seed=seed,
        prompt=(
            f"Push the mechanism for the addition of HBr to {name} "
            f"(SMILES {alkene}), through the more stable carbocation. At each "
            "step choose the elementary step that fires and give the species "
            "it produces as SMILES. Your path is graded by running each "
            "step's chemistry forward: every step must actually fire, and the "
            "path must end at the major product."
        ),
        key=product,
        node="ORG1.HXADDITION",
        grader="mechanism",
        meta={
            "node": "ORG1.HXADDITION",
            "name": f"HBr + {name}",
            "start": alkene,
            "steps": _steps_meta(_MECH_MENU_HBR),
            "key_path": [
                ["protonate_alkene", cation],
                ["halide_attack", product],
            ],
            "product": product,
            "wrong_products": [[anti, "MARKOVNIKOV-INVERTED"]],
        },
    )


def _gen_mech_hydration(seed: int) -> Variant:
    name, alkene, cation, oxocarbenium, product, anti = _pick(_HYDRATION_FIXTURES, seed)
    return Variant(
        template_id="org.mech.acid_hydration.v1",
        seed=seed,
        prompt=(
            f"Push the mechanism for the acid-catalyzed hydration of {name} "
            f"(SMILES {alkene}), through the more stable carbocation. At each "
            "step choose the elementary step that fires and give the species "
            "it produces as SMILES. The path ends at the neutral alcohol."
        ),
        key=product,
        node="ORG1.HXADDITION",
        grader="mechanism",
        meta={
            "node": "ORG1.HXADDITION",
            "name": f"acid-catalyzed hydration of {name}",
            "start": alkene,
            "steps": _steps_meta(_MECH_MENU_HYD),
            "key_path": [
                ["protonate_alkene", cation],
                ["water_attack", oxocarbenium],
                ["deprotonate_oxocarbenium", product],
            ],
            "product": product,
            "wrong_products": [[anti, "MARKOVNIKOV-INVERTED"]],
        },
    )


def build_mechanism_item(meta: dict, key: str) -> MechanismItem:
    """Rebuild the item from meta, shared by grading dispatch and verifier."""
    from .mechanism import ElementaryStep

    steps = tuple(
        ElementaryStep(
            name=s["name"],
            forward_smarts=s["forward_smarts"],
            moves=s.get("moves", ""),
            abstracts=s.get("abstracts", ""),
            extra_reactants=tuple(s.get("extra_reactants", [])),
            alt_smarts=tuple(s.get("alt_smarts", [])),
        )
        for s in meta.get("steps", [])
    )
    return MechanismItem(
        node=str(meta.get("node", "")),
        start=str(meta.get("start", "")),
        steps_menu=steps,
        key_path=tuple((p[0], p[1]) for p in meta.get("key_path", [])),
        product=str(meta.get("product", key)),
        wrong_products=tuple((w[0], w[1]) for w in meta.get("wrong_products", [])),
    )


def _ver_mech(v: Variant) -> VerifierResult:
    return verify_mechanism_item(build_mechanism_item(v.meta, v.key))


# ---------------------------------------------------------------------------
# Lab data: kinetics runs on GEN2.INTEGRATED.
# ---------------------------------------------------------------------------

# (label, order, k, initial concentration, unit of k, time points). Constants
# are chosen for classroom-scale numbers; each run states its own rounding.
# The verifier refuses any parameter set whose data does not discriminate the
# stated order, so a fixture that drifts out of the discriminating range
# fails loudly at serve time rather than serving a coin flip.
_KINETICS_FIXTURES = [
    ("the decomposition of reactant A", 1, 0.0231, 0.500, "1/s",
     [0, 10, 20, 30, 45, 60, 90, 120]),
    ("the decomposition of reactant B", 1, 0.00580, 1.20, "1/s",
     [0, 30, 60, 120, 180, 240, 360, 480]),
    ("the dimerization of reactant C", 2, 0.0450, 0.800, "L/(mol s)",
     [0, 10, 25, 50, 80, 120, 180, 240]),
    ("the dimerization of reactant D", 2, 0.150, 0.250, "L/(mol s)",
     [0, 15, 30, 60, 100, 150, 210, 300]),
]


def _gen_lab_kinetics(seed: int) -> Variant:
    label, order, k, a0, unit, times = _pick(_KINETICS_FIXTURES, seed)
    setup = KineticsSetup(name=label, order=order, k=k, initial=a0)
    data = [
        {"t": t, "conc": float(f"{concentration_at(setup, t):.4g}")}
        for t in times
    ]
    order_word = {1: "first", 2: "second"}[order]
    return Variant(
        template_id="lab.kinetics_k.v1",
        seed=seed,
        prompt=(
            f"A kinetics run follows {label}, which is {order_word} order in A. "
            "The table gives [A] in mol/L against time in seconds, each "
            "concentration rounded to 4 significant figures. Determine the "
            f"rate constant k, in {unit}, to 3 significant figures. "
            f"Data: " + "; ".join(f"t={r['t']} s, [A]={r['conc']}" for r in data)
        ),
        key=f"{k:.3g}",
        node="GEN2.INTEGRATED",
        grader="labdata",
        meta={
            "node": "GEN2.INTEGRATED",
            "kind": "kinetics",
            "name": label,
            "order": order,
            "data": data,
            "unit": unit,
            "sig_figs": 3,
            "value": k,
            "data_note": "concentrations rounded to 4 significant figures",
            "wrong_paths": _kinetics_wrong_paths(data, order, k),
        },
    )


def _kinetics_wrong_paths(data: list[dict], order: int, k: float) -> list[dict]:
    """The characteristic slip: fitting the data against the wrong integrated
    law. The wrong-order regression gives a specific number, and a learner
    who linearized the wrong transform lands near it."""
    from .labdata import fit_rate_constant

    out = []
    wrong = 2 if order == 1 else 1
    fit = fit_rate_constant(data, wrong)
    if fit is not None and fit[0] > 0 and abs(fit[0] - k) / k > 0.1:
        out.append(
            {
                "value": float(f"{fit[0]:.3g}"),
                "misconception": "ORDER-READ-AS-ONE" if wrong == 1 else "ORDER-FROM-COEFFICIENT",
                "detail": (
                    "This is the slope you get by linearizing the data under "
                    f"the wrong integrated rate law (order {wrong} instead of "
                    f"order {order}). The stated order names which transform "
                    "of [A] is linear in time."
                ),
            }
        )
    return out


def _ver_lab_kinetics(v: Variant) -> VerifierResult:
    return verify_kinetics_item(
        list(v.meta.get("data", [])),
        float(v.meta.get("value", 0.0)),
        int(v.meta.get("order", 0)),
    )


# ---------------------------------------------------------------------------
# Lab data: weak acid titration curves on GEN2.TITRATIONWEAK.
# ---------------------------------------------------------------------------

# (acid name, pKa, source). pKa values from the CRC Handbook of Chemistry and
# Physics, 97th ed., dissociation constants of organic acids at 25 C.
_TITRATION_ACIDS = [
    ("acetic acid", 4.756, "CRC 97th ed."),
    ("formic acid", 3.751, "CRC 97th ed."),
    ("propanoic acid", 4.874, "CRC 97th ed."),
    ("hypochlorous acid", 7.40, "CRC 97th ed."),
]


def _gen_lab_titration(seed: int) -> Variant:
    name, pka, source = _pick(_TITRATION_ACIDS, seed)
    setup = TitrationSetup(
        analyte_conc_M=0.100,
        analyte_volume_mL=25.0,
        titrant_conc_M=0.100,
        ka=10 ** (-pka),
        analyte_name=name,
        ka_source=source,
    )
    eq_mL = 25.0
    # Sample the curve where the reading matters: dense through the buffer
    # region, through equivalence, one point past it.
    volumes = [0.0, 2.5, 5.0, 7.5, 10.0, 12.5, 15.0, 17.5, 20.0, 22.5, 25.0, 30.0]
    full = titration_curve(setup, points=241)
    data = []
    for v_mL in volumes:
        ph = _curve_ph_at(full, v_mL)
        data.append({"vol_mL": v_mL, "pH": float(f"{ph:.2f}")})
    return Variant(
        template_id="lab.titration_pka.v1",
        seed=seed,
        prompt=(
            f"25.0 mL of 0.100 M {name} is titrated with 0.100 M NaOH. The "
            "table gives the measured pH against the volume of base added, "
            "each pH read to 0.01. Determine the acid's pKa from the curve, "
            "to 2 decimal places. Data: "
            + "; ".join(f"V={r['vol_mL']} mL, pH={r['pH']}" for r in data)
        ),
        key=f"{pka:.2f}",
        node="GEN2.TITRATIONWEAK",
        grader="labdata",
        meta={
            "node": "GEN2.TITRATIONWEAK",
            "kind": "titration",
            "name": name,
            "data": data,
            "unit": "",
            "sig_figs": 3,
            "value": round(pka, 2),
            "equivalence_mL": eq_mL,
            "source": source,
            "data_note": "pH read to 0.01",
            "wrong_paths": _titration_wrong_paths(data, eq_mL, pka),
        },
    )


def _curve_ph_at(curve: list[dict], v_mL: float) -> float:
    best = min(curve, key=lambda r: abs(float(r["volume_mL"]) - v_mL))
    return float(best["pH"])


def _titration_wrong_paths(data: list[dict], eq_mL: float, pka: float) -> list[dict]:
    """The characteristic slip: reading the pH at the equivalence point (or
    at the curve's steep jump) as the pKa, instead of at half-equivalence."""
    from .labdata import interpolate_at

    out = []
    ph_eq = interpolate_at(data, "vol_mL", "pH", eq_mL)
    if ph_eq is not None and abs(ph_eq - pka) > 0.5:
        out.append(
            {
                "value": round(ph_eq, 2),
                "misconception": "PKA-READ-AT-EQUIVALENCE",
                "detail": (
                    "This is the pH at the equivalence point. The pKa is read "
                    "at HALF-equivalence, where half the acid has been "
                    "converted and pH = pKa by Henderson-Hasselbalch."
                ),
            }
        )
    return out


def _ver_lab_titration(v: Variant) -> VerifierResult:
    return verify_titration_item(
        list(v.meta.get("data", [])),
        float(v.meta.get("value", 0.0)),
        float(v.meta.get("equivalence_mL", 0.0)),
    )


MECH_LAB_TEMPLATES: dict[str, dict[str, object]] = {
    "org.mech.hbr_markovnikov.v1": {
        "gen": _gen_mech_hbr,
        "ver": _ver_mech,
        "node": "ORG1.HXADDITION",
        "grader": "mechanism",
    },
    "org.mech.acid_hydration.v1": {
        "gen": _gen_mech_hydration,
        "ver": _ver_mech,
        "node": "ORG1.HXADDITION",
        "grader": "mechanism",
    },
    "lab.kinetics_k.v1": {
        "gen": _gen_lab_kinetics,
        "ver": _ver_lab_kinetics,
        "node": "GEN2.INTEGRATED",
        "grader": "labdata",
    },
    "lab.titration_pka.v1": {
        "gen": _gen_lab_titration,
        "ver": _ver_lab_titration,
        "node": "GEN2.TITRATIONWEAK",
        "grader": "labdata",
    },
}

MECH_LAB_HINTS: dict[str, tuple[str, str, str]] = {
    "org.mech.hbr_markovnikov.v1": (
        "Two steps: the alkene is protonated, then the halide attacks. Your "
        "job at each step is to say which species results.",
        "Protonation can land on either alkene carbon, and the two choices "
        "give different carbocations. The path you are asked for goes through "
        "the more stable one: compare how many carbon groups stabilize each.",
        "Put the proton on the carbon that HAS more hydrogens, so the "
        "positive charge lands on the carbon with more carbon substituents. "
        "Then let bromide bond to that cationic carbon.",
    ),
    "org.mech.acid_hydration.v1": (
        "Three steps: protonation, water attack, deprotonation. Name each "
        "step and give the species it produces.",
        "The first step is the same regiochemical choice as HX addition: "
        "protonate so the more substituted carbocation forms. Water then "
        "attacks that carbon, and the oxygen keeps a positive charge until "
        "the last step.",
        "After water attacks, the species is an oxocarbenium ion with two "
        "hydrogens on a positive oxygen. Removing one of those protons is the "
        "final step and gives the neutral alcohol.",
    ),
    "lab.kinetics_k.v1": (
        "The stated order tells you which transform of [A] is linear in "
        "time. Recover k from the slope of that line.",
        "First order: ln[A] against t is a line with slope -k. Second order: "
        "1/[A] against t is a line with slope +k. Pick two well-separated "
        "points to estimate the slope.",
        "Take the transformed values at the first and last times and divide "
        "the change by the time elapsed. Mind the sign: the slope is -k for "
        "first order and +k for second.",
    ),
    "lab.titration_pka.v1": (
        "The pKa is read off the curve at a particular volume. Which one?",
        "At half-equivalence, half the acid has been converted to its "
        "conjugate base, so the Henderson-Hasselbalch log term is zero and "
        "pH = pKa. Find the equivalence volume first.",
        "Equal concentrations of acid and base mean equivalence at 25.0 mL, "
        "so read the pH at 12.5 mL. That value is the pKa.",
    ),
}
