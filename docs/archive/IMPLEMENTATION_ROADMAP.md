# EUREKA PLATFORM - COMPLETE IMPLEMENTATION ROADMAP

**Purpose**: Step-by-step guide to complete the remaining 45% of the platform

**Current Status**: 55% Complete
**Remaining Work**: ~100 hours
**Priority**: Follow this roadmap in order for fastest MVP

---

## 🎯 QUICK WINS (Do These First - 5 hours)

### 1. Run Database Migration (15 minutes)

```bash
cd /home/user/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/eureka/services/api-core

# Verify migration file exists
ls -la alembic/versions/20251117_add_remaining_models.py

# Apply migration
alembic upgrade head

# Verify all tables created (should show 18+ tables)
docker exec eureka-db psql -U eureka -d eureka -c "\dt"
```

**Expected Output**: 18 tables created including assignments, submissions, grades, etc.

### 2. Add AI API Keys (5 minutes)

```bash
cd /home/user/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture

# Copy template
cp .env.template .env

# Edit .env and add your keys
nano .env
```

Add these lines:
```env
ANTHROPIC_API_KEY=sk-ant-YOUR-ACTUAL-KEY-HERE
OPENAI_API_KEY=sk-YOUR-ACTUAL-KEY-HERE
```

See `AI_SETUP_GUIDE.md` for detailed instructions.

### 3. Add Seed Data (4 hours)

Create `/eureka/ops/db/seed_demo_data.sql`:

```sql
-- Demo Organization
INSERT INTO organizations (id, name, slug, tier, email, is_active, is_verified, ferpa_compliant, coppa_compliant)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'Demo University',
    'demo-university',
    'undergraduate',
    'admin@demo.edu',
    true,
    true,
    true,
    false
);

-- Demo Admin User
INSERT INTO users (id, org_id, email, hashed_password, first_name, last_name, role, is_active, email_verified)
VALUES (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'admin@demo.edu',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpI5UwPwNQe2',  -- password: Admin123!
    'Demo',
    'Admin',
    'org_admin',
    true,
    true
);

-- Demo Teacher
INSERT INTO users (id, org_id, email, hashed_password, first_name, last_name, role, is_active, email_verified)
VALUES (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'teacher@demo.edu',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpI5UwPwNQe2',  -- password: Admin123!
    'Jane',
    'Teacher',
    'teacher',
    true,
    true
);

-- Demo Student
INSERT INTO users (id, org_id, email, hashed_password, first_name, last_name, role, is_active, email_verified)
VALUES (
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'student@demo.edu',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpI5UwPwNQe2',  -- password: Admin123!
    'John',
    'Student',
    'student',
    true,
    true
);

-- Demo Course
INSERT INTO courses (id, org_id, instructor_id, title, code, description, tier, subject, level, is_published)
VALUES (
    'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::uuid,
    'Introduction to Computer Science',
    'CS101',
    'Learn the fundamentals of programming and computer science',
    'undergraduate',
    'Computer Science',
    'beginner',
    true
);

-- Demo Enrollment
INSERT INTO enrollments (id, user_id, course_id, status, progress_percent, mastery_level)
VALUES (
    'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16'::uuid,
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::uuid,
    'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::uuid,
    'active',
    25,
    15
);
```

Apply seed data:
```bash
docker exec -i eureka-db psql -U eureka -d eureka < eureka/ops/db/seed_demo_data.sql
```

---

## 📦 PHASE 1: Core Service Completion (40 hours)

### Adaptive Service (8 hours)

**Location**: `/eureka/services/adaptive/`

**Missing Files to Create**:

1. `/eureka/services/adaptive/app/crud/mastery.py`:
```python
"""Mastery tracking CRUD operations"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List, Optional
from uuid import UUID

async def get_user_mastery(db: AsyncSession, user_id: UUID, course_id: UUID) -> dict:
    """Get user's mastery levels for a course"""
    # TODO: Implement actual query
    return {
        "user_id": str(user_id),
        "course_id": str(course_id),
        "concepts": [],
        "overall_mastery": 0.0
    }

async def update_mastery_level(db: AsyncSession, user_id: UUID, concept_id: UUID, level: float):
    """Update mastery level for a concept"""
    # TODO: Implement mastery update
    pass

async def recommend_next_concept(db: AsyncSession, user_id: UUID, course_id: UUID) -> dict:
    """Recommend next concept to learn based on mastery"""
    # TODO: Implement recommendation algorithm
    return {
        "concept_id": None,
        "reason": "Continue with current topic",
        "difficulty": "appropriate"
    }
```

