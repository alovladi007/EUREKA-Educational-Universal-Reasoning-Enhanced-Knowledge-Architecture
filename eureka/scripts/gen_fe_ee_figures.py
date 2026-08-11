#!/usr/bin/env python3
"""Generate the figures for the FE Electrical and Computer course.

Same contract as gen_ed_figures.py, and it deliberately imports the SAME
style module rather than growing a second look: every figure here is
COMPUTED from the equation the lesson states, in code you can read, so a
reader can check the curve against the formula. Nothing is traced, scanned
or adapted from the NCEES Reference Handbook or any textbook - this pipeline
consumes formulas, which are not protected expression, and never anyone's
drawing of them.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as an ordinary markdown image whose ALT TEXT
IS THE CAPTION:

    ![Sentence describing what the figure shows.](/courses/fe-ee/figures/<name>.svg)

The course reader swaps in the .dark.svg variant under the dark theme and
promotes the alt text to a visible caption.

Usage:
    python3 scripts/gen_fe_ee_figures.py             # all
    python3 scripts/gen_fe_ee_figures.py circuits    # only names starting "circuits"
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


def figure(name):
    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# Circuit Analysis (DC and AC steady state) - 11-17 questions
# ---------------------------------------------------------------------------


@figure("circuits-divider-split")
def _(mode):
    """Voltage and current division across a two-resistor pair.

    Both curves come straight from the divider formulas with R1 + R2 fixed at
    100 ohm: V1/V = R1/(R1+R2) and I1/I = R2/(R1+R2). Drawing them together
    is the point - they cross at the midpoint and run in OPPOSITE directions,
    which is exactly the fact that makes the current-divider fraction look
    backwards to people meeting it for the first time.
    """
    c = S.SERIES[mode]
    R1 = np.linspace(1, 99, 400)
    R2 = 100.0 - R1
    v_frac = R1 / (R1 + R2)
    i_frac = R2 / (R1 + R2)

    fig, ax = plt.subplots()
    ax.plot(R1, v_frac, color=c[0], lw=2.2)
    ax.plot(R1, i_frac, color=c[1], lw=2.2)
    S.label_end(ax, R1[-1], v_frac[-1], "voltage across R1", c[0], mode, dy=-4)
    S.label_end(ax, R1[-1], i_frac[-1], "current through R1", c[1], mode, dy=4)
    ax.plot([50], [0.5], "o", color=S.GUIDE[mode], ms=6)
    S.note(ax, 50, 0.53, "equal split at R1 = R2", mode, ha="center")
    ax.set_xlabel(r"$R_1$  (ohm), with  $R_1 + R_2 = 100$  ohm")
    ax.set_ylabel("fraction of the total")
    ax.set_title("Raise a resistance and it takes more voltage, less current")
    ax.set_xlim(0, 118)
    ax.set_ylim(0, 1.05)
    S.strip(ax)
    return fig


@figure("circuits-rc-rl-transient")
def _(mode):
    """First-order charging and discharging against time in units of tau.

    Curves are 1 - exp(-t/tau) and exp(-t/tau) exactly. The markers sit at the
    numbers the exam asks for: 63.2% at one tau, 95.0% at three, 99.3% at five.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 5, 400)
    rise = 1.0 - np.exp(-t)
    fall = np.exp(-t)

    fig, ax = plt.subplots()
    ax.plot(t, rise, color=c[0], lw=2.2)
    ax.plot(t, fall, color=c[1], lw=2.2)
    S.label_end(ax, t[-1], rise[-1], "charging", c[0], mode, dy=-4)
    S.label_end(ax, t[-1], fall[-1], "discharging", c[1], mode, dy=4)
    for k, txt in [(1, "63.2%"), (3, "95.0%"), (5, "99.3%")]:
        y = 1.0 - np.exp(-k)
        ax.plot([k], [y], "o", color=c[0], ms=6)
        ax.plot([k, k], [0, y], color=S.GUIDE[mode], lw=0.9, ls=":")
        S.note(ax, k, y + 0.03, txt, mode, ha="center")
    ax.set_xlabel(r"time  $t / \tau$")
    ax.set_ylabel("fraction of the final change")
    ax.set_title("Every first-order transient is the same two curves")
    ax.set_xlim(0, 5.9)
    ax.set_ylim(0, 1.12)
    S.strip(ax)
    return fig


