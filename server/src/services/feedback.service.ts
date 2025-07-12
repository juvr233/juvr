import { UserFeedback } from '../models/userFeedback.model';
import { logger } from '../config/logger';
import mongoose from 'mongoose';

interface FeedbackTrend {
  date: string;
  averageRating: number;
  count: number;
}

interface FeedbackDistribution {
  rating: number;
  count: number;
  percentage: number;
}

interface FeedbackAnalysis {
  totalCount: number;
  averageRating: number;
  distribution: FeedbackDistribution[];
  trends: FeedbackTrend[];
  helpfulPercentage: number;
  accuratePercentage: number;
  topComments: Array<{
    comment: string;
    rating: number;
    createdAt: Date;
  }>;
}

export class FeedbackService {
  /**
   * Get comprehensive feedback analysis for a specific reading type
   */
  public async getAnalysis(readingType: string, timeRange: number = 30): Promise<FeedbackAnalysis> {
    try {
      // Calculate date range (default to last 30 days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeRange);
      
      // Get total count and average rating
      const basicStats = await UserFeedback.aggregate([
        { 
          $match: { 
            readingType,
            createdAt: { $gte: startDate, $lte: endDate }
          } 
        },
        { 
          $group: { 
            _id: null, 
            totalCount: { $sum: 1 },
            averageRating: { $avg: "$rating" },
            helpfulCount: { 
              $sum: { 
                $cond: [{ $eq: ["$helpful", true] }, 1, 0] 
              } 
            },
            accurateCount: { 
              $sum: { 
                $cond: [{ $eq: ["$accurate", true] }, 1, 0] 
              } 
            }
          } 
        }
      ]);
      
      const totalCount = basicStats.length > 0 ? basicStats[0].totalCount : 0;
      const averageRating = basicStats.length > 0 ? basicStats[0].averageRating : 0;
      const helpfulCount = basicStats.length > 0 ? basicStats[0].helpfulCount : 0;
      const accurateCount = basicStats.length > 0 ? basicStats[0].accurateCount : 0;
      
      // Get rating distribution
      const distributionData = await UserFeedback.aggregate([
        { 
          $match: { 
            readingType,
            createdAt: { $gte: startDate, $lte: endDate }
          } 
        },
        { 
          $group: { 
            _id: "$rating", 
            count: { $sum: 1 } 
          } 
        },
        { $sort: { _id: 1 } }
      ]);
      
      const distribution: FeedbackDistribution[] = distributionData.map(item => ({
        rating: item._id,
        count: item.count,
        percentage: totalCount > 0 ? (item.count / totalCount) * 100 : 0
      }));
      
      // Get daily trends
      const trendsData = await UserFeedback.aggregate([
        { 
          $match: { 
            readingType,
            createdAt: { $gte: startDate, $lte: endDate }
          } 
        },
        {
          $group: {
            _id: { 
              $dateToString: { 
                format: "%Y-%m-%d", 
                date: "$createdAt" 
              } 
            },
            averageRating: { $avg: "$rating" },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
      
      const trends: FeedbackTrend[] = trendsData.map(item => ({
        date: item._id,
        averageRating: item.averageRating,
        count: item.count
      }));
      
      // Get top comments (highest rated with comments)
      const topComments = await UserFeedback.find({
        readingType,
        createdAt: { $gte: startDate, $lte: endDate },
        comment: { $ne: null, $ne: "" }
      })
      .sort({ rating: -1, createdAt: -1 })
      .limit(10)
      .select('comment rating createdAt')
      .lean();
      
      return {
        totalCount,
        averageRating,
        distribution,
        trends,
        helpfulPercentage: totalCount > 0 ? (helpfulCount / totalCount) * 100 : 0,
        accuratePercentage: totalCount > 0 ? (accurateCount / totalCount) * 100 : 0,
        topComments
      };
    } catch (error) {
      logger.error(`获取反馈分析失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
  
  /**
   * Compare feedback between two time periods
   */
  public async comparePeriods(
    readingType: string, 
    currentPeriod: number = 30, 
    previousPeriod: number = 30
  ): Promise<any> {
    try {
      // Calculate current period
      const currentEndDate = new Date();
      const currentStartDate = new Date();
      currentStartDate.setDate(currentStartDate.getDate() - currentPeriod);
      
      // Calculate previous period
      const previousEndDate = new Date(currentStartDate);
      const previousStartDate = new Date(previousEndDate);
      previousStartDate.setDate(previousStartDate.getDate() - previousPeriod);
      
      // Get current period stats
      const currentStats = await this.getPeriodStats(readingType, currentStartDate, currentEndDate);
      
      // Get previous period stats
      const previousStats = await this.getPeriodStats(readingType, previousStartDate, previousEndDate);
      
      // Calculate changes
      const ratingChange = currentStats.averageRating - previousStats.averageRating;
      const countChange = currentStats.totalCount - previousStats.totalCount;
      const helpfulChange = currentStats.helpfulPercentage - previousStats.helpfulPercentage;
      const accurateChange = currentStats.accuratePercentage - previousStats.accuratePercentage;
      
      return {
        current: {
          period: `${currentStartDate.toISOString().split('T')[0]} to ${currentEndDate.toISOString().split('T')[0]}`,
          ...currentStats
        },
        previous: {
          period: `${previousStartDate.toISOString().split('T')[0]} to ${previousEndDate.toISOString().split('T')[0]}`,
          ...previousStats
        },
        changes: {
          ratingChange,
          ratingChangePercentage: previousStats.averageRating > 0 
            ? (ratingChange / previousStats.averageRating) * 100 
            : 0,
          countChange,
          countChangePercentage: previousStats.totalCount > 0 
            ? (countChange / previousStats.totalCount) * 100 
            : 0,
          helpfulChange,
          accurateChange
        }
      };
    } catch (error) {
      logger.error(`比较反馈周期失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
  
  /**
   * Get feedback statistics for a specific period
   */
  private async getPeriodStats(
    readingType: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<any> {
    const stats = await UserFeedback.aggregate([
      { 
        $match: { 
          readingType,
          createdAt: { $gte: startDate, $lte: endDate }
        } 
      },
      { 
        $group: { 
          _id: null, 
          totalCount: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          helpfulCount: { 
            $sum: { 
              $cond: [{ $eq: ["$helpful", true] }, 1, 0] 
            } 
          },
          accurateCount: { 
            $sum: { 
              $cond: [{ $eq: ["$accurate", true] }, 1, 0] 
            } 
          }
        } 
      }
    ]);
    
    if (stats.length === 0) {
      return {
        totalCount: 0,
        averageRating: 0,
        helpfulPercentage: 0,
        accuratePercentage: 0
      };
    }
    
    return {
      totalCount: stats[0].totalCount,
      averageRating: stats[0].averageRating,
      helpfulPercentage: stats[0].totalCount > 0 
        ? (stats[0].helpfulCount / stats[0].totalCount) * 100 
        : 0,
      accuratePercentage: stats[0].totalCount > 0 
        ? (stats[0].accurateCount / stats[0].totalCount) * 100 
        : 0
    };
  }
  
  /**
   * Get feedback statistics for all reading types
   */
  public async getAllTypeStats(): Promise<any> {
    try {
      const readingTypes = [
        'tarot', 'iching', 'bazi', 'numerology', 
        'compatibility', 'holistic', 'starAstrology'
      ];
      
      const results: Record<string, any> = {};
      
      for (const type of readingTypes) {
        const stats = await UserFeedback.aggregate([
          { $match: { readingType: type } },
          { 
            $group: { 
              _id: null, 
              totalCount: { $sum: 1 },
              averageRating: { $avg: "$rating" }
            } 
          }
        ]);
        
        results[type] = {
          totalCount: stats.length > 0 ? stats[0].totalCount : 0,
          averageRating: stats.length > 0 ? stats[0].averageRating : 0
        };
      }
      
      return results;
    } catch (error) {
      logger.error(`获取所有类型统计失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
  
  /**
   * Export feedback data for training
   */
  public async exportForTraining(
    readingType: string, 
    minRating: number = 4, 
    limit: number = 1000
  ): Promise<any[]> {
    try {
      const feedbackData = await UserFeedback.find({
        readingType,
        rating: { $gte: minRating },
        usedForTraining: false
      })
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit)
      .populate('userId', 'username')
      .lean();
      
      return feedbackData;
    } catch (error) {
      logger.error(`导出训练数据失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
} 