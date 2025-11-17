# EUREKA Test Prep Service

Production-ready API service for managing test preparation subscriptions, content access, and student progress tracking.

## Features

- 🎯 **Dual Subscription Model**
  - Option 1: Test Prep (Videos + Notes) OR QBank Only
  - Option 2: Complete Bundle (Everything)

- 💳 **Payment Processing**
  - Stripe integration for subscriptions
  - Automated billing and renewal
  - Webhook handling

- 🔐 **Access Control**
  - Role-based access control
  - Subscription-based feature gating
  - JWT authentication

- 📊 **Progress Tracking**
  - Video watch history
  - Question bank performance
  - Study time analytics

- 📝 **Study Notes**
  - Timestamped video notes
  - User-created annotations
  - Searchable and organizable

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **Payments**: Stripe
- **Auth**: JWT
- **Language**: TypeScript

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14
- npm >= 9.0.0

### Installation

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run migrations
npm run migrate

# Start development server
npm run dev
```

### Environment Variables

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eureka
DB_USER=postgres
DB_PASSWORD=your_password

# Server
PORT=3010
NODE_ENV=development
FRONTEND_URL=http://localhost:3006
CORS_ORIGIN=http://localhost:3006

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

## API Endpoints

### Health Check

```http
GET /health
```

### Plans

```http
GET /api/plans
GET /api/plans/:planId
```

Query params:
- `exam_category`: MCAT, USMLE, LSAT, GRE, GMAT, FE
- `plan_type`: test_prep_only, qbank_only, complete_bundle

### Subscriptions

```http
GET /api/my-subscriptions
GET /api/my-access
POST /api/subscribe
POST /api/subscriptions/:id/cancel
```

Requires: `Authorization: Bearer <token>`

### Content Packages

```http
GET /api/packages
GET /api/packages/:packageId
```

### Progress Tracking

```http
GET /api/progress
POST /api/progress
```

### Video Notes

```http
GET /api/videos/:contentId/notes
POST /api/videos/:contentId/notes
PUT /api/notes/:noteId
DELETE /api/notes/:noteId
```

### Webhooks

```http
POST /api/webhooks/stripe
```

## Database Schema

### Main Tables

- `test_prep_plans` - Subscription plan definitions
- `test_prep_subscriptions` - User subscriptions
- `test_prep_content_packages` - Content organization
- `test_prep_payments` - Payment history
- `test_prep_progress` - Study progress tracking
- `video_study_notes` - User notes on videos

### Views

- `v_active_user_subscriptions` - Active subscriptions with plan details
- `v_user_content_access` - User access rights summary

## Development

### Run in Development Mode

```bash
npm run dev
```

Uses `ts-node-dev` for hot reloading.

### Build for Production

```bash
npm run build
npm start
```

### Run Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Deployment

### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Build the project
npm run build

# Start with PM2
pm2 start dist/app.js --name test-prep-api

# Save PM2 configuration
pm2 save

# Setup auto-restart on boot
pm2 startup
```

### Using Docker

```bash
# Build image
docker build -t eureka-test-prep .

# Run container
docker run -d \
  -p 3010:3010 \
  --name test-prep-api \
  --env-file .env \
  eureka-test-prep
```

### Environment-Specific Configuration

**Development:**
- Use Stripe test keys
- Enable verbose logging
- CORS allows all origins

**Production:**
- Use Stripe live keys
- Structured JSON logging
- Restricted CORS origins
- Enable rate limiting
- Use HTTPS only

## Monitoring

### Health Check Endpoint

```bash
curl http://localhost:3010/health
```

Response:
```json
{
  "status": "healthy",
  "service": "test-prep-api",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "database": "connected"
}
```

### Logging

Logs use Morgan in development and structured JSON in production.

```typescript
// Access logs
GET /api/plans - 200 - 45ms

// Error logs
Error: Database connection failed
  at Pool.connect (pg/lib/pool.js:...)
```

### Metrics to Monitor

- Active subscriptions count
- API response times
- Database connection pool
- Stripe webhook success rate
- Error rates by endpoint

## Security

### Implemented

- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ JWT authentication
- ✅ SQL injection prevention (parameterized queries)
- ✅ Input validation
- ✅ Stripe webhook signature verification
- ✅ Environment variable security

### Best Practices

- Never commit `.env` files
- Use secrets management (AWS Secrets Manager, Vault)
- Rotate JWT secrets regularly
- Keep dependencies updated
- Enable rate limiting in production
- Use HTTPS in production
- Implement request logging
- Set up monitoring alerts

## Stripe Integration

### Setup Checklist

1. Create Stripe account
2. Get API keys (Dashboard > Developers > API keys)
3. Create products and prices
4. Setup webhook endpoint
5. Test with Stripe test cards

### Test Cards

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Auth Required: `4000 0025 0000 3155`

### Webhook Events

Handled events:
- `checkout.session.completed` - New subscription
- `customer.subscription.updated` - Subscription change
- `customer.subscription.deleted` - Cancellation

## Troubleshooting

### Database Connection Errors

```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql -h localhost -U postgres -d eureka -c "SELECT 1;"

# Check connection pool
# Look for "database": "connected" in health check
```

### Stripe Webhook Failures

```bash
# Test webhook locally
stripe listen --forward-to localhost:3010/api/webhooks/stripe

# Trigger test event
stripe trigger checkout.session.completed

# Check webhook signature
# Verify STRIPE_WEBHOOK_SECRET is correct
```

### Port Already in Use

```bash
# Find process using port 3010
lsof -i :3010

# Kill process
kill -9 <PID>

# Or change PORT in .env
PORT=3011
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## Support

- 📧 Email: support@eureka.edu
- 📚 Documentation: /docs
- 🐛 Issues: GitHub Issues

## License

MIT License - see LICENSE file for details

---

**Built with ❤️ by the EUREKA Platform Team**
