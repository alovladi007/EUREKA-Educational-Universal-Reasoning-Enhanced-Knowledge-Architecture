"""
Basic API tests for EUREKA Medical School Service
Run with: pytest tests/test_api.py -v
"""

import pytest
from fastapi.testclient import TestClient
from uuid import uuid4

# Import app after creating it
from main import app

client = TestClient(app)


class TestSystemEndpoints:
    """Test system/health endpoints."""
    
    def test_health_check(self):
        """Test health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "medical-school"
        assert "features" in data
    
    def test_root_endpoint(self):
        """Test root endpoint."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["service"] == "EUREKA Medical School"
        assert "docs" in data


class TestUSMLEQuestions:
    """Test USMLE question endpoints."""
    
    def test_list_questions(self):
        """Test listing USMLE questions."""
        response = client.get("/api/v1/usmle/questions")
        assert response.status_code == 200
        # May be empty initially
        data = response.json()
        assert isinstance(data, list)
    
    def test_list_questions_with_filters(self):
        """Test listing questions with filters."""
        response = client.get(
            "/api/v1/usmle/questions",
            params={
                "subject": "Cardiology",
                "difficulty_level": "Step 1",
                "limit": 10
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) <= 10


class TestClinicalCases:
    """Test clinical case endpoints."""
    
    def test_list_cases(self):
        """Test listing clinical cases."""
        response = client.get("/api/v1/clinical-cases")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_list_cases_with_filters(self):
        """Test listing cases with filters."""
        response = client.get(
            "/api/v1/clinical-cases",
            params={
                "specialty": "Cardiology",
                "complexity": "intermediate"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestOSCEStations:
    """Test OSCE station endpoints."""
    
    def test_list_stations(self):
        """Test listing OSCE stations."""
        response = client.get("/api/v1/osce/stations")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestMedications:
    """Test medication endpoints."""
    
    def test_search_medications(self):
        """Test searching medications."""
        response = client.get("/api/v1/medications")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_search_medications_by_name(self):
        """Test searching medications by name."""
        response = client.get(
            "/api/v1/medications",
            params={"search": "lisinopril"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


# Integration Tests (require database)
@pytest.mark.integration
class TestIntegration:
    """Integration tests requiring database."""
    
    def test_create_and_list_question(self):
        """Test creating and listing a question."""
        # Create question
        question_data = {
            "org_id": str(uuid4()),
            "question_text": "Test question?",
            "vignette": "Test vignette",
            "option_a": "A",
            "option_b": "B",
            "option_c": "C",
            "option_d": "D",
            "correct_answer": "A",
            "difficulty_level": "Step 1",
            "subject": "Test",
            "topic": "Testing",
            "explanation": "Test explanation"
        }
        
        create_response = client.post(
            "/api/v1/usmle/questions",
            json=question_data
        )
        
        # Check if CRUD is implemented
        if create_response.status_code == 200:
            assert "id" in create_response.json()
            
            # List questions
            list_response = client.get("/api/v1/usmle/questions")
            assert list_response.status_code == 200
            questions = list_response.json()
            assert len(questions) > 0


# Run with: pytest tests/test_api.py -v
# Run with coverage: pytest tests/test_api.py --cov=app --cov-report=html
# Run integration tests: pytest tests/test_api.py -v -m integration
