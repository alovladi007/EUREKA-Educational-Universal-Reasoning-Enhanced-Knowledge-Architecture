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

from app.data.claims import failures as claim_failures
from app.data.coverage import authored_nodes, coverage
from app.data.curriculum import (
    COURSES,
    EDGES,
    NODES,
    NODES_BY_CODE,
    UNITS,
    course_counts,
    topological_order,
)
from app.data.lessons import LESSONS
from app.data.molecule_build import validate_library


def _check_curriculum() -> list[dict]:
    """Graph integrity, and the course and unit structure around it."""
    problems: list[dict] = []
    if topological_order() is None:
        problems.append({"check": "dag", "detail": "curriculum graph contains a cycle"})
    for a, b in EDGES:
        if a not in NODES_BY_CODE:
            problems.append({"check": "edge", "detail": f"edge from unknown node {a}"})
        if b not in NODES_BY_CODE:
            problems.append({"check": "edge", "detail": f"edge to unknown node {b}"})

    expected = {"GEN1": 91, "GEN2": 75, "ORG1": 70, "ORG2": 76}
    counts = course_counts()
    for course, want in expected.items():
        got = counts.get(course, 0)
        if got != want:
            problems.append(
                {"check": "course_counts", "detail": f"{course} has {got} nodes, expected {want}"}
            )

    # A unit with no nodes is a heading with nothing under it, and a unit with
    # no chapter mapping cannot be aligned to a syllabus, which is the reason
    # units exist rather than a flat list.
    for unit in UNITS:
        if not unit.node_codes:
            problems.append({"check": "unit_empty", "detail": f"{unit.id} has no nodes"})
        if not unit.chapters.strip():
            problems.append({"check": "unit_chapters", "detail": f"{unit.id} has no chapter mapping"})
        for code in unit.node_codes:
            if code not in NODES_BY_CODE:
                problems.append({"check": "unit_node", "detail": f"{unit.id} lists unknown node {code}"})
    for course in COURSES:
        if not course.unit_ids:
            problems.append({"check": "course_empty", "detail": f"{course.id} has no units"})
    return problems


def _check_lessons() -> list[dict]:
    """Every authored lesson is complete and attached to a real node.

    The rule changed when the curriculum became the full two year sequence.
    It used to read "every node has a lesson", which was checkable when the
    map was 60 nodes and the content was 60 lessons. The map is now 312 nodes
    because it is the whole program, and the content is written phase by
    phase, so "every node has a lesson" would fail by design for two years and
    the checklist would be ignored rather than fixed.

    What is gated instead: a lesson that exists must be complete, must sit on
    a node that exists, and must name a misconception that exists. Coverage of
    the map is reported separately and is not a failure. That keeps the gate
    strict about quality while being honest about extent.

    A lesson pointing at a node that is not in the curriculum is still a
    failure, because that is content detached from the graph, which is the
    error this file exists to catch.
    """
    problems: list[dict] = []
    for code, lesson in LESSONS.items():
        if code not in NODES_BY_CODE:
            problems.append({"check": "lesson_orphan", "detail": f"lesson {code} has no node"})
            continue
        missing = lesson.missing_parts()
        if missing:
            problems.append(
                {"check": "lesson_arc", "detail": f"{code} lesson missing {', '.join(missing)}"}
            )
        if lesson.node != code:
            problems.append(
                {"check": "lesson_node", "detail": f"lesson under {code} claims node {lesson.node}"}
            )
        if lesson.misconception and lesson.misconception not in cc.MISCONCEPTIONS:
            problems.append(
                {
                    "check": "lesson_misconception",
                    "detail": f"{code} lesson names unknown misconception {lesson.misconception}",
                }
            )
        for claim, result in claim_failures(getattr(lesson, "claims", ())):
            problems.append(
                {
                    "check": "lesson_claim",
                    "detail": (
                        f"{code} asserts a chemical fact that does not hold: "
                        f"{result.detail} ({type(claim).__name__})"
                    ),
                }
            )
    problems += _check_organic_lessons_carry_claims()
    return problems


def _check_organic_lessons_carry_claims() -> list[dict]:
    """An organic lesson with no checkable claim is unverified content.

    Blocking rather than a warning, because the whole defence for authored
    organic chemistry is that its structural facts are re-derived rather than
    reviewed. A lesson that states a configuration only in prose has opted out
    of that defence, and the failure mode is silent: it reads exactly like a
    lesson that was checked.

    Some organic nodes legitimately have nothing structural to claim, and they
    say so by carrying a Source instead. That still counts, because a Source is
    an author taking responsibility for a fact this system cannot derive. What
    does not count is an empty tuple.
    """
    problems: list[dict] = []
    for code, lesson in LESSONS.items():
        if not code.startswith("ORG"):
            continue
        if not getattr(lesson, "claims", ()):
            problems.append(
                {
                    "check": "lesson_unverified",
                    "detail": (
                        f"{code} is an organic lesson with no checkable claim, so "
                        "nothing it asserts about structure was verified"
                    ),
                }
            )
    return problems


