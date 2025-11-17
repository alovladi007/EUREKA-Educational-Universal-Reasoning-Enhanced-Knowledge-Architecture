/**
 * EUREKA Test Prep Platform - Main API Service
 * Handles subscriptions, content access, and study progress
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Pool } from 'pg';
import Stripe from 'stripe';

const app: Application = express();
const PORT = process.env.PORT || 3010;

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'eureka',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3006',
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    org_id: string;
    role: string;
  };
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);

    // TODO: Implement JWT verification
    // For now, decode the user info from a simple token
    // In production, use proper JWT verification

    // Mock user for development
    req.user = {
      id: 'test-user-id',
      email: 'user@example.com',
      org_id: 'test-org-id',
      role: 'student',
    };

    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// =====================================================
// SUBSCRIPTION ACCESS MIDDLEWARE
// =====================================================

const checkSubscriptionAccess = (requiredAccess: 'video' | 'notes' | 'qbank') => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await pool.query(`
        SELECT * FROM v_user_content_access
        WHERE user_id = $1
        AND status = 'active'
        AND (end_date IS NULL OR end_date > CURRENT_TIMESTAMP)
      `, [userId]);

      if (result.rows.length === 0) {
        return res.status(403).json({
          error: 'No active subscription found',
          message: 'Please subscribe to access this content'
        });
      }

      const access = result.rows[0];
      let hasAccess = false;

      switch (requiredAccess) {
        case 'video':
          hasAccess = access.has_video_access;
          break;
        case 'notes':
          hasAccess = access.has_notes_access;
          break;
        case 'qbank':
          hasAccess = access.has_qbank_access;
          break;
      }

      if (!hasAccess) {
        return res.status(403).json({
          error: 'Access denied',
          message: `Your subscription does not include ${requiredAccess} access. Please upgrade your plan.`
        });
      }

      next();
    } catch (error) {
      console.error('Subscription check error:', error);
      res.status(500).json({ error: 'Failed to verify subscription access' });
    }
  };
};

// =====================================================
// HEALTH CHECK
// =====================================================

app.get('/health', async (req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'healthy',
      service: 'test-prep-api',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      service: 'test-prep-api',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});

// =====================================================
// SUBSCRIPTION PLANS ROUTES
// =====================================================

// Get all available plans
app.get('/api/plans', async (req: Request, res: Response) => {
  try {
    const { exam_category, plan_type } = req.query;

    let query = `
      SELECT
        id, plan_name, plan_type, exam_category, billing_period,
        price_usd, original_price_usd, currency, features,
        question_bank_size, video_hours, max_practice_exams,
        description, highlights, is_featured, display_order
      FROM test_prep_plans
      WHERE is_active = true
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (exam_category) {
      query += ` AND exam_category = $${paramIndex}`;
      params.push(exam_category);
      paramIndex++;
    }

    if (plan_type) {
      query += ` AND plan_type = $${paramIndex}`;
      params.push(plan_type);
      paramIndex++;
    }

    query += ' ORDER BY display_order, price_usd';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      plans: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Get specific plan details
app.get('/api/plans/:planId', async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;

    const result = await pool.query(`
      SELECT * FROM test_prep_plans
      WHERE id = $1 AND is_active = true
    `, [planId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({
      success: true,
      plan: result.rows[0],
    });
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ error: 'Failed to fetch plan details' });
  }
});

// =====================================================
// USER SUBSCRIPTIONS ROUTES
// =====================================================

// Get current user's subscriptions
app.get('/api/my-subscriptions', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const result = await pool.query(`
      SELECT * FROM v_active_user_subscriptions
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [userId]);

    res.json({
      success: true,
      subscriptions: result.rows,
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Check user's access rights
app.get('/api/my-access', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const result = await pool.query(`
      SELECT * FROM v_user_content_access
      WHERE user_id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        hasAccess: false,
        access: null,
      });
    }

    res.json({
      success: true,
      hasAccess: true,
      access: result.rows[0],
    });
  } catch (error) {
    console.error('Check access error:', error);
    res.status(500).json({ error: 'Failed to check access rights' });
  }
});

// Create new subscription (Stripe checkout)
app.post('/api/subscribe', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { planId, successUrl, cancelUrl } = req.body;

    if (!planId) {
      return res.status(400).json({ error: 'Plan ID is required' });
    }

    // Get plan details
    const planResult = await pool.query(`
      SELECT * FROM test_prep_plans
      WHERE id = $1 AND is_active = true
    `, [planId]);

    if (planResult.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const plan = planResult.rows[0];

    // Create or get Stripe customer
    let customerId = '';

    const customerResult = await pool.query(`
      SELECT stripe_customer_id FROM test_prep_subscriptions
      WHERE user_id = $1 AND stripe_customer_id IS NOT NULL
      LIMIT 1
    `, [userId]);

    if (customerResult.rows.length > 0) {
      customerId = customerResult.rows[0].stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: req.user?.email,
        metadata: {
          user_id: userId || '',
        },
      });
      customerId = customer.id;
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripe_price_id,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.FRONTEND_URL}/dashboard/test-prep?success=true`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/pricing?cancelled=true`,
      metadata: {
        user_id: userId || '',
        plan_id: planId,
      },
    });

    res.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Cancel subscription
app.post('/api/subscriptions/:subscriptionId/cancel', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { subscriptionId } = req.params;

    // Verify subscription ownership
    const subResult = await pool.query(`
      SELECT * FROM test_prep_subscriptions
      WHERE id = $1 AND user_id = $2
    `, [subscriptionId, userId]);

    if (subResult.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const subscription = subResult.rows[0];

    // Cancel in Stripe
    if (subscription.stripe_subscription_id) {
      await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
    }

    // Update in database
    await pool.query(`
      UPDATE test_prep_subscriptions
      SET status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [subscriptionId]);

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// =====================================================
// CONTENT PACKAGES ROUTES
// =====================================================

// Get content packages
app.get('/api/packages', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { exam_category, package_type } = req.query;

    let query = `
      SELECT * FROM test_prep_content_packages
      WHERE is_active = true
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (exam_category) {
      query += ` AND exam_category = $${paramIndex}`;
      params.push(exam_category);
      paramIndex++;
    }

    if (package_type) {
      query += ` AND package_type = $${paramIndex}`;
      params.push(package_type);
      paramIndex++;
    }

    query += ' ORDER BY display_order';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      packages: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({ error: 'Failed to fetch content packages' });
  }
});

// Get package details with access check
app.get('/api/packages/:packageId', authMiddleware, checkSubscriptionAccess('video'), async (req: AuthRequest, res: Response) => {
  try {
    const { packageId } = req.params;

    const result = await pool.query(`
      SELECT * FROM test_prep_content_packages
      WHERE id = $1 AND is_active = true
    `, [packageId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json({
      success: true,
      package: result.rows[0],
    });
  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({ error: 'Failed to fetch package details' });
  }
});

// =====================================================
// STUDY PROGRESS ROUTES
// =====================================================

// Get user's progress
app.get('/api/progress', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { package_id } = req.query;

    let query = `
      SELECT * FROM test_prep_progress
      WHERE user_id = $1
    `;

    const params: any[] = [userId];

    if (package_id) {
      query += ` AND package_id = $2`;
      params.push(package_id);
    }

    query += ' ORDER BY last_accessed_at DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      progress: result.rows,
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Update progress
app.post('/api/progress', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      package_id,
      video_completed,
      note_reviewed,
      question_answered,
      study_time_minutes,
    } = req.body;

    // Upsert progress
    const result = await pool.query(`
      INSERT INTO test_prep_progress (
        user_id, package_id, videos_completed, notes_reviewed, questions_answered, total_study_time_minutes, last_accessed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, package_id)
      DO UPDATE SET
        videos_completed = CASE WHEN $3::uuid IS NOT NULL THEN array_append(test_prep_progress.videos_completed, $3) ELSE test_prep_progress.videos_completed END,
        notes_reviewed = CASE WHEN $4::uuid IS NOT NULL THEN array_append(test_prep_progress.notes_reviewed, $4) ELSE test_prep_progress.notes_reviewed END,
        questions_answered = CASE WHEN $5::uuid IS NOT NULL THEN array_append(test_prep_progress.questions_answered, $5) ELSE test_prep_progress.questions_answered END,
        total_study_time_minutes = test_prep_progress.total_study_time_minutes + COALESCE($6, 0),
        last_accessed_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [userId, package_id, video_completed, note_reviewed, question_answered, study_time_minutes]);

    res.json({
      success: true,
      progress: result.rows[0],
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// =====================================================
// VIDEO NOTES ROUTES
// =====================================================

// Get notes for a video
app.get('/api/videos/:contentId/notes', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { contentId } = req.params;

    const result = await pool.query(`
      SELECT * FROM video_study_notes
      WHERE user_id = $1 AND content_item_id = $2
      ORDER BY timestamp_seconds ASC
    `, [userId, contentId]);

    res.json({
      success: true,
      notes: result.rows,
    });
  } catch (error) {
    console.error('Get video notes error:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Create note
app.post('/api/videos/:contentId/notes', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { contentId } = req.params;
    const { note_text, timestamp_seconds, tags, is_important, color_code } = req.body;

    const result = await pool.query(`
      INSERT INTO video_study_notes (
        user_id, content_item_id, note_text, timestamp_seconds, tags, is_important, color_code
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [userId, contentId, note_text, timestamp_seconds, tags || [], is_important || false, color_code]);

    res.json({
      success: true,
      note: result.rows[0],
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update note
app.put('/api/notes/:noteId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { noteId } = req.params;
    const { note_text, tags, is_important, color_code } = req.body;

    const result = await pool.query(`
      UPDATE video_study_notes
      SET note_text = COALESCE($1, note_text),
          tags = COALESCE($2, tags),
          is_important = COALESCE($3, is_important),
          color_code = COALESCE($4, color_code),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 AND user_id = $6
      RETURNING *
    `, [note_text, tags, is_important, color_code, noteId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({
      success: true,
      note: result.rows[0],
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Delete note
app.delete('/api/notes/:noteId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { noteId } = req.params;

    const result = await pool.query(`
      DELETE FROM video_study_notes
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `, [noteId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// =====================================================
// STRIPE WEBHOOKS
// =====================================================

app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).send('Missing stripe signature');
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        // Create subscription in database
        await handleCheckoutCompleted(session);
        break;

      case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscriptionUpdated);
        break;

      case 'customer.subscription.deleted':
        const subscriptionDeleted = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscriptionDeleted);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).send(`Webhook Error: ${err}`);
  }
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const planId = session.metadata?.plan_id;
  const subscriptionId = session.subscription as string;

  if (!userId || !planId) {
    console.error('Missing metadata in checkout session');
    return;
  }

  await pool.query(`
    INSERT INTO test_prep_subscriptions (
      user_id, plan_id, status, stripe_subscription_id, stripe_customer_id, current_period_start, current_period_end
    ) VALUES ($1, $2, 'active', $3, $4, to_timestamp($5), to_timestamp($6))
    ON CONFLICT (user_id, plan_id) DO UPDATE
    SET status = 'active',
        stripe_subscription_id = $3,
        stripe_customer_id = $4,
        current_period_start = to_timestamp($5),
        current_period_end = to_timestamp($6)
  `, [userId, planId, subscriptionId, session.customer, session.created, session.expires_at]);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await pool.query(`
    UPDATE test_prep_subscriptions
    SET status = $1,
        current_period_start = to_timestamp($2),
        current_period_end = to_timestamp($3)
    WHERE stripe_subscription_id = $4
  `, [subscription.status, subscription.current_period_start, subscription.current_period_end, subscription.id]);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await pool.query(`
    UPDATE test_prep_subscriptions
    SET status = 'cancelled',
        cancelled_at = CURRENT_TIMESTAMP
    WHERE stripe_subscription_id = $1
  `, [subscription.id]);
}

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(`✅ Test Prep API Server running on port ${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;
