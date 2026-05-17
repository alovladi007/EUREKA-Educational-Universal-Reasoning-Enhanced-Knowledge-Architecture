"""
Phase 14.1 — tiny Redis cache helper.

Public surface:
    await cache.get(key) -> Any | None
    await cache.set(key, value, ttl_seconds)
    await cache.delete(key, *more_keys)
    await cache.delete_pattern("eureka:leaderboard:*")
    async with cache.cached(key, ttl, builder=...) as result: ...

Redis is optional. When `REDIS_URL` is not set, the module degrades to an
in-process dict with TTL eviction — fine for dev/CI/tests, irrelevant for
prod because the deploy will always set REDIS_URL.
"""

from __future__ import annotations

import asyncio
import json
import os
import time
from contextlib import asynccontextmanager
from dataclasses import dataclass, field
from typing import Any, Awaitable, Callable, Optional


# ---------------------------------------------------------------------------
# Optional async-redis import. Don't blow up if the package isn't installed.
# ---------------------------------------------------------------------------

try:
    import redis.asyncio as redis_lib  # type: ignore
    _HAS_REDIS = True
except Exception:
    _HAS_REDIS = False
    redis_lib = None  # type: ignore


@dataclass
class _InMemoryCache:
    """Fallback cache used when Redis is unavailable."""
    store: dict[str, tuple[float, str]] = field(default_factory=dict)
    lock: asyncio.Lock = field(default_factory=asyncio.Lock)
    hits: int = 0
    misses: int = 0

    async def get(self, key: str) -> Optional[str]:
        async with self.lock:
            row = self.store.get(key)
            if row is None:
                self.misses += 1
                return None
            expires_at, value = row
            if expires_at and expires_at < time.time():
                self.store.pop(key, None)
                self.misses += 1
                return None
            self.hits += 1
            return value

    async def set(self, key: str, value: str, ttl: int) -> None:
        async with self.lock:
            expires_at = time.time() + ttl if ttl > 0 else 0
            self.store[key] = (expires_at, value)

    async def delete(self, *keys: str) -> int:
        async with self.lock:
            removed = 0
            for k in keys:
                if k in self.store:
                    del self.store[k]
                    removed += 1
            return removed

    async def delete_pattern(self, pattern: str) -> int:
        # Lightweight glob match: handles "*" only.
        prefix, _, suffix = pattern.partition("*")
        async with self.lock:
            to_drop = [
                k for k in self.store
                if k.startswith(prefix) and (suffix == "" or k.endswith(suffix))
            ]
            for k in to_drop:
                del self.store[k]
            return len(to_drop)

    async def health(self) -> dict:
        return {
            "backend": "memory",
            "keys": len(self.store),
            "hits": self.hits,
            "misses": self.misses,
        }


# ---------------------------------------------------------------------------
# Top-level facade
# ---------------------------------------------------------------------------


_redis: Any = None
_memory = _InMemoryCache()


def _resolve_redis() -> Optional[Any]:
    """Lazy connect to Redis if REDIS_URL is set and the lib is available."""
    global _redis
    if _redis is not None:
        return _redis
    if not _HAS_REDIS:
        return None
    url = os.environ.get("REDIS_URL")
    if not url:
        return None
    try:
        _redis = redis_lib.from_url(url, decode_responses=True)
    except Exception:
        _redis = None
    return _redis


async def get(key: str) -> Optional[Any]:
    r = _resolve_redis()
    raw: Optional[str]
    if r is not None:
        try:
            raw = await r.get(key)
        except Exception:
            raw = None
    else:
        raw = await _memory.get(key)
    if raw is None:
        return None
    try:
        return json.loads(raw)
    except Exception:
        return raw


async def set(key: str, value: Any, ttl_seconds: int = 60) -> None:
    payload = json.dumps(value, default=str)
    r = _resolve_redis()
    if r is not None:
        try:
            await r.set(key, payload, ex=ttl_seconds if ttl_seconds > 0 else None)
            return
        except Exception:
            pass
    await _memory.set(key, payload, ttl_seconds)


async def delete(*keys: str) -> int:
    if not keys:
        return 0
    r = _resolve_redis()
    if r is not None:
        try:
            return int(await r.delete(*keys))
        except Exception:
            pass
    return await _memory.delete(*keys)


async def delete_pattern(pattern: str) -> int:
    """Delete every key matching `pattern` (supports a single `*` wildcard)."""
    r = _resolve_redis()
    if r is not None:
        try:
            total = 0
            async for k in r.scan_iter(pattern):
                total += int(await r.delete(k))
            return total
        except Exception:
            pass
    return await _memory.delete_pattern(pattern)


async def health() -> dict:
    r = _resolve_redis()
    if r is not None:
        try:
            pong = await r.ping()
            info = {"backend": "redis", "ping": bool(pong)}
            return info
        except Exception as exc:
            return {"backend": "redis", "ping": False, "error": str(exc)}
    return await _memory.health()


@asynccontextmanager
async def cached(
    key: str,
    *,
    ttl_seconds: int = 60,
    builder: Optional[Callable[[], Awaitable[Any]]] = None,
):
    """
    Async context manager that yields (value, hit_flag).

    Use like:
        async with cache.cached("leaderboard:7d", ttl_seconds=60, builder=build) as (rows, hit):
            return rows

    Builder is awaited only on miss; the result is stored before yielding.
    """
    value = await get(key)
    if value is not None:
        yield value, True
        return
    if builder is None:
        yield None, False
        return
    built = await builder()
    if built is not None:
        await set(key, built, ttl_seconds=ttl_seconds)
    yield built, False
