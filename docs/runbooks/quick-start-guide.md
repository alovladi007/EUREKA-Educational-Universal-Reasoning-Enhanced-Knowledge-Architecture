# Test Prep Platform - Quick Start Guide

## 🚀 Get Started in 15 Minutes

This guide will help you set up and run the Test Prep Platform locally.

---

## Step 1: Clone and Setup (2 minutes)

```bash
# Clone repository
git clone https://github.com/your-org/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture.git
cd EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture
```

---

## Step 2: Database Setup (3 minutes)

```bash
# Create database
createdb eureka

# Run migrations
psql -d eureka -f "COMPLETE DATABASE SCHEMA - FULLY WORKING & VERIFIED/init_complete.sql"
psql -d eureka -f "database/migrations/add-test-prep-subscriptions.sql"

# Verify installation
psql -d eureka -c "SELECT COUNT(*) FROM test_prep_plans;"
# Expected: 9 (3 plans for MCAT, USMLE, LSAT)
```

---

## Step 3: Backend API Setup (5 minutes)

```bash
cd services/test-prep

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eureka
DB_USER=postgres
DB_PASSWORD=postgres

PORT=3010
NODE_ENV=development
FRONTEND_URL=http://localhost:3006
CORS_ORIGIN=http://localhost:3006

# Use test mode for Stripe
STRIPE_SECRET_KEY=sk_test_51234567890
STRIPE_PUBLISHABLE_KEY=pk_test_51234567890
STRIPE_WEBHOOK_SECRET=whsec_test_12345

JWT_SECRET=test_secret_change_in_production
JWT_EXPIRES_IN=7d
EOF

# Start the API server
npm run dev
```

You should see:
```
✅ Test Prep API Server running on port 3010
📚 Environment: development
🔗 Health check: http://localhost:3010/health
```

---

## Step 4: Frontend Setup (5 minutes)

```bash
# Open new terminal
cd eureka/apps/web

# Install dependencies (if not already done)
npm install

# Add API endpoint to environment
echo "NEXT_PUBLIC_TEST_PREP_API=http://localhost:3010" >> .env.local

# Start the frontend
npm run dev
```

You should see:
```
▲ Next.js 14.0.0
- Local:        http://localhost:3006
- ready started server on 0.0.0.0:3006
```

---

## Step 5: Test the Platform

### Test 1: View Pricing Plans

1. Open browser: http://localhost:3006/test-prep/pricing
2. You should see pricing cards for MCAT, USMLE, and LSAT
3. Toggle between exam categories

### Test 2: API Health Check

```bash
curl http://localhost:3010/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "test-prep-api",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "database": "connected"
}
```

### Test 3: Fetch Plans

```bash
curl http://localhost:3010/api/plans?exam_category=MCAT
```

Expected: JSON array with 3 MCAT plans

---

## What's Included Out of the Box

### ✅ Database Schema
- Subscription plans for 3 exams (MCAT, USMLE, LSAT)
- User subscription management
- Content packages
- Progress tracking
- Video notes

### ✅ Backend API
- Subscription management endpoints
- Access control middleware
- Progress tracking
- Video notes CRUD
- Stripe integration (ready)

### ✅ Frontend Pages
- `/test-prep/pricing` - Subscription selection
- `/test-prep` - Main dashboard
- `/test-prep/watch/[id]` - Video player with notes

### ✅ Features
- **Option 1**: Test Prep Only OR QBank Only
- **Option 2**: Complete Bundle
- Video player with synchronized notes
- Progress tracking
- Subscription management

---

## Next Steps

### 1. Setup Stripe (Optional for Testing)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3010/api/webhooks/stripe

# Copy webhook secret to .env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Add Test Videos

```bash
# Upload videos to your S3 bucket or use test URLs
# Update content_items table with video URLs
```

### 3. Create Test User

```sql
INSERT INTO users (
  id, org_id, email, hashed_password,
  first_name, last_name, role, is_active, is_email_verified
) VALUES (
  uuid_generate_v4(),
  '550e8400-e29b-41d4-a716-446655440000',
  'student@test.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5jtJ3qKQEKKVW',
  'Test',
  'Student',
  'student',
  true,
  true
);
```

### 4. Create Test Subscription

```sql
INSERT INTO test_prep_subscriptions (
  user_id,
  plan_id,
  status,
  start_date,
  end_date
) VALUES (
  (SELECT id FROM users WHERE email = 'student@test.com'),
  (SELECT id FROM test_prep_plans WHERE plan_type = 'complete_bundle' LIMIT 1),
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP + INTERVAL '30 days'
);
```

### 5. Test Video Player

1. Navigate to: http://localhost:3006/test-prep
2. Click on a content package
3. Video player should load with notes sidebar
4. Try adding notes at different timestamps

---

## Troubleshooting

### Port Already in Use

```bash
# Find process
lsof -i :3010

# Kill process
kill -9 <PID>
```

### Database Connection Error

```bash
# Check PostgreSQL is running
pg_isready

# Check connection
psql -d eureka -c "SELECT 1;"
```

### Frontend Not Loading

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Restart
npm run dev
```

---

## Default Test Accounts

After running the seed data, you have:

**Admin Account:**
- Email: admin@demo.edu
- Password: Admin123!

**Test Organization:**
- Name: Demo University
- Slug: demo-university
- Tier: undergraduate

---

## Available Plans

### MCAT
1. **Test Prep Only** - $79.99/month
   - 120+ hours of video
   - Study notes
   - Analytics

2. **QBank Only** - $59.99/month
   - 3000+ questions
   - 5 practice exams

3. **Complete Bundle** - $119.99/month
   - Everything included
   - 10 practice exams
   - 2 hours tutoring

### USMLE
Similar structure with 4000+ questions

### LSAT
Similar structure with 2500+ questions and 10-15 practice tests

---

## Development URLs

- **Frontend**: http://localhost:3006
- **Test Prep API**: http://localhost:3010
- **API Health**: http://localhost:3010/health
- **Pricing Page**: http://localhost:3006/test-prep/pricing
- **Dashboard**: http://localhost:3006/test-prep

---

## Common Commands

```bash
# Start all services
npm run dev  # In both services/test-prep and eureka/apps/web

# Check API health
curl http://localhost:3010/health

# View logs
# Backend: Check terminal
# Frontend: Check browser console

# Database queries
psql -d eureka -c "SELECT * FROM test_prep_plans;"

# Reset database
psql -d eureka -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
# Then re-run migrations
```

---

## Support

- Check logs in terminal
- Review API responses in browser DevTools
- Check PostgreSQL logs: `tail -f /usr/local/var/log/postgres.log`

---

**You're all set! 🎉**

Start building and customizing your test prep platform!
