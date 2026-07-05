"""Identity service: sync a EUREKA principal into an AXIOM user.

This is the pull side of the SSO bridge. When a verified principal arrives, we
upsert the user keyed by eureka_user_id, reconcile roles, and stamp last seen.
Role rows are created on demand so a new EUREKA role does not require a
migration. Optional profile enrichment against EUREKA is behind a flag so the
service does not hard-depend on EUREKA being reachable in local development.
"""

from __future__ import annotations

from datetime import UTC, datetime

from shared_schemas.identity import Principal, UserOut
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domains.identity.models import Role, RoleAssignment, User


def _derive_display_name(principal: Principal) -> str:
    if principal.display_name:
        return principal.display_name
    if principal.email:
        return principal.email.split("@", 1)[0]
    return f"User {principal.sub[:8]}"


def _derive_email(principal: Principal) -> str:
    return principal.email or f"{principal.sub}@eureka.local"


async def _get_or_create_role(session: AsyncSession, name: str) -> Role:
    role = (await session.execute(select(Role).where(Role.name == name))).scalar_one_or_none()
    if role is None:
        role = Role(name=name, description=f"Synced from EUREKA role '{name}'")
        session.add(role)
        await session.flush()
    return role


async def sync_user_from_principal(session: AsyncSession, principal: Principal) -> UserOut:
    """Upsert the user for this principal and return it as UserOut."""
    stmt = (
        select(User)
        .where(User.eureka_user_id == principal.sub)
        .options(selectinload(User.role_assignments).selectinload(RoleAssignment.role))
    )
    user = (await session.execute(stmt)).scalar_one_or_none()

    now = datetime.now(UTC)
    if user is None:
        user = User(
            eureka_user_id=principal.sub,
            email=_derive_email(principal),
            display_name=_derive_display_name(principal),
            last_seen_at=now,
        )
        session.add(user)
        await session.flush()
        # A brand new user has no assignments. Compute this without touching the
        # relationship on the freshly-flushed instance, which would try to lazy
        # load in an async context (MissingGreenlet).
        existing: set[str] = set()
    else:
        # Keep the mirror fresh when the token carries newer profile data.
        if principal.email and principal.email != user.email:
            user.email = principal.email
        if principal.display_name and principal.display_name != user.display_name:
            user.display_name = principal.display_name
        user.last_seen_at = now
        # The fetch above eager loaded assignments and their roles.
        existing = {ra.role.name for ra in user.role_assignments if ra.role is not None}

    # Reconcile roles. Add any missing role assignments named by the principal.
    for role_name in principal.roles:
        if role_name not in existing:
            role = await _get_or_create_role(session, role_name)
            session.add(RoleAssignment(user_id=user.id, role_id=role.id))

    await session.commit()

    # Reload with roles for a consistent response.
    stmt = (
        select(User)
        .where(User.id == user.id)
        .options(selectinload(User.role_assignments).selectinload(RoleAssignment.role))
    )
    user = (await session.execute(stmt)).scalar_one()

    return UserOut(
        id=str(user.id),
        eureka_user_id=user.eureka_user_id,
        email=user.email,
        display_name=user.display_name,
        roles=user.roles,
        tenant_id=str(user.tenant_id) if user.tenant_id else None,
        created_at=user.created_at,
    )
