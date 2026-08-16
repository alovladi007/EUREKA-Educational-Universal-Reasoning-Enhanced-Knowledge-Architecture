#!/usr/bin/env python3
"""Depth-wave figures for the FE Electrical and Computer course:
the Conductors and Semiconductors chapters of Properties of Electrical
Materials.

Same contract as gen_fe_ee_e2.py, and it imports the SAME style module rather
than growing a second look. Every curve here is COMPUTED, in this file, from an
equation the lesson that references it writes out. Nothing is traced, scanned,
redrawn or adapted from the NCEES Reference Handbook or any study guide: the
pipeline consumes formulas, which are not protected expression, and never
anyone's drawing of them.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/mat2-<name>.svg
    apps/web/public/courses/fe-ee/figures/mat2-<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Every figure asserts the numbers the lesson quotes from it, at the last quoted
digit or tighter. Closed-form quantities are asserted at 1e-9; quantities the
lesson rounds are asserted against the unrounded value to well inside the
rounding step, so an assertion cannot pass on a figure that disagrees with the
prose.

CONSTANTS (stated once, used everywhere, and stated again in the lessons):
    q    = 1.602176634e-19 C        exact, SI 2019
    k    = 1.380649e-23 J/K         exact, SI 2019
         = 8.617333262e-5 eV/K
    mu0  = 4*pi*1e-7 H/m            magnetic constant to 1e-10 relative
    eps0 = 8.8541878128e-12 F/m     CODATA 2018
    N_A  = 6.02214076e23 /mol       exact, SI 2019
Material values are tabulated room-temperature figures, named at each use.

Usage:
    python3 scripts/gen_fe_ee_d12.py             # all
    python3 scripts/gen_fe_ee_d12.py mat2-skin   # only names with that prefix
"""
from __future__ import annotations

import math
import pathlib
import sys

import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from scipy.special import ber, bei, berp, beip  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

# --- physical constants -----------------------------------------------------
Q = 1.602176634e-19          # C
KB = 1.380649e-23            # J/K
K_EV = 8.617333262e-5        # eV/K
MU0 = 4e-7 * math.pi         # H/m
EPS0 = 8.8541878128e-12      # F/m
N_AVO = 6.02214076e23        # /mol
M_E = 9.1093837015e-31       # kg

# --- tabulated material values, at 20 C for metals, 300 K for silicon -------
RHO_CU = 1.724e-8            # ohm.m, IACS annealed-copper standard
RHO_AL = 2.83e-8             # ohm.m, electrical-conductor grade (61% IACS)
RHO_AG = 1.59e-8             # ohm.m
ALPHA_CU = 0.00393           # /degC referenced to 20 C
ALPHA_AL = 0.00403           # /degC
ALPHA_AG = 0.00380           # /degC
RHO_NICHROME = 1.10e-6       # ohm.m, 80Ni-20Cr heater alloy
ALPHA_NICHROME = 0.0004      # /degC
RHO_CONSTANTAN = 4.9e-7      # ohm.m, 55Cu-45Ni resistance alloy
ALPHA_CONSTANTAN = 0.00002   # /degC
RHO_STEEL = 1.6e-7           # ohm.m, low-carbon steel
MUR_STEEL = 100.0            # assumed relative permeability at power-frequency flux
DENS_CU = 8960.0             # kg/m3
MOLAR_CU = 63.546            # g/mol
C_CU = 385.0                 # J/(kg.K)

NI_SI_300 = 1.5e10           # /cm3, the value this course uses throughout
NI_GE_300 = 2.4e13           # /cm3
EG_SI = 1.12                 # eV at 300 K
EG_GE = 0.66                 # eV at 300 K
MU_N_SI = 1350.0             # cm2/(V.s), lightly doped
MU_P_SI = 480.0              # cm2/(V.s), lightly doped
EPS_R_SI = 11.7

VT300 = KB * 300.0 / Q       # 0.0258519997... V

REGISTRY: dict[str, callable] = {}


def figure(name):
    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


def awg_diameter_mm(gauge: float) -> float:
    """AWG definition: 36 AWG is 0.005 in and 0000 (-3) is 0.460 in, with 39
    equal geometric steps between them. 0.127 mm is 0.005 in exactly."""
    return 0.127 * 92.0 ** ((36.0 - gauge) / 39.0)


def awg_area_m2(gauge: float) -> float:
    d = awg_diameter_mm(gauge) * 1e-3
    return math.pi * d * d / 4.0


def skin_depth(rho: float, f: float, mu: float = MU0) -> float:
    return math.sqrt(rho / (math.pi * f * mu))


def ni_of_T(T, ni300: float, eg: float):
    """n_i(T) = n_i(300) (T/300)^1.5 exp[(Eg/2k)(1/300 - 1/T)].

    Written as a ratio to the tabulated 300 K anchor so the result never
    depends on effective-mass prefactors the lesson does not state.
    """
    return ni300 * (T / 300.0) ** 1.5 * np.exp((eg / (2.0 * K_EV)) * (1.0 / 300.0 - 1.0 / T))


# ---------------------------------------------------------------------------
# Conductors
# ---------------------------------------------------------------------------


