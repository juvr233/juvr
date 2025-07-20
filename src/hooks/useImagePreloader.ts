import { useState, useEffect, useCallback, useRef } from 'react';

export interface ImagePreloaderState {
  isLoading: boolean;
  loadedCount: number;
  totalCount: number;
  failedCount: number;
  progress: number; // 0-100
}

interface UseImagePreloaderOptions {
  batchSize?: number;
  delay?: number;
  onProgress?: (state: ImagePreloaderState) => void;
  onComplete?: (state: ImagePreloaderState) => void;
}

export const useImagePreloader = (
  imageUrls: string[],
  options: UseImagePreloaderOptions = {}
): ImagePreloaderState => {
  const {
    batchSize = 5,
    delay = 100,
    onProgress,
    onComplete
  } = options;

  const [state, setState] = useState<ImagePreloaderState>({
    isLoading: false,
    loadedCount: 0,
    totalCount: imageUrls.length,
    failedCount: 0,
    progress: 0
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const updateState = useCallback((updates: Partial<ImagePreloaderState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      newState.progress = newState.totalCount > 0 
        ? Math.round(((newState.loadedCount + newState.failedCount) / newState.totalCount) * 100)
        : 0;
      
      onProgress?.(newState);
      
      if (newState.loadedCount + newState.failedCount === newState.totalCount && newState.isLoading) {
        newState.isLoading = false;
        onComplete?.(newState);
      }
      
      return newState;
    });
  }, [onProgress, onComplete]);

  const preloadImage = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (abortControllerRef.current?.signal.aborted) {
        reject(new Error('Aborted'));
        return;
      }

      const img = new Image();
      
      const handleLoad = () => {
        cleanup();
        updateState(prev => ({
          loadedCount: prev.loadedCount + 1
        }));
        resolve();
      };

      const handleError = () => {
        cleanup();
        updateState(prev => ({
          failedCount: prev.failedCount + 1
        }));
        if (process.env.NODE_ENV === 'development') {
          console.log(`Failed to preload image: ${url}`);
        }
        reject(new Error(`Failed to load ${url}`));
      };

      const handleAbort = () => {
        cleanup();
        reject(new Error('Aborted'));
      };

      const cleanup = () => {
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleError);
        abortControllerRef.current?.signal.removeEventListener('abort', handleAbort);
      };

      img.addEventListener('load', handleLoad, { once: true });
      img.addEventListener('error', handleError, { once: true });
      abortControllerRef.current?.signal.addEventListener('abort', handleAbort, { once: true });

      img.src = url;
    });
  }, [updateState]);

  const preloadBatch = useCallback(async (batch: string[]) => {
    try {
      await Promise.allSettled(batch.map(url => preloadImage(url)));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Batch preload error:', error);
      }
    }
  }, [preloadImage]);

  useEffect(() => {
    if (imageUrls.length === 0) {
      setState({
        isLoading: false,
        loadedCount: 0,
        totalCount: 0,
        failedCount: 0,
        progress: 100
      });
      return;
    }

    // Reset state and start preloading
    setState(prev => ({
      ...prev,
      isLoading: true,
      loadedCount: 0,
      totalCount: imageUrls.length,
      failedCount: 0,
      progress: 0
    }));

    // Create abort controller for cleanup
    abortControllerRef.current = new AbortController();

    // Process images in batches with delays
    const processBatches = async () => {
      const batches: string[][] = [];
      for (let i = 0; i < imageUrls.length; i += batchSize) {
        batches.push(imageUrls.slice(i, i + batchSize));
      }

      for (let i = 0; i < batches.length; i++) {
        if (abortControllerRef.current?.signal.aborted) break;
        
        await preloadBatch(batches[i]);
        
        // Add delay between batches (except for the last one)
        if (i < batches.length - 1 && delay > 0) {
          await new Promise(resolve => {
            const timeout = setTimeout(resolve, delay);
            timeoutsRef.current.push(timeout);
          });
        }
      }
    };

    processBatches();

    // Cleanup function
    return () => {
      abortControllerRef.current?.abort();
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current = [];
    };
  }, [imageUrls, batchSize, delay, preloadBatch]);

  return state;
};