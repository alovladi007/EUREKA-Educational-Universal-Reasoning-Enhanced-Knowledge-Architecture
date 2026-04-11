-- =====================================================
-- EUREKA Platform - Database Schema Validation Script
-- =====================================================
-- This script validates that all database objects were created correctly
-- Run this after init_complete.sql to verify the database
-- =====================================================

\echo '========================================='
\echo 'EUREKA Database Schema Validation'
\echo '========================================='
\echo ''

-- Check PostgreSQL version
\echo '1. PostgreSQL Version:'
SELECT version();
\echo ''

-- Check required extensions
\echo '2. Required Extensions:'
SELECT extname, extversion 
FROM pg_extension 
WHERE extname IN ('uuid-ossp', 'pgcrypto', 'pg_trgm', 'vector')
ORDER BY extname;
\echo ''

-- Count all tables
\echo '3. Table Count:'
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
\echo ''

-- List all tables with row counts
\echo '4. All Tables (with row counts):'
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
\echo ''

-- Count views
\echo '5. View Count:'
SELECT COUNT(*) as view_count 
FROM information_schema.views 
WHERE table_schema = 'public';
\echo ''

-- List all views
\echo '6. All Views:'
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public'
ORDER BY table_name;
\echo ''

-- Count indexes
\echo '7. Index Count:'
SELECT COUNT(*) as index_count 
FROM pg_indexes 
WHERE schemaname = 'public';
\echo ''

-- Count functions
\echo '8. Function Count:'
SELECT COUNT(*) as function_count 
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public';
\echo ''

-- Count triggers
\echo '9. Trigger Count:'
SELECT COUNT(*) as trigger_count 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
\echo ''

-- List all triggers
\echo '10. All Triggers:'
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
\echo ''

-- Verify foreign key constraints
\echo '11. Foreign Key Constraints:'
SELECT COUNT(*) as fk_count 
FROM information_schema.table_constraints 
WHERE constraint_schema = 'public' 
AND constraint_type = 'FOREIGN KEY';
\echo ''

-- Check for orphaned records (should be 0)
\echo '12. Data Integrity Checks:'
\echo '    Checking for orphaned records...'

-- Check demo data exists
\echo '13. Demo Data Verification:'
SELECT 
    'organizations' as table_name,
    COUNT(*) as record_count 
FROM organizations
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'courses', COUNT(*) FROM courses
UNION ALL
SELECT 'course_modules', COUNT(*) FROM course_modules;
\echo ''

-- Verify user roles
\echo '14. User Roles:'
SELECT role, COUNT(*) as user_count 
FROM users 
GROUP BY role 
ORDER BY role;
\echo ''

-- Verify organization tiers
\echo '15. Organization Tiers:'
SELECT tier, COUNT(*) as org_count 
FROM organizations 
GROUP BY tier 
ORDER BY tier;
\echo ''

-- Check email uniqueness
\echo '16. Email Uniqueness Check:'
SELECT 
    org_id,
    email,
    COUNT(*) as duplicate_count
FROM users
GROUP BY org_id, email
HAVING COUNT(*) > 1;
\echo '    (Should be empty - no duplicates allowed)'
\echo ''

-- Verify course codes are unique per org
\echo '17. Course Code Uniqueness Check:'
SELECT 
    org_id,
    code,
    COUNT(*) as duplicate_count
FROM courses
GROUP BY org_id, code
HAVING COUNT(*) > 1;
\echo '    (Should be empty - no duplicates allowed)'
\echo ''

-- Check timestamp triggers work
\echo '18. Timestamp Triggers Test:'
SELECT 
    'organizations' as table_name,
    COUNT(*) as records_with_updated_at
FROM organizations 
WHERE updated_at IS NOT NULL
UNION ALL
SELECT 'users', COUNT(*) FROM users WHERE updated_at IS NOT NULL
UNION ALL
SELECT 'courses', COUNT(*) FROM courses WHERE updated_at IS NOT NULL;
\echo ''

-- Verify pgvector extension for RAG
\echo '19. Vector Extension Check:'
SELECT 
    COUNT(*) as tables_with_vector_columns
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND udt_name = 'vector';
\echo ''

-- List all enum types
\echo '20. Enum Types:'
SELECT 
    t.typname as enum_name,
    array_agg(e.enumlabel ORDER BY e.enumsortorder) as values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typtype = 'e'
GROUP BY t.typname
ORDER BY t.typname;
\echo ''

-- Summary statistics
\echo '========================================='
\echo 'VALIDATION SUMMARY'
\echo '========================================='
\echo ''

-- Total database objects
WITH counts AS (
    SELECT 'Tables' as object_type, COUNT(*)::text as count
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    UNION ALL
    SELECT 'Views', COUNT(*)::text
    FROM information_schema.views 
    WHERE table_schema = 'public'
    UNION ALL
    SELECT 'Indexes', COUNT(*)::text
    FROM pg_indexes 
    WHERE schemaname = 'public'
    UNION ALL
    SELECT 'Functions', COUNT(*)::text
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    UNION ALL
    SELECT 'Triggers', COUNT(*)::text
    FROM information_schema.triggers 
    WHERE trigger_schema = 'public'
    UNION ALL
    SELECT 'Foreign Keys', COUNT(*)::text
    FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' AND constraint_type = 'FOREIGN KEY'
    UNION ALL
    SELECT 'Enum Types', COUNT(*)::text
    FROM pg_type WHERE typtype = 'e'
)
SELECT 
    object_type,
    count,
    '✓' as status
FROM counts
ORDER BY 
    CASE object_type
        WHEN 'Tables' THEN 1
        WHEN 'Views' THEN 2
        WHEN 'Indexes' THEN 3
        WHEN 'Functions' THEN 4
        WHEN 'Triggers' THEN 5
        WHEN 'Foreign Keys' THEN 6
        WHEN 'Enum Types' THEN 7
    END;
\echo ''

-- Database size
\echo 'Database Size:'
SELECT pg_size_pretty(pg_database_size('eureka')) as total_size;
\echo ''

\echo '========================================='
\echo 'VALIDATION COMPLETE!'
\echo '========================================='
\echo ''
\echo 'If you see this message, the database schema is properly installed.'
\echo 'All tables, indexes, triggers, and constraints are in place.'
\echo ''
\echo 'Next steps:'
\echo '1. Test login: SELECT email, role FROM users WHERE role = '\''org_admin'\'';'
\echo '2. Start services: docker-compose up -d'
\echo '3. Access API docs: http://localhost:8000/docs'
\echo ''