2. `/eureka/services/adaptive/app/api/v1/endpoints/mastery.py`:
```python
"""Mastery tracking endpoints"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.core.database import get_db
from app.crud import mastery as mastery_crud

router = APIRouter()

@router.get("/users/{user_id}/courses/{course_id}/mastery")
async def get_mastery(
    user_id: UUID,
    course_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get user's mastery levels for a course"""
    return await mastery_crud.get_user_mastery(db, user_id, course_id)

@router.post("/users/{user_id}/concepts/{concept_id}/mastery")
async def update_mastery(
    user_id: UUID,
    concept_id: UUID,
    level: float,
    db: AsyncSession = Depends(get_db)
):
    """Update mastery level for a concept"""
    await mastery_crud.update_mastery_level(db, user_id, concept_id, level)
    return {"status": "updated"}

@router.get("/users/{user_id}/courses/{course_id}/recommend")
async def get_recommendation(
    user_id: UUID,
    course_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get next concept recommendation"""
    return await mastery_crud.recommend_next_concept(db, user_id, course_id)
```

**Implementation Steps**:
1. Create CRUD operations (2 hours)
2. Create API endpoints (2 hours)
3. Implement mastery algorithm (3 hours)
4. Test endpoints (1 hour)

### Analytics Service (8 hours)

**Location**: `/eureka/services/analytics/`

**Missing Files to Create**:

1. `/eureka/services/analytics/app/crud/analytics.py`:
```python
"""Analytics CRUD operations"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Dict
from uuid import UUID
from datetime import datetime, timedelta

async def get_course_analytics(db: AsyncSession, course_id: UUID) -> dict:
    """Get comprehensive course analytics"""
    # TODO: Implement queries
    return {
        "course_id": str(course_id),
        "total_students": 0,
        "active_students": 0,
        "average_grade": 0.0,
        "completion_rate": 0.0,
        "engagement_score": 0.0
    }

async def get_student_analytics(db: AsyncSession, user_id: UUID) -> dict:
    """Get student performance analytics"""
    return {
        "user_id": str(user_id),
        "courses_enrolled": 0,
        "average_grade": 0.0,
        "time_spent": 0,
        "mastery_levels": {}
    }

async def detect_at_risk_students(db: AsyncSession, course_id: UUID) -> List[dict]:
    """Identify students at risk of failing"""
    # TODO: Implement risk detection algorithm
    return []
```

2. `/eureka/services/analytics/app/api/v1/endpoints/analytics.py`:
```python
"""Analytics endpoints"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.core.database import get_db
from app.crud import analytics as analytics_crud

router = APIRouter()

@router.get("/courses/{course_id}")
async def get_course_analytics(
    course_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get course analytics"""
    return await analytics_crud.get_course_analytics(db, course_id)

@router.get("/students/{user_id}")
async def get_student_analytics(
    user_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get student analytics"""
    return await analytics_crud.get_student_analytics(db, user_id)

@router.get("/courses/{course_id}/at-risk")
async def get_at_risk_students(
    course_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get students at risk"""
    return await analytics_crud.detect_at_risk_students(db, course_id)
```

### Content Service (6 hours)

**Location**: `/eureka/services/content/`

**Missing Files to Create**:

1. `/eureka/services/content/app/crud/content.py`:
```python
"""Content CRUD operations"""
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

async def list_content(db: AsyncSession, course_id: UUID) -> List[dict]:
    """List all content for a course"""
    return []

async def create_content(db: AsyncSession, course_id: UUID, content_data: dict) -> dict:
    """Create new content item"""
    return {"id": "new-content-id", **content_data}

async def update_content(db: AsyncSession, content_id: UUID, updates: dict) -> dict:
    """Update content item"""
    return {"id": str(content_id), **updates}
```

### File-Storage Service (8 hours)

**Already created** basic structure. Need to add:

1. S3/MinIO integration
2. File upload endpoint
3. File download endpoint
4. File deletion

See `eureka/services/file-storage/main.py` - already started.

### API Core - Complete CRUD (10 hours)

**Location**: `/eureka/services/api-core/app/crud/`

**Files to complete**:
- assignment.py - Assignment CRUD
- submission.py - Submission CRUD
- grade.py - Grade CRUD

Templates in next section.

---

## 🎨 PHASE 2: Frontend Integration (30 hours)

### Complete API Client (10 hours)

**Location**: `/eureka/apps/web/src/lib/api-client.ts`

**Missing Methods** (~30 methods needed):

