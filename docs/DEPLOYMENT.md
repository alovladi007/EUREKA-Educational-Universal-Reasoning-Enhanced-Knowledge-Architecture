# EUREKA — Production Deployment Guide

> **Phase 20 deliverable.** Tested deployment patterns for taking the
> EUREKA platform from `localhost` to a public, multi-tenant production
> environment.

## TL;DR

You need 6 cloud resources, two domain records, and roughly 8 hours of
focused work for a small-tier deployment. Bigger orgs add managed
observability + WAF + multi-region replication.

```
┌─────────────────────────────────────────────────────────────────┐
│  GitHub Actions (cd-deploy.yml)                                 │
│  on: push: main → build images → push to registry → helm upgrade │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   container          managed K8s             managed data
    registry            cluster                stores
   (ECR/GAR)        (EKS/GKE/DOKS)        ┌──────┴──────┐
                          │            Postgres    Redis   S3
                          │           (RDS/CloudSQL)
                          │                    │
                ┌─────────┼─────────┐
              api-core   web   admin   (Helm-managed Deployments)
                          │
                       ingress
                          │
                    cert-manager
                          │
                      learner.eureka.example.com
```

---

## 1. Pick a cloud target

| Cloud | K8s service | Postgres | Redis | Object storage | Best for |
|---|---|---|---|---|---|
| **AWS** | EKS | RDS PostgreSQL 16 + pgvector | ElastiCache for Redis | S3 | Enterprise / SOC 2 maturity |
| **GCP** | GKE Autopilot | Cloud SQL Postgres 16 | Memorystore for Redis | GCS | ML/AI workload alignment |
| **DigitalOcean** | DOKS | Managed Postgres | Managed Redis | Spaces | Cheapest, simplest |
| **Self-hosted** | k3s on bare metal | Postgres in-cluster | Redis in-cluster | MinIO | Air-gapped customers |

This guide uses **AWS** as the worked example. Adjust resource names for
your cloud — the Helm chart is cloud-agnostic.

---

## 2. Provision foundation (Terraform recommended)

A minimal `terraform/main.tf` you'd run once:

```hcl
# 1. VPC + subnets (use eksctl or terraform-aws-modules/vpc/aws)
# 2. EKS cluster (use terraform-aws-modules/eks/aws)
# 3. RDS Postgres 16 — IMPORTANT: enable pgvector + pg_trgm extensions
#    via parameter group; allocate ≥100 GB gp3 storage; multi-AZ in prod.
# 4. ElastiCache Redis (cluster mode disabled, single node OK for v1)
# 5. S3 bucket for uploads + S3 bucket for Postgres backups
# 6. ECR repositories for: api-core, web, admin (one per image)
# 7. ACM cert for *.eureka.example.com
# 8. Route 53 hosted zone
```

A scaffolded `terraform/` directory ships in this repo as a follow-up
(Phase 20.1 deliverable).

### Postgres extensions

