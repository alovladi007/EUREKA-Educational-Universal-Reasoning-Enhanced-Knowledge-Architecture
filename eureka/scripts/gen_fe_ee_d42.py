#!/usr/bin/env python3
"""Depth-wave-42 figures and verification for the FE Electrical and Computer course.

Scope: the electromechanical-conversion chapter of the Engineering Sciences
section (topic `fee_electromech`, figure prefix `sci3-`). Same contract and the
same shared style module as the earlier depth generators, so these plots sit
beside the existing ones without introducing a second look.

Nothing here is traced, scanned or adapted from a reference work. Every curve,
patch and marker is computed in this file from a relation the lesson writes
down, so a reader can rerun the script and get the picture back. Formulas are
not protected expression; other people's drawings of them are, and this
pipeline never touches one.

WHY THIS FILE IS MOSTLY VERIFICATION

An electromechanical chapter converts between the electrical and the mechanical
domain in almost every paragraph, and that is exactly where unit errors hide. A
sibling chapter in this course once claimed a coaxial line's L' = 0.250 uH/m was
"one half of the characteristic impedance": henries per metre are not ohms, and
the sentence was dimensionally incoherent even though the number was right. So
this file carries TWO verification batteries, not one:

  * `dimensions()` builds every relation the lesson prints out of SI base
    exponents (m, kg, s, A) and asserts that both sides match. A relation that
    is dimensionally wrong cannot be written down here without stopping the
    script, whatever its numbers say.

  * `mechanics()` computes every force and torque the lesson quotes by TWO
    independent routes -- the energy method (a derivative of inductance or of
    stored energy) and a direct field calculation (Maxwell stress on a pole
    face, or the Lorentz force on a conductor) -- and asserts that they agree
    to a tight tolerance. Where a finite displacement is involved the energy
    ledger is closed as well: electrical input equals field-energy change plus
    mechanical work, exactly.

`python3 eureka/scripts/gen_fe_ee_d42.py --verify` runs both batteries alone and
prints the counts. The figure generators repeat the claims they draw as
`assert`s at tight tolerances, so a wrong claim stops the script instead of
shipping.

Every registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

Usage:
    python3 eureka/scripts/gen_fe_ee_d42.py                  # verify, then figures
    python3 eureka/scripts/gen_fe_ee_d42.py --verify         # numerics only
    python3 eureka/scripts/gen_fe_ee_d42.py sci3-bh-curve    # one figure
"""
from __future__ import annotations

import math
import pathlib
import sys

import numpy as np
from scipy import integrate, optimize

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

REGISTRY: dict = {}
PREFIX = "sci3-"

COUNTS = {"dimension": 0, "force": 0, "ledger": 0, "route": 0}


