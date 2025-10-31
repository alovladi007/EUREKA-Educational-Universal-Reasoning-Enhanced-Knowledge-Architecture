# 🚀 EUREKA Platform - Quick Reference Card

## ⚡ **FASTEST START (Copy & Paste)**

```bash
# 1. Start infrastructure (30 seconds)
docker-compose up -d db redis minio opensearch && sleep 30

# 2. Initialize database (10 seconds)
docker exec -i eureka-db psql -U eureka -d eureka < ops/db/init_complete.sql

# 3. Verify tables created
docker exec eureka-db psql -U eureka -d eureka -c "\dt" | wc -l
# Should show: 50+

# 4. Start backend services (1 minute)
docker-compose up -d api-core tutor-llm assess adaptive analytics

# 5. Test login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.edu","password":"Admin123!"}'

# ✅ YOU'RE READY! Open http://localhost:8000/docs
```

---

## 🔑 **Demo Credentials**

```
Email: admin@demo.edu
Password: Admin123!
Organization: Demo University
Role: Organization Admin
```

---

## 🌐 **Essential URLs**

```
# Core Services
API Core:       http://localhost:8000/docs
AI Tutor:       http://localhost:8001/docs
Assessment:     http://localhost:8002/docs
Adaptive:       http://localhost:8003/docs
Analytics:      http://localhost:8005/docs

# Infrastructure
Database:       localhost:5432 (user: eureka, pass: eureka_dev_password)
Redis:          localhost:6379
MinIO:          http://localhost:9000 (Console: 9001)
pgAdmin:        http://localhost:5050

# Frontend
Web App:        http://localhost:3000
Admin:          http://localhost:3001
```

---

## 🛠️ **Common Commands**

### **Docker**
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f api-core

# Restart service
docker-compose restart api-core

# Rebuild service
docker-compose build api-core
docker-compose up -d api-core

# Clean everything (⚠️ DELETES DATA)
docker-compose down -v
```

### **Database**
```bash
# Connect to database
docker exec -it eureka-db psql -U eureka -d eureka

# List tables
docker exec eureka-db psql -U eureka -d eureka -c "\dt"

# Count users
docker exec eureka-db psql -U eureka -d eureka -c "SELECT COUNT(*) FROM users;"

# Reset database (⚠️ DELETES ALL DATA)
docker exec eureka-db psql -U eureka -d eureka -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
docker exec -i eureka-db psql -U eureka -d eureka < ops/db/init_complete.sql
```

### **Redis**
```bash
# Connect to Redis
docker exec -it eureka-redis redis-cli

# Test connection
docker exec eureka-redis redis-cli ping

# Clear cache
docker exec eureka-redis redis-cli FLUSHALL
```

---

## 🧪 **API Testing**

### **Authentication**
```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.edu","password":"Admin123!"}'

# Copy access_token from response, then:
export TOKEN="your-access-token-here"

# Get profile
curl http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN"
```

### **AI Tutor**
```bash
# Ask question
curl -X POST http://localhost:8001/api/v1/tutor/ask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "course_id": "550e8400-e29b-41d4-a716-446655440002",
    "message": "What is photosynthesis?",
    "use_rag": true
  }'
```

### **Auto-Grading**
```bash
# Grade short answer
curl -X POST http://localhost:8002/api/v1/assess/grade \
  -H "Content-Type: application/json" \
  -d '{
    "question_type": "short_answer",
    "student_answer": "Mitochondria",
    "correct_answer": "The powerhouse of the cell",
    "question_text": "What organelle produces ATP?"
  }'
```

### **Courses**
```bash
# List courses
curl http://localhost:8000/api/v1/courses \
  -H "Authorization: Bearer $TOKEN"

# Create course
curl -X POST http://localhost:8000/api/v1/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "code": "CS101",
    "title": "Introduction to Computer Science",
    "description": "Learn programming fundamentals",
    "status": "published"
  }'

# Enroll in course
curl -X POST http://localhost:8000/api/v1/courses/{course_id}/enroll \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🐛 **Troubleshooting**

### **Service won't start**
```bash
# Check logs
docker-compose logs [service-name]

# Check if port is in use
lsof -i :[port]

# Restart service
docker-compose restart [service-name]
```

