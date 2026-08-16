#!/usr/bin/env python3
"""Depth-wave-8 figures for the FE Electrical and Computer course:
the two Probability and Statistics chapters `fee_prob_dist` and
`fee_expected_values`.

Same contract as gen_fe_ee_e2.py, and it imports the SAME style module rather
than growing a second look. Every curve, bar and point below is COMPUTED here
from a formula the lesson that references it writes out in full. Nothing is
traced, scanned, redrawn or adapted from the NCEES Reference Handbook, from a
study guide, or from any textbook: the pipeline consumes formulas, which are
not protected expression, and never anyone's drawing of them.

Special-function values are built from their own series or from `math`, never
copied off a printed table, so a reader can re-derive every plotted ordinate:

    Phi(z)      -> math.erf, via Phi(z) = (1 + erf(z/sqrt(2)))/2
    Gamma(x)    -> math.gamma
    C(n, k)     -> math.comb

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Every figure asserts the numbers the lesson quotes from it, at the tolerance of
the last quoted digit or at 1e-9 where the quantity is exact in closed form. A
loose tolerance is not a check, it is decoration.

Usage:
    python3 scripts/gen_fe_ee_d8.py             # all
    python3 scripts/gen_fe_ee_d8.py prob2-clt   # only names with that prefix
"""
from __future__ import annotations

