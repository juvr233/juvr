import { Request, Response } from 'express';
import Stripe from 'stripe';
import PaidService from '../models/paidService.model';
import Purchase from '../models/purchase.model';
import { logger } from '../config/logger';
import * as shopifyService from '../services/shopify.service';
import crypto from 'crypto';

// 扩展 Request 类型以包含 user 属性
interface AuthRequest extends Request {
  user?: any;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

/**
 * 验证Shopify Webhook签名
 * @param data 请求体数据
 * @param hmacHeader Shopify提供的HMAC签名
 * @param secret Shopify API Secret
 * @returns 是否验证通过
 */
const verifyShopifyHmac = (data: any, hmacHeader: string, secret: string): boolean => {
  try {
    if (!hmacHeader || !secret) {
      return false;
    }

    // 将请求体转换为字符串
    const message = typeof data === 'string' ? data : JSON.stringify(data);
    
    // 使用Shopify API Secret创建HMAC
    const generatedHash = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('base64');
    
    // 比较生成的HMAC与请求头中的HMAC
    return crypto.timingSafeEqual(
      Buffer.from(generatedHash),
      Buffer.from(hmacHeader)
    );
  } catch (error) {
    logger.error(`Shopify HMAC验证失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
};

// 获取所有可购买的付费项目
export const getServices = async (req: AuthRequest, res: Response) => {
  try {
    const services = await PaidService.find({ isActive: true });
    res.json(services);
  } catch (error) {
    logger.error(`获取服务列表失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 创建支付意向
export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
  try {
    const { serviceId } = req.body;
    const userId = req.user?._id.toString();

    // 获取服务详情
    const service = await PaidService.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: '未找到该服务' });
    }

    // 设定服务有效期（30天）
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    // 创建Stripe checkout session
    // @ts-ignore - Stripe types 和 TypeScript 版本可能不完全匹配
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cny',
            product_data: {
              name: service.name,
              description: service.description,
            },
            unit_amount: service.price * 100, // 单位是分
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/payment/cancel`,
      metadata: {
        serviceId: service._id.toString(),
        userId: userId,
        expiresAt: expiryDate.toISOString(),
      },
    });

    // 创建一个待处理的购买记录
    await Purchase.create({
      user: userId,
      service: service._id,
      transactionId: session.id,
      amount: service.price,
      status: 'pending',
      paymentMethod: 'stripe',
      expiresAt: expiryDate,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    logger.error(`创建结账会话失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '创建支付会话失败' });
  }
};

