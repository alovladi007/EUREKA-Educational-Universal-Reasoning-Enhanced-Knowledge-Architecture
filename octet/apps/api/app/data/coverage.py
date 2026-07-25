"""Which nodes carry authored content, and how much of the map that is.

One concept, defined once, because three places need it and they must agree:
the compliance checklist decides what to gate on, the API tells the client
which nodes are enterable, and the Learn page renders an honest chip on the
rest.

A node is authored when it has a lesson. That is the minimum a learner needs
for the node to be worth opening; items, hints and simulations attach to a
node that already teaches something.

The distinction matters because the curriculum is deliberately larger than the
content. The map is the full two year sequence so an instructor can see
syllabus alignment during adoption, and so later phases author into a
structure that already exists rather than redrawing it. Presenting 312 nodes
as though they were all ready would be the dishonest way to do that, and
shrinking the map to what happens to be written would hide the shape of the
program. So the map is complete, the coverage is stated, and every unauthored
node says so on its own row.
"""

from __future__ import annotations

from app.data.curriculum import COURSES, NODES, NODES_BY_CODE
from app.data.lessons import LESSONS


def authored_nodes() -> set[str]:
    """Node codes that carry a lesson."""
    return {code for code in LESSONS if code in NODES_BY_CODE}


def is_authored(code: str) -> bool:
    return code in LESSONS and code in NODES_BY_CODE


def coverage() -> dict:
    """Authoring coverage overall and per course.

    Reported rather than gated. A course with no authored nodes is not a
    failure, it is a course that has not been written yet, and the phase plan
    says which phase writes it.
    """
    authored = authored_nodes()
    per_course: dict[str, dict] = {}
    for course in COURSES:
        codes = [n.code for n in NODES if n.course == course.id]
        have = [c for c in codes if c in authored]
        per_course[course.id] = {
            "title": course.title,
            "nodes": len(codes),
            "authored": len(have),
            "fraction": round(len(have) / len(codes), 4) if codes else 0.0,
        }
    return {
        "nodes": len(NODES),
        "authored": len(authored),
        "unauthored": len(NODES) - len(authored),
        "by_course": per_course,
    }
