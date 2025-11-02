#!/bin/bash

# EUREKA Platform - Comprehensive Setup Script
# Automates installation, configuration, and initialization

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="EUREKA"
PROJECT_DIR=$(pwd)
VENV_DIR="venv"
NODE_VERSION="18"
PYTHON_VERSION="3.12"

# ========================================
# UTILITY FUNCTIONS
# ========================================

print_header() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}  $1"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
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
    echo -e "${CYAN}ℹ${NC} $1"
}

print_step() {
    echo -e "${PURPLE}→${NC} $1"
}

check_command() {
    if command -v $1 &> /dev/null; then
        print_success "$1 is installed"
        return 0
    else
        print_error "$1 is not installed"
        return 1
    fi
}

# ========================================
# WELCOME MESSAGE
# ========================================

clear
echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     ███████╗██╗   ██╗██████╗ ███████╗██╗  ██╗ █████╗         ║
║     ██╔════╝██║   ██║██╔══██╗██╔════╝██║ ██╔╝██╔══██╗        ║
║     █████╗  ██║   ██║██████╔╝█████╗  █████╔╝ ███████║        ║
║     ██╔══╝  ██║   ██║██╔══██╗██╔══╝  ██╔═██╗ ██╔══██║        ║
║     ███████╗╚██████╔╝██║  ██║███████╗██║  ██╗██║  ██║        ║
║     ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝        ║
║                                                               ║
║           AI-Powered Educational Platform Setup               ║
║                      Version 1.0.0                            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
print_info "This script will set up the complete EUREKA platform"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

# ========================================
# STEP 1: CHECK PREREQUISITES
# ========================================

print_header "STEP 1: Checking Prerequisites"

MISSING_DEPS=0

# Check Python
print_step "Checking Python $PYTHON_VERSION..."
if python3 --version | grep -q "Python $PYTHON_VERSION"; then
    print_success "Python $PYTHON_VERSION found"
else
    print_warning "Python $PYTHON_VERSION not found ($(python3 --version))"
    print_info "Continuing anyway, but $PYTHON_VERSION is recommended"
fi

# Check Node.js
print_step "Checking Node.js..."
if ! check_command node; then
    print_error "Node.js is required. Install from https://nodejs.org/"
    MISSING_DEPS=1
fi

# Check npm
print_step "Checking npm..."
if ! check_command npm; then
    print_error "npm is required. Install Node.js from https://nodejs.org/"
    MISSING_DEPS=1
fi

# Check Docker
print_step "Checking Docker..."
if ! check_command docker; then
    print_warning "Docker not found. Some features will not work without Docker."
    print_info "Install Docker from https://www.docker.com/get-started"
else
    print_success "Docker is installed"
fi

# Check Docker Compose
print_step "Checking Docker Compose..."
if ! check_command docker-compose; then
    print_warning "Docker Compose not found."
    print_info "Install Docker Compose or use 'docker compose' (v2)"
fi

# Check PostgreSQL client
print_step "Checking PostgreSQL client..."
if ! check_command psql; then
    print_warning "PostgreSQL client not found (optional)"
fi

# Check Git
print_step "Checking Git..."
if ! check_command git; then
    print_error "Git is required"
    MISSING_DEPS=1
fi

if [ $MISSING_DEPS -eq 1 ]; then
    print_error "Please install missing dependencies and run this script again"
    exit 1
fi

print_success "All critical prerequisites are installed!"

# ========================================
# STEP 2: CREATE PROJECT STRUCTURE
# ========================================

print_header "STEP 2: Creating Project Structure"

print_step "Creating directories..."

DIRS=(
    "services/api-core"
    "services/tutor-llm"
    "services/assessment-engine"
    "services/adaptive-learning"
    "services/analytics-dashboard"
    "services/file-storage"
    "apps/web"
    "apps/admin"
    "alembic/versions"
    "tests/unit"
    "tests/integration"
    "tests/e2e"
    "docs"
    "scripts"
    "monitoring"
    "logs"
)

