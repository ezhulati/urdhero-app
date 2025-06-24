import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Props for the Textarea component
 * @interface TextareaProps
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Label text for the textarea
   */
  label?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Helper text to display below the textarea
   */
  helperText?: string;
  
  /**
   * Maximum character count. If provided, shows a character counter.
   */
  maxLength?: number;
  
  /**
   * Whether to auto-resize the textarea as content grows
   * @default false
   */
  autoResize?: boolean;
  
  /**
   * Whether the textarea is part of a form with a dark background
   * @default false
   */
  darkMode?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Textarea component for multiline text input.
 * 
 * @example
 * // Basic usage
 * <Textarea
 *   label="Description"
 *   placeholder="Enter a description"
 * />
 * 
 * @example
 * // With error and character limit
 * <Textarea
 *   label="Feedback"
 *   error="Feedback is required"
 *   maxLength={200}
 *   placeholder="Tell us what you think"
 * />
 * 
 * @example
 * // Auto-resizing textarea
 * <Textarea
 *   label="Message"
 *   placeholder="Type your message"
 *   autoResize
 *   rows={3}
 * />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  maxLength,
  autoResize = false,
  darkMode = false,
  className = '',
  rows = 3,
  value = '',
  onChange,
  disabled,
  ...props
}, ref) => {
  // Create a ref if one is not passed
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const resolvedRef = (ref || textareaRef) as React.RefObject<HTMLTextAreaElement>;
  
  // Auto-resize functionality
  React.useEffect(() => {
    if (autoResize && resolvedRef.current) {
      const textarea = resolvedRef.current;
      
      const resizeTextarea = () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      };
      
      resizeTextarea();
      
      // Cleanup
      return () => {
        textarea.style.height = '';
      };
    }
  }, [value, autoResize, resolvedRef]);
  
  // Handle change to auto-resize and track character count
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e);
    }
    
    // Resize if needed
    if (autoResize && resolvedRef.current) {
      resolvedRef.current.style.height = 'auto';
      resolvedRef.current.style.height = `${resolvedRef.current.scrollHeight}px`;
    }
  };
  
  // Character count
  const charCount = typeof value === 'string' ? value.length : 0;
  const showCharCount = maxLength !== undefined;
  
  // Styles based on props
  const textareaClasses = `
    w-full rounded-lg transition-colors px-4 py-2.5
    ${darkMode 
      ? 'bg-gray-800 text-white border-gray-700 focus:border-blue-500' 
      : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'}
    ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
    ${error ? 'border-red-300 focus:border-red-500' : 'border'}
    focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500/20' : 'focus:ring-blue-500/20'}
    ${className}
  `;
  
  // Label styles
  const labelClasses = `
    block text-sm font-medium mb-1.5
    ${darkMode ? 'text-gray-300' : 'text-gray-700'}
    ${error ? 'text-red-500' : ''}
    ${disabled ? 'opacity-60' : ''}
  `;

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className={labelClasses}>
          {label}
          {props.required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      
      {/* Textarea */}
      <textarea
        ref={resolvedRef}
        className={textareaClasses}
        rows={rows}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        {...props}
      />
      
      {/* Footer: Error, Helper Text, Character Count */}
      <div className="mt-1.5 flex items-start justify-between">
        <div>
          {error && (
            <div className="text-sm text-red-500 flex items-start">
              <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {!error && helperText && (
            <div className="text-sm text-gray-500">{helperText}</div>
          )}
        </div>
        
        {showCharCount && (
          <div className={`text-xs ${
            maxLength && charCount >= maxLength * 0.9 
              ? charCount >= maxLength 
                ? 'text-red-500'
                : 'text-orange-500'
              : 'text-gray-500'
          }`}>
            {charCount}/{maxLength}
          </div>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';