@figure("circuits-power-triangle")
def _(mode):
    """Real, reactive and apparent power against power factor, for P fixed.

    S = P/pf and Q = P tan(arccos pf), with P held at 1 kW. The steep rise of
    both S and Q as the power factor falls is the whole economic argument for
    correction, and it is far more legible as a curve than as a sentence.
    """
    c = S.SERIES[mode]
    pf = np.linspace(0.30, 1.0, 400)
    P = 1.0
    Ssum = P / pf
    Q = P * np.tan(np.arccos(pf))

    fig, ax = plt.subplots()
    ax.plot(pf, Ssum, color=c[0], lw=2.2)
    ax.plot(pf, Q, color=c[1], lw=2.2)
    ax.axhline(P, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.label_end(ax, pf[0], Ssum[0], "apparent  S", c[0], mode, dx=6, ha="left")
    S.label_end(ax, pf[0], Q[0], "reactive  Q", c[1], mode, dx=6, dy=-10, ha="left")
    S.note(ax, 0.95, 1.06, "real power P held at 1 kW", mode, ha="right")
    ax.set_xlabel("power factor  cos(theta)")
    ax.set_ylabel("power  (kW, kVAR, kVA)")
    ax.set_title("A poor power factor costs current, not watts")
    ax.set_xlim(0.28, 1.02)
    ax.set_ylim(0, 3.6)
    S.strip(ax)
    return fig


@figure("circuits-series-resonance")
def _(mode):
    """Series RLC current magnitude against frequency, for three Q values.

    |I| = V / sqrt(R^2 + (omega L - 1/omega C)^2), normalised to its peak.
    L and C are fixed so omega_0 = 1 rad/s; only R changes, giving Q = 2, 5
    and 10. Higher Q is a taller, narrower peak - the bandwidth-Q trade the
    lesson states as BW = omega_0 / Q.
    """
    c = S.SERIES[mode]
    w = np.linspace(0.35, 1.9, 600)
    L, C = 1.0, 1.0  # omega_0 = 1
    fig, ax = plt.subplots()
    for i, Q in enumerate([2.0, 5.0, 10.0]):
        R = 1.0 / Q  # Q = omega_0 L / R with omega_0 = L = 1
        X = w * L - 1.0 / (w * C)
        mag = 1.0 / np.sqrt(R ** 2 + X ** 2)
        mag = mag / mag.max()
        ax.plot(w, mag, color=c[i], lw=2.0)
        k = int(np.argmax(mag))
        S.label_end(ax, w[k], mag[k], f"Q = {Q:.0f}", c[i], mode,
                    dx=4, dy=2 + 4 * i, ha="left")
    ax.axhline(1 / np.sqrt(2), color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 0.38, 1 / np.sqrt(2) + 0.02, "half-power, 0.707", mode)
    ax.set_xlabel(r"frequency  $\omega / \omega_0$")
    ax.set_ylabel("current, normalised to peak")
    ax.set_title("Higher Q is a narrower band, not a different centre")
    ax.set_xlim(0.35, 2.05)
    ax.set_ylim(0, 1.1)
    S.strip(ax)
    return fig


@figure("circuits-impedance-vs-frequency")
def _(mode):
    """Reactance magnitude against frequency for L and C, with their sum.

    X_L = omega L rises linearly, X_C = 1/(omega C) falls as 1/omega, and they
    cross where the branch is resonant. Plotting |X_L - X_C| alongside shows
    why the net reactance passes through zero rather than merely getting small.
    """
    c = S.SERIES[mode]
    w = np.logspace(-1, 1, 500)
    XL = w
    XC = 1.0 / w
    net = np.abs(XL - XC)

    fig, ax = plt.subplots()
    ax.loglog(w, XL, color=c[0], lw=2.0)
    ax.loglog(w, XC, color=c[1], lw=2.0)
    ax.loglog(w, np.maximum(net, 1e-3), color=c[2], lw=2.2)
    S.label_end(ax, w[-1], XL[-1], r"$X_L = \omega L$", c[0], mode, dy=-6)
    S.label_end(ax, w[0], XC[0], r"$X_C = 1/\omega C$", c[1], mode, dx=6, ha="left")
    S.label_end(ax, w[-1], net[-1], "net reactance", c[2], mode, dy=8)
    ax.axvline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 1.05, 0.02, r"$\omega_0$", mode)
    ax.set_xlabel(r"frequency  $\omega / \omega_0$")
    ax.set_ylabel("reactance  (normalised)")
    ax.set_title("The two reactances cancel at exactly one frequency")
    ax.set_ylim(1e-2, 12)
    S.strip(ax)
    return fig


