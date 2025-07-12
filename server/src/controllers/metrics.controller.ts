import { Request, Response, NextFunction } from 'express';
import { MonitoringService } from '../services/monitoring.service';
import { logger } from '../config/logger';
import os from 'os';

/**
 * Get metrics in Prometheus format
 */
export const getPrometheusMetrics = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const monitoringService = MonitoringService.getInstance();
    const metrics = monitoringService.getPrometheusMetrics();
    
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(metrics);
  } catch (error) {
    logger.error(`Error getting Prometheus metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(error);
  }
};

/**
 * Get application health metrics
 */
export const getHealthMetrics = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const monitoringService = MonitoringService.getInstance();
    const metrics = monitoringService.getHealthMetrics();
    
    // Add additional system information
    const systemInfo = {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      nodeVersion: process.version,
      processId: process.pid,
      uptime: process.uptime()
    };
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      ...metrics,
      system: systemInfo
    });
  } catch (error) {
    logger.error(`Error getting health metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(error);
  }
};

/**
 * Get request metrics
 */
export const getRequestMetrics = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const monitoringService = MonitoringService.getInstance();
    
    // Parse query parameters
    const startTime = req.query.startTime ? parseInt(req.query.startTime as string) : undefined;
    const endTime = req.query.endTime ? parseInt(req.query.endTime as string) : undefined;
    
    // Get request metrics
    const metrics = monitoringService.getRequestMetrics(startTime, endTime);
    
    // Calculate summary statistics
    const totalRequests = metrics.length;
    const statusCodes = metrics.reduce((acc, m) => {
      const statusGroup = Math.floor(m.statusCode / 100) * 100;
      acc[statusGroup] = (acc[statusGroup] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const avgResponseTime = metrics.reduce((acc, m) => acc + m.responseTime, 0) / (totalRequests || 1);
    
    // Find slow requests (> 1000ms)
    const slowRequests = metrics.filter(m => m.responseTime > 1000);
    
    // Group by path
    const pathStats = metrics.reduce((acc, m) => {
      if (!acc[m.path]) {
        acc[m.path] = {
          count: 0,
          totalResponseTime: 0,
          methods: {}
        };
      }
      
      acc[m.path].count++;
      acc[m.path].totalResponseTime += m.responseTime;
      
      if (!acc[m.path].methods[m.method]) {
        acc[m.path].methods[m.method] = 0;
      }
      
      acc[m.path].methods[m.method]++;
      
      return acc;
    }, {} as Record<string, { count: number, totalResponseTime: number, methods: Record<string, number> }>);
    
    // Calculate average response time per path
    Object.keys(pathStats).forEach(path => {
      (pathStats[path] as any).avgResponseTime = pathStats[path].totalResponseTime / pathStats[path].count;
    });
    
    // Prepare response
    const summary = {
      totalRequests,
      statusCodes,
      avgResponseTime,
      slowRequestsCount: slowRequests.length,
      topPaths: Object.entries(pathStats)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10)
        .map(([path, stats]) => ({
          path,
          count: stats.count,
          avgResponseTime: stats.totalResponseTime / stats.count,
          methods: stats.methods
        }))
    };
    
    res.status(200).json({
      summary,
      metrics: req.query.full === 'true' ? metrics : metrics.slice(0, 100) // Limit response size by default
    });
  } catch (error) {
    logger.error(`Error getting request metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(error);
  }
};

/**
 * Get resource usage metrics
 */
export const getResourceMetrics = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const monitoringService = MonitoringService.getInstance();
    
    // Parse query parameters
    const startTime = req.query.startTime ? parseInt(req.query.startTime as string) : undefined;
    const endTime = req.query.endTime ? parseInt(req.query.endTime as string) : undefined;
    
    // Get resource metrics
    const metrics = monitoringService.getResourceMetrics(startTime, endTime);
    
    // Calculate summary statistics if metrics are available
    let summary = {};
    
    if (metrics.length > 0) {
      const avgCpuUsage = metrics.reduce((acc, m) => acc + m.cpuUsage, 0) / metrics.length;
      const avgMemUsagePercent = metrics.reduce((acc, m) => acc + m.memoryUsagePercent, 0) / metrics.length;
      const maxMemUsagePercent = Math.max(...metrics.map(m => m.memoryUsagePercent));
      const maxHeapUsed = Math.max(...metrics.map(m => m.memoryUsage.heapUsed));
      
      summary = {
        avgCpuUsage,
        avgMemUsagePercent,
        maxMemUsagePercent,
        maxHeapUsed,
        currentMemoryUsage: process.memoryUsage(),
        currentMemoryUsagePercent: (1 - (os.freemem() / os.totalmem())) * 100,
        totalSamples: metrics.length
      };
    }
    
    res.status(200).json({
      summary,
      metrics: req.query.full === 'true' ? metrics : metrics.slice(-60) // Return last hour by default (assuming 1-minute intervals)
    });
  } catch (error) {
    logger.error(`Error getting resource metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(error);
  }
}; 