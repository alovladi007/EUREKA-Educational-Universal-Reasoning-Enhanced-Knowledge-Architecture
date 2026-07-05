"""Auth: token verification and the EUREKA SSO bridge."""

from __future__ import annotations


async def test_me_requires_token(client):
    resp = await client.get("/api/v1/me")
    assert resp.status_code == 401


async def test_me_with_token_syncs_user(client):
    # The mock identity provider ignores the token value but a bearer must be
    # present. This proves verify -> sync -> UserOut end to end.
    resp = await client.get("/api/v1/me", headers={"Authorization": "Bearer devtoken"})
    assert resp.status_code == 200
    body = resp.json()
    assert body["display_name"] == "Dev Student"
    assert body["roles"] == ["student"]
    assert body["eureka_user_id"]


async def test_me_is_idempotent(client):
    # Two calls for the same principal must not create duplicate users or roles.
    first = await client.get("/api/v1/me", headers={"Authorization": "Bearer a"})
    second = await client.get("/api/v1/me", headers={"Authorization": "Bearer b"})
    assert first.status_code == second.status_code == 200
    assert first.json()["id"] == second.json()["id"]
    assert second.json()["roles"] == ["student"]


def test_hmac_identity_verifies_real_token():
    # Unit test the HMAC verifier against a token minted the way EUREKA does.
    import jwt

    from app.core.security import HmacJwtEurekaIdentity

    secret = "unit-test-secret"
    token = jwt.encode(
        {"sub": "abc-123", "email": "s@example.com", "role": "teacher"},
        secret,
        algorithm="HS256",
    )
    identity = HmacJwtEurekaIdentity(secret=secret, algorithm="HS256")
    principal = identity.verify(token)
    assert principal.sub == "abc-123"
    assert principal.email == "s@example.com"
    assert principal.roles == ["teacher"]


def test_hmac_identity_rejects_bad_signature():
    import pytest

    from app.core.security import HmacJwtEurekaIdentity, InvalidTokenError

    identity = HmacJwtEurekaIdentity(secret="right-secret")
    bad = __import__("jwt").encode({"sub": "x"}, "wrong-secret", algorithm="HS256")
    with pytest.raises(InvalidTokenError):
        identity.verify(bad)
