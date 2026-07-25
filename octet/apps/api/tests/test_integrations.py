"""Tests for the LTI 1.3 tool provider.

The handshake is exercised end to end offline: a test RSA key stands in for the
platform, we register it, run OIDC login to obtain a state and nonce, sign an
id_token, and launch. The adversarial cases carry the weight here. The launch
endpoint is the one unauthenticated route that can mint an OCTET session, so a
tampered signature, a replayed nonce, a state we never issued and an expired
token are all asserted to be refused rather than merely assumed to be.
"""

from __future__ import annotations

import time
import urllib.parse

import jwt
import pytest
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from sqlalchemy import select

from app.domains.integrations import keys, lti
from app.domains.integrations.models import LtiLaunch

ISSUER = "https://lms.example.edu"
CLIENT_ID = "octet-tool-123"
CLAIM = "https://purl.imsglobal.org/spec/lti/claim"
BASE = "/api/v1/integrations"


def _keypair() -> tuple[str, str]:
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


async def _register_platform(client, public_pem: str, headers: dict):
    body = {
        "issuer": ISSUER,
        "client_id": CLIENT_ID,
        "auth_login_url": "https://lms.example.edu/auth",
        "auth_token_url": "https://lms.example.edu/token",
        "public_key_pem": public_pem,
    }
    return await client.post(f"{BASE}/lti/platforms", json=body, headers=headers)


async def _login_state_nonce(client) -> tuple[str, str]:
    res = await client.get(
        f"{BASE}/lti/login",
        params={
            "iss": ISSUER,
            "login_hint": "user-42",
            "target_link_uri": f"http://localhost:8500{BASE}/lti/launch",
        },
    )
    assert res.status_code == 302, res.text
    query = urllib.parse.parse_qs(urllib.parse.urlparse(res.headers["location"]).query)
    return query["state"][0], query["nonce"][0]


def _id_token(
    private_pem: str,
    nonce: str,
    *,
    aud: str = CLIENT_ID,
    expires_in: int = 300,
    roles: list[str] | None = None,
) -> str:
    claims = {
        "iss": ISSUER,
        "aud": aud,
        "sub": "user-42",
        "nonce": nonce,
        "exp": int(time.time()) + expires_in,
        "iat": int(time.time()) - 5,
        "email": "learner@example.edu",
        "name": "Ada Learner",
        f"{CLAIM}/message_type": "LtiResourceLinkRequest",
        f"{CLAIM}/roles": roles
        or ["http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor"],
        f"{CLAIM}/resource_link": {"id": "rl-1"},
        f"{CLAIM}/context": {"id": "course-9"},
    }
    return jwt.encode(claims, private_pem, algorithm="RS256")


# ---------------------------------------------------------------------------
# Role mapping
# ---------------------------------------------------------------------------


def test_lti_roles_map_to_octet_roles():
    membership = "http://purl.imsglobal.org/vocab/lis/v2/membership"
    assert lti.map_lti_roles([f"{membership}#Instructor"]) == ["teacher"]
    assert lti.map_lti_roles([f"{membership}#Learner"]) == ["student"]
    assert lti.map_lti_roles([f"{membership}#ContentDeveloper"]) == ["author"]
    assert lti.map_lti_roles(
        ["http://purl.imsglobal.org/vocab/lis/v2/system/person#Administrator"]
    ) == ["org_admin"]
    # An unmapped or absent role floors at student rather than at no role.
    assert lti.map_lti_roles(["urn:lti:role:ims/lis/Mentor"]) == ["student"]
    assert lti.map_lti_roles([]) == ["student"]
    assert lti.map_lti_roles(None) == ["student"]


def test_derived_user_id_is_stable_and_issuer_scoped():
    """The same subject at two platforms must not collapse to one OCTET user."""
    assert lti.derive_user_id(ISSUER, "user-42") == lti.derive_user_id(ISSUER, "user-42")
    assert lti.derive_user_id(ISSUER, "user-42") != lti.derive_user_id(
        "https://other.example.edu", "user-42"
    )


# ---------------------------------------------------------------------------
# JWKS and key hygiene
# ---------------------------------------------------------------------------

_PRIVATE_JWK_MEMBERS = ("d", "p", "q", "dp", "dq", "qi")


