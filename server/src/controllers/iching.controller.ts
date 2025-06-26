import { Request, Response } from 'express';
import Purchase from '../models/purchase.model';
import PaidService from '../models/paidService.model';
import { logger } from '../config/logger';

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
    const { hexagram } = req.body; // 接收用户提供的卦象
    
    // 根据卦象提供解读
    const reading = generateIChingReading(hexagram);
    
    res.json({
      success: true,
      hexagram,
      reading
    });
  } catch (error) {
    logger.error(`获取周易解读失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 生成周易卦象解读（示例函数，实际实现会更复杂）
const generateIChingReading = (hexagram: number) => {
  // 模拟从数据库或外部API获取卦象解读
  // 实际实现应该有更详细的解读数据
  
  const hexagramData = {
    1: {
      name: '乾',
      chinese: '乾为天',
      description: '乾卦：象征天，纯阳之卦。代表创造性、力量与持久的德行。',
      overall: '大吉大利，事业昌盛，身体健康，前途无量。',
      detailed: '乾，元，亨，利，贞。乾卦象征天，代表强健、刚毅、君子，具有领导能力和创造精神。...'
    },
    2: {
      name: '坤',
      chinese: '坤为地',
      description: '坤卦：象征地，纯阴之卦。代表包容性、顺从与广大的德行。',
      overall: '亨通，有利于西南方向，东北方向不宜前往。',
      detailed: '坤，元，亨，利，牝马之贞。坤卦象征地，代表柔顺、包容、淑女，具有广大的德性...'
    },
    // ... 其他62个卦象数据
    64: {
      name: '未济',
      chinese: '火水未济',
      description: '未济卦：水在上而火在下，阴阳逆行，事物尚未成功。',
      overall: '亨通但未完成，小狐狸几乎渡过河，尾巴湿了不是好兆头。',
      detailed: '未济，亨，小狐汔济，濡其尾，无攸利。未济卦象征事物尚未完成，处于变动中...'
    }
  };
  
  // 返回对应卦象的解读，如果没有找到则返回默认信息
  return hexagramData[hexagram as keyof typeof hexagramData] || {
    name: '未知',
    chinese: '未知卦象',
    description: '抱歉，没有找到对应的卦象解读。',
    overall: '请确认卦象号码是否正确（1-64）。',
    detailed: '请重新尝试或联系客服获取帮助。'
  };
};
