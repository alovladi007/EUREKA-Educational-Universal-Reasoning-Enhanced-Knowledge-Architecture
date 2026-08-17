#!/usr/bin/env python3
"""Depth-wave-26 figures for the FE Electrical and Computer course: the two
Properties-of-Electrical-Materials chapters on dielectrics (fee_dielectrics)
and on magnetic materials (fee_magnetic_mat).

Same contract as the other gen_fe_ee_* generators, and it imports the SAME
style module rather than growing a second look. Every curve here is COMPUTED,
in this file, from a closed form that the lesson referencing it writes out in
full; nothing is traced, scanned, redrawn or adapted from the NCEES Reference
Handbook, from a manufacturer's datasheet plot, or from any textbook figure.
Curves in the reference works are protected expression; the equations behind
them are not, and this pipeline only ever consumes equations.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Every number the lesson quotes from a figure is asserted here, and wherever a
second legitimate route exists the assertion is written twice over: the Debye
permittivity against the Cole-Cole circle identity, the Rayleigh loop area
against a trapezoidal contour integral of H dB, the classical eddy-loss formula
against the exact 1-D skin-effect solution, the gap energy split against the
reluctance ratio, the layered-capacitor fields against the series-capacitance
route. A formula that agrees with its own algebra but not with an independent
construction is wrong in the way that matters to a student with a calculator.

Prefix ownership: this generator writes ONLY names beginning "mat3-".

Usage:
    python3 eureka/scripts/gen_fe_ee_d26.py            # all
    python3 eureka/scripts/gen_fe_ee_d26.py mat3-cole  # only names with prefix
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

PREFIX = "mat3-"
REGISTRY: dict[str, callable] = {}

# ---------------------------------------------------------------- constants
# Named, with units and the thing they belong to. Nothing else enters a curve.
EPS0 = 8.8541878128e-12      # F/m, CODATA electric constant
MU0 = 4.0 * np.pi * 1e-7     # H/m, magnetic constant (exact by this definition)
MU_B = 9.2740100783e-24      # J/T, Bohr magneton
N_A = 6.02214076e23          # 1/mol, Avogadro constant (exact)


def figure(name):
    if not name.startswith(PREFIX):
        raise ValueError(f"this generator owns only the {PREFIX!r} prefix: {name}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# --------------------------------------------------------------- primitives
def debye(f, eps_s, eps_inf, tau):
    """Debye relaxation: eps* = eps_inf + (eps_s - eps_inf)/(1 + j w tau)."""
    w = 2.0 * np.pi * np.asarray(f, dtype=float)
    x = w * tau
    d = eps_s - eps_inf
    return eps_inf + d / (1.0 + x * x), d * x / (1.0 + x * x)


def lorentz(f, d_eps, f0, damp):
    """Lorentz oscillator: eps* = 1 + d_eps w0^2/(w0^2 - w^2 + j g w), the
    contribution above unity only (the caller sums contributions)."""
    w = 2.0 * np.pi * np.asarray(f, dtype=float)
    w0 = 2.0 * np.pi * f0
    g = damp * w0
    den = (w0 * w0 - w * w) ** 2 + (g * w) ** 2
    return d_eps * w0 * w0 * (w0 * w0 - w * w) / den, d_eps * w0 * w0 * g * w / den


TRAPZ = getattr(np, "trapezoid", None) or np.trapz


def rayleigh_branches(H, mu_i, nu, H0):
    """Rayleigh minor loop, both branches, for drive amplitude H0.

    Initial curve  B = mu0 (mu_i H + nu H^2).
    Descending     B = mu0[(mu_i + nu H0) H + (nu/2)(H0^2 - H^2)]
    Ascending      B = mu0[(mu_i + nu H0) H - (nu/2)(H0^2 - H^2)]
    """
    lin = (mu_i + nu * H0) * H
    bow = 0.5 * nu * (H0 * H0 - H * H)
    return MU0 * (lin + bow), MU0 * (lin - bow)


def eddy_classical(f, Bm, t, rho):
    """Classical thin-lamination eddy loss density, W/m^3:
    P = pi^2 f^2 Bm^2 t^2 / (6 rho)."""
    return np.pi ** 2 * f ** 2 * Bm ** 2 * t ** 2 / (6.0 * rho)


def skin_depth(f, rho, mu_r):
    return np.sqrt(rho / (np.pi * f * MU0 * mu_r))


def eddy_factor(xi):
    """Exact/classical eddy-loss ratio for a lamination of thickness t = xi*delta:
    F = (3/xi)(sinh xi - sin xi)/(cosh xi - cos xi).  F -> 1 as xi -> 0."""
    xi = np.asarray(xi, dtype=float)
    return (3.0 / xi) * (np.sinh(xi) - np.sin(xi)) / (np.cosh(xi) - np.cos(xi))


def weiss_m(t_red, iters=200):
    """Mean-field (spin-1/2 Weiss) reduced magnetisation: solve m = tanh(m/t).

    Bisection, not fixed-point iteration: near T = Tc the map m -> tanh(m/t) has
    a derivative approaching 1 and converges far too slowly to assert on.
    """
    t_red = np.asarray(t_red, dtype=float)
    lo = np.full(t_red.shape, 1e-15)
    hi = np.ones_like(t_red)
    for _ in range(iters):
        mid = 0.5 * (lo + hi)
        f = np.tanh(np.divide(mid, t_red, out=np.full_like(mid, np.inf),
                              where=t_red > 0)) - mid
        lo = np.where(f > 0.0, mid, lo)
        hi = np.where(f > 0.0, hi, mid)
    return np.where(t_red < 1.0, 0.5 * (lo + hi), 0.0)


def bh_model(H, mu_i_rel, Bs, H0):
    """Normal (anhysteretic) magnetisation curve used for the permeability
    definitions figure:

        B(H) = mu0 mu_i H + Bs (H/H0)^2 / (1 + (H/H0)^2)

    Finite initial slope mu_i, a genuine inflection above H = 0 (so the maximum
    DIFFERENTIAL permeability exceeds the initial permeability, which is the
    whole point of keeping the definitions apart), and Bs as the ceiling.
    """
    x = np.asarray(H, dtype=float) / H0
    return MU0 * mu_i_rel * np.asarray(H, dtype=float) + Bs * x * x / (1.0 + x * x)


def bh_differential(H, mu_i_rel, Bs, H0):
    """Relative differential permeability (1/mu0) dB/dH of bh_model."""
    x = np.asarray(H, dtype=float) / H0
    return mu_i_rel + (Bs / (MU0 * H0)) * 2.0 * x / (1.0 + x * x) ** 2


def bh_amplitude(H, mu_i_rel, Bs, H0):
    """Relative amplitude permeability B/(mu0 H) of bh_model."""
    x = np.asarray(H, dtype=float) / H0
    return mu_i_rel + (Bs / (MU0 * H0)) * x / (1.0 + x * x)


def paschen(pd, A, B, gamma):
    """Paschen breakdown voltage, V, for pd in Torr*cm with A in 1/(cm Torr)
    and B in V/(cm Torr):  V = B pd / [ln(A pd) - ln ln(1 + 1/gamma)]."""
    pd = np.asarray(pd, dtype=float)
    return B * pd / (np.log(A * pd) - np.log(np.log(1.0 + 1.0 / gamma)))


# ===========================================================================
# fee_dielectrics
# ===========================================================================

# Model spectrum used by mat3-polar-dispersion. These are DECLARED MODEL
# PARAMETERS chosen to put each mechanism in its textbook frequency decade -
# they are not a measurement of any particular material, and the lesson says so.
DISP = {
    "interfacial": dict(d=180.0, f=3.0e2),
    "orientational": dict(d=45.0, f=2.0e9),
    "ionic": dict(d=5.0, f0=8.0e12, damp=0.35),
    "electronic": dict(d=2.4, f0=2.0e15, damp=0.12),
}


def dispersion(f):
    """Total eps'(f) and eps''(f) of the four-mechanism model spectrum."""
    f = np.asarray(f, dtype=float)
    re = np.ones_like(f)
    im = np.zeros_like(f)
    for key in ("interfacial", "orientational"):
        p = DISP[key]
        tau = 1.0 / (2.0 * np.pi * p["f"])
        r, i = debye(f, 1.0 + p["d"], 1.0, tau)
        re += r - 1.0
        im += i
    for key in ("ionic", "electronic"):
        p = DISP[key]
        r, i = lorentz(f, p["d"], p["f0"], p["damp"])
        re += r
        im += i
    return re, im


