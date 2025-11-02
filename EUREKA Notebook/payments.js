const express = require('express');
const { body, validationResult } = require('express-validator');
const Stripe = require('stripe');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent
router.post('/create-payment-intent',
  auth,
  [
    body('amount').isInt({ min: 1 }),
    body('currency').optional().isLength({ min: 3, max: 3 }),
    body('description').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { amount, currency = 'usd', description, project_id, metadata = {} } = req.body;

      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency,
        description,
        metadata: {
          user_id: req.user.id.toString(),
          project_id: project_id?.toString() || '',
          ...metadata
        }
      });

      // Save payment to database
      const result = await pool.query(
        `INSERT INTO payments (stripe_payment_id, amount, currency, status, description, user_id, project_id, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          paymentIntent.id,
          amount,
          currency,
          'pending',
          description,
          req.user.id,
          project_id,
          JSON.stringify(metadata)
        ]
      );

      const payment = result.rows[0];

      // Log activity
      await pool.query(
        'INSERT INTO activity_logs (action, entity_type, entity_id, user_id, metadata) VALUES ($1, $2, $3, $4, $5)',
        ['payment_initiated', 'payment', payment.id, req.user.id, JSON.stringify({ amount, currency })]
      );

      res.status(201).json({
        message: 'Payment intent created successfully',
        clientSecret: paymentIntent.client_secret,
        payment
      });
    } catch (error) {
      console.error('Create payment intent error:', error);
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  }
);

// Webhook endpoint for Stripe events
router.post('/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          await pool.query(
            'UPDATE payments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE stripe_payment_id = $2',
            ['succeeded', paymentIntent.id]
          );

          // Get payment details
          const paymentResult = await pool.query(
            'SELECT * FROM payments WHERE stripe_payment_id = $1',
            [paymentIntent.id]
          );

          if (paymentResult.rows.length > 0) {
            const payment = paymentResult.rows[0];

            // Create notification
            await pool.query(
              `INSERT INTO notifications (type, title, message, user_id, related_id, related_type)
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [
                'payment',
                'Payment Successful',
                `Your payment of $${payment.amount} ${payment.currency.toUpperCase()} was successful`,
                payment.user_id,
                payment.id,
                'payment'
              ]
            );

            // Log activity
            await pool.query(
              'INSERT INTO activity_logs (action, entity_type, entity_id, user_id, metadata) VALUES ($1, $2, $3, $4, $5)',
              ['payment_succeeded', 'payment', payment.id, payment.user_id, JSON.stringify({ amount: payment.amount })]
            );
          }
          break;

        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object;
          await pool.query(
            'UPDATE payments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE stripe_payment_id = $2',
            ['failed', failedPayment.id]
          );

          // Get payment details
          const failedResult = await pool.query(
            'SELECT * FROM payments WHERE stripe_payment_id = $1',
            [failedPayment.id]
          );

          if (failedResult.rows.length > 0) {
            const payment = failedResult.rows[0];

            // Create notification
            await pool.query(
              `INSERT INTO notifications (type, title, message, user_id, related_id, related_type)
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [
                'payment',
                'Payment Failed',
                `Your payment of $${payment.amount} ${payment.currency.toUpperCase()} failed`,
                payment.user_id,
                payment.id,
                'payment'
              ]
            );
          }
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook handling error:', error);
      res.status(500).json({ error: 'Webhook handling failed' });
    }
  }
);

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, pr.name as project_name
      FROM payments p
      LEFT JOIN projects pr ON p.project_id = pr.id
      WHERE p.user_id = $1
    `;
    const values = [req.user.id];
    let paramCount = 2;

    if (status) {
      query += ` AND p.status = $${paramCount++}`;
      values.push(status);
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM payments WHERE user_id = $1';
    const countValues = [req.user.id];

    if (status) {
      countQuery += ' AND status = $2';
      countValues.push(status);
    }

    const countResult = await pool.query(countQuery, countValues);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      payments: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

// Get single payment
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, pr.name as project_name
       FROM payments p
       LEFT JOIN projects pr ON p.project_id = pr.id
       WHERE p.id = $1 AND p.user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ payment: result.rows[0] });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// Get payment statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         COUNT(*) as total_payments,
         SUM(CASE WHEN status = 'succeeded' THEN amount ELSE 0 END) as total_amount,
         COUNT(CASE WHEN status = 'succeeded' THEN 1 END) as successful_payments,
         COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_payments,
         COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_payments
       FROM payments
       WHERE user_id = $1`,
      [req.user.id]
    );

    res.json({ stats: result.rows[0] });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({ error: 'Failed to fetch payment statistics' });
  }
});

module.exports = router;
