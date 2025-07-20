/**
 * Performance configuration for the application
 */

export const PERFORMANCE_CONFIG = {
  // Image preloading settings
  imagePreloading: {
    PRELOAD_BATCH_SIZE: 5,
    PRELOAD_DELAY: 100, // milliseconds between batches
    LAZY_LOAD_THRESHOLD: 100, // pixels before element enters viewport
    MAX_CONCURRENT_LOADS: 10
  },
  
  // Animation settings
  animations: {
    REDUCED_MOTION_QUERY: '(prefers-reduced-motion: reduce)',
    DEFAULT_DURATION: 300, // milliseconds
    LONG_DURATION: 500,
    SHORT_DURATION: 150
  },
  
  // Performance monitoring
  monitoring: {
    FPS_THRESHOLD: 30, // Consider performance low if FPS drops below this
    MEMORY_THRESHOLD: 100 * 1024 * 1024, // 100MB in bytes
    LOAD_TIME_THRESHOLD: 3000 // 3 seconds
  },
  
  // Caching
  cache: {
    IMAGE_CACHE_SIZE: 50, // Number of images to keep in memory
    API_CACHE_TTL: 5 * 60 * 1000, // 5 minutes
    STATIC_CACHE_TTL: 24 * 60 * 60 * 1000 // 24 hours
  }
} as const;

/**
 * Device performance detection utilities
 */
export class PerformanceDetector {
  private static instance: PerformanceDetector;
  private performanceScore: number = 0;
  private isLowPerformance: boolean = false;
  private memoryInfo: any = null;

  static getInstance(): PerformanceDetector {
    if (!PerformanceDetector.instance) {
      PerformanceDetector.instance = new PerformanceDetector();
    }
    return PerformanceDetector.instance;
  }

  constructor() {
    this.detectPerformance();
  }

  private detectPerformance(): void {
    let score = 100;

    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 1;
    if (cores < 4) score -= 20;
    if (cores < 2) score -= 30;

    // Check memory (if available)
    if ('memory' in performance) {
      this.memoryInfo = (performance as any).memory;
      const memoryRatio = this.memoryInfo.usedJSHeapSize / this.memoryInfo.jsHeapSizeLimit;
      if (memoryRatio > 0.8) score -= 25;
      if (memoryRatio > 0.9) score -= 40;
    }

    // Check connection speed (if available)
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection.effectiveType === '2g') score -= 40;
      if (connection.effectiveType === '3g') score -= 20;
      if (connection.saveData) score -= 15;
    }

    // Check user agent for mobile devices
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) score -= 15;

    this.performanceScore = Math.max(0, score);
    this.isLowPerformance = this.performanceScore < 60;
  }

  getPerformanceScore(): number {
    return this.performanceScore;
  }

  isLowPerformanceDevice(): boolean {
    return this.isLowPerformance;
  }

  getMemoryInfo(): any {
    return this.memoryInfo;
  }

  getCurrentMemoryUsage(): number {
    if (this.memoryInfo) {
      return this.memoryInfo.usedJSHeapSize;
    }
    return 0;
  }

  shouldUseReducedAnimations(): boolean {
    // Check user preference first
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true;
    }
    
    // Use device performance as fallback
    return this.isLowPerformance;
  }

  getOptimalBatchSize(): number {
    if (this.isLowPerformance) {
      return Math.max(2, Math.floor(PERFORMANCE_CONFIG.imagePreloading.PRELOAD_BATCH_SIZE / 2));
    }
    return PERFORMANCE_CONFIG.imagePreloading.PRELOAD_BATCH_SIZE;
  }

  getOptimalDelay(): number {
    if (this.isLowPerformance) {
      return PERFORMANCE_CONFIG.imagePreloading.PRELOAD_DELAY * 2;
    }
    return PERFORMANCE_CONFIG.imagePreloading.PRELOAD_DELAY;
  }
}