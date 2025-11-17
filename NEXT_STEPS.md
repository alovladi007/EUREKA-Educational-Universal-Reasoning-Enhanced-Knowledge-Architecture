# NEXT STEPS TO COMPLETE EUREKA PLATFORM

**Current Status**: 70% Complete - Core services implemented and ready
**Goal**: Complete MVP deployment in 20-25 hours

---

## 🚀 IMMEDIATE ACTIONS (Critical Path to MVP)

### Step 1: Start Infrastructure (5 minutes)

The platform requires PostgreSQL, Redis, and MinIO to run. You have two options:

#### Option A: Using Docker Compose (Recommended)

1. **Check if Docker is running:**
   ```bash
   docker ps
   ```

2. **Start infrastructure services:**
   ```bash
   cd eureka/ops/docker
   docker-compose up -d postgres redis minio
   ```

3. **Verify services are running:**
   ```bash
   docker ps
   # Should see: postgres, redis, minio
   ```

4. **Wait for PostgreSQL to be ready (30 seconds):**
   ```bash
   # Check PostgreSQL is accepting connections
   pg_isready -h localhost -p 5432 -U eureka
   # Should output: localhost:5432 - accepting connections
   ```

#### Option B: Local Installation

If Docker isn't available, install services locally:

**PostgreSQL 16:**
```bash
# Ubuntu/Debian
sudo apt-get install postgresql-16 postgresql-contrib-16

# macOS
brew install postgresql@16

# Start service
sudo systemctl start postgresql  # Linux
brew services start postgresql@16  # macOS
```

**Redis 7:**
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS
brew install redis

# Start service
sudo systemctl start redis  # Linux
brew services start redis  # macOS
```

**MinIO (S3-compatible storage):**
```bash
# Download binary
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio

# Start MinIO
MINIO_ROOT_USER=minioadmin MINIO_ROOT_PASSWORD=minioadmin ./minio server /data/minio --console-address ":9001"
```

---

### Step 2: Run Database Migration (5 minutes)

Once PostgreSQL is running:

```bash
cd /home/user/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/eureka/services/api-core

# Check current migration status
alembic current

# Run all pending migrations
alembic upgrade head

# Verify tables were created
psql -h localhost -U eureka -d eureka -c "\dt"
# Should see 11 tables: users, organizations, courses, enrollments,
# assignments, submissions, grades, refresh_tokens, audit_logs,
# file_uploads, notifications
```

**Expected Output:**
```
INFO  [alembic.runtime.migration] Running upgrade  -> 20251028_initial_schema
INFO  [alembic.runtime.migration] Running upgrade 20251028_initial_schema -> 20251117_add_remaining_models
```

**If you get connection errors:**
1. Verify PostgreSQL is running: `pg_isready -h localhost -p 5432 -U eureka`
2. Check credentials in `alembic.ini` or `.env`
3. Default connection: `postgresql://eureka:eureka123@localhost:5432/eureka`

---

### Step 3: Load Demo Data (2 minutes)

```bash
cd /home/user/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture

# Load seed data
psql -h localhost -U eureka -d eureka < eureka/ops/db/seed_demo_data.sql

# Verify data was loaded
psql -h localhost -U eureka -d eureka -c "SELECT email, role FROM users;"
```

**Expected Output:**
```
         email          |     role
------------------------+---------------
 admin@demo.edu         | super_admin
 teacher@demo.edu       | teacher
 student@demo.edu       | student
 ...
(11 rows)
```

**Demo Accounts (all passwords: `Admin123!`):**
- `admin@demo.edu` - Super Admin
- `admin@springfield.edu` - Org Admin
- `teacher@demo.edu` - Teacher
- `prof.smith@demo.edu` - Teacher
- `student@demo.edu` - Student
- `alice.johnson@demo.edu` - Student
- `bob.wilson@demo.edu` - Student
- `carol.davis@demo.edu` - Student
- `david.martinez@demo.edu` - Student
- `dr.anderson@demo.edu` - Medical School Admin
- `medstudent@demo.edu` - Medical Student

---

### Step 4: Add AI API Keys (5 minutes)

**Get API Keys:**

1. **Anthropic Claude** (Primary - Recommended):
   - Sign up at: https://console.anthropic.com/
   - Go to API Keys section
   - Create new key
   - Copy key (starts with `sk-ant-...`)

2. **OpenAI** (Secondary - Optional):
   - Sign up at: https://platform.openai.com/
   - Go to API Keys
   - Create new key
   - Copy key (starts with `sk-...`)

**Add to Environment:**

Create or edit `.env` file in each service directory:

```bash
# For tutor-llm service
cat > eureka/services/tutor-llm/.env << EOF
ANTHROPIC_API_KEY=sk-ant-your-key-here
OPENAI_API_KEY=sk-your-openai-key-here
EOF

# For assess service (AI grading)
cat > eureka/services/assess/.env << EOF
ANTHROPIC_API_KEY=sk-ant-your-key-here
OPENAI_API_KEY=sk-your-openai-key-here
EOF
```

**Expected Costs:**
- Development/Testing: $5-10/month
- Light production use: $20-50/month
- See `AI_SETUP_GUIDE.md` for detailed pricing

