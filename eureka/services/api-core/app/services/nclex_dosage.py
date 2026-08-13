"""
NCLEX dosage-calculation generation engine.

WHAT THIS IS

The server-side generator behind the NCLEX Dosage Mastery surface — the
same pattern OCTET's chemistry engine gives the MCAT: fresh items on demand,
every answer key machine-verified before serving, misses diagnosed by the
specific error that produced them.

THE TWO-PATH RULE

House rule: every generated answer key gets an independent verifier through
a second computational path. Here that means each calculation family has TWO
implementations that must agree before an item is served:

  - the GENERATOR path (`gen_*`): stepwise arithmetic, the way the worked
    explanation walks it;
  - the VERIFIER path (`VERIFIERS`): a single dimensional-analysis fraction
    product, written separately, sharing no intermediate steps.

`generate()` refuses to return an item on any disagreement. A third,
independently written TypeScript path (`nclex-dosage-verify.test.ts`) checks
the same families in CI for the static banks emitted from this module —
three computations of every key, in two languages.

MISCONCEPTION DIAGNOSIS

Each family enumerates its classic errors — skipped lb→kg, flipped ratio,
mcg/mg moved the wrong way, per-day given as per-dose, drop factor dropped —
and computes the numeric value each error produces FOR THIS ITEM's
parameters. When a learner's answer matches an error value, the response
names the error and coaches it. This is the AXIOM misconception model
applied to med math, where it needs almost no adaptation: dosage errors are
deterministic functions of the parameters.

The stem TEMPLATES are authored (not SME-reviewed); only the KEYS are
machine-verified. Responses say exactly that — the honesty line every other
bank on the platform follows.

Parameter pools are clinically real (drug concentrations as marketed,
weight-based ranges from standard pediatric/adult references) so a generated
stem never asks for a dose that would be malpractice to draw up.
"""

from __future__ import annotations

import math
import random
import uuid
from dataclasses import dataclass, field
from typing import Callable, Optional

# Stable per-family UUIDs for Item.family_id (a required column) so retrieval
# and analytics can group generated items by family across time.
_FAMILY_NS = uuid.UUID("7d0a6e0c-9f1e-4b6b-8f57-a1e00d05a9e0")


def family_uuid(family: str) -> uuid.UUID:
    return uuid.uuid5(_FAMILY_NS, family)


@dataclass
class Misconception:
    key: str
    label: str
    value: float
    coaching: str


@dataclass
class GeneratedItem:
    family: str
    stem: str
    params: dict
    expected: float  # rounded to `round` decimals
    unit: str
    round: int
    explanation: str
    misconceptions: list[Misconception] = field(default_factory=list)

    def content(self) -> dict:
        """The JSONB payload persisted on the Item row. Everything the
        grader needs; the serving endpoint must never copy `expected`,
        `explanation`, or `misconceptions` into a pre-submission response."""
        return {
            "family": self.family,
            "stem": self.stem,
            "params": self.params,
            "expected": self.expected,
            "unit": self.unit,
            "round": self.round,
            "explanation": self.explanation,
            "misconceptions": [
                {"key": m.key, "label": m.label, "value": m.value, "coaching": m.coaching}
                for m in self.misconceptions
            ],
        }


def _r(v: float, nd: int) -> float:
    """Round-half-UP at nd decimals, with float noise quantized away first.

    Two reasons this is not `round()`:

      - Python rounds half-to-even, but nursing convention (and every dosage
        text the exam follows) rounds 0.5 UP — 25.5 mL/hr is set as 26.
      - The generator and verifier reach the same exact value through
        different float arithmetic, so one can land at 25.499999999999996
        and the other at 25.500000000000004. Pre-rounding to 9 decimals
        collapses both onto the exact 25.5 before the half-up decision,
        which is what keeps the two paths in deterministic agreement at
        rounding boundaries. (This function exists because the dual-path
        gate caught exactly that disagreement: nitroprusside 1 mcg/kg/min
        at 85 kg = exactly 25.5 mL/hr, generator said 25, verifier 26.)

    Used by generation, verification, grading, and diagnosis — one rounding
    rule everywhere, or the paths drift apart again.
    """
    q = round(v, 9)  # kill representation noise; real values never need 9 dp
    shifted = q * (10 ** nd)
    return math.floor(round(shifted, 6) + 0.5) / (10 ** nd)


