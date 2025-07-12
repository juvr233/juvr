// @ts-nocheck
// 塔罗牌训练数据导入脚本
import { tarotTrainingDataService } from '../services/ai';
import { logger } from '../config/logger';
import mongoose from 'mongoose';
import { ensureDbConnected, closeDbConnection } from '../config/database';

/**
 * 导入塔罗牌训练数据
 */
async function importTarotTrainingData() {
  try {
    logger.info('开始导入塔罗牌训练数据');
    
    // 连接数据库
    await ensureDbConnected();
    logger.info('数据库连接成功');
    
    // 导入专家数据
    const importedCount = await tarotTrainingDataService.importFromExpertSource();
    logger.info(`成功导入${importedCount}条专家塔罗牌训练数据`);
    
    // 从历史记录收集数据
    const collectedCount = await tarotTrainingDataService.collectFromUserHistory(200);
    logger.info(`从用户历史记录中收集了${collectedCount}条塔罗牌训练数据`);
    
    // 生成增强数据
    const augmentedCount = await tarotTrainingDataService.generateAugmentedData(100);
    logger.info(`生成了${augmentedCount}条增强塔罗牌训练数据`);
    
    const totalCount = importedCount + collectedCount + augmentedCount;
    logger.info(`塔罗牌训练数据导入完成，总共${totalCount}条数据`);
    
    await closeDbConnection();
    logger.info('数据库连接已关闭');
    
    return { success: true, count: totalCount };
  } catch (error) {
    logger.error(`导入塔罗牌训练数据失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
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
  importTarotTrainingData().then((result) => {
    if (result.success) {
      logger.info('脚本执行成功');
      process.exit(0);
    } else {
      logger.error('脚本执行失败');
      process.exit(1);
    }
  });
}

export default importTarotTrainingData;