---

### Step 5: Start All Services (5 minutes)

**Start services in separate terminal windows or use tmux:**

```bash
# Terminal 1: API Core (Port 8000)
cd eureka/services/api-core
python main.py

# Terminal 2: Adaptive Learning (Port 8003)
cd eureka/services/adaptive
python main.py

# Terminal 3: Analytics (Port 8005)
cd eureka/services/analytics
python main.py

# Terminal 4: File Storage (Port 8006)
cd eureka/services/file-storage
python main.py

# Terminal 5: Content Service (Port 8004)
cd eureka/services/content
python main.py

# Optional: AI Tutor (Port 8001) - requires API keys
cd eureka/services/tutor-llm
python main.py

# Optional: Assessment (Port 8002)
cd eureka/services/assess
python main.py
```

**Or use a process manager (recommended):**

```bash
# Install foreman or honcho
pip install honcho

# Create Procfile
cat > Procfile << EOF
api-core: cd eureka/services/api-core && python main.py
adaptive: cd eureka/services/adaptive && python main.py
analytics: cd eureka/services/analytics && python main.py
file-storage: cd eureka/services/file-storage && python main.py
content: cd eureka/services/content && python main.py
EOF

# Start all services
honcho start
```

**Verify services are running:**

```bash
# Check each service health endpoint
curl http://localhost:8000/health  # api-core
curl http://localhost:8003/health  # adaptive
curl http://localhost:8004/health  # content
curl http://localhost:8005/health  # analytics
curl http://localhost:8006/health  # file-storage
```

**Access API Documentation:**
- API Core: http://localhost:8000/docs
- Adaptive: http://localhost:8003/docs
- Content: http://localhost:8004/docs
- Analytics: http://localhost:8005/docs
- File Storage: http://localhost:8006/docs

---

### Step 6: Test Core Flows (30 minutes)

Use the API documentation (Swagger UI) to test:

**1. User Management:**
```bash
# Login (once authentication is enabled)
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "student@demo.edu", "password": "Admin123!"}'
```

**2. Course Enrollment:**
```bash
# Get courses
curl http://localhost:8000/api/v1/courses

# Enroll in course
curl -X POST http://localhost:8000/api/v1/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "20000000-0000-0000-0000-000000000010",
    "course_id": "c0000000-0000-0000-0000-000000000001"
  }'
```

**3. File Upload:**
```bash
# Upload a test file
curl -X POST http://localhost:8006/api/v1/files/upload \
  -F "file=@test.pdf" \
  -F "user_id=20000000-0000-0000-0000-000000000010" \
  -F "folder=assignments"
```

**4. Content Access:**
```bash
# Create module
curl -X POST http://localhost:8004/api/v1/modules \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "c0000000-0000-0000-0000-000000000001",
    "title": "Introduction",
    "order_index": 1
  }'

# Create content
curl -X POST http://localhost:8004/api/v1/content \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "c0000000-0000-0000-0000-000000000001",
    "title": "Lesson 1",
    "content_type": "lesson",
    "content_body": "<h1>Welcome</h1>"
  }'
```

**5. Analytics:**
```bash
# Get student analytics
curl http://localhost:8005/api/v1/analytics/student/20000000-0000-0000-0000-000000000010
```

**6. Adaptive Learning:**
```bash
# Generate learning path
curl -X POST http://localhost:8003/api/v1/learning-paths/generate \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "20000000-0000-0000-0000-000000000010",
    "course_id": "c0000000-0000-0000-0000-000000000001"
  }'
```

---

## 📋 REMAINING WORK (20-25 hours)

### Phase 1: Frontend Integration (6 hours)

**Current Status**: Frontend exists but API client is ~40% complete

**Tasks:**
1. Complete API client (`eureka/frontend/lib/api.ts`)
   - Add methods for all 90+ backend endpoints
   - Implement proper error handling
   - Add request/response typing

2. Connect Dashboard Pages:
   - Student dashboard → Analytics API
   - Teacher dashboard → Course + Analytics APIs
   - Admin dashboard → Organization + User APIs
   - Course page → Content API
   - Assignment page → Assignment + Submission APIs

3. Replace Mock Data:
   - Remove all hardcoded sample data
   - Use real API calls
   - Add loading states
   - Add error handling

**Estimated Files to Modify:**
- `eureka/frontend/lib/api.ts` (~500 lines to add)
- `eureka/frontend/app/dashboard/student/page.tsx`
- `eureka/frontend/app/dashboard/teacher/page.tsx`
- `eureka/frontend/app/dashboard/admin/page.tsx`
- `eureka/frontend/app/courses/[id]/page.tsx`
- 10-15 other page files

---

### Phase 2: Testing Infrastructure (4 hours)

**Current Status**: No tests exist

**Tasks:**
1. Setup pytest for all services
2. Write unit tests for models
3. Write API integration tests
4. Setup test database
5. Configure test runner

