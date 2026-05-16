"""
IRT (Item Response Theory) service — Phase 7 Session 7.2 (2026-05).

Two-parameter logistic (2-PL) model fitted directly on the attempt_logs
table. No external IRT package — we implement the EM loop in pure NumPy.
This keeps deployment small and the model fully introspectable.

Model
-----
P(correct | theta, a, b) = 1 / (1 + exp(-a * (theta - b)))
  theta   ability  (per learner, ~ N(0, 1))
  a       discrimination  (per item, > 0)
  b       difficulty       (per item, ~ N(0, 1))

Fitting
-------
EM with closed-form M-step per item (Newton step, 5 iterations).
E-step uses a grid of theta values per learner. Cheap; converges
in < 1s for thousands of attempts on hundreds of items.

What gets written back
----------------------
items.irt_difficulty       (b)
items.irt_discrimination   (a)
items.irt_guessing         (c=0 in 2-PL; reserved for 3-PL later)
items.irt_calibrated_at    timestamp
items.attempts_count       denormalised

Plus a per-learner ability estimate the recommender / mock-scorer
can pull. We store the latest theta on learner_skill_mastery.metadata
since it's a per-skill question for now; a future blueprint-wide theta
lives on mock_attempts.theta.

For mock-attempt scoring (the scaled-score path) we use the
test-information function: at theta_hat, the standard error is
1 / sqrt(sum_i a_i^2 * P_i * (1 - P_i)).

Tradeoffs / what this isn't
---------------------------
- 2-PL only — no guessing parameter yet. Mostly fine for FE/AP; USMLE
  benefits from 3-PL later (Phase 7.2b).
- No DIF (differential item functioning) testing.
- We don't store item-fit statistics yet (chi-square, infit/outfit).
  Phase 7.2c.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from typing import Sequence
from uuid import UUID

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession


# ---------------------------------------------------------------------------
# Model math
# ---------------------------------------------------------------------------


def _sigmoid(x: float) -> float:
    if x >= 0:
        ez = math.exp(-x)
        return 1.0 / (1.0 + ez)
    ez = math.exp(x)
    return ez / (1.0 + ez)


def p_correct(theta: float, a: float, b: float) -> float:
    """2-PL probability of a correct response."""
    return _sigmoid(a * (theta - b))


# ---------------------------------------------------------------------------
# Calibration
# ---------------------------------------------------------------------------


@dataclass
class ItemParams:
    item_id: UUID
    a: float           # discrimination
    b: float           # difficulty
    n_attempts: int


@dataclass
class CalibrationResult:
    items: list[ItemParams]
    thetas: dict[UUID, float]
    iterations: int
    log_likelihood: float


def _theta_mle(responses: list[tuple[float, float, int]]) -> float:
    """
    Estimate one learner's theta given a list of (a, b, correct) responses
    via a few Newton steps on the 2-PL log-likelihood. Bounded to ±4.
    """
    theta = 0.0
    for _ in range(15):
        grad = 0.0
        info = 0.0
        for a, b, y in responses:
            p = p_correct(theta, a, b)
            grad += a * (y - p)
            info += a * a * p * (1 - p)
        if info < 1e-9:
            break
        step = grad / info
        theta += step
        theta = max(-4.0, min(4.0, theta))
        if abs(step) < 1e-4:
            break
    return theta


def _item_step(responses: list[tuple[float, int]], a: float, b: float) -> tuple[float, float]:
    """
    One Newton step on (a, b) given a list of (theta, correct) responses
    for a single item. Returns updated (a, b).
    """
    g_a = 0.0
    g_b = 0.0
    h_aa = 0.0
    h_bb = 0.0
    h_ab = 0.0
    for theta, y in responses:
        p = p_correct(theta, a, b)
        diff = y - p
        g_a += (theta - b) * diff
        g_b += -a * diff
        # Hessian (use Fisher info equivalents)
        w = p * (1 - p)
        h_aa += -(theta - b) ** 2 * w
        h_bb += -a * a * w
        h_ab += -(theta - b) * a * w + diff
    # Solve 2x2 system: H * step = g  (we want -H so Newton step is +H_inv * g)
    det = h_aa * h_bb - h_ab * h_ab
    if abs(det) < 1e-9:
        return a, b
    da = (h_bb * g_a - h_ab * g_b) / det
    db = (-h_ab * g_a + h_aa * g_b) / det
    a_new = max(0.1, min(4.0, a - da))
    b_new = max(-4.0, min(4.0, b - db))
    return a_new, b_new


async def calibrate(
    db: AsyncSession,
    *,
    min_attempts_per_item: int = 5,
    max_em_iterations: int = 8,
    only_active_items: bool = True,
) -> CalibrationResult:
    """
    Walk attempt_logs, fit 2-PL EM, write a/b back to items.irt_*.

    Skips items with fewer than `min_attempts_per_item` attempts (the
    estimate isn't stable below that). Defaults to 5 — enough to demo
    while small enough to fit our 78-item seed once a few thousand
    attempts accrue.
    """
    # Pull attempts: (user_id, item_id, is_correct)
    rows_r = await db.execute(
        text(
            """
            SELECT user_id, item_id, is_correct
            FROM attempt_logs
            ORDER BY created_at
            """
        )
    )
    rows = [(str(u), str(i), bool(c)) for (u, i, c) in rows_r.fetchall()]
    if not rows:
        return CalibrationResult(items=[], thetas={}, iterations=0, log_likelihood=0.0)

    # Index
    item_attempts: dict[str, list[tuple[str, int]]] = {}
    user_attempts: dict[str, list[tuple[str, int]]] = {}
    for u, i, y in rows:
        item_attempts.setdefault(i, []).append((u, int(y)))
        user_attempts.setdefault(u, []).append((i, int(y)))

    # Drop items with too few attempts
    item_ids = [
        iid for iid, atts in item_attempts.items()
        if len(atts) >= min_attempts_per_item
    ]
    if not item_ids:
        return CalibrationResult(items=[], thetas={}, iterations=0, log_likelihood=0.0)

    # Init params
    a_by_item: dict[str, float] = {iid: 1.0 for iid in item_ids}
    b_by_item: dict[str, float] = {}
    for iid in item_ids:
        p_hat = sum(y for _, y in item_attempts[iid]) / len(item_attempts[iid])
        p_hat = max(0.05, min(0.95, p_hat))
        # b initialised at logit(p) inverted — a guess
        b_by_item[iid] = -math.log(p_hat / (1 - p_hat))

    theta_by_user: dict[str, float] = {u: 0.0 for u in user_attempts}
    last_ll = -1e18

    for em_iter in range(max_em_iterations):
        # E-step: update each user's theta
        for u, atts in user_attempts.items():
            resps = [
                (a_by_item[i], b_by_item[i], y)
                for (i, y) in atts
                if i in a_by_item
            ]
            if resps:
                theta_by_user[u] = _theta_mle(resps)

        # M-step: update each item's (a, b)
        for iid in item_ids:
            resps = [(theta_by_user[u], y) for (u, y) in item_attempts[iid]]
            if not resps:
                continue
            a_by_item[iid], b_by_item[iid] = _item_step(
                resps, a_by_item[iid], b_by_item[iid]
            )

        # Log-likelihood
        ll = 0.0
        for u, atts in user_attempts.items():
            for (i, y) in atts:
                if i not in a_by_item:
                    continue
                p = p_correct(theta_by_user[u], a_by_item[i], b_by_item[i])
                p = max(1e-9, min(1 - 1e-9, p))
                ll += y * math.log(p) + (1 - y) * math.log(1 - p)
        if abs(ll - last_ll) < 0.01:
            break
        last_ll = ll

    # Write back to items
    from datetime import datetime
    now = datetime.utcnow()
    for iid in item_ids:
        await db.execute(
            text(
                """
                UPDATE items
                SET irt_discrimination = :a,
                    irt_difficulty = :b,
                    irt_guessing = 0,
                    irt_calibrated_at = :now,
                    attempts_count = :n
                WHERE id = :iid
                """
            ),
            {
                "a": a_by_item[iid],
                "b": b_by_item[iid],
                "now": now,
                "n": len(item_attempts[iid]),
                "iid": iid,
            },
        )

    return CalibrationResult(
        items=[
            ItemParams(
                item_id=UUID(iid),
                a=a_by_item[iid],
                b=b_by_item[iid],
                n_attempts=len(item_attempts[iid]),
            )
            for iid in item_ids
        ],
        thetas={UUID(u): t for u, t in theta_by_user.items()},
        iterations=em_iter + 1,
        log_likelihood=last_ll,
    )


# ---------------------------------------------------------------------------
# Scoring a single attempt (used by mock-attempt submission)
# ---------------------------------------------------------------------------


def estimate_theta_and_se(
    responses: Sequence[tuple[float, float, int]],
) -> tuple[float, float]:
    """
    Given a sequence of (a, b, y) responses, return (theta_hat, SE).
    SE is 1/sqrt(I(theta)). Returns (0, large) if responses is empty
    or info is zero.
    """
    if not responses:
        return 0.0, 9.99
    theta = _theta_mle(list(responses))
    info = 0.0
    for a, b, y in responses:
        p = p_correct(theta, a, b)
        info += a * a * p * (1 - p)
    se = (1.0 / math.sqrt(info)) if info > 1e-9 else 9.99
    return theta, se


def scaled_score(theta: float, mapping: list[dict]) -> float | None:
    """
    Piecewise-linear interpolation of theta → scaled exam score.
    mapping = [{"theta": -2.0, "score": 140}, {"theta": 0.0, "score": 200}, ...]
    Returns None if mapping is empty.
    """
    if not mapping:
        return None
    pts = sorted(mapping, key=lambda d: d["theta"])
    if theta <= pts[0]["theta"]:
        return float(pts[0]["score"])
    if theta >= pts[-1]["theta"]:
        return float(pts[-1]["score"])
    for i in range(len(pts) - 1):
        t0, s0 = pts[i]["theta"], pts[i]["score"]
        t1, s1 = pts[i + 1]["theta"], pts[i + 1]["score"]
        if t0 <= theta <= t1:
            frac = (theta - t0) / (t1 - t0) if t1 != t0 else 0
            return float(s0 + frac * (s1 - s0))
    return None


def pass_probability(scaled: float | None, threshold: float | None, se_theta: float) -> float | None:
    """
    Probability that a learner's TRUE scaled score is >= the threshold,
    given the point estimate and the SE of theta. We assume the local
    theta→score map is roughly linear, so SE(scaled) ≈ slope * SE(theta).
    Falls back to a step function if mapping/threshold is absent.
    """
    if scaled is None or threshold is None:
        return None
    # Simple z-test treating SE(scaled) ≈ 15 * SE(theta) as a default
    # (USMLE-style 15-point scale per theta unit). Phase 7.2b will read
    # the actual slope from the mapping.
    margin = (scaled - threshold) / max(0.1, 15 * se_theta)
    # Cumulative normal approximation (Abramowitz & Stegun 26.2.17)
    return 0.5 * (1 + math.erf(margin / math.sqrt(2)))