def figure(name):
    if not name.startswith(PREFIX):
        raise ValueError(f"this generator owns only {PREFIX!r} figures, not {name!r}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ===========================================================================
# 1. A DIMENSIONAL ALGEBRA
# ===========================================================================
# Exponents of the four SI base units this chapter needs: metre, kilogram,
# second, ampere. Everything else in the chapter is built from these, so a
# relation can be checked without trusting anybody's memory of what a weber is.
BASE = ("m", "kg", "s", "A")


class Dim:
    """A dimension: a vector of exponents over (m, kg, s, A)."""

    __slots__ = ("e", "name")

    def __init__(self, e=(0, 0, 0, 0), name=None):
        self.e = tuple(float(x) for x in e)
        self.name = name

    def __mul__(self, o):
        return Dim([a + b for a, b in zip(self.e, o.e)])

    def __truediv__(self, o):
        return Dim([a - b for a, b in zip(self.e, o.e)])

    def __pow__(self, k):
        return Dim([a * k for a in self.e])

    def __eq__(self, o):
        return all(abs(a - b) < 1e-12 for a, b in zip(self.e, o.e))

    def __repr__(self):
        if self.name:
            return self.name
        bits = [f"{u}^{x:g}" for u, x in zip(BASE, self.e) if x]
        return "1" if not bits else "*".join(bits)


ONE = Dim((0, 0, 0, 0), "1")
M = Dim((1, 0, 0, 0), "m")
KG = Dim((0, 1, 0, 0), "kg")
SEC = Dim((0, 0, 1, 0), "s")
AMP = Dim((0, 0, 0, 1), "A")

NEWTON = KG * M / SEC ** 2
JOULE = NEWTON * M
WATT = JOULE / SEC
VOLT = WATT / AMP
COULOMB = AMP * SEC
OHM = VOLT / AMP
WEBER = VOLT * SEC
TESLA = WEBER / M ** 2
HENRY = WEBER / AMP
PASCAL = NEWTON / M ** 2
RELUCTANCE = AMP / WEBER          # also 1/H
HZ = ONE / SEC
RADPS = ONE / SEC                  # radians are dimensionless
NM = NEWTON * M                    # torque
for _d, _n in ((NEWTON, "N"), (JOULE, "J"), (WATT, "W"), (VOLT, "V"),
               (OHM, "ohm"), (WEBER, "Wb"), (TESLA, "T"), (HENRY, "H"),
               (PASCAL, "Pa"), (RELUCTANCE, "A/Wb"), (COULOMB, "C")):
    _d.name = _n

MU0_D = HENRY / M                  # permeability
RHO_D = OHM * M                    # resistivity
DENSITY = KG / M ** 3


def dim_ok(label, left, right):
    """Assert that two dimensional expressions match, and count the check."""
    assert left == right, f"DIMENSION MISMATCH in {label}: {left!r} vs {right!r}"
    COUNTS["dimension"] += 1
    return left


def dimensions(loud=True):  # noqa: C901 - a long list of small checks, on purpose
    """Every relation the chapter prints, checked by its dimensions."""
    # -- magnetic circuit ---------------------------------------------------
    dim_ok("MMF = N*I", AMP, AMP)
    dim_ok("reluctance = l/(mu*A)", M / (MU0_D * M ** 2), RELUCTANCE)
    dim_ok("reluctance = 1/H", ONE / HENRY, RELUCTANCE)
    dim_ok("Hopkinson F = Phi*R", WEBER * RELUCTANCE, AMP)
    dim_ok("B = Phi/A", WEBER / M ** 2, TESLA)
    dim_ok("H = B/mu", TESLA / MU0_D, AMP / M)
    dim_ok("Ampere F = H*l", (AMP / M) * M, AMP)
    dim_ok("permeance = 1/reluctance", ONE / RELUCTANCE, HENRY)
    dim_ok("series reluctance adds", RELUCTANCE, RELUCTANCE)
    dim_ok("parallel reluctance product/sum",
           (RELUCTANCE * RELUCTANCE) / RELUCTANCE, RELUCTANCE)
    dim_ok("fringed gap area (a+g)(b+g)", M * M, M ** 2)

    # -- inductance and coupling -------------------------------------------
    dim_ok("flux linkage lambda = N*Phi", WEBER, WEBER)
    dim_ok("L = lambda/i", WEBER / AMP, HENRY)
    dim_ok("L = N^2/reluctance", ONE / RELUCTANCE, HENRY)
    dim_ok("M = N1*N2/reluctance", ONE / RELUCTANCE, HENRY)
    dim_ok("k = M/sqrt(L1*L2)", HENRY / (HENRY ** 2) ** 0.5, ONE)
    dim_ok("v = N dPhi/dt", WEBER / SEC, VOLT)
    dim_ok("v = L di/dt", HENRY * AMP / SEC, VOLT)
    dim_ok("Xm = omega*L", RADPS * HENRY, OHM)
    dim_ok("M = (La - Lo)/4", HENRY, HENRY)

    # -- energy and co-energy ----------------------------------------------
    dim_ok("Wf = integral i dlambda", AMP * WEBER, JOULE)
    dim_ok("Wco = integral lambda di", WEBER * AMP, JOULE)
    dim_ok("Wf = L i^2/2", HENRY * AMP ** 2, JOULE)
    dim_ok("Wf = lambda^2/(2L)", WEBER ** 2 / HENRY, JOULE)
    dim_ok("Wf = reluctance*Phi^2/2", RELUCTANCE * WEBER ** 2, JOULE)
    dim_ok("energy density B^2/(2mu)", TESLA ** 2 / MU0_D, JOULE / M ** 3)

    # -- force and torque ---------------------------------------------------
    dim_ok("f = i^2 dL/dx / 2", AMP ** 2 * HENRY / M, NEWTON)
    dim_ok("f = -Phi^2 dR/dx / 2", WEBER ** 2 * (RELUCTANCE / M), NEWTON)
    dim_ok("Maxwell stress B^2/(2mu0)", TESLA ** 2 / MU0_D, PASCAL)
    dim_ok("f = pressure*area", PASCAL * M ** 2, NEWTON)
    dim_ok("torque = i^2 dL/dtheta / 2", AMP ** 2 * HENRY, NM)
    dim_ok("mechanical work = f*dx", NEWTON * M, JOULE)
    dim_ok("mechanical work = torque*dtheta", NM, JOULE)
    dim_ok("electrical input = i dlambda", AMP * WEBER, JOULE)

    # -- Lorentz pair and the machine --------------------------------------
    dim_ok("f = B*l*i", TESLA * M * AMP, NEWTON)
    dim_ok("e = B*l*v", TESLA * M * (M / SEC), VOLT)
    dim_ok("P = f*v", NEWTON * M / SEC, WATT)
    dim_ok("P = e*i", VOLT * AMP, WATT)
    dim_ok("tau_mech = m*R/(B*l)^2", KG * OHM / (TESLA * M) ** 2, SEC)
    dim_ok("v_steady = V/(B*l)", VOLT / (TESLA * M), M / SEC)
    dim_ok("kinetic energy m v^2/2", KG * (M / SEC) ** 2, JOULE)
    dim_ok("machine constant k: V*s/rad == N*m/A", VOLT * SEC, NM / AMP)
    dim_ok("back-EMF k*omega", (VOLT * SEC) * RADPS, VOLT)
    dim_ok("torque k*i", (NM / AMP) * AMP, NM)

    # -- core loss ----------------------------------------------------------
    dim_ok("hysteresis loop area = H dB", (AMP / M) * TESLA, JOULE / M ** 3)
    dim_ok("hysteresis power = f * loop area", HZ * (JOULE / M ** 3), WATT / M ** 3)
    dim_ok("eddy loss d^2 f^2 B^2/rho",
           M ** 2 * HZ ** 2 * TESLA ** 2 / RHO_D, WATT / M ** 3)
    dim_ok("specific loss = (W/m^3)/density", (WATT / M ** 3) / DENSITY, WATT / KG)
    dim_ok("skin depth sqrt(2 rho/(omega mu))",
           (RHO_D / (RADPS * MU0_D)) ** 0.5, M)

    if loud:
        print(f"  dimensional checks passed: {COUNTS['dimension']}")


# ===========================================================================
# 2. NAMED CONSTANTS AND THE RUNNING GEOMETRY
# ===========================================================================
MU0 = 4.0 * math.pi * 1e-7          # H/m, exact by the pre-2019 definition
GRAV = 9.80665                      # m/s^2, standard gravity

# --- the running core: a rectangular ring with one gap ---------------------
L_CORE = 0.60                       # m, mean magnetic path length
SIDE = 0.020                        # m, the core is 20 mm square in section
A_CORE = SIDE * SIDE                # m^2 = 4.0e-4
MUR = 2500.0                        # constant-permeability idealisation
NTURN = 500
I_COIL = 2.0                        # A
GAP = 1.0e-3                        # m

# --- the E-core (parallel magnetic circuit) -------------------------------
E_MUR = 2000.0
E_LC, E_AC = 0.10, 8.0e-4           # centre limb
E_LO, E_AO = 0.30, 4.0e-4           # each outer limb
E_N, E_I = 300, 0.40
E_GAP = 0.5e-3                      # gap in ONE outer limb

# --- the B-H model (stated in the lesson, not fitted to anyone's data) -----
B_SAT = 1.8                         # T
MU_INIT = 5000.0 * MU0              # H/m, initial slope
H_COERCIVE = 50.0                   # A/m
B_DRIVE = 1.5                       # T, loop tip

# --- lamination material (given data in the worked problem) ---------------
RHO_STEEL = 4.7e-7                  # ohm*m
DENS_STEEL = 7650.0                 # kg/m^3
D_LAM = 0.35e-3                     # m
D_LAM2 = 0.50e-3                    # m
F_LINE = 60.0                       # Hz

# --- the reluctance rotor --------------------------------------------------
L0_ROT, L2_ROT, I_ROT = 0.10, 0.04, 5.0

# --- the linear DC machine -------------------------------------------------
B_RAIL, ELL_RAIL = 0.80, 0.50       # T, m
V_RAIL, R_RAIL, MASS_RAIL = 24.0, 0.40, 2.0


def reluctance(length, area, mur=1.0):
    return length / (MU0 * mur * area)


R_CORE = reluctance(L_CORE, A_CORE, MUR)
R_GAP = reluctance(GAP, A_CORE)
R_TOT = R_CORE + R_GAP


# ===========================================================================
# 3. THE B-H MODEL AND ITS INVERSE
# ===========================================================================
def b_of_h(h):
    """Anhysteretic B(H): initial slope MU_INIT, saturating at B_SAT."""
    return (2.0 * B_SAT / math.pi) * np.arctan(math.pi * MU_INIT * np.asarray(h, float)
                                               / (2.0 * B_SAT))


def h_of_b(b):
    """Exact inverse of b_of_h."""
    return (2.0 * B_SAT / (math.pi * MU_INIT)) * np.tan(math.pi * np.asarray(b, float)
                                                        / (2.0 * B_SAT))


def mur_secant(b):
    """Secant relative permeability B/(mu0 H) at a given flux density."""
    return np.asarray(b, float) / (MU0 * h_of_b(b))


def loop_h(b, sign):
    """Ascending (sign +1) or descending (sign -1) branch of the hysteresis loop.

    The offset vanishes at the tips, so the loop closes exactly, and equals the
    coercivity at B = 0, so H_c means what it says.
    """
    b = np.asarray(b, float)
    return h_of_b(b) + sign * H_COERCIVE * (1.0 - (b / B_DRIVE) ** 2)


# ===========================================================================
# 4. THE MECHANICS BATTERY: TWO ROUTES FOR EVERY FORCE AND TORQUE
# ===========================================================================
def force_ok(label, energy_route, field_route, rel=1e-9):
    """One force or torque, computed twice by independent physics."""
    gap = abs(energy_route - field_route)
    scale = max(abs(energy_route), abs(field_route), 1e-30)
    assert gap / scale < rel, (
        f"{label}: energy method {energy_route!r} vs direct field {field_route!r}")
    COUNTS["force"] += 1
    return energy_route


def ledger_ok(label, electrical, field_change, mechanical, tol=1e-9):
    """One energy ledger: electrical in = field change + mechanical out."""
    gap = abs(electrical - (field_change + mechanical))
    assert gap < tol, (f"{label}: {electrical!r} != {field_change!r} + {mechanical!r}")
    COUNTS["ledger"] += 1
    return electrical


def route_ok(label, a, b, rel=1e-9):
    """One non-force quantity, computed twice by independent routes."""
    gap = abs(a - b)
    scale = max(abs(a), abs(b), 1e-30)
    assert gap / scale < rel, f"{label}: {a!r} vs {b!r}"
    COUNTS["route"] += 1
    return a


# --- solenoid / plunger: the gap is the variable ---------------------------
def l_ideal(x):
    """Inductance of a gapped core whose iron reluctance is neglected."""
    return NTURN ** 2 * MU0 * A_CORE / x


def l_real(x):
    """Inductance of the same core with the iron reluctance kept."""
    return NTURN ** 2 / (R_CORE + x / (MU0 * A_CORE))


def force_energy(fn, x, i=I_COIL, h=1e-9):
    """f = (1/2) i^2 dL/dx, with dL/dx by central difference."""
    return 0.5 * i ** 2 * (fn(x + h) - fn(x - h)) / (2 * h)


def force_maxwell(fn, x, i=I_COIL):
    """f = B^2 A/(2 mu0) on the pole face, B taken from the flux the coil drives."""
    flux = fn(x) * i / NTURN
    b = flux / A_CORE
    return b ** 2 * A_CORE / (2.0 * MU0)


def mechanics(loud=True):  # noqa: C901 - a long list of small checks, on purpose
    """Every force and torque in the chapter, confirmed two ways."""
    # -- 4.1 magnetic-circuit numbers, two routes each ----------------------
    mmf = NTURN * I_COIL
    flux = mmf / R_TOT
    b_core = flux / A_CORE
    # Ampere's law route: the same B, from H*l summed round the loop
    h_iron, h_gap = b_core / (MU0 * MUR), b_core / MU0
    route_ok("MMF by Ampere vs Hopkinson", h_iron * L_CORE + h_gap * GAP, mmf)
    route_ok("gap MMF share", flux * R_GAP / mmf, R_GAP / R_TOT)
    route_ok("gap share is 25/31", R_GAP / R_TOT, 25.0 / 31.0, rel=1e-12)
    route_ok("reluctance ratio = mur*g/lc", R_GAP / R_CORE, MUR * GAP / L_CORE)
    route_ok("L two ways", NTURN ** 2 / R_TOT, NTURN * flux / I_COIL)

    # fringing: rectangular gap, effective area (a+g)(b+g)
    a_fringe = (SIDE + GAP) * (SIDE + GAP)
    r_gap_f = reluctance(GAP, a_fringe)
    route_ok("fringed area ratio", a_fringe / A_CORE, (21.0 / 20.0) ** 2, rel=1e-12)
    flux_f = mmf / (R_CORE + r_gap_f)
    assert flux_f > flux

    # -- 4.2 field energy two ways ------------------------------------------
    w_circuit = 0.5 * (NTURN ** 2 / R_TOT) * I_COIL ** 2
    w_field = (b_core ** 2 / (2 * MU0 * MUR)) * (A_CORE * L_CORE) \
        + (b_core ** 2 / (2 * MU0)) * (A_CORE * GAP)
    route_ok("stored energy: circuit vs field integral", w_circuit, w_field, rel=1e-12)
    route_ok("gap is one part in 601 of the volume",
             (A_CORE * GAP) / (A_CORE * GAP + A_CORE * L_CORE), 1.0 / 601.0,
             rel=1e-12)
    route_ok("gap holds 25/31 of the stored energy",
             ((b_core ** 2 / (2 * MU0)) * A_CORE * GAP) / w_field, 25.0 / 31.0,
             rel=1e-12)
    route_ok("gap/core energy ratio equals reluctance ratio",
             ((b_core ** 2 / (2 * MU0)) * (A_CORE * GAP))
             / ((b_core ** 2 / (2 * MU0 * MUR)) * (A_CORE * L_CORE)),
             R_GAP / R_CORE, rel=1e-12)

    # -- 4.3 solenoid force, ideal core, at two gaps ------------------------
    for x in (1.0e-3, 2.0e-3):
        force_ok(f"ideal solenoid at x={x}",
                 -force_energy(l_ideal, x), force_maxwell(l_ideal, x), rel=1e-6)

    # -- 4.4 solenoid force with the iron kept, at three gaps ---------------
    for x in (0.5e-3, 1.0e-3, 2.0e-3):
        force_ok(f"real solenoid at x={x}",
                 -force_energy(l_real, x), force_maxwell(l_real, x), rel=1e-6)

    # constant-flux route: f = -(1/2) Phi^2 dR/dx, a THIRD independent path
    x = 1.0e-3
    phi = l_real(x) * I_COIL / NTURN
    f_const_flux = 0.5 * phi ** 2 / (MU0 * A_CORE)
    force_ok("real solenoid, constant-flux energy route",
             f_const_flux, force_maxwell(l_real, x), rel=1e-12)

    # -- 4.5 lateral (overlap) force: constant gap, varying area ------------
    def l_overlap(u):
        return NTURN ** 2 * MU0 * (SIDE * u) / GAP

    u0 = SIDE
    f_lat_energy = force_energy(l_overlap, u0)
    b_lat = MU0 * NTURN * I_COIL / GAP
    f_lat_field = (b_lat ** 2 / (2 * MU0)) * (SIDE * GAP)
    force_ok("lateral overlap force", f_lat_energy, f_lat_field, rel=1e-6)
    route_ok("normal/lateral force ratio", force_maxwell(l_ideal, GAP) / f_lat_field,
             A_CORE / (SIDE * GAP), rel=1e-9)

    # -- 4.6 reluctance torque ----------------------------------------------
    # Route A: differentiate the CO-ENERGY at constant current.
    # Route B: differentiate the FIELD ENERGY at constant flux linkage, holding
    # lambda at its operating-point value. Different state variable, different
    # function, opposite sign convention -- so agreement is a real check on the
    # co-energy bookkeeping, not on arithmetic.
    def l_rot(th):
        return L0_ROT + L2_ROT * math.cos(2.0 * th)

    def coenergy_rot(i, th):
        return 0.5 * l_rot(th) * i ** 2

    def field_rot(lam, th):
        return 0.5 * lam ** 2 / l_rot(th)

    h = 1e-7
    for th in (math.radians(45.0), math.radians(30.0), math.radians(75.0)):
        t_coenergy = (coenergy_rot(I_ROT, th + h) - coenergy_rot(I_ROT, th - h)) / (2 * h)
        lam0 = l_rot(th) * I_ROT
        t_field = -(field_rot(lam0, th + h) - field_rot(lam0, th - h)) / (2 * h)
        force_ok(f"reluctance torque at {math.degrees(th):.0f} deg",
                 t_coenergy, t_field, rel=1e-6)
        # and against the hand-differentiated closed form the lesson prints
        route_ok(f"closed form at {math.degrees(th):.0f} deg", t_coenergy,
                 -I_ROT ** 2 * L2_ROT * math.sin(2 * th), rel=1e-6)

    # finite rotation 0 -> 90 deg at constant current: close the ledger
    th_a, th_b = 0.0, math.pi / 2
    w_mech = integrate.quad(lambda t: -I_ROT ** 2 * L2_ROT * math.sin(2 * t),
                            th_a, th_b, epsabs=1e-14)[0]
    d_field = 0.5 * I_ROT ** 2 * (l_rot(th_b) - l_rot(th_a))
    w_elec = I_ROT ** 2 * (l_rot(th_b) - l_rot(th_a))
    ledger_ok("reluctance rotor 0->90 deg", w_elec, d_field, w_mech)
    route_ok("half the electrical energy is mechanical", w_mech, d_field, rel=1e-9)

    # -- 4.7 the linear DC machine ------------------------------------------
    # The bar-and-rails is a variable-flux-linkage system: lambda = B*l*x + L*i,
    # so the ENERGY METHOD applies to it exactly as it does to the plunger, and
    # its answer can be set against the Lorentz force law. The self-inductance
    # of the loop is deliberately non-zero to show it drops out of the force.
    bl = B_RAIL * ELL_RAIL
    l_loop = 5.0e-5                       # H, the loop's own inductance

    def coenergy_rail(i, x):
        return bl * x * i + 0.5 * l_loop * i ** 2

    i0 = V_RAIL / R_RAIL                  # stall current
    for x0, cur in ((0.0, i0), (1.7, i0), (3.2, 15.0)):
        f_energy = (coenergy_rail(cur, x0 + 1e-6)
                    - coenergy_rail(cur, x0 - 1e-6)) / 2e-6
        force_ok(f"rail bar, energy method vs Lorentz at i={cur} A",
                 f_energy, bl * cur, rel=1e-9)

    v_ss = V_RAIL / bl
    tau = MASS_RAIL * R_RAIL / bl ** 2
    # energy ledger from rest to steady state, by closed form and by quadrature
    q = integrate.quad(lambda t: i0 * math.exp(-t / tau), 0, 200 * tau,
                       epsabs=1e-13, limit=400)[0]
    route_ok("charge delivered", q, i0 * tau, rel=1e-9)
    w_in = V_RAIL * q
    w_kin = 0.5 * MASS_RAIL * v_ss ** 2
    w_loss = integrate.quad(lambda t: R_RAIL * (i0 * math.exp(-t / tau)) ** 2,
                            0, 200 * tau, epsabs=1e-13, limit=400)[0]
    ledger_ok("linear machine run-up", w_in, w_loss, w_kin, tol=1e-6)
    route_ok("run-up splits exactly in half", w_kin, w_loss, rel=1e-9)
    # the speed history, from the ODE integrated numerically rather than solved
    sol = integrate.solve_ivp(
        lambda t, y: [bl * (V_RAIL - bl * y[0]) / R_RAIL / MASS_RAIL],
        (0.0, 5 * tau), [0.0], rtol=1e-11, atol=1e-13, dense_output=True)
    route_ok("speed at 5 time constants, ODE vs closed form",
             float(sol.y[0, -1]), v_ss * (1 - math.exp(-5.0)), rel=1e-7)

    # loaded steady state: force from the POWER LEDGER (no B or l in sight)
    # against the Lorentz law.
    f_load = 6.0
    i_load = f_load / bl
    v_load = (V_RAIL - i_load * R_RAIL) / bl
    force_ok("loaded rail bar: power ledger vs Lorentz",
             (V_RAIL * i_load - i_load ** 2 * R_RAIL) / v_load, bl * i_load, rel=1e-12)
    ledger_ok("loaded power balance", V_RAIL * i_load, i_load ** 2 * R_RAIL,
              f_load * v_load, tol=1e-9)

    # generator mode: mechanical input power, again from the ledger alone
    v_gen = 80.0
    e_gen = bl * v_gen
    i_gen = (e_gen - V_RAIL) / R_RAIL
    force_ok("generator retarding force: power ledger vs Lorentz",
             (V_RAIL * i_gen + i_gen ** 2 * R_RAIL) / v_gen, bl * i_gen, rel=1e-12)
    ledger_ok("generator power balance", e_gen * i_gen, i_gen ** 2 * R_RAIL,
              V_RAIL * i_gen, tol=1e-9)

    # -- 4.8 the rotary machine already in the chapter ----------------------
    # Torque from the power ledger (electrical input minus copper loss, over
    # speed) against the torque constant. The first route never uses k.
    v_dc, r_dc, k_dc, w_dc = 24.0, 0.6, 0.08, 250.0
    ia = (v_dc - k_dc * w_dc) / r_dc
    force_ok("rotary DC torque at 250 rad/s",
             (v_dc * ia - ia ** 2 * r_dc) / w_dc, k_dc * ia, rel=1e-12)
    ledger_ok("rotary DC power balance", v_dc * ia, ia ** 2 * r_dc,
              k_dc * ia * w_dc, tol=1e-9)

    # -- 4.9 core loss, two routes for the loop area ------------------------
    b = np.linspace(-B_DRIVE, B_DRIVE, 200001)
    area_quad = float(np.trapz(loop_h(b, +1) - loop_h(b, -1), b))
    area_closed = 8.0 * H_COERCIVE * B_DRIVE / 3.0
    route_ok("hysteresis loop area", area_quad, area_closed, rel=1e-8)

    if loud:
        print(f"  force/torque results confirmed two ways: {COUNTS['force']}")
        print(f"  energy ledgers closed: {COUNTS['ledger']}")
        print(f"  other quantities confirmed two ways: {COUNTS['route']}")


def legacy() -> None:
    """Re-verify every printed number in sections 1 to 4 of the same chapter.

    Those sections were written by an earlier wave. Rule: fix pre-existing
    errors in place. Confirming them requires recomputing them, so every
    printed figure in the DC-machine, strain-gauge, RTD and meter-loading
    material is reproduced here from its own stated formula.
    """
    # -- section 3: the 24 V, 0.6 ohm, k = 0.08 machine ---------------------
    v, r, k = 24.0, 0.6, 0.08
    route_ok("stall current", v / r, 40.0, rel=1e-12)
    route_ok("stall torque", k * (v / r), 3.2, rel=1e-12)
    route_ok("stall heat", v * (v / r), 960.0, rel=1e-12)
    route_ok("no-load speed", v / k, 300.0, rel=1e-12)
    route_ok("no-load RPM", (v / k) * 60 / (2 * math.pi), 2864.789, rel=1e-6)
    w_pk = 0.5 * v / k
    route_ok("peak-power speed", w_pk, 150.0, rel=1e-12)
    ia_pk = (v - k * w_pk) / r
    route_ok("peak-power current", ia_pk, 20.0, rel=1e-12)
    route_ok("peak power two ways", k * ia_pk * w_pk, v ** 2 / (4 * r), rel=1e-12)
    ia = (v - k * 250.0) / r
    route_ok("current at 250 rad/s", ia, 6.6667, rel=1e-4)
    route_ok("torque at 250 rad/s", k * ia, 0.5333, rel=1e-4)
    route_ok("output at 250 rad/s", k * ia * 250.0, 133.33, rel=1e-4)
    route_ok("input at 250 rad/s", v * ia, 160.0, rel=1e-9)
    route_ok("copper at 250 rad/s", ia ** 2 * r, 26.67, rel=1e-3)
    route_ok("efficiency equals speed fraction", (k * ia * 250.0) / (v * ia),
             250.0 / (v / k), rel=1e-12)

    # -- section 4.1: the quarter bridge ------------------------------------
    vs, rg, gf = 10.0, 350.0, 2.0
    for strain, approx_err in ((500e-6, 0.0005), (0.02, 0.02)):
        dr_over_r = gf * strain
        dr = dr_over_r * rg
        exact = vs * dr / (2 * (2 * rg + dr))
        approx = (vs / 4) * dr_over_r
        route_ok(f"bridge exact vs approx at {strain}",
                 approx / exact - 1.0, approx_err, rel=1e-9)
    route_ok("bridge dR at 500 microstrain", gf * 500e-6 * rg, 0.35, rel=1e-12)
    route_ok("bridge approx output", (vs / 4) * 0.001, 2.5e-3, rel=1e-12)
    route_ok("bridge exact output", vs * 0.35 / (2 * (700 + 0.35)), 2.4988e-3,
             rel=1e-4)

    # -- section 4.2: the Pt100 --------------------------------------------
    r0, alpha = 100.0, 0.00385
    for t, expect in ((-40.0, 84.60), (0.0, 100.00), (100.0, 138.50), (150.0, 157.75)):
        route_ok(f"Pt100 at {t} C", r0 * (1 + alpha * t), expect, rel=1e-9)
    route_ok("Pt100 sensitivity", r0 * alpha, 0.385, rel=1e-12)
    route_ok("two ohms of lead", 2.0 / (r0 * alpha), 5.1948, rel=1e-4)
    route_ok("self-heating at 1 mA", (1e-3) ** 2 * 157.75, 1.5775e-4, rel=1e-9)

    # -- section 4.3: meter loading ----------------------------------------
    r1 = r2 = 100e3
    for rm, reading, err in ((10e3, 0.83333, -0.83333), (1e6, 4.76190, -0.047619),
                             (10e6, 4.97512, -0.0049751), (200e3, 4.0, -0.2)):
        par = r2 * rm / (r2 + rm)
        got = 10.0 * par / (r1 + par)
        route_ok(f"voltmeter {rm:g} ohm reading", got, reading, rel=1e-4)
        route_ok(f"voltmeter {rm:g} ohm error", got / 5.0 - 1.0, err, rel=1e-4)
    route_ok("ammeter 0.1 ohm burden", 10.0 / 5.1, 1.96078, rel=1e-5)
    route_ok("ammeter 0.1 ohm error", (10.0 / 5.1) / 2.0 - 1.0, -0.019608, rel=1e-4)
    route_ok("ammeter 0.01 ohm error", (10.0 / 5.01) / 2.0 - 1.0, -0.0019960, rel=1e-4)


def verify(loud=True):
    if loud:
        print("verification battery")
    dimensions(False)
    mechanics(False)
    problems(loud=False)
    legacy()
    if loud:
        print(f"  dimensional checks passed: {COUNTS['dimension']}")
        print(f"  force/torque results confirmed two ways: {COUNTS['force']}")
        print(f"  energy ledgers closed: {COUNTS['ledger']}")
        print(f"  other quantities confirmed two ways: {COUNTS['route']}")


def numbers() -> None:  # noqa: C901 - a printout, not logic
    """Print every quantity the lesson quotes, so the prose can be checked.

    `python3 eureka/scripts/gen_fe_ee_d42.py --numbers` reproduces the chapter's
    entire numeric content from the constants at the top of this file. Nothing
    in the lesson is typed from memory.
    """
    p = print
    p("== running core: 0.60 m path, 20 mm square, mur 2500, N 500, i 2.0 A, g 1.0 mm")
    p(f"  R_core         {R_CORE:,.1f} A/Wb")
    p(f"  R_gap          {R_GAP:,.1f} A/Wb")
    p(f"  R_total        {R_TOT:,.1f} A/Wb")
    p(f"  R_gap/R_core   {R_GAP / R_CORE:.6f}   (mur*g/lc = {MUR * GAP / L_CORE:.6f})")
    mmf = NTURN * I_COIL
    flux = mmf / R_TOT
    bc = flux / A_CORE
    p(f"  MMF            {mmf:.1f} A-t")
    p(f"  flux           {flux * 1e3:.6f} mWb")
    p(f"  B              {bc:.6f} T")
    p(f"  gap MMF        {flux * R_GAP:.4f} A-t  ({100 * R_GAP / R_TOT:.4f}%)")
    p(f"  core MMF       {flux * R_CORE:.4f} A-t  ({100 * R_CORE / R_TOT:.4f}%)")
    p(f"  H core         {bc / (MU0 * MUR):.4f} A/m")
    p(f"  H gap          {bc / MU0:,.1f} A/m")
    p(f"  L              {NTURN ** 2 / R_TOT * 1e3:.6f} mH")
    p(f"  W stored       {0.5 * (NTURN ** 2 / R_TOT) * I_COIL ** 2:.6f} J")
    p(f"    in gap       {(bc ** 2 / (2 * MU0)) * A_CORE * GAP:.6f} J")
    p(f"    in iron      {(bc ** 2 / (2 * MU0 * MUR)) * A_CORE * L_CORE:.6f} J")
    p(f"    density gap  {bc ** 2 / (2 * MU0):,.1f} J/m3")

    af = (SIDE + GAP) ** 2
    rgf = reluctance(GAP, af)
    ff = mmf / (R_CORE + rgf)
    p("== fringing, effective area (a+g)(b+g)")
    p(f"  A_eff          {af * 1e4:.4f} cm2  (+{100 * (af / A_CORE - 1):.2f}%)")
    p(f"  R_gap fringed  {rgf:,.1f} A/Wb")
    p(f"  flux           {ff * 1e3:.6f} mWb  (+{100 * (ff / flux - 1):.4f}%)")
    p(f"  B              {ff / A_CORE:.6f} T")

    p("== E-core, N 300, i 0.40 A, gap 0.5 mm in one outer limb")
    rc = reluctance(E_LC, E_AC, E_MUR)
    ra = reluctance(E_LO, E_AO, E_MUR)
    rb = reluctance(E_LO - E_GAP, E_AO, E_MUR) + reluctance(E_GAP, E_AO)
    rpar = ra * rb / (ra + rb)
    p(f"  R_centre       {rc:,.1f} A/Wb")
    p(f"  R_solid        {ra:,.1f} A/Wb")
    p(f"  R_gapped iron  {reluctance(E_LO - E_GAP, E_AO, E_MUR):,.1f} A/Wb")
    p(f"  R_gapped air   {reluctance(E_GAP, E_AO):,.1f} A/Wb")
    p(f"  R_gapped tot   {rb:,.1f} A/Wb")
    p(f"  R_parallel     {rpar:,.1f} A/Wb")
    p(f"  R_total        {rc + rpar:,.1f} A/Wb")
    phi = E_N * E_I / (rc + rpar)
    fa = phi * rpar
    p(f"  flux centre    {phi * 1e3:.6f} mWb   B = {phi / E_AC:.6f} T")
    p(f"  MMF centre     {phi * rc:.4f} A-t")
    p(f"  MMF parallel   {fa:.4f} A-t")
    p(f"  flux solid     {fa / ra * 1e3:.6f} mWb   B = {fa / ra / E_AO:.6f} T "
      f"({100 * (fa / ra) / phi:.3f}%)")
    p(f"  flux gapped    {fa / rb * 1e3:.6f} mWb   B = {fa / rb / E_AO:.6f} T "
      f"({100 * (fa / rb) / phi:.3f}%)")
    p(f"  ungapped flux  {E_N * E_I / (rc + ra / 2) * 1e3:.6f} mWb")

    p("== B-H model: B_s 1.8 T, initial mu_r 5000, H_c 50 A/m")
    b25 = float(optimize.brentq(lambda x: mur_secant(x) - MUR, 0.05, 1.75))
    p(f"  secant mur=2500 at B = {b25:.4f} T, H = {float(h_of_b(b25)):.2f} A/m")
    for hh in (100.0, 300.0, 680.63, 1000.0):
        p(f"  H {hh:8.2f} A/m -> B {float(b_of_h(hh)):.4f} T, "
          f"secant mur {float(b_of_h(hh)) / (MU0 * hh):,.0f}")
    p(f"  H at B=1.5 T   {float(h_of_b(1.5)):.4f} A/m")
    area = 8.0 * H_COERCIVE * B_DRIVE / 3.0
    brem = float(optimize.brentq(lambda x: loop_h(x, +1), -B_DRIVE * 0.999, 0.0))
    p(f"  loop area      {area:.4f} J/m3 per cycle   (8*Hc*Bm/3)")
    p(f"  remanence      {abs(brem):.4f} T")
    p(f"  P_hyst 60 Hz   {area * F_LINE:,.1f} W/m3 = "
      f"{area * F_LINE / DENS_STEEL:.4f} W/kg")

    p("== eddy current, rho 4.7e-7 ohm-m, density 7650 kg/m3, B_m 1.5 T")
    for d in (D_LAM, D_LAM2):
        pe = eddy_density(d, F_LINE, B_DRIVE)
        p(f"  d {d * 1e3:.2f} mm  60 Hz  {pe:,.2f} W/m3 = {pe / DENS_STEEL:.4f} W/kg")
    pe1 = eddy_density(D_LAM, F_LINE, B_DRIVE)
    p(f"  ratio d^2      {eddy_density(D_LAM2, F_LINE, B_DRIVE) / pe1:.6f} "
      f"({(D_LAM2 / D_LAM) ** 2:.6f})")
    tot = area * F_LINE + pe1
    p(f"  total 60 Hz    {tot:,.2f} W/m3 = {tot / DENS_STEEL:.4f} W/kg  "
      f"(eddy share {100 * pe1 / tot:.2f}%)")
    ke = eddy_density(D_LAM, 1.0, B_DRIVE)
    p(f"  k_e            {ke:.6f} W*s2/m3;  crossover {area / ke:.2f} Hz")
    p(f"  crossover 0.50 {area / eddy_density(D_LAM2, 1.0, B_DRIVE):.2f} Hz")
    mu_op = B_DRIVE / float(h_of_b(B_DRIVE))
    for f in (F_LINE, 400.0):
        delta = math.sqrt(2 * RHO_STEEL / (2 * math.pi * f * mu_op))
        p(f"  skin depth {f:5.0f} Hz  {delta * 1e3:.4f} mm   d/delta = "
          f"{D_LAM / delta:.4f}")
    p(f"  operating mur  {mu_op / MU0:,.1f}")
    at400 = area * 400.0 + eddy_density(D_LAM, 400.0, B_DRIVE)
    p(f"  total 400 Hz   {at400:,.1f} W/m3, eddy share "
      f"{100 * eddy_density(D_LAM, 400.0, B_DRIVE) / at400:.2f}%")

    p("== coupling on the gapped core, N1 500, N2 200")
    l1, l2 = 500 ** 2 / R_TOT, 200 ** 2 / R_TOT
    mm = 500 * 200 / R_TOT
    p(f"  L1 {l1 * 1e3:.5f} mH  L2 {l2 * 1e3:.5f} mH  M {mm * 1e3:.5f} mH")
    p(f"  sqrt(L1 L2)    {math.sqrt(l1 * l2) * 1e3:.5f} mH  -> k = "
      f"{mm / math.sqrt(l1 * l2):.6f}")
    kk = 0.94
    mreal = kk * math.sqrt(l1 * l2)
    p(f"  at k=0.94: M   {mreal * 1e3:.5f} mH")
    p(f"  series aiding  {(l1 + l2 + 2 * mreal) * 1e3:.5f} mH")
    p(f"  series opposing{(l1 + l2 - 2 * mreal) * 1e3:.5f} mH")
    p(f"  (La-Lo)/4      {((l1 + l2 + 2 * mreal) - (l1 + l2 - 2 * mreal)) / 4 * 1e3:.5f} mH")

    p("== magnetising current at 60 Hz, 120 V")
    for tag, rr in (("gapped", R_TOT), ("ungapped", R_CORE)):
        lm = 500 ** 2 / rr
        xm = 2 * math.pi * F_LINE * lm
        p(f"  {tag:9s} Lm {lm * 1e3:9.4f} mH  Xm {xm:9.4f} ohm  Im "
          f"{120.0 / xm:.5f} A")
    p(f"  ratio          {R_TOT / R_CORE:.6f}")

    p("== saturating UNGAPPED core: energy and co-energy at B = 1.5 T")
    itop = L_CORE * float(h_of_b(B_DRIVE)) / NTURN
    ltop = NTURN * A_CORE * B_DRIVE
    a = math.pi / (2 * B_SAT)
    wf = (NTURN * A_CORE) * (L_CORE / NTURN) * (2 * B_SAT / (math.pi * MU_INIT)) \
        * (-math.log(math.cos(a * B_DRIVE)) / a)
    p(f"  i {itop:.6f} A   lambda {ltop:.6f} Wb-t   product {itop * ltop:.6f} J")
    p(f"  W_f {wf:.6f} J   W' {itop * ltop - wf:.6f} J   ratio "
      f"{(itop * ltop - wf) / wf:.6f}")
    p(f"  half the product {0.5 * itop * ltop:.6f} J; secant L {ltop / itop:.6f} H")
    p(f"  core volume    {A_CORE * L_CORE * 1e6:.1f} cm3; "
      f"integral H dB = {wf / (A_CORE * L_CORE):.4f} J/m3")
    p(f"  W_f shares     {100 * wf / (itop * ltop):.3f}% / "
      f"{100 * (itop * ltop - wf) / (itop * ltop):.3f}%")

    p("== a straight air-cored solenoid, N 200, l 0.15 m, A 3.0 cm2")
    lsol = MU0 * 200 ** 2 * 3.0e-4 / 0.15
    p(f"  L              {lsol * 1e6:.4f} uH   (with mur 2500: {lsol * 2500 * 1e3:.4f} mH)")
    p(f"  R              {0.15 / (MU0 * 3.0e-4):,.1f} A/Wb")

    p("== plunger actuator, N 500, i 2.0 A, A 4.0 cm2")
    for x in (0.5e-3, 1.0e-3, 2.0e-3):
        p(f"  x {x * 1e3:.1f} mm  iron ignored {force_maxwell(l_ideal, x):9.4f} N   "
          f"iron kept {force_maxwell(l_real, x):9.4f} N   "
          f"L_real {l_real(x) * 1e3:.5f} mH")
    x = 1.0e-3
    p(f"  dL/dx at 1 mm  {(l_real(x + 1e-9) - l_real(x - 1e-9)) / 2e-9:.4f} H/m")
    p(f"  B at 1 mm      ideal {MU0 * NTURN * I_COIL / x:.6f} T   "
      f"real {l_real(x) * I_COIL / NTURN / A_CORE:.6f} T")
    p(f"  ratio of pulls {force_maxwell(l_ideal, x) / force_maxwell(l_real, x):.6f}")
    blat = MU0 * NTURN * I_COIL / GAP
    flat = (blat ** 2 / (2 * MU0)) * (SIDE * GAP)
    p(f"  lateral force  {flat:.6f} N  (normal/lateral = "
      f"{force_maxwell(l_ideal, GAP) / flat:.4f})")
    p(f"  mass it lifts  {force_maxwell(l_real, x) / GRAV:.4f} kg at g = {GRAV} m/s2")

    p("== reluctance rotor, L = 100 + 40 cos 2theta mH, i 5 A")
    for deg in (0.0, 30.0, 45.0, 60.0, 90.0):
        th = math.radians(deg)
        p(f"  {deg:5.1f} deg  L {(L0_ROT + L2_ROT * math.cos(2 * th)) * 1e3:7.3f} mH  "
          f"T {-I_ROT ** 2 * L2_ROT * math.sin(2 * th):+7.4f} N-m")

    p("== linear DC machine: B 0.80 T, l 0.50 m, V 24 V, R 0.40 ohm, m 2.0 kg")
    bl = B_RAIL * ELL_RAIL
    p(f"  B*l            {bl:.4f} T-m")
    p(f"  stall i        {V_RAIL / R_RAIL:.4f} A   force {bl * V_RAIL / R_RAIL:.4f} N   "
      f"a {bl * V_RAIL / R_RAIL / MASS_RAIL:.4f} m/s2")
    p(f"  no-load speed  {V_RAIL / bl:.4f} m/s")
    p(f"  time constant  {MASS_RAIL * R_RAIL / bl ** 2:.4f} s")
    p(f"  supplied       {V_RAIL * (V_RAIL / R_RAIL) * (MASS_RAIL * R_RAIL / bl ** 2):.1f} J")
    p(f"  kinetic        {0.5 * MASS_RAIL * (V_RAIL / bl) ** 2:.1f} J")
    for fl in (6.0,):
        il = fl / bl
        vl = (V_RAIL - il * R_RAIL) / bl
        p(f"  load {fl:.1f} N   i {il:.4f} A  v {vl:.4f} m/s  "
          f"Pmech {fl * vl:.4f} W  Pin {V_RAIL * il:.4f} W  "
          f"loss {il ** 2 * R_RAIL:.4f} W  eta {100 * fl * vl / (V_RAIL * il):.4f}%")
    vg = 80.0
    eg = bl * vg
    ig = (eg - V_RAIL) / R_RAIL
    p(f"  generator at {vg:.0f} m/s: e {eg:.4f} V  i {ig:.4f} A  "
      f"force {bl * ig:.4f} N  Pmech {bl * ig * vg:.4f} W  "
      f"to source {V_RAIL * ig:.4f} W  loss {ig ** 2 * R_RAIL:.4f} W")

    p("== transformer magnetising current: 0.50 m, 6.0 cm2, mur 4000, N 250, 120 V")
    rt = reluctance(0.50, 6.0e-4, 4000.0)
    rtg = reluctance(0.50 - 2.0e-4, 6.0e-4, 4000.0) + reluctance(2.0e-4, 6.0e-4)
    for tag, rr in (("solid", rt), ("0.2 mm gap", rtg)):
        lm = 250 ** 2 / rr
        xm = 2 * math.pi * F_LINE * lm
        p(f"  {tag:11s} R {rr:,.1f} A/Wb  Lm {lm:.6f} H  Xm {xm:.4f} ohm  "
          f"Im {120.0 / xm:.6f} A")
    p(f"  reluctance ratio {rtg / rt:.6f}")

    problems()


def problems(loud: bool = True) -> None:  # noqa: C901 - a printout, not logic
    """The two problem sets, computed and force-checked by two routes."""
    def p(*a):
        if loud:
            print(*a)
    p("== PROBLEM SET 1")
    # P1: ungapped toroid
    lt = 2 * math.pi * 0.060
    at, mrt, nt, it = 2.5e-4, 1800.0, 400, 0.30
    r1 = reluctance(lt, at, mrt)
    f1 = nt * it
    phi1 = f1 / r1
    l1 = nt ** 2 / r1
    p(f"  P1 path {lt:.6f} m  R {r1:,.2f} A/Wb  MMF {f1:.1f} A-t")
    p(f"     flux {phi1 * 1e3:.6f} mWb  B {phi1 / at:.6f} T  L {l1:.6f} H")
    route_ok("P1 energy two ways", 0.5 * l1 * it ** 2, 0.5 * phi1 ** 2 * r1)
    p(f"     W {0.5 * l1 * it ** 2 * 1e3:.6f} mJ")
    # P2: same toroid, 0.8 mm gap, 2.0 A
    g2, i2 = 0.8e-3, 2.0
    r2i = reluctance(lt - g2, at, mrt)
    r2g = reluctance(g2, at)
    r2 = r2i + r2g
    f2 = nt * i2
    phi2 = f2 / r2
    b2 = phi2 / at
    l2 = nt ** 2 / r2
    fe = 0.5 * phi2 ** 2 / (MU0 * at)          # energy route, constant flux
    fm = b2 ** 2 * at / (2 * MU0)              # Maxwell stress on the face
    force_ok("P2 gap pull", fe, fm, rel=1e-12)
    p(f"  P2 R_iron {r2i:,.2f}  R_gap {r2g:,.2f}  R {r2:,.2f} A/Wb "
      f"(gap share {100 * r2g / r2:.3f}%)")
    p(f"     flux {phi2 * 1e3:.6f} mWb  B {b2:.6f} T  L {l2 * 1e3:.6f} mH")
    p(f"     pull {fe:.4f} N  = {fe / GRAV:.4f} kg")
    # P3: two windings on the gapped toroid
    n3 = 150
    la, lb = nt ** 2 / r2, n3 ** 2 / r2
    mm3 = nt * n3 / r2
    p(f"  P3 L1 {la * 1e3:.6f} mH  L2 {lb * 1e3:.6f} mH  M {mm3 * 1e3:.6f} mH  "
      f"k {mm3 / math.sqrt(la * lb):.6f}")
    p(f"     aiding {(la + lb + 2 * mm3) * 1e3:.6f} mH  "
      f"opposing {(la + lb - 2 * mm3) * 1e3:.6f} mH")
    # P4: E-core with the gap moved to the CENTRE limb
    rc = reluctance(E_LC - E_GAP, E_AC, E_MUR) + reluctance(E_GAP, E_AC)
    ra = reluctance(E_LO, E_AO, E_MUR)
    rtot = rc + ra / 2
    phi4 = E_N * E_I / rtot
    p(f"  P4 R_centre {rc:,.2f}  R_par {ra / 2:,.2f}  R {rtot:,.2f} A/Wb")
    p(f"     flux centre {phi4 * 1e3:.6f} mWb  B_c {phi4 / E_AC:.6f} T  "
      f"each outer {phi4 / 2 * 1e3:.6f} mWb  B_o {phi4 / 2 / E_AO:.6f} T")

    p("== PROBLEM SET 2")
    # P1: solenoid, iron neglected
    n5, i5, a5, x5 = 800, 1.5, 6.0e-4, 1.5e-3
    b5 = MU0 * n5 * i5 / x5
    f5_field = b5 ** 2 * a5 / (2 * MU0)
    f5_energy = 0.5 * i5 ** 2 * MU0 * n5 ** 2 * a5 / x5 ** 2
    force_ok("PS2-P1 solenoid", f5_energy, f5_field, rel=1e-12)
    p(f"  P1 B {b5:.6f} T  pull {f5_field:.4f} N  = {f5_field / GRAV:.4f} kg")
    # P2: reluctance rotor
    l0b, l2b, i6 = 0.080, 0.030, 8.0
    tmax = i6 ** 2 * l2b
    wm = integrate.quad(lambda t: -i6 ** 2 * l2b * math.sin(2 * t), 0, math.pi / 2,
                        epsabs=1e-14)[0]
    dwf = 0.5 * i6 ** 2 * ((l0b - l2b) - (l0b + l2b))
    wel = i6 ** 2 * ((l0b - l2b) - (l0b + l2b))
    ledger_ok("PS2-P2 rotor", wel, dwf, wm)
    force_ok("PS2-P2 peak torque", tmax, abs(wm) / 1.0, rel=1e-12)
    p(f"  P2 peak torque {tmax:.4f} N-m at 45 deg;  W_mech {wm:.4f} J  "
      f"dW_f {dwf:.4f} J  W_elec {wel:.4f} J")
    # P3: linear machine against friction
    b7, l7, v7, r7, m7, ff = 0.60, 0.80, 40.0, 0.50, 3.0, 4.0
    bl7 = b7 * l7
    i7 = ff / bl7
    e7 = v7 - i7 * r7
    vv7 = e7 / bl7
    force_ok("PS2-P3 steady force",
             (v7 * i7 - i7 ** 2 * r7) / vv7, bl7 * i7, rel=1e-12)
    ledger_ok("PS2-P3 power", v7 * i7, i7 ** 2 * r7, ff * vv7, tol=1e-9)
    p(f"  P3 B*l {bl7:.4f}  i {i7:.6f} A  e {e7:.6f} V  v {vv7:.6f} m/s")
    p(f"     Pmech {ff * vv7:.4f} W  Pin {v7 * i7:.4f} W  loss {i7 ** 2 * r7:.4f} W  "
      f"eta {100 * ff * vv7 / (v7 * i7):.4f}%")
    p(f"     stall i {v7 / r7:.4f} A  thrust {bl7 * v7 / r7:.4f} N  "
      f"net {bl7 * v7 / r7 - ff:.4f} N  a {(bl7 * v7 / r7 - ff) / m7:.6f} m/s2")
    # P4: relay with TWO gaps
    li, ai, mri, ni, ii, gi = 0.18, 2.0e-4, 3000.0, 1200, 0.25, 0.6e-3
    r8 = reluctance(li, ai, mri) + 2 * reluctance(gi, ai)
    phi8 = ni * ii / r8
    b8 = phi8 / ai
    f8_face = b8 ** 2 * ai / (2 * MU0)
    f8_energy = 0.5 * phi8 ** 2 * (2.0 / (MU0 * ai))
    force_ok("PS2-P4 relay, two faces", f8_energy, 2 * f8_face, rel=1e-12)
    hold = 12.0
    i_hold = ii * math.sqrt(hold / f8_energy)
    p(f"  P4 R_iron {reluctance(li, ai, mri):,.2f}  R_2gaps "
      f"{2 * reluctance(gi, ai):,.2f}  R {r8:,.2f} A/Wb")
    p(f"     flux {phi8 * 1e3:.6f} mWb  B {b8:.6f} T  per face {f8_face:.4f} N  "
      f"total {f8_energy:.4f} N")
    p(f"     L {ni ** 2 / r8 * 1e3:.6f} mH;  current to hold {hold:.0f} N: "
      f"{i_hold:.6f} A")


# ===========================================================================
# 5. SMALL PLOT HELPERS
# ===========================================================================
def corner(ax, mode, text, x=0.02, y=0.97, size=9, ha="left", va="top"):
    ax.text(x, y, text, transform=ax.transAxes, color=S.INK_2[mode],
            fontsize=size, ha=ha, va=va, linespacing=1.45)


def headroom(ax, frac=0.14):
    lo, hi = ax.get_ylim()
    ax.set_ylim(lo, hi + frac * (hi - lo))


# ===========================================================================
# 6. FIGURES
# ===========================================================================
@figure("sci3-reluctance-ladder")
def _reluctance_ladder(mode):
    c = S.SERIES[mode]
    g = np.linspace(0.0, 2.0e-3, 601)
    rg = g / (MU0 * A_CORE)
    share = rg / (R_CORE + rg) * 100.0
    flux = (NTURN * I_COIL) / (R_CORE + rg) * 1e3       # mWb
    bfield = flux * 1e-3 / A_CORE

    # the printed operating point, re-derived here
    i1 = int(np.argmin(abs(g - GAP)))
    assert abs(share[i1] - 100 * 25 / 31) < 0.02, share[i1]
    assert abs(flux[i1] - 1e3 * NTURN * I_COIL / R_TOT) < 1e-6

    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 6.0), sharex=True)
    gx = g * 1e3

    a1.plot(gx, share, color=c[0])
    a1.plot(gx, 100 - share, color=c[1])
    S.label_end(a1, 1.55, float(np.interp(1.55, gx, share)), "gap", c[0], mode,
                dx=0, dy=-15, ha="center")
    S.label_end(a1, 1.55, float(np.interp(1.55, gx, 100 - share)), "iron", c[1], mode,
                dx=0, dy=15, ha="center")
    a1.plot([GAP * 1e3], [share[i1]], "o", color=c[0], zorder=5)
    a1.set_ylabel("share of the 1000 A-t (%)")
    a1.set_title("Where the magnetomotive force goes")
    S.strip(a1)
    corner(a1, mode, "at g = 1.0 mm the 1 mm of air\n"
                     "carries 80.6% of the drive\n"
                     "(25/31, from the reluctance ratio)", x=0.50, y=0.68)
    a1.set_ylim(-4, 108)

    a2.plot(gx, flux, color=c[0])
    S.label_end(a2, 0.55, float(np.interp(0.55, gx, flux)), "core flux", c[0], mode,
                dx=0, dy=16, ha="center")
    a2.plot([GAP * 1e3], [flux[i1]], "o", color=c[0], zorder=5)
    a2b = flux[i1]
    a2.axhline(a2b, color=S.GUIDE[mode], lw=0.9, ls="--")
    S.note(a2, 0.05, a2b, f"  {a2b:.4f} mWb   (B = {bfield[i1]:.3f} T)", mode)
    a2.set_xlabel("air-gap length g (mm)")
    a2.set_ylabel("core flux (mWb)")
    a2.set_title("...and what it buys in flux")
    S.strip(a2)
    fig.tight_layout()
    return fig


