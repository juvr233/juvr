import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

/**
 * 自定义错误类
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404错误处理中间件
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`找不到资源: ${req.originalUrl}`, 404);
  next(error);
};

/**
 * 全局错误处理中间件
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // 记录错误
  logger.error(`错误: ${err.message}`, { 
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });
  
  // 设置状态码
  const statusCode = err.statusCode || 500;
  
  // 构建错误响应
  const errorResponse: any = {
    success: false,
    message: err.message || '服务器内部错误'
  };
  
  // 在开发环境中添加更多详细信息
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    
    if (err.errors) {
      errorResponse.errors = err.errors;
    }
  }
  
  // 处理特定类型的错误
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: '输入验证错误',
      errors: err.errors
    });
  }
  
  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: '数据已存在，请使用其他值'
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: '无效的令牌'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: '令牌已过期'
    });
  }
  
  // 发送响应
  res.status(statusCode).json(errorResponse);
};

/**
 * 未捕获的异常处理
 */
export const setupUncaughtExceptionHandler = () => {
  process.on('uncaughtException', (err) => {
    logger.error(`未捕获的异常: ${err.message}`, { stack: err.stack });
    console.error('未捕获的异常，正在关闭服务器...');
    console.error(err);
    process.exit(1);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`未处理的Promise拒绝: ${reason}`, { promise });
    console.error('未处理的Promise拒绝，正在关闭服务器...');
    console.error(reason);
    process.exit(1);
  });
};

/**
 * 请求超时中间件
 * @param timeout 超时时间(毫秒)
 */
export const requestTimeout = (timeout: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 设置请求超时
    req.setTimeout(timeout, () => {
      const error = new AppError('请求处理超时', 408);
      next(error);
    });
    next();
  };
}; 