@figure("mat2-drift-velocity")
def _(mode):
    """Drift velocity against current for three copper conductor sizes.

    v_d = I/(n q A) with n = rho_m N_A / M = 8.49e28 /m3 for copper. The whole
    point is the scale: tens of amps move the electron sea at fractions of a
    millimetre per second, in a wire whose signal front travels at a
    substantial fraction of c.
    """
    c = S.SERIES[mode]
    n_cu = DENS_CU * 1e3 / MOLAR_CU * N_AVO
    assert abs(n_cu - 8.491231739149593e28) / 8.491231739149593e28 < 1e-12, n_cu
    nq = n_cu * Q
    assert abs(nq - 1.3604453086344662e10) / 1.3604453086344662e10 < 1e-12, nq

    I = np.linspace(0, 250, 800)
    fig, ax = plt.subplots()
    for k, (gauge, tag) in enumerate(((12, "AWG 12"), (6, "AWG 6"), (-3, "4/0 AWG"))):
        A = awg_area_m2(gauge)
        v = I / (nq * A) * 1e3     # mm/s
        ax.plot(I, v, color=c[k], lw=2.2)
        S.label_end(ax, I[-1], v[-1], tag, c[k], mode, dx=6)

    A12 = awg_area_m2(12)
    assert abs(A12 - 3.3087728761114766e-6) < 1e-18, A12    # lesson prints 3.309 mm2
    v20 = 20.0 / (nq * A12) * 1e3
    assert abs(v20 - 0.4443057680595868) < 1e-12, v20       # lesson prints 0.444 mm/s
    v_4o = 200.0 / (nq * awg_area_m2(-3)) * 1e3
    assert abs(v_4o - 0.13711214666773786) < 1e-12, v_4o    # lesson prints 0.137 mm/s
    assert abs(10.0 / (v20 * 1e-3) / 3600.0 - 6.25195074533726) < 1e-9   # prints 6.25 h

    ax.plot([20.0], [v20], "o", color=c[0], ms=7)
    S.note(ax, 8, 5.25, "20 A in AWG 12: 0.444 mm/s -\nsix hours and a quarter to cross a ten-metre run,\nwhile the signal front covers it in nanoseconds", mode)
    ax.plot([200.0], [v_4o], "o", color=c[2], ms=7)
    S.note(ax, 196, 0.42, "200 A in 4/0: 0.137 mm/s", mode, ha="right")
    ax.set_xlabel("conductor current  I  (A)")
    ax.set_ylabel("electron drift velocity  (mm/s)")
    ax.set_title("Charge crawls: v = I/(nqA) in copper, n = 8.49e28 per cubic metre")
    ax.set_xlim(0, 285)
    ax.set_ylim(0, 6.2)
    S.strip(ax)
    return fig


@figure("mat2-tempco-metals")
def _(mode):
    """Linear resistance-temperature law for three conductor metals.

    R(T)/R(20) = 1 + alpha (T - 20), extended below the data range to its own
    zero crossing. The intercept T_inf = 20 - 1/alpha is the "inferred zero"
    that turns the one-reference law into the two-point ratio form.
    """
    c = S.SERIES[mode]
    T = np.linspace(-250.0, 250.0, 900)
    rows = ((ALPHA_CU, "copper, alpha = 0.00393/degC"),
            (ALPHA_NICHROME, "nichrome 80/20, 0.0004"),
            (ALPHA_CONSTANTAN, "constantan, 0.00002"))
    fig, ax = plt.subplots()
    for k, (a, tag) in enumerate(rows):
        ax.plot(T, 1.0 + a * (T - 20.0), color=c[k], lw=2.2)
        S.label_end(ax, 250.0, 1.0 + a * 230.0, tag, c[k], mode, dx=6,
                    dy=[0, 8, -8][k])

    r75 = 1.0 + ALPHA_CU * 55.0
    assert abs(r75 - 1.21615) < 1e-12, r75
    r90 = 1.0 + ALPHA_CU * 70.0
    assert abs(r90 - 1.27510) < 1e-12, r90
    tinf_cu = 20.0 - 1.0 / ALPHA_CU
    assert abs(tinf_cu + 234.45292620865138) < 1e-9, tinf_cu
    tinf_al = 20.0 - 1.0 / ALPHA_AL
    assert abs(tinf_al + 228.1389578163772) < 1e-9, tinf_al
    # the two-point form must reproduce the one-reference form exactly
    assert abs((234.45292620865138 + 75.0) / (234.45292620865138 + 20.0) - r75) < 1e-12
    # over the same 230 degC span the alloys move by a few percent
    assert abs(ALPHA_NICHROME * 230.0 - 0.092) < 1e-12
    assert abs(ALPHA_CONSTANTAN * 230.0 - 0.0046) < 1e-12

    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0, ls="-")
    ax.plot([75.0], [r75], "o", color=c[0], ms=7)
    S.note(ax, 128, 0.62, "copper at 75 degC:\n1.216 x its 20 degC value", mode)
    ax.plot([tinf_cu], [0.0], "o", color=c[0], ms=7)
    S.note(ax, 26, 0.10, "inferred zero -234.5 degC: where the STRAIGHT LINE\nhits zero, not where the metal does", mode)
    S.note(ax, -245, 1.74, "the alloys are chosen for flatness: over the same\n230 degC swing nichrome moves 9.2%, constantan 0.46%", mode)
    ax.set_xlabel("temperature  T  (degrees C)")
    ax.set_ylabel("resistance as a fraction of its 20 degC value")
    ax.set_title("The linear law, the intercept it hides, and why alloys stay flat")
    ax.set_xlim(-250, 380)
    ax.set_ylim(-0.05, 2.05)
    S.strip(ax)
    return fig


