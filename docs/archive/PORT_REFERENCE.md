# EUREKA Platform - Port Reference

## ✅ Updated Port Mapping

### Infrastructure Services
| Service | Internal Port | External Port | Status |
|---------|--------------|---------------|--------|
| PostgreSQL | 5432 | 5434 | ✅ |
| Redis | 6379 | 6380 | ✅ |
| MinIO | 9000 | 9000 | ✅ |
| MinIO Console | 9001 | 9001 | ✅ |
| OpenSearch | 9200 | 9200 | ✅ |
| Kafka | 9092 | 9092, 29092 | ✅ |

### Core Services
| Service | Internal Port | External Port | Status |
|---------|--------------|---------------|--------|
| API Core | 8000 | 8000 | ✅ |
| Tutor LLM | 8000 | 8001 | ✅ |
| Assessment | 8000 | 8002 | ✅ |
| Adaptive Learning | 8000 | 8003 | ✅ |
| Content Service | 8000 | 8004 | ✅ |
| Analytics | 8000 | 8005 | ✅ |

### Tier Services (High School, Undergrad, Grad)
| Service | Internal Port | External Port | Status |
|---------|--------------|---------------|--------|
| Tier HS | 8000 | 8010 | ✅ |
| Tier UG | 8000 | 8011 | ✅ |
| Tier Grad | 8000 | 8012 | ✅ |

### Professional Services (Med, Law, MBA, Eng)
| Service | Internal Port | External Port | Status |
|---------|--------------|---------------|--------|
| Pro Med (existing) | 8000 | 8020 | ✅ Already Used |
| Pro Law | 8000 | 8021 | ✅ |
| Pro MBA | 8000 | 8022 | ✅ |
| Pro Eng | 8000 | 8023 | ✅ |
| **Medical School (NEW)** | **8000** | **8030** | **✅ UPDATED** |

### Frontend Applications
| Service | Internal Port | External Port | Status |
|---------|--------------|---------------|--------|
| Web App | 3000 | 3000 | ✅ |
| Admin Portal | 3000 | 3001 | ✅ |

---

## 🔧 Port Conflict Resolution

### Issue Found
- Port **8020** was already in use by **Pro Med** service
- Medical School service was initially configured to use **8020** (conflict!)

### Solution Applied
- Changed Medical School service to port **8030**
- Updated Redis database to **15** (was 10, might have conflicted)
- All documentation updated

---

## 🚀 Quick Access URLs

### Medical School Service (NEW)
- **Health Check**: http://localhost:8030/health
- **API Documentation**: http://localhost:8030/docs
- **ReDoc**: http://localhost:8030/redoc
- **Root**: http://localhost:8030/

### Frontend Dashboard
- **Resources**: http://localhost:3000/dashboard/resources
- **Community**: http://localhost:3000/dashboard/community
- **Settings**: http://localhost:3000/dashboard/settings

### Test Medical School API
```bash
# Health check
curl http://localhost:8030/health

# Expected response:
# {
#   "status": "healthy",
#   "service": "medical-school",
#   "version": "1.0.0",
#   "hipaa_mode": true,
#   ...
# }
```

---

## 📋 Start Commands

### Start Medical School Service Only
```bash
cd eureka
docker-compose up -d medical-school
```

### Check Service Status
```bash
# Check if service is running
docker ps | grep medical-school

# View logs
docker logs -f eureka-medical-school

# Test health endpoint
curl http://localhost:8030/health
```

### Start All Services
```bash
cd eureka
docker-compose up -d
```

---

## ⚠️ Port Availability Check

Before starting, verify port 8030 is available:

```bash
# Check if port 8030 is in use
lsof -i :8030

# If nothing returns, port is free ✅
# If something returns, port is in use ❌
```

If 8030 is also in use, alternative ports available:
- 8040, 8050, 8060, 8070, 8080, 8090, 8100+

To change port, edit:
- `eureka/docker-compose.yml` line 416: `- "XXXX:8000"`

---

## ✅ Changes Made

1. ✅ Updated `docker-compose.yml` - Port changed from 8020 to 8030
2. ✅ Updated `INTEGRATION_COMPLETE.md` - All references to 8020 changed to 8030
3. ✅ Changed Redis DB from 10 to 15 to avoid conflicts
4. ✅ Created this PORT_REFERENCE.md for easy reference

**Status**: Ready to use! No port conflicts.
