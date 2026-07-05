"""Dashboard routes.

Phase 0 returns an honest, empty dashboard: the signed-in user plus the module
map, where every teaching and assessment module is labeled by readiness. As
later phases land, modules flip from planned to available. Nothing here fakes
progress or mastery.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends
from shared_schemas.identity import DashboardSummary, ModuleInfo, UserOut, UserRef

from app.core.security import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


# The module map. status reflects the real Phase 0 state. This is the single
# place that declares what a student sees on the landing page.
_MODULES: list[ModuleInfo] = [
    ModuleInfo(
        key="learn",
        name="Learn",
        status="available",
        description="Guided lessons and concept steps per skill node.",
    ),
    ModuleInfo(
        key="practice",
        name="Practice",
        status="available",
        description="Adaptive, mastery-based practice with CAS-graded items.",
    ),
    ModuleInfo(
        key="assess",
        name="Assess",
        status="available",
        description="Teacher-authored assessments across selection and math item types.",
    ),
    ModuleInfo(
        key="remediate",
        name="Remediate",
        status="available",
        description="Prerequisite-aware next-step planning over the skill graph.",
    ),
    ModuleInfo(
        key="mastery",
        name="Mastery",
        status="available",
        description="Explainable mastery per skill with the evidence behind every change.",
    ),
    ModuleInfo(
        key="analytics",
        name="Analytics",
        status="planned",
        description="Standards heatmaps, growth reports, and exports. Phase 2.",
    ),
]


@router.get("/summary", response_model=DashboardSummary, summary="Landing dashboard")
async def dashboard_summary(user: UserOut = Depends(get_current_user)) -> DashboardSummary:
    return DashboardSummary(
        user=UserRef(
            id=user.id,
            email=user.email,
            display_name=user.display_name,
            roles=user.roles,
        ),
        modules=_MODULES,
        mastery_summary=None,
    )
