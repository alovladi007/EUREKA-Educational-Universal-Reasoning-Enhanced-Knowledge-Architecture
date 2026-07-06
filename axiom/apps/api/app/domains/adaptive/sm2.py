"""SM-2 spaced-repetition scheduling.

A pure implementation of the SM-2 algorithm (SuperMemo 2), used to schedule the
review of nodes a learner has mastered so retention does not decay. Kept free of
the database so the interval progression is trivial to test.

Quality is on the standard 0..5 scale. AXIOM derives it from a graded response:
a correct answer is a good recall (5), an incorrect answer is a lapse (2), which
resets the repetition count and brings the item back the next day.
"""

from __future__ import annotations

from dataclasses import dataclass

MIN_EASE = 1.3


@dataclass(frozen=True)
class Sm2State:
    ease: float
    interval_days: int
    reps: int


def quality_from_correct(is_correct: bool, score: float | None = None) -> int:
    """Map a graded response to an SM-2 quality on 0..5.

    A correct answer is a strong recall (5). An incorrect answer is a lapse (2),
    below the 3 threshold, so the scheduler resets and reschedules for tomorrow.
    A partial score (0.5..1.0) scales the recall quality between 3 and 5.
    """
    if not is_correct:
        return 2
    if score is None:
        return 5
    scaled = 3 + round(min(max(score, 0.0), 1.0) * 2)
    return max(3, min(5, scaled))


def sm2_update(state: Sm2State, quality: int) -> Sm2State:
    """Advance an SM-2 schedule by one review.

    - quality < 3 (a lapse): reset the repetition count and review again in one
      day, keeping the (adjusted) ease so a hard item does not spring back to a
      long interval.
    - quality >= 3: first success -> 1 day, second -> 6 days, thereafter multiply
      the interval by the ease factor. The ease is nudged by the usual SM-2 term
      and floored at 1.3.
    """
    q = max(0, min(5, quality))
    ease = state.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    ease = max(MIN_EASE, ease)

    if q < 3:
        return Sm2State(ease=ease, interval_days=1, reps=0)

    reps = state.reps + 1
    if reps == 1:
        interval = 1
    elif reps == 2:
        interval = 6
    else:
        interval = max(1, round(state.interval_days * ease))
    return Sm2State(ease=ease, interval_days=interval, reps=reps)
