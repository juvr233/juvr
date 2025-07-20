import { useState, useCallback } from 'react';

export interface AppError {
  message: string;
  type: 'network' | 'validation' | 'api' | 'auth' | 'generic';
  details?: string;
  code?: string | number;
}

interface UseErrorHandlerReturn {
  error: AppError | null;
  showError: (error: AppError | string) => void;
  clearError: () => void;
  isError: boolean;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState<AppError | null>(null);

  const showError = useCallback((errorInput: AppError | string) => {
    if (typeof errorInput === 'string') {
      setError({
        message: errorInput,
        type: 'generic'
      });
    } else {
      setError(errorInput);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    showError,
    clearError,
    isError: error !== null
  };
};