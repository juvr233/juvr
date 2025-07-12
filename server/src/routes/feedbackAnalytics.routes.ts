import { Router } from 'express';
import * as feedbackAnalyticsController from '../controllers/feedbackAnalytics.controller';
import { isAdmin } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route GET /api/feedback-analytics/analysis/:readingType
 * @desc Get feedback analysis for a specific reading type
 * @access Admin
 */
router.get(
  '/analysis/:readingType',
  isAdmin,
  feedbackAnalyticsController.getFeedbackAnalysis
);

/**
 * @route GET /api/feedback-analytics/compare/:readingType
 * @desc Compare feedback between two time periods
 * @access Admin
 */
router.get(
  '/compare/:readingType',
  isAdmin,
  feedbackAnalyticsController.compareFeedbackPeriods
);

/**
 * @route GET /api/feedback-analytics/all-types
 * @desc Get feedback statistics for all reading types
 * @access Admin
 */
router.get(
  '/all-types',
  isAdmin,
  feedbackAnalyticsController.getAllTypeStats
);

/**
 * @route GET /api/feedback-analytics/export/:readingType
 * @desc Export feedback data for training
 * @access Admin
 */
router.get(
  '/export/:readingType',
  isAdmin,
  feedbackAnalyticsController.exportFeedbackForTraining
);

export default router; 