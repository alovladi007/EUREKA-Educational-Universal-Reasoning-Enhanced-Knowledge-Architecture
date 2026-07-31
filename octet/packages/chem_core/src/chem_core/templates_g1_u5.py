"""GEN1 Unit 5 templates: thermochemistry.

All nine nodes of GEN1-U5 had an authored lesson and no practice item, so the
unit was readable and not practisable, and blueprints.py builds a unit exam
only from units that carry items, so there was no unit exam either. Nine
templates, one per node, close that.

WHY THE VERIFIERS LOOK LIKE THIS

The house rule is that every generator ships with a verifier that reaches the
same answer by a different route, not one that replays the generator's
arithmetic with the operands rearranged. Thermochemistry makes that unusually
easy to honour, because enthalpy is a state function and that gives a second
route for free:

  heat capacity   heating in two stages must total the single-stage heat
  calorimetry     the two heats must sum to zero, which the generator never
                  computes: it solves the weighted average instead
  enthalpy        recover the amount from the total and check it round trips
  thermostoich    convert the answer back to grams through the molar mass
  Hess            build the cycle in the opposite order and reverse it
  formation       traverse the cycle backwards; a closed loop sums to zero
  bond enthalpy   swap bonds broken and formed; the reverse must be exactly
                  the negative
  first law       a process followed by its exact reverse must give dU = 0

Each of those is a physical identity, so a verifier failing is evidence the
chemistry is wrong rather than that two spellings of one formula disagree.

ON VALUES

No measured thermodynamic quantity is invented and presented as real. Every
enthalpy, specific heat of a named metal, bond enthalpy and formation enthalpy
in these prompts is stated as given problem data synthesised from the seed,
which is what a textbook problem does. The only fixed numbers are defining or
widely tabulated constants, and each is carried in meta with a source:

  c(water) = 4.184 J/(g*K)     (CRC Handbook; the definition of the calorie)
  M(H2O)   = 18.02 g/mol       (from standard atomic weights, IUPAC)

Both are flagged for expert review through the ordinary route: they appear as
constant_source strings, not as unattributed magic numbers.

Registration into REGISTRY, HINTS and MISCONCEPTIONS is done by the registry
wiring, not by this module.
"""

from __future__ import annotations

import math

from .mc import validate_choices
from .misconceptions import Misconception
from .registry import Variant
from .stoich import format_sig_figs
from .types import VerifierResult

C_WATER = 4.184  # J/(g*K)
M_WATER = 18.02  # g/mol

_C_WATER_SOURCE = "c(water) = 4.184 J/(g*K) (CRC Handbook; the defining value of the thermochemical calorie)"
_M_WATER_SOURCE = "M(H2O) = 18.02 g/mol, from IUPAC standard atomic weights"
_STATE_FUNCTION_SOURCE = (
    "Enthalpy is a state function, so a cycle sums to zero and reversing a step "
    "negates its dH (Hess's law; Atkins Physical Chemistry)"
)
_FIRST_LAW_SOURCE = (
    "First law dU = q + w with the physics sign convention: q positive into the "
    "system, w positive done on the system (Atkins Physical Chemistry)"
)

METALS = (
    ("iron", 0.449),
    ("copper", 0.385),
    ("aluminium", 0.897),
    ("silver", 0.235),
)


# ---------------------------------------------------------------------------
# 1. specific heat arithmetic  (GEN1.HEATCAPACITY)
# ---------------------------------------------------------------------------


def gen_heat_capacity(seed: int) -> Variant:
    mass = 25.0 + (seed % 60) * 5.0          # 25 .. 320 g
    dt = 5.0 + (seed % 24) * 2.5             # 5.0 .. 62.5 K
    q = mass * C_WATER * dt
    return Variant(
        template_id="thermo.heat_capacity.v1",
        seed=seed,
        prompt=(
            f"A {mass:.0f} g sample of liquid water is warmed by {dt:.1f} K. "
            "Taking the specific heat of water as 4.184 J/(g*K), how much heat "
            "did the water absorb? Report in J to 3 significant figures."
        ),
        key=format_sig_figs(q, 3),
        node="GEN1.HEATCAPACITY",
        grader="numeric",
        meta={
            "unit": "J",
            "value": q,
            "mass_g": mass,
            "delta_t_K": dt,
            "sig_figs": 3,
            "constant_source": _C_WATER_SOURCE,
        },
    )


