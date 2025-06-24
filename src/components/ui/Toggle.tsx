import React from 'react';
import { motion } from 'framer-motion';

/**
 * Props for the Toggle component
 * @interface ToggleProps
 */
export interface ToggleProps {
  /**
   * Whether the toggle is checked/on
   */
  checked: boolean;
  
  /**
   * Callback function when the toggle is changed
   */
  onChange: (checked: boolean) => void;
  
  /**
   * Label for the toggle
   */
  label?: string;
  
  /**
   * Size of the toggle
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Color of the toggle when checked
   * @default 'blue'
   */
  color?: 'blue' | 'green' | 'purple' | 'red' | 'orange';
  
  /**
   * Whether the toggle is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * ID for the toggle input
   */
  id?: string;
}

/**
 * Toggle component for boolean inputs.
 * 
 * @example
 * // Basic usage
 * <Toggle
 *   checked={isEnabled}
 *   onChange={setIsEnabled}
 *   label="Enable feature"
 * />
 * 
 * @example
 * // Custom appearance
 * <Toggle
 *   checked={darkMode}
 *   onChange={setDarkMode}
 *   label="Dark mode"
 *   size="lg"
 *   color="purple"
 * />
 */
export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  size = 'md',
  color = 'blue',
  disabled = false,
  className = '',
  id
}) => {
  // Calculate sizes based on the size prop
  const getToggleSizes = () => {
    switch (size) {
      case 'sm':
        return {
          toggleWidth: 'w-8',
          toggleHeight: 'h-4',
          knobSize: 'w-3 h-3',
          knobTranslate: 'translate-x-4',
          textSize: 'text-sm'
        };
      case 'lg':
        return {
          toggleWidth: 'w-14',
          toggleHeight: 'h-7',
          knobSize: 'w-5 h-5',
          knobTranslate: 'translate-x-7',
          textSize: 'text-base'
        };
      case 'md':
      default:
        return {
          toggleWidth: 'w-11',
          toggleHeight: 'h-6',
          knobSize: 'w-4 h-4',
          knobTranslate: 'translate-x-5',
          textSize: 'text-sm'
        };
    }
  };
  
  // Get colors based on the color prop
  const getToggleColors = () => {
    if (disabled) {
      return 'bg-gray-200';
    }
    
    if (!checked) {
      return 'bg-gray-300';
    }
    
    switch (color) {
      case 'green':
        return 'bg-green-600';
      case 'purple':
        return 'bg-purple-600';
      case 'red':
        return 'bg-red-600';
      case 'orange':
        return 'bg-orange-600';
      case 'blue':
      default:
        return 'bg-blue-600';
    }
  };
  
  const { toggleWidth, toggleHeight, knobSize, knobTranslate, textSize } = getToggleSizes();
  const toggleColor = getToggleColors();
  const generatedId = `toggle-${Math.random().toString(36).substring(2, 9)}`;
  const toggleId = id || generatedId;

  return (
    <div className={`flex items-center ${className}`}>
      <label htmlFor={toggleId} className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
        <span className="relative">
          <input
            type="checkbox"
            id={toggleId}
            className="sr-only"
            checked={checked}
            disabled={disabled}
            onChange={(e) => !disabled && onChange(e.target.checked)}
          />
          <motion.div
            className={`block rounded-full ${toggleWidth} ${toggleHeight} ${toggleColor} transition-colors`}
            initial={false}
            animate={{ backgroundColor: checked ? undefined : undefined }}
          />
          <motion.div
            className={`absolute top-[2px] left-[2px] bg-white rounded-full shadow-md transform ${knobSize}`}
            initial={false}
            animate={{
              x: checked ? (size === 'lg' ? 28 : size === 'md' ? 20 : 16) - (size === 'lg' ? 7 : size === 'md' ? 6 : 5) : 0
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </span>
        {label && (
          <span className={`ml-3 ${textSize} font-medium text-gray-900`}>
            {label}
          </span>
        )}
      </label>
    </div>
  );
};