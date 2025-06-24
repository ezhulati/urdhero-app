import React from 'react';

/**
 * Props for the SkeletonLoader component
 * @interface SkeletonLoaderProps
 */
export interface SkeletonLoaderProps {
  /**
   * Number of lines to display
   * @default 3
   */
  lines?: number;
  
  /**
   * Height of each skeleton line
   * @default 'md'
   */
  height?: 'sm' | 'md' | 'lg';
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * SkeletonLoader component for displaying placeholder content while data is loading.
 * 
 * @example
 * // Basic usage
 * <SkeletonLoader />
 * 
 * @example
 * // Custom configuration
 * <SkeletonLoader lines={5} height="sm" className="mb-4" />
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  lines = 3,
  height = 'md',
  className = ''
}) => {
  const heightClasses = {
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8'
  };

  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 rounded ${heightClasses[height]} mb-2 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

/**
 * MenuItemSkeleton component for displaying a placeholder for a menu item while loading
 */
export const MenuItemSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
      <div className="flex space-x-4">
        <div className="w-20 h-20 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="flex space-x-2 mt-3">
            <div className="h-6 bg-gray-200 rounded-full w-16" />
            <div className="h-6 bg-gray-200 rounded-full w-20" />
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="h-6 bg-gray-200 rounded w-16" />
          <div className="h-9 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  );
};

/**
 * OrderCardSkeleton component for displaying a placeholder for an order card while loading
 */
export const OrderCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 bg-gray-200 rounded w-24" />
        <div className="h-6 bg-gray-200 rounded-full w-16" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-5 bg-gray-200 rounded w-12" />
      </div>
    </div>
  );
};