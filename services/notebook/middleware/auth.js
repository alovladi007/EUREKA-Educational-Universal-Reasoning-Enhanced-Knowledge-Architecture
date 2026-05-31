const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // P2: accept both token shapes. Notebook's own /api/auth tokens put
    // the user id in `userId`; api-core (the platform SSO) uses the
    // standard `sub` claim. Notebook shares the `eureka` DB with
    // api-core, so the user row already exists — an api-core token was
    // only 401'ing because `decoded.userId` is undefined for it.
    const userId = decoded.userId || decoded.sub;
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1 AND is_active = true',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    req.user = result.rows[0];
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(500).json({ error: 'Authentication failed' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId || decoded.sub;  // P2: api-core uses `sub`
      const result = await pool.query(
        'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1 AND is_active = true',
        [userId]
      );

      if (result.rows.length > 0) {
        req.user = result.rows[0];
        req.token = token;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

module.exports = { auth, optionalAuth, authorize };
