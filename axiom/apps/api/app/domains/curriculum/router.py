"""Curriculum routes: frameworks and the skill graph."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from shared_schemas.identity import UserOut
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import get_current_user
from app.domains.curriculum.models import (
    KnowledgeEdge,
    KnowledgeNode,
    StandardsFramework,
)

router = APIRouter(prefix="/curriculum", tags=["curriculum"])


@router.get("/frameworks", summary="Standards frameworks")
async def frameworks(
    session: AsyncSession = Depends(get_session),
    _: UserOut = Depends(get_current_user),
) -> list[dict]:
    rows = (await session.execute(select(StandardsFramework))).scalars().all()
    return [
        {"id": str(f.id), "code": f.code, "name": f.name, "description": f.description}
        for f in rows
    ]


@router.get("/graph", summary="The skill graph (nodes and edges)")
async def graph(
    session: AsyncSession = Depends(get_session),
    _: UserOut = Depends(get_current_user),
) -> dict:
    nodes = (
        (await session.execute(select(KnowledgeNode).order_by(KnowledgeNode.code))).scalars().all()
    )
    edges = (await session.execute(select(KnowledgeEdge))).scalars().all()
    return {
        "nodes": [
            {"id": str(n.id), "code": n.code, "title": n.title, "description": n.description}
            for n in nodes
        ],
        "edges": [
            {"from_id": str(e.from_node_id), "to_id": str(e.to_node_id), "kind": e.kind}
            for e in edges
        ],
    }


@router.get("/nodes/{node_id}", summary="A single skill node")
async def node(
    node_id: str,
    session: AsyncSession = Depends(get_session),
    _: UserOut = Depends(get_current_user),
) -> dict:
    n = (
        await session.execute(select(KnowledgeNode).where(KnowledgeNode.code == node_id))
    ).scalar_one_or_none()
    if n is None:
        import uuid

        try:
            n = (
                await session.execute(
                    select(KnowledgeNode).where(KnowledgeNode.id == uuid.UUID(node_id))
                )
            ).scalar_one_or_none()
        except ValueError:
            n = None
    if n is None:
        raise HTTPException(status_code=404, detail="node not found")
    return {"id": str(n.id), "code": n.code, "title": n.title, "description": n.description}