def ver_heat_capacity(v: Variant) -> VerifierResult:
    # Independent route: additivity over sub-intervals. Heat the sample in two
    # unequal stages that meet at the same endpoint; the total must equal the
    # single-stage answer. This exercises the linearity of q in dT rather than
    # recomputing m*c*dT.
    m = v.meta["mass_g"]
    dt = v.meta["delta_t_K"]
    first = m * C_WATER * (dt * 0.3)
    second = m * C_WATER * (dt * 0.7)
    if not math.isclose(first + second, v.meta["value"], rel_tol=1e-9):
        return VerifierResult(
            False, "two-stage-heating",
            f"two stages give {first + second:.6g} J, one stage gives {v.meta['value']:.6g} J",
        )
    if dt > 0 and v.meta["value"] <= 0:
        return VerifierResult(False, "two-stage-heating", "warming a sample released heat")
    return VerifierResult(
        True, "two-stage-heating", f"{v.meta['value']:.4g} J confirmed by staged heating"
    )


# ---------------------------------------------------------------------------
# 2. calorimetry, final temperature  (GEN1.CALORIMETRY)
# ---------------------------------------------------------------------------


def gen_calorimetry(seed: int) -> Variant:
    metal, c_metal = METALS[seed % len(METALS)]
    m_metal = 20.0 + (seed % 8) * 10.0        # 20 .. 90 g
    m_water = 100.0 + (seed % 5) * 25.0       # 100 .. 200 g
    t_metal = 90.0 + (seed % 3) * 5.0         # 90 .. 100 C
    t_water = 20.0 + (seed % 4) * 1.5         # 20.0 .. 24.5 C
    # Weighted average of the two starting temperatures by heat capacity. The
    # verifier never uses this expression; it checks conservation instead.
    num = m_metal * c_metal * t_metal + m_water * C_WATER * t_water
    den = m_metal * c_metal + m_water * C_WATER
    t_final = num / den
    return Variant(
        template_id="thermo.calorimetry.v1",
        seed=seed,
        prompt=(
            f"A {m_metal:.0f} g piece of {metal} at {t_metal:.1f} C, with specific "
            f"heat {c_metal} J/(g*K), is dropped into {m_water:.0f} g of water at "
            f"{t_water:.1f} C in an insulated cup. Taking the specific heat of "
            "water as 4.184 J/(g*K) and assuming no heat escapes and none is "
            "absorbed by the cup, what final temperature do they reach? Report "
            "in C to 3 significant figures."
        ),
        key=format_sig_figs(t_final, 3),
        node="GEN1.CALORIMETRY",
        grader="numeric",
        meta={
            "unit": "C",
            "value": t_final,
            "m_metal_g": m_metal,
            "c_metal": c_metal,
            "t_metal_C": t_metal,
            "m_water_g": m_water,
            "t_water_C": t_water,
            "sig_figs": 3,
            "constant_source": _C_WATER_SOURCE,
        },
    )


def ver_calorimetry(v: Variant) -> VerifierResult:
    # Independent route: conservation. At the true final temperature the heat
    # lost by the metal and the heat gained by the water must cancel. The
    # generator solved a weighted average and never formed either q.
    tf = v.meta["value"]
    q_metal = v.meta["m_metal_g"] * v.meta["c_metal"] * (tf - v.meta["t_metal_C"])
    q_water = v.meta["m_water_g"] * C_WATER * (tf - v.meta["t_water_C"])
    total = q_metal + q_water
    scale = max(abs(q_metal), abs(q_water), 1.0)
    if abs(total) / scale > 1e-9:
        return VerifierResult(
            False, "energy-conservation",
            f"heats do not cancel: metal {q_metal:.6g} J, water {q_water:.6g} J",
        )
    # And the answer must lie between the two starting temperatures, which any
    # sign error or swapped mass would violate.
    lo, hi = sorted((v.meta["t_metal_C"], v.meta["t_water_C"]))
    if not lo < tf < hi:
        return VerifierResult(
            False, "energy-conservation", f"final {tf:.4g} C is outside {lo:.4g}..{hi:.4g} C"
        )
    return VerifierResult(
        True, "energy-conservation", f"{tf:.4g} C makes the two heats cancel exactly"
    )


# ---------------------------------------------------------------------------
# 3. enthalpy of reaction for an amount  (GEN1.ENTHALPY)
# ---------------------------------------------------------------------------


