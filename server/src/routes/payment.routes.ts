// @ts-nocheck
import express from 'express';
import {
  getServices,
  createCheckoutSession,
  handleWebhook,
  verifyPurchase,
  createShopifyPayment,
  handleShopifyWebhook,
  getUserShopifyOrders
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

// Shopify支付相关路由
// 创建Shopify结账 - 需要登录
router.post('/shopify/create-checkout', protect, createShopifyPayment);

// 获取用户的Shopify订单 - 需要登录
router.get('/shopify/orders', protect, getUserShopifyOrders);

// Shopify Webhook
router.post('/shopify/webhook', express.raw({ type: 'application/json' }), handleShopifyWebhook);

export default router;
