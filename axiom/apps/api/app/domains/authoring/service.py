"""Authoring service: create, edit, and list items in a bank.

Database-touching helpers for the Content Studio. Kept separate from the router
so the CRUD is easy to test. All writes validate the item kind against the
canonical ITEM_KINDS list and confirm the referenced node and bank exist, so a
malformed draft never reaches the item bank.
"""

from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.assessment.models import ITEM_KINDS, Item, ItemBank
from app.domains.curriculum.models import KnowledgeNode


class AuthoringError(ValueError):
    """Raised for an invalid draft (unknown kind, missing node or bank)."""


def item_to_dict(item: Item) -> dict:
    return {
        "id": str(item.id),
        "bank_id": str(item.bank_id),
        "node_id": str(item.node_id),
        "kind": item.kind,
        "prompt": item.prompt,
        "options": item.options,
        "correct": str(item.correct),
        "explanation": item.explanation or "",
        "difficulty": item.difficulty,
        "tolerance": item.tolerance,
        "meta": item.meta,
    }


async def resolve_node_id(session: AsyncSession, ref: str) -> uuid.UUID | None:
    """Resolve a node reference that may be a code (ALG.1) or a UUID string."""
    node = (
        await session.execute(select(KnowledgeNode).where(KnowledgeNode.code == ref))
    ).scalar_one_or_none()
    if node is not None:
        return node.id
    try:
        candidate = uuid.UUID(ref)
    except (ValueError, TypeError):
        return None
    exists = (
        await session.execute(select(KnowledgeNode.id).where(KnowledgeNode.id == candidate))
    ).scalar_one_or_none()
    return exists


async def list_banks(session: AsyncSession) -> list[dict]:
    banks = (await session.execute(select(ItemBank))).scalars().all()
    return [
        {"id": str(b.id), "name": b.name, "description": b.description} for b in banks
    ]


async def list_nodes(session: AsyncSession) -> list[dict]:
    nodes = (
        await session.execute(select(KnowledgeNode).order_by(KnowledgeNode.code))
    ).scalars().all()
    return [
        {"id": str(n.id), "code": n.code, "title": n.title} for n in nodes
    ]


async def list_items(
    session: AsyncSession,
    *,
    node_id: uuid.UUID | None = None,
    bank_id: uuid.UUID | None = None,
) -> list[dict]:
    query = select(Item)
    if node_id is not None:
        query = query.where(Item.node_id == node_id)
    if bank_id is not None:
        query = query.where(Item.bank_id == bank_id)
    items = (await session.execute(query)).scalars().all()
    return [item_to_dict(item) for item in items]


async def _default_bank_id(session: AsyncSession) -> uuid.UUID | None:
    bank = (await session.execute(select(ItemBank))).scalars().first()
    return bank.id if bank is not None else None


async def create_item(session: AsyncSession, payload: dict) -> dict:
    kind = payload["kind"]
    if kind not in ITEM_KINDS:
        raise AuthoringError(f"unknown item kind: {kind}")
    node_id = await resolve_node_id(session, str(payload["node"]))
    if node_id is None:
        raise AuthoringError("unknown node")
    bank_ref = payload.get("bank_id")
    if bank_ref:
        try:
            bank_id: uuid.UUID | None = uuid.UUID(str(bank_ref))
        except (ValueError, TypeError):
            bank_id = None
    else:
        bank_id = await _default_bank_id(session)
    if bank_id is None:
        raise AuthoringError("no item bank available")

    item = Item(
        bank_id=bank_id,
        node_id=node_id,
        kind=kind,
        prompt=payload["prompt"],
        options=payload.get("options"),
        correct=str(payload.get("correct", "")),
        explanation=payload.get("explanation", "") or "",
        difficulty=float(payload.get("difficulty", 0.5)),
        tolerance=payload.get("tolerance"),
        meta=payload.get("meta"),
    )
    session.add(item)
    await session.flush()
    return item_to_dict(item)


async def update_item(session: AsyncSession, item_id: uuid.UUID, payload: dict) -> dict:
    item = (
        await session.execute(select(Item).where(Item.id == item_id))
    ).scalar_one_or_none()
    if item is None:
        raise AuthoringError("item not found")
    if "kind" in payload:
        if payload["kind"] not in ITEM_KINDS:
            raise AuthoringError(f"unknown item kind: {payload['kind']}")
        item.kind = payload["kind"]
    if "node" in payload and payload["node"]:
        node_id = await resolve_node_id(session, str(payload["node"]))
        if node_id is None:
            raise AuthoringError("unknown node")
        item.node_id = node_id
    if "prompt" in payload:
        item.prompt = payload["prompt"]
    if "options" in payload:
        item.options = payload["options"]
    if "correct" in payload:
        item.correct = str(payload["correct"])
    if "explanation" in payload:
        item.explanation = payload["explanation"] or ""
    if "difficulty" in payload and payload["difficulty"] is not None:
        item.difficulty = float(payload["difficulty"])
    if "tolerance" in payload:
        item.tolerance = payload["tolerance"]
    if "meta" in payload:
        item.meta = payload["meta"]
    await session.flush()
    return item_to_dict(item)


async def delete_item(session: AsyncSession, item_id: uuid.UUID) -> bool:
    item = (
        await session.execute(select(Item).where(Item.id == item_id))
    ).scalar_one_or_none()
    if item is None:
        return False
    await session.delete(item)
    await session.flush()
    return True
