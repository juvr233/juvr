import { Request, Response, NextFunction } from 'express';
import os from 'os';
import { logger, systemMetric } from '../config/logger';
import { isDbConnected } from '../config/database';
import mongoose from 'mongoose';
import { performance } from 'perf_hooks';
import axios from 'axios';

// 系统启动时间
const startTime = Date.now();

// 性能监控中间件
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  // 记录请求开始时间
  const start = performance.now();
  
  // 保存原始的响应结束方法
  const originalEnd = res.end;
  
  // 重写响应结束方法
  res.end = function(chunk?: any, encoding?: any, callback?: any) {
    // 计算响应时间
    const responseTime = performance.now() - start;
    
    // 记录API请求指标
    logger.apiRequest(
      req.method,
      req.originalUrl,
      res.statusCode,
      responseTime,
      (req as any).requestId
    );
    
    // 记录性能指标
    if (responseTime > 1000) { // 如果响应时间超过1秒，记录为警告
      logger.warn(`慢请求: ${req.method} ${req.originalUrl} - ${responseTime.toFixed(2)}ms`, {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime,
        requestId: (req as any).requestId
      });
    }
    
    // 调用原始的结束方法
    return originalEnd.call(this, chunk, encoding, callback);
  };
  
  next();
};

// 基本健康检查
export const healthCheck = async (req: Request, res: Response) => {
  try {
    // 检查数据库连接
    const dbStatus = isDbConnected();
    
    // 基本健康状态
    const healthStatus = {
      status: dbStatus ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - startTime) / 1000), // 以秒为单位
      database: {
        connected: dbStatus,
        status: dbStatus ? 'healthy' : 'unhealthy'
      }
    };
    
    // 设置适当的状态码
    const statusCode = dbStatus ? 200 : 503;
    
    // 记录健康检查结果
    if (!dbStatus) {
      logger.warn('健康检查失败: 数据库连接问题', healthStatus);
    }
    
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    logger.error(`健康检查失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
};

// 详细的系统状态检查
export const systemStatus = async (req: Request, res: Response) => {
  try {
    // 获取数据库状态
    const dbStatus = isDbConnected();
    let dbStats = null;
    let collections = [];
    
    if (dbStatus) {
      try {
        // 获取数据库统计信息
        dbStats = await mongoose.connection.db.stats();
        
        // 获取集合列表
        collections = await mongoose.connection.db.listCollections().toArray();
      } catch (dbError) {
        logger.error(`获取数据库统计信息失败: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
      }
    }
    
    // 检查外部服务
    const externalServices = await checkExternalServices();
    
    // 收集系统资源信息
    const systemInfo = {
      cpu: {
        cores: os.cpus().length,
        model: os.cpus()[0].model,
        loadAvg: os.loadavg(),
        utilization: process.cpuUsage()
      },
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem(),
        processUsage: process.memoryUsage()
      },
      os: {
        platform: os.platform(),
        release: os.release(),
        uptime: os.uptime()
      },
      process: {
        uptime: process.uptime(),
        pid: process.pid,
        nodeVersion: process.version
      }
    };
    
    // 记录系统指标
    systemMetric('memory_usage', systemInfo.memory.used / systemInfo.memory.total);
    systemMetric('cpu_load', os.loadavg()[0]);
    
    // 构建完整的系统状态
    const status = {
      status: dbStatus && externalServices.every(s => s.status === 'ok') ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - startTime) / 1000),
      database: {
        connected: dbStatus,
        status: dbStatus ? 'healthy' : 'unhealthy',
        stats: dbStats,
        collections: collections.map(c => c.name)
      },
      externalServices,
      system: systemInfo
    };
    
    // 设置适当的状态码
    const statusCode = status.status === 'ok' ? 200 : 207;
    
    res.status(statusCode).json(status);
  } catch (error) {
    logger.error(`系统状态检查失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'System status check failed'
    });
  }
};

// 检查外部服务
async function checkExternalServices(): Promise<Array<{name: string, status: string, responseTime?: number}>> {
  const services = [
    { name: 'AI API', url: process.env.AI_API_BASE_URL || 'https://ai.novcase.com/gemini/v1beta' }
  ];
  
  const results = [];
  
  for (const service of services) {
    try {
      const start = performance.now();
      await axios.get(`${service.url}`, { timeout: 5000 });
      const responseTime = performance.now() - start;
      
      results.push({
        name: service.name,
        status: 'ok',
        responseTime
      });
    } catch (error) {
      logger.error(`外部服务检查失败 - ${service.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      results.push({
        name: service.name,
        status: 'error'
      });
    }
  }
  
  return results;
}

// 深度健康检查（包括数据库查询测试）
export const deepHealthCheck = async (req: Request, res: Response) => {
  try {
    // 检查数据库连接
    const dbStatus = isDbConnected();
    
    // 如果数据库已连接，执行简单查询以验证读取能力
    let dbQueryStatus = false;
    if (dbStatus) {
      try {
        // 执行简单的ping命令
        await mongoose.connection.db.command({ ping: 1 });
        dbQueryStatus = true;
      } catch (dbError) {
        logger.error(`数据库查询测试失败: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
      }
    }
    
    // 检查文件系统访问
    let fsStatus = false;
    try {
      const fs = require('fs');
      const testFile = './tmp-health-check.txt';
      fs.writeFileSync(testFile, 'health check');
      fs.unlinkSync(testFile);
      fsStatus = true;
    } catch (fsError) {
      logger.error(`文件系统访问测试失败: ${fsError instanceof Error ? fsError.message : 'Unknown error'}`);
    }
    
    // 检查内存使用情况
    const memoryUsage = process.memoryUsage();
    const memoryThreshold = 1024 * 1024 * 1024; // 1GB
    const memoryStatus = memoryUsage.rss < memoryThreshold;
    
    // 综合健康状态
    const healthStatus = {
      status: dbStatus && dbQueryStatus && fsStatus && memoryStatus ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - startTime) / 1000),
      checks: {
        database: {
          connected: dbStatus,
          querySuccessful: dbQueryStatus,
          status: dbStatus && dbQueryStatus ? 'healthy' : 'unhealthy'
        },
        fileSystem: {
          status: fsStatus ? 'healthy' : 'unhealthy'
        },
        memory: {
          used: memoryUsage.rss,
          threshold: memoryThreshold,
          status: memoryStatus ? 'healthy' : 'warning'
        }
      }
    };
    
    // 设置适当的状态码
    const statusCode = healthStatus.status === 'ok' ? 200 : 207;
    
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    logger.error(`深度健康检查失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Deep health check failed'
    });
  }
}; 