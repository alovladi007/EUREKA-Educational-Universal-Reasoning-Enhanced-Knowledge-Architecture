#!/usr/bin/env python3
"""
AI Tutor Service - Comprehensive Test Suite

Tests all fixed endpoints to verify the service is working correctly.
"""
import sys
import requests
import json
from uuid import uuid4
from typing import Dict, Any

# Configuration
BASE_URL = "http://localhost:8002"
TEST_USER_ID = str(uuid4())
TEST_COURSE_ID = str(uuid4())

# Colors for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'


def print_test(name: str):
    """Print test name"""
    print(f"\n{BLUE}Testing: {name}{RESET}")


def print_success(message: str):
    """Print success message"""
    print(f"  {GREEN}✅ {message}{RESET}")


def print_error(message: str):
    """Print error message"""
    print(f"  {RED}❌ {message}{RESET}")


def print_warning(message: str):
    """Print warning message"""
    print(f"  {YELLOW}⚠️  {message}{RESET}")


def test_health_check() -> bool:
    """Test 1: Health check"""
    print_test("Health Check")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print_success(f"Service is healthy: {data}")
            return True
        else:
            print_error(f"Health check failed with status {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Failed to connect: {e}")
        return False


def test_api_docs() -> bool:
    """Test 2: API documentation"""
    print_test("API Documentation")
    try:
        response = requests.get(f"{BASE_URL}/docs", timeout=5)
        if response.status_code == 200:
            print_success("API docs accessible at /docs")
            return True
        else:
            print_error(f"Failed to access docs: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Failed to access docs: {e}")
        return False


