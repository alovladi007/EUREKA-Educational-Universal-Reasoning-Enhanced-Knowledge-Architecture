## EUREKA Platform - Production Setup Guide

This guide provides step-by-step instructions for deploying EUREKA to production.

---

## 📋 **Table of Contents**

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [Production Checklist](#production-checklist)
5. [Troubleshooting](#troubleshooting)
6. [Support](#support)

---

## ✅ **Prerequisites**

### Required Tools

Install the following tools on your local machine:

```bash
# Kubernetes CLI
brew install kubectl  # macOS
# or
sudo apt-get install kubectl  # Linux

# Helm
brew install helm  # macOS
# or
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Cloud Provider CLI (choose one)
brew install awscli      # AWS
brew install google-cloud-sdk  # GCP
brew install azure-cli   # Azure
```

### Cloud Resources

- **Kubernetes Cluster** (1.28+)
  - AWS EKS, GCP GKE, Azure AKS, or self-hosted
  - Minimum: 3 nodes, 4 vCPU, 16GB RAM each
  - Recommended: 5 nodes, 8 vCPU, 32GB RAM each

- **Domain Name** with DNS management access

- **SSL/TLS Certificates** (automated via Let's Encrypt)

- **Container Registry** (optional, for custom images)
  - Docker Hub, GitHub Container Registry, ECR, GCR, ACR

---

## 🚀 **Quick Start**

Deploy EUREKA in under 30 minutes:

```bash
# 1. Clone repository
git clone https://github.com/yourusername/EUREKA.git
cd EUREKA

# 2. Setup Kubernetes cluster
cd eureka/scripts/deployment
./setup-cluster.sh aws production  # or gcp, azure, local

# 3. Install cert-manager
./setup-cert-manager.sh eureka.example.com admin@eureka.example.com

# 4. Generate secrets
cd ../secrets
./generate-secrets.sh production

# 5. Review and update secrets
vi secrets-production/.env
# Update SMTP, API keys, etc.

# 6. Apply secrets to cluster
kubectl apply -f secrets-production/eureka-secrets.yaml -n eureka

# 7. Deploy EUREKA
cd ../deployment
./deploy-eureka.sh production

# 8. Setup monitoring
cd ../monitoring
./setup-monitoring.sh

# 9. Configure backups
cd ../backup
./setup-backups.sh

# 10. Run smoke tests
cd ../smoke-tests
./run-tests.sh https://api.eureka.example.com https://app.eureka.example.com
```

**Done!** Your EUREKA platform is now running in production.

---

## 📖 **Detailed Setup**

### Step 1: Kubernetes Cluster Setup

#### AWS EKS

```bash
cd eureka/scripts/deployment
./setup-cluster.sh aws production
```

This will:
- Create EKS cluster with 3-10 autoscaling nodes
- Install AWS Load Balancer Controller
- Configure IAM roles and policies
- Set up cluster autoscaler

**Time:** ~20 minutes

#### GCP GKE

```bash
export GCP_PROJECT_ID=your-project-id
./setup-cluster.sh gcp production
```

**Time:** ~15 minutes

#### Azure AKS

```bash
export AZURE_LOCATION=eastus
./setup-cluster.sh azure production
```

**Time:** ~15 minutes

#### Local Development (kind/minikube)

```bash
./setup-cluster.sh local development
```

**Time:** ~5 minutes

---

### Step 2: DNS and TLS Configuration

#### Install cert-manager

```bash
./setup-cert-manager.sh eureka.example.com admin@eureka.example.com
```

This installs:
- cert-manager v1.13.0
- Let's Encrypt ClusterIssuers (staging & production)
- Certificate resources for your domain

#### Configure DNS Records

1. Get LoadBalancer IP:
```bash
kubectl get svc -n ingress-nginx ingress-nginx-controller
```

2. Add DNS records at your DNS provider:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | <LB-IP> | 300 |
| A | api | <LB-IP> | 300 |
| A | app | <LB-IP> | 300 |
| A | www | <LB-IP> | 300 |

3. Verify DNS propagation:
```bash
nslookup api.eureka.example.com
```

4. Apply certificate:
```bash
kubectl apply -f eureka-certificate.yaml
kubectl get certificate -n eureka --watch
```

**Time:** DNS propagation: 5-60 minutes, Certificate issuance: 2-5 minutes

---

### Step 3: Secrets Management

#### Generate Secrets

```bash
cd ../secrets
./generate-secrets.sh production
```

This generates:
- JWT secret (128 chars)
- Database passwords
- Redis password
- MinIO credentials
- Encryption keys

#### Update Configuration

Edit `secrets-production/.env`:

```bash
# Update these values:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@eureka.example.com

# Add AI API keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Optional: Sentry DSN
SENTRY_DSN=https://...@sentry.io/...
```

#### Apply Secrets

```bash
kubectl apply -f secrets-production/eureka-secrets.yaml -n eureka

# Verify
kubectl get secrets -n eureka
kubectl describe secret eureka-secrets -n eureka
```

#### Production: Use External Secrets

For production, use external secrets management:

```bash
# AWS Secrets Manager
./setup-external-secrets.sh aws

# GCP Secret Manager
./setup-external-secrets.sh gcp

# Azure Key Vault
./setup-external-secrets.sh azure

# HashiCorp Vault
./setup-external-secrets.sh vault
```

**Time:** 10-15 minutes

---

### Step 4: Deploy Infrastructure & Application

```bash
cd ../deployment
./deploy-eureka.sh production
```

This deploys:
1. **NGINX Ingress Controller**
2. **PostgreSQL** (with pgvector extension)
3. **Redis** (cache and session store)
4. **MinIO** (S3-compatible object storage)
5. **EUREKA Application** (API, AI Tutor, Assessment Engine, Web App)

Deployment includes:
- Rolling updates
- Health checks
- Autoscaling (HPA)
- Database migrations
- Service mesh ready

**Time:** 15-20 minutes

Monitor deployment:
```bash
kubectl get pods -n eureka --watch
```

---

### Step 5: Monitoring and Alerting

```bash
cd ../monitoring
./setup-monitoring.sh
```

This installs:
- **Prometheus** (metrics collection)
- **Grafana** (visualization)
- **Alertmanager** (alerting)
- **Loki** (log aggregation)
- **Promtail** (log collection)

Access dashboards:
```bash
# Grafana
kubectl port-forward -n monitoring svc/kube-prometheus-stack-grafana 3000:80
# Open http://localhost:3000 (admin/admin)

# Prometheus
kubectl port-forward -n monitoring svc/prometheus-operated 9090:9090
# Open http://localhost:9090

# Alertmanager
kubectl port-forward -n monitoring svc/alertmanager-operated 9093:9093
# Open http://localhost:9093
```

Configure alerts (Slack, PagerDuty, email):
```bash
# Edit alertmanager config
kubectl edit secret alertmanager-kube-prometheus-stack-alertmanager -n monitoring
```

**Time:** 10 minutes

---

### Step 6: Backup Strategy

```bash
cd ../backup
./setup-backups.sh
```

Automated backups:
- **PostgreSQL**: Daily at 2:00 AM UTC
- **Redis**: Daily at 3:00 AM UTC
- **MinIO**: Daily at 4:00 AM UTC
- **Retention**: 30 days

Manual backup:
```bash
./manual-backup.sh
```

Restore instructions: See `RESTORE.md`

**Time:** 5 minutes

---

### Step 7: Smoke Tests

```bash
cd ../smoke-tests
./run-tests.sh https://api.eureka.example.com https://app.eureka.example.com
```

Tests:
- Infrastructure (pods, services)
- API endpoints
- Authentication flows
- Database connectivity
- TLS certificates
- Performance
- Monitoring integration

All tests should pass before going live.

**Time:** 2-3 minutes

---

## ✅ **Production Checklist**

Before launching to production:

### Security
- [ ] Change all default passwords
- [ ] Generate strong JWT secret (64+ chars)
- [ ] Enable TLS/SSL certificates
- [ ] Configure firewall rules
- [ ] Enable RBAC
- [ ] Enable audit logging
- [ ] Set up secrets management (Vault/AWS Secrets Manager)
- [ ] Review CORS origins
- [ ] Enable rate limiting
- [ ] Configure network policies
- [ ] Review pod security policies
- [ ] Set up DDoS protection
- [ ] Configure WAF (Web Application Firewall)

### Infrastructure
- [ ] Kubernetes cluster running (3+ nodes)
- [ ] Load balancer configured
- [ ] DNS records configured
- [ ] TLS certificates issued
- [ ] Persistent volumes created
- [ ] Autoscaling configured
- [ ] Resource limits set

### Application
- [ ] All pods running
- [ ] Database migrations completed
- [ ] Health checks passing
- [ ] Secrets applied
- [ ] Environment variables set
- [ ] SMTP configured
- [ ] AI API keys added

### Monitoring
- [ ] Prometheus collecting metrics
- [ ] Grafana dashboards configured
- [ ] Alertmanager configured
- [ ] Alerts routing to team
- [ ] Log aggregation working
- [ ] Error tracking enabled (Sentry)

### Backup & Recovery
- [ ] Backup jobs scheduled
- [ ] Backup storage configured
- [ ] Restore procedure tested
- [ ] Disaster recovery plan documented
- [ ] RPO/RTO defined

### Testing
- [ ] Smoke tests passing
- [ ] Load testing completed
- [ ] Security scan completed
- [ ] Penetration testing done
- [ ] User acceptance testing done

### Documentation
- [ ] Deployment guide reviewed
- [ ] Runbook created
- [ ] Incident response plan ready
- [ ] Team trained on operations
- [ ] Support contacts documented

---

## 🔧 **Troubleshooting**

### Pods Not Starting

```bash
# Check pod status
kubectl describe pod <pod-name> -n eureka

# View logs
kubectl logs <pod-name> -n eureka

# Check events
kubectl get events -n eureka --sort-by='.lastTimestamp'
```

### Database Connection Issues

```bash
# Test connectivity
kubectl run -it --rm debug --image=postgres:16 --restart=Never -- \
  psql -h postgres-service.eureka.svc.cluster.local -U eureka -d eureka
```

### TLS Certificate Not Issuing

```bash
# Check cert-manager logs
kubectl logs -n cert-manager deploy/cert-manager

# Check certificate status
kubectl describe certificate eureka-tls -n eureka
kubectl describe certificaterequest -n eureka
kubectl describe challenge -n eureka
```

### Application Errors

```bash
# View application logs
kubectl logs -f deployment/api-core -n eureka

# Check health endpoint
curl https://api.eureka.example.com/health
```

### Performance Issues

```bash
# Check resource usage
kubectl top pods -n eureka
kubectl top nodes

# View metrics in Grafana
kubectl port-forward -n monitoring svc/kube-prometheus-stack-grafana 3000:80
```

---

## 📞 **Support**

### Documentation
- Deployment Guide: `/DEPLOYMENT_GUIDE.md`
- Production Setup: `/PRODUCTION_SETUP_GUIDE.md` (this file)
- Backup/Restore: `eureka/scripts/backup/RESTORE.md`
- DNS Setup: `eureka/scripts/deployment/DNS_SETUP.md`

### Community
- GitHub Issues: https://github.com/yourusername/EUREKA/issues
- Email: devops@eureka.example.com
- Slack: #eureka-support

### Emergency Contacts
- On-call engineer: See runbook
- PagerDuty: See alerting configuration

---

## 📈 **Scaling Guide**

### Horizontal Scaling

```bash
# Scale API pods
kubectl scale deployment api-core --replicas=10 -n eureka

# Scale AI Tutor
kubectl scale deployment tutor-llm --replicas=5 -n eureka
```

### Vertical Scaling

Edit Helm values:
```yaml
apiCore:
  resources:
    requests:
      memory: "2Gi"
      cpu: "1000m"
    limits:
      memory: "4Gi"
      cpu: "2000m"
```

Apply:
```bash
helm upgrade eureka ./helm/eureka-platform \
  -n eureka \
  -f values-production.yaml
```

### Database Scaling

Upgrade PostgreSQL:
```bash
helm upgrade postgres bitnami/postgresql \
  -n eureka \
  --set primary.resources.requests.memory=4Gi \
  --set primary.resources.requests.cpu=2000m
```

---

## 🔄 **Update & Rollback**

### Update Application

```bash
# Build new images
docker build -t eureka/api-core:v1.1.0 ./services/api-core
docker push eureka/api-core:v1.1.0

# Deploy update
helm upgrade eureka ./helm/eureka-platform \
  -n eureka \
  --set apiCore.image.tag=v1.1.0

# Monitor rollout
kubectl rollout status deployment/api-core -n eureka
```

### Rollback

```bash
# Rollback to previous version
helm rollback eureka -n eureka

# Or specify revision
helm rollback eureka 2 -n eureka

# Check history
helm history eureka -n eureka
```

---

## 🎯 **Production Best Practices**

1. **Always** test in staging first
2. **Never** deploy on Fridays
3. **Schedule** maintenance windows
4. **Monitor** metrics during deployment
5. **Keep** backup before major changes
6. **Document** all configuration changes
7. **Review** security regularly
8. **Rotate** secrets every 90 days
9. **Update** dependencies monthly
10. **Train** team on runbooks

---

**Last Updated:** 2024-11-17
**Version:** 1.0.0
