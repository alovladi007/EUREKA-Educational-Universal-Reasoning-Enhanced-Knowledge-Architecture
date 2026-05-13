"""
TOTP MFA helpers (Session 3.3, 2026-05).

Responsibilities:
- Generate a per-user TOTP secret, encrypt it with the Fernet envelope key.
- Build provisioning URIs for authenticator apps (Google Authenticator, 1Password, etc.).
- Verify a 6-digit TOTP code against the stored encrypted secret (allowing a
  ±1-step drift to cope with clock skew).
- Generate and verify single-use recovery codes (also Fernet-encrypted at rest).

Security notes:
- The Fernet envelope key (settings.MFA_ENVELOPE_KEY) MUST persist across
  container restarts in production — otherwise every user's MFA secret
  becomes unreadable. In dev it's regenerated at boot, which is acceptable
  because dev users can re-enrol.
- Plaintext secrets never touch the DB. Provisioning is a one-shot: the
  setup endpoint returns the otpauth:// URI once; if the user loses it
  before verifying, they have to disable and re-setup.
- Recovery codes are stored hashed and Fernet-encrypted, single-use.
"""

from __future__ import annotations

import base64
import secrets
from typing import List, Tuple

import pyotp
from cryptography.fernet import Fernet, InvalidToken

from app.core.config import settings


# Number of recovery codes to issue at enrolment.
RECOVERY_CODE_COUNT = 10
# Format: 5-char groups separated by `-`, e.g. ABCDE-FGHJK.
RECOVERY_CODE_GROUPS = 2
RECOVERY_CODE_GROUP_LEN = 5


def _envelope() -> Fernet:
    """
    Build the Fernet instance from settings.MFA_ENVELOPE_KEY.

    The key may be either a urlsafe-base64 32-byte key (Fernet's native
    format) or any string we can derive 32 bytes from. We accept both
    forms to be friendly to operators who paste a random string.
    """
    raw = settings.MFA_ENVELOPE_KEY
    if not raw:
        raise RuntimeError(
            "MFA_ENVELOPE_KEY is not set. In production, set this to a stable "
            "Fernet key (`python -c 'from cryptography.fernet import Fernet; "
            "print(Fernet.generate_key().decode())'`). In dev it's generated "
            "at boot — see app/core/config.py."
        )
    try:
        # If it's already a Fernet key, this works directly.
        return Fernet(raw.encode() if isinstance(raw, str) else raw)
    except (ValueError, TypeError):
        # Fall back to deriving a Fernet key from arbitrary input.
        digest = base64.urlsafe_b64encode(
            __import__("hashlib").sha256(raw.encode()).digest()
        )
        return Fernet(digest)


def encrypt(plaintext: str) -> str:
    """Return a Fernet ciphertext (str) for a plaintext secret."""
    return _envelope().encrypt(plaintext.encode()).decode()


def decrypt(ciphertext: str) -> str:
    """Return the plaintext for a Fernet ciphertext. Raises on tamper/wrong-key."""
    return _envelope().decrypt(ciphertext.encode()).decode()


def generate_totp_secret() -> str:
    """Generate a fresh base32 TOTP secret (160 bits) suitable for pyotp."""
    return pyotp.random_base32()


def provisioning_uri(secret: str, email: str) -> str:
    """
    Build the otpauth:// URI the authenticator app needs to enrol the user.

    The URI embeds the issuer (settings.MFA_ISSUER) and account name (email).
    Apps render this as a QR code; we return the raw string and let the
    frontend render the QR (or copy/paste).
    """
    return pyotp.TOTP(secret).provisioning_uri(name=email, issuer_name=settings.MFA_ISSUER)


def verify_totp(secret: str, code: str, *, drift_windows: int = 1) -> bool:
    """
    Verify a 6-digit TOTP code with a ±drift_windows step tolerance.

    drift_windows=1 means we accept the current code plus one step in each
    direction (so 30s before, current 30s, and 30s after). That's standard
    practice to absorb mild clock skew.
    """
    if not code or not code.strip().isdigit():
        return False
    return pyotp.TOTP(secret).verify(code.strip(), valid_window=drift_windows)


def generate_recovery_codes(count: int = RECOVERY_CODE_COUNT) -> List[str]:
    """Generate count human-readable single-use recovery codes."""
    codes = []
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # no 0/O/1/I to avoid confusion
    for _ in range(count):
        groups = [
            "".join(secrets.choice(alphabet) for _ in range(RECOVERY_CODE_GROUP_LEN))
            for _ in range(RECOVERY_CODE_GROUPS)
        ]
        codes.append("-".join(groups))
    return codes


def encrypt_recovery_codes(codes: List[str]) -> List[str]:
    """Encrypt each recovery code under the Fernet envelope."""
    return [encrypt(c) for c in codes]


def consume_recovery_code(
    stored_ciphertexts: List[str], submitted_code: str
) -> Tuple[bool, List[str]]:
    """
    If submitted_code matches one of the stored Fernet-encrypted codes,
    return (True, new_list_minus_that_code). Otherwise (False, stored_ciphertexts).

    Comparison is constant-time per candidate; the linear scan over up to
    RECOVERY_CODE_COUNT (10) entries is fine.
    """
    if not submitted_code or not stored_ciphertexts:
        return False, stored_ciphertexts
    target = submitted_code.strip().upper()
    remaining: List[str] = []
    matched = False
    for ct in stored_ciphertexts:
        if matched:
            remaining.append(ct)
            continue
        try:
            plain = decrypt(ct)
        except InvalidToken:
            # Skip un-decryptable entries; treat as already used.
            continue
        if secrets.compare_digest(plain, target):
            matched = True
            continue
        remaining.append(ct)
    return matched, remaining


def role_requires_mfa(role: str | None) -> bool:
    """True if the user's role mandates MFA per settings.MFA_REQUIRED_ROLES."""
    if not role:
        return False
    return role in set(settings.MFA_REQUIRED_ROLES)