@pytest.mark.asyncio
async def test_jwks_publishes_only_active_public_keys(client):
    res = await client.get(f"{BASE}/lti/jwks")
    assert res.status_code == 200
    published = res.json()["keys"]
    # Exactly the key the tool signs with today, and nothing retired alongside.
    assert [k["kid"] for k in published] == [keys.kid()]
    for key in published:
        assert key["kty"] == "RSA"
        assert key["use"] == "sig"
        assert key["alg"] == "RS256"
        for member in _PRIVATE_JWK_MEMBERS:
            assert member not in key, f"JWKS leaked the private member {member}"


@pytest.mark.asyncio
async def test_no_endpoint_returns_private_key_material(client, auth, db_session):
    """No response on this router may carry a private key, either party's.

    The tool's own private key and the platform's registered key are both
    checked, because a launch bug that echoed the registration body back would
    be as bad as one that published the signing key.
    """
    platform_private, platform_public = _keypair()
    admin = auth("org_admin")
    assert (await _register_platform(client, platform_public, admin)).status_code == 200
    state, nonce = await _login_state_nonce(client)
    token = _id_token(platform_private, nonce)

    bodies: list[str] = []
    for response in (
        await client.get(f"{BASE}/lti/jwks"),
        await _register_platform(client, platform_public, admin),
        await client.get(
            f"{BASE}/lti/login",
            params={
                "iss": ISSUER,
                "login_hint": "user-42",
                "target_link_uri": "http://localhost:8500/x",
            },
        ),
        await client.post(f"{BASE}/lti/launch", data={"id_token": token, "state": state}),
    ):
        bodies.append(response.text)
        bodies.append(str(dict(response.headers)))

    launch = (await db_session.execute(select(LtiLaunch))).scalars().first()
    assert launch is not None
    bodies.append(
        (
            await client.post(
                f"{BASE}/lti/launches/{launch.id}/score",
                json={"given": 1.0, "maximum": 1.0},
                headers=auth("teacher"),
            )
        ).text
    )

    tool_private = keys.private_pem()
    for body in bodies:
        assert "PRIVATE KEY" not in body
        assert tool_private not in body
        assert platform_private not in body
        # The PEM base64 body, in case a response re-wrapped the armour.
        for line in tool_private.splitlines()[1:-1]:
            assert line not in body


# ---------------------------------------------------------------------------
# Authorisation on the gated routes
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_platform_registration_is_admin_only(client, auth):
    _private, public = _keypair()
    assert (await _register_platform(client, public, auth("student"))).status_code == 403
    assert (await _register_platform(client, public, auth("org_admin"))).status_code == 200


@pytest.mark.asyncio
async def test_platform_registration_requires_a_token(client):
    _private, public = _keypair()
    res = await client.post(
        f"{BASE}/lti/platforms",
        json={"issuer": ISSUER, "client_id": CLIENT_ID, "auth_login_url": "https://x/auth"},
    )
    assert res.status_code == 403


# ---------------------------------------------------------------------------
# The launch: happy path
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_valid_launch_succeeds_and_records_the_launch(client, auth, db_session):
    private_pem, public_pem = _keypair()
    assert (await _register_platform(client, public_pem, auth("org_admin"))).status_code == 200
    state, nonce = await _login_state_nonce(client)
    res = await client.post(
        f"{BASE}/lti/launch",
        data={"id_token": _id_token(private_pem, nonce), "state": state},
    )
    assert res.status_code == 302, res.text
    assert "access_token=" in res.headers["location"]

    launch = (await db_session.execute(select(LtiLaunch))).scalars().one()
    assert launch.sub == "user-42"
    assert launch.resource_link_id == "rl-1"
    assert launch.context_id == "course-9"
    assert launch.message_type == "LtiResourceLinkRequest"
    assert launch.user_id == lti.derive_user_id(ISSUER, "user-42")


@pytest.mark.asyncio
async def test_launch_token_is_accepted_by_the_octet_identity_layer(client, auth):
    """The launch must resolve to a session OCTET already knows how to verify."""
    from app.core.security import get_identity

    private_pem, public_pem = _keypair()
    assert (await _register_platform(client, public_pem, auth("org_admin"))).status_code == 200
    state, nonce = await _login_state_nonce(client)
    res = await client.post(
        f"{BASE}/lti/launch",
        data={"id_token": _id_token(private_pem, nonce), "state": state},
    )
    token = res.headers["location"].split("access_token=")[1]
    principal = get_identity().verify(token)
    assert principal.user_id == lti.derive_user_id(ISSUER, "user-42")
    assert "teacher" in principal.roles


