import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-semibold rounded-xl
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    relative overflow-hidden active:scale-[0.98]
    shadow-sm hover:shadow-md active:shadow-sm
  `;
  
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900
      text-white focus:ring-blue-500 border-0
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/10 before:to-white/0
      before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
    `,
    secondary: `
      bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800
      text-white focus:ring-indigo-500 border-0
    `,
    outline: `
      border-2 border-blue-700 text-blue-700 bg-white hover:bg-blue-50
      focus:ring-blue-500 hover:border-blue-800 hover:text-blue-800
    `,
    ghost: `
      text-gray-600 hover:text-gray-900 hover:bg-gray-100/80
      focus:ring-gray-500 backdrop-blur-sm border-0
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800
      text-white focus:ring-red-500 border-0
    `,
    success: `
      bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800
      text-white focus:ring-green-500 border-0
    `
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5 min-h-[36px]',
    md: 'px-4 py-2.5 text-base gap-2 min-h-[44px]',
    lg: 'px-6 py-3 text-lg gap-2 min-h-[52px]',
    xl: 'px-8 py-4 text-xl gap-3 min-h-[60px]'
  };

  const classes = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="opacity-0">{children}</span>
        </>
      );
    }

    return (
      <>
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">
            {icon}
          </span>
        )}
        <span className="flex-shrink-0">{children}</span>
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">
            {icon}
          </span>
        )}
      </>
    );
  };

  return (
    <motion.button
      className={classes}
      disabled={disabled || loading}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {renderContent()}
    </motion.button>
  );
};