-- XR Scene Builder: templates + asset library + projects --------------------
--
-- Backs /dashboard/xr-labs/scene-builder, which targeted a non-existent
-- standalone XR service (:3005/api/xr). The editor now reads/writes via
-- api-core (/api/v1/xr/scene-builder/* + /xr/asset-library/*).
--
-- These tables ship only with the profile-gated xr-labs service's schema.sql,
-- so on a default boot they'd be missing and the endpoints would 500. Defining
-- them here (IF NOT EXISTS, matching that schema) makes them part of the
-- always-on schema. Idempotent: seeds only run when the table is empty.

CREATE TABLE IF NOT EXISTS xr_asset_library_categories (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name      VARCHAR(255) NOT NULL UNIQUE,
    description        TEXT,
    icon_url           TEXT,
    parent_category_id UUID REFERENCES xr_asset_library_categories(id),
    asset_count        INTEGER DEFAULT 0,
    display_order      INTEGER DEFAULT 0,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS xr_3d_assets (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_name         VARCHAR(255) NOT NULL,
    description        TEXT,
    category_id        UUID REFERENCES xr_asset_library_categories(id),
    file_url           TEXT NOT NULL,
    thumbnail_url      TEXT,
    file_format        VARCHAR(50),
    file_size_kb       INTEGER,
    polygon_count      INTEGER,
    texture_resolution VARCHAR(50),
    is_animated        BOOLEAN DEFAULT FALSE,
    tags               TEXT[],
    license_type       VARCHAR(100),
    usage_count        INTEGER DEFAULT 0,
    is_premium         BOOLEAN DEFAULT FALSE,
    created_by         UUID,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_xr_3d_assets_category ON xr_3d_assets (category_id);

CREATE TABLE IF NOT EXISTS xr_scene_templates (
    id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name          VARCHAR(255) NOT NULL,
    description            TEXT,
    category               VARCHAR(100),
    scene_data             JSONB NOT NULL,
    thumbnail_url          TEXT,
    preview_images         TEXT[],
    difficulty             VARCHAR(50),
    estimated_time_minutes INTEGER,
    usage_count            INTEGER DEFAULT 0,
    tags                   TEXT[],
    is_premium             BOOLEAN DEFAULT FALSE,
    created_by             UUID,
    created_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS xr_scene_projects (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name VARCHAR(255) NOT NULL,
    description  TEXT,
    category     VARCHAR(100),
    scene_data   JSONB NOT NULL,
    thumbnail_url TEXT,
    is_public    BOOLEAN DEFAULT FALSE,
    is_template  BOOLEAN DEFAULT FALSE,
    tags         TEXT[],
    fork_count   INTEGER DEFAULT 0,
    star_count   INTEGER DEFAULT 0,
    created_by   UUID NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_edited  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_xr_scene_projects_creator ON xr_scene_projects (created_by);

-- ── Seed categories (only when empty) ──────────────────────────────────────
INSERT INTO xr_asset_library_categories (category_name, description, display_order)
SELECT * FROM (VALUES
    ('Characters', 'Rigged and static character models', 1),
    ('Props',      'Objects, tools, and set dressing',  2),
    ('Nature',     'Plants, terrain, and environment',  3),
    ('Vehicles',   'Cars, ships, and machines',         4)
) AS v(category_name, description, display_order)
WHERE NOT EXISTS (SELECT 1 FROM xr_asset_library_categories);

-- ── Seed 3D assets (only when empty) — CORS-friendly public glTF models ─────
INSERT INTO xr_3d_assets
    (asset_name, description, category_id, file_url, thumbnail_url, file_format, is_animated, tags, license_type)
SELECT a.asset_name, a.description,
       COALESCE(
         (SELECT id FROM xr_asset_library_categories WHERE category_name = a.cat LIMIT 1),
         (SELECT id FROM xr_asset_library_categories ORDER BY display_order, category_name LIMIT 1)
       ),
       a.file_url, a.file_url, 'glb', a.animated, a.tags::text[], 'CC-BY'
FROM (VALUES
    ('Astronaut',     'EVA-suited astronaut figure.',         'Characters', 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',     FALSE, ARRAY['character','space']),
    ('Robot (rigged)','Expressive rigged robot with animations.','Characters','https://modelviewer.dev/shared-assets/models/RobotExpressive.glb', TRUE,  ARRAY['character','robot','animated']),
    ('Damaged Helmet','PBR sci-fi helmet prop.',              'Props',      'https://modelviewer.dev/shared-assets/models/DamagedHelmet.glb', FALSE, ARRAY['prop','pbr']),
    ('Mixer',         'Kitchen stand mixer prop.',            'Props',      'https://modelviewer.dev/shared-assets/models/Mixer.glb',        FALSE, ARRAY['prop','appliance']),
    ('Horse (rigged)','Animated horse model.',                'Nature',     'https://modelviewer.dev/shared-assets/models/Horse.glb',        TRUE,  ARRAY['animal','animated']),
    ('Shishkebab',    'Skewer prop with PBR materials.',      'Props',      'https://modelviewer.dev/shared-assets/models/shishkebab.glb',   FALSE, ARRAY['prop','food'])
) AS a(asset_name, description, cat, file_url, animated, tags)
WHERE NOT EXISTS (SELECT 1 FROM xr_3d_assets);

-- ── Seed scene templates (only when empty) ─────────────────────────────────
INSERT INTO xr_scene_templates
    (template_name, description, category, scene_data, difficulty, estimated_time_minutes, tags)
SELECT t.template_name, t.description, t.category, t.scene_data::jsonb, t.difficulty, t.mins, t.tags::text[]
FROM (VALUES
    ('Empty Studio',
     'A blank lit room — start from scratch.',
     'general',
     '{"objects":[],"lights":[{"type":"ambient","intensity":0.6},{"type":"directional","intensity":0.8,"position":[5,5,5]}],"cameras":[]}',
     'beginner', 5, ARRAY['blank','starter']),
    ('Showroom',
     'A pedestal-lit showroom for presenting a single model.',
     'product',
     '{"objects":[{"type":"cylinder","name":"Pedestal","position":[0,0,0],"scale":[1,0.2,1]}],"lights":[{"type":"ambient","intensity":0.5},{"type":"directional","intensity":1.0,"position":[3,6,3]}],"cameras":[]}',
     'beginner', 10, ARRAY['product','showcase']),
    ('Classroom',
     'A simple classroom layout for an educational walkthrough.',
     'education',
     '{"objects":[{"type":"cube","name":"Desk","position":[0,0,0],"scale":[2,0.1,1]},{"type":"cube","name":"Board","position":[0,1.5,-2],"scale":[3,1.5,0.1]}],"lights":[{"type":"ambient","intensity":0.7}],"cameras":[]}',
     'intermediate', 15, ARRAY['education','classroom'])
) AS t(template_name, description, category, scene_data, difficulty, mins, tags)
WHERE NOT EXISTS (SELECT 1 FROM xr_scene_templates);
