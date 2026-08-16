#!/usr/bin/env python3
"""Wave-8 figures for the FE Electrical and Computer course: Electromagnetics.

Same contract as gen_fe_ee_w3.py, and it imports the SAME style module rather
than growing a second look: every curve here is COMPUTED, in this file, from
the equation the lesson states, so a reader can check the picture against the
algebra. Nothing is traced, scanned or adapted from the NCEES Reference
Handbook or any textbook - the pipeline consumes formulas, which are not
protected expression, and never anyone's drawing of them.

Every quantity a figure labels in words is asserted numerically before the
figure is drawn, with tolerances tight enough that a mislabel cannot pass:
where a caption prints three decimals the assertion holds to better than a
unit in the last printed place.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Usage:
    python3 scripts/gen_fe_ee_w8.py            # all
    python3 scripts/gen_fe_ee_w8.py em-sk      # only names starting "em-sk"
"""
from __future__ import annotations

import pathlib
import sys

import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

# Standard tabulated constants (CODATA for eps0; the classical 4 pi e-7 for
# mu0). The lessons quote these same values.
EPS0 = 8.8541878128e-12          # F/m
MU0 = 4e-7 * np.pi               # H/m
C0 = 1.0 / np.sqrt(EPS0 * MU0)   # m/s
K_E = 1.0 / (4 * np.pi * EPS0)   # N m^2 / C^2
ETA0 = np.sqrt(MU0 / EPS0)       # ohm

REGISTRY: dict[str, callable] = {}


def figure(name):
    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# Electrostatics
# ---------------------------------------------------------------------------


@figure("em-sphere-field-potential")
def _(mode):
    """E(r) and V(r) for a uniformly charged solid sphere and a conductor.

    Both carry Q = 1 nC on radius R = 5 cm. Solid insulating sphere:
    E = kQr/R^3 inside, kQ/r^2 outside, V = kQ(3R^2 - r^2)/(2R^3) inside.
    Conductor: E = 0 inside, same kQ/r^2 outside, V = kQ/R throughout the
    interior. Outside the two are IDENTICAL - the exam point that a spherical
    charge looks like a point charge from outside, whatever it is made of.
    """
    c = S.SERIES[mode]
    Q, R = 1e-9, 0.05
    r = np.linspace(1e-4, 0.15, 3000)

    e_solid = np.where(r < R, K_E * Q * r / R ** 3, K_E * Q / r ** 2)
    e_cond = np.where(r < R, 0.0, K_E * Q / r ** 2)
    v_solid = np.where(r < R, K_E * Q * (3 * R ** 2 - r ** 2) / (2 * R ** 3),
                       K_E * Q / r)
    v_cond = np.where(r < R, K_E * Q / R, K_E * Q / r)

    e_surface = K_E * Q / R ** 2
    v_surface = K_E * Q / R
    v_centre = 1.5 * v_surface
    assert abs(e_surface - 3595.021) < 5e-4, e_surface
    assert abs(v_surface - 179.7510) < 5e-5, v_surface
    assert abs(v_centre - 269.6266) < 5e-5, v_centre
    # the two pieces of each profile must meet at r = R (analytic identity,
    # checked on the expressions themselves rather than on adjacent samples)
    assert abs(K_E * Q * R / R ** 3 - K_E * Q / R ** 2) < 1e-12 * e_surface
    assert abs(K_E * Q * (3 * R ** 2 - R ** 2) / (2 * R ** 3)
               - K_E * Q / R) < 1e-12 * v_surface
    # outside the sphere the conductor and the insulator agree exactly
    out = r > R
    assert np.allclose(e_solid[out], e_cond[out], rtol=0, atol=1e-12)
    assert np.allclose(v_solid[out], v_cond[out], rtol=0, atol=1e-12)

    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 6.0), sharex=True)
    a1.plot(r * 100, e_solid, color=c[0], lw=2.2)
    a1.plot(r * 100, e_cond, color=c[1], lw=2.2, ls="--")
    S.label_end(a1, 15.0, e_solid[-1], "both, outside:\nkQ/r²", c[0], mode, dy=6)
    S.label_end(a1, 0.35, 3300, "solid sphere:\nE = kQr/R³", c[0], mode, dx=0)
    S.label_end(a1, 0.6, 300, "conductor: E = 0 inside", c[1], mode, dx=0)
    a1.plot([R * 100], [e_surface], "o", color=c[0], ms=6)
    S.note(a1, 5.6, 3450, "surface: 3595 V/m", mode)
    a2.plot(r * 100, v_solid, color=c[0], lw=2.2)
    a2.plot(r * 100, v_cond, color=c[1], lw=2.2, ls="--")
    a2.plot([0.0], [v_centre], "o", color=c[0], ms=6)
    a2.plot([0.0], [v_surface], "o", color=c[1], ms=6)
    S.note(a2, 1.7, 288, "centre of the solid sphere: 269.6 V", mode)
    S.note(a2, 0.35, 118, "conductor interior: 179.8 V", mode)
    S.label_end(a2, 15.0, v_solid[-1], "both, outside:\nkQ/r", c[0], mode, dy=6)
    for ax in (a1, a2):
        ax.axvline(R * 100, color=S.GUIDE[mode], lw=1.0, ls=":")
        ax.set_xlim(0, 17.6)
        S.strip(ax)
    S.note(a1, 4.85, 3760, "R = 5 cm", mode, ha="right")
    a1.set_ylim(0, 4300)
    a2.set_ylim(0, 320)
    a1.set_ylabel("field  E  (V/m)")
    a2.set_ylabel("potential  V  (V)")
    a2.set_xlabel("distance from centre  r  (cm)")
    a1.set_title("Q = 1 nC on a 5 cm sphere: outside, the interior does not matter")
    return fig


