# EduFlow Platform - System Architecture

## 🏗️ Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                               │
│                    Next.js App (Port 3006)                          │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │Dashboard │  │ Courses  │  │ AI Tutor │  │Analytics │          │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘          │
└────────────────────────────┬─────────────────────────────────────────┘
                             │ HTTP/REST API
                             │
┌────────────────────────────▼─────────────────────────────────────────┐
│                      BACKEND SERVICES LAYER                           │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │  API Core   │  │  Assessment │  │   Tutor     │                │
│  │ Port 8000   │  │  Port 8002  │  │  Port 8001  │                │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                │
│         │                 │                 │                        │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐                │
│  │  Adaptive   │  │  Analytics  │  │   Content   │                │
│  │ Port 8003   │  │  Port 8005  │  │  Port 8004  │                │
│  └─────────────┘  └─────────────┘  └─────────────┘                │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │   Pro Med   │  │   Pro Law   │  │   Pro MBA   │  │  Pro Eng  │ │
│  │ Port 8020   │  │  Port 8021  │  │  Port 8022  │  │ Port 8023 │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────┬─────┘ │
└─────────┼─────────────────┼─────────────────┼──────────────┼─────────┘
          │                 │                 │              │
          │                 │                 │              │
┌─────────▼─────────────────▼─────────────────▼──────────────▼─────────┐
│                      DATABASE LAYER                                   │
│                    PostgreSQL 14 Clusters                            │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │   API Core  │  │ Assessment  │  │  Adaptive   │                │
│  │  Port 5432  │  │  Port 5433  │  │  Port 5434  │                │
│  │   20+ tbl   │  │   25+ tbl   │  │   30+ tbl   │                │
│  └─────────────┘  └─────────────┘  └─────────────┘                │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │  Analytics  │  │    Tutor    │  │   Content   │                │
│  │  Port 5435  │  │  Port 5436  │  │  Port 5437  │                │
│  │   25+ tbl   │  │   20+ tbl   │  │   25+ tbl   │                │
│  └─────────────┘  └─────────────┘  └─────────────┘                │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │   Pro Med   │  │   Pro Law   │  │   Pro MBA   │  │  Pro Eng  │ │
│  │  Port 5438  │  │  Port 5439  │  │  Port 5440  │  │ Port 5441 │ │
│  │   30+ tbl   │  │   20+ tbl   │  │   25+ tbl   │  │  25+ tbl  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                                │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │   OpenAI    │  │  Anthropic  │  │     S3      │                │
│  │  GPT-4 API  │  │ Claude API  │  │File Storage │                │
│  └─────────────┘  └─────────────┘  └─────────────┘                │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Examples

### Example 1: User Login Flow

```
User (Browser)
    │
    ├─→ POST /api/v1/auth/login
    │   { email, password }
    │
    ▼
API Core Service (Port 8000)
    │
    ├─→ Query users table
    │   SELECT * FROM users WHERE email = ?
    │
    ▼
API Core Database (Port 5432)
    │
    ├─→ Return user record
    │
    ▼
API Core Service
    │
    ├─→ Verify password with bcrypt
    ├─→ Generate JWT token
    │
    ▼
User (Browser)
    │
    └─→ Store token in localStorage
        Use for authenticated requests
```

### Example 2: Taking an Assessment

```
Student (Browser)
    │
    ├─→ GET /api/v1/assessments/:id
    │
    ▼
Assessment Service (Port 8002)
    │
    ├─→ Query assessment & questions
    │
    ▼
Assessment Database (Port 5433)
    │
    ├─→ Return assessment data
    │
    ▼
Student takes test
    │
    ├─→ POST /api/v1/attempts/:id/submit
    │   { answers: [...] }
    │
    ▼
Assessment Service
    │
    ├─→ Auto-grade MCQ questions
    ├─→ Send essays to AI grader
    │
    ▼
OpenAI/Anthropic API
    │
    ├─→ Return AI grades & feedback
    │
    ▼
Assessment Service
    │
    ├─→ Calculate final score
    ├─→ Store in grading_results table
    │
    ▼
Assessment Database
    │
    └─→ Results saved
```

