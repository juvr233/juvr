import { Router } from 'express';
import {
  getAiReading,
  getAdvancedTarotReading,
  evaluateReadingQuality,
} from '../controllers/ai.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/ai/reading
 * @desc    Generate AI interpretation
 * @access  Private
 */
router.post('/reading', protect, getAiReading);

/**
 * @route   POST /api/ai/tarot/reading
 * @desc    Advanced tarot AI reading
 * @access  Private
 */
router.post('/tarot/reading', protect, getAdvancedTarotReading);

/**
 * @route   POST /api/ai/tarot/evaluate
 * @desc    Rate reading quality
 * @access  Private
 */
router.post('/tarot/evaluate', protect, evaluateReadingQuality);

export default router;