def gen_enthalpy(seed: int) -> Variant:
    dh_molar = -(40.0 + (seed % 30) * 8.0)     # -40 .. -272 kJ per mol
    moles = round(0.25 + (seed % 12) * 0.25, 2)
    total = dh_molar * moles
    return Variant(
        template_id="thermo.enthalpy_amount.v1",
        seed=seed,
        prompt=(
            f"A reaction releases {abs(dh_molar):.0f} kJ for every mole of fuel "
            f"burned, so dH = {dh_molar:.0f} kJ/mol. How much heat is released "
            f"when {moles} mol of the fuel burns? Report dH in kJ to 3 "
            "significant figures, keeping the sign."
        ),
        key=format_sig_figs(total, 3),
        node="GEN1.ENTHALPY",
        grader="numeric",
        meta={
            "unit": "kJ",
            "value": total,
            "dh_molar_kJ": dh_molar,
            "moles": moles,
            "sig_figs": 3,
            "constant_source": _STATE_FUNCTION_SOURCE,
        },
    )


def ver_enthalpy(v: Variant) -> VerifierResult:
    # Independent route: recover the amount from the total and check it round
    # trips, then confirm the sign survived. A learner who drops the sign gets
    # an answer that fails the second half without failing the first.
    recovered = v.meta["value"] / v.meta["dh_molar_kJ"]
    if not math.isclose(recovered, v.meta["moles"], rel_tol=1e-9):
        return VerifierResult(
            False, "amount-round-trip",
            f"the total implies {recovered:.6g} mol, the problem gives {v.meta['moles']}",
        )
    if v.meta["value"] >= 0:
        return VerifierResult(
            False, "amount-round-trip", "an exothermic reaction was keyed with dH >= 0"
        )
    return VerifierResult(
        True, "amount-round-trip", f"{v.meta['value']:.4g} kJ recovers {recovered:.4g} mol"
    )


# ---------------------------------------------------------------------------
# 4. thermochemical equation, heat from a mass  (GEN1.THERMOSTOICH)
# ---------------------------------------------------------------------------


def gen_thermostoich(seed: int) -> Variant:
    dh_per_mol = -(30.0 + (seed % 20) * 6.0)   # -30 .. -144 kJ per mol of water
    grams = 5.0 + (seed % 18) * 2.5            # 5.0 .. 47.5 g
    moles = grams / M_WATER
    total = dh_per_mol * moles
    return Variant(
        template_id="thermo.thermostoich.v1",
        seed=seed,
        prompt=(
            "For the thermochemical equation\n"
            f"    A(g) + B(g) -> H2O(l),  dH = {dh_per_mol:.0f} kJ\n"
            "where the equation is written to produce one mole of water, how "
            f"much heat is released when {grams:.1f} g of water forms? Take "
            "M(H2O) = 18.02 g/mol. Report dH in kJ to 3 significant figures, "
            "keeping the sign."
        ),
        key=format_sig_figs(total, 3),
        node="GEN1.THERMOSTOICH",
        grader="numeric",
        meta={
            "unit": "kJ",
            "value": total,
            "dh_per_mol_kJ": dh_per_mol,
            "grams": grams,
            "moles": moles,
            "sig_figs": 3,
            "constant_source": f"{_M_WATER_SOURCE}; {_STATE_FUNCTION_SOURCE}",
        },
    )


def ver_thermostoich(v: Variant) -> VerifierResult:
    # Independent route: go back the other way. Turn the keyed heat into moles,
    # then moles into grams, and require the original mass. The generator went
    # grams -> moles -> heat, so this traverses the same chain in reverse and
    # fails on an inverted molar mass, which is the classic error here.
    moles_back = v.meta["value"] / v.meta["dh_per_mol_kJ"]
    grams_back = moles_back * M_WATER
    if not math.isclose(grams_back, v.meta["grams"], rel_tol=1e-9):
        return VerifierResult(
            False, "mass-round-trip",
            f"the keyed heat implies {grams_back:.6g} g, the problem gives {v.meta['grams']:.6g} g",
        )
    return VerifierResult(
        True, "mass-round-trip", f"{v.meta['value']:.4g} kJ round trips to {grams_back:.4g} g"
    )


# ---------------------------------------------------------------------------
# 5. Hess's law, two steps  (GEN1.HESS)
# ---------------------------------------------------------------------------


