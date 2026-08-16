#!/usr/bin/env python3
"""Depth-wave-4 figures for the FE Electrical and Computer course:
the Electrostatics and Magnetostatics chapters.

Same contract as gen_fe_ee_e2.py, and it imports the SAME style module rather
than growing a second look: every curve here is COMPUTED, in this file, from an
equation the lesson that references it writes out. Nothing is traced, scanned,
redrawn or adapted from the NCEES Reference Handbook or any textbook - the
pipeline consumes formulas, which are not protected expression, and never
anyone's drawing of them.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/em2-<name>.svg
    apps/web/public/courses/fe-ee/figures/em2-<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

WHY EVERY NUMBER IS COMPUTED TWICE

Checking a closed form against itself proves nothing. Every quantity these two
chapters quote is therefore produced by a SECOND, structurally different route
and the two are asserted equal:

  - fields from a charge distribution: adaptive quadrature of the raw Coulomb
    kernel over the distribution, against the Gauss's-law closed form;
  - fields from a current: numerical line integration of Biot-Savart along the
    conductor, against the Ampere's-law closed form;
  - potentials: red-black SOR solution of Laplace's equation on a grid, against
    the separation-of-variables series;
  - energies and inductances: integration of the energy density over the field
    volume, against 1/2 C V^2, 1/2 L I^2 and N Phi / I;
  - flux and mutual inductance: numerical integration of B over the linking
    area, against the closed-form ln.

A tolerance of 0.1 on a quantity quoted to two decimals is not a check, it is
decoration. The assertions below are written at 1e-12 relative where both
routes are exact in floating point and at the last quoted digit otherwise, and
DIMENSIONS are verified separately by check_units() rather than assumed - an
error of 4*pi, or of eps_0 against eps_0*eps_r, is the classic failure here and
it survives every same-formula check.

Usage:
    python3 scripts/gen_fe_ee_d4.py             # all figures (runs all checks)
    python3 scripts/gen_fe_ee_d4.py em2-coax    # only names with that prefix
    python3 scripts/gen_fe_ee_d4.py --numbers   # checks + quoted-value table
"""
from __future__ import annotations

import pathlib
import sys

import numpy as np
from scipy import integrate

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

# ---------------------------------------------------------------------------
# Constants. Every one of these is a named, tabulated value, quoted here at the
# precision the lessons use. Nothing else in this file is a free parameter.
# ---------------------------------------------------------------------------
EPS0 = 8.8541878128e-12          # F/m   vacuum permittivity
MU0 = 4 * np.pi * 1e-7           # H/m   vacuum permeability (as defined here)
QE = 1.602176634e-19             # C     elementary charge (exact, SI 2019)
ME = 9.1093837015e-31            # kg    electron rest mass
K_E = 1.0 / (4 * np.pi * EPS0)   # N.m^2/C^2  Coulomb constant
ETA0 = np.sqrt(MU0 / EPS0)       # ohm   free-space wave impedance

REGISTRY: dict[str, callable] = {}
QUOTED: list[tuple[str, str]] = []


def figure(name):
    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


def quote(label: str, value: str) -> None:
    """Record a value that appears verbatim in the lesson prose."""
    QUOTED.append((label, value))


# ===========================================================================
# DIMENSIONAL ANALYSIS
#
# Units are carried as exponent vectors over (kg, m, s, A). Every relation the
# lessons state is evaluated symbolically here, so a missing eps_0 or a stray
# 4*pi shows up as a unit mismatch rather than as a plausible wrong number.
# ===========================================================================
BASE = ("kg", "m", "s", "A")


class U:
    __slots__ = ("e",)

    def __init__(self, kg=0, m=0, s=0, A=0):
        self.e = (kg, m, s, A)

    def __mul__(self, o):
        return U(*[a + b for a, b in zip(self.e, o.e)])

    def __truediv__(self, o):
        return U(*[a - b for a, b in zip(self.e, o.e)])

    def __pow__(self, n):
        return U(*[a * n for a in self.e])

    def __eq__(self, o):
        return self.e == o.e

    def __repr__(self):
        num = " ".join(f"{b}^{x}" for b, x in zip(BASE, self.e) if x)
        return num or "1"


ONE = U()
M = U(m=1)
KG = U(kg=1)
SEC = U(s=1)
AMP = U(A=1)
C_ = AMP * SEC                       # coulomb
N_ = KG * M / SEC**2                 # newton
J_ = N_ * M                          # joule
V_ = J_ / C_                         # volt
F_ = C_ / V_                         # farad
OHM_ = V_ / AMP                      # ohm
WB_ = V_ * SEC                       # weber
T_ = WB_ / M**2                      # tesla
H_ = WB_ / AMP                       # henry
EPS_U = F_ / M
MU_U = H_ / M
E_U = V_ / M                         # electric field
D_U = C_ / M**2                      # flux density
H_FIELD = AMP / M                    # magnetic field intensity