@figure("mat2-skin-depth")
def _(mode):
    """Skin depth against frequency for three conductor materials.

    delta = sqrt(rho/(pi f mu)). Copper and aluminium take mu = mu0; the steel
    curve takes mu = 100 mu0, an ASSUMED representative relative permeability
    for low-carbon steel at power-frequency flux levels, stated here and in the
    lesson because it is a modelling choice rather than a measured constant.
    On log-log the law is a straight line of slope -1/2, so every factor of 100
    in frequency costs a factor of 10 in depth.
    """
    c = S.SERIES[mode]
    f = np.logspace(1, 7, 700)
    rows = ((RHO_CU, MU0, "copper"),
            (RHO_AL, MU0, "aluminium"),
            (RHO_STEEL, MUR_STEEL * MU0, "steel, mu_r = 100"))
    fig, ax = plt.subplots()
    for k, (rho, mu, tag) in enumerate(rows):
        d = np.sqrt(rho / (math.pi * f * mu)) * 1e3
        ax.plot(f, d, color=c[k], lw=2.2)
        S.label_end(ax, f[-1], d[-1], tag, c[k], mode, dx=6, dy=[15, -9, 0][k])

    d60 = skin_depth(RHO_CU, 60.0) * 1e3
    assert abs(d60 - 8.531259202666352) < 1e-12, d60         # lesson prints 8.53 mm
    d1k = skin_depth(RHO_CU, 1e3) * 1e3
    assert abs(d1k - 2.0897231909955822) < 1e-12, d1k        # lesson prints 2.09 mm
    d100k = skin_depth(RHO_CU, 1e5) * 1e3
    assert abs(d100k - 0.2089723190995582) < 1e-15, d100k    # lesson prints 0.209 mm
    d1M = skin_depth(RHO_CU, 1e6) * 1e3
    assert abs(d1M - 0.06608284962821108) < 1e-15, d1M       # lesson prints 66.1 um
    assert abs(skin_depth(RHO_AL, 60.0) * 1e3 - 10.93044200287695) < 1e-12  # 10.93 mm
    assert abs(skin_depth(RHO_AG, 60.0) * 1e3 - 8.193002145919943) < 1e-12  # 8.19 mm
    dst = skin_depth(RHO_STEEL, 60.0, MUR_STEEL * MU0) * 1e3
    assert abs(dst - 2.598989337445587) < 1e-12, dst         # lesson prints 2.60 mm
    # slope check: a decade of frequency must cost exactly sqrt(10)
    assert abs(d1k / d100k - math.sqrt(100.0)) < 1e-12

    ax.plot([60.0], [d60], "o", color=c[0], ms=7)
    ax.plot([1e5], [d100k], "o", color=c[0], ms=7)
    ax.plot([60.0], [dst], "o", color=c[2], ms=7)
    S.note(ax, 95, 14.0, "60 Hz: 8.53 mm of copper", mode)
    S.note(ax, 12, 0.030, "steel at 60 Hz: only 2.60 mm - worse resistivity AND\na thinner skin, because mu sits under the same root", mode)
    S.note(ax, 1.4e5, 0.25, "100 kHz: 0.209 mm", mode)
    S.note(ax, 12, 0.0042, "slope -1/2 on log-log:\n100x the frequency, 1/10 the depth", mode)
    ax.set_xscale("log")
    ax.set_yscale("log")
    ax.set_xlabel("frequency  f  (Hz)")
    ax.set_ylabel("skin depth  delta  (mm)")
    ax.set_title("Skin depth: sqrt(rho/(pi f mu)), and what permeability does to it")
    ax.set_xlim(10, 5e7)
    ax.set_ylim(2e-3, 60)
    S.strip(ax)
    return fig


@figure("mat2-ac-resistance")
def _(mode):
    """AC-to-DC resistance ratio against frequency for three conductor sizes.

    Ordinate is the exact cylindrical solution written with Kelvin functions,
    R_ac/R_dc = (q/2)(ber q bei' q - bei q ber' q)/(ber'^2 q + bei'^2 q) with
    q = sqrt(2) a/delta. The asserts also check the two closed forms the lesson
    hands a reader - the uniform-shell model a^2/(delta(2a - delta)) and the
    large-argument asymptote a/(2 delta) + 1/4 + 3 delta/(32 a) - against the
    exact value, because those are the numbers the prose quotes.
    """
    c = S.SERIES[mode]

    def exact(x):                      # x = a/delta
        qq = math.sqrt(2.0) * x
        num = ber(qq) * beip(qq) - bei(qq) * berp(qq)
        den = berp(qq) ** 2 + beip(qq) ** 2
        return (qq / 2.0) * num / den

    e_lo = exact(1.0)
    assert abs(e_lo - 1.0204923888556225) < 1e-9, e_lo       # lesson prints 1.020
    e_hi = exact(7.566)
    assert abs(e_hi - 4.04521554098783) < 1e-9, e_hi         # lesson prints 4.045
    s_hi = 7.566 ** 2 / (2 * 7.566 - 1.0)
    assert abs(s_hi - 4.050690348146051) < 1e-9, s_hi        # lesson prints 4.051
    a_hi = 7.566 / 2 + 0.25 + 3.0 / (32 * 7.566)
    assert abs(a_hi - 4.045390959555908) < 1e-9, a_hi        # lesson prints 4.045
    assert 0.00135 < abs(s_hi - e_hi) / e_hi < 0.00136       # lesson claims 0.14%
    # AWG 12 at 100 kHz
    x12 = (awg_diameter_mm(12) / 2.0) / (skin_depth(RHO_CU, 1e5) * 1e3)
    assert abs(x12 - 4.910998254070405) < 1e-12, x12         # lesson prints 4.911
    assert abs(exact(x12) - 2.7239824146581806) < 1e-9, exact(x12)    # prints 2.724
    assert abs(x12 * x12 / (2 * x12 - 1.0) - 2.7338373835476943) < 1e-9  # prints 2.734

    f = np.logspace(1, 6, 420)
    fig, ax = plt.subplots()
    for k, (gauge, tag) in enumerate(((12, "AWG 12"), (6, "AWG 6"), (-3, "4/0 AWG"))):
        a = awg_diameter_mm(gauge) / 2.0 * 1e-3
        ratio = np.array([exact(a / skin_depth(RHO_CU, fv)) for fv in f])
        ax.plot(f, ratio, color=c[k], lw=2.3)
        j = int(np.searchsorted(ratio, 7.4))
        S.label_end(ax, f[min(j, len(f) - 1)], 7.6, tag, c[k], mode, dx=0, dy=4, ha="center")

    def ratio_at(gauge, freq):
        a = awg_diameter_mm(gauge) / 2.0 * 1e-3
        return exact(a / skin_depth(RHO_CU, freq))

    r_4o_60 = ratio_at(-3, 60.0)
    assert abs(r_4o_60 - 1.0045641968752859) < 1e-9, r_4o_60      # lesson prints 1.005
    r_4o_1k = ratio_at(-3, 1e3)
    assert abs(r_4o_1k - 1.6605201201096778) < 1e-9, r_4o_1k      # lesson prints 1.661
    r_12_60 = ratio_at(12, 60.0)
    assert abs(r_12_60 - 1.0000043625344208) < 1e-9, r_12_60      # lesson prints 1.000004
    r_12_100k = ratio_at(12, 1e5)
    assert abs(r_12_100k - 2.7239824146581806) < 1e-9, r_12_100k  # lesson prints 2.724
    r_6_100k = ratio_at(6, 1e5)
    assert abs(r_6_100k - 5.182797270862497) < 1e-9, r_6_100k     # lesson prints 5.183

    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.plot([60.0], [r_4o_60], "o", color=c[2], ms=7)
    S.note(ax, 12, 1.55, "at 60 Hz even 4/0 is only 0.5% worse than DC", mode)
    ax.plot([1e5], [r_12_100k], "o", color=c[0], ms=7)
    S.note(ax, 1.1e5, 2.4, "AWG 12 at 100 kHz:\na/delta = 4.911, R_ac/R_dc = 2.724", mode)
    S.note(ax, 12, 6.4, "the ratio can never fall below 1: a wire\nthinner than a skin depth is filled by AC too", mode)
    ax.set_xscale("log")
    ax.set_xlabel("frequency  f  (Hz)")
    ax.set_ylabel("R_ac / R_dc  (exact cylindrical solution)")
    ax.set_title("What frequency does to a round copper wire's usable area")
    ax.set_xlim(10, 1e6)
    ax.set_ylim(0.6, 8.4)
    S.strip(ax)
    return fig


