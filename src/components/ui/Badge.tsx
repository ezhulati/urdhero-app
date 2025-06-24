import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  animate = false,
  pulse = false
}) => {
  const baseClasses = `
    inline-flex items-center font-medium rounded-full
    backdrop-blur-sm border transition-all duration-200
  `;
  
  const variantClasses = {
    primary: 'bg-blue-100/80 text-blue-800 border-blue-200/50',
    secondary: 'bg-teal-100/80 text-teal-800 border-teal-200/50',
    success: 'bg-green-100/80 text-green-800 border-green-200/50',
    warning: 'bg-orange-100/80 text-orange-800 border-orange-200/50',
    danger: 'bg-red-100/80 text-red-800 border-red-200/50',
    neutral: 'bg-gray-100/80 text-gray-800 border-gray-200/50',
    gradient: 'bg-gradient-to-r from-blue-500 to-teal-500 text-white border-transparent shadow-md'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const classes = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${pulse ? 'animate-pulse' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const BadgeComponent = animate ? motion.span : 'span';

  return (
    <BadgeComponent
      className={classes}
      {...(animate && {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: "spring", stiffness: 500, damping: 30 }
      })}
    >
      {children}
    </BadgeComponent>
  );
};