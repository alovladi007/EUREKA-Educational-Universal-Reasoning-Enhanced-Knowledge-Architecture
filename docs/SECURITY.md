# EUREKA security model

This document is the reference for how EUREKA handles authentication,
authorisation, tenant isolation, and secrets. Updated in **Phase 3
Session 3.3 (2026-05)**.

## TL;DR

| Concern | Mechanism | Where |
|---|---|---|
| Password hashing | argon2id (active), bcrypt (legacy, transparently upgraded on login) | `app/utils/auth.py` |
| MFA | TOTP per RFC 6238 + 10 single-use recovery codes; Fernet-encrypted secret at rest | `app/utils/mfa.py`, `app/api/v1/endpoints/mfa.py` |
| JWT | HS256, separate access (60 min) + refresh (30 day) tokens | `app/utils/auth.py` |
| Account lockout | 5 failed attempts → 15-min lock | `app/crud/user.py` |
| Tenant isolation | Per-endpoint org_id checks (defence-in-depth: middleware injects, endpoints enforce) | `app/middleware/tenancy.py`, every endpoint under `app/api/v1/endpoints/` |
| Security headers | HSTS (prod), nosniff, DENY frame, CSP, Permissions-Policy, Referrer-Policy | `app/middleware/security_headers.py` |
| Secrets management | `.env` for dev; production: external secret manager (recommended sops+age, see Phase 3.5) | Phase 3.5 lands the wiring |

## Password hashing — argon2id

`pwd_context` in [`app/utils/auth.py`](../eureka/services/api-core/app/utils/auth.py) is configured with `schemes=["argon2", "bcrypt"]`, `deprecated="auto"`. New hashes are argon2id; bcrypt is kept only to verify legacy hashes seeded before 2026-05.

Login goes through `verify_and_upgrade_hash()` which calls `passlib.CryptContext.verify_and_update()`. If the stored hash is bcrypt, on a successful verification it returns a fresh argon2id hash that we persist on the same session — the user notices nothing, but the next login uses the modern hash.

**No "rehash everyone" migration is required.** Users are upgraded on first login after the deploy.

## MFA — TOTP

### Enrolment

1. Authenticated user → `POST /api/v1/auth/mfa/setup`
2. Response: `{ otpauth_uri, secret, recovery_codes[10] }`. The frontend renders the otpauth URI as a QR code and shows the recovery codes **once**.
3. User opens an authenticator app (Google Authenticator, 1Password, Authy, Bitwarden, etc.), scans the QR.
4. User confirms with `POST /api/v1/auth/mfa/verify { "code": "123456" }`. Server flips `mfa_enabled = True`.

The TOTP secret is encrypted at rest with Fernet keyed by `MFA_ENVELOPE_KEY` (see below). Recovery codes are likewise encrypted; each is single-use.

### Login with MFA

When `mfa_enabled = True`, `POST /api/v1/auth/login` requires `mfa_code` in the payload alongside `email`/`password`. Without it, the response is **401 `MFA code required`** with `X-MFA-Required: true` header so the frontend can prompt.

`mfa_code` accepts either a 6-digit TOTP **or** one of the recovery codes. Recovery codes are removed from the stored list once consumed.

### Disable

`POST /api/v1/auth/mfa/disable { "password": "…" }`. The current password is required so a stolen session cookie/JWT cannot silently disable MFA.

### Role requirements

`settings.MFA_REQUIRED_ROLES = ["org_admin", "super_admin", "instructor"]`. The current login flow checks `user.mfa_enabled`, not the role — so an admin who hasn't enrolled yet can still log in. Phase 3.3 follow-up (Session 3.3b) should add an "MFA setup required" wedge for these roles to force enrolment on first login.

## JWT — rotation

### Dev
`JWT_SECRET` defaults to a fresh `secrets.token_urlsafe(32)` per process. Every restart invalidates outstanding tokens; users are logged out and re-login. This is desired for dev.

### Production
`JWT_SECRET` MUST be set via the environment / secret manager. The application boot check in [`main.py`](../eureka/services/api-core/main.py) **refuses to start** if `ENVIRONMENT` is `production` or `staging` and `JWT_SECRET` is not set — fail-loud is better than every pod minting tokens nobody else can verify.

