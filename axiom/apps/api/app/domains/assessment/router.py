"""Assessment routes: teacher authoring and student delivery."""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel
from shared_schemas.identity import UserOut
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import get_current_user, require_roles
from app.domains.assessment import service as svc
from app.domains.assessment.models import Assessment, AssignmentTarget, Item, ItemBank
from app.domains.assessment.qti import (
    MCQ_KIND,
    TEXT_KINDS,
    bank_to_qti,
    item_to_qti,
    qti_to_bank,
)
from app.domains.curriculum.models import KnowledgeNode
from app.domains.identity.models import Role, RoleAssignment, User

router = APIRouter(prefix="/assessments", tags=["assessment"])

teacher_only = require_roles("teacher", "org_admin", "super_admin", "author")

# QTI 3.0 export covers the selection and text-entry kinds the mapping supports.
# Richer kinds (show_work, plot_points, mcq_multi) have no lossless QTI form yet
# and are skipped on export rather than emitted incorrectly.
QTI_SUPPORTED_KINDS = (MCQ_KIND, *TEXT_KINDS)


class QtiImport(BaseModel):
    bank_id: str
    node_id: str
    xml: str


def _item_to_qti_dict(item: Item) -> dict:
    return {
        "identifier": str(item.id),
        "kind": item.kind,
        "prompt": item.prompt,
        "options": item.options,
        "correct": str(item.correct),
        "explanation": item.explanation or "",
    }


class CreateAssessment(BaseModel):
    title: str
    node_ids: list[str]
    item_count: int = 5
    # Optional ISO 8601 availability window; interpreted as UTC, stored naive.
    open_at: str | None = None
    close_at: str | None = None


class AssignBody(BaseModel):
    user_ids: list[str] | None = None
    all_students: bool = False
    # Optional ISO 8601 due date; interpreted as UTC and stored naive.
    due_at: str | None = None


