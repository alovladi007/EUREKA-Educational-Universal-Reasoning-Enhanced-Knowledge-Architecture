# EUREKA Platform - MVP Deployment Guide

## Overview

This guide covers the complete deployment of the EUREKA Educational Platform to production using Kubernetes and Helm.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Frontend Integration](#frontend-integration)
3. [Testing](#testing)
4. [Authentication & Security](#authentication--security)
5. [Kubernetes Deployment](#kubernetes-deployment)
6. [Monitoring & Logging](#monitoring--logging)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

- **Docker** (v24+)
- **Kubernetes** (v1.28+)
- **Helm** (v3.12+)
- **kubectl** (matching your Kubernetes version)
- **Python** (3.11+)
- **Node.js** (20+)

### Cloud Resources

- **Kubernetes Cluster** (EKS, GKE, AKS, or self-hosted)
- **Container Registry** (Docker Hub, GitHub Container Registry, ECR, GCR, ACR)
- **Domain Name** with DNS management
- **TLS Certificates** (via Let's Encrypt/cert-manager)

---

## Frontend Integration

### API Client Configuration

The frontend has been configured to connect to the correct backend services:

```typescript
// eureka/apps/web/src/lib/api.ts
API_BASE_URL: http://localhost:8009  // api-core
TUTOR_URL: http://localhost:8001     // AI tutor
ASSESSMENT_URL: http://localhost:8002 // Assessment engine
```

### Features Implemented

✅ **API Clients** - Axios instances for all microservices
✅ **Authentication** - JWT token management with refresh
✅ **Error Handling** - Comprehensive error boundaries
✅ **Loading States** - Loading components and spinners
✅ **Type Safety** - TypeScript throughout

### Testing the Frontend

```bash
cd eureka/apps/web
npm install
npm run dev
```

Navigate to `http://localhost:3006` to view the application.

---

## Testing

### Test Infrastructure

The project includes comprehensive testing:

- **pytest** configuration (`pytest.ini`)
- **Fixtures** for database, users, authentication
- **Unit tests** for security functions
- **Integration tests** for authentication flows
- **RBAC tests** for role-based access

### Running Tests

```bash
# Backend tests
cd eureka/services/api-core

# Unit tests
pytest tests/unit -v

# Integration tests
pytest tests/integration -v

# All tests with coverage
pytest --cov=app --cov-report=html

# Open coverage report
open htmlcov/index.html
```

### Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical user flows
- **E2E Tests**: Authentication, enrollment, assessment submission

---

## Authentication & Security

### Features Implemented

#### JWT Authentication
- ✅ Access tokens (30 min expiry)
- ✅ Refresh tokens (7 day expiry)
- ✅ Automatic token refresh on 401

#### RBAC (Role-Based Access Control)
```python
# Available role dependencies
require_admin       # Super admin & org admin
require_teacher     # Admin & teachers
require_super_admin # Super admin only
```

Usage:
```python
@router.get("/admin/users")
async def list_users(
    current_user: User = Depends(require_admin)
):
    ...
```

#### Rate Limiting

Rate limits enforced via Redis:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/auth/login` | 5 req | 60s |
| `/auth/register` | 3 req | 60s |
| `/auth/forgot-password` | 3 req | 300s |
| `/tutor/chat` | 20 req | 60s |

Authenticated users get 2x higher limits.

### Security Features

- ✅ Password hashing (bcrypt)
- ✅ Email verification
- ✅ Password reset flow
- ✅ Account lockout (5 failed attempts)
- ✅ COPPA compliance
- ✅ Multi-tenancy isolation
- ✅ Audit logging

---

## Kubernetes Deployment

### Architecture

```
┌─────────────┐     ┌──────────────┐
│   Ingress   │────▶│  Web App     │
│   (NGINX)   │     │  (Next.js)   │
└─────────────┘     └──────────────┘
       │
       │            ┌──────────────┐
       └───────────▶│  API Core    │
                    │  (FastAPI)   │
                    └──────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
            ┌───────▼──┐   ┌─────▼─────┐
            │PostgreSQL│   │   Redis    │
            │(pgvector)│   │  (Cache)   │
            └──────────┘   └───────────┘
```

### Quick Start Deployment

#### 1. Setup Cluster

```bash
# Create namespace
kubectl create namespace eureka

# Add Helm repositories
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

#### 2. Configure Secrets

```bash
# Generate strong secrets
JWT_SECRET=$(openssl rand -hex 32)
DB_PASSWORD=$(openssl rand -hex 16)
REDIS_PASSWORD=$(openssl rand -hex 16)

# Create secrets
kubectl create secret generic eureka-secrets \
  --from-literal=JWT_SECRET=$JWT_SECRET \
  --from-literal=POSTGRES_PASSWORD=$DB_PASSWORD \
  --from-literal=REDIS_PASSWORD=$REDIS_PASSWORD \
  --from-literal=DATABASE_URL="postgresql://eureka:$DB_PASSWORD@postgres-service:5432/eureka" \
  -n eureka
```

#### 3. Deploy with Helm

```bash
cd eureka/helm/eureka-platform

# Development
helm install eureka . \
  --namespace eureka \
  --values values-development.yaml

# Production
helm install eureka . \
  --namespace eureka \
  --values values-production.yaml \
  --set apiCore.image.tag=v1.0.0
```

#### 4. Verify Deployment

```bash
# Check pods
kubectl get pods -n eureka

# Check services
kubectl get svc -n eureka

# Check ingress
kubectl get ingress -n eureka

# View logs
kubectl logs -f deployment/api-core -n eureka
```

### Scaling

#### Manual Scaling
```bash
kubectl scale deployment api-core --replicas=5 -n eureka
```

#### Auto-scaling (HPA)
The Horizontal Pod Autoscaler is configured to scale based on CPU/Memory:

```yaml
minReplicas: 3
maxReplicas: 10
targetCPUUtilization: 70%
targetMemoryUtilization: 80%
```

### Database Migrations

Migrations run automatically via init containers. Manual migration:

```bash
kubectl exec -it deployment/api-core -n eureka -- alembic upgrade head
```

---

## Monitoring & Logging

### Prometheus Metrics

Deploy Prometheus:

```bash
kubectl apply -f eureka/monitoring/prometheus/prometheus-config.yaml
```

Access Prometheus UI:
```bash
kubectl port-forward svc/prometheus 9090:9090 -n eureka
# Open http://localhost:9090
```

### Available Metrics

- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - Request latency
- `auth_attempts_total` - Authentication attempts
- `db_connections_active` - Active DB connections
- `rate_limit_exceeded_total` - Rate limit events
- `ai_tutor_requests_total` - AI tutor usage
- `assessments_completed_total` - Assessments completed

### Grafana Dashboards

Import dashboard:
```bash
kubectl create configmap grafana-dashboard \
  --from-file=eureka/monitoring/grafana/dashboard-api-overview.json \
  -n eureka
```

### Alerts

Configured alerts:
- High error rate (>5%)
- High API latency (>1s p95)
- Database connection pool low
- Pod restarting frequently
- High CPU/memory usage
- Service down

---

## CI/CD Pipeline

### GitHub Actions Workflows

#### 1. CI/CD Pipeline (`ci-test.yml`)

Runs on every push and PR:
- ✅ Backend linting (ruff, mypy)
- ✅ Backend tests (unit + integration)
- ✅ Frontend linting
- ✅ Frontend build
- ✅ Security scanning (Trivy, Snyk)
- ✅ Docker image builds

#### 2. Deployment Pipeline (`cd-deploy.yml`)

Deploys to environments:

| Branch | Environment | Auto-deploy |
|--------|-------------|-------------|
| `develop` | Development | ✅ Yes |
| `main` | Staging | ✅ Yes |
| `v*` tags | Production | ✅ Yes |

### Manual Deployment

```bash
# Trigger deployment
gh workflow run cd-deploy.yml \
  --ref main \
  -f environment=production
```

### Rollback

```bash
# Automatic rollback via Helm
helm rollback eureka -n eureka

# Or manually via GitHub Actions
gh workflow run cd-deploy.yml -f rollback=true
```

---

## Configuration

### Environment Variables

Set these in Kubernetes secrets or ConfigMap:

#### Required
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret (32+ chars)

#### Optional
- `OPENAI_API_KEY` - OpenAI API key for AI tutor
- `ANTHROPIC_API_KEY` - Anthropic API key
- `SMTP_HOST` - Email server host
- `SMTP_USERNAME` - Email username
- `SMTP_PASSWORD` - Email password

### Feature Flags

```yaml
ENABLE_RATE_LIMITING: "true"
ENABLE_AUDIT_LOGGING: "true"
ENABLE_EMAIL_VERIFICATION: "true"
FERPA_ENABLED: "true"
COPPA_ENABLED: "true"
```

---

## Troubleshooting

### Common Issues

#### Pods Not Starting

```bash
# Check pod status
kubectl describe pod <pod-name> -n eureka

# View logs
kubectl logs <pod-name> -n eureka

# Check events
kubectl get events -n eureka --sort-by='.lastTimestamp'
```

#### Database Connection Issues

```bash
# Test database connectivity
kubectl run -it --rm debug --image=postgres:16 --restart=Never -- \
  psql -h postgres-service.eureka.svc.cluster.local -U eureka -d eureka
```

#### Redis Connection Issues

```bash
# Test Redis connectivity
kubectl run -it --rm debug --image=redis:7 --restart=Never -- \
  redis-cli -h redis-service.eureka.svc.cluster.local ping
```

#### Ingress Not Working

```bash
# Check ingress controller
kubectl get pods -n ingress-nginx

# Check certificate
kubectl get certificate -n eureka

# Check ingress events
kubectl describe ingress eureka-ingress -n eureka
```

### Health Checks

All services expose `/health` endpoint:

```bash
curl https://api.eureka.example.com/health
```

Response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "database": "connected",
  "redis": "connected"
}
```

---

## Performance Tuning

### Database

```sql
-- Check slow queries
SELECT * FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

-- Analyze query plans
EXPLAIN ANALYZE SELECT ...;
```

### Redis Cache

Configure cache TTL:
```python
CACHE_TTL = {
    "user_session": 1800,      # 30 minutes
    "course_data": 3600,       # 1 hour
    "assessments": 300,        # 5 minutes
}
```

### API Rate Limits

Adjust based on load:
```python
# In rate_limit.py
endpoint_limits = {
    "/api/v1/auth/login": (10, 60),  # Increase to 10/min
    "/api/v1/tutor/chat": (50, 60),  # Increase to 50/min
}
```

---

## Security Checklist

Before production deployment:

- [ ] Change all default passwords
- [ ] Generate strong JWT secret (32+ chars)
- [ ] Enable TLS/SSL certificates
- [ ] Configure firewall rules
- [ ] Enable RBAC
- [ ] Enable audit logging
- [ ] Set up secrets management (Vault/AWS Secrets Manager)
- [ ] Configure backup strategy
- [ ] Set up monitoring and alerts
- [ ] Review and update CORS origins
- [ ] Enable rate limiting
- [ ] Configure network policies
- [ ] Review pod security policies
- [ ] Set up DDoS protection
- [ ] Configure WAF (Web Application Firewall)

---

## Support

For issues and questions:

- **Documentation**: `/docs` in the repository
- **Issues**: GitHub Issues
- **Email**: devops@eureka.example.com

---

## License

Copyright © 2024 EUREKA Educational Platform
