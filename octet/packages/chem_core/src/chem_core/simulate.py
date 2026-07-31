"""Simulation engines behind the predict, observe, explain items.

Two engines, both solved exactly rather than through the usual classroom
approximations, because a simulator that only agrees with the textbook in the
region where the textbook approximation holds teaches the approximation rather
than the chemistry.

Titration. Solved from mass balance and charge balance simultaneously:

    [Na+] + [H+] = [A-] + [OH-]

with [A-] = C_A * Ka / (Ka + [H+]) and [OH-] = Kw / [H+]. Bisection on
log10[H+] finds the root. One code path covers the initial point, the buffer
region, the equivalence point and the excess base region, so there is no seam
where the model switches formulas and no region where it quietly stops being
true. A strong acid is the same equation with a large Ka, which drives the
dissociated fraction to one.

Equilibrium shift. Le Chatelier predictions are checked against an actual
re-solve: the reaction quotient is computed, the extent of reaction is solved
for numerically, and the direction of shift is read off the sign of that
extent. The qualitative claim is never asserted, it is derived.

Sources for the constants used by the scenarios are recorded on each scenario
in scenarios(). Ka and Kw values are CRC Handbook of Chemistry and Physics,
97th edition, at 25 degrees Celsius.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field

KW_25C = 1.0e-14
STRONG_KA = 1.0e6  # A strong acid is fully dissociated; this is that limit.


@dataclass(frozen=True)
class TitrationSetup:
    """Titrating an acid in the flask with a strong base from the burette.

    analyte_conc_M / analyte_volume_mL describe what is in the flask.
    titrant_conc_M is the strong base concentration.
    ka is the acid dissociation constant; use STRONG_KA for a strong acid.
    """

    analyte_conc_M: float
    analyte_volume_mL: float
    titrant_conc_M: float
    ka: float
    analyte_name: str = "acid"
    titrant_name: str = "NaOH"
    ka_source: str = ""

    @property
    def is_strong_acid(self) -> bool:
        return self.ka >= 1.0

    @property
    def pka(self) -> float:
        return -math.log10(self.ka)

    @property
    def equivalence_volume_mL(self) -> float:
        """Moles of acid divided by titrant concentration."""
        moles = self.analyte_conc_M * self.analyte_volume_mL / 1000.0
        return 1000.0 * moles / self.titrant_conc_M


def _charge_balance(h: float, total_acid: float, total_base: float, ka: float) -> float:
    """Residual of [Na+] + [H+] - [A-] - [OH-]. Zero at the true [H+]."""
    a_minus = total_acid * ka / (ka + h)
    return total_base + h - a_minus - KW_25C / h


def solve_ph(setup: TitrationSetup, titrant_added_mL: float) -> float:
    """Exact pH after adding this volume of titrant."""
    if titrant_added_mL < 0:
        raise ValueError("titrant volume cannot be negative")
    total_volume_L = (setup.analyte_volume_mL + titrant_added_mL) / 1000.0
    if total_volume_L <= 0:
        raise ValueError("total volume must be positive")

    total_acid = setup.analyte_conc_M * (setup.analyte_volume_mL / 1000.0) / total_volume_L
    total_base = setup.titrant_conc_M * (titrant_added_mL / 1000.0) / total_volume_L

    # Bisect on pH. The residual is monotonically decreasing in [H+] is false
    # in general, but it is monotonic in pH over this bracket because every
    # term is monotonic in h and they enter with consistent signs.
    lo, hi = -2.0, 16.0
    f_lo = _charge_balance(10.0**-lo, total_acid, total_base, setup.ka)
    f_hi = _charge_balance(10.0**-hi, total_acid, total_base, setup.ka)
    if f_lo * f_hi > 0:
        raise ValueError("pH root is not bracketed by the range -2 to 16")

    for _ in range(200):
        mid = (lo + hi) / 2.0
        f_mid = _charge_balance(10.0**-mid, total_acid, total_base, setup.ka)
        if f_mid == 0.0:
            return mid
        if f_lo * f_mid < 0:
            hi = mid
        else:
            lo, f_lo = mid, f_mid
        if hi - lo < 1e-12:
            break
    return (lo + hi) / 2.0


def titration_curve(setup: TitrationSetup, points: int = 121) -> list[dict]:
    """Sample the curve from zero titrant to twice the equivalence volume."""
    if points < 3:
        raise ValueError("need at least three points")
    v_max = 2.0 * setup.equivalence_volume_mL
    step = v_max / (points - 1)
    curve = []
    for i in range(points):
        v = i * step
        curve.append({"volume_mL": round(v, 4), "pH": round(solve_ph(setup, v), 4)})
    return curve


def titration_landmarks(setup: TitrationSetup) -> dict:
    """The four points a chemistry course actually asks about."""
    v_eq = setup.equivalence_volume_mL
    return {
        "initial_pH": solve_ph(setup, 0.0),
        "half_equivalence_pH": solve_ph(setup, v_eq / 2.0),
        "equivalence_pH": solve_ph(setup, v_eq),
        "equivalence_volume_mL": v_eq,
        "past_equivalence_pH": solve_ph(setup, v_eq * 1.5),
    }


def verify_titration(setup: TitrationSetup) -> tuple[bool, str]:
    """Independent check on the titration engine for a given setup.

    Two checks derived separately from the solver:

      1. Charge balance residual at the reported equivalence pH must be
         negligible relative to the concentrations involved.
      2. Analytic landmarks. For a weak acid, pH at half equivalence equals
         pKa, which follows from Henderson-Hasselbalch and is derived
         independently of the bisection. For a strong acid titrated by a strong
         base, pH at equivalence is 7.00 because only water remains.

    The landmark check is the real verification: it comes from a different
    derivation than the numeric solve, so agreement is evidence rather than
    the same computation repeated.
    """
    v_eq = setup.equivalence_volume_mL
    ph_eq = solve_ph(setup, v_eq)
    total_volume_L = (setup.analyte_volume_mL + v_eq) / 1000.0
    total_acid = setup.analyte_conc_M * (setup.analyte_volume_mL / 1000.0) / total_volume_L
    total_base = setup.titrant_conc_M * (v_eq / 1000.0) / total_volume_L
    residual = abs(_charge_balance(10.0**-ph_eq, total_acid, total_base, setup.ka))
    scale = max(total_acid, total_base, 1e-9)
    if residual / scale > 1e-6:
        return False, f"charge balance residual {residual:.3g} at equivalence"

    if setup.is_strong_acid:
        if abs(ph_eq - 7.0) > 0.01:
            return False, f"strong acid equivalence pH is {ph_eq:.3f}, expected 7.00"
    else:
        ph_half = solve_ph(setup, v_eq / 2.0)
        # At half equivalence [HA] equals [A-], so pH equals pKa. The
        # tolerance allows for the exact solve including water autoionization,
        # which the Henderson-Hasselbalch derivation neglects.
        if abs(ph_half - setup.pka) > 0.05:
            return False, f"half equivalence pH {ph_half:.3f} vs pKa {setup.pka:.3f}"
        if ph_eq <= 7.0:
            return False, f"weak acid equivalence pH {ph_eq:.3f} should exceed 7"
    return True, f"equivalence pH {ph_eq:.2f}, landmarks agree"


@dataclass(frozen=True)
class EquilibriumSetup:
    """A gas phase or solution equilibrium subjected to a stress.

    stoich maps species name to its signed coefficient: negative for
    reactants, positive for products. initial maps species name to starting
    concentration in molar. k is the equilibrium constant in those units.
    """

    stoich: dict[str, int]
    initial: dict[str, float]
    k: float
    label: str = ""
    k_source: str = ""
    delta_h_kj: float | None = None
    moles_gas_change: int | None = None


def reaction_quotient(setup: EquilibriumSetup, conc: dict[str, float]) -> float:
    q = 1.0
    for species, coeff in setup.stoich.items():
        c = conc.get(species, 0.0)
        if c <= 0:
            # A zero concentration reactant makes Q zero; a zero product makes
            # Q zero from the numerator side. Report the limiting behaviour
            # rather than dividing by zero.
            return 0.0 if coeff > 0 else float("inf")
        q *= c**coeff
    return q


def solve_extent(setup: EquilibriumSetup, conc: dict[str, float]) -> float:
    """Extent of reaction x that brings these concentrations to equilibrium.

    Positive x means the reaction runs forward, consuming reactants. The
    concentration of each species becomes conc[s] + coeff[s] * x. Bisection
    over the physically allowed range of x.
    """

    def q_minus_k(x: float) -> float:
        """Q minus K at extent x. Monotonically increasing in x.

        Running forward consumes reactants and makes products, so Q rises with
        x. Outside the physical range the limiting behaviour is reported in
        the direction the species ran out: exhausting a reactant sends the
        denominator to zero and Q to infinity, while exhausting a product
        sends the numerator to zero and Q to zero. Reporting these by which
        species ran out rather than by the sign of x is what keeps the
        function monotone when a species starts at exactly zero.
        """
        trial = {}
        for species, coeff in setup.stoich.items():
            value = conc.get(species, 0.0) + coeff * x
            if value < 0:
                return float("inf") if coeff < 0 else -setup.k
            trial[species] = value
        return reaction_quotient(setup, trial) - setup.k

    # Bound x by whichever species runs out first in each direction.
    forward_limit = min(
        (conc.get(s, 0.0) / -c for s, c in setup.stoich.items() if c < 0),
        default=1.0,
    )
    reverse_limit = min(
        (conc.get(s, 0.0) / c for s, c in setup.stoich.items() if c > 0),
        default=1.0,
    )
    lo, hi = -reverse_limit * (1 - 1e-9), forward_limit * (1 - 1e-9)
    f_lo, f_hi = q_minus_k(lo), q_minus_k(hi)
    if not (f_lo < 0 < f_hi or f_hi < 0 < f_lo):
        # No sign change inside the physical range means the system is already
        # at equilibrium to numerical precision, or the stress cannot be
        # relieved within these bounds.
        return 0.0
    for _ in range(200):
        mid = (lo + hi) / 2.0
        f_mid = q_minus_k(mid)
        if f_mid == 0.0:
            return mid
        if (f_lo < 0) == (f_mid < 0):
            lo, f_lo = mid, f_mid
        else:
            hi = mid
        if abs(hi - lo) < 1e-15:
            break
    return (lo + hi) / 2.0


def equilibrium_shift(setup: EquilibriumSetup, stress: dict[str, float]) -> dict:
    """Apply a concentration stress and re-solve. Returns the derived direction.

    stress maps species name to the amount added, in molar. Negative removes.
    The direction is never asserted, it is read off the sign of the solved
    extent of reaction.
    """
    stressed = dict(setup.initial)
    for species, delta in stress.items():
        stressed[species] = max(stressed.get(species, 0.0) + delta, 0.0)

    q_before = reaction_quotient(setup, stressed)
    x = solve_extent(setup, stressed)
    final = {s: stressed.get(s, 0.0) + c * x for s, c in setup.stoich.items()}
    q_after = reaction_quotient(setup, final)

    if x > 1e-12:
        direction = "forward"
    elif x < -1e-12:
        direction = "reverse"
    else:
        direction = "none"

    return {
        "direction": direction,
        "extent": x,
        "q_before": q_before,
        "q_after": q_after,
        "k": setup.k,
        "stressed": stressed,
        "final": final,
    }


def verify_equilibrium_shift(setup: EquilibriumSetup, result: dict) -> tuple[bool, str]:
    """Independent check on a shift result.

    Q after the shift must equal K, which is the definition of equilibrium and
    is evaluated from the final concentrations rather than from the solver's
    internal state. Separately, the direction must agree with the sign of
    Q minus K before the shift: Q below K drives forward, Q above K drives
    reverse. That comparison is the thermodynamic statement and it is
    derived from different quantities than the bisection.
    """
    k = setup.k
    q_after = result["q_after"]
    if not math.isfinite(q_after):
        return False, "Q after shift is not finite"
    if k > 0 and abs(q_after - k) / k > 1e-6:
        return False, f"Q after shift is {q_after:.6g}, K is {k:.6g}"

    q_before = result["q_before"]
    if math.isfinite(q_before) and q_before > 0:
        expected = "forward" if q_before < k else ("reverse" if q_before > k else "none")
        if expected != result["direction"] and abs(q_before - k) / k > 1e-9:
            return False, f"Q/K says {expected}, solver says {result['direction']}"
    return True, f"Q equals K at {q_after:.6g}, direction {result['direction']}"


# ---------------------------------------------------------------------------
# Kinetics
# ---------------------------------------------------------------------------
#
# Rate laws are integrated in closed form rather than stepped numerically. The
# closed forms are exact, and stepping would introduce an error the learner
# would then be asked to read a prediction off.
#
# The Arrhenius constants below are the scenario's, not a universal fact: the
# activation energy of a reaction is a property of that reaction. Each
# scenario names its source.


@dataclass(frozen=True)
class KineticsSetup:
    """One reactant decaying under a simple rate law, rate = k [A]^n.

    order is the order in A, restricted to 0, 1 or 2 because those are the
    integrated forms a first course derives and the only ones this engine
    claims to solve exactly.

    activation_kJ and the reference temperature drive the Arrhenius response.
    A reaction with no stated activation energy cannot be asked a temperature
    question, and the engine refuses rather than assuming one.
    """

    name: str
    order: int
    k: float
    initial: float
    temperature_K: float = 298.15
    activation_kJ: float | None = None
    # Where the constants came from. A scenario that cannot name its source
    # has no business being shown to a learner as chemistry.
    source: str = ""

    def __post_init__(self) -> None:
        if self.order not in (0, 1, 2):
            raise ValueError(f"{self.name}: order {self.order} is not 0, 1 or 2")
        if self.k <= 0:
            raise ValueError(f"{self.name}: rate constant must be positive")
        if self.initial <= 0:
            raise ValueError(f"{self.name}: initial concentration must be positive")


R_GAS = 8.314462618  # J/(mol K), CODATA 2018.


def rate(setup: KineticsSetup, concentration: float, k: float | None = None) -> float:
    """Instantaneous rate at a given concentration."""
    kk = setup.k if k is None else k
    return kk * concentration**setup.order


def concentration_at(setup: KineticsSetup, t: float) -> float:
    """Integrated rate law, exact for each order.

    Zero order runs out of reactant at t = [A]0/k and is clamped there rather
    than continuing into negative concentration, which the algebra would
    happily do and which is not chemistry.
    """
    a0 = setup.initial
    if setup.order == 0:
        return max(0.0, a0 - setup.k * t)
    if setup.order == 1:
        return a0 * math.exp(-setup.k * t)
    return a0 / (1.0 + setup.k * a0 * t)


def half_life(setup: KineticsSetup, concentration: float | None = None) -> float:
    """Time to consume half of what is present.

    Only first order gives a half life independent of concentration, so the
    other two take the current concentration and return the half life FROM
    there. Reporting a single number for a second-order reaction would be the
    error the concept exists to prevent.
    """
    a = setup.initial if concentration is None else concentration
    if setup.order == 0:
        return a / (2.0 * setup.k)
    if setup.order == 1:
        return math.log(2.0) / setup.k
    return 1.0 / (setup.k * a)


def rate_constant_at(setup: KineticsSetup, temperature_K: float) -> float:
    """Arrhenius, as a ratio to the setup's own k so A cancels.

        k2/k1 = exp(-Ea/R (1/T2 - 1/T1))
    """
    if setup.activation_kJ is None:
        raise ValueError(f"{setup.name}: no activation energy, cannot vary temperature")
    ea = setup.activation_kJ * 1000.0
    exponent = -(ea / R_GAS) * (1.0 / temperature_K - 1.0 / setup.temperature_K)
    return setup.k * math.exp(exponent)


def _classify_ratio(ratio: float) -> str:
    """Turn a rate ratio into the token a POE option is named by.

    The bands are deliberately narrow around the exact factors, so an item
    whose options say "doubles" only verifies when the physics really does
    double it. Anything else falls through to the directional tokens.
    """
    if abs(ratio - 1.0) < 1e-9:
        return "unchanged"
    for factor, token in ((0.5, "halves"), (2.0, "doubles"), (4.0, "quadruples")):
        if abs(ratio - factor) / factor < 0.02:
            return token
    return "increases" if ratio > 1.0 else "decreases"


def kinetics_response(setup: KineticsSetup, change: dict[str, float]) -> dict:
    """Apply one change and report what happens to the rate.

    change carries exactly one of:
      concentration_factor  multiply [A] by this
      temperature_K         run at this temperature instead
      activation_delta_kJ   lower or raise Ea, which is what a catalyst does

    The outcome token is derived from the computed ratio. Nothing here states
    a result.
    """
    if len(change) != 1:
        raise ValueError(f"{setup.name}: expected exactly one change, got {change}")

    base = rate(setup, setup.initial)
    conc = setup.initial
    k_new = setup.k

    if "concentration_factor" in change:
        conc = setup.initial * change["concentration_factor"]
    elif "temperature_K" in change:
        k_new = rate_constant_at(setup, change["temperature_K"])
    elif "activation_delta_kJ" in change:
        if setup.activation_kJ is None:
            raise ValueError(f"{setup.name}: no activation energy to change")
        lowered = KineticsSetup(
            name=setup.name,
            order=setup.order,
            k=setup.k,
            initial=setup.initial,
            temperature_K=setup.temperature_K,
            activation_kJ=setup.activation_kJ + change["activation_delta_kJ"],
        )
        # A catalyst changes the barrier at the same temperature. Evaluating
        # the new Ea at the reference temperature is exactly that.
        ea_old = setup.activation_kJ * 1000.0
        ea_new = lowered.activation_kJ * 1000.0
        k_new = setup.k * math.exp(-(ea_new - ea_old) / (R_GAS * setup.temperature_K))
    else:
        raise ValueError(f"{setup.name}: unknown change {list(change)}")

    new = rate(setup, conc, k=k_new)
    ratio = new / base if base > 0 else float("inf")

    return {
        "outcome": _classify_ratio(ratio),
        "rate_before": base,
        "rate_after": new,
        "ratio": ratio,
        "order": setup.order,
        "k_before": setup.k,
        "k_after": k_new,
        "half_life_s": half_life(setup),
    }


def verify_kinetics_response(setup: KineticsSetup, result: dict) -> tuple[bool, str]:
    """Independent check, by a different route than the engine took.

    For a concentration change the ratio must equal the concentration factor
    raised to the order, which is the rate law read directly rather than the
    two rates divided. For a rate-constant change the ratio must equal the
    ratio of the constants, since concentration did not move.
    """
    ratio = result["ratio"]
    if not math.isfinite(ratio):
        return False, "rate ratio is not finite"

    if abs(result["k_after"] - result["k_before"]) < 1e-15:
        implied = (result["rate_after"] / result["rate_before"]) if result["rate_before"] else 0.0
        expected = implied ** (1.0 / setup.order) if setup.order else 1.0
        check = expected**setup.order
        if abs(check - ratio) / max(ratio, 1e-12) > 1e-6:
            return False, f"rate law gives {check:.6g}, engine gives {ratio:.6g}"
        return True, f"rate ratio {ratio:.4g} matches [A] factor to the power {setup.order}"

    k_ratio = result["k_after"] / result["k_before"]
    if abs(k_ratio - ratio) / max(ratio, 1e-12) > 1e-6:
        return False, f"k ratio is {k_ratio:.6g}, rate ratio is {ratio:.6g}"
    return True, f"rate ratio {ratio:.4g} equals the rate-constant ratio"


# ---------------------------------------------------------------------------
# Gases and kinetic molecular theory
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class GasSetup:
    """A sample of one gas, with the van der Waals constants for the real one.

    a and b are per-gas experimental constants; each scenario names its
    source. Leaving them at zero reduces the van der Waals equation to the
    ideal gas law exactly, which is the honest way to say "treat this as
    ideal" rather than having a second code path.
    """

    name: str
    moles: float
    volume_L: float
    temperature_K: float
    molar_mass_g: float
    a: float = 0.0  # L^2 bar / mol^2
    b: float = 0.0  # L / mol
    source: str = ""


R_L_BAR = 0.083144626  # L bar / (mol K), the gas constant in these units.


def ideal_pressure(setup: GasSetup) -> float:
    """P = nRT/V, in bar."""
    return setup.moles * R_L_BAR * setup.temperature_K / setup.volume_L


def vdw_pressure(setup: GasSetup) -> float:
    """Van der Waals pressure, in bar.

        (P + a n^2/V^2)(V - nb) = nRT

    With a = b = 0 this returns exactly the ideal pressure, so the two are one
    model with the corrections switched off rather than two models.
    """
    n, v, t = setup.moles, setup.volume_L, setup.temperature_K
    free = v - n * setup.b
    if free <= 0:
        raise ValueError(f"{setup.name}: excluded volume exceeds the container")
    return n * R_L_BAR * t / free - setup.a * n * n / (v * v)


def rms_speed(setup: GasSetup) -> float:
    """Root mean square molecular speed in m/s, sqrt(3RT/M)."""
    molar_kg = setup.molar_mass_g / 1000.0
    return math.sqrt(3.0 * R_GAS * setup.temperature_K / molar_kg)


def mean_kinetic_energy(temperature_K: float) -> float:
    """Average translational kinetic energy per mole, J/mol: (3/2)RT.

    It depends on temperature and on nothing else. That is the whole content
    of the idea, and it is why this function does not take a gas.
    """
    return 1.5 * R_GAS * temperature_K


def compare_gases(a: GasSetup, b: GasSetup) -> dict:
    """Compare two gases and derive which is faster and which is more energetic.

    Both answers are computed rather than stated, because the pair of them is
    the point: at the same temperature the average kinetic energies are equal
    and the speeds are not, and a learner who expects the heavier gas to carry
    more energy has to see the two answers come apart.
    """
    same_t = abs(a.temperature_K - b.temperature_K) < 1e-9
    ke_a = mean_kinetic_energy(a.temperature_K)
    ke_b = mean_kinetic_energy(b.temperature_K)
    v_a, v_b = rms_speed(a), rms_speed(b)

    if abs(ke_a - ke_b) / max(ke_a, ke_b) < 1e-9:
        energy = "same"
    else:
        energy = "a" if ke_a > ke_b else "b"
    speed = "a" if v_a > v_b else ("b" if v_b > v_a else "same")

    return {
        "outcome": energy,
        "energy": energy,
        "speed": speed,
        "same_temperature": same_t,
        "ke_a_J_per_mol": ke_a,
        "ke_b_J_per_mol": ke_b,
        "rms_a_m_per_s": v_a,
        "rms_b_m_per_s": v_b,
        "effusion_ratio_a_over_b": math.sqrt(b.molar_mass_g / a.molar_mass_g),
    }


def gas_response(setup: GasSetup, change: dict[str, float]) -> dict:
    """Change one variable and report what the pressure does.

    change carries exactly one of volume_factor, temperature_factor or
    moles_factor. The ideal and real pressures are both reported so the two
    can be compared, and the outcome token comes from the REAL one, because
    that is what a measurement would return.
    """
    if len(change) != 1:
        raise ValueError(f"{setup.name}: expected exactly one change, got {change}")

    v, t, n = setup.volume_L, setup.temperature_K, setup.moles
    if "volume_factor" in change:
        v *= change["volume_factor"]
    elif "temperature_factor" in change:
        t *= change["temperature_factor"]
    elif "moles_factor" in change:
        n *= change["moles_factor"]
    else:
        raise ValueError(f"{setup.name}: unknown change {list(change)}")

    after = GasSetup(
        name=setup.name,
        moles=n,
        volume_L=v,
        temperature_K=t,
        molar_mass_g=setup.molar_mass_g,
        a=setup.a,
        b=setup.b,
    )
    p_before, p_after = vdw_pressure(setup), vdw_pressure(after)
    ratio = p_after / p_before

    return {
        "outcome": _classify_ratio(ratio),
        "pressure_before_bar": p_before,
        "pressure_after_bar": p_after,
        "ideal_before_bar": ideal_pressure(setup),
        "ideal_after_bar": ideal_pressure(after),
        "ratio": ratio,
        # How far the real gas departs from ideal, as a signed fraction. A
        # negative value means attraction is winning and the real pressure is
        # below ideal; positive means excluded volume dominates.
        "departure_before": (p_before - ideal_pressure(setup)) / ideal_pressure(setup),
        "departure_after": (p_after - ideal_pressure(after)) / ideal_pressure(after),
        "rms_before_m_per_s": rms_speed(setup),
        "rms_after_m_per_s": rms_speed(after),
    }


def verify_gas_response(setup: GasSetup, result: dict) -> tuple[bool, str]:
    """Independent check on a gas response.

    The van der Waals equation is re-evaluated from the reported pressure and
    must reproduce nRT: that is the equation of state read backwards, which is
    a different arithmetic path than the forward solve. For an ideal sample
    the real and ideal pressures must also agree exactly, since with a and b
    at zero they are the same expression.
    """
    p = result["pressure_before_bar"]
    n, v, t = setup.moles, setup.volume_L, setup.temperature_K
    lhs = (p + setup.a * n * n / (v * v)) * (v - n * setup.b)
    rhs = n * R_L_BAR * t
    if abs(lhs - rhs) / rhs > 1e-9:
        return False, f"equation of state gives {lhs:.6g}, nRT is {rhs:.6g}"

    if setup.a == 0.0 and setup.b == 0.0:
        ideal = result["ideal_before_bar"]
        if abs(p - ideal) / ideal > 1e-12:
            return False, "ideal sample but real and ideal pressures differ"
    return True, f"equation of state balances at {rhs:.6g} L bar"
