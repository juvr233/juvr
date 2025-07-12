// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { logger } from '../config/logger';

interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

interface AuthRequest extends Request {
  user?: any;
}

/**
 * 验证JWT令牌并添加用户到请求
 */
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;
    
    // 检查Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // 从Bearer token中获取token
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      // 从cookie中获取token
      token = req.cookies.accessToken;
    }

    // 如果没有token
    if (!token) {
      return res.status(401).json({ message: '未授权，请登录' });
    }

    try {
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      // 检查令牌是否过期
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        return res.status(401).json({ message: '令牌已过期，请重新登录' });
      }

    // 根据token中的id获取用户
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }

      // 检查用户是否被禁用
      if (!user.isActive) {
        return res.status(403).json({ message: '账户已被禁用' });
      }

    // 将用户信息添加到请求对象
    req.user = user;
    next();
    } catch (jwtError) {
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: '无效的令牌' });
      } else if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: '令牌已过期，请重新登录' });
      } else {
        throw jwtError;
      }
    }
  } catch (error) {
    logger.error(`认证中间件错误: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 验证用户角色
 * @param roles 允许的角色数组
 */
export const authorize = (roles: string[] = ['user']) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // 确保用户已通过认证
    if (!req.user) {
      return res.status(401).json({ message: '未授权，请登录' });
    }

    // 检查用户角色是否在允许的角色列表中
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: '权限不足，无法访问此资源' 
      });
    }

    next();
  };
};

/**
 * 验证用户是否为管理员
 */
export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 首先确保用户已认证
    if (!req.user) {
      return res.status(401).json({ message: '未授权，请登录' });
    }
    
    // 检查用户是否为管理员
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: '需要管理员权限' 
      });
    }
    
    next();
  } catch (error) {
    logger.error(`管理员验证错误: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 验证API密钥
 */
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ message: 'API密钥缺失' });
  }
  
  // 验证API密钥
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: '无效的API密钥' });
  }
  
  next();
};

/**
 * 验证IP地址白名单
 */
export const ipWhitelist = (allowedIps: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.ip || req.socket.remoteAddress || '';
    
    // 如果没有设置白名单或者白名单为空，则允许所有IP
    if (!allowedIps.length) {
      return next();
    }
    
    // 检查IP是否在白名单中
    if (!allowedIps.includes(clientIp)) {
      logger.warn(`IP访问限制: ${clientIp} 尝试访问 ${req.originalUrl}`);
      return res.status(403).json({ message: 'IP地址未授权' });
  }
    
    next();
  };
};
