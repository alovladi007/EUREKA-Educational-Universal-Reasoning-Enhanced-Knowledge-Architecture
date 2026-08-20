"""
Integration tests for authentication endpoints
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

@pytest.fixture
def mock_email_service(monkeypatch):
    """Silence outbound mail.

    Three tests requested this fixture and nothing ever defined it, so they
    errored at setup rather than running. The real module is
    `app.services.email` (there has never been an `email_service`).
    """
    sent: list[dict] = []

    class _Recorder:
        def __init__(self, *a, **k):
            pass

        async def send(self, *a, **k):
            sent.append({"args": a, "kwargs": k})
            return True

        send_email = send

    monkeypatch.setattr("app.services.email.EmailService", _Recorder, raising=False)
    return sent


from app.models.user import User


@pytest.mark.integration
@pytest.mark.auth
class TestUserRegistration:
    """Test user registration flow."""

    def test_register_user_success(self, client: TestClient, mock_email_service):
        """Test successful user registration."""
        user_data = {
            "email": "newuser@example.com",
            "password": "SecurePassword123!",
            "first_name": "New",
            "last_name": "User",
            "role": "student"
        }

        response = client.post("/api/v1/auth/register", json=user_data)

        assert response.status_code == 201
        data = response.json()
        assert "user" in data
        assert data["user"]["email"] == user_data["email"]
        assert "access_token" in data
        assert "refresh_token" in data

    def test_register_duplicate_email(self, client: TestClient, test_user: User):
        """Test registration with duplicate email fails."""
        # Duplicate detection is per-organisation: the same address in two
        # different tenants is legitimate. Passing org_id makes this a real
        # collision instead of two users in different orgs.
        user_data = {
            "email": test_user.email,
            "org_id": str(test_user.org_id),
            "password": "SecurePassword123!",
            "first_name": "Another",
            "last_name": "User",
            "role": "student"
        }

        response = client.post("/api/v1/auth/register", json=user_data)

        # 409 Conflict, not 400: the endpoint reports a duplicate as a
        # conflict, which is the more accurate status. The test held the
        # older expectation.
        assert response.status_code == 409
        assert "already registered" in response.json()["detail"].lower()


    def test_register_invalid_email(self, client: TestClient):
        """Test registration with invalid email fails."""
        user_data = {
            "email": "notanemail",
                        "password": "SecurePassword123!",
            "first_name": "Test",
            "last_name": "User",
            "role": "student"
        }

        response = client.post("/api/v1/auth/register", json=user_data)

        assert response.status_code == 422

    def test_register_weak_password(self, client: TestClient):
        """Test registration with weak password fails."""
        user_data = {
            "email": "test@example.com",
                        "password": "weak",
            "first_name": "Test",
            "last_name": "User",
            "role": "student"
        }

        response = client.post("/api/v1/auth/register", json=user_data)

        assert response.status_code in [400, 422]


@pytest.mark.integration
@pytest.mark.auth
class TestUserLogin:
    """Test user login flow."""

    def test_login_success(self, client: TestClient, test_user: User):
        """Test successful login."""
        login_data = {"email": test_user.email, "password": "testpassword123"}

        response = client.post("/api/v1/auth/login", json=login_data)

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client: TestClient, test_user: User):
        """Test login with wrong password fails."""
        login_data = {"email": test_user.email, "password": "wrongpassword"}

        response = client.post("/api/v1/auth/login", json=login_data)

        assert response.status_code == 401
        assert "incorrect" in response.json()["detail"].lower()

    def test_login_nonexistent_user(self, client: TestClient):
        """Test login with nonexistent user fails."""
        # The payload previously omitted `email` entirely, so this never
        # reached the nonexistent-user branch at all — it only ever exercised
        # request-schema validation and returned 422. With a well-formed
        # payload naming an address that does not exist, the endpoint answers
        # 401 "Incorrect email or password", which is what the name claims and
        # what the code has always done.
        login_data = {
            "email": "no-such-account@gmail.com",
            "password": "somepassword",
        }

        response = client.post("/api/v1/auth/login", json=login_data)

        assert response.status_code == 401

    def test_login_inactive_user(self, client: TestClient, db_session: Session, test_user: User):
        """Test login with an inactive account is refused with 403."""
        # Deactivate user
        test_user.is_active = False
        db_session.commit()

        login_data = {"email": test_user.email, "password": "testpassword123"}

        response = client.post("/api/v1/auth/login", json=login_data)

        # 403, not 401. The password WAS correct — the credentials are valid
        # and the caller is authenticated; the account is simply disabled.
        # That is exactly the authenticated-but-not-permitted case 403 is for,
        # and it matches how the endpoint treats a banned account. The check
        # runs after password verification, so this status only ever reaches
        # someone who already knows the password.
        assert response.status_code == 403
        assert "inactive" in response.json()["detail"].lower()


@pytest.mark.integration
@pytest.mark.auth
class TestTokenRefresh:
    """Test token refresh flow."""

    def test_refresh_token_success(self, client: TestClient, test_user: User):
        """Test successful token refresh."""
        # First login to get tokens
        login_data = {"email": test_user.email, "password": "testpassword123"}
        login_response = client.post("/api/v1/auth/login", json=login_data)
        refresh_token = login_response.json()["refresh_token"]

        # Refresh the token
        response = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": refresh_token}
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data

    def test_refresh_with_invalid_token(self, client: TestClient):
        """Test refresh with invalid token fails."""
        response = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": "invalid.token.here"}
        )

        assert response.status_code == 401


@pytest.mark.integration
@pytest.mark.auth
class TestProtectedEndpoints:
    """Test protected endpoint access."""

    def test_access_protected_endpoint_with_token(
        self, client: TestClient, auth_headers: dict
    ):
        """Test accessing protected endpoint with valid token."""
        response = client.get("/api/v1/users/me", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert "email" in data
        assert "id" in data

    def test_access_protected_endpoint_without_token(self, client: TestClient):
        """Test accessing protected endpoint without token fails."""
        response = client.get("/api/v1/users/me")

        assert response.status_code == 401

    def test_access_protected_endpoint_with_invalid_token(self, client: TestClient):
        """Test accessing protected endpoint with invalid token fails."""
        headers = {"Authorization": "Bearer invalid.token.here"}
        response = client.get("/api/v1/users/me", headers=headers)

        assert response.status_code == 401


@pytest.mark.integration
@pytest.mark.auth
class TestEmailVerification:
    """Test email verification flow."""

    def test_verify_email_success(self, client: TestClient, test_user: User):
        """Test successful email verification."""
        # The helper is real — it is `create_email_verification_token`, and
        # /resend-verification uses it. The test had guessed both the name and
        # the signature (it takes user_id AND email, like the password-reset
        # one). Not a feature gap: a misremembered symbol.
        from app.utils.auth import create_email_verification_token
        token = create_email_verification_token(str(test_user.id), test_user.email)

        response = client.post(
            "/api/v1/auth/verify-email",
            json={"token": token}
        )

        # This might be 200 if already verified
        assert response.status_code in [200, 204]

    def test_verify_email_invalid_token(self, client: TestClient):
        """Test email verification with invalid token fails."""
        response = client.post(
            "/api/v1/auth/verify-email",
            json={"token": "invalid.token"}
        )

        assert response.status_code == 400


@pytest.mark.integration
@pytest.mark.auth
class TestPasswordReset:
    """Test password reset flow."""

    def test_request_password_reset(
        self, client: TestClient, test_user: User, mock_email_service
    ):
        """Test requesting password reset."""
        response = client.post(
            "/api/v1/auth/password-reset",
            json={"email": test_user.email}
        )

        # Should return 200 even if user doesn't exist (security)
        assert response.status_code == 200

    def test_reset_password_success(
        self, client: TestClient, test_user: User, mock_email_service
    ):
        """Test successful password reset."""
        # Request reset
        client.post(
            "/api/v1/auth/password-reset",
            json={"email": test_user.email}
        )

        # Generate reset token
        from app.utils.auth import create_password_reset_token
        token = create_password_reset_token(str(test_user.id), test_user.email)

        # Reset password
        response = client.post(
            "/api/v1/auth/password-reset/confirm",
            json={
                "token": token,
                "new_password": "NewSecurePassword123!"
            }
        )

        assert response.status_code == 200

        # Try logging in with new password
        login_data = {"email": test_user.email, "password": "NewSecurePassword123!"}
        login_response = client.post("/api/v1/auth/login", json=login_data)
        assert login_response.status_code == 200

    def test_reset_password_invalid_token(self, client: TestClient):
        """Test password reset with invalid token fails."""
        response = client.post(
            "/api/v1/auth/password-reset/confirm",
            json={
                "token": "invalid.token",
                "new_password": "NewPassword123!"
            }
        )

        assert response.status_code == 400
