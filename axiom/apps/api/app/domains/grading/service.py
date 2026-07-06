"""Grading service.

Pure grading functions (no database) so they are trivial to unit test. The
practice and assessment flows call grade() and then persist the GradingRecord,
Score, and ReasoningTrace. Math grading delegates to math_core, which uses
SymPy symbolic equivalence rather than string matching, so several equivalent
correct forms all grade correct.

Supported kinds: mcq_single, numeric, math_expression, equation, mcq_multi,
true_false, short_text, plot_points, plot_function, draw_line, ordering,
matching, show_work (with milestone step credit).

grader values: exact (selection), numeric (tolerance), cas (symbolic).
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field

from math_core import grade_equation, grade_expression, grade_numeric, symbolic_equal


@dataclass
class GradeOutcome:
    is_correct: bool
    score: float
    grader: str
    confidence: float
    detail: str
    correct_display: str
    explanation: str = ""
    # For show_work: [{"milestone": str, "awarded": bool}, ...].
    step_credits: list[dict] = field(default_factory=list)


def _parse_index_set(raw: str) -> set[int]:
    raw = raw.strip()
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, list):
            return {int(x) for x in parsed}
    except (ValueError, TypeError):
        pass
    tokens = raw.replace(";", ",").split(",")
    return {int(tok) for tok in tokens if tok.strip().lstrip("-").isdigit()}


def _parse_points(raw: str) -> set[tuple[float, float]]:
    try:
        parsed = json.loads(raw)
    except (ValueError, TypeError):
        return set()
    out: set[tuple[float, float]] = set()
    if isinstance(parsed, list):
        for pt in parsed:
            if isinstance(pt, (list, tuple)) and len(pt) == 2:
                out.add((round(float(pt[0]), 4), round(float(pt[1]), 4)))
    return out


def _parse_point_list(raw: str) -> list[tuple[float, float]]:
    """Parse an ordered JSON list of [x, y] pairs (order and duplicates kept)."""
    try:
        parsed = json.loads(raw)
    except (ValueError, TypeError):
        return []
    out: list[tuple[float, float]] = []
    if isinstance(parsed, list):
        for pt in parsed:
            if isinstance(pt, (list, tuple)) and len(pt) == 2:
                try:
                    out.append((float(pt[0]), float(pt[1])))
                except (ValueError, TypeError):
                    continue
    return out


def _line_equation_from_points(
    p1: tuple[float, float], p2: tuple[float, float]
) -> str | None:
    """Build a line equation string from two distinct points.

    Vertical lines become 'x = c'; every other line becomes 'y = m*x + b'. The
    resulting string is graded against the reference line with grade_equation,
    so a student line and the answer key match when they are the same line
    (equal up to a nonzero scalar). Returns None when the points coincide.
    """
    (x1, y1), (x2, y2) = p1, p2
    if abs(x1 - x2) < 1e-9 and abs(y1 - y2) < 1e-9:
        return None
    if abs(x1 - x2) < 1e-9:
        return f"x = {x1}"
    slope = (y2 - y1) / (x2 - x1)
    intercept = y1 - slope * x1
    return f"y = {slope}*x + ({intercept})"


def _to_zero_form(text: str) -> str:
    """Rewrite an equation 'lhs = rhs' as the expression 'lhs - (rhs)'.

    symbolic_equal compares expressions, not equations, so equation-shaped
    milestones and student lines are moved to a single side first. Plain
    expressions (no '=') are returned unchanged.
    """
    if "=" in text:
        lhs, _, rhs = text.partition("=")
        return f"({lhs}) - ({rhs})"
    return text


def _milestone_hit(line: str, milestone: str) -> bool:
    """True when a student line matches a milestone, expression or equation.

    A direct expression match is tried first. When either side is an equation,
    both are normalized to zero-form and compared symbolically, so 'x = 4'
    matches a milestone authored as 'x = 4' regardless of spacing or notation.
    """
    if symbolic_equal(line, milestone):
        return True
    if "=" in line or "=" in milestone:
        return symbolic_equal(_to_zero_form(line), _to_zero_form(milestone))
    return False


def grade_step_credit(milestones: list[str], student_work: str) -> tuple[list[dict], float]:
    """Award partial credit for a show-your-work response.

    Each milestone is an expected expression or equation. A milestone is awarded
    when any non-empty line of the student work matches it (see _milestone_hit).
    Returns the per-milestone results and the fraction awarded.
    """
    lines = [ln.strip() for ln in (student_work or "").splitlines() if ln.strip()]
    results: list[dict] = []
    awarded = 0
    for milestone in milestones:
        hit = any(_milestone_hit(line, milestone) for line in lines)
        results.append({"milestone": milestone, "awarded": hit})
        if hit:
            awarded += 1
    fraction = awarded / len(milestones) if milestones else 0.0
    return results, fraction


def grade(
    kind: str,
    correct: str,
    student_answer: str,
    *,
    options: list[str] | None = None,
    tolerance: float | None = None,
    explanation: str = "",
    milestones: list[str] | None = None,
) -> GradeOutcome:
    """Grade a single response. correct is the stored answer key for the kind."""
    student = (student_answer or "").strip()

    if kind == "mcq_single":
        chosen_index: int | None = None
        if student.isdigit():
            chosen_index = int(student)
        elif options is not None and student in options:
            chosen_index = options.index(student)
        is_correct = str(chosen_index) == str(correct).strip()
        correct_display = ""
        if options is not None:
            try:
                correct_display = options[int(correct)]
            except (ValueError, IndexError):
                correct_display = str(correct)
        return GradeOutcome(
            is_correct, 1.0 if is_correct else 0.0, "exact", 1.0,
            f"selected index {chosen_index}, key {correct}", correct_display, explanation,
        )

    if kind == "mcq_multi":
        chosen = _parse_index_set(student)
        key = _parse_index_set(str(correct))
        is_correct = chosen == key and len(key) > 0
        return GradeOutcome(
            is_correct, 1.0 if is_correct else 0.0, "exact", 1.0,
            f"selected {sorted(chosen)}, key {sorted(key)}", str(sorted(key)), explanation,
        )

    if kind == "true_false":
        norm = {
            "true": "true", "t": "true", "1": "true",
            "false": "false", "f": "false", "0": "false",
        }
        s = norm.get(student.lower(), student.lower())
        k = norm.get(str(correct).strip().lower(), str(correct).strip().lower())
        is_correct = s == k
        return GradeOutcome(
            is_correct, 1.0 if is_correct else 0.0, "exact", 1.0,
            f"answered {s}, key {k}", k, explanation,
        )

    if kind == "short_text":
        accepted = [a.strip().lower() for a in str(correct).split("|") if a.strip()]
        is_correct = student.lower() in accepted
        return GradeOutcome(
            is_correct, 1.0 if is_correct else 0.0, "exact", 1.0,
            f"text match against {len(accepted)} accepted forms", str(correct), explanation,
        )

    if kind == "plot_points":
        chosen_pts = _parse_points(student)
        key_pts = _parse_points(str(correct))
        is_correct = chosen_pts == key_pts and len(key_pts) > 0
        return GradeOutcome(
            is_correct, 1.0 if is_correct else 0.0, "exact", 1.0,
            f"plotted {len(chosen_pts)} of {len(key_pts)} points", str(correct), explanation,
        )

    if kind == "ordering":
        # The student submits the items as a JSON list in their chosen order.
        # Correct only when the order matches the key exactly.
        try:
            chosen = json.loads(student) if student else []
            key = json.loads(str(correct))
        except (ValueError, TypeError):
            chosen, key = None, None
        is_correct = (
            isinstance(chosen, list)
            and isinstance(key, list)
            and [str(x) for x in chosen] == [str(x) for x in key]
        )
        return GradeOutcome(
            is_correct, 1.0 if is_correct else 0.0, "exact", 1.0,
            "ordered sequence match", str(correct), explanation,
        )

    if kind == "matching":
        # Student and key are JSON lists of [left, right] pairs. Order of the
        # pairs does not matter; each pairing must match.
        def _pairs(raw: str) -> set[tuple[str, str]] | None:
            try:
                parsed = json.loads(raw)
            except (ValueError, TypeError):
                return None
            if not isinstance(parsed, list):
                return None
            out: set[tuple[str, str]] = set()
            for pair in parsed:
                if isinstance(pair, (list, tuple)) and len(pair) == 2:
                    out.add((str(pair[0]), str(pair[1])))
                else:
                    return None
            return out

        chosen_pairs = _pairs(student)
        key_pairs = _pairs(str(correct))
        is_correct = (
            chosen_pairs is not None
            and key_pairs is not None
            and chosen_pairs == key_pairs
            and len(key_pairs) > 0
        )
        return GradeOutcome(
            is_correct, 1.0 if is_correct else 0.0, "exact", 1.0,
            "matching pairs", str(correct), explanation,
        )

    if kind == "plot_function":
        # "Plot a function": the student defines a function (typed and shown on
        # an interactive plane); the captured answer is that function. Graded by
        # CAS symbolic equivalence against the reference function, so any
        # equivalent form of the same graph is correct.
        res = grade_expression(student, str(correct))
        return GradeOutcome(
            res.is_correct, res.score, "cas", res.confidence, res.detail,
            str(correct), explanation,
        )

    if kind == "draw_line":
        # "Draw a line": the student drags two points on the plane; the answer is
        # the ordered pair of points. Build the line through them and grade it as
        # an equation against the reference line (equal up to a nonzero scalar).
        pts = _parse_point_list(student)
        if len(pts) < 2:
            return GradeOutcome(
                False, 0.0, "cas", 1.0,
                "need two points to define a line", str(correct), explanation,
            )
        student_eq = _line_equation_from_points(pts[0], pts[1])
        if student_eq is None:
            return GradeOutcome(
                False, 0.0, "cas", 1.0,
                "the two points coincide", str(correct), explanation,
            )
        res = grade_equation(student_eq, str(correct))
        return GradeOutcome(
            res.is_correct, res.score, "cas", res.confidence,
            f"line {student_eq}: {res.detail}", str(correct), explanation,
        )

    if kind == "show_work":
        results, fraction = grade_step_credit(milestones or [], student)
        return GradeOutcome(
            fraction >= 1.0, round(fraction, 4), "cas", 0.9,
            f"{sum(r['awarded'] for r in results)}/{len(results)} milestones",
            str(correct), explanation, results,
        )

    if kind == "numeric":
        atol = tolerance if tolerance is not None else 1e-9
        res = grade_numeric(student, str(correct), atol=atol)
        return GradeOutcome(
            res.is_correct, res.score, "numeric", res.confidence, res.detail,
            str(correct), explanation,
        )

    if kind == "math_expression":
        res = grade_expression(student, str(correct))
        return GradeOutcome(
            res.is_correct, res.score, "cas", res.confidence, res.detail,
            str(correct), explanation,
        )

    if kind == "equation":
        res = grade_equation(student, str(correct))
        return GradeOutcome(
            res.is_correct, res.score, "cas", res.confidence, res.detail,
            str(correct), explanation,
        )

    return GradeOutcome(
        False, 0.0, "exact", 0.0, f"unsupported item kind: {kind}", str(correct), explanation,
    )
