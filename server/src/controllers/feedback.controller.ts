import { Request, Response, NextFunction } from 'express';
import { UserFeedback } from '../models/userFeedback.model';
import { logger } from '../config/logger';

/**
 * Submit feedback for a divination reading
 */
export const submitFeedback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { readingId, readingType, rating, comment, helpful, accurate } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // Check if user already submitted feedback for this reading
    const existingFeedback = await UserFeedback.findOne({ userId, readingId });
    
    if (existingFeedback) {
      // Update existing feedback
      existingFeedback.rating = rating;
      existingFeedback.comment = comment;
      existingFeedback.helpful = helpful;
      existingFeedback.accurate = accurate;
      
      await existingFeedback.save();
      
      res.status(200).json({
        success: true,
        message: '反馈已更新',
        feedback: existingFeedback
      });
    } else {
      // Create new feedback
      const newFeedback = new UserFeedback({
        userId,
        readingId,
        readingType,
        rating,
        comment,
        helpful,
        accurate
      });
      
      await newFeedback.save();
      
      res.status(201).json({
        success: true,
        message: '反馈已提交',
        feedback: newFeedback
      });
    }
  } catch (error) {
    logger.error(`提交反馈失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(error);
  }
};

/**
 * Get feedback statistics
 */
export const getFeedbackStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { readingType } = req.params;
    
    // Get average rating for the reading type
    const averageRating = await UserFeedback.getAverageRatingByType(readingType);
    
    // Get count of feedback entries
    const totalCount = await UserFeedback.countDocuments({ readingType });
    
    // Get rating distribution
    const ratingDistribution = await UserFeedback.aggregate([
      { $match: { readingType } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Calculate helpful and accurate percentages
    const helpfulCount = await UserFeedback.countDocuments({ 
      readingType, 
      helpful: true 
    });
    
    const accurateCount = await UserFeedback.countDocuments({ 
      readingType, 
      accurate: true 
    });
    
    const stats = {
      averageRating,
      totalCount,
      ratingDistribution,
      helpfulPercentage: totalCount > 0 ? (helpfulCount / totalCount) * 100 : 0,
      accuratePercentage: totalCount > 0 ? (accurateCount / totalCount) * 100 : 0
    };
    
    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    logger.error(`获取反馈统计失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(error);
  }
};

/**
 * Mark feedback as used for training
 */
export const markFeedbackAsUsed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { feedbackIds } = req.body;
    
    if (!Array.isArray(feedbackIds) || feedbackIds.length === 0) {
      res.status(400).json({ message: '需要提供反馈ID数组' });
      return;
    }
    
    // Update multiple documents
    const result = await UserFeedback.updateMany(
      { _id: { $in: feedbackIds } },
      { $set: { usedForTraining: true } }
    );
    
    res.status(200).json({
      success: true,
      message: `已将${result.modifiedCount}条反馈标记为已用于训练`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    logger.error(`标记反馈为已用于训练失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(error);
  }
};

/**
 * Get feedback for a specific reading
 */
export const getFeedbackForReading = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { readingId } = req.params;
    
    const feedback = await UserFeedback.find({ readingId })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      feedback
    });
  } catch (error) {
    logger.error(`获取阅读反馈失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(error);
  }
};

/**
 * Get feedback for training
 */
export const getFeedbackForTraining = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    
    const feedback = await UserFeedback.getFeedbackForTraining(limit);
    
    res.status(200).json({
      success: true,
      count: feedback.length,
      feedback
    });
  } catch (error) {
    logger.error(`获取训练反馈失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(error);
  }
}; 