Once the RDS instance is up, connect and run:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgvector;     -- Phase 5 item embeddings
CREATE EXTENSION IF NOT EXISTS pg_trgm;       -- Phase 14.4 autocomplete
-- tsvector is built in.
```

Then run the init SQL from `eureka/ops/db/` in alphabetical order:

```bash
for f in eureka/ops/db/*.sql; do
  psql "$PG_DSN" -f "$f"
done
```

---

## 3. Configure GitHub Secrets

The CD workflow reads these. Set them via `gh secret set` or the GitHub
UI under **Settings → Secrets and variables → Actions**:

| Secret | What it's for |
|---|---|
| `KUBE_CONFIG_DATA` | base64-encoded kubeconfig for the cluster |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | for ECR push + EKS auth (or use OIDC role assumption) |
| `ANTHROPIC_API_KEY` | Phase 6 AI tutor |
| `STRIPE_SECRET_KEY` | Phase 10 marketplace + Phase 11.1 subscriptions |
| `RESEND_API_KEY` | Phase 11.3 email lifecycle |
| `JWT_SECRET` | rotate per Phase 3.5 procedure |
| `MFA_ENVELOPE_KEY` | Fernet key, rotate per docs/SECRETS.md |
| `DATABASE_URL` | full `postgresql+asyncpg://user:pass@host:5432/eureka` |
| `REDIS_URL` | `redis://host:6379/0` |
| `SENTRY_DSN` | optional, recommended |

---

## 4. Helm chart configuration

The chart lives at `eureka/helm/eureka-platform/`. Three values files:

- `values.yaml` — defaults
- `values-development.yaml` — dev-cluster overrides (resource limits low)
- `values-production.yaml` — prod overrides (HPA, replicas, resource limits)

A production deployment overrides these keys:

```yaml
# values-production.yaml
global:
  domain: learner.eureka.example.com
  environment: production
  imageRegistry: 1234567890.dkr.ecr.us-east-1.amazonaws.com

apiCore:
  replicas: 3
  autoscaling:
    enabled: true
    minReplicas: 3
    maxReplicas: 12
    targetCPUUtilizationPercentage: 70
  resources:
    requests:
      memory: 512Mi
      cpu: 250m
    limits:
      memory: 1Gi
      cpu: 1000m
  env:
    DATABASE_URL_SECRET: eureka-db-url
    REDIS_URL_SECRET: eureka-redis-url

web:
  replicas: 2
  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 6

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: learner.eureka.example.com
      paths: ["/"]
    - host: api.eureka.example.com
      paths: ["/api"]
  tls:
    - hosts: [learner.eureka.example.com, api.eureka.example.com]
      secretName: eureka-tls
```

---

## 5. CD workflow

`.github/workflows/cd-deploy.yml` already exists. By default it's
**manual-only** (`workflow_dispatch`) — it won't push on every commit
to `main` until you have a real cluster wired up.

### To enable auto-deploy on merge to main

Edit `.github/workflows/cd-deploy.yml`:

```yaml
on:
  workflow_dispatch:
    inputs: { ... }
  push:                          # ← add this block
    branches: [main]
    tags: ['v*']
```

The workflow will:
1. Build container images for `api-core` + `web` + `admin`
2. Push to your container registry (tagged with the commit SHA)
3. Run `helm upgrade --install` against the cluster
4. Slack-notify on failure (set `SLACK_WEBHOOK_URL` secret)

### Image tagging strategy

- `:main-<sha>` — every merge to main → auto-deployed to **staging**
- `:v1.2.3` — git tag → manually promoted to **production**
- `:latest` — last successful main build (avoid in prod)

---

## 6. Initial deployment

After the cluster is provisioned and secrets are set:

```bash
# 0. Connect kubectl to the cluster
aws eks update-kubeconfig --name eureka-prod --region us-east-1

# 1. Install cert-manager + nginx ingress + ExternalSecrets
kubectl create namespace cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx --create-namespace

# 2. Apply secrets (or use ExternalSecrets to sync from AWS Secrets Manager)
kubectl create secret generic eureka-secrets \
  --from-literal=JWT_SECRET="$JWT_SECRET" \
  --from-literal=MFA_ENVELOPE_KEY="$MFA_ENVELOPE_KEY" \
  --from-literal=DATABASE_URL="$DATABASE_URL" \
  --from-literal=ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY" \
  --from-literal=STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY" \
  -n eureka

# 3. Helm install
helm upgrade --install eureka eureka/helm/eureka-platform \
  -n eureka --create-namespace \
  -f eureka/helm/eureka-platform/values-production.yaml \
  --set global.domain=learner.eureka.example.com

# 4. Watch rollout
kubectl rollout status deployment/api-core -n eureka --timeout=5m
kubectl rollout status deployment/web -n eureka --timeout=5m
```

---

## 7. Post-deployment checks

```bash
# Health
curl https://api.eureka.example.com/healthz       # liveness
curl https://api.eureka.example.com/readyz        # readiness (checks db + cache + jobs)
curl https://api.eureka.example.com/api/v1/metrics   # Prometheus format

# Login + smoke
curl -X POST https://api.eureka.example.com/api/v1/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"admin@yourorg.com","password":"..."}'
```

If `/readyz` returns 503 with `db.status=fail`, check Postgres
connectivity from the api-core pods. If `cache.status=fail`, check
Redis. If `jobs.dead_count > 100`, inspect the `background_jobs` table
for stuck handlers (Phase 14.2).

---

## 8. Custom domain + SSL

DNS records:

```
A     learner.eureka.example.com     → <ingress LB IP>
A     api.eureka.example.com         → <ingress LB IP>
CNAME *.eureka.example.com           → eureka.example.com.  (optional wildcard)
```

cert-manager will auto-provision Let's Encrypt certs once the DNS
propagates. Verify:

```bash
curl -sv https://api.eureka.example.com 2>&1 | grep -E "subject:|expire"
```

---

## 9. Backups

`scripts/backup-restore.sh` ships in this repo. Wire it to a cron
in-cluster:

```yaml
# kubectl apply -f eureka/k8s/base/backup-cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: eureka-pg-backup
spec:
  schedule: "0 3 * * *"                  # 3 AM daily
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:16
            command: ["/scripts/backup-restore.sh", "backup"]
            envFrom:
              - secretRef: { name: eureka-secrets }
```

**Restore drill:** every 90 days, restore the latest backup into a
scratch DB and verify the schema + a sample query.

---

## 10. Common runbook lookups

See [`docs/RUNBOOK.md`](RUNBOOK.md) for:

- p95 latency spikes
- 5xx error rate alerts
- Dead-letter job queue draining
- DB connection-pool exhaustion
- Token / secret rotation procedures
- Tenant-isolation breach response
