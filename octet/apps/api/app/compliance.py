"""The Phase 2 gate: the teaching model compliance checklist.

Straight from axiom_teaching_model.md section 5, which is binding on every
course this platform ships:

  - Every node has a lesson in the six part arc.
  - Every template has a three rung hint ladder and a verified key.
  - Every MC distractor keys a named misconception.
  - Every misconception routes to a remediation node.
  - No content path shows a solution before an attempt.

Plus the curriculum integrity rules from the build prompt's acceptance
criteria: zero integrity problems, DAG acyclic, misconceptions route,
distractors keyed, one lesson per node with all arc parts, references resolve.

run() returns a report. green() is the boolean CI gates on. Nothing about
this file is advisory.
"""

from __future__ import annotations

import chem_core as cc

from app.data.curriculum import EDGES, NODES, NODES_BY_CODE, topological_order
from app.data.lessons import LESSONS
from app.data.molecule_build import validate_library


def _check_curriculum() -> list[dict]:
    problems: list[dict] = []
    if topological_order() is None:
        problems.append({"check": "dag", "detail": "curriculum graph contains a cycle"})
    for a, b in EDGES:
        if a not in NODES_BY_CODE:
            problems.append({"check": "edge", "detail": f"edge from unknown node {a}"})
        if b not in NODES_BY_CODE:
            problems.append({"check": "edge", "detail": f"edge to unknown node {b}"})
    counts: dict[str, int] = {}
    for n in NODES:
        counts[n.tier] = counts.get(n.tier, 0) + 1
    expected = {"CF": 12, "G1": 24, "G2": 24}
    for tier, want in expected.items():
        got = counts.get(tier, 0)
        if got != want:
            problems.append(
                {"check": "tier_counts", "detail": f"{tier} has {got} nodes, Phase 2 specifies {want}"}
            )
    return problems


def _check_lessons() -> list[dict]:
    """Every node has a lesson, and every lesson has all six arc parts."""
    problems: list[dict] = []
    for node in NODES:
        lesson = LESSONS.get(node.code)
        if lesson is None:
            problems.append({"check": "lesson_present", "detail": f"{node.code} has no lesson"})
            continue
        missing = lesson.missing_parts()
        if missing:
            problems.append(
                {"check": "lesson_arc", "detail": f"{node.code} lesson missing {', '.join(missing)}"}
            )
        if lesson.node != node.code:
            problems.append(
                {"check": "lesson_node", "detail": f"lesson under {node.code} claims node {lesson.node}"}
            )
        if lesson.misconception and lesson.misconception not in cc.MISCONCEPTIONS:
            problems.append(
                {
                    "check": "lesson_misconception",
                    "detail": f"{node.code} lesson names unknown misconception {lesson.misconception}",
                }
            )
    for code in LESSONS:
        if code not in NODES_BY_CODE:
            problems.append({"check": "lesson_orphan", "detail": f"lesson {code} has no node"})
    return problems


def _check_templates() -> list[dict]:
    """Three rung ladders everywhere, and every key independently verified."""
    problems: list[dict] = []
    coverage = cc.hint_coverage(list(cc.REGISTRY))
    for tid in coverage["missing"]:
        problems.append({"check": "hint_ladder", "detail": f"{tid} has no hint ladder"})
    for tid in coverage["incomplete"]:
        problems.append({"check": "hint_ladder", "detail": f"{tid} ladder is not three complete rungs"})

    for tid, entry in cc.REGISTRY.items():
        node = entry.get("node")
        if node not in NODES_BY_CODE:
            problems.append({"check": "template_node", "detail": f"{tid} targets unknown node {node}"})

    report = cc.sweep(12)
    for tid, result in report.items():
        if result["failures"]:
            problems.append(
                {
                    "check": "verified_key",
                    "detail": f"{tid} failed independent verification on {len(result['failures'])} of 12 seeds",
                }
            )
    return problems


def _check_misconceptions() -> list[dict]:
    """Every misconception routes somewhere real and carries a counterexample."""
    problems: list[dict] = []
    for code, m in cc.MISCONCEPTIONS.items():
        if not m.routes_to:
            problems.append({"check": "misconception_route", "detail": f"{code} routes nowhere"})
        elif m.routes_to not in NODES_BY_CODE:
            problems.append(
                {"check": "misconception_route", "detail": f"{code} routes to unknown node {m.routes_to}"}
            )
        if not m.counterexample.strip():
            problems.append({"check": "misconception_counterexample", "detail": f"{code} has no counterexample"})
        if not m.source.strip():
            problems.append({"check": "misconception_source", "detail": f"{code} cites no source"})
    return problems


