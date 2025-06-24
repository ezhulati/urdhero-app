import React, { forwardRef } from 'react';
import { Eye, EyeOff, X, AlertCircle } from 'lucide-react';

/**
 * Props for the Input component
 * @interface InputProps
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label text for the input
   */
  label?: string;
  
  /**
   * Whether the input is in an error state
   */
  error?: string;
  
  /**
   * Additional helper text
   */
  helperText?: string;
  
  /**
   * Whether to show a clear button when the input has a value
   * @default false
   */
  clearable?: boolean;
  
  /**
   * Callback function when the clear button is clicked
   */
  onClear?: () => void;
  
  /**
   * Left-side icon
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Right-side icon
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Whether the input is part of a form with a dark background
   * @default false
   */
  darkMode?: boolean;
  
  /**
   * Whether to show the password toggle button (for password inputs)
   * @default false
   */
  showPasswordToggle?: boolean;
}

/**
 * Input component for form fields.
 * 
 * @example
 * // Basic usage
 * <Input label="Email" type="email" placeholder="Enter your email" />
 * 
 * @example
 * // With error state
 * <Input 
 *   label="Password" 
 *   type="password" 
 *   error="Password must be at least 8 characters" 
 *   showPasswordToggle
 * />
 * 
 * @example
 * // With icons
 * <Input
 *   label="Search"
 *   leftIcon={<Search className="w-4 h-4" />}
 *   clearable
 *   onClear={() => setValue('')}
 *   value={value}
 *   onChange={(e) => setValue(e.target.value)}
 * />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  clearable = false,
  onClear,
  leftIcon,
  rightIcon,
  className = '',
  type = 'text',
  darkMode = false,
  showPasswordToggle = false,
  disabled,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const hasValue = props.value !== undefined && props.value !== '';

  const getInputType = () => {
    if (type === 'password') {
      return showPassword ? 'text' : 'password';
    }
    return type;
  };

  // Styles based on props
  const baseInputClass = `
    w-full rounded-lg transition-colors
    ${leftIcon ? 'pl-10' : 'pl-4'}
    ${(rightIcon || (clearable && hasValue) || (type === 'password' && showPasswordToggle)) ? 'pr-10' : 'pr-4'}
    py-2.5
    ${darkMode 
      ? 'bg-gray-800 text-white border-gray-700 focus:border-blue-500' 
      : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'}
    ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
    ${error ? 'border-red-300 focus:border-red-500' : 'border'}
    focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500/20' : 'focus:ring-blue-500/20'}
  `;

  // Label styles
  const labelClass = `
    block text-sm font-medium mb-1.5
    ${darkMode ? 'text-gray-300' : 'text-gray-700'}
    ${error ? 'text-red-500' : ''}
    ${disabled ? 'opacity-60' : ''}
  `;

  return (
    <div className={className}>
      {label && (
        <label className={labelClass}>
          {label}
          {props.required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={getInputType()}
          className={`${baseInputClass} ${className}`}
          disabled={disabled}
          {...props}
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {clearable && hasValue && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          {type === 'password' && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
          
          {rightIcon && rightIcon}
        </div>
      </div>
      
      {(error || helperText) && (
        <div className={`mt-1.5 text-sm ${error ? 'text-red-500' : 'text-gray-500'} flex items-start`}>
          {error && (
            <>
              <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </>
          )}
          {!error && helperText && (
            <span>{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';