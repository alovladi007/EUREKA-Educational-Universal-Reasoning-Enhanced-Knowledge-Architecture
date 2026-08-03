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


@figure("m18-hall-bar")
def _(mode):
    """Geometry of a Hall measurement, drawn from the force balance it encodes.

    A schematic rather than a plot, so it is built from primitives here for the
    same reason the plots are computed here: it has to be original.
    """
    c = S.SERIES[mode]
    ink, ink2 = S.INK[mode], S.INK_2[mode]
    fig, ax = plt.subplots(figsize=(7.2, 3.9))
    # the bar
    ax.add_patch(plt.Rectangle((0.5, 1.0), 6.0, 2.2, fill=True,
                               facecolor=c[0], alpha=0.10, edgecolor=c[0], lw=1.8))
    # current in
    ax.annotate("", xy=(0.5, 2.1), xytext=(-0.35, 2.1),
                arrowprops=dict(arrowstyle="-|>", color=c[0], lw=2.0))
    ax.annotate("", xy=(7.35, 2.1), xytext=(6.5, 2.1),
                arrowprops=dict(arrowstyle="-|>", color=c[0], lw=2.0))
    ax.text(-0.45, 2.1, "$I$", color=c[0], fontsize=12, ha="right", va="center",
            fontweight="semibold")
    # B out of page
    for xx in (2.0, 3.5, 5.0):
        ax.plot([xx], [2.1], marker="o", ms=11, mfc="none", mec=ink2, mew=1.4)
        ax.plot([xx], [2.1], marker=".", ms=4, color=ink2)
    ax.text(3.5, 3.42, r"$B$  out of the page", color=ink2, fontsize=10, ha="center")
    # carrier drift + Lorentz deflection
    ax.annotate("", xy=(4.3, 2.1), xytext=(3.1, 2.1),
                arrowprops=dict(arrowstyle="-|>", color=c[1], lw=1.8))
    ax.annotate("", xy=(4.3, 2.95), xytext=(4.3, 2.15),
                arrowprops=dict(arrowstyle="-|>", color=c[1], lw=1.8))
    ax.text(4.45, 2.62, r"$q\,\mathbf{v}\times\mathbf{B}$", color=c[1], fontsize=11,
            va="center", fontweight="semibold")
    # accumulated charge and the field it sets up
    ax.text(3.5, 3.05, "- - - - - - -", color=ink2, fontsize=11, ha="center")
    ax.text(3.5, 1.06, "+ + + + + + +", color=ink2, fontsize=11, ha="center")
    ax.annotate("", xy=(2.55, 1.35), xytext=(2.55, 2.85),
                arrowprops=dict(arrowstyle="-|>", color=c[2], lw=1.8))
    ax.text(2.42, 2.1, r"$\mathcal{E}_y$", color=c[2], fontsize=11, ha="right",
            va="center", fontweight="semibold")
    # Hall voltage probes
    ax.plot([5.6, 5.6], [3.2, 3.75], color=ink2, lw=1.2)
    ax.plot([5.6, 5.6], [1.0, 0.45], color=ink2, lw=1.2)
    ax.text(5.75, 2.1, r"$V_H$", color=ink, fontsize=12, fontweight="semibold",
            va="center")
    ax.plot([5.6, 6.15, 6.15, 5.6], [3.75, 3.75, 0.45, 0.45], color=ink2, lw=1.2)
    # thickness marker
    ax.annotate("", xy=(0.5, 1.0), xytext=(0.5, 3.2),
                arrowprops=dict(arrowstyle="<|-|>", color=ink2, lw=1.0))
    ax.text(0.32, 2.1, "$w$", color=ink2, fontsize=10, ha="right", va="center")
    ax.text(3.5, 0.10,
            r"steady state: $q\mathcal{E}_y=qv_dB\;\Rightarrow\;"
            r"V_H=\dfrac{IB}{n q t}$",
            color=ink, fontsize=11.5, ha="center")
    ax.set_xlim(-1.1, 7.6)
    ax.set_ylim(-0.15, 4.0)
    ax.axis("off")
    ax.set_title("The Hall voltage is a force balance, so its sign names the carrier")
    return fig


@figure("m18-avalanche")
def _(mode):
    """Avalanche multiplication, Miller's empirical form M = 1/(1-(V/V_B)^n).

    The divergence at breakdown is the point: multiplication is a runaway, not
    a gain you can dial in past a certain bias.
    """
    c = S.SERIES[mode]
    v = np.linspace(0, 0.985, 600)
    fig, ax = plt.subplots()
    for i, n in enumerate([2, 4, 6]):
        M = 1.0 / (1.0 - v**n)
        ax.plot(v, M, color=c[i], lw=2.0)
        S.label_end(ax, v[-1], min(M[-1], 60), f"n = {n}", c[i], mode, dy=0)
    ax.axvline(1.0, color=S.GUIDE[mode], lw=1.2, ls=":")
    S.note(ax, 0.985, 45, "breakdown", mode, ha="right")
    ax.set_xlabel(r"reverse bias  $V/V_{\rm BR}$")
    ax.set_ylabel(r"multiplication factor  $M$")
    ax.set_title(r"$M=\left[1-(V/V_{\rm BR})^{n}\right]^{-1}$ diverges at breakdown")
    ax.set_xlim(0, 1.12)
    ax.set_ylim(0, 60)
    S.strip(ax)
    return fig


@figure("m18-2deg-band")
def _(mode):
    """Conduction band edge of a modulation-doped heterostructure.

    Wide-gap donor layer, undoped spacer, then a triangular well at the
    interface holding two bound subbands. The point of the figure is the
    spatial separation between the ionised donors and the electrons.
    """
    c = S.SERIES[mode]
    ink2 = S.INK_2[mode]
    z = np.linspace(-40, 60, 800)  # nm, interface at 0
    Ec = np.where(
        z < -18, 0.75 - 0.004 * (z + 40),
        np.where(z < 0, 0.66 - 0.020 * (z + 18), 0.30 + 0.016 * z),
    )
    Ec = np.where(z >= 0, 0.30 + 0.016 * z - 0.30, Ec - 0.30)
    fig, ax = plt.subplots()
    ax.plot(z, Ec, color=c[0], lw=2.2)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, -39, 0.015, r"$E_F$", mode)
    for e, lab in [(0.055, r"$E_1$"), (0.135, r"$E_2$")]:
        zmax = (e + 0.30 - 0.30) / 0.016
        ax.plot([0, max(zmax, 4)], [e, e], color=c[2], lw=1.6)
        ax.text(max(zmax, 4) + 1.5, e, lab, color=c[2], fontsize=10,
                va="center", fontweight="semibold")
    ax.fill_between(z, -0.05, 0.0, where=(z >= 0) & (z < 12),
                    color=c[2], alpha=0.16, lw=0)
    ax.text(20, -0.033, "2DEG", color=c[2], fontsize=11, fontweight="semibold")
    for zz in (-30, -26, -22):
        ax.text(zz, 0.30, "+", color=c[1], fontsize=13, ha="center", fontweight="bold")
    ax.text(-26, 0.365, "ionised donors", color=c[1], fontsize=10, ha="center",
            fontweight="semibold")
    ax.axvline(-18, color=ink2, lw=0.9, ls=":")
    ax.axvline(0, color=ink2, lw=0.9, ls=":")
    S.note(ax, -17.4, -0.115, "undoped\nspacer", mode, size=9)
    ax.set_xlabel("depth  z  (nm)")
    ax.set_ylabel(r"conduction band edge  $E_c-E_F$  (eV)")
    ax.set_title("Modulation doping puts the carriers where the dopants are not")
    ax.set_xlim(-40, 62)
    ax.set_ylim(-0.13, 0.46)
    S.strip(ax)
    return fig


@figure("m18-drude-transient")
def _(mode):
    """v(t) = mu E (1 - e^{-t/tau}): the drift velocity relaxes with tau."""
    c = S.SERIES[mode]
    t = np.linspace(0, 6, 400)
    v = 1 - np.exp(-t)
    fig, ax = plt.subplots()
    ax.plot(t, v, color=c[0], lw=2.2)
    S.label_end(ax, t[-1], v[-1], r"$v_d(t)=\mu\mathcal{E}\,(1-e^{-t/\tau})$", c[0], mode, dx=-4, dy=10, ha="right")
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.axvline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.plot([1], [1 - np.e**-1], "o", color=c[1], ms=6)
    S.note(ax, 1.08, 0.56, r"at $t=\tau$: 63% of steady state", mode)
    ax.set_xlabel(r"time  $t/\tau$")
    ax.set_ylabel(r"$v_d\,/\,\mu\mathcal{E}$")
    ax.set_title(r"Scattering sets the memory time of the carrier gas")
    ax.set_xlim(0, 6.6)
    ax.set_ylim(0, 1.1)
    S.strip(ax)
    return fig


