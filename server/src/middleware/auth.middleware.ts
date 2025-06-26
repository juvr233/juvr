import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { logger } from '../config/logger';

interface JwtPayload {
  id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    
    // 检查Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // 从Bearer token中获取token
      token = req.headers.authorization.split(' ')[1];
    }

    // 如果没有token
    if (!token) {
      return res.status(401).json({ message: '未授权，请登录' });
    }

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // 根据token中的id获取用户
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }

    // 将用户信息添加到请求对象
    req.user = user;
    next();
  } catch (error) {
    logger.error(`认证中间件错误: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(401).json({ message: '未授权，请登录' });
  }
};

// 管理员权限检查
export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: '没有管理员权限' });
  }
};
