# MedAtlas Integration Plan for EUREKA
**Date**: November 2, 2025
**Status**: In Progress
**Target**: Integrate complete medical education platform into EUREKA

---

## Executive Summary

Integrating MedAtlas MD, a comprehensive medical education platform, into EUREKA's Medical Education tier. MedAtlas provides:
- **Medical Question Bank (QBank)** with IRT scoring
- **AI Tutor** powered by Claude (Anthropic)
- **Authentication System** with JWT and RBAC
- **Complete Database Schema** for medical education
- **Analytics & Performance Tracking**

**Progress**: 65% of backend complete, 0% of frontend

---

## 1. Architecture Overview

### MedAtlas Components
```
┌──────────────────────────────────────────────────────┐
│         EUREKA Medical Education Platform             │
│              (Port 8100 - medical-school)             │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌────────────┐  ┌────────────┐  ┌─────────────┐   │
│  │   QBank    │  │  AI Tutor  │  │    Auth     │   │
│  │  Service   │  │  Service   │  │   Service   │   │
│  └────────────┘  └────────────┘  └─────────────┘   │
│                                                       │
│  ┌────────────┐  ┌────────────┐  ┌─────────────┐   │
│  │  Clinical  │  │    OSCE    │  │  3D Anatomy │   │
│  │   Cases    │  │  Service   │  │   Service   │   │
│  └────────────┘  └────────────┘  └─────────────┘   │
│                                                       │
└──────────────────────────────────────────────────────┘
              ▼                          ▼
   ┌──────────────────┐      ┌──────────────────┐
   │   PostgreSQL 16  │      │   Redis Cache    │
   │   with pgvector  │      │   Session Store  │
   └──────────────────┘      └──────────────────┘
```

### EUREKA Integration Points
- **Service Location**: `/eureka/services/medical-school/`
- **Port**: 8100
- **Framework**: NestJS (TypeScript)
- **Database**: Shared PostgreSQL with EUREKA
- **Authentication**: JWT tokens (compatible with EUREKA auth)
- **Frontend**: Next.js pages in `/eureka/apps/web/src/app/dashboard/medical/`

---

## 2. Database Integration

### Approach: Unified Schema
- Add MedAtlas tables to EUREKA's existing PostgreSQL database
- 50+ new tables for medical education features
- Compatible with EUREKA's user and organization tables
- No conflicts with existing schemas

### Key Tables
```sql
-- Medical Question Bank
qbank_items              -- USMLE-style questions with IRT parameters
qbank_responses          -- Student answers and performance
assessments              -- Tests and exams
assessment_submissions   -- Test attempts

-- AI Tutor
chat_conversations       -- Chat sessions
chat_messages           -- Message history with embeddings

-- Analytics
mastery_tracking        -- Knowledge graph
user_progress          -- Topic-level mastery
performance_metrics    -- Aggregated stats

-- Gamification
user_gamification      -- XP, levels, streaks
badges                 -- Achievement badges
user_badges            -- Earned badges
```

### Migration Strategy
1. Run `init.sql` to create all tables
2. Run `seed.sql` to populate demo data
3. Verify no conflicts with existing EUREKA tables
4. Add foreign key references to EUREKA's `users` and `organizations`

---

## 3. Backend Service Structure

### Directory Structure
```
/eureka/services/medical-school/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── dto/auth.dto.ts
│   │   ├── qbank/
│   │   │   ├── qbank.controller.ts
│   │   │   ├── qbank.service.ts
│   │   │   └── dto/qbank.dto.ts
│   │   ├── ai-tutor/
│   │   │   ├── ai-tutor.controller.ts
│   │   │   ├── ai-tutor.service.ts
│   │   │   └── dto/ai-tutor.dto.ts
│   │   ├── items/          // Item management
│   │   ├── responses/      // Answer tracking
│   │   └── analytics/      // Performance analytics
│   ├── entities/
│   │   ├── qbank-item.entity.ts
│   │   ├── qbank-response.entity.ts
│   │   ├── chat-conversation.entity.ts
│   │   └── chat-message.entity.ts
│   ├── app.module.ts
│   ├── main.ts
│   └── health.controller.ts
├── database/
│   ├── init.sql
│   └── seed.sql
├── package.json
├── tsconfig.json
├── Dockerfile
└── .env.example
```

