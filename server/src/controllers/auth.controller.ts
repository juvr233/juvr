import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/user.model';
import { logger } from '../config/logger';

// 生成JWT Token
const generateToken = (id: string): string => {
  const jwtSecret = process.env.JWT_SECRET || '';
  
  // 为简化问题，使用硬编码的过期时间
  return jwt.sign({ id }, jwtSecret, { expiresIn: '7d' });
};

// 用户注册
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // 检查用户是否已存在
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: '用户名或邮箱已被注册' });
    }

    // 创建新用户
    const user = await User.create({
      username,
      email,
      password
    });

    // 创建成功，返回token和用户信息
    if (user) {
      const userId = user._id.toString();
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(userId)
      });
    } else {
      res.status(400).json({ message: '无效的用户数据' });
    }
  } catch (error) {
    logger.error(`用户注册失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 用户登录
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = await User.findOne({ email });

    // 验证用户和密码
    if (user && (await user.comparePassword(password))) {
      // 更新最后登录时间
      user.lastLogin = new Date();
      await user.save();

      const userId = user._id.toString();
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(userId)
      });
    } else {
      res.status(401).json({ message: '邮箱或密码不正确' });
    }
  } catch (error) {
    logger.error(`用户登录失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取用户信息
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    
    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        registrationDate: user.registrationDate,
        lastLogin: user.lastLogin,
        role: user.role
      });
    } else {
      res.status(404).json({ message: '未找到用户' });
    }
  } catch (error) {
    logger.error(`获取用户资料失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};
