import { Router } from 'express';
import * as feedbackController from '../controllers/feedback.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { body, param, query } from 'express-validator';

const router = Router();

/**
 * @route POST /api/feedback
 * @desc Submit feedback for a divination reading
 * @access Private
 */
router.post(
  '/',
  authenticate,
  [
    body('readingId')
      .notEmpty()
      .withMessage('阅读ID不能为空'),
    body('readingType')
      .isIn(['tarot', 'iching', 'bazi', 'numerology', 'compatibility', 'holistic'])
      .withMessage('无效的阅读类型'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('评分必须在1到5之间'),
    body('comment')
      .optional()
      .isString()
      .isLength({ max: 1000 })
      .withMessage('评论不能超过1000个字符'),
    body('helpful')
      .optional()
      .isBoolean()
      .withMessage('helpful必须是布尔值'),
    body('accurate')
      .optional()
      .isBoolean()
      .withMessage('accurate必须是布尔值'),
  ],
  validate,
  feedbackController.submitFeedback
);

/**
 * @route GET /api/feedback/stats/:readingType
 * @desc Get feedback statistics for a specific reading type
 * @access Private
 */
router.get(
  '/stats/:readingType',
  authenticate,
  [
    param('readingType')
      .isIn(['tarot', 'iching', 'bazi', 'numerology', 'compatibility', 'holistic'])
      .withMessage('无效的阅读类型'),
  ],
  validate,
  feedbackController.getFeedbackStats
);

/**
 * @route GET /api/feedback/reading/:readingId
 * @desc Get all feedback for a specific reading
 * @access Private
 */
router.get(
  '/reading/:readingId',
  authenticate,
  [
    param('readingId')
      .notEmpty()
      .withMessage('阅读ID不能为空'),
  ],
  validate,
  feedbackController.getFeedbackForReading
);

/**
 * @route GET /api/feedback/training
 * @desc Get feedback for training
 * @access Private
 */
router.get(
  '/training',
  authenticate,
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 500 })
      .withMessage('限制必须是1到500之间的整数'),
  ],
  validate,
  feedbackController.getFeedbackForTraining
);

/**
 * @route POST /api/feedback/mark-used
 * @desc Mark feedback as used for training
 * @access Private
 */
router.post(
  '/mark-used',
  authenticate,
  [
    body('feedbackIds')
      .isArray()
      .withMessage('必须提供反馈ID数组'),
    body('feedbackIds.*')
      .isMongoId()
      .withMessage('必须是有效的MongoDB ID'),
  ],
  validate,
  feedbackController.markFeedbackAsUsed
);

export default router; 