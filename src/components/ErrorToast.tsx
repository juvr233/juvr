import React, { useEffect } from 'react';
import { X, AlertCircle, Wifi, Shield, AlertTriangle } from 'lucide-react';
import type { AppError } from '../hooks/useErrorHandler';

interface ErrorToastProps {
  error: AppError;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ 
  error, 
  onClose, 
  autoClose = true, 
  duration = 5000 
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const getErrorIcon = () => {
    switch (error.type) {
      case 'network':
        return <Wifi className="h-5 w-5" />;
      case 'auth':
        return <Shield className="h-5 w-5" />;
      case 'validation':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getErrorColor = () => {
    switch (error.type) {
      case 'network':
        return 'border-orange-500 bg-orange-50 text-orange-800';
      case 'auth':
        return 'border-red-500 bg-red-50 text-red-800';
      case 'validation':
        return 'border-yellow-500 bg-yellow-50 text-yellow-800';
      default:
        return 'border-red-500 bg-red-50 text-red-800';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md p-4 border-l-4 rounded-lg shadow-lg animate-in slide-in-from-right duration-300 ${getErrorColor()}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getErrorIcon()}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">
            {error.message}
          </p>
          {error.details && (
            <p className="mt-1 text-xs opacity-80">
              {error.details}
            </p>
          )}
          {error.code && (
            <p className="mt-1 text-xs opacity-60">
              Error Code: {error.code}
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="inline-flex text-current hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
          >
            <span className="sr-only">Close</span>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorToast;