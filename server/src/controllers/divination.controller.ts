import { Request, Response } from 'express';
import UserHistory, { 
  HistoryType, 
  NumerologyData, 
  TarotData, 
  IChingData, 
  CompatibilityData,
  BaziData,
  StarAstrologyData,
  HolisticData
} from '../models/userHistory.model';
import { logger } from '../config/logger';
import { 
  generateNumerologyData, 
  generateTarotData, 
  generateIChingData,
  generateCompatibilityData,
  generateHolisticData
} from '../utils/divinationUtils';
import aiService from '../services/ai.service'; // Import AI service

// 扩展 Request 类型以包含 user 属性
interface AuthRequest extends Request {
  user?: any;
}

/**
 * 创建命理分析记录
 */
export const createDivinationRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { type, data, title, description, tags } = req.body;
    
    // 验证请求体
    if (!type || !Object.values(HistoryType).includes(type)) {
      return res.status(400).json({ message: '无效的命理类型' });
    }

    if (!data) {
      return res.status(400).json({ message: '命理数据不能为空' });
    }

    if (!title) {
      return res.status(400).json({ message: '标题不能为空' });
    }

    // 创建新的记录
    const divinationRecord = await UserHistory.create({
      user: req.user?._id,
      type,
      data,
      title,
      description,
      tags,
      date: new Date()
    });

    res.status(201).json({
      success: true,
      data: divinationRecord
    });
  } catch (error) {
    logger.error(`创建命理记录失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 获取用户的所有命理分析记录
 */
export const getDivinationRecords = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      type, 
      page = 1, 
      limit = 10, 
      sort = '-date', 
      tags,
      favorite = false,
      search
    } = req.query;
    
    // 构建查询条件
    const query: any = { user: req.user?._id };
    
    // 添加类型过滤
    if (type && Object.values(HistoryType).includes(type as HistoryType)) {
      query.type = type;
    }

    // 添加标签过滤
    if (tags) {
      const tagList = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagList };
    }

    // 添加收藏过滤
    if (favorite === 'true') {
      query.isFavorite = true;
    }

    // 添加搜索过滤
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // 计算分页
    const skip = (Number(page) - 1) * Number(limit);
    
    // 查询记录
    const records = await UserHistory.find(query)
      .sort(sort as any)
      .skip(skip)
      .limit(Number(limit));
    
    // 获取总记录数
    const total = await UserHistory.countDocuments(query);
    
    res.json({
      success: true,
      count: records.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: records
    });
  } catch (error) {
    logger.error(`获取命理记录失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 获取特定命理记录详情
 */
export const getDivinationDetail = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // 查找记录
    const record = await UserHistory.findOne({
      _id: id,
      $or: [
        { user: req.user?._id },
        { isPublic: true },
        { sharedWith: req.user?._id }
      ]
    });
    
    if (!record) {
      return res.status(404).json({ message: '命理记录不存在或您无权访问' });
    }
    
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    logger.error(`获取命理记录详情失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 更新命理分析记录
 */
export const updateDivinationRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, data, tags, isFavorite } = req.body;
    
    // 查找记录
    const record = await UserHistory.findOne({
      _id: id,
      user: req.user?._id
    });
    
    if (!record) {
      return res.status(404).json({ message: '命理记录不存在或您无权修改' });
    }
    
    // 更新记录字段
    if (title !== undefined) record.title = title;
    if (description !== undefined) record.description = description;
    if (data !== undefined) record.data = data;
    if (tags !== undefined) record.tags = tags;
    if (isFavorite !== undefined) record.isFavorite = isFavorite;
    
    await record.save();
    
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    logger.error(`更新命理记录失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 删除命理分析记录
 */
export const deleteDivinationRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // 查找并删除记录
    const record = await UserHistory.findOneAndDelete({
      _id: id,
      user: req.user?._id
    });
    
    if (!record) {
      return res.status(404).json({ message: '命理记录不存在或您无权删除' });
    }
    
    res.json({
      success: true,
      message: '命理记录已删除'
    });
  } catch (error) {
    logger.error(`删除命理记录失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 分享命理记录给其他用户
 */
export const shareDivinationRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userIds, isPublic } = req.body;
    
    // 查找记录
    const record = await UserHistory.findOne({
      _id: id,
      user: req.user?._id
    });
    
    if (!record) {
      return res.status(404).json({ message: '命理记录不存在或您无权分享' });
    }
    
    // 更新分享设置
    if (userIds !== undefined) {
      record.sharedWith = userIds;
    }
    
    if (isPublic !== undefined) {
      record.isPublic = isPublic;
    }
    
    await record.save();
    
    res.json({
      success: true,
      message: '命理记录分享设置已更新',
      data: record
    });
  } catch (error) {
    logger.error(`分享命理记录失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 获取公开或分享给当前用户的命理记录
 */
export const getSharedDivinationRecords = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // 构建查询条件：公开的或分享给当前用户的记录
    const query = {
      $or: [
        { isPublic: true },
        { sharedWith: req.user?._id }
      ]
    };
    
    // 计算分页
    const skip = (Number(page) - 1) * Number(limit);
    
    // 查询记录
    const records = await UserHistory.find(query)
      .sort('-date')
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'username displayName avatar');
    
    // 获取总记录数
    const total = await UserHistory.countDocuments(query);
    
    res.json({
      success: true,
      count: records.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: records
    });
  } catch (error) {
    logger.error(`获取共享命理记录失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 获取命理统计数据
 */
export const getDivinationStats = async (req: AuthRequest, res: Response) => {
  try {
    // 获取用户的记录统计
    const stats = await UserHistory.aggregate([
      { $match: { user: req.user?._id } },
      { $group: { 
        _id: '$type', 
        count: { $sum: 1 }
      }}
    ]);
    
    // 转换为更易读的格式
    const formattedStats: Record<string, number> = {};
    stats.forEach(item => {
      formattedStats[item._id] = item.count;
    });
    
    // 获取最近记录
    const recentRecords = await UserHistory.find({ user: req.user?._id })
      .sort('-date')
      .limit(5)
      .select('type title date isFavorite');
    
    // 获取收藏数量
    const favoritesCount = await UserHistory.countDocuments({
      user: req.user?._id,
      isFavorite: true
    });
    
    res.json({
      success: true,
      data: {
        typeStats: formattedStats,
        recentRecords,
        favoritesCount,
        totalRecords: Object.values(formattedStats).reduce((a, b) => a + b, 0)
      }
    });
  } catch (error) {
    logger.error(`获取命理统计失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 实时计算数字学结果（不保存到历史记录）
 */
export const calculateNumerology = async (req: Request, res: Response) => {
  try {
    const { birthDate, name } = req.body;
    
    if (!birthDate) {
      return res.status(400).json({ message: '出生日期是必填项' });
    }
    
    const prompt = `请根据姓名“${name || '未知'}”和出生日期“${birthDate}”进行详细的数字学分析。请提供生命数字、表达数字、灵魂冲动数字、个性数字和生日数字的计算结果，并对每个数字以及整体进行深入解读，包括其对个人性格、天赋、挑战和人生道路的影响。请您作为专业的命理AI，充分利用您的AI数据库和互联网上的所有相关数据，提供一个最准确、最详细、最令用户满意的解读。`;
    const aiReading = await aiService.generateReading(prompt);
    
    res.json({
      success: true,
      data: aiReading
    });
  } catch (error) {
    logger.error(`计算数字学失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 实时生成塔罗牌解读（不保存到历史记录）
 */
export const generateTarotReading = async (req: Request, res: Response) => {
  try {
    const { spread, cards, question } = req.body;
    
    if (!spread || !cards || !Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({ message: '牌阵类型和卡牌数据是必填项' });
    }
    
    const prompt = `请对以下塔罗牌阵进行详细解读：牌阵类型为“${spread}”，抽到的牌是：${cards.map((card: any) => `${card.name}${card.reversed ? ' (逆位)' : ''}`).join(', ')}。用户的问题是：“${question || '无特定问题'}”。请您作为专业的命理AI，结合塔罗牌的象征意义、牌阵位置含义、用户问题，并充分利用您的AI数据库和互联网上的所有相关数据，提供一个最准确、最详细、最令用户满意的解读。`;
    const aiReading = await aiService.generateReading(prompt);
    
    res.json({
      success: true,
      data: aiReading
    });
  } catch (error) {
    logger.error(`生成塔罗牌解读失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 实时生成易经解读（不保存到历史记录）
 */
export const generateIChingReading = async (req: Request, res: Response) => {
  try {
    const { hexagram, question } = req.body; // Assuming hexagram can also be passed for specific readings
    
    if (hexagram === undefined && !question) {
      return res.status(400).json({ message: 'Hexagram or question is required' });
    }
    
    const prompt = `请对周易卦象“${hexagram || '未知'}”进行详细解读。用户的问题是：“${question || '无特定问题'}”。请您作为专业的命理AI，结合卦象的象征意义、爻辞、用户问题，并充分利用您的AI数据库和互联网上的所有相关数据，提供一个最准确、最详细、最令用户满意的解读。`;
    const aiReading = await aiService.generateReading(prompt);
    
    res.json({
      success: true,
      data: aiReading
    });
  } catch (error) {
    logger.error(`生成易经解读失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 实时计算兼容性分析（不保存到历史记录）
 */
export const calculateCompatibility = async (req: Request, res: Response) => {
  try {
    const { person1, person2 } = req.body;
    
    if (!person1 || !person1.birthDate || !person2 || !person2.birthDate) {
      return res.status(400).json({ message: '两人的出生日期是必填项' });
    }
    
    const prompt = `请根据以下两人的信息进行详细的兼容性分析：\n\n人物1：姓名“${person1.name || '未知'}”，出生日期“${person1.birthDate}”\n人物2：姓名“${person2.name || '未知'}”，出生日期“${person2.birthDate}”\n\n请综合考虑数字学、星座或其他相关命理学原理，提供一个详细、准确且富有洞察力的兼容性解读，包括双方的优势、挑战以及如何增进关系。`;
    const aiReading = await aiService.generateReading(prompt);
    
    res.json({
      success: true,
      data: aiReading
    });
  } catch (error) {
    logger.error(`计算兼容性失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 实时生成综合命理分析（不保存到历史记录）
 */
export const generateHolisticReading = async (req: Request, res: Response) => {
  try {
    const { birthDate, numerology, tarot, iChing, bazi, starAstrology } = req.body;
    
    if (!birthDate) {
      return res.status(400).json({ message: '出生日期是必填项' });
    }
    
    const holisticData = await generateHolisticData(birthDate, {
      numerology,
      tarot,
      iChing,
      bazi,
      starAstrology
    });
    
    res.json({
      success: true,
      data: holisticData
    });
  } catch (error) {
    logger.error(`生成综合命理分析失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};
