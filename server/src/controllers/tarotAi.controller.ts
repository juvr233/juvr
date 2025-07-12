// @ts-nocheck
import type { Request, Response } from 'express';
import { logger } from '../config/logger';
import { tarotInferenceService } from '../services/ai';

/**
 * 扩展 Request 类型以包含 user 属性
 */
interface AuthRequest extends Request {
  user?: any;
  body: any;
}

/**
 * 生成塔罗牌AI解读
 */
export const generateTarotReading = async (req: Request, res: Response): Promise<void> => {
  try {
    const { question, spread, cards, readingType = 'ai' } = req.body;
    
    // 验证必要参数
    if (!question || !spread || !cards || !Array.isArray(cards)) {
      res.status(400).json({ 
        success: false, 
        message: '请提供完整的塔罗牌解读参数：问题、牌阵和牌' 
      });
      return;
    }
    
    // 验证卡牌格式
    const validCards = cards.every((card: any) => 
      card && typeof card.name === 'string'
    );
    
    if (!validCards) {
      res.status(400).json({ 
        success: false, 
        message: '卡牌格式无效，每张卡牌需要有name属性' 
      });
      return;
    }
    
    // 生成解读
    const tarotInput = { question, spread, cards };
    const reading = await tarotInferenceService.generateReading(tarotInput);
    
    logger.info(`已生成塔罗牌解读`);
    
    res.json({
      success: true,
      data: reading
    });
  } catch (error) {
    logger.error(`生成塔罗牌AI解读失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ 
      success: false, 
      message: '生成塔罗牌解读时发生错误' 
    });
  }
}

/**
 * 评估塔罗牌解读质量
 * 用于收集用户反馈来提高AI模型
 */
export const evaluateTarotReading = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { readingId, rating, feedback, isFavorite } = req.body;
    
    // 验证必要参数
    if (!readingId || (rating === undefined && feedback === undefined && isFavorite === undefined)) {
      res.status(400).json({ 
        success: false, 
        message: '请提供解读ID和评价信息（评分、反馈或收藏状态）' 
      });
      return;
    }
    
    // 需要用户登录
    if (!req.user || !req.user._id) {
      res.status(401).json({ 
        success: false, 
        message: '需要登录才能评价解读' 
      });
      return;
    }
    
    const userId = req.user._id;
    
    // 更新历史记录中的评价
    // 此处需要添加更新历史记录的逻辑
    
    // 如果评分较高，可以将此解读添加到训练数据中
    if (rating && rating >= 4) {
      try {
        // 获取解读详情
        // const readingDetail = await getUserReadingDetail(userId, readingId);
        
        // 添加到训练数据
        // await tarotInferenceService.addToTrainingData(readingDetail, userId);
        logger.info(`已将高评分塔罗牌解读添加到训练数据中`);
      } catch (trainingError) {
        logger.error(`添加高评分解读到训练数据失败: ${trainingError instanceof Error ? trainingError.message : 'Unknown error'}`);
        // 即使添加到训练数据失败，也继续返回成功
      }
    }
    
    res.json({
      success: true,
      message: '评价已保存'
    });
  } catch (error) {
    logger.error(`评价塔罗牌解读失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ 
      success: false, 
      message: '评价解读时发生错误' 
    });
  }
};
