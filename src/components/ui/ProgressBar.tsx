import React from 'react';

/**
 * Props for the ProgressBar component
 * @interface ProgressBarProps
 */
export interface ProgressBarProps {
  /**
   * Progress value from 0 to 100
   */
  progress: number;
  
  /**
   * Color of the progress bar
   * @default 'blue'
   */
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  
  /**
   * Size of the progress bar
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether to show the percentage text
   * @default false
   */
  showPercentage?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ProgressBar component for displaying progress or completion status.
 * 
 * @example
 * // Basic usage
 * <ProgressBar progress={75} />
 * 
 * @example
 * // Success progress with percentage
 * <ProgressBar progress={100} color="green" showPercentage />
 * 
 * @example
 * // Custom sized progress bar
 * <ProgressBar progress={33} color="orange" size="lg" />
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'blue',
  size = 'md',
  showPercentage = false,
  className = ''
}) => {
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    orange: 'bg-orange-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600'
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={className}>
      {showPercentage && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};