# EUREKA Platform - Port Mapping

This document lists all ports used by the EUREKA platform to avoid conflicts with other running services.

## Infrastructure Services

| Service | Internal Port | External Port | Description |
|---------|--------------|---------------|-------------|
| PostgreSQL (pgvector) | 5432 | **5436** | Database with vector support |
| Redis | 6379 | **6380** | Cache and session store |
| MinIO | 9000 | **9010** | Object storage (S3-compatible) |
| MinIO Console | 9001 | **9011** | MinIO admin console |
| OpenSearch | 9200 | **9200** | Search engine |
| Kafka (Redpanda) | 9092 | **9092** | Message broker |
| Kafka Internal | 29092 | **29092** | Internal broker port |

## Core Services

All core services run internally on port 8000, mapped to different external ports:

| Service | External Port | Description |
|---------|--------------|-------------|
| api-core | **8100** | Core API (users, orgs, courses) |
| tutor-llm | **8101** | AI tutoring service with RAG |
| assess | **8102** | Assessment and autograding |
| adaptive | **8103** | Adaptive learning engine |
| content | **8104** | Content management |
| analytics | **8105** | Analytics and reporting |

## Academic Tier Services

| Service | External Port | Description |
|---------|--------------|-------------|
| tier-hs | **8110** | High School tier |
| tier-ug | **8111** | Undergraduate tier |
| tier-grad | **8112** | Graduate tier |

## Professional School Services

| Service | External Port | Description |
|---------|--------------|-------------|
| pro-med | **8120** | Medical school (HIPAA mode) |
| pro-law | **8121** | Law school (ABA compliance) |
| pro-mba | **8122** | MBA programs |
| pro-eng | **8123** | Engineering programs (FE/PE prep) |

## Frontend Applications

| Application | External Port | Description |
|------------|--------------|-------------|
| web | **4500** | Main web frontend (Next.js) |
| admin | **4501** | Admin dashboard |

## Quick Reference

### Access Points

**Infrastructure:**
- Database: `postgresql://eureka:eureka_dev_password@localhost:5436/eureka`
- Redis: `redis://localhost:6380`
- MinIO Console: http://localhost:9011
- MinIO API: http://localhost:9010
- OpenSearch: http://localhost:9200
- Kafka: `localhost:9092`

**Core APIs:**
- Core API: http://localhost:8100
- Tutor LLM: http://localhost:8101
- Assessment: http://localhost:8102
- Adaptive Learning: http://localhost:8103
- Content: http://localhost:8104
- Analytics: http://localhost:8105

**Academic Tiers:**
- High School: http://localhost:8110
- Undergraduate: http://localhost:8111
- Graduate: http://localhost:8112

**Professional Schools:**
- Medical: http://localhost:8120
- Law: http://localhost:8121
- MBA: http://localhost:8122
- Engineering: http://localhost:8123

**Frontend:**
- Main Web App: http://localhost:4500
- Admin Dashboard: http://localhost:4501

## Port Conflict Resolution

These ports were chosen to avoid conflicts with commonly used services:
- **5432** (PostgreSQL) → **5436** (conflicts with other databases)
- **6379** (Redis) → **6380** (conflicts with other Redis instances)
- **8000-8005** → **8100-8105** (conflicts with other APIs)
- **8010-8012** → **8110-8112** (better organization)
- **8020-8023** → **8120-8123** (better organization)
- **3000-3001** → **4500-4501** (conflicts with other Next.js apps)
- **9000-9001** (MinIO) → **9010-9011** (conflicts with other storage)

## Development Notes

- All services use containerized networking for inter-service communication
- External ports are only needed for accessing services from the host machine
- Services communicate with each other using internal Docker network (eureka-network)
- Database connections from services use `db:5432` (internal)
- Redis connections from services use `redis:6379` (internal)

## Starting Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d api-core

# Start infrastructure only
docker-compose up -d db redis minio opensearch kafka

# Start core services only
docker-compose up -d api-core tutor-llm assess adaptive content analytics

# Start academic tiers only
docker-compose up -d tier-hs tier-ug tier-grad

# Start professional schools only
docker-compose up -d pro-med pro-law pro-mba pro-eng

# Start frontend only
docker-compose up -d web admin
```

## Checking Port Usage

```bash
# Check if ports are in use
lsof -i :5436  # PostgreSQL
lsof -i :6380  # Redis
lsof -i :8100  # API Core
lsof -i :4500  # Web Frontend

# Check all EUREKA ports
lsof -i -P | grep -E ":(5436|6380|8100|8101|8102|8103|8104|8105|8110|8111|8112|8120|8121|8122|8123|4500|4501|9010|9011)"
```

## Health Checks

All services expose health check endpoints (where applicable):

```bash
# Core services
curl http://localhost:8100/health
curl http://localhost:8101/health
curl http://localhost:8102/health

# Academic tiers
curl http://localhost:8110/health
curl http://localhost:8111/health
curl http://localhost:8112/health

# Professional schools
curl http://localhost:8120/health
curl http://localhost:8121/health
curl http://localhost:8122/health
curl http://localhost:8123/health
```

---

**Last Updated:** 2025-10-28
**Platform Version:** Session 2 Integration
