#!/bin/bash

# =====================================================
# EUREKA Platform - Database Test Script
# =====================================================
# Quick validation that the database is properly set up
# =====================================================

set -e

echo "========================================="
echo "EUREKA Database Quick Test"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo -e "${RED}✗ Docker is not running${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is running${NC}"

# Check if database container exists
if ! docker ps -a | grep -q eureka-db; then
    echo -e "${RED}✗ Database container 'eureka-db' not found${NC}"
    echo "  Run: docker-compose up -d db"
    exit 1
fi
echo -e "${GREEN}✓ Database container exists${NC}"

# Check if database container is running
if ! docker ps | grep -q eureka-db; then
    echo -e "${YELLOW}⚠ Database container is not running${NC}"
    echo "  Starting database..."
    docker-compose up -d db
    echo "  Waiting 10 seconds for database to be ready..."
    sleep 10
fi
echo -e "${GREEN}✓ Database container is running${NC}"

# Test database connection
echo ""
echo "Testing database connection..."
if docker exec eureka-db pg_isready -U eureka > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Database is accepting connections${NC}"
else
    echo -e "${RED}✗ Database is not ready${NC}"
    exit 1
fi

# Count tables
echo ""
echo "Counting database objects..."
TABLE_COUNT=$(docker exec eureka-db psql -U eureka -d eureka -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';" 2>/dev/null | tr -d '[:space:]')

if [ -z "$TABLE_COUNT" ] || [ "$TABLE_COUNT" = "0" ]; then
    echo -e "${RED}✗ No tables found - database not initialized${NC}"
    echo ""
    echo "To initialize the database, run:"
    echo "  docker exec -i eureka-db psql -U eureka -d eureka < ops/db/init_complete.sql"
    exit 1
fi

echo -e "${GREEN}✓ Found $TABLE_COUNT tables${NC}"

# Check for required extensions
echo ""
echo "Checking required extensions..."
EXTENSIONS=$(docker exec eureka-db psql -U eureka -d eureka -t -c "SELECT COUNT(*) FROM pg_extension WHERE extname IN ('uuid-ossp', 'pgcrypto', 'pg_trgm', 'vector');" 2>/dev/null | tr -d '[:space:]')

if [ "$EXTENSIONS" = "4" ]; then
    echo -e "${GREEN}✓ All 4 required extensions are installed${NC}"
else
    echo -e "${YELLOW}⚠ Only $EXTENSIONS/4 extensions found${NC}"
fi

# Check for demo user
echo ""
echo "Checking demo data..."
DEMO_USER=$(docker exec eureka-db psql -U eureka -d eureka -t -c "SELECT email FROM users WHERE email = 'admin@demo.edu';" 2>/dev/null | tr -d '[:space:]')

if [ -n "$DEMO_USER" ]; then
    echo -e "${GREEN}✓ Demo admin user exists${NC}"
    echo "  Email: admin@demo.edu"
    echo "  Password: Admin123!"
else
    echo -e "${YELLOW}⚠ Demo user not found${NC}"
fi

# Check for demo course
DEMO_COURSE=$(docker exec eureka-db psql -U eureka -d eureka -t -c "SELECT code FROM courses WHERE code = 'DEMO101';" 2>/dev/null | tr -d '[:space:]')

if [ -n "$DEMO_COURSE" ]; then
    echo -e "${GREEN}✓ Demo course exists (DEMO101)${NC}"
else
    echo -e "${YELLOW}⚠ Demo course not found${NC}"
fi

# Summary
echo ""
echo "========================================="
echo "TEST SUMMARY"
echo "========================================="
echo ""

if [ "$TABLE_COUNT" -ge "40" ] && [ "$EXTENSIONS" = "4" ]; then
    echo -e "${GREEN}✓ DATABASE IS READY!${NC}"
    echo ""
    echo "You can now:"
    echo "  1. Start all services: docker-compose up -d"
    echo "  2. Access API docs: http://localhost:8000/docs"
    echo "  3. Login with: admin@demo.edu / Admin123!"
    echo ""
    echo "For detailed validation, run:"
    echo "  docker exec -i eureka-db psql -U eureka -d eureka < ops/db/validate_schema.sql"
else
    echo -e "${YELLOW}⚠ DATABASE NEEDS ATTENTION${NC}"
    echo ""
    echo "Current state:"
    echo "  - Tables: $TABLE_COUNT (need 40+)"
    echo "  - Extensions: $EXTENSIONS/4"
    echo ""
    if [ "$TABLE_COUNT" = "0" ] || [ -z "$TABLE_COUNT" ]; then
        echo "Action required:"
        echo "  docker exec -i eureka-db psql -U eureka -d eureka < ops/db/init_complete.sql"
    fi
fi

echo ""