def _parse_due(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    if parsed.tzinfo is not None:
        parsed = parsed.astimezone(UTC).replace(tzinfo=None)
    return parsed


async def _resolve_nodes(session: AsyncSession, refs: list[str]) -> list[uuid.UUID]:
    out: list[uuid.UUID] = []
    for ref in refs:
        node = (
            await session.execute(select(KnowledgeNode).where(KnowledgeNode.code == ref))
        ).scalar_one_or_none()
        if node is not None:
            out.append(node.id)
            continue
        try:
            out.append(uuid.UUID(ref))
        except ValueError:
            continue
    return out


@router.post("", summary="Create an assessment (teacher)")
async def create(
    body: CreateAssessment,
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> dict:
    node_ids = await _resolve_nodes(session, body.node_ids)
    if not node_ids:
        raise HTTPException(status_code=400, detail="no valid nodes")
    assessment = await svc.create_assessment(
        session,
        uuid.UUID(teacher.id),
        body.title,
        node_ids,
        body.item_count,
        open_at=_parse_due(body.open_at),
        close_at=_parse_due(body.close_at),
    )
    await session.commit()
    return {"id": str(assessment.id), "title": assessment.title}


@router.get("/mine", summary="Assessments I created (teacher)")
async def mine(
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> list[dict]:
    rows = (
        (
            await session.execute(
                select(Assessment)
                .where(Assessment.created_by == uuid.UUID(teacher.id))
                .order_by(Assessment.created_at.desc())
            )
        )
        .scalars()
        .all()
    )
    return [
        {
            "id": str(a.id),
            "title": a.title,
            "kind": a.kind,
            "created_at": a.created_at,
            "open_at": a.open_at,
            "close_at": a.close_at,
        }
        for a in rows
    ]


@router.post("/{assessment_id}/assign", summary="Assign an assessment (teacher)")
async def assign(
    assessment_id: str,
    body: AssignBody,
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> dict:
    aid = uuid.UUID(assessment_id)
    user_ids: list[uuid.UUID] = []
    if body.all_students:
        rows = (
            await session.execute(
                select(User.id)
                .join(RoleAssignment, RoleAssignment.user_id == User.id)
                .join(Role, Role.id == RoleAssignment.role_id)
                .where(Role.name == "student")
            )
        ).all()
        user_ids = [r[0] for r in rows]
    elif body.user_ids:
        user_ids = [uuid.UUID(u) for u in body.user_ids]
    added = await svc.assign(session, aid, user_ids, due_at=_parse_due(body.due_at))
    await session.commit()
    return {"assigned": added}


@router.get("/{assessment_id}/results", summary="Results for an assessment (teacher)")
async def results(
    assessment_id: str,
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> dict:
    return await svc.results(session, uuid.UUID(assessment_id))


@router.get("/assigned", summary="Assessments assigned to me (student)")
async def assigned(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> list[dict]:
    rows = (
        await session.execute(
            select(Assessment, AssignmentTarget)
            .join(AssignmentTarget, AssignmentTarget.assessment_id == Assessment.id)
            .where(AssignmentTarget.user_id == uuid.UUID(user.id))
            .order_by(Assessment.created_at.desc())
        )
    ).all()
    return [
        {
            "id": str(a.id),
            "title": a.title,
            "open_at": a.open_at,
            "close_at": a.close_at,
            "due_at": t.due_at,
        }
        for a, t in rows
    ]


@router.post("/{assessment_id}/start", summary="Start an assigned assessment (student)")
async def start(
    assessment_id: str,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    result = await svc.start_attempt(session, uuid.UUID(assessment_id), uuid.UUID(user.id))
    if "error" in result:
        status_by_reason = {"not_found": 404, "not_open": 403, "closed": 403}
        raise HTTPException(
            status_code=status_by_reason.get(result.get("reason"), 400),
            detail=result["error"],
        )
    await session.commit()
    return result


@router.get("/items/{item_id}/qti", summary="Export one item as QTI 3.0 XML (teacher)")
async def export_item_qti(
    item_id: str,
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> Response:
    item = (
        await session.execute(select(Item).where(Item.id == uuid.UUID(item_id)))
    ).scalar_one_or_none()
    if item is None:
        raise HTTPException(status_code=404, detail="item not found")
    if item.kind not in QTI_SUPPORTED_KINDS:
        raise HTTPException(status_code=400, detail=f"kind {item.kind} has no QTI export")
    xml = item_to_qti(_item_to_qti_dict(item))
    return Response(
        content=xml,
        media_type="application/xml",
        headers={"Content-Disposition": f"attachment; filename=item-{item_id}.xml"},
    )


@router.get("/banks/{bank_id}/qti", summary="Export a bank as a QTI 3.0 item bank (teacher)")
async def export_bank_qti(
    bank_id: str,
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> Response:
    items = (
        (
            await session.execute(
                select(Item)
                .where(Item.bank_id == uuid.UUID(bank_id))
                .where(Item.kind.in_(QTI_SUPPORTED_KINDS))
            )
        )
        .scalars()
        .all()
    )
    xml = bank_to_qti([_item_to_qti_dict(i) for i in items])
    return Response(
        content=xml,
        media_type="application/xml",
        headers={"Content-Disposition": f"attachment; filename=bank-{bank_id}.xml"},
    )


@router.post("/qti/import", summary="Import QTI 3.0 items into a bank (teacher)")
async def import_qti(
    body: QtiImport,
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> dict:
    bank = (
        await session.execute(select(ItemBank).where(ItemBank.id == uuid.UUID(body.bank_id)))
    ).scalar_one_or_none()
    if bank is None:
        raise HTTPException(status_code=404, detail="bank not found")
    node = (
        await session.execute(
            select(KnowledgeNode).where(KnowledgeNode.id == uuid.UUID(body.node_id))
        )
    ).scalar_one_or_none()
    if node is None:
        raise HTTPException(status_code=404, detail="node not found")

    try:
        parsed = qti_to_bank(body.xml)
    except Exception as exc:  # malformed XML or unsupported structure
        raise HTTPException(status_code=400, detail=f"invalid QTI: {exc}") from exc

    created: list[str] = []
    for entry in parsed:
        item = Item(
            bank_id=bank.id,
            node_id=node.id,
            kind=entry["kind"],
            prompt=entry.get("prompt", ""),
            options=entry.get("options"),
            correct=entry.get("correct", ""),
            explanation=entry.get("explanation", ""),
            difficulty=0.5,
        )
        session.add(item)
        await session.flush()
        created.append(str(item.id))

    await session.commit()
    return {"imported": len(created), "item_ids": created}
