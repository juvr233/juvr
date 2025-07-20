// 扩展API服务，添加命理AI相关接口
import { api } from './api';

/**
 * AI命理解读类型
 */
export enum AiModelType {
  NUMEROLOGY = 'numerology',
  TAROT = 'tarot',
  ICHING = 'iching',
  COMPATIBILITY = 'compatibility',
  BAZI = 'bazi',
  STAR_ASTROLOGY = 'starAstrology',
  HOLISTIC = 'holistic'
}

/**
 * AI命理解读响应
 */
interface AiReadingResponse {
  success: boolean;
  data: any;
}

/**
 * AI命理解读服务
 */
export const aiService = {
  /**
   * 获取AI命理解读
   * @param modelType 模型类型
   * @param inputData 输入数据
   * @returns 命理解读结果
   */
  async getReading(modelType: AiModelType, inputData: any): Promise<any> {
    try {
      const response = await api.post<AiReadingResponse>('/api/ai/reading', {
        modelType,
        inputData
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('获取AI命理解读失败');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('AI命理解读API错误:', error);
      }
      throw error;
    }
  },
  
  /**
   * 批量获取AI命理解读
   * @param modelType 模型类型
   * @param batchInputData 批量输入数据
   * @returns 批量命理解读结果
   */
  async batchGetReadings(modelType: AiModelType, batchInputData: any[]): Promise<any[]> {
    try {
      const response = await api.post<AiReadingResponse>('/api/ai/reading/batch', {
        modelType,
        batchInputData
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('批量获取AI命理解读失败');
      }
    } catch (error) {
      console.error('批量AI命理解读API错误:', error);
      throw error;
    }
  },
  
  /**
   * 数字学解读
   * @param birthDate 出生日期 (YYYY-MM-DD)
   * @param name 姓名
   * @returns 数字学解读结果
   */
  async getNumerologyReading(birthDate: string, name?: string): Promise<any> {
    return this.getReading(AiModelType.NUMEROLOGY, { birthDate, name });
  },
  
  /**
   * 塔罗牌解读
   * @param question 问题
   * @param spread 牌阵类型
   * @param cards 牌组
   * @returns 塔罗牌解读结果
   */
  async getTarotReading(question: string, spread: string, cards: any[]): Promise<any> {
    return this.getReading(AiModelType.TAROT, { question, spread, cards });
  },

  /**
   * 获取AI增强的塔罗牌解读
   * 直接调用专门的塔罗牌AI解读接口
   * @param question 问题
   * @param spread 牌阵类型
   * @param cards 牌组
   * @param readingType 解读类型，'ai'为AI模型解读，'rule'为规则引擎解读
   * @returns 增强的塔罗牌解读结果
   */
  async getEnhancedTarotReading(question: string, spread: string, cards: any[], readingType: 'ai' | 'rule' = 'ai'): Promise<any> {
    try {
      const response = await api.post('/api/ai/tarot/reading', {
        question,
        spread,
        cards,
        readingType
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('获取增强的塔罗牌解读失败');
      }
    } catch (error) {
      console.error('增强塔罗牌解读API错误:', error);
      throw error;
    }
  },

  /**
   * 易经解读
   * @param question 问题
   * @param hexagram 卦象
   * @returns 易经解读结果
   */
  async getIChingReading(question: string, hexagram: string): Promise<any> {
    return this.getReading(AiModelType.ICHING, { question, hexagram });
  },
  
  /**
   * 兼容性分析
   * @param person1 第一人信息
   * @param person2 第二人信息
   * @returns 兼容性分析结果
   */
  async getCompatibilityReading(
    person1: { birthDate: string; name?: string }, 
    person2: { birthDate: string; name?: string }
  ): Promise<any> {
    return this.getReading(AiModelType.COMPATIBILITY, { person1, person2 });
  },
  
  /**
   * 八字解读
   * @param birthDate 出生日期
   * @param birthTime 出生时间
   * @param gender 性别
   * @returns 八字解读结果
   */
  async getBaziReading(birthDate: string, birthTime: string, gender: 'male' | 'female'): Promise<any> {
    return this.getReading(AiModelType.BAZI, { birthDate, birthTime, gender });
  },
  
  /**
   * 星座占星解读
   * @param birthDate 出生日期
   * @param birthTime 出生时间
   * @param birthLocation 出生地点
   * @returns 星座占星解读结果
   */
  async getStarAstrologyReading(birthDate: string, birthTime: string, birthLocation: string): Promise<any> {
    return this.getReading(AiModelType.STAR_ASTROLOGY, { birthDate, birthTime, birthLocation });
  },
  
  /**
   * 评价塔罗牌解读
   * @param readingId 解读ID
   * @param rating 评分 (1-5)
   * @param feedback 文字反馈
   * @param isFavorite 是否收藏
   * @returns 评价结果
   */
  async evaluateTarotReading(readingId: string, rating?: number, feedback?: string, isFavorite?: boolean): Promise<any> {
    try {
      const response = await api.post('/api/ai/tarot/evaluate', {
        readingId,
        rating,
        feedback,
        isFavorite
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error('评价塔罗牌解读失败');
      }
    } catch (error) {
      console.error('评价塔罗牌解读API错误:', error);
      throw error;
    }
  },
  
  /**
   * 综合命理解读
   * @param userData 用户数据
   * @returns 综合命理解读结果
   */
  async getHolisticReading(userData: {
    birthDate: string;
    birthTime?: string;
    name?: string;
    gender?: 'male' | 'female';
    question?: string;
  }): Promise<any> {
    return this.getReading(AiModelType.HOLISTIC, userData);
  }
};

export default aiService;