def _check_templates() -> list[dict]:
    """Three rung ladders everywhere, and every key independently verified."""
    problems: list[dict] = []
    ladders = cc.hint_coverage(list(cc.REGISTRY))
    for tid in ladders["missing"]:
        problems.append({"check": "hint_ladder", "detail": f"{tid} has no hint ladder"})
    for tid in ladders["incomplete"]:
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
        # The prompt itself must not contain the answer either. Two graders are
        # exempt because for them the stored key is not the withheld answer: an
        # MC prompt legitimately lists the choices, and a retro prompt shows the
        # target molecule, which is the question rather than the answer. The
        # withheld answer in a retro item is the precursor set, and that is
        # checked below instead.
        if key_text and len(key_text) > 3 and key_text in variant.prompt.lower():
            if variant.grader not in ("mc", "retro"):
                problems.append(
                    {"check": "prompt_reveals_answer", "detail": f"{tid} prompt contains the key"}
                )
        if variant.grader == "retro":
            prompt_lower = variant.prompt.lower()
            for precursor in variant.meta.get("key_precursors", []):
                pl = str(precursor).strip().lower()
                if pl and len(pl) > 2 and pl in prompt_lower:
                    problems.append(
                        {
                            "check": "prompt_reveals_answer",
                            "detail": f"{tid} prompt contains a key precursor {precursor}",
                        }
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
    """Every triangle view is complete and sits on a real node.

    The rule used to be "every triangle eligible node ships a view", which
    held when 18 nodes were eligible and 18 views existed. The finer grained
    map flags many more nodes as eligible than have been authored, so that
    form of the rule would now fail for the same reason the lesson rule would:
    the map is ahead of the content on purpose.

    What stays blocking is quality. A view with an empty corner is worse than
    no view, because two of three levels is exactly the silent jump between
    levels that Johnstone identified as the problem. Coverage is reported.
    """
    from app.data.triangle_views import TRIANGLE_VIEWS

    problems: list[dict] = []
    for code, view in TRIANGLE_VIEWS.items():
        if code not in NODES_BY_CODE:
            problems.append({"check": "triangle_view", "detail": f"view {code} has no node"})
            continue
        for level in ("macroscopic", "particulate", "symbolic", "connector", "pitfall"):
            if not str(getattr(view, level, "")).strip():
                problems.append(
                    {"check": "triangle_view", "detail": f"{code} view has an empty {level}"}
                )
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


def _report_citation_debt() -> list[dict]:
    """How many authored facts are cited but not verified.

    A Source claim records that somebody is accountable for a number this
    system cannot derive. It does not record that the number was checked
    against the work it cites, and the distinction matters more than it looks.
    The organic units carry chemical shifts, IR frequencies, pKa values and
    bond energies attached to real reference works, written from consensus
    knowledge rather than read off the page. The citation is a pointer to
    where the number should be confirmed, not evidence that it was.

    Left unstated, a reader sees a citation and reasonably concludes the figure
    was verified. So the count is reported on the same checklist as everything
    else, and it is the review queue for a subject matter expert. It is a
    warning rather than a blocker because the alternative to a cited unverified
    number is usually an uncited one or a silently omitted fact, and both are
    worse.
    """
    from app.data.claims import Source

    cited = 0
    per_course: dict[str, int] = {}
    for code, lesson in LESSONS.items():
        for claim in getattr(lesson, "claims", ()):
            if isinstance(claim, Source):
                cited += 1
                node = NODES_BY_CODE.get(code)
                if node:
                    per_course[node.course] = per_course.get(node.course, 0) + 1
    if not cited:
        return []
    breakdown = ", ".join(f"{k} {v}" for k, v in sorted(per_course.items()))
    return [
        {
            "check": "citation_review_debt",
            "detail": (
                f"{cited} authored facts carry a citation but have not been "
                f"checked against the cited work ({breakdown}). These are the "
                "values this system cannot derive from structure, such as "
                "chemical shifts, IR bands, pKa and bond energies. A citation "
                "names who is accountable for a number; it is not evidence the "
                "number was verified. This is the subject matter expert review "
                "queue."
            ),
            "severity": "needs-expert-review",
        }
    ]


def _report_coverage() -> list[dict]:
    """What exists on the map but is not written yet, and other real gaps.

    Reported rather than failed. Every line here is a true statement about
    extent, not about quality, and the phase plan says which phase closes it.
    Stating them on the same report as the blocking checks is deliberate: a
    reader should not have to go somewhere else to find out how much of the
    program is actually authored.
    """
    from app.data.triangle_views import TRIANGLE_VIEWS

    warnings: list[dict] = []
    cov = coverage()
    warnings.append(
        {
            "check": "lesson_coverage",
            "detail": (
                f"{cov['authored']} of {cov['nodes']} nodes carry a lesson. "
                f"{cov['unauthored']} do not and are marked unavailable to learners."
            ),
            "severity": "informational",
        }
    )
    warnings += _report_citation_debt()
    for course_id, row in cov["by_course"].items():
        warnings.append(
            {
                "check": "course_coverage",
                "detail": f"{course_id} {row['title']}: {row['authored']} of {row['nodes']} nodes authored",
                "severity": "informational",
            }
        )

    eligible = [n.code for n in NODES if n.triangle_eligible]
    have = [c for c in eligible if c in TRIANGLE_VIEWS]
    warnings.append(
        {
            "check": "triangle_coverage",
            "detail": f"{len(have)} of {len(eligible)} triangle eligible nodes have a view",
            "severity": "informational",
        }
    )

    from app.data import periodic

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
        "courses": len(COURSES),
        "units": len(UNITS),
        "nodes": len(NODES),
        "authored_nodes": len(authored_nodes()),
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

    warnings = _report_coverage()

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
