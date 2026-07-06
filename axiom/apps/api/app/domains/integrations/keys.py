"""The LTI tool's RSA key and its public JWKS.

LTI 1.3 signs with RS256, so the tool needs an RSA key pair: the private key
signs the AGS/token client-credentials assertions, and the public key is
published at the tool's JWKS endpoint so a platform can verify them.

In production the key is supplied via settings.lti_tool_private_key (a stable
PEM) so the JWKS key id (kid) does not change across restarts. In development,
if none is set, an ephemeral 2048-bit key is generated once per process, which
is fine for local testing (the kid is stable for the life of the process).
"""

from __future__ import annotations

import base64
import hashlib
from functools import lru_cache

import jwt
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.asymmetric.rsa import RSAPrivateKey

from app.core.config import get_settings


def _b64url_uint(value: int) -> str:
    raw = value.to_bytes((value.bit_length() + 7) // 8, "big")
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("ascii")


@lru_cache
def _private_key() -> RSAPrivateKey:
    pem = get_settings().lti_tool_private_key
    if pem:
        key = serialization.load_pem_private_key(pem.encode("utf-8"), password=None)
        if not isinstance(key, RSAPrivateKey):
            raise ValueError("lti_tool_private_key must be an RSA private key")
        return key
    return rsa.generate_private_key(public_exponent=65537, key_size=2048)


def private_pem() -> str:
    return _private_key().private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    ).decode("utf-8")


@lru_cache
def kid() -> str:
    """A stable key id derived from the public key modulus."""
    numbers = _private_key().public_key().public_numbers()
    digest = hashlib.sha256(str(numbers.n).encode("ascii")).hexdigest()
    return digest[:16]


def public_jwks() -> dict:
    """The tool's public key set, in the JWKS shape a platform expects."""
    numbers = _private_key().public_key().public_numbers()
    return {
        "keys": [
            {
                "kty": "RSA",
                "use": "sig",
                "alg": "RS256",
                "kid": kid(),
                "n": _b64url_uint(numbers.n),
                "e": _b64url_uint(numbers.e),
            }
        ]
    }


def sign_rs256(claims: dict) -> str:
    """Sign claims with the tool's private key (for AGS/token assertions)."""
    return jwt.encode(claims, private_pem(), algorithm="RS256", headers={"kid": kid()})
