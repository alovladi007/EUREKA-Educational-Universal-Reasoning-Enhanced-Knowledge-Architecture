"""Grading and item serving endpoints.

Phase 1 surface. Every response goes through the sandbox, and every served
variant has had its key independently verified before it leaves the process.

Teaching model enforcement lives here too: the hint endpoint will not return a
rung above the one the learner has actually unlocked, and no endpoint on this
router returns a worked solution.
"""

from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

import chem_core as cc
from app.core.db import get_session
from app.core.security import Principal, get_current_principal
from app.domains.grading.sandbox import grade_sandboxed
from app.domains.grading.serve import public_meta as serve_public_meta

router = APIRouter()


class VariantOut(BaseModel):
    template_id: str
    seed: int
    prompt: str
    node: str
    grader: str
    meta: dict
    verified_by: str


class SubmitIn(BaseModel):
    template_id: str
    seed: int
    answer: str | int | float | None = Field(default=None)


class GradeOut(BaseModel):
    is_correct: bool
    score: float
    graded: bool
    grader: str
    detail: str
    misconception: str | None = None
    milestones: list[dict] = Field(default_factory=list)


class HintOut(BaseModel):
    template_id: str
    rung: int
    text: str


@router.get("/templates")
async def list_templates(_p: Principal = Depends(get_current_principal)) -> dict:
    """The catalogue of live templates, with the graders behind them."""
    return {
        "templates": [
            {
                "template_id": tid,
                "node": entry["node"],
                "grader": entry["grader"],
                "hint_rungs": 3 if tid in cc.HINTS else 0,
            }
            for tid, entry in cc.REGISTRY.items()
        ],
        "supported_graders": list(cc.SUPPORTED_GRADERS),
    }


@router.get("/practice/next", response_model=VariantOut)
async def next_item(
    template_id: str = Query(...),
    count: int = Query(0, ge=0),
    principal: Principal = Depends(get_current_principal),
) -> VariantOut:
    """Serve an issued variant, seeded per learner.

    The key is verified by an independent path before this returns. A template
    that cannot produce a verifiable variant raises rather than serving one.
    """
    if template_id not in cc.REGISTRY:
        raise HTTPException(404, f"unknown template {template_id}")
    seed = cc.variant_seed(principal.user_id, template_id, count)
    try:
        variant = cc.resolve_generated(template_id, seed)
    except RuntimeError as exc:
        raise HTTPException(503, str(exc)) from exc

    # The stored key never leaves the server on the serve path. Whitelisted
    # per grader and fail-closed; the blacklist this replaced leaked numeric
    # answers through meta once templates grew value/key_text/wrong_paths.
    public_meta = serve_public_meta(variant.grader, variant.meta)
    return VariantOut(
        template_id=variant.template_id,
        seed=variant.seed,
        prompt=variant.prompt,
        node=variant.node,
        grader=variant.grader,
        meta=public_meta,
        verified_by=str(variant.meta.get("verified_by", "")),
    )


@router.post("/practice/submit", response_model=GradeOut)
async def submit(
    payload: SubmitIn, _p: Principal = Depends(get_current_principal)
) -> GradeOut:
    """Grade a submission against the stored key of the issued variant."""
    if payload.template_id not in cc.REGISTRY:
        raise HTTPException(404, f"unknown template {payload.template_id}")
    try:
        variant = cc.resolve_generated(payload.template_id, payload.seed)
    except RuntimeError as exc:
        raise HTTPException(503, str(exc)) from exc

    result = await grade_sandboxed(
        variant.grader, {"key": variant.key, "meta": variant.meta}, payload.answer
    )
    # correct_display is deliberately dropped. The teaching model forbids
    # showing the solution on the grading path.
    return GradeOut(
        is_correct=result["is_correct"],
        score=result["score"],
        graded=result["graded"],
        grader=result["grader"],
        detail=result["detail"],
        misconception=result["misconception"],
        milestones=result["milestones"],
    )


@router.get("/practice/hint", response_model=HintOut)
async def hint(
    template_id: str = Query(...),
    rung: int = Query(1, ge=1, le=3),
    unlocked: int = Query(1, ge=0, le=3),
    _p: Principal = Depends(get_current_principal),
) -> HintOut:
    """Return one hint rung, never above the rung the learner has unlocked."""
    if rung > unlocked:
        raise HTTPException(
            403,
            "That hint is not unlocked yet. Make an attempt at the current rung first.",
        )
    text = cc.rung(template_id, rung)
    if text is None:
        raise HTTPException(404, f"no rung {rung} for {template_id}")
    return HintOut(template_id=template_id, rung=rung, text=text)


