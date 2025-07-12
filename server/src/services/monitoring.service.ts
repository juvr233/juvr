import { logger } from '../config/logger';
import os from 'os';
import { EventEmitter } from 'events';

/**
 * MetricType defines the types of metrics that can be collected
 */
export enum MetricType {
  COUNTER = 'counter',
  GAUGE = 'gauge',
  HISTOGRAM = 'histogram',
  SUMMARY = 'summary'
}

/**
 * Metric interface defines the structure of a metric
 */
interface Metric {
  name: string;
  type: MetricType;
  value: number;
  labels?: Record<string, string>;
  timestamp: number;
}

/**
 * ResourceUsage interface defines the structure of resource usage metrics
 */
interface ResourceUsage {
  cpuUsage: number;
  memoryUsage: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  freeMem: number;
  totalMem: number;
  memoryUsagePercent: number;
  uptime: number;
}

/**
 * RequestMetric interface defines the structure of request metrics
 */
interface RequestMetric {
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  timestamp: number;
}

/**
 * MonitoringService provides methods to monitor application performance
 */
export class MonitoringService extends EventEmitter {
  private static instance: MonitoringService;
  private metrics: Map<string, Metric> = new Map();
  private requestMetrics: RequestMetric[] = [];
  private resourceMetrics: ResourceUsage[] = [];
  private isCollectingResourceMetrics: boolean = false;
  private resourceMetricsInterval: NodeJS.Timeout | null = null;
  private metricsRetentionPeriod: number = 24 * 60 * 60 * 1000; // 24 hours in ms
  private maxRequestMetrics: number = 10000; // Maximum number of request metrics to store

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {
    super();
    this.startResourceMetricsCollection();
    this.startPeriodicCleanup();
  }

  /**
   * Get the singleton instance of MonitoringService
   */
  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  /**
   * Start collecting resource metrics
   */
  public startResourceMetricsCollection(intervalMs: number = 60000): void {
    if (this.isCollectingResourceMetrics) {
      return;
    }

    this.isCollectingResourceMetrics = true;
    this.resourceMetricsInterval = setInterval(() => {
      this.collectResourceMetrics();
    }, intervalMs);

    // Ensure the interval doesn't prevent the process from exiting
    if (this.resourceMetricsInterval.unref) {
      this.resourceMetricsInterval.unref();
    }

    logger.info('Resource metrics collection started');
  }

  /**
   * Stop collecting resource metrics
   */
  public stopResourceMetricsCollection(): void {
    if (this.resourceMetricsInterval) {
      clearInterval(this.resourceMetricsInterval);
      this.resourceMetricsInterval = null;
    }
    this.isCollectingResourceMetrics = false;
    logger.info('Resource metrics collection stopped');
  }