def _fmt(v: float, nd: int) -> str:
    return f"{_r(v, nd):g}"


# ---------------------------------------------------------------------------
# Clinical parameter pools. Concentrations are marketed strengths; the
# weight-based orders sit inside standard dosing ranges so every generated
# stem is a dose a nurse could actually be asked to give.
# ---------------------------------------------------------------------------

_TABLET_DRUGS = [
    # (drug, [strengths mg], [multipliers of strength for the order])
    ("levothyroxine", [0.025, 0.05, 0.075], [2, 3]),
    ("metoprolol", [25, 50], [1.5, 2, 3]),
    ("warfarin", [2.5, 5], [1.5, 2]),
    ("prednisone", [10, 20], [2, 3]),
    # No ×1 multiplier anywhere in this pool: an ordered dose equal to the
    # tablet strength makes a trivial item whose classic-error values
    # collapse onto the key (strength ÷ dose = 1 = the answer).
    ("digoxin", [0.125, 0.25], [2]),
    ("furosemide", [20, 40], [1.5, 2]),
    ("lisinopril", [10, 20], [2]),
]

_LIQUID_DRUGS = [
    # (drug, conc_mg, conc_ml, [ordered mg])
    ("amoxicillin suspension", 250, 5, [125, 200, 375, 500, 625]),
    ("amoxicillin suspension", 400, 5, [200, 300, 600, 800]),
    ("acetaminophen elixir", 160, 5, [240, 320, 400, 480, 560]),
    ("furosemide oral solution", 10, 1, [15, 25, 30, 35]),
    ("phenytoin suspension", 125, 5, [100, 150, 200, 250]),
    ("famotidine oral suspension", 40, 5, [20, 30, 60]),
    ("cephalexin suspension", 250, 5, [125, 375, 500, 625]),
    ("azithromycin suspension", 200, 5, [100, 300, 500]),
]

_WEIGHT_DRUGS = [
    # (drug, [mg/kg/dose], weight range kg, lb_allowed)
    ("cefazolin", [25], (10, 30), True),
    ("acetaminophen", [10, 15], (8, 40), True),
    ("gentamicin", [2, 2.5], (40, 80), False),
    ("vancomycin", [15], (40, 90), True),
    ("morphine", [0.1], (20, 60), False),
    ("ceftriaxone", [50], (10, 25), True),
]

_IV_FLUIDS = [
    "0.9% sodium chloride",
    "lactated Ringer's",
    "D5W",
    "0.45% sodium chloride",
    "D5 1/2 NS with 20 mEq KCl",
]

_CRITICAL_DRIPS = [
    # (drug, [mcg/kg/min], bag_mg, bag_ml)
    ("dopamine", [2.5, 5, 10], 400, 250),
    ("dobutamine", [2.5, 5], 250, 250),
    ("norepinephrine", [0.05, 0.1, 0.2], 4, 250),
    ("nitroprusside", [0.5, 1], 50, 250),
]

_RECONSTITUTION = [
    # (drug, conc_mg_per_ml, [ordered mg])
    ("cefazolin", 225, [300, 450, 500, 750]),
    ("cefazolin", 330, [500, 750, 1000]),
    ("ampicillin", 250, [375, 500, 625, 750]),
    ("methylprednisolone", 62.5, [40, 100, 125]),
    ("ceftriaxone", 100, [125, 250, 350, 500]),
    ("cefepime", 280, [500, 700, 1000]),
]

_PEDS_SAFE = [
    # (drug, mg/kg/day, doses/day, weight range kg)
    ("amoxicillin", 50, 2, (8, 24)),
    ("cephalexin", 100, 4, (10, 28)),
    ("ibuprofen", 40, 4, (10, 30)),
    ("azithromycin", 12, 1, (10, 30)),
]

_HEPARIN = [
    # (units/kg/hr, bag_units, bag_ml)
    (18, 25000, 250),
    (18, 25000, 500),
    (12, 25000, 250),
]


# ---------------------------------------------------------------------------
# GENERATOR PATH — stepwise arithmetic, mirrored by the worked explanations.
# Param names and family keys are the shared contract with the TypeScript
# verifier; do not rename them without updating nclex-dosage-verify.test.ts.
# ---------------------------------------------------------------------------

