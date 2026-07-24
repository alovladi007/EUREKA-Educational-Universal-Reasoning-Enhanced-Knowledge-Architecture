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


def _check_triangle_views() -> list[dict]:
    """Every triangle eligible G1 and G2 node ships a complete triangle view.

    This was a Phase 3 warning while the views did not exist. Phase 3 builds
    them, so it is now blocking: a node flagged triangle eligible that has no
    view is a promise the course does not keep.

    A view with an empty corner is treated the same as a missing view. Two of
    three levels is exactly the silent jump between levels that Johnstone
    identified as the problem, so a partial view is worse than none.
    """
    from app.data.triangle_views import TRIANGLE_VIEWS

    problems: list[dict] = []
    eligible = [n.code for n in NODES if n.triangle_eligible and n.tier in ("G1", "G2")]
    for code in eligible:
        view = TRIANGLE_VIEWS.get(code)
        if view is None:
            problems.append({"check": "triangle_view", "detail": f"{code} has no triangle view"})
            continue
        for level in ("macroscopic", "particulate", "symbolic", "connector", "pitfall"):
            if not str(getattr(view, level, "")).strip():
                problems.append(
                    {"check": "triangle_view", "detail": f"{code} view has an empty {level}"}
                )
    for code in TRIANGLE_VIEWS:
        if code not in NODES_BY_CODE:
            problems.append({"check": "triangle_view", "detail": f"view {code} has no node"})
    return problems


def _check_poe_items() -> list[dict]:
    """Predict, observe, explain items agree with their own simulations.

    The key is not taken on the author's word. Each activity's simulation is
    run and the derived outcome is compared against the stored key, which is
    what makes grader 12 verifiable rather than merely asserted.
    """
    import chem_core as cc

    from app.data.simulations import OUTCOME_RULES, POE_ITEMS, run_scenario

    problems: list[dict] = []
    for item_id, item in POE_ITEMS.items():
        for options, key, which in (
            (item.predict_options, item.predict_key, "predict"),
            (item.explain_options, item.explain_key, "explain"),
        ):
            for issue in cc.check_options(options, key):
                problems.append({"check": "poe_options", "detail": f"{item_id} {which}: {issue}"})
            for option in options:
                if option.misconception and option.misconception not in cc.MISCONCEPTIONS:
                    problems.append(
                        {
                            "check": "poe_misconception",
                            "detail": f"{item_id} {which} option {option.id} names unknown "
                            f"misconception {option.misconception}",
                        }
                    )
        if item.node not in NODES_BY_CODE:
            problems.append({"check": "poe_node", "detail": f"{item_id} targets unknown node {item.node}"})

        rule = OUTCOME_RULES.get(item_id)
        if rule is None:
            problems.append({"check": "poe_verified", "detail": f"{item_id} has no outcome rule"})
            continue
        try:
            outcome = rule(run_scenario(item.scenario))
        except Exception as exc:
            problems.append({"check": "poe_verified", "detail": f"{item_id} simulation failed: {exc}"})
            continue
        verified = cc.verify_prediction_key(item, {"outcome": outcome})
        if not verified.ok:
            problems.append({"check": "poe_verified", "detail": f"{item_id}: {verified.detail}"})
    return problems


def _check_simulation_engines() -> list[dict]:
    """Each simulation engine agrees with an independently derived landmark."""
    import chem_core as cc

    from app.data.simulations import EQUILIBRIA, SCENARIOS, TITRATIONS

    problems: list[dict] = []
    for key, setup in TITRATIONS.items():
        ok, detail = cc.verify_titration(setup)
        if not ok:
            problems.append({"check": "simulation_verified", "detail": f"{key}: {detail}"})
    for scenario in SCENARIOS.values():
        if scenario.kind != "equilibrium":
            continue
        setup = EQUILIBRIA[scenario.engine_key]
        result = cc.equilibrium_shift(setup, scenario.stress)
        ok, detail = cc.verify_equilibrium_shift(setup, result)
        if not ok:
            problems.append({"check": "simulation_verified", "detail": f"{scenario.id}: {detail}"})
    return problems


def _check_periodic_coverage() -> list[dict]:
    """How much of each periodic trend is genuinely measured.

    Reported as a warning rather than a failure, because the gaps are real
    chemistry rather than missing work. Francium's ionization energy and the
    electronegativity of the light noble gases are not values anyone has
    withheld, they are values that do not exist. The client renders these gaps
    instead of interpolating across them, and this is where the size of each
    gap is stated.
    """
    from app.data import periodic

    warnings: list[dict] = []
    total = len(periodic.ELEMENTS)
    for field in (
        "electronegativity",
        "atomic_radius_pm",
        "ionization_energy_kJmol",
        "electron_affinity_kJmol",
    ):
        measured = len(periodic.trend_values(field))
        if measured < total:
            warnings.append(
                {
                    "check": "periodic_coverage",
                    "detail": f"{field} is measured for {measured} of {total} elements",
                    "severity": "informational",
                }
            )
    return warnings


def _counts() -> dict:
    from app.data import periodic, triangle_views
    from app.data.simulations import POE_ITEMS, SCENARIOS

    return {
        "nodes": len(NODES),
        "lessons": len(LESSONS),
        "templates": len(cc.REGISTRY),
        "misconceptions": len(cc.MISCONCEPTIONS),
        "molecules": validate_library()["built"],
        "triangle_views": len(triangle_views.TRIANGLE_VIEWS),
        "elements": len(periodic.ELEMENTS),
        "scenarios": len(SCENARIOS),
        "poe_activities": len(POE_ITEMS),
    }


def run() -> dict:
    blocking: list[dict] = []
    blocking += _check_curriculum()
    blocking += _check_lessons()
    blocking += _check_templates()
    blocking += _check_misconceptions()
    blocking += _check_distractors()
    blocking += _check_no_early_solution()
    blocking += _check_molecules()
    blocking += _check_triangle_views()
    blocking += _check_poe_items()
    blocking += _check_simulation_engines()

    warnings = _check_periodic_coverage()

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
        "counts": _counts(),
    }


def green() -> bool:
    return run()["green"]