@figure("sci3-bh-curve")
def _bh_curve(mode):
    c = S.SERIES[mode]
    h = np.linspace(0, 1600, 1601)
    b = b_of_h(h)
    bb = np.linspace(0.02, 1.72, 1701)
    mus = mur_secant(bb)
    # the flux density at which the secant permeability equals the 2500 used
    # in the linear model of section 5
    b_at_2500 = float(optimize.brentq(lambda x: mur_secant(x) - MUR, 0.05, 1.75))
    assert abs(mur_secant(b_at_2500) - MUR) < 1e-6

    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 6.2))
    a1.plot(h, b, color=c[0])
    a1.axhline(B_SAT, color=S.GUIDE[mode], lw=0.9, ls="--")
    S.note(a1, 20, B_SAT, f"  saturation, {B_SAT:.1f} T", mode)
    h_ref = float(h_of_b(b_at_2500))
    a1.plot([h_ref], [b_at_2500], "o", color=c[1], zorder=5)
    S.label_end(a1, h_ref, b_at_2500,
                f"  secant $\\mu_r$ = 2500 here\n  ({h_ref:.0f} A/m, {b_at_2500:.2f} T)",
                c[1], mode, dx=6, dy=-14)
    a1.set_xlabel("magnetic field strength H (A/m)")
    a1.set_ylabel("flux density B (T)")
    a1.set_title("The magnetisation curve is not a straight line")
    a1.set_ylim(0, B_SAT * 1.12)
    S.strip(a1)

    a2.plot(bb, mus, color=c[0])
    a2.plot([b_at_2500], [MUR], "o", color=c[1], zorder=5)
    a2.axhline(MUR, color=S.GUIDE[mode], lw=0.9, ls="--")
    S.note(a2, 0.05, MUR, "  the 2500 used in the linear model", mode)
    S.label_end(a2, 0.62, float(np.interp(0.62, bb, mus)), "secant $\\mu_r$", c[0],
                mode, dx=0, dy=16, ha="center")
    a2.set_xlabel("flux density B (T)")
    a2.set_ylabel("relative permeability $B/(\\mu_0 H)$")
    a2.set_title("Permeability is an operating point, not a material constant")
    S.strip(a2)
    fig.tight_layout()
    return fig