@figure("m18-ac-drude")
def _(mode):
    """AC Drude response: |sigma| and phase against omega tau, stacked panels."""
    c = S.SERIES[mode]
    wt = np.logspace(-2, 2, 400)
    mag = 1 / np.sqrt(1 + wt**2)
    ph = -np.degrees(np.arctan(wt))
    fig, (a1, a2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 4.8),
                                 gridspec_kw={"hspace": 0.12})
    fig.skip_tight = True
    a1.semilogx(wt, mag, color=c[0], lw=2.1)
    S.label_end(a1, wt[-1], mag[-1], r"$|\sigma|/\sigma_0$", c[0], mode)
    a1.axvline(1, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(a1, 1.15, 0.83, r"$\omega\tau=1$", mode)
    a1.set_ylabel(r"$|\sigma(\omega)|/\sigma_0$")
    a1.set_title(r"$\sigma(\omega)=\sigma_0/(1+i\omega\tau)$: metals stay Ohmic into the THz")
    a1.set_ylim(0, 1.08)
    a2.semilogx(wt, ph, color=c[1], lw=2.1)
    S.label_end(a2, wt[-1], ph[-1], "phase", c[1], mode)
    a2.set_ylabel("phase  (deg)")
    a2.set_xlabel(r"$\omega\tau$")
    a2.set_ylim(-95, 5)
    S.strip(a1)
    S.strip(a2)
    return fig


@figure("m18-fermi-maxwell")
def _(mode):
    """Fermi-Dirac occupation against the Maxwell-Boltzmann limit."""
    c = S.SERIES[mode]
    x = np.linspace(-8, 8, 500)
    fd = 1 / (1 + np.exp(x))
    mb = np.exp(-x)
    fig, ax = plt.subplots()
    ax.plot(x, fd, color=c[0], lw=2.2)
    ax.plot(x, np.clip(mb, 0, 1.15), color=c[1], lw=1.8, ls="--")
    S.label_end(ax, 4.2, 1 / (1 + np.exp(4.2)), "Fermi-Dirac", c[0], mode, dy=10)
    S.label_end(ax, 2.6, np.exp(-2.6), "Maxwell-Boltzmann", c[1], mode, dy=10)
    ax.axvline(0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 0.15, 1.03, r"$E=E_F$", mode)
    S.note(ax, 3.3, 0.30, "the two agree for\n$E-E_F\\gtrsim 3k_BT$:\nthe non-degenerate limit", mode)
    ax.set_xlabel(r"$(E-E_F)/k_BT$")
    ax.set_ylabel(r"occupation  $f(E)$")
    ax.set_title("Degenerate or not is a question about where $E_F$ sits")
    ax.set_xlim(-8, 8.5)
    ax.set_ylim(0, 1.15)
    S.strip(ax)
    return fig


@figure("m18-sheet-resistance")
def _(mode):
    """Sheet resistance: only the number of squares matters."""
    c = S.SERIES[mode]
    ink, ink2 = S.INK[mode], S.INK_2[mode]
    fig, ax = plt.subplots(figsize=(7.2, 3.6))
    # top view: a line of 5 squares
    L, W = 5.0, 1.0
    ax.add_patch(plt.Rectangle((0, 1.6), L, W, facecolor=c[0], alpha=0.12,
                               edgecolor=c[0], lw=1.8))
    for i in range(1, 5):
        ax.plot([i, i], [1.6, 1.6 + W], color=c[0], lw=1.0, ls="--", alpha=0.7)
    for i in range(5):
        ax.text(i + 0.5, 2.1, f"{i+1}", color=c[0], fontsize=10, ha="center",
                va="center", fontweight="semibold")
    ax.annotate("", xy=(L, 1.35), xytext=(0, 1.35),
                arrowprops=dict(arrowstyle="<|-|>", color=ink2, lw=1.0))
    ax.text(L / 2, 1.12, "$L$", color=ink2, fontsize=11, ha="center")
    ax.annotate("", xy=(-0.25, 2.6), xytext=(-0.25, 1.6),
                arrowprops=dict(arrowstyle="<|-|>", color=ink2, lw=1.0))
    ax.text(-0.42, 2.1, "$W$", color=ink2, fontsize=11, va="center", ha="right")
    # side view: thickness
    ax.add_patch(plt.Rectangle((0, 0.15), L, 0.28, facecolor=c[1], alpha=0.15,
                               edgecolor=c[1], lw=1.6))
    ax.text(L + 0.15, 0.29, "side view", color=ink2, fontsize=9, va="center")
    ax.annotate("", xy=(-0.25, 0.43), xytext=(-0.25, 0.15),
                arrowprops=dict(arrowstyle="<|-|>", color=ink2, lw=1.0))
    ax.text(-0.42, 0.29, "$t$", color=ink2, fontsize=11, va="center", ha="right")
    ax.text(L / 2, 3.05,
            r"$R=\rho\,\dfrac{L}{Wt}=\dfrac{\rho}{t}\cdot\dfrac{L}{W}"
            r"=R_s\times(\mathrm{number\ of\ squares})$",
            color=ink, fontsize=12, ha="center")
    ax.text(L / 2, 0.78,
            "this line is 5 squares: R = 5 $R_s$ whatever its absolute size",
            color=ink2, fontsize=10, ha="center")
    ax.set_xlim(-0.9, 6.4)
    ax.set_ylim(0, 3.5)
    ax.axis("off")
    return fig


@figure("m18-bloch-gruneisen")
def _(mode):
    """The Bloch-Gruneisen curve computed from its integral, with asymptotes."""
    c = S.SERIES[mode]
    Tr = np.logspace(np.log10(0.04), np.log10(2.0), 160)  # T / theta_D

    def bg(tr):
        x = np.linspace(1e-6, 1.0 / tr, 4000)
        y = x**5 * np.exp(x) / (np.expm1(x)) ** 2
        return tr**5 * np.trapz(y, x)

    rho = np.array([bg(t) for t in Tr])
    rho /= bg(1.0)
    fig, ax = plt.subplots()
    ax.loglog(Tr, rho, color=c[0], lw=2.2)
    S.label_end(ax, Tr[-1], rho[-1], "Bloch-Gruneisen", c[0], mode)
    ax.loglog(Tr, 1.15 * (Tr / Tr[-1]) * rho[-1], color=c[1], lw=1.4, ls="--")
    S.label_end(ax, 0.09, 1.15 * (0.09 / Tr[-1]) * rho[-1], r"$\propto T$", c[1], mode, dy=8)
    lowk = rho[5] / Tr[5] ** 5
    ax.loglog(Tr, 0.8 * lowk * Tr**5, color=c[2], lw=1.4, ls="--")
    S.label_end(ax, 0.35, 0.8 * lowk * 0.35**5, r"$\propto T^{5}$", c[2], mode, dx=8)
    ax.set_xlabel(r"$T/\theta_D$")
    ax.set_ylabel(r"$\rho_{\rm ph}(T)\,/\,\rho_{\rm ph}(\theta_D)$")
    ax.set_title(r"Phonon resistivity: $T^{5}$ when cold, linear when warm")
    ax.set_xlim(0.04, 3.4)
    ax.set_ylim(1e-7, 4)
    S.strip(ax)
    return fig


@figure("m18-tcr-error")
def _(mode):
    """Temperature error of a LINEAR platinum-RTD reading against the
    quadratic Callendar-Van Dusen response (IEC 60751 constants: facts)."""
    c = S.SERIES[mode]
    A, B = 3.9083e-3, -5.775e-7
    T = np.linspace(0, 600, 400)
    R = 1 + A * T + B * T**2
    T_lin = (R - 1) / A
    err = T_lin - T
    fig, ax = plt.subplots()
    ax.plot(T, err, color=c[0], lw=2.2)
    S.label_end(ax, T[-1], err[-1], "linear-model error", c[0], mode)
    ax.axhline(0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 8, -46, "the platinum curve bends down\n($B<0$), so a straight-line\nreading runs increasingly low", mode)
    ax.set_xlabel(r"true temperature  ($^{\circ}$C)")
    ax.set_ylabel(r"reading error  ($^{\circ}$C)")
    ax.set_title("Why precision RTD readout uses the quadratic, not the TCR")
    ax.set_xlim(0, 660)
    S.strip(ax)
    return fig


@figure("m18-sigma-semiconductor")
def _(mode):
    """Carrier density of doped silicon against 1000/T: freeze-out,
    extrinsic plateau, intrinsic runaway. Standard interpolation formulas."""
    c = S.SERIES[mode]
    kB = 8.617e-5
    T = np.linspace(60, 900, 700)
    Nc = 2.8e19 * (T / 300) ** 1.5
    Nv = 1.04e19 * (T / 300) ** 1.5
    ni = np.sqrt(Nc * Nv) * np.exp(-1.12 / (2 * kB * T))
    Nd, Ed = 1e16, 0.045
    n1 = (Nc / 2) * np.exp(-Ed / (kB * T))
    nd = 2 * Nd / (1 + np.sqrt(1 + 4 * Nd / n1))
    n = nd / 2 + np.sqrt((nd / 2) ** 2 + ni**2)
    x = 1000.0 / T
    fig, ax = plt.subplots()
    ax.semilogy(x, n, color=c[0], lw=2.2)
    ax.semilogy(x, ni, color=c[1], lw=1.5, ls="--")
    S.label_end(ax, x[-1], n[-1], r"$n(T)$, $N_D=10^{16}$", c[0], mode, dy=8)
    S.label_end(ax, 2.6, np.interp(2.6, x[::-1], ni[::-1]), r"$n_i(T)$", c[1], mode, dy=-12)
    S.note(ax, 1.15, 3e17, "intrinsic\nslope $E_g/2$", mode)
    S.note(ax, 5.0, 1.6e16, "extrinsic plateau: $n=N_D$", mode)
    S.note(ax, 12.3, 6e14, "freeze-out\nslope $E_d/2$", mode)
    ax.set_xlabel(r"$1000/T$  (K$^{-1}$)")
    ax.set_ylabel(r"electron density  (cm$^{-3}$)")
    ax.set_title("Devices live on the plateau; its ends are the operating limits")
    ax.set_xlim(0.9, 16)
    ax.set_ylim(1e13, 1e19)
    S.strip(ax)
    return fig


@figure("m18-alloy-mobility")
def _(mode):
    """Alloy scattering ceiling: 1/mu = 1/mu_host + x(1-x)/C."""
    c = S.SERIES[mode]
    x = np.linspace(0, 1, 400)
    mu_host = 1400 + 2500 * x
    C = 85.0
    mu = 1.0 / (1.0 / mu_host + x * (1 - x) / C)
    fig, ax = plt.subplots()
    ax.plot(x, mu_host, color=c[1], lw=1.6, ls="--")
    ax.plot(x, mu, color=c[0], lw=2.2)
    S.label_end(ax, x[-1], mu_host[-1], "host interpolation", c[1], mode, dy=8)
    S.label_end(ax, x[-1], mu[-1], "with alloy scattering", c[0], mode, dy=-8)
    ax.axvline(0.5, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 0.51, 500, "worst at $x=0.5$:\nthe $x(1-x)$ variance again", mode)
    ax.set_xlabel("alloy fraction  $x$")
    ax.set_ylabel(r"electron mobility  (cm$^2$ V$^{-1}$ s$^{-1}$)")
    ax.set_title("Purification cannot lift the alloy-disorder ceiling")
    ax.set_xlim(0, 1.28)
    ax.set_ylim(0, 4300)
    S.strip(ax)
    return fig


@figure("m18-lifetimes")
def _(mode):
    """Transport vs quantum lifetime: the (1-cos) weighting kills the
    contribution of small-angle scattering to resistance."""
    c = S.SERIES[mode]
    th = np.linspace(0, np.pi, 600)
    th0 = np.radians(15)
    P = np.exp(-((th / th0) ** 2))
    Ptr = P * (1 - np.cos(th))
    ratio = np.trapz(P, th) / np.trapz(Ptr, th)
    fig, ax = plt.subplots()
    ax.plot(np.degrees(th), P / P.max(), color=c[0], lw=2.1)
    ax.fill_between(np.degrees(th), 0, P / P.max(), color=c[0], alpha=0.12, lw=0)
    ax.plot(np.degrees(th), Ptr / P.max(), color=c[1], lw=2.1)
    S.label_end(ax, 27, 0.30, r"$P(\theta)$: all scattering events", c[0], mode)
    S.label_end(ax, 34, 0.055, r"$P(\theta)(1-\cos\theta)$: what resistance sees", c[1], mode)
    S.note(ax, 88, 0.62,
           f"remote donors scatter at small angles,\nso here "
           rf"$\tau_{{\rm tr}}/\tau_q\approx{ratio:.0f}$: many collisions,"
           "\nlittle resistance", mode)
    ax.set_xlabel(r"scattering angle  $\theta$  (deg)")
    ax.set_ylabel("weight  (normalised)")
    ax.set_title("Forward scattering is a collision that costs no current")
    ax.set_xlim(0, 185)
    ax.set_ylim(0, 1.06)
    S.strip(ax)
    return fig


@figure("m18-mobility-vs-doping")
def _(mode):
    """Caughey-Thomas fit of silicon 300 K mobility against doping
    (standard published parameterisation: facts, recomputed here)."""
    c = S.SERIES[mode]
    N = np.logspace(14, 20, 400)
    mu_n = 68.5 + (1414 - 68.5) / (1 + (N / 9.2e16) ** 0.711)
    mu_p = 44.9 + (470.5 - 44.9) / (1 + (N / 2.23e17) ** 0.719)
    fig, ax = plt.subplots()
    ax.semilogx(N, mu_n, color=c[0], lw=2.2)
    ax.semilogx(N, mu_p, color=c[1], lw=2.2)
    S.label_end(ax, N[-1], mu_n[-1], "electrons", c[0], mode, dy=8)
    S.label_end(ax, N[-1], mu_p[-1], "holes", c[1], mode, dy=-4)
    S.note(ax, 1.5e14, 200, "lattice-limited plateau", mode)
    S.note(ax, 6e18, 620, "ionised-impurity\nlimited", mode)
    ax.set_xlabel(r"total doping  $N$  (cm$^{-3}$)")
    ax.set_ylabel(r"mobility  (cm$^2$ V$^{-1}$ s$^{-1}$)")
    ax.set_title("Silicon at 300 K: the mobility you actually get at a given doping")
    ax.set_ylim(0, 1600)
    S.strip(ax)
    return fig


@figure("m18-hall-two-carrier")
def _(mode):
    """Two-carrier Hall coefficient of a p-type sample going intrinsic:
    R_H proportional to (p - n b^2)/(p + n b)^2 changes SIGN."""
    c = S.SERIES[mode]
    kB = 8.617e-5
    T = np.linspace(300, 700, 500)
    Nc = 2.8e19 * (T / 300) ** 1.5
    Nv = 1.04e19 * (T / 300) ** 1.5
    ni = np.sqrt(Nc * Nv) * np.exp(-1.12 / (2 * kB * T))
    Na, b = 1e15, 3.0
    p = Na / 2 + np.sqrt((Na / 2) ** 2 + ni**2)
    n = ni**2 / p
    RH = (p - n * b**2) / (p + n * b) ** 2
    RH /= abs(RH[0])
    fig, ax = plt.subplots()
    ax.plot(T, RH, color=c[0], lw=2.2)
    S.label_end(ax, T[-1], RH[-1], r"$R_H(T)$, p-type sample", c[0], mode)
    ax.axhline(0, color=S.GUIDE[mode], lw=1.0, ls=":")
    Tz = T[np.argmin(np.abs(RH))]
    ax.plot([Tz], [0], "o", color=c[1], ms=7)
    ax.annotate(f"sign reversal near {Tz:.0f} K:\nintrinsic electrons ($b\\approx3$)\noutvote the holes",
                xy=(Tz, 0), xytext=(Tz - 150, -0.55), color=S.INK_2[mode], fontsize=9,
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode], lw=1.0))
    ax.set_xlabel("temperature  (K)")
    ax.set_ylabel(r"$R_H$  (normalised to 300 K)")
    ax.set_title("A Hall sign change with temperature, with no change in the sample")
    ax.set_xlim(295, 760)
    S.strip(ax)
    return fig


