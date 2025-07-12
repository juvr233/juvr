import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import crypto from 'crypto';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import mongoSanitize from 'express-mongo-sanitize';

/**
 * 配置安全头中间件
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https://cdn.jsdelivr.net'],
      connectSrc: ["'self'", process.env.CLIENT_URL || 'http://localhost:3000'],
    },
  },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'same-origin' },
  hsts: {
    maxAge: 15552000, // 180 天
    includeSubDomains: true,
    preload: true,
  },
  frameguard: {
    action: 'deny',
  },
  dnsPrefetchControl: {
    allow: false,
  },
  permittedCrossDomainPolicies: {
    permittedPolicies: 'none',
  },
});

/**
 * 防止XSS攻击中间件
 */
export const preventXSS = xss();

/**
 * 防止HTTP参数污染中间件
 */
export const preventHPP = hpp();

/**
 * MongoDB数据清理中间件
 * 防止NoSQL注入攻击
 */
export const sanitizeMongo = mongoSanitize();

/**
 * 创建CSRF保护中间件
 */
export const csrfProtection = () => {
  const cookieMiddleware = cookieParser();
  const csrfMiddleware = csurf({
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    },
  });

  return (req: Request, res: Response, next: NextFunction) => {
    // 跳过API路由的CSRF检查
    if (req.path.startsWith('/api/') && req.method !== 'GET') {
      // 对于API路由，使用自定义令牌验证
      const token = req.headers['x-csrf-token'] || req.headers['x-xsrf-token'];
      const expectedToken = req.cookies && req.cookies['csrf-token'];
      
      if (!token || !expectedToken || token !== expectedToken) {
        return res.status(403).json({
          success: false,
          message: 'CSRF令牌无效或缺失',
        });
      }
      
      return next();
    }
    
    // 对于非API路由，使用标准CSRF保护
    cookieMiddleware(req, res, (err: any) => {
      if (err) return next(err);
      csrfMiddleware(req, res, next);
    });
  };
};

/**
 * 生成CSRF令牌中间件
 */
export const generateCSRFToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies || !req.cookies['csrf-token']) {
    const token = crypto.randomBytes(16).toString('hex');
    res.cookie('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1天
    });
  }
  next();
};

/**
 * 请求清理中间件
 * 清理请求参数中的潜在危险字符
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    // 递归清理对象
    const sanitizeObject = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) {
        return typeof obj === 'string' ? sanitizeString(obj) : obj;
      }
      
      if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
      }
      
      const result: Record<string, any> = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          // 清理键名
          const sanitizedKey = sanitizeString(key);
          // 递归清理值
          result[sanitizedKey] = sanitizeObject(obj[key]);
        }
      }
      
      return result;
    };
    
    // 清理字符串
    const sanitizeString = (str: string): string => {
      // 移除潜在的脚本标签和事件处理程序
      return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/on\w+='[^']*'/gi, '')
        .replace(/on\w+=\w+/gi, '');
    };
    
    req.body = sanitizeObject(req.body);
  }
  
  next();
};

/**
 * 组合所有安全中间件
 */
export const securityMiddleware = [
  securityHeaders,
  preventXSS,
  preventHPP,
  sanitizeMongo,
  generateCSRFToken,
  sanitizeInput
]; 