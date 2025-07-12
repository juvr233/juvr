// @ts-nocheck
import express from 'express';
import {
  getUserSettings,
  updateUserSettings,
  resetUserSettings
} from '../controllers/settings.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// 所有路由都需要身份验证
router.use(protect);

// 获取用户设置
router.get('/', getUserSettings);

// 更新用户设置
router.put('/', updateUserSettings);

// 重置用户设置为默认值
router.post('/reset', resetUserSettings);

export default router;
