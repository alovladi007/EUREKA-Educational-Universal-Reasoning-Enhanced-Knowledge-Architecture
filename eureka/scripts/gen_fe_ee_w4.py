#!/usr/bin/env python3
"""Wave-4 figures for the FE Electrical and Computer course: Power Systems.

Same contract as gen_fe_ee_w3.py, and it imports the SAME style module
rather than growing a second look: every curve here is COMPUTED from the
equation the lesson states, in code the reader can check. Nothing is traced,
scanned or adapted from the NCEES Reference Handbook or any textbook - the
pipeline consumes formulas, which are not protected expression, and never
anyone's drawing of them.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Usage:
    python3 scripts/gen_fe_ee_w4.py            # all
    python3 scripts/gen_fe_ee_w4.py pow-3ph    # only names starting "pow-3ph"
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
# Power Systems - 4-6 questions
# ---------------------------------------------------------------------------


@figure("pow-3ph-instantaneous")
def _(mode):
    """Instantaneous power of each phase and their sum, for the lesson's
    480 V / 24.79 A / 26.57 degree worked load.

    Each phase trace is p(t) = v(t) i(t) with v and i the stated sinusoids;
    the total is their pointwise sum. The assertion checks the sum is flat to
    numerical precision and equals 3 V I cos(phi) - the property the lesson
    derives, and the reason three-phase machines run without torque pulsation.
    """
    c = S.SERIES[mode]
    Vrms, Irms, phi = 277.1, 24.79, np.radians(26.57)
    w = 2 * np.pi * 60
    t = np.linspace(0, 1 / 30, 1500)  # two cycles

    def p(shift):
        v = np.sqrt(2) * Vrms * np.cos(w * t - shift)
        i = np.sqrt(2) * Irms * np.cos(w * t - shift - phi)
        return v * i / 1e3  # kW

    pa, pb, pc = p(0), p(2 * np.pi / 3), p(4 * np.pi / 3)
    tot = pa + pb + pc
    expect = 3 * Vrms * Irms * np.cos(phi) / 1e3
    assert tot.max() - tot.min() < 1e-9, "three-phase sum is not constant"
    assert abs(tot.mean() - expect) < 0.05, "sum disagrees with 3 V I cos(phi)"

    fig, ax = plt.subplots()
    ms = t * 1e3
    ax.plot(ms, pa, color=c[0], lw=1.5)
    ax.plot(ms, pb, color=c[1], lw=1.5)
    ax.plot(ms, pc, color=c[2], lw=1.5)
    ax.plot(ms, tot, color=S.INK[mode], lw=2.6)
    S.label_end(ax, 33.3, pa[-1], "phase a", c[0], mode, dy=6)
    S.label_end(ax, 33.3, pb[-1] - 0.4, "phase b", c[1], mode, dy=-8)
    S.label_end(ax, 33.3, pc[-1], "phase c", c[2], mode, dy=2)
    S.label_end(ax, 33.3, tot[-1], "total: 18.4 kW, flat", S.INK[mode], mode, dy=10)
    ax.axhline(0, color=S.GUIDE[mode], lw=0.9, ls=":")
    S.note(ax, 0.4, -3.4, "each phase pulses at 120 Hz and even dips negative -\nthe three pulsations cancel exactly", mode)
    ax.set_xlabel("time  (ms)")
    ax.set_ylabel("instantaneous power  (kW)")
    ax.set_title("Three pulsing phases add to a perfectly constant total")
    ax.set_xlim(0, 39)
    ax.set_ylim(-4.2, 20.5)
    S.strip(ax)
    return fig


@figure("pow-xfmr-efficiency")
def _(mode):
    """Transformer efficiency against load fraction for the lesson's 10 kVA
    unit (P_core = 60 W, full-load P_cu = 120 W), at 0.8 and 1.0 power factor.

    eta(x) = x S pf / (x S pf + P_core + x^2 P_cu), the exact expression the
    lesson uses. The assertion checks the numerical maximum of BOTH curves
    lands at x = sqrt(P_core / P_cu) = 0.707 - the max-efficiency load is set
    by the loss balance, not by the power factor.
    """
    c = S.SERIES[mode]
    Srated, Pc, Pcu = 10e3, 60.0, 120.0
    x = np.linspace(0.05, 1.4, 900)

    def eta(xf, pf):
        po = xf * Srated * pf
        return 100 * po / (po + Pc + Pcu * xf ** 2)

    xstar = np.sqrt(Pc / Pcu)
    for pf in (0.8, 1.0):
        xm = x[np.argmax(eta(x, pf))]
        assert abs(xm - xstar) < 0.01, "efficiency peak is not at sqrt(Pc/Pcu)"

    fig, ax = plt.subplots()
    ax.plot(x, eta(x, 1.0), color=c[0], lw=2.2)
    ax.plot(x, eta(x, 0.8), color=c[1], lw=2.2)
    S.label_end(ax, 1.4, eta(np.array([1.4]), 1.0)[0], "pf = 1.0", c[0], mode, dy=4)
    S.label_end(ax, 1.4, eta(np.array([1.4]), 0.8)[0], "pf = 0.8", c[1], mode, dy=-4)
    ax.axvline(xstar, color=S.GUIDE[mode], lw=1.0, ls="--")
    for pf, dy in ((1.0, 6), (0.8, 6)):
        ax.plot([xstar], [eta(np.array([xstar]), pf)[0]], "o",
                color=c[0] if pf == 1.0 else c[1], ms=6)
    S.note(ax, 0.72, 96.05, "peak at x = sqrt(60/120) = 0.707\nfor either power factor", mode)
    ax.plot([1.0], [eta(np.array([1.0]), 0.8)[0]], "o", color=c[1], ms=6)
    S.note(ax, 1.01, 97.35, "full load: 97.8%", mode)
    ax.set_xlabel("load fraction  x  (of 10 kVA rating)")
    ax.set_ylabel("efficiency  (%)")
    ax.set_title("Peak efficiency sits where copper loss equals core loss")
    ax.set_xlim(0, 1.62)
    ax.set_ylim(95.8, 98.6)
    S.strip(ax)
    return fig


@figure("pow-pu-fault-duty")
def _(mode):
    """Three-phase fault MVA against Thevenin per-unit reactance, on a
    100 MVA base: fault MVA = S_base / Z_pu.

    The curve is that single division. The two dots are the lesson's worked
    cases (0.16 pu -> 625 MVA, 0.91 pu -> 110 MVA) and the assertions
    recompute both. The shaded spans mark where common equipment impedances
    land, which is what makes a per-unit answer checkable at a glance.
    """
    c = S.SERIES[mode]
    z = np.linspace(0.04, 1.0, 900)
    mva = 100.0 / z
    assert abs(100 / 0.16 - 625.0) < 1e-9
    assert abs(100 / 0.91 - 109.9) < 0.05

    fig, ax = plt.subplots()
    ax.semilogy(z, mva, color=c[0], lw=2.2)
    for zp, lab, dx, dy in ((0.16, "0.16 pu -> 625 MVA", 8, 4),
                            (0.91, "0.91 pu -> 110 MVA", 8, 6)):
        ax.plot([zp], [100 / zp], "o", color=c[0], ms=7)
        S.note(ax, zp + dx / 100, 100 / zp * (1 + dy / 40), lab, mode)
    ax.axvspan(0.05, 0.10, color=c[1], alpha=0.14, lw=0)
    ax.axvspan(0.15, 0.25, color=c[2], alpha=0.14, lw=0)
    S.note(ax, 0.055, 1350, "transformer\nimpedance\nband", mode)
    S.note(ax, 0.163, 1350, "generator X''\nband", mode)
    S.label_end(ax, 1.0, 100, "fault MVA = S_base / Z_pu", c[0], mode, dy=10, ha="right", dx=-4)
    ax.set_xlabel("Thevenin reactance to the fault  (pu, 100 MVA base)")
    ax.set_ylabel("three-phase fault duty  (MVA, log scale)")
    ax.set_title("Fault duty is one division once the network is in per-unit")
    ax.set_xlim(0, 1.05)
    ax.set_ylim(80, 3000)
    S.strip(ax)
    return fig


@figure("pow-line-voltage-profile")
def _(mode):
    """Voltage magnitude along a 300 km lossless line at three loadings,
    computed from the distributed-parameter solution
    V(x) = cos(beta x) V_R + j Z0 sin(beta x) I_R with beta = w sqrt(LC).

    L = 1.3 mH/km and C = 9 nF/km (Z0 = 380 ohm), receiving-end load at
    unity power factor equal to 0.5, 1.0 and 1.5 times SIL. Each profile is
    normalised to its own sending-end voltage so all three start at 1.0. The
    assertion checks the SIL profile is flat - the definition of natural
    loading - and that the light-load case rises toward the receiving end
    (the Ferranti direction).
    """
    c = S.SERIES[mode]
    L, C = 1.3e-3, 9e-9
    w = 2 * np.pi * 60
    beta = w * np.sqrt(L * C)          # rad/km
    length = 300.0
    x = np.linspace(0, length, 400)    # measured from the receiving end

    def profile(p_over_sil):
        # per-unit on Z0 base: V_R = 1, I_R = P/SIL at unity pf
        v = np.cos(beta * x) + 1j * np.sin(beta * x) * p_over_sil
        v = np.abs(v)
        return (v / v[-1])[::-1]       # normalise to sending end, plot S -> R

    flat = profile(1.0)
    assert flat.max() - flat.min() < 1e-12, "SIL profile must be flat"
    light = profile(0.5)
    assert light[-1] > light[0], "light load must rise toward the receiving end"

    d = np.linspace(0, length, 400)  # distance from the sending end
    fig, ax = plt.subplots()
    for i, (pl, lab) in enumerate([(0.5, "0.5 SIL: voltage rises"),
                                   (1.0, "1.0 SIL: flat profile"),
                                   (1.5, "1.5 SIL: voltage sags")]):
        ax.plot(d, profile(pl), color=c[i], lw=2.2)
        S.label_end(ax, 300, profile(pl)[-1], lab, c[i], mode)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=0.9, ls=":")
    S.note(ax, 6, 1.0505, "every profile starts at its sending-end voltage;\nwhat the load does decides where it ends", mode)
    ax.set_xlabel("distance from the sending end  (km)")
    ax.set_ylabel("voltage magnitude  (per unit of sending end)")
    ax.set_title("Load below SIL lifts the far end; load above SIL drags it down")
    ax.set_xlim(0, 385)
    ax.set_ylim(0.90, 1.075)
    S.strip(ax)
    return fig


@figure("pow-pfc-current")
def _(mode):
    """Line current and relative feeder loss against power factor for a fixed
    500 kW load at 4160 V - the lesson's plant.

    Top panel: I = P / (sqrt(3) V pf). Bottom panel: loss relative to the
    unity-pf loss, which is (1/pf)^2 since loss goes as I^2. Stacked panels
    share the x-axis instead of stacking two unit systems on one axis. The
    assertions recompute the lesson's 92.5 A at 0.75 and 73.0 A at 0.95.
    Tolerances are tight (0.05) on purpose: a loose one previously let the
    marker be labelled 92.6 while the plotted point sat at 92.52.
    """
    c = S.SERIES[mode]
    P, V = 500e3, 4160.0
    pf = np.linspace(0.6, 1.0, 500)
    amps = P / (np.sqrt(3) * V * pf)
    i075 = P / (np.sqrt(3) * V * 0.75)
    i095 = P / (np.sqrt(3) * V * 0.95)
    assert abs(i075 - 92.5) < 0.05, "0.75 pf current off"
    assert abs(i095 - 73.0) < 0.05, "0.95 pf current off"

    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True,
                                   figsize=(S.FIGSIZE[0], 5.4),
                                   height_ratios=[1, 1])
    ax1.plot(pf, amps, color=c[0], lw=2.2)
    for p0, i0, lab in ((0.75, i075, "0.75 pf: 92.5 A"),
                        (0.95, i095, "0.95 pf: 73.0 A")):
        ax1.plot([p0], [i0], "o", color=c[0], ms=7)
        S.note(ax1, p0 + 0.008, i0 + 2.5, lab, mode)
    S.label_end(ax1, 1.0, amps[-1], "I = P / (sqrt(3) V pf)", c[0], mode, dy=8)
    ax1.set_ylabel("line current  (A)")
    ax1.set_ylim(60, 130)
    S.strip(ax1)

    ax2.plot(pf, (1 / pf) ** 2, color=c[1], lw=2.2)
    ax2.plot([0.75], [(1 / 0.75) ** 2], "o", color=c[1], ms=7)
    ax2.plot([0.95], [(1 / 0.95) ** 2], "o", color=c[1], ms=7)
    S.note(ax2, 0.757, (1 / 0.75) ** 2 + 0.04, "1.78x the unity-pf loss", mode)
    S.note(ax2, 0.905, (1 / 0.95) ** 2 + 0.09, "1.11x", mode)
    S.label_end(ax2, 1.0, 1.0, "relative loss = (1/pf)^2", c[1], mode, dy=8)
    ax2.set_xlabel("power factor  (same 500 kW delivered)")
    ax2.set_ylabel("feeder loss  (x unity-pf loss)")
    ax2.set_ylim(0.9, 3.0)
    ax2.set_xlim(0.6, 1.13)
    S.strip(ax2)
    fig.suptitle("Same real power, worse power factor: more amperes, squared losses",
                 fontsize=12, fontweight="semibold", color=S.INK[mode])
    fig.tight_layout()
    return fig


@figure("pow-motor-torque-speed")
def _(mode):
    """Induction-motor torque against speed from the per-phase circuit model
    T = 3 V^2 (R2/s) / (ws [(R1 + R2/s)^2 + X^2]), with the low-slip linear
    approximation T ~ 3 V^2 s / (ws R2) drawn dashed through the origin at
    synchronous speed.

    R1 = 0.30, R2 = 0.25, X = 1.20 ohm, V = 265.6 V per phase, 4 poles at
    60 Hz. Assertions recompute the breakdown slip s = R2/sqrt(R1^2 + X^2)
    = 0.202 against the numerical maximum, and the three marked torques.
    """
    c = S.SERIES[mode]
    R1, R2, X = 0.30, 0.25, 1.20
    Vph = 460 / np.sqrt(3)
    ws = 2 * np.pi * 60 / 2          # 4 poles -> 188.5 rad/s
    s = np.linspace(1e-3, 1.0, 4000)

    def T(sv):
        return 3 * Vph ** 2 * (R2 / sv) / (ws * ((R1 + R2 / sv) ** 2 + X ** 2))

    smax = R2 / np.sqrt(R1 ** 2 + X ** 2)
    assert abs(s[np.argmax(T(s))] - smax) < 2e-3, "breakdown slip mismatch"
    assert abs(T(np.array([smax]))[0] - 365.2) < 0.5
    assert abs(T(np.array([1.0]))[0] - 161.1) < 0.5
    assert abs(T(np.array([0.03]))[0] - 123.1) < 0.5

    rpm = 1800 * (1 - s)
    fig, ax = plt.subplots()
    ax.plot(rpm, T(s), color=c[0], lw=2.2)
    s_lin = np.linspace(0.001, 0.32, 100)
    ax.plot(1800 * (1 - s_lin), 3 * Vph ** 2 * s_lin / (ws * R2),
            color=S.GUIDE[mode], lw=1.4, ls="--")
    S.note(ax, 1195, 445, "linear approximation\nT ~ s near synchronous speed", mode)
    marks = [(1.0, "starting torque\n161 N·m", -10, -40),
             (smax, "breakdown: 365 N·m\nat slip 0.202", 12, 14),
             (0.03, "rated point\n123 N·m at 1746 rpm", -160, 40)]
    for sv, lab, dx, dy in marks:
        ax.plot([1800 * (1 - sv)], [T(np.array([sv]))[0]], "o", color=c[0], ms=7)
        S.note(ax, 1800 * (1 - sv) + dx, T(np.array([sv]))[0] + dy, lab, mode)
    ax.set_xlabel("rotor speed  (rpm)   -   slip runs 1 to 0, left to right")
    ax.set_ylabel("torque  (N·m)")
    ax.set_title("One circuit model draws the whole torque-speed story")
    ax.set_xlim(0, 1980)
    ax.set_ylim(0, 520)
    S.strip(ax)
    return fig


@figure("pow-fault-asymmetry")
def _(mode):
    """Fault current with maximum DC offset for X/R = 10, in multiples of the
    symmetric peak: i(t) = sin(wt - pi/2) + exp(-t/tau), tau = (X/R)/w.

    The first term is the symmetric wave (drawn separately), the exponential
    is the decaying offset (dashed), the sum is the asymmetric current a
    breaker actually sees. The assertion recomputes the 1.73 first-peak
    factor the lesson quotes for X/R = 10.
    """
    c = S.SERIES[mode]
    XR = 10.0
    w = 2 * np.pi * 60
    tau = XR / w
    t = np.linspace(0, 0.1, 4000)
    sym = np.sin(w * t - np.pi / 2)
    dc = np.exp(-t / tau)
    asym = sym + dc
    assert abs(asym.max() - 1.733) < 0.005, "peak factor for X/R=10 drifted"

    fig, ax = plt.subplots()
    ms = t * 1e3
    ax.plot(ms, sym, color=c[0], lw=1.6)
    ax.plot(ms, asym, color=c[1], lw=2.3)
    ax.plot(ms, dc, color=S.GUIDE[mode], lw=1.3, ls="--")
    S.label_end(ax, 100, sym[-1], "symmetric wave", c[0], mode, dy=-8)
    S.label_end(ax, 100, asym[-1], "asymmetric total", c[1], mode, dy=8)
    S.label_end(ax, 100, dc[-1], "DC offset, tau = 26.5 ms", S.GUIDE[mode], mode, dy=2)
    ipk = np.argmax(asym)
    ax.plot([ms[ipk]], [asym[ipk]], "o", color=c[1], ms=7)
    S.note(ax, ms[ipk] + 2, asym[ipk] + 0.04, "first peak: 1.73x the symmetric peak", mode)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=0.9, ls=":")
    S.note(ax, 60, 1.03, "symmetric peak level", mode)
    ax.axhline(0, color=S.GRID[mode], lw=0.8)
    ax.set_xlabel("time after fault inception  (ms)")
    ax.set_ylabel("current  (multiples of the symmetric peak)")
    ax.set_title("The DC offset rides the wave up, then leaks away through R")
    ax.set_xlim(0, 122)
    ax.set_ylim(-1.4, 2.1)
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
