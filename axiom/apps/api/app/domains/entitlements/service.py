"""Entitlement checks (Integration Work Plan, Section 3: the monetization link).

Design, per the plan:
  - AXIOM courses are EUREKA products. The node-code prefix maps to a product
    SKU (LA. -> axiom-linear-algebra, ODE. -> axiom-odes, PF. ->
    axiom-pdes-fourier); nodes outside the Engineering Math track carry no SKU
    and stay free (the core ladder is not paywalled by this mechanism).
  - The free tier is entitlement RULES, not hardcoded checks: settings
    free_units lists unit prefixes (default LA.U1, the natural free demo) that
    are always accessible, so which units are samples is configuration.
  - Access is checked at next-item and attempt time against the local
    entitlements table through a short-TTL in-process cache -- EUREKA/Stripe is
    never called on the hot path. Rows arrive via the EUREKA webhook.
  - Enforcement is off by default (settings entitlements_enforced) so local
    dev and existing deployments keep working until the EUREKA catalog exists.
"""

from __future__ import annotations

import time
import uuid
from dataclasses import dataclass
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.domains.entitlements.models import Entitlement

# Node-code prefix -> product SKU. Longest-prefix wins so a future finer split
# (e.g. a separate SVD mini-course) can shadow a course prefix.
PRODUCTS: dict[str, str] = {
    "LA.": "axiom-linear-algebra",
    "ODE.": "axiom-odes",
    "PF.": "axiom-pdes-fourier",
}

# (user_id, product_code) -> (allowed, expiry_of_cache_entry). Short TTL: a
# webhook revocation lands within a minute without any hot-path remote calls.
_CACHE_TTL_S = 60.0
_cache: dict[tuple[str, str], tuple[bool, float]] = {}


@dataclass
class AccessDecision:
    allowed: bool
    product_code: str | None
    reason: str


def product_for_node(node_code: str) -> str | None:
    """The product SKU a node belongs to, or None for unpaywalled content."""
    code = str(node_code or "")
    best = None
    for prefix, sku in PRODUCTS.items():
        if code.startswith(prefix) and (best is None or len(prefix) > len(best[0])):
            best = (prefix, sku)
    return best[1] if best else None


def is_free_unit(node_code: str) -> bool:
    """True when the node falls in a configured free-sample unit."""
    code = str(node_code or "")
    return any(code.startswith(str(u).rstrip(".") + ".") or code == str(u)
               for u in get_settings().free_units)


def _cache_get(user_id: uuid.UUID, product: str) -> bool | None:
    hit = _cache.get((str(user_id), product))
    if hit is None or hit[1] < time.monotonic():
        return None
    return hit[0]


def _cache_put(user_id: uuid.UUID, product: str, allowed: bool) -> None:
    _cache[(str(user_id), product)] = (allowed, time.monotonic() + _CACHE_TTL_S)


def invalidate_cache(user_id: uuid.UUID | None = None) -> None:
    """Drop cached decisions (all, or one user's) after a webhook write."""
    if user_id is None:
        _cache.clear()
        return
    uid = str(user_id)
    for key in [k for k in _cache if k[0] == uid]:
        _cache.pop(key, None)


async def has_entitlement(
    session: AsyncSession, user_id: uuid.UUID, product_code: str
) -> bool:
    cached = _cache_get(user_id, product_code)
    if cached is not None:
        return cached
    now = datetime.now(UTC).replace(tzinfo=None)
    row = (
        await session.execute(
            select(Entitlement).where(
                Entitlement.user_id == user_id,
                Entitlement.product_code == product_code,
                Entitlement.active == True,  # noqa: E712
            )
        )
    ).scalars().first()
    allowed = bool(row and (row.expires_at is None or row.expires_at > now))
    _cache_put(user_id, product_code, allowed)
    return allowed


async def check_access(
    session: AsyncSession, user_id: uuid.UUID, node_code: str
) -> AccessDecision:
    """The next-item / attempt-time gate. Order: enforcement off -> allowed;
    unpaywalled or free-sample content -> allowed; else an active, unexpired
    entitlement is required."""
    settings = get_settings()
    product = product_for_node(node_code)
    if not settings.entitlements_enforced:
        return AccessDecision(True, product, "entitlements not enforced")
    if product is None:
        return AccessDecision(True, None, "content is not paywalled")
    if is_free_unit(node_code):
        return AccessDecision(True, product, "free sample unit")
    if await has_entitlement(session, user_id, product):
        return AccessDecision(True, product, "active entitlement")
    return AccessDecision(
        False, product,
        f"requires an active entitlement for {product}",
    )


async def grant(
    session: AsyncSession, user_id: uuid.UUID, product_code: str,
    expires_at: datetime | None = None, source: str = "webhook",
) -> Entitlement:
    """Upsert an active entitlement (purchase or renewal)."""
    row = (
        await session.execute(
            select(Entitlement).where(
                Entitlement.user_id == user_id,
                Entitlement.product_code == product_code,
            )
        )
    ).scalars().first()
    if row is None:
        row = Entitlement(
            user_id=user_id, product_code=product_code,
            active=True, expires_at=expires_at, source=source,
        )
        session.add(row)
    else:
        row.active = True
        row.expires_at = expires_at
        row.source = source
    await session.flush()
    invalidate_cache(user_id)
    return row


async def revoke(
    session: AsyncSession, user_id: uuid.UUID, product_code: str, source: str = "webhook"
) -> bool:
    """Deactivate an entitlement (refund or expiry). Returns True if one existed."""
    row = (
        await session.execute(
            select(Entitlement).where(
                Entitlement.user_id == user_id,
                Entitlement.product_code == product_code,
            )
        )
    ).scalars().first()
    if row is None:
        return False
    row.active = False
    row.source = source
    await session.flush()
    invalidate_cache(user_id)
    return True
