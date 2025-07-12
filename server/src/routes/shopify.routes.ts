import { Router } from 'express';
import * as shopifyController from '../controllers/shopify.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/products', shopifyController.getProducts);
router.post('/checkout', shopifyController.createCheckout);
router.get('/orders', protect, shopifyController.getCustomerOrders);

export default router;
