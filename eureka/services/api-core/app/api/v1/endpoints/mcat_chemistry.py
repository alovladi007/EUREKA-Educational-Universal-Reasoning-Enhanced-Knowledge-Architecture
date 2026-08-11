"""MCAT chemistry powered by the OCTET engine (Phase B).

  GET  /mcat/chemistry/categories  -> the AAMC category map (SME-reviewable rows)
  POST /mcat/chemistry/items       -> N verified generated items for a category
  POST /mcat/chemistry/submit      -> grade + record the attempt
  GET  /mcat/chemistry/weakness    -> own-account per-category accuracy + review links

The division of authority: chemistry (generation, verification, grading,
misconception rationale) lives in the OCTET vertical and is reached over the
shared network with the CALLER'S OWN token forwarded, so identity crosses the
boundary unchanged and OCTET's auth applies as usual. Commerce and analytics
live here: the entitlement gate (an MCAT entitlement includes OCTET
chemistry; a standalone OCTET entitlement also serves), the AAMC category
mapping (versioned, reviewable rows - see the mcat_octet_001 migration), and
the attempt log the weakness analytics aggregate.

Honesty rules carried through:
  - Serving never includes a correct index; OCTET's serve path guarantees it
    and nothing here re-adds one.
  - The weakness readout is own-account accuracy over recorded attempts, with
    the attempt counts shown. No percentile, no predicted score, no difficulty
    claim: none of those has data behind it yet.
  - Categories with no mapped, servable content say so instead of padding
    (5C ships empty because OCTET has no separations content).
"""

from __future__ import annotations

import logging

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, Field
from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.models import User
from app.models.mcat_octet import McatChemAttempt, OctetMcatMap
from app.utils.dependencies import get_current_active_user
from app.utils.entitlements import has_exam_access

logger = logging.getLogger(__name__)

router = APIRouter()

VALID_CATEGORIES = ("4B", "4E", "5A", "5B", "5C", "5D", "5E")


class ChemItemsIn(BaseModel):
    category: str
    count: int = Field(10, ge=1, le=40)


class ChemSubmitIn(BaseModel):
    """The category is NOT accepted from the client: it is derived server-side
    from the graded item's node via the mapping table, so a client cannot
    mislabel an attempt and skew its own weakness analytics (or, later, the
    calibration data)."""

    template_id: str
    seed: int
    choice_index: int = Field(..., ge=0, le=3)
    seconds: int = Field(0, ge=0, le=3600)


async def _require_chemistry_access(db: AsyncSession, user: User) -> None:
    """MCAT full access includes OCTET chemistry; standalone OCTET also serves."""
    if await has_exam_access(db, user, "MCAT"):
        return
    if await has_exam_access(db, user, "OCTET"):
        return
    raise HTTPException(
        status_code=status.HTTP_402_PAYMENT_REQUIRED,
        detail={
            "message": "Generated chemistry practice requires an active MCAT "
                       "or OCTET entitlement.",
            "exam_code": "MCAT",
        },
    )


def _forwarded_token(request: Request) -> str:
    """The caller's own bearer token, forwarded so OCTET sees the same
    identity this service authenticated. Never a service credential."""
    auth = request.headers.get("authorization", "")
    if not auth.lower().startswith("bearer "):
        raise HTTPException(401, "missing bearer token")
    return auth


async def _octet_post(path: str, token: str, payload: dict) -> dict:
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"{settings.OCTET_API_URL}{path}",
                json=payload,
                headers={"Authorization": token},
            )
    except httpx.HTTPError as exc:
        logger.error("OCTET call failed: %s %s", path, exc)
        raise HTTPException(503, "The chemistry engine is unreachable.") from exc
    if resp.status_code >= 400:
        raise HTTPException(resp.status_code, resp.text[:500])
    return resp.json()


