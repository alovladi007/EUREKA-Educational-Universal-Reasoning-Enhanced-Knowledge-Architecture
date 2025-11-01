# ⚡ Medical School Service - Quick Start

Get up and running in 5 minutes!

## 🚀 Fastest Setup (Docker)

```bash
# 1. Navigate to directory
cd medical-school-service

# 2. Start everything
docker-compose up -d

# 3. Wait 30 seconds for services to start

# 4. Test it!
curl http://localhost:8020/health
```

**That's it!** 🎉

Visit: http://localhost:8020/docs

---

## 📖 What Just Happened?

Docker Compose started:
- ✅ PostgreSQL database (port 5432)
- ✅ Redis cache (port 6379)  
- ✅ Medical School API (port 8020)
- ✅ Created 13 database tables automatically
- ✅ Enabled HIPAA compliance

---

## 🧪 Quick Test

### 1. View API Documentation
```bash
open http://localhost:8020/docs
```

### 2. Check Health
```bash
curl http://localhost:8020/health
```

### 3. List Questions (empty at first)
```bash
curl http://localhost:8020/api/v1/usmle/questions
```

---

## 📊 What's Available?

### Features Ready to Use:
- ✅ **USMLE Question Bank** - 6 endpoints
- ✅ **Clinical Cases** - 7 endpoints
- ✅ **OSCE Stations** - 5 endpoints
- ✅ **Diagnostic Reasoning** - 4 endpoints
- ✅ **Student Dashboard** - 3 endpoints
- ✅ **Pharmacology Database** - 3 endpoints
- ✅ **HIPAA Compliance** - 2 endpoints

**Total: 36+ endpoints ready!**

---

## 🎯 Next Steps

### Option A: Add Content
```bash
# See examples in README.md
# Add USMLE questions
# Create clinical cases
# Set up OSCE stations
```

### Option B: Integrate with Frontend
```bash
# Point your frontend to:
API_URL=http://localhost:8020/api/v1
```

### Option C: Explore API
```bash
# Interactive docs:
http://localhost:8020/docs

# Alternative docs:
http://localhost:8020/redoc
```

---

## 🛑 Stop Services

```bash
docker-compose down
```

---

## 📚 Need More Info?

- **Full README**: See `README.md`
- **Deployment Guide**: See `DEPLOYMENT_GUIDE.md`
- **API Docs**: http://localhost:8020/docs

---

## 🐛 Something Wrong?

```bash
# Check logs
docker-compose logs -f medical-school

# Restart services
docker-compose restart

# Full reset
docker-compose down -v
docker-compose up -d
```

---

## ✅ Checklist

- [ ] Docker and Docker Compose installed
- [ ] Ports 8020, 5432, 6379 available
- [ ] Services started: `docker-compose up -d`
- [ ] Health check passed: `curl http://localhost:8020/health`
- [ ] API docs accessible: http://localhost:8020/docs

---

**You're ready! 🎉 Happy coding! 🏥**
