-- Test-prep exam attempts -------------------------------------------------
--
-- Durable home for completed client-side practice exams (FE_EE, MCAT, LSAT,
-- CISSP, Patent Bar, ...). These were localStorage-only, so a browser clear
-- wiped a learner's exam history and it never synced across devices. api-core
-- exposes POST /exam-attempts + GET /exam-attempts/me over this table.
--
-- Distinct from `attempt_logs` (single-item practice) and `mock_attempts`
-- (server-generated mock exams from a blueprint): this records a SUMMARY of a
-- full client-side exam the FE scored itself.

CREATE TABLE IF NOT EXISTS user_exam_attempts (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exam_type          VARCHAR(50) NOT NULL,          -- FE_EE | MCAT | LSAT | CISSP | ...
    score_percent      NUMERIC(5,2) NOT NULL DEFAULT 0,
    passed             BOOLEAN NOT NULL DEFAULT FALSE,
    correct_count      INTEGER NOT NULL DEFAULT 0,
    total_questions    INTEGER NOT NULL DEFAULT 0,
    time_spent_seconds INTEGER,
    by_topic           JSONB,                          -- { "<topic>": { correct, total } }
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_user_exam_attempts_user_exam
    ON user_exam_attempts (user_id, exam_type, created_at DESC);
