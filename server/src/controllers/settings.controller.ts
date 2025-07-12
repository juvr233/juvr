import { Request, Response } from 'express';
import UserSettings from '../models/userSettings.model';
import { logger } from '../config/logger';

// 扩展 Request 类型以包含 user 属性
interface AuthRequest extends Request {
  user?: any;
}

// 获取用户设置
export const getUserSettings = async (req: AuthRequest, res: Response) => {
  try {
    // 查找用户设置，如果不存在则创建默认设置
    let settings = await UserSettings.findOne({ user: req.user?._id });
    
    if (!settings) {
      settings = await UserSettings.create({ user: req.user?._id });
    }
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    logger.error(`获取用户设置失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新用户设置
export const updateUserSettings = async (req: AuthRequest, res: Response) => {
  try {
    const { theme, language, notifications, privacySettings, customization } = req.body;
    
    // 查找并更新用户设置，如果不存在则创建
    const settings = await UserSettings.findOneAndUpdate(
      { user: req.user?._id },
      { theme, language, notifications, privacySettings, customization },
      { new: true, upsert: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    logger.error(`更新用户设置失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 重置用户设置为默认值
export const resetUserSettings = async (req: AuthRequest, res: Response) => {
  try {
    // 删除当前设置
    await UserSettings.deleteOne({ user: req.user?._id });
    
    // 创建新的默认设置
    const settings = await UserSettings.create({ user: req.user?._id });
    
    res.json({
      success: true,
      message: '设置已重置为默认值',
      data: settings
    });
  } catch (error) {
    logger.error(`重置用户设置失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};
