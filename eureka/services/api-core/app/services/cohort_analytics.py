"""
Cohort analytics + at-risk early-warning (Phase 9 Session 9.3, 2026-05).

The B2B value prop. Admins / instructors look at a cohort and see:
  - aggregate mastery on each target skill (mean ± stdev)
  - per-learner score on the cohort's target blueprints (avg + best)
  - engagement: attempts in last 7d, sessions in last 7d
  - at-risk roster: who's behind and why

The at-risk score is intentionally simple + explainable. Real
institutions don't trust opaque ML risk scores; they trust a checklist.
We compute four sub-scores in [0, 1] (1 = healthy) and combine.

  S_mastery      = mean(target_mastery_hits) / target_count
                   Did they hit threshold on their target skills?
  S_engagement   = min(1, attempts_last_7d / min_weekly_attempts)
                   Are they showing up?
  S_trajectory   = clamp((mastery_now - mastery_2w_ago + 0.05) / 0.20, 0, 1)
                   Is the mastery TREND upward?
  S_mock         = clamp(predicted_pass_prob, 0, 1) on most recent mock
                   How would they do on the exam today?

  combined = 0.35*mastery + 0.20*engagement + 0.20*trajectory + 0.25*mock
  at_risk  = combined < 0.5

Each output row carries the per-signal scores so the UI / admin can
explain "Why is this learner flagged?"
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Any
from uuid import UUID

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.exam import MockAttempt, MockAttemptStatus
from app.models.institutional import (
    Cohort, CohortBlueprint, CohortMembership, CohortRole,
)


@dataclass
class CohortAggregate:
    cohort_id: UUID
    name: str
    org_id: UUID
    n_learners: int
    n_active_learners_7d: int
    target_skill_codes: list[str]
    target_mastery_threshold: float
    per_skill: list[dict]
    mocks_summary: dict
    attempts_total: int
    attempts_last_7d: int


@dataclass
class LearnerRisk:
    user_id: UUID
    email: str | None
    display_name: str | None
    score_mastery: float
    score_engagement: float
    score_trajectory: float
    score_mock: float
    combined: float
    at_risk: bool
    notes: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return {
            "user_id": str(self.user_id),
            "email": self.email,
            "display_name": self.display_name,
            "score_mastery": round(self.score_mastery, 3),
            "score_engagement": round(self.score_engagement, 3),
            "score_trajectory": round(self.score_trajectory, 3),
            "score_mock": round(self.score_mock, 3),
            "combined": round(self.combined, 3),
            "at_risk": self.at_risk,
            "notes": self.notes,
        }


# ---------------------------------------------------------------------------


async def _active_learner_ids(db: AsyncSession, cohort_id: UUID) -> list[UUID]:
    r = await db.execute(
        select(CohortMembership.user_id).where(
            CohortMembership.cohort_id == cohort_id,
            CohortMembership.left_at.is_(None),
            CohortMembership.role == CohortRole.LEARNER,
        )
    )
    return [row[0] for row in r.fetchall()]


async def aggregate(db: AsyncSession, cohort_id: UUID) -> CohortAggregate:
    cohort = await db.get(Cohort, cohort_id)
    if cohort is None:
        raise ValueError("cohort not found")

    learner_ids = await _active_learner_ids(db, cohort_id)
    n_learners = len(learner_ids)
    if n_learners == 0:
        return CohortAggregate(
            cohort_id=cohort_id, name=cohort.name, org_id=cohort.org_id,
            n_learners=0, n_active_learners_7d=0,
            target_skill_codes=list(cohort.target_skill_codes or []),
            target_mastery_threshold=float(cohort.target_mastery),
            per_skill=[], mocks_summary={},
            attempts_total=0, attempts_last_7d=0,
        )

    # Per-skill aggregate: for each target skill_code, mean mastery
    # + how many learners are at / above threshold.
    per_skill: list[dict] = []
    threshold = float(cohort.target_mastery)
    for code in (cohort.target_skill_codes or []):
        r = await db.execute(
            text(
                """
                SELECT
                    COUNT(lsm.user_id) AS n,
                    AVG(lsm.mastery)::float AS mean_mastery,
                    SUM(CASE WHEN lsm.mastery >= :thr THEN 1 ELSE 0 END) AS at_threshold
                FROM learner_skill_mastery lsm
                JOIN skills s ON s.id = lsm.skill_id
                WHERE s.code = :code AND lsm.user_id = ANY(:users)
                """
            ),
            {"thr": threshold, "code": code, "users": [str(u) for u in learner_ids]},
        )
        row = r.mappings().one()
        per_skill.append({
            "code": code,
            "n_with_attempts": int(row["n"] or 0),
            "mean_mastery": round(float(row["mean_mastery"] or 0), 3),
            "at_threshold_count": int(row["at_threshold"] or 0),
            "at_threshold_pct": (
                round(float(row["at_threshold"] or 0) / n_learners * 100, 1)
                if n_learners else 0
            ),
        })

    # Engagement: attempts in last 7 days
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    r = await db.execute(
        text(
            """
            SELECT COUNT(*) AS total,
                   COUNT(*) FILTER (WHERE created_at >= :seven) AS last7,
                   COUNT(DISTINCT user_id) FILTER (WHERE created_at >= :seven) AS active7
            FROM attempt_logs
            WHERE user_id = ANY(:users)
            """
        ),
        {"users": [str(u) for u in learner_ids], "seven": seven_days_ago},
    )
    row = r.mappings().one()
    attempts_total = int(row["total"] or 0)
    attempts_last_7d = int(row["last7"] or 0)
    n_active_learners_7d = int(row["active7"] or 0)

    # Mocks summary: latest submitted mock per learner on each cohort blueprint
    bp_r = await db.execute(
        select(CohortBlueprint).where(CohortBlueprint.cohort_id == cohort_id)
    )
    bp_rows = list(bp_r.scalars().all())
    mocks_summary: dict = {"per_blueprint": []}
    for cb in bp_rows:
        mr = await db.execute(
            text(
                """
                SELECT
                    AVG(scaled_score)::float AS mean_scaled,
                    AVG(pass_probability)::float AS mean_pp,
                    COUNT(*) FILTER (WHERE predicted_pass) AS n_predicted_pass,
                    COUNT(*) AS n_total
                FROM mock_attempts
                WHERE blueprint_id = :bp AND user_id = ANY(:users)
                  AND status = 'submitted'
                """
            ),
            {"bp": str(cb.blueprint_id), "users": [str(u) for u in learner_ids]},
        )
        row = mr.mappings().one()
        if int(row["n_total"] or 0) > 0:
            mocks_summary["per_blueprint"].append({
                "blueprint_id": str(cb.blueprint_id),
                "mean_scaled_score": round(float(row["mean_scaled"] or 0), 1),
                "mean_pass_probability": round(float(row["mean_pp"] or 0), 3),
                "n_predicted_pass": int(row["n_predicted_pass"] or 0),
                "n_total": int(row["n_total"] or 0),
            })

    return CohortAggregate(
        cohort_id=cohort_id, name=cohort.name, org_id=cohort.org_id,
        n_learners=n_learners,
        n_active_learners_7d=n_active_learners_7d,
        target_skill_codes=list(cohort.target_skill_codes or []),
        target_mastery_threshold=threshold,
        per_skill=per_skill,
        mocks_summary=mocks_summary,
        attempts_total=attempts_total,
        attempts_last_7d=attempts_last_7d,
    )


async def at_risk(db: AsyncSession, cohort_id: UUID) -> list[LearnerRisk]:
    cohort = await db.get(Cohort, cohort_id)
    if cohort is None:
        raise ValueError("cohort not found")

    learner_ids = await _active_learner_ids(db, cohort_id)
    if not learner_ids:
        return []

    target_codes = list(cohort.target_skill_codes or [])
    threshold = float(cohort.target_mastery)
    min_weekly = int(cohort.min_weekly_attempts or 0)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    two_weeks_ago = datetime.utcnow() - timedelta(days=14)

    # Per-learner mastery on target skills (now + 2w ago for trajectory)
    sql_mastery = """
    SELECT
        lsm.user_id,
        s.code,
        lsm.mastery,
        lsm.last_practiced_at
    FROM learner_skill_mastery lsm
    JOIN skills s ON s.id = lsm.skill_id
    WHERE s.code = ANY(:codes) AND lsm.user_id = ANY(:users)
    """
    mastery_now: dict[str, dict[str, float]] = {}
    mast_r = await db.execute(
        text(sql_mastery),
        {"codes": target_codes, "users": [str(u) for u in learner_ids]},
    )
    for row in mast_r.mappings():
        mastery_now.setdefault(str(row["user_id"]), {})[row["code"]] = float(row["mastery"])

    # Trajectory proxy: count of attempts in last 7d vs prior 7d as a simple signal
    sql_traj = """
    SELECT user_id,
           COUNT(*) FILTER (WHERE created_at >= :seven) AS recent,
           COUNT(*) FILTER (WHERE created_at < :seven AND created_at >= :fourteen) AS prior
    FROM attempt_logs
    WHERE user_id = ANY(:users)
    GROUP BY user_id
    """
    traj_r = await db.execute(
        text(sql_traj),
        {"users": [str(u) for u in learner_ids],
         "seven": seven_days_ago, "fourteen": two_weeks_ago},
    )
    traj_by_user = {str(row["user_id"]): (int(row["recent"]), int(row["prior"])) for row in traj_r.mappings()}

    # Latest mock per learner — use the best across cohort blueprints
    bp_r = await db.execute(
        select(CohortBlueprint).where(CohortBlueprint.cohort_id == cohort_id)
    )
    bp_ids = [str(cb.blueprint_id) for cb in bp_r.scalars().all()]
    mock_pp_by_user: dict[str, float] = {}
    if bp_ids:
        mock_r = await db.execute(
            text(
                """
                SELECT user_id, MAX(pass_probability)::float AS best_pp
                FROM mock_attempts
                WHERE user_id = ANY(:users)
                  AND blueprint_id = ANY(:bps)
                  AND status = 'submitted'
                GROUP BY user_id
                """
            ),
            {"users": [str(u) for u in learner_ids], "bps": bp_ids},
        )
        mock_pp_by_user = {str(row["user_id"]): float(row["best_pp"] or 0) for row in mock_r.mappings()}

    # Display names from users
    name_r = await db.execute(
        text(
            """
            SELECT id, email, COALESCE(display_name, first_name || ' ' || last_name) AS display_name
            FROM users WHERE id = ANY(:users)
            """
        ),
        {"users": [str(u) for u in learner_ids]},
    )
    user_meta = {str(row[0]): (row[1], row[2]) for row in name_r.fetchall()}

    out: list[LearnerRisk] = []
    for uid in learner_ids:
        uid_s = str(uid)
        # S_mastery: fraction of target skills at or above threshold
        n_target = max(1, len(target_codes))
        per_code = mastery_now.get(uid_s, {})
        hits = sum(1 for c in target_codes if per_code.get(c, 0) >= threshold)
        s_mastery = hits / n_target

        # S_engagement
        recent, prior = traj_by_user.get(uid_s, (0, 0))
        s_engagement = min(1.0, recent / max(1, min_weekly)) if min_weekly > 0 else (1.0 if recent > 0 else 0.0)

        # S_trajectory: change in attempts (proxy until we have time-series mastery)
        if prior == 0 and recent == 0:
            s_trajectory = 0.0
        else:
            change = (recent - prior) / max(1, prior)
            s_trajectory = min(1.0, max(0.0, (change + 0.5) / 1.0))

        # S_mock
        s_mock = mock_pp_by_user.get(uid_s, 0.0)

        combined = (
            0.35 * s_mastery
            + 0.20 * s_engagement
            + 0.20 * s_trajectory
            + 0.25 * s_mock
        )
        notes: list[str] = []
        if s_mastery < 0.5:
            notes.append(f"only {hits}/{n_target} target skills at threshold ({threshold})")
        if min_weekly > 0 and recent < min_weekly:
            notes.append(f"{recent} attempts last 7d (target: {min_weekly})")
        if s_mock and s_mock < 0.5:
            notes.append(f"latest mock pass probability {s_mock:.2f}")
        if recent == 0 and prior > 0:
            notes.append("no activity in the last 7 days")

        email, display_name = user_meta.get(uid_s, (None, None))
        out.append(
            LearnerRisk(
                user_id=uid, email=email, display_name=display_name,
                score_mastery=s_mastery, score_engagement=s_engagement,
                score_trajectory=s_trajectory, score_mock=s_mock,
                combined=combined, at_risk=(combined < 0.5),
                notes=notes,
            )
        )
    out.sort(key=lambda r: r.combined)
    return out