@figure("m18-hot-carrier-temperature")
def _(mode):
    """Electron temperature from the energy balance e E v_d = 3k(Te-TL)/2tauE."""
    c = S.SERIES[mode]
    E = np.logspace(3, 5.5, 400)  # V/cm
    mu0, vsat = 1350.0, 1.0e7
    vd = mu0 * E / np.sqrt(1 + (mu0 * E / vsat) ** 2)
    tauE, kB = 3e-13, 1.381e-23
    q = 1.602e-19
    Te = 300 + (2.0 / 3.0) * q * (E * 1e2) * (vd * 1e-2) * tauE / kB
    fig, ax = plt.subplots()
    ax.loglog(E, Te, color=c[0], lw=2.2)
    S.label_end(ax, E[-1], Te[-1], r"$T_e(\mathcal{E})$", c[0], mode)
    ax.axhline(300, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 1.1e3, 330, "lattice at 300 K", mode)
    Eth = 730.0  # k_B Te = hbar w_op = 63 meV at ~730 K
    ax.axhline(Eth, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 1.1e3, 800, r"$k_BT_e=\hbar\omega_{\rm op}$: optical-phonon"
           "\nemission switches on", mode)
    ax.set_xlabel(r"field  $\mathcal{E}$  (V/cm)")
    ax.set_ylabel(r"electron temperature  $T_e$  (K)")
    ax.set_title("Carriers run thousands of kelvin above the lattice they sit in")
    ax.set_ylim(250, 2e4)
    S.strip(ax)
    return fig


@figure("m18-velocity-overshoot")
def _(mode):
    """Transient velocity after a field step: overshoot when the momentum
    relaxes faster than the energy (two-time-constant model)."""
    c = S.SERIES[mode]
    t = np.linspace(0, 1.0, 500)  # ps
    v_si = 1.0 * (1 - np.exp(-t / 0.20))
    tp = 0.15
    v_ga = 1.0 * (1 - np.exp(-t / 0.25)) + 3.0 * (t / tp) * np.exp(1 - t / tp)
    fig, ax = plt.subplots()
    ax.plot(t, v_ga, color=c[1], lw=2.2)
    ax.plot(t, v_si, color=c[0], lw=2.2)
    S.label_end(ax, t[-1], v_ga[-1], "GaAs: overshoot", c[1], mode, dy=8)
    S.label_end(ax, t[-1], v_si[-1], "Si: monotonic", c[0], mode, dy=-6)
    k = int(np.argmax(v_ga))
    ax.plot([t[k]], [v_ga[k]], "o", color=c[1], ms=6)
    S.note(ax, t[k] + 0.03, v_ga[k], "light-valley carriers outrun\ntheir steady state before\nintervalley transfer catches up", mode, va="top")
    ax.set_xlabel("time after field step  (ps)")
    ax.set_ylabel(r"drift velocity  ($10^{7}$ cm/s)")
    ax.set_title("For a fraction of a picosecond a device can beat its own v-E curve")
    ax.set_xlim(0, 1.28)
    ax.set_ylim(0, 4.4)
    S.strip(ax)
    return fig


