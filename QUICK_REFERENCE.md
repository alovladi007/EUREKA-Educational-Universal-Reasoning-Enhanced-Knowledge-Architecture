# EUREKA PLATFORM - QUICK REFERENCE CARD

**Status**: 70% Complete | **Services Ready**: 4/14 | **API Endpoints**: 90+

---

## 🚀 START PLATFORM (5 MINUTES)

```bash
# 1. Start infrastructure
docker-compose up -d postgres redis minio

# 2. Run migrations
cd eureka/services/api-core && alembic upgrade head

# 3. Load demo data
psql -h localhost -U eureka -d eureka < eureka/ops/db/seed_demo_data.sql

# 4. Start services (in separate terminals or use tmux)
cd eureka/services/api-core && python main.py      # Port 8000
cd eureka/services/adaptive && python main.py      # Port 8003
cd eureka/services/content && python main.py       # Port 8004
cd eureka/services/analytics && python main.py     # Port 8005
cd eureka/services/file-storage && python main.py  # Port 8006
```

---

## 📡 SERVICE ENDPOINTS

| Service | Port | URL | Docs | Status |
|---------|------|-----|------|--------|
| API Core | 8000 | http://localhost:8000 | /docs | 85% |
| Tutor (AI) | 8001 | http://localhost:8001 | /docs | 70% |
| Assess | 8002 | http://localhost:8002 | /docs | 90% |
| **Adaptive** | **8003** | http://localhost:8003 | /docs | **100%** ✅ |
| **Content** | **8004** | http://localhost:8004 | /docs | **100%** ✅ |
| **Analytics** | **8005** | http://localhost:8005 | /docs | **100%** ✅ |
| **File Storage** | **8006** | http://localhost:8006 | /docs | **100%** ✅ |

---

## 👥 DEMO ACCOUNTS (Password: Admin123!)

```
Super Admin:    admin@demo.edu
Org Admin:      admin@springfield.edu
Teacher:        teacher@demo.edu
Student:        student@demo.edu
```

---

## 🔑 API EXAMPLES

### File Upload
curl -X POST http://localhost:8006/api/v1/files/upload -F "file=@document.pdf" -F "user_id=UUID" -F "folder=assignments"

### Create Content
curl -X POST http://localhost:8004/api/v1/content -H "Content-Type: application/json" -d '{"course_id":"UUID","title":"Lesson 1","content_type":"lesson"}'

### Generate Learning Path
curl -X POST http://localhost:8003/api/v1/learning-paths/generate -H "Content-Type: application/json" -d '{"user_id":"UUID","course_id":"UUID"}'

---

## 🗄️ DATABASE

**Connection**: postgresql://eureka:eureka123@localhost:5432/eureka

**Tables**: users, organizations, courses, enrollments, assignments, submissions, grades, refresh_tokens, audit_logs, file_uploads, notifications

---

## 📚 DOCUMENTATION

- NEXT_STEPS.md - Complete guide
- SESSION_SUMMARY.md - Latest work
- AI_SETUP_GUIDE.md - AI configuration
- IMPLEMENTATION_ROADMAP.md - Detailed plan

---

**Version**: 0.7 | **Updated**: Nov 17, 2025