def gen_hess(seed: int) -> Variant:
    dh1 = -(50.0 + (seed % 15) * 10.0)         # -50 .. -190 kJ
    dh2 = 20.0 + (seed % 11) * 15.0            # +20 .. +170 kJ
    # The target is step 1 plus the REVERSE of step 2, so the learner has to
    # negate before adding rather than adding what is in front of them.
    target = dh1 - dh2
    return Variant(
        template_id="thermo.hess.v1",
        seed=seed,
        prompt=(
            "Two steps are measured:\n"
            f"    Step 1:  X -> Y,   dH1 = {dh1:.0f} kJ\n"
            f"    Step 2:  Z -> Y,   dH2 = {dh2:.0f} kJ\n"
            "Use Hess's law to find dH for  X -> Z. Report in kJ to 3 "
            "significant figures, keeping the sign."
        ),
        key=format_sig_figs(target, 3),
        node="GEN1.HESS",
        grader="numeric",
        meta={
            "unit": "kJ",
            "value": target,
            "dh1_kJ": dh1,
            "dh2_kJ": dh2,
            "sig_figs": 3,
            "constant_source": _STATE_FUNCTION_SOURCE,
        },
    )


def ver_hess(v: Variant) -> VerifierResult:
    # Independent route: close the loop. X -> Z -> Y must equal X -> Y, because
    # enthalpy is a state function and a cycle returning to the same state sums
    # to zero. The generator formed dh1 - dh2 directly and never built the loop.
    dh1, dh2, target = v.meta["dh1_kJ"], v.meta["dh2_kJ"], v.meta["value"]
    loop = target + dh2 - dh1          # X->Z, Z->Y, then back Y->X
    if abs(loop) > 1e-9 * max(abs(dh1), abs(dh2), 1.0):
        return VerifierResult(
            False, "closed-cycle", f"the cycle X->Z->Y->X sums to {loop:.6g} kJ, not zero"
        )
    # And reversing the target must negate it, which a learner who forgot to
    # reverse step 2 would not reproduce.
    if not math.isclose(-target, dh2 - dh1, rel_tol=1e-9):
        return VerifierResult(False, "closed-cycle", "reversing the target does not negate it")
    return VerifierResult(True, "closed-cycle", f"{target:.4g} kJ closes the cycle to zero")


# ---------------------------------------------------------------------------
# 6. enthalpy of reaction from formation enthalpies  (GEN1.FORMATION)
# ---------------------------------------------------------------------------


def gen_formation(seed: int) -> Variant:
    # Given data, synthesised from the seed. A + 2 B -> C + D.
    hf_a = -(10.0 + (seed % 9) * 12.0)
    hf_b = 0.0                                   # B is an element in its standard state
    hf_c = -(80.0 + (seed % 7) * 15.0)
    hf_d = -(20.0 + (seed % 5) * 11.0)
    dh = (hf_c + hf_d) - (hf_a + 2 * hf_b)
    return Variant(
        template_id="thermo.formation.v1",
        seed=seed,
        prompt=(
            "For the reaction  A(g) + 2 B(g) -> C(g) + D(g), the standard "
            "enthalpies of formation are given as\n"
            f"    dHf(A) = {hf_a:.0f} kJ/mol\n"
            f"    dHf(B) = {hf_b:.0f} kJ/mol   (B is an element in its standard state)\n"
            f"    dHf(C) = {hf_c:.0f} kJ/mol\n"
            f"    dHf(D) = {hf_d:.0f} kJ/mol\n"
            "What is dH for the reaction? Report in kJ to 3 significant "
            "figures, keeping the sign."
        ),
        key=format_sig_figs(dh, 3),
        node="GEN1.FORMATION",
        grader="numeric",
        meta={
            "unit": "kJ",
            "value": dh,
            "hf_a": hf_a,
            "hf_b": hf_b,
            "hf_c": hf_c,
            "hf_d": hf_d,
            "sig_figs": 3,
            "constant_source": _STATE_FUNCTION_SOURCE,
        },
    )


