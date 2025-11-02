#!/bin/bash

echo "=========================================="
echo "Commercial Platform - Quick Setup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Setting up Backend${NC}"
cd backend

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Create .env from example
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cp .env.example .env
  echo -e "${GREEN}✓ Created .env file${NC}"
  echo -e "${RED}⚠ Please update the .env file with your database credentials and API keys${NC}"
else
  echo ".env file already exists, skipping..."
fi

# Create uploads directory
mkdir -p uploads
echo -e "${GREEN}✓ Created uploads directory${NC}"

echo ""
echo -e "${BLUE}Step 2: Setting up Frontend${NC}"
cd ../frontend

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Create .env.local from example
if [ ! -f .env.local ]; then
  echo "Creating .env.local file..."
  cp .env.local.example .env.local
  echo -e "${GREEN}✓ Created .env.local file${NC}"
  echo -e "${RED}⚠ Please update the .env.local file with your API URL and Stripe key${NC}"
else
  echo ".env.local file already exists, skipping..."
fi

cd ..

echo ""
echo "=========================================="
echo -e "${GREEN}Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Set up PostgreSQL database:"
echo "   createdb commercial_platform"
echo ""
echo "2. Update backend/.env with your configuration"
echo ""
echo "3. Run database migrations:"
echo "   cd backend && npm run migrate"
echo ""
echo "4. Start the backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "5. In a new terminal, start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "6. Open http://localhost:3000 in your browser"
echo ""
echo "For detailed instructions, see README.md"
echo "=========================================="