@figure("mat3-polar-dispersion")
def _(mode):
    """Four polarisation mechanisms switching off in turn as frequency rises."""
    c = S.SERIES[mode]
    f = np.logspace(0.0, 17.0, 3401)
    re, im = dispersion(f)

    total = 1.0 + sum(DISP[k]["d"] for k in DISP)
    assert abs(total - 233.4) < 1e-12, total
    lo_re, lo_im = dispersion(np.array([1.0]))
    assert abs(lo_re[0] - total) < 2e-3, lo_re[0]
    assert lo_im[0] < 1.0, lo_im[0]
    hi_re, _ = dispersion(np.array([1e17]))
    assert abs(hi_re[0] - 1.0) < 2e-3, hi_re[0]
    # after the two relaxations have dropped out, only the two oscillators are
    # left: eps' should sit near 1 + 5 + 2.4 = 8.4 in the far infrared
    mid_re, _ = dispersion(np.array([1e11]))
    assert abs(mid_re[0] - 8.4) < 0.05, mid_re[0]
    # and after the ionic resonance only the electronic term survives: the
    # optical permittivity, whose square root is the refractive index
    opt_re, _ = dispersion(np.array([1e14]))
    assert abs(opt_re[0] - 3.4) < 0.25, opt_re[0]
    assert abs(np.sqrt(3.4) - 1.8439) < 5e-5, np.sqrt(3.4)
    # an isolated Debye peaks at eps'' = d/2 exactly at its relaxation frequency
    _, peak = debye(2.0e9, 46.0, 1.0, 1.0 / (2.0 * np.pi * 2.0e9))
    assert abs(peak - 22.5) < 1e-9, peak

    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.6))
    ax1.semilogx(f, re, color=c[0], lw=2.2)
    ax2.loglog(f, np.maximum(im, 1e-4), color=c[1], lw=2.2)
    for ax in (ax1, ax2):
        for fr, tag in ((3.0e2, "interfacial"), (2.0e9, "orientational"),
                        (8.0e12, "ionic"), (2.0e15, "electronic")):
            ax.axvline(fr, color=S.GUIDE[mode], lw=0.9, ls="--")
    for fr, tag in ((3.0e2, "interfacial"), (2.0e9, "orientational"),
                    (8.0e12, "ionic"), (2.0e15, "electronic")):
        ax1.annotate(tag, xy=(fr, 248.0), color=S.INK_2[mode], fontsize=8.5,
                     rotation=90, ha="right", va="top")
    S.label_end(ax1, 1.5, 110.0, "eps' = 233.4 at\nlow frequency", c[0], mode, dy=0)
    S.note(ax1, 3.0e9, 62.0, "only the two oscillators left here: eps' = 8.4\n"
                             "past the last resonance, eps' -> 1", mode)
    S.label_end(ax2, 1.0e4, 260.0, "each step down in eps'\nis a peak in eps''",
                c[1], mode, dx=0, dy=0)
    ax1.set_ylabel("real permittivity  eps'")
    ax2.set_ylabel("loss  eps''")
    ax2.set_xlabel("frequency  f  (Hz)")
    ax1.set_title("Dielectric dispersion: mechanisms drop out one decade band at a time")
    ax1.set_ylim(0, 262)
    ax2.set_ylim(1e-2, 1e3)
    S.strip(ax1)
    S.strip(ax2)
    fig.subplots_adjust(hspace=0.12)
    return fig


@figure("mat3-cole-cole-water")
def _(mode):
    """Cole-Cole locus of a single Debye relaxation, drawn for liquid water."""
    c = S.SERIES[mode]
    eps_s, eps_inf, tau = 80.1, 5.6, 9.4e-12   # water at 20 C, tabulated
    f = np.logspace(7.0, 13.0, 4001)
    re, im = debye(f, eps_s, eps_inf, tau)

    centre = 0.5 * (eps_s + eps_inf)
    radius = 0.5 * (eps_s - eps_inf)
    assert abs(centre - 42.85) < 1e-12, centre
    assert abs(radius - 37.25) < 1e-12, radius
    # INDEPENDENT ROUTE: every Debye point must lie on that circle exactly
    resid = (re - centre) ** 2 + im ** 2 - radius ** 2
    assert np.max(np.abs(resid)) < 1e-9, np.max(np.abs(resid))

    f_rel = 1.0 / (2.0 * np.pi * tau)
    assert abs(f_rel - 1.6931377e10) < 1e4, f_rel
    r_rel, i_rel = debye(f_rel, eps_s, eps_inf, tau)
    assert abs(r_rel - centre) < 1e-9, r_rel      # apex sits above the centre
    assert abs(i_rel - radius) < 1e-9, i_rel      # apex height is the radius

    r24, i24 = debye(2.45e9, eps_s, eps_inf, tau)
    assert abs(r24 - 78.57207) < 5e-5, r24
    assert abs(i24 - 10.55919) < 5e-5, i24
    assert abs(i24 / r24 - 0.1343886) < 5e-7, i24 / r24

    fig, ax = plt.subplots()
    ax.plot(re, im, color=c[0], lw=2.4)
    ax.plot([r_rel], [i_rel], "o", color=S.INK[mode], ms=7, zorder=5)
    ax.plot([r24], [i24], "o", color=S.INK[mode], ms=7, zorder=5)
    ax.plot([eps_inf, eps_s], [0, 0], "o", color=S.GUIDE[mode], ms=6, zorder=4)
    S.note(ax, 20.0, 22.0, "apex at f = 1/(2 pi tau) = 16.9 GHz\n"
                           "eps'' = (eps_s - eps_inf)/2 = 37.25", mode)
    S.note(ax, 72.0, 18.0, "2.45 GHz oven band:\neps' = 78.6, eps'' = 10.6", mode,
           ha="right")
    S.note(ax, eps_inf + 0.6, 1.5, "eps_inf = 5.6", mode)
    S.note(ax, eps_s - 0.6, 1.5, "eps_s = 80.1", mode, ha="right")
    ax.set_xlabel("real permittivity  eps'")
    ax.set_ylabel("loss  eps''")
    ax.set_title("Cole-Cole plot: one relaxation time draws exactly a semicircle")
    ax.set_xlim(0, 90)
    ax.set_ylim(0, 46)
    ax.set_aspect("equal", adjustable="box")
    S.strip(ax)
    return fig