```typescript
// Assignments
export const createAssignment = async (courseId: string, data: AssignmentCreate) => {
  return api.post(`/api/v1/courses/${courseId}/assignments`, data);
};

export const listAssignments = async (courseId: string) => {
  return api.get(`/api/v1/courses/${courseId}/assignments`);
};

export const submitAssignment = async (assignmentId: string, data: SubmissionCreate) => {
  return api.post(`/api/v1/assignments/${assignmentId}/submit`, data);
};

// Grades
export const getGrades = async (userId: string, courseId: string) => {
  return api.get(`/api/v1/users/${userId}/courses/${courseId}/grades`);
};

// Notifications
export const getNotifications = async (userId: string) => {
  return api.get(`/api/v1/users/${userId}/notifications`);
};

export const markNotificationRead = async (notificationId: string) => {
  return api.patch(`/api/v1/notifications/${notificationId}/read`);
};

// File Uploads
export const uploadFile = async (file: File, referenceType?: string, referenceId?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  if (referenceType) formData.append('reference_type', referenceType);
  if (referenceId) formData.append('reference_id', referenceId);

  return api.post('/api/v1/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Analytics
export const getCourseAnalytics = async (courseId: string) => {
  return api.get(`/api/v1/analytics/courses/${courseId}`);
};

export const getStudentAnalytics = async (userId: string) => {
  return api.get(`/api/v1/analytics/students/${userId}`);
};

// Adaptive Learning
export const getMastery = async (userId: string, courseId: string) => {
  return api.get(`/api/v1/adaptive/users/${userId}/courses/${courseId}/mastery`);
};

export const getRecommendation = async (userId: string, courseId: string) => {
  return api.get(`/api/v1/adaptive/users/${userId}/courses/${courseId}/recommend`);
};

// AI Tutor
export const askTutor = async (message: string, courseId: string, userId: string) => {
  return api.post('/api/v1/tutor/ask', {
    message,
    course_id: courseId,
    user_id: userId,
    use_rag: true
  });
};

// Auto-grading
export const autoGradeSubmission = async (submissionId: string) => {
  return api.post(`/api/v1/grading/auto/${submissionId}`);
};
```

### Connect Dashboard Pages (12 hours)

**Pages to Connect**:

1. `/dashboard/courses` - Connect to courses API
2. `/dashboard/assessments` - Connect to assignments API
3. `/dashboard/analytics` - Connect to analytics API
4. `/dashboard/settings` - Connect to user settings API

### Update Dashboard Components (8 hours)

Replace mock data with real API calls in all dashboard pages.

---

## 🔒 PHASE 3: Authentication & Security (20 hours)

### Enable JWT Authentication (8 hours)

1. Uncomment authentication in `/eureka/services/api-core/app/api/v1/endpoints/auth.py`
2. Add JWT validation middleware
3. Test login/logout flows

### Implement RBAC (6 hours)

Create `/eureka/services/api-core/app/utils/rbac.py`:

```python
"""Role-Based Access Control"""
from functools import wraps
from fastapi import HTTPException, Depends
from app.models.user import User

def require_role(*allowed_roles):
    """Decorator to require specific roles"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user: User = Depends(get_current_user), **kwargs):
            if current_user.role not in allowed_roles:
                raise HTTPException(status_code=403, detail="Insufficient permissions")
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator

# Usage:
# @require_role('teacher', 'admin')
# async def create_assignment(...):
```

### Add Rate Limiting (4 hours)

Install: `pip install slowapi`

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/api/v1/tutor/ask")
@limiter.limit("10/minute")
async def ask_tutor(request: Request):
    ...
```

### Enable Audit Logging (2 hours)

Create audit log middleware to automatically log all API calls to `audit_logs` table.

---

## 🧪 PHASE 4: Testing (16 hours)

### Setup Pytest (2 hours)

Create `/eureka/services/api-core/tests/conftest.py`:

```python
import pytest
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from app.core.database import Base

@pytest.fixture
async def db_session():
    engine = create_async_engine("postgresql+asyncpg://eureka:eureka123@localhost:5432/eureka_test")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSession(engine) as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
```

### Write Unit Tests (8 hours)

Create tests for each model and CRUD operation:

```python
# /eureka/services/api-core/tests/test_user_crud.py
import pytest
from app.crud.user import create_user, get_user

@pytest.mark.asyncio
async def test_create_user(db_session):
    user_data = {
        "email": "test@example.com",
        "password": "Password123!",
        "first_name": "Test",
        "last_name": "User"
    }
    user = await create_user(db_session, user_data)
    assert user.email == "test@example.com"