@figure("mat2-ampacity-rise")
def _(mode):
    """Steady temperature rise of a bare round conductor in still air.

    Balance I^2 rho/A against h (pi d) dT per metre and dT = 4 I^2 rho /
    (pi^2 h d^3). The film coefficient h = 15 W/(m2.K) is an assumed
    convection-plus-radiation value, stated as such; every curve moves with it,
    but the d^-3 shape - and therefore I proportional to d^1.5 at fixed rise -
    does not.
    """
    c = S.SERIES[mode]
    h = 15.0
    rho75 = RHO_CU * (1.0 + ALPHA_CU * 55.0)
    assert abs(rho75 - 2.0966426e-8) < 1e-16, rho75
    I = np.linspace(0, 200, 900)
    fig, ax = plt.subplots()
    for k, (gauge, tag) in enumerate(((12, "AWG 12"), (6, "AWG 6"), (2, "AWG 2"))):
        d = awg_diameter_mm(gauge) * 1e-3
        A = math.pi * d * d / 4.0
        dT = I * I * rho75 / A / (h * math.pi * d)
        ax.plot(I, dT, color=c[k], lw=2.2)
        j = int(np.searchsorted(dT, 70.0))
        S.label_end(ax, float(I[min(j, len(I) - 1)]), 72.0, tag, c[k], mode, dx=0, dy=6, ha="center")

    d12 = awg_diameter_mm(12) * 1e-3
    dt12 = 400.0 * rho75 / (math.pi * d12 * d12 / 4.0) / (h * math.pi * d12)
    assert abs(dt12 - 26.205217611542167) < 1e-9, dt12       # lesson prints 26.2 K
    d6 = awg_diameter_mm(6) * 1e-3
    i6 = 20.0 * (d6 / d12) ** 1.5
    assert abs(i6 - 56.78214599158725) < 1e-9, i6            # lesson prints 56.8 A
    dt6 = i6 * i6 * rho75 / (math.pi * d6 * d6 / 4.0) / (h * math.pi * d6)
    assert abs(dt6 - dt12) < 1e-9, (dt6, dt12)               # the d^1.5 claim itself

    ax.axhline(45.0, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 2, 46.5, "45 K rise: a 75 degC conductor in a 30 degC room", mode)
    ax.plot([20.0], [dt12], "o", color=c[0], ms=7)
    ax.plot([i6], [dt6], "o", color=c[1], ms=7)
    S.note(ax, 206, 66, "AWG 12 reaches a 26.2 K rise at 20 A;\nAWG 6, twice the diameter, needs 56.8 A\nfor the same rise. Twice the diameter\nbuys 2.83x the current, not 4x.", mode)
    ax.set_xlabel("conductor current  I  (A)")
    ax.set_ylabel("steady temperature rise above ambient  (K)")
    ax.set_title("Why ampacity scales like d^1.5: heat leaves through a perimeter")
    ax.set_xlim(0, 285)
    ax.set_ylim(0, 100)
    S.strip(ax)
    return fig


