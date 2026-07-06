"""Email delivery behind a swappable sender.

Mirrors the identity and reasoning seams: notifications reach a user's inbox
in-app always, and can also be emailed through a provider chosen by config. The
console sender logs the message (honest for dev and tests, sends nothing); the
SMTP sender delivers over SMTP in production. Both fail soft and return a bool,
so a delivery failure never breaks the notification that triggered it.

Delivery runs on the Celery worker, so a slow SMTP server never blocks a request.
"""

from __future__ import annotations

import logging
import smtplib
from email.message import EmailMessage
from functools import lru_cache
from typing import Protocol

from app.core.config import get_settings

logger = logging.getLogger("axiom.email")


class EmailSender(Protocol):
    def send(self, to: str, subject: str, body: str) -> bool: ...


class ConsoleEmailSender:
    """Logs the email instead of sending it. Development and tests only."""

    def send(self, to: str, subject: str, body: str) -> bool:
        logger.info("EMAIL (console) to=%s subject=%s", to, subject)
        return True


class SmtpEmailSender:
    """Sends over SMTP. Fails soft: a delivery error is logged and returns False.

    Credentials are supplied by configuration (from the environment in
    production), never stored in code.
    """

    def __init__(
        self,
        host: str,
        port: int,
        user: str,
        password: str,
        sender: str,
        use_tls: bool,
    ):
        self._host = host
        self._port = port
        self._user = user
        self._password = password
        self._sender = sender
        self._use_tls = use_tls

    def send(self, to: str, subject: str, body: str) -> bool:
        if not to:
            return False
        message = EmailMessage()
        message["From"] = self._sender
        message["To"] = to
        message["Subject"] = subject
        message.set_content(body)
        try:
            with smtplib.SMTP(self._host, self._port, timeout=10) as server:
                if self._use_tls:
                    server.starttls()
                if self._user:
                    server.login(self._user, self._password)
                server.send_message(message)
            return True
        except Exception:
            logger.warning("SMTP send to %s failed", to, exc_info=True)
            return False


@lru_cache
def get_email_sender() -> EmailSender:
    """Return the configured sender. Cached and argument-free so the unhashable
    Settings never enters the lru_cache, matching the identity provider."""
    settings = get_settings()
    if settings.email_provider == "smtp":
        return SmtpEmailSender(
            host=settings.smtp_host,
            port=settings.smtp_port,
            user=settings.smtp_user,
            password=settings.smtp_password,
            sender=settings.email_from,
            use_tls=settings.smtp_use_tls,
        )
    return ConsoleEmailSender()
