import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import cacheManager from '../services/cacheManager.service';

/**
 * 缓存配置接口
 */
interface CacheOptions {
  ttl?: number;          // 缓存时间（秒）
  keyPrefix?: string;    // 缓存键前缀
  condition?: (req: Request) => boolean; // 条件函数，决定是否缓存
}

/**
 * 高级缓存中间件
 * 支持自定义缓存键、条件缓存和不同的缓存时间
 */
export const advancedCacheMiddleware = (options: CacheOptions = {}) => {
  const {
    ttl = 3600,           // 默认缓存1小时
    keyPrefix = 'api:',   // 默认键前缀
    condition = () => true // 默认总是缓存
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    // 仅缓存GET请求
    if (req.method !== 'GET') {
      return next();
    }
    
    // 检查是否满足缓存条件
    if (!condition(req)) {
      return next();
    }

    // 创建缓存键
    const key = `${keyPrefix}${req.originalUrl || req.url}`;
    
    try {
      // 尝试从缓存获取数据
      const cachedData = await cacheManager.get(key);
      
      if (cachedData) {
        logger.debug(`缓存命中: ${key}`);
        
        // 添加缓存指示头
        res.setHeader('X-Cache', 'HIT');
        
        // 返回缓存的数据
        return res.send(cachedData);
      }
      
      // 添加缓存指示头
      res.setHeader('X-Cache', 'MISS');
    } catch (err) {
      logger.error(`缓存获取错误: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    // 保存原始的send方法
    const originalSend = res.send;
    
    // 重写send方法以拦截响应
    res.send = function(body) {
      // 恢复原始的send方法
      res.send = originalSend;
      
      // 只缓存成功的响应
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          // 异步缓存响应数据
          (async () => {
            try {
              // 将内存TTL设置为比Redis TTL短，以确保数据新鲜度
              const memoryTTL = ttl * 500; // 内存缓存TTL（毫秒）
              await cacheManager.set(key, body, memoryTTL, ttl);
              logger.debug(`缓存已设置: ${key}, TTL: ${ttl}秒`);
            } catch (error) {
              logger.error(`设置缓存失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          })();
        } catch (err) {
          logger.error(`缓存设置错误: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }
      
      // 调用原始的send方法
      return originalSend.call(this, body);
    };

    next();
  };
};

/**
 * 根据请求参数创建缓存键
 * @param req 请求对象
 * @param includeHeaders 是否包含请求头
 * @returns 缓存键
 */
export const createCacheKey = (req: Request, includeHeaders: string[] = []): string => {
  const url = req.originalUrl || req.url;
  
  // 基本键
  let key = `${req.method}:${url}`;
  
  // 添加用户ID（如果有）
  if ((req as any).user?.id) {
    key += `:user=${(req as any).user.id}`;
  }
  
  // 添加指定的请求头
  if (includeHeaders.length > 0) {
    const headerValues = includeHeaders
      .map(header => {
        const value = req.headers[header.toLowerCase()];
        return value ? `${header}=${value}` : null;
      })
      .filter(Boolean)
      .join(':');
    
    if (headerValues) {
      key += `:${headerValues}`;
    }
  }
  
  return key;
};

/**
 * 为特定路由创建缓存中间件
 * @param ttl 缓存时间（秒）
 * @param keyGenerator 缓存键生成函数
 */
export const routeCache = (
  ttl: number = 3600,
  keyGenerator?: (req: Request) => string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 仅缓存GET请求
    if (req.method !== 'GET') {
      return next();
    }
    
    // 生成缓存键
    const key = keyGenerator 
      ? keyGenerator(req) 
      : createCacheKey(req, ['accept-language']);
    
    try {
      // 尝试从缓存获取数据
      const cachedData = await cacheManager.get(key);
      
      if (cachedData) {
        logger.debug(`路由缓存命中: ${key}`);
        res.setHeader('X-Cache', 'HIT');
        return res.send(cachedData);
      }
      
      res.setHeader('X-Cache', 'MISS');
    } catch (err) {
      logger.error(`路由缓存获取错误: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    
    // 保存原始的send方法
    const originalSend = res.send;
    
    // 重写send方法以拦截响应
    res.send = function(body) {
      // 恢复原始的send方法
      res.send = originalSend;
      
      // 只缓存成功的响应
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          // 异步缓存响应数据
          (async () => {
            try {
              const memoryTTL = ttl * 500; // 内存缓存TTL（毫秒）
              await cacheManager.set(key, body, memoryTTL, ttl);
              logger.debug(`路由缓存已设置: ${key}, TTL: ${ttl}秒`);
            } catch (error) {
              logger.error(`设置路由缓存失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          })();
        } catch (err) {
          logger.error(`路由缓存设置错误: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }
      
      // 调用原始的send方法
      return originalSend.call(this, body);
    };
    
    next();
  };
};

/**
 * 清除特定前缀的缓存
 * @param keyPrefix 缓存键前缀
 */
export const clearCacheByPrefix = async (keyPrefix: string): Promise<void> => {
  try {
    // 这里需要实现清除特定前缀的缓存的逻辑
    // 由于我们的CacheManager目前不支持按前缀清除，这里只是一个示例
    logger.info(`清除缓存前缀: ${keyPrefix}`);
    
    // 实际应用中，可以通过Redis的SCAN命令实现按前缀清除
    // 目前简单地清除所有缓存
    await cacheManager.clear();
  } catch (error) {
    logger.error(`清除缓存失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// 为向后兼容保留原始的缓存中间件
export const cacheMiddleware = advancedCacheMiddleware();
