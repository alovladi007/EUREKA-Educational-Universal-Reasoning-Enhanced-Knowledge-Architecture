-- ============================================================================
-- Phase 6 — AI tutor depth (2026-05). Sessions 6.1–6.4.
--
-- Five tables:
--
--   knowledge_chunks       The RAG corpus. A retrievable text fragment
--                          (item stem, item explanation, skill description,
--                          imported content, etc.) with a pgvector
--                          embedding and a content-addressable source_uri
--                          that survives across re-ingestion.
--
--   agent_sessions         One row per conversation. Carries the active
--                          skill focus, the learner's hint_level state,
--                          and a snapshot of the system prompt used so
--                          we can reproduce/audit the conversation later.
--
--   agent_messages         Append-only message log per session.
--                          {role: user|assistant|tool, content, citations,
--                           tokens_in, tokens_out, model, ...}
--
--   agent_traces           Tool-use audit trail. One row per tool call,
--                          recording {tool_name, args, result, latency_ms,
--                           message_id}. Lets the UI render "show your work".
--
--   flagged_responses      Learner-reported potential hallucinations. SME
--                          triage queue.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- knowledge_chunks — the RAG corpus
-- ----------------------------------------------------------------------------
CREATE TYPE chunk_source_kind AS ENUM (
    'item_stem',
    'item_explanation',
    'skill_description',
    'imported_passage',
    'course_module',
    'web_excerpt'
);

CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_kind chunk_source_kind NOT NULL,
    -- Content-addressable URI so the citation can be dereferenced even
    -- after the underlying row is moved. Examples:
    --   urn:eureka:item:{item_id}:stem
    --   urn:eureka:item:{item_id}:explanation
    --   urn:eureka:skill:{framework}:{code}
    source_uri TEXT NOT NULL UNIQUE,
    -- Optional FK back to the originating row, when we want strong linkage.
    source_id UUID,
    -- The raw text the embedding was built over. Citations show learners
    -- this string.
    text TEXT NOT NULL,
    -- Loose tier/framework projection for filtering retrievals.
    tier VARCHAR(40),
    framework skill_framework,
    -- Skill the chunk most closely teaches (optional). When set, the
    -- retriever can boost chunks that match the active session focus.
    skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
    -- pgvector embedding (1024-dim, same model as item_embeddings).
    embedding vector(1024),
    text_hash VARCHAR(64) NOT NULL,
    -- Auditing / lifecycle
    license VARCHAR(80) NOT NULL DEFAULT 'EUREKA-Internal',
    attribution TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chunks_source_kind ON knowledge_chunks(source_kind);
CREATE INDEX IF NOT EXISTS idx_chunks_framework ON knowledge_chunks(framework);
CREATE INDEX IF NOT EXISTS idx_chunks_skill ON knowledge_chunks(skill_id);
CREATE INDEX IF NOT EXISTS idx_chunks_active ON knowledge_chunks(is_active)
    WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_chunks_text_fts
    ON knowledge_chunks USING gin (to_tsvector('english', text));
CREATE INDEX IF NOT EXISTS idx_chunks_embedding_hnsw
    ON knowledge_chunks USING hnsw (embedding vector_cosine_ops);

-- ----------------------------------------------------------------------------
-- agent_sessions — one per conversation
-- ----------------------------------------------------------------------------
CREATE TYPE agent_session_status AS ENUM (
    'active', 'paused', 'completed', 'abandoned'
);

CREATE TYPE agent_mode AS ENUM (
    'socratic',  -- ask leading questions, hint ladder
    'direct',    -- straight answer (learner explicitly asked)
    'practice'   -- present an item, grade, explain
);

CREATE TABLE IF NOT EXISTS agent_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
    item_id UUID REFERENCES items(id) ON DELETE SET NULL,
    mode agent_mode NOT NULL DEFAULT 'socratic',
    status agent_session_status NOT NULL DEFAULT 'active',
    -- 0 = no hint given yet; 1 = nudge; 2 = partial; 3 = full reveal.
    -- Drives the hint-ladder logic in 6.3.
    hint_level INTEGER NOT NULL DEFAULT 0 CHECK (hint_level >= 0 AND hint_level <= 3),
    -- Snapshot of system prompt / model used so reproductions are exact.
    model VARCHAR(80) NOT NULL DEFAULT 'claude-opus-4-7',
    system_prompt TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agent_sessions_user ON agent_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_skill ON agent_sessions(skill_id);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_active ON agent_sessions(user_id, status)
    WHERE status = 'active';

-- ----------------------------------------------------------------------------
-- agent_messages — append-only conversation log
-- ----------------------------------------------------------------------------
CREATE TYPE agent_role AS ENUM ('system', 'user', 'assistant', 'tool');

CREATE TABLE IF NOT EXISTS agent_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES agent_sessions(id) ON DELETE CASCADE,
    role agent_role NOT NULL,
    content TEXT NOT NULL,
    -- For tool messages: the tool_name + args + result are mirrored into
    -- agent_traces below. content here is a human-readable summary.
    -- For assistant messages: citations is a list of {chunk_id, span_start,
    -- span_end} so the UI can render "[ref:Anatomy 2.4]" links.
    citations JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- Anti-hallucination 6.4 — what fraction of factual claims trace to
    -- a retrieved chunk. 1.0 = fully grounded; <0.7 = warn the learner.
    groundedness_score NUMERIC(3, 2),
    tokens_in INTEGER,
    tokens_out INTEGER,
    model VARCHAR(80),
    latency_ms INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agent_messages_session
    ON agent_messages(session_id, created_at);

-- ----------------------------------------------------------------------------
-- agent_traces — tool-call audit trail
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS agent_traces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES agent_sessions(id) ON DELETE CASCADE,
    message_id UUID REFERENCES agent_messages(id) ON DELETE CASCADE,
    tool_name VARCHAR(80) NOT NULL,
    args JSONB NOT NULL DEFAULT '{}'::jsonb,
    result JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- Whether the tool call succeeded. False → the tutor saw an error
    -- and (hopefully) recovered.
    ok BOOLEAN NOT NULL DEFAULT TRUE,
    error TEXT,
    latency_ms INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agent_traces_session ON agent_traces(session_id);
CREATE INDEX IF NOT EXISTS idx_agent_traces_tool ON agent_traces(tool_name);

-- ----------------------------------------------------------------------------
-- flagged_responses — anti-hallucination SME triage queue (6.4)
-- ----------------------------------------------------------------------------
CREATE TYPE flag_kind AS ENUM (
    'hallucination', 'incorrect_explanation', 'biased', 'off_topic',
    'unsafe', 'low_groundedness', 'other'
);

CREATE TYPE flag_status AS ENUM (
    'open', 'triaged', 'confirmed', 'rejected', 'fixed'
);

CREATE TABLE IF NOT EXISTS flagged_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES agent_messages(id) ON DELETE CASCADE,
    reporter_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    kind flag_kind NOT NULL,
    learner_note TEXT,
    -- SME triage fields
    status flag_status NOT NULL DEFAULT 'open',
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    sme_resolution TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_flagged_status ON flagged_responses(status)
    WHERE status IN ('open', 'triaged');
CREATE INDEX IF NOT EXISTS idx_flagged_reporter ON flagged_responses(reporter_user_id);
