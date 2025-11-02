"""
Unit tests for Content API endpoints
"""
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class TestContentAPI:
    """Test content management API"""

    def test_health_check(self):
        """Test health endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data['status'] == 'healthy'
        assert 'service' in data

    def test_root_endpoint(self):
        """Test root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert 'service' in data
        assert 'endpoints' in data

    def test_submit_valid_content(self):
        """Test submitting valid content"""
        payload = {
            'creator_id': 'creator_123',
            'title': 'Introduction to Python',
            'description': 'Learn Python programming through interactive exercises and real-world projects',
            'content_type': 'interactive',
            'price_usd': 29.99,
            'difficulty_level': 'beginner',
            'duration_minutes': 120
        }

        response = client.post("/api/v1/content/submit", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert 'content_id' in data
        assert data['status'] == 'draft'

    def test_submit_content_with_pii(self):
        """Test submitting content with PII fails compliance"""
        payload = {
            'creator_id': 'creator_123',
            'title': 'Contact john@example.com',
            'description': 'Call me at 555-1234 for more info',
            'content_type': 'video',
            'price_usd': 19.99
        }

        response = client.post("/api/v1/content/submit", json=payload)
        assert response.status_code == 400
        data = response.json()
        assert 'detail' in data

    def test_submit_content_invalid_price(self):
        """Test submitting content with invalid price"""
        payload = {
            'creator_id': 'creator_123',
            'title': 'Test Course',
            'description': 'Great course content here',
            'content_type': 'pdf',
            'price_usd': 99999.99  # Exceeds max
        }

        response = client.post("/api/v1/content/submit", json=payload)
        assert response.status_code == 400

    def test_check_compliance_endpoint(self):
        """Test compliance pre-check endpoint"""
        response = client.get(
            "/api/v1/content/check-compliance",
            params={
                'title': 'Python Course',
                'description': 'Learn Python programming'
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert 'is_safe' in data
        assert 'risk_score' in data

    def test_browse_content(self):
        """Test browsing content"""
        response = client.get("/api/v1/content/browse")
        assert response.status_code == 200
        data = response.json()
        assert 'items' in data
        assert 'total' in data
        assert 'page' in data

    def test_browse_content_with_filters(self):
        """Test browsing with filters"""
        response = client.get(
            "/api/v1/content/browse",
            params={
                'content_type': 'video',
                'min_price': 10.0,
                'max_price': 50.0,
                'difficulty': 'beginner'
            }
        )
        assert response.status_code == 200

    def test_get_content_details(self):
        """Test getting content details"""
        response = client.get("/api/v1/content/1")
        assert response.status_code == 200
        data = response.json()
        assert 'id' in data
        assert 'title' in data

    def test_purchase_content(self):
        """Test initiating content purchase"""
        response = client.post(
            "/api/v1/content/1/purchase",
            params={'learner_id': 'learner_456'}
        )
        assert response.status_code == 200
        data = response.json()
        assert 'transaction_id' in data
        assert 'amount_usd' in data

    def test_creator_dashboard(self):
        """Test creator dashboard endpoint"""
        response = client.get("/api/v1/content/creator/creator_123/dashboard")
        assert response.status_code == 200
        data = response.json()
        assert 'creator_id' in data
        assert 'total_revenue_usd' in data


class TestVCAPI:
    """Test VC simulation API"""

    def test_make_investment(self):
        """Test making VC investment"""
        payload = {
            'vc_learner_id': 'vc_001',
            'content_id': 101,
            'investment_amount_usd': 5000.0,
            'equity_percentage': 10.0
        }

        response = client.post("/api/v1/vc/invest", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert 'investment_id' in data
        assert data['status'] == 'active'

    def test_make_investment_exceeds_max(self):
        """Test investment exceeding maximum"""
        payload = {
            'vc_learner_id': 'vc_001',
            'content_id': 101,
            'investment_amount_usd': 100000.0,  # Exceeds max
            'equity_percentage': 10.0
        }

        response = client.post("/api/v1/vc/invest", json=payload)
        assert response.status_code == 400

    def test_get_portfolio(self):
        """Test getting VC portfolio"""
        response = client.get("/api/v1/vc/portfolio/vc_001")
        assert response.status_code == 200
        data = response.json()
        assert 'vc_learner_id' in data
        assert 'total_capital_usd' in data
        assert 'investments' in data

    def test_browse_investment_opportunities(self):
        """Test browsing investment opportunities"""
        response = client.get("/api/v1/vc/opportunities")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_browse_opportunities_with_filters(self):
        """Test browsing with ROI and risk filters"""
        response = client.get(
            "/api/v1/vc/opportunities",
            params={'min_roi': 40.0, 'max_risk': 0.3}
        )
        assert response.status_code == 200

    def test_vc_leaderboard(self):
        """Test VC leaderboard"""
        response = client.get("/api/v1/vc/leaderboard")
        assert response.status_code == 200
        data = response.json()
        assert 'leaderboard' in data
        assert 'total_vcs' in data

    def test_exit_investment(self):
        """Test exiting investment"""
        response = client.post(
            "/api/v1/vc/1/exit",
            params={'vc_learner_id': 'vc_001'}
        )
        assert response.status_code == 200
        data = response.json()
        assert data['status'] == 'exited'
        assert 'final_roi_usd' in data
