import { EventEmitter } from 'events';
import { logger } from '../config/logger';

/**
 * 请求优先级枚举
 */
export enum RequestPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3
}

/**
 * 队列请求接口
 */
interface QueuedRequest {
  id: string;
  priority: RequestPriority;
  timestamp: number;
  execute: () => Promise<any>;
  timeout?: NodeJS.Timeout;
}

/**
 * 请求队列配置
 */
interface RequestQueueConfig {
  maxConcurrent: number;       // 最大并发请求数
  maxQueueSize: number;        // 最大队列大小
  defaultTimeout: number;      // 默认请求超时（毫秒）
  lowPriorityDelay: number;    // 低优先级请求延迟（毫秒）
  highPriorityBoost: number;   // 高优先级请求提升系数
}

/**
 * 请求队列服务
 * 用于管理高负载场景下的请求排队和优先级处理
 */
export class RequestQueueService extends EventEmitter {
  private static instance: RequestQueueService;
  private queue: QueuedRequest[] = [];
  private processing: Set<string> = new Set();
  private config: RequestQueueConfig;
  private isProcessing: boolean = false;
  private stats = {
    totalProcessed: 0,
    totalRejected: 0,
    totalTimeout: 0,
    byPriority: {
      [RequestPriority.LOW]: 0,
      [RequestPriority.NORMAL]: 0,
      [RequestPriority.HIGH]: 0,
      [RequestPriority.CRITICAL]: 0
    },
    averageWaitTime: 0,
    totalWaitTime: 0
  };

  /**
   * 私有构造函数，确保单例模式
   */
  private constructor(config?: Partial<RequestQueueConfig>) {
    super();
    this.config = {
      maxConcurrent: 10,       // 默认最多10个并发请求
      maxQueueSize: 100,       // 默认最多100个排队请求
      defaultTimeout: 30000,   // 默认30秒超时
      lowPriorityDelay: 5000,  // 低优先级请求延迟5秒
      highPriorityBoost: 1.5,  // 高优先级请求提升1.5倍
      ...config
    };
    
    logger.info('请求队列服务初始化完成');
  }

  /**
   * 获取请求队列服务实例
   */
  public static getInstance(config?: Partial<RequestQueueConfig>): RequestQueueService {
    if (!RequestQueueService.instance) {
      RequestQueueService.instance = new RequestQueueService(config);
    }
    return RequestQueueService.instance;
  }

  /**
   * 添加请求到队列
   * @param execute 执行函数
   * @param priority 请求优先级
   * @param timeout 超时时间（毫秒）
   * @returns Promise，解析为请求结果
   */
  public enqueue<T>(
    execute: () => Promise<T>,
    priority: RequestPriority = RequestPriority.NORMAL,
    timeout: number = this.config.defaultTimeout
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // 生成唯一请求ID
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 检查队列是否已满
      if (this.queue.length >= this.config.maxQueueSize && priority < RequestPriority.HIGH) {
        this.stats.totalRejected++;
        reject(new Error('请求队列已满，请稍后再试'));
        return;
      }
      
      // 创建包装执行函数
      const wrappedExecute = async () => {
        try {
          const result = await execute();
          resolve(result);
          return result;
        } catch (error) {
          reject(error);
          throw error;
        } finally {
          this.processing.delete(requestId);
          this.processNextRequest();
        }
      };
      
      // 创建队列请求
      const queuedRequest: QueuedRequest = {
        id: requestId,
        priority,
        timestamp: Date.now(),
        execute: wrappedExecute
      };
      
      // 设置超时处理
      if (timeout > 0) {
        queuedRequest.timeout = setTimeout(() => {
          // 从队列中移除请求
          const index = this.queue.findIndex(req => req.id === requestId);
          if (index !== -1) {
            this.queue.splice(index, 1);
            this.stats.totalTimeout++;
            reject(new Error('请求超时'));
          }
        }, timeout);
      }
      
      // 添加到队列
      this.queue.push(queuedRequest);
      
      // 更新统计信息
      this.stats.byPriority[priority]++;
      
      // 根据优先级对队列进行排序
      this.sortQueue();
      
      // 尝试处理下一个请求
      this.processNextRequest();
    });
  }

  /**
   * 处理下一个请求
   * @private
   */
  private processNextRequest(): void {
    // 如果已经在处理中，直接返回
    if (this.isProcessing) {
      return;
    }
    
    this.isProcessing = true;
    
    // 异步处理请求队列
    setImmediate(async () => {
      try {
        // 检查是否有空闲槽位
        while (this.processing.size < this.config.maxConcurrent && this.queue.length > 0) {
          // 获取下一个请求
          const request = this.queue.shift();
          
          if (!request) {
            continue;
          }
          
          // 清除超时定时器
          if (request.timeout) {
            clearTimeout(request.timeout);
          }
          
          // 计算等待时间
          const waitTime = Date.now() - request.timestamp;
          this.stats.totalWaitTime += waitTime;
          this.stats.averageWaitTime = this.stats.totalWaitTime / ++this.stats.totalProcessed;
          
          // 添加到处理集合
          this.processing.add(request.id);
          
          // 执行请求
          request.execute().catch(error => {
            logger.error(`请求执行错误: ${error instanceof Error ? error.message : 'Unknown error'}`);
          });
        }
      } catch (error) {
        logger.error(`处理队列请求错误: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        this.isProcessing = false;
        
        // 如果队列不为空且有空闲槽位，继续处理
        if (this.queue.length > 0 && this.processing.size < this.config.maxConcurrent) {
          this.processNextRequest();
        }
      }
    });
  }

  /**
   * 根据优先级对队列进行排序
   * @private
   */
  private sortQueue(): void {
    this.queue.sort((a, b) => {
      // 首先按优先级排序
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      
      // 对于高优先级请求，更偏向新请求
      if (a.priority >= RequestPriority.HIGH) {
        return b.timestamp - a.timestamp;
      }
      
      // 对于普通和低优先级请求，更偏向旧请求（先进先出）
      return a.timestamp - b.timestamp;
    });
  }

  /**
   * 获取队列状态
   */
  public getStatus(): any {
    return {
      queueLength: this.queue.length,
      processing: this.processing.size,
      maxConcurrent: this.config.maxConcurrent,
      stats: { ...this.stats }
    };
  }

  /**
   * 调整队列配置
   * @param newConfig 新配置
   */
  public updateConfig(newConfig: Partial<RequestQueueConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig
    };
    
    logger.info(`请求队列配置已更新: ${JSON.stringify(newConfig)}`);
  }

  /**
   * 清空队列
   */
  public clearQueue(): void {
    // 清除所有超时定时器
    for (const request of this.queue) {
      if (request.timeout) {
        clearTimeout(request.timeout);
      }
    }
    
    // 清空队列
    const rejectedCount = this.queue.length;
    this.queue = [];
    
    // 更新统计信息
    this.stats.totalRejected += rejectedCount;
    
    logger.info(`已清空请求队列，拒绝了${rejectedCount}个请求`);
  }

  /**
   * 重置统计信息
   */
  public resetStats(): void {
    this.stats = {
      totalProcessed: 0,
      totalRejected: 0,
      totalTimeout: 0,
      byPriority: {
        [RequestPriority.LOW]: 0,
        [RequestPriority.NORMAL]: 0,
        [RequestPriority.HIGH]: 0,
        [RequestPriority.CRITICAL]: 0
      },
      averageWaitTime: 0,
      totalWaitTime: 0
    };
    
    logger.info('请求队列统计信息已重置');
  }
}

export default RequestQueueService.getInstance(); 