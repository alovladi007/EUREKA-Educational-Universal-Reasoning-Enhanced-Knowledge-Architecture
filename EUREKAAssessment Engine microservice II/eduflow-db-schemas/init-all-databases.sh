#!/bin/bash

# =====================================================
# EduFlow Platform - Database Initialization Script
# =====================================================

set -e

echo "🚀 Starting EduFlow Database Initialization..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ Error: docker-compose.yml not found in current directory${NC}"
    exit 1
fi

# Function to check if database is ready
wait_for_db() {
    local container_name=$1
    local max_attempts=30
    local attempt=0
    
    echo -n "⏳ Waiting for $container_name to be ready..."
    
    while [ $attempt -lt $max_attempts ]; do
        if docker exec $container_name pg_isready -U eduflow_user > /dev/null 2>&1; then
            echo -e " ${GREEN}✓${NC}"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 2
        echo -n "."
    done
    
    echo -e " ${RED}✗${NC}"
    echo -e "${RED}❌ Timeout waiting for $container_name${NC}"
    return 1
}

# Stop any existing containers
echo ""
echo "🛑 Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Start all database containers
echo ""
echo "🐳 Starting database containers..."
docker-compose up -d

# Wait for all databases to be ready
echo ""
echo "⏳ Waiting for databases to initialize..."
echo ""

databases=(
    "eduflow-db-api-core"
    "eduflow-db-assessment"
    "eduflow-db-adaptive"
    "eduflow-db-analytics"
    "eduflow-db-tutor"
    "eduflow-db-content"
    "eduflow-db-pro-med"
    "eduflow-db-pro-law"
    "eduflow-db-pro-mba"
    "eduflow-db-pro-eng"
)

all_ready=true
for db in "${databases[@]}"; do
    if ! wait_for_db "$db"; then
        all_ready=false
    fi
done

if [ "$all_ready" = false ]; then
    echo -e "${RED}❌ Some databases failed to initialize${NC}"
    exit 1
fi

# Verify initialization
echo ""
echo "✅ Verifying database initialization..."
echo ""

verify_db() {
    local container=$1
    local db_name=$2
    
    echo -n "  Checking $db_name..."
    
    # Count tables
    table_count=$(docker exec $container psql -U eduflow_user -d $db_name -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public'" 2>/dev/null | tr -d '[:space:]')
    
    if [ -n "$table_count" ] && [ "$table_count" -gt 0 ]; then
        echo -e " ${GREEN}✓ ($table_count tables)${NC}"
        return 0
    else
        echo -e " ${RED}✗ (no tables found)${NC}"
        return 1
    fi
}

verify_db "eduflow-db-api-core" "eduflow_api_core"
verify_db "eduflow-db-assessment" "eduflow_assessment"
verify_db "eduflow-db-adaptive" "eduflow_adaptive"
verify_db "eduflow-db-analytics" "eduflow_analytics"
verify_db "eduflow-db-tutor" "eduflow_tutor"
verify_db "eduflow-db-content" "eduflow_content"
verify_db "eduflow-db-pro-med" "eduflow_pro_med"
verify_db "eduflow-db-pro-law" "eduflow_pro_law"
verify_db "eduflow-db-pro-mba" "eduflow_pro_mba"
verify_db "eduflow-db-pro-eng" "eduflow_pro_eng"

# Show connection information
echo ""
echo "================================================"
echo -e "${GREEN}✅ All databases initialized successfully!${NC}"
echo "================================================"
echo ""
echo "📊 Database Connections:"
echo ""
echo "  API Core       → localhost:5432 (eduflow_api_core)"
echo "  Assessment     → localhost:5433 (eduflow_assessment)"
echo "  Adaptive       → localhost:5434 (eduflow_adaptive)"
echo "  Analytics      → localhost:5435 (eduflow_analytics)"
echo "  Tutor LLM      → localhost:5436 (eduflow_tutor)"
echo "  Content        → localhost:5437 (eduflow_content)"
echo "  Pro Med        → localhost:5438 (eduflow_pro_med)"
echo "  Pro Law        → localhost:5439 (eduflow_pro_law)"
echo "  Pro MBA        → localhost:5440 (eduflow_pro_mba)"
echo "  Pro Eng        → localhost:5441 (eduflow_pro_eng)"
echo ""
echo "  Username: eduflow_user"
echo "  Password: eduflow_password"
echo ""
echo "🔧 PgAdmin Web UI: http://localhost:5050"
echo "   Email: admin@eduflow.com"
echo "   Password: admin123"
echo ""
echo "================================================"
echo ""
echo "📝 Demo User Accounts (All passwords: [role]123):"
echo ""
echo "  Admin:   admin@eduflow.com"
echo "  Teacher: teacher@eduflow.com"
echo "  Student: student@eduflow.com"
echo ""
echo "================================================"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "  1. Configure your backend services with these DB connections"
echo "  2. Update .env files with credentials"
echo "  3. Start your backend services"
echo "  4. Connect frontend to backend APIs"
echo ""
echo "📚 For more information, see README.md"
echo ""