@figure("sci3-hysteresis-loop")
def _hysteresis_loop(mode):
    c = S.SERIES[mode]
    b = np.linspace(-B_DRIVE, B_DRIVE, 4001)
    h_up, h_dn = loop_h(b, +1), loop_h(b, -1)
    area = 8.0 * H_COERCIVE * B_DRIVE / 3.0
    area_num = float(np.trapz(h_up - h_dn, b))
    assert abs(area_num - area) / area < 1e-6, (area_num, area)
    b_rem = float(optimize.brentq(lambda x: loop_h(x, +1), -B_DRIVE * 0.999, 0.0))

    fig, ax = plt.subplots(figsize=(7.2, 5.0))
    ax.fill(np.concatenate([h_up, h_dn[::-1]]),
            np.concatenate([b, b[::-1]]), color=c[0], alpha=0.16, lw=0)
    ax.plot(h_up, b, color=c[0])
    ax.plot(h_dn, b, color=c[0])
    ax.plot(h_of_b(b), b, color=c[1], lw=1.3, ls="--")
    S.label_end(ax, float(h_of_b(1.2)), 1.2, "  anhysteretic", c[1], mode, dy=-10)
    ax.axhline(0, color=S.GRID[mode], lw=0.9)
    ax.axvline(0, color=S.GRID[mode], lw=0.9)
    ax.plot([H_COERCIVE, -H_COERCIVE], [0, 0], "o", color=c[0], zorder=5)
    ax.plot([0, 0], [b_rem, -b_rem], "o", color=c[0], zorder=5)
    S.note(ax, H_COERCIVE + 25, -0.10, f"$H_c$ = {H_COERCIVE:.0f} A/m", mode)
    S.note(ax, -640, abs(b_rem) + 0.06,
           f"$B_r$ = {abs(b_rem):.3f} T", mode)
    ax.set_xlabel("magnetic field strength H (A/m)")
    ax.set_ylabel("flux density B (T)")
    ax.set_title("One cycle of the loop; the shaded area is the loss")
    corner(ax, mode,
           f"$\\oint H\\,dB$ = {area:.1f} J/m$^3$ per cycle\n"
           f"at {F_LINE:.0f} Hz that is {area * F_LINE:,.0f} W/m$^3$\n"
           f"= {area * F_LINE / DENS_STEEL:.3f} W/kg")
    S.strip(ax)
    fig.tight_layout()
    return fig