async def _octet_get(path: str, token: str) -> dict:
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.get(
                f"{settings.OCTET_API_URL}{path}",
                headers={"Authorization": token},
            )
    except httpx.HTTPError as exc:
        logger.error("OCTET call failed: %s %s", path, exc)
        raise HTTPException(503, "The chemistry engine is unreachable.") from exc
    if resp.status_code >= 400:
        raise HTTPException(resp.status_code, resp.text[:500])
    return resp.json()


def _valid_category(category: str) -> str:
    cat = category.strip().upper()
    if cat not in VALID_CATEGORIES:
        raise HTTPException(422, f"unknown AAMC category {category!r}; "
                                 f"valid: {', '.join(VALID_CATEGORIES)}")
    return cat


@router.get("/mcat/chemistry/categories")
async def chemistry_categories(
    request: Request,
    _user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """The active mapping, grouped by AAMC category, annotated with what can
    actually be served.

    Every row carries its rationale and review state, because the mapping is
    a claim under review, not a fact. Each node also says whether generated
    items exist for it RIGHT NOW (many mapped nodes are numeric or
    free-response practice, which the MCQ skin honestly refuses), and each
    category totals its servable nodes - so the UI can label 'no generated
    items yet' before the click instead of serving an empty session after it.
    """
    rows = (
        await db.execute(
            select(OctetMcatMap).where(OctetMcatMap.active == True)  # noqa: E712
            .order_by(OctetMcatMap.mcat_category, OctetMcatMap.octet_node)
        )
    ).scalars().all()

    # What OCTET can serve in MCAT form right now. If the engine is down we
    # say "unknown" (None) rather than guessing either way.
    servable_nodes: set[str] | None
    try:
        eligible = await _octet_get(
            "/api/v1/mcat/eligible-nodes", _forwarded_token(request)
        )
        servable_nodes = set(eligible.get("nodes", {}))
    except HTTPException:
        servable_nodes = None

    by_cat: dict[str, list[dict]] = {c: [] for c in VALID_CATEGORIES}
    for r in rows:
        by_cat.setdefault(r.mcat_category, []).append(
            {
                "octet_node": r.octet_node,
                "title": r.octet_node_title,
                "foundational_concept": r.foundational_concept,
                "rationale": r.rationale,
                "review": r.review,
                "servable": (
                    r.octet_node in servable_nodes
                    if servable_nodes is not None
                    else None
                ),
            }
        )
    summary = {
        cat: {
            "mapped_nodes": len(nodes),
            "servable_nodes": (
                sum(1 for n in nodes if n["servable"])
                if servable_nodes is not None
                else None
            ),
        }
        for cat, nodes in by_cat.items()
    }
    return {
        "categories": by_cat,
        "summary": summary,
        "note": (
            "This mapping is reviewable data: every row carries a rationale "
            "and stays review='pending' until a named subject-matter expert "
            "confirms it. 5C (separations and purifications) is empty because "
            "OCTET has no separations content, and an empty category is the "
            "honest representation of that. 'servable' means generated "
            "single-best-answer items with misconception-keyed options exist "
            "for that node today; mapped nodes whose practice is numeric or "
            "free-response are on the review path, not the item path. A null "
            "servable means the chemistry engine could not be reached to ask."
        ),
    }


@router.post("/mcat/chemistry/items")
async def chemistry_items(
    body: ChemItemsIn,
    request: Request,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """N verified generated items for an AAMC category. Entitlement-gated
    SERVER-side; the client gate is UX only."""
    await _require_chemistry_access(db, current_user)
    cat = _valid_category(body.category)
    nodes = (
        await db.execute(
            select(OctetMcatMap.octet_node).where(
                OctetMcatMap.active == True,  # noqa: E712
                OctetMcatMap.mcat_category == cat,
            )
        )
    ).scalars().all()
    if not nodes:
        return {
            "category": cat,
            "items": [],
            "note": f"No OCTET content is mapped to {cat} yet.",
        }
    # Offset the learner's deterministic variant sequence by their recorded
    # attempt count, so a second session serves fresh variants instead of
    # replaying the first word-for-word. Grading is unaffected: each item
    # carries its own (template_id, seed).
    prior_attempts = (
        await db.execute(
            select(func.count()).where(McatChemAttempt.user_id == current_user.id)
        )
    ).scalar_one()
    data = await _octet_post(
        "/api/v1/mcat/items",
        _forwarded_token(request),
        {"nodes": list(nodes), "count": body.count, "offset": int(prior_attempts)},
    )
    return {
        "category": cat,
        "items": data.get("items", []),
        "unservable_nodes": data.get("unservable_nodes", []),
    }


@router.post("/mcat/chemistry/submit")
async def chemistry_submit(
    body: ChemSubmitIn,
    request: Request,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Grade through the OCTET engine and record the attempt for weakness
    analytics. The grading result is OCTET's own, unmodified.

    The AAMC category on the attempt row is derived here from the graded
    item's node via the mapping table - never taken from the client - so the
    attempt log stays trustworthy as analytics (and later calibration) data.
    """
    await _require_chemistry_access(db, current_user)
    result = await _octet_post(
        "/api/v1/mcat/submit",
        _forwarded_token(request),
        {
            "template_id": body.template_id,
            "seed": body.seed,
            "choice_index": body.choice_index,
        },
    )
    node = str(result.get("node", ""))
    cat = (
        await db.execute(
            select(OctetMcatMap.mcat_category)
            .where(
                OctetMcatMap.active == True,  # noqa: E712
                OctetMcatMap.octet_node == node,
            )
            .order_by(OctetMcatMap.version.desc(), OctetMcatMap.mcat_category)
            .limit(1)
        )
    ).scalar_one_or_none() or "unmapped"
    row = McatChemAttempt(
        user_id=current_user.id,
        template_id=body.template_id,
        seed=body.seed,
        octet_node=node,
        mcat_category=cat,
        is_correct=bool(result.get("is_correct")),
        misconception=result.get("misconception"),
        seconds=body.seconds,
    )
    db.add(row)
    await db.commit()
    return {**result, "mcat_category": cat}


@router.get("/mcat/chemistry/weakness")
async def chemistry_weakness(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Own-account accuracy per AAMC category, worst first, with the mapped
    OCTET nodes to review. Attempt counts are shown with every figure so a
    2-attempt category cannot masquerade as a measured weakness. No
    percentile: there is no cohort, and none will be invented."""
    rows = (
        await db.execute(
            select(
                McatChemAttempt.mcat_category,
                func.count().label("attempts"),
                func.sum(case((McatChemAttempt.is_correct == True, 1), else_=0)).label("correct"),  # noqa: E712
            )
            .where(McatChemAttempt.user_id == current_user.id)
            .group_by(McatChemAttempt.mcat_category)
        )
    ).all()
    mapping = (
        await db.execute(
            select(OctetMcatMap).where(OctetMcatMap.active == True)  # noqa: E712
        )
    ).scalars().all()
    nodes_by_cat: dict[str, list[dict]] = {}
    for m in mapping:
        nodes_by_cat.setdefault(m.mcat_category, []).append(
            {"octet_node": m.octet_node, "title": m.octet_node_title}
        )

    out = []
    for cat, attempts, correct in rows:
        accuracy = round((correct or 0) / attempts, 3) if attempts else None
        out.append(
            {
                "category": cat,
                "attempts": int(attempts),
                "correct": int(correct or 0),
                "accuracy": accuracy,
                "review_nodes": nodes_by_cat.get(cat, [])[:6],
            }
        )
    out.sort(key=lambda r: (r["accuracy"] is None, r["accuracy"]))
    return {
        "categories": out,
        "note": (
            "Accuracy over this account's recorded attempts only, with the "
            "attempt count beside every figure. There is no percentile "
            "because there is no cohort to compare against."
        ),
    }