def gen_tablets(rng: random.Random) -> GeneratedItem:
    drug, strengths, mults = rng.choice(_TABLET_DRUGS)
    strength = rng.choice(strengths)
    mult = rng.choice(mults)
    ordered = _r(strength * mult, 4)
    expected = ordered / strength
    nd = 1
    return GeneratedItem(
        family="tablets",
        stem=(
            f"A client is prescribed {drug} {ordered:g} mg PO. The pharmacy supplies "
            f"{strength:g} mg tablets. How many tablets should the nurse administer per dose? "
            f"(Record your answer using one decimal place.)"
        ),
        params={"ordered_mg": ordered, "strength_mg": strength},
        expected=_r(expected, nd),
        unit="tablet(s)",
        round=nd,
        explanation=(
            f"Desired ÷ have: {ordered:g} mg ÷ {strength:g} mg/tablet = {expected:g} tablets. "
            "Confirm the order and the supplied strength are in the same unit before dividing."
        ),
        misconceptions=[
            Misconception(
                "ratio_flip", "Divided the strength by the dose",
                _r(strength / ordered, nd),
                "You inverted the fraction. It is always desired dose ÷ strength on hand — "
                "the ordered amount goes on top.",
            ),
            Misconception(
                "doubled", "Doubled the correct answer",
                _r(expected * 2, nd),
                "Recheck the arithmetic — the result is exactly twice the correct dose, "
                "which usually means a strength was halved or a dose doubled along the way.",
            ),
        ],
    )


def gen_liquid(rng: random.Random) -> GeneratedItem:
    drug, conc_mg, conc_ml, orders = rng.choice(_LIQUID_DRUGS)
    ordered = rng.choice(orders)
    ratio = ordered / conc_mg
    expected = ratio * conc_ml
    nd = 1
    return GeneratedItem(
        family="liquid-volume",
        stem=(
            f"A client is prescribed {drug} {ordered:g} mg PO. The label reads "
            f"{conc_mg:g} mg per {conc_ml:g} mL. How many milliliters should the nurse "
            f"administer? (Record your answer using one decimal place.)"
        ),
        params={"ordered_mg": ordered, "conc_mg": conc_mg, "conc_ml": conc_ml},
        expected=_r(expected, nd),
        unit="mL",
        round=nd,
        explanation=(
            f"Desired ÷ have × volume: ({ordered:g} ÷ {conc_mg:g}) × {conc_ml:g} mL = "
            f"{expected:g} mL."
        ),
        misconceptions=[
            Misconception(
                "dropped_vehicle", "Dropped the 'per volume' term",
                _r(ratio, nd),
                f"You computed the bare ratio ({ordered:g} ÷ {conc_mg:g}) and stopped. The "
                f"concentration is per {conc_ml:g} mL, so the ratio must be multiplied by "
                f"{conc_ml:g}.",
            ),
            Misconception(
                "ratio_flip", "Inverted the concentration",
                _r(conc_mg / ordered * conc_ml, nd),
                "The fraction is upside down — desired dose over strength on hand, "
                "then times the vehicle volume.",
            ),
        ],
    )


def gen_weight(rng: random.Random) -> GeneratedItem:
    drug, doses, (lo, hi), lb_allowed = rng.choice(_WEIGHT_DRUGS)
    mgkg = rng.choice(doses)
    kg = rng.randrange(int(lo), int(hi) + 1)
    use_lb = lb_allowed and rng.random() < 0.5
    if use_lb:
        weight = _r(kg * 2.2, 0)
        kg_eff = weight / 2.2
    else:
        weight = kg
        kg_eff = kg
    expected = mgkg * kg_eff
    nd = 1
    unit_w = "lb" if use_lb else "kg"
    mis = [
        Misconception(
            "halved", "Half the correct dose",
            _r(expected / 2, nd),
            "The result is half the ordered dose — recheck each factor against the order.",
        ),
    ]
    if use_lb:
        mis.insert(0, Misconception(
            "no_lb_conversion", "Skipped the lb → kg conversion",
            _r(mgkg * weight, nd),
            f"The weight is in POUNDS. Divide by 2.2 first: {weight:g} lb ÷ 2.2 = "
            f"{kg_eff:g} kg. Multiplying mg/kg by pounds overdoses by a factor of 2.2.",
        ))
    else:
        mis.insert(0, Misconception(
            "spurious_conversion", "Divided a kg weight by 2.2",
            _r(mgkg * weight / 2.2, nd),
            "The weight was already in kilograms — converting it again underdoses by "
            "a factor of 2.2. Convert only when the stem gives pounds.",
        ))
    return GeneratedItem(
        family="dose-by-weight",
        stem=(
            f"A client weighing {weight:g} {unit_w} is prescribed {drug} {mgkg:g} mg/kg/dose. "
            f"How many milligrams should the nurse administer per dose? "
            f"(Record your answer using one decimal place.)"
        ),
        params={"mg_per_kg": mgkg, "weight": weight, "weight_is_lb": 1 if use_lb else 0},
        expected=_r(expected, nd),
        unit="mg",
        round=nd,
        explanation=(
            (f"Convert first: {weight:g} lb ÷ 2.2 = {kg_eff:g} kg. " if use_lb else "")
            + f"{mgkg:g} mg/kg × {kg_eff:g} kg = {expected:g} mg."
        ),
        misconceptions=mis,
    )


