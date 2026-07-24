"""SM-2 spaced repetition. Ported from AXIOM.

Used to resurface mastered nodes on a schedule, and to queue a remediation
review when a misconception is diagnosed.
"""

from __future__ import annotations

from dataclasses import dataclass

MIN_EASE = 1.3


@dataclass(frozen=True)
class Sm2State:
    ease: float = 2.5
    interval_days: int = 0
    reps: int = 0


def quality_from_correct(is_correct: bool, score: float = 1.0) -> int:
    """Map a grade onto the SM-2 zero to five quality scale.

    Wrong is 2 (a lapse, not a total blank, since the learner did attempt it).
    Correct scales 3 to 5 with partial credit, so a correct answer that needed
    hints or lost a milestone does not earn the full interval.
    """
    if not is_correct:
        return 2
    clamped = min(max(score, 0.0), 1.0)
    return 3 + round(2 * clamped)


def sm2_update(state: Sm2State, quality: int) -> Sm2State:
    q = min(max(quality, 0), 5)
    if q < 3:
        # Lapse. Restart the interval but keep most of the ease.
        return Sm2State(ease=max(MIN_EASE, state.ease - 0.20), interval_days=1, reps=0)
    ease = state.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    ease = max(MIN_EASE, ease)
    reps = state.reps + 1
    if reps == 1:
        interval = 1
    elif reps == 2:
        interval = 6
    else:
        interval = int(round(state.interval_days * ease)) or 1
    return Sm2State(ease=ease, interval_days=interval, reps=reps)
