"""Shared Pydantic v2 schemas used across AXIOM services.

These models are the single source of truth for wire shapes. Services import
them so the API contract stays consistent between the gateway, the workers,
and the frontend types that mirror them.
"""

from shared_schemas.identity import (
    DashboardSummary,
    HealthOut,
    ModuleInfo,
    Principal,
    RoleName,
    UserOut,
    UserRef,
)

__all__ = [
    "DashboardSummary",
    "HealthOut",
    "ModuleInfo",
    "Principal",
    "RoleName",
    "UserOut",
    "UserRef",
]
