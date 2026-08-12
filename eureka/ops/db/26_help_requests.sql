-- Help requests: what the in-app helper could not answer.
--
-- The helper (services/api-core/app/services/help_service.py) answers from a
-- registry of what the platform actually does, and escalates anything it
-- cannot match or must not decide (billing, account removal, another user's
-- data, security). Escalation writes a row here.
--
-- WHY A TABLE AND NOT AN EMAIL
--
-- An escalation that only sends mail is invisible the moment the mailbox is
-- busy, and nobody can answer "how many people are stuck on this?". A row is
-- countable: the same table tells an administrator what is outstanding and
-- tells whoever maintains the registry which questions keep arriving, which is
-- the signal for what to document next.
--
-- The unanswered ones are the product feedback. `topic_keys` records what the
-- helper matched (possibly nothing), so a cluster of requests that all matched
-- the same topic means that topic's help text is wrong rather than missing.

CREATE TABLE IF NOT EXISTS help_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    -- What they asked, verbatim. Not normalised: the exact wording is the
    -- most useful thing here for whoever writes the missing help.
    question        TEXT        NOT NULL,
    -- The page they were on. A question is often only intelligible with it.
    page_path       VARCHAR(500),
    -- Topic keys the helper matched before giving up, comma separated. Empty
    -- means it matched nothing at all.
    topic_keys      VARCHAR(500) NOT NULL DEFAULT '',
    -- Why it escalated: 'no_match' or 'policy' (a decision a human must make).
    reason          VARCHAR(32) NOT NULL DEFAULT 'no_match',
    status          VARCHAR(24) NOT NULL DEFAULT 'open',
    -- What an administrator did about it. Shown back to the requester.
    resolution      TEXT,
    resolved_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_help_requests_status_created
    ON help_requests (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_help_requests_user
    ON help_requests (user_id);