**Example Test Structure:**
```python
# tests/test_adaptive.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_concept():
    response = client.post("/api/v1/concepts", json={
        "course_id": "...",
        "name": "Test Concept",
        "difficulty_level": "intermediate"
    })
    assert response.status_code == 201
    assert response.json()["name"] == "Test Concept"
```

**Target Coverage**: 60%+ for critical paths

---

### Phase 3: Authentication & Security (4 hours)

**Current Status**: Authentication disabled, RBAC not enforced

**Tasks:**

1. **Enable JWT Authentication:**
   ```python
   # Add to each service
   from fastapi import Depends, HTTPException
   from fastapi.security import HTTPBearer

   security = HTTPBearer()

   async def get_current_user(token: str = Depends(security)):
       # Verify JWT token
       # Return user object
       pass
   ```

2. **Implement RBAC:**
   ```python
   def require_role(allowed_roles: List[str]):
       def wrapper(user = Depends(get_current_user)):
           if user.role not in allowed_roles:
               raise HTTPException(403, "Insufficient permissions")
           return user
       return wrapper

   @router.post("/admin-only")
   async def admin_endpoint(user = Depends(require_role(["admin"]))):
       pass
   ```

3. **Add Rate Limiting:**
   ```python
   from slowapi import Limiter
   from slowapi.util import get_remote_address

   limiter = Limiter(key_func=get_remote_address)

   @app.post("/api/endpoint")
   @limiter.limit("10/minute")
   async def rate_limited_endpoint():
       pass
   ```

4. **Enable Audit Logging:**
   - Log all write operations to `audit_logs` table
   - Include user_id, action, resource, changes
   - Store IP address and user agent

---

### Phase 4: Production Deployment (6 hours)

**Current Status**: Development setup only

**Tasks:**

1. **Create Kubernetes Manifests** (3 hours):
   ```yaml
   # k8s/api-core-deployment.yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: api-core
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: api-core
     template:
       metadata:
         labels:
           app: api-core
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
   ```

2. **Setup CI/CD** (2 hours):
   ```yaml
   # .github/workflows/test-and-deploy.yml
   name: Test and Deploy
   on: [push]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v2
       - name: Run tests
         run: pytest

     deploy:
       needs: test
       if: github.ref == 'refs/heads/main'
       steps:
       - name: Deploy to production
         run: kubectl apply -f k8s/
   ```

3. **Setup Monitoring** (1 hour):
   - Prometheus for metrics
   - Grafana for dashboards
   - Sentry for error tracking

---

## 🎯 RECOMMENDED DEVELOPMENT ORDER

### Week 1 (15 hours):
- Day 1-2: Infrastructure setup + Database migration (2 hours)
- Day 3-4: Frontend integration (6 hours)
- Day 5: Testing infrastructure (4 hours)
- Day 6: Authentication (3 hours)

### Week 2 (10 hours):
- Day 1-2: Complete remaining tests (2 hours)
- Day 3-4: Production deployment setup (4 hours)
- Day 5: End-to-end testing (2 hours)
- Day 6: Performance optimization (2 hours)

---

## 📊 SUCCESS CRITERIA

### Minimum Viable Product (MVP):
✅ All core services running
✅ Database with demo data
✅ Frontend connected to backend
✅ User authentication working
✅ File upload/download functional
✅ Basic CRUD operations working

### Production Ready:
✅ All tests passing (60%+ coverage)
✅ Authentication + RBAC enforced
✅ Rate limiting active
✅ Audit logging enabled
✅ Kubernetes deployment configured
✅ CI/CD pipeline operational
✅ Monitoring active

---

## 🚨 COMMON ISSUES & SOLUTIONS

### Issue: "ModuleNotFoundError: No module named 'app'"
**Solution:**
```bash
# Make sure you're in the service directory
cd eureka/services/[service-name]

# Install dependencies
pip install -r requirements.txt

# Or install parent directory as editable
pip install -e .
```

### Issue: "Connection refused" to PostgreSQL
**Solution:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Or for local install
sudo systemctl status postgresql

# Check connection
pg_isready -h localhost -p 5432 -U eureka
```

### Issue: "Bucket does not exist" in file-storage
**Solution:**
```bash
# MinIO auto-creates buckets, but verify it's running
curl http://localhost:9000/minio/health/live

# Or manually create bucket via MinIO console
# Access: http://localhost:9001
# Login: minioadmin / minioadmin
```

### Issue: Alembic migration fails
**Solution:**
```bash
# Reset and rerun
alembic downgrade base
alembic upgrade head

# Or check current state
alembic current
alembic history
```

---

## 📞 SUPPORT

### Documentation:
- API Documentation: http://localhost:[port]/docs for each service
- Database Schema: `TABLE_REFERENCE.md`
- AI Setup: `AI_SETUP_GUIDE.md`
- Implementation Details: `IMPLEMENTATION_ROADMAP.md`

### Quick Reference:
- **Session Summary**: `SESSION_SUMMARY.md`
- **Platform Status**: `PLATFORM_COMPLETION_STATUS.md`
- **Quick Start**: `QUICK_START.md`

---

**Last Updated**: November 17, 2025
**Platform Version**: 0.7 (70% Complete)
**Target**: 1.0 (100% Complete) in 20-25 hours
