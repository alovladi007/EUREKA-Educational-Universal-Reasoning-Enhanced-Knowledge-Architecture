# EduFlow Platform - Complete Database Schemas

## 📦 Package Contents

This package contains complete PostgreSQL database schemas for all EduFlow platform services:

### Core Services
- **API Core** (`init-api-core.sql`) - Users, courses, enrollments, assignments, discussions
- **Assessment Engine** (`init-assessment-engine.sql`) - Tests, grading, rubrics, AI grading
- **Adaptive Learning** (`init-adaptive-learning.sql`) - Learning paths, mastery tracking, recommendations, gamification
- **Analytics Dashboard** (`init-analytics-dashboard.sql`) - Events, metrics, performance tracking, reporting
- **Tutor LLM** (`init-tutor-llm.sql`) - AI tutoring sessions, conversation management, strategies
- **Content Service** (`init-content-service.sql`) - Content library, collections, recommendations

### Professional Tier Services
- **Medical School** (`init-pro-med.sql`) - Clinical cases, USMLE questions, anatomy 3D models, pathology
- **Law School** (`init-pro-law.sql`) - Case law database, legal research, moot court, bar exam prep
- **MBA** (`init-pro-mba.sql`) - Business cases, financial modeling, simulations, entrepreneurship
- **Engineering** (`init-pro-eng.sql`) - Engineering problems, circuit simulation, CAD, FEA, coding projects

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- PostgreSQL 14+ (if running locally)
- At least 4GB RAM for databases
- 20GB disk space

### Option 1: Using Docker Compose (Recommended)

```bash
# 1. Copy all schema files to your project directory
cp *.sql /path/to/your/eduflow/db-schemas/

# 2. Start PostgreSQL containers
docker-compose up -d

# 3. Initialize databases (run the init script)
./init-all-databases.sh
```

### Option 2: Local PostgreSQL Setup

```bash
# 1. Create databases
createdb eduflow_api_core
createdb eduflow_assessment
createdb eduflow_adaptive
createdb eduflow_analytics
createdb eduflow_tutor
createdb eduflow_content
createdb eduflow_pro_med
createdb eduflow_pro_law
createdb eduflow_pro_mba
createdb eduflow_pro_eng

# 2. Initialize each database
psql eduflow_api_core < init-api-core.sql
psql eduflow_assessment < init-assessment-engine.sql
psql eduflow_adaptive < init-adaptive-learning.sql
psql eduflow_analytics < init-analytics-dashboard.sql
psql eduflow_tutor < init-tutor-llm.sql
psql eduflow_content < init-content-service.sql
psql eduflow_pro_med < init-pro-med.sql
psql eduflow_pro_law < init-pro-law.sql
psql eduflow_pro_mba < init-pro-mba.sql
psql eduflow_pro_eng < init-pro-eng.sql
```

---

## 📊 Database Architecture

### Core Services Layer
```
┌─────────────────────────────────────────────────────────────┐
│                      API Core Database                       │
│  Users, Authentication, Courses, Enrollments, Assignments   │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐
│  Assessment    │  │   Adaptive      │  │   Analytics     │
│    Engine      │  │   Learning      │  │   Dashboard     │
└────────────────┘  └─────────────────┘  └─────────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                     ┌────────▼────────┐
                     │  Tutor LLM      │
                     │  & Content      │
                     └─────────────────┘
```

### Professional Tiers Layer
```
┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
│  Medical   │  │    Law     │  │    MBA     │  │ Engineering│
│   School   │  │   School   │  │            │  │            │
└────────────┘  └────────────┘  └────────────┘  └────────────┘
```

---

## 📋 Database Schema Details

### API Core Database

**Key Tables:**
- `users` - User accounts and authentication
- `courses` - Course catalog
- `enrollments` - Student course registrations
- `lessons` - Course content
- `assignments` - Assignment definitions
- `submissions` - Student submissions
- `discussions` - Forum threads and posts
- `notifications` - User notifications

