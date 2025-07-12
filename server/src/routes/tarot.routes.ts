// @ts-nocheck
import express from 'express';
import { checkTarotAccess, getTarotReading } from '../controllers/tarot.controller';
import { protect } from '../middleware/auth.middleware';
import { cacheMiddleware } from '../middleware/cache.middleware';

const router = express.Router();

// 检查用户是否有权访问特定类型的塔罗牌阵
router.get('/access/:spreadType', protect, checkTarotAccess);

// 获取塔罗牌解读结果
router.post('/reading/:spreadType', protect, cacheMiddleware, getTarotReading);

export default router;
