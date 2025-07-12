import express from 'express';
import * as recommendationController from '../controllers/recommendation.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @route POST /api/recommendation
 * @desc 获取基于命理参数的产品推荐
 * @access Public
 */
router.post('/', recommendationController.getRecommendations);

/**
 * @route GET /api/recommendation/personalized
 * @desc 获取个性化产品推荐（需要登录）
 * @access Private
 */
router.get('/personalized', protect, recommendationController.getPersonalizedRecommendations);

/**
 * @route GET /api/recommendation/related
 * @desc 获取相关产品推荐
 * @access Public
 */
router.get('/related', recommendationController.getRelatedProducts);

/**
 * @route GET /api/recommendation/popular
 * @desc 获取热门产品
 * @access Public
 */
router.get('/popular', recommendationController.getPopularProducts);

export default router;
