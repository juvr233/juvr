import { Request, Response } from 'express';
import Stripe from 'stripe';
import PaidService from '../models/paidService.model';
import Purchase from '../models/purchase.model';
import { logger } from '../config/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

// 获取所有可购买的付费项目
export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await PaidService.find({ isActive: true });
    res.json(services);
  } catch (error) {
    logger.error(`获取服务列表失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 创建支付意向
export const createCheckoutSession = async (req: Request, res: Response) => {
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
export const verifyPurchase = async (req: Request, res: Response) => {
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