def eddy_density(d, f, bm):
    return math.pi ** 2 * d ** 2 * f ** 2 * bm ** 2 / (6.0 * RHO_STEEL)


@figure("sci3-core-loss")
def _core_loss(mode):
    c = S.SERIES[mode]
    f = np.linspace(20.0, 400.0, 501)
    area = 8.0 * H_COERCIVE * B_DRIVE / 3.0
    ph = area * f
    pe1 = np.array([eddy_density(D_LAM, x, B_DRIVE) for x in f])
    pe2 = np.array([eddy_density(D_LAM2, x, B_DRIVE) for x in f])
    ke = eddy_density(D_LAM, 1.0, B_DRIVE)
    f_cross = area / ke
    assert abs(area * f_cross - eddy_density(D_LAM, f_cross, B_DRIVE)) < 1e-6
    assert abs(pe2[10] / pe1[10] - (D_LAM2 / D_LAM) ** 2) < 1e-9

    fig, ax = plt.subplots(figsize=(7.2, 4.6))
    ax.plot(f, ph * 1e-3, color=c[0])
    ax.plot(f, pe1 * 1e-3, color=c[1])
    ax.plot(f, pe2 * 1e-3, color=c[2])
    S.label_end(ax, 355.0, float(np.interp(355.0, f, ph)) * 1e-3,
                "hysteresis ($\\propto f$)", c[0], mode, dx=0, dy=-18, ha="center")
    S.label_end(ax, 330.0, float(np.interp(330.0, f, pe1)) * 1e-3, "eddy, 0.35 mm",
                c[1], mode, dx=0, dy=-16, ha="center")
    S.label_end(ax, 268.0, float(np.interp(268.0, f, pe2)) * 1e-3,
                "eddy, 0.50 mm ($\\propto d^2f^2$)", c[2], mode, dx=0, dy=14,
                ha="center")
    ax.plot([f_cross], [area * f_cross * 1e-3], "o", color=S.INK_2[mode], zorder=6)
    S.note(ax, f_cross - 6, area * f_cross * 1e-3 + 14,
           f"the two are equal at {f_cross:.0f} Hz", mode, ha="right")
    ax.set_xlabel("frequency (Hz)")
    ax.set_ylabel("loss density (kW/m$^3$)")
    ax.set_title(f"Core loss at $B_m$ = {B_DRIVE:.1f} T: one term is linear, one square")
    ax.set_ylim(0, 350)
    S.strip(ax)
    fig.tight_layout()
    return fig