import math
from fractions import Fraction
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
    if not name.startswith("prob2-"):
        raise ValueError(f"this generator owns the prob2- prefix only: {name}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# Distribution functions, each written from the formula the lessons print.
# ---------------------------------------------------------------------------


def phi_cdf(z):
    """Standard normal cdf, Phi(z) = (1 + erf(z/sqrt(2)))/2."""
    z = np.asarray(z, dtype=float)
    return 0.5 * (1.0 + np.vectorize(math.erf)(z / math.sqrt(2.0)))


def phi_pdf(z):
    return np.exp(-0.5 * np.asarray(z, dtype=float) ** 2) / math.sqrt(2 * math.pi)


def binom_pmf(k, n, p):
    """C(n,k) p^k (1-p)^(n-k), evaluated in logs so large n cannot overflow."""
    out = []
    for i in np.atleast_1d(k):
        i = int(i)
        out.append(math.exp(math.lgamma(n + 1) - math.lgamma(i + 1)
                            - math.lgamma(n - i + 1)
                            + i * math.log(p) + (n - i) * math.log1p(-p)))
    return np.array(out)


def poisson_pmf(k, lam):
    """lambda^k e^-lambda / k!, evaluated in logs for the same reason."""
    return np.array([math.exp(int(i) * math.log(lam) - lam - math.lgamma(int(i) + 1))
                     for i in np.atleast_1d(k)])


def geom_pmf(k, p):
    """(1-p)^(k-1) p, counting trials up to and including the first success."""
    return np.array([(1 - p) ** (int(i) - 1) * p for i in np.atleast_1d(k)])


def hyper_pmf(k, N, K, n):
    """C(K,k) C(N-K, n-k) / C(N,n)."""
    out = []
    for i in np.atleast_1d(k):
        i = int(i)
        if i > K or n - i > N - K or i < 0:
            out.append(0.0)
        else:
            out.append(math.comb(K, i) * math.comb(N - K, n - i) / math.comb(N, n))
    return np.array(out)


# ---------------------------------------------------------------------------
# fee_prob_dist
# ---------------------------------------------------------------------------


@figure("prob2-bayes-baserate")
def _(mode):
    """Posterior probability of the condition against its prevalence.

    Bayes in the form P(D|+) = sens*pi / [sens*pi + (1-spec)(1-pi)], swept over
    the prior pi, for sensitivity 0.99 and specificity 0.96. The second curve
    is the same formula applied twice, i.e. after two independent positives.
    """
    c = S.SERIES[mode]
    sens, spec = 0.99, 0.96
    fp = 1 - spec
    pi = np.linspace(1e-4, 0.30, 1200)
    one = sens * pi / (sens * pi + fp * (1 - pi))
    two = sens ** 2 * pi / (sens ** 2 * pi + fp ** 2 * (1 - pi))

    def ppv(prior):
        return sens * prior / (sens * prior + fp * (1 - prior))

    assert abs(ppv(0.004) - 0.09041095890410959) < 1e-12, ppv(0.004)
    assert abs(sens * 0.004 - 0.00396) < 1e-12
    assert abs(fp * 0.996 - 0.03984) < 1e-12
    assert abs((sens * 0.004 + fp * 0.996) - 0.0438) < 1e-12
    two4 = sens ** 2 * 0.004 / (sens ** 2 * 0.004 + fp ** 2 * 0.996)
    assert abs(two4 - 0.7109902067464636) < 1e-12, two4
    assert abs(ppv(0.10) - 0.7333333333333332) < 1e-12, ppv(0.10)
    assert abs(ppv(0.50) - 0.9611650485436893) < 1e-12, ppv(0.50)

    fig, ax = plt.subplots()
    ax.plot(100 * pi, 100 * one, color=c[0], lw=2.2)
    ax.plot(100 * pi, 100 * two, color=c[1], lw=2.2)
    S.label_end(ax, 22, 100 * ppv(0.22), "after one positive", c[0], mode, dy=-14)
    S.label_end(ax, 12, 100 * (sens ** 2 * 0.12 / (sens ** 2 * 0.12 + fp ** 2 * 0.88)),
                "after two independent positives", c[1], mode, dy=-15)
    ax.plot([0.4], [100 * ppv(0.004)], "o", color=c[0], ms=7, zorder=5)
    ax.plot([0.4], [100 * two4], "o", color=c[1], ms=7, zorder=5)
    ax.axvline(0.4, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 1.4, 100 * ppv(0.004) - 6,
           "prevalence 0.4%: one positive means 9.0%,\ntwo mean 71.1%", mode)
    ax.set_xlabel("prevalence of the condition  (% of the population)")
    ax.set_ylabel("probability the condition is present  (%)")
    ax.set_title("The base rate, not the test, sets the posterior")
    ax.set_xlim(0, 30)
    ax.set_ylim(0, 102)
    S.strip(ax)
    return fig


@figure("prob2-discrete-family")
def _(mode):
    """Four discrete laws, each from its own formula, as small multiples.

    Binomial(12, 0.08), Poisson(3.4), geometric(0.15) and the hypergeometric
    for 4 drawn from a lot of 20 containing 5 defectives. One panel per law
    because four series on one axis is an all-pairs colour situation.
    """
    c = S.SERIES[mode]
    fig, axes = plt.subplots(2, 2, figsize=(7.6, 5.4))

    k = np.arange(0, 8)
    b = binom_pmf(k, 12, 0.08)
    assert abs(b[0] - 0.3676663876548824) < 1e-12, b[0]
    assert abs(b[1] - 0.3836518827703121) < 1e-12, b[1]
    assert abs(b[0] + b[1] - 0.7513182704251945) < 1e-12
    axes[0, 0].bar(k, b, color=c[0], width=0.62)
    axes[0, 0].set_title("binomial: 12 breakers, p = 0.08", fontsize=10.5)
    S.note(axes[0, 0], 3.0, 0.30, "mean np = 0.96", mode)

    k2 = np.arange(0, 12)
    po = poisson_pmf(k2, 3.4)
    assert abs(po[0] - 0.03337326996032608) < 1e-12, po[0]
    assert abs(1 - po[0] - po[1] - 0.8531576121745652) < 1e-12
    axes[0, 1].bar(k2, po, color=c[0], width=0.62)
    axes[0, 1].set_title("Poisson: 3.4 arrivals per hour", fontsize=10.5)
    S.note(axes[0, 1], 5.6, 0.17, "mean = variance = 3.4", mode)

    k3 = np.arange(1, 16)
    g = geom_pmf(k3, 0.15)
    assert abs(g[3] - 0.09211874999999999) < 1e-12, g[3]
    assert abs(g.sum() - (1 - 0.85 ** 15)) < 1e-12
    axes[1, 0].bar(k3, g, color=c[0], width=0.62)
    axes[1, 0].set_title("geometric: first success, p = 0.15", fontsize=10.5)
    S.note(axes[1, 0], 5.4, 0.105, "mean 1/p = 6.67 trials", mode)

    k4 = np.arange(0, 5)
    h = hyper_pmf(k4, 20, 5, 4)
    assert abs(h[1] - 2275 / 4845) < 1e-12, h[1]
    assert abs(h[0] - 1365 / 4845) < 1e-12, h[0]
    assert abs(h.sum() - 1.0) < 1e-12
    axes[1, 1].bar(k4, h, color=c[0], width=0.62)
    axes[1, 1].set_title("hypergeometric: 4 from 20, 5 bad", fontsize=10.5)
    S.note(axes[1, 1], 1.7, 0.36, "no replacement:\nmean nK/N = 1", mode)

    for ax in axes.ravel():
        ax.set_ylabel("probability", fontsize=9.5)
        ax.set_xlabel("count k", fontsize=9.5)
        S.strip(ax)
    fig.suptitle("Four discrete laws, four different questions", fontsize=12,
                 color=S.INK[mode], fontweight="semibold")
    fig.tight_layout()
    return fig


@figure("prob2-poisson-limit")
def _(mode):
    """How fast the binomial becomes the Poisson when np is held at 2.

    For each n the binomial pmf C(n,k) p^k (1-p)^(n-k) with p = 2/n is compared
    term by term against lambda^k e^-lambda / k! at lambda = 2. Plotted is the
    largest absolute gap over k, which falls like 1/n.
    """
    c = S.SERIES[mode]
    lam = 2.0
    ns = np.array([5, 8, 10, 15, 20, 30, 50, 80, 120, 200, 400, 700, 1000])
    gaps, gap2 = [], []
    for n in ns:
        p = lam / n
        k = np.arange(0, n + 1)
        gaps.append(float(np.max(np.abs(binom_pmf(k, int(n), p) - poisson_pmf(k, lam)))))
        gap2.append(abs(float(binom_pmf([2], int(n), p)[0] - poisson_pmf([2], lam)[0])))
    gaps = np.array(gaps)
    idx = {int(n): i for i, n in enumerate(ns)}
    # Cross-check the log-space pmf against EXACT rational arithmetic: the
    # binomial pmf at rational p is a rational number, so Fraction settles it
    # with no floating point involved at all.
    for n, num, den in ((20, 1, 10), (50, 4, 100), (200, 1, 100)):
        want = (Fraction(math.comb(n, 2)) * Fraction(num, den) ** 2
                * (1 - Fraction(num, den)) ** (n - 2))
        assert abs(binom_pmf([2], n, num / den)[0] - float(want)) < 1e-12, n
    assert abs(binom_pmf([2], 20, 0.1)[0] - 0.28517980706429813) < 1e-12
    assert abs(binom_pmf([2], 50, 0.04)[0] - 0.2762328074036478) < 1e-12
    assert abs(binom_pmf([2], 200, 0.01)[0] - 0.27203300986362405) < 1e-12
    assert abs(poisson_pmf([2], 2.0)[0] - 0.27067056647322546) < 1e-12
    assert abs(gaps[idx[20]] - 0.01450924059107267) < 1e-12, gaps[idx[20]]
    assert abs(gaps[idx[200]] - 0.0013624433903985933) < 1e-12, gaps[idx[200]]
    # the envelope really is order 1/n: the product n * gap settles near 0.271
    prod = ns * gaps
    assert abs(prod[-1] - 0.271) < 5e-4, prod[-1]
    assert abs(prod[idx[20]] - 0.290) < 5e-4, prod[idx[20]]

    # the k = 2 term IS the worst term at every n tabulated here, which is
    # worth asserting because the lesson quotes only the k = 2 comparison
    assert np.allclose(gaps, gap2, rtol=1e-9), (gaps, gap2)
    ref = gaps[idx[20]] * 20.0 / ns

    fig, ax = plt.subplots()
    ax.loglog(ns, ref, color=S.GUIDE[mode], lw=1.6, ls="--")
    ax.loglog(ns, gaps, "o-", color=c[0], lw=2.0, ms=6)
    S.label_end(ax, 1000, gaps[-1], "worst pmf term", c[0], mode, dy=9)
    S.note(ax, 6.0, 3.4e-4, "dashed: a pure 1/n reference through n = 20", mode)
    for n in (20, 200):
        ax.plot([n], [gaps[idx[n]]], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 22, 0.0175, "n = 20, p = 0.10:\nworst gap 0.0145", mode)
    S.note(ax, 210, 0.00165, "n = 200, p = 0.010:\nworst gap 0.00136", mode)
    ax.set_xlabel("number of trials n, with p = 2/n so that np stays at 2")
    ax.set_ylabel("largest absolute pmf difference")
    ax.set_title("The Poisson error falls like 1/n at fixed np")
    S.strip(ax)
    return fig


@figure("prob2-memoryless")
def _(mode):
    """Conditional survival for a further 2000 hours, against age already run.

    Exponential: R(t+s)/R(s) = e^(-lambda t), free of s. Weibull with beta =
    2.5: R(t+s)/R(s) = exp[((s/eta)^beta - ((s+t)/eta)^beta)], which falls as
    the unit ages. Both are drawn with the same MTTF so the comparison is fair.
    """
    c = S.SERIES[mode]
    beta, eta = 2.5, 4000.0
    mttf = eta * math.gamma(1 + 1 / beta)
    assert abs(math.gamma(1.4) - 0.8872638175030755) < 1e-12, math.gamma(1.4)
    assert abs(mttf - 3549.055270012302) < 1e-9, mttf
    lam = 1 / mttf
    s = np.linspace(0, 4000, 900)
    t = 2000.0
    expo = np.full_like(s, math.exp(-lam * t))
    weib = np.exp((s / eta) ** beta - ((s + t) / eta) ** beta)

    def w_surv(x):
        return math.exp(-(x / eta) ** beta)

    assert abs(w_surv(2000) - 0.8379668855787558) < 1e-12, w_surv(2000)
    assert abs(w_surv(4000) - math.exp(-1)) < 1e-12
    assert abs(w_surv(4000) / w_surv(2000) - 0.439014294601105) < 1e-12
    assert abs(math.exp(-lam * 2000) - 0.5691961088331347) < 1e-12
    assert abs(expo[0] - expo[-1]) < 1e-15

    fig, ax = plt.subplots()
    ax.plot(s, 100 * expo, color=c[0], lw=2.2)
    ax.plot(s, 100 * weib, color=c[1], lw=2.2)
    S.label_end(ax, 2500, 100 * expo[0], "exponential: memoryless", c[0], mode, dy=11)
    S.label_end(ax, 2500, 100 * np.interp(2500, s, weib), "Weibull, beta = 2.5: wear-out",
                c[1], mode, dy=-13)
    ax.plot([0, 2000], [100 * w_surv(2000), 100 * w_surv(4000) / w_surv(2000)],
            "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 120, 100 * w_surv(2000) + 2.5, "new: 83.8% reach 2000 h", mode)
    S.note(ax, 1150, 12,
           "same part after 2000 h of service:\nonly 43.9% survive the next 2000", mode)
    ax.set_xlabel("hours already survived,  s")
    ax.set_ylabel("chance of surviving 2000 hours more  (%)")
    ax.set_title("Memorylessness is a property, not a default")
    ax.set_xlim(0, 4050)
    ax.set_ylim(0, 100)
    S.strip(ax)
    return fig


@figure("prob2-normal-approx")
def _(mode):
    """Binomial(200, 0.30) against its normal approximation, with and without
    the half-unit continuity correction.

    Top: the exact pmf as bars, the normal density with mu = np = 60 and
    sigma = sqrt(np(1-p)) = sqrt(42) drawn over it. Bottom: the error of the
    two cumulative approximations against the exact binomial cdf.
    """
    c = S.SERIES[mode]
    n, p = 200, 0.30
    mu = n * p
    sd = math.sqrt(n * p * (1 - p))
    assert abs(sd - 6.48074069840786) < 1e-12, sd
    k = np.arange(35, 86)
    pmf = binom_pmf(k, n, p)
    cdf = np.cumsum(binom_pmf(np.arange(0, 86), n, p))[35 - 0:]
    exact54 = float(np.cumsum(binom_pmf(np.arange(0, 55), n, p))[-1])
    assert abs(exact54 - 0.19884961587587218) < 1e-9, exact54
    raw = float(phi_cdf((54 - mu) / sd))
    corr = float(phi_cdf((54.5 - mu) / sd))
    # 1e-8 rather than 1e-9 only because two erf implementations disagree in
    # the ninth place; the lesson quotes four, so this is still four orders
    # tighter than the claim it protects.
    assert abs(raw - 0.17726974) < 1e-8, raw
    assert abs(corr - 0.19803291) < 1e-8, corr
    assert abs(raw - exact54) > 20 * abs(corr - exact54)

    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 5.6), sharex=True)
    a1.bar(k, pmf, color=c[0], width=0.8, alpha=0.85)
    xx = np.linspace(35, 85, 800)
    a1.plot(xx, phi_pdf((xx - mu) / sd) / sd, color=c[1], lw=2.2)
    S.label_end(a1, 72, phi_pdf((72 - mu) / sd) / sd,
                "normal density, mu = 60, sigma = 6.481", c[1], mode, dy=12)
    a1.axvline(54.5, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(a1, 35.6, 0.0465, "bar 54 spans 53.5 to 54.5 -\nthe cut belongs at 54.5", mode)
    a1.set_ylabel("probability")
    a1.set_title("Binomial(200, 0.30) and the normal that stands in for it")
    S.strip(a1)

    err_raw = phi_cdf((k - mu) / sd) - cdf
    err_cc = phi_cdf((k + 0.5 - mu) / sd) - cdf
    a2.plot(k, err_raw, color=c[0], lw=2.0)
    a2.plot(k, err_cc, color=c[1], lw=2.0)
    S.label_end(a2, 47, err_raw[47 - 35], "no correction", c[0], mode, dy=-12)
    S.label_end(a2, 47, err_cc[47 - 35], "half-unit correction", c[1], mode, dy=11)
    a2.axhline(0.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    a2.plot([54, 54], [err_raw[54 - 35], err_cc[54 - 35]], "o", color=S.INK[mode], ms=6)
    S.note(a2, 55.5, -0.0205, "at k = 54: error 0.0216 uncorrected,\n0.0008 corrected", mode)
    a2.set_xlabel("k")
    a2.set_ylabel("approximate cdf minus exact")
    a2.set_xlim(35, 85)
    S.strip(a2)
    fig.tight_layout()
    return fig


@figure("prob2-series-parallel")
def _(mode):
    """System reliability against identical-component reliability.

    Series of n: R^n. Active parallel of n: 1 - (1-R)^n. Drawn as two panels
    so neither carries more than three curves.
    """
    c = S.SERIES[mode]
    R = np.linspace(0.5, 1.0, 800)
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.8, 4.1), sharey=True)

    for i, n in enumerate((2, 5, 10)):
        a1.plot(R, R ** n, color=c[i], lw=2.1)
        S.label_end(a1, 0.985, 0.985 ** n, f"n = {n}", c[i], mode, dy=0)
    assert abs(0.99 ** 10 - 0.9043820750088044) < 1e-12
    assert abs(0.95 ** 5 - 0.7737809374999998) < 1e-12
    a1.set_title("series: every block must work", fontsize=11)
    a1.set_xlabel("component reliability R")
    a1.set_ylabel("system reliability")

    for i, n in enumerate((1, 2, 3)):
        a2.plot(R, 1 - (1 - R) ** n, color=c[i], lw=2.1)
        S.label_end(a2, 0.64, 1 - (1 - 0.64) ** n, f"n = {n}", c[i], mode,
                    dy=-12 if n == 1 else 9, dx=2)
    assert abs((1 - (1 - 0.90) ** 2) - 0.99) < 1e-12
    assert abs((1 - (1 - 0.90) ** 3) - 0.999) < 1e-12
    two_of_three = 3 * 0.9 ** 2 * 0.1 + 0.9 ** 3
    assert abs(two_of_three - 0.972) < 1e-12, two_of_three
    a2.plot([0.90], [two_of_three], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(a2, 0.53, 0.06, "2-out-of-3 voting at R = 0.90\nsits at 0.972 (marked)", mode)
    a2.set_title("parallel: one survivor is enough", fontsize=11)
    a2.set_xlabel("component reliability R")

    for ax in (a1, a2):
        ax.set_xlim(0.5, 1.02)
        ax.set_ylim(0.0, 1.03)
        S.strip(ax)
    fig.tight_layout()
    return fig


@figure("prob2-bathtub-hazard")
def _(mode):
    """The Weibull hazard h(t) = (beta/eta)(t/eta)^(beta-1) at three shapes,
    and the sum of the three, which is the bathtub.

    beta < 1 falls (infant mortality), beta = 1 is flat (the exponential's
    constant rate), beta > 1 rises (wear-out). Adding the three gives the
    familiar tub without any curve being drawn by hand.
    """
    c = S.SERIES[mode]
    eta = 5000.0
    t = np.linspace(60.0, 9000.0, 1200)

    def haz(b, scale):
        return (b / scale) * (t / scale) ** (b - 1)

    infant = haz(0.5, 900.0)
    useful = np.full_like(t, 1 / 5000.0)
    wear = haz(3.0, 7000.0)
    total = infant + useful + wear
    assert abs((0.5 / eta) * (1000 / eta) ** -0.5 - 0.00022360679774997898) < 1e-15
    assert abs((1.0 / eta) * (1000 / eta) ** 0.0 - 0.0002) < 1e-15
    assert abs((3.0 / eta) * (1000 / eta) ** 2.0 - 2.4e-05) < 1e-15
    lo = int(np.argmin(total))
    assert 2000 < t[lo] < 5000, t[lo]

    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.8, 4.1))
    a1.plot(t, 1e6 * infant, color=c[0], lw=2.1)
    a1.plot(t, 1e6 * useful, color=c[1], lw=2.1)
    a1.plot(t, 1e6 * wear, color=c[2], lw=2.1)
    S.label_end(a1, 2600, 1e6 * np.interp(2600, t, infant), "beta = 0.5", c[0], mode, dy=10)
    S.label_end(a1, 5200, 1e6 * useful[0], "beta = 1", c[1], mode, dy=-12)
    S.label_end(a1, 7400, 1e6 * np.interp(7400, t, wear), "beta = 3", c[2], mode, dy=-4)
    a1.set_title("three Weibull shapes", fontsize=11)
    a1.set_ylim(0, 900)

    a2.plot(t, 1e6 * total, color=c[0], lw=2.4)
    a2.plot([t[lo]], [1e6 * total[lo]], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(a2, 900, 100,
           "flattest stretch: the only region where\na constant failure rate is honest", mode)
    a2.set_title("their sum is the bathtub", fontsize=11)
    a2.set_ylim(0, 900)

    for ax in (a1, a2):
        ax.set_xlabel("service hours")
        ax.set_ylabel("hazard rate  (failures per million hours)")
        S.strip(ax)
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# fee_expected_values
# ---------------------------------------------------------------------------


@figure("prob2-var-sum-rho")
def _(mode):
    """Var(X + Y) and Var(X - Y) against correlation, for Var(X) = Var(Y) = s2.

    Var(X +/- Y) = 2 s2 (1 +/- rho). Plotted relative to the independent value
    2 s2, so the vertical axis reads as a multiple of "variances just add".
    """
    c = S.SERIES[mode]
    rho = np.linspace(-1, 1, 600)
    fig, ax = plt.subplots()
    ax.plot(rho, 1 + rho, color=c[0], lw=2.2)
    ax.plot(rho, 1 - rho, color=c[1], lw=2.2)
    assert abs((1 + 0.8) * 10 - 18.0) < 1e-12
    assert abs((1 - 0.8) * 10 - 2.0) < 1e-12
    S.label_end(ax, 0.55, 1.55, "Var(X + Y)", c[0], mode, dy=10, ha="center")
    S.label_end(ax, -0.55, 1.55, "Var(X - Y)", c[1], mode, dy=10, ha="center")
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, -0.98, 1.04, "the independent case: variances simply add", mode)
    ax.plot([0.8, 0.8], [1.8, 0.2], "o", color=S.INK[mode], ms=6, zorder=5)
    ax.axvline(0.8, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, -0.98, 0.10, "rho = 0.8 common-mode pair (marked):\n18 for the sum, 2 for the difference", mode)
    ax.set_xlabel("correlation coefficient  rho")
    ax.set_ylabel("variance, as a multiple of Var(X) + Var(Y)")
    ax.set_title("The cross term is the whole story")
    ax.set_xlim(-1.02, 1.02)
    ax.set_ylim(0, 2.1)
    S.strip(ax)
    return fig