### API Endpoints

#### Authentication (10 endpoints)
```
POST   /api/v1/auth/register         - Register new user
POST   /api/v1/auth/login            - Login with credentials
POST   /api/v1/auth/refresh          - Refresh access token
POST   /api/v1/auth/logout           - Logout user
GET    /api/v1/auth/me               - Get current user
POST   /api/v1/auth/change-password  - Change password
POST   /api/v1/auth/forgot-password  - Request password reset
POST   /api/v1/auth/reset-password   - Reset password with token
GET    /api/v1/auth/verify-token     - Verify JWT token
```

#### QBank (15 endpoints)
```
# Item Management
POST   /api/v1/items                 - Create question
GET    /api/v1/items                 - List questions
GET    /api/v1/items/:id             - Get question
PUT    /api/v1/items/:id             - Update question
DELETE /api/v1/items/:id             - Delete question
POST   /api/v1/items/:id/review      - Mark as reviewed
GET    /api/v1/items/:id/analytics   - Get item analytics
POST   /api/v1/items/bulk            - Bulk create
GET    /api/v1/items/tags/popular    - Popular tags

# Practice Sessions
POST   /api/v1/qbank/practice/start  - Start practice
POST   /api/v1/qbank/practice/:id/answer        - Submit answer
POST   /api/v1/qbank/practice/:id/submit        - Submit all

# Analytics
GET    /api/v1/qbank/performance/by-topic       - By organ system
GET    /api/v1/qbank/performance/weak-areas     - Weak areas
GET    /api/v1/qbank/performance/statistics     - Overall stats
```

#### AI Tutor (10 endpoints)
```
POST   /api/v1/ai-tutor/conversations           - Create conversation
GET    /api/v1/ai-tutor/conversations           - Get conversations
GET    /api/v1/ai-tutor/conversations/:id       - Get conversation
GET    /api/v1/ai-tutor/conversations/:id/messages     - Get messages
POST   /api/v1/ai-tutor/messages                - Send message
POST   /api/v1/ai-tutor/messages/regenerate     - Regenerate response
POST   /api/v1/ai-tutor/conversations/:id/archive      - Archive
DELETE /api/v1/ai-tutor/conversations/:id       - Delete
GET    /api/v1/ai-tutor/conversations/:id/stats - Stats
```

#### Health Check
```
GET    /api/v1/health                - Health check
```

---

## 4. Frontend Integration

### New Pages to Create

#### Dashboard Structure
```
/dashboard/medical/
├── page.tsx                    # Medical Education Dashboard
├── qbank/
│   ├── page.tsx               # QBank browse/search
│   ├── practice/page.tsx      # Practice session
│   └── results/[id]/page.tsx  # Results page
├── tutor/
│   └── page.tsx               # AI Tutor chat interface
├── cases/
│   └── page.tsx               # Clinical cases (future)
├── osce/
│   └── page.tsx               # OSCE stations (future)
└── analytics/
    └── page.tsx               # Performance analytics
```

#### Key Components
```typescript
// QBank Components
<QBankInterface />              // Main QBank UI
<QuestionDisplay />             // Question renderer
<PracticeControls />            // Navigation, timer, submit
<ResultsSummary />              // Score and breakdown
<PerformanceChart />            // Analytics visualization

// AI Tutor Components
<ChatInterface />               // Chat UI
<MessageList />                 // Conversation history
<MessageInput />                // User input
<ConversationList />            // Sidebar with chats

// Shared Components
<ProgressTracker />             // Overall progress
<WeakAreasCard />               // Weak topics
<StudyRecommendations />        // AI recommendations
```

