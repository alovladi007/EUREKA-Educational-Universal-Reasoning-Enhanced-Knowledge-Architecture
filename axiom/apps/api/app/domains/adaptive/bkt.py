"""Bayesian Knowledge Tracing.

BKT is the explainable mastery baseline. Given a prior probability that a skill
is known and one observed response (correct or not), it produces a posterior.
The four parameters are: p_L0 (prior known), p_T (probability of learning on an
opportunity), p_S (slip: known but answers wrong), p_G (guess: not known but
answers right). A Deep Knowledge Tracing model can later sit behind the same
interface; the point of BKT here is that every step is inspectable.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class BktParams:
    p_l0: float = 0.2
    p_t: float = 0.15
    p_s: float = 0.1
    p_g: float = 0.2


DEFAULT_PARAMS = BktParams()

# Level bands over p_known. Kept explicit so the label a teacher sees maps to a
# documented range.
_BANDS = (
    (0.9, "mastered"),
    (0.7, "proficient"),
    (0.4, "developing"),
    (0.0, "novice"),
)


def level_for(p_known: float) -> str:
    for threshold, label in _BANDS:
        if p_known >= threshold:
            return label
    return "novice"


def bkt_update(p_known: float, correct: bool, params: BktParams = DEFAULT_PARAMS) -> float:
    """Return the posterior probability the skill is known after one response.

    Step 1: condition on the observation (Bayes). Step 2: account for the chance
    the student learned the skill on this opportunity (p_t).
    """
    p = min(max(p_known, 1e-6), 1 - 1e-6)
    p_correct = p * (1 - params.p_s) + (1 - p) * params.p_g
    if correct:
        posterior = (p * (1 - params.p_s)) / p_correct
    else:
        p_incorrect = 1 - p_correct
        posterior = (p * params.p_s) / p_incorrect
    # Learning opportunity.
    updated = posterior + (1 - posterior) * params.p_t
    return float(min(max(updated, 0.0), 1.0))
