"""Curriculum routes: frameworks and the skill graph."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Body, Depends, HTTPException
from shared_schemas.identity import UserOut
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import get_current_user, require_roles
from app.domains.curriculum.models import (
    Definition,
    KnowledgeEdge,
    KnowledgeNode,
    StandardsFramework,
    Theorem,
)

router = APIRouter(prefix="/curriculum", tags=["curriculum"])

author_only = require_roles("teacher", "org_admin", "super_admin", "author")


async def _node_id_for_code(session: AsyncSession, code: str | None) -> uuid.UUID | None:
    """Resolve a knowledge-node code to its id, or None."""
    if not code:
        return None
    node = (
        await session.execute(select(KnowledgeNode).where(KnowledgeNode.code == code))
    ).scalar_one_or_none()
    return node.id if node else None


def _definition_out(d: Definition) -> dict:
    return {
        "id": str(d.id),
        "course_code": d.course_code,
        "node_id": str(d.node_id) if d.node_id else None,
        "term": d.term,
        "statement": d.statement,
        "notation": d.notation,
    }


def _theorem_out(t: Theorem) -> dict:
    # An annotated-proof view: the proof sketch split into steps, paired with the
    # techniques the result exercises (Extension Section 6, annotated proofs).
    steps = [s.strip() for s in (t.proof_sketch or "").split(".") if s.strip()]
    return {
        "id": str(t.id),
        "course_code": t.course_code,
        "node_id": str(t.node_id) if t.node_id else None,
        "name": t.name,
        "statement": t.statement,
        "proof_sketch": t.proof_sketch,
        "techniques": t.techniques,
        "depends_on": t.depends_on,
        "annotated_steps": steps,
    }


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
            {
                "id": str(n.id),
                "code": n.code,
                "title": n.title,
                "description": n.description,
                "kind": n.kind,
                "tier": n.tier,
                "track": n.track,
            }
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
    return {
        "id": str(n.id),
        "code": n.code,
        "title": n.title,
        "description": n.description,
        "kind": n.kind,
        "tier": n.tier,
        "track": n.track,
    }


# --------------------------------------------------------------------------
# Definition and theorem reference library (Extension Section 6). Reads are
# open to any signed-in user; writes are author/teacher-scoped. course filters
# to one course's conventions.
# --------------------------------------------------------------------------


@router.get("/definitions", summary="Definitions in the reference library")
async def list_definitions(
    course: str | None = None,
    node: str | None = None,
    session: AsyncSession = Depends(get_session),
    _: UserOut = Depends(get_current_user),
) -> dict:
    query = select(Definition)
    if course:
        query = query.where(Definition.course_code == course)
    if node:
        node_id = await _node_id_for_code(session, node)
        query = query.where(Definition.node_id == node_id)
    rows = (await session.execute(query.order_by(Definition.term))).scalars().all()
    return {"definitions": [_definition_out(d) for d in rows]}


@router.post("/definitions", summary="Create a definition (author)")
async def create_definition(
    payload: dict = Body(...),
    session: AsyncSession = Depends(get_session),
    _: UserOut = Depends(author_only),
) -> dict:
    term = str(payload.get("term", "")).strip()
    statement = str(payload.get("statement", "")).strip()
    if not term or not statement:
        raise HTTPException(status_code=422, detail="term and statement are required")
    definition = Definition(
        course_code=str(payload.get("course_code", "")),
        node_id=await _node_id_for_code(session, payload.get("node")),
        term=term,
        statement=statement,
        notation=str(payload.get("notation", "")),
    )
    session.add(definition)
    await session.commit()
    return _definition_out(definition)


@router.delete("/definitions/{definition_id}", summary="Delete a definition (author)")
async def delete_definition(
    definition_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    _: UserOut = Depends(author_only),
) -> dict:
    definition = (
        await session.execute(select(Definition).where(Definition.id == definition_id))
    ).scalar_one_or_none()
    if definition is None:
        raise HTTPException(status_code=404, detail="definition not found")
    await session.delete(definition)
    await session.commit()
    return {"deleted": str(definition_id)}


@router.get("/theorems", summary="Theorems in the reference library")
async def list_theorems(
    course: str | None = None,
    node: str | None = None,
    session: AsyncSession = Depends(get_session),
    _: UserOut = Depends(get_current_user),
) -> dict:
    query = select(Theorem)
    if course:
        query = query.where(Theorem.course_code == course)
    if node:
        node_id = await _node_id_for_code(session, node)
        query = query.where(Theorem.node_id == node_id)
    rows = (await session.execute(query.order_by(Theorem.name))).scalars().all()
    return {"theorems": [_theorem_out(t) for t in rows]}


@router.post("/theorems", summary="Create a theorem (author)")
async def create_theorem(
    payload: dict = Body(...),
    session: AsyncSession = Depends(get_session),
    _: UserOut = Depends(author_only),
) -> dict:
    name = str(payload.get("name", "")).strip()
    statement = str(payload.get("statement", "")).strip()
    if not name or not statement:
        raise HTTPException(status_code=422, detail="name and statement are required")
    theorem = Theorem(
        course_code=str(payload.get("course_code", "")),
        node_id=await _node_id_for_code(session, payload.get("node")),
        name=name,
        statement=statement,
        proof_sketch=str(payload.get("proof_sketch", "")),
        techniques=list(payload.get("techniques", []) or []),
        depends_on=list(payload.get("depends_on", []) or []),
    )
    session.add(theorem)
    await session.commit()
    return _theorem_out(theorem)


@router.delete("/theorems/{theorem_id}", summary="Delete a theorem (author)")
async def delete_theorem(
    theorem_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    _: UserOut = Depends(author_only),
) -> dict:
    theorem = (
        await session.execute(select(Theorem).where(Theorem.id == theorem_id))
    ).scalar_one_or_none()
    if theorem is None:
        raise HTTPException(status_code=404, detail="theorem not found")
    await session.delete(theorem)
    await session.commit()
    return {"deleted": str(theorem_id)}
