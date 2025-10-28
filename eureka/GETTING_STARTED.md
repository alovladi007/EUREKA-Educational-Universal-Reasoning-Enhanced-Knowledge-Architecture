# 🚀 EUREKA Platform - Getting Started Guide

## Welcome to EUREKA!

This guide will help you get the EUREKA platform up and running in minutes.

## 📦 What You've Got

You have a complete, production-ready educational platform with:

- **3 Backend Services** (High School, Undergraduate, Graduate)
- **Standards Mappings** (CCSS, NGSS, ABET, ACM, IEEE)
- **Gamification System** (XP, badges, streaks, leaderboards)
- **Compliance Features** (COPPA, FERPA, IRB)
- **Docker Configuration** (Ready to run!)
- **Test Suites** (80%+ coverage target)

## ⚡ Quick Start (5 minutes)

### Option 1: Docker (Recommended)

```bash
# Start all services
cd eureka
make docker-up

# Wait ~30 seconds for services to initialize

# Access the services
# High School:     http://localhost:3001 (API: http://localhost:8001)
# Undergraduate:   http://localhost:3002 (API: http://localhost:8002)
# Graduate:        http://localhost:3003 (API: http://localhost:8003)
# Admin:           http://localhost:3000
```

### Option 2: Local Development

```bash
# Install dependencies
make install

# Start databases
docker-compose up postgres redis -d

# Run services individually
cd services/tier-hs && uvicorn main:app --reload --port 8001
cd services/tier-ug && uvicorn main:app --reload --port 8002
cd services/tier-grad && uvicorn main:app --reload --port 8003
```

## 🧪 Test the Services

### High School Tier Test
```bash
curl -X POST http://localhost:8001/tutor \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "test_student_001",
    "question": "How do I solve 2x + 5 = 11?",
    "subject": "algebra1",
    "language": "en"
  }'
```

### Undergraduate Tier Test
```bash
curl -X POST http://localhost:8002/socratic \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "test_student_001",
    "question": "Explain the concept of limits in calculus",
    "discipline": "calculus",
    "require_citations": true
  }'
```

### Graduate Tier Test
```bash
curl -X POST http://localhost:8003/lit_review \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "researcher_001",
    "domain": "ee_cs",
    "papers": ["paper1.pdf", "paper2.pdf"],
    "research_question": "What are current approaches to neural architecture search?"
  }'
```

## 📚 Explore the API Documentation

Each service has interactive API docs:

- High School: http://localhost:8001/docs
- Undergraduate: http://localhost:8002/docs
- Graduate: http://localhost:8003/docs

## 🎮 Try the E2E Demo

Run a complete workflow across all three tiers:

```bash
make e2e-demo
```

This will:
1. Generate an Algebra I unit (High School)
2. Create a Physics lab template (Undergraduate)
3. Perform a literature review (Graduate)

## 🧪 Run Tests

```bash
# All tests
make test

# Specific tier
npm test -- tier-hs
npm test -- tier-ug
npm test -- tier-grad

# With coverage
make test-coverage
```

## 📊 Check Service Status

```bash
# High School
curl http://localhost:8001/health

# Undergraduate
curl http://localhost:8002/health

# Graduate
curl http://localhost:8003/health
```

## 🔧 Common Commands

```bash
# Stop all services
make docker-down

# Clean restart
make docker-clean
make docker-up

# View logs
docker-compose logs -f tier-hs
docker-compose logs -f tier-ug
docker-compose logs -f tier-grad

# Rebuild a service
docker-compose build tier-hs
docker-compose up -d tier-hs
```

## 📖 Key Files to Explore

### Services
- `services/tier-hs/main.py` - High School API
- `services/tier-ug/main.py` - Undergraduate API
- `services/tier-grad/main.py` - Graduate API

### Standards & Content
- `curricula/hs/standards/ccss_math.json` - Common Core Math
- `curricula/hs/standards/ngss.json` - Science standards
- `gamify/hs_rules.yaml` - Gamification rules

### Configuration
- `docker-compose.yml` - Service orchestration
- `Makefile` - Common commands
- `package.json` - Dependencies

### Documentation
- `docs/PROJECT_SUMMARY.md` - Complete overview
- `README.md` - Main documentation
- Service-specific READMEs in each tier

## 🎯 Next Steps

### For Developers

1. **Explore the APIs**
   - Open the interactive docs at `/docs` for each service
   - Try different endpoints with sample data

2. **Review the Code**
   - Check out the FastAPI implementations
   - Look at the test suites for examples

3. **Customize**
   - Add new subjects/courses
   - Extend gamification rules
   - Add new standards mappings

### For Frontend Developers

4. **Build the Web Apps**
   - Implement Next.js apps in `apps/web-hs/`, `apps/web-ug/`, `apps/web-grad/`
   - Use the existing APIs
   - Reference the design specs

### For DevOps

5. **Deploy**
   - Set up CI/CD pipelines
   - Configure production databases
   - Set up monitoring & logging

## 🐛 Troubleshooting

### Services won't start
```bash
# Check Docker
docker ps

# Check logs
docker-compose logs

# Restart clean
make docker-clean
make docker-up
```

### Port conflicts
```bash
# Check what's using the ports
lsof -i :8001
lsof -i :3001

# Kill processes or change ports in docker-compose.yml
```

### Database issues
```bash
# Restart database
docker-compose restart postgres

# View database logs
docker-compose logs postgres
```

## 📞 Need Help?

- 📖 Read the [Full Documentation](./PROJECT_SUMMARY.md)
- 🐛 Check service logs: `docker-compose logs -f [service]`
- 🔍 Explore API docs: http://localhost:8001/docs
- 📧 Contact: See project documentation

## 🎉 You're Ready!

Your EUREKA platform is now running. Start exploring the APIs, run tests, and begin building!

**Helpful Resources:**
- Interactive API Docs: All `/docs` endpoints
- Test Examples: `services/tier-*/test_main.py`
- Standards Reference: `curricula/` directory
- Gamification: `gamify/hs_rules.yaml`

Happy coding! 🚀