def gen_mlhr(rng: random.Random) -> GeneratedItem:
    fluid = rng.choice(_IV_FLUIDS)
    # Free combination within a sane pump range (20-999 mL/hr) so the pool
    # is wide enough for deduplicated static emission and varied live play.
    volume = rng.choice([100, 150, 250, 500, 600, 750, 1000, 1250, 1500, 1800, 2000])
    hours = rng.choice([1, 2, 3, 4, 6, 8, 10, 12, 16, 24])
    while not (20 <= volume / hours <= 999):
        volume = rng.choice([100, 150, 250, 500, 600, 750, 1000, 1250, 1500, 1800, 2000])
        hours = rng.choice([1, 2, 3, 4, 6, 8, 10, 12, 16, 24])
    expected = volume / hours
    nd = 0
    return GeneratedItem(
        family="iv-rate-mlhr",
        stem=(
            f"A provider prescribes {fluid} {volume:g} mL IV to infuse over {hours:g} hours. "
            f"At how many milliliters per hour should the nurse set the infusion pump? "
            f"(Round to the nearest whole number.)"
        ),
        params={"volume_ml": volume, "hours": hours},
        expected=_r(expected, nd),
        unit="mL/hr",
        round=nd,
        explanation=f"Rate = volume ÷ time: {volume:g} mL ÷ {hours:g} hr = {_fmt(expected, nd)} mL/hr.",
        misconceptions=[
            Misconception(
                "used_minutes", "Divided by minutes instead of hours",
                _r(volume / (hours * 60), nd),
                "Pumps are programmed in mL per HOUR. Dividing by minutes gives a rate "
                "60× too slow.",
            ),
            Misconception(
                "inverted_time", "Multiplied by the hours",
                _r(volume * hours, nd),
                "Time divides the volume; multiplying by it has no physical meaning here.",
            ),
        ],
    )


def gen_gtt(rng: random.Random) -> GeneratedItem:
    volume, minutes = rng.choice([
        (1000, 480), (100, 30), (500, 240), (150, 60), (50, 20), (250, 90), (75, 30),
    ])
    df = rng.choice([10, 15, 20, 60])
    fluid = rng.choice(["0.9% sodium chloride", "an antibiotic piggyback", "lactated Ringer's", "D5W"])
    expected = volume * df / minutes
    nd = 0
    return GeneratedItem(
        family="iv-drip-gtt",
        stem=(
            f"A provider prescribes {fluid} {volume:g} mL IV to infuse over {minutes:g} minutes "
            f"by gravity. The tubing drop factor is {df:g} gtt/mL. At how many drops per minute "
            f"should the nurse regulate the infusion? (Round to the nearest whole number.)"
        ),
        params={"volume_ml": volume, "minutes": minutes, "drop_factor": df},
        expected=_r(expected, nd),
        unit="gtt/min",
        round=nd,
        explanation=(
            f"gtt/min = (volume × drop factor) ÷ minutes = ({volume:g} × {df:g}) ÷ {minutes:g} "
            f"= {_fmt(expected, nd)} gtt/min."
        ),
        misconceptions=[
            Misconception(
                "no_drop_factor", "Forgot the drop factor",
                _r(volume / minutes, nd),
                "Volume ÷ minutes gives mL/min, not drops. The tubing's gtt/mL factor "
                "converts milliliters to countable drops.",
            ),
            Misconception(
                "used_hours", "Used hours instead of minutes",
                _r(volume * df / (minutes / 60), nd),
                "The formula's time base is MINUTES. Converting to hours first inflates "
                "the rate 60-fold.",
            ),
        ],
    )


