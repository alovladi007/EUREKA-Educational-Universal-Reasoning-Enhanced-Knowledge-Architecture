-- XR Labs: experiences + sessions ------------------------------------------
--
-- Backs /dashboard/xr-labs/experience/[id], which previously targeted a
-- non-existent standalone XR service (:3005/api/xr). The viewer now reads
-- these via api-core (/api/v1/xr/*). Scene-builder + asset-library remain a
-- separate, future build.
--
-- The xr_experiences/xr_sessions tables are otherwise created only by the
-- profile-gated `xr-labs` service, so on a default boot they'd be missing and
-- the api-core /xr endpoints would 500. Defining them here (IF NOT EXISTS,
-- matching the existing column shape) makes them part of the always-on schema.
-- Idempotent: tables use IF NOT EXISTS; the demo seed only runs when the table
-- is empty; the scene_url backfill only touches rows missing a scene.

CREATE TABLE IF NOT EXISTS xr_experiences (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title                VARCHAR(255) NOT NULL,
    description          TEXT,
    category             VARCHAR(100),
    difficulty           VARCHAR(50),
    duration_minutes     INTEGER,
    thumbnail_url        TEXT,
    scene_url            TEXT,
    interaction_type     VARCHAR(100),
    learning_objectives  TEXT[],
    prerequisites        TEXT[],
    tags                 TEXT[],
    is_published         BOOLEAN DEFAULT FALSE,
    avg_rating           NUMERIC DEFAULT 0.00,
    rating_count         INTEGER DEFAULT 0,
    usage_count          INTEGER DEFAULT 0,
    created_by           UUID,
    -- XR-1 (authoring loop): scene-builder scenes are JSON scene graphs, not
    -- glTF files. Publish copies the project's scene_data here so the viewer
    -- can render it; source_project_id links back to the authoring project.
    scene_data           JSONB,
    source_project_id    UUID,
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS ix_xr_experiences_published ON xr_experiences (is_published);
-- Idempotent upgrades for databases created before XR-1.
ALTER TABLE xr_experiences ADD COLUMN IF NOT EXISTS scene_data JSONB;
ALTER TABLE xr_experiences ADD COLUMN IF NOT EXISTS source_project_id UUID;
-- XR-2 tenancy: sessions are learner data — carry the learner's org (P2-8
-- pattern) so staff views can stay org-scoped.
ALTER TABLE xr_sessions ADD COLUMN IF NOT EXISTS org_id UUID;
CREATE INDEX IF NOT EXISTS ix_xr_sessions_org_id ON xr_sessions (org_id);

CREATE TABLE IF NOT EXISTS xr_sessions (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experience_id         UUID NOT NULL REFERENCES xr_experiences(id) ON DELETE CASCADE,
    user_id               UUID REFERENCES users(id) ON DELETE SET NULL,
    device_type           TEXT,
    status                TEXT NOT NULL DEFAULT 'active',
    completion_percentage INTEGER,
    user_rating           INTEGER,
    started_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    ended_at              TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS ix_xr_sessions_experience ON xr_sessions (experience_id);
CREATE INDEX IF NOT EXISTS ix_xr_sessions_user ON xr_sessions (user_id);

-- Demo experiences — only when the table is empty (so a fresh boot has content
-- but we never duplicate the rows the xr-labs service may already have seeded).
INSERT INTO xr_experiences
    (title, description, category, difficulty, duration_minutes, scene_url,
     thumbnail_url, interaction_type, learning_objectives, prerequisites, tags,
     is_published, avg_rating)
SELECT * FROM (VALUES
    ('Chemistry Lab Simulation',
     'Mix reagents and observe reactions in a safe virtual lab. Orbit the bench, inspect glassware, and follow a guided titration.',
     'Chemistry', 'Intermediate', 15,
     'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
     'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
     'guided',
     ARRAY['Perform a virtual titration','Identify common lab glassware','Describe reaction safety basics']::text[],
     ARRAY[]::text[],
     ARRAY['chemistry','lab','xr']::text[],
     TRUE, 4.6),
    ('Human Anatomy VR',
     'Explore body systems in 3D. Rotate and zoom an interactive model while learning the major structures.',
     'Biology', 'Intermediate', 20,
     'https://modelviewer.dev/shared-assets/models/DamagedHelmet.glb',
     'https://modelviewer.dev/shared-assets/models/DamagedHelmet.glb',
     'free',
     ARRAY['Locate major anatomical structures','Navigate a 3D anatomy model']::text[],
     ARRAY[]::text[],
     ARRAY['biology','anatomy','xr']::text[],
     TRUE, 4.8),
    ('Solar System Explorer',
     'Fly through the solar system, compare planet scales, and learn orbital mechanics hands-on.',
     'Astronomy', 'Beginner', 12,
     'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
     'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
     'free',
     ARRAY['Compare planetary scale','Describe orbital motion']::text[],
     ARRAY[]::text[],
     ARRAY['astronomy','space','xr']::text[],
     TRUE, 4.5)
) AS v(title, description, category, difficulty, duration_minutes, scene_url,
       thumbnail_url, interaction_type, learning_objectives, prerequisites, tags,
       is_published, avg_rating)
WHERE NOT EXISTS (SELECT 1 FROM xr_experiences);

-- Backfill: give any published experience missing a scene a loadable, CORS-
-- friendly demo model so the WebXR viewer renders something (anatomy → helmet,
-- everything else → astronaut). Placeholders until real assets are authored.
UPDATE xr_experiences
SET scene_url = CASE
    WHEN category ILIKE 'biolog%' OR title ILIKE '%anatomy%'
        THEN 'https://modelviewer.dev/shared-assets/models/DamagedHelmet.glb'
    ELSE 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'
END
WHERE scene_url IS NULL OR scene_url = '';

-- XR-4: the built-in portals are real experiences too — their scene_url is an
-- internal route (the viewer redirects instead of GLTF-loading), so their runs
-- record sessions, ratings, and XP exactly like glTF/scene-builder ones.
INSERT INTO xr_experiences
    (title, description, category, difficulty, duration_minutes, scene_url,
     learning_objectives, tags, is_published)
SELECT * FROM (VALUES
    ('Organic Chemistry 3D',
     'Interactive ball-and-stick molecule explorer: 10 molecules from methane to caffeine. Rotate, click any atom for its element and hybridization, and compare geometry and polarity. Idealized textbook geometries, fully offline.',
     'Chemistry', 'beginner', 15, '/dashboard/xr-labs/molecules',
     ARRAY['Predict molecular shape from VSEPR', 'Identify sp/sp2/sp3 hybridization at a center', 'Explain why symmetric molecules with polar bonds are nonpolar', 'Relate bond order to bond length and rigidity'],
     ARRAY['chemistry','molecules','interactive','built-in'], TRUE),
    ('Anatomy 3D',
     'Layered walkthrough of the human body: toggle skeletal, organ, and circulatory layers and click any structure for facts. Schematic volumes — for layer order, spatial relationships, and vocabulary, not clinical detail.',
     'Biology', 'beginner', 15, '/dashboard/xr-labs/anatomy',
     ARRAY['Order the body layers from skeleton inward', 'Locate the major thoracic and abdominal organs', 'Trace the heart and great vessels', 'Use correct anatomical vocabulary'],
     ARRAY['anatomy','biology','interactive','built-in'], TRUE),
    ('Solar System Explorer (portal)',
     'Real-time orbital mechanics for all 8 planets plus the Moon, with click-for-facts on every body. Built from scratch — no external assets.',
     'Astronomy', 'beginner', 15, '/dashboard/xr-labs/solar-system',
     ARRAY['Compare planetary orbits and relative scale', 'Relate orbital period to distance from the Sun'],
     ARRAY['astronomy','space','interactive','built-in'], TRUE)
) AS v(title, description, category, difficulty, duration_minutes, scene_url,
       learning_objectives, tags, is_published)
WHERE NOT EXISTS (
    SELECT 1 FROM xr_experiences e WHERE e.scene_url = v.scene_url
);
UPDATE xr_experiences SET is_published = true
WHERE scene_url LIKE '/dashboard/xr-labs/%';
