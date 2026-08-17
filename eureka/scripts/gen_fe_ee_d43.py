#!/usr/bin/env python3
"""Depth-wave-43 figures for the FE Electrical and Computer course.

Scope: the capstone exam-strategy chapter (topic `fee_reference_handbook`,
figure prefix `ex2-`). The chapter teaches the skill of working from a supplied
formula reference under time pressure, so every figure here has to do the one
thing that skill is about: show a number arrived at twice, by routes that do not
share a mistake.

NOTHING IN THIS FILE COMES FROM THE NCEES FE REFERENCE HANDBOOK. No table, no
equation list, no page ordering and no wording of that book is read, traced,
transcribed or paraphrased anywhere in this pipeline. The physics drawn below is
computed here from relations the lesson itself writes out, which is why a reader
can rerun the script and get the same picture back. Relations are not protected
expression; a particular book's presentation of them is, and this generator
never touches one.

VERIFICATION IS THE POINT OF THIS FILE. Every quantity the lesson prints is
recomputed here by a second, structurally different route and asserted equal:

  * the unbalanced-wye neutral current is computed as a complex phasor sum AND
    from a closed-form power identity that never forms a phasor;
  * every RMS value is computed by numerical quadrature over one period AND
    from the closed form the lesson states;
  * the second-order overshoot is computed from the sampled step response's
    actual peak AND from both notational forms of the overshoot relation;
  * the RC crossing time is located by bisection on the sampled response AND
    from the logarithm the lesson derives;
  * the loaded-divider voltage is computed by parallel-combination, by Thevenin
    equivalent and by a nodal balance;
  * the inverting-amplifier gain is computed from the resistor ratio AND from a
    current balance at the summing node;
  * the look-up break-even time is computed in seconds AND in questions.

`python3 eureka/scripts/gen_fe_ee_d43.py --verify` runs that battery alone and
prints the counts. Each figure repeats the claims it draws as `assert`s at tight
tolerances, so a wrong claim halts the script instead of shipping.

Every registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

Usage:
    python3 eureka/scripts/gen_fe_ee_d43.py                 # verify, then all
    python3 eureka/scripts/gen_fe_ee_d43.py --verify        # numerics only
    python3 eureka/scripts/gen_fe_ee_d43.py ex2-prefix-rc   # one figure
"""
from __future__ import annotations

import math
import pathlib
import sys

import numpy as np

# numpy renamed trapz -> trapezoid; support both so the script runs on either.
_TRAPZ = getattr(np, "trapezoid", None) or np.trapz

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

REGISTRY: dict[str, object] = {}
PREFIX = "ex2-"

# Counters printed by --verify. Only the helpers below increment them, so the
# reported totals cannot drift away from the checks actually performed.
COUNTS = {"two_route": 0, "quadrature": 0, "root": 0}