@figure("mat3-layer-field")
def _(mode):
    """Field, flux density and potential across a series air/glass stack."""
    c = S.SERIES[mode]
    d1, er1 = 1.0e-3, 1.0            # air gap
    d2, er2 = 4.0e-3, 4.0            # glass slab
    V = 1.0e4

    # Route 1: D continuous, voltages add.
    D = V / (d1 / (EPS0 * er1) + d2 / (EPS0 * er2))
    E1, E2 = D / (EPS0 * er1), D / (EPS0 * er2)
    assert abs(E1 - 5.0e6) < 1.0, E1
    assert abs(E2 - 1.25e6) < 1.0, E2
    assert abs(E1 * d1 + E2 * d2 - V) < 1e-6
    # Route 2: series capacitance of two unit-area slabs, then Q/A = D
    A = 1.0
    C1, C2 = EPS0 * er1 * A / d1, EPS0 * er2 * A / d2
    Cs = C1 * C2 / (C1 + C2)
    assert abs(Cs * V / A - D) < 1e-15, (Cs * V / A, D)
    # Route 3: energy. (1/2)C V^2 must equal the volume integral of (1/2)D.E
    U_lumped = 0.5 * Cs * V * V
    U_field = 0.5 * D * E1 * d1 * A + 0.5 * D * E2 * d2 * A
    assert abs(U_lumped - U_field) < 1e-12 * U_lumped, (U_lumped, U_field)
    assert abs(D - 4.42709e-5) < 5e-10, D
    # a uniform 5 mm of glass would carry this instead
    assert abs(V / (d1 + d2) - 2.0e6) < 1e-9

    x = np.linspace(0.0, (d1 + d2) * 1e3, 2001)          # mm
    E = np.where(x <= d1 * 1e3, E1, E2) / 1e6            # MV/m
    Dp = np.full_like(x, D * 1e6)                        # micro-C/m^2
    Vx = np.where(x <= d1 * 1e3, E1 * x * 1e-3,
                  E1 * d1 + E2 * (x * 1e-3 - d1)) / 1e3  # kV

    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.6))
    ax1.plot(x, E, color=c[0], lw=2.3)
    ax1.plot(x, Dp / 10.0, color=c[1], lw=2.3, ls="--")
    ax2.plot(x, Vx, color=c[2], lw=2.3)
    for ax in (ax1, ax2):
        ax.axvline(d1 * 1e3, color=S.GUIDE[mode], lw=1.1)
    S.label_end(ax1, 4.9, 1.25, "E jumps down 4x", c[0], mode, dx=-4, dy=12, ha="right")
    S.label_end(ax1, 3.4, Dp[0] / 10.0, "D is continuous", c[1], mode,
                dx=-4, dy=10, ha="right")
    S.note(ax1, 0.06, 5.35, "air, eps_r = 1", mode)
    S.note(ax1, 1.15, 5.35, "the air stands 5 MV/m, above its own 3 MV/m\n"
                            "strength; the glass loafs at 1.25 MV/m", mode)
    S.note(ax2, 1.15, 1.2, "the low-permittivity layer\nswallows half the voltage\n"
                           "in a fifth of the thickness", mode)
    ax1.set_ylabel("E (MV/m),  D/10 (uC/m^2)")
    ax2.set_ylabel("potential (kV)")
    ax2.set_xlabel("position across the stack  (mm)")
    ax1.set_title("Series dielectrics: D continuous, E inversely proportional to eps_r")
    ax1.set_ylim(0, 6.4)
    ax2.set_ylim(0, 11)
    S.strip(ax1)
    S.strip(ax2)
    fig.subplots_adjust(hspace=0.12)
    return fig


@figure("mat3-stack-stress-ratio")
def _(mode):
    """How the field split in a two-layer stack moves with the permittivity ratio."""
    c = S.SERIES[mode]
    d1 = d2 = 1.0                      # equal thicknesses, so only eps_r matters
    k = np.logspace(-1.0, 2.0, 601)    # k = eps_r2 / eps_r1
    Eavg = 1.0
    # D continuous: E1/E2 = k. Voltages add: E1 d1 + E2 d2 = Eavg (d1 + d2)
    E1 = Eavg * (d1 + d2) * k / (k * d1 + d2)
    E2 = E1 / k

    assert abs(np.interp(1.0, k, E1) - 1.0) < 1e-9
    i10 = int(np.argmin(np.abs(k - 10.0)))
    assert abs(k[i10] - 10.0) < 0.02, k[i10]
    assert abs(E1[i10] - 20.0 / 11.0) < 5e-3, E1[i10]
    assert abs(E2[i10] - 2.0 / 11.0) < 5e-4, E2[i10]
    # ceiling: as k -> infinity layer 1 carries the whole voltage over its own
    # thickness, i.e. twice the average field for equal thicknesses
    assert abs(E1[-1] - 2.0) < 2e-2, E1[-1]
    # the worked air/glass case, now with unequal thicknesses, must reappear
    da, dg, kk = 1.0e-3, 4.0e-3, 4.0
    Ea = 1.0e4 * kk / (kk * da + dg)
    assert abs(Ea - 5.0e6) < 1.0, Ea

    fig, ax = plt.subplots()
    ax.semilogx(k, E1, color=c[0], lw=2.3)
    ax.semilogx(k, E2, color=c[1], lw=2.3)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.axvline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.label_end(ax, 100.0, E1[-1], "low-eps_r layer", c[0], mode, dx=-6, dy=-12, ha="right")
    S.label_end(ax, 100.0, E2[-1], "high-eps_r layer", c[1], mode, dx=-6, dy=12, ha="right")
    S.note(ax, 1.15, 1.06, "equal permittivities:\nboth layers at the average field", mode)
    S.note(ax, 100.0, 1.58, "ratio 10 puts 1.82x the average\nfield on the weak layer",
           mode, ha="right")
    ax.set_xlabel("permittivity ratio  k = eps_r2 / eps_r1  (equal thicknesses)")
    ax.set_ylabel("layer field / average field")
    ax.set_title("Series dielectrics divide stress INVERSELY to permittivity")
    ax.set_ylim(0, 2.25)
    S.strip(ax)
    return fig


