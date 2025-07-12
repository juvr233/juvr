import { Request, Response } from 'express';
import recommendationService from '../services/recommendation.service';
import { logger } from '../config/logger';

// 扩展 Request 类型以包含 user 属性
interface AuthRequest extends Request {
  user?: any;
}

/**
 * 获取基于命理参数的产品推荐
 */
export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const { numerology, tarot, iching, limit = 5 } = req.body;
    
    // 构建推荐参数
    const params: any = {};
    
    // 处理数字学参数
    if (numerology && typeof numerology === 'object') {
      params.numerology = {
        lifePath: parseInt(numerology.lifePath) || 0,
        expression: parseInt(numerology.expression) || 0
      };
    }
    
    // 处理塔罗牌参数
    if (tarot && Array.isArray(tarot)) {
      params.tarot = tarot.filter(card => typeof card === 'string');
    }
    
    // 处理易经参数
    if (iching && typeof iching === 'string') {
      params.iching = iching;
    }
    
    // 如果用户已登录，添加用户ID
    if ((req as AuthRequest).user) {
      params.userId = (req as AuthRequest).user._id.toString();
    }
    
    // 获取推荐
    const recommendations = await recommendationService.getRecommendations(
      params,
      parseInt(limit.toString()) || 5
    );
    
    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    logger.error(`获取推荐失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({
      success: false,
      message: '获取推荐失败'
    });
  }
};

/**
 * 获取个性化推荐
 */
export const getPersonalizedRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    // 确保用户已登录
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '需要登录才能获取个性化推荐'
      });
    }
    
    const userId = req.user._id.toString();
    const limit = parseInt(req.query.limit as string) || 5;
    
    // 获取个性化推荐
    const recommendations = await recommendationService.getPersonalizedRecommendations(userId, limit);
    
    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    logger.error(`获取个性化推荐失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({
      success: false,
      message: '获取个性化推荐失败'
    });
  }
};

/**
 * 获取相关产品推荐
 */
export const getRelatedProducts = async (req: Request, res: Response) => {
  try {
    const { productId, tags, limit = 4 } = req.query;
    
    if (!productId && !tags) {
      return res.status(400).json({
        success: false,
        message: '需要提供productId或tags参数'
      });
    }
    
    // 构建查询参数
    let query = '';
    
    // 如果提供了标签，使用标签查询
    if (tags) {
      const tagList = (tags as string).split(',');
      query = tagList.map(tag => `tag:${tag.trim()}`).join(' OR ');
    }
    
    // 获取推荐
    const recommendations = await recommendationService.getRecommendations(
      { tarot: query ? [query] : undefined },
      parseInt(limit.toString()) || 4
    );
    
    // 如果提供了产品ID，从结果中排除该产品
    const filteredRecommendations = productId 
      ? recommendations.filter(product => product.id !== productId)
      : recommendations;
    
    res.json({
      success: true,
      recommendations: filteredRecommendations
    });
  } catch (error) {
    logger.error(`获取相关产品失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({
      success: false,
      message: '获取相关产品失败'
    });
  }
};

/**
 * 获取热门产品
 */
export const getPopularProducts = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    
    // 使用空参数获取推荐，会自动返回热门产品
    const recommendations = await recommendationService.getRecommendations({}, limit);
    
    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    logger.error(`获取热门产品失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({
      success: false,
      message: '获取热门产品失败'
    });
  }
};
