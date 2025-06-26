import express from 'express';
import {
  getServices,
  createCheckoutSession,
  handleWebhook,
  verifyPurchase
} from '../controllers/payment.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// 获取所有付费服务
router.get('/services', getServices);

// 创建结账会话 - 需要登录
router.post('/create-checkout-session', protect, createCheckoutSession);

// 验证用户是否已购买某服务 - 需要登录
router.get('/verify/:serviceSlug', protect, verifyPurchase);

// Stripe Webhook
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
