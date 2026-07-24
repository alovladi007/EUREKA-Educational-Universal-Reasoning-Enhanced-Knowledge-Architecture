"""Bayesian Knowledge Tracing. Ported from AXIOM unchanged in behaviour.

Pure and database free by design, so the model can be reasoned about and
tested without any infrastructure. The four parameters are the standard BKT
set, and the bands are what the learner actually sees.
"""

from __future__ import annotations

from dataclasses import dataclass

# Band thresholds. plan_path gates on PREREQ_BAR and marks done at MASTERED_BAR.
PREREQ_BAR = 0.70
MASTERED_BAR = 0.90


@dataclass(frozen=True)
class BktParams:
    p_l0: float = 0.25   # prior probability the learner already knows it
    p_t: float = 0.15    # probability of learning it on this opportunity
    p_s: float = 0.10    # probability of slipping (knows it, answers wrong)
    p_g: float = 0.20    # probability of guessing (does not know it, right)


DEFAULT = BktParams()


def bkt_update(p_known: float, correct: bool, params: BktParams = DEFAULT) -> float:
    """One BKT step. Returns the posterior probability of knowing the skill."""
    p = min(max(p_known, 0.0), 1.0)
    if correct:
        numerator = p * (1 - params.p_s)
        denominator = numerator + (1 - p) * params.p_g
    else:
        numerator = p * params.p_s
        denominator = numerator + (1 - p) * (1 - params.p_g)
    posterior = numerator / denominator if denominator > 0 else p
    # Account for learning during the opportunity itself.
    return min(posterior + (1 - posterior) * params.p_t, 1.0)


def level_for(p_known: float) -> str:
    if p_known >= MASTERED_BAR:
        return "mastered"
    if p_known >= PREREQ_BAR:
        return "proficient"
    if p_known >= 0.4:
        return "developing"
    return "novice"


def apply_with_grader_trust(p_known: float, correct: bool, *, grader_confidence: float = 1.0,
                            params: BktParams = DEFAULT) -> float:
    """Scale the BKT step by how much the grader is trusted.

    A deterministic grader with an independent verifier has confidence 1.0 and
    moves mastery fully. A lower confidence signal moves it proportionally.
    This is the seam that keeps a future AI grader from being able to declare
    mastery on its own say so.
    """
    full = bkt_update(p_known, correct, params)
    confidence = min(max(grader_confidence, 0.0), 1.0)
    return p_known + confidence * (full - p_known)