def gen_conversion(rng: random.Random) -> GeneratedItem:
    kind = rng.choice(["mcg_to_mg", "g_to_mg", "ml_to_tsp"])
    if kind == "mcg_to_mg":
        value = rng.choice([25, 50, 75, 100, 125, 150, 200, 250, 400, 500, 600, 750, 800])
        factor, nd, unit = 0.001, 3, "mg"
        stem = (
            f"A provider prescribes digoxin {value:g} mcg PO daily. The medication "
            f"administration record lists the dose in milligrams. How many milligrams is "
            f"the prescribed dose? (Record your answer using three decimal places.)"
        )
        expl = f"mcg to mg divides by 1,000: {value:g} mcg = {value * factor:g} mg."
        mis = [
            Misconception(
                "decimal_wrong_way", "Moved the decimal the wrong direction",
                _r(value * 1000, nd),
                "Micro is SMALLER than milli, so the mg number must be smaller — divide "
                "by 1,000, never multiply.",
            ),
            Misconception(
                "one_place_off", "Moved the decimal one place short",
                _r(value * 0.01, nd),
                "The metric steps here are a factor of 1,000 — three decimal places, "
                "not two.",
            ),
        ]
    elif kind == "g_to_mg":
        value = rng.choice([0.5, 0.25, 1.5, 0.75])
        factor, nd, unit = 1000, 0, "mg"
        stem = (
            f"A medication order reads {value:g} g PO. The tablets on hand are labeled in "
            f"milligrams. How many milligrams equal the ordered dose? "
            f"(Round to the nearest whole number.)"
        )
        expl = f"g to mg multiplies by 1,000: {value:g} g = {value * factor:g} mg."
        mis = [
            Misconception(
                "decimal_wrong_way", "Divided instead of multiplied",
                _r(value / 1000, 3) if value / 1000 >= 0.001 else 0.001,
                "Grams are LARGER than milligrams: multiply by 1,000.",
            ),
            Misconception(
                "one_place_off", "Moved the decimal one place short",
                _r(value * 100, nd),
                "One thousand, not one hundred — three places.",
            ),
        ]
    else:
        value = rng.choice([10, 15, 5])
        factor, nd, unit = 0.2, 0, "teaspoon(s)"
        stem = (
            f"A caregiver will measure a child's medication at home with standardized "
            f"teaspoons. The prescribed dose is {value:g} mL. How many teaspoons should the "
            f"nurse teach the caregiver to give? (Round to the nearest whole number.)"
        )
        expl = f"1 teaspoon = 5 mL, so {value:g} mL = {value * factor:g} teaspoons."
        mis = [
            Misconception(
                "tbsp_confusion", "Used the tablespoon (15 mL) conversion",
                _r(value / 15, 1),
                "A TEAspoon is 5 mL; a TABLEspoon is 15 mL. Swapping them triples or "
                "thirds the dose.",
            ),
        ]
    expected = value * factor
    return GeneratedItem(
        family="unit-conversion",
        stem=stem,
        params={"value": value, "factor": factor},
        expected=_r(expected, nd),
        unit=unit,
        round=nd,
        explanation=expl,
        misconceptions=mis,
    )


def gen_reconstitution(rng: random.Random) -> GeneratedItem:
    drug, conc_mg, orders = rng.choice(_RECONSTITUTION)
    ordered = rng.choice(orders)
    conc_ml = 1
    expected = ordered / conc_mg * conc_ml
    nd = 1
    return GeneratedItem(
        family="reconstitution",
        stem=(
            f"After reconstitution, a vial of {drug} yields a concentration of {conc_mg:g} mg/mL. "
            f"The prescription is {drug} {ordered:g} mg IV. How many milliliters should the "
            f"nurse draw up? (Record your answer using one decimal place.)"
        ),
        params={"ordered_mg": ordered, "conc_mg": conc_mg, "conc_ml": conc_ml},
        expected=_r(expected, nd),
        unit="mL",
        round=nd,
        explanation=(
            f"Desired ÷ have: {ordered:g} mg ÷ {conc_mg:g} mg/mL = {_fmt(expected, nd)} mL. "
            "Use the concentration printed for the diluent volume actually added — not the "
            "vial's total content."
        ),
        misconceptions=[
            Misconception(
                "ratio_flip", "Inverted the concentration",
                _r(conc_mg / ordered, nd),
                "Ordered dose over concentration — the milligrams you want divided by the "
                "milligrams in each milliliter.",
            ),
            Misconception(
                "doubled", "Doubled the correct volume",
                _r(expected * 2, nd),
                "The result is exactly twice the ordered volume — recheck each number "
                "against the vial label.",
            ),
        ],
    )