@figure("mat3-paschen-air")
def _(mode):
    """Paschen curve for air from stated Townsend constants."""
    c = S.SERIES[mode]
    A, B, gam = 15.0, 365.0, 0.01      # 1/(cm Torr), V/(cm Torr), dimensionless
    lg = np.log(np.log(1.0 + 1.0 / gam))
    pd_asym = np.exp(lg) / A
    assert abs(pd_asym - 0.307675) < 5e-6, pd_asym

    pd = np.logspace(np.log10(pd_asym * 1.15), np.log10(12.0), 1200)
    V = paschen(pd, A, B, gam)

    # closed-form minimum, checked against a numerical minimum of the same curve
    pd_min = np.e * np.log(1.0 + 1.0 / gam) / A
    V_min = np.e * B * np.log(1.0 + 1.0 / gam) / A
    assert abs(pd_min - 0.836347) < 5e-6, pd_min
    assert abs(V_min - 305.266) < 5e-3, V_min
    j = int(np.argmin(V))
    assert abs(pd[j] - pd_min) / pd_min < 5e-3, (pd[j], pd_min)
    assert abs(V[j] - V_min) < 0.05, (V[j], V_min)
    # at the minimum the reduced field equals B exactly - an independent identity
    assert abs(V_min / pd_min - B) < 1e-9, V_min / pd_min
    # quoted points on the curve
    assert abs(paschen(1.0, A, B, gam) - 309.660) < 5e-3, paschen(1.0, A, B, gam)
    assert abs(paschen(5.0, A, B, gam) - 654.556) < 5e-3, paschen(5.0, A, B, gam)
    assert abs(paschen(10.0, A, B, gam) - 1048.460) < 5e-3

    fig, ax = plt.subplots()
    ax.loglog(pd, V, color=c[0], lw=2.4)
    ax.plot([pd_min], [V_min], "o", color=S.INK[mode], ms=7, zorder=5)
    ok = (V / pd >= 100.0) & (V / pd <= 800.0)
    ax.fill_between(pd[ok], 100.0, V[ok], color=c[2], alpha=0.14, lw=0)
    S.note(ax, 0.42, 128.0,
           "minimum 305 V at pd = 0.836 Torr cm\n(from these A, B and gamma)", mode)
    S.note(ax, 0.9, 1.4e3, "shaded: reduced field E/p inside the\n"
                           "100-800 V/(cm Torr) fit range of A and B", mode)
    S.note(ax, pd_asym * 1.02, 3.0e3, "no breakdown\nbelow pd = 0.308\nTorr cm", mode)
    ax.axvline(pd_asym, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.set_xlabel("pressure times gap,  pd  (Torr cm)")
    ax.set_ylabel("breakdown voltage  V_b  (V)")
    ax.set_title("Paschen's law: a gap can be too small to break down")
    ax.set_ylim(100, 1.0e4)
    S.strip(ax)
    return fig


@figure("mat3-esr-frequency")
def _(mode):
    """ESR and ripple heating against frequency for a stated capacitor."""
    c = S.SERIES[mode]
    C, tand, Rs, Irms = 100e-9, 0.025, 0.020, 0.5

    f = np.logspace(3.0, 8.0, 1201)
    w = 2.0 * np.pi * f
    esr_d = tand / (w * C)
    esr = esr_d + Rs
    P = Irms ** 2 * esr

    at = 1.0e5
    wc = 2.0 * np.pi * at * C
    assert abs(wc - 0.0628319) < 5e-7, wc
    assert abs(tand / wc - 0.397887) < 5e-6, tand / wc
    assert abs(Irms ** 2 * (tand / wc) - 0.0994718) < 5e-7
    # INDEPENDENT ROUTE: the same loss from the parallel (voltage-driven) model.
    # At the same operating point V = I/(wC) across an ideal C, and
    # P = V^2 w C tan d must reproduce I^2 * ESR exactly.
    Vc = Irms / wc
    assert abs(Vc * Vc * wc * tand - Irms ** 2 * (tand / wc)) < 1e-15
    # crossover where the metal work equals the dielectric term
    f_x = tand / (2.0 * np.pi * C * Rs)
    assert abs(f_x - 1.98944e6) < 5e1, f_x
    assert abs(tand / (2.0 * np.pi * f_x * C) - Rs) < 1e-12

    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.6))
    ax1.loglog(f, esr_d, color=c[0], lw=2.2)
    ax1.loglog(f, esr, color=c[1], lw=2.2, ls="--")
    ax2.loglog(f, P, color=c[2], lw=2.2)
    for ax in (ax1, ax2):
        ax.axvline(f_x, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.label_end(ax1, 1.2e3, 0.45, "dielectric term\ntan d/(wC)", c[0], mode, dx=0, dy=0)
    S.label_end(ax1, 1e8, 0.15, "plus 20 mOhm of metal", c[1], mode, dx=-6,
                ha="right")
    S.note(ax1, f_x * 1.2, 3.0, "the two are equal at 1.99 MHz", mode)
    S.note(ax2, 1.4e3, 0.018, "0.5 A rms of ripple:\n0.099 W at 100 kHz", mode)
    ax1.plot([at], [tand / wc], "o", color=S.INK[mode], ms=7, zorder=5)
    ax2.plot([at], [Irms ** 2 * tand / wc], "o", color=S.INK[mode], ms=7, zorder=5)
    ax1.set_ylabel("ESR  (Ohm)")
    ax2.set_ylabel("ripple heating  (W)")
    ax2.set_xlabel("frequency  f  (Hz)")
    ax1.set_title("100 nF at tan d = 0.025: where the loss stops being dielectric")
    S.strip(ax1)
    S.strip(ax2)
    fig.subplots_adjust(hspace=0.12)
    return fig


@figure("mat3-breakdown-thickness")
def _(mode):
    """Breakdown FIELD falls with thickness while breakdown VOLTAGE still rises."""
    c = S.SERIES[mode]
    E_ref, d_ref, n = 200.0, 10.0e-6, 0.35      # MV/m at 10 um, stated exponent
    d = np.logspace(-6.0, -2.0, 801)
    E = E_ref * (d / d_ref) ** (-n)
    V = E * 1e6 * d

    assert abs(E_ref * (1.0e-3 / d_ref) ** (-n) - 39.9052) < 5e-4
    assert abs(10.0 ** (-0.7) - 0.1995262) < 1e-7
    # doubling the thickness buys only 2^(1-n) in withstand voltage
    assert abs(2.0 ** (1.0 - n) - 1.56917) < 5e-5, 2.0 ** (1.0 - n)
    v_at = lambda dd: E_ref * (dd / d_ref) ** (-n) * 1e6 * dd
    assert abs(v_at(2.0e-5) / v_at(1.0e-5) - 2.0 ** (1.0 - n)) < 1e-12
    assert abs(v_at(1.0e-5) - 2000.0) < 1e-9, v_at(1.0e-5)
    assert abs(v_at(1.0e-3) - 39905.2) < 5e-1, v_at(1.0e-3)
    # a thousandfold thickness increase multiplies withstand by only 10^1.95
    assert abs(v_at(1.0e-2) / v_at(1.0e-5) - 1000.0 ** (1.0 - n)) < 1e-9
    assert abs(1000.0 ** (1.0 - n) - 89.1251) < 5e-4, 1000.0 ** (1.0 - n)

    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.6))
    ax1.loglog(d * 1e6, E, color=c[0], lw=2.3)
    ax2.loglog(d * 1e6, V / 1e3, color=c[1], lw=2.3)
    for ax in (ax1, ax2):
        ax.axvline(10.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax1.plot([10.0], [E_ref], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax1, 12.0, 240.0, "anchor: 200 MV/m at 10 um", mode)
    S.note(ax1, 55.0, 175.0, "1 mm of the same polymer: 39.9 MV/m,\n"
                             "a fifth of the thin-film number", mode)
    S.note(ax2, 1.2, 20.0, "voltage still rises with thickness,\n"
                           "but as d^0.65 - doubling d buys 1.57x", mode)
    ax1.set_ylabel("breakdown field  E_bd  (MV/m)")
    ax2.set_ylabel("withstand voltage  (kV)")
    ax2.set_xlabel("dielectric thickness  d  (micrometres)")
    ax1.set_title("Thin is strong: the size effect in dielectric breakdown")
    S.strip(ax1)
    S.strip(ax2)
    fig.subplots_adjust(hspace=0.12)
    return fig


# ===========================================================================
# fee_magnetic_mat
# ===========================================================================

@figure("mat3-susceptibility-ladder")
def _(mode):
    """Volume susceptibility by class, on a logarithmic magnitude axis."""
    c = S.SERIES[mode]
    # Tabulated room-temperature SI volume susceptibilities. Values vary with
    # purity, temperature and (for the ferromagnets) with drive level; these
    # are representative handbook magnitudes, each named with its material.
    rows = [
        ("bismuth", -1.66e-4, "dia"),
        ("copper", -9.63e-6, "dia"),
        ("water", -9.05e-6, "dia"),
        ("aluminium", +2.2e-5, "para"),
        ("platinum", +2.79e-4, "para"),
        ("liquid oxygen", +3.5e-3, "para"),
        ("MnZn ferrite", +2.0e3, "ferri"),
        ("iron, commercial", +5.0e3, "ferro"),
        ("supermalloy", +1.0e6, "ferro"),
    ]
    names = [r[0] for r in rows]
    vals = np.array([r[1] for r in rows])
    kinds = [r[2] for r in rows]

    # mu_r = 1 + chi is the whole content of the classification
    assert abs((1.0 + vals[1]) - 0.99999037) < 1e-8, 1.0 + vals[1]
    assert abs((1.0 + vals[4]) - 1.000279) < 1e-9, 1.0 + vals[4]
    assert abs((1.0 + vals[7]) - 5001.0) < 1e-9
    # the diamagnetic-to-ferromagnetic span, in decades
    span = np.log10(abs(vals).max() / abs(vals).min())
    assert abs(span - 11.04335) < 5e-5, span
    assert abs(np.log10(5.0e3 / 2.79e-4) - 7.25337) < 5e-5

    colour = {"dia": c[0], "para": c[1], "ferri": c[2], "ferro": c[2]}
    y = np.arange(len(rows))
    fig, ax = plt.subplots(figsize=(7.2, 4.6))
    ax.barh(y, np.abs(vals), color=[colour[k] for k in kinds], height=0.62)
    ax.set_xscale("log")
    for i, (nm, v, k) in enumerate(rows):
        sign = "chi < 0" if v < 0 else "chi > 0"
        ax.annotate(f"{nm}   ({sign})", xy=(abs(v) * 1.35, i), va="center",
                    fontsize=9, color=S.INK_2[mode])
    ax.axvline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 1.3, len(rows) - 0.45, "chi = 1", mode)
    ax.set_yticks([])
    ax.set_xlabel("magnitude of volume susceptibility  |chi|  (dimensionless, SI)")
    ax.set_title("Eleven decades of |chi|, and only the sign separates dia from para")
    ax.set_xlim(1e-6, 1e10)
    S.strip(ax)
    ax.spines["left"].set_visible(False)
    return fig


