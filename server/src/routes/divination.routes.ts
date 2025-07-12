import { Router } from 'express';
import { calculateNumerology } from '../controllers/numerology.controller';
import { cacheMiddleware } from '../middleware/cache.middleware';
import { protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/divination/calculate/numerology
 * @desc    Calculate numerology report
 * @access  Private
 */
router.post('/calculate/numerology', protect, cacheMiddleware, calculateNumerology);

export default router;
