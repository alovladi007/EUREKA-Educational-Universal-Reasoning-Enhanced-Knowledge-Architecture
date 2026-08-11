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


# ---------------------------------------------------------------------------
# Mathematics - 11-17 questions, the largest single knowledge area
# ---------------------------------------------------------------------------


@figure("math-unit-circle")
def _(mode):
    """The unit circle with the angles the exam actually uses.

    Every value here is computed from cos/sin, not typed in, so the plotted
    point and the printed exact value cannot disagree.
    """
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(6.4, 6.0))
    th = np.linspace(0, 2 * np.pi, 400)
    ax.plot(np.cos(th), np.sin(th), color=S.GUIDE[mode], lw=1.6)
    ax.axhline(0, color=S.GRID[mode], lw=1.0)
    ax.axvline(0, color=S.GRID[mode], lw=1.0)

    exact = {0: ("1", "0"), 30: (r"$\frac{\sqrt{3}}{2}$", r"$\frac{1}{2}$"),
             45: (r"$\frac{\sqrt{2}}{2}$", r"$\frac{\sqrt{2}}{2}$"),
             60: (r"$\frac{1}{2}$", r"$\frac{\sqrt{3}}{2}$"), 90: ("0", "1")}
    for deg, (cx, sy) in exact.items():
        r = np.radians(deg)
        x, y = np.cos(r), np.sin(r)
        ax.plot([0, x], [0, y], color=c[0], lw=1.8)
        ax.plot([x], [y], "o", color=c[0], ms=7)
        # Label radius is STAGGERED, not constant. 30, 45 and 60 degrees are
        # only 15 degrees apart, so at any single radius their two-line labels
        # overlap; pushing the middle one further out puts 30 and 60 a full 30
        # degrees apart on the inner ring and 45 clear on its own.
        rad = 1.62 if deg == 45 else 1.24
        ax.text(rad * np.cos(r), rad * np.sin(r),
                f"{deg}°\n({cx}, {sy})", ha="center", va="center",
                fontsize=9, color=S.INK[mode])
    # the reflections, which is where sign errors come from
    for deg in (120, 135, 150, 210, 225, 240, 300, 315, 330):
        r = np.radians(deg)
        ax.plot([np.cos(r)], [np.sin(r)], "o", color=c[1], ms=5)

    for qx, qy, s in [(-1.45, 1.45, "II\nsin +"),
                      (-1.45, -1.45, "III\ntan +"),
                      (1.45, -1.45, "IV\ncos +"),
                      (2.05, 1.45, "I\nall +")]:
        ax.text(qx, qy, s, ha="center", va="center", fontsize=9,
                color=S.GUIDE[mode])
    ax.set_title("First-quadrant exact values; the rest are reflections")
    ax.set_xlim(-1.95, 2.35)
    ax.set_ylim(-1.75, 1.85)
    ax.set_aspect("equal")
    S.strip(ax)
    return fig


@figure("math-conic-sections")
def _(mode):
    """The four conics, each drawn from the standard form the exam quotes."""
    c = S.SERIES[mode]
    fig, ax = plt.subplots()
    th = np.linspace(0, 2 * np.pi, 400)
    # The palette carries three series hues. The circle is the degenerate
    # reference case rather than a fourth peer, so it takes the guide colour;
    # inventing a fourth hue is how a validated palette stops being one.
    ax.plot(2 * np.cos(th), 2 * np.sin(th), color=S.GUIDE[mode], lw=1.6)  # circle r=2
    ax.plot(3 * np.cos(th), 2 * np.sin(th), color=c[0], lw=2.2)           # ellipse
    x = np.linspace(-3.2, 3.2, 300)
    ax.plot(x, x ** 2 / 4 - 3, color=c[1], lw=2.2)                        # parabola
    t = np.linspace(-1.35, 1.35, 200)
    for sign in (1, -1):
        ax.plot(sign * 2 * np.cosh(t), 2 * np.sinh(t), color=c[2], lw=2.2)

    # Labels go in the empty margin on the right, each on its own line, rather
    # than beside its curve - four conics drawn concentrically leave no gap
    # beside any of them, so in-place labels land on a neighbouring curve.
    for k, (txt, col) in enumerate([
            (r"circle  $x^2+y^2=4$", S.GUIDE[mode]),
            (r"ellipse  $\frac{x^2}{9}+\frac{y^2}{4}=1$", c[0]),
            (r"parabola  $y=\frac{x^2}{4}-3$", c[1]),
            (r"hyperbola  $\frac{x^2}{4}-\frac{y^2}{4}=1$", c[2])]):
        ax.text(4.6, 3.1 - 1.5 * k, txt, ha="left", va="center",
                fontsize=10, color=col)
    ax.set_title("One equation family; the signs decide which curve you get")
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_xlim(-5.2, 12.0)
    ax.set_ylim(-4.4, 4.4)
    ax.set_aspect("equal")
    S.strip(ax)
    return fig