### API Client
```typescript
// /eureka/apps/web/src/lib/medatlas/api-client.ts
import axios from 'axios';

const medatlasClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MEDICAL_SCHOOL_URL || 'http://localhost:8100',
  headers: {'Content-Type': 'application/json'},
});

export const medatlasAPI = {
  qbank: {
    getItems: (params) => medatlasClient.get('/api/v1/items', { params }),
    startPractice: (data) => medatlasClient.post('/api/v1/qbank/practice/start', data),
    submitAnswer: (sessionId, data) => medatlasClient.post(`/api/v1/qbank/practice/${sessionId}/answer`, data),
  },
  tutor: {
    sendMessage: (data) => medatlasClient.post('/api/v1/ai-tutor/messages', data),
    getConversations: () => medatlasClient.get('/api/v1/ai-tutor/conversations'),
  },
};
```

---

## 5. Environment Configuration

### Backend (.env)
```bash
# Server
PORT=8100
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/eureka

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Claude AI
ANTHROPIC_API_KEY=sk-ant-api03-...
ANTHROPIC_MODEL=claude-sonnet-4-20250514
ANTHROPIC_MAX_TOKENS=4096

# Redis (optional for caching)
REDIS_URL=redis://localhost:6379

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:4500
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_MEDICAL_SCHOOL_URL=http://localhost:8100
```

---

## 6. Docker Integration

### Add to docker-compose.yml
```yaml
medical-school:
  build:
    context: ./services/medical-school
    dockerfile: Dockerfile
  container_name: eureka-medical-school
  environment:
    NODE_ENV: development
    PORT: 8100
    DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
    REDIS_URL: redis://redis:6379
    JWT_SECRET: ${JWT_SECRET}
    ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
  ports:
    - "8100:8100"
  depends_on:
    postgres:
      condition: service_healthy
    redis:
      condition: service_healthy
  networks:
    - eureka
  volumes:
    - ./services/medical-school:/app
    - /app/node_modules
  restart: unless-stopped
```

### Dockerfile
```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM base AS development
EXPOSE 8100
CMD ["npm", "run", "start:dev"]

FROM base AS production
RUN npm run build
EXPOSE 8100
CMD ["node", "dist/main"]
```

---

## 7. Implementation Steps

### Phase 1: Backend Service Setup (2-3 hours)
- [ ] Create service directory structure
- [ ] Set up package.json with dependencies
- [ ] Create main.ts and app.module.ts
- [ ] Add health check endpoint
- [ ] Test service starts successfully

### Phase 2: Database Setup (1 hour)
- [ ] Run init.sql to create tables
- [ ] Run seed.sql to add demo data
- [ ] Verify tables created successfully
- [ ] Test database connections

### Phase 3: Auth Module (2 hours)
- [ ] Create auth controller and service
- [ ] Implement JWT strategy and guards
- [ ] Create auth DTOs
- [ ] Test all auth endpoints

### Phase 4: QBank Module (3-4 hours)
- [ ] Create items controller and service
- [ ] Create responses tracking
- [ ] Create analytics service
- [ ] Implement IRT scoring
- [ ] Test all QBank endpoints

### Phase 5: AI Tutor Module (2-3 hours)
- [ ] Create AI tutor controller and service
- [ ] Integrate Claude API
- [ ] Create conversation management
- [ ] Test chat functionality

### Phase 6: Docker Integration (1 hour)
- [ ] Update docker-compose.yml
- [ ] Create Dockerfile
- [ ] Test docker build and run
- [ ] Verify service health

### Phase 7: Frontend Pages (4-6 hours)
- [ ] Create Medical Education dashboard
- [ ] Create QBank practice interface
- [ ] Create AI Tutor chat UI
- [ ] Create analytics dashboard
- [ ] Test end-to-end flows

### Phase 8: Testing & Documentation (2 hours)
- [ ] Test all API endpoints
- [ ] Test frontend workflows
- [ ] Update main README
- [ ] Create API documentation

**Total Estimated Time**: 15-20 hours

---

## 8. Key Features After Integration