@figure("sci3-coenergy")
def _coenergy(mode):
    c = S.SERIES[mode]
    # ungapped core, saturating: i(B) and lambda(B)
    b = np.linspace(0.0, B_DRIVE, 3001)
    i = L_CORE * h_of_b(b) / NTURN
    lam = NTURN * A_CORE * b
    i_top, lam_top = float(i[-1]), float(lam[-1])
    prod = i_top * lam_top
    w_f = float(np.trapz(i, lam))
    w_c = prod - w_f
    # closed form for the field energy: integral of tan is -ln cos
    a = math.pi / (2 * B_SAT)
    w_closed = (NTURN * A_CORE) * (L_CORE / NTURN) * (2 * B_SAT / (math.pi * MU_INIT)) \
        * (-math.log(math.cos(a * B_DRIVE)) / a)
    assert abs(w_f - w_closed) / w_closed < 1e-6, (w_f, w_closed)
    assert w_c > w_f

    fig, ax = plt.subplots(figsize=(7.2, 4.8))
    ax.fill_between(i, lam, lam_top, color=c[0], alpha=0.18, lw=0)
    ax.fill_between(i, 0, lam, color=c[1], alpha=0.18, lw=0)
    ax.plot(i, lam, color=S.INK[mode], lw=2.0)
    ax.plot([0, i_top], [0, lam_top], color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, i_top * 0.30, lam_top * 0.80,
           f"$W_f$ = {w_f:.4f} J", mode, size=10)
    S.note(ax, i_top * 0.62, lam_top * 0.24,
           f"$W'$ = {w_c:.4f} J", mode, size=10)
    ax.plot([i_top], [lam_top], "o", color=S.INK[mode], zorder=6)
    ax.set_xlabel("coil current $i$ (A)")
    ax.set_ylabel("flux linkage $\\lambda$ (Wb-turns)")
    ax.set_title("Energy sits above the curve, co-energy below")
    corner(ax, mode,
           f"$\\lambda i$ = {prod:.4f} J\n"
           f"$W_f + W'$ = {w_f + w_c:.4f} J\n"
           f"$W'/W_f$ = {w_c / w_f:.3f}  (1.000 if linear)")
    ax.set_xlim(0, i_top * 1.05)
    ax.set_ylim(0, lam_top * 1.16)
    S.strip(ax)
    fig.tight_layout()
    return fig


