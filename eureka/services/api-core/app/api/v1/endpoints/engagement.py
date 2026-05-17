"""
Phase 12 — engagement + adaptive learning REST surface.

Endpoint map
============

12.1 Streaks + XP + achievements
  GET   /me/engagement                       my engagement state
  POST  /me/engagement/activity              record an activity (XP + streak)
  GET   /me/achievements                     achievements I've earned
  POST  /admin/achievements                  (admin) create achievement
  GET   /achievements                        public catalog
  GET   /leaderboard?period_days=&limit=     top XP (optional trailing window)

12.2 Push notifications
  POST  /me/devices                          register a device
  GET   /me/devices                          my active devices
  DELETE /me/devices/{id}                    revoke a device
  POST  /admin/notifications/enqueue         (admin) push a notification
  GET   /me/notifications                    my notification history
  POST  /me/notifications/{id}/mark-opened   mark a notification as opened

12.3 Adaptive study plan
  POST  /me/study-plan                       generate (or regenerate) my plan
  GET   /me/study-plan                       my active plan (with weeks)
  POST  /me/study-plan/weeks/{id}/log        record minutes / completed items

12.4 Offline sync
  GET   /me/offline-pack                     get or refresh item pack (ETag)
  POST  /me/offline-pack/replay              replay attempts collected offline

12.5 Live tutoring marketplace
  POST  /instructors/me/live-sessions        create a session (as instructor)
  GET   /live-sessions                       browse upcoming sessions
  GET   /live-sessions/{id}                  one session
  POST  /live-sessions/{id}/book             book a seat (creates booking)
  POST  /live-sessions/{id}/cancel           instructor cancels
  POST  /live-sessions/{id}/bookings/{bid}/cancel   user cancels own booking
"""

from __future__ import annotations

import hashlib
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Header, HTTPException, Query, Response
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.engagement import (
    Achievement,
    AchievementRarity,
    BookingStatus,
    EngagementState,
    LiveSession,
    LiveSessionBooking,
    LiveSessionStatus,
    NotificationDevice,
    NotificationKind,
    PushNotification,
    StudyPlan,
    StudyPlanWeek,
    UserAchievement,
)
from app.models.marketplace import InstructorProfile
from app.models.user import User
from app.schemas.engagement import (
    AchievementCreateRequest,
    AchievementResponse,
    BookingResponse,
    DeviceRegisterRequest,
    DeviceResponse,
    EngagementStateResponse,
    LeaderboardRow,
    LiveSessionCancelRequest,
    LiveSessionCreateRequest,
    LiveSessionResponse,
    NotificationEnqueueRequest,
    NotificationResponse,
    OfflineBundleResponse,
    OfflineReplayRequest,
    OfflineReplayResponse,
    RecordActivityRequest,
    RecordActivityResponse,
    StudyPlanGenerateRequest,
    StudyPlanResponse,
    StudyPlanWeekResponse,
    UserAchievementResponse,
)
from app.services import engagement as eng_svc
from app.services import offline_sync as off_svc
from app.services import push_notify as push_svc
from app.services import study_plan as plan_svc
from app.utils.dependencies import get_current_user


router = APIRouter()


def _is_admin(user: User) -> bool:
    role = user.role.value if hasattr(user.role, "value") else user.role
    return role in ("org_admin", "super_admin")


def _require_admin(user: User) -> None:
    if not _is_admin(user):
        raise HTTPException(status_code=403, detail="admin role required")


def _utc() -> datetime:
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# 12.1 Engagement
# ---------------------------------------------------------------------------