@figure("mat3-permeability-defs")
def _(mode):
    """Initial, amplitude, maximum-differential and incremental permeability."""
    c = S.SERIES[mode]
    mu_i, Bs, H0 = 300.0, 1.5, 200.0
    H = np.linspace(0.0, 1400.0, 2801)
    B = bh_model(H, mu_i, Bs, H0)

    # differential permeability: closed form against a central difference
    mud = bh_differential(H, mu_i, Bs, H0)
    num = np.gradient(B, H) / MU0
    assert np.max(np.abs(mud[5:-5] - num[5:-5])) < 0.6, np.max(np.abs(mud - num))
    # amplitude permeability: closed form against B/(mu0 H)
    mua = bh_amplitude(H[1:], mu_i, Bs, H0)
    assert np.max(np.abs(mua - B[1:] / (MU0 * H[1:]))) < 1e-6

    assert abs(bh_differential(0.0, mu_i, Bs, H0) - mu_i) < 1e-12
    k = Bs / (MU0 * H0)
    assert abs(k - 5968.310) < 5e-3, k
    H_dmax = H0 / np.sqrt(3.0)
    mud_max = mu_i + k * (2.0 / np.sqrt(3.0)) / (1.0 + 1.0 / 3.0) ** 2
    assert abs(H_dmax - 115.470) < 5e-3, H_dmax
    assert abs(mud_max - 4176.531) < 5e-3, mud_max
    j = int(np.argmax(mud))
    assert abs(H[j] - H_dmax) < 1.0, (H[j], H_dmax)
    mua_max = mu_i + 0.5 * k
    assert abs(mua_max - 3284.155) < 5e-3, mua_max
    jj = int(np.argmax(bh_amplitude(H[1:], mu_i, Bs, H0)))
    assert abs(H[1:][jj] - H0) < 1.0, H[1:][jj]
    assert mud_max > mua_max > mu_i          # the whole reason for three names
    # incremental permeability at a 600 A/m dc bias
    mu_inc = bh_differential(600.0, mu_i, Bs, H0)
    assert abs(mu_inc - 658.0986) < 5e-4, mu_inc
    assert abs(mud_max / mu_inc - 6.34636) < 5e-5, mud_max / mu_inc
    assert abs(bh_model(200.0, mu_i, Bs, H0) - 0.8253982) < 5e-7
    assert abs(bh_model(600.0, mu_i, Bs, H0) - 1.5761947) < 5e-7

    fig, ax = plt.subplots()
    ax.plot(H, B, color=c[0], lw=2.4)
    hh = np.linspace(0, 620, 50)
    ax.plot(hh, MU0 * mu_i * hh, color=S.GUIDE[mode], lw=1.4, ls="--")
    Bd = bh_model(H_dmax, mu_i, Bs, H0)
    hs = np.linspace(20.0, 300.0, 50)
    ax.plot(hs, Bd + MU0 * mud_max * (hs - H_dmax), color=c[1], lw=1.6)
    ha = np.linspace(0, 250, 50)
    ax.plot(ha, MU0 * mua_max * ha, color=c[2], lw=1.6, ls=":")
    hb = np.linspace(470, 860, 50)
    Bb = bh_model(600.0, mu_i, Bs, H0)
    ax.plot(hb, Bb + MU0 * mu_inc * (hb - 600.0), color=c[1], lw=1.6, ls="-.")
    for xx in (H_dmax, H0, 600.0):
        ax.plot([xx], [bh_model(xx, mu_i, Bs, H0)], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 630, MU0 * mu_i * 620, "initial slope: mu_i = 300", mode, va="center")
    S.label_end(ax, 300.0, Bd + MU0 * mud_max * (300.0 - H_dmax),
                "max differential 4177\nat H = 115 A/m", c[1], mode,
                dx=-6, dy=16, ha="right")
    S.label_end(ax, 250, MU0 * mua_max * 250, "max amplitude 3284\nat H = 200 A/m",
                c[2], mode, dx=6, dy=-16)
    S.label_end(ax, 860, Bb + MU0 * mu_inc * 260.0,
                "incremental at a 600 A/m dc bias: 658\n- a sixth of the peak",
                c[1], mode, dx=-6, dy=16, ha="right")
    ax.axhline(Bs, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 1180, Bs + 0.04, "B_s = 1.5 T", mode)
    ax.set_xlabel("magnetic field strength  H  (A/m)")
    ax.set_ylabel("flux density  B  (T)")
    ax.set_title("Three permeabilities, one curve, three different numbers")
    ax.set_xlim(0, 1400)
    ax.set_ylim(0, 2.2)
    S.strip(ax)
    return fig


