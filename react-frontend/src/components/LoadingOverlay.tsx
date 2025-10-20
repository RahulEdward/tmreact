import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  children: React.ReactNode;
  className?: string;
  overlay?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  text = 'Loading...',
  children,
  className = '',
  overlay = true
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  if (overlay) {
    return (
      <div className={`relative ${className}`}>
        {children}
        <div className="absolute inset-0 bg-dark/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
          <div className="bg-dark/80 backdrop-blur-lg p-6 rounded-lg border border-gray-800 shadow-lg">
            <LoadingSpinner size="lg" text={text} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center min-h-64 ${className}`}>
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};

export default LoadingOverlay;