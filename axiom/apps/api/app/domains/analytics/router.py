"""Analytics routes: item analysis, standards heatmap, and learner growth.

Item analysis is available as JSON for dashboards and as CSV and PDF for teachers
who want to download and share it. The export endpoints reuse the same query and
table-flattening helpers as the JSON endpoint so all three views stay in sync.
Item and standards views are teacher-scoped; growth is self-service for the
signed-in learner.
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Response
from shared_schemas.identity import UserOut
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import get_current_user, require_roles
from app.domains.analytics.exports import to_csv, to_pdf
from app.domains.analytics.service import (
    growth,
    item_analysis,
    item_analysis_table,
    standards_heatmap,
)

router = APIRouter(prefix="/analytics", tags=["analytics"])

teacher_only = require_roles("teacher", "org_admin", "super_admin", "author")


@router.get("/items", summary="Item analysis (teacher)")
async def items(
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> dict:
    return {"items": await item_analysis(session)}


@router.get("/items.csv", summary="Item analysis as CSV (teacher)")
async def items_csv(
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> Response:
    headers, rows = item_analysis_table(await item_analysis(session))
    return Response(
        content=to_csv(headers, rows),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=item-analysis.csv"},
    )


@router.get("/items.pdf", summary="Item analysis as PDF (teacher)")
async def items_pdf(
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> Response:
    headers, rows = item_analysis_table(await item_analysis(session))
    return Response(
        content=to_pdf("Item Analysis", headers, rows),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=item-analysis.pdf"},
    )


@router.get("/standards", summary="Standards mastery heatmap (teacher)")
async def standards(
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> dict:
    return await standards_heatmap(session)


@router.get("/growth/me", summary="My mastery growth over time")
async def my_growth(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    return await growth(session, uuid.UUID(user.id))