def gen_peds_safe(rng: random.Random) -> GeneratedItem:
    drug, mgkgday, divided, (lo, hi) = rng.choice(_PEDS_SAFE)
    weight = rng.randrange(int(lo), int(hi) + 1)
    daily = mgkgday * weight
    expected = daily / divided
    nd = 0
    return GeneratedItem(
        family="pediatric-safe-dose",
        stem=(
            f"The maximum safe dosage of {drug} for children is {mgkgday:g} mg/kg/day divided "
            f"into {divided} dose{'s' if divided > 1 else ''} per day. For a child weighing "
            f"{weight:g} kg, what is the maximum safe amount per dose? "
            f"(Round to the nearest whole number.)"
        ),
        params={"mg_per_kg_day": mgkgday, "doses_per_day": divided, "weight_kg": weight},
        expected=_r(expected, nd),
        unit="mg",
        round=nd,
        explanation=(
            f"Daily maximum: {mgkgday:g} × {weight:g} = {daily:g} mg/day; ÷ {divided} doses "
            f"= {_fmt(expected, nd)} mg/dose."
        ),
        misconceptions=[
            Misconception(
                "per_day_not_per_dose", "Reported the whole-day maximum as one dose",
                _r(daily, nd),
                f"{daily:g} mg is the limit for the whole DAY. The question asks per dose — "
                f"divide by the {divided} daily doses. This mix-up is the classic pediatric "
                "overdose.",
            ),
            Misconception(
                "halved", "Half the correct per-dose amount",
                _r(expected / 2, nd),
                "The result is half the safe per-dose maximum — recheck the division.",
            ),
        ],
    )


def gen_infusion_time(rng: random.Random) -> GeneratedItem:
    # Free combination bounded to realistic infusion durations (1-24 h).
    volume = rng.choice([250, 400, 500, 600, 750, 800, 900, 1000, 1200])
    rate = rng.choice([40, 50, 60, 75, 80, 100, 120, 125, 150])
    while not (1 <= volume / rate <= 24):
        volume = rng.choice([250, 400, 500, 600, 750, 800, 900, 1000, 1200])
        rate = rng.choice([40, 50, 60, 75, 80, 100, 120, 125, 150])
    fluid = rng.choice(_IV_FLUIDS)
    expected = volume / rate
    nd = 1
    return GeneratedItem(
        family="infusion-time",
        stem=(
            f"An infusion of {fluid} {volume:g} mL is running at {rate:g} mL/hr. How many "
            f"hours will the infusion take to complete? "
            f"(Record your answer using one decimal place.)"
        ),
        params={"volume_ml": volume, "rate_mlhr": rate},
        expected=_r(expected, nd),
        unit="hours",
        round=nd,
        explanation=f"Time = volume ÷ rate: {volume:g} ÷ {rate:g} = {_fmt(expected, nd)} hours.",
        misconceptions=[
            Misconception(
                "inverted", "Divided the rate by the volume",
                _r(rate / volume, 3),
                "Volume ÷ rate. The larger number (milliliters to give) goes on top.",
            ),
            Misconception(
                "doubled", "Twice the correct time",
                _r(expected * 2, nd),
                "The result is double the true infusion time — recheck the division.",
            ),
        ],
    )