@router.get("/curriculum/nodes")
async def curriculum_nodes(
    course: str | None = Query(None), _p: Principal = Depends(get_current_principal)
) -> dict:
    """The knowledge graph, as the course and unit hierarchy it is taught in.

    A flat node list was serviceable at 60 nodes. At 312 it is not: the client
    has to rebuild the course and unit grouping to render anything, and the
    chapter mapping that makes a syllabus conversation possible would be lost
    on the way. The nesting here is the structure, not a convenience.

    course narrows the response to one course and is the whole program when
    omitted. counts stays flat and unfiltered, so a client can show how much of
    the program it is looking at.
    """
    from app.data.coverage import is_authored
    from app.data.curriculum import (
        COURSES,
        NODES_BY_CODE,
        UNITS_BY_ID,
        course_counts,
        prerequisites_of,
    )

    def node_row(code: str) -> dict:
        n = NODES_BY_CODE[code]
        return {
            "code": n.code,
            "title": n.title,
            "description": n.description,
            "number": n.number,
            "kind": n.kind,
            "course": n.course,
            "unit": n.unit,
            "prerequisites": prerequisites_of(n.code),
            "lab_adjacent": n.lab_adjacent,
            "triangle_eligible": n.triangle_eligible,
            # The map is larger than the content on purpose, so the client is
            # told which nodes are enterable rather than left to guess from a
            # 404 on the lesson route.
            "authored": is_authored(n.code),
        }

    selected = [c for c in COURSES if not course or c.id == course]
    return {
        "courses": [
            {
                "id": c.id,
                "title": c.title,
                "semester": c.semester,
                "units": [
                    {
                        "id": u.id,
                        "title": u.title,
                        "chapters": u.chapters,
                        "index": u.index,
                        "nodes": [node_row(code) for code in u.node_codes],
                    }
                    for u in (UNITS_BY_ID[uid] for uid in c.unit_ids)
                ],
            }
            for c in selected
        ],
        "counts": course_counts(),
    }


@router.get("/curriculum/lessons/{node_code}")
async def lesson(node_code: str, _p: Principal = Depends(get_current_principal)) -> dict:
    """One lesson in the six part arc.

    try_it_answer is returned so the client can render it click to reveal.
    The teaching model requires the learner to answer before revealing, which
    is a client side interaction, and no item key is exposed here.
    """
    from app.data.lessons import lesson_for

    found = lesson_for(node_code)
    if found is None:
        raise HTTPException(404, f"no lesson for {node_code}")
    return {
        "node": found.node,
        "objective": found.objective,
        "build_on": found.build_on,
        "core_idea": found.core_idea,
        "worked_example": found.worked_example,
        "try_it": {"prompt": found.try_it_prompt, "answer": found.try_it_answer,
                   "reveal": "click"},
        "pitfall": found.pitfall,
        "misconception": found.misconception,
        # Whether a Johnstone triangle view actually exists for this node, so
        # the client can decide whether to ask for one.
        #
        # This is deliberately not the node's triangle_eligible flag. That flag
        # marks a node where a triangle view would teach something, which is an
        # authoring intention: 69 nodes carry it and 18 have a view. A client
        # reading eligibility as availability requests a view for every lesson
        # and takes a 404 on most of them, which is what happened.
        "has_triangle_view": _has_triangle_view(node_code),
    }


def _has_triangle_view(node_code: str) -> bool:
    from app.data import triangle_views

    return triangle_views.for_node(node_code) is not None