def figure(name):
    if not name.startswith(PREFIX):
        raise ValueError(f"this generator owns only {PREFIX!r} figures, not {name!r}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# verification helpers
# ---------------------------------------------------------------------------
def agree(label, first, second, tol=1e-9):
    """One claim, reached by two independent routes, asserted equal."""
    gap = float(np.max(np.abs(np.asarray(first, float) - np.asarray(second, float))))
    assert gap < tol, f"{label}: route A {first!r} vs route B {second!r} (gap {gap:g})"
    COUNTS["two_route"] += 1
    return first


def quad_rms(label, sampled, closed_form, tol=1e-6):
    """An RMS value, by quadrature over one period against its closed form."""
    numeric = float(np.sqrt(_TRAPZ(sampled ** 2, dx=1.0) / (sampled.size - 1)))
    assert abs(numeric - closed_form) < tol, (
        f"{label}: quadrature {numeric!r} vs closed form {closed_form!r}"
    )
    COUNTS["quadrature"] += 1
    return numeric


def bisect(label, fn, lo, hi, closed_form, tol=1e-10):
    """A crossing time, located by bisection against its closed form."""
    flo, fhi = fn(lo), fn(hi)
    assert flo * fhi < 0, f"{label}: no sign change on [{lo}, {hi}]"
    for _ in range(200):
        mid = 0.5 * (lo + hi)
        if fn(lo) * fn(mid) <= 0:
            hi = mid
        else:
            lo = mid
    root = 0.5 * (lo + hi)
    assert abs(root - closed_form) < tol, (
        f"{label}: bisection {root!r} vs closed form {closed_form!r}"
    )
    COUNTS["root"] += 1
    return root


# ---------------------------------------------------------------------------
# the physics the lesson states, written once and reused
# ---------------------------------------------------------------------------
V_LL = 208.0                      # line-to-line volts, four-wire wye source
V_PH = V_LL / math.sqrt(3.0)      # line-to-neutral volts
LOADS = (3000.0, 5000.0, 4000.0)  # watts, unity power factor, one per phase


def neutral_phasor(powers, vph=V_PH):
    """Neutral current magnitude as the phasor sum of three line currents."""
    angles = (0.0, -120.0, 120.0)
    total = sum((p / vph) * np.exp(1j * math.radians(a))
                for p, a in zip(powers, angles))
    return abs(total)


def neutral_identity(powers, vph=V_PH):
    """The same magnitude from a power identity that forms no phasor at all.

    For three unity-power-factor loads on a balanced wye source the neutral
    magnitude reduces to sqrt(sum P^2 - sum of pairwise products) / V_phase,
    which is a purely real computation.
    """
    pa, pb, pc = powers
    inner = pa * pa + pb * pb + pc * pc - (pa * pb + pb * pc + pc * pa)
    return math.sqrt(max(inner, 0.0)) / vph


def trapezoid_wave(shape, n=200001):
    """One period of a unit-amplitude trapezoid.

    `shape` is the fraction of a quarter period spent ramping: 1 gives a
    triangle, 0 gives a square, intermediate values give the trapezoids in
    between. Returned as samples over exactly one period.
    """
    t = np.linspace(0.0, 1.0, n)
    if shape <= 0.0:
        return np.where(t < 0.5, 1.0, -1.0)
    ramp = 0.25 * shape
    x = np.empty_like(t)
    for k, tk in enumerate(t):
        u = tk % 1.0
        if u < 0.25 - ramp:
            x[k] = 1.0
        elif u < 0.25 + ramp:
            x[k] = 1.0 - (u - (0.25 - ramp)) / ramp
        elif u < 0.75 - ramp:
            x[k] = -1.0
        elif u < 0.75 + ramp:
            x[k] = -1.0 + (u - (0.75 - ramp)) / ramp
        else:
            x[k] = 1.0
    return x


def trapezoid_rms_closed(shape):
    """Closed-form RMS of the trapezoid above, unit amplitude.

    Over a quarter period a fraction `shape` ramps linearly to zero and the
    remainder sits flat, so the mean square is (1 - shape) + shape/3.
    """
    return math.sqrt(1.0 - shape + shape / 3.0)


R_SER, L_SER, C_SER = 20.0, 10e-3, 25e-6       # series RLC, section 8
ALPHA = R_SER / (2.0 * L_SER)
OMEGA0 = 1.0 / math.sqrt(L_SER * C_SER)
ZETA = ALPHA / OMEGA0
OMEGA_D = math.sqrt(OMEGA0 ** 2 - ALPHA ** 2)

R_RC, C_RC, V_RC, V_TARGET = 22e3, 4.7e-6, 15.0, 10.0
TAU = R_RC * C_RC

VS, R_TOP, R_BOT = 24.0, 6.0, 3.0              # kilohms, section 10
R_LOAD = 6.0

RF, RIN, RSRC, VIN = 100e3, 10e3, 5e3, 0.3     # section 11

BUDGET = 19200.0 / 110.0                       # seconds per question


def step_response(t):
    """Underdamped step response of the series RLC capacitor voltage."""
    return 1.0 - np.exp(-ALPHA * t) * (
        np.cos(OMEGA_D * t) + (ALPHA / OMEGA_D) * np.sin(OMEGA_D * t)
    )


def divider_parallel(rl):
    rp = R_BOT * rl / (R_BOT + rl)
    return VS * rp / (R_TOP + rp)


def divider_thevenin(rl):
    vth = VS * R_BOT / (R_TOP + R_BOT)
    rth = R_TOP * R_BOT / (R_TOP + R_BOT)
    return vth * rl / (rl + rth)


def divider_nodal(rl):
    """Solve (Vs - v)/R_top = v/R_bot + v/R_load for v, by linear algebra."""
    a = 1.0 / R_TOP + 1.0 / R_BOT + 1.0 / rl
    b = VS / R_TOP
    return b / a


def inverting_gain_ratio(rs):
    return -RF / (RIN + rs)


def inverting_gain_current(rs, vin=VIN):
    """Gain from a current balance at the summing node, not from the ratio."""
    i_in = vin / (RIN + rs)          # the inverting node sits at zero volts
    return (-i_in * RF) / vin


def breakeven_seconds(p_solve, hit, budget=BUDGET):
    return budget * (p_solve - 0.25) / hit


def breakeven_questions(p_solve, hit):
    """The same break-even expressed in question-budgets, then converted."""
    return (p_solve - 0.25) / hit


# ---------------------------------------------------------------------------
def verify() -> None:
    # --- unbalanced neutral current, two structurally different routes -----
    agree("neutral 3/5/4 kW", neutral_phasor(LOADS), neutral_identity(LOADS), tol=1e-9)
    assert abs(neutral_phasor(LOADS) - 14.4231) < 5e-4, neutral_phasor(LOADS)
    agree("neutral, balanced case", neutral_phasor((4000.0, 4000.0, 4000.0)),
          neutral_identity((4000.0, 4000.0, 4000.0)), tol=1e-9)
    assert neutral_phasor((4000.0, 4000.0, 4000.0)) < 1e-9
    for pc in (0.0, 1500.0, 4000.0, 6200.0, 8000.0):
        agree(f"neutral sweep P_c={pc}", neutral_phasor((3000.0, 5000.0, pc)),
              neutral_identity((3000.0, 5000.0, pc)), tol=1e-9)
    assert abs(V_PH - 120.0889) < 1e-4, V_PH
    assert abs(sum(LOADS) - 12000.0) < 1e-9

    # --- RMS of three wave shapes, quadrature against closed form ----------
    sine = np.sin(2.0 * math.pi * np.linspace(0.0, 1.0, 200001))
    quad_rms("sine", sine, 1.0 / math.sqrt(2.0), tol=1e-6)
    quad_rms("triangle", trapezoid_wave(1.0), 1.0 / math.sqrt(3.0), tol=1e-5)
    quad_rms("square", trapezoid_wave(0.0), 1.0, tol=1e-9)
    for shape in (0.2, 0.5, 0.8):
        quad_rms(f"trapezoid {shape}", trapezoid_wave(shape),
                 trapezoid_rms_closed(shape), tol=1e-4)
    p_true = (10.0 / math.sqrt(3.0)) ** 2 / 50.0
    p_assumed = (10.0 / math.sqrt(2.0)) ** 2 / 50.0
    agree("triangle power ratio", p_assumed / p_true, 1.5, tol=1e-9)
    assert abs(p_true - 2.0 / 3.0) < 1e-9 and abs(p_assumed - 1.0) < 1e-9

    # --- second order: peak from the response, and from both notations -----
    assert abs(ALPHA - 1000.0) < 1e-9 and abs(OMEGA0 - 2000.0) < 1e-9
    assert abs(ZETA - 0.5) < 1e-12
    agree("damped frequency", OMEGA_D, OMEGA0 * math.sqrt(1.0 - ZETA ** 2), tol=1e-9)
    os_zeta = math.exp(-math.pi * ZETA / math.sqrt(1.0 - ZETA ** 2))
    os_alpha = math.exp(-math.pi * ALPHA / OMEGA_D)
    agree("overshoot, two notations", os_zeta, os_alpha, tol=1e-12)
    t = np.linspace(0.0, 0.012, 600001)
    peak = float(step_response(t).max()) - 1.0
    agree("overshoot from sampled peak", peak, os_zeta, tol=2e-6)
    assert abs(os_zeta - 0.163034) < 1e-6, os_zeta
    t_peak = float(t[np.argmax(step_response(t))])
    agree("peak time", t_peak, math.pi / OMEGA_D, tol=2e-6)

    # --- RC crossing, bisection against the logarithm ----------------------
    t_cross = TAU * math.log(3.0)
    bisect("RC crossing", lambda x: V_RC * (1.0 - math.exp(-x / TAU)) - V_TARGET,
           0.0, 1.0, t_cross, tol=1e-9)
    assert abs(TAU - 0.1034) < 1e-9, TAU
    assert abs(t_cross - 0.11359651) < 1e-7, t_cross
    assert V_RC * (1.0 - math.exp(-1.0)) < V_TARGET < V_RC * (1.0 - math.exp(-1.1))

    # --- loaded divider, three routes --------------------------------------
    for rl in (0.5, 2.0, 6.0, 25.0, 400.0):
        agree(f"divider parallel/thevenin R_L={rl}", divider_parallel(rl),
              divider_thevenin(rl), tol=1e-12)
        agree(f"divider nodal R_L={rl}", divider_nodal(rl),
              divider_parallel(rl), tol=1e-12)
    agree("divider at 6 kohm", divider_parallel(R_LOAD), 6.0, tol=1e-12)
    agree("unloaded divider", divider_parallel(1e12), 8.0, tol=1e-6)

    # --- inverting amplifier, ratio against a current balance --------------
    for rs in (0.0, 1e3, 5e3, 20e3):
        agree(f"inverting gain R_s={rs}", inverting_gain_ratio(rs),
              inverting_gain_current(rs), tol=1e-12)
    agree("gain with 5 kohm source", inverting_gain_ratio(RSRC), -20.0 / 3.0, tol=1e-12)
    agree("output with 5 kohm source", inverting_gain_ratio(RSRC) * VIN, -2.0, tol=1e-12)
    agree("ideal-source gain", inverting_gain_ratio(0.0), -10.0, tol=1e-12)

    # --- look-up economics, seconds against question-budgets ---------------
    assert abs(BUDGET - 174.5454545) < 1e-6, BUDGET
    for ps, hit in ((0.90, 0.70), (0.90, 0.55), (0.75, 0.70), (0.60, 0.70)):
        agree(f"breakeven p={ps} h={hit}", breakeven_seconds(ps, hit),
              BUDGET * breakeven_questions(ps, hit), tol=1e-9)
    assert abs(breakeven_seconds(0.90, 0.70) - 162.08) < 5e-3
    assert abs(breakeven_seconds(0.60, 0.70) - 87.27) < 5e-3

    print(f"verified: {COUNTS['two_route']} two-route agreements, "
          f"{COUNTS['quadrature']} quadrature RMS checks, "
          f"{COUNTS['root']} bracketed root checks")


# ---------------------------------------------------------------------------
# figures
# ---------------------------------------------------------------------------
def _finish(fig):
    fig.tight_layout()
    return fig


@figure("ex2-neutral-unbalance")
def fig_neutral(mode):
    c = S.SERIES[mode]
    pc = np.linspace(0.0, 8000.0, 401)
    phasor = np.array([neutral_phasor((3000.0, 5000.0, p)) for p in pc])
    ident = np.array([neutral_identity((3000.0, 5000.0, p)) for p in pc])
    agree("neutral sweep, whole curve", phasor, ident, tol=1e-9)

    fig, ax = plt.subplots()
    ax.plot(pc / 1000.0, phasor, color=c[0], lw=2.1)
    ax.plot(pc / 1000.0, ident, color=c[1], lw=1.2, ls="--")
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.4, ls=":")
    S.label_end(ax, 8.0, phasor[-1], "phasor sum", c[0], mode, dx=-6, ha="right",
                dy=10)
    S.label_end(ax, 6.4, ident[np.argmin(abs(pc - 6400.0))], "power identity",
                c[1], mode, dx=-6, ha="right", dy=-14)
    S.note(ax, 0.15, 0.9, "balanced-case formula predicts zero", mode, size=9)

    star = neutral_phasor(LOADS)
    ax.plot([4.0], [star], "o", color=c[0], ms=7.5)
    S.note(ax, 4.25, star - 3.4, f"3 / 5 / 4 kW  →  {star:.2f} A", mode, size=9)
    ax.set_xlabel("phase-c load (kW), with phase a at 3 kW and phase b at 5 kW")
    ax.set_ylabel("neutral current magnitude (A)")
    ax.set_title("A balanced-system result, used outside its hypothesis")
    ax.set_ylim(-1.2, max(phasor) * 1.18)
    S.strip(ax)
    return _finish(fig)


