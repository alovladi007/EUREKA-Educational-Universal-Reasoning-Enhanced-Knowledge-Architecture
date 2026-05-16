"""
Per-learner analytics — Phase 7 Session 7.3 (2026-05).

Computes the UWorld-grade dashboard from attempt_logs + content_skills
+ learner_skill_mastery. Aggregates are computed at read time; for the
~thousands-of-attempts-per-user scale this is fine. When the data grows
we precompute into a materialized view (Phase 11 ops work).

What we return:

  per-skill aggregate
    skill_id, name, attempts, correct_pct, p50/p90 time_taken_ms,
    last_attempt_at, mastery (from learner_skill_mastery).

  strength/weakness map
    skills bucketed into mastery quintiles. Surfaces the top 5
    strongest and 5 weakest at a glance.

  most-missed by passers   (the UWorld killer feature)
    Given a blueprint, find learners who PASSED that blueprint, and
    rank skills by their collective miss rate. Tells the current
    learner "the skills people who passed got wrong most often — drill
    these to maximise marginal pass probability."
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Any
from uuid import UUID

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


@dataclass
class SkillAggregate:
    skill_id: UUID
    framework: str
    code: str
    name: str
    attempts: int
    correct: int
    correct_pct: float
    median_time_ms: int | None
    p90_time_ms: int | None
    last_attempt_at: datetime | None
    mastery: float | None

    def to_dict(self) -> dict[str, Any]:
        return {
            "skill_id": str(self.skill_id),
            "framework": self.framework,
            "code": self.code,
            "name": self.name,
            "attempts": self.attempts,
            "correct": self.correct,
            "correct_pct": round(self.correct_pct, 1),
            "median_time_ms": self.median_time_ms,
            "p90_time_ms": self.p90_time_ms,
            "last_attempt_at": self.last_attempt_at.isoformat() + "Z" if self.last_attempt_at else None,
            "mastery": round(self.mastery, 3) if self.mastery is not None else None,
        }


async def per_skill(db: AsyncSession, user_id: UUID) -> list[SkillAggregate]:
    """
    Per-skill aggregates for one learner. Joins attempt_logs ↔ content_skills
    ↔ skills ↔ learner_skill_mastery in one query.
    """
    sql = """
    SELECT
        s.id AS skill_id,
        s.framework::text AS framework,
        s.code AS code,
        s.name AS name,
        COUNT(*) AS attempts,
        SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END) AS correct,
        MAX(a.created_at) AS last_attempt_at,
        percentile_cont(0.5) WITHIN GROUP (ORDER BY a.time_taken_ms) AS median_time,
        percentile_cont(0.9) WITHIN GROUP (ORDER BY a.time_taken_ms) AS p90_time,
        MAX(lsm.mastery) AS mastery
    FROM attempt_logs a
    JOIN content_skills cs
        ON cs.content_kind = 'question' AND cs.content_id = a.item_id
    JOIN skills s ON s.id = cs.skill_id
    LEFT JOIN learner_skill_mastery lsm
        ON lsm.user_id = a.user_id AND lsm.skill_id = s.id
    WHERE a.user_id = :uid
    GROUP BY s.id, s.framework, s.code, s.name
    ORDER BY attempts DESC
    """
    r = await db.execute(text(sql), {"uid": str(user_id)})
    out = []
    for row in r.mappings():
        attempts = int(row["attempts"])
        correct = int(row["correct"] or 0)
        out.append(
            SkillAggregate(
                skill_id=row["skill_id"],
                framework=row["framework"],
                code=row["code"],
                name=row["name"],
                attempts=attempts,
                correct=correct,
                correct_pct=(correct / attempts * 100.0) if attempts else 0,
                median_time_ms=int(row["median_time"]) if row["median_time"] is not None else None,
                p90_time_ms=int(row["p90_time"]) if row["p90_time"] is not None else None,
                last_attempt_at=row["last_attempt_at"],
                mastery=float(row["mastery"]) if row["mastery"] is not None else None,
            )
        )
    return out


@dataclass
class StrengthsWeaknesses:
    strongest: list[SkillAggregate] = field(default_factory=list)
    weakest: list[SkillAggregate] = field(default_factory=list)


async def strengths_weaknesses(
    db: AsyncSession, user_id: UUID, k: int = 5, min_attempts: int = 3
) -> StrengthsWeaknesses:
    """
    Bucket per-skill aggregates and return top-k strongest + weakest.
    Skills with < min_attempts excluded — small samples are noisy.
    Strongest ranked by correct_pct desc; weakest by correct_pct asc.
    """
    skills = [s for s in await per_skill(db, user_id) if s.attempts >= min_attempts]
    skills_sorted = sorted(skills, key=lambda s: s.correct_pct, reverse=True)
    return StrengthsWeaknesses(
        strongest=skills_sorted[:k],
        weakest=list(reversed(skills_sorted[-k:])) if len(skills_sorted) >= k else [],
    )


@dataclass
class MissedByPassersEntry:
    skill_id: UUID
    framework: str
    code: str
    name: str
    miss_rate_by_passers: float
    your_miss_rate: float | None
    your_attempts: int
    n_passers_sampled: int


async def most_missed_by_passers(
    db: AsyncSession,
    *,
    blueprint_id: UUID,
    learner_user_id: UUID,
    k: int = 10,
) -> list[MissedByPassersEntry]:
    """
    The UWorld killer feature.

    1. Find every learner who took a mock_attempts row of this blueprint
       and predicted_pass=true.
    2. For each skill, compute the miss rate across those learners' attempts
       on items tagged into that skill (in the blueprint's window).
    3. Rank by miss rate. Optionally augment each row with the CURRENT
       learner's own miss rate so the UI can show "you miss this 40%,
       passers miss it 25% — small gap, prioritise lower."

    Returns top-k rows.
    """
    sql = """
    WITH passers AS (
        SELECT DISTINCT user_id
        FROM mock_attempts
        WHERE blueprint_id = :bp_id
          AND predicted_pass = TRUE
          AND status = 'submitted'
    ),
    passer_skill_attempts AS (
        SELECT
            s.id AS skill_id,
            s.framework::text AS framework,
            s.code AS code,
            s.name AS name,
            COUNT(*) AS attempts,
            SUM(CASE WHEN a.is_correct THEN 0 ELSE 1 END) AS misses,
            COUNT(DISTINCT a.user_id) AS distinct_passers
        FROM passers p
        JOIN attempt_logs a ON a.user_id = p.user_id
        JOIN content_skills cs
            ON cs.content_kind = 'question' AND cs.content_id = a.item_id
        JOIN skills s ON s.id = cs.skill_id
        GROUP BY s.id, s.framework, s.code, s.name
    ),
    my_skill_attempts AS (
        SELECT
            cs.skill_id,
            COUNT(*) AS attempts,
            SUM(CASE WHEN a.is_correct THEN 0 ELSE 1 END) AS misses
        FROM attempt_logs a
        JOIN content_skills cs
            ON cs.content_kind = 'question' AND cs.content_id = a.item_id
        WHERE a.user_id = :me
        GROUP BY cs.skill_id
    )
    SELECT
        p.skill_id, p.framework, p.code, p.name,
        (p.misses::float / NULLIF(p.attempts, 0)) AS passer_miss_rate,
        p.distinct_passers,
        m.attempts AS my_attempts,
        (m.misses::float / NULLIF(m.attempts, 0)) AS my_miss_rate
    FROM passer_skill_attempts p
    LEFT JOIN my_skill_attempts m ON m.skill_id = p.skill_id
    WHERE p.attempts >= 3
    ORDER BY p.misses::float / p.attempts DESC
    LIMIT :k
    """
    r = await db.execute(
        text(sql),
        {"bp_id": str(blueprint_id), "me": str(learner_user_id), "k": k},
    )
    out: list[MissedByPassersEntry] = []
    for row in r.mappings():
        out.append(
            MissedByPassersEntry(
                skill_id=row["skill_id"],
                framework=row["framework"],
                code=row["code"],
                name=row["name"],
                miss_rate_by_passers=float(row["passer_miss_rate"] or 0),
                your_miss_rate=float(row["my_miss_rate"]) if row["my_miss_rate"] is not None else None,
                your_attempts=int(row["my_attempts"] or 0),
                n_passers_sampled=int(row["distinct_passers"]),
            )
        )
    return out


# ---------------------------------------------------------------------------
# Spaced repetition (7.5) — FSRS-lite
#
# We don't import the full FSRS-4 model (it has 17 parameters and needs
# its own training corpus). Instead we use the simpler 4-card-state model
# behind it: Again / Hard / Good / Easy with multiplicative interval
# updates. Cheap to compute, easy to reason about, good enough for v1.
# ---------------------------------------------------------------------------

_FSRS_LITE = {
    # rating: (next_interval_multiplier, mastery_delta)
    "again": (0.5, -0.15),
    "hard":  (1.2,  0.0),
    "good":  (2.5,  0.05),
    "easy":  (4.0,  0.10),
}


def fsrs_next_review(
    *,
    current_interval_days: float,
    rating: str,
) -> tuple[float, float]:
    """
    Returns (new_interval_days, mastery_delta).
    First-ever attempt: pass current_interval_days=0.5 (12 hours).
    """
    mult, mastery_delta = _FSRS_LITE.get(rating, (1.0, 0.0))
    base = max(current_interval_days, 0.5)
    return base * mult, mastery_delta


async def due_today(db: AsyncSession, user_id: UUID, limit: int = 50) -> list[dict]:
    """
    Return items whose next_review_at on learner_skill_mastery (proxy for
    "this skill is due") has passed. Picks one representative item per
    due skill so the learner gets variety.
    """
    sql = """
    WITH due_skills AS (
        SELECT skill_id, mastery, last_practiced_at
        FROM learner_skill_mastery
        WHERE user_id = :uid
          AND (next_review_at IS NOT NULL AND next_review_at <= NOW())
        ORDER BY next_review_at
        LIMIT :limit
    )
    SELECT
        d.skill_id,
        s.name AS skill_name,
        s.framework::text AS framework,
        s.code,
        d.mastery,
        d.last_practiced_at,
        (
            SELECT cs.content_id
            FROM content_skills cs
            JOIN items i ON i.id = cs.content_id AND i.deleted_at IS NULL
            WHERE cs.skill_id = d.skill_id
              AND cs.content_kind = 'question'
            LIMIT 1
        ) AS item_id
    FROM due_skills d
    JOIN skills s ON s.id = d.skill_id
    """
    r = await db.execute(text(sql), {"uid": str(user_id), "limit": limit})
    return [
        {
            "skill_id": str(row["skill_id"]),
            "skill_name": row["skill_name"],
            "framework": row["framework"],
            "code": row["code"],
            "mastery": float(row["mastery"]) if row["mastery"] is not None else None,
            "last_practiced_at": row["last_practiced_at"].isoformat() + "Z" if row["last_practiced_at"] else None,
            "item_id": str(row["item_id"]) if row["item_id"] else None,
        }
        for row in r.mappings()
    ]


async def schedule_next_review(
    db: AsyncSession,
    *,
    user_id: UUID,
    skill_id: UUID,
    rating: str,
) -> dict:
    """
    Update learner_skill_mastery.next_review_at + mastery for a skill,
    given a learner-reported rating. Returns the new schedule.
    """
    from datetime import timezone
    cur_r = await db.execute(
        text(
            """
            SELECT
                COALESCE(
                    EXTRACT(EPOCH FROM (next_review_at - COALESCE(last_practiced_at, NOW())))/86400,
                    0.5
                ) AS interval_days,
                mastery
            FROM learner_skill_mastery
            WHERE user_id = :uid AND skill_id = :sid
            """
        ),
        {"uid": str(user_id), "sid": str(skill_id)},
    )
    row = cur_r.first()
    interval = float(row[0]) if row and row[0] else 0.5
    current_mastery = float(row[1]) if row and row[1] is not None else 0.0
    new_interval, mastery_delta = fsrs_next_review(
        current_interval_days=interval, rating=rating
    )
    new_mastery = max(0.0, min(1.0, current_mastery + mastery_delta))
    next_review_at = datetime.utcnow() + timedelta(days=new_interval)

    await db.execute(
        text(
            """
            INSERT INTO learner_skill_mastery
                (user_id, skill_id, mastery, attempts, last_practiced_at, next_review_at)
            VALUES
                (:uid, :sid, :m, 1, :now, :nr)
            ON CONFLICT (user_id, skill_id) DO UPDATE SET
                mastery = EXCLUDED.mastery,
                attempts = learner_skill_mastery.attempts + 1,
                last_practiced_at = EXCLUDED.last_practiced_at,
                next_review_at = EXCLUDED.next_review_at,
                updated_at = NOW()
            """
        ),
        {
            "uid": str(user_id),
            "sid": str(skill_id),
            "m": new_mastery,
            "now": datetime.utcnow(),
            "nr": next_review_at,
        },
    )
    return {
        "new_interval_days": round(new_interval, 2),
        "mastery_delta": round(mastery_delta, 3),
        "new_mastery": round(new_mastery, 3),
        "next_review_at": next_review_at.isoformat() + "Z",
    }
