-- ============================================================================
-- Phase 11 — Go-to-market readiness
--
-- 11.1 Billing maturity: subscriptions, invoices, refunds, dunning, tax
-- 11.2 Programmatic SEO: per-skill landing-page metadata + JSON-LD
-- 11.3 Email lifecycle: templates, campaigns, sends, unsubscribes
-- 11.4 Onboarding state machine
-- 11.5 Support tickets + knowledge base
-- ============================================================================

-- ---------------------------------------------------------------------------
-- enums
-- ---------------------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE subscription_interval AS ENUM ('monthly', 'yearly');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM (
        'trialing', 'active', 'past_due', 'canceled', 'expired', 'unpaid'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE invoice_status AS ENUM ('open', 'paid', 'void', 'uncollectible');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE refund_status AS ENUM ('pending', 'succeeded', 'failed', 'canceled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE dunning_outcome AS ENUM ('queued', 'in_progress', 'paid', 'failed', 'abandoned');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE email_send_status AS ENUM (
        'queued', 'sent', 'delivered', 'bounced', 'failed', 'opened', 'clicked', 'unsubscribed'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE onboarding_step AS ENUM (
        'created', 'tier_selected', 'goal_set', 'placement_taken',
        'first_recommendation_shown', 'first_question_attempted',
        'first_session_complete', 'fully_onboarded'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM (
        'open', 'awaiting_user', 'awaiting_team', 'resolved', 'closed'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE ticket_priority AS ENUM ('low', 'normal', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE ticket_category AS ENUM (
        'billing', 'account', 'content_issue', 'bug', 'feature_request',
        'safety', 'institutional', 'other'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ---------------------------------------------------------------------------
-- 11.1  Billing maturity
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS subscription_plans (
    id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug                     VARCHAR(60) NOT NULL UNIQUE,
    name                     VARCHAR(120) NOT NULL,
    description              TEXT,
    interval                 subscription_interval NOT NULL,
    price_cents              INTEGER NOT NULL CHECK (price_cents >= 0),
    currency                 VARCHAR(3) NOT NULL DEFAULT 'USD',
    trial_days               INTEGER NOT NULL DEFAULT 0 CHECK (trial_days >= 0),
    -- Feature flags this plan unlocks
    includes_marketplace_access BOOLEAN NOT NULL DEFAULT FALSE,
    includes_unlimited_courses  BOOLEAN NOT NULL DEFAULT FALSE,
    includes_ai_tutor           BOOLEAN NOT NULL DEFAULT FALSE,
    includes_mock_exams         BOOLEAN NOT NULL DEFAULT FALSE,
    perks                    TEXT[] DEFAULT '{}',
    stripe_price_id          VARCHAR(80),
    is_active                BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order               INTEGER NOT NULL DEFAULT 0,
    created_at               TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_plans_active ON subscription_plans(is_active, sort_order);


CREATE TABLE IF NOT EXISTS subscriptions (
    id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id                  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id                  UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE RESTRICT,
    status                   subscription_status NOT NULL DEFAULT 'trialing',
    current_period_start     TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end       TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end     BOOLEAN NOT NULL DEFAULT FALSE,
    canceled_at              TIMESTAMP WITH TIME ZONE,
    trial_end                TIMESTAMP WITH TIME ZONE,
    stripe_subscription_id   VARCHAR(80),
    stripe_customer_id       VARCHAR(80),
    created_at               TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- A user may only have one *active* subscription at a time.
CREATE UNIQUE INDEX IF NOT EXISTS uq_one_active_subscription_per_user
    ON subscriptions(user_id) WHERE status IN ('trialing', 'active', 'past_due');
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);


CREATE TABLE IF NOT EXISTS payment_methods (
    id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_pm_id       VARCHAR(80) NOT NULL UNIQUE,
    type               VARCHAR(40) NOT NULL DEFAULT 'card',
    brand              VARCHAR(40),
    last4              VARCHAR(8),
    exp_month          SMALLINT,
    exp_year           SMALLINT,
    is_default         BOOLEAN NOT NULL DEFAULT FALSE,
    detached_at        TIMESTAMP WITH TIME ZONE,
    created_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pm_user ON payment_methods(user_id) WHERE detached_at IS NULL;


CREATE TABLE IF NOT EXISTS invoices (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id       UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    -- Cross-reference to a marketplace purchase if this invoice covers one.
    -- Loose FK on purpose so we don't create a circular dependency on Phase 10.
    purchase_id           UUID,
    currency              VARCHAR(3) NOT NULL DEFAULT 'USD',
    subtotal_cents        INTEGER NOT NULL DEFAULT 0,
    discount_cents        INTEGER NOT NULL DEFAULT 0,
    tax_cents             INTEGER NOT NULL DEFAULT 0,
    total_cents           INTEGER NOT NULL DEFAULT 0,
    amount_paid_cents     INTEGER NOT NULL DEFAULT 0,
    status                invoice_status NOT NULL DEFAULT 'open',
    period_start          TIMESTAMP WITH TIME ZONE,
    period_end            TIMESTAMP WITH TIME ZONE,
    issued_at             TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    paid_at               TIMESTAMP WITH TIME ZONE,
    voided_at             TIMESTAMP WITH TIME ZONE,
    hosted_url            VARCHAR(500),
    pdf_url               VARCHAR(500),
    stripe_invoice_id     VARCHAR(80),
    line_items            JSONB NOT NULL DEFAULT '[]',
    created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_user_status ON invoices(user_id, status, issued_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_subscription ON invoices(subscription_id);


CREATE TABLE IF NOT EXISTS refunds (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id          UUID REFERENCES invoices(id) ON DELETE SET NULL,
    purchase_id         UUID,           -- loose ref to marketplace_purchases
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount_cents        INTEGER NOT NULL CHECK (amount_cents > 0),
    currency            VARCHAR(3) NOT NULL DEFAULT 'USD',
    reason              VARCHAR(120),
    status              refund_status NOT NULL DEFAULT 'pending',
    stripe_refund_id    VARCHAR(80),
    requested_by        UUID REFERENCES users(id) ON DELETE SET NULL,
    refunded_at         TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refunds_user_status ON refunds(user_id, status);
CREATE INDEX IF NOT EXISTS idx_refunds_invoice ON refunds(invoice_id);


CREATE TABLE IF NOT EXISTS dunning_attempts (
    id            BIGSERIAL PRIMARY KEY,
    invoice_id    UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    attempt_n     INTEGER NOT NULL CHECK (attempt_n >= 1),
    attempted_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    outcome       dunning_outcome NOT NULL DEFAULT 'queued',
    next_retry_at TIMESTAMP WITH TIME ZONE,
    note          TEXT,
    CONSTRAINT uq_dunning_invoice_attempt UNIQUE (invoice_id, attempt_n)
);

CREATE INDEX IF NOT EXISTS idx_dunning_invoice ON dunning_attempts(invoice_id, attempt_n);


CREATE TABLE IF NOT EXISTS tax_rates (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_code   VARCHAR(2) NOT NULL,
    region_code    VARCHAR(8),                  -- e.g. 'CA', 'NY'; NULL = whole country
    rate_bps       INTEGER NOT NULL CHECK (rate_bps >= 0),   -- 875 = 8.75%
    label          VARCHAR(60) NOT NULL,
    inclusive      BOOLEAN NOT NULL DEFAULT FALSE,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to   DATE,
    UNIQUE (country_code, region_code, label, effective_from)
);

CREATE INDEX IF NOT EXISTS idx_tax_country_region ON tax_rates(country_code, region_code, effective_from);


-- ---------------------------------------------------------------------------
-- 11.2  Programmatic SEO (skill landing pages)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS skill_landing_pages (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_code          VARCHAR(120) NOT NULL,    -- mirror Phase 4.2 skills.code
    framework           VARCHAR(40) NOT NULL,
    slug                VARCHAR(160) NOT NULL UNIQUE,
    locale              VARCHAR(8) NOT NULL DEFAULT 'en',
    h1                  VARCHAR(240) NOT NULL,
    meta_title          VARCHAR(240) NOT NULL,
    meta_description    VARCHAR(320) NOT NULL,
    body_md             TEXT,
    faq                 JSONB NOT NULL DEFAULT '[]',   -- [{"q":..., "a":...}]
    schema_jsonld       JSONB NOT NULL DEFAULT '{}',
    canonical_url       VARCHAR(500),
    -- denormalised marketplace + tutor pointers
    related_listing_ids UUID[] DEFAULT '{}',
    related_item_ids    UUID[] DEFAULT '{}',
    is_published        BOOLEAN NOT NULL DEFAULT FALSE,
    last_generated_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (skill_code, framework, locale)
);

CREATE INDEX IF NOT EXISTS idx_seo_skill_published ON skill_landing_pages(is_published, framework);


-- ---------------------------------------------------------------------------
-- 11.3  Email lifecycle
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS email_templates (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug        VARCHAR(80) NOT NULL UNIQUE,
    kind        VARCHAR(40) NOT NULL,
    -- "welcome", "mastery_milestone", "win_back_7d", "win_back_30d",
    -- "payment_receipt", "payment_failed", "trial_ending", "cart_abandoned",
    -- "support_reply", "transactional"
    locale      VARCHAR(8) NOT NULL DEFAULT 'en',
    subject     VARCHAR(240) NOT NULL,
    -- Both stored; render-time engine picks based on multi-part content negotiation.
    html        TEXT NOT NULL,
    text        TEXT NOT NULL,
    description TEXT,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS email_campaigns (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug                VARCHAR(80) NOT NULL UNIQUE,
    template_slug       VARCHAR(80) NOT NULL,
    -- Triggered on this event name (matches event_dispatcher.dispatch(event, payload))
    trigger_event       VARCHAR(80) NOT NULL,
    -- Optional delay before firing, in minutes (for win-back, trial-ending etc.).
    delay_minutes       INTEGER NOT NULL DEFAULT 0,
    -- Optional learner filter (jsonb predicate). Empty = all users.
    filter_jsonb        JSONB NOT NULL DEFAULT '{}',
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_trigger ON email_campaigns(trigger_event, is_active);


CREATE TABLE IF NOT EXISTS email_sends (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID REFERENCES users(id) ON DELETE SET NULL,
    campaign_id         UUID REFERENCES email_campaigns(id) ON DELETE SET NULL,
    template_slug       VARCHAR(80) NOT NULL,
    to_email            VARCHAR(255) NOT NULL,
    subject             VARCHAR(240) NOT NULL,
    status              email_send_status NOT NULL DEFAULT 'queued',
    provider            VARCHAR(40),       -- 'resend', 'sendgrid', 'stub'
    provider_message_id VARCHAR(120),
    queued_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    sent_at             TIMESTAMP WITH TIME ZONE,
    delivered_at        TIMESTAMP WITH TIME ZONE,
    opened_at           TIMESTAMP WITH TIME ZONE,
    clicked_at          TIMESTAMP WITH TIME ZONE,
    bounced_at          TIMESTAMP WITH TIME ZONE,
    error_message       TEXT,
    -- The exact merge-payload at queue time, for replay/debugging.
    context_jsonb       JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_sends_user_status ON email_sends(user_id, status);
CREATE INDEX IF NOT EXISTS idx_sends_campaign ON email_sends(campaign_id, queued_at DESC);


CREATE TABLE IF NOT EXISTS email_unsubscribes (
    id                BIGSERIAL PRIMARY KEY,
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- "all" | "marketing" | "transactional" | a specific campaign slug
    scope             VARCHAR(80) NOT NULL,
    reason            TEXT,
    unsubscribed_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_unsub_user_scope UNIQUE (user_id, scope)
);


-- ---------------------------------------------------------------------------
-- 11.4  Onboarding state machine
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS onboarding_states (
    user_id              UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_step         onboarding_step NOT NULL DEFAULT 'created',
    chosen_tier          VARCHAR(40),
    chosen_exam          VARCHAR(80),
    chosen_goal          TEXT,
    target_date          DATE,
    -- Array of step values in order completed.
    step_history         JSONB NOT NULL DEFAULT '[]',
    -- The "first 15-minute experience" benchmark.
    started_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    first_recommendation_at  TIMESTAMP WITH TIME ZONE,
    first_attempt_at         TIMESTAMP WITH TIME ZONE,
    first_session_at         TIMESTAMP WITH TIME ZONE,
    completed_at         TIMESTAMP WITH TIME ZONE,
    updated_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS onboarding_events (
    id            BIGSERIAL PRIMARY KEY,
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    step          onboarding_step NOT NULL,
    -- "entered" | "completed" | "skipped"
    kind          VARCHAR(20) NOT NULL,
    extra         JSONB NOT NULL DEFAULT '{}',
    occurred_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_onboarding_events_user ON onboarding_events(user_id, occurred_at DESC);


-- ---------------------------------------------------------------------------
-- 11.5  Support tickets + knowledge base
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS support_tickets (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject         VARCHAR(240) NOT NULL,
    status          ticket_status NOT NULL DEFAULT 'open',
    priority        ticket_priority NOT NULL DEFAULT 'normal',
    category        ticket_category NOT NULL DEFAULT 'other',
    assigned_to     UUID REFERENCES users(id) ON DELETE SET NULL,
    last_user_reply_at TIMESTAMP WITH TIME ZONE,
    last_team_reply_at TIMESTAMP WITH TIME ZONE,
    resolved_at     TIMESTAMP WITH TIME ZONE,
    -- Optional reference to a Phase 10 report / purchase / invoice for context.
    related_kind    VARCHAR(40),
    related_id      UUID,
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status, priority, created_at);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON support_tickets(user_id, created_at DESC);


CREATE TABLE IF NOT EXISTS support_messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id       UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    author_id       UUID REFERENCES users(id) ON DELETE SET NULL,
    is_internal_note BOOLEAN NOT NULL DEFAULT FALSE,
    body_md         TEXT NOT NULL,
    attachments     JSONB NOT NULL DEFAULT '[]',
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_messages ON support_messages(ticket_id, created_at);


CREATE TABLE IF NOT EXISTS kb_articles (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug          VARCHAR(160) NOT NULL UNIQUE,
    title         VARCHAR(240) NOT NULL,
    summary       TEXT,
    body_md       TEXT NOT NULL,
    category      VARCHAR(60) NOT NULL DEFAULT 'general',
    tags          TEXT[] DEFAULT '{}',
    locale        VARCHAR(8) NOT NULL DEFAULT 'en',
    is_published  BOOLEAN NOT NULL DEFAULT FALSE,
    view_count    INTEGER NOT NULL DEFAULT 0,
    helpful_count INTEGER NOT NULL DEFAULT 0,
    not_helpful_count INTEGER NOT NULL DEFAULT 0,
    search_tsv    TSVECTOR,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kb_search ON kb_articles USING GIN(search_tsv);
CREATE INDEX IF NOT EXISTS idx_kb_published ON kb_articles(is_published, category);

-- Auto-maintain the tsvector.
CREATE OR REPLACE FUNCTION kb_search_refresh() RETURNS TRIGGER AS $$
BEGIN
    NEW.search_tsv := to_tsvector('english',
        coalesce(NEW.title, '') || ' ' ||
        coalesce(NEW.summary, '') || ' ' ||
        coalesce(NEW.body_md, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_kb_search_refresh ON kb_articles;
CREATE TRIGGER trg_kb_search_refresh
    BEFORE INSERT OR UPDATE OF title, summary, body_md ON kb_articles
    FOR EACH ROW EXECUTE FUNCTION kb_search_refresh();


-- Touch-trigger for updated_at columns (reuses touch_updated_at from Phase 10).
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'touch_updated_at'
    ) THEN
        CREATE FUNCTION touch_updated_at()
        RETURNS TRIGGER AS $f$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $f$ LANGUAGE plpgsql;
    END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_subscriptions_touch ON subscriptions;
CREATE TRIGGER trg_subscriptions_touch
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_email_templates_touch ON email_templates;
CREATE TRIGGER trg_email_templates_touch
    BEFORE UPDATE ON email_templates
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_landing_pages_touch ON skill_landing_pages;
CREATE TRIGGER trg_landing_pages_touch
    BEFORE UPDATE ON skill_landing_pages
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_onboarding_touch ON onboarding_states;
CREATE TRIGGER trg_onboarding_touch
    BEFORE UPDATE ON onboarding_states
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_tickets_touch ON support_tickets;
CREATE TRIGGER trg_tickets_touch
    BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_kb_touch ON kb_articles;
CREATE TRIGGER trg_kb_touch
    BEFORE UPDATE ON kb_articles
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