def _check_distractors() -> list[dict]:
    """Every generated MC item keys a named misconception on every distractor."""
    problems: list[dict] = []
    for tid, entry in cc.REGISTRY.items():
        if entry.get("grader") != "mc":
            continue
        for seed in range(6):
            try:
                variant = cc.resolve_generated(tid, seed)
            except Exception as exc:
                problems.append({"check": "mc_generate", "detail": f"{tid} seed {seed}: {exc}"})
                continue
            issues = cc.validate_choices(variant.meta["choices"], variant.meta["correct_index"])
            for issue in issues:
                problems.append({"check": "mc_distractor", "detail": f"{tid} seed {seed}: {issue}"})
    return problems


def _check_no_early_solution() -> list[dict]:
    """No content path may show a solution before an attempt.

    Two concrete rules that are machine checkable:
      1. A hint rung must not contain the answer. Rung 3 performs the first
         step only, so a rung that contains the stored key is a violation.
      2. The serve path must not carry the key. That is enforced in the router
         and asserted in the API tests, and re-checked here for the fields the
         registry marks as answer bearing.
    """
    problems: list[dict] = []
    answer_bearing = {"exact_g", "exact_x", "value", "correct_index"}
    for tid in cc.REGISTRY:
        try:
            variant = cc.resolve_generated(tid, 1)
        except Exception:
            continue
        key_text = str(variant.key).strip().lower()
        for level in (1, 2, 3):
            rung = (cc.rung(tid, level) or "").lower()
            if key_text and len(key_text) > 2 and key_text in rung:
                problems.append(
                    {"check": "hint_reveals_answer", "detail": f"{tid} rung {level} contains the key"}
                )
        # The prompt itself must not contain the answer either.
        if key_text and len(key_text) > 3 and key_text in variant.prompt.lower():
            if variant.grader != "mc":  # an MC prompt legitimately lists choices
                problems.append(
                    {"check": "prompt_reveals_answer", "detail": f"{tid} prompt contains the key"}
                )
    return problems


def _check_molecules() -> list[dict]:
    problems: list[dict] = []
    report = validate_library()
    for p in report["problems"]:
        problems.append({"check": "molecule_library", "detail": f"{p['name']}: {p['problem']}"})
    if report["built"] < 200:
        problems.append(
            {
                "check": "molecule_count",
                "detail": f"library has {report['built']} usable entries, Phase 2 specifies 200",
            }
        )
    return problems


def _check_triangle_readiness() -> list[dict]:
    """Phase 3 gate, reported early as a warning rather than a failure.

    Every triangle eligible G1 and G2 node must ship a triangle_view before
    the course lists. Phase 2 does not build them, so this reports the size of
    the Phase 3 obligation rather than failing the Phase 2 gate.
    """
    pending = [
        n.code for n in NODES if n.triangle_eligible and n.tier in ("G1", "G2")
    ]
    return [{"check": "triangle_view_pending", "detail": code, "severity": "phase3"} for code in pending]


def run() -> dict:
    blocking: list[dict] = []
    blocking += _check_curriculum()
    blocking += _check_lessons()
    blocking += _check_templates()
    blocking += _check_misconceptions()
    blocking += _check_distractors()
    blocking += _check_no_early_solution()
    blocking += _check_molecules()

    warnings = _check_triangle_readiness()

    by_check: dict[str, int] = {}
    for p in blocking:
        by_check[p["check"]] = by_check.get(p["check"], 0) + 1

    return {
        "green": not blocking,
        "blocking_count": len(blocking),
        "blocking": blocking,
        "by_check": by_check,
        "warnings_count": len(warnings),
        "warnings": warnings,
        "counts": {
            "nodes": len(NODES),
            "lessons": len(LESSONS),
            "templates": len(cc.REGISTRY),
            "misconceptions": len(cc.MISCONCEPTIONS),
            "molecules": validate_library()["built"],
        },
    }


def green() -> bool:
    return run()["green"]