@figure("ex2-waveshape-rms")
def fig_rms(mode):
    c = S.SERIES[mode]
    shapes = np.linspace(0.0, 1.0, 26)
    closed = np.array([trapezoid_rms_closed(s) for s in shapes])
    numeric = np.array([
        float(np.sqrt(_TRAPZ(trapezoid_wave(s, 40001) ** 2, dx=1.0) / 40000.0))
        for s in shapes
    ])
    agree("trapezoid family, quadrature vs closed form", numeric, closed, tol=3e-4)

    fig, ax = plt.subplots()
    ax.plot(shapes, closed, color=c[0], lw=2.1)
    ax.plot(shapes, numeric, color=c[1], lw=0.0, marker="o", ms=4.5)
    ax.axhline(1.0 / math.sqrt(2.0), color=S.GUIDE[mode], lw=1.4, ls="--")
    S.label_end(ax, 1.0, closed[-1], "closed form", c[0], mode, dx=-8, ha="right",
                dy=-13)
    S.label_end(ax, 0.42, numeric[11], "quadrature", c[1], mode, dx=-4, dy=-17,
                ha="center")
    S.note(ax, 0.02, 1.0 / math.sqrt(2.0) + 0.014,
           "0.7071, the sinusoid-only factor", mode, size=9)
    ax.plot([0.0, 1.0], [1.0, 1.0 / math.sqrt(3.0)], "o", color=c[0], ms=7)
    S.note(ax, 0.035, 0.995, "square  1.0000", mode, size=9)
    S.note(ax, 0.955, 1.0 / math.sqrt(3.0) + 0.042, "triangle  0.5774", mode,
           size=9, ha="right")
    ax.set_xlabel("ramp fraction of a quarter period  (0 = square, 1 = triangle)")
    ax.set_ylabel("RMS / peak")
    ax.set_title("The peak-to-RMS factor is a property of the wave shape")
    ax.set_ylim(0.52, 1.06)
    S.strip(ax)
    return _finish(fig)


