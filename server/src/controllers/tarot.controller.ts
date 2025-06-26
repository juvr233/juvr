import { Request, Response } from 'express';
import Purchase from '../models/purchase.model';
import PaidService from '../models/paidService.model';
import { logger } from '../config/logger';

// 获取塔罗牌服务访问权限
export const checkTarotAccess = async (req: Request, res: Response) => {
  try {
    const { spreadType } = req.params; // 'five' 或 'ten'
    const userId = (req as any).user.id;
    
    // 确定需要检查的服务slug
    const serviceSlug = spreadType === 'five' ? 'five-card-tarot' : 'ten-card-tarot';
    
    // 查询服务
    const service = await PaidService.findOne({ slug: serviceSlug });
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
        message: '需要购买此项服务才能访问'
      });
    }
  } catch (error) {
    logger.error(`检查塔罗牌访问权限失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取塔罗牌解读结果
export const getTarotReading = async (req: Request, res: Response) => {
  try {
    const { spreadType } = req.params; // 'three', 'five' 或 'ten'
    const userId = (req as any).user.id;
    
    // 如果是高级服务（五张牌或十张牌），则需要检查购买记录
    if (spreadType === 'five' || spreadType === 'ten') {
      const serviceSlug = spreadType === 'five' ? 'five-card-tarot' : 'ten-card-tarot';
      
      const service = await PaidService.findOne({ slug: serviceSlug });
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
          message: '您需要购买此服务才能获取塔罗牌解读'
        });
      }
    }
    
    // 处理用户的塔罗牌请求
    // 这里将从请求体获取牌面数据，并根据不同的牌阵类型生成解读结果
    const { cards } = req.body;
    
    // 根据卡牌生成解读结果
    // 注意：这里只是一个示例，实际的解读逻辑可能更复杂
    const reading = generateTarotReading(spreadType, cards);
    
    res.json({
      success: true,
      spreadType,
      reading
    });
  } catch (error) {
    logger.error(`获取塔罗牌解读失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 生成塔罗牌解读（示例函数，实际实现可能更复杂）
const generateTarotReading = (spreadType: string, cards: any[]) => {
  // 这里应该实现根据不同的牌阵和牌面生成解读的逻辑
  // 实际项目中，这可能涉及到复杂的解读算法或调用AI服务
  
  let reading = {
    overall: '这是一个总体解读。',
    cards: [] as any[]
  };
  
  switch (spreadType) {
    case 'three':
      reading.overall = '三张牌阵为您展示过去、现在和未来的情况。';
      reading.cards = cards.map((card, index) => {
        const positions = ['过去', '现在', '未来'];
        return {
          position: positions[index],
          card: card,
          interpretation: `这张牌在${positions[index]}位置表示...`
        };
      });
      break;
      
    case 'five':
      reading.overall = '五张牌阵提供了更详细的情境分析。';
      const fivePositions = ['现状', '障碍', '建议', '原因', '潜力'];
      reading.cards = cards.map((card, index) => {
        return {
          position: fivePositions[index],
          card: card,
          interpretation: `这张牌在${fivePositions[index]}位置表示...`
        };
      });
      break;
      
    case 'ten':
      reading.overall = '十张凯尔特十字牌阵提供了全面的生活情况分析。';
      const tenPositions = [
        '现状', '挑战', '过去', '近期过去', '最理想结果',
        '近期未来', '自我认知', '外在影响', '希望与恐惧', '最终结果'
      ];
      reading.cards = cards.map((card, index) => {
        return {
          position: tenPositions[index],
          card: card,
          interpretation: `这张牌在${tenPositions[index]}位置表示...`
        };
      });
      break;
      
    default:
      reading.overall = '未知的牌阵类型';
  }
  
  return reading;
};