### Students Can:
- ✅ Browse and search 1000s of USMLE-style questions
- ✅ Practice in 3 modes (Tutor, Timed, Test)
- ✅ Get instant feedback with detailed explanations
- ✅ Track performance by organ system
- ✅ Identify weak areas automatically
- ✅ Get personalized study recommendations
- ✅ Chat with AI tutor about medical topics
- ✅ View comprehensive analytics dashboard

### Teachers Can:
- ✅ Create and edit questions
- ✅ Set IRT parameters (difficulty, discrimination)
- ✅ Organize by organ systems and topics
- ✅ Review question performance
- ✅ Track student progress

### Admins Can:
- ✅ Manage users and roles
- ✅ View organization-wide analytics
- ✅ Monitor system health
- ✅ Configure settings

---

## 9. Success Metrics

### Technical
- All 35+ API endpoints functional
- <100ms average response time
- >99% uptime
- Database queries optimized with indexes

### Educational
- Students complete 50+ practice questions/week
- Average accuracy improves by 15% over semester
- 80%+ student satisfaction with AI Tutor
- Weak area identification accuracy >90%

---

## 10. Future Enhancements

### Short-term (Next Sprint)
- Clinical Cases module (virtual patients)
- OSCE stations (clinical skills assessment)
- Spaced repetition algorithm
- Mobile-responsive design

### Medium-term (Next Quarter)
- 3D Anatomy viewer with WebGL
- ECG interpretation module
- Radiology image viewer
- Peer collaboration features

### Long-term (Next Year)
- VR/AR medical simulations
- Advanced ML for adaptive learning
- Integration with medical school curricula
- Multi-institution deployment

---

## 11. Risk Mitigation

### Technical Risks
- **Database migration**: Test thoroughly on staging first
- **API performance**: Implement caching with Redis
- **Claude API costs**: Set token limits and monitoring
- **Security**: Regular audits, OWASP compliance

### Educational Risks
- **Content accuracy**: Expert review required
- **User adoption**: Training and onboarding needed
- **Assessment validity**: Pilot with small cohort first

---

## 12. Dependencies

### Backend
```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/typeorm": "^10.0.0",
  "@anthropic-ai/sdk": "^0.29.0",
  "typeorm": "^0.3.17",
  "pg": "^8.11.3",
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.0.2",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.1"
}
```

### Frontend
```json
{
  "@anthropic-ai/sdk": "^0.29.0",
  "axios": "^1.6.0",
  "@tanstack/react-query": "^5.0.0",
  "recharts": "^2.10.0",
  "react-markdown": "^9.0.0"
}
```

---

## 13. Testing Strategy

### Unit Tests
- All service methods
- DTO validation
- Guard logic
- Utility functions

### Integration Tests
- API endpoints end-to-end
- Database operations
- Authentication flows
- External API integrations

### E2E Tests
- Complete user workflows
- Practice session flow
- Chat conversation flow
- Analytics generation

---

## 14. Documentation

### For Developers
- API documentation (Swagger/OpenAPI)
- Database schema documentation
- Architecture diagrams
- Deployment guides

### For Users
- Student user guide
- Teacher user guide
- Video tutorials
- FAQ

---

## 15. Monitoring & Observability

### Metrics to Track
- API response times
- Error rates
- Claude API usage and costs
- Database query performance
- Active users
- Questions answered per day
- Average session duration

### Logging
- Application logs (Winston)
- Error tracking (Sentry optional)
- Audit logs for compliance
- User activity logs

---

## 16. Security Considerations

### Authentication & Authorization
- JWT with short expiration (15 minutes)
- Refresh tokens with rotation
- Role-based access control
- Password hashing with bcrypt (10 rounds)

### Data Protection
- Input validation on all endpoints
- SQL injection prevention (TypeORM)
- XSS protection
- Rate limiting
- CORS configuration

### Compliance
- HIPAA-ready (no PHI in dev/staging)
- FERPA compliance (student data protection)
- Audit trails for all data access

---

## Status: Ready to Begin Implementation

All planning complete. Files read. Architecture designed. Ready to build the integration.

**Next Step**: Begin Phase 1 - Backend Service Setup