def ver_formation(v: Variant) -> VerifierResult:
    # Independent route: traverse the cycle the other way. Decomposing the
    # products to elements and assembling the reactants from them is the
    # reverse reaction, and must give exactly the negative. The generator
    # formed products-minus-reactants once; this forms the opposite difference
    # and requires the sum of the two to vanish.
    reverse = (v.meta["hf_a"] + 2 * v.meta["hf_b"]) - (v.meta["hf_c"] + v.meta["hf_d"])
    if abs(reverse + v.meta["value"]) > 1e-9 * max(abs(v.meta["value"]), 1.0):
        return VerifierResult(
            False, "reverse-cycle",
            f"forward {v.meta['value']:.6g} and reverse {reverse:.6g} kJ do not cancel",
        )
    # An element in its standard state has dHf = 0 by definition. If that ever
    # stops being true in the generated data the item is teaching a falsehood.
    if v.meta["hf_b"] != 0.0:
        return VerifierResult(
            False, "reverse-cycle", "B is described as an element in its standard state but dHf is not 0"
        )
    return VerifierResult(
        True, "reverse-cycle", f"forward and reverse cancel at {v.meta['value']:.4g} kJ"
    )


# ---------------------------------------------------------------------------
# 7. bond enthalpies  (GEN1.BONDENTHALPY)
# ---------------------------------------------------------------------------


def gen_bond_enthalpy(seed: int) -> Variant:
    # The net enthalpy is chosen first and one bond is back-solved from it,
    # rather than picking four values independently and seeing what falls out.
    #
    # Picking four independently is what this did at first, and a seed sweep
    # found that seeds 6 and 34 happened to make the two sums equal, so dH came
    # out exactly 0. That fails twice over: an estimate of exactly zero is a
    # strange thing to ask a learner to compute, and zero has no meaningful
    # significant figure count, so format_sig_figs(0.0, 3) returns "0.00" and
    # the numeric grader reads it as one figure and rejects the item's own key.
    # Deriving the fourth value guarantees a nonzero answer for every seed and
    # keeps all four bond enthalpies inside a plausible range.
    formed_1 = 440.0 + (seed % 6) * 12.0        # 440 .. 500
    formed_2 = 350.0 + (seed % 8) * 11.0        # 350 .. 427
    broken_1 = 340.0 + (seed % 9) * 12.0        # 340 .. 436
    dh = (24.0 + (seed % 8) * 11.0) * (1 if seed % 2 == 0 else -1)   # +-24 .. +-101
    broken_2 = formed_1 + formed_2 + dh - broken_1                   # 253 .. 688
    return Variant(
        template_id="thermo.bond_enthalpy.v1",
        seed=seed,
        prompt=(
            "In a gas phase reaction, one P-Q bond and one R-S bond are broken, "
            "and one P-S bond and one R-Q bond are formed. The average bond "
            "enthalpies are given as\n"
            f"    P-Q  {broken_1:.0f} kJ/mol      R-S  {broken_2:.0f} kJ/mol\n"
            f"    P-S  {formed_1:.0f} kJ/mol      R-Q  {formed_2:.0f} kJ/mol\n"
            "Estimate dH for the reaction. Report in kJ to 3 significant "
            "figures, keeping the sign."
        ),
        key=format_sig_figs(dh, 3),
        node="GEN1.BONDENTHALPY",
        grader="numeric",
        meta={
            "unit": "kJ",
            "value": dh,
            "broken": [broken_1, broken_2],
            "formed": [formed_1, formed_2],
            "sig_figs": 3,
            "constant_source": (
                "Bond enthalpies are given problem data. The bookkeeping rule "
                "dH = sum(broken) - sum(formed) follows from breaking every bond "
                "to atoms and reforming them (Atkins Physical Chemistry)"
            ),
        },
    )


def ver_bond_enthalpy(v: Variant) -> VerifierResult:
    # Independent route: run the reaction backwards. What was broken is now
    # formed and vice versa, so the reverse estimate must be exactly the
    # negative. A learner who computes formed-minus-broken gets the reverse
    # reaction's answer, which is precisely what this catches.
    reverse = sum(v.meta["formed"]) - sum(v.meta["broken"])
    if abs(reverse + v.meta["value"]) > 1e-9 * max(abs(v.meta["value"]), 1.0):
        return VerifierResult(
            False, "reverse-reaction",
            f"forward {v.meta['value']:.6g} and reverse {reverse:.6g} kJ do not cancel",
        )
    # Breaking bonds always costs energy and forming them always releases it.
    # If the generated data ever inverted that, the item would be nonsense.
    if any(b <= 0 for b in v.meta["broken"] + v.meta["formed"]):
        return VerifierResult(False, "reverse-reaction", "a bond enthalpy is not positive")
    # Zero is not a askable answer here: it makes the item degenerate, and it
    # has no significant figure count, so the key cannot satisfy the numeric
    # grader. A seed sweep found this before the back-solved generator above.
    if v.meta["value"] == 0:
        return VerifierResult(
            False, "reverse-reaction", "the two sums cancel, so dH is exactly zero"
        )
    return VerifierResult(
        True, "reverse-reaction", f"forward and reverse cancel at {v.meta['value']:.4g} kJ"
    )


