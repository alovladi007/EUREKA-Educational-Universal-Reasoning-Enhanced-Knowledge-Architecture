"""
Skill Passport — EUREKA's L&D differentiator (2026-07).

Every other corporate learning platform reports *completion* ("finished the
course"). EUREKA can report *demonstrated competence that stays fresh*:

  - mastery  : learner_skill_mastery.mastery  (0..1, from the BKT/IRT model)
  - verified : that mastery was actually demonstrated on a graded assessment,
               with a real timestamp (last_practiced_at)
  - freshness: how much of the spaced-repetition review interval is left before
               the competency lapses. Driven by the SRS scheduler's OWN
               next_review_at — NOT an invented decay curve.

The org-facing question this answers, which no completion-based LMS can:
  "Who on my workforce can demonstrate skill X *right now*, and whose proof is
   about to lapse?"

Two endpoints, both org-scoped + admin-gated, single-query (no N+1):
  GET /institutions/passport                roster: one row per active seat
  GET /institutions/passport/export.csv     same roster as CSV
  GET /institutions/passport/{user_id}      one worker's full skill passport

Everything is real data. When a worker has no graded mastery yet, we say so
("unverified") rather than inventing a number.
"""

from __future__ import annotations

import csv
import io
from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.skill import LearnerSkillMastery, Skill
from app.models.user import User
from app.models.workforce import InstitutionPartnership, SeatAssignment
from app.utils.dependencies import get_current_user
from app.utils.rbac import is_admin as _is_admin

router = APIRouter()


def _require_admin(user: User) -> None:
    if not _is_admin(user):
        raise HTTPException(status_code=403, detail="admin role required")


# ---------------------------------------------------------------------------
# Freshness / competence classification (honest, explainable)
# ---------------------------------------------------------------------------
#
# A skill lands in exactly one bucket:
#   verified   mastery >= threshold AND proof is still fresh          (can do it)
#   expiring   verified, but the review is due within due_soon_days   (act soon)
#   lapsed     mastery >= threshold BUT the review date has passed     (re-verify)
#   below      mastery <  threshold                                    (not yet)
#   unverified never demonstrated (no last_practiced_at)               (no proof)
#
# `freshness` in [0,1] = fraction of the SRS review interval remaining. It is
# only computed when the SRS scheduler has set next_review_at; otherwise we fall
# back to a recency label based on days-since and mark it approximate.