@figure("sci3-actuator-force")
def _actuator_force(mode):
    c = S.SERIES[mode]
    x = np.linspace(0.2e-3, 3.0e-3, 401)
    f_real = np.array([-force_energy(l_real, float(v)) for v in x])
    f_ideal = np.array([-force_energy(l_ideal, float(v)) for v in x])
    marks = np.array([0.4e-3, 0.7e-3, 1.0e-3, 1.5e-3, 2.0e-3, 2.6e-3])
    f_mark = np.array([force_maxwell(l_real, float(v)) for v in marks])
    for v, fm in zip(marks, f_mark):
        assert abs(fm + force_energy(l_real, float(v))) / fm < 1e-6

    fig, ax = plt.subplots(figsize=(7.2, 4.8))
    ax.plot(x * 1e3, f_ideal, color=c[1], ls="--")
    ax.plot(x * 1e3, f_real, color=c[0])
    ax.plot(marks * 1e3, f_mark, "o", color=S.INK[mode], ms=6.5, zorder=6,
            mfc="none", mew=1.6)
    S.label_end(ax, 2.2, float(np.interp(2.2, x * 1e3, f_ideal)),
                "iron ignored ($\\propto 1/x^2$)", c[1], mode, dx=0, dy=16, ha="center")
    S.label_end(ax, 2.2, float(np.interp(2.2, x * 1e3, f_real)), "iron kept", c[0],
                mode, dx=0, dy=-16, ha="center")
    ax.set_xlabel("air-gap length $x$ (mm)")
    ax.set_ylabel("pull on the plunger (N)")
    ax.set_title("Force from $\\frac{1}{2}i^2\\,dL/dx$; circles are Maxwell stress")
    corner(ax, mode, "line: energy method\ncircles: $B^2A/2\\mu_0$ on the pole face\n"
                     "they agree to 1 part in $10^6$", x=0.42, y=0.97)
    ax.set_yscale("log")
    ax.set_ylim(20, float(f_ideal[0]) * 1.6)
    S.strip(ax)
    fig.tight_layout()
    return fig


