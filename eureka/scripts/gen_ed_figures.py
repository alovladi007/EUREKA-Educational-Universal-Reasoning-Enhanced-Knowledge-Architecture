#!/usr/bin/env python3
"""Generate the figures for Electronic and Photonic Devices.

Every figure here is computed from the equation the lesson states, in code you
can read, so a reader can check the curve against the formula. Nothing is
copied, traced or adapted from any book: see ed_figstyle.py for the full
rationale and the house data-viz rules this obeys.

Each registered figure is rendered twice, once per theme, to

    apps/web/public/courses/electronic-devices/figures/<name>.svg
    apps/web/public/courses/electronic-devices/figures/<name>.dark.svg

and referenced from a lesson as

    ![Caption sentence.](/courses/electronic-devices/figures/<name>.svg)

The Markdown renderer swaps in the .dark.svg variant under the dark theme and
promotes the alt text to a visible caption.

Usage:
    python3 scripts/gen_ed_figures.py            # all
    python3 scripts/gen_ed_figures.py m18        # only names starting m18
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
    / "apps"
    / "web"
    / "public"
    / "courses"
    / "electronic-devices"
    / "figures"
)

REGISTRY: dict[str, callable] = {}


def figure(name):
    def deco(fn):
        REGISTRY[name] = fn
        return fn

    return deco


# ---------------------------------------------------------------------------
# Module 18 - conduction in metals and semiconductors
# ---------------------------------------------------------------------------


@figure("m18-mobility-vs-temperature")
def _(mode):
    """Matthiessen's rule applied to the two dominant semiconductor mechanisms.

    mu_L = A T^-3/2 (acoustic phonon), mu_I = B T^+3/2 (ionised impurity),
    1/mu = 1/mu_L + 1/mu_I. Constants chosen so the peak lands near 100 K at a
    mobility typical of moderately doped silicon; the SHAPE is the physics.
    """
    c = S.SERIES[mode]
    T = np.logspace(np.log10(20), np.log10(600), 400)
    mu_L = 1.4e3 * (T / 300.0) ** -1.5
    mu_I = 1.4e3 * (T / 300.0) ** 1.5 * 0.9
    mu = 1.0 / (1.0 / mu_L + 1.0 / mu_I)

    fig, ax = plt.subplots()
    ax.loglog(T, mu_L, color=c[0], ls="--", lw=1.5)
    ax.loglog(T, mu_I, color=c[1], ls="--", lw=1.5)
    ax.loglog(T, mu, color=c[2], lw=2.2)
    S.label_end(ax, T[-1], mu_L[-1], r"lattice  $\propto T^{-3/2}$", c[0], mode, dy=-6)
    S.label_end(ax, T[-1], mu_I[-1], r"impurity  $\propto T^{+3/2}$", c[1], mode, dy=6)
    k = int(np.argmax(mu))
    S.label_end(ax, T[k], mu[k], "combined", c[2], mode, dx=-4, dy=14, ha="center")
    ax.plot([T[k]], [mu[k]], "o", color=c[2], ms=6)
    ax.set_xlabel("temperature  T  (K)")
    ax.set_ylabel(r"drift mobility  $\mu$  (cm$^2$ V$^{-1}$ s$^{-1}$)")
    ax.set_title("Mobility is limited by whichever mechanism is worst")
    ax.set_xlim(20, 900)
    ax.set_ylim(200, 3e4)
    S.strip(ax)
    return fig


@figure("m18-metal-resistivity")
def _(mode):
    """rho(T) = rho_residual + rho_phonon(T), for three purities.

    The phonon term is taken linear above ~T_D/3 and rolled off below it; the
    point of the figure is that the three curves are PARALLEL and separated by
    a temperature-independent offset, which is Matthiessen's rule made visible.
    """
    c = S.SERIES[mode]
    T = np.linspace(2, 300, 400)
    TD = 343.0  # Debye temperature scale for the roll-off shape
    ph = 6.5 * (T / 300.0) / (1.0 + (TD / (4.0 * T)) ** 4) ** 0.25
    fig, ax = plt.subplots()
    for i, (res, lab) in enumerate([(0.02, "RRR 300"), (0.35, "RRR 20"), (1.4, "RRR 5")]):
        ax.plot(T, res + ph, color=c[i], lw=2.0)
        S.label_end(ax, T[-1], res + ph[-1], lab, c[i], mode, dy=(6 - 6 * i))
    ax.set_xlabel("temperature  T  (K)")
    ax.set_ylabel(r"resistivity  $\rho$  (n$\Omega\,$m)")
    ax.set_title("Purity sets the floor; phonons set the slope")
    ax.set_xlim(0, 360)
    ax.set_ylim(0, 9)
    S.note(ax, 8, 7.4, "residual resistivity\nis the T = 0 intercept", mode)
    S.strip(ax)
    return fig


@figure("m18-nordheim")
def _(mode):
    """Nordheim's rule, rho = C x(1-x), for two solute-solvent pairs.

    Parabolic in composition, maximal at x = 0.5, and the prefactor C grows
    with how dissimilar the two atoms are.
    """
    c = S.SERIES[mode]
    x = np.linspace(0, 1, 400)
    fig, ax = plt.subplots()
    for i, (C, lab) in enumerate([(300.0, "dissimilar pair (large C)"), (110.0, "similar pair (small C)")]):
        y = C * x * (1 - x)
        ax.plot(x, y, color=c[i], lw=2.1)
        S.label_end(ax, 0.5, C * 0.25, lab, c[i], mode, dx=0, dy=9, ha="center")
    ax.axvline(0.5, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 0.505, 4, "maximum disorder", mode)
    ax.set_xlabel("solute atomic fraction  x")
    ax.set_ylabel(r"added resistivity  $\rho_{\rm alloy}$  (n$\Omega\,$m)")
    ax.set_title(r"Nordheim's rule: $\rho_{\rm alloy}=C\,x(1-x)$")
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 95)
    S.strip(ax)
    return fig


@figure("m18-velocity-field")
def _(mode):
    """Drift velocity against field: silicon saturates, GaAs overshoots.

    Si:   v = mu E / (1 + mu E / v_sat)
    GaAs: two-valley average, v = (mu E + v_sat (E/E0)^4) / (1 + (E/E0)^4)
    Both are the standard empirical transport forms, evaluated here.
    """
    c = S.SERIES[mode]
    E = np.logspace(2, 5.7, 500)  # V/cm
    mu_si, vsat_si = 1350.0, 1.0e7  # cm^2/Vs, cm/s
    v_si = mu_si * E / (1 + mu_si * E / vsat_si)
    mu_ga, vsat_ga, E0 = 8000.0, 1.0e7, 4.0e3
    v_ga = (mu_ga * E + vsat_ga * (E / E0) ** 4) / (1 + (E / E0) ** 4)

    fig, ax = plt.subplots()
    ax.semilogx(E, v_si / 1e7, color=c[0], lw=2.1)
    ax.semilogx(E, v_ga / 1e7, color=c[1], lw=2.1)
    S.label_end(ax, E[-1], v_si[-1] / 1e7, "silicon", c[0], mode, dy=-8)
    k = int(np.argmax(v_ga))
    S.label_end(ax, E[k], v_ga[k] / 1e7, "GaAs", c[1], mode, dx=-2, dy=10, ha="center")
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 120, 1.04, r"$v_{\rm sat}\approx 10^{7}$ cm/s", mode)
    ax.annotate(
        "negative differential\nmobility",
        xy=(E[k] * 1.6, v_ga[k] / 1e7 * 0.93),
        xytext=(2.2e4, 0.62),
        color=S.INK_2[mode],
        fontsize=9,
        ha="center",
        arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode], lw=1.0),
    )
    ax.set_xlabel("electric field  E  (V/cm)")
    ax.set_ylabel(r"drift velocity  $v_d$  ($10^{7}$ cm/s)")
    ax.set_title("Mobility is a low-field concept only")
    ax.set_ylim(0, 1.75)
    S.strip(ax)
    return fig


@figure("m18-thin-film-resistivity")
def _(mode):
    """Size effects: surface (Fuchs-Sondheimer) and grain boundary (Mayadas).

    FS thick-film limit:  rho/rho_0 = 1 + (3/8)(1 - p) lambda/t
    MS grain boundary:    rho_0/rho = 3[1/3 - a/2 + a^2 - a^3 ln(1 + 1/a)],
                          a = (lambda/d) R/(1-R)
    Plotted against thickness in units of the bulk mean free path, which is why
    the curves are material-independent.
    """
    c = S.SERIES[mode]
    t = np.linspace(0.35, 6, 400)  # thickness / mean free path
    fs_diffuse = 1 + (3.0 / 8.0) * (1 - 0.0) / t
    fs_partial = 1 + (3.0 / 8.0) * (1 - 0.5) / t

    def ms(d_over_l, R=0.30):
        a = (1.0 / d_over_l) * R / (1 - R)
        f = 3 * (1.0 / 3.0 - a / 2.0 + a**2 - a**3 * np.log(1 + 1.0 / a))
        return 1.0 / f

    ms_curve = np.array([ms(x) for x in t])

    fig, ax = plt.subplots()
    ax.plot(t, fs_diffuse, color=c[0], lw=2.1)
    ax.plot(t, fs_partial, color=c[1], lw=2.1)
    ax.plot(t, ms_curve, color=c[2], lw=2.1)
    S.label_end(ax, t[-1], fs_diffuse[-1], "surfaces, fully diffuse", c[0], mode, dy=7)
    S.label_end(ax, t[-1], fs_partial[-1], "surfaces, half specular", c[1], mode, dy=-3)
    S.label_end(ax, t[-1], ms_curve[-1], "grain boundaries, R = 0.3", c[2], mode, dy=-13)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 0.4, 1.03, "bulk value", mode)
    ax.set_xlabel(r"thickness or grain size  /  bulk mean free path  $\lambda$")
    ax.set_ylabel(r"$\rho_{\rm film}\,/\,\rho_{\rm bulk}$")
    ax.set_title("Below a mean free path, geometry is the resistor")
    ax.set_xlim(0.35, 8.6)
    ax.set_ylim(0.9, 2.4)
    S.strip(ax)
    return fig


@figure("m18-quantized-conductance")
def _(mode):
    """Conductance staircase of a ballistic point contact.

    G = (2e^2/h) sum_n f(n), with each mode switching on over a thermally
    broadened window. Steps are exactly one conductance quantum tall.
    """
    c = S.SERIES[mode]
    Vg = np.linspace(-2.6, 1.2, 700)
    G = np.zeros_like(Vg)
    for n in range(1, 7):
        G += 1.0 / (1.0 + np.exp(-(Vg - (-2.2 + 0.55 * (n - 1))) / 0.055))
    fig, ax = plt.subplots()
    ax.plot(Vg, G, color=c[0], lw=2.1)
    for n in range(1, 7):
        ax.axhline(n, color=S.GRID[mode], lw=0.8, ls="-", alpha=0.8, zorder=0)
    S.label_end(ax, Vg[-1], G[-1], r"$G = N\,(2e^2/h)$", c[0], mode, dy=0)
    ax.set_xlabel("gate voltage  (arbitrary units, channel widening)")
    ax.set_ylabel(r"conductance  $G$  ($2e^{2}/h$)")
    ax.set_title(r"Each mode adds exactly $2e^{2}/h \approx (12.9\ {\rm k}\Omega)^{-1}$")
    ax.set_yticks(range(0, 7))
    ax.set_ylim(-0.2, 6.6)
    ax.set_xlim(-2.6, 1.9)
    ax.grid(axis="x", alpha=0.0)
    S.strip(ax)
    return fig


@figure("m18-quantum-hall")
def _(mode):
    """Integer quantum Hall effect: plateaux in rho_xy, minima in rho_xx.

    Two stacked panels share the field axis, because the two quantities have
    different scales and a second y-axis is never the answer.
    """
    c = S.SERIES[mode]
    B = np.linspace(1.0, 12.0, 1400)
    nu = 24.0 / B  # filling factor for a chosen sheet density
    steps = np.clip(np.round(nu), 1, None)
    soft = 0.10
    rho_xy = 25.8128 / steps
    # blend across transitions so the trace is a curve, not a sawtooth
    frac = nu - np.floor(nu)
    w = 1.0 / (1.0 + np.exp(-(np.abs(frac - 0.5) - 0.5 + soft) / 0.02))
    rho_xy = rho_xy * (1 - w) + (25.8128 / nu) * w
    rho_xx = 0.9 * np.exp(-((frac - 0.5) ** 2) / (2 * 0.11**2))

    fig, (a1, a2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.0),
                                 gridspec_kw={"height_ratios": [2, 1], "hspace": 0.12})
    fig.skip_tight = True  # panels are already spaced; tight_layout fights sharex
    a1.plot(B, rho_xy, color=c[0], lw=2.1)
    S.label_end(a1, B[-1], rho_xy[-1], r"$\rho_{xy}$", c[0], mode)
    for n in (2, 3, 4, 6):
        a1.axhline(25.8128 / n, color=S.GRID[mode], lw=0.8, alpha=0.9, zorder=0)
        a1.annotate(rf"$\nu={n}$", xy=(1.15, 25.8128 / n), color=S.INK_2[mode],
                    fontsize=9, va="bottom")
    a1.set_ylabel(r"$\rho_{xy}$  (k$\Omega$)")
    a1.set_title(r"Plateaux at $h/\nu e^{2}$ depend on constants, not on the sample")
    a1.set_ylim(0, 14)
    a2.plot(B, rho_xx, color=c[1], lw=2.1)
    S.label_end(a2, B[-1], rho_xx[-1], r"$\rho_{xx}$", c[1], mode)
    a2.set_ylabel(r"$\rho_{xx}$  (a.u.)")
    a2.set_xlabel("magnetic field  B  (T)")
    a2.set_ylim(0, 1.15)
    a1.set_xlim(1, 13.4)
    S.strip(a1)
    S.strip(a2)
    return fig


@figure("m18-percolation")
def _(mode):
    """Effective-medium conductivity of a two-phase mixture.

    Bruggeman symmetric EMA solved for a conductor-insulator mixture gives
    sigma_eff = 0 below phi_c = 1/3 and rises as (phi - phi_c)/(1 - phi_c)
    above it. Overlaid are the Wiener bounds, which is the point: composition
    alone does not fix conductivity, microstructure does.
    """
    c = S.SERIES[mode]
    phi = np.linspace(0, 1, 500)
    phic = 1.0 / 3.0
    ema = np.where(phi > phic, (phi - phic) / (1 - phic), 0.0)
    fig, ax = plt.subplots()
    ax.plot(phi, phi, color=c[1], lw=1.6, ls="--")
    ax.plot(phi, ema, color=c[0], lw=2.3)
    S.label_end(ax, 0.62, 0.62, "parallel bound", c[1], mode, dx=-4, dy=10, ha="right")
    S.label_end(ax, 1.0, 1.0, "random mixture", c[0], mode, dx=-6, dy=-14, ha="right")
    ax.axvline(phic, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.annotate(r"percolation threshold  $\phi_c$",
                xy=(phic, 0.02), xytext=(phic + 0.05, 0.30),
                color=S.INK_2[mode], fontsize=9,
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode], lw=1.0))
    ax.set_xlabel(r"conducting volume fraction  $\phi$")
    ax.set_ylabel(r"$\sigma_{\rm eff}\,/\,\sigma_{\rm conductor}$")
    ax.set_title("Below the threshold there is no path, whatever the recipe says")
    ax.set_xlim(0, 1.08)
    ax.set_ylim(0, 1.05)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# driver
# ---------------------------------------------------------------------------


def main() -> None:
    prefix = sys.argv[1] if len(sys.argv) > 1 else ""
    OUT.mkdir(parents=True, exist_ok=True)
    names = sorted(n for n in REGISTRY if n.startswith(prefix))
    if not names:
        print(f"no figures matching {prefix!r}")
        return
    for name in names:
        for mode in ("light", "dark"):
            S.apply(mode)
            fig = REGISTRY[name](mode)
            if not getattr(fig, "skip_tight", False):
                fig.tight_layout()
            suffix = ".svg" if mode == "light" else ".dark.svg"
            fig.savefig(OUT / f"{name}{suffix}", format="svg", bbox_inches="tight",
                        transparent=True)
            plt.close(fig)
    print(f"rendered {len(names)} figures x 2 modes -> {OUT}")


if __name__ == "__main__":
    main()