@figure("circuits-three-phase-wye-delta")
def _(mode):
    """Power drawn by the same three resistors in wye and in delta.

    P_wye = V_L^2 / R and P_delta = 3 V_L^2 / R for a resistive load on the
    same line voltage. The constant factor of three across the whole range is
    the point: it is not an approximation that holds near one operating point.
    """
    c = S.SERIES[mode]
    VL = np.linspace(100, 600, 300)
    R = 10.0
    P_wye = VL ** 2 / R / 1000.0
    P_delta = 3.0 * VL ** 2 / R / 1000.0

    fig, ax = plt.subplots()
    ax.plot(VL, P_wye, color=c[0], lw=2.2)
    ax.plot(VL, P_delta, color=c[1], lw=2.2)
    S.label_end(ax, VL[-1], P_wye[-1], "wye", c[0], mode, dy=-6)
    S.label_end(ax, VL[-1], P_delta[-1], "delta", c[1], mode, dy=6)
    S.note(ax, 150, 90, "delta draws exactly 3x the wye power\n"
                        "on the same line voltage", mode)
    ax.set_xlabel("line-to-line voltage  (V)")
    ax.set_ylabel("total real power  (kW)")
    ax.set_title(r"Same three 10 $\Omega$ resistors, two connections")
    ax.set_xlim(100, 700)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Mathematics - 11-17 questions
# ---------------------------------------------------------------------------


@figure("math-damping-regimes")
def _(mode):
    """Second-order step response for the three damping regimes.

    Solutions of x'' + 2 alpha x' + omega_0^2 x = omega_0^2, with omega_0 = 1
    and alpha chosen at 0.3, 1.0 and 2.0 to give under-, critically and
    overdamped. The lesson names these from alpha against omega_0; this shows
    what each name looks like.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 14, 700)
    w0 = 1.0
    fig, ax = plt.subplots()

    # underdamped
    a = 0.3
    wd = np.sqrt(w0 ** 2 - a ** 2)
    under = 1 - np.exp(-a * t) * (np.cos(wd * t) + (a / wd) * np.sin(wd * t))
    # critically damped
    crit = 1 - np.exp(-w0 * t) * (1 + w0 * t)
    # overdamped
    a = 2.0
    s1 = -a + np.sqrt(a ** 2 - w0 ** 2)
    s2 = -a - np.sqrt(a ** 2 - w0 ** 2)
    over = 1 + (s2 * np.exp(s1 * t) - s1 * np.exp(s2 * t)) / (s1 - s2)

    ax.plot(t, under, color=c[0], lw=2.0)
    ax.plot(t, crit, color=c[1], lw=2.0)
    ax.plot(t, over, color=c[2], lw=2.0)
    S.label_end(ax, t[-1], under[-1], r"underdamped  $\alpha < \omega_0$", c[0], mode, dy=10)
    S.label_end(ax, t[-1], crit[-1], r"critical  $\alpha = \omega_0$", c[1], mode, dy=0)
    S.label_end(ax, t[-1], over[-1], r"overdamped  $\alpha > \omega_0$", c[2], mode, dy=-10)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.set_xlabel(r"time  $\omega_0 t$")
    ax.set_ylabel("response, normalised to final value")
    ax.set_title("Critical damping is the fastest arrival without overshoot")
    ax.set_xlim(0, 19.5)
    ax.set_ylim(0, 1.45)
    S.strip(ax)
    return fig


@figure("math-complex-quadrants")
def _(mode):
    """Why arctan alone cannot give the angle of a complex number.

    Four points of equal magnitude, one per quadrant. The calculator's arctan
    returns the same value for the pair in quadrants 1 and 3, and for the pair
    in 2 and 4 - so the quadrant correction is not a refinement, it is the
    difference between two opposite answers.
    """
    c = S.SERIES[mode]
    pts = [(3, 4, "3 + j4", "53.1", c[0]),
           (-3, 4, "-3 + j4", "126.9", c[1]),
           (-3, -4, "-3 - j4", "233.1", c[2]),
           (3, -4, "3 - j4", "-53.1", S.GUIDE[mode])]

    fig, ax = plt.subplots()
    th = np.linspace(0, 2 * np.pi, 300)
    ax.plot(5 * np.cos(th), 5 * np.sin(th), color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.axhline(0, color=S.GRID[mode], lw=1.0)
    ax.axvline(0, color=S.GRID[mode], lw=1.0)
    for x, y, lab, ang, col in pts:
        ax.plot([0, x], [0, y], color=col, lw=2.0)
        ax.plot([x], [y], "o", color=col, ms=7)
        S.note(ax, x + (0.35 if x > 0 else -0.35), y + (0.3 if y > 0 else -0.55),
               f"{lab}\n{ang} deg", mode, ha="left" if x > 0 else "right")
    ax.set_xlabel("real part")
    ax.set_ylabel("imaginary part")
    ax.set_title("All four have magnitude 5; only the quadrant tells them apart")
    ax.set_xlim(-6.5, 6.5)
    ax.set_ylim(-6.8, 6.8)
    ax.set_aspect("equal")
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