### Manual rotation procedure
1. Generate the new secret:
   ```bash
   openssl rand -hex 32   # → 64-char hex
   ```
2. Stage it in the secret manager alongside the current one (call them `current` and `previous`).
3. Update `JWT_SECRET` env var on a single pod, restart it. Confirm new tokens verify on that pod.
4. Roll-restart the rest of the fleet.
5. Wait `JWT_EXPIRATION_MINUTES` (default 60) for outstanding access tokens to expire; refresh tokens auto-renew under the new secret because the refresh endpoint re-issues both.
6. After all refresh tokens have either rotated or expired (max `REFRESH_TOKEN_EXPIRATION_DAYS`, default 30), remove `previous` from the manager.

**For zero-downtime rotation** (no users logged out), implement multi-key JWT verification in `app/utils/auth.py`: try the current secret first, fall back to the previous. We don't have this yet — tracked in BACKLOG.

## MFA envelope key

`MFA_ENVELOPE_KEY` encrypts every stored TOTP secret. Same constraints as `JWT_SECRET`:
- Dev: regenerated per process — all MFA enrolments effectively reset on restart. Re-enrol as needed.
- Prod: MUST be set externally. Boot fails if missing.

If you lose `MFA_ENVELOPE_KEY` in prod, **every user's MFA enrolment becomes unreadable**. Treat it like a database master key. Store it in the secret manager, back it up offline, and rotate only with a planned re-enrolment campaign.

To generate one:
```bash
python -c 'from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())'
```

## Tenant isolation

Every authenticated request goes through `TenancyMiddleware`. It:

1. Extracts the bearer token, decodes it with `JWT_SECRET`.
2. Reads `org_id`, `user_id`, `role` from the JWT payload.
3. Injects them into `request.state.org_id` etc.

**Enforcement happens at the endpoint level** today: every CRUD endpoint compares `current_user.org_id` against the target row's `org_id`. The middleware is *not* the only gate. The integration test at [`tests/integration/test_tenancy_isolation.py`](../eureka/services/api-core/tests/integration/test_tenancy_isolation.py) creates two orgs and proves end-to-end that user/course/organization cross-tenant reads return 403/404.

### Follow-up needed
The middleware should also enforce — not just inject. We want a SQLAlchemy session-scoped filter (e.g. `with_loader_criteria(Org.id == request.state.org_id)`) so a developer who forgets the manual check can't accidentally leak. Tracked in BACKLOG.

## Security headers

`SecurityHeadersMiddleware` ([`app/middleware/security_headers.py`](../eureka/services/api-core/app/middleware/security_headers.py)) sets, on every response:

| Header | Value | Why |
|---|---|---|
| Strict-Transport-Security | `max-age=31536000; includeSubDomains; preload` (prod only) | Force HTTPS for 1 year, eligible for HSTS preload list |
| X-Content-Type-Options | `nosniff` | Stop browsers MIME-sniffing |
| X-Frame-Options | `DENY` | No iframe embedding |
| Referrer-Policy | `strict-origin-when-cross-origin` | Origin only to third parties |
| Permissions-Policy | camera, mic, geolocation, payment, USB, accelerometer, gyroscope disabled | Disable powerful APIs by default |
| Content-Security-Policy | conservative `default-src 'self'`; relaxed for inline styles (Tailwind) | XSS mitigation |

`CSP_DIRECTIVES` setting overrides the default if a deployment needs to permit a CDN.

## Account lockout

5 failed login attempts → `locked_until` is set 15 minutes ahead. While locked, login returns 403 regardless of password correctness. Successful login resets the counter.

## CORS

In `ENVIRONMENT=development`, `allow_origins=["*"]`. Anywhere else, `allow_origins=settings.CORS_ORIGINS` (defaults to `localhost:3000`, `localhost:3001`). Adjust via env in production. Wildcards in production are a security smell — Phase 3.5 should add a CI check.

## Reporting vulnerabilities

Privately, to the maintainers — **not** via public issues. Disclose: reproducer, expected vs actual, affected version (commit SHA), and the impact you observed.