@figure("m18-chynoweth")
def _(mode):
    """Chynoweth law: log(alpha) is linear in 1/E. Representative silicon
    parameterisation (published measured constants: facts, recomputed)."""
    c = S.SERIES[mode]
    E = np.linspace(2.0e5, 6.0e5, 300)  # V/cm
    ae = 7.03e5 * np.exp(-1.231e6 / E)
    ah = 1.582e6 * np.exp(-2.036e6 / E)
    x = 1e6 / E
    fig, ax = plt.subplots()
    ax.semilogy(x, ae, color=c[0], lw=2.2)
    ax.semilogy(x, ah, color=c[1], lw=2.2)
    S.label_end(ax, x[0], ae[0], "electrons", c[0], mode, dy=6)
    S.label_end(ax, x[0], ah[0], "holes", c[1], mode, dy=-6)
    S.note(ax, 3.6, 2.5e3,
           "the gap between the lines is $k=\\alpha_h/\\alpha_e\\ll 1$:\n"
           "silicon's low-noise-APD advantage", mode)
    ax.set_xlabel(r"$1/\mathcal{E}$  ($10^{-6}$ cm/V)")
    ax.set_ylabel(r"ionisation coefficient  $\alpha$  (cm$^{-1}$)")
    ax.set_title(r"$\alpha=\alpha_\infty e^{-\mathcal{E}_c/\mathcal{E}}$: straight on this axis")
    ax.set_xlim(1.55, 5.6)
    ax.set_ylim(1, 3e5)
    S.strip(ax)
    return fig


@figure("m18-breakdown-doping")
def _(mode):
    """V_BR = eps Ec^2 / 2qN for silicon and silicon carbide."""
    c = S.SERIES[mode]
    N = np.logspace(14, 18, 300)  # cm^-3
    e0 = 8.854e-12
    q = 1.602e-19

    def vbr(eps_r, Ec_Vcm):
        return eps_r * e0 * (Ec_Vcm * 1e2) ** 2 / (2 * q * N * 1e6)

    v_si = vbr(11.7, 3e5)
    v_sic = vbr(9.7, 3e6)
    fig, ax = plt.subplots()
    ax.loglog(N, v_si, color=c[0], lw=2.2)
    ax.loglog(N, v_sic, color=c[1], lw=2.2)
    S.label_end(ax, N[-1], v_si[-1], "Si", c[0], mode)
    S.label_end(ax, N[-1], v_sic[-1], "4H-SiC", c[1], mode)
    ax.axhline(1200, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 1.5e14, 1500, "1200 V class", mode)
    ax.annotate("same voltage,\n~80x the doping",
                xy=(2.4e16, 1200), xytext=(6e14, 6e1), color=S.INK_2[mode], fontsize=9,
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode], lw=1.0))
    S.note(ax, 3e16, 4e3, r"$E_c$ held constant per material;"
           "\nreal $E_c$ creeps up with doping", mode, size=8.5)
    ax.set_xlabel(r"drift-region doping  $N$  (cm$^{-3}$)")
    ax.set_ylabel(r"breakdown voltage  $V_{\rm BR}$  (V)")
    ax.set_title("Blocking voltage is bought with low doping, unless $E_c$ is high")
    S.strip(ax)
    return fig


@figure("m18-dos-dimensionality")
def _(mode):
    """g(E) in three, two and one dimension: sqrt, staircase, van Hove spikes."""
    c = S.SERIES[mode]
    fig, axes = plt.subplots(1, 3, figsize=(7.2, 2.9), sharey=False)
    fig.skip_tight = True
    fig.subplots_adjust(wspace=0.3, left=0.07, right=0.97, bottom=0.2, top=0.82)
    E = np.linspace(0, 1, 500)
    # 3D
    axes[0].plot(E, np.sqrt(E), color=c[0], lw=2.2)
    axes[0].set_title("3D", color=c[0])
    # 2D staircase
    g2 = np.zeros_like(E)
    for e0 in (0.12, 0.45, 0.78):
        g2 += (E >= e0) * 1.0
    axes[1].plot(E, g2 / 3, color=c[1], lw=2.2)
    axes[1].set_title("2D", color=c[1])
    # 1D van Hove
    g1 = np.zeros_like(E)
    for e0 in (0.12, 0.45, 0.78):
        with np.errstate(divide="ignore", invalid="ignore"):
            g1 += np.where(E > e0, 1.0 / np.sqrt(np.maximum(E - e0, 1e-4)), 0.0)
    axes[2].plot(E, g1 / g1.max(), color=c[2], lw=2.2)
    axes[2].set_title("1D", color=c[2])
    for ax, lab in zip(axes, [r"$g\propto\sqrt{E}$", r"$g=\frac{m^*}{\pi\hbar^2}$ per subband",
                              r"$g\propto (E-E_n)^{-1/2}$"]):
        ax.set_xlabel("energy")
        ax.set_yticks([])
        ax.text(0.5, -0.42, lab, transform=ax.transAxes, ha="center",
                color=S.INK_2[mode], fontsize=10)
        S.strip(ax)
    axes[0].set_ylabel("g(E)")
    return fig


@figure("m18-landau-fan")
def _(mode):
    """Landau fan: E_n = hbar omega_c (n + 1/2) against B, with E_F fixed.
    GaAs mass; spin ignored for clarity and said so in the caption."""
    c = S.SERIES[mode]
    coef = 1.728  # meV per tesla for m* = 0.067 m0
    B = np.linspace(0.01, 14, 300)
    EF = 10.7
    fig, ax = plt.subplots()
    for n in range(6):
        E = coef * B * (n + 0.5)
        ax.plot(B, E, color=c[0], lw=1.7, alpha=0.9)
        if coef * 14 * (n + 0.5) < 34:
            S.label_end(ax, 14, coef * 14 * (n + 0.5), f"n={n}", c[0], mode, size=9)
    ax.axhline(EF, color=c[1], lw=2.0, ls="--")
    S.label_end(ax, 14, EF, r"$E_F$", c[1], mode, dy=6)
    for n in range(1, 6):
        Bx = EF / (coef * (n + 0.5))
        if Bx <= 14:
            ax.plot([Bx], [EF], "o", color=c[2], ms=6)
    S.note(ax, 4.4, 12.0, "each crossing empties one level:\n"
           r"$\rho_{xx}$ oscillates periodically in $1/B$", mode)
    ax.set_xlabel("magnetic field  B  (T)")
    ax.set_ylabel("energy  (meV)")
    ax.set_title("The Landau fan sweeps levels through a fixed Fermi energy")
    ax.set_xlim(0, 15.8)
    ax.set_ylim(0, 34)
    S.strip(ax)
    return fig


@figure("m18-mfp-regime-map")
def _(mode):
    """Transport regime map: mean free path against device length."""
    c = S.SERIES[mode]
    ink2 = S.INK_2[mode]
    L = np.logspace(-9, -4, 200)
    fig, ax = plt.subplots()
    ax.fill_between(L, L * 10, 1e-3, color=c[0], alpha=0.10, lw=0)
    ax.fill_between(L, 1e-10, L / 10, color=c[1], alpha=0.10, lw=0)
    ax.plot(L, L, color=S.GUIDE[mode], lw=1.2, ls="--")
    ax.plot(L, L * 10, color=c[0], lw=1.0, ls=":")
    ax.plot(L, L / 10, color=c[1], lw=1.0, ls=":")
    ax.text(3e-9, 2e-6, "ballistic\n(Landauer)", color=c[0], fontsize=10,
            fontweight="semibold")
    ax.text(2e-6, 3e-9, "diffusive\n(drift-diffusion)", color=c[1], fontsize=10,
            fontweight="semibold")
    ax.text(1.05e-7, 3.2e-8, r"$\lambda=L$", color=ink2, fontsize=9, rotation=38)
    pts = [
        ("Si FET channel", 2e-8, 4e-8),
        ("Cu interconnect", 1e-6, 3.9e-8),
        ("GaAs 2DEG, 4 K", 2e-6, 9e-6),
        ("organic film", 1e-5, 2e-9),
        ("point contact", 2e-7, 9e-6),
    ]
    for lab, x, y in pts:
        ax.plot([x], [y], "o", color=c[2], ms=7)
        ax.annotate(lab, xy=(x, y), xytext=(5, 5), textcoords="offset points",
                    color=S.INK[mode], fontsize=9)
    ax.set_xscale("log")
    ax.set_yscale("log")
    ax.set_xlabel("device or feature length  L  (m)")
    ax.set_ylabel(r"mean free path  $\lambda$  (m)")
    ax.set_title("Which transport theory applies is a ratio, not a doctrine")
    ax.set_xlim(1e-9, 1e-4)
    ax.set_ylim(1e-9, 1e-4)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Module 17 - the materials framing module
# ---------------------------------------------------------------------------


