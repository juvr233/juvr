import { useState, useEffect } from 'react';
import { PerformanceDetector } from '../config/performance';

interface PerformanceState {
  isLowPerformance: boolean;
  performanceScore: number;
  fps: number;
  memoryUsage: number;
  shouldReduceAnimations: boolean;
}

export const usePerformanceDetector = (): PerformanceState => {
  const [state, setState] = useState<PerformanceState>({
    isLowPerformance: false,
    performanceScore: 100,
    fps: 60,
    memoryUsage: 0,
    shouldReduceAnimations: false
  });

  useEffect(() => {
    const detector = PerformanceDetector.getInstance();
    
    // Initial performance detection
    setState({
      isLowPerformance: detector.isLowPerformanceDevice(),
      performanceScore: detector.getPerformanceScore(),
      fps: 60, // Will be updated by FPS monitoring
      memoryUsage: detector.getCurrentMemoryUsage(),
      shouldReduceAnimations: detector.shouldUseReducedAnimations()
    });

    // FPS monitoring
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        setState(prev => ({
          ...prev,
          fps,
          memoryUsage: detector.getCurrentMemoryUsage(),
          // Update shouldReduceAnimations based on current FPS
          shouldReduceAnimations: fps < 30 || detector.shouldUseReducedAnimations()
        }));
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    // Start FPS monitoring
    animationId = requestAnimationFrame(measureFPS);

    // Listen for reduced motion preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      setState(prev => ({
        ...prev,
        shouldReduceAnimations: mediaQuery.matches || prev.fps < 30
      }));
    };

    mediaQuery.addListener(handleChange);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      mediaQuery.removeListener(handleChange);
    };
  }, []);

  return state;
};