### Example 3: AI Tutor Session

```
Student (Browser)
    │
    ├─→ POST /api/v1/tutor/sessions
    │   { subject: "Math" }
    │
    ▼
Tutor Service (Port 8001)
    │
    ├─→ Create tutor_session record
    │
    ▼
Tutor Database (Port 5436)
    │
    ├─→ Session created
    │
    ▼
Student sends message
    │
    ├─→ POST /api/v1/tutor/sessions/:id/messages
    │   { message: "Explain calculus" }
    │
    ▼
Tutor Service
    │
    ├─→ Retrieve conversation context
    ├─→ Get user learning history
    │
    ▼
Tutor Database
    │
    ├─→ Return context & history
    │
    ▼
Tutor Service
    │
    ├─→ Send to OpenAI/Anthropic
    │   with context & teaching strategy
    │
    ▼
AI Provider
    │
    ├─→ Generate tutoring response
    │
    ▼
Tutor Service
    │
    ├─→ Store message & response
    ├─→ Update learning history
    ├─→ Track tokens used
    │
    ▼
Tutor Database
    │
    └─→ Data saved
    
    ▼
Student (Browser)
    │
    └─→ Display AI response
```

---

## 📊 Database Relationships

### Core Services Relationship Map

```
┌─────────────────────────────────────────────────────────┐
│                    API Core Database                     │
│                                                          │
│  users ───┬─→ enrollments ─→ courses                   │
│           │                                              │
│           ├─→ submissions ─→ assignments                │
│           │                                              │
│           └─→ discussion_threads ─→ discussion_forums   │
└───────────────────────┬─────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌────────────┐  ┌────────────┐  ┌────────────┐
│Assessment  │  │  Adaptive  │  │ Analytics  │
│  Database  │  │  Database  │  │  Database  │
│            │  │            │  │            │
│attempts ─┐ │  │paths ─┐    │  │events ─┐   │
│          │ │  │       │    │  │        │   │
│responses│ │  │mastery│    │  │metrics │   │
│         │ │  │       │    │  │        │   │
│grading──┘ │  │  XP───┘    │  │reports─┘   │
└────────────┘  └────────────┘  └────────────┘
```

### Professional Tier Examples

```
Medical School Database:
┌─────────────────────────────────────┐
│ clinical_cases                      │
│   ├─→ case_presentations           │
│   └─→ user_case_progress           │
│                                     │
│ usmle_questions                     │
│   └─→ user_usmle_performance       │
│                                     │
│ anatomy_models                      │
│   └─→ user_anatomy_sessions        │
└─────────────────────────────────────┘

Law School Database:
┌─────────────────────────────────────┐
│ legal_cases                         │
│   ├─→ case_briefs                  │
│   └─→ shepards_citations            │
│                                     │
│ moot_court_cases                    │
│   └─→ oral_argument_evaluations    │
│                                     │
│ bar_exam_questions                  │
│   └─→ user_bar_exam_performance    │
└─────────────────────────────────────┘
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────┐
│                   Client                         │
│  - Stores JWT token in localStorage             │
│  - Sends token in Authorization header          │
└──────────────────┬──────────────────────────────┘
                   │
                   │ Bearer <JWT_TOKEN>
                   │
┌──────────────────▼──────────────────────────────┐
│           API Gateway / Load Balancer           │
│  - SSL/TLS termination                          │
│  - Rate limiting                                │
│  - DDoS protection                              │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│              Backend Service                     │
│  - JWT verification middleware                  │
│  - Role-based access control (RBAC)            │
│  - Input validation & sanitization             │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│            Database Layer                        │
│  - Connection pooling                           │
│  - Prepared statements (SQL injection protection)│
│  - Row-level security (RLS)                    │
│  - Encrypted connections (SSL)                 │
│  - Password hashing (bcrypt)                   │
└─────────────────────────────────────────────────┘
```

---

