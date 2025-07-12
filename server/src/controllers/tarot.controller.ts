import { Request, Response } from 'express';
import Purchase from '../models/purchase.model';
import PaidService from '../models/paidService.model';
import { logger } from '../config/logger';
import aiService from '../services/ai.service';

// 获取塔罗牌服务访问权限
export const checkTarotAccess = async (req: Request, res: Response) => {
  try {
    const { spreadType } = req.params; // 'five' 或 'ten'
    
    // 验证参数
    if (!spreadType || (spreadType !== 'five' && spreadType !== 'ten')) {
      return res.status(400).json({ 
        success: false,
        message: '无效的牌阵类型，必须是 "five" 或 "ten"' 
      });
    }
    
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: '未授权，请登录' 
      });
    }
    
    // 确定需要检查的服务slug
    const serviceSlug = spreadType === 'five' ? 'five-card-tarot' : 'ten-card-tarot';
    
    // 查询服务
    const service = await PaidService.findOne({ slug: serviceSlug });
    if (!service) {
      return res.status(404).json({ 
        success: false,
        message: '服务不存在' 
      });
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
        success: true,
        hasAccess: true,
        expiresAt: purchase.expiresAt
      });
    } else {
      res.json({
        success: true,
        hasAccess: false,
        message: '需要购买此项服务才能访问'
      });
    }
  } catch (error) {
    logger.error(`检查塔罗牌访问权限失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ 
      success: false,
      message: '服务器错误' 
    });
  }
};

// 获取塔罗牌解读结果
export const getTarotReading = async (req: Request, res: Response) => {
  try {
    const { spreadType } = req.params; // 'three', 'five' 或 'ten'
    
    // 验证参数
    if (!spreadType || !['three', 'five', 'ten'].includes(spreadType)) {
      return res.status(400).json({ 
        success: false,
        message: '无效的牌阵类型，必须是 "three", "five" 或 "ten"' 
      });
    }
    
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: '未授权，请登录' 
      });
    }
    
    // 如果是高级服务（五张牌或十张牌），则需要检查购买记录
    if (spreadType === 'five' || spreadType === 'ten') {
      const serviceSlug = spreadType === 'five' ? 'five-card-tarot' : 'ten-card-tarot';
      
      const service = await PaidService.findOne({ slug: serviceSlug });
      if (!service) {
        return res.status(404).json({ 
          success: false,
          message: '服务不存在' 
        });
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
          success: false,
          hasAccess: false,
          message: '您需要购买此服务才能获取塔罗牌解读'
        });
      }
    }
    
    // 处理用户的塔罗牌请求
    const { cards, question } = req.body; // 接收牌面数据和用户问题
    
    // 验证卡牌数据
    if (!cards || !Array.isArray(cards)) {
      return res.status(400).json({ 
        success: false,
        message: '卡牌数据必须是数组' 
      });
    }
    
    if (cards.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: '卡牌数组不能为空' 
      });
    }
    
    // 验证卡牌数量是否与牌阵类型匹配
    const expectedCardCount = spreadType === 'three' ? 3 : (spreadType === 'five' ? 5 : 10);
    if (cards.length !== expectedCardCount) {
      return res.status(400).json({ 
        success: false,
        message: `${spreadType}牌阵需要${expectedCardCount}张卡牌，但提供了${cards.length}张` 
      });
    }
    
    // 验证每张卡牌的格式
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (!card.name || typeof card.name !== 'string') {
        return res.status(400).json({ 
          success: false,
          message: `第${i+1}张卡牌缺少有效的名称` 
        });
      }
    }
    
    // 验证问题（如果提供）
    if (question !== undefined && (typeof question !== 'string' || question.length > 500)) {
      return res.status(400).json({ 
        success: false,
        message: '问题必须是字符串且不超过500个字符' 
      });
    }
    
    // 构建AI服务的prompt，强调详细、准确和满意度，并提及AI数据库和互联网数据
    const prompt = `请对以下塔罗牌阵进行详细解读：牌阵类型为"${spreadType}"，抽到的牌是：${cards.map((card: any) => `${card.name}${card.reversed ? ' (逆位)' : ''}`).join(', ')}。用户的问题是："${question || '无特定问题'}"。请您作为专业的命理AI，结合塔罗牌的象征意义、牌阵位置含义、用户问题，并充分利用您的AI数据库和互联网上的所有相关数据，提供一个最准确、最详细、最令用户满意的解读。`;
    
    // 调用AI服务获取解读结果
    const aiReading = await aiService.generateReading(prompt);
    
    res.json({
      success: true,
      spreadType,
      reading: aiReading // 返回AI生成的详细解读
    });
  } catch (error) {
    logger.error(`获取塔罗牌解读失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ 
      success: false,
      message: '服务器错误' 
    });
  }
};