  /**
   * Collect resource metrics
   */
  private collectResourceMetrics(): void {
    try {
      const memUsage = process.memoryUsage();
      const freeMem = os.freemem();
      const totalMem = os.totalmem();
      
      // Calculate CPU usage (this is approximate)
      const cpus = os.cpus();
      const cpuUsage = cpus.reduce((acc, cpu) => {
        const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
        const idle = cpu.times.idle;
        return acc + ((total - idle) / total);
      }, 0) / cpus.length;

      const metrics: ResourceUsage = {
        cpuUsage,
        memoryUsage: {
          rss: memUsage.rss,
          heapTotal: memUsage.heapTotal,
          heapUsed: memUsage.heapUsed,
          external: memUsage.external
        },
        freeMem,
        totalMem,
        memoryUsagePercent: (1 - (freeMem / totalMem)) * 100,
        uptime: process.uptime()
      };

      this.resourceMetrics.push(metrics);
      
      // Trim resource metrics if they get too large
      if (this.resourceMetrics.length > 1440) { // Store max 24 hours of metrics at 1-minute intervals
        this.resourceMetrics.shift();
      }

      // Emit event for real-time monitoring
      this.emit('resourceMetrics', metrics);

      // Update gauge metrics
      this.setGauge('system_memory_usage_percent', metrics.memoryUsagePercent);
      this.setGauge('system_cpu_usage_percent', cpuUsage * 100);
      this.setGauge('process_memory_heap_used', memUsage.heapUsed);
      this.setGauge('process_memory_rss', memUsage.rss);
    } catch (error) {
      logger.error(`Error collecting resource metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Record a request metric
   */
  public recordRequest(method: string, path: string, statusCode: number, responseTime: number): void {
    const metric: RequestMetric = {
      method,
      path,
      statusCode,
      responseTime,
      timestamp: Date.now()
    };

    this.requestMetrics.push(metric);
    
    // Limit the size of requestMetrics array
    if (this.requestMetrics.length > this.maxRequestMetrics) {
      this.requestMetrics.shift();
    }

    // Update metrics
    this.incrementCounter(`http_requests_total{method="${method}",path="${path}",status="${statusCode}"}`);
    this.observeHistogram(`http_request_duration_ms{method="${method}",path="${path}"}`, responseTime);
    
    // Emit event for real-time monitoring
    this.emit('requestMetric', metric);
  }

  /**
   * Increment a counter metric
   */
  public incrementCounter(name: string, value: number = 1, labels?: Record<string, string>): void {
    const metric = this.getOrCreateMetric(name, MetricType.COUNTER, labels);
    metric.value += value;
    this.metrics.set(name, metric);
  }

  /**
   * Set a gauge metric
   */
  public setGauge(name: string, value: number, labels?: Record<string, string>): void {
    const metric = this.getOrCreateMetric(name, MetricType.GAUGE, labels);
    metric.value = value;
    this.metrics.set(name, metric);
  }

  /**
   * Observe a histogram metric
   */
  public observeHistogram(name: string, value: number, labels?: Record<string, string>): void {
    const metric = this.getOrCreateMetric(name, MetricType.HISTOGRAM, labels);
    // In a real implementation, we would store the value in a histogram data structure
    // For simplicity, we just update the value here
    metric.value = value;
    this.metrics.set(name, metric);
  }

  /**
   * Get or create a metric
   */
  private getOrCreateMetric(name: string, type: MetricType, labels?: Record<string, string>): Metric {
    if (this.metrics.has(name)) {
      return this.metrics.get(name)!;
    }

    const newMetric: Metric = {
      name,
      type,
      value: 0,
      labels,
      timestamp: Date.now()
    };

    this.metrics.set(name, newMetric);
    return newMetric;
  }

  /**
   * Get all metrics
   */
  public getMetrics(): Metric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Get request metrics within a time range
   */
  public getRequestMetrics(startTime?: number, endTime?: number): RequestMetric[] {
    if (!startTime && !endTime) {
      return this.requestMetrics;
    }

    const now = Date.now();
    const start = startTime || now - 24 * 60 * 60 * 1000; // Default to last 24 hours
    const end = endTime || now;

    return this.requestMetrics.filter(metric => 
      metric.timestamp >= start && metric.timestamp <= end
    );
  }

  /**
   * Get resource metrics within a time range
   */
  public getResourceMetrics(startTime?: number, endTime?: number): ResourceUsage[] {
    if (!startTime && !endTime) {
      return this.resourceMetrics;
    }

    const now = Date.now();
    const start = startTime || now - 24 * 60 * 60 * 1000; // Default to last 24 hours
    const end = endTime || now;

    // For resource metrics, we need to calculate the index based on the collection interval
    const startIndex = Math.floor((start - (now - this.resourceMetrics.length * 60000)) / 60000);
    const endIndex = Math.floor((end - (now - this.resourceMetrics.length * 60000)) / 60000);

    return this.resourceMetrics.slice(
      Math.max(0, startIndex),
      Math.min(this.resourceMetrics.length, endIndex + 1)
    );
  }

  /**
   * Get metrics in Prometheus format
   */
  public getPrometheusMetrics(): string {
    const lines: string[] = [];

    for (const metric of this.metrics.values()) {
      const labels = metric.labels 
        ? `{${Object.entries(metric.labels).map(([k, v]) => `${k}="${v}"`).join(',')}}` 
        : '';
      
      // Add metric type as HELP comment
      lines.push(`# HELP ${metric.name} ${metric.type}`);
      lines.push(`# TYPE ${metric.name} ${metric.type}`);
      lines.push(`${metric.name}${labels} ${metric.value}`);
    }

    return lines.join('\n');
  }

  /**
   * Start periodic cleanup of old metrics
   */
  private startPeriodicCleanup(): void {
    setInterval(() => {
      this.cleanupOldMetrics();
    }, 3600000); // Run every hour
  }

  /**
   * Cleanup old metrics
   */
  private cleanupOldMetrics(): void {
    const cutoffTime = Date.now() - this.metricsRetentionPeriod;
    
    // Clean up request metrics
    this.requestMetrics = this.requestMetrics.filter(metric => 
      metric.timestamp >= cutoffTime
    );

    // Log cleanup
    logger.debug(`Cleaned up metrics older than ${new Date(cutoffTime).toISOString()}`);
  }

  /**
   * Get current health metrics
   */
  public getHealthMetrics(): any {
    const memUsage = process.memoryUsage();
    
    return {
      uptime: process.uptime(),
      memory: {
        rss: memUsage.rss,
        heapTotal: memUsage.heapTotal,
        heapUsed: memUsage.heapUsed,
        external: memUsage.external,
        usagePercent: (1 - (os.freemem() / os.totalmem())) * 100
      },
      cpu: {
        cores: os.cpus().length,
        model: os.cpus()[0].model,
        speed: os.cpus()[0].speed
      },
      loadAverage: os.loadavg(),
      requestCount: this.requestMetrics.length,
      lastMinuteRequests: this.requestMetrics.filter(
        m => m.timestamp > Date.now() - 60000
      ).length
    };
  }
} 