# ---------------------------------------------------------------------------
# 8. first law, sign convention  (GEN1.FIRSTLAW)
# ---------------------------------------------------------------------------


def gen_first_law(seed: int) -> Variant:
    q = (60.0 + (seed % 14) * 15.0) * (1 if seed % 2 == 0 else -1)
    w = (25.0 + (seed % 9) * 20.0) * (-1 if seed % 3 else 1)
    du = q + w
    q_words = "absorbs" if q > 0 else "releases"
    w_words = (
        f"does {abs(w):.0f} J of work on its surroundings"
        if w < 0
        else f"has {abs(w):.0f} J of work done on it by its surroundings"
    )
    return Variant(
        template_id="thermo.first_law.v1",
        seed=seed,
        prompt=(
            f"A closed system {q_words} {abs(q):.0f} J of heat and {w_words}. "
            "Using dU = q + w, with q positive when heat enters the system and "
            "w positive when work is done on the system, what is the change in "
            "internal energy? Report in J to 3 significant figures, keeping the "
            "sign."
        ),
        key=format_sig_figs(du, 3),
        node="GEN1.FIRSTLAW",
        grader="numeric",
        meta={
            "unit": "J",
            "value": du,
            "q_J": q,
            "w_J": w,
            "sig_figs": 3,
            "constant_source": _FIRST_LAW_SOURCE,
        },
    )


def ver_first_law(v: Variant) -> VerifierResult:
    # Independent route: internal energy is a state function, so running the
    # process and then its exact reverse must return the system to where it
    # started. The generator added q and w once; this requires the forward and
    # reverse changes to annihilate, which fails on any sign convention error.
    forward = v.meta["value"]
    reverse = (-v.meta["q_J"]) + (-v.meta["w_J"])
    if abs(forward + reverse) > 1e-9 * max(abs(forward), 1.0):
        return VerifierResult(
            False, "reverse-process",
            f"forward {forward:.6g} J and reverse {reverse:.6g} J do not return to the start",
        )
    return VerifierResult(
        True, "reverse-process", f"dU = {forward:.4g} J is undone exactly by the reverse process"
    )


# ---------------------------------------------------------------------------
# 9. heat is not temperature, multiple choice  (GEN1.ENERGYBASICS)
# ---------------------------------------------------------------------------


def gen_energy_basics(seed: int) -> Variant:
    q = 2000.0 + (seed % 10) * 500.0     # the SAME heat into both samples
    m_small = 50.0 + (seed % 4) * 10.0
    m_large = m_small * (2 + seed % 3)
    dt_small = q / (m_small * C_WATER)
    dt_large = q / (m_large * C_WATER)

    # The key is the statement that survives the arithmetic. The distractors
    # are the two beliefs this item exists to separate: that equal heat means
    # equal temperature change, and that the bigger sample must get hotter
    # because it received the same energy.
    choices = [
        {
            "index": 0,
            "text": (
                "Both samples rise by the same number of degrees, because they "
                "were given the same amount of heat."
            ),
            "misconception": "THERMO-HEAT-IS-TEMPERATURE",
        },
        {
            "index": 1,
            "text": (
                f"The {m_small:.0f} g sample rises by more degrees, because the "
                "same heat is spread over less mass."
            ),
            "misconception": None,
        },
        {
            "index": 2,
            "text": (
                f"The {m_large:.0f} g sample rises by more degrees, because it "
                "holds more total energy."
            ),
            "misconception": "THERMO-MORE-MASS-MORE-RISE",
        },
    ]
    return Variant(
        template_id="thermo.energy_basics.v1",
        seed=seed,
        prompt=(
            f"{q:.0f} J of heat is added to a {m_small:.0f} g sample of water "
            f"and the same {q:.0f} J is added to a {m_large:.0f} g sample of "
            "water. Neither boils. Which statement about their temperature "
            "changes is correct?"
        ),
        key="1",
        node="GEN1.ENERGYBASICS",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": 1,
            "q_J": q,
            "m_small_g": m_small,
            "m_large_g": m_large,
            "dt_small_K": dt_small,
            "dt_large_K": dt_large,
            "constant_source": _C_WATER_SOURCE,
        },
    )


