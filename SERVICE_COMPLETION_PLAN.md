# EUREKA Services - Completion Execution Plan

**Goal**: Complete AI Tutor, Assessment Engine, API Core, and Academic Tiers to production-ready state

---

## Priority Matrix

| Priority | Service | Task | Impact | Effort | Status |
|----------|---------|------|--------|--------|--------|
| P0 | Assessment | Fix Dockerfile port (8000→8002) | HIGH | 2min | ⏳ |
| P0 | All | Create .env configuration files | HIGH | 10min | ⏳ |
| P1 | API Core | Email service implementation | HIGH | 30min | ⏳ |
| P1 | Assessment | Fix questions route parameter | HIGH | 5min | ⏳ |
| P1 | AI Tutor | Improve RAG vector search | HIGH | 40min | ⏳ |
| P2 | Assessment | Complete grading algorithms | MEDIUM | 40min | ⏳ |
| P2 | API Core | Audit log database writing | MEDIUM | 20min | ⏳ |
| P2 | All | Add authentication middleware | MEDIUM | 30min | ⏳ |
| P3 | AI Tutor | Add missing package initializers | LOW | 5min | ⏳ |
| P3 | Assessment | Add database migrations | LOW | 30min | ⏳ |

---

## Execution Plan

### Phase 1: Critical Fixes (20 minutes)
**Objective**: Fix blockers preventing deployment

1. ✅ Fix Assessment Dockerfile port (8000 → 8002)
2. ✅ Fix Assessment questions route parameter binding
3. ✅ Create .env.example for all services
4. ✅ Add missing __init__.py files for AI Tutor
5. ✅ Update docker-compose.yml with correct environment variables

### Phase 2: Core Services Completion (90 minutes)
**Objective**: Implement critical missing functionality

6. ✅ **API Core - Email Service** (30min)
   - Create app/services/email.py
   - Implement send_verification_email(), send_password_reset_email()
   - Integrate with auth endpoints

7. ✅ **AI Tutor - RAG Improvement** (40min)
   - Implement actual vector similarity search
   - Replace dummy search with cosine similarity ranking
   - Fix hardcoded similarity scores

8. ✅ **API Core - Audit Log Writing** (20min)
   - Complete TODO in audit middleware
   - Create background task to write audit logs

### Phase 3: Enhanced Functionality (60 minutes)

9. ✅ **Assessment - Grading Algorithms** (40min)
   - Implement short answer keyword matching
   - Implement matching question grading
   - Add partial credit logic

10. ✅ **All Services - Authentication Middleware** (20min)
    - Create reusable auth dependency
    - Add JWT verification
    - Add role-based access control decorator

### Phase 4: Database & Migrations (30 minutes)

11. ✅ Add Alembic migrations for all services
12. ✅ Create database seed scripts
13. ✅ Add database indexes for performance

### Phase 5: Testing & Deployment (30 minutes)

14. ✅ Deploy all services with docker-compose
15. ✅ Test critical endpoints
16. ✅ Verify service integration
17. ✅ Create comprehensive service status document

---

## Implementation Details

### 1. Assessment Dockerfile Fix
**File**: `eureka/services/assess/Dockerfile`
**Change**: Line 13, 16 - Change port from 8000 to 8002
```dockerfile
EXPOSE 8002
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002", "--reload"]
```

### 2. Assessment Questions Route Fix
**File**: `eureka/services/assess/app/routes/questions.py`
**Change**: Line 19 - Add Query parameter
```python
assessment_id: UUID = Query(..., description="Assessment ID")
```

### 3. Environment Configuration Files

Create `.env.example` for each service with all required variables:

**AI Tutor**:
```env
DATABASE_URL=postgresql+asyncpg://eureka:password@db:5432/eureka
OPENAI_API_KEY=sk-your-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here
VERSION=1.0.0
EMBEDDING_MODEL=text-embedding-ada-002
EMBEDDING_DIMENSIONS=1536
```

