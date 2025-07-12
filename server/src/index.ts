import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import { ensureDbConnected, closeDbConnection } from './config/database';
import env from './config/env';
import logger from './config/logger';
import passport from './config/passport';
import requestIdMiddleware from './middleware/request-id.middleware';
import { rateLimiter } from './middleware/validation.middleware';
import { performanceMonitor, healthCheck, systemStatus, deepHealthCheck } from './middleware/health.middleware';
import { securityMiddleware } from './middleware/security.middleware';
import { notFound, errorHandler, setupUncaughtExceptionHandler, requestTimeout } from './middleware/error.middleware';
import { performanceMonitoring, slowRequestTracking, memoryUsageTracking } from './middleware/performance.middleware';
import { requestQueueMiddleware } from './middleware/requestQueue.middleware';
import routes from './routes';
import cacheManager from './services/cacheManager.service';
import requestQueue from './services/requestQueue.service';

// 设置未捕获异常处理
setupUncaughtExceptionHandler();

// 应用实例
const app = express();

// 启动服务器
async function startServer() {
  try {
    // 确保数据库连接
    await ensureDbConnected();
    
    // 基本中间件
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(cookieParser());
    app.use(compression()); // 添加压缩支持
    
    // 请求ID中间件 - 在所有其他中间件之前
    app.use(requestIdMiddleware);
    
    // 安全中间件
    app.use(helmet()); // 添加Helmet安全头
    app.use(securityMiddleware);
    
    // CORS配置
    const corsOptions = {
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-API-Key', 'X-Request-ID'],
      exposedHeaders: ['X-Total-Count', 'X-Rate-Limit', 'X-Request-ID', 'X-Cache']
    };
    app.use(cors(corsOptions));
    
    // 请求超时设置
    app.use(requestTimeout(60000)); // 60秒超时
    
    // 速率限制 - 全局
    app.use(rateLimiter(15 * 60 * 1000, 100)); // 15分钟内最多100个请求
    
    // 请求队列中间件 - 仅在高负载时启用
    app.use(requestQueueMiddleware);
    
    // 性能监控中间件
    app.use(performanceMonitoring);
    app.use(slowRequestTracking(1000)); // 跟踪超过1000ms的请求
    app.use(memoryUsageTracking);
    
    // 健康检查和系统状态 - 不需要认证
    app.get('/health', healthCheck);
    app.get('/health/deep', deepHealthCheck);
    app.get('/status', systemStatus);
    
    // 添加缓存和队列状态端点
    app.get('/system/cache-stats', (req, res) => {
      res.json(cacheManager.getStats());
    });
    
    app.get('/system/queue-stats', (req, res) => {
      res.json(requestQueue.getStatus());
    });
    
    // Passport中间件
    app.use(passport.initialize());
    
    // 性能监控
    app.use(performanceMonitor);
    
    // API路由
    app.use('/api', routes);
    
    // 404错误处理
    app.use(notFound);
    
    // 全局错误处理
    app.use(errorHandler);
    
    // 启动服务器
    const PORT = env.PORT;
    app.listen(PORT, () => {
      logger.info(`服务器已启动，监听端口 ${PORT}`);
    });
    
    // 优雅关闭处理
    setupGracefulShutdown(app);
    
  } catch (error) {
    logger.error(`服务器启动失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

/**
 * 设置优雅关闭处理
 */
function setupGracefulShutdown(app: express.Application) {
  // 监听进程终止信号
  ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
    process.on(signal, async () => {
      logger.info(`收到${signal}信号，正在优雅关闭...`);
      
      // 停止接受新请求
      if (app.listening) {
        app._router.stack.forEach((layer: any) => {
          if (layer.route) {
            layer.route.stack.forEach((handler: any) => {
              handler.handle = (req: Request, res: Response) => {
                res.status(503).json({ message: '服务正在关闭' });
              };
            });
          }
        });
      }
      
      // 清空请求队列
      requestQueue.clearQueue();
      
      // 等待活跃请求完成（最多等待30秒）
      const maxWait = 30000;
      const startTime = Date.now();
      const queueStatus = requestQueue.getStatus();
      
      if (queueStatus.processing > 0) {
        logger.info(`等待${queueStatus.processing}个活跃请求完成...`);
        
        while (requestQueue.getStatus().processing > 0) {
          if (Date.now() - startTime > maxWait) {
            logger.warn('等待活跃请求超时，强制关闭');
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      // 关闭数据库连接
      await closeDbConnection();
      
      // 停止缓存管理器清理任务
      cacheManager.stopPeriodicCleanup();
      
      logger.info('服务器已优雅关闭');
      process.exit(0);
    });
  });
}

// 启动服务器
startServer();