@figure("mat2-derating")
def _(mode):
    """Ambient derating factor from the same heat balance.

    At a fixed film coefficient the allowed I^2 tracks the available headroom
    T_rated - T_ambient, so the current factor is sqrt((T_r - T_a)/(T_r - 30))
    against a 30 degC reference ambient. The curve is a derivation, not a
    lookup, and it lands on the published correction factors.
    """
    c = S.SERIES[mode]
    Ta = np.linspace(20.0, 85.0, 600)
    fig, ax = plt.subplots()
    for k, Tr in enumerate((60.0, 75.0, 90.0)):
        good = Ta < Tr
        fac = np.sqrt(np.clip((Tr - Ta) / (Tr - 30.0), 0.0, None))
        ax.plot(Ta[good], fac[good], color=c[k], lw=2.2)
        xe = float(Ta[good][-1])
        S.label_end(ax, xe, float(fac[good][-1]), f"{Tr:.0f} degC", c[k], mode,
                    dx=2, dy=-8, ha="center")

    f75_40 = math.sqrt((75.0 - 40.0) / 45.0)
    assert abs(f75_40 - 0.881917103688197) < 1e-12, f75_40   # lesson prints 0.88
    f75_50 = math.sqrt((75.0 - 50.0) / 45.0)
    assert abs(f75_50 - 0.7453559924999299) < 1e-12, f75_50  # lesson prints 0.75
    f90_50 = math.sqrt((90.0 - 50.0) / 60.0)
    assert abs(f90_50 - 0.816496580927726) < 1e-12, f90_50   # lesson prints 0.82
    f75_45 = math.sqrt((75.0 - 45.0) / 45.0)
    assert abs(f75_45 - 0.816496580927726) < 1e-12, f75_45
    assert abs(65.0 * f75_45 * 0.80 - 42.45782220824176) < 1e-9

    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.axvline(30.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 31, 0.06, "30 degC reference ambient", mode)
    ax.plot([40.0], [f75_40], "o", color=c[1], ms=7)
    ax.plot([50.0], [f75_50], "o", color=c[1], ms=7)
    S.note(ax, 55, 1.10, "a 75 degC conductor keeps 0.88 of its rating\nin a 40 degC room and 0.75 in a 50 degC room", mode)
    S.note(ax, 20.5, 0.16, "each curve falls to zero at its own\ninsulation rating: no headroom, no current", mode)
    ax.set_xlabel("ambient temperature  (degrees C)")
    ax.set_ylabel("current derating factor")
    ax.set_title("Derating is a square root: current falls with sqrt(thermal headroom)")
    ax.set_xlim(20, 92)
    ax.set_ylim(0, 1.30)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Semiconductors
# ---------------------------------------------------------------------------


@figure("mat2-ni-temperature")
def _(mode):
    """Intrinsic carrier concentration against temperature, anchored at 300 K.

    n_i(T) = n_i(300) (T/300)^1.5 exp[(Eg/2k)(1/300 - 1/T)], drawn for silicon
    and germanium from their tabulated 300 K anchors and band gaps. A doping
    line at 1e15 /cm3 marks where a doped device stops being doped.
    """
    c = S.SERIES[mode]
    T = np.linspace(250.0, 620.0, 900)
    si = ni_of_T(T, NI_SI_300, EG_SI)
    ge = ni_of_T(T, NI_GE_300, EG_GE)

    assert abs(ni_of_T(300.0, NI_SI_300, EG_SI) - 1.5e10) < 1.0
    v350 = float(ni_of_T(350.0, NI_SI_300, EG_SI))
    assert abs(v350 / 4.173038e11 - 1.0) < 1e-6, v350        # lesson prints 4.17e11
    v400 = float(ni_of_T(400.0, NI_SI_300, EG_SI))
    assert abs(v400 / 5.192731e12 - 1.0) < 1e-6, v400        # lesson prints 5.19e12
    v500 = float(ni_of_T(500.0, NI_SI_300, EG_SI))
    assert abs(v500 / 1.870246e14 - 1.0) < 1e-6, v500        # lesson prints 1.87e14
    v250 = float(ni_of_T(250.0, NI_SI_300, EG_SI))
    assert abs(v250 / 1.499002e8 - 1.0) < 1e-6, v250         # lesson prints 1.50e8
    v325 = float(ni_of_T(325.0, NI_SI_300, EG_SI))
    assert abs(v325 / 8.951481e10 - 1.0) < 1e-6, v325        # lesson prints 8.95e10
    assert abs(EG_SI / (2.0 * K_EV) - 6498.530148177529) < 1e-9   # prints 6498.5 K
    # local doubling temperature from the closed-form log derivative
    dbl = math.log(2.0) / (1.5 / 300.0 + EG_SI / (2.0 * K_EV * 300.0 ** 2))
    assert abs(dbl - 8.977905387192866) < 1e-9, dbl          # lesson prints 8.98 K
    dec = math.log(10.0) / (1.5 / 300.0 + EG_SI / (2.0 * K_EV * 300.0 ** 2))
    assert abs(dec - 29.82395613895659) < 1e-9, dec          # lesson prints 29.8 K

    fig, ax = plt.subplots()
    ax.plot(T, si, color=c[0], lw=2.4)
    ax.plot(T, ge, color=c[1], lw=2.4)
    S.label_end(ax, 620.0, si[-1], "silicon, Eg = 1.12 eV", c[0], mode, dx=6)
    S.label_end(ax, 620.0, ge[-1], "germanium, 0.66 eV", c[1], mode, dx=6)
    ax.axhline(1e15, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 255, 1.6e15, "a 1e15 /cm3 doping level", mode)
    cross_si = float(T[np.searchsorted(si, 1e15)])
    cross_ge = float(T[np.searchsorted(ge, 1e15)])
    assert abs(cross_si - 565.2614015572858) < 1e-9, cross_si   # lesson prints 565 K
    assert abs(cross_ge - 403.9265850945495) < 1e-9, cross_ge   # lesson prints 404 K
    ax.plot([300.0], [1.5e10], "o", color=c[0], ms=7)
    S.note(ax, 308, 2.2e9, "the 300 K anchor: 1.5e10 /cm3", mode)
    S.note(ax, 300, 3.0e16, "above the dashed line the crystal is\nintrinsic again and the doping is forgotten:\ngermanium gives up at 404 K, silicon at 565 K", mode)
    ax.set_yscale("log")
    ax.set_xlabel("temperature  T  (K)")
    ax.set_ylabel("intrinsic carrier concentration  n_i  (per cm3)")
    ax.set_title("Silicon gains a decade of intrinsic carriers every 30 K")
    ax.set_xlim(250, 700)
    ax.set_ylim(1e7, 1e18)
    S.strip(ax)
    return fig


