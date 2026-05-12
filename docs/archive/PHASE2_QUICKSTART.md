# Phase-2 Services - Quick Start Guide

## 🚀 All Services Are Now Integrated!

All 8 Phase-2 services have been added to `docker-compose.yml` and are ready to run.

---

## 🌐 Service URLs (when running)

| Service | URL | Port | Status |
|---------|-----|------|--------|
| **Frontend** | http://localhost:3000 | 3000 | ✅ Running |
| **API Core** | http://localhost:8000 | 8000 | ✅ Running |
| **Medical School** | http://localhost:8030 | 8030 | ✅ Running |
| **Pedagogy AI** | http://localhost:8040 | 8040 | 🟢 Ready |
| **Marketplace** | http://localhost:8050 | 8050 | 🟢 Ready |
| **AI Research** | http://localhost:8060 | 8060 | 🟢 Ready |
| **XR Labs** | http://localhost:8070 | 8070 | 🟢 Ready |
| **Ethics/Security** | http://localhost:8080 | 8080 | 🟢 Ready |
| **Data Fabric** | http://localhost:8090 | 8090 | 🟢 Ready |
| **Institutions** | http://localhost:8100 | 8100 | 🟢 Ready |
| **Futures** | http://localhost:8110 | 8110 | 🟢 Ready |

---

## 📦 Start All Services

### Option 1: Start Everything
```bash
cd eureka
docker-compose up -d
```

This will start:
- All existing services (db, redis, api-core, tutor, etc.)
- All 8 Phase-2 services
- Supporting infrastructure (Neo4j, Qdrant)

### Option 2: Start Specific Phase-2 Services
```bash
cd eureka

# Start only Pedagogy AI
docker-compose up -d pedagogy

# Start Marketplace
docker-compose up -d marketplace

# Start AI Research with dependencies
docker-compose up -d ai-research

# Start Data Fabric (requires Neo4j and Qdrant)
docker-compose up -d neo4j qdrant data-fabric
```

### Option 3: Start All Phase-2 Services Only
```bash
cd eureka
docker-compose up -d pedagogy marketplace ai-research xr-labs ethics-security data-fabric institutions futures neo4j qdrant
```

---

## 🔍 Check Service Status

```bash
# View all running containers
docker-compose ps

# View logs for specific service
docker-compose logs -f pedagogy

# View logs for all Phase-2 services
docker-compose logs -f pedagogy marketplace ai-research xr-labs ethics-security data-fabric institutions futures

# Check health
curl http://localhost:8040/health  # Pedagogy AI
curl http://localhost:8050/health  # Marketplace
curl http://localhost:8060/health  # AI Research
```

---

## 🛑 Stop Services

```bash
# Stop all services
docker-compose down

# Stop specific service
docker-compose stop pedagogy

# Stop all Phase-2 services
docker-compose stop pedagogy marketplace ai-research xr-labs ethics-security data-fabric institutions futures
```

---

## 🔧 Troubleshooting

### Service won't start
```bash
# Check logs
docker-compose logs pedagogy

# Rebuild the service
docker-compose build pedagogy

# Start with logs visible
docker-compose up pedagogy
```

### Port conflicts
If you see port conflicts, check what's using the port:
```bash
lsof -i :8040  # Check port 8040
lsof -i :8050  # Check port 8050
```

### Reset everything
```bash
# Stop all containers and remove volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

---

## 📊 Infrastructure Services

Phase-2 also includes supporting infrastructure:

### Neo4j (Knowledge Graph)
- **URL:** http://localhost:7474
- **Bolt:** bolt://localhost:7687
- **User:** neo4j
- **Password:** eureka_neo4j_dev (default)

### Qdrant (Vector Database)
- **URL:** http://localhost:6333
- **API:** http://localhost:6333/dashboard

---

## 🏗️ Service Dependencies

```
pedagogy, marketplace, institutions
  ↓ depends on
  db, redis

data-fabric
  ↓ depends on
  neo4j, qdrant

ai-research
  ↓ no dependencies
  (standalone, uses LLM APIs)

xr-labs, ethics-security, futures
  ↓ no dependencies
  (standalone services)
```

---

## 🧪 Testing Services

### Test Pedagogy AI
```bash
# Get cognitive state
curl http://localhost:8040/api/v1/cog/state?learner_id=test_001&num_concepts=10

# Health check
curl http://localhost:8040/health
```

### Test Marketplace
```bash
# Browse content
curl http://localhost:8050/api/v1/content/browse

# Check compliance
curl "http://localhost:8050/api/v1/content/check-compliance?title=Test&description=Description"
```

### Test AI Research
```bash
# Search papers
curl "http://localhost:8060/api/v1/research/search-papers?query=machine%20learning&max_results=5"

# Research trends
curl http://localhost:8060/api/v1/research/research-trends?field=education
```

---

## 📝 Environment Variables

Create `.env` file in `eureka/` directory:

```bash
# LLM API Keys (for AI Research)
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here

# Stripe (for Marketplace)
STRIPE_API_KEY=your_stripe_key_here
STRIPE_WEBHOOK_SECRET=your_webhook_secret_here

# Neo4j
NEO4J_PASSWORD=eureka_neo4j_dev
```

---

## 🎯 Next Steps

1. **Start the services you need:**
   ```bash
   cd eureka
   docker-compose up -d pedagogy marketplace
   ```

2. **Check they're running:**
   ```bash
   docker-compose ps
   curl http://localhost:8040/health
   curl http://localhost:8050/health
   ```

3. **View the dashboard:**
   Open http://localhost:3000

4. **Explore the APIs:**
   - Pedagogy AI: http://localhost:8040/docs
   - Marketplace: http://localhost:8050/docs
   - AI Research: http://localhost:8060/docs

---

## 📖 Documentation

- **Phase-2 Status:** [PHASE2_STATUS.md](PHASE2_STATUS.md)
- **Module 1 (Pedagogy):** `services/pedagogy/README.md`
- **API Documentation:** Each service has `/docs` endpoint with Swagger UI

---

## 🔗 Useful Commands

```bash
# Rebuild all Phase-2 services
docker-compose build pedagogy marketplace ai-research xr-labs ethics-security data-fabric institutions futures

# View resource usage
docker stats

# Clean up old images
docker system prune -a

# Follow logs for multiple services
docker-compose logs -f pedagogy marketplace ai-research
```

---

**Last Updated:** November 2, 2025

🧠 Generated with [Claude Code](https://claude.com/claude-code)