def gen_critical_drip(rng: random.Random) -> GeneratedItem:
    if rng.random() < 0.6:
        drug, doses, bag_mg, bag_ml = rng.choice(_CRITICAL_DRIPS)
        mcgkgmin = rng.choice(doses)
        weight = rng.randrange(50, 101, 5)
        mcg_min = mcgkgmin * weight
        mg_hr = mcg_min * 60 / 1000
        conc = bag_mg / bag_ml
        expected = mg_hr / conc
        nd = 0
        return GeneratedItem(
            family="iv-dose-mlhr",
            stem=(
                f"A provider prescribes {drug} at {mcgkgmin:g} mcg/kg/min for a client weighing "
                f"{weight:g} kg. The pharmacy supplies {drug} {bag_mg:g} mg in {bag_ml:g} mL. "
                f"At how many milliliters per hour should the nurse set the pump? "
                f"(Round to the nearest whole number.)"
            ),
            params={
                "mcg_per_kg_min": mcgkgmin, "weight_kg": weight,
                "bag_mg": bag_mg, "bag_ml": bag_ml,
            },
            expected=_r(expected, nd),
            unit="mL/hr",
            round=nd,
            explanation=(
                f"Dose: {mcgkgmin:g} × {weight:g} = {mcg_min:g} mcg/min = {mg_hr:g} mg/hr. "
                f"Concentration: {bag_mg:g} ÷ {bag_ml:g} = {conc:g} mg/mL. "
                f"Rate: {mg_hr:g} ÷ {conc:g} = {_fmt(expected, nd)} mL/hr."
            ),
            misconceptions=[
                Misconception(
                    "no_mcg_conversion", "Skipped the mcg → mg step",
                    _r(mcg_min * 60 / conc, nd),
                    "The dose is in MICROgrams but the bag is labeled in MILLIgrams — "
                    "divide by 1,000 before using the concentration. This step is where "
                    "critical-care calculations die.",
                ),
                Misconception(
                    "no_weight", "Forgot the client's weight",
                    _r(mcgkgmin * 60 / 1000 / conc, 1),
                    "The order is per KILOGRAM per minute — multiply by the weight first.",
                ),
            ],
        )
    units_kg_hr, bag_units, bag_ml = rng.choice(_HEPARIN)
    weight = rng.randrange(50, 101, 5)
    units_hr = units_kg_hr * weight
    conc = bag_units / bag_ml
    expected = units_hr / conc
    nd = 0
    return GeneratedItem(
        family="iv-dose-mlhr",
        stem=(
            f"A heparin protocol prescribes {units_kg_hr:g} units/kg/hr for a client weighing "
            f"{weight:g} kg. The infusion bag contains heparin {bag_units:,} units in "
            f"{bag_ml:g} mL. At how many milliliters per hour should the nurse set the pump? "
            f"(Round to the nearest whole number.)"
        ),
        params={
            "units_per_kg_hr": units_kg_hr, "weight_kg": weight,
            "bag_units": bag_units, "bag_ml": bag_ml,
        },
        expected=_r(expected, nd),
        unit="mL/hr",
        round=nd,
        explanation=(
            f"Dose: {units_kg_hr:g} × {weight:g} = {units_hr:g} units/hr. "
            f"Concentration: {bag_units:,} ÷ {bag_ml:g} = {conc:g} units/mL. "
            f"Rate: {units_hr:g} ÷ {conc:g} = {_fmt(expected, nd)} mL/hr. "
            "Heparin errors are never small errors — verify per policy."
        ),
        misconceptions=[
            Misconception(
                "no_weight", "Forgot the client's weight",
                _r(units_kg_hr / conc, 1),
                "The protocol is per KILOGRAM per hour — multiply by the weight first.",
            ),
            Misconception(
                "inverted_conc", "Inverted the bag concentration",
                _r(units_hr * conc, nd),
                "Concentration is units PER milliliter (units ÷ mL), and the dose is "
                "DIVIDED by it — multiplying by the concentration produces an absurd rate, "
                "which is itself the tell.",
            ),
        ],
    )


GENERATORS: dict[str, Callable[[random.Random], GeneratedItem]] = {
    "tablets": gen_tablets,
    "liquid-volume": gen_liquid,
    "dose-by-weight": gen_weight,
    "iv-rate-mlhr": gen_mlhr,
    "iv-drip-gtt": gen_gtt,
    "unit-conversion": gen_conversion,
    "reconstitution": gen_reconstitution,
    "pediatric-safe-dose": gen_peds_safe,
    "infusion-time": gen_infusion_time,
    "iv-dose-mlhr": gen_critical_drip,
}

FAMILY_LABELS: dict[str, str] = {
    "tablets": "Tablets & capsules",
    "liquid-volume": "Oral liquids",
    "dose-by-weight": "Weight-based dosing",
    "iv-rate-mlhr": "IV pump rate (mL/hr)",
    "iv-drip-gtt": "Gravity drip rate (gtt/min)",
    "unit-conversion": "Unit conversions",
    "reconstitution": "Reconstitution",
    "pediatric-safe-dose": "Pediatric safe dose",
    "infusion-time": "Infusion time",
    "iv-dose-mlhr": "Critical-care infusions",
}


