"""Per-user rate limits on the copilot, so a real model cannot be run dry.

WHY THIS EXISTS BEFORE THE KEY DOES

With no model configured the copilot costs nothing to call, so nothing here
matters. The moment `ANTHROPIC_API_KEY` is set on the reasoning service, every
one of these endpoints becomes a metered spend, and an authenticated learner
with a loop - or a bug in a retry - can run it without limit. The cap has to
exist before the key, not after the first bill.

WHAT IT COUNTS

Calls per user, in a fixed window, per bucket. It is deliberately NOT
token-based: AXIOM does not see token counts (the reasoning service does), and
a limit computed from a number this process cannot observe would be a guess
dressed as a control. Calls are what this side can count honestly.

Backed by Redis when it is configured, because the API runs as more than one
worker and an in-process counter would let N workers serve N times the limit.
Falls back to an in-process counter when Redis is absent, which is correct for
single-process dev and is reported as such rather than pretended to be shared.
"""

from __future__ import annotations

import time
from dataclasses import dataclass

from app.core.config import get_settings


@dataclass(frozen=True)
class LimitDecision:
    allowed: bool
    limit: int
    remaining: int
    reset_seconds: int
    scope: str


# Buckets are separate so that an expensive authoring sweep cannot exhaust a
# learner's tutoring budget, and vice versa.
BUCKETS = {
    "tutor": "copilot chat, hint, explain and proof-tutor",
    "authoring": "item generation and teacher assistance",
}

_memory: dict[str, tuple[int, float]] = {}


def _window_key(bucket: str, user_id: str, window_seconds: int) -> str:
    slot = int(time.time() // window_seconds)
    return f"axiom:copilot:{bucket}:{user_id}:{slot}"


async def _incr_redis(key: str, ttl: int) -> int | None:
    """Increment in Redis, returning the new count, or None if unavailable."""
    settings = get_settings()
    url = getattr(settings, "redis_url", None)
    if not url:
        return None
    try:
        import redis.asyncio as aioredis

        client = aioredis.from_url(url)
        try:
            count = await client.incr(key)
            if count == 1:
                await client.expire(key, ttl)
            return int(count)
        finally:
            await client.aclose()
    except Exception:
        # Redis down is not a reason to refuse tutoring. Fall through to the
        # in-process counter, which still bounds a single worker.
        return None


def _incr_memory(key: str, ttl: int) -> int:
    now = time.time()
    for stale in [k for k, (_, exp) in _memory.items() if exp < now]:
        _memory.pop(stale, None)
    count, exp = _memory.get(key, (0, now + ttl))
    count += 1
    _memory[key] = (count, exp)
    return count


async def check(bucket: str, user_id: str) -> LimitDecision:
    """Count one call and say whether it is allowed."""
    settings = get_settings()
    window = int(getattr(settings, "copilot_rate_window_seconds", 3600))
    limit = int(
        getattr(
            settings,
            "copilot_rate_limit_authoring" if bucket == "authoring" else "copilot_rate_limit_tutor",
            60,
        )
    )
    if limit <= 0:
        # 0 or negative disables the bucket entirely, which is a deliberate
        # setting rather than an accident: it is how a deployment with no model
        # configured opts out of counting at all.
        return LimitDecision(True, limit, -1, window, "disabled")

    key = _window_key(bucket, user_id, window)
    count = await _incr_redis(key, window)
    scope = "shared"
    if count is None:
        count = _incr_memory(key, window)
        scope = "per-process"

    reset = window - int(time.time() % window)
    return LimitDecision(
        allowed=count <= limit,
        limit=limit,
        remaining=max(0, limit - count),
        reset_seconds=reset,
        scope=scope,
    )


def get_window_minutes() -> int:
    """The limit window in minutes, for the message a 429 shows the learner."""
    return max(1, int(get_settings().copilot_rate_window_seconds) // 60)
