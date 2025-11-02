#!/bin/bash

echo "=========================================="
echo "Commercial Platform - Quick Setup"
echo "=========================================="
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}Step 1: Setting up Backend${NC}"
cd backend

echo "Installing backend dependencies..."
npm install

if [ ! -f .env ]; then
  echo "Creating .env file..."
  cp .env.example .env
  echo -e "${GREEN}✓ Created .env file${NC}"
  echo -e "${RED}⚠ Please update the .env file with your configuration${NC}"
else
  echo ".env file already exists"
fi

mkdir -p uploads
echo -e "${GREEN}✓ Created uploads directory${NC}"

echo ""
echo -e "${BLUE}Step 2: Setting up Frontend${NC}"
cd ../frontend

echo "Installing frontend dependencies..."
npm install

if [ ! -f .env.local ]; then
  echo "Creating .env.local file..."
  cp .env.local.example .env.local
  echo -e "${GREEN}✓ Created .env.local file${NC}"
  echo -e "${RED}⚠ Please update the .env.local file${NC}"
else
  echo ".env.local file already exists"
fi

cd ..

echo ""
echo "=========================================="
echo -e "${GREEN}Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Set up PostgreSQL: createdb commercial_platform"
echo "2. Update backend/.env with your configuration"
echo "3. Run migrations: cd backend && npm run migrate"
echo "4. Start backend: cd backend && npm run dev"
echo "5. Start frontend: cd frontend && npm run dev"
echo "6. Open http://localhost:3000"
echo ""
echo "For details, see README.md"
echo "=========================================="