@figure("em-series-dielectric-fields")
def _(mode):
    """D and E through a two-layer dielectric stack under 3 kV.

    1.0 mm of a plastic film (eps_r = 2.2) in series with a 0.5 mm air gap.
    Normal D is continuous across the interface, so E = D/eps jumps UP by the
    permittivity ratio on entering the air. The air therefore reaches its
    3 MV/m strength while the plastic is only at 1.43 MV/m: the weakest layer
    fails first, and it is the one with the LOWEST permittivity.
    """
    c = S.SERIES[mode]
    d1, er1 = 1.0e-3, 2.2
    d2, er2 = 0.5e-3, 1.0
    V = 3000.0
    D = V / (d1 / (EPS0 * er1) + d2 / (EPS0 * er2))
    e1, e2 = D / (EPS0 * er1), D / (EPS0 * er2)

    assert abs(e1 - 1.42857e6) / 1.42857e6 < 1e-5, e1
    assert abs(e2 - 3.14286e6) / 3.14286e6 < 1e-5, e2
    assert abs(e2 / e1 - er1 / er2) < 1e-12
    assert abs(e1 * d1 + e2 * d2 - V) < 1e-9              # the field integrates to 3 kV
    assert abs(D * 1e6 - 27.8274) < 5e-4, D * 1e6          # 27.827 uC/m^2, printed
    v_break = 3.0e6 * (d1 * er2 / er1 + d2)
    assert abs(v_break - 2863.64) < 5e-3, v_break

    x = np.linspace(0, (d1 + d2) * 1e3, 4000)
    e_of_x = np.where(x < d1 * 1e3, e1, e2) / 1e6
    d_of_x = np.full_like(x, D * 1e6)

    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 6.0), sharex=True)
    a1.plot(x, e_of_x, color=c[0], lw=2.4)
    a1.axhline(3.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(a1, 0.04, 3.06, "air strength 3 MV/m - the gap is already there", mode)
    S.label_end(a1, 0.5, 1.43, "1.43 MV/m in the plastic", c[0], mode, dy=-14, ha="center")
    S.label_end(a1, 1.25, 3.14, "3.14 MV/m in the air", c[0], mode, dy=10, ha="center")
    a2.plot(x, d_of_x, color=c[1], lw=2.4)
    S.label_end(a2, 0.75, D * 1e6, "D = 27.83 µC/m² - continuous straight through",
                c[1], mode, dy=-16, ha="center")
    for ax in (a1, a2):
        ax.axvline(d1 * 1e3, color=S.GUIDE[mode], lw=1.0, ls=":")
        ax.set_xlim(0, 1.5)
        S.strip(ax)
    a1.set_ylim(0, 3.9)
    a2.set_ylim(0, 40)
    S.note(a1, 0.06, 0.25, "plastic  εr = 2.2", mode)
    S.note(a1, 1.04, 0.25, "air  εr = 1", mode)
    a1.set_ylabel("field  E  (MV/m)")
    a2.set_ylabel("flux density  D  (µC/m²)")
    a2.set_xlabel("position through the stack  (mm)")
    a1.set_title("3 kV across 1.5 mm: D is continuous, so E jumps into the air gap")
    return fig


# ---------------------------------------------------------------------------
# Magnetostatics
# ---------------------------------------------------------------------------


@figure("em-wire-b-profile")
def _(mode):
    """B(r) for a 20 A solid wire, and for the same current in a coax.

    Solid wire of radius a = 2 mm: Ampere's law on a circle of radius r
    encloses I r^2/a^2 inside the metal, giving B = mu0 I r/(2 pi a^2), and
    the whole current outside, giving B = mu0 I/(2 pi r). The coax adds a
    return shield between 6 and 7 mm: inside the shield the enclosed current
    falls linearly in area to zero, and beyond it B is exactly zero - the
    reason a coaxial cable radiates nothing.
    """
    c = S.SERIES[mode]
    I, a = 20.0, 2.0e-3
    r_in, r_out = 6.0e-3, 7.0e-3
    r = np.linspace(1e-5, 12e-3, 4000)

    b_wire = np.where(r < a, MU0 * I * r / (2 * np.pi * a ** 2),
                      MU0 * I / (2 * np.pi * r))
    frac = np.clip((r ** 2 - r_in ** 2) / (r_out ** 2 - r_in ** 2), 0.0, 1.0)
    i_enc = np.where(r < a, I * r ** 2 / a ** 2, I) - I * frac
    b_coax = MU0 * i_enc / (2 * np.pi * r)

    b_surface = MU0 * I / (2 * np.pi * a)
    assert abs(b_surface - 2.0e-3) < 1e-15, b_surface       # exactly 2.000 mT
    assert abs(MU0 * I / (2 * np.pi * 0.05) - 8.0e-5) < 1e-18
    # the inside and outside expressions agree exactly at the surface r = a
    assert abs(MU0 * I * a / (2 * np.pi * a ** 2)
               - MU0 * I / (2 * np.pi * a)) < 1e-12 * b_surface
    assert abs(b_coax[-1]) < 1e-18                          # nothing outside the shield
    gapzone = (r > a) & (r < r_in)          # between the conductors the two agree
    assert np.allclose(b_coax[gapzone], b_wire[gapzone], rtol=1e-15, atol=0)

    fig, ax = plt.subplots()
    ax.plot(r * 1e3, b_wire * 1e3, color=c[0], lw=3.0)
    ax.plot(r * 1e3, b_coax * 1e3, color=c[1], lw=1.8, ls="--")
    ax.plot([a * 1e3], [b_surface * 1e3], "o", color=c[0], ms=6)
    S.label_end(ax, 8.6, b_wire[int(np.searchsorted(r, 8.6e-3))] * 1e3,
                "bare wire: μ₀I/2πr", c[0], mode, dy=10)
    S.label_end(ax, 8.4, 0.02, "coax: zero outside the shield", c[1], mode, dy=4)
    S.note(ax, 2.12, 2.02, "surface of the wire: 2.000 mT", mode)
    S.note(ax, 0.55, 0.09, "inside the metal, B ∝ r", mode)
    S.note(ax, 7.35, 1.12, "dashed: the same 20 A in a coax -\nidentical until the shield", mode)
    ax.axvspan(r_in * 1e3, r_out * 1e3, color=S.GRID[mode], alpha=0.55, lw=0)
    S.note(ax, 6.0, 1.62, "return\nshield", mode)
    ax.axvline(a * 1e3, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.set_xlabel("distance from the axis  r  (mm)")
    ax.set_ylabel("flux density  B  (mT)")
    ax.set_title("20 A: the field peaks at the conductor surface, not at the centre")
    ax.set_xlim(0, 12.6)
    ax.set_ylim(0, 2.35)
    S.strip(ax)
    return fig


@figure("em-magnetic-circuit-gap")
def _(mode):
    """Core flux against air-gap length, for two core permeabilities.

    Phi = NI / (l_c/(mu0 mu_r A) + g/(mu0 A)) with N = 400, I = 1.5 A,
    l_c = 0.30 m, A = 4 cm^2 - the magnetic Ohm's law the lesson states,
    evaluated point by point. The second curve raises mu_r from 2000 to 5000.
    They separate only at g = 0: once a millimetre of air is in the path, the
    gap owns the reluctance and the core material barely matters.
    """
    c = S.SERIES[mode]
    N, I, lc, A = 400, 1.5, 0.30, 4e-4
    g = np.linspace(0, 2.0e-3, 2001)      # odd count so a sample lands on 1.000 mm

    def flux(mur):
        return N * I / (lc / (MU0 * mur * A) + g / (MU0 * A))

    f2000, f5000 = flux(2000.0), flux(5000.0)
    r_core = lc / (MU0 * 2000.0 * A)
    r_gap = 1.0e-3 / (MU0 * A)
    assert abs(r_core - 2.98416e5) / 2.98416e5 < 1e-5, r_core
    assert abs(r_gap - 1.98944e6) / 1.98944e6 < 1e-5, r_gap
    assert abs(r_gap / r_core - 6.6667) < 5e-4, r_gap / r_core
    i1 = int(np.searchsorted(g, 1.0e-3))
    assert abs(f2000[0] * 1e6 - 2010.619) < 5e-3, f2000[0] * 1e6
    assert abs(f2000[i1] * 1e6 - 262.255) < 5e-3, f2000[i1] * 1e6
    assert abs(f2000[0] / f2000[i1] - 7.6667) < 5e-4
    assert abs(f5000[i1] * 1e6 - 284.522) < 5e-3, f5000[i1] * 1e6
    assert abs(f5000[i1] / f2000[i1] - 1.0850) < 5e-4
    assert abs(f2000[i1] / A - 0.65564) < 5e-5              # 0.656 T in the core
    assert abs(f5000[0] * 1e6 - 5026.548) < 5e-3, f5000[0] * 1e6

    fig, ax = plt.subplots()
    ax.plot(g * 1e3, f2000 * 1e6, color=c[0], lw=2.2)
    ax.plot(g * 1e3, f5000 * 1e6, color=c[1], lw=2.2)
    S.label_end(ax, 2.0, f2000[-1] * 1e6, "μr = 2000", c[0], mode, dy=-8)
    S.label_end(ax, 2.0, f5000[-1] * 1e6, "μr = 5000", c[1], mode, dy=8)
    ax.plot([0.0, 1.0], [f2000[0] * 1e6, f2000[i1] * 1e6], "o", color=c[0], ms=6)
    S.note(ax, 0.42, 2010, "μr = 2000, no gap: 2011 µWb", mode)
    S.note(ax, 0.42, 2270, "μr = 5000, no gap: 5026 µWb - off the top of this axis", mode)
    S.note(ax, 1.06, 300, "1 mm gap: 262 µWb, i.e. 7.7× less\n(μr = 5000 gives only 285)", mode)
    ax.axvline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.set_xlabel("air-gap length  g  (mm)")
    ax.set_ylabel("core flux  Φ  (µWb)")
    ax.set_title("400 ampere-turns: a 1 mm gap costs more than 300 mm of iron")
    ax.set_xlim(0, 2.32)
    ax.set_ylim(0, 2450)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Maxwell's equations
# ---------------------------------------------------------------------------


@figure("em-displacement-current")
def _(mode):
    """Wire current and gap displacement current while a capacitor charges.

    A 10 V step through R = 1.00 k drives a parallel-plate capacitor of
    A = 100 cm^2 and d = 0.10 mm, so C = eps0 A/d = 885.4 pF and
    tau = RC = 0.885 us. The wire carries i = (V/R) e^(-t/tau). Between the
    plates no charge crosses the gap at all; what crosses is
    i_d = eps0 A dE/dt with E = v_C/d. The assertion below checks the two are
    equal to machine precision at every sample - that equality is exactly why
    Maxwell had to add the displacement term.
    """
    c = S.SERIES[mode]
    V, R = 10.0, 1000.0
    A, d = 100e-4, 0.10e-3
    C = EPS0 * A / d
    tau = R * C
    t = np.linspace(0, 4e-6, 3000)

    i_wire = (V / R) * np.exp(-t / tau)
    v_cap = V * (1 - np.exp(-t / tau))
    e_gap = v_cap / d
    # dE/dt evaluated from the analytic derivative of the same expression
    de_dt = (V / (d * tau)) * np.exp(-t / tau)
    i_disp = EPS0 * A * de_dt

    assert abs(C * 1e12 - 885.419) < 5e-4, C * 1e12
    assert abs(tau * 1e6 - 0.885419) < 5e-7, tau * 1e6
    # identical, not merely close: equal to within double-precision rounding
    assert np.max(np.abs(i_wire - i_disp)) / i_wire[0] < 1e-14
    assert abs(i_wire[0] * 1e3 - 10.0) < 1e-12
    assert abs((V / d) / 1e3 - 100.0) < 1e-12               # 100 kV/m asymptote
    assert 0.988 < e_gap[-1] / (V / d) < 1.0                # 4.5 tau, not yet there
    assert abs(C * V * 1e9 - 8.85419) < 5e-6                # 8.854 nC of plate charge

    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 6.0), sharex=True)
    a1.plot(t * 1e6, i_wire * 1e3, color=c[0], lw=3.0)
    a1.plot(t * 1e6, i_disp * 1e3, color=c[1], lw=1.8, ls="--")
    S.label_end(a1, 1.35, i_wire[int(np.searchsorted(t, 1.35e-6))] * 1e3,
                "conduction current in the wire", c[0], mode, dy=12)
    S.label_end(a1, 2.5, i_disp[int(np.searchsorted(t, 2.5e-6))] * 1e3,
                "displacement current in the gap\n(dashed - it lies on top)",
                c[1], mode, dy=14)
    a1.plot([0], [10.0], "o", color=c[0], ms=6)
    S.note(a1, 0.12, 9.3, "10.0 mA at t = 0", mode)
    a2.plot(t * 1e6, e_gap / 1e3, color=c[2], lw=2.2)
    a2.axhline(100.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(a2, 1.15, 46, "E settles at V/d = 100 kV/m; once it stops changing,\n"
                         "the displacement current stops with it", mode)
    for ax in (a1, a2):
        ax.axvline(tau * 1e6, color=S.GUIDE[mode], lw=1.0, ls=":")
        ax.set_xlim(0, 4.35)
        S.strip(ax)
    S.note(a1, 0.93, 4.1, "τ = RC = 0.885 µs", mode)
    a1.set_ylim(0, 11.6)
    a2.set_ylim(0, 118)
    a1.set_ylabel("current  (mA)")
    a2.set_ylabel("gap field  E  (kV/m)")
    a2.set_xlabel("time  (µs)")
    a1.set_title("No charge crosses the gap, yet the current is continuous")
    return fig


# ---------------------------------------------------------------------------
# Wave propagation
# ---------------------------------------------------------------------------


def _delta_exact(f, sigma, er=1.0, mur=1.0):
    """1/alpha from the exact lossy-medium attenuation constant."""
    w = 2 * np.pi * f
    eps, mu = EPS0 * er, MU0 * mur
    alpha = w * np.sqrt(mu * eps / 2 * (np.sqrt(1 + (sigma / (w * eps)) ** 2) - 1))
    return 1.0 / alpha


@figure("em-skin-depth-materials")
def _(mode):
    """Penetration depth against frequency for copper, aluminium and seawater.

    Solid curves are the EXACT depth 1/alpha with
    alpha = w sqrt(mu eps/2 [sqrt(1 + (sigma/w eps)^2) - 1]); the dashed curve
    is the good-conductor shortcut 1/sqrt(pi f mu sigma) applied to seawater.
    For the metals the two are indistinguishable everywhere on this axis. For
    seawater they part company above roughly 100 MHz, where sigma/(w eps) is
    no longer large - the shortcut then UNDERSTATES the depth, by 1.62x at
    1 GHz.
    """
    c = S.SERIES[mode]
    f = np.logspace(1, 10, 900)
    cu = _delta_exact(f, 5.8e7)
    al = _delta_exact(f, 3.5e7)
    sea = _delta_exact(f, 4.0, er=81.0)
    sea_approx = 1.0 / np.sqrt(np.pi * f * MU0 * 4.0)

    def at(arr, freq):
        return float(np.interp(np.log10(freq), np.log10(f), arr))

    assert abs(at(cu, 60.0) * 1e3 - 8.5316) < 2e-3, at(cu, 60.0) * 1e3
    assert abs(at(cu, 1e9) * 1e6 - 2.0898) < 2e-3, at(cu, 1e9) * 1e6
    assert abs(at(al, 60.0) * 1e3 - 10.9827) < 3e-3, at(al, 60.0) * 1e3
    assert abs(at(sea, 60.0) - 32.487) < 1e-2, at(sea, 60.0)
    assert abs(at(sea, 1e9) * 1e2 - 1.2912) < 3e-3, at(sea, 1e9) * 1e2
    assert abs(at(sea_approx, 1e9) * 1e3 - 7.9577) < 5e-3, at(sea_approx, 1e9) * 1e3
    assert abs(at(sea, 1e9) / at(sea_approx, 1e9) - 1.6226) < 2e-3
    # the metals never leave the good-conductor regime on this axis
    assert np.max(np.abs(cu / (1.0 / np.sqrt(np.pi * f * MU0 * 5.8e7)) - 1)) < 1e-6

    fig, ax = plt.subplots()
    ax.loglog(f, sea, color=c[2], lw=2.2)
    ax.loglog(f, sea_approx, color=c[2], lw=1.4, ls="--")
    ax.loglog(f, al, color=c[1], lw=2.2)
    ax.loglog(f, cu, color=c[0], lw=2.2)
    S.label_end(ax, 1e10, at(sea, 1e10), "seawater  σ = 4 S/m", c[2], mode, dy=10)
    S.label_end(ax, 3e3, at(al, 3e3), "aluminium", c[1], mode, dx=0, dy=11)
    S.label_end(ax, 3e3, at(cu, 3e3), "copper", c[0], mode, dx=0, dy=-17)
    ax.plot([60], [at(cu, 60)], "o", color=c[0], ms=6)
    S.note(ax, 13, 5.5e-2, "copper at 60 Hz: 8.5 mm", mode)
    ax.plot([1e9], [at(cu, 1e9)], "o", color=c[0], ms=6)
    S.note(ax, 4e6, 5.5e-7, "copper at 1 GHz: 2.1 µm", mode)
    S.note(ax, 1.1e6, 1.1e-3, "dashed: the √(πfμσ) shortcut,\n"
                              "1.62× low for seawater at 1 GHz", mode)
    ax.set_xlabel("frequency  (Hz)")
    ax.set_ylabel("penetration depth  δ  (m)")
    ax.set_title("Nine decades of frequency, eight decades of penetration depth")
    ax.set_xlim(10, 3e10)
    ax.set_ylim(3e-7, 3e2)
    S.strip(ax)
    return fig


@figure("em-loss-tangent-crossover")
def _(mode):
    """Loss tangent sigma/(w eps) against frequency for three materials.

    The curve is the definition itself, evaluated with tabulated sigma and
    eps_r: copper (5.8e7 S/m), seawater (4 S/m, eps_r 81) and moist soil
    (0.01 S/m, eps_r 15). Every material crosses tan = 1 at
    f = sigma/(2 pi eps0 eps_r); the crossing frequencies marked on the plot
    are that formula, and the assertions check the drawn curves pass through
    1 there. Above its own crossing a material behaves as a dielectric,
    below it as a conductor - the same substance, classified by frequency.
    """
    c = S.SERIES[mode]
    f = np.logspace(1, 11, 1200)

    def tand(sigma, er):
        return sigma / (2 * np.pi * f * EPS0 * er)

    cu, sea, soil = tand(5.8e7, 1.0), tand(4.0, 81.0), tand(1e-2, 15.0)
    f_sea = 4.0 / (2 * np.pi * EPS0 * 81.0)
    f_soil = 1e-2 / (2 * np.pi * EPS0 * 15.0)
    f_cu = 5.8e7 / (2 * np.pi * EPS0)
    assert abs(f_sea / 1e6 - 887.659) < 5e-3, f_sea / 1e6   # "888 MHz" as labelled
    assert abs(f_soil / 1e6 - 11.9834) < 5e-4, f_soil / 1e6   # "12 MHz" as labelled
    assert abs(np.log10(f_cu) - 18.0181) < 5e-4, np.log10(f_cu)
    for arr, fx in ((sea, f_sea), (soil, f_soil)):
        assert abs(np.interp(np.log10(fx), np.log10(f), np.log10(arr))) < 2e-3

    fig, ax = plt.subplots()
    ax.loglog(f, cu, color=c[0], lw=2.2)
    ax.loglog(f, sea, color=c[2], lw=2.2)
    ax.loglog(f, soil, color=c[1], lw=2.2)
    S.label_end(ax, 1e11, cu[-1], "copper", c[0], mode, dy=-2)
    S.label_end(ax, 1e11, sea[-1], "seawater", c[2], mode, dy=-2)
    S.label_end(ax, 1e11, soil[-1], "moist soil", c[1], mode, dy=-2)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 13, 2.2, "tan δ = 1: the conductor / dielectric divide", mode)
    for fx, col in ((f_soil, c[1]), (f_sea, c[2])):
        ax.plot([fx], [1.0], "o", color=col, ms=6)
        ax.plot([fx, fx], [2e-5, 1.0], color=S.GRID[mode], lw=0.9, ls=":")
    S.note(ax, f_soil * 0.7, 2.6e-5, "soil: 12 MHz", mode, ha="right")
    S.note(ax, f_sea * 1.35, 2.6, "seawater: 888 MHz", mode)
    S.note(ax, 13, 1.2e-3, "copper crosses only near 10¹⁸ Hz -\n"
                           "no engineering band comes close", mode)
    ax.set_xlabel("frequency  (Hz)")
    ax.set_ylabel("loss tangent  σ / ωε")
    ax.set_title("Conductor or dielectric is a statement about frequency, not material")
    ax.set_xlim(10, 5e11)
    ax.set_ylim(1e-5, 1e19)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Transmission lines
