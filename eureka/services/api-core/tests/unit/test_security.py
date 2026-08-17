"""
Unit tests for security utilities (password hashing, JWT tokens)
"""

import pytest
from datetime import datetime, timedelta
from jose import jwt, JWTError

# `app.core.security` has never existed in this service. The password and JWT
# helpers live in `app.utils.auth`, which is what the application itself
# imports, and the hashing helper is named `hash_password` there. This file
# therefore failed at COLLECTION, which aborts the entire pytest run before a
# single test executes — and because CI only ever invoked `test_phase*.py`, the
# breakage was invisible to the pipeline.
from app.utils.auth import (
    hash_password as get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_token,
)
from app.core.config import get_settings

settings = get_settings()


@pytest.mark.unit
class TestPasswordHashing:
    """Test password hashing functionality."""

    def test_password_hash_creates_different_hashes(self):
        """Test that same password creates different hashes."""
        password = "testpassword123"
        hash1 = get_password_hash(password)
        hash2 = get_password_hash(password)

        assert hash1 != hash2
        assert hash1 != password
        assert hash2 != password

    def test_verify_password_correct(self):
        """Test password verification with correct password."""
        password = "testpassword123"
        hashed = get_password_hash(password)

        assert verify_password(password, hashed) is True

    def test_verify_password_incorrect(self):
        """Test password verification with incorrect password."""
        password = "testpassword123"
        wrong_password = "wrongpassword"
        hashed = get_password_hash(password)

        assert verify_password(wrong_password, hashed) is False

    def test_password_hash_not_empty(self):
        """Test that password hash is not empty."""
        password = "testpassword123"
        hashed = get_password_hash(password)

        assert hashed
        assert len(hashed) > 0


@pytest.mark.unit
class TestJWTTokens:
    """Test JWT token creation and verification."""

    def test_create_access_token(self):
        """Test access token creation."""
        data = {
            "sub": "user123",
            "email": "test@example.com",
            "role": "student"
        }

        token = create_access_token(data)

        assert token
        assert isinstance(token, str)

        # Decode and verify
        decoded = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )

        assert decoded["sub"] == "user123"
        assert decoded["email"] == "test@example.com"
        assert decoded["role"] == "student"
        assert "exp" in decoded

    def test_create_refresh_token(self):
        """Test refresh token creation."""
        data = {"sub": "user123"}

        token = create_refresh_token(data)

        assert token
        assert isinstance(token, str)

        decoded = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )

        assert decoded["sub"] == "user123"
        assert "exp" in decoded

    def test_access_token_expiration(self):
        """Test that access token has correct expiration."""
        data = {"sub": "user123"}
        expires_delta = timedelta(minutes=30)

        token = create_access_token(data, expires_delta)
        decoded = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )

        exp_timestamp = decoded["exp"]
        exp_datetime = datetime.fromtimestamp(exp_timestamp)
        now = datetime.utcnow()

        # Should expire in approximately 30 minutes
        time_diff = exp_datetime - now
        assert 29 * 60 < time_diff.total_seconds() < 31 * 60

    def test_verify_token_valid(self):
        """Test token verification with valid token."""
        data = {"sub": "user123", "email": "test@example.com"}
        token = create_access_token(data)

        payload = verify_token(token)

        assert payload is not None
        assert payload["sub"] == "user123"
        assert payload["email"] == "test@example.com"

    # These three asserted `verify_token(...) is None`, the contract of the
    # `app.core.security` module this file was written against — a module that
    # has never existed here. The real `app.utils.auth.verify_token` RAISES
    # JWTError, as its own docstring states, and that is the safer contract:
    # a caller who forgets to check a None return carries on with an invalid
    # token, whereas an exception cannot be ignored by accident. The code is
    # right; the expectation was fiction. Rewritten to assert the rejection.

    def test_verify_token_invalid(self):
        """A structurally invalid token must be rejected, not returned."""
        with pytest.raises(JWTError):
            verify_token("invalid.token.here")

    def test_verify_token_expired(self):
        """An expired token must be rejected."""
        token = create_access_token({"sub": "user123"}, timedelta(seconds=-1))

        with pytest.raises(JWTError):
            verify_token(token)


@pytest.mark.unit
class TestTokenSecurity:
    """Test token security features."""

    def test_token_includes_required_claims(self):
        """Test that token includes all required claims."""
        data = {
            "sub": "user123",
            "email": "test@example.com",
            "org_id": "org123",
            "role": "student"
        }

        token = create_access_token(data)
        decoded = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )

        assert "sub" in decoded
        assert "email" in decoded
        assert "org_id" in decoded
        assert "role" in decoded
        assert "exp" in decoded
        assert "iat" in decoded

    def test_token_cannot_be_tampered(self):
        """Test that tampering with token makes it invalid."""
        data = {"sub": "user123", "role": "student"}
        token = create_access_token(data)

        # Tamper with the token
        parts = token.split('.')
        assert len(parts) == 3, "a JWT must have three segments to tamper with"

        # Change a character in the payload
        tampered_token = f"{parts[0]}.{parts[1][:-1]}X.{parts[2]}"

        # Must be rejected outright. The original `if len(parts) == 3:` guard
        # meant a malformed token would have skipped the assertion entirely and
        # the test would have passed without checking anything.
        with pytest.raises(JWTError):
            verify_token(tampered_token)