@figure("mat2-carrier-exact")
def _(mode):
    """Exact carrier concentrations against net doping, versus the shortcut.

    Solving n - p = N_D - N_A together with np = n_i^2 gives
    n = [N + sqrt(N^2 + 4 n_i^2)]/2. The majority shortcut n = N and the
    minority shortcut p = n_i^2/N are the dotted asymptotes; both fail within
    about a decade of n_i, and the figure shows exactly where.
    """
    c = S.SERIES[mode]
    ni = NI_SI_300
    N = np.logspace(8.0, 17.0, 900)
    n = (N + np.sqrt(N * N + 4.0 * ni * ni)) / 2.0
    p = ni * ni / n
    assert np.allclose(n * p, ni * ni, rtol=1e-12)
    assert np.allclose(n - p, N, rtol=1e-10)

    def solve(Nd):
        nn = (Nd + math.sqrt(Nd * Nd + 4.0 * ni * ni)) / 2.0
        return nn, ni * ni / nn

    n_a, p_a = solve(2e10)
    assert abs(n_a - 2.8027756377319946e10) < 1.0, n_a       # lesson prints 2.803e10
    assert abs(p_a - 8.027756377319946e9) < 1.0, p_a         # lesson prints 8.028e9
    assert abs(n_a - p_a - 2e10) < 1e-3
    assert abs((2e10 - n_a) / n_a * 100.0 + 28.64216553493381) < 1e-9   # prints -28.6%
    assert abs((ni * ni / 2e10 - p_a) / p_a * 100.0 - 40.13878188659973) < 1e-9  # +40.1%
    n_b, p_b = solve(1e16)
    assert abs(n_b - 1e16 - 2.25e4) < 1e3, n_b
    assert abs(p_b - 2.25e4) < 1e-3, p_b
    assert abs((1e16 - n_b) / n_b) < 3e-12                    # lesson prints 2e-12

    fig, ax = plt.subplots()
    ax.plot(N, n, color=c[0], lw=2.4)
    ax.plot(N, p, color=c[1], lw=2.4)
    ax.plot(N, N, color=c[2], lw=1.6, ls=":")
    ax.plot(N, ni * ni / N, color=S.GUIDE[mode], lw=1.6, ls=":")
    S.label_end(ax, 1e17, n[-1], "n exact", c[0], mode, dx=6, dy=6)
    S.label_end(ax, 1e17, p[-1], "p exact", c[1], mode, dx=6, dy=-6)
    S.label_end(ax, 6e8, 6e8, "shortcut n = N", c[2], mode, dx=8, dy=-12)
    S.label_end(ax, 6e8, ni * ni / 6e8, "shortcut p = n_i^2/N", S.GUIDE[mode], mode,
                dx=8, dy=12)
    ax.axvline(ni, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, ni * 1.3, 1.4e17, "net doping\nequals n_i", mode)
    ax.plot([2e10], [n_a], "o", color=c[0], ms=7)
    ax.plot([2e10], [p_a], "o", color=c[1], ms=7)
    S.note(ax, 1.4e8, 5e4, "at N = 2e10 the shortcut is 28.6% low on n\nand 40.1% high on p; by N = 1e16 the error\nis two parts in a million million", mode)
    ax.set_xscale("log")
    ax.set_yscale("log")
    ax.set_xlabel("net doping  N = N_D - N_A  (per cm3)")
    ax.set_ylabel("carrier concentration  (per cm3)")
    ax.set_title("The quadratic and its shortcut, silicon at 300 K")
    ax.set_xlim(1e8, 1e18)
    ax.set_ylim(1e3, 1e18)
    S.strip(ax)
    return fig


@figure("mat2-fermi-doping")
def _(mode):
    """Fermi level against doping, both types, on the silicon gap.

    E_F - E_i = kT ln(n/n_i) for n-type and E_i - E_F = kT ln(p/n_i) for
    p-type, drawn as a position inside the 1.12 eV gap with the band edges as
    guides. The logarithm is the whole story: a decade of doping is worth only
    kT ln 10 = 59.5 meV.
    """
    c = S.SERIES[mode]
    Nd = np.logspace(12.0, 19.0, 700)
    up = VT300 * np.log(Nd / NI_SI_300)
    dn = -up

    e16 = VT300 * math.log(1e16 / NI_SI_300)
    assert abs(e16 - 0.34667649210577095) < 1e-12, e16       # lesson prints 0.347 eV
    e14 = VT300 * math.log(1e14 / NI_SI_300)
    assert abs(e14 - 0.22762363344110753) < 1e-12, e14       # lesson prints 0.228 eV
    assert abs(0.56 - e16 - 0.2133235078942291) < 1e-12      # lesson prints 0.213 eV
    e17p = VT300 * math.log(1e17 / NI_SI_300)
    assert abs(e17p - 0.40620292143810266) < 1e-12, e17p     # lesson prints 0.406 eV
    assert abs((e16 - e14) - 2.0 * VT300 * math.log(10.0)) < 1e-12
    assert abs(VT300 * math.log(10.0) - 0.05952642933233172) < 1e-15

    fig, ax = plt.subplots()
    ax.plot(Nd, up, color=c[0], lw=2.4)
    ax.plot(Nd, dn, color=c[1], lw=2.4)
    S.label_end(ax, 1e19, up[-1], "n-type: E_F - E_i", c[0], mode, dx=6)
    S.label_end(ax, 1e19, dn[-1], "p-type: E_F - E_i", c[1], mode, dx=6)
    ax.axhline(0.56, color=S.GUIDE[mode], lw=1.4, ls="-")
    ax.axhline(-0.56, color=S.GUIDE[mode], lw=1.4, ls="-")
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 1.2e12, 0.575, "conduction band edge, E_i + 0.56 eV", mode)
    S.note(ax, 1.2e12, -0.60, "valence band edge", mode, va="top")
    S.note(ax, 1.2e12, 0.015, "intrinsic level E_i", mode)
    ax.plot([1e16], [e16], "o", color=c[0], ms=7)
    S.note(ax, 1.6e13, 0.40, "N_D = 1e16: 0.347 eV above E_i,\nstill 0.213 eV below the band edge", mode)
    ax.set_xscale("log")
    ax.set_xlabel("majority doping concentration  (per cm3)")
    ax.set_ylabel("Fermi level relative to E_i  (eV)")
    ax.set_title("Doping moves E_F logarithmically: 59.5 meV per decade")
    ax.set_xlim(1e12, 4e19)
    ax.set_ylim(-0.70, 0.70)
    S.strip(ax)
    return fig


