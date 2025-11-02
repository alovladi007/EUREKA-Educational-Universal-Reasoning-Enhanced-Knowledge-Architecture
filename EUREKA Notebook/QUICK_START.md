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
Download and install from: https://www.postgresql.org/download/windows/

## Step 2: Create Database

```bash
# Create the database
createdb commercial_platform

# Or using psql
psql -U postgres
CREATE DATABASE commercial_platform;
\q
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

### Backend Configuration (backend/.env)

Update these required values:
```env
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_key
```

Get your Stripe test keys from: https://dashboard.stripe.com/test/apikeys

### Frontend Configuration (frontend/.env.local)

Update:
```env
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_key
```

## Step 5: Run Migrations

```bash
cd backend
npm run migrate
```

You should see: "✅ All tables created successfully"

## Step 6: Start the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Wait for: "🚀 Commercial Platform Backend Server"

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Wait for: "ready - started server on 0.0.0.0:3000"

## Step 7: Open the Application

Open your browser and go to: **http://localhost:3000**

## Step 8: Create Your Account

1. Click "Get Started" or "Sign Up"
2. Fill in your details:
   - First Name
   - Last Name
   - Email
   - Password (min 6 characters)
3. Click "Create Account"

You'll be automatically logged in and redirected to the dashboard!

## 🎉 That's It!

You're now ready to:
- ✅ Create projects
- ✅ Manage tasks
- ✅ Upload files
- ✅ Process payments (in test mode)
- ✅ Search everything
- ✅ Get real-time updates

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# If not running, start it
# Mac: brew services start postgresql
# Linux: sudo service postgresql start
# Windows: Check Services app
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
# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
```

## 📚 Next Steps

- Read the full README.md for detailed documentation
- Check PROJECT_SUMMARY.md for complete feature list
- Explore the code in backend/ and frontend/
- Customize the platform for your needs

## 💡 Tips

1. **Test Payments**: Use Stripe test card: `4242 4242 4242 4242`
2. **Multiple Users**: Register multiple accounts to test collaboration
3. **Real-time**: Open app in multiple browsers to see live updates
4. **Search**: Try searching after creating some projects and tasks

## 🚀 Production Deployment

When ready for production:

1. Update environment variables
2. Use production database
3. Get real Stripe keys
4. Set NODE_ENV=production
5. Build frontend: `npm run build`
6. Deploy to your hosting platform

---

Need help? Check the README.md or review the code comments!