**Assessment Engine**:
```env
DATABASE_URL=postgresql+asyncpg://eureka:password@db:5432/eureka
OPENAI_API_KEY=sk-your-key-here
```

**API Core**:
```env
DATABASE_URL=postgresql+asyncpg://eureka:password@db:5434/eureka
JWT_SECRET=your-secret-key-min-32-chars
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-password
CORS_ORIGINS=http://localhost:3006,http://localhost:3000
```

### 4. Email Service Implementation

**File**: `eureka/services/api-core/app/services/email.py` (NEW)

Key functions:
- `send_email()` - Base SMTP sender
- `send_verification_email(email, token)` - Email verification
- `send_password_reset_email(email, token)` - Password reset
- `send_welcome_email(email, name)` - Welcome email

Integration points:
- `auth.py` line 87 - Replace TODO with email service call
- `auth.py` line 311 - Replace TODO with password reset email

### 5. RAG Vector Search Improvement

**File**: `eureka/services/tutor-llm/app/services/ai_service.py`

Changes:
- Line 179-180: Implement actual similarity search
- Use existing `calculate_cosine_similarity()` function
- Sort results by similarity score
- Return top-k most relevant documents

```python
async def retrieve_relevant_content(
    self, db: AsyncSession, course_id: UUID, query: str, top_k: int = 5
) -> List[CourseContent]:
    # Generate query embedding
    query_embedding = await self.generate_embedding(query)

    # Get all course content
    all_content = await list_course_content(db, course_id)

    # Calculate similarity scores
    content_with_scores = []
    for content in all_content:
        if content.embedding:
            score = calculate_cosine_similarity(query_embedding, content.embedding)
            content_with_scores.append((content, score))

    # Sort by similarity and return top-k
    content_with_scores.sort(key=lambda x: x[1], reverse=True)
    return [content for content, score in content_with_scores[:top_k]]
```

### 6. Grading Algorithms

**File**: `eureka/services/assess/app/services/auto_grader.py`

Implement:
- `grade_short_answer()` - Keyword matching with fuzzy logic
- `grade_matching_question()` - Pair validation
- `calculate_partial_credit()` - Partial scoring

### 7. Audit Log Writing

**File**: `eureka/services/api-core/app/middleware/audit.py`

Complete line 98 TODO:
```python
# Write audit log to database
from app.core.models import AuditLog
audit_entry = AuditLog(
    request_id=audit_data["request_id"],
    user_id=audit_data.get("user_id"),
    organization_id=audit_data.get("organization_id"),
    action=audit_data["action"],
    resource_type=audit_data["resource_type"],
    resource_id=audit_data.get("resource_id"),
    # ... other fields
)
db.add(audit_entry)
await db.commit()
```

---

## Success Criteria

### AI Tutor (Target: 95%)
- [x] Environment configuration
- [x] Package structure (__init__.py files)
- [x] Improved RAG search
- [ ] Authentication middleware
- [ ] Logging configuration

### Assessment Engine (Target: 90%)
- [x] Dockerfile port fixed
- [x] Questions route fixed
- [x] Environment configuration
- [x] Short answer grading
- [x] Matching question grading
- [ ] Database migrations
- [ ] Test coverage

### API Core (Target: 85%)
- [x] Email service
- [x] Audit log writing
- [x] Environment configuration
- [ ] Permission system (deferred)
- [ ] Rate limiting (deferred)

### Overall Target
- All 3 core services deployable and functional
- Critical endpoints working
- Database properly initialized
- Services can communicate
- Basic authentication working

---

## Post-Completion Tasks

1. Update DEPLOYMENT_STATUS.md with new completion percentages
2. Create LOCALHOST_LINKS.md with all service endpoints
3. Test end-to-end workflows
4. Document remaining work for 100% completion
5. Commit and push all changes

---

**Estimated Total Time**: 3-4 hours
**Target Completion**: Today
**New Overall Completion**: 85%+ (from 65%)