**Features:**
✅ UUID primary keys
✅ Soft delete support (is_active flags)
✅ Timestamp tracking (created_at, updated_at)
✅ Role-based permissions
✅ Comprehensive indexes

**Demo Users (All passwords: `[role]123`):**
- Admin: `admin@eduflow.com`
- Teacher: `teacher@eduflow.com`
- Student: `student@eduflow.com`

### Assessment Engine Database

**Key Tables:**
- `assessments` - Test/quiz definitions
- `questions` - Question bank
- `assessment_attempts` - Student attempts
- `question_responses` - Individual answers
- `grading_results` - Scores and feedback
- `grading_rubrics` - Scoring criteria
- `ai_grading_requests` - AI-powered grading
- `plagiarism_checks` - Content verification

**Features:**
✅ Multiple question types (MCQ, essay, code, etc.)
✅ AI-powered grading integration
✅ Rubric-based assessment
✅ Plagiarism detection
✅ Peer review support
✅ Question analytics

### Adaptive Learning Database

**Key Tables:**
- `learning_paths` - Personalized learning sequences
- `user_concept_mastery` - Knowledge tracking
- `content_recommendations` - AI recommendations
- `srs_cards` - Spaced repetition system
- `user_xp` - Gamification points
- `achievements` - Badges and milestones

**Features:**
✅ Knowledge graph structure
✅ Spaced repetition algorithm (SM-2)
✅ XP and leveling system
✅ Skill trees
✅ Adaptive difficulty
✅ Learning pattern detection

### Analytics Dashboard Database

**Key Tables:**
- `analytics_events` - All user actions
- `engagement_metrics` - Daily engagement data
- `performance_metrics` - Academic performance
- `course_analytics` - Course-level stats
- `risk_predictions` - Student risk scoring
- `cohort_analytics` - Group comparisons

**Features:**
✅ Time-series event tracking
✅ Partitioned tables for performance
✅ Materialized views for fast queries
✅ Predictive analytics
✅ Real-time dashboards
✅ Custom report builder

### Tutor LLM Database

**Key Tables:**
- `tutor_sessions` - Chat sessions
- `tutor_messages` - Conversation history
- `long_term_memory` - User context retention
- `tutoring_strategies` - Teaching approaches
- `ai_grading_models` - AI model configurations
- `content_moderation` - Safety checks

**Features:**
✅ Conversation context management
✅ Multi-model support (OpenAI, Anthropic)
✅ Token usage tracking
✅ Quality metrics
✅ Safety moderation
✅ Code execution logs

### Content Service Database

**Key Tables:**
- `content_items` - Learning materials
- `media_assets` - Videos, documents, etc.
- `content_collections` - Playlists and bundles
- `content_views` - Usage analytics
- `generated_content` - AI-generated summaries
- `accessibility_features` - Captions, transcripts

**Features:**
✅ Multi-format content support
✅ Version control
✅ AI content generation
✅ Accessibility features
✅ External integrations
✅ Content recommendations

### Professional Tier Databases

#### Medical School
- Clinical case simulations
- USMLE question bank (Step 1, 2CK, 2CS, 3)
- 3D anatomy models
- Pathology slides
- Clinical rotations tracking
- Procedure logs
- ACGME competency assessments

#### Law School
- Case law database with citations
- Legal research tools
- Moot court evaluations
- Legal writing feedback
- Bar exam preparation (MBE, MEE, MPT)
- Externship tracking
- Pro bono hours logging

#### MBA
- Business case library
- Financial modeling projects
- Market research datasets
- Business simulations
- Pitch competitions
- Team collaboration tools
- Leadership assessments

#### Engineering
- Engineering problem sets
- Circuit simulation projects
- CAD/FEA assignments
- Programming projects
- Lab experiments
- Design competitions
- FE/PE exam prep
- Research project management

---

