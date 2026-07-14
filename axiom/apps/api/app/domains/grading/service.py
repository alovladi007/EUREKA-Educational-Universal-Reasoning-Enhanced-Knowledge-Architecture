"""Grading service.

Pure grading functions (no database) so they are trivial to unit test. The
practice and assessment flows call grade() and then persist the GradingRecord,
Score, and ReasoningTrace. Math grading delegates to math_core, which uses
SymPy symbolic equivalence rather than string matching, so several equivalent
correct forms all grade correct.

Supported kinds: mcq_single, numeric, math_expression, equation, mcq_multi,
true_false, short_text, plot_points, plot_function, draw_line, ordering,
matching, show_work (with milestone step credit). Structured proof kinds
(Curriculum & Proof Extension, Section 4.2): proof_assembly,
justification_matching, proof_gap_fill, find_the_error, counterexample,
state_definition, state_theorem -- all deterministic and auto-gradable.

grader values: exact (selection), numeric (tolerance), cas (symbolic),
structured (scaffolded proof).
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field

from math_core import (
    check_counterexample,
    grade_equation,
    grade_expression,
    grade_antiderivative,
    grade_determinant,
    grade_eigenvalues,
    grade_eigenvector,
    grade_fourier_coefficient,
    grade_fourier_transform,
    grade_inequality,
    grade_steps,
    grade_laplace,
    grade_numeric,
    grade_ode,
    grade_pde,
    grade_rref,
    grade_solution_point,
    grade_solution_set,
    symbolic_equal,
)


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


def _norm_text(text: str) -> str:
    """Lowercase, strip non-alphanumerics, and collapse whitespace for matching."""
    return " ".join(re.sub(r"[^a-z0-9 ]+", " ", (text or "").lower()).split())


def _blank_hit(student: str, accepted: str) -> bool:
    """True when a filled blank/cell matches an accepted form.

    CAS symbolic equivalence is tried first (so any algebraically equal form of a
    math blank counts), falling back to normalized text equality for word
    answers. Used by cloze and table-completion grading.
    """
    student = (student or "").strip()
    if not student:
        return False
    try:
        if symbolic_equal(student, accepted):
            return True
    except Exception:  # noqa: BLE001 - CAS parse failure means "not a math match"
        pass
    return _norm_text(student) == _norm_text(accepted)


def _parse_mixed_number(text: str) -> float | None:
    """Parse 'a b/c', 'b/c', or a plain decimal/integer into a float."""
    text = (text or "").strip()
    m = re.fullmatch(r"(-?\d+)\s+(\d+)/(\d+)", text)
    if m:
        whole, num, den = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if den == 0:
            return None
        sign = -1 if text.lstrip().startswith("-") else 1
        return whole + sign * (num / den)
    m = re.fullmatch(r"(-?\d+)/(\d+)", text)
    if m:
        den = int(m.group(2))
        return None if den == 0 else int(m.group(1)) / den
    try:
        return float(text)
    except ValueError:
        return None


# A small curated unit table for units-aware numeric grading. Each unit maps to
# its physical dimension and its factor to that dimension's SI-ish base
# (length->m, mass->kg, time->s, volume->L). Two answers grade equal only when
# they share a dimension and match after converting to the base.
_UNIT_TO_BASE: dict[str, tuple[str, float]] = {
    "mm": ("length", 1e-3), "cm": ("length", 1e-2), "m": ("length", 1.0),
    "km": ("length", 1e3), "in": ("length", 0.0254), "ft": ("length", 0.3048),
    "yd": ("length", 0.9144), "mi": ("length", 1609.344),
    "mg": ("mass", 1e-6), "g": ("mass", 1e-3), "kg": ("mass", 1.0),
    "lb": ("mass", 0.45359237), "oz": ("mass", 0.028349523),
    "ms": ("time", 1e-3), "s": ("time", 1.0), "sec": ("time", 1.0),
    "min": ("time", 60.0), "h": ("time", 3600.0), "hr": ("time", 3600.0),
    "ml": ("volume", 1e-3), "l": ("volume", 1.0),
}


def _parse_units(text: str) -> tuple[str, float] | None:
    """Parse 'value unit' into (dimension, value_in_base_units), or None."""
    m = re.fullmatch(r"\s*(-?\d+(?:\.\d+)?)\s*([a-zA-Z]+)\s*", text or "")
    if not m:
        return None
    unit = m.group(2).lower()
    if unit not in _UNIT_TO_BASE:
        return None
    dim, factor = _UNIT_TO_BASE[unit]
    return dim, float(m.group(1)) * factor


def _proof_hit(student_line: str, accepted: list[str]) -> bool:
    """True when a student's line matches any accepted form.

    Tries symbolic (CAS) equivalence first so any algebraically equal form of an
    expected line counts, then a normalized text match so prose lines and named
    justifications match regardless of spacing or capitalization.
    """
    student_line = (student_line or "").strip()
    for form in accepted:
        form = str(form).strip()
        if _milestone_hit(student_line, form):
            return True
        if _norm_text(student_line) == _norm_text(form):
            return True
    return False


def _load_json(raw: str):
    try:
        return json.loads(raw)
    except (ValueError, TypeError):
        return None


def grade(
    kind: str,
    correct: str,
    student_answer: str,
    *,
    options: list[str] | None = None,
    tolerance: float | None = None,
    explanation: str = "",
    milestones: list[str] | None = None,
    meta: dict | None = None,
) -> GradeOutcome:
    """Grade a single response. correct is the stored answer key for the kind.

    meta carries kind-specific configuration for the structured proof kinds
    (gap accepted-forms, a counterexample predicate, definition keywords, etc.).
    """
    student = (student_answer or "").strip()
    meta = meta or {}

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
        # Optional significant-figures grading: meta.sig_figs rounds both values
        # to that many significant figures before comparing (the DeltaMath /
        # myOpenMath sig-fig policy). Absent, plain absolute tolerance is used.
        sig_figs = meta.get("sig_figs")
        sig_figs = int(sig_figs) if isinstance(sig_figs, (int, float, str)) and str(
            sig_figs
        ).lstrip("-").isdigit() else None
        res = grade_numeric(student, str(correct), atol=atol, sig_figs=sig_figs)
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

    # --- Structured / scaffolded proof kinds (Extension Section 4.2) ---

    if kind == "proof_assembly":
        # The student reorders shuffled proof steps. correct is the JSON list of
        # steps in the right order; the student submits their chosen order.
        # Full credit for an exact order; partial credit is the fraction of
        # steps in their correct absolute position, deterministically.
        chosen = _load_json(student) or []
        key = _load_json(str(correct))
        if not (isinstance(chosen, list) and isinstance(key, list) and key):
            return GradeOutcome(
                False, 0.0, "structured", 1.0, "invalid proof ordering",
                str(correct), explanation,
            )
        chosen_s = [str(x) for x in chosen]
        key_s = [str(x) for x in key]
        credits = [
            {"milestone": step, "awarded": i < len(chosen_s) and chosen_s[i] == step}
            for i, step in enumerate(key_s)
        ]
        awarded = sum(1 for c in credits if c["awarded"])
        fraction = awarded / len(key_s)
        return GradeOutcome(
            chosen_s == key_s, round(fraction, 4), "structured", 1.0,
            f"{awarded}/{len(key_s)} steps correctly placed", str(correct),
            explanation, credits,
        )

    if kind == "justification_matching":
        # Each proof step is paired with the rule/prior result that justifies it.
        # correct and student are JSON lists of [step, justification]; order does
        # not matter and each correct pairing earns partial credit.
        def _just_map(raw: str) -> dict[str, str] | None:
            parsed = _load_json(raw)
            if not isinstance(parsed, list):
                return None
            out: dict[str, str] = {}
            for pair in parsed:
                if isinstance(pair, (list, tuple)) and len(pair) == 2:
                    out[str(pair[0])] = str(pair[1])
                else:
                    return None
            return out

        chosen_map = _just_map(student)
        key_map = _just_map(str(correct))
        if not key_map:
            return GradeOutcome(
                False, 0.0, "structured", 1.0, "invalid justification set",
                str(correct), explanation,
            )
        chosen_map = chosen_map or {}
        credits = [
            {"milestone": step, "awarded": chosen_map.get(step) == just}
            for step, just in key_map.items()
        ]
        awarded = sum(1 for c in credits if c["awarded"])
        fraction = awarded / len(key_map)
        return GradeOutcome(
            awarded == len(key_map), round(fraction, 4), "structured", 1.0,
            f"{awarded}/{len(key_map)} steps correctly justified", str(correct),
            explanation, credits,
        )

    if kind == "proof_gap_fill":
        # A proof with holes; the student fills each. gaps is a list, one entry
        # per hole, each a list of accepted forms. The student submits a JSON
        # list of fills (one per gap). A gap is satisfied when its fill matches
        # any accepted form by CAS or normalized text.
        gaps = meta.get("gaps")
        if not isinstance(gaps, list) or not gaps:
            # Fall back to a single gap keyed on `correct` (pipe-separated forms).
            gaps = [[a for a in str(correct).split("|") if a.strip()]]
        fills = _load_json(student)
        if not isinstance(fills, list):
            fills = [student]
        credits = []
        for i, accepted in enumerate(gaps):
            forms = accepted if isinstance(accepted, list) else [accepted]
            fill = str(fills[i]) if i < len(fills) else ""
            hit = _proof_hit(fill, [str(f) for f in forms])
            credits.append({"milestone": f"gap {i + 1}", "awarded": hit})
        awarded = sum(1 for c in credits if c["awarded"])
        fraction = awarded / len(gaps)
        return GradeOutcome(
            awarded == len(gaps), round(fraction, 4), "structured", 1.0,
            f"{awarded}/{len(gaps)} gaps filled correctly", str(correct),
            explanation, credits,
        )

    if kind == "find_the_error":
        # The student identifies the index of the invalid step in a flawed proof.
        # correct is that index. A free-text justification, if supplied alongside
        # the index (JSON {"index", "explanation"}), is not auto-scored here; the
        # deterministic grade is on the index. The explanation can be routed to
        # the AI-assisted grader (4.3) for feedback.
        chosen_index: int | None = None
        parsed = _load_json(student)
        if isinstance(parsed, dict) and "index" in parsed:
            try:
                chosen_index = int(parsed["index"])
            except (ValueError, TypeError):
                chosen_index = None
        elif student.lstrip("-").isdigit():
            chosen_index = int(student)
        try:
            key_index = int(str(correct).strip())
        except (ValueError, TypeError):
            key_index = None
        is_correct = chosen_index is not None and chosen_index == key_index
        return GradeOutcome(
            is_correct, 1.0 if is_correct else 0.0, "structured", 1.0,
            f"identified step {chosen_index}, invalid step is {key_index}",
            str(correct), explanation,
        )

    if kind == "counterexample":
        # The student supplies an object that breaks a false universal claim.
        # meta.predicate (with meta.var, default n) is the property a valid
        # counterexample must satisfy; it is checked deterministically by
        # substitution. Failing that, meta.accepted lists acceptable objects,
        # matched by CAS/text. Failing that, compare against `correct` by CAS.
        predicate = meta.get("predicate")
        var = str(meta.get("var", "n"))
        if predicate:
            valid = check_counterexample(student, str(predicate), var)
            detail = f"tested {student or '(empty)'} against predicate over {var}"
        elif isinstance(meta.get("accepted"), list) and meta["accepted"]:
            valid = _proof_hit(student, [str(a) for a in meta["accepted"]])
            detail = f"matched against {len(meta['accepted'])} accepted counterexamples"
        else:
            valid = bool(student) and symbolic_equal(student, str(correct))
            detail = "compared against the reference counterexample"
        return GradeOutcome(
            valid, 1.0 if valid else 0.0, "structured", 1.0, detail,
            str(correct), explanation,
        )

    if kind in ("state_definition", "state_theorem"):
        # The student states a definition or theorem. It is graded against
        # accepted phrasings (pipe-separated in `correct`) by normalized text;
        # an exact normalized match is full credit. Otherwise, if meta.keywords
        # are given, partial credit is the fraction of required ideas present,
        # and the item is flagged (lower confidence) for a human/AI near-miss
        # pass (Section 5: an AI similarity pass confirms near-misses).
        accepted = [a for a in str(correct).split("|") if a.strip()]
        normalized = _norm_text(student)
        exact = any(normalized == _norm_text(a) for a in accepted)
        if exact:
            return GradeOutcome(
                True, 1.0, "structured", 1.0, "matched an accepted phrasing",
                str(correct), explanation,
            )
        keywords = [k for k in (meta.get("keywords") or []) if str(k).strip()]
        if keywords:
            matched = [k for k in keywords if _norm_text(str(k)) in normalized]
            fraction = len(matched) / len(keywords)
            credits = [
                {"milestone": str(k), "awarded": _norm_text(str(k)) in normalized}
                for k in keywords
            ]
            # Deterministic pass at high coverage; below that, needs review.
            is_correct = fraction >= 0.8
            return GradeOutcome(
                is_correct, round(fraction, 4), "structured",
                0.6 if not is_correct else 0.9,
                f"covers {len(matched)}/{len(keywords)} required ideas; "
                "near-misses need review",
                str(correct), explanation, credits,
            )
        return GradeOutcome(
            False, 0.0, "structured", 0.5,
            "no accepted phrasing matched; needs review", str(correct), explanation,
        )

    if kind == "inequality":
        res = grade_inequality(student, str(correct))
        return GradeOutcome(
            res.is_correct, res.score, "cas", res.confidence, res.detail,
            str(correct), explanation,
        )

    if kind == "number_line":
        # A value placed on a number line: accept a bare number or a JSON number.
        atol = tolerance if tolerance is not None else 1e-9
        value = student
        try:
            parsed = json.loads(student)
            if isinstance(parsed, (int, float)):
                value = str(parsed)
        except (ValueError, TypeError):
            pass
        res = grade_numeric(value, str(correct), atol=atol)
        return GradeOutcome(
            res.is_correct, res.score, "numeric", res.confidence, res.detail,
            str(correct), explanation,
        )

    if kind == "mixed_number":
        sv = _parse_mixed_number(student)
        ev = _parse_mixed_number(str(correct))
        atol = tolerance if tolerance is not None else 1e-9
        ok = sv is not None and ev is not None and abs(sv - ev) <= atol + 1e-9 * abs(ev)
        detail = (
            f"{sv} vs {ev}" if sv is not None and ev is not None
            else "could not parse a mixed number"
        )
        return GradeOutcome(
            ok, 1.0 if ok else 0.0, "numeric", 1.0, detail, str(correct), explanation,
        )

    if kind == "units_numeric":
        s = _parse_units(student)
        e = _parse_units(str(correct))
        atol = tolerance if tolerance is not None else 0.0
        if s is None or e is None:
            return GradeOutcome(
                False, 0.0, "numeric", 1.0,
                "could not parse a value with a known unit", str(correct), explanation,
            )
        if s[0] != e[0]:
            return GradeOutcome(
                False, 0.0, "numeric", 1.0,
                f"unit dimension mismatch ({s[0]} vs {e[0]})", str(correct), explanation,
            )
        ok = abs(s[1] - e[1]) <= atol + 1e-6 * abs(e[1])
        return GradeOutcome(
            ok, 1.0 if ok else 0.0, "numeric", 1.0,
            f"compared in base units: {s[1]} vs {e[1]}", str(correct), explanation,
        )

    if kind == "cloze_math":
        # correct is a JSON list; each element is the accepted answer(s) for one
        # blank (multiple accepted forms separated by "|"). student is a JSON
        # list of the learner's blanks, in order.
        try:
            key_blanks = json.loads(str(correct))
            stu_blanks = json.loads(student) if student else []
        except (ValueError, TypeError):
            key_blanks = stu_blanks = None
        if not isinstance(key_blanks, list) or not isinstance(stu_blanks, list):
            return GradeOutcome(
                False, 0.0, "cas", 1.0, "malformed cloze answer", str(correct), explanation,
            )
        per: list[dict] = []
        hit = 0
        for i, key in enumerate(key_blanks):
            stu = stu_blanks[i] if i < len(stu_blanks) else ""
            accepted = [a.strip() for a in str(key).split("|") if a.strip()]
            ok = any(_blank_hit(str(stu), a) for a in accepted)
            per.append({"milestone": f"blank {i + 1}", "awarded": ok})
            if ok:
                hit += 1
        frac = hit / len(key_blanks) if key_blanks else 0.0
        return GradeOutcome(
            frac >= 1.0 and len(key_blanks) > 0, round(frac, 4), "cas", 0.95,
            f"{hit}/{len(key_blanks)} blanks", str(correct), explanation, per,
        )

    if kind == "categorize_sort":
        # correct/student are JSON objects mapping each item to its category.
        try:
            key_map = json.loads(str(correct))
            stu_map = json.loads(student) if student else {}
        except (ValueError, TypeError):
            key_map = stu_map = None
        if not isinstance(key_map, dict) or not isinstance(stu_map, dict):
            return GradeOutcome(
                False, 0.0, "exact", 1.0, "malformed categorize answer",
                str(correct), explanation,
            )
        hit = sum(
            1 for item, cat in key_map.items()
            if str(stu_map.get(item, "")).strip() == str(cat).strip()
        )
        frac = hit / len(key_map) if key_map else 0.0
        return GradeOutcome(
            frac >= 1.0 and len(key_map) > 0, round(frac, 4), "exact", 1.0,
            f"{hit}/{len(key_map)} placed correctly", str(correct), explanation,
        )

    if kind == "drag_tokens":
        # student is a JSON list of tokens in the chosen order. Join them and
        # grade the assembled expression (or equation) by CAS equivalence, so any
        # ordering that is algebraically equal to the key is accepted.
        try:
            toks = json.loads(student) if student else []
        except (ValueError, TypeError):
            toks = None
        if not isinstance(toks, list):
            return GradeOutcome(
                False, 0.0, "cas", 1.0, "malformed token order", str(correct), explanation,
            )
        assembled = " ".join(str(t) for t in toks)
        res = (
            grade_equation(assembled, str(correct)) if "=" in str(correct)
            else grade_expression(assembled, str(correct))
        )
        return GradeOutcome(
            res.is_correct, res.score, "cas", res.confidence,
            f"assembled '{assembled}': {res.detail}", str(correct), explanation,
        )

    if kind == "table_completion":
        # correct/student are JSON 2D arrays of cell strings. Each cell is graded
        # by CAS-or-text; the score is the fraction of cells filled correctly.
        try:
            key_grid = json.loads(str(correct))
            stu_grid = json.loads(student) if student else []
        except (ValueError, TypeError):
            key_grid = stu_grid = None
        if not isinstance(key_grid, list):
            return GradeOutcome(
                False, 0.0, "cas", 1.0, "malformed table answer", str(correct), explanation,
            )
        total = 0
        hit = 0
        for r, row in enumerate(key_grid):
            if not isinstance(row, list):
                continue
            for c, cell in enumerate(row):
                total += 1
                try:
                    stu_cell = stu_grid[r][c]
                except (IndexError, TypeError, KeyError):
                    stu_cell = ""
                if _blank_hit(str(stu_cell), str(cell)):
                    hit += 1
        frac = hit / total if total else 0.0
        return GradeOutcome(
            frac >= 1.0 and total > 0, round(frac, 4), "cas", 0.95,
            f"{hit}/{total} cells", str(correct), explanation,
        )

    if kind == "hotspot":
        # meta.regions is a list of [x, y, w, h] target rectangles; the student's
        # answer is the clicked point [x, y]. Correct when the click lands in any
        # target region.
        regions = (meta or {}).get("regions") or []
        try:
            pt = json.loads(student)
            px, py = float(pt[0]), float(pt[1])
        except (ValueError, TypeError, IndexError):
            return GradeOutcome(
                False, 0.0, "exact", 1.0, "could not read a click point",
                str(correct), explanation,
            )
        inside = any(
            isinstance(r, (list, tuple)) and len(r) == 4
            and r[0] <= px <= r[0] + r[2] and r[1] <= py <= r[1] + r[3]
            for r in regions
        )
        return GradeOutcome(
            inside, 1.0 if inside else 0.0, "exact", 1.0,
            f"click ({px}, {py}) in {'a' if inside else 'no'} target region",
            str(correct), explanation,
        )

    if kind == "image_labeling":
        # Same pairing semantics as matching: a JSON list of [label, region-id].
        def _label_pairs(raw: str) -> set[tuple[str, str]] | None:
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

        chosen_pairs = _label_pairs(student)
        key_pairs = _label_pairs(str(correct))
        ok = (
            chosen_pairs is not None
            and key_pairs is not None
            and chosen_pairs == key_pairs
            and len(key_pairs) > 0
        )
        return GradeOutcome(
            ok, 1.0 if ok else 0.0, "exact", 1.0, "label placements",
            str(correct), explanation,
        )

    if kind in ("construct_shape", "transform_figure"):
        # Both reduce to a point-set match (order-independent): the vertices the
        # student constructed, or the image of a figure under a transformation,
        # versus the expected set of points.
        chosen_pts = _parse_points(student)
        key_pts = _parse_points(str(correct))
        ok = chosen_pts == key_pts and len(key_pts) > 0
        label = "shape vertices" if kind == "construct_shape" else "transformed points"
        return GradeOutcome(
            ok, 1.0 if ok else 0.0, "exact", 1.0,
            f"{label}: {len(chosen_pts & key_pts)} of {len(key_pts)} match",
            str(correct), explanation,
        )

    if kind == "ode_solution":
        # Engineering Math track (ODE units). meta.residual is the ODE written so
        # it equals zero (y, yp, ypp, x); the student submits a proposed y(x).
        # Grading verifies the solution satisfies the equation, so any equivalent
        # form and any name for the arbitrary constant is accepted.
        cfg = meta or {}
        r = grade_ode(
            student, cfg.get("residual", ""), order=cfg.get("order"),
            initial_conditions=cfg.get("initial_conditions"),
        )
        return GradeOutcome(
            r.is_correct, 1.0 if r.is_correct else 0.0, r.grader, r.confidence, r.detail,
            str(correct), explanation,
        )

    if kind == "pde_solution":
        # PDE/Fourier Units 4-6. meta.residual is the PDE written so it equals
        # zero (u, ut, utt, ux, uxx, uy, uyy); the student submits u. Grading
        # verifies the solution satisfies the equation, so any equivalent form
        # (separated product, traveling wave, ...) is accepted.
        cfg = meta or {}
        r = grade_pde(student, cfg.get("residual", ""))
        return GradeOutcome(
            r.is_correct, 1.0 if r.is_correct else 0.0, r.grader, r.confidence, r.detail,
            str(correct), explanation,
        )

    if kind in ("laplace_transform", "inverse_laplace"):
        # Engineering Math track (ODE Unit 4). meta.source is the given function:
        # f(t) for laplace_transform (submit F(s)) or F(s) for inverse_laplace
        # (submit f(t)). Grading compares to the SymPy-computed transform, so any
        # equivalent closed form is accepted.
        cfg = meta or {}
        direction = "inverse" if kind == "inverse_laplace" else "forward"
        r = grade_laplace(student, cfg.get("source", ""), direction=direction)
        return GradeOutcome(
            r.is_correct, 1.0 if r.is_correct else 0.0, r.grader, r.confidence, r.detail,
            str(correct), explanation,
        )

    if kind in ("matrix_rref", "solution_set", "linear_system"):
        # Engineering Math track (Linear Algebra Unit 1). The problem data lives
        # in meta; the student submits a JSON answer. Graders are SymPy-backed
        # (RREF is unique; solution-set is affine equality; point is symbolic
        # equivalence), so any valid form or reduction path is accepted.
        cfg = meta or {}
        try:
            resp = json.loads(student) if student else None
        except (ValueError, TypeError):
            resp = None
        if kind == "matrix_rref":
            if not isinstance(resp, list):
                return GradeOutcome(
                    False, 0.0, "exact", 1.0, "expected a matrix (JSON list of rows)",
                    str(correct), explanation,
                )
            r = grade_rref(resp, cfg.get("problem_matrix") or [])
        elif kind == "linear_system":
            if not isinstance(resp, dict):
                return GradeOutcome(
                    False, 0.0, "cas", 1.0, "expected a variable-to-value map",
                    str(correct), explanation,
                )
            r = grade_solution_point(resp, cfg.get("key") or {})
        else:  # solution_set
            if not isinstance(resp, dict):
                return GradeOutcome(
                    False, 0.0, "set_equal", 1.0,
                    "expected {particular, directions}", str(correct), explanation,
                )
            r = grade_solution_set(
                cfg.get("A") or [], cfg.get("b") or [],
                resp.get("particular") or [], resp.get("directions") or [],
            )
        return GradeOutcome(
            r.is_correct, 1.0 if r.is_correct else 0.0, r.grader, r.confidence, r.detail,
            str(correct), explanation,
        )

    if kind in ("eigenvalues", "eigenvector"):
        # Engineering Math track (LA Unit 7 / ODE systems). meta.matrix is the
        # square matrix; the student submits a JSON list. Eigenvalues match as a
        # multiset; eigenvectors are checked by (A - lambda I) v = 0, so any
        # nonzero scaling is accepted. A comma-separated string is also accepted.
        cfg = meta or {}
        try:
            resp = json.loads(student) if student else None
        except (ValueError, TypeError):
            resp = None
        if not isinstance(resp, list):
            resp = [p.strip() for p in student.split(",") if p.strip()] if student else None
        if not isinstance(resp, list):
            return GradeOutcome(
                False, 0.0, "cas", 1.0, "expected a list (JSON or comma-separated)",
                str(correct), explanation,
            )
        if kind == "eigenvalues":
            r = grade_eigenvalues(resp, cfg.get("matrix") or [])
        else:
            r = grade_eigenvector(resp, cfg.get("matrix") or [], cfg.get("eigenvalue"))
        return GradeOutcome(
            r.is_correct, 1.0 if r.is_correct else 0.0, r.grader, r.confidence, r.detail,
            str(correct), explanation,
        )

    if kind == "fourier_coefficient":
        # PDE/Fourier Unit 1. meta carries the function, half-period L, which
        # coefficient (a0/a/b), and harmonic n; the student submits the value.
        # Grading integrates the reference exactly, so any equivalent closed form
        # is accepted.
        cfg = meta or {}
        # n may be a fixed integer or the identifier "n" (grade the general
        # formula); pass it through unchanged.
        r = grade_fourier_coefficient(
            student, cfg.get("function", ""), str(cfg.get("half_period", "pi")),
            cfg.get("coeff", "a"), cfg.get("n", 1),
        )
        return GradeOutcome(
            r.is_correct, 1.0 if r.is_correct else 0.0, r.grader, r.confidence, r.detail,
            str(correct), explanation,
        )

    if kind in ("fourier_transform", "inverse_fourier"):
        # PDE/Fourier Unit 2. meta.source is the given function: f(x) for
        # fourier_transform (submit F(k)) or F(k) for inverse_fourier (submit
        # f(x)). Graded against the SymPy-computed transform, so any equivalent
        # closed form is accepted.
        cfg = meta or {}
        direction = "inverse" if kind == "inverse_fourier" else "forward"
        r = grade_fourier_transform(student, cfg.get("source", ""), direction=direction)
        return GradeOutcome(
            r.is_correct, 1.0 if r.is_correct else 0.0, r.grader, r.confidence, r.detail,
            str(correct), explanation,
        )

    if kind == "antiderivative":
        # Calculus foundation. meta.integrand is f(x); the student submits F(x),
        # graded by checking F'(x) = f(x), so any constant of integration and any
        # equivalent form is accepted.
        cfg = meta or {}
        r = grade_antiderivative(student, cfg.get("integrand", ""), cfg.get("var", "x"))
        return GradeOutcome(
            r.is_correct, 1.0 if r.is_correct else 0.0, r.grader, r.confidence, r.detail,
            str(correct), explanation,
        )

    if kind == "derivation":
        # Show-your-work: the student submits their derivation as newline-separated
        # equation lines; meta.variables lists the unknowns and meta.final_key the
        # answer. Graded line by line by solution-set preservation, so any legal
        # move is accepted and the first line that changes the solution set is
        # reported (partial credit for the valid prefix).
        cfg = meta or {}
        lines = [ln.strip() for ln in student.splitlines() if ln.strip()]
        r = grade_steps(
            lines, cfg.get("variables") or [], final_key=cfg.get("final_key"),
            milestones=cfg.get("milestones"),
        )
        return GradeOutcome(
            r.is_correct, r.score, r.grader, r.confidence, r.detail,
            str(correct), explanation,
        )

    if kind == "determinant":
        # LA Unit 6. meta.matrix is the square matrix; the student submits det(A)
        # as a scalar. Any equivalent form is accepted (symbolic check).
        cfg = meta or {}
        r = grade_determinant(student, cfg.get("matrix") or [])
        return GradeOutcome(
            r.is_correct, 1.0 if r.is_correct else 0.0, r.grader, r.confidence, r.detail,
            str(correct), explanation,
        )

    return GradeOutcome(
        False, 0.0, "exact", 0.0, f"unsupported item kind: {kind}", str(correct), explanation,
    )
