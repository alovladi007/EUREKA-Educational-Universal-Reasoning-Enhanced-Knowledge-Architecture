# ⚡ Quick Start Guide

Get your Commercial Platform running in 5 minutes!

## Step 1: Install PostgreSQL

### Mac
```bash
brew install postgresql
brew services start postgresql
```

### Ubuntu/Debian
```bash
sudo apt-get install postgresql
sudo service postgresql start
```

### Windows
Download from: https://www.postgresql.org/download/windows/

## Step 2: Create Database

```bash
createdb commercial_platform
```

## Step 3: Run Setup Script

### Mac/Linux
```bash
chmod +x setup.sh
./setup.sh
```

### Windows
```cmd
setup.bat
```

## Step 4: Configure Environment

### Backend (.env)
Update these required values:
```env
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_key
```

### Frontend (.env.local)
Update:
```env
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_key
```

## Step 5: Run Migrations

```bash
cd backend
npm run migrate
```

## Step 6: Start the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

## Step 7: Open Browser

Visit: **http://localhost:3000**

## Step 8: Create Account

1. Click "Get Started"
2. Fill in your details
3. Click "Create Account"

## 🎉 That's It!

You're ready to:
- ✅ Create projects
- ✅ Manage tasks
- ✅ Upload files
- ✅ Process payments (test mode)
- ✅ Search everything
- ✅ Get real-time updates

## 🐛 Troubleshooting

### Database Connection Error
```bash
psql -U postgres -c "SELECT 1"
```

### Port Already in Use
```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```bash
cd backend && npm install
cd ../frontend && npm install
```

## 💡 Tips

1. **Test Payments**: Use Stripe test card `4242 4242 4242 4242`
2. **Multiple Users**: Register multiple accounts to test collaboration
3. **Real-time**: Open app in multiple browsers to see live updates

---

For detailed documentation, see README.md
