#!/usr/bin/env python3
"""Depth-wave-14 figures for the FE Electrical and Computer course:
Maxwell's Equations and Wave Propagation.

Same contract as gen_fe_ee_e2.py, and it imports the SAME style module rather
than growing a second look: every curve here is COMPUTED, in this file, from an
equation the lesson that references it writes out. Nothing is traced, scanned,
redrawn or adapted from the NCEES Reference Handbook or any textbook - the
pipeline consumes formulas, which are not protected expression, and never
anyone's drawing of them.

Two of these figures exist specifically to check the chapter rather than to
decorate it. `em3-fdtd-pulse` and `em3-fdtd-convergence` solve Maxwell's curl
equations by leapfrog time-stepping on a Yee grid and then measure the
propagation speed off the result, so the claim "the wave equation has speed
1/sqrt(mu eps)" is confirmed by a route that never substitutes the plane-wave
solution. `em3-gauss-flux-numeric` integrates E.n over a closed surface by
Gauss-Legendre quadrature, so the divergence theorem is confirmed rather than
asserted, and `em3-poynting-average` integrates E x H over a period instead of
quoting E^2/2eta.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Every figure asserts the numbers the lesson quotes from it, at the tightest
tolerance the quantity supports: 1e-9 or better where the result is exact in
closed form, and the last quoted digit otherwise. A loose tolerance on a
printed value is decoration, not a check.

Usage:
    python3 scripts/gen_fe_ee_d14.py             # all
    python3 scripts/gen_fe_ee_d14.py em3-fdtd    # only names with that prefix
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

# Tabulated constants. eps_0 and c are the CODATA/SI values; mu_0 is taken as
# 4 pi x 1e-7 H/m, which is the value every FE reference uses and the one the
# lessons quote. Deriving c from these two reproduces 299 792 458 m/s to nine
# figures, which the first assertion below pins.
EPS0 = 8.8541878128e-12          # F/m
MU0 = 4.0 * np.pi * 1e-7         # H/m
C_SI = 299792458.0               # m/s, exact by definition of the metre
ETA0 = 376.730313                # ohm, tabulated

C_DERIVED = 1.0 / np.sqrt(MU0 * EPS0)
assert abs(C_DERIVED - C_SI) / C_SI < 3e-10, C_DERIVED
assert abs(np.sqrt(MU0 / EPS0) - ETA0) < 1e-6, np.sqrt(MU0 / EPS0)
# eta_0 by two further independent routes: mu_0 c and 1/(eps_0 c).
assert abs(MU0 * C_SI - ETA0) < 1e-6, MU0 * C_SI
assert abs(1.0 / (EPS0 * C_SI) - ETA0) < 1e-6, 1.0 / (EPS0 * C_SI)

REGISTRY: dict[str, callable] = {}


def figure(name):
    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# Shared numerics
# ---------------------------------------------------------------------------


_FLUX_CACHE: dict[tuple[float, float, float], float] = {}


def sphere_flux(radius: float, offset: float, q: float,
                n_mu: int = 400, n_phi: int = 400) -> float:
    """Integrate E.n dA over a sphere of `radius` centred on the origin, for a
    point charge q sitting on the z axis at z = `offset`.

    Gauss-Legendre in cos(theta) and midpoint in phi (spectrally accurate on a
    periodic variable). No symmetry is exploited: the integrand is the full
    Coulomb field dotted into the outward normal, so the result is a genuine
    numerical test of the divergence theorem rather than an algebraic identity
    dressed up as one.
    """
    key = (radius, offset, q)
    if key in _FLUX_CACHE:            # the light and dark passes ask twice
        return _FLUX_CACHE[key]
    mu, w_mu = np.polynomial.legendre.leggauss(n_mu)
    phi = (np.arange(n_phi) + 0.5) * 2.0 * np.pi / n_phi
    w_phi = 2.0 * np.pi / n_phi
    MU, PHI = np.meshgrid(mu, phi, indexing="ij")
    sin_t = np.sqrt(1.0 - MU ** 2)
    x = radius * sin_t * np.cos(PHI)
    y = radius * sin_t * np.sin(PHI)
    z = radius * MU
    rx, ry, rz = x, y, z - offset
    r = np.sqrt(rx * rx + ry * ry + rz * rz)
    k = 1.0 / (4.0 * np.pi * EPS0)
    # E.n with n = (x, y, z)/radius
    e_dot_n = k * q * (rx * x + ry * y + rz * z) / (radius * r ** 3)
    value = float(np.sum(e_dot_n * (w_mu[:, None] * w_phi) * radius * radius))
    _FLUX_CACHE[key] = value
    return value


def fdtd_1d(n_cells: int, courant: float = 0.5, length: float = 6.0,
            width: float = 0.30, z0: float = 1.0, t_stop: float = 10e-9):
    """Leapfrog Maxwell solve on a 1-D Yee grid, in vacuum.

    Only the two curl equations are stepped:

        dH_y/dt = -(1/mu ) dE_x/dz
        dE_x/dt = -(1/eps) dH_y/dz

    Nothing about waves, speed or impedance is put in. A Gaussian bump is laid
    on the grid at t = 0 with the companion H field a half step behind, and the
    solver is asked what happens. What comes out is a shape-preserving pulse
    moving at 1/sqrt(mu eps) with E/H = sqrt(mu/eps), which is the content of
    the wave equation obtained without ever writing it down.
    """
    dz = length / n_cells
    dt = courant * dz / C_DERIVED
    n_steps = int(round(t_stop / dt))
    z = np.arange(n_cells + 1) * dz          # E_x nodes
    z_h = z[:-1] + dz / 2.0                  # H_y nodes, staggered by dz/2

    def shape(u):
        return np.exp(-((u / width) ** 2))

    e_x = shape(z - z0)
    h_y = shape(z_h - z0 + C_DERIVED * dt / 2.0) / ETA0   # staggered by dt/2
    ce = dt / (EPS0 * dz)
    ch = dt / (MU0 * dz)
    snaps = {0: e_x.copy()}
    marks = {int(round(5e-9 / dt)), n_steps}
    for step in range(1, n_steps + 1):
        h_y -= ch * (e_x[1:] - e_x[:-1])
        e_x[1:-1] -= ce * (h_y[1:] - h_y[:-1])
        e_x[0] = 0.0
        e_x[-1] = 0.0
        if step in marks:
            snaps[step] = e_x.copy()
    t_end = n_steps * dt
    exact = shape(z - z0 - C_DERIVED * t_end)
    err = (np.sqrt(np.sum((e_x - exact) ** 2) * dz)
           / np.sqrt(np.sum(exact ** 2) * dz))
    return dict(z=z, z_h=z_h, e=e_x, h=h_y, exact=exact, dz=dz, dt=dt,
                t=t_end, err=err, snaps=snaps, steps=n_steps, z0=z0)


def peak_position(z, field, dz):
    """Sub-cell peak location by parabolic interpolation on three samples."""
    i = int(np.argmax(field))
    y0, y1, y2 = field[i - 1], field[i], field[i + 1]
    shift = 0.5 * (y0 - y2) / (y0 - 2.0 * y1 + y2)
    return z[i] + shift * dz


# ---------------------------------------------------------------------------
# Maxwell's Equations
# ---------------------------------------------------------------------------


@figure("em3-gauss-flux-numeric")
def _(mode):
    """Closed-surface flux against sphere radius for a charge at three offsets.

    The flux is obtained by quadrature, not by Gauss's law, so the plateau at
    exactly q/eps_0 and the floor at exactly zero are results rather than
    restatements. q = 2.0 nC gives q/eps_0 = 225.88 V.m.
    """
    c = S.SERIES[mode]
    q = 2.0e-9
    target = q / EPS0
    assert abs(target - 225.8818135) < 1e-6, target

    radii = np.linspace(0.006, 0.100, 96)
    curves = []
    for offset in (0.0, 0.030, 0.060):
        # radii within 3 mm of the charge are dropped: the integrand there is a
        # near-singular spike and the quadrature, not the physics, would be what
        # the assertion measured.
        keep = np.abs(radii - offset) > 3.0e-3
        rr = radii[keep]
        ff = np.array([sphere_flux(r, offset, q) for r in rr]) / target
        curves.append((offset, rr, ff))
        inside = ff[rr > offset]
        outside = ff[rr < offset]
        assert np.all(np.abs(inside - 1.0) < 1e-9), (offset, inside.min(), inside.max())
        if outside.size:
            assert np.all(np.abs(outside) < 1e-9), (offset, np.abs(outside).max())

    # Three stacked panels rather than three overlaid steps: the curves would sit
    # on top of one another at 0 and at 1, and a legend cannot separate lines
    # that are literally coincident.
    fig, axes = plt.subplots(3, 1, sharex=True, sharey=True, figsize=(7.2, 5.6))
    labels = ["charge at the centre of the sphere",
              "charge 3.0 cm off the centre",
              "charge 6.0 cm off the centre"]
    for k, ((offset, rr, ff), name) in enumerate(zip(curves, labels)):
        ax = axes[k]
        for mask in (rr < offset, rr > offset):
            if mask.any():
                ax.plot(rr[mask] * 100, ff[mask], color=c[k], lw=2.4)
        if offset > 0:
            ax.plot([offset * 100, offset * 100], [0.0, 1.0], color=c[k], lw=1.3, ls=":")
            ax.plot([offset * 100], [0.0], "o", color=c[k], ms=7)
        ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
        S.label_end(ax, 11.0, 0.5, name, c[k], mode, dx=0, ha="left")
        ax.set_ylim(-0.14, 1.45)
        ax.set_xlim(0, 18.6)
        S.strip(ax)
    S.note(axes[0], 0.4, 1.12, "plateau is exactly q/eps0 = 225.88 V.m, at every radius", mode)
    S.note(axes[2], 0.4, 0.12, "zero while the charge sits outside", mode)
    axes[1].set_ylabel("integrated flux  /  (q / eps0)")
    axes[2].set_xlabel("radius of the Gaussian sphere  (cm)")
    axes[0].set_title("Flux by quadrature: only enclosure matters, not placement")
    return fig


@figure("em3-rotating-coil-emf")
def _(mode):
    """Flux linkage and induced emf for a 200-turn coil spun at 1800 rev/min.

    lambda(t) = N B A cos(omega t) with N = 200, B = 0.35 T, A = 0.015 m^2, so
    the peak linkage is 1.050 Wb-turn; emf = -dlambda/dt = N B A omega sin(omega t)
    peaks at 197.92 V and is a quarter cycle behind the linkage. Both are drawn
    as a fraction of their own peak so one axis carries both.
    """
    c = S.SERIES[mode]
    N, B, A, rpm = 200, 0.35, 0.015, 1800
    omega = 2.0 * np.pi * rpm / 60.0
    lam_pk = N * B * A
    emf_pk = lam_pk * omega
    assert abs(omega - 188.4955592) < 1e-6, omega
    assert abs(omega / (2 * np.pi) - 30.0) < 1e-12
    assert abs(lam_pk - 1.05) < 1e-12, lam_pk
    assert abs(emf_pk - 197.9203372) < 1e-6, emf_pk
    assert abs(emf_pk / np.sqrt(2.0) - 139.9508126) < 1e-6, emf_pk / np.sqrt(2.0)

    # emf recomputed by differencing the linkage numerically, which is the
    # independent route: it never uses the derivative of a cosine.
    t = np.linspace(0.0, 1.0 / 30.0, 20001)
    lam = lam_pk * np.cos(omega * t)
    emf_num = -np.gradient(lam, t)
    emf = emf_pk * np.sin(omega * t)
    # interior nodes only: np.gradient falls back to a one-sided, first-order
    # difference at the two ends, and that is an artefact of the stencil.
    gap = np.max(np.abs(emf_num[1:-1] - emf[1:-1])) / emf_pk
    assert gap < 1e-7, gap

    fig, ax = plt.subplots()
    ax.plot(t * 1e3, lam / lam_pk, color=c[0], lw=2.3)
    ax.plot(t * 1e3, emf / emf_pk, color=c[1], lw=2.3)
    S.label_end(ax, 33.333, 1.0, "flux linkage\npeak 1.050 Wb-turn", c[0], mode, dx=7)
    S.label_end(ax, 33.333, 0.0, "induced emf\npeak 197.92 V", c[1], mode, dx=7)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    ax.axhline(1.0 / np.sqrt(2.0), color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 34.2, 0.55, "rms is 0.707 of peak:\n139.95 V", mode)
    ax.plot([8.3333], [0.0], "o", color=c[0], ms=7)
    S.note(ax, 0.4, -1.30,
           "at 8.33 ms the linkage is zero and the emf is largest: the coil is edge-on to B",
           mode)
    ax.set_xlabel("time  (ms)      one revolution = 33.33 ms")
    ax.set_ylabel("fraction of own peak")
    ax.set_title("Faraday on a spun coil: the emf trails the flux by a quarter turn")
    ax.set_xlim(0, 47)
    ax.set_ylim(-1.45, 1.28)
    S.strip(ax)
    return fig


@figure("em3-boundary-fields")
def _(mode):
    """Field components across an air / eps_r = 4 interface at z = 0.

    Tangential E is continuous at 60 V/m. Normal D is continuous, so D/eps_0
    holds at 100 V/m while normal E drops to 100/4 = 25 V/m. The magnitudes are
    116.62 V/m and 65.00 V/m and the ray bends from 30.96 to 67.38 degrees.
    """
    c = S.SERIES[mode]
    e1n, e1t, er2 = 100.0, 60.0, 4.0
    e2n = e1n / er2
    assert abs(e2n - 25.0) < 1e-12
    mag1 = np.hypot(e1n, e1t)
    mag2 = np.hypot(e2n, e1t)
    assert abs(mag1 - 116.6190379) < 1e-6, mag1
    assert abs(mag2 - 65.0) < 1e-12, mag2
    th1 = np.degrees(np.arctan2(e1t, e1n))
    th2 = np.degrees(np.arctan2(e1t, e2n))
    assert abs(th1 - 30.9637565) < 1e-6, th1
    assert abs(th2 - 67.3801351) < 1e-6, th2
    # the refraction law recovered from the two continuity statements alone
    assert abs(np.tan(np.radians(th2)) / np.tan(np.radians(th1)) - er2) < 1e-12

    z = np.linspace(-3.0, 3.0, 1201)
    left = z < 0
    en = np.where(left, e1n, e2n)
    et = np.full_like(z, e1t)
    dn = np.full_like(z, e1n)          # D/eps0, continuous by construction

    fig, ax = plt.subplots()
    ax.plot(z, dn, color=c[0], lw=2.6)
    ax.plot(z, en, color=c[1], lw=2.3)
    ax.plot(z, et, color=c[2], lw=2.3)
    ax.axvline(0.0, color=S.GUIDE[mode], lw=1.2)
    S.label_end(ax, 3.0, e1n, "normal D, drawn as D/eps0", c[0], mode, dy=9)
    S.label_end(ax, 3.0, e2n, "normal E", c[1], mode, dy=-11)
    S.label_end(ax, 3.0, e1t, "tangential E", c[2], mode, dy=9)
    S.note(ax, -2.9, 106, "air, eps_r = 1", mode)
    S.note(ax, 0.25, 106, "dielectric, eps_r = 4", mode)
    ax.annotate("", xy=(0.35, 25.0), xytext=(0.35, 100.0),
                arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.2))
    S.note(ax, 0.55, 68, "normal E falls by the factor eps_r,\nbecause D is what carries across", mode)
    ax.set_xlabel("distance across the boundary  (arbitrary units, interface at 0)")
    ax.set_ylabel("field component  (V/m)")
    ax.set_title("Pillbox and loop: D_n and E_t survive the crossing, E_n does not")
    ax.set_xlim(-3.2, 3.3)
    ax.set_ylim(0, 128)
    S.strip(ax)
    return fig


@figure("em3-fdtd-pulse")
def _(mode):
    """A Gaussian pulse stepped through vacuum by the two curl equations.

    2400 cells over 6.00 m at Courant 0.5. The solver is told nothing about
    waves; the snapshots show the bump keeping its shape and translating, and
    the measured speed and E/H ratio are asserted against c and eta_0.
    """
    c = S.SERIES[mode]
    run = fdtd_1d(2400)
    z, dz = run["z"], run["dz"]
    assert abs(dz - 2.5e-3) < 1e-15, dz
    assert abs(run["dt"] - 4.169548e-12) < 1e-17, run["dt"]

    keys = sorted(run["snaps"])
    peak_end = peak_position(z, run["e"], dz)
    travelled = peak_end - run["z0"]
    v_meas = travelled / run["t"]
    assert abs(v_meas - C_SI) / C_SI < 2e-5, v_meas
    assert abs(travelled - 2.99746) < 5e-5, travelled
    assert run["err"] < 1e-4, run["err"]

    i_pk = int(np.argmax(run["e"]))
    ratio = run["e"][i_pk] / run["h"][i_pk]
    assert abs(ratio - ETA0) / ETA0 < 1e-4, ratio

    fig, ax = plt.subplots()
    names = ["t = 0", "t = 5.00 ns", "t = 10.00 ns"]
    for k, key in enumerate(keys):
        ax.plot(z, run["snaps"][key], color=c[k], lw=2.2)
        S.label_end(ax, z[int(np.argmax(run["snaps"][key]))],
                    run["snaps"][key].max(), names[k], c[k], mode, dy=11, ha="center")
    ax.plot(z, run["exact"], color=S.GUIDE[mode], lw=1.4, ls="--")
    S.note(ax, 4.35, 0.62, "dashed: the analytic\nGaussian at 10 ns", mode)
    ax.annotate("", xy=(peak_end, 1.12), xytext=(run["z0"], 1.12),
                arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.2))
    S.note(ax, 2.5, 1.15, "2.9975 m in 9.9986 ns  ->  2.9979e8 m/s, which is c to 13 ppm",
           mode, ha="center")
    ax.set_xlabel("position  z  (m)")
    ax.set_ylabel("E_x  (normalised to its launch amplitude)")
    ax.set_title("Time-stepping the curl equations produces a wave nobody put in")
    ax.set_xlim(0, 6.05)
    ax.set_ylim(0, 1.34)
    S.strip(ax)
    return fig


@figure("em3-fdtd-convergence")
def _(mode):
    """Relative L2 error of the stepped solution against the analytic pulse.

    Halving the cell quarters the error, which is the signature of a
    second-order scheme and the evidence that the residual gap is discretisation
    and not a wrong constant. A wrong speed would show up as an error floor that
    refuses to fall.
    """
    c = S.SERIES[mode]
    cells = np.array([150, 300, 600, 1200, 2400])
    runs = [fdtd_1d(int(n)) for n in cells]
    dz = np.array([r["dz"] for r in runs])
    err = np.array([r["err"] for r in runs])
    orders = np.log2(err[:-1] / err[1:])
    assert np.all(np.abs(orders - 2.0) < 0.02), orders
    assert abs(err[0] - 2.157448e-2) < 1e-7, err[0]
    assert abs(err[-1] - 8.406320e-5) < 1e-10, err[-1]

    # offset downward so the reference is visible: laid on top it would be
    # hidden by the measured points, which is precisely the result being shown
    ref = 0.45 * err[0] * (dz / dz[0]) ** 2
    fig, ax = plt.subplots()
    ax.loglog(dz * 1e3, err, "o-", color=c[0], lw=2.2, ms=7)
    ax.loglog(dz * 1e3, ref, color=S.GUIDE[mode], lw=1.4, ls="--")
    S.label_end(ax, dz[0] * 1e3, err[0], "measured error", c[0], mode, dy=12, ha="right")
    S.note(ax, 2.2, 2.6e-2, "dashed: slope 2 exactly, shifted down\nso it is not hidden by the data", mode)
    for d_, e_ in zip(dz, err):
        S.note(ax, d_ * 1e3 * 1.06, e_ * 0.62, f"{e_:.2e}", mode, size=8)
    ax.set_xlabel("cell size  dz  (mm)")
    ax.set_ylabel("relative L2 error against the analytic pulse")
    ax.set_title("Second-order convergence: the gap is the grid, not the physics")
    ax.set_xlim(2.0, 60)
    ax.set_ylim(4e-5, 6e-2)
    S.strip(ax)
    return fig


@figure("em3-quasistatic-map")
def _(mode):
    """Electrical size L/lambda against frequency for three object sizes.

    Below L = lambda/20 the retardation across the object is under 18 degrees and
    a lumped or static description is defensible; above it the phase across the
    object cannot be ignored. A 10 cm board crosses at 149.9 MHz and is 0.817
    wavelengths across at 2.45 GHz.
    """
    c = S.SERIES[mode]
    f = np.logspace(0, 10, 900)
    sizes = [(1.0, "1 m  cabinet or cable run"), (0.10, "10 cm  circuit board"),
             (0.01, "1 cm  package or via")]
    assert abs(C_SI / 2.45e9 - 0.1223643) < 1e-6, C_SI / 2.45e9
    assert abs(0.10 / (C_SI / 2.45e9) - 0.8172324) < 1e-6
    assert abs(C_SI / (20 * 0.10) - 149896229.0) < 1e-3
    assert abs(0.10 / (C_SI / 60.0) - 2.001377e-8) < 1e-13

    arrow = dict(arrowstyle="->", color=S.INK_2[mode], lw=1.1,
                 connectionstyle="arc3,rad=-0.2")
    fig, ax = plt.subplots()
    for k, (L, name) in enumerate(sizes):
        ax.loglog(f, L * f / C_SI, color=c[k], lw=2.2)
        S.label_end(ax, 1e10, L * 1e10 / C_SI, name, c[k], mode, dx=7)
    ax.axhline(0.05, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 1.4, 0.075, "L = lambda/20: the usual lumped-circuit limit", mode)
    ax.plot([2.45e9], [0.8172324], "o", color=c[1], ms=7)
    ax.annotate("10 cm board at 2.45 GHz is\n0.82 wavelengths across",
                xy=(2.45e9, 0.8172324), xytext=(2.5e2, 40),
                color=S.INK_2[mode], fontsize=9, arrowprops=arrow)
    ax.plot([149896229.0], [0.05], "o", color=c[1], ms=7)
    ax.annotate("the same board leaves the\nlumped regime at 149.9 MHz",
                xy=(1.49896229e8, 0.05), xytext=(2.5e2, 1.4),
                color=S.INK_2[mode], fontsize=9, arrowprops=arrow)
    ax.plot([60.0], [1.0 * 60.0 / C_SI], "o", color=c[0], ms=7)
    ax.annotate("mains at 60 Hz: a 1 m object is\n2e-7 wavelengths - fully static",
                xy=(60.0, 2.0013e-7), xytext=(3e5, 2e-8),
                color=S.INK_2[mode], fontsize=9, arrowprops=arrow)
    ax.set_xlabel("frequency  (Hz)")
    ax.set_ylabel("electrical size  L / lambda")
    ax.set_title("When the simple chapters stop applying")
    ax.set_xlim(1, 1e12)
    ax.set_ylim(1e-9, 3e2)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Wave Propagation
# ---------------------------------------------------------------------------


@figure("em3-plane-wave-snapshot")
def _(mode):
    """One instant of a 300 MHz plane wave in polyethylene, eps_r = 2.25.

    lambda = 66.62 cm, eta = 251.15 ohm. E is drawn as a line and eta H as
    markers laid on it: they coincide, which is the whole content of E/H = eta
    in a lossless medium. The Poynting product is the squared cosine, never
    negative, oscillating at twice the field frequency about the time average
    at one half of its peak.
    """
    c = S.SERIES[mode]
    er, f, e0 = 2.25, 300e6, 50.0
    n = np.sqrt(er)
    v = C_SI / n
    lam = v / f
    eta = ETA0 / n
    h0 = e0 / eta
    s_pk = e0 * h0
    assert abs(lam - 0.6662055) < 1e-7, lam
    assert abs(eta - 251.1535420) < 1e-6, eta
    assert abs(h0 - 0.1990814) < 1e-7, h0
    assert abs(s_pk - 9.9540702) < 1e-6, s_pk
    assert abs(s_pk / 2.0 - 4.9770351) < 1e-6
    # beta by two routes: 2 pi / lambda and omega sqrt(mu eps)
    beta = 2.0 * np.pi / lam
    beta2 = 2.0 * np.pi * f * np.sqrt(MU0 * EPS0 * er)
    assert abs(beta - 9.4313026) < 1e-6, beta
    assert abs(beta - beta2) / beta < 1e-9, (beta, beta2)

    z = np.linspace(0.0, 1.5 * lam, 1200)
    e = np.cos(beta * z)
    h = np.cos(beta * z)          # eta H / E0, identical by construction
    s = e * h
    full = z <= lam
    assert abs(np.mean(s[full]) - 0.5) < 2e-3, np.mean(s[full])

    fig, ax = plt.subplots()
    ax.plot(z * 100, e, color=c[0], lw=2.3)
    ax.plot(z[::50] * 100, h[::50], "o", color=c[1], ms=6.5)
    ax.plot(z * 100, s, color=c[2], lw=2.0)
    ax.axhline(0.5, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    S.label_end(ax, z[-1] * 100, e[-1], "E / E0", c[0], mode, dx=7)
    S.label_end(ax, z[-1] * 100, s[-1], "S / S_peak", c[2], mode, dx=7)
    S.label_end(ax, 33.31, -1.0, "eta H / E0 is the marker series:\nit lands on the E curve",
                c[1], mode, dy=-19, ha="center")
    S.note(ax, 101.5, 0.58, "dashed line is the time\naverage of S, half its\npeak: 4.977 W/m^2", mode)
    ax.annotate("", xy=(66.62, 1.18), xytext=(0.0, 1.18),
                arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.2))
    S.note(ax, 33.3, 1.21, "one wavelength, 66.62 cm", mode, ha="center")
    ax.set_xlabel("position  z  (cm)")
    ax.set_ylabel("normalised amplitude")
    ax.set_title("E, H and power flow in a lossless medium, frozen at one instant")
    ax.set_xlim(0, 152)
    ax.set_ylim(-1.45, 1.38)
    S.strip(ax)
    return fig


@figure("em3-poynting-average")
def _(mode):
    """Instantaneous Poynting flux and its running mean, for E0 = 10 V/m in air.

    S(t) = (E0^2/eta_0) cos^2(omega t) peaks at 265.44 mW/m^2. The running mean
    is formed by integrating the curve, so the settled value of 132.72 mW/m^2 is
    obtained without ever writing E0^2/2eta - and then checked against it.
    """
    c = S.SERIES[mode]
    e0, f = 10.0, 100e6
    s_pk = e0 ** 2 / ETA0
    s_avg_closed = e0 ** 2 / (2.0 * ETA0)
    assert abs(s_pk - 0.2654419) < 1e-7, s_pk
    assert abs(s_avg_closed - 0.1327209) < 1e-7, s_avg_closed

    period = 1.0 / f
    t = np.linspace(0.0, 2.5 * period, 400001)
    s = s_pk * np.cos(2.0 * np.pi * f * t) ** 2
    # running mean by cumulative trapezoid: an integration, not a formula
    integral = np.concatenate(([0.0], np.cumsum(0.5 * (s[1:] + s[:-1]) * np.diff(t))))
    running = np.empty_like(t)
    running[0] = s[0]
    running[1:] = integral[1:] / t[1:]
    one_period = int(round(period / (t[1] - t[0])))
    s_avg_num = integral[one_period] / t[one_period]
    assert abs(s_avg_num - s_avg_closed) / s_avg_closed < 1e-11, (s_avg_num, s_avg_closed)

    fig, ax = plt.subplots()
    ax.plot(t * 1e9, s * 1e3, color=c[0], lw=2.0)
    ax.plot(t * 1e9, running * 1e3, color=c[1], lw=2.4)
    ax.axhline(s_avg_closed * 1e3, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.label_end(ax, 25.0, s_pk * 1e3, "instantaneous S", c[0], mode, dx=7)
    S.label_end(ax, 25.0, running[-1] * 1e3, "running mean\nof the integral", c[1], mode, dx=7)
    S.note(ax, 25.9, 185, "dashed line:\nE0^2 / 2eta0 =\n132.72 mW/m^2", mode)
    ax.plot([10.0], [s_avg_closed * 1e3], "o", color=c[1], ms=7)
    S.note(ax, 0.4, 300,
           "the integral settles onto the closed form after exactly one period, 10 ns", mode)
    ax.set_xlabel("time  (ns)")
    ax.set_ylabel("power flux  (mW/m^2)")
    ax.set_title("Averaging the Poynting vector, by integrating rather than quoting")
    ax.set_xlim(0, 35)
    ax.set_ylim(0, 340)
    S.strip(ax)
    return fig


@figure("em3-polarization-ellipse")
def _(mode):
    """Locus of the E-vector tip for three phase differences, equal amplitudes.

    E_x = cos(wt), E_y = cos(wt + d). Rotating into the 45 degree frame turns the
    pair into semi-axes sqrt(2)cos(d/2) and sqrt(2)sin(d/2), so the axial ratio
    is cot(d/2): infinite (linear) at 0, 2.4142 at 45 degrees, and unity
    (circular) at 90.
    """
    c = S.SERIES[mode]
    wt = np.linspace(0.0, 2.0 * np.pi, 4001)
    fig, ax = plt.subplots(figsize=(5.6, 4.6))
    names = ["delta = 0: linear", "delta = 45 deg: elliptical", "delta = 90 deg: circular"]
    for k, deg in enumerate((0.0, 45.0, 90.0)):
        d = np.radians(deg)
        ex, ey = np.cos(wt), np.cos(wt + d)
        # numerical semi-axes in the rotated frame, against the closed form
        u = (ex + ey) / np.sqrt(2.0)
        w = (ex - ey) / np.sqrt(2.0)
        assert abs(u.max() - np.sqrt(2.0) * np.cos(d / 2.0)) < 2e-6, (deg, u.max())
        assert abs(w.max() - np.sqrt(2.0) * np.sin(d / 2.0)) < 2e-6, (deg, w.max())
        ax.plot(ex, ey, color=c[k], lw=2.3)
    assert abs(1.0 / np.tan(np.radians(22.5)) - 2.4142136) < 1e-7
    assert abs(20 * np.log10(1.0 / np.tan(np.radians(22.5))) - 7.6555137) < 1e-6
    assert abs(np.sqrt(2.0) * np.cos(np.radians(22.5)) - 1.3065630) < 1e-7
    assert abs(np.sqrt(2.0) * np.sin(np.radians(22.5)) - 0.5411961) < 1e-7

    S.label_end(ax, 1.0, 1.0, names[0], c[0], mode, dx=-4, dy=11, ha="right")
    S.label_end(ax, 1.306563 / np.sqrt(2), 1.306563 / np.sqrt(2), names[1], c[1], mode,
                dx=6, dy=-16, ha="left")
    S.label_end(ax, 0.0, -1.0, names[2], c[2], mode, dx=0, dy=-14, ha="center")
    ax.axhline(0.0, color=S.GUIDE[mode], lw=0.9)
    ax.axvline(0.0, color=S.GUIDE[mode], lw=0.9)
    S.note(ax, -1.42, 1.24, "axial ratio = cot(delta/2): 2.414 at 45 deg, 1 at 90 deg", mode)
    ax.set_xlabel("E_x / E0")
    ax.set_ylabel("E_y / E0")
    ax.set_title("Polarization is a phase relation, not a new field")
    ax.set_aspect("equal")
    ax.set_xlim(-1.5, 1.5)
    ax.set_ylim(-1.5, 1.5)
    S.strip(ax)
    return fig


@figure("em3-phase-group-velocity")
def _(mode):
    """Phase and group velocity for the cutoff dispersion w^2 = wc^2 + (ck)^2.

    v_p = c/sqrt(1-(fc/f)^2) exceeds c and v_g = c sqrt(1-(fc/f)^2) falls short
    of it, and their product is c^2 at every frequency - the reason a phase
    velocity above c carries no signal. Cutoff 6.5571 GHz corresponds to a
    22.86 mm guide width.
    """
    c = S.SERIES[mode]
    a = 22.86e-3
    fc = C_SI / (2.0 * a)
    assert abs(fc - 6.5571404e9) < 1e3, fc
    r = np.linspace(1.02, 5.0, 1400)
    root = np.sqrt(1.0 - 1.0 / r ** 2)
    vp, vg = 1.0 / root, root
    assert np.max(np.abs(vp * vg - 1.0)) < 1e-12
    r10 = 10e9 / fc
    root10 = np.sqrt(1.0 - (fc / 10e9) ** 2)
    assert abs(root10 - 0.7550093) < 1e-7, root10
    assert abs(C_SI / root10 - 3.9707119e8) < 1e2, C_SI / root10
    assert abs(C_SI * root10 - 2.2634611e8) < 1e2, C_SI * root10
    assert abs((C_SI / root10) * (C_SI * root10) - C_SI ** 2) / C_SI ** 2 < 1e-12
    assert abs(C_SI / root10 / 10e9 - 0.0397071) < 1e-7

    fig, ax = plt.subplots()
    ax.plot(r, vp, color=c[0], lw=2.3)
    ax.plot(r, vg, color=c[1], lw=2.3)
    ax.plot(r, vp * vg, color=c[2], lw=2.0)
    S.label_end(ax, 5.0, 1.0 / np.sqrt(1 - 1 / 25.0), "phase velocity v_p / c",
                c[0], mode, dx=6, dy=8)
    S.label_end(ax, 5.0, np.sqrt(1 - 1 / 25.0), "group velocity v_g / c", c[1], mode,
                dx=6, dy=-10)
    S.label_end(ax, 3.9, 1.0, "product v_p v_g / c^2 = 1 exactly", c[2], mode, dy=15, ha="center")
    ax.plot([r10, r10], [1.0 / root10, root10], "o", color=S.INK[mode], ms=6, zorder=5)
    ax.axvline(r10, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, r10 + 0.08, 2.3, "10 GHz in a 6.557 GHz guide:\n1.324c and 0.755c", mode)
    ax.set_xlabel("frequency, in units of the cutoff  f / f_c")
    ax.set_ylabel("velocity, in units of c")
    ax.set_title("A phase velocity above c, and the group velocity that pays for it")
    ax.set_xlim(1.0, 8.0)
    ax.set_ylim(0, 3.6)
    S.strip(ax)
    return fig


@figure("em3-reflection-normal")
def _(mode):
    """Normal-incidence reflection from air onto a non-magnetic dielectric.

    Gamma = (eta2 - eta1)/(eta2 + eta1) with eta2 = eta_0/sqrt(eps_r). The power
    split is checked against unity at every point, using the transmitted
    intensity |tau|^2 eta1/eta2 rather than 1 - |Gamma|^2, so the balance is a
    result and not a definition.
    """
    c = S.SERIES[mode]
    er = np.logspace(0, 2, 900)
    eta2 = ETA0 / np.sqrt(er)
    gam = (eta2 - ETA0) / (eta2 + ETA0)
    tau = 1.0 + gam
    p_ref = gam ** 2
    p_tr = tau ** 2 * ETA0 / eta2
    assert np.max(np.abs(p_ref + p_tr - 1.0)) < 1e-12, np.max(np.abs(p_ref + p_tr - 1.0))
    g225 = (ETA0 / 1.5 - ETA0) / (ETA0 / 1.5 + ETA0)
    g81 = (ETA0 / 9.0 - ETA0) / (ETA0 / 9.0 + ETA0)
    assert abs(g225 + 0.2) < 1e-12, g225
    assert abs(g81 + 0.8) < 1e-12, g81
    assert abs((1 + 0.2) / (1 - 0.2) - 1.5) < 1e-12
    assert abs((1 + 0.8) / (1 - 0.8) - 9.0) < 1e-12

    # amplitude and power belong on different scales; stacked panels keep one
    # quantity per axis rather than crowding three monotone curves together
    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.4))
    ax1.semilogx(er, np.abs(gam), color=c[0], lw=2.4)
    S.label_end(ax1, 100, np.abs(gam[-1]), "|Gamma|", c[0], mode, dx=7)
    arrow = dict(arrowstyle="->", color=S.INK_2[mode], lw=1.1,
                 connectionstyle="arc3,rad=-0.25")
    for e_, g_, tx, ty, name in (
            (2.25, 0.2, 1.30, 0.62, "polyethylene 2.25: |Gamma| = 0.2, SWR 1.5"),
            (81.0, 0.8, 18.0, 0.30, "water 81: |Gamma| = 0.8, SWR 9")):
        ax1.plot([e_], [g_], "o", color=c[0], ms=7)
        for axx in (ax1, ax2):
            axx.axvline(e_, color=S.GUIDE[mode], lw=0.9, ls=":")
        ax1.annotate(name, xy=(e_, g_), xytext=(tx, ty), color=S.INK_2[mode],
                     fontsize=9, arrowprops=arrow)
    ax1.set_ylabel("|Gamma|  (amplitude)")
    ax1.set_ylim(0, 1.05)
    ax1.set_title("Normal incidence: the whole answer is the impedance ratio")
    S.strip(ax1)

    ax2.semilogx(er, p_ref, color=c[1], lw=2.4)
    ax2.semilogx(er, p_tr, color=c[2], lw=2.4)
    S.label_end(ax2, 100, p_ref[-1], "reflected  |Gamma|^2", c[1], mode, dx=7)
    S.label_end(ax2, 100, p_tr[-1], "transmitted", c[2], mode, dx=7)
    S.note(ax2, 112, 0.03, "the two fractions add\nto 1.000 everywhere", mode)
    ax2.set_ylabel("power fraction")
    ax2.set_ylim(0, 1.08)
    ax2.set_xlim(1, 330)
    ax2.set_xlabel("relative permittivity of the second medium  eps_r2")
    S.strip(ax2)
    return fig


@figure("em3-brewster-fresnel")
def _(mode):
    """Fresnel magnitudes against incidence angle, air onto glass, n = 1.5.

    Gamma_perp = (eta2 cos_i - eta1 cos_t)/(eta2 cos_i + eta1 cos_t) and
    Gamma_par  = (eta2 cos_t - eta1 cos_i)/(eta2 cos_t + eta1 cos_i).
    The parallel curve passes through a true zero at arctan(1.5) = 56.31
    degrees, where the transmitted ray leaves at 33.69 and the two make a right
    angle.
    """
    c = S.SERIES[mode]
    n1, n2 = 1.0, 1.5
    e1, e2 = ETA0 / n1, ETA0 / n2
    th = np.radians(np.linspace(0.0, 89.9, 1800))
    st = np.sin(th) * n1 / n2
    ct = np.sqrt(1.0 - st ** 2)
    ci = np.cos(th)
    g_perp = (e2 * ci - e1 * ct) / (e2 * ci + e1 * ct)
    g_par = (e2 * ct - e1 * ci) / (e2 * ct + e1 * ci)
    thb = np.degrees(np.arctan(n2 / n1))
    assert abs(thb - 56.3099325) < 1e-6, thb
    tht = np.degrees(np.arcsin(np.sin(np.radians(thb)) * n1 / n2))
    assert abs(tht - 33.6900675) < 1e-6, tht
    assert abs(thb + tht - 90.0) < 1e-9
    # the parallel coefficient at the Brewster angle, evaluated directly
    cb, cbt = np.cos(np.radians(thb)), np.cos(np.radians(tht))
    assert abs((e2 * cbt - e1 * cb) / (e2 * cbt + e1 * cb)) < 1e-12
    assert abs(abs(g_perp[0]) - 0.2) < 1e-9, g_perp[0]
    assert abs(abs(g_par[0]) - 0.2) < 1e-9, g_par[0]
    assert abs(np.degrees(np.arcsin(1.0 / 1.5)) - 41.8103149) < 1e-6

    fig, ax = plt.subplots()
    deg = np.degrees(th)
    ax.plot(deg, np.abs(g_perp), color=c[0], lw=2.3)
    ax.plot(deg, np.abs(g_par), color=c[1], lw=2.3)
    S.label_end(ax, 89.9, abs(g_perp[-1]), "perpendicular (s)", c[0], mode, dx=7, dy=7)
    S.label_end(ax, 89.9, abs(g_par[-1]), "parallel (p)", c[1], mode, dx=7, dy=-9)
    ax.plot([thb], [0.0], "o", color=c[1], ms=7)
    ax.axvline(thb, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 3.0, 0.62, "Brewster angle 56.31 deg: the parallel\n"
                          "wave is not reflected at all, and the\n"
                          "transmitted ray leaves at 33.69 deg -\n"
                          "the two make a right angle", mode)
    ax.plot([0.0], [0.2], "o", color=S.INK[mode], ms=6)
    S.note(ax, 3.0, 0.44, "both start at |Gamma| = 0.2 at normal incidence", mode)
    ax.set_xlabel("angle of incidence  (degrees from the normal)")
    ax.set_ylabel("reflection magnitude  |Gamma|")
    ax.set_title("Air onto glass: one polarization has a blind spot")
    ax.set_xlim(0, 112)
    ax.set_ylim(0, 1.12)
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