@figure("m17-transistor-count")
def _(mode):
    """N(t) = N0 2^{(t-1971)/2}: the integration exponential, computed."""
    c = S.SERIES[mode]
    t = np.linspace(1971, 2026, 300)
    N = 2300 * 2 ** ((t - 1971) / 2.0)
    fig, ax = plt.subplots()
    ax.semilogy(t, N, color=c[0], lw=2.2)
    S.label_end(ax, t[-1], N[-1], r"$N=N_0\,2^{(t-1971)/2}$", c[0], mode)
    for yr, n0, lab in [(1971, 2.3e3, "first microprocessor era"),
                        (1993, 3.1e6, "superscalar era"),
                        (2023, 1.3e11, "chiplet era")]:
        ax.plot([yr], [n0], "o", color=c[1], ms=6)
        ax.annotate(lab, xy=(yr, n0), xytext=(6, -12), textcoords="offset points",
                    color=S.INK_2[mode], fontsize=9)
    ax.set_xlabel("year")
    ax.set_ylabel("transistors per chip")
    ax.set_title("Eight orders of magnitude from one compounding rule")
    ax.set_xlim(1969, 2038)
    S.strip(ax)
    return fig


@figure("m17-wright-learning")
def _(mode):
    """Wright's law: unit cost falls as cumulative volume^-b."""
    c = S.SERIES[mode]
    V = np.logspace(0, 12, 300)
    fig, ax = plt.subplots()
    for i, (b, lab) in enumerate([(0.4, "b = 0.4 (transistors)"), (0.2, "b = 0.2 (typical goods)")]):
        ax.loglog(V, V**-b, color=c[i], lw=2.1)
        S.label_end(ax, V[-1], V[-1] ** -b, lab, c[i], mode, dy=4 - 10 * i)
    ax.set_xlabel("cumulative units produced (relative)")
    ax.set_ylabel("cost per unit (relative)")
    ax.set_title(r"Wright's law $C\propto V^{-b}$: volume itself cuts cost")
    S.strip(ax)
    return fig


@figure("m17-dennard")
def _(mode):
    """Constant-field scaling: what a factor kappa buys, from the rules."""
    c = S.SERIES[mode]
    k = np.linspace(1, 10, 200)
    fig, ax = plt.subplots()
    ax.loglog(k, k**2, color=c[0], lw=2.1)
    ax.loglog(k, k, color=c[1], lw=2.1)
    ax.loglog(k, np.ones_like(k), color=c[2], lw=2.1)
    S.label_end(ax, 10, 100, r"devices/area $\propto\kappa^{2}$", c[0], mode)
    S.label_end(ax, 10, 10, r"speed $\propto\kappa$", c[1], mode)
    S.label_end(ax, 10, 1, r"power/area $=$ const", c[2], mode)
    ax.set_xlabel(r"scale factor  $\kappa$")
    ax.set_ylabel("relative gain")
    ax.set_title("Dennard's bargain: shrink everything, fields stay put")
    ax.set_xlim(1, 22)
    S.strip(ax)
    return fig


@figure("m17-frequency-vdd")
def _(mode):
    """The end of Dennard scaling: V_dd hits a floor, clocks plateau."""
    c = S.SERIES[mode]
    t = np.linspace(1985, 2026, 400)
    f = np.minimum(0.02 * 2 ** ((t - 1985) / 2.1), 4.5)  # GHz
    v = np.maximum(5.0 * 0.85 ** ((t - 1990).clip(0) / 2.0), 1.0)
    fig, (a1, a2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 4.8),
                                 gridspec_kw={"hspace": 0.12})
    fig.skip_tight = True
    a1.semilogy(t, f, color=c[0], lw=2.1)
    S.label_end(a1, t[-1], f[-1], "clock (GHz)", c[0], mode)
    a1.axhline(4.5, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(a1, 1986, 5.3, "the plateau: power density wall", mode)
    a1.set_ylabel("clock frequency (GHz)")
    a1.set_title("When the voltage floor arrived, frequency stopped")
    a2.plot(t, v, color=c[1], lw=2.1)
    S.label_end(a2, t[-1], v[-1], r"$V_{dd}$ (V)", c[1], mode)
    a2.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(a2, 1986, 1.15, r"threshold + subthreshold floor $\approx$ 1 V", mode)
    a2.set_xlabel("year")
    a2.set_ylabel(r"supply $V_{dd}$ (V)")
    a2.set_ylim(0, 5.6)
    S.strip(a1)
    S.strip(a2)
    return fig


@figure("m17-yield-poisson")
def _(mode):
    """Poisson yield Y = exp(-A D0) for three die sizes."""
    c = S.SERIES[mode]
    D = np.linspace(0, 0.5, 300)  # defects per cm^2
    fig, ax = plt.subplots()
    for i, A in enumerate([0.5, 2.0, 8.0]):
        ax.plot(D, 100 * np.exp(-A * D), color=c[i], lw=2.1)
        S.label_end(ax, D[-1], 100 * np.exp(-A * D[-1]), f"{A} cm$^2$ die", c[i], mode)
    ax.set_xlabel(r"defect density  $D_0$  (cm$^{-2}$)")
    ax.set_ylabel("yield  (%)")
    ax.set_title(r"$Y=e^{-AD_0}$: big dies pay exponentially for every defect")
    ax.set_xlim(0, 0.62)
    ax.set_ylim(0, 104)
    S.strip(ax)
    return fig


@figure("m17-dies-per-wafer")
def _(mode):
    """Gross and yielded dies per 300 mm wafer against die area."""
    c = S.SERIES[mode]
    A = np.linspace(0.2, 8, 300)  # cm^2
    d = 30.0  # cm
    gross = np.pi * (d / 2) ** 2 / A - np.pi * d / np.sqrt(2 * A)
    good = gross * np.exp(-A * 0.1)
    fig, ax = plt.subplots()
    ax.plot(A, gross, color=c[0], lw=2.1)
    ax.plot(A, good, color=c[1], lw=2.1)
    S.label_end(ax, A[-1], gross[-1], "gross dies", c[0], mode, dy=6)
    S.label_end(ax, A[-1], good[-1], r"good dies at $D_0=0.1$", c[1], mode, dy=-6)
    ax.set_xlabel(r"die area  (cm$^{2}$)")
    ax.set_ylabel("dies per 300 mm wafer")
    ax.set_title("Edge loss plus yield: why giant dies cost superlinearly")
    ax.set_yscale("log")
    S.strip(ax)
    return fig


@figure("m17-ni-comparison")
def _(mode):
    """Intrinsic carrier density vs temperature for Ge, Si, 4H-SiC."""
    c = S.SERIES[mode]
    kB = 8.617e-5
    T = np.linspace(250, 800, 300)
    mats = [("Ge", 0.66, 2.4e13), ("Si", 1.12, 1.0e10), ("4H-SiC", 3.26, 5e-9)]
    fig, ax = plt.subplots()
    for i, (lab, Eg, ni300) in enumerate(mats):
        ni = ni300 * (T / 300) ** 1.5 * np.exp(-(Eg / (2 * kB)) * (1 / T - 1 / 300.0))
        ax.semilogy(T, ni, color=c[i], lw=2.1)
        S.label_end(ax, T[-1], ni[-1], lab, c[i], mode)
    ax.axhline(1e14, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 255, 2e14, r"typical doping $10^{14}$: junctions die here", mode)
    ax.set_xlabel("temperature  (K)")
    ax.set_ylabel(r"$n_i$  (cm$^{-3}$)")
    ax.set_title("The gap sets the leakage floor and the temperature ceiling")
    ax.set_ylim(1e-10, 1e18)
    S.strip(ax)
    return fig


@figure("m17-oxide-bands")
def _(mode):
    """Band alignment of Si/SiO2: the accident that built the industry."""
    c = S.SERIES[mode]
    ink, ink2 = S.INK[mode], S.INK_2[mode]
    fig, ax = plt.subplots(figsize=(7.2, 4.2))
    # silicon: Ec at 0, Ev at -1.12; oxide: Ec at +3.1, Ev at -5.8 (9 eV gap)
    ax.fill_between([0, 2.6], -1.12, 0, color=c[0], alpha=0.15, lw=0)
    ax.plot([0, 2.6], [0, 0], color=c[0], lw=2.2)
    ax.plot([0, 2.6], [-1.12, -1.12], color=c[0], lw=2.2)
    ax.fill_between([2.6, 5.2], -5.9, 3.1, color=c[1], alpha=0.10, lw=0)
    ax.plot([2.6, 5.2], [3.1, 3.1], color=c[1], lw=2.2)
    ax.plot([2.6, 5.2], [-5.9, -5.9], color=c[1], lw=2.2)
    ax.text(1.3, 0.35, "Si", color=c[0], fontsize=12, ha="center", fontweight="semibold")
    ax.text(3.9, 3.45, r"SiO$_2$", color=c[1], fontsize=12, ha="center", fontweight="semibold")
    ax.annotate("", xy=(2.95, 3.1), xytext=(2.95, 0),
                arrowprops=dict(arrowstyle="<|-|>", color=ink2, lw=1.2))
    ax.text(3.1, 1.5, "3.1 eV electron barrier", color=ink, fontsize=10)
    ax.annotate("", xy=(2.3, -5.9), xytext=(2.3, -1.12),
                arrowprops=dict(arrowstyle="<|-|>", color=ink2, lw=1.2))
    ax.text(0.05, -3.6, "4.8 eV hole barrier", color=ink, fontsize=10)
    ax.text(2.6, -6.9,
            "both carriers see multi-eV walls, the interface passivates to\n"
            r"$\sim10^{10}$ traps cm$^{-2}$eV$^{-1}$, and the oxide grows from the crystal itself",
            color=ink2, fontsize=9.5, ha="center")
    ax.set_xlim(-0.2, 6.6)
    ax.set_ylim(-7.6, 4.2)
    ax.axis("off")
    ax.set_title("No other semiconductor has an insulator like this for free")
    return fig


@figure("m17-mobility-lollipop")
def _(mode):
    """Room-temperature electron mobility across the workhorse materials."""
    c = S.SERIES[mode]
    mats = [("a-Si:H", 1), ("poly-Si", 50), ("4H-SiC", 900), ("Si", 1400),
            ("GaN (2DEG)", 2000), ("Ge", 3900), ("GaAs", 8500),
            ("In$_{0.53}$Ga$_{0.47}$As", 12000), ("InSb", 77000)]
    y = np.arange(len(mats))
    fig, ax = plt.subplots(figsize=(7.2, 4.4))
    for i, (lab, mu) in enumerate(mats):
        ax.plot([1, mu], [i, i], color=S.GRID[mode], lw=1.0)
        ax.plot([mu], [i], "o", color=c[0], ms=8)
        ax.annotate(f"{mu:,}", xy=(mu, i), xytext=(7, 0), textcoords="offset points",
                    color=S.INK[mode], fontsize=9, va="center")
    ax.set_yticks(y, [m[0] for m in mats])
    ax.set_xscale("log")
    ax.set_xlabel(r"electron mobility at 300 K  (cm$^2$ V$^{-1}$ s$^{-1}$)")
    ax.set_title("Five decades of mobility, one job per decade")
    ax.set_xlim(0.5, 8e5)
    ax.grid(axis="y", alpha=0)
    S.strip(ax)
    return fig


@figure("m17-thermal-lollipop")
def _(mode):
    """Thermal conductivity: the other axis a power designer reads first."""
    c = S.SERIES[mode]
    mats = [("glass", 1), ("polyimide", 0.2), ("GaAs", 55), ("InP", 68),
            ("sapphire", 35), ("Si", 150), ("Cu", 400), ("4H-SiC", 490),
            ("diamond", 2000)]
    mats.sort(key=lambda m: m[1])
    fig, ax = plt.subplots(figsize=(7.2, 4.4))
    for i, (lab, k) in enumerate(mats):
        ax.plot([0.1, k], [i, i], color=S.GRID[mode], lw=1.0)
        ax.plot([k], [i], "o", color=c[1], ms=8)
        ax.annotate(f"{k}", xy=(k, i), xytext=(7, 0), textcoords="offset points",
                    color=S.INK[mode], fontsize=9, va="center")
    ax.set_yticks(range(len(mats)), [m[0] for m in mats])
    ax.set_xscale("log")
    ax.set_xlabel(r"thermal conductivity at 300 K  (W m$^{-1}$ K$^{-1}$)")
    ax.set_title("GaAs runs a third of silicon's heat path: RF designers pay for it")
    ax.set_xlim(0.1, 2e4)
    ax.grid(axis="y", alpha=0)
    S.strip(ax)
    return fig


@figure("m17-wafer-diameter")
def _(mode):
    """Wafer diameter adoption: steps, and the area each step bought."""
    c = S.SERIES[mode]
    steps = [(1960, 25), (1969, 51), (1976, 100), (1983, 150), (1992, 200),
             (2001, 300), (2026, 300)]
    yrs = [s[0] for s in steps]
    dia = [s[1] for s in steps]
    fig, ax = plt.subplots()
    ax.step(yrs, dia, where="post", color=c[0], lw=2.2)
    S.label_end(ax, yrs[-1], 300, "300 mm since 2001", c[0], mode)
    ax.plot([2015], [450], "x", color=c[1], ms=9, mew=2.4)
    ax.annotate("450 mm: demonstrated,\nnot adopted (economics)", xy=(2015, 450),
                xytext=(1988, 415), color=S.INK_2[mode], fontsize=9,
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode], lw=1.0))
    S.note(ax, 1961, 330, r"each step $\approx2\times$ the area,", mode)
    S.note(ax, 1961, 300, "at nearly the same cost per wafer pass", mode)
    ax.set_xlabel("year of first production use")
    ax.set_ylabel("wafer diameter  (mm)")
    ax.set_title("The quietest scaling law: the substrate itself")
    ax.set_xlim(1958, 2038)
    ax.set_ylim(0, 500)
    S.strip(ax)
    return fig


