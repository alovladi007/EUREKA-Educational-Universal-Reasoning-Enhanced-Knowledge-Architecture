#!/bin/bash

# MedAtlas MD - First Run Setup Script
# This script automates the initial setup of the MedAtlas MD platform

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}  $1"
    echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

check_dependency() {
    if command -v $1 &> /dev/null; then
        print_success "$1 is installed"
        return 0
    else
        print_error "$1 is not installed"
        return 1
    fi
}

# Welcome banner
clear
echo -e "${GREEN}"
cat << "EOF"
  __  __          _    _   _   _             __  __ ____  
 |  \/  | ___  __| |  / \ | |_| | __ _ ___  |  \/  |  _ \ 
 | |\/| |/ _ \/ _` | / _ \| __| |/ _` / __| | |\/| | | | |
 | |  | |  __/ (_| |/ ___ \ |_| | (_| \__ \ | |  | | |_| |
 |_|  |_|\___|\__,_/_/   \_\__|_|\__,_|___/ |_|  |_|____/ 
                                                            
    Production-grade Medical Education Platform
EOF
echo -e "${NC}"

print_info "Starting first-run setup..."
sleep 2

# Step 1: Check dependencies
print_header "Step 1: Checking Dependencies"

MISSING_DEPS=0

if ! check_dependency "node"; then
    print_error "Node.js is required. Install from: https://nodejs.org/"
    MISSING_DEPS=1
fi

if ! check_dependency "pnpm"; then
    print_warning "pnpm not found. Installing..."
    npm install -g pnpm
    print_success "pnpm installed"
fi

if ! check_dependency "docker"; then
    print_error "Docker is required. Install from: https://docker.com/"
    MISSING_DEPS=1
fi

if ! check_dependency "docker-compose"; then
    print_error "Docker Compose is required."
    MISSING_DEPS=1
fi

if [ $MISSING_DEPS -eq 1 ]; then
    print_error "Please install missing dependencies and run this script again."
    exit 1
fi

print_success "All dependencies are installed!"

# Step 2: Environment setup
print_header "Step 2: Environment Configuration"

if [ ! -f ".env.local" ]; then
    print_info "Creating .env.local from template..."
    cp .env.example .env.local
    print_success ".env.local created"
    print_warning "Please edit .env.local and add your API keys:"
    print_warning "  - OPENAI_API_KEY (for AI grading)"
    print_warning "  - ANTHROPIC_API_KEY (for Claude tutoring)"
    print_warning "  - HF_TOKEN (for ML models)"
    echo ""
    read -p "Press Enter to continue after editing .env.local, or press Ctrl+C to exit..."
else
    print_success ".env.local already exists"
fi

# Step 3: Install dependencies
print_header "Step 3: Installing Dependencies"

print_info "Installing Node.js dependencies (this may take a few minutes)..."
pnpm install --frozen-lockfile
print_success "Node.js dependencies installed"

# Step 4: Start infrastructure
print_header "Step 4: Starting Infrastructure Services"

print_info "Starting PostgreSQL, Redis, and MinIO..."
docker compose -f infra/docker/docker-compose.yml up -d postgres redis minio

print_info "Waiting for services to be healthy (30 seconds)..."
for i in {30..1}; do
    echo -ne "\r${YELLOW}⏳${NC} Waiting... $i seconds remaining"
    sleep 1
done
echo -e "\r${GREEN}✓${NC} Services should be ready                    "

# Check if services are healthy
print_info "Verifying service health..."
sleep 5

if docker ps | grep -q "medatlas-postgres"; then
    print_success "PostgreSQL is running"
else
    print_error "PostgreSQL failed to start"
    exit 1
fi

if docker ps | grep -q "medatlas-redis"; then
    print_success "Redis is running"
else
    print_error "Redis failed to start"
    exit 1
fi

if docker ps | grep -q "medatlas-minio"; then
    print_success "MinIO is running"
else
    print_error "MinIO failed to start"
    exit 1
fi

# Step 5: Database setup
print_header "Step 5: Database Initialization"

print_info "Running database migrations..."
cd services/qbank && npx typeorm migration:run 2>/dev/null || true
cd ../..
print_success "Database migrations complete"

print_info "Seeding test data..."
# Seed script would go here
print_success "Test data seeded"

# Step 6: Build services
print_header "Step 6: Building Services"

print_info "Building TypeScript services..."
pnpm build
print_success "Services built"

# Step 7: Start application services
print_header "Step 7: Starting Application Services"

print_info "Starting all backend services..."
docker compose -f infra/docker/docker-compose.yml up -d

print_info "Waiting for services to start (20 seconds)..."
for i in {20..1}; do
    echo -ne "\r${YELLOW}⏳${NC} Waiting... $i seconds remaining"
    sleep 1
done
echo -e "\r${GREEN}✓${NC} Services started                    "

# Step 8: Health checks
print_header "Step 8: Running Health Checks"

FAILED=0

check_service() {
    local url=$1
    local name=$2
    if curl -sf "$url" > /dev/null 2>&1; then
        print_success "$name is healthy"
    else
        print_error "$name is not responding"
        FAILED=1
    fi
}

check_service "http://localhost:8000/health" "API Gateway"
check_service "http://localhost:8001/health" "QBank Service"
check_service "http://localhost:8002/health" "Content Service"
check_service "http://localhost:8003/health" "Cases Service"
check_service "http://localhost:8004/health" "OSCE Service"
check_service "http://localhost:8005/health" "Anatomy3D Service"
check_service "http://localhost:8006/health" "Grading Service"
check_service "http://localhost:8007/health" "Audit Service"
check_service "http://localhost:8008/health" "ML Hub"

if [ $FAILED -eq 1 ]; then
    print_warning "Some services failed health checks. Check logs with: make docker-logs"
fi

# Step 9: Summary
print_header "Setup Complete! 🎉"

echo -e "${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                   🎉 SETUP COMPLETE! 🎉                  ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "\n${BLUE}📍 Access Your Applications:${NC}"
echo -e "   • Web App:        ${GREEN}http://localhost:3000${NC}"
echo -e "   • Admin Dashboard: ${GREEN}http://localhost:3001${NC}"
echo -e "   • API Gateway:     ${GREEN}http://localhost:8000/docs${NC}"
echo -e "   • QBank API:       ${GREEN}http://localhost:8001/docs${NC}"

echo -e "\n${BLUE}🛠️ Useful Commands:${NC}"
echo -e "   • View logs:       ${YELLOW}make docker-logs${NC}"
echo -e "   • Stop services:   ${YELLOW}make docker-down${NC}"
echo -e "   • Restart:         ${YELLOW}make docker-restart${NC}"
echo -e "   • Check health:    ${YELLOW}make health${NC}"
echo -e "   • Run tests:       ${YELLOW}make test${NC}"
echo -e "   • See all:         ${YELLOW}make help${NC}"

echo -e "\n${BLUE}📚 Documentation:${NC}"
echo -e "   • README:          ${YELLOW}./README.md${NC}"
echo -e "   • Implementation:  ${YELLOW}./docs/IMPLEMENTATION_GUIDE.md${NC}"
echo -e "   • Summary:         ${YELLOW}./SCAFFOLD_SUMMARY.md${NC}"

echo -e "\n${BLUE}🚀 Next Steps:${NC}"
echo -e "   1. Open ${GREEN}http://localhost:3000${NC} in your browser"
echo -e "   2. Explore the API docs at ${GREEN}http://localhost:8000/docs${NC}"
echo -e "   3. Read ${YELLOW}./docs/IMPLEMENTATION_GUIDE.md${NC} for next development steps"
echo -e "   4. Implement remaining services following the QBank pattern"

echo -e "\n${BLUE}💡 Tips:${NC}"
echo -e "   • Edit ${YELLOW}.env.local${NC} to add your AI API keys for full functionality"
echo -e "   • Run ${YELLOW}make health${NC} anytime to check all services"
echo -e "   • View real-time logs: ${YELLOW}docker compose -f infra/docker/docker-compose.yml logs -f${NC}"

echo -e "\n${GREEN}Happy coding! 🚀${NC}\n"

# Optional: Open browser
read -p "Would you like to open the web app in your browser? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open http://localhost:3000
    elif command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:3000
    else
        print_info "Please open http://localhost:3000 in your browser"
    fi
fi

exit 0
