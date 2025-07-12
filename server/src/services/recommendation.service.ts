import { getProducts } from './shopify.service';
import { logger } from '../config/logger';
import UserHistory from '../models/userHistory.model';
import User from '../models/user.model';
import aiService from './ai.service';
import mongoose from 'mongoose';

interface RecommendationParams {
  numerology?: { lifePath: number; expression: number };
  tarot?: string[]; // Card names or keywords
  iching?: string; // Hexagram name or keyword
  userId?: string; // 用户ID，用于获取历史记录
}

// Simplified product type from Shopify
interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  tags: string[];
  price?: string;
  images?: { src: string }[];
  variants?: any[];
}

export class RecommendationService {
  async getRecommendations(params: RecommendationParams, limit: number = 5): Promise<ShopifyProduct[]> {
    try {
      // 获取基于参数的推荐
      const paramRecommendations = await this.getParameterBasedRecommendations(params, limit * 2);
      
      // 如果提供了用户ID，获取基于历史的推荐
      let historyRecommendations: ShopifyProduct[] = [];
      if (params.userId) {
        historyRecommendations = await this.getHistoryBasedRecommendations(params.userId, limit);
      }
      
      // 合并推荐结果
      const allRecommendations = [...paramRecommendations, ...historyRecommendations];
      
      // 去重
      const uniqueProducts = this.removeDuplicates(allRecommendations);
      
      // 如果推荐结果不足，获取热门产品补充
      if (uniqueProducts.length < limit) {
        const popularProducts = await this.getPopularProducts(limit - uniqueProducts.length);
        uniqueProducts.push(...popularProducts);
      }
      
      // 再次去重并限制数量
      return this.removeDuplicates(uniqueProducts).slice(0, limit);
    } catch (error) {
      logger.error(`获取推荐失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error('获取推荐失败');
    }
  }

  /**
   * 基于参数的推荐
   */
  private async getParameterBasedRecommendations(params: RecommendationParams, limit: number): Promise<ShopifyProduct[]> {
    try {
      const searchQueries = this.buildSearchQueries(params);
      if (searchQueries.length === 0) {
        // 如果没有特定条件，返回空数组
        return [];
      }

      // 获取每个查询的产品
      const productPromises = searchQueries.map(query => getProducts(query));
      const productLists = await Promise.all(productPromises);
      const allProducts = productLists.flat();

      // 评分和排序产品
      const scoredProducts = this.scoreProducts(allProducts, params);

      // 按评分排序并返回前N个
      const sortedProducts = scoredProducts
        .sort((a, b) => b.score - a.score)
        .map(p => p.product);

      // 去重
      return this.removeDuplicates(sortedProducts).slice(0, limit);
    } catch (error) {
      logger.error(`基于参数的推荐失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  }

  /**
   * 基于用户历史的推荐
   */
  private async getHistoryBasedRecommendations(userId: string, limit: number): Promise<ShopifyProduct[]> {
    try {
      // 获取用户历史记录
      const userHistory = await UserHistory.find({ 
        user: new mongoose.Types.ObjectId(userId) 
      })
      .sort({ timestamp: -1 })
      .limit(20); // 获取最近20条记录
      
      if (!userHistory || userHistory.length === 0) {
        return [];
      }
      
      // 提取关键词
      const historyTexts = userHistory.map(h => {
        if (h.type === 'tarot') {
          return `tarot ${h.data.cards?.map((c: any) => c.name).join(' ')}`;
        } else if (h.type === 'numerology') {
          return `numerology life_path_${h.data.lifePathNumber} expression_${h.data.expressionNumber}`;
        } else if (h.type === 'iching') {
          return `iching ${h.data.hexagram}`;
        }
        return h.type;
      }).join(' ');
      
      // 使用AI服务提取关键词
      let keywords: string[] = [];
      try {
        keywords = await aiService.extractKeywords(historyTexts, 10);
      } catch (error) {
        // 如果AI服务失败，使用简单的关键词提取
        keywords = this.extractSimpleKeywords(historyTexts);
      }
      
      // 使用关键词构建查询
      const query = keywords.map(k => `tag:${k.toLowerCase().replace(/\s+/g, '_')}`).join(' OR ');
      
      // 获取产品
      const products = await getProducts(query);
      
      return products.slice(0, limit);
    } catch (error) {
      logger.error(`基于历史的推荐失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  }

  /**
   * 获取热门产品
   */
  private async getPopularProducts(limit: number): Promise<ShopifyProduct[]> {
    try {
      // 获取带有"popular"标签的产品
      const products = await getProducts('tag:popular');
      
      // 如果没有足够的热门产品，获取一般产品
      if (products.length < limit) {
        const generalProducts = await getProducts('');
        products.push(...generalProducts);
      }
      
      return products.slice(0, limit);
    } catch (error) {
      logger.error(`获取热门产品失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  }

  /**
   * 构建搜索查询
   */
  private buildSearchQueries(params: RecommendationParams): string[] {
    const queries: string[] = [];
    if (params.numerology) {
      queries.push(`tag:numerology AND (tag:life_path_${params.numerology.lifePath} OR tag:expression_${params.numerology.expression})`);
    }
    if (params.tarot && params.tarot.length > 0) {
      const tarotTags = params.tarot.map(t => `tag:${t.toLowerCase().replace(/\s+/g, '_')}`).join(' OR ');
      queries.push(`tag:tarot AND (${tarotTags})`);
    }
    if (params.iching) {
      queries.push(`tag:iching AND tag:${params.iching.toLowerCase().replace(/\s+/g, '_')}`);
    }
    return queries;
  }

  /**
   * 评分产品
   */
  private scoreProducts(products: ShopifyProduct[], params: RecommendationParams): { product: ShopifyProduct; score: number }[] {
    return products.map(product => {
      let score = 0;
      const tags = product.tags.map(t => t.toLowerCase());

      // 基于数字学的评分
      if (params.numerology) {
        if (tags.includes(`life_path_${params.numerology.lifePath}`)) score += 10;
        if (tags.includes(`expression_${params.numerology.expression}`)) score += 8;
      }
      
      // 基于塔罗牌的评分
      if (params.tarot && params.tarot.length > 0) {
        params.tarot.forEach(t => {
          if (tags.includes(t.toLowerCase().replace(/\s+/g, '_'))) score += 5;
          
          // 检查产品标题和描述中是否包含塔罗牌名称
          const cardName = t.toLowerCase();
          if (product.title.toLowerCase().includes(cardName)) score += 3;
          if (product.description && product.description.toLowerCase().includes(cardName)) score += 2;
        });
      }
      
      // 基于易经的评分
      if (params.iching) {
        if (tags.includes(params.iching.toLowerCase().replace(/\s+/g, '_'))) score += 12;
        
        // 检查产品标题和描述中是否包含易经卦名
        const hexagramName = params.iching.toLowerCase();
        if (product.title.toLowerCase().includes(hexagramName)) score += 3;
        if (product.description && product.description.toLowerCase().includes(hexagramName)) score += 2;
      }
      
      // 如果产品有"popular"标签，增加分数
      if (tags.includes('popular')) score += 5;
      
      // 如果产品有"featured"标签，增加分数
      if (tags.includes('featured')) score += 7;
      
      return { product, score };
    });
  }

  /**
   * 去除重复产品
   */
  private removeDuplicates(products: ShopifyProduct[]): ShopifyProduct[] {
    return products.filter((product, index, self) =>
      index === self.findIndex(p => p.id === product.id)
    );
  }

  /**
   * 简单关键词提取
   */
  private extractSimpleKeywords(text: string): string[] {
    // 移除标点符号，转换为小写，分割为单词
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/);
    
    // 过滤掉常见词和短词
    const stopWords = ['the', 'and', 'or', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of'];
    const filteredWords = words.filter(word => 
      word.length > 3 && !stopWords.includes(word)
    );
    
    // 计算词频
    const wordFreq: Record<string, number> = {};
    filteredWords.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    // 按频率排序并返回前10个
    return Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * 获取个性化推荐
   */
  async getPersonalizedRecommendations(userId: string, limit: number = 5): Promise<ShopifyProduct[]> {
    try {
      // 获取用户信息
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('用户不存在');
      }

      // 构建推荐参数
      const params: RecommendationParams = {
        userId
      };

      // 获取用户最近的塔罗牌解读
      const tarotHistory = await UserHistory.findOne({ 
        user: new mongoose.Types.ObjectId(userId),
        type: 'tarot'
      }).sort({ timestamp: -1 });

      if (tarotHistory && tarotHistory.data.cards) {
        params.tarot = tarotHistory.data.cards.map((c: any) => c.name).slice(0, 3);
      }

      // 获取用户最近的数字学解读
      const numerologyHistory = await UserHistory.findOne({ 
        user: new mongoose.Types.ObjectId(userId),
        type: 'numerology'
      }).sort({ timestamp: -1 });

      if (numerologyHistory) {
        params.numerology = {
          lifePath: numerologyHistory.data.lifePathNumber || 0,
          expression: numerologyHistory.data.expressionNumber || 0
        };
      }

      // 获取用户最近的易经解读
      const ichingHistory = await UserHistory.findOne({ 
        user: new mongoose.Types.ObjectId(userId),
        type: 'iching'
      }).sort({ timestamp: -1 });

      if (ichingHistory) {
        params.iching = ichingHistory.data.hexagram;
      }

      // 获取推荐
      return this.getRecommendations(params, limit);
    } catch (error) {
      logger.error(`获取个性化推荐失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return this.getRecommendations({}, limit); // 回退到一般推荐
    }
  }
}

export default new RecommendationService();