@figure("sci3-reluctance-torque")
def _reluctance_torque(mode):
    c = S.SERIES[mode]
    th = np.linspace(0, math.pi, 601)
    lrot = L0_ROT + L2_ROT * np.cos(2 * th)
    trq = -I_ROT ** 2 * L2_ROT * np.sin(2 * th)
    marks = np.radians(np.array([15.0, 30.0, 45.0, 60.0, 75.0, 105.0, 135.0]))
    h = 1e-7
    t_num = np.array([0.5 * I_ROT ** 2
                      * ((L0_ROT + L2_ROT * math.cos(2 * (t + h)))
                         - (L0_ROT + L2_ROT * math.cos(2 * (t - h)))) / (2 * h)
                      for t in marks])
    assert np.max(np.abs(t_num + I_ROT ** 2 * L2_ROT * np.sin(2 * marks))) < 1e-6

    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 6.0), sharex=True)
    d = np.degrees(th)
    a1.plot(d, lrot * 1e3, color=c[0])
    S.label_end(a1, 150.0, float(np.interp(150.0, d, lrot * 1e3)), "$L(\\theta)$",
                c[0], mode, dx=0, dy=-16, ha="center")
    a1.set_ylabel("inductance (mH)")
    a1.set_title("Salient rotor: inductance varies, so torque exists")
    S.strip(a1)

    a2.plot(d, trq, color=c[1])
    a2.plot(np.degrees(marks), t_num, "o", color=S.INK[mode], ms=6.5, mfc="none",
            mew=1.6, zorder=6)
    a2.axhline(0, color=S.GRID[mode], lw=0.9)
    S.label_end(a2, 150.0, float(np.interp(150.0, d, trq)), "$\\tau(\\theta)$", c[1],
                mode, dx=0, dy=-16, ha="center")
    a2.set_xlabel("rotor angle $\\theta$ (degrees)")
    a2.set_ylabel("torque (N$\\cdot$m)")
    a2.set_title("Torque pulls the rotor toward maximum inductance")
    corner(a2, mode, "line: $-i^2L_2\\sin 2\\theta$\ncircles: $\\frac{1}{2}i^2\\,dL/d\\theta$"
                     " by central difference", x=0.03, y=0.97)
    a2.set_xticks([0, 45, 90, 135, 180])
    S.strip(a2)
    fig.tight_layout()
    return fig


@figure("sci3-linear-machine")
def _linear_machine(mode):
    c = S.SERIES[mode]
    bl = B_RAIL * ELL_RAIL
    v_ss = V_RAIL / bl
    tau = MASS_RAIL * R_RAIL / bl ** 2
    i0 = V_RAIL / R_RAIL
    t = np.linspace(0, 5 * tau, 1201)
    v = v_ss * (1 - np.exp(-t / tau))
    i = i0 * np.exp(-t / tau)
    assert abs(v[-1] - v_ss * (1 - math.exp(-5))) < 1e-9
    assert abs(0.5 * MASS_RAIL * v_ss ** 2 - 3600.0) < 1e-9

    w_in = V_RAIL * i0 * tau * (1 - np.exp(-t / tau))
    w_kin = 0.5 * MASS_RAIL * v ** 2
    w_loss = R_RAIL * i0 ** 2 * (tau / 2) * (1 - np.exp(-2 * t / tau))
    assert np.max(np.abs(w_in - w_kin - w_loss)) < 1e-9

    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 6.2), sharex=True)
    a1.plot(t, v, color=c[0])
    a1.plot(t, i, color=c[1])
    a1.axhline(v_ss, color=S.GUIDE[mode], lw=0.9, ls="--")
    S.label_end(a1, 17.0, float(np.interp(17.0, t, v)), "$v$ (m/s)", c[0], mode,
                dx=0, dy=-16, ha="center")
    S.label_end(a1, 8.0, float(np.interp(8.0, t, i)), "$i$ (A)", c[1], mode,
                dx=0, dy=14, ha="center")
    S.note(a1, 0.1, v_ss, f"  {v_ss:.0f} m/s and 0 A: the bar coasts", mode)
    a1.set_ylabel("speed (m/s) and current (A)")
    a1.set_title(f"Rail bar from rest: $\\tau$ = {tau:.1f} s")
    S.strip(a1)
    headroom(a1, 0.12)

    a2.plot(t, w_in, color=c[0])
    a2.plot(t, w_kin, color=c[1])
    a2.plot(t, w_loss, color=c[2])
    S.label_end(a2, 16.0, float(np.interp(16.0, t, w_in)), "supplied", c[0], mode,
                dx=0, dy=16, ha="center")
    S.label_end(a2, 13.0, float(np.interp(13.0, t, w_kin)), "kinetic", c[1], mode,
                dx=0, dy=-16, ha="center")
    S.label_end(a2, 6.0, float(np.interp(6.0, t, w_loss)), "in $R$", c[2], mode,
                dx=0, dy=14, ha="center")
    a2.set_xlabel("time (s)")
    a2.set_ylabel("energy (J)")
    a2.set_title("The ledger closes, and it splits exactly in half")
    corner(a2, mode, "7200 J supplied, 3600 J kinetic,\n3600 J in the resistance",
           x=0.02, y=0.97)
    S.strip(a2)
    headroom(a2, 0.16)
    fig.tight_layout()
    return fig


@figure("sci3-parallel-core")
def _parallel_core(mode):
    c = S.SERIES[mode]
    r_c = reluctance(E_LC, E_AC, E_MUR)
    r_a = reluctance(E_LO, E_AO, E_MUR)
    gaps = np.linspace(0.0, 1.0e-3, 501)
    phi_a, phi_b, mmf_par = [], [], []
    for g in gaps:
        r_b = reluctance(E_LO - g, E_AO, E_MUR) + reluctance(g, E_AO)
        r_par = r_a * r_b / (r_a + r_b)
        phi = E_N * E_I / (r_c + r_par)
        fa = phi * r_par
        phi_a.append(fa / r_a)
        phi_b.append(fa / r_b)
        mmf_par.append(fa)
    phi_a = np.array(phi_a) * 1e3
    phi_b = np.array(phi_b) * 1e3
    k = int(np.argmin(abs(gaps - E_GAP)))
    # the two branches must always carry the same MMF, and sum to the total
    for j in (0, k, len(gaps) - 1):
        g = gaps[j]
        r_b = reluctance(E_LO - g, E_AO, E_MUR) + reluctance(g, E_AO)
        assert abs((phi_a[j] * 1e-3) * r_a - (phi_b[j] * 1e-3) * r_b) < 1e-6
        assert abs((phi_a[j] + phi_b[j]) * 1e-3 * r_c + mmf_par[j] - E_N * E_I) < 1e-6

    fig, ax = plt.subplots(figsize=(7.2, 4.6))
    ax.plot(gaps * 1e3, phi_a, color=c[0])
    ax.plot(gaps * 1e3, phi_b, color=c[1])
    ax.plot(gaps * 1e3, phi_a + phi_b, color=c[2])
    S.label_end(ax, 0.80, float(np.interp(0.80, gaps * 1e3, phi_a)), "solid limb",
                c[0], mode, dx=0, dy=-16, ha="center")
    S.label_end(ax, 0.80, float(np.interp(0.80, gaps * 1e3, phi_b)), "gapped limb",
                c[1], mode, dx=0, dy=-16, ha="center")
    S.label_end(ax, 0.80, float(np.interp(0.80, gaps * 1e3, phi_a + phi_b)),
                "centre limb", c[2], mode, dx=0, dy=16, ha="center")
    ax.plot([E_GAP * 1e3] * 3, [phi_a[k], phi_b[k], phi_a[k] + phi_b[k]], "o",
            color=S.INK[mode], ms=6, mfc="none", mew=1.5, zorder=6)
    ax.set_xlabel("gap cut into one outer limb (mm)")
    ax.set_ylabel("flux (mWb)")
    ax.set_title("A gap in one branch diverts flux into the other")
    corner(ax, mode,
           f"at 0.5 mm: {phi_a[k]:.4f} mWb solid,\n{phi_b[k]:.4f} mWb gapped\n"
           f"({100 * phi_a[k] / (phi_a[k] + phi_b[k]):.1f}% takes the easy path)",
           x=0.44, y=0.95)
    S.strip(ax)
    fig.tight_layout()
    return fig


# ===========================================================================
def render(name: str, fn) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for mode, suffix in (("light", ".svg"), ("dark", ".dark.svg")):
        S.apply(mode)
        fig = fn(mode)
        fig.savefig(OUT / f"{name}{suffix}", format="svg", transparent=True,
                    bbox_inches="tight")
        plt.close(fig)


def main() -> int:
    args = sys.argv[1:]
    verify()
    if "--numbers" in args:
        print()
        numbers()
        return 0
    if "--verify" in args:
        return 0
    prefix = next((a for a in args if not a.startswith("-")), PREFIX)
    names = [n for n in REGISTRY if n.startswith(prefix)]
    if not names:
        print(f"no figures match {prefix!r}; known: {sorted(REGISTRY)}")
        return 1
    for n in sorted(names):
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
