import { AxiosError } from 'axios';

export interface AppError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export class ErrorHandler {
  static handleApiError(error: unknown): AppError {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      
      switch (status) {
        case 401:
          return {
            message: 'Authentication required. Please log in again.',
            code: 'UNAUTHORIZED',
            status: 401
          };
        case 403:
          return {
            message: 'Access denied. You don\'t have permission to perform this action.',
            code: 'FORBIDDEN',
            status: 403
          };
        case 404:
          return {
            message: 'The requested resource was not found.',
            code: 'NOT_FOUND',
            status: 404
          };
        case 429:
          return {
            message: 'Too many requests. Please wait a moment and try again.',
            code: 'RATE_LIMITED',
            status: 429
          };
        case 500:
          return {
            message: 'Internal server error. Please try again later.',
            code: 'SERVER_ERROR',
            status: 500
          };
        case 502:
        case 503:
        case 504:
          return {
            message: 'Service temporarily unavailable. Please try again later.',
            code: 'SERVICE_UNAVAILABLE',
            status: status
          };
        default:
          return {
            message: message || 'An unexpected error occurred.',
            code: 'API_ERROR',
            status: status,
            details: error.response?.data
          };
      }
    }
    
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'CLIENT_ERROR'
      };
    }
    
    return {
      message: 'An unknown error occurred.',
      code: 'UNKNOWN_ERROR'
    };
  }

  static handleNetworkError(): AppError {
    return {
      message: 'Network connection failed. Please check your internet connection and try again.',
      code: 'NETWORK_ERROR'
    };
  }

  static handleValidationError(field: string, message: string): AppError {
    return {
      message: `${field}: ${message}`,
      code: 'VALIDATION_ERROR'
    };
  }

  static isRetryableError(error: AppError): boolean {
    const retryableCodes = ['NETWORK_ERROR', 'SERVICE_UNAVAILABLE', 'SERVER_ERROR', 'RATE_LIMITED'];
    return retryableCodes.includes(error.code || '');
  }

  static getRetryDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
    return Math.min(1000 * Math.pow(2, attempt), 30000);
  }

  static shouldShowNotification(error: AppError): boolean {
    // Don't show notifications for validation errors or 401s (handled by auth system)
    const silentCodes = ['VALIDATION_ERROR', 'UNAUTHORIZED'];
    return !silentCodes.includes(error.code || '');
  }

  static formatErrorForUser(error: AppError): string {
    // Return user-friendly error messages
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Connection problem. Please check your internet and try again.';
      case 'UNAUTHORIZED':
        return 'Please log in to continue.';
      case 'FORBIDDEN':
        return 'You don\'t have permission for this action.';
      case 'NOT_FOUND':
        return 'The requested information was not found.';
      case 'RATE_LIMITED':
        return 'Please wait a moment before trying again.';
      case 'SERVER_ERROR':
        return 'Server error. Please try again in a few minutes.';
      case 'SERVICE_UNAVAILABLE':
        return 'Service is temporarily unavailable.';
      default:
        return error.message || 'Something went wrong. Please try again.';
    }
  }
}

export default ErrorHandler;