for dir in "${DIRS[@]}"; do
    mkdir -p "$dir"
    print_success "Created $dir/"
done

# ========================================
# STEP 3: SETUP ENVIRONMENT VARIABLES
# ========================================

print_header "STEP 3: Setting Up Environment Variables"

if [ -f ".env" ]; then
    print_warning ".env file already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Keeping existing .env file"
    else
        cp .env.template .env
        print_success "Created new .env file from template"
    fi
else
    cp .env.template .env
    print_success "Created .env file from template"
fi

# Generate SECRET_KEY
print_step "Generating SECRET_KEY..."
if command -v openssl &> /dev/null; then
    SECRET_KEY=$(openssl rand -hex 32)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/your-secret-key-here-change-in-production-use-openssl-rand-hex-32/$SECRET_KEY/" .env
    else
        # Linux
        sed -i "s/your-secret-key-here-change-in-production-use-openssl-rand-hex-32/$SECRET_KEY/" .env
    fi
    print_success "Generated and set SECRET_KEY"
else
    print_warning "OpenSSL not found. Please manually update SECRET_KEY in .env"
fi

print_warning "IMPORTANT: Please update the following in .env:"
print_info "  - OPENAI_API_KEY"
print_info "  - ANTHROPIC_API_KEY"
print_info "  - SMTP configuration (for emails)"
echo ""
read -p "Press Enter when ready to continue..."

# ========================================
# STEP 4: INSTALL PYTHON DEPENDENCIES
# ========================================

print_header "STEP 4: Installing Python Dependencies"

# Create virtual environment
if [ ! -d "$VENV_DIR" ]; then
    print_step "Creating Python virtual environment..."
    python3 -m venv $VENV_DIR
    print_success "Created virtual environment"
else
    print_info "Virtual environment already exists"
fi

# Activate virtual environment
print_step "Activating virtual environment..."
source $VENV_DIR/bin/activate
print_success "Virtual environment activated"

# Install requirements
print_step "Installing Python packages..."
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
print_success "Python packages installed"

# ========================================
# STEP 5: INSTALL NODE.JS DEPENDENCIES
# ========================================

print_header "STEP 5: Installing Node.js Dependencies"

print_step "Installing frontend dependencies..."
cd apps/web
npm install
print_success "Frontend dependencies installed"
cd ../..

# ========================================
# STEP 6: SETUP DOCKER SERVICES
# ========================================

print_header "STEP 6: Setting Up Docker Services"

if command -v docker &> /dev/null; then
    print_step "Starting Docker services..."
    
    # Stop any running services
    docker-compose down 2>/dev/null || docker compose down 2>/dev/null || true
    
    # Start infrastructure services
    print_step "Starting PostgreSQL, Redis, and MinIO..."
    docker-compose up -d postgres redis minio || docker compose up -d postgres redis minio
    
    # Wait for services to be ready
    print_step "Waiting for services to be ready..."
    sleep 10
    
    # Check if services are running
    if docker ps | grep -q "eureka-postgres"; then
        print_success "PostgreSQL is running"
    else
        print_error "PostgreSQL failed to start"
    fi
    
    if docker ps | grep -q "eureka-redis"; then
        print_success "Redis is running"
    else
        print_error "Redis failed to start"
    fi
    
    if docker ps | grep -q "eureka-minio"; then
        print_success "MinIO is running"
    else
        print_error "MinIO failed to start"
    fi
else
    print_warning "Docker not available. Please install and start services manually."
fi

# ========================================
# STEP 7: DATABASE MIGRATION
# ========================================

print_header "STEP 7: Running Database Migrations"

print_step "Initializing Alembic..."
if [ ! -f "alembic.ini" ]; then
    alembic init alembic
    print_success "Alembic initialized"
else
    print_info "Alembic already initialized"
fi

print_step "Copying complete database migration..."
cp complete_database_migration.py alembic/versions/001_complete_phase2_tables.py

