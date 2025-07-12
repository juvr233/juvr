import { Request, Response } from 'express';
import { logger } from '../config/logger';
import { reportQueue } from '../config/queue';
import aiService from '../services/ai.service';

/**
 * @description Calculate numerology numbers based on user input and get AI interpretation
 * @route POST /api/divination/calculate/numerology
 * @access Private
 */
export const calculateNumerology = async (req: Request, res: Response) => {
  const { name, birthDate } = req.body;

  try {
    // 验证输入
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: '姓名是必填项且必须是字符串' 
      });
    }

    if (!birthDate || typeof birthDate !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: '出生日期是必填项且必须是字符串' 
      });
    }

    // 验证日期格式 YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birthDate)) {
      return res.status(400).json({ 
        success: false, 
        message: '出生日期格式无效，请使用YYYY-MM-DD格式' 
      });
    }

    // 验证日期是否有效
    const date = new Date(birthDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ 
        success: false, 
        message: '出生日期无效' 
      });
    }

    // 验证姓名长度
    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({ 
        success: false, 
        message: '姓名长度必须在2-50个字符之间' 
      });
    }

    // 构建AI服务的prompt，强调详细、准确和满意度，并提及AI数据库和互联网数据
    const prompt = `请根据姓名"${name}"和出生日期"${birthDate}"进行详细的数字学分析。请提供生命数字、表达数字、灵魂冲动数字、个性数字和生日数字的计算结果，并对每个数字以及整体进行深入解读，包括其对个人性格、天赋、挑战和人生道路的影响。请您作为专业的命理AI，充分利用您的AI数据库和互联网上的所有相关数据，提供一个最准确、最详细、最令用户满意的解读。`;

    // 调用AI服务获取详细的数字学解读
    const aiReading = await aiService.generateReading(prompt);

    // 添加任务到报告生成队列（使用AI解读作为数据）
    if (req.user) {
      await reportQueue.add('generate-numerology-report', {
        userId: (req as any).user._id,
        data: { name, birthDate, reading: aiReading },
      });
    }

    logger.info(`为${name}进行了数字学计算和AI解读`);
    res.status(200).json({
      success: true,
      name,
      birthDate,
      reading: aiReading // 返回AI生成的详细解读
    });
  } catch (error) {
    logger.error(`数字学计算和AI解读过程中出错: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ 
      success: false,
      message: '数字学计算和AI解读过程中服务器出错' 
    });
  }
};
