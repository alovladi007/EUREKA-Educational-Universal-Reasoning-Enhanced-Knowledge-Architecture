"""Scoring a submitted exam.

What this reports: how many items were right, per section and per node, and
which named misconceptions the wrong answers pointed at.

What this deliberately does not report, and why it matters more than what it
does:

  A scaled score. Scaling a raw count onto a 0 to 100 or a 1 to 5 band is a
  psychometric claim that this many raw points corresponds to that level of
  ability. That claim needs item difficulty parameters estimated from real
  response data, and no item in this bank has ever been calibrated. AXIOM has
  an IRT engine because it has that data path; OCTET does not yet, and
  inventing a scale would produce a number that looks like a grade and is not
  one.

  A predicted grade on any external exam. Same problem, worse: it would also
  be a claim about an examination this platform has no relationship with.

  A pass or fail. That is a cut score, which is a policy decision an
  instructor makes, not a property of the response set.

So the result is counts, percentages of items attempted, and a per node
breakdown. An instructor can apply whatever cut score their syllabus states.
That is less impressive than a scaled score and it is the only honest thing
this data supports.

Grading itself runs through the same sandboxed path practice uses, against the
stored key of the issued variant. Nothing is regraded from a value recomputed
at scoring time.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from app.domains.exams.assembly import Form, FormItem


@dataclass(frozen=True)
class ItemResult:
    position: int
    section_id: str
    node: str
    template_id: str
    seed: int
    answered: bool
    is_correct: bool
    score: float
    graded: bool
    misconception: str | None
    detail: str


@dataclass(frozen=True)
class SectionScore:
    section_id: str
    items: int
    answered: int
    correct: int
    # Ungradable responses are counted separately from wrong ones. A learner
    # who wrote something the grader could not read has not been shown to hold
    # a wrong belief, and folding those into "incorrect" would overstate what
    # the exam measured.
    ungradable: int

    @property
    def raw_percent(self) -> float | None:
        gradable = self.items - self.ungradable
        if gradable <= 0:
            return None
        return round(100.0 * self.correct / gradable, 1)


@dataclass(frozen=True)
class NodeScore:
    node: str
    items: int
    correct: int


@dataclass(frozen=True)
class ExamResult:
    blueprint_code: str
    items: int
    answered: int
    correct: int
    ungradable: int
    sections: tuple[SectionScore, ...]
    nodes: tuple[NodeScore, ...]
    misconceptions: tuple[tuple[str, int], ...]
    item_results: tuple[ItemResult, ...]
    notes: tuple[str, ...]

    @property
    def raw_percent(self) -> float | None:
        gradable = self.items - self.ungradable
        if gradable <= 0:
            return None
        return round(100.0 * self.correct / gradable, 1)


def score_form(
    form: Form,
    graded_by_position: dict[int, dict],
    answered_positions: set[int],
) -> ExamResult:
    """Assemble the result from already graded responses.

    Grading happens in the service, through the sandbox, because it is async
    and this module stays pure so it can be tested without a process pool.
    graded_by_position holds the grader's own output dict per item position.
    """
    results: list[ItemResult] = []
    for item in form.items:
        graded = graded_by_position.get(item.position)
        answered = item.position in answered_positions
        if graded is None:
            results.append(
                ItemResult(
                    position=item.position,
                    section_id=item.section_id,
                    node=item.node,
                    template_id=item.template_id,
                    seed=item.seed,
                    answered=False,
                    is_correct=False,
                    score=0.0,
                    graded=True,
                    misconception=None,
                    detail="No answer was submitted for this item.",
                )
            )
            continue
        results.append(
            ItemResult(
                position=item.position,
                section_id=item.section_id,
                node=item.node,
                template_id=item.template_id,
                seed=item.seed,
                answered=answered,
                is_correct=bool(graded["is_correct"]),
                score=float(graded["score"]),
                graded=bool(graded["graded"]),
                misconception=graded.get("misconception"),
                detail=str(graded.get("detail", "")),
            )
        )

    def summarise(subset: list[ItemResult]) -> tuple[int, int, int]:
        answered_count = sum(1 for r in subset if r.answered)
        correct = sum(1 for r in subset if r.is_correct)
        ungradable = sum(1 for r in subset if r.answered and not r.graded)
        return answered_count, correct, ungradable

    sections: list[SectionScore] = []
    for section_id in dict.fromkeys(i.section_id for i in form.items):
        subset = [r for r in results if r.section_id == section_id]
        answered_count, correct, ungradable = summarise(subset)
        sections.append(
            SectionScore(
                section_id=section_id,
                items=len(subset),
                answered=answered_count,
                correct=correct,
                ungradable=ungradable,
            )
        )

    nodes: list[NodeScore] = []
    for node in dict.fromkeys(i.node for i in form.items):
        subset = [r for r in results if r.node == node]
        nodes.append(
            NodeScore(node=node, items=len(subset), correct=sum(1 for r in subset if r.is_correct))
        )

    counts: dict[str, int] = {}
    for r in results:
        if r.misconception:
            counts[r.misconception] = counts.get(r.misconception, 0) + 1

    answered_count, correct, ungradable = summarise(results)
    notes = list(form.notes)
    notes.append(
        "This result reports raw counts only. No scaled score, predicted grade "
        "or pass mark is given, because no item in this bank has been "
        "calibrated against real response data and any scale would be invented."
    )
    if ungradable:
        notes.append(
            f"{ungradable} answer(s) could not be read by the grader. Those are "
            "counted separately from wrong answers and excluded from the "
            "percentage, because an unreadable answer is not evidence of a "
            "wrong belief."
        )

    return ExamResult(
        blueprint_code=form.blueprint_code,
        items=len(form.items),
        answered=answered_count,
        correct=correct,
        ungradable=ungradable,
        sections=tuple(sections),
        nodes=tuple(nodes),
        misconceptions=tuple(sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))),
        item_results=tuple(results),
        notes=tuple(notes),
    )