```

### Write Integration Tests (4 hours)

Test API endpoints end-to-end.

### Setup CI/CD (2 hours)

Create `.github/workflows/test.yml`:

```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: eureka123
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v2
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: '3.11'
    - name: Install dependencies
      run: |
        cd eureka/services/api-core
        pip install -r requirements.txt
        pip install pytest pytest-asyncio
    - name: Run tests
      run: |
        cd eureka/services/api-core
        pytest
```

---

## ☸️ PHASE 5: Deployment (12 hours)

### Create Kubernetes Manifests (6 hours)

**File**: `/eureka/ops/k8s/deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: eureka-api-core
spec:
  replicas: 3
  selector:
    matchLabels:
      app: eureka-api-core
  template:
    metadata:
      labels:
        app: eureka-api-core
    spec:
      containers:
      - name: api-core
        image: eureka/api-core:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: eureka-secrets
              key: database-url
        - name: ANTHROPIC_API_KEY
          valueFrom:
            secretKeyRef:
              name: eureka-secrets
              key: anthropic-api-key
```

### Create Helm Charts (4 hours)

### Setup Monitoring (2 hours)

Add Prometheus metrics:

```python
from prometheus_client import Counter, Histogram, generate_latest

REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'HTTP request duration')

@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    with REQUEST_DURATION.time():
        response = await call_next(request)
        REQUEST_COUNT.labels(method=request.method, endpoint=request.url.path).inc()
    return response

@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type="text/plain")
```

---

## ✅ COMPLETION CHECKLIST

### Quick Wins ✅
- [ ] Run database migration
- [ ] Add AI API keys
- [ ] Add seed data
- [ ] Test basic user flow

### Phase 1: Services ⚠️
- [ ] Complete adaptive service CRUD
- [ ] Complete analytics service CRUD
- [ ] Complete content service
- [ ] Complete file-storage service
- [ ] Complete api-core CRUD operations

### Phase 2: Frontend ⚠️
- [ ] Complete API client (30 methods)
- [ ] Connect all dashboard pages
- [ ] Replace mock data with real API calls
- [ ] Test all user flows

### Phase 3: Security ⚠️
- [ ] Enable JWT authentication
- [ ] Implement RBAC
- [ ] Add rate limiting
- [ ] Enable audit logging

### Phase 4: Testing ❌
- [ ] Setup pytest
- [ ] Write unit tests (50+ tests)
- [ ] Write integration tests
- [ ] Setup CI/CD pipeline

### Phase 5: Deployment ❌
- [ ] Create Kubernetes manifests
- [ ] Create Helm charts
- [ ] Setup monitoring
- [ ] Production deployment

---

## 🎯 MVP DEFINITION

**Minimum features for a functional platform**:

✅ **Must Have** (for MVP):
- User authentication (login/register)
- Create courses
- Enroll in courses
- Create assignments
- Submit assignments
- View grades
- Basic AI tutor (with API keys)
- File uploads

⚠️ **Should Have** (enhance MVP):
- Auto-grading
- Analytics dashboard
- Notifications
- Adaptive learning

❌ **Nice to Have** (post-MVP):
- Mobile app
- Professional tier services (law, MBA, etc.)
- Advanced tier features
- Real-time collaboration

---

## 📊 TIME ESTIMATES

| Phase | Hours | Days (8hr/day) |
|-------|-------|----------------|
| Quick Wins | 5 | 0.5 |
| Services | 40 | 5 |
| Frontend | 30 | 4 |
| Security | 20 | 2.5 |
| Testing | 16 | 2 |
| Deployment | 12 | 1.5 |
| **TOTAL** | **123** | **15.5** |

**With focused work**: 2-3 weeks to fully functional platform

**For MVP only**: 50 hours (1 week focused work)

---

## 🚀 GETTING STARTED TODAY

**If you have 1 hour**:
1. Run database migration (15 min)
2. Add AI API keys (5 min)
3. Test AI tutor endpoint (10 min)
4. Add seed data (30 min)

**If you have 4 hours**:
- Do the above +
- Complete one service (adaptive OR analytics)
- Test the service endpoints
- Update frontend to call the service

**If you have 8 hours**:
- Do the above +
- Complete API client
- Connect dashboard pages
- Test end-to-end user flow
- **You'll have a working MVP!**

---

## 📞 SUPPORT

**Issues**: Create GitHub issue with detailed description

**Questions**: See documentation files:
- `AI_SETUP_GUIDE.md` - AI integration
- `IMPLEMENTATION_GUIDE.md` - General implementation
- `TABLE_REFERENCE.md` - Database schema
- `PLATFORM_COMPLETION_STATUS.md` - Current status

**Community**: GitHub Discussions

---

**You've got this! The foundation is solid, now it's just implementation.** 🎉
