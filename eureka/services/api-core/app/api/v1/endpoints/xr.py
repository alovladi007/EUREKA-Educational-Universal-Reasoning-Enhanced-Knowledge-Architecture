"""XR Labs endpoints — experiences + session tracking.

Backs /dashboard/xr-labs/experience/[id], which used to target a non-existent
standalone XR service (:3005/api/xr). The data lives in xr_experiences /
xr_sessions (see ops/db/22_xr_labs.sql). Those tables use the column names the
xr-labs service shipped (category/difficulty/scene_url), so we map them to the
field names the FE viewer expects (experience_type/difficulty_level/
scene_file_url). Scene-builder + asset-library remain a future build.

Uses text() queries rather than ORM models on purpose: the tables are owned by
the (profile-gated) xr-labs service, so we read/write them without registering
parallel ORM models in api-core's metadata.
"""

import json
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import User
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/xr", tags=["xr-labs"])


def _as_uuid(value: str) -> Optional[uuid.UUID]:
    try:
        return uuid.UUID(str(value))
    except (ValueError, TypeError, AttributeError):
        return None


def _map_experience(r) -> dict:
    """Map an xr_experiences row to the shape the FE viewer consumes."""
    return {
        "id": str(r["id"]),
        "title": r["title"],
        "description": r["description"] or "",
        # FE calls the genre `experience_type`; the table stores `category`.
        "experience_type": r["category"] or "lab",
        "lab_subject": r["category"],
        "difficulty_level": (r["difficulty"] or "beginner"),
        "duration_minutes": r["duration_minutes"] or 15,
        # Not persisted on the table — every demo runs in the browser viewer.
        "supported_devices": ["web_browser", "quest", "vision_pro"],
        "scene_file_url": r["scene_url"] or "",
        "thumbnail_url": r["thumbnail_url"],
        "preview_video_url": None,
        "motion_intensity": None,
        "min_age": None,
        "max_concurrent_users": 1,
        "tags": list(r["tags"] or []),
        "learning_objectives": list(r["learning_objectives"] or []),
        "prerequisites": list(r["prerequisites"] or []),
        "total_sessions": r["usage_count"] or 0,
        "avg_rating": float(r["avg_rating"]) if r["avg_rating"] is not None else None,
        "created_at": r["created_at"].isoformat() if r["created_at"] else None,
    }


@router.get("/experiences")
async def list_experiences(db: AsyncSession = Depends(get_db)):
    """List published XR experiences. Public (no auth) — browsing the catalog."""
    rows = (
        await db.execute(
            text(
                "SELECT * FROM xr_experiences WHERE is_published = true "
                "ORDER BY title"
            )
        )
    ).mappings().all()
    return {"experiences": [_map_experience(r) for r in rows]}


@router.get("/experiences/{experience_id}")
async def get_experience(experience_id: str, db: AsyncSession = Depends(get_db)):
    """Get one experience. Public — the viewer fetches details before launch."""
    eid = _as_uuid(experience_id)
    if eid is None:
        raise HTTPException(status_code=404, detail="Experience not found")
    row = (
        await db.execute(
            text("SELECT * FROM xr_experiences WHERE id = :id"), {"id": eid}
        )
    ).mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"experience": _map_experience(row)}


class SessionStart(BaseModel):
    experience_id: str
    device_type: Optional[str] = None