@figure("ex2-notation-second-order")
def fig_second_order(mode):
    c = S.SERIES[mode]
    t = np.linspace(0.0, 0.010, 4001)
    y = step_response(t)
    tp = math.pi / OMEGA_D
    peak = 1.0 + math.exp(-math.pi * ZETA / math.sqrt(1.0 - ZETA ** 2))
    agree("figure peak", peak, 1.0 + math.exp(-math.pi * ALPHA / OMEGA_D), tol=1e-12)
    agree("figure peak vs samples", float(y.max()), peak, tol=2e-5)

    fig, ax = plt.subplots()
    ax.plot(t * 1000.0, y, color=c[0], lw=2.1)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.3, ls="--")
    ax.plot([tp * 1000.0], [peak], "o", color=c[1], ms=7.5)
    ax.annotate("", xy=(tp * 1000.0, peak), xytext=(tp * 1000.0, 1.0),
                arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.2))
    S.note(ax, tp * 1000.0 + 0.32, 1.045,
           "overshoot 16.30%\nfrom $\\zeta$ = 0.5 and from $\\alpha/\\omega_d$",
           mode, size=9)
    tail = t >= 0.0007
    env = 1.0 + np.exp(-ALPHA * t)
    ax.plot(t[tail] * 1000.0, env[tail], color=c[2], lw=1.2, ls=":")
    S.label_end(ax, 10.0, env[-1], "$e^{-\\alpha t}$ envelope", c[2], mode,
                dx=-6, ha="right", dy=12)
    S.note(ax, 0.2, 0.12,
           "$\\alpha$ = 1000 1/s   $\\omega_0$ = 2000 rad/s\n"
           "$\\zeta$ = 0.5   $\\omega_d$ = 1732 rad/s", mode, size=9)
    ax.set_xlabel("time (ms)")
    ax.set_ylabel("capacitor voltage / final value")
    ax.set_title("One response, two notations, one overshoot")
    ax.set_ylim(0.0, 1.32)
    S.strip(ax)
    return _finish(fig)


