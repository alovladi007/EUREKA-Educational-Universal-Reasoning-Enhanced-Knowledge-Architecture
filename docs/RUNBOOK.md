# EUREKA — Operations Runbook

> **Phase 20 deliverable.** What to do when the platform misbehaves in
> production. Sister doc to [`docs/DEPLOYMENT.md`](DEPLOYMENT.md).

## Severity definitions

| Sev | Definition | Response time |
|---|---|---|
| **SEV-1** | Whole platform down, or data leak across tenants | 15 minutes |
| **SEV-2** | Major feature broken (auth, billing, AI tutor, exam delivery) | 1 hour |
| **SEV-3** | Single tier or page broken, workarounds exist | 4 hours |
| **SEV-4** | Cosmetic / non-critical | next business day |

---

## On-call rotation

- **Primary**: rotates weekly, gets PagerDuty alerts
- **Secondary**: backup escalation if primary doesn't ack in 5 min
- **Incident commander**: senior eng, handles SEV-1 + post-mortem

Document the rotation in [your PD/Opsgenie schedule]. Drill it monthly.

---

## Standard diagnostic flow

```bash
# 1. Status overview
kubectl get pods -n eureka
kubectl top pods -n eureka

# 2. Recent errors in api-core
kubectl logs -n eureka -l app=api-core --tail=200 | grep -iE "error|exception|trace"

# 3. Health endpoints
curl https://api.eureka.example.com/healthz
curl https://api.eureka.example.com/readyz | jq .checks

# 4. Prometheus metrics — look for spikes
curl -s https://api.eureka.example.com/api/v1/metrics | grep -E "duration_seconds_(sum|count)|requests_total"

# 5. Database
kubectl exec -n eureka deploy/api-core -- python -c "
from app.core.database import engine
import asyncio
async def t():
    async with engine.connect() as c:
        r = await c.execute('SELECT 1')
        print(r.scalar())
asyncio.run(t())
"
```

---

## Common incidents

### p95 latency spike on `/api/v1/me/dashboard`

**Symptom**: Prometheus alert `eureka_http_request_duration_seconds_bucket{path="/me/dashboard",le="0.5"}` falling below the SLO.

**Likely causes**:
1. Slow `/me/graduate` enrollment milestone subquery — check pg_stat_statements
2. Redis miss rate climbing — check cache hit % in metrics
3. activity_events table doing seq-scan — verify `idx_activity_user_created` index exists

**Fix**:
```sql
-- Recompute index statistics
ANALYZE activity_events;
ANALYZE user_collections;

-- If activity_events is huge, archive old rows
DELETE FROM activity_events
WHERE created_at < NOW() - INTERVAL '90 days'
  AND is_public = false;
```

---

### 5xx error rate alert

**Symptom**: `eureka_http_requests_total{status_code=~"5.."} > N/min`

**Diagnosis**:
```bash
# Tail recent 5xxs
kubectl logs -n eureka -l app=api-core --tail=500 \
  | grep -E '"status_code":\s?5'

# Group by error type
kubectl logs -n eureka -l app=api-core --tail=2000 \
  | grep -oE '[A-Z][a-zA-Z]+Error' | sort | uniq -c | sort -rn
```

**Common 500s**:
- `MissingGreenlet` — SQLAlchemy lazy-load inside async context (Phase 19 fixed several; check new code)
- `IntegrityError: duplicate key` — race condition, add idempotency
- `OperationalError: connection pool exhausted` — bump pool size or fix leak
- `JSONDecodeError` — bad payload from a third-party webhook

---

### Dead-letter job queue draining

**Symptom**: `eureka_jobs_dead_total` > 100

**Diagnosis**:
```sql
SELECT kind, COUNT(*), MAX(failed_at)
FROM background_jobs
WHERE status = 'dead'
GROUP BY kind
ORDER BY 2 DESC;
```

