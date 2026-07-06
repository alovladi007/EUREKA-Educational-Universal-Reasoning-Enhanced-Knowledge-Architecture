"""Content Studio authoring routes (teacher and author roles).

Create, edit, list, and delete items in a bank, plus a preview-grade endpoint
that runs the real grader on a draft so an author can test an item before it is
saved. Every write is gated to teaching roles, matching the platform rule that
authoring is not a student capability.
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from math_core import linear_equation_steps, verify_steps
from pydantic import BaseModel
from shared_schemas.identity import UserOut
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import require_roles
from app.domains.authoring import service as svc
from app.domains.grading.service import grade

router = APIRouter(prefix="/authoring", tags=["authoring"])

author_only = require_roles("teacher", "org_admin", "super_admin", "author")


class ItemDraft(BaseModel):
    node: str
    kind: str
    prompt: str
    correct: str = ""
    options: list[str] | None = None
    explanation: str = ""
    difficulty: float = 0.5
    tolerance: float | None = None
    meta: dict | None = None
    bank_id: str | None = None


class ItemPatch(BaseModel):
    node: str | None = None
    kind: str | None = None
    prompt: str | None = None
    correct: str | None = None
    options: list[str] | None = None
    explanation: str | None = None
    difficulty: float | None = None
    tolerance: float | None = None
    meta: dict | None = None


class PreviewGrade(BaseModel):
    kind: str
    correct: str
    sample_answer: str
    options: list[str] | None = None
    tolerance: float | None = None
    explanation: str = ""
    meta: dict | None = None


class VerifySolution(BaseModel):
    steps: list[str]


class GenerateSolution(BaseModel):
    equation: str


@router.get("/banks", summary="List item banks (author)")
async def banks(
    session: AsyncSession = Depends(get_session),
    author: UserOut = Depends(author_only),
) -> dict:
    return {"banks": await svc.list_banks(session)}


@router.get("/nodes", summary="List knowledge nodes for the item form (author)")
async def nodes(
    session: AsyncSession = Depends(get_session),
    author: UserOut = Depends(author_only),
) -> dict:
    return {"nodes": await svc.list_nodes(session)}


@router.get("/items", summary="List authored items (author)")
async def items(
    node: str | None = Query(default=None),
    bank_id: str | None = Query(default=None),
    session: AsyncSession = Depends(get_session),
    author: UserOut = Depends(author_only),
) -> dict:
    node_id = await svc.resolve_node_id(session, node) if node else None
    bank_uuid: uuid.UUID | None = None
    if bank_id:
        try:
            bank_uuid = uuid.UUID(bank_id)
        except ValueError:
            bank_uuid = None
    rows = await svc.list_items(session, node_id=node_id, bank_id=bank_uuid)
    return {"items": rows}


@router.post("/items", summary="Create an item (author)")
async def create_item(
    body: ItemDraft,
    session: AsyncSession = Depends(get_session),
    author: UserOut = Depends(author_only),
) -> dict:
    try:
        item = await svc.create_item(session, body.model_dump())
    except svc.AuthoringError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    await session.commit()
    return item


@router.put("/items/{item_id}", summary="Update an item (author)")
async def update_item(
    item_id: str,
    body: ItemPatch,
    session: AsyncSession = Depends(get_session),
    author: UserOut = Depends(author_only),
) -> dict:
    try:
        parsed = uuid.UUID(item_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="invalid item id") from exc
    patch = {k: v for k, v in body.model_dump().items() if v is not None}
    # options is explicitly nullable, so allow clearing it when the key is sent.
    if body.options is not None:
        patch["options"] = body.options
    try:
        item = await svc.update_item(session, parsed, patch)
    except svc.AuthoringError as exc:
        detail = str(exc)
        code = 404 if detail == "item not found" else 400
        raise HTTPException(status_code=code, detail=detail) from exc
    await session.commit()
    return item


@router.delete("/items/{item_id}", summary="Delete an item (author)")
async def delete_item(
    item_id: str,
    session: AsyncSession = Depends(get_session),
    author: UserOut = Depends(author_only),
) -> dict:
    try:
        parsed = uuid.UUID(item_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="invalid item id") from exc
    ok = await svc.delete_item(session, parsed)
    if not ok:
        raise HTTPException(status_code=404, detail="item not found")
    await session.commit()
    return {"deleted": True, "id": item_id}


@router.post("/preview-grade", summary="Run the real grader on a draft (author)")
async def preview_grade(
    body: PreviewGrade,
    author: UserOut = Depends(author_only),
) -> dict:
    """Grade a sample answer against a draft with the production grader.

    This is how the Content Studio preview shows an author exactly how their
    item will grade, using the same grade() the practice flow uses. No database
    write happens here.
    """
    milestones = None
    if body.kind == "show_work" and body.meta:
        milestones = body.meta.get("milestones")
    outcome = grade(
        body.kind,
        body.correct,
        body.sample_answer,
        options=body.options,
        tolerance=body.tolerance,
        explanation=body.explanation,
        milestones=milestones,
    )
    return {
        "is_correct": outcome.is_correct,
        "score": outcome.score,
        "grader": outcome.grader,
        "confidence": outcome.confidence,
        "detail": outcome.detail,
        "correct_display": outcome.correct_display,
        "step_credits": outcome.step_credits,
    }


@router.post("/verify-solution", summary="Verify a worked solution against the CAS (author)")
async def verify_solution(
    body: VerifySolution,
    author: UserOut = Depends(author_only),
) -> dict:
    """Check that each line of a worked solution follows from the previous one.

    This is the guardrail from the build prompt: a worked solution is only shown
    or stored once every step is verified against SymPy.
    """
    check = verify_steps(body.steps)
    return {
        "ok": check.ok,
        "steps": [
            {"text": s.text, "verified": s.verified, "detail": s.detail}
            for s in check.steps
        ],
    }


@router.post("/generate-solution", summary="Generate a verified worked solution (author)")
async def generate_solution(
    body: GenerateSolution,
    author: UserOut = Depends(author_only),
) -> dict:
    """Generate a step-by-step solution for a linear equation in one variable.

    Returns the verified steps, or ok=false with an empty list when the input is
    not a single-variable linear equation (the only form generated for now).
    """
    steps = linear_equation_steps(body.equation)
    if steps is None:
        return {"ok": False, "steps": [], "detail": "not a single-variable linear equation"}
    return {"ok": True, "steps": steps, "detail": "generated and verified"}
