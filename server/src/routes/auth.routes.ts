// @ts-nocheck
import express from 'express';
import passport from 'passport';
import { 
  register, 
  login, 
  getUserProfile, 
  googleAuthCallback, 
  refreshToken, 
  logout,
  forgotPassword,
  resetPassword
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { 
  validateBody, 
  validateEmailFormat, 
  validatePasswordStrength 
} from '../middleware/validation.middleware';

const router = express.Router();

// --- 本地认证 ---
// 注册新用户
router.post(
  '/register', 
  [
    validateBody(['username', 'email', 'password']),
    validateEmailFormat(['email']),
    validatePasswordStrength('password', 8, true, true)
  ],
  register
);

// 用户登录
router.post(
  '/login',
  [
    validateBody(['email', 'password']),
    validateEmailFormat(['email'])
  ],
  login
);

// 刷新访问令牌
router.post('/refresh-token', refreshToken);

// 用户注销
router.post('/logout', protect, logout);

// 忘记密码
router.post(
  '/forgot-password',
  [
    validateBody(['email']),
    validateEmailFormat(['email'])
  ],
  forgotPassword
);

// 重置密码
router.post(
  '/reset-password/:token',
  [validatePasswordStrength('password', 8, true, true)],
  resetPassword
);

// 获取用户资料
router.get('/profile', protect, getUserProfile);

// --- Google OAuth ---
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleAuthCallback
);

export default router;
