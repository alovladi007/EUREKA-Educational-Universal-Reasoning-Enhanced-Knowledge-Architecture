# EUREKA PLATFORM - QUICK START GUIDE

**Get your AI-powered educational platform running in under 30 minutes!**

---

## 📋 Prerequisites

- Docker Desktop installed and running
- Git installed
- Code editor (VS Code recommended)
- Terminal/command line access

---

## 🚀 Step 1: Clone & Setup (5 minutes)

```bash
# Navigate to project directory
cd /home/user/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture

# Go to eureka directory
cd eureka

# Start infrastructure services
docker-compose up -d db redis minio

# Wait 30 seconds for services to initialize
sleep 30
```

**Verify services running**:
```bash
docker-compose ps

# Should show:
# - eureka-db (healthy)
# - eureka-redis (healthy)
# - eureka-minio (healthy)
```

---

## 🗄️ Step 2: Initialize Database (5 minutes)

```bash
# Navigate to api-core service
cd services/api-core

# Run database migration
alembic upgrade head

# Verify tables created
docker exec eureka-db psql -U eureka -d eureka -c "\dt"

# Should show 18+ tables
```

**Add Demo Data** (optional but recommended):
```bash
# Go back to eureka root
cd ../..

# Run seed data script
docker exec -i eureka-db psql -U eureka -d eureka < ops/db/seed_demo_data.sql

# Verify data
docker exec eureka-db psql -U eureka -d eureka -c "SELECT email, role FROM users;"
```

Expected output:
```
       email        |    role
--------------------+------------
 admin@demo.edu     | org_admin
 teacher@demo.edu   | teacher
 student@demo.edu   | student
```

---

## 🤖 Step 3: Add AI API Keys (5 minutes)

```bash
# Copy environment template
cp ../.env.template .env

# Edit .env file
nano .env
```

**Add your API keys**:
```env
# Get keys from:
# Anthropic: https://console.anthropic.com/settings/keys
# OpenAI: https://platform.openai.com/api-keys

ANTHROPIC_API_KEY=sk-ant-YOUR-KEY-HERE
OPENAI_API_KEY=sk-YOUR-KEY-HERE
```

**Don't have API keys yet?**
- Anthropic: Free $5 credit for new users
- OpenAI: Free tier available
- See `AI_SETUP_GUIDE.md` for detailed instructions

---

## 🎯 Step 4: Start Core Services (5 minutes)

```bash
# Start API Core service
docker-compose up -d api-core

# Start AI Tutor service
docker-compose up -d tutor-llm

# Start Assessment service
docker-compose up -d assess

# Check all services are running
docker-compose ps
```

**Verify services healthy**:
```bash
# API Core health check
curl http://localhost:8000/health

# AI Tutor health check
curl http://localhost:8001/health

# Assessment health check
curl http://localhost:8002/health
```

---

## 🎨 Step 5: Start Frontend (5 minutes)

```bash
# Navigate to web app
cd apps/web

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Open in browser**: http://localhost:3000

---

## ✅ Step 6: Test Everything Works (5 minutes)

### Test 1: Login
```bash
# Open browser to http://localhost:3000/auth/login

# Login with demo account:
Email: admin@demo.edu
Password: Admin123!
```

### Test 2: API Core
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@demo.edu",
    "password": "Admin123!"
  }'

# Should return JWT token
```

### Test 3: AI Tutor (requires API keys)
```bash
curl -X POST http://localhost:8001/api/v1/tutor/ask \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is photosynthesis?",
    "user_id": "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14",
    "course_id": "e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15"
  }'

# Should return AI-generated explanation
```

### Test 4: Dashboard
1. Go to http://localhost:3000/dashboard
2. Should see demo courses and stats
3. Click on "Introduction to Computer Science"
4. Should see course details

---

## 🎉 SUCCESS! Your Platform is Running!

### What's Working:
✅ Database with all tables
✅ User authentication
✅ Demo users and courses
✅ API services running
✅ Frontend connected
✅ AI tutor ready (if you added API keys)

