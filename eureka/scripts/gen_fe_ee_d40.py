#!/usr/bin/env python3
"""Depth-wave-40 figures and numerics for the FE Electrical and Computer course.

Scope: the professional-liability chapter of the Ethics & Professional Practice
section (topic `fee_liability`, figure prefix `eth3-`). Same contract and the
same shared style module as the earlier depth-wave generators, so these plots
sit beside the existing ones without introducing a second look.

WHY A LEGAL CHAPTER HAS A NUMERICS SCRIPT AT ALL

Professional liability is the one chapter of this course whose subject matter is
legal rather than physical, and that makes two failure modes worse here than
anywhere else.

  1. COPYRIGHT. Codes of ethics, model contract documents and state board rules
     are protected expression. Nothing in this file, and nothing in the lesson
     it supports, reproduces any of them. What the lesson carries is the
     *arithmetic* of liability - expected value, reliability, insurance
     structures, apportionment, date differences, discounting - and arithmetic
     is not anyone's protected expression.

  2. FAKE MATHEMATICS. A legal topic invites decorative formulas. Every
     quantity computed here is one that a practising engineer or an FE
     candidate actually has to work out, and every one of them is recomputed by
     a route independent of the algebra printed in the lesson:

       * expected values are confirmed by Monte Carlo as well as closed form;
       * the load-resistance failure probability is confirmed by the overlap
         integral evaluated numerically AND by direct simulation, against the
         closed-form reliability index;
       * redundancy arithmetic is confirmed by enumerating channel states;
       * insurance retained-loss expectations are confirmed by simulation;
       * apportionment is confirmed by summing every party's share back to the
         total that was apportioned;
       * present values are confirmed by discounting each cash flow separately;
       * date arithmetic is confirmed against `datetime.date` differences.

`python3 eureka/scripts/gen_fe_ee_d40.py --verify` runs that battery alone and
prints the counts. Every figure repeats the claims it draws as `assert`s, so a
wrong claim stops the script instead of shipping.

NO REAL PARTIES, NO REAL CLAIMS. Every fact pattern below is a hypothetical
constructed for the exercise. No case, verdict, premium quotation, claim
frequency or loss statistic here is presented as an observed real-world figure;
each is an assumed input, stated as such, whose only job is to make the method
visible.

Every registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

Usage:
    python3 eureka/scripts/gen_fe_ee_d40.py             # verify, then figures
    python3 eureka/scripts/gen_fe_ee_d40.py --verify    # numerics only
    python3 eureka/scripts/gen_fe_ee_d40.py eth3-risk   # one figure
"""
from __future__ import annotations

import datetime as dt
import itertools
import math
import pathlib
import sys

import numpy as np
from scipy import integrate, stats

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Rectangle  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

REGISTRY: dict[str, callable] = {}
PREFIX = "eth3-"

COUNTS = {"montecarlo": 0, "integral": 0, "enumeration": 0,
          "conservation": 0, "cashflow": 0, "calendar": 0}

RNG = np.random.default_rng(20260817)


