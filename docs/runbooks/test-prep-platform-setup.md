# Test Prep Platform - Setup & Operations Runbook

## Table of Contents

1. [System Overview](#system-overview)
2. [Prerequisites](#prerequisites)
3. [Database Setup](#database-setup)
4. [Service Deployment](#service-deployment)
5. [Stripe Integration](#stripe-integration)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

---

## System Overview

The EUREKA Test Prep Platform provides two subscription options:

### **Option 1: Single Access**
- **Test Prep Only**: Videos + Study Notes
- **QBank Only**: Practice Questions + Exams

### **Option 2: Complete Bundle**
- Full access to Videos, Notes, AND QBanks

### Architecture Components

```
┌─────────────────────────────────────────────────┐
│           Frontend (Next.js)                    │
│  - Pricing Page                                 │
│  - Video Player with Notes                      │
│  - Dashboard                                    │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│      Test Prep API Service (Express)            │
│  - Subscription Management                      │
│  - Access Control                               │
│  - Progress Tracking                            │
│  - Video Notes CRUD                             │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│          PostgreSQL Database                    │
│  - Subscription Plans                           │
│  - User Subscriptions                           │
│  - Content Packages                             │
│  - Study Progress                               │
│  - Video Notes                                  │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│          External Services                      │
│  - Stripe (Payments)                            │
│  - S3/CDN (Video Storage)                       │
└─────────────────────────────────────────────────┘
```

---

## Prerequisites

### Required Software

- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: v14 or higher
- **npm**: v9.0.0 or higher
- **Git**: Latest version

### Required Accounts

- **Stripe Account**: For payment processing
- **AWS Account** (Optional): For video storage
- **SendGrid/Mailgun** (Optional): For email notifications

---

## Database Setup

### Step 1: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE eureka;

# Connect to the database
\c eureka
```

### Step 2: Run Base Schema

```bash
# Run the complete schema
psql -U postgres -d eureka -f COMPLETE\ DATABASE\ SCHEMA\ -\ FULLY\ WORKING\ \&\ VERIFIED/init_complete.sql
```

### Step 3: Add Test Prep Subscription Tables

```bash
# Run the test prep migration
psql -U postgres -d eureka -f database/migrations/add-test-prep-subscriptions.sql
```

### Step 4: Verify Installation

```sql
-- Check that tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'test_prep%';

-- Expected output:
-- test_prep_plans
-- test_prep_subscriptions
-- test_prep_content_packages
-- test_prep_payments
-- test_prep_progress
-- video_study_notes

-- Verify seed data
SELECT plan_name, plan_type, exam_category, price_usd
FROM test_prep_plans
WHERE is_active = true;
```

---

## Service Deployment

### Step 1: Install Test Prep API Service

```bash
cd services/test-prep

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

### Step 2: Configure Environment Variables

Edit `.env` file:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eureka
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Server
PORT=3010
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
CORS_ORIGIN=https://your-domain.com

# Stripe (Get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# JWT
JWT_SECRET=your_very_secure_random_string_here
JWT_EXPIRES_IN=7d

# Optional: S3 for videos
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=eureka-videos
```

### Step 3: Build and Start Service

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Or use PM2 for production
npm install -g pm2
pm2 start dist/app.js --name test-prep-api
pm2 save
pm2 startup
```

### Step 4: Verify Service is Running

```bash
# Health check
curl http://localhost:3010/health

# Expected response:
# {
#   "status": "healthy",
#   "service": "test-prep-api",
#   "timestamp": "2024-01-15T10:30:00.000Z",
#   "database": "connected"
# }
```

### Step 5: Setup Frontend

```bash
cd ../../eureka/apps/web

# Install dependencies
npm install

# Configure API endpoint
# Edit .env.local
echo "NEXT_PUBLIC_TEST_PREP_API=http://localhost:3010" >> .env.local

# Start frontend
npm run dev
```

---

## Stripe Integration

### Step 1: Create Stripe Products & Prices

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Create products for each plan
# Run this script:
```

```javascript
// create-stripe-products.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function createStripeProducts() {
  const plans = await pool.query('SELECT * FROM test_prep_plans WHERE is_active = true');

  for (const plan of plans.rows) {
    // Create product
    const product = await stripe.products.create({
      name: plan.plan_name,
      description: plan.description,
      metadata: {
        plan_id: plan.id,
        exam_category: plan.exam_category,
      }
    });

    // Create price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(plan.price_usd * 100), // Convert to cents
      currency: 'usd',
      recurring: {
        interval: plan.billing_period === 'monthly' ? 'month' : 'year'
      }
    });

    // Update database with Stripe IDs
    await pool.query(
      'UPDATE test_prep_plans SET stripe_product_id = $1, stripe_price_id = $2 WHERE id = $3',
      [product.id, price.id, plan.id]
    );

    console.log(`✅ Created product for ${plan.plan_name}`);
  }

  console.log('✅ All Stripe products created!');
  pool.end();
}

createStripeProducts();
```

```bash
# Run the script
node create-stripe-products.js
```

### Step 2: Setup Stripe Webhooks

```bash
# Forward webhooks to local development
stripe listen --forward-to localhost:3010/api/webhooks/stripe

# Copy the webhook signing secret and add to .env
# whsec_...
```

For production:

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter: `https://your-domain.com/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the signing secret to your `.env` file

### Step 3: Test Payment Flow

```bash
# Use Stripe test cards
# Card: 4242 4242 4242 4242
# Exp: Any future date
# CVC: Any 3 digits
```

---

## Monitoring & Maintenance

### Health Checks

```bash
# API Health
curl https://your-domain.com/api/health

# Database Connection
psql -U postgres -d eureka -c "SELECT 1;"

# Check active subscriptions
psql -U postgres -d eureka -c "
SELECT COUNT(*) as active_subscriptions
FROM test_prep_subscriptions
WHERE status = 'active';
"
```

### Daily Maintenance Tasks

```sql
-- 1. Update expired subscriptions
UPDATE test_prep_subscriptions
SET status = 'expired'
WHERE end_date < CURRENT_TIMESTAMP
  AND status = 'active';

-- 2. Check for failed payments
SELECT u.email, s.status, p.failure_reason
FROM test_prep_subscriptions s
JOIN users u ON s.user_id = u.id
LEFT JOIN test_prep_payments p ON p.subscription_id = s.id
WHERE s.status = 'past_due';

-- 3. Generate revenue report
SELECT
  DATE(created_at) as date,
  COUNT(*) as transactions,
  SUM(amount_usd) as revenue
FROM test_prep_payments
WHERE payment_status = 'succeeded'
  AND created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Backup Strategy

```bash
# Daily database backup
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/eureka"

pg_dump -U postgres eureka | gzip > $BACKUP_DIR/eureka_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "eureka_*.sql.gz" -mtime +30 -delete

echo "Backup completed: eureka_$DATE.sql.gz"
```

### Monitoring Queries

```sql
-- Active users per plan
SELECT
  p.plan_name,
  p.exam_category,
  COUNT(*) as active_users
FROM test_prep_subscriptions s
JOIN test_prep_plans p ON s.plan_id = p.id
WHERE s.status = 'active'
GROUP BY p.plan_name, p.exam_category;

-- Revenue by exam category (last 30 days)
SELECT
  pl.exam_category,
  COUNT(DISTINCT s.user_id) as subscribers,
  SUM(py.amount_usd) as revenue
FROM test_prep_payments py
JOIN test_prep_subscriptions s ON py.subscription_id = s.id
JOIN test_prep_plans pl ON s.plan_id = pl.id
WHERE py.created_at >= CURRENT_DATE - INTERVAL '30 days'
  AND py.payment_status = 'succeeded'
GROUP BY pl.exam_category;

-- User engagement metrics
SELECT
  COUNT(DISTINCT user_id) as active_students,
  AVG(total_study_time_minutes) as avg_study_time,
  AVG(completion_percentage) as avg_completion
FROM test_prep_progress
WHERE last_accessed_at >= CURRENT_DATE - INTERVAL '7 days';
```

---

## Troubleshooting

### Issue: Service Won't Start

```bash
# Check logs
pm2 logs test-prep-api

# Common issues:
# 1. Database connection
psql -U postgres -d eureka -c "SELECT 1;"

# 2. Port already in use
lsof -i :3010
kill -9 <PID>

# 3. Environment variables missing
cat .env | grep -E "DB_|STRIPE_"
```

### Issue: Payments Not Processing

```bash
# Check Stripe webhook events
stripe events list --limit 10

# Verify webhook secret
stripe webhooks list

# Test webhook locally
stripe trigger checkout.session.completed
```

### Issue: Videos Not Loading

```bash
# Check S3 bucket permissions
aws s3 ls s3://eureka-videos

# Verify CORS configuration
# S3 Bucket > Permissions > CORS

# Test direct video URL
curl -I https://your-bucket.s3.amazonaws.com/video.mp4
```

### Issue: Subscription Not Showing in Dashboard

```sql
-- Check subscription status
SELECT * FROM test_prep_subscriptions WHERE user_id = 'user-id-here';

-- Check access view
SELECT * FROM v_user_content_access WHERE user_id = 'user-id-here';

-- Verify plan is active
SELECT * FROM test_prep_plans WHERE id = 'plan-id-here';
```

### Issue: Notes Not Saving

```sql
-- Check table exists
\d video_study_notes

-- Check user permissions
SELECT * FROM video_study_notes WHERE user_id = 'user-id-here' LIMIT 5;

-- Check API logs
pm2 logs test-prep-api | grep "notes"
```

---

## Common Operations

### Add a New Exam Category

```sql
-- 1. Update enum type
ALTER TYPE exam_category ADD VALUE 'NEW_EXAM';

-- 2. Create plans for new exam
INSERT INTO test_prep_plans (...) VALUES (...);

-- 3. Create content packages
INSERT INTO test_prep_content_packages (...) VALUES (...);

-- 4. Create Stripe products
node create-stripe-products.js
```

### Update Pricing

```sql
-- Update plan price
UPDATE test_prep_plans
SET price_usd = 99.99,
    original_price_usd = 129.99
WHERE id = 'plan-id-here';

-- Create new Stripe price
-- Then update stripe_price_id
```

### Cancel User Subscription

```sql
UPDATE test_prep_subscriptions
SET status = 'cancelled',
    cancelled_at = CURRENT_TIMESTAMP
WHERE user_id = 'user-id-here'
  AND status = 'active';
```

### Generate Monthly Report

```sql
SELECT
  TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as month,
  COUNT(*) as new_subscriptions,
  SUM(amount_usd) as revenue,
  AVG(amount_usd) as avg_transaction
FROM test_prep_payments
WHERE payment_status = 'succeeded'
  AND created_at >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
```

---

## Security Checklist

- [ ] Environment variables are secure and not committed to git
- [ ] Database uses strong passwords
- [ ] Stripe webhook signatures are verified
- [ ] API endpoints require authentication
- [ ] HTTPS is enabled in production
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] SQL injection protection (parameterized queries)
- [ ] User input is validated
- [ ] Regular security updates applied

---

## Contact & Support

- **Technical Issues**: [email]
- **Stripe Support**: https://support.stripe.com
- **AWS Support**: https://aws.amazon.com/support
- **Documentation**: /docs

---

*Last Updated: 2024-01-15*