### What to Do Next:

**Option A: Explore the Platform**
- Login as different users (admin, teacher, student)
- Create a new course
- Add an assignment
- Test the AI tutor

**Option B: Continue Development**
- Follow `IMPLEMENTATION_ROADMAP.md` for next steps
- Complete remaining services
- Add more features

**Option C: Deploy to Production**
- See deployment section in `IMPLEMENTATION_ROADMAP.md`
- Set up Kubernetes
- Configure monitoring

---

## 🔧 Troubleshooting

### Database Connection Failed
```bash
# Check if PostgreSQL is running
docker-compose ps db

# Restart database
docker-compose restart db

# Check logs
docker-compose logs db
```

### Services Won't Start
```bash
# Check Docker is running
docker ps

# Rebuild services
docker-compose build
docker-compose up -d

# View logs
docker-compose logs -f api-core
```

### Frontend Build Errors
```bash
# Clear node modules and reinstall
cd apps/web
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### AI API Errors
```bash
# Verify API keys in .env
cat .env | grep API_KEY

# Check service logs
docker-compose logs tutor-llm

# Test with curl (see above)
```

---

## 📚 Useful Commands

### Docker
```bash
# View all services
docker-compose ps

# View logs for a service
docker-compose logs -f api-core

# Restart a service
docker-compose restart api-core

# Stop all services
docker-compose down

# Stop and remove volumes (CAUTION: Deletes data)
docker-compose down -v
```

### Database
```bash
# Access PostgreSQL console
docker exec -it eureka-db psql -U eureka -d eureka

# Run SQL query
docker exec eureka-db psql -U eureka -d eureka -c "SELECT * FROM users;"

# Backup database
docker exec eureka-db pg_dump -U eureka eureka > backup.sql

# Restore database
docker exec -i eureka-db psql -U eureka -d eureka < backup.sql
```

### Development
```bash
# Run tests
cd services/api-core
pytest

# Check Python types
mypy app/

# Format code
black app/
ruff format app/

# Run linter
ruff check app/
```

---

## 🌐 Service URLs

**Infrastructure:**
- PostgreSQL: localhost:5434
- Redis: localhost:6380
- MinIO Console: http://localhost:9001

**Backend APIs:**
- API Core: http://localhost:8000/docs
- AI Tutor: http://localhost:8001/docs
- Assessment: http://localhost:8002/docs
- Adaptive: http://localhost:8003/docs
- Analytics: http://localhost:8005/docs

**Frontend:**
- Main App: http://localhost:3000
- Admin Dashboard: http://localhost:3001

---

## 👥 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.edu | Admin123! |
| Teacher | teacher@demo.edu | Admin123! |
| Student | student@demo.edu | Admin123! |

**Demo Course**: Introduction to Computer Science (CS101)

---

## 📖 Documentation

- `README.md` - Platform overview
- `AI_SETUP_GUIDE.md` - AI integration guide
- `IMPLEMENTATION_ROADMAP.md` - Complete development guide
- `PLATFORM_COMPLETION_STATUS.md` - Current progress
- `TABLE_REFERENCE.md` - Database schema

---

## 🎓 Learn More

**Technologies Used:**
- **Backend**: FastAPI (Python 3.11)
- **Frontend**: Next.js 14, React 18, TypeScript
- **Database**: PostgreSQL 16 with pgvector
- **AI**: Anthropic Claude, OpenAI GPT
- **Cache**: Redis 7
- **Storage**: MinIO (S3-compatible)
- **Search**: OpenSearch 2

**Architecture**: Microservices with Docker, async Python, event-driven

---

## 💬 Get Help

- **Issues**: [GitHub Issues](https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/issues)
- **Discussions**: [GitHub Discussions](https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/discussions)
- **Documentation**: See files in repository root

---

**🎉 Congratulations! You're running a production-grade AI-powered educational platform!**

**Next Steps**: Follow `IMPLEMENTATION_ROADMAP.md` to complete the remaining 45% and deploy to production.

---

*Made with ❤️ using Claude Code*