# ---------------------------------------------------------------------------


@figure("em-standing-wave-envelope")
def _(mode):
    """Voltage magnitude along a line for three loads on 50 ohm.

    |V(d)| = |V+| |1 + Gamma e^(-2 j beta d)| with d measured back from the
    load, evaluated for Gamma = 0 (matched 50), +1/3 (100 ohm) and +1/2
    (150 ohm). The assertions check each envelope's max/min ratio equals the
    VSWR formula (1+|G|)/(1-|G|) and that neighbouring minima sit half a
    wavelength apart - the two facts a slotted-line measurement uses.
    """
    c = S.SERIES[mode]
    d = np.linspace(0, 1.0, 4000)          # in wavelengths
    beta_d = 2 * np.pi * d

    def env(g):
        return np.abs(1 + g * np.exp(-2j * beta_d))

    loads = [(0.0, "50 Ω: matched, flat"), (1 / 3, "100 Ω: VSWR 2.0"),
             (0.5, "150 Ω: VSWR 3.0")]
    for i, (g, _lab) in enumerate(loads):
        e = env(g)
        vswr = (1 + abs(g)) / (1 - abs(g))
        assert abs(e.max() - (1 + g)) < 1e-6, (g, e.max())
        assert abs(e.min() - (1 - g)) < 1e-6, (g, e.min())
        assert abs(e.max() / e.min() - vswr) < 1e-5, (g, vswr)
        if g:
            mins = d[1:-1][(e[1:-1] < e[:-2]) & (e[1:-1] < e[2:])]
            assert abs(mins[0] - 0.25) < 1e-3, mins
            assert abs(mins[1] - mins[0] - 0.5) < 1e-3, mins
    assert abs((1 + 1 / 3) / (1 - 1 / 3) - 2.0) < 1e-12
    assert abs((1 + 0.5) / (1 - 0.5) - 3.0) < 1e-12

    fig, ax = plt.subplots()
    for i, (g, lab) in enumerate(loads):
        ax.plot(d, env(g), color=c[i], lw=2.2)
    S.label_end(ax, 1.0, 1.0, "50 Ω: matched, flat", c[0], mode, dy=-11)
    S.label_end(ax, 1.0, env(1 / 3)[-1], "100 Ω: VSWR 2.0", c[1], mode, dy=4)
    S.label_end(ax, 1.0, env(0.5)[-1], "150 Ω: VSWR 3.0", c[2], mode, dy=14)
    ax.axvline(0.25, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.axvline(0.75, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 0.262, 0.06, "minima every λ/2", mode)
    ax.plot([0.25, 0.75], [0.5, 0.5], "o", color=c[2], ms=6)
    ax.plot([0.0, 0.5, 1.0], [1.5, 1.5, 1.5], "o", color=c[2], ms=6)
    S.note(ax, 0.30, 1.63, "peak 1 + |Γ| = 1.5, trough 1 − |Γ| = 0.5   →   VSWR = 3", mode)
    ax.set_xlabel("distance back from the load  d / λ")
    ax.set_ylabel("|V(d)| / |V⁺|")
    ax.set_title("The mismatch is readable from the pattern alone")
    ax.set_xlim(0, 1.24)
    ax.set_ylim(0, 1.78)
    S.strip(ax)
    return fig


@figure("em-quarter-wave-bandwidth")
def _(mode):
    """Input mismatch against frequency, with and without a lambda/4 section.

    A 100 ohm load on a 50 ohm system reflects |Gamma| = 1/3 at every
    frequency (flat line). Insert a quarter-wave transformer of
    Z0 = sqrt(50*100) = 70.71 ohm and the mismatch is annihilated at f0 but
    returns as the section's electrical length drifts from 90 degrees:
    Zin = Z0 (ZL + j Z0 tan(theta))/(Z0 + j ZL tan(theta)) with
    theta = (pi/2)(f/f0), then Gamma = (Zin - 50)/(Zin + 50). Everything
    drawn is that pair of formulas.
    """
    c = S.SERIES[mode]
    Zs, ZL = 50.0, 100.0
    Zq = np.sqrt(Zs * ZL)
    x = np.linspace(0.02, 1.98, 3000)
    th = (np.pi / 2) * x
    t = np.tan(th)
    zin = Zq * (ZL + 1j * Zq * t) / (Zq + 1j * ZL * t)
    g = np.abs((zin - Zs) / (zin + Zs))
    g_direct = np.full_like(x, abs((ZL - Zs) / (ZL + Zs)))

    assert abs(Zq - 70.71068) < 5e-6, Zq
    i0 = int(np.searchsorted(x, 1.0))
    assert g[i0] < 2e-3, g[i0]
    assert abs(float(np.interp(0.8, x, g)) - 0.108609) < 5e-5
    assert abs(g_direct[0] - 1 / 3) < 1e-12
    assert abs(g[0] - 1 / 3) < 2e-3, g[0]     # half-wave repeats the load
    # VSWR 1.25 band edges, interpolated from the drawn curve on each side of f0
    lo = float(np.interp(-1 / 9, -g[:i0], x[:i0]))
    hi = float(np.interp(1 / 9, g[i0:], x[i0:]))
    assert abs(lo - 0.795167) < 1e-4, lo
    assert abs(hi - 1.204833) < 1e-4, hi
    assert abs((hi - lo) - 0.409666) < 2e-4, hi - lo

    fig, ax = plt.subplots()
    ax.plot(x, g_direct, color=c[1], lw=2.2)
    ax.plot(x, g, color=c[0], lw=2.2)
    S.label_end(ax, 1.98, 1 / 3, "no transformer: |Γ| = 1/3 at every frequency",
                c[1], mode, dy=10, ha="right")
    S.label_end(ax, 0.12, 0.052, "with a λ/4 section\nof 70.71 Ω", c[0], mode, dx=0)
    ax.axhline(1 / 9, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 0.06, 0.122, "|Γ| = 1/9, i.e. VSWR 1.25", mode)
    ax.plot([1.0], [0.0], "o", color=c[0], ms=7)
    S.note(ax, 1.03, 0.004, "perfect only at f₀", mode)
    ax.plot([lo, hi], [1 / 9, 1 / 9], "o", color=c[0], ms=6)
    S.note(ax, 1.26, 0.072, "41% bandwidth:\n0.795 f₀ to 1.205 f₀", mode)
    ax.set_xlabel("frequency  f / f₀")
    ax.set_ylabel("input reflection magnitude  |Γ|")
    ax.set_title("A quarter-wave match is exact at one frequency and useful near it")
    ax.set_xlim(0, 2.0)
    ax.set_ylim(0, 0.40)
    S.strip(ax)
    return fig


def render(name: str, fn) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
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
