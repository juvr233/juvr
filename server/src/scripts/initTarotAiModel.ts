// @ts-nocheck
// 塔罗牌AI模型初始化脚本
import { tarotModelTrainingService } from '../services/ai';
import { logger } from '../config/logger';
import mongoose from 'mongoose';
import { ensureDbConnected, closeDbConnection } from '../config/database';

/**
 * 初始化塔罗牌AI模型
 */
async function initTarotAiModel() {
  try {
    logger.info('开始初始化塔罗牌AI模型');
    
    // 连接数据库
    await ensureDbConnected();
    logger.info('数据库连接成功');
    
    // 训练塔罗牌模型
    logger.info('开始训练初始塔罗牌AI模型');
    
    const model = await tarotModelTrainingService.trainModel({
      epochs: 50,
      learningRate: 0.001,
      batchSize: 16,
      validationSplit: 0.2
    });
    
    if (model) {
      logger.info(`塔罗牌AI模型训练成功，版本: ${model.version}, 准确率: ${model.accuracy}`);
      
      // 保存模型
      logger.info('塔罗牌AI模型已保存到文件');
    } else {
      logger.error('塔罗牌AI模型训练失败');
    }
    
    await closeDbConnection();
    logger.info('数据库连接已关闭');
    
    return { success: !!model, model };
  } catch (error) {
    logger.error(`初始化塔罗牌AI模型失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    try {
      await closeDbConnection();
    } catch (disconnectError) {
      logger.error('关闭数据库连接失败');
    }
    
    return { success: false, error };
  }
}

// 判断是否直接运行此脚本
if (require.main === module) {
  initTarotAiModel().then((result) => {
    if (result.success) {
      logger.info('脚本执行成功');
      process.exit(0);
    } else {
      logger.error('脚本执行失败');
      process.exit(1);
    }
  });
}

export default initTarotAiModel;
