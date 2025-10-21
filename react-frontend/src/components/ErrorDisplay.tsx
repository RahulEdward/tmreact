import React from 'react';

interface ErrorDisplayProps {
  error: string | Error;
  title?: string;
  onRetry?: () => void;
  showDetails?: boolean;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  title = 'Error',
  onRetry,
  showDetails = false,
  className = ''
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'object' && error.stack ? error.stack : null;

  return (
    <div className={`bg-red-900/30 border border-red-600 text-red-400 px-4 py-3 rounded relative ${className}`} role="alert">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        
        <div className="ml-3 flex-1">
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm opacity-90 mt-1">{errorMessage}</p>
          
          {showDetails && errorStack && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-red-300 hover:text-red-200">
                Show Error Details
              </summary>
              <pre className="mt-1 text-xs bg-red-900/20 p-2 rounded overflow-auto max-h-32">
                {errorStack}
              </pre>
            </details>
          )}
        </div>
        
        {onRetry && (
          <div className="ml-3">
            <button
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;