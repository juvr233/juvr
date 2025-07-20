import type { AppError } from '../hooks/useErrorHandler';

/**
 * Parse API error response into standardized AppError format
 */
export const parseApiError = (error: any): AppError => {
  // Handle network errors
  if (!error.response) {
    return {
      message: 'Network connection failed. Please check your internet connection.',
      type: 'network',
      details: 'Unable to connect to server'
    };
  }

  const { status, data } = error.response;

  // Handle different HTTP status codes
  switch (status) {
    case 400:
      return {
        message: data?.message || 'Invalid request. Please check your input.',
        type: 'validation',
        details: data?.details || 'Bad request',
        code: status
      };
    
    case 401:
      return {
        message: 'Authentication failed. Please log in again.',
        type: 'auth',
        details: 'Unauthorized access',
        code: status
      };
    
    case 403:
      return {
        message: 'Access denied. You don\'t have permission for this action.',
        type: 'auth',
        details: 'Forbidden',
        code: status
      };
    
    case 404:
      return {
        message: 'The requested resource was not found.',
        type: 'api',
        details: 'Resource not found',
        code: status
      };
    
    case 429:
      return {
        message: 'Too many requests. Please wait a moment and try again.',
        type: 'api',
        details: 'Rate limit exceeded',
        code: status
      };
    
    case 500:
    case 502:
    case 503:
    case 504:
      return {
        message: 'Server error. Please try again later.',
        type: 'api',
        details: 'Internal server error',
        code: status
      };
    
    default:
      return {
        message: data?.message || 'An unexpected error occurred.',
        type: 'api',
        details: `HTTP ${status}`,
        code: status
      };
  }
};

/**
 * Extract user-friendly error message from various error types
 */
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.response?.data?.errors?.[0]?.message) {
    return error.response.data.errors[0].message;
  }
  
  return 'An unknown error occurred';
};

/**
 * Check if error is a network-related error
 */
export const isNetworkError = (error: any): boolean => {
  return !error.response || 
         error.code === 'NETWORK_ERROR' || 
         error.message?.includes('Network Error');
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: any): boolean => {
  return error?.response?.status === 401 || 
         error?.response?.status === 403;
};

/**
 * Create a standardized error object for common scenarios
 */
export const createError = {
  network: (details?: string): AppError => ({
    message: 'Network connection failed',
    type: 'network',
    details
  }),
  
  validation: (message: string, details?: string): AppError => ({
    message,
    type: 'validation',
    details
  }),
  
  auth: (message: string = 'Authentication required'): AppError => ({
    message,
    type: 'auth'
  }),
  
  generic: (message: string, details?: string): AppError => ({
    message,
    type: 'generic',
    details
  })
};