@echo off
echo ==========================================
echo Commercial Platform - Quick Setup
echo ==========================================
echo.

echo Step 1: Setting up Backend
cd backend

echo Installing backend dependencies...
call npm install

if not exist .env (
  echo Creating .env file...
  copy .env.example .env
  echo [32m✓ Created .env file[0m
  echo [31m⚠ Please update the .env file with your database credentials and API keys[0m
) else (
  echo .env file already exists, skipping...
)

if not exist uploads mkdir uploads
echo [32m✓ Created uploads directory[0m

echo.
echo Step 2: Setting up Frontend
cd ..\frontend

echo Installing frontend dependencies...
call npm install

if not exist .env.local (
  echo Creating .env.local file...
  copy .env.local.example .env.local
  echo [32m✓ Created .env.local file[0m
  echo [31m⚠ Please update the .env.local file with your API URL and Stripe key[0m
) else (
  echo .env.local file already exists, skipping...
)

cd ..

echo.
echo ==========================================
echo [32mSetup Complete![0m
echo ==========================================
echo.
echo Next steps:
echo 1. Set up PostgreSQL database:
echo    createdb commercial_platform
echo.
echo 2. Update backend\.env with your configuration
echo.
echo 3. Run database migrations:
echo    cd backend ^&^& npm run migrate
echo.
echo 4. Start the backend server:
echo    cd backend ^&^& npm run dev
echo.
echo 5. In a new terminal, start the frontend:
echo    cd frontend ^&^& npm run dev
echo.
echo 6. Open http://localhost:3000 in your browser
echo.
echo For detailed instructions, see README.md
echo ==========================================
pause
