# EUREKA — Security Hardening Checklist

> **Phase 21 deliverable.** Layered hardening between "works on
> localhost" and "passes SOC 2 Type I + pen test." Each item below
> ships as a code change, a config change, or a documented procedure.

## What's already done (Phases 3.3 + 13.5 + 14.5)

✅ **Argon2id passwords** with transparent bcrypt → argon2 rehash on login (Phase 3.3)
✅ **TOTP MFA** with Fernet-encrypted secrets + recovery codes (Phase 3.3)
✅ **JWT bearer auth** with HS256, fail-loud boot check for missing `JWT_SECRET` (Phase 3.3)
✅ **Cross-tenant isolation tests** (5 tests in `tests/integration/test_tenancy_isolation.py`) (Phase 3.3)
✅ **SecurityHeadersMiddleware** — HSTS (prod), X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy, CSP (Phase 3.3)
✅ **Audit log** every security-relevant action → `audit_events` (Phase 13.5)
✅ **gitleaks** in CI for committed-secret detection (Phase 3.5)
✅ **SOPS+age** for repo-stored secrets (Phase 3.5)
✅ **Liveness + readiness probes** with degraded-state detection (Phase 14.5)
✅ **Rate-limit middleware** wired (Phase 21.4 — see below). Per-IP + per-endpoint with auth multiplier. Login limited to 5/min, tutor to 20/min.

---

## 21.1 — External pen test

Engage a firm. Budget $8k–$20k for a comprehensive test covering:

- OWASP Top 10 (injection, broken auth, sensitive data, XXE, broken
  access control, security misconfig, XSS, deserialization, vulnerable
  components, insufficient logging)
- API abuse (mass assignment, BOLA, broken authentication, broken
  function-level authz)
- Multi-tenant breach attempts (try to read/modify another org's data
  by manipulating org_id / user_id headers)
- Rate-limit bypass (header spoofing, distributed sources)
- JWT manipulation (algorithm confusion, key confusion, replay)
- Stripe webhook signature bypass (Phase 10 + 11.1)
- LTI 1.3 launch jwt forgery (Phase 9.2)

**Vendors to consider**: Trail of Bits, NCC Group, Bishop Fox, Cure53,
HackerOne pen-test-as-a-service.

**Output**: findings report with CVSS scores → backlog issues with
SLA-driven fix dates. Severity SLAs:
- Critical: 24 hours
- High: 7 days
- Medium: 30 days
- Low: 90 days

---

## 21.2 — Dependency CI gating

Currently `gitleaks` runs and `pip-audit`/`npm audit` run but are
warn-only. Flip to gating:

```yaml
# .github/workflows/ci.yml (existing — add the continue-on-error: false flags)
- name: Python dependency audit
  run: pip-audit --strict
  # continue-on-error: false  ← already gating ideally
- name: NPM dependency audit
  run: npm audit --audit-level=high
- name: gitleaks
  run: gitleaks detect --redact
```

Override mechanism for unavoidable false positives:
- `pip-audit --ignore-vuln <CVE-id>` with a comment explaining why
- `.npmaudit-ignore.json` for npm
- `.gitleaks.toml` allowlist for documentation placeholders

---

## 21.3 — SAST / DAST

**SAST** (static analysis):
- **Snyk Code** or GitHub Advanced Security (CodeQL) — runs on every PR
- Focus on: SQL injection, XSS, path traversal, hardcoded secrets,
  unsafe deserialization

**DAST** (dynamic):
- **OWASP ZAP** baseline scan in CI against the running compose stack
- Schedule full active scan weekly against staging

Both gating: a critical-severity finding blocks merge.

---

## 21.4 — Rate limiting (DONE — wired this commit)