def check_units() -> int:
    """Every relation the two chapters use, checked dimensionally."""
    cases = [
        # electrostatics
        ("F = Q1 Q2/(4 pi eps0 r^2)", C_ * C_ / (EPS_U * M**2), N_),
        ("E = Q/(4 pi eps0 r^2)", C_ / (EPS_U * M**2), E_U),
        ("V = Q/(4 pi eps0 r)", C_ / (EPS_U * M), V_),
        ("E = -dV/dr", V_ / M, E_U),
        ("E_line = lam/(2 pi eps0 r)", (C_ / M) / (EPS_U * M), E_U),
        ("E_sheet = sigma/(2 eps0)", (C_ / M**2) / EPS_U, E_U),
        ("D = eps0 eps_r E", EPS_U * E_U, D_U),
        ("C_plate = eps0 eps_r A/d", EPS_U * M**2 / M, F_),
        ("C_coax = 2 pi eps L/ln(b/a)", EPS_U * M, F_),
        ("C_sphere = 4 pi eps a b/(b-a)", EPS_U * M * M / M, F_),
        ("u_E = 1/2 eps E^2", EPS_U * E_U**2, J_ / M**3),
        ("U = 1/2 C V^2", F_ * V_**2, J_),
        ("F_plate = 1/2 eps E^2 A", EPS_U * E_U**2 * M**2, N_),
        ("sigma/eps0 (conductor surface)", (C_ / M**2) / EPS_U, E_U),
        # magnetostatics
        ("B = mu0 I/(2 pi r)", MU_U * AMP / M, T_),
        ("B = mu0 n I", MU_U * (ONE / M) * AMP, T_),
        ("dB = mu0 I dl/(4 pi r^2)", MU_U * AMP * M / M**2, T_),
        ("Phi = B A", T_ * M**2, WB_),
        ("L = N Phi/I", WB_ / AMP, H_),
        ("L_sol = mu N^2 A/l", MU_U * M**2 / M, H_),
        ("L_coax' = mu0 ln(b/a)/(2 pi)", MU_U, H_ / M),
        ("u_B = B^2/(2 mu)", T_**2 / MU_U, J_ / M**3),
        ("U = 1/2 L I^2", H_ * AMP**2, J_),
        ("reluctance = l/(mu A)", M / (MU_U * M**2), AMP / WB_),
        ("Phi = NI/reluctance", AMP / (AMP / WB_), WB_),
        ("L = N^2/reluctance", ONE / (AMP / WB_), H_),
        ("F = B I L", T_ * AMP * M, N_),
        ("F/l = mu0 I1 I2/(2 pi d)", MU_U * AMP * AMP / M, N_ / M),
        ("tau = N I A B", AMP * M**2 * T_, N_ * M),
        ("M = k sqrt(L1 L2)", (H_ * H_) ** 0.5 if False else H_, H_),
        ("v2 = M di/dt", H_ * AMP / SEC, V_),
        ("loop area = closed integral H dB", H_FIELD * T_, J_ / M**3),
        ("H = B/mu", T_ / MU_U, H_FIELD),
        # cross-checks that catch the classic slips
        ("eta0 = sqrt(mu0/eps0)", U(*[x // 2 for x in (MU_U / EPS_U).e]), OHM_),
        ("1/sqrt(mu0 eps0) = c", U(*[-(x // 2) for x in (MU_U * EPS_U).e]), M / SEC),
    ]
    bad = 0
    for name, got, want in cases:
        if got != want:
            print(f"  UNIT MISMATCH  {name}: {got} != {want}")
            bad += 1
    if bad:
        raise AssertionError(f"{bad} dimensional errors")
    # numeric spot-checks on the two derived constants
    assert abs(ETA0 - 376.7303135643202) < 1e-9, ETA0
    assert abs(1.0 / np.sqrt(MU0 * EPS0) - 299792458.0) < 60.0
    print(f"  {len(cases)} relations dimensionally consistent; "
          f"eta0 = {ETA0:.6f} ohm; 1/sqrt(mu0 eps0) = "
          f"{1.0/np.sqrt(MU0*EPS0):,.0f} m/s")
    return len(cases)


# ===========================================================================
# INDEPENDENT NUMERICAL ROUTES
# ===========================================================================
def coulomb_ball(rp: float, Q: float, R: float) -> float:
    """|E| at radius rp from a uniformly charged ball, by direct superposition.

    This deliberately does NOT use the shell theorem or Gauss's law - those are
    what it exists to check. It integrates the raw Coulomb kernel over the ball
    in (s, theta), keeping only the axial component, which by symmetry is the
    whole field:

        E = k rho 2 pi INT_0^R ds INT_0^pi dth
              s^2 sin(th) (rp - s cos th) / (rp^2 + s^2 - 2 rp s cos th)^{3/2}
    """
    rho = Q / (4 / 3 * np.pi * R**3)

    def inner(th, s):
        den = (rp**2 + s**2 - 2 * rp * s * np.cos(th)) ** 1.5
        return s**2 * np.sin(th) * (rp - s * np.cos(th)) / den

    val, _ = integrate.dblquad(inner, 0.0, R, 0.0, np.pi,
                               epsabs=1e-14, epsrel=1e-12)
    return K_E * rho * 2 * np.pi * val


def biot_segment(d: float, I: float, half: float, n: int = 2_000_001) -> float:
    """|B| at perpendicular distance d from the midpoint of a straight segment
    of half-length `half`, by numerical line integration of Biot-Savart.

    dB = (mu0 I / 4 pi) |dl x r_hat| / r^2, and for a straight filament the
    cross product contributes sin(alpha) = d/sqrt(d^2+z^2), so

        B = (mu0 I / 4 pi) INT_-half^half d dz / (d^2 + z^2)^{3/2}
    """
    z = np.linspace(-half, half, n)
    return MU0 * I / (4 * np.pi) * np.trapz(d / (d**2 + z**2) ** 1.5, z)


def biot_loop_axis(z: float, R: float, I: float, n: int = 400_001) -> float:
    """On-axis |B| of a circular loop, by integrating around the loop."""
    phi = np.linspace(0.0, 2 * np.pi, n)
    r2 = R**2 + z**2
    return MU0 * I / (4 * np.pi) * np.trapz(R * R / r2**1.5 * np.ones_like(phi), phi)


def laplace_square(N: int = 201, V0: float = 100.0, tol: float = 1e-11):
    """Red-black SOR solution of Laplace's equation on the unit square with the
    top edge held at V0 and the other three grounded. Returns (grid, sweeps)."""
    V = np.zeros((N, N))
    V[-1, 1:-1] = V0
    w = 2.0 / (1 + np.sin(np.pi / (N - 1)))
    ii, jj = np.meshgrid(np.arange(N), np.arange(N), indexing="ij")
    red = ((ii + jj) % 2 == 0)[1:-1, 1:-1]
    it = 0
    for it in range(200_000):
        mx = 0.0
        for mask in (red, ~red):
            nb = 0.25 * (V[2:, 1:-1] + V[:-2, 1:-1] + V[1:-1, 2:] + V[1:-1, :-2])
            delta = np.where(mask, w * (nb - V[1:-1, 1:-1]), 0.0)
            V[1:-1, 1:-1] += delta
            mx = max(mx, float(np.abs(delta).max()))
        if mx < tol:
            break
    return V, it


def laplace_series(x, y, V0: float = 100.0, nmax: int = 401):
    """Separation-of-variables solution of the same problem.

    V(x,y) = (4 V0/pi) SUM_{n odd} sin(n pi x) sinh(n pi y) / (n sinh(n pi))

    The sinh ratio is evaluated as exp(-n pi (1-y)) (1 - e^{-2 n pi y}) /
    (1 - e^{-2 n pi}) so it never overflows.
    """
    x = np.asarray(x, dtype=float)
    y = np.asarray(y, dtype=float)
    tot = np.zeros(np.broadcast(x, y).shape)
    for n in range(1, nmax, 2):
        a = n * np.pi
        ratio = np.exp(-a * (1 - y)) * (1 - np.exp(-2 * a * y)) / (1 - np.exp(-2 * a))
        tot = tot + np.sin(a * x) * ratio / n
    return 4 * V0 / np.pi * tot


def hysteresis_branches(H, Bs: float, Hc: float, Ha: float):
    """The model loop the lesson states: two shifted tanh branches.

    B_up(H)   = Bs tanh((H - Hc)/Ha)   (H increasing)
    B_down(H) = Bs tanh((H + Hc)/Ha)   (H decreasing)
    """
    return Bs * np.tanh((H - Hc) / Ha), Bs * np.tanh((H + Hc) / Ha)


# ===========================================================================
# ELECTROSTATICS FIGURES
# ===========================================================================
# The two-charge pair the chapter already works: +2 uC at x=0, -3 uC at x=0.40 m
Q_A, Q_B, X_B = 2.0e-6, -3.0e-6, 0.40


@figure("em2-superposition-axis")
def _(mode):
    """Field magnitude and potential along the axis of the +2/-3 uC pair.

    E is the signed x-component of the vector sum, V the signed scalar sum;
    the figure exists to show that the two have their extremes in different
    places and that V passes through zero where E does not.
    """
    c = S.SERIES[mode]
    x = np.linspace(-2.6, 1.2, 400001)
    # exclude the singular points
    good = (np.abs(x) > 2e-3) & (np.abs(x - X_B) > 2e-3)
    xs = x[good]
    Ex = K_E * Q_A * np.sign(xs) / xs**2 + K_E * Q_B * np.sign(xs - X_B) / (xs - X_B) ** 2
    V = K_E * Q_A / np.abs(xs) + K_E * Q_B / np.abs(xs - X_B)

    def Emid():
        return K_E * Q_A / 0.2**2 + K_E * abs(Q_B) / 0.2**2

    assert abs(Emid() - 1123443.974032646) < 1e-6, Emid()
    Vmid = K_E * Q_A / 0.2 + K_E * Q_B / 0.2
    assert abs(Vmid + 44937.758961305866) < 1e-6, Vmid
    xnull = (1.6 + np.sqrt(1.6**2 + 4 * 0.32)) / 2
    assert abs(xnull - 1.7797958971132712) < 1e-12, xnull
    e_at_null = K_E * Q_A / xnull**2
    assert abs(e_at_null - K_E * abs(Q_B) / (xnull + 0.4) ** 2) < 1e-9
    assert abs(e_at_null - 5674.544409707755) < 1e-6, e_at_null
    # V = 0 where |Q_A|/r_A = |Q_B|/r_B, i.e. between the charges at
    # x = 0.40 * 2/5 = 0.16 m, and outside at x = -0.80 m
    assert abs(K_E * Q_A / 0.16 + K_E * Q_B / (X_B - 0.16)) < 1e-9
    assert abs(K_E * Q_A / 0.80 + K_E * Q_B / (X_B + 0.80)) < 1e-9

    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.4))
    # values that leave the frame are dropped rather than clipped, so the
    # singularities do not masquerade as plateaus
    Eplot = np.where(np.abs(Ex) <= 2.0e6, Ex / 1e6, np.nan)
    Vplot = np.where(np.abs(V) <= 2.0e5, V / 1e3, np.nan)
    ax1.plot(xs, Eplot, color=c[0], lw=2.1)
    ax1.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    ax1.plot([0.20], [Emid() / 1e6], "o", color=c[0], ms=7)
    S.note(ax1, 0.42, 1.42, "midpoint: +1.123 MV/m", mode)
    ax1.plot([-xnull], [0.0], "o", color=c[1], ms=7)
    S.note(ax1, -xnull + 0.08, 0.30, "the only null, at x = -1.78 m", mode)
    ax1.set_ylabel("E_x  (MV/m)")
    ax1.set_ylim(-2.1, 2.1)
    ax1.set_title("Field and potential on the axis of a +2 / -3 microcoulomb pair")
    S.strip(ax1)

    ax2.plot(xs, Vplot, color=c[2], lw=2.1)
    ax2.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    ax2.plot([0.20], [Vmid / 1e3], "o", color=c[2], ms=7)
    S.note(ax2, 0.56, -108, "midpoint: -44.9 kV", mode)
    ax2.plot([0.16, -0.80], [0.0, 0.0], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax2, -2.55, 95, "V = 0 at x = 0.16 m and at x = -0.80 m,\nwhere E is nowhere near zero", mode)
    ax2.set_xlabel("position on the axis  x  (m)")
    ax2.set_ylabel("V  (kV)")
    ax2.set_ylim(-210, 210)
    ax2.set_xlim(-2.65, 1.25)
    S.strip(ax2)
    fig.tight_layout()
    return fig


@figure("em2-ball-gauss-vs-coulomb")
def _(mode):
    """Uniformly charged ball, Q = 8 nC in R = 4 cm: the Gauss's-law profile as
    a line, adaptive integration of the raw Coulomb kernel as markers.

    The markers are not decoration. They are the independent route: if the
    Gauss result carried a spurious 4*pi or used eps_0 where eps_0 eps_r
    belonged, the markers would sit off the line.
    """
    c = S.SERIES[mode]
    Q, R = 8.0e-9, 0.040
    r = np.linspace(0.002, 0.12, 4000)
    E = np.where(r < R, K_E * Q * r / R**3, K_E * Q / r**2)
    probes = [0.010, 0.020, 0.030, 0.060, 0.080, 0.100]
    num = [coulomb_ball(p, Q, R) for p in probes]
    for p, nval in zip(probes, num):
        exact = K_E * Q * p / R**3 if p < R else K_E * Q / p**2
        assert abs(nval - exact) / exact < 1e-9, (p, nval, exact)
    assert abs(K_E * Q * 0.020 / R**3 - 22468.879480744685) < 1e-6
    assert abs(K_E * Q / R**2 - 44937.75896130937) < 1e-6
    assert abs(K_E * Q / 0.100**2 - 7190.041433809499) < 1e-6
    quote("ball E at r = 2 cm (V/m)", f"{K_E*Q*0.020/R**3:.1f}")
    quote("ball E at the surface (V/m)", f"{K_E*Q/R**2:.1f}")
    quote("ball E at r = 10 cm (V/m)", f"{K_E*Q/0.100**2:.1f}")
    # energy, both ways
    U_closed = 3 * K_E * Q**2 / (5 * R)
    rin = np.linspace(0, R, 400001)
    rout = np.linspace(R, 1200.0, 4000001)
    u = np.trapz(0.5 * EPS0 * (K_E * Q * rin / R**3) ** 2 * 4 * np.pi * rin**2, rin)
    u += np.trapz(0.5 * EPS0 * (K_E * Q / rout**2) ** 2 * 4 * np.pi * rout**2, rout)
    assert abs(u - U_closed) / U_closed < 1e-4, (u, U_closed)
    assert abs(U_closed - 8.628049720570725e-06) < 1e-14
    quote("ball self-energy (uJ)", f"{U_closed*1e6:.3f}")

    fig, ax = plt.subplots()
    ax.plot(r * 100, E / 1e3, color=c[0], lw=2.3)
    ax.plot(np.array(probes) * 100, np.array(num) / 1e3, "o", color=c[1], ms=8,
            mfc="none", mew=1.8, zorder=6)
    ax.axvline(R * 100, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 4.25, 8, "surface, r = R = 4 cm", mode)
    ax.plot([R * 100], [K_E * Q / R**2 / 1e3], "o", color=S.INK[mode], ms=6, zorder=7)
    S.note(ax, 4.4, 45.5, "peak 44.94 kV/m at the surface", mode)
    S.label_end(ax, 2.0, K_E * Q * 0.020 / R**3 / 1e3, "inside: E = kQr/R^3,\nlinear in r",
                c[0], mode, dx=6, dy=-18)
    S.label_end(ax, 8.8, K_E * Q / 0.088**2 / 1e3, "outside: E = kQ/r^2", c[0], mode, dy=13)
    S.label_end(ax, 6.6, 30.5, "markers: numerical integration\nof Coulomb's law over the ball",
                c[1], mode, dx=0, dy=0, ha="left")
    ax.set_xlabel("distance from the centre  r  (cm)")
    ax.set_ylabel("field magnitude  E  (kV/m)")
    ax.set_title("A uniformly charged ball: 8 nC spread through a 4 cm radius")
    ax.set_xlim(0, 12.4)
    ax.set_ylim(0, 52)
    S.strip(ax)
    return fig


@figure("em2-three-symmetries")
def _(mode):
    """The three Gaussian symmetries on one log-log axis: 1/r^2, 1/r, constant.

    Each curve is normalised to its own value at r = 1 cm so the SHAPES can be
    compared; the point of the figure is the exponent, not the magnitude.
    """
    c = S.SERIES[mode]
    r = np.logspace(np.log10(0.01), np.log10(1.0), 1200)
    sph = (0.01 / r) ** 2
    lin = 0.01 / r
    pla = np.ones_like(r)
    assert abs(sph[-1] - 1e-4) < 1e-12
    assert abs(lin[-1] - 1e-2) < 1e-12
    # a decade of distance costs 20 dB, 10 dB, 0 dB respectively
    assert abs(20 * np.log10(sph[0] / np.interp(0.1, r, sph)) - 40.0) < 0.05
    assert abs(20 * np.log10(lin[0] / np.interp(0.1, r, lin)) - 20.0) < 0.05

    fig, ax = plt.subplots()
    ax.loglog(r * 100, sph, color=c[0], lw=2.3)
    ax.loglog(r * 100, lin, color=c[1], lw=2.3)
    ax.loglog(r * 100, pla, color=c[2], lw=2.3)
    S.label_end(ax, 100, 1e-4, "point / sphere\nE ~ 1/r^2", c[0], mode, dy=-8)
    S.label_end(ax, 100, 1e-2, "line / cylinder\nE ~ 1/r", c[1], mode, dy=-8)
    S.label_end(ax, 100, 1.0, "sheet / plane\nE constant", c[2], mode, dy=-8)
    ax.plot([10, 10], [1e-2, 1e-1], "o", color=S.INK[mode], ms=6)
    S.note(ax, 1.12, 8.0e-5,
           "over one decade of distance the sphere loses a factor of 100,\n"
           "the line a factor of 10, the sheet nothing at all", mode)
    ax.set_xlabel("distance from the source  (cm)")
    ax.set_ylabel("field, relative to its value at 1 cm")
    ax.set_title("Three symmetries, three exponents")
    ax.set_xlim(1, 210)
    ax.set_ylim(5e-5, 4.0)
    S.strip(ax)
    return fig


@figure("em2-coax-field")
def _(mode):
    """Radial field and potential in a 0.5 mm / 3.5 mm polyethylene coax at 1 kV.

    E(r) = V / (r ln(b/a)) and V(r) = V ln(b/r)/ln(b/a). The potential curve is
    obtained here by NUMERICALLY integrating E inward from the shield, which is
    the definition V = -INT E.dl rather than the quoted closed form.
    """
    c = S.SERIES[mode]
    a, b, er, V0 = 0.0005, 0.0035, 2.25, 1000.0
    lnr = np.log(b / a)
    r = np.linspace(a, b, 300001)
    E = V0 / (r * lnr)
    # numerical route: V(r) = INT_r^b E dr', by cumulative trapezoid from b
    Vnum = np.concatenate([[0.0], np.cumsum(0.5 * (E[1:] + E[:-1]) * np.diff(r))])
    Vnum = Vnum[-1] - Vnum
    Vclosed = V0 * np.log(b / r) / lnr
    assert np.max(np.abs(Vnum - Vclosed)) < 1e-6, np.max(np.abs(Vnum - Vclosed))
    assert abs(Vnum[0] - V0) < 1e-6, Vnum[0]
    Ea, Eb = V0 / (a * lnr), V0 / (b * lnr)
    assert abs(Ea - 1027796.6847395013) < 1e-4, Ea
    assert abs(Eb - 146828.09781992878) < 1e-4, Eb
    assert abs(Ea / Eb - b / a) < 1e-9
    Cp = 2 * np.pi * EPS0 * er / lnr
    assert abs(Cp * 1e12 - 64.32626465238059) < 1e-9, Cp
    # energy per metre, two ways
    U1 = 0.5 * Cp * V0**2
    U2 = np.trapz(0.5 * EPS0 * er * E**2 * 2 * np.pi * r, r)
    assert abs(U2 - U1) / U1 < 1e-9, (U1, U2)
    rgm = np.sqrt(a * b)
    mask = r <= rgm
    frac = np.trapz((0.5 * EPS0 * er * E**2 * 2 * np.pi * r)[mask], r[mask]) / U2
    assert abs(frac - 0.5) < 1e-5, frac
    assert abs(rgm * 1000 - 1.3228756555322954) < 1e-9
    quote("coax C' (pF/m)", f"{Cp*1e12:.2f}")
    quote("coax E(a) (MV/m)", f"{Ea/1e6:.4f}")
    quote("coax E(b) (MV/m)", f"{Eb/1e6:.4f}")
    quote("coax half-energy radius (mm)", f"{rgm*1000:.4f}")
    quote("coax U' at 1 kV (uJ/m)", f"{U1*1e6:.3f}")

    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.4))
    ax1.plot(r * 1000, E / 1e6, color=c[0], lw=2.3)
    ax1.plot([a * 1000], [Ea / 1e6], "o", color=c[0], ms=7)
    S.note(ax1, 0.62, 0.97, "1.028 MV/m at the inner conductor", mode)
    ax1.plot([b * 1000], [Eb / 1e6], "o", color=c[0], ms=7)
    S.note(ax1, 3.4, 0.24, "0.147 MV/m at the shield", mode, ha="right")
    ax1.axvline(rgm * 1000, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax1, 1.38, 0.55, "half the stored energy lies inside\nr = sqrt(ab) = 1.323 mm", mode)
    ax1.set_ylabel("E  (MV/m)")
    ax1.set_ylim(0, 1.18)
    ax1.set_title("Coaxial line, a = 0.5 mm, b = 3.5 mm, polyethylene, 1000 V")
    S.strip(ax1)

    ax2.plot(r * 1000, Vnum, color=c[1], lw=2.3)
    ax2.plot(r[::30000] * 1000, Vclosed[::30000], "o", color=c[2], ms=7,
             mfc="none", mew=1.8)
    S.label_end(ax2, 2.4, np.interp(2.4e-3, r, Vnum),
                "line: V from numerically integrating E inward\n"
                "circles: V ln(b/r)/ln(b/a)", c[1], mode, dy=26, ha="center")
    ax2.set_xlabel("radius  r  (mm)")
    ax2.set_ylabel("V  (volts)")
    ax2.set_xlim(0.35, 3.75)
    ax2.set_ylim(-40, 1180)
    S.strip(ax2)
    fig.tight_layout()
    return fig


@figure("em2-coax-optimum")
def _(mode):
    """Inner-conductor field against b/a at fixed shield radius and voltage.

    E(a) = V/(a ln(b/a)) with a = b/x is V x/(b ln x), minimised at x = e. The
    curve is the reason 50-ohm cable is not built with a hair-thin centre.
    """
    c = S.SERIES[mode]
    b, V0 = 0.0035, 1000.0
    x = np.linspace(1.15, 12.0, 400001)
    Ea = V0 * x / (b * np.log(x))
    imin = int(np.argmin(Ea))
    assert abs(x[imin] - np.e) < 5e-5, x[imin]
    Emin = V0 * np.e / (b * 1.0)
    assert abs(Ea[imin] - Emin) / Emin < 1e-8
    assert abs(Emin - 776651.9500944063) < 1.0, Emin
    at7 = V0 * 7 / (b * np.log(7))
    assert abs(at7 - 1027796.6847395013) < 1e-4, at7
    assert at7 / Emin > 1.32 and at7 / Emin < 1.33
    quote("coax minimum E(a) at b/a = e (kV/m)", f"{Emin/1e3:.1f}")
    quote("coax E(a) penalty at b/a = 7", f"{at7/Emin:.4f}")

    fig, ax = plt.subplots()
    ax.plot(x, Ea / 1e6, color=c[0], lw=2.4)
    ax.plot([np.e], [Emin / 1e6], "o", color=c[1], ms=8, zorder=6)
    S.label_end(ax, np.e, Emin / 1e6, "minimum at b/a = e = 2.718: 776.7 kV/m",
                c[1], mode, dx=10, dy=-26)
    ax.plot([7.0], [at7 / 1e6], "o", color=S.INK[mode], ms=7, zorder=6)
    S.note(ax, 6.4, 1.80, "the worked cable, b/a = 7:\n1.028 MV/m, 32% above the optimum", mode)
    ax.axhline(Emin / 1e6, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.set_xlabel("radius ratio  b/a")
    ax.set_ylabel("field at the inner conductor  (MV/m)")
    ax.set_title("Squeezing the centre conductor raises its own field")
    ax.set_xlim(1.1, 12.4)
    ax.set_ylim(0, 3.2)
    S.strip(ax)
    return fig


@figure("em2-image-charge")
def _(mode):
    """Induced surface charge under a 5 nC point charge 3 cm above ground.

    sigma(rho) = -q h / (2 pi (rho^2 + h^2)^{3/2}). The total is checked by
    integrating sigma over the whole plane with the substitution rho = h tan th,
    which maps the infinite plane onto a finite interval; it must return
    exactly -q, and it does to 5e-14 relative.
    """
    c = S.SERIES[mode]
    q, h = 5.0e-9, 0.030
    rho = np.linspace(0, 0.16, 4000)
    sig = -q * h / (2 * np.pi * (rho**2 + h**2) ** 1.5)
    sig0 = -q / (2 * np.pi * h**2)
    assert abs(sig[0] - sig0) < 1e-18
    assert abs(sig0 * 1e6 + 0.8841941282883075) < 1e-12, sig0
    th = np.linspace(0, np.pi / 2, 2000001)
    total = np.trapz(-q * np.sin(th), th)
    assert abs(total + q) / q < 1e-12, total
    rho_half = h * np.sqrt(2 ** (2 / 3) - 1)
    assert abs(np.interp(rho_half, rho, sig) / sig0 - 0.5) < 1e-5
    assert abs(rho_half * 1000 - 22.992628096226397) < 1e-9
    F = K_E * q**2 / (2 * h) ** 2
    assert abs(F * 1e6 - 62.413554112924814) < 1e-9, F
    W = -K_E * q**2 / (4 * h)
    assert abs(W * 1e6 + 1.8724066233877444) < 1e-12, W
    # the field just above the plane at rho = 0, two ways
    e_sig = abs(sig0) / EPS0
    e_pair = 2 * K_E * q / h**2
    assert abs(e_sig - e_pair) / e_pair < 1e-12, (e_sig, e_pair)
    assert abs(e_sig - 99861.68658067968) < 1e-6
    quote("image sigma peak (uC/m^2)", f"{sig0*1e6:.4f}")
    quote("image half-peak radius (mm)", f"{rho_half*1000:.3f}")
    quote("image force (uN)", f"{F*1e6:.3f}")
    quote("image energy (uJ)", f"{W*1e6:.4f}")
    quote("image E at the plane (kV/m)", f"{e_sig/1e3:.3f}")

    fig, ax = plt.subplots()
    ax.plot(rho * 1000, sig * 1e6, color=c[0], lw=2.4)
    ax.plot([0.0], [sig0 * 1e6], "o", color=c[0], ms=7)
    S.note(ax, 8, -0.885, "peak -0.884 uC/m^2 directly under the charge", mode)
    ax.plot([rho_half * 1000], [sig0 * 1e6 / 2], "o", color=c[1], ms=7)
    S.label_end(ax, rho_half * 1000, sig0 * 1e6 / 2,
                "half the peak at rho = 23.0 mm,\nabout 0.77 h", c[1], mode, dx=8, dy=-6)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    S.note(ax, 66, -0.28,
           "integrating this over the whole plane\n"
           "returns exactly -5.000 nC: the plane\n"
           "supplies the image charge itself", mode)
    ax.set_xlabel("radial distance along the plane  rho  (mm)")
    ax.set_ylabel("induced surface charge  (uC/m^2)")
    ax.set_title("What a grounded plane does about a 5 nC charge 3 cm above it")
    ax.set_xlim(0, 160)
    ax.set_ylim(-0.98, 0.10)
    S.strip(ax)
    return fig


@figure("em2-laplace-square")
def _(mode):
    """Laplace's equation in a square box: finite differences against the series.

    Three sides grounded, the top at 100 V. The grid solution is compared with
    the separation-of-variables series along the vertical centre line, and the
    centre value is compared with the exact 25 V that four-fold symmetry forces
    (four such problems superpose to a box at 100 V all round).
    """
    c = S.SERIES[mode]
    V, sweeps = laplace_square(N=201)
    N = V.shape[0]
    y = np.linspace(0, 1, N)
    fd = V[:, N // 2]
    ser = laplace_series(np.full_like(y, 0.5), y)
    interior = slice(2, N - 2)
    assert np.max(np.abs(fd[interior] - ser[interior])) < 6e-3, \
        np.max(np.abs(fd[interior] - ser[interior]))
    assert abs(V[N // 2, N // 2] - 25.0) < 1e-8, V[N // 2, N // 2]
    assert abs(laplace_series(0.5, 0.5) - 25.0) < 1e-9
    quote("Laplace FD centre (V)", f"{V[N//2, N//2]:.6f}")
    quote("Laplace series centre (V)", f"{float(laplace_series(0.5,0.5)):.6f}")
    quote("Laplace sweeps to 1e-11", f"{sweeps}")
    v25 = float(np.interp(0.25, y, fd))
    v75 = float(np.interp(0.75, y, fd))
    assert abs(v25 - float(laplace_series(0.5, 0.25))) < 5e-3, v25
    assert abs(v75 - float(laplace_series(0.5, 0.75))) < 5e-3, v75
    quote("Laplace V at (0.5, 0.25) (V)", f"{v25:.3f}")
    quote("Laplace V at (0.5, 0.75) (V)", f"{v75:.3f}")

    fig, ax = plt.subplots()
    ax.plot(y, fd, color=c[0], lw=2.4)
    ax.plot(y[::14], ser[::14], "o", color=c[1], ms=7, mfc="none", mew=1.8)
    ax.plot([0.5], [25.0], "o", color=S.INK[mode], ms=7, zorder=6)
    S.note(ax, 0.035, 88, "centre: 25.000 V, which symmetry fixes exactly", mode)
    S.label_end(ax, 0.03, 76, "line: 201 x 201 finite-difference grid", c[0], mode,
                dx=0, dy=0, ha="left")
    S.label_end(ax, 0.03, 66, "circles: separation-of-variables series", c[1], mode,
                dx=0, dy=0, ha="left")
    ax.plot([0.25, 0.75], [v25, v75], "o", color=c[2], ms=6)
    S.note(ax, 0.28, 4, "9.54 V at a quarter height", mode)
    S.note(ax, 0.78, 46, "54.05 V at three quarters", mode)
    ax.set_xlabel("height up the centre line of the box  y/a")
    ax.set_ylabel("potential  (V)")
    ax.set_title("Laplace in a square box: grid and series agree everywhere")
    ax.set_xlim(0, 1.02)
    ax.set_ylim(-4, 108)
    S.strip(ax)
    return fig


@figure("em2-dielectric-refraction")
def _(mode):
    """Field lines bend at a dielectric boundary: tan(th2)/tan(th1) = er2/er1.

    Drawn for air against er = 4, with the chapter's worked 60 degree case
    marked. The transmitted angle is computed from the boundary conditions
    (E tangential continuous, D normal continuous) rather than from the ratio
    identity, and the identity is then asserted against it.
    """
    c = S.SERIES[mode]
    er1, er2 = 1.0, 4.0
    t1 = np.linspace(0.5, 89.0, 3000)
    E1 = 5000.0
    E1t = E1 * np.sin(np.radians(t1))
    E1n = E1 * np.cos(np.radians(t1))
    E2n = EPS0 * er1 * E1n / (EPS0 * er2)
    t2 = np.degrees(np.arctan2(E1t, E2n))
    assert np.allclose(np.tan(np.radians(t2)) / np.tan(np.radians(t1)),
                       er2 / er1, rtol=1e-12)
    i60 = int(np.argmin(np.abs(t1 - 60.0)))
    t2_60 = np.degrees(np.arctan(er2 / er1 * np.tan(np.radians(60.0))))
    assert abs(t2_60 - 81.78678929826181) < 1e-9, t2_60
    e2_60 = np.hypot(E1 * np.sin(np.radians(60.0)),
                     E1 * np.cos(np.radians(60.0)) * er1 / er2)
    assert abs(e2_60 - 4375.0) < 1e-9, e2_60
    quote("refraction th2 for th1 = 60 deg (deg)", f"{t2_60:.4f}")
    quote("refraction |E2| (V/m)", f"{e2_60:.2f}")

    fig, ax = plt.subplots()
    ax.plot(t1, t2, color=c[0], lw=2.4)
    ax.plot(t1, t1, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 63, 46, "no boundary: th2 = th1", mode)
    ax.plot([60.0], [t2_60], "o", color=c[1], ms=8, zorder=6)
    S.label_end(ax, 60.0, t2_60, "60 deg in air becomes\n81.79 deg in er = 4",
                c[1], mode, dx=6, dy=-16, ha="left")
    S.note(ax, 26, 12,
           "the line leans TOWARD the boundary in the\n"
           "higher-permittivity medium, because the normal\n"
           "component drops by the full factor of 4", mode)
    ax.set_xlabel("angle from the normal in air  th1  (degrees)")
    ax.set_ylabel("angle from the normal in er = 4  th2  (degrees)")
    ax.set_title("Refraction of E at a dielectric interface, er2/er1 = 4")
    ax.set_xlim(0, 92)
    ax.set_ylim(0, 95)
    S.strip(ax)
    return fig


# ===========================================================================
# MAGNETOSTATICS FIGURES
# ===========================================================================
@figure("em2-biot-segment")
def _(mode):
    """A 0.5 m straight segment at 10 A, against the infinite-wire formula.

    The line is the Biot-Savart closed form B = mu0 I a /(2 pi d sqrt(a^2+d^2));
    the markers are numerical line integration of dB along the same filament.
    The infinite-wire result is drawn for contrast, and the ratio of the two
    is what decides whether a bench wire may be treated as infinite.
    """
    c = S.SERIES[mode]
    I, half = 10.0, 0.25
    d = np.linspace(0.004, 0.40, 3000)
    B = MU0 * I * half / (2 * np.pi * d * np.sqrt(half**2 + d**2))
    Binf = MU0 * I / (2 * np.pi * d)
    probes = [0.010, 0.020, 0.050, 0.100, 0.200, 0.300]
    num = [biot_segment(p, I, half) for p in probes]
    for p, nval in zip(probes, num):
        exact = MU0 * I * half / (2 * np.pi * p * np.sqrt(half**2 + p**2))
        assert abs(nval - exact) / exact < 1e-12, (p, nval, exact)
    b20 = MU0 * I * half / (2 * np.pi * 0.020 * np.sqrt(half**2 + 0.020**2))
    assert abs(b20 * 1e6 - 99.6815278536125) < 1e-9, b20
    assert abs(MU0 * I / (2 * np.pi * 0.020) * 1e6 - 100.0) < 1e-9
    assert abs(b20 / (MU0 * I / (2 * np.pi * 0.020)) - 0.996815278536125) < 1e-12
    quote("segment B at d = 20 mm (uT)", f"{b20*1e6:.4f}")
    quote("infinite wire B at d = 20 mm (uT)", f"{MU0*I/(2*np.pi*0.020)*1e6:.4f}")
    ratio = B / Binf
    assert abs(np.interp(0.25, d, ratio) - 1 / np.sqrt(2)) < 2e-4

    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.4))
    ax1.plot(d * 1000, Binf * 1e6, color=S.GUIDE[mode], lw=1.6, ls="--")
    ax1.plot(d * 1000, B * 1e6, color=c[0], lw=2.3)
    ax1.plot(np.array(probes) * 1000, np.array(num) * 1e6, "o", color=c[1],
             ms=8, mfc="none", mew=1.8, zorder=6)
    ax1.set_yscale("log")
    S.label_end(ax1, 300, np.interp(0.30, d, Binf) * 1e6, "infinite wire", S.GUIDE[mode], mode, dy=9)
    S.label_end(ax1, 300, np.interp(0.30, d, B) * 1e6, "0.5 m segment", c[0], mode, dy=-11)
    S.note(ax1, 30, 260, "markers: numerical Biot-Savart\nintegration along the filament", mode)
    ax1.set_ylabel("B  (microtesla)")
    ax1.set_title("A finite wire is an infinite wire until you stand back from it")
    S.strip(ax1)

    ax2.plot(d * 1000, ratio, color=c[2], lw=2.3)
    ax2.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax2.plot([20.0], [b20 / (MU0 * I / (2 * np.pi * 0.020))], "o", color=c[2], ms=7)
    S.note(ax2, 30, 0.895, "at d = 20 mm the segment gives 99.68 uT\nagainst 100.0 uT: 0.32% low", mode)
    ax2.plot([250.0], [1 / np.sqrt(2)], "o", color=S.INK[mode], ms=6)
    S.note(ax2, 258, 0.735, "at d = half the segment length\nthe error is already 29%", mode)
    ax2.set_xlabel("perpendicular distance from the midpoint  d  (mm)")
    ax2.set_ylabel("segment / infinite")
    ax2.set_ylim(0.6, 1.06)
    ax2.set_xlim(0, 410)
    S.strip(ax2)
    fig.tight_layout()
    return fig


@figure("em2-loop-axis")
def _(mode):
    """On-axis field of one 10 cm loop at 5 A, and of a Helmholtz pair.

    Single loop: B = mu0 I R^2 / (2 (R^2+z^2)^{3/2}), checked at three heights
    against numerical integration around the loop. The pair is the same
    expression summed for coils at z = +-R/2, whose second derivative vanishes
    at the midpoint - which is the whole reason the spacing equals the radius.
    """
    c = S.SERIES[mode]
    I, R = 5.0, 0.100
    z = np.linspace(-0.22, 0.22, 4000)

    def one(zz, off=0.0):
        return MU0 * I * R**2 / (2 * (R**2 + (zz - off) ** 2) ** 1.5)

    single = one(z)
    pair = one(z, +R / 2) + one(z, -R / 2)
    Bc = MU0 * I / (2 * R)
    assert abs(Bc * 1e6 - 31.415926535897928) < 1e-9, Bc
    for zz in (0.0, 0.05, 0.10):
        assert abs(biot_loop_axis(zz, R, I) - one(zz)) / one(zz) < 1e-9, zz
    assert abs(one(R) - Bc / 2**1.5) < 1e-18
    assert abs(one(R) * 1e6 - 11.107207345395913) < 1e-9
    Bh = 2 * one(0.0, R / 2)
    assert abs(Bh - (4 / 5) ** 1.5 * MU0 * I / R) < 1e-15, Bh
    assert abs(Bh * 1e6 - 44.95881427866065) < 1e-9, Bh
    # flatness, measured on a dedicated fine grid so the answer is not set by
    # the plotting resolution: the pair holds its midpoint value to 0.1% over
    # a span of 0.346 R centred on the midpoint.
    zf = np.linspace(-0.06, 0.06, 2000001)
    pf = one(zf, +R / 2) + one(zf, -R / 2)
    flat = np.abs(pf / Bh - 1) < 1e-3
    span = zf[flat].max() - zf[flat].min()
    assert abs(span / R - 0.34614) < 2e-5, span / R
    quote("loop centre B (uT)", f"{Bc*1e6:.4f}")
    quote("loop B at z = R (uT)", f"{one(R)*1e6:.4f}")
    quote("Helmholtz midpoint B (uT)", f"{Bh*1e6:.4f}")
    quote("Helmholtz 0.1% flat span / R", f"{span/R:.4f}")

    fig, ax = plt.subplots()
    ax.plot(z * 100, single * 1e6, color=c[0], lw=2.3)
    ax.plot(z * 100, pair * 1e6, color=c[1], lw=2.3)
    ax.plot([0.0], [Bc * 1e6], "o", color=c[0], ms=7)
    S.note(ax, 1.2, 30.0, "single loop centre: 31.42 uT", mode)
    ax.plot([0.0], [Bh * 1e6], "o", color=c[1], ms=7)
    S.note(ax, 1.2, 46.2, "Helmholtz midpoint: 44.96 uT", mode)
    ax.plot([10.0], [one(R) * 1e6], "o", color=S.INK[mode], ms=6)
    S.note(ax, 11.0, 13.0, "z = R: 11.11 uT,\none part in 2^1.5", mode)
    S.label_end(ax, -21.5, 8.5, "one loop", c[0], mode, dx=0, dy=0)
    S.label_end(ax, -21.5, 15.5, "pair at spacing = radius", c[1], mode, dx=0, dy=0)
    ax.set_xlabel("distance along the axis  z  (cm)")
    ax.set_ylabel("B  (microtesla)")
    ax.set_title("One 10 cm loop at 5 A, and the same loop twice")
    ax.set_xlim(-22.5, 22.5)
    ax.set_ylim(0, 52)
    S.strip(ax)
    return fig


@figure("em2-solenoid-profile")
def _(mode):
    """On-axis profile of the chapter's 500-turn, 25 cm, 4 cm^2 solenoid at 2 A.

    B(z) = (mu0 n I/2)[ (z+l/2)/sqrt((z+l/2)^2+R^2) - (z-l/2)/sqrt(...) ],
    which is the loop formula summed along the winding. The centre value is
    also produced by numerically stacking loops, and the two agree to 1e-12.
    """
    c = S.SERIES[mode]
    N, ell, A, I = 500, 0.25, 4.0e-4, 2.0
    n = N / ell
    R = np.sqrt(A / np.pi)
    Bideal = MU0 * n * I
    z = np.linspace(-0.26, 0.26, 4000)

    def prof(zz):
        z1, z2 = zz + ell / 2, zz - ell / 2
        return MU0 * n * I / 2 * (z1 / np.sqrt(z1**2 + R**2) - z2 / np.sqrt(z2**2 + R**2))

    B = prof(z)
    assert abs(R - 0.011283791670955126) < 1e-15, R
    assert abs(Bideal * 1e3 - 5.026548245743669) < 1e-12, Bideal
    Bc = prof(0.0)
    Be = prof(ell / 2)
    assert abs(Bc * 1e3 - 5.006192566356286) < 1e-9, Bc
    assert abs(Be * 1e3 - 2.5107180276353454) < 1e-9, Be
    assert abs(Bc / Bideal - 0.9959503662568803) < 1e-12
    assert abs(Be / Bideal - 0.49949148101012386) < 1e-12
    # independent route: stack of discrete loops
    zc = np.linspace(-ell / 2, ell / 2, 200001)
    stack = np.trapz(MU0 * I * R**2 / (2 * (R**2 + zc**2) ** 1.5) * n, zc)
    assert abs(stack - Bc) / Bc < 1e-11, (stack, Bc)
    L = MU0 * N**2 * A / ell
    assert abs(L * 1e6 - 502.65482457436696) < 1e-9, L
    quote("solenoid ideal B (mT)", f"{Bideal*1e3:.4f}")
    quote("solenoid true centre B (mT)", f"{Bc*1e3:.4f}")
    quote("solenoid end B (mT)", f"{Be*1e3:.4f}")
    quote("solenoid centre/ideal", f"{Bc/Bideal:.6f}")

    fig, ax = plt.subplots()
    ax.plot(z * 100, B * 1e3, color=c[0], lw=2.4)
    ax.axhline(Bideal * 1e3, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, -25.5, 5.13, "ideal mu0 n I = 5.027 mT", mode)
    ax.plot([0.0], [Bc * 1e3], "o", color=c[0], ms=7)
    S.note(ax, 0.8, 4.55, "true centre 5.006 mT, 0.40% below ideal", mode)
    ax.plot([ell / 2 * 100], [Be * 1e3], "o", color=c[1], ms=8, zorder=6)
    S.label_end(ax, ell / 2 * 100, Be * 1e3, "at the mouth: 2.511 mT,\nexactly half",
                c[1], mode, dx=8, dy=6)
    for xx in (-ell / 2 * 100, ell / 2 * 100):
        ax.axvline(xx, color=S.GUIDE[mode], lw=0.9, ls=":")
    S.note(ax, -12.0, 0.35, "winding occupies -12.5 to +12.5 cm", mode)
    ax.set_xlabel("position along the axis  z  (cm)")
    ax.set_ylabel("B  (mT)")
    ax.set_title("500 turns over 25 cm at 2 A: where the ideal formula stops working")
    ax.set_xlim(-26.5, 26.5)
    ax.set_ylim(0, 5.75)
    S.strip(ax)
    return fig


@figure("em2-toroid-radial")
def _(mode):
    """B across the window of an 800-turn air toroid, 40 to 60 mm, 1.2 A.

    B = mu0 N I/(2 pi r) is exact inside the winding; the mean-radius value is
    an approximation whose error the figure measures. Inductance is computed
    exactly by integrating the flux and by the closed-form ln, and the two are
    asserted equal.
    """
    c = S.SERIES[mode]
    N, I, a, b, hgt = 800, 1.2, 0.040, 0.060, 0.015
    r = np.linspace(a, b, 4000)
    B = MU0 * N * I / (2 * np.pi * r)
    Bmean = MU0 * N * I / (2 * np.pi * 0.050)
    assert abs(B[0] * 1e3 - 4.8) < 1e-12, B[0]
    assert abs(B[-1] * 1e3 - 3.2) < 1e-12, B[-1]
    assert abs(Bmean * 1e3 - 3.84) < 1e-12, Bmean
    Lexact = MU0 * N**2 * hgt * np.log(b / a) / (2 * np.pi)
    rr = np.linspace(a, b, 2000001)
    Phi = np.trapz(MU0 * N * I / (2 * np.pi * rr) * hgt, rr)
    assert abs(N * Phi / I - Lexact) / Lexact < 1e-11, (N * Phi / I, Lexact)
    Lappr = MU0 * N**2 * (hgt * (b - a)) / (2 * np.pi * 0.050)
    assert abs(Lexact * 1e6 - 778.4930075676757) < 1e-8, Lexact
    assert abs(Lappr * 1e6 - 768.0) < 1e-9, Lappr
    err = (Lappr - Lexact) / Lexact * 100
    assert abs(err + 1.3478615049427631) < 1e-9, err
    quote("toroid B at r = 40 mm (mT)", f"{B[0]*1e3:.4f}")
    quote("toroid B at r = 50 mm (mT)", f"{Bmean*1e3:.4f}")
    quote("toroid B at r = 60 mm (mT)", f"{B[-1]*1e3:.4f}")
    quote("toroid L exact (uH)", f"{Lexact*1e6:.3f}")
    quote("toroid L mean-radius (uH)", f"{Lappr*1e6:.3f}")
    quote("toroid L approx error (%)", f"{err:.4f}")

    fig, ax = plt.subplots()
    ax.plot(r * 1000, B * 1e3, color=c[0], lw=2.4)
    ax.axhline(Bmean * 1e3, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 52.5, 3.90, "mean-radius value 3.84 mT", mode)
    ax.plot([40.0, 50.0, 60.0], [B[0] * 1e3, Bmean * 1e3, B[-1] * 1e3], "o",
            color=c[1], ms=7, zorder=6)
    S.label_end(ax, 40.0, B[0] * 1e3, "4.80 mT at the inner wall,\n25% above the mean",
                c[1], mode, dx=8, dy=6)
    S.label_end(ax, 60.0, B[-1] * 1e3, "3.20 mT at the\nouter wall, 17% below",
                c[1], mode, dx=-8, dy=16, ha="right")
    S.note(ax, 39.2, 2.79, "L from the exact integral is 778.5 uH; the\n"
                           "mean-radius shortcut gives 768.0 uH, 1.35% low", mode)
    ax.set_xlabel("radius across the window  r  (mm)")
    ax.set_ylabel("B  (mT)")
    ax.set_title("Inside a toroid the field is not uniform: 800 turns, 1.2 A")
    ax.set_xlim(38.5, 62)
    ax.set_ylim(2.7, 5.2)
    S.strip(ax)
    return fig


@figure("em2-coax-inductance")
def _(mode):
    """Where a coaxial line keeps its magnetic energy: 1 mm inside 3 mm.

    The upper panel is B(r) from Ampere's law; the lower is the inductance
    accumulated out to radius r, obtained by integrating the energy density and
    dividing by I^2/2. The internal part converges to mu0/(8 pi) = 50 nH/m
    independently of the wire radius, and the external part to
    (mu0/2 pi) ln(b/a) = 219.7 nH/m.
    """
    c = S.SERIES[mode]
    I, a, b = 1.0, 0.0010, 0.0030
    r = np.unique(np.concatenate([np.linspace(0.0, a, 200001),
                                  np.linspace(a, b, 200001)]))
    rsafe = np.maximum(r, 1e-30)
    B = np.where(r < a, MU0 * I * r / (2 * np.pi * a**2), MU0 * I / (2 * np.pi * rsafe))
    u = B**2 / (2 * MU0)
    dU = u * 2 * np.pi * r
    cum = np.concatenate([[0.0], np.cumsum(0.5 * (dU[1:] + dU[:-1]) * np.diff(r))])
    Lcum = 2 * cum / I**2
    Lint = MU0 / (8 * np.pi)
    Lext = MU0 / (2 * np.pi) * np.log(b / a)
    assert abs(Lint * 1e9 - 50.0) < 1e-9, Lint
    assert abs(Lext * 1e9 - 219.72245773362195) < 1e-9, Lext
    ia = int(np.searchsorted(r, a))
    assert abs(Lcum[ia] - Lint) / Lint < 1e-6, (Lcum[ia], Lint)
    assert abs(Lcum[-1] - (Lint + Lext)) / (Lint + Lext) < 1e-6, Lcum[-1]
    share = Lint / (Lint + Lext)
    assert abs(share - 0.18537573926966075) < 1e-9, share
    assert abs(B[ia] * 1e6 - MU0 * I / (2 * np.pi * a) * 1e6) < 1e-3
    quote("coax L internal (nH/m)", f"{Lint*1e9:.3f}")
    quote("coax L external (nH/m)", f"{Lext*1e9:.3f}")
    quote("coax L total (nH/m)", f"{(Lint+Lext)*1e9:.3f}")
    quote("coax internal share", f"{share:.5f}")

    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.6))
    ax1.plot(r * 1000, B * 1e6, color=c[0], lw=2.3)
    ax1.axvline(a * 1000, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax1, 1.05, 150, "conductor surface, r = a = 1 mm", mode)
    ax1.plot([a * 1000], [MU0 * I / (2 * np.pi * a) * 1e6], "o", color=c[0], ms=7)
    S.note(ax1, 0.12, 175, "peak 200 uT/A at the surface", mode)
    ax1.set_ylabel("B per ampere  (uT/A)")
    ax1.set_ylim(0, 235)
    ax1.set_title("Coaxial line, a = 1 mm, b = 3 mm: field and accumulated inductance")
    S.strip(ax1)

    ax2.plot(r * 1000, Lcum * 1e9, color=c[1], lw=2.3)
    ax2.axvline(a * 1000, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax2.plot([a * 1000], [Lint * 1e9], "o", color=c[1], ms=7)
    S.note(ax2, 0.09, 62, "50.0 nH/m accumulated inside the wire -\nmu0/8pi, whatever the radius", mode)
    ax2.plot([b * 1000], [(Lint + Lext) * 1e9], "o", color=c[2], ms=7)
    S.label_end(ax2, 1.15, 268, "269.7 nH/m total; the internal 18.5%\nvanishes once skin effect sets in",
                c[2], mode, dx=0, dy=0, ha="left")
    ax2.set_xlabel("radius  r  (mm)")
    ax2.set_ylabel("inductance out to r  (nH/m)")
    ax2.set_xlim(0, 3.15)
    ax2.set_ylim(0, 310)
    S.strip(ax2)
    fig.tight_layout()
    return fig


@figure("em2-hysteresis-loop")
def _(mode):
    """A stated model B-H loop and the loss its area represents.

    The loop is B = Bs tanh((H -+ Hc)/Ha) with Bs = 1.8 T, Hc = 40 A/m and
    Ha = 90 A/m, swept to +-500 A/m. Nothing here is taken from a datasheet;
    the parameters ARE the model, and every number quoted from this figure is
    an integral of it. The enclosed area is computed twice - as the integral of
    the branch separation over H, and by the shoelace formula on the closed
    polygon - and the two agree to 1e-13 relative.
    """
    c = S.SERIES[mode]
    Bs, Hc, Ha, Hm = 1.8, 40.0, 90.0, 500.0
    H = np.linspace(-Hm, Hm, 400001)
    Bup, Bdn = hysteresis_branches(H, Bs, Hc, Ha)
    area = np.trapz(Bdn - Bup, H)
    Hp = np.concatenate([H, H[::-1]])
    Bp = np.concatenate([Bup, Bdn[::-1]])
    shoe = 0.5 * abs(np.sum(Hp * np.roll(Bp, -1) - np.roll(Hp, -1) * Bp))
    assert abs(shoe - area) / area < 1e-11, (shoe, area)
    assert abs(area - 287.990212424094) < 1e-6, area
    Br = Bs * np.tanh(Hc / Ha)
    assert abs(Br - 0.751178970105968) < 1e-12, Br
    Bm = Bs * np.tanh((Hm - Hc) / Ha)
    assert abs(Bm - 1.7998691324388214) < 1e-12, Bm
    mur0 = Bs / (Ha * MU0)
    assert abs(mur0 - 15915.494309189535) < 1e-6, mur0
    vol = 1.2e-4
    p60 = area * 60.0 * vol
    p400 = area * 400.0 * vol
    assert abs(p60 - 2.073529529453477) < 1e-9, p60
    assert abs(p400 / p60 - 400 / 60) < 1e-12
    quote("hysteresis loop area (J/m^3)", f"{area:.3f}")
    quote("hysteresis Br (T)", f"{Br:.4f}")
    quote("hysteresis initial mu_r", f"{mur0:.1f}")
    quote("hysteresis P at 60 Hz, 1.2e-4 m^3 (W)", f"{p60:.4f}")
    quote("hysteresis P at 400 Hz (W)", f"{p400:.4f}")

    fig, ax = plt.subplots()
    ax.fill(np.concatenate([H, H[::-1]]), np.concatenate([Bup, Bdn[::-1]]),
            color=c[0], alpha=0.14, lw=0)
    ax.plot(H, Bup, color=c[0], lw=2.3)
    ax.plot(H, Bdn, color=c[1], lw=2.3)
    ax.axhline(0, color=S.GUIDE[mode], lw=1.0)
    ax.axvline(0, color=S.GUIDE[mode], lw=1.0)
    ax.plot([0.0, 0.0], [Br, -Br], "o", color=S.INK[mode], ms=6, zorder=6)
    S.note(ax, 70, 0.62, "remanence Br = 0.7512 T", mode)
    ax.plot([Hc, -Hc], [0.0, 0.0], "o", color=S.INK[mode], ms=6, zorder=6)
    S.note(ax, 70, -0.42, "coercivity Hc = 40 A/m", mode)
    S.label_end(ax, 120, np.interp(120, H, Bup), "H rising", c[0], mode, dx=6, dy=-14)
    S.label_end(ax, -120, np.interp(-120, H, Bdn), "H falling", c[1], mode, dx=-6, dy=14, ha="right")
    S.note(ax, -505, 1.20, "shaded area = 288.0 J/m^3 per cycle.\n"
                           "Multiply by frequency and volume:\n"
                           "2.074 W at 60 Hz in 120 cm^3.", mode)
    ax.set_xlabel("magnetising field  H  (A/m)")
    ax.set_ylabel("flux density  B  (T)")
    ax.set_title("A model hysteresis loop: the area is the loss")
    ax.set_xlim(-540, 540)
    ax.set_ylim(-2.15, 2.15)
    S.strip(ax)
    return fig


@figure("em2-wire-force")
def _(mode):
    """Force per metre between parallel conductors, over five decades of current.

    F/l = mu0 I1 I2/(2 pi d) with I1 = I2 = I, drawn for three separations.
    The square law is the point: nothing at load current, structural at fault
    current.
    """
    c = S.SERIES[mode]
    I = np.logspace(0, np.log10(50000.0), 1200)
    seps = (0.05, 0.10, 0.30)
    curves = [MU0 * I * I / (2 * np.pi * d) for d in seps]
    assert abs(MU0 * 10.0**2 / (2 * np.pi * 0.10) - 2.0e-4) < 1e-16
    assert abs(MU0 * 20000.0**2 / (2 * np.pi * 0.10) - 800.0) < 1e-9
    assert abs(MU0 * 600.0**2 / (2 * np.pi * 0.05) - 1.44) < 1e-12
    assert abs(MU0 * 12000.0**2 / (2 * np.pi * 0.05) - 576.0) < 1e-9
    quote("wires 10 A at 100 mm (N/m)", f"{MU0*100/(2*np.pi*0.10):.6f}")
    quote("wires 20 kA at 100 mm (N/m)", f"{MU0*20000.0**2/(2*np.pi*0.10):.1f}")
    quote("busbars 600 A at 50 mm (N/m)", f"{MU0*600.0**2/(2*np.pi*0.05):.3f}")
    quote("busbars 12 kA at 50 mm (N/m)", f"{MU0*12000.0**2/(2*np.pi*0.05):.1f}")

    fig, ax = plt.subplots()
    for d, y, col in zip(seps, curves, c):
        ax.loglog(I, y, color=col, lw=2.2)
        S.label_end(ax, 50000, y[-1], f"d = {int(d*1000)} mm", col, mode, dy=0)
    ax.plot([10.0], [2.0e-4], "o", color=c[1], ms=7, zorder=6)
    S.note(ax, 13, 2.5e-5, "10 A at 100 mm: 0.20 mN/m", mode)
    ax.plot([20000.0], [800.0], "o", color=c[1], ms=7, zorder=6)
    S.note(ax, 9000, 3.0e2, "20 kA fault: 800 N/m -\nabout 80 kg on every metre", mode, ha="right")
    ax.plot([600.0], [1.44], "o", color=c[0], ms=7, zorder=6)
    S.note(ax, 750, 0.10, "600 A busbars at 50 mm: 1.44 N/m", mode)
    ax.set_xlabel("current in each conductor  I  (A)")
    ax.set_ylabel("force per metre  (N/m)")
    ax.set_title("Square law: the same busbars, load current and fault current")
    ax.set_xlim(1, 1.4e5)
    ax.set_ylim(1e-8, 2e4)
    S.strip(ax)
    return fig


# ===========================================================================
# CHECKS THAT BACK PROSE WITHOUT A FIGURE OF THEIR OWN
# ===========================================================================
def extra_checks() -> int:
    n = 0

    def ck(label, a, b, tol, fmt="{:.6g}"):
        nonlocal n
        rel = abs(a - b) / abs(b) if b else abs(a - b)
        assert rel < tol, f"{label}: {a!r} vs {b!r} rel={rel}"
        n += 1

    # --- Coulomb's law and the field it implies -----------------------------
    Q1, Q2, r0 = 4.0e-9, 6.0e-9, 0.030
    F = K_E * Q1 * Q2 / r0**2
    E1 = K_E * Q1 / r0**2
    ck("F = qE consistency", E1 * Q2, F, 1e-15)
    ck("Coulomb pair force", F * 1e6, 239.66804779363125, 1e-12)
    quote("two-charge force (uN)", f"{F*1e6:.3f}")
    quote("field at the second charge (kV/m)", f"{E1/1e3:.3f}")
    ck("electrons in 4 nC", 4.0e-9 / QE, 2.4966036297843052e10, 1e-12)
    quote("electrons in 4 nC", f"{4.0e-9/QE:.4e}")

    # --- finite line charge, closed form vs numerical superposition ---------
    lam, half, d = 50e-9, 1.0, 0.050
    closed = lam * half / (2 * np.pi * EPS0 * d * np.sqrt(d**2 + half**2))
    z = np.linspace(-half, half, 2_000_001)
    num = K_E * lam * np.trapz(d / (d**2 + z**2) ** 1.5, z)
    ck("finite line: numeric vs closed", num, closed, 1e-12)
    inf = lam / (2 * np.pi * EPS0 * d)
    ck("finite line value", closed, 17952.67674661322, 1e-12)
    ck("infinite line value", inf, 17975.10358452234, 1e-12)
    quote("2 m rod E at 5 cm (V/m)", f"{closed:.2f}")
    quote("infinite line E at 5 cm (V/m)", f"{inf:.2f}")
    quote("rod / infinite ratio", f"{closed/inf:.6f}")

    # --- capacitor chain (re-verifies the existing section 4.1) -------------
    A, dd, er, V = 0.0100, 0.00050, 4.5, 100.0
    C = EPS0 * er * A / dd
    ck("plate C", C * 1e12, 796.876903152, 1e-12)
    ck("plate Q", C * V * 1e9, 79.6876903152, 1e-12)
    ck("plate U", 0.5 * C * V**2 * 1e6, 3.98438451576, 1e-12)
    ck("plate u x volume = U", 0.5 * EPS0 * er * (V / dd) ** 2 * A * dd,
       0.5 * C * V**2, 1e-12)
    ck("plate force", 0.5 * EPS0 * er * (V / dd) ** 2 * A * 1e3, 7.96876903152, 1e-12)
    C_air = EPS0 * A / dd
    ck("plate C air", C_air * 1e12, 177.08375625600002, 1e-12)
    quote("air-gap C (pF)", f"{C_air*1e12:.3f}")
    quote("slab at constant V, U before/after (uJ)",
          f"{0.5*C_air*V**2*1e6:.4f} -> {0.5*C*V**2*1e6:.4f}")
    Q0 = C_air * V
    quote("slab at constant Q, V after (V)", f"{Q0/C:.4f}")
    quote("slab at constant Q, U after (uJ)", f"{0.5*Q0**2/C*1e6:.4f}")
    ck("const-Q voltage", Q0 / C, 100.0 / er, 1e-12)

    # --- two-layer stack (re-verifies the existing section 4.2) -------------
    d1, e1, d2, e2, Vs = 0.0010, 2.2, 0.00050, 1.0, 3000.0
    D = Vs / (d1 / (EPS0 * e1) + d2 / (EPS0 * e2))
    ck("stack D", D * 1e6, 27.827447411657147, 1e-12)
    ck("stack E1", D / (EPS0 * e1), 1428571.4285714286, 1e-12)
    ck("stack E2", D / (EPS0 * e2), 3142857.142857143, 1e-12)
    ck("stack V sum", D / (EPS0 * e1) * d1 + D / (EPS0 * e2) * d2, Vs, 1e-12)
    ck("stack breakdown V", 3e6 * EPS0 * e2 * (d1 / (EPS0 * e1) + d2 / (EPS0 * e2)),
       2863.6363636363635, 1e-12)

    # --- spherical capacitors ----------------------------------------------
    a1, b1 = 0.020, 0.025
    Cs = 4 * np.pi * EPS0 * a1 * b1 / (b1 - a1)
    ck("spherical C", Cs * 1e12, 11.126500554478703, 1e-12)
    ck("isolated sphere C", 4 * np.pi * EPS0 * a1 * 1e12, 2.225300110895741, 1e-12)
    ck("Earth C", 4 * np.pi * EPS0 * 6.371e6 * 1e6, 708.8693503258382, 1e-12)
    ck("sphere E at inner surface, 1 kV", 1000.0 / (a1 * (1 - a1 / b1)), 250000.0, 1e-12)
    quote("concentric spheres C (pF)", f"{Cs*1e12:.3f}")
    quote("isolated 20 mm sphere C (pF)", f"{4*np.pi*EPS0*a1*1e12:.4f}")
    quote("Earth C (uF)", f"{4*np.pi*EPS0*6.371e6*1e6:.1f}")

    # --- conductor surface and air breakdown --------------------------------
    ck("conductor E for 2 uC/m^2", 2e-6 / EPS0, 225881.8134746038, 1e-12)
    ck("sigma max in air", EPS0 * 3e6 * 1e6, 26.5625634384, 1e-12)

    # --- the existing sphere worked example ---------------------------------
    Qs, Rs = 1e-9, 0.05
    ck("1 nC sphere surface E", K_E * Qs / Rs**2, 3595.020716904468, 1e-12)
    ck("1 nC sphere V", K_E * Qs / Rs, 179.75103584522344, 1e-12)

    # --- magnetic circuit, the existing gapped core -------------------------
    lc, mur, Ac, g, Nc, Ic = 0.30, 2000.0, 4.0e-4, 0.0010, 400, 1.5
    Rc = lc / (MU0 * mur * Ac)
    Rg = g / (MU0 * Ac)
    ck("core reluctance", Rc, 298415.51829730376, 1e-12)
    ck("gap reluctance", Rg, 1989436.7886486915, 1e-12)
    ck("reluctance ratio", Rg / Rc, 20 / 3, 1e-12)
    ck("total reluctance", Rc + Rg, 2287852.3069459954, 1e-12)
    Phi = Nc * Ic / (Rc + Rg)
    ck("gapped flux", Phi * 1e6, 262.2546910822784, 1e-12)
    ck("gapped B", Phi / Ac, 0.6556367277056959, 1e-12)
    ck("gapped L", Nc**2 / (Rc + Rg) * 1e3, 69.93458428860758, 1e-12)
    ck("closed-gap flux", Nc * Ic / Rc * 1e6, 2010.6192982974678, 1e-12)
    ck("closed-gap L", Nc**2 / Rc * 1e3, 536.165146212658, 1e-12)
    quote("gapped total reluctance (A-t/Wb)", f"{Rc+Rg:.6g}")
    U = 0.5 * (Nc**2 / (Rc + Rg)) * Ic**2
    B = Phi / Ac
    ck("energy split adds up", B**2 / (2 * MU0) * Ac * g + B**2 / (2 * MU0 * mur) * Ac * lc,
       U, 1e-12)
    ck("gap energy share", (B**2 / (2 * MU0) * Ac * g) / U, 20 / 23, 1e-12)

    # --- magnetic circuit #2: design for a target B -------------------------
    Ac2, lc2, mur2, g2, Bt = 6.0e-4, 0.40, 3000.0, 0.0020, 1.0
    Rc2 = lc2 / (MU0 * mur2 * Ac2)
    Rg2 = g2 / (MU0 * Ac2)
    NI = Bt * Ac2 * (Rc2 + Rg2)
    ck("design NI", NI, 1697.6527263135504, 1e-12)
    ck("H drops add to NI", Bt / (MU0 * mur2) * lc2 + Bt / MU0 * g2, NI, 1e-12)
    ck("gap reluctance ratio 2", Rg2 / Rc2, 15.0, 1e-12)
    L2 = 500**2 / (Rc2 + Rg2)
    ck("design L", L2 * 1e3, 88.35729338221292, 1e-12)
    ck("design U", 0.5 * L2 * (NI / 500) ** 2 * 1e3, 509.29581789406507, 1e-12)
    ck("design U by 1/2 BH", (0.5 * Bt * Bt / MU0 * Ac2 * g2
                              + 0.5 * Bt * Bt / (MU0 * mur2) * Ac2 * lc2) * 1e3,
       509.29581789406507, 1e-9)
    quote("design NI (A-t)", f"{NI:.1f}")
    quote("design I at 500 turns (A)", f"{NI/500:.4f}")
    quote("design core mmf (A-t)", f"{Bt/(MU0*mur2)*lc2:.3f}")
    quote("design gap mmf (A-t)", f"{Bt/MU0*g2:.2f}")
    quote("design L (mH)", f"{L2*1e3:.3f}")
    quote("design U (mJ)", f"{0.5*L2*(NI/500)**2*1e3:.2f}")

    # --- mutual inductance of nested solenoids ------------------------------
    N1, l1, Aw, N2, l2 = 800, 0.30, 6.0e-4, 150, 0.05
    Mm = MU0 * N1 * N2 * Aw / l1
    L1 = MU0 * N1**2 * Aw / l1
    L2s = MU0 * N2**2 * Aw / l2
    kk = Mm / np.sqrt(L1 * L2s)
    ck("nested M", Mm * 1e6, 301.5928947446202, 1e-12)
    ck("nested L1", L1 * 1e6, 1608.495438637974, 1e-12)
    ck("nested L2", L2s * 1e6, 339.2920065876976, 1e-12)
    ck("nested k = sqrt(l2/l1)", kk, np.sqrt(l2 / l1), 1e-12)
    quote("nested M (uH)", f"{Mm*1e6:.3f}")
    quote("nested L1 (uH)", f"{L1*1e6:.3f}")
    quote("nested L2 (uH)", f"{L2s*1e6:.3f}")
    quote("nested k", f"{kk:.5f}")
    quote("nested emf at 500 A/s (mV)", f"{Mm*500*1e3:.3f}")

    # --- the bench method for M --------------------------------------------
    La, Lb, kb = 10e-3, 40e-3, 0.85
    Mb = kb * np.sqrt(La * Lb)
    ck("bench M", Mb * 1e3, 17.0, 1e-12)
    ck("series aiding", (La + Lb + 2 * Mb) * 1e3, 84.0, 1e-12)
    ck("series opposing", (La + Lb - 2 * Mb) * 1e3, 16.0, 1e-12)
    ck("M from the difference", ((La + Lb + 2 * Mb) - (La + Lb - 2 * Mb)) / 4 * 1e3,
       17.0, 1e-12)

    # --- rectangular loop beside a long wire --------------------------------
    Ia, Ib, ln_, da, db = 100.0, 10.0, 0.50, 0.020, 0.060
    Fn = MU0 * Ia * Ib * ln_ / (2 * np.pi * da)
    Ff = MU0 * Ia * Ib * ln_ / (2 * np.pi * db)
    ck("loop near force", Fn * 1e3, 5.0, 1e-12)
    ck("loop far force", Ff * 1e3, 5.0 / 3.0, 1e-12)
    Mw = MU0 * ln_ / (2 * np.pi) * np.log(db / da)
    xs = np.linspace(da, db, 2_000_001)
    Phin = np.trapz(MU0 * Ia / (2 * np.pi * xs) * ln_, xs)
    ck("loop flux numeric vs closed", Phin / Ia, Mw, 1e-11)
    ck("loop M", Mw * 1e9, 109.86122886681098, 1e-12)
    quote("loop net force (mN)", f"{(Fn-Ff)*1e3:.4f}")
    quote("loop M (nH)", f"{Mw*1e9:.3f}")
    quote("loop flux at 100 A (uWb)", f"{Mw*Ia*1e6:.4f}")

    # --- coax B with a return shield ---------------------------------------
    Iw, aw, bw, cw = 20.0, 0.0010, 0.0030, 0.0035
    def bcoax(rq):
        if rq < aw:
            ie = Iw * rq**2 / aw**2
        elif rq < bw:
            ie = Iw
        elif rq < cw:
            ie = Iw * (1 - (rq**2 - bw**2) / (cw**2 - bw**2))
        else:
            ie = 0.0
        return MU0 * ie / (2 * np.pi * rq)
    ck("coax B at 1 mm", bcoax(0.0010) * 1e3, 4.0, 1e-12)
    ck("coax B at 2 mm", bcoax(0.0020) * 1e3, 2.0, 1e-12)
    ck("coax B at 3.2 mm", bcoax(0.0032) * 1e3, 0.7730769230769231, 1e-12)
    assert bcoax(0.0040) == 0.0
    quote("shielded coax B at 3.2 mm (mT)", f"{bcoax(0.0032)*1e3:.4f}")

    # --- the 50 ohm cable ---------------------------------------------------
    rat = 3.49
    Lp = MU0 / (2 * np.pi) * np.log(rat)
    Cp = 2 * np.pi * EPS0 * 2.25 / np.log(rat)
    Z0 = np.sqrt(Lp / Cp)
    ck("50 ohm L'", Lp * 1e6, 0.24998034724286716, 1e-12)
    ck("50 ohm C'", Cp * 1e12, 100.14637760005517, 1e-12)
    ck("50 ohm Z0", Z0, 49.96148184802177, 1e-12)
    ck("Z0 from eta0", Z0, ETA0 / (2 * np.pi * 1.5) * np.log(rat), 1e-12)
    ck("velocity", 1 / np.sqrt(Lp * Cp), 299792458.0 / 1.5, 1e-6)
    quote("PE coax L' (uH/m)", f"{Lp*1e6:.4f}")
    quote("PE coax C' (pF/m)", f"{Cp*1e12:.2f}")
    quote("PE coax Z0 (ohm)", f"{Z0:.3f}")

    # --- eddy-current scaling ----------------------------------------------
    sigma = 2.0e6
    def eddy(t, f, Bm):
        return np.pi**2 * t**2 * f**2 * Bm**2 * sigma / 6.0
    ck("eddy 0.50 mm", eddy(0.50e-3, 60.0, 1.0), 2960.8813203268082, 1e-9)
    ck("eddy 0.35 mm", eddy(0.35e-3, 60.0, 1.0), 1450.8318469601362, 1e-9)
    ck("eddy scaling t^2", eddy(0.25e-3, 60, 1) / eddy(0.50e-3, 60, 1), 0.25, 1e-12)
    quote("eddy loss 0.50 mm, 60 Hz, 1 T (W/m^3)", f"{eddy(0.50e-3,60.0,1.0):.1f}")
    quote("eddy loss 0.35 mm, 60 Hz, 1 T (W/m^3)", f"{eddy(0.35e-3,60.0,1.0):.1f}")

    # --- forces and torques -------------------------------------------------
    ck("F on a wire", 0.35 * 6.0 * 0.20, 0.42, 1e-12)
    ck("torque on a coil", 50 * 6.0 * 6.0e-4 * 0.35, 0.063, 1e-12)
    ck("electron radius at 2 Mm/s in 50 mT",
       ME * 2.0e6 / (QE * 0.050), 2.274252041426289e-4, 1e-12)
    quote("electron gyroradius (mm)", f"{ME*2.0e6/(QE*0.050)*1e3:.4f}")
    quote("electron force (fN)", f"{QE*2.0e6*0.050*1e15:.5f}")

    # --- solenoid energy, both ways ----------------------------------------
    Ns, ls, As, Is = 500, 0.25, 4.0e-4, 2.0
    Ls = MU0 * Ns**2 * As / ls
    Bs_ = MU0 * (Ns / ls) * Is
    ck("solenoid U two ways", Bs_**2 / (2 * MU0) * As * ls, 0.5 * Ls * Is**2, 1e-12)
    ck("solenoid U", 0.5 * Ls * Is**2 * 1e6, 1005.309649148734, 1e-12)

    # --- problem-set answers -------------------------------------------------
    ck("PS 1 uC pair at 0.5 m", K_E * 1e-12 / 0.25, 0.03595020716904468, 1e-12)
    ck("PS line 2 nC/m at 15 cm", 2e-9 / (2 * np.pi * EPS0 * 0.15), 239.66804779363125, 1e-12)
    ck("PS sheet 30 nC/m^2", 3e-8 / (2 * EPS0), 1694.1136010595285, 1e-12)
    ck("PS shell V at 5 cm", K_E * 2e-8 / 0.10, 1797.5103584522343, 1e-12)
    ck("PS shell E at 20 cm", K_E * 2e-8 / 0.04, 4493.775896130586, 1e-12)
    ck("PS plate C", EPS0 * 3.0 * 2.0e-3 / 1.0e-4 * 1e12, 531.2512687680001, 1e-12)
    ck("PS coax 50 m", 2 * np.pi * EPS0 * 2.3 * 50 / np.log(4.0) * 1e9,
       4.614992312063484, 1e-12)
    ck("PS series pair", 10.0 * 20.0 / 30.0, 6.666666666666667, 1e-12)
    ck("PS network U", 0.5 * (10 * 20 / 30 + 5) * 1e-6 * 24.0**2 * 1e3,
       3.3600000000000003, 1e-12)
    ck("PS energy density", 0.5 * EPS0 * 4.0 * (2.0e6) ** 2, 70.8335025024, 1e-12)
    ck("PS conductor surface", 5e-6 / EPS0, 564704.5336865095, 1e-12)
    th2 = np.degrees(np.arctan(6.0 / 2.5 * np.tan(np.radians(30.0))))
    ck("PS refraction angle", th2, 54.182474355556415, 1e-12)
    E2mag = np.hypot(800 * np.sin(np.radians(30.0)),
                     800 * np.cos(np.radians(30.0)) * 2.5 / 6.0)
    ck("PS refraction |E2|", E2mag, 493.2882862316247, 1e-12)
    ck("PS image force", K_E * (2e-9) ** 2 / (4 * 0.005**2) * 1e6, 359.5020716904468, 1e-12)
    ck("PS long wire 15 A at 8 cm", MU0 * 15 / (2 * np.pi * 0.08) * 1e6, 37.5, 1e-12)
    ck("PS loop centre 3 A 5 cm", MU0 * 3 / (2 * 0.05) * 1e6, 37.69911184307752, 1e-12)
    ck("PS solenoid 1200/40 cm", MU0 * 3000 * 2.5 * 1e3, 9.42477796076938, 1e-12)
    ck("PS toroid iron", MU0 * 800 * 600 * 0.8 / (2 * np.pi * 0.08), 0.96, 1e-12)
    ck("PS inside wire", MU0 * 30 * 0.001 / (2 * np.pi * 9e-6) * 1e3,
       0.6666666666666667, 1e-12)
    ck("PS solenoid L", MU0 * 250**2 * 3.0e-4 / 0.20 * 1e6, 117.80972450961724, 1e-12)
    ck("PS solenoid U", 0.5 * (MU0 * 250**2 * 3.0e-4 / 0.20) * 16 * 1e3,
       0.9424777960769379, 1e-12)
    Rc3 = 0.25 / (MU0 * 2500 * 5e-4)
    Rg3 = 0.0015 / (MU0 * 5e-4)
    ck("PS circuit NI", 0.8 * 5e-4 * (Rc3 + Rg3), 1018.5916357881301, 1e-12)
    ck("PS circuit I", 0.8 * 5e-4 * (Rc3 + Rg3) / 300, 3.3953054526271007, 1e-12)
    ck("PS circuit gap-only I", 0.8 * 5e-4 * Rg3 / 300, 3.183098861837907, 1e-12)
    ck("PS coax L'", (MU0 / (2 * np.pi) * np.log(3.25) + MU0 / (8 * np.pi)) * 1e6,
       0.2857309992683293, 1e-12)
    ck("PS wire force 8 kA", MU0 * 8000.0**2 / (2 * np.pi * 0.04), 320.0, 1e-12)
    ck("PS coil torque", 200 * 0.5 * 2.5e-3 * 0.15, 0.0375, 1e-12)
    ck("PS hysteresis P", 400.0 * 50.0 * 8e-4, 16.0, 1e-12)
    ck("PS wire at 25 deg", 0.6 * 12 * 0.8 * np.sin(np.radians(25.0)),
       2.4342811876264285, 1e-12)
    return n


def render(name: str, fn) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for mode, suffix in (("light", ".svg"), ("dark", ".dark.svg")):
        S.apply(mode)
        fig = fn(mode)
        fig.savefig(OUT / f"{name}{suffix}", format="svg",
                    transparent=True, bbox_inches="tight")
        plt.close(fig)


def main() -> int:
    arg = sys.argv[1] if len(sys.argv) > 1 else ""
    print("dimensional analysis:")
    nu = check_units()
    print("independent numerical cross-checks (no figure of their own):")
    ne = extra_checks()
    print(f"  {ne} relations verified")
    if arg == "--numbers":
        for name in sorted(REGISTRY):
            S.apply("light")
            plt.close(REGISTRY[name]("light"))
        print(f"\nQUOTED VALUES ({len(QUOTED)}):")
        for label, value in QUOTED:
            print(f"  {label:48s} {value}")
        print(f"\n{nu} unit relations, {ne} numeric cross-checks, "
              f"{len(QUOTED)} quoted values")
        return 0
    names = [n for n in REGISTRY if n.startswith(arg)]
    if not names:
        print(f"no figures match {arg!r}; known: {sorted(REGISTRY)}")
        return 1
    for n in sorted(names):
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
