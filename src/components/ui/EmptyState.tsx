import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';

/**
 * Props for the EmptyState component
 * @interface EmptyStateProps
 */
export interface EmptyStateProps {
  /**
   * Icon or emoji to display
   * @default '📭'
   */
  icon?: string;
  
  /**
   * Main title for the empty state
   */
  title: string;
  
  /**
   * Detailed description explaining the empty state
   */
  description: string;
  
  /**
   * Optional label for the action button
   */
  actionLabel?: string;
  
  /**
   * Callback function when the action button is clicked
   */
  onAction?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Size variant of the empty state
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * EmptyState component for displaying when a list or content area has no data.
 * 
 * @example
 * // Basic usage
 * <EmptyState
 *   title="No results found"
 *   description="Try adjusting your search or filters to find what you're looking for."
 * />
 * 
 * @example
 * // With action button
 * <EmptyState
 *   icon="🔍"
 *   title="No items in cart"
 *   description="Add items to your cart to see them here."
 *   actionLabel="Browse menu"
 *   onAction={() => navigate('/menu')}
 * />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  actionLabel,
  onAction,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: {
      container: 'py-8',
      iconSize: 'w-12 h-12 text-2xl',
      titleSize: 'text-lg',
      descSize: 'text-sm',
      maxWidth: 'max-w-xs'
    },
    md: {
      container: 'py-12',
      iconSize: 'w-20 h-20 text-3xl',
      titleSize: 'text-xl',
      descSize: 'text-base',
      maxWidth: 'max-w-sm'
    },
    lg: {
      container: 'py-16',
      iconSize: 'w-24 h-24 text-4xl',
      titleSize: 'text-2xl',
      descSize: 'text-lg',
      maxWidth: 'max-w-md'
    }
  };

  const { container, iconSize, titleSize, descSize, maxWidth } = sizeClasses[size];

  return (
    <motion.div
      className={`text-center ${container} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`${iconSize} bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
      >
        <span className={iconSize.includes('text-2xl') ? 'text-2xl' : iconSize.includes('text-3xl') ? 'text-3xl' : 'text-4xl'}>
          {icon}
        </span>
      </motion.div>
      
      <motion.h3
        className={`${titleSize} font-semibold text-gray-900 mb-3`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h3>
      
      <motion.p
        className={`${descSize} text-gray-600 mb-6 ${maxWidth} mx-auto leading-relaxed`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {description}
      </motion.p>
      
      {actionLabel && onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={onAction} className="mx-auto">
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};