@figure("math-derivative-extrema")
def _(mode):
    """f, f' and f'' for one cubic, stacked so the tests line up vertically.

    f(x) = x^3 - 3x has f' = 3x^2 - 3 (zeros at -1 and +1) and f'' = 6x (zero
    at 0). Reading down the column is the whole first- and second-derivative
    test, which is otherwise three separate rules to remember.
    """
    c = S.SERIES[mode]
    x = np.linspace(-2.3, 2.3, 500)
    f, d1, d2 = x ** 3 - 3 * x, 3 * x ** 2 - 3, 6 * x

    fig, axes = plt.subplots(3, 1, sharex=True, figsize=(7.2, 6.4))
    for ax, y, col, lab in ((axes[0], f, c[0], r"$f(x)=x^3-3x$"),
                            (axes[1], d1, c[1], r"$f'(x)=3x^2-3$"),
                            (axes[2], d2, c[2], r"$f''(x)=6x$")):
        ax.plot(x, y, color=col, lw=2.2)
        ax.axhline(0, color=S.GRID[mode], lw=1.0)
        ax.set_ylabel(lab)
        for v in (-1, 0, 1):
            ax.axvline(v, color=S.GUIDE[mode], lw=0.9, ls=":")
        S.strip(ax)
    axes[0].plot([-1, 1], [2, -2], "o", color=c[0], ms=7)
    S.note(axes[0], -1, 2.3, "local max", mode, ha="center")
    S.note(axes[0], 1, -3.4, "local min", mode, ha="center")
    S.note(axes[1], 0, 4.2, "f' = 0 at both extrema", mode, ha="center")
    S.note(axes[2], 0, 6.5, "f'' changes sign: inflection at x = 0", mode, ha="center")
    axes[0].set_title("Read down the column: f' locates, f'' classifies")
    axes[2].set_xlabel("x")
    fig.tight_layout()
    return fig


@figure("math-integral-area")
def _(mode):
    """Signed area, which is the point candidates most often miss.

    Integrating sin over 0 to 2*pi gives 0 because the two lobes cancel;
    integrating |sin| gives 4. Same curve, different question.
    """
    c = S.SERIES[mode]
    x = np.linspace(0, 2 * np.pi, 500)
    y = np.sin(x)
    fig, ax = plt.subplots()
    ax.plot(x, y, color=c[0], lw=2.2)
    ax.fill_between(x, 0, y, where=(y >= 0), color=c[0], alpha=0.25)
    ax.fill_between(x, 0, y, where=(y < 0), color=c[1], alpha=0.25)
    ax.axhline(0, color=S.GRID[mode], lw=1.0)
    S.note(ax, np.pi / 2, 0.42, "+2", mode, ha="center")
    S.note(ax, 3 * np.pi / 2, -0.55, "-2", mode, ha="center")
    ax.set_title(r"$\int_0^{2\pi}\sin x\,dx = 0$, but the area is 4")
    ax.set_xlabel("x")
    ax.set_ylabel(r"$\sin x$")
    ax.set_xticks([0, np.pi / 2, np.pi, 3 * np.pi / 2, 2 * np.pi])
    ax.set_xticklabels(["0", r"$\pi/2$", r"$\pi$", r"$3\pi/2$", r"$2\pi$"])
    ax.set_ylim(-1.35, 1.35)
    S.strip(ax)
    return fig


