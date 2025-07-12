import { Request, Response } from 'express';
import User from '../models/user.model';
import { logger } from '../config/logger';

// 扩展 Request 类型以包含 user 属性
interface AuthRequest extends Request {
  user?: any;
}

// 更新用户资料
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      displayName, 
      bio, 
      birthDate, 
      phoneNumber, 
      address,
      socialMedia 
    } = req.body;

    // 查找用户
    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 更新用户资料
    if (displayName !== undefined) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (birthDate !== undefined) user.birthDate = birthDate;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    
    if (address) {
      user.address = {
        ...user.address,
        ...address
      };
    }

    if (socialMedia) {
      user.socialMedia = {
        ...user.socialMedia,
        ...socialMedia
      };
    }

    // 保存更新后的用户资料
    await user.save();

    // 返回更新后的用户资料（不包含密码）
    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        birthDate: user.birthDate,
        phoneNumber: user.phoneNumber,
        address: user.address,
        socialMedia: user.socialMedia,
        registrationDate: user.registrationDate,
        lastLogin: user.lastLogin,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    logger.error(`更新用户资料失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新用户头像
export const updateAvatar = async (req: AuthRequest, res: Response) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({ message: '头像URL是必填项' });
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 更新头像URL
    user.avatar = avatar;
    await user.save();

    res.json({
      success: true,
      data: {
        avatar: user.avatar
      }
    });
  } catch (error) {
    logger.error(`更新头像失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 修改密码
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: '当前密码和新密码都是必填项' });
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 验证当前密码
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: '当前密码不正确' });
    }

    // 更新密码
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: '密码修改成功'
    });
  } catch (error) {
    logger.error(`修改密码失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};
