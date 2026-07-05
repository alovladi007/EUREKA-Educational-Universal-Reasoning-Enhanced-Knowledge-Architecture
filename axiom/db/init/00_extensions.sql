-- Enable pgvector at database creation time so later phases (the copilot
-- retrieval store) can create vector columns without a manual step. Phase 0
-- does not use vector columns yet; this just makes the extension available.
CREATE EXTENSION IF NOT EXISTS vector;
