"""
JWT token revocation / blacklist (P0-8).

Stores revoked token IDs (jti claims) in Redis with TTL = remaining token
life, so the blacklist auto-prunes and never grows unbounded. Every call
to get_current_user() checks the blacklist after JWT signature
verification — revoked tokens are rejected with 401.

Why Redis (not a DB table):
    - O(1) lookup per request, sub-millisecond
    - Auto-expiry via SET … EX matches token TTL exactly
    - Lossy is fine on redis flush (worst case: a logged-out token
      becomes valid again for at most its remaining lifetime)
"""

from __future__ import annotations

import logging
import time
from typing import Optional
from uuid import UUID

import redis.asyncio as redis

from app.core.config import settings


logger = logging.getLogger(__name__)

# Redis client is created lazily so this module is importable in test
# contexts that don't have a running Redis.
_client: Optional[redis.Redis] = None

# Two key namespaces:
#   jwt:revoked:<jti>            → single-token revocation (logout)
#   jwt:revoked-user:<user_id>   → "revoke all tokens issued before T"
# The second is set on logout-all-devices; access tokens issued before
# the stored timestamp are rejected.
_TOKEN_KEY_PREFIX = "jwt:revoked:"
_USER_KEY_PREFIX = "jwt:revoked-user:"


async def _get_client() -> redis.Redis:
    global _client
    if _client is None:
        _client = await redis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
        )
    return _client


async def revoke_jti(jti: str, exp: Optional[int]) -> None:
    """Mark a single token as revoked.

    Args:
        jti: The token's unique identifier (jti claim).
        exp: The token's expiration timestamp (Unix epoch seconds, from
            the `exp` claim). The blacklist entry auto-expires when the
            token would have expired anyway. If exp is missing or in
            the past we still set a short safety TTL.
    """
    if not jti:
        return
    ttl = max(1, int(exp) - int(time.time())) if exp else 60
    try:
        client = await _get_client()
        await client.set(f"{_TOKEN_KEY_PREFIX}{jti}", "1", ex=ttl)
    except Exception:  # noqa: BLE001 — never let Redis kill the request
        logger.exception("revoke_jti failed for jti=%s; token not blacklisted", jti)


async def revoke_user_tokens(user_id: str | UUID) -> None:
    """Mark every token issued at-or-before now as revoked for this user.

    Used by /auth/logout-all-devices. The blacklist entry stores the
    current Unix timestamp; is_token_valid() compares this against the
    token's `iat` claim and rejects anything issued earlier.

    TTL is the longest possible refresh-token life so the entry isn't
    purged before old tokens themselves expire.
    """
    if not user_id:
        return
    now = int(time.time())
    refresh_ttl_seconds = max(
        60,
        int(settings.REFRESH_TOKEN_EXPIRATION_DAYS) * 24 * 60 * 60,
    )
    try:
        client = await _get_client()
        await client.set(
            f"{_USER_KEY_PREFIX}{user_id}",
            str(now),
            ex=refresh_ttl_seconds,
        )
    except Exception:  # noqa: BLE001
        logger.exception(
            "revoke_user_tokens failed for user_id=%s; not blacklisted", user_id
        )


async def is_token_valid(jti: Optional[str], iat: Optional[int], user_id: Optional[str]) -> bool:
    """Return True if neither the token's jti nor a user-wide revoke
    timestamp invalidates it.

    Args:
        jti: The token's unique id (may be None for legacy tokens).
        iat: The token's issued-at Unix timestamp.
        user_id: The token's subject claim (user id).
    """
    try:
        client = await _get_client()
    except Exception:  # noqa: BLE001
        # Fail-open if Redis is unreachable — we'd rather let valid users
        # in than lock everyone out. The logout endpoint logs the failure.
        logger.exception("token-blacklist redis unavailable; failing open")
        return True

    # 1) Single-token revocation.
    if jti:
        try:
            if await client.exists(f"{_TOKEN_KEY_PREFIX}{jti}"):
                return False
        except Exception:  # noqa: BLE001
            logger.exception("blacklist EXISTS failed; failing open")

    # 2) User-wide revocation (logout-all-devices).
    if user_id and iat is not None:
        try:
            revoked_at_raw = await client.get(f"{_USER_KEY_PREFIX}{user_id}")
            if revoked_at_raw is not None:
                try:
                    revoked_at = int(revoked_at_raw)
                    # Tokens issued before the revoke timestamp are dead.
                    if int(iat) <= revoked_at:
                        return False
                except (TypeError, ValueError):
                    pass
        except Exception:  # noqa: BLE001
            logger.exception("blacklist user GET failed; failing open")

    return True
