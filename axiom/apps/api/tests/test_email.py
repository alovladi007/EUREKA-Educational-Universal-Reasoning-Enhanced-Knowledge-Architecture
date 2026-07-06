"""Email delivery: the swappable sender and its fail-soft behavior."""

from __future__ import annotations

from app.domains.notifications.email import (
    ConsoleEmailSender,
    SmtpEmailSender,
    get_email_sender,
)


def test_console_sender_reports_success():
    assert ConsoleEmailSender().send("a@example.com", "Subject", "Body") is True


def test_smtp_sender_fails_soft_on_unreachable_host():
    # Nothing listens on this port, so the connection is refused. The sender must
    # return False rather than raise, so a delivery failure never cascades.
    sender = SmtpEmailSender(
        host="127.0.0.1", port=59999, user="", password="", sender="a@example.com", use_tls=False
    )
    assert sender.send("b@example.com", "Subject", "Body") is False


def test_smtp_sender_rejects_empty_recipient():
    sender = SmtpEmailSender(
        host="localhost", port=25, user="", password="", sender="a@example.com", use_tls=False
    )
    assert sender.send("", "Subject", "Body") is False


def test_get_email_sender_defaults_to_console():
    get_email_sender.cache_clear()
    assert isinstance(get_email_sender(), ConsoleEmailSender)