@figure("mat3-rayleigh-loop")
def _(mode):
    """A Rayleigh minor loop, its enclosed area, and the integral that names it."""
    c = S.SERIES[mode]
    mu_i, nu, H0 = 250.0, 25.0, 50.0
    H = np.linspace(-H0, H0, 4001)
    Bd, Ba = rayleigh_branches(H, mu_i, nu, H0)

    mu_a = mu_i + nu * H0
    B0 = MU0 * mu_a * H0
    assert abs(mu_a - 1500.0) < 1e-12
    assert abs(B0 - 0.09424778) < 5e-9, B0
    # CLOSED FORM: loop area = (4/3) mu0 nu H0^3
    W = (4.0 / 3.0) * MU0 * nu * H0 ** 3
    assert abs(W - 5.2359878) < 5e-7, W
    # INDEPENDENT ROUTE 1: area between the branches, integrated over H
    W_area = TRAPZ(Bd - Ba, H)
    assert abs(W_area - W) < 1e-6, (W_area, W)
    # INDEPENDENT ROUTE 2: the contour integral of H dB right round the loop
    Hc = np.concatenate([H, H[::-1]])
    Bc = np.concatenate([Ba, Bd[::-1]])
    # counter-clockwise in the (H, B) plane, so the contour integral of
    # H dB returns the enclosed area with a positive sign
    W_contour = TRAPZ(Hc, Bc)
    assert abs(W_contour - W) < 1e-5, (W_contour, W)
    # the loop is closed and centrosymmetric
    assert abs(Bd[0] - Ba[0]) < 1e-15 and abs(Bd[-1] - Ba[-1]) < 1e-15
    assert abs(Bd[0] + Bd[-1]) < 1e-15
    # Rayleigh coercivity: where the ascending branch crosses B = 0
    Hc_r = np.interp(0.0, Ba, H)
    Hc_cf = (mu_a / nu) * (np.sqrt(1.0 + nu * nu * H0 * H0 / mu_a ** 2) - 1.0)
    assert abs(Hc_r - Hc_cf) < 1e-3, (Hc_r, Hc_cf)
    assert abs(Hc_r - 18.10250) < 5e-4, Hc_r
    # power at 60 Hz in a 5e-4 m^3 core
    assert abs(W * 60.0 * 5.0e-4 - 0.157080) < 5e-6, W * 60.0 * 5.0e-4
    # Steinmetz exponent 3/2 hides inside Rayleigh's law: with mu_i negligible
    # B0 goes as H0^2 while the area goes as H0^3, so area goes as B0^1.5
    r = ((4.0 / 3.0) * MU0 * nu * (2 * H0) ** 3) / W
    assert abs(r - 8.0) < 1e-9, r

    fig, ax = plt.subplots()
    ax.fill_between(H, Ba, Bd, color=c[0], alpha=0.16, lw=0)
    ax.plot(H, Bd, color=c[0], lw=2.3)
    ax.plot(H, Ba, color=c[0], lw=2.3)
    Hi = np.linspace(0, H0, 400)
    ax.plot(Hi, MU0 * (mu_i * Hi + nu * Hi ** 2), color=c[1], lw=1.8, ls="--")
    ax.plot([Hc_r, -Hc_r], [0.0, 0.0], "o", color=S.INK[mode], ms=6, zorder=5)
    ax.axhline(0, color=S.GUIDE[mode], lw=0.9)
    ax.axvline(0, color=S.GUIDE[mode], lw=0.9)
    S.label_end(ax, 14.0, 0.048, "initial curve", c[1], mode, dx=0, dy=0, ha="center")
    S.note(ax, -57.0, 0.055, "initial curve  B = mu0(mu_i H + nu H^2)\n"
                             "shaded area = 5.236 J/m^3 per cycle = (4/3) mu0 nu H0^3,\n"
                             "and the same number from integrating H dB", mode)
    S.note(ax, 19.5, -0.012, "H_c = 18.1 A/m", mode)
    ax.set_xlabel("magnetic field strength  H  (A/m)")
    ax.set_ylabel("flux density  B  (T)")
    ax.set_title("Rayleigh loop: the area IS the energy, and it has a closed form")
    ax.set_xlim(-60, 60)
    ax.set_ylim(-0.115, 0.115)
    S.strip(ax)
    return fig


