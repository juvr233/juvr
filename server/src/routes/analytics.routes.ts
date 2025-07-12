import { Router } from 'express';
import { getRecentActivity } from '../controllers/analytics.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/analytics/recent-activity
 * @desc    Get recent user activity (admin only)
 * @access  Private/Admin
 */
router.get('/recent-activity', protect, admin, getRecentActivity);

export default router;
