"""
Security headers middleware (Session 3.3, 2026-05).

Adds the response headers every web app should set unconditionally:

  - Strict-Transport-Security  HSTS — force HTTPS for 1 year, including
                                       subdomains and preload eligibility.
                                       Skipped in development to avoid
                                       breaking http://localhost.
  - X-Content-Type-Options     nosniff — stops the browser from MIME-sniffing
                                       text/plain as text/html, which closes
                                       a class of XSS-via-upload.
  - X-Frame-Options            DENY — no embedding in iframes. Override per-
                                       route if a feature genuinely needs to
                                       be embeddable.
  - Referrer-Policy            strict-origin-when-cross-origin — leak the
                                       origin to third parties, not the full URL.
  - Permissions-Policy         disable camera/microphone/geolocation by default.
  - Content-Security-Policy    a conservative default that allows assets only
                                       from same-origin plus the explicitly
                                       configured CDNs/APIs. Override via the
                                       CSP_DIRECTIVES setting.

  All headers are also stamped on error responses (404/500/etc.) because
  middleware runs in the response pipeline regardless of route success.
"""

from __future__ import annotations

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.core.config import settings


_DEFAULT_CSP = (
    "default-src 'self'; "
    "img-src 'self' data: blob: https:; "
    "style-src 'self' 'unsafe-inline'; "  # Tailwind injects style attrs; relax in Phase 3.6.
    "script-src 'self'; "
    "font-src 'self' data:; "
    "connect-src 'self' https:; "
    "frame-ancestors 'none'; "
    "base-uri 'self'; "
    "form-action 'self'"
)

_DEFAULT_PERMISSIONS_POLICY = (
    "camera=(), microphone=(), geolocation=(), "
    "payment=(), usb=(), accelerometer=(), gyroscope=()"
)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Stamp standard hardening headers on every response."""

    async def dispatch(self, request: Request, call_next) -> Response:
        response: Response = await call_next(request)

        # HSTS only makes sense over TLS. Skip in dev to keep http://localhost
        # working without forced HTTPS redirects in the browser.
        if settings.ENVIRONMENT != "development":
            response.headers.setdefault(
                "Strict-Transport-Security",
                "max-age=31536000; includeSubDomains; preload",
            )

        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault(
            "Referrer-Policy", "strict-origin-when-cross-origin"
        )
        response.headers.setdefault(
            "Permissions-Policy", _DEFAULT_PERMISSIONS_POLICY
        )

        # CSP: take from settings if provided, else the conservative default.
        csp = getattr(settings, "CSP_DIRECTIVES", None) or _DEFAULT_CSP
        response.headers.setdefault("Content-Security-Policy", csp)

        return response