@figure("mat3-eddy-thickness")
def _(mode):
    """Eddy loss against lamination thickness, classical against exact."""
    c = S.SERIES[mode]
    rho, mu_r, f, Bm = 4.7e-7, 1000.0, 60.0, 1.5     # silicon steel, 60 Hz
    delta = skin_depth(f, rho, mu_r)
    assert abs(delta - 1.408619e-3) < 5e-9, delta

    t = np.logspace(-4.5, -1.3, 900)
    Pc = eddy_classical(f, Bm, t, rho)
    Pe = Pc * eddy_factor(t / delta)

    t0 = 0.35e-3
    assert abs(eddy_classical(f, Bm, t0, rho) - 3472.735) < 5e-3
    # exact/classical ratio at 0.35 mm: within six parts per million of 1
    assert abs(eddy_factor(t0 / delta) - 0.9999940) < 5e-7, eddy_factor(t0 / delta)
    # and the small-argument expansion F = 1 - xi^4/630 confirms that shape
    xi0 = t0 / delta
    assert abs(eddy_factor(xi0) - (1.0 - xi0 ** 4 / 630.0)) < 5e-9
    assert abs(eddy_classical(f, Bm, t0, rho) / 7650.0 - 0.453952) < 5e-6
    # halving the thickness quarters the classical loss, exactly
    assert abs(eddy_classical(f, Bm, t0 / 2, rho) / eddy_classical(f, Bm, t0, rho)
               - 0.25) < 1e-12
    # the two routes agree while t << delta and part company beyond
    thin = t < 0.3 * delta
    assert np.max(np.abs(Pe[thin] / Pc[thin] - 1.0)) < 0.01
    assert abs(eddy_factor(50.0e-3 / delta) - 0.0845171) < 5e-7
    solid = eddy_classical(f, Bm, 50.0e-3, rho)
    assert abs(solid / eddy_classical(f, Bm, t0, rho) - (50.0 / 0.35) ** 2) < 1e-6
    assert abs((50.0 / 0.35) ** 2 - 20408.16) < 5e-2
    assert abs(solid * eddy_factor(50.0e-3 / delta) - 5.98991e6) < 5e1
    assert abs(solid - 7.087216e7) < 5e1, solid
    assert abs(eddy_factor(5.0e-3 / delta) - 0.8198183) < 5e-7
    # thickness that meets a 1000 W/m^3 budget
    t_budget = np.sqrt(1000.0 * 6.0 * rho / (np.pi ** 2 * f ** 2 * Bm ** 2))
    assert abs(t_budget - 1.8781582e-4) < 5e-11, t_budget

    fig, ax = plt.subplots()
    ax.loglog(t * 1e3, Pc, color=c[0], lw=2.3)
    ax.loglog(t * 1e3, Pe, color=c[1], lw=2.3, ls="--")
    ax.axvline(delta * 1e3, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.plot([t0 * 1e3], [eddy_classical(f, Bm, t0, rho)], "o", color=S.INK[mode],
            ms=7, zorder=5)
    S.label_end(ax, 0.06, eddy_classical(f, Bm, 6e-5, rho), "classical  t^2 law",
                c[0], mode, dx=6, dy=16)
    S.label_end(ax, 40.0, Pe[-1], "exact, with skin effect", c[1], mode,
                dx=-6, dy=16, ha="right")
    S.note(ax, 0.42, 30.0, "0.35 mm sheet: 3473 W/m^3\n= 0.454 W/kg at 7650 kg/m^3", mode)
    S.note(ax, delta * 1e3 * 1.1, 0.6, "skin depth 1.41 mm - beyond here the\n"
                                       "t^2 law overstates the loss", mode)
    ax.set_xlabel("lamination thickness  t  (mm)")
    ax.set_ylabel("eddy-current loss density  (W/m^3)")
    ax.set_title("Why laminations are thin: eddy loss goes as thickness squared")
    ax.set_ylim(1e-1, 1e8)
    S.strip(ax)
    return fig


@figure("mat3-gap-energy-split")
def _(mode):
    """Where the stored energy sits, and what the gap does to permeability."""
    c = S.SERIES[mode]
    lc, mu_r = 0.2, 1500.0
    lg = np.logspace(-6.0, -2.0, 801)
    frac = lg / (lg + lc / mu_r)
    mu_e = mu_r / (1.0 + mu_r * lg / lc)

    l_eq = lc / mu_r
    assert abs(l_eq - 1.3333333e-4) < 1e-10, l_eq
    at = 1.0e-3
    assert abs(at / (at + l_eq) - 0.8823529) < 5e-8
    assert abs(mu_r / (1.0 + mu_r * at / lc) - 176.47059) < 5e-5
    # INDEPENDENT ROUTE: the energy fraction must equal the reluctance fraction,
    # because both regions carry the same flux and the same cross-section.
    A = 4.0e-4
    R_core = lc / (MU0 * mu_r * A)
    R_gap = at / (MU0 * A)
    assert abs(R_core - 2.6525824e5) < 5e-2, R_core
    assert abs(R_gap - 1.9894368e6) < 5e-1, R_gap
    assert abs(R_gap / R_core - 7.5) < 1e-9
    assert abs(R_gap / (R_gap + R_core) - at / (at + l_eq)) < 1e-12
    # and against the field-energy integral at a stated flux density
    B = 0.11
    U_gap = B * B / (2.0 * MU0) * A * at
    U_core = B * B / (2.0 * MU0 * mu_r) * A * lc
    assert abs(U_gap / (U_gap + U_core) - at / (at + l_eq)) < 1e-12
    # the half-way gap: energy splits evenly when lg equals lc/mu_r
    assert abs(np.interp(0.5, frac, lg) - l_eq) < 1e-7

    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.6))
    ax1.semilogx(lg * 1e3, frac * 100.0, color=c[0], lw=2.3)
    ax2.loglog(lg * 1e3, mu_e, color=c[1], lw=2.3)
    for ax in (ax1, ax2):
        ax.axvline(l_eq * 1e3, color=S.GUIDE[mode], lw=1.0, ls="--")
        ax.axvline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax1.plot([1.0], [88.23529], "o", color=S.INK[mode], ms=7, zorder=5)
    ax2.plot([1.0], [176.47059], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax1, 1.3e-3, 62.0, "gap = l_c/mu_r = 0.133 mm:\nthe energy splits 50/50", mode)
    S.note(ax1, 9.0, 8.0, "1 mm gap holds 88.2% of the stored energy", mode, ha="right")
    S.note(ax2, 1.5e-3, 30.0, "and drags the effective permeability to 176", mode)
    ax1.set_ylabel("energy in the gap  (%)")
    ax2.set_ylabel("effective  mu_r")
    ax2.set_xlabel("air-gap length  l_g  (mm),  core path 0.2 m at mu_r = 1500")
    ax1.set_title("An air gap steals the energy and stabilises the inductance")
    ax1.set_ylim(0, 105)
    S.strip(ax1)
    S.strip(ax2)
    fig.subplots_adjust(hspace=0.12)
    return fig


