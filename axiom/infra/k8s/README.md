# AXIOM Kubernetes manifests

A production-shaped deployment baseline for the four app workloads (api, web,
worker, beat) plus Postgres (pgvector) and Redis.

```
kubectl apply -k infra/k8s
```

Before applying:
- Replace the placeholder values in the `axiom-secrets` Secret via your secrets
  manager (never commit real secrets).
- Point the image references (`ghcr.io/alovladi007/axiom-*`) at the tags your CI
  publish step produces.
- Add an Ingress/TLS in front of the `axiom-web` and `axiom-api` Services, plus
  resource requests/limits and NetworkPolicies tuned to your cluster.

This is a starting point, not a hardened cluster config. The `axiom-api`
Deployment runs `alembic upgrade head` on start; for multi-replica rollouts move
migrations to an init Job so they run once per release.
