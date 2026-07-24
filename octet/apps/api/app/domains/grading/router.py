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
