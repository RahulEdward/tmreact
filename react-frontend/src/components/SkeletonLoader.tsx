import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'text' | 'rectangular' | 'circular' | 'card' | 'table';
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width = '100%',
  height,
  lines = 1,
  className = ''
}) => {
  const baseClasses = 'animate-pulse bg-gray-700 rounded';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4';
      case 'rectangular':
        return '';
      case 'circular':
        return 'rounded-full';
      case 'card':
        return 'h-48';
      case 'table':
        return 'h-12';
      default:
        return 'h-4';
    }
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={className}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()} ${index < lines - 1 ? 'mb-2' : ''}`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : style.width // Last line is shorter
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={style}
    />
  );
};

// Predefined skeleton components for common use cases
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="space-y-3">
    {/* Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, index) => (
        <SkeletonLoader key={`header-${index}`} variant="text" height="20px" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonLoader key={`cell-${rowIndex}-${colIndex}`} variant="text" />
        ))}
      </div>
    ))}
  </div>
);

export const CardSkeleton: React.FC = () => (
  <div className="bg-dark/80 backdrop-blur-lg p-6 rounded-lg border border-gray-800">
    <SkeletonLoader variant="text" width="60%" height="24px" className="mb-4" />
    <SkeletonLoader variant="text" lines={3} className="mb-4" />
    <div className="flex gap-3">
      <SkeletonLoader variant="rectangular" width="80px" height="32px" />
      <SkeletonLoader variant="rectangular" width="80px" height="32px" />
    </div>
  </div>
);

export const StatsSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="border border-gray-500 bg-gray-800/40 p-4 md:p-6 rounded-lg">
        <SkeletonLoader variant="text" width="80%" height="28px" className="mb-2" />
        <SkeletonLoader variant="text" width="60%" height="16px" />
      </div>
    ))}
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="pt-1">
    <div className="flex flex-wrap -m-4">
      <div className="w-full px-4">
        <SkeletonLoader variant="text" width="300px" height="32px" className="mb-4" />
        <div className="bg-dark/80 p-5 rounded-lg shadow-lg border border-gray-800">
          <StatsSkeleton />
        </div>
      </div>
    </div>
  </div>
);

export default SkeletonLoader;