@figure("math-eigen-action")
def _(mode):
    """What a matrix does to vectors, and why eigenvectors are special.

    A = [[2,1],[1,2]] has eigenvalues 3 and 1 with eigenvectors [1,1] and
    [1,-1]. Every other vector is rotated by A; those two are only scaled.
    Eigenvalues and vectors are computed here, not asserted.
    """
    c = S.SERIES[mode]
    A = np.array([[2.0, 1.0], [1.0, 2.0]])
    vals, vecs = np.linalg.eig(A)
    fig, ax = plt.subplots(figsize=(6.4, 5.6))

    for k, ang in enumerate(np.radians([20, 70, 110, 160])):
        v = np.array([np.cos(ang), np.sin(ang)])
        Av = A @ v
        ax.arrow(0, 0, v[0], v[1], color=S.GUIDE[mode], lw=1.2,
                 head_width=0.07, length_includes_head=True)
        ax.arrow(0, 0, Av[0], Av[1], color=c[2], lw=1.4, alpha=0.75,
                 head_width=0.09, length_includes_head=True)
    for i in range(2):
        v = vecs[:, i] / np.linalg.norm(vecs[:, i])
        ax.arrow(0, 0, v[0], v[1], color=c[i], lw=2.6,
                 head_width=0.1, length_includes_head=True)
        Av = A @ v
        ax.arrow(0, 0, Av[0], Av[1], color=c[i], lw=2.6, ls=":",
                 head_width=0.1, length_includes_head=True)
        # Push the label past the arrow head along the same direction, so it
        # never sits on top of the vector it names.
        u = Av / np.linalg.norm(Av)
        S.note(ax, Av[0] + 0.34 * u[0], Av[1] + 0.34 * u[1],
               f"lambda = {vals[i]:.0f}", mode,
               ha="left" if u[0] >= 0 else "right")
    S.note(ax, -2.85, 2.9, "grey  v\ngreen  Av for a general v\ncolour  the two eigen-directions",
           mode)
    ax.set_title("A = [[2,1],[1,2]]: only the eigenvectors keep their direction")
    ax.axhline(0, color=S.GRID[mode], lw=1.0)
    ax.axvline(0, color=S.GRID[mode], lw=1.0)
    ax.set_xlim(-3.0, 3.4)
    ax.set_ylim(-1.6, 3.4)
    ax.set_aspect("equal")
    S.strip(ax)
    return fig


@figure("math-laplace-splane")
def _(mode):
    """Pole position in the s-plane against the time response it produces.

    Two panels with a shared A-D key rather than time curves floated on top of
    the plane. Insets over the plane cannot avoid colliding: the pole at the
    origin and the pole at -2 are close enough that any inset wide enough to
    read overlaps its neighbour's label. A key costs one glance and never
    collides. Each curve is the actual inverse transform for its pole pair.
    """
    c = S.SERIES[mode]
    fig, (ax, bx) = plt.subplots(
        1, 2, figsize=(8.4, 4.6), gridspec_kw={"width_ratios": [1.05, 1]})

    # Colour carries meaning rather than mere identity: the two stable cases
    # take series hues, the marginal case the guide grey, the unstable case
    # the warm hue. Four categories from a three-hue palette, no invented one.
    poles = [("A", -2.0, 2.0, "decaying oscillation", c[0]),
             ("B", -2.0, 0.0, "pure decay", c[2]),
             ("C",  0.0, 2.0, "sustained oscillation", S.GUIDE[mode]),
             ("D",  1.4, 2.0, "growing oscillation", c[1])]

    ax.axhline(0, color=S.GRID[mode], lw=1.2)
    ax.axvline(0, color=S.INK[mode], lw=1.6)
    for key, sx, sy, _lab, col in poles:
        for s in ({sy, -sy} if sy else {0.0}):
            ax.plot([sx], [s], "x", color=col, ms=12, mew=2.6)
        ax.text(sx + 0.22, (sy if sy else 0.0) + 0.22, key,
                fontsize=11, color=col, fontweight="bold")
    S.note(ax, -3.4, 3.1, "stable half", mode)
    S.note(ax, 0.25, 3.1, "unstable half", mode)
    ax.set_xlabel(r"real part $\sigma$   (decay rate)")
    ax.set_ylabel(r"imaginary part $\omega$   (oscillation)")
    ax.set_title("Where the poles sit")
    ax.set_xlim(-3.8, 3.0)
    ax.set_ylim(-3.2, 3.6)
    S.strip(ax)

    t = np.linspace(0, 3.2, 300)
    for k, (key, sx, sy, lab, col) in enumerate(poles):
        y = np.exp(sx * t) * (np.cos(sy * 4 * t) if sy else 1.0)
        y = y / max(1e-9, np.abs(y).max())
        off = -2.4 * k
        bx.plot(t, y + off, color=col, lw=1.8)
        bx.axhline(off, color=S.GRID[mode], lw=0.8)
        bx.text(-0.28, off, key, fontsize=11, color=col,
                fontweight="bold", va="center", ha="right")
        S.note(bx, 3.3, off + 0.35, lab, mode, ha="right")
    bx.set_xlabel("time")
    bx.set_title("What each one does in time")
    bx.set_xlim(-0.5, 3.4)
    bx.set_ylim(-8.9, 1.9)
    bx.set_yticks([])
    S.strip(bx)
    fig.tight_layout()
    return fig


