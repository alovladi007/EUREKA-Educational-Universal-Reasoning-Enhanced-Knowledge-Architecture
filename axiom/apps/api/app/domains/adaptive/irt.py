"""Item Response Theory and computerized adaptive testing (CAT).

A 3PL model (2PL is the c = 0 special case) gives the probability of a correct
response as a function of ability theta and the item parameters a
(discrimination), b (difficulty), and c (guessing). CAT selects the next item by
maximum Fisher information at the current ability estimate and stops when the
standard error drops below a threshold. Ability is estimated by EAP (expected a
posteriori) over a grid, which is robust and always defined, unlike raw MLE at
all-correct or all-incorrect response patterns.

Pure functions, no database, so the algorithm is simple to simulate and test.
"""

from __future__ import annotations

import math
from dataclasses import dataclass


@dataclass(frozen=True)
class ItemParams:
    a: float = 1.0  # discrimination
    b: float = 0.0  # difficulty
    c: float = 0.0  # guessing (lower asymptote)


def _logistic(z: float) -> float:
    # Numerically stable logistic.
    if z >= 0:
        return 1.0 / (1.0 + math.exp(-z))
    ez = math.exp(z)
    return ez / (1.0 + ez)


def p_correct(theta: float, params: ItemParams) -> float:
    """Probability of a correct response under the 3PL model."""
    return params.c + (1.0 - params.c) * _logistic(params.a * (theta - params.b))


def information(theta: float, params: ItemParams) -> float:
    """Fisher information of the item at ability theta (3PL)."""
    if params.c >= 1.0:
        return 0.0
    p = min(max(p_correct(theta, params), 1e-9), 1.0 - 1e-9)
    q = 1.0 - p
    return (params.a**2) * (q / p) * ((p - params.c) / (1.0 - params.c)) ** 2


# Ability grid for EAP estimation: -4 to 4 in steps of 0.1.
_GRID: list[float] = [round(-4.0 + 0.1 * i, 4) for i in range(81)]


def estimate_theta(
    responses: list[tuple[ItemParams, bool]],
    prior_mean: float = 0.0,
    prior_sd: float = 1.0,
) -> tuple[float, float]:
    """EAP ability estimate and its posterior standard deviation (the SE).

    responses is a list of (item parameters, was the response correct). With no
    responses the prior is returned.
    """
    if not responses:
        return prior_mean, prior_sd

    log_post: list[float] = []
    for theta in _GRID:
        lp = -0.5 * ((theta - prior_mean) / prior_sd) ** 2
        for params, correct in responses:
            p = min(max(p_correct(theta, params), 1e-9), 1.0 - 1e-9)
            lp += math.log(p if correct else (1.0 - p))
        log_post.append(lp)

    peak = max(log_post)
    weights = [math.exp(lp - peak) for lp in log_post]
    total = sum(weights)
    weights = [w / total for w in weights]

    mean = sum(theta * w for theta, w in zip(_GRID, weights, strict=False))
    var = sum(((theta - mean) ** 2) * w for theta, w in zip(_GRID, weights, strict=False))
    return mean, math.sqrt(max(var, 0.0))


def select_next(
    theta: float, candidates: list[tuple[str, ItemParams]]
) -> tuple[str | None, float]:
    """Pick the candidate with the most information at theta. Returns
    (item id, information). Returns (None, 0.0) when there are no candidates."""
    best_id: str | None = None
    best_info = -1.0
    for item_id, params in candidates:
        info = information(theta, params)
        if info > best_info:
            best_info = info
            best_id = item_id
    return best_id, max(best_info, 0.0)


def calibrate_from_stats(
    p_value: float, point_biserial: float, n: int
) -> ItemParams:
    """A pragmatic classical-to-IRT mapping used until enough data supports full
    marginal maximum likelihood calibration.

    b (difficulty) comes from the item p-value through the normal quantile
    (harder items sit higher). a (discrimination) scales with the point-biserial
    correlation. c defaults to 0.2 for selected-response items. Bounded to keep
    values sane for small samples.
    """
    p = min(max(p_value, 0.02), 0.98)
    # Inverse normal CDF (Acklam approximation) for the difficulty.
    b = -_inv_norm_cdf(p)
    b = min(max(b, -3.0), 3.0)
    a = min(max(0.4 + 1.7 * max(point_biserial, 0.0), 0.4), 2.5)
    return ItemParams(a=round(a, 3), b=round(b, 3), c=0.2)


def _inv_norm_cdf(p: float) -> float:
    """Inverse standard-normal CDF (Peter Acklam approximation)."""
    a = [-3.969683028665376e01, 2.209460984245205e02, -2.759285104469687e02,
         1.383577518672690e02, -3.066479806614716e01, 2.506628277459239e00]
    b = [-5.447609879822406e01, 1.615858368580409e02, -1.556989798598866e02,
         6.680131188771972e01, -1.328068155288572e01]
    c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e00,
         -2.549732539343734e00, 4.374664141464968e00, 2.938163982698783e00]
    d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e00,
         3.754408661907416e00]
    plow = 0.02425
    phigh = 1 - plow
    if p < plow:
        q = math.sqrt(-2 * math.log(p))
        return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / (
            (((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1
        )
    if p <= phigh:
        q = p - 0.5
        r = q * q
        return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (
            ((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1
        )
    q = math.sqrt(-2 * math.log(1 - p))
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / (
        (((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1
    )