@router.get("/path")
async def learning_path(
    principal: Principal = Depends(get_current_principal),
    session: AsyncSession = Depends(get_session),
) -> dict:
    """The recommended route, built from this learner's recorded practice.

    Three groups, each with a reason on every node:

      review    nodes whose recorded accuracy fell below the review bar,
                weakest first, so the biggest hole is repaired first.
      continue  nodes with attempts that are neither mastered nor failing,
                most recently touched first.
      next      authored nodes not yet attempted whose authored prerequisites
                have all been attempted, in course order. An unauthored
                prerequisite cannot gate: there is nothing to open, so
                blocking on it would deadlock the plan rather than teach.

    The numbers behind this are recorded practice accuracy (an exponentially
    weighted average of graded attempts). That is stated in the note, along
    with what it is not: an IRT ability estimate.
    """
    from sqlalchemy import select

    from app.data.coverage import is_authored
    from app.data.curriculum import NODES_BY_CODE, prerequisites_of, topological_order
    from app.domains.practice.models import NodeMastery, mastery_state

    order = topological_order()
    if order is None:
        raise ValueError("curriculum graph has a cycle")

    rows = (
        await session.execute(
            select(NodeMastery).where(NodeMastery.user_id == principal.user_id)
        )
    ).scalars().all()
    by_code = {r.node_code: r for r in rows if r.node_code in NODES_BY_CODE}
    states = {c: mastery_state(r.attempts, r.ewma) for c, r in by_code.items()}
    attempted = {c for c, r in by_code.items() if r.attempts > 0}

    def entry(code: str, state: str, reason: str) -> dict:
        node = NODES_BY_CODE[code]
        out = {
            "node": code,
            "title": node.title,
            "course": node.course,
            "unit": node.unit,
            "state": state,
            "reason": reason,
        }
        row = by_code.get(code)
        if row is not None and row.attempts:
            out["attempts"] = row.attempts
            out["accuracy"] = round(row.ewma, 3)
        return out

    review = [
        entry(
            code,
            "needs_review",
            f"Recorded accuracy is {round(by_code[code].ewma * 100)}% over "
            f"{by_code[code].attempts} attempts, so this is the weakest thing "
            "to repair first.",
        )
        for code in sorted(
            (c for c, s in states.items() if s == "needs_review"),
            key=lambda c: by_code[c].ewma,
        )[:3]
    ]

    in_progress = sorted(
        (c for c, s in states.items() if s == "in_progress"),
        key=lambda c: (
            by_code[c].last_attempt_at is not None,
            by_code[c].last_attempt_at or datetime.min,
        ),
        reverse=True,
    )[:3]
    cont = [
        entry(
            code,
            "in_progress",
            f"You have started this ({by_code[code].attempts} attempts, "
            f"{round(by_code[code].ewma * 100)}% recent accuracy) and it is "
            "not yet mastered.",
        )
        for code in in_progress
    ]

    if not attempted:
        nxt = [
            entry(code, "ready", "Nothing is recorded yet, so the course starts here.")
            for code in (c for c in order if is_authored(c))
        ][:5]
        note = (
            "Nothing is recorded for you yet, so this plan starts from the "
            "beginning of the course. Once you practice, it is built from your "
            "recorded accuracy on graded attempts. It is accuracy, not an IRT "
            "ability estimate, and it does not predict an exam score."
        )
    else:

        def unlocked(code: str) -> bool:
            # Only authored prerequisites gate: an unauthored one has no
            # lesson to open, so it is skipped rather than allowed to block.
            return all(
                q in attempted for q in prerequisites_of(code) if is_authored(q)
            )

        nxt = [
            entry(
                code,
                "ready",
                "Every prerequisite you can study is mastered or under way, "
                "so this is next in course order.",
            )
            for code in order
            if is_authored(code) and code not in attempted and unlocked(code)
        ][:5]
        note = (
            "This plan is built from your recorded practice accuracy, an "
            "exponentially weighted average of your graded attempts. It is "
            "accuracy, not an IRT ability estimate, and it does not predict "
            "an exam score."
        )

    return {
        "review": review,
        "continue": cont,
        "next": nxt,
        "recorded_nodes": len(attempted),
        "note": note,
    }


@router.get("/diagnostic")
async def diagnostic(
    course: str | None = Query(None),
    limit: int = Query(12, ge=1, le=30),
    principal: Principal = Depends(get_current_principal),
) -> dict:
    """Placement diagnostic: one item per covered node. Keys are not returned."""
    from app.domains.practice.diagnostic import build_diagnostic

    items = build_diagnostic(principal.user_id, course=course, limit=limit)
    return {
        "items": [
            {"node": i.node, "template_id": i.template_id, "seed": i.seed,
             "prompt": i.prompt, "grader": i.grader, "meta": i.meta}
            for i in items
        ],
        "count": len(items),
    }


@router.get("/compliance")
async def compliance(_p: Principal = Depends(get_current_principal)) -> dict:
    """The teaching model compliance checklist, run live.

    Exposed deliberately: a course that cannot show a green checklist should
    not be trusted, and hiding the check would defeat its purpose.
    """
    from app.compliance import run

    return run()


@router.get("/misconceptions")
async def misconceptions(_p: Principal = Depends(get_current_principal)) -> dict:
    """The named misconception library, with review status stated honestly."""
    from chem_core.misconceptions import unreviewed

    return {
        "misconceptions": [
            {
                "code": m.code,
                "name": m.name,
                "description": m.description,
                "counterexample": m.counterexample,
                "routes_to": m.routes_to,
                "source": m.source,
                "review": m.review,
            }
            for m in cc.MISCONCEPTIONS.values()
        ],
        "awaiting_sme_review": unreviewed(),
    }
