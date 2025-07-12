import { logger } from '../config/logger';
import redisClient from '../config/redis';

/**
 * 缓存项接口
 */
interface CacheItem<T> {
  value: T;
  expiry: number; // 过期时间戳
}

/**
 * 缓存管理器配置
 */
interface CacheConfig {
  defaultMemoryTTL: number; // 内存缓存默认TTL（毫秒）
  defaultRedisTTL: number;  // Redis缓存默认TTL（秒）
  maxMemoryItems: number;   // 内存缓存最大项数
  enableRedis: boolean;     // 是否启用Redis缓存
}

/**
 * 多级缓存管理器
 * 实现了内存缓存（L1）和Redis缓存（L2）的层级缓存策略
 */
export class CacheManager {
  private static instance: CacheManager;
  private memoryCache: Map<string, CacheItem<any>> = new Map();
  private config: CacheConfig;
  private lastCleanupTime: number = Date.now();
  private cleanupInterval: NodeJS.Timeout | null = null;
  private hitCount: { memory: number; redis: number; miss: number } = { memory: 0, redis: 0, miss: 0 };
  private accessCount: { [key: string]: number } = {};

  /**
   * 私有构造函数，确保单例模式
   */
  private constructor(config?: Partial<CacheConfig>) {
    this.config = {
      defaultMemoryTTL: 5 * 60 * 1000, // 5分钟
      defaultRedisTTL: 60 * 60,        // 1小时
      maxMemoryItems: 1000,            // 最多1000项
      enableRedis: true,               // 默认启用Redis
      ...config
    };

    // 启动定期清理过期缓存项
    this.startPeriodicCleanup();
    
    logger.info('缓存管理器初始化完成');
  }

  /**
   * 获取缓存管理器实例
   */
  public static getInstance(config?: Partial<CacheConfig>): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager(config);
    }
    return CacheManager.instance;
  }

  /**
   * 从缓存获取值
   * @param key 缓存键
   * @returns 缓存值，如果不存在则返回null
   */
  public async get<T>(key: string): Promise<T | null> {
    // 更新访问计数
    this.accessCount[key] = (this.accessCount[key] || 0) + 1;
    
    // 首先检查内存缓存
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem && memoryItem.expiry > Date.now()) {
      this.hitCount.memory++;
      return memoryItem.value as T;
    }

    // 如果内存缓存中没有，且Redis已启用，则检查Redis
    if (this.config.enableRedis) {
      try {
        const redisValue = await redisClient.get(key);
        if (redisValue) {
          this.hitCount.redis++;
          
          // 将Redis中的值添加到内存缓存
          const value = JSON.parse(redisValue) as T;
          this.setMemoryCache(key, value);
          
          return value;
        }
      } catch (error) {
        logger.error(`Redis缓存获取错误: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // 缓存未命中
    this.hitCount.miss++;
    return null;
  }

  /**
   * 设置缓存值
   * @param key 缓存键
   * @param value 缓存值
   * @param memoryTTL 内存缓存TTL（毫秒）
   * @param redisTTL Redis缓存TTL（秒）
   */
  public async set<T>(
    key: string, 
    value: T, 
    memoryTTL: number = this.config.defaultMemoryTTL,
    redisTTL: number = this.config.defaultRedisTTL
  ): Promise<void> {
    // 设置内存缓存
    this.setMemoryCache(key, value, memoryTTL);
    
    // 如果Redis已启用，则设置Redis缓存
    if (this.config.enableRedis) {
      try {
        await redisClient.setEx(key, redisTTL, JSON.stringify(value));
      } catch (error) {
        logger.error(`Redis缓存设置错误: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  /**
   * 删除缓存项
   * @param key 缓存键
   */
  public async delete(key: string): Promise<void> {
    // 从内存缓存中删除
    this.memoryCache.delete(key);
    
    // 如果Redis已启用，则从Redis中删除
    if (this.config.enableRedis) {
      try {
        await redisClient.del(key);
      } catch (error) {
        logger.error(`Redis缓存删除错误: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  /**
   * 清除所有缓存
   */
  public async clear(): Promise<void> {
    // 清除内存缓存
    this.memoryCache.clear();
    this.accessCount = {};
    
    // 如果Redis已启用，则清除Redis缓存
    if (this.config.enableRedis) {
      try {
        // 注意：这里只清除与应用相关的键，而不是所有Redis键
        // 可以使用特定的键前缀来识别应用缓存
        const keys = await redisClient.keys('app:cache:*');
        if (keys.length > 0) {
          await redisClient.del(keys);
        }
      } catch (error) {
        logger.error(`Redis缓存清除错误: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  /**
   * 获取缓存统计信息
   */
  public getStats(): any {
    const totalHits = this.hitCount.memory + this.hitCount.redis + this.hitCount.miss;
    const hitRate = totalHits > 0 ? ((this.hitCount.memory + this.hitCount.redis) / totalHits) * 100 : 0;
    
    // 找出访问最频繁的键
    const topKeys = Object.entries(this.accessCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([key, count]) => ({ key, count }));
    
    return {
      memorySize: this.memoryCache.size,
      hitCount: this.hitCount,
      hitRate: hitRate.toFixed(2) + '%',
      topAccessedKeys: topKeys
    };
  }

  /**
   * 设置内存缓存
   * @private
   */
  private setMemoryCache<T>(key: string, value: T, ttl: number = this.config.defaultMemoryTTL): void {
    // 如果达到最大缓存项数，则进行淘汰
    if (this.memoryCache.size >= this.config.maxMemoryItems && !this.memoryCache.has(key)) {
      this.evictLeastUsedItems();
    }
    
    this.memoryCache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }

  /**
   * 淘汰最少使用的缓存项
   * @private
   */
  private evictLeastUsedItems(): void {
    // 按访问次数排序
    const sortedKeys = [...this.memoryCache.keys()]
      .sort((a, b) => (this.accessCount[a] || 0) - (this.accessCount[b] || 0));
    
    // 淘汰前20%的项
    const evictionCount = Math.max(1, Math.floor(this.config.maxMemoryItems * 0.2));
    for (let i = 0; i < evictionCount && i < sortedKeys.length; i++) {
      this.memoryCache.delete(sortedKeys[i]);
      delete this.accessCount[sortedKeys[i]];
    }
    
    logger.debug(`已淘汰${evictionCount}个最少使用的缓存项`);
  }

  /**
   * 清理过期的内存缓存项
   * @private
   */
  private cleanupExpiredItems(): void {
    const now = Date.now();
    let expiredCount = 0;
    
    for (const [key, item] of this.memoryCache.entries()) {
      if (item.expiry <= now) {
        this.memoryCache.delete(key);
        expiredCount++;
      }
    }
    
    if (expiredCount > 0) {
      logger.debug(`已清理${expiredCount}个过期缓存项`);
    }
    
    this.lastCleanupTime = now;
  }

  /**
   * 启动定期清理
   * @private
   */
  private startPeriodicCleanup(): void {
    // 每分钟清理一次过期项
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredItems();
    }, 60000);
    
    // 确保清理任务不会阻止进程退出
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  /**
   * 停止定期清理
   */
  public stopPeriodicCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

export default CacheManager.getInstance(); 