@figure("mat3-weiss-curie")
def _(mode):
    """Mean-field magnetisation collapsing at the Curie point."""
    c = S.SERIES[mode]
    t = np.linspace(0.001, 1.6, 1601)
    m = weiss_m(t)

    # the fixed point really is a fixed point
    below = t < 0.999
    assert np.max(np.abs(m[below] - np.tanh(m[below] / t[below]))) < 1e-9
    assert abs(weiss_m(np.array([0.5]))[0] - 0.9575040) < 1e-6, weiss_m(np.array([0.5]))[0]
    assert abs(weiss_m(np.array([0.9]))[0] - 0.5254295) < 1e-6, weiss_m(np.array([0.9]))[0]
    assert weiss_m(np.array([1.05]))[0] == 0.0
    assert abs(weiss_m(np.array([0.05]))[0] - 1.0) < 1e-9
    # INDEPENDENT ROUTE: near Tc the cubic expansion of tanh gives m^2 = 3t^2(1-t)
    for tt in (0.97, 0.98, 0.99):
        approx = np.sqrt(3.0 * tt * tt * (1.0 - tt))
        exact = weiss_m(np.array([tt]))[0]
        assert abs(exact / approx - 1.0) < 0.02, (tt, exact, approx)
    # Curie-Weiss above Tc needs no fitted constant to give a RATIO
    theta = 1043.0                      # K, iron Curie temperature
    assert abs(((1300.0 - theta) / (1100.0 - theta)) - 4.50877) < 5e-5

    fig, ax = plt.subplots()
    ax.plot(t, m, color=c[0], lw=2.5)
    tt = np.linspace(0.80, 0.999, 300)
    ax.plot(tt, np.sqrt(3.0 * tt * tt * (1.0 - tt)), color=c[1], lw=1.7, ls="--")
    ax.axvline(1.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    for x in (0.5, 0.9):
        ax.plot([x], [weiss_m(np.array([x]))[0]], "o", color=S.INK[mode], ms=6, zorder=5)
    S.label_end(ax, 0.08, 0.90, "m = tanh(m Tc/T)", c[0], mode, dx=0, dy=0)
    S.label_end(ax, 0.86, np.sqrt(3 * 0.86 ** 2 * 0.14), "sqrt(3 t^2 (1 - t))",
                c[1], mode, dx=-6, dy=-16, ha="right")
    S.note(ax, 0.05, 0.52, "T = Tc/2 still holds 95.8%\nof full magnetisation", mode)
    S.note(ax, 1.58, 0.26, "above Tc the exchange loses to\nthermal agitation: mu_r "
                           "falls to about 1\nand the material is paramagnetic", mode,
           ha="right")
    ax.set_xlabel("reduced temperature  T / Tc")
    ax.set_ylabel("reduced magnetisation  M / Ms")
    ax.set_title("The Curie point is a collapse, not a fade")
    ax.set_xlim(0, 1.6)
    ax.set_ylim(0, 1.08)
    S.strip(ax)
    return fig


@figure("mat3-loss-separation")
def _(mode):
    """Loss separation: P/f against f is a straight line that names both terms."""
    c = S.SERIES[mode]
    rho, t, Bm = 4.7e-7, 0.35e-3, 1.5
    area = 250.0                     # J/m^3 per cycle at this Bm, stated
    ke = np.pi ** 2 * Bm ** 2 * t ** 2 / (6.0 * rho)
    assert abs(ke - 0.9646486) < 5e-7, ke
    assert abs(ke * 60.0 ** 2 - 3472.735) < 5e-3

    f = np.linspace(10.0, 700.0, 1381)
    Ph = area * f
    Pe = ke * f * f
    tot = Ph + Pe

    f_x = area / ke
    assert abs(f_x - 259.163) < 5e-3, f_x
    assert abs(area * f_x - ke * f_x * f_x) < 1e-6
    # at 60 Hz
    assert abs(area * 60.0 - 15000.0) < 1e-9
    assert abs(area * 60.0 + ke * 3600.0 - 18472.735) < 5e-3
    assert abs((area * 60.0 + ke * 3600.0) / 7650.0 - 2.41474) < 5e-5
    # the straight line: intercept is the hysteresis coefficient, slope the eddy one
    y = tot / f
    p = np.polyfit(f, y, 1)
    assert abs(p[0] - ke) < 1e-9, p[0]
    assert abs(p[1] - area) < 1e-6, p[1]
    # doubling frequency at fixed Bm: hysteresis x2, eddy x4
    assert abs((area * 120.0) / (area * 60.0) - 2.0) < 1e-12
    assert abs((ke * 120.0 ** 2) / (ke * 60.0 ** 2) - 4.0) < 1e-12

    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(7.2, 5.8))
    ax1.plot(f, Ph / 1e3, color=c[0], lw=2.2)
    ax1.plot(f, Pe / 1e3, color=c[1], lw=2.2)
    ax1.plot(f, tot / 1e3, color=c[2], lw=2.5)
    ax1.axvline(f_x, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.label_end(ax1, 700, Ph[-1] / 1e3, "hysteresis, linear in f", c[0], mode,
                dx=-6, dy=-14, ha="right")
    S.label_end(ax1, 700, Pe[-1] / 1e3, "eddy, quadratic in f", c[1], mode,
                dx=-6, dy=6, ha="right")
    S.label_end(ax1, 520, tot[int(np.argmin(np.abs(f - 520)))] / 1e3, "total",
                c[2], mode, dx=-8, dy=12, ha="right")
    S.note(ax1, f_x + 12, 430.0, "the two are equal\nat 259 Hz", mode)
    ax2.plot(f, y, color=c[2], lw=2.4)
    ax2.plot([0.0], [area], "o", color=S.INK[mode], ms=7, zorder=5, clip_on=False)
    S.note(ax2, 330.0, 150.0, "slope 0.965 = eddy coefficient\n"
                              "intercept 250 = loop area, J/m^3", mode)
    ax1.set_ylabel("loss density  (kW/m^3)")
    ax1.set_xlabel("frequency  f  (Hz)")
    ax2.set_ylabel("loss per cycle  P/f  (J/m^3)")
    ax2.set_xlabel("frequency  f  (Hz)")
    ax1.set_title("Separating the two core losses, and reading them off a line")
    ax1.set_xlim(0, 760)
    ax2.set_xlim(0, 760)
    ax2.set_ylim(0, 950)
    S.strip(ax1)
    S.strip(ax2)
    fig.subplots_adjust(hspace=0.55)
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
    prefix = sys.argv[1] if len(sys.argv) > 1 else PREFIX
    names = [n for n in REGISTRY if n.startswith(prefix)]
    if not names:
        print(f"no figures match {prefix!r}; known: {sorted(REGISTRY)}")
        return 1
    for n in sorted(names):
        assert n.startswith(PREFIX), n
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