@router.get("/me/engagement", response_model=EngagementStateResponse)
async def get_my_engagement(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = await db.execute(select(EngagementState).where(EngagementState.user_id == current_user.id))
    state = q.scalar_one_or_none()
    if state is None:
        state = EngagementState(user_id=current_user.id)
        db.add(state)
        await db.commit()
        await db.refresh(state)
    return state


@router.post("/me/engagement/activity", response_model=RecordActivityResponse)
async def record_activity(
    payload: RecordActivityRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.source not in eng_svc.XP_RULES and payload.xp_override is None:
        raise HTTPException(status_code=400, detail=f"unknown source: {payload.source}")
    result = await eng_svc.record_activity(
        db, user_id=current_user.id, source=payload.source,
        ref_kind=payload.ref_kind, ref_id=payload.ref_id, xp_override=payload.xp_override,
    )
    return RecordActivityResponse(**result.__dict__)


@router.get("/me/achievements", response_model=list[UserAchievementResponse])
async def my_achievements(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = await db.execute(
        select(UserAchievement).where(UserAchievement.user_id == current_user.id)
        .order_by(UserAchievement.earned_at.desc())
    )
    return list(q.scalars().all())


@router.get("/achievements", response_model=list[AchievementResponse])
async def list_achievements(db: AsyncSession = Depends(get_db)):
    q = await db.execute(select(Achievement).where(Achievement.is_active.is_(True)))
    return list(q.scalars().all())


@router.post("/admin/achievements", response_model=AchievementResponse, status_code=201)
async def admin_create_achievement(
    payload: AchievementCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    ach = Achievement(**payload.model_dump())
    db.add(ach)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status_code=409, detail="achievement slug already exists") from exc
    await db.refresh(ach)
    return ach


@router.get("/leaderboard", response_model=list[LeaderboardRow])
async def leaderboard(
    period_days: Optional[int] = Query(None, ge=1, le=365),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    rows = await eng_svc.leaderboard(db, limit=limit, period_days=period_days)
    return rows


# ---------------------------------------------------------------------------
# 12.2 Push notifications
# ---------------------------------------------------------------------------


@router.post("/me/devices", response_model=DeviceResponse, status_code=201)
async def register_device(
    payload: DeviceRegisterRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Upsert on push_token (UNIQUE) — reactivate if revoked.
    q = await db.execute(
        select(NotificationDevice).where(NotificationDevice.push_token == payload.push_token)
    )
    dev = q.scalar_one_or_none()
    if dev is not None:
        dev.user_id = current_user.id
        dev.platform = payload.platform
        dev.app_version = payload.app_version
        dev.locale = payload.locale
        dev.timezone = payload.timezone
        dev.preferences = payload.preferences
        dev.last_seen_at = _utc()
        dev.revoked_at = None
        await db.commit()
        await db.refresh(dev)
        return dev
    dev = NotificationDevice(
        user_id=current_user.id, platform=payload.platform,
        push_token=payload.push_token, app_version=payload.app_version,
        locale=payload.locale, timezone=payload.timezone,
        preferences=payload.preferences,
    )
    db.add(dev)
    await db.commit()
    await db.refresh(dev)
    return dev


@router.get("/me/devices", response_model=list[DeviceResponse])
async def my_devices(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = await db.execute(
        select(NotificationDevice).where(
            NotificationDevice.user_id == current_user.id,
            NotificationDevice.revoked_at.is_(None),
        )
    )
    return list(q.scalars().all())


@router.delete("/me/devices/{device_id}", status_code=204)
async def revoke_device(
    device_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    dev = await db.get(NotificationDevice, device_id)
    if dev is None or dev.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="device not found")
    dev.revoked_at = _utc()
    await db.commit()


@router.post("/admin/notifications/enqueue", response_model=list[NotificationResponse])
async def admin_enqueue_notification(
    payload: NotificationEnqueueRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    if payload.kind not in {k.value for k in NotificationKind}:
        raise HTTPException(status_code=400, detail="unknown notification kind")
    notes = await push_svc.enqueue(
        db, user_id=payload.user_id, kind=payload.kind,
        title=payload.title, body=payload.body,
        deep_link=payload.deep_link, data=payload.data,
    )
    return notes


@router.get("/me/notifications", response_model=list[NotificationResponse])
async def my_notifications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = await db.execute(
        select(PushNotification).where(PushNotification.user_id == current_user.id)
        .order_by(PushNotification.queued_at.desc()).limit(50)
    )
    return list(q.scalars().all())


@router.post("/me/notifications/{notif_id}/mark-opened", response_model=NotificationResponse)
async def mark_notification_opened(
    notif_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    n = await db.get(PushNotification, notif_id)
    if n is None or n.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="notification not found")
    await push_svc.mark_opened(db, note=n)
    return n


# ---------------------------------------------------------------------------
# 12.3 Adaptive study plan
# ---------------------------------------------------------------------------


@router.post("/me/study-plan", response_model=StudyPlanResponse)
async def generate_my_study_plan(
    payload: StudyPlanGenerateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan, _weeks = await plan_svc.generate(
        db, user_id=current_user.id,
        tier=payload.tier, framework=payload.framework,
        exam=payload.exam, target_date=payload.target_date,
        daily_target_minutes=payload.daily_target_minutes,
        target_mastery=payload.target_mastery,
    )
    weeks_q = await db.execute(
        select(StudyPlanWeek).where(StudyPlanWeek.plan_id == plan.id)
        .order_by(StudyPlanWeek.week_index)
    )
    weeks_rows = [
        StudyPlanWeekResponse.model_validate(w, from_attributes=True)
        for w in weeks_q.scalars().all()
    ]
    out = StudyPlanResponse.model_validate(plan, from_attributes=True)
    out.weeks = weeks_rows
    return out


@router.get("/me/study-plan", response_model=Optional[StudyPlanResponse])
async def get_my_study_plan(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan = await plan_svc.current_plan(db, user_id=current_user.id)
    if plan is None:
        return None
    weeks_q = await db.execute(
        select(StudyPlanWeek).where(StudyPlanWeek.plan_id == plan.id)
        .order_by(StudyPlanWeek.week_index)
    )
    weeks_rows = [
        StudyPlanWeekResponse.model_validate(w, from_attributes=True)
        for w in weeks_q.scalars().all()
    ]
    out = StudyPlanResponse.model_validate(plan, from_attributes=True)
    out.weeks = weeks_rows
    return out


@router.post("/me/study-plan/weeks/{week_id}/log")
async def log_study_minutes(
    week_id: UUID,
    minutes: int = Query(..., ge=0, le=600),
    completed_item_id: Optional[UUID] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    week = await db.get(StudyPlanWeek, week_id)
    if week is None:
        raise HTTPException(status_code=404, detail="week not found")
    plan = await db.get(StudyPlan, week.plan_id)
    if plan is None or plan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="not your plan")
    week.minutes_studied = (week.minutes_studied or 0) + minutes
    if completed_item_id is not None:
        completed = list(week.completed_item_ids or [])
        if completed_item_id not in completed:
            completed.append(completed_item_id)
            week.completed_item_ids = completed
    if (
        week.target_minutes > 0
        and week.minutes_studied >= week.target_minutes
        and week.completed_at is None
    ):
        week.completed_at = _utc()
    await db.commit()
    return {
        "minutes_studied": week.minutes_studied,
        "completed_item_count": len(week.completed_item_ids or []),
        "completed_at": week.completed_at,
    }


# ---------------------------------------------------------------------------
# 12.4 Offline sync
# ---------------------------------------------------------------------------


@router.get("/me/offline-pack")
async def get_offline_pack(
    response: Response,
    if_none_match: Optional[str] = Header(None),
    max_items: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bundle = await off_svc.build_item_pack(
        db, user_id=current_user.id, max_items=max_items,
    )
    response.headers["ETag"] = bundle.etag
    if if_none_match and if_none_match == bundle.etag:
        response.status_code = 304
        return None
    return OfflineBundleResponse.model_validate(bundle, from_attributes=True)


@router.post("/me/offline-pack/replay", response_model=OfflineReplayResponse)
async def replay_offline_attempts(
    payload: OfflineReplayRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    receipt = await off_svc.record_replay(
        db, user_id=current_user.id,
        bundle_id=payload.bundle_id, device_id=payload.device_id,
        attempts=payload.attempts,
    )
    return OfflineReplayResponse(
        receipt_id=receipt.id, received_attempts=receipt.received_attempts,
    )


# ---------------------------------------------------------------------------
# 12.5 Live tutoring marketplace
# ---------------------------------------------------------------------------


async def _get_my_instructor(db: AsyncSession, user: User) -> InstructorProfile:
    q = await db.execute(select(InstructorProfile).where(InstructorProfile.user_id == user.id))
    p = q.scalar_one_or_none()
    if p is None:
        raise HTTPException(status_code=404, detail="instructor profile required")
    return p


@router.post("/instructors/me/live-sessions", response_model=LiveSessionResponse, status_code=201)
async def create_live_session(
    payload: LiveSessionCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    inst = await _get_my_instructor(db, current_user)
    sess = LiveSession(
        instructor_id=inst.id, instructor_kind="marketplace",
        title=payload.title, description_md=payload.description_md,
        starts_at=payload.starts_at, duration_minutes=payload.duration_minutes,
        capacity=payload.capacity, price_cents=payload.price_cents,
        currency=payload.currency, target_skill_codes=payload.target_skill_codes,
        meeting_url=payload.meeting_url,
    )
    db.add(sess)
    await db.commit()
    await db.refresh(sess)
    return sess


@router.get("/live-sessions", response_model=list[LiveSessionResponse])
async def browse_live_sessions(
    skill_code: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(LiveSession).where(
        LiveSession.status == LiveSessionStatus.scheduled.value,
        LiveSession.starts_at >= _utc(),
    ).order_by(LiveSession.starts_at).limit(limit)
    if skill_code:
        stmt = stmt.where(LiveSession.target_skill_codes.any(skill_code))
    q = await db.execute(stmt)
    return list(q.scalars().all())


@router.get("/live-sessions/{session_id}", response_model=LiveSessionResponse)
async def get_live_session(
    session_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    sess = await db.get(LiveSession, session_id)
    if sess is None:
        raise HTTPException(status_code=404, detail="session not found")
    return sess


@router.post("/live-sessions/{session_id}/book", response_model=BookingResponse, status_code=201)
async def book_live_session(
    session_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sess = await db.get(LiveSession, session_id)
    if sess is None:
        raise HTTPException(status_code=404, detail="session not found")
    if sess.status != LiveSessionStatus.scheduled.value:
        raise HTTPException(status_code=409, detail="session not available")
    if sess.booked_count >= sess.capacity:
        raise HTTPException(status_code=409, detail="session is full")
    # Existing booking?
    existing_q = await db.execute(
        select(LiveSessionBooking).where(
            LiveSessionBooking.session_id == session_id,
            LiveSessionBooking.user_id == current_user.id,
        )
    )
    existing = existing_q.scalar_one_or_none()
    if existing is not None and existing.status in (
        BookingStatus.confirmed.value, BookingStatus.pending.value,
    ):
        raise HTTPException(status_code=409, detail="already booked")

    booking = LiveSessionBooking(
        session_id=session_id, user_id=current_user.id,
        status=BookingStatus.confirmed.value if sess.price_cents == 0 else BookingStatus.pending.value,
        seat_number=sess.booked_count + 1,
    )
    db.add(booking)
    sess.booked_count = (sess.booked_count or 0) + 1
    await db.commit()
    await db.refresh(booking)
    return booking


@router.post("/live-sessions/{session_id}/cancel", response_model=LiveSessionResponse)
async def cancel_live_session(
    session_id: UUID,
    payload: LiveSessionCancelRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sess = await db.get(LiveSession, session_id)
    if sess is None:
        raise HTTPException(status_code=404, detail="session not found")
    inst = await _get_my_instructor(db, current_user)
    if sess.instructor_id != inst.id and not _is_admin(current_user):
        raise HTTPException(status_code=403, detail="not your session")
    sess.status = LiveSessionStatus.canceled.value
    sess.canceled_at = _utc()
    sess.cancel_reason = payload.reason
    # Cancel any open bookings.
    bq = await db.execute(
        select(LiveSessionBooking).where(
            LiveSessionBooking.session_id == session_id,
            LiveSessionBooking.status.in_(("pending", "confirmed")),
        )
    )
    for b in bq.scalars().all():
        b.status = BookingStatus.canceled.value
        b.canceled_at = _utc()
        b.cancel_reason = payload.reason or "instructor canceled session"
    await db.commit()
    await db.refresh(sess)
    return sess


@router.post("/live-sessions/{session_id}/bookings/{booking_id}/cancel", response_model=BookingResponse)
async def cancel_own_booking(
    session_id: UUID,
    booking_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = await db.get(LiveSessionBooking, booking_id)
    if booking is None or booking.session_id != session_id:
        raise HTTPException(status_code=404, detail="booking not found")
    if booking.user_id != current_user.id and not _is_admin(current_user):
        raise HTTPException(status_code=403, detail="not your booking")
    if booking.status in (BookingStatus.canceled.value, BookingStatus.attended.value, BookingStatus.missed.value):
        raise HTTPException(status_code=409, detail=f"cannot cancel from status={booking.status}")
    booking.status = BookingStatus.canceled.value
    booking.canceled_at = _utc()
    sess = await db.get(LiveSession, session_id)
    if sess is not None and sess.booked_count > 0:
        sess.booked_count -= 1
    await db.commit()
    await db.refresh(booking)
    return booking