## 📈 Scaling Strategy

### Vertical Scaling (Single Node)
```
Small:  4 GB RAM,  2 CPU  →  100 concurrent users
Medium: 8 GB RAM,  4 CPU  →  500 concurrent users
Large: 16 GB RAM,  8 CPU  → 2000 concurrent users
```

### Horizontal Scaling (Multiple Nodes)
```
                    Load Balancer
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   Backend 1        Backend 2        Backend 3
        │                │                │
        └────────────────┼────────────────┘
                         │
                Primary Database
                         │
        ┌────────────────┼────────────────┐
        │                │                │
  Read Replica 1   Read Replica 2   Read Replica 3
  (Analytics)       (API Queries)     (Reports)
```

---

## 🔄 Deployment Options

### Option 1: Docker Compose (Development)
```bash
# Single command
docker-compose up -d

# All services on one machine
# Good for: Development, testing
# Scale: Up to 100 users
```

### Option 2: Docker Swarm (Small Production)
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml eduflow

# Good for: Small to medium deployments
# Scale: Up to 1,000 users
```

### Option 3: Kubernetes (Large Production)
```bash
# Deploy to K8s cluster
kubectl apply -f k8s/

# Auto-scaling, high availability
# Good for: Large scale production
# Scale: 10,000+ users
```

---

## 📊 Resource Requirements

### Development Environment
```
Minimum:
- 8 GB RAM
- 4 CPU cores
- 50 GB disk space
- Docker Desktop

Recommended:
- 16 GB RAM
- 8 CPU cores
- 100 GB SSD
- Docker Desktop Pro
```

### Production Environment (per 1000 users)
```
Backend Services:
- 4 GB RAM per service
- 2 CPU cores per service
- 10 services × 4 GB = 40 GB RAM total

Databases:
- 8 GB RAM per database
- 4 CPU cores per database
- 10 databases × 8 GB = 80 GB RAM total
- 500 GB SSD storage (with growth)

Total: ~120 GB RAM, ~30 CPU cores, ~500 GB storage
```

---

## 🎯 Port Allocation Summary

| Service | Port | Protocol | Purpose |
|---------|------|----------|---------|
| Frontend | 3006 | HTTP | Next.js app |
| API Core | 8000 | HTTP | Core API |
| Tutor LLM | 8001 | HTTP | AI Tutor |
| Assessment | 8002 | HTTP | Testing |
| Adaptive | 8003 | HTTP | Learning paths |
| Content | 8004 | HTTP | Content management |
| Analytics | 8005 | HTTP | Analytics |
| Tier HS | 8010 | HTTP | High School |
| Tier UG | 8011 | HTTP | Undergraduate |
| Tier Grad | 8012 | HTTP | Graduate |
| Pro Med | 8020 | HTTP | Medical School |
| Pro Law | 8021 | HTTP | Law School |
| Pro MBA | 8022 | HTTP | MBA |
| Pro Eng | 8023 | HTTP | Engineering |
| DB API Core | 5432 | PostgreSQL | Users, courses |
| DB Assessment | 5433 | PostgreSQL | Tests, grading |
| DB Adaptive | 5434 | PostgreSQL | Learning paths |
| DB Analytics | 5435 | PostgreSQL | Events, metrics |
| DB Tutor | 5436 | PostgreSQL | AI sessions |
| DB Content | 5437 | PostgreSQL | Content library |
| DB Pro Med | 5438 | PostgreSQL | Medical data |
| DB Pro Law | 5439 | PostgreSQL | Legal data |
| DB Pro MBA | 5440 | PostgreSQL | Business data |
| DB Pro Eng | 5441 | PostgreSQL | Engineering data |
| PgAdmin | 5050 | HTTP | DB Management UI |

---

**This architecture supports:**
- ✅ Microservices scalability
- ✅ Database isolation
- ✅ Easy service replacement
- ✅ Independent scaling per service
- ✅ Clear separation of concerns
- ✅ Professional tier isolation

**Ready for production at scale! 🚀**