# ---------------------------------------------------------------------------
# VERIFIER PATH — one dimensional-analysis product per family, written
# without reference to the generators' step arithmetic. Serving requires
# agreement with the generator to the item's rounding.
# ---------------------------------------------------------------------------

VERIFIERS: dict[str, Callable[[dict], float]] = {
    "tablets": lambda p: p["ordered_mg"] * (1.0 / p["strength_mg"]),
    "liquid-volume": lambda p: p["ordered_mg"] * (p["conc_ml"] / p["conc_mg"]),
    "dose-by-weight": lambda p: (
        p["mg_per_kg"] * (p["weight"] / 2.2 if p["weight_is_lb"] else p["weight"])
    ),
    "iv-rate-mlhr": lambda p: p["volume_ml"] * (1.0 / p["hours"]),
    "iv-drip-gtt": lambda p: p["volume_ml"] * p["drop_factor"] * (1.0 / p["minutes"]),
    "unit-conversion": lambda p: p["value"] * p["factor"],
    "reconstitution": lambda p: p["ordered_mg"] * (p["conc_ml"] / p["conc_mg"]),
    "pediatric-safe-dose": lambda p: (
        p["mg_per_kg_day"] * p["weight_kg"] * (1.0 / p["doses_per_day"])
    ),
    "infusion-time": lambda p: p["volume_ml"] * (1.0 / p["rate_mlhr"]),
    "iv-dose-mlhr": lambda p: (
        # units/kg/hr → mL/hr: units/hr divided by units/mL
        (p["units_per_kg_hr"] * p["weight_kg"]) / (p["bag_units"] / p["bag_ml"])
        if "units_per_kg_hr" in p
        # mcg/kg/min → mL/hr: mcg/min × 60 min/hr × 1 mg/1000 mcg × mL/mg
        else (p["mcg_per_kg_min"] * p["weight_kg"]) * 60.0 / 1000.0 * (p["bag_ml"] / p["bag_mg"])
    ),
}


class VerificationError(RuntimeError):
    """The generator and verifier paths disagreed — the item must not serve."""


def verify(item: GeneratedItem) -> None:
    independent = _r(VERIFIERS[item.family](item.params), item.round)
    if abs(independent - item.expected) > 10 ** (-item.round) / 2 + 1e-9:
        raise VerificationError(
            f"{item.family}: generator={item.expected} verifier={independent} "
            f"params={item.params}"
        )
    # A misconception value that equals the key would 'diagnose' correct
    # answers as errors. Drop such values instead of serving them.
    item.misconceptions = [
        m for m in item.misconceptions
        if abs(_r(m.value, item.round) - item.expected) > 10 ** (-item.round) / 2 + 1e-9
    ]


def generate(family: Optional[str] = None, rng: Optional[random.Random] = None) -> GeneratedItem:
    """A fresh, dual-path-verified item. Raises VerificationError only if the
    two computation paths genuinely disagree — which is a bug, not bad luck,
    so there is deliberately no retry loop hiding it."""
    rng = rng or random.Random()
    if family is not None and family not in GENERATORS:
        raise KeyError(f"unknown dosage family: {family}")
    key = family or rng.choice(list(GENERATORS.keys()))
    item = GENERATORS[key](rng)
    verify(item)
    return item


# ---------------------------------------------------------------------------
# Grading + diagnosis
# ---------------------------------------------------------------------------

def grade(content: dict, answer: float) -> bool:
    """Correct iff the answer matches the expected value at the item's stated
    rounding — the learner's entry goes through the SAME half-up rule the key
    was produced with, so entering the exact unrounded value (25.5 for a
    whole-number item) is graded correct, not tripped by half-even `round`."""
    nd = int(content["round"])
    return abs(_r(float(answer), nd) - float(content["expected"])) <= 10 ** (-nd) / 2 + 1e-9


def diagnose(content: dict, answer: float) -> Optional[dict]:
    """The classic error whose value matches a wrong answer, if any."""
    nd = int(content["round"])
    tol = 10 ** (-nd) / 2 + 1e-9
    for m in content.get("misconceptions", []):
        if abs(_r(float(answer), nd) - _r(float(m["value"]), nd)) <= tol:
            return {"key": m["key"], "label": m["label"], "coaching": m["coaching"]}
    return None
