-- ============================================================================
-- Phase 13 — Platform integrations + extensibility
--
-- 13.1 API keys (per-user / per-org, scoped, rate-limited)
-- 13.2 Webhook system (subscriptions, deliveries, signing, retries)
-- 13.3 Embed SDK (signed embed tokens for iframe widgets)
-- 13.4 OAuth 2.0 third-party app registry + grants
-- 13.5 Compliance: audit log + GDPR/FERPA exports + deletion requests
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE api_key_status AS ENUM ('active', 'revoked', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE webhook_delivery_status AS ENUM (
        'queued', 'sent', 'delivered', 'failed', 'abandoned'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE oauth_app_status AS ENUM ('pending', 'approved', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE compliance_export_status AS ENUM (
        'queued', 'processing', 'ready', 'expired', 'failed'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE compliance_delete_status AS ENUM (
        'requested', 'scheduled', 'executed', 'canceled'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE audit_severity AS ENUM ('info', 'warn', 'critical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ---------------------------------------------------------------------------
-- 13.1 API keys
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS api_keys (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- key id is shown to clients ("eur_pk_xxxx"); the secret half is hashed.
    key_id          VARCHAR(40) NOT NULL UNIQUE,
    -- bcrypt/argon2 hash of the secret half
    hashed_secret   VARCHAR(255) NOT NULL,
    -- owner: a user OR an org. exactly one must be non-null.
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    org_id          UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name            VARCHAR(120) NOT NULL,
    description     TEXT,
    scopes          TEXT[] NOT NULL DEFAULT '{}',
    -- '{}' means default tier (60 req/min); 0 disables rate limit (admin only).
    rate_limit_per_min INTEGER NOT NULL DEFAULT 60 CHECK (rate_limit_per_min >= 0),
    status          api_key_status NOT NULL DEFAULT 'active',
    last_used_at    TIMESTAMP WITH TIME ZONE,
    expires_at      TIMESTAMP WITH TIME ZONE,
    revoked_at      TIMESTAMP WITH TIME ZONE,
    revoked_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT api_key_one_owner CHECK (
        (user_id IS NOT NULL)::int + (org_id IS NOT NULL)::int = 1
    )
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_api_keys_org ON api_keys(org_id) WHERE status = 'active';


CREATE TABLE IF NOT EXISTS api_key_usage_log (
    id            BIGSERIAL PRIMARY KEY,
    key_id        VARCHAR(40) NOT NULL,
    method        VARCHAR(10) NOT NULL,
    path          VARCHAR(500) NOT NULL,
    status_code   INTEGER NOT NULL,
    ms            INTEGER,
    occurred_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_apikey_log_key_time ON api_key_usage_log(key_id, occurred_at DESC);


-- ---------------------------------------------------------------------------
-- 13.2 Webhook system
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS webhook_endpoints (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    org_id          UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name            VARCHAR(120) NOT NULL,
    url             VARCHAR(500) NOT NULL,
    -- HMAC-SHA256 signing secret (hex)
    signing_secret  VARCHAR(120) NOT NULL,
    -- event names this endpoint wants. wildcard "*" = all.
    subscribed_events TEXT[] NOT NULL DEFAULT '{*}',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    last_success_at TIMESTAMP WITH TIME ZONE,
    last_failure_at TIMESTAMP WITH TIME ZONE,
    consecutive_failures INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT webhook_one_owner CHECK (
        (user_id IS NOT NULL)::int + (org_id IS NOT NULL)::int = 1
    )
);

CREATE INDEX IF NOT EXISTS idx_webhook_active ON webhook_endpoints(is_active);
CREATE INDEX IF NOT EXISTS idx_webhook_user ON webhook_endpoints(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_org ON webhook_endpoints(org_id);


CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    endpoint_id     UUID NOT NULL REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
    event           VARCHAR(80) NOT NULL,
    payload         JSONB NOT NULL,
    -- HMAC-SHA256(signing_secret, payload) hex
    signature       VARCHAR(80) NOT NULL,
    status          webhook_delivery_status NOT NULL DEFAULT 'queued',
    attempt_n       INTEGER NOT NULL DEFAULT 0,
    last_status_code INTEGER,
    last_response_excerpt TEXT,
    next_retry_at   TIMESTAMP WITH TIME ZONE,
    queued_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    sent_at         TIMESTAMP WITH TIME ZONE,
    delivered_at    TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_deliveries_endpoint ON webhook_deliveries(endpoint_id, queued_at DESC);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON webhook_deliveries(status, next_retry_at);


-- ---------------------------------------------------------------------------
-- 13.3 Embed SDK — signed embed tokens for iframe widgets
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS embed_tokens (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    org_id          UUID REFERENCES organizations(id) ON DELETE CASCADE,
    -- The widget being embedded: "leaderboard" | "question" | "course_card" | "study_plan"
    widget_kind     VARCHAR(60) NOT NULL,
    -- Optional parameters: {"course_id": "...", "skill_code": "..."}
    params          JSONB NOT NULL DEFAULT '{}',
    -- domains permitted to host this embed (CSP frame-ancestors)
    allowed_origins TEXT[] NOT NULL DEFAULT '{}',
    -- token_hash is sha256(token); the token itself is only returned at create-time
    token_hash      VARCHAR(80) NOT NULL UNIQUE,
    expires_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked_at      TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_embed_active ON embed_tokens(expires_at) WHERE revoked_at IS NULL;


-- ---------------------------------------------------------------------------
-- 13.4 OAuth 2.0 third-party app registry
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS oauth_apps (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Developer organization or user who registered the app
    owner_org_id      UUID REFERENCES organizations(id) ON DELETE SET NULL,
    owner_user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    name              VARCHAR(120) NOT NULL,
    description       TEXT,
    homepage_url      VARCHAR(500),
    logo_url          VARCHAR(500),
    -- shown to clients as ?client_id=...
    client_id         VARCHAR(80) NOT NULL UNIQUE,
    hashed_client_secret VARCHAR(255) NOT NULL,
    redirect_uris     TEXT[] NOT NULL DEFAULT '{}',
    allowed_scopes    TEXT[] NOT NULL DEFAULT '{}',
    status            oauth_app_status NOT NULL DEFAULT 'pending',
    -- Number of users who have granted this app access.
    grant_count       INTEGER NOT NULL DEFAULT 0,
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    approved_at       TIMESTAMP WITH TIME ZONE,
    approved_by       UUID REFERENCES users(id) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS oauth_grants (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id          UUID NOT NULL REFERENCES oauth_apps(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    granted_scopes  TEXT[] NOT NULL DEFAULT '{}',
    -- hash of the long-lived refresh token; access tokens are short-lived JWTs
    refresh_token_hash VARCHAR(80) UNIQUE,
    revoked_at      TIMESTAMP WITH TIME ZONE,
    last_used_at    TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_app_user_grant UNIQUE (app_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_oauth_grant_user ON oauth_grants(user_id) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_oauth_grant_app ON oauth_grants(app_id) WHERE revoked_at IS NULL;


-- ---------------------------------------------------------------------------
-- 13.5 Compliance — audit log, GDPR exports, deletion requests
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS audit_events (
    id              BIGSERIAL PRIMARY KEY,
    -- Actor + subject can both be null (system actions).
    actor_user_id   UUID REFERENCES users(id) ON DELETE SET NULL,
    subject_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    org_id          UUID REFERENCES organizations(id) ON DELETE SET NULL,
    -- e.g. "user.login", "user.password.change", "user.role.change",
    -- "compliance.export.request", "compliance.delete.request",
    -- "api_key.create", "api_key.revoke", "webhook.delivery.failed",
    -- "instructor.suspend", "content.takedown"
    event_name      VARCHAR(120) NOT NULL,
    severity        audit_severity NOT NULL DEFAULT 'info',
    request_ip      VARCHAR(45),
    user_agent      VARCHAR(500),
    metadata        JSONB NOT NULL DEFAULT '{}',
    occurred_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_events(actor_user_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_subject ON audit_events(subject_user_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_event_name ON audit_events(event_name, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_org ON audit_events(org_id, occurred_at DESC);


CREATE TABLE IF NOT EXISTS compliance_exports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status          compliance_export_status NOT NULL DEFAULT 'queued',
    -- All data scoped to this user. Each section is built lazily.
    -- Sections requested: ["profile","attempts","mastery","tickets","invoices",...]
    sections        TEXT[] NOT NULL DEFAULT '{}',
    payload_jsonb   JSONB,
    -- S3 / MinIO key when payload is large enough to need streaming download
    download_url    VARCHAR(500),
    requested_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMP WITH TIME ZONE,
    expires_at      TIMESTAMP WITH TIME ZONE,
    error_message   TEXT
);

CREATE INDEX IF NOT EXISTS idx_exports_user ON compliance_exports(user_id, requested_at DESC);


CREATE TABLE IF NOT EXISTS compliance_deletions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    requested_by    UUID REFERENCES users(id) ON DELETE SET NULL,
    status          compliance_delete_status NOT NULL DEFAULT 'requested',
    reason          TEXT,
    -- Hard delete after N days unless canceled.
    scheduled_for   TIMESTAMP WITH TIME ZONE NOT NULL,
    executed_at     TIMESTAMP WITH TIME ZONE,
    canceled_at     TIMESTAMP WITH TIME ZONE,
    canceled_reason TEXT,
    requested_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deletions_status ON compliance_deletions(status, scheduled_for);
