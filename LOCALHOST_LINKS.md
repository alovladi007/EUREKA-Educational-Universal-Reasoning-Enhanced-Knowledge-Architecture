# EUREKA Platform - Localhost Access Links

## Frontend Applications

### Main Web Application
- **Homepage**: [http://localhost:3006](http://localhost:3006)
- **Dashboard**: [http://localhost:3006/dashboard](http://localhost:3006/dashboard)
- **Demo Page**: [http://localhost:3006/demo](http://localhost:3006/demo)
- **Tiers Page**: [http://localhost:3006/tiers](http://localhost:3006/tiers)

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
- **Medical School**: [http://localhost:8020](http://localhost:8020)
  - Docs: [http://localhost:8020/docs](http://localhost:8020/docs)

- **Law School**: [http://localhost:8021](http://localhost:8021)
  - Docs: [http://localhost:8021/docs](http://localhost:8021/docs)

- **MBA Program**: [http://localhost:8022](http://localhost:8022)
  - Docs: [http://localhost:8022/docs](http://localhost:8022/docs)

- **Engineering**: [http://localhost:8023](http://localhost:8023)
  - Docs: [http://localhost:8023/docs](http://localhost:8023/docs)

## Infrastructure Services

### Database & Admin
- **PostgreSQL**: `localhost:5432`
  - Database: `eureka`
  - Username: `postgres`
  - Connect: `psql -h localhost -U postgres -d eureka`

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

- **Frontend** is currently running on port 3006 due to port 3000 being occupied
- **Backend services** require Dockerfiles to be fully implemented
- **Database** is using existing `biomedical-postgres` container on port 5432
- **Complete schema** with 45 tables has been initialized
- **Demo data** is pre-loaded for immediate testing

## Status

| Component | Status | Link |
|-----------|--------|------|
| Frontend | Running | [localhost:3006](http://localhost:3006) |
| Database | Running | localhost:5432 |
| MinIO | Running | [localhost:9001](http://localhost:9001) |
| Backend Services | Pending Implementation | - |
| Academic Tiers | Pending Implementation | - |
| Professional Tiers | Pending Implementation | - |

---

**Last Updated**: October 31, 2025
**Database Tables**: 45 tables created
**Demo Account**: admin@demo.edu / Admin123!
