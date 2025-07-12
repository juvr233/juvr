import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import requestQueue, { RequestPriority } from '../services/requestQueue.service';

/**
 * 请求队列中间件配置
 */
interface RequestQueueMiddlewareOptions {
  priorityResolver?: (req: Request) => RequestPriority; // 优先级解析函数
  timeout?: number;                                     // 请求超时（毫秒）
  excludePaths?: string[];                              // 排除的路径
  enableOnHighLoad?: boolean;                           // 仅在高负载时启用
  highLoadThreshold?: number;                           // 高负载阈值（并发请求数）
}

/**
 * 创建请求队列中间件
 * 在高负载场景下对请求进行排队和优先级处理
 */
export const createRequestQueueMiddleware = (options: RequestQueueMiddlewareOptions = {}) => {
  const {
    priorityResolver = defaultPriorityResolver,
    timeout = 30000, // 默认30秒超时
    excludePaths = ['/health', '/metrics', '/status', '/favicon.ico'],
    enableOnHighLoad = false,
    highLoadThreshold = 50
  } = options;

  // 当前活跃请求计数
  let activeRequests = 0;

  return (req: Request, res: Response, next: NextFunction) => {
    // 检查是否排除当前路径
    if (excludePaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    // 增加活跃请求计数
    activeRequests++;

    // 检查是否仅在高负载时启用
    if (enableOnHighLoad && activeRequests < highLoadThreshold) {
      // 不在高负载状态，直接处理请求
      res.on('finish', () => {
        activeRequests--;
      });
      
      return next();
    }

    // 确定请求优先级
    const priority = priorityResolver(req);

    // 将请求添加到队列
    requestQueue.enqueue(
      () => {
        return new Promise<void>((resolve, reject) => {
          // 包装next函数以捕获错误
          const nextWrapper = (err?: any) => {
            if (err) {
              reject(err);
              return;
            }

            // 监听响应完成事件
            res.on('finish', () => {
              activeRequests--;
              resolve();
            });

            // 监听错误事件
            res.on('error', (error) => {
              activeRequests--;
              reject(error);
            });

            // 调用原始的next函数
            next();
          };

          // 调用包装的next函数
          nextWrapper();
        });
      },
      priority,
      timeout
    ).catch(error => {
      // 如果请求已经被发送，则不处理错误
      if (res.headersSent) {
        return;
      }

      // 处理队列错误
      if (error.message === '请求队列已满，请稍后再试') {
        res.status(503).json({
          success: false,
          message: '服务器繁忙，请稍后再试'
        });
      } else if (error.message === '请求超时') {
        res.status(504).json({
          success: false,
          message: '请求处理超时，请稍后再试'
        });
      } else {
        logger.error(`请求队列处理错误: ${error instanceof Error ? error.message : 'Unknown error'}`);
        res.status(500).json({
          success: false,
          message: '服务器内部错误'
        });
      }

      // 减少活跃请求计数
      activeRequests--;
    });
  };
};

/**
 * 默认优先级解析函数
 * 根据请求路径、方法和用户角色确定优先级
 */
const defaultPriorityResolver = (req: Request): RequestPriority => {
  // 健康检查和指标端点具有关键优先级
  if (req.path.includes('/health') || req.path.includes('/metrics')) {
    return RequestPriority.CRITICAL;
  }

  // 认证请求具有高优先级
  if (req.path.includes('/auth')) {
    return RequestPriority.HIGH;
  }

  // 管理员用户具有高优先级
  if ((req as any).user?.role === 'admin') {
    return RequestPriority.HIGH;
  }

  // 付费用户具有正常优先级
  if ((req as any).user?.isPremium) {
    return RequestPriority.NORMAL;
  }

  // AI推理请求具有低优先级（计算密集型）
  if (req.path.includes('/ai') || req.path.includes('/divination')) {
    return RequestPriority.LOW;
  }

  // 默认为正常优先级
  return RequestPriority.NORMAL;
};

/**
 * 为特定路由创建请求队列中间件
 * @param priority 请求优先级
 * @param timeout 超时时间（毫秒）
 */
export const routeQueue = (
  priority: RequestPriority = RequestPriority.NORMAL,
  timeout: number = 30000
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    requestQueue.enqueue(
      () => {
        return new Promise<void>((resolve, reject) => {
          // 包装next函数以捕获错误
          const nextWrapper = (err?: any) => {
            if (err) {
              reject(err);
              return;
            }

            // 监听响应完成事件
            res.on('finish', () => {
              resolve();
            });

            // 监听错误事件
            res.on('error', (error) => {
              reject(error);
            });

            // 调用原始的next函数
            next();
          };

          // 调用包装的next函数
          nextWrapper();
        });
      },
      priority,
      timeout
    ).catch(error => {
      // 如果请求已经被发送，则不处理错误
      if (res.headersSent) {
        return;
      }

      // 处理队列错误
      if (error.message === '请求队列已满，请稍后再试') {
        res.status(503).json({
          success: false,
          message: '服务器繁忙，请稍后再试'
        });
      } else if (error.message === '请求超时') {
        res.status(504).json({
          success: false,
          message: '请求处理超时，请稍后再试'
        });
      } else {
        logger.error(`路由队列处理错误: ${error instanceof Error ? error.message : 'Unknown error'}`);
        res.status(500).json({
          success: false,
          message: '服务器内部错误'
        });
      }
    });
  };
};

// 导出请求队列中间件
export const requestQueueMiddleware = createRequestQueueMiddleware(); 