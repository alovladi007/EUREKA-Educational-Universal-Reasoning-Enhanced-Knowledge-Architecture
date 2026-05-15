"""
Transcript service (Phase 4 Session 4.3, 2026-05).

Three responsibilities:
  1. Build the Open Badges 3.0 JSON-LD payload from a learner's
     achievements, tier enrollments, and mastery snapshot.
  2. Sign the canonical payload with Ed25519.
  3. Verify a previously-issued transcript's signature.

The signing private key lives in env var TRANSCRIPT_SIGNING_KEY_B64
(base64url-encoded raw 32-byte seed). In dev a fresh keypair is
generated at boot if none is set and the public half is upserted into
transcript_issuer_keys. Production must pin it via the secret manager
(see docs/SECRETS.md).
"""

from __future__ import annotations

import base64
import json
import os
from datetime import datetime
from typing import Any

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey, Ed25519PublicKey,
)
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.learner import LearnerProfile, TierEnrollment, TierEnrollmentStatus
from app.models.skill import LearnerSkillMastery, Skill
from app.models.transcript import (
    LearnerAchievement, TranscriptIssuance, TranscriptIssuerKey,
)
from app.models.user import User


_SIGNING_KEY_ENV = "TRANSCRIPT_SIGNING_KEY_B64"
_DEFAULT_KEY_ID = "eureka-transcript-2026-05"


def _b64u_encode(b: bytes) -> str:
    return base64.urlsafe_b64encode(b).rstrip(b"=").decode()


def _b64u_decode(s: str) -> bytes:
    pad = "=" * (-len(s) % 4)
    return base64.urlsafe_b64decode(s + pad)


def _canonicalize(payload: dict[str, Any]) -> bytes:
    """
    Canonical serialization for signing. Sorts keys, no whitespace, no
    NaN/Infinity. Verifiers MUST use the same canonicalization to get
    the same bytes back.
    """
    return json.dumps(payload, sort_keys=True, separators=(",", ":"), default=str).encode()


def _load_or_generate_signing_key() -> tuple[Ed25519PrivateKey, str]:
    """
    Returns (private_key, key_id). If env var is set, decode it; otherwise
    generate fresh (dev only). The caller persists the public half.
    """
    raw = os.environ.get(_SIGNING_KEY_ENV, "").strip()
    if raw:
        seed = _b64u_decode(raw)
        sk = Ed25519PrivateKey.from_private_bytes(seed)
        return sk, _DEFAULT_KEY_ID
    # Dev: regenerate per process. The public half is upserted on first use.
    sk = Ed25519PrivateKey.generate()
    return sk, f"{_DEFAULT_KEY_ID}-dev"


async def get_active_signing_context(db: AsyncSession) -> tuple[Ed25519PrivateKey, TranscriptIssuerKey]:
    """
    Resolve the active signing key. Upserts the public half into
    transcript_issuer_keys on first call (dev convenience). Returns the
    private key and the DB row (which carries the issuer URI/name).
    """
    sk, key_id = _load_or_generate_signing_key()
    pub_bytes = sk.public_key().public_bytes_raw()
    pub_b64 = _b64u_encode(pub_bytes)

    row_q = await db.execute(
        select(TranscriptIssuerKey).where(TranscriptIssuerKey.key_id == key_id)
    )
    row = row_q.scalar_one_or_none()
    if row is None:
        row = TranscriptIssuerKey(
            key_id=key_id,
            public_key_b64=pub_b64,
            algorithm="Ed25519",
            is_active=True,
        )
        db.add(row)
        await db.flush()
    elif row.public_key_b64 != pub_b64:
        # Dev: signing key in env changed; rotate the row.
        row.public_key_b64 = pub_b64
        row.rotated_at = datetime.utcnow()
        await db.flush()
    return sk, row


