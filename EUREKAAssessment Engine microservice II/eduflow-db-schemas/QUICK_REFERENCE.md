# EduFlow Database - Quick Reference Guide

## 🚀 Quick Commands

### Start All Databases
```bash
docker-compose up -d
```

### Stop All Databases
```bash
docker-compose down
```

### Restart Specific Database
```bash
docker-compose restart postgres-api-core
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f postgres-api-core
```

### Database Shell Access
```bash
# Connect to API Core database
docker exec -it eduflow-db-api-core psql -U eduflow_user -d eduflow_api_core

# Connect to Assessment database
docker exec -it eduflow-db-assessment psql -U eduflow_user -d eduflow_assessment
```

---

## 📊 Common SQL Queries

### User Management
```sql
-- List all users
SELECT id, email, first_name, last_name, role, tier FROM users;

-- Create a new student
INSERT INTO users (email, password_hash, first_name, last_name, role, tier)
VALUES ('student@example.com', '$2b$12$...', 'John', 'Doe', 'student', 'hs');

-- Find user by email
SELECT * FROM users WHERE email = 'student@eduflow.com';
```

### Course Management
```sql
-- List all courses
SELECT id, title, tier, subject, is_published FROM courses;

-- Get course with enrollments
SELECT c.title, COUNT(e.id) as enrollment_count
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.id, c.title;

-- Find courses by tier
SELECT * FROM courses WHERE tier = 'hs' AND is_published = true;
```

### Enrollment Queries
```sql
-- Get user's courses
SELECT c.title, e.progress_percentage, e.status
FROM enrollments e
JOIN courses c ON e.course_id = c.id
WHERE e.user_id = 'USER_UUID_HERE';

-- Course completion rate
SELECT 
    c.title,
    COUNT(*) as total_students,
    SUM(CASE WHEN e.status = 'completed' THEN 1 ELSE 0 END) as completed,
    ROUND(SUM(CASE WHEN e.status = 'completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as completion_rate
FROM enrollments e
JOIN courses c ON e.course_id = c.id
GROUP BY c.id, c.title;
```

### Assessment Queries
```sql
-- Get assessment results
SELECT 
    u.email,
    a.title as assessment,
    gr.percentage_score,
    gr.pass_fail_status
FROM grading_results gr
JOIN assessment_attempts aa ON gr.attempt_id = aa.id
JOIN assessments a ON aa.assessment_id = a.id
JOIN users u ON aa.user_id = u.id;

-- Average scores by assessment
SELECT 
    a.title,
    AVG(gr.percentage_score) as avg_score,
    COUNT(*) as attempts
FROM grading_results gr
JOIN assessment_attempts aa ON gr.attempt_id = aa.id
JOIN assessments a ON aa.assessment_id = a.id
GROUP BY a.id, a.title;
```

---

## 🔧 Maintenance Commands

### Backup Database
```bash
# Backup API Core
docker exec eduflow-db-api-core pg_dump -U eduflow_user eduflow_api_core > backup_api_core_$(date +%Y%m%d).sql

# Backup all databases
./scripts/backup-all.sh
```

### Restore Database
```bash
# Restore from backup
docker exec -i eduflow-db-api-core psql -U eduflow_user eduflow_api_core < backup_api_core_20250101.sql
```

### Database Size
```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('eduflow_api_core'));

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Vacuum and Analyze
```sql
-- Clean up and optimize
VACUUM ANALYZE;

-- Full vacuum (requires exclusive lock)
VACUUM FULL;
```

---

## 🐛 Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs postgres-api-core

# Remove and recreate
docker-compose rm -f postgres-api-core
docker volume rm eduflow-api-core-data
docker-compose up -d postgres-api-core
```

### Connection Issues
```bash
# Test connection
docker exec eduflow-db-api-core pg_isready -U eduflow_user

# Check running containers
docker-compose ps

# Check port availability
netstat -an | grep 5432
```

### Slow Queries
```sql
-- Enable query logging
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();

-- Find slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check active queries
SELECT pid, query, state, query_start
FROM pg_stat_activity
WHERE state != 'idle';
```

### Reset Demo Data
```bash
# Reinitialize a database
docker-compose down
docker volume rm eduflow-api-core-data
docker-compose up -d postgres-api-core
```

---

## 📈 Performance Monitoring

### Connection Pool Stats
```sql
SELECT * FROM pg_stat_database WHERE datname = 'eduflow_api_core';
```

### Index Usage
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### Cache Hit Ratio
```sql
SELECT 
    sum(heap_blks_read) as heap_read,
    sum(heap_blks_hit) as heap_hit,
    sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as ratio
FROM pg_statio_user_tables;
```

---

## 🔐 Security Commands

### Create Read-Only User
```sql
CREATE USER readonly_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE eduflow_api_core TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO readonly_user;
```

### Revoke Permissions
```sql
REVOKE ALL ON DATABASE eduflow_api_core FROM some_user;
```

### Change Password
```sql
ALTER USER eduflow_user WITH PASSWORD 'new_secure_password';
```

---

## 📚 Useful Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker PostgreSQL Image](https://hub.docker.com/_/postgres)
- [PgAdmin Documentation](https://www.pgadmin.org/docs/)

---

## 🆘 Getting Help

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify containers are running: `docker-compose ps`
3. Test database connection: `docker exec -it [container] psql -U eduflow_user`
4. Review README.md for detailed setup
5. Create an issue on GitHub

---

**Last Updated:** January 2025
**Version:** 1.0.0