// 处理Stripe Webhook
export const handleWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;

  try {
    // 验证Webhook签名
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    // 处理不同类型的事件
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // 更新订单状态
        if (session.metadata?.serviceId && session.metadata?.userId) {
          await Purchase.findOneAndUpdate(
            { transactionId: session.id },
            { status: 'completed' }
          );
          logger.info(`订单完成：用户 ${session.metadata.userId} 购买服务 ${session.metadata.serviceId}`);
        }
        break;
      }
      
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // 更新订单状态为失败
        await Purchase.findOneAndUpdate(
          { transactionId: session.id },
          { status: 'failed' }
        );
        break;
      }
      
      // 添加其他你可能需要处理的事件类型...
    }

    res.json({ received: true });
  } catch (error) {
    logger.error(`处理Stripe webhook失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(400).json({ message: 'Webhook处理失败' });
  }
};

// 验证用户是否已购买服务
export const verifyPurchase = async (req: AuthRequest, res: Response) => {
  try {
    const { serviceSlug } = req.params;
    const userId = (req as any).user.id;

    // 获取服务ID
    const service = await PaidService.findOne({ slug: serviceSlug });
    if (!service) {
      return res.status(404).json({ message: '服务不存在' });
    }

    // 检查是否有活跃的购买记录
    const purchase = await Purchase.findOne({
      user: userId,
      service: service._id,
      status: 'completed',
      expiresAt: { $gt: new Date() }
    });

    if (purchase) {
      res.json({
        hasPurchased: true,
        expiresAt: purchase.expiresAt
      });
    } else {
      res.json({
        hasPurchased: false
      });
    }
  } catch (error) {
    logger.error(`验证购买记录失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 使用Shopify创建支付
export const createShopifyPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { variantId, quantity = 1 } = req.body;
    
    if (!variantId) {
      return res.status(400).json({ message: '缺少必要参数：variantId' });
    }
    
    // 创建Shopify结账
    const checkout = await shopifyService.createCheckout(variantId, quantity);
    
    if (checkout.checkoutUserErrors && checkout.checkoutUserErrors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        errors: checkout.checkoutUserErrors 
      });
    }
    
    // 记录订单信息
    if (req.user && checkout.checkout) {
      const userId = req.user._id;
      
      // 设定服务有效期（30天）
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      
      // 创建一个待处理的购买记录
      await Purchase.create({
        user: userId,
        service: 'shopify-product', // 这里可以根据实际情况修改
        transactionId: checkout.checkout.id,
        amount: 0, // 金额将在订单完成后更新
        status: 'pending',
        paymentMethod: 'shopify',
        expiresAt: expiryDate,
      });
    }
    
    res.json({
      success: true,
      checkoutId: checkout.checkout?.id,
      checkoutUrl: checkout.checkout?.webUrl
    });
  } catch (error) {
    logger.error(`创建Shopify支付失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '创建支付失败' });
  }
};

// 处理Shopify Webhook
export const handleShopifyWebhook = async (req: Request, res: Response) => {
  try {
    // 验证Webhook
    const hmacHeader = req.headers['x-shopify-hmac-sha256'] as string;
    const topic = req.headers['x-shopify-topic'] as string;
    
    if (!hmacHeader || !topic) {
      return res.status(401).json({ message: '无效的Webhook请求' });
    }
    
    // 实现HMAC验证
    const isValid = verifyShopifyHmac(
      req.body,
      hmacHeader,
      process.env.SHOPIFY_API_SECRET || '49066cf6a268bef827734e3847d5ddf0'
    );
    
    if (!isValid) {
      logger.warn(`无效的Shopify Webhook签名: ${hmacHeader}`);
      return res.status(401).json({ message: '无效的签名' });
    }
    
    // 处理不同类型的Webhook
    switch (topic) {
      case 'orders/create': {
        // 处理新订单
        const order = req.body;
        logger.info(`收到新的Shopify订单: ${order.id}`);
        
        // 查找相关的购买记录
        // 注意：这里需要根据实际情况实现订单与购买记录的关联
        // 通常，可以使用checkout_token或客户信息来关联
        
        if (order.checkout_token) {
          const purchase = await Purchase.findOne({
            transactionId: order.checkout_token
          });
          
          if (purchase) {
            // 更新购买记录
            purchase.status = 'completed';
            purchase.amount = parseFloat(order.total_price) || 0;
            purchase.metadata = {
              orderId: order.id,
              orderNumber: order.order_number,
              customerEmail: order.email
            };
            
            await purchase.save();
            logger.info(`已更新购买记录: ${purchase._id}`);
          }
        }
        
        break;
      }
      
      case 'orders/fulfilled': {
        // 处理订单已发货
        const order = req.body;
        logger.info(`Shopify订单已发货: ${order.id}`);
        
        // 可以在这里添加额外的业务逻辑，例如发送通知等
        
        break;
      }
      
      case 'orders/cancelled': {
        // 处理订单取消
        const order = req.body;
        logger.info(`Shopify订单已取消: ${order.id}`);
        
        // 更新相关的购买记录
        if (order.checkout_token) {
          await Purchase.findOneAndUpdate(
            { transactionId: order.checkout_token },
            { status: 'cancelled' }
          );
        }
        
        break;
      }
      
      // 可以添加更多的事件处理...
    }
    
    // 返回成功响应
    res.status(200).send('OK');
  } catch (error) {
    logger.error(`处理Shopify webhook失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    // Shopify期望收到200响应，即使处理失败
    res.status(200).send('OK');
  }
};

// 获取用户的Shopify订单
export const getUserShopifyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    
    // 获取用户的购买记录
    const purchases = await Purchase.find({
      user: userId,
      paymentMethod: 'shopify',
      status: 'completed'
    }).sort({ createdAt: -1 });
    
    // 如果用户有Shopify客户ID，还可以从Shopify获取更多订单信息
    if (req.user?.shopifyCustomerId) {
      const shopifyOrders = await shopifyService.getCustomerOrders(req.user.shopifyCustomerId);
      
      // 合并订单信息
      const orders = purchases.map(purchase => {
        const shopifyOrder = shopifyOrders.find(
          order => purchase.metadata?.orderId === order.id
        );
        
        return {
          id: purchase._id,
          date: purchase.createdAt,
          amount: purchase.amount,
          status: purchase.status,
          expiresAt: purchase.expiresAt,
          shopifyOrder: shopifyOrder || null
        };
      });
      
      return res.json(orders);
    }
    
    // 如果没有Shopify客户ID，只返回本地购买记录
    const orders = purchases.map(purchase => ({
      id: purchase._id,
      date: purchase.createdAt,
      amount: purchase.amount,
      status: purchase.status,
      expiresAt: purchase.expiresAt,
      metadata: purchase.metadata
    }));
    
    res.json(orders);
  } catch (error) {
    logger.error(`获取用户Shopify订单失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};
