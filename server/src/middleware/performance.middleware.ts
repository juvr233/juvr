import { Request, Response, NextFunction } from 'express';
import { MonitoringService } from '../services/monitoring.service';
import { logger } from '../config/logger';

/**
 * Middleware to track request performance metrics
 */
export const performanceMonitoring = (req: Request, res: Response, next: NextFunction): void => {
  // Skip metrics collection for certain paths
  const skipPaths = ['/metrics', '/health', '/favicon.ico'];
  if (skipPaths.includes(req.path)) {
    return next();
  }

  // Record start time
  const startTime = process.hrtime();
  
  // Get monitoring service instance
  const monitoringService = MonitoringService.getInstance();
  
  // Track original end method to intercept it
  const originalEnd = res.end;
  
  // Override end method to calculate response time when the response is sent
  res.end = function(chunk?: any, encoding?: BufferEncoding | undefined, callback?: (() => void) | undefined): Response {
    // Calculate response time in milliseconds
    const diff = process.hrtime(startTime);
    const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    
    // Record request metric
    try {
      monitoringService.recordRequest(
        req.method,
        req.route ? req.route.path : req.path,
        res.statusCode,
        parseFloat(responseTime)
      );
    } catch (error) {
      logger.error(`Error recording request metric: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Add response time header
    res.setHeader('X-Response-Time', `${responseTime}ms`);
    
    // Call original end method
    return originalEnd.call(this, chunk, encoding, callback);
  } as any;
  
  next();
};

/**
 * Middleware to track slow requests
 */
export const slowRequestTracking = (threshold: number = 1000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Record start time
    const startTime = process.hrtime();
    
    // Track original end method to intercept it
    const originalEnd = res.end;
    
    // Override end method to check response time when the response is sent
    res.end = function(chunk?: any, encoding?: BufferEncoding | undefined, callback?: (() => void) | undefined): Response {
      // Calculate response time in milliseconds
      const diff = process.hrtime(startTime);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
      
      // Log slow requests
      if (responseTime > threshold) {
        logger.warn(`Slow request detected: ${req.method} ${req.originalUrl} - ${responseTime.toFixed(2)}ms`);
        
        // Record additional details for slow requests
        const details = {
          method: req.method,
          url: req.originalUrl,
          params: req.params,
          query: req.query,
          headers: {
            ...req.headers,
            // Exclude sensitive headers
            authorization: req.headers.authorization ? '[REDACTED]' : undefined,
            cookie: req.headers.cookie ? '[REDACTED]' : undefined
          },
          responseTime,
          statusCode: res.statusCode
        };
        
        logger.debug(`Slow request details: ${JSON.stringify(details)}`);
      }
      
      // Call original end method
      return originalEnd.call(this, chunk, encoding, callback);
    } as any;
    
    next();
  };
};

/**
 * Middleware to track memory usage
 */
export const memoryUsageTracking = (req: Request, res: Response, next: NextFunction): void => {
  // Skip for certain paths
  const skipPaths = ['/metrics', '/health', '/favicon.ico'];
  if (skipPaths.includes(req.path)) {
    return next();
  }
  
  // Record memory usage before processing request
  const beforeMemory = process.memoryUsage();
  
  // Track original end method to intercept it
  const originalEnd = res.end;
  
  // Override end method to calculate memory usage when the response is sent
  res.end = function(chunk?: any, encoding?: BufferEncoding | undefined, callback?: (() => void) | undefined): Response {
    // Record memory usage after processing request
    const afterMemory = process.memoryUsage();
    
    // Calculate memory difference
    const memoryDiff = {
      rss: afterMemory.rss - beforeMemory.rss,
      heapTotal: afterMemory.heapTotal - beforeMemory.heapTotal,
      heapUsed: afterMemory.heapUsed - beforeMemory.heapUsed,
      external: afterMemory.external - beforeMemory.external
    };
    
    // Log significant memory usage
    if (memoryDiff.heapUsed > 5 * 1024 * 1024) { // Log if heap usage increased by more than 5MB
      logger.debug(`High memory usage detected: ${req.method} ${req.originalUrl} - Heap used: +${(memoryDiff.heapUsed / (1024 * 1024)).toFixed(2)}MB`);
    }
    
    // Get monitoring service instance
    const monitoringService = MonitoringService.getInstance();
    
    // Update memory usage gauge
    monitoringService.setGauge('process_memory_heap_used', afterMemory.heapUsed);
    monitoringService.setGauge('process_memory_rss', afterMemory.rss);
    
    // Call original end method
    return originalEnd.call(this, chunk, encoding, callback);
  } as any;
  
  next();
}; 