**Fix**:
- Find a representative dead job and inspect its `last_error` column
- Common: `webhook.deliver` against a customer endpoint that's been down → contact customer
- Common: `email.send` with bad recipient → mark as `abandoned`
- Re-enqueue fixable jobs:
  ```sql
  UPDATE background_jobs
  SET status = 'queued', attempt_n = 0, scheduled_at = NOW(), last_error = NULL
  WHERE id IN (...);
  ```

---

### DB connection pool exhaustion

**Symptom**: api-core logs `QueuePool limit exceeded`

**Immediate**:
- Restart api-core deployment: `kubectl rollout restart deploy/api-core -n eureka`
- Bumps connections via `kubectl edit configmap/eureka-api-config`:
  `SQLALCHEMY_POOL_SIZE=20`, `SQLALCHEMY_MAX_OVERFLOW=10`

**Root cause hunt**:
- Look for missing `async with` / `await db.close()` in recently-merged code
- Check Postgres slow query log: `pg_stat_activity` rows in state=idle in transaction

---

### Tenancy isolation breach (SEV-1)

**Symptom**: Customer reports seeing another org's data, OR audit log
flags a `data.cross_org_read` event.

**Immediate response**:
1. **Block traffic** to the affected endpoint via ingress annotation
2. **Snapshot DB** — pg_dump for forensics
3. **Page incident commander** + counsel
4. **Notify affected customers** within 72 hours (GDPR), 60 days (FERPA), 60 days (HIPAA)

**Investigation**:
- Check `audit_events` for `actor_org_id != subject_org_id`
- Verify Phase 3.3 isolation tests still pass against the prod schema
- Run Phase 21.6 row-level-security policies if not yet enabled

---

## Token + secret rotation

See [`docs/SECRETS.md`](SECRETS.md) for per-secret rotation
procedures. Cadence:

| Secret | Cadence | Procedure |
|---|---|---|
| `JWT_SECRET` | quarterly | Phase 3.5 graceful-rotation procedure (dual-key window) |
| `MFA_ENVELOPE_KEY` | annually | Fernet key rotation re-encrypts TOTP secrets |
| Stripe / Anthropic / Resend keys | on personnel change | New key, deploy, revoke old |
| DB password | quarterly | RDS rotate-secret + helm upgrade |

---

## Customer data export (DSAR)

Per Phase 13.5:

```bash
# Single user export
curl -X POST https://api.eureka.example.com/api/v1/me/compliance/export \
  -H "Authorization: Bearer $TOKEN" \
  -H 'content-type: application/json' \
  -d '{"sections": ["profile","attempts","engagement","achievements","study_plans","mock_attempts","tickets","invoices","purchases","reviews","notifications"]}'

# Returns { id, status: "queued" }
# Poll:
curl https://api.eureka.example.com/api/v1/me/compliance/exports/{id}
# When status == "ready": download from S3 signed URL in response
```

SLAs: 30 days under GDPR, 45 days under CCPA, 45 days under FERPA.

---

## Deletion request

```bash
curl -X POST https://api.eureka.example.com/api/v1/me/compliance/delete \
  -H "Authorization: Bearer $TOKEN" \
  -H 'content-type: application/json' \
  -d '{"scheduled_days": 30}'

# Customer can cancel within 30 days:
curl -X POST https://api.eureka.example.com/api/v1/me/compliance/delete/{id}/cancel
```

After 30 days the job-queue worker (Phase 14.2) executes the cascade
delete and writes an immutable `audit_events` row.

---

## Post-mortem template

For SEV-1 + SEV-2 incidents, write a post-mortem within 5 business days:

1. **Summary** (1 paragraph)
2. **Impact** — customers affected, duration, revenue impact
3. **Timeline** — detection → mitigation → resolution
4. **Root cause** — 5 whys
5. **What went well** / **What went poorly**
6. **Action items** — each with owner + due date + tracking link

Store in `docs/postmortems/YYYY-MM-DD-incident-slug.md`.