@router.post("/sessions/start")
async def start_session(
    body: SessionStart,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Start a session for one experience (auth required). Bumps usage_count."""
    eid = _as_uuid(body.experience_id)
    if eid is None:
        raise HTTPException(status_code=404, detail="Experience not found")
    exists = (
        await db.execute(
            text("SELECT 1 FROM xr_experiences WHERE id = :id"), {"id": eid}
        )
    ).first()
    if not exists:
        raise HTTPException(status_code=404, detail="Experience not found")

    row = (
        await db.execute(
            text(
                "INSERT INTO xr_sessions (experience_id, user_id, device_type, status) "
                "VALUES (:eid, :uid, :dev, 'active') "
                "RETURNING id, experience_id, user_id, device_type, status, started_at"
            ),
            {"eid": eid, "uid": current_user.id, "dev": body.device_type},
        )
    ).mappings().first()
    await db.execute(
        text("UPDATE xr_experiences SET usage_count = COALESCE(usage_count, 0) + 1 WHERE id = :id"),
        {"id": eid},
    )
    await db.commit()
    return {
        "session": {
            "id": str(row["id"]),
            "experience_id": str(row["experience_id"]),
            "user_id": str(row["user_id"]) if row["user_id"] else None,
            "device_type": row["device_type"],
            "status": row["status"],
            "started_at": row["started_at"].isoformat() if row["started_at"] else None,
        }
    }


class SessionEnd(BaseModel):
    completion_percentage: Optional[int] = None
    user_rating: Optional[int] = None


@router.post("/sessions/{session_id}/end")
async def end_session(
    session_id: str,
    body: SessionEnd,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """End one of the caller's own sessions (auth + ownership-scoped)."""
    sid = _as_uuid(session_id)
    if sid is None:
        raise HTTPException(status_code=404, detail="Session not found")
    row = (
        await db.execute(
            text(
                "UPDATE xr_sessions SET status = 'completed', ended_at = now(), "
                "completion_percentage = :cp, user_rating = :ur "
                "WHERE id = :sid AND user_id = :uid "
                "RETURNING id, status, completion_percentage, user_rating, ended_at"
            ),
            {
                "sid": sid,
                "uid": current_user.id,
                "cp": body.completion_percentage,
                "ur": body.user_rating,
            },
        )
    ).mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="Session not found")
    await db.commit()
    return {
        "session": {
            "id": str(row["id"]),
            "status": row["status"],
            "completion_percentage": row["completion_percentage"],
            "user_rating": row["user_rating"],
            "ended_at": row["ended_at"].isoformat() if row["ended_at"] else None,
        }
    }


# ── Scene Builder: templates ────────────────────────────────────────────────


@router.get("/scene-builder/templates")
async def list_scene_templates(db: AsyncSession = Depends(get_db)):
    """Scene templates (public). The FE also health-gates the editor on this."""
    rows = (
        await db.execute(
            text("SELECT * FROM xr_scene_templates ORDER BY template_name")
        )
    ).mappings().all()
    return {
        "templates": [
            {
                "id": str(r["id"]),
                "template_name": r["template_name"],
                "description": r["description"] or "",
                # FE field is template_type; the table column is `category`.
                "template_type": r["category"] or "general",
                "thumbnail_url": r["thumbnail_url"],
                "scene_data": r["scene_data"]
                or {"objects": [], "lights": [], "cameras": []},
            }
            for r in rows
        ]
    }


# ── Asset library ───────────────────────────────────────────────────────────


