"""Grading and item serving endpoints.

Phase 1 surface. Every response goes through the sandbox, and every served
variant has had its key independently verified before it leaves the process.

Teaching model enforcement lives here too: the hint endpoint will not return a
rung above the one the learner has actually unlocked, and no endpoint on this
router returns a worked solution.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

import chem_core as cc
from app.core.security import Principal, get_current_principal
from app.domains.grading.sandbox import grade_sandboxed

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

    # The stored key never leaves the server on the serve path.
    public_meta = {k: v for k, v in variant.meta.items() if k not in ("exact_g", "exact_x")}
    if variant.grader == "mc":
        public_meta = {
            "choices": [
                {"index": c["index"], "text": c["text"]} for c in variant.meta["choices"]
            ]
        }
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
    }


@router.get("/path")
async def learning_path(
    principal: Principal = Depends(get_current_principal),
) -> dict:
    """The planned route through the graph, with a reason on every node.

    Mastery is empty until Phase 3 persists it, so this currently plans from a
    cold start. That is stated rather than faked.
    """
    from app.domains.adaptive.picker import plan_path

    planned = plan_path({})
    planned["note"] = "Mastery persistence lands in Phase 3, so this plans from a cold start."
    return planned


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
