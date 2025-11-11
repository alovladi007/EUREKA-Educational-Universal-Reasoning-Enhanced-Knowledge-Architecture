#!/bin/bash

# EUREKA Test Prep Platform - Setup Script

echo "🚀 EUREKA Test Prep Platform Setup"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
        exit 1
    fi
}

# Check prerequisites
echo "Checking prerequisites..."

if command_exists python3; then
    print_status 0 "Python 3 is installed"
else
    print_status 1 "Python 3 is not installed. Please install Python 3.11+"
fi

if command_exists node; then
    print_status 0 "Node.js is installed"
else
    print_status 1 "Node.js is not installed. Please install Node.js 18+"
fi

if command_exists docker; then
    print_status 0 "Docker is installed"
else
    echo -e "${YELLOW}⚠${NC} Docker is not installed (optional for containerized deployment)"
fi

if command_exists psql; then
    print_status 0 "PostgreSQL client is installed"
else
    echo -e "${YELLOW}⚠${NC} PostgreSQL is not installed (required for local development)"
fi

echo ""
echo "Select installation type:"
echo "1) Local Development"
echo "2) Docker Deployment"
echo "3) Production Setup"
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "Setting up for Local Development..."
        echo "-----------------------------------"
        
        # Backend setup
        echo ""
        echo "Setting up Backend..."
        cd backend
        
        # Create virtual environment
        python3 -m venv venv
        print_status $? "Virtual environment created"
        
        # Activate virtual environment
        source venv/bin/activate
        
        # Install dependencies
        pip install -r requirements.txt
        print_status $? "Backend dependencies installed"
        
        # Copy environment file
        cd ..
        if [ ! -f .env ]; then
            cp .env.example .env
            print_status $? "Environment file created"
            echo -e "${YELLOW}⚠${NC} Please edit .env file with your configuration"
        fi
        
        # Frontend setup
        echo ""
        echo "Setting up Frontend..."
        cd frontend
        
        # Install dependencies
        npm install
        print_status $? "Frontend dependencies installed"
        
        cd ..
        
        echo ""
        echo -e "${GREEN}✓${NC} Local development setup complete!"
        echo ""
        echo "Next steps:"
        echo "1. Edit .env file with your database configuration"
        echo "2. Run 'make migrate' to create database tables"
        echo "3. Run 'make seed' to add sample data"
        echo "4. Run 'make dev' to start the development servers"
        ;;
        
    2)
        echo ""
        echo "Setting up Docker Deployment..."
        echo "-------------------------------"
        
        # Check Docker
        if ! command_exists docker; then
            print_status 1 "Docker is required for this installation type"
        fi
        
        if ! command_exists docker-compose; then
            print_status 1 "Docker Compose is required for this installation type"
        fi
        
        # Copy environment file
        if [ ! -f .env ]; then
            cp .env.example .env
            print_status $? "Environment file created"
        fi
        
        # Build containers
        cd docker
        docker-compose build
        print_status $? "Docker containers built"
        
        # Start containers
        docker-compose up -d
        print_status $? "Docker containers started"
        
        # Wait for database to be ready
        echo "Waiting for database to be ready..."
        sleep 10
        
        # Run migrations
        docker exec eureka-backend alembic upgrade head
        print_status $? "Database migrations completed"
        
        # Seed database
        docker exec eureka-backend python seed_database.py
        print_status $? "Database seeded with sample data"
        
        cd ..
        
        echo ""
        echo -e "${GREEN}✓${NC} Docker deployment complete!"
        echo ""
        echo "Access the application at:"
        echo "- Frontend: http://localhost:3000"
        echo "- Backend API: http://localhost:8000"
        echo "- API Documentation: http://localhost:8000/docs"
        echo ""
        echo "To stop: docker-compose down"
        echo "To view logs: docker-compose logs -f"
        ;;
        
    3)
        echo ""
        echo "Setting up for Production..."
        echo "----------------------------"
        
        # Production setup
        echo "Building frontend for production..."
        cd frontend
        npm install --production
        npm run build
        print_status $? "Frontend built for production"
        
        cd ../backend
        pip install -r requirements.txt --no-dev
        print_status $? "Backend dependencies installed (production)"
        
        cd ..
        
        echo ""
        echo -e "${GREEN}✓${NC} Production build complete!"
        echo ""
        echo "Deploy the following:"
        echo "- Frontend: frontend/build directory"
        echo "- Backend: Use gunicorn or uvicorn to serve the API"
        echo ""
        echo "Example production commands:"
        echo "Backend: gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker"
        echo "Frontend: Serve the build directory with nginx or similar"
        ;;
        
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo "=================================="
echo "🎉 Setup Complete!"
echo ""
echo "Test credentials:"
echo "Username: student"
echo "Password: student123"
echo ""
echo "For help, see README.md or run 'make help'"
