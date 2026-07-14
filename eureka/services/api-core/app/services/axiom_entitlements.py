"""Emit AXIOM entitlement webhooks on marketplace purchases (Integration Plan
Section 3, EUREKA side).

AXIOM enforces access from its entitlements table; rows arrive over
POST {AXIOM_API_URL}/api/v1/entitlements/webhook guarded by a shared secret
(see axiom/apps/api/app/domains/entitlements/). This module is the EUREKA
counterpart: when a purchase for a course that maps to an AXIOM product SKU
becomes paid, grant the entitlement; a future refund path calls revoke.

Course -> SKU mapping, in priority order:
  1. AXIOM_PRODUCT_COURSES env: JSON {"<course_uuid>": "<sku>", ...} -- explicit
     catalog registration, no schema change.
  2. A title tag convention: a course titled "... [axiom:axiom-odes]" maps to
     that SKU. Lets an author register a course from the UI alone.

Valid SKUs are AXIOM's three courses: axiom-linear-algebra, axiom-odes,
axiom-pdes-fourier.

Delivery is best-effort with a short timeout and never blocks or fails the
purchase: AXIOM's nightly reconciliation pull is the safety net the plan
prescribes (webhooks plus reconciliation). Failures are logged loudly.
"""

from __future__ import annotations

import json
import logging
import os
import re

import httpx

logger = logging.getLogger(__name__)

VALID_SKUS = {"axiom-linear-algebra", "axiom-odes", "axiom-pdes-fourier"}
_TITLE_TAG = re.compile(r"\[axiom:([a-z0-9-]+)\]", re.IGNORECASE)


def _axiom_base_url() -> str:
    # axiom-api joins the shared eureka-network; the container name resolves.
    return os.environ.get("AXIOM_API_URL", "http://axiom-api-1:8400").rstrip("/")


def _webhook_secret() -> str:
    return os.environ.get("AXIOM_ENTITLEMENT_WEBHOOK_SECRET", "axiom_dev_webhook_secret")


def sku_for_course(course_id: str, course_title: str | None = None) -> str | None:
    """Resolve a EUREKA course to an AXIOM product SKU, or None if unmapped."""
    raw = os.environ.get("AXIOM_PRODUCT_COURSES", "")
    if raw:
        try:
            mapping = json.loads(raw)
            sku = mapping.get(str(course_id))
            if sku in VALID_SKUS:
                return sku
        except (ValueError, AttributeError):
            logger.warning("AXIOM_PRODUCT_COURSES is not valid JSON; ignoring")
    if course_title:
        m = _TITLE_TAG.search(course_title)
        if m and m.group(1).lower() in VALID_SKUS:
            return m.group(1).lower()
    return None


async def emit_entitlement(eureka_user_id: str, product_code: str, event: str) -> bool:
    """POST one entitlement event to AXIOM. Returns True on acknowledged.

    event is "entitlement.granted" or "entitlement.revoked". Never raises: a
    failure is logged and False returned; the purchase flow must not depend on
    AXIOM being up (reconciliation covers the gap).
    """
    if product_code not in VALID_SKUS:
        return False
    url = f"{_axiom_base_url()}/api/v1/entitlements/webhook"
    payload = {
        "event": event,
        "eureka_user_id": str(eureka_user_id),
        "product_code": product_code,
    }
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.post(
                url, json=payload, headers={"X-Webhook-Secret": _webhook_secret()}
            )
            resp.raise_for_status()
            detail = resp.json().get("detail", "")
            logger.info("axiom entitlement %s for %s: %s", event, product_code, detail)
            return True
    except Exception as exc:
        logger.error(
            "axiom entitlement webhook failed (%s %s): %s -- reconciliation will cover",
            event, product_code, exc,
        )
        return False


async def maybe_grant_for_purchase(db, user_id, course_id) -> None:
    """Called after a purchase becomes paid: if the course maps to an AXIOM
    product, grant the entitlement. Fetches the course title for the tag
    convention; swallows every error by design."""
    try:
        from app.models.course import Course

        course = await db.get(Course, course_id)
        title = getattr(course, "title", None) if course is not None else None
        sku = sku_for_course(str(course_id), title)
        if sku:
            await emit_entitlement(str(user_id), sku, "entitlement.granted")
    except Exception as exc:
        logger.error("maybe_grant_for_purchase failed: %s", exc)