def test_create_conversation() -> Dict[str, Any]:
    """Test 3: Create conversation"""
    print_test("Create Conversation")
    try:
        payload = {
            "user_id": TEST_USER_ID,
            "course_id": TEST_COURSE_ID,
            "title": "Test Conversation - Photosynthesis",
            "subject": "Biology",
            "use_socratic_method": True
        }
        
        response = requests.post(
            f"{BASE_URL}/api/v1/tutor/conversations",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 201:
            data = response.json()
            print_success(f"Created conversation: {data['id']}")
            print_success(f"  Title: {data['title']}")
            print_success(f"  Active: {data['is_active']}")
            return data
        else:
            print_error(f"Failed to create: {response.status_code}")
            print_error(f"  Response: {response.text}")
            return None
    except Exception as e:
        print_error(f"Exception: {e}")
        return None


def test_get_conversation(conversation_id: str, include_messages: bool = False) -> bool:
    """Test 4: Get conversation (with/without messages)"""
    test_name = "Get Conversation" + (" with Messages" if include_messages else "")
    print_test(test_name)
    
    try:
        params = {"include_messages": include_messages} if include_messages else {}
        response = requests.get(
            f"{BASE_URL}/api/v1/tutor/conversations/{conversation_id}",
            params=params,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Retrieved conversation: {data['id']}")
            
            if include_messages:
                if "messages" in data:
                    print_success(f"  Messages included: {len(data['messages'])} messages")
                    return True
                else:
                    print_error("  'messages' field missing from response!")
                    return False
            else:
                if "messages" not in data:
                    print_success("  Messages not included (as expected)")
                    return True
                else:
                    print_warning("  Messages included when not requested")
                    return True
        else:
            print_error(f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Exception: {e}")
        return False


def test_add_course_content() -> Dict[str, Any]:
    """Test 5: Add course content"""
    print_test("Add Course Content (RAG)")
    try:
        payload = {
            "course_id": TEST_COURSE_ID,
            "content_type": "lecture",
            "title": "Introduction to Photosynthesis",
            "content": "Photosynthesis is the process by which plants convert light energy into chemical energy. It occurs in chloroplasts and requires sunlight, water, and carbon dioxide. The process produces glucose and oxygen.",
            "topics": ["biology", "photosynthesis", "plants"],
            "difficulty": "intermediate"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/v1/tutor/content",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 201:
            data = response.json()
            print_success(f"Created content: {data['id']}")
            print_success(f"  Title: {data['title']}")
            print_success(f"  Type: {data['content_type']}")
            return data
        else:
            print_error(f"Failed: {response.status_code}")
            print_error(f"  Response: {response.text}")
            return None
    except Exception as e:
        print_error(f"Exception: {e}")
        return None


def test_ask_tutor(conversation_id: str) -> Dict[str, Any]:
    """Test 6: Ask tutor (main functionality)"""
    print_test("Ask AI Tutor")
    try:
        payload = {
            "user_id": TEST_USER_ID,
            "course_id": TEST_COURSE_ID,
            "conversation_id": conversation_id,
            "message": "Can you explain the basic process of photosynthesis?",
            "use_rag": True,
            "use_socratic_method": True
        }
        
        response = requests.post(
            f"{BASE_URL}/api/v1/tutor/ask",
            json=payload,
            timeout=30  # AI calls can take longer
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("AI responded successfully")
            print_success(f"  Conversation: {data['conversation_id']}")
            print_success(f"  Message ID: {data['message_id']}")
            print_success(f"  Confidence: {data['confidence']:.2f}")
            print_success(f"  Sources used: {len(data['sources_used'])}")
            print_success(f"  Follow-ups: {len(data['follow_up_suggestions'])}")
            
            # Show response preview
            response_preview = data['response'][:100] + "..." if len(data['response']) > 100 else data['response']
            print_success(f"  Response preview: {response_preview}")
            
            return data
        else:
            print_error(f"Failed: {response.status_code}")
            print_error(f"  Response: {response.text}")
            return None
    except Exception as e:
        print_error(f"Exception: {e}")
        return None


def test_update_knowledge() -> Dict[str, Any]:
    """Test 7: Update knowledge state"""
    print_test("Update Knowledge State")
    try:
        payload = {
            "user_id": TEST_USER_ID,
            "course_id": TEST_COURSE_ID,
            "topic": "Photosynthesis",
            "correct": True,
            "confidence": 0.85
        }
        
        response = requests.post(
            f"{BASE_URL}/api/v1/tutor/knowledge/update",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("Knowledge updated")
            print_success(f"  Topic: {data['topic']}")
            print_success(f"  Mastery: {data['mastery_level']:.2f}")
            print_success(f"  Confidence: {data['confidence']:.2f}")
            print_success(f"  Attempts: {data['total_attempts']}")
            
            # Verify mastery_level is in valid range
            if 0.0 <= data['mastery_level'] <= 1.0:
                print_success("  ✓ Mastery level in valid range [0.0-1.0]")
            else:
                print_error(f"  ✗ Mastery level out of range: {data['mastery_level']}")
            
            return data
        else:
            print_error(f"Failed: {response.status_code}")
            print_error(f"  Response: {response.text}")
            return None
    except Exception as e:
        print_error(f"Exception: {e}")
        return None


def test_get_knowledge() -> bool:
    """Test 8: Get knowledge state"""
    print_test("Get Knowledge State")
    try:
        response = requests.get(
            f"{BASE_URL}/api/v1/tutor/knowledge/{TEST_USER_ID}",
            params={"course_id": TEST_COURSE_ID},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Retrieved {len(data)} knowledge records")
            
            for record in data:
                print_success(f"  Topic: {record['topic']}")
                print_success(f"    Mastery: {record['mastery_level']:.2f}")
                print_success(f"    Needs review: {record['needs_review']}")
            
            return True
        else:
            print_error(f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Exception: {e}")
        return False


def test_list_conversations() -> bool:
    """Test 9: List user conversations"""
    print_test("List User Conversations")
    try:
        response = requests.get(
            f"{BASE_URL}/api/v1/tutor/users/{TEST_USER_ID}/conversations",
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Found {len(data)} conversations")
            
            for conv in data:
                print_success(f"  {conv['title']}")
                print_success(f"    ID: {conv['id']}")
                print_success(f"    Messages: {conv['message_count']}")
            
            return True
        else:
            print_error(f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Exception: {e}")
        return False


def test_analytics() -> bool:
    """Test 10: Get analytics (should handle no data gracefully)"""
    print_test("Get Analytics")
    try:
        response = requests.get(
            f"{BASE_URL}/api/v1/tutor/analytics/{TEST_USER_ID}",
            timeout=10
        )
        
        # Should return 404 if no sessions, not crash
        if response.status_code == 200:
            data = response.json()
            print_success("Analytics retrieved")
            print_success(f"  Total sessions: {data['total_sessions']}")
            print_success(f"  Total messages: {data['total_messages']}")
            return True
        elif response.status_code == 404:
            print_success("No analytics data (expected for new user)")
            return True
        else:
            print_error(f"Unexpected status: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Exception: {e}")
        return False


def run_all_tests():
    """Run all tests"""
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}AI Tutor Service - Comprehensive Test Suite{RESET}")
    print(f"{BLUE}{'='*60}{RESET}")
    print(f"\nBase URL: {BASE_URL}")
    print(f"Test User: {TEST_USER_ID}")
    print(f"Test Course: {TEST_COURSE_ID}")
    
    results = {}
    conversation_id = None
    
    # Test 1: Health
    results['health'] = test_health_check()
    if not results['health']:
        print(f"\n{RED}Service is not running! Start it with:{RESET}")
        print(f"  cd services/tutor-llm && python main.py")
        sys.exit(1)
    
    # Test 2: Docs
    results['docs'] = test_api_docs()
    
    # Test 3: Create conversation
    conversation = test_create_conversation()
    results['create_conv'] = conversation is not None
    if conversation:
        conversation_id = conversation['id']
    
    # Test 4a: Get conversation without messages
    if conversation_id:
        results['get_conv_simple'] = test_get_conversation(conversation_id, include_messages=False)
    
    # Test 5: Add content
    content = test_add_course_content()
    results['add_content'] = content is not None
    
    # Test 6: Ask tutor
    if conversation_id:
        tutor_response = test_ask_tutor(conversation_id)
        results['ask_tutor'] = tutor_response is not None
    
    # Test 4b: Get conversation WITH messages (critical test for ConversationWithMessages fix)
    if conversation_id:
        results['get_conv_messages'] = test_get_conversation(conversation_id, include_messages=True)
    
    # Test 7: Update knowledge
    knowledge = test_update_knowledge()
    results['update_knowledge'] = knowledge is not None
    
    # Test 8: Get knowledge
    results['get_knowledge'] = test_get_knowledge()
    
    # Test 9: List conversations
    results['list_conv'] = test_list_conversations()
    
    # Test 10: Analytics
    results['analytics'] = test_analytics()
    
    # Summary
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}Test Summary{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, passed_test in results.items():
        status = f"{GREEN}✅ PASSED{RESET}" if passed_test else f"{RED}❌ FAILED{RESET}"
        print(f"  {test_name:25} {status}")
    
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        print(f"{GREEN}🎉 All tests passed! Service is working correctly.{RESET}")
        return 0
    else:
        print(f"{YELLOW}⚠️  Some tests failed. Check the output above.{RESET}")
        return 1


if __name__ == "__main__":
    sys.exit(run_all_tests())