@pytest.mark.asyncio
async def test_launch_maps_lti_roles_onto_the_session(client, auth, db_session):
    membership = "http://purl.imsglobal.org/vocab/lis/v2/membership"
    private_pem, public_pem = _keypair()
    assert (await _register_platform(client, public_pem, auth("org_admin"))).status_code == 200
    state, nonce = await _login_state_nonce(client)
    res = await client.post(
        f"{BASE}/lti/launch",
        data={
            "id_token": _id_token(private_pem, nonce, roles=[f"{membership}#Learner"]),
            "state": state,
        },
    )
    assert res.status_code == 302
    launch = (await db_session.execute(select(LtiLaunch))).scalars().one()
    assert launch.roles == ["student"]


# ---------------------------------------------------------------------------
# The launch: adversarial cases
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_launch_rejects_a_tampered_signature(client, auth, db_session):
    _private_pem, public_pem = _keypair()
    other_private, _other_public = _keypair()
    assert (await _register_platform(client, public_pem, auth("org_admin"))).status_code == 200
    state, nonce = await _login_state_nonce(client)
    # Correct claims, correct nonce, signed by a key the platform does not own.
    res = await client.post(
        f"{BASE}/lti/launch",
        data={"id_token": _id_token(other_private, nonce), "state": state},
    )
    assert res.status_code == 400
    assert (await db_session.execute(select(LtiLaunch))).scalars().first() is None


@pytest.mark.asyncio
async def test_launch_rejects_a_truncated_signature(client, auth):
    """A payload edited after signing must not verify."""
    private_pem, public_pem = _keypair()
    assert (await _register_platform(client, public_pem, auth("org_admin"))).status_code == 200
    state, nonce = await _login_state_nonce(client)
    header, payload, signature = _id_token(private_pem, nonce).split(".")
    res = await client.post(
        f"{BASE}/lti/launch",
        data={"id_token": f"{header}.{payload}.{signature[:-4]}AAAA", "state": state},
    )
    assert res.status_code == 400


@pytest.mark.asyncio
async def test_launch_rejects_a_replayed_nonce(client, auth, db_session):
    private_pem, public_pem = _keypair()
    assert (await _register_platform(client, public_pem, auth("org_admin"))).status_code == 200
    state, nonce = await _login_state_nonce(client)
    token = _id_token(private_pem, nonce)
    first = await client.post(f"{BASE}/lti/launch", data={"id_token": token, "state": state})
    assert first.status_code == 302
    # The identical launch a second time is a replay and must be refused.
    second = await client.post(f"{BASE}/lti/launch", data={"id_token": token, "state": state})
    assert second.status_code == 400
    assert len((await db_session.execute(select(LtiLaunch))).scalars().all()) == 1


@pytest.mark.asyncio
async def test_launch_rejects_a_nonce_from_another_login(client, auth):
    """A nonce that was issued, but not for this state, is still a mismatch."""
    private_pem, public_pem = _keypair()
    assert (await _register_platform(client, public_pem, auth("org_admin"))).status_code == 200
    state_a, _nonce_a = await _login_state_nonce(client)
    _state_b, nonce_b = await _login_state_nonce(client)
    res = await client.post(
        f"{BASE}/lti/launch",
        data={"id_token": _id_token(private_pem, nonce_b), "state": state_a},
    )
    assert res.status_code == 400


@pytest.mark.asyncio
async def test_launch_rejects_a_mismatched_state(client, auth):
    private_pem, public_pem = _keypair()
    assert (await _register_platform(client, public_pem, auth("org_admin"))).status_code == 200
    _state, nonce = await _login_state_nonce(client)
    res = await client.post(
        f"{BASE}/lti/launch",
        data={"id_token": _id_token(private_pem, nonce), "state": "state-we-never-issued"},
    )
    assert res.status_code == 400


@pytest.mark.asyncio
async def test_launch_rejects_an_expired_token(client, auth):
    private_pem, public_pem = _keypair()
    assert (await _register_platform(client, public_pem, auth("org_admin"))).status_code == 200
    state, nonce = await _login_state_nonce(client)
    res = await client.post(
        f"{BASE}/lti/launch",
        data={"id_token": _id_token(private_pem, nonce, expires_in=-60), "state": state},
    )
    assert res.status_code == 400


