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
