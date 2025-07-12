import winston from 'winston';
import 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// 加载环境变量
dotenv.config();

// 获取日志配置
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const LOG_DIR = process.env.LOG_DIR || path.join(process.cwd(), 'logs');
const NODE_ENV = process.env.NODE_ENV || 'development';

// 确保日志目录存在
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// 请求ID存储
const requestStorage = new Map<string, string>();

// 定义日志格式
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
  winston.format.printf(({ level, message, timestamp, metadata, requestId }) => {
    const meta = Object.keys(metadata).length ? JSON.stringify(metadata) : '';
    const reqId = requestId || '';
    return `${timestamp} [${level.toUpperCase()}] ${reqId ? `[${reqId}] ` : ''}${message} ${meta}`;
  })
);

// JSON格式（用于生产环境）
const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
  winston.format.json()
);

// 创建日志轮转传输器
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(LOG_DIR, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: NODE_ENV === 'production' ? jsonFormat : logFormat,
  auditFile: path.join(LOG_DIR, 'audit.json')
});

// 创建错误日志轮转传输器
const errorRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(LOG_DIR, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error',
  format: NODE_ENV === 'production' ? jsonFormat : logFormat,
  auditFile: path.join(LOG_DIR, 'error-audit.json')
});

// 创建logger实例
export const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: NODE_ENV === 'production' ? jsonFormat : logFormat,
  defaultMeta: { service: 'zenith-destiny-api' },
  transports: [
    // 错误日志写入文件
    errorRotateTransport,
    // 所有日志写入轮转文件
    fileRotateTransport
  ],
  // 处理未捕获的异常和拒绝的Promise
  exceptionHandlers: [
    new winston.transports.DailyRotateFile({
      filename: path.join(LOG_DIR, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: NODE_ENV === 'production' ? jsonFormat : logFormat
    })
  ],
  rejectionHandlers: [
    new winston.transports.DailyRotateFile({
      filename: path.join(LOG_DIR, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: NODE_ENV === 'production' ? jsonFormat : logFormat
    })
  ]
});

// 非生产环境下添加控制台输出
if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

// 生成请求ID
export const generateRequestId = (): string => {
  return uuidv4();
};

// 设置当前请求ID
export const setRequestId = (req: any, id?: string): string => {
  const requestId = id || generateRequestId();
  requestStorage.set(getRequestKey(req), requestId);
  return requestId;
};

// 获取当前请求ID
export const getRequestId = (req: any): string | undefined => {
  return requestStorage.get(getRequestKey(req));
};

// 清除请求ID
export const clearRequestId = (req: any): void => {
  requestStorage.delete(getRequestKey(req));
};

// 获取请求键
const getRequestKey = (req: any): string => {
  return `${req.method}-${req.url}-${Date.now()}`;
};

// 创建子日志记录器（带上下文）
export const createChildLogger = (context: string, requestId?: string) => {
  return logger.child({ context, requestId });
};

// 添加用户活动日志方法
export const userActivity = (userId: string, action: string, details?: any, requestId?: string) => {
  logger.info('User Activity', {
    userId,
    action,
    details,
    requestId,
    timestamp: new Date().toISOString()
  });
};

// 添加系统监控日志方法
export const systemMetric = (metric: string, value: any, requestId?: string) => {
  logger.info('System Metric', {
    metric,
    value,
    requestId,
    timestamp: new Date().toISOString()
  });
};

// 添加API请求日志方法
export const apiRequest = (method: string, path: string, statusCode: number, responseTime: number, requestId?: string) => {
  logger.info('API Request', {
    method,
    path,
    statusCode,
    responseTime,
    requestId,
    timestamp: new Date().toISOString()
  });
};

// 导出日志级别
export const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  HTTP: 'http',
  VERBOSE: 'verbose',
  DEBUG: 'debug',
  SILLY: 'silly'
};

// 导出默认日志实例
export default logger;
