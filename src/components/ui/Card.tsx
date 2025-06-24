import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  glass?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  hover = false,
  glass = false,
  gradient = false,
  onClick
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const baseClasses = `
    ${glass 
      ? 'bg-white/90 backdrop-blur-lg border border-white/20' 
      : gradient
        ? 'bg-gradient-to-br from-white to-gray-50/50'
        : 'bg-white'
    }
    rounded-2xl border border-gray-100/60 overflow-hidden
    ${onClick ? 'cursor-pointer' : ''}
  `;

  const interactiveClasses = hover ? `
    transition-all duration-300 ease-out
    hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.01]
    active:scale-[0.99] active:transition-transform active:duration-75
  ` : 'transition-shadow duration-200';

  const classes = `
    ${baseClasses} 
    ${paddingClasses[padding]} 
    ${shadowClasses[shadow]} 
    ${interactiveClasses} 
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const CardComponent = onClick ? motion.div : 'div';

  return (
    <CardComponent
      className={classes}
      onClick={onClick}
      {...(onClick && {
        whileTap: { scale: 0.99 },
        whileHover: { scale: 1.01, y: -2 }
      })}
    >
      {children}
    </CardComponent>
  );
};