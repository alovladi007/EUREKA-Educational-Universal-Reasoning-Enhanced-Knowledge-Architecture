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
  echo Created .env file
  echo Please update the .env file with your configuration
) else (
  echo .env file already exists
)

if not exist uploads mkdir uploads
echo Created uploads directory

echo.
echo Step 2: Setting up Frontend
cd ..\frontend

echo Installing frontend dependencies...
call npm install

if not exist .env.local (
  echo Creating .env.local file...
  copy .env.local.example .env.local
  echo Created .env.local file
  echo Please update the .env.local file
) else (
  echo .env.local file already exists
)

cd ..

echo.
echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Set up PostgreSQL: createdb commercial_platform
echo 2. Update backend\.env with your configuration
echo 3. Run migrations: cd backend ^&^& npm run migrate
echo 4. Start backend: cd backend ^&^& npm run dev
echo 5. Start frontend: cd frontend ^&^& npm run dev
echo 6. Open http://localhost:3000
echo.
echo For details, see README.md
echo ==========================================
pause