async def build_transcript_payload(
    db: AsyncSession, user: User
) -> tuple[dict[str, Any], dict[str, int]]:
    """
    Compose the Open Badges 3.0 JSON-LD payload for the learner.
    Returns (payload, counts).
    """
    # Achievements
    ach_q = await db.execute(
        select(LearnerAchievement)
        .where(LearnerAchievement.user_id == user.id, LearnerAchievement.revoked_at.is_(None))
        .order_by(LearnerAchievement.earned_at.desc())
    )
    achievements = list(ach_q.scalars().all())

    # Tier enrollments — surface completed / active for the transcript
    te_q = await db.execute(
        select(TierEnrollment)
        .where(TierEnrollment.user_id == user.id, TierEnrollment.deleted_at.is_(None))
        .order_by(TierEnrollment.created_at.desc())
    )
    tiers = list(te_q.scalars().all())

    # Mastery snapshot
    lsm_q = await db.execute(
        select(LearnerSkillMastery, Skill)
        .join(Skill, Skill.id == LearnerSkillMastery.skill_id)
        .where(LearnerSkillMastery.user_id == user.id)
        .order_by(LearnerSkillMastery.mastery.desc())
    )
    mastery_rows = list(lsm_q.all())
    skills_mastered = [
        (lsm, s) for lsm, s in mastery_rows if float(lsm.mastery) >= 0.85
    ]

    # Profile (for display name + languages)
    prof_q = await db.execute(
        select(LearnerProfile).where(LearnerProfile.user_id == user.id)
    )
    profile = prof_q.scalar_one_or_none()
    display_name = (
        (profile.display_name_preferred if profile else None)
        or user.display_name
        or f"{user.first_name} {user.last_name}".strip()
    )

    payload: dict[str, Any] = {
        "@context": [
            "https://www.w3.org/ns/credentials/v2",
            "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json",
        ],
        "type": ["VerifiableCredential", "OpenBadgeCredential"],
        "id": f"urn:eureka:transcript:user:{user.id}:{int(datetime.utcnow().timestamp())}",
        "issuanceDate": datetime.utcnow().isoformat() + "Z",
        "credentialSubject": {
            "id": f"urn:eureka:learner:{user.id}",
            "type": ["AchievementSubject"],
            "name": display_name,
            "email": user.email,
            "tierEnrollments": [
                {
                    "id": f"urn:eureka:tier-enrollment:{te.id}",
                    "tier": te.tier.value if hasattr(te.tier, "value") else te.tier,
                    "status": te.status.value if hasattr(te.status, "value") else te.status,
                    "tierContext": te.tier_context,
                    "startedAt": te.started_at.isoformat() + "Z" if te.started_at else None,
                    "completedAt": te.completed_at.isoformat() + "Z" if te.completed_at else None,
                    "progressPct": float(te.progress_pct),
                }
                for te in tiers
            ],
            "achievements": [
                {
                    "id": f"urn:eureka:achievement:{a.id}",
                    "type": ["Achievement"],
                    "achievementType": a.kind.value if hasattr(a.kind, "value") else a.kind,
                    "name": a.title,
                    "description": a.description,
                    "criteria": a.extra_metadata,
                    "issuedOn": a.earned_at.isoformat() + "Z",
                    "expires": a.expires_at.isoformat() + "Z" if a.expires_at else None,
                }
                for a in achievements
            ],
            "masteredSkills": [
                {
                    "id": f"urn:eureka:skill:{s.framework.value}:{s.code}"
                    if hasattr(s.framework, "value") else f"urn:eureka:skill:{s.framework}:{s.code}",
                    "framework": s.framework.value if hasattr(s.framework, "value") else s.framework,
                    "code": s.code,
                    "name": s.name,
                    "mastery": float(lsm.mastery),
                    "attempts": lsm.attempts,
                    "bloomLevel": lsm.measured_at_bloom.value if (lsm.measured_at_bloom and hasattr(lsm.measured_at_bloom, "value")) else lsm.measured_at_bloom,
                }
                for lsm, s in skills_mastered
            ],
        },
    }
    counts = {
        "achievements": len(achievements),
        "tiers": len(tiers),
        "skills_mastered": len(skills_mastered),
    }
    return payload, counts


async def issue_transcript(db: AsyncSession, user: User) -> TranscriptIssuance:
    """
    Build, sign, persist a transcript issuance for the user. Marks any
    prior current issuance as superseded so /transcript/me returns the
    fresh one.
    """
    payload, counts = await build_transcript_payload(db, user)
    sk, issuer_row = await get_active_signing_context(db)

    # Attach issuer info to the payload before signing
    payload["issuer"] = {
        "id": issuer_row.issuer_uri,
        "name": issuer_row.issuer_name,
        "type": ["Profile"],
    }

    canon = _canonicalize(payload)
    signature = sk.sign(canon)

    # Mark prior current issuances as superseded
    prior_q = await db.execute(
        select(TranscriptIssuance)
        .where(
            TranscriptIssuance.user_id == user.id,
            TranscriptIssuance.superseded_at.is_(None),
        )
    )
    issuance = TranscriptIssuance(
        user_id=user.id,
        payload=payload,
        signature_b64=_b64u_encode(signature),
        key_id=issuer_row.key_id,
        achievements_count=counts["achievements"],
        tiers_count=counts["tiers"],
        skills_mastered_count=counts["skills_mastered"],
    )
    db.add(issuance)
    await db.flush()  # need issuance.id for supersede pointer

    for prior in prior_q.scalars().all():
        prior.superseded_at = datetime.utcnow()
        prior.superseded_by_id = issuance.id

    await db.commit()
    await db.refresh(issuance)
    return issuance


async def verify_issuance(db: AsyncSession, issuance: TranscriptIssuance) -> dict[str, Any]:
    """
    Verify the Ed25519 signature on a stored issuance against the public
    key registered for its key_id. Pure read; no DB writes.
    """
    key_q = await db.execute(
        select(TranscriptIssuerKey).where(TranscriptIssuerKey.key_id == issuance.key_id)
    )
    key_row = key_q.scalar_one_or_none()
    if key_row is None:
        return {
            "verified": False,
            "reason": f"Issuer key {issuance.key_id} not found in registry.",
        }

    pub = Ed25519PublicKey.from_public_bytes(_b64u_decode(key_row.public_key_b64))
    canon = _canonicalize(issuance.payload)
    sig = _b64u_decode(issuance.signature_b64)
    try:
        pub.verify(sig, canon)
        return {
            "verified": True,
            "key_id": issuance.key_id,
            "issuer": key_row.issuer_uri,
            "algorithm": key_row.algorithm,
            "issued_at": issuance.issued_at.isoformat() + "Z",
        }
    except InvalidSignature:
        return {"verified": False, "reason": "Signature does not match payload."}
