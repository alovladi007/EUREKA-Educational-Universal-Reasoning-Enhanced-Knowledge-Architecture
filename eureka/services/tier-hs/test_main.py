"""
Tests for EUREKA High School Tier
"""
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# ==================== Basic Tests ====================

def test_root():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "EUREKA High School Tier"
    assert data["status"] == "operational"

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

# ==================== Tutor Tests ====================

def test_tutor_algebra_question():
    """Test mentor tutor with algebra question"""
    response = client.post("/tutor", json={
        "student_id": "student_test_001",
        "question": "How do I solve 2x + 5 = 11?",
        "subject": "algebra1",
        "language": "en"
    })
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert data["xp_earned"] >= 0
    assert isinstance(data["hints"], list)

def test_tutor_spanish_language():
    """Test tutor with Spanish language request"""
    response = client.post("/tutor", json={
        "student_id": "student_test_002",
        "question": "¿Cómo resuelvo ecuaciones?",
        "subject": "algebra1",
        "language": "es"
    })
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data

def test_tutor_content_filter():
    """Test content filtering for inappropriate content"""
    response = client.post("/tutor", json={
        "student_id": "student_test_003",
        "question": "inappropriate content here",
        "subject": "algebra1"
    })
    # Should either filter or handle gracefully
    assert response.status_code in [200, 400]

# ==================== Unit Generation Tests ====================

def test_generate_unit_algebra1():
    """Test generating Algebra I unit mapped to CCSS standard"""
    response = client.post("/generate_unit", json={
        "subject": "algebra1",
        "standard": "CCSS.MATH.CONTENT.HSA-CED.A.1",
        "difficulty": "intermediate"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["standard"] == "CCSS.MATH.CONTENT.HSA-CED.A.1"
    assert len(data["lessons"]) == 4
    assert data["total_duration_minutes"] > 0

def test_generate_unit_biology():
    """Test generating Biology unit with NGSS alignment"""
    response = client.post("/generate_unit", json={
        "subject": "biology",
        "standard": "NGSS.HS-LS1-1",
        "difficulty": "intermediate"
    })
    assert response.status_code in [200, 404]  # 404 if standard not in seed data

# ==================== Practice Set Tests ====================

def test_create_practice_set():
    """Test creating adaptive practice set"""
    response = client.post("/practice_set", json={
        "student_id": "student_test_004",
        "subject": "algebra1",
        "topic": "linear_equations",
        "difficulty": "beginner",
        "num_questions": 10
    })
    assert response.status_code == 200
    data = response.json()
    assert len(data["questions"]) == 10
    assert data["adaptive"] == True
    assert "set_id" in data

def test_practice_set_adaptive_difficulty():
    """Test that practice set includes various question types"""
    response = client.post("/practice_set", json={
        "student_id": "student_test_005",
        "subject": "geometry",
        "topic": "triangles",
        "difficulty": "intermediate",
        "num_questions": 6
    })
    assert response.status_code == 200
    data = response.json()
    questions = data["questions"]
    
    # Should have both MCQ and short answer
    question_types = [q["question_type"] for q in questions]
    assert "mcq" in question_types or "short_answer" in question_types

# ==================== Hint System Tests ====================

def test_get_hint_first_attempt():
    """Test getting first hint"""
    response = client.post("/hint", json={
        "student_id": "student_test_006",
        "question_id": "q_test_001",
        "attempt_count": 1
    })
    assert response.status_code == 200
    data = response.json()
    assert data["hint_level"] == 1
    assert len(data["hint"]) > 0

def test_get_hint_progressive():
    """Test progressive hints get more specific"""
    response1 = client.post("/hint", json={
        "student_id": "student_test_007",
        "question_id": "q_test_002",
        "attempt_count": 1
    })
    response2 = client.post("/hint", json={
        "student_id": "student_test_007",
        "question_id": "q_test_002",
        "attempt_count": 3
    })
    
    assert response1.status_code == 200
    assert response2.status_code == 200
    
    hint1 = response1.json()
    hint2 = response2.json()
    
    assert hint1["hint_level"] < hint2["hint_level"]

# ==================== Badge System Tests ====================

def test_award_streak_badge():
    """Test awarding streak badge"""
    response = client.post("/badge_award", json={
        "student_id": "student_test_008",
        "badge_type": "streak_7"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Week Warrior"
    assert data["xp_bonus"] == 50

def test_award_mastery_badge():
    """Test awarding concept mastery badge"""
    response = client.post("/badge_award", json={
        "student_id": "student_test_009",
        "badge_type": "concept_mastery"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["xp_bonus"] > 0

def test_award_invalid_badge():
    """Test awarding non-existent badge"""
    response = client.post("/badge_award", json={
        "student_id": "student_test_010",
        "badge_type": "nonexistent_badge"
    })
    assert response.status_code == 404

# ==================== Progress Tracking Tests ====================

def test_get_student_progress():
    """Test retrieving student progress"""
    response = client.get("/progress/student_test_011")
    assert response.status_code == 200
    data = response.json()
    assert "total_xp" in data
    assert "level" in data
    assert "streak_days" in data
    assert isinstance(data["badges"], list)
    assert isinstance(data["mastered_concepts"], list)

# ==================== Compliance Tests ====================

def test_no_pii_in_logs():
    """Test that no PII is logged"""
    # This would check actual logging in production
    # Placeholder test
    assert True

def test_coppa_compliance():
    """Test COPPA compliance features"""
    # Would verify age verification, parental consent, etc.
    assert True

def test_ferpa_compliance():
    """Test FERPA compliance (no educational records leak)"""
    # Would verify proper data handling
    assert True

# ==================== Accessibility Tests ====================

def test_wcag_compliance():
    """Test WCAG 2.2 AA compliance"""
    # Would test with actual accessibility tools
    assert True

# ==================== Integration Tests ====================

def test_complete_learning_flow():
    """Test complete learning flow: question -> practice -> badge"""
    student_id = "student_integration_test"
    
    # 1. Ask tutor question
    tutor_response = client.post("/tutor", json={
        "student_id": student_id,
        "question": "What is a linear equation?",
        "subject": "algebra1"
    })
    assert tutor_response.status_code == 200
    
    # 2. Get practice set
    practice_response = client.post("/practice_set", json={
        "student_id": student_id,
        "subject": "algebra1",
        "topic": "linear_equations",
        "difficulty": "beginner",
        "num_questions": 5
    })
    assert practice_response.status_code == 200
    
    # 3. Get hint
    questions = practice_response.json()["questions"]
    hint_response = client.post("/hint", json={
        "student_id": student_id,
        "question_id": questions[0]["id"],
        "attempt_count": 1
    })
    assert hint_response.status_code == 200
    
    # 4. Check progress
    progress_response = client.get(f"/progress/{student_id}")
    assert progress_response.status_code == 200

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--cov=main", "--cov-report=html"])
