import { Request, Response, NextFunction } from 'express';
import { setRequestId, clearRequestId } from '../config/logger';

/**
 * 请求ID中间件
 * 为每个请求分配唯一ID，并在响应完成后清理
 */
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // 从请求头中获取请求ID（如果客户端提供了的话）
  const clientRequestId = req.headers['x-request-id'] as string;
  
  // 设置请求ID（使用客户端提供的或生成新的）
  const requestId = setRequestId(req, clientRequestId);
  
  // 将请求ID添加到响应头
  res.setHeader('X-Request-ID', requestId);
  
  // 在请求对象中存储请求ID，以便在其他中间件和控制器中使用
  (req as any).requestId = requestId;
  
  // 请求结束后清理
  res.on('finish', () => {
    clearRequestId(req);
  });
  
  next();
};

export default requestIdMiddleware; 