`app/middleware/rate_limit.py` mounts at app boot when
`RATE_LIMIT_ENABLED=1` (default-on in `ENVIRONMENT=production`,
default-off in dev so the integration tests aren't rate-limited).

Current limits (sliding window via Redis):

| Path | Limit | Window | Auth multiplier |
|---|---|---|---|
| `POST /auth/login` | 5 | 60s | 1× (login is the auth boundary) |
| `POST /auth/register` | 3 | 60s | 1× |
| `POST /auth/forgot-password` | 3 | 5 min | 1× |
| `POST /auth/reset-password` | 3 | 5 min | 1× |
| `POST /tutor/chat` | 20 | 60s | 2× |
| Default | 100 | 60s | 2× |

Authenticated users get 2× the limit (via `auth_multiplier`).

**Per-API-key limits** (Phase 13.1 `api_keys.rate_limit_per_min`)
aren't enforced yet — the column exists but the middleware uses path-
based limits. Roadmap item for Phase 21.4.1: extend the middleware to
look up the api_keys row when `X-API-Key` or `Authorization: Bearer
apikey-*` is present and enforce that key's stored `rate_limit_per_min`.

Headers returned on every response:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset` (unix timestamp)
- On 429: `Retry-After: <seconds>`

---

## 21.5 — Tenancy isolation expansion

Phase 3.3 has 5 tests. Expand to cover every multi-tenant table added
since:

- [ ] Phase 9: `cohorts`, `cohort_memberships`, `lti_platforms`, `sso_idp_configs`
- [ ] Phase 10: `course_listings`, `instructor_profiles`, `coupons`
- [ ] Phase 11: `subscriptions`, `invoices`, `support_tickets`, `kb_articles`
- [ ] Phase 12: `study_plans`, `live_sessions`, `notification_devices`
- [ ] Phase 13: `api_keys`, `webhook_endpoints`, `embed_tokens`, `oauth_apps`, `audit_events`
- [ ] Phase 15: `institution_partnerships`, `workforce_programs`, `compliance_requirements`
- [ ] Phase 16.1: `graduate_programs`, `graduate_enrollments`, `degree_milestones`
- [ ] Phase 17: `user_collections`, `collection_items`, `activity_events`
- [ ] Phase 18: `community_threads`, `community_posts`, `learning_resources`

Pattern (one test per table):

```python
async def test_cohorts_cross_tenant_isolation(db, org_a_admin, org_b_admin):
    # Org A creates a cohort
    coh_a = await create_cohort_as(org_a_admin, ...)

    # Org B admin tries to read it → 403
    r = await as_user(org_b_admin).get(f"/cohorts/{coh_a.id}")
    assert r.status_code in (403, 404)

    # Org B admin tries to LIST cohorts → only sees their own
    r = await as_user(org_b_admin).get("/cohorts")
    assert all(c["id"] != coh_a.id for c in r.json())

    # Org B admin tries to mutate → 403
    r = await as_user(org_b_admin).patch(f"/cohorts/{coh_a.id}", json={...})
    assert r.status_code in (403, 404)
```

---

## 21.6 — Postgres row-level security (RLS)

Defence in depth: even if app code accidentally crosses tenants, RLS
on the DB level refuses to return the row.

Template migration in `eureka/ops/db/_rls_template.sql` (see that file
for the canonical version). Pattern:

```sql
-- 1. Add the org_id column if missing.
ALTER TABLE my_table
  ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);

-- 2. Enable RLS.
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;

-- 3. Default-deny policy.
CREATE POLICY rls_my_table_isolate ON my_table
  USING (org_id::text = current_setting('app.current_org_id', true));

-- 4. App connects, sets the session var per request.
SET app.current_org_id = '<the request user's org_id>';
```

The app sets `app.current_org_id` in the connection-checkout callback
(every request gets a session-scoped var). RLS does the rest.

**Migration plan**: roll out per-table, behind a feature flag, with
shadow-mode logging first (count rows that WOULD have been refused).
Switch enforcement on table-by-table.

---

## 21.7 — MFA enforcement in prod

`MFA_REQUIRED_ROLES` is already wired (Phase 3.3 fail-loud check). In
prod:

```bash
MFA_REQUIRED_ROLES=org_admin,super_admin,instructor
```

UI work needed (Phase 21.7.1):
- First-login nag screen for users in required roles that haven't
  enrolled
- Step-up MFA prompt for high-risk actions (delete org, rotate API key,
  payout config change)

---

## 21.8 — Audit log retention

`audit_events` grows ~1k/day per active org. Retention strategy:

- **Hot**: last 90 days in `audit_events` table — fast queries
- **Warm**: 90 days–2 years in `audit_events_archive` (same schema, separate table) — slower queries
- **Cold**: 2–7 years in S3 Glacier as gzipped JSONL — compliance only

Job (Phase 14.2 queue) runs nightly:
1. Move rows older than 90 days to `audit_events_archive`
2. Move rows older than 2 years from archive to S3 Glacier
3. Drop S3 rows older than 7 years (per FERPA / SOX)

---

## 21.9 — SOC 2 Type I prep

Roughly 6 months kickoff → report. Required evidence:

| Control area | Evidence |
|---|---|
| Access control | Org chart, role matrix, MFA enforcement, quarterly access reviews |
| Change management | PR review requirement, CI gating, deploy logs, runbooks |
| Risk assessment | Annual risk register, threat model document |
| Incident response | Runbook (✓ `docs/RUNBOOK.md`), drill records, post-mortems |
| Vendor management | Subprocessor list (Stripe, Anthropic, Resend, AWS), BAAs / DPAs on file |
| Data classification | What's PII, what's restricted, what's public |
| Encryption | At rest (Fernet for MFA secrets, ed25519 for transcripts, AES via RDS/S3) + in transit (TLS 1.2+) |
| Backups + DR | `scripts/backup-restore.sh` runs nightly, restore drilled quarterly |
| Logging + monitoring | OpenTelemetry traces, structlog JSON, Prometheus metrics, alert runbook |
| Vulnerability management | pen-test report (21.1), pip-audit/npm-audit gating (21.2), monthly patching SLA |

**Recommended auditor**: any AICPA member firm with SaaS experience
(Sensiba, A-LIGN, Schellman, Prescient).

---

## Real-incident drills

Run these every 90 days against staging:

- [ ] Restore-from-snapshot drill (`scripts/backup-restore.sh test`)
- [ ] Compromised-credential drill (rotate one secret end-to-end)
- [ ] Tenant-isolation breach simulation (use a deliberate buggy query
      → verify RLS catches it + audit log records it)
- [ ] DDoS drill (simulate 50k req/s → verify rate limiter holds + ingress
      autoscales)