### **Database connection error**
```bash
# Check if DB is running
docker-compose ps db

# Test connection
docker exec eureka-db pg_isready -U eureka

# Restart database
docker-compose restart db
```

### **Redis connection error**
```bash
# Test Redis
docker exec eureka-redis redis-cli ping

# Should return: PONG
```

### **401 Unauthorized**
```bash
# Token expired (30 min default)
# Get new token:
curl -X POST http://localhost:8000/api/v1/auth/login \
  -d '{"email":"admin@demo.edu","password":"Admin123!"}'
```

### **AI Tutor not responding**
```bash
# Check API keys are set
docker exec eureka-tutor-llm env | grep API_KEY

# Should show:
# ANTHROPIC_API_KEY=sk-ant-...
# OPENAI_API_KEY=sk-...
```

---

## 📦 **Required Environment Variables**

**Minimum required in `.env`:**
```bash
# Database
DATABASE_URL=postgresql://eureka:eureka_dev_password@db:5432/eureka

# Redis
REDIS_URL=redis://redis:6379/0

# JWT (⚠️ MUST BE 32+ CHARS)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# AI APIs (⚠️ REQUIRED FOR AI FEATURES)
ANTHROPIC_API_KEY=sk-ant-your-key-here
OPENAI_API_KEY=sk-your-key-here

# S3/MinIO
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=eureka
S3_SECRET_KEY=eureka_minio_password
```

---

## 📊 **Service Status Check**

```bash
# Check all services
docker-compose ps

# Test all health endpoints
curl http://localhost:8000/health  # API Core
curl http://localhost:8001/health  # AI Tutor
curl http://localhost:8002/health  # Assessment
curl http://localhost:8003/health  # Adaptive
curl http://localhost:8005/health  # Analytics

# Should all return: {"status":"healthy"}
```

---

## 🎯 **Implementation Order**

1. ✅ **Database** (15 min) - Run `init_complete.sql`
2. ✅ **API Core** (30 min) - Add CRUD operations from guide
3. ✅ **File Uploads** (20 min) - Implement upload service
4. ✅ **AI Tutor** (45 min) - Add Claude API integration
5. ✅ **Auto-Grading** (30 min) - Implement grading strategies

**Total**: ~2-3 hours for all HIGH PRIORITY items

---

## 📝 **Key Files**

```
eureka/
├── ops/db/init_complete.sql           # ⭐ DATABASE SCHEMA
├── IMPLEMENTATION_GUIDE.md            # ⭐ STEP-BY-STEP GUIDE
├── docker-compose.yml                 # ⭐ SERVICE ORCHESTRATION
├── .env.example                       # ⭐ CONFIGURATION
└── README.md                          # ⭐ DOCUMENTATION
```

---

## 🆘 **Getting Help**

1. Check `README.md` - Comprehensive documentation
2. Read `IMPLEMENTATION_GUIDE.md` - Step-by-step instructions
3. View API docs - http://localhost:8000/docs
4. Check logs - `docker-compose logs -f [service]`
5. Review database schema - `ops/db/init_complete.sql`

---

## ✅ **Verification Checklist**

```bash
# All services running
docker-compose ps | grep "Up"

# Database initialized (50+ tables)
docker exec eureka-db psql -U eureka -d eureka -c "\dt" | wc -l

# Can login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -d '{"email":"admin@demo.edu","password":"Admin123!"}'

# API docs accessible
curl -I http://localhost:8000/docs | grep "200 OK"

# AI Tutor responds
curl -X POST http://localhost:8001/api/v1/tutor/ask \
  -d '{"message":"test"}'

# Auto-grading works
curl -X POST http://localhost:8002/api/v1/assess/grade \
  -d '{"question_type":"true_false","student_answer":true,"correct_answer":true}'
```

---

## 🚀 **Production Deployment Checklist**

- [ ] Change all default passwords
- [ ] Set strong JWT_SECRET (32+ chars)
- [ ] Add real Anthropic/OpenAI API keys
- [ ] Configure SMTP for emails
- [ ] Enable SSL/TLS
- [ ] Set `ENVIRONMENT=production`
- [ ] Configure proper CORS
- [ ] Enable rate limiting
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Load test
- [ ] Security audit

---

**🎉 You're ready to build! Start with README.md →**
