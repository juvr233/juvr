import { Router } from 'express';
import * as shopifyAuthController from '../controllers/shopify.auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All Shopify auth routes should be protected, as they link to an existing user
router.post('/register', protect, shopifyAuthController.registerShopifyCustomer);
router.post('/login', protect, shopifyAuthController.loginShopifyCustomer);

export default router;
