const express = require('express');
const Stripe = require('stripe');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { amount, currency = 'usd', description, project_id } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      description,
      metadata: { user_id: req.user.id.toString(), project_id: project_id?.toString() || '' }
    });

    const result = await pool.query(
      'INSERT INTO payments (stripe_payment_id, amount, currency, status, description, user_id, project_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [paymentIntent.id, amount, currency, 'pending', description, req.user.id, project_id]
    );

    res.status(201).json({ clientSecret: paymentIntent.client_secret, payment: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json({ payments: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

router.get('/stats/overview', auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) as total_payments, SUM(CASE WHEN status = 'succeeded' THEN amount ELSE 0 END) as total_amount FROM payments WHERE user_id = $1",
      [req.user.id]
    );
    res.json({ stats: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