@figure("m17-purity-ladder")
def _(mode):
    """Impurity fraction down the silicon purification chain."""
    c = S.SERIES[mode]
    stages = [("quartzite", 1e-2), ("MG-Si", 1e-2), ("distilled\nsilane/TCS", 1e-8),
              ("EG poly-Si", 1e-9), ("CZ crystal", 1e-10), ("FZ crystal", 1e-11)]
    x = np.arange(len(stages))
    y = [s[1] for s in stages]
    fig, ax = plt.subplots()
    ax.semilogy(x, y, "-o", color=c[0], lw=2.0, ms=7)
    S.label_end(ax, x[-1], y[-1], "one foreign atom in $10^{11}$", c[0], mode)
    ax.set_xticks(x, [s[0] for s in stages], fontsize=9)
    ax.set_ylabel("impurity fraction (approx.)")
    ax.set_title("Nine orders of magnitude, won in the liquid phase")
    S.note(ax, 0.1, 3e-11, "the big step is chemistry:\ndistillation of a volatile silicon\ncompound, not crystal growth", mode)
    S.strip(ax)
    return fig


@figure("m17-bandgap-lattice")
def _(mode):
    """The bandgap-lattice constant map, from published lattice constants and
    gaps (facts). Filled markers direct, open markers indirect."""
    c = S.SERIES[mode]
    pts = [  # (name, a in Angstrom, Eg eV, direct?)
        ("Ge", 5.658, 0.66, False), ("Si", 5.431, 1.12, False),
        ("GaAs", 5.653, 1.42, True), ("AlAs", 5.661, 2.16, False),
        ("InP", 5.869, 1.34, True), ("InAs", 6.058, 0.35, True),
        ("GaP", 5.451, 2.26, False), ("GaSb", 6.096, 0.73, True),
        ("ZnSe", 5.668, 2.70, True), ("CdTe", 6.482, 1.50, True),
        ("GaN*", 4.50, 3.40, True), ("AlN*", 4.38, 6.2, True),
        ("InN*", 4.98, 0.7, True),
    ]
    fig, ax = plt.subplots()
    # alloy tie-lines
    ties = [("GaAs", "AlAs"), ("GaAs", "InAs"), ("InP", "InAs"),
            ("GaN*", "InN*"), ("GaN*", "AlN*")]
    d = {p[0]: p for p in pts}
    for a, b in ties:
        ax.plot([d[a][1], d[b][1]], [d[a][2], d[b][2]], color=c[1], lw=1.3,
                ls="--", alpha=0.8, zorder=1)
    for name, a, Eg, direct in pts:
        ax.plot([a], [Eg], "o", ms=8, zorder=3,
                mfc=c[0] if direct else "none", mec=c[0], mew=1.8)
        ax.annotate(name, xy=(a, Eg), xytext=(5, 4), textcoords="offset points",
                    color=S.INK[mode], fontsize=9)
    S.note(ax, 6.02, 5.2, "filled = direct gap\nopen = indirect\ndashes = alloy lines", mode)
    S.note(ax, 4.35, 0.25, "* wurtzite a-axis:\nplotted for reach,\nnot lattice match", mode, size=8.5)
    ax.set_xlabel(r"lattice constant  ($\mathrm{\AA}$)")
    ax.set_ylabel(r"bandgap  $E_g$  (eV)")
    ax.set_title("The estate map: substrates fix a column, alloys walk the lines")
    ax.set_xlim(4.2, 6.85)
    ax.set_ylim(0, 6.8)
    S.strip(ax)
    return fig


@figure("m17-vegard-bowing")
def _(mode):
    """Alloy gap with bowing: InGaN spans the visible; AlGaAs goes indirect."""
    c = S.SERIES[mode]
    x = np.linspace(0, 1, 300)
    ingan = x * 0.7 + (1 - x) * 3.4 - 1.4 * x * (1 - x)
    alg_d = 1.42 + 1.25 * x
    alg_i = 1.90 + 0.26 * x  # X-valley edge, roughly linear
    fig, ax = plt.subplots()
    ax.plot(x, ingan, color=c[0], lw=2.2)
    S.label_end(ax, x[-1], ingan[-1], r"In$_x$Ga$_{1-x}$N (b = 1.4 eV)", c[0], mode, dy=-4)
    ax.plot(x, alg_d, color=c[1], lw=2.0)
    ax.plot(x, alg_i, color=c[2], lw=2.0, ls="--")
    S.label_end(ax, 1.0, alg_d[-1], r"Al$_x$Ga$_{1-x}$As $\Gamma$", c[1], mode, dy=6)
    S.label_end(ax, 1.0, alg_i[-1], "X valley", c[2], mode, dy=-8)
    xc = (1.90 - 1.42) / (1.25 - 0.26)
    ax.plot([xc], [1.42 + 1.25 * xc], "o", color=S.INK[mode], ms=6)
    ax.annotate("direct-indirect crossover\n$x\\approx0.45$", xy=(xc, 1.42 + 1.25 * xc),
                xytext=(0.09, 2.9), color=S.INK_2[mode], fontsize=9,
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode], lw=1.0))
    ax.set_xlabel("alloy fraction  x")
    ax.set_ylabel(r"$E_g$  (eV)")
    ax.set_title(r"$E_g(x)=xE_A+(1-x)E_B-bx(1-x)$: composition is a dial, with fine print")
    ax.set_xlim(0, 1.42)
    ax.set_ylim(0.4, 3.6)
    S.strip(ax)
    return fig


