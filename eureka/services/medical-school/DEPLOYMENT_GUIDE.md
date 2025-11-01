# 🚀 Medical School Service - Deployment Guide

## 📋 Quick Reference

| Item | Value |
|------|-------|
| **Port** | 8020 |
| **Database** | PostgreSQL 15+ |
| **Cache** | Redis 7+ |
| **Python** | 3.11+ |
| **Tables** | 13 |
| **Endpoints** | 36+ |

---

## 🎯 Deployment Options

### Option 1: Docker (Recommended) 🐳

**Fastest way to get started!**

```bash
# 1. Navigate to service directory
cd medical-school-service

# 2. Start all services (PostgreSQL, Redis, Medical School API)
docker-compose up -d

# 3. Check health
curl http://localhost:8020/health

# 4. View logs
docker-compose logs -f medical-school

# 5. Stop services
docker-compose down
```

**What this does:**
- Starts PostgreSQL database
- Starts Redis cache
- Builds and starts Medical School service
- Creates networks and volumes
- Sets up health checks

---

### Option 2: Local Development 💻

**For development and testing**

```bash
# 1. Prerequisites
# - Python 3.11+
# - PostgreSQL 15+ running on localhost:5432
# - Redis 7+ running on localhost:6379

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Edit .env with your settings

# 5. Run database migrations (auto-creates tables)
python -c "from app.database import engine, Base; import asyncio; asyncio.run(engine.begin().run_sync(Base.metadata.create_all()))"

# 6. Start service
python main.py

# 7. Check health
curl http://localhost:8020/health
```

---

### Option 3: Production Deployment 🏭

**For production environments**

#### Using Systemd (Linux)

1. **Create service file:**

```bash
sudo nano /etc/systemd/system/medical-school.service
```

```ini
[Unit]
Description=EUREKA Medical School Service
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=eureka
WorkingDirectory=/opt/eureka/medical-school-service
Environment="PATH=/opt/eureka/medical-school-service/venv/bin"
ExecStart=/opt/eureka/medical-school-service/venv/bin/python main.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

2. **Enable and start:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable medical-school
sudo systemctl start medical-school
sudo systemctl status medical-school
```

#### Using Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name medical.eureka.com;

    location / {
        proxy_pass http://localhost:8020;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Using Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: medical-school
spec:
  replicas: 3
  selector:
    matchLabels:
      app: medical-school
  template:
    metadata:
      labels:
        app: medical-school
    spec:
      containers:
      - name: medical-school
        image: eureka/medical-school:latest
        ports:
        - containerPort: 8020
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        - name: HIPAA_MODE
          value: "true"
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8020
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8020
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: medical-school
spec:
  selector:
    app: medical-school
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8020
  type: LoadBalancer
```

---

## 🗄️ Database Setup

### Automatic Schema Creation

The service **automatically creates all 13 tables** on first run! No manual migrations needed.

Tables created:
1. usmle_questions
2. usmle_attempts
3. clinical_cases
4. case_attempts
5. osce_stations
6. osce_attempts
7. diagnostic_sessions
8. medication_database
9. medical_student_profiles
10. hipaa_audit_logs

### Manual Database Setup (if needed)

```sql
-- Create database
CREATE DATABASE eureka;

-- Create user
CREATE USER eureka WITH PASSWORD 'eureka123';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE eureka TO eureka;

-- Connect and verify
\c eureka
\dt
```

---

## 🔐 Environment Configuration

### Production Settings

```bash
# .env file for production
SERVICE_NAME=medical-school
PORT=8020
ENVIRONMENT=production

DATABASE_URL=postgresql+asyncpg://user:pass@db-server:5432/eureka
REDIS_URL=redis://redis-server:6379/10

# Enable all security features
HIPAA_MODE=true
PHI_LOGGING=false
AUTO_LOGOFF_MINUTES=15

# API Keys
OPENAI_API_KEY=sk-your-real-key
ANTHROPIC_API_KEY=sk-ant-your-real-key
```

---

## 📊 Monitoring & Health Checks

### Health Endpoint

```bash
curl http://localhost:8020/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "medical-school",
  "version": "1.0.0",
  "environment": "production",
  "hipaa_mode": true,
  "features": {
    "usmle_questions": true,
    "clinical_cases": true,
    "osce_simulation": true,
    "diagnostic_reasoning": true,
    "patient_cases": true,
    "phi_protection": true
  }
}
```

### Monitoring Tools

**Prometheus Metrics** (add to main.py):
```python
from prometheus_client import Counter, Histogram, generate_latest