@router.get("/asset-library/search")
async def search_assets(
    limit: int = 100,
    q: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """Search the 3D asset library (public). Joins the category for its name."""
    sql = (
        "SELECT a.id, a.asset_name, a.file_url, a.thumbnail_url, a.file_format, "
        "a.is_animated, c.category_name "
        "FROM xr_3d_assets a "
        "LEFT JOIN xr_asset_library_categories c ON a.category_id = c.id "
    )
    params = {"limit": max(1, min(limit, 500))}
    if q:
        sql += "WHERE a.asset_name ILIKE :q "
        params["q"] = f"%{q}%"
    sql += "ORDER BY a.asset_name LIMIT :limit"
    rows = (await db.execute(text(sql), params)).mappings().all()
    return {
        "assets": [
            {
                "id": str(r["id"]),
                "asset_name": r["asset_name"],
                "category_name": r["category_name"],
                "file_url": r["file_url"],
                "thumbnail_url": r["thumbnail_url"],
                "file_format": r["file_format"],
                # FE field is has_animations; the column is is_animated.
                "has_animations": bool(r["is_animated"]),
            }
            for r in rows
        ]
    }


@router.post("/asset-library/assets/{asset_id}/use")
async def use_asset(
    asset_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Track that an asset was dropped into a scene (bumps usage_count)."""
    aid = _as_uuid(asset_id)
    if aid is None:
        raise HTTPException(status_code=404, detail="Asset not found")
    row = (
        await db.execute(
            text(
                "UPDATE xr_3d_assets SET usage_count = COALESCE(usage_count, 0) + 1 "
                "WHERE id = :id RETURNING id, usage_count"
            ),
            {"id": aid},
        )
    ).mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="Asset not found")
    await db.commit()
    return {"ok": True, "usage_count": row["usage_count"]}


# ── Scene Builder: projects (save / update / publish) ───────────────────────


class ProjectBody(BaseModel):
    projectName: str
    description: Optional[str] = ""
    category: Optional[str] = "general"
    sceneData: dict = {}


@router.post("/scene-builder/projects")
async def create_project(
    body: ProjectBody,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Save a new scene project for the caller."""
    row = (
        await db.execute(
            text(
                "INSERT INTO xr_scene_projects "
                "(project_name, description, category, scene_data, created_by) "
                "VALUES (:name, :desc, :cat, CAST(:scene AS jsonb), :uid) "
                "RETURNING id, project_name"
            ),
            {
                "name": body.projectName,
                "desc": body.description,
                "cat": body.category,
                "scene": json.dumps(body.sceneData or {}),
                "uid": current_user.id,
            },
        )
    ).mappings().first()
    await db.commit()
    return {"project": {"id": str(row["id"]), "projectName": row["project_name"]}}


@router.put("/scene-builder/projects/{project_id}")
async def update_project(
    project_id: str,
    body: ProjectBody,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update one of the caller's own scene projects (ownership-scoped)."""
    pid = _as_uuid(project_id)
    if pid is None:
        raise HTTPException(status_code=404, detail="Project not found")
    row = (
        await db.execute(
            text(
                "UPDATE xr_scene_projects SET project_name = :name, "
                "description = :desc, category = :cat, "
                "scene_data = CAST(:scene AS jsonb), updated_at = now(), "
                "last_edited = now() "
                "WHERE id = :id AND created_by = :uid "
                "RETURNING id, project_name"
            ),
            {
                "id": pid,
                "uid": current_user.id,
                "name": body.projectName,
                "desc": body.description,
                "cat": body.category,
                "scene": json.dumps(body.sceneData or {}),
            },
        )
    ).mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="Project not found")
    await db.commit()
    return {"project": {"id": str(row["id"]), "projectName": row["project_name"]}}


class PublishBody(BaseModel):
    experience_type: Optional[str] = "vr_lab"
    difficulty_level: Optional[str] = "beginner"
    duration_minutes: Optional[int] = 30
    supported_devices: Optional[list] = None
    tags: Optional[list] = None


@router.post("/scene-builder/projects/{project_id}/publish")
async def publish_project(
    project_id: str,
    body: PublishBody,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Publish a project as a real, browsable xr_experiences row.

    Scene-builder projects are JSON scene graphs (scene_data), not a single
    glTF, so scene_url is left empty — the viewer renders an empty lit scene
    until a renderer that consumes scene_data is wired. The experience IS
    browsable/launchable and shows up in the XR Labs experiences list.
    """
    pid = _as_uuid(project_id)
    if pid is None:
        raise HTTPException(status_code=404, detail="Project not found")
    proj = (
        await db.execute(
            text("SELECT * FROM xr_scene_projects WHERE id = :id AND created_by = :uid"),
            {"id": pid, "uid": current_user.id},
        )
    ).mappings().first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    exp = (
        await db.execute(
            text(
                "INSERT INTO xr_experiences "
                "(title, description, category, difficulty, duration_minutes, "
                " scene_url, tags, is_published, created_by) "
                "VALUES (:title, :desc, :cat, :diff, :mins, '', :tags, true, :uid) "
                "RETURNING id"
            ),
            {
                "title": proj["project_name"],
                "desc": proj["description"],
                "cat": body.experience_type or proj["category"],
                "diff": body.difficulty_level,
                "mins": body.duration_minutes,
                "tags": body.tags or [],
                "uid": current_user.id,
            },
        )
    ).mappings().first()
    await db.execute(
        text("UPDATE xr_scene_projects SET is_public = true WHERE id = :id"),
        {"id": pid},
    )
    await db.commit()
    eid = str(exp["id"])
    return {"experienceId": eid, "experience_id": eid}
