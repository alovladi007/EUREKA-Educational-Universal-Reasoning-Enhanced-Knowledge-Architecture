"""AXIOM mastery engine: Bayesian Knowledge Tracing (BKT).

Estimates, per learner per KnowledgeNode, the probability that the skill is
mastered, updated after every graded attempt. Deliberately the simple,
explainable baseline from the build prompt: four parameters, closed-form
Bayesian update, and an evidence log so a teacher can always answer "why does
the system think this."

BKT parameters (standard):
  p_init   prior probability the skill was already mastered
  p_learn  probability of transitioning to mastered after an opportunity
  p_slip   probability of answering wrong despite mastery
  p_guess  probability of answering right without mastery

Update rule: Bayes on the observation, then the learning transition.

Storage here is in-memory (a dict) because this is the proof-of-model slice.
In the platform this becomes the MasteryState table: append-only evidence rows
plus a current view, exactly as the data model specifies.
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class BktParams:
    p_init: float = 0.15
    p_learn: float = 0.20
    p_slip: float = 0.10
    p_guess: float = 0.20


@dataclass
class EvidenceRow:
    item_id: str
    correct: bool
    p_before: float
    p_after: float
    note: str


@dataclass
class NodeMastery:
    node_id: str
    p_mastered: float
    evidence: list[EvidenceRow] = field(default_factory=list)


class MasteryStore:
    """Per-learner, per-node mastery with BKT updates and an evidence trail."""

    def __init__(self, params: BktParams | None = None) -> None:
        self.params = params or BktParams()
        self._store: dict[tuple[str, str], NodeMastery] = {}

    def get(self, learner_id: str, node_id: str) -> NodeMastery:
        key = (learner_id, node_id)
        if key not in self._store:
            self._store[key] = NodeMastery(node_id, self.params.p_init)
        return self._store[key]

    def all_for(self, learner_id: str) -> list[NodeMastery]:
        return [m for (lid, _), m in sorted(self._store.items()) if lid == learner_id]

    def update(
        self, learner_id: str, node_id: str, item_id: str, correct: bool
    ) -> NodeMastery:
        p = self.params
        m = self.get(learner_id, node_id)
        prior = m.p_mastered

        # Bayes on the observation.
        if correct:
            num = prior * (1 - p.p_slip)
            den = num + (1 - prior) * p.p_guess
        else:
            num = prior * p.p_slip
            den = num + (1 - prior) * (1 - p.p_guess)
        posterior = num / den if den > 0 else prior

        # Learning transition.
        p_new = posterior + (1 - posterior) * p.p_learn
        p_new = min(max(p_new, 0.0), 1.0)

        note = (
            f"{'correct' if correct else 'incorrect'} on {item_id}: "
            f"{prior:.3f} -> {p_new:.3f} "
            f"(posterior {posterior:.3f}, then learning transition)"
        )
        m.evidence.append(EvidenceRow(item_id, correct, prior, p_new, note))
        m.p_mastered = p_new
        return m


MASTERY_THRESHOLD = 0.85  # a node counts as mastered at or above this
