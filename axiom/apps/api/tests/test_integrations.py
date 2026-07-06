"""Tests for LTI 1.3 and OneRoster integrations.

The LTI handshake is exercised end to end offline: a test RSA key stands in for
the platform, we register it, run OIDC login to obtain a state/nonce, sign an
id_token, and launch. Signature and nonce failures are checked too. OneRoster
sync is checked to upsert users and enrollments.
"""

from __future__ import annotations

import time
import urllib.parse

import jwt
import pytest
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.domains.identity.models import Enrollment, RoleAssignment, User
from app.domains.integrations import lti
from tests.conftest import AUTH


def _user_query(eureka_id: str):
    return (
        select(User)
        .where(User.eureka_user_id == eureka_id)
        .options(selectinload(User.role_assignments).selectinload(RoleAssignment.role))
    )

ISSUER = "https://lms.example.edu"
CLIENT_ID = "axiom-tool-123"
CLAIM = "https://purl.imsglobal.org/spec/lti/claim"


def _keypair():
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    private_pem = key.private_bytes(
        serialization.Encoding.PEM,
        serialization.PrivateFormat.PKCS8,
        serialization.NoEncryption(),
    ).decode()
    public_pem = (
        key.public_key()
        .public_bytes(
            serialization.Encoding.PEM,
            serialization.PublicFormat.SubjectPublicKeyInfo,
        )
        .decode()
    )
    return private_pem, public_pem


async def _register_platform(client, public_pem: str):
    body = {
        "issuer": ISSUER,
        "client_id": CLIENT_ID,
        "auth_login_url": "https://lms.example.edu/auth",
        "auth_token_url": "https://lms.example.edu/token",
        "public_key_pem": public_pem,
    }
    return await client.post("/api/v1/integrations/lti/platforms", json=body, headers=AUTH)


async def _login_state_nonce(client) -> tuple[str, str]:
    res = await client.get(
        "/api/v1/integrations/lti/login",
        params={
            "iss": ISSUER,
            "login_hint": "user-42",
            "target_link_uri": "http://localhost:8400/api/v1/integrations/lti/launch",
        },
    )
    assert res.status_code == 302, res.text
    loc = res.headers["location"]
    q = urllib.parse.parse_qs(urllib.parse.urlparse(loc).query)
    return q["state"][0], q["nonce"][0]


def _id_token(private_pem: str, nonce: str, *, aud: str = CLIENT_ID) -> str:
    claims = {
        "iss": ISSUER,
        "aud": aud,
        "sub": "user-42",
        "nonce": nonce,
        "exp": int(time.time()) + 300,
        "iat": int(time.time()),
        "email": "learner@example.edu",
        "name": "Ada Learner",
        f"{CLAIM}/message_type": "LtiResourceLinkRequest",
        f"{CLAIM}/roles": [
            "http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor"
        ],
        f"{CLAIM}/resource_link": {"id": "rl-1"},
        f"{CLAIM}/context": {"id": "course-9"},
    }
    return jwt.encode(claims, private_pem, algorithm="RS256")


# --- unit: role mapping --------------------------------------------------


def test_role_mapping():
    assert "teacher" in lti.map_lti_roles(
        ["http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor"]
    )
    assert lti.map_lti_roles(["...#Learner"]) == ["student"]
    assert lti.map_lti_roles([]) == ["student"]


# --- LTI handshake -------------------------------------------------------


@pytest.mark.asyncio
async def test_jwks_is_served(client):
    res = await client.get("/api/v1/integrations/lti/jwks")
    assert res.status_code == 200
    keys = res.json()["keys"]
    assert keys and keys[0]["kty"] == "RSA" and keys[0]["alg"] == "RS256"


@pytest.mark.asyncio
async def test_platform_registration_is_admin_only(client):
    _priv, pub = _keypair()
    res = await _register_platform(client, pub)  # default mock is a student
    assert res.status_code == 403


@pytest.mark.asyncio
async def test_launch_redirects_with_a_session_token(as_admin, client):
    private_pem, public_pem = _keypair()
    assert (await _register_platform(client, public_pem)).status_code == 200
    state, nonce = await _login_state_nonce(client)
    token = _id_token(private_pem, nonce)
    res = await client.post(
        "/api/v1/integrations/lti/launch",
        data={"id_token": token, "state": state},
    )
    assert res.status_code == 302, res.text
    assert "access_token=" in res.headers["location"]


@pytest.mark.asyncio
async def test_launch_rejects_bad_signature(as_admin, client):
    _private_pem, public_pem = _keypair()
    other_private, _ = _keypair()
    assert (await _register_platform(client, public_pem)).status_code == 200
    state, nonce = await _login_state_nonce(client)
    # Signed with a key that does not match the registered public key.
    token = _id_token(other_private, nonce)
    res = await client.post(
        "/api/v1/integrations/lti/launch",
        data={"id_token": token, "state": state},
    )
    assert res.status_code == 400


@pytest.mark.asyncio
async def test_launch_rejects_nonce_mismatch(as_admin, client):
    private_pem, public_pem = _keypair()
    assert (await _register_platform(client, public_pem)).status_code == 200
    state, _nonce = await _login_state_nonce(client)
    token = _id_token(private_pem, "not-the-nonce")
    res = await client.post(
        "/api/v1/integrations/lti/launch",
        data={"id_token": token, "state": state},
    )
    assert res.status_code == 400


@pytest.mark.asyncio
async def test_launch_maps_roles(as_admin, client, db_session):
    private_pem, public_pem = _keypair()
    assert (await _register_platform(client, public_pem)).status_code == 200
    state, nonce = await _login_state_nonce(client)
    token = _id_token(private_pem, nonce)
    res = await client.post(
        "/api/v1/integrations/lti/launch",
        data={"id_token": token, "state": state},
    )
    assert res.status_code == 302
    user = (await db_session.execute(_user_query("user-42"))).scalar_one()
    assert "teacher" in user.roles


# --- OneRoster -----------------------------------------------------------


@pytest.mark.asyncio
async def test_oneroster_sync_is_admin_only(client):
    res = await client.post("/api/v1/integrations/oneroster/sync", json={}, headers=AUTH)
    assert res.status_code == 403


@pytest.mark.asyncio
async def test_oneroster_sync_upserts_users_and_enrollments(as_admin, client, db_session):
    payload = {
        "users": [
            {
                "sourcedId": "or-user-1",
                "email": "t@example.edu",
                "givenName": "Grace",
                "familyName": "Hopper",
                "role": "teacher",
            }
        ],
        "enrollments": [
            {"userSourcedId": "or-user-1", "classSourcedId": "MATH-101", "role": "teacher"}
        ],
    }
    res = await client.post("/api/v1/integrations/oneroster/sync", json=payload, headers=AUTH)
    assert res.status_code == 200, res.text
    assert res.json() == {"users_synced": 1, "enrollments_synced": 1}

    user = (await db_session.execute(_user_query("or-user-1"))).scalar_one()
    assert "teacher" in user.roles
    enrollment = (
        await db_session.execute(
            select(Enrollment).where(Enrollment.user_id == user.id)
        )
    ).scalar_one()
    assert enrollment.course_ref == "MATH-101"
