"""Swappable mastery model (Build prompt Section 9).

The build prompt calls for BKT as the baseline "with an optional Deep Knowledge
Tracing model behind the same interface for later." This module is that
interface, matching the identity / reasoning / formal-verifier provider pattern:

  - BktMasteryModel is the default: it wraps the explainable BKT update.
  - DktMasteryModel is the seam for a trained sequence model. It is NOT trained
    here -- shipping an untrained DKT would be dishonest -- so it falls back to
    BKT and is documented as a placeholder. When a trained DKT checkpoint exists,
    this class loads it and overrides update() with the sequence model; nothing
    else in the adaptive engine changes, because callers depend only on the
    MasteryModel interface.

apply_mastery() calls get_mastery_model().update(...) rather than bkt_update
directly, so switching models is a configuration change (AXIOM_MASTERY_MODEL),
not a rewrite.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Protocol

from app.core.config import get_settings
from app.domains.adaptive.bkt import DEFAULT_PARAMS, BktParams, bkt_update


class MasteryModel(Protocol):
    name: str

    def update(self, p_known: float, correct: bool) -> float:
        """Return the posterior probability the skill is known after a response."""
        ...


class BktMasteryModel:
    """Explainable Bayesian Knowledge Tracing (the default)."""

    name = "bkt"

    def __init__(self, params: BktParams = DEFAULT_PARAMS) -> None:
        self._params = params

    def update(self, p_known: float, correct: bool) -> float:
        return bkt_update(p_known, correct, self._params)


class DktMasteryModel:
    """Deep Knowledge Tracing seam -- NOT trained; falls back to BKT.

    Present so the "DKT behind the same interface" contract is real and testable,
    without pretending a trained model exists. Selecting it (AXIOM_MASTERY_MODEL=
    dkt) behaves exactly like BKT until a trained checkpoint is wired in here.
    """

    name = "dkt"

    def __init__(self) -> None:
        self._fallback = BktMasteryModel()
        self.trained = False  # flips to True once a real checkpoint is loaded

    def update(self, p_known: float, correct: bool) -> float:
        # No trained sequence model available: defer to BKT so behavior never
        # silently degrades. A future implementation replaces this body.
        return self._fallback.update(p_known, correct)


@lru_cache
def get_mastery_model() -> MasteryModel:
    """Return the configured mastery model (cached, argument-free).

    Defaults to BKT. Set AXIOM_MASTERY_MODEL=dkt to select the DKT seam (which
    currently mirrors BKT, by design, until a trained model is provided).
    """
    settings = get_settings()
    if getattr(settings, "mastery_model", "bkt") == "dkt":
        return DktMasteryModel()
    return BktMasteryModel()
