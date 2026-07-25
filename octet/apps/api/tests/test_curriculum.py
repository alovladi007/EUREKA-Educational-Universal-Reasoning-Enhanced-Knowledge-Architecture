"""The curriculum map, the migration onto it, and the generator behind it.

Three separate risks, tested separately:

1. The map itself is structurally sound (a cycle or a dangling edge would
   break the path planner silently).
2. Every piece of authored content points at a node that exists. A lesson,
   template, misconception or simulation detached from the graph fails
   nowhere at runtime; it just stops being reachable, which is the failure
   mode this file exists to catch.
3. The vendored JSON still matches what its generator produces. The edges are
   generated rather than hand listed, and a hand edit to the JSON would be
   silently undone the next time anyone regenerates.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

import chem_core as cc
from app.data.coverage import authored_nodes, coverage
from app.data.curriculum import (
    COURSES,
    EDGES,
    NODES,
    NODES_BY_CODE,
    UNITS,
    UNITS_BY_ID,
    course_counts,
    nodes_in_unit,
    prerequisites_of,
    topological_order,
    units_in_course,
)
from app.data.node_migration import NODE_MIGRATION, SUPERSEDED

# ---------------------------------------------------------------------------
# The map
# ---------------------------------------------------------------------------


def test_program_shape():
    """The two year sequence, as registered."""
    assert [c.id for c in COURSES] == ["GEN1", "GEN2", "ORG1", "ORG2"]
    assert course_counts() == {"GEN1": 91, "GEN2": 75, "ORG1": 70, "ORG2": 76}
    assert len(NODES) == 312
    assert len(UNITS) == 40


def test_node_codes_are_unique():
    assert len({n.code for n in NODES}) == len(NODES)


def test_graph_is_acyclic_and_every_edge_resolves():
    for a, b in EDGES:
        assert a in NODES_BY_CODE, f"edge from unknown node {a}"
        assert b in NODES_BY_CODE, f"edge to unknown node {b}"
    order = topological_order()
    assert order is not None, "curriculum graph contains a cycle"
    assert len(order) == len(NODES)


def test_edges_respect_the_topological_order():
    """A prerequisite must come before the node that needs it."""
    order = topological_order()
    position = {code: i for i, code in enumerate(order)}
    for a, b in EDGES:
        assert position[a] < position[b], f"{a} is a prerequisite of {b} but sorts after it"


def test_every_unit_has_nodes_and_a_chapter_mapping():
    """Chapter mapping is what makes syllabus alignment possible."""
    for unit in UNITS:
        assert unit.node_codes, f"{unit.id} has no nodes"
        assert unit.chapters.strip(), f"{unit.id} has no chapter mapping"


def test_node_numbering_is_positional_and_consistent():
    """A learner sees "3.4", never a node code, so the numbering must be right."""
    for course in COURSES:
        for u_index, unit in enumerate(units_in_course(course.id), start=1):
            assert unit.index == u_index
            for n_index, node in enumerate(nodes_in_unit(unit.id), start=1):
                assert node.number == f"{u_index}.{n_index}"
                assert node.unit == unit.id
                assert node.course == course.id


def test_no_duplicate_edges():
    assert len(set(EDGES)) == len(EDGES)


def test_kinds_are_from_the_known_set():
    assert {n.kind for n in NODES} <= {"concept", "computational"}


# ---------------------------------------------------------------------------
# The migration, and nothing detached from the graph
# ---------------------------------------------------------------------------


def test_every_migration_target_exists():
    for old, new in NODE_MIGRATION.items():
        assert new in NODES_BY_CODE, f"{old} migrates to {new}, which is not a node"
    for old, new in SUPERSEDED.items():
        assert new in NODES_BY_CODE, f"{old} was superseded by {new}, which is not a node"


def test_migration_does_not_collapse_two_lessons_onto_one_node():
    """One node holds one lesson, so two old codes cannot share a target."""
    targets = list(NODE_MIGRATION.values())
    assert len(set(targets)) == len(targets)


def test_no_old_style_code_survives_anywhere():
    """The retired codes are gone from the map and from every content file."""
    from app.data.simulations import POE_ITEMS, SCENARIOS
    from app.data.triangle_views import TRIANGLE_VIEWS

    def looks_old(code: str) -> bool:
        return code.startswith(("C.CF.", "C.G1.", "C.G2."))

    assert not [n.code for n in NODES if looks_old(n.code)]
    assert not [c for c in TRIANGLE_VIEWS if looks_old(c)]
    assert not [m.routes_to for m in cc.MISCONCEPTIONS.values() if looks_old(m.routes_to)]
    assert not [t for t, e in cc.REGISTRY.items() if looks_old(str(e.get("node")))]
    assert not [s.id for s in SCENARIOS.values() if looks_old(s.node)]
    assert not [i.id for i in POE_ITEMS.values() if looks_old(i.node)]


def test_all_authored_content_points_at_a_real_node():
    """The check that catches content detached from the graph.

    Nothing here fails at runtime if it breaks. A lesson keyed to a node that
    does not exist simply never renders, and a template targeting a missing
    node still serves items that belong nowhere.
    """
    from app.data.lessons import LESSONS
    from app.data.simulations import POE_ITEMS, SCENARIOS
    from app.data.triangle_views import TRIANGLE_VIEWS

    for code in LESSONS:
        assert code in NODES_BY_CODE, f"lesson {code} has no node"
    for code, view in TRIANGLE_VIEWS.items():
        assert code in NODES_BY_CODE, f"triangle view {code} has no node"
        assert view.node == code, f"triangle view {code} claims node {view.node}"
    for code, m in cc.MISCONCEPTIONS.items():
        assert m.routes_to in NODES_BY_CODE, f"{code} routes to unknown node {m.routes_to}"
    for tid, entry in cc.REGISTRY.items():
        assert entry.get("node") in NODES_BY_CODE, f"{tid} targets unknown node {entry.get('node')}"
    for scenario in SCENARIOS.values():
        assert scenario.node in NODES_BY_CODE, f"{scenario.id} targets unknown node {scenario.node}"
    for item in POE_ITEMS.values():
        assert item.node in NODES_BY_CODE, f"{item.id} targets unknown node {item.node}"


def test_the_two_titration_scenarios_target_the_two_titration_nodes():
    """The finer map separates strong and weak, which the scenarios already did."""
    from app.data.simulations import SCENARIOS

    assert SCENARIOS["sim.titr.strong"].node == "GEN2.TITRATIONSTRONG"
    assert SCENARIOS["sim.titr.weak"].node == "GEN2.TITRATIONWEAK"


# ---------------------------------------------------------------------------
# Coverage: honest about extent, and not silently drifting
# ---------------------------------------------------------------------------


def test_coverage_is_reported_and_internally_consistent():
    cov = coverage()
    assert cov["nodes"] == len(NODES)
    assert cov["authored"] == len(authored_nodes())
    assert cov["authored"] + cov["unauthored"] == cov["nodes"]
    assert sum(row["nodes"] for row in cov["by_course"].values()) == len(NODES)
    assert sum(row["authored"] for row in cov["by_course"].values()) == cov["authored"]


def test_both_organic_courses_are_fully_authored():
    """Phase 5 authored ORG1 and Phase 6 authored ORG2, both complete.

    This assertion has been updated twice now, each time a phase it describes
    landed: it began life asserting ORG1 had zero lessons, then guarded the
    ORG1-being-written / ORG2-not boundary, and now records that both organic
    courses are complete. Each rewrite followed a real gate, not a relaxation.

    Every organic node carries a lesson, and every lesson carries claims the
    build re-derives, so "authored" here means machine-checked, not merely
    present. General chemistry remains deliberately partial: those courses were
    authored to a depth that seeded the engine, not to completion.
    """
    cov = coverage()
    for course in ("ORG1", "ORG2"):
        assert cov["by_course"][course]["authored"] == cov["by_course"][course]["nodes"], (
            f"{course} should be fully authored"
        )
    assert cov["by_course"]["GEN1"]["authored"] > 0


def test_unauthored_nodes_are_the_majority_and_that_is_stated_not_hidden():
    """Guards the product decision: the map is bigger than the content.

    Compliance must report this rather than gate on it, so a reader of the
    checklist sees the real extent without going somewhere else.
    """
    from app.compliance import run

    report = run()
    coverage_lines = [w for w in report["warnings"] if w["check"] == "lesson_coverage"]
    assert len(coverage_lines) == 1
    assert str(len(authored_nodes())) in coverage_lines[0]["detail"]
    assert str(len(NODES)) in coverage_lines[0]["detail"]


# ---------------------------------------------------------------------------
# The generator
# ---------------------------------------------------------------------------


def test_vendored_json_matches_its_generator():
    """The edges are generated, so a hand edit to the JSON would be lost.

    json.loads(json.dumps(...)) normalises the tuples the generator emits into
    the lists the file stores. Without that the comparison fails on
    representation rather than on content.
    """
    source = Path(__file__).resolve().parents[1] / "app" / "data" / "curriculum_source"
    sys.path.insert(0, str(source))
    try:
        import octet_curriculum_org as generator
    except ImportError:  # pragma: no cover - the source is vendored, so this is a real failure
        pytest.fail(f"curriculum generator is not importable from {source}")
    finally:
        sys.path.remove(str(source))

    regenerated = json.loads(json.dumps(generator.build()))
    shipped = json.loads((source.parent / "curriculum.json").read_text())
    assert regenerated == shipped, "curriculum.json has drifted from its generator"