@figure("m17-absorption-direct-indirect")
def _(mode):
    """alpha(E): sqrt law for direct, quadratic for indirect, computed."""
    c = S.SERIES[mode]
    E = np.linspace(1.0, 2.2, 400)
    a_dir = np.where(E > 1.42, 1.0e4 * np.sqrt(np.clip(E - 1.42, 0, None)), 0)
    a_ind = np.where(E > 1.12, 4.5e3 * np.clip(E - 1.12, 0, None) ** 2, 0)
    fig, ax = plt.subplots()
    ax.semilogy(E, np.clip(a_dir, 1, None), color=c[0], lw=2.2)
    ax.semilogy(E, np.clip(a_ind, 1, None), color=c[1], lw=2.2)
    S.label_end(ax, 2.2, a_dir[-1], r"direct: $\alpha\propto\sqrt{E-E_g}$", c[0], mode, dy=6)
    S.label_end(ax, 2.2, a_ind[-1], r"indirect: $\alpha\propto(E-E_g)^{2}$", c[1], mode, dy=-6)
    ax.axhline(1e4, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 1.02, 1.3e4, r"$1/\alpha=1\ \mu$m: a thin film absorbs here", mode)
    ax.set_xlabel("photon energy  (eV)")
    ax.set_ylabel(r"$\alpha$  (cm$^{-1}$)")
    ax.set_title("Same gap arithmetic, hundredfold absorption difference")
    ax.set_ylim(1, 4e4)
    S.strip(ax)
    return fig


@figure("m17-radiative-efficiency")
def _(mode):
    """Internal quantum efficiency eta = tau_nr / (tau_r + tau_nr)."""
    c = S.SERIES[mode]
    r = np.logspace(-4, 4, 300)  # tau_r / tau_nr
    eta = 1.0 / (1.0 + r)
    fig, ax = plt.subplots()
    ax.semilogx(r, 100 * eta, color=c[0], lw=2.2)
    S.label_end(ax, r[-1], 100 * eta[-1], r"$\eta=\dfrac{\tau_{nr}}{\tau_r+\tau_{nr}}$", c[0], mode, dy=10)
    for x0, lab, dy in [(1e-3, "GaAs QW:\n$\\tau_r\\sim$ ns $\\ll\\tau_{nr}$", -6),
                        (1e3, "silicon:\n$\\tau_r\\sim$ ms $\\gg\\tau_{nr}$", 10)]:
        ax.plot([x0], [100 / (1 + x0)], "o", color=c[1], ms=7)
        ax.annotate(lab, xy=(x0, 100 / (1 + x0)), xytext=(0, 18 + dy),
                    textcoords="offset points", color=S.INK_2[mode], fontsize=9,
                    ha="center")
    ax.set_xlabel(r"$\tau_r/\tau_{nr}$")
    ax.set_ylabel("internal quantum efficiency  (%)")
    ax.set_title("Emission is a race between two clocks, and silicon's is slow")
    ax.set_ylim(-4, 118)
    S.strip(ax)
    return fig


@figure("m17-johnson")
def _(mode):
    """Johnson figure of merit v_sat * E_c for the RF/power materials."""
    c = S.SERIES[mode]
    mats = [("Si", 1.0e7, 0.3), ("GaAs", 1.2e7, 0.4), ("InP", 1.5e7, 0.5),
            ("4H-SiC", 2.0e7, 3.0), ("GaN", 2.5e7, 3.3), ("diamond", 2.3e7, 10.0)]
    jfm = [(m[0], m[1] * m[2] * 1e6 / (2 * np.pi)) for m in mats]  # V/s
    jfm.sort(key=lambda m: m[1])
    fig, ax = plt.subplots(figsize=(7.2, 4.0))
    ref = dict(jfm)["Si"]
    for i, (lab, v) in enumerate(jfm):
        ax.plot([1e-1, v / ref], [i, i], color=S.GRID[mode], lw=1.0)
        ax.plot([v / ref], [i], "o", color=c[2], ms=8)
        ax.annotate(f"{v/ref:.0f}x", xy=(v / ref, i), xytext=(7, 0),
                    textcoords="offset points", color=S.INK[mode], fontsize=9,
                    va="center")
    ax.set_yticks(range(len(jfm)), [m[0] for m in jfm])
    ax.set_xscale("log")
    ax.set_xlabel(r"Johnson limit  $v_{\rm sat}\mathcal{E}_c/2\pi$, relative to Si")
    ax.set_title("Power times frequency is a material constant, and Si sits lowest")
    ax.set_xlim(0.5, 300)
    ax.grid(axis="y", alpha=0)
    S.strip(ax)
    return fig


@figure("m17-haitz")
def _(mode):
    """Haitz's law, computed as the stated exponentials."""
    c = S.SERIES[mode]
    t = np.linspace(1968, 2026, 200)
    flux = 1e-3 * 20 ** ((t - 1968) / 10.0)
    cost = 1e2 * 10 ** (-(t - 1968) / 10.0)
    fig, ax = plt.subplots()
    ax.semilogy(t, flux, color=c[0], lw=2.2)
    ax.semilogy(t, cost, color=c[1], lw=2.2)
    S.label_end(ax, t[-1], flux[-1], "flux per package\n(20x per decade)", c[0], mode)
    S.label_end(ax, t[-1], cost[-1], "cost per lumen\n(0.1x per decade)", c[1], mode, dy=-8)
    ax.set_xlabel("year")
    ax.set_ylabel("relative to 1968")
    ax.set_title("Haitz's law: the LED ran its own Moore curve for fifty years")
    ax.set_xlim(1966, 2042)
    S.strip(ax)
    return fig


@figure("m17-cost-per-transistor-node")
def _(mode):
    """Wafer cost rising vs transistors per wafer rising: the flattening."""
    c = S.SERIES[mode]
    n = np.arange(0, 12)  # node generations
    tpw = 2.0**n
    wcost = 1.0 * 1.28**n
    cpt = wcost / tpw
    fig, ax = plt.subplots()
    ax.semilogy(n, cpt / cpt[0], "-o", color=c[0], lw=2.0, ms=6)
    S.label_end(ax, n[-1], (cpt / cpt[0])[-1], "cost per transistor", c[0], mode)
    ax.semilogy(n, wcost / wcost[0], "-o", color=c[1], lw=1.6, ms=5)
    S.label_end(ax, n[-1], (wcost / wcost[0])[-1], "wafer cost", c[1], mode)
    S.note(ax, 0.2, 0.02,
           "as long as density doubles beat the ~28%/node wafer-cost rise,\n"
           "each node was cheaper per function; the margin has thinned to a sliver",
           mode)
    ax.set_xlabel("node generations")
    ax.set_ylabel("relative to node 0")
    ax.set_title("The economic engine, and why it is sputtering")
    S.strip(ax)
    return fig


@figure("m17-dark-silicon")
def _(mode):
    """Post-Dennard: switchable fraction of a chip at fixed power."""
    c = S.SERIES[mode]
    n = np.linspace(0, 8, 200)  # generations after Dennard's end
    frac = 100 * (1 / 1.4) ** n  # per-device power falls slower than area
    fig, ax = plt.subplots()
    ax.plot(n, frac, color=c[0], lw=2.2)
    S.label_end(ax, n[-1], frac[-1], "simultaneously\nactive fraction", c[0], mode)
    ax.fill_between(n, frac, 100, color=c[1], alpha=0.10, lw=0)
    S.note(ax, 3.2, 72, '"dark silicon": area you own\nbut cannot power', mode)
    ax.set_xlabel("technology generations past constant-field scaling")
    ax.set_ylabel("percent of chip switchable at fixed power")
    ax.set_title("When power/area stopped scaling, area stopped meaning speed")
    ax.set_ylim(0, 108)
    S.strip(ax)
    return fig


@figure("m17-hetero-lever")
def _(mode):
    """What lattice mismatch costs: critical thickness vs misfit (Matthews-
    Blakeslee scale form h_c ~ (b/f) ln(h_c/b), solved numerically)."""
    c = S.SERIES[mode]
    f = np.logspace(-3.3, -1.3, 200)  # misfit strain
    b = 0.4  # nm, Burgers vector scale

    def hc(fi):
        h = 10.0
        for _ in range(60):
            h = (b / (8 * np.pi * fi)) * (np.log(h / b) + 1)
        return h

    h = np.array([hc(fi) for fi in f])
    fig, ax = plt.subplots()
    ax.loglog(f * 100, h, color=c[0], lw=2.2)
    S.label_end(ax, f[-1] * 100, h[-1], "critical thickness", c[0], mode)
    for fi, lab in [(0.0008, "SiGe 2%"), (0.007, "InGaAs 10%"), (0.04, "GaN on Si")]:
        ax.plot([fi * 100], [hc(fi)], "o", color=c[1], ms=7)
        ax.annotate(lab, xy=(fi * 100, hc(fi)), xytext=(6, 6),
                    textcoords="offset points", color=S.INK_2[mode], fontsize=9)
    ax.set_xlabel("lattice misfit  (%)")
    ax.set_ylabel(r"critical thickness  $h_c$  (nm)")
    ax.set_title("Strained heteroepitaxy rents its perfection by the nanometre")
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Module 19 - optical constants and optical characterization (tranche 1)
# ---------------------------------------------------------------------------


