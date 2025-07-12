// @ts-nocheck
/**
 * 命理AI模型初始化脚本
 * 用于初始化和配置AI模型，收集训练数据
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ensureDbConnected } from '../config/database';
import { logger } from '../config/logger';
import { trainingDataService, modelTrainingService, AiModelType } from '../services/ai';
import AiModel from '../models/aiModel.model';

// 加载环境变量
dotenv.config();

/**
 * 初始化AI模型
 */
async function initializeAiModels() {
  try {
    logger.info('开始初始化AI模型');
    
    // 确保数据库连接
    await ensureDbConnected();
    
    // 初始化所有类型的模型
    for (const modelType of Object.values(AiModelType)) {
      logger.info(`初始化${modelType}模型`);
      
      // 检查模型是否已存在
      const existingModel = await AiModel.findOne({ type: modelType });
      
      if (!existingModel) {
        // 创建新模型
        const newModel = new AiModel({
          type: modelType,
          version: '0.1.0',
          status: 'inactive',
          trainedOn: null,
          accuracy: 0,
          description: `${modelType} AI解读模型`,
          trainingData: []
        });
        
        await newModel.save();
        logger.info(`创建${modelType}模型成功`);
      } else {
        logger.info(`${modelType}模型已存在，版本: ${existingModel.version}`);
      }
    }
    
    logger.info('AI模型初始化完成');
  } catch (error) {
    logger.error(`AI模型初始化失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 收集训练数据并开始训练
 */
async function collectDataAndTrain() {
  try {
    logger.info('开始收集训练数据');
    
    // 收集数字学训练数据
    const numerologyCount = await trainingDataService.collectFromUserHistory(AiModelType.NUMEROLOGY, 1000);
    logger.info(`收集到${numerologyCount}条数字学训练数据`);
    
    // 收集塔罗牌训练数据
    const tarotCount = await trainingDataService.collectFromUserHistory(AiModelType.TAROT, 1000);
    logger.info(`收集到${tarotCount}条塔罗牌训练数据`);
    
    // 收集易经训练数据
    const ichingCount = await trainingDataService.collectFromUserHistory(AiModelType.ICHING, 1000);
    logger.info(`收集到${ichingCount}条易经训练数据`);
    
    // 训练有足够数据的模型
    if (numerologyCount > 50) {
      logger.info('开始训练数字学模型');
      await modelTrainingService.trainModel(AiModelType.NUMEROLOGY);
    }
    
    if (tarotCount > 50) {
      logger.info('开始训练塔罗牌模型');
      await modelTrainingService.trainModel(AiModelType.TAROT);
    }
    
    if (ichingCount > 50) {
      logger.info('开始训练易经模型');
      await modelTrainingService.trainModel(AiModelType.ICHING);
    }
    
    logger.info('数据收集和模型训练完成');
  } catch (error) {
    logger.error(`数据收集和模型训练失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    await initializeAiModels();
    await collectDataAndTrain();
    
    logger.info('AI模型初始化和训练完成');
  } catch (error) {
    logger.error(`脚本执行失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    // 关闭数据库连接
    mongoose.connection.close();
    logger.info('数据库连接已关闭');
  }
}

// 运行主函数
main();
