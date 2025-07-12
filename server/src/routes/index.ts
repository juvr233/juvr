// @ts-nocheck
import { Router } from 'express';
import homeRoutes from './home.routes';
import authRoutes from './auth.routes';
import tarotRoutes from './tarot.routes';
import ichingRoutes from './iching.routes';
import historyRoutes from './history.routes';
import profileRoutes from './profile.routes';
import settingsRoutes from './settings.routes';
import communityRoutes from './community.routes';
import divinationRoutes from './divination.routes';
import aiRoutes from './ai.routes';
import analyticsRoutes from './analytics.routes';
import paymentRoutes from './payment.routes';
import recommendationRoutes from './recommendation.routes';
import shopifyRoutes from './shopify.routes';
import shopifyAuthRoutes from './shopify.auth.routes';
import metricsRoutes from './metrics.routes';

import { protect } from '../middleware/auth.middleware';
import { advancedCacheMiddleware, routeCache } from '../middleware/cache.middleware';
import { requestQueueMiddleware, routeQueue, RequestPriority } from '../middleware/requestQueue.middleware';
import { rateLimiter } from '../middleware/validation.middleware';

const router = Router();

// 基本路由 - 无需认证
router.use('/', homeRoutes);
router.use('/auth', authRoutes);

// 指标和监控路由 - 需要特殊认证
router.use('/metrics', metricsRoutes);

// 缓存配置
const standardCacheOptions = { ttl: 3600 }; // 1小时标准缓存
const shortCacheOptions = { ttl: 300 };     // 5分钟短期缓存
const longCacheOptions = { ttl: 86400 };    // 24小时长期缓存

// 静态内容路由 - 应用长期缓存
router.use('/tarot', routeCache(86400), tarotRoutes);
router.use('/iching', routeCache(86400), ichingRoutes);

// 用户历史和个人资料路由 - 需要认证，应用短期缓存
router.use('/history', protect, routeCache(300), historyRoutes);
router.use('/profile', protect, routeCache(300), profileRoutes);
router.use('/settings', protect, settingsRoutes); // 设置不缓存

// 社区路由 - 需要认证，应用标准缓存
router.use('/community', protect, routeCache(3600), communityRoutes);

// 占卜和AI路由 - 需要认证，应用请求队列和速率限制
router.use('/divination', protect, 
  rateLimiter(60 * 1000, 10), // 每分钟最多10个请求
  routeQueue(RequestPriority.NORMAL, 60000), // 60秒超时
  divinationRoutes
);

router.use('/ai', protect, 
  rateLimiter(60 * 1000, 5), // 每分钟最多5个请求
  routeQueue(RequestPriority.LOW, 120000), // 120秒超时
  aiRoutes
);

// 分析路由 - 需要管理员权限，不缓存
router.use('/analytics', protect, analyticsRoutes);

// 支付路由 - 需要认证，不缓存
router.use('/payment', protect, paymentRoutes);

// 推荐路由 - 需要认证，应用短期缓存
router.use('/recommendation', protect, routeCache(300), recommendationRoutes);

// Shopify路由
router.use('/shopify/auth', shopifyAuthRoutes);
router.use('/shopify', protect, shopifyRoutes);

export default router;
