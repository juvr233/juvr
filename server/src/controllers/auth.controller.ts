// @ts-nocheck
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { logger } from '../config/logger';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// 扩展 Request 类型以包含 user 属性
interface AuthRequest extends Request {
  user?: any;
}

// 生成访问令牌
const generateAccessToken = (id: string): string => {
  const jwtSecret = process.env.JWT_SECRET || '';
  return jwt.sign({ id }, jwtSecret, { expiresIn: '1h' }); // 缩短访问令牌有效期为1小时
};

// 生成刷新令牌
const generateRefreshToken = (id: string): string => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET || '';
  return jwt.sign({ id }, refreshSecret, { expiresIn: '7d' });
};

// 验证刷新令牌
const verifyRefreshToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_REFRESH_SECRET || '', (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

// 发送邮件
const sendEmail = async (options: { email: string; subject: string; text: string }) => {
  // 创建邮件传输器
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // 邮件选项
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.text,
  };

  // 发送邮件
  await transporter.sendMail(mailOptions);
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
        token: generateAccessToken(userId)
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

    // 检查用户是否存在
    if (!user) {
      return res.status(401).json({ message: '邮箱或密码不正确' });
    }

    // 检查账户是否被锁定
    if (user.accountLocked) {
      const now = new Date();
      if (user.accountLockedUntil && user.accountLockedUntil > now) {
        const remainingMinutes = Math.ceil((user.accountLockedUntil.getTime() - now.getTime()) / 60000);
        return res.status(401).json({ 
          message: `账户已被锁定，请在${remainingMinutes}分钟后再试` 
        });
      } else {
        // 如果锁定时间已过，重置锁定状态
        user.accountLocked = false;
        user.accountLockedUntil = undefined;
        await user.save();
      }
    }

    // 验证密码
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
      // 增加失败登录尝试计数
      await user.incrementLoginAttempts();
      
      if (user.accountLocked) {
        return res.status(401).json({ 
          message: '登录失败次数过多，账户已被锁定30分钟' 
        });
      }
      
      return res.status(401).json({ 
        message: '邮箱或密码不正确',
        attemptsLeft: 5 - user.failedLoginAttempts 
      });
    }

    // 重置登录尝试计数
    await user.resetLoginAttempts();

      // 更新最后登录时间
      user.lastLogin = new Date();
      await user.save();

      const userId = user._id.toString();
    
    // 生成访问令牌和刷新令牌
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);
    
    // 存储刷新令牌哈希到用户记录
    user.refreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await user.save();

    // 设置HTTP-only cookie存储刷新令牌
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7天
    });

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      token: accessToken
      });
  } catch (error) {
    logger.error(`用户登录失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 忘记密码
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // 查找用户
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: '该邮箱未注册' });
    }

    // 生成重置令牌
    const resetToken = await user.generatePasswordResetToken();

    // 创建重置URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // 创建邮件内容
    const message = `
      您收到此邮件是因为您（或其他人）请求重置密码。
      
      请点击以下链接重置密码：
      ${resetUrl}
      
      如果您没有请求重置密码，请忽略此邮件。
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: '密码重置请求',
        text: message,
      });

      res.json({ message: '重置密码邮件已发送' });
    } catch (emailError) {
      // 如果发送邮件失败，清除重置令牌
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      logger.error(`发送密码重置邮件失败: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`);
      return res.status(500).json({ message: '发送邮件失败' });
    }
  } catch (error) {
    logger.error(`忘记密码处理失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 重置密码
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // 获取加密的令牌
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // 查找有效的重置令牌
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: '无效或过期的重置令牌' });
    }

    // 设置新密码
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    // 重置登录尝试计数
    user.failedLoginAttempts = 0;
    user.accountLocked = false;
    user.accountLockedUntil = undefined;
    
    await user.save();

    res.json({ message: '密码重置成功' });
  } catch (error) {
    logger.error(`重置密码失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 刷新令牌
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: '刷新令牌不存在' });
    }

    // 验证刷新令牌
    const decoded = await verifyRefreshToken(refreshToken);
    
    // 查找用户并验证存储的刷新令牌哈希
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const user = await User.findOne({ 
      _id: decoded.id,
      refreshToken: refreshTokenHash
    });

    if (!user) {
      return res.status(401).json({ message: '无效的刷新令牌' });
    }

    // 生成新的访问令牌
    const accessToken = generateAccessToken(user._id.toString());

    res.json({ token: accessToken });
  } catch (error) {
    logger.error(`刷新令牌失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(401).json({ message: '刷新令牌无效或已过期' });
  }
};

// 注销
export const logout = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user) {
      // 清除用户的刷新令牌
      req.user.refreshToken = undefined;
      await req.user.save();
    }
    
    // 清除刷新令牌cookie
    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0)
    });
    
    res.json({ message: '注销成功' });
  } catch (error) {
    logger.error(`用户注销失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取用户信息
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    // The user object is attached by the 'protect' middleware
    const user = await User.findById((req.user as any)?._id).select('-password');
    
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

// Google OAuth Callback
export const googleAuthCallback = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Google认证失败' });
  }
  
  const user = req.user as any; // Cast to access user properties
  const token = generateAccessToken(user._id.toString());
  
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  // Redirect to a specific frontend route to handle the token
  res.redirect(`${clientUrl}/auth/callback?token=${token}`);
};
