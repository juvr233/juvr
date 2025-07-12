import { Request, Response } from 'express';
import Purchase from '../models/purchase.model';
import PaidService from '../models/paidService.model';
import { logger } from '../config/logger';
import aiService from '../services/ai.service'; // Import AI service

// 检查用户是否有权访问周易服务
export const checkIChingAccess = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    // 查询周易服务
    const service = await PaidService.findOne({ slug: 'iching-divination' });
    if (!service) {
      return res.status(404).json({ message: '服务不存在' });
    }
    
    // 检查用户是否有活跃的购买记录
    const purchase = await Purchase.findOne({
      user: userId,
      service: service._id,
      status: 'completed',
      expiresAt: { $gt: new Date() }
    });
    
    if (purchase) {
      res.json({
        hasAccess: true,
        expiresAt: purchase.expiresAt
      });
    } else {
      res.json({
        hasAccess: false,
        message: '需要购买周易服务才能访问完整功能'
      });
    }
  } catch (error) {
    logger.error(`检查周易访问权限失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取周易卦象解读
export const getIChingReading = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    // 查询周易服务
    const service = await PaidService.findOne({ slug: 'iching-divination' });
    if (!service) {
      return res.status(404).json({ message: '服务不存在' });
    }
    
    // 检查用户是否有活跃的购买记录
    const purchase = await Purchase.findOne({
      user: userId,
      service: service._id,
      status: 'completed',
      expiresAt: { $gt: new Date() }
    });
    
    if (!purchase) {
      return res.status(403).json({
        hasAccess: false,
        message: '您需要购买周易服务才能获取解读'
      });
    }
    
    // 处理用户的周易请求
    const { hexagram, question } = req.body; // 接收用户提供的卦象和问题
    
    if (hexagram === undefined) {
      return res.status(400).json({ message: 'Hexagram is required' });
    }
    
    // 构建AI服务的prompt，强调详细、准确和满意度，并提及AI数据库和互联网数据
    const prompt = `请对周易卦象“${hexagram}”进行详细解读。用户的问题是：“${question || '无特定问题'}”。请您作为专业的命理AI，结合卦象的象征意义、爻辞、用户问题，并充分利用您的AI数据库和互联网上的所有相关数据，提供一个最准确、最详细、最令用户满意的解读。`;
    
    // 调用AI服务获取解读结果
    const aiReading = await aiService.generateReading(prompt);
    
    res.json({
      success: true,
      hexagram,
      reading: aiReading // 返回AI生成的详细解读
    });
  } catch (error) {
    logger.error(`获取周易解读失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};