request_count = Counter('http_requests_total', 'Total HTTP requests')
request_duration = Histogram('http_request_duration_seconds', 'HTTP request duration')
```

**Logging:**
```bash
# View logs
docker-compose logs -f medical-school

# Or if using systemd
journalctl -u medical-school -f
```

---

## 🧪 Testing the Deployment

### 1. Health Check
```bash
curl http://localhost:8020/health
```

### 2. API Documentation
```bash
open http://localhost:8020/docs
```

### 3. Create Test Question
```bash
curl -X POST http://localhost:8020/api/v1/usmle/questions \
  -H "Content-Type: application/json" \
  -d '{
    "org_id": "550e8400-e29b-41d4-a716-446655440000",
    "question_text": "Test question",
    "vignette": "Test vignette",
    "option_a": "A",
    "option_b": "B",
    "option_c": "C",
    "option_d": "D",
    "correct_answer": "A",
    "difficulty_level": "Step 1",
    "subject": "Test",
    "topic": "Test",
    "explanation": "Test explanation"
  }'
```

### 4. List Questions
```bash
curl http://localhost:8020/api/v1/usmle/questions
```

---

## 🔧 Troubleshooting

### Service Won't Start

**Check logs:**
```bash
docker-compose logs medical-school
# or
journalctl -u medical-school
```

**Common issues:**
- Database connection failed → Check DATABASE_URL
- Port already in use → Check if port 8020 is free
- Import errors → Reinstall dependencies

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -U eureka -d eureka

# Check if tables exist
\dt

# View table structure
\d usmle_questions
```

### Redis Connection Issues

```bash
# Test Redis connection
redis-cli ping

# Check Redis database
redis-cli
SELECT 10
KEYS *
```

---

## 🔄 Updates & Maintenance

### Updating the Service

```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild Docker image
docker-compose build

# 3. Restart service
docker-compose up -d

# 4. Check health
curl http://localhost:8020/health
```

### Database Backups

```bash
# Backup
docker exec eureka-postgres pg_dump -U eureka eureka > backup.sql

# Restore
docker exec -i eureka-postgres psql -U eureka eureka < backup.sql
```

### HIPAA Audit Log Cleanup

```bash
# Logs are automatically retained for 6 years
# Manual cleanup (admin only):
curl -X POST http://localhost:8020/api/v1/hipaa/cleanup-old-logs
```

---

## 📈 Performance Tuning

### Database Optimization

```sql
-- Create indexes (already in models.py)
CREATE INDEX idx_usmle_difficulty_subject ON usmle_questions(difficulty_level, subject);
CREATE INDEX idx_clinical_case_specialty ON clinical_cases(specialty, complexity);

-- Analyze tables
ANALYZE usmle_questions;
ANALYZE clinical_cases;
```

### Redis Caching

```python
# Add caching to frequently accessed queries
@cache(ttl=3600)
async def get_popular_questions():
    # Your query here
    pass
```

---

## 🔒 Security Checklist

Before production deployment:

- [ ] Change default database password
- [ ] Set strong API keys
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Enable HIPAA audit logging
- [ ] Set up regular backups
- [ ] Configure session timeout
- [ ] Enable PHI de-identification
- [ ] Set up monitoring alerts
- [ ] Review CORS settings

---

## 📞 Support

**Issues?**
1. Check logs: `docker-compose logs -f`
2. Review documentation: `/docs`
3. Check health endpoint: `/health`
4. Verify environment variables
5. Test database connectivity

**Need Help?**
- API Documentation: http://localhost:8020/docs
- README: See README.md
- EUREKA Project: Contact project team

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Python 3.11+ installed
- [ ] PostgreSQL 15+ running
- [ ] Redis 7+ running
- [ ] Environment variables configured
- [ ] Firewall rules set

### Deployment
- [ ] Service started successfully
- [ ] Health check passing
- [ ] Database tables created
- [ ] API endpoints responding
- [ ] Logs showing no errors

### Post-Deployment
- [ ] Monitor logs for 24 hours
- [ ] Test all major endpoints
- [ ] Verify HIPAA logging
- [ ] Check performance metrics
- [ ] Set up backups

---

## 🎉 Success!

Your Medical School service is now deployed!

**Quick Links:**
- API Docs: http://localhost:8020/docs
- Health: http://localhost:8020/health
- Redoc: http://localhost:8020/redoc

**Next Steps:**
1. Add USMLE questions via API
2. Create clinical cases
3. Set up OSCE stations
4. Integrate with frontend
5. Configure AI features

---

**Happy Learning! 🏥📚**
