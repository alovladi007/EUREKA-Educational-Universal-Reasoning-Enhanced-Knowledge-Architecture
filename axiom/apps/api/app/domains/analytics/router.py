"""Analytics routes: item analysis, standards heatmap, learner growth, a live
during-assessment view, and Caliper-style event ingestion.

Item analysis, the standards heatmap, and learner growth are each available as
JSON and as CSV, PDF, and XLSX downloads. Every export reuses the same query and
table-flattening helpers as the JSON endpoint, so all views stay in sync. Item,
standards, and live views are teacher-scoped; growth is self-service for the
signed-in learner. Event ingestion accepts Caliper payloads from other services.
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Body, Depends, Query, Response
from shared_schemas.identity import UserOut
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import get_current_user, require_roles
from app.domains.analytics.exports import to_csv, to_pdf, to_xlsx
from app.domains.analytics.ingest import ingest_caliper, recent_events
from app.domains.analytics.service import (
    growth,
    growth_table,
    item_analysis,
    item_analysis_table,
    live_assessment,
    standards_heatmap,
    standards_table,
)

router = APIRouter(prefix="/analytics", tags=["analytics"])

teacher_only = require_roles("teacher", "org_admin", "super_admin", "author")

_XLSX_MEDIA = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"


def _download(content, media_type: str, filename: str) -> Response:
    return Response(
        content=content,
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


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
    return _download(to_csv(headers, rows), "text/csv", "item-analysis.csv")


@router.get("/items.pdf", summary="Item analysis as PDF (teacher)")
async def items_pdf(
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> Response:
    headers, rows = item_analysis_table(await item_analysis(session))
    return _download(to_pdf("Item Analysis", headers, rows), "application/pdf", "item-analysis.pdf")


@router.get("/items.xlsx", summary="Item analysis as Excel (teacher)")
async def items_xlsx(
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> Response:
    headers, rows = item_analysis_table(await item_analysis(session))
    return _download(to_xlsx("Item Analysis", headers, rows), _XLSX_MEDIA, "item-analysis.xlsx")


@router.get("/standards", summary="Standards mastery heatmap (teacher)")
async def standards(
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> dict:
    return await standards_heatmap(session)


@router.get("/standards.csv", summary="Standards heatmap as CSV (teacher)")
async def standards_csv(
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> Response:
    headers, rows = standards_table(await standards_heatmap(session))
    return _download(to_csv(headers, rows), "text/csv", "standards-heatmap.csv")


@router.get("/standards.pdf", summary="Standards heatmap as PDF (teacher)")
async def standards_pdf(
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> Response:
    headers, rows = standards_table(await standards_heatmap(session))
    return _download(
        to_pdf("Standards Heatmap", headers, rows), "application/pdf", "standards-heatmap.pdf"
    )


@router.get("/standards.xlsx", summary="Standards heatmap as Excel (teacher)")
async def standards_xlsx(
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> Response:
    headers, rows = standards_table(await standards_heatmap(session))
    return _download(
        to_xlsx("Standards Heatmap", headers, rows), _XLSX_MEDIA, "standards-heatmap.xlsx"
    )


@router.get("/live/{assessment_id}", summary="Live during-assessment progress (teacher)")
async def live(
    assessment_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> dict:
    return await live_assessment(session, assessment_id)


@router.get("/growth/me", summary="My mastery growth over time")
async def my_growth(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    return await growth(session, uuid.UUID(user.id))


@router.get("/growth/me.csv", summary="My mastery growth as CSV")
async def my_growth_csv(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> Response:
    headers, rows = growth_table(await growth(session, uuid.UUID(user.id)))
    return _download(to_csv(headers, rows), "text/csv", "growth.csv")


@router.get("/growth/me.xlsx", summary="My mastery growth as Excel")
async def my_growth_xlsx(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> Response:
    headers, rows = growth_table(await growth(session, uuid.UUID(user.id)))
    return _download(to_xlsx("Growth", headers, rows), _XLSX_MEDIA, "growth.xlsx")


@router.post("/events", summary="Ingest Caliper-style learning events")
async def ingest_events(
    payload: dict = Body(...),
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    """Ingest one event or a batch. Accepts {"events": [...]} or a single event
    object. Each is validated against the Caliper Event schema before storage."""
    has_batch = isinstance(payload, dict) and "events" in payload
    batch = payload["events"] if has_batch else [payload]
    written = await ingest_caliper(session, list(batch))
    return {"ingested": written}


@router.get("/events", summary="Recent learning events (teacher)")
async def list_events(
    limit: int = Query(100, ge=1, le=500),
    actor: str | None = Query(None),
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> dict:
    return {"events": await recent_events(session, limit=limit, actor=actor)}