## 🔧 Configuration

### Database Credentials

**Development:**
```env
# API Core
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eduflow_api_core
DB_USER=eduflow_user
DB_PASSWORD=eduflow_password

# Repeat for each service...
```

**Production:**
```env
# Use environment-specific credentials
# Enable SSL connections
# Use connection pooling (PgBouncer recommended)
# Set up read replicas for scaling
```

### Performance Tuning

**Recommended PostgreSQL Settings:**
```
shared_buffers = 2GB
effective_cache_size = 6GB
maintenance_work_mem = 512MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 16MB
```

---

## 🔐 Security Considerations

### Authentication
- Passwords are hashed with bcrypt (cost factor 12)
- JWT tokens for API authentication
- Session management with expiry
- IP and user agent tracking

### Data Protection
- Use SSL/TLS for all database connections
- Encrypt sensitive fields (passwords, API keys)
- Implement row-level security where needed
- Regular backups with encryption

### Access Control
- Principle of least privilege
- Service-specific database users
- Read-only replicas for analytics
- Audit logging for sensitive operations

---

## 📈 Scaling Strategies

### Horizontal Scaling
```
Primary (Write)
    │
    ├── Read Replica 1 (Analytics)
    ├── Read Replica 2 (API queries)
    └── Read Replica 3 (Reporting)
```

### Partitioning
- Analytics events partitioned by month
- User activity partitioned by user_id range
- Time-series data with automated partition management

### Caching
- Redis for session data
- Materialized views for complex queries
- Query result caching
- CDN for static content

---

## 🧪 Testing

### Run Tests
```bash
# Unit tests for database functions
npm test db

# Integration tests
npm test integration

# Load testing
npm test load
```

### Sample Data Generation
```bash
# Generate fake data for testing
./scripts/generate-test-data.sh --users 1000 --courses 50
```

---

## 📚 Migration Guide

### Adding New Tables
```sql
-- Follow the established patterns:
CREATE TABLE new_table (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- columns here
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_new_table_field ON new_table(field);

-- Add triggers
CREATE TRIGGER update_new_table_updated_at 
BEFORE UPDATE ON new_table
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Schema Versioning
```bash
# Use migration tool (e.g., Flyway, Liquibase)
flyway migrate -url=jdbc:postgresql://localhost/eduflow_api_core
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Connection refused**
```bash
# Check if PostgreSQL is running
docker-compose ps
systemctl status postgresql

# Check connection settings
psql -h localhost -U eduflow_user -d eduflow_api_core
```

**Issue: Slow queries**
```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Rebuild indexes
REINDEX DATABASE eduflow_api_core;

-- Update statistics
ANALYZE;
```

**Issue: Disk space full**
```bash
# Check database size
SELECT pg_size_pretty(pg_database_size('eduflow_api_core'));

# Vacuum old data
VACUUM FULL;
```

---

## 📞 Support

### Documentation
- Full API documentation: https://docs.eduflow.com
- Schema diagrams: See `/docs/schemas/`
- Video tutorials: https://eduflow.com/tutorials

### Community
- Discord: https://discord.gg/eduflow
- GitHub Issues: https://github.com/eduflow/platform/issues
- Stack Overflow: Tag `eduflow`

### Enterprise Support
- Email: enterprise@eduflow.com
- 24/7 Support Portal: https://support.eduflow.com

---

## 📄 License

Copyright © 2025 EduFlow Platform
All rights reserved.

---

## 🎯 Next Steps

1. ✅ Run database initialization
2. ⬜ Configure backend services
3. ⬜ Set up authentication
4. ⬜ Implement API endpoints
5. ⬜ Connect frontend
6. ⬜ Add sample data
7. ⬜ Run integration tests
8. ⬜ Deploy to staging

**For detailed implementation guides, see:**
- `/docs/backend-setup.md`
- `/docs/authentication.md`
- `/docs/api-implementation.md`