@pytest.mark.asyncio
async def test_launch_rejects_a_wrong_audience(client, auth):
    private_pem, public_pem = _keypair()
    assert (await _register_platform(client, public_pem, auth("org_admin"))).status_code == 200
    state, nonce = await _login_state_nonce(client)
    res = await client.post(
        f"{BASE}/lti/launch",
        data={"id_token": _id_token(private_pem, nonce, aud="some-other-tool"), "state": state},
    )
    assert res.status_code == 400


@pytest.mark.asyncio
async def test_launch_requires_both_id_token_and_state(client):
    assert (await client.post(f"{BASE}/lti/launch", data={"state": "x"})).status_code == 400
    assert (await client.post(f"{BASE}/lti/launch", data={"id_token": "x"})).status_code == 400


@pytest.mark.asyncio
async def test_login_refuses_an_unregistered_platform(client):
    res = await client.get(
        f"{BASE}/lti/login",
        params={
            "iss": "https://stranger.example.edu",
            "login_hint": "u",
            "target_link_uri": "http://localhost:8500/x",
        },
    )
    assert res.status_code == 400


@pytest.mark.asyncio
async def test_platform_with_no_key_and_no_jwks_cannot_verify(client, auth, db_session):
    """Registration without a key must fail the launch, not wave it through."""
    from app.domains.integrations.models import LtiPlatform

    private_pem, _public_pem = _keypair()
    body = {
        "issuer": ISSUER,
        "client_id": CLIENT_ID,
        "auth_login_url": "https://lms.example.edu/auth",
    }
    assert (
        await client.post(f"{BASE}/lti/platforms", json=body, headers=auth("org_admin"))
    ).status_code == 200
    platform = (await db_session.execute(select(LtiPlatform))).scalars().one()
    assert platform.public_key_pem is None and platform.jwks_url is None
    state, nonce = await _login_state_nonce(client)
    res = await client.post(
        f"{BASE}/lti/launch",
        data={"id_token": _id_token(private_pem, nonce), "state": state},
    )
    assert res.status_code == 400


# ---------------------------------------------------------------------------
# AGS grade passback
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_ags_passback_fails_soft_without_a_line_item(client, auth, db_session):
    """A launch that granted no AGS endpoint reports, it does not raise."""
    private_pem, public_pem = _keypair()
    assert (await _register_platform(client, public_pem, auth("org_admin"))).status_code == 200
    state, nonce = await _login_state_nonce(client)
    assert (
        await client.post(
            f"{BASE}/lti/launch",
            data={"id_token": _id_token(private_pem, nonce), "state": state},
        )
    ).status_code == 302
    launch = (await db_session.execute(select(LtiLaunch))).scalars().one()
    res = await client.post(
        f"{BASE}/lti/launches/{launch.id}/score",
        json={"given": 0.8, "maximum": 1.0},
        headers=auth("teacher"),
    )
    assert res.status_code == 200
    assert res.json() == {"ok": False, "detail": "launch has no AGS line item"}


@pytest.mark.asyncio
async def test_ags_passback_is_role_gated(client, auth, db_session):
    private_pem, public_pem = _keypair()
    assert (await _register_platform(client, public_pem, auth("org_admin"))).status_code == 200
    state, nonce = await _login_state_nonce(client)
    assert (
        await client.post(
            f"{BASE}/lti/launch",
            data={"id_token": _id_token(private_pem, nonce), "state": state},
        )
    ).status_code == 302
    launch = (await db_session.execute(select(LtiLaunch))).scalars().one()
    res = await client.post(
        f"{BASE}/lti/launches/{launch.id}/score",
        json={"given": 0.8, "maximum": 1.0},
        headers=auth("student"),
    )
    assert res.status_code == 403


@pytest.mark.asyncio
async def test_ags_passback_on_an_unknown_launch_is_a_404(client, auth):
    res = await client.post(
        f"{BASE}/lti/launches/00000000-0000-0000-0000-000000000000/score",
        json={"given": 1.0, "maximum": 1.0},
        headers=auth("teacher"),
    )
    assert res.status_code == 404