@figure("mat2-junction-profile")
def _(mode):
    """Field and potential through an abrupt p-n depletion region.

    Depletion approximation for N_A = 1e17, N_D = 1e16 per cm3: charge is a
    step, field is the triangle that integrates it, potential is the parabola
    pair that integrates the field. Both curves are drawn as fractions of their
    own peak so one axis serves both.
    """
    c = S.SERIES[mode]
    NA, ND = 1e17 * 1e6, 1e16 * 1e6            # per m3
    eps = EPS_R_SI * EPS0
    Vbi = VT300 * math.log(NA * ND / (NI_SI_300 * 1e6) ** 2)
    assert abs(Vbi - 0.7528794135438737) < 1e-12, Vbi        # lesson prints 0.753 V
    W = math.sqrt(2.0 * eps * Vbi / Q * (1.0 / NA + 1.0 / ND))
    assert abs(W * 1e6 - 0.32725489430179205) < 1e-12, W     # lesson prints 0.327 um
    xn = W * NA / (NA + ND)
    xp = W * ND / (NA + ND)
    assert abs(xn * 1e6 - 0.29750444936526554) < 1e-12, xn   # lesson prints 0.298 um
    assert abs(xp * 1e6 - 0.029750444936526555) < 1e-12, xp  # lesson prints 0.0298 um
    assert abs(xn / xp - 10.0) < 1e-9
    Emax = Q * ND * xn / eps
    assert abs(Emax - 4601180.466071648) < 1e-3, Emax        # lesson prints 46.0 kV/cm
    assert abs(2.0 * Vbi / W - Emax) < 1e-3                  # triangle area must be Vbi
    assert abs(Q * NA * xp / eps - Emax) < 1e-3              # charge balance

    x = np.linspace(-xp * 1.9, xn * 1.35, 1200)
    E = np.where(x < -xp, 0.0,
                 np.where(x < 0.0, Emax * (1.0 + x / xp),
                          np.where(x < xn, Emax * (1.0 - x / xn), 0.0)))
    psi = np.zeros_like(x)
    for i, xv in enumerate(x):
        if xv <= -xp:
            psi[i] = 0.0
        elif xv <= 0.0:
            psi[i] = Emax / (2.0 * xp) * (xv + xp) ** 2
        elif xv <= xn:
            psi[i] = Vbi - Emax / (2.0 * xn) * (xn - xv) ** 2
        else:
            psi[i] = Vbi
    assert abs(psi[-1] - Vbi) < 1e-12

    fig, ax = plt.subplots()
    xu = x * 1e6
    ax.plot(xu, E / Emax, color=c[0], lw=2.4)
    ax.plot(xu, psi / Vbi, color=c[1], lw=2.4)
    S.label_end(ax, 0.0, 1.0, "field E(x), peak 46.0 kV/cm", c[0], mode, dx=8, dy=13)
    S.label_end(ax, xn * 1e6, 1.0, "potential, total 0.753 V", c[1], mode, dx=8, dy=-6)
    ax.axvline(0.0, color=S.GUIDE[mode], lw=1.2, ls="--")
    ax.axvline(-xp * 1e6, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.axvline(xn * 1e6, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 0.325, 0.30, "the dashed line at x = 0 is the\nmetallurgical junction itself", mode, size=8.5)
    S.note(ax, -0.055, 1.13, "p side, N_A = 1e17:\n0.0298 um", mode, size=8.5)
    S.note(ax, 0.325, 0.60, "n side, N_D = 1e16: 0.298 um.\nThe lightly doped side gives up ten\ntimes the width - the depletion region\neats whichever side has fewer dopants.", mode, size=8.5)
    ax.set_xlabel("position through the junction  x  (micrometres)")
    ax.set_ylabel("fraction of peak field / of built-in potential")
    ax.set_title("Abrupt junction: a triangle of field, a parabola of potential")
    ax.set_xlim(-0.062, 0.72)
    ax.set_ylim(-0.05, 1.30)
    S.strip(ax)
    return fig


@figure("mat2-depletion-bias")
def _(mode):
    """Depletion width and junction capacitance against reverse bias.

    W(V_R) = W_0 sqrt(1 + V_R/V_bi) and C_j = eps/W, so the capacitance falls
    as the inverse square root. Plotted as fractions of the zero-bias values,
    which is what a varactor datasheet is really quoting.
    """
    c = S.SERIES[mode]
    NA, ND = 1e17 * 1e6, 1e16 * 1e6
    eps = EPS_R_SI * EPS0
    Vbi = VT300 * math.log(NA * ND / (NI_SI_300 * 1e6) ** 2)
    W0 = math.sqrt(2.0 * eps * Vbi / Q * (1.0 / NA + 1.0 / ND))
    C0 = eps / W0
    assert abs(C0 * 1e-4 * 1e9 - 31.655446324425753) < 1e-9  # lesson prints 31.7 nF/cm2

    VR = np.linspace(0.0, 20.0, 800)
    ratio = np.sqrt(1.0 + VR / Vbi)
    r10 = math.sqrt(1.0 + 10.0 / Vbi)
    assert abs(r10 - 3.7791982662370898) < 1e-12, r10        # lesson prints 3.779
    assert abs(W0 * r10 * 1e6 - 1.2367611291629346) < 1e-12  # lesson prints 1.237 um
    assert abs(C0 / r10 * 1e-4 * 1e9 - 8.376233289275072) < 1e-9  # prints 8.38 nF/cm2
    assert abs(1.0 / r10 - 0.26460638726840074) < 1e-12      # lesson prints 0.2646

    fig, ax = plt.subplots()
    ax.plot(VR, ratio, color=c[0], lw=2.4)
    ax.plot(VR, 1.0 / ratio, color=c[1], lw=2.4)
    S.label_end(ax, 20.0, float(ratio[-1]), "W / W_0", c[0], mode, dx=6)
    S.label_end(ax, 20.0, float(1.0 / ratio[-1]), "C_j / C_j0", c[1], mode, dx=6)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.plot([10.0], [r10], "o", color=c[0], ms=7)
    ax.plot([10.0], [1.0 / r10], "o", color=c[1], ms=7)
    S.note(ax, 1.0, 5.0, "10 V reverse: the layer is 3.779x wider (1.237 um)\nand the capacitance 3.779x smaller (8.38 nF/cm2).\nThat inverse square root is a varactor's tuning law.", mode)
    ax.set_xlabel("reverse bias  V_R  (V)")
    ax.set_ylabel("multiple of the zero-bias value")
    ax.set_title("Reverse bias widens the layer as sqrt(1 + V_R/V_bi)")
    ax.set_xlim(0, 23.5)
    ax.set_ylim(0, 6.2)
    S.strip(ax)
    return fig


@figure("mat2-diode-temperature")
def _(mode):
    """Diode forward characteristic at three temperatures, log current.

    I = I_S(T)[exp(V/V_T) - 1] with I_S(T)/I_S(300) = (T/300)^3
    exp[(Eg/k)(1/300 - 1/T)], the temperature law n_i^2 forces on it. The
    curves shift LEFT as they heat: at a fixed current the forward voltage
    falls, which is the two millivolts per kelvin every bias circuit fights.
    """
    c = S.SERIES[mode]
    Is300 = 1.4828382451045966e-15                # A, derived in the lesson

    def Is(T):
        return Is300 * (T / 300.0) ** 3 * math.exp((EG_SI / K_EV) * (1.0 / 300.0 - 1.0 / T))

    def Vt(T):
        return KB * T / Q

    def Vf(T, I):
        return Vt(T) * math.log(I / Is(T) + 1.0)

    v300 = Vf(300.0, 1e-3)
    assert abs(v300 - 0.7041325502580985) < 1e-12, v300      # lesson prints 0.704 V
    v300b = Vf(300.0, 1e-4)
    assert abs(v300b - 0.6446061209261118) < 1e-12, v300b    # lesson prints 0.645 V
    assert abs((v300 - v300b) - VT300 * math.log(10.0)) < 1e-9
    # numeric slope must match the closed form dV/dT = (V - Eg/q)/T - 3k/q
    num = (Vf(300.5, 1e-3) - Vf(299.5, 1e-3)) / 1.0
    closed = (v300 - EG_SI) / 300.0 - 3.0 * K_EV
    assert abs(num - closed) < 2e-8, (num, closed)
    assert abs(closed * 1e3 + 1.6447448303330052) < 1e-9, closed   # prints -1.645 mV/K
    closed6 = (0.6 - EG_SI) / 300.0 - 3.0 * K_EV
    assert abs(closed6 * 1e3 + 1.9918533311933337) < 1e-9, closed6  # prints -1.99 mV/K
    assert abs(Is(350.0) / Is300 - 773.9663297894002) < 1e-6, Is(350.0) / Is300
    # I_S doubles every ln2 / (3/T + Eg/kT^2) kelvin - the n_i^2 rate, not 10 K
    dbl_is = math.log(2.0) / (3.0 / 300.0 + EG_SI / (K_EV * 300.0 ** 2))
    assert abs(dbl_is - 4.488952693596433) < 1e-9, dbl_is    # lesson prints 4.49 K

    V = np.linspace(0.25, 0.95, 900)
    fig, ax = plt.subplots()
    for k, T in enumerate((250.0, 300.0, 350.0)):
        I = Is(T) * (np.exp(V / Vt(T)) - 1.0)
        keep = (I > 1e-12) & (I < 3.0)
        ax.plot(V[keep], I[keep], color=c[k], lw=2.3)
        j = np.searchsorted(I[keep], 1.5)
        S.label_end(ax, V[keep][min(j, keep.sum() - 1)], 1.9, f"{T:.0f} K", c[k], mode,
                    dx=-2, dy=4, ha="center")

    ax.axhline(1e-3, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 0.26, 1.35e-3, "1 mA bias line", mode)
    for k, T in enumerate((250.0, 300.0, 350.0)):
        ax.plot([Vf(T, 1e-3)], [1e-3], "o", color=c[k], ms=7)
    S.note(ax, 0.485, 3e-8, "at 1 mA the knee walks from 0.785 V at 250 K\nto 0.704 V at 300 K to 0.621 V at 350 K:\n1.64 mV lost per kelvin, averaged", mode)
    assert abs(Vf(250.0, 1e-3) - 0.7852272340031113) < 1e-12, Vf(250.0, 1e-3)
    assert abs(Vf(350.0, 1e-3) - 0.620873446968967) < 1e-12, Vf(350.0, 1e-3)
    assert abs((Vf(250.0, 1e-3) - Vf(350.0, 1e-3)) / 100.0 * 1e3 - 1.6435378703414438) < 1e-9
    ax.set_yscale("log")
    ax.set_xlabel("forward voltage  V  (V)")
    ax.set_ylabel("forward current  I  (A)")
    ax.set_title("Heat moves the whole exponential left, not just its knee")
    ax.set_xlim(0.25, 0.99)
    ax.set_ylim(1e-11, 6.0)
    S.strip(ax)
    return fig


def render(name: str, fn) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    assert name.startswith("mat2-"), f"figure {name!r} is outside this file's prefix"
    for mode, suffix in (("light", ".svg"), ("dark", ".dark.svg")):
        S.apply(mode)
        fig = fn(mode)
        fig.savefig(OUT / f"{name}{suffix}", format="svg",
                    transparent=True, bbox_inches="tight")
        plt.close(fig)


def main() -> int:
    prefix = sys.argv[1] if len(sys.argv) > 1 else ""
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
