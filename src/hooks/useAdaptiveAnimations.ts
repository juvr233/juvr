import { useMemo } from 'react';
import { usePerformanceDetector } from './usePerformanceDetector';
import { PERFORMANCE_CONFIG } from '../config/performance';

interface AnimationConfig {
  duration: number;
  easing: string;
  transform: boolean;
  opacity: boolean;
  blur: boolean;
  scale: boolean;
}

interface AdaptiveAnimationReturn {
  animationConfig: AnimationConfig;
  shouldAnimate: boolean;
  getAnimationClass: (animationType: 'fade' | 'slide' | 'scale' | 'complex') => string;
}

export const useAdaptiveAnimations = (): AdaptiveAnimationReturn => {
  const { shouldReduceAnimations, fps, isLowPerformance } = usePerformanceDetector();

  const animationConfig = useMemo((): AnimationConfig => {
    if (shouldReduceAnimations || isLowPerformance) {
      // Reduced animations for low performance or user preference
      return {
        duration: PERFORMANCE_CONFIG.animations.SHORT_DURATION,
        easing: 'ease-out',
        transform: false,
        opacity: true,
        blur: false,
        scale: false
      };
    } else if (fps < 45) {
      // Medium performance - some animations disabled
      return {
        duration: PERFORMANCE_CONFIG.animations.DEFAULT_DURATION,
        easing: 'ease-out',
        transform: true,
        opacity: true,
        blur: false,
        scale: true
      };
    } else {
      // High performance - all animations enabled
      return {
        duration: PERFORMANCE_CONFIG.animations.LONG_DURATION,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        transform: true,
        opacity: true,
        blur: true,
        scale: true
      };
    }
  }, [shouldReduceAnimations, isLowPerformance, fps]);

  const shouldAnimate = useMemo(() => {
    return !shouldReduceAnimations && fps > 20;
  }, [shouldReduceAnimations, fps]);

  const getAnimationClass = useMemo(() => {
    return (animationType: 'fade' | 'slide' | 'scale' | 'complex'): string => {
      if (!shouldAnimate) {
        return '';
      }

      // Convert duration to valid Tailwind CSS class
      const getDurationClass = (duration: number): string => {
        if (duration <= 150) return 'duration-150';
        if (duration <= 200) return 'duration-200';
        if (duration <= 300) return 'duration-300';
        if (duration <= 500) return 'duration-500';
        if (duration <= 700) return 'duration-700';
        if (duration <= 1000) return 'duration-1000';
        return 'duration-1000';
      };
      
      const baseClasses = `transition-all ${getDurationClass(animationConfig.duration)}`;
      
      switch (animationType) {
        case 'fade':
          return animationConfig.opacity 
            ? `${baseClasses} opacity-0 hover:opacity-100`
            : '';
            
        case 'slide':
          return animationConfig.transform 
            ? `${baseClasses} transform translate-x-0 hover:translate-x-1`
            : '';
            
        case 'scale':
          return animationConfig.scale 
            ? `${baseClasses} transform scale-100 hover:scale-105`
            : '';
            
        case 'complex':
          if (!animationConfig.transform || !animationConfig.scale) {
            return animationConfig.opacity ? `${baseClasses} opacity-100` : '';
          }
          
          const effects = [];
          if (animationConfig.transform) effects.push('translate-y-0 hover:-translate-y-1');
          if (animationConfig.scale) effects.push('scale-100 hover:scale-105');
          if (animationConfig.blur) effects.push('blur-0 hover:blur-sm');
          
          return `${baseClasses} transform ${effects.join(' ')}`;
          
        default:
          return '';
      }
    };
  }, [shouldAnimate, animationConfig]);

  return {
    animationConfig,
    shouldAnimate,
    getAnimationClass
  };
};