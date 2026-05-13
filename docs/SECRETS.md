# EUREKA secrets management

Landed in **Phase 3 Session 3.5 (2026-05)**.

## Principles

1. **No plaintext secret ever lands in git.** A leak is rotated, not redacted.
2. **`.env` files are dev-only and gitignored.** Don't put production secrets in them.
3. **Production secrets live in [SOPS](https://github.com/getsops/sops)-encrypted yaml in this repo**, keyed by an [age](https://github.com/FiloSottile/age) recipient. Operators decrypt locally; CI decrypts via a `SOPS_AGE_KEY` env var on the runner.
4. **Every secret has a documented rotation procedure** (below). Rotation is an operator-initiated event, not a service-driven one.

## Architecture

```
                                      ┌──────────────────────────────┐
   Operator's age private key  ────►  │  sops -d secrets/dev.enc.yaml │
   (~/.config/sops/age/keys.txt)      │  → plaintext yaml on stdout   │
                                      └──────────────────────────────┘
                                                    │
       CI runner: $SOPS_AGE_KEY env  ────►          │
                                                    ▼
                                         export-to-env in entrypoint
                                                    │
                                                    ▼
                                              api-core, etc.
```

`secrets/{dev,staging,prod}.enc.yaml` are committed to git. Each is keyed
by a different age recipient (different humans / Vault paths / CI runners
allowed to read each).

## First-time setup (operator)

```bash
# 1. Install tools
brew install sops age   # macOS; apt-get install ... on Linux

# 2. Generate your age keypair (private key)
age-keygen -o ~/.config/sops/age/keys.txt
# The public key is printed; copy it.

# 3. Add your public key to .sops.yaml (the project root file)
#    Replace REPLACE_WITH_AGE_PUBLIC_KEY_FROM_age-keygen with your real key.
#    Commit the .sops.yaml change.

# 4. Create the dev secrets file
cp secrets/dev.enc.yaml.template secrets/dev.enc.yaml
# Edit secrets/dev.enc.yaml — fill in real values (still plaintext at this point).

# 5. Encrypt in place
sops -e -i secrets/dev.enc.yaml
# secrets/dev.enc.yaml now has plaintext keys but encrypted values.
# Safe to git add + commit.

# 6. Subsequent edits use sops directly — it decrypts to a temp file,
#    opens $EDITOR, re-encrypts on save:
sops secrets/dev.enc.yaml
```

## Loading secrets at runtime

### Local dev

For a developer who just cloned the repo:

```bash
# Decrypt once into a .env file the docker-compose stack can read.
sops -d secrets/dev.enc.yaml \
  | yq -P '. as $s | $s | to_entries | map("\(.key)=\(.value)") | .[]' \
  > .env

cd eureka && docker compose up -d
```

Or for a one-shot run, wrap the command:

```bash
sops exec-env secrets/dev.enc.yaml 'docker compose up -d'
```

### CI (`.github/workflows/ci.yml`)

```yaml
- uses: getsops/sops-installer@v1
- env:
    SOPS_AGE_KEY: ${{ secrets.SOPS_AGE_KEY }}
  run: |
    sops -d secrets/dev.enc.yaml > .env
    docker compose --env-file .env up -d --build
```

`SOPS_AGE_KEY` is a GitHub Actions repo secret containing the private age key. **NOT** the file path — the key contents themselves.

### Production

The production cluster pulls `secrets/prod.enc.yaml`, decrypts it with the cluster's age key (stored in the secret manager: AWS Secrets Manager, Vault, or k8s sealed-secrets — pick one in deployment phase), and exposes the values as env vars to each container.

## Rotation runbooks

### JWT_SECRET

**Trigger**: scheduled (every 90 days), suspected leak, or operator departure.

**Procedure** (zero-downtime version pending Phase 3.3 multi-key support; today it's brief downtime):

1. `JWT_SECRET_NEW=$(openssl rand -hex 32)`
2. `sops secrets/prod.enc.yaml` → set `JWT_SECRET` to the new value, save.
3. Deploy the new secret to one canary pod, observe; then roll-restart fleet.
4. **Effect**: all outstanding access tokens become invalid immediately. Users must re-authenticate. Refresh tokens issued before rotation are also invalidated, so this is a forced logout. Schedule for off-peak.

Phase 3.3 backlog item "multi-key JWT verification" will remove the downtime.

### MFA_ENVELOPE_KEY

**Trigger**: never electively — only on confirmed compromise. Losing this OR rotating it without a planned re-enrolment **invalidates every user's MFA enrolment** (the encrypted secrets become unreadable). They have to re-pair their authenticator apps.

**Procedure**:
1. Set `MFA_ENVELOPE_KEY_NEW = Fernet.generate_key().decode()`.
2. Send an email to every user with `mfa_enabled=True` warning of the forced re-enrolment.
3. Replace `MFA_ENVELOPE_KEY` in `secrets/prod.enc.yaml`, deploy.
4. On next login the user's stored `mfa_secret` decryption fails → app responds 400 "MFA reset required, please re-enrol" → frontend takes them through `/setup` again.

The forced-re-enrolment UX is currently a "user is locked out and contacts support" — improving it is a Phase 3.5 follow-up.

### ANTHROPIC_API_KEY / OPENAI_API_KEY

**Trigger**: scheduled (every 90 days) or if the key shows up in a leak.

1. Generate a new key in the provider's console.
2. `sops secrets/prod.enc.yaml` → swap in the new key, save.
3. Deploy. AI tutor immediately starts using the new key.
4. Revoke the old key in the provider's console.

Zero-downtime: the SDK reads the env var per-request, so deploying the new value is the only step needed.

### STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET

Same shape as Anthropic — generate in Stripe dashboard, swap, deploy, revoke old.

Note: webhook secret rotation requires updating the webhook endpoint's signing secret in Stripe dashboard *before* the deploy, otherwise inflight webhooks during rollover will fail signature verification. Plan a 15-min maintenance window OR run dual webhook validation for the rollover period.

### SMTP_PASSWORD

Same shape. After rotation, send a test email through the app to confirm.

### DB_PASSWORD

**Trigger**: scheduled every 180 days, on operator departure, or on compromise.

1. Create a new Postgres role with the new password OR `ALTER USER eureka PASSWORD '<new>';`
2. Update `secrets/prod.enc.yaml`, deploy.
3. Run a connection-test through the api-core's `/health/db` endpoint (TODO: build this in Phase 3.4b).

For zero-downtime, run dual-credentials for the rollover window: keep the old password valid until the new pods come up, then expire it.

## Allowlist for gitleaks

The gitleaks job in CI (Session 3.2) uses [`.gitleaks.toml`](../.gitleaks.toml) to allow:
- Documentation placeholder strings (e.g. `your-key-here`, `sk-ant-your-...`)
- Files under `docs/archive/` (historical session reports)
- SOPS-encrypted files (their ciphertext looks high-entropy)

If you add a new placeholder pattern to a `.env.example`, update `.gitleaks.toml` to match. Don't suppress a real finding — rotate the credential.

## Pre-commit hook (optional)

Operators who want the strictest guarantee can install gitleaks pre-commit:

```bash
brew install gitleaks pre-commit
cat > .pre-commit-config.yaml <<'EOF'
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks
EOF
pre-commit install
```

Not part of the repo's default config because it's an operator preference, not a project rule.

## What's still on the BACKLOG

- **CI step that loads SOPS for the docker-build job**: today the build doesn't need real secrets (it doesn't run the app). When we add integration tests that exercise real Anthropic / Stripe in CI, we'll wire `SOPS_AGE_KEY` in.
- **Zero-downtime JWT rotation**: tracked in Session 3.3 BACKLOG.
- **MFA forced-re-enrolment UX**: see above.
- **Periodic-rotation reminder bot**: maybe a GitHub Action that opens an issue 7 days before a 90-day rotation deadline.
- **Per-environment age recipient**: today the template uses one placeholder for all three envs. In production, each env should have its own recipient list (so a staging compromise doesn't expose prod).
