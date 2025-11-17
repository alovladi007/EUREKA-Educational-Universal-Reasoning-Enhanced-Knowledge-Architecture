# EUREKA Production Scripts

This directory contains all scripts needed to deploy and manage EUREKA in production.

## Directory Structure

```
scripts/
├── secrets/              # Secrets generation and management
│   ├── generate-secrets.sh
│   └── setup-external-secrets.sh
│
├── deployment/          # Cluster setup and deployment
│   ├── setup-cluster.sh
│   ├── setup-cert-manager.sh
│   └── deploy-eureka.sh
│
├── monitoring/          # Monitoring and observability
│   └── setup-monitoring.sh
│
├── backup/              # Backup and disaster recovery
│   └── setup-backups.sh
│
└── smoke-tests/         # Post-deployment testing
    └── run-tests.sh
```

## Quick Reference

### 1. Secrets Management

```bash
# Generate production secrets
cd secrets
./generate-secrets.sh production

# Setup external secrets (AWS/GCP/Azure/Vault)
./setup-external-secrets.sh aws
```

### 2. Cluster Setup

```bash
# Create Kubernetes cluster
cd deployment
./setup-cluster.sh <provider> <environment>

# Examples:
./setup-cluster.sh aws production
./setup-cluster.sh gcp staging
./setup-cluster.sh azure production
./setup-cluster.sh local development
```

### 3. TLS Certificates

```bash
# Install cert-manager and configure TLS
./setup-cert-manager.sh <domain> <email>

# Example:
./setup-cert-manager.sh eureka.example.com admin@eureka.example.com
```

### 4. Deployment

```bash
# Deploy complete EUREKA platform
./deploy-eureka.sh <environment>

# Examples:
./deploy-eureka.sh production
./deploy-eureka.sh staging
```

### 5. Monitoring

```bash
# Setup monitoring stack
cd monitoring
./setup-monitoring.sh <namespace> <environment>

# Example:
./setup-monitoring.sh monitoring production
```

### 6. Backups

```bash
# Configure automated backups
cd backup
./setup-backups.sh <namespace> <backup-namespace> <environment>

# Trigger manual backup
./manual-backup.sh
```

### 7. Testing

```bash
# Run smoke tests
cd smoke-tests
./run-tests.sh <api-url> <app-url> <namespace>

# Example:
./run-tests.sh https://api.eureka.example.com https://app.eureka.example.com eureka
```

## Complete Setup Flow

For a complete production deployment, run scripts in this order:

```bash
# 1. Create cluster
cd deployment
./setup-cluster.sh aws production

# 2. Install cert-manager
./setup-cert-manager.sh eureka.example.com admin@eureka.example.com

# 3. Generate and apply secrets
cd ../secrets
./generate-secrets.sh production
# Edit secrets-production/.env with your values
kubectl apply -f secrets-production/eureka-secrets.yaml

# 4. Deploy application
cd ../deployment
./deploy-eureka.sh production

# 5. Setup monitoring
cd ../monitoring
./setup-monitoring.sh

# 6. Configure backups
cd ../backup
./setup-backups.sh

# 7. Run tests
cd ../smoke-tests
./run-tests.sh https://api.eureka.example.com https://app.eureka.example.com
```

## Environment Variables

### Common Variables

```bash
# Cluster setup
export AWS_REGION=us-east-1
export GCP_PROJECT_ID=your-project-id
export AZURE_LOCATION=eastus

# Image registry
export DOCKER_REGISTRY=ghcr.io/yourusername

# Deployment
export IMAGE_TAG=v1.0.0
export ENVIRONMENT=production
```

### Size Variables

```bash
# Storage sizes (for custom deployments)
export POSTGRES_SIZE=50Gi
export REDIS_SIZE=20Gi
export MINIO_SIZE=100Gi
```

## Script Flags

### Dry Run

Most scripts support dry-run mode:

```bash
DRY_RUN=true ./deploy-eureka.sh production
```

### Build Images

Force rebuilding Docker images:

```bash
BUILD_IMAGES=true ./deploy-eureka.sh production
```

## Common Operations

### Check Deployment Status

```bash
kubectl get pods -n eureka
kubectl get svc -n eureka
kubectl get ingress -n eureka
```

### View Logs

```bash
kubectl logs -f deployment/api-core -n eureka
kubectl logs -f deployment/tutor-llm -n eureka
```

### Scale Services

```bash
kubectl scale deployment api-core --replicas=5 -n eureka
```

### Update Application

```bash
helm upgrade eureka ../../helm/eureka-platform \
  -n eureka \
  --set apiCore.image.tag=v1.1.0
```

### Rollback

```bash
helm rollback eureka -n eureka
```

## Monitoring

### Access Grafana

```bash
kubectl port-forward -n monitoring svc/kube-prometheus-stack-grafana 3000:80
# Open http://localhost:3000
# Username: admin, Password: admin
```

### Access Prometheus

```bash
kubectl port-forward -n monitoring svc/prometheus-operated 9090:9090
# Open http://localhost:9090
```

### View Alerts

```bash
kubectl port-forward -n monitoring svc/alertmanager-operated 9093:9093
# Open http://localhost:9093
```

## Backups

### View Backup Status

```bash
kubectl get cronjobs -n eureka-backup
kubectl get jobs -n eureka-backup
```

### Trigger Manual Backup

```bash
cd backup
./manual-backup.sh
```

### List Backups

```bash
kubectl exec -it -n eureka-backup <backup-pod> -- ls -lh /backups
```

## Troubleshooting

### Pod Not Starting

```bash
kubectl describe pod <pod-name> -n eureka
kubectl logs <pod-name> -n eureka
```

### Database Issues

```bash
# Test connection
kubectl run -it --rm debug --image=postgres:16 --restart=Never -- \
  psql -h postgres-service.eureka.svc.cluster.local -U eureka -d eureka
```

### Certificate Issues

```bash
kubectl logs -n cert-manager deploy/cert-manager
kubectl describe certificate -n eureka
kubectl describe certificaterequest -n eureka
kubectl describe challenge -n eureka
```

### Monitoring Issues

```bash
kubectl get servicemonitors -n eureka
kubectl logs -n monitoring -l app.kubernetes.io/name=prometheus
```

## Security Notes

⚠️ **Important Security Reminders:**

1. Never commit secrets to version control
2. Use external secrets management in production
3. Rotate secrets regularly (every 90 days)
4. Use strong, unique passwords
5. Enable RBAC and network policies
6. Review and audit security regularly
7. Keep backups encrypted
8. Use VPN/bastion for cluster access
9. Enable audit logging
10. Monitor for security alerts

## Support

For issues or questions:
- See `/DEPLOYMENT_GUIDE.md`
- See `/PRODUCTION_SETUP_GUIDE.md`
- GitHub Issues: https://github.com/yourusername/EUREKA/issues
- Email: devops@eureka.example.com

## License

Copyright © 2024 EUREKA Educational Platform
