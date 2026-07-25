"""The adaptive picker and path planner.

Policy order, ported from AXIOM: requested, then remediation, then frontier,
then review. Every choice returns a plain language reason, because the
teaching model requires the picker to explain itself to the learner ("you
missed X for reason Y, so we are practicing Z").
"""

from __future__ import annotations

from dataclasses import dataclass

from app.data.coverage import is_authored
from app.data.curriculum import NODES, NODES_BY_CODE, prerequisites_of, topological_order
from app.domains.adaptive.bkt import MASTERED_BAR, PREREQ_BAR, level_for


@dataclass(frozen=True)
class Choice:
    node: str
    policy: str
    reason: str


def plan_path(mastery: dict[str, float]) -> dict:
    """Order the graph and mark each node ready, blocked or mastered.

    A node is ready when every prerequisite is at or above PREREQ_BAR. The
    reason string is written for the learner, not for a log.
    """
    order = topological_order()
    if order is None:
        raise ValueError("curriculum graph has a cycle")

    plan = []
    recommended = None
    for code in order:
        node = NODES_BY_CODE[code]
        p = mastery.get(code, 0.0)
        prereqs = prerequisites_of(code)
        blocking = [q for q in prereqs if mastery.get(q, 0.0) < PREREQ_BAR]
        if p >= MASTERED_BAR:
            state, reason = "mastered", f"You can do {node.title.lower()} unaided."
        elif blocking:
            names = ", ".join(NODES_BY_CODE[b].title.lower() for b in blocking[:2])
            state = "blocked"
            reason = f"Waiting on {names}, because {node.title.lower()} builds directly on it."
        else:
            state = "ready"
            reason = (
                f"Ready now. Its prerequisites are in place and you are at "
                f"{level_for(p)} on this."
            )
            # The map is deliberately larger than the content: 312 nodes, and
            # most have no lesson yet. A node with nothing behind it is not a
            # recommendation, it is a dead end, so the first ready node that
            # is also authored wins. Every node still appears in the plan,
            # because the plan is the route and the route includes what has
            # not been written yet.
            if recommended is None and is_authored(code):
                recommended = code
        plan.append(
            {
                "node": code,
                "title": node.title,
                "course": node.course,
                "unit": node.unit,
                "number": node.number,
                "p_known": round(p, 3),
                "level": level_for(p),
                "state": state,
                "reason": reason,
                "authored": is_authored(code),
            }
        )
    return {"plan": plan, "recommended_node": recommended}


def pick_next(
    mastery: dict[str, float],
    *,
    requested: str | None = None,
    last_misconception_route: str | None = None,
    due_reviews: list[str] | None = None,
) -> Choice:
    """Choose the next node, in the fixed policy order."""
    if requested and requested in NODES_BY_CODE:
        return Choice(requested, "requested", "You chose this topic.")

    if last_misconception_route and last_misconception_route in NODES_BY_CODE:
        if mastery.get(last_misconception_route, 0.0) < MASTERED_BAR:
            title = NODES_BY_CODE[last_misconception_route].title.lower()
            return Choice(
                last_misconception_route,
                "remediation",
                f"Your last answer pointed at a belief that lives in {title}, "
                "so we are practicing that before moving on.",
            )

    planned = plan_path(mastery)
    if planned["recommended_node"]:
        code = planned["recommended_node"]
        return Choice(
            code,
            "frontier",
            f"This is the next thing you are ready for: {NODES_BY_CODE[code].title.lower()}.",
        )

    if due_reviews:
        code = due_reviews[0]
        if code in NODES_BY_CODE:
            return Choice(
                code,
                "review",
                f"Everything is unlocked, so we are keeping "
                f"{NODES_BY_CODE[code].title.lower()} fresh.",
            )

    # Last resort. The first node of the program is authored today, but that
    # is a fact about content rather than a guarantee, so this looks rather
    # than assumes.
    first = next((n.code for n in NODES if is_authored(n.code)), None)
    if first is None:
        return Choice("", "unavailable", "No node has a lesson yet.")
    return Choice(first, "start", "Starting at the beginning of the course.")
