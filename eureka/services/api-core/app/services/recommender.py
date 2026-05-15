"""
Cross-tier recommendation service (Phase 4 Session 4.4, 2026-05).

Produces a ranked list of "what should this learner work on next" by
fusing five signals already in the platform:

  1. ACTIVE-TIER FIT     skills whose tier matches one of the learner's
                         active tier_enrollments. The cross-tier moat
                         shines here: a med student with a concurrent
                         test_prep enrolment for USMLE gets BOTH UG/med
                         AND USMLE-specific skills surfaced together.

  2. PREREQ READINESS    skills whose prerequisites the learner has
                         already mastered (≥ 0.7) — they're "unlocked".
                         Skills whose prereqs are weak are downweighted.

  3. MASTERY GAP         skills the learner has touched but not yet
                         mastered (0 < mastery < 0.85). These are the
                         "in-flight" skills that benefit most from
                         additional practice.

  4. GOAL ALIGNMENT      fuzzy substring match on learner_profile.goals
                         against skill.name + skill.code. Catches "USMLE
                         Step 1" → STEP1.* skills, "FE" → FE.* skills.

  5. SPACED-REPETITION   skills whose next_review_at is past-due get a
                         small boost (skill won't decay if practised now).

Each candidate skill gets a composite score in [0, 1]. The top-N are
returned with the per-signal breakdown so the frontend can show "why"
each item was recommended.

This is a deterministic rule-based scorer. Phase 6.4 will layer an LLM
rerank on top using natural-language reasoning over the same signals.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.learner import LearnerProfile, TierEnrollment, TierEnrollmentStatus
from app.models.skill import LearnerSkillMastery, Skill, SkillFramework, SkillPrerequisite
from app.models.user import User


# Map a test_prep / continuing_education tier_context to the underlying
# skill framework. Without this, an enrolment in test_prep for USMLE would
# never surface medical-tier USMLE skills as candidates.
_EXAM_TO_FRAMEWORK = {
    "USMLE_Step_1": SkillFramework.USMLE,
    "USMLE_Step_2": SkillFramework.USMLE,
    "USMLE_Step_3": SkillFramework.USMLE,
    "MCAT":         SkillFramework.MCAT,
    "MBE":          SkillFramework.MBE,
    "BAR":          SkillFramework.MBE,
    "CPA":          SkillFramework.CPA,
    "GRE":          SkillFramework.GRE,
    "LSAT":         SkillFramework.LSAT,
}
_LICENSE_TARGET_TO_FRAMEWORK = {
    "FE":  SkillFramework.FE_PE,
    "PE":  SkillFramework.FE_PE,
}


MASTERY_THRESHOLD = 0.85
PREREQ_READY_THRESHOLD = 0.70


@dataclass
class RecommendationReason:
    """Human-readable explanation for one recommended skill."""

    active_tier_fit: float = 0.0
    prereq_readiness: float = 0.0
    mastery_gap: float = 0.0
    goal_alignment: float = 0.0
    spaced_repetition: float = 0.0
    notes: list[str] = field(default_factory=list)

    @property
    def total(self) -> float:
        return (
            0.25 * self.active_tier_fit
            + 0.25 * self.prereq_readiness
            + 0.20 * self.mastery_gap
            + 0.20 * self.goal_alignment
            + 0.10 * self.spaced_repetition
        )


@dataclass
class Recommendation:
    skill: Skill
    score: float
    reason: RecommendationReason

    def to_dict(self) -> dict[str, Any]:
        return {
            "skill_id": str(self.skill.id),
            "framework": self.skill.framework.value if hasattr(self.skill.framework, "value") else self.skill.framework,
            "code": self.skill.code,
            "name": self.skill.name,
            "tier": self.skill.tier,
            "bloom_level": (
                self.skill.bloom_level.value
                if (self.skill.bloom_level and hasattr(self.skill.bloom_level, "value"))
                else self.skill.bloom_level
            ),
            "score": round(self.score, 4),
            "reason": {
                "active_tier_fit": round(self.reason.active_tier_fit, 3),
                "prereq_readiness": round(self.reason.prereq_readiness, 3),
                "mastery_gap": round(self.reason.mastery_gap, 3),
                "goal_alignment": round(self.reason.goal_alignment, 3),
                "spaced_repetition": round(self.reason.spaced_repetition, 3),
                "notes": self.reason.notes,
            },
        }


# ---------------------------------------------------------------------------


async def _load_context(db: AsyncSession, user: User) -> dict[str, Any]:
    """Pull every signal in a few queries instead of N round-trips."""
    prof_q = await db.execute(
        select(LearnerProfile).where(LearnerProfile.user_id == user.id)
    )
    profile = prof_q.scalar_one_or_none()

    te_q = await db.execute(
        select(TierEnrollment)
        .where(
            TierEnrollment.user_id == user.id,
            TierEnrollment.status.in_(
                [TierEnrollmentStatus.ACTIVE, TierEnrollmentStatus.PENDING]
            ),
            TierEnrollment.deleted_at.is_(None),
        )
    )
    enrollments = list(te_q.scalars().all())

    lsm_q = await db.execute(
        select(LearnerSkillMastery).where(LearnerSkillMastery.user_id == user.id)
    )
    mastery_rows = list(lsm_q.scalars().all())
    mastery_by_skill = {str(m.skill_id): float(m.mastery) for m in mastery_rows}
    next_review_by_skill = {
        str(m.skill_id): m.next_review_at for m in mastery_rows if m.next_review_at
    }

    # Derive interesting frameworks from tier_context (exam / license_target).
    # An enrolment in test_prep with exam=USMLE_Step_1 should bring USMLE
    # skills into the candidate pool, even though those skills live in
    # tier=medical, not tier=test_prep.
    derived_frameworks: set[SkillFramework] = set()
    for e in enrollments:
        ctx = e.tier_context or {}
        exam = ctx.get("exam")
        if exam in _EXAM_TO_FRAMEWORK:
            derived_frameworks.add(_EXAM_TO_FRAMEWORK[exam])
        target = ctx.get("license_target")
        if target in _LICENSE_TARGET_TO_FRAMEWORK:
            derived_frameworks.add(_LICENSE_TARGET_TO_FRAMEWORK[target])

    return {
        "profile": profile,
        "enrollments": enrollments,
        "mastery_by_skill": mastery_by_skill,
        "next_review_by_skill": next_review_by_skill,
        "goals": (profile.goals if profile else []) or [],
        "active_tiers": {
            (e.tier.value if hasattr(e.tier, "value") else e.tier)
            for e in enrollments
        },
        "derived_frameworks": derived_frameworks,
        "tier_contexts": [e.tier_context for e in enrollments],
    }


async def _candidate_skills(
    db: AsyncSession,
    active_tiers: set[str],
    derived_frameworks: set[SkillFramework],
) -> list[Skill]:
    """
    Pull the skill pool to score. Includes skills whose tier matches the
    learner's enrolments OR whose framework was derived from an
    enrolment's exam/license_target. For learners with nothing active,
    fall back to high_school + undergraduate.
    """
    if not active_tiers and not derived_frameworks:
        active_tiers = {"high_school", "undergraduate"}
    conditions = [Skill.is_active.is_(True)]
    or_clauses = []
    if active_tiers:
        or_clauses.append(Skill.tier.in_(active_tiers))
    if derived_frameworks:
        or_clauses.append(Skill.framework.in_(derived_frameworks))
    if len(or_clauses) == 1:
        conditions.append(or_clauses[0])
    elif len(or_clauses) > 1:
        from sqlalchemy import or_
        conditions.append(or_(*or_clauses))
    r = await db.execute(select(Skill).where(and_(*conditions)))
    return list(r.scalars().all())


async def _prereqs_for(
    db: AsyncSession, skill_ids: list[str]
) -> dict[str, list[tuple[str, float]]]:
    """Returns {successor_id: [(prerequisite_id, strength), ...]}."""
    if not skill_ids:
        return {}
    r = await db.execute(
        select(SkillPrerequisite).where(
            SkillPrerequisite.successor_id.in_(skill_ids)
        )
    )
    out: dict[str, list[tuple[str, float]]] = {}
    for sp in r.scalars().all():
        out.setdefault(str(sp.successor_id), []).append(
            (str(sp.prerequisite_id), float(sp.strength))
        )
    return out


def _goal_alignment_score(skill: Skill, goals: list[str]) -> tuple[float, str | None]:
    """
    Substring match: any goal whose lowercase form appears in the skill's
    name or code earns a hit. Returns (score, matched_goal_or_None).

    The full-keyword set is small for now — Phase 6.4 will replace this
    with semantic similarity over goal embeddings.
    """
    if not goals:
        return 0.0, None
    haystack = f"{skill.name} {skill.code}".lower()
    best_match = None
    best_score = 0.0
    for g in goals:
        g_low = g.lower()
        # Direct substring → 1.0; one token match → 0.5
        if g_low in haystack:
            return 1.0, g
        tokens = [t for t in g_low.replace("-", " ").split() if len(t) >= 3]
        hit = sum(1 for t in tokens if t in haystack)
        if tokens and hit / len(tokens) >= 0.5 and (hit / len(tokens)) > best_score:
            best_score = hit / len(tokens)
            best_match = g
    return best_score, best_match


def _prereq_readiness_score(
    skill_id: str,
    prereqs: dict[str, list[tuple[str, float]]],
    mastery_by_skill: dict[str, float],
) -> tuple[float, int]:
    """
    Average prerequisite mastery weighted by edge strength. Returns
    (score in [0, 1], count_of_prereqs).
    """
    edges = prereqs.get(skill_id, [])
    if not edges:
        return 1.0, 0  # no prereqs ⇒ ready
    total_weight = sum(strength for _, strength in edges)
    score = sum(
        mastery_by_skill.get(pre_id, 0.0) * strength for pre_id, strength in edges
    ) / max(total_weight, 0.001)
    return score, len(edges)


async def recommend(
    db: AsyncSession, user: User, limit: int = 10
) -> list[Recommendation]:
    ctx = await _load_context(db, user)
    candidates = await _candidate_skills(
        db, ctx["active_tiers"], ctx["derived_frameworks"]
    )

    if not candidates:
        return []

    candidate_ids = [str(s.id) for s in candidates]
    prereqs = await _prereqs_for(db, candidate_ids)
    now = datetime.utcnow()

    scored: list[Recommendation] = []
    for skill in candidates:
        skill_id = str(skill.id)
        current_mastery = ctx["mastery_by_skill"].get(skill_id, 0.0)
        if current_mastery >= MASTERY_THRESHOLD:
            # Already mastered — don't recommend.
            continue

        reason = RecommendationReason()

        # 1. Active-tier fit. 1.0 for a direct tier match; 0.9 for a
        # framework match derived from a test_prep / license_target
        # enrolment; 0.5 for any other tier we still chose to consider.
        sk_framework = (
            skill.framework.value if hasattr(skill.framework, "value") else skill.framework
        )
        derived_fw_values = {
            (f.value if hasattr(f, "value") else f) for f in ctx["derived_frameworks"]
        }
        if skill.tier in ctx["active_tiers"]:
            reason.active_tier_fit = 1.0
            reason.notes.append(f"matches your active {skill.tier} enrolment")
        elif sk_framework in derived_fw_values:
            reason.active_tier_fit = 0.9
            reason.notes.append(
                f"covers a {sk_framework.upper()} exam you're prepping for"
            )
        else:
            reason.active_tier_fit = 0.5

        # 2. Prereq readiness
        readiness, n_pre = _prereq_readiness_score(skill_id, prereqs, ctx["mastery_by_skill"])
        reason.prereq_readiness = readiness
        if n_pre > 0 and readiness >= PREREQ_READY_THRESHOLD:
            reason.notes.append(f"{n_pre} prerequisite(s) at sufficient mastery")
        elif n_pre > 0:
            reason.notes.append(f"prerequisites at {int(readiness * 100)}% mastery; expect challenge")

        # 3. Mastery gap — peak around 0.4 (in-flight, not mastered)
        # Quadratic bump: gap = 4 * m * (1 - m) — max 1.0 at m=0.5, 0 at extremes.
        reason.mastery_gap = 4.0 * current_mastery * (1.0 - current_mastery)
        if current_mastery > 0:
            reason.notes.append(f"in flight (current mastery {int(current_mastery * 100)}%)")

        # 4. Goal alignment
        goal_score, matched_goal = _goal_alignment_score(skill, ctx["goals"])
        reason.goal_alignment = goal_score
        if matched_goal:
            reason.notes.append(f"matches your goal “{matched_goal}”")

        # 5. Spaced repetition — past-due review of an attempted skill
        nr = ctx["next_review_by_skill"].get(skill_id)
        if nr is not None and nr <= now:
            reason.spaced_repetition = 1.0
            reason.notes.append("review is past-due; practice now to prevent decay")
        else:
            reason.spaced_repetition = 0.0

        scored.append(Recommendation(skill=skill, score=reason.total, reason=reason))

    scored.sort(key=lambda r: r.score, reverse=True)
    return scored[:limit]
