"""
Integration tests for authentication endpoints
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import User


@pytest.mark.integration
@pytest.mark.auth
class TestUserRegistration:
    """Test user registration flow."""

    def test_register_user_success(self, client: TestClient, mock_email_service):
        """Test successful user registration."""
        user_data = {
            "email": "newuser@example.com",
            "username": "newuser",
            "password": "SecurePassword123!",
            "full_name": "New User",
            "role": "student"
        }

        response = client.post("/api/v1/auth/register", json=user_data)

        assert response.status_code == 201
        data = response.json()
        assert "user" in data
        assert data["user"]["email"] == user_data["email"]
        assert data["user"]["username"] == user_data["username"]
        assert "access_token" in data
        assert "refresh_token" in data

    def test_register_duplicate_email(self, client: TestClient, test_user: User):
        """Test registration with duplicate email fails."""
        user_data = {
            "email": test_user.email,
            "username": "differentusername",
            "password": "SecurePassword123!",
            "full_name": "Another User",
            "role": "student"
        }

        response = client.post("/api/v1/auth/register", json=user_data)

        assert response.status_code == 400
        assert "already registered" in response.json()["detail"].lower()

    def test_register_duplicate_username(self, client: TestClient, test_user: User):
        """Test registration with duplicate username fails."""
        user_data = {
            "email": "different@example.com",
            "username": test_user.username,
            "password": "SecurePassword123!",
            "full_name": "Another User",
            "role": "student"
        }

        response = client.post("/api/v1/auth/register", json=user_data)

        assert response.status_code == 400

    def test_register_invalid_email(self, client: TestClient):
        """Test registration with invalid email fails."""
        user_data = {
            "email": "notanemail",
            "username": "testuser",
            "password": "SecurePassword123!",
            "full_name": "Test User",
            "role": "student"
        }

        response = client.post("/api/v1/auth/register", json=user_data)

        assert response.status_code == 422

    def test_register_weak_password(self, client: TestClient):
        """Test registration with weak password fails."""
        user_data = {
            "email": "test@example.com",
            "username": "testuser",
            "password": "weak",
            "full_name": "Test User",
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
        login_data = {
            "username": test_user.email,
            "password": "testpassword123"
        }

        response = client.post("/api/v1/auth/login", data=login_data)

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client: TestClient, test_user: User):
        """Test login with wrong password fails."""
        login_data = {
            "username": test_user.email,
            "password": "wrongpassword"
        }

        response = client.post("/api/v1/auth/login", data=login_data)

        assert response.status_code == 401
        assert "incorrect" in response.json()["detail"].lower()

    def test_login_nonexistent_user(self, client: TestClient):
        """Test login with nonexistent user fails."""
        login_data = {
            "username": "nonexistent@example.com",
            "password": "somepassword"
        }

        response = client.post("/api/v1/auth/login", data=login_data)

        assert response.status_code == 401

    def test_login_inactive_user(self, client: TestClient, db_session: Session, test_user: User):
        """Test login with inactive user fails."""
        # Deactivate user
        test_user.is_active = False
        db_session.commit()

        login_data = {
            "username": test_user.email,
            "password": "testpassword123"
        }

        response = client.post("/api/v1/auth/login", data=login_data)

        assert response.status_code == 401


@pytest.mark.integration
@pytest.mark.auth
class TestTokenRefresh:
    """Test token refresh flow."""

    def test_refresh_token_success(self, client: TestClient, test_user: User):
        """Test successful token refresh."""
        # First login to get tokens
        login_data = {
            "username": test_user.email,
            "password": "testpassword123"
        }
        login_response = client.post("/api/v1/auth/login", data=login_data)
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
        # Generate verification token
        from app.core.security import create_verification_token
        token = create_verification_token(test_user.email)

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
            "/api/v1/auth/forgot-password",
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
            "/api/v1/auth/forgot-password",
            json={"email": test_user.email}
        )

        # Generate reset token
        from app.core.security import create_password_reset_token
        token = create_password_reset_token(test_user.email)

        # Reset password
        response = client.post(
            "/api/v1/auth/reset-password",
            json={
                "token": token,
                "new_password": "NewSecurePassword123!"
            }
        )

        assert response.status_code == 200

        # Try logging in with new password
        login_data = {
            "username": test_user.email,
            "password": "NewSecurePassword123!"
        }
        login_response = client.post("/api/v1/auth/login", data=login_data)
        assert login_response.status_code == 200

    def test_reset_password_invalid_token(self, client: TestClient):
        """Test password reset with invalid token fails."""
        response = client.post(
            "/api/v1/auth/reset-password",
            json={
                "token": "invalid.token",
                "new_password": "NewPassword123!"
            }
        )

        assert response.status_code == 400
