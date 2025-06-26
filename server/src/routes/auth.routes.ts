import express from 'express';
import { register, login, getUserProfile } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// 注册新用户
router.post('/register', register);

// 用户登录
router.post('/login', login);

// 获取用户资料 - 需要认证
router.get('/profile', protect, getUserProfile);

export default router;
