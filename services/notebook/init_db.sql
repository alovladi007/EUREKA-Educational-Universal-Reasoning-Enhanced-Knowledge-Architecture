-- EUREKA Notebook Service Database Schema
-- Tables for project and task management

-- ==================== PROJECTS TABLE ====================
CREATE TABLE IF NOT EXISTS notebook_projects (
    id SERIAL PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_status CHECK (status IN ('active', 'completed', 'archived', 'on_hold'))
);

CREATE INDEX IF NOT EXISTS idx_notebook_projects_owner ON notebook_projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_notebook_projects_status ON notebook_projects(status);
CREATE INDEX IF NOT EXISTS idx_notebook_projects_created ON notebook_projects(created_at DESC);

-- ==================== TASKS TABLE ====================
CREATE TABLE IF NOT EXISTS notebook_tasks (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES notebook_projects(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'todo',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    due_date TIMESTAMP,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP,
    CONSTRAINT valid_task_status CHECK (status IN ('todo', 'in_progress', 'review', 'completed', 'blocked')),
    CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
);

CREATE INDEX IF NOT EXISTS idx_notebook_tasks_project ON notebook_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_notebook_tasks_status ON notebook_tasks(status);
CREATE INDEX IF NOT EXISTS idx_notebook_tasks_priority ON notebook_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_notebook_tasks_assigned ON notebook_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_notebook_tasks_due ON notebook_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_notebook_tasks_created ON notebook_tasks(created_at DESC);

-- ==================== COMMENTS TABLE ====================
CREATE TABLE IF NOT EXISTS notebook_comments (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES notebook_tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notebook_comments_task ON notebook_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_notebook_comments_user ON notebook_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_notebook_comments_created ON notebook_comments(created_at ASC);

-- ==================== FILES TABLE ====================
CREATE TABLE IF NOT EXISTS notebook_files (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES notebook_projects(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES notebook_tasks(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT file_belongs_to_project_or_task CHECK (
        (project_id IS NOT NULL AND task_id IS NULL) OR
        (project_id IS NULL AND task_id IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_notebook_files_project ON notebook_files(project_id);
CREATE INDEX IF NOT EXISTS idx_notebook_files_task ON notebook_files(task_id);
CREATE INDEX IF NOT EXISTS idx_notebook_files_uploader ON notebook_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_notebook_files_created ON notebook_files(created_at DESC);

-- ==================== ACTIVITY LOG ====================
CREATE TABLE IF NOT EXISTS notebook_activity (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id INTEGER REFERENCES notebook_projects(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES notebook_tasks(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notebook_activity_user ON notebook_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_notebook_activity_project ON notebook_activity(project_id);
CREATE INDEX IF NOT EXISTS idx_notebook_activity_task ON notebook_activity(task_id);
CREATE INDEX IF NOT EXISTS idx_notebook_activity_created ON notebook_activity(created_at DESC);

-- ==================== FULL-TEXT SEARCH ====================
-- Add full-text search capabilities
CREATE INDEX IF NOT EXISTS idx_notebook_projects_search ON notebook_projects USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_notebook_tasks_search ON notebook_tasks USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- ==================== TRIGGERS ====================
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notebook_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notebook_projects_updated_at
    BEFORE UPDATE ON notebook_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_notebook_updated_at();

CREATE TRIGGER notebook_tasks_updated_at
    BEFORE UPDATE ON notebook_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_notebook_updated_at();

CREATE TRIGGER notebook_comments_updated_at
    BEFORE UPDATE ON notebook_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_notebook_updated_at();

-- Auto-set completed_at when task status changes to completed
CREATE OR REPLACE FUNCTION set_task_completed_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        NEW.completed_at = NOW();
    ELSIF NEW.status != 'completed' THEN
        NEW.completed_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notebook_tasks_completed_at
    BEFORE UPDATE ON notebook_tasks
    FOR EACH ROW
    EXECUTE FUNCTION set_task_completed_at();
