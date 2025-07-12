// @ts-nocheck
import express from 'express';
import {
  updateProfile,
  updateAvatar,
  changePassword
} from '../controllers/profile.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// 所有路由都需要身份验证
router.use(protect);

// 更新用户资料
router.put('/', updateProfile);

// 更新用户头像
router.put('/avatar', updateAvatar);

// 修改密码
router.put('/password', changePassword);

export default router;
