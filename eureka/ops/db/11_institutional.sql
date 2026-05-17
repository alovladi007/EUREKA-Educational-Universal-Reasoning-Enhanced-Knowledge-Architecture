-- ============================================================================
-- Phase 9 — Institutional / B2B (2026-05). Sessions 9.1–9.4.
--
-- Six tables. Each `organizations` row is an "institution"; this layer
-- adds the operational surface schools / bootcamps / residency programs
-- need to actually use the platform.
--
--   cohorts                Groups of learners managed together (a class,
--                          a residency intake, a USMLE Step 1 group).
--                          One institution can have many cohorts; one
--                          learner can be in many cohorts.
--
--   cohort_memberships     Many-to-many (user, cohort, role). Roles:
--                          'learner', 'instructor', 'observer'.
--
--   cohort_blueprints      Which exam blueprints a cohort is targeting.
--                          Drives the "at-risk" calculation by giving us
--                          a reference for "are they on track?"
--
--   sso_idp_configs        Per-organization SSO config. One IdP (or N
--                          for the bigger institutions). Holds the
--                          discovery URL + client_id + (encrypted)
--                          client_secret + attribute mapping.
--
--   lti_platforms          Per-organization LTI 1.3 platform config.
--                          {issuer, client_id, deployment_id, auth_url,
--                          token_url, jwks_url}.
--
--   lti_keys               Our OWN JWK keypair used to sign LTI tokens.
--                          We rotate; old keys stay registered for
--                          verification of in-flight tokens.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- cohorts
-- ----------------------------------------------------------------------------
CREATE TYPE cohort_status AS ENUM (
    'planning', 'active', 'paused', 'completed', 'archived'
);

CREATE TABLE IF NOT EXISTS cohorts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    slug VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    -- Free-form metadata e.g. {program: "USMLE Step 1 prep — fall 2027",
    -- expected_size: 40, cohort_lead_email: "..."}.
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    status cohort_status NOT NULL DEFAULT 'planning',
    starts_at TIMESTAMP,
    ends_at TIMESTAMP,

    -- Operational targets — feed into at-risk early-warning (9.3).
    -- target_skill_codes: which skills the cohort is supposed to master.
    -- target_mastery: the threshold (default 0.85).
    target_skill_codes TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    target_mastery NUMERIC(3, 2) NOT NULL DEFAULT 0.85,
    -- min_weekly_attempts: 0 means we don't track engagement here.
    min_weekly_attempts INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT cohort_slug_per_org UNIQUE (org_id, slug),
    CONSTRAINT valid_cohort_slug CHECK (slug ~ '^[a-z0-9][a-z0-9-]*$')
);

CREATE INDEX IF NOT EXISTS idx_cohorts_org ON cohorts(org_id);
CREATE INDEX IF NOT EXISTS idx_cohorts_status ON cohorts(status);

-- ----------------------------------------------------------------------------
-- cohort_memberships
-- ----------------------------------------------------------------------------
CREATE TYPE cohort_role AS ENUM ('learner', 'instructor', 'observer');

CREATE TABLE IF NOT EXISTS cohort_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cohort_id UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role cohort_role NOT NULL DEFAULT 'learner',
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    CONSTRAINT uq_cohort_user_role UNIQUE (cohort_id, user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_cohort_memberships_user ON cohort_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_cohort_memberships_active
    ON cohort_memberships(cohort_id) WHERE left_at IS NULL;

-- ----------------------------------------------------------------------------
-- cohort_blueprints — which exam blueprints a cohort targets
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cohort_blueprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cohort_id UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
    blueprint_id UUID NOT NULL REFERENCES exam_blueprints(id) ON DELETE CASCADE,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    target_date TIMESTAMP,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_cohort_blueprint UNIQUE (cohort_id, blueprint_id)
);

-- ----------------------------------------------------------------------------
-- sso_idp_configs — per-org SSO (9.4)
-- ----------------------------------------------------------------------------
CREATE TYPE sso_protocol AS ENUM ('oidc', 'saml', 'google_workspace');

CREATE TABLE IF NOT EXISTS sso_idp_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    protocol sso_protocol NOT NULL,

    -- OIDC fields (most-used). discovery_url lets us pull the metadata
    -- (auth_url, token_url, jwks_url, etc.) lazily.
    issuer TEXT,
    discovery_url TEXT,
    client_id TEXT,
    -- Fernet-encrypted secret. Same envelope key as MFA (settings.MFA_ENVELOPE_KEY)
    -- — we treat the SSO secret with the same care as other auth secrets.
    client_secret_encrypted TEXT,

    -- SAML fields (sketch only — full SAML is Phase 9.4b).
    saml_entity_id TEXT,
    saml_metadata_xml TEXT,

    -- Attribute mapping: which IdP claim becomes which EUREKA field.
    -- {email: "email", first_name: "given_name", last_name: "family_name",
    --  role: "groups"} — etc.
    attribute_mapping JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Default role for users JIT-provisioned via this IdP.
    default_role VARCHAR(40) NOT NULL DEFAULT 'student',
    -- Auto-provision new users on first login?
    just_in_time_provisioning BOOLEAN NOT NULL DEFAULT TRUE,
    -- Auto-add to cohort_id on JIT provision (NULL = no auto-add).
    auto_enroll_cohort_id UUID REFERENCES cohorts(id) ON DELETE SET NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sso_org ON sso_idp_configs(org_id) WHERE is_active = TRUE;

-- ----------------------------------------------------------------------------
-- lti_platforms — per-org LTI 1.3 Platform registration (9.2)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lti_platforms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    -- LTI 1.3 identifiers from the host LMS.
    issuer TEXT NOT NULL,
    client_id TEXT NOT NULL,
    deployment_id TEXT NOT NULL,
    -- Standard LTI 1.3 platform endpoints.
    auth_login_url TEXT NOT NULL,
    auth_token_url TEXT NOT NULL,
    auth_token_aud TEXT,  -- if the LMS expects a non-standard audience
    jwks_url TEXT NOT NULL,
    -- Which cohort does this platform map to (so launches go to the
    -- right group). Optional.
    target_cohort_id UUID REFERENCES cohorts(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT uq_lti_platform UNIQUE (issuer, client_id, deployment_id)
);

CREATE INDEX IF NOT EXISTS idx_lti_platforms_org ON lti_platforms(org_id) WHERE is_active = TRUE;

-- ----------------------------------------------------------------------------
-- lti_keys — our (Tool) RSA keypair for signing JWTs to the Platform.
--
-- Per LTI 1.3, we publish a JWKS at /lti/.well-known/jwks.json. Multiple
-- keys may exist (one active for new signatures, older ones still
-- published for in-flight token verification).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lti_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kid VARCHAR(120) NOT NULL UNIQUE,  -- "key id" in the JWKS
    algorithm VARCHAR(40) NOT NULL DEFAULT 'RS256',
    public_pem TEXT NOT NULL,
    -- Fernet-encrypted private key
    private_pem_encrypted TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    rotated_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lti_keys_active ON lti_keys(is_active) WHERE is_active = TRUE;
