"""Grader 12: prediction, for predict, observe, explain items.

The sequence matters and the grader enforces it.

  predict   The learner commits to an outcome before seeing anything. The
            prediction is graded against what the simulation will actually do,
            and a wrong prediction keys a named misconception rather than
            simply being marked wrong.
  observe   Only now does the simulation run and the result appear. The
            learner records what they saw. This step is not scored; recording
            an observation is not a test.
  explain   The learner selects the mechanism that accounts for what happened.
            Distractor mechanisms key misconceptions the same way prediction
            distractors do.

Two rules are structural, not stylistic. A prediction cannot be revised after
observing, because a prediction you can change once you have seen the answer
is not a prediction. And the explain step cannot be reached before the observe
step, because explaining something you have not seen is guessing.

Free text reflection is accepted and stored alongside, but it is returned with
graded=False and is never scored. This platform does not have a reviewed
rubric for free text chemistry explanation, so pretending to grade one would
be inventing a score.

Independent verification: a prediction key is never taken on the item author's
word. verify_prediction_key runs the simulation engine and checks that the
stated outcome is what the physics actually produces. An item whose key
disagrees with its own simulation does not ship.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from .types import GradeResult, VerifierResult

PHASES = ("predict", "observe", "explain")


@dataclass(frozen=True)
class Option:
    """One selectable prediction or explanation.

    misconception is set on every option except the correct one, so a wrong
    selection routes to remediation rather than producing a bare "incorrect".
    """

    id: str
    text: str
    misconception: str | None = None
    feedback: str = ""


@dataclass(frozen=True)
class PoeItem:
    """A predict, observe, explain item bound to a simulation scenario."""

    id: str
    node: str
    scenario: str
    predict_prompt: str
    predict_options: list[Option]
    predict_key: str
    explain_prompt: str
    explain_options: list[Option]
    explain_key: str
    observe_prompt: str = "Record what you saw."
    reflection_prompt: str = ""


def _grade_choice(options: list[Option], key: str, chosen: str, grader: str) -> GradeResult:
    by_id = {o.id: o for o in options}
    if key not in by_id:
        return GradeResult.ungradable(grader, f"item key {key} is not one of its own options")
    if chosen not in by_id:
        return GradeResult.ungradable(
            grader, "That selection is not one of the offered options."
        )

    picked = by_id[chosen]
    if chosen == key:
        return GradeResult(
            is_correct=True,
            score=1.0,
            grader=grader,
            detail=picked.feedback or "Correct.",
            correct_display=by_id[key].text,
        )
    return GradeResult(
        is_correct=False,
        score=0.0,
        grader=grader,
        misconception=picked.misconception,
        detail=picked.feedback
        or "Not what happens. Look again at what the system does when the stress is applied.",
        correct_display=by_id[key].text,
    )


def grade_prediction(item: PoeItem, chosen: str) -> GradeResult:
    """Grade the commitment made before the simulation runs."""
    return _grade_choice(item.predict_options, item.predict_key, chosen, "prediction")


def grade_explanation(item: PoeItem, chosen: str) -> GradeResult:
    """Grade the mechanism selected after observing."""
    return _grade_choice(item.explain_options, item.explain_key, chosen, "prediction")


def check_options(options: list[Option], key: str) -> list[str]:
    """Structural validation an item must pass before it can ship."""
    problems: list[str] = []
    ids = [o.id for o in options]
    if len(ids) != len(set(ids)):
        problems.append("option ids are not unique")
    if key not in ids:
        problems.append(f"key {key} is not among the options")
    if len(options) < 3:
        problems.append("fewer than three options offers too little to discriminate")
    texts = [o.text.strip().lower() for o in options]
    if len(texts) != len(set(texts)):
        problems.append("two options say the same thing")
    for o in options:
        if not o.text.strip():
            problems.append(f"option {o.id} has no text")
        if o.id != key and not o.misconception:
            problems.append(f"distractor {o.id} keys no misconception")
        if o.id == key and o.misconception:
            problems.append(f"correct option {o.id} must not key a misconception")
    return problems


def verify_prediction_key(item: PoeItem, observed: dict) -> VerifierResult:
    """Check the stated key against what the simulation actually produced.

    observed is the result dict from the simulation engine. The correct
    option's id must encode the outcome the engine derived. Options are named
    by outcome (for example "forward", "reverse", "rises", "falls") precisely
    so this check can be mechanical rather than a matter of reading prose.
    """
    outcome = observed.get("outcome")
    if outcome is None:
        return VerifierResult(False, "simulation-agreement", "simulation reported no outcome")
    if item.predict_key != outcome:
        return VerifierResult(
            False,
            "simulation-agreement",
            f"item key is {item.predict_key}, simulation produced {outcome}",
        )
    return VerifierResult(True, "simulation-agreement", f"simulation produced {outcome}")


@dataclass
class PoeAttempt:
    """Server side state for one learner working through one POE item.

    The phase field is the enforcement point. It only moves forward, and each
    transition requires the previous step to have been completed.
    """

    item_id: str
    phase: str = "predict"
    prediction: str | None = None
    prediction_result: dict | None = None
    observation: str = ""
    explanation: str | None = None
    explanation_result: dict | None = None
    reflection: str = ""
    simulation: dict | None = field(default=None, repr=False)

    def can_advance_to(self, phase: str) -> tuple[bool, str]:
        if phase not in PHASES:
            return False, f"unknown phase {phase}"
        current = PHASES.index(self.phase)
        target = PHASES.index(phase)
        if target < current:
            return False, "a prediction cannot be revised after the result is visible"
        if phase == "observe" and self.prediction is None:
            return False, "predict before observing"
        if phase == "explain" and not self.observation.strip():
            return False, "record an observation before explaining"
        return True, ""
