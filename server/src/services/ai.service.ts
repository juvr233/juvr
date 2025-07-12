import axios from 'axios';
import { logger } from '../config/logger';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// Gemini API配置
const AI_API_URL = process.env.AI_API_URL || 'https://ai.novcase.com/gemini/v1beta';
const AI_API_KEY = process.env.AI_API_KEY || 'sk-520559';
const AI_MODEL = process.env.AI_MODEL || 'Gemini-2.5-Pro';

interface GenerateTextOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
}

class AiService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.AI_API_BASE_URL || 'https://ai.novcase.com/gemini/v1beta';
    this.apiKey = process.env.AI_API_KEY || 'sk-520559';
  }

  /**
   * 生成文本
   * @param prompt 提示词
   * @param options 生成选项
   * @returns 生成的文本
   */
  async generateText(prompt: string, options: GenerateTextOptions = {}): Promise<string> {
    try {
      const {
        model = 'Gemini-2.5-Pro',
        temperature = 0.7,
        maxTokens = 2048,
        topP = 0.95,
        topK = 40
      } = options;

      logger.info(`使用模型 ${model} 生成文本`);

      const response = await axios.post(
        `${this.baseUrl}/models/${model}:generateContent`,
        {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
            topP,
            topK
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      // 解析响应
      if (response.data && response.data.candidates && response.data.candidates.length > 0) {
        const candidate = response.data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          return candidate.content.parts[0].text || '';
        }
      }

      throw new Error('AI响应格式无效');
    } catch (error) {
      logger.error(`AI文本生成失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      if (axios.isAxiosError(error) && error.response) {
        logger.error(`API响应: ${JSON.stringify(error.response.data)}`);
    }
      throw new Error('AI文本生成失败');
    }
  }

  /**
   * 分析情绪
   * @param text 要分析的文本
   * @returns 情绪分析结果
   */
  async analyzeSentiment(text: string): Promise<{ sentiment: string; confidence: number }> {
    try {
      const prompt = `
分析以下文本的情绪，并返回JSON格式的结果，包含sentiment和confidence字段：
"""
${text}
"""

情绪可以是：positive（积极）, negative（消极）, neutral（中性）
置信度是0到1之间的数字。

仅返回JSON格式，不要有任何其他文本。
`;

      const response = await this.generateText(prompt);
      
      try {
        // 尝试解析JSON
        const result = JSON.parse(response);
        if (typeof result.sentiment === 'string' && typeof result.confidence === 'number') {
          return result;
        }
        throw new Error('情绪分析结果格式无效');
      } catch (parseError) {
        logger.error(`解析情绪分析结果失败: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        // 如果无法解析，返回默认值
        return { sentiment: 'neutral', confidence: 0.5 };
      }
    } catch (error) {
      logger.error(`情绪分析失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { sentiment: 'neutral', confidence: 0.5 };
    }
  }

  /**
   * 提取关键词
   * @param text 要分析的文本
   * @param count 要提取的关键词数量
   * @returns 关键词数组
   */
  async extractKeywords(text: string, count: number = 5): Promise<string[]> {
    try {
      const prompt = `
从以下文本中提取最重要的${count}个关键词，并以JSON数组格式返回：
"""
${text}
"""

仅返回JSON格式的关键词数组，不要有任何其他文本。
`;

      const response = await this.generateText(prompt);
      
      try {
        // 尝试解析JSON
        const keywords = JSON.parse(response);
        if (Array.isArray(keywords) && keywords.every(k => typeof k === 'string')) {
          return keywords.slice(0, count);
    }
        throw new Error('关键词提取结果格式无效');
      } catch (parseError) {
        logger.error(`解析关键词提取结果失败: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        // 如果无法解析，尝试使用简单的文本处理
        const words = text.split(/\s+/).filter(w => w.length > 3);
        return [...new Set(words)].slice(0, count);
    }
    } catch (error) {
      logger.error(`关键词提取失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  }

  /**
   * 摘要生成
   * @param text 要摘要的文本
   * @param maxLength 摘要最大长度
   * @returns 生成的摘要
   */
  async generateSummary(text: string, maxLength: number = 200): Promise<string> {
    try {
      const prompt = `
请为以下文本生成一个简洁的摘要，不超过${maxLength}个字符：
"""
${text}
"""

直接返回摘要，不要有任何其他文本。
`;

      const response = await this.generateText(prompt);
      
      // 简单截断以确保不超过最大长度
      return response.substring(0, maxLength);
    } catch (error) {
      logger.error(`摘要生成失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // 如果失败，返回原文的前一部分作为摘要
      return text.substring(0, Math.min(maxLength, text.length)) + (text.length > maxLength ? '...' : '');
    }
  }
}

export default new AiService();