def _classify(
    mastery: float,
    last_practiced_at: datetime | None,
    next_review_at: datetime | None,
    now: datetime,
    threshold: float,
    due_soon_days: int,
) -> dict:
    days_since = None if last_practiced_at is None else max(0, (now - last_practiced_at).days)

    freshness: float | None = None
    days_until_due: int | None = None
    fresh_basis = "none"

    if last_practiced_at is None:
        status_time = "unverified"
    elif next_review_at is not None:
        fresh_basis = "srs"  # driven by the scheduler's own next_review_at
        total = (next_review_at - last_practiced_at).total_seconds()
        remaining = (next_review_at - now).total_seconds()
        freshness = 1.0 if total <= 0 else max(0.0, min(1.0, remaining / total))
        days_until_due = int(remaining // 86400)
        if remaining <= 0:
            status_time = "lapsed"
        elif days_until_due <= due_soon_days:
            status_time = "due_soon"
        else:
            status_time = "fresh"
    else:
        # No SRS schedule yet — approximate from recency, labeled as such.
        fresh_basis = "recency"
        if days_since is not None and days_since <= 30:
            status_time = "fresh"
        elif days_since is not None and days_since <= 90:
            status_time = "due_soon"
        else:
            status_time = "lapsed"

    # Combine mastery with time to reach the final bucket.
    if status_time == "unverified":
        bucket = "unverified"
    elif mastery < threshold:
        bucket = "below"
    elif status_time == "lapsed":
        bucket = "lapsed"
    elif status_time == "due_soon":
        bucket = "expiring"
    else:
        bucket = "verified"

    return {
        "bucket": bucket,
        "freshness": None if freshness is None else round(freshness, 3),
        "fresh_basis": fresh_basis,
        "days_since": days_since,
        "days_until_due": days_until_due,
    }


_EMPTY_SUMMARY = {"verified": 0, "expiring": 0, "lapsed": 0, "below": 0, "unverified": 0}


async def _org_seat_users(db: AsyncSession, org_id: UUID) -> dict[str, dict]:
    """Active seats across the org's partnerships -> {user_id: seat meta}.

    One seat per user is assumed for the workforce model; if a user holds seats
    in multiple partnerships we keep the most recently assigned.
    """
    rows = (
        await db.execute(
            select(SeatAssignment, InstitutionPartnership.name)
            .join(InstitutionPartnership, InstitutionPartnership.id == SeatAssignment.partnership_id)
            .where(
                InstitutionPartnership.org_id == org_id,
                SeatAssignment.released_at.is_(None),
            )
            .order_by(SeatAssignment.assigned_at.desc())
        )
    ).all()
    out: dict[str, dict] = {}
    for seat, pname in rows:
        uid = str(seat.user_id)
        if uid in out:
            continue  # keep the most recent (rows are desc by assigned_at)
        out[uid] = {
            "user_id": uid,
            "partnership_id": str(seat.partnership_id),
            "partnership_name": pname,
            "team_label": seat.team_label,
            "role_label": seat.role_label,
            "assigned_at": seat.assigned_at.isoformat() if seat.assigned_at else None,
        }
    return out


async def _mastery_rows(db: AsyncSession, user_ids: list[str]) -> list[dict]:
    if not user_ids:
        return []
    rows = (
        await db.execute(
            select(
                LearnerSkillMastery.user_id,
                LearnerSkillMastery.mastery,
                LearnerSkillMastery.attempts,
                LearnerSkillMastery.last_practiced_at,
                LearnerSkillMastery.next_review_at,
                LearnerSkillMastery.measured_at_bloom,
                Skill.code,
                Skill.name,
                Skill.framework,
                Skill.tier,
            )
            .join(Skill, Skill.id == LearnerSkillMastery.skill_id)
            .where(LearnerSkillMastery.user_id.in_([UUID(u) for u in user_ids]))
        )
    ).all()
    return [
        {
            "user_id": str(r.user_id),
            "mastery": float(r.mastery),
            "attempts": int(r.attempts or 0),
            "last_practiced_at": r.last_practiced_at,
            "next_review_at": r.next_review_at,
            "bloom": r.measured_at_bloom.value if r.measured_at_bloom else None,
            "code": r.code,
            "name": r.name,
            "framework": r.framework.value if hasattr(r.framework, "value") else r.framework,
            "tier": r.tier,
        }
        for r in rows
    ]


async def _user_meta(db: AsyncSession, user_ids: list[str]) -> dict[str, dict]:
    if not user_ids:
        return {}
    rows = (
        await db.execute(
            select(User.id, User.email, User.first_name, User.last_name, User.display_name)
            .where(User.id.in_([UUID(u) for u in user_ids]))
        )
    ).all()
    out: dict[str, dict] = {}
    for uid, email, first, last, display in rows:
        name = (display or "").strip() or f"{(first or '').strip()} {(last or '').strip()}".strip()
        out[str(uid)] = {"email": email, "name": name or (email or "Unknown")}
    return out


# ---------------------------------------------------------------------------
# Roster
# ---------------------------------------------------------------------------


async def _build_roster(
    db: AsyncSession, org_id: UUID, threshold: float, due_soon_days: int
) -> dict:
    now = datetime.utcnow()  # naive UTC, matches the naive DB timestamps
    seats = await _org_seat_users(db, org_id)
    user_ids = list(seats.keys())
    meta = await _user_meta(db, user_ids)
    mastery = await _mastery_rows(db, user_ids)

    per_user: dict[str, dict] = {
        uid: {**seats[uid], **meta.get(uid, {"name": "Unknown", "email": None}),
              "n_skills": 0, "mastery_sum": 0.0, **dict(_EMPTY_SUMMARY)}
        for uid in user_ids
    }

    for m in mastery:
        u = per_user.get(m["user_id"])
        if u is None:
            continue
        c = _classify(m["mastery"], m["last_practiced_at"], m["next_review_at"],
                      now, threshold, due_soon_days)
        u["n_skills"] += 1
        u["mastery_sum"] += m["mastery"]
        u[c["bucket"]] += 1

    workers = []
    totals = dict(_EMPTY_SUMMARY)
    for uid, u in per_user.items():
        n = u["n_skills"]
        avg = round(u["mastery_sum"] / n, 3) if n else None
        for k in _EMPTY_SUMMARY:
            totals[k] += u[k]
        workers.append({
            "user_id": uid,
            "name": u["name"],
            "email": u["email"],
            "team_label": u["team_label"],
            "role_label": u["role_label"],
            "partnership_name": u["partnership_name"],
            "n_skills": n,
            "avg_mastery": avg,
            "verified": u["verified"],
            "expiring": u["expiring"],
            "lapsed": u["lapsed"],
            "below": u["below"],
            "unverified": u["unverified"],
        })

    # Sort: people with lapsed/expiring proof first (most actionable), then by
    # fewest verified skills.
    workers.sort(key=lambda w: (-(w["lapsed"] + w["expiring"]), w["verified"], w["name"] or ""))

    return {
        "generated_at": now.isoformat(),
        "threshold": threshold,
        "due_soon_days": due_soon_days,
        "n_workers": len(workers),
        "totals": totals,
        "workers": workers,
    }


@router.get("/institutions/passport")
async def passport_roster(
    threshold: float = Query(0.7, ge=0.0, le=1.0),
    due_soon_days: int = Query(14, ge=1, le=120),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Org-wide skill-passport roster: one row per active seat.

    Counts each worker's skills by competence bucket (verified / expiring /
    lapsed / below / unverified) at the given mastery threshold. Single set of
    queries across the org — no per-partnership fan-out.
    """
    _require_admin(current_user)
    return await _build_roster(db, current_user.org_id, threshold, due_soon_days)


@router.get("/institutions/passport/export.csv")
async def passport_roster_csv(
    threshold: float = Query(0.7, ge=0.0, le=1.0),
    due_soon_days: int = Query(14, ge=1, le=120),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    """The roster as CSV — for audit packs and board reporting."""
    _require_admin(current_user)
    data = await _build_roster(db, current_user.org_id, threshold, due_soon_days)
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(["name", "email", "team", "role", "partnership", "skills_tracked",
                "avg_mastery", "verified", "expiring", "lapsed", "below", "unverified"])
    for x in data["workers"]:
        w.writerow([x["name"], x["email"] or "", x["team_label"] or "", x["role_label"] or "",
                    x["partnership_name"] or "", x["n_skills"],
                    "" if x["avg_mastery"] is None else x["avg_mastery"],
                    x["verified"], x["expiring"], x["lapsed"], x["below"], x["unverified"]])
    return Response(
        content=buf.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=skill-passport-roster.csv"},
    )


# ---------------------------------------------------------------------------
# Individual passport
# ---------------------------------------------------------------------------


@router.get("/institutions/passport/{user_id}")
async def passport_for_worker(
    user_id: UUID,
    threshold: float = Query(0.7, ge=0.0, le=1.0),
    due_soon_days: int = Query(14, ge=1, le=120),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """One worker's full skill passport — every tracked skill with its
    demonstrated mastery, when it was last verified, and how fresh that proof
    still is. The worker must hold an active seat in the caller's org."""
    _require_admin(current_user)
    now = datetime.utcnow()

    seats = await _org_seat_users(db, current_user.org_id)
    seat = seats.get(str(user_id))
    if seat is None:
        raise HTTPException(status_code=404, detail="worker not found in your org")

    meta = (await _user_meta(db, [str(user_id)])).get(
        str(user_id), {"name": "Unknown", "email": None}
    )
    mastery = await _mastery_rows(db, [str(user_id)])

    skills = []
    summary = dict(_EMPTY_SUMMARY)
    mastery_sum = 0.0
    for m in mastery:
        c = _classify(m["mastery"], m["last_practiced_at"], m["next_review_at"],
                      now, threshold, due_soon_days)
        summary[c["bucket"]] += 1
        mastery_sum += m["mastery"]
        skills.append({
            "code": m["code"],
            "name": m["name"],
            "framework": m["framework"],
            "tier": m["tier"],
            "bloom": m["bloom"],
            "mastery": round(m["mastery"], 3),
            "attempts": m["attempts"],
            "last_practiced_at": m["last_practiced_at"].isoformat() if m["last_practiced_at"] else None,
            "next_review_at": m["next_review_at"].isoformat() if m["next_review_at"] else None,
            "bucket": c["bucket"],
            "freshness": c["freshness"],
            "fresh_basis": c["fresh_basis"],
            "days_since": c["days_since"],
            "days_until_due": c["days_until_due"],
        })

    # Actionable first: lapsed, then expiring, then below, then verified, then
    # unverified; ties broken by lowest mastery.
    order = {"lapsed": 0, "expiring": 1, "below": 2, "verified": 3, "unverified": 4}
    skills.sort(key=lambda s: (order.get(s["bucket"], 9), s["mastery"]))

    n = len(skills)
    return {
        "generated_at": now.isoformat(),
        "threshold": threshold,
        "due_soon_days": due_soon_days,
        "worker": {
            "user_id": str(user_id),
            "name": meta["name"],
            "email": meta["email"],
            "team_label": seat["team_label"],
            "role_label": seat["role_label"],
            "partnership_name": seat["partnership_name"],
        },
        "summary": summary,
        "n_skills": n,
        "avg_mastery": round(mastery_sum / n, 3) if n else None,
        "skills": skills,
    }
