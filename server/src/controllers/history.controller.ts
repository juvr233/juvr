import { Request, Response } from 'express';
import UserHistory, { HistoryType } from '../models/userHistory.model';
import { logger } from '../config/logger';

// 扩展 Request 类型以包含 user 属性
interface AuthRequest extends Request {
  user?: any;
}

// 创建新的历史记录
export const createHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { type, data, title, description } = req.body;
    
    // 验证类型是否有效
    if (!Object.values(HistoryType).includes(type)) {
      return res.status(400).json({ message: '无效的历史类型' });
    }

    // 创建历史记录
    const history = await UserHistory.create({
      user: req.user?._id,
      type,
      data,
      title,
      description
    });

    res.status(201).json({
      success: true,
      data: history
    });
  } catch (error) {
    logger.error(`创建历史记录失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取用户的所有历史记录
export const getUserHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { type, page = 1, limit = 10, sort = '-date' } = req.query;
    
    // 构建查询条件
    const query: any = { user: req.user?._id };
    
    // 如果指定了类型，添加到查询条件
    if (type && Object.values(HistoryType).includes(type as HistoryType)) {
      query.type = type;
    }
    
    // 计算跳过的记录数
    const skip = (Number(page) - 1) * Number(limit);
    
    // 查询历史记录
    const history = await UserHistory.find(query)
      .sort(sort as any)
      .skip(skip)
      .limit(Number(limit));
    
    // 获取总记录数
    const total = await UserHistory.countDocuments(query);
    
    res.json({
      success: true,
      count: history.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: history
    });
  } catch (error) {
    logger.error(`获取历史记录失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取单个历史记录详情
export const getHistoryDetail = async (req: AuthRequest, res: Response) => {
  try {
    const history = await UserHistory.findOne({
      _id: req.params.id,
      user: req.user?._id
    });
    
    if (!history) {
      return res.status(404).json({ message: '历史记录不存在' });
    }
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    logger.error(`获取历史记录详情失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 标记/取消标记收藏
export const toggleFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const history = await UserHistory.findOne({
      _id: req.params.id,
      user: req.user?._id
    });
    
    if (!history) {
      return res.status(404).json({ message: '历史记录不存在' });
    }
    
    // 切换收藏状态
    history.isFavorite = !history.isFavorite;
    await history.save();
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    logger.error(`更新收藏状态失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 删除历史记录
export const deleteHistory = async (req: AuthRequest, res: Response) => {
  try {
    const history = await UserHistory.findOne({
      _id: req.params.id,
      user: req.user?._id
    });
    
    if (!history) {
      return res.status(404).json({ message: '历史记录不存在' });
    }
    
    await history.deleteOne();
    
    res.json({
      success: true,
      message: '历史记录已删除'
    });
  } catch (error) {
    logger.error(`删除历史记录失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 批量删除历史记录
export const bulkDeleteHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: '请提供有效的历史记录ID列表' });
    }
    
    const result = await UserHistory.deleteMany({
      _id: { $in: ids },
      user: req.user?._id
    });
    
    res.json({
      success: true,
      message: `已删除 ${result.deletedCount} 条历史记录`
    });
  } catch (error) {
    logger.error(`批量删除历史记录失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};
