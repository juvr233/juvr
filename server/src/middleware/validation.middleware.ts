import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { body, validationResult, param, query, ValidationChain } from 'express-validator';
import { AppError } from './error.middleware';
import { sanitize } from 'dompurify';

/**
 * 验证请求体中的字段
 * @param requiredFields 必填字段数组
 * @returns 验证中间件
 */
export const validateBody = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: `缺少必填字段: ${missingFields.join(', ')}` 
      });
    }
    
    next();
  };
};

/**
 * 验证请求参数中的字段
 * @param requiredParams 必填参数数组
 * @returns 验证中间件
 */
export const validateParams = (requiredParams: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingParams = requiredParams.filter(param => !req.params[param]);
    
    if (missingParams.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: `缺少必填参数: ${missingParams.join(', ')}` 
      });
    }
    
    next();
  };
};

/**
 * 验证请求查询中的字段
 * @param requiredQueries 必填查询参数数组
 * @returns 验证中间件
 */
export const validateQuery = (requiredQueries: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingQueries = requiredQueries.filter(query => !req.query[query]);
    
    if (missingQueries.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: `缺少必填查询参数: ${missingQueries.join(', ')}` 
      });
    }
    
    next();
  };
};

/**
 * 验证日期格式
 * @param fields 需要验证的日期字段数组
 * @returns 验证中间件
 */
export const validateDateFormat = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const invalidFields: string[] = [];
    
    fields.forEach(field => {
      const value = req.body[field];
      if (value) {
        // 验证日期格式 YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(value)) {
          invalidFields.push(field);
        } else {
          // 验证日期是否有效
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            invalidFields.push(field);
          }
        }
      }
    });
    
    if (invalidFields.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: `无效的日期格式: ${invalidFields.join(', ')}，请使用YYYY-MM-DD格式` 
      });
    }
    
    next();
  };
};

/**
 * 验证邮箱格式
 * @param fields 需要验证的邮箱字段数组
 * @returns 验证中间件
 */
export const validateEmailFormat = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const invalidFields: string[] = [];
    
    fields.forEach(field => {
      const value = req.body[field];
      if (value) {
        // 验证邮箱格式
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(value)) {
          invalidFields.push(field);
        }
      }
    });
    
    if (invalidFields.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: `无效的邮箱格式: ${invalidFields.join(', ')}` 
      });
    }
    
    next();
  };
};

/**
 * 验证密码强度
 * @param field 密码字段名
 * @param minLength 最小长度
 * @param requireSpecialChar 是否需要特殊字符
 * @param requireNumber 是否需要数字
 * @returns 验证中间件
 */
export const validatePasswordStrength = (
  field: string = 'password',
  minLength: number = 8,
  requireSpecialChar: boolean = true,
  requireNumber: boolean = true
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const password = req.body[field];
    
    if (!password) {
      return next(); // 如果没有密码字段，跳过验证
    }
    
    if (password.length < minLength) {
      return res.status(400).json({ 
        success: false,
        message: `密码长度至少需要${minLength}个字符` 
      });
    }
    
    if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return res.status(400).json({ 
        success: false,
        message: '密码需要包含至少一个特殊字符' 
      });
    }
    
    if (requireNumber && !/\d/.test(password)) {
      return res.status(400).json({ 
        success: false,
        message: '密码需要包含至少一个数字' 
      });
    }

    // 检查密码复杂度
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ 
        success: false,
        message: '密码需要包含至少一个大写字母' 
      });
    }
    
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({ 
        success: false,
        message: '密码需要包含至少一个小写字母' 
      });
    }
    
    next();
  };
};

/**
 * 验证结果处理中间件
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '输入验证失败',
      errors: errors.array()
    });
  }
  next();
};

/**
 * 常用验证规则
 */
export const validationRules = {
  // 用户相关
  username: () => body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('用户名长度必须在3-50个字符之间')
    .matches(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/)
    .withMessage('用户名只能包含字母、数字、下划线和中文字符'),
    
  email: () => body('email')
    .trim()
    .isEmail()
    .withMessage('请提供有效的邮箱地址')
    .normalizeEmail(),
    
  password: () => body('password')
    .isLength({ min: 8 })
    .withMessage('密码长度至少需要8个字符')
    .matches(/[A-Z]/)
    .withMessage('密码需要包含至少一个大写字母')
    .matches(/[a-z]/)
    .withMessage('密码需要包含至少一个小写字母')
    .matches(/\d/)
    .withMessage('密码需要包含至少一个数字')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('密码需要包含至少一个特殊字符'),
    
  // ID验证
  mongoId: (paramName: string) => param(paramName)
    .isMongoId()
    .withMessage(`无效的${paramName}格式`),
    
  // 分页参数
  pagination: () => [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('页码必须是大于等于1的整数'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('每页条数必须是1-100之间的整数')
  ],
  
  // 日期范围
  dateRange: () => [
    query('startDate')
      .optional()
      .isDate()
      .withMessage('开始日期格式无效'),
    query('endDate')
      .optional()
      .isDate()
      .withMessage('结束日期格式无效')
      .custom((endDate, { req }) => {
        if (req.query.startDate && new Date(endDate) < new Date(req.query.startDate as string)) {
          throw new Error('结束日期不能早于开始日期');
        }
        return true;
      })
  ]
};

/**
 * 通用错误处理中间件
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`错误: ${err.message}`);
  
  // 检查错误类型
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: '输入验证错误',
      errors: err.message
    });
  }
  
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    return res.status(400).json({
      success: false,
      message: '数据已存在，请使用其他值'
    });
  }
  
  // 默认服务器错误
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? '服务器内部错误' 
      : err.message
  });
};

/**
 * 请求速率限制中间件
 */
export const rateLimiter = (windowMs: number, maxRequests: number) => {
  const requests = new Map<string, { count: number, resetTime: number }>();
  
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    
    // 清理过期的请求记录
    for (const [key, value] of requests.entries()) {
      if (now > value.resetTime) {
        requests.delete(key);
      }
    }
    
    // 检查当前IP的请求次数
    if (!requests.has(ip)) {
      requests.set(ip, {
        count: 1,
        resetTime: now + windowMs
      });
    } else {
      const requestData = requests.get(ip)!;
      
      if (requestData.count >= maxRequests) {
        return res.status(429).json({
          success: false,
          message: '请求过于频繁，请稍后再试'
        });
      }
      
      requestData.count++;
    }
    
    next();
  };
};

/**
 * XSS清理中间件
 */
export const sanitizeXSS = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    const sanitizeObject = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) {
        return typeof obj === 'string' ? sanitize(obj) : obj;
      }
      
      if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
      }
      
      const result: Record<string, any> = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          result[key] = sanitizeObject(obj[key]);
        }
      }
      
      return result;
    };
    
    req.body = sanitizeObject(req.body);
  }
  
  next();
}; 