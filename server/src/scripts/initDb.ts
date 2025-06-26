import mongoose from 'mongoose';
import PaidService from '../models/paidService.model';
import { logger } from '../config/logger';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 连接数据库
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    logger.info('MongoDB 连接成功');
    initializeDatabase();
  })
  .catch(err => {
    logger.error(`MongoDB 连接错误: ${err.message}`);
    process.exit(1);
  });

// 初始化付费服务数据
const initializeDatabase = async () => {
  try {
    // 清空现有服务数据（仅在开发环境）
    if (process.env.NODE_ENV !== 'production') {
      await PaidService.deleteMany({});
      logger.info('已清除现有服务数据');
    }

    // 创建付费服务
    const paidServices = [
      {
        name: '五张塔罗牌解读',
        slug: 'five-card-tarot',
        description: '使用五张塔罗牌阵为您提供更深入的生活情境分析，包括现状、障碍、建议、原因和潜力五个方面。',
        price: 29.99,
        type: 'tarot',
        featureLevel: 'advanced',
        isActive: true
      },
      {
        name: '十张塔罗牌凯尔特十字阵解读',
        slug: 'ten-card-tarot',
        description: '使用经典的凯尔特十字牌阵，提供全面而深入的人生解读，覆盖过去、现在、未来等多个维度。',
        price: 49.99,
        type: 'tarot',
        featureLevel: 'advanced',
        isActive: true
      },
      {
        name: '周易六十四卦全解',
        slug: 'iching-divination',
        description: '完整访问周易六十四卦的详细解读，包括卦辞、爻辞、形势判断和具体指导。',
        price: 39.99,
        type: 'iching',
        featureLevel: 'advanced',
        isActive: true
      }
    ];

    // 将服务插入数据库
    await PaidService.insertMany(paidServices);
    logger.info('付费服务数据初始化完成');

    // 断开数据库连接
    await mongoose.disconnect();
    logger.info('数据库初始化脚本执行完毕');
  } catch (error) {
    logger.error(`数据库初始化失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
};