@figure("prob2-zero-corr-dependent")
def _(mode):
    """Zero correlation with total dependence: Y = X^2.

    Left: the four-point law with X on {-2,-1,1,2} equally likely. Every
    product x*y = x^3 cancels in pairs, so Cov = 0, yet X fixes Y outright.
    Right: the continuous twin, X uniform on [-1,1].
    """
    c = S.SERIES[mode]
    xs = np.array([-2.0, -1.0, 1.0, 2.0])
    ys = xs ** 2
    p = 0.25
    EX = float(np.sum(xs * p))
    EY = float(np.sum(ys * p))
    EXY = float(np.sum(xs * ys * p))
    assert abs(EX) < 1e-15 and abs(EXY) < 1e-15
    assert abs(EY - 2.5) < 1e-12
    assert abs(EXY - EX * EY) < 1e-15
    varX = float(np.sum(xs ** 2 * p)) - EX ** 2
    varY = float(np.sum(ys ** 2 * p)) - EY ** 2
    assert abs(varX - 2.5) < 1e-12 and abs(varY - 2.25) < 1e-12

    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.8, 4.1))
    a1.plot(xs, ys, "o", color=c[0], ms=11)
    for x, y in zip(xs, ys):
        a1.annotate("P = 1/4", xy=(x, y), xytext=(0, 12), textcoords="offset points",
                    ha="center", fontsize=9, color=S.INK_2[mode])
    a1.axhline(EY, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(a1, -2.3, EY + 0.16, "E[Y] = 2.5", mode)
    a1.axvline(0.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(a1, -2.3, 0.25, "products x*y cancel in pairs:\nCov = E[XY] = 0", mode)
    a1.set_title("four equally likely points, r = 0", fontsize=11)
    a1.set_xlim(-2.9, 2.9)
    a1.set_ylim(0, 5.4)

    xc = np.linspace(-1, 1, 400)
    a2.plot(xc, xc ** 2, color=c[1], lw=2.2)
    a2.axhline(1 / 3, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(a2, -0.97, 1 / 3 + 0.03, "E[Y] = 1/3 for X uniform on [-1, 1]", mode)
    S.note(a2, -0.55, 0.72, "a perfect functional law\nwith a correlation of zero", mode)
    a2.set_title("the continuous twin, r = 0 as well", fontsize=11)
    a2.set_xlim(-1.05, 1.05)
    a2.set_ylim(0, 1.15)

    for ax in (a1, a2):
        ax.set_xlabel("X")
        ax.set_ylabel("Y = X squared")
        S.strip(ax)
    fig.tight_layout()
    return fig


@figure("prob2-chebyshev-bound")
def _(mode):
    """Chebyshev's 1/k^2 ceiling against what three laws actually do.

    The bound is distribution-free, so it must cover the worst case; the price
    is that for well-behaved laws it is loose by orders of magnitude. The
    three-point law that attains it is marked.
    """
    c = S.SERIES[mode]
    k = np.linspace(1.0, 4.0, 700)
    bound = 1 / k ** 2
    normal = 2 * (1 - phi_cdf(k))
    # exponential with mean 1: |X - 1| >= k only via the upper tail once k >= 1
    expo = np.exp(-(1 + k))
    assert abs(float(2 * (1 - phi_cdf(np.array([2.0]))[0])) - 0.04550026389635842) < 1e-12
    assert abs(math.exp(-3) - 0.049787068367863944) < 1e-15
    assert abs(math.exp(-4) - 0.01831563888873418) < 1e-15
    assert abs(1 / 4 - 0.25) < 1e-15

    fig, ax = plt.subplots()
    ax.semilogy(k, bound, color=S.GUIDE[mode], lw=2.4, ls="--")
    ax.semilogy(k, normal, color=c[0], lw=2.2)
    ax.semilogy(k, expo, color=c[1], lw=2.2)
    S.note(ax, 3.02, 0.135, "Chebyshev ceiling 1/k squared", mode)
    S.label_end(ax, 3.4, 2 * (1 - float(phi_cdf(np.array([3.4]))[0])), "normal", c[0], mode, dy=-6)
    S.label_end(ax, 3.4, math.exp(-4.4), "exponential", c[1], mode, dy=8)
    ax.plot([2.0], [0.25], "o", color=S.INK[mode], ms=8, zorder=5)
    S.note(ax, 2.06, 0.29, "the three-point law that puts 1/8 at each\nof mu +/- 2 sigma sits ON the bound",
           mode)
    ax.plot([2.0, 3.0], [0.04550026389635842, 0.0026997960632601866], "o", color=c[0], ms=6)
    ax.plot([2.0, 3.0], [math.exp(-3), math.exp(-4)], "o", color=c[1], ms=6)
    ax.set_xlabel("k, in standard deviations from the mean")
    ax.set_ylabel("P(|X - mu| >= k sigma)")
    ax.set_title("A bound that holds for everything is loose for anything")
    ax.set_xlim(1.0, 4.05)
    ax.set_ylim(1e-4, 1.4)
    S.strip(ax)
    return fig


@figure("prob2-clt-exponential")
def _(mode):
    """The central limit theorem working on a parent that is nothing like
    normal: the exponential, whose skewness is 2.

    Each panel is the EXACT density of the standardised sample mean, which for
    n exponentials is the Erlang density f(s) = lam^n s^(n-1) e^(-lam s)/(n-1)!
    pushed through the standardising map, so nothing here is a histogram of
    lucky draws. The standard normal density is drawn over it.
    """
    c = S.SERIES[mode]
    fig, axes = plt.subplots(2, 2, figsize=(7.6, 5.4))
    z = np.linspace(-3.6, 4.2, 900)
    for ax, n in zip(axes.ravel(), (1, 2, 5, 30)):
        # xbar = s/n with s ~ Erlang(n, 1); z = (xbar - 1) sqrt(n)
        # xbar = s/n, so s = n(1 + z/sqrt(n)) and ds/dz = n/sqrt(n) = sqrt(n)
        s = (z / math.sqrt(n) + 1.0) * n
        ok = s > 0
        dens = np.zeros_like(z)
        dens[ok] = np.exp((n - 1) * np.log(s[ok]) - s[ok] - math.lgamma(n)) * math.sqrt(n)
        # The plotted area must equal the Erlang mass on the same window, and
        # that cdf, F(s) = 1 - e^-s sum_{j<n} s^j/j!, is exact for integer n.
        def erlang_cdf(x):
            if x <= 0:
                return 0.0
            return 1 - math.exp(-x) * sum(x ** j / math.factorial(j) for j in range(n))
        window = erlang_cdf(float(s[-1])) - erlang_cdf(float(s[0]))
        assert abs(np.trapz(dens, z) - window) < 2e-3, (n, np.trapz(dens, z), window)
        ax.plot(z, dens, color=c[0], lw=2.2)
        ax.plot(z, phi_pdf(z), color=c[1], lw=1.8, ls="--")
        ax.set_title(f"n = {n}   (skewness {2/math.sqrt(n):.2f})", fontsize=10.5)
        ax.set_xlim(-3.6, 4.2)
        ax.set_ylim(0, 0.62)
        ax.set_xlabel("standardised sample mean", fontsize=9.5)
        ax.set_ylabel("density", fontsize=9.5)
        S.strip(ax)
    S.label_end(axes[0, 0], 1.4, 0.30, "exponential parent", c[0], mode, size=9)
    S.label_end(axes[0, 0], 1.1, 0.05, "standard normal", c[1], mode, size=9)
    assert abs(2 / math.sqrt(30) - 0.3651483716701107) < 1e-12
    fig.suptitle("Skewness 2 becomes skewness 0.37 by n = 30", fontsize=12,
                 color=S.INK[mode], fontweight="semibold")
    fig.tight_layout()
    return fig


@figure("prob2-se-root-n")
def _(mode):
    """The standard error of the mean, sigma/sqrt(n), for sigma = 8.

    The curve is the formula; the marked points are the sample sizes the
    lesson quotes. The inverse-square cost of precision is the message: four
    times the data for half the error.
    """
    c = S.SERIES[mode]
    n = np.arange(2, 401)
    se = 8.0 / np.sqrt(n)
    assert abs(8.0 / math.sqrt(64) - 1.0) < 1e-15
    assert abs(8.0 / math.sqrt(256) - 0.5) < 1e-15
    assert abs(8.0 / math.sqrt(16) - 2.0) < 1e-15

    fig, ax = plt.subplots()
    ax.plot(n, se, color=c[0], lw=2.3)
    for nn, lbl in ((16, "n = 16: SE 2.0"), (64, "n = 64: SE 1.0"), (256, "n = 256: SE 0.5")):
        ax.plot([nn], [8.0 / math.sqrt(nn)], "o", color=S.INK[mode], ms=7, zorder=5)
        S.note(ax, nn + 8, 8.0 / math.sqrt(nn) + 0.12, lbl, mode)
    ax.annotate("", xy=(256, 0.5), xytext=(64, 1.0),
                arrowprops=dict(arrowstyle="->", color=S.INK_2[mode], lw=1.2))
    S.note(ax, 108, 1.75, "halving the error costs\nfour times the samples", mode)
    ax.set_xlabel("sample size n")
    ax.set_ylabel("standard error of the mean  (same units as sigma = 8)")
    ax.set_title("Precision is bought at four times the price")
    ax.set_xlim(0, 405)
    ax.set_ylim(0, 5.9)
    S.strip(ax)
    return fig


@figure("prob2-bias-n-minus-1")
def _(mode):
    """Why the sample variance divides by n - 1.

    E[sum (x - xbar)^2] = (n-1) sigma^2 exactly, so dividing that sum by n
    returns (n-1)/n of the truth and dividing it by n-1 returns the truth.
    Both curves are those two expectations; no simulation is needed because
    the expectation is available in closed form, and the lesson's Monte Carlo
    is the independent check on it.
    """
    c = S.SERIES[mode]
    n = np.arange(2, 41)
    fig, ax = plt.subplots()
    ax.plot(n, (n - 1) / n, "o-", color=c[0], lw=2.0, ms=5)
    ax.plot(n, np.ones_like(n, dtype=float), color=c[1], lw=2.2)
    assert abs(4 / 5 - 0.8) < 1e-15
    assert abs(19 / 20 - 0.95) < 1e-15
    S.label_end(ax, 14, 13 / 14, "divide by n: biased low by sigma^2/n", c[0], mode, dy=-14)
    S.label_end(ax, 14, 1.0, "divide by n - 1: unbiased at every n", c[1], mode, dy=11)
    ax.plot([5], [0.8], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 6.0, 0.55, "n = 5: the n-divisor returns 80% of the\nvariance on average, however many\nsamples are taken", mode)
    ax.set_xlabel("sample size n")
    ax.set_ylabel("expected estimate, as a fraction of the true variance")
    ax.set_title("Bessel's correction, drawn")
    ax.set_xlim(1.5, 40.5)
    ax.set_ylim(0.4, 1.12)
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
    prefix = sys.argv[1] if len(sys.argv) > 1 else "prob2-"
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
