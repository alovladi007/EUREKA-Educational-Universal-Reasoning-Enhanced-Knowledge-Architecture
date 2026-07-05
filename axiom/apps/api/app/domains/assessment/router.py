"""Assessment routes: teacher authoring and student delivery."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from shared_schemas.identity import UserOut
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import get_current_user, require_roles
from app.domains.assessment import service as svc
from app.domains.assessment.models import Assessment, AssignmentTarget
from app.domains.curriculum.models import KnowledgeNode
from app.domains.identity.models import Role, RoleAssignment, User

router = APIRouter(prefix="/assessments", tags=["assessment"])

teacher_only = require_roles("teacher", "org_admin", "super_admin", "author")


class CreateAssessment(BaseModel):
    title: str
    node_ids: list[str]
    item_count: int = 5


class AssignBody(BaseModel):
    user_ids: list[str] | None = None
    all_students: bool = False


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
        session, uuid.UUID(teacher.id), body.title, node_ids, body.item_count
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
        {"id": str(a.id), "title": a.title, "kind": a.kind, "created_at": a.created_at}
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
    added = await svc.assign(session, aid, user_ids)
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
        (
            await session.execute(
                select(Assessment)
                .join(AssignmentTarget, AssignmentTarget.assessment_id == Assessment.id)
                .where(AssignmentTarget.user_id == uuid.UUID(user.id))
                .order_by(Assessment.created_at.desc())
            )
        )
        .scalars()
        .all()
    )
    return [{"id": str(a.id), "title": a.title} for a in rows]


@router.post("/{assessment_id}/start", summary="Start an assigned assessment (student)")
async def start(
    assessment_id: str,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    result = await svc.start_attempt(session, uuid.UUID(assessment_id), uuid.UUID(user.id))
    await session.commit()
    return result
