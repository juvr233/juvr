import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

// 在实际应用中，你可能会将这些数据发送到专门的分析服务，如 Google Analytics, Mixpanel, or a custom database.
const logActivity = (req: Request) => {
  const userId = (req as any).user?._id || 'anonymous';
  const { method, originalUrl, ip } = req;
  const userAgent = req.get('User-Agent') || 'unknown';

  logger.info('User Activity', {
    userId,
    method,
    originalUrl,
    ip,
    userAgent,
    timestamp: new Date().toISOString(),
  });
};

export const analyticsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 在响应完成后记录活动
  res.on('finish', () => {
    // 只记录成功的请求或特定的错误
    if (res.statusCode < 400 || res.statusCode === 401 || res.statusCode === 403) {
      try {
        logActivity(req);
      } catch (error) {
        logger.error('Failed to log user activity', error);
      }
    }
  });

  next();
};
