"""OneRoster roster sync (Phase 4).

AXIOM consumes OneRoster: users and enrollments flow from the SIS, never entered
by hand. This module upserts a normalized roster payload into AXIOM's identity
tables (User via the same principal-sync the SSO path uses, plus Enrollment),
so rosters stay authoritative in the SIS.

The payload is the normalized shape below; a production pull adapts a specific
OneRoster REST response into it. Sync is idempotent: re-running it changes
nothing that has not changed at the source.

    {
      "users": [
        {"sourcedId": "...", "email": "...", "givenName": "...",
         "familyName": "...", "role": "teacher|student|administrator"}
      ],
      "enrollments": [
        {"userSourcedId": "...", "classSourcedId": "...", "role": "student"}
      ]
    }
"""

from __future__ import annotations

from shared_schemas.identity import Principal
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.identity.models import Enrollment, User
from app.domains.identity.service import sync_user_from_principal

# OneRoster role -> AXIOM role.
_ROLE_MAP = {
    "administrator": "org_admin",
    "teacher": "teacher",
    "aide": "teacher",
    "student": "student",
    "guardian": "parent",
    "parent": "parent",
}


def _axiom_role(oneroster_role: str | None) -> str:
    return _ROLE_MAP.get((oneroster_role or "").lower(), "student")


async def sync_roster(session: AsyncSession, payload: dict) -> dict:
    """Upsert users and enrollments from a normalized OneRoster payload."""
    users = payload.get("users") or []
    enrollments = payload.get("enrollments") or []

    users_synced = 0
    for entry in users:
        sourced = entry.get("sourcedId")
        if not sourced:
            continue
        name = " ".join(
            part for part in (entry.get("givenName"), entry.get("familyName")) if part
        )
        principal = Principal(
            sub=str(sourced),
            email=entry.get("email"),
            display_name=name or None,
            roles=[_axiom_role(entry.get("role"))],
            tenant_id=None,
        )
        await sync_user_from_principal(session, principal)
        users_synced += 1

    # Map sourcedId -> AXIOM user id so enrollments can reference the local user.
    by_sourced: dict[str, User] = {
        u.eureka_user_id: u
        for u in (await session.execute(select(User))).scalars().all()
    }

    enrollments_synced = 0
    for entry in enrollments:
        user = by_sourced.get(str(entry.get("userSourcedId")))
        course_ref = entry.get("classSourcedId")
        if user is None or not course_ref:
            continue
        role_in_course = _axiom_role(entry.get("role"))
        existing = (
            await session.execute(
                select(Enrollment).where(
                    Enrollment.user_id == user.id, Enrollment.course_ref == str(course_ref)
                )
            )
        ).scalar_one_or_none()
        if existing is None:
            session.add(
                Enrollment(
                    user_id=user.id,
                    course_ref=str(course_ref),
                    role_in_course=role_in_course,
                )
            )
        else:
            existing.role_in_course = role_in_course
        enrollments_synced += 1

    await session.flush()
    return {"users_synced": users_synced, "enrollments_synced": enrollments_synced}