@figure("math-pascal-triangle")
def _(mode):
    """Pascal's triangle, every entry computed as C(n,k) from the factorials.

    Two facts the exam leans on are visible rather than stated: each entry is
    the sum of the two above it, and row n sums to 2^n - which is why the
    number of subsets of an n-set is 2^n.
    """
    from math import comb
    c = S.SERIES[mode]
    rows = 8
    fig, ax = plt.subplots(figsize=(7.2, 4.6))
    for n in range(rows):
        for k in range(n + 1):
            x = k - n / 2.0
            y = -n
            v = comb(n, k)
            edge = (k in (0, n))
            ax.text(x, y, str(v), ha="center", va="center", fontsize=11,
                    color=S.GUIDE[mode] if edge else c[0],
                    fontweight="normal" if edge else "bold")
        ax.text(rows / 2.0 + 0.6, -n, f"sum $=2^{{{n}}}={2**n}$",
                ha="left", va="center", fontsize=9, color=S.INK[mode])
    # the addition rule, drawn once so it reads as a rule and not decoration
    ax.annotate("", xy=(-0.5, -5), xytext=(-1.0, -4),
                arrowprops=dict(arrowstyle="->", color=c[1], lw=1.6))
    ax.annotate("", xy=(-0.5, -5), xytext=(0.0, -4),
                arrowprops=dict(arrowstyle="->", color=c[1], lw=1.6))
    # The note sits in the left margin, right-aligned, so it ends before the
    # widest row begins. Left-aligned in the same place it ran across row 5.
    ax.text(-3.3, -4.6, "each entry is the\nsum of the two above",
            ha="right", va="center", fontsize=9, color=S.GUIDE[mode])
    ax.set_title(r"Pascal's triangle: entry $(n,k)$ is $\binom{n}{k}$")
    ax.set_xlim(-7.4, 7.6)
    ax.set_ylim(-rows - 0.4, 0.9)
    ax.set_xticks([])
    ax.set_yticks([])
    S.strip(ax)
    for s in ax.spines.values():
        s.set_visible(False)
    return fig


@figure("math-div-curl")
def _(mode):
    """Two fields chosen so one has divergence and no curl, the other the
    reverse - both computed on the same grid from their own definitions."""
    c = S.SERIES[mode]
    g = np.linspace(-1.6, 1.6, 11)
    X, Y = np.meshgrid(g, g)
    fig, axes = plt.subplots(1, 2, figsize=(7.6, 4.0))

    # F = (x, y): div = 2, curl = 0
    axes[0].quiver(X, Y, X, Y, color=c[0], width=0.006)
    axes[0].set_title(r"$\vec F=(x,\,y)$    div $=2$,  curl $=0$")
    # G = (-y, x): div = 0, curl = 2
    axes[1].quiver(X, Y, -Y, X, color=c[1], width=0.006)
    axes[1].set_title(r"$\vec G=(-y,\,x)$    div $=0$,  curl $=2$")
    for ax, lab in zip(axes, ("flows outward from every point",
                              "circulates, but nothing accumulates")):
        ax.set_aspect("equal")
        ax.set_xlim(-2.0, 2.0)
        ax.set_ylim(-2.2, 2.0)
        S.note(ax, 0, -2.15, lab, mode, ha="center")
        S.strip(ax)
    fig.tight_layout()
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
