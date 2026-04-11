/**
 * XR Labs Enhanced API Routes
 *
 * New endpoints for:
 * - Dashboard Analytics
 * - Ratings & Reviews
 * - Scene Builder
 * - Asset Library
 * - Active Session Monitoring
 * - Category Management
 */

import { Router, Request, Response } from 'express';
import { Pool } from 'pg';

export function initializeEnhancedRoutes(dbPool: Pool, authMiddleware: any) {
  const router = Router();
  const pool = dbPool;
  const authenticateToken = authMiddleware;

// =====================================================
// DASHBOARD ANALYTICS
// =====================================================

/**
 * GET /api/xr/dashboard/stats
 * Real-time dashboard statistics
 */
router.get('/dashboard/stats', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM get_realtime_dashboard_stats()');

    const stats = result.rows[0] || {
      active_simulations: 0,
      total_users: 0,
      avg_engagement: 0,
      vr_sessions: 0,
      active_sessions_now: 0,
      avg_session_time: 0,
      completion_rate: 0
    };

    res.json({
      stats: {
        activeSimulations: parseInt(stats.active_simulations),
        totalUsers: parseInt(stats.total_users),
        avgEngagement: parseFloat(stats.avg_engagement).toFixed(1),
        vrSessions: parseInt(stats.vr_sessions),
        activeSessionsNow: parseInt(stats.active_sessions_now),
        avgSessionTime: parseFloat(stats.avg_session_time).toFixed(0),
        completionRate: parseFloat(stats.completion_rate).toFixed(0)
      }
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/xr/dashboard/analytics-history
 * Historical analytics data
 */
router.get('/dashboard/analytics-history', async (req: Request, res: Response) => {
  try {
    const { days = 30 } = req.query;

    const result = await pool.query(
      `SELECT * FROM xr_dashboard_analytics
       WHERE date > CURRENT_DATE - INTERVAL '${days} days'
       ORDER BY date DESC`,
    );

    res.json({ analytics: result.rows });
  } catch (error: any) {
    console.error('Error fetching analytics history:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// SIMULATIONS WITH RATINGS
// =====================================================

/**
 * GET /api/xr/simulations
 * Get simulations with ratings, categories, and filters
 */
router.get('/simulations', async (req: Request, res: Response) => {
  try {
    const {
      category,
      type,
      difficulty,
      search,
      sort = 'popular',
      limit = 50,
      offset = 0,
      featured,
      trending
    } = req.query;

    let query = 'SELECT * FROM v_simulation_cards WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (category && category !== 'all') {
      params.push(category);
      query += ` AND category = $${paramIndex}`;
      paramIndex++;
    }

    if (type && type !== 'all') {
      params.push(type);
      query += ` AND experience_type = $${paramIndex}`;
      paramIndex++;
    }

    if (difficulty && difficulty !== 'all') {
      params.push(difficulty);
      query += ` AND difficulty_level = $${paramIndex}`;
      paramIndex++;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      paramIndex++;
    }

    if (featured === 'true') {
      query += ' AND featured = true';
    }

    if (trending === 'true') {
      query += ' AND trending = true';
    }

    // Sorting
    switch (sort) {
      case 'popular':
        query += ' ORDER BY user_count DESC';
        break;
      case 'rating':
        query += ' ORDER BY avg_rating DESC, rating_count DESC';
        break;
      case 'recent':
        query += ' ORDER BY created_at DESC';
        break;
      case 'alphabetical':
        query += ' ORDER BY title ASC';
        break;
      default:
        query += ' ORDER BY user_count DESC';
    }

    const limitNum = parseInt(limit as string) || 50;
    const offsetNum = parseInt(offset as string) || 0;

    params.push(limitNum, offsetNum);
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;

    console.log('[DEBUG] Simulations query:', query);
    console.log('[DEBUG] Simulations params:', params);

    const result = await pool.query(query, params);

    console.log('[DEBUG] Query executed, rows returned:', result.rows.length);
    console.log('[DEBUG] First row:', result.rows[0]);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM v_simulation_cards WHERE 1=1';
    const countParams: any[] = [];
    let countParamIndex = 1;

    if (category && category !== 'all') {
      countParams.push(category);
      countQuery += ` AND category = $${countParamIndex}`;
      countParamIndex++;
    }

    if (type && type !== 'all') {
      countParams.push(type);
      countQuery += ` AND experience_type = $${countParamIndex}`;
      countParamIndex++;
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    console.log('[DEBUG] Total count:', totalCount);
    console.log('[DEBUG] Returning simulations:', result.rows.length);

    res.json({
      simulations: result.rows,
      total: totalCount,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
      hasMore: totalCount > (parseInt(offset as string) + result.rows.length)
    });
  } catch (error: any) {
    console.error('Error fetching simulations:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/xr/simulations/:id/details
 * Get detailed simulation info including ratings
 */
router.get('/simulations/:id/details', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get simulation details
    const simResult = await pool.query(
      'SELECT * FROM v_simulation_cards WHERE id = $1',
      [id]
    );

    if (simResult.rows.length === 0) {
      return res.status(404).json({ error: 'Simulation not found' });
    }

    // Get recent ratings
    const ratingsResult = await pool.query(
      `SELECT r.*, u.display_name, u.avatar_url
       FROM xr_simulation_ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.experience_id = $1
       ORDER BY r.created_at DESC
       LIMIT 10`,
      [id]
    );

    // Get rating distribution
    const distResult = await pool.query(
      `SELECT rating, COUNT(*) as count
       FROM xr_simulation_ratings
       WHERE experience_id = $1
       GROUP BY rating
       ORDER BY rating DESC`,
      [id]
    );

    res.json({
      simulation: simResult.rows[0],
      recentRatings: ratingsResult.rows,
      ratingDistribution: distResult.rows
    });
  } catch (error: any) {
    console.error('Error fetching simulation details:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/xr/simulations/:id/rate
 * Submit or update rating for a simulation
 */
router.post('/simulations/:id/rate', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, reviewTitle, reviewText } = req.body;
    const userId = (req as any).user?.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Insert or update rating
    const result = await pool.query(
      `INSERT INTO xr_simulation_ratings (experience_id, user_id, rating, review_title, review_text)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (experience_id, user_id)
       DO UPDATE SET
         rating = $3,
         review_title = $4,
         review_text = $5,
         updated_at = NOW()
       RETURNING *`,
      [id, userId, rating, reviewTitle || null, reviewText || null]
    );

    res.json({
      message: 'Rating submitted successfully',
      rating: result.rows[0]
    });
  } catch (error: any) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/xr/simulations/:id/ratings/:ratingId/helpful
 * Mark a rating as helpful
 */
router.post('/simulations/:id/ratings/:ratingId/helpful', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { ratingId } = req.params;

    await pool.query(
      'UPDATE xr_simulation_ratings SET helpful_count = helpful_count + 1 WHERE id = $1',
      [ratingId]
    );

    res.json({ message: 'Marked as helpful' });
  } catch (error: any) {
    console.error('Error marking rating as helpful:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// CATEGORIES
// =====================================================

/**
 * GET /api/xr/categories
 * Get all simulation categories with counts
 */
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT
         category,
         COUNT(*) as count
       FROM xr_experiences
       WHERE is_published = true AND category IS NOT NULL
       GROUP BY category
       ORDER BY count DESC`
    );

    const categories = [
      { value: 'medical', label: 'Medical', icon: '🏥' },
      { value: 'science', label: 'Science', icon: '🔬' },
      { value: 'history', label: 'History', icon: '🏛️' },
      { value: 'engineering', label: 'Engineering', icon: '⚙️' },
      { value: 'mathematics', label: 'Mathematics', icon: '📐' },
      { value: 'arts', label: 'Arts', icon: '🎨' },
      { value: 'business', label: 'Business', icon: '💼' },
      { value: 'languages', label: 'Languages', icon: '🗣️' },
      { value: 'environmental', label: 'Environmental', icon: '🌍' },
      { value: 'social_studies', label: 'Social Studies', icon: '👥' }
    ];

    // Merge with database counts
    const categoriesWithCounts = categories.map(cat => {
      const dbCat = result.rows.find(r => r.category === cat.value);
      return {
        ...cat,
        count: dbCat ? parseInt(dbCat.count) : 0
      };
    });

    res.json({ categories: categoriesWithCounts });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// SCENE BUILDER
// =====================================================

/**
 * GET /api/xr/scene-builder/projects
 * Get user's scene projects
 */
router.get('/scene-builder/projects', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { limit = 50, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT * FROM xr_scene_projects
       WHERE created_by = $1
       ORDER BY last_edited_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    res.json({ projects: result.rows });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/xr/scene-builder/projects/:id
 * Get single project details
 */
router.get('/scene-builder/projects/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    const result = await pool.query(
      'SELECT * FROM xr_scene_projects WHERE id = $1 AND created_by = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project: result.rows[0] });
  } catch (error: any) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/xr/scene-builder/projects
 * Create new scene project
 */
router.post('/scene-builder/projects', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { projectName, description, category, sceneData } = req.body;
    const userId = (req as any).user?.id;

    const result = await pool.query(
      `INSERT INTO xr_scene_projects (project_name, description, category, scene_data, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        projectName || 'Untitled Project',
        description || '',
        category || null,
        JSON.stringify(sceneData || { objects: [], lights: [], cameras: [], interactions: [] }),
        userId
      ]
    );

    res.status(201).json({
      message: 'Project created successfully',
      project: result.rows[0]
    });
  } catch (error: any) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/xr/scene-builder/projects/:id
 * Update scene project
 */
router.put('/scene-builder/projects/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { projectName, description, category, sceneData, thumbnailUrl } = req.body;
    const userId = (req as any).user?.id;

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (projectName !== undefined) {
      values.push(projectName);
      updates.push(`project_name = $${paramIndex}`);
      paramIndex++;
    }

    if (description !== undefined) {
      values.push(description);
      updates.push(`description = $${paramIndex}`);
      paramIndex++;
    }

    if (category !== undefined) {
      values.push(category);
      updates.push(`category = $${paramIndex}`);
      paramIndex++;
    }

    if (sceneData !== undefined) {
      values.push(JSON.stringify(sceneData));
      updates.push(`scene_data = $${paramIndex}`);
      paramIndex++;
    }

    if (thumbnailUrl !== undefined) {
      values.push(thumbnailUrl);
      updates.push(`thumbnail_url = $${paramIndex}`);
      paramIndex++;
    }

    updates.push(`last_edited_at = NOW()`);
    updates.push(`updated_at = NOW()`);

    values.push(id, userId);
    const query = `
      UPDATE xr_scene_projects
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex} AND created_by = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      message: 'Project updated successfully',
      project: result.rows[0]
    });
  } catch (error: any) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/xr/scene-builder/projects/:id
 * Delete scene project
 */
router.delete('/scene-builder/projects/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    const result = await pool.query(
      'DELETE FROM xr_scene_projects WHERE id = $1 AND created_by = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/xr/scene-builder/projects/:id/publish
 * Publish scene project as experience
 */
router.post('/scene-builder/projects/:id/publish', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const publishSettings = req.body;
    const userId = (req as any).user?.id;

    // Verify ownership
    const projectResult = await pool.query(
      'SELECT * FROM xr_scene_projects WHERE id = $1 AND created_by = $2',
      [id, userId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Call publish function
    const result = await pool.query(
      'SELECT publish_scene_project($1, $2) as experience_id',
      [id, JSON.stringify(publishSettings)]
    );

    const experienceId = result.rows[0].experience_id;

    res.json({
      message: 'Project published successfully',
      experienceId
    });
  } catch (error: any) {
    console.error('Error publishing project:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// SCENE TEMPLATES
// =====================================================

/**
 * GET /api/xr/scene-builder/templates
 * Get available scene templates
 */
router.get('/scene-builder/templates', async (req: Request, res: Response) => {
  try {
    const { category, type, search } = req.query;

    let query = 'SELECT * FROM xr_scene_templates WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (category) {
      params.push(category);
      query += ` AND category = $${paramIndex}`;
      paramIndex++;
    }

    if (type) {
      params.push(type);
      query += ` AND template_type = $${paramIndex}`;
      paramIndex++;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (template_name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      paramIndex++;
    }

    query += ' ORDER BY usage_count DESC, rating DESC';

    const result = await pool.query(query, params);

    res.json({ templates: result.rows });
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/xr/scene-builder/templates/:id/use
 * Create project from template
 */
router.post('/scene-builder/templates/:id/use', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { projectName } = req.body;
    const userId = (req as any).user?.id;

    // Get template
    const templateResult = await pool.query(
      'SELECT * FROM xr_scene_templates WHERE id = $1',
      [id]
    );

    if (templateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const template = templateResult.rows[0];

    // Create new project from template
    const projectResult = await pool.query(
      `INSERT INTO xr_scene_projects (project_name, description, category, scene_data, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        projectName || template.template_name,
        template.description,
        template.category,
        template.scene_data,
        userId
      ]
    );

    // Increment usage count
    await pool.query(
      'UPDATE xr_scene_templates SET usage_count = usage_count + 1 WHERE id = $1',
      [id]
    );

    res.status(201).json({
      message: 'Project created from template',
      project: projectResult.rows[0]
    });
  } catch (error: any) {
    console.error('Error using template:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// ASSET LIBRARY
// =====================================================

/**
 * GET /api/xr/asset-library/categories
 * Get asset categories
 */
router.get('/asset-library/categories', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM xr_asset_library_categories
       WHERE is_active = true
       ORDER BY sort_order ASC, category_name ASC`
    );

    res.json({ categories: result.rows });
  } catch (error: any) {
    console.error('Error fetching asset categories:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/xr/asset-library/search
 * Search assets with advanced filters
 */
router.get('/asset-library/search', async (req: Request, res: Response) => {
  try {
    const {
      category,
      subject,
      search,
      format,
      hasAnimations,
      sort = 'recent',
      limit = 50,
      offset = 0
    } = req.query;

    let query = `
      SELECT a.*, c.category_name, c.icon_emoji
      FROM xr_3d_assets a
      LEFT JOIN xr_asset_library_categories c ON a.category_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (category) {
      params.push(category);
      query += ` AND c.category_name = $${paramIndex}`;
      paramIndex++;
    }

    if (subject) {
      params.push(subject);
      query += ` AND a.subject = $${paramIndex}`;
      paramIndex++;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (a.name ILIKE $${paramIndex} OR a.description ILIKE $${paramIndex})`;
      paramIndex++;
    }

    if (format) {
      params.push(format);
      query += ` AND a.file_format = $${paramIndex}`;
      paramIndex++;
    }

    if (hasAnimations === 'true') {
      query += ' AND a.has_animations = true';
    }

    // Sorting
    switch (sort) {
      case 'popular':
        query += ' ORDER BY a.download_count DESC';
        break;
      case 'recent':
        query += ' ORDER BY a.created_at DESC';
        break;
      case 'name':
        query += ' ORDER BY a.asset_name ASC';
        break;
      case 'size':
        query += ' ORDER BY a.file_size_mb ASC';
        break;
      default:
        query += ' ORDER BY a.created_at DESC';
    }

    params.push(limit, offset);
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;

    const result = await pool.query(query, params);

    res.json({
      assets: result.rows,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    });
  } catch (error: any) {
    console.error('Error searching asset library:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/xr/asset-library/popular
 * Get popular/trending assets
 */
router.get('/asset-library/popular', async (req: Request, res: Response) => {
  try {
    const { limit = 20 } = req.query;

    const result = await pool.query(
      `SELECT a.*, p.usage_count, c.category_name
       FROM xr_popular_assets p
       JOIN xr_3d_assets a ON p.asset_id = a.id
       LEFT JOIN xr_asset_library_categories c ON a.category_id = c.id
       ORDER BY p.usage_count DESC
       LIMIT $1`,
      [limit]
    );

    res.json({ assets: result.rows });
  } catch (error: any) {
    console.error('Error fetching popular assets:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/xr/asset-library/assets/:id/use
 * Track asset usage
 */
router.post('/asset-library/assets/:id/use', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await pool.query('SELECT increment_asset_usage($1)', [id]);

    res.json({ message: 'Asset usage tracked' });
  } catch (error: any) {
    console.error('Error tracking asset usage:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// ACTIVE SESSION MONITORING
// =====================================================

/**
 * GET /api/xr/monitoring/active-sessions
 * Get all active XR sessions
 */
router.get('/monitoring/active-sessions', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM get_active_sessions()');

    res.json({ sessions: result.rows });
  } catch (error: any) {
    console.error('Error fetching active sessions:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/xr/monitoring/experience-center-stats
 * Stats for VR Experience Center section
 */
router.get('/monitoring/experience-center-stats', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE session_end IS NULL) as active_sessions,
        COALESCE(AVG(duration_seconds) FILTER (WHERE session_end IS NOT NULL), 0) as avg_session_duration,
        COALESCE(
          (COUNT(*) FILTER (WHERE completion_percentage >= 80)::DECIMAL /
           NULLIF(COUNT(*) FILTER (WHERE session_end IS NOT NULL), 0) * 100),
          0
        ) as completion_rate
      FROM xr_user_sessions
      WHERE session_start > NOW() - INTERVAL '24 hours'
    `);

    const stats = result.rows[0];

    res.json({
      stats: {
        activeSessions: parseInt(stats.active_sessions),
        avgSessionTime: Math.round(parseFloat(stats.avg_session_duration)),
        completionRate: Math.round(parseFloat(stats.completion_rate))
      }
    });
  } catch (error: any) {
    console.error('Error fetching experience center stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// HARDWARE COMPATIBILITY
// =====================================================

/**
 * GET /api/xr/compatibility/check
 * Check device compatibility
 */
router.get('/compatibility/check', async (req: Request, res: Response) => {
  try {
    const { userAgent } = req.headers;
    const ua = Array.isArray(userAgent) ? userAgent[0] : userAgent;

    // Simple device detection
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua || '');
    const isIOS = /iPhone|iPad|iPod/i.test(ua || '');
    const isAndroid = /Android/i.test(ua || '');
    const isQuest = /Quest/i.test(ua || '');

    const compatibility = {
      device: {
        isMobile,
        isIOS,
        isAndroid,
        isQuest,
        type: isQuest ? 'vr_headset' : isMobile ? 'mobile' : 'desktop'
      },
      supported: {
        webxr: !isMobile || isQuest, // Assume WebXR support
        vr: isQuest || (!isMobile),
        ar: isMobile,
        handTracking: isQuest,
        eyeTracking: false // Requires actual detection
      },
      recommendations: [] as string[]
    };

    // Add recommendations
    if (!compatibility.supported.webxr) {
      compatibility.recommendations.push('Use a WebXR-compatible browser like Chrome or Edge');
    }
    if (isMobile && !isQuest) {
      compatibility.recommendations.push('AR experiences are recommended for mobile devices');
    }
    if (isQuest) {
      compatibility.recommendations.push('Full VR experiences available with hand tracking');
    }

    res.json({ compatibility });
  } catch (error: any) {
    console.error('Error checking compatibility:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/xr/compatibility/devices
 * Get list of supported devices
 */
router.get('/compatibility/devices', async (req: Request, res: Response) => {
  try {
    const devices = [
      {
        name: 'Meta Quest',
        type: 'vr_headset',
        models: ['Quest 2', 'Quest 3', 'Quest Pro'],
        supported: true,
        features: ['6DOF', 'Hand Tracking', 'Passthrough AR'],
        icon: '🥽'
      },
      {
        name: 'HTC Vive',
        type: 'vr_headset',
        models: ['Vive', 'Vive Pro', 'Vive Pro 2'],
        supported: true,
        features: ['6DOF', 'Room Scale', 'Eye Tracking (Pro Eye)'],
        icon: '🎮'
      },
      {
        name: 'Valve Index',
        type: 'vr_headset',
        models: ['Index'],
        supported: true,
        features: ['6DOF', 'Finger Tracking', '144Hz Display'],
        icon: '🎯'
      },
      {
        name: 'Pico',
        type: 'vr_headset',
        models: ['Pico 4', 'Pico Neo 3'],
        supported: true,
        features: ['6DOF', 'Standalone', 'Eye Tracking'],
        icon: '🥽'
      },
      {
        name: 'Web Browser',
        type: 'desktop',
        models: ['Chrome', 'Edge', 'Firefox'],
        supported: true,
        features: ['WebXR', 'Mouse/Keyboard', 'Gamepad'],
        icon: '🌐'
      },
      {
        name: 'Mobile AR',
        type: 'mobile',
        models: ['iOS (ARKit)', 'Android (ARCore)'],
        supported: true,
        features: ['AR', 'Surface Detection', 'Image Tracking'],
        icon: '📱'
      },
      {
        name: 'HoloLens',
        type: 'ar_headset',
        models: ['HoloLens 2'],
        supported: true,
        features: ['Mixed Reality', 'Hand Tracking', 'Spatial Audio'],
        icon: '👓'
      },
      {
        name: 'Magic Leap',
        type: 'ar_headset',
        models: ['Magic Leap 2'],
        supported: true,
        features: ['Mixed Reality', 'Eye Tracking', 'Spatial Mapping'],
        icon: '✨'
      }
    ];

    res.json({ devices });
  } catch (error: any) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// UTILITY ENDPOINTS
// =====================================================

/**
 * POST /api/xr/refresh-analytics
 * Manually refresh materialized views
 */
router.post('/refresh-analytics', authenticateToken, async (req: Request, res: Response) => {
  try {
    await pool.query('SELECT refresh_xr_analytics()');
    res.json({ message: 'Analytics refreshed successfully' });
  } catch (error: any) {
    console.error('Error refreshing analytics:', error);
    res.status(500).json({ error: error.message });
  }
});

  return router;
}