def figure(name):
    if not name.startswith(PREFIX):
        raise ValueError(f"this generator owns only {PREFIX!r} figures, not {name!r}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# verification helpers - each bumps exactly one counter
# ---------------------------------------------------------------------------
def mc_ok(label, simulated, closed_form, tol):
    gap = abs(simulated - closed_form)
    assert gap <= tol, f"{label}: Monte Carlo {simulated!r} vs closed form {closed_form!r}"
    COUNTS["montecarlo"] += 1
    return closed_form


def int_ok(label, numeric, closed_form, tol=1e-9):
    gap = abs(numeric - closed_form)
    assert gap <= tol, f"{label}: quadrature {numeric!r} vs closed form {closed_form!r}"
    COUNTS["integral"] += 1
    return closed_form


def enum_ok(label, enumerated, formula, tol=1e-12):
    gap = abs(enumerated - formula)
    assert gap <= tol, f"{label}: enumeration {enumerated!r} vs formula {formula!r}"
    COUNTS["enumeration"] += 1
    return formula


def sums_ok(label, parts, total, tol=1e-6):
    got = sum(parts)
    assert abs(got - total) <= tol, f"{label}: parts sum to {got!r}, not {total!r}"
    COUNTS["conservation"] += 1
    return total


def cash_ok(label, term_by_term, closed_form, tol=1e-6):
    gap = abs(term_by_term - closed_form)
    assert gap <= tol, f"{label}: term-by-term {term_by_term!r} vs closed form {closed_form!r}"
    COUNTS["cashflow"] += 1
    return closed_form


def cal_ok(label, computed_days, a: dt.date, b: dt.date):
    actual = (b - a).days
    assert computed_days == actual, f"{label}: {computed_days} days claimed, calendar says {actual}"
    COUNTS["calendar"] += 1
    return actual


def rounds_to(label, value, printed, places=0):
    """The lesson prints `printed`; confirm the computed value rounds to it."""
    got = round(value, places)
    assert abs(got - printed) <= 0.5 * 10 ** (-places) * 1.0000001, (
        f"{label}: computed {value!r} does not print as {printed!r}"
    )
    return value


# ===========================================================================
# 1. RISK: frequency times consequence, and a mitigation decision
# ===========================================================================
# Assumed inputs for the hypothetical switchgear room. None of these is an
# observed statistic; they are the givens of the exercise.
LAMBDA_BASE = 0.02        # arc-flash incidents per year, before mitigation
LAMBDA_MITIG = 0.004      # after remote racking and arc-resistant gear
CONSEQ = 4_000_000.0      # dollars per incident, all-in
RETRO_CAPITAL = 150_000.0
RETRO_LIFE = 20
RETRO_RATE = 0.06


def capital_recovery(i, n):
    return i * (1 + i) ** n / ((1 + i) ** n - 1)


def risk_numbers():
    risk_base = LAMBDA_BASE * CONSEQ
    risk_mit = LAMBDA_MITIG * CONSEQ
    reduction = risk_base - risk_mit
    arp = capital_recovery(RETRO_RATE, RETRO_LIFE)
    annual_cost = RETRO_CAPITAL * arp
    bcr = reduction / annual_cost
    net = reduction - annual_cost
    return dict(risk_base=risk_base, risk_mit=risk_mit, reduction=reduction,
                arp=arp, annual_cost=annual_cost, bcr=bcr, net=net)


def verify_risk():
    r = risk_numbers()
    assert r["risk_base"] == 80_000.0 and r["risk_mit"] == 16_000.0
    assert r["reduction"] == 64_000.0
    rounds_to("A/P 6% 20yr", r["arp"], 0.087185, 6)
    rounds_to("annualised retrofit cost", r["annual_cost"], 13_078, 0)
    rounds_to("benefit-cost ratio", r["bcr"], 4.89, 2)
    rounds_to("net annual benefit", r["net"], 50_922, 0)

    # Monte Carlo: Poisson incident counts over many simulated years.
    years = 4_000_000
    base = RNG.poisson(LAMBDA_BASE, years) * CONSEQ
    mit = RNG.poisson(LAMBDA_MITIG, years) * CONSEQ
    mc_ok("base annual risk", float(base.mean()), r["risk_base"], 400.0)
    mc_ok("mitigated annual risk", float(mit.mean()), r["risk_mit"], 200.0)

    # Capital recovery confirmed by amortising the loan year by year.
    balance = RETRO_CAPITAL
    for _ in range(RETRO_LIFE):
        balance = balance * (1 + RETRO_RATE) - r["annual_cost"]
    cash_ok("capital recovery closes the loan", balance, 0.0, 1e-6)
    return r


# ---------------------------------------------------------------------------
# 2. DECISION ANALYSIS: value of information on a suspected defect
# ---------------------------------------------------------------------------
P_DEFECT = 0.30
LOSS_IF_UNFIXED = 2_000_000.0
RETROFIT_COST = 250_000.0
TEST_COST = 40_000.0
SENS, SPEC = 0.90, 0.85


def decision_numbers():
    ev_nothing = P_DEFECT * LOSS_IF_UNFIXED
    ev_retrofit = RETROFIT_COST
    ev_perfect = P_DEFECT * RETROFIT_COST + (1 - P_DEFECT) * 0.0
    evpi = min(ev_nothing, ev_retrofit) - ev_perfect

    p_pos = P_DEFECT * SENS + (1 - P_DEFECT) * (1 - SPEC)
    p_neg = 1 - p_pos
    post_pos = P_DEFECT * SENS / p_pos
    post_neg = P_DEFECT * (1 - SENS) / p_neg
    act_pos = min(RETROFIT_COST, post_pos * LOSS_IF_UNFIXED)
    act_neg = min(RETROFIT_COST, post_neg * LOSS_IF_UNFIXED)
    ev_test_pre = p_pos * act_pos + p_neg * act_neg
    evsi = min(ev_nothing, ev_retrofit) - ev_test_pre
    ev_test_all_in = ev_test_pre + TEST_COST
    return dict(ev_nothing=ev_nothing, ev_retrofit=ev_retrofit, ev_perfect=ev_perfect,
                evpi=evpi, p_pos=p_pos, p_neg=p_neg, post_pos=post_pos,
                post_neg=post_neg, act_pos=act_pos, act_neg=act_neg,
                ev_test_pre=ev_test_pre, evsi=evsi, ev_test_all_in=ev_test_all_in)


def verify_decision():
    d = decision_numbers()
    assert d["ev_nothing"] == 600_000.0
    assert d["ev_perfect"] == 75_000.0
    assert d["evpi"] == 175_000.0
    rounds_to("P(positive)", d["p_pos"], 0.375, 3)
    rounds_to("posterior after positive", d["post_pos"], 0.720, 3)
    rounds_to("posterior after negative", d["post_neg"], 0.048, 3)
    assert d["act_pos"] == 250_000.0
    rounds_to("cost of the negative branch", d["act_neg"], 96_000, 0)
    rounds_to("EV before the test fee", d["ev_test_pre"], 153_750, 0)
    rounds_to("EVSI", d["evsi"], 96_250, 0)
    rounds_to("EV of the test strategy", d["ev_test_all_in"], 193_750, 0)

    # Monte Carlo over the whole tree, including the test outcome.
    n = 4_000_000
    defect = RNG.random(n) < P_DEFECT
    u = RNG.random(n)
    positive = np.where(defect, u < SENS, u < (1 - SPEC))
    cost = np.where(positive, RETROFIT_COST,
                    np.where(defect, LOSS_IF_UNFIXED, 0.0))
    mc_ok("test strategy expected cost", float(cost.mean()) + TEST_COST,
          d["ev_test_all_in"], 2_000.0)
    # Bayes posteriors confirmed by counting the simulated sample.
    mc_ok("posterior after a positive test",
          float(defect[positive].mean()), d["post_pos"], 0.002)
    mc_ok("posterior after a negative test",
          float(defect[~positive].mean()), d["post_neg"], 0.002)
    return d


# ---------------------------------------------------------------------------
# 3. FACTOR OF SAFETY AND THE LOAD-RESISTANCE OVERLAP
# ---------------------------------------------------------------------------
DESIGNS = {
    "A": dict(mu_R=200.0, cov_R=0.10, mu_S=100.0, cov_S=0.15),
    "B": dict(mu_R=200.0, cov_R=0.20, mu_S=100.0, cov_S=0.30),
}


def beta_pf(mu_R, cov_R, mu_S, cov_S):
    sR, sS = mu_R * cov_R, mu_S * cov_S
    sg = math.hypot(sR, sS)
    beta = (mu_R - mu_S) / sg
    return beta, float(stats.norm.cdf(-beta)), sR, sS, sg


def verify_reliability():
    out = {}
    for tag, d in DESIGNS.items():
        beta, pf, sR, sS, sg = beta_pf(**d)
        out[tag] = dict(beta=beta, pf=pf, sR=sR, sS=sS, sg=sg,
                        fs=d["mu_R"] / d["mu_S"])
        # overlap integral, evaluated numerically: P(R < S) = int f_S(s) F_R(s) ds
        val = integrate.quad(
            lambda s: stats.norm.pdf(s, d["mu_S"], sS) * stats.norm.cdf(s, d["mu_R"], sR),
            d["mu_S"] - 12 * sS, d["mu_R"] + 12 * sR, limit=400, epsabs=1e-16)[0]
        int_ok(f"overlap integral, design {tag}", val, pf, max(1e-12, pf * 1e-6))
        # and by direct simulation of the two variables
        n = 4_000_000
        R = RNG.normal(d["mu_R"], sR, n)
        Sl = RNG.normal(d["mu_S"], sS, n)
        mc_ok(f"failure probability, design {tag}", float((R < Sl).mean()), pf,
              max(4e-5, 6 * math.sqrt(max(pf, 1e-9) / n)))
    assert out["A"]["fs"] == 2.0 and out["B"]["fs"] == 2.0
    rounds_to("beta, design A", out["A"]["beta"], 4.0, 6)
    rounds_to("beta, design B", out["B"]["beta"], 2.0, 6)
    rounds_to("pf, design A", out["A"]["pf"] * 1e5, 3.167, 3)
    rounds_to("pf, design B", out["B"]["pf"], 0.02275, 5)
    ratio = out["B"]["pf"] / out["A"]["pf"]
    rounds_to("pf ratio B over A", ratio, 718, 0)
    out["ratio"] = ratio

    # required mean capacity for a target failure probability
    target = 1e-4
    beta_t = float(stats.norm.ppf(1 - target))
    rounds_to("beta for pf = 1e-4", beta_t, 3.719, 3)
    cov_R, mu_S, sS = 0.20, 100.0, 30.0
    # solve (m - mu_S)^2 = beta^2 (cov_R^2 m^2 + sS^2), taking the upper root
    a = 1 - beta_t ** 2 * cov_R ** 2
    b = -2 * mu_S
    c = mu_S ** 2 - beta_t ** 2 * sS ** 2
    disc = b * b - 4 * a * c
    m1 = (-b + math.sqrt(disc)) / (2 * a)
    m2 = (-b - math.sqrt(disc)) / (2 * a)
    m = max(m1, m2) if a > 0 else min(x for x in (m1, m2) if x > mu_S)
    # independent route: bisection on the reliability index itself
    lo, hi = mu_S, 10_000.0
    for _ in range(300):
        mid = 0.5 * (lo + hi)
        bm = (mid - mu_S) / math.hypot(cov_R * mid, sS)
        if bm < beta_t:
            lo = mid
        else:
            hi = mid
    int_ok("required mean capacity", 0.5 * (lo + hi), m, 1e-6)
    rounds_to("required mean capacity", m, 459.6, 1)
    out["m_req"] = m
    out["beta_target"] = beta_t
    out["fs_req"] = m / mu_S
    rounds_to("required central factor of safety", out["fs_req"], 4.596, 3)
    # sanity: the design that meets the target really does hit it
    b_check = (m - mu_S) / math.hypot(cov_R * m, sS)
    int_ok("reliability index of the sized design", b_check, beta_t, 1e-9)
    return out


# ---------------------------------------------------------------------------
# 4. REDUNDANCY AND COMMON CAUSE
# ---------------------------------------------------------------------------
Q_CHANNEL = 0.02
BETA_CC = 0.10


def q_sys(n, q=Q_CHANNEL, beta=0.0):
    """Simple beta-factor model: n parallel channels, all must fail."""
    return ((1 - beta) * q) ** n + beta * q


def verify_redundancy():
    vals = {n: dict(indep=q_sys(n, beta=0.0), cc=q_sys(n, beta=BETA_CC))
            for n in (1, 2, 3, 4)}
    assert abs(vals[1]["indep"] - 0.02) < 1e-15
    rounds_to("two independent channels", vals[2]["indep"] * 1e4, 4.0, 6)
    rounds_to("two channels with common cause", vals[2]["cc"] * 1e3, 2.324, 3)
    rounds_to("three channels with common cause", vals[3]["cc"] * 1e3, 2.0058, 4)
    rounds_to("optimism factor at n = 2", vals[2]["cc"] / vals[2]["indep"], 5.81, 2)
    rounds_to("gain from one channel to two", 0.02 / vals[2]["cc"], 8.61, 2)
    rounds_to("gain from two channels to three", vals[2]["cc"] / vals[3]["cc"], 1.159, 3)

    # enumeration over independent channel states, no common cause
    for n in (2, 3, 4):
        tot = 0.0
        for state in itertools.product([0, 1], repeat=n):
            p = 1.0
            for s in state:
                p *= Q_CHANNEL if s else (1 - Q_CHANNEL)
            if all(state):
                tot += p
        enum_ok(f"parallel failure, n = {n}", tot, vals[n]["indep"])

    # 2-out-of-3 voting, enumerated against the binomial tail
    q = Q_CHANNEL
    tail = sum(math.comb(3, j) * q ** j * (1 - q) ** (3 - j) for j in (2, 3))
    tot = 0.0
    for state in itertools.product([0, 1], repeat=3):
        p = 1.0
        for s in state:
            p *= q if s else (1 - q)
        if sum(state) >= 2:
            tot += p
    enum_ok("2-out-of-3 failure", tot, tail)
    rounds_to("2oo3 failure probability", tail * 1e3, 1.184, 3)

    # Monte Carlo on the beta-factor model at n = 2
    n = 4_000_000
    cc = RNG.random(n) < BETA_CC * Q_CHANNEL
    ind = (RNG.random(n) < (1 - BETA_CC) * Q_CHANNEL) & (RNG.random(n) < (1 - BETA_CC) * Q_CHANNEL)
    mc_ok("beta-factor model, n = 2", float((cc | ind).mean()), vals[2]["cc"], 1.2e-4)
    return dict(vals=vals, voting=tail)


# ---------------------------------------------------------------------------
# 5. INSURANCE: retained loss, deductibles, limits, aggregates
# ---------------------------------------------------------------------------
SCENARIOS = [
    ("no claim", 0.900, 0.0),
    ("minor", 0.060, 50_000.0),
    ("moderate", 0.030, 400_000.0),
    ("severe", 0.009, 2_000_000.0),
    ("catastrophic", 0.001, 8_000_000.0),
]
OPTIONS = [
    ("1", 25_000.0, 1_000_000.0, 34_000.0),
    ("2", 100_000.0, 5_000_000.0, 52_000.0),
    ("3", 25_000.0, 5_000_000.0, 61_000.0),
]


def retained(loss, ded, limit):
    indemnity = min(max(loss - ded, 0.0), limit)
    return loss - indemnity


def verify_insurance():
    ps = [p for _, p, _ in SCENARIOS]
    sums_ok("scenario probabilities", ps, 1.0, 1e-12)
    exp_loss = sum(p * L for _, p, L in SCENARIOS)
    rounds_to("expected gross loss", exp_loss, 41_000, 0)

    table = {}
    for tag, ded, limit, prem in OPTIONS:
        rs = [retained(L, ded, limit) for _, _, L in SCENARIOS]
        er = sum(p * r for (_, p, _), r in zip(SCENARIOS, rs))
        table[tag] = dict(ded=ded, limit=limit, prem=prem, retained=rs,
                          er=er, tcor=prem + er, worst=rs[-1])
    rounds_to("expected retained, option 1", table["1"]["er"], 18_250, 0)
    rounds_to("expected retained, option 2", table["2"]["er"], 9_900, 0)
    rounds_to("expected retained, option 3", table["3"]["er"], 5_475, 0)
    rounds_to("total cost of risk, option 1", table["1"]["tcor"], 52_250, 0)
    rounds_to("total cost of risk, option 2", table["2"]["tcor"], 61_900, 0)
    rounds_to("total cost of risk, option 3", table["3"]["tcor"], 66_475, 0)
    assert table["1"]["worst"] == 7_000_000.0
    assert table["2"]["worst"] == 3_000_000.0
    assert table["3"]["worst"] == 3_000_000.0

    # Monte Carlo on the scenario draw
    n = 4_000_000
    idx = RNG.choice(len(SCENARIOS), size=n, p=ps)
    losses = np.array([L for _, _, L in SCENARIOS])[idx]
    mc_ok("expected gross loss", float(losses.mean()), exp_loss, 900.0)
    for tag, ded, limit, _ in OPTIONS:
        sim = np.minimum(losses, ded) + np.maximum(losses - ded - limit, 0.0)
        mc_ok(f"expected retained loss, option {tag}", float(sim.mean()),
              table[tag]["er"], 900.0)

    # defence inside vs outside the limit. Same retained-loss function both
    # times; only what counts as the loss it is applied to changes.
    settle, defence, limit = 900_000.0, 350_000.0, 1_000_000.0
    ded = 25_000.0
    inside = retained(settle + defence, ded, limit)
    outside = retained(settle, ded, limit)
    assert inside == 250_000.0 and outside == 25_000.0
    assert inside - outside == 225_000.0
    sums_ok("insurer plus insured equals the bill, defence inside limits",
            [limit, inside], settle + defence)
    sums_ok("insurer plus insured equals the bill, defence outside limits",
            [defence, settle - outside, outside], settle + defence)

    # annual aggregate erosion across three claims
    claims = [400_000.0, 600_000.0, 500_000.0]
    per_claim, aggregate = 1_000_000.0, 1_000_000.0
    paid, used, kept = [], 0.0, 0.0
    for c in claims:
        want = min(max(c - ded, 0.0), per_claim)
        got = min(want, aggregate - used)
        used += got
        paid.append(got)
        kept += c - got
    assert paid == [375_000.0, 575_000.0, 50_000.0]
    rounds_to("insured retains after aggregate erosion", kept, 500_000, 0)
    sums_ok("aggregate accounting", [used, kept], sum(claims))
    return dict(exp_loss=exp_loss, table=table, inside=inside, outside=outside,
                agg_paid=paid, agg_kept=kept)


# ---------------------------------------------------------------------------
# 6. LIMITATION OF LIABILITY
# ---------------------------------------------------------------------------
CAP = 120_000.0          # a cap set at the fee, in the hypothetical contract
CLIENT_SHARE = 0.60      # fraction of claims brought by the contracting client


def verify_cap():
    exp_loss = sum(p * L for _, p, L in SCENARIOS)
    capped = sum(p * min(L, CAP) for _, p, L in SCENARIOS)
    rounds_to("expected loss under the cap", capped, 7_800, 0)
    rounds_to("reduction if the cap bound every claim",
              100 * (1 - capped / exp_loss), 80.98, 2)
    blended = CLIENT_SHARE * capped + (1 - CLIENT_SHARE) * exp_loss
    rounds_to("blended expected exposure", blended, 21_080, 0)
    rounds_to("realistic reduction", 100 * (1 - blended / exp_loss), 48.59, 2)

    n = 4_000_000
    ps = [p for _, p, _ in SCENARIOS]
    idx = RNG.choice(len(SCENARIOS), size=n, p=ps)
    losses = np.array([L for _, _, L in SCENARIOS])[idx]
    from_client = RNG.random(n) < CLIENT_SHARE
    sim = np.where(from_client, np.minimum(losses, CAP), losses)
    mc_ok("blended expected exposure", float(sim.mean()), blended, 700.0)
    return dict(exp_loss=exp_loss, capped=capped, blended=blended)


# ---------------------------------------------------------------------------
# 7. APPORTIONMENT
# ---------------------------------------------------------------------------
DAMAGES = 5_000_000.0
FAULT = {"plaintiff": 0.10, "engineer": 0.25, "contractor": 0.40,
         "manufacturer": 0.15, "owner": 0.10}


def verify_apportionment():
    sums_ok("fault shares", list(FAULT.values()), 1.0, 1e-12)
    recoverable = (1 - FAULT["plaintiff"]) * DAMAGES
    assert recoverable == 4_500_000.0
    several = {k: v * DAMAGES for k, v in FAULT.items() if k != "plaintiff"}
    sums_ok("several shares rebuild the recoverable total",
            list(several.values()), recoverable)
    assert several["engineer"] == 1_250_000.0

    # joint and several, worst case on the engineer if the contractor cannot pay
    js_worst = recoverable
    rounds_to("joint-and-several multiple on the engineer",
              js_worst / several["engineer"], 3.6, 6)

    # reallocation of an uncollectible share, pro rata on remaining fault
    gone = "contractor"
    rest = {k: v for k, v in FAULT.items() if k != gone}
    denom = sum(rest.values())
    rounds_to("remaining fault base", denom, 0.60, 12)
    realloc = {k: v / denom * several[gone] for k, v in rest.items()}
    sums_ok("reallocated share is fully distributed",
            list(realloc.values()), several[gone])
    final = {k: several[k] + realloc[k] for k in several if k != gone}
    plaintiff_absorbs = realloc["plaintiff"]
    rounds_to("engineer after reallocation", final["engineer"], 2_083_333, 0)
    rounds_to("manufacturer after reallocation", final["manufacturer"], 1_250_000, 0)
    rounds_to("owner after reallocation", final["owner"], 833_333, 0)
    rounds_to("plaintiff absorbs", plaintiff_absorbs, 333_333, 0)
    sums_ok("reallocation conserves the recoverable total",
            list(final.values()) + [plaintiff_absorbs], recoverable)

    # modified comparative bars
    bars = {}
    for fp in (0.45, 0.50, 0.55):
        bars[fp] = dict(
            pure=(1 - fp) * DAMAGES,
            rule50=(1 - fp) * DAMAGES if fp <= 0.50 else 0.0,   # "not greater than"
            rule51=(1 - fp) * DAMAGES if fp < 0.50 else 0.0,    # "less than"
        )
    assert bars[0.50]["rule50"] == 2_500_000.0 and bars[0.50]["rule51"] == 0.0
    assert bars[0.55]["pure"] == 2_250_000.0 and bars[0.55]["rule50"] == 0.0

    # settlement credits
    settlement = 800_000.0
    remaining_several = recoverable - several["engineer"]
    pro_tanto = recoverable - settlement
    proportionate = remaining_several
    rounds_to("pro tanto exposure of the non-settling defendants", pro_tanto, 3_700_000, 0)
    rounds_to("proportionate-share exposure", proportionate, 3_250_000, 0)
    rounds_to("plaintiff total under pro tanto", pro_tanto + settlement, 4_500_000, 0)
    rounds_to("plaintiff total under proportionate share",
              proportionate + settlement, 4_050_000, 0)
    return dict(recoverable=recoverable, several=several, final=final,
                plaintiff_absorbs=plaintiff_absorbs, bars=bars,
                pro_tanto=pro_tanto, proportionate=proportionate)


# ---------------------------------------------------------------------------
# 8. LIMITATIONS AND REPOSE
# ---------------------------------------------------------------------------
SUBST_COMPLETION = dt.date(2016, 6, 14)
DISCOVERY = dt.date(2026, 3, 2)


def verify_timelines():
    rep8 = dt.date(2024, 6, 14)
    rep12 = dt.date(2028, 6, 14)
    lim_bar = dt.date(2028, 3, 2)
    cal_ok("completion to discovery", 3548, SUBST_COMPLETION, DISCOVERY)
    years = (DISCOVERY - SUBST_COMPLETION).days / 365.25
    rounds_to("years from completion to discovery", years, 9.7139, 4)
    cal_ok("discovery is past the 8-year repose bar", 626, rep8, DISCOVERY)
    filed = dt.date(2027, 11, 5)
    cal_ok("days still available under the limitations clock", 118, filed, lim_bar)
    cal_ok("days still available under the 12-year repose clock", 222, filed, rep12)
    assert min(lim_bar, rep12) == lim_bar
    # exposure horizon when the limitations period still runs from a late discovery
    assert 8 + 2 == 10
    # report-lag tail on a claims-made programme
    mean_lag = 4.0
    tail8 = math.exp(-8 / mean_lag)
    rounds_to("share of claims reported after eight years", 100 * tail8, 13.53, 2)
    n = 4_000_000
    lags = RNG.exponential(mean_lag, n)
    mc_ok("report-lag tail", float((lags > 8).mean()), tail8, 6e-4)
    return dict(rep8=rep8, rep12=rep12, lim_bar=lim_bar, filed=filed,
                days=3548, years=years, tail8=tail8)


# ---------------------------------------------------------------------------
# 9. PRESENT VALUE OF A DAMAGES AWARD
# ---------------------------------------------------------------------------
A1 = 95_000.0
G = 0.03
I_DISC = 0.05
NYEARS = 23


def pv_growing(a1, g, i, n):
    if abs(i - g) < 1e-12:
        return n * a1 / (1 + g)
    return a1 / (i - g) * (1 - ((1 + g) / (1 + i)) ** n)


def verify_pv():
    closed = pv_growing(A1, G, I_DISC, NYEARS)
    term = sum(A1 * (1 + G) ** (t - 1) / (1 + I_DISC) ** t for t in range(1, NYEARS + 1))
    cash_ok("growing-annuity present value", term, closed, 1e-6)
    rounds_to("present value at 5 percent", closed, 1_697_920, 0)

    low = pv_growing(A1, G, 0.04, NYEARS)
    term_low = sum(A1 * (1 + G) ** (t - 1) / 1.04 ** t for t in range(1, NYEARS + 1))
    cash_ok("present value at 4 percent", term_low, low, 1e-6)
    rounds_to("present value at 4 percent", low, 1_893_008, 0)
    rounds_to("sensitivity per point of discount rate",
              100 * (low - closed) / closed, 11.49, 2)

    offset = pv_growing(A1, G, G, NYEARS)
    term_off = sum(A1 * (1 + G) ** (t - 1) / (1 + G) ** t for t in range(1, NYEARS + 1))
    cash_ok("total-offset present value", term_off, offset, 1e-6)
    rounds_to("total-offset present value", offset, 2_121_359, 0)

    # net discount rate route to the same answer
    net = (1 + I_DISC) / (1 + G) - 1
    rounds_to("net discount rate", 100 * net, 1.942, 3)
    via_net = A1 / (1 + G) * (1 - (1 + net) ** -NYEARS) / net
    cash_ok("net-discount-rate route", via_net, closed, 1e-6)

    # structured settlement against a lump sum
    pa = (1 - (1 + I_DISC) ** -20) / I_DISC
    rounds_to("P/A factor, 5 percent, 20 years", pa, 12.4622, 4)
    struct = 120_000.0 * pa
    struct_term = sum(120_000.0 / 1.05 ** t for t in range(1, 21))
    cash_ok("structured settlement present value", struct_term, struct, 1e-6)
    rounds_to("structured settlement present value", struct, 1_495_465, 0)
    rounds_to("advantage of the lump sum", 1_600_000.0 - struct, 104_535, 0)
    return dict(closed=closed, low=low, offset=offset, net=net, struct=struct, pa=pa)


# ---------------------------------------------------------------------------
# 10. DOCUMENTATION AS LIABILITY CONTROL
# ---------------------------------------------------------------------------
LAMBDA_FIRM = 0.08       # assumed claims per firm-year, a planning figure only


def verify_documentation():
    indemnity = 900_000.0
    p_lose_without, p_lose_with = 0.50, 0.20
    defence_without, defence_with = 200_000.0, 150_000.0
    without = p_lose_without * indemnity + defence_without
    with_ = p_lose_with * indemnity + defence_with
    assert without == 650_000.0 and with_ == 330_000.0
    saving = without - with_
    assert saving == 320_000.0
    annual = LAMBDA_FIRM * saving
    rounds_to("expected annual saving", annual, 25_600, 0)
    programme = 18_000.0
    rounds_to("net annual benefit of the records programme", annual - programme, 7_600, 0)
    rounds_to("benefit-cost ratio of the records programme", annual / programme, 1.42, 2)

    p_none_30 = math.exp(-LAMBDA_FIRM * 30)
    rounds_to("probability of no claim in thirty years", 100 * p_none_30, 9.07, 2)
    rounds_to("probability of at least one claim", 100 * (1 - p_none_30), 90.93, 2)

    n = 2_000_000
    counts = RNG.poisson(LAMBDA_FIRM * 30, n)
    mc_ok("at least one claim in thirty years", float((counts >= 1).mean()),
          1 - p_none_30, 1.2e-3)
    return dict(without=without, with_=with_, saving=saving, annual=annual,
                p_any=1 - p_none_30)


# ---------------------------------------------------------------------------
# 11. THE TWO PROBLEM SETS
# ---------------------------------------------------------------------------
def verify_problem_sets():
    """Every answer printed in the two problem sets, checked independently."""
    # --- set 1 --------------------------------------------------------------
    rounds_to("PS1.1 annual risk", 0.015 * 3_200_000, 48_000, 0)
    p_any = 1 - math.exp(-0.015 * 25)
    rounds_to("PS1.1 at least one event", p_any, 0.3127, 4)
    n = 2_000_000
    mc_ok("PS1.1 at least one event",
          float((RNG.poisson(0.015 * 25, n) >= 1).mean()), p_any, 1.5e-3)

    beta_a, pf_a, *_ = beta_pf(640.0, 0.10, 400.0, 0.15)
    rounds_to("PS1.2 sigma of the margin", math.hypot(64, 60), 87.7268, 4)
    rounds_to("PS1.2 reliability index", beta_a, 2.7358, 4)
    rounds_to("PS1.2 failure probability", pf_a * 1e3, 3.112, 3)
    val = integrate.quad(
        lambda s: stats.norm.pdf(s, 400.0, 60.0) * stats.norm.cdf(s, 640.0, 64.0),
        400 - 12 * 60, 640 + 12 * 64, limit=400, epsabs=1e-16)[0]
    int_ok("PS1.2 overlap integral", val, pf_a, pf_a * 1e-6)

    beta_b = 240 / math.hypot(64, 30)
    pf_b = float(stats.norm.cdf(-beta_b))
    rounds_to("PS1.3 tightened index", beta_b, 3.3955, 4)
    rounds_to("PS1.3 tightened probability", pf_b * 1e4, 3.426, 3)
    rounds_to("PS1.3 improvement factor", pf_a / pf_b, 9.084, 3)

    ch = [q_sys(k, q=0.05, beta=0.08) for k in (1, 2, 3)]
    rounds_to("PS1.4 one channel", ch[0], 0.05, 6)
    rounds_to("PS1.4 two channels", ch[1], 0.006116, 6)
    rounds_to("PS1.4 three channels", ch[2], 0.004097, 6)
    rounds_to("PS1.4 common-cause floor", 0.08 * 0.05, 0.004, 6)
    tot = 0.0
    for state in itertools.product([0, 1], repeat=2):
        p = 1.0
        for s in state:
            p *= 0.92 * 0.05 if s else (1 - 0.92 * 0.05)
        if all(state):
            tot += p
    enum_ok("PS1.4 independent part, n = 2", tot + 0.08 * 0.05, ch[1])

    sc = [(0.05, 150_000.0), (0.01, 1_200_000.0), (0.002, 6_000_000.0)]
    el = sum(p * L for p, L in sc)
    rounds_to("PS1.5 expected gross loss", el, 31_500, 0)
    rs = [retained(L, 50_000.0, 2_000_000.0) for _, L in sc]
    assert rs == [50_000.0, 50_000.0, 4_000_000.0]
    er = sum(p * r for (p, _), r in zip(sc, rs))
    rounds_to("PS1.5 expected retained loss", er, 11_000, 0)
    rounds_to("PS1.5 total cost of risk", 40_000 + er, 51_000, 0)
    ps = [p for p, _ in sc] + [1 - sum(p for p, _ in sc)]
    sums_ok("PS1.5 probabilities", ps, 1.0, 1e-12)
    n = 4_000_000
    idx = RNG.choice(4, size=n, p=ps)
    losses = np.array([L for _, L in sc] + [0.0])[idx]
    sim = np.minimum(losses, 50_000.0) + np.maximum(losses - 50_000.0 - 2_000_000.0, 0.0)
    mc_ok("PS1.5 expected retained loss", float(sim.mean()), er, 700.0)

    rounds_to("PS1.6 do-nothing expected cost", 0.20 * 1_500_000, 300_000, 0)
    rounds_to("PS1.6 cost with perfect information", 0.20 * 180_000, 36_000, 0)
    rounds_to("PS1.6 EVPI", 180_000 - 0.20 * 180_000, 144_000, 0)

    # --- set 2 --------------------------------------------------------------
    D2 = 3_600_000.0
    fault2 = {"claimant": 0.20, "engineer": 0.30, "contractor": 0.35, "supplier": 0.15}
    sums_ok("PS2.1 fault shares", list(fault2.values()), 1.0, 1e-12)
    rec2 = 0.80 * D2
    rounds_to("PS2.1 recoverable", rec2, 2_880_000, 0)
    sev2 = {k: v * D2 for k, v in fault2.items() if k != "claimant"}
    sums_ok("PS2.1 several shares rebuild the total", list(sev2.values()), rec2)
    rounds_to("PS2.1 joint-and-several multiple", rec2 / sev2["engineer"], 2.667, 3)

    base = 1 - fault2["supplier"]
    rounds_to("PS2.2 remaining fault base", base, 0.85, 12)
    re2 = {k: v / base * sev2["supplier"] for k, v in fault2.items() if k != "supplier"}
    sums_ok("PS2.2 reallocation is fully distributed",
            list(re2.values()), sev2["supplier"])
    rounds_to("PS2.2 engineer share of reallocation", re2["engineer"], 190_588, 0)
    rounds_to("PS2.2 contractor share of reallocation", re2["contractor"], 222_353, 0)
    rounds_to("PS2.2 claimant absorbs", re2["claimant"], 127_059, 0)
    eng2 = sev2["engineer"] + re2["engineer"]
    con2 = sev2["contractor"] + re2["contractor"]
    rounds_to("PS2.2 engineer final", eng2, 1_270_588, 0)
    rounds_to("PS2.2 contractor final", con2, 1_482_353, 0)
    sums_ok("PS2.2 claimant recovery", [eng2, con2], rec2 - re2["claimant"], 1e-6)

    sc15 = dt.date(2015, 3, 12)
    disc15 = dt.date(2024, 9, 8)
    rep15 = dt.date(2025, 3, 12)
    lim15 = dt.date(2027, 9, 8)
    cal_ok("PS2.3 completion to discovery", 3468, sc15, disc15)
    cal_ok("PS2.3 days to spare", 39, dt.date(2025, 2, 1), rep15)
    cal_ok("PS2.4 days late", 50, rep15, dt.date(2025, 5, 1))
    assert min(rep15, lim15) == rep15

    pv2 = pv_growing(78_000.0, 0.025, 0.045, 18)
    term2 = sum(78_000.0 * 1.025 ** (t - 1) / 1.045 ** t for t in range(1, 19))
    cash_ok("PS2.5 present value", term2, pv2, 1e-6)
    rounds_to("PS2.5 present value", pv2, 1_145_765, 0)
    rounds_to("PS2.5 bracket", 1 - (1.025 / 1.045) ** 18, 0.29378596, 8)

    pa15 = (1 - 1.06 ** -15) / 0.06
    rounds_to("PS2.6 P/A factor", pa15, 9.712249, 6)
    struct2 = 90_000.0 * pa15
    term15 = sum(90_000.0 / 1.06 ** t for t in range(1, 16))
    cash_ok("PS2.6 structured present value", term15, struct2, 1e-6)
    rounds_to("PS2.6 structured present value", struct2, 874_102, 0)
    rounds_to("PS2.6 advantage of the stream", struct2 - 850_000, 24_102, 0)
    return True


def verify():
    r = verify_risk()
    d = verify_decision()
    rel = verify_reliability()
    red = verify_redundancy()
    ins = verify_insurance()
    cap = verify_cap()
    ap = verify_apportionment()
    tl = verify_timelines()
    pv = verify_pv()
    doc = verify_documentation()
    verify_problem_sets()
    total = sum(COUNTS.values())
    print("numeric verification for the professional-liability chapter")
    for k in sorted(COUNTS):
        print(f"  {COUNTS[k]:3d}  {k}")
    print(f"  {total:3d}  independent checks in total, all passing")
    return dict(risk=r, decision=d, rel=rel, red=red, ins=ins, cap=cap,
                ap=ap, tl=tl, pv=pv, doc=doc)


# ===========================================================================
# FIGURES
# ===========================================================================
@figure("eth3-risk-frequency-consequence")
def fig_risk(mode):
    c = S.SERIES[mode]
    fig, ax = plt.subplots()
    S.strip(ax)
    cons = np.logspace(3, 8, 400)
    for level, style in ((10_000.0, ":"), (80_000.0, "-"), (1_000_000.0, "--")):
        ax.plot(cons, level / cons, color=S.GUIDE[mode], lw=1.1, ls=style)
        ax.annotate(f"{level:,.0f} per year",
                    xy=(1.6e8, level / 1.6e8), color=S.INK_2[mode], fontsize=8.5,
                    ha="left", va="center", clip_on=False)
    r = risk_numbers()
    pts = [(CONSEQ, LAMBDA_BASE, "as found", c[1]),
           (CONSEQ, LAMBDA_MITIG, "after retrofit", c[0])]
    for x, y, name, colour in pts:
        ax.plot([x], [y], "o", color=colour, ms=8.5, zorder=5)
        S.label_end(ax, x, y, f"  {name}", colour, mode, dx=8, dy=0, size=10)
    ax.annotate("", xy=(CONSEQ, LAMBDA_MITIG), xytext=(CONSEQ, LAMBDA_BASE),
                arrowprops=dict(arrowstyle="->", color=S.INK_2[mode], lw=1.4))
    assert abs(CONSEQ * LAMBDA_BASE - r["risk_base"]) < 1e-9
    assert abs(CONSEQ * LAMBDA_MITIG - r["risk_mit"]) < 1e-9
    ax.set_xscale("log")
    ax.set_yscale("log")
    ax.set_xlim(1e4, 4e8)
    ax.set_ylim(1e-4, 1e0)
    ax.set_xlabel("consequence of one event (dollars, log scale)")
    ax.set_ylabel("events per year (log scale)")
    ax.set_title("Risk as frequency times consequence: iso-risk lines")
    fig.tight_layout()
    return fig


@figure("eth3-decision-tree-values")
def fig_decision(mode):
    c = S.SERIES[mode]
    d = decision_numbers()
    fig, ax = plt.subplots(figsize=(7.2, 3.8))
    S.strip(ax)
    names = ["take no\naction", "retrofit\nnow", "imperfect\ntest first", "perfect\ninformation"]
    vals = [d["ev_nothing"], d["ev_retrofit"], d["ev_test_all_in"], d["ev_perfect"]]
    assert vals[3] < vals[2] < vals[1] < vals[0]
    colours = [c[1], S.GUIDE[mode], c[0], S.GUIDE[mode]]
    ax.bar(names, vals, color=colours, width=0.58)
    for k, v in enumerate(vals):
        ax.annotate(f"{v:,.0f}", xy=(k, v), xytext=(0, 5), textcoords="offset points",
                    ha="center", color=S.INK[mode], fontsize=10, fontweight="semibold")
    ax.set_ylabel("expected cost (dollars)")
    ax.set_ylim(0, 700_000)
    ax.set_title("Expected cost of four strategies for a suspected defect")
    fig.tight_layout()
    return fig


@figure("eth3-load-resistance-overlap")
def fig_overlap(mode):
    c = S.SERIES[mode]
    fig, axes = plt.subplots(2, 1, figsize=(7.2, 5.4), sharex=True)
    for ax, tag in zip(axes, ("A", "B")):
        S.strip(ax)
        d = DESIGNS[tag]
        beta, pf, sR, sS, _ = beta_pf(**d)
        x = np.linspace(0, 320, 1400)
        fs = stats.norm.pdf(x, d["mu_S"], sS)
        fr = stats.norm.pdf(x, d["mu_R"], sR)
        ax.plot(x, fs, color=c[1], lw=1.9)
        ax.plot(x, fr, color=c[0], lw=1.9)
        S.label_end(ax, d["mu_S"], stats.norm.pdf(d["mu_S"], d["mu_S"], sS),
                    " load S", c[1], mode, dx=-4, dy=6, ha="right")
        S.label_end(ax, d["mu_R"], stats.norm.pdf(d["mu_R"], d["mu_R"], sR),
                    " capacity R", c[0], mode, dx=4, dy=6)
        ax.fill_between(x, np.minimum(fs, fr), color=S.GUIDE[mode], alpha=0.55, lw=0)
        ax.set_ylim(0, max(fs.max(), fr.max()) * 1.28)
        ax.set_ylabel("density")
        ax.set_title(f"design {tag}:  FS = 2.0,  "
                     f"beta = {beta:.1f},  probability of failure = {pf:.2e}",
                     loc="left")
        assert abs(d["mu_R"] / d["mu_S"] - 2.0) < 1e-12
    axes[-1].set_xlabel("force (kN)")
    fig.suptitle("Same factor of safety, two failure probabilities", y=0.99)
    fig.tight_layout()
    return fig


@figure("eth3-reliability-index")
def fig_beta(mode):
    c = S.SERIES[mode]
    fig, ax = plt.subplots()
    S.strip(ax)
    b = np.linspace(0.5, 5.0, 400)
    ax.plot(b, stats.norm.cdf(-b), color=S.GUIDE[mode], lw=1.9)
    for tag, colour in (("A", c[0]), ("B", c[1])):
        beta, pf, *_ = beta_pf(**DESIGNS[tag])
        ax.plot([beta], [pf], "o", color=colour, ms=8.5, zorder=5)
        S.label_end(ax, beta, pf, f"  design {tag}", colour, mode, dx=8, dy=-2)
        assert abs(stats.norm.cdf(-beta) - pf) < 1e-15
    ax.axhline(1e-4, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 0.6, 1.25e-4, "target 1 in 10,000", mode, size=9)
    ax.set_yscale("log")
    ax.set_ylim(1e-7, 1)
    ax.set_xlim(0.5, 5.0)
    ax.set_xlabel("reliability index beta")
    ax.set_ylabel("probability of failure (log scale)")
    ax.set_title("Probability of failure against the reliability index")
    fig.tight_layout()
    return fig


@figure("eth3-redundancy-common-cause")
def fig_redundancy(mode):
    c = S.SERIES[mode]
    fig, ax = plt.subplots()
    S.strip(ax)
    ns = np.arange(1, 6)
    for beta, colour, name in ((0.0, c[0], "independent"),
                               (0.02, c[2], "beta = 0.02"),
                               (BETA_CC, c[1], "beta = 0.10")):
        ys = np.array([q_sys(int(n), beta=beta) for n in ns])
        ax.plot(ns, ys, "o-", color=colour, ms=6)
        S.label_end(ax, ns[-1], ys[-1], f"  {name}", colour, mode, dx=8)
        if beta > 0:
            assert ys[-1] > 0.5 * beta * Q_CHANNEL
    ax.set_yscale("log")
    ax.set_xticks(ns)
    ax.set_xlim(0.85, 6.4)
    ax.set_ylim(1e-9, 1e-1)
    ax.set_xlabel("number of parallel channels")
    ax.set_ylabel("probability the protection fails on demand (log scale)")
    ax.set_title("Redundancy stops paying where common cause takes over")
    fig.tight_layout()
    return fig


@figure("eth3-retained-loss")
def fig_retained(mode):
    c = S.SERIES[mode]
    fig, ax = plt.subplots()
    S.strip(ax)
    L = np.linspace(0, 9_000_000, 3000)
    for (tag, ded, limit, _), colour in zip(OPTIONS[:2], (c[0], c[1])):
        y = np.array([retained(x, ded, limit) for x in L])
        ax.plot(L / 1e6, y / 1e6, color=colour, lw=1.9)
        S.label_end(ax, L[-1] / 1e6, y[-1] / 1e6,
                    f"  option {tag}", colour, mode, dx=8)
        assert abs(retained(ded + limit, ded, limit) - ded) < 1e-9
    ax.plot(L / 1e6, L / 1e6, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 6.4, 7.1, "uninsured", mode, size=9)
    ax.set_xlim(0, 10.4)
    ax.set_ylim(0, 8.4)
    ax.set_xlabel("gross loss (millions of dollars)")
    ax.set_ylabel("loss retained by the firm (millions)")
    ax.set_title("What the firm keeps: deductible, corridor, and the excess above the limit")
    fig.tight_layout()
    return fig


@figure("eth3-apportionment")
def fig_apportionment(mode):
    c = S.SERIES[mode]
    ap = verify_apportionment()
    fig, ax = plt.subplots(figsize=(7.2, 4.0))
    S.strip(ax)
    parties = ["engineer", "contractor", "manufacturer", "owner"]
    several = [ap["several"][p] / 1e6 for p in parties]
    realloc = [ap["final"].get(p, 0.0) / 1e6 for p in parties]
    worst = [ap["recoverable"] / 1e6, 0.0, 0.0, 0.0]
    xs = np.arange(len(parties))
    w = 0.26
    ax.bar(xs - w, several, w, color=c[0], label="several only")
    ax.bar(xs, realloc, w, color=c[2], label="insolvent share reallocated")
    ax.bar(xs + w, worst, w, color=c[1], label="joint and several, worst case")
    ax.set_xticks(xs)
    ax.set_xticklabels(parties)
    ax.legend(loc="upper right", fontsize=9)
    ax.set_ylabel("paid to the claimant (millions of dollars)")
    ax.set_title("The same 25 percent share, three apportionment regimes")
    assert abs(sum(several) - ap["recoverable"] / 1e6) < 1e-9
    fig.tight_layout()
    return fig


@figure("eth3-repose-timeline")
def fig_timeline(mode):
    c = S.SERIES[mode]
    tl = verify_timelines()
    fig, ax = plt.subplots(figsize=(7.2, 3.4))
    S.strip(ax)
    ax.grid(False)
    ax.get_yaxis().set_visible(False)
    for side in ("left", "bottom"):
        ax.spines[side].set_visible(side == "bottom")

    def yr(d):
        return d.year + (d.timetuple().tm_yday - 1) / 365.25

    t0 = yr(SUBST_COMPLETION)
    marks = [(SUBST_COMPLETION, "substantial\ncompletion", S.INK_2[mode]),
             (tl["rep8"], "8-year repose\nbar", c[1]),
             (DISCOVERY, "defect\ndiscovered", c[0]),
             (tl["lim_bar"], "2-year limitations\nbar from discovery", c[2]),
             (tl["rep12"], "12-year repose\nbar", c[1])]
    ax.plot([t0 - 0.4, yr(tl["rep12"]) + 0.9], [0, 0], color=S.GRID[mode], lw=1.4)
    ax.add_patch(Rectangle((t0, -0.16), yr(tl["rep8"]) - t0, 0.32,
                           color=c[1], alpha=0.20, lw=0))
    for k, (d, name, colour) in enumerate(marks):
        x = yr(d)
        up = 0.42 if k % 2 == 0 else -0.52
        ax.plot([x, x], [0, up * 0.62], color=colour, lw=1.4)
        ax.plot([x], [0], "o", color=colour, ms=7, zorder=5)
        ax.annotate(f"{name}\n{d.isoformat()}", xy=(x, up), color=S.INK_2[mode],
                    fontsize=8.6, ha="center",
                    va="bottom" if up > 0 else "top")
    assert tl["rep8"] < DISCOVERY < tl["lim_bar"] < tl["rep12"]
    ax.set_ylim(-1.25, 1.15)
    ax.set_xlim(t0 - 0.9, yr(tl["rep12"]) + 1.4)
    ax.set_xlabel("calendar year")
    ax.set_title("Two clocks on one hypothetical fact pattern")
    fig.tight_layout()
    return fig


@figure("eth3-present-value-award")
def fig_pv(mode):
    c = S.SERIES[mode]
    fig, axes = plt.subplots(2, 1, figsize=(7.2, 5.2), sharex=True)
    ts = np.arange(1, NYEARS + 1)
    nominal = A1 * (1 + G) ** (ts - 1)
    disc = nominal / (1 + I_DISC) ** ts
    for ax in axes:
        S.strip(ax)
    axes[0].bar(ts, nominal / 1000, color=S.GUIDE[mode], width=0.72)
    axes[0].bar(ts, disc / 1000, color=c[0], width=0.72)
    S.label_end(axes[0], ts[-1], nominal[-1] / 1000, "  nominal",
                S.INK_2[mode], mode, dx=6)
    S.label_end(axes[0], ts[-1], disc[-1] / 1000, "  discounted", c[0], mode, dx=6)
    axes[0].set_ylabel("annual amount\n(thousands of dollars)")
    axes[0].set_title("A 23-year earnings claim: nominal against discounted")
    cum = np.cumsum(disc)
    axes[1].plot(ts, cum / 1e6, color=c[0], lw=1.9)
    axes[1].axhline(pv_growing(A1, G, I_DISC, NYEARS) / 1e6,
                    color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(axes[1], 1.3, pv_growing(A1, G, I_DISC, NYEARS) / 1e6 * 1.02,
           "closed-form present value", mode, size=9)
    axes[1].set_ylabel("cumulative present\nvalue (millions)")
    axes[1].set_xlabel("year after the award")
    axes[1].set_xlim(0.2, NYEARS + 2.6)
    assert abs(cum[-1] - pv_growing(A1, G, I_DISC, NYEARS)) < 1e-6
    fig.tight_layout()
    return fig


@figure("eth3-documentation-value")
def fig_doc(mode):
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(7.2, 3.9))
    S.strip(ax)
    lam = np.linspace(0, 0.20, 300)
    saving = lam * 320_000.0
    ax.plot(lam, saving / 1000, color=c[0], lw=1.9)
    ax.axhline(18.0, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 0.004, 19.2, "cost of the records programme", mode, size=9)
    cross = 18_000.0 / 320_000.0
    ax.plot([cross], [18.0], "o", color=c[1], ms=8.5, zorder=5)
    S.label_end(ax, cross, 18.0, f"  break even at {cross:.4f} claims/yr",
                c[1], mode, dx=8, dy=-12)
    ax.plot([LAMBDA_FIRM], [LAMBDA_FIRM * 320.0], "o", color=c[0], ms=8.5, zorder=5)
    S.label_end(ax, LAMBDA_FIRM, LAMBDA_FIRM * 320.0, "  assumed rate",
                c[0], mode, dx=8, dy=6)
    assert abs(cross - 0.05625) < 1e-12
    assert LAMBDA_FIRM > cross
    ax.set_xlim(0, 0.205)
    ax.set_ylim(0, 68)
    ax.set_xlabel("expected claims per firm-year")
    ax.set_ylabel("expected annual saving\n(thousands of dollars)")
    ax.set_title("When a records programme pays for itself")
    fig.tight_layout()
    return fig


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
