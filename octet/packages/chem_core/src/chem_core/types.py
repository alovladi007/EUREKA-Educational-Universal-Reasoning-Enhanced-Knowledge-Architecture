"""Shared result types for every OCTET grader.

House rule from the build prompt: a grader never raises on hostile input. It
returns a GradeResult with graded=False and a diagnosis the learner can read.
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class GradeResult:
    """The single value every chem_core grader returns.

    is_correct: the learner got it right.
    score: 0.0 to 1.0, allowing partial credit on milestone graders.
    graded: False means the submission could not be parsed at all. This is
        distinct from is_correct=False, which means it parsed and was wrong.
        Adversarial input yields graded=False, never an exception.
    grader: which deterministic grader ran (formula, balance, stoich, mc,
        equilibrium). Recorded on the response for audit.
    detail: learner-facing explanation. Per the teaching model this names the
        belief behind the error where one is diagnosed, and never states the
        answer to a live item.
    misconception: named misconception code when one is diagnosed.
    milestones: per-step outcomes for chained problems. The first entry with
        ok=False is the error localization the learner is shown.
    correct_display: canonical rendering of the key, for post-attempt review
        surfaces only.
    """

    is_correct: bool
    score: float = 0.0
    graded: bool = True
    grader: str = "unknown"
    detail: str = ""
    misconception: str | None = None
    milestones: list[dict] = field(default_factory=list)
    correct_display: str = ""

    @classmethod
    def ungradable(cls, grader: str, detail: str) -> "GradeResult":
        """Malformed submission. Never an exception, never a 500."""
        return cls(
            is_correct=False, score=0.0, graded=False, grader=grader, detail=detail
        )

    def first_failed_milestone(self) -> dict | None:
        for m in self.milestones:
            if not m.get("ok", False):
                return m
        return None


@dataclass
class VerifierResult:
    """Outcome of an independent verification of a generated answer key.

    Every generator in the registry is checked by a second computational path
    before the variant is ever served. ok=False means the key is not trusted
    and the seed is discarded.
    """

    ok: bool
    method: str
    detail: str = ""
