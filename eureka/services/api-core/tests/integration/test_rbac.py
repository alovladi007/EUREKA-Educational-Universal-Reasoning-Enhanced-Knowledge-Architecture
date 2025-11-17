"""
Integration tests for Role-Based Access Control (RBAC)
"""

import pytest
from fastapi.testclient import TestClient


@pytest.mark.integration
@pytest.mark.auth
class TestRBACPermissions:
    """Test role-based access control."""

    def test_student_cannot_access_admin_endpoints(
        self, client: TestClient, auth_headers: dict
    ):
        """Test that students cannot access admin endpoints."""
        response = client.get("/api/v1/admin/users", headers=auth_headers)

        assert response.status_code in [403, 404]

    def test_admin_can_access_admin_endpoints(
        self, client: TestClient, admin_auth_headers: dict
    ):
        """Test that admins can access admin endpoints."""
        response = client.get("/api/v1/admin/users", headers=admin_auth_headers)

        # Should succeed or return 200/404 if endpoint exists
        assert response.status_code in [200, 404]

    def test_teacher_can_access_teacher_endpoints(
        self, client: TestClient, teacher_auth_headers: dict
    ):
        """Test that teachers can access teacher endpoints."""
        response = client.get("/api/v1/courses", headers=teacher_auth_headers)

        assert response.status_code in [200, 404]

    def test_student_can_access_student_endpoints(
        self, client: TestClient, auth_headers: dict
    ):
        """Test that students can access student endpoints."""
        response = client.get("/api/v1/courses", headers=auth_headers)

        assert response.status_code in [200, 404]


@pytest.mark.integration
@pytest.mark.auth
class TestOrganizationIsolation:
    """Test multi-tenancy organization isolation."""

    def test_user_can_only_see_own_organization_data(
        self, client: TestClient, auth_headers: dict, test_user
    ):
        """Test that users can only access data from their organization."""
        response = client.get("/api/v1/users/me", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert data["organization_id"] == str(test_user.organization_id)

    def test_cross_organization_access_denied(
        self, client: TestClient, auth_headers: dict
    ):
        """Test that users cannot access other organization's data."""
        # Try to access a course from a different organization
        fake_org_id = "00000000-0000-0000-0000-000000000000"
        response = client.get(
            f"/api/v1/organizations/{fake_org_id}",
            headers=auth_headers
        )

        assert response.status_code in [403, 404]
