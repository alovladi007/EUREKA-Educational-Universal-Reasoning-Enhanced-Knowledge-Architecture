#!/bin/bash

# AI Tutor Service - Fix Installation Script
# This script applies all fixes to your AI Tutor service

set -e  # Exit on error

echo "🔧 AI Tutor Service - Fix Installation"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -d "services/tutor-llm" ]; then
    echo "❌ Error: services/tutor-llm directory not found"
    echo "Please run this script from the EUREKA root directory"
    exit 1
fi

echo "✅ Found tutor-llm service"
echo ""

# Backup existing files
echo "📦 Creating backups..."
BACKUP_DIR="services/tutor-llm/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

if [ -f "services/tutor-llm/app/schemas/__init__.py" ]; then
    cp services/tutor-llm/app/schemas/__init__.py "$BACKUP_DIR/schemas_init.py.backup"
    echo "  ✅ Backed up schemas/__init__.py"
fi

if [ -f "services/tutor-llm/app/crud/__init__.py" ]; then
    cp services/tutor-llm/app/crud/__init__.py "$BACKUP_DIR/crud_init.py.backup"
    echo "  ✅ Backed up crud/__init__.py"
fi

if [ -f "services/tutor-llm/app/api/v1/__init__.py" ]; then
    cp services/tutor-llm/app/api/v1/__init__.py "$BACKUP_DIR/api_v1_init.py.backup"
    echo "  ✅ Backed up api/v1/__init__.py"
fi

echo ""
echo "📝 Backups saved to: $BACKUP_DIR"
echo ""

# Apply fixes
echo "🔨 Applying fixes..."

# Fix 1: Schemas
if [ -f "schemas.py" ]; then
    cp schemas.py services/tutor-llm/app/schemas/__init__.py
    echo "  ✅ Updated schemas/__init__.py"
else
    echo "  ⚠️  schemas.py not found - skipping"
fi

# Fix 2: CRUD
if [ -f "crud.py" ]; then
    cp crud.py services/tutor-llm/app/crud/__init__.py
    echo "  ✅ Updated crud/__init__.py"
else
    echo "  ⚠️  crud.py not found - skipping"
fi

# Fix 3: API endpoints
if [ -f "api_endpoints.py" ]; then
    cp api_endpoints.py services/tutor-llm/app/api/v1/__init__.py
    echo "  ✅ Updated api/v1/__init__.py"
else
    echo "  ⚠️  api_endpoints.py not found - skipping"
fi

echo ""
echo "🧪 Verifying fixes..."

cd services/tutor-llm

# Check Python syntax
echo "  Checking Python syntax..."
python3 -m py_compile app/schemas/__init__.py 2>/dev/null && echo "    ✅ schemas/__init__.py - OK" || echo "    ❌ schemas/__init__.py - SYNTAX ERROR"
python3 -m py_compile app/crud/__init__.py 2>/dev/null && echo "    ✅ crud/__init__.py - OK" || echo "    ❌ crud/__init__.py - SYNTAX ERROR"
python3 -m py_compile app/api/v1/__init__.py 2>/dev/null && echo "    ✅ api/v1/__init__.py - OK" || echo "    ❌ api/v1/__init__.py - SYNTAX ERROR"

echo ""
echo "  Checking imports..."
python3 -c "from app.schemas import ConversationWithMessages; print('    ✅ ConversationWithMessages imported')" 2>/dev/null || echo "    ❌ Failed to import ConversationWithMessages"
python3 -c "from app.crud import create_or_update_knowledge; print('    ✅ CRUD functions imported')" 2>/dev/null || echo "    ❌ Failed to import CRUD"
python3 -c "from app.api.v1 import router; print('    ✅ API router imported')" 2>/dev/null || echo "    ❌ Failed to import API router"

cd ../..

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start the service: cd services/tutor-llm && python main.py"
echo "2. Test health: curl http://localhost:8002/health"
echo "3. View API docs: http://localhost:8002/docs"
echo ""
echo "📦 Backups are in: $BACKUP_DIR"
echo "   If something goes wrong, you can restore from there."
echo ""
echo "🎉 Your AI Tutor service is now fixed and ready to use!"
