"""
Centralized role helpers (P1.5).

Eight endpoint modules (community, engagement, graduate, gtm,
integrations, ops, marketplace, workforce) each defined their own
identical `_is_admin(user)` — `role in ("org_admin", "super_admin")` —
with two slightly different spellings (some via a local `_role()`
helper, some inline). Duplication like that is exactly where role
strings drift apart over time. This module is the single source of
truth; the endpoint modules now import from here.

Distinction from `app/utils/dependencies.py`:
  * dependencies.py provides ROUTE-LEVEL gates (`require_admin`,
    `require_role(...)`) used as FastAPI `Depends(...)` to reject a
    request before the handler runs.
  * this module provides IN-HANDLER predicates (`is_admin(user)`,
    `has_role(user, ...)`) for the common "owner OR admin" branching
    inside a handler that already has `current_user`.

Both ultimately compare against the same `UserRole` enum, so the role
strings can never diverge again.
"""

from __future__ import annotations

from typing import Iterable

from app.core.models import UserRole
from app.models import User

# The roles that count as "administrative" for in-handler ownership
# checks. Mirrors dependencies.require_admin = [SUPER_ADMIN, ORG_ADMIN].
ADMIN_ROLES = (UserRole.SUPER_ADMIN.value, UserRole.ORG_ADMIN.value)


def role_of(user: User) -> str:
    """Normalize a user's role to its string value.

    `user.role` may be a UserRole enum or a bare string depending on how
    the row was loaded; this collapses both to the string form and never
    raises on a None role.
    """
    role = getattr(user, "role", None)
    if role is None:
        return ""
    return role.value if hasattr(role, "value") else str(role)


def is_admin(user: User) -> bool:
    """True if the user holds an org-admin or super-admin role."""
    return role_of(user) in ADMIN_ROLES


def is_super_admin(user: User) -> bool:
    """True only for the platform super-admin."""
    return role_of(user) == UserRole.SUPER_ADMIN.value


def has_role(user: User, *roles: str | UserRole) -> bool:
    """True if the user's role matches any of the given roles.

    Accepts UserRole members or bare strings interchangeably.
    """
    wanted = {r.value if isinstance(r, UserRole) else str(r) for r in roles}
    return role_of(user) in wanted


def owns_or_admin(user: User, owner_id) -> bool:
    """Common pattern: the actor either owns the resource or is an admin.

    `owner_id` is the resource's owner user id (UUID or str). Compares
    stringified to tolerate UUID-vs-str mismatches.
    """
    return str(getattr(user, "id", "")) == str(owner_id) or is_admin(user)


__all__ = [
    "ADMIN_ROLES",
    "role_of",
    "is_admin",
    "is_super_admin",
    "has_role",
    "owns_or_admin",
]
