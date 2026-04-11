# EUREKA Platform - Localhost Access Links

Ports below match `eureka/docker-compose.yml` and `PORT_REFERENCE.md`. If another project already uses a port on your machine, change **only** the host side in Compose (or use per-project Docker networks) rather than reusing another app’s port numbers.

## Frontend Applications

### Main Web Application
- **Homepage**: [http://localhost:3000](http://localhost:3000)
- **Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Demo Page**: [http://localhost:3000/demo](http://localhost:3000/demo)
- **Tiers Page**: [http://localhost:3000/tiers](http://localhost:3000/tiers)

## Backend API Services

### Core Services
- **API Core**: [http://localhost:8000](http://localhost:8000)
  - Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
  - Health: [http://localhost:8000/health](http://localhost:8000/health)

- **AI Tutor Service**: [http://localhost:8001](http://localhost:8001)
  - Docs: [http://localhost:8001/docs](http://localhost:8001/docs)

- **Assessment Engine**: [http://localhost:8002](http://localhost:8002)
  - Docs: [http://localhost:8002/docs](http://localhost:8002/docs)

- **Adaptive Learning**: [http://localhost:8003](http://localhost:8003)
  - Docs: [http://localhost:8003/docs](http://localhost:8003/docs)

- **Content Service**: [http://localhost:8004](http://localhost:8004)
  - Docs: [http://localhost:8004/docs](http://localhost:8004/docs)

- **Analytics Dashboard**: [http://localhost:8005](http://localhost:8005)
  - Docs: [http://localhost:8005/docs](http://localhost:8005/docs)

### Academic Tier Services
- **High School Tier**: [http://localhost:8010](http://localhost:8010)
  - Docs: [http://localhost:8010/docs](http://localhost:8010/docs)

- **Undergraduate Tier**: [http://localhost:8011](http://localhost:8011)
  - Docs: [http://localhost:8011/docs](http://localhost:8011/docs)

- **Graduate Tier**: [http://localhost:8012](http://localhost:8012)
  - Docs: [http://localhost:8012/docs](http://localhost:8012/docs)

### Professional Tier Services
- **Pro Med (FastAPI)**: [http://localhost:8020](http://localhost:8020)
  - Docs: [http://localhost:8020/docs](http://localhost:8020/docs)

- **Medical School (NestJS)**: [http://localhost:8030](http://localhost:8030)
  - Docs: [http://localhost:8030/docs](http://localhost:8030/docs)

- **Law School**: [http://localhost:8021](http://localhost:8021)
  - Docs: [http://localhost:8021/docs](http://localhost:8021/docs)

- **MBA Program**: [http://localhost:8022](http://localhost:8022)
  - Docs: [http://localhost:8022/docs](http://localhost:8022/docs)

- **Engineering**: [http://localhost:8023](http://localhost:8023)
  - Docs: [http://localhost:8023/docs](http://localhost:8023/docs)

## Infrastructure Services

### Database & Admin
- **PostgreSQL**: `localhost:5434` (maps to container `5432`)
  - Database: `eureka`
  - Username: `eureka`
  - Connect: `psql -h localhost -p 5434 -U eureka -d eureka`

### Storage & Cache
- **MinIO Console**: [http://localhost:9001](http://localhost:9001)
  - Username: `eureka`
  - Password: `eureka_minio_password`
  - API Endpoint: [http://localhost:9000](http://localhost:9000)

- **Redis**: `localhost:6379`
  - Connect: `redis-cli -h localhost`

### Search & Analytics
- **OpenSearch API**: [http://localhost:9200](http://localhost:9200)
- **OpenSearch Dashboards**: [http://localhost:5601](http://localhost:5601)

### Message Queue
- **Kafka**: `localhost:9092`

## Demo Credentials

### Admin Account
```
Email: admin@demo.edu
Password: Admin123!
Role: Organization Admin
Organization: Demo University
```

### Demo Course
```
Course Code: CS101 / DEMO101
Course Name: Introduction to Computer Science
```

## Quick Start Commands

### Start All Infrastructure
```bash
cd eureka
docker-compose up -d db redis minio opensearch
```

### Check Service Health
```bash
# Database
docker exec biomedical-postgres psql -U postgres -d eureka -c "SELECT COUNT(*) FROM users;"

# Frontend
curl http://localhost:3006

# API Core
curl http://localhost:8000/health
```

### View Logs
```bash
# Frontend
docker-compose logs -f web

# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api-core
```

## Database Access

### Direct SQL Access
```bash
# Via Docker
docker exec -it biomedical-postgres psql -U postgres -d eureka

# Local psql
psql -h localhost -U postgres -d eureka
```

### Common Queries
```sql
-- List all tables
\dt

-- Count users
SELECT COUNT(*) FROM users;

-- View demo admin
SELECT * FROM users WHERE email = 'admin@demo.edu';

-- View courses
SELECT code, title FROM courses;

-- View organizations
SELECT name, tier FROM organizations;
```

## API Testing

### Authentication
```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.edu","password":"Admin123!"}'
```

### Courses
```bash
# List courses
curl http://localhost:8000/api/v1/courses

# Get specific course
curl http://localhost:8000/api/v1/courses/{course_id}
```

## Troubleshooting

### Services Not Running
```bash
# Check what's running
docker-compose ps

# Restart services
docker-compose restart

# View logs
docker-compose logs -f [service_name]
```

### Port Conflicts
If you get port allocation errors:
```bash
# Check what's using a port
lsof -i :8000

# Stop conflicting service
docker stop [container_name]
```

### Database Issues
```bash
# Reinitialize database
docker exec -i biomedical-postgres psql -U postgres -d eureka < ops/db/init_complete.sql

# Check table count
docker exec biomedical-postgres psql -U postgres -d eureka -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"
```

## Notes

- **Frontend** in Compose is published on **3000** (`web` service); use **3001** for `admin`.
- **PostgreSQL** for this stack is on **5434** on the host (not 5432), to avoid clashing with other local Postgres instances.
- **Pro Med** and **Medical School (NestJS)** use different host ports (**8020** vs **8030**) so both can run together.

## Status

| Component | Typical port | Link |
|-----------|----------------|------|
| Web app | 3000 | [localhost:3000](http://localhost:3000) |
| Database | 5434 | `localhost:5434` |
| MinIO Console | 9001 | [localhost:9001](http://localhost:9001) |
| API Core | 8000 | [localhost:8000](http://localhost:8000) |

---

**Last Updated**: October 31, 2025
**Database Tables**: 45 tables created
**Demo Account**: admin@demo.edu / Admin123!