def ver_energy_basics(v: Variant) -> VerifierResult:
    # Independent route: do not trust the keyed index, compute both temperature
    # changes from q = m c dT and see which statement the numbers actually
    # support. Then check the item works as a diagnostic.
    small = v.meta["q_J"] / (v.meta["m_small_g"] * C_WATER)
    large = v.meta["q_J"] / (v.meta["m_large_g"] * C_WATER)
    if math.isclose(small, large, rel_tol=1e-9):
        return VerifierResult(
            False, "computed-from-data", "the two samples happen to give the same rise"
        )
    supported = 1 if small > large else 2
    if supported != v.meta["correct_index"]:
        return VerifierResult(
            False, "computed-from-data",
            f"the data support choice {supported}, the key says {v.meta['correct_index']}",
        )
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, "computed-from-data", "; ".join(problems))
    return VerifierResult(
        True, "computed-from-data",
        f"dT is {small:.3g} K and {large:.3g} K, so the smaller sample rises more",
    )


# ---------------------------------------------------------------------------
# Registration data
# ---------------------------------------------------------------------------

TEMPLATES_G1_U5: dict[str, dict[str, object]] = {
    "thermo.heat_capacity.v1": {
        "gen": gen_heat_capacity, "ver": ver_heat_capacity,
        "node": "GEN1.HEATCAPACITY", "grader": "numeric",
    },
    "thermo.calorimetry.v1": {
        "gen": gen_calorimetry, "ver": ver_calorimetry,
        "node": "GEN1.CALORIMETRY", "grader": "numeric",
    },
    "thermo.enthalpy_amount.v1": {
        "gen": gen_enthalpy, "ver": ver_enthalpy,
        "node": "GEN1.ENTHALPY", "grader": "numeric",
    },
    "thermo.thermostoich.v1": {
        "gen": gen_thermostoich, "ver": ver_thermostoich,
        "node": "GEN1.THERMOSTOICH", "grader": "numeric",
    },
    "thermo.hess.v1": {
        "gen": gen_hess, "ver": ver_hess,
        "node": "GEN1.HESS", "grader": "numeric",
    },
    "thermo.formation.v1": {
        "gen": gen_formation, "ver": ver_formation,
        "node": "GEN1.FORMATION", "grader": "numeric",
    },
    "thermo.bond_enthalpy.v1": {
        "gen": gen_bond_enthalpy, "ver": ver_bond_enthalpy,
        "node": "GEN1.BONDENTHALPY", "grader": "numeric",
    },
    "thermo.first_law.v1": {
        "gen": gen_first_law, "ver": ver_first_law,
        "node": "GEN1.FIRSTLAW", "grader": "numeric",
    },
    "thermo.energy_basics.v1": {
        "gen": gen_energy_basics, "ver": ver_energy_basics,
        "node": "GEN1.ENERGYBASICS", "grader": "mc",
    },
}