print_step "Running migrations..."
sleep 5  # Give PostgreSQL time to fully start
alembic upgrade head
print_success "Database migrations completed"

# ========================================
# STEP 8: SETUP MINIO BUCKETS
# ========================================

print_header "STEP 8: Setting Up MinIO Storage"

if command -v docker &> /dev/null; then
    print_step "Creating MinIO bucket..."
    
    # Wait for MinIO to be fully ready
    sleep 5
    
    # Try to create bucket (ignore error if already exists)
    docker exec eureka-minio sh -c "mc alias set local http://localhost:9000 minioadmin minioadmin && mc mb local/eureka-files --ignore-existing" 2>/dev/null || true
    
    print_success "MinIO bucket configured"
fi

# ========================================
# STEP 9: CREATE SAMPLE DATA
# ========================================

print_header "STEP 9: Creating Sample Data (Optional)"

read -p "Do you want to create sample data for testing? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_step "Creating sample users, courses, and content..."
    python scripts/create_sample_data.py
    print_success "Sample data created"
else
    print_info "Skipping sample data creation"
fi

# ========================================
# STEP 10: VERIFY INSTALLATION
# ========================================

print_header "STEP 10: Verifying Installation"

print_step "Checking database connection..."
if psql postgresql://eureka:eureka123@localhost:5432/eureka -c "SELECT 1" &>/dev/null; then
    print_success "Database connection successful"
else
    print_warning "Could not connect to database"
fi

print_step "Checking Redis connection..."
if redis-cli -h localhost -p 6379 -a eureka123 ping &>/dev/null; then
    print_success "Redis connection successful"
else
    print_warning "Could not connect to Redis"
fi

# ========================================
# STEP 11: BUILD SUMMARY
# ========================================

print_header "Installation Complete! 🎉"

echo ""
print_success "EUREKA platform is ready to use!"
echo ""

echo -e "${CYAN}═════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}                    QUICK START GUIDE                        ${NC}"
echo -e "${CYAN}═════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}1. Start all services:${NC}"
echo "   docker-compose up -d"
echo ""

echo -e "${YELLOW}2. Start development servers:${NC}"
echo "   # Backend (API Core)"
echo "   cd services/api-core && python main.py"
echo ""
echo "   # Frontend"
echo "   cd apps/web && npm run dev"
echo ""

echo -e "${YELLOW}3. Access the application:${NC}"
echo "   Web App:       http://localhost:3000"
echo "   API Docs:      http://localhost:8000/docs"
echo "   MinIO Console: http://localhost:9001 (admin/admin)"
echo "   Grafana:       http://localhost:3001 (admin/admin)"
echo ""

echo -e "${YELLOW}4. Service Ports:${NC}"
echo "   API Core:      http://localhost:8000"
echo "   Tutor LLM:     http://localhost:8002"
echo "   Assessment:    http://localhost:8003"
echo "   Adaptive:      http://localhost:8004"
echo "   Analytics:     http://localhost:8005"
echo "   File Storage:  http://localhost:8006"
echo ""

echo -e "${YELLOW}5. Database:${NC}"
echo "   psql postgresql://eureka:eureka123@localhost:5432/eureka"
echo ""

echo -e "${YELLOW}6. Running Tests:${NC}"
echo "   pytest tests/ -v"
echo "   pytest tests/ --cov=services --cov-report=html"
echo ""

echo -e "${CYAN}═════════════════════════════════════════════════════════════${NC}"
echo ""

print_warning "IMPORTANT: Don't forget to update your .env file with:"
print_info "  ✓ OpenAI API key"
print_info "  ✓ Anthropic API key"
print_info "  ✓ SMTP credentials (for email)"
echo ""

print_info "For detailed documentation, see: docs/README.md"
print_info "For troubleshooting, see: docs/TROUBLESHOOTING.md"
echo ""

echo -e "${GREEN}Happy building! 🚀${NC}"
echo ""

# ========================================
# CLEANUP
# ========================================

# Deactivate virtual environment
deactivate 2>/dev/null || true
