import { Request, Response } from 'express';
import { logger } from '../config/logger';
import aiService from '../services/ai.service';

export const getAiReading = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const reading = await aiService.generateReading(prompt as string);
    res.json({ reading });
  } catch (error) {
    logger.error('Failed to get AI reading', error);
    res.status(500).json({ message: '获取AI解读失败' });
  }
};

export const getAdvancedTarotReading = async (req: Request, res: Response) => {
  try {
    const { cards, question } = req.body;

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({ message: 'Cards are required' });
    }

    const prompt = `塔罗牌解读：牌面 ${cards.join(', ')}，问题是：“${question}”`;
    const reading = await aiService.generateReading(prompt);
    res.json({ reading });
  } catch (error) {
    logger.error('Failed to get advanced tarot reading', error);
    res.status(500).json({ message: '获取高级塔罗解读失败' });
  }
};

export const evaluateReadingQuality = async (req: Request, res: Response) => {
  try {
    const { readingId, rating, feedback } = req.body;

    if (!readingId || rating === undefined) {
      return res.status(400).json({ message: 'Reading ID and rating are required' });
    }

    // 在实际应用中，这里会将评价数据存储起来，用于模型训练和改进
    logger.info(`Received evaluation for reading ${readingId}: rating ${rating}, feedback: "${feedback}"`);

    res.json({ message: '感谢您的评价！' });
  } catch (error) {
    logger.error('Failed to evaluate reading quality', error);
    res.status(500).json({ message: '评价失败' });
  }
};
