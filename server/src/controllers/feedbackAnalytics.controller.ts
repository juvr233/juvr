import { Request, Response, NextFunction } from 'express';
import { FeedbackService } from '../services/feedback.service';
import { logger } from '../config/logger';

// Create an instance of the feedback service
const feedbackService = new FeedbackService();

/**
 * Get feedback analysis for a specific reading type
 */
export const getFeedbackAnalysis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { readingType } = req.params;
    const timeRange = req.query.timeRange ? parseInt(req.query.timeRange as string) : 30;
    
    // Validate reading type
    const validTypes = ['tarot', 'iching', 'bazi', 'numerology', 'compatibility', 'holistic', 'starAstrology'];
    if (!validTypes.includes(readingType)) {
      res.status(400).json({ 
        success: false, 
        message: '无效的解读类型' 
      });
      return;
    }
    
    // Get analysis
    const analysis = await feedbackService.getAnalysis(readingType, timeRange);
    
    res.status(200).json({
      success: true,
      readingType,
      timeRange,
      analysis
    });
  } catch (error) {
    logger.error(`获取反馈分析失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(error);
  }
};

/**
 * Compare feedback between two time periods
 */
export const compareFeedbackPeriods = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { readingType } = req.params;
    const currentPeriod = req.query.currentPeriod ? parseInt(req.query.currentPeriod as string) : 30;
    const previousPeriod = req.query.previousPeriod ? parseInt(req.query.previousPeriod as string) : 30;
    
    // Validate reading type
    const validTypes = ['tarot', 'iching', 'bazi', 'numerology', 'compatibility', 'holistic', 'starAstrology'];
    if (!validTypes.includes(readingType)) {
      res.status(400).json({ 
        success: false, 
        message: '无效的解读类型' 
      });
      return;
    }
    
    // Get comparison
    const comparison = await feedbackService.comparePeriods(readingType, currentPeriod, previousPeriod);
    
    res.status(200).json({
      success: true,
      readingType,
      comparison
    });
  } catch (error) {
    logger.error(`比较反馈周期失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(error);
  }
};

/**
 * Get feedback statistics for all reading types
 */
export const getAllTypeStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await feedbackService.getAllTypeStats();
    
    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    logger.error(`获取所有类型统计失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(error);
  }
};

/**
 * Export feedback data for training
 */
export const exportFeedbackForTraining = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { readingType } = req.params;
    const minRating = req.query.minRating ? parseInt(req.query.minRating as string) : 4;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 1000;
    
    // Validate reading type
    const validTypes = ['tarot', 'iching', 'bazi', 'numerology', 'compatibility', 'holistic', 'starAstrology'];
    if (!validTypes.includes(readingType)) {
      res.status(400).json({ 
        success: false, 
        message: '无效的解读类型' 
      });
      return;
    }
    
    // Get data for training
    const trainingData = await feedbackService.exportForTraining(readingType, minRating, limit);
    
    res.status(200).json({
      success: true,
      readingType,
      count: trainingData.length,
      data: trainingData
    });
  } catch (error) {
    logger.error(`导出训练数据失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(error);
  }
}; 