@figure("m19-lorentz-nk")
def _(mode):
    """A single Lorentz oscillator: n and k from one resonance, computed.
    epsilon = 1 + wp^2 / (w0^2 - w^2 - i g w)."""
    c = S.SERIES[mode]
    w = np.linspace(0.2, 2.2, 800)  # in units of w0
    wp2, g = 0.8, 0.12
    eps = 1 + wp2 / (1 - w**2 - 1j * g * w)
    nk = np.sqrt(eps)
    fig, (a1, a2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 4.8),
                                 gridspec_kw={"hspace": 0.12})
    fig.skip_tight = True
    a1.plot(w, nk.real, color=c[0], lw=2.1)
    S.label_end(a1, w[-1], nk.real[-1], "n", c[0], mode)
    a1.axvline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(a1, 1.03, 2.1, "anomalous dispersion\nrides the resonance", mode)
    a1.set_ylabel("refractive index  n")
    a1.set_title("One oscillator makes both constants: absorption and dispersion are twins")
    a2.plot(w, nk.imag, color=c[1], lw=2.1)
    S.label_end(a2, w[-1], nk.imag[-1], "k", c[1], mode)
    a2.set_xlabel(r"frequency  $\omega/\omega_0$")
    a2.set_ylabel("extinction  k")
    S.strip(a1)
    S.strip(a2)
    return fig


@figure("m19-reflectance-vs-n")
def _(mode):
    """Normal-incidence reflectance R = ((n-1)^2+k^2)/((n+1)^2+k^2)."""
    c = S.SERIES[mode]
    n = np.linspace(1.0, 4.5, 400)
    fig, ax = plt.subplots()
    for i, k in enumerate([0.0, 0.5, 2.0]):
        R = ((n - 1) ** 2 + k**2) / ((n + 1) ** 2 + k**2)
        ax.plot(n, 100 * R, color=c[i], lw=2.1)
        S.label_end(ax, n[-1], 100 * R[-1], f"k = {k}", c[i], mode)
    for x0, lab in [(1.46, "silica"), (2.4, "GaN"), (3.5, "Si")]:
        ax.axvline(x0, color=S.GRID[mode], lw=0.8, ls=":")
        S.note(ax, x0 + 0.02, 4, lab, mode, size=8.5)
    ax.set_xlabel("refractive index  n")
    ax.set_ylabel("normal-incidence reflectance  (%)")
    ax.set_title("High index means bright facets: a third of the light bounces off bare silicon")
    ax.set_ylim(0, 78)
    S.strip(ax)
    return fig


@figure("m19-tauc-plots")
def _(mode):
    """Extracting gaps: direct (alpha^2 linear) and indirect (sqrt(alpha)
    linear) plotted the way the analysis is actually done."""
    c = S.SERIES[mode]
    E = np.linspace(1.0, 2.0, 400)
    Egd, Egi = 1.42, 1.12
    a_dir = np.where(E > Egd, 8e3 * np.sqrt(np.clip(E - Egd, 0, None)), 0)
    a_ind = np.where(E > Egi, 3.5e3 * np.clip(E - Egi, 0, None) ** 2, 0)
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.2, 3.6))
    fig.skip_tight = True
    fig.subplots_adjust(wspace=0.28, left=0.09, right=0.97, bottom=0.16, top=0.86)
    a1.plot(E, (a_dir**2) / 1e7, color=c[0], lw=2.1)
    a1.axvline(Egd, color=S.GUIDE[mode], lw=1.0, ls=":")
    a1.set_xlabel("photon energy (eV)")
    a1.set_ylabel(r"$\alpha^{2}$  (10$^{7}$ cm$^{-2}$)")
    a1.set_title("direct: extrapolate $\\alpha^{2}$", color=c[0], fontsize=11)
    S.note(a1, Egd + 0.02, 0.4, r"$E_g$", mode)
    a2.plot(E, np.sqrt(a_ind), color=c[1], lw=2.1)
    a2.axvline(Egi, color=S.GUIDE[mode], lw=1.0, ls=":")
    a2.set_xlabel("photon energy (eV)")
    a2.set_ylabel(r"$\sqrt{\alpha}$  (cm$^{-1/2}$)")
    a2.set_title("indirect: extrapolate $\\sqrt{\\alpha}$", color=c[1], fontsize=11)
    S.note(a2, Egi + 0.02, 8, r"$E_g$", mode)
    for ax in (a1, a2):
        S.strip(ax)
    return fig


@figure("m19-urbach-tail")
def _(mode):
    """Absorption edge with an exponential Urbach tail on semilog axes."""
    c = S.SERIES[mode]
    E = np.linspace(1.3, 2.1, 500)
    Eg, Eu_a, Eu_b = 1.75, 0.050, 0.100
    fig, ax = plt.subplots()
    for i, (Eu, lab) in enumerate([(Eu_a, "device-grade: $E_U$ = 50 meV"),
                                   (Eu_b, "poor network: $E_U$ = 100 meV")]):
        alpha = np.where(E < Eg, 5e3 * np.exp((E - Eg) / Eu),
                         5e3 * (1 + 8 * np.sqrt(np.clip(E - Eg, 0, None))))
        ax.semilogy(E, alpha, color=c[i], lw=2.1)
        S.label_end(ax, E[-1], alpha[-1], lab, c[i], mode, dy=6 - 12 * i)
    ax.axvline(Eg, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, Eg + 0.01, 3, "band edge", mode)
    S.note(ax, 1.34, 30, "the tail slope on this axis\nIS the disorder measurement", mode)
    ax.set_xlabel("photon energy  (eV)")
    ax.set_ylabel(r"$\alpha$  (cm$^{-1}$)")
    ax.set_title(r"$\alpha\propto e^{(E-E_g)/E_U}$: straight below the edge on semilog")
    ax.set_ylim(1, 3e4)
    S.strip(ax)
    return fig


@figure("m19-free-carrier")
def _(mode):
    """Free-carrier absorption rising as lambda^2 for three dopings."""
    c = S.SERIES[mode]
    lam = np.linspace(1, 12, 400)  # micrometres
    fig, ax = plt.subplots()
    for i, (n0, lab) in enumerate([(1e18, r"$10^{18}$"), (1e19, r"$10^{19}$"),
                                   (1e20, r"$10^{20}\ {\rm cm^{-3}}$")]):
        alpha = 2e-19 * n0 * lam**2
        ax.loglog(lam, alpha, color=c[i], lw=2.1)
        S.label_end(ax, lam[-1], alpha[-1], lab, c[i], mode)
    ax.set_xlabel(r"wavelength  ($\mu$m)")
    ax.set_ylabel(r"free-carrier $\alpha$  (cm$^{-1}$)")
    ax.set_title(r"$\alpha_{fc}\propto n\,\lambda^{2}$: doped layers go opaque in the infrared")
    S.note(ax, 1.1, 3e2, "the same Drude tail as module 18's\nAC conductivity, read optically", mode)
    S.strip(ax)
    return fig


@figure("m19-interference-fringes")
def _(mode):
    """Transmission of a thin film on glass: fringes carry the thickness."""
    c = S.SERIES[mode]
    lam = np.linspace(0.5, 2.0, 1200)  # micrometres
    n_f, d = 2.0, 1.0  # index, thickness in micrometres
    phase = 4 * np.pi * n_f * d / lam
    R1 = ((n_f - 1) / (n_f + 1)) ** 2
    T = (1 - R1) ** 2 / (1 + R1**2 - 2 * R1 * np.cos(phase))
    absline = np.where(lam < 0.62, np.exp(-8 * (0.62 - lam) / 0.12), 1.0)
    fig, ax = plt.subplots()
    ax.plot(lam, 100 * T * absline, color=c[0], lw=1.9)
    S.label_end(ax, lam[-1], 100 * (T * absline)[-1], "film on glass", c[0], mode)
    S.note(ax, 1.25, 66,
           r"fringe spacing $\Rightarrow$ $n_fd$;"
           "\nenvelope $\\Rightarrow$ absorption;"
           "\nedge $\\Rightarrow$ gap", mode)
    ax.set_xlabel(r"wavelength  ($\mu$m)")
    ax.set_ylabel("transmittance  (%)")
    ax.set_title("One spectrum, three measurements: the workhorse film characterisation")
    ax.set_ylim(0, 108)
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
    print(
        "\n  NOTE: apps/web/public is BAKED INTO the web image. New figures 404\n"
        "  in the running app until the image is rebuilt, and a restart is not\n"
        "  enough. After generating figures, run:\n"
        "      docker compose build web && docker compose up -d --force-recreate web"
    )


if __name__ == "__main__":
    main()