@figure("ex2-prefix-rc")
def fig_rc(mode):
    c = S.SERIES[mode]
    t = np.linspace(0.0, 0.45, 4501)
    v = V_RC * (1.0 - np.exp(-t / TAU))
    t_cross = bisect("figure RC crossing",
                     lambda x: V_RC * (1.0 - math.exp(-x / TAU)) - V_TARGET,
                     0.0, 1.0, TAU * math.log(3.0), tol=1e-9)

    fig, ax = plt.subplots()
    ax.plot(t * 1000.0, v, color=c[0], lw=2.1)
    ax.axhline(V_TARGET, color=S.GUIDE[mode], lw=1.3, ls="--")
    ax.axhline(V_RC, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.plot([t_cross * 1000.0], [V_TARGET], "o", color=c[1], ms=7.5)
    S.note(ax, t_cross * 1000.0 + 8.0, V_TARGET - 1.9,
           f"{t_cross * 1000.0:.1f} ms  =  $\\tau$ ln 3", mode, size=9)
    for frac, lab in ((1.0, "$\\tau$"), (1.1, "1.1$\\tau$")):
        tv = frac * TAU
        ax.plot([tv * 1000.0], [V_RC * (1.0 - math.exp(-frac))], "o",
                color=c[2], ms=5.5)
    S.note(ax, 1.05 * TAU * 1000.0, 5.3,
           "bracket: 9.482 V at $\\tau$,\n10.007 V at 1.1$\\tau$", mode, size=9)
    S.note(ax, 300.0, V_RC - 1.4, "15 V source", mode, size=9)
    S.label_end(ax, 450.0, v[-1], "$v_C(t)$", c[0], mode, dx=-6, ha="right", dy=-14)
    ax.set_xlabel("time (ms) — because k$\\Omega$ times $\\mu$F is ms")
    ax.set_ylabel("capacitor voltage (V)")
    ax.set_title("22 k$\\Omega$ and 4.7 $\\mu$F: the prefixes set the time axis")
    ax.set_ylim(0.0, 16.5)
    S.strip(ax)
    return _finish(fig)


@figure("ex2-loading-routes")
def fig_divider(mode):
    c = S.SERIES[mode]
    rl = np.logspace(-1.0, 3.0, 400)
    a = np.array([divider_parallel(r) for r in rl])
    b = np.array([divider_thevenin(r) for r in rl])
    d = np.array([divider_nodal(r) for r in rl])
    agree("divider curve, parallel vs thevenin", a, b, tol=1e-12)
    agree("divider curve, parallel vs nodal", a, d, tol=1e-12)

    fig, ax = plt.subplots()
    ax.semilogx(rl, a, color=c[0], lw=2.2)
    ax.semilogx(rl, b, color=c[1], lw=1.2, ls="--")
    ax.semilogx(rl, d, color=c[2], lw=0.0, marker="o", ms=3.6,
                markevery=24)
    ax.axhline(8.0, color=S.GUIDE[mode], lw=1.3, ls=":")
    S.note(ax, 0.11, 8.15, "8 V — the unloaded divider, a limiting case", mode,
           size=9)
    ax.plot([R_LOAD], [divider_parallel(R_LOAD)], "o", color=c[0], ms=7.5)
    S.note(ax, R_LOAD * 1.25, divider_parallel(R_LOAD) - 0.85,
           "6 k$\\Omega$ load  →  6.00 V", mode, size=9)
    S.label_end(ax, 1000.0, a[-1], "parallel", c[0], mode, dx=-6, ha="right", dy=-14)
    S.label_end(ax, 60.0, b[np.argmin(abs(rl - 60.0))], "Thevenin", c[1], mode,
                dx=0, dy=-16, ha="center")
    S.label_end(ax, 0.75, d[np.argmin(abs(rl - 0.75))], "nodal", c[2], mode,
                dx=0, dy=15, ha="center")
    ax.set_xlabel("load resistance (k$\\Omega$)")
    ax.set_ylabel("load voltage (V)")
    ax.set_title("Three routes to the same number, over four decades of load")
    ax.set_ylim(0.0, 9.2)
    S.strip(ax)
    return _finish(fig)


@figure("ex2-source-loading")
def fig_source(mode):
    c = S.SERIES[mode]
    rs = np.linspace(0.0, 25e3, 400)
    ratio = np.array([abs(inverting_gain_ratio(r)) for r in rs])
    balance = np.array([abs(inverting_gain_current(r)) for r in rs])
    agree("gain curve, ratio vs current balance", ratio, balance, tol=1e-12)

    fig, ax = plt.subplots()
    ax.plot(rs / 1000.0, ratio, color=c[0], lw=2.1)
    ax.plot(rs / 1000.0, balance, color=c[1], lw=0.0, marker="o", ms=4.0,
            markevery=25)
    ax.axhline(10.0, color=S.GUIDE[mode], lw=1.3, ls="--")
    S.note(ax, 12.0, 10.2, "10.0 — what the ideal-source formula returns", mode,
           size=9)
    ax.plot([5.0], [abs(inverting_gain_ratio(RSRC))], "o", color=c[0], ms=7.5)
    S.note(ax, 5.6, abs(inverting_gain_ratio(RSRC)) + 0.25,
           "5 k$\\Omega$ source  →  gain 6.667, output $-$2.00 V", mode, size=9)
    S.label_end(ax, 25.0, ratio[-1], "resistor ratio", c[0], mode, dx=-6,
                ha="right", dy=12)
    S.label_end(ax, 13.0, balance[np.argmin(abs(rs - 13e3))], "current balance",
                c[1], mode, dx=0, dy=-19, ha="center")
    ax.set_xlabel("source output resistance (k$\\Omega$)")
    ax.set_ylabel("closed-loop gain magnitude")
    ax.set_title("The gain formula's hidden hypothesis: an ideal source")
    ax.set_ylim(0.0, 11.6)
    S.strip(ax)
    return _finish(fig)


@figure("ex2-lookup-breakeven")
def fig_breakeven(mode):
    c = S.SERIES[mode]
    hit = np.linspace(0.40, 0.95, 400)
    fig, ax = plt.subplots()
    for k, ps in enumerate((0.90, 0.75, 0.60)):
        sec = np.array([breakeven_seconds(ps, h) for h in hit])
        alt = np.array([BUDGET * breakeven_questions(ps, h) for h in hit])
        agree(f"breakeven curve p={ps}", sec, alt, tol=1e-9)
        ax.plot(hit, sec, color=c[k], lw=2.0)
        S.label_end(ax, 0.95, sec[-1], f"$p$ = {ps:.2f}", c[k], mode, dx=6)
    ax.axhline(BUDGET, color=S.GUIDE[mode], lw=1.3, ls="--")
    S.note(ax, 0.405, BUDGET + 9.0, "174.5 s — one whole question budget", mode,
           size=9)
    ax.plot([0.70], [breakeven_seconds(0.90, 0.70)], "o", color=c[0], ms=7.5)
    S.note(ax, 0.712, breakeven_seconds(0.90, 0.70) - 24.0,
           "162 s at $p$ = 0.90, $h$ = 0.70", mode, size=9)
    ax.set_xlabel("baseline hit rate $h$ on the questions you displace")
    ax.set_ylabel("break-even extra seconds")
    ax.set_title("How long a look-up may take before it costs you marks")
    ax.set_xlim(0.40, 1.02)
    ax.set_ylim(0.0, 320.0)
    S.strip(ax)
    return _finish(fig)


# ---------------------------------------------------------------------------
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
