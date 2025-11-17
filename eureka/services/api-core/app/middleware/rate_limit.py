"""
Rate Limiting Middleware

Implements rate limiting using Redis to prevent abuse and ensure fair usage.
"""

import time
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Optional, Callable
import redis.asyncio as aioredis
import logging

from app.core.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limiting middleware using Redis.

    Implements sliding window rate limiting with different limits for:
    - Anonymous users (by IP)
    - Authenticated users (by user ID)
    - Different endpoints can have different limits
    """

    def __init__(
        self,
        app,
        redis_url: Optional[str] = None,
        default_limit: int = 100,
        default_window: int = 60
    ):
        """
        Initialize rate limiter.

        Args:
            app: FastAPI application
            redis_url: Redis connection URL
            default_limit: Default request limit per window
            default_window: Default time window in seconds
        """
        super().__init__(app)
        self.redis_url = redis_url or settings.REDIS_URL
        self.redis_client: Optional[aioredis.Redis] = None
        self.default_limit = default_limit
        self.default_window = default_window

        # Endpoint-specific rate limits (requests per minute)
        self.endpoint_limits = {
            "/api/v1/auth/login": (5, 60),  # 5 requests per minute
            "/api/v1/auth/register": (3, 60),  # 3 requests per minute
            "/api/v1/auth/forgot-password": (3, 300),  # 3 requests per 5 minutes
            "/api/v1/auth/reset-password": (3, 300),
            "/api/v1/tutor/chat": (20, 60),  # 20 AI requests per minute
        }

        # Authenticated users get higher limits
        self.auth_multiplier = 2.0

    async def get_redis_client(self) -> aioredis.Redis:
        """Get or create Redis client."""
        if self.redis_client is None:
            self.redis_client = await aioredis.from_url(
                self.redis_url,
                encoding="utf-8",
                decode_responses=True
            )
        return self.redis_client

    def get_identifier(self, request: Request) -> str:
        """
        Get unique identifier for rate limiting.

        Uses user ID if authenticated, otherwise IP address.

        Args:
            request: FastAPI request object

        Returns:
            Unique identifier string
        """
        # Try to get user ID from request state (set by auth middleware)
        user_id = getattr(request.state, "user_id", None)
        if user_id:
            return f"user:{user_id}"

        # Fall back to IP address
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            ip = forwarded.split(",")[0].strip()
        else:
            ip = request.client.host if request.client else "unknown"

        return f"ip:{ip}"

    def get_limits(self, request: Request, is_authenticated: bool) -> tuple[int, int]:
        """
        Get rate limits for the current request.

        Args:
            request: FastAPI request object
            is_authenticated: Whether user is authenticated

        Returns:
            Tuple of (limit, window_seconds)
        """
        path = request.url.path

        # Check if endpoint has specific limits
        if path in self.endpoint_limits:
            limit, window = self.endpoint_limits[path]
        else:
            limit, window = self.default_limit, self.default_window

        # Authenticated users get higher limits
        if is_authenticated:
            limit = int(limit * self.auth_multiplier)

        return limit, window

    async def check_rate_limit(
        self,
        identifier: str,
        limit: int,
        window: int,
        endpoint: str
    ) -> tuple[bool, dict]:
        """
        Check if request is within rate limit.

        Uses sliding window algorithm with Redis.

        Args:
            identifier: Unique identifier for the client
            limit: Maximum number of requests allowed
            window: Time window in seconds
            endpoint: API endpoint path

        Returns:
            Tuple of (is_allowed, rate_limit_info)
        """
        redis = await self.get_redis_client()
        current_time = time.time()
        window_start = current_time - window

        # Redis key for this identifier and endpoint
        key = f"rate_limit:{identifier}:{endpoint}"

        try:
            # Use Redis sorted set with timestamps as scores
            pipe = redis.pipeline()

            # Remove old entries outside the window
            pipe.zremrangebyscore(key, 0, window_start)

            # Count requests in current window
            pipe.zcard(key)

            # Add current request
            pipe.zadd(key, {str(current_time): current_time})

            # Set expiry on the key
            pipe.expire(key, window)

            # Execute pipeline
            results = await pipe.execute()
            request_count = results[1]  # Count before adding current request

            # Check if limit exceeded
            is_allowed = request_count < limit

            # Calculate reset time
            reset_time = int(current_time + window)

            rate_limit_info = {
                "limit": limit,
                "remaining": max(0, limit - request_count - 1),
                "reset": reset_time,
                "retry_after": window if not is_allowed else None
            }

            return is_allowed, rate_limit_info

        except Exception as e:
            logger.error(f"Rate limit check failed: {e}")
            # On Redis failure, allow the request (fail open)
            return True, {
                "limit": limit,
                "remaining": limit,
                "reset": int(current_time + window)
            }

    async def dispatch(self, request: Request, call_next: Callable):
        """
        Process request with rate limiting.

        Args:
            request: FastAPI request object
            call_next: Next middleware in chain

        Returns:
            Response object
        """
        # Skip rate limiting for health check and docs
        if request.url.path in ["/health", "/", "/docs", "/redoc", "/openapi.json"]:
            return await call_next(request)

        # Get identifier and limits
        identifier = self.get_identifier(request)
        is_authenticated = "user:" in identifier
        limit, window = self.get_limits(request, is_authenticated)

        # Check rate limit
        is_allowed, rate_info = await self.check_rate_limit(
            identifier, limit, window, request.url.path
        )

        # Add rate limit headers to response
        async def add_rate_limit_headers(response):
            response.headers["X-RateLimit-Limit"] = str(rate_info["limit"])
            response.headers["X-RateLimit-Remaining"] = str(rate_info["remaining"])
            response.headers["X-RateLimit-Reset"] = str(rate_info["reset"])
            return response

        if not is_allowed:
            # Rate limit exceeded
            logger.warning(
                f"Rate limit exceeded for {identifier} on {request.url.path}"
            )

            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please try again later.",
                headers={
                    "X-RateLimit-Limit": str(rate_info["limit"]),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(rate_info["reset"]),
                    "Retry-After": str(rate_info["retry_after"])
                }
            )

        # Process request
        response = await call_next(request)

        # Add rate limit headers
        response = await add_rate_limit_headers(response)

        return response


# Decorator for applying rate limits to specific endpoints
def rate_limit(limit: int, window: int = 60):
    """
    Decorator to apply custom rate limits to specific endpoints.

    Args:
        limit: Maximum number of requests
        window: Time window in seconds

    Usage:
        @app.get("/api/resource")
        @rate_limit(limit=10, window=60)
        async def get_resource():
            ...
    """
    def decorator(func):
        func._rate_limit = (limit, window)
        return func
    return decorator
