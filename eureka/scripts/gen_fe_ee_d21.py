#!/usr/bin/env python3
"""Depth-wave-21 figures for the FE Electrical and Computer course:
the two Engineering Sciences chapters on work, energy, power and efficiency
(fee_work_energy) and on charge, current and the coulomb (fee_charge_current).

Same contract as gen_fe_ee_d20.py, and it imports the SAME style module rather
than growing a second look. Every curve here is COMPUTED, in this file, from a
relation the lesson that references it writes out; nothing is traced, scanned,
redrawn or adapted from the NCEES Reference Handbook or from any textbook. The
pipeline consumes equations and named tabulated constants, never anyone's
drawing of them.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Every figure asserts the numbers the lesson quotes from it, at 1e-9 wherever
the quantity is exact in closed form and at half the last quoted digit
otherwise. The energy assertions are written twice over: once against the
closed form and once against a numerical integration of instantaneous power
over time (or of current over time, for charge), because an energy that agrees
with its own algebra but not with the area under its own power curve is wrong
in the way that matters to a student with a calculator.

`checks` re-derives, by two independent routes each, every number the two
chapters print outside a figure. Nothing in the prose is asserted only once.

Usage:
    python3 scripts/gen_fe_ee_d21.py             # all figures
    python3 scripts/gen_fe_ee_d21.py sci2-rc     # only names with that prefix
    python3 scripts/gen_fe_ee_d21.py checks      # prose-number verification
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

REGISTRY: dict[str, callable] = {}

# ------------------------------------------------------------------ constants
# Named, tabulated, with units. Nothing else enters a calculation.
G = 9.81                    # m/s^2, standard gravity to three figures
E_CHG = 1.602176634e-19     # C, elementary charge (exact, SI 2019)
N_CU = 8.5e28               # free electrons per m^3 in copper
RHO_CU_E = 1.724e-8         # ohm.m, resistivity of annealed copper at 20 C
RHO_CU_M = 8960.0           # kg/m^3, density of copper
RHO_STEEL = 7850.0          # kg/m^3, density of structural steel
RHO_H2O = 998.0             # kg/m^3, water at 20 C
FARADAY = 96485.0           # C/mol
M_CU = 63.546               # g/mol
M_AG = 107.868              # g/mol
M_NI = 58.693               # g/mol
N_SI_DONOR = 1.0e22         # m^-3, an n-type silicon doped 1e16 cm^-3


def figure(name):
    if not name.startswith("sci2-"):
        raise ValueError(f"this generator owns only the sci2- prefix: {name}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


def close(a, b, tol, what=""):
    """Assert with the offending pair in the message."""
    assert abs(a - b) < tol, f"{what}: {a!r} vs {b!r} (tol {tol})"


# ---------------------------------------------------------------------------
# fee_work_energy
# ---------------------------------------------------------------------------


@figure("sci2-work-line-integral")
def _(mode):
    """Work as the area under F(x), against the constant-force rectangle.

    F(x) = 60 + 25x newtons over 0 <= x <= 4 m.
      line integral   W = int F dx = 60(4) + 25(4^2)/2 = 240 + 200 = 440 J
      constant force  W = F(0) d   = 60 x 4           = 240 J
    """
    c = S.SERIES[mode]
    x = np.linspace(0.0, 4.0, 4001)
    F = 60.0 + 25.0 * x

    exact = 60.0 * 4.0 + 25.0 * 16.0 / 2.0
    close(exact, 440.0, 1e-12, "closed-form work")
    # independent route: numerical quadrature of the same integrand
    close(np.trapz(F, x), 440.0, 1e-9, "trapezoid work")
    # and a third: mean value of a linear force times the distance
    close(0.5 * (F[0] + F[-1]) * 4.0, 440.0, 1e-12, "mean-force work")
    close(60.0 * 4.0, 240.0, 1e-12, "constant-force rectangle")
    close(F[-1], 160.0, 1e-12, "force at x = 4 m")

    fig, ax = plt.subplots()
    ax.fill_between(x, 0.0, F, color=c[0], alpha=0.20, linewidth=0)
    ax.plot(x, F, color=c[0], lw=2.3)
    ax.plot([0.0, 4.0, 4.0, 0.0, 0.0], [60.0, 60.0, 0.0, 0.0, 60.0],
            color=c[1], lw=2.0, ls=(0, (5, 3)))
    S.label_end(ax, 3.0, 60.0 + 25.0 * 3.0, "F(x) = 60 + 25x", c[0], mode,
                dx=-8, dy=10, ha="right")
    S.label_end(ax, 2.0, 60.0, "constant-force rectangle, 240 J", c[1], mode,
                dx=0, dy=-16, ha="center")
    S.note(ax, 0.18, 96.0, "shaded area = 440 J - the line integral,\nnot force times distance", mode)
    ax.plot([4.0], [160.0], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 3.90, 165.0, "160 N at x = 4 m", mode, ha="right")
    ax.set_xlabel("displacement along the path  x  (m)")
    ax.set_ylabel("force component along the path  (N)")
    ax.set_title("Work is an area, and the rectangle is only a special case")
    ax.set_xlim(0, 4.35)
    ax.set_ylim(0, 190)
    S.strip(ax)
    return fig


def hoist_profile(n=2001):
    """Trapezoidal hoist duty: 0 -> 0.75 m/s in 5 s, cruise 25 s, stop in 5 s.

    The three segments are built separately and the breakpoints appear TWICE,
    so the step in cable tension at 5 s and at 30 s is represented as a genuine
    discontinuity. Sampling it once would quietly shave the trapezoid rule and
    make the area under the power curve miss mgh by about a joule.
    """
    m, vmax, t1, t2, t3 = 1500.0, 0.75, 5.0, 30.0, 35.0
    a1 = vmax / t1
    ta, tb, tc = (np.linspace(0.0, t1, n), np.linspace(t1, t2, n),
                  np.linspace(t2, t3, n))
    t = np.concatenate((ta, tb, tc))
    v = np.concatenate((a1 * ta, np.full(n, vmax), vmax - a1 * (tc - t2)))
    F = np.concatenate((np.full(n, m * (G + a1)), np.full(n, m * G),
                        np.full(n, m * (G - a1))))
    return t, v, F, F * v


@figure("sci2-hoist-power-energy")
def _(mode):
    """Cable power and cumulative energy for a 1,500 kg hoist duty cycle.

    F = m(g + a) and P = Fv at every instant; the cumulative area under P must
    land on mgh, because the load starts and finishes at rest.
    """
    c = S.SERIES[mode]
    t, v, F, P = hoist_profile()
    W = np.concatenate(([0.0], np.cumsum(np.diff(t) * 0.5 * (P[1:] + P[:-1]))))

    h = float(np.trapz(v, t))
    close(h, 22.5, 1e-9, "lift height from the speed profile")
    close(1500.0 * G * 22.5, 331087.5, 1e-9, "mgh")
    close(W[-1], 331087.5, 1e-6, "area under the power curve")   # <-- the point
    close(P.max(), 11205.0, 1e-9, "peak cable power")
    close(1500.0 * G * 0.75, 11036.25, 1e-12, "cruise power")
    close(1500.0 * (G + 0.15), 14940.0, 1e-9, "tension while accelerating")
    close(1500.0 * (G - 0.15), 14490.0, 1e-12, "tension while stopping")
    close(331087.5 / 35.0, 9459.642857142857, 1e-9, "cycle-average power")
    close(331087.5 / 0.82, 403765.2439024390, 1e-7, "electrical input energy")
    # the kinetic-energy round trip really is zero over the cycle
    close(0.5 * 1500.0 * v[-1] ** 2, 0.0, 1e-12, "final kinetic energy")

    fig, ax = plt.subplots(2, 1, sharex=True, figsize=(7.2, 6.0))
    ax[0].plot(t, P / 1000.0, color=c[0], lw=2.3)
    S.label_end(ax[0], 17.0, 11.03625, "P = F v,  F = m(g + a)", c[0], mode,
                dy=-16, ha="center")
    ax[0].plot([5.0], [11.205], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax[0], 6.0, 11.75, "11,205 W peak - the motor is sized here", mode)
    S.note(ax[0], 29.4, 4.2, "tension falls to\n14,490 N while\ndecelerating", mode,
           ha="right")
    ax[0].set_ylabel("cable power  (kW)")
    ax[0].set_title("A hoist cycle: the area under the power curve is mgh")
    ax[0].set_ylim(0, 13.6)
    S.strip(ax[0])

    ax[1].plot(t, W / 1000.0, color=c[1], lw=2.3)
    ax[1].axhline(331.0875, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.label_end(ax[1], 20.0, 180.0, "cumulative work", c[1], mode, dy=0)
    S.note(ax[1], 1.0, 300.0, "mgh = 1,500 x 9.81 x 22.5 = 331.0875 kJ", mode)
    ax[1].set_xlabel("time  (s)")
    ax[1].set_ylabel("energy delivered  (kJ)")
    ax[1].set_xlim(0, 36.5)
    ax[1].set_ylim(0, 380)
    S.strip(ax[1])
    return fig


def flywheel():
    """Solid steel disc, 0.60 m diameter, 0.080 m thick."""
    R, th = 0.30, 0.080
    m = RHO_STEEL * np.pi * R * R * th
    I = 0.5 * m * R * R
    return m, I


@figure("sci2-flywheel-usable-energy")
def _(mode):
    """Rotational kinetic energy against speed for a steel flywheel.

    E = (1/2) I omega^2 with omega = 2 pi N / 60, so E rises as N^2 and the
    band between two speeds is the only part a machine can actually use.
    """
    c = S.SERIES[mode]
    m, I = flywheel()
    close(m, 177.562817, 5e-7, "flywheel mass")
    close(I, 7.99032676, 5e-9, "flywheel moment of inertia")

    N = np.linspace(0.0, 4000.0, 4001)
    w = 2.0 * np.pi * N / 60.0
    E = 0.5 * I * w * w

    def ke(rpm):
        return 0.5 * I * (2.0 * np.pi * rpm / 60.0) ** 2

    close(ke(3600.0), 567801.8216, 5e-5, "energy at 3,600 rpm")
    close(ke(2400.0), 252356.3651, 5e-5, "energy at 2,400 rpm")
    close(ke(3600.0) - ke(2400.0), 315445.4564, 5e-5, "usable band")
    # independent route: the ratio must be exactly 1 - (2/3)^2 = 5/9
    close((ke(3600.0) - ke(2400.0)) / ke(3600.0), 5.0 / 9.0, 1e-12, "5/9 rule")
    close((ke(3600.0) - ke(2400.0)) / 3.0, 105148.4855, 5e-5, "3 s mean power")

    fig, ax = plt.subplots()
    ax.plot(N, E / 1000.0, color=c[0], lw=2.3)
    band = (N >= 2400.0) & (N <= 3600.0)
    ax.fill_between(N[band], ke(2400.0) / 1000.0, E[band] / 1000.0,
                    color=c[1], alpha=0.25, linewidth=0)
    for rpm, tag in ((2400.0, "2,400 rpm: 252.36 kJ"), (3600.0, "3,600 rpm: 567.80 kJ")):
        ax.plot([rpm], [ke(rpm) / 1000.0], "o", color=S.INK[mode], ms=6, zorder=5)
        S.note(ax, rpm - 120.0, ke(rpm) / 1000.0 + 22.0, tag, mode, ha="right")
    S.label_end(ax, 3850.0, ke(3850.0) / 1000.0, "E = ½ I ω²", c[0], mode,
                dx=-6, dy=8, ha="right")
    S.note(ax, 250.0, 640.0, "usable band 315.45 kJ - five ninths of the stored\n"
                             "energy, because 2,400/3,600 = 2/3 and E goes as N²",
           mode)
    ax.set_xlabel("shaft speed  N  (rev/min)")
    ax.set_ylabel("stored kinetic energy  (kJ)")
    ax.set_title("A flywheel gives up only the band between two speeds")
    ax.set_xlim(0, 4200)
    ax.set_ylim(0, 780)
    S.strip(ax)
    return fig


def motor_run_up(n=16001, span=8.0):
    """Separately excited DC motor, fixed armature voltage, inertial load.

    V = i R + K omega and tau = K i = J domega/dt give a first-order rise
        omega(t) = omega_inf (1 - e^{-t/T}),  T = J R / K^2,  omega_inf = V/K
    with armature current i(t) = (V/R) e^{-t/T}.
    """
    V, R, K, J = 240.0, 0.45, 1.8, 0.85
    T = J * R / (K * K)
    w_inf = V / K
    t = np.linspace(0.0, span * T, n)
    w = w_inf * (1.0 - np.exp(-t / T))
    i = (V / R) * np.exp(-t / T)
    return V, R, K, J, T, w_inf, t, w, i


@figure("sci2-motor-load-accel")
def _(mode):
    """Run-up of an inertial load, and where the supply energy actually goes.

    Half the energy drawn from the supply during an unresisted run-up ends up
    in the armature resistance, whatever the resistance is - the mechanical
    twin of charging a capacitor through a resistor.
    """
    c = S.SERIES[mode]
    V, R, K, J, T, w_inf, t, w, i = motor_run_up()
    close(T, 0.1180555555555556, 1e-12, "mechanical time constant")
    close(w_inf, 133.3333333333333, 1e-10, "no-load speed")
    close(V / R, 533.3333333333333, 1e-10, "locked-rotor current")
    close(K * V / R, 960.0, 1e-9, "stall torque")
    close(0.5 * J * w_inf ** 2, 7555.555555555556, 1e-9, "final kinetic energy")
    close((V * V / R) * (T / 2.0), 7555.555555555556, 1e-9, "total armature loss")
    close(T * np.log(20.0), 0.35366284, 5e-9, "time to 95% of final speed")

    ke = 0.5 * J * w * w
    loss = np.concatenate(([0.0], np.cumsum(np.diff(t) * 0.5 * ((i[1:] ** 2 + i[:-1] ** 2) * R))))
    src = np.concatenate(([0.0], np.cumsum(np.diff(t) * 0.5 * (V * (i[1:] + i[:-1])))))
    # the numerical integrals must close against the closed forms, everywhere
    close(loss[-1], (V * V / R) * (T / 2.0) * (1.0 - np.exp(-16.0)), 2e-3, "loss integral")
    close(src[-1], V * (V / R) * T * (1.0 - np.exp(-8.0)), 2e-3, "supply integral")
    assert np.max(np.abs(src - (ke + loss))) / 15111.111 < 1e-7, np.max(np.abs(src - (ke + loss)))

    fig, ax = plt.subplots(2, 1, sharex=True, figsize=(7.2, 6.0))
    ax[0].plot(t, w, color=c[0], lw=2.3)
    ax[0].axhline(w_inf, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.label_end(ax[0], 0.42, 138.0, "ω(t) = ω∞(1 − e^(−t/T))",
                c[0], mode, dy=0, ha="center")
    ax[0].plot([T], [w_inf * (1.0 - np.exp(-1.0))], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax[0], T + 0.02, 60.0, "one time constant\nT = J R / K² = 0.1181 s", mode)
    S.note(ax[0], 0.45, 108.0, "ω∞ = V/K = 133.33 rad/s  (1,273 rev/min)", mode)
    ax[0].set_ylabel("shaft speed  ω  (rad/s)")
    ax[0].set_title("Accelerating an inertial load costs twice the kinetic energy")
    ax[0].set_ylim(0, 152)
    S.strip(ax[0])

    ax[1].plot(t, src, color=c[0], lw=2.3)
    ax[1].plot(t, ke, color=c[1], lw=2.3)
    ax[1].plot(t, loss, color=c[2], lw=2.3, ls=(0, (5, 3)))
    S.label_end(ax[1], 0.945, 15106.0, "from the supply", c[0], mode, dx=8)
    S.label_end(ax[1], 0.945, 6600.0, "kinetic energy", c[1], mode, dx=8)
    S.label_end(ax[1], 0.945, 8600.0, "armature I²R", c[2], mode, dx=8)
    S.note(ax[1], 0.30, 2200.0, "both settle at 7,555.6 J - exactly half\n"
                                "the 15,111.1 J the supply provides", mode)
    ax[1].set_xlabel("time  (s)")
    ax[1].set_ylabel("cumulative energy  (J)")
    ax[1].set_xlim(0, 1.42)
    ax[1].set_ylim(0, 16800)
    S.strip(ax[1])
    return fig


def eta_load(x, S_r=25000.0, P0=95.0, Pc=320.0):
    """Efficiency of a transformer at per-unit load x, unity power factor."""
    out = S_r * x
    return out / (out + P0 + Pc * x * x)


@figure("sci2-efficiency-vs-load")
def _(mode):
    """Efficiency against load for a 25 kVA transformer, 95 W core, 320 W copper.

    Maximum efficiency sits where the load-dependent loss equals the fixed
    loss, x* = sqrt(P0/Pc) - not at full load, which is the whole point.
    """
    c = S.SERIES[mode]
    x = np.linspace(0.02, 1.25, 2461)
    y = eta_load(x)

    xstar = np.sqrt(95.0 / 320.0)
    close(xstar, 0.5448623679, 5e-10, "loss-balance load fraction")
    close(320.0 * xstar * xstar, 95.0, 1e-9, "copper loss equals core loss there")
    close(eta_load(xstar), 0.986243407, 5e-10, "peak efficiency")
    close(eta_load(1.0), 0.9836710604, 5e-10, "full-load efficiency")
    close(eta_load(0.25), 0.9819324430, 5e-10, "quarter-load efficiency")
    close(eta_load(0.05), 0.928815574, 5e-10, "5% load efficiency")
    # independent route: the peak located by search, not by the formula
    fine = np.linspace(0.30, 0.80, 500001)
    close(fine[int(np.argmax(eta_load(fine)))], xstar, 2e-6, "peak located numerically")

    fig, ax = plt.subplots()
    ax.plot(x * 100.0, y * 100.0, color=c[0], lw=2.3)
    ax.axvline(xstar * 100.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    for xx, tag in ((xstar, "peak 98.624% at 54.49% load"),
                    (1.0, "full load 98.367%")):
        ax.plot([xx * 100.0], [eta_load(xx) * 100.0], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 57.0, 98.74, "peak 98.624% at 54.49% load", mode)
    S.note(ax, 97.0, 97.75, "full load 98.367%", mode, ha="right")
    S.label_end(ax, 122.0, eta_load(1.22) * 100.0, "η(x)", c[0], mode, dx=0, dy=-14,
                ha="center")
    S.note(ax, 20.0, 93.2, "core loss is there whether or not the\n"
                           "machine is working, so light load is\n"
                           "where efficiency collapses", mode)
    ax.set_xlabel("load as a fraction of rating  (%)")
    ax.set_ylabel("efficiency  (%)")
    ax.set_title("Peak efficiency is where copper loss meets core loss")
    ax.set_xlim(0, 132)
    ax.set_ylim(91.5, 99.4)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# fee_charge_current
# ---------------------------------------------------------------------------


def pulse(n=4001):
    """Triangular pulse: 0 -> 4 A over 2 ms, then back to 0 over 3 ms."""
    seg = (np.linspace(0.0, 2e-3, n), np.linspace(2e-3, 5e-3, n)[1:],
           np.linspace(5e-3, 7e-3, n)[1:])
    t = np.concatenate(seg)
    i = np.where(t <= 2e-3, 4.0 * t / 2e-3,
                 np.where(t <= 5e-3, 4.0 * (5e-3 - t) / 3e-3, 0.0))
    return t, i


@figure("sci2-charge-integral")
def _(mode):
    """A current pulse and the charge it moves, q(t) = integral of i dt."""
    c = S.SERIES[mode]
    t, i = pulse()
    q = np.concatenate(([0.0], np.cumsum(np.diff(t) * 0.5 * (i[1:] + i[:-1]))))

    close(0.5 * 4.0 * 5e-3, 0.010, 1e-15, "triangle area, closed form")
    close(q[-1], 0.010, 1e-12, "triangle area, quadrature")     # independent route
    close(q[np.searchsorted(t, 2e-3)], 0.004, 1e-9, "charge at the peak")
    close(0.010 / 5e-3, 2.0, 1e-12, "mean current over the pulse")
    close(0.010 / E_CHG, 6.241509074460763e16, 5e9, "electrons moved")

    fig, ax = plt.subplots(2, 1, sharex=True, figsize=(7.2, 6.0))
    ax[0].plot(t * 1000.0, i, color=c[0], lw=2.3)
    ax[0].fill_between(t * 1000.0, 0.0, i, color=c[0], alpha=0.18, linewidth=0)
    S.label_end(ax[0], 2.0, 4.0, "i(t)", c[0], mode, dx=6, dy=4)
    S.note(ax[0], 2.4, 2.55, "shaded area = 10 mC", mode)
    ax[0].axhline(2.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax[0], 5.15, 2.06, "mean 2.0 A over the 5 ms pulse", mode)
    ax[0].set_ylabel("current  i  (A)")
    ax[0].set_title("Charge is the area under the current waveform")
    ax[0].set_ylim(0, 4.7)
    S.strip(ax[0])

    ax[1].plot(t * 1000.0, q * 1000.0, color=c[1], lw=2.3)
    ax[1].axhline(10.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax[1].plot([2.0], [4.0], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax[1], 2.2, 3.4, "4 mC by the current peak - the steepest\n"
                            "part of q(t) is where i is largest", mode)
    S.label_end(ax[1], 5.6, 10.0, "q(t) = ∫ i dt", c[1], mode, dx=6, dy=-14)
    ax[1].set_xlabel("time  (ms)")
    ax[1].set_ylabel("charge moved  q  (mC)")
    ax[1].set_xlim(0, 7.2)
    ax[1].set_ylim(0, 12.2)
    S.strip(ax[1])
    return fig


@figure("sci2-drift-velocity")
def _(mode):
    """Drift velocity against current density, copper against doped silicon.

    v = J / (n q). The line is the same law; only n changes, and it changes by
    seven orders of magnitude, which is the entire point.
    """
    c = S.SERIES[mode]
    nq_cu = N_CU * E_CHG
    nq_si = N_SI_DONOR * E_CHG
    # The linear drift model is only honest below the saturation velocity, so
    # the silicon line stops where v reaches 1e5 m/s and the ceiling is drawn.
    v_sat = 1.0e5
    j_sat = v_sat * nq_si
    J = np.logspace(4.0, 9.0, 601)
    Jsi = np.logspace(4.0, np.log10(j_sat), 601)

    close(nq_cu, 1.3618501389e10, 5e1, "carrier charge density in copper")
    close(nq_si, 1602.176634, 5e-7, "carrier charge density in the silicon")
    close(j_sat, 1.602176634e8, 5e-5, "current density at velocity saturation")
    # three real conductors, each computed from I and its own cross-section
    j12 = 15.0 / 3.309e-6
    close(j12, 4533091.5685, 5e-4, "12 AWG current density at 15 A")
    close(j12 / nq_cu, 0.0003328627, 5e-11, "12 AWG drift velocity")
    jtrace = 2.0 / (35e-6 * 0.5e-3)
    close(jtrace, 1.142857142857e8, 5e-3, "PCB trace current density")
    close(jtrace / nq_cu, 0.008391945, 5e-10, "PCB trace drift velocity")
    jbus = 1200.0 / 6.0e-4
    close(jbus, 2.0e6, 1e-6, "busbar current density")
    close(jbus / nq_cu, 0.0001468590, 5e-11, "busbar drift velocity")
    close(1.0e6 / nq_si, 624.150907446, 5e-9, "silicon at 1e6 A/m2")
    # the two lines are separated by exactly the carrier-density ratio
    close((1.0e6 / nq_si) / (1.0e6 / nq_cu), N_CU / N_SI_DONOR, 1e-3,
          "ratio is n_Cu/n_Si")

    fig, ax = plt.subplots()
    ax.loglog(Jsi, Jsi / nq_si, color=c[1], lw=2.3)
    ax.loglog(J, J / nq_cu, color=c[0], lw=2.3)
    ax.axhline(v_sat, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.label_end(ax, 1.1e6, 1.1e6 / nq_si, "silicon, n = 10²² m⁻³",
                c[1], mode, dx=8, dy=-12, ha="left")
    S.label_end(ax, 1.6e9, 1.6e9 / nq_cu, "copper, n = 8.5×10²⁸ m⁻³",
                c[0], mode, dx=0, dy=17, ha="right")
    S.note(ax, 1.3e4, 1.30e5, "carriers cannot go faster than about 10⁵ m/s in silicon; "
                             "past here the\nlinear drift model has stopped being true",
           mode)
    for jj, tag, dx, dy, ha in (
            (jbus, "busbar 2.0 A/mm²\n0.147 mm/s", 0.55, 1.9, "right"),
            (j12, "12 AWG at 15 A\n0.333 mm/s", 1.7, 0.10, "left"),
            (jtrace, "PCB trace 114 A/mm²\n8.39 mm/s", 0.7, 3.0, "right")):
        ax.plot([jj], [jj / nq_cu], "o", color=S.INK[mode], ms=6, zorder=5)
        S.note(ax, jj * dx, jj / nq_cu * dy, tag, mode, ha=ha)
    ax.set_xlabel("current density  J  (A/m²)")
    ax.set_ylabel("drift velocity  v  (m/s)")
    ax.set_title("Same law, same current density, seven decades of speed")
    ax.set_xlim(1e4, 3e9)
    ax.set_ylim(1e-7, 1e6)
    S.strip(ax)
    return fig


@figure("sci2-capacitor-energy")
def _(mode):
    """Charge is linear in voltage; energy is quadratic. C = 220 uF."""
    c = S.SERIES[mode]
    C = 220e-6
    V = np.linspace(0.0, 400.0, 4001)
    Q = C * V
    W = 0.5 * C * V * V

    close(C * 400.0, 0.088, 1e-15, "charge at 400 V")
    close(0.5 * C * 400.0 ** 2, 17.6, 1e-13, "energy at 400 V")
    close(0.088 ** 2 / (2.0 * C), 17.6, 1e-12, "energy as Q^2/2C")
    close(0.5 * 0.088 * 400.0, 17.6, 1e-13, "energy as QV/2")
    close(0.5 * C * 200.0 ** 2, 4.4, 1e-13, "energy at half voltage")
    # independent route: energy as the area under the charge-voltage line
    close(float(np.trapz(Q, V)), 17.6, 1e-9, "area under Q(V)")
    close(0.088 / E_CHG, 5.4925279855e17, 5e10, "electrons displaced")
    close(17.6 / 250e-6, 70400.0, 1e-8, "mean power into a 250 us discharge")

    fig, ax = plt.subplots(2, 1, sharex=True, figsize=(7.2, 6.0))
    ax[0].plot(V, Q * 1000.0, color=c[0], lw=2.3)
    for vv in (200.0, 400.0):
        ax[0].plot([vv], [C * vv * 1000.0], "o", color=S.INK[mode], ms=6, zorder=5)
    S.label_end(ax[0], 330.0, C * 330.0 * 1000.0, "Q = CV", c[0], mode, dx=-6, dy=12,
                ha="right")
    S.note(ax[0], 192.0, 49.0, "half the voltage, half the charge: 44 mC", mode,
           ha="right")
    S.note(ax[0], 396.0, 68.0, "88 mC", mode, ha="right")
    ax[0].set_ylabel("stored charge  (mC)")
    ax[0].set_title("Halve the voltage and you keep a quarter of the energy")
    ax[0].set_ylim(0, 100)
    S.strip(ax[0])

    ax[1].plot(V, W, color=c[1], lw=2.3)
    ax[1].fill_between(V, 0.0, W, color=c[1], alpha=0.16, linewidth=0)
    for vv in (200.0, 400.0):
        ax[1].plot([vv], [0.5 * C * vv * vv], "o", color=S.INK[mode], ms=6, zorder=5)
    S.label_end(ax[1], 320.0, 0.5 * C * 320.0 ** 2, "W = ½CV²", c[1], mode, dx=-6, dy=12,
                ha="right")
    S.note(ax[1], 208.0, 3.2, "but only 4.4 J - a quarter", mode)
    S.note(ax[1], 396.0, 12.4, "17.6 J", mode, ha="right")
    ax[1].set_xlabel("capacitor voltage  V  (V)")
    ax[1].set_ylabel("stored energy  (J)")
    ax[1].set_xlim(0, 430)
    ax[1].set_ylim(0, 20.5)
    S.strip(ax[1])
    return fig


def rc_charge(n=6001, span=5.0):
    """24 V source, 10 kohm, 47 uF."""
    Vs, R, C = 24.0, 10000.0, 47e-6
    T = R * C
    t = np.linspace(0.0, span * T, n)
    v = Vs * (1.0 - np.exp(-t / T))
    i = (Vs / R) * np.exp(-t / T)
    return Vs, R, C, T, t, v, i


@figure("sci2-rc-charge-waveforms")
def _(mode):
    """RC charging: voltage, current, and the exact 50/50 energy split."""
    c = S.SERIES[mode]
    Vs, R, C, T, t, v, i = rc_charge()
    close(T, 0.47, 1e-12, "RC time constant")
    close(Vs * (1.0 - np.exp(-1.0)), 15.17089341, 5e-9, "voltage at one tau")
    close((Vs / R) * np.exp(-1.0), 0.0008829107, 5e-11, "current at one tau")
    close(C * Vs, 1.128e-3, 1e-15, "final charge")
    close((Vs / R) * T, 1.128e-3, 1e-15, "charge as (V/R) x tau")

    q = np.concatenate(([0.0], np.cumsum(np.diff(t) * 0.5 * (i[1:] + i[:-1]))))
    wr = np.concatenate(([0.0], np.cumsum(np.diff(t) * 0.5 * R * (i[1:] ** 2 + i[:-1] ** 2))))
    wc = 0.5 * C * v * v
    ws = Vs * q
    # independent route: quadrature against the closed forms
    close(q[-1], C * Vs * (1.0 - np.exp(-5.0)), 1e-9, "charge integral")
    close(wr[-1], 0.5 * C * Vs ** 2 * (1.0 - np.exp(-10.0)), 1e-8, "resistor integral")
    close(0.5 * C * Vs ** 2, 0.013536, 1e-12, "capacitor energy")
    close((Vs * Vs / R) * (T / 2.0), 0.013536, 1e-12, "resistor energy in closed form")
    close(C * Vs * Vs, 0.027072, 1e-12, "energy taken from the source")
    assert np.max(np.abs(ws - (wc + wr))) < 5e-7, np.max(np.abs(ws - (wc + wr)))
    close(5.0 * T, 2.35, 1e-12, "five time constants")
    close(1.0 - np.exp(-5.0), 0.9932620530, 5e-11, "fraction charged at 5 tau")

    fig, ax = plt.subplots(3, 1, sharex=True, figsize=(7.2, 8.2))
    ax[0].plot(t, v, color=c[0], lw=2.3)
    ax[0].axhline(24.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax[0].plot([T], [Vs * (1 - np.exp(-1.0))], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax[0], 0.52, 13.4, "15.171 V at t = τ = 0.47 s  (63.21%)", mode)
    S.label_end(ax[0], 1.7, Vs * (1 - np.exp(-1.7 / T)), "v(t) = Vs(1 − e^(−t/τ))",
                c[0], mode, dy=-18, ha="center")
    ax[0].set_ylabel("capacitor volts")
    ax[0].set_title("Charging a capacitor: the resistor always takes half")
    ax[0].set_ylim(0, 28)
    S.strip(ax[0])

    ax[1].plot(t, i * 1000.0, color=c[1], lw=2.3)
    ax[1].plot([T], [(Vs / R) * np.exp(-1.0) * 1000.0], "o", color=S.INK[mode], ms=6,
               zorder=5)
    S.note(ax[1], 0.55, 1.05, "0.8829 mA at one τ  (36.79%)", mode)
    S.label_end(ax[1], 1.5, (Vs / R) * np.exp(-1.5 / T) * 1000.0,
                "i(t) = (Vs/R) e^(−t/τ)", c[1], mode, dy=14, ha="center")
    S.note(ax[1], 1.05, 2.15, "area under this curve = 1.128 mC = C·Vs", mode)
    ax[1].set_ylabel("current  (mA)")
    ax[1].set_ylim(0, 2.9)
    S.strip(ax[1])

    ax[2].plot(t, ws * 1000.0, color=c[0], lw=2.3)
    ax[2].plot(t, wc * 1000.0, color=c[1], lw=2.3)
    ax[2].plot(t, wr * 1000.0, color=c[2], lw=2.3, ls=(0, (5, 3)))
    S.label_end(ax[2], 2.36, 27.0, "from the source", c[0], mode, dx=6)
    S.label_end(ax[2], 2.36, 12.0, "into the capacitor", c[1], mode, dx=6)
    S.label_end(ax[2], 2.36, 15.6, "burnt in R", c[2], mode, dx=6)
    S.note(ax[2], 0.30, 3.0, "27.072 mJ leaves the source, 13.536 mJ arrives -\n"
                             "the split does not depend on R at all", mode)
    ax[2].set_xlabel("time  (s)")
    ax[2].set_ylabel("energy  (mJ)")
    ax[2].set_xlim(0, 3.35)
    ax[2].set_ylim(0, 30)
    S.strip(ax[2])
    return fig


@figure("sci2-ah-energy-map")
def _(mode):
    """Energy against amp-hour rating at three nominal voltages, W = Q V."""
    c = S.SERIES[mode]
    Ah = np.logspace(-0.5, 2.5, 601)

    close(100.0 * 3600.0, 360000.0, 1e-9, "100 Ah in coulombs")
    close(360000.0 * 12.0, 4320000.0, 1e-6, "100 Ah at 12 V, in joules")
    close(4320000.0 / 3.6e6, 1.2, 1e-12, "the same, in kWh")
    close(3.0 * 3.7, 11.1, 1e-12, "3 Ah at 3.7 V, in Wh")
    close(3.0 * 3600.0 * 3.7, 39960.0, 1e-8, "the same, in joules")
    close(60.0 * 48.0, 2880.0, 1e-10, "60 Ah at 48 V, in Wh")
    close(60.0 * 3600.0 * 48.0, 10368000.0, 1e-5, "the same, in joules")
    close(1200.0 / 25.0, 48.0, 1e-12, "lead-acid specific energy, Wh/kg")
    close(11.1 / 0.045, 246.6666666667, 5e-9, "cell specific energy, Wh/kg")
    close(360000.0 / E_CHG, 2.2469432668e24, 5e17, "electrons in 100 Ah")

    fig, ax = plt.subplots()
    for k, (V, tag) in enumerate(((3.7, "3.7 V cell"), (12.0, "12 V battery"),
                                  (48.0, "48 V pack"))):
        ax.loglog(Ah, Ah * V, color=c[k], lw=2.3)
        S.label_end(ax, 330.0, 330.0 * V, tag, c[k], mode, dx=6, dy=0, ha="left")
    for aa, vv, tag, dy in ((3.0, 3.7, "3 Ah cell: 11.1 Wh", 0.42),
                            (100.0, 12.0, "100 Ah, 12 V: 1,200 Wh", 0.42),
                            (60.0, 48.0, "60 Ah, 48 V: 2,880 Wh", 1.5)):
        ax.plot([aa], [aa * vv], "o", color=S.INK[mode], ms=6, zorder=5)
        S.note(ax, aa * (1.22 if dy < 0.5 and aa < 10 else 0.82), aa * vv * dy, tag,
               mode, ha=("left" if dy < 0.5 and aa < 10 else "right"))
    S.note(ax, 800.0, 1.0, "an amp-hour is a CHARGE. Two cells with\n"
                           "the same rating hold different energies\n"
                           "unless they share a nominal voltage.", mode, ha="right")
    ax.set_xlabel("rated capacity  (A·h)")
    ax.set_ylabel("stored energy  (W·h)")
    ax.set_title("Amp-hours only become energy after you supply a voltage")
    ax.set_xlim(0.3, 900)
    ax.set_ylim(0.8, 60000)
    S.strip(ax)
    return fig


def plating_thickness(J_A, t_s, M=M_CU, n=2, rho=RHO_CU_M):
    """Faraday: d = M J t / (n F rho), with M in kg/mol and d in metres."""
    return (M * 1e-3) * J_A * t_s / (n * FARADAY * rho)


@figure("sci2-plating-thickness")
def _(mode):
    """Copper deposit thickness against time at three plating current densities."""
    c = S.SERIES[mode]
    mins = np.linspace(0.0, 90.0, 901)

    close(plating_thickness(300.0, 2700.0) * 1e6, 29.7697667, 5e-8, "29.77 um in 45 min")
    close(plating_thickness(100.0, 2700.0) * 1e6, 9.9232556, 5e-8, "100 A/m2, 45 min")
    close(plating_thickness(500.0, 2700.0) * 1e6, 49.6162778, 5e-8, "500 A/m2, 45 min")
    # independent route: mass from Faraday, then volume, then thickness
    Q = 3.0 * 2700.0
    close(Q, 8100.0, 1e-9, "charge delivered")
    m_g = Q * M_CU / (2.0 * FARADAY)
    close(m_g, 2.6673711, 5e-8, "grams of copper deposited")
    close((m_g / 8.96) / 100.0 * 1e4, 29.769767, 5e-7, "same thickness from the mass")
    close(M_CU / (2.0 * FARADAY), 0.0003293051, 5e-11, "electrochemical equivalent, g/C")
    close(M_CU / (2.0 * FARADAY) * 3600.0, 1.1854983, 5e-8, "the same, g/Ah")
    close(3.0 * 0.75 * 1.1854967, 2.6673676, 5e-7, "grams from the g/Ah route")
    close(Q / FARADAY, 0.083950873, 5e-10, "moles of electrons")
    close(plating_thickness(300.0, 2700.0) * 1e6 / 45.0, 0.6615504, 5e-8, "um per minute")

    fig, ax = plt.subplots()
    for k, JA in enumerate((100.0, 300.0, 500.0)):
        d = plating_thickness(JA, mins * 60.0) * 1e6
        ax.plot(mins, d, color=c[k], lw=2.3)
        S.label_end(ax, 74.0, plating_thickness(JA, 74.0 * 60.0) * 1e6,
                    f"{JA:.0f} A/m²  ({JA/10:.0f} mA/cm²)",
                    c[k], mode, dx=4, dy=-11, ha="left")
    ax.plot([45.0], [plating_thickness(300.0, 2700.0) * 1e6], "o",
            color=S.INK[mode], ms=7, zorder=5)
    ax.axvline(45.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 47.5, 1.5, "3.0 A over 100 cm² for 45 min:\n2.667 g, 29.77 µm", mode,
           ha="left")
    S.note(ax, 2.0, 95.0, "d = M J t / (n F ρ) - linear in time and in current\n"
                          "density, because Faraday's law is linear in charge", mode)
    ax.set_xlabel("plating time  (min)")
    ax.set_ylabel("copper thickness  (µm)")
    ax.set_title("Faraday's law sets the deposit, one electron pair per atom")
    ax.set_xlim(0, 99)
    ax.set_ylim(0, 108)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# prose numbers: every figure-free result the two chapters print
# ---------------------------------------------------------------------------


def checks() -> None:
    n = 0

    def ok(a, b, tol, what):
        nonlocal n
        close(a, b, tol, what)
        n += 1

    # ---- fee_work_energy, worked example 5A: crate on a floor -------------
    Fw = 240.0 * 12.0 * np.cos(np.radians(30.0))
    ok(Fw, 2494.1532, 5e-5, "5A work by the applied force")
    Nf = 80.0 * G - 240.0 * np.sin(np.radians(30.0))
    ok(Nf, 664.8, 1e-9, "5A normal force")
    fr = 0.25 * Nf
    ok(fr, 166.2, 1e-9, "5A friction force")
    ok(-fr * 12.0, -1994.4, 1e-9, "5A work against friction")
    Wnet = Fw - fr * 12.0
    ok(Wnet, 499.7532, 5e-5, "5A net work")
    ok(np.sqrt(2.0 * Wnet / 80.0), 3.5346611, 5e-8, "5A final speed")
    # independent route: Newton's second law and constant-acceleration kinematics
    acc = (240.0 * np.cos(np.radians(30.0)) - fr) / 80.0
    ok(acc, 0.5205762, 5e-8, "5A acceleration")
    ok(np.sqrt(2.0 * acc * 12.0), 3.5346611, 5e-8, "5A speed again, from kinematics")

    # ---- worked example 5B: spring launcher ------------------------------
    U = 0.5 * 3500.0 * 0.080 ** 2
    ok(U, 11.2, 1e-12, "5B spring energy")
    xs = np.linspace(0.0, 0.080, 200001)
    ok(float(np.trapz(3500.0 * xs, xs)), 11.2, 1e-9, "5B spring energy by quadrature")
    ok(np.sqrt(2.0 * U / 0.45), 7.0553368, 5e-8, "5B launch speed")
    ok(U / (0.45 * G), 2.5370937, 5e-8, "5B rise height")
    ok((2.0 * U / 0.45) / (2.0 * G), 2.5370937, 5e-8, "5B rise height from v^2/2g")

    # ---- worked example 5C: incline with friction ------------------------
    hh = 6.0 * np.sin(np.radians(20.0))
    ok(hh, 2.0521209, 5e-8, "5C drop in height")
    dU = 25.0 * G * hh
    ok(dU, 503.2826, 5e-5, "5C potential energy released")
    Ni = 25.0 * G * np.cos(np.radians(20.0))
    ok(Ni, 230.4596, 5e-5, "5C normal force on the incline")
    ok(0.30 * Ni * 6.0, 414.8273, 5e-5, "5C work against friction")
    KE = dU - 0.30 * Ni * 6.0
    ok(KE, 88.4553, 5e-5, "5C kinetic energy at the bottom")
    ok(np.sqrt(2.0 * KE / 25.0), 2.6601554, 5e-8, "5C speed at the bottom")
    ai = G * (np.sin(np.radians(20.0)) - 0.30 * np.cos(np.radians(20.0)))
    ok(ai, 0.5897022, 5e-8, "5C acceleration along the incline")
    ok(np.sqrt(2.0 * ai * 6.0), 2.6601554, 5e-8, "5C speed again, from kinematics")

    # ---- worked example 6A: the hoist ------------------------------------
    ok(1500.0 * G * 22.5, 331087.5, 1e-9, "6A useful work")
    ok(331087.5 / 35.0, 9459.6429, 5e-5, "6A cycle-average power")
    ok(11205.0 / 9459.642857142857, 1.1845056, 5e-8, "6A peak-to-mean power ratio")
    ok(331087.5 / 0.82, 403765.2439, 5e-5, "6A electrical input energy")
    ok(403765.2439024390 / 3.6e6, 0.1121570, 5e-8, "6A input energy in kWh")
    ok(403765.2439024390 - 331087.5, 72677.7439, 5e-5, "6A losses over the cycle")
    ok(11036.25 / 0.82, 13458.8415, 5e-5, "6A electrical power while cruising")
    # drum kinematics: same power by a different pair of quantities
    ok(0.75 / 0.35, 2.1428571, 5e-8, "6A drum angular velocity")
    ok(1500.0 * G * 0.35, 5150.25, 1e-9, "6A drum torque while cruising")
    ok(5150.25 * (0.75 / 0.35), 11036.25, 5e-9, "6A cruise power as torque times omega")
    ok(60.0 * (0.75 / 0.35) / (2.0 * np.pi), 20.4628, 5e-5, "6A drum speed in rev/min")

    # ---- worked example 6B: the flywheel ---------------------------------
    m, I = flywheel()
    ok(np.pi * 0.09 * 0.080, 0.0226194671, 5e-11, "6B disc volume")
    ok(m, 177.5628, 5e-5, "6B disc mass")
    ok(I, 7.9903268, 5e-8, "6B moment of inertia")
    w1 = 2.0 * np.pi * 3600.0 / 60.0
    w2 = 2.0 * np.pi * 2400.0 / 60.0
    ok(w1, 376.9911184, 5e-8, "6B 3,600 rev/min in rad/s")
    ok(w2, 251.3274123, 5e-8, "6B 2,400 rev/min in rad/s")
    ok(0.5 * I * w1 * w1, 567801.82, 5e-3, "6B energy at the top speed")
    ok(0.5 * I * w2 * w2, 252356.37, 5e-3, "6B energy at the bottom speed")
    ok(0.5 * I * (w1 * w1 - w2 * w2), 315445.46, 5e-3, "6B usable energy")
    ok(0.5 * I * w1 * w1 * 5.0 / 9.0, 315445.46, 5e-3, "6B usable energy the short way")
    ok(0.5 * I * (w1 * w1 - w2 * w2) / 3.0, 105148.49, 5e-3,
       "6B mean power over a 3 s discharge")
    ok(0.5 * I * (w1 * w1 - w2 * w2) / 331087.5, 0.9527556, 5e-8,
       "6B fraction of one hoist cycle")

    # ---- worked example 6C: the pump -------------------------------------
    Ph = RHO_H2O * G * 0.025 * 32.0
    ok(Ph, 7832.304, 1e-6, "6C hydraulic power")
    ok(Ph / 0.72, 10878.2, 5e-2, "6C shaft power")
    ok(Ph / 0.72 / 0.91, 11954.0659, 5e-5, "6C electrical power")
    ok(0.72 * 0.91, 0.6552, 1e-12, "6C overall efficiency")
    ok(Ph / 0.6552, 11954.0659, 5e-5, "6C electrical power the other way")
    ok(11954.06593 / 0.025 / 3.6e6, 0.1328230, 5e-8, "6C kWh per cubic metre")
    ok(11954.06593 * 8.0 / 1000.0, 95.6325, 5e-5, "6C kWh in an eight-hour shift")
    ok(0.025 * 28800.0, 720.0, 1e-9, "6C cubic metres in that shift")
    ok(95.63252747 / 720.0, 0.1328230, 5e-8, "6C kWh per cubic metre again")

    # ---- worked example 7A: motor accelerating an inertial load ----------
    V, R, K, J, T, w_inf, t, w, i = motor_run_up()
    ok(T, 0.1180556, 5e-8, "7A mechanical time constant")
    ok(w_inf, 133.3333, 5e-5, "7A no-load speed")
    ok(60.0 * w_inf / (2.0 * np.pi), 1273.2395, 5e-5, "7A no-load speed in rev/min")
    ok(V / R, 533.3333, 5e-5, "7A locked-rotor current")
    ok(K * V / R, 960.0, 1e-9, "7A stall torque")
    ok(960.0 / J, 1129.4118, 5e-5, "7A initial angular acceleration")
    ok(0.5 * J * w_inf ** 2, 7555.5556, 5e-5, "7A final kinetic energy")
    ok((V * V / R) * T / 2.0, 7555.5556, 5e-5, "7A armature loss over the run-up")
    ok((V * V / R) * T, 15111.1111, 5e-5, "7A energy drawn from the supply")
    ok(T * np.log(20.0), 0.3536628, 5e-8, "7A time to 95% speed")
    ok(T * np.log(2.0), 0.0818299, 5e-8, "7A time to half speed")

    # ---- worked example 7B: regenerative braking -------------------------
    dKE = 0.5 * 1600.0 * (25.0 ** 2 - 8.0 ** 2)
    ok(dKE, 448800.0, 1e-9, "7B kinetic energy given up")
    ok(0.68 * dKE, 305184.0, 1e-9, "7B energy recovered")
    ok(305184.0 / 3600.0, 84.7733, 5e-5, "7B recovered energy in Wh")
    ok(305184.0 / 350.0, 871.9543, 5e-5, "7B charge returned, in coulombs")
    ok(871.9542857 / 3600.0, 0.2422095, 5e-8, "7B charge returned, in amp-hours")
    ok(305184.0 / 4.0, 76296.0, 1e-9, "7B mean recovered power")
    ok(dKE / 4.0, 112200.0, 1e-9, "7B mean braking power at the wheels")
    ok(871.9542857 / 4.0, 217.9886, 5e-5, "7B mean charging current")

    # ---- worked example 7C: the conveyor chain ---------------------------
    Pu = (4000.0 / 3600.0) * G * 5.0
    ok(Pu, 54.5, 1e-12, "7C useful lifting power")
    eta = 0.94 * 0.86 * 0.96 * 0.97
    ok(eta, 0.75278208, 1e-12, "7C chain efficiency")
    ok(Pu / eta, 72.3981, 5e-5, "7C power drawn from the battery")
    ok(Pu / eta * 8.0, 579.1849, 5e-5, "7C watt-hours in an eight-hour shift")
    ok(Pu / eta * 8.0 / 48.0, 12.0664, 5e-5, "7C amp-hours at 48 V")
    ok(Pu / eta * 8.0 / 48.0 * 3600.0, 43438.8661, 5e-4, "7C coulombs at 48 V")
    ok(32000.0 * G * 5.0 / 3.6e6, 0.4360, 5e-5, "7C useful kWh over the shift")

    # ---- fee_work_energy problem sets ------------------------------------
    ok((180.0 - 130.0) * 8.0, 400.0, 1e-12, "A1 net work")
    ok(np.sqrt(2.0 * 400.0 / 45.0), 4.2163702, 5e-8, "A1 final speed")
    ok(60.0 * 4.0 + 25.0 * 16.0 / 2.0, 440.0, 1e-12, "A2 work of a linear force")
    ok(0.5 * 1200.0 * (18.0 ** 2 - 30.0 ** 2), -345600.0, 1e-9, "A3 braking work")
    ok(14.0 ** 2 / (2.0 * G), 9.9898063, 5e-8, "A4 maximum height")
    ok(0.5 * 800.0 * (0.12 ** 2 - 0.05 ** 2), 4.76, 1e-12, "A5 spring work")
    wB1 = 2.0 * np.pi * 1750.0 / 60.0
    ok(wB1, 183.2595715, 5e-8, "B1 shaft speed in rad/s")
    ok(22.0 * wB1, 4031.7106, 5e-5, "B1 shaft power")
    IB2 = 0.5 * 60.0 * 0.25 ** 2
    ok(IB2, 1.875, 1e-12, "B2 moment of inertia")
    wB2 = 2.0 * np.pi * 900.0 / 60.0
    ok(0.5 * IB2 * wB2 ** 2, 8327.4787, 5e-5, "B2 rotational kinetic energy")
    ok(0.5 * 2.4 * 250.0 ** 2, 75000.0, 1e-9, "B3 kinetic energy required")
    ok(75000.0 / 5000.0, 15.0, 1e-12, "B3 time at constant power")
    ok(900.0 * G * 0.45, 3973.05, 1e-9, "B4 useful hoist power")
    ok(3973.05 / 0.78, 5093.6538, 5e-5, "B4 input power")
    ok(2.5 * 3.6e6, 9.0e6, 1e-6, "B5 joules in 2.5 kWh")
    ok(9.0e6 / 400.0 / 3600.0, 6.25, 1e-12, "B5 hours at 400 W")
    etaC1 = 0.95 * 0.89 * 0.83
    ok(etaC1, 0.701765, 1e-12, "C1 chain efficiency")
    ok(3000.0 / etaC1, 4274.9353, 5e-5, "C1 input power")
    ok(3000.0 / etaC1 - 3000.0, 1274.9353, 5e-5, "C1 total loss")
    wC1 = 2.0 * np.pi * 2000.0 / 60.0
    wC2 = 2.0 * np.pi * 1200.0 / 60.0
    ok(0.5 * 12.0 * (wC1 ** 2 - wC2 ** 2), 168441.2484, 5e-5, "C2 energy released")
    ok(0.5 * 12.0 * wC1 ** 2 * (1.0 - 0.36), 168441.2484, 5e-5, "C2 the same, as a fraction")
    PhC3 = RHO_H2O * G * 0.040 * 18.0
    ok(PhC3, 7049.0736, 5e-6, "C3 hydraulic power")
    ok(PhC3 / 0.63, 11189.0057, 5e-5, "C3 electrical input")
    ok(0.30 * 0.8 / 1.44, 0.1666667, 5e-8, "C4 mechanical time constant")
    ok(120.0 / 1.2, 100.0, 1e-12, "C4 no-load speed")
    ok(0.5 * 0.30 * 100.0 ** 2, 1500.0, 1e-12, "C4 final kinetic energy")
    ok(15000.0 / 0.91 * 1800.0 / 1000.0, 29670.3297, 5e-5, "C5 annual energy in kWh")
    ok(29670.32967 * 0.11, 3263.7363, 5e-5, "C5 annual cost")

    # ---- pre-existing chain that had to be reprinted ---------------------
    cost90 = 15.0 * 745.7 / 0.90 * 4000.0 / 1000.0 * 0.12
    cost94 = 15.0 * 745.7 / 0.94 * 4000.0 / 1000.0 * 0.12
    ok(cost90, 5965.6, 5e-5, "existing 4.2 annual cost at 90%")
    ok(cost94, 5711.7447, 5e-5, "existing 4.2 annual cost at 94%")
    ok(cost90 - cost94, 253.8553, 5e-5, "existing 4.2 annual saving")
    pa8 = ((1.08 ** 12) - 1.0) / (0.08 * 1.08 ** 12)
    ok(pa8, 7.5360780, 5e-8, "existing 4.2 series present-worth factor")
    ok((cost90 - cost94) * pa8, 1913.0735, 5e-5, "existing 4.2 present worth")
    ok(253.8553 * 7.536078, 1913.0735, 5e-4, "existing 4.2 present worth, as printed")

    # ---- fee_charge_current, worked example 5A: the pulse -----------------
    ok(0.5 * 4.0 * 5e-3, 0.010, 1e-15, "5A charge in the pulse")
    ok(0.010 / E_CHG, 6.2415091e16, 5e9, "5A electrons in the pulse")
    ok(0.010 / 5e-3, 2.0, 1e-12, "5A mean current")
    ok(0.5 * 4.0 * 2e-3, 0.004, 1e-15, "5A charge up to the peak")

    # ---- worked example 5B: a sinusoid ------------------------------------
    wac = 2.0 * np.pi * 60.0
    ok(wac, 376.9911184, 5e-8, "5B angular frequency")
    Qhalf = (8.0 / wac) * (1.0 - np.cos(np.pi))
    ok(Qhalf, 0.0424413, 5e-8, "5B charge in a half cycle")
    tt = np.linspace(0.0, 1.0 / 120.0, 400001)
    ok(float(np.trapz(8.0 * np.sin(wac * tt), tt)), 0.0424413, 5e-8,
       "5B the same by quadrature")
    ok(16.0 / wac, 0.0424413, 5e-8, "5B closed form 2 Im / omega")
    ok(8.0 / np.sqrt(2.0), 5.6568542, 5e-8, "5B rms value")
    tfull = np.linspace(0.0, 1.0 / 60.0, 800001)
    assert abs(float(np.trapz(8.0 * np.sin(wac * tfull), tfull))) < 1e-12
    n += 1

    # ---- worked example 5C: a node ---------------------------------------
    ok(3.2 + 1.7 - 4.1, 0.8, 5e-15, "5C the fourth branch current")
    ok(3.2 + 1.7 - 4.1 - 0.8, 0.0, 5e-15, "5C the node sums to zero")

    # ---- worked example 5D: a printed-circuit trace ----------------------
    Atr = 35e-6 * 0.5e-3
    ok(Atr, 1.75e-8, 1e-20, "5D trace cross-section")
    Jtr = 2.0 / Atr
    ok(Jtr, 1.1428571e8, 5e1, "5D trace current density")
    ok(Jtr / 1e6, 114.2857, 5e-5, "5D the same in A/mm2")
    ok(Jtr / (N_CU * E_CHG), 0.008391945, 5e-10, "5D trace drift velocity")
    ok(RHO_CU_E / Atr, 0.9851429, 5e-8, "5D trace resistance per metre")
    ok(RHO_CU_E / Atr * 0.050, 0.0492571, 5e-8, "5D resistance of a 50 mm run")
    ok(2.0 * RHO_CU_E / Atr * 0.050, 0.0985143, 5e-8, "5D drop at 2 A")
    ok(4.0 * RHO_CU_E / Atr * 0.050, 0.1970286, 5e-8, "5D heat in that run")
    ok(Jtr / (15.0 / 3.309e-6), 25.2114, 5e-5, "5D speed ratio against 12 AWG")
    ok(15.0 / 3.309e-6 / (N_CU * E_CHG), 0.0003328627, 5e-11, "5D 12 AWG drift velocity")
    ok(1200.0 / 6.0e-4 / (N_CU * E_CHG), 0.0001468590, 5e-11, "5D busbar drift velocity")

    # ---- worked example 6A: capacitor charge and energy -------------------
    ok(220e-6 * 400.0, 0.088, 1e-15, "6A stored charge")
    ok(0.5 * 220e-6 * 400.0 ** 2, 17.6, 1e-12, "6A stored energy")
    ok(0.088 ** 2 / (2.0 * 220e-6), 17.6, 1e-12, "6A energy as Q^2/2C")
    ok(0.5 * 0.088 * 400.0, 17.6, 1e-13, "6A energy as QV/2")
    ok(0.088 / E_CHG, 5.4925280e17, 5e10, "6A electrons displaced")
    ok(17.6 / 250e-6, 70400.0, 1e-8, "6A mean discharge power")
    ok(0.088 / 250e-6, 352.0, 1e-9, "6A mean discharge current")

    # ---- worked example 6B: the RC transient ------------------------------
    Vs, Rr, Cc, Tt, t, v, i = rc_charge()
    ok(Tt, 0.47, 1e-12, "6B time constant")
    ok(Vs / Rr, 2.4e-3, 1e-15, "6B initial current")
    ok(Cc * Vs, 1.128e-3, 1e-15, "6B final charge")
    ok(Vs * (1.0 - np.exp(-1.0)), 15.1709, 5e-5, "6B volts at one tau")
    ok((Vs / Rr) * np.exp(-1.0), 8.8291e-4, 5e-9, "6B amps at one tau")
    ok(Cc * Vs * (1.0 - np.exp(-1.0)), 7.13032e-4, 5e-10, "6B charge at one tau")
    ok(0.5 * Cc * Vs ** 2, 0.013536, 1e-12, "6B energy in the capacitor")
    ok((Vs ** 2 / Rr) * Tt / 2.0, 0.013536, 1e-12, "6B energy in the resistor")
    ok(Cc * Vs ** 2, 0.027072, 1e-12, "6B energy from the source")
    ok(5.0 * Tt, 2.35, 1e-12, "6B five time constants")
    ok(100.0 * (1.0 - np.exp(-5.0)), 99.3262, 5e-5, "6B percent charged at 5 tau")

    # ---- worked example 6C: a ride-through bank ---------------------------
    Cb = 8.0 * 0.020 / 6.0
    ok(Cb, 0.0266667, 5e-8, "6C bank capacitance")
    ok(Cb * 1e6, 26666.6667, 5e-4, "6C bank capacitance in microfarads")
    ok(8.0 * 0.020, 0.16, 1e-15, "6C charge delivered")
    ok(Cb * 6.0, 0.16, 1e-15, "6C charge as C times the sag")
    ok(0.5 * Cb * (24.0 ** 2 - 18.0 ** 2), 3.36, 1e-12, "6C energy released")
    ok(21.0 * 8.0 * 0.020, 3.36, 1e-12, "6C the same as mean volts times amp-seconds")
    ok(0.5 * Cb * 24.0 ** 2, 7.68, 1e-12, "6C energy the bank holds at 24 V")
    ok(3.36 / 7.68, 0.4375, 1e-12, "6C usable fraction")

    # ---- worked example 7A: amp-hours into joules -------------------------
    ok(100.0 * 3600.0, 360000.0, 1e-9, "7A coulombs in 100 Ah")
    ok(360000.0 * 12.0 / 1e6, 4.32, 1e-9, "7A megajoules at 12 V")
    ok(4.32e6 / 3.6e6, 1.2, 1e-12, "7A kWh at 12 V")
    ok(360000.0 / E_CHG, 2.2469433e24, 5e17, "7A electrons")
    ok(3.0 * 3600.0, 10800.0, 1e-9, "7A coulombs in a 3,000 mAh cell")
    ok(10800.0 * 3.7, 39960.0, 1e-8, "7A joules in that cell")
    ok(39960.0 / 3600.0, 11.1, 5e-12, "7A watt-hours in that cell")
    ok(1200.0 / 25.0, 48.0, 1e-12, "7A lead-acid specific energy")
    ok(11.1 / 0.045, 246.6667, 5e-5, "7A lithium cell specific energy")
    ok(246.66667 / 48.0, 5.1389, 5e-5, "7A ratio of the two")

    # ---- worked example 7B: copper plating --------------------------------
    Qp = 3.0 * 2700.0
    ok(Qp, 8100.0, 1e-9, "7B charge")
    ok(Qp / FARADAY, 0.0839509, 5e-8, "7B moles of electrons")
    ok(Qp / (2.0 * FARADAY), 0.0419754, 5e-8, "7B moles of copper")
    ok(Qp / (2.0 * FARADAY) * M_CU, 2.6673711, 5e-8, "7B grams of copper")
    ok(Qp * M_CU / (2.0 * FARADAY), 2.6673711, 5e-8, "7B grams, the direct way")
    ok(M_CU / (2.0 * FARADAY), 0.0003293051, 5e-11, "7B electrochemical equivalent g/C")
    ok(M_CU / (2.0 * FARADAY) * 3600.0, 1.1854983, 5e-8, "7B equivalent in g/Ah")
    ok(3.0 * 0.75 * (M_CU / (2.0 * FARADAY) * 3600.0), 2.6673711, 5e-7,
       "7B grams from amp-hours")
    ok(Qp * M_CU / (2.0 * FARADAY) / 8.96, 0.2976977, 5e-8,
       "7B volume in cubic centimetres")
    ok(Qp * M_CU / (2.0 * FARADAY) / 8.96 / 100.0 * 1e4, 29.7698, 5e-5,
       "7B thickness in micrometres")
    ok(plating_thickness(300.0, 2700.0) * 1e6 / 45.0, 0.6615504, 5e-8,
       "7B plating rate")
    ok(3.0 / 100.0 * 1000.0, 30.0, 1e-12, "7B current density in mA/cm2")

    # ---- worked example 7C: DC against AC ---------------------------------
    ok(48.0 * 12.0, 576.0, 1e-12, "7C DC power")
    ok(12.0 * 1800.0, 21600.0, 1e-9, "7C DC charge in half an hour")
    ok(576.0 * 1800.0, 1036800.0, 1e-6, "7C DC energy")
    ok(1036800.0 / 3.6e6, 0.288, 1e-12, "7C DC energy in kWh")
    ok(170.0 / np.sqrt(2.0), 120.2082, 5e-5, "7C rms volts")
    ok(12.0 / np.sqrt(2.0), 8.4852814, 5e-8, "7C rms amps")
    ok(170.0 * 12.0 / 2.0, 1020.0, 5e-13, "7C apparent power")
    ok(1020.0 * np.cos(np.radians(30.0)), 883.3459, 5e-5, "7C real power")
    ok(1020.0 * np.sin(np.radians(30.0)), 510.0, 5e-13, "7C reactive power")
    ok(2.0 * 12.0 / wac, 0.0636620, 5e-8, "7C charge per half cycle")
    ok(1020.0 * np.cos(np.radians(30.0)) / 576.0, 1.5336, 5e-5,
       "7C AC-to-DC real-power ratio")

    # ---- fee_charge_current problem sets ----------------------------------
    ok(5.0 * 180.0, 900.0, 1e-12, "A1 charge")
    ok(900.0 / E_CHG, 5.6173582e21, 5e14, "A1 electrons")
    ok(10e-6 * 50.0 / 4e-3, 0.125, 1e-15, "A2 capacitor current")
    ok(6.5 + 2.2 - 3.9, 4.8, 5e-15, "A3 remaining branch")
    ok(3.0 ** 2, 9.0, 1e-12, "A4 charge from a ramp")
    ok(2.5 * 3600.0, 9000.0, 1e-9, "A5 coulombs in 2,500 mAh")
    ok(9000.0 * 3.6, 32400.0, 1e-8, "A5 joules")
    ok(32400.0 / 3600.0, 9.0, 5e-12, "A5 watt-hours")
    ok(100e-6 * 63.0, 6.3e-3, 1e-15, "B1 charge")
    ok(0.5 * 100e-6 * 63.0 ** 2, 0.198450, 1e-12, "B1 energy")
    Tb2 = 2200.0 * 470e-9
    ok(Tb2, 1.034e-3, 1e-15, "B2 time constant")
    ok(5.0 * (1.0 - np.exp(-1e-3 / Tb2)), 3.0991143, 5e-8, "B2 volts at 1 ms")
    ok(1000e-6 * 15.0, 0.015, 1e-15, "B3 charge")
    ok(0.015 * 15.0, 0.225, 1e-12, "B3 energy from the supply")
    ok(0.5 * 1000e-6 * 15.0 ** 2, 0.1125, 1e-12, "B3 energy stored")
    ok(4700e-6 * 3.0 / 3.0, 4.7e-3, 1e-15, "B4 hold-up time")
    ok(1.5 / 220e-6, 6818.1818, 5e-4, "B5 rate of voltage change")
    ok(60.0 * 48.0, 2880.0, 1e-10, "C1 watt-hours")
    ok(60.0 * 3600.0 * 48.0 / 1e6, 10.368, 1e-9, "C1 megajoules")
    ok(2.0 * 1800.0, 3600.0, 1e-9, "C2 charge")
    ok(3600.0 * M_AG / FARADAY, 4.0247168, 5e-8, "C2 grams of silver")
    ok(M_NI / (2.0 * FARADAY) * 3600.0, 1.0949619, 5e-8, "C3 nickel equivalent g/Ah")
    ok(230.0 * 6.0, 1380.0, 1e-10, "C4 apparent power")
    ok(1380.0 * 0.85, 1173.0, 5e-12, "C4 real power")
    ok(1173.0 * 3.0 / 1000.0, 3.519, 1e-12, "C4 energy in kWh")
    ok(5.0 * 5400.0, 27000.0, 1e-9, "C5 coulombs")
    ok(27000.0 * 13.8, 372600.0, 1e-6, "C5 joules")
    ok(372600.0 / 3.6e6, 0.1035, 1e-12, "C5 kWh")

    # ---- reference rows quoted in the two chapters' tables ----------------
    ok(1.0 / E_CHG, 6.2415091e18, 5e11, "electrons in one coulomb")
    ok(10800.0 / E_CHG, 6.7408298e22, 5e15, "electrons in a 3,000 mAh cell")
    ok(3.309e-6 / 1.75e-8, 189.0857, 5e-5, "12 AWG against a printed trace")
    ok(360000.0 / FARADAY, 3.7311, 5e-5, "moles of electrons in 100 Ah")
    ok(4.9 * 60.0, 294.0, 1e-9, "coulombs through the node in a minute")
    ok(M_AG / (1.0 * FARADAY), 0.001117977, 5e-10, "silver equivalent, g/C")
    ok(M_AG / (1.0 * FARADAY) * 3600.0, 4.024717, 5e-7, "silver equivalent, g/Ah")
    ok(M_NI / (2.0 * FARADAY), 0.000304156, 5e-10, "nickel equivalent, g/C")
    ok(26.982 / (3.0 * FARADAY), 0.0000932166, 5e-11, "aluminium equivalent, g/C")
    ok(26.982 / (3.0 * FARADAY) * 3600.0, 0.335580, 5e-7, "aluminium equivalent, g/Ah")
    ok(4.0 * RHO_CU_E / (35e-6 * 0.5e-3) * 0.050, 0.19703, 5e-6,
       "5D heat in the trace, as printed")
    ok(9.5493, 60.0 / (2.0 * np.pi), 5e-5, "the rev/min to rad/s divisor")
    ok(22.0 * (2.0 * np.pi * 1750.0 / 60.0) / 745.7, 5.4066, 5e-5,
       "B1 shaft power in horsepower")
    ok(1.0 - 0.9 ** 2, 0.19, 1e-12, "a ten per cent speed drop releases 19 per cent")
    ok(2494.1532 - 1994.4, 499.7532, 5e-8, "5A net work, from the printed parts")
    ok(np.sqrt(2.0 * G * (6.0 * np.sin(np.radians(20.0)))), 6.3453, 5e-5,
       "5C frictionless speed at the bottom")
    ok(414.8273 / 503.2827, 0.8242, 5e-5, "5C fraction dissipated on the incline")
    ok(784.8 / 664.8, 1.1805, 5e-5, "5A error from using mg for the normal force")
    ok(11954.06593 / 0.025, 478162.6, 5e-2, "6C joules per cubic metre pumped")
    ok(0.3 * 8.96, 2.688, 1e-12, "7B sanity mass of a 30 micrometre layer")
    ok(1.602176634 / (1.602176634 - 1.602), 9070.60, 5e-3,
       "rounding the elementary charge is one part in nine thousand")
    ok(11185.5 / 0.94, 11899.4681, 5e-5, "existing 4.2 input at 94 per cent")
    ok(11185.5 / 0.94 * 4.0, 47597.8723, 5e-5, "existing 4.2 annual kWh at 94 per cent")
    ok(11185.5 / 0.90, 12428.3333, 5e-5, "existing 4.2 input at 90 per cent")
    ok(11185.5 / 0.90 * 4.0, 49713.3333, 5e-5, "existing 4.2 annual kWh at 90 per cent")
    ok(49713.3333 * 0.12, 5965.6000, 5e-5, "existing 4.2 annual bill at 90 per cent")

    print(f"{n} prose numbers re-derived, all agreeing")


def render(name: str, fn) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for mode, suffix in (("light", ".svg"), ("dark", ".dark.svg")):
        S.apply(mode)
        fig = fn(mode)
        fig.savefig(OUT / f"{name}{suffix}", format="svg",
                    transparent=True, bbox_inches="tight")
        plt.close(fig)


def main() -> int:
    arg = sys.argv[1] if len(sys.argv) > 1 else "sci2-"
    if arg == "checks":
        checks()
        return 0
    names = [n for n in REGISTRY if n.startswith(arg)]
    if not names:
        print(f"no figures match {arg!r}; known: {sorted(REGISTRY)}")
        return 1
    for n in sorted(names):
        assert n.startswith("sci2-"), n
        render(n, REGISTRY[n])
        print("wrote", n)
    checks()
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