HINTS_G1_U5: dict[str, tuple[str, str, str]] = {
    "thermo.heat_capacity.v1": (
        "You are asked how much energy it took to warm this water, given how "
        "heavy it is and how far its temperature moved.",
        "Specific heat is the energy needed to raise one gram by one kelvin, so "
        "it has to be multiplied by both how many grams there are and how many "
        "kelvin the temperature moved.",
        "Write down the three numbers you are multiplying, in the order mass, "
        "specific heat, temperature change, and stop before multiplying.",
    ),
    "thermo.calorimetry.v1": (
        "Nothing leaves the cup, so whatever energy the hot metal loses has to "
        "end up in the water. Both finish at the same temperature.",
        "Write the heat lost by the metal and the heat gained by the water, each "
        "as m times c times the change in temperature, using the SAME unknown "
        "final temperature in both. Their sum is zero.",
        "You now have one equation with one unknown. Collect the terms in the "
        "final temperature on one side, and stop before dividing.",
    ),
    "thermo.enthalpy_amount.v1": (
        "You are told the heat for one mole and asked for the heat for a "
        "different number of moles.",
        "Enthalpy of reaction scales with how much reacts, so this is one "
        "multiplication. The sign travels with it: releasing heat stays negative "
        "however much you burn.",
        "Multiply the per-mole value by the number of moles, and keep the minus "
        "sign in front while you do it.",
    ),
    "thermo.thermostoich.v1": (
        "The equation gives heat per mole of water, and you have been given "
        "grams of water. Those are not the same currency.",
        "Convert the mass to moles first, using the molar mass, then multiply by "
        "the heat per mole. Doing it in the other order, or multiplying by the "
        "molar mass instead of dividing, is the usual slip.",
        "Divide the grams by 18.02 to get moles, and stop there before "
        "multiplying by the enthalpy.",
    ),
    "thermo.hess.v1": (
        "You want X to Z, and you have been given X to Y and Z to Y. One of "
        "those points the wrong way.",
        "Reverse the step that ends where you want to begin. Reversing a step "
        "flips the sign of its enthalpy, because enthalpy is a state function "
        "and going back undoes exactly what going forward did.",
        "Write step 2 backwards as Y to Z with its sign flipped, then add it to "
        "step 1, and stop before adding.",
    ),
    "thermo.formation.v1": (
        "Formation enthalpies let you build every substance from its elements, "
        "so you can go from reactants down to elements and back up to products.",
        "The reaction enthalpy is the total for the products minus the total for "
        "the reactants, and each formation enthalpy is multiplied by how many "
        "moles of that substance appear in the equation.",
        "Write the products sum and the reactants sum separately, remembering "
        "the 2 in front of B, and stop before subtracting.",
    ),
    "thermo.bond_enthalpy.v1": (
        "Breaking a bond costs energy and making one gives energy back. The "
        "reaction is a trade between the two.",
        "Add up everything broken, add up everything formed, and subtract the "
        "formed total from the broken total. Doing it the other way round gives "
        "you the reverse reaction's answer.",
        "Write the two sums down, broken first, and stop before subtracting.",
    ),
    "thermo.first_law.v1": (
        "Two things changed the system's energy here: heat crossed the boundary, "
        "and work was done. The first law just adds them.",
        "Get each sign from the wording before you add anything. Heat entering "
        "is positive, heat leaving is negative; work done ON the system is "
        "positive, work done BY the system is negative.",
        "Write q and w with their signs on the page, then stop before adding "
        "them.",
    ),
    "thermo.energy_basics.v1": (
        "The same amount of energy went into both samples. The question is "
        "whether that means the same temperature change.",
        "Heat and temperature are not the same quantity. Rearrange q = m c dT "
        "for dT and look at what mass does when q and c are held fixed.",
        "dT is q divided by m times c. With q the same for both, compare the "
        "two masses in the denominator.",
    ),
}


# Both of these are beliefs learners state out loud, and neither is traced to a
# published study, so they say so rather than borrowing authority from the
# literature this library otherwise cites. review stays "pending" until a named
# expert signs off through the review ledger.
_OBSERVED = "Instructor observation; not traced to a published study"

MISCONCEPTIONS_G1_U5: dict[str, Misconception] = {
    m.code: m
    for m in [
        Misconception(
            code="THERMO-HEAT-IS-TEMPERATURE",
            name="Equal heat means equal temperature change",
            description=(
                "The learner treats heat and temperature as the same quantity, so "
                "putting the same joules into two samples must move both by the "
                "same number of degrees."
            ),
            counterexample=(
                "The same 2000 J raises 50 g of water by about 9.6 K and 200 g of "
                "the same water by about 2.4 K. Same energy in, different rise."
            ),
            routes_to="GEN1.ENERGYBASICS",
            source=_OBSERVED,
        ),
        Misconception(
            code="THERMO-MORE-MASS-MORE-RISE",
            name="The larger sample must get hotter",
            description=(
                "The learner reasons that the bigger sample now holds more total "
                "energy, and concludes its temperature must therefore have risen "
                "further, confusing the energy contained with the temperature "
                "reached."
            ),
            counterexample=(
                "Both samples received the same 2000 J, so neither holds more "
                "added energy than the other. The larger mass spreads it thinner, "
                "so it warms less."
            ),
            routes_to="GEN1.ENERGYBASICS",
            source=_OBSERVED,
        ),
    ]
}
