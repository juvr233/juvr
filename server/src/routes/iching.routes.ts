// @ts-nocheck
import express from 'express';
import { checkIChingAccess, getIChingReading } from '../controllers/iching.controller';
import { protect } from '../middleware/auth.middleware';
import { cacheMiddleware } from '../middleware/cache.middleware';

const router = express.Router();

// 检查用户是否有权访问周易服务
router.get('/access', protect, checkIChingAccess);

// 获取周易卦象解读
router.post('/reading', protect, cacheMiddleware, getIChingReading);

export default router;
